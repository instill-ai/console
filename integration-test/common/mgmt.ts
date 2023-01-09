import { env ,
  createInstillAxiosTestClient,
  expectToSelectReactSelectOption,
} from "../helper";
import { BrowserContext, Page, expect } from "@playwright/test";
import { v4 as uuidv4 } from "uuid";

export const removeRegisteredUser = async () => {
  try {
    const client = createInstillAxiosTestClient();

    await client.patch(`${env("NEXT_PUBLIC_API_VERSION")}/users/local-user`, {
      cookie_token: "",
    });
  } catch (err) {
    console.log(err);
  }
};

export const addRegisteredUser = async () => {
  try {
    const client = createInstillAxiosTestClient();

    await client.patch(`${env("NEXT_PUBLIC_API_VERSION")}/users/local-user`, {
      cookie_token: uuidv4(),
    });
  } catch (err) {
    console.log(err);
  }
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
  await expectToSelectReactSelectOption(
    page.locator("#react-select-role-input"),
    page.locator("data-testid=role-selected-option", {
      hasText: "Manager (who makes decisions)",
    })
  );

  // Should accept newsletter subscription
  await page.locator("#newsletterSubscription").check();

  const startButton = page.locator("button", { hasText: "Start" });
  expect(await startButton.isEnabled()).toBeTruthy();

  // Should submit the onboarding form
  await Promise.all([page.waitForNavigation(), startButton.click()]);

  expect(page.url()).toBe(`${env("NEXT_PUBLIC_CONSOLE_BASE_URL")}/pipelines`);

  // Should have cookie
  // Safari have issue when setting up cookies.
  if (browserName !== "webkit") {
    const cookies = await context.cookies();
    const instillCookies = cookies.find(
      (e) => e.name === env("NEXT_PUBLIC_INSTILL_AI_USER_COOKIE_NAME")
    );
    expect(instillCookies).toBeDefined();
  }
};
