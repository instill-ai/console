import { test, expect } from "@playwright/test";

test.describe.serial("Sync source", () => {
  test("should create source", async ({ page }) => {
    await page.goto("/sources/create", { waitUntil: "networkidle" });

    // Should select gRPC source
    const sourceDefinitionOption = page.locator("#sourceDefinition");
    await sourceDefinitionOption.click({ force: true });
    await page
      .locator("data-testid=sourceDefinition-selected-option", {
        hasText: "gRPC",
      })
      .click();
    await expect(
      page.locator("data-testid=sourceDefinition-selected-option")
    ).toHaveText("gRPC");

    // Should enable set up button
    const setupButton = page.locator("button:has-text('Set up')");
    expect(await setupButton.isEnabled()).toBeTruthy();

    // Should set up source
    await Promise.all([page.waitForNavigation(), setupButton.click()]);
    expect(page.url()).toEqual(`${process.env.NEXT_PUBLIC_MAIN_URL}/sources`);
  });

  test("should have proper sources list and navigate to source details page", async ({
    page,
  }) => {
    await page.goto("/sources", { waitUntil: "networkidle" });

    // Should have crrrect table item
    const sourceItemTitle = page.locator("h3", { hasText: "source-grpc" });
    await expect(sourceItemTitle).toHaveCount(1);

    // Should navigate to source details page
    await Promise.all([page.waitForNavigation(), sourceItemTitle.click()]);
    expect(page.url()).toEqual(
      `${process.env.NEXT_PUBLIC_MAIN_URL}/sources/source-grpc`
    );
  });

  test("should have proper source details page", async ({ page }) => {
    await page.goto("/sources/source-grpc", { waitUntil: "networkidle" });

    // Should have correct title
    const pageTitle = page.locator("h2", { hasText: "source-grpc" });
    await expect(pageTitle).toHaveCount(1);

    // Should have correct state
    const sourceStateLabel = page.locator("data-testid=state-label");
    await expect(sourceStateLabel).toHaveText("Connected");

    // Should have correct definition
    const sourceDefinitionOption = page.locator(
      "data-testid=sourceDefinition-selected-option"
    );
    await expect(sourceDefinitionOption).toHaveText("gRPC");
  });

  test("should have proper delete source modal and delete source", async ({
    page,
  }) => {
    await page.goto("/sources/source-grpc", { waitUntil: "networkidle" });

    // Should enable open delete source modal button
    const openDeleteSourceModalButton = page.locator("button", {
      hasText: "Delete",
    });
    expect(await openDeleteSourceModalButton.isEnabled()).toBeTruthy();

    // Should open delete source modal
    const deleteResourceModal = page.locator(
      "data-testid=delete-resource-modal"
    );
    await Promise.all([
      openDeleteSourceModalButton.click(),
      deleteResourceModal.isVisible(),
    ]);

    // Should have correct modal title
    const modalTitle = deleteResourceModal.locator("h2", {
      hasText: "Delete This Source",
    });
    await expect(modalTitle).toHaveCount(1);

    // Should have correct confirmation code hint
    const confirmationCodeHint = deleteResourceModal.locator("label", {
      hasText: `Please type "source-grpc" to confirm.`,
    });
    await expect(confirmationCodeHint).toHaveCount(1);

    // Should disable delete source button
    const deleteSourceButton = deleteResourceModal.locator("button", {
      hasText: "Delete",
    });
    expect(await deleteSourceButton.isDisabled()).toBeTruthy();

    // Should enable cancel button
    const cancelButton = deleteResourceModal.locator("button", {
      hasText: "Cancel",
    });
    expect(await cancelButton.isEnabled()).toBeTruthy();

    // Should Input confirmation code
    const confirmationCodeInput =
      deleteResourceModal.locator("#confirmationCode");

    await Promise.all([
      confirmationCodeInput.fill("source-grpc"),
      deleteSourceButton.isEnabled(),
    ]);

    // Delete source and navigate to sources page
    await Promise.all([page.waitForNavigation(), deleteSourceButton.click()]);
    expect(page.url()).toEqual(`${process.env.NEXT_PUBLIC_MAIN_URL}/sources`);

    // Check whether the list item not exist
    const sourceItemTitle = page.locator("h3", { hasText: "source-grpc" });
    await expect(sourceItemTitle).toHaveCount(0);
  });
});
