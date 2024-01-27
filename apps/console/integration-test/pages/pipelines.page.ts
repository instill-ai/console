import { Page } from "@playwright/test";

export class PipelinesPage {
  readonly page: Page;
  readonly pipelinesPagePath = "/admin/pipelines";

  constructor(page: Page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto(this.pipelinesPagePath);
  }

  async expectOnIt() {
    await this.page.waitForURL(this.pipelinesPagePath);
  }
}
