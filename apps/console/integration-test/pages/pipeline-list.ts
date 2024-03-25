import { Locator, Page } from "@playwright/test";

export class PipelineListPage {
  readonly page: Page;
  readonly pipelineListPagePath = "/admin/pipelines";
  readonly createPipelineButton: Locator;
  readonly createPipelineDialog: Locator;
  readonly createPipelineDialogIDField: Locator;
  readonly createPipelineDialogCreateButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.createPipelineButton = page.getByRole("button", {
      name: /Create Pipeline/i,
    });
    this.createPipelineDialog = page.getByTestId("create-pipeline-dialog");
    this.createPipelineDialogIDField =
      this.createPipelineDialog.getByPlaceholder("Pipeline Name");
    this.createPipelineDialogCreateButton = this.createPipelineDialog.getByRole(
      "button",
      { name: "Create" }
    );
  }

  async goto() {
    await this.page.goto(this.pipelineListPagePath);
  }

  async expectOnIt() {
    await this.page.waitForURL(this.pipelineListPagePath);
  }
}
