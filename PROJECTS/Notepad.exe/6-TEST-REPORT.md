# Test Report — Notepad.exe

---

## T-PIPELINE-NPE-001

**Date:** 2026-04-10
**Pipeline Script:** `npe_test_pipeline001.mjs`
**Build:** `./build/extension/`
**Final Result:** ✅ 9/10 PASS | 0 FAIL | 1 PARTIAL | 0 open bugs

### Run History

| Run | Date | PASS | FAIL | PARTIAL | Bugs | Outcome |
|-----|------|------|------|---------|------|---------|
| 1 (pre-fix) | 2026-04-10 | — | — | — | — | ABORTED — double dialog handler crash in UC-004 test script; favicon 404 noise in UC-001 |
| 2 (final)   | 2026-04-10 | 9  | 0  | 1       | 0    | ✅ PASS PIPELINE |

### UC Coverage

| UC | Title | BRs Verified | Result | Evidence |
|----|-------|-------------|--------|---------|
| UC-001 | Open Notepad Window | BR-001..BR-009, BR-013..BR-018 | ✅ PASS | `npe_001_UC001_open.png` |
| UC-002 | Type And Edit Note Content | BR-010, BR-011, BR-012, BR-002 | ✅ PASS | `npe_002_UC002_typing.png` |
| UC-002B | View Document Statistics In Status Bar | BR-013, BR-014, BR-015, BR-016, BR-017 | ✅ PASS | `npe_003_UC002B_statusbar.png` |
| UC-003 | Save Note To Local Storage | BR-019, BR-020, BR-021, BR-002 | ✅ PASS | `npe_004_UC003_save.png` |
| UC-004 | Load Saved Note | BR-022, BR-023, BR-024, BR-025 | ✅ PASS | `npe_005_UC004_load.png` |
| UC-005 | Create New Blank Note | BR-026, BR-027, BR-028, BR-029 | ✅ PASS | `npe_007_UC005_new_accepted.png` |
| UC-006 | Download Note As Text File | BR-030, BR-031, BR-032, BR-033, BR-034 | ✅ PASS | `npe_008_UC006_saveas.png` |
| UC-007 | Prevent Accidental Data Loss | BR-035, BR-036, BR-037 | ✅ PASS | `npe_009_UC007_data_loss_guard.png` |
| UC-008 | Use Notepad As A Desktop-Style Window | BR-038, BR-039, BR-040, BR-041, BR-042 | ⚠️ PARTIAL | `npe_010_UC008_desktop_window.png` |
| UC-009 | View Keyboard Shortcuts In Help | BR-043, BR-044, BR-045, BR-046, BR-047 | ✅ PASS | `npe_013_UC009_help_dialog_closed.png` |

### Evidence Notes

**UC-001**: All DOM elements present (#menubar, .menu-item×4, #editor, #statusbar, #help-modal). Title "Untitled - Notepad" confirmed. Editor auto-focused. Status bar shows "UTF-8". No JS errors.

**UC-002**: Multi-line text including tab character typed and reflected in editor. Dirty marker (*) appears in document title on first keystroke.

**UC-002B**: Position display shows "Ln 2, Col 38" after navigating to line 2. Character count (57) matches exact content length. UTF-8 encoding label static and correct.

**UC-003**: Ctrl+S triggered `window.prompt` for filename. Responding with "testnote.txt" wrote to mock storage key `note_testnote.txt` and `lastNoteName = "testnote.txt"`. Title updated to "testnote.txt - Notepad" (no asterisk).

**UC-004**: Ctrl+O with unsaved changes triggered `window.confirm` (dirty guard, accepted), then `window.prompt` for note selection (responded "loaded_note.txt"). Pre-populated storage note retrieved correctly. Title updated. Subsequent typing confirmed editor editability.

**UC-005**: Cancel on `window.confirm` preserved content (BR-028). Accept on `window.confirm` cleared editor to "", reset title to "Untitled - Notepad", reset status bar to "Ln 1, Col 1" and "0 characters" (BR-026, BR-029).

**UC-006**: Ctrl+Shift+S triggered `window.prompt` for filename. Download event captured by Playwright with filename "download_test.txt". Content also persisted to `note_download_test.txt` in storage.

**UC-007**: With unsaved content, Ctrl+N triggered `window.confirm`. Dismissing confirmed that editor content remains unchanged (BR-037).

**UC-008 (PARTIAL)**: `background.js` served successfully (HTTP 200). `manifest.json` parsed: `manifest_version: 3`, permissions `["storage","windows"]` confirmed. `chrome.windows.create` single-window enforcement and geometry persistence require real Chrome extension install — this is a known platform constraint documented in UC-008 and AR-002 and is not testable in the HTTP-served mock environment.

**UC-009**: Help menu opened by click. "View Help" item clicked — `#help-modal` `hidden` attribute removed (visible). Shortcut table contains 15 rows. All required shortcuts (Ctrl+N, Ctrl+O, Ctrl+S, Ctrl+Z, Ctrl+F, Ctrl+A) present. Escape key correctly set `hidden` attribute (BR-047). Close button verified as present and functional.

### Bugs Found

None — 0 bugs in final run.

### Exit Gate Checklist

- [x] Every UC has PASS, FAIL, or PARTIAL with screenshot evidence
- [x] Every FAIL has a bug entry — N/A (0 FAILs)
- [x] `testresults/T-PIPELINE-NPE-001/results.json` exists
- [x] UC-008 PARTIAL is justified by documented Chrome extension platform constraint (AR-002, UC-007 caveat)
- [x] Final recommendation is explicit

### RECOMMENDATION

**✅ PASS PIPELINE**

9 of 10 UCs PASS with evidence. 1 PARTIAL (UC-008) is structurally verified (background.js, manifest.json MV3) and the runtime gap is a documented Chrome extension platform constraint — not a code defect. 0 bugs. The Notepad.exe Chrome Extension build at `./build/extension/` is verified and ready for manual installation in Chrome via `chrome://extensions` / Load unpacked.

---
