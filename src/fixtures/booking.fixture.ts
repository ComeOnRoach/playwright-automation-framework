// src/fixtures/booking.fixture.ts
// The booking app is a separate site from the AI Playground, so it navigates by absolute URL.
import { test as base } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { BookingPage, BookingDetails, BookingSlot } from '../pages/RestaurantBooking/booking.page';
import bookingData from '../../test-data/booking.json';

// Plain consts, not fixtures: static data shared by booking specs.
export const validGuest: BookingDetails = {
  name: `${faker.person.firstName()} ${faker.person.lastName()}`,
  email: faker.internet.email(),
  phone: `07${faker.string.numeric(9)}`,
};

// Mocked reservation response; the reference is generated client-side, so the body stays empty.
export const reservationCreatedResponse = { status: 201, json: {} };

// Fast-forwards through earlier steps; booking state is in-memory, so it cannot be restored via storage or API.
export type BookingFlow = {
  reachDateStep: () => Promise<void>;
  reachDetailsStep: () => Promise<BookingSlot>;
  reachReviewStep: (details?: BookingDetails) => Promise<BookingSlot>;
  openAtFixedTime: (isoTime: string) => Promise<void>;
};

type Fixtures = {
  bookingPage: BookingPage;
  bookingFlow: BookingFlow;
};

export const test = base.extend<Fixtures>({
  bookingPage: async ({ page }, use) => {
    const bookingPage = new BookingPage(page);
    await bookingPage.navigate(bookingData.url);
    await use(bookingPage);
  },
  bookingFlow: async ({ page, bookingPage }, use) => {
    const reachDateStep = async (): Promise<void> => {
      await bookingPage.selectPartyAndType(bookingData.happyPath.partySize);
      await bookingPage.goToDateStep();
    };
    const reachDetailsStep = async (): Promise<BookingSlot> => {
      await reachDateStep();
      const slot = await bookingPage.pickFirstAvailableSlot();
      await bookingPage.goToDetailsStep();
      return slot;
    };
    const reachReviewStep = async (details: BookingDetails = validGuest): Promise<BookingSlot> => {
      const slot = await reachDetailsStep();
      await bookingPage.fillDetails(details);
      await bookingPage.goToReviewStep();
      return slot;
    };
    // The calendar reads the clock on load, so the clock must be fixed before the page is opened again.
    const openAtFixedTime = async (isoTime: string): Promise<void> => {
      await page.clock.install({ time: new Date(isoTime) });
      await bookingPage.navigate(bookingData.url);
    };
    await use({ reachDateStep, reachDetailsStep, reachReviewStep, openAtFixedTime });
  },
});
