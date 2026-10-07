# Booking Flow Test Plan — WDU Kitchen
App: https://webdriveruniversity.com/Restaurant-Booking/ (client-only, in-memory state; tests are isolated and parallel-safe, no shared data)
Priority: P0 = smoke, P1 = core, P2 = regression.
Tags: all P0 -> `@smoke`; P1 -> `@regression`, except rows marked `(smoke)` which also get `@smoke`; P2 -> `@regression`. Keep the smoke suite small.
`[BUG]` = known app defect: automate with `test.fail()` + annotation (asserting the correct behaviour), never assert the buggy behaviour as correct.
`[DATA]` = data-driven: one parametrised test looping over rows in `test-data/booking.json`.
`[LOGIC]` = pure logic: verify with a table-driven test on the date helper (no UI per case); UI covers only 1-2 representative dates.
Mocking: confirm call mocked with `page.route('**/api/mock/reservations', ...)`. Dates computed relative to today via a helper using `page.clock.install` where a fixed date is needed (never hardcoded). No third-party calls exist.
Exit criteria: all P0 and P1 pass on CI (retries: 2, workers: 1); `[BUG]` tests are expected-fail.

## Step 1 — Party & table type
- [x] TC-101 P0 Select party 2 + Standard -> deposit shows "Free", Next goes to Step 2
- [x] TC-102 P1 (smoke) Deposit label updates immediately on selecting each type (Free / £20 / £50) [DATA]
- [x] TC-103 P1 Switching type moves `selected` to the new card only
- [x] TC-104 P1 [DATA] Missing selection -> "Please select party size and booking type." for: nothing selected / only party size / only type
- [x] TC-105 P1 [DATA] Invalid combos: Standard + 7 / 10 -> "Standard tables seat up to 6..."; Group + 6 / 1 -> "Group Booking is for parties of 7 or more..."; Private + 1 -> "Private Dining requires at least 2 guests."
- [x] TC-106 P2 [DATA] Boundaries valid: Standard 6, Group 7, Group 10, Private 2, Private 10
- [x] TC-107 P2 Party dropdown has exactly 1–10 and the placeholder is not selectable
- [x] TC-108 P2 Error clears on next valid attempt
- [x] TC-109 P2 Rapid repeated Next clicks advance only one step

## Step 2 — Date & time
Happy path
- [x] TC-201 P0 Pick a future available date + available slot -> Step 3
- [x] TC-202 P1 Selected date shows in input and "Selected: YYYY-MM-DD" label
- [x] TC-203 P1 Back returns to Step 1 with party/type preserved
Validation
- [x] TC-204 P1 Next with no date -> "Enter a valid date (YYYY-MM-DD)."
- [x] TC-205 P1 Date chosen, no slot -> "Choose a date and an available time."
- [x] TC-206 P2 Date input is readonly (typing impossible)
Date edge cases
- [x] TC-207 P1 Past days disabled (yesterday, earlier days this month)
- [x] TC-208 P1 Today is selectable (boundary: strictly-before-today is past)
- [x] TC-209 P1 [LOGIC] Computed fully-booked days (2/month) are disabled with `.booked`; UI checks one booked day
- [x] TC-210 P2 Prev/Next month navigation, label correct; December -> January year rollover (fixed clock)
- [x] TC-211 P2 Selection survives paging away and back; label still shows selected date
- [x] TC-212 P2 [LOGIC] Leap day (29 Feb) and month ends (28/30/31) render correct day counts (fixed clock)
- [x] TC-213 P2 Re-opening Step 2 after Back opens on the selected date's month
- [x] TC-214 P2 Selecting a date in a different month, then Back/forward keeps the date and its availability consistent
Time-slot edge cases
- [x] TC-215 P0 All 5 slots disabled before a date is chosen
- [x] TC-216 P1 7:00 PM always disabled/booked on every date
- [x] TC-217 P1 [LOGIC] Exactly one of 5/6/8/9 PM booked per date = `day % 4` (0->5PM, 1->6PM, 2->8PM, 3->9PM); table covers days 1,2,3,4 and 28-31; UI checks 1-2 dates
- [x] TC-218 P1 Same date always yields identical availability (deterministic)
- [x] TC-219 P1 Selecting a slot, then a date where it is booked -> selection dropped, Next shows time error
- [x] TC-220 P2 Selecting a new slot deselects the previous one (single selection)
- [x] TC-221 P2 Clicking a disabled slot does nothing

## Step 3 — Your details
Happy path
- [x] TC-301 P0 Faker name (2 words), valid email, `07xxxxxxxxx` -> Step 4
- [x] TC-302 P1 Phone `+44` + 10 digits accepted; spaces inside phone accepted and stripped
Validation (each: error on blur AND on Next; Next blocked) — all [DATA]
- [x] TC-303 P1 Name: empty, one word, whitespace only -> "Full name required (first and last)."
- [x] TC-304 P2 Name: 3+ words, leading/trailing spaces accepted (trimmed)
- [x] TC-305 P1 Email: empty, no `@`, no domain dot, spaces, `a@b` -> "Valid email required."
- [x] TC-306 P2 Email: `a@b.c` accepted (permissive regex — document in test-data comment)
- [x] TC-307 P1 Phone: empty, letters, 10 digits, 12 digits, `+1...`, `+44` + 9 digits, `0044...` -> "Valid UK phone number required."
- [x] TC-308 P1 Multiple invalid fields -> all three errors shown together
- [x] TC-309 P1 Error clears once field corrected and re-validated
- [x] TC-310 P2 [BUG] Back from Step 3 does NOT clear error spans (stale errors visible on return) — `test.fail()` expecting errors cleared
- [x] TC-311 P2 Field values preserved after Back

## Step 4 — Review & confirm
Review
- [x] TC-401 P0 Review shows party ("N guests"), type, deposit, "date at time", name, email, phone matching inputs
- [x] TC-402 P1 Phone shown with whitespace stripped; name/email trimmed
- [x] TC-403 P1 Back returns to Step 3 with data preserved; edits propagate to review
Confirm call (mock `POST /api/mock/reservations`; assert request via `page.waitForRequest` / `route.request().postDataJSON()`)
- [x] TC-404 P0 Success (201/200): loading shown, success screen with party/type/date-time/name and ref
- [x] TC-405 P0 Request: method POST, `Content-Type: application/json`, body = `{partySize,bookingType,date,time,name,email,phone}` with values from Steps 1–3 (partySize is a string; bookingType is the display name; time is label e.g. "6:00 PM")
- [x] TC-406 P1 Payload normalisation: name with extra spaces is trimmed, phone sent without whitespace
- [x] TC-407 P1 Reference matches `/^WDU-\d{6}$/` (never assert exact value — client-generated)
- [x] TC-408 P1 (smoke) [DATA] Failure 500 / 503: loading hidden, "Something went wrong. Please try again.", stays on Step 4, Confirm re-enabled, data intact
- [x] TC-409 P1 Retry after 500 then 200 -> success
- [x] TC-410 P1 (smoke) Double-click Confirm -> exactly one request (in-flight guard + button disabled)
- [x] TC-411 P1 Button disabled and spinner visible while request pending (delayed mock)
- [x] TC-412 P2 [BUG] Non-5xx treated as success: 400/404/422 and network abort -> currently success screen; `test.fail()` expecting an error
- [x] TC-413 P2 [BUG] Slow response >2.5s -> aborted -> success screen (timeout path); drive with `page.clock` fast-forward or a never-fulfilled route, no real wait
- [x] TC-414 P2 Error cleared when retrying

## Post-booking
- [x] TC-501 P1 (smoke) "Make Another Reservation" resets: Step 1, empty party/date/name/email/phone, no selected type/slot/day, deposit "—", errors hidden, all slots disabled
- [x] TC-502 P2 Second full booking after restart succeeds with a new reference
- [x] TC-503 P2 Reload mid-flow returns to Step 1 (no persistence)
- [ ] TC-504 P2 Browser Back button mid-flow leaves/does not corrupt the flow (document actual behaviour first)

## Cross-cutting
- [ ] TC-601 P2 Step indicator dots highlight the current step (1–4)
- [ ] TC-602 P2 Full flow via keyboard only (Tab/Enter/Space)
- [ ] TC-603 P2 Full flow stays correct at mobile viewport
- [ ] TC-604 P2 Accessibility: inputs have labels/roles, errors announced (`aria-live`) — scope after inspecting the app; page objects use role-based locators where possible

## Out of scope / not UI-automatable
Visual styling of calendar/cards; real backend persistence (endpoint is mock-only on live host). No third-party services are called.

## Implementation notes (when automating)
- Page objects in `src/pages/RestaurantBooking/`; data in `test-data/booking.json` (error strings, slot labels, deposits, invalid-input tables); dates via a helper (next available non-booked day computed with the app's formulas, fixed clock for month-end/leap/December cases).
- Specs split per step under `tests/e2e/restaurant-booking/`: `step1-party.spec.ts`, `step2-datetime.spec.ts`, `step3-details.spec.ts`, `step4-confirm.spec.ts`, `post-booking.spec.ts` (one `test.describe` each; happy path stays in `booking-happy-path.spec.ts`). [LOGIC] tables live in `tests/unit/booking-logic.spec.ts`.
- A `booking` fixture navigates once and exposes page objects plus helpers that fast-forward through earlier steps (state is in-memory, so it cannot be restored via storage/API).
- Per project rules: faker for names/emails/phones, `page.route` for confirm, no `waitForTimeout`, imports from `src/fixtures/index.ts`.
