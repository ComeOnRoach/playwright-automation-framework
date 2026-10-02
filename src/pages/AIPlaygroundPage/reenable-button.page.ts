// pages/reenable-button.page.ts
import { Page, Locator, expect } from '@playwright/test';

export class ReenableButtonCard {
  readonly page: Page;
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

  async assertButtonDisabled() {
    await expect(this.reenableButton).toBeVisible();
    await expect(this.reenableButton).toBeDisabled();
  }

  async assertButtonEnabled() {
    // The button is re-enabled ~3s after the click; the assertion retries until then.
    await expect(this.reenableButton).toBeEnabled({ timeout: 10000 });
  }

  async assertStatusReady() {
    await expect(this.reenableStatus).toBeVisible();
    await expect(this.reenableStatus).toHaveText('Ready', { timeout: 10000 });
  }
}
