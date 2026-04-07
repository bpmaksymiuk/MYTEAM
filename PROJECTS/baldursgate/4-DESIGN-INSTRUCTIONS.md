# Design Instructions

**Project:** Baldur's Gate (Recreation)
**Source:** 3-ARCHITECTURE-RECOMMENDATIONS.md, 3-PARTS LIST.md
**Parts covered:** PT-001 – PT-042

---

## DI-001: Project Shell — `index.html` + `index.css` (PT-001, PT-042)

### `index.html`
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Baldur's Gate</title>
  <link rel="stylesheet" href="index.css">
</head>
<body>
  <canvas id="game-canvas"></canvas>
  <div id="hud" class="overlay hidden"></div>
  <div id="ui-layer" class="overlay"></div>
  <script type="module" src="main.js"></script>
</body>
</html>
```

- Canvas is the only non-overlay element; it fills the full viewport.
- Script is `type="module"` so all JS files can use ES module `import/export`.
- `#hud` and `#ui-layer` are hidden by default until the game starts.

### `index.css`
- `body, html { margin:0; padding:0; overflow:hidden; background:#000; width:100vw; height:100vh; }`
- `#game-canvas { display:block; width:100vw; height:100vh; }` — `canvas.width`/`height` set in JS to match `window.innerWidth/Height`.
- `.overlay { position:absolute; top:0; left:0; width:100%; height:100%; pointer-events:none; }`
- `.overlay.active { pointer-events:auto; }`
- `.hidden { display:none; }`
- Define CSS custom properties: `--bg-panel`, `--text-primary`, `--text-dim`, `--accent`, `--danger` for consistent UI theming.
- Provide base classes: `.panel`, `.btn`, `.btn-primary`, `.slider-row`, `.tab-bar`, `.tab`, `.tab.active`.

---

## DI-002: Entry Point — `main.js` (PT-002)

`main.js` is an ES module. Execution order:

1. **Resize canvas** to `window.innerWidth × window.innerHeight`. Add `resize` event listener to update canvas and call `StateManager.onResize()`.
2. **Load JSON data** — `fetch` all 9 JSON files in parallel (`Promise.all`). Freeze each into `window.GameData = { races, classes, spells, items, areas, dialogue, quests, companions, encounters }`.
3. **Initialise singletons** — `SettingsManager.init()`, `AudioManager.init()`, `SaveManager.init()`.
4. **Asset loading** — `AssetLoader.load(onProgress)` — loads placeholder/fallback assets if real assets are absent (log warning, use coloured rectangles as sprite fallbacks).
5. **Bootstrap state** — `StateManager.setState(new MainMenuState())`.
6. **Start loop** — `requestAnimationFrame(tick)` where `tick(timestamp)` computes `dt = (timestamp - prev) / 1000`, clamps `dt` to max 0.1 s, calls `StateManager.update(dt)` then `StateManager.render(ctx)`.

---

## DI-003: State Manager — `StateManager.js` (PT-003)

```js
export const StateManager = {
  current: null,
  ctx: null,        // CanvasRenderingContext2D
  canvas: null,

  init(canvas) { this.canvas = canvas; this.ctx = canvas.getContext('2d'); },

  setState(newState) {
    this.current?.exit?.();
    this.current = newState;
    newState.enter?.();
  },

  update(dt) { this.current?.update(dt); },
  render()   { this.current?.render(this.ctx); },
  onResize() { this.current?.onResize?.(); },
};
```

Each state class implements the interface: `enter()`, `exit()`, `update(dt)`, `render(ctx)`, `onResize()`. All are optional.

---

## DI-004: Main Menu State — `states/MainMenuState.js` (PT-004)

- On `enter()`: show a `#main-menu` DOM div (inside `#ui-layer`) with four `<button>` elements: New Game, Load Game, Options, Quit.
- Draw a static title-screen background image (or solid dark gradient fallback) each frame in `render(ctx)`.
- Button click handlers:
  - **New Game** → `StateManager.setState(new CharacterCreationState())`
  - **Load Game** → `StateManager.setState(new LoadScreenState())`
  - **Options** → show `OptionsPanel` overlay (does not leave MainMenuState)
  - **Quit** → `window.close()` (no-op in browser; show "Close this tab to quit." message)
- On `exit()`: remove `#main-menu` div.

---

## DI-005: Character Creation State — `states/CharacterCreationState.js` (PT-005)

Render via DOM overlay panel `#char-creation`. Five steps, each a sub-panel navigated with Back/Next buttons:

1. **Name** — `<input type="text" maxlength="30">`.
2. **Race** — radio buttons from `GameData.races`. Selecting a race filters valid classes.
3. **Class** — radio buttons. Validate allowed combinations by checking `GameData.races[selectedRace].allowedClasses`. Disable invalid options.
4. **Ability Scores** — display six stat blocks (STR/DEX/CON/INT/WIS/CHA). Roll button: `4d6 drop lowest` per stat via `CombatEngine.rollD`. Show roll result. Allow unlimited re-rolls. Allow manual point-buy as an alternative (optional enhancement).
5. **Portrait** — grid of portrait `<img>` thumbnails from a `portraits/` folder; clicking selects.

On **Confirm**: call `CharacterFactory.createPlayer({ name, race, class, stats, portrait })`, set `GameData.playerEntity`, then `StateManager.setState(new PlayingState(startingAreaId))`.

---

## DI-006: Playing State — `states/PlayingState.js` (PT-006)

The root playing state owns all persistent game data:

```js
class PlayingState {
  constructor(areaId) {
    this.areaId = areaId;
    this.party = [];          // Entity[]
    this.worldFlags = {};     // flat key-value store
    this.subState = null;     // current ExplorationState / CombatState / etc.
    this.area = null;         // loaded area data + collision map
  }
}
```

- `enter()`: load area assets via `AssetLoader`, build collision tile grid, create `FogOfWar` for area, init `QuestEngine`, init `HUD`, then `setSubState(new ExplorationState(this))`.
- `setSubState(s)`: calls `subState.exit()`, sets new, calls `enter()`.
- `update(dt)`: tick `subState.update(dt)`.
- `render(ctx)`: call `AreaRenderer.render(ctx, this)`, then `subState.render(ctx)`.
- `transitionArea(newAreaId, entryPoint)`: save fog-of-war bitmask for current area, load new area, reposition party at `entryPoint`.

---

## DI-007: Exploration State — `states/substate/ExplorationState.js` (PT-007)

- **Mouse click on canvas**: convert via `IsoMath.screenToWorld(sx, sy)` → tile coords. If tile passable, call `PathFinder.find(partyLeaderTile, targetTile, collisionMap)` and assign path to party leader. Followers get offset paths.
- **Mouse move**: highlight hovered entity (NPC, enemy, container) with a selection circle.
- **Click on entity**: if NPC/friendly → `playing.setSubState(new DialogueState(entity))`. If container → open inventory overlay. If enemy → begin combat (`CombatState`).
- **Each update(dt)**: advance party along paths (speed = entity.moveSpeed tiles/s). Detect area exits. Call `FogOfWar.reveal(leaderTile, visionRadius)` each step.
- **Rest button** (from HUD): `playing.setSubState(new RestState())`.
- **Minimap**: call `FogOfWar.renderOverlay` onto `#minimap-canvas` in `#hud` each second.

---

## DI-008: Combat State — `states/substate/CombatState.js` (PT-008)

```
CombatState {
  combatants: Entity[],   // party + enemies in this encounter
  paused: boolean,
  actionQueues: Map<entityId, Action[]>,
  initiative: Entity[],   // sorted by DEX desc
}
```

- **Spacebar** toggles `paused`. Show PAUSED indicator in HUD.
- **Each update(dt)** (if not paused): process each combatant's action queue head. An action has a `cooldown` timer; decrement by `dt`. When cooldown reaches 0, resolve action:
  - `ATTACK` → `CombatEngine.resolveAttack(attacker, target)`, then `CombatEngine.resolveDamage`, apply to target HP.
  - `CAST_SPELL` → `CombatEngine.applySpellEffect(spell, targets, caster)`.
  - `MOVE` → advance along path.
- **Player commands** (via HUD action bar): right-click target to assign ATTACK action; click spell icon to enter targeting mode then CAST_SPELL.
- **AI combatants** (enemies): call `AIController.chooseAction(entity, combatants)` each `dt` when action queue empty.
- **End of combat**: all enemies HP ≤ 0 or fled → award XP, check level-ups, return to ExplorationState.

---

## DI-009: Dialogue State — `states/substate/DialogueState.js` (PT-009)

- `enter()`: show `#dialogue-panel` DOM overlay. Call `DialogueEngine.startDialogue(npc.dialogueNodeId, playing.worldFlags)`. Render first node.
- Node render: NPC portrait, name, text in scrollable div, numbered response buttons.
- Response click: `DialogueEngine.selectResponse(index)`. Engine executes outcomes (set flags, give items, start quests, adjust reputation). Returns next node or `null`.
- If `null`: hide panel, return to `ExplorationState`. If outcome is `triggerCombat`: transition to `CombatState`.
- `update(dt)`: no game world ticks during dialogue (exploration/combat frozen).

---

## DI-010: Inventory State — `states/substate/InventoryState.js` (PT-010)

- Show `#inventory-panel` DOM overlay for the selected character.
- Left column: character portrait, stats summary (STR/DEX/CON/INT/WIS/CHA, HP/maxHP, AC, THAC0, gold).
- Centre column: equipment slots grid (12 slots as labelled `<div>` drop targets).
- Right column: bag grid (20 `<div>` slots).
- Top: tab buttons for each party member to switch character.
- **Drag-and-drop**: `dragstart` / `dragover` / `drop` events on slot divs. On drop, validate: check slot type matches item equip slot; check class/race equip restrictions; check weight total.
- **Right-click item**: context menu with Use / Equip / Drop / Give (select target party member) / Identify (if at shop).
- Weight total displayed as `X / Y lbs` below bag; red if over limit.

---

## DI-011: Shop State — `states/substate/ShopState.js` (PT-011)

- Show `#shop-panel` DOM overlay with two columns: Merchant Stock (left) and Player Inventory (right).
- Each item row: icon, name, price. Unidentified items show "Unidentified [type]" and cannot be bought until identified.
- **Buy**: deduct gold from `playing.partyGold`. Add item to player inventory (first available bag slot). Disable buy button if insufficient gold or inventory full.
- **Sell**: add `Math.floor(item.value * 0.5 * charismaModifier(party.leader))` gold. Remove from inventory.
- **Identify**: deduct flat 100 gp. Set `item.identified = true`. Refresh display.
- Sell price modifier: Charisma 1-8 → 0.4×; 9-12 → 0.5×; 13-18 → 0.6×.

---

## DI-012: Journal State — `states/substate/JournalState.js` (PT-012)

- Show `#journal-panel` DOM overlay.
- Three tabs: Active, Completed, Failed. Clicking tab filters `QuestEngine.getJournalData()`.
- Each quest entry: bold title, description paragraph, bulleted objectives with ✓ or ○ prefix.
- Implemented as read-only; no interactions beyond tab switching and close button.

---

## DI-013: Map State — `states/substate/MapState.js` (PT-013)

- **World Map** view: full-screen canvas overlay. Draw world map background PNG. Overlay area location markers as `<div>` pins.
  - Visited areas: coloured pin, click to travel.
  - Unvisited areas: greyed pin, no click.
  - Travel click: if area is adjacent (1 hop), travel immediately; if distant, roll encounter per `data/encounters.json` encounter table for the route.
- **Local Map** view (toggle button): small panel showing fog-of-war bitmask as a greyscale image rendered to a small `<canvas>` element. Party position shown as a dot.
- Close button / Escape: return to previous substate.

---

## DI-014: Rest State — `states/substate/RestState.js` (PT-014)

- Show `#rest-panel` DOM overlay.
- Display party list with watch radio-button assignment (each member: On Watch / Sleeping).
- **Rest button**: call `simulateRest(playing)`:
  1. If area is dangerous: roll `Math.random() < encounterChance`. If hit, show "Your rest was interrupted!" and transition to `CombatState` with encounter group.
  2. If safe (or encounter not triggered): for each party member — restore HP by `level × ConModifier(entity)` (capped at maxHP); restore memorised spell slots to full.
- Transition back to `ExplorationState` on rest complete or skip.

---

## DI-015: Options State — `states/substate/OptionsState.js` (PT-015)

- Show `#options-panel` DOM overlay (accessible from Main Menu and Pause via `PlayingState`).
- Sliders (`<input type="range" min="0" max="100">`): Master Volume, Music Volume, SFX Volume. On `input` event: call `AudioManager.setMasterVolume(v/100)` etc. and `SettingsManager.set(key, v)`.
- Difficulty `<select>`: Easy / Normal / Hard / Insane. Stored as `SettingsManager.set('difficulty', val)`.
- Subtitles `<input type="checkbox">`. Stored as `SettingsManager.set('subtitles', bool)`.
- Scroll Speed `<select>`: Slow (150) / Medium (250) / Fast (400) pixels-per-second. Stored as `SettingsManager.set('scrollSpeed', val)`.
- On close: settings are already live-saved; no explicit Save button needed.

---

## DI-016: Combat Engine — `engine/CombatEngine.js` (PT-016)

Export a frozen `CombatEngine` object. All functions are pure.

```js
rollD(count, sides)           // returns sum of `count` rolls of d`sides`
roll4d6DropLowest()           // returns sum of 4d6 with lowest dropped
resolveAttack(attacker, defender)
  // rolls 1d20; hit if roll + (20 - attacker.thac0) >= (20 - defender.ac)
  // returns { result: 'HIT'|'MISS'|'CRITICAL', roll }
resolveDamage(attacker, weapon)
  // rolls weapon.damageDice; adds STR bonus for melee
  // returns number
resolveSavingThrow(entity, category)
  // rolls 1d20 vs entity.savingThrows[category]; returns true=saved
applySpellEffect(spell, targets, caster, worldState)
  // dispatches to per-spell-type handlers; returns array of EffectResult
```

Saving throw table look-up: `GameData.classes[entity.class].savingThrows[entity.level][category]`.
THAC0 table look-up: `GameData.classes[entity.class].thac0[entity.level]`.
STR bonus table: standard AD&D 2e STR-to-hit/damage table (embed as a const array in this file).

---

## DI-017: Dialogue Engine — `engine/DialogueEngine.js` (PT-017)

```js
DialogueEngine = {
  tree: null,       // loaded dialogue.json
  current: null,    // current node
  worldState: null, // reference to playing.worldFlags

  startDialogue(nodeId, worldState) → node | null,

  selectResponse(index) → node | null,
    // executes node.responses[index].outcomes:
    //   setFlag(key, val) → worldState[key] = val
    //   startQuest(id)    → QuestEngine.startQuest(id)
    //   updateObjective(questId, objId) → QuestEngine.setFlag(...)
    //   giveItem(itemId)  → add to party leader inventory
    //   removeItem(itemId)
    //   adjustReputation(delta) → playing.reputation += delta (clamp 1-20)
    //   triggerCombat(groupId) → return special sentinel {type:'COMBAT', groupId}

  evaluateCondition(condition) → boolean,
    // condition: { flag, op, value } — ops: '==', '!=', '>', '<'
    // returns whether worldState[flag] satisfies the condition
}
```

Responses with a `condition` that evaluates false are hidden from the player.

---

## DI-018: Quest Engine — `engine/QuestEngine.js` (PT-018)

```js
QuestEngine = {
  active: {},     // questId → { ...quest, objectivesDone: Set }
  completed: [],  // questId[]
  failed: [],     // questId[]

  startQuest(questId),
  failQuest(questId),

  setFlag(questId, objectiveId),
    // marks objective done; if all objectives done → completeQuest()

  completeQuest(questId),
    // moves to completed[]; awards XP to all party members

  getJournalData() → { active, completed, failed },
    // returns arrays of { title, description, objectives: [{text, done}] }

  serialise() → plain object,
  deserialise(data),
}
```

---

## DI-019: PathFinder — `engine/PathFinder.js` (PT-019)

Implement A* on a flat `Uint8Array` collision map of dimensions `mapWidth × mapHeight` (0 = passable, 1 = blocked).

```js
PathFinder.find(startX, startY, goalX, goalY, collisionMap, mapWidth)
  → [{x, y}, …]   // tile-space waypoints, empty if no path
```

- Open set: min-heap ordered by `f = g + h` where `h = | goalX - x | + | goalY - y |`.
- 8-directional neighbours (diagonal cost = √2 ≈ 1.414).
- Post-process: string-pulling (remove intermediate waypoints that have clear line-of-sight to the one two steps ahead, using Bresenham's line rasterisation to check the collision map).
- Max search nodes: 10 000 (returns partial path to closest reached node if exceeded).

---

## DI-020: AI Controller — `engine/AIController.js` (PT-020)

```js
AIController.chooseAction(entity, allCombatants, collisionMap)
  → Action | null
```

AI modes:

| Mode | Behaviour |
|------|-----------|
| Aggressive | Attack nearest enemy; close distance if out of melee range |
| Defensive | Attack enemy targeting self or an ally with HP < 30%; otherwise hold |
| Passive | Do nothing (return null) |

Action object: `{ type: 'ATTACK'|'MOVE'|'CAST_SPELL', target?, path?, spell? }`.

Enemy AI always uses Aggressive mode. Cooldown between actions: `1 / entity.attacksPerRound` seconds.

---

## DI-021: Character Factory — `engine/CharacterFactory.js` (PT-021)

```js
CharacterFactory.createPlayer({ name, race, class: cls, stats, portrait })
  → Entity

CharacterFactory.createCompanion(companionId)
  → Entity   // from GameData.companions[companionId]

CharacterFactory.createEnemy(enemyDef)
  → Entity   // enemyDef is an inline object from encounters.json
```

Entity construction:
1. Copy base stats from `stats` param (or companion/enemy definition).
2. Apply race stat modifiers from `GameData.races`.
3. Look up THAC0 and saving throws from `GameData.classes[cls].thac0[1]` and `savingThrows[1]`.
4. Roll starting HP: `rollD(1, classData.hitDie) + conModifier(stats.CON)` (minimum 1).
5. Set `inventory = []`, `equipped = {}`, `memorisedSpells = {}`, `knownSpells = []`, `aiMode = 'Passive'` for player, `'Aggressive'` for enemies.
6. Grant starting equipment from `classData.startingEquipment` (array of item ids).

CON modifier table: CON 1-3 → -2; 4-6 → -1; 7-14 → 0; 15-16 → +1; 17 → +2; 18 → +3; 19+ → +4.

---

## DI-022: IsoMath — `engine/IsoMath.js` (PT-022)

Tile size constant: `TILE_W = 64, TILE_H = 32` (2:1 isometric ratio).

```js
IsoMath.worldToScreen(tileX, tileY)
  → { sx: (tileX - tileY) * TILE_W/2,
      sy: (tileX + tileY) * TILE_H/2 }

IsoMath.screenToWorld(sx, sy)
  → { tileX: Math.round((sx/TILE_W*2 + sy/TILE_H*2) / 2),
      tileY: Math.round((sy/TILE_H*2 - sx/TILE_W*2) / 2) }

IsoMath.depthSort(entities)
  → entities sorted ascending by (entity.tileY + entity.tileX * 0.5)
```

Camera offset: all `worldToScreen` results are offset by `{cameraX, cameraY}` (pixel offset from canvas top-left), enabling scrolling. Camera is a module-level `{x, y}` exported from this file.

---

## DI-023: Fog of War — `engine/FogOfWar.js` (PT-023)

```js
class FogOfWar {
  constructor(mapWidth, mapHeight)
    // this.map = new Uint8Array(mapWidth * mapHeight)

  reveal(tileX, tileY, radius)
    // for each tile within circle of `radius` tiles:
    //   set map[tileY * mapWidth + tileX] = 1

  isRevealed(tileX, tileY) → boolean

  renderOverlay(ctx, canvasW, canvasH, tileW, tileH, camera)
    // draw a dark semi-transparent rect over each tile where map[i] === 0

  serialise() → Uint8Array   // return map
  deserialise(arr)            // restore map = new Uint8Array(arr)
}
```

Vision radius for party: 8 tiles during exploration, 6 during combat.

---

## DI-024: Save Manager — `engine/SaveManager.js` (PT-024)

```js
SaveManager = {
  db: null,   // IDBDatabase

  async init()
    // open IndexedDB 'bg_saves' version 1
    // create object store 'slots' with keyPath 'name' if upgradeNeeded

  async save(slotName, gameState)
    // gameState = { areaId, party: Entity[], worldFlags, quests: QuestEngine.serialise(),
    //               fogMaps: { [areaId]: Uint8Array }, partyGold, reputation, discovered: string[] }
    // JSON.stringify — store as { name: slotName, timestamp, data: jsonString }

  async load(slotName) → gameState object

  async listSlots() → [{ name, timestamp }]   // sorted newest first

  async deleteSlot(slotName)
}
```

`F5` → `SaveManager.save('quicksave', buildGameState(playing))`, show HUD flash "Quick Saved".
`F9` → `SaveManager.load('quicksave')` → reconstruct `PlayingState` from data.

---

## DI-025: Settings Manager — `engine/SettingsManager.js` (PT-025)

```js
SettingsManager = {
  defaults: {
    masterVolume: 80, musicVolume: 70, sfxVolume: 80,
    difficulty: 'Normal', subtitles: true, scrollSpeed: 250
  },

  init()    // load from localStorage key 'bg_settings'; merge with defaults
  get(key)  // return current value
  set(key, value)  // update and persist to localStorage
  getAll()  // return full settings object
}
```

---

## DI-026: Asset Loader — `engine/AssetLoader.js` (PT-026)

```js
AssetLoader = {
  store: {},   // key → HTMLImageElement | AudioBuffer

  async load(onProgress)
    // reads a manifest (inline const MANIFEST = [...]) of { key, type, url }
    // for type 'image': new Image(), src = url, wait for onload
    // for type 'audio': fetch → arrayBuffer → AudioContext.decodeAudioData
    // calls onProgress(loaded/total) after each asset
    // on 404: log warning, store[key] = fallback (1×1 transparent png or silent buffer)

  get(key) → asset   // throws if key unknown
}
```

---

## DI-027: Audio Manager — `engine/AudioManager.js` (PT-027)

```js
AudioManager = {
  ctx: null,          // AudioContext
  masterGain, musicGain, sfxGain,  // GainNode
  currentMusicSource: null,

  init()
    // create AudioContext; connect masterGain → ctx.destination
    // connect musicGain → masterGain; sfxGain → masterGain
    // restore volumes from SettingsManager

  playMusic(trackId)
    // if currentMusicSource: schedule 1s crossfade then stop
    // create BufferSource from AssetLoader.get(trackId); loop=true; connect to musicGain; start

  playSfx(sfxId)
    // create BufferSource; connect to sfxGain; start; onended: disconnect

  setMasterVolume(v)   // masterGain.gain.value = v
  setMusicVolume(v)    // musicGain.gain.value = v
  setSfxVolume(v)      // sfxGain.gain.value = v
}
```

---

## DI-028: HUD — `ui/HUD.js` (PT-028)

Build `#hud` div structure on `init(party)`:

```
#hud
  #portrait-bar        ← one #portrait-{i} per party member
    .portrait-img      ← <img> with portrait
    .hp-bar            ← <div> width% = hp/maxHp
    .status-icons      ← <span> icons for poisoned, confused, etc.
  #action-bar
    #btn-attack, #btn-spell, #btn-inventory, #btn-journal, #btn-map, #btn-rest
  #minimap-canvas      ← <canvas width="150" height="150">
  #pause-indicator     ← text "PAUSED", hidden unless paused
  #status-msg          ← transient text messages (fade after 2s)
  #xp-bar              ← (optional) thin bar at bottom
```

- `HUD.update(party, paused)` called each frame to refresh HP bars and portrait highlights.
- `HUD.showMessage(text)` — sets `#status-msg`, fades after 2s using CSS transition.
- Portrait click → open InventoryState for that character.
- Clicking `#btn-*` fires corresponding state transitions or panel opens.

---

## DI-029: Spellbook Panel — `ui/SpellbookPanel.js` (PT-029)

- Show `#spellbook-panel` overlay for a given caster entity.
- Left column: spell levels 1–9 as accordion sections. Each section lists known spells for that level (from `entity.knownSpells` filtered by level via `GameData.spells`).
- Right column per level: memorisation slot boxes (count from class/level table). Drag a spell from left to fill a slot; click a slot to clear it.
- Bottom: "Memorise" button — validates all slots are filled (warn if not), saves `entity.memorisedSpells`.
- Read-only during combat (cannot rememorize in combat).

---

## DI-030: Level Up Panel — `ui/LevelUpPanel.js` (PT-030)

- Show `#levelup-panel` overlay when `PlayingState` detects XP threshold crossed.
- Header: "Character Name has reached Level N!"
- Show HP roll: animate d-roll number cycling. Final = `rollD(1, classHitDie) + conMod`.
- If caster: show new spell slot counts per level (diff from previous level).
- If thief: show skill point total gained; render allocation sliders for each thief skill.
- If fighter: show new proficiency slot (text only: "You gain 1 weapon proficiency slot").
- Confirm button: apply all changes to entity, dismiss panel.

---

## DI-031: Area Renderer — `renderer/AreaRenderer.js` (PT-031)

`AreaRenderer.render(ctx, playingState)` — called every frame in `PlayingState.render`:

1. `ctx.clearRect(0, 0, canvas.width, canvas.height)`.
2. Draw area background PNG at camera offset: `ctx.drawImage(bg, -camera.x, -camera.y)`.
3. Draw ground items (loot piles) using sprite or coloured square fallback.
4. Collect all entities (party + enemies + NPCs) visible in viewport. Call `IsoMath.depthSort(entities)`.
5. For each sorted entity: get screen pos via `IsoMath.worldToScreen(e.tileX, e.tileY)` minus camera, call `SpriteAnimation.draw(ctx, sx, sy)`.
6. Draw selection circles under active party member and hover target.
7. Draw spell AoE reticle if in targeting mode.
8. Call `FogOfWar.renderOverlay(ctx, ...)`.

---

## DI-032: Sprite Animation — `renderer/SpriteAnimation.js` (PT-032)

```js
class SpriteAnimation {
  constructor(entity)
    // entity.animDef = { sheet: 'key', frameW, frameH, rows: { idle, walk, attack, cast, die } }

  update(dt)
    // this.frameTimer += dt
    // if frameTimer >= frameDuration: advance frame, wrap at frameCount

  draw(ctx, sx, sy)
    // ctx.drawImage(sheet, srcX, srcY, frameW, frameH, sx - frameW/2, sy - frameH, frameW, frameH)
    // srcX = currentFrame * frameW; srcY = animRow * frameH
}
```

Direction: 8-directional (N, NE, E, SE, S, SW, W, NW) — map entity velocity vector to nearest direction, select spritesheet row accordingly. For placeholder sprites, draw a filled rectangle + direction indicator line.

---

## DI-033 – DI-041: JSON Data Files (PT-033 – PT-041)

Generate minimal but functional seed data files for each. All must be valid JSON.

### `data/races.json`
Array of race objects:
```json
[{ "id": "human", "name": "Human", "statMods": {}, "allowedClasses": ["fighter","mage","thief","cleric","druid","ranger","bard","paladin","sorcerer","shaman"], "moveSpeed": 3 }, ...]
```
Include all 7 races. Elves: +1 DEX, -1 CON; Dwarves: +1 CON, -1 CHA; etc. (per AD&D 2e).

### `data/classes.json`
Object keyed by class id. Each:
```json
{ "name":"Fighter", "hitDie":10, "xpTable":[0,2000,4000,8000,...],
  "thac0": [20,19,18,17,...],  // index = level-1, 20 levels
  "savingThrows": { "1": {"death":14,"wands":16,"polymorph":15,"breath":17,"spells":17}, ... },
  "spellSlots": null,           // null for non-casters
  "proficiencySlots": [4,0,0,1,0,0,1,...],  // proficiency gained per level
  "startingEquipment": ["longsword","chain-mail"] }
```
Include all 10 classes. Mage: `spellSlots: { "1": [1,0,0,0,0,0,0,0,0], "2": [2,1,0,...] }`.

### `data/spells.json`
Array of spell objects. Include at least: Magic Missile, Fireball, Sleep, Cure Light Wounds, Invisibility, Charm Person, Hold Person, Lightning Bolt, Fear, Ice Storm.
```json
{ "id":"magic-missile", "name":"Magic Missile", "level":1, "school":"Evocation",
  "range":120, "aoe":{"shape":"point"}, "duration":0, "effectType":"damage",
  "damageDice":{"count":1,"sides":4,"bonus":1}, "saveCategory":null }
```

### `data/items.json`
Array. Include starter weapons (longsword, dagger, quarterstaff, mace, short-bow), armours (leather, chain-mail, plate), and misc (healing-potion, scroll-magic-missile).
```json
{ "id":"longsword", "name":"Long Sword", "unidentifiedName":"Long Sword",
  "type":"weapon", "slot":"mainHand", "weight":4, "damageDice":{"count":1,"sides":8},
  "value":10, "properties":{} }
```

### `data/areas.json`
Include two areas: Candlekeep (`candlekeep`) and Nashkel (`nashkel`) as minimal stubs.
```json
{ "id":"candlekeep", "name":"Candlekeep", "background":"assets/areas/candlekeep.png",
  "collisionMap":"assets/areas/candlekeep_collision.png", "width":3200, "height":2400,
  "tileSize":10, "exits":[{"toArea":"nashkel","x":50,"y":120}],
  "encounterTableId":"wilderness-low", "safeRest":true, "musicTrack":"candlekeep-theme" }
```

### `data/dialogue.json`
Object keyed by node id. Include a minimal "Gorion" intro node and a merchant "Hello" node.
```json
{
  "gorion-intro": { "speakerName":"Gorion", "portrait":"gorion",
    "text":"We must leave Candlekeep at once. Are you ready?",
    "responses":[
      {"text":"Yes, I'm ready.", "outcomes":[{"type":"setFlag","key":"gorion_spoken","value":true}], "nextNode":null},
      {"text":"Not yet.", "outcomes":[], "nextNode":"gorion-intro"}
    ]
  }
}
```

### `data/quests.json`
Include one quest: "The Iron Crisis" with 2 objectives.
```json
[{ "id":"iron-crisis", "title":"The Iron Crisis",
   "description":"Iron ore throughout the region is turning brittle. Investigate.",
   "objectives":[
     {"id":"reach-nashkel","text":"Travel to Nashkel","completionFlag":"reached_nashkel"},
     {"id":"enter-mines","text":"Enter the Nashkel Mines","completionFlag":"entered_mines"}
   ], "xpReward":1000 }]
```

### `data/companions.json`
Include two companions: Imoen and Khalid.
```json
[{ "id":"imoen","name":"Imoen","portrait":"imoen","startingAreaId":"candlekeep",
   "joinDialogueNodeId":"imoen-join","class":"thief","level":1,
   "stats":{"STR":9,"DEX":18,"CON":16,"INT":15,"WIS":11,"CHA":16},
   "startingEquipment":["dagger"] },
 { "id":"khalid","name":"Khalid","portrait":"khalid","startingAreaId":"candlekeep",
   "joinDialogueNodeId":"khalid-join","class":"fighter","level":1,
   "stats":{"STR":15,"DEX":16,"CON":17,"INT":13,"WIS":14,"CHA":9},
   "startingEquipment":["longsword","chain-mail"] }]
```

### `data/encounters.json`
```json
{ "wilderness-low": [
    { "weight":3, "group":[{"type":"gibberling","count":4}] },
    { "weight":2, "group":[{"type":"wolf","count":2}] },
    { "weight":1, "group":[{"type":"xvart","count":6}] }
  ]
}
```
Enemy entries use inline `enemyDef` format (same schema as entity): `{ id, name, class:"enemy", level, stats, hp, ac, thac0, savingThrows, aiMode:"Aggressive", inventory:[], animDef }`.

---

## DI-042: Build Directory Structure

All files shall be created under `build/`:

```
build/
  index.html
  index.css
  main.js
  StateManager.js
  states/
    MainMenuState.js
    CharacterCreationState.js
    PlayingState.js
    LoadScreenState.js
    SaveScreenState.js
    substate/
      ExplorationState.js
      CombatState.js
      DialogueState.js
      InventoryState.js
      ShopState.js
      JournalState.js
      MapState.js
      RestState.js
      OptionsState.js
  engine/
    CombatEngine.js
    DialogueEngine.js
    QuestEngine.js
    PathFinder.js
    AIController.js
    CharacterFactory.js
    IsoMath.js
    FogOfWar.js
    SaveManager.js
    SettingsManager.js
    AssetLoader.js
    AudioManager.js
  ui/
    HUD.js
    SpellbookPanel.js
    LevelUpPanel.js
  renderer/
    AreaRenderer.js
    SpriteAnimation.js
  data/
    races.json
    classes.json
    spells.json
    items.json
    areas.json
    dialogue.json
    quests.json
    companions.json
    encounters.json
  assets/
    areas/         ← background PNGs and collision maps
    sprites/       ← sprite sheets
    audio/         ← music and sfx
    portraits/     ← NPC and character portrait PNGs
```

No build toolchain; files are served directly by any static web server or opened via `file://` (note: IndexedDB and `fetch()` for JSON require a local HTTP server — use `python3 -m http.server 8080 --directory build`).
