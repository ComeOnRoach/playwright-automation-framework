// src/pages/AIPlaygroundPage/toast.page.ts
import { Page, Locator } from '@playwright/test';
import { ToastComponent } from '../../helpers/toast.helper';

export class ToastCard {
  private readonly page: Page;
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
}
