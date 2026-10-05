// src/pages/AIPlaygroundPage/priority-board.page.ts
import { Page, Locator } from '@playwright/test';

export class PriorityBoardCard {
  private readonly page: Page;
  readonly backlogColumn: Locator;
  readonly inProgressColumn: Locator;
  readonly confirmation: Locator;

  constructor(page: Page) {
    this.page = page;
    this.backlogColumn = page.locator('#backlog-column');
    this.inProgressColumn = page.locator('#inprogress-column');
    this.confirmation = page.locator('#board-result');
  }

  taskIn(column: Locator, name: string): Locator {
    return column.locator('.task-card', { hasText: name });
  }

  async dragTask(name: string, from: Locator, to: Locator): Promise<void> {
    await this.taskIn(from, name).dragTo(to);
  }
}
