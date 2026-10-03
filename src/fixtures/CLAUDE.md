# Fixture Building Rules

## Core Rules
- Always use `await use(...)`: code before `use` is setup; code after is teardown.
- Explicitly type fixtures: `type Fixtures = { ... }` (test-scoped) and `type WorkerFixtures = { ... }` (worker-scoped).
- Prefer test-scoped. Use `scope: 'worker'` only for expensive, stateless resources (DB seeds, auth tokens).
- Spec files import `test`/`expect` from a fixture file, never directly from `@playwright/test`.

## Directory & File Conventions
- Fixtures live in `src/fixtures/[name].fixture.ts` (e.g. `section5.fixture.ts`).
- Group by responsibility; when more than one fixture file exists, add `index.ts` that combines them with `mergeTests(...)`.
- Use relative imports for page objects (no `@/` alias is configured).

## Canonical Pattern
```typescript
// src/fixtures/base.fixture.ts - shared root, navigates once
export const test = base.extend<{ aiPlaygroundPage: AIPlaygroundPage }>({
  aiPlaygroundPage: async ({ page }, use) => {
    const aiPlaygroundPage = new AIPlaygroundPage(page);
    await aiPlaygroundPage.navigate(); // setup
    await use(aiPlaygroundPage);       // handoff
  },
});

// src/fixtures/section5.fixture.ts - one file per section, extends base
import { test as base } from './base.fixture';

type Fixtures = { checkoutCard: CheckoutCard };

export const test = base.extend<Fixtures>({
  // depending on aiPlaygroundPage guarantees navigation happened first
  checkoutCard: async ({ page, aiPlaygroundPage: _navigated }, use) => {
    await use(new CheckoutCard(page));
  },
});

// src/fixtures/index.ts - the only import specs use
export const test = mergeTests(section3Test, section5Test);
export { expect } from '@playwright/test';
```
Adding a section = one new `sectionN.fixture.ts` + one line in `index.ts`.
