## UC-001 : End User - Open Notepad Window
- STEPS
  1. User clicks the Chrome extension icon.
  2. System opens Notepad as a standalone window styled to match Windows Notepad.
  3. Window displays title bar with "Untitled - Notepad" and window controls (minimize, maximize, close).
  4. User sees a menu bar with File, Edit, View, and Help menus.
  5. User sees the main text editor area in the center.
  6. User sees a status bar at the bottom displaying encoding, line count, column position, and character count.
- ACCEPTANCE CRITERIA
  1. Window opens from extension icon in one click with proper system window chrome.
  2. UI uses Windows system fonts (Segoe UI or system default), colors, and layout matching actual Windows Notepad.
  3. Title bar shows "Untitled - Notepad" for new documents and "Filename - Notepad" for saved/loaded files.
  4. Menu bar provides File (New, Open, Save, Save As, Exit), Edit (Undo, Cut, Copy, Paste, Find, Replace), View (Word Wrap, Zoom), and Help (View Help, About Notepad) options.
  5. Status bar displays: encoding (UTF-8), line number, column number, and total character count.
  6. Cursor focus is placed in the text area immediately for typing.
  7. Window appearance matches actual Windows Notepad as closely as possible within browser constraints.
- NOTES None
- RELATED None

---

## UC-002 : End User - Type And Edit Note Content
- STEPS
  1. User places cursor in the editor text area.
  2. User types, deletes, and updates multi-line text.
  3. System reflects edits in real time.
  4. User edits text with Windows system fonts (Segoe UI or system default) and standard dark text on light background.
- ACCEPTANCE CRITERIA
  1. User can create and edit plain text notes without input errors.
  2. Editor supports line breaks, tabs, and normal keyboard editing behavior consistent with Notepad.
  3. Text updates are visible immediately after each input action.
  4. Font rendering matches actual Windows Notepad (Segoe UI or system default).
  5. Colors follow Windows system theme (standard light background with dark text).
- NOTES None
- RELATED UC-001

---

## UC-002B : End User - View Document Statistics in Status Bar
- STEPS
  1. User types or edits text in the editor.
  2. User observes the status bar at the bottom of the window.
  3. Status bar displays line number, column position, total character count, and file encoding.
- ACCEPTANCE CRITERIA
  1. Status bar shows current line number (1-indexed).
  2. Status bar shows current column position (1-indexed).
  3. Status bar shows total character count as user types.
  4. Status bar displays file encoding (UTF-8).
  5. All statistics update in real time as user types or navigates with arrow keys.
  6. Status bar appearance matches Windows Notepad style (gray bar at bottom with dark text).
- NOTES None
- RELATED UC-001, UC-002

## UC-003 : End User - Save Note To Local Storage
- STEPS
  1. User selects File > Save from the menu bar.
  2. System writes current note content to browser local storage.
  3. System updates the title bar to show the saved filename.
  4. System confirms save completion to user (optional visual feedback: brief status message).
- ACCEPTANCE CRITERIA
  1. Saved content persists after popup close and reopen.
  2. Save captures latest editor content at time of action.
  3. Title bar updates to show the filename after save (e.g., "document.txt - Notepad").
  4. User has explicit save action via File > Save menu.
  5. Save operates without server dependency (uses local storage only).
- NOTES None
- RELATED UC-002

---

## UC-004 : End User - Load Saved Note
- STEPS
  1. User selects File > Open from the menu bar.
  2. System displays a dialog or picker for selecting a saved note.
  3. User selects a previously saved note.
  4. System reads saved note from local storage.
  5. System renders loaded content in the editor.
  6. System updates title bar to show the loaded filename.
- ACCEPTANCE CRITERIA
  1. Previously saved content is restored accurately.
  2. Loaded content is editable immediately.
  3. Load behavior works consistently across sessions.
  4. Title bar updates to show the loaded filename (e.g., "document.txt - Notepad").
  5. File > Open menu provides clear interface to select saved notes.
- NOTES None
- RELATED UC-001, UC-003

---

## UC-005 : End User - Create New Blank Note
- STEPS
  1. User selects File > New from the menu bar.
  2. System detects unsaved changes.
  3. System prompts for confirmation when data loss is possible.
  4. User confirms the action.
  5. System clears editor to blank state.
  6. System updates title bar to "Untitled - Notepad".
  7. System resets status bar character count and line number to default (line 1, column 1).
- ACCEPTANCE CRITERIA
  1. New action resets editor to blank state when confirmed.
  2. Unsaved text is not discarded without warning.
  3. Canceling the prompt keeps the current note intact.
  4. Title bar updates to "Untitled - Notepad" after New is confirmed.
  5. Status bar resets to show line 1, column 1, character count 0.
- NOTES None
- RELATED UC-002, UC-003

---

## UC-006 : End User - Download Note As Text File
- STEPS
  1. User selects File > Save As from the menu bar.
  2. System packages current note as plain text.
  3. Browser download flow starts for user.
  4. User specifies filename (defaults to "Untitled.txt") and location.
  5. System downloads the file as plain text.
- ACCEPTANCE CRITERIA
  1. Downloaded file content matches editor content exactly.
  2. File extension defaults to .txt.
  3. Filename defaults to "Untitled.txt" for unsaved documents or current filename for saved files.
  4. Download completes without server dependency.
  5. File is plain UTF-8 text format compatible with any text editor.
- NOTES None
- RELATED UC-002

---

## UC-007 : End User - Prevent Accidental Data Loss
- STEPS
  1. User attempts New, Load, or Close with unsaved edits present.
  2. System identifies unsaved state.
  3. System shows continue or cancel confirmation prompt.
  4. System performs only the action selected by user.
- ACCEPTANCE CRITERIA
  1. Prompt appears for all destructive transitions with unsaved content.
  2. Continue option proceeds and may discard unsaved edits.
  3. Cancel option keeps current content and state unchanged.
- NOTES None
- IMPLEMENTATION COMMENT
  NP-REL-2026-04-03-001: The OS window close button (×) cannot be intercepted by a Chrome extension service worker to prompt for unsaved changes. The confirmation prompt covers New and Load actions as specified in STEPS. Close-button interception is a known Chrome extension platform limitation and is out of scope for this release.
- RELATED UC-004, UC-005

---

## UC-008 : End User - Use Notepad As A Desktop-Style Window
- STEPS
  1. User clicks the Chrome extension icon.
  2. System opens Notepad in a detached Chrome window styled to match Windows Notepad appearance.
  3. Window displays title bar with filename and system window controls (minimize, maximize, close).
  4. Window displays menu bar with File, Edit, View, and Help menus.
  5. Window displays the text editor and status bar at the bottom.
  6. User can move and resize the window.
  7. User can minimize, restore, and maximize the window.
- ACCEPTANCE CRITERIA
  1. Notepad opens in a standalone window with proper window title bar, menu bar, and status bar.
  2. Window appearance closely matches Windows Notepad with system fonts (Segoe UI) and standard colors.
  3. Window does not close when the user navigates or switches tabs in the main browser.
  4. Window position and size persist between sessions.
  5. All existing features (save, load, find, edit, etc.) continue to work within the detached window.
  6. Only one Notepad window is open at a time; clicking the icon again focuses the existing window.
  7. Window controls (minimize, maximize, close) function properly.
- NOTES None
- RELATED UC-001, UC-003, UC-004

---

## UC-009 : End User - View Keyboard Shortcuts In Help
- STEPS
  1. User clicks the Help menu in the menu bar.
  2. User selects "View Help" or sees shortcut information.
  3. System displays a help dialog listing all available keyboard shortcuts.
  4. Help dialog is styled as a Windows modal dialog with title bar, close button, and proper colors.
  5. User reviews the shortcuts list.
  6. User closes the help dialog by clicking Close button or pressing Escape.
- ACCEPTANCE CRITERIA
  1. Help dialog is accessible from Help menu in the menu bar.
  2. Help dialog lists all keyboard shortcuts supported by the application.
  3. Each shortcut entry shows the key combination and its action in clear format.
  4. Shortcuts displayed match the actual bindings active in the editor.
  5. Dialog styling matches Windows system dialog appearance.
  6. Dialog is dismissible with a Close button or the Escape key.
  7. Dialog has a title bar matching Windows window conventions.
- NOTES None
- RELATED UC-001, UC-002

---
