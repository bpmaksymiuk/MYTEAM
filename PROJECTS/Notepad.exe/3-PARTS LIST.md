# Parts List

Generated from `2-REQUIREMENTS.md` and `3-ARCHITECTURE-RECOMMENDATIONS.md`. Owned by Architect.

---

## PT-001 : manifest.json — Extension Manifest
- DESCRIPTION
  Chrome Extension Manifest V3 declaration file. Registers the extension name, version, required permissions, service worker entry point, and browser action (toolbar icon with no default popup — clicks are routed to the service worker).
- TECHNOLOGY RECOMMENDATIONS
  JSON. Manifest version 3. permissions: ["storage", "windows"]. background.service_worker: "background.js". action: {} with no default_popup.
- NOTES
  host_permissions is not required. web_accessible_resources is not required for internal extension pages. The absence of a default_popup is intentional — chrome.action.onClicked fires instead.
- RELATED UC-001, UC-008 | BR-001, BR-027 | AR-001

---

## PT-002 : background.js — Service Worker
- DESCRIPTION
  Event-driven service worker that handles chrome.action.onClicked, creates or focuses the Notepad window, persists and restores window bounds via chrome.storage.local, and clears the stored window ID on chrome.windows.onRemoved.
- TECHNOLOGY RECOMMENDATIONS
  Plain JavaScript (ES2022). Chrome Extension APIs: chrome.action.onClicked, chrome.windows.create, chrome.windows.update, chrome.windows.get, chrome.windows.onRemoved, chrome.storage.local.get, chrome.storage.local.set.
- NOTES
  Non-persistent service worker — do not rely on global state surviving between events. Validate stored windowId with chrome.windows.get() before use; catch the rejection if the window has been closed. Default window dimensions: 800 × 600 px. Passes persisted {left, top, width, height} to chrome.windows.create() when available.
- RELATED UC-001, UC-008 | BR-001, BR-026, BR-027 | AR-001, AR-002, AR-011

---

## PT-003 : notepad.html — UI Page Shell
- DESCRIPTION
  Single HTML page loaded as the Notepad window content (set as the URL in chrome.windows.create). Contains the menu bar (File, Edit, View, Help), dropdown placeholder container, textarea editor, status bar with four sections, Help dialog, and Find dialog. All interactive behavior is driven by notepad.js.
- TECHNOLOGY RECOMMENDATIONS
  HTML5. Semantic elements: <nav> for menu bar, <textarea id="editor"> for the editor, <footer> or <div> for status bar, <dialog id="help-dialog"> and <dialog id="find-dialog"> for modals. Links to notepad.css and notepad.js.
- NOTES
  textarea must have spellcheck="false". All event handlers are attached from notepad.js via addEventListener. Status bar contains four spans: encoding, line number, column, character count. No inline scripts or inline styles.
- RELATED UC-001, UC-002, UC-002B, UC-009 | BR-002, BR-003, BR-004, BR-005, BR-028, BR-030 | AR-003, AR-004, AR-008, AR-010

---

## PT-004 : notepad.css — Windows Notepad Visual Theme
- DESCRIPTION
  CSS stylesheet implementing the Windows Notepad visual style: Segoe UI font, light gray menu bar, white editor area, gray status bar, black text, correct border and spacing proportions, and modal dialog styling.
- TECHNOLOGY RECOMMENDATIONS
  Plain CSS. CSS custom properties on :root for all theme tokens (colors, font stacks). Flexbox column layout on body (menu bar, editor flex:1, status bar). No CSS framework, no preprocessor.
- NOTES
  Font stack: 'Segoe UI', system-ui, sans-serif. Menu bar: background #f0f0f0, height ~24 px. Editor: background #ffffff, flex:1, resize:none, border:none. Status bar: background #f0f0f0, border-top: 1px solid #c0c0c0. Text: #000000. Menu button hover uses slightly darker background (#d0d0d0).
- RELATED UC-001, UC-002, UC-002B | BR-002, BR-005, BR-006 | AR-003

---

## PT-005 : notepad.js — Application Logic
- DESCRIPTION
  Main JavaScript module containing all editor logic: dirty-state tracking, title bar management, undo stack, storage operations (save / load / list), file download, status bar computation, menu item handlers, dialog management (Help, Find), keyboard shortcut binding, and word-wrap toggle.
- TECHNOLOGY RECOMMENDATIONS
  Plain JavaScript (ES2022). No external libraries. Uses chrome.storage.local API, Blob API, URL.createObjectURL, HTML <dialog>.showModal(), textarea.selectionStart/selectionEnd.
- NOTES
  Loaded via <script src="notepad.js"> at the end of notepad.html body. Menu data defined as a central JS object/array (single source of truth for shortcuts and Help content). All storage calls use async/await. Word-wrap state persisted to chrome.storage.local.
- RELATED UC-002, UC-002B, UC-003, UC-004, UC-005, UC-006, UC-007, UC-009 | BR-007, BR-008, BR-009, BR-010, BR-011, BR-012, BR-013, BR-014, BR-015, BR-016, BR-017, BR-018, BR-019, BR-020, BR-021, BR-022, BR-023, BR-024, BR-025, BR-028, BR-029, BR-030 | AR-004, AR-005, AR-006, AR-007, AR-008, AR-009, AR-010

---

## PT-006 : Undo Stack — In-Memory History Module (within notepad.js)
- DESCRIPTION
  Logical module inside notepad.js implementing a custom undo stack as a JavaScript array of full textarea value snapshots. Handles push (debounced on input event), pop on Ctrl+Z, and explicit reset on File > New or File > Open.
- TECHNOLOGY RECOMMENDATIONS
  Plain JavaScript array. Debounce via setTimeout/clearTimeout. No external library.
- NOTES
  Stack depth capped at 200 entries to bound memory consumption. Each entry is a complete textarea.value string. Debounce interval: ~300 ms. Reset on load clears history to comply with BR-019 (undo history reset after load).
- RELATED UC-002 | BR-008, BR-019 | AR-005

---

## PT-007 : Dropdown Menu Component (within notepad.js + notepad.html)
- DESCRIPTION
  Logical component implementing the four dropdown menus (File, Edit, View, Help). Each menu button toggles a positioned panel containing action items with labels and keyboard shortcut annotations.
- TECHNOLOGY RECOMMENDATIONS
  Plain HTML buttons + positioned div panels. Plain JavaScript for toggle logic, click-outside detection (document mousedown listener), Escape key close. Menu item data defined as a JS array of objects: {label, shortcut, handler, separator?}.
- NOTES
  All four menus share the same open/close mechanism. Clicking a menu item executes its handler and closes the menu. The menu item data array is the single source of truth for both the rendered dropdown and the Help dialog shortcut table (satisfying BR-029).
- RELATED UC-001, UC-009 | BR-003, BR-029 | AR-008

---

## PT-008 : Status Bar Component (within notepad.js)
- DESCRIPTION
  Logical component that computes and writes line number, column position, total character count, and encoding label to the four status bar sections on every editor event.
- TECHNOLOGY RECOMMENDATIONS
  Plain JavaScript. Event listeners on the textarea: 'input', 'keyup', 'click', 'select'. Reads textarea.selectionStart and textarea.value.
- NOTES
  Line number: count '\n' in value.substring(0, selectionStart) + 1. Column: selectionStart minus the index of the last '\n' before the cursor. Character count: value.length. Encoding: static string "UTF-8". Status bar DOM is updated in a single updateStatusBar() function called from all listeners.
- RELATED UC-002B | BR-010, BR-011, BR-012, BR-013, BR-022 | AR-009

---

## PT-009 : Find Dialog (within notepad.js + notepad.html)
- DESCRIPTION
  Logical component implementing the Find functionality. A <dialog> element with a text input field, Find Next button, Match Case checkbox, and Close button. Highlights the next match by setting selectionStart/selectionEnd on the textarea and scrolling it into view.
- TECHNOLOGY RECOMMENDATIONS
  HTML <dialog> element (non-blocking, via dialog.show()). Plain JavaScript search using String.prototype.indexOf. No external library.
- NOTES
  Ctrl+F and Edit > Find both open the dialog. Find Next cycles through occurrences; wraps at document end. Match Case checkbox controls case-sensitivity. ESC or Close button dismisses the dialog. Replace is not required by any current BR.
- RELATED UC-002 | BR-030 | AR-010

---

## PT-010 : Storage Module (within notepad.js)
- DESCRIPTION
  Logical module inside notepad.js encapsulating all chrome.storage.local operations: saveDocument, loadDocument, listDocuments, saveWindowState, loadWindowState. Provides a clean async API consumed by menu action handlers and the window initialization routine.
- TECHNOLOGY RECOMMENDATIONS
  chrome.storage.local API (async, promise-based). Key schema: "doc_<filename>" for document text, "wordWrap" for word-wrap state, "windowState" for {left, top, width, height}.
- NOTES
  listDocuments filters chrome.storage.local.get(null) results to keys beginning with "doc_" and extracts the filename suffix. Document values are plain UTF-8 strings. All functions return Promises and are consumed with async/await in calling code.
- RELATED UC-003, UC-004, UC-008 | BR-014, BR-015, BR-017, BR-018, BR-026 | AR-006

---
