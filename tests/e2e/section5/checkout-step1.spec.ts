import { test, expect } from '../../../src/fixtures/playground.fixture';

test.describe('Checkout - Step 1: Products', () => {
  test(
    'starts with an empty cart on page load',
    { tag: ['@ci', '@regression', '@ui', '@feature:checkout'] },
    async ({ checkoutCard }) => {
      await test.step('Verify the cart count is 0', async () => {
        await expect(checkoutCard.cartCount).toBeVisible();
        await expect(checkoutCard.cartCount).toHaveText('0');
      });

      await test.step('Verify the cart total is £0.00 and the cart is reported empty', async () => {
        await expect(checkoutCard.cartTotal).toBeVisible();
        await expect(checkoutCard.cartTotal).toHaveText('£0.00');
        await expect(checkoutCard.cartItems).toBeVisible();
        await expect(checkoutCard.cartItems).toHaveText('Cart is empty');
      });
    },
  );

  test(
    'increments the cart count when a product is added',
    { tag: ['@ci', '@smoke', '@ui', '@feature:checkout'] },
    async ({ checkoutCard }) => {
      await test.step('Add one Wireless Headphones and verify the count is 1', async () => {
        await checkoutCard.addProduct(1);
        await expect(checkoutCard.cartCount).toHaveText('1');
      });

      await test.step('Add one USB-C Hub and verify the count is 2', async () => {
        await checkoutCard.addProduct(2);
        await expect(checkoutCard.cartCount).toHaveText('2');
      });

      await test.step('Add three Laptop Stands and verify the count is 5', async () => {
        await checkoutCard.addProduct(4, 3);
        await expect(checkoutCard.cartCount).toHaveText('5');
      });
    },
  );

  test(
    'updates the cart total when items are added',
    { tag: ['@ci', '@regression', '@ui', '@feature:checkout'] },
    async ({ checkoutCard }) => {
      await test.step('Add Wireless Headphones and verify the total is £89.99', async () => {
        await checkoutCard.addProduct(1);
        await expect(checkoutCard.cartTotal).toHaveText('£89.99');
      });

      await test.step('Add USB-C Hub and verify the total is £124.98', async () => {
        await checkoutCard.addProduct(2);
        await expect(checkoutCard.cartTotal).toHaveText('£124.98');
      });

      await test.step('Add a further 2 Wireless Headphones and verify the total is £304.96', async () => {
        await checkoutCard.addProduct(1, 2);
        await expect(checkoutCard.cartTotal).toHaveText('£304.96');
      });
    },
  );

  test(
    'blocks proceeding to step 2 and shows an error when the cart is empty',
    { tag: ['@ci', '@regression', '@ui', '@feature:checkout'] },
    async ({ checkoutCard }) => {
      await test.step('Click "Proceed to Delivery" with an empty cart', async () => {
        await checkoutCard.clickProceed();
      });

      await test.step('Verify the empty-cart error is shown', async () => {
        await expect(checkoutCard.emptyCartError).toBeVisible();
        await expect(checkoutCard.emptyCartError).toHaveText('Add at least one item to continue.');
      });

      await test.step('Verify the user stays on step 1', async () => {
        await expect(checkoutCard.step1).toBeVisible();
        await expect(checkoutCard.step2).toBeHidden();
      });
    },
  );

  test(
    'moves to step 2 when the cart has items',
    { tag: ['@ci', '@smoke', '@ui', '@feature:checkout'] },
    async ({ checkoutCard }) => {
      await test.step('Add a product to the cart', async () => {
        await checkoutCard.addProduct(3);
        await expect(checkoutCard.cartCount).toHaveText('1');
      });

      await test.step('Click "Proceed to Delivery"', async () => {
        await checkoutCard.clickProceed();
      });

      await test.step('Verify step 2 is displayed and step 1 is hidden', async () => {
        await expect(checkoutCard.step2).toBeVisible();
        await expect(checkoutCard.step1).toBeHidden();
        await expect(checkoutCard.emptyCartError).toBeHidden();
      });
    },
  );
});
