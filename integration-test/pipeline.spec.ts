import { test, expect } from "@playwright/test";
import axios from "axios";
import {
  expectCorrectPipelineDetails,
  expectCorrectPipelineList,
  expectToDeletePipeline,
  expectToUpdatePipelineDescription,
} from "./common/pipeline";
import { delay } from "./helper";

test.describe
  .serial("Sync pipeline with new source, destination and local model", () => {
  const pipelineId = `sync-pipeline-${Math.floor(Math.random() * 10000)}`;
  const pipelineDescription = "Hi i am a sync pipeline";
  const pipelineMode = "Sync";
  const sourceType = "HTTP";
  const modelSource = "Local";
  const modelId = `local-model-${Math.floor(Math.random() * 10000)}`;
  const modelInstanceTag = "latest";
  const destinationType = "HTTP";

  test.afterEach(async () => {
    await delay(500);
  });

  test.afterAll(async () => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_MODEL_BACKEND_BASE_URL}/${process.env.NEXT_PUBLIC_API_VERSION}/models/${modelId}/instances/${modelInstanceTag}:undeploy`
      );
    } catch (err) {
      return Promise.reject(err);
    }
  });

  test("should create sync pipeline", async ({ page }) => {
    await page.goto("/pipelines/create", { waitUntil: "networkidle" });

    // Should select sync mode
    const pipelineModeField = page.locator(
      "data-testid=pipelineMode-selected-option"
    );
    await expect(pipelineModeField).toHaveText(pipelineMode);

    // Should select source type - http
    const goToModelStepButton = page.locator("button", { hasText: "Next" });
    await page
      .locator("#react-select-existingSourceId-input")
      .click({ force: true });
    await page
      .locator("data-testid=existingSourceId-selected-option", {
        hasText: sourceType,
      })
      .click();
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
    const modelDefinitinoOption = page.locator(
      "#react-select-modelDefinition-input"
    );
    const fileField = page.locator("input#file");
    await modelDefinitinoOption.click({ force: true });
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
    await page
      .locator("#react-select-modelInstanceTag-input")
      .click({ force: true });
    await page
      .locator("data-testid=modelInstanceTag-selected-option", {
        hasText: modelInstanceTag,
      })
      .click();
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
    expect(page.url()).toEqual(`${process.env.NEXT_PUBLIC_MAIN_URL}/pipelines`);
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

test.describe
  .serial("Async pipeline with new source, destination and local model", () => {
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

  test.afterEach(async () => {
    await delay(500);
  });

  // test.afterAll(async () => {
  //   try {
  //     await axios.post(
  //       `${process.env.NEXT_PUBLIC_MODEL_BACKEND_BASE_URL}/${process.env.NEXT_PUBLIC_API_VERSION}/models/${modelId}/instances/${modelInstanceTag}:undeploy`
  //     );
  //   } catch (err) {
  //     return Promise.reject(err);
  //   }
  // });

  test("should create async pipeline", async ({ page }) => {
    await page.goto("/pipelines/create", { waitUntil: "networkidle" });
    const pipelineModeOption = page.locator("#react-select-pipelineMode-input");
    await pipelineModeOption.isVisible();

    // Should select async mode
    await pipelineModeOption.click({ force: true });
    await page
      .locator("data-testid=pipelineMode-selected-option", {
        hasText: pipelineMode,
      })
      .click();
    await expect(
      page.locator("data-testid=pipelineMode-selected-option")
    ).toHaveText(pipelineMode);

    // Should select source type - http
    await page
      .locator("#react-select-existingSourceId-input")
      .click({ force: true });
    await page
      .locator("data-testid=existingSourceId-selected-option", {
        hasText: sourceType,
      })
      .click();
    await expect(
      page.locator("data-testid=existingSourceId-selected-option")
    ).toHaveText(sourceType);

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
    const modelDefinitinoOption = page.locator(
      "#react-select-modelDefinition-input"
    );
    const fileField = page.locator("input#file");
    await modelDefinitinoOption.click({ force: true });
    const selectedModelDefinition = page.locator(
      "data-testid=modelDefinition-selected-option",
      {
        hasText: modelSource,
      }
    );
    await Promise.all([selectedModelDefinition.click(), fileField.isVisible()]);

    // Should input local model file and enable set up model button
    const setupButton = page.locator("button", { hasText: "Set up" });
    await Promise.all([
      setupButton.isEnabled(),
      fileField.setInputFiles("./integration-test/data/dummy-cls-model.zip"),
    ]);

    // Should set up model and display model instance section
    const modelInstanceTitle = page.locator("h3", {
      hasText: "Deploy a model instance",
    });

    await Promise.all([setupButton.click(), modelInstanceTitle.isVisible()]);

    // Should disable deploy button
    const deployButton = page.locator("button", { hasText: "Deploy" });
    expect(await deployButton.isDisabled()).toBeTruthy();

    // Should select model instance tag - latest and enable deploy button
    await page
      .locator("#react-select-modelInstanceTag-input")
      .click({ force: true });
    await Promise.all([
      deployButton.isEnabled(),
      page
        .locator("data-testid=modelInstanceTag-selected-option", {
          hasText: modelInstanceTag,
        })
        .click(),
    ]);

    // Should deploy model and go to next step
    const destinationIdField = page.locator("input#id");
    await Promise.all([deployButton.click(), destinationIdField.isVisible()]);

    // Should input destination id
    await destinationIdField.fill(destinationId);

    // Should select destination type - Scylla
    const destinationDefinitionOption = page.locator(
      "#react-select-definition-input"
    );
    const keyspaceField = page.locator("input#keyspace");
    await destinationDefinitionOption.click({ force: true });
    const selectedDestinationDefinition = page.locator(
      "data-testid=definition-selected-option",
      {
        hasText: destinationType,
      }
    );

    await Promise.all([
      selectedDestinationDefinition.click(),
      keyspaceField.isVisible(),
    ]);

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
    expect(page.url()).toEqual(`${process.env.NEXT_PUBLIC_MAIN_URL}/pipelines`);
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
