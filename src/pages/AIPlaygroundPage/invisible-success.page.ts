// src/pages/AIPlaygroundPage/invisible-success.page.ts
import { Page, Locator } from '@playwright/test';

export class InvisibleSuccessCard {
  private readonly page: Page;
  readonly emailInput: Locator;
  readonly submitButton: Locator;
  readonly emailError: Locator;
  readonly result: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.locator('#ghost-email');
    this.submitButton = page.locator('#ghost-submit');
    this.emailError = page.locator('#ghost-email-err');
    this.result = page.locator('#ghost-result');
  }

  async submit(email: string) {
    await this.emailInput.fill(email);
    await this.submitButton.click();
  }
}
