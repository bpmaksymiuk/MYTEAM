## T-PIPELINE-CS-001

**Date:** 2026-04-08
**Pipeline Script:** cs_test_pipeline001.mjs
**Build:** ./build/
**Final Result:** ✅ 12/12 PASS | 0 FAIL | 0 PARTIAL | 0 open bugs

### Run History

| Run | Date | Result | Notes |
|-----|------|--------|-------|
| Run 1 | 2026-04-08 | ❌ 11/12 | BUG-CS-001: T06 mousedown coordinates inside sidebar panel |
| Run 2 | 2026-04-08 | ✅ 12/12 | BUG-CS-001 fixed — canvas-area coordinates used |

### UC Coverage

| UC | Title | BRs Covered | Result | Screenshot |
|----|-------|-------------|--------|------------|
| UC-001 | Place Negative Charge Emitters | BR-002, BR-003, BR-007 | ✅ PASS | T04.png |
| UC-002 | Place Positive Charge Collectors | BR-004, BR-008, BR-009 | ✅ PASS | T05.png |
| UC-003 | Draw Barriers | BR-005, BR-010 | ✅ PASS | T06.png |
| UC-004 | Delete Elements | BR-006 | ✅ PASS | T07.png |
| UC-005 | Configure Physics Parameters | BR-011, BR-012, BR-013 | ✅ PASS | T01.png |
| UC-006 | Visualize Electrostatic Field | BR-019 | ✅ PASS | T01.png |
| UC-007 | Toggle Particle Trails | BR-020 | ✅ PASS | T01.png |
| UC-008 | Play Maze Escape Challenge | BR-022, BR-023 | ✅ PASS | T11.png |
| UC-009 | Play Balance Challenge | BR-024, BR-025 | ✅ PASS | T11.png |
| UC-010 | Play Containment Challenge | BR-026, BR-027 | ✅ PASS | T01.png |
| UC-011 | Save / Load Configurations | BR-016, BR-017, BR-018 | ✅ PASS | T01.png |
| UC-012 | Slow-Mo Control | BR-014 | ✅ PASS | T01.png |
| UC-013 | Force Vector Overlay | BR-021 | ✅ PASS | T01.png |
| UC-014 | Statistics Panel | BR-015 | ✅ PASS | T10.png |
| UC-015 | Dark Mode / Velocity Colour / Audio | BR-028, BR-029, BR-030 | ✅ PASS | T09.png |

### Bugs Found

| ID | Severity | Description | Status |
|----|----------|-------------|--------|
| BUG-CS-001 | Low | T06 barrier draw test used x=150 which falls inside the 220px sidebar; mousedown never registered on canvas | ✅ Fixed |

### Exit Gate Checklist

| Gate | Status |
|------|--------|
| All UCs tested | ✅ |
| 0 open FAIL results | ✅ |
| results.json written | ✅ |
| Design requirements covered | ✅ |

### RECOMMENDATION

**PASS PIPELINE** — All 12 tests pass on Run 2. 15/15 UCs covered. 0 open bugs. Release ready.

---
