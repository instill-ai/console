import { BrowserContext } from "@playwright/test";

export const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const addInstillCookie = async (context: BrowserContext) => {
  await context.addCookies([
    {
      name: "instill-ai-user",
      domain: process.env.NEXT_PUBLIC_MAIN_URL?.split(":")[0],
      path: "/",
      value: JSON.stringify({ cookie_token: "instill-token" }),
      httpOnly: process.env.NODE_ENV === "production" ? true : false,
    },
  ]);
};
