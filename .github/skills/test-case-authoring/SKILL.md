# Test Case Authoring — SKILL.md

> Stage 10 (first half) — write test cases before executing any tests.

---

## When to Use

Invoke at Stage 10 (Tester). Use it when writing Playwright spec files and corresponding TC records that verify every approved use case with observable evidence. Produces `10-TEST-CASES.md` and spec files under `build/tests/specs/`. Upstream inputs: `1-USE-CASES.md`, `6-DESIGN-INSTRUCTIONS.md`, `9-RELEASE-NOTES.md`. Every UC and BR must have at least one test case written before execution begins — writing test cases after testing is a gate violation.

---

## Target Files

- `10-TEST-CASES.md`
- `./build/tests/specs/**`

---

## Record Schema

```
## T-XXX : TEST CASE NAME

- **UC REFERENCE:** UC-IDs this test case covers.
- **BR REFERENCE:** BR-IDs this test case verifies.
- **PRECONDITIONS:** What must be true before this test starts (app state, data, browser state).
- **STEPS:**
  1. Numbered action steps.
  2. Each step is a distinct user or system action.
- **EXPECTED RESULT:** The specific, observable outcome if the system is working correctly.
- **NOTES:** Any known issues, environmental dependencies, or edge cases to watch for.
```

---

## Procedure

1. Read `.github/instructions/pipeline.instructions.md`.
2. Read `1-USE-CASES.md` in full — list all UC-IDs.
3. Read `4-REQUIREMENTS.md` in full — list all BR-IDs.
4. For each UC, write at least one test case covering its primary acceptance criterion.
5. For each BR, write at least one test case that can verify the testable condition.
6. Assign T-IDs sequentially (T-001, T-002, …).
7. Do not begin browser testing until all test cases are written and the exit gate below is PASS.
8. Validate against the exit gate.
9. **Do not declare a stage gate from this sub-step. Continue to Stage 10 execution and declare only `GATE 10: PASS` or `GATE 10: FAIL` at the end of Stage 10.**

---

## Exit Gate

- [ ] Every UC-ID has at least one T record referencing it.
- [ ] Every BR-ID has at least one T record referencing it.
- [ ] Every T record has an EXPECTED RESULT that is independently observable.
- [ ] T-IDs are sequential and non-reused.
- [ ] No test case has steps that are ambiguous or cannot be executed by a human tester.
- [ ] Test cases are written and committed before any execution begins.
- [ ] `PIPELINE-STATUS.md` is updated for Stage 10 with STATUS and STATUS UPDATED date.
