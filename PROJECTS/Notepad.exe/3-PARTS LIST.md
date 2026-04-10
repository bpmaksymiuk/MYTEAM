# Parts List — Notepad.exe

Derived from: `3-ARCHITECTURE-RECOMMENDATIONS.md`, `2-REQUIREMENTS.md`
Stage: 3 — Architect

---

## PT-001 : manifest.json — Extension Manifest
- DESCRIPTION: Chrome Extension Manifest V3 descriptor. Declares extension name, version, permissions, background service worker, and action (icon click handler). Defines the icon asset references.
- TECHNOLOGY RECOMMENDATIONS: JSON, Chrome Extension Manifest V3 schema. Required permissions: `storage`, `windows`. Host permissions: none. `action` key with no default_popup (click handled in service worker).
- NOTES None
- RELATED UC-001, UC-008, AR-001, AR-002, BR-001, BR-038

---

## PT-002 : background.js — Background Service Worker
- DESCRIPTION: Service worker that handles the extension icon click event (`chrome.action.onClicked`). Checks `chrome.storage.local` for a saved window ID. If the window still exists, focuses it; otherwise creates a new window pointing at `notepad.html`. Persists the new window's ID and geometry (top, left, width, height) to storage. Responds to `chrome.windows.onRemoved` to clean up the stored window ID when the user closes the window.
- TECHNOLOGY RECOMMENDATIONS: JavaScript (ES2020), Chrome Extension Service Worker API (`chrome.action`, `chrome.windows`, `chrome.storage.local`).
- NOTES Service worker can be terminated between events; must re-read storage on each invocation rather than relying on global variable state.
- RELATED UC-008, AR-001, AR-002, AR-005, BR-001, BR-038, BR-039, BR-040, BR-041, BR-042

---

## PT-003 : notepad.html — Main Window Page
- DESCRIPTION: The root HTML document for the Notepad window. Provides the structural skeleton: title bar area (handled by OS), menu bar, textarea editor, status bar, and help modal overlay container. Links `notepad.css` and `notepad.js`.
- TECHNOLOGY RECOMMENDATIONS: HTML5 semantic markup. Single `<textarea id="editor">` as editor surface. `<div id="menubar">` containing nested menu structures. `<div id="statusbar">` with spans for each statistic. `<div id="help-modal">` for Help dialog overlay (hidden by default).
- NOTES None
- RELATED UC-001, UC-002, UC-002B, UC-008, UC-009, AR-003, AR-004, AR-011, BR-003 through BR-009

---

## PT-004 : notepad.css — Windows Notepad Stylesheet
- DESCRIPTION: CSS rules that replicate the Windows Notepad visual appearance. Includes: full-window flex layout, menu bar with hover states, textarea with monospace/system font, status bar styling, and modal overlay for the Help dialog. Implements CSS custom properties for theme colors.
- TECHNOLOGY RECOMMENDATIONS: CSS3, `font-family: 'Segoe UI', system-ui, -apple-system, Arial, sans-serif`. Windows-style color palette: #FFFFFF window background, #000000 text, #F0F0F0 status bar and menu bar background, #0078D7 selection highlight. `box-sizing: border-box` reset.
- NOTES None
- RELATED UC-001, UC-002, UC-008, AR-007, AR-008, BR-008, BR-018

---

## PT-005 : notepad.js — Application Logic
- DESCRIPTION: Main client-side script attached to `notepad.html`. Owns all editor interactions, menu bar behavior, document state (content, filename, saved flag, unsaved-changes flag), status bar updates, and Help dialog. Integrates with PT-006 (`storage.js`) for save/load operations. Responsibilities:
  1. Initialize editor from saved content in `chrome.storage.local` on page load.
  2. Handle menu bar click routing for all File, Edit, View, and Help actions.
  3. Implement File > New (with unsaved-changes guard), File > Open, File > Save, File > Save As, File > Exit.
  4. Implement Edit > Undo, Cut, Copy, Paste, Find, Replace.
  5. Implement View > Word Wrap and Zoom (zoom in / zoom out / reset).
  6. Implement Help > View Help (show/hide modal) and Help > About Notepad.
  7. Track unsaved-changes state and display asterisk or indicator in title bar.
  8. Update window title via `document.title`.
  9. Compute and update status bar statistics on `input` and `selectionchange` events.
- TECHNOLOGY RECOMMENDATIONS: Vanilla JavaScript (ES2020), `document.addEventListener`, `textarea.selectionStart` / `selectionEnd` for cursor stats, `window.confirm()` for destructive-action guards.
- NOTES None
- RELATED UC-001 through UC-009, AR-004, AR-007, AR-009, AR-010, AR-011, BR-002 through BR-047

---

## PT-006 : storage.js — Storage Abstraction Module
- DESCRIPTION: Thin wrapper around `chrome.storage.local` for note content and window geometry persistence. Exports async functions: `saveNote(name, content)`, `loadNote(name)`, `listNotes()`, `saveGeometry(rect)`, `loadGeometry()`. Centralizes storage key naming to prevent key collisions.
- TECHNOLOGY RECOMMENDATIONS: Vanilla JavaScript (ES2020) with `chrome.storage.local` API. Async/await patterns wrapping `chrome.storage.local.set` / `chrome.storage.local.get`.
- NOTES Consumed by both PT-005 (notepad.js) for save/load operations and PT-002 (background.js) for window geometry.
- RELATED UC-003, UC-004, UC-008, AR-005, BR-019, BR-020, BR-021, BR-022, BR-023, BR-025, BR-040
