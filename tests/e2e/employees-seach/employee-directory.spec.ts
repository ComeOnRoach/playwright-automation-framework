import { test, expect } from '../../../src/fixtures';
import { EmployeeColumn } from '../../../src/pages/AIPlaygroundPage/employee-directory.page';
import { sortedCopy } from '../../../src/helpers/sort.helper';
import { gbpAmountPattern } from '../../../src/helpers/currency.helper';
import { EmployeeDirectoryData } from '../../../src/types/employee-directory.types';
import rawData from '../../../test-data/employee-directory.json';

// JSON imports widen string literals, so the shape is asserted once here.
const data = rawData as EmployeeDirectoryData;
const { filters, sortColumns, arrows, totalEmployees } = data;

const baseTags = ['@regression', '@ui', '@feature:employee-directory'];

// Salary cells render with a locale-dependent thousands separator, so match them by amount.
function expectedTexts(column: EmployeeColumn, values: string[]): (string | RegExp)[] {
  return column === 'salary' ? values.map((value) => gbpAmountPattern(Number(value))) : values;
}

test.describe('Employee Directory', () => {
  test.describe('Filtering', () => {
    for (const [key, filter] of Object.entries(filters)) {
      test(
        `filters and restores the list by ${key}`,
        { tag: filter.smoke ? [...baseTags, '@smoke'] : baseTags },
        async ({ employeeDirectoryCard }) => {
          await test.step('Verify the unfiltered directory shows every employee', async () => {
            await expect(employeeDirectoryCard.rows.first()).toBeVisible();
            await expect(employeeDirectoryCard.rows).toHaveCount(totalEmployees);
          });

          await test.step(`Filter the directory by "${filter.term}"`, async () => {
            await employeeDirectoryCard.filterBy(filter.term);
          });

          await test.step('Verify only the matching employees are shown', async () => {
            await expect(employeeDirectoryCard.rows.first()).toBeVisible();
            await expect(employeeDirectoryCard.cellsInColumn(filter.column)).toHaveText(
              expectedTexts(filter.column, filter.expectedValues),
            );
          });

          await test.step('Clear the filter and verify every employee is shown again', async () => {
            await employeeDirectoryCard.clearFilter();
            await expect(employeeDirectoryCard.rows.first()).toBeVisible();
            await expect(employeeDirectoryCard.rows).toHaveCount(totalEmployees);
          });
        },
      );
    }

    test(
      'shows no rows when nothing matches',
      { tag: baseTags },
      async ({ employeeDirectoryCard }) => {
        await test.step('Filter by a term that matches nobody', async () => {
          await employeeDirectoryCard.filterBy(data.noMatchTerm);
        });

        await test.step('Verify no rows are shown while the table header stays visible', async () => {
          await expect(employeeDirectoryCard.rows).toHaveCount(0);
          await expect(employeeDirectoryCard.table).toBeVisible();
          await expect(employeeDirectoryCard.header(sortColumns[0].column)).toBeVisible();
        });
      },
    );
  });

  test.describe('Sorting', () => {
    for (const { column, label, kind } of sortColumns) {
      test(
        `toggles ascending then descending order by ${label}`,
        { tag: baseTags },
        async ({ employeeDirectoryCard }) => {
          let unsorted: string[] = [];

          await test.step('Capture the unsorted column', async () => {
            await expect(employeeDirectoryCard.rows).toHaveCount(totalEmployees);
            unsorted = await employeeDirectoryCard.columnTexts(column);
          });

          await test.step(`Click the ${label} header once`, async () => {
            await employeeDirectoryCard.sortBy(column);
          });

          await test.step('Verify ascending order and the up arrow', async () => {
            await expect(employeeDirectoryCard.sortArrow(column)).toBeVisible();
            await expect(employeeDirectoryCard.sortArrow(column)).toHaveText(arrows.asc);
            await expect
              .poll(() => employeeDirectoryCard.columnTexts(column))
              .toEqual(sortedCopy(unsorted, kind, 'asc'));
          });

          await test.step(`Click the ${label} header again`, async () => {
            await employeeDirectoryCard.sortBy(column);
          });

          await test.step('Verify descending order and the down arrow', async () => {
            await expect(employeeDirectoryCard.sortArrow(column)).toHaveText(arrows.desc);
            await expect
              .poll(() => employeeDirectoryCard.columnTexts(column))
              .toEqual(sortedCopy(unsorted, kind, 'desc'));
          });
        },
      );
    }

    test(
      'keeps only the filtered employees when sorting a filtered list',
      { tag: baseTags },
      async ({ employeeDirectoryCard }) => {
        const { term, column, expectedSalariesAscending } = data.filteredSort;

        await test.step('Filter the directory', async () => {
          await employeeDirectoryCard.filterBy(term);
          await expect(employeeDirectoryCard.rows).toHaveCount(expectedSalariesAscending.length);
        });

        await test.step('Sort the filtered list and verify the rows and their order', async () => {
          await employeeDirectoryCard.sortBy(column);
          await expect(employeeDirectoryCard.rows.first()).toBeVisible();
          await expect(employeeDirectoryCard.cellsInColumn(column)).toHaveText(
            expectedTexts(column, expectedSalariesAscending),
          );
        });
      },
    );
  });
});
