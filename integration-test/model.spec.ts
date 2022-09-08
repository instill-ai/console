import { test, expect } from "@playwright/test";

test.describe.serial("Local model", () => {
  const modelId = "local-model";
  const modelDescription = "Local test model";
  const modelAdditionalDescription = " hi, i am here";

  test("should have create button", async ({ page }) => {
    await page.goto("/models");

    // Make sure model page has correct page title
    const modelTitle = page.locator("h2", { hasText: "Model" });
    await expect(modelTitle).toHaveCount(1);

    // Make sure the add new model button is enabled
    const setupFirstModelButton = page.locator("button", {
      hasText: "Set up your first model",
    });
    expect(await setupFirstModelButton.isEnabled()).toBeTruthy();

    // Should navigate to /models/create
    await Promise.all([
      page.waitForNavigation(),
      setupFirstModelButton.click(),
    ]);

    expect(page.url()).toEqual(
      `${process.env.NEXT_PUBLIC_MAIN_URL}/models/create`
    );
  });

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
    await page.locator("#react-select-modelDefinition-option-2").click();
    await expect(
      page.locator("data-testid=modelDefinition-selected-option")
    ).toHaveText("Local");

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
    await page.locator("#react-select-modelInstanceId-option-0").click();
    await expect(
      page.locator("data-testid=modelInstanceId-selected-option")
    ).toHaveText("latest");

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

    // Should navigate to source details page
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
    await expect(modelDetailsPageTitle).toHaveCount(1);

    // Should have proper model description
    const modelDescriptionField = page.locator("#description");
    await expect(modelDescriptionField).toHaveValue(modelDescription);

    // Should have correct model instance tag - latest
    const modelInstanceTag = page.locator(
      "data-testid=modelInstanceTag-selected-option"
    );
    await expect(modelInstanceTag).toHaveText("latest");

    // Should display online
    const modelStateLabel = page.locator("data-testid=state-label");
    await expect(modelStateLabel).toHaveText("Online");

    // Should display task type classification
    const modelTaskLabel = page.locator("data-testid=model-task-label");
    await expect(modelTaskLabel).toHaveText("CLASSIFICATION");

    // Should have state toggle at off state
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
    await saveButton.click();

    // Reload page
    await page.goto(`/models/${modelId}`);

    // Should have updated model description
    const newModelDescriptionField = page.locator("#description");
    await expect(newModelDescriptionField).toHaveCount(1);
    await expect(newModelDescriptionField).toHaveValue(
      modelDescription + modelAdditionalDescription
    );
  });

  test("should have proper delete model modal and delete this model", async ({
    page,
  }) => {});
});
