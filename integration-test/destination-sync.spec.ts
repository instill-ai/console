import { env, deleteDestination, expectToSelectOption } from "./helper";
import { test, expect } from "@playwright/test";
import { expectToDeleteConnector } from "./common/connector";

export function handleSyncDestinationTest() {
  const destinationId = "response";
  const destinationType = "Response";

  // If there has a response operator, we need to delete it then proceed the test.
  test.beforeAll(async () => {
    try {
      await deleteDestination(destinationId);
    } catch (err) {
      return Promise.reject(err);
    }
  });

  test.describe.serial("Destination", () => {
    test("should create response destination", async ({ page }) => {
      await page.goto("/destinations/create", { waitUntil: "networkidle" });

      // Should select destination type - Response
      await expectToSelectOption(
        page.locator("#destination-definition"),
        page
          .locator(`[data-radix-select-viewport=""]`)
          .getByText(destinationType)
      );

      // Should set up destination
      const setupButton = page.locator("button", { hasText: "Set up" });

      await setupButton.isEnabled();

      await Promise.all([
        page.waitForURL(`${env("NEXT_PUBLIC_CONSOLE_BASE_URL")}/destinations`),
        setupButton.click(),
      ]);
    });

    test("should have destination list and navigate to destination details page", async ({
      page,
    }) => {
      await page.goto("/destinations", { waitUntil: "networkidle" });

      // Should have model item in list
      const destinationItemTitle = page.locator("h3", {
        hasText: destinationId,
      });
      await expect(destinationItemTitle).toHaveCount(1);

      // Should navigate to destination details page
      await Promise.all([
        page.waitForURL(
          `${env("NEXT_PUBLIC_CONSOLE_BASE_URL")}/destinations/${destinationId}`
        ),
        page.locator("h3", { hasText: destinationId }).click(),
      ]);
    });

    test("should have proper destination details page", async ({ page }) => {
      await page.goto(`/destinations/${destinationId}`, {
        waitUntil: "networkidle",
      });

      // Should have correct title
      const destinationTitle = page.locator("h2", { hasText: destinationId });
      await expect(destinationTitle).toHaveCount(1);

      // Should have correct destination type
      const destinationTypeOption = page.locator("#destination-definition");
      await expect(destinationTypeOption).toHaveText(destinationType);

      // Should disable edit button
      const editButton = page.locator("button", {
        hasText: "Edit",
      });
      expect(await editButton.isDisabled()).toBeTruthy();
    });

    test("should have delete destination modal and correctly delete destination", async ({
      page,
    }) => {
      await expectToDeleteConnector(page, "destination", destinationId);
    });
  });
}
