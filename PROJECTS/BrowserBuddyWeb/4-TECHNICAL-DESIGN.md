TECH-DESIGN:
- DESIGN ID: UC-01.BR-01.ARCH-01.DES-01
- IMPLEMENTATION TASKS:
  1. Maintain React + TypeScript + Vite project baseline.
  2. Keep startup scripts and build pipeline operational.
  3. Keep root app mount stable.
- INTERFACES AND DATA CONTRACTS:
  - package.json scripts: dev, build, preview
  - main.tsx root mount contract
- EDGE CASES AND ERROR HANDLING:
  - Prevent startup drift by validating build output regularly.
- TEST NOTES:
  - Verify install, dev start, and build pass.

TECH-DESIGN:
- DESIGN ID: UC-02.BR-01.ARCH-01.DES-01
- IMPLEMENTATION TASKS:
  1. Implement note create/edit/delete flows.
  2. Persist notes to localStorage.
  3. Keep selected note state synchronized with list updates.
- INTERFACES AND DATA CONTRACTS:
  - Note { id, title, body, updatedAt }
  - localStorage key for notes array
- EDGE CASES AND ERROR HANDLING:
  - Handle malformed localStorage notes payload safely.
- TEST NOTES:
  - Verify CRUD operations persist after reload.

TECH-DESIGN:
- DESIGN ID: UC-03.BR-01.ARCH-01.DES-01
- IMPLEMENTATION TASKS:
  1. Implement note dragstart/dragover/drop handlers.
  2. Reorder notes by index and persist.
  3. Provide status feedback for reorder action.
- INTERFACES AND DATA CONTRACTS:
  - draggingId: string | null
- EDGE CASES AND ERROR HANDLING:
  - Ignore no-op reorder drops (same source/target).
- TEST NOTES:
  - Verify reorder persists across reload.

TECH-DESIGN:
- DESIGN ID: UC-04.BR-01.ARCH-01.DES-01
- IMPLEMENTATION TASKS:
  1. Design capture UX suitable for web runtime constraints.
  2. Implement capture start/cancel/complete flow.
  3. Map capture output into note model.
- INTERFACES AND DATA CONTRACTS:
  - CaptureResult to Note conversion contract
- EDGE CASES AND ERROR HANDLING:
  - Capture pending migration; keep explicit caveat in release docs.
- TEST NOTES:
  - Add runtime validation once implemented.

TECH-DESIGN:
- DESIGN ID: UC-05.BR-01.ARCH-01.DES-01
- IMPLEMENTATION TASKS:
  1. Implement copy-selected-note action.
  2. Provide user-visible success/failure status.
- INTERFACES AND DATA CONTRACTS:
  - Clipboard API writeText contract
- EDGE CASES AND ERROR HANDLING:
  - Handle copy permission failures without app crash.
- TEST NOTES:
  - Verify copy success and failure feedback paths.

TECH-DESIGN:
- DESIGN ID: UC-06.BR-01.ARCH-01.DES-01
- IMPLEMENTATION TASKS:
  1. Implement theme selector and view mode controls.
  2. Persist settings in localStorage.
  3. Apply theme tokens through CSS variables.
- INTERFACES AND DATA CONTRACTS:
  - localStorage keys for theme and view
- EDGE CASES AND ERROR HANDLING:
  - Fall back to default theme if saved value is invalid.
- TEST NOTES:
  - Verify setting persistence after reload.

TECH-DESIGN:
- DESIGN ID: UC-07.BR-01.ARCH-01.DES-01
- IMPLEMENTATION TASKS:
  1. Implement tab-state switching for NOTES/FAVORITES/OPTIONS.
  2. Keep action buttons accessible and keyboard-usable.
- INTERFACES AND DATA CONTRACTS:
  - tab: notes | favorites | options
- EDGE CASES AND ERROR HANDLING:
  - Ensure tab changes do not lose persisted state.
- TEST NOTES:
  - Verify tab behavior and action availability.

TECH-DESIGN:
- DESIGN ID: UC-08.BR-01.ARCH-01.DES-01
- IMPLEMENTATION TASKS:
  1. Maintain branded header and readable note card visuals.
  2. Keep note typography and spacing legible across themes.
- INTERFACES AND DATA CONTRACTS:
  - Header/title style contract in CSS
- EDGE CASES AND ERROR HANDLING:
  - Validate contrast in each available theme.
- TEST NOTES:
  - Perform visual QA for readability.

TECH-DESIGN:
- DESIGN ID: UC-09.BR-01.ARCH-01.DES-01
- IMPLEMENTATION TASKS:
  1. Keep note action controls grouped logically.
  2. Preserve list/grid controls with stable layout.
- INTERFACES AND DATA CONTRACTS:
  - Action group and view toggle UI contract
- EDGE CASES AND ERROR HANDLING:
  - Ensure responsive layout maintains control accessibility.
- TEST NOTES:
  - Verify group stability across viewport sizes.

TECH-DESIGN:
- DESIGN ID: UC-10.BR-01.ARCH-01.DES-01
- IMPLEMENTATION TASKS:
  1. Implement favorites folder tree with current-folder view.
  2. Implement add link/folder, remove selected, and copy selected links.
  3. Implement drag payloads for link favorites.
- INTERFACES AND DATA CONTRACTS:
  - FavoriteNode { id, parentId, title, url? }
- EDGE CASES AND ERROR HANDLING:
  - Remove folder descendants recursively when deleting folders.
- TEST NOTES:
  - Verify folder navigation and multi-select operations.

TECH-DESIGN:
- DESIGN ID: UC-11.BR-01.ARCH-01.DES-01
- IMPLEMENTATION TASKS:
  1. Render version badge near application title.
  2. Read version from package/build metadata.
- INTERFACES AND DATA CONTRACTS:
  - Version string source contract
- EDGE CASES AND ERROR HANDLING:
  - Provide fallback text if version metadata is unavailable.
- TEST NOTES:
  - Verify displayed version matches configured package version.

TECH-DESIGN:
- DESIGN ID: UC-12.BR-01.ARCH-01.DES-01
- IMPLEMENTATION TASKS:
  1. Ensure version display resolves on application load.
  2. Validate update behavior after version bump and reload.
- INTERFACES AND DATA CONTRACTS:
  - Load-time version resolution contract
- EDGE CASES AND ERROR HANDLING:
  - Document reload dependency for seeing updated version.
- TEST NOTES:
  - Verify version refresh after build/update cycle.

TECH-DESIGN:
- DESIGN ID: UC-13.BR-01.ARCH-01.DES-01
- IMPLEMENTATION TASKS:
  1. Keep product name/version typographic hierarchy.
  2. Keep hierarchy readable across theme changes.
- INTERFACES AND DATA CONTRACTS:
  - Header typography style contract
- EDGE CASES AND ERROR HANDLING:
  - Prevent clipping in narrow viewports.
- TEST NOTES:
  - Verify hierarchy and contrast in UI snapshots.

TECH-DESIGN:
- DESIGN ID: UC-14.BR-01.ARCH-01.DES-01
- IMPLEMENTATION TASKS:
  1. Implement image drag-drop ingest into NOTES.
  2. Normalize accepted image payloads into note model.
  3. Add unsupported-drop feedback.
- INTERFACES AND DATA CONTRACTS:
  - Drop payload to image-note contract
- EDGE CASES AND ERROR HANDLING:
  - Feature pending migration; maintain release caveat.
- TEST NOTES:
  - Add runtime drag-source compatibility tests after implementation.

TECH-DESIGN:
- DESIGN ID: UC-15.BR-01.ARCH-01.DES-01
- IMPLEMENTATION TASKS:
  1. Implement plain-text drag-drop ingest into NOTES.
  2. Reject empty payloads with clear feedback.
- INTERFACES AND DATA CONTRACTS:
  - Drop payload to text-note contract
- EDGE CASES AND ERROR HANDLING:
  - Feature pending migration; maintain release caveat.
- TEST NOTES:
  - Add runtime text-drop tests after implementation.

TECH-DESIGN:
- DESIGN ID: UC-16.BR-01.ARCH-01.DES-01
- IMPLEMENTATION TASKS:
  1. Implement default favorites folder selection in OPTIONS.
  2. Initialize FAVORITES to selected default folder.
  3. Persist default folder setting.
- INTERFACES AND DATA CONTRACTS:
  - localStorage key for default favorites folder ID
- EDGE CASES AND ERROR HANDLING:
  - Fallback to root folder if saved folder is missing.
- TEST NOTES:
  - Verify default folder behavior across reload and data changes.
