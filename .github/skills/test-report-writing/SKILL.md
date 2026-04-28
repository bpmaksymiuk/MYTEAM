---
name: test-report-writing
description: 'Write Stage 10 verification evidence in 10-TEST-REPORT.md, including UC/BR coverage, screenshots, results.json output, and PASS/FAIL recommendation.'
argument-hint: 'Describe the verification run or report update to document.'
---

# Test Report Writing

## When to Use
- Create or update `10-TEST-REPORT.md`.
- Write or run Stage 10 verification scripts.
- Record reruns, evidence, and recommendations.
- Update outcomes for executed cases listed in `10-TEST-CASES.md`.

## Target Files
- `10-TEST-REPORT.md`
- `10-TEST-CASES.md`
- `<project>_test_pipeline<NNN>.mjs`
- `testresults/<RUN-ID>/results.json`

## Record Schema

```markdown
## T-PIPELINE-<PROJECT>-<NNN>

**Date:** YYYY-MM-DD
**Pipeline Script:** <project>_test_pipeline<NNN>.mjs
**Build:** ./build/
**Final Result:** ✅ N/M PASS | N FAIL | N PARTIAL | N open bugs

### Run History
### UC Coverage
### Bugs Found
### Exit Gate Checklist
### RECOMMENDATION

---
```

## Procedure
1. Read pipeline instructions.
2. Read current use cases and requirements.
3. Read `10-TEST-CASES.md` and verify each case is ready to execute and traceable to UC/BR IDs.
4. Serve `./build` and run tests with visible browser (`DISPLAY=:0`, `headless:false`).
5. Use Playwright from `/tmp/node_modules/playwright/index.mjs`.
6. Update `10-TEST-CASES.md` with PASS/FAIL/PARTIAL outcomes for each executed case, and capture screenshots and `results.json` for the run.
7. Append a new record to `10-TEST-REPORT.md`.
8. Create/update bug records in `11-BUG-REPORT.md` for every FAIL.
9. Re-run until remaining failures are either fixed or explicitly justified.

## Verification Rules
- Verify UC and BR behavior, not just page loads.
- Keep report history append-only.
- Final recommendation must be explicit.

## Exit Gate
- Every UC has PASS, FAIL, or PARTIAL evidence.
- Every FAIL has a matching bug entry.
- `results.json` exists for the run.
- `10-TEST-CASES.md` has execution outcomes for the run.
- Final verdict is explicit: PASS PIPELINE or FAIL PIPELINE.
