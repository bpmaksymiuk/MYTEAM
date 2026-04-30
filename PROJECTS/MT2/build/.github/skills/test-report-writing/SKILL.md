# Test Report Writing — SKILL.md

> Stage 10 (second half) — execute test cases, record evidence, issue release recommendation.

---

## When to Use

After `10-TEST-CASES.md` is complete and the test case exit gate has passed. Execute each test case in a visible browser, capture screenshots as evidence, and write the report. Do not use headless execution — observable evidence is required.

---

## Target Files

- `10-TEST-REPORT.md`

---

## Report Structure

```markdown
# T-PIPELINE-<APP>-<NNN> — Test Report

- **Run ID:** T-PIPELINE-<APP>-<NNN>
- **Date:** YYYY-MM-DD
- **Product:** <product name>
- **Build Path:** ./build/

## Results

| T-ID | Description | Result | Evidence |
|------|-------------|--------|----------|
| T-001 | Test case name | PASS / FAIL | Screenshot filename or inline note |

## Summary

- **Total:** N
- **Pass:** N
- **Fail:** N

## Recommendation

**PASS** / **FAIL** / **CONDITIONAL PASS**

> Justification: one paragraph explaining the recommendation based on the results above.

## Evidence

### T-XXX — [brief title]
[Screenshot or output snippet. For FAIL: include exact error message or observed behaviour.]
```

---

## Procedure

1. Read `.github/instructions/pipeline.instructions.md`.
2. Read `10-TEST-CASES.md` in full.
3. Open the product in a **visible browser** using `open_browser_page`.
4. Execute each test case in T-ID order:
   a. Follow the STEPS exactly as written.
   b. Record the actual result (PASS or FAIL).
   c. Capture a screenshot using `screenshot_page` as evidence.
   d. For FAIL: record the exact observed behaviour vs the expected result.
5. Populate the Results table and Summary counts.
6. Write the Recommendation with a clear justification:
   - **PASS:** All test cases passed.
   - **FAIL:** One or more critical test cases failed.
   - **CONDITIONAL PASS:** Minor failures noted; recommend fix before next release.
7. Attach evidence for every FAIL entry.
8. Assign a unique Run ID: `T-PIPELINE-<APP>-<NNN>` (increment NNN from prior runs).
9. Append the report below any prior test reports — do not overwrite.
10. Validate against the exit gate.

---

## Exit Gate

- [ ] All test cases in `10-TEST-CASES.md` have been executed.
- [ ] Every T-ID appears in the Results table.
- [ ] Every FAIL entry has concrete evidence (screenshot or error log excerpt).
- [ ] A Recommendation (PASS / FAIL / CONDITIONAL PASS) has been issued with written justification.
- [ ] A unique Run ID has been assigned.
- [ ] No prior test report entries have been modified or deleted.
