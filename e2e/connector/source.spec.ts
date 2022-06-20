import { test, expect } from "@playwright/test";

test("should setup new source", async ({ page }) => {
  if (!process.env.NEXT_PUBLIC_MAIN_URL) {
    throw new Error("env not found");
  }

  await page.goto(`${process.env.NEXT_PUBLIC_MAIN_URL}/source/create`);
});
