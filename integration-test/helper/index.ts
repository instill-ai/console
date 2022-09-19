import { BrowserContext, expect, Page } from "@playwright/test";
import { addRegisteredUser } from "../common/mgmt";

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

export const initialNavigationTo = async (page: Page, path: string) => {
  await addRegisteredUser();
  await page.goto(path, { waitUntil: "networkidle" });
  expect(page.url()).toBe(
    path[0] === "/"
      ? `${process.env.NEXT_PUBLIC_MAIN_URL}${path}`
      : `${process.env.NEXT_PUBLIC_MAIN_URL}/${path}`
  );
};
