// src/helpers/toast.helper.ts
import { Page, Locator } from '@playwright/test';

export class ToastComponent {
  private readonly page: Page;
  readonly toast: Locator;

  constructor(page: Page) {
    this.page = page;
    this.toast = page.locator('#toast');
  }
}
