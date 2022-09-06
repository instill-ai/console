import { test, expect } from "@playwright/test";
import { removeRegisteredUser } from "./common/mgmt";

test("first time enter user should go to the onboarding page", async ({
  page,
}) => {
  await removeRegisteredUser();
  await page.goto("/");
  await expect(page).toHaveURL(
    `${process.env.NEXT_PUBLIC_MAIN_URL}/onboarding`
  );
});

test("should disable start button, if email input is not correct", async ({
  page,
}) => {
  await page.goto("/onboarding");
  await page.locator("#email").fill("instill");
  await page.type("#companyName", "instill-ai");

  // Select role
  await page.locator("#role").click({ force: true });
  await page.locator("#react-select-role-option-0").click();

  const startButtonState = await page.locator("text=Start").isDisabled();
  expect(startButtonState).toBeTruthy();
});

test("should disable start button, if email format is not correct", async ({
  page,
}) => {
  await page.goto("/onboarding");
  await page.locator("#email").fill("instill");
  const startButtonState = await page.locator("text=Start").isDisabled();
  expect(startButtonState).toBeTruthy();
});

test("should disable start button, if fields are not filled in", async ({
  page,
}) => {
  await page.goto("/onboarding");
  expect(await page.locator("text=Start").isDisabled()).toBeTruthy();

  await page.locator("#email").fill("instill@instill.tech");
  expect(await page.locator("text=Start").isDisabled()).toBeTruthy();

  await page.type("#companyName", "instill-ai");
  expect(await page.locator("text=Start").isDisabled()).toBeTruthy();
});

test("should successfully fill in the onboarding form and submit", async ({
  page,
  context,
  browserName,
}) => {
  // await removeRegisteredUser();
  await page.goto("/onboarding");
  await page.locator("#email").fill("instill@gmail.com");
  await page.type("#companyName", "instill-ai");

  // Select role
  await page.locator("#role").click({ force: true });
  await page.locator("#react-select-role-option-0").click();

  // Accept newsletter subscription
  await page.locator("#newsletterSubscription").check();

  // Click Start and wait for navigation
  await Promise.all([
    // It is important to call waitForNavigation before click to set up waiting.
    page.waitForNavigation(),
    // Clicking the link will indirectly cause a navigation.
    await page.locator("text=Start").click({ force: true }),
  ]);

  expect(page.url()).toBe(`${process.env.NEXT_PUBLIC_MAIN_URL}/pipelines`);

  // Check cookie exist
  // Safari have issue when setting up cookies.
  if (browserName !== "webkit") {
    const cookies = await context.cookies();
    const instillCookies = cookies.find(
      (e) => e.name === process.env.NEXT_PUBLIC_INSTILL_AI_USER_COOKIE_NAME
    );
    expect(instillCookies).toBeDefined();
  }
});
