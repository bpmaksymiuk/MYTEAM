PT-001 : manifest configuration
- DESCRIPTION
  1. MV3 manifest metadata, permissions, action configuration, and background service worker declaration.
- TECHNOLOGY RECOMMENDATIONS
  1. manifest_version 3; permissions include storage and windows; background service_worker set.
- NOTES
  1. Do not define default_popup when action click is handled by background.
- RELATED UC-001, UC-008, BR-001, BR-015, AR-001, AR-002

PT-002 : background window controller
- DESCRIPTION
  1. Service worker script managing action clicks, detached window creation, single-instance behavior, and geometry persistence.
- TECHNOLOGY RECOMMENDATIONS
  1. chrome.action.onClicked, chrome.windows.create/get/update/onRemoved/onBoundsChanged, chrome.storage.local.
- NOTES
  1. Persist window state under a stable storage key.
- RELATED UC-008, BR-016, BR-017, AR-003, AR-004

PT-003 : popup markup shell
- DESCRIPTION
  1. HTML scaffold for title bar, menu bar, editor, status bar, and dialogs.
- TECHNOLOGY RECOMMENDATIONS
  1. Semantic HTML with stable IDs and accessible labels.
- NOTES
  1. Include dialogs for find/replace, unsaved confirmation, and shortcuts help.
- RELATED UC-001, UC-009, BR-002, BR-019, BR-021, AR-005, AR-011

PT-004 : retro visual style system
- DESCRIPTION
  1. CSS rules implementing Windows-style chrome, editor look, statusbar, and dialog/table styles.
- TECHNOLOGY RECOMMENDATIONS
  1. Plain CSS variables and component classes without framework dependencies.
- NOTES
  1. Preserve readability at default window size and on resize.
- RELATED UC-001, BR-002, BR-018, AR-005

PT-005 : editor state and rendering controller
- DESCRIPTION
  1. JavaScript state object and render helpers for title, save status, cursor status, and wrapping.
- TECHNOLOGY RECOMMENDATIONS
  1. Module-scoped state with explicit update functions.
- NOTES
  1. Clamp cursor metadata during restore.
- RELATED UC-002, UC-003, UC-004, BR-004, BR-013, AR-006

PT-006 : persistence adapter
- DESCRIPTION
  1. Read/write routines for notepadState payload in chrome.storage.local.
- TECHNOLOGY RECOMMENDATIONS
  1. Async operations with safe defaults and error handling.
- NOTES
  1. Schedule persistence on input and state-affecting actions.
- RELATED UC-003, UC-004, BR-005, BR-007, AR-007

PT-007 : unsaved confirmation subsystem
- DESCRIPTION
  1. Reusable decision dialog and promise-based resolver for destructive actions.
- TECHNOLOGY RECOMMENDATIONS
  1. Shared prompt function returning save/discard/cancel.
- NOTES
  1. Integrate with New, Open, and Close.
- RELATED UC-005, UC-007, BR-008, BR-009, BR-010, BR-014, AR-008

PT-008 : find/replace and keyboard commands
- DESCRIPTION
  1. Dialog interactions plus keyboard shortcut handling mapped to editor actions.
- TECHNOLOGY RECOMMENDATIONS
  1. Explicit keymap checks for Ctrl+N/O/S/F/H/A/Y and F5.
- NOTES
  1. Keep Help shortcut table in sync with actual keymap.
- RELATED UC-002, UC-009, BR-003, BR-020, AR-009, AR-011

PT-009 : download/export subsystem
- DESCRIPTION
  1. Save/Save As behavior and file generation pipeline.
- TECHNOLOGY RECOMMENDATIONS
  1. Blob + URL.createObjectURL + anchor click; enforce .txt extension.
- NOTES
  1. Export content must remain exact.
- RELATED UC-006, BR-011, BR-012, AR-010

PT-010 : Stage 5 build package
- DESCRIPTION
  1. Runnable extension files generated under ./build/extension.
- TECHNOLOGY RECOMMENDATIONS
  1. Include manifest.json, background.js, popup.html, popup.css, popup.js.
- NOTES
  1. Release notes and test report must reference this package.
- RELATED UC-001, BR-001, BR-018, AR-012