import { test, expect } from "@playwright/test";

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
    const setupModelStepTitle = page.locator("h2", { hasText: "Set up Model" });
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

    // Deploy model
    await Promise.all([
      page.waitForResponse(
        new URL(
          `/${process.env.NEXT_PUBLIC_API_VERSION}/models/${modelId}/instances/latest:deploy`,
          `${process.env.NEXT_PUBLIC_MODEL_BACKEND_BASE_URL}`
        ).toString()
      ),
      deployButton.click(),
    ]);

    // Should go to next step
    const setupDestinationTitle = page.locator("h2", {
      hasText: "Set up Destination",
    });
    await expect(setupDestinationTitle).toHaveCount(1);

    // Should disable destination selection field
    const destinationFieldOption = page.locator(
      "#react-select-existingDestinationId-input"
    );
    expect(await destinationFieldOption.isDisabled()).toBeTruthy();
    await expect(
      page.locator("data-testid=existingDestinationId-selected-option")
    ).toHaveText(destinationType);

    // Should enable next button
    const goToPipelineStepButton = page.locator("button", { hasText: "Next" });
    expect(await goToPipelineStepButton.isEnabled()).toBeTruthy();

    // Should go to next step
    await goToPipelineStepButton.click();
    const setupPipelineTitle = page.locator("h2", {
      hasText: "Set up Pipeline",
    });
    await setupPipelineTitle.isVisible();

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
    await editButton.click();
    const pipelineDescriptionField = page.locator(
      "textarea#pipelineDescription"
    );
    expect(await pipelineDescriptionField.isEditable()).toBeTruthy();

    // Should input new description
    await pipelineDescriptionField.fill("");
    await expect(pipelineDescriptionField).toHaveValue("");

    // Should enable save button
    const saveButton = page.locator("button", { hasText: "Save" });
    expect(await saveButton.isEnabled()).toBeTruthy();

    // Should wait for update
    await Promise.all([
      page.waitForResponse(
        new URL(
          `/${process.env.NEXT_PUBLIC_API_VERSION}/pipelines/${pipelineId}`,
          `${process.env.NEXT_PUBLIC_PIPELINE_BACKEND_BASE_URL}`
        ).toString()
      ),
      saveButton.click(),
    ]);

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
    await openDeleteModelModalButton.click();
    const deleteResourceModal = page.locator(
      "data-testid=delete-resource-modal"
    );
    await expect(deleteResourceModal).toHaveCount(1);

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

// test.describe.serial("Simple sync pipeline with local model", () => {
//   const testPipelineId = "test-pipeline-13ef55rrrr3";
//   const testModelId = "test-model-f";
//   const testModelDescription = "Hi! This is a test model";
//   const testPipelineDescription = "Hi! This is a test pipeline";

//   test("should create pipeline", async ({ page }) => {
//     await openCreatePipelinePage(page);

//     // Setup source
//     await page.locator("#existingSourceId").click({ force: true });
//     await page.locator("#react-select-existingSourceId-option-0").click();
//     await page.locator("button", { hasText: "Next" }).click();

//     const isOnSetupModelStep = await page
//       .locator("h2", {
//         hasText: "Set Up Model",
//       })
//       .isVisible();

//     expect(isOnSetupModelStep).toBeTruthy();

//     // Setup local model
//     await page.locator("#modelId").fill(testModelId);
//     await page.locator("#modelDefinition").click({ force: true });
//     await page.locator(".instill-text-body", { hasText: "Local" }).click();
//     await page.locator("#description").fill(testModelDescription);
//     await page
//       .locator("#modelFile")
//       .setInputFiles("./e2e/data/dummy-cls-model.zip");
//     await page.locator("button", { hasText: "Setup new model" }).click();
//     await Promise.all([
//       page.waitForResponse((response) => {
//         if (!process.env.NEXT_PUBLIC_MODEL_BACKEND_BASE_URL) {
//           throw new Error("env not provided");
//         }
//         return response
//           .url()
//           .includes(process.env.NEXT_PUBLIC_MODEL_BACKEND_BASE_URL);
//       }),
//     ]);

//     // Deploy model instance
//     await page.locator("#modelInstanceName").click({ force: true });
//     await page.locator("#react-select-modelInstanceName-option-0").click();
//     await page.locator("button", { hasText: "Deploy" }).click();
//     await Promise.all([
//       page.waitForResponse((response) => {
//         if (!process.env.NEXT_PUBLIC_MODEL_BACKEND_BASE_URL) {
//           throw new Error("env not provided");
//         }
//         return response
//           .url()
//           .includes(process.env.NEXT_PUBLIC_MODEL_BACKEND_BASE_URL);
//       }),
//     ]);

//     const isOnSetupDestinationStep = await page
//       .locator("h2", {
//         hasText: "Set Up Destination",
//       })
//       .isVisible();

//     expect(isOnSetupDestinationStep).toBeTruthy();

//     // Setup destination
//     await page.locator("button", { hasText: "Next" }).click();
//     const isOnSetupPipelineDetailsStep = await page
//       .locator("h2", {
//         hasText: "Set Up Pipeline",
//       })
//       .isVisible();

//     expect(isOnSetupPipelineDetailsStep).toBeTruthy();

//     // Setup pipeline details
//     await page.locator("#pipelineId").fill(testPipelineId);
//     await page.locator("#pipelineDescription").fill(testPipelineDescription);
//     await page.locator("button", { hasText: "Set up pipeline" }).click();

//     await Promise.all([
//       page.waitForResponse((response) => {
//         if (!process.env.NEXT_PUBLIC_PIPELINE_BACKEND_BASE_URL) {
//           throw new Error("env not provided");
//         }
//         return response
//           .url()
//           .includes(process.env.NEXT_PUBLIC_PIPELINE_BACKEND_BASE_URL);
//       }),
//     ]);
//     await page.waitForNavigation();

//     expect(page.url()).toBe(`${process.env.NEXT_PUBLIC_MAIN_URL}/pipelines`);
//     await expect(page.locator("h3", { hasText: testPipelineId })).toBeVisible();
//   });

//   test("should update pipeline description", async ({ page }) => {
//     await openPipelinePage(page, testPipelineId);
//     await page.locator("button", { hasText: "Edit" }).click();
//     const pipelineDescription = page.locator("#pipelineDescription");
//     await expect(pipelineDescription).toHaveValue(testPipelineDescription);
//     await pipelineDescription.fill("modified");
//     await page.locator("button", { hasText: "Done" }).click();
//     await Promise.all([
//       page.waitForResponse((response) => {
//         if (!process.env.NEXT_PUBLIC_PIPELINE_BACKEND_BASE_URL) {
//           throw new Error("env not provided");
//         }
//         return response
//           .url()
//           .includes(process.env.NEXT_PUBLIC_PIPELINE_BACKEND_BASE_URL);
//       }),
//     ]);
//     await expect(pipelineDescription).toHaveValue("modified");
//   });

//   test("should delete pipeline", async ({ page }) => {
//     await page.goto(`/pipelines/${testPipelineId}`);
//     await page.locator("button", { hasText: "Delete" }).click();
//     await page.locator("#confirmationCode").fill(testPipelineId);

//     await page.screenshot({ path: "text.png" });

//     await page.locator("role=dialog >> button:has-text('Delete')").click();
//     await Promise.all([
//       page.waitForResponse((response) => {
//         if (!process.env.NEXT_PUBLIC_PIPELINE_BACKEND_BASE_URL) {
//           throw new Error("env not provided");
//         }
//         return response
//           .url()
//           .includes(process.env.NEXT_PUBLIC_PIPELINE_BACKEND_BASE_URL);
//       }),
//     ]);
//   });
// });

// test.describe.serial("Simple sync pipeline with github model", () => {
//   const testPipelineId = "test-pipeline-2qereeeere2";
//   const testModelId = "test-model-2reeeqe2";
//   const testPipelineDescription = "Hi! This is a test pipeline";
//   const githubModelRepo = "instill-ai/model-mobilenetv2";

//   test("should create pipeline", async ({ page }) => {
//     await openCreatePipelinePage(page);

//     // Setup source
//     await page.locator("#existingSourceId").click({ force: true });
//     await page.locator("#react-select-existingSourceId-option-0").click();
//     await page.locator("button", { hasText: "Next" }).click();

//     const isOnSetupModelStep = await page
//       .locator("h2", {
//         hasText: "Set Up Model",
//       })
//       .isVisible();

//     expect(isOnSetupModelStep).toBeTruthy();

//     // Setup github model
//     await page.locator("#modelId").fill(testModelId);
//     await page.locator("#modelDefinition").click({ force: true });
//     await page.locator(".instill-text-body", { hasText: "GitHub" }).click();
//     await page.locator("#modelRepo").fill(githubModelRepo);
//     await page.locator("button", { hasText: "Setup new model" }).click();
//     await Promise.all([
//       page.waitForResponse((response) => {
//         if (!process.env.NEXT_PUBLIC_MODEL_BACKEND_BASE_URL) {
//           throw new Error("env not provided");
//         }
//         return response
//           .url()
//           .includes(process.env.NEXT_PUBLIC_MODEL_BACKEND_BASE_URL);
//       }),
//     ]);

//     // Deploy model instance
//     await page.locator("#modelInstanceName").click({ force: true });
//     await page.locator("#react-select-modelInstanceName-option-0").click();
//     await page.locator("button", { hasText: "Deploy" }).click();
//     await Promise.all([
//       page.waitForResponse((response) => {
//         if (!process.env.NEXT_PUBLIC_MODEL_BACKEND_BASE_URL) {
//           throw new Error("env not provided");
//         }
//         return response
//           .url()
//           .includes(process.env.NEXT_PUBLIC_MODEL_BACKEND_BASE_URL);
//       }),
//     ]);

//     const isOnSetupDestinationStep = await page
//       .locator("h2", {
//         hasText: "Set Up Destination",
//       })
//       .isVisible();

//     expect(isOnSetupDestinationStep).toBeTruthy();

//     // Setup destination
//     await page.locator("button", { hasText: "Next" }).click();
//     const isOnSetupPipelineDetailsStep = await page
//       .locator("h2", {
//         hasText: "Set Up Pipeline",
//       })
//       .isVisible();

//     expect(isOnSetupPipelineDetailsStep).toBeTruthy();

//     // Setup pipeline details
//     await page.locator("#pipelineId").fill(testPipelineId);
//     await page.locator("#pipelineDescription").fill(testPipelineDescription);
//     await page.locator("button", { hasText: "Set up pipeline" }).click();

//     await Promise.all([
//       page.waitForResponse((response) => {
//         if (!process.env.NEXT_PUBLIC_PIPELINE_BACKEND_BASE_URL) {
//           throw new Error("env not provided");
//         }
//         return response
//           .url()
//           .includes(process.env.NEXT_PUBLIC_PIPELINE_BACKEND_BASE_URL);
//       }),
//     ]);
//     await page.waitForNavigation();

//     expect(page.url()).toBe(`${process.env.NEXT_PUBLIC_MAIN_URL}/pipelines`);
//     await expect(page.locator("h3", { hasText: testPipelineId })).toBeVisible();
//   });

//   test("should update pipeline description", async ({ page }) => {
//     await openPipelinePage(page, testPipelineId);
//     await page.locator("button", { hasText: "Edit" }).click();
//     const pipelineDescription = page.locator("#pipelineDescription");
//     await expect(pipelineDescription).toHaveValue(testPipelineDescription);
//     await pipelineDescription.fill("modified");
//     await page.locator("button", { hasText: "Done" }).click();
//     await Promise.all([
//       page.waitForResponse((response) => {
//         if (!process.env.NEXT_PUBLIC_PIPELINE_BACKEND_BASE_URL) {
//           throw new Error("env not provided");
//         }
//         return response
//           .url()
//           .includes(process.env.NEXT_PUBLIC_PIPELINE_BACKEND_BASE_URL);
//       }),
//     ]);
//     await expect(pipelineDescription).toHaveValue("modified");
//   });

//   test("should delete pipeline", async ({ page }) => {
//     await page.goto(`/pipelines/${testPipelineId}`);
//     await page.locator("button", { hasText: "Delete" }).click();
//     await page.locator("#confirmationCode").fill(testPipelineId);

//     await page.screenshot({ path: "text.png" });

//     await page.locator("role=dialog >> button:has-text('Delete')").click();
//     await Promise.all([
//       page.waitForResponse((response) => {
//         if (!process.env.NEXT_PUBLIC_PIPELINE_BACKEND_BASE_URL) {
//           throw new Error("env not provided");
//         }
//         return response
//           .url()
//           .includes(process.env.NEXT_PUBLIC_PIPELINE_BACKEND_BASE_URL);
//       }),
//     ]);
//     await page.waitForNavigation();
//     expect(page.url().split("/").pop()).toBe("pipelines");

//     await expect(page.locator(`text=${testPipelineId}`)).toHaveCount(0);
//   });
// });

// test.describe.serial("Simple sync pipeline with existing model", () => {});
