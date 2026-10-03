import { test, expect } from '../../../src/fixtures';

test.describe('Moving Target', () => {
  test('Clicking the moving button shows the expected toast', async ({ movingTargetCard }) => {
    await test.step('Verify the moving button is visible with the expected name', async () => {
      await expect(movingTargetCard.movingButton).toBeVisible();
      await expect(movingTargetCard.movingButton).toHaveAccessibleName('Catch Me');
    });

    await test.step('Click on the moving button', async () => {
      await movingTargetCard.clickButton();
    });

    await test.step('Verify "Got it!" toast is displayed', async () => {
      // The toast never toggles display/visibility, only a 'show' class that drives
      // a CSS opacity transition, so toBeVisible() alone would pass even when hidden.
      await expect(movingTargetCard.toast.toast).toHaveClass(/show/);
      await expect(movingTargetCard.toast.toast).toHaveText('Got it!');
    });
  });
});
