# Parts List

Generated from `2-REQUIREMENTS.md` and `3-ARCHITECTURE-RECOMMENDATIONS.md`. Owned by Architect.

---

## PT-001 : manifest.json — Extension Manifest
- DESCRIPTION
  The Chrome Extension Manifest V3 declaration file. Defines the extension name, version, permissions, service worker entry point, and browser action.
- TECHNOLOGY RECOMMENDATIONS
  JSON. Manifest version 3. permissions: ["storage", "windows"]. background.service_worker: "background.js". action: {} (no default popup — click is handled by the service worker).
- NOTES
  host_permissions is not required for this extension. web_accessible_resources not required for internal extension pages.
- RELATED UC-001, UC-008, BR-001, BR-017, AR-001

---

## PT-002 : background.js — Service Worker
- DESCRIPTION
  The MV3 service worker that manages the Notepad window lifecycle (create, focus, close) and persists window bounds to chrome.storage.local. Handles the toolbar icon click event.
- TECHNOLOGY RECOMMENDATIONS
  Vanilla JavaScript. chrome.action.onClicked listener. chrome.windows.create(), chrome.windows.update(), chrome.windows.onBoundsChanged, chrome.windows.onRemoved. chrome.storage.local.get/set.
- NOTES
  Tracks active windowId in module-level variable. On icon click: if windowId exists, focus it; otherwise read stored bounds, create window. On onBoundsChanged: write new bounds to storage. On onRemoved: clear windowId.
- RELATED UC-001, UC-008, BR-001, BR-017, BR-018, BR-019, AR-001, AR-002, AR-003

---

## PT-003 : notepad.html — UI Page Shell
- DESCRIPTION
  The single HTML page loaded as the Notepad window content. Contains the title bar, menu bar (File, Edit, Help), dropdown containers, textarea editor, status bar, and help dialog.
- TECHNOLOGY RECOMMENDATIONS
  HTML5. Semantic layout with div#titlebar, nav#menubar, div#dropdown-container, textarea#editor, div#statusbar, dialog#help-dialog. Links notepad.css and notepad.js.
- NOTES
  The window's background frame is managed by Chrome (OS chrome). The HTML page covers the interior client area. Do not attempt to replicate a window chrome in HTML.
- RELATED UC-001, UC-002, UC-009, BR-002, BR-003, BR-004, BR-005, BR-020, AR-004

---

## PT-004 : notepad.css — Windows 95 Theme
- DESCRIPTION
  All visual styling for the Notepad UI. Implements the Windows 95 aesthetic using CSS custom properties, box-shadow beveled borders, and the silver/navy color palette.
- TECHNOLOGY RECOMMENDATIONS
  CSS3. Custom properties (--win95-silver: #c0c0c0, --win95-navy: #000080). box-shadow border technique for beveled outset/inset effects. Courier New for editor font. System-ui or MS Sans Serif equivalent for UI chrome text.
- NOTES
  Avoid external web fonts — use system font stack only. Font loading from network would slow first-paint and require additional CSP configuration.
- RELATED UC-001, BR-002, AR-007

---

## PT-005 : notepad.js — Editor Logic and Interactions
- DESCRIPTION
  All client-side JavaScript for the Notepad page: auto-load on open, dirty state tracking, save/load/new actions, file download, menu bar dropdowns, keyboard shortcuts, and help dialog population.
- TECHNOLOGY RECOMMENDATIONS
  Vanilla JavaScript ES6+. chrome.storage.local for save/load. Blob + URL.createObjectURL for download. HTML dialog.showModal() for help. addEventListener for all events. A single MENUS data structure drives both the menu bar rendering and the help shortcuts table (single source of truth).
- NOTES
  Dirty tracking: set isDirty = true on editor 'input' event, reset to false after save/load/new completes. Confirmation prompt: window.confirm() before destructive actions when isDirty is true.
- RELATED UC-002, UC-003, UC-004, UC-005, UC-006, UC-007, UC-009, BR-004, BR-005, BR-006, BR-007, BR-008, BR-009, BR-010, BR-011, BR-012, BR-013, BR-014, BR-015, BR-016, BR-020, BR-021, BR-022, AR-002, AR-005, AR-006, AR-008

---

## PT-006 : notepad_128.png — Extension Icon
- DESCRIPTION
  A 128×128 PNG icon displayed in the Chrome toolbar and extensions management page. Represents the Notepad application visually.
- TECHNOLOGY RECOMMENDATIONS
  PNG format. Simple design: white notepad page outline with lines on a navy or silver background consistent with the Win95 theme. Can be a placeholder solid-color icon for the initial build.
- NOTES
  If a suitable icon is not available, Chrome will display the default puzzle-piece icon. This does not affect functionality.
- RELATED UC-001, BR-001, AR-001
