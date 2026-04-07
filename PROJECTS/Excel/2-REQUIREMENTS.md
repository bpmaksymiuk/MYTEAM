# Business Requirements

Generated from `1-USE-CASES.md`. Owned by Business Analyst.

---

## BR-001 : The extension shall provide a toolbar icon that opens the spreadsheet window when clicked
- TESTABLE CONDITION
  Given the extension is installed and enabled, when the user clicks the browser toolbar icon, then the spreadsheet window opens within 1 second.
- NOTES None
- RELATED UC-001

---

## BR-002 : The system shall open the spreadsheet in a detached OS-level Chrome window
- TESTABLE CONDITION
  Given the user clicks the toolbar icon, then the spreadsheet opens in a chrome.windows-managed popup window with OS-level title bar, resize handles, and minimize/restore controls — not a browser popup.
- NOTES Window type: 'popup'. URL: chrome.runtime.getURL('index.html').
- RELATED UC-001, UC-009

---

## BR-003 : Only one spreadsheet window shall exist at a time; clicking the icon when a window is open shall focus it
- TESTABLE CONDITION
  Given a spreadsheet window is already open, when the user clicks the toolbar icon again, then the existing window is brought to the foreground and no second window is created.
- NOTES Service worker must track active windowId and clear it on onRemoved.
- RELATED UC-001

---

## BR-004 : The system shall display a grid with column headers (A, B, C…) and row numbers (1, 2, 3…)
- TESTABLE CONDITION
  Given the spreadsheet window is open, then a grid is visible with alphabetic column headers starting at A and numeric row labels starting at 1.
- NOTES Initial grid size: 26 columns (A–Z) × 50 rows minimum.
- RELATED UC-001

---

## BR-005 : The system shall display a formula bar above the grid showing the active cell's raw content
- TESTABLE CONDITION
  Given a cell is selected, then the formula bar displays the raw source of that cell (formula string or literal value), not the computed result.
- NOTES Formula bar must update immediately on cell selection change.
- RELATED UC-001, UC-004

---

## BR-006 : The user shall be able to select a cell by clicking it
- TESTABLE CONDITION
  Given the grid is visible, when the user clicks any cell, then that cell becomes the active cell and is visually highlighted with a distinct border or background.
- NOTES None
- RELATED UC-002

---

## BR-007 : Typing while a cell is selected shall enter edit mode and display typed content in the cell and formula bar
- TESTABLE CONDITION
  Given a cell is selected (not in edit mode), when the user begins typing, then edit mode activates and each keystroke is reflected simultaneously in the cell and the formula bar.
- NOTES None
- RELATED UC-002

---

## BR-008 : Pressing Enter, Tab, or an arrow key shall confirm the current edit and move focus to the adjacent cell
- TESTABLE CONDITION
  Given a cell is in edit mode, when the user presses Enter (down), Tab (right), or an arrow key (directional), then the edit is committed and focus moves to the corresponding adjacent cell.
- NOTES None
- RELATED UC-002

---

## BR-009 : Pressing Escape while editing shall cancel the edit and restore the cell's previous content
- TESTABLE CONDITION
  Given a cell is in edit mode with unsaved changes, when the user presses Escape, then the cell reverts to its pre-edit content and edit mode exits.
- NOTES None
- RELATED UC-002

---

## BR-010 : Double-clicking or pressing F2 on a cell shall enter in-place edit mode
- TESTABLE CONDITION
  Given a cell is selected, when the user double-clicks it or presses F2, then edit mode activates with the cursor positioned at the end of the existing content.
- NOTES None
- RELATED UC-002

---

## BR-011 : Cells whose content begins with = shall be evaluated as formulas; the computed result shall be displayed
- TESTABLE CONDITION
  Given a cell contains =A1+B1, when A1=2 and B1=3, then the cell displays 5 (not the formula text).
- NOTES None
- RELATED UC-003

---

## BR-012 : The formula engine shall support arithmetic operators: +, -, *, /
- TESTABLE CONDITION
  Given formulas using +, -, *, /, then each operator produces the arithmetically correct result; division by zero displays #DIV/0!.
- NOTES None
- RELATED UC-003

---

## BR-013 : The formula engine shall support the functions SUM, AVERAGE, MIN, MAX, COUNT with range syntax
- TESTABLE CONDITION
  Given =SUM(A1:A5) where A1–A5 contain 1,2,3,4,5, then the cell displays 15. Same validation applies for AVERAGE (3), MIN (1), MAX (5), COUNT (5).
- NOTES Range syntax: A1:B3 (rectangular). COUNT counts numeric cells only.
- RELATED UC-003

---

## BR-014 : Cell references in formulas shall recalculate automatically when referenced cells change
- TESTABLE CONDITION
  Given cell C1 contains =A1+B1 and A1=2, B1=3, then C1 displays 5. When A1 is changed to 10, C1 immediately displays 13 without any user action.
- NOTES Circular reference detection is out of scope for this release.
- RELATED UC-003

---

## BR-015 : Invalid or unevaluable formulas shall display an error token in the cell
- TESTABLE CONDITION
  Given a cell contains =UNKNOWNFUNC() or a malformed expression, then the cell displays #ERR (or a contextually appropriate error such as #DIV/0! or #REF!).
- NOTES None
- RELATED UC-003

---

## BR-016 : The formula bar shall display the raw formula (not computed value) when a formula cell is selected
- TESTABLE CONDITION
  Given a cell contains =SUM(A1:A3) and displays 6, when the user clicks that cell, then the formula bar shows =SUM(A1:A3).
- NOTES None
- RELATED UC-004

---

## BR-017 : Editing the formula bar and pressing Enter shall update the cell content and trigger recalculation
- TESTABLE CONDITION
  Given the formula bar is in edit mode (user clicked into it), when the user changes the content and presses Enter, then the cell reflects the new content and all dependent cells recalculate.
- NOTES None
- RELATED UC-004

---

## BR-018 : Pressing Escape while editing the formula bar shall cancel the edit
- TESTABLE CONDITION
  Given the formula bar is in edit mode, when the user presses Escape, then the formula bar reverts to the original cell content and no change is made to the cell.
- NOTES None
- RELATED UC-004

---

## BR-019 : The system shall allow the user to open a .csv file from the local filesystem via a file picker
- TESTABLE CONDITION
  Given the user triggers Open (File menu or Ctrl+O), then a file picker dialog appears filtered to .csv files only.
- NOTES Use the HTML <input type="file" accept=".csv"> approach triggered programmatically.
- RELATED UC-005

---

## BR-020 : The system shall parse the selected CSV and populate the grid rows and columns accordingly
- TESTABLE CONDITION
  Given a CSV with 3 rows and 4 comma-separated columns, then after load the grid shows those values at rows 1–3, columns A–D.
- NOTES Handle quoted fields per RFC 4180. Strip BOM if present.
- RELATED UC-005

---

## BR-021 : Loading a CSV when unsaved edits are present shall require a confirmation prompt before proceeding
- TESTABLE CONDITION
  Given the grid has unsaved changes, when the user triggers Open, then a confirmation dialog appears before the current grid is replaced.
- NOTES None
- RELATED UC-005, UC-007

---

## BR-022 : Malformed or unreadable CSV files shall display a user-visible error message
- TESTABLE CONDITION
  Given the user selects a file that cannot be parsed as valid CSV, then an error message is shown identifying the failure; the existing grid is not modified.
- NOTES None
- RELATED UC-005

---

## BR-023 : The system shall serialize the current grid to CSV and trigger a browser download when Save is triggered
- TESTABLE CONDITION
  Given the user triggers Save (File menu or Ctrl+S), then a .csv file download is initiated whose content matches the current grid values row by row, column by column.
- NOTES Use Blob + URL.createObjectURL; revoke URL after click.
- RELATED UC-006

---

## BR-024 : CSV output shall conform to RFC 4180 quoting rules
- TESTABLE CONDITION
  Given a cell contains a comma, double-quote, or newline, then the exported CSV wraps that cell's value in double-quotes and escapes internal double-quotes by doubling them.
- NOTES None
- RELATED UC-006

---

## BR-025 : The download shall require no server and shall use the default filename spreadsheet.csv
- TESTABLE CONDITION
  Given the user triggers Save, then the browser download begins client-side and the suggested filename is spreadsheet.csv with a .csv extension.
- NOTES None
- RELATED UC-006

---

## BR-026 : The system shall detect unsaved changes before any action that would replace or clear the grid
- TESTABLE CONDITION
  Given the user has made edits since the last save or load, when the user triggers Open or New, then the system identifies the dirty state and shows a prompt before proceeding.
- NOTES Dirty state resets after Save (download) and after a successful load.
- RELATED UC-007

---

## BR-027 : Canceling a confirmation prompt shall leave the current grid and all edits unchanged
- TESTABLE CONDITION
  Given the confirmation prompt is displayed, when the user selects Cancel, then no change is made to the grid and the triggering action does not proceed.
- NOTES None
- RELATED UC-007

---

## BR-028 : Ctrl+S shall trigger the Save (CSV download) action
- TESTABLE CONDITION
  Given the spreadsheet window is focused, when the user presses Ctrl+S, then the CSV download begins identically to triggering Save from the File menu.
- NOTES None
- RELATED UC-008

---

## BR-029 : Ctrl+O shall trigger the Open file picker action
- TESTABLE CONDITION
  Given the spreadsheet window is focused, when the user presses Ctrl+O, then the file picker dialog opens identically to triggering Open from the File menu.
- NOTES None
- RELATED UC-008

---

## BR-030 : Ctrl+Home shall move the active cell selection to A1
- TESTABLE CONDITION
  Given any cell is selected, when the user presses Ctrl+Home, then cell A1 becomes the active cell and is scrolled into view.
- NOTES None
- RELATED UC-008

---

## BR-031 : The window position and size shall be persisted to chrome.storage.local when the window is moved or resized
- TESTABLE CONDITION
  Given the user moves or resizes the spreadsheet window, then the updated bounds (left, top, width, height) are written to chrome.storage.local under the key 'windowBounds'.
- NOTES None
- RELATED UC-009

---

## BR-032 : The window shall reopen at the previously saved position and size
- TESTABLE CONDITION
  Given bounds have been saved, when the user closes and reopens the window, then it opens at the saved left, top, width, height values.
- NOTES Default fallback: {left: 100, top: 100, width: 1024, height: 700}.
- RELATED UC-009

---

## BR-033 : The system shall display a Help dialog listing all keyboard shortcuts when Help is triggered
- TESTABLE CONDITION
  Given the user triggers Help (menu or F1), then a dialog opens listing each supported shortcut key combination paired with its action label.
- NOTES None
- RELATED UC-010

---

## BR-034 : The shortcuts listed in the Help dialog shall match the actual active bindings
- TESTABLE CONDITION
  Given the Help dialog is open, then each shortcut shown can be verified to trigger the corresponding action in the spreadsheet; no shortcut is listed that does not function.
- NOTES Derived from the same SHORTCUTS data structure used to register the listeners.
- RELATED UC-010

---

## BR-035 : The Help dialog shall be dismissible via a Close button and via the Escape key
- TESTABLE CONDITION
  Given the Help dialog is open, when the user clicks Close or presses Escape, then the dialog is dismissed and the active cell regains focus.
- NOTES HTML <dialog> element provides built-in Escape via the 'cancel' event.
- RELATED UC-010
