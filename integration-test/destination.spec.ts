import { test, expect } from "@playwright/test";

test.describe.serial("Sync destination", () => {
  const destinationId = "destination-http";
  const destinationType = "HTTP";
  test("should create sync http destination", async ({ page }) => {
    await page.goto("/destinations/create");

    // Select destination type - HTTP
    await page.locator("#react-select-definition-input").click({ force: true });
    await page
      .locator("data-testid=definition-selected-option", {
        hasText: destinationType,
      })
      .click();
    await expect(
      page.locator("data-testid=definition-selected-option")
    ).toHaveText(destinationType);

    // Set up destination
    const setupButton = page.locator("button", { hasText: "Set up" });
    await Promise.all([page.waitForNavigation(), setupButton.click()]);
    expect(page.url()).toEqual(
      `${process.env.NEXT_PUBLIC_MAIN_URL}/destinations`
    );
  });

  test("should have destination list and navigate to destination details page", async ({
    page,
  }) => {
    await page.goto("/destinations");

    // Should have model item in list
    const destinationItemTitle = page.locator("h3", { hasText: destinationId });
    await expect(destinationItemTitle).toHaveCount(1);

    // Should navigate to destination details page
    await Promise.all([
      page.waitForNavigation(),
      page.locator("h3", { hasText: destinationId }).click(),
    ]);
    expect(page.url()).toEqual(
      `${process.env.NEXT_PUBLIC_MAIN_URL}/destinations/${destinationId}`
    );
  });

  test("should have proper destination details page", async ({ page }) => {
    await page.goto(`/destinations/${destinationId}`);

    // Should have correct title
    const destinationTitle = page.locator("h2", { hasText: destinationId });
    await expect(destinationTitle).toHaveCount(1);

    // Should have correct destination type
    const destinationTypeOption = page.locator(
      "data-testid=definition-selected-option"
    );
    await expect(destinationTypeOption).toHaveText(destinationType);

    // Should disable edit button
    const editButton = page.locator("button", {
      hasText: "Edit",
    });
    expect(await editButton.isDisabled()).toBeTruthy;
  });

  test("should have delete destination modal and correctly delete destination", async ({
    page,
  }) => {
    await page.goto(`/destinations/${destinationId}`);

    // Should enable open delete model modal button
    const openDeleteDestinationModalButton = page.locator("button", {
      hasText: "Delete",
    });
    expect(await openDeleteDestinationModalButton.isEnabled()).toBeTruthy();

    // Should open delete destination modal
    await openDeleteDestinationModalButton.click();
    const deleteResourceModal = page.locator(
      "data-testid=delete-resource-modal"
    );
    await expect(deleteResourceModal).toHaveCount(1);

    // Should have proper modal title
    const modalTitle = deleteResourceModal.locator("h2", {
      hasText: "Delete This Destination",
    });
    await expect(modalTitle).toHaveCount(1);

    // Should have proper confirmation code hint
    const confirmationCodeHint = deleteResourceModal.locator("label", {
      hasText: `Please type "${destinationId}" to confirm.`,
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
    await confirmationCodeField.type(destinationId);
    await expect(confirmationCodeField).toHaveValue(destinationId);
    expect(await deleteButton.isEnabled()).toBeTruthy();

    // Should delete destination and navigate to destinations page
    await Promise.all([page.waitForNavigation(), deleteButton.click()]);
    expect(page.url()).toEqual(
      `${process.env.NEXT_PUBLIC_MAIN_URL}/destinations`
    );

    // Should remove the destination from destination list
    const modelItemTitle = page.locator("h3", { hasText: destinationId });
    await expect(modelItemTitle).toHaveCount(0);
  });
});
