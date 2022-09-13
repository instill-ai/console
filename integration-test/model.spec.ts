import { test, expect } from "@playwright/test";

test.describe.serial("Local model", () => {
  const modelId = `local-model-${Math.floor(Math.random() * 10000)}`;
  const modelDescription = "Local test model";
  const modelAdditionalDescription = " hi, i am here";
  const modelInstanceTag = "latest";
  const modelSource = "Local";

  test("should create local model", async ({ page }) => {
    await page.goto("/models/create");

    // Check set up button is disabled
    const setupButton = page.locator("button", { hasText: "Set up" });
    expect(await setupButton.isDisabled()).toBeTruthy();

    // Input model id
    const idInput = page.locator("input#modelId");
    await idInput.type(modelId);
    await expect(idInput).toHaveValue(modelId);

    // Input model description
    const descriptionInput = page.locator("textarea#description");
    await descriptionInput.type(modelDescription);
    await expect(descriptionInput).toHaveValue(modelDescription);

    // Select model source - local
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

    // Input local model file
    const fileInput = page.locator("input#file");
    await expect(fileInput).toHaveCount(1);
    fileInput.setInputFiles("./integration-test/data/dummy-cls-model.zip");
    await expect(fileInput).toHaveValue(/dummy-cls-model.zip/);

    // Check setup button is enabled
    expect(await setupButton.isEnabled()).toBeTruthy();

    // Create model
    await setupButton.click();

    // Check model instance is displayed
    const modelInstanceTitle = page.locator("h3", {
      hasText: "Deploy a model instance",
    });
    await expect(modelInstanceTitle).toHaveCount(1);

    // Check deploy button is disabled
    const deployButton = page.locator("button", { hasText: "Deploy" });
    expect(await deployButton.isDisabled()).toBeTruthy();

    // Select latest model instance
    await page
      .locator("#react-select-modelInstanceId-input")
      .click({ force: true });
    await page
      .locator("data-testid=modelInstanceId-selected-option", {
        hasText: modelInstanceTag,
      })
      .click();
    await expect(
      page.locator("data-testid=modelInstanceId-selected-option")
    ).toHaveText(modelInstanceTag);

    // Check deploy button is enabled
    expect(await deployButton.isEnabled()).toBeTruthy();

    // Deploy model
    await Promise.all([page.waitForNavigation(), deployButton.click()]);
    expect(page.url()).toEqual(`${process.env.NEXT_PUBLIC_MAIN_URL}/models`);
  });

  test("should have proper model list and navigate to model details page", async ({
    page,
  }) => {
    await page.goto("/models");

    // Should have model item in list
    const modelItemTitle = page.locator("h3", { hasText: modelId });
    await expect(modelItemTitle).toHaveCount(1);

    // Should navigate to model details page
    await Promise.all([
      page.waitForNavigation(),
      page.locator("h3", { hasText: modelId }).click(),
    ]);
    expect(page.url()).toEqual(
      `${process.env.NEXT_PUBLIC_MAIN_URL}/models/${modelId}`
    );
  });

  test("should display proper model details page", async ({ page }) => {
    await page.goto(`/models/${modelId}`);

    // Should have proper title
    const modelDetailsPageTitle = page.locator("h2", { hasText: modelId });
    await expect(modelDetailsPageTitle).toHaveCount(2);

    // Should have proper model description
    const modelDescriptionField = page.locator("#description");
    await expect(modelDescriptionField).toHaveValue(modelDescription);

    // Should have correct model instance tag - latest
    const modelInstanceTagOption = page.locator(
      "data-testid=modelInstanceTag-selected-option"
    );
    await expect(modelInstanceTagOption).toHaveText(modelInstanceTag);

    // Should display online
    const modelStateLabel = page.locator("data-testid=state-label");
    await expect(modelStateLabel).toHaveText("Online");

    // Should display task type classification
    const modelTaskLabel = page.locator("data-testid=model-task-label");
    await expect(modelTaskLabel).toHaveText("CLASSIFICATION");

    // Should have state toggle at on state
    const stateToggle = page.locator("#pipelineStateToggleButton");
    expect(await stateToggle.isChecked()).toBeTruthy();
  });

  test("should update description", async ({ page }) => {
    await page.goto(`/models/${modelId}`);

    // Should have edit button enabled
    const editButton = page.locator("button", { hasText: "Edit" });
    expect(await editButton.isEnabled()).toBeTruthy();

    // Should have description field disabled
    const modelDescriptionField = page.locator("#description");
    expect(await modelDescriptionField.isDisabled()).toBeTruthy();

    // Should enabled description field
    await editButton.click();
    expect(await modelDescriptionField.isEnabled()).toBeTruthy();

    // Should have save button
    const saveButton = page.locator("button", { hasText: "Save" });
    expect(await saveButton.isEnabled()).toBeTruthy();

    // Should update model description
    await modelDescriptionField.type(modelAdditionalDescription);
    await expect(modelDescriptionField).toHaveValue(
      modelDescription + modelAdditionalDescription
    );
    await Promise.all([
      page.waitForResponse(
        new URL(
          `/${process.env.NEXT_PUBLIC_API_VERSION}/models/${modelId}`,
          `${process.env.NEXT_PUBLIC_MODEL_BACKEND_BASE_URL}`
        ).toString()
      ),
      saveButton.click(),
    ]);

    // Reload page
    await page.goto(`/models/${modelId}`);

    // Should have updated model description
    await expect(modelDescriptionField).toHaveCount(1);
    await expect(modelDescriptionField).toHaveValue(
      modelDescription + modelAdditionalDescription
    );
  });

  test("should have proper delete model modal and delete this model", async ({
    page,
  }) => {
    await page.goto(`/models/${modelId}`);

    // Check we can open delete model modal (To avoid flaky test)
    const openDeleteModelModalButton = page.locator("button", {
      hasText: "Delete",
    });
    expect(await openDeleteModelModalButton.isEnabled()).toBeTruthy();

    // Open delete model modal
    await openDeleteModelModalButton.click();
    const deleteResourceModal = page.locator(
      "data-testid=delete-resource-modal"
    );
    await expect(deleteResourceModal).toHaveCount(1);

    // Check delete resource modal has proper title
    const modalTitle = deleteResourceModal.locator("h2", {
      hasText: "Delete This Model",
    });
    await expect(modalTitle).toHaveCount(1);

    // Check delete resource modal has proper confirmation code
    const confirmationCode = deleteResourceModal.locator("label", {
      hasText: `Please type "${modelId}" to confirm.`,
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
    await confirmationCodeInput.type(modelId);
    await expect(confirmationCodeInput).toHaveValue(modelId);
    expect(await deleteButton.isEnabled()).toBeTruthy();

    // Delete model and navigate to models page
    await Promise.all([page.waitForNavigation(), deleteButton.click()]);
    expect(page.url()).toEqual(`${process.env.NEXT_PUBLIC_MAIN_URL}/models`);

    // Check whether the list item not exist
    const modelItemTitle = page.locator("h3", { hasText: modelId });
    await expect(modelItemTitle).toHaveCount(0);
  });
});

test.describe.serial("Hugging face model", () => {
  const modelId = `huggingface-model-${Math.floor(Math.random() * 10000)}`;
  const modelDescription = "Hugging face test model";
  const modelSource = "Hugging Face";
  const modelAdditionalDescription = " hi, there";
  const huggingFaceId = "google/vit-base-patch16-224";
  const modelInstanceTag = "latest";

  test("should create huggingface model", async ({ page }) => {
    await page.goto("/models/create");

    // Check set up button is disabled
    const setupButton = page.locator("button", { hasText: "Set up" });
    expect(await setupButton.isDisabled()).toBeTruthy();

    // Input model id
    const idInput = page.locator("input#modelId");
    await idInput.type(modelId);
    await expect(idInput).toHaveValue(modelId);

    // Input model description
    const descriptionInput = page.locator("textarea#description");
    await descriptionInput.type(modelDescription);
    await expect(descriptionInput).toHaveValue(modelDescription);

    // Select model source - Hugging face
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

    // Input Hugging face id
    const huggingFaceIdInput = page.locator("input#huggingFaceRepo");
    await huggingFaceIdInput.type(huggingFaceId);
    await expect(huggingFaceIdInput).toHaveValue(huggingFaceId);

    // Check setup button is enabled
    expect(await setupButton.isEnabled()).toBeTruthy();

    // Create model
    await setupButton.click();

    // Check model instance is displayed
    const modelInstanceTitle = page.locator("h3", {
      hasText: "Deploy a model instance",
    });
    await expect(modelInstanceTitle).toHaveCount(1);

    // Check deploy button is disabled
    const deployButton = page.locator("button", { hasText: "Deploy" });
    expect(await deployButton.isDisabled()).toBeTruthy();

    // Select latest model instance
    await page
      .locator("#react-select-modelInstanceId-input")
      .click({ force: true });
    await page
      .locator("data-testid=modelInstanceId-selected-option", {
        hasText: modelInstanceTag,
      })
      .click();
    await expect(
      page.locator("data-testid=modelInstanceId-selected-option")
    ).toHaveText(modelInstanceTag);

    // Check deploy button is enabled
    expect(await deployButton.isEnabled()).toBeTruthy();

    // Deploy model
    await Promise.all([
      page.waitForNavigation({ timeout: 60000 }),
      deployButton.click(),
    ]);
    expect(page.url()).toEqual(`${process.env.NEXT_PUBLIC_MAIN_URL}/models`);
  });

  test("should have proper model list and navigate to model details page", async ({
    page,
  }) => {
    await page.goto("/models");

    // Should have model item in list
    const modelItemTitle = page.locator("h3", { hasText: modelId });
    await expect(modelItemTitle).toHaveCount(1);

    // Should navigate to model details page
    await Promise.all([
      page.waitForNavigation(),
      page.locator("h3", { hasText: modelId }).click(),
    ]);
    expect(page.url()).toEqual(
      `${process.env.NEXT_PUBLIC_MAIN_URL}/models/${modelId}`
    );
  });

  test("should display proper model details page", async ({ page }) => {
    await page.goto(`/models/${modelId}`);

    // Should have proper title
    const modelDetailsPageTitle = page.locator("h2", { hasText: modelId });
    await expect(modelDetailsPageTitle).toHaveCount(2);

    // Should have proper model description
    const modelDescriptionField = page.locator("#description");
    await expect(modelDescriptionField).toHaveValue(modelDescription);

    // Should have correct model instance tag
    const modelInstanceTagOption = page.locator(
      "data-testid=modelInstanceTag-selected-option"
    );
    await expect(modelInstanceTagOption).toHaveText(modelInstanceTag);

    // Should display online
    const modelStateLabel = page.locator("data-testid=state-label");
    await expect(modelStateLabel).toHaveText("Online");

    // Should display task type classification
    const modelTaskLabel = page.locator("data-testid=model-task-label");
    await expect(modelTaskLabel).toHaveText("CLASSIFICATION");

    // Should have state toggle at on state
    const stateToggle = page.locator("#pipelineStateToggleButton");
    expect(await stateToggle.isChecked()).toBeTruthy();
  });

  test("should update description", async ({ page }) => {
    await page.goto(`/models/${modelId}`);

    // Should have edit button enabled
    const editButton = page.locator("button", { hasText: "Edit" });
    expect(await editButton.isEnabled()).toBeTruthy();

    // Should have description field disabled
    const modelDescriptionField = page.locator("#description");
    expect(await modelDescriptionField.isDisabled()).toBeTruthy();

    // Should enabled description field
    await editButton.click();
    expect(await modelDescriptionField.isEnabled()).toBeTruthy();

    // Should have save button
    const saveButton = page.locator("button", { hasText: "Save" });
    expect(await saveButton.isEnabled()).toBeTruthy();

    // Should update model description
    await modelDescriptionField.type(modelAdditionalDescription);
    await expect(modelDescriptionField).toHaveValue(
      modelDescription + modelAdditionalDescription
    );
    await Promise.all([
      page.waitForResponse(
        new URL(
          `/${process.env.NEXT_PUBLIC_API_VERSION}/models/${modelId}`,
          `${process.env.NEXT_PUBLIC_MODEL_BACKEND_BASE_URL}`
        ).toString()
      ),
      saveButton.click(),
    ]);

    // Reload page
    await page.goto(`/models/${modelId}`);

    // Should have updated model description
    await expect(modelDescriptionField).toHaveCount(1);
    await expect(modelDescriptionField).toHaveValue(
      modelDescription + modelAdditionalDescription
    );
  });

  test("should have proper delete model modal and delete this model", async ({
    page,
  }) => {
    await page.goto(`/models/${modelId}`);

    // Check we can open delete model modal (To avoid flaky test)
    const openDeleteModelModalButton = page.locator("button", {
      hasText: "Delete",
    });
    expect(await openDeleteModelModalButton.isEnabled()).toBeTruthy();

    // Open delete model modal
    await openDeleteModelModalButton.click();
    const deleteResourceModal = page.locator(
      "data-testid=delete-resource-modal"
    );
    await expect(deleteResourceModal).toHaveCount(1);

    // Check delete resource modal has proper title
    const modalTitle = deleteResourceModal.locator("h2", {
      hasText: "Delete This Model",
    });
    await expect(modalTitle).toHaveCount(1);

    // Check delete resource modal has proper confirmation code
    const confirmationCode = deleteResourceModal.locator("label", {
      hasText: `Please type "${modelId}" to confirm.`,
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
    await confirmationCodeInput.type(modelId);
    await expect(confirmationCodeInput).toHaveValue(modelId);
    expect(await deleteButton.isEnabled()).toBeTruthy();

    // Delete model and navigate to models page
    await Promise.all([page.waitForNavigation(), deleteButton.click()]);
    expect(page.url()).toEqual(`${process.env.NEXT_PUBLIC_MAIN_URL}/models`);

    // Check whether the list item not exist
    const modelItemTitle = page.locator("h3", { hasText: modelId });
    await expect(modelItemTitle).toHaveCount(0);
  });
});

test.describe.serial("GitHub model", () => {
  const modelId = `github-model-${Math.floor(Math.random() * 10000)}`;
  const modelSource = "GitHub";
  const modelDescription = "Github test model";
  const modelAdditionalDescription = " hi, there";
  const modelRepo = "instill-ai/model-mobilenetv2";
  const modelInstanceTag = "v1.0-cpu";

  test("should create github model", async ({ page }) => {
    await page.goto("/models/create");

    // Check set up button is disabled
    const setupButton = page.locator("button", { hasText: "Set up" });
    expect(await setupButton.isDisabled()).toBeTruthy();

    // Input model id
    const idInput = page.locator("input#modelId");
    await idInput.type(modelId);
    await expect(idInput).toHaveValue(modelId);

    // Input model description
    const descriptionInput = page.locator("textarea#description");
    await descriptionInput.type(modelDescription);
    await expect(descriptionInput).toHaveValue(modelDescription);

    // Select model source - GitHub
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

    // Input GitHub repo url
    const githubRepoInput = page.locator("input#modelRepo");
    await githubRepoInput.type(modelRepo);
    await expect(githubRepoInput).toHaveValue(modelRepo);

    // Check setup button is enabled
    expect(await setupButton.isEnabled()).toBeTruthy();

    // Create model
    await setupButton.click();

    // Check model instance is displayed
    const modelInstanceTitle = page.locator("h3", {
      hasText: "Deploy a model instance",
    });
    await expect(modelInstanceTitle).toHaveCount(1);

    // Check deploy button is disabled
    const deployButton = page.locator("button", { hasText: "Deploy" });
    expect(await deployButton.isDisabled()).toBeTruthy();

    // Select latest model instance
    await page
      .locator("#react-select-modelInstanceId-input")
      .click({ force: true });
    await page
      .locator("data-testid=modelInstanceId-selected-option", {
        hasText: modelInstanceTag,
      })
      .click();
    await expect(
      page.locator("data-testid=modelInstanceId-selected-option")
    ).toHaveText(modelInstanceTag);

    // Check deploy button is enabled
    expect(await deployButton.isEnabled()).toBeTruthy();

    // Deploy model
    await Promise.all([
      page.waitForNavigation({ timeout: 20000 }),
      deployButton.click(),
    ]);
    expect(page.url()).toEqual(`${process.env.NEXT_PUBLIC_MAIN_URL}/models`);
  });

  test("should have proper model list and navigate to model details page", async ({
    page,
  }) => {
    await page.goto("/models");

    // Should have model item in list
    const modelItemTitle = page.locator("h3", { hasText: modelId });
    await expect(modelItemTitle).toHaveCount(1);

    // Should navigate to model details page
    await Promise.all([
      page.waitForNavigation(),
      page.locator("h3", { hasText: modelId }).click(),
    ]);
    expect(page.url()).toEqual(
      `${process.env.NEXT_PUBLIC_MAIN_URL}/models/${modelId}`
    );
  });

  test("should display proper model details page", async ({ page }) => {
    await page.goto(`/models/${modelId}`);

    // Should have proper title
    const modelDetailsPageTitle = page.locator("h2", { hasText: modelId });
    await expect(modelDetailsPageTitle).toHaveCount(2);

    // Should have proper model description
    // const modelDescriptionField = page.locator("#description");
    // await expect(modelDescriptionField).toHaveValue(modelDescription);

    // Should have correct model instance tag
    // const modelInstanceTagOption = page.locator(
    //   "data-testid=modelInstanceTag-selected-option"
    // );
    // await expect(modelInstanceTagOption).toHaveText(modelInstanceTag);

    // Should display online
    // const modelStateLabel = page.locator("data-testid=state-label");
    // await expect(modelStateLabel).toHaveText("Online");

    // Should display task type classification
    const modelTaskLabel = page.locator("data-testid=model-task-label");
    await expect(modelTaskLabel).toHaveText("CLASSIFICATION");

    // Should have state toggle at on state
    // const stateToggle = page.locator("#pipelineStateToggleButton");
    // expect(await stateToggle.isChecked()).toBeTruthy();
  });

  test.skip("should update description", async ({ page }) => {
    await page.goto(`/models/${modelId}`);

    // Should have edit button enabled
    const editButton = page.locator("button", { hasText: "Edit" });
    expect(await editButton.isEnabled()).toBeTruthy();

    // Should have description field disabled
    const modelDescriptionField = page.locator("#description");
    expect(await modelDescriptionField.isDisabled()).toBeTruthy();

    // Should enabled description field
    await editButton.click();
    expect(await modelDescriptionField.isEnabled()).toBeTruthy();

    // Should have save button
    const saveButton = page.locator("button", { hasText: "Save" });
    expect(await saveButton.isEnabled()).toBeTruthy();

    // Should update model description
    await modelDescriptionField.type(modelAdditionalDescription);
    await expect(modelDescriptionField).toHaveValue(
      modelDescription + modelAdditionalDescription
    );
    await Promise.all([
      page.waitForResponse(
        new URL(
          `/${process.env.NEXT_PUBLIC_API_VERSION}/models/${modelId}`,
          `${process.env.NEXT_PUBLIC_MODEL_BACKEND_BASE_URL}`
        ).toString()
      ),
      saveButton.click(),
    ]);

    // Reload page
    await page.goto(`/models/${modelId}`);

    // Should have updated model description
    await expect(modelDescriptionField).toHaveCount(1);
    await expect(modelDescriptionField).toHaveValue(
      modelDescription + modelAdditionalDescription
    );
  });

  test("should have proper delete model modal and delete this model", async ({
    page,
  }) => {
    await page.goto(`/models/${modelId}`);

    // Check we can open delete model modal (To avoid flaky test)
    const openDeleteModelModalButton = page.locator("button", {
      hasText: "Delete",
    });
    expect(await openDeleteModelModalButton.isEnabled()).toBeTruthy();

    // Open delete model modal
    await openDeleteModelModalButton.click();
    const deleteResourceModal = page.locator(
      "data-testid=delete-resource-modal"
    );
    await expect(deleteResourceModal).toHaveCount(1);

    // Check delete resource modal has proper title
    const modalTitle = deleteResourceModal.locator("h2", {
      hasText: "Delete This Model",
    });
    await expect(modalTitle).toHaveCount(1);

    // Check delete resource modal has proper confirmation code
    const confirmationCode = deleteResourceModal.locator("label", {
      hasText: `Please type "${modelId}" to confirm.`,
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
    await confirmationCodeInput.type(modelId);
    await expect(confirmationCodeInput).toHaveValue(modelId);
    expect(await deleteButton.isEnabled()).toBeTruthy();

    // Delete model and navigate to models page
    await Promise.all([page.waitForNavigation(), deleteButton.click()]);
    expect(page.url()).toEqual(`${process.env.NEXT_PUBLIC_MAIN_URL}/models`);

    // Check whether the list item not exist
    const modelItemTitle = page.locator("h3", { hasText: modelId });
    await expect(modelItemTitle).toHaveCount(0);
  });
});

test.describe.serial("Artivc model", () => {});
