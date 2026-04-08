# Business Requirements — Notepad.exe

## BR-001 : System shall open Notepad window from Chrome extension icon in a single user action
- TESTABLE CONDITION: Clicking the extension icon results in the Notepad window appearing without any additional steps required
- NOTES: None
- RELATED: UC-001

---

## BR-002 : System shall display a title bar showing "Untitled - Notepad" when no file is loaded
- TESTABLE CONDITION: On open with no saved file, the title bar text reads exactly "Untitled - Notepad"
- NOTES: None
- RELATED: UC-001

---

## BR-003 : System shall display minimize, maximize, and close controls in the title bar
- TESTABLE CONDITION: Three window control buttons (minimize, maximize, close) are visible in the title bar area
- NOTES: Native OS window controls provided by Chrome detached window
- RELATED: UC-001, UC-008

---

## BR-004 : System shall display a menu bar with File, Edit, View, and Help top-level menus
- TESTABLE CONDITION: Four menu labels — File, Edit, View, Help — are visible in the menu bar at all times
- NOTES: None
- RELATED: UC-001

---

## BR-005 : File menu shall contain New, Open, Save, Save As, and Exit items
- TESTABLE CONDITION: Opening the File menu reveals exactly the items: New, Open, Save, Save As, Exit
- NOTES: None
- RELATED: UC-001

---

## BR-006 : Edit menu shall contain Undo, Cut, Copy, Paste, Find, and Replace items
- TESTABLE CONDITION: Opening the Edit menu reveals at minimum: Undo, Cut, Copy, Paste, Find, Replace
- NOTES: None
- RELATED: UC-001

---

## BR-007 : View menu shall contain Word Wrap and Zoom items
- TESTABLE CONDITION: Opening the View menu reveals Word Wrap and Zoom options
- NOTES: None
- RELATED: UC-001

---

## BR-008 : Help menu shall contain View Help and About Notepad items
- TESTABLE CONDITION: Opening the Help menu reveals View Help and About Notepad options
- NOTES: None
- RELATED: UC-001, UC-009

---

## BR-009 : System shall display a scrollable text editor area as the main content region
- TESTABLE CONDITION: A textarea or content-editable region occupies the central area of the window and accepts text input
- NOTES: None
- RELATED: UC-001, UC-002

---

## BR-010 : System shall display a status bar at the bottom of the window
- TESTABLE CONDITION: A horizontal bar is visible at the bottom of the window below the editor area
- NOTES: None
- RELATED: UC-001, UC-002B

---

## BR-011 : System shall apply Windows system fonts (Segoe UI or system default) to all UI elements
- TESTABLE CONDITION: UI chrome (menus, title bar, status bar) renders in Segoe UI or the OS default sans-serif font
- NOTES: None
- RELATED: UC-001, UC-002

---

## BR-012 : System shall apply Windows Notepad color scheme (light background, dark text, gray chrome) to the UI
- TESTABLE CONDITION: Editor background is white or near-white; text is dark; menu bar and status bar use gray tones matching standard Windows Notepad
- NOTES: None
- RELATED: UC-001, UC-002

---

## BR-013 : System shall place cursor focus in the text editor immediately upon window open
- TESTABLE CONDITION: User can begin typing immediately after the window opens without clicking the editor first
- NOTES: None
- RELATED: UC-001

---

## BR-014 : User shall be able to type plain text into the editor area
- TESTABLE CONDITION: Characters typed on the keyboard appear in the editor at the cursor position
- NOTES: None
- RELATED: UC-002

---

## BR-015 : Editor shall insert a line break when user presses the Enter key
- TESTABLE CONDITION: Pressing Enter moves the cursor to a new line; subsequent text appears on the new line
- NOTES: None
- RELATED: UC-002

---

## BR-016 : Editor shall support Tab key insertion consistent with Windows Notepad behavior
- TESTABLE CONDITION: Pressing Tab inserts a tab character at the cursor position (does not move focus away from editor)
- NOTES: None
- RELATED: UC-002

---

## BR-017 : Editor shall support text deletion via Backspace and Delete keys
- TESTABLE CONDITION: Pressing Backspace removes the character before the cursor; pressing Delete removes the character after the cursor
- NOTES: None
- RELATED: UC-002

---

## BR-018 : Editor shall reflect all input changes immediately without perceptible delay
- TESTABLE CONDITION: Each keystroke results in visible text change within the same animation frame (no debounce or async delay)
- NOTES: None
- RELATED: UC-002

---

## BR-019 : Status bar shall display the current line number of the cursor position (1-indexed)
- TESTABLE CONDITION: The status bar shows "Ln N" (or equivalent) where N matches the cursor's current line; updates on cursor movement
- NOTES: None
- RELATED: UC-002B

---

## BR-020 : Status bar shall display the current column position of the cursor (1-indexed)
- TESTABLE CONDITION: The status bar shows "Col N" (or equivalent) where N matches the cursor's current column; updates on cursor movement
- NOTES: None
- RELATED: UC-002B

---

## BR-021 : Status bar shall display the total character count of the document
- TESTABLE CONDITION: The status bar shows an accurate character count that increments on each character typed and decrements on deletion
- NOTES: None
- RELATED: UC-002B

---

## BR-022 : Status bar shall display the file encoding as "UTF-8"
- TESTABLE CONDITION: The status bar shows "UTF-8" (or equivalent label) at all times
- NOTES: None
- RELATED: UC-002B

---

## BR-023 : Status bar shall update all statistics in real time as user types or navigates with arrow keys
- TESTABLE CONDITION: Line, column, and character count values in the status bar change within one render cycle of each input event or arrow key press
- NOTES: None
- RELATED: UC-002B

---

## BR-024 : Status bar shall use Windows Notepad visual style (gray bar with dark text at bottom of window)
- TESTABLE CONDITION: Status bar has a gray background and dark text color; it is positioned at the very bottom of the window
- NOTES: None
- RELATED: UC-002B

---

## BR-025 : System shall save editor content to browser local storage when user selects File > Save
- TESTABLE CONDITION: After selecting File > Save, `localStorage` contains an entry with the current editor text
- NOTES: None
- RELATED: UC-003

---

## BR-026 : Saved content shall persist after the extension window is closed and reopened
- TESTABLE CONDITION: Closing and reopening the extension after a save restores the previously saved text in the editor
- NOTES: None
- RELATED: UC-003, UC-004

---

## BR-027 : System shall capture the exact editor content at the time of the save action
- TESTABLE CONDITION: The content written to local storage byte-for-byte matches the editor content at the moment Save was invoked
- NOTES: None
- RELATED: UC-003

---

## BR-028 : System shall update the title bar to show the saved filename after save
- TESTABLE CONDITION: After saving as "document.txt", the title bar displays "document.txt - Notepad"
- NOTES: None
- RELATED: UC-003

---

## BR-029 : Save operation shall complete without any external server dependency
- TESTABLE CONDITION: Save completes successfully with no network requests issued (verified via browser DevTools network log showing 0 requests on save)
- NOTES: None
- RELATED: UC-003

---

## BR-030 : System shall display a list or picker of saved notes when user selects File > Open
- TESTABLE CONDITION: Selecting File > Open shows a UI element listing all previously saved note names
- NOTES: None
- RELATED: UC-004

---

## BR-031 : System shall load selected note content from local storage into the editor
- TESTABLE CONDITION: Selecting a note from the Open picker populates the editor with the exact saved text
- NOTES: None
- RELATED: UC-004

---

## BR-032 : Loaded content shall be immediately editable in the editor after load
- TESTABLE CONDITION: User can type, delete, or modify the loaded text immediately without any additional action
- NOTES: None
- RELATED: UC-004

---

## BR-033 : System shall update the title bar to the loaded filename after a successful load
- TESTABLE CONDITION: After loading "notes.txt", the title bar displays "notes.txt - Notepad"
- NOTES: None
- RELATED: UC-004

---

## BR-034 : Load operation shall work consistently across browser sessions
- TESTABLE CONDITION: A note saved in one session is retrievable via File > Open in a new browser session without data loss
- NOTES: None
- RELATED: UC-004

---

## BR-035 : System shall clear the editor to a blank state when user selects File > New and confirms
- TESTABLE CONDITION: After confirming New, the editor is empty and the character count reads 0
- NOTES: None
- RELATED: UC-005

---

## BR-036 : System shall detect whether unsaved changes are present before executing the New action
- TESTABLE CONDITION: If the editor has unsaved text and user selects File > New, a confirmation prompt appears; if no unsaved changes exist, no prompt appears
- NOTES: None
- RELATED: UC-005, UC-007

---

## BR-037 : System shall display a confirmation prompt before discarding unsaved content on New
- TESTABLE CONDITION: A dialog or modal appears asking user to confirm or cancel the New action when unsaved changes are present
- NOTES: None
- RELATED: UC-005, UC-007

---

## BR-038 : System shall cancel the New action and preserve current content when user dismisses the confirmation prompt
- TESTABLE CONDITION: Clicking Cancel on the New confirmation leaves the editor content and title bar unchanged
- NOTES: None
- RELATED: UC-005, UC-007

---

## BR-039 : System shall update the title bar to "Untitled - Notepad" after New is confirmed
- TESTABLE CONDITION: After confirming New, the title bar reads exactly "Untitled - Notepad"
- NOTES: None
- RELATED: UC-005

---

## BR-040 : System shall reset the status bar to line 1, column 1, and character count 0 after New
- TESTABLE CONDITION: After confirming New, the status bar shows Ln 1, Col 1, and character count 0
- NOTES: None
- RELATED: UC-005

---

## BR-041 : System shall initiate a browser file download when user selects File > Save As
- TESTABLE CONDITION: Selecting File > Save As triggers a browser download without any server call
- NOTES: None
- RELATED: UC-006

---

## BR-042 : Downloaded file content shall match the editor content exactly
- TESTABLE CONDITION: The downloaded file, opened in any text editor, contains byte-for-byte identical content to what was in the editor at save time
- NOTES: None
- RELATED: UC-006

---

## BR-043 : Downloaded file extension shall default to .txt
- TESTABLE CONDITION: The downloaded file has a .txt extension when no custom name is specified
- NOTES: None
- RELATED: UC-006

---

## BR-044 : Default download filename shall be "Untitled.txt" for unsaved documents, or the current filename for saved documents
- TESTABLE CONDITION: For a new unsaved document, the download is named "Untitled.txt"; for a document saved as "notes.txt", the download is named "notes.txt"
- NOTES: None
- RELATED: UC-006

---

## BR-045 : Downloaded file shall be encoded as plain UTF-8 text
- TESTABLE CONDITION: The downloaded file's encoding is UTF-8 (verified by file content inspection or browser Blob type "text/plain;charset=utf-8")
- NOTES: None
- RELATED: UC-006

---

## BR-046 : System shall detect unsaved changes before executing the Load (Open) action
- TESTABLE CONDITION: If unsaved changes exist and user selects File > Open, a confirmation prompt appears before the picker is shown or a note is loaded
- NOTES: None
- RELATED: UC-007

---

## BR-047 : System shall display a confirmation prompt before any action that would discard unsaved changes
- TESTABLE CONDITION: A confirmation dialog appears for New and Open actions when the editor has unsaved text; the dialog presents a confirm and a cancel option
- NOTES: Applies to New (UC-005) and Open/Load (UC-004). OS window close interception is out of scope per UC-007 IMPLEMENTATION COMMENT.
- RELATED: UC-007

---

## BR-048 : System shall proceed with the destructive action only when user explicitly confirms
- TESTABLE CONDITION: The New or Open action executes only after user clicks the confirm option in the prompt; clicking cancel does not execute the action
- NOTES: None
- RELATED: UC-007

---

## BR-049 : System shall open Notepad in a detached Chrome window (not a popup or browser tab)
- TESTABLE CONDITION: The extension opens a standalone Chrome window (`chrome.windows.create`) with its own title bar separate from the main browser window
- NOTES: Requires Chrome extension Manifest V3 windows API
- RELATED: UC-008

---

## BR-050 : Detached window shall remain open when user navigates or switches tabs in the main browser
- TESTABLE CONDITION: After the Notepad window opens, switching tabs or navigating in the main browser does not close the Notepad window
- NOTES: None
- RELATED: UC-008

---

## BR-051 : System shall persist window position and size between sessions
- TESTABLE CONDITION: Resizing and repositioning the Notepad window, closing it, and reopening it restores the previous size and position
- NOTES: None
- RELATED: UC-008

---

## BR-052 : System shall ensure only one Notepad window is open at a time
- TESTABLE CONDITION: Clicking the extension icon when a Notepad window already exists focuses that window rather than opening a second one
- NOTES: None
- RELATED: UC-008

---

## BR-053 : All application features shall function within the detached window
- TESTABLE CONDITION: Save, Load, New, Find, Replace, and all other features work identically inside the detached window as they would in a popup
- NOTES: None
- RELATED: UC-008

---

## BR-054 : System shall display a help dialog when user selects View Help from the Help menu
- TESTABLE CONDITION: Clicking Help > View Help opens a modal dialog within the Notepad window
- NOTES: None
- RELATED: UC-009

---

## BR-055 : Help dialog shall list all keyboard shortcuts supported by the application
- TESTABLE CONDITION: The help dialog contains an entry for every keyboard shortcut that is active in the editor (verified by cross-referencing dialog content with implemented bindings)
- NOTES: None
- RELATED: UC-009

---

## BR-056 : Each keyboard shortcut entry in the help dialog shall display the key combination and its action
- TESTABLE CONDITION: Each row in the help dialog shows a key combination (e.g., "Ctrl+Z") and a plain-language description of its effect (e.g., "Undo")
- NOTES: None
- RELATED: UC-009

---

## BR-057 : Help dialog shall be styled to match Windows system dialog appearance
- TESTABLE CONDITION: Help dialog has a title bar, modal overlay, and color scheme consistent with Windows dialog style (gray title bar, white content area, standard button styles)
- NOTES: None
- RELATED: UC-009

---

## BR-058 : Help dialog shall be dismissible by clicking a Close button
- TESTABLE CONDITION: A Close button is visible in the help dialog; clicking it closes the dialog and returns focus to the editor
- NOTES: None
- RELATED: UC-009

---

## BR-059 : Help dialog shall be dismissible by pressing the Escape key
- TESTABLE CONDITION: With the help dialog open, pressing Escape closes it without any other action
- NOTES: None
- RELATED: UC-009

---

## BR-060 : Application shall operate entirely client-side with no external server requests
- TESTABLE CONDITION: All application functionality (save, load, download, render) produces zero outbound network requests (verified via DevTools Network panel)
- NOTES: Implied non-functional requirement across all UCs
- RELATED: (implied)

---

## BR-061 : Application shall store all user data in browser local storage only
- TESTABLE CONDITION: All persisted note data is stored under `localStorage` keys; no cookies, indexedDB, or remote storage is used
- NOTES: Implied data privacy requirement
- RELATED: (implied)

---
