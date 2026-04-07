# Parts List

**Project:** Baldur's Gate (Recreation)
**Source:** 3-ARCHITECTURE-RECOMMENDATIONS.md

---

## PT-001: `index.html`

Top-level HTML shell. Contains: `<canvas id="game-canvas">`, HUD overlay div (`#hud`), UI panel container div (`#ui-layer`), hidden file-input for future modding, and `<script>` tags loading all JS modules in dependency order.

---

## PT-002: `main.js`

Entry point. Initialises the `AudioContext`, loads all JSON data files into `GameData`, bootstraps `AssetLoader`, then starts the master game loop. Owns the `requestAnimationFrame` loop and delegates each tick to the active `StateManager` state.

---

## PT-003: `StateManager.js`

Top-level finite state machine. Holds the current state object and transitions between: `MainMenuState`, `CharacterCreationState`, `PlayingState`, `LoadScreenState`, `SaveScreenState`. Calls `state.update(dt)` and `state.render(ctx)` each frame.

---

## PT-004: `states/MainMenuState.js`

Main menu screen. Renders the title screen background and menu buttons (New Game, Load Game, Options, Quit). Handles button clicks and fires state transitions.

---

## PT-005: `states/CharacterCreationState.js`

Character creation flow. Renders race/class/gender/name/portrait selection panels using DOM overlays. Validates AD&D 2e race–class restrictions from `data/classes.json`. Rolls ability scores. On confirm, calls `CharacterFactory` and transitions to `PlayingState`.

---

## PT-006: `states/PlayingState.js`

Root playing state. Owns the current area, party, world flags, and active sub-state (Exploration, Combat, Dialogue, etc.). Delegates to sub-states for update/render. Manages area transitions (load new area background + collision map, reposition party).

---

## PT-007: `states/substate/ExplorationState.js`

Handles player input during exploration: click-to-move, party pathfinding, NPC interactions, container/door interactions, area-exit detection, rest initiation.

---

## PT-008: `states/substate/CombatState.js`

Real-time-with-pause combat loop. Manages initiative, action queues per combatant, pause/resume (Spacebar). Calls `CombatEngine` for attack and saving throw resolution. Checks end-of-combat conditions.

---

## PT-009: `states/substate/DialogueState.js`

Dialogue screen. Renders the active dialogue node from `DialogueEngine`, presents response options, handles player selection, executes outcomes. Suspends game loop updates during dialogue.

---

## PT-010: `states/substate/InventoryState.js`

Inventory/equipment screen for a selected party member. Renders equipped slots and bag grid. Handles drag-and-drop between slots and characters. Enforces weight limits and equip restrictions.

---

## PT-011: `states/substate/ShopState.js`

Merchant shop interface. Renders the merchant's stock and the player's inventory side-by-side. Handles buy, sell, and identify transactions. Deducts/adds gold from the shared party pool.

---

## PT-012: `states/substate/JournalState.js`

Quest journal screen. Renders Active / Completed / Failed tab panels. Reflects current quest state from `QuestEngine`.

---

## PT-013: `states/substate/MapState.js`

World map and local map screen. Renders discovered areas (greyed-out if unvisited). Handles area-travel clicks with encounter roll. Shows local map with fog-of-war overlay.

---

## PT-014: `states/substate/RestState.js`

Rest screen. Shows party watch assignment, then simulates 8-hour rest (HP recovery, spell slot restoration). Rolls for random encounters in dangerous areas.

---

## PT-015: `states/substate/OptionsState.js`

Options configuration screen. Volume sliders, difficulty selector, subtitle toggle, scroll-speed slider. Persists to `localStorage` via `SettingsManager`.

---

## PT-016: `engine/CombatEngine.js`

Pure AD&D 2e rule resolver. Functions: `rollD`, `resolveAttack`, `resolveDamage`, `resolveSavingThrow`, `applySpellEffect`. No DOM or canvas dependencies. Fully unit-testable.

---

## PT-017: `engine/DialogueEngine.js`

Dialogue tree runner. Loads `data/dialogue.json`. Exposes `startDialogue(nodeId, worldState)`, `selectResponse(index)`, executes outcomes, returns next node or `null` (end). Fires quest/flag side effects through `QuestEngine`.

---

## PT-018: `engine/QuestEngine.js`

Quest state manager. Tracks active/completed/failed quest IDs and objective completion flags. Listens for world flag changes and auto-advances objectives. Exposes `startQuest`, `setFlag`, `isComplete`, `getJournalData`.

---

## PT-019: `engine/PathFinder.js`

A* pathfinding on a tile grid. Input: collision map array, start tile, goal tile. Output: array of `{x,y}` tile waypoints. Includes string-pulling smoothing. Used by `ExplorationState` and AI movement.

---

## PT-020: `engine/AIController.js`

Per-entity AI behaviour executor. Each frame, if the entity's AI mode is not Passive, the controller selects an action (move toward enemy, attack, cast spell, use item) based on the entity's `aiMode` and combat state. Dispatches actions back to `CombatState`.

---

## PT-021: `engine/CharacterFactory.js`

Builds new `Entity` objects from race/class JSON data. Rolls starting ability scores (`4d6 drop lowest`), sets base AC, THAC0, saving throws, initial HP, and starting equipment per class definition.

---

## PT-022: `engine/IsoMath.js`

Isometric coordinate utilities: `worldToScreen`, `screenToWorld`, `depthSort`. Used by all rendering code.

---

## PT-023: `engine/FogOfWar.js`

Per-area fog-of-war bitmask manager. `reveal(tileX, tileY, radius)` — marks tiles within radius of visible. `isRevealed(tileX, tileY)` — query. `renderOverlay(ctx, canvas)` — paints semi-transparent black over unrevealed tiles. Serialisable to `Uint8Array` for save files.

---

## PT-024: `engine/SaveManager.js`

IndexedDB persistence layer. `save(slotName, gameState)`, `load(slotName)`, `listSlots()`, `deleteSlot(slotName)`. Serialises game state to JSON. Handles QuickSave (F5) and QuickLoad (F9) bindings.

---

## PT-025: `engine/SettingsManager.js`

localStorage-backed settings store. `get(key)`, `set(key, value)`, `getAll()`. Used by `OptionsState` and `AudioManager`.

---

## PT-026: `engine/AssetLoader.js`

Asynchronous asset pipeline. Loads PNG sprite sheets, area backgrounds, and audio files in parallel using `Promise.all`. Reports progress as a percentage for a loading bar. Caches all assets by key in a central `AssetStore`.

---

## PT-027: `engine/AudioManager.js`

Web Audio API wrapper. `playMusic(trackId)` (looping, crossfade), `playSfx(sfxId)` (fire-and-forget), `setMasterVolume`, `setMusicVolume`, `setSfxVolume`. Uses chained GainNodes.

---

## PT-028: `ui/HUD.js`

Persistent in-game HUD DOM overlay. Renders party portrait bar (HP bars, status icons), action bar (attack, cast spell, inventory, journal, rest, map buttons), minimap canvas, pause indicator, and status message area.

---

## PT-029: `ui/SpellbookPanel.js`

DOM overlay panel for spell selection and memorisation management. Shows known spells by level, available memorisation slots, and drag/click to equip spells to slots.

---

## PT-030: `ui/LevelUpPanel.js`

DOM overlay presented when a character earns a level. Shows HP roll result, new spell slots (if applicable), and thief skill point allocation (if applicable). Confirms and applies the level-up to the entity.

---

## PT-031: `renderer/AreaRenderer.js`

Canvas renderer for the isometric game world. Each frame: clears canvas, draws background PNG, depth-sorts all entities and ground items, draws each sprite at the correct screen coordinate via `IsoMath`, draws fog-of-war overlay, draws targeting reticles and selection circles.

---

## PT-032: `renderer/SpriteAnimation.js`

Frame-based sprite animation player. Each animated entity has an animation definition (frame count, frame duration, spritesheet row per direction/action). `SpriteAnimation.update(dt)` advances frames; `draw(ctx, x, y)` blits the current frame.

---

## PT-033: `data/races.json`

Race data: name, stat bonuses/penalties, allowed classes, base movement speed.

---

## PT-034: `data/classes.json`

Class data: name, hit die, XP thresholds per level (1–20), THAC0 table, saving throw tables, spell slot table per level, proficiency slots, thief skill point gain.

---

## PT-035: `data/spells.json`

Spell data: id, name, level, school, range, area-of-effect shape and radius, duration, effect type, damage dice, saving throw category.

---

## PT-036: `data/items.json`

Item data: id, name, type, equip slot, weight, damage dice (weapons), AC bonus (armour), gold buy/sell value, unidentified name, properties.

---

## PT-037: `data/areas.json`

Area data: id, display name, background image path, collision map path, entrance/exit points, random encounter table id, safe-rest flag, music track id.

---

## PT-038: `data/dialogue.json`

Dialogue tree data: node id, NPC portrait id, speaker name, text, responses (text, condition, outcomes), outcome action descriptors.

---

## PT-039: `data/quests.json`

Quest data: id, title, description, objectives (id, text, completion flag), XP reward.

---

## PT-040: `data/companions.json`

Companion NPC data: id, name, portrait, starting area id, join dialogue node id, base entity stats, initial inventory, personality flags.

---

## PT-041: `data/encounters.json`

Random encounter tables: keyed by encounter table id, listing encounter groups with probability weights and entity compositions.

---

## PT-042: `index.css`

Global styles. Positions `#game-canvas` as full-screen block. Styles `#hud` and `#ui-layer` as absolute overlays. Provides common panel, button, slider, and tab styles used by all UI components.
