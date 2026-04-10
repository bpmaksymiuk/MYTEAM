## UC-001 : End User - Open Spreadsheet Window
- STEPS
  1. User clicks the Chrome extension icon.
  2. System opens a standalone window styled exactly like Microsoft Excel for Windows.
  3. User sees the full Excel UI: title bar reading "Book1 - Excel"; the ribbon tab bar (File, Home, Insert, Page Layout, Formulas, Data, Review, View) with the Home tab active by default; the ribbon toolbar below the tab bar with the Home tab's grouped action buttons; the Name Box showing "A1" and the formula bar with fx label; the cell grid with column headers (A, B, C…) and row numbers (1, 2, 3…); and a sheet tab bar at the very bottom showing "Sheet1".
  4. The bottom of the window shows a status bar with "Ready" on the left and a zoom control on the right.
- ACCEPTANCE CRITERIA
  1. Spreadsheet window opens from the extension icon in one click.
  2. Window is a detached OS-level window (via chrome.windows.create).
  3. Title bar displays "Book1 - Excel" for a new unsaved workbook.
  4. Ribbon tab bar is present with exactly the tabs: File, Home, Insert, Page Layout, Formulas, Data, Review, View — styled as flat rectangular tabs with no gap between tab bar and ribbon body, matching Excel's appearance.
  5. The File tab is styled with a solid green background (#217346) and white text, different from the other tabs, matching Excel's File tab appearance.
  6. Home tab is active by default; the active tab has a green underline accent or solid active indicator matching Excel.
  7. Ribbon toolbar body is white (#ffffff) and shows the Home tab's grouped buttons on open.
  8. Name Box (cell address display) shows "A1" on open and is positioned left of the formula bar.
  9. Formula bar is present with an "fx" label styled in gray italic, and displays the active cell content.
  10. Grid has column header row (A, B, C…) and row number column (1, 2, 3…) with light gray background (#f2f2f2), matching Excel.
  11. Sheet tab bar at the very bottom of the window shows a "Sheet1" tab; the active sheet tab is white with a green bottom border (#217346).
  12. Status bar is present at the bottom edge below the sheet tab bar, showing "Ready" on the left and zoom percentage (e.g., "100%") with a zoom slider on the right, matching Excel's status bar appearance.
  13. Overall color scheme matches Excel: white ribbon background, light gray grid lines (#d0d0d0), blue selection highlight (#cde4f5), green File tab and active sheet underline (#217346).
  14. Only one spreadsheet window is open at a time; clicking the icon again focuses the existing window.
- NOTES Colors: ribbon background #ffffff, header cells #f2f2f2, selected cell highlight #cde4f5 (Excel blue), grid lines #d0d0d0, active tab white with green bottom border #217346, File tab background #217346 with white text.
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
  2. User references other cells by address (e.g., =A1+B2) or a range (e.g., =SUM(A1:A10)).
  3. User presses Enter to confirm.
  4. System evaluates the formula and displays the computed result in the cell.
- ACCEPTANCE CRITERIA
  1. Formulas beginning with = are evaluated and display their computed result; the raw formula expression is stored internally and shown in the formula bar.
  2. Supported arithmetic operators: +, -, *, /; standard operator precedence applies; parentheses can override precedence (e.g., =2*(A1+A2)).
  3. Supported aggregate functions: SUM, AVERAGE, MIN, MAX, COUNT — each accepts individual cell references, comma-separated literals, and contiguous range notation (e.g., =SUM(A1:A10)).
  4. Supported conditional function: IF — =IF(condition, value_if_true, value_if_false); condition may use comparison operators (=, <>, >, <, >=, <=).
  5. Function names are case-insensitive: =sum(A1:A3) and =SUM(A1:A3) produce identical results.
  6. Nested function calls are supported up to at least 3 levels deep (e.g., =SUM(A1, MAX(B1:B5))).
  7. Cell references (e.g., A1, B3) resolve to the current display value of the referenced cell; when a referenced cell changes, all dependent formula cells recalculate automatically.
  8. Range references (e.g., A1:C3) expand to include every cell in the rectangular area bounded by the two corner addresses.
  9. Division by zero displays #DIV/0!; an unrecognized function name or label displays #NAME?; an out-of-bounds or deleted reference displays #REF!; a wrong argument type displays #VALUE!; no result available displays #N/A.
- NOTES None
- RELATED UC-002, UC-024, UC-025, UC-026, UC-027, UC-028

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
  2. User clicks a formatting button or dropdown in the Home ribbon (Font group, Alignment group, or Number group).
  3. System applies the formatting to the selected cell(s) immediately.
- ACCEPTANCE CRITERIA
  1. Home ribbon is divided into labeled groups matching Excel: Clipboard, Font, Alignment, Number — each group has a visible group name label below its buttons and a faint right-side divider, styled to match Excel.
  2. Clipboard group contains: Paste, Cut, Copy buttons with flat icons matching Excel's ribbon icons.
  3. Font group contains: Font name dropdown (default "Calibri"), Font size dropdown (default "11"), Bold (B), Italic (I), Underline (U) toggle buttons, Font Color button with a color-underline indicator and a dropdown arrow for a color picker palette, and Fill Color (bucket) button with a color-underline indicator and a dropdown arrow for a color picker palette.
  4. Bold, Italic, Underline toggle active state is shown with a pressed/highlighted background matching Excel (light blue: #d6e8fb or similar).
  5. Alignment group contains: Align Left, Center, Align Right buttons; Wrap Text button; Merge & Center button with dropdown arrow for Merge Across / Unmerge Cells.
  6. Number group contains: Number format dropdown (General, Number, Currency, Short Date, Percentage, Fraction, Text…) and Increase Decimal / Decrease Decimal buttons; the format dropdown reflects the format of the active cell.
  7. All ribbon buttons use the correct Excel-style icon appearance: flat SVG or Unicode icons with no border at rest, subtle gray hover background (#e8e8e8), pressed/active blue highlight, and a tooltip showing the action name on hover.
  8. Ribbon is non-scrolling and always fully visible below the ribbon tab bar; it does not collapse or wrap.
  9. Clicking Font Color or Fill Color dropdown arrow opens a color palette popover styled like Excel's color picker (theme colors + standard colors grid, "More Colors…" option is acceptable as a no-op).
- NOTES Font group minimum: font name dropdown, font size dropdown, B/I/U, font color, fill color. Alignment group: left/center/right, wrap text, merge & center. Number group: format dropdown, decimal buttons.
- RELATED UC-001, UC-002, UC-016

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

---

## UC-016 : End User - Switch Ribbon Tab To See Tab-Specific Controls
- STEPS
  1. User clicks a ribbon tab label (e.g., Insert, Page Layout, Formulas, Data, Review, View).
  2. System marks the clicked tab as active and replaces the ribbon body content with that tab's groups and buttons.
  3. User interacts with the new ribbon content.
  4. User clicks the Home tab to return to the Home ribbon.
- ACCEPTANCE CRITERIA
  1. Clicking any ribbon tab (Home, Insert, Page Layout, Formulas, Data, Review, View) activates it and shows its own set of groups and buttons in the ribbon body.
  2. The active tab is visually distinguished with a green bottom border or solid underline accent (#217346) and a slightly raised or white appearance, matching Excel's active tab indicator.
  3. Inactive tabs have no underline accent and use a lighter background, matching Excel's inactive tab appearance.
  4. Only one tab is active at a time; switching tabs deactivates the previous one.
  5. Insert tab ribbon contains at minimum: Tables group (Table button), Charts group (placeholder chart type buttons), and Illustrations group (placeholder).
  6. Formulas tab ribbon contains at minimum: Function Library group with an Insert Function button (fx) and category dropdowns (AutoSum, Recently Used, Financial, Logical, Text, Date & Time\u2026).
  7. Data tab ribbon contains at minimum: Sort & Filter group with Sort A→Z, Sort Z→A, and Filter toggle buttons.
  8. View tab ribbon contains at minimum: Workbook Views group (Normal, Page Layout, Page Break Preview) and Freeze Panes button (functional: freezes rows above and columns left of the active cell).
  9. Unused tab ribbon content (Page Layout, Review) may show placeholder groups with grayed-out buttons styled consistently with the ribbon.
  10. Tab switching does not affect grid data, selection, or formula bar content.
- NOTES The File tab is special — clicking it opens the backstage view (see UC-017) rather than switching ribbon content.
- RELATED UC-001, UC-011, UC-017

---

## UC-017 : End User - Use The File Menu (Backstage View)
- STEPS
  1. User clicks the File tab in the ribbon tab bar (the green tab on the far left).
  2. System opens the File backstage panel — a full-window overlay (or left panel + main panel) replacing the grid view, styled like Excel's green-accented backstage.
  3. User selects an action: New, Open, Save, Save As, or Close.
  4. System performs the action and returns to the grid view (or remains in backstage for cancel).
  5. User can press Escape or click a Back arrow to return to the grid without taking an action.
- ACCEPTANCE CRITERIA
  1. Clicking the File tab opens the backstage panel, which covers or replaces the grid view with a left navigation sidebar and a right content area.
  2. Left sidebar has a dark green background (#217346) with white text items: New, Open, Save, Save As, and a Close / Back option at the top or bottom, matching Excel's File backstage sidebar style.
  3. The active/hovered sidebar item is highlighted with a darker green (#185d38 or similar) or light overlay, matching Excel.
  4. New action clears the grid (with unsaved-changes guard per UC-007) and returns to grid view.
  5. Open action opens the OS file picker filtered to .csv, then loads the file into the grid (UC-005).
  6. Save action serializes the grid to CSV and triggers a browser download (UC-006); if no filename is set, prompts for one.
  7. Save As action always prompts for filename and triggers a CSV download.
  8. Pressing Escape or clicking Back / the grid area returns to the grid view with no data changes.
  9. The backstage panel transition is immediate (no animation required); the grid is visually hidden while backstage is open.
- NOTES The backstage is a full-panel overlay in the extension window, not a separate OS window.
- RELATED UC-001, UC-005, UC-006, UC-007, UC-016

---

## UC-018 : End User - Select A Cell Range
- STEPS
  1. User clicks a cell and drags to extend the selection across multiple cells.
  2. System highlights the entire range with the Excel selection fill color and shows the selection border.
  3. User can also hold Shift and click to extend the selection from the anchor cell.
  4. User can type a range address (e.g., "A1:C5") directly into the Name Box and press Enter to select that range.
- ACCEPTANCE CRITERIA
  1. Click-and-drag selects a rectangular range; all cells in the range are filled with the Excel selection highlight color (#cde4f5).
  2. The outer border of the selected range is shown as a solid blue 2px border, matching Excel's range selection outline.
  3. Shift+click extends the selection from the first-clicked anchor cell to the shift-clicked cell.
  4. Name Box displays the range address in Excel format (e.g., "A1:C5") when more than one cell is selected.
  5. A multi-cell selection with a common value allows the formula bar to show that value; a mixed selection shows the formula bar empty or blank.
  6. Formatting actions (Bold, Italic, fill color, etc.) applied while a range is selected affect all cells in the range.
  7. Typing a new value while a range is selected enters the value into the anchor cell only and deselects the range.
  8. Pressing Escape deselects to a single cell (the anchor cell).
  9. All column headers and row numbers for cells within the selection range are highlighted in the Excel header-highlight color (#d6e4f7 or similar).
- NOTES None
- RELATED UC-002, UC-011, UC-014

---

## UC-019 : End User - Apply Number Formatting From Ribbon
- STEPS
  1. User selects a cell or range containing a number.
  2. User opens the Number format dropdown in the Home ribbon's Number group (shows "General" by default).
  3. User selects a format (e.g., "Number", "Currency", "Percentage", "Short Date", "Text").
  4. System applies the format and re-renders the cell value accordingly.
- ACCEPTANCE CRITERIA
  1. The Number format dropdown in the Number group shows the current format of the active cell (default: "General").
  2. Available formats include: General, Number (2 decimal places), Currency (symbol + 2 decimal places), Short Date (e.g., 4/10/2026), Percentage (multiplied by 100 with % symbol), Fraction, Scientific, Text.
  3. Applying "Number" format displays the value with 2 decimal places (e.g., 1234 → 1,234.00).
  4. Applying "Currency" format displays the value with the local currency symbol and 2 decimal places (e.g., 1234 → $1,234.00).
  5. Applying "Percentage" format multiplies the value by 100 and appends % (e.g., 0.5 → 50%).
  6. Applying "Text" format treats the cell value as a plain string (formulas are not evaluated in Text-formatted cells).
  7. Applying "Short Date" format renders numeric values as dates where appropriate.
  8. Increase Decimal and Decrease Decimal buttons in the Number group add or remove one displayed decimal place.
  9. The format dropdown styling matches Excel's Number group dropdown with a border, current-value label, and dropdown arrow.
- NOTES Formatting is stored per-cell and survives navigation. Number rendering uses JavaScript's Intl.NumberFormat or equivalent.
- RELATED UC-002, UC-003, UC-011

---

## UC-020 : End User - Apply Cell Fill Color And Font Color
- STEPS
  1. User selects a cell or range.
  2. User clicks the dropdown arrow next to the Fill Color (paint bucket) button in the Font group of the Home ribbon.
  3. System shows a color palette popover.
  4. User clicks a color.
  5. System fills the selected cells' background with that color.
  6. User repeats for Font Color using the font color button dropdown.
- ACCEPTANCE CRITERIA
  1. Fill Color button in the ribbon shows a paint-bucket icon with a colored underline bar matching the last-used fill color, styled like Excel.
  2. Clicking the dropdown arrow opens a color palette popover with a grid of theme colors (5 columns × 6 rows) and a row of standard colors, styled to match Excel's color picker.
  3. Hovering a color swatch shows the color name in a tooltip.
  4. Clicking a color applies it immediately as the cell background; the color underline on the Fill Color button updates to the chosen color.
  5. Clicking the Fill Color button directly (not the dropdown) re-applies the last-used fill color.
  6. Font Color button and dropdown work identically for text color.
  7. Fill and font colors are preserved per-cell through navigation, selection changes, and Save → Load cycles.
  8. The "No Fill" option in the palette resets the cell background to the default white (#ffffff).
- NOTES Color palette minimum: 40 swatches (theme + standard rows) as a CSS grid, no image required.
- RELATED UC-002, UC-011, UC-018

---

## UC-021 : End User - Resize Column Width Or Row Height By Dragging
- STEPS
  1. User positions the pointer on the border between two column header letters (e.g., between A and B).
  2. Pointer changes to a horizontal resize cursor.
  3. User clicks and drags to the right or left to resize column A.
  4. System redraws the column at the new width in real time while dragging.
  5. User releases the mouse; the new width is applied and persists.
  6. User repeats for row height by dragging the border between two row number cells.
- ACCEPTANCE CRITERIA
  1. The resize cursor (col-resize or row-resize) appears when hovering over the header border hit area (approximately 4px wide).
  2. Dragging a column header border resizes that column in real time; all cells in the column adjust their width while dragging.
  3. Minimum column width is 20px; minimum row height is 16px; resizing does not go below the minimum.
  4. Releasing the mouse commits the new size.
  5. Row height can be resized by dragging the border between two row-number cells; same real-time and minimum rules apply.
  6. Double-clicking a column header border auto-fits the column width to the longest content in that column.
  7. Resized column widths and row heights persist when navigating cells; they are not reset by cell selection.
- NOTES None
- RELATED UC-001, UC-012, UC-002

---

## UC-022 : End User - Find And Replace Text In The Spreadsheet
- STEPS
  1. User presses Ctrl+F or uses Edit menu / ribbon to open the Find dialog.
  2. System displays a Find toolbar or dialog styled like Excel's Find & Replace dialog.
  3. User types a search term and presses Enter or clicks Find Next.
  4. System highlights the matching cell and scrolls it into view.
  5. User presses Ctrl+H or clicks Replace tab to open the Replace dialog.
  6. User enters a search term and a replacement string, then clicks Replace or Replace All.
  7. System replaces the occurrence(s) and reports how many replacements were made.
- ACCEPTANCE CRITERIA
  1. Ctrl+F opens a Find dialog styled like Excel's: a modeless dialog with a "Find what:" input, "Find Next" button, and a close button, positioned within the spreadsheet window.
  2. Pressing Enter or clicking "Find Next" highlights the next cell matching the search term (case-insensitive by default); the cell is scrolled into view and selected.
  3. If no match is found, a message indicates "No matches found" matching Excel's behavior.
  4. Ctrl+H opens a Find & Replace dialog with both a "Find what:" and "Replace with:" input, and "Replace", "Replace All" buttons.
  5. "Replace" replaces the current match and advances to the next.
  6. "Replace All" replaces every matching cell value in the current sheet and shows a confirmation message with the count of replacements made.
  7. Pressing Escape or clicking the close button dismisses the Find/Replace dialog.
  8. The dialog is styled with a title bar ("Find and Replace"), white background, system font, and border shadow matching Excel's dialog style.
- NOTES Search operates on displayed cell values, not raw formula syntax.
- RELATED UC-002, UC-003, UC-008

---

## UC-023 : End User - View And Use The Status Bar
- STEPS
  1. User opens the spreadsheet — status bar at the very bottom of the window shows "Ready".
  2. User selects one or more cells containing numbers.
  3. Status bar automatically shows aggregate statistics for the selection (Average, Count, Sum).
  4. User uses the zoom slider or percentage buttons in the status bar to adjust the grid zoom level.
- ACCEPTANCE CRITERIA
  1. Status bar is permanently visible at the very bottom of the window below the sheet tab bar, with a light gray background (#f0f0f0) and dark text, matching Excel's status bar appearance.
  2. The left area of the status bar shows the current cell mode: "Ready" during normal navigation, "Edit" while typing in a cell, "Enter" while confirming a formula.
  3. When one or more cells with numeric values are selected, the right area of the status bar shows: "Average: {n}", "Count: {n}", "Sum: {n}" calculated across the selection, matching Excel's automatic calculation display.
  4. Zoom control on the right side of the status bar shows the current zoom percentage (e.g., "100%") and includes a zoom-out (−) button, a horizontal slider, and a zoom-in (+) button.
  5. Clicking the zoom-in (+) button increases grid zoom by 10%; zoom-out (−) decreases by 10%; minimum zoom is 10%, maximum is 400%.
  6. Dragging the zoom slider adjusts the zoom level in real time.
  7. The grid (cells, text, row height, column width) scales proportionally with the zoom level.
- NOTES Status bar mode text ("Ready" / "Edit" / "Enter") must be wired to the editor state, not static.
- RELATED UC-001, UC-002, UC-018

---

## UC-024 : End User - Use Logical Functions In Formulas
- STEPS
  1. User enters a formula using a logical function (e.g., =IF(A1>10, "High", "Low")).
  2. User presses Enter; system evaluates the logical expression and displays the appropriate branch result.
  3. User nests logical functions with other functions (e.g., =IF(AND(A1>0, B1>0), "Both positive", "No")).
- ACCEPTANCE CRITERIA
  1. IF(condition, value_if_true, value_if_false) evaluates the condition and returns the correct branch; both branches may be string literals, numbers, cell references, or nested formulas.
  2. AND(arg1, arg2, …) returns TRUE if every argument is non-zero / non-empty, FALSE otherwise; accepts 1–255 arguments.
  3. OR(arg1, arg2, …) returns TRUE if at least one argument is non-zero / non-empty, FALSE otherwise; accepts 1–255 arguments.
  4. NOT(arg) inverts a logical value: NOT(TRUE) = FALSE, NOT(FALSE) = TRUE.
  5. IFERROR(value, value_if_error) returns the second argument if the first evaluates to any error value (#DIV/0!, #NAME?, #REF!, #VALUE!, #N/A), otherwise returns the first argument.
  6. Logical functions can be nested inside each other and inside aggregate functions (e.g., =SUM(IF(A1>0, A1, 0), B1)).
  7. Comparison operators (=, <>, >, <, >=, <=) used as IF conditions produce correct boolean evaluation.
- NOTES None
- RELATED UC-003

---

## UC-025 : End User - Use Text Functions In Formulas
- STEPS
  1. User enters a formula using a text manipulation function (e.g., =UPPER(A1) or =LEFT(B2, 3)).
  2. User presses Enter; system evaluates the function against the cell content and displays the result string.
  3. User combines text functions with & concatenation operator (e.g., =LEFT(A1,1)&"."&RIGHT(A1,1)).
- ACCEPTANCE CRITERIA
  1. CONCATENATE(text1, text2, …) joins all arguments into a single string; also supported as CONCAT(text1, text2, …).
  2. LEN(text) returns the character count of the string value in the referenced cell or literal.
  3. LEFT(text, n) returns the first n characters; RIGHT(text, n) returns the last n characters.
  4. MID(text, start, length) returns length characters starting at position start (1-based).
  5. UPPER(text) converts the string to uppercase; LOWER(text) converts to lowercase.
  6. TRIM(text) removes leading, trailing, and duplicate internal spaces, leaving single spaces between words.
  7. The & operator can concatenate two values inline without a function call (e.g., =A1&" "&B1).
  8. Text functions applied to numeric cell values coerce the number to a string without error.
- NOTES None
- RELATED UC-003

---

## UC-026 : End User - Use Math And Rounding Functions In Formulas
- STEPS
  1. User enters a formula using a math function (e.g., =ROUND(A1, 2) or =ABS(B3)).
  2. User presses Enter; system evaluates the function and displays the numeric result.
- ACCEPTANCE CRITERIA
  1. ROUND(number, digits) rounds to the specified number of decimal places; negative digits rounds to the left of the decimal point.
  2. ABS(number) returns the absolute (non-negative) value of the argument.
  3. INT(number) truncates toward negative infinity to the nearest integer.
  4. MOD(number, divisor) returns the remainder of number divided by divisor; result has the same sign as divisor.
  5. SQRT(number) returns the positive square root; negative input displays #VALUE!.
  6. POWER(number, exponent) returns number raised to exponent (e.g., =POWER(2,10) returns 1024).
  7. All math functions accept cell references, range references (where a single value is expected, the first cell is used), and numeric literals as arguments.
- NOTES None
- RELATED UC-003

---

## UC-027 : End User - Use Date And Time Functions In Formulas
- STEPS
  1. User enters a date formula (e.g., =TODAY() or =YEAR(A1)).
  2. User presses Enter; system evaluates the function and displays the result as a formatted date string or numeric year/month/day value.
- ACCEPTANCE CRITERIA
  1. TODAY() returns the current local date formatted as YYYY-MM-DD (or the active cell's number format if overridden).
  2. NOW() returns the current local date and time formatted as YYYY-MM-DD HH:MM.
  3. DATE(year, month, day) constructs a date value from three numeric arguments and displays it as YYYY-MM-DD.
  4. YEAR(date) returns the four-digit year extracted from a date string or date cell; MONTH(date) returns 1–12; DAY(date) returns 1–31.
  5. Date functions used in arithmetic (e.g., =TODAY()-A1) return the difference in days as a number when the referenced cell contains a valid date.
  6. Invalid date arguments (non-date strings, out-of-range values) display #VALUE!.
- NOTES Date serial numbers need not match Excel's 1900 date system exactly; ISO string representation is acceptable.
- RELATED UC-003

---

## UC-028 : End User - Use Absolute And Relative Cell References
- STEPS
  1. User enters a formula with an absolute reference (e.g., =A1*$B$1).
  2. User copies the formula cell and pastes it to adjacent cells.
  3. System adjusts relative references for each destination cell while leaving absolute references fixed.
  4. User presses F4 while the cursor is on a cell reference in the formula bar to cycle the reference type.
- ACCEPTANCE CRITERIA
  1. A reference prefixed with $ on the column (e.g., $B1) keeps the column fixed during copy/paste while the row adjusts.
  2. A reference prefixed with $ on the row (e.g., B$1) keeps the row fixed during copy/paste while the column adjusts.
  3. A fully absolute reference ($B$1) keeps both column and row fixed during copy/paste regardless of destination offset.
  4. A plain relative reference (B1) shifts both column and row by the copy offset during paste.
  5. Pressing F4 while the cursor is inside a cell reference token in the formula bar cycles through: relative (B1) → fully absolute ($B$1) → row-absolute (B$1) → column-absolute ($B1) → back to relative.
  6. Absolute references are preserved when a row or column is inserted or deleted above/to the left of the referenced cell; relative references adjust to track the moved cell.
  7. Cut-and-paste does not adjust references; copy-and-paste applies the offset adjustment rules above.
- NOTES None
- RELATED UC-003, UC-004

