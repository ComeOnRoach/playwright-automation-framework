import { test, expect } from '../../../src/fixtures';
import { bookedDaysFor, bookedSlotIndexForDate } from '../../../src/helpers/booking.helper';
import bookingData from '../../../test-data/booking.json';

const { happyPath, negative, step2 } = bookingData;
const { errors } = negative;
const { fixedClock, slotLabels, alwaysBookedSlot, slotLabelByBookedIndex } = step2;

const regression = ['@regression', '@ui', '@feature:restaurant-booking'];
const smoke = ['@smoke', '@ui', '@feature:restaurant-booking'];

// Fixed-clock dates (March 2027) are never past and never one of the 2 booked days.
const firstDate = step2.logicDates[0];
const secondDate = step2.logicDates[1];
const lastDate = step2.logicDates[step2.logicDates.length - 1];
const openSlotCount = slotLabels.length - 2;

test.describe('Restaurant booking: step 2 date and time', () => {
  test.describe('validation', () => {
    test('shows error when no date is chosen', { tag: regression }, async ({ bookingFlow, bookingPage }) => {
      await test.step('reach the date step', async () => {
        await bookingFlow.reachDateStep();
      });

      await test.step('press Next without a date', async () => {
        await bookingPage.goToDetailsStep();
      });

      await test.step('date error is shown and the flow stays on step 2', async () => {
        await expect(bookingPage.dateError).toBeVisible();
        await expect(bookingPage.dateError).toHaveText(errors.date);
        await expect(bookingPage.nameInput).toBeHidden();
      });
    });

    test('shows error when a date is chosen without a time slot', { tag: regression }, async ({ bookingFlow, bookingPage }) => {
      await test.step('reach the date step and pick a date only', async () => {
        await bookingFlow.reachDateStep();
        await bookingPage.firstAvailableDay.click();
      });

      await test.step('press Next', async () => {
        await bookingPage.goToDetailsStep();
      });

      await test.step('time error is shown and the flow stays on step 2', async () => {
        await expect(bookingPage.datetimeError).toBeVisible();
        await expect(bookingPage.datetimeError).toHaveText(errors.datetime);
        await expect(bookingPage.nameInput).toBeHidden();
      });
    });

    test('does not allow typing into the date input', { tag: regression }, async ({ bookingFlow, bookingPage }) => {
      await test.step('reach the date step', async () => {
        await bookingFlow.reachDateStep();
      });

      await test.step('the date input is read-only', async () => {
        await expect(bookingPage.dateInput).toHaveAttribute('readonly', '');
      });
    });
  });

  test.describe('date selection', () => {
    test('shows the chosen date in the input and in the selected label', { tag: regression }, async ({ bookingFlow, bookingPage }) => {
      await test.step('reach the date step', async () => {
        await bookingFlow.reachDateStep();
      });

      const date = await test.step('pick the first available date', async () => {
        const iso = await bookingPage.firstAvailableDay.getAttribute('data-date');
        await bookingPage.firstAvailableDay.click();
        return iso ?? '';
      });

      await test.step('input and label show the date', async () => {
        await expect(bookingPage.dateInput).toHaveValue(date);
        await expect(bookingPage.selectedDateLabel).toHaveText(`${step2.selectedLabelPrefix}${date}`);
      });
    });

    test('returns to step 1 with party and table type preserved', { tag: regression }, async ({ bookingFlow, bookingPage }) => {
      await test.step('reach the date step', async () => {
        await bookingFlow.reachDateStep();
      });

      await test.step('press Back', async () => {
        await bookingPage.goBackFromDateStep();
      });

      await test.step('the first screen shows the earlier choices', async () => {
        await expect(bookingPage.partySize).toHaveValue(happyPath.partySize);
        await expect(bookingPage.standardType).toHaveClass(/selected/);
        await expect(bookingPage.dateInput).toBeHidden();
      });
    });

    test('disables past days and keeps today selectable', { tag: regression }, async ({ bookingFlow, bookingPage }) => {
      const { time, today, yesterday } = fixedClock.today;

      await test.step('open the app on a fixed date and reach the date step', async () => {
        await bookingFlow.openAtFixedTime(time);
        await bookingFlow.reachDateStep();
      });

      await test.step('yesterday is disabled', async () => {
        await expect(bookingPage.calendarDay(yesterday)).toBeDisabled();
      });

      await test.step('today is enabled and can be selected', async () => {
        await expect(bookingPage.calendarDay(today)).toBeEnabled();
        await bookingPage.selectDate(today);
        await expect(bookingPage.dateInput).toHaveValue(today);
      });
    });

    test('disables the two computed fully-booked days', { tag: regression }, async ({ bookingFlow, bookingPage }) => {
      const [first, second] = bookedDaysFor(2027, 2);

      await test.step('open the app on a fixed date and reach the date step', async () => {
        await bookingFlow.openAtFixedTime(fixedClock.march.time);
        await bookingFlow.reachDateStep();
      });

      await test.step('exactly the computed days are marked booked and disabled', async () => {
        await expect(bookingPage.bookedDays).toHaveCount(2);
        await expect(bookingPage.bookedDays.first()).toBeDisabled();
        await expect(bookingPage.bookedDays.first()).toHaveAttribute('data-date', `2027-03-${first}`);
        await expect(bookingPage.bookedDays.last()).toHaveAttribute('data-date', `2027-03-${second}`);
      });
    });

    test('rolls the calendar from December to January of the next year', { tag: regression }, async ({ bookingFlow, bookingPage }) => {
      const { time, month, nextMonth } = fixedClock.decemberRollover;

      await test.step('open the app in December and reach the date step', async () => {
        await bookingFlow.openAtFixedTime(time);
        await bookingFlow.reachDateStep();
        await expect(bookingPage.calendarMonthLabel).toHaveText(month);
      });

      await test.step('go to the next month', async () => {
        await bookingPage.goToNextMonth();
      });

      await test.step('label shows January of the next year', async () => {
        await expect(bookingPage.calendarMonthLabel).toHaveText(nextMonth);
      });

      await test.step('previous month returns to December', async () => {
        await bookingPage.goToPreviousMonth();
        await expect(bookingPage.calendarMonthLabel).toHaveText(month);
      });
    });

    test('renders 29 days for a leap-year February', { tag: regression }, async ({ bookingFlow, bookingPage }) => {
      const { time, month, days } = fixedClock.leapYear;

      await test.step('open the app in a leap-year February', async () => {
        await bookingFlow.openAtFixedTime(time);
        await bookingFlow.reachDateStep();
      });

      await test.step('month label and day count are correct', async () => {
        await expect(bookingPage.calendarMonthLabel).toHaveText(month);
        await expect(bookingPage.calendarDays).toHaveCount(days);
      });
    });

    test('keeps the selection after paging away and back', { tag: regression }, async ({ bookingFlow, bookingPage }) => {
      await test.step('reach the date step and pick a date', async () => {
        await bookingFlow.reachDateStep();
        await bookingPage.firstAvailableDay.click();
      });

      const date = await bookingPage.dateInput.inputValue();

      await test.step('page to the next month and back', async () => {
        await bookingPage.goToNextMonth();
        await expect(bookingPage.selectedDay).toHaveCount(0);
        await bookingPage.goToPreviousMonth();
      });

      await test.step('the date is still highlighted and labelled', async () => {
        await expect(bookingPage.selectedDay).toHaveAttribute('data-date', date);
        await expect(bookingPage.selectedDateLabel).toHaveText(`${step2.selectedLabelPrefix}${date}`);
      });
    });

    test('reopens step 2 on the selected date month and keeps its availability', { tag: regression }, async ({ bookingFlow, bookingPage }) => {
      await test.step('reach the date step and pick a date and slot in the next month', async () => {
        await bookingFlow.reachDateStep();
        await bookingPage.goToNextMonth();
        await bookingPage.firstAvailableDay.click();
        await bookingPage.firstAvailableSlot.click();
      });

      const monthLabel = (await bookingPage.calendarMonthLabel.textContent()) ?? '';
      const date = await bookingPage.dateInput.inputValue();

      await test.step('go to step 3 and back', async () => {
        await bookingPage.goToDetailsStep();
        await bookingPage.goBackFromDetailsStep();
      });

      await test.step('calendar opens on the selected month with the date kept', async () => {
        await expect(bookingPage.calendarMonthLabel).toHaveText(monthLabel);
        await expect(bookingPage.dateInput).toHaveValue(date);
        await expect(bookingPage.selectedDay).toHaveAttribute('data-date', date);
        await expect(bookingPage.slot(alwaysBookedSlot)).toBeDisabled();
        await expect(bookingPage.enabledSlots).toHaveCount(openSlotCount);
      });
    });
  });

  test.describe('time slots', () => {
    test('disables all slots before a date is chosen', { tag: smoke }, async ({ bookingFlow, bookingPage }) => {
      await test.step('reach the date step', async () => {
        await bookingFlow.reachDateStep();
      });

      await test.step('no slot is selectable', async () => {
        await expect(bookingPage.slots).toHaveCount(slotLabels.length);
        await expect(bookingPage.enabledSlots).toHaveCount(0);
      });
    });

    for (const date of [firstDate, lastDate]) {
      test(`keeps the 7:00 PM slot booked on ${date}`, { tag: regression }, async ({ bookingFlow, bookingPage }) => {
        await test.step('open the app on a fixed date and reach the date step', async () => {
          await bookingFlow.openAtFixedTime(fixedClock.march.time);
          await bookingFlow.reachDateStep();
        });

        await test.step('pick the date', async () => {
          await bookingPage.selectDate(date);
        });

        await test.step('the permanently booked slot is disabled', async () => {
          await expect(bookingPage.slot(alwaysBookedSlot)).toBeDisabled();
        });
      });

      test(`books exactly one of the 5, 6, 8 or 9 PM slots on ${date}`, { tag: regression }, async ({ bookingFlow, bookingPage }) => {
        const booked = slotLabelByBookedIndex[bookedSlotIndexForDate(date)];

        await test.step('open the app on a fixed date and reach the date step', async () => {
          await bookingFlow.openAtFixedTime(fixedClock.march.time);
          await bookingFlow.reachDateStep();
        });

        await test.step('pick the date', async () => {
          await bookingPage.selectDate(date);
        });

        await test.step('the computed slot is booked and the other three are open', async () => {
          await expect(bookingPage.slot(booked)).toBeDisabled();
          await expect(bookingPage.enabledSlots).toHaveCount(openSlotCount);
          for (const label of slotLabels.filter((l) => l !== booked && l !== alwaysBookedSlot)) {
            await expect(bookingPage.slot(label)).toBeEnabled();
          }
        });
      });
    }

    test('gives the same availability every time the same date is picked', { tag: regression }, async ({ bookingFlow, bookingPage }) => {
      await test.step('open the app on a fixed date and reach the date step', async () => {
        await bookingFlow.openAtFixedTime(fixedClock.march.time);
        await bookingFlow.reachDateStep();
      });

      await test.step('pick a date and wait for its availability', async () => {
        await bookingPage.selectDate(firstDate);
        await expect(bookingPage.enabledSlots).toHaveCount(openSlotCount);
      });

      const firstView = await bookingPage.enabledSlots.allTextContents();

      await test.step('pick another date, then the first one again', async () => {
        await bookingPage.selectDate(lastDate);
        await bookingPage.selectDate(firstDate);
        await expect(bookingPage.dateInput).toHaveValue(firstDate);
      });

      await test.step('the open slots are identical', async () => {
        await expect(bookingPage.enabledSlots).toHaveText(firstView);
      });
    });

    test('drops a chosen slot when the next date has it booked', { tag: regression }, async ({ bookingFlow, bookingPage }) => {
      // Open on the first date, booked on the second.
      const bookedOnSecond = slotLabelByBookedIndex[bookedSlotIndexForDate(secondDate)];

      await test.step('open the app on a fixed date, pick a date and that slot', async () => {
        await bookingFlow.openAtFixedTime(fixedClock.march.time);
        await bookingFlow.reachDateStep();
        await bookingPage.selectDate(firstDate);
        await bookingPage.selectSlot(bookedOnSecond);
        await expect(bookingPage.selectedSlot).toHaveCount(1);
      });

      await test.step('pick a date where that slot is booked', async () => {
        await bookingPage.selectDate(secondDate);
      });

      await test.step('the selection is dropped and Next shows the time error', async () => {
        await expect(bookingPage.slot(bookedOnSecond)).toBeDisabled();
        await expect(bookingPage.selectedSlot).toHaveCount(0);
        await bookingPage.goToDetailsStep();
        await expect(bookingPage.datetimeError).toHaveText(errors.datetime);
      });
    });

    test('keeps a single selected slot when another is chosen', { tag: regression }, async ({ bookingFlow, bookingPage }) => {
      const [first, second] = slotLabels.filter((l) => l !== alwaysBookedSlot).slice(0, 2);

      await test.step('open the app on a fixed date and pick a date', async () => {
        await bookingFlow.openAtFixedTime(fixedClock.march.time);
        await bookingFlow.reachDateStep();
        await bookingPage.selectDate(step2.logicDates[2]);
      });

      await test.step('choose one slot, then another', async () => {
        await bookingPage.selectSlot(first);
        await expect(bookingPage.slot(first)).toHaveClass(/selected/);
        await bookingPage.selectSlot(second);
      });

      await test.step('only the second slot stays selected', async () => {
        await expect(bookingPage.selectedSlot).toHaveCount(1);
        await expect(bookingPage.slot(second)).toHaveClass(/selected/);
      });
    });

    test('ignores a click on a disabled slot', { tag: regression }, async ({ bookingFlow, bookingPage }) => {
      await test.step('reach the date step and pick a date', async () => {
        await bookingFlow.reachDateStep();
        await bookingPage.firstAvailableDay.click();
      });

      await test.step('force-click the permanently booked slot', async () => {
        // force: a disabled slot must be clicked to prove it ignores the click.
        // eslint-disable-next-line playwright/no-force-option
        await bookingPage.slot(alwaysBookedSlot).click({ force: true });
      });

      await test.step('nothing is selected', async () => {
        await expect(bookingPage.selectedSlot).toHaveCount(0);
      });
    });
  });
});
