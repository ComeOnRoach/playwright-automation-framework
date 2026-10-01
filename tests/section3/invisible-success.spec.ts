import { test } from '../../fixtures/fixtures';

test.describe('Invisible Success', () => {
  test.beforeEach(async ({ aiPlaygroundPage }) => {
    await test.step('Navigate to site', async () => {
      await aiPlaygroundPage.navigate();
    });
  });

  test('Submitting a valid email shows the success message', async ({ invisibleSuccessCard }) => {
    const email = 'jane.doe@example.com';

    await test.step('Fill in a valid email and submit', async () => {
      await invisibleSuccessCard.submit(email);
    });

    await test.step('Verify the success message is visible with the submitted email', async () => {
      await invisibleSuccessCard.assertSubmittedSuccessfully(email);
    });
  });

  test('Submitting an empty email shows a validation error', async ({ invisibleSuccessCard }) => {
    await test.step('Submit without entering an email', async () => {
      await invisibleSuccessCard.submit('');
    });

    await test.step('Verify "Valid email required" error is visible and no success message is shown', async () => {
      await invisibleSuccessCard.assertEmailErrorShown();
    });
  });

  test('Submitting an invalid email shows a validation error', async ({ invisibleSuccessCard }) => {
    await test.step('Fill in an invalid email and submit', async () => {
      await invisibleSuccessCard.submit('not-an-email');
    });

    await test.step('Verify "Valid email required" error is visible and no success message is shown', async () => {
      await invisibleSuccessCard.assertEmailErrorShown();
    });
  });
});
