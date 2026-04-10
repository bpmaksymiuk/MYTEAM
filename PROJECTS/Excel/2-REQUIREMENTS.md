# Business Requirements — Excel Chrome Extension
**Stage:** 2 — Business Analysis
**Source:** `1-USE-CASES.md` (UC-001 through UC-028)
**Date:** 2026-04-10

---

## BR-001 : The system shall display the window title "Book1 - Excel" for a new unsaved workbook.
- TESTABLE CONDITION: `document.title` equals "Book1 - Excel" on first open with no saved file.
- NOTES None
- RELATED UC-001
---
## BR-002 : The system shall display exactly the following ribbon tabs: File, Home, Insert, Page Layout, Formulas, Data, Review, View.
- TESTABLE CONDITION: Count of ribbon tab elements equals 8 and labels match in order.
- NOTES File tab is styled differently; counted as part of the tab bar.
- RELATED UC-001
---
## BR-003 : The File tab shall use a solid green background (#217346) with white text, distinguishing it from all other tabs.
- TESTABLE CONDITION: Computed background-color of the File tab element equals #217346 and text color is white.
- NOTES None
- RELATED UC-001
---
## BR-004 : The Home ribbon tab shall be active by default on open.
- TESTABLE CONDITION: Home tab element has an active class or visual indicator on open; ribbon body shows Home groups.
- NOTES None
- RELATED UC-001
---
## BR-005 : The Name Box shall be visible at the top-left of the formula bar area, showing "A1" on initial open.
- TESTABLE CONDITION: `#name-box` element exists and its value is "A1" immediately after page load.
- NOTES None
- RELATED UC-001, UC-014
---
## BR-006 : The formula bar shall display a gray italic "fx" label to its left.
- TESTABLE CONDITION: Element with id `fx-label` is visible with italic gray styling.
- NOTES None
- RELATED UC-001, UC-004
---
## BR-007 : The grid shall have column headers (A, B, C…) in a fixed header row and row numbers (1, 2, 3…) in a fixed left column.
- TESTABLE CONDITION: `thead` element with column letter `th` elements is present; first `td` per row shows row number.
- NOTES None
- RELATED UC-001, UC-012
---
## BR-008 : A "Sheet1" tab shall be visible in the sheet tab bar at the bottom of the window on open.
- TESTABLE CONDITION: Sheet tab element with text "Sheet1" is present and has active styling.
- NOTES None
- RELATED UC-001, UC-013
---
## BR-009 : The selected cell shall have a visible selection border matching Excel's blue selection appearance.
- TESTABLE CONDITION: The clicked cell has a selection class applied; computed border is blue.
- NOTES None
- RELATED UC-002
---
## BR-010 : The Name Box shall update to show the selected cell's column+row address immediately on cell selection.
- TESTABLE CONDITION: Clicking cell B3 sets `#name-box` value to "B3" without delay.
- NOTES None
- RELATED UC-002, UC-014
---
## BR-011 : Content typed into a cell shall appear in both the inline edit input and the formula bar simultaneously.
- TESTABLE CONDITION: While in inline edit mode, `#formula-bar` value matches the inline edit input value.
- NOTES None
- RELATED UC-002, UC-004
---
## BR-012 : Pressing Enter shall confirm a cell edit and move focus to the cell in the next row.
- TESTABLE CONDITION: After Enter, the previously edited cell is committed and `selectedRow` increments by 1.
- NOTES None
- RELATED UC-002
---
## BR-013 : Double-clicking a cell or pressing F2 shall enter inline edit mode for that cell.
- TESTABLE CONDITION: Double-click on a cell creates an editable `<input>` element overlaid on the cell.
- NOTES None
- RELATED UC-002
---
## BR-014 : Pressing Escape during an inline edit shall cancel the edit and restore the original cell content.
- TESTABLE CONDITION: Escape keypress removes the inline edit input; cell returns to its pre-edit value.
- NOTES None
- RELATED UC-002
---
## BR-015 : A cell value beginning with = shall be evaluated as a formula and display the computed result.
- TESTABLE CONDITION: Cell with raw value "=2+2" displays "4".
- NOTES None
- RELATED UC-003
---
## BR-016 : Arithmetic operators +, -, *, / shall be supported with standard operator precedence; parentheses shall override precedence.
- TESTABLE CONDITION: "=2+3*4" evaluates to "14"; "=(2+3)*4" evaluates to "20".
- NOTES None
- RELATED UC-003
---
## BR-017 : The functions SUM, AVERAGE, MIN, MAX, COUNT shall be supported with both range and discrete argument notation.
- TESTABLE CONDITION: =SUM(A1:A3) with A1=1, A2=2, A3=3 returns "6"; =COUNT(A1:A3) returns "3".
- NOTES None
- RELATED UC-003
---
## BR-018 : IF(condition, value_if_true, value_if_false) shall evaluate the condition and return the correct branch.
- TESTABLE CONDITION: =IF(1>0,"yes","no") returns "yes"; =IF(0>1,"yes","no") returns "no".
- NOTES None
- RELATED UC-003, UC-024
---
## BR-019 : Function names shall be case-insensitive.
- TESTABLE CONDITION: =sum(A1) and =SUM(A1) produce identical results.
- NOTES None
- RELATED UC-003
---
## BR-020 : Nested function calls shall be supported up to at least 3 levels deep.
- TESTABLE CONDITION: =SUM(1, MAX(2, MIN(3, 4))) evaluates without error.
- NOTES None
- RELATED UC-003
---
## BR-021 : Dependent formula cells shall recalculate automatically when referenced cells change.
- TESTABLE CONDITION: Cell B1 has =A1*2; changing A1 from 5 to 10 immediately updates B1 from "10" to "20".
- NOTES None
- RELATED UC-003
---
## BR-022 : Range references (e.g., A1:C3) shall expand to include every cell in the rectangular bounding area.
- TESTABLE CONDITION: =SUM(A1:A3) with values 1, 2, 3 in A1:A3 returns "6".
- NOTES None
- RELATED UC-003
---
## BR-023 : Error values #DIV/0!, #NAME?, #REF!, #VALUE!, #N/A shall display for the appropriate error conditions.
- TESTABLE CONDITION: =1/0 → "#DIV/0!"; =UNKNOWNFN() → "#NAME?"; =SQRT(-1) → "#VALUE!".
- NOTES Generic #ERR is not acceptable; specific error types are required.
- RELATED UC-003
---
## BR-024 : The formula bar shall display the raw formula expression (not the computed value) when a formula cell is selected.
- TESTABLE CONDITION: Selecting a cell with raw ="=A1+B1" shows "=A1+B1" in `#formula-bar`.
- NOTES None
- RELATED UC-004
---
## BR-025 : Edits made directly in the formula bar shall update the cell value on Enter confirmation.
- TESTABLE CONDITION: Changing formula bar text and pressing Enter updates the cell display.
- NOTES None
- RELATED UC-004
---
## BR-026 : Pressing Escape while editing the formula bar shall cancel and restore the original cell content.
- TESTABLE CONDITION: Escape during formula-bar edit reverts cell to prior value.
- NOTES None
- RELATED UC-004
---
## BR-027 : The file picker opened for CSV import shall accept .csv files only.
- TESTABLE CONDITION: The file input element has `accept=".csv"` attribute.
- NOTES None
- RELATED UC-005
---
## BR-028 : CSV rows shall map to spreadsheet rows; comma-separated values shall map to sequential columns.
- TESTABLE CONDITION: Importing "a,b\n1,2" populates A1=a, B1=b, A2=1, B2=2.
- NOTES None
- RELATED UC-005
---
## BR-029 : Opening a CSV when unsaved edits are present shall prompt for confirmation before discarding them.
- TESTABLE CONDITION: With dirty grid, triggering Open shows a browser confirm dialog.
- NOTES None
- RELATED UC-005, UC-007
---
## BR-030 : The save action shall trigger a browser download of the current grid as a .csv file without server dependency.
- TESTABLE CONDITION: Ctrl+S triggers a download event; file extension is .csv.
- NOTES None
- RELATED UC-006
---
## BR-031 : CSV cells containing commas or embedded newlines shall be RFC 4180 double-quoted in the output.
- TESTABLE CONDITION: A cell with value "a,b" exports as `"a,b"` in the CSV.
- NOTES None
- RELATED UC-006
---
## BR-032 : A confirmation prompt shall appear before any action that would discard unsaved grid edits.
- TESTABLE CONDITION: With dirty state (title shows "*"), opening new/open action shows a confirm dialog.
- NOTES None
- RELATED UC-007
---
## BR-033 : Confirming the discard prompt shall clear or replace the current grid as intended.
- TESTABLE CONDITION: After confirm, grid is empty (New) or populated with new file contents (Open).
- NOTES None
- RELATED UC-007
---
## BR-034 : Canceling the discard prompt shall leave the grid and all edits intact.
- TESTABLE CONDITION: After cancel, all cell values remain unchanged and dirty marker stays.
- NOTES None
- RELATED UC-007
---
## BR-035 : Ctrl+S shall trigger the CSV save action.
- TESTABLE CONDITION: Ctrl+S keypress initiates a download.
- NOTES None
- RELATED UC-008
---
## BR-036 : Ctrl+O shall trigger the Open CSV file picker.
- TESTABLE CONDITION: Ctrl+O keypress triggers the file input click.
- NOTES None
- RELATED UC-008
---
## BR-037 : Ctrl+Z shall trigger undo, reverting the last data-modifying action.
- TESTABLE CONDITION: Ctrl+Z after entering a value reverts the cell to its prior state.
- NOTES None
- RELATED UC-008
---
## BR-038 : Ctrl+Home shall move cell selection to A1.
- TESTABLE CONDITION: Ctrl+Home sets `#name-box` to "A1" and selects cell A1.
- NOTES None
- RELATED UC-008
---
## BR-039 : F1 shall open the keyboard shortcuts Help dialog.
- TESTABLE CONDITION: F1 keypress makes the help dialog visible.
- NOTES None
- RELATED UC-008, UC-010
---
## BR-040 : Window position and size shall be saved via chrome.storage when the window is moved or resized.
- TESTABLE CONDITION: `background.js` invokes `chrome.storage.local.set` with geometry data on `onBoundsChanged`.
- NOTES Verifiable by code inspection; runtime requires real extension context.
- RELATED UC-009
---
## BR-041 : The window shall restore to the previously saved position and size on the next open.
- TESTABLE CONDITION: `background.js` reads stored geometry via `chrome.storage.local.get` before calling `windows.create`.
- NOTES Runtime verification requires real extension install.
- RELATED UC-009
---
## BR-042 : A sensible default window size and position shall be used when no saved geometry exists.
- TESTABLE CONDITION: First open uses a hard-coded default (e.g., 1200×800) when storage returns nothing.
- NOTES None
- RELATED UC-009
---
## BR-043 : The Help dialog shall list all supported keyboard shortcuts with their key combination and action.
- TESTABLE CONDITION: Help dialog contains at least 10 rows with shortcut key + action text.
- NOTES None
- RELATED UC-010
---
## BR-044 : The shortcuts displayed in the Help dialog shall match the active bindings in the application.
- TESTABLE CONDITION: Every entry in the `SHORTCUTS` constant appears in the rendered help dialog.
- NOTES None
- RELATED UC-010
---
## BR-045 : The Help dialog shall be closeable via a Close button or the Escape key.
- TESTABLE CONDITION: Pressing Escape dismisses the help dialog; Close button also dismisses it.
- NOTES None
- RELATED UC-010
---
## BR-046 : The Home ribbon shall be divided into labeled groups: Clipboard, Font, Alignment, Number.
- TESTABLE CONDITION: Four group label elements with those exact names are visible in the ribbon.
- NOTES None
- RELATED UC-011
---
## BR-047 : The Font group shall contain Font name dropdown, Font size dropdown, Bold, Italic, Underline toggles.
- TESTABLE CONDITION: Each of these controls is present inside the Font group.
- NOTES None
- RELATED UC-011
---
## BR-048 : Bold, Italic, Underline shall toggle the format of the selected cell and show an active visual state.
- TESTABLE CONDITION: Clicking Bold on an unformatted cell assigns bold; clicking again removes it; button visual changes accordingly.
- NOTES None
- RELATED UC-011
---
## BR-049 : The Alignment group shall contain Align Left, Align Center, Align Right, and Wrap Text controls.
- TESTABLE CONDITION: These four buttons are present inside the Alignment group.
- NOTES None
- RELATED UC-011
---
## BR-050 : The Number format dropdown shall show the current cell's format and apply the selected format immediately.
- TESTABLE CONDITION: After selecting "Currency", a cell with 1234 displays "$1,234.00".
- NOTES None
- RELATED UC-011, UC-019
---
## BR-051 : Fill Color and Font Color buttons shall each show a color picker popover via a dropdown arrow.
- TESTABLE CONDITION: Clicking the Fill Color dropdown arrow reveals a color palette popover.
- NOTES None
- RELATED UC-011, UC-020
---
## BR-052 : Column headers (A, B, C…) shall be fixed above the grid and shall not scroll out of view.
- TESTABLE CONDITION: `thead` has `position: sticky; top: 0` or equivalent so it remains visible while scrolling.
- NOTES None
- RELATED UC-012
---
## BR-053 : Row numbers (1, 2, 3…) shall be fixed at the left of the grid and shall not scroll out of view.
- TESTABLE CONDITION: Row header cells have `position: sticky; left: 0` or equivalent.
- NOTES None
- RELATED UC-012
---
## BR-054 : Selecting a cell shall highlight its column header and row number with an Excel-style accent color.
- TESTABLE CONDITION: Selecting C5 gives the column-C header and row-5 number a darker highlight class.
- NOTES None
- RELATED UC-012
---
## BR-055 : Column default width shall be approximately 64px; row default height approximately 21px.
- TESTABLE CONDITION: Computed width of an unsized column is between 60px and 70px; row height between 18px and 24px.
- NOTES None
- RELATED UC-012
---
## BR-056 : The sheet tab bar shall be permanently visible at the bottom of the window.
- TESTABLE CONDITION: `#sheet-tab-bar` or equivalent element is present and not hidden.
- NOTES None
- RELATED UC-013
---
## BR-057 : Sheet1 shall be active on open with a green bottom border (#217346) matching Excel.
- TESTABLE CONDITION: First sheet tab has active class and a green bottom border.
- NOTES None
- RELATED UC-013
---
## BR-058 : Clicking "+" shall add a new sheet with the next sequential name (Sheet2, Sheet3…) and switch to it.
- TESTABLE CONDITION: Clicking the add-sheet button creates "Sheet2" tab and makes it active.
- NOTES None
- RELATED UC-013
---
## BR-059 : Each sheet shall maintain independent grid data; switching sheets shall show that sheet's data.
- TESTABLE CONDITION: Enter value in Sheet1 A1, switch to Sheet2, A1 is empty; switch back to Sheet1, A1 has original value.
- NOTES None
- RELATED UC-013
---
## BR-060 : The Name Box shall display the selected cell's address immediately on every selection change.
- TESTABLE CONDITION: Clicking C5 updates `#name-box` value to "C5".
- NOTES None
- RELATED UC-014
---
## BR-061 : Typing a valid cell address into the Name Box and pressing Enter shall navigate focus to that cell.
- TESTABLE CONDITION: Type "B10" in Name Box, press Enter → cell B10 is selected and name-box shows "B10".
- NOTES None
- RELATED UC-014
---
## BR-062 : The Name Box shall display the range address (e.g., "A1:C3") when multiple cells are selected.
- TESTABLE CONDITION: Selecting A1:C3 sets name-box value to "A1:C3".
- NOTES None
- RELATED UC-014, UC-018
---
## BR-063 : Right-clicking a cell shall display a context menu with the items: Cut, Copy, Paste, Insert Row, Delete Row, Clear Contents.
- TESTABLE CONDITION: Right-click event on a cell makes a context menu visible with those labeled items.
- NOTES None
- RELATED UC-015
---
## BR-064 : The context menu shall close when the user clicks outside it or presses Escape.
- TESTABLE CONDITION: Escape keypress hides the context menu; clicking outside also hides it.
- NOTES None
- RELATED UC-015
---
## BR-065 : Insert Row shall insert a blank row above the right-clicked cell's row; all rows below shall shift down.
- TESTABLE CONDITION: Right-click row 3, Insert Row → row 3 becomes blank, original row 3 content moves to row 4.
- NOTES None
- RELATED UC-015
---
## BR-066 : Delete Row shall remove the clicked row; all rows below shall shift up.
- TESTABLE CONDITION: Right-click row 3, Delete Row → row 3 is removed, original row 4 content moves to row 3.
- NOTES None
- RELATED UC-015
---
## BR-067 : Clear Contents shall delete cell value and formula without removing cell formatting.
- TESTABLE CONDITION: Clear Contents on a bold, colored cell removes its value but preserves bold and color.
- NOTES None
- RELATED UC-015
---
## BR-068 : Clicking a ribbon tab shall activate it, replace the ribbon body content with that tab's groups, and deactivate the previous tab.
- TESTABLE CONDITION: Clicking Formulas tab shows Formulas groups; Home tab loses active indicator.
- NOTES None
- RELATED UC-016
---
## BR-069 : The Formulas tab ribbon shall contain a Function Library group with an Insert Function button and category buttons.
- TESTABLE CONDITION: Switching to Formulas tab shows a group with an "Insert Function" or "fx" button and at least AutoSum.
- NOTES None
- RELATED UC-016, UC-003
---
## BR-070 : The Data tab ribbon shall contain Sort A→Z, Sort Z→A, and Filter toggle buttons.
- TESTABLE CONDITION: Switching to Data tab shows Sort and Filter buttons.
- NOTES None
- RELATED UC-016
---
## BR-071 : The View tab ribbon shall contain a Freeze Panes button.
- TESTABLE CONDITION: Switching to View tab shows a Freeze Panes button.
- NOTES None
- RELATED UC-016
---
## BR-072 : Tab switching shall not modify grid data, cell selection, or formula bar content.
- TESTABLE CONDITION: Select cell C5, enter a value, switch tabs and back — cell C5 value and selection are unchanged.
- NOTES None
- RELATED UC-016
---
## BR-073 : Clicking the File tab shall open the backstage panel, hiding the grid view.
- TESTABLE CONDITION: File tab click makes backstage panel visible; grid is visually hidden.
- NOTES None
- RELATED UC-017
---
## BR-074 : The backstage left sidebar shall have a dark green background (#217346) with white-text navigation items: New, Open, Save, Save As.
- TESTABLE CONDITION: Backstage sidebar element has green background; four labeled items are present.
- NOTES None
- RELATED UC-017
---
## BR-075 : New action from backstage shall clear the grid after applying the unsaved-changes guard.
- TESTABLE CONDITION: Open backstage, click New — if dirty, confirm dialog appears; after confirm, grid is cleared.
- NOTES None
- RELATED UC-017, UC-007
---
## BR-076 : Save action from backstage shall trigger a CSV download of the current grid.
- TESTABLE CONDITION: Open backstage, click Save — a download is initiated.
- NOTES None
- RELATED UC-017, UC-006
---
## BR-077 : Pressing Escape or clicking Back from the backstage shall return to the grid view with no data changes.
- TESTABLE CONDITION: Escape closes backstage; grid resumes showing previous data unchanged.
- NOTES None
- RELATED UC-017
---
## BR-078 : Click-and-drag from one cell to another shall select all cells in the rectangular range.
- TESTABLE CONDITION: Mouse-down on A1, mouse-over to C3, mouse-up — all 9 cells show selection highlight.
- NOTES None
- RELATED UC-018
---
## BR-079 : Shift+click shall extend the selection from the anchor cell to the shift-clicked cell.
- TESTABLE CONDITION: Click A1, then Shift+click C3 — A1:C3 is selected.
- NOTES None
- RELATED UC-018
---
## BR-080 : Pressing Escape while a range is selected shall deselect to the single anchor cell.
- TESTABLE CONDITION: Range A1:C3 selected, Escape — only A1 remains selected; name-box shows "A1".
- NOTES None
- RELATED UC-018
---
## BR-081 : Formatting actions applied while a range is selected shall affect all cells in the range.
- TESTABLE CONDITION: Select A1:B2, click Bold — all four cells have bold formatting applied.
- NOTES None
- RELATED UC-018, UC-011
---
## BR-082 : The Number format dropdown shall show "General" by default and reflect the active cell's current format.
- TESTABLE CONDITION: On a new cell, dropdown shows "General"; after applying Currency format, dropdown shows "Currency".
- NOTES None
- RELATED UC-019
---
## BR-083 : Applying "Number" format shall display the value with 2 decimal places and thousands comma separator.
- TESTABLE CONDITION: Apply Number to cell with 1234 → displays "1,234.00".
- NOTES None
- RELATED UC-019
---
## BR-084 : Applying "Currency" format shall display the value with the local currency symbol and 2 decimal places.
- TESTABLE CONDITION: Apply Currency to cell with 1234 → displays "$1,234.00".
- NOTES None
- RELATED UC-019
---
## BR-085 : Applying "Percentage" format shall multiply the stored value by 100 and append %.
- TESTABLE CONDITION: Apply Percentage to cell with 0.5 → displays "50%".
- NOTES None
- RELATED UC-019
---
## BR-086 : Applying "Text" format shall prevent formula evaluation in that cell.
- TESTABLE CONDITION: Apply Text format, then enter "=1+1" — cell displays "=1+1", not "2".
- NOTES None
- RELATED UC-019
---
## BR-087 : The Fill Color dropdown shall open a color palette with at least 40 swatches.
- TESTABLE CONDITION: Clicking Fill Color dropdown arrow reveals a palette with ≥ 40 color swatches.
- NOTES None
- RELATED UC-020
---
## BR-088 : Clicking a color swatch shall apply it as the cell background; the Fill Color button indicator shall update.
- TESTABLE CONDITION: Click a red swatch — selected cell background turns red; button color indicator updates to red.
- NOTES None
- RELATED UC-020
---
## BR-089 : Font Color dropdown shall work identically to Fill Color for text color.
- TESTABLE CONDITION: Selecting a color from Font Color palette changes the selected cell's text color.
- NOTES None
- RELATED UC-020
---
## BR-090 : Fill and font colors shall persist per-cell across navigation and not be reset by cell selection changes.
- TESTABLE CONDITION: Apply blue fill to A1, navigate to B2 and back — A1 still has blue fill.
- NOTES None
- RELATED UC-020
---
## BR-091 : Hovering over a column header border shall display the col-resize cursor.
- TESTABLE CONDITION: Mouse positioned at the right edge of a column header shows `cursor: col-resize`.
- NOTES None
- RELATED UC-021
---
## BR-092 : Dragging a column header border shall resize that column in real time.
- TESTABLE CONDITION: Mouse-down on header border, drag right — column width increases proportionally.
- NOTES None
- RELATED UC-021
---
## BR-093 : Minimum column width shall be 20px; minimum row height shall be 16px.
- TESTABLE CONDITION: Dragging below minimum stops at 20px for columns and 16px for rows.
- NOTES None
- RELATED UC-021
---
## BR-094 : Double-clicking a column header border shall auto-fit the column to the longest content.
- TESTABLE CONDITION: Double-click on header border — column width adjusts to fit the widest cell value.
- NOTES None
- RELATED UC-021
---
## BR-095 : Ctrl+F shall open a Find dialog; pressing Enter or Find Next shall select the next matching cell.
- TESTABLE CONDITION: Ctrl+F opens find dialog; entering text and pressing Enter moves selection to matching cell.
- NOTES None
- RELATED UC-022
---
## BR-096 : The Find dialog shall perform case-insensitive search across all cell displayed values.
- TESTABLE CONDITION: Search for "hello" finds a cell containing "Hello".
- NOTES None
- RELATED UC-022
---
## BR-097 : When no match is found, the Find dialog shall display a "No matches found" notification.
- TESTABLE CONDITION: Searching for a string that doesn't exist in the grid shows "No matches found".
- NOTES None
- RELATED UC-022
---
## BR-098 : Ctrl+H shall open a Find & Replace dialog with both a "Find what" and "Replace with" input.
- TESTABLE CONDITION: Ctrl+H opens a dialog containing two text inputs.
- NOTES None
- RELATED UC-022
---
## BR-099 : Replace shall replace the current match and advance to the next; Replace All shall replace every match and show a count.
- TESTABLE CONDITION: Replace All on 3 matching cells shows "3 replacements made" or equivalent.
- NOTES None
- RELATED UC-022
---
## BR-100 : The status bar shall be permanently visible below the sheet tab bar.
- TESTABLE CONDITION: Status bar element is present in the DOM and not hidden.
- NOTES None
- RELATED UC-023
---
## BR-101 : The status bar left area shall show "Ready", "Edit", or "Enter" corresponding to the current editor state.
- TESTABLE CONDITION: On open shows "Ready"; while in inline edit shows "Edit"; confirming formula shows "Enter" briefly.
- NOTES None
- RELATED UC-023
---
## BR-102 : Selecting cells with numeric values shall show Average, Count, and Sum in the status bar.
- TESTABLE CONDITION: Selecting A1:A3 with values 1, 2, 3 shows Average: 2, Count: 3, Sum: 6 in status bar.
- NOTES None
- RELATED UC-023
---
## BR-103 : Zoom control shall show the current zoom percentage and provide + and − buttons.
- TESTABLE CONDITION: Zoom element is present; default displays "100%"; + and − buttons exist.
- NOTES None
- RELATED UC-023
---
## BR-104 : Zoom-in (+) shall increase zoom by 10%; zoom-out (−) shall decrease by 10%; limits are 10% and 400%.
- TESTABLE CONDITION: Click + from 100% → 110%; click − at 10% → zoom does not go below 10%.
- NOTES None
- RELATED UC-023
---
## BR-105 : AND(arg1, arg2, …) shall return 1 (true) when all arguments are non-zero, 0 (false) otherwise.
- TESTABLE CONDITION: =IF(AND(1,1),"yes","no") → "yes"; =IF(AND(1,0),"yes","no") → "no".
- NOTES None
- RELATED UC-024
---
## BR-106 : OR(arg1, arg2, …) shall return 1 (true) when at least one argument is non-zero.
- TESTABLE CONDITION: =IF(OR(0,1),"yes","no") → "yes"; =IF(OR(0,0),"yes","no") → "no".
- NOTES None
- RELATED UC-024
---
## BR-107 : NOT(arg) shall return 1 when arg is 0 (false) and 0 when arg is non-zero (true).
- TESTABLE CONDITION: =IF(NOT(0),"yes","no") → "yes"; =IF(NOT(1),"yes","no") → "no".
- NOTES None
- RELATED UC-024
---
## BR-108 : IFERROR(value, value_if_error) shall return value_if_error when value evaluates to any error string.
- TESTABLE CONDITION: =IFERROR(1/0,"err") → "err"; =IFERROR(5,"err") → "5".
- NOTES None
- RELATED UC-024
---
## BR-109 : Logical functions shall support cell references and nesting with arithmetic and aggregate functions.
- TESTABLE CONDITION: =IF(AND(A1>0, B1>0), SUM(A1,B1), 0) with A1=2, B1=3 → "5".
- NOTES None
- RELATED UC-024
---
## BR-110 : CONCATENATE(text1, text2, …) shall join all string arguments into a single string.
- TESTABLE CONDITION: =CONCATENATE("Hello"," ","World") → "Hello World".
- NOTES None
- RELATED UC-025
---
## BR-111 : CONCAT shall be a synonym for CONCATENATE and produce identical results.
- TESTABLE CONDITION: =CONCAT("a","b") → "ab".
- NOTES None
- RELATED UC-025
---
## BR-112 : LEN(text) shall return the character count of the string value.
- TESTABLE CONDITION: =LEN("hello") → "5"; =LEN("") → "0".
- NOTES None
- RELATED UC-025
---
## BR-113 : LEFT(text, n) shall return the first n characters; RIGHT(text, n) shall return the last n characters.
- TESTABLE CONDITION: =LEFT("hello",2) → "he"; =RIGHT("hello",2) → "lo".
- NOTES None
- RELATED UC-025
---
## BR-114 : MID(text, start, length) shall return the substring of given length starting at start (1-based).
- TESTABLE CONDITION: =MID("hello",2,3) → "ell".
- NOTES None
- RELATED UC-025
---
## BR-115 : UPPER(text) shall return the string in uppercase; LOWER(text) shall return it in lowercase; TRIM(text) shall remove excess whitespace.
- TESTABLE CONDITION: =UPPER("hello") → "HELLO"; =LOWER("WORLD") → "world"; =TRIM("  hi  ") → "hi".
- NOTES None
- RELATED UC-025
---
## BR-116 : The & operator shall concatenate two values inline without a function call.
- TESTABLE CONDITION: ="Hello"&" "&"World" → "Hello World".
- NOTES None
- RELATED UC-025
---
## BR-117 : ROUND(number, digits) shall round to the specified number of decimal places.
- TESTABLE CONDITION: =ROUND(1.2345,2) → "1.23"; =ROUND(1.2345,0) → "1".
- NOTES None
- RELATED UC-026
---
## BR-118 : ABS(number) shall return the non-negative absolute value.
- TESTABLE CONDITION: =ABS(-5) → "5"; =ABS(5) → "5".
- NOTES None
- RELATED UC-026
---
## BR-119 : INT(number) shall truncate toward negative infinity to the nearest integer.
- TESTABLE CONDITION: =INT(3.9) → "3"; =INT(-3.1) → "-4".
- NOTES None
- RELATED UC-026
---
## BR-120 : MOD(number, divisor) shall return the remainder of integer division.
- TESTABLE CONDITION: =MOD(10,3) → "1"; =MOD(9,3) → "0".
- NOTES None
- RELATED UC-026
---
## BR-121 : SQRT(number) shall return the positive square root; a negative argument shall return #VALUE!.
- TESTABLE CONDITION: =SQRT(9) → "3"; =SQRT(-1) → "#VALUE!".
- NOTES None
- RELATED UC-026
---
## BR-122 : POWER(number, exponent) shall return number raised to exponent.
- TESTABLE CONDITION: =POWER(2,10) → "1024"; =POWER(3,2) → "9".
- NOTES None
- RELATED UC-026
---
## BR-123 : TODAY() shall return the current local date as a YYYY-MM-DD string.
- TESTABLE CONDITION: =TODAY() returns a string matching /^\d{4}-\d{2}-\d{2}$/.
- NOTES None
- RELATED UC-027
---
## BR-124 : NOW() shall return the current local date and time as a YYYY-MM-DD HH:MM string.
- TESTABLE CONDITION: =NOW() returns a string matching /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/.
- NOTES None
- RELATED UC-027
---
## BR-125 : DATE(year, month, day) shall construct and return an ISO date string YYYY-MM-DD.
- TESTABLE CONDITION: =DATE(2026,4,10) → "2026-04-10".
- NOTES None
- RELATED UC-027
---
## BR-126 : YEAR(date), MONTH(date), and DAY(date) shall extract numeric components from a date string.
- TESTABLE CONDITION: =YEAR("2026-04-10") → "2026"; =MONTH("2026-04-10") → "4"; =DAY("2026-04-10") → "10".
- NOTES None
- RELATED UC-027
---
## BR-127 : A formula containing $A$1, $A1, or A$1 shall evaluate identically to the same formula without $ signs.
- TESTABLE CONDITION: =$A$1 and =A1 in the same cell produce the same result when A1=5.
- NOTES None
- RELATED UC-028
---
## BR-128 : Relative references in a copy-pasted formula shall adjust by the row/column offset of the paste destination.
- TESTABLE CONDITION: Copy cell with =A1 from B1 to B2 → formula becomes =A2.
- NOTES None
- RELATED UC-028
---
## BR-129 : Absolute column ($A1) shall hold the column fixed and adjust the row during copy-paste.
- TESTABLE CONDITION: Copy cell with =$A1 from B1 to B2 → formula remains =$A2.
- NOTES None
- RELATED UC-028
---
## BR-130 : Absolute row (A$1) shall hold the row fixed and adjust the column during copy-paste.
- TESTABLE CONDITION: Copy cell with =A$1 from B1 to C1 → formula becomes =B$1... wait, copy from B1 to C1 adjusts col A by +1 → =B$1.
- TESTABLE CONDITION (revised): Copy =A$1 from A2 to B2 → formula becomes =B$1.
- NOTES None
- RELATED UC-028
---
## BR-131 : Fully absolute references ($A$1) shall not adjust during copy-paste regardless of destination.
- TESTABLE CONDITION: Copy cell with =$A$1 from any cell to any other cell — formula remains =$A$1.
- NOTES None
- RELATED UC-028
---
## BR-132 : F4 while editing a cell reference in the formula bar shall cycle: relative → absolute → row-absolute → col-absolute → relative.
- TESTABLE CONDITION: With cursor on "A1" in formula bar, pressing F4 changes it to "$A$1"; again → "A$1"; again → "$A1"; again → "A1".
- NOTES None
- RELATED UC-028
---

