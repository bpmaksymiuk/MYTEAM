BUSINESS REQUIREMENT:
- BR ID: UC-01.BR-01
- REQUIREMENT STATEMENT: The solution shall be implemented using a React stack (React + TypeScript + Vite) and run as a browser application.
- PRIORITY: High
- TESTABLE CONDITION: Dependencies install, development server starts without blocking errors, and the application UI loads in a supported browser.

BUSINESS REQUIREMENT:
- BR ID: UC-02.BR-01
- REQUIREMENT STATEMENT: The NOTES view shall support creating, reviewing, editing, and deleting reusable notes with persistence.
- PRIORITY: High
- TESTABLE CONDITION: Added, edited, and deleted notes are reflected immediately and persist after application reload.

BUSINESS REQUIREMENT:
- BR ID: UC-03.BR-01
- REQUIREMENT STATEMENT: The NOTES list shall support drag-and-drop reordering and persist the reordered sequence.
- PRIORITY: High
- TESTABLE CONDITION: Dragging notes changes visible order and the same order is restored after reload.

BUSINESS REQUIREMENT:
- BR ID: UC-04.BR-01
- REQUIREMENT STATEMENT: The application shall support capture mode for selecting a page region and creating a new note from the capture result.
- PRIORITY: High
- TESTABLE CONDITION: Starting capture and completing a valid selection creates exactly one new capture note; cancel creates none.

BUSINESS REQUIREMENT:
- BR ID: UC-05.BR-01
- REQUIREMENT STATEMENT: The application shall allow copying selected note content to clipboard and show clear feedback when copy fails.
- PRIORITY: High
- TESTABLE CONDITION: Selected note content copies successfully to clipboard or a visible failure message appears.

BUSINESS REQUIREMENT:
- BR ID: UC-06.BR-01
- REQUIREMENT STATEMENT: The application shall provide theme and view preferences, including a rich theme catalog, and persist selected options.
- PRIORITY: High
- TESTABLE CONDITION: Theme/view changes apply immediately and persist after reload.

BUSINESS REQUIREMENT:
- BR ID: UC-07.BR-01
- REQUIREMENT STATEMENT: The UI shall provide NOTES, FAVORITES, and OPTIONS tab navigation with icon-first action controls.
- PRIORITY: Medium
- TESTABLE CONDITION: Tab switching works without data loss and action controls remain accessible and interactive.

BUSINESS REQUIREMENT:
- BR ID: UC-08.BR-01
- REQUIREMENT STATEMENT: The application shall render branded, theme-aware note styling that remains readable across supported themes and load the header icon from /resources assets.
- PRIORITY: Medium
- TESTABLE CONDITION: Header branding uses /resources/pnp.png, and note styling renders consistently with readable contrast.

BUSINESS REQUIREMENT:
- BR ID: UC-09.BR-01
- REQUIREMENT STATEMENT: NOTES actions shall remain grouped in a consistent three-group layout while users interact with notes.
- PRIORITY: Medium
- TESTABLE CONDITION: Action groups and relative placement remain stable through interactions and reload.

BUSINESS REQUIREMENT:
- BR ID: UC-10.BR-01
- REQUIREMENT STATEMENT: FAVORITES shall support folder navigation, add/remove operations, multi-select copy, and drag payloads for link items.
- PRIORITY: High
- TESTABLE CONDITION: Users can traverse favorites folders, add/remove entries, copy selected links, and drag link rows with populated drag data.

BUSINESS REQUIREMENT:
- BR ID: UC-11.BR-01
- REQUIREMENT STATEMENT: The header shall display application version next to Browser Buddy and source it from application package metadata.
- PRIORITY: High
- TESTABLE CONDITION: Version label appears in header and matches configured application package version.

BUSINESS REQUIREMENT:
- BR ID: UC-12.BR-01
- REQUIREMENT STATEMENT: Version display shall refresh on application reload after a version update.
- PRIORITY: Medium
- TESTABLE CONDITION: Updating package version and reloading shows the updated value without manual UI code changes.

BUSINESS REQUIREMENT:
- BR ID: UC-13.BR-01
- REQUIREMENT STATEMENT: Header typography shall preserve clear hierarchy between product name and version across themes.
- PRIORITY: Medium
- TESTABLE CONDITION: Product name remains visually dominant and version text stays readable.

BUSINESS REQUIREMENT:
- BR ID: UC-14.BR-01
- REQUIREMENT STATEMENT: NOTES shall accept valid image drag-drop payloads and create one image note with capture-equivalent behavior.
- PRIORITY: High
- TESTABLE CONDITION: Dropping valid image payload creates one image note with preview and copy parity behavior.

BUSINESS REQUIREMENT:
- BR ID: UC-15.BR-01
- REQUIREMENT STATEMENT: NOTES shall accept plain-text drag-drop payloads and create one text note from non-empty content.
- PRIORITY: High
- TESTABLE CONDITION: Dropping non-empty text creates one note; empty payload creates none and shows clear feedback.

BUSINESS REQUIREMENT:
- BR ID: UC-16.BR-01
- REQUIREMENT STATEMENT: OPTIONS shall allow selecting a default favorites subdirectory and FAVORITES shall open to that default folder.
- PRIORITY: High
- TESTABLE CONDITION: Default folder selection persists and FAVORITES initializes to selected folder on open.
