AR-001 : MV3 extension action routed through a background service worker.
- RATIONALE
  1. In MV3, service worker control over action clicks allows detached window launch and lifecycle management.
- NOTES
  1. Remove default popup entrypoint from action to ensure click events are handled in background.
- RELATED UC-001, UC-008, BR-001, BR-015

AR-002 : Detached Notepad window created using chrome.windows.create with popup type.
- RATIONALE
  1. chrome.windows.create with type "popup" gives desktop-style move/resize/minimize behavior.
- NOTES
  1. Initial dimensions should be explicitly set for consistent UX.
- RELATED UC-008, BR-015

AR-003 : Single-instance enforcement via persisted windowId plus liveness check.
- RATIONALE
  1. Tracking windowId and validating with chrome.windows.get prevents duplicate windows and supports focus-on-reopen.
- NOTES
  1. Stale IDs are cleared when window is missing or removed.
- RELATED UC-008, BR-016

AR-004 : Window geometry persistence via chrome.windows.onBoundsChanged and storage replay.
- RATIONALE
  1. Capturing width/height/left/top on bounds change and replaying at launch preserves workspace continuity.
- NOTES
  1. Use validation guards before replaying geometry values.
- RELATED UC-008, BR-017

AR-005 : Popup UI implemented as semantic single-page shell (HTML/CSS/JS separation).
- RATIONALE
  1. Clear separation of structure, style, and behavior keeps maintenance simple and traceable.
- NOTES
  1. Keep IDs stable for predictable event wiring.
- RELATED UC-001, BR-002, BR-003

AR-006 : Central in-memory editor state model with explicit render/update helpers.
- RATIONALE
  1. Centralized state avoids divergence between UI status, content, and metadata.
- NOTES
  1. State includes dirty, title, wrap, cursor, filename, and last search position.
- RELATED UC-002, UC-003, UC-004, UC-007, BR-004, BR-013, BR-014

AR-007 : Local persistence adapter using chrome.storage.local and structured payloads.
- RATIONALE
  1. Structured payloads permit reliable restore and evolution without backend dependencies.
- NOTES
  1. Persist on key transitions and before unload to limit data loss.
- RELATED UC-003, UC-004, BR-005, BR-006, BR-007

AR-008 : Unified unsaved-decision workflow reused by New, Open, and Close paths.
- RATIONALE
  1. Shared modal logic enforces consistent user-protection behavior across destructive actions.
- NOTES
  1. Return normalized decisions: save, discard, cancel.
- RELATED UC-005, UC-007, BR-008, BR-009, BR-010, BR-014

AR-009 : Find/Replace and keyboard command dispatch layer with explicit handlers.
- RATIONALE
  1. Isolated handlers increase predictability, reduce coupling, and simplify verification.
- NOTES
  1. Keyboard map must remain aligned with help dialog contents.
- RELATED UC-002, UC-009, BR-003, BR-018, BR-019, BR-020

AR-010 : Client-side download pipeline using Blob, object URL, and anchor click.
- RATIONALE
  1. Browser-native file APIs deliver serverless export with exact content fidelity.
- NOTES
  1. Normalize filename to .txt if extension omitted.
- RELATED UC-006, BR-011, BR-012

AR-011 : Help implemented as native dialog with a shortcut table.
- RATIONALE
  1. Native dialog supports modal behavior and Escape-to-close while keeping implementation lightweight.
- NOTES
  1. Dialog entries should be generated or maintained in lockstep with keyboard bindings.
- RELATED UC-009, BR-019, BR-020, BR-021

AR-012 : Stage-5 build packaging under ./build/extension as canonical implementation output.
- RATIONALE
  1. Pipeline requires generated implementation to live in ./build for verification and release traceability.
- NOTES
  1. Release notes must enumerate touched implementation files by DI scope.
- RELATED UC-001, BR-001, BR-018