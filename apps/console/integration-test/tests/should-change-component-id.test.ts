import { test, expect } from "@playwright/test";
import { PipelineListPage } from "../pages/pipeline-list";
import { PipelineOverviewPage } from "../pages/pipeline-overview.page";
import { PipelineBuilderPage } from "../pages/pipeline-builder.page";
import { getDropdownContent } from "../helpers/component-helpers/dropdown";
import { getSelectContent } from "../helpers/component-helpers/select";
import { DataTestID } from "../data-testid";
import { ConnectorListPage } from "../pages/connector-list";

test("should change component ID correctly in pipeline-builder", async ({
  page,
}) => {
  const pipelineID = "change_component_node_id";
  const pipelineListPage = new PipelineListPage(page);
  const connectorListPage = new ConnectorListPage(page);
  const pipelineBuilderPage = new PipelineBuilderPage(page, pipelineID);
  const pipelineOverviewPage = new PipelineOverviewPage(page, pipelineID);
  const stConnectorID = "st_1";
  const oldSTComponentID = "stability_0";
  const newSTComponentID = "st_test";
  const startFieldID = "prompts";
  const endFieldID = "result";
  const endFieldValue = "${" + oldSTComponentID + ".output.images}";

  await pipelineListPage.goto();
  await pipelineListPage.createPipelineButton.click();

  // Create new pipeline
  await pipelineListPage.createPipelineDialogIDField.fill(pipelineID);
  await Promise.all([
    pipelineBuilderPage.expectOnIt(),
    pipelineListPage.createPipelineDialogCreateButton.click(),
  ]);

  // Add text array field in start operator
  await pipelineBuilderPage.startNodeAddFieldButton.click();
  await pipelineBuilderPage.startNode
    .getByRole("button", { name: "Multiple Texts" })
    .click();
  await pipelineBuilderPage.startNode
    .getByPlaceholder("My prompt")
    .fill(startFieldID);
  await pipelineBuilderPage.startNodeSaveFieldButton.click();

  // Add a new ai component
  await pipelineBuilderPage.selectComponentDialogTrigger.click();
  await page
    .getByTestId(DataTestID.SelectComponentDialog)
    .getByText("Stability AI", { exact: true })
    .click();
  const stComponent = page.locator(`[data-id='${oldSTComponentID}']`);
  await stComponent.getByRole("button", { name: "Create connector" }).click();
  const setupComponentDialog = page.getByTestId(
    DataTestID.setupComponentDialog
  );
  await setupComponentDialog.locator("input[name='id']").fill(stConnectorID);
  await setupComponentDialog
    .locator("input[name='api_key']")
    .fill(stConnectorID);
  setupComponentDialog.getByRole("button", { name: "Save" }).click();

  // Set up new ST component
  const stTaskSelectTrigger = stComponent.getByLabel("Stability AI Component");
  await stTaskSelectTrigger.click();
  const stTaskContent = await getSelectContent(page, stTaskSelectTrigger);
  await stTaskContent.getByText("TASK_TEXT_TO_IMAGE").click();
  const stEngineSelectTrigger = stComponent.getByLabel("Engine");
  await stEngineSelectTrigger.click();
  const stEngineContent = await getSelectContent(page, stEngineSelectTrigger);
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
  await pipelineBuilderPage.mainSaveButton.click();

  // expect conection line is on pipeline-builder
  await expect(
    page.locator(`g[aria-label='Edge from start to ${oldSTComponentID}']`)
  ).toHaveCount(1);
  await expect(
    page.locator(`g[aria-label='Edge from ${oldSTComponentID} to end']`)
  ).toHaveCount(1);

  // Change the component's ID
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
  await pipelineBuilderPage.mainSaveButton.click();
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

  // go to pipeline overview page
  await pipelineOverviewPage.goto();

  // Delete this pipeline
  const moreOptionsContent = await getDropdownContent(
    page,
    pipelineOverviewPage.moreOptionsButton
  );
  await Promise.all([
    moreOptionsContent.waitFor({ state: "visible" }),
    pipelineOverviewPage.moreOptionsButton.click(),
  ]);
  await moreOptionsContent.getByText("Delete").click();
  const deletePipelineDialog = page.getByTestId(
    DataTestID.deleteResourceDialog
  );
  await deletePipelineDialog.locator("input#confirmationCode").fill(pipelineID);

  await Promise.all([
    pipelineListPage.expectOnIt(),
    deletePipelineDialog.getByRole("button", { name: "Delete" }).click(),
  ]);

  // Delete st connector
  await connectorListPage.goto();
  await page.getByTestId(`${stConnectorID}-delete-button`).click();
  const deleteConnectorDialog = page.getByTestId(
    DataTestID.deleteResourceDialog
  );
  await deleteConnectorDialog
    .locator("input#confirmationCode")
    .fill(stConnectorID);
  await deleteConnectorDialog.getByRole("button", { name: "Delete" }).click();
  await expect(page.getByText(stConnectorID)).toHaveCount(0);
});
