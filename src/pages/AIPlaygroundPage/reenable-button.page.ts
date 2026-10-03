// src/pages/AIPlaygroundPage/reenable-button.page.ts
import { Page, Locator } from '@playwright/test';

export class ReenableButtonCard {
  private readonly page: Page;
  readonly reenableButton: Locator;
  readonly reenableStatus: Locator;

  constructor(page: Page) {
    this.page = page;
    this.reenableButton = page.locator('#reenable-btn');
    this.reenableStatus = page.locator('#reenable-status');
  }

  async clickButton() {
    await this.reenableButton.click();
  }
}
