import { test, expect } from "@playwright/test";

test("should create new destination", async ({ page }) => {
  if (!process.env.NEXT_PUBLIC_MAIN_URL) {
    throw new Error("env not found");
  }

  await page.goto(`${process.env.NEXT_PUBLIC_MAIN_URL}/destinations/create`);

  // Select destination type
  await page.locator("#destinationDefinition").click({ force: true });
  await page.locator("#react-select-destination-definition-option-0").click();

  // Create the destination
  await page.locator("text=Set up destination").click();
  await page.waitForNavigation();

  expect(page.url()).toBe(`${process.env.NEXT_PUBLIC_MAIN_URL}/destinations`);
  await expect(
    page.locator("h3", { hasText: "destination-grpc" })
  ).toBeVisible();
});

test("should navigate to destination details page", async ({ page }) => {
  if (!process.env.NEXT_PUBLIC_MAIN_URL) {
    throw new Error("env not found");
  }

  await page.goto(`${process.env.NEXT_PUBLIC_MAIN_URL}/destinations`);
  await page.locator("h3", { hasText: "destination-grpc" }).click();

  expect(page.url()).toBe(
    `${process.env.NEXT_PUBLIC_MAIN_URL}/destinations/destination-grpc`
  );
});
