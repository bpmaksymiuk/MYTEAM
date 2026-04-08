# Release Notes — Notepad.exe

---

## NP-REL-2026-04-08-001 — v0.1.0 — Initial Implementation

**Date:** 2026-04-08
**Stage:** 5 (Developer)
**Related DIs:** DI-001 through DI-011
**Related BRs:** BR-001 through BR-061

### Summary
Initial implementation of the Notepad.exe Chrome Extension. All 11 source files written from scratch per `4-DESIGN-INSTRUCTIONS.md`.

### Files Added
| File | DI | Description |
|------|----|-------------|
| `build/extension/manifest.json` | DI-001 | Chrome MV3 manifest: service worker, storage + windows permissions |
| `build/extension/index.html` | DI-001 | HTML shell: menubar nav, textarea editor, statusbar footer, 3 dialog overlays |
| `build/extension/background.js` | DI-002 | Service worker: single-instance window management via `chrome.storage.session`, bounds persistence via `chrome.storage.local` |
| `build/extension/theme.css` | DI-003 | Full Windows Notepad theme using CSS custom properties |
| `build/extension/menubar.js` | DI-004 | Dynamic dropdown menubar: File/Edit/View/Help with all required actions |
| `build/extension/editor.js` | DI-005 | Textarea editor component: Tab insertion, dirty-flag, word-wrap toggle |
| `build/extension/statusbar.js` | DI-006 | Status bar: Ln/Col computed from `selectionStart`, char count, UTF-8 indicator |
| `build/extension/storage.js` | DI-007 | localStorage persistence: save/load/list/delete notes, current filename tracking |
| `build/extension/downloader.js` | DI-008 | Blob-based client-side file download; auto-appends `.txt` extension |
| `build/extension/dialogs.js` | DI-009 | In-page modal dialogs: Confirm (Yes/No/Cancel), Open picker, Help/shortcuts |
| `build/extension/app.js` | DI-010 | Main orchestrator: DOMContentLoaded boot, menu action dispatch, Ctrl+N/O/S shortcuts, unsaved guard |
| `notepad_test_pipeline001.mjs` | DI-011 | Playwright test pipeline: 10 test cases covering UC-001 through UC-010 |

### Known Limitations
- **UC-001/UC-008 (PARTIAL):** `chrome.windows.create` requires the extension to be installed in Chrome (not just loaded via `--load-extension`). The detached window feature is implemented correctly in `background.js` but cannot be fully automated in the Playwright test pipeline.
- **Save As:** Uses `window.prompt()` for filename input (acceptable fallback for MV3 extension popup; no `<input>` dialog added to keep scope minimal).

### BRs Implemented
All 61 BRs (BR-001 through BR-061) from `2-REQUIREMENTS.md` are implemented.

### ARs Implemented
All 12 ARs (AR-001 through AR-012) from `3-ARCHITECTURE-RECOMMENDATIONS.md` are implemented.
