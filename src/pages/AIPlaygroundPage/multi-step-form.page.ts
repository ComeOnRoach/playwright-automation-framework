// src/pages/AIPlaygroundPage/multi-step-form.page.ts
import { Page, Locator } from '@playwright/test';

export class MultiStepFormCard {
  private readonly page: Page;
  readonly fullNameInput: Locator;
  readonly emailInput: Locator;
  readonly nextStepOneButton: Locator;
  readonly countrySelect: Locator;
  readonly phoneInput: Locator;
  readonly nextStepTwoButton: Locator;
  readonly commentsInput: Locator;
  readonly termsCheckbox: Locator;
  readonly submitButton: Locator;
  readonly successContainer: Locator;
  readonly successMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.fullNameInput = page.locator('#ms-name');
    this.emailInput = page.locator('#ms-email');
    this.nextStepOneButton = page.locator('#ms-next-1');
    this.countrySelect = page.locator('#ms-country');
    this.phoneInput = page.locator('#ms-phone');
    this.nextStepTwoButton = page.locator('#ms-next-2');
    this.commentsInput = page.locator('#ms-comments');
    this.termsCheckbox = page.locator('#ms-terms');
    this.submitButton = page.locator('#ms-submit');
    this.successContainer = page.locator('#step-done');
    this.successMessage = this.successContainer.getByText('Form submitted successfully.');
  }

  async enterFullName(name: string) {
    await this.fullNameInput.fill(name);
  }

  async enterEmail(email: string) {
    await this.emailInput.fill(email);
  }

  async clickNextStepOne() {
    await this.nextStepOneButton.click();
  }

  async selectCountry(country: string) {
    await this.countrySelect.selectOption({ label: country });
  }

  async enterPhone(phone: string) {
    await this.phoneInput.fill(phone);
  }

  async clickNextStepTwo() {
    await this.nextStepTwoButton.click();
  }

  async enterComment(comment: string) {
    await this.commentsInput.fill(comment);
  }

  async acceptTerms() {
    await this.termsCheckbox.check();
  }

  async submit() {
    await this.submitButton.click();
  }
}
