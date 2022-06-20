import { test, expect } from "@playwright/test";

test("first time enter user should go to the onboarding page", async ({
  page,
}) => {
  if (!process.env.NEXT_PUBLIC_MAIN_URL) return;

  await page.goto(process.env.NEXT_PUBLIC_MAIN_URL);

  await expect(page).toHaveURL(
    `${process.env.NEXT_PUBLIC_MAIN_URL}/onboarding`
  );
});

test("should disable start button, if email input is not correct", async ({
  page,
}) => {
  if (!process.env.NEXT_PUBLIC_MAIN_URL) return;

  await page.goto(process.env.NEXT_PUBLIC_MAIN_URL);

  // Fill in email
  await page.fill("text='Your email *'", "instill");

  // Fill in company
  await page.fill("text='Your company *'", "instill-ai");

  // Select role
  const select = await page.waitForSelector("#react-select-role-input");
  await select.click();
  const option = await page.waitForSelector(":text('Manager')", {
    state: "attached",
  });
  await option.scrollIntoViewIfNeeded();
  await option.click();

  await page.locator("test=Start").isDisabled();
});

test("should disable start button, if other field is not filled in", async ({
  page,
}) => {
  if (!process.env.NEXT_PUBLIC_MAIN_URL) return;

  await page.goto(process.env.NEXT_PUBLIC_MAIN_URL);
  await page.fill("text='Your email *'", "instill@instill.tech");
  await page.locator("test=Start").isDisabled();
});

test("should successfully fill in the onboarding form and submit", async ({
  page,
  context,
}) => {
  if (!process.env.NEXT_PUBLIC_MAIN_URL) return;

  await page.goto(process.env.NEXT_PUBLIC_MAIN_URL);
  await expect(page).toHaveURL(
    `${process.env.NEXT_PUBLIC_MAIN_URL}/onboarding`
  );

  // Fill in email
  await page.fill("text='Your email *'", "instill@instill.tech");

  // Fill in company
  await page.fill("text='Your company *'", "instill-ai");

  // Select role - manager
  const select = await page.waitForSelector("#react-select-role-input");
  await select.click();
  const option = await page.waitForSelector(":text('Manager')", {
    state: "attached",
  });
  await option.scrollIntoViewIfNeeded();
  await option.click();

  // Accept newsletter subscription
  await page.locator("#newsletter_subscription").click();

  // Click Start and wait for navigation
  await page.locator("test=Start").click();
  await page.waitForNavigation();

  expect(page.url).toBe(`${process.env.NEXT_PUBLIC_MAIN_URL}/pipeline`);

  // Check cookie exist
  const cookies = await context.cookies();
  const instillCookies = cookies.find(
    (e) => e.name === process.env.NEXT_PUBLIC_INSTILL_AI_USER_COOKIE_NAME
  );
  expect(instillCookies).not.toBeNull();
  expect(
    JSON.parse(instillCookies?.value as string).cookie_token
  ).not.toBeNull();
});
