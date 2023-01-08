import { env } from "@/utils/config";
import { test, expect } from "@playwright/test";
import {
  expectCorrectPipelineDetails,
  expectCorrectPipelineList,
  expectToDeletePipeline,
  expectToUpdatePipelineDescription,
} from "./common/pipeline";
import {
  createInstillAxiosTestClient,
  deleteDestination,
  deleteModel,
  deleteSource,
  expectToSelectReactSelectOption,
} from "./helper";

const pipelineId = `async-pipeline-${Math.floor(Math.random() * 10000)}`;
const pipelineDescription = "Hi i am a async pipeline";
const pipelineMode = "Async";
const sourceType = "HTTP";
const modelSource = "Local";
const modelId = `github-local-${Math.floor(Math.random() * 10000)}`;
const modelInstanceTag = "latest";
const destinationType = "Scylla";
const destinationId = `test-scylla-${Math.floor(Math.random() * 10000)}`;
const keyspace = "scylla-key";
const username = "scylla-name";
const password = "scylla-password";
const address = "scylla-address";

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
  .serial("Async pipeline with new source, destination and local model", () => {
  test.afterAll(async () => {
    try {
      const client = createInstillAxiosTestClient();

      await client.post(
        `${env(
          "NEXT_PUBLIC_API_VERSION"
        )}/models/${modelId}/instances/${modelInstanceTag}/undeploy`
      );
      await deleteDestination(destinationId);
      await deleteSource("source-http");
    } catch (err) {
      return Promise.reject(err);
    }
  });

  test("should create async pipeline", async ({ page }) => {
    await page.goto("/pipelines/create", { waitUntil: "networkidle" });

    // Should select async mode
    await expectToSelectReactSelectOption(
      page.locator("#react-select-pipelineMode-input"),
      page.locator("data-testid=pipelineMode-selected-option", {
        hasText: pipelineMode,
      })
    );

    // Should select source type - http
    await expectToSelectReactSelectOption(
      page.locator("#react-select-existingSourceId-input"),
      page.locator("data-testid=existingSourceId-selected-option", {
        hasText: sourceType,
      })
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
      setupModelStepTitle.isVisible(),
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

    // Should set up model and display model instance section
    const modelInstanceTitle = page.locator("h3", {
      hasText: "Deploy a model instance",
    });

    await Promise.all([setupButton.click(), modelInstanceTitle.isVisible()]);

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

    // Should deploy model and go to next step
    const destinationIdField = page.locator("input#id");
    await Promise.all([deployButton.click(), destinationIdField.isVisible()]);

    // Should input destination id
    await destinationIdField.fill(destinationId);

    // Should select destination type - Scylla
    const keyspaceField = page.locator("input#keyspace");
    await expectToSelectReactSelectOption(
      page.locator("#react-select-definition-input"),
      page.locator("data-testid=definition-selected-option", {
        hasText: destinationType,
      }),
      keyspaceField
    );

    // Should input Scylla keyspace
    await keyspaceField.fill(keyspace);

    // Should input Scylla username
    const usernameField = page.locator("input#username");
    await usernameField.fill(username);

    // Should input Scylla password
    const passwordField = page.locator("input#password");
    await passwordField.fill(password);

    // Should input Scylla address
    const addressField = page.locator("input#address");
    await addressField.fill(address);

    // Should enable set up destination button
    const setupDestinationButton = page.locator("button", {
      hasText: "Set up",
    });
    expect(await setupDestinationButton.isEnabled()).toBeTruthy();

    // Should set up destination and go to pipeline step
    const piplineIdField = page.locator("input#pipelineId");
    await Promise.all([
      setupDestinationButton.click(),
      piplineIdField.isVisible(),
    ]);

    // Should input pipeline id
    await piplineIdField.fill(pipelineId);

    // Should input pipeline description
    const pipelineDescriptionField = page.locator(
      "textarea#pipelineDescription"
    );
    await pipelineDescriptionField.fill(pipelineDescription);

    // Should enable set up button
    const setupPipelineButton = page.locator("button", { hasText: "Set up" });
    expect(await setupPipelineButton.isEnabled()).toBeTruthy();

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
