RELEASE-NOTES:
- Version ID: v0.0.6-uc007-uc008-pipeline-close-2026-04-01
- Summary of features implemented:
  - Implemented UC-007 autosave and restore pipeline with 3-second debounce, snapshot persistence in chrome.storage.local, and startup state restoration (content/title/cursor/word wrap).
  - Added autosave status indicator and near-quota warning path for large snapshots.
  - Implemented UC-008 exit workflows via File->Exit and title-bar close button with custom Yes/No/Cancel unsaved-changes dialog.
  - Added beforeunload safety prompt for dirty documents and snapshot persistence on close transitions.
  - Updated extension package version to 0.0.6.

Implementation status:
1. Stage 5 implementation gate is PASS for this run: UC-001 through UC-008 are implemented in ./src/extension.
2. No automated unit or integration test suite exists yet; verification is based on artifact inspection and manual runtime criteria.

Runtime caveats and implementation constraints:
1. Browser beforeunload prompts are browser-controlled and may not exactly match desktop Notepad visuals.
2. Storage warning is estimate-based and final quota behavior depends on browser internals.

RELEASE-NOTES:
- Version ID: v0.0.5-uc004-uc005-file-io-slice-2026-04-01
- Summary of features implemented:
  - Implemented UC-004 Save and Save As workflows in File menu and keyboard shortcuts (Ctrl+S and Ctrl+Shift+S).
  - Added UTF-8 plain-text download pipeline with filename tracking and title updates after save.
  - Implemented UC-005 Open workflow via hidden file picker and Ctrl+O shortcut with 10 MB size guard.
  - Added unsaved-change confirmation before destructive actions (new/open) and updated extension version to 0.0.5.

Implementation status:
1. Stage 5 implementation gate is PARTIAL for this run: UC-001 through UC-006 are implemented; UC-007 and UC-008 remain pending.
2. No automated unit or integration test suite exists yet; verification is based on artifact inspection and manual runtime criteria.

Runtime caveats and implementation constraints:
1. Save/Save As uses browser download behavior and may vary based on user download settings.
2. Open currently loads plain-text files and does not include advanced encoding negotiation beyond browser text decoding defaults.

RELEASE-NOTES:
- Version ID: v0.0.4-uc006-find-replace-slice-2026-04-01
- Summary of features implemented:
  - Implemented UC-006 find/replace dialog in the Notepad window as a non-blocking in-app panel.
  - Added Edit menu entries and keyboard shortcuts for Find (Ctrl+F) and Replace (Ctrl+H).
  - Implemented Find Next, Replace, and Replace All operations with Match case and Wrap around options.
  - Updated extension package version to 0.0.4.

Implementation status:
1. Stage 5 implementation gate is PARTIAL for this run: UC-001 through UC-003 and UC-006 are implemented; UC-004, UC-005, UC-007, and UC-008 remain pending.
2. No automated unit or integration test suite exists yet; verification is based on artifact inspection and manual runtime criteria.

Runtime caveats and implementation constraints:
1. Replace operations currently target plain-text behavior in textarea and rely on browser selection APIs.
2. Save/open/autosave/close-confirmation workflows are still pending.

RELEASE-NOTES:
- Version ID: v0.0.3-uc002-uc003-editing-slice-2026-03-31
- Summary of features implemented:
  - Implemented UC-002 new-document workflow in Notepad window with dirty-state tracking, unsaved-change confirmation, and title reset to Untitled - Notepad.
  - Implemented UC-003 command routing in File/Edit/Format menus for undo, redo, cut, copy, paste, delete, select all, and time/date insertion.
  - Added keyboard support for Ctrl+N and F5 and wired word-wrap toggle with visible On/Off state.
  - Updated extension package version to 0.0.3.

Implementation status:
1. Stage 5 implementation gate is PARTIAL for this run: UC-001 through UC-003 are implemented; UC-004 through UC-008 remain pending.
2. No automated unit or integration test suite exists yet; verification is based on artifact inspection and manual runtime criteria.

Runtime caveats and implementation constraints:
1. Undo/redo behavior relies on browser textarea command support; deep-stack parity with desktop Notepad needs runtime validation.
2. Save/open/find/replace/autosave/close-confirmation features are still pending.

RELEASE-NOTES:
- Version ID: v0.0.2-uc001-launch-shell-2026-03-31
- Summary of features implemented:
  - Implemented UC-001 launcher slice in ./src/extension with MV3 manifest, background service worker, and keyboard command Ctrl+Shift+N.
  - Added Notepad-like runtime window shell in window.html/window.css/window.js including title bar, menu bar, editor area, and status bar.
  - Added single-window focus behavior so repeated launch actions focus the existing Notepad window instead of opening duplicates.
  - Deployed pnp icon from shared repository resources into src/extension/pnp.png for header branding.

Implementation status:
1. Stage 5 implementation gate is PARTIAL for this run: UC-001 is implemented; UC-002 through UC-008 remain pending.
2. No automated unit or integration test suite exists yet; verification is based on artifact inspection and manual runtime criteria.

Runtime caveats and implementation constraints:
1. Current implementation covers only UC-001 launch and UI shell behavior.
2. File, edit, save/open, find/replace, autosave, and close-confirmation workflows are not implemented yet.

RELEASE-NOTES:
- Version ID: v0.0.1-pipeline-baseline-2026-03-31
- Summary of features implemented:
  - Pipeline baseline artifacts generated for Stages 2-4 from Stage 1 use cases.
  - No executable Notepad implementation is currently present in ./src.

Implementation status:
1. Stage 5 implementation gate is FAIL for this run because ./src has no deliverables mapped to DESIGN IDs.
2. No build/test runtime command is available because there is no application code yet.

Runtime caveats and implementation constraints:
1. All use-case behavior remains design-only until Notepad extension code is added under ./src.
2. Verification evidence in Stage 6 is documentation-based and intentionally marked FAIL where runtime proof is required.
