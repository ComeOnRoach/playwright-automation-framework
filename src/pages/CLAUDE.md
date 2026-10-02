# Page Object Rules

## Page Object Conventions
- One class per file, named `[Name]Page` / `[Name]Card`, file `[name].page.ts` (kebab-case)
- Constructor takes `Page`; locators are `readonly` fields
- Expose user actions as methods; keep assertions in specs, not in page objects

## Locator Strategy
1. Prefer data-testid attributes first
2. Use stable IDs second
3. Use role-based selectors third (getByRole, getByLabel)
4. Never use class names as selectors -- they can change
5. Use XPath only as a last resort - keep expressions short, avoid absolute paths

## Wait Strategy
- Never use page.waitForTimeout() or any fixed delay
- Use Playwright's built-in waiting -- locators and assertions retry automatically
- For slow elements: expect(locator).toBeVisible({ timeout: 30000 }) -- override the timeout per assertion, not globally
- For state changes: locator.waitFor({ state: 'visible' })
- Never poll manually -- if you're writing a loop to wait, use the right Playwright API

## Assertion Rules
- Assert visibility for anything the user should see: expect(locator).toBeVisible() (use toBeHidden() for absence)
- Never assert text or existence alone -- the element may be in the DOM but off-screen
- For success/error states: assert both visibility and meaningful text content
- Avoid weak assertions like toBeEmpty() or toHaveCount() as proof something worked
- Assert what the user actually sees, not DOM presence
