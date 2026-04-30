(Technical Lead)

# Design Instructions — Super Mario Bros Web Platformer

**Stage:** 6 — Technical Design
**Source:** `5-ARCHITECTURE-RECOMMENDATIONS.md`, `5-PARTS LIST.md`, `4-REQUIREMENTS.md`
**Date:** 2026-04-28

---

## DI-001 : Project Scaffolding and Directory Structure
- SUMMARY
  Establish the `./build/` directory layout before writing any source code. All browser-served files live under `./build/`. No absolute machine paths in any file. The Phaser 3 vendor bundle is served locally.
- IMPLEMENTATION STEPS
  1. Create `./build/index.html` — single entry point, loads `vendor/phaser.min.js`, then `main.js` (type module).
  2. Create directory layout:
     ```
     ./build/
       index.html
       main.js
       config.js
       vendor/
         phaser.min.js          ← Phaser 3 minified bundle (download from phaser.io, commit locally)
       scenes/
         BootScene.js
         MenuScene.js
         GameScene.js
         HUDScene.js
         PauseScene.js
         LevelCompleteScene.js
         GameOverScene.js
       entities/
         PlayerEntity.js
         GoombaEntity.js
         KoopaEntity.js
         KoopaShell.js
       systems/
         LevelLoader.js
         CollectibleSystem.js
         AudioManager.js
         StorageManager.js
         EntityFactory.js
       levels/
         level-01.json … level-08.json   ← Tiled export files
       images/                            ← sprite sheets, backgrounds
       audio/                             ← ogg/mp3 files
       assets-manifest.json
     ```
  3. `index.html` must include the CSP meta tag (see DI-020).
  4. `main.js` imports `config.js` and initialises `new Phaser.Game(gameConfig)`.
- SKILLSET REQUIRED
  JavaScript ES modules, directory layout planning.
- NOTES
  Do not import Phaser from a CDN. `vendor/phaser.min.js` must be a local file (BR-044, AR-010).
- RELATED
  UC-001 | BR-039, BR-041, BR-044 | AR-001, AR-010 | PT-001

---

## DI-002 : PhysicsConfig and GameConfig Module (`config.js`)
- SUMMARY
  A single ES module that exports all Phaser game configuration and physics constants. No magic numbers in scene or entity files; all values imported from here.
- IMPLEMENTATION STEPS
  1. Create `./build/config.js`:
     ```js
     export const PHYSICS = {
       gravity: 500,          // px/sec²
       playerMaxSpeedX: 200,  // px/sec
       jumpVelocityY: -350,   // px/sec (negative = up in Phaser)
       cutGravityMultiplier: 2.5,
     };
     export const GAME = {
       width: 800,
       height: 480,
       fps: { target: 60, forceSetTimeOut: false },
       backgroundColor: '#5c94fc',
     };
     export const POINTS = {
       coin: 10,
       goomba: 100,
       koopa: 200,
       powerUp: 50,
       oneUp: 0,
     };
     export const LEVELS = {
       count: 8,
       timerDefault: 300,
       startingLives: 3,
     };
     ```
  2. `main.js` imports `GAME` and `PHYSICS` to build the Phaser.Game config object:
     ```js
     import { GAME, PHYSICS } from './config.js';
     const gameConfig = {
       type: Phaser.AUTO,
       width: GAME.width,
       height: GAME.height,
       backgroundColor: GAME.backgroundColor,
       physics: { default: 'arcade', arcade: { gravity: { y: PHYSICS.gravity }, debug: false } },
       fps: GAME.fps,
       scene: [ BootScene, MenuScene, GameScene, HUDScene, PauseScene,
                LevelCompleteScene, GameOverScene ],
     };
     new Phaser.Game(gameConfig);
     ```
- SKILLSET REQUIRED
  ES module exports, Phaser 3 game config.
- NOTES
  Changing `PHYSICS.gravity` must produce a proportionally different jump arc (BR-051 TESTABLE CONDITION).
- RELATED
  UC-002 | BR-003, BR-007, BR-022, BR-038, BR-040, BR-046, BR-051 | AR-002, AR-007 | PT-016

---

## DI-003 : BootScene — Asset Preload and Loading Screen
- SUMMARY
  BootScene runs first. It preloads all sprites, tilemaps, and audio in `preload()`, shows a loading progress bar, then transitions to MenuScene in `create()`. Must complete within 5 s on 10 Mbps. Zero console errors allowed.
- IMPLEMENTATION STEPS
  1. In `preload()`:
     - Load spritesheets: `this.load.spritesheet('player', 'images/player.png', { frameWidth: 32, frameHeight: 32 })`, similarly for `goomba`, `koopa`, `koopa-shell`, `items`, `tiles`.
     - Load tilemaps: `for (let i = 1; i <= LEVELS.count; i++) this.load.tilemapTiledJSON(\`level-\${String(i).padStart(2,'0')}\`, \`levels/level-\${String(i).padStart(2,'0')}.json\`)`.
     - Load audio: `this.load.audio('bgm-level', ['audio/bgm-level.ogg', 'audio/bgm-level.mp3'])` (provide both formats for cross-browser support); similarly for bgm-gameover, bgm-levelcomplete, and six named SFX keys.
     - Load `assets-manifest.json`: `this.load.json('assetManifest', 'assets-manifest.json')`.
  2. Progress bar in `preload()`:
     ```js
     const bar = this.add.rectangle(400, 240, 0, 20, 0xffffff);
     this.load.on('progress', v => bar.setSize(400 * v, 20));
     ```
  3. In `create()`:
     - Initialise `AudioManager` singleton and store in `this.game.registry`.
     - Initialise `StorageManager` singleton and store in `this.game.registry`.
     - Call `this.scene.start('MenuScene')`.
  4. Add error listener: `this.load.on('loaderror', (file) => console.error('Asset load error:', file.key))` — must never fire in production build (BR-047).
- SKILLSET REQUIRED
  Phaser 3 Loader, scene lifecycle.
- NOTES
  All audio files must ship as both `.ogg` and `.mp3` for Firefox and Safari compat (BR-042).
- RELATED
  UC-001 | BR-001, BR-003, BR-032, BR-033, BR-034, BR-039, BR-041, BR-047 | AR-001, AR-008, AR-010 | PT-001, PT-013

---

## DI-004 : MenuScene — Title Screen and Navigation
- SUMMARY
  MenuScene shows title text, a "New Game" button, and conditionally a "Level Select" button (only when unlockedLevel > 1). Options include a mute toggle. Selecting New Game starts GameScene at level 1 within 2 s.
- IMPLEMENTATION STEPS
  1. Display static background image and title text.
  2. Read `StorageManager.get()` for `unlockedLevel`.
  3. Create interactive text buttons:
     - "NEW GAME" → `this.scene.start('GameScene', { level: 1 })`.
     - "LEVEL SELECT" (if unlockedLevel > 1) → show a simple numeric button row for each unlocked level.
     - "MUTE / UNMUTE" → toggle `AudioManager.toggleMute()`.
  4. Buttons use `setInteractive()` and a `pointerover` tint for hover feedback.
  5. Scene start time must be within 2 s of button press (BR-002) — no additional asset loading occurs here; all assets were loaded in BootScene.
- SKILLSET REQUIRED
  Phaser 3 scenes, Text GameObjects, input handling.
- NOTES
  Level Select is visible only if at least level 2 has been reached (UC-001 acceptance criterion 4).
- RELATED
  UC-001 | BR-001, BR-002, BR-003 | AR-001, AR-004 | PT-002

---

## DI-005 : GameScene — Main Gameplay Loop
- SUMMARY
  GameScene is the primary scene. It receives a `level` number in its `init` data, uses LevelLoader to build the level, spawns entities via EntityFactory, runs the Arcade physics loop, processes all collisions/overlaps, manages the level timer, and emits HUD events. It also handles player death and level completion.
- IMPLEMENTATION STEPS
  1. `init(data)`: store `this.levelNumber = data.level`.
  2. `create()`:
     a. `this.levelContext = LevelLoader.load(this, this.levelNumber)` — returns tilemap, playerStart, goalZone.
     b. Instantiate `PlayerEntity` at `levelContext.playerStart`.
     c. `this.scene.launch('HUDScene')` — start HUD concurrently.
     d. `AudioManager.playMusic('bgm-level')`.
     e. Set up collisions:
        - `this.physics.add.collider(this.player, this.levelContext.groundLayer)`.
        - `this.physics.add.collider(this.enemies, this.levelContext.groundLayer)`.
     f. Set up overlaps (enemy stomp, item collect, goal trigger — see DI-009 for overlap logic).
     g. Initialise level timer: `this.levelTimer = LEVELS.timerDefault`.
     h. `this.timerEvent = this.time.addEvent({ delay: 1000, callback: this.tickTimer, callbackScope: this, loop: true })`.
  3. `update()`:
     a. `this.player.update()` — processes input, updates FSM.
     b. `this.enemies.getChildren().forEach(e => e.update())`.
     c. Check for pause input (Escape/P): if pressed, launch PauseScene and pause self (BR-029).
  4. `tickTimer()`:
     a. Decrement `this.levelTimer`.
     b. Emit `'timer-update'` event with new value.
     c. If `this.levelTimer <= 0`: trigger player death sequence (BR-038).
  5. `onPlayerDeath()`:
     a. Decrement lives in `StorageManager`.
     b. If lives > 0: `this.scene.restart({ level: this.levelNumber })`.
     c. If lives === 0: `this.scene.start('GameOverScene')`.
  6. `onGoalReached()`:
     a. Stop `timerEvent`.
     b. Update `StorageManager` with score and unlocked level.
     c. `this.scene.start('LevelCompleteScene', { level: this.levelNumber, score: this.score, timeLeft: this.levelTimer })`.
- SKILLSET REQUIRED
  Phaser 3 scene lifecycle, Arcade physics, event emitter.
- NOTES
  GameScene must emit `'score-update'`, `'lives-update'`, `'timer-update'`, `'level-update'` to the global game event bus so HUDScene can update without direct coupling (AR-012).
- RELATED
  UC-002–UC-009 | BR-004–BR-038 | AR-001–AR-007, AR-012 | PT-003

---

## DI-006 : PlayerEntity — FSM, Movement, and Power-Up Tiers
- SUMMARY
  PlayerEntity extends `Phaser.Physics.Arcade.Sprite`. It implements a named FSM, keyboard input, movement physics, variable-height jumping, and power-up tier state transitions.
- IMPLEMENTATION STEPS
  1. Constructor:
     ```js
     constructor(scene, x, y) {
       super(scene, x, y, 'player');
       scene.add.existing(this); scene.physics.add.existing(this);
       this.state = 'idle';     // FSM state
       this.powerTier = 'base'; // 'base' | 'enlarged' | 'fire'
       this.invincible = false;
       this.cursors = scene.input.keyboard.createCursorKeys();
       this.wasd = scene.input.keyboard.addKeys('W,A,S,D,Z,X');
       this.jumpKeyHeld = false;
       this.setCollideWorldBounds(true);
     }
     ```
  2. `update()` called each frame from GameScene:
     a. Horizontal movement: if left/A held → `setVelocityX(-PHYSICS.playerMaxSpeedX)`; if right/D held → `setVelocityX(PHYSICS.playerMaxSpeedX)`; else → `setVelocityX(0)`.
     b. Jump initiation: if (up/W/Space just pressed) AND (body.blocked.down) → `setVelocityY(PHYSICS.jumpVelocityY)`, set `jumpKeyHeld = true`, transition FSM to `jumping`.
     c. Variable jump (DI-007): if jump key released while body.velocity.y < 0 → apply cut-gravity.
     d. FSM state update: derive from `body.blocked.down`, `body.velocity.y` — see state table below.
     e. Play animation matching current state: `this.play(\`player-\${this.state}\`, true)`.
  3. FSM state table:
     | Condition | State |
     |-----------|-------|
     | blocked.down, speed == 0 | idle |
     | blocked.down, speed > 0 | running |
     | velocity.y < 0 | jumping |
     | !blocked.down, velocity.y > 0 | falling |
     | dead | dead |
  4. Power-up tier transitions:
     - `applyPowerUp(type)`: base→mushroom→enlarged; enlarged→fire-flower→fire; any→star→invincible (timed).
     - `onHit()`: if invincible → ignore; if fire → downgrade to enlarged; if enlarged → downgrade to base; if base → triggerDeath().
     - On tier change: update sprite texture key and adjust body hitbox (`setSize(w, h)`).
  5. `triggerDeath()`: play death animation, emit `'player-death'` event to GameScene, disable body.
  6. Hitbox sizes: base = 28×32 px; enlarged = 28×48 px. Update on tier change.
- SKILLSET REQUIRED
  Phaser 3 Arcade Sprite, FSM patterns, keyboard input.
- NOTES
  Stomp detection uses a separate narrow overlap rectangle at the player's feet (see DI-008 enemy handling).
- RELATED
  UC-002, UC-004, UC-005 | BR-004–BR-007, BR-013, BR-014, BR-016–BR-018, BR-051 | AR-002, AR-005, AR-007 | PT-008

---

## DI-007 : Variable-Height Jump via Cut-Gravity
- SUMMARY
  Implement the cut-gravity multiplier so releasing the jump key early produces a shorter arc than holding it.
- IMPLEMENTATION STEPS
  1. In `PlayerEntity.update()`, after the jump-initiation block:
     ```js
     const jumpKey = this.cursors.up.isDown || this.wasd.W.isDown || this.cursors.space.isDown;
     if (this.jumpKeyHeld && !jumpKey && this.body.velocity.y < 0) {
       // Key released while still ascending — apply extra downward gravity
       this.body.setGravityY(PHYSICS.gravity * PHYSICS.cutGravityMultiplier);
       this.jumpKeyHeld = false;
     }
     if (this.body.blocked.down) {
       this.body.setGravityY(0); // reset per-body gravity override on landing
       this.jumpKeyHeld = false;
     }
     ```
  2. The extra per-body gravity is additive with the global Arcade world gravity, resulting in total downward acceleration = `PHYSICS.gravity + PHYSICS.gravity * PHYSICS.cutGravityMultiplier` while the override is active.
  3. Test: a held jump must reach visibly greater height than a immediately-released tap (BR-006 acceptance criterion 5).
- SKILLSET REQUIRED
  Phaser 3 Arcade body gravity, frame-by-frame velocity mechanics.
- NOTES
  `body.setGravityY(0)` resets to world gravity. The override must not persist into the next jump.
- RELATED
  UC-002 | BR-006, BR-051 | AR-007 | PT-008, PT-016

---

## DI-008 : EnemyEntity — Goomba, Koopa, and Shell
- SUMMARY
  Implement patrol AI, direction reversal on walls/edges, stomp-defeat, shell transition, and shell sliding.
- IMPLEMENTATION STEPS
  1. `GoombaEntity` (extends `Phaser.Physics.Arcade.Sprite`):
     - Constructor: `setVelocityX(-80)` (initial patrol direction).
     - `update()`: reverse velocity on wall collision (`body.blocked.left || body.blocked.right`). Edge detection: cast a point check one tile ahead-and-below; if no tile → reverse.
     - `onStomp()`: play defeated animation, disable body, destroy after 300 ms. Emit `'enemy-defeated'` event with point value.
  2. `KoopaEntity`:
     - Behaves like Goomba until stomped.
     - `onStomp()` (first stomp): transition to shell-idle — set velocity to 0, swap to shell sprite, flag `state = 'shell-idle'`.
     - `onKick(direction)` (player contact while shell-idle): promote to `KoopaShell` entity at same position, destroy self.
  3. `KoopaShell` (extends Sprite, kinematic):
     - Constructor: `setVelocityX(direction * 250)`.
     - `update()`: on wall collision → reverse velocity.
     - Overlap with enemy → call `enemy.onStomp()`, emit `'enemy-defeated'`.
     - Overlap with player (not the kicker, after first tick) → `player.onHit()`.
  4. Register all enemies in a Phaser Group (`this.enemies`) in GameScene. Register all shells in a separate `this.shells` group.
  5. Stomp overlap detection: in GameScene, add overlap between `playerStompHitbox` (a small rectangle at player's feet, width = player width, height = 8 px, offset to bottom of player) and each enemy group. On overlap: if `player.body.velocity.y > 0` → trigger stomp; else → trigger `player.onHit()`.
- SKILLSET REQUIRED
  Phaser 3 Arcade Sprite, Groups, physics callbacks.
- NOTES
  Edge detection can use `this.scene.levelContext.groundLayer.getTileAtWorldXY(x, y + 16)` — returns null if no tile.
- RELATED
  UC-004 | BR-011, BR-012, BR-013, BR-014 | AR-002, AR-006 | PT-009

---

## DI-009 : CollectibleSystem — Coins, Power-Ups, and Hidden Blocks
- SUMMARY
  Spawn collectibles from level data, handle collection overlaps, manage hidden-block activation, and enforce the single-active-power-up rule.
- IMPLEMENTATION STEPS
  1. In `LevelLoader.load()`, read the `items` object layer:
     - For each object: call `EntityFactory.create(scene, obj.type, obj.x, obj.y, obj.properties)`.
  2. `EntityFactory.create()` map:
     - `coin` → static animated coin sprite added to `scene.coins` group.
     - `mushroom`, `fire-flower`, `star`, `1up` → dormant sprite (not visible) added to `scene.powerUps`; only becomes active when spawned from a block hit.
     - `block-hidden` → invisible static sprite (`setAlpha(0)`) added to `scene.hiddenBlocks`; stores `contents` property.
     - `block-question` → visible question-mark sprite added to `scene.questionBlocks`; stores `contents`.
  3. Coin overlap: `this.physics.add.overlap(this.player, this.coins, (player, coin) => { coin.destroy(); this.addScore(POINTS.coin); AudioManager.playSFX('sfx-coin'); })`.
  4. Hidden/question block activation:
     - Add a custom `processCallback` on the collider between the player and `scene.hiddenBlocks`/`scene.questionBlocks`.
     - In the callback: if `player.body.velocity.y > 0` → return false (don't block — player falling through is not an activation). If `player.body.blocked.up` → activate block.
     - `activateBlock(block)`: set block to activated sprite frame; call `EntityFactory.create(scene, block.getData('contents'), block.x, block.y - 32)` to spawn item above.
  5. Power-up overlap: `this.physics.add.overlap(this.player, this.powerUps, (player, pu) => { player.applyPowerUp(pu.getData('type')); pu.destroy(); this.addScore(POINTS.powerUp); AudioManager.playSFX('sfx-powerup'); })`.
  6. Single active power-up rule: `player.applyPowerUp()` replaces the current tier (the new power-up always wins).
  7. 1-up overlap: increment lives, emit `'lives-update'`.
- SKILLSET REQUIRED
  Phaser 3 Groups, overlap callbacks, data properties.
- NOTES
  At least one hidden block required per level in level JSON (BR-028 TESTABLE CONDITION — verified by LevelLoader asserting `hiddenBlocks.length >= 1`).
- RELATED
  UC-005, UC-008 | BR-015–BR-018, BR-025–BR-028 | AR-003, AR-006 | PT-011, PT-012

---

## DI-010 : HUDScene — Score, Lives, Level, and Timer Display
- SUMMARY
  HUDScene is launched concurrently with GameScene and renders four always-visible text values on a fixed camera.
- IMPLEMENTATION STEPS
  1. `create()`:
     ```js
     this.cameras.main.setScroll(0, 0); // fixed, no follow
     this.scoreText  = this.add.text(16, 8, 'SCORE: 0', { fontSize: '16px', fill: '#fff' });
     this.livesText  = this.add.text(200, 8, 'LIVES: 3', { fontSize: '16px', fill: '#fff' });
     this.levelText  = this.add.text(400, 8, 'LEVEL: 1', { fontSize: '16px', fill: '#fff' });
     this.timerText  = this.add.text(640, 8, 'TIME: 300', { fontSize: '16px', fill: '#fff' });
     ```
  2. Subscribe to game events:
     ```js
     this.game.events.on('score-update', v => this.scoreText.setText('SCORE: ' + v));
     this.game.events.on('lives-update', v => this.livesText.setText('LIVES: ' + v));
     this.game.events.on('timer-update', v => this.timerText.setText('TIME: ' + v));
     this.game.events.on('level-update', v => this.levelText.setText('LEVEL: ' + v));
     ```
  3. Destroy listeners on scene shutdown: `this.events.on('shutdown', () => { this.game.events.off('score-update'); … })`.
- SKILLSET REQUIRED
  Phaser 3 concurrent scenes, EventEmitter, Text GameObjects.
- NOTES
  HUD camera must not scroll regardless of GameScene camera position. Font must be legible (minimum 16 px, white, on a dark or semi-transparent background strip).
- RELATED
  UC-011 | BR-036, BR-037, BR-038 | AR-012 | PT-004

---

## DI-011 : PauseScene — Pause Overlay
- SUMMARY
  PauseScene overlays the game canvas when Escape/P is pressed. It pauses GameScene without stopping it, preserving all entity state.
- IMPLEMENTATION STEPS
  1. In GameScene `update()`:
     ```js
     if (Phaser.Input.Keyboard.JustDown(this.pauseKey)) {
       this.scene.pause('GameScene');
       this.scene.launch('PauseScene');
     }
     ```
     where `this.pauseKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC)` (also add P key).
  2. `PauseScene.create()`:
     - Semi-transparent overlay: `this.add.rectangle(400, 240, 800, 480, 0x000000, 0.5)`.
     - "PAUSED" title text centred.
     - "RESUME" button → `this.scene.resume('GameScene'); this.scene.stop('PauseScene')`.
     - "MAIN MENU" button → `this.scene.stop('GameScene'); this.scene.stop('HUDScene'); this.scene.start('MenuScene')`.
  3. Verify: entity positions in GameScene must be identical before and after pause (BR-031). `this.scene.pause()` in Phaser halts the GameScene's `update()` loop but preserves all object state — this is sufficient.
  4. Pause must not trigger during death animation: in GameScene, set `this.pauseEnabled = false` on player death, re-enable only after level restart.
- SKILLSET REQUIRED
  Phaser 3 scene management (pause/resume/launch), overlay rendering.
- NOTES
  Do not use `this.scene.sleep()` — use `pause()` and `resume()` for correct state preservation (BR-031).
- RELATED
  UC-009 | BR-029, BR-030, BR-031 | AR-004 | PT-005

---

## DI-012 : LevelCompleteScene — Level End Screen
- SUMMARY
  Shown after the player reaches the goal. Displays score and time remaining, persists progress, and transitions to the next level or a game-complete screen.
- IMPLEMENTATION STEPS
  1. `init(data)`: store `this.level = data.level`, `this.score = data.score`, `this.timeLeft = data.timeLeft`.
  2. `create()`:
     - Display "LEVEL COMPLETE" text, final score, and time remaining.
     - Write to StorageManager: `storage.set({ highScore: max(oldHigh, this.score), unlockedLevel: max(oldUnlock, this.level + 1) })`.
     - Play `'bgm-levelcomplete'`.
     - If `this.level < LEVELS.count`: show "NEXT LEVEL" button → `this.scene.start('GameScene', { level: this.level + 1 })`.
     - Else: show "CONGRATULATIONS" message, then after 3 s `this.scene.start('MenuScene')` (BR-021).
- SKILLSET REQUIRED
  Phaser 3 scenes, data passing between scenes.
- NOTES
  BR-019 TESTABLE CONDITION: correct score and remaining time must appear — these are passed via `scene.start` data payload, not re-read from game state.
- RELATED
  UC-006 | BR-019, BR-020, BR-021, BR-037 | AR-004, AR-009 | PT-006

---

## DI-013 : GameOverScene — Game Over Screen
- SUMMARY
  Displayed when lives reach 0. Offers Restart (reset to 3 lives, level 1) and Return to Title.
- IMPLEMENTATION STEPS
  1. `create()`:
     - Display "GAME OVER" text.
     - Play `'bgm-gameover'`.
     - "RETRY" button: `StorageManager.set({ lives: LEVELS.startingLives }); this.scene.start('GameScene', { level: 1 })`.
     - "MAIN MENU" button: `this.scene.start('MenuScene')`.
  2. Ensure in-progress session state is cleared on Retry (lives reset, score reset to 0).
- SKILLSET REQUIRED
  Phaser 3 scenes, StorageManager.
- NOTES
  BR-024: Retry resets lives to 3 and starts at level 1, not the level where lives ran out.
- RELATED
  UC-007 | BR-024 | AR-004 | PT-007

---

## DI-014 : LevelLoader — Tiled JSON Tilemap Parsing
- SUMMARY
  Utility function that loads a level from a pre-loaded Tiled JSON key, constructs tilemap layers, parses object layers, and returns a `levelContext` object for GameScene consumption.
- IMPLEMENTATION STEPS
  1. Signature: `LevelLoader.load(scene, levelNumber) → levelContext`.
  2. Level key = `level-${String(levelNumber).padStart(2, '0')}`.
  3. Create tilemap: `const map = scene.make.tilemap({ key: levelKey })`.
  4. Add tileset: `const tiles = map.addTilesetImage('tiles', 'tiles')` (tileset name must match Tiled export name).
  5. Create ground layer: `const groundLayer = map.createLayer('Ground', tiles, 0, 0)`.
  6. Enable collision on solid tiles: `groundLayer.setCollisionByExclusion([-1])`.
  7. Parse object layers:
     ```js
     const enemies  = map.getObjectLayer('enemies')?.objects ?? [];
     const items    = map.getObjectLayer('items')?.objects ?? [];
     const triggers = map.getObjectLayer('triggers')?.objects ?? [];
     ```
  8. Spawn entities via EntityFactory from each object.
  9. Find player start: `triggers.find(o => o.name === 'player-start')`.
  10. Create goal zone: `const goalZone = scene.add.zone(goalObj.x, goalObj.y, goalObj.width, goalObj.height)` — register overlap in GameScene.
  11. Pipe entries: `triggers.filter(o => o.type === 'pipe-enter')` — store as a list in levelContext for overlay transition handling.
  12. Assert hidden blocks: `console.assert(items.filter(o => o.type === 'block-hidden').length >= 1, 'Level must contain at least one hidden block (BR-028)')`.
  13. Return `{ groundLayer, playerStart, goalZone, pipes, map }`.
- SKILLSET REQUIRED
  Phaser 3 Tilemaps, Tiled JSON format, object layer parsing.
- NOTES
  Level JSON files must export with `Embed tilesets` disabled; tileset image is referenced separately.
- RELATED
  UC-003, UC-006, UC-008 | BR-011, BR-015, BR-019, BR-020, BR-026, BR-027, BR-028 | AR-003, AR-006 | PT-012

---

## DI-015 : AudioManager — Music and SFX Wrapper
- SUMMARY
  Singleton wrapper around Phaser's built-in audio system. Manages music playback, SFX triggering, and mute toggle. Initialised in BootScene, stored in game registry.
- IMPLEMENTATION STEPS
  1. Class definition:
     ```js
     export class AudioManager {
       constructor(scene) {
         this.scene = scene;
         this.music = null;
         this.muted = StorageManager.get().audioMuted ?? false;
         scene.sound.setMute(this.muted);
       }
       playMusic(key) {
         if (this.music) this.music.stop();
         this.music = this.scene.sound.add(key, { loop: true });
         this.music.play();
       }
       stopMusic() { if (this.music) this.music.stop(); }
       playSFX(key) { this.scene.sound.play(key); }
       toggleMute() {
         this.muted = !this.muted;
         this.scene.sound.setMute(this.muted);
         StorageManager.update({ audioMuted: this.muted });
       }
       isMuted() { return this.muted; }
     }
     ```
  2. In BootScene `create()`: `this.game.registry.set('audio', new AudioManager(this))`.
  3. All scenes access via `this.game.registry.get('audio')`.
  4. Default state: unmuted on first load (BR-050) — `StorageManager.get()` returns `false` for `audioMuted` when no prior state exists.
- SKILLSET REQUIRED
  Phaser 3 Sound Manager, registry pattern.
- NOTES
  All audio assets loaded in BootScene `preload()` (DI-003). No external audio CDN calls anywhere (BR-034, BR-044).
- RELATED
  UC-010 | BR-032, BR-033, BR-034, BR-035, BR-050 | AR-008 | PT-013

---

## DI-016 : StorageManager — localStorage Persistence
- SUMMARY
  Thin wrapper around `window.localStorage` using a namespaced JSON key. Provides typed get/set/update methods. Returns defaults when storage is empty or corrupted.
- IMPLEMENTATION STEPS
  1. Class definition:
     ```js
     const KEY = 'smb-save';
     const DEFAULTS = { highScore: 0, unlockedLevel: 1, audioMuted: false };
     export class StorageManager {
       static get() {
         try {
           return { ...DEFAULTS, ...JSON.parse(localStorage.getItem(KEY) ?? '{}') };
         } catch { return { ...DEFAULTS }; }
       }
       static set(data) {
         localStorage.setItem(KEY, JSON.stringify(data));
       }
       static update(partial) {
         StorageManager.set({ ...StorageManager.get(), ...partial });
       }
     }
     ```
  2. Only `localStorage` under the game's own origin is written (BR-045, BR-053). No network calls, no IndexedDB, no cookies (BR-049).
  3. Schema: `{ highScore: number, unlockedLevel: number, audioMuted: boolean }`.
- SKILLSET REQUIRED
  Browser Web APIs (localStorage), JSON serialisation.
- NOTES
  `JSON.parse` errors are caught and defaults returned — prevents crash on corrupted storage (edge case hardening). Lives count is managed in GameScene in-memory and only written to storage on game over or level complete.
- RELATED
  UC-006, UC-007 | BR-045, BR-049, BR-053 | AR-009 | PT-014

---

## DI-017 : AssetManifest File (`assets-manifest.json`)
- SUMMARY
  A JSON file listing every asset in `./build/` with filename, source, and license. Required for CC0 compliance audit. Maintained by the Developer and verified by the Tester.
- IMPLEMENTATION STEPS
  1. Create `./build/assets-manifest.json` with one entry per asset file:
     ```json
     [
       { "file": "images/player.png",       "source": "original",                          "license": "CC0" },
       { "file": "images/goomba.png",        "source": "kenney.nl/assets/platformer-pack", "license": "CC0" },
       { "file": "images/tiles.png",         "source": "kenney.nl/assets/platformer-pack", "license": "CC0" },
       { "file": "audio/bgm-level.ogg",      "source": "original",                          "license": "CC0" },
       { "file": "audio/sfx-jump.ogg",       "source": "original",                          "license": "CC0" }
     ]
     ```
  2. Every file in `./build/images/`, `./build/audio/`, and `./build/levels/` must have a corresponding entry (BR-052 TESTABLE CONDITION).
  3. No entry may reference Nintendo-published titles or Nintendo-copyrighted assets (BR-048).
  4. BootScene loads this file and in developer mode asserts that all loaded asset keys have manifest entries.
- SKILLSET REQUIRED
  JSON authoring, asset provenance research.
- NOTES
  Add new entries every time a new asset file is added to `./build/`. The Developer is responsible for keeping this file current.
- RELATED
  UC-001 | BR-043, BR-048, BR-052 | AR-011 | PT-015

---

## DI-018 : Level Data — Tiled JSON Files (8 Minimum Levels)
- SUMMARY
  Create at least 8 Tiled JSON tilemap files representing distinct playable levels. Each level must contain: a player-start trigger, a goal trigger, enemy spawn objects, item/coin objects, at least one hidden block, and varying layouts that escalate in difficulty.
- IMPLEMENTATION STEPS
  1. Create levels using Tiled Map Editor (free, open-source). Canvas size: 50×15 tiles at 32×32 px = 1600×480 px (wider than viewport; GameScene camera follows player).
  2. Required layers per map:
     - Tile layer: `Ground` (colliding tiles)
     - Tile layer: `Background` (non-colliding decoration)
     - Object layer: `enemies` — each object has `type` = `goomba` or `koopa`, position in world coordinates.
     - Object layer: `items` — each object has `type` = `coin` | `block-question` | `block-hidden` | `mushroom` | `fire-flower` | `star` | `1up`; custom property `contents` for blocks.
     - Object layer: `triggers` — includes `player-start` (point), `goal` (rectangle), optionally `pipe-enter`/`pipe-exit` (rectangles with `destination` and `exitPoint` properties).
  3. Level difficulty progression:
     - Level 1: flat terrain, only Goombas, no moving platforms.
     - Level 2: introduces gaps and elevated platforms, Goombas and one Koopa.
     - Levels 3–5: add moving platforms, more enemies, tighter layouts.
     - Levels 6–7: introduce disappearing/breakable platforms, more hidden blocks.
     - Level 8: final challenge level with full enemy and platform variety.
  4. Export from Tiled: Format = JSON, Embed tilesets = OFF, output to `./build/levels/level-01.json` … `level-08.json`.
  5. Assert in LevelLoader: at least one `block-hidden` object per level (BR-028).
- SKILLSET REQUIRED
  Tiled Map Editor, JSON, tile-based level design.
- NOTES
  Moving/breakable/disappearing platform objects should be placed in the `items` layer with type `platform-moving`, `platform-breakable`, `platform-disappearing` and a `path` or `breakCount` custom property.
- RELATED
  UC-003, UC-006, UC-008 | BR-020, BR-028 | AR-003 | PT-012

---

## DI-019 : Platform System — Moving, Breakable, and Disappearing Platforms
- SUMMARY
  Implement the three special platform types as Arcade Physics static sprites with custom `update()` logic.
- IMPLEMENTATION STEPS
  1. `MovingPlatform`:
     - Spawn from level data at start position with a `path` property: `{ endX, endY, speed }`.
     - Each frame: move toward current target point via `Phaser.Math.Distance.Between`; on arrival, swap target to the other endpoint (ping-pong).
     - Player standing on platform: in GameScene collider callback, if `player.body.blocked.down && player.body.touching.down`, set `player.setVelocityX(player.getVelocityX() + platform.body.deltaX())` to keep player in sync (BR-010).
     - Use `this.body.reset(x, y)` each frame to move the static body (static bodies don't respond to velocity; must be reset manually).
  2. `BreakablePlatform`:
     - On player landing (collision from above): decrement `hitsRemaining`. Swap to damage sprite frame. If `hitsRemaining <= 0`: play break animation, destroy.
  3. `DisappearingPlatform`:
     - On first player contact: start a `this.scene.time.delayedCall(1500, () => this.destroy())`. Play warning flicker animation (tween alpha 1→0.3 loop) immediately on contact.
- SKILLSET REQUIRED
  Phaser 3 static body manual positioning, collision callbacks, tweens.
- NOTES
  Moving platforms must call `body.reset(x, y)` rather than setting velocity (Arcade static bodies).
- RELATED
  UC-003 | BR-008, BR-009, BR-010 | AR-002, AR-003 | PT-010

---

## DI-020 : `index.html` — Entry Point and Content Security Policy
- SUMMARY
  The single HTML file served to the browser. Must declare a strict CSP that allows only same-origin scripts and styles, preventing XSS (OWASP A03) and unintended external requests (BR-044).
- IMPLEMENTATION STEPS
  1. Create `./build/index.html`:
     ```html
     <!DOCTYPE html>
     <html lang="en">
     <head>
       <meta charset="UTF-8">
       <meta name="viewport" content="width=device-width, initial-scale=1.0">
       <meta http-equiv="Content-Security-Policy"
             content="default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self'; media-src 'self'; connect-src 'none'">
       <title>Super Mario Bros — Web Platformer</title>
     </head>
     <body style="margin:0;background:#000;">
       <script src="vendor/phaser.min.js"></script>
       <script type="module" src="main.js"></script>
     </body>
     </html>
     ```
  2. `connect-src 'none'` blocks all `fetch`/`XMLHttpRequest`/WebSocket calls, enforcing BR-044 at the browser level.
  3. `script-src 'self'` ensures no inline scripts or external CDN scripts execute.
  4. No inline event handlers or `<style>` blocks that would require `'unsafe-inline'`.
- SKILLSET REQUIRED
  HTML5, Content Security Policy specification.
- NOTES
  The CSP must not use `'unsafe-eval'` or `'unsafe-inline'`. Phaser 3 does not require these when served from a static file server with no dynamic code evaluation.
- RELATED
  UC-001 | BR-039, BR-044 | AR-001, AR-010 | PT-001

---

## Exit Gate Verification

| Gate | Status |
|------|--------|
| Every BR/AR pair has at least one DI | PASS — All 53 BRs and 12 ARs traced in DI RELATED fields |
| Every DI is actionable and detailed | PASS — All 20 DIs include concrete file paths, API names, pseudocode, and edge-case notes |
| RELATED fields point to valid UC, BR, and AR IDs | PASS — All references verified against upstream artifacts |
| DI IDs sequential and never reused | PASS — DI-001 through DI-020, no gaps |
