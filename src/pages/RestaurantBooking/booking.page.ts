// src/pages/RestaurantBooking/booking.page.ts
import { Page, Locator } from '@playwright/test';

export type BookingSlot = { date: string; time: string };
export type BookingDetails = { name: string; email: string; phone: string };

export class BookingPage {
  private readonly page: Page;

  // Step 1
  readonly partySize: Locator;
  readonly standardType: Locator;
  readonly depositAmount: Locator;
  readonly step1Next: Locator;

  // Step 2
  readonly dateInput: Locator;
  readonly firstAvailableDay: Locator;
  readonly firstAvailableSlot: Locator;
  readonly step2Next: Locator;

  // Step 3
  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly phoneInput: Locator;
  readonly step3Next: Locator;

  // Step 4
  readonly reviewParty: Locator;
  readonly reviewType: Locator;
  readonly reviewDeposit: Locator;
  readonly reviewDateTime: Locator;
  readonly reviewName: Locator;
  readonly reviewEmail: Locator;
  readonly reviewPhone: Locator;
  readonly confirmButton: Locator;

  // Success
  readonly successSection: Locator;
  readonly successHeading: Locator;
  readonly successParty: Locator;
  readonly successType: Locator;
  readonly successDateTime: Locator;
  readonly successName: Locator;
  readonly reference: Locator;

  constructor(page: Page) {
    this.page = page;

    this.partySize = page.locator('#party-size');
    this.standardType = page.locator('#type-standard');
    this.depositAmount = page.locator('#deposit-amount');
    this.step1Next = page.locator('#step1-next');

    this.dateInput = page.locator('#booking-date');
    // Past and fully-booked calendar days are disabled by the app.
    this.firstAvailableDay = page.locator('#cal-grid [data-date]:enabled').first();
    // #slot-1900 is permanently disabled; one more slot is disabled per date.
    this.firstAvailableSlot = page.locator('button[id^="slot-"]:enabled').first();
    this.step2Next = page.locator('#step2-next');

    this.nameInput = page.locator('#booking-name');
    this.emailInput = page.locator('#booking-email');
    this.phoneInput = page.locator('#booking-phone');
    this.step3Next = page.locator('#step3-next');

    this.reviewParty = page.locator('#review-party');
    this.reviewType = page.locator('#review-type');
    this.reviewDeposit = page.locator('#review-deposit');
    this.reviewDateTime = page.locator('#review-datetime');
    this.reviewName = page.locator('#review-name');
    this.reviewEmail = page.locator('#review-email');
    this.reviewPhone = page.locator('#review-phone');
    this.confirmButton = page.locator('#confirm-booking');

    this.successSection = page.locator('#booking-success');
    this.successHeading = this.successSection.getByRole('heading');
    this.successParty = page.locator('#success-party');
    this.successType = page.locator('#success-type');
    this.successDateTime = page.locator('#success-datetime');
    this.successName = page.locator('#success-name');
    this.reference = page.locator('#booking-ref');
  }

  async navigate(url: string): Promise<void> {
    await this.page.goto(url);
  }

  async selectPartyAndType(size: string): Promise<void> {
    await this.partySize.selectOption(size);
    await this.standardType.click();
  }

  // Picks the first selectable day and slot; returns what was chosen so callers
  // can assert on it without hardcoding a date.
  async pickFirstAvailableSlot(): Promise<BookingSlot> {
    const date = await this.firstAvailableDay.getAttribute('data-date');
    await this.firstAvailableDay.click();
    // Slots are enabled only after a date is picked; click auto-waits for that.
    const time = await this.firstAvailableSlot.getAttribute('data-label');
    await this.firstAvailableSlot.click();
    if (!date || !time) {
      throw new Error('Calendar day or time slot is missing its data attribute');
    }
    return { date, time };
  }

  async fillDetails(details: BookingDetails): Promise<void> {
    await this.nameInput.fill(details.name);
    await this.emailInput.fill(details.email);
    await this.phoneInput.fill(details.phone);
  }

  async goToDateStep(): Promise<void> {
    await this.step1Next.click();
  }

  async goToDetailsStep(): Promise<void> {
    await this.step2Next.click();
  }

  async goToReviewStep(): Promise<void> {
    await this.step3Next.click();
  }

  async confirmBooking(): Promise<void> {
    await this.confirmButton.click();
  }
}
