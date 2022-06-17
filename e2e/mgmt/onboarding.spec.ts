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

test("should successfully fill in the onboarding form and submit", async ({
  page,
}) => {
  if (!process.env.NEXT_PUBLIC_MAIN_URL) return;

  await page.goto(process.env.NEXT_PUBLIC_MAIN_URL);

  await expect(page).toHaveURL(
    `${process.env.NEXT_PUBLIC_MAIN_URL}/onboarding`
  );

  await page.fill("text='Your email *'", "instill@instill.tech");
  const email = await page.inputValue("text='Your email *'");
  expect(email).toBe("instill@instill.tech");

  await page.fill("text='Your company *'", "instill-ai");

  const select = await page.waitForSelector("#react-select-role-input");

  await select.click();

  const option = await page.waitForSelector(":text('Manager')", {
    state: "attached",
  });
  await option.scrollIntoViewIfNeeded();
  await option.click();
});
