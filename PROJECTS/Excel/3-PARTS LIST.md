# Parts List

**Project:** Excel Chrome Extension
**Source:** 2-REQUIREMENTS.md (BR-001 – BR-058)
**Date:** 2026-04-07

---

## PT-001 : manifest.json
- DESCRIPTION
  Chrome Extension Manifest V3 declaration file. Registers the extension name, version, required permissions (storage, windows), service worker entry point (background.js), and toolbar action with no default_popup so that chrome.action.onClicked fires.
- TECHNOLOGY RECOMMENDATIONS
  JSON. Manifest version 3. permissions: ["storage", "windows"]. background.service_worker: "background.js". action: {} with no default_popup property.
- NOTES
  No web_accessible_resources required. No host_permissions — the extension accesses no external URLs. The absence of default_popup is intentional and mandatory; if added, chrome.action.onClicked will not fire.
- RELATED UC-001, UC-009 | BR-001, BR-036, BR-037, BR-038 | AR-001

---

## PT-002 : background.js (service worker)
- DESCRIPTION
  MV3 service worker that manages the single spreadsheet window lifecycle. Listens to chrome.action.onClicked (open or focus window), chrome.windows.onBoundsChanged (save window bounds), and chrome.windows.onRemoved (clear stored windowId). Persists and restores window bounds via chrome.storage.local.
- TECHNOLOGY RECOMMENDATIONS
  Vanilla JavaScript ES2020. Chrome Extension APIs: chrome.action.onClicked, chrome.windows.create, chrome.windows.get, chrome.windows.update, chrome.windows.onBoundsChanged, chrome.windows.onRemoved, chrome.storage.local.
- NOTES
  windowId stored in chrome.storage.local under key "excelWindowId". Bounds stored under key "excelWindowBounds" as {left, top, width, height}. Default bounds fallback: {left:80, top:60, width:1200, height:800}. Service worker may be terminated between events — always read state from storage, never rely on in-memory variables.
- RELATED UC-001, UC-009 | BR-001, BR-010, BR-036, BR-037, BR-038 | AR-001, AR-002

---

## PT-003 : app.html (main UI shell)
- DESCRIPTION
  The HTML document loaded in the popup window. Hosts all UI elements: title area, menu bar (File through View labels), Name Box input, fx label span, formula bar input, ribbon (Home tab groups), grid wrapper div, sheet tab bar, context menu div, and Help dialog element.
- TECHNOLOGY RECOMMENDATIONS
  Semantic HTML5. No framework. Native <dialog> for Help modal. <input type="text"> for Name Box and formula bar. <div> containers for ribbon groups and grid. Loads app.css and app.js.
- NOTES
  document.title set to "Book1 - Excel" by app.js on DOMContentLoaded. Context menu is a hidden <div id="context-menu"> made visible on right-click. Help dialog is <dialog id="help-dialog">. All JS wiring happens in app.js; app.html contains only structure.
- RELATED UC-001 | BR-001, BR-002, BR-003, BR-004, BR-005, BR-006, BR-007, BR-008, BR-009 | AR-002, AR-003

---

## PT-004 : app.css (Excel visual theme)
- DESCRIPTION
  Stylesheet providing the complete Microsoft Excel visual theme. Defines CSS custom properties for the color palette, Segoe UI font stack, menu bar, ribbon layout, grid cell dimensions, column header and row number sticky positioning, Name Box and formula bar layout, sheet tab bar appearance, context menu styling, and Help dialog.
- TECHNOLOGY RECOMMENDATIONS
  Vanilla CSS3. CSS custom properties on :root. Flexbox for menu bar, ribbon, and tab bar. CSS position:sticky for grid header cells. No external framework, icon font, or web font.
- NOTES
  Key custom properties: --excel-header-bg:#f2f2f2; --excel-selection:#185abd; --excel-header-hl:#d6e4f7; --excel-sheet-accent:#217346; --excel-font:'Segoe UI',system-ui,sans-serif. Active sheet tab: background:#fff; border-bottom:2px solid #217346. Inactive tab: background:#f0f0f0. Ribbon group label: font-size:10px; color:#666; text-align:center.
- RELATED UC-001, UC-011, UC-012, UC-013, UC-015 | BR-002, BR-003, BR-004, BR-007, BR-008, BR-009, BR-041, BR-044, BR-045, BR-046, BR-047, BR-050, BR-054 | AR-003, AR-004, AR-005

---

## PT-005 : app.js (main application module)
- DESCRIPTION
  The single JavaScript entry point that bootstraps all sub-components and wires event listeners on DOMContentLoaded. Initialises application state (sheets array, currentSheetIndex, dirty flag, undo stack, internal clipboard), renders the initial grid and sheet tab bar, and attaches the central keydown dispatch handler.
- TECHNOLOGY RECOMMENDATIONS
  Vanilla JavaScript ES2020+. No build tool. Loaded as <script defer src="app.js"> from app.html. All logical sub-modules (GridRenderer, CellModel, FormulaEngine, etc.) are defined within app.js.
- NOTES
  Module pattern avoids global namespace pollution — wrap in a single DOMContentLoaded callback or IIFE. Constants: COL_WIDTH=64, ROW_HEIGHT=21, GRID_ROWS=100, GRID_COLS=26, UNDO_LIMIT=100. All DOM element references are cached at startup.
- RELATED UC-001 | BR-001 | AR-002, AR-003

---

## PT-006 : GridRenderer (within app.js)
- DESCRIPTION
  Renders the visible spreadsheet grid: the corner cell, column header row (A, B, C…), row number column (1, 2, 3…), and data cell elements. Re-renders on sheet switch, CSV load, and targeted cell value updates. Highlights the active cell with a blue border and highlights its column header and row number with #d6e4f7 background.
- TECHNOLOGY RECOMMENDATIONS
  Vanilla JavaScript DOM manipulation. Column headers and row numbers rendered as <div> elements with position:sticky. Data cells as <div> elements with data-row and data-col attributes for event delegation.
- NOTES
  Initial grid: GRID_ROWS=100 rows × GRID_COLS=26 columns. Use event delegation on the grid container (one click listener) rather than per-cell listeners. On cell click: update activeRow/activeCol, refresh column header and row number highlight classes, update Name Box and formula bar. In-place edit mode (F2 or direct typing) converts the cell div into a contenteditable or inline <input>.
- RELATED UC-001, UC-002, UC-012 | BR-007, BR-008, BR-011, BR-045, BR-046, BR-047 | AR-005, AR-006

---

## PT-007 : CellModel (data layer within app.js)
- DESCRIPTION
  Data structure and accessor functions for the spreadsheet cell model. Provides getCellValue, setCellValue, setFormula, getFormat, setFormat, clearCell, insertRow, and deleteRow operations. Each sheet's cells object is keyed cells[row][col] = {value, formula, format}.
- TECHNOLOGY RECOMMENDATIONS
  Plain JavaScript objects. No external library. JSON.parse(JSON.stringify(cells)) for deep clone in undo snapshots. Row and column keys are 1-based integers.
- NOTES
  format object schema: {bold:false, italic:false, underline:false, align:'left'}. clearCell zeroes value and formula but preserves the format object (BR-058). insertRow: shift all rows >= targetRow down by one (renumber keys). deleteRow: shift all rows > targetRow up by one. getCellValue returns the display value — formula result if a formula is set, else the raw value string.
- RELATED UC-002, UC-003, UC-007, UC-013, UC-015 | BR-011, BR-012, BR-013, BR-014, BR-015, BR-016, BR-017, BR-029, BR-030, BR-048, BR-049, BR-050, BR-057, BR-058 | AR-006

---

## PT-008 : FormulaEngine (within app.js)
- DESCRIPTION
  Client-side formula parser and evaluator. Detects "=" prefix on input strings, tokenises the expression, evaluates arithmetic with correct operator precedence, resolves cell references and ranges against the current sheet's cells map, and computes SUM, AVERAGE, MIN, MAX, COUNT aggregates. Returns "#ERR" for any parse or evaluation error.
- TECHNOLOGY RECOMMENDATIONS
  Vanilla JavaScript. Recursive descent parser or tokenizer pattern. No external expression-evaluation library (e.g., math.js not required).
- NOTES
  Entry point: evaluate(formula, cells) → string. Cell reference resolution: parse column letters to 1-based index (A=1, Z=26, AA=27…), numeric row to integer. Range expansion: A1:A5 → array of [row,col] pairs. Circular reference guard: Set of "R×C" strings currently being evaluated; return '#ERR' on cycle. COUNT counts only numeric non-empty cells. Division by zero → '#ERR'.
- RELATED UC-003 | BR-017, BR-018, BR-019, BR-020 | AR-007

---

## PT-009 : RibbonComponent (within app.js)
- DESCRIPTION
  Manages rendering and interaction for the Home ribbon tab. Renders four labelled groups: Clipboard (Paste, Cut, Copy), Font (Bold, Italic, Underline), Alignment (Align Left, Center, Right), Number (placeholder). Toggles .active class on formatting buttons and applies the format change to the active cell's format object.
- TECHNOLOGY RECOMMENDATIONS
  Vanilla JavaScript DOM queries and classList manipulation. Native title attribute for tooltips. CSS .active class for pressed/toggled state.
- NOTES
  Bold, Italic, Underline are independent binary toggles. Alignment is mutually exclusive — clicking one clears the others in the format object. Ribbon state is refreshed on every cell-select event by reading the selected cell's format object and setting button .active accordingly. Clipboard group shares the same internal clipboard variable as the context menu Cut/Copy/Paste actions.
- RELATED UC-011 | BR-004, BR-041, BR-042, BR-043, BR-044 | AR-004

---

## PT-010 : NameBox and FormulaBar (within app.js)
- DESCRIPTION
  The Name Box input element (~80 px wide, left of the fx label) and the formula bar input element (wide, right of the fx label). Name Box shows the active cell address and accepts an address string to navigate on Enter. Formula bar shows raw cell content (formula string or plain value) and commits edits on Enter or Tab.
- TECHNOLOGY RECOMMENDATIONS
  Vanilla JavaScript. Two <input type="text"> elements. fx label as a <span> styled italic gray. No reactive binding library.
- NOTES
  Name Box width: 80px via CSS (width:80px; border:1px solid #ccc). On cell select: nameBox.value = columnLetter+rowNum. On Enter in name box: validate with /^[A-Za-z]+\d+$/, navigate or reset to current cell if invalid. Formula bar value: cell.formula if set, else cell.value. On Enter/Tab in formula bar: call shared cell-commit handler and return focus to grid. fx label CSS: font-style:italic; color:#666; margin-right:4px.
- RELATED UC-001, UC-004, UC-014 | BR-005, BR-006, BR-012, BR-021, BR-022, BR-023, BR-051, BR-052 | AR-008, AR-009

---

## PT-011 : CsvModule (within app.js)
- DESCRIPTION
  Handles CSV file import and export. Import: programmatically triggers an <input type="file" accept=".csv">, reads the selected file with FileReader, parses RFC 4180 CSV into the cell data model, and updates the document title. Export: serialises the current sheet's cell model to RFC 4180 CSV and triggers a browser file download via Blob and URL.createObjectURL.
- TECHNOLOGY RECOMMENDATIONS
  Vanilla JavaScript. FileReader API (readAsText). Blob API (new Blob([csv], {type:'text/csv'})). URL.createObjectURL / URL.revokeObjectURL. <a download> element pattern.
- NOTES
  RFC 4180 parsing: fields enclosed in double-quotes may contain commas, newlines, and doubled double-quotes (""). First row is treated as data, not forced headers. Import failure (binary or unreadable): alert() with message, leave grid unchanged, dirty flag unchanged. Export filename: trim " - Excel" from document.title and append ".csv". Undo stack cleared after successful import. URL.revokeObjectURL called immediately after a.click().
- RELATED UC-005, UC-006 | BR-024, BR-025, BR-026, BR-027, BR-028 | AR-010

---

## PT-012 : UndoStack (within app.js)
- DESCRIPTION
  A JavaScript array acting as the undo history for cell edits on the current sheet. Each entry is a deep clone of the sheet's cells object taken immediately before a cell commit. Ctrl+Z pops the most recent snapshot and restores it, reverting the last edit.
- TECHNOLOGY RECOMMENDATIONS
  Plain JavaScript array. JSON.parse(JSON.stringify(cells)) for deep clone. No external library.
- NOTES
  Push a snapshot before every setCellValue or setFormula call. Stack depth cap: 100 entries; remove oldest when exceeded (undoStack.shift()). On Ctrl+Z: pop, restore to currentSheet.cells, re-render grid, set dirty=true. Reset undoStack=[] on CSV load and on File > New. Redo is not required by any BR — do not implement.
- RELATED UC-008 | BR-033 | AR-011

---

## PT-013 : ContextMenu (within app.js)
- DESCRIPTION
  Custom right-click context menu. Suppresses the native browser context menu via event.preventDefault() on contextmenu events within the grid. Displays a position:fixed <div> with items: Cut, Copy, Paste, (separator), Insert Row, Delete Row, (separator), Clear Contents. Dismissed on click-outside or Escape.
- TECHNOLOGY RECOMMENDATIONS
  Vanilla JavaScript. position:fixed <div id="context-menu"> with CSS. document-level click listener (one-time) for outside-click dismissal. keydown Escape listener. No external popup library.
- NOTES
  Position: menuDiv.style.left = e.clientX + 'px'; menuDiv.style.top = e.clientY + 'px'. Styled: background:#fff; border:1px solid #ccc; box-shadow:0 2px 8px rgba(0,0,0,0.2). Item hover: background:#d6e4f7. Cut copies to internal clipboard variable and calls clearCell on source. Clear Contents removes value and formula from the cell model but preserves the cell's format object (BR-058). Insert/Delete Row invokes CellModel insertRow/deleteRow.
- RELATED UC-015 | BR-053, BR-054, BR-055, BR-056, BR-057, BR-058 | AR-012

---

## PT-014 : SheetManager (within app.js)
- DESCRIPTION
  Manages the array of sheet data objects, renders and updates the sheet tab bar DOM, handles tab click events and the "+" add-sheet button, and coordinates grid re-renders when the active sheet changes.
- TECHNOLOGY RECOMMENDATIONS
  Vanilla JavaScript. Flex-row <div id="sheet-tab-bar"> containing dynamically generated <button> elements per sheet plus a fixed <button id="add-sheet">+</button>. Overflow handled with overflow-x:auto.
- NOTES
  Active tab class: background:#fff; border-bottom:2px solid #217346. Inactive tab: background:#f0f0f0; no bottom border. On "+" click: push new sheet object, set currentSheetIndex, call renderTabBar() and renderGrid(). On tab click: set currentSheetIndex, call renderTabBar() (update active class) and renderGrid(). On sheet switch: clear active cell selection to avoid stale address.
- RELATED UC-001, UC-013 | BR-009, BR-048, BR-049, BR-050 | AR-014

---

## PT-015 : HelpDialog (within app.js)
- DESCRIPTION
  A native HTML <dialog> element rendered via showModal(). Displays a table of all registered keyboard shortcuts. Opened by pressing F1 or clicking the Help menu item. Closed by the built-in Escape key behaviour or by a Close button.
- TECHNOLOGY RECOMMENDATIONS
  Native HTML <dialog> element with showModal() and close(). No external modal library. Shortcut table populated from the SHORTCUTS constant array defined in the central keydown handler.
- NOTES
  <dialog id="help-dialog"> with a <table> listing Key and Action columns. Rows generated by iterating SHORTCUTS array at dialog open time (ensures live accuracy). showModal() provides native focus trapping. Escape key close is automatic with <dialog> — no additional listener needed for Escape. Close button: helpDialog.close(). Both F1 keydown handler and Help menu item call helpDialog.showModal().
- RELATED UC-010 | BR-035, BR-039, BR-040 | AR-013, AR-015

---
