import { test, expect } from '../../../src/fixtures';
import { validGuest, reservationCreatedResponse } from '../../../src/fixtures/booking.fixture';
import {
  abortReservationEndpoint,
  hangReservationEndpoint,
  mockReservationEndpoint,
  mockReservationSequence,
} from '../../../src/helpers/booking.helper';
import bookingData from '../../../test-data/booking.json';

const { happyPath, mockEndpoint, negative, step4 } = bookingData;
const { errors } = negative;

const regression = ['@regression', '@ui', '@feature:restaurant-booking'];
const smoke = ['@smoke', '@ui', '@feature:restaurant-booking'];
const smokeAndRegression = ['@smoke', '@regression', '@ui', '@feature:restaurant-booking'];

const serverError = { status: step4.retryFailureStatus, json: {} };

test.describe('Restaurant booking: step 4 review and confirm', () => {
  test.describe('review', () => {
    test('shows the name and phone trimmed of extra spaces', { tag: regression }, async ({ bookingFlow, bookingPage }) => {
      const { name, expectedName, phone, expectedPhone } = step4.normalisation;

      await test.step('reach the review step with untidy name and phone', async () => {
        await bookingFlow.reachReviewStep({ ...validGuest, name, phone });
      });

      await test.step('review shows the cleaned values', async () => {
        await expect(bookingPage.reviewName).toHaveText(expectedName);
        await expect(bookingPage.reviewPhone).toHaveText(expectedPhone);
        await expect(bookingPage.reviewEmail).toHaveText(validGuest.email);
      });
    });

    test('returns to step 3 with data kept and carries edits into the review', { tag: regression }, async ({ bookingFlow, bookingPage }) => {
      const editedName = `${validGuest.name} Jr`;

      await test.step('reach the review step', async () => {
        await bookingFlow.reachReviewStep();
      });

      await test.step('go back and check the details are kept', async () => {
        await bookingPage.goBackFromReviewStep();
        await expect(bookingPage.nameInput).toHaveValue(validGuest.name);
        await expect(bookingPage.emailInput).toHaveValue(validGuest.email);
        await expect(bookingPage.phoneInput).toHaveValue(validGuest.phone);
      });

      await test.step('edit the name and return to the review', async () => {
        await bookingPage.nameInput.fill(editedName);
        await bookingPage.goToReviewStep();
      });

      await test.step('the review shows the edited name', async () => {
        await expect(bookingPage.reviewName).toHaveText(editedName);
      });
    });
  });

  test.describe('confirm request', () => {
    test('sends the name trimmed and the phone without spaces', { tag: regression }, async ({ page, bookingFlow, bookingPage }) => {
      const { name, expectedName, phone, expectedPhone } = step4.normalisation;

      await test.step('mock the endpoint and reach the review step', async () => {
        await mockReservationEndpoint(page, mockEndpoint, reservationCreatedResponse);
        await bookingFlow.reachReviewStep({ ...validGuest, name, phone });
      });

      const request = await test.step('confirm the booking', async () => {
        const requestPromise = page.waitForRequest(mockEndpoint);
        await bookingPage.confirmBooking();
        return requestPromise;
      });

      await test.step('the payload carries the normalised values', async () => {
        expect(request.postDataJSON()).toMatchObject({ name: expectedName, phone: expectedPhone });
      });
    });

    test('sends exactly one request when Confirm is double-clicked', { tag: smoke }, async ({ page, bookingFlow, bookingPage }) => {
      const requests = await mockReservationSequence(page, mockEndpoint, [
        { response: reservationCreatedResponse, delayMs: step4.pendingDelayMs },
      ]);

      await test.step('reach the review step', async () => {
        await bookingFlow.reachReviewStep();
      });

      await test.step('double-click Confirm', async () => {
        await bookingPage.confirmButton.dblclick();
      });

      await test.step('the booking succeeds from a single request', async () => {
        await expect(bookingPage.successSection).toBeVisible();
        expect(requests).toHaveLength(1);
      });
    });

    test('disables Confirm and shows the spinner while the request is pending', { tag: regression }, async ({ page, bookingFlow, bookingPage }) => {
      await mockReservationSequence(page, mockEndpoint, [
        { response: reservationCreatedResponse, delayMs: step4.pendingDelayMs },
      ]);

      await test.step('reach the review step and confirm', async () => {
        await bookingFlow.reachReviewStep();
        await bookingPage.confirmBooking();
      });

      await test.step('the button is disabled and the loading indicator is visible', async () => {
        await expect(bookingPage.confirmButton).toBeDisabled();
        await expect(bookingPage.confirmLoading).toBeVisible();
      });

      await test.step('the success screen replaces the loading state', async () => {
        await expect(bookingPage.successSection).toBeVisible();
        await expect(bookingPage.confirmLoading).toBeHidden();
      });
    });
  });

  test.describe('server failure', () => {
    for (const status of negative.failureStatuses) {
      test(`shows error and stays on review when server returns ${status}`, {
        tag: status === step4.retryFailureStatus ? smokeAndRegression : regression,
      }, async ({ page, bookingFlow, bookingPage }) => {
        await test.step('mock the failure and reach the review step', async () => {
          await mockReservationEndpoint(page, mockEndpoint, { status, json: {} });
          await bookingFlow.reachReviewStep();
        });

        await test.step('confirm the booking', async () => {
          await bookingPage.confirmBooking();
        });

        await test.step('error is shown, loading is hidden and Confirm is usable again', async () => {
          await expect(bookingPage.confirmError).toBeVisible();
          await expect(bookingPage.confirmError).toHaveText(errors.confirm);
          await expect(bookingPage.confirmLoading).toBeHidden();
          await expect(bookingPage.successSection).toBeHidden();
          await expect(bookingPage.confirmButton).toBeEnabled();
        });

        await test.step('the review data is intact', async () => {
          await expect(bookingPage.reviewName).toHaveText(validGuest.name);
          await expect(bookingPage.reviewEmail).toHaveText(validGuest.email);
          await expect(bookingPage.reviewPhone).toHaveText(validGuest.phone);
        });
      });
    }

    test('succeeds on retry after a server error and clears the error', { tag: regression }, async ({ page, bookingFlow, bookingPage }) => {
      await test.step('mock a failure followed by a slow success and reach the review step', async () => {
        await mockReservationSequence(page, mockEndpoint, [
          { response: serverError },
          { response: reservationCreatedResponse, delayMs: step4.pendingDelayMs },
        ]);
        await bookingFlow.reachReviewStep();
      });

      await test.step('the first confirm fails', async () => {
        await bookingPage.confirmBooking();
        await expect(bookingPage.confirmError).toHaveText(errors.confirm);
      });

      await test.step('retrying clears the error while the request is pending', async () => {
        await bookingPage.confirmBooking();
        await expect(bookingPage.confirmError).toBeHidden();
        await expect(bookingPage.confirmLoading).toBeVisible();
      });

      await test.step('the retry succeeds with a reference', async () => {
        await expect(bookingPage.successSection).toBeVisible();
        await expect(bookingPage.reference).toHaveText(new RegExp(happyPath.referencePattern));
      });
    });
  });

  // Known app defects: assert the CORRECT behaviour and mark expected-fail.
  // When the app is fixed these report "unexpected pass" and the markers should be removed.
  test.describe('known app defects', () => {
    for (const status of negative.nonServerErrorStatuses) {
      test(`shows error when server returns ${status}`, { tag: regression }, async ({ page, bookingFlow, bookingPage }) => {
        test.fail(true, `BUG TC-412: ${status} is treated as a successful booking`);

        await test.step('mock the error and reach the review step', async () => {
          await mockReservationEndpoint(page, mockEndpoint, { status, json: {} });
          await bookingFlow.reachReviewStep();
        });

        await test.step('confirm the booking', async () => {
          await bookingPage.confirmBooking();
        });

        await test.step('an error is shown instead of the success screen', async () => {
          await expect(bookingPage.confirmError).toHaveText(errors.confirm);
          await expect(bookingPage.successSection).toBeHidden();
        });
      });
    }

    test('shows error when the confirm request fails at network level', { tag: regression }, async ({ page, bookingFlow, bookingPage }) => {
      test.fail(true, 'BUG TC-412: a network failure is treated as a successful booking');

      await test.step('abort the endpoint and reach the review step', async () => {
        await abortReservationEndpoint(page, mockEndpoint);
        await bookingFlow.reachReviewStep();
      });

      await test.step('confirm the booking', async () => {
        await bookingPage.confirmBooking();
      });

      await test.step('an error is shown instead of the success screen', async () => {
        await expect(bookingPage.confirmError).toHaveText(errors.confirm);
        await expect(bookingPage.successSection).toBeHidden();
      });
    });

    test('shows error when the confirm request times out', { tag: regression }, async ({ page, bookingFlow, bookingPage }) => {
      test.fail(true, 'BUG TC-413: a timed-out request is treated as a successful booking');

      await test.step('hang the endpoint, fix the clock and reach the review step', async () => {
        await hangReservationEndpoint(page, mockEndpoint);
        await page.clock.install();
        await bookingFlow.reachReviewStep();
      });

      await test.step('confirm and run the clock past the app timeout', async () => {
        await bookingPage.confirmBooking();
        await page.clock.fastForward(negative.confirmTimeoutMs);
      });

      await test.step('an error is shown instead of the success screen', async () => {
        await expect(bookingPage.confirmError).toHaveText(errors.confirm);
        await expect(bookingPage.successSection).toBeHidden();
      });
    });
  });
});
