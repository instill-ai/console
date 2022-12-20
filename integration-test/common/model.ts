//import { Nullable } from "@/types/general";
import { Page, expect, Locator } from "@playwright/test";
import { delay, expectToSelectReactSelectOption } from "../helper";

export const expectToDeleteModel = async (page: Page, modelId: string) => {
  await page.goto(`/models/${modelId}`, { waitUntil: "networkidle" });

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
  await confirmationCodeInput.fill(modelId);

  // Should delete model and navigate to models page
  await Promise.all([page.waitForNavigation(), deleteButton.click()]);
  expect(page.url()).toEqual(`${process.env.NEXT_PUBLIC_MAIN_URL}/models`);

  // Should not list model item
  const modelItemTitle = page.locator("h3", { hasText: modelId });
  await expect(modelItemTitle).toHaveCount(0);
};

export const expectToUpdateModelDescription = async (
  page: Page,
  modelId: string,
  modelDescription: string
) => {
  await page.goto(`/models/${modelId}`, { waitUntil: "networkidle" });

  // Should enable edit button
  const editButton = page.locator("button", { hasText: "Edit" });
  expect(await editButton.isEnabled()).toBeTruthy();

  // Should disable description field
  const modelDescriptionField = page.locator("#description");
  expect(await modelDescriptionField.isDisabled()).toBeTruthy();
  await editButton.click();

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
  await page.goto("/models", { waitUntil: "networkidle" });

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
  modelInstanceTagOptionLocator: Locator;
  modelState:
    | "STATE_ONLINE"
    | "STATE_OFFLINE"
    | "STATE_UNSPECIFIED"
    | "STATE_ERROR";
  modelTask: string;
  additionalRules?: () => Promise<void>;
};

export const expectCorrectModelDetails = async ({
  page,
  modelId,
  modelDescription,
  modelInstanceTag,
  modelInstanceTagOptionLocator,
  modelState,
  modelTask,
  additionalRules,
}: ExpectCorrectModelDetailsProps) => {
  // Mimic the behavior of long running operation
  await delay(2000);

  await page.goto(`/models/${modelId}`, { waitUntil: "networkidle" });

  // Should have proper title
  const modelDetailsPageTitle = page.locator("h2", { hasText: modelId });
  await expect(modelDetailsPageTitle).toHaveCount(2);

  // Should have proper model description
  const modelDescriptionField = page.locator("#description");
  await expect(modelDescriptionField).toHaveValue(modelDescription);

  // Should display task fill classification
  const modelTaskLabel = page.locator("data-testid=model-task-label");
  await expect(modelTaskLabel).toHaveText(modelTask);

  const modelInstanceTagOptionInput = page.locator(
    "#react-select-modelInstanceTag-input"
  );

  // Should choose the right model instance
  await expectToSelectReactSelectOption(
    modelInstanceTagOptionInput,
    modelInstanceTagOptionLocator
  );

  // Should have the target model instance tag
  const selectedModelInstanceTag = page.locator(
    "data-testid=modelInstanceTag-selected-option"
  );
  await expect(selectedModelInstanceTag).toHaveText(modelInstanceTag);

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
    await expect(modelStateLabel).toHaveText("Unspecified");
    expect(await stateToggle.isChecked()).not.toBeTruthy();
  } else {
    await expect(modelStateLabel).toHaveText("Error");
    expect(await stateToggle.isChecked()).not.toBeTruthy();
  }

  if (additionalRules) await additionalRules();
};

export const expectToDeployModel = async (
  page: Page,
  modelInstanceTag: string,
  waitForElement: Locator | null,
  timeout: number | null
) => {
  // Should select target model instance tag
  const modelInstanceIdOption = page.locator(
    "#react-select-modelInstanceTag-input"
  );
  await modelInstanceIdOption.click({ force: true });
  await page
    .locator("data-testid=modelInstanceTag-selected-option", {
      hasText: modelInstanceTag,
    })
    .click();

  // Should enable deploy button
  const deployButton = page.locator("button", { hasText: "Deploy" });
  expect(await deployButton.isEnabled()).toBeTruthy();

  // Should deploy model
  await Promise.all([
    waitForElement
      ? waitForElement.waitFor({
          state: "visible",
          timeout: timeout ? timeout : undefined,
        })
      : page.waitForNavigation({ timeout: timeout ? timeout : undefined }),
    deployButton.click(),
  ]);

  expect(page.url()).toEqual(`${process.env.NEXT_PUBLIC_MAIN_URL}/models`);
};

export type ExpectToSetupLocalModel = {
  page: Page;
  modelId: string;
  modelDescription: string;
  modelInstanceTag: string;
  waitForElement?: Locator;
};
