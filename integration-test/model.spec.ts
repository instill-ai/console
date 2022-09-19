import { test, expect } from "@playwright/test";
import {
  expectCorrectModelDetails,
  expectCorrectModelList,
  expectToDeleteModel,
  expectToDeployModel,
  expectToUpdateModelDescription,
} from "./common/model";
import { addInstillCookie, delay } from "./helper";

test.describe.serial("Local model", () => {
  const modelId = `local-model-${Math.floor(Math.random() * 10000)}`;
  const modelDescription = "Local test model";
  const modelInstanceTag = "latest";
  const modelSource = "Local";

  test.afterAll(async () => {
    await delay(500);
  });

  test("should create local model", async ({ page, context }) => {
    await addInstillCookie(context);
    await page.goto("/models/create", { waitUntil: "networkidle" });

    // Should disable set up button
    const setupButton = page.locator("button", { hasText: "Set up" });
    expect(await setupButton.isDisabled()).toBeTruthy();

    // Should input model id
    const idInput = page.locator("input#modelId");
    await idInput.fill(modelId);

    // Should input model description
    const descriptionInput = page.locator("textarea#description");
    await descriptionInput.fill(modelDescription);

    // Should select model source - local and have according fields
    const fileInput = page.locator("input#file");
    await page
      .locator("#react-select-modelDefinition-input")
      .click({ force: true });
    await Promise.all([
      page
        .locator("data-testid=modelDefinition-selected-option", {
          hasText: modelSource,
        })
        .click(),
      fileInput.isVisible(),
    ]);

    // Should input local file and enable set up button
    await Promise.all([
      fileInput.setInputFiles("./integration-test/data/dummy-cls-model.zip"),
      setupButton.isEnabled(),
    ]);

    await expectToDeployModel(page, modelInstanceTag, setupButton);
  });

  test("should have proper model list and navigate to model details page", async ({
    page,
    context,
  }) => {
    await addInstillCookie(context);
    await expectCorrectModelList(page, modelId);
  });

  test("should display proper model details page", async ({
    page,
    context,
  }) => {
    await addInstillCookie(context);
    await expectCorrectModelDetails({
      page,
      modelId,
      modelDescription,
      modelInstanceTag,
      modelState: "STATE_ONLINE",
      modelTask: "CLASSIFICATION",
    });
  });

  test.skip("should update description", async ({ page, context }) => {
    await addInstillCookie(context);
    await expectToUpdateModelDescription(page, modelId, "");
  });

  test("should have proper delete model modal and delete this model", async ({
    page,
    context,
  }) => {
    await addInstillCookie(context);
    await expectToDeleteModel(page, modelId);
  });
});

test.describe.serial("Hugging face model", () => {
  test.setTimeout(120 * 1000);
  const modelId = `huggingface-model-${Math.floor(Math.random() * 10000)}`;
  const modelDescription = "Hugging face test model";
  const modelSource = "Hugging Face";
  const huggingFaceId = "apple/mobilevit-small";
  const modelInstanceTag = "latest";

  test("should create huggingface model", async ({ page, context }) => {
    await addInstillCookie(context);
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
      page
        .locator("data-testid=modelDefinition-selected-option", {
          hasText: modelSource,
        })
        .click(),
      huggingFaceIdInput.isVisible(),
    ]);

    // Should input Huggingface id and enable set up button
    await Promise.all([
      huggingFaceIdInput.fill(huggingFaceId),
      setupButton.isEnabled(),
    ]);

    await expectToDeployModel(page, modelInstanceTag, setupButton, 60 * 1000);
  });

  test("should have proper model list and navigate to model details page", async ({
    page,
    context,
  }) => {
    await addInstillCookie(context);
    await expectCorrectModelList(page, modelId);
  });

  test("should display proper model details page", async ({
    page,
    context,
  }) => {
    await addInstillCookie(context);
    await expectCorrectModelDetails({
      page,
      modelId,
      modelDescription,
      modelInstanceTag,
      modelState: "STATE_ONLINE",
      modelTask: "CLASSIFICATION",
    });
  });

  test.skip("should update description", async ({ page, context }) => {
    await addInstillCookie(context);
    await expectToUpdateModelDescription(page, modelId, "");
  });

  test("should have proper delete model modal and delete this model", async ({
    page,
    context,
  }) => {
    await addInstillCookie(context);
    await expectToDeleteModel(page, modelId);
  });
});

test.describe.serial("GitHub model", () => {
  const modelId = `github-model-${Math.floor(Math.random() * 10000)}`;
  const modelSource = "GitHub";
  const modelDescription = "Github test model";
  const modelRepo = "instill-ai/model-mobilenetv2";
  const modelInstanceTag = "v1.0-cpu";

  test("should create github model", async ({ page, context }) => {
    await addInstillCookie(context);
    await page.goto("/models/create", { waitUntil: "networkidle" });

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
      page
        .locator("data-testid=modelDefinition-selected-option", {
          hasText: modelSource,
        })
        .click(),
      githubRepoInput.isVisible(),
    ]);

    // Should input GitHub repo url
    await Promise.all([
      githubRepoInput.fill(modelRepo),
      setupButton.isEnabled(),
    ]);

    await expectToDeployModel(page, modelInstanceTag, setupButton, 60 * 1000);
  });

  test("should have proper model list and navigate to model details page", async ({
    page,
    context,
  }) => {
    await addInstillCookie(context);
    await expectCorrectModelList(page, modelId);
  });

  test("should display proper model details page", async ({
    page,
    context,
  }) => {
    await addInstillCookie(context);
    await expectCorrectModelDetails({
      page,
      modelId,
      modelDescription,
      modelInstanceTag: "v1.0-gpu", // Because we don't have a way to indicate which instance just created.
      modelState: "STATE_OFFLINE",
      modelTask: "CLASSIFICATION",
    });
  });

  test.skip("should update description", async ({ page, context }) => {
    await addInstillCookie(context);
    await expectToUpdateModelDescription(page, modelId, "");
  });

  test("should have proper delete model modal and delete this model", async ({
    page,
    context,
  }) => {
    await addInstillCookie(context);
    await expectToDeleteModel(page, modelId);
  });
});

test.describe.serial("Artivc model", () => {
  const modelId = `artivc-model-${Math.floor(Math.random() * 10000)}`;
  const modelDescription = "ArtiVC test model";
  const modelSource = "ArtiVC";
  const modelBucket = "gs://test-20062";
  const modelInstanceTag = "v1.0-cpu";

  test("should create artivc model", async ({ page, context }) => {
    await addInstillCookie(context);
    await page.goto("/models/create", { waitUntil: "networkidle" });

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
      page
        .locator("data-testid=modelDefinition-selected-option", {
          hasText: modelSource,
        })
        .click(),
      bucketField.isVisible(),
      credentialsField.isVisible(),
    ]);

    // Should input GitHub repo url
    await Promise.all([
      setupButton.isEnabled(),
      await bucketField.fill(modelBucket),
    ]);

    await expectToDeployModel(page, modelInstanceTag, setupButton, 60 * 1000);
  });

  test("should have proper model list and navigate to model details page", async ({
    page,
    context,
  }) => {
    await addInstillCookie(context);
    await expectCorrectModelList(page, modelId);
  });

  test("should display proper model details page", async ({
    page,
    context,
  }) => {
    await addInstillCookie(context);
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

  test.skip("should update description", async ({ page, context }) => {
    await addInstillCookie(context);
    await expectToUpdateModelDescription(page, modelId, "");
  });

  test("should have proper delete model modal and delete this model", async ({
    page,
    context,
  }) => {
    await addInstillCookie(context);
    await expectToDeleteModel(page, modelId);
  });
});
