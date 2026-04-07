# Architecture Recommendations

Generated from `2-REQUIREMENTS.md`. Owned by Architect.

---

## AR-001 : Use Chrome Extension Manifest V3 with a service worker background process
- RATIONALE
  Manifest V3 is the currently required and only supported manifest version for new Chrome extensions. MV3 replaces persistent background pages with event-driven service workers, which are the correct mechanism for managing the extension's window lifecycle, storage operations, and toolbar icon click handling. Building on MV3 ensures long-term platform support and compliance with Google's extension policies.
- NOTES
  Permissions required: ["storage", "windows"]. The service worker file is declared under "background.service_worker" in manifest.json. Service workers provide the event-driven model needed for detecting toolbar icon clicks and managing extension window lifecycle outside the browser's main tabs.
- RELATED BR-001 | UC-001

---

## AR-002 : Use chrome.storage.local for all persistent data
- RATIONALE
  chrome.storage.local is the correct persistence mechanism for MV3 extensions. It is accessible from both the service worker and extension pages, survives browser restarts and extension updates, and does not require the "unlimitedStorage" permission for note-sized payloads. localStorage is not available in service worker contexts and is therefore not a viable alternative. For this application, we persist two keys: the note content and window bounds.
- NOTES
  Keys used: 'noteContent' (string, the saved note text), 'windowBounds' (object: {left, top, width, height}). Default window bounds fallback: {left: 100, top: 100, width: 700, height: 500}. All persistence operations must complete synchronously or with promise-based callbacks to work reliably across service worker lifecycle events.
- RELATED BR-006, BR-007, BR-008, BR-009, BR-010, BR-018 | UC-003, UC-004, UC-008

---

## AR-003 : Use chrome.windows API to create and manage the detached Notepad window
- RATIONALE
  chrome.windows.create() opens a true OS-managed browser window with a native title bar, resize handles, and minimize/restore controls — meeting UC-008 requirements that a browser popup cannot satisfy. The API provides chrome.windows.onBoundsChanged for tracking position/size changes and chrome.windows.onRemoved for cleanup. The 'popup' window type suppresses the browser toolbar, creating a clean standalone experience. This satisfies the requirement for a true desktop-style window distinct from browser tabs.
- NOTES
  Window URL: chrome.runtime.getURL('notepad.html'). Window type: 'popup'. Track active windowId in the service worker's in-memory state and clear on onRemoved. The service worker must check for an open window on toolbar icon clicks to implement focus-instead-of-duplicate window behavior (BR-019).
- RELATED BR-001, BR-017, BR-018, BR-019 | UC-001, UC-008

---

## AR-004 : Implement all UI as a single HTML page (notepad.html) loaded as the window URL
- RATIONALE
  A single extension page eliminates cross-context complexity, maintains full DOM state across the window's lifetime, and mirrors the architecture of a native single-window application like Notepad. The page is served directly from the extension package with no network dependency, ensuring reliability and offline operation.
- NOTES
  Window URL is resolved with chrome.runtime.getURL('notepad.html') in the service worker. The title bar, menu bar, editor textarea, status bar, and help dialog are all within this one page. All styling and script imports are relative to the HTML file location.
- RELATED BR-003, BR-004, BR-005 | UC-001, UC-002

---

## AR-005 : Use vanilla JavaScript with no external frameworks or build toolchain
- RATIONALE
  The feature scope (text editing, storage, one dialog, keyboard shortcuts, one file download) is well within the capability of native DOM APIs. Avoiding frameworks eliminates a build step, reduces the attack surface, simplifies the extension package, and removes dependency on npm/node. All events are wired with addEventListener; no virtual DOM or reactive state layer is needed. This approach maximizes compatibility with the extension environment.
- NOTES
  Use ES6+ syntax (arrow functions, const/let, template literals). Event listeners are attached in DOMContentLoaded. State is stored in plain JavaScript variables (isDirty, windowId, menus). No build tooling required; files are loaded directly as scripts.
- RELATED BR-003, BR-004, BR-005, BR-008, BR-009, BR-010, BR-011, BR-012, BR-013, BR-014, BR-020, BR-021, BR-022 | UC-002, UC-005, UC-007, UC-009

---

## AR-006 : Use Blob and URL.createObjectURL for client-side file download
- RATIONALE
  Creating a Blob from the editor content and triggering a synthetic anchor click with a blob URL produces a client-side download without any server dependency, file system permission, or third-party library. The 'download' attribute on the anchor element sets the default filename. The blob URL must be revoked after use to release memory. This approach is fully compliant with the extension's security model.
- NOTES
  Use new Blob([content], {type: 'text/plain'}) and set anchor.download = 'note.txt'. Call URL.revokeObjectURL() immediately after anchor.click() to prevent memory leaks. The downloaded file will have the exact content from the textarea at the moment of download.
- RELATED BR-015, BR-016 | UC-006

---

## AR-007 : Use CSS custom properties and box-shadow borders to reproduce the Windows 95 visual theme
- RATIONALE
  The Win95 aesthetic requires beveled (3D) borders — white/light highlight on top-left edges and dark gray shadow on bottom-right edges. CSS box-shadow achieves this without images or external assets. CSS custom properties (--win95-silver, --win95-navy, etc.) centralize the palette and make the theme maintainable. Courier New is the period-appropriate monospace font for the editor. No external assets or web fonts are required.
- NOTES
  Title bar: navy background (#000080), white text. Window/chrome background: #c0c0c0 (silver). Beveled outset border pattern: box-shadow: inset -1px -1px #808080, inset 1px 1px #fff. All colors are CSS custom properties defined on :root for consistency. System fonts only; no network requests.
- RELATED BR-002 | UC-001

---

## AR-008 : Use the HTML dialog element for the Help modal
- RATIONALE
  The native <dialog> element provides built-in modal semantics, focus trapping, and Escape key dismissal via the 'cancel' event — all without additional JavaScript. It is supported in all modern Chromium versions used by Chrome extensions. It eliminates the need for custom overlay/z-index management and provides accessible keyboard interactions out of the box.
- NOTES
  Open with dialog.showModal(). Wire a Close button to dialog.close(). Add an event listener for 'cancel' to ensure focus returns to the editor after Escape. The dialog should contain a table of shortcuts with columns for key combination and action description.
- RELATED BR-020, BR-021, BR-022 | UC-009
