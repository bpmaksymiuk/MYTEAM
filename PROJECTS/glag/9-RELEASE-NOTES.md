# Release Notes — Cyrillic ↔ Glagolitic Converter

---

## v0.1.0 — Initial Release

**Release ID:** RN-001  
**Date:** 2026-05-02  
**Status:** Released  

---

### Summary

First production release of the Cyrillic ↔ Glagolitic Converter web application. The application converts text between Ukrainian Cyrillic and the historical Glagolitic script in both directions, with live character-by-character conversion, a complete character mapping reference table, one-click clipboard copy, and a clear/reset action.

---

### Features Delivered

| ID | Use Case | Feature |
|----|----------|---------|
| RN-001-F1 | UC-001 | Live Cyrillic → Glagolitic conversion as the user types. 29 uppercase + 29 lowercase character pairs. Unmapped characters pass through unchanged. |
| RN-001-F2 | UC-002 | Character mapping reference table accessible via "☰ Mapping" button. Shows all 29 uppercase pairs with Cyrillic name, Glagolitic character, and Glagolitic name columns. |
| RN-001-F3 | UC-003 | "✕ Clear" button clears both input and output panels and returns focus to the input textarea. |
| RN-001-F4 | UC-004 | "⎘ Copy Output" button copies converted Glagolitic text to the clipboard using the browser Clipboard API. Disabled when output is empty. Toast notification "✓ Copied to clipboard" confirms success. |
| RN-001-F5 | UC-005 | Live Glagolitic → Cyrillic conversion in reverse mode. Mode toggle bar with "Cyrillic → Glagolitic" and "Glagolitic → Cyrillic" buttons. Switching mode clears both panels. Panel border colours swap to distinguish input from output in each mode. |

---

### Technical Notes

- **Stack:** Vite 5.x, TypeScript 5.x (strict), vanilla DOM.
- **Build output:** `./dist/` — single HTML entry point with bundled JS and CSS.
- **Mapping:** 29-pair table (UC excludes Ѕ which is not in modern Ukrainian). `Map<string,string>` with programmatically-derived reverse.
- **Clipboard:** `navigator.clipboard.writeText` with silent catch for environments that do not support it.
- **No backend.** Static SPA. No dependencies beyond Vite and TypeScript.

---

### Verification History

| Date | Build | Result | Notes |
|------|-------|--------|-------|
| 2026-05-02 | v0.1.0 | ✓ PASS | `tsc && vite build` — 0 TypeScript errors, 7 modules bundled, dist 6.19 kB JS + 5.23 kB CSS. |
