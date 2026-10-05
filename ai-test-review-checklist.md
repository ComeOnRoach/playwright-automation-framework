# AI TEST REVIEW CHECKLIST

Run this against every AI-generated test before it ships.

## SELECTORS
- [ ] No class-based selectors on dynamic elements (classes change, IDs and roles don't)
- [ ] No brittle XPath (absolute paths, index-based, or class-dependent)
- [ ] Prefer data-testid, then stable IDs, then roles (getByRole, getByLabel)
- [ ] Every selector verified against the live UI — not guessed from a spec or design doc
- [ ] Spec assumptions verified — specs describe behaviour, not selectors
- [ ] No hardcoded text that could change with copy or translation

## ASSERTIONS
- [ ] Every test asserts what the USER sees, not just what's in the DOM
- [ ] Assert visibility, not just text presence — a hidden element can still contain text
- [ ] Assert the real state, not a cosmetic label (e.g. aria-pressed, not button text)
- [ ] No weak proof — avoid toHaveCount() or toBeEmpty() as evidence something worked
- [ ] Error and empty states are asserted, not just the happy result

## STRUCTURE
- [ ] One outcome per test (setup steps are fine — don't bundle unrelated behaviours)
- [ ] Test name describes the outcome, not the action ("shows error when email invalid", not "test email")
- [ ] No fixed waits (waitForTimeout) — rely on Playwright's auto-waiting
- [ ] Setup and teardown handled properly (beforeEach for navigation, no shared state between tests)
- [ ] Page Objects and helpers used where they exist — no inline selectors duplicated across files
- [ ] Match complexity to the problem — no abstraction the task doesn't need

## COVERAGE
- [ ] Happy path covered
- [ ] Validation and error cases covered (invalid input, empty fields, failed requests)
- [ ] Edge cases covered (boundaries, timeouts, slow networks, race conditions)
- [ ] No gaps the AI silently skipped — if a feature has 4 states, there are 4 tests

## THE ONE QUESTION
- [ ] Would I approve this in a real PR? If you can't say yes, it doesn't ship.
