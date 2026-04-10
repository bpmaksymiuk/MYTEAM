# Design Instructions — Baldur's Gate

## DI-001 : Scaffold The Browser-Game Build Structure
- SUMMARY
  Establish the zero-build browser application shell, source-module layout, and shared runtime entry points that all later systems depend on. This instruction enables the baseline app boot, UI mounting, and code traceability required by the architecture.
- IMPLEMENTATION STEPS
  1. Create ./build/index.html with a top-level #app root, a canvas container, overlay roots, and script/module tags for ./main.js.
  2. Create ./build/style.css defining layout tokens, layered UI regions, parchment-style panels, button states, and screen-specific classes.
  3. Create ./build/main.js as the runtime bootstrapper that imports src/app-shell.js and src/bootstrap.js.
  4. Create ./build/src/ with subfolders app, content, engine, rules, services, state, ui, and util.
  5. In ./build/src/bootstrap.js, export an async function bootstrapGame() that initializes content registries, preload services, the state store, and the app shell.
  6. In ./build/src/app/app-shell.js, export createAppShell({ root, store }) that mounts the canvas region, overlay layers, and diagnostics region.
  7. Add a simple fatal-error path that renders a readable message inside the root if bootstrap fails.
- SKILLSET REQUIRED
  JavaScript ES modules, semantic HTML, CSS architecture, browser bootstrapping
- NOTES
  Keep all runtime code under ./build and reserve asset directories for later instructions.
- RELATED
  UC-001, UC-003, UC-035 | BR-001, BR-007, BR-103 | AR-001, AR-003, AR-022
---

## DI-002 : Implement The Global State Store And Top-Level Game State Machine
- SUMMARY
  Build the normalized state store and explicit top-level game states that coordinate title, creation, exploration, dialogue, combat, world travel, rest, and ending flows. This is the behavioral backbone for cross-system consistency.
- IMPLEMENTATION STEPS
  1. Create ./build/src/state/store.js exporting createStore(initialState), dispatch(action), getState(), and subscribe(listener).
  2. Create ./build/src/state/initial-state.js with slices for ui, protagonist, party, world, quests, journal, reputation, saves, audio, and diagnostics.
  3. Create ./build/src/state/reducer.js with action handlers such as START_NEW_GAME, CONFIRM_PROTAGONIST, ENTER_AREA, START_DIALOGUE, START_COMBAT, ADVANCE_CHAPTER, COMPLETE_QUEST, and SAVE_GAME_SUCCESS.
  4. Create ./build/src/state/game-mode.js that defines the legal top-level modes and helper guards such as canOpenWorldMap(state) and canEnterCombat(state).
  5. Enforce mode transitions in one place instead of scattering state mutations through UI modules.
  6. Add unit-style helper functions that validate required data before entering a new mode and dispatch diagnostics on invalid transitions.
- SKILLSET REQUIRED
  State management, finite-state-machine design, JavaScript module architecture
- NOTES
  Avoid direct mutation of nested state outside the reducer and keep action payloads serializable.
- RELATED
  UC-001, UC-003, UC-006, UC-008, UC-012, UC-015, UC-027 | BR-003, BR-009, BR-018, BR-022, BR-045, BR-081 | AR-004, AR-005, AR-023
---

## DI-003 : Implement Save Slots, Settings Persistence, And Campaign Serialization
- SUMMARY
  Add browser persistence for save/load and lightweight settings using versioned localStorage envelopes. This instruction enables campaign continuity and protects the project from opaque persistence failures.
- IMPLEMENTATION STEPS
  1. Create ./build/src/services/storage-service.js exposing listSaveSlots(), saveToSlot(slotId, snapshot), loadFromSlot(slotId), and deleteSlot(slotId).
  2. Create ./build/src/services/serialization.js that converts normalized runtime state to a plain JSON-safe save payload and back.
  3. Store save slots under namespaced keys such as bg:save:001 and settings under bg:settings.
  4. Add version fields to each save payload and reject unsupported versions with a user-visible diagnostic.
  5. Create ./build/src/ui/save-load-overlay.js with named save slots, metadata rows, overwrite confirmation, and load actions.
  6. When saving, capture chapter, area id, in-game time, party roster, protagonist name, and journal summary metadata.
  7. After loading, dispatch a single LOAD_CAMPAIGN action that rebuilds the active scene from restored state.
- SKILLSET REQUIRED
  Browser storage APIs, serialization design, defensive error handling, UI flows
- NOTES
  Do not store functions, DOM references, or transient renderer handles in the serialized state.
- RELATED
  UC-007, UC-012, UC-028 | BR-019, BR-034, BR-035, BR-036, BR-082 | AR-006, AR-023, AR-022
---

## DI-004 : Build The Title Screen And Character Creation Flow
- SUMMARY
  Deliver the official new-game entry point and protagonist-creation experience, including legal validation and persistence into party state. This is the first complete player-facing flow in the campaign.
- IMPLEMENTATION STEPS
  1. Create ./build/src/ui/title-screen.js with New Game, Load Game, Options, and Credits actions.
  2. Create ./build/src/ui/character-creation.js containing steps for identity, ancestry, class, alignment, appearance, attributes, and confirmation.
  3. Create ./build/src/content/character-options.js with allowed races, classes, alignments, portraits, and starter kits.
  4. Create ./build/src/rules/character-rules.js with validateCharacterChoice(choiceSet) and generateStarterLoadout(characterSummary).
  5. On confirm, dispatch CONFIRM_PROTAGONIST with a canonical protagonist payload and seed the party roster with the protagonist as leader.
  6. Block invalid combinations with inline validation text near the offending selection rather than a generic failure banner.
  7. After success, transition to the Candlekeep prologue scene and journal onboarding entry.
- SKILLSET REQUIRED
  Form-driven UI design, browser validation patterns, game-rules modeling
- NOTES
  Keep random stat rolling deterministic per click and separate from final confirmation logic.
- RELATED
  UC-001, UC-015 | BR-001, BR-002, BR-003, BR-043 | AR-003, AR-013, AR-022
---

## DI-005 : Implement The Area Renderer, Movement Input, And Collision Model
- SUMMARY
  Build the core exploration layer that displays areas, moves the party, respects collision boundaries, and transitions into interactable and hostile contexts. This is the foundational playfield behavior for most use cases.
- IMPLEMENTATION STEPS
  1. Create ./build/src/engine/scene-renderer.js to draw background, props, actors, selection markers, and transient effects on the canvas.
  2. Create ./build/src/engine/input-controller.js handling click-to-move, hover targeting, and keyboard shortcuts for pause, journal, and map.
  3. Create ./build/src/engine/navigation.js with path segments, blocked regions, and simple waypoint routing; expose movePartyTo(worldX, worldY).
  4. Create ./build/src/content/areas.js where each area record declares dimensions, collision regions, travel exits, NPC placements, and scene asset references.
  5. When movement reaches a travel exit, dispatch ENTER_AREA with the destination area id and preserve party status from state.
  6. Add support for district, wilderness, dungeon, and interior area categories so scene loading can branch on presentation needs.
  7. Render a fallback debug grid and collision overlay toggle for diagnostics during development.
- SKILLSET REQUIRED
  Canvas rendering, game input handling, collision modeling, spatial logic
- NOTES
  Start with polygon or rectangle collision regions before attempting more complex navigation meshes.
- RELATED
  UC-003, UC-019, UC-021, UC-023, UC-027 | BR-007, BR-008, BR-009, BR-055, BR-061, BR-067, BR-079 | AR-002, AR-005, AR-018
---

## DI-006 : Implement World Map Discovery, Travel Timing, And Chapter Gating
- SUMMARY
  Add the graph-based world map that unlocks destinations through exploration and story progress, advances time, and supports interrupted travel. This makes the macro-structure of the campaign navigable.
- IMPLEMENTATION STEPS
  1. Create ./build/src/content/world-map.js defining nodes, neighbor edges, discovery rules, travel times, and chapter prerequisites.
  2. Create ./build/src/services/world-map-service.js with discoverLocation(id), canTravelTo(id), listAvailableDestinations(), and travelTo(id).
  3. Create ./build/src/ui/world-map-overlay.js to render discovered nodes, hidden-node placeholders if needed, and travel summaries.
  4. When travel begins, dispatch a TRAVEL_STARTED action, advance in-game time, and evaluate encounter-table hooks before loading the destination.
  5. Lock undiscovered or gated nodes at the service layer even if a UI bug exposes them visually.
  6. Record first-time discoveries so the journal and map notes update once per relevant location.
- SKILLSET REQUIRED
  Graph modeling, service-layer design, UI overlay implementation, game progression logic
- NOTES
  Keep node ids stable because they will be referenced by quests and chapter scripts.
- RELATED
  UC-004, UC-020, UC-023, UC-032, UC-034 | BR-010, BR-011, BR-012, BR-058, BR-067, BR-094, BR-102 | AR-008, AR-015, AR-016
---

## DI-007 : Implement Interactions For Doors, Containers, Traps, Locks, And Ground Loot
- SUMMARY
  Provide a reusable interaction pipeline for world objects that can be opened, unlocked, disarmed, looted, or triggered. This instruction supports dungeon content, town interiors, and reward distribution.
- IMPLEMENTATION STEPS
  1. Create ./build/src/engine/interactions.js with resolveInteraction(targetId, actorId, actionType).
  2. Create ./build/src/content/interactables.js or embed interactable definitions inside area content records with component flags.
  3. Implement component handlers for lockable, trapable, lootable, speakable, and travel-exit behaviors.
  4. Route loot transfers through the inventory service rather than mutating world and inventory collections separately.
  5. For trap and lock attempts, call rule helpers that consume the acting character's relevant capability values and produce structured outcomes.
  6. Add visible state changes for opened, emptied, disarmed, or triggered objects so retries behave correctly.
  7. Expose interaction feedback in the overlay log so the user can distinguish failure, success, and partial discovery.
- SKILLSET REQUIRED
  Entity-component design, interaction modeling, inventory integration, rules resolution
- NOTES
  Do not duplicate item instances when looting stacked items or moving gear between party members.
- RELATED
  UC-005, UC-024, UC-031 | BR-013, BR-014, BR-015, BR-071, BR-092 | AR-009, AR-014, AR-019
---

## DI-008 : Build The Dialogue Engine And Conditional Conversation Authoring Format
- SUMMARY
  Implement branching dialogue with condition evaluation and side effects for quest updates, hostility changes, recruitment, and services. Dialogue is a major integration point between authored content and systemic state.
- IMPLEMENTATION STEPS
  1. Create ./build/src/content/dialogues.js with conversation nodes, speaker metadata, response options, conditions, and effects.
  2. Create ./build/src/services/dialogue-service.js with openDialogue(npcId), getCurrentNode(), chooseResponse(responseId), and closeDialogue().
  3. Create ./build/src/ui/dialogue-overlay.js rendering speaker identity, portrait, text, and available responses.
  4. Implement condition evaluators for chapter, quest flags, party composition, reputation thresholds, and companion presence.
  5. Implement dialogue effects that dispatch actions such as ACCEPT_QUEST, REVEAL_LOCATION, MODIFY_REPUTATION, START_COMBAT, OPEN_STORE, and RECRUIT_COMPANION.
  6. Ensure closed or exhausted dialogue branches persist so revisiting an NPC reflects prior choices.
  7. Add fallback handling for missing node ids or invalid branch targets that logs a diagnostic and closes safely.
- SKILLSET REQUIRED
  Data-driven narrative systems, condition evaluation, UI state management
- NOTES
  Keep dialogue content data separate from the renderer so authored conversations remain easy to expand.
- RELATED
  UC-006, UC-015, UC-016, UC-017, UC-018, UC-025, UC-032 | BR-016, BR-017, BR-018, BR-044, BR-047, BR-050, BR-052, BR-074, BR-095 | AR-010, AR-015, AR-017
---

## DI-009 : Implement Party Recruitment, Dismissal, Ordering, And Companion Objectives
- SUMMARY
  Build the party subsystem that enforces party limits, preserves dismissed companion state, and tracks companion-specific obligations and reactions. This supports both normal recruitment and the game's interpersonal pressure systems.
- IMPLEMENTATION STEPS
  1. Create ./build/src/services/party-service.js with recruitCompanion(id), dismissCompanion(id), reorderParty(order), and getActiveParty().
  2. Extend ./build/src/content/npcs.js with companion metadata such as class role, alignment, recruitment location, and personal-objective triggers.
  3. Create ./build/src/services/companion-quest-service.js to track timers, unmet demands, and departure thresholds.
  4. Add a party-management overlay showing current members, reserve or dismissed members, and contextual warnings when recruitment would exceed the cap.
  5. On dismissal, capture last known area id, inventory, health, and active objective state.
  6. Implement reaction checks that can fire after major reputation changes, ignored companion quests, or mutually hostile party compositions.
- SKILLSET REQUIRED
  Party-system design, state management, narrative consequence modeling
- NOTES
  Recruitment decisions should be driven through dialogue actions, not direct UI shortcuts.
- RELATED
  UC-002, UC-007, UC-028 | BR-004, BR-005, BR-006, BR-019, BR-082, BR-083, BR-084 | AR-017, AR-011, AR-005
---

## DI-010 : Implement Journal, Map Notes, Reputation, And Quest Event Plumbing
- SUMMARY
  Provide the cross-cutting infrastructure for recording quests, moving them to completed state, updating map notes, and reacting to reputation-changing actions. This is the traceability layer that keeps long-form campaign content understandable.
- IMPLEMENTATION STEPS
  1. Create ./build/src/services/event-bus.js exposing emit(eventName, payload) and on(eventName, handler).
  2. Create ./build/src/services/journal-service.js to append journal entries, move quests to completed state, and expose filtered journal views.
  3. Create ./build/src/services/reputation-service.js to apply deltas, clamp thresholds, and compute reaction bands.
  4. Create ./build/src/ui/journal-overlay.js and ./build/src/ui/map-notes-overlay.js for readable journal and map display.
  5. Emit quest and chapter events from dialogue, combat, travel, and scripted triggers instead of directly rewriting journal state in those modules.
  6. Update merchant pricing and companion tension by subscribing to reputation changes rather than recalculating ad hoc in each UI.
  7. Add clear journal records for critical path transitions such as Nashkel completion, Cloakwood victory, Candlekeep return, palace crisis, and Sarevok pursuit.
- SKILLSET REQUIRED
  Event-driven architecture, quest-system design, UI overlays, game-state traceability
- NOTES
  Keep journal entry text authored in content modules so story updates remain editable without engine changes.
- RELATED
  UC-007, UC-013, UC-018, UC-020, UC-021, UC-022, UC-024, UC-025, UC-026, UC-027, UC-030, UC-033, UC-034 | BR-019, BR-020, BR-021, BR-037, BR-038, BR-039, BR-054, BR-060, BR-063, BR-066, BR-072, BR-075, BR-078, BR-081, BR-089, BR-090, BR-099, BR-102 | AR-011, AR-015
---

## DI-011 : Implement The Real-Time-With-Pause Combat Loop And Command Queueing
- SUMMARY
  Build the deterministic encounter runtime that starts combat, allows pause and unpause, preserves queued orders, and resolves hostiles and party actions. This enables most mainline and optional danger in the campaign.
- IMPLEMENTATION STEPS
  1. Create ./build/src/engine/combat-loop.js with startCombat(encounter), pauseCombat(), resumeCombat(), queueCommand(actorId, command), and tickCombat(deltaMs).
  2. Create ./build/src/rules/combat-rules.js implementing initiative cadence, attack resolution, damage application, target validation, death checks, and encounter end conditions.
  3. Create ./build/src/ui/combat-overlay.js for pause controls, selected actor commands, target info, and combat log output.
  4. Use requestAnimationFrame for draw cadence and an accumulated fixed-step loop for simulation updates.
  5. Preserve queued commands across pause and resume until the command becomes invalid due to death, loss of target, or explicit replacement.
  6. Define encounter records in content modules with participating enemies, spawn points, AI profiles, and win or lose hooks.
  7. When combat ends, dispatch result events that update loot, journal, chapter triggers, and area hostility state.
- SKILLSET REQUIRED
  Game-loop design, fixed-timestep simulation, combat systems, browser rendering coordination
- NOTES
  Start with a small set of AI profiles such as melee-rush, ranged-kite, caster-support, and boss-anchor.
- RELATED
  UC-008, UC-014, UC-016, UC-018, UC-021, UC-026, UC-027, UC-033, UC-034 | BR-022, BR-023, BR-024, BR-041, BR-047, BR-053, BR-062, BR-076, BR-077, BR-080, BR-098, BR-101 | AR-012, AR-013, AR-019
---

## DI-012 : Implement Spellcasting, Status Effects, Rest Recovery, And Boss-Special Rules
- SUMMARY
  Add spell and ability resolution, slot validation, duration handling, rest-based recovery, and special-case boss scripting. This instruction complements the combat engine and extends it into class identity.
- IMPLEMENTATION STEPS
  1. Create ./build/src/rules/spell-rules.js with canCastSpell(actor, spellId), castSpell(command), and resolveSavingThrow(target, spellEffect).
  2. Create ./build/src/rules/status-rules.js with applyStatus(), tickStatuses(), and clearExpiredStatuses().
  3. Create ./build/src/rules/rest-rules.js for uninterrupted rest recovery, unsafe-rest ambush checks, and recovery calculation.
  4. Create ./build/src/content/spells.js and ./build/src/content/abilities.js to define memorization, targeting, and effect payloads.
  5. Integrate spell availability into the combat and exploration action menus only when the selected actor can legally use the ability.
  6. Add boss-specific rule hooks for palace crisis enemy waves and Sarevok final-battle support behavior.
  7. Surface interruptions, failed casts, saved-against effects, and expired statuses in the combat log.
- SKILLSET REQUIRED
  Rules-engine design, turnless combat modeling, stateful effect handling
- NOTES
  Keep effect resolution data-driven where possible so future spells are added by content, not engine rewrites.
- RELATED
  UC-009, UC-011, UC-026, UC-027 | BR-025, BR-026, BR-027, BR-032, BR-033, BR-077, BR-080 | AR-013, AR-012
---

## DI-013 : Implement Inventory, Equipment Restrictions, Stores, And Service Providers
- SUMMARY
  Deliver inventory browsing, equipment slot rules, transaction handling, and support services such as healing, resurrection, identification, donation, and lodging. This instruction closes the loop between loot, progression, and town economy.
- IMPLEMENTATION STEPS
  1. Create ./build/src/services/inventory-service.js for moving items, stacking, splitting stacks, equipping, and unequipping.
  2. Create ./build/src/rules/equipment-rules.js validating class, race, alignment, and proficiency restrictions.
  3. Create ./build/src/services/merchant-service.js for buy, sell, identify, heal, resurrect, donate, and rentRoom actions.
  4. Create ./build/src/ui/inventory-overlay.js and ./build/src/ui/store-overlay.js with side-by-side inventory panels and service action lists.
  5. Pull price modifiers from the reputation service instead of embedding pricing logic inside the store UI.
  6. Recalculate derived combat statistics after each equipment change before the next command can resolve.
  7. Route lodging actions through the rest rules so safe and unsafe rest outcomes stay consistent.
- SKILLSET REQUIRED
  Inventory-system design, transactional UI flows, rules validation, game-economy modeling
- NOTES
  Use item-template ids plus instance ids so stores and party inventories can share the same base item definitions safely.
- RELATED
  UC-005, UC-010, UC-011, UC-029, UC-031 | BR-015, BR-028, BR-029, BR-030, BR-031, BR-032, BR-085, BR-086, BR-087, BR-093 | AR-014, AR-011, AR-013
---

## DI-014 : Author The Early Campaign Vertical Slice From Candlekeep Through Nashkel Mines
- SUMMARY
  Populate the first major campaign arc with the authored content, scripted sequences, and gating needed to support a meaningful early-game vertical slice. This is the smallest coherent main-quest implementation that proves the runtime architecture.
- IMPLEMENTATION STEPS
  1. Create content files under ./build/src/content/campaign/early/ for candlekeep.js, ambush-road.js, friendly-arm.js, beregost.js, and nashkel.js.
  2. Author NPC placements, dialogue ids, quest hooks, area exits, encounters, and merchant definitions for those locations.
  3. Script Gorion's departure and death as a one-time cutscene transition from Candlekeep to the post-ambush state.
  4. Implement the Friendly Arm assassination encounter, Beregost side-quest starters, and Nashkel objective briefing.
  5. Build Nashkel Mines as a multi-area or multi-floor dungeon culminating in the boss encounter and chapter-advance event.
  6. Add journal entries and world-map unlocks at each main quest milestone.
  7. Confirm that all early-campaign content can be reached from the title screen without developer-only shortcuts.
- SKILLSET REQUIRED
  Narrative content authoring, area scripting, encounter design, quest-state integration
- NOTES
  This instruction should be treated as the first deliverable milestone before wider Sword Coast coverage expands.
- RELATED
  UC-015, UC-016, UC-017, UC-018 | BR-043, BR-044, BR-045, BR-046, BR-047, BR-048, BR-049, BR-050, BR-051, BR-052, BR-053, BR-054 | AR-007, AR-010, AR-012, AR-015
---

## DI-015 : Author The Midgame Wilderness And Cloakwood Content Packs
- SUMMARY
  Extend the campaign with southern wilderness exploration, bandit camp progression, and Cloakwood escalation. This instruction proves the map graph, optional exploration, and chapter-based evidence trail.
- IMPLEMENTATION STEPS
  1. Create ./build/src/content/campaign/midgame/ with southern-wilderness.js, bandit-camp.js, and cloakwood.js.
  2. Define area-specific encounter tables, secrets, optional quests, and travel-node discovery conditions for southern regions.
  3. Script investigation thresholds that reveal the bandit camp only after the required evidence is obtained.
  4. Provide the bandit camp with assault and, if authored, infiltration entry logic that converge on evidence recovery.
  5. Model Cloakwood as a chain of connected maps ending in the mine operation and chapter-advance trigger.
  6. Ensure journal and map-note updates explicitly connect these chapters to the Iron Throne plot.
- SKILLSET REQUIRED
  Open-world content design, progression gating, encounter authoring, quest-state scripting
- NOTES
  Keep the evidence chain explicit so the user always has a traceable reason for the next destination.
- RELATED
  UC-019, UC-020, UC-021 | BR-055, BR-056, BR-057, BR-058, BR-059, BR-060, BR-061, BR-062, BR-063 | AR-007, AR-008, AR-016
---

## DI-016 : Author The City And Endgame Content Packs
- SUMMARY
  Implement Baldur's Gate city districts, urban side content, Iron Throne investigations, the Ducal Palace crisis, and the Sarevok finale. This converts the late-game architecture into explicit authored sequences.
- IMPLEMENTATION STEPS
  1. Create ./build/src/content/campaign/late/ with city-districts.js, city-side-quests.js, iron-throne.js, ducal-palace.js, and undercity-finale.js.
  2. Define district records, interiors, side-quest hooks, and district travel exits using the city area-loader pattern.
  3. Script investigation prerequisites that unlock Iron Throne-linked locations and evidence reveals.
  4. Implement the Ducal Palace as a scripted encounter with friendly and hostile actor definitions plus survival-outcome handling.
  5. Implement the Undercity approach and final temple battle with Sarevok allies, boss behaviors, and campaign completion events.
  6. Update journal and ending-state flows to reflect palace outcomes and final victory.
- SKILLSET REQUIRED
  Large-area content organization, encounter scripting, branching outcome design, boss-fight implementation
- NOTES
  Keep district content modular so future city-side-quest additions do not require editing one monolithic file.
- RELATED
  UC-023, UC-024, UC-025, UC-026, UC-027 | BR-067, BR-068, BR-069, BR-070, BR-071, BR-072, BR-073, BR-074, BR-075, BR-076, BR-077, BR-078, BR-079, BR-080, BR-081 | AR-018, AR-007, AR-012, AR-013, AR-015
---

## DI-017 : Author Companion Arcs, Lore Surfaces, And Reactive Reputation Content
- SUMMARY
  Add the authored narrative content that makes the campaign feel like Baldur's Gate rather than a bare systems demo. This includes companion obligations, optional lore, and social reactivity.
- IMPLEMENTATION STEPS
  1. Extend companion records with personal quest hooks, timers, departure conditions, and follow-up dialogue ids.
  2. Create ./build/src/content/lore.js for books, inscriptions, ambient lines, and item-description text keyed by area or object id.
  3. Add lore triggers to interactables, dialogues, and journal events so optional reading enriches but does not block progress.
  4. Author merchant, citizen, and companion reaction text across reputation bands for selected hubs and districts.
  5. Ensure companion objectives dispatch tangible outcomes such as retention, departure, reward, or hostility.
- SKILLSET REQUIRED
  Narrative design, reactive content authoring, data-driven content modeling
- NOTES
  Prioritize iconic companion arcs first so the system is validated on representative cases.
- RELATED
  UC-007, UC-028, UC-029, UC-030 | BR-020, BR-021, BR-082, BR-083, BR-084, BR-088, BR-089, BR-090 | AR-011, AR-017, AR-020
---

## DI-018 : Author The Expansion Hub, Durlag's Tower, Cult Plot, And Werewolf Island
- SUMMARY
  Implement the Tales of the Sword Coast content pack using the reusable dungeon framework and expansion-hub structures defined in architecture. This completes the planned scope beyond the core campaign.
- IMPLEMENTATION STEPS
  1. Create ./build/src/content/expansion/ with ulgoths-beard.js, durlags-tower.js, cult-plot.js, and werewolf-island.js.
  2. Define Ulgoth's Beard hub services, rumors, and branching quest hooks that feed the other expansion arcs.
  3. Implement Durlag's Tower floors with traps, puzzles, cursed-room encounters, and milestone rewards.
  4. Implement the cult storyline across its travel nodes, clue chains, and final leadership encounters.
  5. Implement ship departure commitment and travel lock-in for the island expedition, plus return unlock after resolution.
  6. Reuse the dungeon-floor framework for cult strongholds and island lairs where possible.
- SKILLSET REQUIRED
  Dungeon-content design, trap and puzzle scripting, late-game quest authoring, progression gating
- NOTES
  Expansion content is large enough to treat as a separate milestone even after the core campaign exists.
- RELATED
  UC-031, UC-032, UC-033, UC-034 | BR-091, BR-092, BR-093, BR-094, BR-095, BR-096, BR-097, BR-098, BR-099, BR-100, BR-101, BR-102 | AR-019, AR-007, AR-016
---

## DI-019 : Build The Presentation Layer, Asset Pipeline, And Audio Direction
- SUMMARY
  Implement the visual and audio presentation systems so gameplay states have distinct themed output instead of placeholder-only rendering. This makes the product testable against the presentation use case.
- IMPLEMENTATION STEPS
  1. Create ./build/src/content/assets.js with keys, relative file paths, types, preload priority, and contextual tags.
  2. Create ./build/src/services/asset-loader.js to preload images and audio buffers by manifest key.
  3. Create ./build/src/services/audio-service.js for music, ambience, effect, and voice channels using the Web Audio API.
  4. Add area-level and mode-level presentation metadata so entering dialogue, combat, title, or a new region can trigger the correct art and sound set.
  5. Create ./build/resources/ for generated or recreated area art, UI chrome, portraits, sprites, and audio files copied from repository resources or newly produced assets.
  6. Define fallback placeholder handling per asset class so missing assets fail visibly but non-fatally during development.
- SKILLSET REQUIRED
  Asset-pipeline design, Web Audio API usage, browser rendering integration, visual-system implementation
- NOTES
  Use logical asset keys everywhere in code; do not hardcode raw file paths throughout runtime modules.
- RELATED
  UC-030, UC-035 | BR-088, BR-103, BR-104, BR-105 | AR-020, AR-021, AR-002
---

## DI-020 : Implement Diagnostics, Release Traceability, And Pipeline Verification Harness
- SUMMARY
  Add runtime diagnostics for missing content and failure recovery, then create the foundation for Stage 5 traceability and Stage 6 verification. This instruction makes the project operable in the repository's strict pipeline workflow.
- IMPLEMENTATION STEPS
  1. Create ./build/src/ui/diagnostics-overlay.js that renders non-fatal warnings and save or load failures from state.
  2. Create ./build/src/services/logger.js with logInfo, logWarning, and logError helpers that write both to console and diagnostics state.
  3. Ensure invalid area ids, missing dialogue nodes, asset-load failures, and unsupported save payloads are surfaced through this logger.
  4. When implementing code under Stage 5, map each created or changed file to at least one DI id in 5-RELEASE-NOTES.md.
  5. Create bg_test_pipeline001.mjs in the project root once there is a runnable vertical slice; serve ./build, capture screenshots, and write testresults/T-PIPELINE-BG-001/results.json.
  6. Do not begin Stage 6 verification until the vertical slice covers a coherent set of UCs end-to-end.
- SKILLSET REQUIRED
  Diagnostics design, developer tooling, Playwright automation, pipeline traceability
- NOTES
  This instruction is intentionally cross-cutting because it supports both runtime resilience and verification discipline.
- RELATED
  UC-001, UC-008, UC-012, UC-035 | BR-003, BR-022, BR-034, BR-035, BR-036, BR-103, BR-105 | AR-023, AR-024
---