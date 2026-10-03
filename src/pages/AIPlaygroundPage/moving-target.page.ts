// src/pages/AIPlaygroundPage/moving-target.page.ts
import { Page, Locator } from '@playwright/test';
import { ToastComponent } from '../../helpers/toast.helper';

export class MovingTargetCard {
  private readonly page: Page;
  readonly movingButton: Locator;
  readonly toast: ToastComponent;

  constructor(page: Page) {
    this.page = page;
    this.movingButton = page.locator('#moving-btn');
    this.toast = new ToastComponent(page);
  }

  async clickButton() {
    // The button repositions itself on an interval. Playwright's actionability
    // checks wait for the target to stop moving (stable bounding box across frames)
    // before dispatching the click, so a plain click is reliable without manual retries.
    await this.movingButton.click();
  }
}
