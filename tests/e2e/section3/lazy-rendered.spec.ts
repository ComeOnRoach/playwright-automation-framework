import { test, expect } from '../../../src/fixtures';

test.describe('Lazy-Rendered Element', { tag: '@smoke' }, () => {
  test('Clicking the reveal button makes the lazy element visible', async ({ lazyRenderedCard }) => {
    await test.step('Click on the reveal button', async () => {
      await lazyRenderedCard.reveal();
    });

    await test.step('Verify the lazy element is visible', async () => {
      // Text contains a randomised selector value, so assert visibility only.
      await expect(lazyRenderedCard.lazyElement).toBeVisible({ timeout: 30000 });
    });
  });
});
