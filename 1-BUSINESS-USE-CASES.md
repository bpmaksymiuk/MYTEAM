USE CASE:
- USE CASE ID: UC-01
- GOAL: User can install Chrome Buddy as a Chrome extension and open the extension UI in the browser.
- ACTOR: End User
- STEP BY STEP WALKTHROUGH:
  1. User opens Chrome extensions settings.
  2. User installs or loads Chrome Buddy as an extension.
  3. User enables Chrome Buddy in Chrome.
  4. User clicks the extension action to open the extension UI.
- ACCEPTANCE CRITERIA:
  1. Chrome Buddy can be installed or loaded without blocking errors.
  2. Chrome Buddy appears in the browser extension list as enabled.
  3. User can open the extension UI from the browser action.

USE CASE:
- USE CASE ID: UC-02
- GOAL: User can manage reusable notes in the Notes List.
- ACTOR: End User
- STEP BY STEP WALKTHROUGH:
  1. User opens the Notes List view in Chrome Buddy.
  2. User reviews existing notes.
  3. User edits the content of a selected note.
  4. User deletes a note that is no longer needed.
  5. User reorders notes to set priority.
- ACCEPTANCE CRITERIA:
  1. Notes List displays saved notes when the view is opened.
  2. Editing a note updates the saved content.
  3. Deleting a note removes it from the list.
  4. Reordering notes persists the updated order.

USE CASE:
- USE CASE ID: UC-03
- GOAL: User can quickly copy and reuse a saved note while browsing.
- ACTOR: End User
- STEP BY STEP WALKTHROUGH:
  1. User opens the Chrome Buddy side panel while on a web page.
  2. User finds the needed note in the list.
  3. User copies the selected note to the clipboard.
  4. User pastes the note into a target input field.
- ACCEPTANCE CRITERIA:
  1. Side panel can be opened on supported pages.
  2. User can select and copy a note from the panel.
  3. Copied note content can be pasted into another interface.
  4. If copy fails, the system shows a clear error message.

USE CASE:
- USE CASE ID: UC-04
- GOAL: User can configure extension settings and keep preferences across sessions.
- ACTOR: End User
- STEP BY STEP WALKTHROUGH:
  1. User opens the Options page.
  2. User edits configurable settings.
  3. User saves updated values.
  4. User closes and reopens Chrome or the extension.
- ACCEPTANCE CRITERIA:
  1. Settings can be edited and saved from the Options page.
  2. Saved settings persist after restarting Chrome.
  3. Reopening the extension applies the saved settings.

USE CASE:
- USE CASE ID: UC-05
- GOAL: User can capture browser content into a new note.
- ACTOR: End User
- STEP BY STEP WALKTHROUGH:
  1. User starts capture mode.
  2. User selects a target area of browser content.
  3. Extension processes the selected content.
  4. Extension creates and saves a new note from the capture result.
- ACCEPTANCE CRITERIA:
  1. Capture mode can be started from the extension UI.
  2. Completing a selection creates one new note.
  3. The new note contains captured content.
  4. If capture is canceled, no new note is created.

USE CASE:
- USE CASE ID: UC-06
- GOAL: User can switch between default, light and dark themes.
- ACTOR: End User
- STEP BY STEP WALKTHROUGH:
  1. User opens the extension UI.
  2. User selects dark mode from the theme control.
  3. User verifies the dark theme is applied.
  4. User selects light mode from the theme control.
  5. User verifies the light theme is applied.
  6. User selects default mode from the theme control. Default= Shades of dark green. Make the background plaid with greens.
  7. User verifies the default theme is applied.
  
- ACCEPTANCE CRITERIA:
  1. Theme control offers both light and dark options.
  2. Selecting dark mode applies a dark visual theme immediately.
  3. Selecting light mode applies a light visual theme immediately.
  4. Theme choice persists across extension reopen.

USE CASE:
- USE CASE ID: UC-07
- GOAL: User can view notes with a colorful visual palette for easier scanning.
- ACTOR: End User
- STEP BY STEP WALKTHROUGH:
  1. User opens the Notes view.
  2. User reviews notes in the list or grid.
  3. User distinguishes notes based on their color styling.
  
- ACCEPTANCE CRITERIA:
  1. Notes are displayed with visible color differentiation.
  2. Color styling is consistent for each note presentation.
  3. Colors remain readable in both light and dark themes.

USE CASE:
- USE CASE ID: UC-08
- GOAL: User can switch between NOTES and OPTIONS tabs in one UI shell.
- ACTOR: End User
- STEP BY STEP WALKTHROUGH:
  1. User opens the extension UI.
  2. User clicks the OPTIONS tab and views options content.
  3. User clicks the NOTES tab and returns to notes content.
  4. User repeats tab switching without losing context.
- ACCEPTANCE CRITERIA:
  1. UI includes NOTES and OPTIONS tabs.
  2. Clicking a tab displays its corresponding content.
  3. Switching tabs does not break existing notes data.

USE CASE:
- USE CASE ID: UC-09
- GOAL: User can toggle Notes List presentation between list and grid views.
- ACTOR: End User
- STEP BY STEP WALKTHROUGH:
  1. User opens the NOTES tab.
  2. User selects list view and confirms list layout.
  3. User selects grid view and confirms multi-column layout.
  4. User toggles back to list view.
- ACCEPTANCE CRITERIA:
  1. Notes view provides list and grid controls.
  2. Grid view displays at least two columns when space allows.
  3. List view displays one item per row.
  4. Active view state is visually indicated.

USE CASE:
- USE CASE ID: UC-10
- GOAL: User can see a branded header with an icon between the words Chrome and Buddy.
- ACTOR: End User
- STEP BY STEP WALKTHROUGH:
  1. User opens the extension UI.
  2. System renders the title area in the top-left.
  3. System loads and displays the icon asset pnp.png between the title words.
- ACCEPTANCE CRITERIA:
  1. Header text appears as Chrome [pnp.png] Buddy.
  2. The icon source is pnp.png and loads without broken-image state.
  3. Header alignment remains correct across supported panel sizes.

USE CASE:
- USE CASE ID: UC-11
- GOAL: User can operate key UI actions through icons for a cleaner interface.
- ACTOR: End User
- STEP BY STEP WALKTHROUGH:
  1. User opens the extension UI.
  2. User observes icon-based controls for major actions.
  3. User uses icons for actions such as theme toggle, capture, add note, view toggle, copy, edit, and delete.
  4. User confirms the legacy Open Full Options button is no longer present.
- ACCEPTANCE CRITERIA:
  1. Major actions are represented by recognizable icons.
  2. Icon controls remain accessible and clickable.
  3. Open Full Options button is removed from the UI.
  4. Icon-only controls include labels or tooltips for clarity.
