# Playwright Automation Framework

## Workflow
- Use Playwright CLI; Playwright MCP only when the CLI can't do the task.
- Ask one clarifying question only if the target spec/page is ambiguous; never assume which challenge or file is meant. When the target is clear, state which file you are editing (a statement, not a second question).
- Use Plan mode for any task touching more than 2 files.

## Structure
- UI specs: `tests/e2e/<section>/<challenge>.spec.ts`; API specs: `tests/api/<section>/<challenge>.spec.ts`
- Page Objects: `src/pages/` (challenge cards in `src/pages/<PageFolder>/<challenge>.page.ts`)
- Helpers: `src/helpers/<name>.helper.ts`; fixtures: `src/fixtures/<name>.fixture.ts`; static data: `test-data/<name>.json`
- Relative imports only (no `@/` alias).
- Layer rules: `src/pages/`, `src/fixtures/` and `tests/` each have their own CLAUDE.md (locators, waits, page objects, fixtures, assertions, tags).

## Tests
- Each test is isolated, order-independent and parallel-safe; use unique entities per test.
- Generate data with `@faker-js/faker` or factories. Never hardcode IDs, emails or credentials. JSON in `test-data/` is for static reference data and expected content only.
- No hardcoded values in specs, page objects or fixtures: expected strings, URLs and thresholds live in `test-data/` (or as named constants in the page object).
- Auth: reuse login through `storageState` (see `src/helpers/auth.helper.ts`), not a UI login per test.
- Set up state through the API or storage, then drive only the behaviour under test through the UI.
- Mock third-party calls with `page.route`; don't depend on external services other than the app under test.
- Never use `page.waitForTimeout`; wait on web-first assertions or specific responses.
- Setup and teardown go in fixtures (cleanup after `use()`), not repeated `beforeEach` hooks.
- Wrap tests in `test.describe` (one per challenge/feature). Navigate once in a fixture, never per test.
- Test names describe behaviour: 'shows error when invalid email submitted', not 'test email field'.
- Import `test`/`expect` from `src/fixtures/index.ts`, never from `@playwright/test`.
- No selectors in specs. Check `src/pages`, `src/helpers` and `src/fixtures` for existing code before writing new code; extract anything reusable instead of duplicating it.

## Automation strategy (when analysing stories)
- Unit/integration first for complex calculations and data transformations.
- UI automation only for P0/P1 smoke scenarios and stable core workflows (auth, checkout, search).
- UI tests outside P0/P1 are still allowed; tag them `@regression` (only P0/P1 get `@smoke`).
- Flag as not UI-automatable: third-party captchas, visual layout tweaks, unstable canvas/third-party widgets.

## Config (see `playwright.config.ts`)
- CI: `retries: 2`, `workers: 1`, headless, `forbidOnly`. Local: no retries, parallel workers.
- Evidence: `screenshot: 'only-on-failure'`, `trace: 'retain-on-failure-and-retries'`. Don't override per test without a reason.

## Lint (`npm run lint`, config in `eslint.config.mjs`)
- `eslint-plugin-playwright` and `@typescript-eslint/no-floating-promises` enforce rules like `no-wait-for-timeout`. Run `npm run lint` before committing.
