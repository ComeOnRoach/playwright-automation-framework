## Locator Strategy
1. Prefer data-testid attributes first
2. Use stable IDs second
3. Use role-based selectors third (getByRole, getByLabel)
4. Never use class names as selectors -- they can change
5. Use XPath only as a last resort - keep expressions short, avoid absolute paths

## Wait Strategy
- Never use page.waitForTimeout() or any fixed delay
- Use Playwright's built-in waiting -- locators and assertions retry automatically
- For slow elements: expect(locator).toBeVisible({ timeout: 30000 }) -- 30s covers worst-case delays
- For state changes: locator.waitFor({ state: 'visible' })
- Never poll manually -- if you're writing a loop to wait, use the right Playwright API

## Assertion Rules
- Always assert visibility: expect(locator).toBeVisible()
- Never assert text or existence alone -- the element may be in the DOM but off-screen
- For success/error states: assert both visibility and meaningful text content
- Avoid weak assertions like toBeEmpty() or toHaveCount() as proof something worked
- Never assert that an element exists in the DOM -- assert what the user actually sees
