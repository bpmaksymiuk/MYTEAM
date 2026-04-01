BUSINESS REQUIREMENT:
- BR ID: UC-01.BR-01
- REQUIREMENT STATEMENT: The solution shall be a Manifest V3 Chrome extension named Browser Buddy that can be installed, enabled, and opened from the browser action with a side panel UI.
- PRIORITY: High
- TESTABLE CONDITION: Loading the unpacked extension succeeds without manifest errors, the extension can be enabled, and clicking the action opens the side panel.

BUSINESS REQUIREMENT:
- BR ID: UC-02.BR-01
- REQUIREMENT STATEMENT: The extension shall provide a notes list where users can create, review, edit, and delete reusable notes with persistence.
- PRIORITY: High
- TESTABLE CONDITION: After create/edit/delete actions and extension reopen, note content and existence are preserved.

BUSINESS REQUIREMENT:
- BR ID: UC-03.BR-01
- REQUIREMENT STATEMENT: The notes list shall support drag-and-drop reordering in list view and persist reordered sequence.
- PRIORITY: High
- TESTABLE CONDITION: Dragging a note to a new position updates order immediately and the same order is restored after reopening the extension.

BUSINESS REQUIREMENT:
- BR ID: UC-04.BR-01
- REQUIREMENT STATEMENT: The extension shall support capture mode that lets users select a region on the active page and create a note from the capture result.
- PRIORITY: High
- TESTABLE CONDITION: Completing a valid selection creates exactly one new capture note; canceling capture creates none.

BUSINESS REQUIREMENT:
- BR ID: UC-05.BR-01
- REQUIREMENT STATEMENT: The extension shall allow copying selected note content to the clipboard and display a clear error if copy fails.
- PRIORITY: High
- TESTABLE CONDITION: Copying a selected note writes content to clipboard, or a visible error status is shown when copy is unavailable.

BUSINESS REQUIREMENT:
- BR ID: UC-06.BR-01
- REQUIREMENT STATEMENT: The extension shall provide a catalog of at least 20 distinct themes with Midnight Terminal as the default and persist selected theme plus list/grid view preferences across sessions.
- PRIORITY: High
- TESTABLE CONDITION: Theme catalog lists at least 20 options, default on fresh load is Midnight Terminal, selecting any theme applies immediately, and selected theme/view are restored on next load.

BUSINESS REQUIREMENT:
- BR ID: UC-07.BR-01
- REQUIREMENT STATEMENT: The side panel UI shall provide NOTES, FAVORITES, and OPTIONS tabs with icon-first controls for major actions.
- PRIORITY: Medium
- TESTABLE CONDITION: Tab switching works without data loss, icon controls are clickable, and no Open Full Options button is present.

BUSINESS REQUIREMENT:
- BR ID: UC-08.BR-01
- REQUIREMENT STATEMENT: The UI shall render [pnp.png] Browser Buddy branding and theme-aware colorful notes that remain readable.
- PRIORITY: Medium
- TESTABLE CONDITION: Header icon loads before Browser Buddy title and note color styling remains readable across supported themes.

BUSINESS REQUIREMENT:
- BR ID: UC-09.BR-01
- REQUIREMENT STATEMENT: The NOTES toolbar shall enforce a three-group layout: Add/Capture/Cancel at top-left, Copy/Edit/Delete below on the left, and List/Grid as a right-justified group.
- PRIORITY: High
- TESTABLE CONDITION: Controls appear in required groups and positions, and grouping remains stable across reopen and theme changes.

BUSINESS REQUIREMENT:
- BR ID: UC-10.BR-01
- REQUIREMENT STATEMENT: The extension shall provide a Favorites tab that supports folder navigation, multi-select link copy with readable formatting, add/remove bookmark item operations, and dragging bookmark items into other windows for paste-ready insertion.
- PRIORITY: High
- TESTABLE CONDITION: User can browse subdirectories, select one or more favorites, copy formatted links in one action, add bookmark/folder items, remove selected items with immediate UI updates, and drag a bookmark out so drop targets receive bookmark content.

BUSINESS REQUIREMENT:
- BR ID: UC-11.BR-01
- REQUIREMENT STATEMENT: The side panel header shall display Browser Buddy with the current extension version label sourced from the manifest.
- PRIORITY: High
- TESTABLE CONDITION: Header shows product name plus version label and the label value matches manifest version.

BUSINESS REQUIREMENT:
- BR ID: UC-12.BR-01
- REQUIREMENT STATEMENT: The header version label shall refresh automatically after extension updates without manual code changes.
- PRIORITY: Medium
- TESTABLE CONDITION: After extension version changes and reload, header label reflects the updated version value.

BUSINESS REQUIREMENT:
- BR ID: UC-13.BR-01
- REQUIREMENT STATEMENT: Header typography shall keep Browser Buddy as primary text and version as secondary but readable across themes.
- PRIORITY: Medium
- TESTABLE CONDITION: Product name remains visually dominant and version remains readable in supported themes.

BUSINESS REQUIREMENT:
- BR ID: UC-14.BR-01
- REQUIREMENT STATEMENT: The NOTES view shall accept valid dropped image payloads and create one persisted image note equivalent to capture-style notes.
- PRIORITY: High
- TESTABLE CONDITION: Dropping a supported image payload creates exactly one note with screenshot image data, preview rendering, and image clipboard copy behavior.

BUSINESS REQUIREMENT:
- BR ID: UC-15.BR-01
- REQUIREMENT STATEMENT: The NOTES view shall accept dropped plain text and create one persisted text note from non-empty content.
- PRIORITY: High
- TESTABLE CONDITION: Dropping non-empty text creates exactly one text note containing dropped content; empty/whitespace drops create no note and show clear feedback.

BUSINESS REQUIREMENT:
- BR ID: UC-16.BR-01
- REQUIREMENT STATEMENT: The OPTIONS tab shall allow choosing a default Favorites subdirectory and FAVORITES shall open to it when available.
- PRIORITY: High
- TESTABLE CONDITION: Saved Favorites default folder is persisted and used as initial FAVORITES folder, with fallback to root when missing.
