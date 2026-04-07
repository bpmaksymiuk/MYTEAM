# Parts List

Generated from `2-REQUIREMENTS.md` and `3-ARCHITECTURE-RECOMMENDATIONS.md`. Owned by Architect.

---

## PT-001 : manifest.json — Extension Manifest
- DESCRIPTION
  Chrome Extension Manifest V3 declaration. Registers permissions, declares the service worker, and configures the toolbar action (no popup — click handled by service worker).
- TECHNOLOGY RECOMMENDATIONS
  JSON. manifest_version: 3. permissions: ["storage", "windows"]. background.service_worker: "background.js". action: {} (empty — required for icon to appear).
- NOTES
  No host_permissions required. No web_accessible_resources required.
- RELATED UC-001, BR-001, BR-002, AR-001

---

## PT-002 : background.js — Service Worker
- DESCRIPTION
  MV3 service worker managing the spreadsheet window lifecycle: open-or-focus on toolbar icon click, persist window bounds on move/resize, clean up tracked windowId on close.
- TECHNOLOGY RECOMMENDATIONS
  Vanilla JS. chrome.action.onClicked, chrome.windows.create/update, chrome.windows.onBoundsChanged, chrome.windows.onRemoved, chrome.storage.local.
- NOTES
  Module-level variable notepadWindowId tracks open window. Error recovery: catch stale windowId and create fresh window.
- RELATED UC-001, UC-009, BR-001, BR-002, BR-003, BR-031, BR-032, AR-001, AR-002, AR-003

---

## PT-003 : index.html — UI Page Shell
- DESCRIPTION
  Single HTML page loaded as the window content. Contains the toolbar (menu buttons), formula bar, column header row, grid container, status bar, and help dialog.
- TECHNOLOGY RECOMMENDATIONS
  HTML5. Semantic layout: div#toolbar, div#formula-bar (cell-ref display + input), div#grid-wrapper (overflow scroll containing the rendered table), dialog#help-dialog.
- NOTES
  Links index.css and app.js. No inline styles or scripts.
- RELATED UC-001, UC-002, UC-004, UC-010, BR-004, BR-005, BR-006, BR-033, AR-004

---

## PT-004 : index.css — Spreadsheet UI Styles
- DESCRIPTION
  All visual styling. Excel-like aesthetic: white background, gray grid lines, highlighted active cell, frozen column/row headers, formula bar input, toolbar button styles, help dialog.
- TECHNOLOGY RECOMMENDATIONS
  CSS3. CSS custom properties for palette. position:sticky for frozen headers. Table border-collapse for grid. Focus ring for active cell. System font stack (Calibri, Aptos, sans-serif).
- NOTES
  The grid table must be inside a scrollable container so headers remain visible while data scrolls.
- RELATED UC-001, BR-004, BR-006, AR-004

---

## PT-005 : app.js — Grid State, Rendering, and Cell Interaction
- DESCRIPTION
  Core client-side logic: grid state (2D array of cell objects), initial render, cell click/selection, edit mode (keyboard + double-click + F2), Enter/Tab/Arrow navigation, Escape cancel, formula bar sync.
- TECHNOLOGY RECOMMENDATIONS
  Vanilla JS ES6+. State: cells[row][col] = {raw, value}. Render: build `<table>` DOM from state. Active cell tracked as {row, col}. Input overlay or contenteditable cell for edit mode.
- NOTES
  Edit mode approach: use a positioned `<input>` overlay on the active cell rather than making table cells contenteditable, for simpler cursor management.
- RELATED UC-002, UC-004, BR-006, BR-007, BR-008, BR-009, BR-010, BR-005, BR-016, BR-017, BR-018, AR-004, AR-005

---

## PT-006 : formula.js — Formula Parser and Evaluator
- DESCRIPTION
  Recursive-descent parser for spreadsheet formula expressions. Parses raw cell input (when starting with =) into an AST, evaluates the AST against the current grid state, returns the computed value or an error token.
- TECHNOLOGY RECOMMENDATIONS
  Vanilla JS. Tokenizer → Parser (recursive descent) → Evaluator. No use of eval() — security requirement. Error tokens: #ERR, #DIV/0!, #REF!, #CIRC.
- NOTES
  Supported grammar: arithmetic (+,-,*,/), unary minus, parentheses, cell refs (A1), range refs (A1:B3), functions SUM/AVERAGE/MIN/MAX/COUNT.
- RELATED UC-003, BR-011, BR-012, BR-013, BR-014, BR-015, AR-006, AR-007

---

## PT-007 : csv.js — CSV Parser and Serializer
- DESCRIPTION
  RFC 4180-compliant CSV import (parse text → 2D string array) and export (2D string array → CSV text). Handles quoted fields, embedded commas, embedded newlines, and double-quote escaping.
- TECHNOLOGY RECOMMENDATIONS
  Vanilla JS. parseCSV(text): string → string[][]. serializeCSV(data): string[][] → string. BOM stripping on import.
- NOTES
  Do not use split(',') for parsing — it breaks on quoted fields. Implement a character-by-character state machine.
- RELATED UC-005, UC-006, BR-020, BR-022, BR-023, BR-024, BR-025, AR-008

---

## PT-008 : Help Dialog — Keyboard Shortcuts Modal
- DESCRIPTION
  HTML `<dialog>` element populated at runtime from the SHORTCUTS data structure in app.js. Lists all active key bindings paired with their action labels. Wired to Close button and Escape key.
- TECHNOLOGY RECOMMENDATIONS
  HTML dialog.showModal(). Table layout for shortcut/action pairs. 'cancel' event listener for Escape.
- NOTES
  Must be populated from the same data structure that registers the keyboard listeners, so the list is always accurate.
- RELATED UC-010, BR-033, BR-034, BR-035, AR-010
