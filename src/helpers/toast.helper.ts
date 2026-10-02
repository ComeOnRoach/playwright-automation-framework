// helpers/toast.helper.ts
import { Page, Locator, expect } from '@playwright/test';

export class ToastComponent {
  readonly page: Page;
  readonly toast: Locator;

  constructor(page: Page) {
    this.page = page;
    this.toast = page.locator('#toast');
  }

  async assertVisibleWithText(text: string) {
    // The toast never toggles display/visibility, only a 'show' class that drives
    // a CSS opacity transition, so toBeVisible() alone would pass even when hidden.
    await expect(this.toast).toHaveClass(/show/);
    await expect(this.toast).toHaveText(text);
  }
}
