import { ModelState } from "@/lib/instill";
import { Page, expect } from "@playwright/test";

export const expectDeleteModelModalWork = async (
  page: Page,
  modelId: string
) => {
  // Should enable open delete model modal button
  const openDeleteModelModalButton = page.locator("button", {
    hasText: "Delete",
  });
  expect(await openDeleteModelModalButton.isEnabled()).toBeTruthy();

  // Should open delete model modal
  const deleteResourceModal = page.locator("data-testid=delete-resource-modal");

  await Promise.all([
    openDeleteModelModalButton.click(),
    deleteResourceModal.isVisible(),
  ]);

  // Should have proper modal title
  const modalTitle = deleteResourceModal.locator("h2", {
    hasText: "Delete This Model",
  });
  await expect(modalTitle).toHaveCount(1);

  // Should have proper confirmation code hint
  const confirmationCodeHint = deleteResourceModal.locator("label", {
    hasText: `Please type "${modelId}" to confirm.`,
  });
  await expect(confirmationCodeHint).toHaveCount(1);

  // Should disable delete model button
  const deleteButton = deleteResourceModal.locator("button", {
    hasText: "Delete",
  });
  expect(await deleteButton.isDisabled()).toBeTruthy();

  // Should enable cancel button
  const cancelButton = deleteResourceModal.locator("button", {
    hasText: "Cancel",
  });
  expect(await cancelButton.isEnabled()).toBeTruthy();

  // Should input confirmation code
  const confirmationCodeInput =
    deleteResourceModal.locator("#confirmationCode");

  await Promise.all([
    confirmationCodeInput.fill(modelId),
    deleteButton.isEnabled(),
  ]);

  // Should delete model and navigate to models page
  await Promise.all([page.waitForNavigation(), deleteButton.click()]);
  expect(page.url()).toEqual(`${process.env.NEXT_PUBLIC_MAIN_URL}/models`);

  // Should not list model item
  const modelItemTitle = page.locator("h3", { hasText: modelId });
  await expect(modelItemTitle).toHaveCount(0);
};

export const expectUpdateModelDescription = async (
  page: Page,
  modelId: string,
  modelDescription: string
) => {
  // Should enable edit button
  const editButton = page.locator("button", { hasText: "Edit" });
  expect(await editButton.isEnabled()).toBeTruthy();

  // Should disable description field
  const modelDescriptionField = page.locator("#description");
  expect(await modelDescriptionField.isDisabled()).toBeTruthy();

  // Should enable description field
  await Promise.all([editButton.click(), modelDescriptionField.isEnabled()]);

  // Should display save button
  const saveButton = page.locator("button", { hasText: "Save" });
  expect(await saveButton.isEnabled()).toBeTruthy();

  // Should update model description
  const succeedMessage = page.locator("h3", { hasText: "Succeed" });
  await modelDescriptionField.fill(modelDescription);
  await Promise.all([saveButton.click(), succeedMessage.isVisible()]);

  // Reload page
  await page.goto(`/models/${modelId}`);

  // Should have updated model description
  await modelDescriptionField.isVisible();
  await expect(modelDescriptionField).toHaveValue(modelDescription);
};

export const expectCorrectModelList = async (page: Page, modelId: string) => {
  // Should list model item
  const modelItemTitle = page.locator("h3", { hasText: modelId });
  await expect(modelItemTitle).toHaveCount(1);

  // Should navigate to model details page
  await Promise.all([
    page.locator("h3", { hasText: modelId }).click(),
    page.waitForNavigation(),
  ]);
  expect(page.url()).toEqual(
    `${process.env.NEXT_PUBLIC_MAIN_URL}/models/${modelId}`
  );
};

export type ExpectCorrectModelDetailsProps = {
  page: Page;
  modelId: string;
  modelDescription: string;
  modelInstanceTag: string;
  modelState: ModelState;
  modelTask: string;
};

export const expectCorrectModelDetails = async ({
  page,
  modelId,
  modelDescription,
  modelInstanceTag,
  modelState,
  modelTask,
}: ExpectCorrectModelDetailsProps) => {
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

  // Should display task fill classification
  const modelTaskLabel = page.locator("data-testid=model-task-label");
  await expect(modelTaskLabel).toHaveText(modelTask);

  // Should display online and have correct toggle button state
  const modelStateLabel = page.locator("data-testid=state-label");
  const stateToggle = page.locator("#pipelineStateToggleButton");
  if (modelState === "STATE_ONLINE") {
    await expect(modelStateLabel).toHaveText("Online");
    expect(await stateToggle.isChecked()).toBeTruthy();
  } else if (modelState === "STATE_OFFLINE") {
    await expect(modelStateLabel).toHaveText("Offline");
    expect(await stateToggle.isChecked()).not.toBeTruthy();
  } else if (modelState === "STATE_UNSPECIFIED") {
    await expect(modelStateLabel).toHaveText("Unspecific");
    expect(await stateToggle.isChecked()).not.toBeTruthy();
  } else {
    await expect(modelStateLabel).toHaveText("Error");
    expect(await stateToggle.isChecked()).not.toBeTruthy();
  }
};
