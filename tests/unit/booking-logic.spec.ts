import { test, expect } from '../../src/fixtures';
import { bookedDaysFor, bookedSlotIndexForDate, daysInMonth } from '../../src/helpers/booking.helper';
import bookingData from '../../test-data/booking.json';

const { step2 } = bookingData;
const tag = ['@regression', '@feature:restaurant-booking'];

// Pure-logic checks of the app's availability rules; no browser involved.
test.describe('Restaurant booking: availability rules', () => {
  for (const date of step2.logicDates) {
    test(`books the slot for day-of-month % 4 on ${date}`, { tag }, async () => {
      const day = Number(date.slice(8, 10));
      const index = bookedSlotIndexForDate(date);

      expect(index).toBe(day % 4);
      expect(step2.slotLabelByBookedIndex[index]).toBeDefined();
    });
  }

  test('maps day-of-month % 4 to 5, 6, 8 and 9 PM', { tag }, async () => {
    const labels = [0, 1, 2, 3].map((day) => step2.slotLabelByBookedIndex[bookedSlotIndexForDate(`2027-03-0${day + 4}`)]);

    expect(labels).toEqual(['5:00 PM', '6:00 PM', '8:00 PM', '9:00 PM']);
  });

  for (const { year, month, days } of step2.logicMonths) {
    test(`has ${days} days in ${year}-${month + 1}`, { tag }, async () => {
      expect(daysInMonth(year, month)).toBe(days);
    });
  }

  test('keeps the two booked days distinct and inside every month', { tag }, async () => {
    for (let month = 0; month < 12; month++) {
      const [first, second] = bookedDaysFor(2027, month);

      expect(first).toBeLessThan(second);
      expect(second).toBeLessThanOrEqual(daysInMonth(2027, month));
    }
  });
});
