# Implementation Release Notes

**Release ID:** XL-REL-2026-04-05-001
**Project:** Excel (Spreadsheet Chrome Extension)
**Stage:** 5 — Implementation
**Date:** 2026-04-05

---

## Release Summary

Full Manifest V3 Chrome extension delivering a spreadsheet application with formula evaluation, CSV import/export, keyboard navigation, and persistent window bounds. Seven build artefacts produced.

---

## Build Artefacts

| File | Part | Description |
|------|------|-------------|
| `manifest.json` | PT-001 | MV3 manifest; permissions: storage, windows |
| `background.js` | PT-002 | Service worker — window open/focus/bounds persistence |
| `index.html` | PT-003 | Page shell — toolbar, formula bar, grid, help dialog |
| `index.css` | PT-004 | Excel-like theme; sticky headers; active-cell outline |
| `csv.js` | PT-007 | RFC 4180 state-machine parser + Blob serializer |
| `formula.js` | PT-006 | Recursive-descent parser + evaluator (no eval()) |
| `app.js` | PT-005 | Grid state, rendering, CSV I/O, menus, shortcuts, help |

---

## Design Instruction Coverage

| DI | Description | Status |
|----|-------------|--------|
| DI-001 | manifest.json | ✅ DONE |
| DI-002 | background.js service worker | ✅ DONE |
| DI-003 | index.html page shell | ✅ DONE |
| DI-004 | index.css Excel theme | ✅ DONE |
| DI-005 | csv.js RFC 4180 | ✅ DONE |
| DI-006 | formula.js recursive-descent | ✅ DONE |
| DI-007 | app.js grid state + dependency graph | ✅ DONE |
| DI-008 | app.js CSV open/save integration | ✅ DONE |
| DI-009 | app.js menus, shortcuts, help dialog | ✅ DONE |

---

## Use Case → Business Requirement → Architecture Traceability

| UC | BRs Covered | AR | Implementation |
|----|------------|-----|---------------|
| UC-001 Open Window | BR-001, BR-002, BR-003 | AR-001, AR-002 | `background.js` openOrFocusWindow(), windowId guard |
| UC-002 Cell Edit | BR-006, BR-007, BR-008, BR-009, BR-010 | AR-005 | `app.js` click/dblclick delegation, startEdit/commitEdit/cancelEdit |
| UC-003 Formulas | BR-011, BR-012, BR-013, BR-014, BR-015 | AR-006, AR-007 | `formula.js` tokenize/parse/evalNode; `app.js` recalculate/topoSort |
| UC-004 Formula Bar | BR-016, BR-017, BR-018 | AR-005 | `app.js` #formula-input sync; startEdit on input; F2 |
| UC-005 Open CSV | BR-019, BR-020, BR-021, BR-022 | AR-008 | `app.js` openCSV → file-input → FileReader → CSV.parse |
| UC-006 Save CSV | BR-023, BR-024, BR-025 | AR-008 | `app.js` saveCSV → CSV.serialize → Blob download |
| UC-007 Data Loss Prevention | BR-026, BR-027 | AR-005 | `app.js` isDirty flag; confirmDataLoss dialog; title dot |
| UC-008 Keyboard Shortcuts | BR-028, BR-029, BR-030 | AR-009 | `app.js` SHORTCUTS table; matchesShortcut; Ctrl+S/O/Home |
| UC-009 Window Persistence | BR-031, BR-032 | AR-003 | `background.js` onBoundsChanged writer; getStoredBounds() |
| UC-010 Help Dialog | BR-033, BR-034, BR-035 | AR-010 | `app.js` showHelp populates #shortcuts-table; `<dialog>` |

---

## Security Notes

- No `eval()` used anywhere. Formula engine is a hand-rolled recursive-descent parser.
- CSV FileReader uses browser sandbox; no filesystem access outside user gesture.
- Blob URL created and revoked immediately after save download.
- No external network requests; extension is fully offline.
- HTML injection prevented via `textContent` / `escapeHtml()` in all dynamic cell rendering.

---

## Known Caveats

- Column support limited to A–Z (26 columns). Multi-letter column refs (AA, AB…) not supported in formula engine without extension.
- Window close data-loss prompt is OS-managed; beforeunload is not triggered in Chrome extension popup windows, so unsaved data may be lost on window close.
- `#CIRC` detection relies on topological sort cycle detection; may show #ERR instead of #CIRC for indirect circular references in partial recalc path.
