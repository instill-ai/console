import { Page, expect } from "@playwright/test";

export const openPipelinesPage = async (page: Page) => {
  await page.goto("/pipelines");
};

export const openPipelinePage = async (page: Page, pipelineId: string) => {
  await page.goto(`/pipelines/${pipelineId}`);
};

export const openCreatePipelinePage = async (page: Page) => {
  await page.goto("/pipelines/create");
};

export const expectToDeletePipeline = async (
  page: Page,
  pipelineId: string
) => {
  // Should enable open delete pipeline modal button
  const openDeleteModelModalButton = page.locator("button", {
    hasText: "Delete",
  });
  expect(await openDeleteModelModalButton.isEnabled()).toBeTruthy();

  // Should open delete pipeline modal
  const deleteResourceModal = page.locator("data-testid=delete-resource-modal");

  await Promise.all([
    openDeleteModelModalButton.click(),
    deleteResourceModal.isVisible(),
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

  await Promise.all([
    confirmationCodeInput.fill(pipelineId),
    deleteButton.isEnabled(),
  ]);
  expect(await deleteButton.isEnabled()).toBeTruthy();

  // Should delete pipeline and navigate to pipelines page
  await Promise.all([page.waitForNavigation(), deleteButton.click()]);
  expect(page.url()).toEqual(`${process.env.NEXT_PUBLIC_MAIN_URL}/pipelines`);

  // Should not display deleted pipeline
  const modelItemTitle = page.locator("h3", { hasText: pipelineId });
  await expect(modelItemTitle).toHaveCount(0);
};
