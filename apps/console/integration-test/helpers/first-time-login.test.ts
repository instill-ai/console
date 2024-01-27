import { test } from "@playwright/test";
import { LoginPage } from "../pages/login.page";
import { OnboardingPage } from "../pages/onboarding.page";
import { PipelinesPage } from "../pages/pipelines.page";

test("should log in for the first time", async ({ page }) => {
  const loginPage = new LoginPage(page);
  const onboardingPage = new OnboardingPage(page);
  const pipelinesPage = new PipelinesPage(page);

  await loginPage.goto();

  // Submit with default password
  await Promise.all([
    loginPage.expectOnChangePasswordView(),
    loginPage.loginWithDefaultPassword(),
  ]);

  // Change password
  await Promise.all([onboardingPage.expectOnIt(), loginPage.changePassword()]);

  // Fill in onboarding form
  await onboardingPage.goto();
  await onboardingPage.fillInOnboardingForm();
  await Promise.all([pipelinesPage.expectOnIt(), onboardingPage.submitForm()]);

  await page
    .context()
    .storageState({ path: "integration-test/.auth/user.json" });
});
