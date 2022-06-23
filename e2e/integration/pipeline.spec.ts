import { test, expect } from "@playwright/test";
import { openCreatePipelinePage, openPipelinePage } from "../common/pipeline";

test.describe.serial("Simple sync pipeline with local model", () => {
  const testPipelineId = "test-pipeline-13ef55rrrr3";
  const testModelId = "test-model-f";
  const testModelDescription = "Hi! This is a test model";
  const testPipelineDescription = "Hi! This is a test pipeline";

  test("should create pipeline", async ({ page }) => {
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

  test("should update pipeline description", async ({ page }) => {
    await openPipelinePage(page, testPipelineId);
    await page.locator("button", { hasText: "Edit" }).click();
    const pipelineDescription = page.locator("#pipelineDescription");
    await expect(pipelineDescription).toHaveValue(testPipelineDescription);
    await pipelineDescription.fill("modified");
    await page.locator("button", { hasText: "Done" }).click();
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
    await expect(pipelineDescription).toHaveValue("modified");
  });

  test("should delete pipeline", async ({ page }) => {
    await page.goto(`/pipelines/${testPipelineId}`);
    await page.locator("button", { hasText: "Delete" }).click();
    await page.locator("#confirmationCode").fill(testPipelineId);

    await page.screenshot({ path: "text.png" });

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
  });
});

test.describe.serial("Simple sync pipeline with github model", () => {
  const testPipelineId = "test-pipeline-2qereeeere2";
  const testModelId = "test-model-2reeeqe2";
  const testPipelineDescription = "Hi! This is a test pipeline";
  const githubModelRepo = "instill-ai/model-mobilenetv2";

  test("should create pipeline", async ({ page }) => {
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

    // Setup github model
    await page.locator("#modelId").fill(testModelId);
    await page.locator("#modelDefinition").click({ force: true });
    await page.locator(".instill-text-body", { hasText: "GitHub" }).click();
    await page.locator("#modelRepo").fill(githubModelRepo);
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

  test("should update pipeline description", async ({ page }) => {
    await openPipelinePage(page, testPipelineId);
    await page.locator("button", { hasText: "Edit" }).click();
    const pipelineDescription = page.locator("#pipelineDescription");
    await expect(pipelineDescription).toHaveValue(testPipelineDescription);
    await pipelineDescription.fill("modified");
    await page.locator("button", { hasText: "Done" }).click();
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
    await expect(pipelineDescription).toHaveValue("modified");
  });

  test("should delete pipeline", async ({ page }) => {
    await page.goto(`/pipelines/${testPipelineId}`);
    await page.locator("button", { hasText: "Delete" }).click();
    await page.locator("#confirmationCode").fill(testPipelineId);

    await page.screenshot({ path: "text.png" });

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
    await page.waitForNavigation();
    expect(page.url().split("/").pop()).toBe("pipelines");

    await expect(page.locator(`text=${testPipelineId}`)).toHaveCount(0);
  });
});

test.describe.serial("Simple sync pipeline with existing model", () => {});
