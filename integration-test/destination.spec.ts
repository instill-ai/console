import { test, expect } from "@playwright/test";

test("should create new destination", async ({ page }) => {
  await page.goto("/destinations/create");

  // Select destination type
  await page.locator("#destinationDefinition").click({ force: true });
  await page.locator("#react-select-destinationDefinition-option-0").click();

  // Create the destination
  await page.locator("button", { hasText: "Set up destination" }).click();
  await page.waitForNavigation();

  expect(page.url()).toBe(`${process.env.NEXT_PUBLIC_MAIN_URL}/destinations`);
  await expect(
    page.locator("h3", { hasText: "destination-grpc" })
  ).toBeVisible();
});

test("should navigate to destination details page", async ({ page }) => {
  await page.goto("/destinations");
  await page.locator("h3", { hasText: "destination-grpc" }).click();

  expect(page.url()).toBe(
    `${process.env.NEXT_PUBLIC_MAIN_URL}/destinations/destination-grpc`
  );
});
