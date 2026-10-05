# Fixture Building Rules

## Core Rules
- Always use `await use(...)`: code before `use` is setup; code after is teardown.
- Explicitly type fixtures: `type Fixtures = { ... }` (test-scoped) and `type WorkerFixtures = { ... }` (worker-scoped).
- Prefer test-scoped. Use `scope: 'worker'` only for expensive, stateless resources (DB seeds, auth tokens).
- Use relative imports (no `@/` alias is configured).

## Structure
- `src/fixtures/base.fixture.ts`: shared root; creates `aiPlaygroundPage` and navigates once.
- `src/fixtures/sectionN.fixture.ts`: one file per section, extends `base.fixture`.
- `src/fixtures/index.ts`: merges all section fixtures with `mergeTests(...)` and re-exports `expect`. It is the only import specs use.
- Adding a section = one new `sectionN.fixture.ts` + one line in `index.ts`.

## Canonical Pattern
See `src/fixtures/section6.fixture.ts`. Card fixtures depend on `aiPlaygroundPage` so navigation always happens first:

```typescript
checkoutCard: async ({ page, aiPlaygroundPage: _navigated }, use) => {
  await use(new CheckoutCard(page));
},
```
