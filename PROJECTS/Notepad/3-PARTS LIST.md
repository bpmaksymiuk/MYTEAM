PART:
- PART ID: PART-01
- PART NAME: Extension manifest
- NOTES: Declares popup, icons, command shortcut, permissions, and extension metadata.
- RELATED: UC-01, BR-01, AR-01

PART:
- PART ID: PART-02
- PART NAME: Popup shell UI
- NOTES: Provides title bar, menu bar, status bar, editor textarea, and modal host elements.
- RELATED: UC-01, BR-01, AR-01

PART:
- PART ID: PART-03
- PART NAME: Editor command controller
- NOTES: Handles New, Edit commands, keyboard shortcuts, and document dirty tracking.
- RELATED: UC-02, UC-03, BR-02, BR-03, AR-02, AR-03

PART:
- PART ID: PART-04
- PART NAME: File import-export adapter
- NOTES: Handles save blob download and open-file ingestion from local machine.
- RELATED: UC-04, UC-05, BR-04, BR-05, AR-04, AR-05

PART:
- PART ID: PART-05
- PART NAME: Find and replace dialog module
- NOTES: Implements search traversal, replace modes, wrap behavior, and match-case toggle.
- RELATED: UC-06, BR-06, AR-06

PART:
- PART ID: PART-06
- PART NAME: Persistence and restore module
- NOTES: Stores content and editor state to chrome.storage.local with debounce and restore flow.
- RELATED: UC-07, BR-07, AR-07

PART:
- PART ID: PART-07
- PART NAME: Exit confirmation dialog
- NOTES: Prompts Save/Discard/Cancel before close and routes to save pipeline when needed.
- RELATED: UC-08, BR-08, AR-08
