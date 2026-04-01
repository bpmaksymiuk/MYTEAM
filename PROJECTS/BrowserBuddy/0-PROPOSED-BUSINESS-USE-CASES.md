USE CASE:
- USE CASE ID: PUC-01
- GOAL: User can browse local files from a new Folder tab that opens to the user's home directory by default.
- ACTOR: End User
- STEP BY STEP WALKTHROUGH:
  1. User opens the side panel.
  2. User clicks the FOLDER tab.
  3. User sees a file explorer view populated with files and directories.
  4. User confirms the initial path is the user's home directory.
- ACCEPTANCE CRITERIA:
  1. Side panel includes a FOLDER tab.
  2. FOLDER tab shows file explorer items with directory navigation.
  3. Initial folder path defaults to the user's home directory when no override is saved.
  4. If the home directory is unavailable, the UI shows an actionable error or safe fallback path.

USE CASE:
- USE CASE ID: PUC-02
- GOAL: User can set and persist a custom default folder path for the Folder tab from Options.
- ACTOR: End User
- STEP BY STEP WALKTHROUGH:
  1. User opens the OPTIONS tab.
  2. User locates the setting for default Folder tab path.
  3. User enters or selects a valid directory path.
  4. User saves the setting and closes the side panel.
  5. User reopens the side panel and opens the FOLDER tab.
- ACCEPTANCE CRITERIA:
  1. OPTIONS view includes a control for Folder tab default directory.
  2. Saved default directory persists across panel reopen.
  3. FOLDER tab opens to saved directory when it is valid.
  4. Invalid saved paths are handled safely and fall back to home directory with user-visible feedback.

