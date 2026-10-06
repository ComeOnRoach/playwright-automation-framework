import { faker } from '@faker-js/faker';
import { test, expect } from '../../../src/fixtures';
import bookingData from '../../../test-data/booking.json';

const { happyPath, mockEndpoint } = bookingData;

test.describe('Restaurant booking', () => {
  test('confirms a reservation and shows a WDU reference', {
    tag: ['@smoke', '@ui', '@feature:restaurant-booking'],
  }, async ({ page, bookingPage }) => {
    const details = {
      name: `${faker.person.firstName()} ${faker.person.lastName()}`,
      email: faker.internet.email(),
      phone: `07${faker.string.numeric(9)}`,
    };

    await page.route(mockEndpoint, (route) => route.fulfill({ status: 201, json: {} }));

    await test.step('choose party size and table type', async () => {
      await bookingPage.selectPartyAndType(happyPath.partySize);
      await expect(bookingPage.depositAmount).toHaveText(happyPath.deposit);
      await bookingPage.goToDateStep();
    });

    const slot = await test.step('pick an available date and time', async () => {
      const chosen = await bookingPage.pickFirstAvailableSlot();
      await expect(bookingPage.dateInput).toHaveValue(chosen.date);
      await bookingPage.goToDetailsStep();
      return chosen;
    });

    await test.step('enter contact details', async () => {
      await bookingPage.fillDetails(details);
      await bookingPage.goToReviewStep();
    });

    await test.step('review matches what was entered', async () => {
      await expect(bookingPage.reviewParty).toHaveText(`${happyPath.partySize} guests`);
      await expect(bookingPage.reviewType).toHaveText(happyPath.bookingType);
      await expect(bookingPage.reviewDeposit).toHaveText(happyPath.deposit);
      await expect(bookingPage.reviewDateTime).toHaveText(`${slot.date} at ${slot.time}`);
      await expect(bookingPage.reviewName).toHaveText(details.name);
      await expect(bookingPage.reviewEmail).toHaveText(details.email);
      await expect(bookingPage.reviewPhone).toHaveText(details.phone);
    });

    await test.step('request is sent and success screen shows a reference', async () => {
      const requestPromise = page.waitForRequest(mockEndpoint);
      await bookingPage.confirmBooking();
      const request = await requestPromise;

      expect(request.method()).toBe('POST');
      expect(request.postDataJSON()).toEqual({
        partySize: happyPath.partySize,
        bookingType: happyPath.bookingType,
        date: slot.date,
        time: slot.time,
        ...details,
      });

      await expect(bookingPage.successHeading).toHaveText(happyPath.successHeading);
      await expect(bookingPage.successParty).toHaveText(`${happyPath.partySize} guests`);
      await expect(bookingPage.successType).toHaveText(happyPath.bookingType);
      await expect(bookingPage.successDateTime).toHaveText(`${slot.date} at ${slot.time}`);
      await expect(bookingPage.successName).toHaveText(details.name);
      // Reference is generated client-side, so assert the pattern, never an exact value.
      await expect(bookingPage.reference).toHaveText(new RegExp(happyPath.referencePattern));
    });
  });
});
