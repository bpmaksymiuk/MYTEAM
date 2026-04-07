# Architecture Recommendations

Generated from `2-REQUIREMENTS.md`. Owned by Architect.

---

## AR-001 : Use Chrome Extension Manifest V3 with a service worker background process
- RATIONALE
  Manifest V3 is the only currently supported manifest version for new Chrome extensions. MV3 replaces persistent background pages with event-driven service workers, which are the correct mechanism for handling toolbar icon clicks, managing the window lifecycle, and accessing chrome.storage from outside the UI page. Building on MV3 ensures long-term platform support and compliance with Google's extension policies.
- NOTES
  Required permissions: ["storage", "windows"]. Service worker declared under "background.service_worker": "background.js" in manifest.json. action: {} with no default popup — all toolbar clicks are routed to the service worker via chrome.action.onClicked.
- RELATED BR-001, BR-027 | UC-001, UC-008

---

## AR-002 : Use chrome.windows API to open and manage the detached standalone window (single instance)
- RATIONALE
  chrome.windows.create() with type:'popup' opens a detached OS-level window that is independent of browser tabs and has no address bar or tab strip. Clicking the icon when a window already exists calls chrome.windows.update() with {focused:true} to bring it to the front rather than opening a duplicate. The service worker stores the active window ID and validates it with chrome.windows.get() before each use.
- NOTES
  Window type 'popup' produces a clean standalone window matching Windows Notepad's appearance. Window bounds (left, top, width, height) from chrome.storage.local are passed to chrome.windows.create() to restore the saved position. chrome.windows.onRemoved listener clears the stored ID when the user closes the window.
- RELATED BR-001, BR-026, BR-027 | UC-001, UC-008

---

## AR-003 : Replicate Windows Notepad visual style using HTML and CSS (Segoe UI, light gray menus, white editor, gray status bar)
- RATIONALE
  The Windows Notepad UI must be reproduced in HTML and CSS without any OS-native API. Fonts (Segoe UI, system-ui fallback), colors (light gray #f0f0f0 menu bar, white #ffffff editor background, black text, gray status bar), spacing, and proportions are controlled entirely through CSS. This approach is dependency-free, loads instantly, and allows pixel-precise control of the visual layout.
- NOTES
  CSS custom properties centralize all theme tokens (colors, font stacks, spacing). Menu bar uses display:flex with button items. Status bar uses display:flex with four labeled sections (Encoding, Ln, Col, Chr). No CSS framework or preprocessor required.
- RELATED BR-002, BR-003, BR-005, BR-006 | UC-001, UC-002, UC-002B

---

## AR-004 : Use `<textarea>` as the plain text editor element
- RATIONALE
  The HTML `<textarea>` element provides all required editing behavior natively: multi-line input, cursor navigation (Home, End, Page Up, Page Down, arrow keys), text selection, scrollbar, and clipboard operations (Ctrl+X/C/V). The selectionStart and selectionEnd properties give precise cursor position data needed for the status bar. No custom editor or rich-text library is required for plain-text editing.
- NOTES
  spellcheck="false" suppresses browser spell-check underlines. Tab-key behavior is overridden with a keydown handler to insert \t instead of moving focus. Word wrap is toggled via the CSS white-space attribute or the textarea wrap attribute. Dirty-state is tracked via the 'input' event.
- RELATED BR-004, BR-007, BR-009, BR-016, BR-019 | UC-002

---

## AR-005 : Implement in-memory undo stack as a custom JavaScript array (not browser execCommand)
- RATIONALE
  document.execCommand('undo') is deprecated in Manifest V3 extension pages and provides no programmatic control over history granularity or reset. A custom undo stack implemented as a JavaScript array of full textarea value snapshots provides complete control: push on input (debounced), pop on Ctrl+Z, and explicit reset on File > New or File > Open. This satisfies BR-008 and the post-load undo reset required by BR-019.
- NOTES
  Stack entries are complete textarea.value strings. Debounce interval ~300 ms prevents a snapshot on every individual keystroke. Stack depth is capped (e.g., 200 entries) to bound memory consumption. Redo is not required by any BR and is not implemented.
- RELATED BR-008, BR-019 | UC-002

---

## AR-006 : Use chrome.storage.local for document persistence and window state
- RATIONALE
  chrome.storage.local persists data across sessions with no server and no expiration. It is accessible from both the extension page and the service worker (unlike localStorage, which is unavailable in service workers). It provides the async API needed for saving named documents, listing saved documents for File > Open, auto-loading on window open, and persisting window bounds.
- NOTES
  Key schema: "doc_<filename>" for document text content (string), "windowState" for {left, top, width, height}. chrome.storage.local.get(null) retrieves all keys for the Open file list display. Storage limit is 10 MB per extension (sufficient for text documents). All calls use async/await.
- RELATED BR-014, BR-015, BR-017, BR-018, BR-026 | UC-003, UC-004, UC-008

---

## AR-007 : Use Blob API and URL.createObjectURL for client-side file download
- RATIONALE
  Creating a Blob from the textarea content and triggering a synthetic anchor click with a blob URL produces a file download with no server dependency, no file system permissions, and no external library. The 'download' attribute on the anchor element sets the suggested filename. This is the standard browser pattern for client-side plain-text export.
- NOTES
  new Blob([textarea.value], {type:'text/plain'}). Anchor download attribute: 'Untitled.txt' for unnamed documents or the current filename for named ones. URL.revokeObjectURL() is called immediately after a.click() to prevent memory leaks. No BOM is added; line endings are preserved exactly from the textarea.
- RELATED BR-023, BR-024 | UC-006

---

## AR-008 : Implement the dropdown menu system in pure HTML, CSS, and JavaScript (no framework)
- RATIONALE
  A lightweight custom dropdown menu system avoids any external dependency and keeps the extension package minimal. Each menu (File, Edit, View, Help) is a button that toggles a positioned panel populated from a central JavaScript data structure. The same structure contains shortcut labels, forming a single source of truth used by both the menu display and the Help dialog (BR-029).
- NOTES
  Menu items are defined as a JS array of objects: {label, shortcut, handler, separator?}. Panels are shown or hidden via CSS display toggling. Clicking outside the open menu or pressing Escape closes it. Shortcut label strings in the data structure are displayed in the menu column and are reused verbatim in the Help shortcuts table.
- RELATED BR-003, BR-029 | UC-001, UC-009

---

## AR-009 : Implement real-time status bar updates via textarea input, keyup, and click event listeners
- RATIONALE
  The status bar must reflect cursor position and document length synchronously with every keystroke and cursor movement. Attaching 'input', 'keyup', and 'click' event listeners to the textarea element and recomputing line number, column, and character count from selectionStart on each event provides reliable real-time updates without polling or timers.
- NOTES
  Line number: count '\n' characters in value.substring(0, selectionStart) + 1. Column: selectionStart minus the index of the last '\n' before the cursor. Character count: value.length. Encoding: static "UTF-8" string. All four values are written to the status bar DOM in one shared update function called from all three listeners.
- RELATED BR-010, BR-011, BR-012, BR-013, BR-022 | UC-002B

---

## AR-010 : Use the HTML `<dialog>` element for Help, Find, and confirmation modal dialogs
- RATIONALE
  The HTML `<dialog>` element provides accessible modal overlay behavior with showModal(), native focus trapping, Escape-key dismissal, and ::backdrop pseudo-element for dimming — all without any modal library. This pattern covers the Help keyboard shortcuts dialog (BR-028), the Find dialog (BR-030), and the unsaved-changes confirmation prompt (BR-025). The browser manages keyboard accessibility automatically.
- NOTES
  dialog.showModal() blocks background interaction. dialog.close() is triggered by the close button or Escape key (native behavior). The Find dialog uses dialog.show() for non-blocking operation. window.confirm() may be used for simple yes/no confirmation prompts (BR-025) where native OS styling is acceptable without additional markup.
- RELATED BR-025, BR-028, BR-029, BR-030 | UC-007, UC-009

---

## AR-011 : Service worker (background.js) handles all window lifecycle events
- RATIONALE
  The service worker is the only execution context available for chrome.action.onClicked and off-page window management in MV3. It creates the window on first click, focuses it on subsequent clicks, reads saved window bounds from storage and passes them to chrome.windows.create(), writes updated bounds on resize/move, and clears the stored ID on chrome.windows.onRemoved. No DOM manipulation happens in the service worker — all UI logic lives in notepad.js.
- NOTES
  MV3 service workers are non-persistent and may be terminated between events. The stored windowId must be validated with chrome.windows.get() each time before use; if the call rejects, the window no longer exists and a new one should be created. Default window dimensions: 800 × 600 px.
- RELATED BR-001, BR-026, BR-027 | UC-001, UC-008

---
