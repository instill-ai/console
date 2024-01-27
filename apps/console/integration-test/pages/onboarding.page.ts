import { Locator, Page, expect } from "@playwright/test";

export class OnboardingPage {
  readonly page: Page;
  readonly emailField: Locator;
  readonly companyField: Locator;
  readonly roleField: Locator;
  readonly roleOption: Locator;
  readonly submitButton: Locator;

  readonly onboardingPagePath = "/onboarding";
  readonly testEmail = "hello@instill.tech";
  readonly testCompany = "Instill AI";
  readonly testRole = "Product & Design";
  readonly pipelinePagePath = "/admin/pipelines";

  constructor(page: Page) {
    this.page = page;
    this.emailField = page.locator("input#email");
    this.companyField = page.locator("input#org-name");
    this.roleField = page.locator("button#role");
    this.roleOption = page.getByRole("option", { name: this.testRole });
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
    await this.companyField.fill(this.testCompany);
    expect(this.companyField).toHaveValue(this.testCompany);
    await this.roleField.click();
    await this.roleOption.click();
    expect(this.roleField).toHaveText(this.testRole);
  }

  async submitForm() {
    await this.submitButton.click();
  }
}
