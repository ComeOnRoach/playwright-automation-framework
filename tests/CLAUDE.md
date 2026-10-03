<test_tagging_rules>
### 1. Tag Taxonomy (Allowed Values Only)
Every Playwright test MUST include standardized tags. Do not invent custom tags without prior approval.

- **Suite / Frequency Tags (Required — choose at least one):**
  - `@smoke`: Critical happy paths, blocking P0 flows (runs on every PR, fast execution).
  - `@sanity`: Verifies core functionality of specific modules after builds.
  - `@regression`: Full regression test set (runs nightly or pre-release).

- **Layer / Scope Tags (Required — choose one):**
  - `@api`: Direct HTTP/API verification tests.
  - `@ui`: Full end-to-end browser tests using UI interactions.
  - `@visual`: Visual regression or screenshot comparison tests.

- **Feature / Domain Tags (Required):**
  - Format: `@feature:<module_name>` (e.g., `@feature:auth`, `@feature:checkout`, `@feature:billing`).

- **Operational / Health Tags (Optional / Conditional):**
  - `@flaky`: Unstable tests quarantined from blocking CI.
  - `@slow`: Long-running tests requiring custom timeouts.
  - `@wip`: Work-in-progress tests (excluded from default runs).

### 2. Syntax & Placement Standards
- ALWAYS use the modern Playwright `tag` property in test declarations:
  ```typescript
  // CORRECT
  test('User successfully signs in', { 
    tag: ['@smoke', '@ui', '@feature:auth'] 
  }, async ({ page }) => { ... });

  // AVOID (deprecated inline title tags)
  test('User successfully signs in @smoke @ui', async ({ page }) => { ... });