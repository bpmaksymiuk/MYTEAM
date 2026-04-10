# Parts List — Excel Chrome Extension
**Stage:** 3 — Architecture
**Source:** `3-ARCHITECTURE-RECOMMENDATIONS.md` (AR-001 through AR-010)
**Date:** 2026-04-10

---

## PT-001 : manifest.json — Extension Descriptor
- DESCRIPTION: Chrome MV3 manifest declaring the extension name, version, permissions (storage, windows), background service worker, and the default icon. Entry point for the Chrome extension runtime.
- TECHNOLOGY RECOMMENDATIONS: JSON, Chrome Extension Manifest V3 schema.
- NOTES Permissions: ["storage", "windows"]. background.service_worker points to background.js.
- RELATED AR-001, BR-040, BR-041, UC-001, UC-009
---
## PT-002 : background.js — Service Worker / Window Manager
- DESCRIPTION: MV3 service worker that handles the extension icon click event. Checks chrome.storage.local for a saved window ID; focuses the existing window if it still exists; otherwise creates a new chrome.windows window with saved or default geometry. Stores geometry on `onBoundsChanged`; cleans up stored ID on `onRemoved`.
- TECHNOLOGY RECOMMENDATIONS: JavaScript ES module, chrome.windows API, chrome.storage.local API.
- NOTES Must import storage helpers from storage.js or implement geometry save/load inline.
- RELATED AR-001, AR-006, BR-040, BR-041, BR-042, UC-009
---
## PT-003 : app.html — Extension Page Shell
- DESCRIPTION: Single HTML page loaded in the chrome.windows window. Contains the ribbon tab bar, ribbon body, formula area (Name Box + fx label + formula bar), grid container, sheet tab bar, status bar, and overlay elements (backstage panel, Find & Replace dialog, Help dialog, color picker popover). No external script or style imports.
- TECHNOLOGY RECOMMENDATIONS: HTML5, inline or same-origin CSS/JS references.
- NOTES All overlay elements are always in DOM; visibility toggled by JS.
- RELATED AR-002, AR-008, AR-009, BR-001 through BR-009, UC-001
---
## PT-004 : app.js — Main Application Logic
- DESCRIPTION: Monolithic ES module implementing: ribbon rendering (RIBBON_CONFIG), grid rendering, cell selection, inline editing, formula evaluation (FormulaEngine), undo stack, sheet management, CSV import/export, keyboard shortcuts, context menu, Find & Replace, color pickers, column/row resize, range selection, status bar, zoom control, backstage panel, and number formatting. All logic lives in this single file to avoid MV3 module-loading restrictions.
- TECHNOLOGY RECOMMENDATIONS: Vanilla JavaScript ES module, Intl.NumberFormat, Date API.
- NOTES FormulaEngine is a plain object literal within app.js; functions are module-scoped.
- RELATED AR-002, AR-003, AR-004, AR-005, AR-007, AR-008, AR-009, AR-010, BR-001 through BR-132, UC-001 through UC-028
---
## PT-005 : app.css — Extension Page Styles
- DESCRIPTION: All CSS for the Excel extension UI: ribbon tab bar, ribbon body groups, formula area, grid table, column/row headers, selection highlight, color picker popover, context menu, dialog overlays, status bar, sheet tab bar, backstage panel, zoom control. Uses CSS custom properties for theme colours.
- TECHNOLOGY RECOMMENDATIONS: CSS3, custom properties (var(--color-*)), position:sticky for frozen headers.
- NOTES No CSS preprocessor; single flat file. Media queries not required for extension window.
- RELATED AR-002, BR-052, BR-053, UC-001, UC-012
---
## PT-006 : FormulaEngine (logical component within app.js)
- DESCRIPTION: Object literal with methods: evaluate(), expandFunctions(), expandTextFunctions(), evalFunction(), evalTextFunction(), evalDateFunction(), expandRange(), replaceRefs(), adjustFormulaRefs(), safeCalc(). Responsible for all formula parsing, function dispatch, error value generation, and cell-reference offset adjustment on paste.
- TECHNOLOGY RECOMMENDATIONS: Vanilla JS, recursive descent parser for arithmetic, regex-based tokeniser for cell reference extraction and $ sign tracking.
- NOTES Must never use eval or new Function (MV3 CSP). Error strings #DIV/0!, #NAME?, #REF!, #VALUE!, #N/A must be propagated without being swallowed to generic #ERR.
- RELATED AR-003, AR-004, AR-005, BR-015 through BR-023, BR-105 through BR-132, UC-003, UC-024 through UC-028
---

