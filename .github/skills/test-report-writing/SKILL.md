---
name: test-report-writing
description: 'Write 6-TEST-REPORT.md and Stage 6 verification evidence. Use for Playwright pipeline runs, run history, UC coverage tables, screenshot evidence, results.json output, PASS or FAIL recommendations, and verification against every BR and UC.'
argument-hint: 'Describe the pipeline verification run or test-report update.'
---

# Test Report Writing

## When to Use
- Creating or updating PROJECTS/**/6-TEST-REPORT.md
- Writing a Stage 6 pipeline test script and verification report
- Recording reruns, screenshots, PASS or FAIL outcomes, and open bugs

## Target File
- 6-TEST-REPORT.md
- Updated append-only, one record per verification cycle

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
1. Read the canonical pipeline file first.
2. Read the report schema and the bug-report schema before writing.
3. Write a Playwright pipeline script (`<project>_test_pipeline<NNN>.mjs`) in the project folder that runs all UCs in order and captures screenshots and evidence for every PASS, FAIL, or PARTIAL result.
4. Serve ./build, run the script with `DISPLAY=:0` and `headless: false`, and capture results in the report.
5. Append a new test-report record with run history, UC coverage, bugs, and recommendation.
6. Record every FAIL in 7-BUG-REPORT.md.
7. For every bug found, hand off to `(Developer)` to apply the fix and append a micro-version entry to `5-RELEASE-NOTES.md`, then return to `(Tester)` to re-run. Repeat until 0 FAILs remain.
8. Iterate until all fixable FAILs are fixed or the only remaining partials are justified by external runtime limits.

## Verification Rules
- Use Playwright 1.59.1 from /tmp/node_modules/playwright/index.mjs.
- Run with a visible browser: headless false and DISPLAY=:0.
- One screenshot per UC result is required.
- Validate BR acceptance criteria, not just happy-path navigation.

## Exit Gate
- Every UC has PASS, FAIL, or PARTIAL with evidence.
- Every FAIL has a bug entry.
- results.json exists.
- Final recommendation is explicit PASS PIPELINE or FAIL PIPELINE.
- Final verdict declared: **PASS PIPELINE** or **FAIL PIPELINE**.
