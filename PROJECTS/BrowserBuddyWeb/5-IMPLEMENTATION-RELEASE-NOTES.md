RELEASE-NOTES:
- Version ID: v0.4.0-react-drop-notes-slice-2026-03-31
- Summary of features implemented:
  1. Implemented UC-14 image drop ingestion in NOTES from dropped image files/data URLs with image note creation.
  2. Implemented UC-15 plain-text drop ingestion in NOTES with non-empty validation and note creation.
  3. Added image-note preview rendering and image clipboard copy parity for dropped image notes.
  4. Added NOTES drop-target affordance and browser-default drop prevention to avoid accidental page navigation.
  5. Preserved existing notes/favorites/options workflows and bumped BrowserBuddyWeb package version to 0.4.0.

- Runtime caveats and implementation constraints:
  1. UC-01: Runtime verification is required in supported browsers.
  2. UC-04, UC-11, UC-12, and UC-13 remain pending migration to full React behavior parity.
  3. UC-10/UC-16 web migration uses application-managed favorites data; direct browser bookmark API parity is not available in this web runtime.

- Historical implementation text:
  1. v0.4.0-react-drop-notes-slice-2026-03-31: Implemented NOTES image/text external drop note creation, image-note preview/copy support, and safe drop-target behavior.
  2. v0.3.0-react-favorites-slice-2026-03-31: Added application-managed favorites workflows and default favorites folder persistence in the React app.
  3. v0.2.0-react-notes-slice-2026-03-31: Delivered first usable Browser Buddy Web UI with persistent notes actions, view toggles, drag-reorder, and theming options.
  4. v0.1.0-react-baseline-2026-03-31: Established React-stack foundation and local browser startup baseline for BrowserBuddyWeb.
