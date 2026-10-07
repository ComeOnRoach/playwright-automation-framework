import { test, expect } from '../../../src/fixtures';
import { validGuest } from '../../../src/fixtures/booking.fixture';
import bookingData from '../../../test-data/booking.json';

const { negative, step3 } = bookingData;
const { errors } = negative;

const regression = ['@regression', '@ui', '@feature:restaurant-booking'];

test.describe('Restaurant booking: step 3 your details', () => {
  test.describe('invalid input', () => {
    for (const name of negative.invalidNames) {
      test(`shows name error for "${name}"`, { tag: regression }, async ({ bookingFlow, bookingPage }) => {
        await test.step('reach the details step', async () => {
          await bookingFlow.reachDetailsStep();
        });

        await test.step('enter the invalid name and press Next', async () => {
          await bookingPage.fillDetails({ ...validGuest, name });
          await bookingPage.goToReviewStep();
        });

        await test.step('name error is shown and the flow stays on step 3', async () => {
          await expect(bookingPage.nameError).toBeVisible();
          await expect(bookingPage.nameError).toHaveText(errors.name);
          await expect(bookingPage.reviewParty).toBeHidden();
        });
      });
    }

    for (const email of negative.invalidEmails) {
      test(`shows email error for "${email}"`, { tag: regression }, async ({ bookingFlow, bookingPage }) => {
        await test.step('reach the details step', async () => {
          await bookingFlow.reachDetailsStep();
        });

        await test.step('enter the invalid email and press Next', async () => {
          await bookingPage.fillDetails({ ...validGuest, email });
          await bookingPage.goToReviewStep();
        });

        await test.step('email error is shown and the flow stays on step 3', async () => {
          await expect(bookingPage.emailError).toBeVisible();
          await expect(bookingPage.emailError).toHaveText(errors.email);
          await expect(bookingPage.reviewParty).toBeHidden();
        });
      });
    }

    for (const phone of negative.invalidPhones) {
      test(`shows phone error for "${phone}"`, { tag: regression }, async ({ bookingFlow, bookingPage }) => {
        await test.step('reach the details step', async () => {
          await bookingFlow.reachDetailsStep();
        });

        await test.step('enter the invalid phone and press Next', async () => {
          await bookingPage.fillDetails({ ...validGuest, phone });
          await bookingPage.goToReviewStep();
        });

        await test.step('phone error is shown and the flow stays on step 3', async () => {
          await expect(bookingPage.phoneError).toBeVisible();
          await expect(bookingPage.phoneError).toHaveText(errors.phone);
          await expect(bookingPage.reviewParty).toBeHidden();
        });
      });
    }

    test('shows all three errors together when every field is invalid', { tag: regression }, async ({ bookingFlow, bookingPage }) => {
      await test.step('reach the details step', async () => {
        await bookingFlow.reachDetailsStep();
      });

      await test.step('press Next with empty fields', async () => {
        await bookingPage.goToReviewStep();
      });

      await test.step('every field shows its error and the flow stays on step 3', async () => {
        await expect(bookingPage.nameError).toHaveText(errors.name);
        await expect(bookingPage.emailError).toHaveText(errors.email);
        await expect(bookingPage.phoneError).toHaveText(errors.phone);
        await expect(bookingPage.reviewParty).toBeHidden();
      });
    });

    test('shows the name error when the name field loses focus empty', { tag: regression }, async ({ bookingFlow, bookingPage }) => {
      await test.step('reach the details step', async () => {
        await bookingFlow.reachDetailsStep();
      });

      await test.step('focus the name field and leave it empty', async () => {
        await bookingPage.nameInput.focus();
        await bookingPage.nameInput.blur();
      });

      await test.step('the name error appears without pressing Next', async () => {
        await expect(bookingPage.nameError).toHaveText(errors.name);
      });
    });

    test('clears an error once the field is corrected', { tag: regression }, async ({ bookingFlow, bookingPage }) => {
      await test.step('reach the details step and trigger the email error', async () => {
        await bookingFlow.reachDetailsStep();
        await bookingPage.fillDetails({ ...validGuest, email: negative.invalidEmails[1] });
        await bookingPage.goToReviewStep();
        await expect(bookingPage.emailError).toBeVisible();
      });

      await test.step('correct the email and leave the field', async () => {
        await bookingPage.emailInput.fill(validGuest.email);
        await bookingPage.emailInput.blur();
      });

      await test.step('the error is gone', async () => {
        await expect(bookingPage.emailError).toBeHidden();
      });
    });
  });

  test.describe('valid input', () => {
    for (const row of step3.validPhones) {
      test(`accepts a phone with ${row.title}`, { tag: regression }, async ({ bookingFlow, bookingPage }) => {
        await test.step('reach the details step', async () => {
          await bookingFlow.reachDetailsStep();
        });

        await test.step('enter the phone and press Next', async () => {
          await bookingPage.fillDetails({ ...validGuest, phone: row.input });
          await bookingPage.goToReviewStep();
        });

        await test.step('review opens with the normalised phone', async () => {
          await expect(bookingPage.phoneError).toBeHidden();
          await expect(bookingPage.reviewPhone).toHaveText(row.expected);
        });
      });
    }

    for (const row of step3.validNames) {
      test(`accepts a name with ${row.title}`, { tag: regression }, async ({ bookingFlow, bookingPage }) => {
        await test.step('reach the details step', async () => {
          await bookingFlow.reachDetailsStep();
        });

        await test.step('enter the name and press Next', async () => {
          await bookingPage.fillDetails({ ...validGuest, name: row.input });
          await bookingPage.goToReviewStep();
        });

        await test.step('review opens with the trimmed name', async () => {
          await expect(bookingPage.nameError).toBeHidden();
          await expect(bookingPage.reviewName).toHaveText(row.expected);
        });
      });
    }

    // The app regex is permissive (see step3.validEmailNote in test-data/booking.json).
    test('accepts the minimal email the permissive pattern allows', { tag: regression }, async ({ bookingFlow, bookingPage }) => {
      await test.step('reach the details step', async () => {
        await bookingFlow.reachDetailsStep();
      });

      await test.step('enter the minimal email and press Next', async () => {
        await bookingPage.fillDetails({ ...validGuest, email: step3.permissiveEmail });
        await bookingPage.goToReviewStep();
      });

      await test.step('review opens with that email', async () => {
        await expect(bookingPage.emailError).toBeHidden();
        await expect(bookingPage.reviewEmail).toHaveText(step3.permissiveEmail);
      });
    });
  });

  test.describe('navigation', () => {
    test('keeps the entered values after going back and returning', { tag: regression }, async ({ bookingFlow, bookingPage }) => {
      await test.step('reach the details step and fill every field', async () => {
        await bookingFlow.reachDetailsStep();
        await bookingPage.fillDetails(validGuest);
      });

      await test.step('go back to step 2 and forward again', async () => {
        await bookingPage.goBackFromDetailsStep();
        await bookingPage.goToDetailsStep();
      });

      await test.step('the fields still hold the values', async () => {
        await expect(bookingPage.nameInput).toHaveValue(validGuest.name);
        await expect(bookingPage.emailInput).toHaveValue(validGuest.email);
        await expect(bookingPage.phoneInput).toHaveValue(validGuest.phone);
      });
    });

    // Known app defect: assert the CORRECT behaviour and mark expected-fail.
    // When the app is fixed this reports "unexpected pass" and the marker should be removed.
    test('clears step 3 errors after going back and returning', { tag: regression }, async ({ bookingFlow, bookingPage }) => {
      test.fail(true, 'BUG TC-310: Back does not clear the step 3 error messages');

      await test.step('reach the details step and trigger the errors', async () => {
        await bookingFlow.reachDetailsStep();
        await bookingPage.goToReviewStep();
        await expect(bookingPage.nameError).toBeVisible();
      });

      await test.step('go back to step 2 and forward again', async () => {
        await bookingPage.goBackFromDetailsStep();
        await bookingPage.goToDetailsStep();
      });

      await test.step('no error message is visible', async () => {
        await expect(bookingPage.nameError).toBeHidden();
        await expect(bookingPage.emailError).toBeHidden();
        await expect(bookingPage.phoneError).toBeHidden();
      });
    });
  });
});
