# Architecture Recommendations

**Project:** Excel Chrome Extension
**Source:** 2-REQUIREMENTS.md (BR-001 – BR-058)
**Date:** 2026-04-07

---

## AR-001 : Use Chrome Extension Manifest V3 with a service worker background process
- RATIONALE
  Manifest V3 is the only supported manifest version for new Chrome extensions. MV3 replaces persistent background pages with event-driven service workers, which are the correct mechanism for managing toolbar icon clicks and window lifecycle. Building on MV3 ensures long-term platform support and compliance with Chrome store policies. The service worker persists the spreadsheet windowId and saves/restores window bounds via chrome.storage.local across service worker restarts.
- NOTES
  permissions: ["storage", "windows"]. background.service_worker: "background.js" in manifest.json. No default_popup in the action block — chrome.action.onClicked fires instead. Service workers are ephemeral; windowId and windowBounds must be stored in chrome.storage.local to survive termination between events.
- RELATED BR-001, BR-036, BR-037, BR-038 | UC-001, UC-009

---

## AR-002 : Open a standalone popup window and enforce single-instance via windowId validation
- RATIONALE
  chrome.windows.create with {type: 'popup'} creates an OS-level detached window free from browser chrome (tabs, omnibox, address bar). The service worker stores the resulting windowId in chrome.storage.local. On each icon click the service worker calls chrome.windows.get to verify the stored windowId; if the window still exists it calls chrome.windows.update with {focused: true}; otherwise it creates a fresh window. This guarantees single-instance behaviour without any coordination in app.js.
- NOTES
  chrome.windows.create options: {url: 'app.html', type: 'popup', left, top, width, height} — bounds sourced from chrome.storage.local or default constants. chrome.windows.get rejects with a runtime error when the windowId is stale — catch this to treat it as "window closed". The sheet tab bar showing Sheet1 (BR-009) is rendered by app.html on load, not by window creation.
- RELATED BR-001, BR-009, BR-010 | UC-001, UC-009

---

## AR-003 : Reproduce the Excel visual theme entirely in HTML/CSS using CSS custom properties; no external CSS framework
- RATIONALE
  Authentic Excel appearance requires a specific color palette (#f2f2f2 headers, #185abd selection border, #d6e4f7 header highlight on selection, #217346 sheet tab accent), Segoe UI system font, and exact layout proportions. CSS custom properties centralise all theme values so every component references a single source. All visual fidelity is achievable with native CSS — no external framework, icon library, or web font request is needed, keeping the extension package small and eliminating network dependencies.
- NOTES
  Define on :root: --excel-header-bg:#f2f2f2; --excel-selection:#185abd; --excel-header-hl:#d6e4f7; --excel-sheet-accent:#217346; --excel-font:'Segoe UI',system-ui,sans-serif. Title bar text "Book1 - Excel" set via document.title. Menu bar item labels must match Excel exactly (File, Home, Insert, Page Layout, Formulas, Data, Review, View). Only the Home tab ribbon is interactive for the initial build.
- RELATED BR-002, BR-003, BR-004, BR-005, BR-006, BR-007, BR-008 | UC-001

---

## AR-004 : Implement the Ribbon as pure HTML/CSS grouped sections with JS toggle classes for formatting state
- RATIONALE
  The Home ribbon requires four labelled button groups (Clipboard, Font, Alignment, Number) with flat icon buttons, group labels positioned below the buttons, and visual toggle feedback for Bold/Italic/Underline/alignment. This is fully achievable with flex-container group divs, CSS .active class toggling, and native title attributes for tooltips. No external component library is required. Toggle state is tracked in the cell's format object and reflected on every cell-select event.
- NOTES
  Each ribbon group is a <div class="ribbon-group"> containing <button> elements and a <span class="group-label"> at the bottom. Active state applied via .active class on the button. Tooltip via native title attribute — no additional implementation overhead. Alignment buttons are mutually exclusive (clicking one clears others). Clipboard group (Paste, Cut, Copy) reuses the same clipboard variable as the context menu.
- RELATED BR-004, BR-041, BR-042, BR-043, BR-044 | UC-001, UC-011

---

## AR-005 : Use CSS Grid with position:sticky for fixed column headers and row numbers; overflow:auto on the scrollable body
- RATIONALE
  The spreadsheet grid requires column letters (A, B, C…) and row numbers (1, 2, 3…) that remain fixed while data cells scroll in both directions. CSS position:sticky achieves this without JavaScript scroll synchronisation. A wrapper with overflow:auto contains the full grid; header cells carry top:0 or left:0 sticky positioning with a higher z-index than data cells. This is a pure CSS layout solution with no third-party grid library.
- NOTES
  Column header row: position:sticky; top:0; z-index:2; background:var(--excel-header-bg). Row number column: position:sticky; left:0; z-index:2; background:var(--excel-header-bg). Default column width: 64px; default row height: 21px — defined as JS constants (COL_WIDTH, ROW_HEIGHT) and applied as inline styles. Selected cell's column header and row number highlighted with background #d6e4f7.
- RELATED BR-007, BR-008, BR-045, BR-046, BR-047 | UC-001, UC-012

---

## AR-006 : Store cell data as a 2D plain-object map per sheet; track a dirty flag and active-sheet pointer
- RATIONALE
  A 2D plain-object map keyed `cells[row][col] = {value, formula, format:{bold, italic, underline, align}}` for each sheet provides O(1) reads and writes, handles sparse grids efficiently (empty cells consume no memory), and is trivially serialisable for CSV export. A boolean `dirty` flag is toggled on every edit and cleared on save or load; it gates the destructive-action confirmation prompt. The `currentSheetIndex` pointer switches between sheet data objects on tab change without losing any other sheet's data.
- NOTES
  `sheets` is an array of `{name, cells:{}}` objects. Row and column keys are 1-based integers. Format defaults: {bold:false, italic:false, underline:false, align:'left'}. `dirty` must be reset to false after a successful CSV load or after the user confirms a destructive action (BR-030); it must NOT be reset when the user cancels. In-memory only — cell data is not persisted to chrome.storage.local.
- RELATED BR-011, BR-012, BR-013, BR-014, BR-015, BR-016, BR-017, BR-029, BR-030, BR-048, BR-049, BR-050 | UC-002, UC-003, UC-007, UC-013

---

## AR-007 : Implement a client-side formula engine: "=" prefix detection, recursive arithmetic, cell references, aggregate functions
- RATIONALE
  Formulae beginning with "=" must be parsed and evaluated entirely in the browser. A recursive descent parser or tokeniser handles arithmetic precedence (+, -, *, /), parentheses, function calls (SUM, AVERAGE, MIN, MAX, COUNT), individual cell references (A1, $A$1), and range notation (A1:A5). Cell references are resolved from the current sheet's cells map. Any parse or evaluation error returns "#ERR" to the cell without crashing the application.
- NOTES
  Entry point: evaluate(formula, cells) → displayValue string. Live recalculation (BR-019): after any cell commit, re-evaluate all cells whose formula references the changed cell. Circular reference guard: maintain a Set of cell refs currently being evaluated; return '#ERR' if a cycle is detected. Division by zero and missing references also return '#ERR'. COUNT counts only numeric non-empty cells in range.
- RELATED BR-017, BR-018, BR-019, BR-020 | UC-003

---

## AR-008 : Implement the Name Box as a two-way bound <input> element with address parsing and navigation on Enter
- RATIONALE
  The Name Box (~80px wide, left of the fx label) must display the selected cell address (e.g., "A1") and accept a typed address which, when confirmed with Enter, scrolls and focuses the corresponding cell. This is a simple <input type="text"> element whose value is driven by cell-select events and whose keydown Enter handler triggers navigation. Two-way binding is managed directly within the central event handler — no reactive library is needed.
- NOTES
  Width: 80px enforced by CSS (width:80px; border:1px solid #ccc). On cell select: set value to uppercase column letter(s) + row number. On Enter in name box: validate with /^[A-Za-z]+\d+$/, parse column letters to index, scroll cell into view, set as active. On invalid input: reset value to current cell address and ignore.
- RELATED BR-005, BR-012, BR-051, BR-052 | UC-001, UC-014

---

## AR-009 : Implement the Formula Bar as a synced <input> displaying raw cell content; committed on Enter or Tab
- RATIONALE
  The formula bar is a wide <input type="text"> that always shows the raw content of the active cell: the formula string (e.g., "=SUM(A1:A3)") if a formula is set, or the plain value otherwise. It is updated on every cell-select event. Edits typed in the formula bar are committed to the cell model on Enter or Tab, using the same commit handler as direct in-cell editing. The italic gray "fx" label to its left is a non-interactive <span>.
- NOTES
  formula bar value: cell.formula if defined, else cell.value. On Enter in formula bar: call the shared cell-commit function, return focus to the grid. On Tab: commit and move focus to the right neighbour. fx label CSS: font-style:italic; color:#666; margin-right:4px. Formula bar edit takes precedence over ribbon formatting buttons while the bar is focused.
- RELATED BR-006, BR-021, BR-022, BR-023 | UC-001, UC-004

---

## AR-010 : CSV import via FileReader API (RFC 4180 parsing) and export via Blob + URL.createObjectURL
- RATIONALE
  The FileReader API reads user-selected .csv files into string content client-side with no server dependency. RFC 4180 parsing populates the cell data model and handles quoted fields containing commas, double-quotes, or newlines. Export serialises the data model back to an RFC 4180 CSV string and triggers a browser download via a Blob URL on a dynamically created <a download> anchor — again, no server is involved.
- NOTES
  Import: <input type="file" accept=".csv"> triggered programmatically; FileReader.readAsText for string content. Title updates to "<filename> - Excel" on successful load. On parse failure or binary content: call alert() with an error message and leave grid unchanged (BR-026); do not set dirty flag. Export: new Blob([csvString], {type:'text/csv'}); URL.revokeObjectURL immediately after a.click() to prevent memory leaks. Undo stack cleared on load.
- RELATED BR-024, BR-025, BR-026, BR-027, BR-028 | UC-005, UC-006

---

## AR-011 : Implement undo as a JavaScript array of full cell-map snapshots; Ctrl+Z pops and restores
- RATIONALE
  A custom undo stack (JS array of deep-cloned cells object snapshots) provides deterministic, framework-free undo with full control over depth and reset timing. A snapshot of the current sheet's cells is taken before every cell commit, so any edit can be reverted by one Ctrl+Z. The stack is explicitly cleared on CSV load to prevent cross-file undo. This approach is simpler and more reliable than browser execCommand-based undo, which is deprecated in extension pages.
- NOTES
  Deep clone via JSON.parse(JSON.stringify(cells)). Stack depth cap: 100 entries; trim oldest when exceeded. On Ctrl+Z: pop top snapshot, assign to currentSheet.cells, re-render grid, set dirty=true. Stack reset to [] on CSV load and on File > New. Redo is not required by any BR and must not be implemented.
- RELATED BR-033 | UC-008

---

## AR-012 : Implement the Context Menu as a position:fixed div shown on contextmenu event; dismissed on outside click or Escape
- RATIONALE
  The native browser context menu is suppressed via event.preventDefault() on the contextmenu event. A custom <div id="context-menu"> is positioned at the mouse coordinates using position:fixed and left/top from event.clientX/clientY. Items (Cut, Copy, Paste — separator — Insert Row, Delete Row — separator — Clear Contents) are <button> elements. A one-time document click listener dismisses the menu when clicking outside; Escape key also dismisses. This avoids any external popup library.
- NOTES
  Styled: background:#fff; border:1px solid #ccc; box-shadow:0 2px 6px rgba(0,0,0,0.2); font-family:var(--excel-font). Hover highlight: background:#d6e4f7. Cut copies cell value to an internal clipboard variable and clears the source cell. Clear Contents removes value and formula but leaves the format object intact. Insert Row shifts all rows >= target row down by one; Delete Row shifts rows above the target up by one.
- RELATED BR-053, BR-054, BR-055, BR-056, BR-057, BR-058 | UC-015

---

## AR-013 : Use the native HTML <dialog> element with showModal() for the Help dialog
- RATIONALE
  The native <dialog> element with showModal() provides browser-native focus trapping, Escape key dismissal, and backdrop rendering at zero implementation cost. It is the correct modern API for modal dialogs in extension pages. This eliminates any external modal library. The shortcut table inside the dialog is generated from the same SHORTCUTS constant used by the central keydown handler, guaranteeing that Help content and live shortcuts are always in sync.
- NOTES
  <dialog id="help-dialog"> opened via helpDialog.showModal(). Close button calls helpDialog.close(). Escape key is handled natively by <dialog> — no additional listener needed. F1 keydown and the Help menu item both call showModal(). The shortcuts table is rendered from a SHORTCUTS array: [{key, label}], the same array consulted by the keydown dispatch handler.
- RELATED BR-035, BR-039, BR-040 | UC-010

---

## AR-014 : Implement multi-sheet support as a JS array of sheet objects with a dynamically rendered flex tab bar
- RATIONALE
  Multiple sheets are managed as a JS array of `{name, cells}` objects. The active sheet is selected by index. Tab switching re-renders the grid from the new sheet's cells object — no save/restore step is needed because cells always live in the array. The tab bar is a flex row of <button> elements, one per sheet, plus a fixed "+" button. Active tab styling (white background, 2px solid #217346 bottom border) is applied via a CSS class, matching Excel's appearance.
- NOTES
  Initial state: sheets=[{name:'Sheet1',cells:{}}], currentSheetIndex=0. On "+" click: push {name:'Sheet'+(sheets.length+1),cells:{}}, increment index, re-render tabs and grid. Inactive tabs: background:#f0f0f0, no bottom border. Tab bar overflow: overflow-x:auto with horizontal scrolling. On sheet switch: clear active cell selection to avoid referencing a stale address in the new sheet.
- RELATED BR-009, BR-048, BR-049, BR-050 | UC-001, UC-013

---

## AR-015 : Centralise all keyboard shortcut handling in a single document keydown dispatch table
- RATIONALE
  A single document-level keydown event listener with a named SHORTCUTS dispatch table (keyed by modifier+key string) ensures every shortcut is registered in one place. This enables the Help dialog to render the shortcut list directly from the same data structure, guarantees preventDefault() is called for browser-shadowing shortcuts (Ctrl+S, Ctrl+O, F1), and prevents duplicate or conflicting listeners across UI sections.
- NOTES
  SHORTCUTS entries: {key:'ctrl+s',label:'Save',handler:fn}, {key:'ctrl+o',label:'Open',handler:fn}, {key:'ctrl+z',label:'Undo',handler:fn}, {key:'ctrl+home',label:'Go to A1',handler:fn}, {key:'F1',label:'Help',handler:fn}, {key:'F2',label:'Edit cell',handler:fn}, {key:'Escape',label:'Cancel edit',handler:fn}, plus Tab, Enter, arrow keys. Check active focus target (formula bar, name box, dialog) before routing. Arrow keys move cell selection only when no input is focused.
- RELATED BR-031, BR-032, BR-033, BR-034, BR-035 | UC-008

---
