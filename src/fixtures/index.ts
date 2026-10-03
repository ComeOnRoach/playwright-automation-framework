// src/fixtures/index.ts
import { mergeTests } from '@playwright/test';
import { test as section3Test } from './section3.fixture';
import { test as section5Test } from './section5.fixture';

export const test = mergeTests(section3Test, section5Test);

export { expect } from '@playwright/test';
