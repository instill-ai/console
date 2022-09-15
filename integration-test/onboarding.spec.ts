import { test, expect } from "@playwright/test";
import { removeRegisteredUser } from "./common/mgmt";

test("should navigate first time user to the onboarding page", async ({
  page,
}) => {
  await removeRegisteredUser();
  await page.goto("/", { waitUntil: "networkidle" });
  await expect(page).toHaveURL(
    `${process.env.NEXT_PUBLIC_MAIN_URL}/onboarding`
  );
});

test("should enable email subscription by defautl", async ({ page }) => {
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
  await page.locator("#role").click({ force: true });
  await page.locator("#react-select-role-option-0").click();

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
  await page.goto("/onboarding", { waitUntil: "networkidle" });

  // Should input email
  const emailField = page.locator("input#email");
  await emailField.fill("instill@gmail.com");

  // Should input company name
  const companyField = page.locator("input#companyName");
  await companyField.fill("instill-ai");

  // Shoyld select role
  await page.locator("#role").click({ force: true });
  await page.locator("#react-select-role-option-0").click();
  await expect(page.locator("data-testid=role-selected-option")).toHaveText(
    "Manager (who makes decisions)"
  );

  // Should accept newsletter subscription
  await page.locator("#newsletterSubscription").check();

  const startButton = page.locator("button", { hasText: "Start" });
  expect(await startButton.isEnabled()).toBeTruthy();

  // Should submit the onboarding form
  await Promise.all([page.waitForNavigation(), startButton.click()]);

  expect(page.url()).toBe(`${process.env.NEXT_PUBLIC_MAIN_URL}/pipelines`);

  // Should have cookie
  // Safari have issue when setting up cookies.
  if (browserName !== "webkit") {
    const cookies = await context.cookies();
    const instillCookies = cookies.find(
      (e) => e.name === process.env.NEXT_PUBLIC_INSTILL_AI_USER_COOKIE_NAME
    );
    expect(instillCookies).toBeDefined();
  }
});
