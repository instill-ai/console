import { env, expectToSelectOption } from "./helper";
import { test, expect } from "@playwright/test";
import {
  expectCorrectPipelineDetails,
  expectCorrectPipelineList,
  expectToDeletePipeline,
  expectToUpdatePipelineDescription,
} from "./common/pipeline";

export function handleSyncPipelineTest() {
  const pipelineId = `sync-pipeline-${Math.floor(Math.random() * 10000)}`;
  const pipelineDescription = "Hi i am a sync pipeline";
  const pipelineMode = "Sync";
  const sourceType = "Response";
  const modelSource = "Local";
  const modelId = `local-model-${Math.floor(Math.random() * 10000)}`;
  const modelInstanceTag = "latest";
  const destinationType = "Response";

  test.describe
    .serial("Sync pipeline with new source, destination and local model", () => {
    test("should create sync pipeline", async ({ page }) => {
      await page.goto("/pipelines/create", { waitUntil: "networkidle" });

      // Should select sync mode
      const pipelineModeField = page.locator("#pipeline-mode");
      await expect(pipelineModeField).toHaveText(pipelineMode);

      // Should select source type - http
      const goToModelStepButton = page.locator("button", { hasText: "Next" });
      await expectToSelectOption(
        page.locator("#existing-source-id"),
        page.locator(`[data-radix-select-viewport=""]`).getByText(sourceType)
      );
      expect(await goToModelStepButton.isEnabled()).toBeTruthy();

      // Should go to next step
      const setupModelStepTitle = page.locator("h2", {
        hasText: "Set up Model",
      });

      await Promise.all([
        setupModelStepTitle.waitFor(),
        goToModelStepButton.click(),
      ]);

      // Should input model id
      await page.locator("input#model-id").fill(modelId);

      // Should select model source - local and display file field
      const fileField = page.locator("input#model-local-file");
      await expectToSelectOption(
        page.locator("#model-definition"),
        page.locator(`[data-radix-select-viewport=""]`).getByText(modelSource),
        fileField
      );

      // Should input local model file and enable set up model button
      const setupButton = page.locator("button", { hasText: "Set up" });
      await fileField.setInputFiles(
        "./integration-test/data/dummy-cls-model.zip"
      );
      expect(await setupButton.isEnabled()).toBeTruthy();

      // Should set up model and got to next step
      const setupDestinationTitle = page.locator("h2", {
        hasText: "Set up Destination",
      });
      await Promise.all([setupDestinationTitle.waitFor(), setupButton.click()]);

      // Should disable destination selection field
      const destinationFieldOption = page.locator("#existing-destination-id");
      expect(await destinationFieldOption.isDisabled()).toBeTruthy();
      await expect(destinationFieldOption).toHaveText(destinationType);

      // Should enable next button
      const goToPipelineStepButton = page.locator("button", {
        hasText: "Next",
      });
      expect(await goToPipelineStepButton.isEnabled()).toBeTruthy();

      // Should go to next step
      const piplineIdField = page.locator("input#pipeline-id");

      await Promise.all([
        piplineIdField.waitFor(),
        goToPipelineStepButton.click(),
      ]);

      // Should input wrong id
      await piplineIdField.fill("Wrong-id");
      const setupPipelineButton = page.locator("button", { hasText: "Set up" });
      expect(await setupPipelineButton.isEnabled()).toBeTruthy();
      await setupPipelineButton.click();

      // Should have warning label
      const warningLabel = page.locator("data-testid=pipeline-id-label-error");
      await expect(warningLabel).toHaveText(
        "Resource ID restricts to lowercase letters, numbers, and hyphen, with the first character a letter, the last a letter or a number, and a 63 character maximum."
      );

      // Should input correct id
      await piplineIdField.fill("");
      await piplineIdField.fill(pipelineId);

      // Should input pipeline description
      const pipelineDescriptionField = page.locator(
        "textarea#pipeline-description"
      );
      await pipelineDescriptionField.fill(pipelineDescription);

      await setupPipelineButton.isEnabled();

      // Should set up pipeline
      await Promise.all([
        page.waitForURL(`${env("NEXT_PUBLIC_CONSOLE_BASE_URL")}/pipelines`),
        setupPipelineButton.click(),
      ]);
    });

    test("should have proper pipline list and navigate to pipline details page", async ({
      page,
    }) => {
      await expectCorrectPipelineList(page, pipelineId);
    });

    test("should display proper pipeline details page", async ({ page }) => {
      await expectCorrectPipelineDetails({
        page,
        id: pipelineId,
        mode: pipelineMode,
        state: "STATE_ACTIVE",
        description: pipelineDescription,
      });
    });

    test("should update pipeline description", async ({ page }) => {
      await expectToUpdatePipelineDescription(page, pipelineId, "");
    });

    test("should have proper delete pipeline modal and delete this pipeline", async ({
      page,
    }) => {
      await expectToDeletePipeline(page, pipelineId);
    });
  });
}
