import { test, expect } from '../../../src/fixtures';

test.describe('Invisible Success', { tag: '@smoke' }, () => {
  test('Submitting a valid email shows the success message', async ({ invisibleSuccessCard }) => {
    const email = 'jane.doe@example.com';

    await test.step('Fill in a valid email and submit', async () => {
      await invisibleSuccessCard.submit(email);
    });

    await test.step('Verify the success message is visible with the submitted email', async () => {
      // The user must actually see the confirmation, not just have it in the DOM.
      await expect(invisibleSuccessCard.result).toBeVisible({ timeout: 30000 });
      await expect(invisibleSuccessCard.result).toHaveText(
        `Form submitted successfully. Confirmation sent to ${email}.`,
      );
      await expect(invisibleSuccessCard.emailError).toBeHidden();
    });
  });

  test('Submitting an empty email shows a validation error', async ({ invisibleSuccessCard }) => {
    await test.step('Submit without entering an email', async () => {
      await invisibleSuccessCard.submit('');
    });

    await test.step('Verify "Valid email required" error is visible and no success message is shown', async () => {
      await expect(invisibleSuccessCard.emailError).toBeVisible();
      await expect(invisibleSuccessCard.emailError).toHaveText('Valid email required');
      await expect(invisibleSuccessCard.result).toBeHidden();
    });
  });

  test('Submitting an invalid email shows a validation error', async ({ invisibleSuccessCard }) => {
    await test.step('Fill in an invalid email and submit', async () => {
      await invisibleSuccessCard.submit('not-an-email');
    });

    await test.step('Verify "Valid email required" error is visible and no success message is shown', async () => {
      await expect(invisibleSuccessCard.emailError).toBeVisible();
      await expect(invisibleSuccessCard.emailError).toHaveText('Valid email required');
      await expect(invisibleSuccessCard.result).toBeHidden();
    });
  });
});
