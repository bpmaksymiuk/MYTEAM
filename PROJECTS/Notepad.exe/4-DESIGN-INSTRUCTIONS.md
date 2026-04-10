# Design Instructions — Notepad.exe

Derived from: `2-REQUIREMENTS.md`, `3-ARCHITECTURE-RECOMMENDATIONS.md`, `3-PARTS LIST.md`
Stage: 4 — Technical Lead

---

## DI-001 : Scaffold the Extension Directory Structure
- SUMMARY: Create the top-level `./build/extension/` folder containing all deliverable extension files.  No build tool or package manager is used — all files are written directly. This DI must be completed before any other DI.
- IMPLEMENTATION STEPS:
  1. Create the directory `./build/extension/` (relative to the project root `PROJECTS/Notepad.exe/`).
  2. All subsequent parts (PT-001 through PT-006) are created inside this directory.
  3. Final file tree:
     ```
     build/
       extension/
         manifest.json
         background.js
         storage.js
         notepad.html
         notepad.css
         notepad.js
     ```
- SKILLSET REQUIRED: File system operations, Chrome extension project conventions.
- NOTES None
- RELATED PT-001 through PT-006, AR-001, AR-007

---

## DI-002 : Implement `manifest.json` (PT-001)
- SUMMARY: Define the Chrome Extension Manifest V3 descriptor with the minimum required fields and permissions for the Notepad.exe extension.
- IMPLEMENTATION STEPS:
  1. Create `./build/extension/manifest.json` with the following content:
     ```json
     {
       "manifest_version": 3,
       "name": "Notepad.exe",
       "version": "1.0",
       "description": "A standalone Notepad window styled like Windows Notepad.",
       "background": {
         "service_worker": "background.js"
       },
       "action": {
         "default_title": "Open Notepad"
       },
       "permissions": ["storage", "windows"]
     }
     ```
  2. No `default_popup` key on the `action` — the icon click is handled entirely by the service worker via `chrome.action.onClicked`.
  3. The `permissions` array must include both `"storage"` (for `chrome.storage.local`) and `"windows"` (for `chrome.windows.create` / `chrome.windows.get`).
- SKILLSET REQUIRED: Chrome Extension Manifest V3 schema knowledge.
- NOTES None
- RELATED PT-001, AR-001, AR-002, BR-001, BR-038

---

## DI-003 : Implement `background.js` — Service Worker (PT-002)
- SUMMARY: The service worker handles the extension icon click. It ensures only one Notepad window exists at a time: if a window with the stored ID exists it is focused; otherwise a new window is created and its ID saved. Window closed events clean up the stored ID.
- IMPLEMENTATION STEPS:
  1. Create `./build/extension/background.js`.
  2. Import `storage.js` functionality inline (service workers use `importScripts` or ES module `import`). Because Manifest V3 service workers support ES modules when declared with `"type": "module"`, use a top-level import:
     ```js
     // background.js
     import { saveGeometry, loadGeometry } from './storage.js';
     ```
     Add `"type": "module"` to the background entry in manifest.json:
     ```json
     "background": {
       "service_worker": "background.js",
       "type": "module"
     }
     ```
  3. Implement `chrome.action.onClicked` listener:
     ```js
     const WINDOW_ID_KEY = 'notepadWindowId';

     chrome.action.onClicked.addListener(async () => {
       const stored = await chrome.storage.local.get([WINDOW_ID_KEY]);
       const existingId = stored[WINDOW_ID_KEY];

       if (existingId != null) {
         try {
           const win = await chrome.windows.get(existingId);
           if (win) {
             await chrome.windows.update(existingId, { focused: true });
             return;
           }
         } catch (_) {
           // Window no longer exists — fall through to create a new one
         }
       }

       const geometry = await loadGeometry();
       const newWin = await chrome.windows.create({
         url: chrome.runtime.getURL('notepad.html'),
         type: 'popup',
         width: geometry?.width ?? 800,
         height: geometry?.height ?? 600,
         left: geometry?.left ?? 100,
         top: geometry?.top ?? 100,
       });
       await chrome.storage.local.set({ [WINDOW_ID_KEY]: newWin.id });
     });
     ```
  4. Implement `chrome.windows.onRemoved` to clear the stored window ID:
     ```js
     chrome.windows.onRemoved.addListener(async (windowId) => {
       const stored = await chrome.storage.local.get([WINDOW_ID_KEY]);
       if (stored[WINDOW_ID_KEY] === windowId) {
         await chrome.storage.local.remove(WINDOW_ID_KEY);
       }
     });
     ```
  5. Edge case: `chrome.windows.get` throws if the ID does not exist any more. Always wrap in try/catch and fall through to create.
- SKILLSET REQUIRED: Chrome Extension Service Worker, `chrome.windows` API, `chrome.storage.local`, async/await, error handling.
- NOTES Service worker is terminated when idle; do not rely on module-level variables surviving across invocations. All persistent state must go through `chrome.storage.local`.
- RELATED PT-002, AR-002, AR-005, BR-001, BR-038, BR-039, BR-040, BR-041, BR-042

---

## DI-004 : Implement `storage.js` — Storage Abstraction (PT-006)
- SUMMARY: Provides named async functions for saving/loading note content and window geometry via `chrome.storage.local`. Centralises storage key definitions.
- IMPLEMENTATION STEPS:
  1. Create `./build/extension/storage.js` as an ES module.
  2. Define storage key constants:
     ```js
     const KEY_PREFIX_NOTE = 'note_';
     const KEY_GEOMETRY   = 'windowGeometry';
     const KEY_LAST_NOTE  = 'lastNoteName';
     ```
  3. Implement `saveNote(name, content)`:
     ```js
     export async function saveNote(name, content) {
       const key = KEY_PREFIX_NOTE + name;
       await chrome.storage.local.set({ [key]: content, [KEY_LAST_NOTE]: name });
     }
     ```
  4. Implement `loadNote(name)` — returns string or `null`:
     ```js
     export async function loadNote(name) {
       const key = KEY_PREFIX_NOTE + name;
       const result = await chrome.storage.local.get(key);
       return result[key] ?? null;
     }
     ```
  5. Implement `listNotes()` — returns array of `{ name, key }`:
     ```js
     export async function listNotes() {
       const all = await chrome.storage.local.get(null);
       return Object.keys(all)
         .filter(k => k.startsWith(KEY_PREFIX_NOTE))
         .map(k => ({ name: k.slice(KEY_PREFIX_NOTE.length), key: k }));
     }
     ```
  6. Implement `loadLastNoteName()` — returns string or `null`:
     ```js
     export async function loadLastNoteName() {
       const result = await chrome.storage.local.get(KEY_LAST_NOTE);
       return result[KEY_LAST_NOTE] ?? null;
     }
     ```
  7. Implement `saveGeometry(rect)` where `rect = { top, left, width, height }`:
     ```js
     export async function saveGeometry(rect) {
       await chrome.storage.local.set({ [KEY_GEOMETRY]: rect });
     }
     ```
  8. Implement `loadGeometry()` — returns geometry object or `null`:
     ```js
     export async function loadGeometry() {
       const result = await chrome.storage.local.get(KEY_GEOMETRY);
       return result[KEY_GEOMETRY] ?? null;
     }
     ```
- SKILLSET REQUIRED: Chrome Extension `chrome.storage.local` async API, ES module exports.
- NOTES None
- RELATED PT-006, AR-005, BR-019, BR-020, BR-021, BR-022, BR-023, BR-025, BR-040

---

## DI-005 : Implement `notepad.html` — Main Window Structure (PT-003)
- SUMMARY: The HTML skeleton for the Notepad window. Must include the menu bar, editor textarea, status bar, and an initially-hidden help modal overlay. Links the CSS and JS files.
- IMPLEMENTATION STEPS:
  1. Create `./build/extension/notepad.html`.
  2. Full page structure:
     ```html
     <!DOCTYPE html>
     <html lang="en">
     <head>
       <meta charset="UTF-8">
       <meta name="viewport" content="width=device-width, initial-scale=1.0">
       <title>Untitled - Notepad</title>
       <link rel="stylesheet" href="notepad.css">
     </head>
     <body>
       <!-- Menu Bar -->
       <div id="menubar" role="menubar">
         <div class="menu-item" data-menu="file">File
           <ul class="dropdown" id="menu-file">
             <li data-action="new">New<span class="shortcut">Ctrl+N</span></li>
             <li data-action="open">Open...<span class="shortcut">Ctrl+O</span></li>
             <li class="separator"></li>
             <li data-action="save">Save<span class="shortcut">Ctrl+S</span></li>
             <li data-action="saveas">Save As...<span class="shortcut">Ctrl+Shift+S</span></li>
             <li class="separator"></li>
             <li data-action="exit">Exit</li>
           </ul>
         </div>
         <div class="menu-item" data-menu="edit">Edit
           <ul class="dropdown" id="menu-edit">
             <li data-action="undo">Undo<span class="shortcut">Ctrl+Z</span></li>
             <li class="separator"></li>
             <li data-action="cut">Cut<span class="shortcut">Ctrl+X</span></li>
             <li data-action="copy">Copy<span class="shortcut">Ctrl+C</span></li>
             <li data-action="paste">Paste<span class="shortcut">Ctrl+V</span></li>
             <li class="separator"></li>
             <li data-action="find">Find...<span class="shortcut">Ctrl+F</span></li>
             <li data-action="replace">Replace...<span class="shortcut">Ctrl+H</span></li>
             <li class="separator"></li>
             <li data-action="selectall">Select All<span class="shortcut">Ctrl+A</span></li>
           </ul>
         </div>
         <div class="menu-item" data-menu="view">View
           <ul class="dropdown" id="menu-view">
             <li data-action="wordwrap" id="item-wordwrap">Word Wrap</li>
             <li class="separator"></li>
             <li data-action="zoomin">Zoom In<span class="shortcut">Ctrl++</span></li>
             <li data-action="zoomout">Zoom Out<span class="shortcut">Ctrl+-</span></li>
             <li data-action="zoomreset">Restore Default Zoom<span class="shortcut">Ctrl+0</span></li>
           </ul>
         </div>
         <div class="menu-item" data-menu="help">Help
           <ul class="dropdown" id="menu-help">
             <li data-action="viewhelp">View Help</li>
             <li class="separator"></li>
             <li data-action="about">About Notepad</li>
           </ul>
         </div>
       </div>

       <!-- Editor -->
       <textarea id="editor" spellcheck="false" autocomplete="off" autocorrect="off" autocapitalize="off"></textarea>

       <!-- Status Bar -->
       <div id="statusbar">
         <span id="status-position">Ln 1, Col 1</span>
         <span id="status-chars">0 characters</span>
         <span id="status-encoding">UTF-8</span>
       </div>

       <!-- Help Modal -->
       <div id="help-modal" class="modal-overlay" hidden aria-modal="true" role="dialog" aria-label="Help">
         <div class="modal-window">
           <div class="modal-titlebar">
             <span>Notepad Help — Keyboard Shortcuts</span>
             <button id="help-close" aria-label="Close">✕</button>
           </div>
           <div class="modal-body">
             <table class="shortcut-table">
               <thead><tr><th>Shortcut</th><th>Action</th></tr></thead>
               <tbody>
                 <tr><td>Ctrl+N</td><td>New</td></tr>
                 <tr><td>Ctrl+O</td><td>Open</td></tr>
                 <tr><td>Ctrl+S</td><td>Save</td></tr>
                 <tr><td>Ctrl+Shift+S</td><td>Save As</td></tr>
                 <tr><td>Ctrl+Z</td><td>Undo</td></tr>
                 <tr><td>Ctrl+X</td><td>Cut</td></tr>
                 <tr><td>Ctrl+C</td><td>Copy</td></tr>
                 <tr><td>Ctrl+V</td><td>Paste</td></tr>
                 <tr><td>Ctrl+F</td><td>Find</td></tr>
                 <tr><td>Ctrl+H</td><td>Replace</td></tr>
                 <tr><td>Ctrl+A</td><td>Select All</td></tr>
                 <tr><td>Ctrl++</td><td>Zoom In</td></tr>
                 <tr><td>Ctrl+-</td><td>Zoom Out</td></tr>
                 <tr><td>Ctrl+0</td><td>Restore Default Zoom</td></tr>
                 <tr><td>Escape</td><td>Close dialog</td></tr>
               </tbody>
             </table>
           </div>
         </div>
       </div>

       <script type="module" src="notepad.js"></script>
     </body>
     </html>
     ```
  3. The `hidden` attribute on `#help-modal` hides it by default; JS removes/adds the attribute to show/hide.
  4. The `<textarea>` disables browser spellcheck and autocorrect to match plain-text editor behavior.
- SKILLSET REQUIRED: HTML5 semantics, ARIA attributes, menu accessibility patterns.
- NOTES None
- RELATED PT-003, AR-003, AR-004, AR-011, BR-003, BR-004, BR-005, BR-006, BR-007, BR-009

---

## DI-006 : Implement `notepad.css` — Windows Notepad Stylesheet (PT-004)
- SUMMARY: Full CSS ruleset that replicates the Windows Notepad visual appearance. Layout uses flexbox with the editor filling available space.
- IMPLEMENTATION STEPS:
  1. Create `./build/extension/notepad.css`.
  2. Reset and custom properties:
     ```css
     *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

     :root {
       --font-ui:     'Segoe UI', system-ui, -apple-system, Arial, sans-serif;
       --font-editor: Consolas, 'Courier New', monospace;
       --color-bg:           #FFFFFF;
       --color-text:         #000000;
       --color-menubar-bg:   #F0F0F0;
       --color-menubar-border: #CCCCCC;
       --color-menu-hover:   #0078D7;
       --color-menu-hover-text: #FFFFFF;
       --color-statusbar-bg: #F0F0F0;
       --color-statusbar-border: #CCCCCC;
       --color-modal-overlay: rgba(0,0,0,0.35);
       --color-modal-title-bg: #0078D7;
       --color-modal-title-text: #FFFFFF;
       --editor-font-size:   14px;
     }
     ```
  3. Body and layout:
     ```css
     html, body {
       height: 100%;
       overflow: hidden;
       font-family: var(--font-ui);
       background: var(--color-bg);
       color: var(--color-text);
     }

     body {
       display: flex;
       flex-direction: column;
       height: 100vh;
     }
     ```
  4. Menu bar:
     ```css
     #menubar {
       display: flex;
       background: var(--color-menubar-bg);
       border-bottom: 1px solid var(--color-menubar-border);
       user-select: none;
       position: relative;
       z-index: 100;
       flex-shrink: 0;
     }

     .menu-item {
       position: relative;
       padding: 4px 8px;
       cursor: default;
       font-size: 13px;
     }

     .menu-item:hover,
     .menu-item.active {
       background: var(--color-menu-hover);
       color: var(--color-menu-hover-text);
     }

     .dropdown {
       display: none;
       position: absolute;
       top: 100%;
       left: 0;
       background: var(--color-menubar-bg);
       border: 1px solid var(--color-menubar-border);
       list-style: none;
       min-width: 200px;
       box-shadow: 2px 2px 4px rgba(0,0,0,0.15);
       z-index: 200;
     }

     .menu-item.active > .dropdown { display: block; }

     .dropdown li {
       padding: 5px 24px 5px 16px;
       font-size: 13px;
       display: flex;
       justify-content: space-between;
       align-items: center;
       white-space: nowrap;
       cursor: default;
     }

     .dropdown li:hover {
       background: var(--color-menu-hover);
       color: var(--color-menu-hover-text);
     }

     .dropdown li.separator {
       height: 1px;
       background: var(--color-menubar-border);
       padding: 0;
       margin: 2px 0;
       pointer-events: none;
     }

     .shortcut {
       margin-left: 32px;
       color: #666;
       font-size: 12px;
     }

     .dropdown li:hover .shortcut {
       color: rgba(255,255,255,0.8);
     }
     ```
  5. Editor:
     ```css
     #editor {
       flex: 1;
       width: 100%;
       border: none;
       outline: none;
       resize: none;
       padding: 4px 6px;
       font-family: var(--font-editor);
       font-size: var(--editor-font-size);
       background: var(--color-bg);
       color: var(--color-text);
       line-height: 1.4;
       overflow: auto;
     }
     ```
  6. Status bar:
     ```css
     #statusbar {
       display: flex;
       justify-content: flex-end;
       gap: 16px;
       padding: 2px 8px;
       background: var(--color-statusbar-bg);
       border-top: 1px solid var(--color-statusbar-border);
       font-size: 12px;
       color: var(--color-text);
       flex-shrink: 0;
     }
     ```
  7. Help modal:
     ```css
     .modal-overlay {
       position: fixed;
       inset: 0;
       background: var(--color-modal-overlay);
       display: flex;
       align-items: center;
       justify-content: center;
       z-index: 1000;
     }

     .modal-overlay[hidden] { display: none; }

     .modal-window {
       background: var(--color-bg);
       border: 1px solid var(--color-menubar-border);
       box-shadow: 4px 4px 8px rgba(0,0,0,0.3);
       min-width: 400px;
       max-width: 600px;
       max-height: 80vh;
       display: flex;
       flex-direction: column;
     }

     .modal-titlebar {
       background: var(--color-modal-title-bg);
       color: var(--color-modal-title-text);
       padding: 6px 10px;
       display: flex;
       justify-content: space-between;
       align-items: center;
       font-size: 13px;
       font-weight: bold;
       user-select: none;
     }

     .modal-titlebar button {
       background: none;
       border: none;
       color: var(--color-modal-title-text);
       font-size: 14px;
       cursor: pointer;
       padding: 0 4px;
     }

     .modal-body {
       padding: 16px;
       overflow-y: auto;
     }

     .shortcut-table {
       width: 100%;
       border-collapse: collapse;
       font-size: 13px;
     }

     .shortcut-table th, .shortcut-table td {
       padding: 6px 12px;
       text-align: left;
       border-bottom: 1px solid var(--color-menubar-border);
     }

     .shortcut-table th {
       background: var(--color-menubar-bg);
       font-weight: bold;
     }
     ```
  8. Word wrap toggle — add a `word-wrap` class to `<body>` when active:
     ```css
     body.word-wrap #editor {
       white-space: pre-wrap;
       word-wrap: break-word;
     }
     ```
- SKILLSET REQUIRED: CSS3 flexbox, CSS custom properties, cross-browser font stacks.
- NOTES None
- RELATED PT-004, AR-007, AR-008, BR-008, BR-018

---

## DI-007 : Implement `notepad.js` — Initialization and State Management (PT-005, part 1)
- SUMMARY: Set up the ES module entry point for the main window. On DOMContentLoaded, initialize application state, restore saved content, restore geometry persistence listener, and focus the editor.
- IMPLEMENTATION STEPS:
  1. Create `./build/extension/notepad.js` with `type="module"` (already set in HTML via `<script type="module">`).
  2. Import storage functions:
     ```js
     import { saveNote, loadNote, listNotes, loadLastNoteName, saveGeometry } from './storage.js';
     ```
  3. Define application state object:
     ```js
     const state = {
       filename: null,       // null = "Untitled"
       isDirty: false,       // unsaved changes flag
       wordWrap: false,
       fontSize: 14,         // px, for zoom
       openMenuId: null,     // which menu is currently open
     };
     ```
  4. On `DOMContentLoaded`:
     ```js
     document.addEventListener('DOMContentLoaded', async () => {
       const editor = document.getElementById('editor');

       // Restore last saved note
       const lastName = await loadLastNoteName();
       if (lastName) {
         const content = await loadNote(lastName);
         if (content !== null) {
           editor.value = content;
           state.filename = lastName;
           updateTitle();
         }
       }

       updateStatusBar();
       editor.focus();

       // Persist window geometry on resize/move (poll)
       setInterval(persistGeometry, 3000);
     });
     ```
  5. Implement `updateTitle()`:
     ```js
     function updateTitle() {
       const name = state.filename ?? 'Untitled';
       const dirty = state.isDirty ? '*' : '';
       document.title = `${dirty}${name} - Notepad`;
     }
     ```
  6. Implement `persistGeometry()`:
     ```js
     async function persistGeometry() {
       await saveGeometry({
         top: window.screenTop,
         left: window.screenLeft,
         width: window.outerWidth,
         height: window.outerHeight,
       });
     }
     ```
  7. Mark dirty on editor input:
     ```js
     document.getElementById('editor').addEventListener('input', () => {
       if (!state.isDirty) {
         state.isDirty = true;
         updateTitle();
       }
       updateStatusBar();
     });
     ```
- SKILLSET REQUIRED: JavaScript ES modules, async/await, DOM APIs.
- NOTES None
- RELATED PT-005, AR-004, AR-005, BR-001, BR-002, BR-009

---

## DI-008 : Implement Menu Bar Interaction (PT-005, part 2)
- SUMMARY: Implement dropdown menu open/close, keyboard shortcut interception, and routing of menu item actions to handler functions.
- IMPLEMENTATION STEPS:
  1. Add click listeners to each `.menu-item` in the menu bar:
     ```js
     function initMenuBar() {
       document.querySelectorAll('.menu-item').forEach(item => {
         item.addEventListener('click', (e) => {
           e.stopPropagation();
           const menuId = item.dataset.menu;
           if (state.openMenuId === menuId) {
             closeMenus();
           } else {
             closeMenus();
             item.classList.add('active');
             state.openMenuId = menuId;
           }
         });
       });

       // Close menus on outside click
       document.addEventListener('click', closeMenus);

       // Route dropdown item clicks
       document.querySelectorAll('.dropdown li[data-action]').forEach(li => {
         li.addEventListener('click', (e) => {
           e.stopPropagation();
           closeMenus();
           handleAction(li.dataset.action);
         });
       });
     }

     function closeMenus() {
       document.querySelectorAll('.menu-item.active').forEach(i => i.classList.remove('active'));
       state.openMenuId = null;
     }
     ```
  2. Keyboard shortcut listener on `document`:
     ```js
     function initKeyboardShortcuts() {
       document.addEventListener('keydown', (e) => {
         const ctrl = e.ctrlKey || e.metaKey;
         if (!ctrl) return;
         switch (e.key.toLowerCase()) {
           case 'n': e.preventDefault(); handleAction('new'); break;
           case 'o': e.preventDefault(); handleAction('open'); break;
           case 's':
             e.preventDefault();
             handleAction(e.shiftKey ? 'saveas' : 'save');
             break;
           case 'z': e.preventDefault(); handleAction('undo'); break;
           case 'x': e.preventDefault(); handleAction('cut'); break;
           case 'c': e.preventDefault(); handleAction('copy'); break;
           case 'v': e.preventDefault(); handleAction('paste'); break;
           case 'f': e.preventDefault(); handleAction('find'); break;
           case 'h': e.preventDefault(); handleAction('replace'); break;
           case 'a': e.preventDefault(); handleAction('selectall'); break;
           case '+':
           case '=': e.preventDefault(); handleAction('zoomin'); break;
           case '-': e.preventDefault(); handleAction('zoomout'); break;
           case '0': e.preventDefault(); handleAction('zoomreset'); break;
         }
         // Escape: close any open menus or modal
         if (e.key === 'Escape') {
           closeMenus();
           closeHelpModal();
         }
       });
     }
     ```
  3. Central `handleAction(action)` dispatch function — routes to individual handlers (defined in DI-009 through DI-013):
     ```js
     function handleAction(action) {
       switch (action) {
         case 'new':       actionNew();       break;
         case 'open':      actionOpen();      break;
         case 'save':      actionSave();      break;
         case 'saveas':    actionSaveAs();    break;
         case 'exit':      window.close();    break;
         case 'undo':      document.execCommand('undo'); break;
         case 'cut':       document.execCommand('cut');  break;
         case 'copy':      document.execCommand('copy'); break;
         case 'paste':     document.execCommand('paste'); break;
         case 'find':      actionFind();      break;
         case 'replace':   actionReplace();   break;
         case 'selectall': document.getElementById('editor').select(); break;
         case 'wordwrap':  actionWordWrap();  break;
         case 'zoomin':    actionZoom(2);     break;
         case 'zoomout':   actionZoom(-2);    break;
         case 'zoomreset': actionZoom(0);     break;
         case 'viewhelp':  openHelpModal();   break;
         case 'about':     actionAbout();     break;
       }
     }
     ```
  4. Call `initMenuBar()` and `initKeyboardShortcuts()` inside `DOMContentLoaded`.
- SKILLSET REQUIRED: DOM event delegation, keyboard event interception, CSS class toggling.
- NOTES `document.execCommand` is deprecated but still functional in Chromium for undo/cut/copy/paste in a `<textarea>`. Use it for these operations as the Clipboard API requires async user gesture interaction.
- RELATED PT-005, AR-004, AR-007, BR-003, BR-004, BR-005, BR-006, BR-012

---

## DI-009 : Implement File Menu Actions (PT-005, part 3)
- SUMMARY: Implement `actionNew`, `actionOpen`, `actionSave`, and `actionSaveAs` — the four file operations.
- IMPLEMENTATION STEPS:
  1. **`actionNew()`**:
     ```js
     async function actionNew() {
       if (state.isDirty) {
         const ok = window.confirm('You have unsaved changes. Discard and create a new document?');
         if (!ok) return;
       }
       document.getElementById('editor').value = '';
       state.filename = null;
       state.isDirty = false;
       updateTitle();
       updateStatusBar();
       document.getElementById('editor').focus();
     }
     ```
  2. **`actionOpen()`** — displays a list of saved notes in a `window.prompt` with a simplified selection, or uses a custom mini-dialog. Given no custom dialog for Open exists in PT-003, implement using `prompt`:
     ```js
     async function actionOpen() {
       if (state.isDirty) {
         const ok = window.confirm('You have unsaved changes. Discard and open another file?');
         if (!ok) return;
       }
       const notes = await listNotes();
       if (notes.length === 0) {
         window.alert('No saved notes found.');
         return;
       }
       const names = notes.map((n, i) => `${i + 1}. ${n.name}`).join('\n');
       const input = window.prompt(`Enter the number or name of the note to open:\n\n${names}`);
       if (!input) return;
       const trimmed = input.trim();
       let note = notes.find(n => n.name === trimmed);
       if (!note) {
         const idx = parseInt(trimmed, 10) - 1;
         if (!isNaN(idx) && idx >= 0 && idx < notes.length) note = notes[idx];
       }
       if (!note) { window.alert('Note not found.'); return; }
       const content = await loadNote(note.name);
       document.getElementById('editor').value = content ?? '';
       state.filename = note.name;
       state.isDirty = false;
       updateTitle();
       updateStatusBar();
     }
     ```
  3. **`actionSave()`** — if no filename, prompt for one:
     ```js
     async function actionSave() {
       let name = state.filename;
       if (!name) {
         name = window.prompt('Save as:', 'Untitled.txt');
         if (!name) return;
         name = name.trim() || 'Untitled.txt';
       }
       await saveNote(name, document.getElementById('editor').value);
       state.filename = name;
       state.isDirty = false;
       updateTitle();
     }
     ```
  4. **`actionSaveAs()`** — always prompts for filename AND triggers browser download:
     ```js
     async function actionSaveAs() {
       const defaultName = state.filename ?? 'Untitled.txt';
       const name = window.prompt('Save As:', defaultName);
       if (!name) return;
       const trimmed = name.trim() || 'Untitled.txt';
       const content = document.getElementById('editor').value;

       // Persist to storage
       await saveNote(trimmed, content);
       state.filename = trimmed;
       state.isDirty = false;
       updateTitle();

       // Trigger browser download
       const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
       const url = URL.createObjectURL(blob);
       const a = document.createElement('a');
       a.href = url;
       a.download = trimmed.endsWith('.txt') ? trimmed : trimmed + '.txt';
       document.body.appendChild(a);
       a.click();
       document.body.removeChild(a);
       URL.revokeObjectURL(url);
     }
     ```
- SKILLSET REQUIRED: async/await, `window.confirm`, `window.prompt`, Blob API, anchor download pattern, `chrome.storage.local` (via storage.js).
- NOTES Ensure `.txt` extension is appended only if not already present in Save As.
- RELATED PT-005, AR-005, AR-006, AR-010, BR-019 through BR-037

---

## DI-010 : Implement Edit Menu Actions — Find and Replace (PT-005, part 4)
- SUMMARY: Find and Replace use `window.prompt` dialogs for simplicity within the extension scope. `document.execCommand` handles Undo, Cut, Copy, Paste (already wired in DI-008).
- IMPLEMENTATION STEPS:
  1. **`actionFind()`** — basic find-and-highlight using `textarea` selection:
     ```js
     function actionFind() {
       const term = window.prompt('Find:');
       if (!term) return;
       const editor = document.getElementById('editor');
       const text = editor.value;
       const idx = text.toLowerCase().indexOf(term.toLowerCase());
       if (idx === -1) {
         window.alert(`"${term}" not found.`);
         return;
       }
       editor.focus();
       editor.setSelectionRange(idx, idx + term.length);
     }
     ```
  2. **`actionReplace()`** — replace first occurrence:
     ```js
     function actionReplace() {
       const term = window.prompt('Find:');
       if (!term) return;
       const replacement = window.prompt('Replace with:');
       if (replacement === null) return;
       const editor = document.getElementById('editor');
       const text = editor.value;
       const lower = text.toLowerCase();
       const idx = lower.indexOf(term.toLowerCase());
       if (idx === -1) {
         window.alert(`"${term}" not found.`);
         return;
       }
       const newText = text.slice(0, idx) + replacement + text.slice(idx + term.length);
       editor.value = newText;
       editor.setSelectionRange(idx, idx + replacement.length);
       state.isDirty = true;
       updateTitle();
       updateStatusBar();
     }
     ```
- SKILLSET REQUIRED: String search, `textarea.setSelectionRange`, `window.prompt`.
- NOTES Find is case-insensitive. Only finds the first occurrence. This matches basic Notepad behavior expected for this scope.
- RELATED PT-005, AR-004, BR-005, BR-010

---

## DI-011 : Implement View Menu Actions — Word Wrap and Zoom (PT-005, part 5)
- SUMMARY: Word Wrap toggles a CSS class on `<body>`. Zoom modifies the editor's `font-size` CSS variable.
- IMPLEMENTATION STEPS:
  1. **`actionWordWrap()`**:
     ```js
     function actionWordWrap() {
       state.wordWrap = !state.wordWrap;
       document.body.classList.toggle('word-wrap', state.wordWrap);
       const item = document.getElementById('item-wordwrap');
       item.textContent = state.wordWrap ? '✓ Word Wrap' : 'Word Wrap';
     }
     ```
  2. **`actionZoom(delta)`** — `delta > 0` means zoom in, `delta < 0` means zoom out, `delta === 0` resets:
     ```js
     function actionZoom(delta) {
       if (delta === 0) {
         state.fontSize = 14;
       } else {
         state.fontSize = Math.min(48, Math.max(8, state.fontSize + delta));
       }
       document.getElementById('editor').style.fontSize = `${state.fontSize}px`;
     }
     ```
- SKILLSET REQUIRED: CSS class manipulation, computed style manipulation.
- NOTES None
- RELATED PT-005, BR-006, BR-008

---

## DI-012 : Implement Status Bar Real-Time Updates (PT-005, part 6)
- SUMMARY: Compute and render line number, column, character count, and encoding on each input and cursor-selection change event.
- IMPLEMENTATION STEPS:
  1. Implement `updateStatusBar()`:
     ```js
     function updateStatusBar() {
       const editor = document.getElementById('editor');
       const text = editor.value;
       const pos = editor.selectionStart;

       // Compute line and column from selectionStart
       const before = text.slice(0, pos);
       const lines = before.split('\n');
       const ln = lines.length;
       const col = lines[lines.length - 1].length + 1;

       // Total character count (including newlines)
       const charCount = text.length;

       document.getElementById('status-position').textContent = `Ln ${ln}, Col ${col}`;
       document.getElementById('status-chars').textContent = `${charCount} character${charCount !== 1 ? 's' : ''}`;
       // encoding is always UTF-8 and static; set once but keep for completeness
     }
     ```
  2. Attach `updateStatusBar` to both `input` and `selectionchange` events on the editor:
     ```js
     const editor = document.getElementById('editor');
     editor.addEventListener('input', updateStatusBar);
     editor.addEventListener('keyup', updateStatusBar);   // catches arrow keys
     editor.addEventListener('click', updateStatusBar);   // catches mouse clicks
     editor.addEventListener('select', updateStatusBar);
     document.addEventListener('selectionchange', () => {
       if (document.activeElement === editor) updateStatusBar();
     });
     ```
  3. Call `updateStatusBar()` once during initialization (DI-007) to show defaults.
- SKILLSET REQUIRED: String manipulation (`split('\n')`), DOM selectionStart.
- NOTES: `selectionchange` fires on the document, so check `document.activeElement === editor` to avoid unnecessary updates.
- RELATED PT-005, AR-009, BR-013, BR-014, BR-015, BR-016, BR-017, BR-018

---

## DI-013 : Implement Help Dialog and About Notepad (PT-005, part 7)
- SUMMARY: Show and hide the `#help-modal` overlay. The About action uses `window.alert`.
- IMPLEMENTATION STEPS:
  1. **`openHelpModal()`**:
     ```js
     function openHelpModal() {
       const modal = document.getElementById('help-modal');
       modal.removeAttribute('hidden');
       document.getElementById('help-close').focus();
     }
     ```
  2. **`closeHelpModal()`**:
     ```js
     function closeHelpModal() {
       const modal = document.getElementById('help-modal');
       modal.setAttribute('hidden', '');
       document.getElementById('editor').focus();
     }
     ```
  3. Wire close button and Escape key (Escape is already handled in DI-008 keyboard listener):
     ```js
     function initHelpModal() {
       document.getElementById('help-close').addEventListener('click', closeHelpModal);
       document.getElementById('help-modal').addEventListener('click', (e) => {
         if (e.target === e.currentTarget) closeHelpModal(); // click outside modal window
       });
     }
     ```
  4. **`actionAbout()`**:
     ```js
     function actionAbout() {
       window.alert('Notepad.exe\nVersion 1.0\n\nA Windows Notepad-style text editor\nbuilt as a Chrome Extension.');
     }
     ```
  5. Call `initHelpModal()` inside `DOMContentLoaded`.
- SKILLSET REQUIRED: DOM attribute manipulation (`removeAttribute`, `setAttribute`), focus management.
- NOTES None
- RELATED PT-005, AR-011, BR-007, BR-043, BR-044, BR-045, BR-046, BR-047
