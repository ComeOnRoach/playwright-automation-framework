import { test } from '../../../src/fixtures/playground.fixture';

test.describe('Flaky Loader', () => {
  test('Content loads and the toast is shown after clicking the delayed button', async ({ flakyLoaderCard }) => {
    await test.step('Click on "Load Content" button', async () => {
      await flakyLoaderCard.loadContent();
    });

    await test.step('Verify "Loading..." is displayed and the loader spinner is spinning', async () => {
      await flakyLoaderCard.assertLoadingIndicatorVisible();
      await flakyLoaderCard.assertSpinnerIsSpinning();
    });

    await test.step('Wait for "Click Me Now" button to be displayed (content appears 3-8s after loading starts)', async () => {
      await flakyLoaderCard.waitForClickMeNowButton();
    });

    await test.step('Click on "Click Me Now" button', async () => {
      await flakyLoaderCard.clickMeNow();
    });

    await test.step('Verify "Flaky button clicked!" toast and "Content loaded successfully!" message', async () => {
      await flakyLoaderCard.assertToastVisible();
      await flakyLoaderCard.assertContentLoaded();
    });
  });
});
