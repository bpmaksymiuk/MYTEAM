CURRENT TECHNICAL DESIGN STATUS:
- DATE: 2026-04-01
- AUTHORITATIVE IMPLEMENTATION STATE: Technical design slices for UC-01 through UC-12 are implemented in the current extension baseline.
- TRACEABILITY NOTE: Design entries below remain implementation-trace references and historical task framing for delivered modules.

TECH-DESIGN:
- DESIGN ID: UC-01.BR-01.ARCH-01.DES-01
- IMPLEMENTATION TASKS: Define MV3 manifest action and command bindings; implement background launcher to open/focus standalone popup window; enforce single-console instance policy.
- INTERFACES AND DATA CONTRACTS: openConsoleWindow(): Promise<void>; WindowState { id:number, focused:boolean }.
- EDGE CASES AND ERROR HANDLING: If popup creation fails, surface user-visible error and retry option.
- TEST NOTES: Validate icon click opens popup and repeat clicks focus existing window.

TECH-DESIGN:
- DESIGN ID: UC-01.BR-02.ARCH-01.DES-01
- IMPLEMENTATION TASKS: Implement app shell bootstrap that mounts map/feed/KPI/alerts modules; wire initial loading states and module readiness indicators.
- INTERFACES AND DATA CONTRACTS: ShellModules { map, feedRail, kpiStrip, alertRail } with init(): Promise<void> contract.
- EDGE CASES AND ERROR HANDLING: If a module fails init, render degraded placeholder and continue shell startup.
- TEST NOTES: Verify first paint includes all four modules and each responds to interaction.

TECH-DESIGN:
- DESIGN ID: UC-02.BR-01.ARCH-01.DES-01
- IMPLEMENTATION TASKS: Build feed orchestrator scheduler; implement source clients for news/events; normalize timestamps to UTC and emit feed update events.
- INTERFACES AND DATA CONTRACTS: FeedItem { id, sourceId, category, timestamp, location?, title, body, confidence? }.
- EDGE CASES AND ERROR HANDLING: Handle network timeout and malformed payload with source-scoped retry/backoff.
- TEST NOTES: Simulate source updates and verify automatic feed refresh without reload.

TECH-DESIGN:
- DESIGN ID: UC-02.BR-02.ARCH-01.DES-01
- IMPLEMENTATION TASKS: Implement canonical feed normalizer and signature dedup engine; enrich entries with source/category/time metadata.
- INTERFACES AND DATA CONTRACTS: dedupSignature(item): string; DedupResult { accepted:boolean, duplicateOf?:string }.
- EDGE CASES AND ERROR HANDLING: Near-duplicate ambiguity should mark items as related rather than silently discarding both.
- TEST NOTES: Feed duplicate fixtures should collapse correctly and preserve required metadata.

TECH-DESIGN:
- DESIGN ID: UC-03.BR-01.ARCH-01.DES-01
- IMPLEMENTATION TASKS: Implement indicator registry, data adapters, and KPI card renderer with sparkline support.
- INTERFACES AND DATA CONTRACTS: IndicatorPoint { key, timestamp, value, delta, currency?, unit? }.
- EDGE CASES AND ERROR HANDLING: Missing or NaN values should skip plot point and flag card as partial.
- TEST NOTES: Confirm selected indicators update and render value plus trend direction.

TECH-DESIGN:
- DESIGN ID: UC-03.BR-02.ARCH-01.DES-01
- IMPLEMENTATION TASKS: Add freshness evaluator per indicator and status badge UI (live/stale/unavailable).
- INTERFACES AND DATA CONTRACTS: FreshnessPolicy { maxAgeMs:number, staleAfterMs:number }.
- EDGE CASES AND ERROR HANDLING: If policy not defined for indicator, apply default policy and log warning.
- TEST NOTES: Simulate delayed feeds and verify stale/unavailable badge transitions.

TECH-DESIGN:
- DESIGN ID: UC-04.BR-01.ARCH-01.DES-01
- IMPLEMENTATION TASKS: Implement drone data aggregator with filter controls (count/type/region/timeframe); wire panel charts and summaries.
- INTERFACES AND DATA CONTRACTS: DroneEvent { type, region, occurredAt, quantity, sourceRef }.
- EDGE CASES AND ERROR HANDLING: Unsupported drone type values map to "unknown" bucket rather than causing chart failure.
- TEST NOTES: Filter permutations should return deterministic aggregate totals.

TECH-DESIGN:
- DESIGN ID: UC-04.BR-02.ARCH-01.DES-01
- IMPLEMENTATION TASKS: Attach provenance metadata to each aggregate block and render stale indicators in panel header.
- INTERFACES AND DATA CONTRACTS: ProvenanceRef { sourceId, citationUrl?, collectedAt }.
- EDGE CASES AND ERROR HANDLING: Missing provenance should display explicit "source unavailable" marker.
- TEST NOTES: Ensure each aggregate card includes provenance and stale-state behavior.

TECH-DESIGN:
- DESIGN ID: UC-05.BR-01.ARCH-01.DES-01
- IMPLEMENTATION TASKS: Build pattern engine pipeline for rolling-window anomaly and correlation scoring across selected feeds.
- INTERFACES AND DATA CONTRACTS: PatternInputSet { feeds:string[], windowMs:number, sensitivity:number }.
- EDGE CASES AND ERROR HANDLING: If input density is too low, return "insufficient data" insight state.
- TEST NOTES: Multi-feed synthetic dataset should emit expected anomaly markers.

TECH-DESIGN:
- DESIGN ID: UC-05.BR-02.ARCH-01.DES-01
- IMPLEMENTATION TASKS: Build insight card mapper with confidence score display and clickable evidence references.
- INTERFACES AND DATA CONTRACTS: InsightCard { id, title, summary, confidence, evidenceRefs:string[] }.
- EDGE CASES AND ERROR HANDLING: If evidence links are stale, preserve card and mark broken references.
- TEST NOTES: Generated insights must include confidence and at least one valid evidence reference.

TECH-DESIGN:
- DESIGN ID: UC-06.BR-01.ARCH-01.DES-01
- IMPLEMENTATION TASKS: Implement timeline controller and shared playback state; bind map overlays to current playback cursor.
- INTERFACES AND DATA CONTRACTS: PlaybackState { cursorTs, rangeStartTs, rangeEndTs, speed, paused }.
- EDGE CASES AND ERROR HANDLING: Out-of-range scrub positions clamp to valid timeline bounds.
- TEST NOTES: Timeline scrubbing must update map view in the same render cycle.

TECH-DESIGN:
- DESIGN ID: UC-06.BR-02.ARCH-01.DES-01
- IMPLEMENTATION TASKS: Implement runtime theme token system and effects settings controls (animation intensity, visual mode).
- INTERFACES AND DATA CONTRACTS: ThemeConfig { themeId, effectsLevel, contrastMode }.
- EDGE CASES AND ERROR HANDLING: Invalid theme IDs fall back to default command theme.
- TEST NOTES: Theme changes should preserve filters, selected modules, and timeline cursor.

TECH-DESIGN:
- DESIGN ID: UC-07.BR-01.ARCH-01.DES-01
- IMPLEMENTATION TASKS: Implement rule CRUD UI and persistence layer with schema validation/versioning.
- INTERFACES AND DATA CONTRACTS: AlertRule { id, name, enabled, condition, threshold, cooldownMs }.
- EDGE CASES AND ERROR HANDLING: Invalid rule definitions reject save with actionable error messages.
- TEST NOTES: Create/edit/disable/delete flows should persist and reload correctly.

TECH-DESIGN:
- DESIGN ID: UC-07.BR-02.ARCH-01.DES-01
- IMPLEMENTATION TASKS: Build evaluator that executes rules against incoming events; persist alert lifecycle states (triggered, acknowledged, snoozed, escalated).
- INTERFACES AND DATA CONTRACTS: AlertRecord { id, ruleId, triggeredAt, reason, evidenceRefs, state }.
- EDGE CASES AND ERROR HANDLING: Duplicate triggers during cooldown should merge into existing active alert.
- TEST NOTES: Trigger simulation should produce alert metadata and state transition controls.

TECH-DESIGN:
- DESIGN ID: UC-08.BR-01.ARCH-01.DES-01
- IMPLEMENTATION TASKS: Implement drag/resize/reorder interactions using grid engine with collision resolution.
- INTERFACES AND DATA CONTRACTS: WidgetLayout { widgetId, x, y, w, h, zIndex }.
- EDGE CASES AND ERROR HANDLING: Collision conflicts should auto-resolve without overlapping widgets.
- TEST NOTES: Widget manipulations should render instantly and remain stable after rerender.

TECH-DESIGN:
- DESIGN ID: UC-08.BR-02.ARCH-01.DES-01
- IMPLEMENTATION TASKS: Build profile manager for save/load/delete of named layout profiles and bootstrap default profile selection.
- INTERFACES AND DATA CONTRACTS: LayoutProfile { id, name, widgets:WidgetLayout[], createdAt, updatedAt }.
- EDGE CASES AND ERROR HANDLING: Missing widgets in older profiles should be replaced with placeholders.
- TEST NOTES: Switching profiles should restore expected arrangement across restart.

TECH-DESIGN:
- DESIGN ID: UC-09.BR-01.ARCH-01.DES-01
- IMPLEMENTATION TASKS: Implement source health FSM and heartbeat monitor; render source-intelligence panel with status transitions.
- INTERFACES AND DATA CONTRACTS: SourceHealth { sourceId, state, lastSuccessAt, lastFailureAt, latencyMs }.
- EDGE CASES AND ERROR HANDLING: Intermittent heartbeat failures should not immediately force offline state without threshold confirmation.
- TEST NOTES: Inject heartbeat faults and verify online/delayed/degraded/offline transitions.

TECH-DESIGN:
- DESIGN ID: UC-09.BR-02.ARCH-01.DES-01
- IMPLEMENTATION TASKS: Implement confidence model and threshold filter integration for feed and insight query pipelines.
- INTERFACES AND DATA CONTRACTS: ConfidenceScore { value:number, method:string, components:Record<string,number> }.
- EDGE CASES AND ERROR HANDLING: If score unavailable, assign fallback confidence and label as inferred.
- TEST NOTES: Confidence filter should consistently prune feed and insight outputs.

TECH-DESIGN:
- DESIGN ID: UC-10.BR-01.ARCH-01.DES-01
- IMPLEMENTATION TASKS: Implement snapshot capture service for active context (filters, timeframe, map state, selected insights).
- INTERFACES AND DATA CONTRACTS: SnapshotPayload { id, capturedAt, context, selectedModules, notes? }.
- EDGE CASES AND ERROR HANDLING: Snapshot save failure should preserve in-memory context and show retry prompt.
- TEST NOTES: Restored snapshot should reproduce the previously captured dashboard state.

TECH-DESIGN:
- DESIGN ID: UC-10.BR-02.ARCH-01.DES-01
- IMPLEMENTATION TASKS: Implement snapshot history index with list, open, and delete actions plus timestamp sorting.
- INTERFACES AND DATA CONTRACTS: SnapshotHistoryItem { id, capturedAt, label, sizeBytes }.
- EDGE CASES AND ERROR HANDLING: Corrupt snapshot entries should be quarantined and excluded from restore list.
- TEST NOTES: History panel should reflect create/delete operations immediately.

TECH-DESIGN:
- DESIGN ID: UC-11.BR-01.ARCH-01.DES-01
- IMPLEMENTATION TASKS: Implement degraded-mode controller with cached read fallback and per-widget stale badges.
- INTERFACES AND DATA CONTRACTS: DegradedState { active:boolean, affectedSources:string[], sinceTs:number }.
- EDGE CASES AND ERROR HANDLING: If cache missing during outage, render explicit unavailable state with recovery guidance.
- TEST NOTES: Source outage simulation should keep shell interactive and show stale markers.

TECH-DESIGN:
- DESIGN ID: UC-11.BR-02.ARCH-01.DES-01
- IMPLEMENTATION TASKS: Implement reconnect policy manager using exponential backoff + jitter and source-specific recovery hooks.
- INTERFACES AND DATA CONTRACTS: ReconnectPolicy { baseDelayMs, maxDelayMs, jitterRatio, maxAttempts? }.
- EDGE CASES AND ERROR HANDLING: Hard-failing sources should enter cooldown quarantine and avoid endless rapid retries.
- TEST NOTES: Recovery simulation should auto-resume streams without app restart.

TECH-DESIGN:
- DESIGN ID: UC-12.BR-01.ARCH-01.DES-01
- IMPLEMENTATION TASKS: Implement Hero Mode theme assets, cinematic transitions, and readability guardrails for key data surfaces.
- INTERFACES AND DATA CONTRACTS: HeroThemeTokens { palette, glow, typographyScale, overlayRules }.
- EDGE CASES AND ERROR HANDLING: If Hero assets fail load, fallback to default mission theme.
- TEST NOTES: Hero Mode enablement must alter visual identity while preserving data legibility.

TECH-DESIGN:
- DESIGN ID: UC-12.BR-02.ARCH-01.DES-01
- IMPLEMENTATION TASKS: Implement accessibility/performance controls for motion, contrast, and optional sound with persisted preferences.
- INTERFACES AND DATA CONTRACTS: AccessibilityPrefs { motion:'full'|'reduced'|'off', contrast:'normal'|'high', sound:boolean }.
- EDGE CASES AND ERROR HANDLING: Invalid persisted preferences should be sanitized to safe defaults.
- TEST NOTES: Control changes should apply instantly and persist across restart.
