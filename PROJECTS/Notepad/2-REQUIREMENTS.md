BR-001 : Extension action opens Notepad in one click from the toolbar icon.
- TESTABLE CONDITION
  1. Clicking the extension action icon launches the Notepad experience without additional user steps.
- NOTES
  1. This is the primary entrypoint for all user flows.
- RELATED UC-001, UC-008

BR-002 : Notepad renders a retro Windows-style interface with title bar, menu controls, editor, and status area.
- TESTABLE CONDITION
  1. On launch, the UI shows window title text, menu row, editable text area, and status indicators.
- NOTES
  1. Visual intent remains Classic Notepad.
- RELATED UC-001

BR-003 : Editor is immediately usable for multiline plain text editing.
- TESTABLE CONDITION
  1. User can place cursor, type, delete, and insert line breaks directly after opening.
- NOTES
  1. Behavior should match normal desktop notepad editing expectations.
- RELATED UC-001, UC-002

BR-004 : Content mutations are reflected in real time and dirty/saved state is tracked accurately.
- TESTABLE CONDITION
  1. Input changes update visible editor content instantly and toggle save-state indicator to unsaved.
- NOTES
  1. Dirty-state accuracy is required for safe destructive-action prompts.
- RELATED UC-002, UC-007

BR-005 : Save operation persists note content and metadata to chrome.storage.local.
- TESTABLE CONDITION
  1. Triggering save writes content and metadata payload (title, wrap mode, cursor bounds, filename, dirty state) to storage.
- NOTES
  1. Storage key must be stable across sessions.
- RELATED UC-003

BR-006 : Save operation provides explicit visible confirmation.
- TESTABLE CONDITION
  1. After successful save, the UI displays saved status without requiring developer tools.
- NOTES
  1. Status copy must be user-facing.
- RELATED UC-003

BR-007 : Load or reopen restores saved content accurately and keeps editor editable.
- TESTABLE CONDITION
  1. Restored text matches previously saved content and accepts immediate edits.
- NOTES
  1. Restore includes metadata when valid.
- RELATED UC-004

BR-008 : New action clears content only after confirmation when unsaved edits exist.
- TESTABLE CONDITION
  1. Invoking New on dirty content prompts user; confirm clears, cancel preserves.
- NOTES
  1. New may proceed immediately if content is already clean.
- RELATED UC-005, UC-007

BR-009 : Open/Load action warns on unsaved state and honors the chosen decision.
- TESTABLE CONDITION
  1. Opening/importing while dirty prompts user; cancel prevents replacement, continue proceeds.
- NOTES
  1. Prompt contract must match New and Close flows.
- RELATED UC-004, UC-007

BR-010 : Close with unsaved content triggers confirmation and applies selected outcome only.
- TESTABLE CONDITION
  1. Closing while dirty prompts user and either saves, discards, or cancels according to selection.
- NOTES
  1. Cancel keeps the window open and preserves state.
- RELATED UC-007

BR-011 : Save As/Download exports current editor text as plain text with .txt default extension.
- TESTABLE CONDITION
  1. Save As creates a downloadable file whose extension defaults to .txt when omitted.
- NOTES
  1. Export must be fully client-side.
- RELATED UC-006

BR-012 : Exported file content is byte-equivalent to editor content at export time.
- TESTABLE CONDITION
  1. Downloaded text exactly equals in-memory editor value with no transformations.
- NOTES
  1. Use UTF-8 text/plain payload.
- RELATED UC-006

BR-013 : State management preserves title, wrap mode, cursor, and last filename consistently.
- TESTABLE CONDITION
  1. Across save/load/new/open flows, metadata remains coherent and valid for current content.
- NOTES
  1. Cursor bounds must never exceed content length.
- RELATED UC-002, UC-003, UC-004

BR-014 : New, Open/Load, and Close flows share a single unsaved-confirmation model.
- TESTABLE CONDITION
  1. Each destructive flow invokes the same confirmation mechanism and executes only approved actions.
- NOTES
  1. Shared logic reduces divergence defects.
- RELATED UC-005, UC-007

BR-015 : Notepad opens as a detached standalone Chrome window with normal OS window behavior.
- TESTABLE CONDITION
  1. Launched Notepad window can be moved, resized, minimized, and restored via OS controls.
- NOTES
  1. Launch mechanism must use detached window APIs rather than extension popup overlay.
- RELATED UC-008

BR-016 : Only one Notepad window instance exists; relaunch focuses existing instance.
- TESTABLE CONDITION
  1. If a Notepad window is already open, clicking the extension action focuses that window and does not create another.
- NOTES
  1. Must remain robust across service worker restarts.
- RELATED UC-008

BR-017 : Notepad window geometry persists between sessions.
- TESTABLE CONDITION
  1. After move/resize and close, next launch restores last known size and position.
- NOTES
  1. Invalid geometry falls back to defaults safely.
- RELATED UC-008

BR-018 : Existing editor capabilities continue to work inside detached window mode.
- TESTABLE CONDITION
  1. Save, load, new, find/replace, download, and unsaved prompts all function in detached window context.
- NOTES
  1. Detached-window migration must not regress prior functionality.
- RELATED UC-008, UC-001, UC-002, UC-003, UC-004, UC-005, UC-006, UC-007

BR-019 : Help menu opens a keyboard-shortcuts dialog.
- TESTABLE CONDITION
  1. Activating Help shows a modal dialog that lists supported shortcuts.
- NOTES
  1. Dialog replaces generic alert behavior.
- RELATED UC-009

BR-020 : Help dialog lists each shortcut with both key combo and action label.
- TESTABLE CONDITION
  1. Dialog includes Ctrl+N, Ctrl+O, Ctrl+S, Ctrl+F, Ctrl+H, Ctrl+A, Ctrl+Y, and F5 with matching action descriptions.
- NOTES
  1. Listed shortcuts must stay aligned with keyboard handler bindings.
- RELATED UC-009

BR-021 : Help dialog closes via explicit Close action and Escape key.
- TESTABLE CONDITION
  1. User can dismiss the dialog using Close or Esc and return focus to editor.
- NOTES
  1. Native dialog behavior is acceptable.
- RELATED UC-009