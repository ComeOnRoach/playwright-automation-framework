// src/helpers/booking.helper.ts
import { Page, Request, Route } from '@playwright/test';

export type MockResponse = Parameters<Route['fulfill']>[0];

export async function mockReservationEndpoint(
  page: Page,
  endpoint: string,
  response: MockResponse,
): Promise<void> {
  await page.route(endpoint, (route) => route.fulfill(response));
}

export async function abortReservationEndpoint(page: Page, endpoint: string): Promise<void> {
  await page.route(endpoint, (route) => route.abort());
}

// Never fulfils the request, so it stays pending until the app's own timeout fires.
export async function hangReservationEndpoint(page: Page, endpoint: string): Promise<void> {
  await page.route(endpoint, () => new Promise<void>(() => {}));
}

export type ReservationStep = { response: MockResponse; delayMs?: number };

// Answers each call with the next step (the last one repeats) and records every request,
// so tests can assert how many calls were sent and what they carried.
export async function mockReservationSequence(
  page: Page,
  endpoint: string,
  steps: ReservationStep[],
): Promise<Request[]> {
  const requests: Request[] = [];
  await page.route(endpoint, async (route) => {
    const step = steps[Math.min(requests.length, steps.length - 1)];
    requests.push(route.request());
    if (step.delayMs) {
      await new Promise((resolve) => setTimeout(resolve, step.delayMs));
    }
    await route.fulfill(step.response);
  });
  return requests;
}

// Pure mirrors of the app's availability rules (js/app.js), used for [LOGIC] tests.
// Slot labels the app can book out, indexed by day-of-month % 4.
const DYNAMIC_SLOT_COUNT = 4;

export function bookedSlotIndexForDate(isoDate: string): number {
  return parseInt(isoDate.slice(8, 10), 10) % DYNAMIC_SLOT_COUNT;
}

// month is 0-based, like Date#getMonth.
export function bookedDaysFor(year: number, month: number): [number, number] {
  const seed = year * 12 + month;
  return [10 + (seed % 9), 19 + (seed % 9)];
}

export function daysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}
