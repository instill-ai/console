import { Locator, Page } from "@playwright/test";

export class PipelineBuilderPage {
  readonly page: Page;
  readonly pipelineBuilderPagePath: string;
  readonly startNode: Locator;
  readonly startNodeAddFieldButton: Locator;
  readonly startNodeSaveFieldButton: Locator;
  readonly endNodeAddFieldButton: Locator;
  readonly endNodeSaveFieldButton: Locator;
  readonly endNode: Locator;
  readonly mainSaveButton: Locator;
  readonly mainRunButton: Locator;

  constructor(page: Page, pipelineID: string) {
    this.page = page;
    this.pipelineBuilderPagePath = `/admin/pipelines/${pipelineID}/builder`;
    this.startNode = page.locator("[data-id='start']");
    this.startNodeAddFieldButton = this.startNode.getByRole("button", {
      name: "Add Field",
    });
    this.startNodeSaveFieldButton = this.startNode.getByRole("button", {
      name: "Save",
    });
    this.endNode = page.locator("[data-id='end']");
    this.endNodeAddFieldButton = this.endNode.getByRole("button", {
      name: "Add Field",
    });
    this.endNodeSaveFieldButton = this.endNode.getByRole("button", {
      name: "Save",
    });
    this.mainSaveButton = page.getByRole("button", { name: "Save" });
    this.mainRunButton = page.getByRole("button", { name: "Run" });
  }

  async goto() {
    await this.page.goto(this.pipelineBuilderPagePath);
  }

  async expectOnIt() {
    await this.page.waitForURL(this.pipelineBuilderPagePath);
  }
}
