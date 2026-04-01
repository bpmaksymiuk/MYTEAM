ARCHITECTURE:
- ARCHITECTURE ID: UC-001.BR-01.ARCH-01
- COMPONENTS AFFECTED: src/extension/manifest.json, src/extension/background.js, src/extension/window.html, src/extension/window.css, src/extension/window.js, src/extension/pnp.png
- TECHNOLOGY DECISIONS: Use MV3 extension action and keyboard command to open a dedicated popup-type extension window hosting a Notepad-like UI shell with immediate plain-text focus.
- TRADEOFFS: Pixel-perfect Windows Notepad parity is approximated within browser rendering constraints.

ARCHITECTURE:
- ARCHITECTURE ID: UC-002.BR-01.ARCH-01
- COMPONENTS AFFECTED: src/extension/window.html, src/extension/window.js
- TECHNOLOGY DECISIONS: Implement File menu command routing in the Notepad window with a centralized new-document reset handler guarded by unsaved-change confirmation.
- TRADEOFFS: Confirmation UX may use browser modal style rather than native Windows dialog rendering.

ARCHITECTURE:
- ARCHITECTURE ID: UC-003.BR-01.ARCH-01
- COMPONENTS AFFECTED: src/extension/window.html, src/extension/window.js, src/extension/window.css
- TECHNOLOGY DECISIONS: Implement plaintext command routing from Edit/Format menus and keyboard handlers (cut/copy/paste/select-all/undo/redo/time-date/delete) with configurable word-wrap mode.
- TRADEOFFS: Browser text area behavior may differ subtly from native Notepad selection internals.

ARCHITECTURE:
- ARCHITECTURE ID: UC-004.BR-01.ARCH-01
- COMPONENTS AFFECTED: src/extension/window.html, src/extension/window.js
- TECHNOLOGY DECISIONS: Use Blob + object URL download flow for Save/Save As and retain active filename metadata in the Notepad window state.
- TRADEOFFS: Native Save As interactions depend on browser constraints and user download settings.

ARCHITECTURE:
- ARCHITECTURE ID: UC-005.BR-01.ARCH-01
- COMPONENTS AFFECTED: src/extension/window.html, src/extension/window.js
- TECHNOLOGY DECISIONS: Use hidden file input picker and file.text()-based load pipeline with size validation and state synchronization.
- TRADEOFFS: Encoding detection beyond UTF-8/ANSI may require additional parser logic.

ARCHITECTURE:
- ARCHITECTURE ID: UC-006.BR-01.ARCH-01
- COMPONENTS AFFECTED: src/extension/window.html, src/extension/window.js, src/extension/window.css
- TECHNOLOGY DECISIONS: Provide a non-blocking in-window find/replace dialog bound to textarea search and replacement services with match-case and wrap-around options.
- TRADEOFFS: Dialog movement/resizing fidelity may differ from native Win32 behavior.

ARCHITECTURE:
- ARCHITECTURE ID: UC-007.BR-01.ARCH-01
- COMPONENTS AFFECTED: src/extension/window.html, src/extension/window.js
- TECHNOLOGY DECISIONS: Debounced auto-save to chrome.storage.local with snapshot restore on launch and autosave status indicators.
- TRADEOFFS: Storage quota and async write timing require warning and conflict handling.

ARCHITECTURE:
- ARCHITECTURE ID: UC-008.BR-01.ARCH-01
- COMPONENTS AFFECTED: src/extension/window.html, src/extension/window.js
- TECHNOLOGY DECISIONS: Centralized close workflow via File->Exit and title-bar close control with custom Yes/No/Cancel unsaved dialog and beforeunload safeguard.
- TRADEOFFS: Browser window lifecycle may limit exact process-level parity with desktop Notepad.
