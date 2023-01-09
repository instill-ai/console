import { env , expectToSelectReactSelectOption } from "./helper";
import { test, expect } from "@playwright/test";
import { expectToOnboardUser, removeRegisteredUser } from "./common/mgmt";

test("should navigate first time user to the onboarding page", async ({
  page,
}) => {
  await removeRegisteredUser();
  await page.goto("/", { waitUntil: "networkidle" });
  await expect(page).toHaveURL(
    `${env("NEXT_PUBLIC_CONSOLE_BASE_URL")}/onboarding`
  );
});

test("should enable email subscription by default", async ({ page }) => {
  await page.goto("/onboarding", { waitUntil: "networkidle" });

  // Should check email subscription
  const emailSubscriptionField = page.locator("input#newsletterSubscription");
  expect(await emailSubscriptionField.isChecked()).toBeTruthy();
});

test("should disable start button, if email input format is not correct", async ({
  page,
}) => {
  await page.goto("/onboarding", { waitUntil: "networkidle" });

  // Should input email
  const emailField = page.locator("input#email");
  await emailField.fill("instill");

  // Should input company name
  const companyField = page.locator("input#companyName");
  await companyField.fill("instill-ai");

  // Should select role
  await expectToSelectReactSelectOption(
    page.locator("#react-select-role-input"),
    page.locator("data-testid=role-selected-option", {
      hasText: "Manager (who makes decisions)",
    })
  );

  // Should disable start button
  const startButton = page.locator("button", { hasText: "Start" });
  expect(await startButton.isDisabled()).toBeTruthy();
});

test("should successfully fill in the onboarding form and submit", async ({
  page,
  context,
  browserName,
}) => {
  await removeRegisteredUser();
  await expectToOnboardUser(page, context, browserName);
});
