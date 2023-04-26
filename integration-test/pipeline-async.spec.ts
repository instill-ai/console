import { env, expectToSelectOption } from "./helper";
import { test, expect } from "@playwright/test";
import {
  expectCorrectPipelineDetails,
  expectCorrectPipelineList,
  expectToDeletePipeline,
  expectToUpdatePipelineDescription,
} from "./common/pipeline";

export function handleAsyncPipelineTest() {
  const pipelineId = `async-pipeline-${Math.floor(Math.random() * 10000)}`;
  const pipelineDescription = "Hi i am a async pipeline";
  const pipelineMode = "Async";
  const sourceType = "HTTP";
  const modelSource = "Local";
  const modelId = `github-local-${Math.floor(Math.random() * 10000)}`;
  const destinationType = "Scylla";
  const destinationId = `test-scylla-${Math.floor(Math.random() * 10000)}`;
  const keyspace = "scylla-key";
  const username = "scylla-name";
  const password = "scylla-password";
  const address = "scylla-address";

  test.describe
    .serial("Async pipeline with new source, destination and local model", () => {
    test("should create async pipeline", async ({ page }) => {
      await page.goto("/pipelines/create", { waitUntil: "networkidle" });

      // Should select async mode
      await expectToSelectOption(
        page.locator("#pipeline-mode"),
        page.locator(`[data-radix-select-viewport=""]`).getByText(pipelineMode)
      );

      // Should select source type - http
      await expectToSelectOption(
        page.locator("#existing-source-id"),
        page.locator(`[data-radix-select-viewport=""]`).getByText(sourceType)
      );

      // Should enable next button
      const goToModelStepButton = page.locator("button", { hasText: "Next" });
      expect(await goToModelStepButton.isEnabled()).toBeTruthy();

      // Should go to next step
      const setupModelStepTitle = page.locator("h2", {
        hasText: "Set up Model",
      });

      await Promise.all([
        goToModelStepButton.click(),
        setupModelStepTitle.waitFor(),
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

      // Should input destination id
      await page.locator("input#destination-id").fill(destinationId);

      // Should select destination type - Scylla
      const keyspaceField = page.locator("input#keyspace");
      await expectToSelectOption(
        page.locator("#destination-definition"),
        page
          .locator(`[data-radix-select-viewport=""]`)
          .getByText(destinationType),
        keyspaceField
      );

      // Should input Scylla keyspace
      await keyspaceField.fill(keyspace);

      // Should input Scylla username
      await page.locator("input#username").fill(username);

      // Should input Scylla password
      await page.locator("input#password").fill(password);

      // Should input Scylla address
      await page.locator("input#address").fill(address);

      // Should enable set up destination button
      const setupDestinationButton = page.locator("button", {
        hasText: "Set up",
      });
      expect(await setupDestinationButton.isEnabled()).toBeTruthy();

      // Should set up destination and go to pipeline step
      const piplineIdField = page.locator("input#pipeline-id");
      await Promise.all([
        setupDestinationButton.click(),
        piplineIdField.waitFor(),
      ]);

      // Should input pipeline id
      await piplineIdField.fill(pipelineId);

      // Should input pipeline description
      await page
        .locator("textarea#pipeline-description")
        .fill(pipelineDescription);

      // Should enable set up button
      const setupPipelineButton = page.locator("button", { hasText: "Set up" });
      expect(await setupPipelineButton.isEnabled()).toBeTruthy();

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
        state: "STATE_UNSPECIFIED",
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
