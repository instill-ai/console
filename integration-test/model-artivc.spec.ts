import { test, expect } from "@playwright/test";
import {
  expectCorrectModelDetails,
  expectCorrectModelList,
  expectToDeployModel,
  expectToUpdateModelDescription,
} from "./common/model";

export function handleArtivcModelTest() {
  const modelId = `artivc-model-${Math.floor(Math.random() * 10000)}`;
  const modelDescription = "ArtiVC test model";
  const modelSource = "ArtiVC";
  const modelBucket = "gs://test-20062";
  const modelInstanceTag = "v1.0-cpu";

  // This set of test are easily failed due to the timeout, latency issue of
  // model pulling and converting. Not only that, Firefox seems particularly fragile
  // to face this kind of issue.

  test.use({
    launchOptions: {
      slowMo: 50,
    },
  });

  test.describe.serial("Artivc model", () => {
    test.setTimeout(75000);

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
        modelInstanceTagOptionLocator: page.locator(
          "#react-select-modelInstanceTag-option-0"
        ),
        modelState: "STATE_ONLINE",
        modelTask: "Classification",
        additionalRules: async () => {
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

    // Disable test related to long-running operation

    // test.skip("should have proper delete model modal and delete this model", async ({
    //   page,
    // }) => {
    //   await expectToDeleteModel(page, modelId);
    // });
  });
}
