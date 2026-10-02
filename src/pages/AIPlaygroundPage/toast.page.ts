// pages/toast.page.ts
import { Page, Locator, expect } from '@playwright/test';
import { ToastComponent } from '../../helpers/toast.helper';

export class ToastCard {
  readonly page: Page;
  readonly triggerButton: Locator;
  readonly toast: ToastComponent;

  constructor(page: Page) {
    this.page = page;
    this.triggerButton = page.locator('#show-toast');
    this.toast = new ToastComponent(page);
  }

  async triggerToast() {
    await this.triggerButton.click();
  }

  async assertToastShown() {
    await this.toast.assertVisibleWithText('Action completed');
  }

  async assertToastGone() {
    // The toast stays in the DOM and only loses the 'show' class (CSS opacity fade),
    // so toBeHidden() would not catch it; assert the class is removed instead.
    await expect(this.toast.toast).not.toHaveClass(/show/, { timeout: 10000 });
  }
}
