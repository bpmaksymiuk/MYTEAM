---
name: test-case-authoring
description: 'Create or update 10-TEST-CASES.md before Stage 10 execution, with UC/BR-traceable test cases and run-ready expected outcomes.'
argument-hint: 'Describe the test planning scope or the Stage 10 run to prepare.'
---

# Test Case Authoring

## When to Use
- Creating a new Stage 10 test plan before execution.
- Updating test coverage after use case or requirement changes.
- Preparing reruns that need revised or additional test cases.

## Target File
- `10-TEST-CASES.md`

## Record Schema

```markdown
## TC-<PROJECT>-<NNN> — <Short Test Name>

- **UC:** UC-XXX
- **BR:** BR-XXX[, BR-YYY]
- **Preconditions:** <required state/setup>
- **Steps:**
  1. <action>
  2. <action>
- **Expected Result:** <observable, testable outcome>
- **Run Result:** NOT RUN | PASS | FAIL | PARTIAL
- **Evidence:** <screenshot path(s), logs, or results.json key>
- **Notes:** <optional>

---
```

## Procedure
1. Read pipeline instructions and approved Stage 1 use cases.
2. Read current requirements and identify testable behaviors.
3. Create or update `10-TEST-CASES.md` before running tests.
4. Map each case to at least one UC and one BR identifier.
5. Ensure steps and expected result are specific and observable.
6. Set initial `Run Result` to `NOT RUN` for new or reset cases.
7. Keep case IDs stable across reruns; append or revise only when scope changes.

## Quality Rules
- Do not write superficial checks such as page-load-only tests.
- One case should verify one clear behavior, with explicit pass/fail criteria.
- Use deterministic wording so another tester can execute without interpretation.
- Check things like element presence, text content, and interaction results, not just "it works" to validate correctness. 

## Exit Gate
- `10-TEST-CASES.md` exists before test execution.
- Every in-scope UC maps to one or more test cases.
- Every test case maps to at least one BR.
- All cases are run-ready with clear expected results.
