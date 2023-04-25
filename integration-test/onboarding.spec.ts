import { env, expectToSelectOption } from "./helper";
import { test, expect } from "@playwright/test";
import { expectToOnboardUser, removeRegisteredUser } from "./common/mgmt";

export function handleOnboardingTest() {
  test.skip("should navigate first time user to the onboarding page", async ({
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
    const emailSubscriptionField = page.locator(
      "input#newsletter-subscription"
    );
    expect(await emailSubscriptionField.isChecked()).toBeTruthy();
  });

  test("should display error label, if email input format is not correct", async ({
    page,
  }) => {
    await page.goto("/onboarding", { waitUntil: "networkidle" });

    // Should input email
    await page.locator("input#email").fill("instill");

    // Should input company name
    await page.locator("input#org-name").fill("instill-ai");

    // Should select role
    await expectToSelectOption(
      page.locator("#role"),
      page.locator(`[data-radix-select-viewport=""]`).getByText("Manager")
    );

    // Should disable start button
    const startButton = page.locator("button", { hasText: "Start" });
    const emailErrorLabel = page.locator("[data-testid='email-label-error']", {
      hasText: "Invalid email address",
    });

    await Promise.all([emailErrorLabel.isVisible(), await startButton.click()]);
  });

  test("should successfully fill in the onboarding form and submit", async ({
    page,
  }) => {
    await removeRegisteredUser();
    await expectToOnboardUser(page);
  });
}
