# Design Instructions — Excel Chrome Extension
**Stage:** 4 — Technical Lead
**Source:** `2-REQUIREMENTS.md`, `3-ARCHITECTURE-RECOMMENDATIONS.md`, `3-PARTS LIST.md`
**Date:** 2026-04-10

---

## DI-001 : Create manifest.json — Chrome MV3 Extension Descriptor
- SUMMARY: Define the Chrome MV3 manifest for the Excel extension, registering the background service worker, the extension page, and required permissions.
- IMPLEMENTATION STEPS:
  1. File: `./build/extension/manifest.json`
  2. Set `manifest_version: 3`, `name: "Excel"`, initial `version: "1.0.0"`.
  3. `permissions`: `["storage", "windows"]`
  4. `background`: `{ "service_worker": "background.js" }`
  5. Do not add `default_popup`; window creation is handled by background.js.
- SKILLSET REQUIRED: Chrome Extension Manifest V3 schema.
- NOTES Already implemented.
- RELATED AR-001, PT-001, BR-001, UC-001
---
## DI-002 : Create background.js — Service Worker Window Manager
- SUMMARY: Service worker that manages a single persistent window for the Excel extension. On icon click: check for existing window, focus if alive, else create with saved or default geometry.
- IMPLEMENTATION STEPS:
  1. File: `./build/extension/background.js`
  2. On `chrome.action.onClicked`: read `windowId` from `chrome.storage.local`.
  3. Try `chrome.windows.update(savedId, { focused: true })`; if error, proceed to create.
  4. Read `windowGeometry` from storage; fall back to `{ width:1200, height:800, left:100, top:80 }`.
  5. `chrome.windows.create({ url: "app.html", type: "popup", ...geometry })`.
  6. Save new `windowId` to storage.
  7. On `chrome.windows.onBoundsChanged`: save `{ width, height, left, top }` to storage under key `windowGeometry`.
  8. On `chrome.windows.onRemoved`: clear stored `windowId`.
- SKILLSET REQUIRED: Chrome Extension service worker, chrome.windows API.
- NOTES Already implemented.
- RELATED AR-001, AR-006, PT-002, BR-040, BR-041, BR-042, UC-009
---
## DI-003 : Implement ribbon tab bar and RIBBON_CONFIG for Home and additional tabs
- SUMMARY: Render a tab bar with File, Home, Insert, Page Layout, Formulas, Data, Review, View tabs. Home tab is active by default and drives the main ribbon body via RIBBON_CONFIG. Additional tabs (Formulas, Data, View, Insert) render their own group/button configs.
- IMPLEMENTATION STEPS:
  1. File: `./build/extension/app.js`
  2. `RIBBON_CONFIG` is an object keyed by tab name: each value is an array of group objects `{ label, items[] }`.
  3. Tab bar renders 8 tab elements; clicking a tab sets `activeTab`, re-renders the ribbon body with that tab's config.
  4. Home groups: Clipboard (Cut/Copy/Paste), Font (name, size, B/I/U, FontColor, FillColor), Alignment (L/C/R, WrapText, Merge), Number (format dropdown, IncDecimal buttons), Editing (AutoSum, Fill Down, Find).
  5. Formulas tab groups: Function Library (Insert Function/fx button, AutoSum, category buttons: Logical, Text, Math, Date).
  6. Data tab groups: Sort & Filter (Sort A→Z, Sort Z→A, Filter button).
  7. View tab groups: Workbook Views (Normal, Page Layout buttons), Freeze Panes button.
  8. Insert and Page Layout tabs may render placeholder groups with disabled buttons.
  9. File tab click opens the backstage panel instead of switching ribbon content.
- SKILLSET REQUIRED: Vanilla JS DOM manipulation, event delegation.
- NOTES Multi-tab config was added in this pipeline run; Home tab config was pre-existing.
- RELATED AR-007, PT-004, BR-046 through BR-051, BR-068 through BR-072, UC-011, UC-016
---
## DI-004 : Implement formula area — Name Box, fx label, formula bar
- SUMMARY: Three-part formula area row: Name Box (cell address input), italic fx label, formula bar input. Name Box reflects current cell, allows navigation by typing an address. Formula bar reflects raw cell content, allows direct formula editing.
- IMPLEMENTATION STEPS:
  1. File: `./build/extension/app.html` — `<input id="name-box">`, `<span id="fx-label">fx</span>`, `<input id="formula-bar">`.
  2. On every `selectCell()` call: update `#name-box.value` to cell address.
  3. On `#name-box` Enter: `parseAddress()` the input, call `selectCell()` if valid.
  4. On `#formula-bar` Enter: commit the value to the current cell via `setCell()` + `updateCellDisplay()`.
  5. On `#formula-bar` Escape: restore prior cell value and cancel edit.
  6. While inline editing: mirror typed content to `#formula-bar` in real time.
- SKILLSET REQUIRED: DOM event handling, keyboard events.
- NOTES Already implemented.
- RELATED AR-002, PT-003, PT-004, BR-005, BR-006, BR-024, BR-025, BR-026, UC-001, UC-004
---
## DI-005 : Implement grid renderer — 50×26 table with sticky headers
- SUMMARY: Render a `<table>` with 50 rows and 26 columns. Column headers in `<thead>`, row numbers as the first `<td>` of each `<tbody>` row. Make headers sticky so they remain visible during scroll.
- IMPLEMENTATION STEPS:
  1. File: `./build/extension/app.js` — `renderGrid()` builds the table once on load.
  2. Column header `<th>` elements get class `col-header` and `data-col` attribute.
  3. Row header `<td>` elements get class `row-header` and `data-row`.
  4. Data cells get class `grid-cell`, `data-row`, `data-col`.
  5. CSS (`app.css`): `thead { position: sticky; top: 0; }`, `td.row-header { position: sticky; left: 0; }`.
  6. Default column width: 64px; default row height: 21px via CSS.
- SKILLSET REQUIRED: HTML table structure, CSS position:sticky.
- NOTES Already implemented.
- RELATED AR-002, PT-004, PT-005, BR-007, BR-052, BR-053, BR-054, BR-055, UC-001, UC-012
---
## DI-006 : Implement cell selection, inline editing, and range selection
- SUMMARY: Single-click selects a cell and shows selection highlight. Double-click or F2 enters inline edit mode. Shift+click or drag extends selection to a range. Escape deselects to anchor cell.
- IMPLEMENTATION STEPS:
  1. Track `selectedRow`, `selectedCol`, `selectionRange` (for multi-cell).
  2. `selectCell(r, c)`: remove prior highlights, add selection class to cell and headers.
  3. Inline edit: on double-click, create `<input>` overlay on cell; mirror to formula bar; commit on Enter/Tab/arrow; cancel on Escape.
  4. Range selection: `mousedown` sets anchor, `mousemove` updates range, `mouseup` commits; Shift+click extends from anchor.
  5. Name Box shows "A1:C3" format for ranges; single address for single cells.
  6. Escape: if range selected → revert to anchor; if editing → cancel edit.
- SKILLSET REQUIRED: Mouse events, keyboard events, DOM class manipulation.
- NOTES Already implemented (range selection partially; verify multi-cell range highlight).
- RELATED AR-002, PT-004, BR-009 through BR-014, BR-078 through BR-081, UC-002, UC-018
---
## DI-007 : FormulaEngine — Base Evaluation (arithmetic + SUM/AVG/COUNT/MIN/MAX/IF)
- SUMMARY: FormulaEngine object evaluates `=` formulas via expandFunctions() → replaceRefs() → safeCalc(). Supports SUM, AVERAGE, COUNT, MAX, MIN, IF, range notation (A1:B3), and returns specific error strings.
- IMPLEMENTATION STEPS:
  1. `evaluate(raw)`: if not `=`, return raw. Strip `=`, run expandFunctions, replaceRefs, safeCalc.
  2. `expandFunctions(expr)`: regex loop matching `FNAME(args)` innermost-first; dispatch to `evalFunction(fn, args)`.
  3. `evalFunction`: SUM → sum of numeric values; AVERAGE → mean; COUNT → count of numerics; MAX/MIN → extremes; IF → conditional branch.
  4. `expandRange(A1:B3)`: iterate row/col bounds, collect numeric cell values.
  5. `replaceRefs(expr)`: replace `[A-Z]+\d+` refs with their numeric display values.
  6. `safeCalc(expr)`: whitelist-validate then recursive descent parse for +, -, *, /.
  7. Error propagation: `Infinity` → `#DIV/0!`; unknown fn in evalFunction → `#NAME?`; outer catch → `#VALUE!`.
- SKILLSET REQUIRED: Recursive descent parser, regex, string manipulation.
- NOTES Base already implemented; error propagation fix and function expansion are DI-016 though DI-022.
- RELATED AR-003, AR-004, PT-006, BR-015 through BR-023, UC-003
---
## DI-008 : Implement CSV import and export (RFC 4180)
- SUMMARY: Import a .csv file into the active sheet's grid. Export the active sheet's non-empty area as a .csv download.
- IMPLEMENTATION STEPS:
  1. Import: hidden `<input type="file" accept=".csv">` element; on change, read Blob text, call `parseCsv(text)`.
  2. Parser: RFC 4180 — quoted fields with internal commas/newlines supported.
  3. Export: iterate cells, quote cells containing comma/newline/quote; join with commas; rows with `\r\n`; trigger download via `<a href="data:text/csv,...">`.
  4. Guard: if `isDirty`, show confirm before import overwrite.
- SKILLSET REQUIRED: File API, Blob, RFC 4180 CSV.
- NOTES Already implemented.
- RELATED AR-002, PT-004, BR-027, BR-028, BR-029, BR-030, BR-031, UC-005, UC-006
---
## DI-009 : Implement undo stack
- SUMMARY: Maintain a stack of grid data snapshots. Push snapshot before every cell change. Ctrl+Z pops and restores.
- IMPLEMENTATION STEPS:
  1. `undoStack`: array of `{ sheetIndex, data }` deep copies.
  2. `pushUndo(snapshot)`: push; cap at 50 entries.
  3. `undo()`: pop snapshot, restore `sheets[idx].data`, re-render grid.
  4. Keyboard: `Ctrl+Z` calls `undo()` in `keydown` handler.
- SKILLSET REQUIRED: State management, deep copy.
- NOTES Already implemented.
- RELATED AR-002, PT-004, BR-037, UC-007
---
## DI-010 : Implement sheet tab manager — multi-sheet with independent data
- SUMMARY: Sheet tab bar at the bottom. Clicking a tab switches the active sheet. "+" adds a new sheet. Each sheet has its own `data` object. Double-click a tab to rename.
- IMPLEMENTATION STEPS:
  1. `sheets`: array of `{ name, data }`.
  2. `renderTabs()`: create tab DOM elements; active tab gets selected class with green border.
  3. Tab click: `switchSheet(idx)` — set `currentSheetIndex`, `renderGrid()`, clear selection.
  4. "+" button: push new sheet `{ name: 'Sheet${n}', data: {} }`.
  5. Double-click tab: inline rename via prompt or input.
- SKILLSET REQUIRED: DOM event handling, state management.
- NOTES Already implemented.
- RELATED AR-002, PT-004, BR-056 through BR-059, UC-013
---
## DI-011 : Implement keyboard shortcuts handler
- SUMMARY: Global `keydown` listener on `document` dispatching keyboard shortcuts to their respective actions.
- IMPLEMENTATION STEPS:
  1. Ctrl+S → `exportCsv()`.
  2. Ctrl+O → click hidden file input.
  3. Ctrl+Z → `undo()`.
  4. Ctrl+Home → `selectCell(0, 0)`.
  5. F1 → open Help dialog.
  6. F2 → enter inline edit on selected cell.
  7. Escape → cancel edit, close menus/dialogs.
  8. Arrow keys → navigate cells (if not editing).
  9. Ctrl+F → open Find dialog; Ctrl+H → open Find & Replace dialog.
- SKILLSET REQUIRED: DOM keyboard events, event.key handling.
- NOTES Already implemented.
- RELATED AR-002, PT-004, BR-035 through BR-039, BR-043, UC-008
---
## DI-012 : Implement right-click context menu
- SUMMARY: Custom context menu appearing on cell right-click with items: Cut, Copy, Paste, separator, Insert Row, Delete Row, separator, Clear Contents.
- IMPLEMENTATION STEPS:
  1. `<div id="context-menu">` always in DOM; position:fixed; hidden by default.
  2. `contextmenu` event on grid: `preventDefault()`, set menu position, show menu.
  3. Menu item click → dispatch action; close menu.
  4. `document.click` or `Escape` → close menu.
  5. Insert Row: splice blank row data above current row; re-render.
  6. Delete Row: remove row data; re-render.
  7. Clear Contents: `setCell(r, c, '')` without modifying format.
- SKILLSET REQUIRED: contextmenu event, DOM positioning.
- NOTES Already implemented.
- RELATED AR-002, PT-004, BR-063 through BR-067, UC-015
---
## DI-013 : Implement Find & Find-Replace dialog
- SUMMARY: Modeless overlay dialogs triggered by Ctrl+F (Find only) and Ctrl+H (Find & Replace). Non-blocking; grid interaction remains possible. Case-insensitive search across displayed cell values.
- IMPLEMENTATION STEPS:
  1. Single dialog element `#find-replace-dialog` with: title bar, "Find what" input, optional "Replace with" input, Find Next / Replace / Replace All / Close buttons.
  2. Ctrl+F: show dialog with Replace row hidden.
  3. Ctrl+H: show dialog with Replace row visible.
  4. Find Next: iterate cells from current selection; case-insensitive match against `getCellDisplay(r,c)`; select first match; wrap if end reached.
  5. Replace: replace current match cell's raw value; advance search.
  6. Replace All: iterate all cells; replace all matches; show count in dialog.
  7. No match: show inline "No matches found" message within dialog.
  8. Escape / Close button: hide dialog.
- SKILLSET REQUIRED: DOM overlay, string case-insensitive comparison.
- NOTES Already partially implemented (Find only). Replace functionality to be added in DI-013 scope if missing.
- RELATED AR-008, PT-004, BR-095 through BR-099, UC-022
---
## DI-014 : Implement status bar — mode text, aggregate stats, zoom control
- SUMMARY: Full-width bar at bottom of window. Left: mode text ("Ready" / "Edit" / "Enter"). Center: aggregate stats for numeric selection (Average / Count / Sum). Right: zoom control (percentage label, − slider + buttons).
- IMPLEMENTATION STEPS:
  1. `<div id="status-bar">` with three sections.
  2. Mode text: `setStatusMode("Ready")` on init, `"Edit"` on inline edit start, `"Enter"` on formula confirmation, back to `"Ready"` after.
  3. Aggregate: on selection change, collect numeric values from selected range, compute avg/count/sum, display in center section.
  4. Zoom: `zoomLevel` state (default 100). `+` button: `zoomLevel = Math.min(400, zoomLevel+10)`. `−` button: `zoomLevel = Math.max(10, zoomLevel-10)`. Apply `transform: scale()` or `font-size`-based scaling to `#grid-container`.
- SKILLSET REQUIRED: Numeric aggregation, CSS transform scaling.
- NOTES Already implemented.
- RELATED AR-002, PT-004, BR-100 through BR-104, UC-023
---
## DI-015 : Implement number formatting, fill color, font color, column/row resize
- SUMMARY: Number format dropdown applies Intl.NumberFormat rendering per cell. Fill/Font color pickers open palette popovers. Column/row headers support drag-resize.
- IMPLEMENTATION STEPS:
  1. Number formatting: store `format` per cell; `getCellDisplay()` applies Intl.NumberFormat based on format value; Text format suppresses formula evaluation.
  2. Fill/Font color: palette popover `<div>` with 40 swatches; click swatch → `setCellFormat(r,c,{fillColor})` or `{fontColor}`; re-render cell.
  3. Column resize: `mousedown` on `col-header` right border → `document.mousemove` updates `colWidths[c]`; `mouseup` commits. Double-click: measure content, set width.
  4. Row resize: same pattern for row-header bottom border and `rowHeights[r]`.
  5. Minimums: 20px columns, 16px rows.
- SKILLSET REQUIRED: Intl.NumberFormat, mousemove drag events.
- NOTES Already implemented.
- RELATED AR-010, PT-004, BR-082 through BR-094, UC-019, UC-020, UC-021
---
## DI-016 : FormulaEngine Expansion — Add Logical Functions (AND, OR, NOT, IFERROR)
- SUMMARY: Extend `evalFunction()` to handle AND, OR, NOT, and IFERROR. These functions operate on boolean/numeric arguments and may wrap error-producing expressions.
- IMPLEMENTATION STEPS:
  1. File: `./build/extension/app.js`, inside `FormulaEngine.evalFunction(fn, argsStr)`.
  2. Add to `expandFunctions` regex pattern: `AND|OR|NOT|IFERROR`.
  3. `AND`: collect numeric values (same method as SUM args); return `'1'` if all non-zero, `'0'` otherwise.
  4. `OR`: return `'1'` if any value is non-zero.
  5. `NOT`: parse single arg to float; return `'0'` if non-zero, `'1'` if zero.
  6. `IFERROR(value, errval)`: split args on first comma; evaluate value with `this.replaceRefs(this.expandFunctions(valueStr))`; pass through `this.safeCalc`; if result starts with `#`, return `errval` stripped of surrounding quotes; otherwise return the computed value.
  7. Comparison operators in IF conditions (>, <, >=, <=, =, <>) must work: the condExpr passed to `safeCalc` needs comparison operator support. Add handling in `safeCalc` or before: if condExpr contains a comparison, evaluate using JS comparison after numeric substitution. Approach: in `evalFunction` IF case, replace comparison operators with their numeric truth values (e.g., `3>1` → `1`, `3<1` → `0`) before passing to safeCalc.
  8. For IF condition, replace `A>B`, `A<B`, etc. by computing the comparison and returning `'1'` or `'0'`.
- SKILLSET REQUIRED: String regex parsing, conditional logic.
- NOTES Comparison evaluation: use `evalComparison(condStr)` helper that splits on `>=|<=|<>|>|<|=` and converts to string `'1'` or `'0'`.
- RELATED AR-004, PT-006, BR-105 through BR-109, UC-024
---
## DI-017 : FormulaEngine Expansion — Add Text Functions
- SUMMARY: Add a text-function pre-pass to FormulaEngine. Text functions take string values from cells and return strings. They must bypass the numeric safeCalc pipeline.
- IMPLEMENTATION STEPS:
  1. File: `./build/extension/app.js`, add `FormulaEngine.evalTextFunction(fn, argsStr)` and `FormulaEngine.isTextFormula(expr)`.
  2. `isTextFormula(expr)`: return true if the top-level function is one of: CONCATENATE, CONCAT, LEN, LEFT, RIGHT, MID, UPPER, LOWER, TRIM. Also return true if `expr` contains a `&` operator outside of a quoted string.
  3. `getStringArg(arg)`: trim; if surrounded by `"..."`, strip quotes and return literal; else if looks like a cell address (`/^[A-Z]+\d+$/`), return `getCellDisplay(row, col)` as string; else return arg.
  4. `evalTextFunction(fn, argsStr)`:
     - Split argsStr by comma (respecting no nesting, already expanded).
     - Map each arg through `getStringArg()`.
     - CONCATENATE / CONCAT: args.join('')
     - LEN: String(args[0].length)
     - LEFT: args[0].slice(0, parseInt(args[1])||0)
     - RIGHT: args[0].slice(-(parseInt(args[1])||0))
     - MID: args[0].slice((parseInt(args[1])||1)-1, (parseInt(args[1])||1)-1+(parseInt(args[2])||0))
     - UPPER: args[0].toUpperCase()
     - LOWER: args[0].toLowerCase()
     - TRIM: args[0].trim().replace(/\s+/g,' ')
  5. In `evaluate()`: before the main try block, if the expression starts with one of the text functions, call `evalTextFunction` and return early.
  6. `&` operator handling in `evaluate()`: if `expr` contains `&` (after stripping `=`), split on `&` (not inside `""`), map each segment through `getStringArg()`, join and return.
- SKILLSET REQUIRED: String manipulation, regex for quoted-string-aware splitting.
- NOTES Ensure `&` splitting skips `&` characters inside double-quoted strings: use a simple state machine or regex that handles `"..."` spans.
- RELATED AR-004, PT-006, BR-110 through BR-116, UC-025
---
## DI-018 : FormulaEngine Expansion — Add Math Functions (ROUND, ABS, INT, MOD, SQRT, POWER)
- SUMMARY: Add math helper functions to `evalFunction()`. These return numeric results via safeCalc-compatible string values.
- IMPLEMENTATION STEPS:
  1. Add to `expandFunctions` regex: `ROUND|ABS|INT|MOD|SQRT|POWER`.
  2. In `evalFunction(fn, argsStr)`:
     - Replace cell refs in argsStr: `this.replaceRefs(argsStr)`.
     - Parse numeric args: `rawArgs.map(a => parseFloat(a.trim()))`.
     - `ROUND(n, d)`: `String(Math.round(n * 10**d) / 10**d)` (handles edge cases).
     - `ABS(n)`: `String(Math.abs(n))`.
     - `INT(n)`: `String(Math.floor(n))`.
     - `MOD(n, d)`: `String(n - Math.floor(n/d)*d)` (JS % sign behaviour fix).
     - `SQRT(n)`: `n < 0 ? '#VALUE!' : String(Math.sqrt(n))`.
     - `POWER(n, exp)`: `String(Math.pow(n, exp))`.
  3. SQRT with negative argument must return `'#VALUE!'` (not a JS NaN or throw).
- SKILLSET REQUIRED: JavaScript Math object, floating-point arithmetic.
- NOTES ROUND using `10**d` handles negative digits correctly for rounding to tens, hundreds, etc.
- RELATED AR-004, PT-006, BR-117 through BR-122, UC-026
---
## DI-019 : FormulaEngine Expansion — Add Date Functions (TODAY, NOW, DATE, YEAR, MONTH, DAY)
- SUMMARY: Add date-producing functions to FormulaEngine. Date functions return ISO-format strings (YYYY-MM-DD or YYYY-MM-DD HH:MM) not numeric values; they must bypass safeCalc.
- IMPLEMENTATION STEPS:
  1. Add `evalDateFunction(fn, argsStr)` to FormulaEngine.
  2. Helper `isoDate(d)`: returns `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`.
  3. In `evaluate()`: check if stripped expression starts with `TODAY|NOW|DATE|YEAR|MONTH|DAY`; if so call `evalDateFunction` and return early.
  4. `TODAY()`: `return isoDate(new Date())`.
  5. `NOW()`: `${isoDate(new Date())} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`.
  6. `DATE(y,m,d)`: parse three numeric args; `isoDate(new Date(y,m-1,d))`.
  7. `YEAR(date)` / `MONTH(date)` / `DAY(date)`: getStringArg for the single arg to get date string; `new Date(dateStr)` — return `.getFullYear()` / `.getMonth()+1` / `.getDate()`. If date is invalid, return `'#VALUE!'`.
- SKILLSET REQUIRED: JavaScript Date API.
- NOTES Date functions match single-arg cell reference style; YEAR/MONTH/DAY numeric results can subsequently participate in arithmetic via the normal pipeline.
- RELATED AR-004, AR-010, PT-006, BR-123 through BR-126, UC-027
---
## DI-020 : FormulaEngine Expansion — Absolute Reference Support and Paste Adjustment
- SUMMARY: Update `replaceRefs()` to strip `$` signs from references during evaluation. Add `adjustFormulaRefs(raw, rowDelta, colDelta)` used during copy-paste to shift relative references only.
- IMPLEMENTATION STEPS:
  1. Update `replaceRefs(expr)`:
     - Change regex from `/\b([A-Z]+)(\d+)\b/g` to `/\$?([A-Z]+)\$?(\d+)/g`.
     - This strips `$` during evaluation so `$A$1` resolves the same as `A1`.
  2. Add `adjustFormulaRefs(raw, rowDelta, colDelta)`:
     - Input: raw formula string (e.g., `"=$A1+B$2+C3"`), row offset, col offset.
     - Regex: `/(\$?)([A-Z]+)(\$?)(\d+)/g` — captures col-abs flag, col letters, row-abs flag, row digits.
     - For each match: if col is not absolute (no `$`), adjust col by `colDelta`; if row is not absolute, adjust row by `rowDelta`.
     - Rebuild reference: `(colAbs?'$':'') + newColLetters + (rowAbs?'$':'') + newRow`.
     - Return reconstructed formula string.
  3. Update paste handler in `handleRibbonAction('paste')` and context menu paste (`execContextAction('paste')`):
     - If `clipboardCell.raw.startsWith('=')` (is a formula): call `adjustFormulaRefs(raw, destRow-srcRow, destCol-srcCol)` to get adjusted formula; store adjusted formula in destination cell.
     - If not a formula (plain value), paste as-is (existing behavior).
  4. F4 cycling in formula bar: add `keydown` listener on `#formula-bar`: if key is F4, find the cell reference token under the cursor (or nearest reference before cursor position), cycle it through: `A1` → `$A$1` → `A$1` → `$A1` → `A1`, update input value.
- SKILLSET REQUIRED: Regex with capture groups, string rebuilding, cursor position in input.
- NOTES F4 cycling is best-effort for simple cases (single reference token near cursor). Complex multi-reference formulas may require the user to place cursor precisely on the token.
- RELATED AR-005, PT-006, BR-127 through BR-132, UC-028
---
## DI-021 : Fix error propagation — specific errors instead of generic #ERR
- SUMMARY: The outer `catch` in `FormulaEngine.evaluate()` currently swallows all errors and returns `'#ERR'`. This must be changed to propagate specific error values (#DIV/0!, #NAME?, #VALUE!) that are already generated within the engine.
- IMPLEMENTATION STEPS:
  1. In `FormulaEngine.evaluate()`:
     - Replace the outer `catch(e) { return '#ERR'; }` block.
     - New catch: `catch(e) { if (typeof e === 'string' && e.startsWith('#')) return e; return '#VALUE!'; }`.
  2. In `FormulaEngine.evalFunction()`:
     - When an unknown function name is detected, `throw '#NAME?'` instead of returning `'#NAME?'` (so it propagates through nested expansion).
     - Actually returning `'#NAME?'` is fine since expandFunctions collapses innermost first; the returned `'#NAME?'` will fail numeric parsing and produce `'#ERR'`. Better: return `'#NAME?'` AND ensure the outer catch does not re-wrap it.
     - Correct approach: return `'#NAME?'` from evalFunction; in evaluate(), after safeCalc, check if result starts with `#`; if so return as-is without further processing.
  3. In `safeCalc()`:
     - Change `catch(e) { return '#ERR'; }` to `catch(e) { return '#VALUE!'; }`.
  4. Result: division by zero → `'#DIV/0!'` (already from safeCalc's Infinity check), unknown function → `'#NAME?'`, parse error → `'#VALUE!'`, negative sqrt → `'#VALUE!'`.
- SKILLSET REQUIRED: Error handling patterns in JavaScript.
- NOTES This change is prerequisite for BR-023 and for IFERROR to correctly detect and catch specific error types.
- RELATED AR-003, AR-004, PT-006, BR-023, UC-003
---
## DI-022 : Implement backstage panel and multi-tab ribbon switching
- SUMMARY: File Backstage: full-window overlay with green sidebar (New, Open, Save, Save As, Back). Ribbon tab switching: update ribbon body content per active tab via RIBBON_TAB_CONFIGS map.
- IMPLEMENTATION STEPS:
  1. Backstage panel: `<div id="backstage">` overlay, flex layout, green sidebar, content area. Shown when File tab clicked; hidden on Escape/Back.
  2. Sidebar items: New, Open, Save, Save As. Each triggers the corresponding action then closes backstage.
  3. Ribbon tab switching: maintain `activeRibbonTab` string; on tab click (except File), set activeRibbonTab, call `renderRibbon()`. `renderRibbon()` reads `RIBBON_TAB_CONFIGS[activeRibbonTab]` and renders groups.
  4. Active tab visual: green bottom border on active tab; all others plain.
  5. Home tab is default; ribbon body shows Home groups on load.
- SKILLSET REQUIRED: DOM overlay, flex layout, event-driven state.
- NOTES Already partially implemented; ensure Formulas/Data/View tab configs are added per DI-003.
- RELATED AR-007, AR-009, PT-003, PT-004, BR-068 through BR-077, UC-016, UC-017
---

