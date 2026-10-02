// pages/invisible-success.page.ts
import { Page, Locator, expect } from '@playwright/test';

export class InvisibleSuccessCard {
  readonly page: Page;
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

  async assertSubmittedSuccessfully(email: string) {
    // The user must actually see the confirmation, not just have it in the DOM.
    await expect(this.result).toBeVisible({timeout: 30000});
    await expect(this.result).toHaveText(`Form submitted successfully. Confirmation sent to ${email}.`);
    await expect(this.emailError).toBeHidden();
  }

  async assertEmailErrorShown() {
    await expect(this.emailError).toBeVisible();
    await expect(this.emailError).toHaveText('Valid email required');
    await expect(this.result).toBeHidden();
  }
}
