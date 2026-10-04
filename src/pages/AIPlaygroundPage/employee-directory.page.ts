// src/pages/AIPlaygroundPage/employee-directory.page.ts
import { Page, Locator } from '@playwright/test';

// Column keys match the `data-col` attribute on each header, in table order.
const COLUMN_ORDER = ['name', 'dept', 'salary', 'status', 'start'] as const;

export type EmployeeColumn = (typeof COLUMN_ORDER)[number];

export class EmployeeDirectoryCard {
  private readonly page: Page;
  readonly table: Locator;
  readonly filterInput: Locator;
  readonly rows: Locator;

  constructor(page: Page) {
    this.page = page;
    this.table = page.locator('#employee-table');
    this.filterInput = page.locator('#table-filter');
    this.rows = page.locator('#employee-tbody tr');
  }

  header(column: EmployeeColumn): Locator {
    return this.table.locator(`th[data-col="${column}"]`);
  }

  sortArrow(column: EmployeeColumn): Locator {
    return this.header(column).locator('span');
  }

  cellsInColumn(column: EmployeeColumn): Locator {
    const index = COLUMN_ORDER.indexOf(column) + 1;
    return this.rows.locator(`td:nth-child(${index})`);
  }

  async filterBy(text: string): Promise<void> {
    await this.filterInput.scrollIntoViewIfNeeded();
    await this.filterInput.fill(text);
  }

  async clearFilter(): Promise<void> {
    await this.filterInput.scrollIntoViewIfNeeded();
    await this.filterInput.clear();
  }

  async sortBy(column: EmployeeColumn): Promise<void> {
    const header = this.header(column);
    await header.scrollIntoViewIfNeeded();
    await header.click();
  }

  async columnTexts(column: EmployeeColumn): Promise<string[]> {
    const texts = await this.cellsInColumn(column).allTextContents();
    return texts.map((text) => text.trim());
  }
}
