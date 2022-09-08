import { test, expect } from "@playwright/test";

test.describe.serial("Sync source", () => {
  test("should create source", async ({ page }) => {
    await page.goto("/sources/create");

    // Select gRPC source
    await page.locator("#sourceDefinition").click({ force: true });
    await page.locator("#react-select-sourceDefinition-option-0").click();
    await expect(
      page.locator("data-testid=sourceDefinition-selected-option")
    ).toHaveText("gRPC");

    // Set up source
    const setupButton = page.locator("button:has-text('Set up')");
    expect(await setupButton.isEnabled()).toBeTruthy();
    await Promise.all([page.waitForNavigation(), setupButton.click()]);
    expect(page.url()).toEqual(`${process.env.NEXT_PUBLIC_MAIN_URL}/sources`);
  });

  test("should have proper sources list and navigate to source details page", async ({
    page,
  }) => {
    await page.goto("/sources");

    // Check source item exist
    const sourceItemTitle = page.locator("h3", { hasText: "source-grpc" });
    await expect(sourceItemTitle).toHaveCount(1);

    // Navigate to source details page
    await Promise.all([
      page.waitForNavigation(),
      page.locator("h3", { hasText: "source-grpc" }).click(),
    ]);
    expect(page.url()).toEqual(
      `${process.env.NEXT_PUBLIC_MAIN_URL}/sources/source-grpc`
    );
  });

  test("should have proper source details page", async ({ page }) => {
    await page.goto("/sources/source-grpc");

    // Check title exist
    const pageTitle = page.locator("h2", { hasText: "source-grpc" });
    await expect(pageTitle).toHaveCount(1);

    // Check source state is correct
    const sourceStateLabel = page.locator("data-testid=state-label");
    await expect(sourceStateLabel).toHaveText("Connected");

    // Check source definition is correct
    const sourceDefinitionOption = page.locator(
      "data-testid=sourceDefinition-selected-option"
    );
    await expect(sourceDefinitionOption).toHaveText("gRPC");

    // Check we can open delete source modal
    const openDeleteSourceModalButton = page.locator("button", {
      hasText: "Delete",
    });
    expect(await openDeleteSourceModalButton.isEnabled()).toBeTruthy();
  });

  test("should have proper delete source modal and delete source", async ({
    page,
  }) => {
    await page.goto("/sources/source-grpc");

    // Check we can open delete source modal (To avoid flaky test)
    const openDeleteSourceModalButton = page.locator("button", {
      hasText: "Delete",
    });
    expect(await openDeleteSourceModalButton.isEnabled()).toBeTruthy();

    // Open delete source modal
    await openDeleteSourceModalButton.click();
    const deleteResourceModal = page.locator(
      "data-testid=delete-resource-modal"
    );
    await expect(deleteResourceModal).toHaveCount(1);

    // Check delete resource modal has proper title
    const modalTitle = deleteResourceModal.locator("h2", {
      hasText: "Delete This Source",
    });
    await expect(modalTitle).toHaveCount(1);

    // Check delete resource modal has proper confirmation code
    const confirmationCode = deleteResourceModal.locator("label", {
      hasText: `Please type "source-grpc" to confirm.`,
    });
    await expect(confirmationCode).toHaveCount(1);

    // Check delete resource modal's delete button is not enabled
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
    await confirmationCodeInput.type("source-grpc");
    await expect(confirmationCodeInput).toHaveValue("source-grpc");
    expect(await deleteButton.isEnabled()).toBeTruthy();

    // Delete source and navigate to sources page
    await Promise.all([page.waitForNavigation(), deleteButton.click()]);
    expect(page.url()).toEqual(`${process.env.NEXT_PUBLIC_MAIN_URL}/sources`);

    // Check whether the list item not exist
    const sourceItemTitle = page.locator("h3", { hasText: "source-grpc" });
    await expect(sourceItemTitle).toHaveCount(0);
  });
});
