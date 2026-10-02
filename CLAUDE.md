## Core Rules
- **Use Playwright CLI**. Playwright MCP should be used in rare cases when the task can't be done with Playwright CLI

## Behaviour Rules
- If the request is ambiguous, ask one clarifying question first
- Never assume which challenge or file is meant if unspecified
- Always confirm the target file before making edits
- Use Plan mode for any task touching more than 2 files

## Locator Strategy
See [src/pages/CLAUDE.md](src/pages/CLAUDE.md)

## Wait Strategy
See [src/pages/CLAUDE.md](src/pages/CLAUDE.md)

## Assertion Rules
See [src/pages/CLAUDE.md](src/pages/CLAUDE.md)

## Page Object Rules
See [src/pages/CLAUDE.md](src/pages/CLAUDE.md)

## Fixture Building Rules
See [src/fixtures/CLAUDE.md](src/fixtures/CLAUDE.md)

## Test Structure
- Always wrap tests in a test.describe block
- Never repeat `goto()` in each test: navigate once in a fixture or `test.beforeEach`
- One describe block per challenge or feature
- Test names must describe behaviour, not actions
  Good: 'shows error when invalid email submitted'
  Bad:  'test email field'
- Import `test` and `expect` from the project fixture (e.g. `src/fixtures/playground.fixture.ts`), never directly from `@playwright/test` in spec files

## Project Structure
- **UI Test files**: tests/e2e/[section-name]/[challenge-name].spec.ts
- **API Test files**: tests/api/[section-name]/[challenge-name].spec.ts
- **Page Objects**: src/pages/[page-name].page.ts (challenge cards: src/pages/[PageFolder]/[challenge-name].page.ts)
- **Helpers**: src/helpers/[name].helper.ts
- **Fixtures**: src/fixtures/[name].fixture.ts
- **Test data**: test-data/[name].json
- Use relative imports (no `@/` alias is configured)