// src/pages/AIPlaygroundPage/local-storage-session.page.ts
import { Page, Locator } from '@playwright/test';

export class LocalStorageSessionCard {
  private readonly page: Page;
  readonly form: Locator;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly error: Locator;
  readonly welcome: Locator;
  readonly logoutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.form = page.locator('#ls-form');
    this.usernameInput = page.locator('#ls-username');
    this.passwordInput = page.locator('#ls-password');
    this.submitButton = page.locator('#ls-submit');
    this.error = page.locator('#ls-error');
    this.welcome = page.locator('#ls-welcome');
    this.logoutButton = page.locator('#ls-logout');
  }

  async login(username: string, password: string): Promise<void> {
    await this.form.scrollIntoViewIfNeeded();
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }

  async logout(): Promise<void> {
    await this.logoutButton.scrollIntoViewIfNeeded();
    await this.logoutButton.click();
  }
}
