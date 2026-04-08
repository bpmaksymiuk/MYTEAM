# Design Instructions — Notepad.exe

## DI-001 : Create extension scaffold — manifest.json, folder structure, index.html shell
- SUMMARY: Establish the Chrome Extension MV3 project structure under `./build/extension/`. The manifest declares the service worker, storage and windows permissions, and the extension action. The index.html shell contains all structural markup (menu bar, editor, status bar, dialog containers) but no inline scripts (CSP compliance). All JS loaded as ES modules.
- IMPLEMENTATION STEPS:
  1. Create folder: `./build/extension/`
  2. Create `./build/extension/manifest.json`:
     ```json
     {
       "manifest_version": 3,
       "name": "Notepad.exe",
       "version": "1.0.0",
       "description": "Windows Notepad as a Chrome Extension",
       "permissions": ["storage", "windows"],
       "background": { "service_worker": "background.js" },
       "action": { "default_title": "Notepad" },
       "content_security_policy": {
         "extension_pages": "script-src 'self'; object-src 'self'"
       }
     }
     ```
  3. Create `./build/extension/index.html` with this structure:
     ```html
     <!DOCTYPE html>
     <html lang="en">
     <head>
       <meta charset="UTF-8">
       <title>Untitled - Notepad</title>
       <link rel="stylesheet" href="theme.css">
     </head>
     <body>
       <div id="app">
         <nav id="menubar"></nav>
         <textarea id="editor" spellcheck="false" wrap="off"></textarea>
         <footer id="statusbar">
           <span id="status-line">Ln 1</span>
           <span id="status-col">Col 1</span>
           <span id="status-chars">0 chars</span>
           <span id="status-encoding">UTF-8</span>
         </footer>
       </div>
       <!-- Dialog overlays (hidden by default) -->
       <div id="dialog-overlay" class="dialog-overlay hidden">
         <div id="dialog-confirm" class="dialog hidden">
           <div class="dialog-title"><span id="dialog-title-text">Notepad</span></div>
           <div class="dialog-body"><p id="dialog-message"></p></div>
           <div class="dialog-buttons">
             <button id="dialog-yes">Yes</button>
             <button id="dialog-no">No</button>
             <button id="dialog-cancel">Cancel</button>
           </div>
         </div>
         <div id="dialog-open" class="dialog hidden">
           <div class="dialog-title">Open</div>
           <div class="dialog-body"><ul id="open-file-list"></ul></div>
           <div class="dialog-buttons">
             <button id="dialog-open-ok">Open</button>
             <button id="dialog-open-cancel">Cancel</button>
           </div>
         </div>
         <div id="dialog-help" class="dialog hidden">
           <div class="dialog-title">Keyboard Shortcuts</div>
           <div class="dialog-body" id="help-content"></div>
           <div class="dialog-buttons">
             <button id="dialog-help-close">Close</button>
           </div>
         </div>
       </div>
       <script type="module" src="app.js"></script>
     </body>
     </html>
     ```
  4. Trap: Do NOT use inline `onclick` handlers or `<script>` tags — violates MV3 CSP.
  5. Trap: `<textarea>` must be a direct child of `#app`, not nested in a `<div>` with overflow hidden, or scrolling will break.
- SKILLSET REQUIRED: Chrome Extension MV3, HTML5 semantic markup, CSP fundamentals
- NOTES: The visual title bar ("Untitled - Notepad") is rendered by the OS window chrome via `document.title`, not a custom DOM element — the browser window title IS the title bar.
- RELATED: UC-001, UC-008 | BR-001, BR-003, BR-004, BR-009, BR-010, BR-049 | AR-001, AR-006

---

## DI-002 : Implement background.js — service worker, window lifecycle, single-instance, bounds persistence
- SUMMARY: The service worker handles the extension icon click, enforces single-instance (one Notepad window at a time), and persists/restores window bounds. Uses `chrome.storage.session` for the live window ID and `chrome.storage.local` for saved bounds.
- IMPLEMENTATION STEPS:
  1. Create `./build/extension/background.js`
  2. Listen for icon click:
     ```js
     chrome.action.onClicked.addListener(async () => {
       const { activeWindowId } = await chrome.storage.session.get('activeWindowId');
       if (activeWindowId) {
         try {
           await chrome.windows.update(activeWindowId, { focused: true });
           return;
         } catch (e) {
           // window no longer exists — fall through to create
         }
       }
       await openNotepadWindow();
     });
     ```
  3. Implement `openNotepadWindow()`:
     ```js
     async function openNotepadWindow() {
       const { windowBounds } = await chrome.storage.local.get('windowBounds');
       const bounds = windowBounds || { width: 800, height: 600, left: 100, top: 100 };
       const win = await chrome.windows.create({
         url: chrome.runtime.getURL('index.html'),
         type: 'popup',
         ...bounds
       });
       await chrome.storage.session.set({ activeWindowId: win.id });
     }
     ```
  4. Clear session ID when window is closed:
     ```js
     chrome.windows.onRemoved.addListener(async (windowId) => {
       const { activeWindowId } = await chrome.storage.session.get('activeWindowId');
       if (windowId === activeWindowId) {
         await chrome.storage.session.remove('activeWindowId');
       }
     });
     ```
  5. Save bounds when window is moved or resized:
     ```js
     chrome.windows.onBoundsChanged.addListener(async (win) => {
       const { activeWindowId } = await chrome.storage.session.get('activeWindowId');
       if (win.id === activeWindowId) {
         await chrome.storage.local.set({
           windowBounds: { width: win.width, height: win.height, left: win.left, top: win.top }
         });
       }
     });
     ```
  6. Trap: `chrome.windows.update` throws if the window ID is stale — always wrap in try/catch.
  7. Trap: `chrome.windows.create` with `type: 'popup'` gives a window without the browser's address bar, which is the correct style for Notepad.
- SKILLSET REQUIRED: Chrome Extension MV3, service workers, chrome.windows API, chrome.storage API, async/await
- NOTES: `chrome.storage.session` is cleared on browser restart — correct behavior since we want a fresh window after restart.
- RELATED: UC-001, UC-008 | BR-001, BR-049, BR-050, BR-051, BR-052 | AR-001, AR-002, AR-004

---

## DI-003 : Implement theme.css — Windows Notepad visual theme
- SUMMARY: Define all visual styling for the application using CSS custom properties. Match Windows Notepad appearance: Segoe UI font, white editor, gray chrome bars, dark text. Style all components: menubar, editor, statusbar, dialogs.
- IMPLEMENTATION STEPS:
  1. Create `./build/extension/theme.css`
  2. Define custom properties on `:root`:
     ```css
     :root {
       --font-ui: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
       --font-editor: 'Courier New', Courier, monospace;
       --color-bg: #FFFFFF;
       --color-chrome: #F0F0F0;
       --color-border: #CCCCCC;
       --color-text: #000000;
       --color-menu-hover: #0078D4;
       --color-menu-hover-text: #FFFFFF;
       --color-dialog-title: #000080;
       --color-dialog-title-text: #FFFFFF;
       --statusbar-height: 22px;
       --menubar-height: 24px;
     }
     ```
  3. Reset and body:
     ```css
     *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
     html, body { height: 100%; overflow: hidden; font-family: var(--font-ui); background: var(--color-bg); }
     ```
  4. App layout (flex column, full height):
     ```css
     #app { display: flex; flex-direction: column; height: 100vh; }
     ```
  5. Menu bar:
     ```css
     #menubar { background: var(--color-chrome); height: var(--menubar-height); display: flex; align-items: stretch; border-bottom: 1px solid var(--color-border); user-select: none; }
     .menu-item { position: relative; padding: 0 8px; display: flex; align-items: center; cursor: default; font-size: 13px; }
     .menu-item:hover, .menu-item.open { background: var(--color-menu-hover); color: var(--color-menu-hover-text); }
     .menu-dropdown { display: none; position: absolute; top: 100%; left: 0; background: var(--color-chrome); border: 1px solid var(--color-border); z-index: 100; min-width: 160px; box-shadow: 2px 2px 4px rgba(0,0,0,0.2); }
     .menu-item.open .menu-dropdown { display: block; }
     .menu-dropdown li { list-style: none; padding: 4px 24px; font-size: 13px; cursor: default; white-space: nowrap; }
     .menu-dropdown li:hover { background: var(--color-menu-hover); color: var(--color-menu-hover-text); }
     .menu-dropdown li.separator { padding: 0; border-top: 1px solid var(--color-border); margin: 3px 0; }
     .menu-dropdown li.disabled { color: #999; pointer-events: none; }
     ```
  6. Editor:
     ```css
     #editor { flex: 1; resize: none; border: none; outline: none; padding: 4px; font-family: var(--font-editor); font-size: 14px; color: var(--color-text); background: var(--color-bg); line-height: 1.5; overflow: auto; }
     ```
  7. Status bar:
     ```css
     #statusbar { height: var(--statusbar-height); background: var(--color-chrome); border-top: 1px solid var(--color-border); display: flex; align-items: center; padding: 0 8px; gap: 16px; font-size: 12px; color: var(--color-text); }
     ```
  8. Dialog overlay and dialogs:
     ```css
     .dialog-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.3); z-index: 1000; display: flex; align-items: center; justify-content: center; }
     .dialog-overlay.hidden { display: none; }
     .dialog { background: var(--color-chrome); border: 2px solid var(--color-border); min-width: 300px; max-width: 500px; box-shadow: 4px 4px 8px rgba(0,0,0,0.4); }
     .dialog.hidden { display: none; }
     .dialog-title { background: var(--color-dialog-title); color: var(--color-dialog-title-text); padding: 4px 8px; font-size: 13px; font-weight: bold; }
     .dialog-body { padding: 16px; font-size: 13px; }
     .dialog-body ul { list-style: none; max-height: 200px; overflow-y: auto; }
     .dialog-body ul li { padding: 4px 8px; cursor: default; }
     .dialog-body ul li:hover, .dialog-body ul li.selected { background: var(--color-menu-hover); color: var(--color-menu-hover-text); }
     .dialog-buttons { padding: 8px; display: flex; justify-content: flex-end; gap: 8px; border-top: 1px solid var(--color-border); }
     .dialog-buttons button { padding: 4px 16px; font-family: var(--font-ui); font-size: 13px; cursor: default; min-width: 72px; }
     ```
  9. Trap: Do NOT use `font-size: 0` on the body or flex gap tricks that break the status bar height on small windows.
- SKILLSET REQUIRED: CSS3, CSS custom properties, Flexbox, cross-browser font stacks
- NOTES: The `--font-editor` uses monospace because Windows Notepad defaults to Courier New for the edit area, though users can change it. Segoe UI is used for all chrome elements.
- RELATED: UC-001, UC-002, UC-002B, UC-009 | BR-002, BR-011, BR-012, BR-024, BR-057 | AR-007

---

## DI-004 : Implement menubar.js — dropdown menu bar
- SUMMARY: Render the File/Edit/View/Help menu bar dynamically from a data structure. Handle open/close of dropdowns, keyboard navigation, and dispatch of menu item actions to app.js via a callback registry.
- IMPLEMENTATION STEPS:
  1. Create `./build/extension/menubar.js`
  2. Define the menu structure as a data array:
     ```js
     const MENU_STRUCTURE = [
       { label: 'File', items: [
         { label: 'New', action: 'file:new', shortcut: 'Ctrl+N' },
         { label: 'Open...', action: 'file:open' },
         { label: 'Save', action: 'file:save', shortcut: 'Ctrl+S' },
         { label: 'Save As...', action: 'file:saveas' },
         { type: 'separator' },
         { label: 'Exit', action: 'file:exit' },
       ]},
       { label: 'Edit', items: [
         { label: 'Undo', action: 'edit:undo', shortcut: 'Ctrl+Z' },
         { type: 'separator' },
         { label: 'Cut', action: 'edit:cut', shortcut: 'Ctrl+X' },
         { label: 'Copy', action: 'edit:copy', shortcut: 'Ctrl+C' },
         { label: 'Paste', action: 'edit:paste', shortcut: 'Ctrl+V' },
         { type: 'separator' },
         { label: 'Find...', action: 'edit:find', shortcut: 'Ctrl+F' },
         { label: 'Replace...', action: 'edit:replace', shortcut: 'Ctrl+H' },
       ]},
       { label: 'View', items: [
         { label: 'Word Wrap', action: 'view:wordwrap', checkable: true },
         { label: 'Zoom In', action: 'view:zoomin' },
         { label: 'Zoom Out', action: 'view:zoomout' },
       ]},
       { label: 'Help', items: [
         { label: 'View Help', action: 'help:viewhelp' },
         { type: 'separator' },
         { label: 'About Notepad', action: 'help:about' },
       ]},
     ];
     ```
  3. Export `initMenubar(container, actionHandler)`:
     - Build DOM: one `.menu-item` per top-level menu, each with a `.menu-dropdown > ul`.
     - Each `<li>` with `data-action` attribute.
     - Clicking a `.menu-item` toggles `.open` class; closes any other open menu.
     - Clicking a dropdown `<li>` calls `actionHandler(action)` and closes all menus.
     - Clicking outside the menubar closes all menus (document click listener).
     - Pressing Escape closes all menus.
  4. Export `setMenuItemChecked(action, checked)` — adds/removes a `✓` prefix on the item label (for Word Wrap toggle).
  5. Trap: Close all open menus before opening a new one — otherwise two menus can be open simultaneously.
  6. Trap: The document-level click listener must check `!menubarElement.contains(event.target)` before closing, otherwise clicking a menu item closes before the action fires.
- SKILLSET REQUIRED: JavaScript ES6+, DOM manipulation, event delegation
- NOTES: Shortcut hints in the dropdown labels are display-only; actual keyboard shortcut handling is in app.js.
- RELATED: UC-001 | BR-004, BR-005, BR-006, BR-007, BR-008 | AR-006, AR-007

---

## DI-005 : Implement editor.js — textarea editor component
- SUMMARY: Wrap the `<textarea#editor>` with a module that handles Tab key insertion, word-wrap toggling, and dirty-flag tracking. Expose a clean API for app.js to get/set content and clear state.
- IMPLEMENTATION STEPS:
  1. Create `./build/extension/editor.js`
  2. State variables: `let isDirty = false;`
  3. Export `initEditor(textareaEl, onDirtyChange)`:
     - Listen for `input` event: set `isDirty = true`, call `onDirtyChange(true)`.
     - Listen for `keydown` event:
       ```js
       if (e.key === 'Tab') {
         e.preventDefault();
         const start = el.selectionStart;
         const end = el.selectionEnd;
         el.value = el.value.slice(0, start) + '\t' + el.value.slice(end);
         el.selectionStart = el.selectionEnd = start + 1;
         el.dispatchEvent(new Event('input')); // trigger statusbar update
       }
       ```
  4. Export `getValue()` → `textarea.value`
  5. Export `setValue(text)` → `textarea.value = text` (does NOT set dirty)
  6. Export `clear()` → `textarea.value = ''` (does NOT set dirty)
  7. Export `focus()` → `textarea.focus()`
  8. Export `setDirty(val)` → sets `isDirty = val`, calls `onDirtyChange(val)`
  9. Export `getDirty()` → returns `isDirty`
  10. Export `setWordWrap(enabled)`:
      ```js
      textarea.wrap = enabled ? 'soft' : 'off';
      textarea.style.whiteSpace = enabled ? 'pre-wrap' : 'pre';
      textarea.style.overflowX = enabled ? 'hidden' : 'auto';
      ```
  11. Trap: Manual Tab insertion (step 3) bypasses `execCommand` which is deprecated; the direct value manipulation approach is correct but MUST dispatch a synthetic `input` event so statusbar and dirty-flag listeners fire.
  12. Trap: `setValue` and `clear` must NOT set dirty — only user input should.
- SKILLSET REQUIRED: JavaScript ES6+, textarea DOM API, keyboard event handling
- NOTES: The `isDirty` flag is the source of truth for unsaved-change detection used by dialogs.js and app.js.
- RELATED: UC-002 | BR-005, BR-013, BR-014, BR-015, BR-016, BR-017, BR-018, BR-036, BR-046 | AR-005, AR-010

---

## DI-006 : Implement statusbar.js — real-time status bar
- SUMMARY: Compute and display current line number, column, character count, and encoding in the status bar footer. Update on every user interaction with the editor.
- IMPLEMENTATION STEPS:
  1. Create `./build/extension/statusbar.js`
  2. Export `initStatusbar(textareaEl, statusbarEl)`:
     - Cache span references: `lineEl`, `colEl`, `charsEl`, `encodingEl`
     - Set `encodingEl.textContent = 'UTF-8'` (static)
     - Attach listeners to `textareaEl`: `input`, `keyup`, `click`, `select`
     - Each listener calls `update()`
  3. Export `update()` — the core computation:
     ```js
     function update() {
       const text = textarea.value;
       const pos = textarea.selectionStart;
       // Count \n before cursor for line number
       const beforeCursor = text.slice(0, pos);
       const lineNum = (beforeCursor.match(/\n/g) || []).length + 1;
       // Column = chars since last \n
       const lastNewline = beforeCursor.lastIndexOf('\n');
       const colNum = lastNewline === -1 ? pos + 1 : pos - lastNewline;
       lineEl.textContent = `Ln ${lineNum}`;
       colEl.textContent = `Col ${colNum}`;
       charsEl.textContent = `${text.length} chars`;
     }
     ```
  4. Call `update()` once at init to set default values.
  5. Trap: `selectionStart` is always 0 when the textarea has no focus — call `update()` after `textarea.focus()` in app init.
  6. Trap: `click` event alone is insufficient for arrow-key navigation — must also listen to `keyup`.
- SKILLSET REQUIRED: JavaScript ES6+, textarea DOM API, string manipulation
- NOTES: Column is 1-indexed to match Windows Notepad behavior.
- RELATED: UC-002B | BR-019, BR-020, BR-021, BR-022, BR-023, BR-024 | AR-009

---

## DI-007 : Implement storage.js — localStorage note manager
- SUMMARY: Encapsulate all note persistence operations using localStorage. Provide save, load, list, and delete functions. Handle storage quota errors gracefully.
- IMPLEMENTATION STEPS:
  1. Create `./build/extension/storage.js`
  2. Key constants:
     ```js
     const PREFIX = 'notepad_note_';
     const CURRENT_KEY = 'notepad_current';
     ```
  3. Export `saveNote(filename, content)`:
     ```js
     function saveNote(filename, content) {
       try {
         localStorage.setItem(PREFIX + filename, content);
         localStorage.setItem(CURRENT_KEY, filename);
         return { ok: true };
       } catch (e) {
         if (e.name === 'QuotaExceededError') return { ok: false, error: 'Storage full' };
         return { ok: false, error: e.message };
       }
     }
     ```
  4. Export `loadNote(filename)` → `localStorage.getItem(PREFIX + filename)` (returns null if not found)
  5. Export `listNotes()`:
     ```js
     function listNotes() {
       return Object.keys(localStorage)
         .filter(k => k.startsWith(PREFIX))
         .map(k => k.slice(PREFIX.length))
         .sort();
     }
     ```
  6. Export `deleteNote(filename)` → `localStorage.removeItem(PREFIX + filename)`
  7. Export `getCurrentFilename()` → `localStorage.getItem(CURRENT_KEY) || null`
  8. Export `setCurrentFilename(filename)` → `localStorage.setItem(CURRENT_KEY, filename)`
  9. Trap: `localStorage.getItem` returns `null` (not `undefined`) for missing keys — callers must check `=== null`.
  10. Trap: Filenames are used as localStorage key suffixes — do NOT allow filenames containing special characters that could collide with the prefix. Sanitise by stripping any `/` or `\` characters.
- SKILLSET REQUIRED: JavaScript ES6+, localStorage API, error handling
- NOTES: All operations are synchronous. The return value pattern `{ ok, error }` lets app.js show user-visible errors without try/catch propagation.
- RELATED: UC-003, UC-004 | BR-025, BR-026, BR-027, BR-028, BR-029, BR-031, BR-032, BR-033, BR-034, BR-061 | AR-003

---

## DI-008 : Implement downloader.js — client-side file download
- SUMMARY: Provide a single function that downloads the current editor content as a plain text `.txt` file using Blob and a programmatic anchor click. No server involvement.
- IMPLEMENTATION STEPS:
  1. Create `./build/extension/downloader.js`
  2. Export `downloadAsText(content, filename)`:
     ```js
     export function downloadAsText(content, filename) {
       // Ensure .txt extension
       if (!filename.toLowerCase().endsWith('.txt')) filename += '.txt';
       const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
       const url = URL.createObjectURL(blob);
       const a = document.createElement('a');
       a.href = url;
       a.download = filename;
       document.body.appendChild(a);
       a.click();
       document.body.removeChild(a);
       URL.revokeObjectURL(url);
     }
     ```
  3. Default filename when caller passes empty string: use `'Untitled.txt'`.
  4. Trap: Do NOT forget `URL.revokeObjectURL(url)` — failure to revoke leaks memory for the lifetime of the page.
  5. Trap: Appending and removing the `<a>` from the DOM is necessary in some Chromium builds — do not just create and click without appending.
- SKILLSET REQUIRED: JavaScript ES6+, Blob API, URL object, DOM manipulation
- NOTES: This approach produces a UTF-8 encoded file. The BOM is not prepended (plain UTF-8, not UTF-8 BOM), which is correct for compatibility.
- RELATED: UC-006 | BR-041, BR-042, BR-043, BR-044, BR-045 | AR-008

---

## DI-009 : Implement dialogs.js — modal dialog manager
- SUMMARY: Show and hide the three in-page modal dialogs: (1) unsaved-change confirmation, (2) open/file-picker, (3) help/shortcuts. All dialogs trap Escape key and Close/Cancel buttons. The confirm dialog resolves a Promise.
- IMPLEMENTATION STEPS:
  1. Create `./build/extension/dialogs.js`
  2. Cache DOM references on init: `overlay`, `confirmDialog`, `openDialog`, `helpDialog` and all their buttons/lists.
  3. Helper `show(dialog)` / `hide(dialog)`:
     ```js
     function show(dialog) {
       overlay.classList.remove('hidden');
       dialog.classList.remove('hidden');
       // Trap focus: focus first button
       dialog.querySelector('button').focus();
     }
     function hide(dialog) {
       dialog.classList.add('hidden');
       overlay.classList.add('hidden');
     }
     ```
  4. Export `showConfirm(message)` → returns `Promise<boolean>`:
     ```js
     export function showConfirm(message) {
       return new Promise(resolve => {
         document.getElementById('dialog-message').textContent = message;
         show(confirmDialog);
         const yes = () => { cleanup(); resolve(true); };
         const no = () => { cleanup(); resolve(false); };
         function cleanup() {
           hide(confirmDialog);
           yesBtn.removeEventListener('click', yes);
           noBtn.removeEventListener('click', no);
           cancelBtn.removeEventListener('click', no);
         }
         yesBtn.addEventListener('click', yes);
         noBtn.addEventListener('click', no);
         cancelBtn.addEventListener('click', no);
       });
     }
     ```
  5. Export `showOpenPicker(notes)` → returns `Promise<string|null>` (filename or null if cancelled):
     - Populate `#open-file-list` with one `<li>` per note name.
     - Single-click selects (highlights); double-click or OK button confirms.
     - Cancel / Escape resolves `null`.
  6. Export `showHelp()`:
     - Populate `#help-content` with a table of keyboard shortcuts:
       ```
       Ctrl+N     New
       Ctrl+S     Save
       Ctrl+Z     Undo
       Ctrl+X     Cut
       Ctrl+C     Copy
       Ctrl+V     Paste
       Ctrl+F     Find
       Ctrl+H     Replace
       Escape     Close dialog
       ```
     - Close button and Escape both hide the dialog.
  7. Escape key global handler:
     ```js
     document.addEventListener('keydown', e => {
       if (e.key === 'Escape') {
         // Close whichever dialog is open
         [confirmDialog, openDialog, helpDialog].forEach(d => {
           if (!d.classList.contains('hidden')) hide(d);
         });
       }
     });
     ```
  8. Trap: Remove event listeners in `cleanup()` — if `showConfirm` is called multiple times without cleanup, multiple handlers will stack and the Promise may resolve more than once.
  9. Trap: When the open dialog is shown, clear and repopulate the list every time — stale list items from a previous call cause confusion.
- SKILLSET REQUIRED: JavaScript ES6+, Promises, DOM manipulation, event handling, focus management
- NOTES: The confirm dialog uses Yes/No/Cancel labels matching Windows Notepad behavior.
- RELATED: UC-004, UC-005, UC-007, UC-009 | BR-030, BR-037, BR-038, BR-047, BR-048, BR-054, BR-055, BR-056, BR-057, BR-058, BR-059 | AR-011

---

## DI-010 : Implement app.js — application controller
- SUMMARY: The main entry point. Initialises all modules on DOMContentLoaded, wires menu actions and keyboard shortcuts to their handlers, and manages top-level application state (current filename, word-wrap, zoom). After init, calls editor.focus() to satisfy BR-013.
- IMPLEMENTATION STEPS:
  1. Create `./build/extension/app.js`
  2. Import all modules:
     ```js
     import { initEditor, getValue, setValue, clear, focus, getDirty, setDirty, setWordWrap } from './editor.js';
     import { initStatusbar, update as updateStatus } from './statusbar.js';
     import { initMenubar, setMenuItemChecked } from './menubar.js';
     import { saveNote, loadNote, listNotes, getCurrentFilename, setCurrentFilename } from './storage.js';
     import { downloadAsText } from './downloader.js';
     import { showConfirm, showOpenPicker, showHelp } from './dialogs.js';
     ```
  3. App state:
     ```js
     let currentFilename = null;
     let wordWrap = false;
     ```
  4. `DOMContentLoaded` init sequence:
     ```js
     document.addEventListener('DOMContentLoaded', async () => {
       const textarea = document.getElementById('editor');
       const statusbar = document.getElementById('statusbar');
       const menubar = document.getElementById('menubar');
       initEditor(textarea, (dirty) => { /* optional: update title indicator */ });
       initStatusbar(textarea, statusbar);
       initMenubar(menubar, handleMenuAction);
       // Restore last session content
       currentFilename = getCurrentFilename();
       if (currentFilename) {
         const saved = loadNote(currentFilename);
         if (saved !== null) { setValue(saved); setDirty(false); updateStatus(); }
       }
       setTitle(currentFilename);
       focus();
     });
     ```
  5. Implement `setTitle(filename)`:
     ```js
     function setTitle(filename) {
       document.title = (filename ? filename : 'Untitled') + ' - Notepad';
     }
     ```
  6. Implement `handleMenuAction(action)` — switch on all action strings:
     - `'file:new'` → `cmdNew()`
     - `'file:open'` → `cmdOpen()`
     - `'file:save'` → `cmdSave()`
     - `'file:saveas'` → `cmdSaveAs()`
     - `'file:exit'` → `window.close()`
     - `'edit:undo'` → `document.execCommand('undo')`
     - `'edit:cut'` → `document.execCommand('cut')`
     - `'edit:copy'` → `document.execCommand('copy')`
     - `'edit:paste'` → `document.execCommand('paste')`
     - `'view:wordwrap'` → toggle `wordWrap`, call `setWordWrap(wordWrap)`, call `setMenuItemChecked('view:wordwrap', wordWrap)`
     - `'help:viewhelp'` → `showHelp()`
     - `'help:about'` → `alert('Notepad.exe\nA Chrome Extension')`
  7. Implement `cmdNew()`:
     ```js
     async function cmdNew() {
       if (getDirty()) {
         const ok = await showConfirm('Do you want to save changes?');
         if (!ok) return; // user cancelled
       }
       clear(); setDirty(false); currentFilename = null;
       setCurrentFilename(null); setTitle(null); updateStatus(); focus();
     }
     ```
  8. Implement `cmdOpen()`:
     ```js
     async function cmdOpen() {
       if (getDirty()) {
         const ok = await showConfirm('Do you want to save changes?');
         if (!ok) return;
       }
       const notes = listNotes();
       const filename = await showOpenPicker(notes);
       if (!filename) return;
       const content = loadNote(filename);
       if (content === null) { alert('File not found.'); return; }
       setValue(content); setDirty(false); currentFilename = filename;
       setCurrentFilename(filename); setTitle(filename); updateStatus(); focus();
     }
     ```
  9. Implement `cmdSave()`:
     ```js
     async function cmdSave() {
       if (!currentFilename) { await cmdSaveAs(); return; }
       const result = saveNote(currentFilename, getValue());
       if (!result.ok) { alert('Save failed: ' + result.error); return; }
       setDirty(false); setTitle(currentFilename);
     }
     ```
  10. Implement `cmdSaveAs()`:
      ```js
      async function cmdSaveAs() {
        const name = prompt('Save as:', currentFilename || 'Untitled.txt');
        if (!name) return;
        const filename = name.endsWith('.txt') ? name : name + '.txt';
        downloadAsText(getValue(), filename);
        // Also save to localStorage
        const result = saveNote(filename, getValue());
        if (result.ok) {
          currentFilename = filename; setCurrentFilename(filename);
          setDirty(false); setTitle(filename);
        }
      }
      ```
  11. Wire keyboard shortcuts in a `keydown` listener on `document`:
      ```js
      document.addEventListener('keydown', e => {
        if (e.ctrlKey) {
          switch (e.key) {
            case 'n': case 'N': e.preventDefault(); cmdNew(); break;
            case 's': case 'S': e.preventDefault(); cmdSave(); break;
            case 'o': case 'O': e.preventDefault(); cmdOpen(); break;
            case 'z': case 'Z': e.preventDefault(); document.execCommand('undo'); break;
          }
        }
      });
      ```
  12. Trap: `document.execCommand` is deprecated but still functional in Chromium for cut/copy/paste/undo — no alternative exists for clipboard access without the Clipboard API permission, which is not available in extension pages without user gesture handling.
  13. Trap: `cmdSaveAs` uses `prompt()` for filename input — this is acceptable in a Chrome extension popup/window context and is the simplest approach. Do NOT replace with a custom dialog unless required.
- SKILLSET REQUIRED: JavaScript ES6+ modules, async/await, DOM API, Chrome extension page context
- NOTES: All file operations go through storage.js. The controller owns no storage logic directly.
- RELATED: UC-001, UC-002, UC-003, UC-004, UC-005, UC-006, UC-007, UC-008, UC-009 | BR-004, BR-005, BR-006, BR-007, BR-008, BR-013, BR-028, BR-033, BR-039, BR-040, BR-053, BR-060 | AR-006, AR-010

---

## DI-011 : Write notepad_test_pipeline001.mjs — Playwright test script
- SUMMARY: Write a Playwright 1.59.1 test script that serves `./build/extension` via HTTP, launches Chromium headfully, and tests all 10 use cases sequentially. UC-001 and UC-008 (chrome.windows.create) are PARTIAL — tested via HTTP serve of index.html directly. All others are fully testable.
- IMPLEMENTATION STEPS:
  1. Create `./PROJECTS/Notepad.exe/notepad_test_pipeline001.mjs`
  2. Imports and setup:
     ```js
     import { chromium } from '/tmp/node_modules/playwright/index.mjs';
     import { execSync, spawn } from 'child_process';
     import fs from 'fs';
     import path from 'path';
     ```
  3. Start HTTP server (port 7777):
     ```js
     const server = spawn('python3', ['-m', 'http.server', '7777',
       '--directory', new URL('../PROJECTS/Notepad.exe/build/extension', import.meta.url).pathname]);
     await new Promise(r => setTimeout(r, 1000));
     ```
  4. Launch browser:
     ```js
     const browser = await chromium.launch({ headless: false, slowMo: 200,
       args: ['--no-sandbox', '--start-maximized'] });
     const ctx = await browser.newContext();
     const page = await ctx.newPage();
     await page.goto('http://localhost:7777/index.html');
     ```
  5. Results dir: `PROJECTS/Notepad.exe/testresults/T-PIPELINE-NP-001/`
  6. Cover each UC — example for UC-002 (typing):
     ```js
     await page.click('#editor');
     await page.fill('#editor', 'Hello, World!');
     const val = await page.inputValue('#editor');
     results.push({ uc: 'UC-002', pass: val === 'Hello, World!', br: ['BR-014','BR-018'] });
     await page.screenshot({ path: `${resultsDir}/np_shot_001_UC002_typing.png` });
     ```
  7. Cover UC-002B (status bar): after typing, check `#status-line` text contains 'Ln', `#status-col` contains 'Col', `#status-chars` shows char count.
  8. Cover UC-003 (save): click menu `File` → `Save`, use `prompt` override if needed, verify localStorage set.
  9. Cover UC-005 (new with dirty guard): type text, click File > New, check confirm dialog appears.
  10. Cover UC-006 (save as / download): intercept download event with `page.waitForEvent('download')`.
  11. Cover UC-009 (help dialog): click Help > View Help, check `#dialog-help` is visible, check Escape closes it.
  12. Write results JSON:
      ```js
      fs.mkdirSync(resultsDir, { recursive: true });
      fs.writeFileSync(path.join(resultsDir, 'results.json'), JSON.stringify(results, null, 2));
      ```
  13. Print summary and exit:
      ```js
      const pass = results.filter(r => r.pass).length;
      const fail = results.filter(r => !r.pass).length;
      console.log(`T-PIPELINE-NP-001 — ${pass}/${results.length} PASS | ${fail} FAIL`);
      process.exit(fail > 0 ? 1 : 0);
      ```
  14. Kill HTTP server in `finally` block: `server.kill()`.
  15. Trap: `page.fill('#editor')` replaces all content — use `page.click` + `page.keyboard.type` for additive typing, or `fill` for set-value tests.
  16. Trap: Menu dropdowns need a `page.click('.menu-item:has-text("File")')` then wait for dropdown to be visible before clicking items.
  17. Trap: `prompt()` inside the page is a native dialog — override it before triggering Save As: `await page.evaluate(() => { window.prompt = () => 'test.txt'; });`
- SKILLSET REQUIRED: Playwright 1.59.1, Node.js ES modules, child_process, file system, HTTP server spin-up
- NOTES: UC-001 and UC-008 are PARTIAL — chrome.windows.create requires a real installed extension. Document this clearly in 6-TEST-REPORT.md.
- RELATED: UC-001, UC-002, UC-002B, UC-003, UC-004, UC-005, UC-006, UC-007, UC-008, UC-009 | BR-001, BR-004, BR-009, BR-010, BR-014, BR-019, BR-025, BR-030, BR-035, BR-041, BR-054 | AR-012

---
