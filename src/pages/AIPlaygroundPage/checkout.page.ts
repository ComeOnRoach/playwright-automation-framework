// pages/AIPlaygroundPage/checkout.page.ts
import { Page, Locator } from '@playwright/test';

export class CheckoutCard {
  readonly page: Page;
  readonly step1: Locator;
  readonly step2: Locator;
  readonly cartCount: Locator;
  readonly cartItems: Locator;
  readonly cartTotal: Locator;
  readonly proceedButton: Locator;
  readonly emptyCartError: Locator;

  constructor(page: Page) {
    this.page = page;
    this.step1 = page.locator('#checkout-step-1');
    this.step2 = page.locator('#checkout-step-2');
    this.cartCount = page.locator('#cart-count');
    this.cartItems = page.locator('#cart-items');
    this.cartTotal = page.locator('#cart-total');
    this.proceedButton = page.locator('#checkout-step1-next');
    this.emptyCartError = page.locator('#cart-empty-error');
  }

  async addProduct(id: 1 | 2 | 3 | 4, quantity = 1) {
    if (quantity !== 1) {
      await this.page.locator(`#qty-${id}`).fill(String(quantity));
    }
    await this.page.locator(`#add-to-cart-${id}`).click();
  }

  async clickProceed() {
    await this.proceedButton.click();
  }
}
