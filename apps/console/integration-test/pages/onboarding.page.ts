import { expect, Locator, Page } from "@playwright/test";

export class OnboardingPage {
  readonly page: Page;
  readonly emailField: Locator;
  readonly displayNameField: Locator;
  readonly companyNameField: Locator;
  readonly roleField: Locator;
  readonly roleOption: Locator;
  readonly submitButton: Locator;

  readonly onboardingPagePath = "/onboarding";
  readonly testEmail = "hello@instill.tech";
  readonly testDisplayName = "Instill AI";
  readonly testCompany = "Instill AI";
  readonly testRole = "Customer Service";
  readonly pipelinePagePath = "/admin/pipelines";

  constructor(page: Page) {
    this.page = page;
    this.emailField = page.locator('input[name="email"]');
    this.displayNameField = page.locator('input[name="displayName"]');
    this.companyNameField = page.locator('input[name="companyName"]');
    this.roleField = page.getByTestId("onboarding-form-role-field");
    this.roleOption = page.getByLabel(this.testRole);
    this.submitButton = page.getByRole("button", { name: "Start" });
  }

  async goto() {
    await this.page.goto(this.onboardingPagePath);
  }

  async expectOnIt() {
    await this.page.waitForURL(this.onboardingPagePath);
  }

  async fillInOnboardingForm() {
    await this.emailField.fill(this.testEmail);
    expect(this.emailField).toHaveValue(this.testEmail);
    await this.displayNameField.fill(this.testDisplayName);
    expect(this.displayNameField).toHaveValue(this.testDisplayName);
    await this.companyNameField.fill(this.testCompany);
    expect(this.companyNameField).toHaveValue(this.testCompany);
    await this.roleField.click();
    await this.roleOption.click();
    expect(this.roleField).toHaveText(this.testRole);
  }

  async submitForm() {
    await this.submitButton.click();
  }
}
