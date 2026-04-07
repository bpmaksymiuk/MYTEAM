## BR-001 : System shall open Notepad as a detached standalone window from the Chrome extension icon
- Clicking the extension icon opens exactly one detached window; clicking again focuses the existing window rather than opening a second.
- NOTES Uses chrome.windows API; service worker tracks open window ID.
- RELATED UC-001, UC-008
---

## BR-002 : Title bar shall display "Untitled - Notepad" for new documents and "[Filename] - Notepad" for saved or loaded documents
- Title bar text matches the pattern `<filename> - Notepad`; new document shows `Untitled - Notepad`; title updates immediately after New, Save, or Load.
- NOTES Title is implemented in the HTML page title, not OS chrome.
- RELATED UC-001, UC-003, UC-004, UC-005
---

## BR-003 : Window shall display a horizontal menu bar with File, Edit, View, and Help menus
- Menu bar is visible below the title area; each of the four menus opens a dropdown on click; menu bar uses light gray background styled to match Windows Notepad.
- NOTES File: New, Open, Save, Save As, Exit. Edit: Undo, Cut, Copy, Paste, Find, Replace. View: Word Wrap, Zoom. Help: View Help, About Notepad.
- RELATED UC-001
---

## BR-004 : Window shall display a multi-line text editor area that occupies the central space
- Text editor occupies the main body of the window; user can type, delete, and navigate with arrow keys, Home, End, Page Up, Page Down; Tab key inserts a tab character.
- NOTES Uses `<textarea>` element. Editor background is white; text is dark.
- RELATED UC-001, UC-002
---

## BR-005 : Window shall display a status bar at the bottom showing encoding, line number, column position, and character count
- Status bar is permanently visible and does not scroll; displays all four values simultaneously; styled as a gray bar matching Windows Notepad.
- NOTES Read-only UI strip. Order: Encoding | Ln | Col | Char count.
- RELATED UC-001, UC-002B
---

## BR-006 : Application shall use Windows Notepad–consistent fonts, colors, and layout
- UI uses Segoe UI or system sans-serif fallback; menu bar background is light gray; editor background is white; text is black or near-black; spacing and proportions match Windows Notepad.
- NOTES CSS custom properties to centralize theme values.
- RELATED UC-001, UC-008
---

## BR-007 : Editor shall display typed characters immediately with no discernible delay
- Each keystroke appends or removes the correct character; backspace and delete behave correctly; Enter creates a new line; Tab inserts whitespace.
- NOTES Standard textarea behavior; no custom input interception required for basic typing.
- RELATED UC-002
---

## BR-008 : Editor shall support undo via Ctrl+Z
- Pressing Ctrl+Z restores the editor to the state before the most recent change; undo is available via Edit > Undo menu item; menu item is grayed out when undo stack is empty.
- NOTES Custom undo stack in JavaScript (undoStack array with pushUndo/undo helpers).
- RELATED UC-002
---

## BR-009 : Editor shall support Cut (Ctrl+X), Copy (Ctrl+C), and Paste (Ctrl+V) operations
- Ctrl+X removes selected text and places it on the clipboard; Ctrl+C copies selected text; Ctrl+V pastes clipboard content at cursor position; operations also accessible via Edit menu.
- NOTES Browser native clipboard API handles these; Edit menu items trigger the same actions.
- RELATED UC-002
---

## BR-010 : Status bar shall display the current cursor line number (1-indexed) in real time
- Status bar shows `Ln N` where N is the 1-indexed line of the cursor; value updates on every keypress and cursor movement via arrow keys.
- NOTES Derived from textarea.selectionStart and counting newlines before the cursor.
- RELATED UC-002B
---

## BR-011 : Status bar shall display the current cursor column position (1-indexed) in real time
- Status bar shows `Col N` where N is the 1-indexed column within the current line; value updates on every keypress and cursor movement.
- NOTES Column counts characters, not bytes; counts from last newline to cursor position.
- RELATED UC-002B
---

## BR-012 : Status bar shall display the total character count of the document in real time
- Status bar shows the total number of characters (including spaces, tabs, and newlines); count updates as user types, pastes, deletes, or undoes.
- NOTES Derived from textarea.value.length.
- RELATED UC-002B
---

## BR-013 : Status bar shall display the file encoding as "UTF-8" at all times
- Status bar shows `UTF-8`; value never changes and is visible even on a blank unsaved document.
- NOTES Hardcoded constant; the app always uses UTF-8.
- RELATED UC-002B
---

## BR-014 : File > Save shall write current editor content to chrome.storage.local
- Selecting File > Save or pressing Ctrl+S writes content to local storage immediately; no network request is made; the dirty flag is cleared after a successful save.
- NOTES Key: current filename. Value: editor text.
- RELATED UC-003
---

## BR-015 : System shall track and display the filename of the currently active document
- Filename is stored alongside content; displayed in the title bar; used as default name for Save As downloads; persists across window close and reopen.
- NOTES Stored as a separate key in chrome.storage.local.
- RELATED UC-003, UC-004
---

## BR-016 : Title bar shall show an unsaved-changes indicator when content differs from last save
- A visual marker (e.g., asterisk prefix `* Untitled - Notepad`) appears in the title when the editor is dirty; indicator is removed immediately after Save or Load operations complete.
- NOTES Dirty flag is set on any input event; cleared on Save or Load.
- RELATED UC-003, UC-007
---

## BR-017 : On window open, system shall automatically load the last saved content from local storage
- When the Notepad window is opened, the editor is pre-populated with the most recently saved content; title bar shows the saved filename; unsaved indicator is not shown.
- NOTES If no saved content exists, editor starts blank with "Untitled - Notepad".
- RELATED UC-004
---

## BR-018 : File > Open shall display a list of all saved notes for user selection
- Selecting File > Open or pressing Ctrl+O shows a dialog or picker listing all notes stored in chrome.storage.local; user selects one to load it; canceling leaves current document unchanged.
- NOTES Shows "No saved notes" if storage is empty.
- RELATED UC-004
---

## BR-019 : Loaded content shall be immediately editable and undo history shall be reset
- After loading a note, the cursor is placed in the editor and the user can type immediately; the undo stack is cleared (load is not undoable).
- NOTES No additional confirmation or dialog after successful load.
- RELATED UC-004
---

## BR-020 : File > New shall clear the editor to a blank state after optional confirmation
- Selecting File > New or pressing Ctrl+N clears the editor; if dirty, a confirmation dialog appears first; if user cancels, current content is preserved intact.
- NOTES Confirmation dialog required only when dirty flag is set.
- RELATED UC-005
---

## BR-021 : After New is confirmed, title bar shall reset to "Untitled - Notepad"
- Title bar displays exactly `Untitled - Notepad` immediately after new document is created; unsaved indicator is absent on a blank new document.
- NOTES Title updates synchronously with the clear operation.
- RELATED UC-005
---

## BR-022 : After New is confirmed, status bar shall reset to Ln 1, Col 1, 0 chars
- All four status bar values reset: line shows `Ln 1`, column shows `Col 1`, character count shows `0`, encoding shows `UTF-8`.
- NOTES Reset happens synchronously with editor clear.
- RELATED UC-005
---

## BR-023 : File > Save As shall trigger a browser file download of the current editor content as plain text
- Selecting File > Save As initiates a download without any server request; browser download dialog appears; file is encoded as UTF-8 plain text.
- NOTES Uses Blob API and URL.createObjectURL; blob URL revoked after download.
- RELATED UC-006
---

## BR-024 : Downloaded file shall have a .txt extension and content exactly matching the editor
- Default filename is `Untitled.txt` for unnamed documents or `<CurrentFilename>.txt` for named documents; file content is byte-for-byte identical to textarea.value.
- NOTES No BOM added. Line endings preserved as in textarea.
- RELATED UC-006
---

## BR-025 : System shall detect unsaved changes before any destructive operation and prompt the user
- Before New or Load when dirty, a confirmation dialog appears with Continue and Cancel options; Continue proceeds and discards unsaved changes; Cancel aborts the operation.
- NOTES Chrome MV3 constraint: window close button cannot be intercepted; no prompt on OS close.
- RELATED UC-007
---

## BR-026 : Notepad window shall restore to its previous position and size on reopen
- When the window is closed and reopened, it appears at the previously saved x/y position and width/height; first-time default is centered at 800×600.
- NOTES Position and size saved to chrome.storage.local on window move/resize events.
- RELATED UC-008
---

## BR-027 : Only one Notepad window shall be open at a time; clicking the icon again shall focus it
- If a Notepad window is already open, clicking the extension icon brings that window to focus instead of creating a new one; tracked via service worker window ID.
- NOTES Use chrome.windows.update with focused:true to refocus.
- RELATED UC-008
---

## BR-028 : Help > View Help shall open a modal dialog listing all keyboard shortcuts
- Selecting Help > View Help or pressing F1 opens a modal dialog showing a table of shortcut–action pairs; dialog is closeable by Close button or Escape key; shortcuts listed match actual active bindings.
- NOTES Dialog is read-only and styled to match Windows system dialog appearance.
- RELATED UC-009
---

## BR-029 : Help dialog content shall be derived from the same data source as the menu bar shortcut labels
- Keyboard shortcuts are defined in one structure in code; menu bar labels and Help dialog both render from that single source; adding a shortcut automatically appears in both places.
- NOTES Prevents shortcut description drift between menus and help.
- RELATED UC-009
---

## BR-030 : Application shall provide Find functionality accessible via Edit > Find or Ctrl+F
- Pressing Ctrl+F or selecting Edit > Find opens a Find bar or dialog; user can enter a search term; first match is highlighted in the editor; pressing Enter or F3 finds the next match.
- NOTES Case-insensitive search for MVP. Shows "Not found" when no match exists.
- RELATED UC-002
---
