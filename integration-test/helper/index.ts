import { BrowserContext, expect, Locator, Page } from "@playwright/test";

export const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const addUserCookie = async (context: BrowserContext) => {
  await context.addCookies([
    {
      name: "instill-ai-user",
      domain: process.env.NEXT_PUBLIC_MAIN_URL?.split(":")[0],
      path: "/",
      value: JSON.stringify({ cookie_token: "instill-token" }),
      httpOnly: process.env.NODE_ENV === "production" ? true : false,
    },
  ]);

  const newCookies = await context.cookies();
  const instillAiUser = newCookies.find((e) => e.name === "instill-ai-user");
  expect(instillAiUser).toBeDefined();
};

export const expectToSelectReactSelectOption = async (
  clickElement: Locator,
  selectElement: Locator,
  waitForElement?: Locator
) => {
  await clickElement.click({ force: true });

  if (waitForElement) {
    await Promise.all([
      waitForElement.waitFor({ state: "visible" }),
      selectElement.click(),
    ]);
  } else {
    await selectElement.click();
  }
};
