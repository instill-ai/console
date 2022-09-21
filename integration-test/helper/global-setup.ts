import { chromium, FullConfig } from "@playwright/test";
import { addRegisteredUser } from "../common/mgmt";

async function globalSetup(config: FullConfig) {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await addRegisteredUser();
  await page.context().storageState({ path: "playwright-state.json" });
  await browser.close();
}

export default globalSetup;
