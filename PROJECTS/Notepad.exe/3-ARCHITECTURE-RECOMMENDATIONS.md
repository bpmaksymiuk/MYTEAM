# Architecture Recommendations — Notepad.exe

## AR-001 : Use Chrome Extension Manifest V3 with service worker and chrome.windows API
- RATIONALE: Notepad.exe must open as a detached standalone window (BR-049) and enforce single-instance behavior (BR-052). Manifest V3 is the current Chrome extension standard; it provides `chrome.windows.create` for detached windows and a service worker background script for persistent window-lifecycle tracking. Alternatives (popup, sidebar, tab) do not satisfy BR-050 (window survives tab navigation). MV2 is deprecated.
- NOTES: Requires `permissions: ["storage", "windows"]` in manifest.json. Service worker replaces the MV2 background page.
- RELATED: BR-001, BR-003, BR-049, BR-050, BR-051, BR-052, BR-053 | UC-001, UC-008

---

## AR-002 : Use chrome.storage.local for window state persistence (position and size)
- RATIONALE: BR-051 requires window position and size to persist between sessions. `chrome.storage.local` is accessible from both the service worker and the extension page, survives browser restarts, and has a generous quota. `localStorage` is not accessible from a service worker context, making it unsuitable for window state managed in background.js.
- NOTES: Keys: `windowId`, `windowBounds` (top, left, width, height). Read on `chrome.windows.create`, write on `chrome.windows.onBoundsChanged`.
- RELATED: BR-051 | UC-008

---

## AR-003 : Use localStorage for note content persistence
- RATIONALE: BR-025, BR-026, BR-029, BR-060, BR-061 require client-side-only note persistence accessible from the extension page (app.js). `localStorage` is synchronous, zero-latency, and available in the extension page DOM context. No server dependency. `chrome.storage.local` would also work but adds async complexity unnecessary for simple text storage.
- NOTES: Key scheme: `notepad_content` for body text, `notepad_filename` for current file name. Max localStorage quota ~5MB — sufficient for plain text notes.
- RELATED: BR-025, BR-026, BR-027, BR-028, BR-029, BR-031, BR-033, BR-034, BR-060, BR-061 | UC-003, UC-004

---

## AR-004 : Use single-instance window enforcement via chrome.storage.session and window focus
- RATIONALE: BR-052 requires that clicking the extension icon when a window already exists focuses it rather than opening a second. `chrome.storage.session` (MV3) stores the current window ID in the service worker across icon clicks. If the stored window ID resolves to a live window, call `chrome.windows.update` to focus it; otherwise create a new window.
- NOTES: `chrome.storage.session` is cleared on browser restart, which is correct — a new window should be created after restart.
- RELATED: BR-052 | UC-008

---

## AR-005 : Use a <textarea> element as the editor (not contenteditable)
- RATIONALE: BR-014–BR-018 require standard keyboard editing; BR-019–BR-023 require cursor position tracking via `selectionStart`/`selectionEnd`. `<textarea>` provides these natively and predictably. `contenteditable` requires complex cursor position math, introduces HTML injection risk, and produces inconsistent behavior across browsers. `<textarea>` is the correct choice for a plain-text editor.
- NOTES: Set `wrap="off"` by default (Word Wrap off); toggle to `wrap="soft"` for Word Wrap on (BR-007).
- RELATED: BR-005, BR-006, BR-007, BR-008, BR-009, BR-013, BR-014, BR-015, BR-016, BR-017, BR-018, BR-019, BR-020, BR-021, BR-022, BR-023, BR-032 | UC-002, UC-002B

---

## AR-006 : Use vanilla HTML/CSS/JavaScript with no build step or framework
- RATIONALE: The application is a self-contained Chrome extension page. No server, no bundler, no npm runtime dependency. Vanilla JS minimises attack surface, eliminates supply-chain risk, and produces files the Developer can edit directly. React/Vue/etc. would add complexity with no benefit for a single-page, single-user local app.
- NOTES: ES6+ features (const/let, arrow functions, template literals, modules via `<script type="module">`) are fine — Chrome is always up to date.
- RELATED: BR-029, BR-041, BR-060 | UC-001, UC-008

---

## AR-007 : Use CSS custom properties for Windows Notepad visual theme
- RATIONALE: BR-011, BR-012, BR-024, BR-057 require Windows Notepad appearance (Segoe UI font, light background, gray chrome, dark text). CSS custom properties (`--color-bg`, `--color-chrome`, `--font-ui`, etc.) centralise the theme so all components derive from a single source of truth. This makes it easy to match Windows system appearance without per-element overrides.
- NOTES: Font stack: `'Segoe UI', Tahoma, Geneva, Verdana, sans-serif`. Background: `#FFFFFF`. Chrome: `#F0F0F0`. Border: `#CCCCCC`.
- RELATED: BR-002, BR-011, BR-012, BR-024, BR-057 | UC-001, UC-002, UC-002B, UC-009

---

## AR-008 : Use Blob + URL.createObjectURL + programmatic anchor click for file download
- RATIONALE: BR-041–BR-045 require a client-side file download as plain UTF-8 text with no server dependency. `new Blob([content], {type:'text/plain;charset=utf-8'})` + `URL.createObjectURL` + a hidden `<a download="filename.txt">` click is the standard, universally supported browser pattern. `window.showSaveFilePicker` (File System Access API) is not available in extension pages.
- NOTES: Revoke the object URL immediately after click (`URL.revokeObjectURL`) to avoid memory leaks.
- RELATED: BR-041, BR-042, BR-043, BR-044, BR-045 | UC-006

---

## AR-009 : Use textarea input/click/keyup events + selectionStart for real-time status bar
- RATIONALE: BR-019–BR-023 require live line number, column, and character count. Listening to `input`, `click`, and `keyup` events on the textarea and computing position from `selectionStart` + substring line counting is the standard approach. No library needed. Updates synchronously within the same event loop tick, satisfying BR-023's real-time requirement.
- NOTES: Line number = count of `\n` chars before `selectionStart` + 1. Column = `selectionStart` − last `\n` index before cursor + 1. Char count = `textarea.value.length`.
- RELATED: BR-019, BR-020, BR-021, BR-022, BR-023, BR-024 | UC-002B

---

## AR-010 : Use a dirty-flag boolean for unsaved-change detection
- RATIONALE: BR-036, BR-037, BR-038, BR-046, BR-047, BR-048 require detecting unsaved changes before destructive actions (New, Open). A simple `isDirty` boolean set on `input` events and cleared on Save is the minimal, reliable implementation. Native `beforeunload` cannot intercept Chrome window close in an extension context (documented in UC-007 IMPLEMENTATION COMMENT).
- NOTES: `isDirty = false` on: initial load, after Save, after New (confirmed), after Load. `isDirty = true` on: any `input` event in the textarea.
- RELATED: BR-036, BR-037, BR-038, BR-039, BR-040, BR-046, BR-047, BR-048 | UC-005, UC-007

---

## AR-011 : Use in-page DOM modal overlays for all dialogs (unsaved-change prompt, open picker, help)
- RATIONALE: BR-037, BR-047, BR-054–BR-059 require Windows-styled modal dialogs. Native `window.confirm` / `window.alert` cannot be styled and appear outside the extension window. In-page `<div>` overlays with a semi-transparent backdrop give full CSS control, matching Windows dialog appearance (BR-057). They also support Escape-key dismissal (BR-059) and Close button (BR-058).
- NOTES: Dialog z-index must be above all other elements. Trap focus within dialog while open (accessibility). Dismiss on Escape keydown event.
- RELATED: BR-030, BR-037, BR-047, BR-054, BR-055, BR-056, BR-057, BR-058, BR-059 | UC-004, UC-005, UC-007, UC-009

---

## AR-012 : Use Playwright 1.59.1 at /tmp/node_modules/playwright/index.mjs for test automation
- RATIONALE: Workspace standard for all pipeline test scripts. Run with `DISPLAY=:0`, `headless: false` per pipeline rules. Serves `./build/extension` via `python3 -m http.server` for HTTP-context testing. Chrome extension APIs that require real install are marked PARTIAL.
- NOTES: Install if absent: `cd /tmp && npm install playwright@1.59.1`. Script saved to `PROJECTS/Notepad.exe/notepad_test_pipeline001.mjs`.
- RELATED: BR-001, BR-004, BR-005, BR-009, BR-010, BR-014, BR-019, BR-025, BR-030, BR-035, BR-041, BR-049, BR-054 | UC-001, UC-002, UC-002B, UC-003, UC-004, UC-005, UC-006, UC-008, UC-009

---
