## UC-001 : End User - Open Spreadsheet Window
- STEPS
  1. User clicks the Chrome extension icon.
  2. System opens a standalone window styled exactly like Microsoft Excel for Windows.
  3. User sees the full Excel UI: title bar reading "Book1 - Excel", menu bar (File, Home, Insert, Page Layout, Formulas, Data, Review, View), ribbon toolbar below the menu bar, Name Box showing "A1", formula bar with fx label, the cell grid with column headers (A, B, C…) and row numbers (1, 2, 3…), and a sheet tab bar at the bottom showing "Sheet1".
- ACCEPTANCE CRITERIA
  1. Spreadsheet window opens from the extension icon in one click.
  2. Window is a detached OS-level window.
  3. Title bar displays "Book1 - Excel" for a new unsaved workbook.
  4. Menu bar is present with exactly the tabs: File, Home, Insert, Page Layout, Formulas, Data, Review, View.
  5. Ribbon toolbar is visible below the menu bar with grouped action buttons (Bold, Italic, Underline, borders, alignment, number format, etc.) styled to match Excel's ribbon.
  6. Name Box (cell address display) shows "A1" on open and is positioned left of the formula bar.
  7. Formula bar is present with an "fx" label and displays the active cell content.
  8. Grid has column header row (A, B, C…) and row number column (1, 2, 3…) in light gray, styled like Excel.
  9. Sheet tab bar at the bottom shows a "Sheet1" tab; the active tab appears raised/highlighted.
  10. Overall color scheme matches Excel: white ribbon background, light gray grid lines, blue accent for selected cells and active tab.
  11. Only one spreadsheet window is open at a time; clicking the icon again focuses the existing window.
- NOTES Colors: ribbon background #ffffff, header cells #f2f2f2, selected cell highlight #cde4f5 (Excel blue), grid lines #d0d0d0, active tab white with blue underline.
- RELATED None

---

## UC-002 : End User - Enter And Edit Cell Values
- STEPS
  1. User clicks a cell to select it.
  2. System highlights the cell with a blue border and fills its column header and row number with the Excel selection color.
  3. User types a value into the selected cell.
  4. User presses Enter, Tab, or an arrow key to confirm and move to the next cell.
  5. User double-clicks or presses F2 to edit an existing cell's content in place.
- ACCEPTANCE CRITERIA
  1. Selected cell has a blue border (Excel-style: 2px solid #217346 or the Excel blue accent) matching Excel's selection appearance.
  2. The entire column header letter and row number for the selected cell are highlighted in a darker shade (matching Excel's orange/blue header highlight behavior).
  3. Name Box updates to show the selected cell's address (e.g., "B3") immediately on selection.
  4. Typed content appears in both the cell and the formula bar simultaneously.
  5. Navigation keys (Enter, Tab, arrows) move focus to the adjacent cell.
  6. Editing an occupied cell overwrites only when confirmed; Escape cancels the edit and restores original content.
- NOTES Excel selection border color: #217346 (green) or #1072bb (blue) depending on Excel version. Use blue (#1072bb / #185abd) as per modern Excel.
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
  2. Supported operations include arithmetic (+, -, *, /), and basic functions (SUM, AVERAGE, MIN, MAX, COUNT).
  3. Cell references update the result when referenced cells change.
  4. Invalid formulas display a clear error indicator (e.g., #ERR).
- NOTES None
- RELATED UC-002

---

## UC-004 : End User - View And Edit Formula In Formula Bar
- STEPS
  1. User selects a cell that contains a formula.
  2. System displays the raw formula expression (not the computed value) in the formula bar, and shows the "fx" label to the left.
  3. User edits the formula in the formula bar and presses Enter to confirm.
- ACCEPTANCE CRITERIA
  1. Formula bar always shows the raw source (formula or value) of the active cell.
  2. "fx" label is visible and styled to match Excel (italic, gray text, positioned left of the formula input).
  3. Edits in the formula bar are reflected in the cell on confirmation.
  4. Escape cancels a formula bar edit without changing cell content.
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
  3. Ctrl+Z triggers Undo.
  4. Ctrl+Home moves focus to cell A1.
  5. All active shortcuts are listed in a Help dialog.
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

---

## UC-011 : End User - Use Ribbon Toolbar Formatting Actions
- STEPS
  1. User selects one or more cells.
  2. User clicks a ribbon button (Bold, Italic, Underline, Align Left, Align Center, Align Right) in the Home ribbon group.
  3. System applies the formatting to the selected cell(s).
- ACCEPTANCE CRITERIA
  1. Ribbon is divided into labeled groups matching Excel: Clipboard, Font, Alignment, Number — each with a group label below its buttons.
  2. Bold (B), Italic (I), Underline (U) buttons toggle font style on the selected cell(s); active state is visually indicated (pressed/highlighted, matching Excel's toggled button appearance).
  3. Alignment buttons (left, center, right) set text alignment on selected cell(s).
  4. Ribbon buttons use the correct Excel-style icon appearance: flat icons with label text, hover highlight, tooltip on hover.
  5. Ribbon is non-scrolling and always visible below the menu bar.
- NOTES Font group minimum: Font name dropdown (Calibri), Font size dropdown (11), B, I, U buttons. Alignment group: Align Left, Center, Align Right.
- RELATED UC-001, UC-002

---

## UC-012 : End User - View Column And Row Headers In Excel Style
- STEPS
  1. User opens the spreadsheet.
  2. User scrolls or navigates the grid.
  3. User selects a cell — the corresponding column header letter and row number highlight.
- ACCEPTANCE CRITERIA
  1. Column headers (A, B, C…) appear in a fixed header row above the grid, styled with gray background (#f2f2f2), centered letter, medium font weight, border matching Excel.
  2. Row numbers (1, 2, 3…) appear in a fixed left column with same gray styling.
  3. When a cell is selected, its column header and row number turn a darker highlight color (matching Excel's dark gray/blue header highlight: approximately #d6e4f7) for the selected cell.
  4. Column headers and row numbers remain fixed (do not scroll out of view) as the user scrolls the grid.
  5. Column widths default to approximately 64px (matching Excel's default); row heights default to approximately 21px.
- NOTES The top-left corner cell (intersection of row number and column header columns) should be blank and styled gray.
- RELATED UC-001, UC-002

---

## UC-013 : End User - View Sheet Tab Bar In Excel Style
- STEPS
  1. User opens the spreadsheet.
  2. User sees the sheet tab bar at the bottom of the grid.
  3. User clicks a sheet tab to switch to that sheet (or clicks the "+" button to add a new sheet).
- ACCEPTANCE CRITERIA
  1. Sheet tab bar is permanently visible at the very bottom of the window below the grid.
  2. "Sheet1" tab is present by default and displayed as the active tab.
  3. Active sheet tab is styled with a white background and a green bottom border (#217346 or Excel green), matching Excel's active tab appearance.
  4. Inactive sheet tabs have a light gray background.
  5. A "+" (add sheet) button is visible to the right of the tab list.
  6. Clicking "+" adds a new tab ("Sheet2", "Sheet3"…) and switches to it.
  7. Each sheet maintains its own independent grid data.
- NOTES Only basic multi-sheet support required: separate data per sheet, switch by tab click.
- RELATED UC-001

---

## UC-014 : End User - View Name Box Showing Active Cell Address
- STEPS
  1. User opens the spreadsheet — Name Box shows "A1".
  2. User clicks cell C5 — Name Box updates to "C5".
  3. User types a cell address (e.g., "B10") into the Name Box and presses Enter — system navigates to that cell.
- ACCEPTANCE CRITERIA
  1. Name Box is positioned at the top-left of the formula bar area, to the left of the "fx" label, matching Excel's layout.
  2. Name Box displays the address of the currently active cell in uppercase column-letter + row-number format (e.g., "A1", "C5", "AA10").
  3. Name Box updates immediately whenever the selected cell changes.
  4. Typing a valid cell address into the Name Box and pressing Enter moves focus to that cell.
  5. Name Box has a fixed width (~80px) with a border, styled to match Excel's Name Box appearance.
- NOTES None
- RELATED UC-001, UC-002

---

## UC-015 : End User - Use Context Menu On Right-Click
- STEPS
  1. User right-clicks on a cell.
  2. System displays a context menu styled like Excel's right-click menu.
  3. User selects an action (Cut, Copy, Paste, Insert Row, Delete Row, Clear Contents).
  4. System performs the action.
- ACCEPTANCE CRITERIA
  1. Context menu appears at the cursor position on right-click.
  2. Menu contains: Cut, Copy, Paste, separator, Insert Row, Delete Row, separator, Clear Contents.
  3. Menu is styled with Windows-style white background, hover highlight matching Excel (#e3f2fd or similar blue), system font, and border shadow.
  4. Clicking outside the menu or pressing Escape closes it without action.
  5. Cut copies and clears the cell; Copy copies; Paste inserts clipboard cell content at the target.
  6. Insert Row inserts a blank row above the clicked cell's row; Delete Row removes the clicked row.
  7. Clear Contents deletes cell value and formula without removing formatting.
- NOTES None
- RELATED UC-002, UC-003

