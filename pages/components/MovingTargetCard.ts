// pages/components/MovingTargetCard.ts
import { Page, Locator, expect } from '@playwright/test';
import { ToastComponent } from './ToastComponent';

export class MovingTargetCard {
  readonly page: Page;
  readonly movingButton: Locator;
  readonly toast: ToastComponent;

  constructor(page: Page) {
    this.page = page;
    this.movingButton = page.locator('#moving-btn');
    this.toast = new ToastComponent(page);
  }

  async assertButtonVisible() {
    await expect(this.movingButton).toBeVisible();
  }

  async assertButtonHasExpectedName() {
    await expect(this.movingButton).toHaveAccessibleName('Catch Me');
  }

  async clickButton() {
    // The button repositions itself on an interval. Playwright's actionability
    // checks wait for the target to stop moving (stable bounding box across frames)
    // before dispatching the click, so a plain click is reliable without manual retries.
    await this.movingButton.click();
  }

  async assertToastVisible() {
    await this.toast.assertVisibleWithText('Got it!');
  }
}
