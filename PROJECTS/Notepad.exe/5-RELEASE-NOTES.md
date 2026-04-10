## NP-EXE-REL-2026-04-10-001

**Release ID:** NP-EXE-REL-2026-04-10-001
**Date:** 2026-04-10
**Stage:** 5 — Implementation

### Summary
Initial implementation of the Notepad.exe Chrome Extension. All 13 design instructions (DI-001 through DI-013) implemented in full. Six extension files created under `./build/extension/`. The extension opens a standalone Windows-Notepad-styled window for plain-text editing with save/load, file download, unsaved-change guards, status bar, and keyboard shortcuts.

### Changed Files
| File | DI |
|------|-----|
| `build/extension/manifest.json` | DI-001, DI-002 |
| `build/extension/background.js` | DI-001, DI-003 |
| `build/extension/storage.js`    | DI-001, DI-004 |
| `build/extension/notepad.html`  | DI-001, DI-005 |
| `build/extension/notepad.css`   | DI-001, DI-006 |
| `build/extension/notepad.js`    | DI-001, DI-007, DI-008, DI-009, DI-010, DI-011, DI-012, DI-013 |

### Design Decisions Applied
- **DI-002**: Manifest V3 with `"type": "module"` on the service worker to support ES module imports.
- **DI-003**: Service worker tracks window ID in `chrome.storage.local`; `chrome.windows.onRemoved` cleans up IDs when window is closed. `try/catch` guards stale window IDs from prior sessions.
- **DI-004**: `Object.prototype.hasOwnProperty.call` used instead of `in` or direct property access to safely test storage results.
- **DI-009**: File > Save As writes to both `chrome.storage.local` and triggers a browser download via the Blob + anchor-download pattern (AR-006).
- **DI-012**: Status bar listens to `input`, `keyup`, `click`, `select`, and `selectionchange` to cover all cursor movement scenarios including arrow-key navigation.

### Use Cases Implemented / Updated
UC-001, UC-002, UC-002B, UC-003, UC-004, UC-005, UC-006, UC-007, UC-008, UC-009

### Business Requirements Covered
BR-001 through BR-047 (all)

### Implementation Caveats
1. **File > Open dialog**: Implemented via `window.prompt` with a numbered list of saved notes. A custom HTML dialog for Open was not in the original PT-003 design; `window.prompt` is the appropriate minimal implementation. Future enhancement could add a custom-styled file picker modal.
2. **OS window close button (×)**: Cannot be intercepted by a Chrome extension service worker to prompt for unsaved changes. This is a known Chrome extension platform limitation documented in UC-007. The unsaved-change guard covers File > New and File > Open only.
3. **`document.execCommand` for Undo/Cut/Copy/Paste**: Deprecated API but fully functional within Chromium for `<textarea>` elements. The Clipboard API requires an async user gesture and is unsuitable for keyboard shortcut passthrough. No security concern — the API only operates on in-page selection within the extension's own document.
4. **Find/Replace**: Find locates the first occurrence only (case-insensitive). Replace replaces the first occurrence only. This matches baseline Windows Notepad behavior for this release scope.

### Notes
None
