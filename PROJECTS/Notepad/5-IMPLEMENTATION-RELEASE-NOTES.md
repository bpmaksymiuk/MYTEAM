RELEASE-NOTES:
- Version ID
  NP-REL-2026-04-03-003
- Summary of features implemented
  1. Rebuilt extension implementation from pipeline artifacts under ./build/extension.
  2. Implemented detached desktop-style Notepad window using MV3 service worker and chrome.windows APIs.
  3. Implemented single-instance window focus behavior and persisted window geometry restore.
  4. Implemented complete popup UI and editor flows: save/load/new, unsaved confirmation, find/replace, and text export.
  5. Implemented Help dialog listing active keyboard shortcuts.
- Notes
  1. Implemented DI scope for this run: DI-001 through DI-010.
  2. Files in ./build/extension:
     - manifest.json
     - background.js
     - popup.html
     - popup.css
     - popup.js
  3. Runtime caveat: verification in this run is source-level and artifact-based; no live browser E2E run was executed in chat context.
  4. Historical policy: future runs append new release-note entries above this record.