import { env } from "@/utils/config";
import { test, expect } from "@playwright/test";
import {
  expectCorrectPipelineDetails,
  expectCorrectPipelineList,
  expectToDeletePipeline,
  expectToUpdatePipelineDescription,
} from "./common/pipeline";
import {
  deleteDestination,
  deleteModel,
  deleteSource,
  expectToSelectReactSelectOption,
} from "./helper";

const pipelineId = `sync-pipeline-${Math.floor(Math.random() * 10000)}`;
const pipelineDescription = "Hi i am a sync pipeline";
const pipelineMode = "Sync";
const sourceType = "HTTP";
const modelSource = "Local";
const modelId = `local-model-${Math.floor(Math.random() * 10000)}`;
const modelInstanceTag = "latest";
const destinationType = "HTTP";

test.use({
  launchOptions: {
    slowMo: 50,
  },
});

test.afterAll(async () => {
  try {
    // We need to clean up destination and source too
    await deleteDestination("destination-http");
    await deleteSource("source-http");
    await deleteModel(modelId);
  } catch (err) {
    console.log(err);
  }
});

test.describe
  .serial("Sync pipeline with new source, destination and local model", () => {
  test("should create sync pipeline", async ({ page }) => {
    await page.goto("/pipelines/create", { waitUntil: "networkidle" });

    // Should select sync mode
    const pipelineModeField = page.locator(
      "data-testid=pipelineMode-selected-option"
    );
    await expect(pipelineModeField).toHaveText(pipelineMode);

    // Should select source type - http
    const goToModelStepButton = page.locator("button", { hasText: "Next" });
    await expectToSelectReactSelectOption(
      page.locator("#react-select-existingSourceId-input"),
      page.locator("data-testid=existingSourceId-selected-option", {
        hasText: sourceType,
      })
    );
    expect(await goToModelStepButton.isEnabled()).toBeTruthy();

    // Should go to next step
    const setupModelStepTitle = page.locator("h2", {
      hasText: "Set up Model",
    });

    await Promise.all([
      setupModelStepTitle.waitFor({ state: "visible" }),
      goToModelStepButton.click(),
    ]);

    // Should input model id
    const modelIdField = page.locator("input#modelId");
    await modelIdField.fill(modelId);

    // Should select model source - local and display file field
    const fileField = page.locator("input#file");
    await expectToSelectReactSelectOption(
      page.locator("#react-select-modelDefinition-input"),
      page.locator("data-testid=modelDefinition-selected-option", {
        hasText: modelSource,
      }),
      fileField
    );

    // Should input local model file and enable set up model button
    const setupButton = page.locator("button", { hasText: "Set up" });
    await fileField.setInputFiles(
      "./integration-test/data/dummy-cls-model.zip"
    );
    expect(await setupButton.isEnabled()).toBeTruthy();

    // Should set up model and display model instance section
    const succeedMessage = page.locator("h3", { hasText: "Succeed" });

    await Promise.all([
      succeedMessage.waitFor({ state: "visible" }),
      setupButton.click(),
    ]);

    // Should disable deploy button
    const deployButton = page.locator("button", { hasText: "Deploy" });
    expect(await deployButton.isDisabled()).toBeTruthy();

    // Should select model instance tag - latest and enable deploy button
    await expectToSelectReactSelectOption(
      page.locator("#react-select-modelInstanceTag-input"),
      page.locator("data-testid=modelInstanceTag-selected-option", {
        hasText: modelInstanceTag,
      })
    );
    expect(await deployButton.isEnabled()).toBeTruthy();

    // Should deploy model and go to next step
    const setupDestinationTitle = page.locator("h2", {
      hasText: "Set up Destination",
    });
    await Promise.all([
      setupDestinationTitle.waitFor({ state: "visible" }),
      deployButton.click(),
    ]);

    // Should disable destination selection field
    const destinationFieldOption = page.locator(
      "#react-select-existingDestinationId-input"
    );
    expect(await destinationFieldOption.isDisabled()).toBeTruthy();
    await expect(
      page.locator("data-testid=existingDestinationId-selected-option")
    ).toHaveText(destinationType);

    // Should enable next button
    const goToPipelineStepButton = page.locator("button", {
      hasText: "Next",
    });
    expect(await goToPipelineStepButton.isEnabled()).toBeTruthy();

    // Should go to next step
    const piplineIdField = page.locator("input#pipelineId");

    await Promise.all([
      piplineIdField.waitFor({ state: "visible" }),
      goToPipelineStepButton.click(),
    ]);

    // Should input wrong id
    await piplineIdField.fill("Wrong-id");
    const setupPipelineButton = page.locator("button", { hasText: "Set up" });
    expect(await setupPipelineButton.isEnabled()).toBeTruthy();
    await setupPipelineButton.click();

    // Should have warning label
    const warningLabel = page.locator("label[for='pipelineId']");
    await expect(warningLabel).toHaveText(
      "ID * - Resource ID restricts to lowercase letters, numbers, and hyphen, with the first character a letter, the last a letter or a number, and a 63 character maximum."
    );

    // Should input correct id
    await piplineIdField.fill("");
    await piplineIdField.fill(pipelineId);

    // Should input pipeline description
    const pipelineDescriptionField = page.locator(
      "textarea#pipelineDescription"
    );
    await pipelineDescriptionField.fill(pipelineDescription);

    // Should set up pipeline
    await Promise.all([page.waitForNavigation(), setupPipelineButton.click()]);
    expect(page.url()).toEqual(
      `${env("NEXT_PUBLIC_CONSOLE_BASE_URL")}/pipelines`
    );
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
