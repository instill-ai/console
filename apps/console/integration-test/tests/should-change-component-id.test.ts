import { test, expect } from "@playwright/test";
import { PipelineBuilderPage } from "../pages/pipeline-builder.page";
import { getSelectContent } from "../helpers/component-helpers/select";
import { DataTestID } from "../data-testid";
import { createPipeline, deletePipeline } from "../helpers/actions/pipeline";
import { deleteConnector } from "../helpers/actions/connector";

export function shouldChangeComponentID() {
  const pipelineID = "change_component_node_id";
  const stConnectorID = "st_1";
  const oldSTComponentID = "stability_0";
  const newSTComponentID = "st_test";
  const startFieldID = "prompts";
  const endFieldID = "result";
  const endFieldValue = "${" + oldSTComponentID + ".output.images}";

  test.describe.serial("Pipeline builder component ID test", () => {
    test("should create pipeline", async ({ page }) => {
      await createPipeline(page, pipelineID);
    });

    test("should setup basic pipeline with start, end and st component", async ({
      page,
    }) => {
      const pipelineBuilderPage = new PipelineBuilderPage(page, pipelineID);
      await pipelineBuilderPage.goto();

      // Add text array field in start operator
      await pipelineBuilderPage.startNodeAddFieldButton.click();
      await pipelineBuilderPage.startNode
        .getByRole("button", { name: "Multiple Texts" })
        .click();
      await pipelineBuilderPage.startNode
        .getByPlaceholder("My prompt")
        .fill(startFieldID);
      await pipelineBuilderPage.startNodeSaveFieldButton.click();

      // Add a new ST component
      await pipelineBuilderPage.selectComponentDialogTrigger.click();
      await page
        .getByTestId(DataTestID.SelectComponentDialog)
        .getByText("Stability AI", { exact: true })
        .click();
      const stComponent = page.locator(`[data-id='${oldSTComponentID}']`);
      await stComponent
        .getByRole("button", { name: "Create connector" })
        .click();
      const setupComponentDialog = page.getByTestId(
        DataTestID.setupComponentDialog
      );
      await setupComponentDialog
        .locator("input[name='id']")
        .fill(stConnectorID);
      await setupComponentDialog
        .locator("input[name='api_key']")
        .fill(stConnectorID);
      setupComponentDialog.getByRole("button", { name: "Save" }).click();

      // Configure new ST component
      const stTaskSelectTrigger = stComponent.getByLabel(
        "Stability AI Component"
      );
      await stTaskSelectTrigger.click();
      const stTaskContent = await getSelectContent(page, stTaskSelectTrigger);
      await stTaskContent.getByText("TASK_TEXT_TO_IMAGE").click();
      const stEngineSelectTrigger = stComponent.getByLabel("Engine");
      await stEngineSelectTrigger.click();
      const stEngineContent = await getSelectContent(
        page,
        stEngineSelectTrigger
      );
      await stEngineContent.getByText("stable-diffusion-xl-1024-v1-0").click();
      await page
        .locator("input[name='input.prompts']")
        .fill("${start." + startFieldID + "}");

      // Create output result field in the end operator
      await pipelineBuilderPage.endNodeAddFieldButton.click();
      await pipelineBuilderPage.endNode
        .getByPlaceholder("My prompt")
        .fill(endFieldID);
      await pipelineBuilderPage.endNode
        .locator(`textarea[name='value']`)
        .fill(endFieldValue);
      await pipelineBuilderPage.endNodeSaveFieldButton.click();

      // Node updater is time-based, we need to await a bit here
      await page.waitForTimeout(1000);
      await pipelineBuilderPage.expectToSave();

      // expect conection line is on pipeline-builder
      await expect(
        page.locator(`g[aria-label='Edge from start to ${oldSTComponentID}']`)
      ).toHaveCount(1);
      await expect(
        page.locator(`g[aria-label='Edge from ${oldSTComponentID} to end']`)
      ).toHaveCount(1);
    });

    test("should correctly change component's ID", async ({ page }) => {
      const pipelineBuilderPage = new PipelineBuilderPage(page, pipelineID);
      await pipelineBuilderPage.goto();

      // Change the component's ID
      const stComponent = page.locator(`[data-id='${oldSTComponentID}']`);
      await stComponent.locator("input[name='nodeID']").fill(newSTComponentID);
      await page.mouse.click(10, 10);
      const newStComponent = page.locator(`[data-id='${newSTComponentID}']`);

      // expect connection line is not on pipeline-builder
      await expect(
        page.locator(`g[aria-label='Edge from start to ${oldSTComponentID}']`)
      ).toHaveCount(0);
      await expect(
        page.locator(`g[aria-label='Edge from start to ${newSTComponentID}']`)
      ).toHaveCount(1);
      await expect(
        page.locator(`g[aria-label='Edge from ${oldSTComponentID} to end']`)
      ).toHaveCount(0);

      // expect connection line is not on pipeline-builder after save
      await pipelineBuilderPage.expectToSave();
      await page.reload();
      await expect(
        page.locator(`g[aria-label='Edge from start to ${oldSTComponentID}']`)
      ).toHaveCount(0);
      await expect(
        page.locator(`g[aria-label='Edge from start to ${newSTComponentID}']`)
      ).toHaveCount(1);
      await expect(
        page.locator(`g[aria-label='Edge from ${oldSTComponentID} to end']`)
      ).toHaveCount(0);
      await expect(newStComponent.locator("input[name='nodeID']")).toHaveValue(
        newSTComponentID
      );
    });

    test("should delete pipeline", async ({ page }) => {
      await deletePipeline(page, pipelineID);
    });

    test("should delete st connector", async ({ page }) => {
      await deleteConnector(page, stConnectorID);
    });
  });
}
