USE CASE: UC-001
GOAL
Launch the Chrome plugin and open a new Notepad window that visually resembles the classic Windows Notepad.exe interface (title bar, menu bar with File/Edit/Format/View/Help, text area, status bar).  ACTOR
End User (any Chrome browser user)  STEP BY STEP WALKTHROUGH  User clicks the Notepad icon in the Chrome toolbar (or uses the keyboard shortcut Ctrl+Shift+N).  
The extension opens a popup/modal window that mimics Notepad.exe layout (white background, Courier New font by default, menu bar at top).  
The window loads with an empty untitled document and “Untitled – Notepad” in the title bar.  
System displays the blinking cursor in the text area ready for input.

ACCEPTANCE CRITERIA  Window opens within 500 ms of click.  
Visual design matches Notepad.exe (icon, menu labels, layout, resize handle).  
Text area is focused and editable immediately.  
No browser tab is opened; everything stays in a floating/resizable Chrome extension window.  
Extension works offline.

USE CASE: UC-002
GOAL
Create a new blank note/document.  ACTOR
End User  STEP BY STEP WALKTHROUGH  User opens the extension (UC-001) or is already inside an existing note.  
User clicks File → New (or presses Ctrl+N).  
System clears the current text area and updates the title bar to “Untitled – Notepad”.  
Cursor is placed at the beginning of the empty document.

ACCEPTANCE CRITERIA  Previous content is discarded (with confirmation prompt if unsaved changes exist).  
New document is immediately editable.  
Title bar correctly shows “Untitled – Notepad”.  
Undo history is reset for the new document.

USE CASE: UC-003
GOAL
Type, edit, and format basic text inside the note (plain-text editing experience identical to Notepad.exe).  ACTOR
End User  STEP BY STEP WALKTHROUGH  User is inside an open note.  
User types text, uses arrow keys, Backspace, Delete, Enter, etc.  
User accesses Edit menu for Cut (Ctrl+X), Copy (Ctrl+C), Paste (Ctrl+V), Delete, Select All (Ctrl+A), Time/Date (F5), Word Wrap toggle.  
User accesses Format menu to toggle Word Wrap and change font/size (limited to fonts available in Chrome).  
All changes are reflected instantly in the text area.

ACCEPTANCE CRITERIA  Text behaves exactly like native Notepad (line breaks, tabs, no rich formatting).  
Keyboard shortcuts match Windows Notepad (Ctrl+C, Ctrl+V, Ctrl+Z, F5, etc.).  
Word Wrap toggle works and persists per document.  
Undo/Redo stack (Ctrl+Z / Ctrl+Y) functions correctly up to at least 50 steps.

USE CASE: UC-004
GOAL
Save the current note as a .txt file to the user’s local Downloads folder.  ACTOR
End User  STEP BY STEP WALKTHROUGH  User clicks File → Save (Ctrl+S) or File → Save As.  
If the document is untitled, system opens the browser’s native “Save As” dialog pre-filled with “Untitled.txt”.  
User chooses location/filename and confirms.  
Extension triggers a file download of the exact plain-text content.  
Title bar updates to show the saved filename (e.g., “MyNote.txt – Notepad”).

ACCEPTANCE CRITERIA  File is saved with correct .txt extension and UTF-8 encoding.  
Content matches exactly what is in the text area (no extra characters).  
If changes were made after last save, user is prompted before overwriting.  
Auto-save indicator (if enabled) updates after successful save.

USE CASE: UC-005
GOAL
Open an existing .txt file from the user’s computer into the Notepad window.  ACTOR
End User  STEP BY STEP WALKTHROUGH  User clicks File → Open (Ctrl+O).  
Browser’s native file picker opens filtered to *.txt files.  
User selects a .txt file.  
Extension reads the file content and loads it into the text area.  
Title bar updates to show the filename (e.g., “Report.txt – Notepad”).

ACCEPTANCE CRITERIA  File content loads correctly (UTF-8 and ANSI supported).  
Large files (up to 10 MB) load without freezing the UI.  
If current document has unsaved changes, user receives a “Save before opening?” prompt.  
Line endings (CRLF/CR/LF) are preserved and displayed correctly.

USE CASE: UC-006
GOAL
Search and replace text within the current note (Find / Replace functionality).  ACTOR
End User  STEP BY STEP WALKTHROUGH  User clicks Edit → Find (Ctrl+F) or Edit → Replace (Ctrl+H).  
Find dialog appears (matches Notepad.exe design).  
User enters search term, optional replace text, and chooses Match case / Wrap around options.  
System highlights the first match; user can click Find Next or Replace/Replace All.  
Dialog stays open until closed by user.

ACCEPTANCE CRITERIA  Search is case-sensitive when “Match case” is checked.  
Replace All updates the entire document correctly and shows count of replacements.  
“Wrap around” option works from cursor position.  
Dialog is non-blocking and can be moved/resized like classic Notepad.

USE CASE: UC-007
GOAL
Automatically save all notes locally (Chrome storage) so they persist across browser restarts and sessions.  ACTOR
End User (background behavior)  STEP BY STEP WALKTHROUGH  User makes any change in any open note.  
After 3 seconds of inactivity (or on every keystroke with debounce), extension auto-saves the document to Chrome local storage.  
On next launch (UC-001), extension checks storage and restores the last active document(s).  
User can also manually click File → Save to force immediate storage write.

ACCEPTANCE CRITERIA  All open documents are restored exactly (content + cursor position + title).  
Works even after Chrome is fully closed and reopened.  
Storage limit warning shown if approaching Chrome’s 5 MB per extension quota.  
User can clear all stored notes via Options page if desired.

USE CASE: UC-008
GOAL
Close the Notepad window while optionally saving unsaved changes.  ACTOR
End User  STEP BY STEP WALKTHROUGH  User clicks the close button (X) or File → Exit.  
If the document has unsaved changes, system shows classic “Do you want to save changes?” dialog with Yes/No/Cancel.  
On Yes → triggers Save flow (UC-004).  
Window closes cleanly and releases memory.

ACCEPTANCE CRITERIA  Unsaved changes prompt appears exactly like Notepad.exe.  
Window closes without leaving zombie processes or lingering popups.  
Next launch restores the state correctly (UC-007).  
Extension icon badge (if enabled) shows number of unsaved documents before close.

