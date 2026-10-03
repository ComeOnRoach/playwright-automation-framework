# Page Object Rules

## Page Object Conventions
- One class per file, named `[Name]Page` / `[Name]Card`, file `[name].page.ts` (kebab-case)
- Constructor takes `Page`; locators are `readonly` fields
- Expose user actions as methods; keep assertions in specs, not in page objects
- Keep Page Objects assertion-free by exposing only Locator properties and action methods. All expect(...) assertions must reside directly in .spec.ts files.

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