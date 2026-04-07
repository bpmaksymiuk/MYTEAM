# Design Instructions

Generated from `2-REQUIREMENTS.md`, `3-ARCHITECTURE-RECOMMENDATIONS.md`, and `3-PARTS LIST.md`. Owned by Technical Lead.

---

## DI-001 : Create manifest.json — Chrome Extension Manifest V3
- SUMMARY
  Create the Chrome Extension Manifest V3 declaration file that registers the extension with Chrome, declares the two required permissions (storage, windows), points to the service worker entry point, and configures an empty `action` block so that toolbar icon clicks route to the service worker via `chrome.action.onClicked`. The deliberate absence of a `default_popup` in the `action` block is what causes the click event to fire; adding one would suppress it.
- IMPLEMENTATION STEPS
  1. Create `build/extension/manifest.json`:
     ```json
     {
       "manifest_version": 3,
       "name": "Notepad",
       "version": "1.0.0",
       "description": "A Windows Notepad-style text editor as a Chrome extension.",
       "permissions": ["storage", "windows"],
       "background": {
         "service_worker": "background.js"
       },
       "action": {}
     }
     ```
  2. Do NOT add `default_popup` to `action` — its presence suppresses `chrome.action.onClicked`.
  3. Do NOT add `host_permissions` — this extension accesses no external URLs.
  4. Both `"storage"` and `"windows"` are required: `storage` for `chrome.storage.local`, `windows` for `chrome.windows.create` and `chrome.windows.update`.
  5. The `"action": {}` block (with no properties) is necessary for the toolbar icon to appear; omitting `action` entirely may hide the icon in some Chrome builds.
  6. Icon files (`"icons"` field) are optional for an initial build; Chrome shows a generic puzzle-piece icon if omitted.
- SKILLSET REQUIRED
  Chrome Extension Manifest V3, JSON.
- NOTES
  Do not add `web_accessible_resources` — there are no resources that need to be accessible from external pages. The `"name"` field appears in the Chrome Extensions manager, not in the application UI. Keep `"version"` as `"1.0.0"` for the initial build; the developer increments it on each release.
- RELATED
  BR-001, BR-027, AR-001, PT-001 | UC-001, UC-008

---

## DI-002 : Create background.js — Service Worker and Window Lifecycle
- SUMMARY
  Create the MV3 service worker that owns the entire Notepad window lifecycle. On `chrome.action.onClicked`, it either creates a new standalone popup window or focuses the existing one (single-instance guard). It validates the tracked `windowId` with `chrome.windows.get` before reuse to handle the case where the service worker was terminated and restarted. It listens to `chrome.windows.onBoundsChanged` to persist window position and size to `chrome.storage.local`, and to `chrome.windows.onRemoved` to clear the tracked ID when the window is closed.
- IMPLEMENTATION STEPS
  1. Create `build/extension/background.js`.
  2. Declare module-level `let notepadWindowId = null;` to track the open window ID in memory.
  3. Register `chrome.action.onClicked` listener:
     ```js
     chrome.action.onClicked.addListener(async () => {
       if (notepadWindowId !== null) {
         try {
           await chrome.windows.get(notepadWindowId);
           // Window still exists — focus it
           await chrome.windows.update(notepadWindowId, { focused: true });
           return;
         } catch {
           notepadWindowId = null; // stale ID — fall through to create
         }
       }
       await createNotepadWindow();
     });
     ```
  4. Implement `async function createNotepadWindow()`:
     ```js
     async function createNotepadWindow() {
       const stored = await chrome.storage.local.get('windowState');
       const state  = stored.windowState ?? { left: 100, top: 100, width: 800, height: 600 };
       const win = await chrome.windows.create({
         type:   'popup',
         url:    chrome.runtime.getURL('notepad.html'),
         left:   state.left,
         top:    state.top,
         width:  state.width,
         height: state.height,
       });
       notepadWindowId = win.id;
     }
     ```
  5. Register `chrome.windows.onRemoved` listener:
     ```js
     chrome.windows.onRemoved.addListener(removedId => {
       if (removedId === notepadWindowId) notepadWindowId = null;
     });
     ```
  6. Register `chrome.windows.onBoundsChanged` listener:
     ```js
     chrome.windows.onBoundsChanged.addListener(win => {
       if (win.id === notepadWindowId) {
         chrome.storage.local.set({
           windowState: { left: win.left, top: win.top, width: win.width, height: win.height }
         });
       }
     });
     ```
  7. All `chrome.windows` calls must use `try/catch` or check `chrome.runtime.lastError` to avoid uncaught promise rejections.
- SKILLSET REQUIRED
  Chrome Extension MV3 service worker, `chrome.windows` API, `chrome.storage.local`, async/await.
- NOTES
  MV3 service workers are terminated by Chrome after a period of inactivity; `notepadWindowId` is in-memory only and will be lost on termination. The `chrome.windows.get()` guard call before reuse is essential to detect stale IDs after the SW restarts. The `type: 'popup'` creates a standalone OS window without the browser's tab strip or address bar. `chrome.runtime.getURL('notepad.html')` returns the `chrome-extension://` scheme URL for the page. `chrome.windows.onBoundsChanged` fires repeatedly during drag/resize; Chrome debounces these for storage — no additional debounce is needed in the listener.
- RELATED
  BR-001, BR-026, BR-027, AR-002, AR-011, PT-002 | UC-001, UC-008

---

## DI-003 : Create notepad.html — UI Page Shell
- SUMMARY
  Create the single HTML page loaded as the Notepad window content via `chrome.windows.create`. The page contains a four-button menu bar (File, Edit, View, Help), a dropdown placeholder container, the main `<textarea>` editor, a status bar with four labeled sections, a blocking Help modal `<dialog>`, and a non-blocking Find `<dialog>`. All interactive behavior is wired from `notepad.js`. The OS window title bar is provided by Chrome; the HTML page covers only the client area.
- IMPLEMENTATION STEPS
  1. Create `build/extension/notepad.html`:
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
       <nav id="menubar">
         <button class="menu-btn" data-menu="file">File</button>
         <button class="menu-btn" data-menu="edit">Edit</button>
         <button class="menu-btn" data-menu="view">View</button>
         <button class="menu-btn" data-menu="help">Help</button>
       </nav>

       <div id="dropdown-container"></div>

       <textarea id="editor" spellcheck="false"></textarea>

       <div id="statusbar">
         <span id="status-encoding">UTF-8</span>
         <span id="status-ln">Ln 1</span>
         <span id="status-col">Col 1</span>
         <span id="status-chr">0 Chr</span>
       </div>

       <dialog id="help-dialog">
         <h2>Keyboard Shortcuts</h2>
         <table id="shortcuts-table">
           <thead><tr><th>Shortcut</th><th>Action</th></tr></thead>
           <tbody></tbody>
         </table>
         <div id="help-footer"><button id="help-close">Close</button></div>
       </dialog>

       <dialog id="find-dialog">
         <p><label>Find: <input id="find-input" type="text" autocomplete="off"></label></p>
         <p><label><input id="find-match-case" type="checkbox"> Match case</label></p>
         <div>
           <button id="find-next">Find Next</button>
           <button id="find-close">Close</button>
         </div>
       </dialog>

       <script src="notepad.js"></script>
     </body>
     </html>
     ```
  2. The `<title>` element is updated by `notepad.js` at runtime. Chrome uses the page `<title>` as the OS window title for `type:'popup'` windows.
  3. `<textarea id="editor">` must carry `spellcheck="false"` to suppress browser spell-check underlines.
  4. Do NOT add any `onclick` or inline event handler attributes — all event wiring is done in `notepad.js`.
  5. `<script src="notepad.js">` must be the last element inside `<body>` so all DOM elements exist before the script executes.
  6. The four status `<span>` IDs (`status-encoding`, `status-ln`, `status-col`, `status-chr`) must match exactly — `notepad.js` queries them by ID.
  7. The `#dropdown-container` `<div>` is used by the menu component to inject dropdown panels dynamically.
- SKILLSET REQUIRED
  HTML5, semantic markup, Chrome extension page structure.
- NOTES
  There is no `<div id="titlebar">` needed in the HTML — the OS window provides the title bar. The Help dialog uses `showModal()` (blocking); the Find dialog uses `show()` (non-blocking/modeless). The `<meta name="viewport">` tag prevents unexpected scaling in some Chromium builds. Do not add a `<base>` tag — relative URLs resolve correctly from the extension origin without it.
- RELATED
  BR-002, BR-003, BR-004, BR-005, BR-007, BR-009, BR-028, BR-030, AR-003, AR-004, AR-010, PT-003 | UC-001, UC-002, UC-002B, UC-009

---

## DI-004 : Create notepad.css — Windows Notepad Visual Theme
- SUMMARY
  Create the CSS stylesheet that reproduces the Windows Notepad visual style using Segoe UI font, light gray (`#f0f0f0`) menu bar and status bar, white (`#ffffff`) editor background, and black text. The body uses a flex column layout so the menu bar and status bar are fixed-height strips and the `<textarea>` fills all remaining vertical space. All theme values are defined as CSS custom properties on `:root` for easy tuning.
- IMPLEMENTATION STEPS
  1. Create `build/extension/notepad.css`.
  2. Define CSS custom properties on `:root`:
     ```css
     :root {
       --menu-bg:    #f0f0f0;
       --editor-bg:  #ffffff;
       --status-bg:  #f0f0f0;
       --border:     #c0c0c0;
       --text:       #000000;
       --hover-bg:   #d0d0d0;
       --sel-bg:     #0078d7;
       --sel-text:   #ffffff;
       --font-ui:    'Segoe UI', system-ui, -apple-system, sans-serif;
       --font-editor: 'Courier New', Courier, monospace;
     }
     ```
  3. Reset and body layout:
     ```css
     *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
     html, body { height: 100%; overflow: hidden; }
     body {
       display: flex; flex-direction: column;
       font-family: var(--font-ui); font-size: 13px;
       background: var(--menu-bg); color: var(--text);
     }
     ```
  4. Menu bar (`#menubar`):
     ```css
     #menubar {
       display: flex; flex-shrink: 0;
       background: var(--menu-bg);
       border-bottom: 1px solid var(--border);
       padding: 2px 0;
     }
     ```
  5. Menu buttons (`.menu-btn`):
     ```css
     .menu-btn {
       background: none; border: none; outline: none;
       padding: 2px 8px; cursor: default;
       font-family: var(--font-ui); font-size: 13px; color: var(--text);
     }
     .menu-btn:hover, .menu-btn.active { background: var(--hover-bg); }
     ```
  6. Dropdown panels (`.dropdown-panel`):
     ```css
     .dropdown-panel {
       position: fixed; z-index: 1000;
       background: var(--menu-bg);
       border: 1px solid var(--border);
       box-shadow: 2px 2px 4px rgba(0,0,0,0.25);
       list-style: none; padding: 2px 0; min-width: 180px;
     }
     .dropdown-item {
       display: flex; justify-content: space-between;
       padding: 4px 16px 4px 24px; cursor: default; white-space: nowrap;
     }
     .dropdown-item:hover { background: var(--sel-bg); color: var(--sel-text); }
     .dropdown-item.disabled { color: #aaa; pointer-events: none; }
     .shortcut-label { margin-left: 24px; font-size: 12px; color: inherit; }
     .separator { border-top: 1px solid var(--border); margin: 2px 0; }
     ```
  7. Editor (`#editor`):
     ```css
     #editor {
       flex: 1; resize: none; border: none; outline: none;
       background: var(--editor-bg); color: var(--text);
       font-family: var(--font-editor); font-size: 14px;
       padding: 4px; width: 100%;
       white-space: pre; overflow-x: auto;
     }
     #editor.word-wrap { white-space: pre-wrap; word-break: break-all; overflow-x: hidden; }
     ```
  8. Status bar (`#statusbar`):
     ```css
     #statusbar {
       display: flex; flex-shrink: 0; align-items: center;
       background: var(--status-bg);
       border-top: 1px solid var(--border);
       height: 22px;
     }
     #statusbar span {
       padding: 0 16px 0 8px;
       border-right: 1px solid var(--border);
       font-size: 12px; white-space: nowrap;
     }
     ```
  9. Help dialog (`#help-dialog`):
     ```css
     #help-dialog { width: 420px; padding: 16px; border: 1px solid var(--border); }
     #help-dialog h2 { font-size: 14px; margin-bottom: 8px; }
     #shortcuts-table { border-collapse: collapse; width: 100%; font-size: 13px; }
     #shortcuts-table th, #shortcuts-table td { padding: 4px 8px; text-align: left; border-bottom: 1px solid #eee; }
     #help-footer { text-align: right; margin-top: 10px; }
     dialog::backdrop { background: rgba(0,0,0,0.25); }
     ```
  10. Find dialog (`#find-dialog`):
      ```css
      #find-dialog {
        padding: 12px 16px; border: 1px solid var(--border);
        background: var(--menu-bg); font-size: 13px;
      }
      #find-dialog p { margin-bottom: 8px; }
      #find-dialog button { margin-right: 6px; }
      ```
- SKILLSET REQUIRED
  CSS3, CSS custom properties, flexbox layout.
- NOTES
  The `#editor.word-wrap` class toggling is the mechanism for View > Word Wrap (see DI-005). Do not use `font: menu` or `font: -webkit-control` — these system font shorthands produce inconsistent cross-OS results. The `border-top` on `#statusbar` is the only visual separator between the editor and the status bar; a `1px` line matches Windows Notepad. The `overflow: hidden` on `html, body` prevents scrollbars appearing on the window chrome (the textarea manages its own scrolling).
- RELATED
  BR-002, BR-004, BR-005, BR-006, AR-003, PT-004 | UC-001, UC-002, UC-002B

---

## DI-005 : Implement notepad.js — Application Bootstrap, State Management, and File Operations
- SUMMARY
  Implement `notepad.js` as the single main JavaScript module that is loaded at the bottom of `notepad.html`. It initializes module-level state (dirty flag, current filename, word-wrap flag), provides title bar management helpers (`setDirty`, `setFilename`), implements File > New and File > Save As operations, orchestrates the DOMContentLoaded startup sequence (auto-load last document, set editor focus), binds all global keyboard shortcuts (Ctrl+S, Ctrl+N, Ctrl+F, Ctrl+Z, F1), wires the Tab-key override, and registers Edit > Cut/Copy/Paste keyboard handling. It acts as the integration point for all other components (undoStack, StatusBar, Storage, MenuComponent, FindDialog).
- IMPLEMENTATION STEPS
  1. Create `build/extension/notepad.js`. Begin with module-level state:
     ```js
     'use strict';
     let isDirty = false;
     let currentFilename = 'Untitled';
     let wordWrap = false;
     ```
  2. Implement `function setFilename(name)`:
     ```js
     function setFilename(name) {
       currentFilename = name;
       setDirty(isDirty); // refresh title
     }
     ```
  3. Implement `function setDirty(val)`:
     ```js
     function setDirty(val) {
       isDirty = val;
       document.title = (val ? '* ' : '') + currentFilename + ' - Notepad';
     }
     ```
  4. Implement `function newDocument()`:
     ```js
     function newDocument() {
       if (isDirty && !window.confirm('Discard unsaved changes?')) return;
       document.getElementById('editor').value = '';
       setFilename('Untitled');
       setDirty(false);
       undoStack.reset();
       updateStatusBar();
     }
     ```
  5. Implement `function saveAsDownload()` (File > Save As):
     ```js
     function saveAsDownload() {
       const val  = document.getElementById('editor').value;
       const blob = new Blob([val], { type: 'text/plain' });
       const url  = URL.createObjectURL(blob);
       const a    = document.createElement('a');
       a.href = url;
       a.download = currentFilename + '.txt';
       document.body.appendChild(a);
       a.click();
       document.body.removeChild(a);
       URL.revokeObjectURL(url); // revoke immediately after click
     }
     ```
  6. Implement `function toggleWordWrap()`:
     ```js
     function toggleWordWrap() {
       wordWrap = !wordWrap;
       document.getElementById('editor').classList.toggle('word-wrap', wordWrap);
       Storage.saveWordWrap(wordWrap);
     }
     ```
  7. Register keyboard shortcuts in `DOMContentLoaded` (after all functions are defined):
     ```js
     document.addEventListener('keydown', e => {
       if (e.ctrlKey && !e.shiftKey && !e.altKey) {
         if (e.key === 's') { e.preventDefault(); Storage.saveDocument(); }
         if (e.key === 'n') { e.preventDefault(); newDocument(); }
         if (e.key === 'f') { e.preventDefault(); openFindDialog(); }
         if (e.key === 'z') { e.preventDefault(); undoStack.undo(); }
       }
       if (e.key === 'F1') { e.preventDefault(); showHelpDialog(); }
     }, { capture: true });
     ```
  8. Wire the editor `input` event (must come after `undoStack` and `updateStatusBar` are defined):
     ```js
     const editor = document.getElementById('editor');
     editor.addEventListener('input', () => {
       setDirty(true);
       undoStack.push(editor.value);
       updateStatusBar();
     });
     ```
  9. Wire Tab-key override:
     ```js
     editor.addEventListener('keydown', e => {
       if (e.key === 'Tab') {
         e.preventDefault();
         const s = editor.selectionStart;
         editor.setRangeText('\t', s, editor.selectionEnd, 'end');
         updateStatusBar();
       }
     });
     ```
  10. Wire `keyup` and `click` on editor → `updateStatusBar()`.
  11. DOMContentLoaded startup sequence:
      ```js
      document.addEventListener('DOMContentLoaded', async () => {
        await Storage.loadWindowState(); // restore word-wrap
        await Storage.loadLastDocument(); // pre-populate editor
        document.getElementById('editor').focus();
        renderMenus();
        wireFindDialog();
        document.getElementById('help-close').addEventListener('click', () =>
          document.getElementById('help-dialog').close());
      });
      ```
- SKILLSET REQUIRED
  Vanilla JavaScript (ES2022), DOM APIs, Blob API, `URL.createObjectURL`, Chrome extension page context.
- NOTES
  `URL.revokeObjectURL()` must be called immediately after `a.click()` — there is no reason to delay. Chrome completes the download from the blob synchronously before the revoke takes effect. `document.title` controls the OS window title bar for `type:'popup'` windows — this is the correct approach; no separate title bar HTML element is needed. `window.confirm()` is acceptable for the dirty-state prompt; the native OS dialog style is acceptable. Do NOT attempt to intercept the OS window close button via `beforeunload` — MV3 extension pages cannot reliably intercept it; cleanup is handled by `background.js` `onRemoved`. All action functions (`newDocument`, `saveAsDownload`, etc.) must be declared with `function` (hoisted) before `MENUS` (see DI-007) is declared as a `const`.
- RELATED
  BR-002, BR-007, BR-009, BR-015, BR-016, BR-020, BR-021, BR-023, BR-024, BR-025, AR-004, AR-007, PT-005 | UC-001, UC-002, UC-003, UC-005, UC-006, UC-007

---

## DI-006 : Implement Undo Stack in notepad.js
- SUMMARY
  Implement a custom in-memory undo stack inside `notepad.js` as an IIFE-scoped object (`undoStack`). It stores complete `textarea.value` snapshots on a debounced timer (300 ms), supports `undo()` (pop and restore the previous snapshot), and `reset()` (clear all history on File > New or File > Open). Redo is explicitly out of scope. The stack depth is capped at 200 entries to bound memory consumption.
- IMPLEMENTATION STEPS
  1. Define `undoStack` near the top of `notepad.js`, after state declarations and before action functions:
     ```js
     const undoStack = (() => {
       const MAX = 200;
       let stack = [];
       let timer = null;
       return {
         push(value) {
           clearTimeout(timer);
           timer = setTimeout(() => {
             if (stack[stack.length - 1] !== value) {
               stack.push(value);
               if (stack.length > MAX) stack.shift();
             }
           }, 300);
         },
         undo() {
           clearTimeout(timer);
           if (stack.length > 1) {
             stack.pop();
             const prev   = stack[stack.length - 1];
             const editor = document.getElementById('editor');
             editor.value = prev;
             setDirty(true);
             updateStatusBar();
           }
         },
         reset() {
           clearTimeout(timer);
           stack = [];
         },
         get size() { return stack.length; },
       };
     })();
     ```
  2. `undoStack.push(editor.value)` is called inside the editor `input` event handler (wired in DI-005, step 8).
  3. `undoStack.undo()` is called in the Ctrl+Z keyboard handler (DI-005, step 7).
  4. `undoStack.reset()` is called inside `newDocument()` (DI-005, step 4) and inside `Storage.loadDocument()` (DI-010, step 3).
  5. Optionally, disable the Edit > Undo menu item when `undoStack.size <= 1` by inspecting the size on every menu open.
- SKILLSET REQUIRED
  JavaScript closures, IIFE module pattern, debouncing with `setTimeout`/`clearTimeout`.
- NOTES
  Stack entries are complete `textarea.value` strings — not character diffs or edit operations. This is simple and correct, at the cost of memory proportional to document size × stack depth. The 300 ms debounce interval means rapid consecutive keystrokes produce one snapshot (captured 300 ms after the last keystroke), not one per key. `clearTimeout(timer)` before starting a new timer is critical to prevent phantom pushes after a block of typing ends. The undo stack must be reset on every document load to prevent Ctrl+Z from crossing document boundaries — this is a correctness requirement (BR-019), not an optional enhancement.
- RELATED
  BR-008, BR-019, AR-005, PT-006 | UC-002

---

## DI-007 : Implement Dropdown Menu Component in notepad.js
- SUMMARY
  Implement the four dropdown menus (File, Edit, View, Help) as a pure JavaScript component driven by a central `MENUS` constant. Each menu button dynamically creates and injects a `<ul class="dropdown-panel">` into `#dropdown-container`, positioned below the triggering button. The same `MENUS` data structure is iterated by `showHelpDialog()` to populate the Help shortcuts table, making `MENUS` the single source of truth for both rendered menus and the Help dialog shortcut list (BR-029).
- IMPLEMENTATION STEPS
  1. Define `const MENUS` after all action functions are declared (to avoid `const` before declaration for functions referenced inside):
     ```js
     const MENUS = {
       file: [
         { label: 'New',          shortcut: 'Ctrl+N', action: newDocument },
         { label: 'Open\u2026',   shortcut: 'Ctrl+O', action: () => Storage.openDocument() },
         { label: 'Save',         shortcut: 'Ctrl+S', action: () => Storage.saveDocument() },
         { label: 'Save As\u2026',shortcut: '',       action: saveAsDownload },
         { sep: true },
         { label: 'Exit',         shortcut: 'Alt+F4', action: () => window.close() },
       ],
       edit: [
         { label: 'Undo',  shortcut: 'Ctrl+Z', action: () => undoStack.undo() },
         { sep: true },
         { label: 'Cut',   shortcut: 'Ctrl+X', action: () => document.execCommand('cut') },
         { label: 'Copy',  shortcut: 'Ctrl+C', action: () => document.execCommand('copy') },
         { label: 'Paste', shortcut: 'Ctrl+V', action: () => document.execCommand('paste') },
         { sep: true },
         { label: 'Find\u2026', shortcut: 'Ctrl+F', action: openFindDialog },
       ],
       view: [
         { label: 'Word Wrap', shortcut: '', action: toggleWordWrap },
       ],
       help: [
         { label: 'View Help',      shortcut: 'F1', action: showHelpDialog },
         { sep: true },
         { label: 'About Notepad',  shortcut: '',   action: () => window.alert('Notepad for Chrome\nVersion 1.0.0') },
       ],
     };
     ```
  2. Implement `function closeAllMenus()`:
     ```js
     function closeAllMenus() {
       document.getElementById('dropdown-container').innerHTML = '';
       document.querySelectorAll('.menu-btn').forEach(b => b.classList.remove('active'));
     }
     ```
  3. Implement `function renderMenus()` (called once in DOMContentLoaded):
     ```js
     function renderMenus() {
       document.querySelectorAll('.menu-btn').forEach(btn => {
         btn.addEventListener('click', e => {
           const key     = btn.dataset.menu;
           const wasOpen = btn.classList.contains('active');
           closeAllMenus();
           if (wasOpen) return;
           btn.classList.add('active');
           const items = MENUS[key] ?? [];
           const rect  = btn.getBoundingClientRect();
           const ul    = document.createElement('ul');
           ul.className = 'dropdown-panel';
           ul.style.left = rect.left + 'px';
           ul.style.top  = rect.bottom + 'px';
           items.forEach(item => {
             const li = document.createElement('li');
             if (item.sep) { li.className = 'separator'; }
             else {
               li.className = 'dropdown-item';
               li.innerHTML = `<span>${item.label}</span><span class="shortcut-label">${item.shortcut}</span>`;
               li.addEventListener('click', () => { closeAllMenus(); item.action?.(); });
             }
             ul.appendChild(li);
           });
           document.getElementById('dropdown-container').appendChild(ul);
           e.stopPropagation();
         });
       });
     }
     ```
  4. Close menus on outside click:
     ```js
     document.addEventListener('mousedown', e => {
       if (!e.target.closest('#menubar') && !e.target.closest('#dropdown-container'))
         closeAllMenus();
     });
     ```
  5. Close menus on Escape:
     ```js
     document.addEventListener('keydown', e => {
       if (e.key === 'Escape') closeAllMenus();
     });
     ```
  6. Implement `function showHelpDialog()`:
     ```js
     function showHelpDialog() {
       const tbody = document.querySelector('#shortcuts-table tbody');
       tbody.innerHTML = '';
       Object.values(MENUS).flat().forEach(item => {
         if (!item.sep && item.shortcut) {
           const tr = document.createElement('tr');
           tr.innerHTML = `<td>${item.shortcut}</td><td>${item.label}</td>`;
           tbody.appendChild(tr);
         }
       });
       document.getElementById('help-dialog').showModal();
     }
     ```
- SKILLSET REQUIRED
  Vanilla JavaScript, DOM manipulation, event delegation, `getBoundingClientRect`, closures.
- NOTES
  Panels are created and destroyed dynamically on each open — do not use `display:none` toggling on pre-rendered panels, which causes stale state. `document.execCommand('cut/copy/paste')` is deprecated but still functional in Chromium extension pages for textarea clipboard operations; there is no prompt required for these calls in an extension page context. `window.close()` for Exit may be blocked by Chrome if the page was not opened by a script — treat it as best-effort. The `MENUS` object must be declared after all `function` declarations (hoisted), since arrow functions in the items reference hoisted functions (`newDocument`, etc.).
- RELATED
  BR-003, BR-009, BR-028, BR-029, AR-008, PT-007 | UC-001, UC-009

---

## DI-008 : Implement Status Bar Component in notepad.js
- SUMMARY
  Implement `function updateStatusBar()` inside `notepad.js` that computes the current line number (`Ln`), column position (`Col`), and total character count (`Chr`) from the textarea's `selectionStart` property and writes them to the four status bar `<span>` elements. This function is called on every `input`, `keyup`, and `click` event on the editor, and explicitly after File > New, File > Open/Load, and during the startup auto-load. The encoding span always displays `UTF-8` and is not computed.
- IMPLEMENTATION STEPS
  1. Implement `function updateStatusBar()` in `notepad.js`:
     ```js
     function updateStatusBar() {
       const editor = document.getElementById('editor');
       const val    = editor.value;
       const pos    = editor.selectionStart;
       // Line number: count newlines before cursor, +1 for 1-indexed
       const before  = val.substring(0, pos);
       const lines   = before.split('\n');
       const ln      = lines.length;
       // Column: character count within the current line, +1 for 1-indexed
       const col     = lines[lines.length - 1].length + 1;
       // Total character count
       const chr     = val.length;
       document.getElementById('status-ln').textContent       = 'Ln '   + ln;
       document.getElementById('status-col').textContent      = 'Col '  + col;
       document.getElementById('status-chr').textContent      = chr     + ' Chr';
       document.getElementById('status-encoding').textContent = 'UTF-8';
     }
     ```
  2. Wire `keyup` on editor: `editor.addEventListener('keyup', updateStatusBar)`.
  3. Wire `click` on editor: `editor.addEventListener('click', updateStatusBar)`.
  4. The editor `input` handler already calls `updateStatusBar()` (DI-005, step 8).
  5. Call `updateStatusBar()` at the end of `newDocument()` (DI-005, step 4).
  6. Call `updateStatusBar()` at the end of `Storage.loadDocument()` (DI-010, step 3).
  7. Call `updateStatusBar()` at the end of the DOMContentLoaded startup sequence.
- SKILLSET REQUIRED
  Vanilla JavaScript, `String.prototype.split`, `textarea.selectionStart`.
- NOTES
  Use `val.substring(0, pos).split('\n').length` — this is the correct and efficient way to count lines before the cursor position. Do NOT use a regex to count newlines; `split('\n')` is simpler and handles the zero-length string case correctly (returns `['']`, length 1, giving Ln 1). After File > New, the editor value is `''` and `selectionStart` is 0, so `updateStatusBar()` naturally produces `Ln 1, Col 1, 0 Chr` — exactly what BR-022 requires without any special-case reset logic. The `status-encoding` span always shows `UTF-8` and could be set once at startup, but it is safe and negligible overhead to set it on every call.
- RELATED
  BR-005, BR-010, BR-011, BR-012, BR-013, BR-022, AR-009, PT-008 | UC-002, UC-002B

---

## DI-009 : Implement Find Dialog in notepad.js
- SUMMARY
  Implement the non-blocking Find dialog using the `<dialog id="find-dialog">` element declared in `notepad.html`. Opening is triggered by Ctrl+F or Edit > Find. The component searches the editor content with `String.prototype.indexOf`, highlights the next match by setting `selectionStart`/`selectionEnd` on the `<textarea>`, wraps back to the beginning when the end of document is reached, respects a Match Case checkbox, and shows a browser alert when no match is found. It uses `dialog.show()` (not `showModal()`) so the user can continue editing while the dialog is visible.
- IMPLEMENTATION STEPS
  1. Declare module-level `let findLastIndex = 0;` near the top of `notepad.js`.
  2. Implement `function openFindDialog()`:
     ```js
     function openFindDialog() {
       const dlg = document.getElementById('find-dialog');
       dlg.show(); // non-blocking
       document.getElementById('find-input').select();
     }
     ```
  3. Implement `function findNext()`:
     ```js
     function findNext() {
       const editor    = document.getElementById('editor');
       const input     = document.getElementById('find-input').value;
       const matchCase = document.getElementById('find-match-case').checked;
       if (!input) return;
       const haystack = matchCase ? editor.value : editor.value.toLowerCase();
       const needle   = matchCase ? input : input.toLowerCase();
       let idx = haystack.indexOf(needle, findLastIndex);
       if (idx === -1) {
         idx = haystack.indexOf(needle, 0); // wrap
       }
       if (idx === -1) {
         window.alert('Cannot find "' + input + '"');
         findLastIndex = 0;
         return;
       }
       editor.focus();
       editor.setSelectionRange(idx, idx + needle.length);
       findLastIndex = idx + 1; // advance past this match
     }
     ```
  4. Implement `function wireFindDialog()` (called once in DOMContentLoaded):
     ```js
     function wireFindDialog() {
       document.getElementById('find-next').addEventListener('click', findNext);
       document.getElementById('find-close').addEventListener('click', () => {
         document.getElementById('find-dialog').close();
         findLastIndex = 0;
       });
       const findInput = document.getElementById('find-input');
       findInput.addEventListener('input', () => { findLastIndex = 0; });
       findInput.addEventListener('keydown', e => {
         if (e.key === 'Enter') { e.preventDefault(); findNext(); }
       });
     }
     ```
  5. The Escape key closes the Find dialog natively when `dialog.show()` is active — no extra wiring needed.
- SKILLSET REQUIRED
  Vanilla JavaScript, HTML `<dialog>` API, `String.prototype.indexOf`, `textarea.setSelectionRange`.
- NOTES
  `dialog.show()` (not `showModal()`) creates a modeless dialog — focus is not trapped and the user can click in the editor without closing the dialog. `dialog.showModal()` would be wrong here. `findLastIndex` must be reset to 0 when the search term changes (step 4, `input` event), otherwise subsequent searches for a different term will start at the wrong position. `editor.setSelectionRange()` automatically scrolls the textarea to make the selection visible in modern browsers — no explicit `scrollIntoView` call is needed. `window.alert()` for "not found" is acceptable for MVP. Replace functionality is not required by any current BR and must NOT be implemented.
- RELATED
  BR-030, AR-010, PT-009 | UC-002

---

## DI-010 : Implement Storage Module in notepad.js
- SUMMARY
  Implement a `Storage` module object inside `notepad.js` that encapsulates all `chrome.storage.local` operations: saving and loading documents (using `doc_<filename>` key prefix), listing all saved document names, handling the File > Open flow (list → prompt → load), persisting and restoring word-wrap state and window state, and auto-loading the last saved document on startup. All functions return Promises and are consumed with `async/await` in calling code.
- IMPLEMENTATION STEPS
  1. Define the `Storage` constant near the top of `notepad.js`, after state declarations and the `undoStack` definition but before action functions:
     ```js
     const Storage = {
       async saveDocument() {
         const val = document.getElementById('editor').value;
         await chrome.storage.local.set({ ['doc_' + currentFilename]: val });
         await chrome.storage.local.set({ lastFile: currentFilename });
         setDirty(false);
       },
       async loadDocument(filename) {
         const result = await chrome.storage.local.get('doc_' + filename);
         const val    = result['doc_' + filename] ?? '';
         document.getElementById('editor').value = val;
         setFilename(filename);
         setDirty(false);
         undoStack.reset();
         updateStatusBar();
       },
       async listDocuments() {
         const all = await chrome.storage.local.get(null);
         return Object.keys(all)
           .filter(k => k.startsWith('doc_'))
           .map(k => k.slice(4)); // strip 'doc_' prefix
       },
       async openDocument() {
         if (isDirty && !window.confirm('Discard unsaved changes?')) return;
         const docs = await Storage.listDocuments();
         if (docs.length === 0) { window.alert('No saved documents found.'); return; }
         const chosen = window.prompt('Select document:\n' + docs.join('\n'), docs[0]);
         if (!chosen || !docs.includes(chosen)) return;
         await Storage.loadDocument(chosen);
       },
       async loadLastDocument() {
         const r = await chrome.storage.local.get('lastFile');
         if (r.lastFile) {
           await Storage.loadDocument(r.lastFile);
         } else {
           // No previous save — start blank
           setFilename('Untitled');
           setDirty(false);
           updateStatusBar();
         }
       },
       async saveWordWrap(val) {
         await chrome.storage.local.set({ wordWrap: val });
       },
       async loadWindowState() {
         const r = await chrome.storage.local.get('wordWrap');
         if (r.wordWrap === true) {
           wordWrap = true;
           document.getElementById('editor').classList.add('word-wrap');
         }
       }
     };
     ```
  2. Key schema (must not deviate):
     - `doc_<filename>` — document text (string); filename does NOT include `.txt`.
     - `lastFile` — the most recently saved filename (string); used for auto-load on startup.
     - `wordWrap` — boolean; persists word-wrap toggle state.
     - `windowState` — `{left, top, width, height}`; written exclusively by `background.js` (DI-002); `notepad.js` must NOT write this key.
  3. `Storage.loadDocument()` must call `undoStack.reset()` after setting editor value to prevent Ctrl+Z crossing document boundaries (BR-019).
  4. Call `Storage.saveDocument()` in the Ctrl+S keyboard handler (DI-005, step 7).
  5. Call `Storage.openDocument()` in the MENUS `file` Open action (DI-007, step 1).
  6. Call `Storage.loadWindowState()` then `Storage.loadLastDocument()` in DOMContentLoaded (DI-005, step 11).
  7. `listDocuments()` uses `chrome.storage.local.get(null)` to retrieve all keys at once — this is the only safe approach when document key names are not known in advance.
- SKILLSET REQUIRED
  Chrome Extension `chrome.storage.local` API, async/await, JavaScript module pattern, key-prefix filtering.
- NOTES
  Do NOT use `localStorage` — it is available in extension pages but not in service workers and would create an inconsistency. `chrome.storage.local.get(null)` returns all stored keys as a plain object; bracket notation (`result['doc_' + key]`) is required because key names are dynamic. `window.prompt()` for the Open dialog is acceptable for MVP. The `lastFile` key is the mechanism for BR-017 (auto-load on open); without it, reopening Notepad always starts blank. `Storage.openDocument()` must include the dirty-state guard (BR-025) before overwriting the current document.
- RELATED
  BR-014, BR-015, BR-017, BR-018, BR-019, BR-026, AR-006, PT-010 | UC-003, UC-004, UC-008
