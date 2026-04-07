# Architecture Recommendations

Generated from `2-REQUIREMENTS.md`. Owned by Architect.

---

## AR-001 : Use Chrome Extension Manifest V3 with a service worker background process
- RATIONALE
  MV3 is the only currently supported manifest version for new Chrome extensions. Its event-driven service worker is the correct place to manage the extension window lifecycle (create, focus, bounds persistence, cleanup) and handle the toolbar icon click. MV3 ensures platform compliance and long-term support.
- NOTES
  Permissions required: ["storage", "windows"]. Service worker declared under "background.service_worker".
- RELATED BR-001, BR-002, BR-003, UC-001, UC-009

---

## AR-002 : Use chrome.windows API to open and manage the detached spreadsheet window
- RATIONALE
  chrome.windows.create() with type:'popup' produces an OS-level window with native title bar, resize handles, and minimize/restore — requirements that a browser extension popup cannot satisfy. chrome.windows.onBoundsChanged and chrome.windows.onRemoved allow bounds persistence and state cleanup without polling.
- NOTES
  Window URL: chrome.runtime.getURL('index.html'). Track active windowId in the service worker. Default bounds: {left:100, top:100, width:1024, height:700}.
- RELATED BR-002, BR-003, BR-031, BR-032, UC-001, UC-009

---

## AR-003 : Use chrome.storage.local for all persistent state (window bounds, saved grid data)
- RATIONALE
  chrome.storage.local is accessible from both the service worker and extension pages, survives browser restarts, and does not require unlimitedStorage for the target payload sizes. localStorage is unavailable in service worker contexts.
- NOTES
  Keys: 'windowBounds' (object), 'gridData' (JSON-serialized 2D array of cell raw values).
- RELATED BR-031, BR-032, UC-009

---

## AR-004 : Implement all UI as a single HTML page (index.html) served from the extension package
- RATIONALE
  A single page eliminates cross-context complexity, maintains full DOM state during the window's lifetime, and mirrors the architecture of a native single-window application like Excel. No network dependency.
- NOTES
  Page structure: toolbar bar, formula bar, column header row, scrollable grid area, help dialog.
- RELATED BR-004, BR-005, BR-006, BR-007, UC-001, UC-002

---

## AR-005 : Represent the grid as a 2D in-memory array of cell objects; render it to a DOM table
- RATIONALE
  A JavaScript 2D array indexed as `cells[row][col]` is the simplest accurate model for spreadsheet state. Each cell stores its raw input (the formula string or literal) separately from the computed display value. Rendering to a `<table>` element gives native browser layout for grid alignment and scrolling.
- NOTES
  Cell object shape: `{ raw: string, value: string|number }`. Initial size: 50 rows × 26 cols (A–Z). Grid grows as needed.
- RELATED BR-004, BR-006, BR-007, BR-008, BR-009, UC-001, UC-002

---

## AR-006 : Implement formula parsing and evaluation with a recursive-descent parser (no external library)
- RATIONALE
  The required formula scope (arithmetic operators, 5 aggregate functions, cell and range references) is well within the capability of a hand-written recursive-descent parser. Avoiding external libraries eliminates a build step, reduces the attack surface, and keeps the extension package self-contained. Injection safety: formulas are parsed as an AST, never passed to eval().
- NOTES
  Supported: +, -, *, /, unary minus, parentheses, cell refs (A1), range refs (A1:B3), functions SUM/AVERAGE/MIN/MAX/COUNT. Error tokens: #ERR, #DIV/0!, #REF!.
- RELATED BR-011, BR-012, BR-013, BR-014, BR-015, UC-003

---

## AR-007 : Compute a dependency graph for formula recalculation; topologically sort to evaluate in correct order
- RATIONALE
  When a cell changes, all cells that reference it (directly or transitively) must recalculate. A dependency graph (cell → set of cells it references) with topological sort ensures each cell is evaluated exactly once per change in the correct order. This avoids stale values and redundant recalculation.
- NOTES
  Simple DAG: on any cell edit, rebuild the dependency list for the changed cell, then BFS/topo-sort all affected cells and re-evaluate. Circular references are detected when the topo-sort cannot complete; display #CIRC in affected cells.
- RELATED BR-014, UC-003

---

## AR-008 : Use the File System Access API (<input type="file">) for CSV open; Blob + URL.createObjectURL for CSV save
- RATIONALE
  `<input type="file" accept=".csv">` triggered programmatically is the portable, permission-free way to open a local file in a Chrome extension page. For save, Blob + a synthetic anchor download requires no server and is available in all Chromium versions. Both approaches have no security implications beyond the user's explicit file selection.
- NOTES
  Parse CSV per RFC 4180 (handle quoted fields, embedded commas, embedded newlines, double-quote escaping). Serialize CSVs per RFC 4180. Suggest filename: spreadsheet.csv.
- RELATED BR-019, BR-020, BR-022, BR-023, BR-024, BR-025, UC-005, UC-006

---

## AR-009 : Use vanilla JavaScript with no external frameworks or build toolchain
- RATIONALE
  The entire feature set — a grid render, formula parser, CSV I/O, one dialog, keyboard shortcuts — is achievable with native DOM APIs and ES6+. No framework eliminates a build step, simplifies the extension package, and removes all third-party dependency risk.
- NOTES None
- RELATED BR-006, BR-007, BR-008, BR-009, BR-010, BR-011, BR-026, BR-027, BR-028, BR-029, BR-030, UC-002, UC-003, UC-007, UC-008

---

## AR-010 : Use the HTML dialog element for the Help modal
- RATIONALE
  The native `<dialog>` element provides built-in modal semantics, focus trapping, and Escape dismissal via the 'cancel' event, without custom overlay logic or z-index management. Supported in all current Chromium versions.
- NOTES
  Open with dialog.showModal(). Wire Close button to dialog.close(). On 'cancel', return focus to the active cell.
- RELATED BR-033, BR-034, BR-035, UC-010
