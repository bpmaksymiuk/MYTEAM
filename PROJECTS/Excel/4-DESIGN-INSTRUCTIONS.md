# Design Instructions

**Project:** Excel Chrome Extension
**Source:** `2-REQUIREMENTS.md` (BR-001 – BR-058), `3-ARCHITECTURE-RECOMMENDATIONS.md`, `3-PARTS LIST.md`
**Date:** 2026-04-07
**Owned by:** Technical Lead

---

## DI-001 : Create manifest.json — Chrome MV3 Extension Manifest

- SUMMARY
  Create the Chrome Extension Manifest V3 declaration file that registers the extension name ("Excel"), version, required permissions, service worker entry point, toolbar action, and icon set. The `action` block must have no `default_popup` property so that `chrome.action.onClicked` fires in the service worker on toolbar icon click. Permissions `"storage"` and `"windows"` are both mandatory: `storage` for persisting window bounds and cell state, `windows` for creating and managing the detached popup window.

- IMPLEMENTATION STEPS
  1. Create `./build/extension/manifest.json` with the following exact structure:
     ```json
     {
       "manifest_version": 3,
       "name": "Excel",
       "version": "1.0.0",
       "description": "A standalone spreadsheet window that resembles Microsoft Excel.",
       "permissions": ["storage", "windows"],
       "background": {
         "service_worker": "background.js"
       },
       "action": {},
       "icons": {
         "16":  "icon16.png",
         "48":  "icon48.png",
         "128": "icon128.png"
       }
     }
     ```
  2. Confirm `action: {}` has no `default_popup` key — its presence would suppress `chrome.action.onClicked`.
  3. Confirm no `host_permissions` key — this extension accesses no external URLs.
  4. Confirm no `web_accessible_resources` key — `app.html` is opened as an internal extension page via `chrome.runtime.getURL('app.html')` and does not need to be web-accessible.
  5. Place placeholder PNG files `icon16.png`, `icon48.png`, `icon128.png` in `./build/extension/` for initial build; Chrome will show a generic icon until real icons are provided.

- SKILLSET REQUIRED
  Chrome Extension Manifest V3, JSON.

- NOTES
  The `"action": {}` block (with no properties) is required for the toolbar icon to appear; omitting `action` entirely hides the icon in some Chrome builds. Keep `"version"` at `"1.0.0"` for the initial build; the developer increments it on each release. The extension name `"Excel"` will appear in chrome://extensions — not in the app UI itself.

- RELATED
  BR-001, AR-001, PT-001 | UC-001

---

## DI-002 : Create background.js — Service Worker Window Management

- SUMMARY
  Implement the service worker that manages the single-instance spreadsheet popup window. On toolbar icon click, the worker checks whether a previously created window still exists; if it does, it focuses that window; if not (or on first launch), it creates a new `popup` window at the last saved or default bounds. Window bounds (position and size) are persisted to `chrome.storage.local` on every bounds change and restored on the next open. The stored window `id` must also be persisted to survive service worker termination between events.

- IMPLEMENTATION STEPS
  1. Create `./build/extension/background.js`.
  2. Declare constants for default window bounds at the top of the file:
     ```js
     const DEFAULT_BOUNDS = { width: 1200, height: 740, left: 80, top: 60 };
     const STORAGE_KEY_WINDOW_ID = 'windowId';
     const STORAGE_KEY_BOUNDS    = 'windowBounds';
     ```
  3. Implement the `openOrFocusWindow` async function:
     ```js
     async function openOrFocusWindow() {
       const { windowId } = await chrome.storage.local.get(STORAGE_KEY_WINDOW_ID);
       if (windowId != null) {
         try {
           await chrome.windows.get(windowId);
           await chrome.windows.update(windowId, { focused: true });
           return;
         } catch (_) {
           // Window no longer exists — fall through to create
         }
       }
       const { windowBounds } = await chrome.storage.local.get(STORAGE_KEY_BOUNDS);
       const bounds = windowBounds ?? DEFAULT_BOUNDS;
       const win = await chrome.windows.create({
         url:    chrome.runtime.getURL('app.html'),
         type:   'popup',
         width:  bounds.width,
         height: bounds.height,
         left:   bounds.left,
         top:    bounds.top,
       });
       await chrome.storage.local.set({ [STORAGE_KEY_WINDOW_ID]: win.id });
     }
     ```
  4. Register the click listener: `chrome.action.onClicked.addListener(openOrFocusWindow);`
  5. Register the window-removed listener to clear the stored windowId:
     ```js
     chrome.windows.onRemoved.addListener(async (removedId) => {
       const { windowId } = await chrome.storage.local.get(STORAGE_KEY_WINDOW_ID);
       if (removedId === windowId) {
         await chrome.storage.local.remove(STORAGE_KEY_WINDOW_ID);
       }
     });
     ```
  6. Register the bounds-changed listener to persist window position and size:
     ```js
     chrome.windows.onBoundsChanged.addListener(async (win) => {
       const { windowId } = await chrome.storage.local.get(STORAGE_KEY_WINDOW_ID);
       if (win.id === windowId) {
         await chrome.storage.local.set({
           [STORAGE_KEY_BOUNDS]: {
             width: win.width, height: win.height,
             left:  win.left,  top:    win.top,
           }
         });
       }
     });
     ```

- SKILLSET REQUIRED
  Chrome Extension MV3 service worker, `chrome.windows` API, `chrome.storage.local` API, async/await JavaScript.

- NOTES
  Service workers are ephemeral in MV3 — they terminate when idle. All persistent state (`windowId`, `windowBounds`) must live in `chrome.storage.local`, not in module-level variables, or it will be lost on worker restart. `chrome.windows.get` throws if the window does not exist — use a try/catch to detect this rather than checking for null. `chrome.windows.onBoundsChanged` was re-added in Chrome 86 and is stable in current MV3. The `DEFAULT_BOUNDS` defaults produce a centered-ish window at 1200×740, which is a typical Excel-like aspect ratio.

- RELATED
  BR-001, BR-010, BR-036, BR-037, BR-038, AR-001, AR-002, PT-002 | UC-001, UC-009

---

## DI-003 : Create app.html — Master UI Shell

- SUMMARY
  Create the single HTML document loaded inside the extension's detached popup window. It defines the complete DOM skeleton for all UI regions: menu bar (8 tab buttons), ribbon (host div for RibbonComponent), formula area (Name Box + fx label + formula bar), grid container (host for GridRenderer), sheet tab bar, context menu overlay, and Help dialog. No inline scripts or styles. All JavaScript is in `app.js` (deferred); all styles are in `app.css`. The `document.title` is set to `"Book1 - Excel"` by `app.js` on `DOMContentLoaded`.

- IMPLEMENTATION STEPS
  1. Create `./build/extension/app.html` with the following structure:
     ```html
     <!DOCTYPE html>
     <html lang="en">
     <head>
       <meta charset="UTF-8">
       <meta name="viewport" content="width=device-width, initial-scale=1.0">
       <title>Book1 - Excel</title>
       <link rel="stylesheet" href="app.css">
     </head>
     <body>
       <div id="menu-bar">
         <button class="menu-tab" data-menu="file">File</button>
         <button class="menu-tab" data-menu="home">Home</button>
         <button class="menu-tab" data-menu="insert">Insert</button>
         <button class="menu-tab" data-menu="page-layout">Page Layout</button>
         <button class="menu-tab" data-menu="formulas">Formulas</button>
         <button class="menu-tab" data-menu="data">Data</button>
         <button class="menu-tab" data-menu="review">Review</button>
         <button class="menu-tab" data-menu="view">View</button>
       </div>

       <div id="ribbon"></div>

       <div id="formula-area">
         <input id="name-box" type="text" aria-label="Name Box" autocomplete="off">
         <span id="fx-separator"></span>
         <span id="fx-label">fx</span>
         <input id="formula-bar" type="text" aria-label="Formula Bar" autocomplete="off">
       </div>

       <div id="grid-container">
         <table id="grid"></table>
       </div>

       <div id="sheet-tab-bar">
         <div id="sheet-tabs"></div>
         <button id="add-sheet-btn" title="Add Sheet">+</button>
       </div>

       <div id="context-menu" role="menu"></div>

       <dialog id="help-dialog" aria-labelledby="help-dialog-title">
         <h2 id="help-dialog-title">Keyboard Shortcuts</h2>
         <table id="shortcuts-table"></table>
         <button id="help-close-btn">Close</button>
       </dialog>

       <input id="file-input" type="file" accept=".csv" style="display:none">

       <script defer src="app.js"></script>
     </body>
     </html>
     ```
  2. Verify tab labels exactly match Excel wording: `File`, `Home`, `Insert`, `Page Layout`, `Formulas`, `Data`, `Review`, `View` (case-sensitive).
  3. The hidden `<input id="file-input" type="file" accept=".csv">` is the CSV open trigger — programmatically `.click()`ed by `app.js`.
  4. Do not add any `<style>` blocks or `<script>` elements other than the single deferred `app.js`.

- SKILLSET REQUIRED
  Semantic HTML5, Chrome Extension UI page structure, `<dialog>` element.

- NOTES
  The `<title>` in the HTML is a fallback only; `app.js` sets `document.title = 'Book1 - Excel'` on `DOMContentLoaded` and updates it to `'<filename> - Excel'` after a CSV import. The `<div id="ribbon">` is an empty host — `RibbonComponent` populates it at runtime. The `<table id="grid">` is likewise populated by `GridRenderer`. Using a native `<dialog>` with `showModal()` ensures focus trapping and Escape-key dismissal without custom logic.

- RELATED
  BR-002, BR-003, BR-004, BR-005, BR-006, BR-009, BR-022, BR-024, AR-003, PT-003 | UC-001

---

## DI-004 : Create app.css — Excel Visual Theme

- SUMMARY
  Create the stylesheet that implements the complete Microsoft Excel visual theme using CSS custom properties, Flexbox layout, and `position:sticky` for the frozen grid headers. No external CSS framework or web fonts are loaded. All color and spacing tokens are defined as custom properties on `:root` so they can be referenced consistently throughout the file. The layout is a vertical flex column filling `100vh`, with the grid container taking the remaining space via `flex:1`.

- IMPLEMENTATION STEPS
  1. Create `./build/extension/app.css`.
  2. Define all CSS custom properties on `:root`:
     ```css
     :root {
       --color-ribbon-bg:         #ffffff;
       --color-header-bg:         #f2f2f2;
       --color-header-border:     #d0d0d0;
       --color-selection-border:  #185abd;
       --color-selection-bg:      #cde4f5;
       --color-header-selected:   #d6e4f7;
       --color-grid-line:         #d0d0d0;
       --color-sheet-active-border: #217346;
       --font-ui:   'Segoe UI', system-ui, sans-serif;
       --font-cell: 'Calibri', sans-serif;
     }
     ```
  3. Set up the full-height flex column body:
     ```css
     *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
     html, body { height: 100%; overflow: hidden; font-family: var(--font-ui); font-size: 13px; }
     body { display: flex; flex-direction: column; height: 100vh; }
     ```
  4. Menu bar (height 28px, flat):
     ```css
     #menu-bar {
       display: flex; align-items: center; height: 28px;
       background: var(--color-ribbon-bg);
       border-bottom: 1px solid #d0d0d0; flex-shrink: 0;
     }
     .menu-tab {
       padding: 0 12px; height: 100%; border: none; background: none;
       cursor: pointer; font-size: 12px; font-family: var(--font-ui);
     }
     .menu-tab:hover { background: #e5e5e5; }
     ```
  5. Ribbon (height ~71px, grouped sections):
     ```css
     #ribbon {
       display: flex; flex-direction: row; align-items: stretch;
       height: 71px; background: var(--color-ribbon-bg);
       border-bottom: 1px solid #d0d0d0; padding: 2px 4px; flex-shrink: 0; overflow: hidden;
     }
     .ribbon-group {
       display: flex; flex-direction: column; align-items: flex-start;
       padding: 2px 6px; border-right: 1px solid #d8d8d8; min-width: max-content;
     }
     .ribbon-group-items { display: flex; flex-direction: row; align-items: center; gap: 2px; flex: 1; }
     .ribbon-group-label { font-size: 10px; color: #666; margin-top: auto; align-self: center; }
     .ribbon-btn {
       min-width: 28px; height: 44px; border: 1px solid transparent; background: none;
       cursor: pointer; font-family: var(--font-ui); font-size: 12px; padding: 2px 6px;
       border-radius: 2px; display: flex; flex-direction: column; align-items: center;
       justify-content: center;
     }
     .ribbon-btn:hover { background: #e5e5e5; border-color: #c8c8c8; }
     .ribbon-btn.active { background: #d0e4f5; border-color: #185abd; }
     .ribbon-select { height: 22px; font-family: var(--font-ui); font-size: 12px; border: 1px solid #ccc; }
     ```
  6. Formula area (height 24px):
     ```css
     #formula-area {
       display: flex; align-items: center; height: 24px; flex-shrink: 0;
       border-bottom: 1px solid #d0d0d0; padding: 0 4px; gap: 4px;
     }
     #name-box { width: 80px; height: 18px; border: 1px solid #ccc; font-size: 12px; padding: 0 4px; }
     #fx-separator { width: 1px; height: 16px; background: #d0d0d0; }
     #fx-label { font-style: italic; color: #666; font-size: 12px; padding: 0 4px; }
     #formula-bar { flex: 1; height: 18px; border: 1px solid transparent; font-size: 12px; padding: 0 4px; background: transparent; }
     #formula-bar:focus { border-color: #185abd; background: #fff; outline: none; }
     ```
  7. Grid container (flex:1, scrollable):
     ```css
     #grid-container { flex: 1; overflow: auto; position: relative; }
     #grid { border-collapse: collapse; table-layout: fixed; }
     ```
  8. Grid cells — column header row sticky top, row number column sticky left:
     ```css
     #grid thead th { position: sticky; top: 0; z-index: 10; background: var(--color-header-bg);
       border: 1px solid var(--color-header-border); width: 64px; height: 21px;
       font-weight: normal; font-size: 11px; text-align: center; }
     #grid thead th:first-child { position: sticky; left: 0; top: 0; z-index: 20; width: 40px; }
     #grid tbody tr td:first-child {
       position: sticky; left: 0; z-index: 5; background: var(--color-header-bg);
       border: 1px solid var(--color-header-border); width: 40px; height: 21px;
       font-size: 11px; text-align: center; }
     #grid tbody tr td {
       border: 1px solid var(--color-grid-line); width: 64px; height: 21px;
       font-family: var(--font-cell); font-size: 12px; padding: 0 3px;
       white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
     ```
  9. Cell selection and header highlight states:
     ```css
     td.selected { border: 2px solid var(--color-selection-border) !important; background: var(--color-selection-bg); }
     th.col-selected, td.row-selected { background: var(--color-header-selected) !important; }
     ```
  10. Sheet tab bar (height 28px):
      ```css
      #sheet-tab-bar {
        display: flex; align-items: center; height: 28px; flex-shrink: 0;
        background: #f0f0f0; border-top: 1px solid #d0d0d0; padding: 0 4px; gap: 2px;
      }
      .sheet-tab {
        padding: 0 12px; height: 22px; border: 1px solid #d0d0d0;
        background: #e0e0e0; cursor: pointer; font-size: 12px; border-radius: 2px 2px 0 0;
      }
      .sheet-tab.active { background: #ffffff; border-bottom: 3px solid var(--color-sheet-active-border); }
      #add-sheet-btn { padding: 0 8px; height: 22px; font-size: 14px; border: 1px solid #d0d0d0; background: #e0e0e0; cursor: pointer; }
      #add-sheet-btn:hover { background: #d0d0d0; }
      ```
  11. Context menu:
      ```css
      #context-menu {
        position: fixed; display: none; z-index: 1000; background: #fff;
        border: 1px solid #ccc; box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        font-family: var(--font-ui); font-size: 13px; min-width: 160px;
      }
      .ctx-item { padding: 6px 20px; cursor: pointer; white-space: nowrap; }
      .ctx-item:hover { background: var(--color-header-selected); }
      .ctx-separator { height: 1px; background: #d0d0d0; margin: 4px 0; }
      ```
  12. Help dialog:
      ```css
      #help-dialog { border: none; border-radius: 4px; box-shadow: 0 4px 16px rgba(0,0,0,0.3); padding: 20px;
        min-width: 400px; font-family: var(--font-ui); }
      #help-dialog::backdrop { background: rgba(0,0,0,0.3); }
      #shortcuts-table { width: 100%; border-collapse: collapse; margin: 12px 0; }
      #shortcuts-table td { padding: 4px 8px; border-bottom: 1px solid #eee; font-size: 12px; }
      #shortcuts-table td:first-child { font-weight: bold; white-space: nowrap; }
      #help-close-btn { float: right; padding: 4px 16px; cursor: pointer; }
      ```
  13. Error cell styling (for #ERR output):
      ```css
      .cell-error { color: red; }
      ```
  14. Ribbon tooltip: use the native `title` attribute on `.ribbon-btn` elements — no custom CSS needed for the MVP.

- SKILLSET REQUIRED
  Vanilla CSS3, CSS custom properties, Flexbox layout, `position:sticky`, table layout.

- NOTES
  Do NOT use `border-collapse: collapse` on cells that use `position:sticky` — it can cause rendering bugs in some browsers. The grid uses `border-collapse: collapse` globally but the sticky headers get their border drawn through individual `border` properties. `z-index` layering is critical: corner cell (row 0 / col 0) must be z-index:20, column headers z-index:10, row headers z-index:5. The `#grid-container` must have `overflow: auto` (not `overflow: scroll`) to avoid persistent scrollbars.

- RELATED
  BR-004, BR-007, BR-008, BR-011, BR-022, BR-044, BR-045, BR-046, BR-047, BR-050, BR-051, BR-054, AR-003, AR-004, AR-005, PT-004 | UC-001, UC-011, UC-012

---

## DI-005 : Implement CellModel — Data Layer

- SUMMARY
  Implement the `CellModel` object within `app.js` that stores and manages all spreadsheet data across multiple sheets. Each sheet holds a cells map keyed by `[row][col]` (1-based integers), where each cell entry is `{value, formula, format}`. The model provides accessor methods for reading and writing cell values, applying formatting, clearing content, and mutating row structure. It also tracks a `dirty` flag (set on any write, cleared on CSV load). The `snapshot()` and `restore()` pair enables the undo stack.

- IMPLEMENTATION STEPS
  1. Within `app.js`, define the CellModel factory before the DOMContentLoaded callback:
     ```js
     function createCellModel() {
       // sheets: [{name, cells}] — cells is {row: {col: {value, formula, format}}}
       const sheets = [{ name: 'Sheet1', cells: {} }];
       let currentSheetIndex = 0;
       let dirty = false;

       function currentCells() { return sheets[currentSheetIndex].cells; }

       function getCell(r, c) {
         const cells = currentCells();
         return (cells[r] && cells[r][c]) ? cells[r][c] : null;
       }

       function ensureCell(r, c) {
         const cells = currentCells();
         if (!cells[r]) cells[r] = {};
         if (!cells[r][c]) cells[r][c] = {
           value: '', formula: '', format: { bold: false, italic: false, underline: false, align: 'left' }
         };
         return cells[r][c];
       }

       function setCellRaw(r, c, raw) {
         const cell = ensureCell(r, c);
         if (raw.startsWith('=')) {
           cell.formula = raw; cell.value = '';
         } else {
           cell.formula = ''; cell.value = raw;
         }
         dirty = true;
       }

       function setFormat(r, c, formatKey, formatValue) {
         ensureCell(r, c).format[formatKey] = formatValue;
       }

       function clearCell(r, c) {
         // Clears value+formula but preserves format
         const cell = getCell(r, c);
         if (cell) { cell.value = ''; cell.formula = ''; }
         dirty = true;
       }

       function insertRow(targetRow) {
         const cells = currentCells();
         const rows = Object.keys(cells).map(Number).sort((a,b) => b-a);
         for (const r of rows) {
           if (r >= targetRow) { cells[r+1] = cells[r]; delete cells[r]; }
         }
         dirty = true;
       }

       function deleteRow(targetRow) {
         const cells = currentCells();
         delete cells[targetRow];
         const rows = Object.keys(cells).map(Number).sort((a,b) => a-b);
         for (const r of rows) {
           if (r > targetRow) { cells[r-1] = cells[r]; delete cells[r]; }
         }
         dirty = true;
       }

       function snapshot() {
         return JSON.parse(JSON.stringify(sheets[currentSheetIndex].cells));
       }

       function restore(snap) {
         sheets[currentSheetIndex].cells = JSON.parse(JSON.stringify(snap));
       }

       function addSheet(name) { sheets.push({ name, cells: {} }); }

       function switchSheet(index) { currentSheetIndex = index; }

       return { sheets, get currentSheetIndex() { return currentSheetIndex; },
                get dirty() { return dirty; }, set dirty(v) { dirty = v; },
                getCell, setCellRaw, setFormat, clearCell, insertRow, deleteRow,
                snapshot, restore, addSheet, switchSheet };
     }
     const model = createCellModel();
     ```
  2. The `format` object schema for each cell is `{bold, italic, underline, align}`. Initialize defaults to `{bold:false, italic:false, underline:false, align:'left'}` in `ensureCell`.
  3. `clearCell` must preserve the `format` object — only `value` and `formula` are cleared (BR-058).
  4. `insertRow` renumbers all rows >= targetRow upward by 1. `deleteRow` removes targetRow and renumbers rows above downward by 1. Operate on integer row keys.
  5. `setCellRaw` distinguishes formula cells from value cells by the leading `=` character. FormulaEngine resolves the display value separately.

- SKILLSET REQUIRED
  Vanilla JavaScript ES2020+, plain-object data structures, JSON deep clone.

- NOTES
  Row and column indices are 1-based throughout the model and renderer. Do NOT use arrays — objects with integer keys allow sparse storage and efficient row renumbering. `JSON.parse(JSON.stringify(...))` for deep clone is safe here because cell data contains only primitives. `dirty` is set on every `setCellRaw`, `clearCell`, `insertRow`, `deleteRow`, and `setFormat` call. The multi-sheet `sheets` array and `currentSheetIndex` are managed here; `SheetManager` (DI-013) drives the switch logic via `model.switchSheet()`.

- RELATED
  BR-011, BR-042, BR-043, BR-049, BR-057, BR-058, AR-006, PT-005, PT-007 | UC-002, UC-011, UC-013, UC-015

---

## DI-006 : Implement FormulaEngine — Client-Side Formula Evaluator

- SUMMARY
  Implement the `FormulaEngine` object within `app.js` that evaluates formula strings (beginning with `=`) into computed values. It uses a recursive-descent parser to handle arithmetic with correct operator precedence, cell reference resolution, and a set of aggregate functions (SUM, AVERAGE, MIN, MAX, COUNT) over rectangular cell ranges. Non-formula inputs (not starting with `=`) are returned as-is. Any parse or runtime error returns the string `"#ERR"`. No external libraries are used.

- IMPLEMENTATION STEPS
  1. Define `FormulaEngine` as a plain object in `app.js`:
     ```js
     const FormulaEngine = {
       evaluate(raw, getCellRaw) {
         if (!raw || !raw.startsWith('=')) return raw ?? '';
         try {
           return String(this._parseExpr(raw.slice(1).trim(), getCellRaw));
         } catch { return '#ERR'; }
       },
       // ... see steps below
     };
     ```
  2. Implement cell reference conversion (column letters → 1-based number):
     ```js
     _colIndex(letters) {
       return letters.toUpperCase().split('').reduce((n, ch) => n * 26 + ch.charCodeAt(0) - 64, 0);
     }
     _cellRef(ref, getCellRaw) {
       const m = ref.match(/^\$?([A-Z]+)\$?(\d+)$/i);
       if (!m) throw new Error('bad ref');
       const raw = getCellRaw(parseInt(m[2], 10), this._colIndex(m[1]));
       const v = this.evaluate(raw, getCellRaw);
       const n = parseFloat(v);
       return isNaN(n) ? 0 : n;
     }
     ```
  3. Implement range expansion for aggregate functions:
     ```js
     _expandRange(rangeStr, getCellRaw) {
       const m = rangeStr.match(/^\$?([A-Z]+)\$?(\d+):\$?([A-Z]+)\$?(\d+)$/i);
       if (!m) throw new Error('bad range');
       const c1 = this._colIndex(m[1]), r1 = parseInt(m[2],10);
       const c2 = this._colIndex(m[3]), r2 = parseInt(m[4],10);
       const vals = [];
       for (let r = r1; r <= r2; r++)
         for (let c = c1; c <= c2; c++) {
           const raw = getCellRaw(r, c);
           const v   = this.evaluate(raw, getCellRaw);
           const n   = parseFloat(v);
           if (!isNaN(n)) vals.push(n);
         }
       return vals;
     }
     ```
  4. Implement aggregate function dispatch:
     ```js
     _callFunc(name, arg, getCellRaw) {
       const fn = name.toUpperCase();
       const nums = this._expandRange(arg.trim(), getCellRaw);
       if (fn === 'SUM')     return nums.reduce((a,b) => a+b, 0);
       if (fn === 'AVERAGE') return nums.length ? nums.reduce((a,b)=>a+b,0)/nums.length : 0;
       if (fn === 'MIN')     return nums.length ? Math.min(...nums) : 0;
       if (fn === 'MAX')     return nums.length ? Math.max(...nums) : 0;
       if (fn === 'COUNT')   return nums.length;
       throw new Error('unknown fn');
     }
     ```
  5. Implement recursive-descent parser with correct precedence (`_parseExpr` → additive; `_parseTerm` → multiplicative; `_parseFactor` → literal / cell-ref / function / parenthesized):
     ```js
     _parseExpr(src, getCellRaw) {
       let pos = 0;
       const peek = () => src[pos];
       const consume = () => src[pos++];
       const skipWS = () => { while (src[pos] === ' ') pos++; };

       const parseNumber = () => {
         let s = ''; if (src[pos]==='-'){s+=consume();}
         while (pos<src.length && /[\d.]/.test(src[pos])) s+=consume();
         return parseFloat(s);
       };
       const parseFactor = () => {
         skipWS();
         if (peek() === '(') { consume(); const v=parseAddSub(); skipWS(); consume(/*')'*/); return v; }
         const funcM = src.slice(pos).match(/^([A-Z]+)\(/i);
         if (funcM) {
           pos += funcM[0].length;
           let arg=''; let d=1;
           while(pos<src.length){const ch=consume();if(ch==='(')d++;if(ch===')')d--;if(d===0)break;arg+=ch;}
           return this._callFunc(funcM[1], arg, getCellRaw);
         }
         const refM = src.slice(pos).match(/^\$?[A-Z]+\$?\d+/i);
         if (refM) { pos += refM[0].length; return this._cellRef(refM[0], getCellRaw); }
         return parseNumber();
       };
       const parseMulDiv = () => {
         skipWS(); let v = parseFactor();
         while(pos<src.length){skipWS();const op=peek();if(op!=='*'&&op!=='/') break;consume();skipWS();const r=parseFactor();v=op==='*'?v*r:v/r;}
         return v;
       };
       const parseAddSub = () => {
         skipWS(); let v = parseMulDiv();
         while(pos<src.length){skipWS();const op=peek();if(op!=='+'&&op!=='-') break;consume();skipWS();const r=parseMulDiv();v=op==='+'?v+r:v-r;}
         return v;
       };
       return parseAddSub();
     }
     ```
  6. In `app.js`, create a helper `getCellRaw(r, c)` that reads `model.getCell(r, c)?.formula || model.getCell(r, c)?.value || ''` and pass it to `FormulaEngine.evaluate`.
  7. After every `model.setCellRaw(r, c, raw)` call, loop over all non-empty cells in the current sheet and re-evaluate all formula cells to produce display values (full recalculation on every change).

- SKILLSET REQUIRED
  Vanilla JavaScript, recursive-descent parsing, operator precedence, regex.

- NOTES
  Circular reference detection is not required for the initial build — a formula that references itself will produce 0 due to the `isNaN → 0` guard in `_cellRef`. Display `"#ERR"` in red text for any exception (see `app.css` `.cell-error`). The `getCellRaw` callback must be a closure over the current sheet's model to avoid stale data. Absolute cell references (`$A$1`) are stripped of `$` signs and handled the same as relative references — no offset calculation is needed since the engine is not doing copy/paste formula adjustment.

- RELATED
  BR-017, BR-018, BR-019, BR-020, AR-007, PT-005, PT-008 | UC-003

---

## DI-007 : Implement GridRenderer — DOM Grid Builder

- SUMMARY
  Implement the `GridRenderer` object within `app.js` that builds and manages the spreadsheet grid DOM. It renders a `<table>` with a sticky header row (column letters) and sticky first-column cells (row numbers). Cell selection is tracked with CSS classes. In-place editing is provided via an inline `<input>`. The renderer uses event delegation on the grid container for all cell interactions. On selection change it updates Name Box, formula bar, and ribbon toggle state.

- IMPLEMENTATION STEPS
  1. Define constants at the top of `app.js`:
     ```js
     const GRID_ROWS = 100, GRID_COLS = 26;
     const COL_WIDTH = 64, ROW_HEIGHT = 21;
     ```
  2. Implement `colLetter(c)` — convert 1-based column index to letter(s):
     ```js
     function colLetter(c) {
       let s = '';
       while (c > 0) { s = String.fromCharCode(65 + (c-1)%26) + s; c = Math.floor((c-1)/26); }
       return s;
     }
     ```
  3. Implement `GridRenderer.build(container, model)`:
     - Clear `container.innerHTML`.
     - Create `<thead>` with a row of `<th>` elements: first cell is blank corner (class `corner`), then one `<th>` per column (text = `colLetter(c)`), each with class `col-header` and `data-col=c`.
     - Create `<tbody>` with GRID_ROWS rows. First cell in each row is `<td class="row-header" data-row=r>` containing the row number. Remaining cells are `<td class="cell" data-row=r data-col=c>`.
     - Attach a single `click` listener on `container` using event delegation: if `e.target.dataset.row && e.target.dataset.col`, call `GridRenderer.selectCell(r, c)`.
     - Attach a single `dblclick` listener for in-place edit (same delegation pattern), call `GridRenderer.startEdit(r, c)`.
     - Attach a `contextmenu` listener delegated to cells; call `ContextMenu.show(r, c, e)`.
  4. Implement `GridRenderer.selectCell(r, c)`:
     - Remove class `selected` from `activeCell` td and `col-selected`/`row-selected` from previous headers.
     - Update `state.activeRow = r`, `state.activeCol = c`.
     - Add class `selected` to the new cell td.
     - Add class `col-selected` to the corresponding `col-header` th.
     - Add class `row-selected` to the corresponding `row-header` td.
     - Update `nameBox.value = colLetter(c) + r`.
     - Update `formulaBar.value = model.getCell(r,c)?.formula || model.getCell(r,c)?.value || ''`.
     - Call `RibbonComponent.syncToggleState(r, c, model)` to update Bold/Italic/Underline/Align button states.
  5. Implement `GridRenderer.setCellDisplay(r, c, text)`:
     - Find the cell td by `querySelector('[data-row="'+r+'"][data-col="'+c+'"]')`.
     - Set its `textContent = text`.
     - Toggle class `cell-error` if `text === '#ERR'`.
     - Apply `model.getCell(r,c)?.format` to the element's style: `fontWeight`, `fontStyle`, `textDecoration`, `textAlign`.
  6. Implement `GridRenderer.startEdit(r, c)`:
     - If already in edit mode, commit current edit first.
     - Get the target `<td>` and record `state.editPriorValue` (the cell's current raw value).
     - Create an `<input>` with `style="width:100%;height:100%;border:none;outline:none;padding:0 3px;"`.
     - Set input value to the cell's formula or value.
     - Replace td content with the input and focus it.
     - On `input` event: mirror value to `formulaBar.value`.
     - On `keydown` within the input, intercept Enter/Tab/Escape/arrows and call `GridRenderer.commitEdit` or `GridRenderer.cancelEdit`.
  7. Implement `GridRenderer.commitEdit(r, c, value)`:
     - Push undo snapshot: `undoStack.push(model.snapshot())`.
     - Call `model.setCellRaw(r, c, value)`.
     - Run full recalculation (`recalcAll()`).
     - Re-render all cells in the current sheet via `GridRenderer.setCellDisplay`.
     - Restore td to non-edit state, move focus per navigation key pressed.
  8. Implement `GridRenderer.cancelEdit(r, c)`:
     - Restore td content to `state.editPriorValue`, exit edit mode without modifying model.
  9. Implement `recalcAll()`: iterate all non-empty cells in `model.sheets[model.currentSheetIndex].cells`, call `FormulaEngine.evaluate` for each formula cell, update display via `GridRenderer.setCellDisplay`.

- SKILLSET REQUIRED
  Vanilla JavaScript DOM manipulation, event delegation, CSS class management, HTML table construction.

- NOTES
  Performance: Do NOT re-build the entire table on every cell change — only update affected cells via `setCellDisplay`. Full re-build (`GridRenderer.build`) is only called on sheet switch or CSV import. In-place edit uses a real `<input>` inserted into the `<td>`, not `contenteditable` — contenteditable causes XSS concerns with paste. The sticky header z-indices defined in `app.css` (DI-004) must be applied via CSS classes, not inline styles. Arrow key behavior in edit mode: if the arrow key is pressed while the input is focused, commit the edit and move selection in the arrow direction (mirroring Excel behavior).

- SKILLSET REQUIRED
  Vanilla JavaScript DOM, event delegation, HTML table, CSS class management.

- NOTES
  Cell td elements are identified by `data-row` and `data-col` attributes (1-based). Never construct cell references by position in a NodeList — DOM order changes if rows are inserted/deleted.

- RELATED
  BR-007, BR-008, BR-011, BR-013, BR-014, BR-015, BR-016, BR-045, BR-046, BR-047, AR-005, AR-006, PT-005, PT-006 | UC-001, UC-002, UC-012

---

## DI-008 : Implement RibbonComponent — Ribbon Toolbar Renderer

- SUMMARY
  Implement `RibbonComponent` within `app.js` that builds the Home ribbon from a `RIBBON_CONFIG` constant and handles formatting actions. Each config group becomes a `.ribbon-group` element with its buttons (or selects) in `.ribbon-group-items` and its label below. Toggle buttons (bold, italic, underline, alignment) maintain an `active` CSS class reflecting the selected cell's format state. Formatting actions call `model.setFormat`, push an undo snapshot, and re-render the affected cell.

- IMPLEMENTATION STEPS
  1. Define `RIBBON_CONFIG` constant in `app.js` before `DOMContentLoaded`:
     ```js
     const RIBBON_CONFIG = [
       { group: 'Clipboard', items: [
         { id: 'cut',   label: 'Cut',   icon: '✂',  handler: () => ContextMenu.doCut()   },
         { id: 'copy',  label: 'Copy',  icon: '⧉',  handler: () => ContextMenu.doCopy()  },
         { id: 'paste', label: 'Paste', icon: '📋', handler: () => ContextMenu.doPaste() },
       ]},
       { group: 'Font', items: [
         { id: 'font-name', type: 'select', options: ['Calibri','Arial','Times New Roman'], handler: doFontName },
         { id: 'font-size', type: 'select', options: ['8','9','10','11','12','14','16','18','20','24'], handler: doFontSize },
         { id: 'bold',      label: 'B', toggle: true, handler: doBold      },
         { id: 'italic',    label: 'I', toggle: true, handler: doItalic    },
         { id: 'underline', label: 'U', toggle: true, handler: doUnderline },
       ]},
       { group: 'Alignment', items: [
         { id: 'align-left',   label: '⬅', toggle: true, alignGroup: true, handler: doAlignLeft   },
         { id: 'align-center', label: '☰', toggle: true, alignGroup: true, handler: doAlignCenter },
         { id: 'align-right',  label: '➡', toggle: true, alignGroup: true, handler: doAlignRight  },
       ]},
       { group: 'Number', items: [
         { id: 'number-format', type: 'select', options: ['General','Number','Currency','Percentage','Date'], handler: doNumberFormat },
       ]},
     ];
     ```
  2. Implement `RibbonComponent.render(ribbonEl)`:
     - Clear `ribbonEl.innerHTML`.
     - For each group in `RIBBON_CONFIG`, create a `<div class="ribbon-group">` with:
       - A `<div class="ribbon-group-items">` child containing one element per item:
         - `type === 'select'`: `<select class="ribbon-select">` with one `<option>` per option string; attach `change` event → `item.handler(select.value)`.
         - Toggle/regular button: `<button class="ribbon-btn" id="ribbon-{item.id}" title="{item.label}">` with text `item.icon ?? item.label`; attach `click` event → `item.handler()`.
       - A `<span class="ribbon-group-label">` child with group name text.
     - Store button element references by `item.id` in `RibbonComponent._buttons = {}`.
  3. Implement `RibbonComponent.syncToggleState(r, c, model)`:
     - Get the cell format: `const fmt = model.getCell(r,c)?.format ?? {}`.
     - Set `active` class on `#ribbon-bold` if `fmt.bold`, remove otherwise.
     - Set `active` class on `#ribbon-italic` if `fmt.italic`, remove otherwise.
     - Set `active` class on `#ribbon-underline` if `fmt.underline`, remove otherwise.
     - For alignment: set `active` only on the button matching `fmt.align` (`'left'`/`'center'`/`'right'`).
  4. Implement handler functions — each must push an undo snapshot before mutating, call `model.setFormat`, then call `GridRenderer.setCellDisplay`:
     ```js
     function doBold() {
       const { r, c } = state.active;
       undoStack.push(model.snapshot());
       const cur = model.getCell(r,c)?.format?.bold ?? false;
       model.setFormat(r, c, 'bold', !cur);
       GridRenderer.setCellDisplay(r, c, model.getCell(r,c).value || model.getCell(r,c).formula || '');
       RibbonComponent.syncToggleState(r, c, model);
     }
     // doItalic and doUnderline follow the same pattern for their respective format keys.
     // doAlignLeft/Center/Right set format.align to 'left'/'center'/'right' respectively.
     ```
  5. Font name and size handlers (`doFontName`, `doFontSize`) apply inline style to the target cell td directly for the initial build (storing in format object is optional).

- SKILLSET REQUIRED
  Vanilla JavaScript DOM, CSS class toggling, event handling, configuration-driven rendering.

- NOTES
  The ribbon is rendered once on `DOMContentLoaded`; it is NOT re-rendered on tab switch (only Home tab ribbon is required). `syncToggleState` must be called on every cell selection change. Alignment buttons form a mutually exclusive group — only one can be `active` at a time; clear `active` from all three before setting the new one. Ribbon buttons use the `title` attribute for native browser tooltips — no custom tooltip JS is needed for MVP. The `ContextMenu.doCut/doCopy/doPaste` functions are reused by Clipboard ribbon buttons for DRY implementation.

- RELATED
  BR-004, BR-041, BR-042, BR-043, BR-044, AR-004, PT-005, PT-009 | UC-001, UC-011

---

## DI-009 : Implement NameBox and FormulaBar

- SUMMARY
  Wire the `<input id="name-box">` and `<input id="formula-bar">` elements (rendered in DI-003) to the application state. The Name Box displays and accepts a cell address; the formula bar displays the raw formula or value of the active cell and accepts inline edits. Both inputs are synchronized to cell selection events. Edits in the formula bar are committed on Enter (applying the value to the active cell); Escape cancels the edit.

- IMPLEMENTATION STEPS
  1. Cache DOM references at the top of the `DOMContentLoaded` callback:
     ```js
     const nameBox    = document.getElementById('name-box');
     const formulaBar = document.getElementById('formula-bar');
     ```
  2. Implement `updateFormulaArea(r, c)` — called after every selection change:
     ```js
     function updateFormulaArea(r, c) {
       nameBox.value    = colLetter(c) + r;
       const cell       = model.getCell(r, c);
       formulaBar.value = cell?.formula || cell?.value || '';
     }
     ```
     Call from `GridRenderer.selectCell` and after each cell commit.
  3. Wire Name Box navigation:
     ```js
     nameBox.addEventListener('keydown', e => {
       if (e.key !== 'Enter' && e.key !== 'Tab') return;
       e.preventDefault();
       const m = nameBox.value.trim().match(/^([A-Za-z]+)(\d+)$/);
       if (m) {
         const c = colLetter_toIndex(m[1]);   // inverse of colLetter()
         const r = parseInt(m[2], 10);
         if (r >= 1 && r <= GRID_ROWS && c >= 1 && c <= GRID_COLS)
           GridRenderer.selectCell(r, c);
         else nameBox.value = colLetter(state.active.c) + state.active.r;
       } else { nameBox.value = colLetter(state.active.c) + state.active.r; }
     });
     ```
  4. Implement `colLetter_toIndex(str)` — case-insensitive: `str.toUpperCase().split('').reduce((n,ch)=>n*26+ch.charCodeAt(0)-64,0)`.
  5. Wire formula bar edit:
     ```js
     let formulaBarPrior = '';
     formulaBar.addEventListener('focus', () => {
       formulaBarPrior = formulaBar.value;
     });
     formulaBar.addEventListener('keydown', e => {
       if (e.key === 'Enter' || e.key === 'Tab') {
         e.preventDefault();
         undoStack.push(model.snapshot());
         model.setCellRaw(state.active.r, state.active.c, formulaBar.value);
         recalcAll();
         updateFormulaArea(state.active.r, state.active.c);
         if (e.key === 'Tab') GridRenderer.selectCell(state.active.r, state.active.c + 1);
       }
       if (e.key === 'Escape') {
         formulaBar.value = formulaBarPrior;
         formulaBar.blur();
       }
     });
     ```
  6. On `input` event in formula bar during active editing, do NOT sync to the cell in real time — only sync on commit. This avoids recursive recalculation while typing.
  7. `updateFormulaArea` is also called by `GridRenderer.selectCell` to keep the two elements synchronized.

- SKILLSET REQUIRED
  Vanilla JavaScript DOM event handling, regex address parsing, string manipulation.

- NOTES
  The Name Box must not allow arbitrary input to navigate to out-of-range cells — validate row/col bounds and reset to the current address on invalid input (BR-052). The formula bar shows the RAW formula string (`cell.formula`) when a formula cell is selected, not the computed result (BR-021). The `fx` label at ID `#fx-label` is purely decorative — no JS interaction. On formula bar Enter, the undo snapshot is pushed BEFORE `model.setCellRaw` so that Ctrl+Z can restore the prior value.

- RELATED
  BR-005, BR-006, BR-012, BR-013, BR-016, BR-021, BR-022, BR-023, BR-051, BR-052, AR-008, AR-009, PT-005, PT-010 | UC-001, UC-004, UC-014

---

## DI-010 : Implement CsvModule — Import / Export

- SUMMARY
  Implement `CsvModule` within `app.js` for opening and saving CSV files entirely in the browser. Import: trigger `<input type="file">` click, read with `FileReader.readAsText`, parse using a custom RFC 4180-compliant parser, and populate the grid. Export: serialize all non-empty cells to RFC 4180 CSV, wrap in a `Blob`, and trigger a download. On import with unsaved changes, display a `window.confirm` guard. After successful import, update `document.title`, clear the undo stack, and reset `model.dirty`.

- IMPLEMENTATION STEPS
  1. Wire the File menu's Open button and the Ctrl+O shortcut to `CsvModule.open()`.
  2. Implement `CsvModule.open()`:
     ```js
     const CsvModule = {
       open() {
         if (model.dirty && !window.confirm('Unsaved changes will be lost. Continue?')) return;
         document.getElementById('file-input').click();
       },
       // ...
     };
     document.getElementById('file-input').addEventListener('change', e => {
       const file = e.target.files[0];
       if (!file) return;
       const reader = new FileReader();
       reader.onload = ev => CsvModule._import(ev.target.result, file.name);
       reader.readAsText(file);
       e.target.value = '';  // reset so same file can be re-opened
     });
     ```
  3. Implement `CsvModule._import(text, filename)`:
     - Parse `text` with `CsvModule._parse(text)` → `rows` (array of string arrays).
     - Clear `model.sheets[model.currentSheetIndex].cells = {}`.
     - For each row `r` (1-based) and column `c` (1-based), if the value is non-empty call `model.setCellRaw(r, c, value)`.
     - Call `recalcAll()`, then `GridRenderer.build(container, model)` to re-render.
     - Set `model.dirty = false`.
     - `undoStack.clear()`.
     - `document.title = filename + ' - Excel'`.
     - `state.currentFilename = filename`.
  4. Implement `CsvModule._parse(text)` — RFC 4180 parser:
     ```js
     _parse(text) {
       const rows = []; let row = []; let field = ''; let inQuote = false;
       for (let i = 0; i < text.length; i++) {
         const ch = text[i];
         if (inQuote) {
           if (ch === '"' && text[i+1] === '"') { field += '"'; i++; }
           else if (ch === '"') { inQuote = false; }
           else { field += ch; }
         } else {
           if (ch === '"') { inQuote = true; }
           else if (ch === ',') { row.push(field); field = ''; }
           else if (ch === '\n' || (ch === '\r' && text[i+1] === '\n')) {
             if (ch === '\r') i++;
             row.push(field); rows.push(row); row = []; field = '';
           } else { field += ch; }
         }
       }
       if (field || row.length) { row.push(field); rows.push(row); }
       return rows;
     }
     ```
  5. Implement `CsvModule.save(filename)`:
     ```js
     save(filename) {
       const fn = filename || state.currentFilename || 'Book1.csv';
       const cells = model.sheets[model.currentSheetIndex].cells;
       let maxR = 0, maxC = 0;
       for (const r of Object.keys(cells).map(Number)) {
         maxR = Math.max(maxR, r);
         for (const c of Object.keys(cells[r]).map(Number)) maxC = Math.max(maxC, c);
       }
       const lines = [];
       for (let r = 1; r <= maxR; r++) {
         const cols = [];
         for (let c = 1; c <= maxC; c++) {
           const cell = model.getCell(r, c);
           const val = cell?.value || cell?.formula || '';
           cols.push(this._quoteField(val));
         }
         lines.push(cols.join(','));
       }
       const blob = new Blob([lines.join('\r\n')], { type: 'text/csv' });
       const a = document.createElement('a');
       a.href = URL.createObjectURL(blob);
       a.download = fn;
       a.click();
       URL.revokeObjectURL(a.href);
       model.dirty = false;
     }
     ```
  6. Implement `CsvModule._quoteField(v)`:
     - If `v` contains `,`, `"`, or `\n`, wrap in double-quotes and double any internal `"`.
     - Otherwise return `v` as-is.
  7. Wire File menu Save (Ctrl+S) → `CsvModule.save()`. Wire File menu Save As → prompt for filename then `CsvModule.save(newName)`.
  8. After successful CSV import, update `document.title = filename + ' - Excel'`.

- SKILLSET REQUIRED
  Vanilla JavaScript, `FileReader` API, `Blob` API, RFC 4180 CSV parsing, URL.createObjectURL.

- NOTES
  The `<input id="file-input">` is already in `app.html` (DI-003) with `accept=".csv"` and `display:none`. Do not create a second one. The dirty-flag guard runs before the file picker opens, not on the `change` event. The undo stack must be cleared after a successful import — the prior state is no longer relevant. `URL.revokeObjectURL` should be called after the click to avoid memory leaks. The CSV export writes all cells from row 1 / col 1 to the max occupied row / col — sparse cells in the middle are written as empty fields.

- RELATED
  BR-024, BR-025, BR-026, BR-027, BR-028, BR-029, BR-030, BR-031, BR-032, PT-005, PT-011 | UC-005, UC-006, UC-007, UC-008

---

## DI-011 : Implement UndoStack

- SUMMARY
  Implement the `UndoStack` object within `app.js` that maintains an array of `CellModel` snapshots (deep clones of the active sheet's cells). A snapshot is pushed before every user-initiated cell edit. `undo()` pops the most recent snapshot and calls `model.restore()` then re-renders the grid. The stack is capped at 100 entries. Ctrl+Z is handled by the central keyboard dispatcher (DI-015), which calls `undoStack.undo()`.

- IMPLEMENTATION STEPS
  1. Define `UndoStack` in `app.js`:
     ```js
     const undoStack = {
       _stack: [],
       push(snapshot) {
         this._stack.unshift(snapshot);
         if (this._stack.length > 100) this._stack.pop();
       },
       undo() {
         if (!this._stack.length) return;
         const snap = this._stack.shift();
         model.restore(snap);
         recalcAll();
         // Re-render all cells (GridRenderer.build would reset scroll; update in place)
         const cells = model.sheets[model.currentSheetIndex].cells;
         for (const r of Object.keys(cells)) {
           for (const c of Object.keys(cells[r])) {
             const cell = cells[r][c];
             const display = cell.formula
               ? FormulaEngine.evaluate(cell.formula, (rr,cc) => model.getCell(rr,cc)?.formula || model.getCell(rr,cc)?.value || '')
               : cell.value;
             GridRenderer.setCellDisplay(Number(r), Number(c), display);
           }
         }
       },
       clear() { this._stack = []; },
     };
     ```
  2. Push a snapshot BEFORE every `model.setCellRaw` call (both in-cell edit commit and formula bar commit).
  3. The snapshot covers only the currently active sheet's cells — not all sheets.
  4. The undo stack is cleared on CSV import (`undoStack.clear()` in `CsvModule._import`).
  5. Bind `Ctrl+Z` in the keyboard dispatcher (DI-015) to `undoStack.undo()`.

- SKILLSET REQUIRED
  Vanilla JavaScript, array stack operations, JSON deep clone.

- NOTES
  `unshift` to the front and `pop` from the back maintains a LIFO stack with O(1) access to the most recent snapshot. The cap of 100 entries prevents unbounded memory growth. After `model.restore`, cells that were previously non-empty and are now empty still need their display cleared — iterate all visible cells and call`GridRenderer.setCellDisplay` for each, not just the cells in the restored snapshot. Redo is not required for the initial build.

- RELATED
  BR-033, PT-005, PT-012 | UC-008

---

## DI-012 : Implement ContextMenu

- SUMMARY
  Implement the `ContextMenu` object within `app.js` that shows a positioned overlay on right-click over a grid cell. The menu is the `<div id="context-menu">` element (rendered in DI-003). It is populated on first render from a config array and shown at the mouse cursor position on `contextmenu` events. Clicking outside or pressing Escape hides it. Each menu action (Cut, Copy, Paste, Insert Row, Delete Row, Clear Contents) modifies the cell model and refreshes the grid.

- IMPLEMENTATION STEPS
  1. Define the internal clipboard variable at the top of the `DOMContentLoaded` callback:
     ```js
     let internalClipboard = { value: '', formula: '' };
     ```
  2. Implement `ContextMenu.build(menuEl)` — called once on `DOMContentLoaded`:
     - Build menu items from a config array:
       ```js
       const CTX_ITEMS = [
         { label: 'Cut',            action: () => ContextMenu.doCut()        },
         { label: 'Copy',           action: () => ContextMenu.doCopy()       },
         { label: 'Paste',          action: () => ContextMenu.doPaste()      },
         { sep: true },
         { label: 'Insert Row',     action: () => ContextMenu.doInsertRow()  },
         { label: 'Delete Row',     action: () => ContextMenu.doDeleteRow()  },
         { sep: true },
         { label: 'Clear Contents', action: () => ContextMenu.doClearContents() },
       ];
       ```
     - For `sep:true` items render `<div class="ctx-separator">`.
     - For label items render `<div class="ctx-item" role="menuitem">` with click handler that runs `item.action()` then `ContextMenu.hide()`.
  3. Track the right-clicked cell coordinates in `ContextMenu._ctxRow` and `ContextMenu._ctxCol`.
  4. Implement `ContextMenu.show(r, c, e)`:
     ```js
     show(r, c, e) {
       e.preventDefault();
       this._ctxRow = r; this._ctxCol = c;
       const el = document.getElementById('context-menu');
       el.style.left    = e.clientX + 'px';
       el.style.top     = e.clientY + 'px';
       el.style.display = 'block';
     }
     ```
  5. Implement `ContextMenu.hide()`: `document.getElementById('context-menu').style.display = 'none';`
  6. Register a `document.addEventListener('mousedown', ...)` handler: if the click target is not inside `#context-menu`, call `ContextMenu.hide()`.
  7. Close on Escape is handled by the KeyboardShortcutDispatcher (DI-015).
  8. Implement actions:
     ```js
     doCut()  {
       const cell = model.getCell(this._ctxRow, this._ctxCol);
       internalClipboard = { value: cell?.value||'', formula: cell?.formula||'' };
       undoStack.push(model.snapshot());
       model.clearCell(this._ctxRow, this._ctxCol);
       GridRenderer.setCellDisplay(this._ctxRow, this._ctxCol, '');
     },
     doCopy() {
       const cell = model.getCell(this._ctxRow, this._ctxCol);
       internalClipboard = { value: cell?.value||'', formula: cell?.formula||'' };
     },
     doPaste() {
       const raw = internalClipboard.formula || internalClipboard.value;
       GridRenderer.commitEdit(state.active.r, state.active.c, raw);
     },
     doInsertRow() {
       undoStack.push(model.snapshot());
       model.insertRow(this._ctxRow);
       GridRenderer.build(document.getElementById('grid-container'), model);
       recalcAll();
     },
     doDeleteRow() {
       undoStack.push(model.snapshot());
       model.deleteRow(this._ctxRow);
       GridRenderer.build(document.getElementById('grid-container'), model);
       recalcAll();
     },
     doClearContents() {
       undoStack.push(model.snapshot());
       model.clearCell(this._ctxRow, this._ctxCol);
       GridRenderer.setCellDisplay(this._ctxRow, this._ctxCol, '');
     },
     ```

- SKILLSET REQUIRED
  Vanilla JavaScript DOM, event delegation, position:fixed overlay, internal clipboard pattern.

- NOTES
  The internal clipboard (`internalClipboard`) is separate from the system clipboard (`navigator.clipboard`) — the system clipboard is not used. `doClearContents` calls `model.clearCell` which preserves the format object (BR-058). `doInsertRow` and `doDeleteRow` require a full `GridRenderer.build` re-render because row indices change throughout the table. Positioning: `e.clientX`/`e.clientY` are viewport-relative and correct for a `position:fixed` overlay. If the menu would overflow the viewport edge, clamp its `left`/`top` by subtracting `menu.offsetWidth` or `menu.offsetHeight`; this is optional for MVP.

- RELATED
  BR-053, BR-054, BR-055, BR-056, BR-057, BR-058, AR-012, PT-005, PT-013 | UC-015

---

## DI-013 : Implement SheetManager — Multi-Sheet Tabs

- SUMMARY
  Implement `SheetManager` within `app.js` that renders and manages the sheet tab bar (`<div id="sheet-tabs">`). It renders one tab button per sheet in `model.sheets` plus the `+` button. Clicking a tab saves the current scroll position, switches `model.currentSheetIndex`, and re-renders the grid. Clicking `+` adds a new sheet. The active tab is marked with class `active`. Sheet names are automatically generated as `Sheet1`, `Sheet2`, etc.

- IMPLEMENTATION STEPS
  1. Implement `SheetManager.renderTabs()`:
     ```js
     const SheetManager = {
       renderTabs() {
         const container = document.getElementById('sheet-tabs');
         container.innerHTML = '';
         model.sheets.forEach((sheet, i) => {
           const btn = document.createElement('button');
           btn.className = 'sheet-tab' + (i === model.currentSheetIndex ? ' active' : '');
           btn.textContent = sheet.name;
           btn.addEventListener('click', () => this.switchTo(i));
           container.appendChild(btn);
         });
       },
       switchTo(index) {
         model.switchSheet(index);
         this.renderTabs();
         GridRenderer.build(document.getElementById('grid-container'), model);
         recalcAll();
         GridRenderer.selectCell(1, 1);
       },
       addSheet() {
         const n = model.sheets.length + 1;
         model.addSheet('Sheet' + n);
         this.switchTo(model.sheets.length - 1);
       },
     };
     ```
  2. Wire the `+` button on `DOMContentLoaded`:
     ```js
     document.getElementById('add-sheet-btn').addEventListener('click', () => SheetManager.addSheet());
     ```
  3. Call `SheetManager.renderTabs()` on `DOMContentLoaded` (initial render shows `Sheet1` active).
  4. Call `SheetManager.renderTabs()` after every `addSheet` and `switchTo` operation.
  5. On sheet switch, re-render the full grid via `GridRenderer.build` because the cells map is entirely different.

- SKILLSET REQUIRED
  Vanilla JavaScript DOM, event-driven UI, multi-state management.

- NOTES
  `model.sheets` is the array-of-{name, cells} defined in CellModel (DI-005). Each sheet has an independent `cells` object so switching sheets naturally shows separate data (BR-049). The `+` button must be outside the tab container so it does not get wiped on `renderTabs()`. Tab names are auto-generated and are not editable in the initial build. On tab switch, scroll position is reset to (0,0) by calling `GridRenderer.selectCell(1,1)` — implementing per-sheet scroll memory is optional.

- RELATED
  BR-009, BR-048, BR-049, BR-050, PT-005, PT-014 | UC-013

---

## DI-014 : Implement HelpDialog

- SUMMARY
  Implement the Help dialog (`<dialog id="help-dialog">`) that displays all registered keyboard shortcuts in a table. The shortcuts table is populated from the `SHORTCUTS` constant (defined in DI-015) — the same constant drives both keyboard dispatch and the Help table, making it the single source of truth. The dialog is opened with `showModal()` (triggered by F1 or the Help menu item) and closed by the Close button or the Escape key.

- IMPLEMENTATION STEPS
  1. Implement `HelpDialog.build(dialogEl)` — called once on `DOMContentLoaded`:
     ```js
     const HelpDialog = {
       build(dialogEl) {
         const tbody = dialogEl.querySelector('#shortcuts-table');
         tbody.innerHTML = '';
         for (const [key, { label }] of Object.entries(SHORTCUTS)) {
           if (!label) continue;
           const tr = document.createElement('tr');
           tr.innerHTML = `<td>${key}</td><td>${label}</td>`;
           tbody.appendChild(tr);
         }
         dialogEl.querySelector('#help-close-btn')
           .addEventListener('click', () => dialogEl.close());
       },
       open() {
         document.getElementById('help-dialog').showModal();
       },
     };
     ```
  2. `SHORTCUTS` (defined in DI-015) must include a `label` string for every shortcut that should appear in the Help table. Shortcuts without a label are excluded from the table.
  3. Wire the Help menu tab button `data-menu="view"` has no Help item — the menu bar does not open dropdowns in the MVP. Instead, wire F1 in the keyboard dispatcher to `HelpDialog.open()`.
  4. The `<dialog>` element's native Escape handling automatically calls `dialog.close()` — no additional JS is needed for Escape dismissal.
  5. `dialog.close()` and the Close button call are both safe to call even if the dialog is already closed.

- SKILLSET REQUIRED
  Vanilla JavaScript, native HTML `<dialog>` element, `showModal()` / `close()` API.

- NOTES
  `showModal()` traps focus inside the dialog and blocks pointer events outside it — this is the correct Excel modal behavior, requiring no custom backdrop logic. The dialog is automatically dismissed by the browser on Escape when opened with `showModal()`. Do NOT use `dialog.show()` (non-modal) — `showModal()` is mandatory (BR-039). The `#shortcuts-table` element in `app.html` is a `<table>` — append `<tr>` elements directly to it (no explicit `<tbody>` needed).

- RELATED
  BR-035, BR-039, BR-040, PT-003, PT-005 | UC-010

---

## DI-015 : Implement KeyboardShortcutDispatcher

- SUMMARY
  Implement a central `document.addEventListener('keydown', handler)` listener in `app.js` that dispatches all application keyboard shortcuts from a single `SHORTCUTS` constant. The constant maps key combo strings to `{action, label}` objects, enabling both dispatch and Help table population. Arrow-key navigation moves cell selection when not in edit mode. Tab and Enter confirm edits and advance focus. Escape closes open overlays or cancels edits.

- IMPLEMENTATION STEPS
  1. Define `SHORTCUTS` in `app.js` before `DOMContentLoaded` (after all action functions are defined or referenced via closures):
     ```js
     const SHORTCUTS = {
       'Ctrl+S':    { label: 'Save CSV',         action: () => CsvModule.save()    },
       'Ctrl+O':    { label: 'Open CSV',          action: () => CsvModule.open()    },
       'Ctrl+Z':    { label: 'Undo',              action: () => undoStack.undo()    },
       'Ctrl+Home': { label: 'Go to A1',          action: () => GridRenderer.selectCell(1,1) },
       'F1':        { label: 'Help',              action: () => HelpDialog.open()   },
       'F2':        { label: 'Edit cell',         action: () => GridRenderer.startEdit(state.active.r, state.active.c) },
       'Escape':    { label: 'Cancel / Close',    action: handleEscape              },
       'ArrowUp':   { label: null,                action: () => moveSelection(-1, 0) },
       'ArrowDown': { label: null,                action: () => moveSelection(1, 0)  },
       'ArrowLeft': { label: null,                action: () => moveSelection(0, -1) },
       'ArrowRight':{ label: null,                action: () => moveSelection(0, 1)  },
     };
     ```
  2. Implement `moveSelection(dr, dc)`:
     ```js
     function moveSelection(dr, dc) {
       if (state.editMode) return;  // arrows handled by input keydown in GridRenderer
       const r = Math.max(1, Math.min(GRID_ROWS, state.active.r + dr));
       const c = Math.max(1, Math.min(GRID_COLS, state.active.c + dc));
       GridRenderer.selectCell(r, c);
     }
     ```
  3. Implement `handleEscape`:
     ```js
     function handleEscape() {
       const ctx = document.getElementById('context-menu');
       if (ctx.style.display !== 'none') { ContextMenu.hide(); return; }
       const dlg = document.getElementById('help-dialog');
       if (dlg.open) { dlg.close(); return; }
       if (state.editMode) { GridRenderer.cancelEdit(state.active.r, state.active.c); }
     }
     ```
  4. Implement the central keydown handler:
     ```js
     document.addEventListener('keydown', e => {
       // Build combo key, e.g. "Ctrl+S", "F1", "ArrowUp"
       let combo = '';
       if (e.ctrlKey)  combo += 'Ctrl+';
       if (e.shiftKey) combo += 'Shift+';
       if (e.altKey)   combo += 'Alt+';
       combo += e.key;
       const shortcut = SHORTCUTS[combo];
       if (shortcut) {
         e.preventDefault();
         shortcut.action();
       }
       // Tab and Enter: handle separately for navigation
       if (!state.editMode) {
         if (e.key === 'Tab') {
           e.preventDefault();
           moveSelection(0, e.shiftKey ? -1 : 1);
         }
         if (e.key === 'Enter') {
           e.preventDefault();
           moveSelection(e.shiftKey ? -1 : 1, 0);
         }
       }
     });
     ```
  5. Track `state.editMode` (boolean) — set to `true` in `GridRenderer.startEdit`, `false` in `commitEdit`/`cancelEdit`.
  6. `state.active` is the shared `{r, c}` object updated by `GridRenderer.selectCell`.

- SKILLSET REQUIRED
  Vanilla JavaScript, `KeyboardEvent` properties, event-driven dispatch table, state management.

- NOTES
  `e.preventDefault()` on Ctrl+S prevents the browser's native "Save page" dialog. `e.preventDefault()` on Ctrl+O prevents "Open file" from the browser itself. Arrow keys and Tab are only handled at the document level when `state.editMode` is false — the in-cell `<input>` handles them during edit. The `label: null` shortcuts (arrow keys) are excluded from the Help table (DI-014 skips nulls). Shortcuts map `e.key` values directly — `e.key` for Ctrl+S is `"s"` in some browsers; test with both `"s"` and `"S"`. Use `e.key === 's' || e.key === 'S'` or normalize with `.toLowerCase()` if needed, and build the combo accordingly.

- RELATED
  BR-014, BR-015, BR-016, BR-032, BR-033, BR-034, BR-035, BR-039, PT-005 | UC-008, UC-010

---
