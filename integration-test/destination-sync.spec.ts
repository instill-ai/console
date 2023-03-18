import {
  env,
  deleteDestination,
  expectToSelectReactSelectOption,
} from "./helper";
import { test, expect } from "@playwright/test";
import { expectToDeleteConnector } from "./common/connector";

export function handleSyncDestinationTest() {
  const destinationId = "destination-http";
  const destinationType = "HTTP";

  // If there has a destination-http connector, we need to delete it then proceed the test.
  test.beforeAll(async () => {
    try {
      await deleteDestination(destinationId);
    } catch (err) {
      return Promise.reject(err);
    }
  });

  test.describe.serial("Sync destination", () => {
    test("should create sync http destination", async ({ page }) => {
      await page.goto("/destinations/create");

      // Should select destination type - HTTP
      await expectToSelectReactSelectOption(
        page.locator("#react-select-definition-input"),
        page.locator("data-testid=definition-selected-option", {
          hasText: destinationType,
        })
      );

      // Should set up destination
      const setupButton = page.locator("button", { hasText: "Set up" });
      await Promise.all([page.waitForNavigation(), setupButton.click()]);
      expect(page.url()).toEqual(
        `${env("NEXT_PUBLIC_CONSOLE_BASE_URL")}/destinations`
      );
    });

    test("should have destination list and navigate to destination details page", async ({
      page,
    }) => {
      await page.goto("/destinations");

      // Should have model item in list
      const destinationItemTitle = page.locator("h3", {
        hasText: destinationId,
      });
      await expect(destinationItemTitle).toHaveCount(1);

      // Should navigate to destination details page
      await Promise.all([
        page.waitForNavigation(),
        page.locator("h3", { hasText: destinationId }).click(),
      ]);
      expect(page.url()).toEqual(
        `${env("NEXT_PUBLIC_CONSOLE_BASE_URL")}/destinations/${destinationId}`
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
      expect(await editButton.isDisabled()).toBeTruthy();
    });

    test("should have delete destination modal and correctly delete destination", async ({
      page,
    }) => {
      await expectToDeleteConnector(page, "destination", destinationId);
    });
  });
}
