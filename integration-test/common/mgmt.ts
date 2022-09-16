import { BrowserContext, Page, expect } from "@playwright/test";

export const removeRegisteredUser = async () => {
  await fetch(
    `${process.env.NEXT_PUBLIC_MGMT_BACKEND_BASE_URL}/${process.env.NEXT_PUBLIC_API_VERSION}/local-user`,
    { method: "patch", body: JSON.stringify({ cookie_token: "" }) }
  );
};

export const expectToOnboardUser = async (
  page: Page,
  context: BrowserContext,
  browserName: string
) => {
  await page.goto("/onboarding", { waitUntil: "networkidle" });

  // Should input email
  const emailField = page.locator("input#email");
  await emailField.fill("droplet@instill.tech");

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
};
