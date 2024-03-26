import { test } from "@playwright/test";
import { PipelineOverviewPage } from "../pages/pipeline-overview.page";
import { PipelineBuilderPage } from "../pages/pipeline-builder.page";
import { createPipeline, deletePipeline } from "../helpers/actions/pipeline";

export function shouldUnmarshalJSONInput() {
  const pipelineID = "unmarshal_test";
  const startFieldID = "json";
  const jsonValue = {
    foo: "bar",
    hello: 1,
  };
  const endFieldID = "result";
  const endFieldValue = "${start." + startFieldID + "}";

  test.describe.serial("Unmarshal pipeline builder input test", () => {
    test("should create pipeline", async ({ page }) => {
      await createPipeline(page, pipelineID);
    });

    test("should compose correct pipeline and trigger in builder", async ({
      page,
    }) => {
      const pipelineBuilderPage = new PipelineBuilderPage(page, pipelineID);
      await pipelineBuilderPage.goto();

      // Add JSON field in start operator
      await pipelineBuilderPage.startNodeAddFieldButton.click();
      await pipelineBuilderPage.startNode
        .getByRole("button", { name: "JSON" })
        .click();
      await pipelineBuilderPage.startNode
        .getByPlaceholder("My prompt")
        .fill(startFieldID);
      await pipelineBuilderPage.startNodeSaveFieldButton.click();

      // Create output result field in the end operator
      await pipelineBuilderPage.endNodeAddFieldButton.click();
      await pipelineBuilderPage.endNode
        .getByPlaceholder("My prompt")
        .fill(endFieldID);
      await pipelineBuilderPage.endNode
        .locator(`textarea[name='value']`)
        .fill(endFieldValue);
      await pipelineBuilderPage.endNodeSaveFieldButton.click();
      await pipelineBuilderPage.mainSaveButton.click();

      // Fill in value in the start operator JSON field
      await pipelineBuilderPage.startNode
        .locator(`textarea[name='${startFieldID}']`)
        .fill(JSON.stringify(jsonValue));

      // Expect result correctly show up
      await Promise.all([
        page.getByText(JSON.stringify(jsonValue)).waitFor({ state: "visible" }),
        pipelineBuilderPage.mainRunButton.click(),
      ]);
    });

    test("should correctly trigger in pipelien overview", async ({ page }) => {
      const pipelineOverviewPage = new PipelineOverviewPage(page, pipelineID);
      await pipelineOverviewPage.goto();

      // Fill in value in the start operator JSON field
      await pipelineOverviewPage.inputForm
        .locator(`textarea[name='${startFieldID}']`)
        .fill(JSON.stringify(jsonValue));

      // Expect result correctly show up
      await Promise.all([
        page.getByText(JSON.stringify(jsonValue)).waitFor({ state: "visible" }),
        pipelineOverviewPage.runButton.click(),
      ]);
    });

    test("should delete pipeline", async ({ page }) => {
      await deletePipeline(page, pipelineID);
    });
  });
}
