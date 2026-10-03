import { test, expect } from '../../../src/fixtures';

test.describe('Flaky Loader', () => {
  test('Content loads and the toast is shown after clicking the delayed button', async ({ flakyLoaderCard }) => {
    await test.step('Click on "Load Content" button', async () => {
      await flakyLoaderCard.loadContent();
    });

    await test.step('Verify "Loading..." is displayed and the loader spinner is spinning', async () => {
      await expect(flakyLoaderCard.loadingIndicator).toBeVisible();
      await expect(flakyLoaderCard.loadingIndicator).toContainText('Loading...');
      await expect(flakyLoaderCard.loadingSpinner).toBeVisible();
      await expect(flakyLoaderCard.loadingSpinner).toHaveCSS('animation-name', 'spin');
      await expect(flakyLoaderCard.loadingSpinner).toHaveCSS('animation-play-state', 'running');
    });

    await test.step('Wait for "Click Me Now" button to be displayed (content appears 3-8s after loading starts)', async () => {
      // Load delay is intentionally variable (observed 3-8s), so use a generous timeout instead of a fixed sleep.
      await expect(flakyLoaderCard.clickMeNowButton).toBeVisible({ timeout: 30000 });
    });

    await test.step('Click on "Click Me Now" button', async () => {
      await flakyLoaderCard.clickMeNow();
    });

    await test.step('Verify "Flaky button clicked!" toast and "Content loaded successfully!" message', async () => {
      // The toast never toggles display/visibility, only a 'show' class that drives
      // a CSS opacity transition, so toBeVisible() alone would pass even when hidden.
      await expect(flakyLoaderCard.toast.toast).toHaveClass(/show/);
      await expect(flakyLoaderCard.toast.toast).toHaveText('Flaky button clicked!');
      await expect(flakyLoaderCard.flakyContent).toBeVisible();
      await expect(flakyLoaderCard.contentLoadedMessage).toBeVisible();
    });
  });
});
