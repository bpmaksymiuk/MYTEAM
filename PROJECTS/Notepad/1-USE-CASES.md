UC-001 : End User - Open Notepad Popup
- STEPS
  1. User clicks the Chrome extension icon.
  2. System opens a popup window styled like Windows 95 Notepad.
  3. User sees a menu-like header and editable text area.
- ACCEPTANCE CRITERIA
  1. Popup opens from the extension icon in one click.
  2. UI appears in retro notepad style consistent with product vision.
  3. Cursor focus can be placed in the text area immediately.
- RELATED None

UC-002 : End User - Type And Edit Note Content
- STEPS
  1. User places cursor in the editor.
  2. User types, deletes, and updates multi-line text.
  3. System reflects edits in real time.
- ACCEPTANCE CRITERIA
  1. User can create and edit plain text notes without input errors.
  2. Editor supports line breaks and normal keyboard editing behavior.
  3. Text updates are visible immediately after each input action.
- RELATED UC-001

UC-003 : End User - Save Note To Local Storage
- STEPS
  1. User triggers Save action.
  2. System writes current note content to browser local storage.
  3. System confirms save completion to user.
- ACCEPTANCE CRITERIA
  1. Saved content persists after popup close and reopen.
  2. Save captures latest editor content at time of action.
  3. User gets explicit success feedback after save.
- RELATED UC-002

UC-004 : End User - Load Saved Note
- STEPS
  1. User opens popup or triggers Load action.
  2. System reads saved note from local storage.
  3. System renders loaded content in editor.
- ACCEPTANCE CRITERIA
  1. Previously saved content is restored accurately.
  2. Loaded content is editable immediately.
  3. Load behavior works consistently across sessions.
- RELATED UC-001, UC-003

UC-005 : End User - Create New Blank Note
- STEPS
  1. User triggers New action.
  2. System detects unsaved changes.
  3. System prompts for confirmation when data loss is possible.
  4. System clears editor on confirmed action.
- ACCEPTANCE CRITERIA
  1. New action resets editor to blank state when confirmed.
  2. Unsaved text is not discarded without warning.
  3. Canceling the prompt keeps the current note intact.
- RELATED UC-002, UC-003

UC-006 : End User - Download Note As Text File
- STEPS
  1. User triggers Save As or Download action.
  2. System packages current note as plain text.
  3. Browser download flow starts for user.
- ACCEPTANCE CRITERIA
  1. Downloaded file content matches editor content exactly.
  2. File extension defaults to .txt.
  3. Download completes without server dependency.
- RELATED UC-002

UC-007 : End User - Prevent Accidental Data Loss
- STEPS
  1. User attempts New, Load, or Close with unsaved edits present.
  2. System identifies unsaved state.
  3. System shows continue or cancel confirmation prompt.
  4. System performs only the action selected by user.
- ACCEPTANCE CRITERIA
  1. Prompt appears for all destructive transitions with unsaved content.
  2. Continue option proceeds and may discard unsaved edits.
  3. Cancel option keeps current content and state unchanged.
- RELATED UC-004, UC-005

UC-008 : End User - Use Notepad As A Desktop-Style Window
- STEPS
  1. User clicks the Chrome extension icon.
  2. System opens Notepad in a detached Chrome window rather than a browser popup.
  3. User moves the window by dragging the title bar.
  4. User resizes the window by dragging any edge or corner.
  5. User minimizes the window using the OS taskbar or window controls.
  6. User restores the window and continues editing from the same state.
- ACCEPTANCE CRITERIA
  1. Notepad opens in a standalone window with OS-level window chrome (move, resize, minimize, restore).
  2. Window does not close when the user navigates or switches tabs in the main browser.
  3. Window position and size persist between sessions.
  4. All existing features (save, load, find, etc.) continue to work within the detached window.
  5. Only one Notepad window is open at a time; clicking the icon again focuses the existing window.
- RELATED UC-001, UC-003, UC-004

UC-009 : End User - View Keyboard Shortcuts In Help
- STEPS
  1. User clicks the Help menu item.
  2. System displays a help dialog listing all available keyboard shortcuts.
  3. User reviews the shortcuts list.
  4. User closes the help dialog.
- ACCEPTANCE CRITERIA
  1. Help dialog lists all keyboard shortcuts supported by the application.
  2. Each shortcut entry shows the key combination and its action.
  3. Shortcuts displayed match the actual bindings active in the editor.
  4. Dialog is dismissible with a Close button or the Escape key.
- RELATED UC-001, UC-002
