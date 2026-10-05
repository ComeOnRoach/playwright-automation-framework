# Booking Flow Test Plan — WDU Kitchen
App: https://webdriveruniversity.com/Restaurant-Booking/ (client-only, in-memory state)
Priority: P0 = smoke, P1 = core, P2 = regression. Tags: P0/P1 -> `@smoke`, rest -> `@regression`.
Mocking: confirm call mocked with `page.route('**/api/mock/reservations', ...)`. Dates computed relative to today (never hardcoded).

## Step 1 — Party & table type
- [ ] P0 Select party 2 + Standard -> deposit shows "Free", Next goes to Step 2
- [ ] P1 Deposit label updates immediately on selecting each type (Free / £20 / £50)
- [ ] P1 Switching type moves `selected` to the new card only
- [ ] P1 Nothing selected -> "Please select party size and booking type."
- [ ] P1 Only party size, no type -> same error; only type, no party -> same error
- [ ] P1 Standard + party 7 / 10 -> "Standard tables seat up to 6..."
- [ ] P1 Group + party 6 / 1 -> "Group Booking is for parties of 7 or more..."
- [ ] P1 Private + party 1 -> "Private Dining requires at least 2 guests."
- [ ] P2 Boundaries valid: Standard 6, Group 7, Group 10, Private 2, Private 10
- [ ] P2 Party dropdown has exactly 1–10 and the placeholder is not selectable
- [ ] P2 Error clears on next valid attempt

## Step 2 — Date & time
Happy path
- [ ] P0 Pick a future available date + available slot -> Step 3
- [ ] P1 Selected date shows in input and "Selected: YYYY-MM-DD" label
- [ ] P1 Back returns to Step 1 with party/type preserved
Validation
- [ ] P1 Next with no date -> "Enter a valid date (YYYY-MM-DD)."
- [ ] P1 Date chosen, no slot -> "Choose a date and an available time."
- [ ] P2 Date input is readonly (typing impossible)
Date edge cases
- [ ] P1 Past days disabled (yesterday, earlier days this month)
- [ ] P1 Today is selectable (boundary: strictly-before-today is past)
- [ ] P1 Computed fully-booked days (2/month) are disabled with `.booked`
- [ ] P2 Prev/Next month navigation, December -> January year rollover, label correct
- [ ] P2 Selection survives paging away and back; label still shows selected date
- [ ] P2 Leap day (29 Feb) and month ends (28/30/31) render correct day counts
- [ ] P2 Re-opening Step 2 after Back opens on the selected date's month
Time-slot edge cases
- [ ] P0 All 5 slots disabled before a date is chosen
- [ ] P1 7:00 PM always disabled/booked on every date
- [ ] P1 Exactly one of 5/6/8/9 PM booked per date = `day % 4` (0->5PM, 1->6PM, 2->8PM, 3->9PM); verify days 1,2,3,4 and 28-31
- [ ] P1 Same date always yields identical availability (deterministic)
- [ ] P1 Selecting a slot, then a date where it is booked -> selection dropped, Next shows time error
- [ ] P2 Selecting a new slot deselects the previous one (single selection)
- [ ] P2 Clicking a disabled slot does nothing

## Step 3 — Your details
Happy path
- [ ] P0 Faker name (2 words), valid email, `07xxxxxxxxx` -> Step 4
- [ ] P1 Phone `+44` + 10 digits accepted; spaces inside phone accepted and stripped
Validation (each: error on blur AND on Next; Next blocked)
- [ ] P1 Name: empty, one word, whitespace only -> "Full name required (first and last)."
- [ ] P2 Name: 3+ words, leading/trailing spaces accepted (trimmed)
- [ ] P1 Email: empty, no `@`, no domain dot, spaces, `a@b` -> "Valid email required."
- [ ] P2 Email: `a@b.c` accepted (permissive regex — document)
- [ ] P1 Phone: empty, letters, 10 digits, 12 digits, `+1...`, `+44` + 9 digits, `0044...` -> "Valid UK phone number required."
- [ ] P1 Multiple invalid fields -> all three errors shown together
- [ ] P1 Error clears once field corrected and re-validated
- [ ] P2 Known bug: Back from Step 3 does NOT clear error spans (stale errors visible on return) — `test.fail`/annotated
- [ ] P2 Field values preserved after Back

## Step 4 — Review & confirm
Review
- [ ] P0 Review shows party ("N guests"), type, deposit, "date at time", name, email, phone matching inputs
- [ ] P1 Phone shown with whitespace stripped; name/email trimmed
- [ ] P1 Back returns to Step 3 with data preserved; edits propagate to review
Confirm call (mock `POST /api/mock/reservations`)
- [ ] P0 Success (201/200): loading shown, success screen with party/type/date-time/name and ref
- [ ] P0 Request: method POST, `Content-Type: application/json`, body = `{partySize,bookingType,date,time,name,email,phone}` with values from Steps 1–3 (partySize is a string; bookingType is the display name; time is label e.g. "6:00 PM")
- [ ] P1 Reference matches `/^WDU-\d{6}$/` (never assert exact value — client-generated)
- [ ] P1 Failure 500 (and 503): loading hidden, "Something went wrong. Please try again.", stays on Step 4, Confirm re-enabled, data intact
- [ ] P1 Retry after 500 then 200 -> success
- [ ] P1 Double-click Confirm -> exactly one request (in-flight guard + button disabled)
- [ ] P1 Button disabled and spinner visible while request pending (delayed mock)
- [ ] P2 Non-5xx treated as success: 400/404/422 and network abort -> success screen (document as known behaviour/bug)
- [ ] P2 Slow response >2.5s -> aborted -> success screen (timeout path)
- [ ] P2 Error cleared when retrying

## Post-booking
- [ ] P1 "Make Another Reservation" resets: Step 1, empty party/date/name/email/phone, no selected type/slot/day, deposit "—", errors hidden, all slots disabled
- [ ] P2 Second full booking after restart succeeds with a new reference
- [ ] P2 Reload mid-flow returns to Step 1 (no persistence)

## Cross-cutting
- [ ] P2 Step indicator dots highlight the current step (1–4)
- [ ] P2 Full flow via keyboard only (Tab/Enter/Space)
- [ ] P2 Full flow stays correct at mobile viewport

## Out of scope / not UI-automatable
Visual styling of calendar/cards; real backend persistence (endpoint is mock-only on live host).

## Implementation notes (when automating)
- Page objects in `src/pages/RestaurantBooking/`, spec `tests/e2e/restaurant-booking/booking.spec.ts`, data in `test-data/booking.json` (error strings, slot labels, deposits); dates via a helper (next available non-booked day computed with the app's formulas).
- Per project rules: faker for names/emails/phones, `page.route` for confirm, no `waitForTimeout`, imports from `src/fixtures/index.ts`.
