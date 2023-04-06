import { test, expect } from "@playwright/test";
import {
  expectCorrectModelDetails,
  expectCorrectModelList,
  expectToUpdateModelDescription,
} from "./common/model";
import { env, expectToSelectOption } from "./helper";

export function handleLocalModelTest() {
  const modelId = `local-model-${Math.floor(Math.random() * 10000)}`;
  const modelDescription = "Local test model";
  const modelInstanceTag = "latest";
  const modelSource = "Local";

  // This set of test are easily failed due to the timeout, latency issue of
  // model pulling and converting. Not only that, Firefox seems particularly fragile
  // to face this kind of issue.

  test.describe.serial("Local model", () => {
    test.setTimeout(75000);

    test("should create local model", async ({ page }) => {
      await page.goto("/models/create", { waitUntil: "networkidle" });

      // Should disable set up button
      const setupButton = page.locator("button", { hasText: "Set up" });
      expect(await setupButton.isDisabled()).toBeTruthy();

      // Should input model id
      await page.locator("input#model-id").fill(modelId);

      // Should input model description
      await page.locator("textarea#model-description").fill(modelDescription);

      // Should select model source - local and have according fields
      const fileField = page.locator("input#model-local-file");
      await expectToSelectOption(
        page.locator("#model-definition"),
        page.locator(`[data-radix-select-viewport=""]`).getByText(modelSource),
        fileField
      );

      // Should input local model file and enable set up model button
      await fileField.setInputFiles(
        "./integration-test/data/dummy-cls-model.zip"
      );
      await expect(setupButton).toBeEnabled();

      // Should set up the model
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
