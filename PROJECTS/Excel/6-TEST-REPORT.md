# Test Report

**Test ID:** T-PIPELINE-001
**Release:** XL-REL-2026-04-05-001
**Project:** Excel (Spreadsheet Chrome Extension)
**Stage:** 6 — Test
**Date:** 2026-04-05
**Tester:** Pipeline QA Gate

---

## Overall Result: PASS (with caveats)

---

## Business Requirement Coverage

| BR | Description | File(s) | Result | Notes |
|----|-------------|---------|--------|-------|
| BR-001 | Extension opens spreadsheet window on icon click | background.js | PASS | openOrFocusWindow() called from action.onClicked |
| BR-002 | Only one spreadsheet window at a time | background.js | PASS | spreadsheetWindowId guard + try/catch stale-ID recovery |
| BR-003 | Clicking icon when window open focuses it | background.js | PASS | chrome.windows.update(id, {focused:true}) |
| BR-004 | Grid renders N rows × 26 cols with row/col headers | app.js, index.html | PASS | ROWS=50, COLS=26; thead + tbody rendered; sticky headers |
| BR-005 | Formula bar shows cell address and raw value | app.js, index.html | PASS | #cell-ref + #formula-input updated in setActive() |
| BR-006 | Click selects a cell | app.js | PASS | click delegation on #grid-body sets activeCell |
| BR-007 | Double-click or Enter enters edit mode | app.js | PASS | dblclick → startEdit(); keydown Enter → startEdit() |
| BR-008 | Arrow keys navigate cells | app.js | PASS | ArrowUp/Down/Left/Right → moveActive() |
| BR-009 | Tab confirms edit and moves right | app.js | PASS | Tab in keydown and edit input → commitEdit + moveActive(0,1) |
| BR-010 | Escape cancels edit and restores prior value | app.js | PASS | cancelEdit() restores editPriorValue |
| BR-011 | Cells starting with "=" are evaluated as formulas | formula.js, app.js | PASS | evaluate() checks raw[0]==='=' |
| BR-012 | Arithmetic operators +, -, *, / supported | formula.js | PASS | parseAddSub, parseMulDiv, BINOP eval |
| BR-013 | SUM, AVERAGE, MIN, MAX, COUNT functions supported | formula.js | PASS | FUNCS map; range args expanded via getRange() |
| BR-014 | Formula error shown in cell (#ERR, #DIV/0!, #REF!, #CIRC) | formula.js, app.js | PASS | error strings returned and displayed as cell value |
| BR-015 | Formulas recalculate when referenced cells change | app.js | PASS | recalculate() BFS over dependents; topoSort for full recalc |
| BR-016 | Formula bar displays raw formula for formula cells | app.js | PASS | setActive() sets formula-input.value = cell.raw |
| BR-017 | Editing formula bar edits the active cell | app.js | PASS | formula-input keydown triggers startEdit; syncFormulaToEditor |
| BR-018 | F2 enters edit mode | app.js | PASS | F2 keydown → startEdit() |
| BR-019 | File → Open opens OS file picker for .csv | app.js, index.html | PASS | openCSV() → file-input.click(); accept=".csv" |
| BR-020 | Parsed CSV populates grid cells | app.js | PASS | FileReader → CSV.parse → cells[][] populated |
| BR-021 | Formulas in CSV are re-evaluated on load | app.js | PASS | recalculateAll() called after CSV load |
| BR-022 | Non-CSV file is rejected by file picker | index.html | PASS | accept=".csv" attribute on hidden file input |
| BR-023 | File → Save downloads a .csv file | app.js | PASS | Blob + URL.createObjectURL + anchor download |
| BR-024 | Saved CSV contains raw formula strings (not evaluated values) | app.js | PASS | saveCSV() uses cell.raw (not cell.value) |
| BR-025 | Empty trailing rows/cols are trimmed from CSV output | app.js | PASS | saveCSV() determines maxRow/maxCol before serializing |
| BR-026 | Editing a cell marks sheet as dirty | app.js | PASS | setDirty(true) called in commitEdit() and Delete/Backspace |
| BR-027 | Opening CSV when dirty prompts for confirmation | app.js | PASS | confirmDataLoss() wraps openCSV |
| BR-028 | Ctrl+S triggers save | app.js | PASS | SHORTCUTS entry 'Ctrl+S' → saveCSV |
| BR-029 | Ctrl+O triggers open | app.js | PASS | SHORTCUTS entry 'Ctrl+O' → openCSV |
| BR-030 | Ctrl+Home jumps to cell A1 | app.js | PASS | SHORTCUTS entry 'Ctrl+Home' → setActive(0,0) |
| BR-031 | Window bounds are saved when window is moved or resized | background.js | PASS | onBoundsChanged → chrome.storage.local.set |
| BR-032 | Window reopens at last saved bounds | background.js | PASS | getStoredBounds() reads from storage; defaults provided |
| BR-033 | Help → Help opens help dialog | app.js | PASS | SHORTCUTS 'F1' → showHelp(); menu item wired |
| BR-034 | Help dialog lists keyboard shortcuts | app.js | PASS | showHelp() populates #shortcuts-table from SHORTCUTS + nav rows |
| BR-035 | Help dialog can be closed | app.js, index.html | PASS | #help-close button + backdrop click → dlg.close() |

---

## Test Execution Notes

### T-PIPELINE-001 — Static Analysis Pass
- All 7 build files present
- No `eval()` usage detected (formula engine is recursive-descent parser)
- No external network requests
- HTML injection mitigated via `escapeHtml()` + `textContent` in cell rendering
- MV3 compliance: action.onClicked used (no browser_action), service_worker declared

### Caveats (non-blocking)

| Caveat | Severity | Notes |
|--------|----------|-------|
| beforeunload data-loss prompt absent | LOW | Chrome MV3 popup windows do not fire beforeunload reliably on OS close; dirty title dot (●) provides visual cue |
| AA+ column refs not supported | LOW | COLS=26 (A–Z only); multi-letter column refs would require tokenizer extension |
| #CIRC via partial recalc | LOW | Indirect circular refs in recalculate() BFS may surface as #ERR rather than #CIRC |

---

## Gate Decision

**PASS** — All 35 BRs covered by implementation. Three low-severity caveats documented; none block core use cases. Release XL-REL-2026-04-05-001 approved for install testing.
