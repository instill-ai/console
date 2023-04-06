import {
  env,
  createInstillAxiosTestClient,
  expectToSelectOption,
} from "../helper";
import { Page, expect } from "@playwright/test";
import { v4 as uuidv4 } from "uuid";

export const removeRegisteredUser = async () => {
  try {
    const client = createInstillAxiosTestClient();

    await client.patch(`${env("NEXT_PUBLIC_API_VERSION")}/users/me`, {
      cookie_token: "",
    });
  } catch (err) {
    console.log(err);
  }
};

export const addRegisteredUser = async () => {
  try {
    const client = createInstillAxiosTestClient();

    await client.patch(`${env("NEXT_PUBLIC_API_VERSION")}/user`, {
      cookie_token: uuidv4(),
    });
  } catch (err) {
    console.log(err);
  }
};

export const expectToOnboardUser = async (page: Page) => {
  await page.goto("/onboarding", { waitUntil: "networkidle" });

  // Should input email
  await page.locator("input#email").fill("droplet@instill.tech");

  // Should input company name
  await page.locator("input#org-name").fill("instill-ai");

  // Shoyld select role
  await expectToSelectOption(
    page.locator("#role"),
    page.locator(`[data-radix-select-viewport=""]`).getByText("Manager")
  );

  // Should accept newsletter subscription
  await page.locator("#newsletter-subscription").check();

  const startButton = page.locator("button", { hasText: "Start" });
  expect(await startButton.isEnabled()).toBeTruthy();

  // Should submit the onboarding form
  await Promise.all([
    page.waitForURL(`${env("NEXT_PUBLIC_CONSOLE_BASE_URL")}/pipelines`),
    startButton.click(),
  ]);

  // Should have cookie
  // Safari have issue when setting up cookies.
  // if (browserName !== "webkit") {
  //   const cookies = await context.cookies();
  //   const instillCookies = cookies.find(
  //     (e) => e.name === env("NEXT_PUBLIC_INSTILL_AI_USER_COOKIE_NAME")
  //   );
  //   expect(instillCookies).toBeDefined();
  // }
};
