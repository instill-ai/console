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

  // Fill in email
  await page.fill("text='Your email *'", "instill@instill.tech");
  const email = await page.inputValue("text='Your email *'");
  expect(email).toBe("instill@instill.tech");

  // Fill in company
  await page.fill("text='Your company *'", "instill-ai");
  const company = await page.inputValue("text='Your company *");
  expect(company).toBe("instill-ai");

  // Select manager
  const select = await page.waitForSelector("#react-select-role-input");
  await select.click();
  const option = await page.waitForSelector(":text('Manager')", {
    state: "attached",
  });
  await option.scrollIntoViewIfNeeded();
  await option.click();
  const role = await page.inputValue("text='Your role *");
  expect(role).toBe("Manager (who make decisions)");
});
