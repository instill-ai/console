import { Page } from "@playwright/test";

export class ConnectorListPage {
  readonly page: Page;
  readonly pipelineListPagePath = "/admin/connectors";

  constructor(page: Page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto(this.pipelineListPagePath);
  }

  async expectOnIt() {
    await this.page.waitForURL(this.pipelineListPagePath);
  }
}
