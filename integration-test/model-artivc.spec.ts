import { test, expect } from "@playwright/test";
import {
  expectCorrectModelDetails,
  expectCorrectModelList,
  expectToUpdateModelDescription,
} from "./common/model";
import { env, expectToSelectOption } from "./helper";

export function handleArtivcModelTest() {
  const modelId = `artivc-model-${Math.floor(Math.random() * 10000)}`;
  const modelDescription = "ArtiVC test model";
  const modelSource = "ArtiVC";
  const modelBucket = "gs://test-20062";
  const modelTag = "v1.0-cpu";

  // This set of test are easily failed due to the timeout, latency issue of
  // model pulling and converting. Not only that, Firefox seems particularly fragile
  // to face this kind of issue.

  test.describe.serial("Artivc model", () => {
    test("should create artivc model", async ({ page }) => {
      await page.goto("/models/create");

      // Should disable set up button
      const setupButton = page.locator("button", { hasText: "Set up" });
      expect(await setupButton.isDisabled()).toBeTruthy();

      // Should input model id
      await page.locator("input#model-id").fill(modelId);

      // Should input model description
      await page.locator("textarea#model-description").fill(modelDescription);

      // Should select model source - GitHub and display according fields
      const bucketField = page.locator("input#model-artivc-gcs-bucket-path");
      await expectToSelectOption(
        page.locator("#model-definition"),
        page.locator(`[data-radix-select-viewport=""]`).getByText(modelSource),
        bucketField
      );

      // Should fill in model's bucket and tag
      await bucketField.fill(modelBucket);
      await page.locator("input#model-artivc-tag").fill(modelTag);
      expect(await setupButton.isEnabled()).toBeTruthy();

      await Promise.all([
        page.waitForURL(`${env("NEXT_PUBLIC_CONSOLE_BASE_URL")}/models`),
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
          // Should have correct artivc version/model instance tag
          const artivcVersionField = page.locator("input#model-artivc-tag");
          await expect(artivcVersionField).toHaveValue(modelTag);

          // Should have correct cloud storage url/model bucket
          const cloudStorageUrl = page.locator(
            "input#model-artivc-gcs-bucket-path"
          );
          await expect(cloudStorageUrl).toHaveValue(modelBucket);
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
