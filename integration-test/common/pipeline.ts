import { delay, env } from "../helper";
import { Page, expect } from "@playwright/test";

export const openPipelinesPage = async (page: Page) => {
  await page.goto("/pipelines");
};

export const openPipelinePage = async (page: Page, pipelineId: string) => {
  await page.goto(`/pipelines/${pipelineId}`, { waitUntil: "networkidle" });
};

export const openCreatePipelinePage = async (page: Page) => {
  await page.goto("/pipelines/create", { waitUntil: "networkidle" });
};

export const expectToDeletePipeline = async (
  page: Page,
  pipelineId: string
) => {
  await page.goto(`/pipelines/${pipelineId}`, { waitUntil: "networkidle" });

  // Should enable open delete pipeline modal button
  const openDeleteModelModalButton = page.locator("button", {
    hasText: "Delete",
  });
  expect(await openDeleteModelModalButton.isEnabled()).toBeTruthy();

  // Should open delete pipeline modal
  const deleteResourceModal = page.locator("data-testid=delete-resource-modal");

  await Promise.all([
    openDeleteModelModalButton.click(),
    deleteResourceModal.waitFor(),
  ]);

  // Should have proper delete pipeline modal titme
  const modalTitle = deleteResourceModal.locator("h2", {
    hasText: "Delete This Pipeline",
  });
  await expect(modalTitle).toHaveCount(1);

  // Should have correct confirmation code
  const confirmationCode = deleteResourceModal.locator("label", {
    hasText: `Please type "${pipelineId}" to confirm.`,
  });
  await expect(confirmationCode).toHaveCount(1);

  // Should disable delete pipeline button
  const deleteButton = deleteResourceModal.locator("button", {
    hasText: "Delete",
  });
  expect(await deleteButton.isDisabled()).toBeTruthy();

  // Should enable cancel deletion button
  const cancelButton = deleteResourceModal.locator("button", {
    hasText: "Cancel",
  });
  expect(await cancelButton.isEnabled()).toBeTruthy();

  // Should input confirmation code and enable delete button
  const confirmationCodeInput =
    deleteResourceModal.locator("#confirmationCode");
  await confirmationCodeInput.fill(pipelineId);
  expect(await deleteButton.isEnabled()).toBeTruthy();

  // Should delete pipeline and navigate to pipelines page
  await Promise.all([
    page.waitForURL(`${env("NEXT_PUBLIC_CONSOLE_BASE_URL")}/pipelines`),
    deleteButton.click(),
  ]);

  // Should not display deleted pipeline
  const modelItemTitle = page.locator("h3", { hasText: pipelineId });
  await expect(modelItemTitle).toHaveCount(0);
};

export const expectToUpdatePipelineDescription = async (
  page: Page,
  pipelineId: string,
  newDescription: string
) => {
  await page.goto(`/pipelines/${pipelineId}`, { waitUntil: "networkidle" });

  // Should enable edit button
  const editButton = page.locator("button", { hasText: "Edit" });
  expect(await editButton.isEnabled()).toBeTruthy();

  // Should have editable description field
  const pipelineDescriptionField = page.locator(
    "textarea#pipeline-description"
  );
  await editButton.click();

  // Should input new description
  await pipelineDescriptionField.fill(newDescription);

  // Should enable save button
  const saveButton = page.locator("button", { hasText: "Save" });
  expect(await saveButton.isEnabled()).toBeTruthy();

  // Should wait for update
  const succeedMessage = page.locator("h3", { hasText: "Succeed" });
  await Promise.all([saveButton.click(), succeedMessage.waitFor()]);

  // Reload page
  await page.goto(`/pipelines/${pipelineId}`, { waitUntil: "networkidle" });

  // Should have new description
  await expect(pipelineDescriptionField).toHaveValue(newDescription);
};

export const expectCorrectPipelineList = async (
  page: Page,
  pipelineId: string
) => {
  await page.goto("/pipelines", { waitUntil: "networkidle" });

  // Should have pipeline item in list
  const pipelineItemTitle = page.locator("h3", { hasText: pipelineId });
  await expect(pipelineItemTitle).toHaveCount(1);

  // Should navigate to pipeline details page
  await Promise.all([
    page.waitForURL(
      `${env("NEXT_PUBLIC_CONSOLE_BASE_URL")}/pipelines/${pipelineId}`
    ),
    page.locator("h3", { hasText: pipelineId }).click(),
  ]);
};

export type ExpectCorrectPipelineDetailsProps = {
  page: Page;
  id: string;
  mode: string;
  state:
    | "STATE_ACTIVE"
    | "STATE_INACTIVE"
    | "STATE_UNSPECIFIED"
    | "STATE_ERROR";
  description: string;
  additionalRules?: () => Promise<void>;
};

export const expectCorrectPipelineDetails = async ({
  page,
  id,
  mode,
  state,
  description,
  additionalRules,
}: ExpectCorrectPipelineDetailsProps) => {
  await page.goto(`/pipelines/${id}`, { waitUntil: "networkidle" });

  // Should have correct title
  const titleField = page.locator("h2", { hasText: id });
  await titleField.waitFor();

  // Should have correct mode label
  const modeLabel = page.locator("data-testid=pipeline-mode-label");
  await expect(modeLabel).toHaveText(mode);

  // Temporaily disable test related to long run operation

  // Should have correct state label and toggle state button
  // const stateLabel = page.locator("data-testid=state-label");
  // const stateToggle = page.locator("#pipelineStateToggleButton");
  // if (state === "STATE_ACTIVE") {
  //   await expect(stateLabel).toHaveText("Active");
  //   expect(await stateToggle.isChecked()).toBeTruthy();
  // } else if (state === "STATE_INACTIVE") {
  //   await expect(stateLabel).toHaveText("Inactive");
  //   expect(await stateToggle.isChecked()).not.toBeTruthy();
  // } else if (state === "STATE_UNSPECIFIED") {
  //   await expect(stateLabel).toHaveText("Unspecified");
  //   expect(await stateToggle.isChecked()).not.toBeTruthy();
  // } else {
  //   await expect(stateLabel).toHaveText("Error");
  //   expect(await stateToggle.isChecked()).not.toBeTruthy();
  // }

  // Should have correct description
  const descriptionField = page.locator("textarea#pipeline-description");
  await expect(descriptionField).toHaveValue(description);

  if (additionalRules) await additionalRules();
};
