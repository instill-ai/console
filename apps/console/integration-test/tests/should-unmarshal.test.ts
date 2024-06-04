import { test } from "@playwright/test";
import { PipelineOverviewPage } from "../pages/pipeline-overview.page";
import { PipelineBuilderPage } from "../pages/pipeline-builder.page";
import { createPipeline, deletePipeline } from "../helpers/actions/pipeline";

export function shouldUnmarshalJSONInput() {
  const pipelineID = "unmarshal_test";
  const startFieldKey = "json";
  const jsonValue = {
    foo: "bar",
    hello: 1,
  };
  const endFieldKey = "result";
  const endFieldValue = "${variable." + startFieldKey + "}";

  test.describe.serial("Unmarshal pipeline builder input test", () => {
    test("should create pipeline", async ({ page }) => {
      await createPipeline(page, pipelineID);
    });

    test("should compose correct pipeline and variable in builder", async ({
      page,
    }) => {
      const pipelineBuilderPage = new PipelineBuilderPage(page, pipelineID);
      await pipelineBuilderPage.goto();

      // Add JSON field in start operator
      await pipelineBuilderPage.createStartComponentField({
        inputType: "JSON",
        key: startFieldKey,
      });

      // Create output result field in the end operator
      await pipelineBuilderPage.createEndComponentField({
        key: endFieldKey,
        value: endFieldValue,
      });

      await pipelineBuilderPage.expectToSave();

      // Fill in value in the start operator JSON field
      await pipelineBuilderPage.startNode
        .locator(`textarea[name='${startFieldKey}']`)
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
        .locator(`textarea[name='${startFieldKey}']`)
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
