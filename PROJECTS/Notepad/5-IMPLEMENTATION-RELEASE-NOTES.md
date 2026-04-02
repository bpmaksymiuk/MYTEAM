RELEASE-NOTES:
- Version ID: v0.1.0
- Summary of features implemented:
  - Added Manifest V3 Chrome extension popup runtime for Classic Notepad UI.
  - Implemented Notepad-like shell with title bar, menu bar, editor area, and status bar.
  - Implemented core document lifecycle: New, dirty tracking, save, save as, and open text file.
  - Added find/replace dialog with match-case and wrap-around controls.
  - Added keyboard shortcuts for common commands (Ctrl+N/S/O/F/H/A, F5 time/date, Ctrl+Y redo attempt).
  - Added debounced persistence and restore using chrome.storage.local.
  - Added controlled Exit flow with Save/Discard/Cancel prompt.

Runtime caveats and implementation constraints:
- UC-01: Chrome popup UI approximates Notepad and cannot provide full desktop window parity or unrestricted resize behavior.
- UC-02: Unsaved-change prompt is extension-rendered dialog rather than native OS Notepad dialog.
- UC-03: Clipboard and redo support may vary by browser policy and host platform behavior.
- UC-04: Browser download UX controls final path and overwrite interactions.
- UC-05: Legacy ANSI/code-page handling is best-effort through browser text decoding.
- UC-06: Find/Replace dialog is non-blocking but not an independently movable native child window.
- UC-07: Persistence is limited by chrome.storage.local quotas and currently tracks active document snapshot state.
- UC-08: In-app exit prompts are reliable for extension controls, but browser-forced popup close may bypass prompt interception.
