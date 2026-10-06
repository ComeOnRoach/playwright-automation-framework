// src/fixtures/booking.fixture.ts
// The booking app is a separate site from the AI Playground, so it navigates by absolute URL.
import { test as base } from '@playwright/test';
import { BookingPage } from '../pages/RestaurantBooking/booking.page';
import bookingData from '../../test-data/booking.json';

type Fixtures = {
  bookingPage: BookingPage;
};

export const test = base.extend<Fixtures>({
  bookingPage: async ({ page }, use) => {
    const bookingPage = new BookingPage(page);
    await bookingPage.navigate(bookingData.url);
    await use(bookingPage);
  },
});
