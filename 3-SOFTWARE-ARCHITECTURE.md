ARCHITECTURE:
- ARCHITECTURE ID: UC-01.BR-01.ARCH-01
- COMPONENTS AFFECTED: manifest.json, background.js, sidepanel.html
- TECHNOLOGY DECISIONS: Use Chrome Manifest V3 with side panel default_path and action-triggered panel open via service worker.
- TRADEOFFS: MV3 provides stronger security boundaries but service-worker lifecycle can complicate long-lived state.

ARCHITECTURE:
- ARCHITECTURE ID: UC-02.BR-01.ARCH-01
- COMPONENTS AFFECTED: sidepanel.js, chrome.storage.local, NotesStore
- TECHNOLOGY DECISIONS: Persist note records in chrome.storage.local with immutable IDs and ordered array operations for create/edit/delete/reorder.
- TRADEOFFS: Local storage is simple and fast but has quota limits and requires careful serialization.

ARCHITECTURE:
- ARCHITECTURE ID: UC-03.BR-01.ARCH-01
- COMPONENTS AFFECTED: sidepanel.js, clipboard adapter, note selection state
- TECHNOLOGY DECISIONS: Maintain selectedNoteId and copy via Clipboard API with fallback and user-visible status messages.
- TRADEOFFS: Clipboard reliability varies by context, requiring fallback and explicit failure handling.

ARCHITECTURE:
- ARCHITECTURE ID: UC-04.BR-01.ARCH-01
- COMPONENTS AFFECTED: options tab UI, SettingsStore, theme/view settings
- TECHNOLOGY DECISIONS: Use OPTIONS tab in side panel as settings surface and persist settings atomically in chrome.storage.local.
- TRADEOFFS: Single-surface settings reduces navigation but increases complexity inside side panel state management.

ARCHITECTURE:
- ARCHITECTURE ID: UC-05.BR-01.ARCH-01
- COMPONENTS AFFECTED: sidepanel.js, content-script.js, background.js capture bridge
- TECHNOLOGY DECISIONS: Use content-script overlay for region selection, background tab capture, and convert capture result into note record.
- TRADEOFFS: Region capture supports rich note creation but requires async coordination across panel, content script, and service worker.

ARCHITECTURE:
- ARCHITECTURE ID: UC-06.BR-01.ARCH-01
- COMPONENTS AFFECTED: sidepanel.css, data-theme state, SettingsStore
- TECHNOLOGY DECISIONS: Implement theme switching through data-theme attribute plus CSS variables with persisted theme preference.
- TRADEOFFS: CSS-variable theming is maintainable but requires full variable coverage to avoid inconsistent surfaces.

ARCHITECTURE:
- ARCHITECTURE ID: UC-07.BR-01.ARCH-01
- COMPONENTS AFFECTED: note renderer, palette tokens, theme-aware contrast styles
- TECHNOLOGY DECISIONS: Assign note color classes from a controlled palette and enforce contrast-aware text colors per theme.
- TRADEOFFS: Fixed palette gives consistency but reduces user customization granularity.

ARCHITECTURE:
- ARCHITECTURE ID: UC-08.BR-01.ARCH-01
- COMPONENTS AFFECTED: tab bar, panel views, UI state router
- TECHNOLOGY DECISIONS: Implement lightweight tab state router that toggles NOTES and OPTIONS panels without route changes.
- TRADEOFFS: In-panel routing is fast but requires strict state sync between tab and content containers.

ARCHITECTURE:
- ARCHITECTURE ID: UC-09.BR-01.ARCH-01
- COMPONENTS AFFECTED: notes container layout engine, list/grid toggle controls
- TECHNOLOGY DECISIONS: Apply CSS class switching for list/grid modes and persist preferred mode in settings.
- TRADEOFFS: CSS-driven mode switching is low overhead but requires responsive constraints to keep grid readable.

ARCHITECTURE:
- ARCHITECTURE ID: UC-10.BR-01.ARCH-01
- COMPONENTS AFFECTED: header component, pnp.png asset, title layout styles
- TECHNOLOGY DECISIONS: Render branded header as text-image-text with explicit image sizing and fallback handling.
- TRADEOFFS: Asset branding improves recognition but introduces dependency on packaged static image.

ARCHITECTURE:
- ARCHITECTURE ID: UC-11.BR-01.ARCH-01
- COMPONENTS AFFECTED: action toolbar, icon buttons, accessibility labels
- TECHNOLOGY DECISIONS: Replace verbose text controls with icon-based buttons using aria-label/title for accessibility and remove deprecated options button.
- TRADEOFFS: Icon-first UI reduces visual noise but can reduce discoverability without tooltip support.
