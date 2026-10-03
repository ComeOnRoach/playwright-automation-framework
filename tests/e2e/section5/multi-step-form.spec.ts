import { test } from '../../../src/fixtures/playground.fixture';

test.describe('Multi-Step Form', () => {
  test(
    'Completes all three steps and shows the success message',
    { tag: ['@ci', '@smoke', '@ui', '@feature:multi-step-form'] },
    async ({ multiStepFormCard }) => {
      await test.step('Enter full name "Jane Smith" and email "jane@example.com"', async () => {
        await multiStepFormCard.enterFullName('Jane Smith');
        await multiStepFormCard.enterEmail('jane@example.com');
      });

      await test.step('Click "Next" to go to step 2', async () => {
        await multiStepFormCard.clickNextStepOne();
      });

      await test.step('Select country "United Kingdom" and enter phone "+44 7700 000000"', async () => {
        await multiStepFormCard.selectCountry('United Kingdom');
        await multiStepFormCard.enterPhone('+44 7700 000000');
      });

      await test.step('Click "Next" to go to step 3', async () => {
        await multiStepFormCard.clickNextStepTwo();
      });

      await test.step('Enter optional comment and accept the terms', async () => {
        await multiStepFormCard.enterComment('Test comment');
        await multiStepFormCard.acceptTerms();
      });

      await test.step('Click "Submit"', async () => {
        await multiStepFormCard.submit();
      });

      await test.step('Verify the success message is displayed', async () => {
        await multiStepFormCard.assertSubmitted();
      });
    },
  );
});
