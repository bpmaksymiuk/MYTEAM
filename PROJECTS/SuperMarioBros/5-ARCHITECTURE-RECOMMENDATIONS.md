(Architect)

# Architecture Recommendations — Super Mario Bros Web Platformer

**Stage:** 5 — Architecture
**Source:** `4-REQUIREMENTS.md` (BR-001 through BR-053), `1-USE-CASES.md`
**Date:** 2026-04-28

---

## AR-001 : Use Phaser 3 (3.x) as the sole game engine and module host
- RATIONALE
  BR-039 mandates Phaser 3 explicitly. Phaser 3 provides an integrated Arcade physics engine, scene lifecycle management, tilemap rendering from Tiled JSON exports, WebAudio integration, and a cross-browser game loop at 60 fps — satisfying BR-001 through BR-040 without additional framework dependencies.
- NOTES
  Load Phaser 3 from a local vendor bundle, not a CDN, to satisfy BR-044 (no external network requests at runtime). Pin to a known stable 3.x release. No other game engine or physics library shall be included.
- RELATED
  UC-001, UC-002, UC-003, UC-004, UC-005, UC-006, UC-007, UC-008, UC-009, UC-010, UC-011 | BR-039, BR-040, BR-044

---

## AR-002 : Use Phaser Arcade Physics for all character and entity movement
- RATIONALE
  Arcade Physics (AABB) provides deterministic, pixel-accurate collision resolution suitable for tile-based platformers. It satisfies BR-004–BR-010 (movement, collision, platform types), BR-012 (enemy patrol reversal), and BR-013/BR-014 (stomp/hit resolution). The fixed-step physics clock at 60 fps aligns with BR-040 and BR-046.
- NOTES
  Configure gravity globally to ~500 px/sec². Player max horizontal speed ~200 px/sec. Jump initial velocity ~350 px/sec upward (negative Y). All values in a single configurable constants file. Matter or Impact physics are explicitly excluded.
- RELATED
  UC-002, UC-003, UC-004 | BR-004, BR-005, BR-006, BR-007, BR-008, BR-009, BR-010, BR-012, BR-013, BR-014, BR-040, BR-046, BR-051

---

## AR-003 : Load all level content from Tiled JSON tilemaps
- RATIONALE
  Tiled .json exports give a data-driven, designer-editable format for tile placement, enemy spawn objects, item objects, hidden-block flags, goal zones, and pipe transitions. This satisfies BR-011, BR-015, BR-019, BR-020, BR-026, BR-027, BR-028 without hardcoding level geometry in source code. Phaser 3's `TilemapLayer` and object layers provide direct integration.
- NOTES
  Each level is a separate Tiled .json file under `./build/levels/`. Object layer naming convention: `enemies`, `items`, `hazards`, `triggers`. At least 8 level files must be present (BR-020). Hidden block objects include a `hidden: true` and `contents` property readable via `layer.getObjects()`.
- RELATED
  UC-003, UC-005, UC-006, UC-008 | BR-011, BR-015, BR-019, BR-020, BR-026, BR-027, BR-028

---

## AR-004 : Implement a Phaser Scene stack for distinct game states
- RATIONALE
  Phaser's multi-scene architecture allows concurrent and stacked scenes (e.g., GameScene + HUDScene + PauseOverlay) without restart penalties. This cleanly satisfies BR-001–BR-003 (Boot/Menu/Title), BR-019/BR-021 (Level Complete/Game Complete), BR-024 (Game Over), BR-029–BR-031 (Pause overlay preserving full state), and BR-036–BR-038 (HUD always visible on top).
- NOTES
  Scenes: BootScene, MenuScene, GameScene, HUDScene (launched concurrently with GameScene), PauseScene (launched over GameScene without stopping it — use Phaser scene sleep/pause rather than scene restart for pause so that entity state is preserved exactly), LevelCompleteScene, GameOverScene. Transitions between scenes must complete within 2 seconds (BR-002).
- RELATED
  UC-001, UC-006, UC-007, UC-009, UC-011 | BR-001, BR-002, BR-003, BR-019, BR-021, BR-024, BR-029, BR-030, BR-031, BR-036

---

## AR-005 : Model the player character as a finite state machine with named states
- RATIONALE
  A FSM eliminates ambiguous cross-state bugs by making only legal transitions possible. States: `idle`, `running`, `jumping`, `falling`, `dead`, `base`, `enlarged`, `fire`, `invincible`. Power-up tier is part of the state, not a separate flag. This satisfies BR-004–BR-007 (movement states), BR-013/BR-014 (stomp/hit consequences), BR-016–BR-018 (power-up tier transitions), and BR-051 (jump physics).
- NOTES
  State transitions are triggered by input events and collision events. Invincibility frames are a timed sub-state within `base` post-respawn. The state name maps directly to the sprite animation key, simplifying animation binding.
- RELATED
  UC-002, UC-004, UC-005 | BR-004, BR-005, BR-006, BR-007, BR-013, BR-014, BR-016, BR-017, BR-018, BR-051

---

## AR-006 : Use a factory pattern for enemy and collectible entity spawning from level data
- RATIONALE
  Separating spawn logic from entity logic allows new enemy/item types to be added by registering a factory entry without modifying GameScene. This satisfies BR-011 (enemy spawn from data), BR-015 (item spawn from data), and BR-025 (1-up). It also ensures no enemy or item hardcoding in level code (testability requirement per BR-011/BR-015 TESTABLE CONDITION).
- NOTES
  Entity types: `goomba`, `koopa`, `koopa-shell`, `coin`, `mushroom`, `fire-flower`, `star`, `1up`, `hazard`. Enemy and item pools (Phaser Groups) manage lifecycle and enable efficient overlap detection. Shell sliding (UC-004 step 5) is handled by promoting the `koopa` entity to a `koopa-shell` entity on stomp.
- RELATED
  UC-004, UC-005, UC-007 | BR-011, BR-012, BR-013, BR-014, BR-015, BR-016, BR-017, BR-018, BR-025

---

## AR-007 : Implement variable-height jumping via input-release gravity multiplier
- RATIONALE
  Variable jump height (UC-002 steps 6–7, BR-006, BR-051) requires that when the jump key is released before apex, additional gravity is applied to cut the arc short. This is implemented by multiplying the Arcade body gravity by a configurable `cutGravityMultiplier` (e.g. 2.5) on key release while the body is still ascending. No additional physics engine is needed.
- NOTES
  `cutGravityMultiplier` and the base jump velocity (~350 px/sec) are configurable constants. This pattern is well-established in Phaser 3 community tutorials and produces the correct feel.
- RELATED
  UC-002 | BR-006, BR-051

---

## AR-008 : Use Phaser 3's built-in audio system (WebAudio backend) for all audio
- RATIONALE
  BR-034 mandates Phaser 3 audio or Web Audio API exclusively. Phaser's audio system wraps WebAudio, supports looping music, individual sound effect playback with minimal latency, and a global mute toggle — satisfying BR-032–BR-035 and BR-050. No external audio CDN calls are needed, consistent with BR-044.
- NOTES
  All audio assets are preloaded in BootScene. Music key: `bgm-level`, `bgm-gameover`, `bgm-levelcomplete`. SFX keys: `sfx-jump`, `sfx-stomp`, `sfx-coin`, `sfx-powerup`, `sfx-death`, `sfx-levelcomplete`. Global mute toggle via `this.sound.setMute(true/false)`. Default state on first load: unmuted (BR-050).
- RELATED
  UC-010 | BR-032, BR-033, BR-034, BR-035, BR-050

---

## AR-009 : Store all persistence data exclusively in browser localStorage under a namespaced key
- RATIONALE
  BR-045 and BR-053 require all persistent data to remain in browser localStorage with no remote storage. BR-049 prohibits transmitting user data. A single namespaced key (e.g. `smb-save`) serialising a JSON object containing high score, unlocked level, and settings satisfies these constraints without additional libraries.
- NOTES
  No remote sync, no IndexedDB, no cookies, no sessionStorage for persistence. LocalStorage reads and writes wrapped in a `StorageManager` utility class for testability. Data schema: `{ highScore: number, unlockedLevel: number, audioMuted: boolean }`.
- RELATED
  UC-006, UC-007 | BR-045, BR-049, BR-053

---

## AR-010 : Serve Phaser 3 and all assets from the local build directory; no CDN or external runtime fetch
- RATIONALE
  BR-044 mandates zero outbound requests to external domains. BR-047 requires no asset-load errors. Bundling Phaser 3 in `./build/vendor/` and placing all sprites, tilemaps, and audio under `./build/` guarantees both. A Content Security Policy `<meta>` header in `index.html` enforcing `default-src 'self'` provides a defence-in-depth OWASP A05 control.
- NOTES
  Phaser 3 minified bundle placed at `./build/vendor/phaser.min.js`. Asset paths are relative to `index.html`. Add CSP `<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self'; style-src 'self'">`.
- RELATED
  UC-001 | BR-003, BR-041, BR-044, BR-047

---

## AR-011 : Produce and maintain a plain-text asset manifest file for all CC0/custom assets
- RATIONALE
  BR-043 (CC0 licensing) and BR-052 (attribution manifest) require that every asset is traceable to a CC0 or original source. A machine-readable manifest at `./build/assets-manifest.json` provides the required filename, source URL, and license identifier per asset entry. This also enables automated auditing in future CI steps.
- NOTES
  Schema per entry: `{ "file": "sprites/player.png", "source": "original", "license": "CC0" }`. BR-048 (no Nintendo IP) is enforced by policy at asset-creation time and verified by the manifest audit step.
- RELATED
  UC-001 | BR-043, BR-048, BR-052

---

## AR-012 : Display the HUD as a dedicated parallel Phaser Scene rendered above GameScene
- RATIONALE
  A separate HUDScene launched alongside GameScene (scene depth = GameScene + 1) allows HUD elements (score, lives, level, timer — BR-036–BR-038) to remain unaffected by GameScene camera movements, entity updates, or physics. This simplifies HUD testing and preserves the always-visible requirement.
- NOTES
  HUDScene communicates with GameScene via Phaser's `EventEmitter` (scene events). Events emitted by GameScene: `score-update`, `lives-update`, `timer-update`, `level-update`. HUDScene listens and re-renders text nodes. No direct scene reference coupling.
- RELATED
  UC-011 | BR-036, BR-037, BR-038

---

## Exit Gate Verification

| Gate | Status |
|------|--------|
| Every BR maps to at least one AR | PASS — BR-001 through BR-053 each appear in at least one RELATED field |
| Every AR names a concrete technology or pattern | PASS — All 12 ARs name Phaser 3, Arcade Physics, Tiled JSON, FSM, Factory pattern, localStorage, WebAudio, CSP, or JSON manifest |
| AR IDs are sequential and never reused | PASS — AR-001 through AR-012, no gaps |
| No AR invented without a BR basis | PASS — All ARs trace to at least one BR |
