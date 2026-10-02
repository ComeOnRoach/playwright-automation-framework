import { test } from '../../../src/fixtures/playground.fixture';

test.describe('Lazy-Rendered Element', () => {
  test('Clicking the reveal button makes the lazy element visible', async ({ lazyRenderedCard }) => {
    await test.step('Click on the reveal button', async () => {
      await lazyRenderedCard.reveal();
    });

    await test.step('Verify the lazy element is visible', async () => {
      await lazyRenderedCard.assertLazyElementVisible();
    });
  });
});
