// src/pages/AIPlaygroundPage/checkout.page.ts
import { Page, Locator } from '@playwright/test';

export class CheckoutCard {
  private readonly page: Page;
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

  quantityInput(id: number): Locator {
    return this.page.locator(`#qty-${id}`);
  }

  addToCartButton(id: number): Locator {
    return this.page.locator(`#add-to-cart-${id}`);
  }

  async addProduct(id: number, quantity = 1): Promise<void> {
    if (quantity !== 1) {
      await this.quantityInput(id).fill(String(quantity));
    }
    await this.addToCartButton(id).click();
  }

  async clickProceed(): Promise<void> {
    await this.proceedButton.click();
  }
}
