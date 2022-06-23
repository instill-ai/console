import { Page } from "@playwright/test";

export const openPipelinesPage = async (page: Page) => {
  await page.goto("/pipelines");
};

export const openCreatePipelinePage = async (page: Page) => {
  await page.goto("/pipelines/create");
};

export const deletePipeline = async (page: Page, pipelineId: string) => {
  await page.goto(`/pipelines/${pipelineId}`);
  await page.locator("button", { hasText: "Delete" }).click();
  await page.locator("#confirmationCode").fill(pipelineId);

  page.screenshot({ path: "test.png" });

  await page.locator("role=dialog >> button:has-text('Delete')").click();

  await Promise.all([
    page.waitForResponse((response) => {
      if (!process.env.NEXT_PUBLIC_PIPELINE_API_ENDPOINT) {
        throw new Error("env not provided");
      }
      return response
        .url()
        .includes(process.env.NEXT_PUBLIC_PIPELINE_API_ENDPOINT);
    }),
  ]);
};
