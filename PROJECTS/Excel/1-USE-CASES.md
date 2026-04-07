## UC-001 : End User - Open Spreadsheet Window
- STEPS
  1. User clicks the Chrome extension icon.
  2. System opens a standalone window styled like Microsoft Excel.
  3. User sees a grid of rows and columns with a formula bar and toolbar.
- ACCEPTANCE CRITERIA
  1. Spreadsheet window opens from the extension icon in one click.
  2. Window is a detached OS-level window with resize, move, and minimize controls.
  3. An empty grid is displayed with column headers (A, B, C…) and row numbers (1, 2, 3…).
  4. Only one spreadsheet window is open at a time; clicking the icon again focuses the existing window.
- NOTES None
- RELATED None

---

## UC-002 : End User - Enter And Edit Cell Values
- STEPS
  1. User clicks a cell to select it.
  2. User types a value into the selected cell.
  3. User presses Enter, Tab, or an arrow key to confirm and move to the next cell.
  4. User double-clicks or presses F2 to edit an existing cell's content in place.
- ACCEPTANCE CRITERIA
  1. Selected cell is visually highlighted.
  2. Typed content appears in both the cell and the formula bar.
  3. Navigation keys (Enter, Tab, arrows) move focus to the adjacent cell.
  4. Editing an occupied cell overwrites only when confirmed; Escape cancels the edit.
- NOTES None
- RELATED UC-001

---

## UC-003 : End User - Enter A Formula Into A Cell
- STEPS
  1. User selects a cell and types a formula starting with =.
  2. User references other cells by address (e.g., =A1+B2).
  3. User presses Enter to confirm.
  4. System evaluates the formula and displays the computed result in the cell.
- ACCEPTANCE CRITERIA
  1. Formulas beginning with = are evaluated, not displayed as raw text.
  2. Supported operations include arithmetic (+, -, *, /) and basic functions (SUM, AVERAGE, MIN, MAX, COUNT).
  3. Cell references update the result when referenced cells change.
  4. Invalid formulas display a clear error indicator (e.g., #ERR).
- NOTES None
- RELATED UC-002

---

## UC-004 : End User - View And Edit Formula In Formula Bar
- STEPS
  1. User selects a cell that contains a formula.
  2. System displays the raw formula expression in the formula bar (not the computed value).
  3. User edits the formula in the formula bar and presses Enter to confirm.
- ACCEPTANCE CRITERIA
  1. Formula bar always shows the raw source (formula or value) of the active cell.
  2. Edits in the formula bar are reflected in the cell on confirmation.
  3. Escape cancels a formula bar edit without changing cell content.
- NOTES None
- RELATED UC-002, UC-003

---

## UC-005 : End User - Open A CSV File
- STEPS
  1. User triggers the Open action (File menu or keyboard shortcut).
  2. System opens a file picker dialog.
  3. User selects a .csv file from the local filesystem.
  4. System parses the CSV and populates the grid with its contents.
- ACCEPTANCE CRITERIA
  1. File picker accepts .csv files only.
  2. CSV rows map to spreadsheet rows; comma-separated values map to columns.
  3. Existing unsaved grid content triggers a confirmation prompt before loading.
  4. Malformed or unreadable files display a clear error message.
- NOTES None
- RELATED UC-001, UC-002

---

## UC-006 : End User - Save Grid As A CSV File
- STEPS
  1. User triggers the Save action (File menu or keyboard shortcut).
  2. System serializes the current grid contents to CSV format.
  3. Browser initiates a file download with a .csv extension.
- ACCEPTANCE CRITERIA
  1. Saved file contains all non-empty rows and columns in CSV format.
  2. Cells with commas or newlines in their content are properly quoted per RFC 4180.
  3. Download completes without any server dependency.
  4. File extension defaults to .csv.
- NOTES None
- RELATED UC-002, UC-003, UC-005

---

## UC-007 : End User - Prevent Accidental Data Loss
- STEPS
  1. User attempts to open a new file or create a new sheet while unsaved edits are present.
  2. System detects the unsaved state.
  3. System displays a confirmation prompt (continue or cancel).
  4. System proceeds only if the user confirms.
- ACCEPTANCE CRITERIA
  1. Prompt appears for all actions that would discard unsaved work.
  2. Confirming clears or replaces the current grid.
  3. Canceling leaves the grid and all edits intact.
- NOTES None
- RELATED UC-005, UC-006

---

## UC-008 : End User - Use Keyboard Shortcuts For Common Actions
- STEPS
  1. User presses a keyboard shortcut (e.g., Ctrl+S to save, Ctrl+O to open).
  2. System performs the corresponding action without requiring menu interaction.
- ACCEPTANCE CRITERIA
  1. Ctrl+S triggers Save.
  2. Ctrl+O triggers Open file picker.
  3. Ctrl+Home moves focus to cell A1.
  4. All active shortcuts are listed in a Help dialog.
- NOTES None
- RELATED UC-005, UC-006

---

## UC-009 : End User - Persist Window Position And Size
- STEPS
  1. User moves or resizes the spreadsheet window.
  2. User closes and reopens the window.
  3. System restores the window to the same position and size.
- ACCEPTANCE CRITERIA
  1. Window position and size are saved when the window is moved or resized.
  2. On next open, the window appears at the previously saved position and size.
  3. A sensible default position and size is used when no saved state exists.
- NOTES None
- RELATED UC-001

---

## UC-010 : End User - View Keyboard Shortcuts In Help
- STEPS
  1. User opens the Help menu or presses F1.
  2. System displays a dialog listing all available keyboard shortcuts.
  3. User reviews the list and closes the dialog.
- ACCEPTANCE CRITERIA
  1. Help dialog lists every supported keyboard shortcut with its key combination and action.
  2. Displayed shortcuts match the actual active bindings.
  3. Dialog is closeable via a Close button or the Escape key.
- NOTES None
- RELATED UC-008
