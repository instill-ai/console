import { test, expect } from "@playwright/test";
import {
  expectCorrectModelDetails,
  expectCorrectModelList,
  expectToDeleteModel,
  expectToDeployModel,
  expectToUpdateModelDescription,
} from "./common/model";

const modelId = `github-model-${Math.floor(Math.random() * 10000)}`;
const modelSource = "GitHub";
const modelDescription = "Github test model";
const modelRepo = "instill-ai/model-mobilenetv2";
const modelInstanceTag = "v1.0-cpu";

// This set of test are easily failed due to the timeout, latency issue of
// model pulling and converting. Not only that, Firefox seems particularly fragile
// to face this kind of issue.

test.use({
  launchOptions: {
    slowMo: 50,
  },
});

test.describe.serial("GitHub model", () => {
  test.setTimeout(75000);

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
        "#react-select-modelInstanceTag-option-1"
      ),
      modelState: "STATE_ONLINE",
      modelTask: "Classification",
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
