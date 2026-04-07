# Design Instructions

Generated from `2-REQUIREMENTS.md`, `3-ARCHITECTURE-RECOMMENDATIONS.md`, and `3-PARTS LIST.md`. Owned by Technical Lead.

---

## DI-001 : Create manifest.json — Extension Manifest V3
- SUMMARY
  Create the Chrome Extension Manifest V3 declaration. Registers storage and windows permissions, points to the service worker, and declares an empty action so the toolbar icon appears and click events route to the service worker.
- SKILLSET REQUIRED
  Chrome Extension development, Manifest V3, JSON.
- IMPLEMENTATION STEPS
  1. Create `build/extension/manifest.json`:
     ```json
     {
       "manifest_version": 3,
       "name": "Excel",
       "version": "1.0.0",
       "description": "A browser-based spreadsheet with formulas and CSV support.",
       "permissions": ["storage", "windows"],
       "background": {
         "service_worker": "background.js"
       },
       "action": {}
     }
     ```
  2. Do NOT add `default_popup` — it suppresses `chrome.action.onClicked`.
  3. Do NOT add `host_permissions` — no external URLs are accessed.
- NOTES None
- RELATED UC-001, BR-001, BR-002, AR-001, PT-001

---

## DI-002 : Create background.js — Service Worker (Window Lifecycle)
- SUMMARY
  Implement the MV3 service worker. Handles toolbar icon click (open or focus window), tracks window bounds changes and writes them to chrome.storage.local, cleans up windowId on close. Includes error recovery for stale window references.
- SKILLSET REQUIRED
  Chrome Extension service workers, chrome.windows API, chrome.storage.local, async/await.
- IMPLEMENTATION STEPS
  1. Create `build/extension/background.js`.
  2. Module-level state: `let spreadsheetWindowId = null;`
  3. Implement `getStoredBounds()`:
     ```js
     async function getStoredBounds() {
       return new Promise(resolve => {
         chrome.storage.local.get('windowBounds', data => {
           resolve(data.windowBounds || { left: 100, top: 100, width: 1024, height: 700 });
         });
       });
     }
     ```
  4. Implement `openOrFocusWindow()`:
     ```js
     async function openOrFocusWindow() {
       if (spreadsheetWindowId !== null) {
         try {
           await chrome.windows.update(spreadsheetWindowId, { focused: true });
           return;
         } catch (_) {
           spreadsheetWindowId = null;
         }
       }
       const bounds = await getStoredBounds();
       const win = await chrome.windows.create({
         url: chrome.runtime.getURL('index.html'),
         type: 'popup',
         ...bounds,
       });
       spreadsheetWindowId = win.id;
     }
     ```
  5. Wire `chrome.action.onClicked.addListener(() => openOrFocusWindow().catch(console.error));`
  6. Wire `chrome.windows.onBoundsChanged.addListener(win => { if (win.id !== spreadsheetWindowId) return; const { left, top, width, height } = win; chrome.storage.local.set({ windowBounds: { left, top, width, height } }); });`
  7. Wire `chrome.windows.onRemoved.addListener(id => { if (id === spreadsheetWindowId) spreadsheetWindowId = null; });`
- NOTES
  Service worker is stateless between idle cycles; spreadsheetWindowId resets on eviction. Acceptable for this scope.
- RELATED UC-001, UC-009, BR-001, BR-002, BR-003, BR-031, BR-032, AR-001, AR-002, AR-003, PT-002

---

## DI-003 : Create index.html — UI Page Shell
- SUMMARY
  Create the single HTML page loaded in the spreadsheet window. Defines the structural layout: toolbar (File, Help menu buttons), formula bar, column header row, scrollable grid container, status bar, and help dialog.
- SKILLSET REQUIRED
  HTML5, extension page structure.
- IMPLEMENTATION STEPS
  1. Create `build/extension/index.html`:
     ```html
     <!DOCTYPE html>
     <html lang="en">
     <head>
       <meta charset="UTF-8">
       <title>Spreadsheet</title>
       <link rel="stylesheet" href="index.css">
     </head>
     <body>
       <div id="toolbar">
         <button class="menu-btn" data-menu="file">File</button>
         <button class="menu-btn" data-menu="help">Help</button>
       </div>
       <div id="dropdown-container"></div>
       <div id="formula-bar">
         <span id="cell-ref">A1</span>
         <input id="formula-input" type="text" autocomplete="off" spellcheck="false">
       </div>
       <div id="grid-wrapper">
         <table id="grid">
           <thead id="col-headers"></thead>
           <tbody id="grid-body"></tbody>
         </table>
       </div>
       <div id="statusbar"><span id="status-msg"></span></div>
       <dialog id="help-dialog">
         <h2>Keyboard Shortcuts</h2>
         <table id="shortcuts-table">
           <thead><tr><th>Shortcut</th><th>Action</th></tr></thead>
           <tbody></tbody>
         </table>
         <div id="help-footer"><button id="help-close">Close</button></div>
       </dialog>
       <input type="file" id="file-input" accept=".csv" style="display:none">
       <script src="csv.js"></script>
       <script src="formula.js"></script>
       <script src="app.js"></script>
     </body>
     </html>
     ```
  2. Hidden `<input type="file">` is triggered programmatically for CSV open.
  3. Load order: csv.js → formula.js → app.js (dependencies first).
- NOTES None
- RELATED UC-001, UC-002, UC-004, UC-010, BR-004, BR-005, BR-006, BR-033, AR-004, PT-003

---

## DI-004 : Create index.css — Spreadsheet Visual Styles
- SUMMARY
  Style the spreadsheet UI to resemble Microsoft Excel: white grid on light gray chrome, blue active cell highlight, sticky frozen headers, formula bar, toolbar. Use system Calibri/Aptos font stack.
- SKILLSET REQUIRED
  CSS3, sticky positioning, table layout, CSS custom properties.
- IMPLEMENTATION STEPS
  1. Create `build/extension/index.css`.
  2. Custom properties on `:root`: `--blue: #217346; --active-blue: #1565c0; --header-bg: #f3f3f3; --border: #d0d0d0; --white: #fff; --black: #000;`
  3. Reset + body: `box-sizing: border-box; margin: 0; font-family: Calibri, Aptos, Arial, sans-serif; font-size: 13px; height: 100vh; display: flex; flex-direction: column; overflow: hidden;`
  4. Toolbar: `display: flex; background: #f3f3f3; border-bottom: 1px solid var(--border); padding: 2px 4px;` Menu buttons: plain background, hover highlight.
  5. Formula bar: `display: flex; align-items: center; border-bottom: 1px solid var(--border); padding: 2px 4px; gap: 6px;` `#cell-ref`: fixed width 60px, monospace, border-right. `#formula-input`: flex:1, no border, outline none.
  6. Grid wrapper: `flex: 1; overflow: auto;` Grid table: `border-collapse: collapse; table-layout: fixed;`
  7. Column headers and row number cells: `position: sticky; background: var(--header-bg); border: 1px solid var(--border); text-align: center; font-weight: 600; user-select: none;` Col headers: `top: 0; z-index: 2;` Row number cell: `left: 0; z-index: 1;`
  8. Data cells: `border: 1px solid var(--border); min-width: 80px; height: 22px; padding: 1px 4px; overflow: hidden; white-space: nowrap;`
  9. Active cell: `outline: 2px solid var(--active-blue); outline-offset: -2px;`
  10. Status bar: fixed 20px bar, light background.
  11. Help dialog: white background, simple padding, table for shortcuts, centered close button.
- NOTES
  Column headers row must have `top: 0; z-index: 2` to freeze above data. Row number column must have `left: 0; position: sticky`.
- RELATED UC-001, BR-004, BR-006, AR-004, PT-004

---

## DI-005 : Create csv.js — RFC 4180 CSV Parser and Serializer
- SUMMARY
  Implement a standalone CSV module that (a) parses CSV text into a 2D string array per RFC 4180, handling quoted fields, embedded commas, newlines, and double-quote escaping; and (b) serializes a 2D string array back to RFC 4180 CSV text.
- SKILLSET REQUIRED
  JavaScript string parsing, RFC 4180 specification.
- IMPLEMENTATION STEPS
  1. Create `build/extension/csv.js`. Export two functions on a global `CSV` object (no module system needed in extension pages).
  2. Implement `CSV.parse(text)`:
     - Strip BOM (`\uFEFF`) if present.
     - Character-by-character state machine: states = FIELD_START, IN_FIELD, IN_QUOTED_FIELD, QUOTE_IN_QUOTED.
     - On `"` in FIELD_START → enter IN_QUOTED_FIELD.
     - On `""` in IN_QUOTED_FIELD → append single `"` and stay in state.
     - On closing `"` → QUOTE_IN_QUOTED; next char must be `,`, `\n`, `\r\n`, or EOF.
     - On `,` → end field, start next field in same row.
     - On `\n` or `\r\n` → end row.
     - Return `string[][]`.
  3. Implement `CSV.serialize(data)`:
     - For each row, for each cell: if the value contains `,`, `"`, `\n`, or `\r`, wrap in double-quotes and replace each `"` with `""`.
     - Join cells with `,`, join rows with `\r\n`.
     - Return string.
  4. Expose as `window.CSV = { parse, serialize };`
- NOTES
  Do not use `.split(',')` for parsing — it fails on quoted fields containing commas.
- RELATED UC-005, UC-006, BR-020, BR-022, BR-023, BR-024, BR-025, AR-008, PT-007

---

## DI-006 : Create formula.js — Recursive-Descent Formula Parser and Evaluator
- SUMMARY
  Implement a formula engine. Given a raw cell value starting with `=`, tokenize and parse it into an AST using a recursive-descent parser, then evaluate the AST against the current grid state. Never use eval(). Returns a computed value or an error token string (#ERR, #DIV/0!, #REF!).
- SKILLSET REQUIRED
  Recursive-descent parsing, AST evaluation, JavaScript.
- IMPLEMENTATION STEPS
  1. Create `build/extension/formula.js`. Expose `window.Formula = { evaluate };`.
  2. **Tokenizer** — convert expression string to token list:
     - Token types: NUMBER, STRING, IDENT (function names), CELL_REF (e.g. A1), RANGE_REF (e.g. A1:B3), OP (+,-,*,/), LPAREN, RPAREN, COMMA, EOF.
     - Cell ref regex: `/^[A-Z]+[0-9]+/i`. Range ref regex: `/^[A-Z]+[0-9]+:[A-Z]+[0-9]+/i` (check range before cell).
  3. **Parser** — recursive descent producing an AST:
     - `parseExpr → parseAddSub`
     - `parseAddSub → parseMulDiv (('+' | '-') parseMulDiv)*`
     - `parseMulDiv → parseUnary (('*' | '/') parseUnary)*`
     - `parseUnary → '-' parseUnary | parsePrimary`
     - `parsePrimary → NUMBER | CELL_REF | RANGE_REF | IDENT '(' argList ')' | '(' parseExpr ')'`
  4. **Evaluator** — walk the AST; resolve CELL_REF nodes by calling `getCellValue(ref, grid)` which returns the numeric value of the referenced cell (or 0 if empty, or #REF! if out of bounds). Resolve RANGE_REF nodes to a flat numeric array (skip non-numeric). Divide by zero → return '#DIV/0!'. Unknown function → return '#ERR'.
  5. **Supported functions**: SUM (sum array), AVERAGE (sum/count), MIN, MAX, COUNT (count of numeric values in range).
  6. **Dependency extraction**: expose `Formula.getRefs(raw)` that returns the list of cell addresses referenced by a formula (used by app.js for the dependency graph).
  7. Entry point: `Formula.evaluate(raw, grid)` — if raw does not start with `=`, return raw as-is. Strip leading `=`, tokenize, parse, evaluate; catch all errors and return '#ERR'.
- NOTES
  Security: never call eval() or Function(). All formula evaluation is through AST interpretation.
- RELATED UC-003, BR-011, BR-012, BR-013, BR-014, BR-015, AR-006, AR-007, PT-006

---

## DI-007 : Create app.js — Grid State, Rendering, Cell Interaction, and Dependency Graph
- SUMMARY
  Core application module. Manages the 2D cell state array, renders the grid to the DOM, handles cell selection and edit mode, syncs the formula bar, and maintains a dependency graph for formula recalculation. Triggered on DOMContentLoaded.
- SKILLSET REQUIRED
  Vanilla JavaScript ES6+, DOM manipulation, event handling, topological sort.
- IMPLEMENTATION STEPS
  1. Create `build/extension/app.js`.
  2. **State**: `const ROWS = 50, COLS = 26; let cells = []; let activeCell = {row:0, col:0}; let editMode = false; let isDirty = false;`
  3. **Init cells**: `cells = Array.from({length: ROWS}, () => Array.from({length: COLS}, () => ({raw:'', value:''})));`
  4. **Column letter helper**: `colLetter(c)` returns 'A' for 0, 'B' for 1, etc. `colIndex(letter)` returns 0 for 'A', etc. `cellRefToCoord('A1')` returns `{row:0, col:0}`.
  5. **Render**: `renderGrid()` — build the `<table>` header row with corner cell + A…Z column headers; build body rows with row-number cell + data cells. Each `<td>` has `data-row` and `data-col` attributes. Attach click listeners with delegation on `#grid-body`.
  6. **setActive(row, col)**: update `activeCell`, update `#cell-ref` text (e.g. "B3"), update `#formula-input` value to `cells[row][col].raw`, highlight active cell (add/remove CSS class).
  7. **Edit mode**: keydown on document — if printable key pressed while not in edit mode, clear cell raw, enter edit mode, set formula-input value. F2 or double-click: enter edit mode with existing content. In edit mode, Enter/Tab/Arrow: commitEdit() then navigate. Escape: cancelEdit().
  8. **commitEdit()**: read formula-input value → set cells[row][col].raw → recalculate(row, col) → setDirty(true) → exit edit mode → re-render affected cells.
  9. **cancelEdit()**: restore formula-input to pre-edit value → exit edit mode.
  10. **recalculate(changedRow, changedCol)**: rebuild all formula cells that directly or transitively depend on the changed cell using a simple BFS over the dependency graph. Evaluate each using `Formula.evaluate(raw, cells)`. Detect cycles (cell appears in its own dependency chain) → display '#CIRC'. Update `cells[r][c].value` for each.
  11. **recalculateAll()**: called on load. Evaluates all cells in row-major order (sufficient for acyclic sheets).
  12. **setDirty(v)**: sets isDirty flag; updates document.title with asterisk prefix if dirty.
- NOTES
  Use event delegation on `#grid-body` for cell clicks rather than per-cell listeners (50×26 = 1300 cells). Avoid re-rendering the entire table on each keystroke — only update the affected cell's textContent.
- RELATED UC-002, UC-003, UC-004, BR-004, BR-005, BR-006, BR-007, BR-008, BR-009, BR-010, BR-011, BR-014, BR-016, BR-017, BR-018, AR-004, AR-005, AR-006, AR-007, AR-009, PT-005

---

## DI-008 : Implement CSV open and save in app.js
- SUMMARY
  Add file open (user picks a .csv file → parse → populate grid) and file save (serialize grid → Blob download) to app.js. Both check dirty state before destructive operations. Error messages surface in the status bar.
- SKILLSET REQUIRED
  File API, Blob API, chrome.storage.local, CSV.parse/serialize.
- IMPLEMENTATION STEPS
  1. In `app.js`, implement `openCSV()`:
     ```js
     function openCSV() {
       if (isDirty && !window.confirm('Unsaved changes will be lost. Continue?')) return;
       document.getElementById('file-input').click();
     }
     ```
  2. Wire `#file-input` change event:
     ```js
     document.getElementById('file-input').addEventListener('change', e => {
       const file = e.target.files[0];
       if (!file) return;
       const reader = new FileReader();
       reader.onload = evt => {
         try {
           const rows = CSV.parse(evt.target.result);
           cells = Array.from({length: ROWS}, () => Array.from({length: COLS}, () => ({raw:'', value:''})));
           rows.forEach((row, r) => {
             row.forEach((val, c) => {
               if (r < ROWS && c < COLS) cells[r][c].raw = val;
             });
           });
           recalculateAll();
           renderGrid();
           setActive(0, 0);
           setDirty(false);
           showStatus('File loaded.');
         } catch (err) {
           showStatus('Error reading CSV: ' + err.message);
         }
       };
       reader.onerror = () => showStatus('Could not read file.');
       reader.readAsText(file);
       e.target.value = ''; // reset so same file can be re-opened
     });
     ```
  3. Implement `saveCSV()`:
     ```js
     function saveCSV() {
       const data = cells.map(row => row.map(cell => cell.raw));
       // trim trailing empty rows and cols
       let maxRow = 0, maxCol = 0;
       data.forEach((row, r) => row.forEach((v, c) => { if (v) { maxRow = Math.max(maxRow, r); maxCol = Math.max(maxCol, c); } }));
       const trimmed = data.slice(0, maxRow + 1).map(row => row.slice(0, maxCol + 1));
       const text = CSV.serialize(trimmed);
       const blob = new Blob([text], { type: 'text/csv' });
       const url = URL.createObjectURL(blob);
       const a = document.createElement('a');
       a.href = url; a.download = 'spreadsheet.csv';
       document.body.appendChild(a); a.click();
       document.body.removeChild(a);
       URL.revokeObjectURL(url);
       setDirty(false);
       showStatus('Saved.');
     }
     ```
  4. Implement `showStatus(msg)`: set `#status-msg` text, clear after 2 s.
- NOTES
  Save serializes `cell.raw` (the formula string), not the computed value — this preserves formulas in the CSV for future re-import.
- RELATED UC-005, UC-006, UC-007, BR-019, BR-020, BR-021, BR-022, BR-023, BR-024, BR-025, BR-026, BR-027, AR-008, PT-005, PT-007

---

## DI-009 : Implement menu bar, keyboard shortcuts, and Help dialog in app.js
- SUMMARY
  Define a SHORTCUTS data structure as the single source of truth for all menu actions and key bindings. Use it to render the File and Help dropdown menus, register keyboard shortcut listeners, and populate the Help dialog shortcut table.
- SKILLSET REQUIRED
  Vanilla JavaScript, DOM manipulation, keyboard event handling, HTML dialog.
- IMPLEMENTATION STEPS
  1. In `app.js`, define SHORTCUTS after all action functions are declared:
     ```js
     const SHORTCUTS = [
       { label: 'Open',       shortcut: 'Ctrl+O',    action: openCSV },
       { label: 'Save',       shortcut: 'Ctrl+S',    action: saveCSV },
       { label: 'Go to A1',   shortcut: 'Ctrl+Home', action: () => setActive(0, 0) },
       { label: 'Help',       shortcut: 'F1',        action: showHelp },
     ];
     const MENUS = {
       file: ['Open', 'Save'],
       help: ['Help'],
     };
     ```
  2. Implement `initMenus()`: for each `.menu-btn`, wire click → `openMenu(btn.dataset.menu, btn)`. `openMenu` builds a `<ul class="dropdown">` from SHORTCUTS filtered to that menu's labels, appends to `#dropdown-container`. Close dropdown on outside mousedown.
  3. Implement `initKeyboardShortcuts()`: iterate SHORTCUTS; parse shortcut string into `{ctrl, shift, key}`; register `keydown` on document; call `e.preventDefault()` and the action on match.
     ```js
     function matchesShortcut(e, shortcut) {
       const parts = shortcut.toLowerCase().split('+');
       const needsCtrl = parts.includes('ctrl');
       const needsShift = parts.includes('shift');
       const key = parts[parts.length - 1];
       return e.ctrlKey === needsCtrl && e.shiftKey === needsShift &&
              (e.key.toLowerCase() === key || e.code.replace('Key','').toLowerCase() === key);
     }
     ```
  4. Implement `showHelp()`: populate `#shortcuts-table tbody` from all SHORTCUTS entries; call `document.getElementById('help-dialog').showModal()`.
  5. Wire `#help-close` click → `dialog.close(); restoreFocus();`
  6. Wire `#help-dialog` 'cancel' event → `restoreFocus();` (Escape).
  7. `restoreFocus()`: return keyboard focus to the active cell element.
  8. Call `initMenus()` and `initKeyboardShortcuts()` from `DOMContentLoaded`.
- NOTES
  `Ctrl+Home` key: `e.key === 'Home'` and `e.ctrlKey === true`. Handle this edge case in matchesShortcut since 'home' does not map to a letter code.
- RELATED UC-008, UC-010, BR-028, BR-029, BR-030, BR-033, BR-034, BR-035, AR-009, AR-010, PT-005, PT-008
