# Design Instructions

Generated from `2-REQUIREMENTS.md`, `3-ARCHITECTURE-RECOMMENDATIONS.md`, and `3-PARTS LIST.md`. Owned by Technical Lead.

---

## DI-001 : Create manifest.json — Extension Manifest V3
- SUMMARY
  Create the Chrome Extension Manifest V3 declaration file. This registers the extension with Chrome, declares required permissions, points to the service worker, and configures the toolbar action so that clicks are routed to the service worker rather than opening a popup.
- SKILLSET REQUIRED
  Chrome Extension development, JSON, Manifest V3 specification.
- IMPLEMENTATION STEPS
  1. Create `build/extension/manifest.json` with the following content:
     ```json
     {
       "manifest_version": 3,
       "name": "Notepad",
       "version": "1.0.0",
       "description": "A Windows 95-style Notepad as a Chrome extension.",
       "permissions": ["storage", "windows"],
       "background": {
         "service_worker": "background.js"
       },
       "action": {}
     }
     ```
  2. Do NOT add a `default_popup` to `action` — the toolbar click must fire `chrome.action.onClicked`, which is suppressed when a popup is specified.
  3. Do NOT add `host_permissions` — this extension does not access any external URLs.
  4. The `action` block is required even though it has no properties; omitting it prevents the toolbar icon from appearing.
- NOTES
  Icon files (`icons` field) are optional for initial build. Chrome will show a default icon if omitted.
- RELATED UC-001, UC-008, BR-001, BR-017, AR-001, PT-001

---

## DI-002 : Create background.js — Service Worker (Window Lifecycle)
- SUMMARY
  Implement the MV3 service worker that handles the toolbar icon click, creates or focuses the Notepad window, tracks window bounds changes, and cleans up state when the window is closed.
- SKILLSET REQUIRED
  Chrome Extension service workers, chrome.windows API, chrome.storage.local, event-driven JavaScript.
- IMPLEMENTATION STEPS
  1. Create `build/extension/background.js`.
  2. Declare a module-level variable `let notepadWindowId = null;` to track the open window.
  3. Implement `getStoredBounds()` — reads 'windowBounds' from chrome.storage.local, returns stored value or default `{left: 100, top: 100, width: 700, height: 500}`:
     ```js
     async function getStoredBounds() {
       return new Promise(resolve => {
         chrome.storage.local.get('windowBounds', data => {
           resolve(data.windowBounds || { left: 100, top: 100, width: 700, height: 500 });
         });
       });
     }
     ```
  4. Implement `chrome.action.onClicked` listener:
     - If `notepadWindowId` is not null, call `chrome.windows.update(notepadWindowId, { focused: true })`.
     - If `notepadWindowId` is null, call `getStoredBounds()`, then `chrome.windows.create({ url: chrome.runtime.getURL('notepad.html'), type: 'popup', ...bounds })`, store the resulting `window.id` in `notepadWindowId`.
     - Wrap the entire handler in try/catch. On error, log to console.
  5. Implement `chrome.windows.onBoundsChanged` listener:
     - Only proceed if `event.id === notepadWindowId`.
     - Write `{left, top, width, height}` to chrome.storage.local under key 'windowBounds'.
  6. Implement `chrome.windows.onRemoved` listener:
     - If `removedWindowId === notepadWindowId`, set `notepadWindowId = null`.
  7. Trap for stale windowId: wrap `chrome.windows.update()` in a try/catch to handle the case where the window was closed between event dispatch and the update call; on error, clear `notepadWindowId` and create a new window.
- NOTES
  Service worker modules are stateless between idle cycles; `notepadWindowId` will be reset if the service worker is evicted. This is an acceptable platform limitation for this scope.
- RELATED UC-001, UC-008, BR-001, BR-017, BR-018, BR-019, AR-001, AR-002, AR-003, PT-002

---

## DI-003 : Create notepad.html — UI Page Shell
- SUMMARY
  Create the single HTML page that is loaded inside the detached Chrome window. It contains the title bar, menu bar (File, Edit, Help), a dropdown container, the main textarea editor, a status bar, and the help dialog. All interactive behavior is handled by notepad.js.
- SKILLSET REQUIRED
  HTML5, Chrome extension page structure.
- IMPLEMENTATION STEPS
  1. Create `build/extension/notepad.html`.
  2. Structure:
     ```html
     <!DOCTYPE html>
     <html lang="en">
     <head>
       <meta charset="UTF-8">
       <meta name="viewport" content="width=device-width, initial-scale=1.0">
       <title>Notepad</title>
       <link rel="stylesheet" href="notepad.css">
     </head>
     <body>
       <div id="titlebar">
         <span id="title-text">Untitled - Notepad</span>
       </div>
       <nav id="menubar">
         <button class="menu-btn" data-menu="file">File</button>
         <button class="menu-btn" data-menu="edit">Edit</button>
         <button class="menu-btn" data-menu="help">Help</button>
       </nav>
       <div id="dropdown-container"></div>
       <textarea id="editor" spellcheck="false"></textarea>
       <div id="statusbar">
         <span id="status-msg"></span>
       </div>
       <dialog id="help-dialog">
         <h2>Keyboard Shortcuts</h2>
         <table id="shortcuts-table">
           <thead><tr><th>Shortcut</th><th>Action</th></tr></thead>
           <tbody></tbody>
         </table>
         <button id="help-close">Close</button>
       </dialog>
       <script src="notepad.js"></script>
     </body>
     </html>
     ```
  3. Do not add inline styles or scripts. All styling goes in notepad.css; all behavior in notepad.js.
- NOTES
  The `spellcheck="false"` attribute on the textarea prevents browser spell-check underlining in a plain-text editor context.
- RELATED UC-001, UC-002, UC-009, BR-002, BR-003, BR-004, BR-005, BR-020, AR-004, PT-003

---

## DI-004 : Create notepad.css — Windows 95 Visual Theme
- SUMMARY
  Style the Notepad UI to replicate the Windows 95 aesthetic: navy title bar, silver window chrome, beveled 3D borders using box-shadow, Courier New editor font, and Microsoft-era UI fonts.
- SKILLSET REQUIRED
  CSS3, box-shadow techniques, CSS custom properties.
- IMPLEMENTATION STEPS
  1. Create `build/extension/notepad.css`.
  2. Define custom properties on `:root`:
     ```css
     :root {
       --silver: #c0c0c0;
       --navy: #000080;
       --dark: #808080;
       --white: #ffffff;
       --black: #000000;
     }
     ```
  3. Reset the page and fill the full viewport:
     ```css
     *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
     html, body { height: 100%; overflow: hidden; background: var(--silver); font-family: 'MS Sans Serif', 'Segoe UI', sans-serif; font-size: 12px; }
     ```
  4. Title bar (navy, white text, fixed height 22px).
  5. Menu bar: flat button strip, silver background, no border; hover/active state uses navy background + white text.
  6. Dropdown container: absolute positioned below menu bar, z-index above editor; dropdown lists styled with silver background, beveled outset border.
  7. Editor textarea: fills remaining height with `flex: 1`, inset beveled border (`box-shadow: inset 1px 1px var(--dark), inset -1px -1px var(--white)`), Courier New 13px, no border outline, resize: none.
  8. Status bar: fixed 20px bar at bottom, silver background, slight inset top border.
  9. Help dialog: silver background, beveled border, simple table layout for shortcuts.
  10. Beveled outset button style (for dialog close button): `box-shadow: inset -1px -1px var(--dark), inset 1px 1px var(--white)`.
- NOTES
  Use `display: flex; flex-direction: column; height: 100%` on body to allow the textarea to fill the remaining space between the menu bar and status bar.
- RELATED UC-001, BR-002, AR-007, PT-004

---

## DI-005 : Implement editor state initialization and dirty tracking (notepad.js)
- SUMMARY
  On DOMContentLoaded: load the saved note from chrome.storage.local into the editor, focus the editor, and initialize the dirty-tracking flag. Wire the 'input' event on the editor to set the dirty flag.
- SKILLSET REQUIRED
  Vanilla JavaScript, chrome.storage.local, DOM events.
- IMPLEMENTATION STEPS
  1. Create `build/extension/notepad.js` (this file is built up across DI-005 through DI-009).
  2. At the top of the file, declare shared state:
     ```js
     let isDirty = false;
     let activeMenuId = null;
     ```
  3. Implement `setDirty(value)` helper:
     ```js
     function setDirty(value) {
       isDirty = value;
       document.title = value ? '*Untitled - Notepad' : 'Untitled - Notepad';
       document.getElementById('title-text').textContent = document.title;
     }
     ```
  4. Implement `loadNote()`:
     ```js
     function loadNote() {
       chrome.storage.local.get('noteContent', data => {
         document.getElementById('editor').value = data.noteContent || '';
         setDirty(false);
       });
     }
     ```
  5. In the `DOMContentLoaded` handler:
     - Call `loadNote()`.
     - Call `document.getElementById('editor').focus()`.
     - Wire `editor.addEventListener('input', () => setDirty(true))`.
- NOTES
  The title bar asterisk (*) provides the secondary dirty indicator in addition to the confirmation prompt before destructive actions.
- RELATED UC-001, UC-002, UC-004, BR-003, BR-004, BR-009, BR-010, BR-012, AR-002, AR-005, PT-005

---

## DI-006 : Implement save, load, and new note actions (notepad.js)
- SUMMARY
  Implement the three core note management actions: Save (writes to chrome.storage.local with success feedback), Load (reads from storage, checks dirty state), and New (clears editor, checks dirty state). All destructive actions must check isDirty and prompt the user before proceeding.
- SKILLSET REQUIRED
  Vanilla JavaScript, chrome.storage.local, confirmation dialogs.
- IMPLEMENTATION STEPS
  1. In `notepad.js`, implement `saveNote()`:
     ```js
     function saveNote() {
       const content = document.getElementById('editor').value;
       chrome.storage.local.set({ noteContent: content }, () => {
         if (chrome.runtime.lastError) {
           showStatus('Save failed.');
           return;
         }
         setDirty(false);
         showStatus('Saved.');
       });
     }
     ```
  2. Implement `showStatus(msg)` to display a timed message in the status bar:
     ```js
     function showStatus(msg) {
       const el = document.getElementById('status-msg');
       el.textContent = msg;
       setTimeout(() => { el.textContent = ''; }, 2000);
     }
     ```
  3. Implement `newNote()`:
     ```js
     function newNote() {
       if (isDirty && !window.confirm('You have unsaved changes. Discard and create new note?')) return;
       document.getElementById('editor').value = '';
       setDirty(false);
       showStatus('New note.');
     }
     ```
  4. Implement `loadNoteFromStorage()` (triggered from menu, distinct from the auto-load at startup):
     ```js
     function loadNoteFromStorage() {
       if (isDirty && !window.confirm('You have unsaved changes. Discard and load saved note?')) return;
       loadNote();
       showStatus('Note loaded.');
     }
     ```
  5. Failure handling: all chrome.storage calls check `chrome.runtime.lastError` and surface errors via `showStatus()`.
- NOTES
  `window.confirm()` is acceptable here — the extension page context allows native browser dialogs. Do not replace with a custom dialog for this scope.
- RELATED UC-003, UC-004, UC-005, UC-007, BR-006, BR-007, BR-008, BR-009, BR-011, BR-012, BR-013, BR-014, AR-002, AR-005, PT-005

---

## DI-007 : Implement file download action (notepad.js)
- SUMMARY
  Implement the Download (Save As) action that packages the current editor content as a Blob and triggers a client-side file download with a .txt extension, without any server dependency.
- SKILLSET REQUIRED
  Vanilla JavaScript, Blob API, URL.createObjectURL.
- IMPLEMENTATION STEPS
  1. In `notepad.js`, implement `downloadNote()`:
     ```js
     function downloadNote() {
       const content = document.getElementById('editor').value;
       const blob = new Blob([content], { type: 'text/plain' });
       const url = URL.createObjectURL(blob);
       const a = document.createElement('a');
       a.href = url;
       a.download = 'note.txt';
       document.body.appendChild(a);
       a.click();
       document.body.removeChild(a);
       URL.revokeObjectURL(url);
     }
     ```
  2. Revoke the blob URL immediately after `a.click()` to free memory.
  3. Append and remove the anchor element from the DOM to ensure cross-browser dispatch compatibility.
- NOTES
  The `download` attribute accepts a filename hint; the browser may alter it based on OS constraints. The .txt extension and content match requirements are satisfied by this implementation.
- RELATED UC-006, BR-015, BR-016, AR-006, PT-005

---

## DI-008 : Implement menu bar dropdowns and keyboard shortcuts (notepad.js)
- SUMMARY
  Define a single MENUS data structure that is the source of truth for all menu items, their actions, and keyboard shortcuts. Use it to render dropdown menus dynamically and to register keyboard shortcut listeners. This ensures Help dialog shortcut display is always in sync with actual bindings.
- SKILLSET REQUIRED
  Vanilla JavaScript, DOM manipulation, keyboard event handling.
- IMPLEMENTATION STEPS
  1. In `notepad.js`, define the MENUS data structure:
     ```js
     const MENUS = {
       file: [
         { label: 'New',      shortcut: 'Ctrl+N',          action: newNote },
         { label: 'Save',     shortcut: 'Ctrl+S',          action: saveNote },
         { label: 'Load',     shortcut: 'Ctrl+O',          action: loadNoteFromStorage },
         { label: 'Download', shortcut: 'Ctrl+Shift+S',    action: downloadNote },
       ],
       edit: [
         { label: 'Select All', shortcut: 'Ctrl+A',        action: () => document.getElementById('editor').select() },
       ],
       help: [
         { label: 'Help',     shortcut: 'F1',              action: showHelp },
       ],
     };
     ```
  2. Implement `initMenus()`: iterate MENUS keys, for each menu button wire a click handler that calls `openMenu(menuId)`. Implement `openMenu(menuId)`:
     - If `activeMenuId === menuId`, call `closeDropdown()` and return.
     - Call `closeDropdown()`.
     - Build a `<ul>` from the menu items: each `<li>` has the label on the left and shortcut on the right, with an onclick that calls the item action then `closeDropdown()`.
     - Append the `<ul>` to `#dropdown-container`, positioned below the clicked button.
     - Set `activeMenuId = menuId`.
  3. Implement `closeDropdown()`: clear `#dropdown-container.innerHTML`, set `activeMenuId = null`.
  4. Add a document-level `mousedown` listener to close the dropdown when clicking outside it.
  5. Implement `initKeyboardShortcuts()`: iterate all MENUS entries, register `keydown` with matching Ctrl/Shift/key combination, call `event.preventDefault()` before calling the action.
  6. Call `initMenus()` and `initKeyboardShortcuts()` from the `DOMContentLoaded` handler.
- NOTES
  Keyboard shortcut matching: check `event.ctrlKey`, `event.shiftKey`, and `event.key` (case-insensitive). For F1, check `event.key === 'F1'` without ctrlKey.
- RELATED UC-002, UC-009, BR-004, BR-005, BR-020, BR-021, AR-005, PT-005

---

## DI-009 : Implement Help dialog (notepad.js)
- SUMMARY
  Implement the showHelp() function that populates the help dialog's shortcuts table from the MENUS data structure and opens the dialog modally. Wire the Close button and the dialog's 'cancel' event (Escape key) to close the dialog and return focus to the editor.
- SKILLSET REQUIRED
  Vanilla JavaScript, HTML dialog element, DOM manipulation.
- IMPLEMENTATION STEPS
  1. In `notepad.js`, implement `showHelp()`:
     ```js
     function showHelp() {
       const tbody = document.querySelector('#shortcuts-table tbody');
       tbody.innerHTML = '';
       for (const items of Object.values(MENUS)) {
         for (const item of items) {
           if (!item.shortcut) continue;
           const tr = document.createElement('tr');
           tr.innerHTML = `<td>${item.shortcut}</td><td>${item.label}</td>`;
           tbody.appendChild(tr);
         }
       }
       document.getElementById('help-dialog').showModal();
     }
     ```
  2. In the `DOMContentLoaded` handler, wire the Close button:
     ```js
     document.getElementById('help-close').addEventListener('click', () => {
       document.getElementById('help-dialog').close();
       document.getElementById('editor').focus();
     });
     ```
  3. Wire the dialog's `cancel` event (fires on Escape):
     ```js
     document.getElementById('help-dialog').addEventListener('cancel', () => {
       document.getElementById('editor').focus();
     });
     ```
  4. The Help menu item in MENUS (defined in DI-008) calls `showHelp` — no additional wiring required.
- NOTES
  Populating the table from MENUS at call time (not at startup) ensures the shortcut list is always accurate if MENUS is ever modified.
- RELATED UC-009, BR-020, BR-021, BR-022, AR-008, PT-005
