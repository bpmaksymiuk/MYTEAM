IMPLEMENTATION INSTRUCTION:
- INSTRUCTION ID: II-01
- GOAL: Bootstrap Manifest V3 extension entry points and popup wiring.
- SKILLSET REQUIRED: Chrome extension development, Manifest V3 basics
- IMPLEMENTATION STEPS: Create manifest.json with action default_popup and command shortcut; declare storage permission; register icons and popup assets.
- RELATED: UC-01, BR-01, AR-01

IMPLEMENTATION INSTRUCTION:
- INSTRUCTION ID: II-02
- GOAL: Build Notepad-like popup UI shell with title/menu/editor/status regions.
- SKILLSET REQUIRED: HTML semantics, CSS layout and visual styling
- IMPLEMENTATION STEPS: Implement popup.html structure; style classic Windows-like chrome in popup.css; ensure textarea autofocus and responsive popup sizing.
- RELATED: UC-01, BR-01, AR-01

IMPLEMENTATION INSTRUCTION:
- INSTRUCTION ID: II-03
- GOAL: Implement document lifecycle and core edit commands.
- SKILLSET REQUIRED: JavaScript state management, DOM events
- IMPLEMENTATION STEPS: Add state model for title/content/dirty; implement New with unsaved prompt; wire cut/copy/paste/delete/select-all/time-date/word-wrap commands and keyboard shortcuts.
- RELATED: UC-02, UC-03, BR-02, BR-03, AR-02, AR-03

IMPLEMENTATION INSTRUCTION:
- INSTRUCTION ID: II-04
- GOAL: Implement Save and Save As download flow.
- SKILLSET REQUIRED: Browser file APIs, Blob handling
- IMPLEMENTATION STEPS: Serialize textarea text to UTF-8 Blob; trigger anchor download; support save-name prompt for untitled docs; update title and dirty flag after save.
- RELATED: UC-04, BR-04, AR-04

IMPLEMENTATION INSTRUCTION:
- INSTRUCTION ID: II-05
- GOAL: Implement Open file flow for .txt documents.
- SKILLSET REQUIRED: File input handling, asynchronous JavaScript
- IMPLEMENTATION STEPS: Trigger hidden file input from menu/shortcut; read selected file as text; set editor content/title and reset undo markers where feasible.
- RELATED: UC-05, BR-05, AR-05

IMPLEMENTATION INSTRUCTION:
- INSTRUCTION ID: II-06
- GOAL: Deliver non-blocking Find/Replace dialog operations.
- SKILLSET REQUIRED: String processing, UI interaction patterns
- IMPLEMENTATION STEPS: Build dialog with query and replace fields, match-case and wrap flags; implement Find Next, Replace, and Replace All with replacement count reporting.
- RELATED: UC-06, BR-06, AR-06

IMPLEMENTATION INSTRUCTION:
- INSTRUCTION ID: II-07
- GOAL: Persist and restore editor snapshot through chrome.storage.local.
- SKILLSET REQUIRED: Chrome storage API, debounce logic
- IMPLEMENTATION STEPS: Debounce writes after edits; store content/title/wrap/cursor/dirty metadata; load snapshot on popup init and restore UI state.
- RELATED: UC-07, BR-07, AR-07

IMPLEMENTATION INSTRUCTION:
- INSTRUCTION ID: II-08
- GOAL: Implement controlled close with save/discard/cancel routing.
- SKILLSET REQUIRED: Dialog state management, command orchestration
- IMPLEMENTATION STEPS: Build exit dialog component; when dirty show Save/Discard/Cancel; Save executes save flow then closes, Discard closes, Cancel keeps popup open.
- RELATED: UC-08, BR-08, AR-08
