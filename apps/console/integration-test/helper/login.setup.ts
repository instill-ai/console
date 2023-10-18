import { env } from "./index";
import { test } from "@playwright/test";

test("mock onboarded cookie", async ({ page }) => {
  await page.context().addCookies([
    {
      name: env("NEXT_PUBLIC_INSTILL_AI_USER_COOKIE_NAME") as string,
      value: JSON.stringify({
        cookie_token: "76e2c0f9-fa5c-4a4b-bf10-6db6a7373825",
      }),
      url: env("NEXT_PUBLIC_CONSOLE_BASE_URL"),
      sameSite: "Lax",
      secure: false,
      httpOnly: true,
    },
  ]);
  await page
    .context()
    .storageState({ path: "integration-test/.auth/user.json" });
});
