## BG-REL-2026-04-09-002

**Release ID:** BG-REL-2026-04-09-002
**Date:** 2026-04-09
**Stage:** 5 — Implementation

### Summary

Implementation of DI-009, DI-010, DI-013, and DI-014 expanding the early-campaign vertical slice with party dismissal, interactive inventory and equipment, merchant and service flows, map-note visibility, and a clearer Nashkel completion loop. Applied AR-011, AR-014, AR-015, AR-017, and AR-022 architecture decisions.

### Changed Files

- ./build/src/content.js → implemented DI-013, DI-014
- ./build/src/game.js → implemented DI-009, DI-010, DI-013, DI-014
- ./build/style.css → implemented DI-013

### Design Decisions Applied

- AR-011: Reputation-aware service and shop pricing
- AR-014: Inventory, equipment, and merchant transaction model
- AR-015: Journal and map-note event surfacing
- AR-017: Party dismissal persistence and companion-state handling
- AR-022: Overlay-driven, testable UI controls for inventory, party, and services

### Use Cases Implemented / Updated

- UC-002: ✅ PASS
- UC-007: ✅ PASS
- UC-010: ✅ PASS
- UC-013: ✅ PASS
- UC-018: ✅ PASS
- UC-028: ⚠️ PARTIAL — dismissal persistence exists, but companion-specific timed objectives still do not
- UC-029: ✅ PASS

### Browser Requirements Covered

- BR-006: ✅ Implemented
- BR-020: ✅ Implemented
- BR-028: ✅ Implemented
- BR-029: ✅ Implemented
- BR-030: ✅ Implemented
- BR-039: ✅ Implemented
- BR-050: ✅ Implemented
- BR-054: ✅ Implemented
- BR-085: ✅ Implemented
- BR-086: ✅ Implemented
- BR-087: ✅ Implemented

### Implementation Caveats

The runtime now supports early-hub services and interactive inventory, but the overall project still remains a vertical slice relative to the approved full-game scope. Midgame wilderness systems, city districts, expansion arcs, full spellbook behavior, weighted random encounters, and audio presentation remain outside this release.

### Notes

This release narrows several Stage 5 gaps in the early campaign while preserving the prior scope statement that the full 35-use-case project is not yet implemented.

---

## BG-REL-2026-04-09-001

**Release ID:** BG-REL-2026-04-09-001
**Date:** 2026-04-09
**Stage:** 5 — Implementation

### Summary

Implementation of DI-001, DI-002, DI-003, DI-004, DI-005, DI-006, DI-008, DI-009, DI-010, DI-011, DI-012, DI-013, DI-014, and DI-020 enabling an early Baldur's Gate browser prototype. Applied AR-001, AR-002, AR-003, AR-004, AR-005, AR-006, AR-008, AR-010, AR-011, AR-012, AR-013, AR-014, AR-015, AR-017, AR-022, AR-023, and AR-024 architecture decisions.

### Changed Files

- ./build/index.html → implemented DI-001
- ./build/style.css → implemented DI-001, DI-019
- ./build/main.js → implemented DI-001
- ./build/src/content.js → implemented DI-004, DI-006, DI-008, DI-009, DI-014
- ./build/src/storage.js → implemented DI-003
- ./build/src/game.js → implemented DI-002, DI-003, DI-004, DI-005, DI-006, DI-008, DI-009, DI-010, DI-011, DI-012, DI-013, DI-014, DI-020

### Design Decisions Applied

- AR-001: Vanilla HTML, CSS, and JavaScript ES modules for the browser-game shell
- AR-002: Canvas 2D rendering for area scenes and combat presentation
- AR-003: DOM overlay panels for menus, dialogue, journal, and saves
- AR-004: Finite-state game flow across title, creation, exploration, and combat
- AR-005: Centralized runtime state store pattern
- AR-006: localStorage-based save slot persistence
- AR-008: Graph-style world-map discovery and travel gating
- AR-010: Data-driven dialogue branching with conditional effects
- AR-011: Reputation and reaction tracking
- AR-012: Prototype real-time-with-pause combat loop
- AR-013: Rules modules embedded in the current prototype runtime for combat, rest, and spell-like actions
- AR-014: Inventory and service interactions for starter equipment and resting
- AR-015: Journal and quest event propagation through shared game-state updates
- AR-017: Companion recruitment and party-size enforcement
- AR-022: Semantic HTML and testable overlay controls
- AR-023: User-visible logging and safe failure messaging
- AR-024: Stage 6 verification target structure retained for later pipeline work

### Use Cases Implemented / Updated

- UC-001: ✅ PASS
- UC-002: ✅ PASS
- UC-003: ✅ PASS
- UC-004: ✅ PASS
- UC-005: ⚠️ PARTIAL — interaction model is not yet implemented for locks, traps, and container transfer flows
- UC-006: ✅ PASS
- UC-007: ✅ PASS
- UC-008: ✅ PASS
- UC-009: ⚠️ PARTIAL — spellcasting is represented only by prototype queued spell attacks, not a full spellbook system
- UC-010: ⚠️ PARTIAL — inventory is read-only in the sidebar and does not yet support equipment changes
- UC-011: ✅ PASS
- UC-012: ✅ PASS
- UC-013: ✅ PASS
- UC-014: ⚠️ PARTIAL — random wilderness encounters are not yet generated from encounter tables
- UC-015: ✅ PASS
- UC-016: ✅ PASS
- UC-017: ✅ PASS
- UC-018: ⚠️ PARTIAL — Nashkel dialogue and mine encounter exist, but the full mine dungeon and boss-report loop are incomplete
- UC-019: ❌ Not implemented in this release
- UC-020: ❌ Not implemented in this release
- UC-021: ❌ Not implemented in this release
- UC-022: ❌ Not implemented in this release
- UC-023: ❌ Not implemented in this release
- UC-024: ❌ Not implemented in this release
- UC-025: ❌ Not implemented in this release
- UC-026: ❌ Not implemented in this release
- UC-027: ❌ Not implemented in this release
- UC-028: ⚠️ PARTIAL — companion recruitment exists, but companion-specific timed quests do not
- UC-029: ⚠️ PARTIAL — resting exists, but merchant and temple services do not
- UC-030: ⚠️ PARTIAL — lore and rumors are present only through a small dialogue subset
- UC-031: ❌ Not implemented in this release
- UC-032: ❌ Not implemented in this release
- UC-033: ❌ Not implemented in this release
- UC-034: ❌ Not implemented in this release
- UC-035: ⚠️ PARTIAL — the prototype has themed visual presentation but no recreated asset set or audio layer

### Browser Requirements Covered

- BR-001: ✅ Implemented
- BR-003: ✅ Implemented
- BR-004: ✅ Implemented
- BR-005: ✅ Implemented
- BR-006: ⚠️ PARTIAL — recruitment works, dismissed-companion relocation does not yet
- BR-007: ✅ Implemented
- BR-008: ✅ Implemented
- BR-009: ✅ Implemented
- BR-010: ✅ Implemented
- BR-011: ✅ Implemented
- BR-012: ✅ Implemented
- BR-016: ✅ Implemented
- BR-017: ✅ Implemented
- BR-018: ✅ Implemented
- BR-019: ✅ Implemented
- BR-020: ⚠️ PARTIAL — reputation is tracked, but merchant pricing reactions are not yet exposed
- BR-022: ✅ Implemented
- BR-023: ✅ Implemented
- BR-024: ✅ Implemented
- BR-025: ⚠️ PARTIAL — combat supports queued spell actions without a full action list per class
- BR-028: ⚠️ PARTIAL — inventory display exists without manipulation flows
- BR-031: ✅ Implemented
- BR-034: ✅ Implemented
- BR-035: ✅ Implemented
- BR-036: ✅ Implemented
- BR-037: ✅ Implemented
- BR-038: ✅ Implemented
- BR-039: ⚠️ PARTIAL — journal exists, dedicated map-note view does not yet
- BR-043: ✅ Implemented
- BR-044: ✅ Implemented
- BR-045: ✅ Implemented
- BR-046: ✅ Implemented
- BR-047: ✅ Implemented
- BR-048: ✅ Implemented
- BR-049: ✅ Implemented
- BR-050: ⚠️ PARTIAL — Beregost contains dialogue outcomes without full combat-resolution branching
- BR-052: ✅ Implemented
- BR-067: ❌ Not implemented in this release
- BR-091: ❌ Not implemented in this release
- BR-103: ⚠️ PARTIAL — themed presentation exists, but not a complete asset and audio package
- BR-104: ❌ Not implemented in this release
- BR-105: ❌ Not implemented in this release

### Implementation Caveats

This release is an intentional vertical slice, not a full implementation of the approved 35-use-case design. The runtime currently covers title flow, protagonist creation, early-area exploration, dialogue, journal, save and load, world-map travel between early hubs, companion recruitment, resting, and two prototype combat encounters. Midgame, city, endgame, expansion, full inventory, merchant services, random encounters, complete spell systems, and audio presentation remain unimplemented.

The pipeline requires implementation caveats to be mirrored back into 1-USE-CASES.md, but that artifact is user-owned. To preserve artifact ownership, this caveat is recorded here and surfaced in the pipeline handoff instead of directly editing the Stage 1 file.

### Notes

The local prototype was served successfully over HTTP on port 9010 for runtime inspection. This release is sufficient for a narrow Stage 5 proof of architecture, but it does not satisfy the Stage 5 exit gate for the full approved scope.

---