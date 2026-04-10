# Baldur's Gate — Proposed Use Cases

## UC-001 : End User - Create A Bhaalspawn Protagonist
- STEPS
  1. User starts a new game from the title screen.
  2. User enters character creation.
  3. User selects race, gender, class, kit or archetype, alignment, appearance, and name.
  4. User allocates or rolls starting attributes within rule constraints.
  5. User confirms the character sheet.
- ACCEPTANCE CRITERIA
  1. The game creates one protagonist with all selected attributes recorded in persistent party state.
  2. Character creation prevents invalid class, race, and alignment combinations.
  3. The created protagonist appears as the controlled party leader when the game begins.
- NOTES
  Proposed scope includes portraits, paper-doll visuals, and generated starter equipment appropriate to class.
- RELATED
---

## UC-002 : End User - Manage Party Composition And Companion Recruitment
- STEPS
  1. User encounters recruitable companions in story hubs and wilderness areas.
  2. User reviews companion dialogue, alignment, class, and motivation.
  3. User accepts or refuses a companion.
  4. User removes a companion from the active party when the party is full or composition changes.
- ACCEPTANCE CRITERIA
  1. The party supports recruitment, dismissal, and reordering of multiple companions.
  2. Companion availability, conflicts, and party-size limits are enforced consistently.
  3. Companion data includes inventory, class abilities, morale or disposition, and location when dismissed.
- NOTES
  Covers iconic companions such as Imoen, Jaheira, Khalid, Minsc, Dynaheir, Edwin, Viconia, Ajantis, Kivan, Coran, Safana, Branwen, Xan, Yeslick, Alora, Tiax, Garrick, Faldorn, Quayle, Xzar, and Montaron in final approved scope.
- RELATED UC-001
---

## UC-003 : End User - Explore Interior And Exterior Areas In Real Time
- STEPS
  1. User enters an explorable map area.
  2. User moves the party through terrain, structures, and boundaries.
  3. User discovers NPCs, containers, hostile groups, and scripted points of interest.
  4. User exits to connected area transitions.
- ACCEPTANCE CRITERIA
  1. Areas render traversable terrain, collision boundaries, interactable objects, and reveal progression.
  2. Exploration supports both urban and wilderness maps with unique layouts and encounter content.
  3. Area transitions preserve party state, health, active effects, quest progression, and time-of-day context.
- NOTES
  This use case applies to Candlekeep, Friendly Arm Inn, Beregost, Nashkel, wilderness zones, Cloakwood, Baldur's Gate city districts, Durlag's Tower, Ulgoth's Beard, and Werewolf Island.
- RELATED UC-001, UC-002
---

## UC-004 : End User - Travel Across The World Map
- STEPS
  1. User opens or triggers the world map.
  2. User selects a discovered destination.
  3. System calculates travel time and initiates overland travel.
  4. System loads the target area or interrupts travel with a random encounter.
- ACCEPTANCE CRITERIA
  1. The world map shows discovered locations and hides undiscovered locations until unlocked.
  2. Travel advances in-game time and can trigger encounter interruptions.
  3. Restricted destinations remain inaccessible until the relevant story or discovery condition is satisfied.
- NOTES
  Proposed map coverage should reflect the BG1 megamap structure and chapter-based access flow.
- RELATED UC-003
---

## UC-005 : End User - Interact With Doors, Containers, Traps, Locks, And Ground Loot
- STEPS
  1. User selects a door, chest, corpse, shelf, or ground item.
  2. User attempts to open, unlock, disarm, loot, or inspect the target.
  3. System resolves trap detection, lock difficulty, and inventory transfer.
  4. User collects, leaves, or redistributes recovered items.
- ACCEPTANCE CRITERIA
  1. Objects expose distinct states such as locked, trapped, opened, empty, or inaccessible.
  2. Skill-based interactions use the appropriate party member capabilities.
  3. Loot transfer supports stackable items, equipment, quest items, gold, gems, scrolls, and consumables.
- NOTES
  Proposed scope includes trap feedback, failed attempts, and party AI pause when danger is detected.
- RELATED UC-002, UC-003
---

## UC-006 : End User - Conduct Branching Dialogue With NPCs
- STEPS
  1. User initiates conversation with an NPC.
  2. System presents dialogue text, speaker portrait, and response options.
  3. User selects dialogue options.
  4. System updates quest flags, reputation, rewards, hostility, recruitment, or shop access.
- ACCEPTANCE CRITERIA
  1. Dialogue supports branching responses with conditional availability based on quest state, party state, or reputation.
  2. NPC responses can grant quests, deny service, recruit companions, trigger combat, or resolve objectives.
  3. Dialogue outcomes persist and affect later interactions when appropriate.
- NOTES
  Includes story NPCs, town citizens, faction contacts, innkeepers, merchants, and major antagonists.
- RELATED UC-002, UC-003, UC-005
---

## UC-007 : End User - Manage Reputation, Alignment Reactions, And Crime Consequences
- STEPS
  1. User completes quests, steals, murders, demands rewards, or helps civilians.
  2. System adjusts party reputation and tracks hostile or lawful reactions.
  3. NPCs, stores, and companions respond to the new reputation level.
- ACCEPTANCE CRITERIA
  1. Reputation changes affect prices, dialogue reactions, and some companion retention rules.
  2. Criminal or hostile actions can trigger guards, bounty responses, or party conflict.
  3. Reputation values persist across areas and saves.
- NOTES
  Proposed scope should model good, neutral, and evil play styles rather than a single heroic path.
- RELATED UC-002, UC-006
---

## UC-008 : End User - Fight In Real-Time-With-Pause Combat
- STEPS
  1. User encounters hostile creatures or initiates combat.
  2. System enters combat state.
  3. User pauses the game and assigns commands to party members.
  4. User resumes time and observes actions resolve.
  5. User re-pauses to adjust tactics until the encounter ends.
- ACCEPTANCE CRITERIA
  1. Combat supports attack rolls, armor class, hit points, timing cadence, and death states.
  2. Pause and unpause do not lose queued commands or current target state.
  3. Hostile AI performs melee, ranged, spell, and movement behaviors appropriate to creature type.
- NOTES
  Includes wildlife, bandits, assassins, guards, undead, spiders, mine enemies, Iron Throne agents, dopplegangers, and final bosses.
- RELATED UC-002, UC-003, UC-010
---

## UC-009 : End User - Cast, Memorize, And Resolve Spells And Special Abilities
- STEPS
  1. User opens spellbook or quick action controls.
  2. User memorizes or prepares available spells during rest when required by class rules.
  3. User selects a spell or special ability during exploration or combat.
  4. User targets self, ally, enemy, or area.
  5. System resolves casting time, interruption, saving throws, duration, and effects.
- ACCEPTANCE CRITERIA
  1. Spellcasting enforces class, level, memorization, and slot constraints.
  2. Effects include buffs, debuffs, damage, healing, crowd control, summons, protections, and utility spells.
  3. Visual and audio feedback clearly communicates cast success, interruption, expiration, and target impact.
- NOTES
  Covers mage, cleric, druid, ranger, bard, paladin, and item-based magical effects in approved scope.
- RELATED UC-008
---

## UC-010 : End User - Manage Inventory, Equipment, Ammunition, And Encumbrance
- STEPS
  1. User opens inventory for a selected character.
  2. User equips, unequips, moves, identifies, drops, or uses items.
  3. User assigns weapons, armor, shields, ammunition, quick items, and quick slots.
  4. System updates combat stats, restrictions, and carry weight.
- ACCEPTANCE CRITERIA
  1. Equipment changes immediately affect derived combat and defense values.
  2. Item restrictions by class, race, alignment, or proficiency are enforced.
  3. Encumbrance penalties and ammunition consumption are reflected consistently.
- NOTES
  Proposed scope includes magical item properties, cursed items, unidentified items, and store sell value.
- RELATED UC-002, UC-005, UC-008
---

## UC-011 : End User - Rest, Heal, Memorize, And Handle Ambush Risk
- STEPS
  1. User chooses to rest in the wilderness, inn, or safe location.
  2. System advances time and restores eligible resources.
  3. System checks for random ambush risk when resting in unsafe areas.
  4. User resumes play after successful rest or resolves an interrupted rest encounter.
- ACCEPTANCE CRITERIA
  1. Rest recovers health and spell resources according to game rules and location context.
  2. Unsafe rest attempts can trigger interrupt encounters.
  3. Inns and story-safe spaces provide lower-risk or no-risk rest options when intended.
- NOTES
  Proposed scope includes chapter pacing impact from elapsed time.
- RELATED UC-008, UC-009, UC-010
---

## UC-012 : End User - Save, Load, And Resume Campaign Progress
- STEPS
  1. User opens the save or load interface.
  2. User creates a named save, overwrites an existing save, or loads a selected save.
  3. System serializes or restores world state.
  4. User resumes play from the selected state.
- ACCEPTANCE CRITERIA
  1. Save data persists protagonist, party, inventory, quests, discovered areas, chapter state, and time.
  2. Loading restores the exact prior area, party condition, and quest progression.
  3. Save slots display readable metadata such as location, time, and chapter.
- NOTES
  Proposed scope includes autosave checkpoints only if explicitly approved in Stage 1.
- RELATED UC-001, UC-002, UC-003, UC-004
---

## UC-013 : End User - Review Journal, Quest Log, And Area Map Notes
- STEPS
  1. User opens the journal or map interface.
  2. User reads current quests, completed quests, and relevant story notes.
  3. User views area annotations, points of interest, and discovered locations.
  4. User returns to active play.
- ACCEPTANCE CRITERIA
  1. Journal entries record quest acquisition, updates, and resolutions.
  2. The map interface displays visited zones and relevant notes tied to exploration.
  3. Story-critical updates are visible without requiring the user to remember hidden flags.
- NOTES
  Proposed scope includes chapter objectives, side quests, and expansion quest lines.
- RELATED UC-003, UC-004, UC-006
---

## UC-014 : End User - Resolve Random Wilderness Encounters And Ambient Threats
- STEPS
  1. User travels or explores remote wilderness areas.
  2. System spawns monsters, bandits, or ambient scripted events.
  3. User chooses to fight, flee, or avoid the threat where possible.
  4. System resolves rewards, losses, or map continuation.
- ACCEPTANCE CRITERIA
  1. Wilderness travel can produce varied encounter compositions and spawn points.
  2. Encounters scale according to location logic rather than a single generic template.
  3. Encounter outcomes affect loot, health, reputation, and progression when appropriate.
- NOTES
  Intended to keep overland travel and remote exploration from feeling empty.
- RELATED UC-003, UC-004, UC-008
---

## UC-015 : End User - Complete Candlekeep Prologue And Escape Sequence
- STEPS
  1. User explores Candlekeep grounds and interior spaces.
  2. User completes tutorial-like errands, conversations, and starter encounters.
  3. User witnesses Gorion's departure and ambush sequence.
  4. User survives the transition from Candlekeep to the open road.
- ACCEPTANCE CRITERIA
  1. Candlekeep functions as both narrative prologue and onboarding area.
  2. Early errands, books, NPC guidance, and tutorial combat are available before departure.
  3. Gorion's death and the post-ambush start are presented as the main campaign inciting incident.
- NOTES
  Includes Reevor, Hull, Firebead, Tethtoril, and other early prologue interactions in approved scope.
- RELATED UC-001, UC-003, UC-006
---

## UC-016 : End User - Reach Friendly Arm Inn And Survive The Early Assassination Plot
- STEPS
  1. User travels from the post-ambush road to Friendly Arm Inn.
  2. User meets early allies and receives guidance about the Iron Crisis.
  3. User survives an assassination attempt tied to the main plot.
  4. User uses the inn as a recruitment, shopping, and information hub.
- ACCEPTANCE CRITERIA
  1. Friendly Arm Inn acts as a major early safe hub with quests, shops, and companion recruitment.
  2. The assassination attempt is staged as a memorable story gate rather than a generic fight.
  3. The location remains useful later for merchants, side content, and party logistics.
- NOTES
  Includes Jaheira, Khalid, Tarnesh, Bentley, and surrounding outdoor encounters in approved scope.
- RELATED UC-002, UC-003, UC-006, UC-008
---

## UC-017 : End User - Resolve Beregost Hub Quests And Town Interactions
- STEPS
  1. User enters Beregost and explores inns, homes, shops, and streets.
  2. User collects local rumors and side quests.
  3. User resolves conversations, tavern conflicts, messenger errands, and local threats.
  4. User recruits or encounters town-based companions and antagonists.
- ACCEPTANCE CRITERIA
  1. Beregost contains multiple independent side quests and social interactions.
  2. Quest outcomes can involve dialogue, combat, delivery, and moral choice resolution.
  3. Town content remains explorable even after the main-critical path moves on.
- NOTES
  Includes Firebead's book request, Marl, Mirianne's letter, Silke, Zhurlong's boots, Garrick, Kagain, and surrounding inns in approved scope.
- RELATED UC-003, UC-006, UC-008
---

## UC-018 : End User - Investigate Nashkel And Clear The Nashkel Mines
- STEPS
  1. User reaches Nashkel and speaks with officials and townsfolk about the iron shortage.
  2. User gathers supplies, rumors, and local side quests.
  3. User enters Nashkel Mines.
  4. User fights through mine levels, identifies the sabotage source, and defeats the chapter boss.
  5. User reports success and advances the main quest.
- ACCEPTANCE CRITERIA
  1. Nashkel provides clear transition from open exploration to the first major dungeon objective.
  2. The mine dungeon contains progressive danger, enemy variety, and story evidence.
  3. Completing the mines unlocks the next chapter and updates journal progression.
- NOTES
  Includes Berrun Ghastkill, Minsc, Edwin, Noober, carnival vicinity, and Mulahey confrontation in approved scope.
- RELATED UC-004, UC-006, UC-008, UC-013
---

## UC-019 : End User - Explore The Southern Wilderness, Coast, And Temple Regions
- STEPS
  1. User travels through plains, forests, cliffs, and coastal maps south of Beregost and Nashkel.
  2. User discovers monster lairs, temples, hidden caves, and isolated quest givers.
  3. User completes optional area-specific quests and loots hidden caches.
- ACCEPTANCE CRITERIA
  1. Southern wilderness areas include distinct geography, enemy populations, and discoverable secrets.
  2. Optional quests can be completed independently of the main plot.
  3. Coastal and temple maps provide unique atmospheric identity rather than reused content only.
- NOTES
  Includes basilisk areas, coast maps, ankheg or ogre threats where relevant, temples, and wandering NPC events in approved scope.
- RELATED UC-003, UC-004, UC-014
---

## UC-020 : End User - Solve The Bandit Camp Chapter And Identify Iron Throne Links
- STEPS
  1. User gathers evidence leading to the bandit camp.
  2. User infiltrates or assaults the camp.
  3. User defeats camp leadership and recovers letters or evidence.
  4. System updates the journal to point toward Cloakwood and the deeper conspiracy.
- ACCEPTANCE CRITERIA
  1. The bandit camp chapter can support both direct combat and infiltration-style entry conditions if approved.
  2. Evidence recovery clearly connects the local iron crisis to a larger organized plot.
  3. Chapter completion unlocks the next destination and story escalation.
- NOTES
  Includes Tazok-linked forces, Blacktalons, tent interiors, and plot documents.
- RELATED UC-006, UC-008, UC-013
---

## UC-021 : End User - Traverse Cloakwood And Defeat The Mine Operation
- STEPS
  1. User enters the Cloakwood forest chain.
  2. User navigates spiders, wyverns, druids, hunters, and hazardous wilderness encounters.
  3. User reaches the Cloakwood mine complex.
  4. User disables the operation, defeats chapter antagonists, and secures proof.
- ACCEPTANCE CRITERIA
  1. Cloakwood is represented as a multi-map progression with escalating danger.
  2. The mine chapter combines wilderness travel, dungeon exploration, and boss encounters.
  3. Completing the chapter advances the main plot toward Baldur's Gate city access.
- NOTES
  Includes spider nests, druid conflicts, wyvern hunting, Coran-related content, and Davaeorn confrontation in approved scope.
- RELATED UC-003, UC-008, UC-013, UC-014
---

## UC-022 : End User - Return To Candlekeep And Escape The Catacombs
- STEPS
  1. User returns to Candlekeep under story-driven circumstances.
  2. User is framed, imprisoned, or restricted by hostile authorities.
  3. User explores the catacombs and defeats dangerous creatures beneath the keep.
  4. User escapes with evidence and renewed story direction.
- ACCEPTANCE CRITERIA
  1. Candlekeep return content feels distinct from the prologue and reflects changed stakes.
  2. The catacombs contain combat, lore, and escape progression.
  3. Story revelations discovered here materially advance the endgame arc.
- NOTES
  Includes doppelganger intrigue, tomes, catacomb monsters, and confrontation fallout.
- RELATED UC-015, UC-008, UC-013
---

## UC-023 : End User - Enter Baldur's Gate City And Navigate Multiple Districts
- STEPS
  1. User unlocks access to Baldur's Gate city.
  2. User enters distinct districts and landmark interiors.
  3. User uses the city as a dense network of quests, shops, and story triggers.
  4. User travels between districts while preserving active quests and discovered locations.
- ACCEPTANCE CRITERIA
  1. The city is split into multiple distinct districts with unique NPC and quest populations.
  2. District transitions are reliable and discoverable through both map and area exits.
  3. Urban density meaningfully expands available interactions compared with prior hubs.
- NOTES
  Includes East, West, North, South, Central, Docks, and surrounding special interiors in approved scope.
- RELATED UC-003, UC-004, UC-006
---

## UC-024 : End User - Complete Baldur's Gate City Side Quests And Urban Faction Content
- STEPS
  1. User accepts side quests from nobles, commoners, temples, merchants, thieves, and investigators.
  2. User explores homes, guild spaces, sewers, shops, and public buildings.
  3. User resolves murders, thefts, feuds, infiltrations, rescues, and faction-driven errands.
  4. System records rewards, reputation impact, and quest completion.
- ACCEPTANCE CRITERIA
  1. The city contains a large volume of optional side content with meaningful variety.
  2. Side quests support mixed resolutions including dialogue, combat, evidence delivery, and dungeon-like exploration.
  3. Multiple districts remain relevant for side content throughout the city chapter.
- NOTES
  Includes Seven Suns, merchants' league tensions, thieves' guild style content, temple tasks, and noble house incidents in approved scope.
- RELATED UC-023, UC-006, UC-008, UC-013
---

## UC-025 : End User - Infiltrate The Iron Throne And Expose The Main Conspiracy
- STEPS
  1. User follows evidence from prior chapters into Baldur's Gate political and mercantile centers.
  2. User infiltrates or assaults Iron Throne-linked sites.
  3. User discovers documents, captives, and high-level plot revelations.
  4. User survives the faction response and advances the endgame.
- ACCEPTANCE CRITERIA
  1. Iron Throne investigations connect prior regional crises into one coherent main plot.
  2. Key interiors contain story evidence, hostile encounters, and named antagonists.
  3. Completion triggers a clear shift from investigation to final confrontation arc.
- NOTES
  Includes Seven Suns, Iron Throne headquarters, and related investigations in approved scope.
- RELATED UC-020, UC-021, UC-023, UC-024
---

## UC-026 : End User - Uncover Sarevok's Plot And Survive The Ducal Palace Crisis
- STEPS
  1. User gathers evidence linking Sarevok to the conspiracy.
  2. User reaches the Ducal Palace or equivalent high-stakes political event.
  3. User protects key figures or mitigates a planned catastrophe.
  4. System advances the story to the final pursuit.
- ACCEPTANCE CRITERIA
  1. The palace crisis is staged as a major turning point with scripted multi-actor conflict.
  2. Success or partial success meaningfully affects endgame dialogue and narrative framing.
  3. The event clarifies Sarevok as the final antagonist and points toward the last battlefield.
- NOTES
  Includes doppelganger infiltration, duke protection, and urgent endgame progression.
- RELATED UC-023, UC-025, UC-008
---

## UC-027 : End User - Pursue Sarevok Into The Final Undercity And Temple Confrontation
- STEPS
  1. User enters the Undercity and final approach areas.
  2. User overcomes final encounters and story setup.
  3. User enters the last battle arena.
  4. User defeats Sarevok and completes the campaign ending sequence.
- ACCEPTANCE CRITERIA
  1. Final maps provide escalation in tone, difficulty, and story presentation.
  2. The final encounter uses Sarevok's allies, battlefield pressure, and boss presentation suitable for a campaign climax.
  3. Victory triggers end-of-game resolution and campaign completion credits or epilogue.
- NOTES
  Includes Undercity, temple confrontation, and ending state presentation.
- RELATED UC-026, UC-008, UC-013
---

## UC-028 : End User - Recruit, Resolve, And Maintain Companion-Specific Quest Content
- STEPS
  1. User recruits a companion with personal objectives or time-sensitive demands.
  2. System tracks companion quest state and tolerance for delay or conflicting actions.
  3. User resolves the personal quest or ignores it.
  4. Companion reacts through dialogue, loyalty changes, departure, or conflict.
- ACCEPTANCE CRITERIA
  1. Companion-specific quest or timer content is preserved where relevant to the original game experience.
  2. Companion reactions are influenced by alignment, reputation, and unresolved obligations.
  3. The party can permanently lose or retain companions based on player choices.
- NOTES
  Covers examples such as Minsc and Dynaheir, Edwin's rival objective, Yeslick's mine connection, and other companion-linked content.
- RELATED UC-002, UC-006, UC-007
---

## UC-029 : End User - Trade With Merchants, Inns, Temples, And Service Providers
- STEPS
  1. User opens a merchant, inn, temple, or specialist service dialogue.
  2. User buys, sells, identifies, donates, heals, resurrects, or rents lodging.
  3. System resolves pricing, availability, reputation effects, and inventory transfer.
- ACCEPTANCE CRITERIA
  1. Merchant inventories differ by location and role.
  2. Service providers offer context-appropriate functions such as healing, resurrection, identification, and room rental.
  3. Prices reflect store rules and can react to reputation or quest state when intended.
- NOTES
  Proposed scope includes blacksmiths, fences, temples, general stores, inns, carnival merchants, and city specialists.
- RELATED UC-006, UC-010, UC-011
---

## UC-030 : End User - Learn World Lore Through Books, Ambient Dialogue, And Environmental Storytelling
- STEPS
  1. User reads books, plaques, inscriptions, and item descriptions.
  2. User overhears ambient NPC lines or optional lore dialogue.
  3. System records or conveys setting context without requiring main-quest completion.
- ACCEPTANCE CRITERIA
  1. Lore content enriches the Sword Coast setting beyond objective markers only.
  2. Books and ambient dialogue can foreshadow quests, factions, monsters, and history.
  3. Optional lore never blocks core progression but deepens immersion.
- NOTES
  Important for recreating the feel of Candlekeep, temples, noble houses, and Durlag's Tower.
- RELATED UC-003, UC-006, UC-013
---

## UC-031 : End User - Explore Durlag's Tower And Complete Its Multi-Level Dungeon Questline
- STEPS
  1. User reaches Durlag's Tower from the world map.
  2. User explores the tower exterior, upper floors, basements, and puzzle-heavy lower levels.
  3. User resolves traps, riddles, cursed rooms, guardians, and boss encounters.
  4. User claims treasure and completes the tower storyline.
- ACCEPTANCE CRITERIA
  1. Durlag's Tower functions as an endgame-scale optional mega-dungeon with multiple floors and puzzle content.
  2. Exploration includes trap-heavy encounters, lore payoff, and unique encounter scripting.
  3. Completion rewards justify the dungeon's difficulty and length.
- NOTES
  Tales of the Sword Coast content. Strong emphasis on traps, puzzles, and haunted legacy storytelling.
- RELATED UC-005, UC-008, UC-030
---

## UC-032 : End User - Visit Ulgoth's Beard And Begin Expansion Quest Chains
- STEPS
  1. User discovers and travels to Ulgoth's Beard.
  2. User interacts with townsfolk, merchants, storytellers, and quest givers.
  3. User accepts expansion quest hooks leading to Durlag's Tower, the cult plot, or island expedition.
- ACCEPTANCE CRITERIA
  1. Ulgoth's Beard acts as a believable expansion hub tied into late-campaign progression.
  2. The area unlocks multiple distinct quest chains rather than a single linear errand.
  3. New merchants, rumors, and narrative hooks distinguish it from core-game hubs.
- NOTES
  Tales of the Sword Coast staging location.
- RELATED UC-004, UC-006, UC-031
---

## UC-033 : End User - Investigate The Cult Of The Black Hand And Ice Island Plotline
- STEPS
  1. User follows cult-related leads from Ulgoth's Beard.
  2. User travels to expansion-specific hostile locations.
  3. User uncovers the cult's plan and defeats its leaders.
  4. System resolves the cult storyline and awards late-game loot.
- ACCEPTANCE CRITERIA
  1. The cult questline introduces new enemies, locations, and boss encounters distinct from the core campaign.
  2. Story clues and travel steps remain coherent across multiple expansion maps.
  3. Completion clearly records success in the journal and world state.
- NOTES
  Proposed scope includes the Ice Island content and related cult progression from Tales of the Sword Coast.
- RELATED UC-032, UC-008, UC-013
---

## UC-034 : End User - Travel To Werewolf Island And Resolve The Shipwreck Questline
- STEPS
  1. User accepts the island expedition.
  2. User travels by ship and becomes stranded or committed to the island sequence.
  3. User explores villages, wilderness, and lairs populated by lycanthropic enemies and quest NPCs.
  4. User breaks the island conflict and returns safely.
- ACCEPTANCE CRITERIA
  1. Werewolf Island functions as a self-contained late-game quest arc with unique geography and enemy identity.
  2. The island includes social deception, combat danger, and narrative escalation.
  3. Returning from the island restores broader world-map access and records quest completion.
- NOTES
  Tales of the Sword Coast content with travel lock-in and return resolution.
- RELATED UC-004, UC-006, UC-008, UC-032
---

## UC-035 : End User - View, Hear, And Experience A Fully Themed Presentation Layer
- STEPS
  1. User enters menus, maps, combat scenes, and dialogue encounters.
  2. System displays recreated UI chrome, portraits, sprites, area art, spell effects, and item visuals.
  3. System plays music, ambience, voice barks, combat sounds, and interface feedback.
  4. User continues across the full campaign with consistent presentation quality.
- ACCEPTANCE CRITERIA
  1. Every major gameplay system has appropriate visual and audio presentation rather than placeholder-only output.
  2. Areas, characters, monsters, and items use generated or recreated assets sufficient to distinguish the full game world.
  3. The presentation layer supports readability, atmosphere, and tactical clarity across all explored content.
- NOTES
  This use case reflects the explicit goal requirement to recreate sprites, images, and assets.
- RELATED UC-001, UC-003, UC-006, UC-008, UC-009, UC-023, UC-031, UC-034
---