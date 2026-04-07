# Architecture Recommendations

**Project:** Baldur's Gate (Recreation)
**Source:** 2-REQUIREMENTS.md (BR-001 – BR-080)

---

## AR-001: Rendering — HTML5 Canvas (2D Isometric)

**Rationale:** BR-014, BR-015, BR-018

The game world shall be rendered onto a full-screen HTML5 `<canvas>` element using the 2D Context API. Each area background is a pre-rendered isometric PNG painted as a backdrop. Characters, items, and projectiles are sprite images drawn per-frame in depth order (ascending Y). A fixed game loop runs at 60 fps using `requestAnimationFrame`.

No WebGL is required for the initial recreation scope. The 2D canvas provides sufficient performance for isometric sprite rendering at 1920×1080.

---

## AR-002: Game Loop and State Machine

**Rationale:** BR-001–BR-005, BR-019–BR-020

The application shall run a single master game loop managing a **state machine** with the following top-level states:

- `MAIN_MENU`
- `CHARACTER_CREATION`
- `PLAYING` (subdivided: EXPLORATION, COMBAT, DIALOGUE, SHOP, JOURNAL, INVENTORY, MAP, OPTIONS, REST)
- `LOAD_SCREEN`
- `SAVE_SCREEN`

Each state owns an `update(dt)` and `render(ctx)` method. Only the active state tree is ticked. State transitions are driven by player actions and game events.

---

## AR-003: Pathfinding — A* on a Tile Grid

**Rationale:** BR-015, BR-017

Each area is divided into a 2D tile grid (logical resolution: 10 px per tile). Each tile stores a passability flag derived from the area's collision bitmap. Pathfinding uses A* with a Manhattan-distance heuristic. Paths are recalculated on each click and smoothed using string-pulling (funnel algorithm). All six party members queue behind the leader's path with per-character offset.

---

## AR-004: Combat Engine — AD&D 2e Rule Resolver

**Rationale:** BR-019–BR-026, BR-021–BR-023, BR-046–BR-052

A standalone `CombatEngine` module implements AD&D 2nd Edition rules:

- `rollD(n, sides)` — cryptographically fair dice (uses `Math.random`; no crypto requirement stated)
- `resolveAttack(attacker, defender)` — THAC0 vs AC, returns HIT / MISS / CRITICAL
- `resolveDamage(attacker, weapon)` — damage dice + Strength bonus
- `resolveSavingThrow(character, category)` — 1d20 vs class/level table
- `applySpellEffect(spell, targets, caster)` — dispatches to per-spell handlers

The engine is pure data-in / data-out (no DOM, no canvas). This enables deterministic unit testing.

---

## AR-005: Data-Driven Game Content — JSON Data Files

**Rationale:** BR-006–BR-013, BR-032–BR-037, BR-046–BR-057, BR-062–BR-065, BR-066–BR-071

All game content is authored in JSON files loaded at startup:

| File | Contents |
|------|----------|
| `data/races.json` | Race names, stat modifiers, class restrictions |
| `data/classes.json` | Class definitions, HD, XP tables, spell slot tables, proficiency tables |
| `data/spells.json` | Spell name, level, school, range, AoE, effect descriptor |
| `data/items.json` | Item definitions — type, slot, weight, damage, AC, gold value, identification name |
| `data/areas.json` | Area ID, display name, background image, collision map path, encounter table, safe-rest flag |
| `data/dialogue.json` | Dialogue trees — nodes with text, response options, condition checks, outcome actions |
| `data/quests.json` | Quest definitions — objectives, completion flags, XP reward |
| `data/encounters.json` | Random encounter tables keyed by area |
| `data/companions.json` | NPC companion definitions — location, join dialogue node, stats, portrait |

JSON data is loaded once at startup and held in a frozen global `GameData` object.

---

## AR-006: Entity-Component System (Lightweight)

**Rationale:** BR-025, BR-027–BR-031, BR-066–BR-071

All game entities (party members, enemies, NPCs, items on ground) are represented as plain JS objects with a well-defined schema:

```
Entity {
  id, type, name, portrait,
  race, class, level, xp,
  stats: { STR, DEX, CON, INT, WIS, CHA },
  hp, maxHp, ac, thac0,
  savingThrows: { death, wands, polymorph, breath, spells },
  inventory: Item[],
  equipped: { [slot]: Item },
  memorisedSpells: { [level]: SpellId[] },
  knownSpells: SpellId[],
  thiefSkills: { [skill]: number },
  aiMode, position: { x, y },
  statusEffects: Effect[],
  flags: {}
}
```

A `CharacterFactory` builds entities from JSON class/race data. Systems (combat, movement, AI, rendering) operate over entity arrays.

---

## AR-007: Dialogue and Quest Engine

**Rationale:** BR-038–BR-045

`DialogueEngine` loads dialogue trees from `data/dialogue.json`. Each tree node has:
- `text` (NPC speech)
- `responses[]` — each with `text`, optional `condition` (flag check), `outcomes[]`

Outcomes include: `setFlag`, `startQuest`, `updateObjective`, `completeQuest`, `giveItem`, `removeItem`, `adjustReputation`, `triggerCombat`.

`QuestEngine` manages active/completed/failed quest state and listens for flag changes to auto-update objectives.

Both engines operate against a shared **World State** flat key-value store (`flags: Map<string, any>`) which is serialised into save files.

---

## AR-008: Fog of War — Per-Area Bitmask

**Rationale:** BR-064, BR-065

Each area maintains a `Uint8Array` bitmask sized `(mapWidth/tileSize) × (mapHeight/tileSize)`. Bits are set when a tile enters any party member's line-of-sight radius; once revealed, they remain revealed for the session. The minimap renders this bitmask as a scaled canvas overlay. The bitmask is stored in the save file per area.

---

## AR-009: Persistence — LocalStorage + IndexedDB

**Rationale:** BR-072–BR-075, BR-080

- **Settings** (BR-080) are stored in `localStorage` as a JSON object (`bg_settings`).
- **Save slots** (BR-072–BR-075) are stored in `IndexedDB` (database: `bg_saves`, object store: `slots`). Each record has key `slot_N` (0–9) and a `quicksave` key. Values are JSON-serialised game state snapshots.
- QuickSave is bound to F5; QuickLoad to F9.

IndexedDB is used (over localStorage) because save files may exceed the 5 MB localStorage limit when storing area fog-of-war bitmasks and inventory state.

---

## AR-010: Audio — Web Audio API

**Rationale:** BR-076

An `AudioManager` module loads audio assets as `AudioBuffer` objects via `fetch` + `AudioContext.decodeAudioData`. It exposes:
- `playMusic(trackId)` — loops background music; crossfades on area transition
- `playSfx(sfxId)` — fire-and-forget sound effect
- `setMasterVolume(v)`, `setMusicVolume(v)`, `setSfxVolume(v)` — gain node control

Master, music, and SFX volumes use chained `GainNode` objects, preserving relative balance.

---

## AR-011: UI Layer — DOM Overlays on Canvas

**Rationale:** BR-032–BR-038, BR-042–BR-045, BR-053–BR-057, BR-076–BR-080

Non-game-world UI (inventory, dialogue, journal, shop, options, help) is rendered as absolutely-positioned HTML `<div>` panels layered above the canvas using CSS `z-index`. This avoids reimplementing text wrapping and scroll behaviour in canvas and enables accessible keyboard navigation. Each UI panel is a self-contained class with `show()` / `hide()` / `render(state)` methods.

The HUD (party portraits, action bar, minimap, status bar) is a persistent HTML overlay pinned to the bottom of the viewport.

---

## AR-012: Isometric Coordinate Utilities

**Rationale:** BR-014, BR-015, BR-018

A `IsoMath` utility module provides:
- `worldToScreen(wx, wy)` → `{sx, sy}` — converts world tile coords to canvas pixels
- `screenToWorld(sx, sy)` → `{wx, wy}` — converts mouse click to nearest tile
- `depthSort(entities)` — sorts by `y + x * 0.5` for correct isometric draw order

All rendering code consumes `IsoMath` to ensure consistency.
