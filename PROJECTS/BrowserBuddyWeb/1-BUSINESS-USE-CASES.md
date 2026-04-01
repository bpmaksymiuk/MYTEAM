USE CASE:
- USE CASE ID: UC-01
- GOAL: User can run Browser Buddy using a React stack and open the application UI in the browser.
- ACTOR: End User
- IMPLEMENTATION COMMENT: Application foundation must use React stack (React + TypeScript + Vite) and requires runtime verification in supported browsers.
- STEP BY STEP WALKTHROUGH:
  1. User installs project dependencies.
  2. User starts the Browser Buddy React application.
  3. User opens the local application URL in a supported browser.
  4. User sees the Browser Buddy UI load successfully.
- ACCEPTANCE CRITERIA:
  1. Browser Buddy is implemented using React stack (React + TypeScript + Vite).
  2. Application starts without blocking startup errors.
  3. User can open the Browser Buddy UI from the local development URL.

USE CASE:
- USE CASE ID: UC-02
- GOAL: User can create, review, edit, and delete reusable notes.
- ACTOR: End User
- STEP BY STEP WALKTHROUGH:
  1. User opens the NOTES tab.
  2. User creates a new note.
  3. User reviews notes in the current list.
  4. User edits a selected text note.
  5. User deletes a note that is no longer needed.
- ACCEPTANCE CRITERIA:
  1. Notes list displays saved notes when opened.
  2. Creating a note adds it to the notes list.
  3. Editing a note updates stored content.
  4. Deleting a note removes it from the notes list.

USE CASE:
- USE CASE ID: UC-03
- GOAL: User can reorder notes to control priority.
- ACTOR: End User
- STEP BY STEP WALKTHROUGH:
  1. User opens the NOTES tab.
  2. User drags a note item.
  3. User drops the note into a new position.
  4. User confirms the updated order.
  5. User reopens the UI later.
- ACCEPTANCE CRITERIA:
  1. Notes in list view support drag-and-drop reordering.
  2. Drag and drop shows clear source and target feedback.
  3. Dropping updates visible note order immediately.
  4. Reordered note order persists after reopen.

USE CASE:
- USE CASE ID: UC-04
- GOAL: User can capture browser content into a new note.
- ACTOR: End User
- IMPLEMENTATION COMMENT: Capture behavior depends on page permissions and browser context; runtime verification is required on supported pages.
- STEP BY STEP WALKTHROUGH:
  1. User starts capture mode from the UI.
  2. User selects a region on the current page.
  3. Application processes the selected region.
  4. Application creates and saves a new note from capture output.
- ACCEPTANCE CRITERIA:
  1. Capture mode starts from application controls.
  2. Completing a valid selection creates one new note.
  3. Created note contains captured content.
  4. Canceling capture creates no new note.

USE CASE:
- USE CASE ID: UC-05
- GOAL: User can quickly reuse note content by copying to the clipboard.
- ACTOR: End User
- STEP BY STEP WALKTHROUGH:
  1. User opens the application on a page.
  2. User selects a note in the notes list.
  3. User copies the selected note.
  4. User pastes content into a target input.
- ACCEPTANCE CRITERIA:
  1. User can copy selected note content from the application.
  2. Copied content can be pasted into another interface.
  3. If copy fails, the system shows a clear error message.

USE CASE:
- USE CASE ID: UC-06
- GOAL: User can configure display preferences, including a rich catalog of themes, and keep them across sessions.
- ACTOR: End User
- STEP BY STEP WALKTHROUGH:
  1. User opens the application and sees Midnight Terminal applied as the default theme.
  2. User opens the OPTIONS tab.
  3. User browses at least 20 interesting theme options (for example: Forest Plaid, Solarized, Ocean Mist, Sunset Neon, Midnight Terminal, Arctic Frost, Coffee House, Retro Arcade, Sakura, Desert Sand, Aurora, Monochrome Ink, Citrus Pop, Lavender Paper, Ember Glow, Moss Stone, Skyline, Candy Pastel, Crimson Night, and Slate Pro).
  4. User selects one theme from the catalog and sees it applied immediately.
  5. User selects a default notes view: list or grid.
  6. User closes and reopens the application.
- ACCEPTANCE CRITERIA:
  1. Theme and view settings are editable in options.
  2. Midnight Terminal is the default theme when no saved theme preference exists.
  3. Theme catalog contains at least 20 distinct, visually interesting themes.
  4. Selecting any theme applies visual changes immediately.
  5. View mode toggles between list and grid layouts.
  6. Selected theme and view persist after reopen.

USE CASE:
- USE CASE ID: UC-07
- GOAL: User can navigate key application actions through a clean, tabbed icon-first UI.
- ACTOR: End User
- STEP BY STEP WALKTHROUGH:
  1. User opens the application.
  2. User switches between NOTES and OPTIONS tabs.
  3. User uses icon-based controls for major actions.
  4. User confirms legacy full-options navigation is not required.
- ACCEPTANCE CRITERIA:
  1. UI includes NOTES and OPTIONS tabs with correct content switching.
  2. Major actions are available through icon controls.
  3. Icon controls remain accessible and clickable.
  4. Open Full Options button is not present.

USE CASE:
- USE CASE ID: UC-08
- GOAL: User can read notes comfortably using branded, theme-aware visual styling.
- ACTOR: End User
- STEP BY STEP WALKTHROUGH:
  1. User opens the application.
  2. User sees the branded header with [/resources/pnp.png] before Browser Buddy.
  3. User reviews notes styled with color differentiation.
  4. User switches themes and confirms readability remains strong.
- ACCEPTANCE CRITERIA:
  1. Header appears as [/resources/pnp.png] Browser Buddy with stable alignment.
  2. Notes display visible color differentiation.
  3. Note colors remain readable across default, light, and dark themes.
  4. Branded icon loads from /resources path without broken-image display in supported panel sizes.

USE CASE:
- USE CASE ID: UC-09
- GOAL: User can access note actions quickly through a consistent three-group button layout.
- ACTOR: End User
- STEP BY STEP WALKTHROUGH:
  1. User opens the NOTES tab in the application.
  2. User sees Add note, Capture, and Cancel Capture grouped together at the top-left.
  3. User sees Copy Selected Note, Edit Selected Note, and Delete Selected Note grouped together below the first group on the left.
  4. User sees List View and Grid View grouped together and right-justified as a separate third group.
  5. User uses each group and confirms the layout remains stable while interacting with notes.
- ACCEPTANCE CRITERIA:
  1. Group 1 contains exactly Add note, Capture, and Cancel Capture at the top-left.
  2. Group 2 contains exactly Copy Selected Note, Edit Selected Note, and Delete Selected Note below Group 1 on the left.
  3. Group 3 contains exactly List View and Grid View and is right-justified.
  4. Button grouping remains consistent across panel reopen and theme changes.

USE CASE:
- USE CASE ID: UC-10
- GOAL: User can manage and reuse browser favorites from a dedicated Favorites tab.
- ACTOR: End User
- IMPLEMENTATION COMMENT: External drag/drop payload behavior and permissions must be validated against real bookmark data and target applications.
- STEP BY STEP WALKTHROUGH:
  1. User opens the FAVORITES tab in the application.
  2. User browses favorites and navigates into bookmark subdirectories.
  3. User selects one or more favorite items from the current list.
  4. User copies selected favorite links to the clipboard in a clean, paste-friendly format.
  5. User adds a new favorite item to the current location.
  6. User removes one or more existing favorite items.
  7. User drags a favorite item from the Favorites view and drops it into another application window or input surface.
  8. User navigates back and forth between subdirectories and confirms list updates correctly.
- ACCEPTANCE CRITERIA:
  1. UI includes a FAVORITES tab that shows browser favorites.
  2. Favorites subdirectory navigation is supported and reflects current folder context.
  3. User can select multiple favorites and copy links in a readable formatted output (for example: title + URL per line).
  4. Copying selected favorites writes all chosen links to the clipboard in one action.
  5. User can add and remove favorite items from the tab.
  6. Add/remove operations are reflected immediately in the displayed favorites list.
  7. Favorites in the list support drag interaction.
  8. Dropping a dragged favorite into another window inserts paste-ready bookmark content (for example: title and URL).

USE CASE:
- USE CASE ID: UC-11
- GOAL: User can see the application version number directly in the application header next to Browser Buddy.
- ACTOR: End User
- STEP BY STEP WALKTHROUGH:
  1. User opens Browser Buddy application UI.
  2. User looks at the top branded header.
  3. User sees the product name Browser Buddy.
  4. User sees the current application version rendered next to Browser Buddy.
- ACCEPTANCE CRITERIA:
  1. Header text includes Browser Buddy followed by a version label.
  2. The displayed version matches the application package version.
  3. Version label is visible in supported application viewport widths without clipping.

USE CASE:
- USE CASE ID: UC-12
- GOAL: User can confirm version updates after installing a new release.
- ACTOR: End User
- IMPLEMENTATION COMMENT: Version label refreshes on application load; users must reopen the application UI after update to observe the new version.
- STEP BY STEP WALKTHROUGH:
  1. User notes the current version shown in the application header.
  2. User updates Browser Buddy to a newer application package.
  3. User reopens the application UI.
  4. User compares the header version value to the expected new version.
- ACCEPTANCE CRITERIA:
  1. Version label updates automatically after application update.
  2. No manual code edit is required to refresh the header version value.
  3. If version cannot be read, a safe fallback label is shown instead of a blank value.

USE CASE:
- USE CASE ID: UC-13
- GOAL: User can read product name and version with clear visual hierarchy.
- ACTOR: End User
- STEP BY STEP WALKTHROUGH:
  1. User opens Browser Buddy UI in default theme.
  2. User verifies Browser Buddy remains the primary visual text in the header.
  3. User verifies version appears as a secondary badge or suffix.
  4. User switches to another theme and confirms both remain readable.
- ACCEPTANCE CRITERIA:
  1. Browser Buddy remains visually dominant over the version text.
  2. Version text keeps sufficient contrast against header background.
  3. Name and version remain readable across available themes.

USE CASE:
- USE CASE ID: UC-14
- GOAL: User can drag and drop an image into Browser Buddy and create a new image note equivalent to capture output.
- ACTOR: End User
- STEP BY STEP WALKTHROUGH:
  1. User opens Browser Buddy application on the NOTES tab.
  2. User drags an image file or image content from another app or browser surface.
  3. User drops the image onto the notes list area.
  4. Browser Buddy processes the dropped image and creates a new note.
  5. User sees the new note with image preview and can copy it as an image like captured notes.
- ACCEPTANCE CRITERIA:
  1. NOTES view accepts valid image drops from supported drag sources.
  2. Dropping a valid image creates exactly one new note.
  3. Created note includes image data and behaves like capture notes for preview and copy actions.
  4. Invalid or unsupported dropped payloads are rejected with clear user feedback.

USE CASE:
- USE CASE ID: UC-15
- GOAL: User can drag and drop plain text into Browser Buddy and create a new text note automatically.
- ACTOR: End User
- STEP BY STEP WALKTHROUGH:
  1. User opens Browser Buddy application on the NOTES tab.
  2. User selects text from another app, page, or editor.
  3. User drags the selected text into Browser Buddy and drops it in the notes area.
  4. Browser Buddy creates a new text note from the dropped content.
  5. User sees the created note and can edit, reorder, and copy it.
- ACCEPTANCE CRITERIA:
  1. NOTES view accepts dropped plain text from supported drag sources.
  2. Dropping text creates exactly one new text note containing the dropped text.
  3. Empty or whitespace-only text drops do not create notes and show clear feedback.
  4. Newly created dropped-text notes are persisted and available after panel reopen.

USE CASE:
- USE CASE ID: UC-16
- GOAL: User can choose a default subdirectory within browser favorites and have FAVORITES open there automatically.
- ACTOR: End User
- IMPLEMENTATION COMMENT: If the saved favorites subdirectory is deleted outside the application, startup falls back to root favorites with user-visible notice.
- STEP BY STEP WALKTHROUGH:
  1. User opens the OPTIONS tab.
  2. User opens a Favorites default folder picker.
  3. User chooses a favorites subdirectory.
  4. User saves settings and opens the FAVORITES tab.
  5. User confirms FAVORITES initially loads the selected subdirectory.
- ACCEPTANCE CRITERIA:
  1. OPTIONS view allows selecting a subdirectory from the favorites tree.
  2. Selected favorites subdirectory persists across panel reopen.
  3. FAVORITES tab defaults to the selected subdirectory on first open in a session.
  4. If selected favorites subdirectory no longer exists, FAVORITES falls back to root favorites and informs the user.
