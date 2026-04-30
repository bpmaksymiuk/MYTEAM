(Architect)

# Parts List — Super Mario Bros Web Platformer

**Stage:** 5 — Architecture
**Source:** `5-ARCHITECTURE-RECOMMENDATIONS.md`, `4-REQUIREMENTS.md`, `1-USE-CASES.md`
**Date:** 2026-04-28

---

## PT-001 : BootScene
- DESCRIPTION
  Phaser scene that runs immediately on page load. Preloads all game assets (spritesheets, tilemaps, audio files) and displays a loading progress bar. Transitions to MenuScene when all assets are loaded.
- TECHNOLOGY RECOMMENDATIONS
  Phaser 3 `Phaser.Scene` with `preload()` lifecycle method. Load progress tracked via Phaser `LoaderPlugin` events. CSP meta tag declared in `index.html` before scene initialisation.
- NOTES
  Must complete within 5 seconds on a 10 Mbps connection (BR-003, BR-041). Zero asset-load errors permitted in browser console (BR-047). Reads `assets-manifest.json` and cross-checks loaded keys for developer-mode verification.
- RELATED
  UC-001 | BR-001, BR-003, BR-039, BR-041, BR-043, BR-047, BR-052 | AR-001, AR-010, AR-011

---

## PT-002 : MenuScene
- DESCRIPTION
  Phaser scene presenting the title screen with interactive elements: New Game, Level Select (if unlocked levels > 0), and Options (audio mute toggle). Reads unlocked-level data from StorageManager to populate Level Select.
- TECHNOLOGY RECOMMENDATIONS
  Phaser 3 `Phaser.Scene`. Buttons implemented as Phaser GameObjects (Text or Image with `setInteractive()`). Background image from `./build/images/`.
- NOTES
  Selecting New Game must transition to GameScene (level 1) within 2 seconds (BR-002). Level Select is only available if at least one level beyond level 1 has been unlocked (UC-001 acceptance criterion 4).
- RELATED
  UC-001 | BR-001, BR-002, BR-039 | AR-001, AR-004, AR-009

---

## PT-003 : GameScene
- DESCRIPTION
  Primary gameplay scene. Loads the designated level tilemap, instantiates all entities via EntityFactory, runs the Arcade physics step, processes player input, manages the level timer, and emits HUD update events. On level completion, triggers LevelCompleteScene. On player death, decrements lives and either restarts the level or triggers GameOverScene.
- TECHNOLOGY RECOMMENDATIONS
  Phaser 3 `Phaser.Scene`. Arcade Physics world active. TilemapLayer for tile collision. Phaser Groups for enemies and collectibles. Phaser EventEmitter for HUD communication. Scene pause (not stop) for PauseScene overlay.
- NOTES
  GameScene does not manage HUD display directly — all score/lives/timer values are emitted to HUDScene via events (BR-036 via AR-012). Must not restart scene on pause — entity state must be preserved exactly (BR-031).
- RELATED
  UC-002, UC-003, UC-004, UC-005, UC-006, UC-007, UC-008, UC-009 | BR-004–BR-038 | AR-001, AR-002, AR-003, AR-004, AR-005, AR-006, AR-007, AR-012

---

## PT-004 : HUDScene
- DESCRIPTION
  Phaser scene launched concurrently with GameScene at a higher display depth. Renders and updates the score counter, lives display, level identifier, and countdown timer. Listens for events from GameScene via Phaser's global event bus.
- TECHNOLOGY RECOMMENDATIONS
  Phaser 3 `Phaser.Scene` launched with `this.scene.launch('HUDScene')` from GameScene. Phaser Text GameObjects for each HUD element. Event listeners on `this.game.events` or a shared EventEmitter singleton.
- NOTES
  HUD must always be visible without requiring player interaction (BR-036). Camera in HUDScene must be fixed (no scroll) regardless of GameScene camera position. Timer updates at 1-second intervals; reaching 0 triggers death (BR-038).
- RELATED
  UC-011 | BR-036, BR-037, BR-038 | AR-001, AR-004, AR-012

---

## PT-005 : PauseScene
- DESCRIPTION
  Phaser scene launched over GameScene when Escape/P is pressed during active gameplay. Displays a translucent overlay with Resume and Return to Title options. Suspends GameScene physics and timers without stopping the scene.
- TECHNOLOGY RECOMMENDATIONS
  Phaser 3 `Phaser.Scene` launched with `this.scene.pause('GameScene')` and `this.scene.launch('PauseScene')`. Overlay rendered as a semi-transparent rectangle GameObject. Resume dismisses PauseScene and calls `this.scene.resume('GameScene')`.
- NOTES
  Must not be accessible during death or level-transition animations (BR-029 NOTES). All entity positions, velocities, and timer values must be identical before and after pause (BR-031).
- RELATED
  UC-009 | BR-029, BR-030, BR-031 | AR-001, AR-004

---

## PT-006 : LevelCompleteScene
- DESCRIPTION
  Phaser scene displayed after the goal trigger is reached. Shows final score for the level, time remaining, and a Next Level button. Writes updated high score and unlocked level to StorageManager. Transitions to the next GameScene level or GameCompleteScene if the final level was completed.
- TECHNOLOGY RECOMMENDATIONS
  Phaser 3 `Phaser.Scene`. Retrieves session score and timer value from GameScene data registry. Writes to StorageManager before rendering. Loads next level JSON on Next Level activation.
- NOTES
  Must display correct score and remaining time (BR-019 TESTABLE CONDITION). Final-level completion must show a distinct game-complete screen before returning to MenuScene (BR-021).
- RELATED
  UC-006 | BR-019, BR-020, BR-021, BR-037 | AR-001, AR-004, AR-009

---

## PT-007 : GameOverScene
- DESCRIPTION
  Phaser scene displayed when the player's lives reach 0. Offers Restart (reset lives to 3, load level 1) and Return to Title (load MenuScene) options. Clears in-progress session state.
- TECHNOLOGY RECOMMENDATIONS
  Phaser 3 `Phaser.Scene`. Interactive Text or Button GameObjects. StorageManager called to persist high score before state reset.
- NOTES
  Must display immediately after the last life is lost (BR-024). Restart resets lives to 3 and loads level 1 — it does not continue from current level.
- RELATED
  UC-007 | BR-024 | AR-001, AR-004, AR-009

---

## PT-008 : PlayerEntity
- DESCRIPTION
  Phaser Arcade Physics sprite representing the player character. Implements the player FSM (idle, running, jumping, falling, dead, enlarged, fire, invincible). Processes keyboard input, applies movement and jump physics, manages power-up state transitions, and dispatches collision and death events.
- TECHNOLOGY RECOMMENDATIONS
  Phaser 3 `Phaser.Physics.Arcade.Sprite`. Keyboard input via `Phaser.Input.Keyboard.createCursorKeys()` plus WASD and Z/X mappings. Player state stored as an instance property and mapped to animation keys. Variable jump via cut-gravity multiplier on early key release (AR-007). Hitbox dimensions change on enlarge/shrink transitions.
- NOTES
  Maximum horizontal speed ~200 px/sec (BR-007). Jump initial velocity ~350 px/sec upward (BR-051). Gravity ~500 px/sec² (BR-051). Invincibility frames applied after respawn (UC-007 NOTES). Stomp detection uses a narrow bottom-edge hitbox offset (BR-013).
- RELATED
  UC-002, UC-004, UC-005 | BR-004, BR-005, BR-006, BR-007, BR-008, BR-013, BR-014, BR-016, BR-017, BR-018, BR-051 | AR-002, AR-005, AR-007

---

## PT-009 : EnemyEntity (Goomba + Koopa subtypes)
- DESCRIPTION
  Phaser Arcade Physics sprites for patrolling enemies. Goomba variant patrols and is defeated by a single stomp. Koopa variant enters shell state on stomp; shell slides and defeats enemies on contact. Hazard obstacles are stationary or track-following non-AI entities also derived from this component.
- TECHNOLOGY RECOMMENDATIONS
  Phaser 3 `Phaser.Physics.Arcade.Sprite`. Patrol logic in `update()`: check wall tile collision and platform-edge detection each frame; invert `velocityX` on boundary. Shell state promoted to a separate `KoopaShell` entity on stomp. Enemy group managed by Phaser Group for bulk overlap/collision registration.
- NOTES
  Minimum two enemy types for MVP (UC-004 NOTES). Koopa shell sliding at fixed speed (~250 px/sec) in the direction it was kicked. Shell bounces off walls indefinitely until stopped by player or obstacle.
- RELATED
  UC-004 | BR-011, BR-012, BR-013, BR-014 | AR-002, AR-006

---

## PT-010 : PlatformSystem (TilemapLayer + Moving/Breakable/Disappearing Platforms)
- DESCRIPTION
  Manages static tile collision via Phaser TilemapLayer (solid ground, elevated solid, one-way pass-through). Also provides three special platform entity types: MovingPlatform (linear path, carries player), BreakablePlatform (visual damage on contact, removed after N contacts), DisappearingPlatform (warning animation, removed after a brief delay).
- TECHNOLOGY RECOMMENDATIONS
  Phaser 3 `Phaser.Tilemaps.TilemapLayer` for static tiles. Moving/Breakable/Disappearing platforms as Phaser Arcade Physics static sprites with custom update logic. One-way platform implemented via Phaser `setCollideWorldBounds` and process-callback on the collision that allows upward-moving bodies to pass through.
- NOTES
  Three tile types required for MVP (BR-009). Moving platforms must update player position each frame while player is standing on them (BR-010 — player inherits platform velocity). Breakable platforms must visually show damage state before removal (UC-003 acceptance criterion 3).
- RELATED
  UC-003 | BR-008, BR-009, BR-010 | AR-002, AR-003

---

## PT-011 : CollectibleSystem (Coins, Power-ups, Hidden Blocks)
- DESCRIPTION
  Manages all collectible items: coins, mushroom, fire-flower, star, 1-up, and question-mark/hidden blocks. Items are spawned from level data on scene load. Hidden blocks are invisible or disguised tiles that activate on upward strike. Activated blocks release their configured item via EntityFactory.
- TECHNOLOGY RECOMMENDATIONS
  Phaser 3 Arcade Overlap callbacks for coin/power-up collection. Hidden blocks implemented as Phaser Arcade static sprites (zero alpha or matching solid-tile appearance); overlap/collision with player from below (using velocity direction check) triggers activation. Item spawning delegates to EntityFactory (AR-006).
- NOTES
  Question-mark blocks and hidden blocks are loaded from the Tiled object layer (AR-003). Block contents are a data property, not hardcoded. Only one power-up active at a time — new pickup replaces current (UC-005 NOTES).
- RELATED
  UC-005, UC-008 | BR-015, BR-016, BR-017, BR-018, BR-025, BR-026, BR-027, BR-028 | AR-003, AR-006

---

## PT-012 : LevelLoader
- DESCRIPTION
  Utility responsible for reading a Tiled JSON tilemap file for a given level index and constructing the TilemapLayer, enemy spawns, item spawns, goal trigger, pipe transitions, and start-position marker. Returns a structured level context object consumed by GameScene.
- TECHNOLOGY RECOMMENDATIONS
  Phaser 3 `this.make.tilemap({ key: 'levelN' })`. Object layers parsed via `tilemap.getObjectLayer('enemies').objects` etc. Delegates enemy/item instantiation to EntityFactory. Goal trigger zone is a Phaser zone (invisible rectangle) registered for overlap detection.
- NOTES
  Level files: `./build/levels/level-01.json` through `level-08.json` (minimum 8 levels — BR-020). Pipe transition to bonus area is a special trigger type that loads a bonus-area sub-level map and stores re-entry point data.
- RELATED
  UC-003, UC-006, UC-008 | BR-011, BR-015, BR-019, BR-020, BR-026, BR-027, BR-028 | AR-003, AR-006

---

## PT-013 : AudioManager
- DESCRIPTION
  Wrapper around Phaser 3's built-in audio system. Manages background music playback (loop/stop/change), sound effect playback by named event type, global mute toggle, and default-on state on first load.
- TECHNOLOGY RECOMMENDATIONS
  Phaser 3 `this.sound` API. Music via `this.sound.add(key, { loop: true })`. SFX via `this.sound.play(key)`. Mute via `this.sound.setMute(bool)`. AudioManager is a shared service instantiated once in BootScene and accessed via the Phaser game registry.
- NOTES
  Default state: unmuted (BR-050). Mute toggle persists to StorageManager (`audioMuted` field) so preference survives reload. No external audio CDN calls (BR-034, BR-044). Six minimum named SFX events required (BR-033).
- RELATED
  UC-010 | BR-032, BR-033, BR-034, BR-035, BR-050 | AR-001, AR-008

---

## PT-014 : StorageManager
- DESCRIPTION
  Utility class wrapping `window.localStorage` reads and writes under a namespaced key (`smb-save`). Provides typed get/set methods for high score, unlocked level, and audio mute preference. Handles missing or corrupted localStorage data gracefully.
- TECHNOLOGY RECOMMENDATIONS
  Vanilla JavaScript class. `localStorage.getItem('smb-save')` / `localStorage.setItem('smb-save', JSON.stringify(data))`. No external storage library. Error handling: catch `JSON.parse` errors and return defaults.
- NOTES
  No remote writes (BR-045, BR-049, BR-053). No cookies, sessionStorage, or IndexedDB. Data schema: `{ highScore: number, unlockedLevel: number, audioMuted: boolean }`. Default values returned when key is absent (fresh session).
- RELATED
  UC-006, UC-007 | BR-045, BR-049, BR-053 | AR-009

---

## PT-015 : AssetManifest
- DESCRIPTION
  A JSON file at `./build/assets-manifest.json` enumerating every asset used in the game with its filename (relative to `./build/`), source URL or origin label, and applicable license identifier.
- TECHNOLOGY RECOMMENDATIONS
  Plain JSON. No runtime library required — the file is read by BootScene for developer-mode verification and by the Tester for compliance audit.
- NOTES
  Entry schema: `{ "file": string, "source": string, "license": "CC0" | "original" | "CC-BY" }`. No Nintendo-copyrighted assets may appear (BR-048). All asset filenames present in `./build/` must have a corresponding manifest entry (BR-052 TESTABLE CONDITION).
- RELATED
  UC-001 | BR-043, BR-048, BR-052 | AR-011

---

## PT-016 : PhysicsConfig and GameConfig
- DESCRIPTION
  A single configuration module exporting all tuneable numeric constants and Phaser game configuration. Includes: canvas dimensions, target fps (60), gravity (~500 px/sec²), player max speed (~200 px/sec), jump velocity (~350 px/sec), cut-gravity multiplier, level timer default (300 s), starting lives (3), and point values per event type.
- TECHNOLOGY RECOMMENDATIONS
  Plain ES module (`config.js`) with named exports. Consumed by BootScene (Phaser.Game constructor config) and by PlayerEntity, GameScene, and HUDScene.
- NOTES
  All values are configurable constants — no magic numbers in game logic (BR-007 NOTES, BR-051 NOTES). Changing gravity or jump velocity in this file must produce a proportionally different arc (BR-051 TESTABLE CONDITION).
- RELATED
  UC-002 | BR-003, BR-006, BR-007, BR-022, BR-038, BR-040, BR-046, BR-051 | AR-002, AR-007

---

## Exit Gate Verification

| Gate | Status |
|------|--------|
| Every PT maps to at least one UC, BR, and AR | PASS — All 16 PTs have RELATED fields covering UC, BR, and AR |
| Every PT has a clear boundary and responsibility | PASS — Each PT covers a single logical concern |
| Technology recommendations are concrete and named | PASS — All 16 PTs name specific Phaser 3 APIs, vanilla JS, or JSON formats |
| PT IDs are sequential and never reused | PASS — PT-001 through PT-016, no gaps |
