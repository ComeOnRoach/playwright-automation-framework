# Test Rules

## Assertion Rules
- Assert what the user sees: `expect(locator).toBeVisible()` (`toBeHidden()` for absence), not DOM presence.
- For success/error states assert both visibility and meaningful text.
- Text, count and emptiness assertions (`toHaveText`, `toHaveCount`, `toBeEmpty`) are fine when that value is the behaviour under test; never use them alone as proof an action worked.

## Test Design
- One behaviour per test; split rather than chaining unrelated checks.
- Use `test.step('...', async () => { ... })` to label stages of a long flow.
- Soft assertions (`expect.soft`) only for independent facts checked in one view; never for a precondition the rest of the test depends on.
- No `page.waitForTimeout`; rely on web-first assertions.

## Tag Taxonomy
Every test MUST carry tags from this list. Do not invent tags without approval. `@ci` is not allowed.

- **Suite (at least one):**
  - `@smoke`: critical P0 happy paths. This is what CI runs on every PR, so keep it fast.
  - `@sanity`: core functionality of a module after a build.
  - `@regression`: full set, run nightly or pre-release. Use it for every UI test that is not P0/P1; only P0/P1 get `@smoke`.
- **Layer (one):** `@ui` (browser E2E), `@api` (direct HTTP), `@visual` (screenshot comparison).
- **Feature (one):** `@feature:<module-name>` (e.g. `@feature:checkout`, `@feature:local-storage-session`).
- **Optional:** `@flaky` (quarantined from blocking CI), `@slow` (needs a custom timeout).

## Tag Syntax
Use the `tag` option in the test declaration. Tags set on `test.describe` are inherited by its tests.

```typescript
// CORRECT
test('signs in with valid credentials', {
  tag: ['@smoke', '@ui', '@feature:auth'],
}, async ({ page }) => { ... });

// INCORRECT: tag in the title, no layer or feature tag
test('signs in with valid credentials @smoke', async ({ page }) => { ... });
```
