# Architecture Recommendations — Notepad.exe

Derived from: `2-REQUIREMENTS.md`
Stage: 3 — Architect

---

## AR-001 : The extension shall be built as a Chrome Extension using Manifest V3.
- RATIONALE: Manifest V3 is the current and only supported manifest version for newly submitted Chrome extensions. It provides the `chrome.windows`, `chrome.storage`, and service-worker APIs required by this project. MV2 is deprecated and will not be accepted by the Chrome Web Store.
- NOTES None
- RELATED UC-001, UC-008, BR-001, BR-038

---

## AR-002 : A background service worker shall manage the Notepad window lifecycle (create, focus, and persist position/size).
- RATIONALE: The `background.js` service worker is the only persistent context that can call `chrome.windows.create`, track existing window IDs, and respond to the extension icon click via `chrome.action.onClicked`. This is the correct architecture for ensuring only one window exists at a time (BR-041) and for restoring window geometry from storage on re-open (BR-040).
- NOTES The service worker is event-driven and will be terminated by Chrome when idle. Window ID and geometry must be persisted via `chrome.storage.local`, not in-memory variables alone.
- RELATED UC-008, BR-038, BR-039, BR-040, BR-041, BR-042

---

## AR-003 : The Notepad UI shall be delivered as a standalone HTML page (`notepad.html`) opened via `chrome.windows.create`.
- RATIONALE: Using `chrome.windows.create` with a `url` pointing to the extension's `notepad.html` creates a detached Chrome window with native OS window controls (minimize, maximize, close). This is the architecturally correct method to achieve a desktop-style window (UC-008) within Chrome extension constraints.
- NOTES The window's `type` shall be set to `"popup"` to suppress tabs and the address bar, closely matching the Windows Notepad single-window aesthetic.
- RELATED UC-001, UC-008, BR-001, BR-038, BR-039

---

## AR-004 : The text editor area shall use an HTML `<textarea>` element as the editor surface.
- RATIONALE: A `<textarea>` natively supports all standard keyboard editing behaviors required by BR-012 (backspace, delete, arrow keys, select-all, tab), multi-line input (BR-010, BR-011), undo/redo, and clipboard operations. It avoids the complexity and inconsistency of `contenteditable`. It is the correct implementation for a plain-text editor.
- NOTES None
- RELATED UC-002, BR-010, BR-011, BR-012

---

## AR-005 : `chrome.storage.local` shall be used for all persistent note and window-geometry storage.
- RATIONALE: `chrome.storage.local` is the appropriate persistence layer for Chrome extensions. It is asynchronous, sandboxed to the extension, does not require a server (BR-021), and is accessible from both the service worker and the page context. `localStorage` is not accessible from the service worker context, making it unsuitable for window geometry persistence.
- NOTES Save/Load operations shall use the chrome.storage.local API exclusively. No `localStorage`, `IndexedDB`, or cookies shall be used.
- RELATED UC-003, UC-004, UC-008, BR-019, BR-020, BR-021, BR-023, BR-025, BR-040

---

## AR-006 : The File > Save As download shall be implemented using the HTML5 anchor-download pattern (Blob URL + `<a download>`).
- RATIONALE: Creating an object URL from a `Blob` and triggering a programmatic click on an `<a>` element with the `download` attribute is the standard, server-free approach for browser-initiated file downloads. It satisfies BR-030 through BR-034 without requiring the File System Access API (which requires an additional gesture) or any server dependency.
- NOTES None
- RELATED UC-006, BR-030, BR-031, BR-032, BR-033, BR-034

---

## AR-007 : The UI shall be built with vanilla JavaScript, HTML5, and CSS3 — no external frameworks or build tools.
- RATIONALE: The application is a single-window plain-text editor with no complex component lifecycle needs. Vanilla JS minimizes extension size, eliminates third-party supply-chain risk, and keeps the extension self-contained. A framework adds no functional advantage for this scope.
- NOTES No npm packages, bundlers, or external CDN resources shall be used. All assets are extension-local.
- RELATED UC-001 through UC-009, all BRs

---

## AR-008 : CSS shall faithfully replicate the Windows Notepad visual theme using system fonts and standard system colors.
- RATIONALE: Segoe UI (with fallback to system-ui, Arial) is the correct Windows system font (BR-008). Light background (#FFFFFF or system window color) with dark text (#000000) and a gray status bar replicates the Windows Notepad appearance (BR-018). CSS custom properties shall be used for theme colors to enable future theme extensions.
- NOTES Use `font-family: 'Segoe UI', system-ui, -apple-system, Arial, sans-serif` throughout.
- RELATED UC-001, UC-002, BR-008, BR-018

---

## AR-009 : A status bar DOM element shall be updated on every `input` and `selectionchange` event to reflect live document statistics.
- RATIONALE: The requirement for real-time updates (BR-017) is best satisfied by attaching an `input` event listener on the `<textarea>` (for character-count changes) and a `selectionchange` event (for cursor position changes). Computing line and column from `textarea.selectionStart` is O(n) in text length and sufficient for typical document sizes.
- NOTES Both `input` (fired on content change) and `selectionchange` (fired on cursor move) are needed. Arrow-key navigation fires `selectionchange` but not `input`.
- RELATED UC-002B, BR-013, BR-014, BR-015, BR-016, BR-017

---

## AR-010 : Confirmation prompts for destructive actions (New, Open with unsaved edits) shall use the native browser `window.confirm()` API.
- TESTABLE CONDITION: A modal browser confirm dialog appears when the user attempts File > New or File > Open with unsaved content.
- RATIONALE: `window.confirm()` is synchronous, universally supported in Chrome extension window contexts, requires no additional UI components, and satisfies the user-protection requirement (BR-027, BR-028). Custom styled dialogs are out of scope for this release.
- NOTES None
- RELATED UC-005, UC-007, BR-027, BR-028, BR-035, BR-036, BR-037

---

## AR-011 : The Help > View Help dialog shall be implemented as a custom HTML modal overlay within `notepad.html`.
- RATIONALE: A custom in-page modal (a `<div>` overlay with `position: fixed`) satisfies the Windows-dialog styling requirement (BR-046) and provides full control over content layout (shortcut table). `window.alert()` cannot display formatted tables. A separate `chrome.windows.create` for help would over-engineer a simple read-only shortcut list.
- NOTES The overlay shall trap keyboard focus and respond to the Escape key (BR-047).
- RELATED UC-009, BR-043, BR-044, BR-045, BR-046, BR-047
