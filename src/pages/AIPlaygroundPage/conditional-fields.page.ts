// src/pages/AIPlaygroundPage/conditional-fields.page.ts
import { Page, Locator } from '@playwright/test';

export class ConditionalFieldsCard {
  private readonly page: Page;
  readonly emailInput: Locator;
  readonly emailError: Locator;
  readonly codeWrapper: Locator;
  readonly codeInput: Locator;
  readonly codeError: Locator;
  readonly submitButton: Locator;
  readonly result: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.locator('#cond-email');
    this.emailError = page.locator('#cond-email-err');
    this.codeWrapper = page.locator('#cond-extra-wrap');
    this.codeInput = page.locator('#cond-code');
    this.codeError = page.locator('#cond-code-err');
    this.submitButton = page.locator('#cond-submit');
    this.result = page.locator('#cond-result');
  }

  async enterEmail(email: string) {
    await this.emailInput.fill(email);
  }

  async enterCode(code: string) {
    await this.codeInput.fill(code);
  }

  async submit() {
    await this.submitButton.click();
  }
}
