import { test, expect } from "@playwright/test";
import { openCreatePipelinePage } from "../common/pipeline";

const testPipelineId = "test-pipeline-7";
const testModelId = "test-model-7";
const testModelDescription = "Hi! This is a test model";
const testPipelineDescription = "Hi! This is a test pipeline";

test("should create simple sync pipeline with local model", async ({
  page,
}) => {
  await openCreatePipelinePage(page);

  // Setup source
  await page.locator("#existingSourceId").click({ force: true });
  await page.locator("#react-select-existingSourceId-option-0").click();
  await page.locator("button", { hasText: "Next" }).click();

  const isOnSetupModelStep = await page
    .locator("h2", {
      hasText: "Set Up Model",
    })
    .isVisible();

  expect(isOnSetupModelStep).toBeTruthy();

  // Setup local model
  await page.locator("#modelId").fill(testModelId);
  await page.locator("#modelDefinition").click({ force: true });
  await page.locator(".instill-text-body", { hasText: "Local" }).click();
  await page.locator("#description").fill(testModelDescription);
  await page
    .locator("#modelFile")
    .setInputFiles("./e2e/data/dummy-cls-model.zip");
  await page.locator("button", { hasText: "Setup new model" }).click();
  await Promise.all([
    page.waitForResponse((response) => {
      if (!process.env.NEXT_PUBLIC_MODEL_API_ENDPOINT) {
        throw new Error("env not provided");
      }
      return response
        .url()
        .includes(process.env.NEXT_PUBLIC_MODEL_API_ENDPOINT);
    }),
  ]);

  // Deploy model instance
  await page.locator("#modelInstanceName").click({ force: true });
  await page.locator("#react-select-modelInstanceName-option-0").click();
  await page.locator("button", { hasText: "Deploy" }).click();
  await Promise.all([
    page.waitForResponse((response) => {
      if (!process.env.NEXT_PUBLIC_MODEL_API_ENDPOINT) {
        throw new Error("env not provided");
      }
      return response
        .url()
        .includes(process.env.NEXT_PUBLIC_MODEL_API_ENDPOINT);
    }),
  ]);

  const isOnSetupDestinationStep = await page
    .locator("h2", {
      hasText: "Set Up Data Destination",
    })
    .isVisible();

  expect(isOnSetupDestinationStep).toBeTruthy();

  // Setup destination
  await page.locator("button", { hasText: "Next" }).click();
  const isOnSetupPipelineDetailsStep = await page
    .locator("h2", {
      hasText: "Set Up Pipeline",
    })
    .isVisible();

  expect(isOnSetupPipelineDetailsStep).toBeTruthy();

  // Setup pipeline details
  await page.locator("#pipelineId").fill(testPipelineId);
  await page.locator("#pipelineDescription").fill(testPipelineDescription);
  await page.locator("button", { hasText: "Set up pipeline" }).click();

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
  await page.waitForNavigation();

  expect(page.url()).toBe(`${process.env.NEXT_PUBLIC_MAIN_URL}/pipelines`);
  await expect(page.locator("h3", { hasText: testPipelineId })).toBeVisible();
});
