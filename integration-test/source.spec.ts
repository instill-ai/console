import { env, deleteSource, expectToSelectOption } from "./helper";
import { test, expect } from "@playwright/test";

export function handleSourceTest() {
  const sourceId = "source-grpc";

  // If there has a source-grpc connector, we need to delete it then proceed the test.
  test.beforeAll(async () => {
    try {
      await deleteSource(sourceId);
    } catch (err) {
      console.log(err);
    }
  });

  test.describe.serial("Sync source", () => {
    test("should create source", async ({ page }) => {
      await page.goto("/sources/create", { waitUntil: "networkidle" });

      // Should select gRPC source
      await expectToSelectOption(
        page.locator("#source-definition"),
        page.locator(`[data-radix-select-viewport=""]`).getByText("gRPC")
      );

      // Should enable set up button
      const setupButton = page.locator("button:has-text('Set up')");
      expect(await setupButton.isEnabled()).toBeTruthy();

      // Should set up source
      await Promise.all([
        page.waitForURL(`${env("NEXT_PUBLIC_CONSOLE_BASE_URL")}/sources`),
        setupButton.click(),
      ]);
    });

    test("should have proper sources list and navigate to source details page", async ({
      page,
    }) => {
      await page.goto("/sources", { waitUntil: "networkidle" });

      // Should have crrrect table item
      const sourceItemTitle = page.locator("h3", { hasText: sourceId });
      await expect(sourceItemTitle).toHaveCount(1);

      // Should navigate to source details page
      await Promise.all([
        page.waitForURL(
          `${env("NEXT_PUBLIC_CONSOLE_BASE_URL")}/sources/${sourceId}`
        ),
        sourceItemTitle.click(),
      ]);
    });

    test("should have proper source details page", async ({ page }) => {
      await page.goto(`/sources/${sourceId}`, { waitUntil: "networkidle" });

      // Should have correct title
      const pageTitle = page.locator("h2", { hasText: sourceId });
      await expect(pageTitle).toHaveCount(1);

      // Should have correct state
      // Need to find a way to test watch state changes
      // const sourceStateLabel = page.locator("data-testid=state-label");
      // await expect(sourceStateLabel).toHaveText("Unspecified");

      // Should have correct definition
      const sourceDefinitionOption = page.locator("#source-definition");
      await expect(sourceDefinitionOption).toHaveText("gRPC");
    });

    test("should have proper delete source modal and delete source", async ({
      page,
    }) => {
      await page.goto(`/sources/${sourceId}`, { waitUntil: "networkidle" });

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
        deleteResourceModal.waitFor(),
      ]);

      // Should have correct modal title
      const modalTitle = deleteResourceModal.locator("h2", {
        hasText: "Delete This Source",
      });
      await expect(modalTitle).toHaveCount(1);

      // Should have correct confirmation code hint
      const confirmationCodeHint = deleteResourceModal.locator("label", {
        hasText: `Please type "${sourceId}" to confirm.`,
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
      await confirmationCodeInput.fill(sourceId);

      // Delete source and navigate to sources page
      await Promise.all([
        page.waitForURL(`${env("NEXT_PUBLIC_CONSOLE_BASE_URL")}/sources`),
        deleteSourceButton.click(),
      ]);

      // Check whether the list item not exist
      const sourceItemTitle = page.locator("h3", { hasText: sourceId });
      await expect(sourceItemTitle).toHaveCount(0);
    });
  });
}
