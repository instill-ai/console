import { test, expect } from "@playwright/test";

test("should create new source", async ({ page }) => {
  if (!process.env.NEXT_PUBLIC_MAIN_URL) {
    throw new Error("env not found");
  }

  await page.goto(`${process.env.NEXT_PUBLIC_MAIN_URL}/sources/create`);

  // Select source type
  await page.locator("#sourceDefinition").click({ force: true });
  await page.locator("#react-select-source-definition-option-0").click();

  // Create the source
  await page.locator("text=Setup new source").click();
  await page.waitForNavigation();

  expect(page.url()).toBe(`${process.env.NEXT_PUBLIC_MAIN_URL}/sources`);
  await expect(page.locator("h3", { hasText: "source-grpc" })).toBeVisible();
});

test("should navigate to source details page", async ({ page }) => {
  if (!process.env.NEXT_PUBLIC_MAIN_URL) {
    throw new Error("env not found");
  }

  await page.goto(`${process.env.NEXT_PUBLIC_MAIN_URL}/sources`);
  await page.locator("h3", { hasText: "source-grpc" }).click();

  expect(page.url()).toBe(
    `${process.env.NEXT_PUBLIC_MAIN_URL}/sources/source-grpc`
  );
});
