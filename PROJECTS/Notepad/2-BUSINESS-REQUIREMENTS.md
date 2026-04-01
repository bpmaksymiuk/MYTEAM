BUSINESS REQUIREMENT:
- BR ID: UC-001.BR-01
- REQUIREMENT STATEMENT: The extension shall open a Notepad-style floating window from the toolbar action and provide an editable plain-text area immediately.
- PRIORITY: High
- TESTABLE CONDITION: Triggering launch opens a floating Notepad-style UI within 500 ms, with focused editable text area and no new browser tab.

BUSINESS REQUIREMENT:
- BR ID: UC-002.BR-01
- REQUIREMENT STATEMENT: The extension shall provide File->New behavior that resets the document to an untitled blank state and prompts on unsaved changes.
- PRIORITY: High
- TESTABLE CONDITION: Invoking New clears content, resets title to "Untitled - Notepad", and prompts when unsaved changes exist.

BUSINESS REQUIREMENT:
- BR ID: UC-003.BR-01
- REQUIREMENT STATEMENT: The editor shall support plain-text typing, standard Notepad keyboard shortcuts, undo/redo, and word wrap toggling.
- PRIORITY: High
- TESTABLE CONDITION: Text editing shortcuts and word-wrap behave as specified, with undo/redo supporting at least 50 steps.

BUSINESS REQUIREMENT:
- BR ID: UC-004.BR-01
- REQUIREMENT STATEMENT: The extension shall save documents as UTF-8 .txt files using browser Save/Save As flows and update title with filename.
- PRIORITY: High
- TESTABLE CONDITION: Save outputs correct .txt file content and updates title after successful save.

BUSINESS REQUIREMENT:
- BR ID: UC-005.BR-01
- REQUIREMENT STATEMENT: The extension shall open .txt files via file picker, load content into editor, and preserve supported encodings and line endings.
- PRIORITY: High
- TESTABLE CONDITION: Selected .txt files load correctly (including large files up to 10 MB) and filename appears in title.

BUSINESS REQUIREMENT:
- BR ID: UC-006.BR-01
- REQUIREMENT STATEMENT: The extension shall provide non-blocking Find/Replace dialogs with Find Next, Replace, Replace All, Match Case, and Wrap Around options.
- PRIORITY: Medium
- TESTABLE CONDITION: Search and replace operations produce correct highlights and replacement counts with option-respecting behavior.

BUSINESS REQUIREMENT:
- BR ID: UC-007.BR-01
- REQUIREMENT STATEMENT: The extension shall auto-save documents to Chrome local storage and restore state across restart.
- PRIORITY: High
- TESTABLE CONDITION: Content, title, and cursor state restore after browser restart, with storage-warning behavior near quota.

BUSINESS REQUIREMENT:
- BR ID: UC-008.BR-01
- REQUIREMENT STATEMENT: The extension shall handle close/exit with unsaved-change confirmation and clean window teardown.
- PRIORITY: High
- TESTABLE CONDITION: Close prompts Yes/No/Cancel on dirty documents and exits without lingering UI/process artifacts.
