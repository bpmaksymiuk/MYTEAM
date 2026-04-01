RELEASE-NOTES:
- Version ID: v0.6.1-bugfix-2026-03-31
- Summary of features implemented:
  1. Fixed UC-14/UC-15 drag-drop routing so external drops are no longer swallowed by internal note-reorder handlers.
  2. Expanded drop acceptance to the full NOTES view so dropping image/text into NOTES consistently creates notes instead of triggering browser default navigation.
  3. Corrected drag event propagation between note-item, notes-list, and NOTES view handlers to preserve reorder behavior while reliably ingesting external payloads.
  4. Added and retained user-facing drop hint text in NOTES for discoverability.
  5. Bumped extension manifest version to 0.6.1.

- Runtime caveats and implementation constraints:
  1. UC-01: Install/open behavior is structurally implemented but still requires runtime verification in Chrome environments.
  2. UC-04: Capture flow depends on page/browser permission context and requires runtime checks on supported pages.
  3. UC-10: Favorites drag-out interoperability depends on external drop targets and should be runtime-validated.
  4. UC-12: Version label updates on panel reload; users must reopen the side panel after extension update.
  5. UC-14: External image URL drops may fail when source denies cross-origin fetch; file or data-URL drops remain supported.
  6. UC-16: Saved favorites default folder can be deleted externally; implementation falls back to root favorites with notice.

- Historical implementation text:
  1. v0.6.1-bugfix-2026-03-31: Fixed drag-drop bug where external drops could open in the browser instead of creating notes, by correcting NOTES drop routing and event propagation.
  2. v0.6.0-pipeline-rerun-2026-03-31: Implemented NOTES external drop ingestion for image and plain-text note creation with drop feedback and persistence.
  3. v0.5.2-pipeline-rerun-2026-03-31: Fixed Favorites folder-row styling so folder entries use the same background treatment as non-folder entries.
  4. v0.5.1-pipeline-rerun-2026-03-31: Removed folder-related use-case traces across stages and implementation, and moved them to proposed use cases.
  5. v0.5.0-pipeline-rerun-2026-03-31: Implemented header version label and default Favorites subdirectory options.
  6. v0.4.1-pipeline-rerun-2026-03-31: Fixed capture clipboard bug so captured region notes copy as image data, with fallback behavior where image clipboard is unavailable.
  7. v0.1.0-pipeline-rerun-2026-03-31: Recreated baseline extension with notes CRUD, drag-drop ordering, capture-to-note flow, clipboard copy, and initial theme support.
  8. v0.2.0-pipeline-rerun-2026-03-31: Expanded to a 20+ theme catalog and enforced grouped NOTES toolbar layout.
  9. v0.3.0-pipeline-rerun-2026-03-31: Added FAVORITES tab with folder navigation, formatted link copy, and bookmark add/remove actions.
  10. v0.4.0-pipeline-rerun-2026-03-31: Full clean rerun from Stage 1 with Midnight Terminal default and Favorites drag-out behavior.
