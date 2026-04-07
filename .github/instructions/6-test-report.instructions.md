---
applyTo: "PROJECTS/**/6-TEST-REPORT.md"
---

# How To Write Test Reports

## Purpose

Test reports document the results of pipeline testing: which UCs passed/failed, what evidence was captured, what bugs were found, and whether the build is release-ready.

## File

**File:** `6-TEST-REPORT.md`  
**Owner:** Tester (Stage 6)  
**Updated:** Append-only; one record per test cycle. Never overwrite prior runs.

### Record Schema

```markdown
## T-PIPELINE-<PROJECT>-<NNN>

**Date:** YYYY-MM-DD
**Pipeline Script:** <project>_test_pipeline<NNN>.mjs
**Build:** ./build/
**Final Result:** ✅ N/M PASS | N FAIL | N PARTIAL | N open bugs

### Run History

| Run | Date | Result | Notes |
|-----|------|--------|-------|
| Run 1 | YYYY-MM-DD | ❌ X/10 | Bug: enter/tab double-process |
| Run 2 | YYYY-MM-DD | ❌ X/10 | Bug: dependent cell DOM stale |
| Run N | YYYY-MM-DD | ✅ 10/10 | All FAILs fixed |

### UC Coverage

| UC | Title | BRs Covered | Result | Screenshot |
|----|-------|-------------|--------|------------|
| UC-001 | ... | BR-001, BR-002 | ✅ PASS | <filename>.png |
| UC-009 | ... | BR-031, BR-032 | ⚠️ PARTIAL | <filename>.png |

### Bugs Found

| ID | Severity | Description | Status |
|----|----------|-------------|--------|
| BUG-<PROJECTABBR>-001 | High | ... | ✅ Fixed |
| BUG-<PROJECTABBR>-002 | Medium | ... | ✅ Fixed |

### Exit Gate Checklist

| Gate | Status |
|------|--------|
| All UCs tested | ✅ |
| 0 open FAIL results | ✅ |
| results.json written | ✅ |
| Design requirements covered | ✅ |

### RECOMMENDATION

**PASS PIPELINE** — All gates satisfied. Release ready.

---
```

### Field Guidance

**Date:** Test run date (YYYY-MM-DD).

**Pipeline Script:** Name of the Playwright test script used (e.g., `<project>_test_pipeline001.mjs`).

**Build:** Path to build being tested (always `./build/`).

**Final Result:** Summary of pass/fail counts:
- `✅ N/M PASS` — N out of M UCs passed
- `N FAIL` — number of failed UCs (must be 0 at end)
- `N PARTIAL` — number of partial UCs (only acceptable if externally required, e.g., chrome API)
- `N open bugs` — number of unfixed bugs (must be 0 at end)

**Run History Table:** Record every test run attempt, not just the final successful one. Shows iterative debugging process:
- Run 1: Initial pipeline attempt, identifies bugs
- Run 2: After fix 1, still failing
- Run N: Final run, all bugs fixed, all tests pass

**UC Coverage Table:** One row per UC, showing:
- UC ID and title
- Which BRs it covers
- Result: ✅ PASS, ❌ FAIL, or ⚠️ PARTIAL with reason
- Screenshot filename as evidence

**Bugs Found Table:** One row per bug discovered:
- BUG ID (format: `BUG-<PROJECTABBR>-NNN`)
- Severity: CRITICAL / HIGH / MEDIUM / LOW
- Brief description
- Status: ✅ Fixed / ❌ Open

**Exit Gate Checklist:** Verification that all required gates passed:
- All UCs tested (no missing results)
- 0 open FAIL results (all FAILs either fixed or marked PARTIAL)
- results.json written
- All High-priority BR IDs have evidence

**RECOMMENDATION:** Final verdict:
- `**PASS PIPELINE** — [reason]` — All gates satisfied, build is release-ready
- `**FAIL PIPELINE** — [reason]` — Unresolved issues prevent release

### Processing Guidance

1. **Append a new T-PIPELINE-XXX record** for every verification cycle (including retries).
2. **Never overwrite or delete prior test runs** — this file is append-only.
3. **Include Run History table** to show iterative debugging and how many attempts it took to pass.
4. **All High-priority BR IDs must have screenshot evidence.**
5. **Record a defect entry** in `7-BUG-REPORT.md` for every FAIL result.
6. **PARTIAL results are only acceptable for external dependencies:**
   - Chrome extension APIs that require real extension install
   - Native OS features (clipboard, file dialogs, window management)
   - Document the reason in the UC Coverage table
7. **Final recommendation must be explicit:** `PASS PIPELINE` or `FAIL PIPELINE`.

### Tester Responsibility

Verify all behavior against Use Cases and Business Requirements. Run browser tests with visible browser window. Fix bugs iteratively until all FAILs are resolved or marked PARTIAL with external justification.

#### Pipeline Script Rules

Write a Playwright test script as `.mjs` file:
- **Location:** `PROJECTS/<APP>/<abbr>_test_pipeline<NNN>.mjs` (in project folder, not /tmp)
- **Execution:** `DISPLAY=:0 node <script>.mjs 2>&1`
- **Playwright:** Import from `/tmp/node_modules/playwright/index.mjs` (install if absent: `cd /tmp && npm install playwright@1.59.1`)

Script structure:
- Serve `./build` via `python3 -m http.server <PORT> --directory ./build` (background)
- Run all UCs sequentially
- Emit ✓/✗ prefixed lines per result
- Capture named screenshots
- Write `testresults/T-PIPELINE-<PROJECT>-<NNN>/results.json`
- Print summary: `T-PIPELINE-XXX — N/M PASS | N FAIL | N PARTIAL | N bug(s)`
- Exit code 0 if PASS, 1 if any FAIL

#### Browser Test Execution Protocol

**MANDATORY:** Always run tests with visible browser window (never headless):

```js
import pkg from '/tmp/node_modules/playwright/index.mjs';
const { chromium } = pkg;

const browser = await chromium.launch({
  headless: false,   // REQUIRED — user must see tests running
  slowMo: 250,
  args: ['--no-sandbox', '--start-maximized'],
});
```

#### Screenshot Policy

Save all screenshots to `testresults/T-PIPELINE-<PROJECT>-<NNN>/` inside the project folder:
- Naming: `<project>_shot_<NNN>_<UCID>_<label>.png`
- One screenshot per UC result (required evidence)

#### Test Script Generation Rules

1. **Cover every UC** — one test block per UC in order (UC-001 → UC-NNN)
2. **Complete UC flows** — interact through ALL steps and dialogs in the use case
3. **Real selectors** — read `./build` source to find actual button text, class names, IDs
4. **Map results** — every test result must link to UC-XXX and BR-XXX in report
5. **No waitForFileChooser()** — not available in Playwright 1.59.1; use `page.setInputFiles()` directly
6. **Cell UIs** — never use `page.keyboard.type()` (can double-insert); use dblclick + `page.fill()` + Enter
7. **Cover every BR** — each business requirement (BR-001 → BR-NNN) must have test coverage that validates its acceptance criteria
8. **Validate all requirements** — for every BR exercised by a UC test, verify that the test demonstrates the requirement is satisfied (all acceptance criteria met)

#### Chrome Extension Testing

Extensions with `chrome.*` APIs cannot be fully tested via HTTP serve:
1. If main app script has **no** `chrome.*` calls → HTTP serve is sufficient (no mock needed)
2. If UC depends on `chrome.*` API → mark **PARTIAL** with reason: `"Requires real extension install for full verification"`
3. Never mock `chrome.*` via `page.evaluate()` unless team explicitly approves

#### Iterative Test/Fix Loop

1. Write pipeline script
2. Run it; capture results
3. For each fixable FAIL in `./build`:
   - Assign bug ID: `BUG-<PROJECTABBR>-<NNN>`
   - Fix the bug in `./build`
   - Re-run pipeline
4. Repeat until no FAILs remain or all remaining FAILs are confirmed PARTIAL
5. Record every run in `6-TEST-REPORT.md` Run History table

**Only FAILs requiring external runtime** (real extension install, native OS feature) are acceptable as PARTIAL. All others must be fixed.

#### Test Report Quality Bar

- All High-priority BR IDs have screenshot evidence
- Defects recorded for every FAIL
- Final recommendation explicit: PASS PIPELINE or FAIL PIPELINE

### Exit Gate (Stage 6)

- Every UC has a PASS, FAIL, or PARTIAL result with screenshot evidence.
- Every FAIL has a corresponding defect in `7-BUG-REPORT.md`.
- All fixable bugs are fixed and confirmed by pipeline re-run.
- results.json file exists at `testresults/T-PIPELINE-XXX/results.json`.
- Final recommendation is explicit: **PASS PIPELINE** or **FAIL PIPELINE**.
- 0 open FAILs (all either fixed or marked PARTIAL with documented reason).
