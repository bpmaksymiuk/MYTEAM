CURRENT REQUIREMENTS STATUS:
- DATE: 2026-04-01
- AUTHORITATIVE IMPLEMENTATION STATE: UC-01 through UC-12 baseline requirements are implemented and validated in current pipeline execution (T-PIPELINE-008 PASS).
- DOCUMENT INTENT: Requirement entries below remain normative product requirements and are now treated as implemented baseline scope.

BUSINESS REQUIREMENT:
- BR ID: UC-01.BR-01
- REQUIREMENT STATEMENT: The solution shall launch from Chrome into a standalone popup window that behaves like a desktop command console.
- PRIORITY: High
- TESTABLE CONDITION: Clicking the extension action opens a dedicated popup window and does not open a new browser tab.

BUSINESS REQUIREMENT:
- BR ID: UC-01.BR-02
- REQUIREMENT STATEMENT: The initial dashboard shell shall render mission-control modules (map, feed stream, KPI strip, alert rail) on first load.
- PRIORITY: High
- TESTABLE CONDITION: First render displays all required modules and each section is interactive.

BUSINESS REQUIREMENT:
- BR ID: UC-02.BR-01
- REQUIREMENT STATEMENT: The dashboard shall ingest and display realtime or near-realtime Ukraine-focused news and event streams from configured sources.
- PRIORITY: High
- TESTABLE CONDITION: Feed entries appear automatically over time without manual refresh.

BUSINESS REQUIREMENT:
- BR ID: UC-02.BR-02
- REQUIREMENT STATEMENT: Feed entries shall include source metadata, timestamps, category tags, and deduplication handling.
- PRIORITY: High
- TESTABLE CONDITION: Duplicate events are collapsed/marked and entries show required metadata fields.

BUSINESS REQUIREMENT:
- BR ID: UC-03.BR-01
- REQUIREMENT STATEMENT: The dashboard shall provide configurable market and economy indicator cards with trend visualizations.
- PRIORITY: High
- TESTABLE CONDITION: Selected indicators update at configured intervals and show value plus directional change.

BUSINESS REQUIREMENT:
- BR ID: UC-03.BR-02
- REQUIREMENT STATEMENT: The system shall surface unavailable or stale indicator data with explicit status messages.
- PRIORITY: Medium
- TESTABLE CONDITION: Simulated source delay displays stale/unavailable state instead of empty content.

BUSINESS REQUIREMENT:
- BR ID: UC-04.BR-01
- REQUIREMENT STATEMENT: The dashboard shall provide a Drone Intelligence panel supporting multi-dimension filtering (count, type, region, timeframe).
- PRIORITY: High
- TESTABLE CONDITION: Changing filters updates drone aggregates and charts consistently.

BUSINESS REQUIREMENT:
- BR ID: UC-04.BR-02
- REQUIREMENT STATEMENT: Drone aggregates shall expose source provenance and stale-data indicators.
- PRIORITY: High
- TESTABLE CONDITION: Each aggregate panel shows source reference and stale state when a feed is delayed.

BUSINESS REQUIREMENT:
- BR ID: UC-05.BR-01
- REQUIREMENT STATEMENT: The system shall compute cross-feed pattern and anomaly insights using at least two feed families.
- PRIORITY: High
- TESTABLE CONDITION: Pattern engine returns insight cards when enabled with multi-feed inputs.

BUSINESS REQUIREMENT:
- BR ID: UC-05.BR-02
- REQUIREMENT STATEMENT: Insight cards shall include confidence strength and links to underlying evidence records.
- PRIORITY: High
- TESTABLE CONDITION: Each generated insight displays a score and traceable source links.

BUSINESS REQUIREMENT:
- BR ID: UC-06.BR-01
- REQUIREMENT STATEMENT: The dashboard shall synchronize tactical map playback with timeline scrubbing.
- PRIORITY: High
- TESTABLE CONDITION: Timeline movement updates map overlays/markers in lockstep.

BUSINESS REQUIREMENT:
- BR ID: UC-06.BR-02
- REQUIREMENT STATEMENT: The user shall be able to switch cinematic visual themes and effect intensity without resetting analysis context.
- PRIORITY: Medium
- TESTABLE CONDITION: Theme/intensity changes apply live and preserve active filters/time window.

BUSINESS REQUIREMENT:
- BR ID: UC-07.BR-01
- REQUIREMENT STATEMENT: The system shall support full lifecycle management of alert rules (create, edit, disable, delete).
- PRIORITY: High
- TESTABLE CONDITION: User can execute each rule lifecycle action and observe immediate persistence.

BUSINESS REQUIREMENT:
- BR ID: UC-07.BR-02
- REQUIREMENT STATEMENT: Triggered alerts shall include reason, timestamp, and evidence links with acknowledge/snooze controls.
- PRIORITY: High
- TESTABLE CONDITION: Triggering an alert produces a record containing required metadata and state controls.

BUSINESS REQUIREMENT:
- BR ID: UC-08.BR-01
- REQUIREMENT STATEMENT: The dashboard shall support drag/resize/reorder customization of widget layout.
- PRIORITY: Medium
- TESTABLE CONDITION: Widget placement changes are applied immediately and reflected in the current session.

BUSINESS REQUIREMENT:
- BR ID: UC-08.BR-02
- REQUIREMENT STATEMENT: The system shall persist and restore multiple named layout profiles.
- PRIORITY: High
- TESTABLE CONDITION: Saved profiles can be switched and restored across application restarts.

BUSINESS REQUIREMENT:
- BR ID: UC-09.BR-01
- REQUIREMENT STATEMENT: The system shall maintain source health states and freshness metadata for each feed.
- PRIORITY: High
- TESTABLE CONDITION: Source panel shows live status transitions (online, delayed, degraded, offline).

BUSINESS REQUIREMENT:
- BR ID: UC-09.BR-02
- REQUIREMENT STATEMENT: Confidence scoring shall be available as a filterable attribute across feed and insight views.
- PRIORITY: High
- TESTABLE CONDITION: Applying minimum confidence threshold changes visible records consistently.

BUSINESS REQUIREMENT:
- BR ID: UC-10.BR-01
- REQUIREMENT STATEMENT: The dashboard shall create mission snapshots that capture visual state, filters, timeframe, and selected insights.
- PRIORITY: High
- TESTABLE CONDITION: Restoring a snapshot reproduces the captured state accurately.

BUSINESS REQUIREMENT:
- BR ID: UC-10.BR-02
- REQUIREMENT STATEMENT: Snapshot management shall include timestamped history and deletion controls.
- PRIORITY: Medium
- TESTABLE CONDITION: User can view and delete previously saved snapshots.

BUSINESS REQUIREMENT:
- BR ID: UC-11.BR-01
- REQUIREMENT STATEMENT: The system shall run in degraded mode during partial source/network outage while preserving shell responsiveness.
- PRIORITY: High
- TESTABLE CONDITION: Simulated feed outages do not crash the dashboard and stale markers appear.

BUSINESS REQUIREMENT:
- BR ID: UC-11.BR-02
- REQUIREMENT STATEMENT: The system shall perform controlled reconnect/backoff and auto-recover data streams after outage.
- PRIORITY: High
- TESTABLE CONDITION: Recovery occurs without full app restart and reconnect attempts follow configured policy.

BUSINESS REQUIREMENT:
- BR ID: UC-12.BR-01
- REQUIREMENT STATEMENT: Hero Mode shall provide a distinct cinematic visual identity while preserving readability and interaction clarity.
- PRIORITY: Medium
- TESTABLE CONDITION: Enabling Hero Mode changes visual language and keeps key text/data legible.

BUSINESS REQUIREMENT:
- BR ID: UC-12.BR-02
- REQUIREMENT STATEMENT: Hero Mode shall include accessibility and performance controls for motion, contrast, and optional sound cues.
- PRIORITY: High
- TESTABLE CONDITION: User can toggle motion/contrast/sound settings and observe immediate behavior changes.
