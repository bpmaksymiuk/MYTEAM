# Business Requirements — Baldur's Gate

## BR-001 : System shall provide a new game entry point from the title screen
- TESTABLE CONDITION
  Given the title screen is visible, when the user selects New Game, then the character creation interface opens within one user action.
- NOTES
  Supports campaign start.
- RELATED
  UC-001
---

## BR-002 : System shall validate protagonist race, class, and alignment combinations against game rules
- TESTABLE CONDITION
  Given the user selects an invalid race, class, or alignment combination, when the user attempts to confirm the character, then confirmation is blocked and an explanatory validation message is shown.
- NOTES
  Rule enforcement requirement.
- RELATED
  UC-001
---

## BR-003 : System shall persist the confirmed protagonist sheet into campaign state
- TESTABLE CONDITION
  Given the user confirms a valid protagonist, when the campaign begins, then the protagonist name, attributes, class data, alignment, and appearance are present in the active party state.
- NOTES
  Includes starting identity fields.
- RELATED
  UC-001
---

## BR-004 : System shall present recruitable companions with distinct identity and class data
- TESTABLE CONDITION
  Given the party encounters a recruitable companion, when the recruitment dialogue is opened, then the companion name, class role, and alignment stance are displayed.
- NOTES
  Enables informed recruitment.
- RELATED
  UC-002
---

## BR-005 : System shall enforce the active party size limit during recruitment
- TESTABLE CONDITION
  Given the active party is at the configured maximum size, when the user attempts to recruit another companion, then the system requires dismissal or refusal before adding the new companion.
- NOTES
  Party cap must be deterministic.
- RELATED
  UC-002
---

## BR-006 : System shall preserve dismissed companion state for later re-encounter when applicable
- TESTABLE CONDITION
  Given the user dismisses a companion, when the companion remains available in the campaign, then the companion retains inventory, health state, and dismissal location data.
- NOTES
  Availability may vary by story state.
- RELATED
  UC-002
---

## BR-007 : System shall render each explorable area with traversable geometry and blocked geometry
- TESTABLE CONDITION
  Given an area is loaded, when the user attempts to move through the map, then passable ground accepts movement and blocked terrain rejects movement.
- NOTES
  Core area navigation rule.
- RELATED
  UC-003
---

## BR-008 : System shall populate explorable areas with interactable entities appropriate to that area
- TESTABLE CONDITION
  Given an area is loaded, when the user explores it, then the area contains its configured NPCs, containers, hostile groups, exits, and scripted points of interest.
- NOTES
  Area-specific content requirement.
- RELATED
  UC-003
---

## BR-009 : System shall preserve party and quest state across area transitions
- TESTABLE CONDITION
  Given the party transitions from one area to another, when the new area finishes loading, then party health, inventory, active effects, quest flags, and in-game time match the pre-transition state.
- NOTES
  Transition continuity.
- RELATED
  UC-003
---

## BR-010 : System shall display discovered world-map destinations as selectable travel nodes
- TESTABLE CONDITION
  Given the user opens the world map, when at least one destination has been discovered, then each discovered destination appears as a selectable node.
- NOTES
  World map discovery model.
- RELATED
  UC-004
---

## BR-011 : System shall hide undiscovered or story-locked destinations from travel selection
- TESTABLE CONDITION
  Given the user opens the world map before a destination is discovered or unlocked, then that destination is not selectable for travel.
- NOTES
  Prevents premature travel.
- RELATED
  UC-004
---

## BR-012 : System shall advance in-game time during overland travel
- TESTABLE CONDITION
  Given the user travels from one map node to another, when travel completes, then the in-game clock is later than it was at travel start by the configured travel duration.
- NOTES
  Travel pacing rule.
- RELATED
  UC-004
---

## BR-013 : System shall label doors and containers with locked, trapped, opened, or closed state when relevant
- TESTABLE CONDITION
  Given the user selects an interactable door or container, when its interaction panel or cursor state is shown, then its relevant interaction state is exposed to the user.
- NOTES
  Enables tactical decisions.
- RELATED
  UC-005
---

## BR-014 : System shall resolve lockpicking and trap handling using the selected character capability values
- TESTABLE CONDITION
  Given the user attempts to unlock or disarm an object, when the attempt resolves, then success or failure reflects the acting character's relevant capability score.
- NOTES
  Character-specific skill resolution.
- RELATED
  UC-005
---

## BR-015 : System shall transfer loot between world objects and inventory without duplicating or losing items
- TESTABLE CONDITION
  Given the user loots a valid object, when the transfer completes, then the moved item is removed from the source and appears once in the target inventory.
- NOTES
  Applies to stackable and non-stackable items.
- RELATED
  UC-005
---

## BR-016 : System shall open a dialogue interface when the user initiates conversation with a valid NPC
- TESTABLE CONDITION
  Given the user selects a non-hostile talkable NPC, when dialogue starts, then a dialogue interface appears with speaker identity and dialogue text.
- NOTES
  Dialogue entry condition.
- RELATED
  UC-006
---

## BR-017 : System shall conditionally enable dialogue responses based on quest state, party state, or reputation
- TESTABLE CONDITION
  Given an NPC dialogue offers gated responses, when the user opens that dialogue, then only responses meeting their conditions are selectable.
- NOTES
  Supports branching dialogue.
- RELATED
  UC-006
---

## BR-018 : System shall persist dialogue outcomes that modify quests, hostility, or access
- TESTABLE CONDITION
  Given a dialogue choice grants a quest, changes hostility, or unlocks a service, when the dialogue closes and the user re-engages the world, then the resulting state remains active.
- NOTES
  Choice persistence.
- RELATED
  UC-006
---

## BR-019 : System shall track party reputation as a persistent campaign value
- TESTABLE CONDITION
  Given the user performs a reputation-affecting action, when the outcome resolves, then the reputation value changes and remains changed after area transition or save/load.
- NOTES
  Global reputation system.
- RELATED
  UC-007
---

## BR-020 : System shall apply reputation-based reaction differences to merchants and NPC dialogue
- TESTABLE CONDITION
  Given the party reputation is materially high or low, when the user opens a shop or initiates affected dialogue, then prices or reaction text differ from the neutral baseline.
- NOTES
  Visible reputation impact.
- RELATED
  UC-007
---

## BR-021 : System shall trigger lawful or hostile response to major criminal actions in protected areas
- TESTABLE CONDITION
  Given the user commits a major criminal action in a protected area, when the act is observed or resolved, then guards or hostile responders are spawned or activated.
- NOTES
  Crime consequence system.
- RELATED
  UC-007
---

## BR-022 : System shall enter combat mode when a hostile encounter begins
- TESTABLE CONDITION
  Given a hostile encounter starts, when the first hostile action or detection event occurs, then the game enters combat mode and combat UI elements become available.
- NOTES
  Combat state transition.
- RELATED
  UC-008
---

## BR-023 : System shall allow the user to pause and unpause combat without discarding issued commands
- TESTABLE CONDITION
  Given combat is active and party commands have been assigned, when the user pauses and resumes the game, then queued commands remain intact until resolved or replaced.
- NOTES
  Real-time-with-pause requirement.
- RELATED
  UC-008
---

## BR-024 : System shall resolve hostile and party actions using deterministic combat rules
- TESTABLE CONDITION
  Given an attack or ability resolves in combat, when the resolution completes, then hit, miss, damage, and status results are recorded in accordance with the configured combat rules.
- NOTES
  Core combat simulation.
- RELATED
  UC-008
---

## BR-025 : System shall show available spell or ability actions for characters who can use them
- TESTABLE CONDITION
  Given the selected character has available spells or abilities, when the user opens the relevant action interface, then only usable actions are listed as selectable.
- NOTES
  Action list rule.
- RELATED
  UC-009
---

## BR-026 : System shall enforce memorization or slot availability before casting a spell
- TESTABLE CONDITION
  Given the user attempts to cast a spell with no available memorization or slot, when the cast is initiated, then the cast is blocked and a clear reason is shown.
- NOTES
  Slot validation.
- RELATED
  UC-009
---

## BR-027 : System shall resolve spell effects on valid targets with duration and saving-throw logic
- TESTABLE CONDITION
  Given a spell is cast on a valid target, when the cast resolves, then its effect, duration, and any saving-throw outcome are applied to the target state.
- NOTES
  Spell resolution rule.
- RELATED
  UC-009
---

## BR-028 : System shall display inventory for the currently selected character
- TESTABLE CONDITION
  Given the user opens inventory for a character, when the inventory interface loads, then equipped items, carried items, quick slots, and available equipment slots are shown.
- NOTES
  Character inventory view.
- RELATED
  UC-010
---

## BR-029 : System shall update derived combat statistics after an equipment change
- TESTABLE CONDITION
  Given the user equips or unequips an item, when the action completes, then affected derived statistics update before the next combat action is issued.
- NOTES
  Includes attack and defense values.
- RELATED
  UC-010
---

## BR-030 : System shall block equipment assignments that violate class, race, or proficiency restrictions
- TESTABLE CONDITION
  Given the user attempts to equip a restricted item, when the assignment is attempted, then the item remains unequipped and the restriction reason is shown.
- NOTES
  Restriction enforcement.
- RELATED
  UC-010
---

## BR-031 : System shall offer rest as an explicit player action in valid locations
- TESTABLE CONDITION
  Given the party is in a location where resting is allowed, when the user selects Rest, then a rest confirmation flow is presented.
- NOTES
  Rest access rule.
- RELATED
  UC-011
---

## BR-032 : System shall restore eligible health and spell resources after a successful rest
- TESTABLE CONDITION
  Given the party completes an uninterrupted rest, when the rest ends, then recoverable health and memorized spell resources are restored according to class rules.
- NOTES
  Post-rest recovery.
- RELATED
  UC-011
---

## BR-033 : System shall support rest interruption in unsafe locations
- TESTABLE CONDITION
  Given the party rests in an unsafe location, when an ambush roll succeeds, then rest is interrupted and an encounter begins instead of full recovery.
- NOTES
  Wilderness danger rule.
- RELATED
  UC-011
---

## BR-034 : System shall provide named save slots with readable metadata
- TESTABLE CONDITION
  Given the user opens the save interface, when save slots are shown, then each occupied slot displays its save name and campaign metadata.
- NOTES
  Metadata includes location or chapter.
- RELATED
  UC-012
---

## BR-035 : System shall serialize campaign state into a save slot on command
- TESTABLE CONDITION
  Given the user confirms a save action, when saving completes, then the selected slot contains the current protagonist, party, quest, map, and time state.
- NOTES
  Campaign serialization requirement.
- RELATED
  UC-012
---

## BR-036 : System shall restore the exact saved campaign state from a selected slot
- TESTABLE CONDITION
  Given the user loads an existing save slot, when loading completes, then area, party condition, inventory, quests, and time match the saved metadata and state.
- NOTES
  Save-load fidelity.
- RELATED
  UC-012
---

## BR-037 : System shall record accepted and updated quests in the journal
- TESTABLE CONDITION
  Given the user accepts or updates a quest, when the journal is opened, then the quest appears with its latest state and summary.
- NOTES
  Quest tracking baseline.
- RELATED
  UC-013
---

## BR-038 : System shall separate active and completed quest records in the journal
- TESTABLE CONDITION
  Given the user completes a quest, when the journal is opened afterward, then that quest appears in the completed section instead of the active section.
- NOTES
  Journal organization rule.
- RELATED
  UC-013
---

## BR-039 : System shall display discovered map notes and area references in the map interface
- TESTABLE CONDITION
  Given the user has discovered areas or triggered map notes, when the map interface is opened, then the discovered locations and notes are visible.
- NOTES
  Supports navigation recall.
- RELATED
  UC-013
---

## BR-040 : System shall generate ambient wilderness encounters from area-specific encounter tables
- TESTABLE CONDITION
  Given the party enters or travels through a wilderness area with ambient threats, when an encounter is triggered, then the spawned threat matches the configured encounter set for that area.
- NOTES
  Area-specific randomness.
- RELATED
  UC-014
---

## BR-041 : System shall allow flight or avoidance only when encounter rules permit it
- TESTABLE CONDITION
  Given an ambient encounter begins, when the user attempts to flee or avoid it, then the outcome reflects the encounter's configured flee or avoid rules.
- NOTES
  Encounter exit rule.
- RELATED
  UC-014
---

## BR-042 : System shall persist consequences of ambient encounters
- TESTABLE CONDITION
  Given the party wins, loses, or escapes an ambient encounter, when gameplay resumes, then resulting health, loot, reputation, and quest changes remain applied.
- NOTES
  Encounter outcome persistence.
- RELATED
  UC-014
---

## BR-043 : System shall present Candlekeep as a non-hostile onboarding area before the ambush sequence
- TESTABLE CONDITION
  Given the user begins a new campaign, when the Candlekeep prologue loads, then tutorial NPCs, errands, and low-risk interactions are available before forced departure.
- NOTES
  Prologue structure.
- RELATED
  UC-015
---

## BR-044 : System shall stage Gorion's departure and death as an unmissable story event
- TESTABLE CONDITION
  Given the user reaches the end of the prologue, when the departure sequence resolves, then Gorion's ambush and death are shown before free wilderness exploration begins.
- NOTES
  Inciting incident requirement.
- RELATED
  UC-015
---

## BR-045 : System shall transition the player from prologue state into the open-world campaign state after the ambush
- TESTABLE CONDITION
  Given the ambush sequence is complete, when control returns to the player, then the campaign enters the first open-world state with journal and party systems active.
- NOTES
  Post-prologue handoff.
- RELATED
  UC-015
---

## BR-046 : System shall unlock Friendly Arm Inn as a major early hub after the ambush road sequence
- TESTABLE CONDITION
  Given the player survives the ambush opening, when the party reaches Friendly Arm Inn, then inn services, merchants, and key NPCs are available.
- NOTES
  Early hub requirement.
- RELATED
  UC-016
---

## BR-047 : System shall trigger the Friendly Arm assassination attempt on arrival or first approach
- TESTABLE CONDITION
  Given the party approaches Friendly Arm Inn for the first relevant time, when the arrival condition is met, then the assassination encounter starts.
- NOTES
  Early plot beat.
- RELATED
  UC-016
---

## BR-048 : System shall preserve Friendly Arm Inn as a reusable hub after the assassination event
- TESTABLE CONDITION
  Given the assassination attempt has been resolved, when the user later returns to Friendly Arm Inn, then hub services and surviving NPC interactions remain accessible.
- NOTES
  Hub persistence.
- RELATED
  UC-016
---

## BR-049 : System shall populate Beregost with multiple independent side quests and named interactions
- TESTABLE CONDITION
  Given the user enters Beregost, when the user explores major inns, shops, and streets, then multiple unique quest starters and named interactions are available.
- NOTES
  Town-content density.
- RELATED
  UC-017
---

## BR-050 : System shall support dialogue-based and combat-based resolution paths for Beregost town incidents when designed
- TESTABLE CONDITION
  Given the user engages a Beregost side incident with multiple solutions, when the incident resolves, then the system records the chosen resolution path and reward.
- NOTES
  Multi-path side quest support.
- RELATED
  UC-017
---

## BR-051 : System shall keep unresolved Beregost content available until its own fail or completion condition is reached
- TESTABLE CONDITION
  Given the user leaves Beregost with unresolved optional content, when the user returns before a fail condition, then the unresolved content remains available.
- NOTES
  Persistent optional town content.
- RELATED
  UC-017
---

## BR-052 : System shall provide Nashkel chapter guidance through local authority and rumor dialogue
- TESTABLE CONDITION
  Given the party reaches Nashkel, when the user speaks with key local authorities or rumor sources, then the mine objective is described in actionable terms.
- NOTES
  Main quest guidance.
- RELATED
  UC-018
---

## BR-053 : System shall implement Nashkel Mines as a multi-level dungeon with escalating resistance
- TESTABLE CONDITION
  Given the user enters Nashkel Mines, when the user descends through the dungeon, then each deeper level increases or changes threat composition according to its configuration.
- NOTES
  Dungeon progression structure.
- RELATED
  UC-018
---

## BR-054 : System shall update the main story chapter after the Nashkel Mines boss is defeated and reported
- TESTABLE CONDITION
  Given the user defeats the chapter boss and reports success, when the report dialogue resolves, then the journal and chapter progression advance.
- NOTES
  Chapter transition.
- RELATED
  UC-018
---

## BR-055 : System shall provide southern wilderness maps with distinct environmental identity and encounter content
- TESTABLE CONDITION
  Given the user enters a southern wilderness or coast map, when the area loads, then terrain, spawn composition, and points of interest differ from other regions.
- NOTES
  Area differentiation.
- RELATED
  UC-019
---

## BR-056 : System shall include optional discoverable quests or secrets in southern wilderness regions
- TESTABLE CONDITION
  Given the user thoroughly explores an optional southern wilderness map, when the user finds its key points of interest, then at least one optional reward, quest, or secret is discoverable where designed.
- NOTES
  Exploration incentive.
- RELATED
  UC-019
---

## BR-057 : System shall allow southern wilderness content to be completed independently of the main quest when not story-gated
- TESTABLE CONDITION
  Given the user undertakes optional southern wilderness content, when the content resolves, then completion is recorded without requiring completion of unrelated main-quest stages unless explicitly gated.
- NOTES
  Optional content independence.
- RELATED
  UC-019
---

## BR-058 : System shall reveal the bandit camp destination after the required investigation evidence is collected
- TESTABLE CONDITION
  Given the player has obtained the required leads, when the investigation threshold is met, then the bandit camp destination becomes available.
- NOTES
  Investigation gate.
- RELATED
  UC-020
---

## BR-059 : System shall support a hostile assault route for the bandit camp chapter
- TESTABLE CONDITION
  Given the user enters the bandit camp as an enemy, when the camp encounter resolves, then combat progression and evidence recovery remain possible.
- NOTES
  Direct combat route.
- RELATED
  UC-020
---

## BR-060 : System shall record plot evidence recovered from the bandit camp into journal progression
- TESTABLE CONDITION
  Given the user recovers the camp evidence, when the evidence is obtained, then the journal updates with the next plot destination and conspiracy link.
- NOTES
  Plot continuity.
- RELATED
  UC-020
---

## BR-061 : System shall represent Cloakwood as a chain of connected forest maps with escalating hazards
- TESTABLE CONDITION
  Given the user begins Cloakwood traversal, when the party moves forward through the region, then the party passes through multiple connected maps with changing threats and geography.
- NOTES
  Multi-map forest progression.
- RELATED
  UC-021
---

## BR-062 : System shall include wilderness-specific hostile populations and side encounters in Cloakwood
- TESTABLE CONDITION
  Given the party explores Cloakwood, when hostile encounters occur, then the encounter types match the forest's configured threat set.
- NOTES
  Region-specific combat content.
- RELATED
  UC-021
---

## BR-063 : System shall advance the main story after the Cloakwood mine operation is defeated
- TESTABLE CONDITION
  Given the user defeats the mine antagonist and secures proof, when the chapter resolution completes, then the story progression unlocks Baldur's Gate access or the next main stage.
- NOTES
  Post-Cloakwood progression.
- RELATED
  UC-021
---

## BR-064 : System shall present the return to Candlekeep as a distinct late-game chapter state
- TESTABLE CONDITION
  Given the main story has advanced to the Candlekeep return, when the user re-enters Candlekeep, then NPC hostility, story framing, and available spaces differ from the prologue state.
- NOTES
  Return-state distinction.
- RELATED
  UC-022
---

## BR-065 : System shall implement the Candlekeep catacombs as an escape-oriented dungeon sequence
- TESTABLE CONDITION
  Given the user enters the catacombs, when the user progresses through that sequence, then combat, exploration, and exits are arranged around escape progression.
- NOTES
  Catacomb structure.
- RELATED
  UC-022
---

## BR-066 : System shall reveal endgame story information through Candlekeep return content
- TESTABLE CONDITION
  Given the user completes key return-to-Candlekeep encounters or discoveries, when the chapter progresses, then new story information is added to the journal.
- NOTES
  Story revelation requirement.
- RELATED
  UC-022
---

## BR-067 : System shall divide Baldur's Gate into multiple navigable city districts
- TESTABLE CONDITION
  Given the user unlocks city access, when the user explores Baldur's Gate, then multiple named districts can be entered and revisited.
- NOTES
  City world structure.
- RELATED
  UC-023
---

## BR-068 : System shall populate each city district with district-specific NPC and location content
- TESTABLE CONDITION
  Given the user enters a city district, when the district loads, then its NPCs, shops, interiors, and quest hooks match that district's configuration.
- NOTES
  District differentiation.
- RELATED
  UC-023
---

## BR-069 : System shall preserve district discovery and travel continuity across city exploration
- TESTABLE CONDITION
  Given the user discovers multiple city districts, when the user travels between them, then discovered districts remain available and current quest state persists.
- NOTES
  City traversal continuity.
- RELATED
  UC-023
---

## BR-070 : System shall provide multiple optional city-side quests with distinct objectives
- TESTABLE CONDITION
  Given the user explores Baldur's Gate city, when the user engages optional content, then quests with differing objectives such as investigation, rescue, delivery, or combat are available.
- NOTES
  Urban side-content breadth.
- RELATED
  UC-024
---

## BR-071 : System shall support interior exploration in city homes, shops, guild spaces, and sewers where designed
- TESTABLE CONDITION
  Given the user enters a city interior linked to side content, when the interior loads, then it supports its configured dialogue, combat, or evidence interactions.
- NOTES
  Urban interior gameplay.
- RELATED
  UC-024
---

## BR-072 : System shall record city-side-quest outcomes and their rewards persistently
- TESTABLE CONDITION
  Given the user completes a city-side quest, when the quest resolution occurs, then journal state, rewards, and any reputation change remain persisted.
- NOTES
  Side-quest persistence.
- RELATED
  UC-024
---

## BR-073 : System shall expose Iron Throne-linked sites only after the required investigative progression
- TESTABLE CONDITION
  Given the user has not yet met the investigation threshold, when the user attempts to access a gated Iron Throne progression step, then the next step remains unavailable.
- NOTES
  Plot gating.
- RELATED
  UC-025
---

## BR-074 : System shall place recoverable evidence within Iron Throne investigations
- TESTABLE CONDITION
  Given the user completes an Iron Throne investigation objective, when evidence is discovered, then that evidence is added to progression state and reflected in the journal.
- NOTES
  Evidence-driven progression.
- RELATED
  UC-025
---

## BR-075 : System shall escalate the main plot after Iron Throne investigation completion
- TESTABLE CONDITION
  Given the user resolves the required Iron Throne investigation content, when the resolution completes, then the next endgame objective becomes active.
- NOTES
  Story escalation.
- RELATED
  UC-025
---

## BR-076 : System shall stage the Ducal Palace crisis as a scripted high-stakes encounter
- TESTABLE CONDITION
  Given the user reaches the palace crisis chapter, when the event begins, then the encounter includes its scripted ally and enemy participants.
- NOTES
  Event scripting requirement.
- RELATED
  UC-026
---

## BR-077 : System shall allow the player to affect palace-crisis survival outcomes through combat performance
- TESTABLE CONDITION
  Given the palace crisis is underway, when the user protects or fails to protect key figures, then the resulting survivor state is recorded.
- NOTES
  Outcome sensitivity.
- RELATED
  UC-026
---

## BR-078 : System shall set the final pursuit objective immediately after the palace crisis resolves
- TESTABLE CONDITION
  Given the palace crisis has ended, when the event resolution completes, then the journal identifies the next final pursuit destination.
- NOTES
  Endgame handoff.
- RELATED
  UC-026
---

## BR-079 : System shall present the Undercity approach as the final pre-boss exploration space
- TESTABLE CONDITION
  Given the user begins the final pursuit, when the party reaches the Undercity approach, then the map contains final-stage exploration and encounters before the boss arena.
- NOTES
  Final approach pacing.
- RELATED
  UC-027
---

## BR-080 : System shall implement Sarevok as a multi-actor boss encounter with allied support
- TESTABLE CONDITION
  Given the final battle begins, when combat is active, then Sarevok and the configured allied enemies participate in the encounter.
- NOTES
  Boss encounter structure.
- RELATED
  UC-027
---

## BR-081 : System shall trigger campaign completion after Sarevok is defeated
- TESTABLE CONDITION
  Given Sarevok is defeated, when combat resolution completes, then the end-of-campaign sequence begins and no further mandatory objectives remain.
- NOTES
  Campaign endpoint.
- RELATED
  UC-027
---

## BR-082 : System shall track companion-specific personal objectives and timers where applicable
- TESTABLE CONDITION
  Given the user recruits a companion with a personal objective or timer, when the companion joins the party, then that objective or timer becomes active in companion state.
- NOTES
  Companion-content tracking.
- RELATED
  UC-028
---

## BR-083 : System shall apply companion reaction logic to unresolved obligations and conflicting choices
- TESTABLE CONDITION
  Given the user ignores a relevant companion obligation or makes a conflicting choice, when the companion reaction check occurs, then dialogue, morale, or party retention changes appropriately.
- NOTES
  Companion consequence system.
- RELATED
  UC-028
---

## BR-084 : System shall allow companion quest resolution to affect party retention or rewards
- TESTABLE CONDITION
  Given the user resolves a companion-specific objective, when the resolution completes, then the companion remains, departs, or grants a reward according to the configured outcome.
- NOTES
  Companion outcome persistence.
- RELATED
  UC-028
---

## BR-085 : System shall provide merchant inventories that differ by merchant type and location
- TESTABLE CONDITION
  Given the user opens two merchants with different configured roles or locations, when the shop lists are compared, then the inventories are not identical unless intentionally configured so.
- NOTES
  Merchant variety.
- RELATED
  UC-029
---

## BR-086 : System shall support service interactions for healing, resurrection, identification, donation, and lodging where configured
- TESTABLE CONDITION
  Given the user opens a service provider that offers a configured service, when the service is purchased, then the related party or item state updates accordingly.
- NOTES
  Service-provider rule.
- RELATED
  UC-029
---

## BR-087 : System shall calculate shop pricing using base prices modified by relevant campaign factors
- TESTABLE CONDITION
  Given the user opens a merchant or service provider, when prices are displayed, then the displayed prices reflect the configured base value and any active modifiers.
- NOTES
  Reputation-sensitive pricing support.
- RELATED
  UC-029
---

## BR-088 : System shall provide readable lore content through books, inscriptions, and item descriptions
- TESTABLE CONDITION
  Given the user selects a readable lore source, when the interaction opens, then the associated lore text is presented in readable form.
- NOTES
  Lore presentation.
- RELATED
  UC-030
---

## BR-089 : System shall allow optional lore discovery without blocking main progression
- TESTABLE CONDITION
  Given the user ignores optional lore content, when the user continues the main quest, then main progression remains available.
- NOTES
  Optionality requirement.
- RELATED
  UC-030
---

## BR-090 : System shall link selected lore content to relevant places, factions, or quest context
- TESTABLE CONDITION
  Given the user reads a lore item that references world context, when the content is shown, then it names or implies a recognizable place, faction, creature, or history element used elsewhere in the campaign.
- NOTES
  Context-rich lore requirement.
- RELATED
  UC-030
---

## BR-091 : System shall implement Durlag's Tower as a multi-floor optional dungeon with persistent floor progression
- TESTABLE CONDITION
  Given the user enters Durlag's Tower, when the user moves between tower floors, then cleared progression and current floor state persist.
- NOTES
  Multi-floor dungeon rule.
- RELATED
  UC-031
---

## BR-092 : System shall include traps, puzzles, and cursed-room style encounters in Durlag's Tower where configured
- TESTABLE CONDITION
  Given the user explores Durlag's Tower, when the user reaches configured challenge spaces, then trap, puzzle, or curse mechanics are triggered and can be resolved.
- NOTES
  Tower identity requirement.
- RELATED
  UC-031
---

## BR-093 : System shall award high-value treasure or progression rewards for completing Durlag's Tower milestones
- TESTABLE CONDITION
  Given the user completes a major Durlag's Tower milestone, when the milestone resolves, then the configured reward is granted exactly once.
- NOTES
  High-risk, high-reward structure.
- RELATED
  UC-031
---

## BR-094 : System shall unlock Ulgoth's Beard after the relevant campaign discovery point
- TESTABLE CONDITION
  Given the user meets the required discovery or progress condition, when the world map is opened, then Ulgoth's Beard becomes available as a travel destination.
- NOTES
  Expansion hub unlock.
- RELATED
  UC-032
---

## BR-095 : System shall provide multiple expansion quest hooks within Ulgoth's Beard
- TESTABLE CONDITION
  Given the user explores Ulgoth's Beard, when the user speaks with key quest-giver NPCs, then multiple expansion quest hooks can be accepted.
- NOTES
  Expansion hub density.
- RELATED
  UC-032
---

## BR-096 : System shall preserve Ulgoth's Beard as a reusable hub while expansion quest lines remain active
- TESTABLE CONDITION
  Given the user has active expansion content, when the user returns to Ulgoth's Beard, then relevant merchants and follow-up NPC interactions remain available.
- NOTES
  Expansion hub persistence.
- RELATED
  UC-032
---

## BR-097 : System shall implement the cult plotline as a multi-step investigation across expansion maps
- TESTABLE CONDITION
  Given the user begins the cult storyline, when the user completes each major step, then the next step becomes available and the journal updates.
- NOTES
  Expansion quest chain.
- RELATED
  UC-033
---

## BR-098 : System shall include distinct hostile factions and boss encounters for the cult storyline
- TESTABLE CONDITION
  Given the user reaches a cult-line confrontation, when combat begins, then the encounter includes the configured faction enemies or boss participants for that stage.
- NOTES
  Expansion combat identity.
- RELATED
  UC-033
---

## BR-099 : System shall mark the cult storyline complete only after its final leadership encounter resolves
- TESTABLE CONDITION
  Given the user defeats the final cult leadership encounter, when post-combat resolution completes, then the storyline is marked complete in the journal.
- NOTES
  Expansion completion rule.
- RELATED
  UC-033
---

## BR-100 : System shall lock the party into the island expedition sequence once the ship departure commitment occurs
- TESTABLE CONDITION
  Given the user commits to the island expedition, when the ship sequence begins, then standard world-map free travel is unavailable until island resolution conditions are met.
- NOTES
  Expedition lock-in.
- RELATED
  UC-034
---

## BR-101 : System shall populate Werewolf Island with its own settlements, wilderness spaces, and lycanthrope-focused threats
- TESTABLE CONDITION
  Given the user arrives on Werewolf Island, when the user explores the island content, then area layouts and threats differ from mainland regions and prominently feature island-specific quest content.
- NOTES
  Island identity requirement.
- RELATED
  UC-034
---

## BR-102 : System shall restore broader campaign travel after the island questline is resolved
- TESTABLE CONDITION
  Given the user completes the island resolution sequence, when the return condition is met, then standard travel access and the post-island campaign state are restored.
- NOTES
  Return-to-mainland rule.
- RELATED
  UC-034
---

## BR-103 : System shall provide distinct visual presentation for major gameplay entities and spaces
- TESTABLE CONDITION
  Given the user views characters, monsters, items, and areas, when those entities are rendered, then each uses distinct visual assets appropriate to its type and identity.
- NOTES
  Asset coverage requirement.
- RELATED
  UC-035
---

## BR-104 : System shall provide audio feedback for menu, dialogue, combat, and ambient exploration contexts
- TESTABLE CONDITION
  Given the user moves through menu, dialogue, combat, and exploration states, when key events occur, then context-appropriate music, ambience, or sound feedback is audible.
- NOTES
  Audio presentation requirement.
- RELATED
  UC-035
---

## BR-105 : System shall maintain presentation consistency across the full campaign and expansion scope
- TESTABLE CONDITION
  Given the user progresses across core campaign and expansion content, when the user transitions between major systems or areas, then UI style, readability, and thematic presentation remain coherent.
- NOTES
  Global presentation consistency.
- RELATED
  UC-035
---