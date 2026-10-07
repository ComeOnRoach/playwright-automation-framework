// src/pages/RestaurantBooking/booking.page.ts
import { Page, Locator } from '@playwright/test';

export type BookingSlot = { date: string; time: string };
export type BookingDetails = { name: string; email: string; phone: string };
export type BookingType = 'standard' | 'group' | 'private';

export class BookingPage {
  private readonly page: Page;

  // Step 1
  readonly partySize: Locator;
  readonly standardType: Locator;
  readonly groupType: Locator;
  readonly privateType: Locator;
  readonly step1Error: Locator;
  readonly partyError: Locator;
  readonly depositAmount: Locator;
  readonly step1Next: Locator;
  readonly stepDots: Locator;

  // Step 2
  readonly dateInput: Locator;
  readonly partyOptions: Locator;
  readonly calendarDays: Locator;
  readonly bookedDays: Locator;
  readonly selectedDay: Locator;
  readonly calendarMonthLabel: Locator;
  readonly calendarPrev: Locator;
  readonly calendarNext: Locator;
  readonly selectedDateLabel: Locator;
  readonly slots: Locator;
  readonly enabledSlots: Locator;
  readonly selectedSlot: Locator;
  readonly step2Back: Locator;
  readonly firstAvailableDay: Locator;
  readonly firstAvailableSlot: Locator;
  readonly step2Next: Locator;
  readonly dateError: Locator;
  readonly datetimeError: Locator;

  // Step 3
  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly phoneInput: Locator;
  readonly step3Next: Locator;
  readonly step3Back: Locator;
  readonly nameError: Locator;
  readonly emailError: Locator;
  readonly phoneError: Locator;

  // Step 4
  readonly reviewParty: Locator;
  readonly reviewType: Locator;
  readonly reviewDeposit: Locator;
  readonly reviewDateTime: Locator;
  readonly reviewName: Locator;
  readonly reviewEmail: Locator;
  readonly reviewPhone: Locator;
  readonly confirmButton: Locator;
  readonly confirmError: Locator;
  readonly confirmLoading: Locator;
  readonly step4Back: Locator;

  // Success
  readonly successSection: Locator;
  readonly successHeading: Locator;
  readonly successParty: Locator;
  readonly successType: Locator;
  readonly successDateTime: Locator;
  readonly successName: Locator;
  readonly reference: Locator;
  readonly restartButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.partySize = page.locator('#party-size');
    this.standardType = page.locator('#type-standard');
    this.groupType = page.locator('#type-group');
    this.privateType = page.locator('#type-private');
    this.step1Error = page.locator('#step1-error');
    this.partyError = page.locator('#party-error');
    this.depositAmount = page.locator('#deposit-amount');
    this.step1Next = page.locator('#step1-next');
    this.stepDots = page.locator('[id^="step-dot-"]');
    this.partyOptions = this.partySize.locator('option');

    this.dateInput = page.locator('#booking-date');
    // Past and fully-booked calendar days are disabled by the app.
    this.firstAvailableDay = page.locator('#cal-grid [data-date]:enabled').first();
    // #slot-1900 is permanently disabled; one more slot is disabled per date.
    this.firstAvailableSlot = page.locator('button[id^="slot-"]:enabled').first();
    this.calendarDays = page.locator('#cal-grid [data-date]');
    this.bookedDays = page.locator('#cal-grid .cal-day.booked');
    this.selectedDay = page.locator('#cal-grid .cal-day.selected');
    this.calendarMonthLabel = page.locator('#cal-month-label');
    this.calendarPrev = page.locator('#cal-prev');
    this.calendarNext = page.locator('#cal-next');
    this.selectedDateLabel = page.locator('#selected-date-label');
    this.slots = page.locator('button[id^="slot-"]');
    this.enabledSlots = page.locator('button[id^="slot-"]:enabled');
    this.selectedSlot = page.locator('button[id^="slot-"].selected');
    this.step2Next = page.locator('#step2-next');
    this.step2Back = page.locator('#step2-back');
    this.dateError = page.locator('#date-error');
    this.datetimeError = page.locator('#datetime-error');

    this.nameInput = page.locator('#booking-name');
    this.emailInput = page.locator('#booking-email');
    this.phoneInput = page.locator('#booking-phone');
    this.step3Next = page.locator('#step3-next');
    this.step3Back = page.locator('#step3-back');
    this.nameError = page.locator('#name-error');
    this.emailError = page.locator('#email-error');
    this.phoneError = page.locator('#phone-error');

    this.reviewParty = page.locator('#review-party');
    this.reviewType = page.locator('#review-type');
    this.reviewDeposit = page.locator('#review-deposit');
    this.reviewDateTime = page.locator('#review-datetime');
    this.reviewName = page.locator('#review-name');
    this.reviewEmail = page.locator('#review-email');
    this.reviewPhone = page.locator('#review-phone');
    this.confirmButton = page.locator('#confirm-booking');
    this.confirmError = page.locator('#confirm-error');
    this.confirmLoading = page.locator('#confirm-loading');
    this.step4Back = page.locator('#step4-back');

    this.successSection = page.locator('#booking-success');
    this.successHeading = this.successSection.getByRole('heading');
    this.successParty = page.locator('#success-party');
    this.successType = page.locator('#success-type');
    this.successDateTime = page.locator('#success-datetime');
    this.successName = page.locator('#success-name');
    this.reference = page.locator('#booking-ref');
    this.restartButton = page.locator('#booking-restart');
  }

  async navigate(url: string): Promise<void> {
    await this.page.goto(url);
  }

  async selectPartyAndType(size: string, type: BookingType = 'standard'): Promise<void> {
    await this.selectParty(size);
    await this.selectType(type);
  }

  typeCard(type: BookingType): Locator {
    return { standard: this.standardType, group: this.groupType, private: this.privateType }[type];
  }

  calendarDay(date: string): Locator {
    return this.page.locator(`#cal-grid [data-date="${date}"]`);
  }

  slot(label: string): Locator {
    return this.page.locator(`button[id^="slot-"][data-label="${label}"]`);
  }

  async selectParty(size: string): Promise<void> {
    await this.partySize.selectOption(size);
  }

  async selectType(type: BookingType): Promise<void> {
    await this.typeCard(type).click();
  }

  // Applies only the selections that are provided, for partially filled Step 1 cases.
  async selectPartyAndTypeIfSet(
    size: string | null,
    type: BookingType | null,
  ): Promise<void> {
    if (size) await this.selectParty(size);
    if (type) await this.selectType(type);
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

  async selectDate(date: string): Promise<void> {
    await this.calendarDay(date).click();
  }

  async selectSlot(label: string): Promise<void> {
    await this.slot(label).click();
  }

  async goToNextMonth(): Promise<void> {
    await this.calendarNext.click();
  }

  async goToPreviousMonth(): Promise<void> {
    await this.calendarPrev.click();
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

  async goBackFromDetailsStep(): Promise<void> {
    await this.step3Back.click();
  }

  async goBackFromDateStep(): Promise<void> {
    await this.step2Back.click();
  }

  async goBackFromReviewStep(): Promise<void> {
    await this.step4Back.click();
  }

  async makeAnotherReservation(): Promise<void> {
    await this.restartButton.click();
  }

  async confirmBooking(): Promise<void> {
    await this.confirmButton.click();
  }
}
