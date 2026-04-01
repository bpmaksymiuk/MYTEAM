ARCHITECTURE:
- ARCHITECTURE ID: UC-01.BR-01.ARCH-01
- COMPONENTS AFFECTED: src/extension/manifest.json, src/extension/background.js, src/extension/sidepanel.html
- TECHNOLOGY DECISIONS: Use Chrome Manifest V3 with action and side panel defaults; use service worker to configure panel behavior.
- TRADEOFFS: MV3 improves platform security but service worker lifecycle requires asynchronous message-first design.

ARCHITECTURE:
- ARCHITECTURE ID: UC-02.BR-01.ARCH-01
- COMPONENTS AFFECTED: src/extension/sidepanel.js, chrome.storage.local
- TECHNOLOGY DECISIONS: Store notes as ordered array records in chrome.storage.local and render directly from persisted state.
- TRADEOFFS: Local persistence is simple and fast but constrained by extension storage quotas.

ARCHITECTURE:
- ARCHITECTURE ID: UC-03.BR-01.ARCH-01
- COMPONENTS AFFECTED: src/extension/sidepanel.js, notes list renderer, drag-drop interaction layer
- TECHNOLOGY DECISIONS: Use HTML5 drag-and-drop handlers on list items and reorder array using source/target index mapping.
- TRADEOFFS: Native drag-and-drop is lightweight but needs explicit visual feedback and fallback-friendly handling.

ARCHITECTURE:
- ARCHITECTURE ID: UC-04.BR-01.ARCH-01
- COMPONENTS AFFECTED: src/extension/sidepanel.js, src/extension/content-script.js, src/extension/background.js
- TECHNOLOGY DECISIONS: Use content-script region selector, background tab screenshot bridge, and panel-side crop pipeline.
- TRADEOFFS: Cross-context capture supports richer notes but increases coordination complexity.

ARCHITECTURE:
- ARCHITECTURE ID: UC-05.BR-01.ARCH-01
- COMPONENTS AFFECTED: src/extension/sidepanel.js, clipboard API adapter, note selection state
- TECHNOLOGY DECISIONS: Copy from selected note via Clipboard APIs and show status text on success or failure.
- TRADEOFFS: Clipboard permission behavior can vary by browser context and requires robust error path.

ARCHITECTURE:
- ARCHITECTURE ID: UC-06.BR-01.ARCH-01
- COMPONENTS AFFECTED: src/extension/sidepanel.css, src/extension/sidepanel.js, settings persistence
- TECHNOLOGY DECISIONS: Implement a theme catalog model in JavaScript with at least 20 theme token sets, defaulting to Midnight Terminal, and apply tokens via CSS custom properties.
- TRADEOFFS: Large theme catalogs improve personalization but increase style maintenance and visual regression surface.

ARCHITECTURE:
- ARCHITECTURE ID: UC-07.BR-01.ARCH-01
- COMPONENTS AFFECTED: src/extension/sidepanel.html, src/extension/sidepanel.js
- TECHNOLOGY DECISIONS: Use lightweight in-panel tab switching with icon-first controls and accessibility labels.
- TRADEOFFS: Compact icon UI reduces clutter but can reduce discoverability without titles and aria labels.

ARCHITECTURE:
- ARCHITECTURE ID: UC-08.BR-01.ARCH-01
- COMPONENTS AFFECTED: src/extension/sidepanel.html, src/extension/sidepanel.css, src/extension/pnp.png
- TECHNOLOGY DECISIONS: Render image-first brand header and use controlled color palette variables for note cards.
- TRADEOFFS: Strong branding and visual differentiation increase recognition but introduce asset dependency and contrast checks.

ARCHITECTURE:
- ARCHITECTURE ID: UC-09.BR-01.ARCH-01
- COMPONENTS AFFECTED: src/extension/sidepanel.html, src/extension/sidepanel.css
- TECHNOLOGY DECISIONS: Use explicit grouped containers for toolbar controls and a split lower row with right-justified view mode group.
- TRADEOFFS: Strict grouping increases consistency but reduces flexibility for future ad-hoc toolbar additions.

ARCHITECTURE:
- ARCHITECTURE ID: UC-10.BR-01.ARCH-01
- COMPONENTS AFFECTED: src/extension/manifest.json, src/extension/sidepanel.html, src/extension/sidepanel.js
- TECHNOLOGY DECISIONS: Use Chrome Bookmarks API in the side panel for folder traversal, multi-select operations, clipboard formatting, add/remove bookmark item actions, and HTML5 drag payloads for bookmark rows.
- TRADEOFFS: Direct bookmarks integration enables real data workflows but requires extra permission scope, careful callback API handling, and cross-target drag payload compatibility checks.

ARCHITECTURE:
- ARCHITECTURE ID: UC-11.BR-01.ARCH-01
- COMPONENTS AFFECTED: src/extension/sidepanel.html, src/extension/sidepanel.js
- TECHNOLOGY DECISIONS: Read extension version via chrome.runtime.getManifest().version and inject into dedicated header label element at panel init.
- TRADEOFFS: Runtime read avoids hardcoded version text but requires rendering logic and fallback handling.

ARCHITECTURE:
- ARCHITECTURE ID: UC-12.BR-01.ARCH-01
- COMPONENTS AFFECTED: src/extension/manifest.json, src/extension/sidepanel.js
- TECHNOLOGY DECISIONS: Keep version display fully manifest-driven by reading manifest at runtime each panel load.
- TRADEOFFS: Simple and reliable on reload, but does not reflect updates in already-open panels until reload.

ARCHITECTURE:
- ARCHITECTURE ID: UC-13.BR-01.ARCH-01
- COMPONENTS AFFECTED: src/extension/sidepanel.css, src/extension/sidepanel.html
- TECHNOLOGY DECISIONS: Use semantic title and secondary badge styling with explicit contrast-aware colors from theme variables.
- TRADEOFFS: Additional style rules improve readability but increase theme compatibility surface.

ARCHITECTURE:
- ARCHITECTURE ID: UC-14.BR-01.ARCH-01
- COMPONENTS AFFECTED: src/extension/sidepanel.js, src/extension/sidepanel.css
- TECHNOLOGY DECISIONS: Add NOTES drop-target handlers that parse drag data transfer payloads in priority order (image files, HTML image sources, URI list image URLs, image data URLs) and normalize accepted images to note screenshotDataUrl.
- TRADEOFFS: Multi-source parsing improves interoperability across drag origins but introduces more payload-interpretation branches and network-dependent image URL fetch behavior.

ARCHITECTURE:
- ARCHITECTURE ID: UC-15.BR-01.ARCH-01
- COMPONENTS AFFECTED: src/extension/sidepanel.js
- TECHNOLOGY DECISIONS: Reuse NOTES drop-target flow to accept plain text payloads and map non-empty content into standard text notes persisted through existing storage pipeline.
- TRADEOFFS: Shared drop pipeline minimizes duplication but requires strict guardrails so unsupported payloads and empty text do not create accidental notes.

ARCHITECTURE:
- ARCHITECTURE ID: UC-16.BR-01.ARCH-01
- COMPONENTS AFFECTED: src/extension/sidepanel.html, src/extension/sidepanel.js, chrome.bookmarks API, chrome.storage.local
- TECHNOLOGY DECISIONS: Flatten bookmarks folder tree for OPTIONS picker, store selected folder ID, and use it as FAVORITES initial node with fallback to root.
- TRADEOFFS: Folder-ID persistence gives predictable startup context but can break when folders are deleted and needs recovery logic.
