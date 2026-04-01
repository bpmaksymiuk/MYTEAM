TECH-DESIGN:
- DESIGN ID: UC-001.BR-01.ARCH-01.DES-01
- IMPLEMENTATION TASKS: Create MV3 manifest with action and Ctrl+Shift+N command; implement background window launcher and single-window focus behavior; build Notepad shell UI (title/menu/editor/status) and auto-focus editor on load.
- INTERFACES AND DATA CONTRACTS: openNotepadWindow(): Promise<void>; storage.session key notepadWindowId:number tracks active popup window.
- EDGE CASES AND ERROR HANDLING: Repeated launch events focus existing Notepad window instead of opening duplicates; stale window IDs are cleared when update/focus fails.
- TEST NOTES: Load unpacked extension and verify toolbar click and Ctrl+Shift+N open/focus Notepad window with no new browser tab.

TECH-DESIGN:
- DESIGN ID: UC-002.BR-01.ARCH-01.DES-01
- IMPLEMENTATION TASKS: Add File->New menu command and Ctrl+N shortcut handlers; track dirty state; show unsaved confirmation before clearing document; reset title and editor on success.
- INTERFACES AND DATA CONTRACTS: onNewDocument(): void; dirty state tracked in window scope and reflected in title text.
- EDGE CASES AND ERROR HANDLING: Cancel action leaves current state unchanged; rejected prompt events do not clear content.
- TEST NOTES: Validate title/content reset and confirmation branching.

TECH-DESIGN:
- DESIGN ID: UC-003.BR-01.ARCH-01.DES-01
- IMPLEMENTATION TASKS: Register keyboard shortcuts and menu command handlers for cut/copy/paste/select-all/time-date/delete/undo/redo; implement word-wrap toggle in Format menu.
- INTERFACES AND DATA CONTRACTS: execEditorCommand(commandId: string): void; WrapMode = 'on'|'off'.
- EDGE CASES AND ERROR HANDLING: Unsupported clipboard permissions surface user-visible status.
- TEST NOTES: Execute shortcut matrix and undo/redo depth tests >= 50 operations.

TECH-DESIGN:
- DESIGN ID: UC-004.BR-01.ARCH-01.DES-01
- IMPLEMENTATION TASKS: Implement Save and Save As commands in File menu and keyboard shortcuts; generate UTF-8 blob and trigger browser download; update active filename and dirty status.
- INTERFACES AND DATA CONTRACTS: saveDocument(mode: 'save'|'saveAs'): Promise<boolean>.
- EDGE CASES AND ERROR HANDLING: Save cancellation preserves dirty flag and original filename.
- TEST NOTES: Compare downloaded file bytes and displayed title after save.

TECH-DESIGN:
- DESIGN ID: UC-005.BR-01.ARCH-01.DES-01
- IMPLEMENTATION TASKS: Implement Open command in File menu and Ctrl+O shortcut; use hidden file picker and text load path; update editor/title and dirty state.
- INTERFACES AND DATA CONTRACTS: openDocument(file: File): Promise<void>.
- EDGE CASES AND ERROR HANDLING: Block files >10 MB with clear message; prompt on unsaved changes before load.
- TEST NOTES: Validate UTF-8/ANSI samples and mixed line endings.

TECH-DESIGN:
- DESIGN ID: UC-006.BR-01.ARCH-01.DES-01
- IMPLEMENTATION TASKS: Build non-blocking find/replace dialog UI, wire Ctrl+F/Ctrl+H and Edit menu commands, implement Find Next/Replace/Replace All with match-case and wrap-around behavior.
- INTERFACES AND DATA CONTRACTS: findNext(query: string, options): Match|null; replaceAll(query: string, replacement: string, options): number.
- EDGE CASES AND ERROR HANDLING: Empty query disables actions; no-match state reports status without modifying content.
- TEST NOTES: Validate match-case and wrap-around permutations.

TECH-DESIGN:
- DESIGN ID: UC-007.BR-01.ARCH-01.DES-01
- IMPLEMENTATION TASKS: Add debounced auto-save (3 seconds) and startup restore from chrome.storage.local; display autosave status including near-quota warning state.
- INTERFACES AND DATA CONTRACTS: persistSnapshot(reason: string): Promise<void>; restoreSnapshot(): Promise<void>.
- EDGE CASES AND ERROR HANDLING: Handle storage write failures with non-blocking warning and retry window.
- TEST NOTES: Restart browser and verify state restoration for content/title/cursor.

TECH-DESIGN:
- DESIGN ID: UC-008.BR-01.ARCH-01.DES-01
- IMPLEMENTATION TASKS: Implement File->Exit and title-bar close-button workflows with custom Yes/No/Cancel unsaved dialog and close teardown path.
- INTERFACES AND DATA CONTRACTS: exitNotepad(): Promise<void>; confirmUnsavedBeforeExit(): Promise<boolean>.
- EDGE CASES AND ERROR HANDLING: Cancel close preserves session; failed save on close returns to editor.
- TEST NOTES: Validate Yes/No/Cancel branches and restart restoration behavior.
