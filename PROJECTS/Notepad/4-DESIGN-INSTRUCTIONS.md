DI-001 : Scaffold Stage 5 build extension package
- SUMMARY
  1. Create the required extension artifact structure under ./build/extension.
- IMPLEMENTATION STEPS
  1. Create directory ./build/extension.
  2. Create initial runtime files: manifest.json, background.js, popup.html, popup.css, popup.js.
  3. Ensure all runtime references (script and stylesheet paths) are relative and valid.
- SKILLSET REQUIRED
  1. File-system operations and Chrome extension packaging.
- NOTES
  1. This DI establishes the baseline for all subsequent DIs.
- RELATED UC-001, BR-001, AR-012

DI-002 : Configure manifest for detached-window MV3 runtime
- SUMMARY
  1. Define MV3 manifest with service worker and necessary permissions for storage and window management.
- IMPLEMENTATION STEPS
  1. Set manifest_version to 3 with name/version/description.
  2. Add permissions: storage, windows.
  3. Configure background.service_worker = background.js.
  4. Configure action with default_title only (no default_popup).
- SKILLSET REQUIRED
  1. Chrome extension manifest schema expertise.
- NOTES
  1. Omitting default_popup is required for action click handling in service worker.
- RELATED UC-008, BR-015, BR-016, AR-001, AR-002

DI-003 : Implement background window lifecycle controller
- SUMMARY
  1. Implement action-click behavior to open or focus a single detached Notepad window.
- IMPLEMENTATION STEPS
  1. In background.js, define keys for notepad URL and persisted window state.
  2. On chrome.action.onClicked, load stored state.
  3. If windowId exists and is live, focus it and return.
  4. Otherwise create chrome.windows.create({ type: "popup", url: popup.html, focused: true, width, height, left, top }).
  5. Persist created windowId.
- SKILLSET REQUIRED
  1. MV3 service worker and chrome.windows API integration.
- NOTES
  1. Handle stale IDs using try/catch around chrome.windows.get.
- RELATED UC-008, BR-016, BR-017, AR-003, AR-004

DI-004 : Persist and replay detached window geometry
- SUMMARY
  1. Capture and restore Notepad window bounds between sessions.
- IMPLEMENTATION STEPS
  1. Register chrome.windows.onBoundsChanged in background.js.
  2. If changed window matches tracked windowId, persist width/height/left/top.
  3. On create path, replay valid persisted geometry and apply defaults when values are absent.
  4. Register chrome.windows.onRemoved to clear stale windowId.
- SKILLSET REQUIRED
  1. Browser window lifecycle and defensive data handling.
- NOTES
  1. Keep geometry and windowId in a shared storage object.
- RELATED UC-008, BR-017, AR-004

DI-005 : Build popup UI shell and retro layout
- SUMMARY
  1. Create Notepad-like UI structure with title bar, menus, editor, statusbar, and dialogs.
- IMPLEMENTATION STEPS
  1. In popup.html, add window container with title text, menu buttons (File/Edit/Format/View/Help), editor textarea, and status fields.
  2. Add find/replace dialog and save-confirmation dialog.
  3. Add help dialog with keyboard-shortcuts table.
- SKILLSET REQUIRED
  1. HTML semantics and accessibility-aware markup.
- NOTES
  1. Use stable IDs for all interactive elements.
- RELATED UC-001, UC-009, BR-002, BR-019, BR-020, BR-021, AR-005, AR-011

DI-006 : Implement popup style system including shortcuts dialog table
- SUMMARY
  1. Apply retro visual treatment and responsive behavior for editor and dialogs.
- IMPLEMENTATION STEPS
  1. In popup.css, define color tokens, window chrome, menubar, editor, and statusbar styles.
  2. Add .dialog styles and shortcuts table styles for help dialog readability.
  3. Ensure layout scales when detached window is resized.
- SKILLSET REQUIRED
  1. CSS layout and component styling.
- NOTES
  1. Preserve text legibility and keyboard-focus visibility.
- RELATED UC-001, UC-008, UC-009, BR-002, BR-018, AR-005, AR-011

DI-007 : Implement editor state model, rendering, and persistence hooks
- SUMMARY
  1. Implement centralized editor state with UI render helpers and storage integration.
- IMPLEMENTATION STEPS
  1. In popup.js, define state fields for title, content, dirty, wrap, savedName, cursorStart, cursorEnd, lastFindIndex.
  2. Implement render helpers for title, save status, and cursor status.
  3. Implement persist/restore functions against chrome.storage.local notepadState.
  4. Schedule persistence on state-changing actions and before unload.
- SKILLSET REQUIRED
  1. Vanilla JavaScript state orchestration.
- NOTES
  1. Clamp cursor values on restore.
- RELATED UC-002, UC-003, UC-004, BR-004, BR-005, BR-006, BR-007, BR-013, AR-006, AR-007

DI-008 : Implement destructive-flow safeguards and command handlers
- SUMMARY
  1. Implement shared unsaved confirmation and route New/Open/Close through it.
- IMPLEMENTATION STEPS
  1. Implement promptUnsavedIfNeeded() returning save/discard/cancel.
  2. Integrate it into New action.
  3. Integrate it into Open action prior to replacing content.
  4. Integrate it into Close action for detached window exit.
- SKILLSET REQUIRED
  1. Async UI workflow and event handling.
- NOTES
  1. Cancel path must preserve document state exactly.
- RELATED UC-005, UC-007, BR-008, BR-009, BR-010, BR-014, AR-008

DI-009 : Implement find/replace, keyboard shortcuts, and Help dialog behavior
- SUMMARY
  1. Implement find/replace operations, keyboard mappings, and Help menu dialog launch.
- IMPLEMENTATION STEPS
  1. Add find-next, replace-one, replace-all handlers.
  2. Add keyboard handlers for Ctrl+N, Ctrl+O, Ctrl+S, Ctrl+F, Ctrl+H, Ctrl+A, Ctrl+Y, and F5.
  3. Wire Help menu to open the help dialog (not alert).
  4. Keep displayed shortcuts synchronized with handler logic.
- SKILLSET REQUIRED
  1. DOM event dispatch and text manipulation.
- NOTES
  1. Ensure editor focus is restored after modal interactions where appropriate.
- RELATED UC-002, UC-009, BR-003, BR-018, BR-019, BR-020, BR-021, AR-009, AR-011

DI-010 : Implement save/download flows and produce Stage 5 release notes
- SUMMARY
  1. Implement Save/Save As export behavior and document implementation traceability.
- IMPLEMENTATION STEPS
  1. Implement save behavior using prior filename or Save As prompt.
  2. Implement Save As filename prompt and .txt normalization.
  3. Export using Blob/object URL/anchor click and clear dirty state on success.
  4. Create 5-IMPLEMENTATION-RELEASE-NOTES.md with version ID, DI coverage, and touched files.
- SKILLSET REQUIRED
  1. Browser file APIs and technical release documentation.
- NOTES
  1. Preserve historical records by prepending new release entries.
- RELATED UC-006, BR-011, BR-012, AR-010, AR-012