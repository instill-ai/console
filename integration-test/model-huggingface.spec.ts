import { test, expect } from "@playwright/test";
import {
  expectCorrectModelDetails,
  expectCorrectModelList,
  expectToUpdateModelDescription,
} from "./common/model";
import { env, expectToSelectOption } from "./helper";

export function handleHuggingFaceModelTest() {
  const modelId = `huggingface-model-${Math.floor(Math.random() * 10000)}`;
  const modelDescription = "Hugging face test model";
  const modelSource = "Hugging Face";
  const huggingFaceId = "google/vit-base-patch16-224";

  // This set of test are easily failed due to the timeout, latency issue of
  // model pulling and converting. Not only that, Firefox seems particularly fragile
  // to face this kind of issue.

  test.describe.serial("Hugging face model", () => {
    test("should create huggingface model", async ({ page }) => {
      await page.goto("/model-hub/create", { waitUntil: "networkidle" });

      // Should disable setup button
      const setupButton = page.locator("button", { hasText: "Set up" });
      expect(await setupButton.isDisabled()).toBeTruthy();

      // Should input model id
      await page.locator("input#model-id").fill(modelId);

      // Should input model description
      await page.locator("textarea#model-description").fill(modelDescription);

      // Should select model source - Hugging face and have according fields
      const huggingFaceIdInput = page.locator(
        "input#model-huggingface-repo-url"
      );
      await expectToSelectOption(
        page.locator("#model-definition"),
        page.locator(`[data-radix-select-viewport=""]`).getByText(modelSource),
        huggingFaceIdInput
      );

      // Should input Huggingface id and enable set up button
      await huggingFaceIdInput.fill(huggingFaceId);
      expect(await setupButton.isEnabled()).toBeTruthy();

      // Should set up model
      await Promise.all([
        page.waitForURL(`${env("NEXT_PUBLIC_CONSOLE_BASE_URL")}/model-hub`),
        setupButton.click(),
      ]);
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
        modelState: "STATE_ONLINE",
        modelTask: "Classification",
        additionalRules: async () => {
          const huggingFaceModelIdField = page.locator(
            "input#model-huggingface-repo-url"
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

    // test.skip("should have proper delete model modal and delete this model", async ({
    //   page,
    // }) => {
    //   await expectToDeleteModel(page, modelId);
    // });
  });
}
