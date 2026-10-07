import { test, expect } from '../../../src/fixtures';
import { reservationCreatedResponse } from '../../../src/fixtures/booking.fixture';
import { mockReservationEndpoint } from '../../../src/helpers/booking.helper';
import bookingData from '../../../test-data/booking.json';

const { happyPath, mockEndpoint, step1 } = bookingData;

const regression = ['@regression', '@ui', '@feature:restaurant-booking'];
const smoke = ['@smoke', '@ui', '@feature:restaurant-booking'];

test.describe('Restaurant booking: after a reservation', () => {
  test('resets the whole flow when making another reservation', { tag: smoke }, async ({ page, bookingFlow, bookingPage }) => {
    await test.step('complete a booking', async () => {
      await mockReservationEndpoint(page, mockEndpoint, reservationCreatedResponse);
      await bookingFlow.reachReviewStep();
      await bookingPage.confirmBooking();
      await expect(bookingPage.successSection).toBeVisible();
    });

    await test.step('press Make Another Reservation', async () => {
      await bookingPage.makeAnotherReservation();
    });

    await test.step('the first screen is empty again', async () => {
      await expect(bookingPage.partySize).toHaveValue('');
      await expect(bookingPage.depositAmount).toHaveText(step1.emptyDeposit);
      for (const type of ['standard', 'group', 'private'] as const) {
        await expect(bookingPage.typeCard(type)).not.toHaveClass(/selected/);
      }
      await expect(bookingPage.step1Error).toBeHidden();
      await expect(bookingPage.partyError).toBeHidden();
      await expect(bookingPage.successSection).toBeHidden();
    });

    await test.step('the later steps hold no earlier input', async () => {
      await expect(bookingPage.dateInput).toHaveValue('');
      await expect(bookingPage.nameInput).toHaveValue('');
      await expect(bookingPage.emailInput).toHaveValue('');
      await expect(bookingPage.phoneInput).toHaveValue('');
    });

    await test.step('the date step has no selected day or slot and every slot is disabled', async () => {
      await bookingFlow.reachDateStep();
      await expect(bookingPage.selectedDay).toHaveCount(0);
      await expect(bookingPage.selectedSlot).toHaveCount(0);
      await expect(bookingPage.enabledSlots).toHaveCount(0);
    });
  });

  test('completes a second booking with a new reference', { tag: regression }, async ({ page, bookingFlow, bookingPage }) => {
    await mockReservationEndpoint(page, mockEndpoint, reservationCreatedResponse);

    await test.step('complete the first booking', async () => {
      await bookingFlow.reachReviewStep();
      await bookingPage.confirmBooking();
      await expect(bookingPage.reference).toHaveText(new RegExp(happyPath.referencePattern));
    });

    const firstReference = (await bookingPage.reference.textContent()) ?? '';

    await test.step('restart and complete a second booking', async () => {
      await bookingPage.makeAnotherReservation();
      await bookingFlow.reachReviewStep();
      await bookingPage.confirmBooking();
    });

    await test.step('the second reservation is confirmed with a different reference', async () => {
      await expect(bookingPage.successSection).toBeVisible();
      await expect(bookingPage.reference).toHaveText(new RegExp(happyPath.referencePattern));
      await expect(bookingPage.reference).not.toHaveText(firstReference);
    });
  });

  test('returns to step 1 when the page is reloaded mid-flow', { tag: regression }, async ({ page, bookingFlow, bookingPage }) => {
    await test.step('reach the details step', async () => {
      await bookingFlow.reachDetailsStep();
      await expect(bookingPage.nameInput).toBeVisible();
    });

    await test.step('reload the page', async () => {
      await page.reload();
    });

    await test.step('the flow starts again from an empty step 1', async () => {
      await expect(bookingPage.partySize).toBeVisible();
      await expect(bookingPage.partySize).toHaveValue('');
      await expect(bookingPage.nameInput).toBeHidden();
    });
  });
});
