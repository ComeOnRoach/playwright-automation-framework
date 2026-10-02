// pages/lazy-rendered.page.ts
import { Page, Locator, expect } from '@playwright/test';

export class LazyRenderedCard {
  readonly page: Page;
  readonly revealButton: Locator;
  readonly lazyElement: Locator;

  constructor(page: Page) {
    this.page = page;
    this.revealButton = page.locator('#reveal-btn');
    this.lazyElement = page.locator('#lazy-element');
  }

  async reveal() {
    await this.revealButton.click();
  }

  async assertLazyElementVisible() {
    // Text contains a randomised selector value, so assert visibility only.
    await expect(this.lazyElement).toBeVisible({ timeout: 30000 });
  }
}
