import { Page } from "@playwright/test";

export const openPipelinesPage = async (page: Page) => {
  await page.goto("/pipelines");
};

export const openCreatePipelinePage = async (page: Page) => {
  await page.goto("/pipelines/create");
};
