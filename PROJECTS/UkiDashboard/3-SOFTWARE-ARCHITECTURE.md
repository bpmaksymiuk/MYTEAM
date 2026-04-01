CURRENT ARCHITECTURE STATUS:
- DATE: 2026-04-01
- AUTHORITATIVE IMPLEMENTATION STATE: Architecture slices covering UC-01 through UC-12 are implemented and executable in current baseline.
- TRACEABILITY NOTE: Architecture items below remain as design-trace records mapped to delivered runtime modules.

ARCHITECTURE:
- ARCHITECTURE ID: UC-01.BR-01.ARCH-01
- COMPONENTS AFFECTED: src/extension/manifest.json, src/extension/background.js, src/extension/window.html
- TECHNOLOGY DECISIONS: Use Chrome MV3 action with popup-window launch service to provide a desktop-like command console window.
- TRADEOFFS: Popup behavior can vary by browser window management policies and OS constraints.

ARCHITECTURE:
- ARCHITECTURE ID: UC-01.BR-02.ARCH-01
- COMPONENTS AFFECTED: src/extension/window.html, src/extension/window.js, src/extension/window.css
- TECHNOLOGY DECISIONS: Use modular shell bootstrap that renders map, feed, KPI strip, and alert rail at first paint.
- TRADEOFFS: Heavy first paint modules may require progressive loading for lower-end systems.

ARCHITECTURE:
- ARCHITECTURE ID: UC-02.BR-01.ARCH-01
- COMPONENTS AFFECTED: src/extension/data/feed-orchestrator.js, src/extension/data/source-clients/news-client.js, src/extension/data/source-clients/events-client.js
- TECHNOLOGY DECISIONS: Implement feed orchestrator with polling/stream adapters for realtime and near-realtime sources.
- TRADEOFFS: Polling is simpler and portable but less immediate than push-stream integrations.

ARCHITECTURE:
- ARCHITECTURE ID: UC-02.BR-02.ARCH-01
- COMPONENTS AFFECTED: src/extension/data/dedup-engine.js, src/extension/data/feed-orchestrator.js, src/extension/window.js
- TECHNOLOGY DECISIONS: Normalize all feed items to a canonical schema and deduplicate using source+time+content signatures.
- TRADEOFFS: Aggressive dedup signatures can hide legitimately distinct updates from mirrored outlets.

ARCHITECTURE:
- ARCHITECTURE ID: UC-03.BR-01.ARCH-01
- COMPONENTS AFFECTED: src/extension/data/market-client.js, src/extension/window.js, src/extension/window.css
- TECHNOLOGY DECISIONS: Use pluggable indicator registry with card-based rendering and lightweight trend visualization.
- TRADEOFFS: Broad indicator flexibility increases configuration complexity.

ARCHITECTURE:
- ARCHITECTURE ID: UC-03.BR-02.ARCH-01
- COMPONENTS AFFECTED: src/extension/data/market-health.js, src/extension/window.js, src/extension/window.css
- TECHNOLOGY DECISIONS: Attach freshness metadata to each indicator payload and render stale/unavailable status badges.
- TRADEOFFS: Freshness thresholds must be tuned per data source to avoid false stale warnings.

ARCHITECTURE:
- ARCHITECTURE ID: UC-04.BR-01.ARCH-01
- COMPONENTS AFFECTED: src/extension/data/source-clients/drone-client.js, src/extension/data/drone-aggregator.js, src/extension/window.js
- TECHNOLOGY DECISIONS: Use dimension-aware aggregation pipeline for drone count/type/region/timeframe filters.
- TRADEOFFS: More dimensions increase compute and memory use during rapid filter changes.

ARCHITECTURE:
- ARCHITECTURE ID: UC-04.BR-02.ARCH-01
- COMPONENTS AFFECTED: src/extension/data/provenance-service.js, src/extension/window.js
- TECHNOLOGY DECISIONS: Store provenance metadata per aggregate and expose stale-data markers alongside visual summaries.
- TRADEOFFS: Provenance detail increases payload size and UI density.

ARCHITECTURE:
- ARCHITECTURE ID: UC-05.BR-01.ARCH-01
- COMPONENTS AFFECTED: src/extension/data/insights/pattern-engine.js, src/extension/data/insights/correlation-service.js
- TECHNOLOGY DECISIONS: Implement cross-feed pattern engine using rolling windows and configurable correlation/anomaly detectors.
- TRADEOFFS: Simpler heuristics are explainable but less precise than advanced ML approaches.

ARCHITECTURE:
- ARCHITECTURE ID: UC-05.BR-02.ARCH-01
- COMPONENTS AFFECTED: src/extension/data/insights/insight-card-mapper.js, src/extension/window.js
- TECHNOLOGY DECISIONS: Bind each insight to confidence score and evidence references to preserve traceability.
- TRADEOFFS: Strict evidence traceability may reduce throughput for rapid insight generation.

ARCHITECTURE:
- ARCHITECTURE ID: UC-06.BR-01.ARCH-01
- COMPONENTS AFFECTED: src/extension/runtime/playback-store.js, src/extension/window.js, src/extension/window.html
- TECHNOLOGY DECISIONS: Use centralized playback state so map overlays and timeline scrub position share one source of truth.
- TRADEOFFS: Centralized state simplifies sync but raises coupling between map and timeline modules.

ARCHITECTURE:
- ARCHITECTURE ID: UC-06.BR-02.ARCH-01
- COMPONENTS AFFECTED: src/extension/runtime/theme-engine.js, src/extension/window.js, src/extension/window.css
- TECHNOLOGY DECISIONS: Implement dynamic theme tokens and effect-level controls applied at runtime without state reset.
- TRADEOFFS: Rich theme runtime changes require careful performance budgeting.

ARCHITECTURE:
- ARCHITECTURE ID: UC-07.BR-01.ARCH-01
- COMPONENTS AFFECTED: src/extension/runtime/alert-rule-service.js, src/extension/window.js, src/extension/manifest.json
- TECHNOLOGY DECISIONS: Store alert rules in local persistent store with CRUD operations and schema validation.
- TRADEOFFS: Local-only rule persistence simplifies deployment but limits cross-device sync.

ARCHITECTURE:
- ARCHITECTURE ID: UC-07.BR-02.ARCH-01
- COMPONENTS AFFECTED: src/extension/runtime/alert-rule-service.js, src/extension/window.js
- TECHNOLOGY DECISIONS: Evaluate rules against normalized stream events and persist acknowledge/snooze/escalate state transitions.
- TRADEOFFS: Real-time rule evaluation adds CPU overhead with large event volume.

ARCHITECTURE:
- ARCHITECTURE ID: UC-08.BR-01.ARCH-01
- COMPONENTS AFFECTED: src/extension/runtime/layout-engine.js, src/extension/window.js, src/extension/window.css
- TECHNOLOGY DECISIONS: Use grid-based drag/resize layout engine with collision handling and immediate visual feedback.
- TRADEOFFS: Complex layout interactions can increase accessibility complexity for keyboard-only users.

ARCHITECTURE:
- ARCHITECTURE ID: UC-08.BR-02.ARCH-01
- COMPONENTS AFFECTED: src/extension/runtime/layout-profile-manager.js, src/extension/window.js
- TECHNOLOGY DECISIONS: Persist multiple named layout profiles and restore selected profile during app bootstrap.
- TRADEOFFS: Profile migration is needed when widget schemas evolve.

ARCHITECTURE:
- ARCHITECTURE ID: UC-09.BR-01.ARCH-01
- COMPONENTS AFFECTED: src/extension/data/source-health.js, src/extension/window.js
- TECHNOLOGY DECISIONS: Maintain per-source health FSM (online/delayed/degraded/offline) updated from feed heartbeat telemetry.
- TRADEOFFS: Health-state sensitivity tuning is required to avoid noisy status flapping.

ARCHITECTURE:
- ARCHITECTURE ID: UC-09.BR-02.ARCH-01
- COMPONENTS AFFECTED: src/extension/data/confidence.js, src/extension/window.js
- TECHNOLOGY DECISIONS: Compute confidence score per item and enforce confidence thresholds in both feed and insight query paths.
- TRADEOFFS: Confidence scoring must remain interpretable to maintain user trust.

ARCHITECTURE:
- ARCHITECTURE ID: UC-10.BR-01.ARCH-01
- COMPONENTS AFFECTED: src/extension/runtime/snapshot-service.js, src/extension/window.js
- TECHNOLOGY DECISIONS: Serialize dashboard context bundles (filters/timeframe/highlights/layout refs) as snapshot objects.
- TRADEOFFS: Rich snapshots can become large and require schema versioning.

ARCHITECTURE:
- ARCHITECTURE ID: UC-10.BR-02.ARCH-01
- COMPONENTS AFFECTED: src/extension/runtime/snapshot-service.js, src/extension/window.js
- TECHNOLOGY DECISIONS: Maintain timestamped snapshot index with deletion and retrieval operations.
- TRADEOFFS: Local retention limits may require automatic pruning policy.

ARCHITECTURE:
- ARCHITECTURE ID: UC-11.BR-01.ARCH-01
- COMPONENTS AFFECTED: src/extension/runtime/degraded-mode-controller.js, src/extension/window.js
- TECHNOLOGY DECISIONS: Introduce degraded-mode controller that isolates failing feeds while preserving shell responsiveness and cached views.
- TRADEOFFS: Cached fallback may present stale information if outage persists.

ARCHITECTURE:
- ARCHITECTURE ID: UC-11.BR-02.ARCH-01
- COMPONENTS AFFECTED: src/extension/runtime/reconnect-policy.js, src/extension/data/feed-orchestrator.js
- TECHNOLOGY DECISIONS: Apply exponential backoff reconnect policy with jitter and auto-recovery hooks.
- TRADEOFFS: Conservative backoff protects sources but delays full recovery.

ARCHITECTURE:
- ARCHITECTURE ID: UC-12.BR-01.ARCH-01
- COMPONENTS AFFECTED: src/extension/runtime/theme-engine.js, src/extension/window.css, src/extension/window.js
- TECHNOLOGY DECISIONS: Implement dedicated hero visual theme system with cinematic tokens, animation layers, and readability guards.
- TRADEOFFS: Cinematic styling can increase render cost on low-end hardware.

ARCHITECTURE:
- ARCHITECTURE ID: UC-12.BR-02.ARCH-01
- COMPONENTS AFFECTED: src/extension/runtime/theme-engine.js, src/extension/window.js, src/extension/window.html
- TECHNOLOGY DECISIONS: Expose runtime controls for motion, contrast, and optional sound cues with persistent user preferences.
- TRADEOFFS: More control surfaces improve accessibility but add configuration complexity.
