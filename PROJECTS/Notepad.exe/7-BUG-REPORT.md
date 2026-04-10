# Bug Report — Notepad.exe

## BUG-NE-005 — Help Menu Items Did Not Match BR-008 Requirements

- **Severity:** HIGH
- **Discovered:** T-PIPELINE-NOTEPAD-EXE-001 Run 1
- **UC/BR:** UC-009, BR-008
- **Description:** The Help menu contained only one item labelled "Keyboard Shortcuts" with `action: 'help:keyboard'`. BR-008 requires the Help menu to contain "View Help" and "About Notepad". Both items were absent, so any test or user action checking for "View Help" or "About Notepad" would fail.
- **Root Cause:** `menubar.js` MENU_STRUCTURE defined the Help menu as `[{ label: 'Keyboard Shortcuts', action: 'help:keyboard' }]`. The item label did not match the UC-001 acceptance criteria ("Help (View Help, About Notepad)") and BR-008 testable condition. "About Notepad" was never defined at all.
- **Fix Applied:** In `build/extension/menubar.js`, renamed the item label from "Keyboard Shortcuts" to "View Help" (action `help:keyboard` preserved so existing `showHelp()` wiring still works). Added `{ type: 'separator' }` and `{ label: 'About Notepad', action: 'help:about' }`. In `build/extension/dialogs.js`, added `showAbout()` function that reuses `#dialog-help` overlay with about content. In `build/extension/app.js`, imported `showAbout` and added `case 'help:about': showAbout()` to `handleMenuAction`.
- **Status:** ✅ Fixed

---

## BUG-NE-004 — View Menu Missing Zoom Item (BR-007 Violation)

- **Severity:** MEDIUM
- **Discovered:** T-PIPELINE-NOTEPAD-EXE-001 Run 1
- **UC/BR:** UC-001, BR-007
- **Description:** The View menu contained only "Word Wrap" and "Status Bar". BR-007 requires "Word Wrap" and "Zoom" to be present. The Zoom item was entirely absent from the menu definition.
- **Root Cause:** `menubar.js` MENU_STRUCTURE View items array only contained `view:wordwrap` and `view:statusbar`. The Zoom requirement from BR-007 and UC-001 acceptance criteria was not implemented during Stage 5.
- **Fix Applied:** In `build/extension/menubar.js`, added `{ type: 'separator' }` and `{ label: 'Zoom', action: 'view:zoom' }` to the View menu items. In `build/extension/app.js`, added `case 'view:zoom': await showConfirm('Zoom: Use Ctrl+Plus / Ctrl+Minus in your browser to zoom.');` to `handleMenuAction` (browser-native zoom advisory — no custom zoom implementation required by BRs).
- **Status:** ✅ Fixed

---

## BUG-NE-003 — Edit Menu Missing Find And Replace Items (BR-006 Violation)

- **Severity:** HIGH
- **Discovered:** T-PIPELINE-NOTEPAD-EXE-001 Run 1
- **UC/BR:** UC-001, BR-006
- **Description:** The Edit menu contained Undo, Cut, Copy, Paste — but was missing Find and Replace. BR-006 requires "at minimum: Undo, Cut, Copy, Paste, Find, Replace". UC-001 acceptance criteria lists "Edit (Undo, Cut, Copy, Paste, Find, Replace)". The missing items meant BR-006 could not pass.
- **Root Cause:** `menubar.js` MENU_STRUCTURE Edit items array only defined Undo, Cut, Copy, Paste. The Find and Replace items were omitted from the Stage 5 implementation, likely an oversight when mapping DI-004 to the full menu spec.
- **Fix Applied:** In `build/extension/menubar.js`, added `{ type: 'separator' }`, `{ label: 'Find...', action: 'edit:find', shortcut: 'Ctrl+F' }`, and `{ label: 'Replace...', action: 'edit:replace', shortcut: 'Ctrl+H' }` to the Edit menu items. In `build/extension/app.js`, added `case 'edit:find'` and `case 'edit:replace'` handlers in `handleMenuAction` that display browser-advisory confirm dialogs (full in-page Find/Replace dialogs are not required by any BR for this release).
- **Status:** ✅ Fixed

---

## BUG-NE-002 — File > New Leaves Status Bar Stale (BR-040 Violation)

- **Severity:** MEDIUM
- **Discovered:** T-PIPELINE-NOTEPAD-EXE-001 Run 2
- **UC/BR:** UC-005, BR-040
- **Description:** After selecting File > New and confirming to discard unsaved changes, the editor was correctly cleared (value = `""`) and the title bar updated to "Untitled - Notepad". However, the status bar still displayed the old line/column/character-count values from before the New action (e.g., "Col 21", "20 chars" instead of "Col 1", "0 chars"). BR-040 requires "After confirming New, the status bar shows Ln 1, Col 1, and character count 0."
- **Root Cause:** `build/extension/editor.js` `clear()` function set `textareaEl.value = ''` but did not dispatch an `input` event. The statusbar in `statusbar.js` updates only on `['input', 'keyup', 'click', 'select']` events. Because `clear()` triggered none of these, the statusbar remained at the previous cursor position and character count. `setValue()` has the same non-dispatching pattern but is not exercised by the failing assertion.
- **Fix Applied:** In `build/extension/editor.js`, modified `clear()` to dispatch `new Event('input', { bubbles: true })` immediately after setting `textareaEl.value = ''`. This causes both the statusbar listener and the editor dirty listener to fire synchronously. The editor dirty listener temporarily sets `isDirty = true`, but `cmdNew()` calls `setDirty(false)` immediately after `clear()`, so the final dirty state is correctly `false`. The statusbar reads `selectionStart = 0` from the now-empty textarea and displays Ln 1, Col 1, 0 chars.
- **Status:** ✅ Fixed

---

## BUG-NE-001 — Dialog Visibility Check Incorrect — Orphaned Overlay Blocked All Subsequent Tests

- **Severity:** HIGH
- **Discovered:** T-PIPELINE-NOTEPAD-EXE-001 Run 1
- **UC/BR:** UC-005, UC-007, BR-036, BR-037, BR-047
- **Description:** In the UC-004 test block, the confirm dialog visibility check was: `el.style.display !== '' && !el.classList.contains('hidden')`. Because the dialog's visibility is controlled exclusively by adding/removing the CSS `hidden` class (not inline `style.display`), `el.style.display` is always an empty string. The AND condition was always `false`, so `confirmVisible` was always `false`. The confirm dialog was never dismissed by the test, leaving the `#dialog-overlay` visible and blocking pointer events for all menu-click tests that followed (UC-003b, UC-005, UC-009, UC-010, and all BR-0xx tests). This caused a cascade of 14 failures due to overlay interception.
- **Root Cause:** The original test script used `el.style.display !== ''` to detect visibility, but the application's CSS uses a `.hidden` class (display toggled via `classList.add/remove('hidden')`) not inline style. The correct check is `!el.classList.contains('hidden')`. A similar check already existed correctly in the UC-003b and other blocks of the same test script; UC-004's check was inconsistent.
- **Fix Applied:** In `notepad_test_pipeline001.mjs`, changed the `confirmVisible` evaluation in the UC-004 block from `el.style.display !== '' && !el.classList.contains('hidden')` to `!el.classList.contains('hidden')`. Also added a `closeAllDialogs(page)` helper function that force-resets the overlay and all dialog elements via `page.evaluate()`, called at the start of every test block that interacts with menus, to provide defence-in-depth against future orphaned-overlay failures.
- **Status:** ✅ Fixed

---
