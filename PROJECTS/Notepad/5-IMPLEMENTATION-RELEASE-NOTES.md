# Implementation Release Notes

---

## RELEASE-NOTES: NP-REL-2026-04-04-001

- **Version ID:** NP-REL-2026-04-04-001
- **Date:** 2026-04-04
- **Pipeline Run:** T-PIPELINE-001

### Summary of Instructions Implemented

| DI | Summary | UC | BR | AR |
|----|---------|----|----|-----|
| DI-001 | manifest.json — MV3 manifest with storage + windows permissions, service_worker, action | UC-001, UC-008 | BR-001, BR-017 | AR-001 |
| DI-002 | background.js — Service worker: focus-or-create window, bounds persistence, onRemoved cleanup, error recovery | UC-001, UC-008 | BR-001, BR-017, BR-018, BR-019 | AR-001, AR-002, AR-003 |
| DI-003 | notepad.html — Single-page shell: title bar, menu bar, textarea editor, status bar, help dialog | UC-001, UC-002, UC-009 | BR-002, BR-003, BR-004, BR-005, BR-020 | AR-004 |
| DI-004 | notepad.css — Windows 95 theme: navy title bar, silver chrome, beveled box-shadow borders, Courier New editor | UC-001 | BR-002 | AR-007 |
| DI-005 | notepad.js — Auto-load on open, editor focus, dirty tracking via setDirty(), title bar asterisk indicator | UC-001, UC-002, UC-004 | BR-003, BR-004, BR-009, BR-010, BR-012 | AR-002, AR-005 |
| DI-006 | notepad.js — saveNote(), newNote(), loadNoteFromStorage(), showStatus() with error handling on all storage calls | UC-003, UC-004, UC-005, UC-007 | BR-006, BR-007, BR-008, BR-009, BR-011, BR-012, BR-013, BR-014 | AR-002, AR-005 |
| DI-007 | notepad.js — downloadNote() via Blob + URL.createObjectURL, note.txt default filename, immediate URL revoke | UC-006 | BR-015, BR-016 | AR-006 |
| DI-008 | notepad.js — MENUS data structure (single source of truth), initMenus() dropdowns, initKeyboardShortcuts(), matchesShortcut() | UC-002, UC-009 | BR-004, BR-005, BR-020, BR-021 | AR-005 |
| DI-009 | notepad.js — showHelp() populates shortcuts table from MENUS, dialog.showModal(), Close button + Escape wired | UC-009 | BR-020, BR-021, BR-022 | AR-008 |

### List of Use Cases Implemented

| UC | Title | Status |
|----|-------|--------|
| UC-001 | Open Notepad Popup | Implemented |
| UC-002 | Type And Edit Note Content | Implemented |
| UC-003 | Save Note To Local Storage | Implemented |
| UC-004 | Load Saved Note | Implemented |
| UC-005 | Create New Blank Note | Implemented |
| UC-006 | Download Note As Text File | Implemented |
| UC-007 | Prevent Accidental Data Loss | Implemented (with caveat — see below) |
| UC-008 | Use Notepad As A Desktop-Style Window | Implemented |
| UC-009 | View Keyboard Shortcuts In Help | Implemented |

### Build Files Produced

- `build/extension/manifest.json`
- `build/extension/background.js`
- `build/extension/notepad.html`
- `build/extension/notepad.css`
- `build/extension/notepad.js`

### Runtime Caveats

**BR-013 / UC-007 — Window close button interception:**
The OS window close button (×) cannot be intercepted in a Chrome Extension MV3 service worker context. The `beforeunload` event is not reliably dispatched in extension-managed windows. The confirmation prompt (window.confirm) fires correctly for New and Load actions as specified in the UC-007 STEPS. Close-button interception is a known Chrome extension platform limitation and is out of scope for this release.

---
