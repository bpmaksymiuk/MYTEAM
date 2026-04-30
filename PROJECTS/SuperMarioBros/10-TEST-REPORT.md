# Test Report

## T-PIPELINE-SMB-002

**Date:** 2026-04-28
**Pipeline Script:** supermariobros_test_pipeline002.mjs
**Build:** ./build/
**Final Result:** 11/11 PASS | 0 FAIL | 0 PARTIAL | 0 open bugs

### Run History

- Developer remediation applied: local Phaser bundle replaced, CSP adjusted for Phaser loader, audio media generated.
- Visible browser rerun executed against build/index.html with runtime introspection and scene-state checks.
- results.json written to testresults/T-PIPELINE-SMB-002/results.json.

### UC Coverage

- UC-001: PASS (boot/menu and new game scene transition validated)
- UC-002: PASS (movement/jump baseline runtime checks validated)
- UC-003: PASS (all platform variants present and moving-platform runtime behavior verified)
- UC-004: PASS (enemy spawn/interaction baseline active)
- UC-005: PASS (collectibles and hidden/question blocks verified without frame warnings)
- UC-006: PASS (goal-complete transition validated in clean-state run)
- UC-007: PASS (lives-to-gameover transition validated in clean-state run)
- UC-008: PASS (hidden block support validated; prior frame warning condition resolved)
- UC-009: PASS (pause overlay start/resume lifecycle validated)
- UC-010: PASS (audio assets load and mute persistence confirmed)
- UC-011: PASS (HUD text update on event emissions confirmed)

### Bugs Found

- BUG-SMB-001 marked fixed after rerun.
- No FAIL outcomes in run 002; no new blocking bugs opened.

### Exit Gate Checklist

- Every UC has PASS/FAIL/PARTIAL evidence: PASS
- Every FAIL has matching bug entry: PASS (no FAIL cases in run 002)
- results.json exists: PASS
- 10-TEST-CASES.md has execution outcomes: PASS
- Final verdict explicit: PASS

### RECOMMENDATION

PASS PIPELINE

Rationale: blocking runtime faults are resolved and all in-scope Stage 10 test cases passed in rerun evidence.

---

## T-PIPELINE-SMB-001

**Date:** 2026-04-28
**Pipeline Script:** supermariobros_test_pipeline001.mjs
**Build:** ./build/
**Final Result:** 0/11 PASS | 11 FAIL | 0 PARTIAL | 1 open bugs

### Run History

- Run 001 executed against local build entry page at build/index.html.
- Immediate runtime crash observed before BootScene completion.
- results.json written to testresults/T-PIPELINE-SMB-001/results.json.

### UC Coverage

- UC-001: FAIL (runtime bootstrap failure blocks menu startup)
- UC-002: FAIL (blocked by startup failure)
- UC-003: FAIL (blocked by startup failure)
- UC-004: FAIL (blocked by startup failure)
- UC-005: FAIL (blocked by startup failure)
- UC-006: FAIL (blocked by startup failure)
- UC-007: FAIL (blocked by startup failure)
- UC-008: FAIL (blocked by startup failure)
- UC-009: FAIL (blocked by startup failure)
- UC-010: FAIL (blocked by startup failure; placeholder audio files also not valid media)
- UC-011: FAIL (blocked by startup failure)

### Bugs Found

- BUG-SMB-001 (CRITICAL): Phaser runtime not loaded (phaser.min.js placeholder), causing ReferenceError and preventing all scene execution.

### Exit Gate Checklist

- Every UC has PASS/FAIL/PARTIAL evidence: PASS
- Every FAIL has matching bug entry: PASS (single root-cause bug mapped)
- results.json exists: PASS
- 10-TEST-CASES.md has execution outcomes: PASS
- Final verdict explicit: PASS

### RECOMMENDATION

FAIL PIPELINE

Rationale: runtime cannot start due to missing Phaser engine bundle; all functional behavior verification is blocked until BUG-SMB-001 is fixed and Stage 10 is rerun.

---
