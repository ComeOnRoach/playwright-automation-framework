// src/fixtures/priority-board.fixture.ts
// Card fixtures depend on `aiPlaygroundPage` so navigation always happens first.
import { test as base } from './base.fixture';
import { PriorityBoardCard } from '../pages/AIPlaygroundPage/priority-board.page';

type Fixtures = {
  priorityBoardCard: PriorityBoardCard;
};

export const test = base.extend<Fixtures>({
  priorityBoardCard: async ({ page, aiPlaygroundPage: _navigated }, use) => {
    await use(new PriorityBoardCard(page));
  },
});
