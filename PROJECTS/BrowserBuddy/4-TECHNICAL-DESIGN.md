TECH-DESIGN:
- DESIGN ID: UC-01.BR-01.ARCH-01.DES-01
- IMPLEMENTATION TASKS:
  1. Configure manifest for MV3 action, side panel, and service worker.
  2. Ensure background worker sets openPanelOnActionClick behavior.
  3. Confirm required permissions are declared.
- INTERFACES AND DATA CONTRACTS:
  - manifest.json { manifest_version: 3, side_panel.default_path: string, permissions: string[] }
- EDGE CASES AND ERROR HANDLING:
  - Handle sidePanel setPanelBehavior unavailability by catching runtime errors.
- TEST NOTES:
  - Verify unpacked extension load and side panel open from action.

TECH-DESIGN:
- DESIGN ID: UC-02.BR-01.ARCH-01.DES-01
- IMPLEMENTATION TASKS:
  1. Implement create/edit/delete operations for NoteItem records.
  2. Persist notes array in chrome.storage.local.
  3. Render notes from persisted state and keep selected item state.
- INTERFACES AND DATA CONTRACTS:
  - NoteItem { id: string, content: string, color: string, createdAt: string, imageDataUrl?: string }
  - saveNotes(notes: NoteItem[]): Promise<void>
- EDGE CASES AND ERROR HANDLING:
  - Reject empty text notes and show status error.
- TEST NOTES:
  - Verify CRUD and persistence after extension reopen.

TECH-DESIGN:
- DESIGN ID: UC-03.BR-01.ARCH-01.DES-01
- IMPLEMENTATION TASKS:
  1. Register dragstart/dragover/dragleave/drop handlers for notes in list mode.
  2. Compute from/to indices and reorder notes array.
  3. Persist new order and rerender with visual drop feedback.
- INTERFACES AND DATA CONTRACTS:
  - reorderNotes(fromIndex: number, toIndex: number): void
- EDGE CASES AND ERROR HANDLING:
  - Ignore drops when source equals target or target is invalid.
- TEST NOTES:
  - Verify drag-drop reorder and persisted order.

TECH-DESIGN:
- DESIGN ID: UC-04.BR-01.ARCH-01.DES-01
- IMPLEMENTATION TASKS:
  1. Start capture from side panel and inject content script if missing.
  2. Collect region coordinates in content script.
  3. Capture visible tab, crop selected region, and create note record.
- INTERFACES AND DATA CONTRACTS:
  - Message { type: "PING" | "BEGIN_CAPTURE" | "CANCEL_CAPTURE" | "SELECTION_COMPLETE" | "SELECTION_CANCELED" | "CAPTURE_VISIBLE_TAB" }
  - CaptureRect { x: number, y: number, width: number, height: number }
- EDGE CASES AND ERROR HANDLING:
  - Cancel path creates no notes; capture failure resets state with clear status.
- TEST NOTES:
  - Verify exactly one note per valid capture.

TECH-DESIGN:
- DESIGN ID: UC-05.BR-01.ARCH-01.DES-01
- IMPLEMENTATION TASKS:
  1. Add selection model for notes.
  2. Add copy action for text and image notes.
  3. Show explicit status for copy success and copy failure.
- INTERFACES AND DATA CONTRACTS:
  - onCopySelected(): Promise<void>
- EDGE CASES AND ERROR HANDLING:
  - Disable copy when no note is selected.
- TEST NOTES:
  - Verify clipboard success path and permission-failure path.

TECH-DESIGN:
- DESIGN ID: UC-06.BR-01.ARCH-01.DES-01
- IMPLEMENTATION TASKS:
  1. Implement a theme catalog containing at least 20 distinct themes.
  2. Make Midnight Terminal the default theme when no saved preference exists.
  3. Apply theme token sets by writing CSS variables to the panel root.
  4. Persist and restore selected theme plus list/grid view mode.
- INTERFACES AND DATA CONTRACTS:
  - Settings { theme: string, viewMode: "list" | "grid" }
  - ThemeDefinition { id: string, label: string, vars: Record<string, string> }
  - applyTheme(themeId: string): void
- EDGE CASES AND ERROR HANDLING:
  - Fallback to Midnight Terminal when stored theme ID is missing.
- TEST NOTES:
  - Verify at least 20 options, Midnight Terminal default, immediate apply, and persistence.

TECH-DESIGN:
- DESIGN ID: UC-07.BR-01.ARCH-01.DES-01
- IMPLEMENTATION TASKS:
  1. Implement NOTES/FAVORITES/OPTIONS tabs with active state management.
  2. Implement icon-first controls with title and aria-label.
  3. Remove Open Full Options button from UI.
- INTERFACES AND DATA CONTRACTS:
  - switchTab(tab: "notes" | "favorites" | "options"): void
- EDGE CASES AND ERROR HANDLING:
  - Unknown tab input defaults to notes.
- TEST NOTES:
  - Verify tab switching and icon control accessibility.

TECH-DESIGN:
- DESIGN ID: UC-08.BR-01.ARCH-01.DES-01
- IMPLEMENTATION TASKS:
  1. Render brand title with leading pnp.png image before Browser Buddy text.
  2. Apply color palette classes to notes from theme variables.
  3. Provide readable note metadata and action controls across themes.
- INTERFACES AND DATA CONTRACTS:
  - color: "c1" | "c2" | "c3" | "c4" | "c5" | "c6"
- EDGE CASES AND ERROR HANDLING:
  - Hide icon if image fails to load to prevent broken layout.
- TEST NOTES:
  - Verify branding and readable note styles across themes.

TECH-DESIGN:
- DESIGN ID: UC-09.BR-01.ARCH-01.DES-01
- IMPLEMENTATION TASKS:
  1. Build top-left primary group containing Add, Capture, and Cancel.
  2. Build lower-left secondary group containing Copy, Edit, and Delete.
  3. Build right-justified lower group containing List and Grid view controls.
- INTERFACES AND DATA CONTRACTS:
  - action-group-primary: [add-btn, capture-btn, cancel-btn]
  - action-group-secondary: [copy-btn, edit-btn, delete-btn]
  - action-group-view: [list-view-btn, grid-view-btn]
- EDGE CASES AND ERROR HANDLING:
  - Ensure button group order remains stable in narrow panel widths.
- TEST NOTES:
  - Verify exact grouping and right-justified view controls.

TECH-DESIGN:
- DESIGN ID: UC-10.BR-01.ARCH-01.DES-01
- IMPLEMENTATION TASKS:
  1. Add FAVORITES tab view with bookmark list rendering and folder path display.
  2. Implement folder navigation into subdirectories and back navigation to parent folders.
  3. Implement multi-select checkbox behavior for bookmark rows.
  4. Implement copy-selected action that formats output as title and URL blocks per bookmark.
  5. Implement add action to create bookmarks or folders in current location.
  6. Implement remove-selected action for bookmarks and folders.
  7. Implement draggable bookmark rows that emit external drop payloads.
- INTERFACES AND DATA CONTRACTS:
  - FavoriteNode { id: string, title: string, url?: string, parentId?: string }
  - bookmarksGetChildren(folderId: string): Promise<FavoriteNode[]>
  - onFavoritesCopySelected(): Promise<void>
  - bookmarksCreate({ parentId, title, url? }): Promise<FavoriteNode>
  - onFavoriteDragStart(event: DragEvent, node: FavoriteNode): void
- EDGE CASES AND ERROR HANDLING:
  - Skip non-link folders when building clipboard payload.
  - Guard remove and copy actions when no favorites are selected.
  - Ignore drag payload generation for folder nodes without URLs.
  - Show user-visible status for add/remove/copy failures.
- TEST NOTES:
  - Verify folder navigation, multi-select copy formatting, add/remove operations, immediate list refresh, and drag-drop payloads into external windows.

TECH-DESIGN:
- DESIGN ID: UC-11.BR-01.ARCH-01.DES-01
- IMPLEMENTATION TASKS:
  1. Add a dedicated header element for version text next to Browser Buddy.
  2. Read manifest version in panel initialization and render formatted version label.
  3. Provide fallback value when manifest lookup fails.
- INTERFACES AND DATA CONTRACTS:
  - setVersionLabel(version: string): void
  - chrome.runtime.getManifest(): { version: string }
- EDGE CASES AND ERROR HANDLING:
  - Missing version string: render fallback label v?.?.?
- TEST NOTES:
  - Verify displayed version equals manifest version value.

TECH-DESIGN:
- DESIGN ID: UC-12.BR-01.ARCH-01.DES-01
- IMPLEMENTATION TASKS:
  1. Ensure version label is resolved on every panel load.
  2. Avoid hardcoded version strings in HTML and CSS.
- INTERFACES AND DATA CONTRACTS:
  - init(): Promise<void> resolves version from manifest at runtime
- EDGE CASES AND ERROR HANDLING:
  - Stale open panel after update: require reopen for fresh label.
- TEST NOTES:
  - Verify version changes after extension update and reopen.

TECH-DESIGN:
- DESIGN ID: UC-13.BR-01.ARCH-01.DES-01
- IMPLEMENTATION TASKS:
  1. Style product title and version as primary and secondary visual hierarchy.
  2. Keep version contrast readable under theme variable changes.
- INTERFACES AND DATA CONTRACTS:
  - .brand-version CSS contract for size, weight, contrast, and spacing
- EDGE CASES AND ERROR HANDLING:
  - Narrow panel width: prevent overlap by enabling wrapping or compact spacing.
- TEST NOTES:
  - Verify readability in multiple theme selections.

TECH-DESIGN:
- DESIGN ID: UC-14.BR-01.ARCH-01.DES-01
- IMPLEMENTATION TASKS:
  1. Register NOTES container dragover, dragleave, and drop handlers for external payload ingestion.
  2. Parse dropped payloads for image files, HTML image sources, URI-list image URLs, and image data URLs.
  3. Convert accepted image payloads into data URLs and create one capture-equivalent note record.
  4. Apply visual drop-target affordance while drag is active.
- INTERFACES AND DATA CONTRACTS:
  - createNoteFromDrop(dataTransfer: DataTransfer): Promise<NoteItem | null>
  - readDroppedImageDataUrl(dataTransfer: DataTransfer): Promise<string | null>
  - NoteItem.screenshotDataUrl: string | null
- EDGE CASES AND ERROR HANDLING:
  - Unsupported image payloads must not create notes and must show explicit status error.
  - If dropped source is an internal note reorder drag, skip external-ingest logic.
  - Network fetch failures for dropped external image URLs must fail gracefully without note creation.
- TEST NOTES:
  - Verify valid image drops from file manager and browser create one image note with preview and image-copy behavior.

TECH-DESIGN:
- DESIGN ID: UC-15.BR-01.ARCH-01.DES-01
- IMPLEMENTATION TASKS:
  1. Parse dropped plain text payload from NOTES drop event.
  2. Create one text note from non-empty dropped text using existing note model and persistence.
  3. Reuse existing note render/select/copy/reorder flows for dropped-text notes.
- INTERFACES AND DATA CONTRACTS:
  - readDroppedPlainText(dataTransfer: DataTransfer): string | null
  - makeNote(title: string, body: string, screenshotDataUrl?: string | null): NoteItem
- EDGE CASES AND ERROR HANDLING:
  - Whitespace-only text drops must be rejected with clear feedback and no note creation.
  - Unsupported payloads (no image and no valid text) must not create notes.
- TEST NOTES:
  - Verify text drag-drop creates one persisted text note and empty text drops are rejected.

TECH-DESIGN:
- DESIGN ID: UC-16.BR-01.ARCH-01.DES-01
- IMPLEMENTATION TASKS:
  1. Add OPTIONS favorites-folder picker populated from bookmarks directories.
  2. Persist selected folder ID and use as initial FAVORITES load target.
  3. Fallback to bookmarks root and notify user when saved folder is missing.
- INTERFACES AND DATA CONTRACTS:
  - Settings.defaultFavoritesFolderId: string | null
  - flattenBookmarkFolders(root: BookmarkTreeNode): Array<{ id: string, title: string, depth: number }>
- EDGE CASES AND ERROR HANDLING:
  - Saved folder deleted externally: auto-fallback and show status.
- TEST NOTES:
  - Verify OPTIONS selection controls FAVORITES startup folder after reopen.
