import { test } from "@playwright/test";
import { expectToOnboardUser } from "../common/mgmt";

test("should successfully fill in the onboarding form and submit", async ({
  page,
}) => {
  await expectToOnboardUser(page);
  await page.context().storageState({ path: "playwright-state.json" });
});
