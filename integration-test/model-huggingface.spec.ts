import { test, expect } from "@playwright/test";
import {
  expectCorrectModelDetails,
  expectCorrectModelList,
  expectToDeleteModel,
  expectToDeployModel,
  expectToUpdateModelDescription,
} from "./common/model";

const modelId = `huggingface-model-${Math.floor(Math.random() * 10000)}`;
const modelDescription = "Hugging face test model";
const modelSource = "Hugging Face";
const huggingFaceId = "google/vit-base-patch16-224";
const modelInstanceTag = "latest";

// This set of test are easily failed due to the timeout, latency issue of
// model pulling and converting. Not only that, Firefox seems particularly fragile
// to face this kind of issue.

test.use({
  launchOptions: {
    slowMo: 50,
  },
});

test.describe.serial("Hugging face model", () => {
  test.setTimeout(75000);

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
      modelInstanceTagOptionLocator: page.locator(
        "#react-select-modelInstanceTag-option-0"
      ),
      modelState: "STATE_ONLINE",
      modelTask: "Classification",
      additionalRules: async () => {
        const huggingFaceModelIdField = page.locator(
          "input#huggingface-model-id"
        );
        expect(await huggingFaceModelIdField.isEditable()).toBeFalsy();
        await expect(huggingFaceModelIdField).toHaveValue(huggingFaceId);
      },
    });
  });

  test("should update description", async ({ page }) => {
    await expectToUpdateModelDescription(page, modelId, "new");
  });

  // Disable test related to long-running operation

  test.skip("should have proper delete model modal and delete this model", async ({
    page,
  }) => {
    await expectToDeleteModel(page, modelId);
  });
});
