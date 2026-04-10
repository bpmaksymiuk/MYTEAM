# Business Requirements — Notepad.exe

Derived from: `1-USE-CASES.md`
Stage: 2 — Business Analyst

---

## BR-001 : The system shall open the Notepad window when the user clicks the Chrome extension icon.
- TESTABLE CONDITION: Clicking the extension icon in Chrome opens a Notepad window within one user interaction.
- NOTES None
- RELATED UC-001, UC-008

---

## BR-002 : The title bar shall display "Untitled - Notepad" for new documents and "{filename} - Notepad" for saved or loaded files.
- TESTABLE CONDITION: Opening a new session shows "Untitled - Notepad"; after saving with name "notes.txt" the title bar shows "notes.txt - Notepad".
- NOTES None
- RELATED UC-001, UC-003, UC-004, UC-005

---

## BR-003 : The window shall include a menu bar with File, Edit, View, and Help top-level menus.
- TESTABLE CONDITION: All four menus (File, Edit, View, Help) are visible and clickable in the menu bar.
- NOTES None
- RELATED UC-001

---

## BR-004 : The File menu shall contain New, Open, Save, Save As, and Exit items.
- TESTABLE CONDITION: Opening the File menu displays New, Open, Save, Save As, and Exit menu items.
- NOTES None
- RELATED UC-001, UC-003, UC-004, UC-005, UC-006

---

## BR-005 : The Edit menu shall contain Undo, Cut, Copy, Paste, Find, and Replace items.
- TESTABLE CONDITION: Opening the Edit menu displays Undo, Cut, Copy, Paste, Find, and Replace menu items.
- NOTES None
- RELATED UC-001, UC-002

---

## BR-006 : The View menu shall contain Word Wrap and Zoom items.
- TESTABLE CONDITION: Opening the View menu displays Word Wrap and Zoom menu items.
- NOTES None
- RELATED UC-001

---

## BR-007 : The Help menu shall contain View Help and About Notepad items.
- TESTABLE CONDITION: Opening the Help menu displays View Help and About Notepad menu items.
- NOTES None
- RELATED UC-001, UC-009

---

## BR-008 : The application shall use Windows system fonts (Segoe UI or system default), standard colors, and a Windows Notepad layout.
- TESTABLE CONDITION: Rendered text uses Segoe UI or the nearest available system font; color scheme uses standard light background with dark text.
- NOTES None
- RELATED UC-001, UC-002, UC-008

---

## BR-009 : Cursor focus shall be placed in the text area immediately when the window opens.
- TESTABLE CONDITION: After the window opens, the user can immediately type without clicking the text area first.
- NOTES None
- RELATED UC-001

---

## BR-010 : The main text editor area shall accept plain text input including line breaks and tabs.
- TESTABLE CONDITION: User can type multi-line text and insert tabs; each added character appears in the editor immediately.
- NOTES None
- RELATED UC-002

---

## BR-011 : Text updates shall be visible in the editor in real time after each input action.
- TESTABLE CONDITION: Each keystroke is reflected in the editor display with no perceptible delay.
- NOTES None
- RELATED UC-002

---

## BR-012 : Standard keyboard editing behaviors consistent with Windows Notepad shall be supported (e.g., backspace, delete, arrow keys, select-all).
- TESTABLE CONDITION: Backspace, Delete, Home, End, arrow keys, and Ctrl+A all behave as expected in a standard Notepad editor.
- NOTES None
- RELATED UC-002

---

## BR-013 : The status bar shall display the current line number (1-indexed) at all times.
- TESTABLE CONDITION: When the cursor is on line 3 of the document, the status bar shows "Ln 3" (or equivalent).
- NOTES None
- RELATED UC-001, UC-002B

---

## BR-014 : The status bar shall display the current column position (1-indexed) at all times.
- TESTABLE CONDITION: When the cursor is at the 5th character of a line, the status bar shows "Col 5" (or equivalent).
- NOTES None
- RELATED UC-002B

---

## BR-015 : The status bar shall display the total character count of the document.
- TESTABLE CONDITION: When the document contains 42 characters, the status bar shows a character count of 42.
- NOTES None
- RELATED UC-002B

---

## BR-016 : The status bar shall display the file encoding as UTF-8.
- TESTABLE CONDITION: The status bar shows "UTF-8" at all times regardless of document content.
- NOTES None
- RELATED UC-002B

---

## BR-017 : All status bar statistics shall update in real time as the user types or navigates with arrow keys.
- TESTABLE CONDITION: Pressing the down-arrow key or typing a character immediately updates line, column, and character count shown in the status bar.
- NOTES None
- RELATED UC-002B

---

## BR-018 : The status bar shall use a Windows Notepad styled appearance (gray background with dark text at the bottom of the window).
- TESTABLE CONDITION: The status bar is rendered at the bottom of the window with a gray background and dark, legible text.
- NOTES None
- RELATED UC-001, UC-002B

---

## BR-019 : File > Save shall write the current editor content to browser local storage.
- TESTABLE CONDITION: After selecting File > Save and reopening the extension, the previously entered text is restored.
- NOTES None
- RELATED UC-003

---

## BR-020 : Saved content shall persist after the extension popup is closed and reopened.
- TESTABLE CONDITION: Content typed, saved, and then retrieved after closing and reopening the extension matches the saved content exactly.
- NOTES None
- RELATED UC-003

---

## BR-021 : The save operation shall function without any server-side dependency.
- TESTABLE CONDITION: Save succeeds with no network activity; local storage is the only write target.
- NOTES None
- RELATED UC-003, UC-006

---

## BR-022 : File > Open shall display an interface to select a previously saved note.
- TESTABLE CONDITION: Selecting File > Open presents the user with at least one saved note to choose from (when saves exist).
- NOTES None
- RELATED UC-004

---

## BR-023 : Selected saved note content shall be restored accurately and completely in the editor.
- TESTABLE CONDITION: The loaded content in the editor is identical to the content that was saved.
- NOTES None
- RELATED UC-004

---

## BR-024 : Loaded content shall be editable immediately after loading.
- TESTABLE CONDITION: The user can type a new character in the editor immediately after loading without any additional action.
- NOTES None
- RELATED UC-004

---

## BR-025 : Load behavior shall work consistently across browser sessions.
- TESTABLE CONDITION: Closing Chrome, reopening it, and loading a saved note returns the same content each time.
- NOTES None
- RELATED UC-004

---

## BR-026 : File > New shall clear the editor to a blank state when confirmed.
- TESTABLE CONDITION: After confirming File > New, the editor text area contains no characters.
- NOTES None
- RELATED UC-005

---

## BR-027 : The system shall prompt the user for confirmation before discarding unsaved edits on New.
- TESTABLE CONDITION: If the document has unsaved text and the user selects File > New, a confirmation dialog appears before any content is discarded.
- NOTES None
- RELATED UC-005, UC-007

---

## BR-028 : Canceling the New confirmation prompt shall keep the current note intact.
- TESTABLE CONDITION: If the user dismisses or cancels the confirmation prompt, the editor content remains unchanged.
- NOTES None
- RELATED UC-005, UC-007

---

## BR-029 : The status bar shall reset to line 1, column 1, and character count 0 after File > New is confirmed.
- TESTABLE CONDITION: After confirming File > New, the status bar shows Ln 1, Col 1, and character count 0.
- NOTES None
- RELATED UC-005

---

## BR-030 : File > Save As shall trigger a browser download of the editor content as a plain UTF-8 text file.
- TESTABLE CONDITION: Selecting File > Save As initiates a browser download; the resulting file is a valid UTF-8 plain text file.
- NOTES None
- RELATED UC-006

---

## BR-031 : Downloaded file content shall match the editor content exactly at the time of the Save As action.
- TESTABLE CONDITION: Comparing downloaded file content with the editor text shows no differences.
- NOTES None
- RELATED UC-006

---

## BR-032 : The downloaded file's extension shall default to .txt.
- TESTABLE CONDITION: The downloaded file name ends in ".txt".
- NOTES None
- RELATED UC-006

---

## BR-033 : The downloaded file name shall default to "Untitled.txt" for unsaved documents or the current filename for previously saved documents.
- TESTABLE CONDITION: For a new unsaved document the download is named "Untitled.txt"; for a document saved as "notes.txt" the download is named "notes.txt".
- NOTES None
- RELATED UC-006

---

## BR-034 : File > Save As shall operate without any server-side dependency.
- TESTABLE CONDITION: The download completes with no network requests; the browser download API is the only mechanism used.
- NOTES None
- RELATED UC-006

---

## BR-035 : The system shall display a confirmation prompt when the user initiates a New or Open action and unsaved edits are present.
- TESTABLE CONDITION: With unsaved text in the editor, selecting File > New or File > Open triggers a visible confirmation prompt.
- NOTES None
- RELATED UC-007

---

## BR-036 : The Continue option in the confirmation prompt shall proceed with the requested action.
- TESTABLE CONDITION: Clicking Continue on the confirmation prompt causes the requested New or Open action to execute.
- NOTES None
- RELATED UC-007

---

## BR-037 : The Cancel option in the confirmation prompt shall leave the current content and application state unchanged.
- TESTABLE CONDITION: Clicking Cancel on the confirmation prompt returns the editor to the exact state it was in before the action was initiated.
- NOTES None
- RELATED UC-007

---

## BR-038 : The application shall open in a standalone detached Chrome window, not an inline popup.
- TESTABLE CONDITION: Clicking the extension icon opens a separate Chrome window; the extension popup does not appear inline.
- NOTES None
- RELATED UC-008

---

## BR-039 : The detached window shall not close when the user navigates or switches tabs in the main browser.
- TESTABLE CONDITION: The Notepad window remains open while the user navigates to a different URL in the main Chrome window.
- NOTES None
- RELATED UC-008

---

## BR-040 : The window position and size shall persist between sessions.
- TESTABLE CONDITION: After the user resizes and repositions the window, closing and reopening the extension restores the same size and position.
- NOTES None
- RELATED UC-008

---

## BR-041 : Only one Notepad window shall be open at a time.
- TESTABLE CONDITION: Clicking the extension icon while the Notepad window is already open focuses the existing window rather than opening a second one.
- NOTES None
- RELATED UC-008

---

## BR-042 : Clicking the extension icon when the Notepad window already exists shall focus that window.
- TESTABLE CONDITION: With an open Notepad window minimized, clicking the extension icon brings the window to the foreground.
- NOTES None
- RELATED UC-008

---

## BR-043 : The Help > View Help action shall open a dialog listing all available keyboard shortcuts.
- TESTABLE CONDITION: Clicking Help > View Help opens a dialog that contains at least one keyboard shortcut entry.
- NOTES None
- RELATED UC-009

---

## BR-044 : Each shortcut entry in the Help dialog shall display both the key combination and its associated action.
- TESTABLE CONDITION: Every row in the help dialog contains a key combination label and a human-readable action description.
- NOTES None
- RELATED UC-009

---

## BR-045 : The shortcuts listed in the Help dialog shall match the actual key bindings active in the editor.
- TESTABLE CONDITION: Every shortcut displayed in the Help dialog triggers the listed action when pressed in the editor.
- NOTES None
- RELATED UC-009

---

## BR-046 : The Help dialog shall be styled as a Windows modal dialog with title bar and standard colors.
- TESTABLE CONDITION: The Help dialog has a visible title bar, uses Windows-style colors, and appears modal (blocking background interaction).
- NOTES None
- RELATED UC-009

---

## BR-047 : The Help dialog shall be dismissible via a Close button or the Escape key.
- TESTABLE CONDITION: Clicking the Close button inside the dialog and pressing Escape both successfully close the Help dialog.
- NOTES None
- RELATED UC-009
