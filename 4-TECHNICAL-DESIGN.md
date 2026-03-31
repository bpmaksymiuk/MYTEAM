TECH-DESIGN:
- DESIGN ID: UC-01.BR-01.ARCH-01.DES-01
- IMPLEMENTATION TASKS:
  1. Configure manifest.json for side panel extension operation.
  2. Ensure extension action opens side panel.
  3. Confirm required permissions are declared.
- INTERFACES AND DATA CONTRACTS:
  - manifest.json { manifest_version: 3, side_panel.default_path: string, permissions: string[] }
- EDGE CASES AND ERROR HANDLING:
  - Handle unsupported tab contexts gracefully when opening panel.
- TEST NOTES:
  - Verify unpacked load and panel open from action.

TECH-DESIGN:
- DESIGN ID: UC-02.BR-01.ARCH-01.DES-01
- IMPLEMENTATION TASKS:
  1. Build notes store with create, edit, delete, and reorder operations.
  2. Persist notes to chrome.storage.local.
  3. Render notes in persisted order.
- INTERFACES AND DATA CONTRACTS:
  - NoteItem { id: string, content: string, color: string, createdAt: string, imageDataUrl?: string }
  - saveNotes(notes: NoteItem[]): Promise<void>
- EDGE CASES AND ERROR HANDLING:
  - Reject empty note content for text notes.
  - Guard against storage write failures with visible status.
- TEST NOTES:
  - Verify CRUD + reorder + persistence after reopen.

TECH-DESIGN:
- DESIGN ID: UC-03.BR-01.ARCH-01.DES-01
- IMPLEMENTATION TASKS:
  1. Add selected note state.
  2. Add copy action for selected note content.
  3. Provide fallback/error message when clipboard access fails.
- INTERFACES AND DATA CONTRACTS:
  - copySelectedNote(): Promise<void>
- EDGE CASES AND ERROR HANDLING:
  - Disable copy when no note is selected.
- TEST NOTES:
  - Verify successful copy and clear error path.

TECH-DESIGN:
- DESIGN ID: UC-04.BR-01.ARCH-01.DES-01
- IMPLEMENTATION TASKS:
  1. Implement OPTIONS tab in side panel.
  2. Add setting controls (theme and default view mode).
  3. Save and restore settings at startup.
- INTERFACES AND DATA CONTRACTS:
  - Settings { theme: "light" | "dark", viewMode: "list" | "grid" }
  - saveSettings(settings: Settings): Promise<void>
- EDGE CASES AND ERROR HANDLING:
  - Fallback to default settings when storage data is invalid.
- TEST NOTES:
  - Verify settings persist between sessions.

TECH-DESIGN:
- DESIGN ID: UC-05.BR-01.ARCH-01.DES-01
- IMPLEMENTATION TASKS:
  1. Start capture mode from side panel.
  2. Use content script overlay to collect region coordinates.
  3. Capture selected region and create a new note from result.
- INTERFACES AND DATA CONTRACTS:
  - Message { type: "BEGIN_CAPTURE" | "CANCEL_CAPTURE" | "SELECTION_COMPLETE" | "SELECTION_CANCELED" }
  - CaptureResult { imageDataUrl: string, pageUrl: string, rect: { x: number, y: number, width: number, height: number } }
- EDGE CASES AND ERROR HANDLING:
  - Cancel operation creates no note.
  - Capture failure reports status and resets capture state.
- TEST NOTES:
  - Verify one new note is created for valid selection.

TECH-DESIGN:
- DESIGN ID: UC-06.BR-01.ARCH-01.DES-01
- IMPLEMENTATION TASKS:
  1. Implement light and dark themes via CSS variables.
  2. Add theme toggle control.
  3. Persist and restore selected theme.
- INTERFACES AND DATA CONTRACTS:
  - applyTheme(theme: "light" | "dark"): void
- EDGE CASES AND ERROR HANDLING:
  - Fallback to light theme when value is unsupported.
- TEST NOTES:
  - Verify immediate visual switch and persistence.

TECH-DESIGN:
- DESIGN ID: UC-07.BR-01.ARCH-01.DES-01
- IMPLEMENTATION TASKS:
  1. Apply predefined color palette classes to notes.
  2. Ensure note text contrast in both themes.
  3. Keep palette assignment stable per note.
- INTERFACES AND DATA CONTRACTS:
  - color: "c1" | "c2" | "c3" | "c4" | "c5" | "c6"
- EDGE CASES AND ERROR HANDLING:
  - Default to safe color when stored value is invalid.
- TEST NOTES:
  - Verify readability and visual distinction.

TECH-DESIGN:
- DESIGN ID: UC-08.BR-01.ARCH-01.DES-01
- IMPLEMENTATION TASKS:
  1. Add NOTES and OPTIONS tab buttons.
  2. Toggle tab panes and active state classes.
  3. Preserve in-memory note state while switching tabs.
- INTERFACES AND DATA CONTRACTS:
  - switchTab(tab: "notes" | "options"): void
- EDGE CASES AND ERROR HANDLING:
  - Unknown tab values fallback to NOTES.
- TEST NOTES:
  - Verify tab switching and state preservation.

TECH-DESIGN:
- DESIGN ID: UC-09.BR-01.ARCH-01.DES-01
- IMPLEMENTATION TASKS:
  1. Add list/grid view controls in NOTES tab.
  2. Implement CSS class-based layout switching.
  3. Persist preferred view mode.
- INTERFACES AND DATA CONTRACTS:
  - setViewMode(mode: "list" | "grid"): void
- EDGE CASES AND ERROR HANDLING:
  - Default to list mode when value is unsupported.
- TEST NOTES:
  - Verify one-column list and multi-column grid behavior.

TECH-DESIGN:
- DESIGN ID: UC-10.BR-01.ARCH-01.DES-01
- IMPLEMENTATION TASKS:
  1. Add header title with text-image-text layout.
  2. Load pnp.png from extension package.
  3. Prevent broken-image display through fallback handling.
- INTERFACES AND DATA CONTRACTS:
  - <img src="pnp.png" alt="Chrome Buddy logo" width="18" height="18">
- EDGE CASES AND ERROR HANDLING:
  - Hide icon if load fails so layout remains stable.
- TEST NOTES:
  - Verify brand header rendering across panel sizes.

TECH-DESIGN:
- DESIGN ID: UC-11.BR-01.ARCH-01.DES-01
- IMPLEMENTATION TASKS:
  1. Replace text buttons with icon-first controls.
  2. Add aria-label and title to every icon control.
  3. Remove Open Full Options button from UI.
- INTERFACES AND DATA CONTRACTS:
  - IconButton { id: string, label: string, symbol: string }
- EDGE CASES AND ERROR HANDLING:
  - Ensure icon buttons remain keyboard-focusable.
- TEST NOTES:
  - Verify icon controls are accessible and functional.
