// src/helpers/booking.helper.ts
import { Page, Route } from '@playwright/test';

export type MockResponse = Parameters<Route['fulfill']>[0];

export async function mockReservationEndpoint(
  page: Page,
  endpoint: string,
  response: MockResponse,
): Promise<void> {
  await page.route(endpoint, (route) => route.fulfill(response));
}
