import { test, expect } from "@playwright/test";
import axios from "axios";

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

  // test.afterAll(async () => {
  //   try {
  //     await axios.post(
  //       `${process.env.NEXT_PUBLIC_MODEL_BACKEND_BASE_URL}/${process.env.NEXT_PUBLIC_API_VERSION}/models/${modelId}/instances/${modelInstanceTag}:undeploy`
  //     );
  //   } catch (err) {
  //     return Promise.reject(err);
  //   }
  // });

  test("should create sync pipeline", async ({ page }) => {
    await page.goto("/pipelines/create");

    // Should select sync mode
    const pipelineModeField = page.locator(
      "data-testid=pipelineMode-selected-option"
    );
    await expect(pipelineModeField).toHaveText(pipelineMode);

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
    await goToModelStepButton.click();
    const setupModelStepTitle = page.locator("h2", {
      hasText: "Set up Model",
    });
    expect(setupModelStepTitle).toHaveCount(1);

    // Should input model id
    const modelIdField = page.locator("input#modelId");
    await modelIdField.type(modelId);
    expect(modelIdField).toHaveValue(modelId);

    // Should select model source - local
    await page
      .locator("#react-select-modelDefinition-input")
      .click({ force: true });
    await page
      .locator("data-testid=modelDefinition-selected-option", {
        hasText: modelSource,
      })
      .click();
    await expect(
      page.locator("data-testid=modelDefinition-selected-option")
    ).toHaveText(modelSource);

    // Should input local model file
    const fileInput = page.locator("input#modelFile");
    await expect(fileInput).toHaveCount(1);
    fileInput.setInputFiles("./integration-test/data/dummy-cls-model.zip");
    await expect(fileInput).toHaveValue(/dummy-cls-model.zip/);

    // Should enable set up button
    const setupButton = page.locator("button", { hasText: "Set up" });
    expect(await setupButton.isEnabled()).toBeTruthy();
    await setupButton.click();

    // Should display model instance section
    const modelInstanceTitle = page.locator("h3", {
      hasText: "Deploy a model instance",
    });
    await expect(modelInstanceTitle).toHaveCount(1);

    // Should disable deploy button
    const deployButton = page.locator("button", { hasText: "Deploy" });
    expect(await deployButton.isDisabled()).toBeTruthy();

    // Should select model instance tag - latest
    await page
      .locator("#react-select-modelInstanceName-input")
      .click({ force: true });
    await page
      .locator("data-testid=modelInstanceName-selected-option", {
        hasText: modelInstanceTag,
      })
      .click();
    await expect(
      page.locator("data-testid=modelInstanceName-selected-option")
    ).toHaveText(modelInstanceTag);

    // Check deploy button is enabled
    expect(await deployButton.isEnabled()).toBeTruthy();

    // Deploy model and go to next step
    const setupDestinationTitle = page.locator("h2", {
      hasText: "Set up Destination",
    });
    await Promise.all([
      deployButton.click(),
      setupDestinationTitle.isVisible(),
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
    const setupPipelineTitle = page.locator("h2", {
      hasText: "Set up Pipeline",
    });

    await Promise.all([
      await goToPipelineStepButton.click(),
      await setupPipelineTitle.isVisible(),
    ]);

    // Should input pipeline id
    const piplineIdField = page.locator("input#pipelineId");
    await piplineIdField.type(pipelineId);
    await expect(piplineIdField).toHaveValue(pipelineId);

    // Should input pipeline description
    const pipelineDescriptionField = page.locator(
      "textarea#pipelineDescription"
    );
    await pipelineDescriptionField.type(pipelineDescription);
    await expect(pipelineDescriptionField).toHaveValue(pipelineDescription);

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
    await page.goto("/pipelines");

    // Should have pipeline item in list
    const pipelineItemTitle = page.locator("h3", { hasText: pipelineId });
    await expect(pipelineItemTitle).toHaveCount(1);

    // Should navigate to pipeline details page
    await Promise.all([
      page.waitForNavigation(),
      page.locator("h3", { hasText: pipelineId }).click(),
    ]);
    expect(page.url()).toEqual(
      `${process.env.NEXT_PUBLIC_MAIN_URL}/pipelines/${pipelineId}`
    );
  });

  test("should display proper pipeline details page", async ({ page }) => {
    await page.goto(`/pipelines/${pipelineId}`);

    // Should have correct title
    const pipelineTitle = page.locator("h2", { hasText: pipelineId });
    await expect(pipelineTitle).toHaveCount(1);

    // Should have correct mode label
    const pipelineModelLabel = page.locator("data-testid=pipeline-mode-label");
    await expect(pipelineModelLabel).toHaveText(pipelineMode);

    // Should have correct state label
    const pipelineStateLabel = page.locator("data-testid=state-label");
    await expect(pipelineStateLabel).toHaveText("Active");

    // Should have correct state toggle button
    const pipelineStateToggle = page.locator("#pipelineStateToggleButton");
    expect(await pipelineStateToggle.isChecked()).toBeTruthy();

    // Should have correct description
    const pipelineDescriptionField = page.locator(
      "textarea#pipelineDescription"
    );
    await expect(pipelineDescriptionField).toHaveValue(pipelineDescription);
  });

  test("should update pipeline description", async ({ page }) => {
    await page.goto(`/pipelines/${pipelineId}`);

    // Should enable edit button
    const editButton = page.locator("button", { hasText: "Edit" });
    expect(await editButton.isEnabled()).toBeTruthy();

    // Should have editable description field
    const pipelineDescriptionField = page.locator(
      "textarea#pipelineDescription"
    );
    await Promise.all([
      editButton.click(),
      pipelineDescriptionField.isEditable(),
    ]);

    // Should input new description
    await pipelineDescriptionField.fill("");

    // Should enable save button
    const saveButton = page.locator("button", { hasText: "Save" });
    expect(await saveButton.isEnabled()).toBeTruthy();

    // Should wait for update
    const succeedMessage = page.locator("h3", { hasText: "Succeed" });
    await Promise.all([saveButton.click(), succeedMessage.isVisible()]);

    // Reload page
    await page.goto(`/pipelines/${pipelineId}`);
    await expect(pipelineDescriptionField).toHaveValue("");
  });

  test("should have proper delete pipeline modal and delete this pipeline", async ({
    page,
  }) => {
    await page.goto(`/pipelines/${pipelineId}`);

    // Check we can open delete pipeline modal
    const openDeleteModelModalButton = page.locator("button", {
      hasText: "Delete",
    });
    expect(await openDeleteModelModalButton.isEnabled()).toBeTruthy();

    // Open delete pipeline modal
    const deleteResourceModal = page.locator(
      "data-testid=delete-resource-modal"
    );

    await Promise.all([
      openDeleteModelModalButton.click(),
      deleteResourceModal.isVisible(),
    ]);

    // Check delete resource modal has proper title
    const modalTitle = deleteResourceModal.locator("h2", {
      hasText: "Delete This Pipeline",
    });
    await expect(modalTitle).toHaveCount(1);

    // Check delete resource modal has proper confirmation code
    const confirmationCode = deleteResourceModal.locator("label", {
      hasText: `Please type "${pipelineId}" to confirm.`,
    });
    await expect(confirmationCode).toHaveCount(1);

    // Check delete resource modal's delete button is disabled
    const deleteButton = deleteResourceModal.locator("button", {
      hasText: "Delete",
    });
    expect(await deleteButton.isDisabled()).toBeTruthy();

    // Check delete resource modal's cancel button is enabled
    const cancelButton = deleteResourceModal.locator("button", {
      hasText: "Cancel",
    });
    expect(await cancelButton.isEnabled()).toBeTruthy();

    // Input confirmation code
    const confirmationCodeInput =
      deleteResourceModal.locator("#confirmationCode");
    await confirmationCodeInput.type(pipelineId);
    await expect(confirmationCodeInput).toHaveValue(pipelineId);
    expect(await deleteButton.isEnabled()).toBeTruthy();

    // Delete model and navigate to models page
    await Promise.all([page.waitForNavigation(), deleteButton.click()]);
    expect(page.url()).toEqual(`${process.env.NEXT_PUBLIC_MAIN_URL}/pipelines`);

    // Check whether the list item not exist
    const modelItemTitle = page.locator("h3", { hasText: pipelineId });
    await expect(modelItemTitle).toHaveCount(0);
  });
});

test.describe
  .serial("Async pipeline with new source, destination and github model", () => {
  const pipelineId = `async-pipeline-${Math.floor(Math.random() * 10000)}`;
  const pipelineDescription = "Hi i am a async pipeline";
  const pipelineMode = "Async";
  const sourceType = "HTTP";
  const modelSource = "GitHub";
  const modelId = `github-model-${Math.floor(Math.random() * 10000)}`;
  const modelInstanceTag = "v1.0-cpu";
  const destinationType = "Scylla";
  const destinationId = `test-scylla-${Math.floor(Math.random() * 10000)}`;
  const keyspace = "scylla-key";
  const username = "scylla-name";
  const password = "scylla-password";
  const address = "scylla-address";

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
    await page.goto("/pipelines/create");
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
    await goToModelStepButton.click();
    const setupModelStepTitle = page.locator("h2", { hasText: "Set up Model" });
    expect(setupModelStepTitle).toHaveCount(1);

    // Should input model id
    const modelIdField = page.locator("input#modelId");
    await modelIdField.type(modelId);
    expect(modelIdField).toHaveValue(modelId);

    // Should select model source - github
    await page
      .locator("#react-select-modelDefinition-input")
      .click({ force: true });
    await page
      .locator("data-testid=modelDefinition-selected-option", {
        hasText: modelSource,
      })
      .click();
    await expect(
      page.locator("data-testid=modelDefinition-selected-option")
    ).toHaveText(modelSource);

    // Should input GitHub repo
    const repoField = page.locator("input#modelRepo");
    await expect(repoField).toHaveCount(1);
    await repoField.fill("instill-ai/model-mobilenetv2");
    await expect(repoField).toHaveValue("instill-ai/model-mobilenetv2");

    // Should enable set up button
    const setupButton = page.locator("button", { hasText: "Set up" });
    expect(await setupButton.isEnabled()).toBeTruthy();

    // Should display model instance section
    const modelInstanceTitle = page.locator("h3", {
      hasText: "Deploy a model instance",
    });

    await Promise.all([setupButton.click(), modelInstanceTitle.isVisible()]);

    // Should disable deploy button
    const deployButton = page.locator("button", { hasText: "Deploy" });
    expect(await deployButton.isDisabled()).toBeTruthy();

    // Should select model instance tag - latest
    await page
      .locator("#react-select-modelInstanceName-input")
      .click({ force: true });
    await page
      .locator("data-testid=modelInstanceName-selected-option", {
        hasText: modelInstanceTag,
      })
      .click();
    await expect(
      page.locator("data-testid=modelInstanceName-selected-option")
    ).toHaveText(modelInstanceTag);

    // Check deploy button is enabled
    expect(await deployButton.isEnabled()).toBeTruthy();

    // Deploy model
    const setupDestinationTitle = page.locator("h2", {
      hasText: "Set up Destination",
    });

    await Promise.all([
      deployButton.click(),
      setupDestinationTitle.isVisible(),
    ]);

    // Should input destination id
    const destinationIdField = page.locator("input#id");
    await destinationIdField.fill(destinationId);

    // Should select destination type - Scylla
    await page.locator("#react-select-definition-input").click({ force: true });
    await page
      .locator("data-testid=definition-selected-option", {
        hasText: destinationType,
      })
      .click();
    await expect(
      page.locator("data-testid=definition-selected-option")
    ).toHaveText(destinationType);

    // Should input Scylla keyspace
    const keyspaceField = page.locator("input#keyspace");
    await keyspaceField.fill(keyspace);
    await expect(keyspaceField).toHaveValue(keyspace);

    // Should input Scylla username
    const usernameField = page.locator("input#username");
    await usernameField.fill(username);
    await expect(usernameField).toHaveValue(username);

    // Should input Scylla password
    const passwordField = page.locator("input#password");
    await passwordField.fill(password);
    await expect(passwordField).toHaveValue(password);

    // Should input Scylla address
    const addressField = page.locator("input#address");
    await addressField.fill(address);
    await expect(addressField).toHaveValue(address);

    // Should enable set up destination button
    const setupDestinationButton = page.locator("button", {
      hasText: "Set up",
    });
    expect(await setupDestinationButton.isEnabled()).toBeTruthy();

    const setupPipelineTitle = page.locator("h2", {
      hasText: "Set up Pipeline",
    });

    // Should set up destination
    await Promise.all([
      setupDestinationButton.click(),
      setupPipelineTitle.isVisible(),
    ]);

    // Should input pipeline id
    const piplineIdField = page.locator("input#pipelineId");
    await piplineIdField.type(pipelineId);
    await expect(piplineIdField).toHaveValue(pipelineId);

    // Should input pipeline description
    const pipelineDescriptionField = page.locator(
      "textarea#pipelineDescription"
    );
    await pipelineDescriptionField.type(pipelineDescription);
    await expect(pipelineDescriptionField).toHaveValue(pipelineDescription);

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
    await page.goto("/pipelines");

    // Should have pipeline item in list
    const pipelineItemTitle = page.locator("h3", { hasText: pipelineId });
    await expect(pipelineItemTitle).toHaveCount(1);

    // Should navigate to pipeline details page
    await Promise.all([
      page.waitForNavigation(),
      page.locator("h3", { hasText: pipelineId }).click(),
    ]);
    expect(page.url()).toEqual(
      `${process.env.NEXT_PUBLIC_MAIN_URL}/pipelines/${pipelineId}`
    );
  });

  test("should display proper pipeline details page", async ({ page }) => {
    await page.goto(`/pipelines/${pipelineId}`);

    // Should have correct title
    const pipelineTitle = page.locator("h2", { hasText: pipelineId });
    await expect(pipelineTitle).toHaveCount(1);

    // Should have correct mode label
    const pipelineModelLabel = page.locator("data-testid=pipeline-mode-label");
    await expect(pipelineModelLabel).toHaveText(pipelineMode);

    // Should have correct state label
    const pipelineStateLabel = page.locator("data-testid=state-label");
    await expect(pipelineStateLabel).toHaveText("Unspecified");

    // Should have correct state toggle button
    const pipelineStateToggle = page.locator("#pipelineStateToggleButton");
    expect(await pipelineStateToggle.isChecked()).not.toBeTruthy();

    // Should have correct description
    const pipelineDescriptionField = page.locator(
      "textarea#pipelineDescription"
    );
    await expect(pipelineDescriptionField).toHaveValue(pipelineDescription);
  });

  test("should update pipeline description", async ({ page }) => {
    await page.goto(`/pipelines/${pipelineId}`);

    // Should enable edit button
    const editButton = page.locator("button", { hasText: "Edit" });
    expect(await editButton.isEnabled()).toBeTruthy();

    // Should have editable description field
    const pipelineDescriptionField = page.locator(
      "textarea#pipelineDescription"
    );
    await Promise.all([
      editButton.click(),
      pipelineDescriptionField.isEditable(),
    ]);

    // Should input new description
    await pipelineDescriptionField.fill("");

    // Should enable save button
    const saveButton = page.locator("button", { hasText: "Save" });
    expect(await saveButton.isEnabled()).toBeTruthy();

    // Should wait for update
    const succeedMessage = page.locator("h3", { hasText: "Succeed" });
    await Promise.all([saveButton.click(), succeedMessage.isVisible()]);

    // Reload page
    await page.goto(`/pipelines/${pipelineId}`);
    await expect(pipelineDescriptionField).toHaveValue("");
  });

  test("should have proper delete pipeline modal and delete this pipeline", async ({
    page,
  }) => {
    await page.goto(`/pipelines/${pipelineId}`);

    // Check we can open delete pipeline modal
    const openDeleteModelModalButton = page.locator("button", {
      hasText: "Delete",
    });
    expect(await openDeleteModelModalButton.isEnabled()).toBeTruthy();

    // Open delete pipeline modal
    const deleteResourceModal = page.locator(
      "data-testid=delete-resource-modal"
    );
    await Promise.all([
      openDeleteModelModalButton.click(),
      deleteResourceModal.isVisible(),
    ]);

    // Check delete resource modal has proper title
    const modalTitle = deleteResourceModal.locator("h2", {
      hasText: "Delete This Pipeline",
    });
    await expect(modalTitle).toHaveCount(1);

    // Check delete resource modal has proper confirmation code
    const confirmationCode = deleteResourceModal.locator("label", {
      hasText: `Please type "${pipelineId}" to confirm.`,
    });
    await expect(confirmationCode).toHaveCount(1);

    // Check delete resource modal's delete button is disabled
    const deleteButton = deleteResourceModal.locator("button", {
      hasText: "Delete",
    });
    expect(await deleteButton.isDisabled()).toBeTruthy();

    // Check delete resource modal's cancel button is enabled
    const cancelButton = deleteResourceModal.locator("button", {
      hasText: "Cancel",
    });
    expect(await cancelButton.isEnabled()).toBeTruthy();

    // Input confirmation code
    const confirmationCodeInput =
      deleteResourceModal.locator("#confirmationCode");
    await confirmationCodeInput.type(pipelineId);
    await expect(confirmationCodeInput).toHaveValue(pipelineId);
    expect(await deleteButton.isEnabled()).toBeTruthy();

    // Delete model and navigate to models page
    await Promise.all([page.waitForNavigation(), deleteButton.click()]);
    expect(page.url()).toEqual(`${process.env.NEXT_PUBLIC_MAIN_URL}/pipelines`);

    // Check whether the list item not exist
    const modelItemTitle = page.locator("h3", { hasText: pipelineId });
    await expect(modelItemTitle).toHaveCount(0);
  });
});
