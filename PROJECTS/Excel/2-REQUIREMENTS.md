# Business Requirements — Excel Chrome Extension

**Project:** Excel Chrome Extension
**Source:** 1-USE-CASES.md (UC-001 – UC-015)
**Date:** 2026-04-07

---

## BR-001 : The extension shall open a standalone detached OS-level window when the Chrome toolbar icon is clicked

- TESTABLE CONDITION
  Given the user clicks the Chrome extension icon, when the action fires, then a new detached (non-popup) OS-level window opens containing the spreadsheet UI.
- NOTES
  Implemented via chrome.windows.create in the service worker background script. The `action` block in manifest.json must have no `default_popup` so that `chrome.action.onClicked` fires instead.
- RELATED
  UC-001

---

## BR-002 : The window title bar shall display "Book1 - Excel" for a new unsaved workbook

- TESTABLE CONDITION
  Given the spreadsheet window has just opened with no file loaded, then the OS window title bar reads exactly "Book1 - Excel".
- NOTES
  The title is set via `document.title`. When a CSV file is loaded the title must update to "<filename> - Excel".
- RELATED
  UC-001

---

## BR-003 : The menu bar shall display exactly eight tabs: File, Home, Insert, Page Layout, Formulas, Data, Review, View

- TESTABLE CONDITION
  Given the spreadsheet window is open, then a horizontal menu bar is visible containing exactly the labels: File, Home, Insert, Page Layout, Formulas, Data, Review, View — in that order, with no additional tabs.
- NOTES
  Menu bar must be a styled horizontal bar directly beneath the title bar. Tab labels must match Excel's wording exactly (case-sensitive).
- RELATED
  UC-001

---

## BR-004 : The ribbon toolbar shall be visible below the menu bar with grouped action buttons in the Home ribbon

- TESTABLE CONDITION
  Given the spreadsheet window is open, then a ribbon area is visible below the menu bar containing at minimum the Clipboard, Font, Alignment, and Number groups, each with a visible group label.
- NOTES
  Ribbon is always rendered; it does not collapse or scroll. Only the Home tab ribbon content is required for the initial build.
- RELATED
  UC-001, UC-011

---

## BR-005 : The Name Box shall display "A1" on initial window open and be positioned left of the fx label

- TESTABLE CONDITION
  Given the spreadsheet window opens with no prior selection, then the Name Box element shows the text "A1" and is positioned to the left of the "fx" label in the formula bar area.
- NOTES
  Name Box width is approximately 80 px. Positioning must match Excel's layout: Name Box → fx → formula input, left to right.
- RELATED
  UC-001, UC-014

---

## BR-006 : The formula bar shall display the active cell content alongside an "fx" label

- TESTABLE CONDITION
  Given the spreadsheet window is open, then the formula bar area is visible with an italic gray "fx" label to its left, and the input field displays the content of the currently active cell.
- NOTES
  The formula bar input and the cell display are kept in sync. When a formula cell is selected the formula bar shows the raw formula string (e.g., =SUM(A1:A3)), not the computed result.
- RELATED
  UC-001, UC-004

---

## BR-007 : The grid shall render column header letters (A, B, C…) in a fixed light-gray row at the top

- TESTABLE CONDITION
  Given the spreadsheet window is open, then a fixed header row containing alphabetical column labels (A, B, C, …) is visible at the top of the grid area with a background color of #f2f2f2.
- NOTES
  Default column width is 64 px. Headers remain fixed during vertical scrolling.
- RELATED
  UC-001, UC-012

---

## BR-008 : The grid shall render row numbers (1, 2, 3…) in a fixed left column

- TESTABLE CONDITION
  Given the spreadsheet window is open, then a fixed left column displaying sequential row numbers starting at 1 is visible with a background color of #f2f2f2.
- NOTES
  Default row height is 21 px. Row numbers remain fixed during horizontal scrolling.
- RELATED
  UC-001, UC-012

---

## BR-009 : The sheet tab bar at the bottom shall show a "Sheet1" tab active on initial open

- TESTABLE CONDITION
  Given the spreadsheet window opens for the first time, then a tab bar at the bottom of the grid area shows at least one tab labelled "Sheet1", and that tab is in the active (highlighted) state.
- NOTES
  Active tab styling: white background with a green bottom border (#217346). Inactive tabs are light gray.
- RELATED
  UC-001, UC-013

---

## BR-010 : Only one spreadsheet window shall be open at a time; clicking the icon when a window exists shall focus it

- TESTABLE CONDITION
  Given a spreadsheet window is already open, when the user clicks the extension icon again, then the existing window is brought to the foreground and no second window is created.
- NOTES
  The service worker tracks the active windowId. On icon click it checks if the window still exists (chrome.windows.get); if so it calls chrome.windows.update with focused:true; if not it creates a new window.
- RELATED
  UC-001

---

## BR-011 : Clicking a cell shall select it with a blue border and highlight its column/row headers

- TESTABLE CONDITION
  Given the user clicks a cell (e.g., C4), then that cell receives a 2 px blue selection border, and the corresponding column header (C) and row header (4) change to a darker highlight color (#d6e4f7 or similar).
- NOTES
  Selection border color: #1072bb (modern Excel blue accent). Column and row header highlights must update together whenever selection changes.
- RELATED
  UC-002

---

## BR-012 : The Name Box shall update immediately to show the address of the selected cell in uppercase column+row format

- TESTABLE CONDITION
  Given the user selects any cell, then the Name Box updates synchronously to display the cell address in uppercase format (e.g., "B3", "AA10") with no delay.
- NOTES
  Address format is always uppercase column letters followed by the 1-based row number. No spaces.
- RELATED
  UC-002, UC-014

---

## BR-013 : Typed content shall appear simultaneously in the selected cell and in the formula bar

- TESTABLE CONDITION
  Given the user has selected a cell and begins typing, then every character typed appears both in the cell and in the formula bar input in real time.
- NOTES
  The cell and formula bar must stay in sync during active typing. Confirmation (Enter/Tab/arrow) finalizes the value.
- RELATED
  UC-002

---

## BR-014 : Navigation keys (Enter, Tab, arrows) shall confirm the current cell edit and move focus to the adjacent cell

- TESTABLE CONDITION
  Given the user is editing a cell, when they press Enter, Tab, or an arrow key, then the edit is confirmed and focus moves to the logically adjacent cell (down for Enter, right for Tab, directional for arrows).
- NOTES
  Enter moves down; Shift+Enter moves up; Tab moves right; Shift+Tab moves left.
- RELATED
  UC-002

---

## BR-015 : Pressing F2 on a selected cell shall enter in-place edit mode

- TESTABLE CONDITION
  Given the user has a cell selected (not in edit mode), when they press F2, then the cell enters in-place edit mode with the cursor at the end of the existing content.
- NOTES
  Double-click on an existing cell must also enter in-place edit mode.
- RELATED
  UC-002

---

## BR-016 : Pressing Escape during a cell edit shall cancel the edit and restore the original value

- TESTABLE CONDITION
  Given the user is in edit mode for a cell that already has content, when they press Escape, then the cell reverts to its prior value and edit mode is exited without changes.
- NOTES
  Escape must also cancel formula bar edits initiated via the formula bar input.
- RELATED
  UC-002, UC-004

---

## BR-017 : Formulas beginning with "=" shall be evaluated and the computed result displayed in the cell

- TESTABLE CONDITION
  Given the user enters a string starting with "=" (e.g., =A1+B2) and presses Enter, then the cell displays the computed numeric or string result, not the raw formula text.
- NOTES
  Raw formula text is stored internally and displayed in the formula bar when the cell is selected.
- RELATED
  UC-003

---

## BR-018 : Supported formula operations shall include arithmetic (+, -, *, /) and functions SUM, AVERAGE, MIN, MAX, COUNT

- TESTABLE CONDITION
  Given the user enters a formula using any of: +, -, *, /, SUM(), AVERAGE(), MIN(), MAX(), COUNT() with valid cell references or literal numbers, then the formula evaluates to the correct result.
- NOTES
  Cell references must support both absolute and relative notation (e.g., A1, $A$1). Range notation (A1:A5) is required for the aggregation functions.
- RELATED
  UC-003

---

## BR-019 : Changing a referenced cell's value shall trigger live recalculation of all formulas that depend on it

- TESTABLE CONDITION
  Given cell B1 contains =A1+10 and A1 contains 5, when the user changes A1 to 20, then B1 immediately updates to display 30.
- NOTES
  Recalculation must be triggered synchronously on every cell value change. Circular references should display #ERR.
- RELATED
  UC-003

---

## BR-020 : Invalid or unevaluable formulas shall display "#ERR" in the cell

- TESTABLE CONDITION
  Given the user enters a malformed formula (e.g., =, =1/, =BADFUNCTION()), then after confirming, the cell displays "#ERR" as a visual error indicator.
- NOTES
  #ERR must be styled to be visually distinct (e.g., red text). Hovering on an error cell may show a tooltip with the error reason (optional enhancement).
- RELATED
  UC-003

---

## BR-021 : The formula bar shall always display the raw formula string (not the computed result) when a formula cell is selected

- TESTABLE CONDITION
  Given a cell contains the formula =SUM(A1:A3) which evaluates to 15, when the user selects that cell, then the formula bar input shows "=SUM(A1:A3)", not "15".
- NOTES
  This is a core Excel behavior — the formula bar is the source-of-truth display for cell raw content.
- RELATED
  UC-004

---

## BR-022 : The "fx" label shall be visible and styled as italic gray text to the left of the formula bar input

- TESTABLE CONDITION
  Given the spreadsheet window is open, then an "fx" label in italic gray font is visible immediately to the left of the formula bar input at all times.
- NOTES
  Styling: font-style:italic; color:#666 or similar gray. The fx label is decorative and non-interactive.
- RELATED
  UC-004

---

## BR-023 : Edits made directly in the formula bar shall be applied to the active cell on Enter confirmation

- TESTABLE CONDITION
  Given the user clicks into the formula bar input and modifies the content, when they press Enter, then the active cell updates to reflect the new value or formula.
- NOTES
  Tab confirmation in the formula bar should also commit the value and move focus to the adjacent cell (standard Excel behavior).
- RELATED
  UC-004

---

## BR-024 : The file picker for Open shall accept .csv files only

- TESTABLE CONDITION
  Given the user triggers the Open action, then the browser file picker dialog opens with its accepted file type filter set to ".csv" only.
- NOTES
  Implemented via `<input type="file" accept=".csv">` triggered programmatically. The filter label should read "CSV Files (*.csv)".
- RELATED
  UC-005

---

## BR-025 : CSV rows shall map to spreadsheet rows and comma-separated values shall map to columns

- TESTABLE CONDITION
  Given a CSV file with 3 rows and 4 columns is opened, then the grid populates with data in rows 1–3 and columns A–D, matching the CSV structure exactly.
- NOTES
  RFC 4180 parsing must handle quoted fields. The first row is treated as data (not forced as a header row).
- RELATED
  UC-005

---

## BR-026 : Malformed or unreadable CSV files shall display a clear error message

- TESTABLE CONDITION
  Given the user selects a file that cannot be parsed as valid CSV (e.g., a binary file or a CSV with encoding errors), then a human-readable error message is displayed and the grid is not modified.
- NOTES
  Error display may be a browser alert() or an inline status message area. The existing grid data must not be overwritten on parse failure.
- RELATED
  UC-005

---

## BR-027 : Saving shall serialize the current grid to CSV format and initiate a browser file download with a .csv extension

- TESTABLE CONDITION
  Given the user triggers the Save action, then the browser initiates a file download where the file content is the grid data in CSV format and the filename ends in ".csv".
- NOTES
  Implemented via a programmatically created `<a download>` element with a Blob URL. No server communication is permitted.
- RELATED
  UC-006

---

## BR-028 : CSV output shall properly quote fields containing commas, double-quotes, or newlines per RFC 4180

- TESTABLE CONDITION
  Given a cell contains the value "hello, world" (with a comma), when the grid is saved to CSV, then that field is enclosed in double-quotes in the output file per RFC 4180.
- NOTES
  Double-quote characters inside a field must be escaped as two consecutive double-quotes (""). Newlines inside a field must also trigger quoting.
- RELATED
  UC-006

---

## BR-029 : When unsaved changes are present, a confirmation prompt shall appear before any destructive action

- TESTABLE CONDITION
  Given the user has edited one or more cells without saving, when they trigger Open File or any other action that would replace the current grid, then a browser confirm() dialog (or equivalent) is displayed before proceeding.
- NOTES
  Unsaved state is defined as any cell modification after the last save. The prompt must appear for File > Open and any other grid-clearing action.
- RELATED
  UC-007

---

## BR-030 : Confirming the destructive action shall clear or replace the current grid; cancelling shall leave it intact

- TESTABLE CONDITION
  Given the confirmation prompt is displayed, when the user clicks "Cancel", then the grid and all unsaved edits remain unchanged; when the user clicks "OK/Confirm", then the action proceeds (grid is cleared or replaced).
- NOTES
  After confirmation, the dirty/unsaved state flag must be reset to false so that the prompt does not appear again immediately.
- RELATED
  UC-007

---

## BR-031 : Ctrl+S shall trigger the Save (CSV download) action

- TESTABLE CONDITION
  Given the spreadsheet window is focused, when the user presses Ctrl+S, then the CSV download is initiated identically to using the File > Save menu item.
- NOTES
  The keyboard shortcut must be registered as a document-level keydown listener. It must not interact with any browser-native Ctrl+S behavior (preventDefault required).
- RELATED
  UC-008

---

## BR-032 : Ctrl+O shall trigger the Open File action

- TESTABLE CONDITION
  Given the spreadsheet window is focused, when the user presses Ctrl+O, then the CSV file picker opens identically to using the File > Open menu item.
- NOTES
  preventDefault() must be called to suppress the browser's native "open page" behavior.
- RELATED
  UC-008

---

## BR-033 : Ctrl+Z shall undo the last cell edit

- TESTABLE CONDITION
  Given the user has typed a value into a cell and confirmed it, when they press Ctrl+Z, then the cell reverts to its previous value and the grid is updated accordingly.
- NOTES
  Multi-level undo is desirable but a minimum of one undo level is required. The undo stack must be cleared when a new CSV file is loaded.
- RELATED
  UC-008

---

## BR-034 : Ctrl+Home shall move focus to cell A1

- TESTABLE CONDITION
  Given the user is focused on any cell (e.g., D10), when they press Ctrl+Home, then focus moves to cell A1 and the view scrolls so that A1 is visible.
- NOTES
  The Name Box must update to "A1" and the formula bar must update to the content of A1 after this action.
- RELATED
  UC-008

---

## BR-035 : All active keyboard shortcuts shall be listed in the Help dialog

- TESTABLE CONDITION
  Given the Help dialog is open, then each of the registered shortcuts (Ctrl+S, Ctrl+O, Ctrl+Z, Ctrl+Home, F1) appears in the shortcuts table with its key combination and action description.
- NOTES
  Shortcut list in Help must be derived from the same data structure used to register the handlers, ensuring they remain in sync automatically.
- RELATED
  UC-008, UC-010

---

## BR-036 : Window position and size shall be saved to chrome.storage.local when the window is moved or resized

- TESTABLE CONDITION
  Given the user moves or resizes the spreadsheet window, then the new position (left, top) and size (width, height) are written to chrome.storage.local under a known key within 1 second.
- NOTES
  The service worker (background.js) listens to chrome.windows.onBoundsChanged to capture position/size changes. The storage key should be "windowBounds" or equivalent.
- RELATED
  UC-009

---

## BR-037 : On next open, the window shall be restored to the previously saved position and size

- TESTABLE CONDITION
  Given the user has previously positioned the window at (100, 200) with size 1200×800, when they close and reopen the window, then it opens at (100, 200) with size 1200×800.
- NOTES
  Restoration is done by reading chrome.storage.local in the background service worker and passing the bounds to chrome.windows.create.
- RELATED
  UC-009

---

## BR-038 : A sensible default position and size shall be used when no saved window state exists

- TESTABLE CONDITION
  Given no prior window state is stored (first launch or cleared storage), when the window opens, then it opens at a reasonable default position and size (e.g., centered, approximately 1200×800).
- NOTES
  Default fallback: left:80, top:60, width:1200, height:800. These values should be defined as named constants in the code.
- RELATED
  UC-009

---

## BR-039 : Pressing F1 or selecting the Help menu item shall open a Help dialog listing all keyboard shortcuts

- TESTABLE CONDITION
  Given the spreadsheet window is focused, when the user presses F1 or selects Help from the menu bar, then a modal dialog opens displaying all registered keyboard shortcuts.
- NOTES
  The dialog must use the native HTML <dialog> element with showModal() so that it traps focus and blocks interaction with the grid.
- RELATED
  UC-010

---

## BR-040 : The Help dialog shall be dismissible via a Close button and via the Escape key

- TESTABLE CONDITION
  Given the Help dialog is open, when the user clicks the "Close" button or presses Escape, then the dialog closes and focus returns to the previously active cell.
- NOTES
  The native <dialog> element handles Escape via a `cancel` event. A visible "Close" button must also be provided for mouse users.
- RELATED
  UC-010

---

## BR-041 : The ribbon shall be divided into labeled groups: Clipboard, Font, Alignment, Number

- TESTABLE CONDITION
  Given the spreadsheet window is open, then the ribbon area below the menu bar shows four labeled groups — Clipboard, Font, Alignment, Number — each with its group label text rendered below its buttons.
- NOTES
  Group labels must be visible at all times as small text beneath the button row, matching Excel's ribbon group caption style.
- RELATED
  UC-011

---

## BR-042 : Bold, Italic, and Underline ribbon buttons shall toggle the corresponding font style on the selected cell(s)

- TESTABLE CONDITION
  Given the user has selected a cell and clicks the Bold (B) ribbon button, then the cell's text becomes bold; clicking Bold again removes the bold style. Same behavior applies for Italic (I) and Underline (U).
- NOTES
  Active/toggled state must be visually indicated (e.g., button appears pressed or highlighted with a border/background change matching Excel's toggled button appearance).
- RELATED
  UC-011

---

## BR-043 : Alignment buttons (Left, Center, Right) shall set horizontal text alignment on selected cell(s)

- TESTABLE CONDITION
  Given the user selects a cell and clicks the Align Center ribbon button, then the cell's text is centered horizontally; clicking Align Left makes it left-aligned, Align Right makes it right-aligned.
- NOTES
  Alignment state must be reflected in the active button highlight. Only one alignment button should appear active at a time per cell.
- RELATED
  UC-011

---

## BR-044 : Ribbon buttons shall display a tooltip on hover

- TESTABLE CONDITION
  Given the user hovers the mouse pointer over any ribbon button (e.g., Bold), then a tooltip appears showing the button's action name (e.g., "Bold").
- NOTES
  Tooltip may be implemented via the native `title` attribute or a custom CSS tooltip. Tooltip must appear within 500 ms of hover.
- RELATED
  UC-011

---

## BR-045 : Column headers shall be fixed while the grid scrolls vertically; row numbers shall be fixed while the grid scrolls horizontally

- TESTABLE CONDITION
  Given the grid contains enough data to require scrolling, when the user scrolls down, then the column header row (A, B, C…) remains visible at the top; when scrolling right, the row number column remains visible at the left.
- NOTES
  Implemented via CSS sticky positioning (position:sticky; top:0 for headers; left:0 for row numbers) or an equivalent fixed-header table layout.
- RELATED
  UC-012

---

## BR-046 : The selected cell's column header and row number shall be highlighted in a distinct color (#d6e4f7) on selection

- TESTABLE CONDITION
  Given the user selects cell D7, then the D column header cell and the row 7 number cell both change to a highlighted background color (#d6e4f7 or equivalent), and revert to the default (#f2f2f2) when another cell is selected.
- NOTES
  The highlight must update dynamically on every selection change, including keyboard navigation.
- RELATED
  UC-012

---

## BR-047 : Default column width shall be 64 px and default row height shall be 21 px

- TESTABLE CONDITION
  Given the spreadsheet window opens with no user customization, then each data column is 64 px wide and each data row (excluding the header row) is 21 px tall.
- NOTES
  Widths and heights are defined as CSS or JavaScript constants. User-resizable columns/rows are out of scope for the initial build.
- RELATED
  UC-012

---

## BR-048 : The sheet tab bar shall allow adding new sheets via a "+" button, naming them Sheet2, Sheet3, etc.

- TESTABLE CONDITION
  Given the sheet tab bar is visible and the user clicks the "+" button, then a new tab labelled "Sheet2" (then "Sheet3", etc.) is added to the right of existing tabs, and the new sheet becomes active.
- NOTES
  Sheet names must be auto-incremented sequentially. Sheet tab overflow may be handled by a horizontally scrollable tab row.
- RELATED
  UC-013

---

## BR-049 : Each sheet shall maintain independent cell data; switching sheets shall not affect other sheets' data

- TESTABLE CONDITION
  Given Sheet1 has data in cell A1="Hello" and the user switches to Sheet2, then Sheet2's A1 is empty; switching back to Sheet1 shows A1="Hello" unchanged.
- NOTES
  Sheet data is stored in an in-memory data structure indexed by sheet name. Persistence across sessions is not required unless a CSV is saved/loaded.
- RELATED
  UC-013

---

## BR-050 : The active sheet tab shall be styled with a white background and a green bottom border (#217346); inactive tabs shall be light gray

- TESTABLE CONDITION
  Given Sheet2 is the active sheet, then Sheet2's tab has a white background and a green (#217346) bottom border; all other tabs have a gray background and no green border.
- NOTES
  Active tab styling must update immediately when a tab is clicked. The green bottom border is the primary visual differentiator for the active tab.
- RELATED
  UC-013

---

## BR-051 : The Name Box shall be approximately 80 px wide with a visible border, positioned left of the "fx" label

- TESTABLE CONDITION
  Given the spreadsheet window is open, then the Name Box element has a rendered width of approximately 80 px (±5 px), has a visible border, and is positioned to the left of the "fx" label.
- NOTES
  Width should be enforced via a CSS rule (e.g., width:80px). The border must be visible to distinguish the Name Box from surrounding chrome.
- RELATED
  UC-014

---

## BR-052 : Typing a valid cell address into the Name Box and pressing Enter shall navigate focus to that cell

- TESTABLE CONDITION
  Given the user clicks the Name Box, types "D15", and presses Enter, then the grid scrolls so that D15 is visible and focus moves to cell D15, with the Name Box displaying "D15".
- NOTES
  Input validation: if the entered address is invalid (e.g., out of range or malformed), the Name Box reverts to the current cell address and focus stays on the current cell.
- RELATED
  UC-014

---

## BR-053 : Right-clicking a cell shall display a context menu containing: Cut, Copy, Paste, Insert Row, Delete Row, Clear Contents

- TESTABLE CONDITION
  Given the user right-clicks any cell, then a context menu appears at the cursor position containing exactly the items: Cut, Copy, Paste, (separator), Insert Row, Delete Row, (separator), Clear Contents — and no additional items.
- NOTES
  The context menu must suppress the browser's native right-click context menu via event.preventDefault() on the contextmenu event.
- RELATED
  UC-015

---

## BR-054 : The context menu shall be styled with a white background, system font, border shadow, and Excel-style hover highlight

- TESTABLE CONDITION
  Given the context menu is open, then each menu item has a white background by default and shows a blue highlight (#e3f2fd or similar) when hovered, with a drop shadow around the menu container.
- NOTES
  Font: system font (Segoe UI, Arial) at approximately 13 px. Border shadow: 1–2 px box-shadow rgba.
- RELATED
  UC-015

---

## BR-055 : Clicking outside the context menu or pressing Escape shall close it without performing any action

- TESTABLE CONDITION
  Given the context menu is open, when the user clicks anywhere outside it or presses the Escape key, then the context menu closes and no cell data is changed.
- NOTES
  A document-level mousedown listener (with stopPropagation on the menu itself) and a keydown Escape listener should both trigger menu dismissal.
- RELATED
  UC-015

---

## BR-056 : Cut shall copy the cell value to an internal clipboard and clear the source cell; Copy shall copy without clearing

- TESTABLE CONDITION
  Given the context menu is open and the user clicks "Cut" on a cell containing "foo", then the cell is cleared and an internal clipboard holds "foo"; if "Copy" is chosen instead, the cell retains "foo" and the clipboard holds "foo".
- NOTES
  An internal clipboard variable (not the OS clipboard) is sufficient. The clipboard state must persist until the next Cut or Copy operation.
- RELATED
  UC-015

---

## BR-057 : Insert Row shall insert a blank row above the right-clicked cell's row; Delete Row shall remove that row

- TESTABLE CONDITION
  Given the user right-clicks cell B5 and selects "Insert Row", then a blank row is inserted at row 5 and all existing data from row 5 downward shifts to row 6 and below; selecting "Delete Row" from B5 removes row 5 and shifts data up.
- NOTES
  Row indices in the internal data model must be updated correctly after insert/delete. Formula references to shifted rows are desirable but not required for the initial build.
- RELATED
  UC-015

---

## BR-058 : Clear Contents shall delete the cell's value and formula without removing its formatting

- TESTABLE CONDITION
  Given a cell contains a value and has bold formatting applied, when "Clear Contents" is selected from the context menu, then the cell's displayed value becomes empty but the bold formatting remains applied.
- NOTES
  "Clear Contents" clears raw content (value and formula) only. Formatting state (bold, italic, underline, text alignment) must be preserved after this action.
- RELATED
  UC-015

---
