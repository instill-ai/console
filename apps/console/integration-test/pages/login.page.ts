import { Locator, Page } from "@playwright/test";

export class LoginPage {
  readonly page: Page;
  readonly passwordField: Locator;
  readonly submitButton: Locator;
  readonly changePasswordHeader: Locator;
  readonly loginHeader: Locator;
  readonly newPasswordField: Locator;
  readonly loginPagePath = "/login";
  readonly defaultPassword = "password";
  readonly testPassword = "testpassword";

  constructor(page: Page) {
    this.page = page;
    this.passwordField = page.locator('input[name="password"]');
    this.submitButton = page.getByRole("button", { name: "Continue" });
    this.changePasswordHeader = page.getByRole("heading", {
      name: "Change password",
    });
    this.loginHeader = page.getByRole("heading", { name: "Login" });
    this.newPasswordField = page.locator('input[name="new_password"]');
  }

  async goto() {
    await this.page.goto(this.loginPagePath);
  }

  async expectOnIt() {
    await this.page.waitForURL(this.loginPagePath);
  }

  async loginWithDefaultPassword() {
    await this.passwordField.fill(this.defaultPassword);
    await this.submitButton.click();
  }

  async changePassword() {
    await this.newPasswordField.fill(this.testPassword);
    await this.submitButton.click();
  }

  async loginWithTestPassword() {
    await this.passwordField.fill(this.testPassword);
    await this.submitButton.click();
  }

  async expectOnChangePasswordView() {
    await this.changePasswordHeader.waitFor({ state: "visible" });
  }

  async expectOnLoginView() {
    await this.loginHeader.waitFor({ state: "visible" });
  }
}
