BUSINESS REQUIREMENT:
- BR ID: UC-01.BR-01
- REQUIREMENT STATEMENT: The solution shall be a Manifest V3 Chrome extension that can be installed, enabled, and opened from the browser action with a side panel UI.
- PRIORITY: High
- TESTABLE CONDITION: Loading the unpacked extension succeeds without manifest errors, the extension can be enabled, and clicking the action opens the side panel.

BUSINESS REQUIREMENT:
- BR ID: UC-02.BR-01
- REQUIREMENT STATEMENT: The extension shall provide a Notes List where users can create, edit, delete, and reorder notes with persistence.
- PRIORITY: High
- TESTABLE CONDITION: After add/edit/delete/reorder operations and extension reopen, notes and their order are preserved.

BUSINESS REQUIREMENT:
- BR ID: UC-03.BR-01
- REQUIREMENT STATEMENT: The extension shall allow selecting a note and copying its content to the clipboard with clear error feedback on failure.
- PRIORITY: High
- TESTABLE CONDITION: Copying a selected note writes non-empty text to clipboard, or shows a visible error message when copy is not permitted.

BUSINESS REQUIREMENT:
- BR ID: UC-04.BR-01
- REQUIREMENT STATEMENT: The extension shall expose an options surface for configurable settings and persist those settings across sessions.
- PRIORITY: Medium
- TESTABLE CONDITION: Changes saved in the options surface are present after closing and reopening the extension.

BUSINESS REQUIREMENT:
- BR ID: UC-05.BR-01
- REQUIREMENT STATEMENT: The extension shall support capture mode that lets users select a region on the active page and generate a new note from the capture result.
- PRIORITY: High
- TESTABLE CONDITION: Starting capture mode, completing a valid selection creates exactly one new note; canceling capture creates none.

BUSINESS REQUIREMENT:
- BR ID: UC-06.BR-01
- REQUIREMENT STATEMENT: The extension shall provide light and dark themes that apply immediately and persist across sessions.
- PRIORITY: Medium
- TESTABLE CONDITION: Switching theme updates UI appearance immediately and the chosen theme is restored on next load.

BUSINESS REQUIREMENT:
- BR ID: UC-07.BR-01
- REQUIREMENT STATEMENT: Notes shall be rendered with a colorful, readable palette in both light and dark themes.
- PRIORITY: Medium
- TESTABLE CONDITION: Notes display distinct color styling and text remains readable in each theme.

BUSINESS REQUIREMENT:
- BR ID: UC-08.BR-01
- REQUIREMENT STATEMENT: The side panel UI shall include NOTES and OPTIONS tabs and switch content views without data loss.
- PRIORITY: High
- TESTABLE CONDITION: Clicking each tab displays its content and returning to NOTES preserves note state.

BUSINESS REQUIREMENT:
- BR ID: UC-09.BR-01
- REQUIREMENT STATEMENT: The notes surface shall support list and grid presentation modes with clear active-state indication.
- PRIORITY: Medium
- TESTABLE CONDITION: Toggling view changes layout between one-column list and multi-column grid and marks the active mode.

BUSINESS REQUIREMENT:
- BR ID: UC-10.BR-01
- REQUIREMENT STATEMENT: The header shall render brand text as Chrome [pnp.png] Buddy in the top-left with stable alignment.
- PRIORITY: Low
- TESTABLE CONDITION: Header displays the image asset between words without broken-image state across supported panel sizes.

BUSINESS REQUIREMENT:
- BR ID: UC-11.BR-01
- REQUIREMENT STATEMENT: Major UI actions shall be represented by icon-based controls, and the Open Full Options button shall be removed.
- PRIORITY: Medium
- TESTABLE CONDITION: Actions use icons with accessible labels/tooltips and Open Full Options is not present in the UI.
