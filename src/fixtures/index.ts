// src/fixtures/index.ts
import { mergeTests } from '@playwright/test';
import { test as section3Test } from './section3.fixture';
import { test as section5Test } from './section5.fixture';
import { test as section6Test } from './section6.fixture';
import { test as priorityBoardTest } from './priority-board.fixture';
import { test as bookingTest } from './booking.fixture';

export const test = mergeTests(section3Test, section5Test, section6Test, priorityBoardTest, bookingTest);

export { expect } from '@playwright/test';
