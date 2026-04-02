BUSINESS REQUIREMENT:
- BR ID: BR-01
- REQUIREMENT STATEMENT: The extension shall open a dedicated Notepad interface from the toolbar action without opening a normal browser tab.
- PRIORITY: High
- TESTABLE CONDITION: Clicking the extension action opens the extension UI with editable text area focus and no regular web tab navigation.
- RELATED: UC-01

BUSINESS REQUIREMENT:
- BR ID: BR-02
- REQUIREMENT STATEMENT: The system shall create a new empty document with title reset behavior and unsaved-change confirmation when applicable.
- PRIORITY: High
- TESTABLE CONDITION: Invoking New resets text to empty, resets title to Untitled, and prompts before destructive reset when unsaved content exists.
- RELATED: UC-02

BUSINESS REQUIREMENT:
- BR ID: BR-03
- REQUIREMENT STATEMENT: The editor shall support plain-text entry, edit shortcuts, word wrap toggle, and undo/redo behavior through browser-supported commands.
- PRIORITY: High
- TESTABLE CONDITION: Typing, selection, cut/copy/paste, undo/redo, Ctrl+A, and word-wrap toggle work from UI and keyboard shortcuts.
- RELATED: UC-03

BUSINESS REQUIREMENT:
- BR ID: BR-04
- REQUIREMENT STATEMENT: The system shall save the active document as UTF-8 plain text using browser download capabilities.
- PRIORITY: High
- TESTABLE CONDITION: Save or Save As triggers a .txt file download with exact textarea content and updates visible filename state.
- RELATED: UC-04

BUSINESS REQUIREMENT:
- BR ID: BR-05
- REQUIREMENT STATEMENT: The editor shall import local .txt files into the active document while preserving line endings as loaded by the browser text decoder.
- PRIORITY: High
- TESTABLE CONDITION: Open file action loads selected text file content into the editor and updates document title to selected filename.
- RELATED: UC-05

BUSINESS REQUIREMENT:
- BR ID: BR-06
- REQUIREMENT STATEMENT: The system shall provide Find and Replace workflows with match-case and wrap options inside a non-blocking dialog.
- PRIORITY: Medium
- TESTABLE CONDITION: Find Next, Replace, and Replace All operations function using user-selected options and report replacement count for Replace All.
- RELATED: UC-06

BUSINESS REQUIREMENT:
- BR ID: BR-07
- REQUIREMENT STATEMENT: The extension shall auto-save editor state in Chrome local storage and restore it on relaunch.
- PRIORITY: High
- TESTABLE CONDITION: After edits and inactivity debounce, content/title/wrap/cursor state persist and are restored after popup close and reopen.
- RELATED: UC-07

BUSINESS REQUIREMENT:
- BR ID: BR-08
- REQUIREMENT STATEMENT: Closing with unsaved changes shall require explicit user intent and preserve consistent restoration behavior.
- PRIORITY: Medium
- TESTABLE CONDITION: Exit prompts user to Save/Discard/Cancel; Save follows save flow and close action respects user decision.
- RELATED: UC-08
