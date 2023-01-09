import { env } from "../helper";
import { Page, expect } from "@playwright/test";

export const expectToDeleteConnector = async (
  page: Page,
  type: "destination" | "source",
  id: string
) => {
  await page.goto(`/${type}s/${id}`);

  // Should enable open delete model modal button
  const openDeleteDestinationModalButton = page.locator("button", {
    hasText: "Delete",
  });
  expect(await openDeleteDestinationModalButton.isEnabled()).toBeTruthy();

  // Should open delete destination modal
  await openDeleteDestinationModalButton.click();
  const deleteResourceModal = page.locator("data-testid=delete-resource-modal");
  await expect(deleteResourceModal).toHaveCount(1);

  // Should have proper modal title
  const modalTitle = deleteResourceModal.locator("h2", {
    hasText: `Delete This ${type === "destination" ? "Destination" : "Source"}`,
  });
  await expect(modalTitle).toHaveCount(1);

  // Should have proper confirmation code hint
  const confirmationCodeHint = deleteResourceModal.locator("label", {
    hasText: `Please type "${id}" to confirm.`,
  });
  await expect(confirmationCodeHint).toHaveCount(1);

  // Should disable delete button
  const deleteButton = deleteResourceModal.locator("button", {
    hasText: "Delete",
  });
  expect(await deleteButton.isDisabled()).toBeTruthy();

  // Should enable cancel button
  const cancelButton = deleteResourceModal.locator("button", {
    hasText: "Cancel",
  });
  expect(await cancelButton.isEnabled()).toBeTruthy();

  // Should input correcy confirmation code
  const confirmationCodeField =
    deleteResourceModal.locator("#confirmationCode");
  await confirmationCodeField.type(id);
  expect(await deleteButton.isEnabled()).toBeTruthy();

  // Should delete destination and navigate to destinations page
  await Promise.all([page.waitForNavigation(), deleteButton.click()]);
  expect(page.url()).toEqual(`${env("NEXT_PUBLIC_CONSOLE_BASE_URL")}/${type}s`);

  // Should remove the destination from destination/source list
  const itemTitle = page.locator("h3", { hasText: id });
  await expect(itemTitle).toHaveCount(0);
};
