import { test, expect } from "@playwright/test";
import { PipelineOverviewPage } from "../pages/pipeline-overview.page";
import { PipelineBuilderPage } from "../pages/pipeline-builder.page";
import { PipelineListPage } from "../pages/pipeline-list";
import { getDropdownContent } from "../helpers/dropdown";
import { TestID } from "../constant/test-id";

test("should unmarshal payload for start operator json field", async ({
  page,
}) => {
  const pipelineID = "unmarshal_test";
  const startFieldID = "json";
  const jsonValue = {
    foo: "bar",
    hello: 1,
  };
  const endFieldID = "result";
  const endFieldValue = "${start." + startFieldID + "}";
  const pipelineListPage = new PipelineListPage(page);
  const pipelineBuilderPage = new PipelineBuilderPage(page, pipelineID);
  const pipelineOverviewPage = new PipelineOverviewPage(page, pipelineID);

  await pipelineListPage.goto();
  await pipelineListPage.createPipelineButton.click();

  // Create new pipeline
  await pipelineListPage.createPipelineDialogIDField.fill(pipelineID);
  await Promise.all([
    pipelineBuilderPage.expectOnIt(),
    pipelineListPage.createPipelineDialogCreateButton.click(),
  ]);

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

  // go to pipeline overview page
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

  // Delete this pipeline
  await pipelineOverviewPage.moreOptionsButton.click();
  const moreOptionsContent = await getDropdownContent(
    page,
    pipelineOverviewPage.moreOptionsButton,
  );
  await moreOptionsContent.waitFor({ state: "visible" });

  await moreOptionsContent.getByText("Delete").click();
  const deletePipelineDialog = page.getByTestId(TestID.deletePipelineDialog);
  await deletePipelineDialog.locator("input#confirmationCode").fill(pipelineID);

  await Promise.all([
    pipelineListPage.expectOnIt(),
    deletePipelineDialog.getByRole("button", { name: "Delete" }).click(),
  ]);
});
