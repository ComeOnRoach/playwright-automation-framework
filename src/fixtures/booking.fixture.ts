// src/fixtures/booking.fixture.ts
// The booking app is a separate site from the AI Playground, so it navigates by absolute URL.
import { test as base } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { BookingPage, BookingDetails } from '../pages/RestaurantBooking/booking.page';
import bookingData from '../../test-data/booking.json';

// Plain consts, not fixtures: static data shared by booking specs.
export const validGuest: BookingDetails = {
  name: `${faker.person.firstName()} ${faker.person.lastName()}`,
  email: faker.internet.email(),
  phone: `07${faker.string.numeric(9)}`,
};

// Mocked reservation response; the reference is generated client-side, so the body stays empty.
export const reservationCreatedResponse = { status: 201, json: {} };

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
