import { test, expect } from "@playwright/test";
import {
  expectCorrectModelDetails,
  expectCorrectModelList,
  expectToDeleteModel,
  expectToDeployModel,
  expectToUpdateModelDescription,
} from "./common/model";

// This set of test are easily failed due to the timeout, latency issue of
// model pulling and converting. Not only that, Firefox seems particularly fragile
// to face this kind of issue.

test.use({
  launchOptions: {
    slowMo: 50,
  },
});

test.describe.serial("Local model", () => {
  const modelId = `local-model-${Math.floor(Math.random() * 10000)}`;
  const modelDescription = "Local test model";
  const modelInstanceTag = "latest";
  const modelSource = "Local";

  test("should create local model", async ({ page }) => {
    await page.goto("/models/create", { waitUntil: "networkidle" });

    // Should disable set up button
    const setupButton = page.locator("button", { hasText: "Set up" });
    expect(await setupButton.isDisabled()).toBeTruthy();

    // Should input model id
    const idInput = page.locator("input#modelId");
    await idInput.type(modelId, { delay: 20 });

    // Should input model description
    const descriptionInput = page.locator("textarea#description");
    await descriptionInput.type(modelDescription, { delay: 20 });

    // Should select model source - local and have according fields
    const modelDefinitionOption = page.locator(
      "#react-select-modelDefinition-input"
    );
    const fileField = page.locator("input#file");
    await modelDefinitionOption.click({ force: true });
    const selectedModelDefinition = page.locator(
      "data-testid=modelDefinition-selected-option",
      {
        hasText: modelSource,
      }
    );
    await Promise.all([
      fileField.waitFor({ state: "visible" }),
      selectedModelDefinition.click(),
    ]);

    // Should input local model file and enable set up model button
    await fileField.setInputFiles(
      "./integration-test/data/dummy-cls-model.zip"
    );
    await expect(setupButton).toBeEnabled();
    const succeedMessage = page.locator("h3", { hasText: "Succeed" });

    // Should set up the model
    await Promise.all([
      succeedMessage.waitFor({ state: "visible", timeout: 25 * 1000 }),
      setupButton.click({ force: true }),
    ]);

    await expectToDeployModel(page, modelInstanceTag, null, 25 * 1000);
  });

  test("should have proper model list and navigate to model details page", async ({
    page,
  }) => {
    await expectCorrectModelList(page, modelId);
  });

  test("should display proper model details page", async ({ page }) => {
    await expectCorrectModelDetails({
      page,
      modelId,
      modelDescription,
      modelInstanceTag,
      modelState: "STATE_ONLINE",
      modelTask: "CLASSIFICATION",
    });
  });

  test("should update description", async ({ page }) => {
    await expectToUpdateModelDescription(page, modelId, "new");
  });

  test("should have proper delete model modal and delete this model", async ({
    page,
  }) => {
    await expectToDeleteModel(page, modelId);
  });
});

test.describe.serial("Hugging face model", () => {
  const modelId = `huggingface-model-${Math.floor(Math.random() * 10000)}`;
  const modelDescription = "Hugging face test model";
  const modelSource = "Hugging Face";
  const huggingFaceId = "google/vit-base-patch16-224";
  const modelInstanceTag = "latest";

  test("should create huggingface model", async ({ page }) => {
    await page.goto("/models/create", { waitUntil: "networkidle" });

    // Should disable setup button
    const setupButton = page.locator("button", { hasText: "Set up" });
    expect(await setupButton.isDisabled()).toBeTruthy();

    // Should input model id
    const idInput = page.locator("input#modelId");
    await idInput.fill(modelId);

    // Should input model description
    const descriptionInput = page.locator("textarea#description");
    await descriptionInput.fill(modelDescription);

    // Should select model source - Hugging face and have according fields
    const huggingFaceIdInput = page.locator("input#huggingFaceRepo");
    await page
      .locator("#react-select-modelDefinition-input")
      .click({ force: true });

    await Promise.all([
      huggingFaceIdInput.waitFor({ state: "visible" }),
      page
        .locator("data-testid=modelDefinition-selected-option", {
          hasText: modelSource,
        })
        .click(),
    ]);

    // Should input Huggingface id and enable set up button
    await huggingFaceIdInput.fill(huggingFaceId);
    expect(await setupButton.isEnabled()).toBeTruthy();

    // Should set up model
    const succeedMessage = page.locator("h3", { hasText: "Succeed" });
    await Promise.all([
      succeedMessage.waitFor({ state: "visible", timeout: 20 * 1000 }),
      setupButton.click(),
    ]);

    // In order to pull and convert hugging face model, it will take a much longer time to
    // deploy hugging-face model.
    await expectToDeployModel(page, modelInstanceTag, null, 120 * 1000);
  });

  test("should have proper model list and navigate to model details page", async ({
    page,
  }) => {
    await expectCorrectModelList(page, modelId);
  });

  test("should display proper model details page", async ({ page }) => {
    await expectCorrectModelDetails({
      page,
      modelId,
      modelDescription,
      modelInstanceTag,
      modelState: "STATE_ONLINE",
      modelTask: "CLASSIFICATION",
    });
  });

  test("should update description", async ({ page }) => {
    await expectToUpdateModelDescription(page, modelId, "new");
  });

  test("should have proper delete model modal and delete this model", async ({
    page,
  }) => {
    await expectToDeleteModel(page, modelId);
  });
});

test.describe.serial("GitHub model", () => {
  const modelId = `github-model-${Math.floor(Math.random() * 10000)}`;
  const modelSource = "GitHub";
  const modelDescription = "Github test model";
  const modelRepo = "instill-ai/model-mobilenetv2";
  const modelInstanceTag = "v1.0-cpu";

  test("should create github model", async ({ page }) => {
    await page.goto("/models/create");

    // Should disable set up button
    const setupButton = page.locator("button", { hasText: "Set up" });
    expect(await setupButton.isDisabled()).toBeTruthy();

    // Should input model id
    const idInput = page.locator("input#modelId");
    await idInput.fill(modelId);

    // Should input model description
    const descriptionInput = page.locator("textarea#description");
    await descriptionInput.fill(modelDescription);

    // Should select model source - GitHub and display according fields
    const githubRepoInput = page.locator("input#modelRepo");
    await page
      .locator("#react-select-modelDefinition-input")
      .click({ force: true });

    await Promise.all([
      githubRepoInput.waitFor({ state: "visible" }),
      page
        .locator("data-testid=modelDefinition-selected-option", {
          hasText: modelSource,
        })
        .click(),
    ]);

    // Should input GitHub repo url
    await githubRepoInput.fill(modelRepo);
    await expect(setupButton).toBeEnabled();

    // Should set up model
    const succeedMessage = page.locator("h3", { hasText: "Succeed" });
    await Promise.all([
      succeedMessage.waitFor({ state: "visible", timeout: 45 * 1000 }),
      setupButton.click(),
    ]);

    // await expectToDeployModel(page, modelInstanceTag, null, 60 * 1000);
  });

  test("should have proper model list and navigate to model details page", async ({
    page,
  }) => {
    await expectCorrectModelList(page, modelId);
  });

  test("should display proper model details page", async ({ page }) => {
    await expectCorrectModelDetails({
      page,
      modelId,
      modelDescription,
      modelInstanceTag: "v1.0-gpu", // Because we don't have a way to indicate which instance just created.
      modelState: "STATE_OFFLINE",
      modelTask: "CLASSIFICATION",
    });
  });

  test("should update description", async ({ page }) => {
    await expectToUpdateModelDescription(page, modelId, "new");
  });

  test("should have proper delete model modal and delete this model", async ({
    page,
  }) => {
    await expectToDeleteModel(page, modelId);
  });
});

test.describe.serial("Artivc model", () => {
  const modelId = `artivc-model-${Math.floor(Math.random() * 10000)}`;
  const modelDescription = "ArtiVC test model";
  const modelSource = "ArtiVC";
  const modelBucket = "gs://test-20062";
  const modelInstanceTag = "v1.0-cpu";

  test("should create artivc model", async ({ page }) => {
    await page.goto("/models/create");

    // Should disable set up button
    const setupButton = page.locator("button", { hasText: "Set up" });
    expect(await setupButton.isDisabled()).toBeTruthy();

    // Should input model id
    const idInput = page.locator("input#modelId");
    await idInput.fill(modelId);

    // Should input model description
    const descriptionInput = page.locator("textarea#description");
    await descriptionInput.fill(modelDescription);

    // Should select model source - GitHub and display according fields
    const bucketField = page.locator("input#gcsBucketPath");
    const credentialsField = page.locator("textarea#credentials");
    await page
      .locator("#react-select-modelDefinition-input")
      .click({ force: true });

    await Promise.all([
      bucketField.waitFor({ state: "visible" }),
      credentialsField.waitFor({ state: "visible" }),
      page
        .locator("data-testid=modelDefinition-selected-option", {
          hasText: modelSource,
        })
        .click(),
    ]);

    // Should fill in model's bucket
    await bucketField.fill(modelBucket);
    expect(await setupButton.isEnabled()).toBeTruthy();

    const succeedMessage = page.locator("h3", { hasText: "Succeed" });
    await Promise.all([
      succeedMessage.waitFor({ state: "visible", timeout: 20 * 1000 }),
      setupButton.click(),
    ]);

    await expectToDeployModel(page, modelInstanceTag, null, 60 * 1000);
  });

  test("should have proper model list and navigate to model details page", async ({
    page,
  }) => {
    await expectCorrectModelList(page, modelId);
  });

  test("should display proper model details page", async ({ page }) => {
    await expectCorrectModelDetails({
      page,
      modelId,
      modelDescription,
      modelInstanceTag: "v1.0-cpu",
      modelState: "STATE_ONLINE",
      modelTask: "CLASSIFICATION",
      additionalRule: async () => {
        // Should have correct artivc version/model instance tag
        const artivcVersionField = page.locator("input#tag");
        await expect(artivcVersionField).toHaveValue(modelInstanceTag);

        // Should have correct cloud storage url/model bucket
        const cloudStorageUrl = page.locator("input#url");
        await expect(cloudStorageUrl).toHaveValue(modelBucket);
      },
    });
  });

  test("should update description", async ({ page }) => {
    await expectToUpdateModelDescription(page, modelId, "new");
  });

  test("should have proper delete model modal and delete this model", async ({
    page,
  }) => {
    await expectToDeleteModel(page, modelId);
  });
});
