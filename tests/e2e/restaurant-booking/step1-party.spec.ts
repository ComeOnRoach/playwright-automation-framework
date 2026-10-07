import { test, expect } from '../../../src/fixtures';
import { BookingType } from '../../../src/pages/RestaurantBooking/booking.page';
import bookingData from '../../../test-data/booking.json';

const { negative, step1 } = bookingData;
const { errors } = negative;

type TypedRow = { partySize: string; type: BookingType };

const regression = ['@regression', '@ui', '@feature:restaurant-booking'];
const smoke = ['@smoke', '@ui', '@feature:restaurant-booking'];
const types: BookingType[] = ['standard', 'group', 'private'];

test.describe('Restaurant booking: step 1 party and table type', () => {
  for (const row of step1.deposits as (TypedRow & { deposit: string })[]) {
    test(`shows ${row.deposit} deposit as soon as ${row.type} is selected`, { tag: smoke }, async ({ bookingPage }) => {
      await test.step('select a party size', async () => {
        await bookingPage.selectParty(row.partySize);
      });

      await test.step(`select the ${row.type} table`, async () => {
        await bookingPage.selectType(row.type);
      });

      await test.step('deposit label updates without pressing Next', async () => {
        await expect(bookingPage.depositAmount).toHaveText(row.deposit);
      });
    });
  }

  test('moves the selected state to the newly chosen table only', { tag: regression }, async ({ bookingPage }) => {
    await test.step('select the standard table', async () => {
      await bookingPage.selectType('standard');
      await expect(bookingPage.typeCard('standard')).toHaveClass(/selected/);
    });

    await test.step('switch to the private table', async () => {
      await bookingPage.selectType('private');
    });

    await test.step('only the private card is selected', async () => {
      await expect(bookingPage.typeCard('private')).toHaveClass(/selected/);
      for (const other of types.filter((t) => t !== 'private')) {
        await expect(bookingPage.typeCard(other)).not.toHaveClass(/selected/);
      }
    });
  });

  for (const row of negative.missingSelection) {
    test(`shows error when ${row.title}`, { tag: regression }, async ({ bookingPage }) => {
      await test.step('apply the partial selection', async () => {
        await bookingPage.selectPartyAndTypeIfSet(row.partySize, row.type as BookingType | null);
      });

      await test.step('press Next', async () => {
        await bookingPage.goToDateStep();
      });

      await test.step('error is shown and the flow stays on step 1', async () => {
        await expect(bookingPage.step1Error).toBeVisible();
        await expect(bookingPage.step1Error).toHaveText(errors.step1);
        await expect(bookingPage.dateInput).toBeHidden();
      });
    });
  }

  for (const row of negative.invalidCombos as (TypedRow & { error: string })[]) {
    test(`rejects ${row.type} table for ${row.partySize} guests`, { tag: regression }, async ({ bookingPage }) => {
      await test.step('select the invalid combination', async () => {
        await bookingPage.selectPartyAndType(row.partySize, row.type);
      });

      await test.step('press Next', async () => {
        await bookingPage.goToDateStep();
      });

      await test.step('combination error is shown and the flow stays on step 1', async () => {
        await expect(bookingPage.partyError).toBeVisible();
        await expect(bookingPage.partyError).toHaveText(row.error);
        await expect(bookingPage.dateInput).toBeHidden();
      });
    });
  }

  for (const row of step1.validBoundaries as TypedRow[]) {
    test(`accepts ${row.type} table for ${row.partySize} guests`, { tag: regression }, async ({ bookingPage }) => {
      await test.step('select the boundary combination', async () => {
        await bookingPage.selectPartyAndType(row.partySize, row.type);
      });

      await test.step('press Next', async () => {
        await bookingPage.goToDateStep();
      });

      await test.step('the date screen opens', async () => {
        await expect(bookingPage.dateInput).toBeVisible();
        await expect(bookingPage.partyError).toBeHidden();
      });
    });
  }

  test('offers exactly the party sizes 1 to 10 and a disabled placeholder', { tag: regression }, async ({ bookingPage }) => {
    await test.step('placeholder is the first option and cannot be selected', async () => {
      await expect(bookingPage.partyOptions.first()).toHaveText(step1.placeholder);
      await expect(bookingPage.partyOptions.first()).toBeDisabled();
    });

    await test.step('the remaining options are 1 to 10', async () => {
      const expected = Array.from({ length: step1.partyOptionCount }, (_, i) => String(i + 1));
      await expect(bookingPage.partyOptions).toHaveCount(step1.partyOptionCount + 1);
      await expect(bookingPage.partyOptions.filter({ hasNotText: step1.placeholder })).toHaveText(expected);
    });
  });

  test('clears the error on the next valid attempt', { tag: regression }, async ({ bookingPage }) => {
    await test.step('trigger the missing-selection error', async () => {
      await bookingPage.goToDateStep();
      await expect(bookingPage.step1Error).toBeVisible();
    });

    await test.step('make a valid selection and press Next', async () => {
      await bookingPage.selectPartyAndType(bookingData.happyPath.partySize);
      await bookingPage.goToDateStep();
    });

    await test.step('error is gone and step 2 is open', async () => {
      await expect(bookingPage.dateInput).toBeVisible();
      await expect(bookingPage.step1Error).toBeHidden();
    });
  });

  test('advances only one step on rapid repeated Next clicks', { tag: regression }, async ({ bookingPage }) => {
    await test.step('select a valid combination', async () => {
      await bookingPage.selectPartyAndType(bookingData.happyPath.partySize);
    });

    await test.step('click Next several times in a row', async () => {
      // force: the repeated clicks must reach the button even while the step is already switching.
      // eslint-disable-next-line playwright/no-force-option
      await bookingPage.step1Next.click({ clickCount: 3, force: true });
    });

    await test.step('the flow is on step 2, not further', async () => {
      await expect(bookingPage.dateInput).toBeVisible();
      await expect(bookingPage.nameInput).toBeHidden();
    });
  });
});
