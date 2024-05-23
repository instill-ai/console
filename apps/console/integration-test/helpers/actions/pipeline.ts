import { PipelineBuilderPage } from "../../pages/pipeline-builder.page";
import { PipelineListPage } from "../../pages/pipeline-list";
import { Page } from "@playwright/test";
import { PipelineOverviewPage } from "../../pages/pipeline-overview.page";
import { getDropdownContent } from "../component-helpers/dropdown";
import { DataTestID } from "../../data-testid";

export async function createPipeline(page: Page, pipelineID: string) {
  const pipelineListPage = new PipelineListPage(page);
  const pipelineBuilderPage = new PipelineBuilderPage(page, pipelineID);
  await pipelineListPage.goto();
  await pipelineListPage.createPipelineButton.click({ force: true });
  await pipelineListPage.createPipelineDialogIDField.fill(pipelineID);
  await Promise.all([
    pipelineBuilderPage.startNode.waitFor({ state: "visible" }),
    pipelineListPage.createPipelineDialogCreateButton.click(),
  ]);
}

export async function deletePipeline(page: Page, pipelineID: string) {
  const pipelineOverviewPage = new PipelineOverviewPage(page, pipelineID);
  const pipelineListPage = new PipelineListPage(page);

  await pipelineOverviewPage.goto();

  await pipelineOverviewPage.moreOptionsButton.click();
  const moreOptionsContent = await getDropdownContent(
    page,
    pipelineOverviewPage.moreOptionsButton,
  );
  await moreOptionsContent.waitFor({ state: "visible" });
  await moreOptionsContent.getByText("Delete").click();
  const deletePipelineDialog = page.getByTestId(
    DataTestID.deleteResourceDialog,
  );
  await deletePipelineDialog.locator("input#confirmationCode").fill(pipelineID);

  await Promise.all([
    pipelineListPage.expectOnIt(),
    deletePipelineDialog.getByRole("button", { name: "Delete" }).click(),
  ]);
}
