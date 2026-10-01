import { test } from '../../fixtures/fixtures';

test('Flaky Content', async ({ aiPlaygroundPage, flakyLoaderCard }) => {
  await test.step('Navigate to site', async () => {
    await aiPlaygroundPage.navigate();
  });

  await test.step('Click on "Load Content" button', async () => {
    await flakyLoaderCard.loadContent();
  });

  await test.step('Verify "Loading..." is displayed and the loader spinner is spinning', async () => {
    await flakyLoaderCard.assertLoadingIndicatorVisible();
    await flakyLoaderCard.assertSpinnerIsSpinning();
  });

  await test.step('Wait for "Click Me Now" button to be displayed', async () => {
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
