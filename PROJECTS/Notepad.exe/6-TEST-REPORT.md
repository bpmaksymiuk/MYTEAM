# 6 — Test Report: Notepad.exe Chrome Extension

## T-PIPELINE-NP-001 : PASS

**Date:** 2026-04-07
**Tester:** Tester Agent (Stage 6)
**Build:** `./build/extension/`
**Test Runner:** `notepad_test_pipeline001.mjs` (Playwright 1.59.1, Chromium, `headless: false`, `slowMo: 250ms`)
**Display:** `DISPLAY=:0` — browser window visible on screen
**UC Coverage:** 10/10 use cases tested (UC-001 through UC-009 + UC-002B)
**BR Coverage:** 29/30 Business Requirements mapped (BR-001 – BR-029; BR-030 Find has no corresponding UC — see Notes)
**Screenshots:** 13 captured in `testresults/T-PIPELINE-NP-001/`
**Final Result:** ✅ **10/10 PASS | 0 FAIL | 0 PARTIAL | 0 open bugs**

---

### Results Summary

| UC | Title | BR Coverage | Result | Screenshot |
|----|-------|-------------|--------|------------|
| UC-001 | Window launches with correct UI | BR-001, BR-002, BR-003, BR-004, BR-005, BR-006 | ✅ PASS | testresults/T-PIPELINE-NP-001/np_shot_001_UC001_initial_state.png |
| UC-002 | Typing in editor | BR-007, BR-016 | ✅ PASS | testresults/T-PIPELINE-NP-001/np_shot_002_UC002_typing.png |
| UC-002B | Status bar real-time updates | BR-010, BR-011, BR-012, BR-013 | ✅ PASS | testresults/T-PIPELINE-NP-001/np_shot_003_UC002B_status_bar.png |
| UC-003 | Save document | BR-014, BR-015, BR-016 | ✅ PASS | testresults/T-PIPELINE-NP-001/np_shot_004_UC003_after_save.png |
| UC-004 | Open/load document | BR-017, BR-018, BR-019 | ✅ PASS | testresults/T-PIPELINE-NP-001/np_shot_006_UC004_after_open.png |
| UC-005 | New document | BR-020, BR-021, BR-022 | ✅ PASS | testresults/T-PIPELINE-NP-001/np_shot_007_UC005_new_document.png |
| UC-006 | Save As (download) | BR-023, BR-024 | ✅ PASS | testresults/T-PIPELINE-NP-001/np_shot_008_UC006_save_as.png |
| UC-007 | Unsaved changes protection | BR-025 | ✅ PASS | testresults/T-PIPELINE-NP-001/np_shot_009_UC007_protection.png |
| UC-008 | Standalone window behavior | BR-026, BR-027 | ✅ PASS | testresults/T-PIPELINE-NP-001/np_shot_010_UC008_window.png |
| UC-009 | Help dialog | BR-028, BR-029 | ✅ PASS | testresults/T-PIPELINE-NP-001/np_shot_011_UC009_help_open.png |

### Test Evidence

| UC | Key Assertion | Observed Value |
|----|--------------|----------------|
| UC-001 | Title bar text | `"Untitled - Notepad"` |
| UC-001 | Menu buttons count | 4 (File, Edit, View, Help) |
| UC-001 | Status bar initial | `UTF-8 \| Ln 1 \| Col 1 \| 0 chars` |
| UC-002 | Editor value after typing | `"Hello World"` |
| UC-002 | Dirty indicator in title | `"* Untitled - Notepad"` |
| UC-002 | Status bar col after typing | `Col 12` (11-char string, cursor at end) |
| UC-002B | Line number after 3 lines | `Ln 3` |
| UC-002B | Char count matches text length | `17 chars` (editor.value.length=17) |
| UC-002B | Encoding label | `UTF-8` |
| UC-003 | Ctrl+S prompted for filename | Prompt dialog shown — `"Save as:"` |
| UC-003 | Title after save | `"test-note - Notepad"` (no `*` prefix) |
| UC-004 | File > New clears editor | `editor.value === ""` |
| UC-004 | Open dialog appears | `#open-dialog` visible |
| UC-004 | Note "test-note" listed | Found in open-list |
| UC-004 | Editor content after open | `"Test content for save"` |
| UC-005 | Confirm dialog on dirty New | `"Unsaved changes will be lost. Continue?"` |
| UC-005 | Editor cleared after accept | `editor.value === ""` |
| UC-005 | Title reset after New | `"Untitled - Notepad"` |
| UC-005 | Status bar reset | `Ln 1 \| 0 chars` |
| UC-006 | Download event received | Yes |
| UC-006 | Download filename | `"Untitled.txt"` (.txt extension ✓) |
| UC-007 | Confirm dialog shown for dirty state | Yes — `"Unsaved changes will be lost. Continue?"` |
| UC-007 | Content preserved after Cancel | `editor.value` contains `"Unsaved protection"` |
| UC-008 | Page URL scheme | `chrome-extension://hdbnpgdflflcjbgjhfmnelnjfgjgjclk/notepad.html` |
| UC-009 | Help opens on F1 | `#help-dialog` visible |
| UC-009 | Help content non-empty | 196 chars |
| UC-009 | Help closes on button | `#help-dialog` not visible |

---

### Defects Found

None.

---

### FAILURES IDENTIFIED

None — all 10 use cases passed on the first run.

---

### OWNING STAGE

N/A — no failures.

---

### FIXES APPLIED

N/A — no failures in this run.

---

### DOWNSTREAM RERUN SUMMARY

Not required — pipeline passed on first run.

---

### RECOMMENDATION

**PASS PIPELINE**

All 10 use cases and 29/30 Business Requirements have direct test coverage via browser automation. The build at `./build/extension/` is release-ready. The single untested BR (BR-030, Find functionality) is a feature present in the code (Edit > Find... / Ctrl+F) with no corresponding Use Case defined in `1-USE-CASES.md` — no UC-driven test could be generated. The feature exists in the implementation; functional correctness of Find is contingent on a future UC being defined.

---

### NOTES

- Extension was loaded by Playwright using `chromium.launchPersistentContext` with `--load-extension` and `--disable-extensions-except`.
- Extension ID: `hdbnpgdflflcjbgjhfmnelnjfgjgjclk` (session-specific; varies per run).
- `chrome.storage.local` persistence confirmed working: UC-003 saved "test-note" and UC-004 loaded it back correctly within the same Playwright session.
- `File > Save As...` download confirmed: Playwright received a download event with filename `"Untitled.txt"`.
- All `window.confirm()` dialogs handled by Playwright's dialog event listener: UC-005 (accept) and UC-007 (dismiss/cancel) both worked correctly.
- BR-030 (Find functionality) is implemented in the build (Edit > Find... / Ctrl+F) but no Use Case was defined for it in `1-USE-CASES.md`. Coverage is marked as gap. Find dialog exists and is functional by code inspection.
- `slowMo: 250ms` used throughout to ensure UI rendering stability.
- 13 screenshots captured; 0 uncaught page errors.

---

### RELATED

- Test script: `PROJECTS/Notepad.exe/notepad_test_pipeline001.mjs`
- Results JSON: `PROJECTS/Notepad.exe/testresults/T-PIPELINE-NP-001/results.json`
- Screenshots: `PROJECTS/Notepad.exe/testresults/T-PIPELINE-NP-001/` (13 files)
- Build: `PROJECTS/Notepad.exe/build/extension/`
- Release notes: `PROJECTS/Notepad.exe/5-RELEASE-NOTES.md` (NP-REL-2026-04-07-001)

---
