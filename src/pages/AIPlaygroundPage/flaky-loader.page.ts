// src/pages/AIPlaygroundPage/flaky-loader.page.ts
import { Page, Locator } from '@playwright/test';
import { ToastComponent } from '../../helpers/toast.helper';

export class FlakyLoaderCard {
  private readonly page: Page;
  readonly loadContentButton: Locator;
  readonly flakyContent: Locator;
  readonly contentLoadedMessage: Locator;
  readonly clickMeNowButton: Locator;
  readonly toast: ToastComponent;
  readonly loadingIndicator: Locator;
  readonly loadingSpinner: Locator;

  constructor(page: Page) {
    this.page = page;
    this.loadContentButton = page.locator('#trigger-flaky');
    this.flakyContent = page.locator('#flaky-content');
    this.contentLoadedMessage = this.flakyContent.getByText('Content loaded successfully!');
    this.clickMeNowButton = page.locator('#flaky-action');
    this.toast = new ToastComponent(page);
    this.loadingIndicator = page.locator('#flaky-loading');
    this.loadingSpinner = this.loadingIndicator.locator('span');
  }

  async loadContent() {
    await this.loadContentButton.click();
  }

  async clickMeNow() {
    await this.clickMeNowButton.click();
  }
}
