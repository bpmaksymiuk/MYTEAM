# Parts List — Baldur's Gate

## PT-001 : Application Shell
- DESCRIPTION
  Hosts the page layout, canvas container, overlay roots, and bootstraps the runtime modules for the browser game.
- TECHNOLOGY RECOMMENDATIONS
  AR-001 (vanilla HTML/CSS/ES modules), AR-003 (DOM overlay panels), AR-022 (semantic HTML)
- NOTES
  Expected files include ./build/index.html, ./build/main.js, and top-level stylesheet assets.
- RELATED
  UC-001, UC-003, UC-035 | BR-001, BR-007, BR-103 | AR-001, AR-003, AR-022
---

## PT-002 : Global State Store
- DESCRIPTION
  Maintains normalized campaign state for protagonist, party, quests, chapter, reputation, discovered locations, and active UI mode.
- TECHNOLOGY RECOMMENDATIONS
  AR-004 (finite-state machine), AR-005 (reducer-style state store), AR-023 (diagnostics surface)
- NOTES
  Should expose getState, dispatch, subscribe, and state-serialization helpers.
- RELATED
  UC-001, UC-003, UC-007, UC-013 | BR-003, BR-009, BR-019, BR-037 | AR-004, AR-005, AR-023
---

## PT-003 : Save And Persistence Service
- DESCRIPTION
  Serializes and restores campaign snapshots, save-slot metadata, and lightweight settings using browser persistence.
- TECHNOLOGY RECOMMENDATIONS
  AR-006 (localStorage persistence), AR-023 (safe error handling)
- NOTES
  Should version payloads and reject incompatible save formats safely.
- RELATED
  UC-007, UC-012, UC-028 | BR-019, BR-034, BR-035, BR-036, BR-082 | AR-006, AR-023
---

## PT-004 : Content Registry
- DESCRIPTION
  Stores declarative definitions for areas, NPCs, companions, quests, encounters, merchants, chapters, and expansion hooks.
- TECHNOLOGY RECOMMENDATIONS
  AR-007 (data-driven content registries), AR-015 (event bus integration)
- NOTES
  Should be split by content domain to keep file boundaries manageable.
- RELATED
  UC-002, UC-015, UC-023, UC-031, UC-034 | BR-004, BR-043, BR-068, BR-091, BR-100 | AR-007, AR-015
---

## PT-005 : Area Renderer
- DESCRIPTION
  Draws terrain, props, actors, selection rings, overlays, and animation effects for the active playfield.
- TECHNOLOGY RECOMMENDATIONS
  AR-002 (Canvas 2D rendering), AR-021 (asset preload and cache)
- NOTES
  Should support area-specific art layers and actor depth ordering.
- RELATED
  UC-003, UC-019, UC-021, UC-023, UC-035 | BR-007, BR-055, BR-061, BR-067, BR-103 | AR-002, AR-021
---

## PT-006 : World Map Service
- DESCRIPTION
  Manages discovered destinations, graph traversal, chapter locks, travel time, and interruption hooks for overland movement.
- TECHNOLOGY RECOMMENDATIONS
  AR-008 (graph-based world map), AR-016 (weighted encounters)
- NOTES
  Must integrate with chapter progression and area discovery events.
- RELATED
  UC-004, UC-019, UC-020, UC-032, UC-034 | BR-010, BR-011, BR-012, BR-058, BR-094, BR-102 | AR-008, AR-016
---

## PT-007 : Interaction System
- DESCRIPTION
  Resolves user interactions with doors, containers, traps, ground loot, scripted triggers, and service points.
- TECHNOLOGY RECOMMENDATIONS
  AR-009 (component-based interactables), AR-014 (inventory domain model)
- NOTES
  Interaction resolution should delegate to specialized handlers by component type.
- RELATED
  UC-005, UC-024, UC-031 | BR-013, BR-014, BR-015, BR-071, BR-092 | AR-009, AR-014
---

## PT-008 : Dialogue Engine
- DESCRIPTION
  Presents conversations, evaluates branch conditions, applies dialogue effects, and coordinates recruitment and quest updates.
- TECHNOLOGY RECOMMENDATIONS
  AR-003 (DOM overlay UI), AR-010 (branching dialogue trees), AR-015 (event bus)
- NOTES
  Needs support for speaker identity, response lists, conditional visibility, and side-effect dispatch.
- RELATED
  UC-006, UC-015, UC-016, UC-017, UC-018, UC-025, UC-032 | BR-016, BR-017, BR-018, BR-044, BR-047, BR-052, BR-074, BR-095 | AR-003, AR-010, AR-015
---

## PT-009 : Reputation And Crime Service
- DESCRIPTION
  Tracks party reputation, computes shop modifiers, and triggers guard or hostile responses to criminal acts.
- TECHNOLOGY RECOMMENDATIONS
  AR-011 (reputation subsystem), AR-015 (event bus)
- NOTES
  Should expose threshold helpers for merchants, dialogue, and companion reaction checks.
- RELATED
  UC-007, UC-028, UC-029 | BR-019, BR-020, BR-021, BR-083, BR-087 | AR-011, AR-015
---

## PT-010 : Party And Companion Manager
- DESCRIPTION
  Handles party membership, recruitment, dismissal, ordering, dismissed-companion persistence, and personal objective tracking.
- TECHNOLOGY RECOMMENDATIONS
  AR-017 (companion subsystem), AR-005 (central state store)
- NOTES
  Must enforce party-size rules and maintain dismissed location data.
- RELATED
  UC-002, UC-028 | BR-004, BR-005, BR-006, BR-082, BR-083, BR-084 | AR-017, AR-005
---

## PT-011 : Combat Engine
- DESCRIPTION
  Runs encounter simulation, pause and resume control, target assignment, attack cadence, and encounter completion logic.
- TECHNOLOGY RECOMMENDATIONS
  AR-012 (fixed-timestep combat loop), AR-013 (rules-engine modules)
- NOTES
  Should separate simulation timing from UI command presentation.
- RELATED
  UC-008, UC-014, UC-016, UC-018, UC-021, UC-026, UC-027, UC-033, UC-034 | BR-022, BR-023, BR-024, BR-041, BR-053, BR-062, BR-076, BR-080, BR-098, BR-101 | AR-012, AR-013
---

## PT-012 : Spell And Status Rules Module
- DESCRIPTION
  Applies memorization, slot checks, saving throws, status durations, heal effects, and special abilities.
- TECHNOLOGY RECOMMENDATIONS
  AR-013 (rules-engine modules)
- NOTES
  Should remain callable by combat, rest, item-use, and scripted encounter systems.
- RELATED
  UC-009, UC-011, UC-026, UC-027 | BR-025, BR-026, BR-027, BR-032, BR-033, BR-077, BR-080 | AR-013
---

## PT-013 : Inventory, Equipment, And Merchant Service
- DESCRIPTION
  Represents item instances, equipment slots, stack handling, transaction rules, and store-service operations.
- TECHNOLOGY RECOMMENDATIONS
  AR-014 (inventory domain model), AR-011 (reputation-based price rules)
- NOTES
  Covers buying, selling, identification, healing, resurrection, donation, and lodging services.
- RELATED
  UC-005, UC-010, UC-029, UC-031 | BR-015, BR-028, BR-029, BR-030, BR-085, BR-086, BR-087, BR-093 | AR-014, AR-011
---

## PT-014 : Journal And Quest Tracker
- DESCRIPTION
  Stores active and completed quests, map notes, story summaries, and chapter-state-facing journal text.
- TECHNOLOGY RECOMMENDATIONS
  AR-003 (DOM overlays), AR-015 (event bus)
- NOTES
  Should subscribe to questAccepted, questUpdated, and chapterAdvanced events.
- RELATED
  UC-013, UC-020, UC-022, UC-024, UC-025, UC-026, UC-027, UC-030, UC-033, UC-034 | BR-037, BR-038, BR-039, BR-060, BR-066, BR-072, BR-075, BR-078, BR-081, BR-089, BR-090, BR-099, BR-102 | AR-003, AR-015
---

## PT-015 : Encounter Director
- DESCRIPTION
  Selects, spawns, and resolves wilderness encounters, rest ambushes, and travel interruptions based on area context.
- TECHNOLOGY RECOMMENDATIONS
  AR-016 (weighted encounter tables), AR-012 (combat loop)
- NOTES
  Should support optional avoid or flee logic when encounter rules allow it.
- RELATED
  UC-011, UC-014, UC-019, UC-021, UC-033, UC-034 | BR-033, BR-040, BR-041, BR-042, BR-055, BR-056, BR-061, BR-062, BR-097, BR-101 | AR-016, AR-012
---

## PT-016 : Chapter Director
- DESCRIPTION
  Controls prologue progression, chapter unlocks, major cutscenes, and final campaign completion sequencing.
- TECHNOLOGY RECOMMENDATIONS
  AR-004 (finite-state machine), AR-015 (event bus), AR-007 (chapter content registry)
- NOTES
  Must coordinate Gorion's death, mine completion, Cloakwood resolution, palace crisis, and ending sequence.
- RELATED
  UC-015, UC-016, UC-018, UC-020, UC-021, UC-022, UC-025, UC-026, UC-027, UC-033, UC-034 | BR-044, BR-045, BR-046, BR-054, BR-063, BR-066, BR-075, BR-078, BR-081, BR-099, BR-102 | AR-004, AR-007, AR-015
---

## PT-017 : Candlekeep And Early-Hub Content Pack
- DESCRIPTION
  Contains the authored content, NPC definitions, and scripted events for Candlekeep, the ambush road, Friendly Arm Inn, Beregost, and Nashkel.
- TECHNOLOGY RECOMMENDATIONS
  AR-007 (content registries), AR-010 (dialogue trees), AR-012 (combat loop)
- NOTES
  Acts as the early vertical slice for the main campaign.
- RELATED
  UC-015, UC-016, UC-017, UC-018 | BR-043, BR-044, BR-046, BR-047, BR-049, BR-050, BR-052, BR-053, BR-054 | AR-007, AR-010, AR-012
---

## PT-018 : Wilderness And Travel Content Pack
- DESCRIPTION
  Contains southern wilderness, coast, bandit-camp, and Cloakwood content definitions plus travel-gated discovery rules.
- TECHNOLOGY RECOMMENDATIONS
  AR-007 (content registries), AR-008 (world-map graph), AR-016 (encounter tables)
- NOTES
  Should cover optional exploration and chapter-critical path areas.
- RELATED
  UC-019, UC-020, UC-021 | BR-055, BR-056, BR-057, BR-058, BR-059, BR-060, BR-061, BR-062, BR-063 | AR-007, AR-008, AR-016
---

## PT-019 : City District Content Pack
- DESCRIPTION
  Defines Baldur's Gate districts, interiors, side quests, Iron Throne investigation sites, and the Ducal Palace crisis.
- TECHNOLOGY RECOMMENDATIONS
  AR-018 (district-and-interior loader), AR-007 (content registries), AR-010 (dialogue trees)
- NOTES
  Needs district-level navigation and high quest density.
- RELATED
  UC-023, UC-024, UC-025, UC-026 | BR-067, BR-068, BR-069, BR-070, BR-071, BR-072, BR-073, BR-074, BR-075, BR-076, BR-077, BR-078 | AR-018, AR-007, AR-010
---

## PT-020 : Endgame Content Pack
- DESCRIPTION
  Defines Undercity approach areas, final temple battle scripting, Sarevok encounter data, and ending presentation.
- TECHNOLOGY RECOMMENDATIONS
  AR-012 (combat loop), AR-013 (boss rules), AR-015 (campaign completion events)
- NOTES
  Must coordinate final-battle ally behavior and ending-state dispatch.
- RELATED
  UC-027 | BR-079, BR-080, BR-081 | AR-012, AR-013, AR-015
---

## PT-021 : Expansion Hub And Dungeon Pack
- DESCRIPTION
  Contains Ulgoth's Beard, Durlag's Tower, cult locations, and Werewolf Island content definitions and progression hooks.
- TECHNOLOGY RECOMMENDATIONS
  AR-019 (dungeon-floor framework), AR-007 (content registries), AR-016 (encounter tables)
- NOTES
  Should preserve expansion-hub reuse while side arcs remain open.
- RELATED
  UC-031, UC-032, UC-033, UC-034 | BR-091, BR-092, BR-093, BR-094, BR-095, BR-096, BR-097, BR-098, BR-099, BR-100, BR-101, BR-102 | AR-019, AR-007, AR-016
---

## PT-022 : Presentation And Audio Layer
- DESCRIPTION
  Loads portraits, sprites, area art, music, ambience, voice cues, and interface feedback across gameplay contexts.
- TECHNOLOGY RECOMMENDATIONS
  AR-020 (Web Audio API), AR-021 (asset manifest and preload cache), AR-002 (Canvas 2D)
- NOTES
  Should support themed transitions between title, exploration, dialogue, and combat.
- RELATED
  UC-030, UC-035 | BR-088, BR-103, BR-104, BR-105 | AR-020, AR-021, AR-002
---

## PT-023 : Diagnostics Overlay
- DESCRIPTION
  Displays recoverable runtime errors, missing-content warnings, and save/load failures in a controlled developer-facing surface.
- TECHNOLOGY RECOMMENDATIONS
  AR-023 (diagnostics and error surface)
- NOTES
  Intended for development and pipeline verification, not final player-facing lore UI.
- RELATED
  UC-001, UC-012, UC-035 | BR-003, BR-035, BR-036, BR-105 | AR-023
---

## PT-024 : Pipeline Test Harness
- DESCRIPTION
  Provides headful Playwright verification, screenshot capture, and results.json emission for Stage 6 evidence.
- TECHNOLOGY RECOMMENDATIONS
  AR-024 (Playwright 1.59.1 headful testing)
- NOTES
  Expected artifact is bg_test_pipeline001.mjs with outputs under ./testresults/.
- RELATED
  UC-001, UC-008, UC-012, UC-035 | BR-001, BR-022, BR-034, BR-103 | AR-024
---