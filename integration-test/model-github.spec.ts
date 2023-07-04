import { test, expect } from "@playwright/test";
import {
  expectCorrectModelDetails,
  expectCorrectModelList,
  expectToUpdateModelDescription,
} from "./common/model";
import { env, expectToSelectOption } from "./helper";

export function handleGithubModelTest() {
  const modelId = `github-model-${Math.floor(Math.random() * 10000)}`;
  const modelSource = "GitHub";
  const modelDescription = "Github test model";
  const modelRepo = "instill-ai/model-mobilenetv2-dvc";
  const modelTag = "v1.0-cpu";

  // This set of test are easily failed due to the timeout, latency issue of
  // model pulling and converting. Not only that, Firefox seems particularly fragile
  // to face this kind of issue.

  test.describe.serial("GitHub model", () => {
    test("should create github model", async ({ page }) => {
      await page.goto("/model-hub/create", { waitUntil: "networkidle" });

      // Should disable set up button
      const setupButton = page.locator("button", { hasText: "Set up" });
      expect(await setupButton.isDisabled()).toBeTruthy();

      // Should input model id
      await page.locator("input#model-id").fill(modelId);

      // Should input model description
      await page.locator("textarea#model-description").fill(modelDescription);

      // Should select model source - GitHub and display according fields
      const githubRepoInput = page.locator("input#model-github-repo-url");
      await expectToSelectOption(
        page.locator("#model-definition"),
        page.locator(`[data-radix-select-viewport=""]`).getByText(modelSource),
        githubRepoInput
      );

      // Should input GitHub repo url
      await githubRepoInput.fill(modelRepo);
      await page.locator("input#model-github-tag").fill(modelTag);
      await expect(setupButton).toBeEnabled();

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
