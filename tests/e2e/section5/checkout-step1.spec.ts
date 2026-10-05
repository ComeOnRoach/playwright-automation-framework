import { test, expect } from '../../../src/fixtures';
import { formatGBP } from '../../../src/helpers/currency.helper';
import products from '../../../test-data/products.json';

const { headphones, usbHub, keyboard, laptopStand } = products;

test.describe(
  'Checkout - Step 1: Products',
  { tag: ['@ui', '@feature:checkout'] },
  () => {
    test(
      'starts with an empty cart on page load',
      { tag: ['@regression'] },
      async ({ checkoutCard }) => {
        await expect(checkoutCard.cartCount).toBeVisible();
        await expect(checkoutCard.cartCount).toHaveText('0');
        await expect(checkoutCard.cartTotal).toBeVisible();
        await expect(checkoutCard.cartTotal).toHaveText(formatGBP(0));
        await expect(checkoutCard.cartItems).toBeVisible();
        await expect(checkoutCard.cartItems).toHaveText('Cart is empty');
      },
    );

    test(
      'increments the cart count when a product is added',
      { tag: ['@smoke'] },
      async ({ checkoutCard }) => {
        await checkoutCard.addProduct(headphones.id);
        await expect(checkoutCard.cartCount).toHaveText('1');

        await checkoutCard.addProduct(usbHub.id);
        await expect(checkoutCard.cartCount).toHaveText('2');

        await checkoutCard.addProduct(laptopStand.id, 3);
        await expect(checkoutCard.cartCount).toHaveText('5');
      },
    );

    test(
      'updates the cart total when items are added',
      { tag: ['@regression'] },
      async ({ checkoutCard }) => {
        await checkoutCard.addProduct(headphones.id);
        await expect(checkoutCard.cartTotal).toHaveText(formatGBP(headphones.price));

        await checkoutCard.addProduct(usbHub.id);
        await expect(checkoutCard.cartTotal).toHaveText(
          formatGBP(headphones.price + usbHub.price),
        );

        await checkoutCard.addProduct(headphones.id, 2);
        await expect(checkoutCard.cartTotal).toHaveText(
          formatGBP(3 * headphones.price + usbHub.price),
        );
      },
    );

    test(
      'blocks proceeding to step 2 and shows an error when the cart is empty',
      { tag: ['@regression'] },
      async ({ checkoutCard }) => {
        await checkoutCard.clickProceed();

        await expect(checkoutCard.emptyCartError).toBeVisible();
        await expect(checkoutCard.emptyCartError).toHaveText('Add at least one item to continue.');
        await expect(checkoutCard.step1).toBeVisible();
        await expect(checkoutCard.step2).toBeHidden();
        await expect(checkoutCard.cartCount).toHaveText('0');
      },
    );

    test(
      'moves to step 2 when the cart has items',
      { tag: ['@smoke'] },
      async ({ checkoutCard }) => {
        await checkoutCard.addProduct(keyboard.id);
        await expect(checkoutCard.cartCount).toHaveText('1');

        await checkoutCard.clickProceed();

        await expect(checkoutCard.step2).toBeVisible();
        await expect(checkoutCard.step1).toBeHidden();
        await expect(checkoutCard.emptyCartError).toBeHidden();
      },
    );
  },
);
