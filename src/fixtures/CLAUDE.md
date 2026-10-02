# Fixture Building Rules

## Core Rules
- Always use `await use(...)`: code before `use` is setup; code after is teardown.
- Explicitly type fixtures: `type Fixtures = { ... }` (test-scoped) and `type WorkerFixtures = { ... }` (worker-scoped).
- Prefer test-scoped. Use `scope: 'worker'` only for expensive, stateless resources (DB seeds, auth tokens).
- Spec files import `test`/`expect` from a fixture file, never directly from `@playwright/test`.

## Directory & File Conventions
- Fixtures live in `src/fixtures/[name].fixture.ts` (e.g. `playground.fixture.ts`).
- Group by responsibility; when more than one fixture file exists, add `index.ts` that combines them with `mergeTests(...)`.
- Use relative imports for page objects (no `@/` alias is configured).

## Canonical Pattern
```typescript
// src/fixtures/playground.fixture.ts
import { test as base } from '@playwright/test';
import { AIPlaygroundPage } from '../pages/ai-playground.page';
import { FlakyLoaderCard } from '../pages/AIPlaygroundPage/flaky-loader.page';

type Fixtures = {
  aiPlaygroundPage: AIPlaygroundPage;
  flakyLoaderCard: FlakyLoaderCard;
};

export const test = base.extend<Fixtures>({
  aiPlaygroundPage: async ({ page }, use) => {
    const aiPlaygroundPage = new AIPlaygroundPage(page);
    await aiPlaygroundPage.navigate(); // setup
    await use(aiPlaygroundPage);       // handoff
    // teardown (if needed)
  },

  flakyLoaderCard: async ({ page, aiPlaygroundPage }, use) => {
    // depending on aiPlaygroundPage guarantees navigation happened first
    await use(new FlakyLoaderCard(page));
  },
});

export { expect } from '@playwright/test';
```
