import { chromium, FullConfig } from "@playwright/test";
import { addRegisteredUser, expectToOnboardUser } from "../common/mgmt";

// We use this setup to store the cookie in playwright-state. In this way,
// Playwright can automatically pick up the cookie among every test and it
// won't be redirected to onboarding page due to lack of login cookie.

async function globalSetup(config: FullConfig) {
  const { baseURL } = config.projects[0].use;
  const browser = await chromium.launch();
  const page = await browser.newPage({ baseURL });
  await expectToOnboardUser(page);
  await page.context().storageState({ path: "playwright-state.json" });
  await browser.close();
}

export default globalSetup;
