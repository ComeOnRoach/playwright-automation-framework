// src/pages/AIPlaygroundPage/lazy-rendered.page.ts
import { Page, Locator } from '@playwright/test';

export class LazyRenderedCard {
  private readonly page: Page;
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
}
