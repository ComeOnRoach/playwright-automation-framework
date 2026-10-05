# Test Rules

## Assertion Rules
- Assert what the user sees: `expect(locator).toBeVisible()` (`toBeHidden()` for absence), not DOM presence.
- For stateful controls, visible is not enough: also assert the underlying state (see Review Standards).
- For success/error states assert both visibility and meaningful text.
- Text, count and emptiness assertions (`toHaveText`, `toHaveCount`, `toBeEmpty`) are fine when that value is the behaviour under test; never use them alone as proof an action worked.

## Test Design
- One behaviour per test; split rather than chaining unrelated checks. Several `expect`s are fine if they all prove the same outcome.
- Use `test.step('...', async () => { ... })` to label stages of a long flow.
- Soft assertions (`expect.soft`) only for independent facts checked in one view; never for a precondition the rest of the test depends on.
- No `page.waitForTimeout`; rely on web-first assertions.

## Review Standards
- **Cover every state, not just the happy path**
  - Each feature gets its happy path plus at least one negative or error case.
  - For multi-state components (toggle, status, priority), write one test per state; drive variants from `test-data/`.
- **Verify selectors on the live page**
  - Inspect the real page with `playwright-cli` (snapshot) before writing a locator; never infer one from a spec or design doc.
  - Follow the locator priority in `src/pages/CLAUDE.md`.
- **Assert the state the user depends on, not its presentation**
  - Use `toHaveAttribute('aria-pressed' | 'aria-expanded', ...)`, `toBeChecked`, `toHaveValue`, `toHaveURL`, or stored/API state. Don't rely on button text or CSS classes.
  - Assert visible text only when the text itself is the requirement; the expected string lives in `test-data/`.
- **Keep it simple**
  - Reuse existing page objects and helpers first; add a new abstraction only when a second spec needs it.

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
