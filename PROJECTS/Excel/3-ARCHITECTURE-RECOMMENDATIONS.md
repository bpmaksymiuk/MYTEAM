# Architecture Recommendations — Excel Chrome Extension
**Stage:** 3 — Architecture
**Source:** `2-REQUIREMENTS.md` (BR-001 through BR-132)
**Date:** 2026-04-10

---

## AR-001 : Deliver the spreadsheet as a Chrome Extension Manifest V3 with a dedicated popup window.
- RATIONALE: MV3 is the current and only Chrome extension standard. Using a dedicated `chrome.windows`-managed window (not a popup) gives the user a full-screen spreadsheet experience that persists as a standalone window and allows geometry storage. This constrains the app to work without a remote server, satisfying BR-030 and BR-040.
- NOTES Service worker as background script; no persistent background page (MV3 requirement).
- RELATED BR-001, BR-030, BR-040, BR-041, BR-042, UC-001, UC-009
---
## AR-002 : Implement all UI and application logic in vanilla JavaScript, HTML, and CSS with no external runtime dependencies.
- RATIONALE: MV3 Content Security Policy blocks eval and remote script loading. Vanilla JS avoids bundle tooling, keeps deployment as a simple file copy to ./build/extension, and removes dependency version drift risk. Satisfies BR-015 (formula engine cannot use eval).
- NOTES No npm runtime packages; Playwright used only for testing (not bundled into extension).
- RELATED BR-015, BR-035, UC-001 through UC-028
---
## AR-003 : Use a recursive descent parser for formula arithmetic evaluation (no eval, no new Function).
- RATIONALE: MV3 CSP explicitly blocks eval and new Function. A hand-written recursive descent parser supports standard operator precedence (+, -, *, /, parentheses) without security risk and is easily extended to handle type-specific error returns (BR-023). Already implemented in safeCalc().
- NOTES safeCalc() handles pure numeric expressions; text and date expressions are resolved before reaching safeCalc.
- RELATED BR-015, BR-016, BR-023, UC-003
---
## AR-004 : Expand the FormulaEngine with a two-pass evaluation strategy: string/date functions resolved first; arithmetic expressions via safeCalc second.
- RATIONALE: Text functions (UPPER, LEN, CONCATENATE, &) and date functions (TODAY, DATE) return string results that cannot be fed into the numeric recursive descent parser. Resolving them in a pre-pass before expandFunctions() allows the existing numeric pipeline to remain unchanged. BR-110 through BR-116, BR-117 through BR-122, BR-123 through BR-126 are addressed.
- NOTES Text function pre-pass identifies the top-level expression type; if the result is a string, it bypasses safeCalc.
- RELATED BR-110 through BR-132, UC-025, UC-026, UC-027, UC-028
---
## AR-005 : Support absolute cell references by stripping $ signs during evaluation and tracking them per token for copy-paste adjustment.
- RATIONALE: The replaceRefs() regex must recognise $A$1, $A1, A$1 and strip the $ before resolving the address. The raw formula stored in the cell data preserves the $ tokens so that paste offset logic can read them and make the correct adjustment (adjust relative parts only). This satisfies BR-127 through BR-132.
- NOTES The paste adjustment function reads the raw formula, tokenises references with a regex capturing the $ positions, and rewrites each reference applying the row/column offset only to parts without $.
- RELATED BR-127, BR-128, BR-129, BR-130, BR-131, BR-132, UC-028
---
## AR-006 : Use chrome.storage.local for persisting cell data, formats, sheet names, and window geometry.
- RATIONALE: chrome.storage.local is the only MV3-compatible storage mechanism for extension data. Keys: `sheetData` (grid contents), `windowGeometry` (size/position). No IndexedDB required given the 50×26 grid size which comfortably fits within chrome.storage quota.
- NOTES Save on every cell commit and sheet operation; load on app init.
- RELATED BR-040, BR-041, BR-042, UC-009
---
## AR-007 : Use a declarative RIBBON_CONFIG array to drive ribbon tab definition and rendering.
- RATIONALE: A JavaScript configuration array for Home ribbon groups allows adding new tab configs (Formulas, Data, View) alongside Home without duplicating render logic. renderRibbon() iterates over the active tab's config and creates DOM elements. This satisfies BR-068 through BR-072 without requiring a full component framework.
- NOTES Each tab config is an array of group objects, each with a label and items array.
- RELATED BR-046 through BR-051, BR-068 through BR-072, UC-011, UC-016
---
## AR-008 : Implement Find & Replace as a modeless in-page overlay dialog driven by DOM manipulation.
- RATIONALE: Browser native dialogs don't support the dual-input, non-blocking Find & Replace UX. A custom DOM overlay is required. It must be modeless (grid remains accessible behind it) and keyboard-driven (Ctrl+F, Ctrl+H, Escape). Satisfies BR-095 through BR-099.
- NOTES Dialog HTML is injected once at load; visibility toggled via CSS `display`.
- RELATED BR-095, BR-096, BR-097, BR-098, BR-099, UC-022
---
## AR-009 : Implement the File Backstage as an in-page overlay panel that covers the grid while open.
- RATIONALE: A full-panel overlay styled with Excel's green sidebar pattern gives the correct visual effect without a new chrome.windows call. The backstage element is always in the DOM; its visibility is toggled. Satisfies BR-073 through BR-077.
- NOTES Escape and Back button both call the same close function.
- RELATED BR-073, BR-074, BR-075, BR-076, BR-077, UC-017
---
## AR-010 : Use JavaScript's Intl.NumberFormat and Date APIs for number formatting and date functions.
- RATIONALE: Intl.NumberFormat provides locale-aware currency, percentage, and decimal formatting with no dependencies. The Date API provides getFullYear(), getMonth(), getDate(), getHours(), getMinutes() for date functions. Satisfies BR-082 through BR-086 and BR-123 through BR-126.
- NOTES Date function string representations use ISO 8601 YYYY-MM-DD format for interoperability.
- RELATED BR-082, BR-083, BR-084, BR-085, BR-086, BR-123, BR-124, BR-125, BR-126, UC-019, UC-027
---

