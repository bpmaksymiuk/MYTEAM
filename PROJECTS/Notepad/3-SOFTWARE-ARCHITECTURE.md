ARCHITECTURE:
- ARCH ID: AR-01
- DESCRIPTION: Use a Chrome extension action popup as the Notepad runtime surface.
- TECHNOLOGY DECISION: Chrome Extension Manifest V3 popup page using HTML/CSS/JavaScript.
- TRADEOFFS: Popup lifecycle is ephemeral and constrained in size compared with standalone desktop windows.
- RELATED: UC-01, BR-01

ARCHITECTURE:
- ARCH ID: AR-02
- DESCRIPTION: Keep document state in a single in-memory model with dirty tracking and title metadata.
- TECHNOLOGY DECISION: Central JavaScript state object synchronized to DOM.
- TRADEOFFS: Single-document scope simplifies behavior but omits multi-document tabs.
- RELATED: UC-02, BR-02

ARCHITECTURE:
- ARCH ID: AR-03
- DESCRIPTION: Implement editing commands using browser APIs and textarea behavior.
- TECHNOLOGY DECISION: Textarea-based editor with command handlers and KeyboardEvent interception.
- TRADEOFFS: Browser command support for redo and clipboard may vary by platform policy.
- RELATED: UC-03, BR-03

ARCHITECTURE:
- ARCH ID: AR-04
- DESCRIPTION: Export text files through blob download links generated in popup context.
- TECHNOLOGY DECISION: UTF-8 Blob plus temporary anchor click for Save/Save As behavior.
- TRADEOFFS: Browser controls final download path and confirmation UX.
- RELATED: UC-04, BR-04

ARCHITECTURE:
- ARCH ID: AR-05
- DESCRIPTION: Import text files through hidden file input and FileReader.
- TECHNOLOGY DECISION: accept=.txt file picker with text decoding via File.text().
- TRADEOFFS: Encoding detection is browser-dependent; ANSI handling is best effort.
- RELATED: UC-05, BR-05

ARCHITECTURE:
- ARCH ID: AR-06
- DESCRIPTION: Provide find/replace overlay dialog over the editor surface.
- TECHNOLOGY DECISION: Custom modal-like panel with linear search indices and replace operations.
- TRADEOFFS: Behavior approximates Notepad but does not replicate native window-level dialog semantics.
- RELATED: UC-06, BR-06

ARCHITECTURE:
- ARCH ID: AR-07
- DESCRIPTION: Persist editor runtime snapshot in extension local storage with debounce.
- TECHNOLOGY DECISION: chrome.storage.local writes after idle timeout and on beforeunload hooks.
- TRADEOFFS: Storage quota limits require warning and possible graceful degradation.
- RELATED: UC-07, BR-07

ARCHITECTURE:
- ARCH ID: AR-08
- DESCRIPTION: Gate close action through explicit confirmation dialog integrated with save routine.
- TECHNOLOGY DECISION: Custom confirm modal for Save/Discard/Cancel choices prior to window.close().
- TRADEOFFS: Popup close cannot always be intercepted if browser forcibly closes extension surface.
- RELATED: UC-08, BR-08
