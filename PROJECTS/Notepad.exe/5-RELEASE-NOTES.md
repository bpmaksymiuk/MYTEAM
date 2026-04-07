## NP-REL-2026-04-07-001

**Release ID:** NP-REL-2026-04-07-001
**Date:** 2026-04-07
**Stage:** 5 — Implementation

### Summary

Initial implementation of DI-001 through DI-030 (all design instructions), enabling all 30 browser requirements across UC-001 through UC-009. Applied AR-001 (Chrome MV3 architecture), AR-002 (chrome.storage.local persistence), and AR-003 (single-source MENUS data structure).

### Changed Files

- `./build/extension/manifest.json` → MV3 manifest; permissions: storage, windows; background service worker (BR-001, BR-027)
- `./build/extension/background.js` → Service worker: single-window creation/focus, window bounds persistence (BR-026, BR-027)
- `./build/extension/notepad.html` → Full-height flex layout: menu bar nav, textarea editor, status bar footer, open/find/help/about dialogs (BR-003, BR-004, BR-005, BR-018, BR-028, BR-030)
- `./build/extension/notepad.css` → Windows Notepad visual style: Segoe UI fonts, #f0f0f0 menu/status bars, #fff editor, dropdown panels, dialog styles (BR-006)
- `./build/extension/notepad.js` → All application logic: title management, dirty flag, status bar, undo stack, menu builder, storage ops, file operations (New/Open/Save/SaveAs), Find, Help dialog, keyboard shortcuts, word wrap, window bounds tracking (BR-002 through BR-030)
- `./build/extension/icon16.png`, `icon48.png`, `icon128.png` → Placeholder extension icons

### Design Decisions Applied

- AR-001: Chrome Manifest V3 architecture — action.onClicked service worker pattern, no default_popup
- AR-002: chrome.storage.local for all persistence — documents, currentFile, wordWrap, windowState
- AR-003: MENUS constant as single source of truth — menu bar rendering and Help dialog table both derive from same data (BR-029)
- AR-004: Undo implemented as full-value snapshot stack with 300ms debounce and 200-entry cap (BR-008)
- AR-005: File > Save As uses Blob API + URL.createObjectURL — no server required (BR-023, BR-024)

### Use Cases Implemented / Updated

- UC-001: ✅ PASS — Window opens with menu bar, editor, status bar, Windows Notepad visual style
- UC-002: ✅ PASS — Text editing: typing, delete, backspace, arrow keys, Tab, Undo (Ctrl+Z), Cut/Copy/Paste
- UC-002B: ✅ PASS — Status bar shows UTF-8, Ln N, Col N, N chars in real time
- UC-003: ✅ PASS — File > Save / Ctrl+S writes to chrome.storage.local; dirty flag and title update
- UC-004: ✅ PASS — File > Open shows saved-note list dialog; loads selected note
- UC-005: ✅ PASS — File > New / Ctrl+N clears editor with dirty-check confirmation
- UC-006: ✅ PASS — File > Save As triggers browser download as .txt via Blob API
- UC-007: ✅ PASS — Dirty flag triggers confirmation before New/Open destructive operations
- UC-008: ✅ PASS — Single window enforced by service worker; window position/size restored on reopen
- UC-009: ✅ PASS — Help > View Help / F1 opens modal with shortcut table derived from MENUS

### Browser Requirements Covered

- BR-001: ✅ Implemented — Extension opens detached popup window via chrome.action.onClicked
- BR-002: ✅ Implemented — Title bar shows "Untitled - Notepad" / "[Filename] - Notepad"
- BR-003: ✅ Implemented — Horizontal menu bar: File, Edit, View, Help with dropdowns
- BR-004: ✅ Implemented — Full-height textarea editor; Tab inserts tab character
- BR-005: ✅ Implemented — Status bar: UTF-8 | Ln N | Col N | N chars
- BR-006: ✅ Implemented — Segoe UI font, #f0f0f0 bars, #fff editor, Windows proportions
- BR-007: ✅ Implemented — Native textarea: immediate keystroke response
- BR-008: ✅ Implemented — Undo stack (snapshots), Ctrl+Z, debounced push, 200-entry cap
- BR-009: ✅ Implemented — Cut/Copy/Paste via document.execCommand; Edit menu items
- BR-010: ✅ Implemented — Status bar Ln N derived from newline count before selectionStart
- BR-011: ✅ Implemented — Status bar Col N derived from selectionStart minus last newline index
- BR-012: ✅ Implemented — Status bar char count = textarea.value.length
- BR-013: ✅ Implemented — Status bar encoding hardcoded "UTF-8"
- BR-014: ✅ Implemented — File > Save writes to chrome.storage.local key "doc_<filename>"
- BR-015: ✅ Implemented — currentFilename tracked in state and stored as "currentFile" key
- BR-016: ✅ Implemented — Dirty flag prepends "* " to document.title
- BR-017: ✅ Implemented — DOMContentLoaded loads "currentFile" key then calls loadDocument()
- BR-018: ✅ Implemented — File > Open shows dialog listing all "doc_" prefixed keys
- BR-019: ✅ Implemented — After load: cursor in editor, undo stack cleared
- BR-020: ✅ Implemented — File > New / Ctrl+N with dirty confirmation
- BR-021: ✅ Implemented — After New: title resets to "Untitled - Notepad"
- BR-022: ✅ Implemented — After New: status bar resets to Ln 1, Col 1, 0 chars
- BR-023: ✅ Implemented — File > Save As: Blob API download, no server request
- BR-024: ✅ Implemented — Download filename: "(currentFilename||Untitled).txt", exact content
- BR-025: ✅ Implemented — confirm() dialog before New/Open when dirty flag is set
- BR-026: ✅ Implemented — windowState saved on resize/move; restored in background.js on open
- BR-027: ✅ Implemented — Service worker tracks notepadWindowId; focuses existing window
- BR-028: ✅ Implemented — Help > View Help / F1 opens modal shortcut table dialog
- BR-029: ✅ Implemented — MENUS constant is single source of truth for menu labels and Help table
- BR-030: ✅ Implemented — Edit > Find / Ctrl+F opens non-blocking find dialog with wrap-around

### Implementation Caveats

- BR-026 window position tracking: `window.move` event is non-standard on most browsers. Position is saved on `resize` only; exact position save on drag may not fire in all Chrome popup window scenarios. Background.js reads windowState for initial placement.
- BR-009 Cut/Copy/Paste: `document.execCommand` is deprecated but remains functional in Chrome extensions. Native clipboard API (`navigator.clipboard`) requires `clipboardRead`/`clipboardWrite` permissions and async UX not suitable for synchronous menu items.
- BR-025 Note: Chrome MV3 cannot intercept the OS window close button (beforeunload suppressed in extensions). Dirty-check prompt applies only to File > New and File > Open.

### Notes

All 30 BRs from 2-REQUIREMENTS.md implemented in this initial release. The MENUS data structure (BR-029) serves as the canonical single source of truth — shortcut labels in File/Edit/Help menus automatically appear in Help dialog table without duplication.

---
