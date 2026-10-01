// pages/components/DynamicLoginCard.ts
import { Page, Locator, expect } from '@playwright/test';

export class DynamicLoginCard {
  readonly page: Page;
  readonly card: Locator;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;
  readonly successMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    // The card's inner form elements get random classes on every page load,
    // so locators here rely only on data-testid, stable ids, placeholders and roles.
    this.card = page.getByTestId('dynamic-login-card');
    this.usernameInput = this.card.getByPlaceholder('Username');
    this.passwordInput = this.card.getByPlaceholder('Password');
    this.loginButton = this.card.getByRole('button', { name: 'Login' });
    this.errorMessage = page.locator('#dynamic-error');
    this.successMessage = page.locator('#dynamic-success');
  }

  async login(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async assertLoginSuccessful() {
    await expect(this.successMessage).toBeVisible();
    await expect(this.successMessage).toHaveText('Login successful');
    await expect(this.errorMessage).toBeHidden();
  }

  async assertLoginFailed() {
    await expect(this.errorMessage).toBeVisible();
    await expect(this.errorMessage).toHaveText('Invalid credentials');
    await expect(this.successMessage).toBeHidden();
  }
}
