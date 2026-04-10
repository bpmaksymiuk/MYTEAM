# Architecture Recommendations — Baldur's Gate

## AR-001 : Use vanilla HTML, CSS, and JavaScript ES modules for the browser-game application shell
- RATIONALE
  The project scope fits the repository's zero-build browser-software convention and avoids introducing bundler overhead before core systems are stable. Native ES modules support clear separation between runtime systems such as state, rendering, content, and rules while remaining easy to serve from ./build.
- NOTES
  Primary entry points should be ./build/index.html, ./build/main.js, and domain modules under ./build/src/.
- RELATED
  BR-001, BR-007, BR-103 | UC-001, UC-003, UC-035
---

## AR-002 : Use the HTML Canvas 2D API for exploration, combat-space, and world-scene rendering
- RATIONALE
  Canvas 2D is the simplest concrete browser API for drawing area backdrops, actor sprites, collision hints, and combat overlays without introducing a heavyweight engine. It fits the isometric-inspired presentation goal while keeping rendering deterministic and testable.
- NOTES
  Use layered drawing order for terrain, props, actors, effects, and selection markers.
- RELATED
  BR-007, BR-008, BR-055, BR-061, BR-067, BR-079, BR-101, BR-103 | UC-003, UC-019, UC-021, UC-023, UC-027, UC-034, UC-035
---

## AR-003 : Use DOM overlay panels for menus, dialogue, inventory, journal, and service interactions
- RATIONALE
  Complex text-heavy interfaces such as character creation, dialogue trees, inventory grids, and journal records are faster to build and easier to test in the DOM than inside Canvas. This separates presentation concerns cleanly: Canvas for the playfield and DOM for information-dense interactions.
- NOTES
  Overlay roots should use accessible focus management and be mounted above the Canvas container.
- RELATED
  BR-001, BR-016, BR-028, BR-031, BR-034, BR-037, BR-039, BR-085, BR-086 | UC-001, UC-006, UC-010, UC-011, UC-012, UC-013, UC-029
---

## AR-004 : Use a finite-state machine pattern for global game flow and chapter transitions
- RATIONALE
  Baldur's Gate spans title, creation, exploration, dialogue, combat, travel, rest, cutscene, and ending states. A finite-state machine makes legal transitions explicit and reduces inconsistent behavior when the same controls are used in multiple contexts.
- NOTES
  Recommended top-level states include title, character-creation, area-exploration, dialogue, combat, world-map, rest-resolution, cutscene, and ending.
- RELATED
  BR-003, BR-022, BR-045, BR-054, BR-063, BR-066, BR-078, BR-081, BR-099, BR-102 | UC-001, UC-008, UC-015, UC-018, UC-021, UC-022, UC-026, UC-027, UC-033, UC-034
---

## AR-005 : Use a centralized reducer-style state store for party, world, and quest state
- RATIONALE
  Multiple systems need to react to shared changes such as quest updates, party composition, time advancement, and reputation shifts. A central state store with explicit action dispatching provides traceable updates and reduces hidden mutation bugs across the large campaign surface.
- NOTES
  Keep normalized slices for protagonist, party members, area instance state, journal, world-map discovery, and campaign flags.
- RELATED
  BR-003, BR-009, BR-018, BR-019, BR-042, BR-069, BR-072, BR-082, BR-105 | UC-001, UC-003, UC-006, UC-007, UC-014, UC-023, UC-024, UC-028, UC-035
---

## AR-006 : Use the browser localStorage API for save slots, settings, and lightweight campaign persistence
- RATIONALE
  localStorage is the most direct browser-native persistence API for a served static game build and is sufficient for save-slot metadata and serialized campaign snapshots in this repository. It avoids server dependencies while enabling load and resume flows.
- NOTES
  Use versioned keys and explicit save-slot envelopes to prevent incompatible deserialization.
- RELATED
  BR-019, BR-034, BR-035, BR-036, BR-082 | UC-007, UC-012, UC-028
---

## AR-007 : Use data-driven content registries in JavaScript modules for areas, NPCs, quests, encounters, and stores
- RATIONALE
  The project must represent many maps, hubs, quest hooks, and expansion locations. Data-driven registries make it possible to add or revise content without rewriting engine logic and are well suited to stage-traceable browser projects.
- NOTES
  Separate content domains into files such as areas.js, npcs.js, quests.js, encounters.js, merchants.js, and chapters.js.
- RELATED
  BR-004, BR-008, BR-043, BR-046, BR-049, BR-052, BR-058, BR-064, BR-068, BR-070, BR-073, BR-076, BR-091, BR-094, BR-097, BR-100 | UC-002, UC-003, UC-015, UC-016, UC-017, UC-018, UC-020, UC-022, UC-023, UC-024, UC-025, UC-026, UC-031, UC-032, UC-033, UC-034
---

## AR-008 : Use a graph-based world-map model with chapter-gated node discovery
- RATIONALE
  World travel depends on discovered destinations, chapter locks, and travel-time connections rather than unrestricted teleportation. A node-and-edge graph captures this directly and cleanly supports hidden nodes, unlock conditions, and interruption points.
- NOTES
  Each node should define discovery conditions, travel neighbors, travel duration, and optional random-encounter hooks.
- RELATED
  BR-010, BR-011, BR-012, BR-058, BR-067, BR-094, BR-102 | UC-004, UC-020, UC-023, UC-032, UC-034
---

## AR-009 : Use a component-based interaction system for containers, doors, traps, loot, and scripted hotspots
- RATIONALE
  Interactables share overlapping capabilities such as locked state, trap state, loot inventory, and trigger scripts. A component-style object model avoids bespoke code per object type while still allowing unique combinations.
- NOTES
  Suggested components include lockable, trapable, lootable, speakable, triggerable, and travel-exit.
- RELATED
  BR-013, BR-014, BR-015, BR-071, BR-092 | UC-005, UC-024, UC-031
---

## AR-010 : Use a branching dialogue-tree pattern with condition evaluators and side-effect actions
- RATIONALE
  Dialogue drives recruitment, quests, rumors, services, and major story reveals. A dialogue tree with explicit conditions and effects is the most maintainable pattern for these branching conversations and keeps narrative logic data-driven.
- NOTES
  Condition evaluators should read quest flags, party composition, reputation, chapter state, and area tags.
- RELATED
  BR-016, BR-017, BR-018, BR-044, BR-047, BR-050, BR-052, BR-074, BR-095 | UC-006, UC-015, UC-016, UC-017, UC-018, UC-025, UC-032
---

## AR-011 : Use a rules-based reputation and reaction subsystem for price modifiers, guard response, and companion tension
- RATIONALE
  Reputation influences multiple systems, including shops, lawful reaction, and companion conflicts. A rules subsystem centralizes those reactions so the same thresholds are applied consistently across services, dialogue, and crime events.
- NOTES
  Implement threshold bands for hostile, poor, neutral, good, and heroic reputation ranges.
- RELATED
  BR-019, BR-020, BR-021, BR-083, BR-087 | UC-007, UC-028, UC-029
---

## AR-012 : Use requestAnimationFrame with a fixed-timestep combat simulation loop for real-time-with-pause encounters
- RATIONALE
  RTWP combat needs continuous animation plus deterministic rule resolution. requestAnimationFrame provides browser-native rendering cadence, while a fixed simulation step prevents frame-rate variance from changing combat outcomes.
- NOTES
  Pause should stop simulation advancement while preserving queued commands and current targets.
- RELATED
  BR-022, BR-023, BR-024, BR-041, BR-047, BR-053, BR-062, BR-076, BR-080, BR-098, BR-101 | UC-008, UC-014, UC-016, UC-018, UC-021, UC-026, UC-027, UC-033, UC-034
---

## AR-013 : Use dedicated rules-engine modules for attacks, spells, status effects, rest recovery, and boss logic
- RATIONALE
  Combat and spell resolution are too stateful to keep inside UI code. Isolated rules modules allow deterministic testing of hit resolution, saving throws, durations, equipment modifiers, and special boss scripting.
- NOTES
  Split the rules layer into combat-rules.js, spell-rules.js, status-rules.js, and rest-rules.js.
- RELATED
  BR-024, BR-025, BR-026, BR-027, BR-029, BR-030, BR-032, BR-033, BR-077, BR-080 | UC-008, UC-009, UC-010, UC-011, UC-026, UC-027
---

## AR-014 : Use an inventory and equipment domain model with slot definitions, stack rules, and merchant transaction services
- RATIONALE
  Items move between the world, characters, stores, and service providers while affecting derived statistics. A dedicated domain model prevents duplication bugs and keeps restrictions, pricing, and reward distribution consistent.
- NOTES
  Represent item templates separately from item instances to support stacks, charges, and identified state.
- RELATED
  BR-015, BR-028, BR-029, BR-030, BR-085, BR-086, BR-087, BR-093 | UC-005, UC-010, UC-029, UC-031
---

## AR-015 : Use an event-bus pattern for quest, journal, chapter, and ending updates
- RATIONALE
  Many unrelated interactions must update journal state or chapter progression after dialogue, combat, or exploration outcomes. An event bus reduces tight coupling by letting systems emit and subscribe to quest and chapter events.
- NOTES
  Recommended event names include questAccepted, questUpdated, chapterAdvanced, locationDiscovered, and campaignCompleted.
- RELATED
  BR-037, BR-038, BR-039, BR-045, BR-054, BR-060, BR-063, BR-066, BR-072, BR-075, BR-078, BR-081, BR-089, BR-090, BR-099, BR-102 | UC-013, UC-015, UC-018, UC-020, UC-021, UC-022, UC-024, UC-025, UC-026, UC-027, UC-030, UC-033, UC-034
---

## AR-016 : Use weighted encounter-table definitions for wilderness threats and rest ambushes
- RATIONALE
  Wilderness and rest interruptions should feel location-specific instead of random noise. Weighted encounter tables allow area identity, chapter scaling, and controlled rare encounters without embedding encounter logic in travel code.
- NOTES
  Tables should include spawn weights, eligibility conditions, and optional flee restrictions.
- RELATED
  BR-033, BR-040, BR-041, BR-042, BR-055, BR-056, BR-061, BR-062, BR-097, BR-101 | UC-011, UC-014, UC-019, UC-021, UC-033, UC-034
---

## AR-017 : Use a party-companion subsystem with recruitment contracts, dismissal persistence, and loyalty rules
- RATIONALE
  Companion management is a core differentiator for Baldur's Gate and intersects with dialogue, quests, and reputation. A dedicated subsystem is required to manage recruitment eligibility, party caps, dismissed locations, and personal objective reactions.
- NOTES
  Companion records should include recruitment state, active status, last known location, personal quest flags, and departure triggers.
- RELATED
  BR-004, BR-005, BR-006, BR-082, BR-083, BR-084 | UC-002, UC-028
---

## AR-018 : Use a district-and-interior area-loader pattern for Baldur's Gate city density
- RATIONALE
  Baldur's Gate city contains multiple districts plus many interiors and quest nodes. A dedicated loader pattern with district metadata and interior child areas keeps urban exploration organized and avoids a single monolithic map structure.
- NOTES
  City districts should expose their own NPC sets, interior registry, and travel exits.
- RELATED
  BR-067, BR-068, BR-069, BR-070, BR-071, BR-073, BR-074, BR-076 | UC-023, UC-024, UC-025, UC-026
---

## AR-019 : Use a reusable dungeon-floor framework with puzzle, trap, and boss hooks for Durlag's Tower and expansion content
- RATIONALE
  Durlag's Tower and expansion questlines depend on layered dungeon progression, trap density, and custom encounter scripting. A reusable floor framework reduces duplication across tower floors, catacombs, mines, island lairs, and cult strongholds.
- NOTES
  Each floor should declare exits, scripted triggers, puzzle checks, and completion milestones.
- RELATED
  BR-065, BR-091, BR-092, BR-093, BR-097, BR-098, BR-100, BR-101 | UC-022, UC-031, UC-033, UC-034
---

## AR-020 : Use the Web Audio API for music, ambience, combat sounds, and interface feedback
- RATIONALE
  Themed audio is explicitly required by the presentation use case and must react to dialogue, exploration, and combat context. The Web Audio API provides browser-native mixing, volume control, and playback coordination without external runtime dependencies.
- NOTES
  Separate channels for music, ambience, voice barks, and interface effects to simplify user controls.
- RELATED
  BR-088, BR-103, BR-104, BR-105 | UC-030, UC-035
---

## AR-021 : Use an asset manifest and preload-cache service for sprites, portraits, area art, and audio assets
- RATIONALE
  Large campaign scope will otherwise cause rendering stalls when areas or dialogue open. A manifest-driven preload service lets the game warm required assets per chapter or area and report missing resources explicitly.
- NOTES
  The manifest should declare type, source path, logical key, and preload priority.
- RELATED
  BR-103, BR-104, BR-105 | UC-035
---

## AR-022 : Use semantic HTML, ARIA labels, and keyboard-focus management for non-canvas interfaces
- RATIONALE
  Character creation, dialogue, inventory, and save/load screens are text-first interfaces that benefit from accessible structure and deterministic keyboard handling. This improves usability and makes tester automation more reliable.
- NOTES
  Apply to menu buttons, form controls, dialogue choices, inventory actions, and save-slot controls.
- RELATED
  BR-001, BR-016, BR-028, BR-034 | UC-001, UC-006, UC-010, UC-012
---

## AR-023 : Use an in-game diagnostics and error-surface pattern for missing content, invalid transitions, and save failures
- RATIONALE
  Large data-driven content projects fail in non-obvious ways when a node, asset, or save payload is malformed. A user-visible diagnostics surface and structured console logging reduce silent failures during development and pipeline testing.
- NOTES
  Error paths should fail safely back to title, current area, or the relevant overlay instead of leaving the game unresponsive.
- RELATED
  BR-003, BR-035, BR-036, BR-105 | UC-001, UC-012, UC-035
---

## AR-024 : Use Playwright 1.59.1 in headful mode for pipeline verification and screenshot evidence capture
- RATIONALE
  The workspace already standardizes on Playwright 1.59.1 and visible-browser testing. Keeping the verification stack aligned with repository policy ensures consistent evidence, reproducible test runs, and append-only pipeline reporting.
- NOTES
  Tests should import from /tmp/node_modules/playwright/index.mjs and write results under ./testresults/.
- RELATED
  BR-001, BR-022, BR-034, BR-103 | UC-001, UC-008, UC-012, UC-035
---