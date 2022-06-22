import { test, expect } from "@playwright/test";

test("first time enter user should go to the onboarding page", async ({
  page,
}) => {
  if (!process.env.NEXT_PUBLIC_MAIN_URL) {
    throw new Error("env not found");
  }
  await page.goto(process.env.NEXT_PUBLIC_MAIN_URL);

  await expect(page).toHaveURL(
    `${process.env.NEXT_PUBLIC_MAIN_URL}/onboarding`
  );
});

test("should disable start button, if email input is not correct", async ({
  page,
}) => {
  if (!process.env.NEXT_PUBLIC_MAIN_URL) {
    throw new Error("env not found");
  }

  await page.goto(`${process.env.NEXT_PUBLIC_MAIN_URL}/onboarding`);
  await page.locator("#email").fill("instill");
  await page.type("#company_name", "instill-ai");

  // Select role
  await page.locator("#role").click({ force: true });
  await page.locator("#react-select-role-option-0").click();

  const startButtonState = await page.locator("text=Start").isDisabled();
  expect(startButtonState).toBeTruthy();
});

test("should disable start button, if other field is not filled in", async ({
  page,
}) => {
  if (!process.env.NEXT_PUBLIC_MAIN_URL) {
    throw new Error("env not found");
  }

  await page.goto(`${process.env.NEXT_PUBLIC_MAIN_URL}/onboarding`);
  await page.locator("#email").fill("instill");

  const startButtonState = await page.locator("text=Start").isDisabled();
  expect(startButtonState).toBeTruthy();
});

test("should successfully fill in the onboarding form and submit", async ({
  page,
  context,
}) => {
  if (!process.env.NEXT_PUBLIC_MAIN_URL) {
    throw new Error("env not found");
  }

  await page.goto(`${process.env.NEXT_PUBLIC_MAIN_URL}/onboarding`);
  await page.locator("#email").fill("instill@gmail.com");
  await page.type("#company_name", "instill-ai");

  // Select role
  await page.locator("#role").click({ force: true });
  await page.locator("#react-select-role-option-0").click();

  // Accept newsletter subscription
  await page.locator("#newsletter_subscription").check();

  // Click Start and wait for navigation
  await page.locator("text=Start").click();
  await page.waitForNavigation();

  expect(page.url()).toBe(`${process.env.NEXT_PUBLIC_MAIN_URL}/pipelines`);

  // Check cookie exist
  const cookies = await context.cookies();
  const instillCookies = cookies.find(
    (e) => e.name === process.env.NEXT_PUBLIC_INSTILL_AI_USER_COOKIE_NAME
  );
  expect(instillCookies).toBeDefined();
});
