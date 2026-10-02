// pages/flaky-loader.page.ts
import { Page, Locator, expect } from '@playwright/test';
import { ToastComponent } from '../../helpers/toast.helper';

export class FlakyLoaderCard {
  readonly page: Page;
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

  async assertLoadingIndicatorVisible() {
    await expect(this.loadingIndicator).toBeVisible();
    await expect(this.loadingIndicator).toContainText('Loading...');
  }

  async assertSpinnerIsSpinning() {
    await expect(this.loadingSpinner).toBeVisible();
    const { animationName, animationPlayState } = await this.loadingSpinner.evaluate((el) => {
      const style = getComputedStyle(el);
      return { animationName: style.animationName, animationPlayState: style.animationPlayState };
    });
    expect(animationName).toBe('spin');
    expect(animationPlayState).toBe('running');
  }

  async waitForClickMeNowButton() {
    // Load delay is intentionally variable (observed 3-8s), so use a generous timeout instead of a fixed sleep.
    await expect(this.clickMeNowButton).toBeVisible({ timeout: 30000 });
  }

  async clickMeNow() {
    await this.clickMeNowButton.click();
  }

  async assertContentLoaded() {
    await expect(this.flakyContent).toBeVisible();
    await expect(this.contentLoadedMessage).toBeVisible();
  }

  async assertToastVisible() {
    await this.toast.assertVisibleWithText('Flaky button clicked!');
  }
}
