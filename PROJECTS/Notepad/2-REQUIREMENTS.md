# Business Requirements

Generated from `1-USE-CASES.md`. Owned by Business Analyst.

---

## BR-001 : The extension shall provide a toolbar icon that, when clicked, opens the Notepad window
- PRIORITY
  HIGH
- TESTABLE CONDITION
  Given the extension is installed and enabled, when the user clicks the browser toolbar icon, then the Notepad window opens within 1 second.
- NOTES None
- RELATED UC-001

---

## BR-002 : The system shall render the Notepad window in a visual style consistent with Windows 95 Notepad
- PRIORITY
  HIGH
- TESTABLE CONDITION
  Given the Notepad window is open, then the UI displays a navy title bar, silver window chrome, beveled borders, Courier New monospace font, and a retro menu bar styled to match the Windows 95 Notepad aesthetic.
- NOTES Includes title bar, menu bar, editor area, and status bar styling.
- RELATED UC-001

---

## BR-003 : The text area shall receive keyboard focus immediately upon window open
- PRIORITY
  HIGH
- TESTABLE CONDITION
  Given the Notepad window has just opened, then the editor textarea is focused and ready to accept keyboard input without requiring an additional click.
- NOTES None
- RELATED UC-001

---

## BR-004 : The editor shall render user-typed text in real time without input lag
- PRIORITY
  HIGH
- TESTABLE CONDITION
  Given the user is typing in the editor, then each keystroke is reflected in the editor immediately with no visible delay.
- NOTES None
- RELATED UC-002

---

## BR-005 : The editor shall support multi-line plain text with standard keyboard editing behavior
- PRIORITY
  HIGH
- TESTABLE CONDITION
  Given the editor is focused, then the user can type multi-line content, use backspace and delete, move with arrow keys, and select text with Shift+arrow keys.
- NOTES Tab key behavior should insert a tab character or advance focus consistently.
- RELATED UC-002

---

## BR-006 : The system shall write current editor content to persistent browser storage when Save is triggered
- PRIORITY
  HIGH
- TESTABLE CONDITION
  Given content exists in the editor, when the user triggers Save (menu or Ctrl+S), then the content is written to chrome.storage.local under the key 'noteContent'.
- NOTES None
- RELATED UC-003

---

## BR-007 : The saved content shall persist and be retrievable after the extension window is closed and reopened
- PRIORITY
  HIGH
- TESTABLE CONDITION
  Given a note has been saved, when the user closes the Notepad window and reopens it by clicking the toolbar icon, then the previously saved content is displayed in the editor.
- NOTES Persistence must survive browser restart, not just tab reload.
- RELATED UC-003, UC-004

---

## BR-008 : The system shall provide visible feedback indicating a save was completed successfully
- PRIORITY
  MEDIUM
- TESTABLE CONDITION
  Given the user triggers Save, then the title bar or status bar displays a visual confirmation (e.g., "Saved") within 500 ms of the write completing.
- NOTES Feedback must be visible without requiring user interaction.
- RELATED UC-003

---

## BR-009 : The system shall automatically load the most recently saved note when the Notepad window opens
- PRIORITY
  MEDIUM
- TESTABLE CONDITION
  Given a note has been previously saved, when the Notepad window opens, then the saved content is loaded into the editor before the user types anything.
- NOTES None
- RELATED UC-004

---

## BR-010 : Loaded content shall be immediately editable after loading
- PRIORITY
  MEDIUM
- TESTABLE CONDITION
  Given content has been loaded from storage, then the user can place the cursor anywhere and type without any additional action.
- NOTES None
- RELATED UC-004

---

## BR-011 : The system shall clear the editor to a blank state when New is confirmed
- PRIORITY
  MEDIUM
- TESTABLE CONDITION
  Given the user triggers New and confirms the prompt (if present), then the editor is cleared to an empty string with no residual content.
- NOTES None
- RELATED UC-005

---

## BR-012 : The system shall detect whether unsaved changes exist before executing a destructive action
- PRIORITY
  HIGH
- TESTABLE CONDITION
  Given the user has typed content that has not been saved, when the user triggers New or Load, then the system identifies the dirty state and gates the action behind a confirmation.
- NOTES Dirty state is reset after Save, after Load completes, and after New clears the editor.
- RELATED UC-005, UC-007

---

## BR-013 : The system shall display a confirmation prompt when a destructive action is attempted with unsaved content present
- PRIORITY
  HIGH
- TESTABLE CONDITION
  Given the editor has unsaved content, when the user triggers New or Load, then a confirmation dialog appears before any content is discarded.
- NOTES The OS window close button (×) cannot be intercepted in a Chrome extension service worker; this limitation must be documented as a known caveat.
- RELATED UC-005, UC-007

---

## BR-014 : The system shall cancel the destructive action and preserve current content when the user cancels the confirmation prompt
- PRIORITY
  HIGH
- TESTABLE CONDITION
  Given the confirmation prompt is displayed, when the user selects Cancel, then the editor retains its current content and the triggering action does not proceed.
- NOTES None
- RELATED UC-007

---

## BR-015 : The system shall produce a downloadable plain-text file from the current editor content when Download is triggered
- PRIORITY
  MEDIUM
- TESTABLE CONDITION
  Given the user triggers Download (Save As), then the browser initiates a file download with content exactly matching the editor's current text.
- NOTES Must work without any server dependency.
- RELATED UC-006

---

## BR-016 : The downloaded file shall have a .txt extension and content that exactly matches the current editor state
- PRIORITY
  MEDIUM
- TESTABLE CONDITION
  Given a download completes, then the saved file has a .txt extension and its content is byte-for-byte equal to the editor content at the time of download.
- NOTES None
- RELATED UC-006

---

## BR-017 : The extension shall open Notepad in a detached standalone Chrome window
- PRIORITY
  HIGH
- TESTABLE CONDITION
  Given the user clicks the extension toolbar icon, then Notepad opens in a chrome.windows-managed window with OS-level chrome (title bar, resize handles, minimize), not a browser popup.
- NOTES Window type should be 'popup' in chrome.windows.create to get a clean standalone window.
- RELATED UC-008

---

## BR-018 : The Notepad window shall persist its position and size between sessions
- PRIORITY
  MEDIUM
- TESTABLE CONDITION
  Given the user repositioned or resized the Notepad window, when they close and reopen it, then the window opens at the same position and size as when it was last closed.
- NOTES Bounds stored in chrome.storage.local under key 'windowBounds'. Default fallback: left:100, top:100, width:700, height:500.
- RELATED UC-008

---

## BR-019 : Only one Notepad window shall be open at a time; clicking the icon when a window exists shall focus it
- PRIORITY
  MEDIUM
- TESTABLE CONDITION
  Given a Notepad window is already open, when the user clicks the toolbar icon again, then the existing window is brought to the foreground rather than a second window being created.
- NOTES Service worker must track the active windowId in memory and clear it on window close.
- RELATED UC-008

---

## BR-020 : The system shall display a Help dialog listing all keyboard shortcuts when Help is selected
- PRIORITY
  MEDIUM
- TESTABLE CONDITION
  Given the user clicks Help in the menu bar, then a dialog opens listing each supported keyboard shortcut with its key combination and action label.
- NOTES None
- RELATED UC-009

---

## BR-021 : Each entry in the Help dialog shall display the key combination and its action description
- PRIORITY
  LOW
- TESTABLE CONDITION
  Given the Help dialog is open, then each row shows exactly one key combination (e.g., Ctrl+S) and exactly one action label (e.g., Save).
- NOTES Shortcut list in Help must be derived from the same data source used to register the shortcuts, ensuring they stay in sync.
- RELATED UC-009

---

## BR-022 : The Help dialog shall be closeable via a Close button and via the Escape key
- PRIORITY
  MEDIUM
- TESTABLE CONDITION
  Given the Help dialog is open, when the user clicks the Close button or presses Escape, then the dialog is dismissed and the editor regains focus.
- NOTES HTML dialog element provides built-in Escape support via the 'cancel' event.
- RELATED UC-009
