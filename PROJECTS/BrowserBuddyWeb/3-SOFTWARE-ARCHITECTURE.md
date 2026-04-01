ARCHITECTURE:
- ARCHITECTURE ID: UC-01.BR-01.ARCH-01
- COMPONENTS AFFECTED: package.json, vite.config.ts, tsconfig.json, index.html, src/main.tsx
- TECHNOLOGY DECISIONS: Use Vite + React + TypeScript as application foundation.
- TRADEOFFS: Fast iteration and typed UI development; browser-extension APIs are not directly available in web runtime.

ARCHITECTURE:
- ARCHITECTURE ID: UC-02.BR-01.ARCH-01
- COMPONENTS AFFECTED: src/App.tsx, localStorage notes state
- TECHNOLOGY DECISIONS: Maintain notes as client-side state persisted to localStorage.
- TRADEOFFS: Simple and responsive local data model; no multi-device sync.

ARCHITECTURE:
- ARCHITECTURE ID: UC-03.BR-01.ARCH-01
- COMPONENTS AFFECTED: src/App.tsx notes list drag handlers
- TECHNOLOGY DECISIONS: Use HTML drag-and-drop events with in-memory array reorder.
- TRADEOFFS: Lightweight implementation; limited touch-device ergonomics without additional handlers.

ARCHITECTURE:
- ARCHITECTURE ID: UC-04.BR-01.ARCH-01
- COMPONENTS AFFECTED: Future capture module in src
- TECHNOLOGY DECISIONS: Reserve capture flow architecture for browser-safe region selection and image extraction.
- TRADEOFFS: Feature pending migration because extension capture APIs are not available in plain web runtime.

ARCHITECTURE:
- ARCHITECTURE ID: UC-05.BR-01.ARCH-01
- COMPONENTS AFFECTED: src/App.tsx clipboard action handlers
- TECHNOLOGY DECISIONS: Use browser Clipboard API with explicit success/failure status text.
- TRADEOFFS: Clipboard permission and secure-context requirements vary by browser context.

ARCHITECTURE:
- ARCHITECTURE ID: UC-06.BR-01.ARCH-01
- COMPONENTS AFFECTED: src/App.tsx, src/styles.css, localStorage settings state
- TECHNOLOGY DECISIONS: Use theme tokens via CSS custom properties and persist selected theme/view settings.
- TRADEOFFS: Theme scalability is strong, but larger catalogs require ongoing contrast QA.

ARCHITECTURE:
- ARCHITECTURE ID: UC-07.BR-01.ARCH-01
- COMPONENTS AFFECTED: src/App.tsx tab navigation and action controls
- TECHNOLOGY DECISIONS: Use in-app tab state routing for NOTES/FAVORITES/OPTIONS.
- TRADEOFFS: Fast and simple UX; deep linking is not provided in this slice.

ARCHITECTURE:
- ARCHITECTURE ID: UC-08.BR-01.ARCH-01
- COMPONENTS AFFECTED: src/styles.css, src/App.tsx header and notes components
- TECHNOLOGY DECISIONS: Keep brand-forward header and readable themed note surfaces.
- TRADEOFFS: Visual consistency improves usability but requires careful theme maintenance.

ARCHITECTURE:
- ARCHITECTURE ID: UC-09.BR-01.ARCH-01
- COMPONENTS AFFECTED: src/App.tsx action groups and view controls
- TECHNOLOGY DECISIONS: Group action controls by workflow intent and preserve layout structure.
- TRADEOFFS: Consistent grouping improves learnability but constrains ad-hoc control placement.

ARCHITECTURE:
- ARCHITECTURE ID: UC-10.BR-01.ARCH-01
- COMPONENTS AFFECTED: src/App.tsx favorites tree, drag payload handlers, clipboard actions
- TECHNOLOGY DECISIONS: Model favorites as application-managed hierarchical nodes with folder navigation and multi-select operations.
- TRADEOFFS: Enables web compatibility; not a direct mirror of browser bookmark APIs.

ARCHITECTURE:
- ARCHITECTURE ID: UC-11.BR-01.ARCH-01
- COMPONENTS AFFECTED: src/App.tsx header metadata display, package.json version source
- TECHNOLOGY DECISIONS: Use package-driven version labeling in UI.
- TRADEOFFS: Reliable version source; rebuild/reload needed to observe updates.

ARCHITECTURE:
- ARCHITECTURE ID: UC-12.BR-01.ARCH-01
- COMPONENTS AFFECTED: Build metadata usage in src/App.tsx
- TECHNOLOGY DECISIONS: Resolve version from build/package metadata on load.
- TRADEOFFS: Simple update path but requires reload cycle after deployment.

ARCHITECTURE:
- ARCHITECTURE ID: UC-13.BR-01.ARCH-01
- COMPONENTS AFFECTED: src/styles.css header typography styles
- TECHNOLOGY DECISIONS: Enforce typographic hierarchy and contrast-aware header presentation.
- TRADEOFFS: Better readability; requires per-theme visual checks.

ARCHITECTURE:
- ARCHITECTURE ID: UC-14.BR-01.ARCH-01
- COMPONENTS AFFECTED: Future notes drop-image handlers in src/App.tsx
- TECHNOLOGY DECISIONS: Reserve image drag-drop ingestion path for NOTES with single-note creation semantics.
- TRADEOFFS: Pending migration work because current slice focuses on notes/favorites basics.

ARCHITECTURE:
- ARCHITECTURE ID: UC-15.BR-01.ARCH-01
- COMPONENTS AFFECTED: Future notes drop-text handlers in src/App.tsx
- TECHNOLOGY DECISIONS: Reserve plain-text drop ingestion for NOTES with validation and feedback.
- TRADEOFFS: Pending migration until drag-drop ingest feature slice is implemented in web app.

ARCHITECTURE:
- ARCHITECTURE ID: UC-16.BR-01.ARCH-01
- COMPONENTS AFFECTED: src/App.tsx OPTIONS and FAVORITES state, localStorage defaults
- TECHNOLOGY DECISIONS: Persist default favorites folder ID and initialize FAVORITES to that folder.
- TRADEOFFS: User-managed tree defaults are predictable; invalid/deleted-node recovery must be handled.
