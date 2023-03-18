import { test, expect } from "@playwright/test";
import {
  expectCorrectModelDetails,
  expectCorrectModelList,
  expectToDeployModel,
  expectToUpdateModelDescription,
} from "./common/model";

export function handleLocalModelTest() {
  const modelId = `local-model-${Math.floor(Math.random() * 10000)}`;
  const modelDescription = "Local test model";
  const modelInstanceTag = "latest";
  const modelSource = "Local";

  // This set of test are easily failed due to the timeout, latency issue of
  // model pulling and converting. Not only that, Firefox seems particularly fragile
  // to face this kind of issue.

  test.use({
    launchOptions: {
      slowMo: 50,
    },
  });

  test.describe.serial("Local model", () => {
    test.setTimeout(75000);

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
        modelInstanceTagOptionLocator: page.locator(
          "#react-select-modelInstanceTag-option-0"
        ),
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
