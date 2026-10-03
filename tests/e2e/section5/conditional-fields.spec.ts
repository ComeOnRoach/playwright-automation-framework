import { test, expect } from '../../../src/fixtures';
import data from '../../../test-data/conditional-fields.json';

test.describe('Conditional Validation', () => {
  test(
    'Reveals the verification code field and prompt after submitting a valid email',
    { tag: ['@ci', '@smoke', '@ui', '@feature:conditional-fields'] },
    async ({ conditionalFieldsCard }) => {
      await test.step('Enter a valid email and submit', async () => {
        await conditionalFieldsCard.enterEmail(data.validEmail);
        await conditionalFieldsCard.submit();
      });

      await test.step('Verify the code field and verification prompt are shown', async () => {
        await expect(conditionalFieldsCard.codeInput).toBeVisible();
        await expect(conditionalFieldsCard.result).toBeVisible();
        await expect(conditionalFieldsCard.result).toHaveText(data.messages.verificationRequired);
      });
    },
  );

  test(
    'Completes the form and shows the success message after submitting a valid 6-digit code',
    { tag: ['@ci', '@smoke', '@ui', '@feature:conditional-fields'] },
    async ({ conditionalFieldsCard }) => {
      await test.step('Enter a valid email and submit to reveal the code field', async () => {
        await conditionalFieldsCard.enterEmail(data.validEmail);
        await conditionalFieldsCard.submit();
        await expect(conditionalFieldsCard.codeInput).toBeVisible();
      });

      await test.step('Enter a valid 6-digit code and submit', async () => {
        await conditionalFieldsCard.enterCode(data.validCode);
        await conditionalFieldsCard.submit();
      });

      await test.step('Verify the success message is shown and the code field is hidden', async () => {
        await expect(conditionalFieldsCard.result).toBeVisible();
        await expect(conditionalFieldsCard.result).toHaveText(data.messages.success);
        await expect(conditionalFieldsCard.codeInput).toBeHidden();
      });
    },
  );

  test(
    'Shows an email validation error when the email is invalid',
    { tag: ['@ci', '@regression', '@ui', '@feature:conditional-fields'] },
    async ({ conditionalFieldsCard }) => {
      await test.step('Enter an invalid email and submit', async () => {
        await conditionalFieldsCard.enterEmail(data.invalidEmail);
        await conditionalFieldsCard.submit();
      });

      await test.step('Verify the email error is shown and the code field stays hidden', async () => {
        await expect(conditionalFieldsCard.emailError).toBeVisible();
        await expect(conditionalFieldsCard.emailError).toHaveText(data.messages.emailError);
        await expect(conditionalFieldsCard.codeInput).toBeHidden();
      });
    },
  );

  test(
    'Shows a code validation error when the code is not 6 digits',
    { tag: ['@ci', '@regression', '@ui', '@feature:conditional-fields'] },
    async ({ conditionalFieldsCard }) => {
      await test.step('Enter a valid email and submit to reveal the code field', async () => {
        await conditionalFieldsCard.enterEmail(data.validEmail);
        await conditionalFieldsCard.submit();
        await expect(conditionalFieldsCard.codeInput).toBeVisible();
      });

      await test.step('Enter a code that is not 6 digits and submit', async () => {
        await conditionalFieldsCard.enterCode(data.invalidCode);
        await conditionalFieldsCard.submit();
      });

      await test.step('Verify the code error is shown and the form is not submitted', async () => {
        await expect(conditionalFieldsCard.codeError).toBeVisible();
        await expect(conditionalFieldsCard.codeError).toHaveText(data.messages.codeError);
        await expect(conditionalFieldsCard.result).not.toHaveText(data.messages.success);
      });
    },
  );
});
