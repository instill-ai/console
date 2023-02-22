import { chromium, FullConfig } from "@playwright/test";
import { addRegisteredUser } from "../common/mgmt";

// We use this setup to store the cookie in playwright-state. In this way,
// Playwright can automatically pick up the cookie among every test and it
// won't be redirected to onboarding page due to lack of login cookie.

export async function globalSetup(config: FullConfig) {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await addRegisteredUser();
  await page.context().storageState({ path: "playwright-state.json" });
  await browser.close();
}
