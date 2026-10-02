// pages/ai-playground.page.ts
import { Page } from '@playwright/test';

export class AIPlaygroundPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async navigate() {
    await this.page.goto('');
  }
}
