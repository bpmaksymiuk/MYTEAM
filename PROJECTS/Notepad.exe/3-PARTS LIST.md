# Parts List — Notepad.exe

## PT-001 : manifest.json — Extension Manifest
- DESCRIPTION: Chrome Extension Manifest V3 declaration file. Defines extension name, version, permissions, background service worker entry point, and the action popup/window target. Sets `"action": {}` with no popup (window is opened programmatically by background.js). Declares permissions for `storage` and `windows`.
- TECHNOLOGY RECOMMENDATIONS: AR-001 (Manifest V3 structure)
- NOTES: Located at `./build/extension/manifest.json`. Must declare `"background": {"service_worker": "background.js"}`.
- RELATED: UC-001, UC-008 | BR-001, BR-049 | AR-001

---

## PT-002 : background.js — Service Worker
- DESCRIPTION: The extension service worker. Handles `chrome.action.onClicked` to open or focus the Notepad window. Enforces single-instance rule by storing the active window ID. Listens to `chrome.windows.onRemoved` to clear the stored ID. Reads and writes window bounds (position, size) to `chrome.storage.local` for persistence across sessions.
- TECHNOLOGY RECOMMENDATIONS: AR-001 (MV3 service worker), AR-002 (chrome.storage.local for bounds), AR-004 (single-instance via chrome.storage.session)
- NOTES: Located at `./build/extension/background.js`. Must handle the case where a stored windowId refers to a closed window (call `chrome.windows.get` and catch errors).
- RELATED: UC-001, UC-008 | BR-001, BR-049, BR-050, BR-051, BR-052 | AR-001, AR-002, AR-004

---

## PT-003 : index.html — Extension Page Shell
- DESCRIPTION: The HTML shell loaded in the detached Chrome window. Links `theme.css` and all JS modules. Contains the structural markup: title bar area (purely visual — real chrome is the OS window), menu bar `<nav>`, editor `<textarea>`, status bar `<footer>`, and dialog overlay containers.
- TECHNOLOGY RECOMMENDATIONS: AR-006 (vanilla HTML), AR-007 (CSS custom properties via theme.css)
- NOTES: Located at `./build/extension/index.html`. JS loaded as `<script type="module" src="app.js">`. No inline scripts (CSP compliance).
- RELATED: UC-001, UC-002, UC-002B, UC-008 | BR-004, BR-009, BR-010 | AR-006, AR-007

---

## PT-004 : theme.css — Windows Notepad Visual Theme
- DESCRIPTION: All visual styling for the application. Defines CSS custom properties for colors, fonts, and sizing that match Windows Notepad appearance. Styles the menu bar, editor textarea, status bar, title bar chrome area, and all modal dialogs. Ensures Segoe UI font stack, correct background/foreground colors, and gray chrome bars.
- TECHNOLOGY RECOMMENDATIONS: AR-007 (CSS custom properties for theme)
- NOTES: Located at `./build/extension/theme.css`. Custom properties defined on `:root`. No external font imports — relies on system font stack.
- RELATED: UC-001, UC-002, UC-002B, UC-009 | BR-011, BR-012, BR-024, BR-057 | AR-007

---

## PT-005 : app.js — Application Controller
- DESCRIPTION: Main application entry point and controller. Initialises all components on `DOMContentLoaded`. Wires menu item clicks to their handler functions (File > New/Open/Save/Save As/Exit, Edit > Undo/Cut/Copy/Paste/Find/Replace, View > Word Wrap/Zoom, Help > View Help/About). Manages global application state: current filename, dirty flag, word-wrap toggle. Coordinates between editor, storage, downloader, statusbar, and dialog modules.
- TECHNOLOGY RECOMMENDATIONS: AR-006 (vanilla JS), AR-010 (dirty-flag state management)
- NOTES: Located at `./build/extension/app.js`. Imports all other modules. Sets cursor focus on textarea at init (BR-013).
- RELATED: UC-001, UC-002, UC-003, UC-004, UC-005, UC-006, UC-007, UC-008, UC-009 | BR-004, BR-005, BR-006, BR-007, BR-008, BR-013 | AR-006, AR-010

---

## PT-006 : editor.js — Editor Component
- DESCRIPTION: Manages the `<textarea>` editor element. Handles keyboard events: Tab key insertion (BR-016), Undo (Ctrl+Z), Cut/Copy/Paste. Exposes `getValue()`, `setValue(text)`, `clear()`, `focus()` methods for use by app.js. Sets and clears the dirty flag on input events. Handles word-wrap toggling by switching `wrap` attribute.
- TECHNOLOGY RECOMMENDATIONS: AR-005 (<textarea> for editor), AR-010 (dirty-flag tracking)
- NOTES: Located at `./build/extension/editor.js`. Tab handling must call `e.preventDefault()` and insert `\t` via `document.execCommand('insertText')` or manual selection manipulation to avoid focus loss.
- RELATED: UC-002 | BR-014, BR-015, BR-016, BR-017, BR-018 | AR-005, AR-010

---

## PT-007 : statusbar.js — Status Bar Component
- DESCRIPTION: Manages the status bar DOM element. Listens to `input`, `keyup`, and `click` events on the textarea to recompute and display: current line number (1-indexed), current column (1-indexed), total character count, and file encoding ("UTF-8"). Exports an `update()` method callable from app.js after programmatic content changes (load, clear).
- TECHNOLOGY RECOMMENDATIONS: AR-009 (textarea events + selectionStart for cursor math)
- NOTES: Located at `./build/extension/statusbar.js`. Line = newlines before selectionStart + 1. Col = selectionStart − (last \n position before cursor) + 1 (or selectionStart + 1 if no preceding \n). Char count = textarea.value.length.
- RELATED: UC-002B | BR-019, BR-020, BR-021, BR-022, BR-023, BR-024 | AR-009

---

## PT-008 : menubar.js — Menu Bar Component
- DESCRIPTION: Manages menu bar rendering and interaction. Each top-level menu label (File, Edit, View, Help) opens a dropdown on click. Clicking outside any open menu closes it. Each menu item dispatches a named event or calls a callback registered by app.js. Handles keyboard navigation (arrow keys, Escape to close) for accessibility.
- TECHNOLOGY RECOMMENDATIONS: AR-006 (vanilla JS DOM), AR-007 (theme.css for styling)
- NOTES: Located at `./build/extension/menubar.js`. Dropdowns are `<ul>` positioned absolutely below their parent `<li>`. Separator items rendered as `<hr>`.
- RELATED: UC-001 | BR-004, BR-005, BR-006, BR-007, BR-008 | AR-006, AR-007

---

## PT-009 : storage.js — Note Storage Manager
- DESCRIPTION: Encapsulates all `localStorage` read/write operations for note content and filename. Exports: `saveNote(filename, content)`, `loadNote(filename)`, `listNotes()`, `deleteNote(filename)`. Handles storage quota errors gracefully with a user-visible error message. All operations are synchronous (localStorage API).
- TECHNOLOGY RECOMMENDATIONS: AR-003 (localStorage for note persistence)
- NOTES: Located at `./build/extension/storage.js`. Key scheme: `notepad_note_<filename>` for content, `notepad_current` for last-used filename. `listNotes()` scans localStorage keys with `notepad_note_` prefix.
- RELATED: UC-003, UC-004 | BR-025, BR-026, BR-027, BR-028, BR-029, BR-030, BR-031, BR-032, BR-033, BR-034, BR-061 | AR-003

---

## PT-010 : downloader.js — File Download Handler
- DESCRIPTION: Handles the Save As / download-to-disk flow. Exports `downloadAsText(content, filename)`. Creates a `Blob` with type `text/plain;charset=utf-8`, generates an object URL, programmatically clicks a hidden `<a>` element with the `download` attribute set to the filename, then immediately revokes the object URL.
- TECHNOLOGY RECOMMENDATIONS: AR-008 (Blob + URL.createObjectURL for download)
- NOTES: Located at `./build/extension/downloader.js`. Default filename is `Untitled.txt` when no filename provided. Must append `.txt` if not already present.
- RELATED: UC-006 | BR-041, BR-042, BR-043, BR-044, BR-045 | AR-008

---

## PT-011 : dialogs.js — Modal Dialog Manager
- DESCRIPTION: Manages all in-page modal dialogs: (1) Unsaved-changes confirmation (Yes/Cancel), (2) Open/file picker listing saved notes from localStorage, (3) Help dialog displaying all keyboard shortcuts. Each dialog is a pre-rendered `<div>` overlay in index.html, shown/hidden via CSS class. Exports `showConfirm(message)`, `showOpenPicker(notes, callback)`, `showHelp()`. All dialogs support Escape-key dismissal and Close/Cancel button.
- TECHNOLOGY RECOMMENDATIONS: AR-011 (in-page DOM overlays for dialogs)
- NOTES: Located at `./build/extension/dialogs.js`. `showConfirm` returns a Promise resolving to `true` (confirmed) or `false` (cancelled). Focus is trapped within dialog while open. Dialog styled to match Windows modal appearance via theme.css.
- RELATED: UC-004, UC-005, UC-007, UC-009 | BR-030, BR-037, BR-038, BR-047, BR-048, BR-054, BR-055, BR-056, BR-057, BR-058, BR-059 | AR-011

---

## PT-012 : notepad_test_pipeline001.mjs — Playwright Test Pipeline Script
- DESCRIPTION: Playwright 1.59.1 test script covering all 10 use cases. Serves `./build/extension` via `python3 -m http.server`. Launches Chromium with `headless: false`, `DISPLAY=:0`. Runs UC-001 through UC-009 sequentially, capturing screenshots for each. Writes `testresults/T-PIPELINE-NP-001/results.json`. Prints pass/fail summary. UC-001 and UC-008 (chrome.windows.create) are expected PARTIAL due to requiring real extension install.
- TECHNOLOGY RECOMMENDATIONS: AR-012 (Playwright 1.59.1)
- NOTES: Located at `./PROJECTS/Notepad.exe/notepad_test_pipeline001.mjs`. Import from `/tmp/node_modules/playwright/index.mjs`. Run with `DISPLAY=:0 node notepad_test_pipeline001.mjs`.
- RELATED: UC-001, UC-002, UC-002B, UC-003, UC-004, UC-005, UC-006, UC-007, UC-008, UC-009 | BR-001, BR-004, BR-009, BR-010, BR-014, BR-019, BR-025, BR-030, BR-035, BR-041, BR-054 | AR-012

---
