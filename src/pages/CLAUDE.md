# Page Object Rules

## Page Object Conventions
- One class per file, named `[Name]Page` / `[Name]Card`, file `[name].page.ts` (kebab-case).
- Constructor takes `Page`; locators are `readonly` fields.
- Expose Locator properties and user-action methods only. No `expect(...)` in page objects; assertions live in `.spec.ts` files.

## Locator Strategy
Project convention puts `data-testid` first (Playwright's own default is role-first).
1. `data-testid` attributes
2. Stable IDs
3. Role-based (`getByRole`, `getByLabel`)
4. Never class names
5. XPath only as a last resort: short, relative expressions

## Wait Strategy
- Never use `page.waitForTimeout()` or any fixed delay or manual polling loop.
- Rely on auto-waiting locators and web-first assertions; for slow elements override the timeout per assertion (`expect(locator).toBeVisible({ timeout: 30000 })`), not globally.
- For explicit state waits use `locator.waitFor({ state: 'visible' })`.
