import { test } from '../../fixtures/fixtures';

test.describe('Moving Target', () => {
  test.beforeEach(async ({ aiPlaygroundPage }) => {
    await test.step('Navigate to site', async () => {
      await aiPlaygroundPage.navigate();
    });
  });

  test('Clicking the moving button shows the expected toast', async ({ movingTargetCard }) => {
    await test.step('Verify the moving button is visible with the expected name', async () => {
      await movingTargetCard.assertButtonVisible();
      await movingTargetCard.assertButtonHasExpectedName();
    });

    await test.step('Click on the moving button', async () => {
      await movingTargetCard.clickButton();
    });

    await test.step('Verify "Got it!" toast is displayed', async () => {
      await movingTargetCard.assertToastVisible();
    });
  });
});
