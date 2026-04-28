# Business Requirements — Super Mario Bros
**Stage:** 4 — Business Analysis
**Source:** `1-USE-CASES.md`, `3-CONCEPT-STORYBOARD.md`
**Date:** 2026-04-27

---

## BR-001 : The system shall display a title screen on application boot containing at minimum a New Game interactive element
- TESTABLE CONDITION
  Given the game is launched in a browser, when the page finishes loading, then a title screen is visible with a New Game interactive element before any gameplay begins.
- NOTES
  Title screen is the sole entry point to gameplay. Relates to CB boot-screen storyboard panel.
- RELATED
  UC-001

---

## BR-002 : The system shall transition to the first playable level within 2 seconds of the player activating New Game
- TESTABLE CONDITION
  Given the title screen is displayed, when the player activates New Game, then the first level begins rendering within 2 seconds with no additional prompts required.
- NOTES
  Transition latency gate; covers title-to-gameplay handoff.
- RELATED
  UC-001

---

## BR-003 : The game shall display the title screen within 5 seconds of initial page load on a 10 Mbps connection with an empty browser cache
- TESTABLE CONDITION
  Given a clean browser cache and a simulated 10 Mbps download connection, when the game URL is navigated to, then the title screen is fully rendered and interactive within 5 seconds.
- NOTES
  Performance load-time gate.
- RELATED
  UC-001

---

## BR-004 : The player character shall move left in response to the left arrow key or A key being held
- TESTABLE CONDITION
  Given the player character is in an unobstructed area, when the left arrow or A key is held, then the player character moves continuously left at the defined horizontal speed until the key is released or a collision occurs.
- NOTES
  Left-movement input binding.
- RELATED
  UC-002

---

## BR-005 : The player character shall move right in response to the right arrow key or D key being held
- TESTABLE CONDITION
  Given the player character is in an unobstructed area, when the right arrow or D key is held, then the player character moves continuously right at the defined horizontal speed until the key is released or a collision occurs.
- NOTES
  Right-movement input binding.
- RELATED
  UC-002

---

## BR-006 : The player character shall jump when the up arrow key, W key, or Space key is pressed while standing on a surface
- TESTABLE CONDITION
  Given the player character is standing on a solid surface, when the up arrow, W, or Space key is pressed, then the player character launches upward following a projectile arc; if the player character is already airborne, the key press has no effect.
- NOTES
  Jump requires ground contact. Double-jump is out of scope unless explicitly added as a separate UC.
- RELATED
  UC-002

---

## BR-007 : The player character's horizontal movement speed shall be constant while direction input is held
- TESTABLE CONDITION
  Given the player character is on a surface and a directional key is held continuously, when the frame-by-frame speed is measured, then the horizontal speed equals the configured constant value for every frame the key is held.
- NOTES
  Speed predictability requirement; configurable constant, default ~200 px/sec.
- RELATED
  UC-002

---

## BR-008 : The system shall enforce pixel-accurate collision detection between the player character and all solid tile boundaries
- TESTABLE CONDITION
  Given solid tiles are placed in the level, when the player character moves into any tile boundary, then the player character stops at the tile surface and does not clip through it by any amount.
- NOTES
  Collision precision is critical for fair gameplay. Relates to CB platform layout storyboard panels.
- RELATED
  UC-003

---

## BR-009 : The system shall support at least three platform tile types: solid ground, elevated solid platform, and one-way pass-through platform
- TESTABLE CONDITION
  Given a level contains all three tile types, when the player character interacts with each, then solid ground blocks movement from all four directions; elevated solid platforms block from above and sides; one-way platforms allow upward passage and block downward movement.
- NOTES
  Tile taxonomy covers the primary interaction patterns from the storyboard.
- RELATED
  UC-003

---

## BR-010 : Moving platforms shall travel along a defined linear path and carry the player character at platform velocity when the player stands on them
- TESTABLE CONDITION
  Given a moving platform is defined in level data, when the player character stands on the platform, then the player character's world position updates in sync with the platform each frame; when the player is not on the platform, the platform continues its path independently.
- NOTES
  Player must inherit platform velocity to prevent slipping.
- RELATED
  UC-003

---

## BR-011 : The system shall spawn enemy characters at positions defined in level data when each level loads
- TESTABLE CONDITION
  Given a level is loaded and the scene is initialized, when the level's enemy-spawn data is processed, then each enemy appears at its configured position with the correct type and initial state.
- NOTES
  Spawn positions are data-driven, not hardcoded in engine logic.
- RELATED
  UC-004

---

## BR-012 : Enemy characters shall patrol horizontally and reverse direction upon reaching a wall collision boundary or the edge of a platform
- TESTABLE CONDITION
  Given an enemy is active and patrolling, when it reaches a wall tile or the edge of the platform beneath it, then the enemy reverses horizontal direction without leaving the platform surface.
- NOTES
  Basic patrol AI; edge detection prevents enemies from falling off platforms.
- RELATED
  UC-004

---

## BR-013 : The player character shall defeat an enemy by descending onto it such that the player character's lower hitbox contacts the enemy's upper hitbox
- TESTABLE CONDITION
  Given the player character is descending and the bottom edge of the player character's hitbox overlaps the top region of an enemy's hitbox, when the collision is resolved, then the enemy is removed from the scene and the player character receives an upward velocity bounce.
- NOTES
  Stomp mechanic. Lateral or upward contacts do not trigger the stomp result.
- RELATED
  UC-004

---

## BR-014 : The player character shall lose one life when making lateral or upward contact with an enemy while no protective power-up is active; when a protective power-up is active the power-up state shall downgrade by one tier instead
- TESTABLE CONDITION
  Given the player character collides with an enemy from the side or from below and no power-up is active, when the collision is resolved, then the player character loses one life; given a power-up is active, when the same collision occurs, then the power-up tier decrements by one and no life is lost.
- NOTES
  Combines hit-penalty and power-up mitigation into one atomic rule.
- RELATED
  UC-004, UC-005

---

## BR-015 : The system shall place collectible coin and power-up objects at positions defined in level data when each level loads
- TESTABLE CONDITION
  Given a level is loaded, when the scene is initialized, then all coins and power-up objects defined in the level's item data are present at their specified positions and are visible.
- NOTES
  Item placement is data-driven.
- RELATED
  UC-005

---

## BR-016 : Collecting a mushroom power-up shall transform the player character from the base state to the enlarged state
- TESTABLE CONDITION
  Given the player character is in the base state, when the player character's hitbox overlaps a mushroom item, then the player character sprite changes to the enlarged variant, the hitbox height increases to the enlarged dimensions, and the mushroom item is removed from the scene.
- NOTES
  Size-up transformation. Collecting a mushroom while already enlarged has no additional effect.
- RELATED
  UC-005

---

## BR-017 : Collecting a fire-flower power-up shall grant the player character the ability to fire projectiles
- TESTABLE CONDITION
  Given the player character is in at least the enlarged state, when the player character overlaps a fire-flower item, then the player character transitions to the fire state; pressing the defined attack key (Z or X) causes a projectile to be fired from the player's current position.
- NOTES
  Fire-flower requires the enlarged state as a prerequisite. Projectile behaviour is covered under UC-004.
- RELATED
  UC-005

---

## BR-018 : When the player character is hit while in an elevated power-up state, the power-up tier shall downgrade by one step rather than causing an immediate life loss
- TESTABLE CONDITION
  Given the player character is in the fire state and receives a hit, when the hit is resolved, then the player character downgrades to the enlarged state and no life is lost; given the player is in the enlarged state and receives a hit, then the player downgrades to the base state and no life is lost.
- NOTES
  One-tier-per-hit downgrade. A hit in the base state loses a life (covered by BR-014).
- RELATED
  UC-005

---

## BR-019 : Reaching the goal trigger zone of a level shall initiate the level-complete sequence and load the subsequent level
- TESTABLE CONDITION
  Given the player character reaches the defined goal trigger area, when the overlap is detected, then the level-complete animation or sequence plays and the subsequent level identifier loads upon sequence completion.
- NOTES
  Goal trigger zone position is defined per level in level data.
- RELATED
  UC-006

---

## BR-020 : The game shall contain a minimum of 8 playable levels arranged in a defined linear sequence
- TESTABLE CONDITION
  Given the game is started and each level is completed in succession, when the player progresses through all available levels, then at least 8 distinct levels are traversed before the game-complete state is reached.
- NOTES
  Minimum content scope.
- RELATED
  UC-006

---

## BR-021 : Completing the final level shall display a game-complete message and return the player to the title screen
- TESTABLE CONDITION
  Given the player completes the final level in the sequence, when the level-complete sequence finishes, then a distinct game-complete or victory message is displayed before the game returns to the title screen.
- NOTES
  End-of-game presentation requirement.
- RELATED
  UC-006

---

## BR-022 : The player shall begin each new game with exactly 3 lives
- TESTABLE CONDITION
  Given a new game is started from the title screen, when the lives counter is inspected immediately after level 1 loads, then the counter displays 3.
- NOTES
  Lives initialization; no carried-over state from a prior session unless a continue mechanism is added.
- RELATED
  UC-007

---

## BR-023 : Losing a life while lives remain shall restart the current level from the beginning with all entity states reset
- TESTABLE CONDITION
  Given the player character dies and the lives counter is greater than 0, when the death sequence completes, then the current level reloads with all enemies, items, and the player character restored to their initial positions; the lives counter decrements by 1.
- NOTES
  Level-restart behavior does not persist enemy kills or item pickups from the prior attempt.
- RELATED
  UC-007

---

## BR-024 : When the lives counter reaches 0 the system shall display a game-over screen offering Restart and Return to Title options
- TESTABLE CONDITION
  Given the lives counter is 1 and the player dies, when the death sequence completes, then a game-over screen is displayed; activating Restart resets lives to 3 and loads level 1; activating Return to Title shows the title screen.
- NOTES
  Both options must be functional.
- RELATED
  UC-007

---

## BR-025 : Collecting a 1-up item shall immediately increment the player's lives counter by 1
- TESTABLE CONDITION
  Given the player has N lives and the player character overlaps a 1-up item, when the collection is resolved, then the lives counter displays N+1 and the 1-up item is removed from the scene.
- NOTES
  Extra-life item mechanic.
- RELATED
  UC-007

---

## BR-026 : Hidden question-mark blocks shall be invisible or disguised in their dormant state and shall become visibly activated when struck from below by the player character
- TESTABLE CONDITION
  Given a hidden block is defined in level data at a specific position, when the player character's upper hitbox strikes the underside of that position, then the block changes to an activated visual state and produces its defined contents.
- NOTES
  Block discovery mechanic; dormant appearance may be an unmarked solid tile or a question-mark tile depending on the visual design.
- RELATED
  UC-008

---

## BR-027 : A struck question-mark block shall release either a coin or a power-up item as configured in level data
- TESTABLE CONDITION
  Given a question-mark block is configured to contain a coin and is struck, when activation resolves, then a coin is added to the player's total; given the block contains a power-up and is struck, when activation resolves, then the power-up item spawns above the block and becomes collectible.
- NOTES
  Block contents are data-driven per block instance in level data.
- RELATED
  UC-008

---

## BR-028 : Each level shall contain at least one block that is invisible or indistinguishable from solid-air tiles and that reveals a collectible item or secret passage when struck from below
- TESTABLE CONDITION
  Given a level is inspected via its JSON level data, when hidden-block objects are enumerated, then at least one hidden-block entry exists; given the player character strikes it from below during gameplay, then a coin, power-up, or passage is revealed within one frame of the strike.
- NOTES
  Measurable criterion replaces the previously vague "non-obvious exploration" phrasing.
- RELATED
  UC-008

---

## BR-029 : Pressing Escape or P during active gameplay shall pause game execution and overlay a pause indicator
- TESTABLE CONDITION
  Given gameplay is active, when Escape or P is pressed, then the game loop suspends all physics and timer updates, all entity movements freeze, and a pause overlay is rendered on top of the game canvas.
- NOTES
  Pause trigger must work at any point during active play.
- RELATED
  UC-009

---

## BR-030 : While the game is paused, all physics updates, entity movements, animations, and the level timer shall cease updating
- TESTABLE CONDITION
  Given the game is in the paused state, when any number of frames elapse in the browser's animation loop, then no change occurs to any entity position, velocity, animation frame, or the level timer value.
- NOTES
  Complete freeze; the game loop may continue ticking but shall not update game state.
- RELATED
  UC-009

---

## BR-031 : Pressing Escape or P while paused shall resume gameplay and dismiss the pause overlay with all state preserved exactly as it was at pause
- TESTABLE CONDITION
  Given the game is paused, when Escape or P is pressed, then the pause overlay is dismissed and gameplay resumes; all entity positions, velocities, inventory states, and the level timer value are identical to their values at the moment of pause.
- NOTES
  No state drift permitted during pause.
- RELATED
  UC-009

---

## BR-032 : The game shall play looping background music during active level play
- TESTABLE CONDITION
  Given a level is actively running and not paused, when the audio system is monitored, then background music plays in a continuous loop at audible volume; music ceases or changes appropriately on level complete, death, and game over.
- NOTES
  Music during active gameplay only; pausing may mute or continue music per design choice.
- RELATED
  UC-010

---

## BR-033 : The game shall play distinct sound effects for each of the following six events: jump, enemy stomp, coin collection, power-up collection, player death, and level complete
- TESTABLE CONDITION
  Given each event occurs during gameplay, when the event triggers, then a corresponding distinct audio cue plays within 1 rendering frame of the event; each of the six cues is audibly distinguishable from the others.
- NOTES
  Six minimum named sound events; additional effects (e.g. time warning, 1-up) are permissible.
- RELATED
  UC-010

---

## BR-034 : All audio shall be implemented using the Phaser 3 built-in audio system or the browser Web Audio API; no external audio CDN or third-party audio library shall be used
- TESTABLE CONDITION
  Given the game source code is inspected and the network tab is monitored during play, when audio events occur, then all audio processing uses Phaser 3 audio or the Web Audio API exclusively; no audio-related external requests are made.
- NOTES
  Technology constraint for audio subsystem.
- RELATED
  UC-010

---

## BR-035 : The player shall be able to toggle audio mute via an accessible UI control reachable without leaving the active gameplay screen
- TESTABLE CONDITION
  Given gameplay is active, when the player activates the mute control, then all audio output ceases immediately; when the player activates the control again, then audio resumes from the same point.
- NOTES
  Mute control must be reachable without navigating away from gameplay.
- RELATED
  UC-010

---

## BR-036 : The HUD shall continuously display the current score, remaining lives count, current level identifier, and remaining level time throughout active gameplay
- TESTABLE CONDITION
  Given gameplay is active, when the HUD region is inspected each frame, then all four values — score, lives, level identifier, and time — are present, readable, and reflect current game state without requiring player interaction to refresh.
- NOTES
  HUD data completeness gate; values must update in real time.
- RELATED
  UC-011

---

## BR-037 : The score shall increment by defined positive integer point values upon coin collection, enemy defeat, and power-up collection
- TESTABLE CONDITION
  Given the player collects a coin, defeats an enemy by stomp, or collects a power-up, when each event resolves, then the HUD score value increases by the predefined point amount for that event type and the updated total persists for the remainder of the session.
- NOTES
  Point values per event type are to be defined in a configuration constant or data file.
- RELATED
  UC-011

---

## BR-038 : The level timer shall count down from a defined positive integer value; reaching zero shall trigger the player death sequence
- TESTABLE CONDITION
  Given a level is active and the timer is displayed in the HUD, when the timer decrements to 0, then the player death sequence fires identically to a hazard collision; the timer value is visible and updates once per second throughout.
- NOTES
  Time pressure mechanic; initial timer value is configurable per level.
- RELATED
  UC-011

---

## BR-039 : The game shall be implemented using the Phaser 3 framework as the sole game engine
- TESTABLE CONDITION
  Given the game source code and all included script tags are inspected, when game engine dependencies are identified, then Phaser 3 (any 3.x release) is present and no other game engine or physics framework is included.
- NOTES
  Technology mandate for all downstream stages.
- RELATED
  UC-001, UC-002, UC-003, UC-004, UC-005, UC-006, UC-007, UC-008, UC-009, UC-010, UC-011

---

## BR-040 : The game shall target a render loop of 60 frames per second
- TESTABLE CONDITION
  Given the game is running on a current-generation desktop with a standard web browser, when the requestAnimationFrame timestamps are sampled over a 10-second active play interval, then at least 95% of frame intervals are ≤ 16.67 ms.
- NOTES
  60fps target is the primary performance goal; sustained degradation is addressed by BR-046.
- RELATED
  UC-002, UC-003, UC-004

---

## BR-041 : All required assets shall be preloaded during the boot sequence before the first level becomes interactive
- TESTABLE CONDITION
  Given the game is loading, when the BootScene's preload callback completes, then all sprites, tilesets, audio files, and level JSON data are available in Phaser's cache and no 404 or network-error responses appear in the network panel.
- NOTES
  Asset completeness gate at boot; runtime console errors addressed by BR-047.
- RELATED
  UC-001

---

## BR-042 : The game shall execute without unhandled JavaScript exceptions on the current stable releases of Chrome, Firefox, and Safari, and all 11 UC-defined behaviours shall function as specified on each browser
- TESTABLE CONDITION
  Given the game is loaded on each of Chrome (latest stable), Firefox (latest stable), and Safari (latest stable), when a session exercising UC-001 through UC-011 acceptance criteria is completed on each browser in turn, then zero unhandled JavaScript exceptions appear in the browser console and every UC acceptance criterion is met.
- NOTES
  Mobile browsers are out of scope unless added by a future UC. "Degraded functionality" is replaced with the concrete criterion of all 11 UC acceptance criteria passing.
- RELATED
  UC-001, UC-002, UC-003, UC-004, UC-005, UC-006, UC-007, UC-008, UC-009, UC-010, UC-011

---

## BR-043 : All game assets shall be original or verifiably CC0-licensed (or equivalently compatible open-license)
- TESTABLE CONDITION
  Given all asset files (sprites, tilesets, audio, fonts) are audited, when each asset's license is examined, then every asset is either an original creation by the project team or is traceable to a public-domain or CC0 source with a retrievable origin URL.
- NOTES
  Legal compliance gate (licensing side); attribution manifest is addressed by BR-052. CC-BY assets require attribution file.
- RELATED
  UC-001, UC-002, UC-003, UC-004, UC-005, UC-006, UC-007, UC-008, UC-009, UC-010, UC-011

---

## BR-044 : The game shall make no outbound network requests to any domain other than its own serving host during a gameplay session
- TESTABLE CONDITION
  Given the game is running and the browser network panel is monitored throughout, when a complete gameplay session is executed from title screen to game over or level completion, then zero HTTP/HTTPS requests are issued to any domain other than the game's own serving host.
- NOTES
  Satisfies OWASP A05 by preventing unintended data leakage to third parties.
- RELATED
  UC-001

---

## BR-045 : Any persistent session data shall be stored exclusively in browser localStorage on the user's device and shall not leave the device
- TESTABLE CONDITION
  Given the player completes levels and a high score or progress record is written, when the browser Application storage and network tabs are inspected after the session ends, then the data is present in localStorage under the game's origin and no remote storage calls are present in the network log.
- NOTES
  Data residency constraint; ensures GDPR/privacy compliance for a statically served game.
- RELATED
  UC-006, UC-007, UC-011

---

## BR-046 : The game shall sustain a render rate of at least 55 frames per second throughout all active gameplay on modern desktop hardware
- TESTABLE CONDITION
  Given the game is running on a current-generation desktop browser, when frame intervals are measured over any 10-second active-gameplay window, then no more than 5% of frames exceed 18 ms (≈55 fps lower bound); any sustained period (≥2 seconds) averaging below 55 fps constitutes a failure.
- NOTES
  Split from BR-040 (60fps target); this BR covers the sustained minimum floor.
- RELATED
  UC-002, UC-003, UC-004

---

## BR-047 : Zero asset-load errors shall appear in the browser console during a complete gameplay session from boot to game over or level completion
- TESTABLE CONDITION
  Given the game is booted and all levels are played through in sequence, when the browser developer console is monitored throughout, then no asset-not-found, failed-fetch, or CORS errors appear at any point in the session.
- NOTES
  Split from BR-041 (preload gate); this BR covers runtime console cleanliness beyond boot.
- RELATED
  UC-001

---

## BR-048 : No Nintendo-owned intellectual property shall be incorporated in any game asset, source file, or data file
- TESTABLE CONDITION
  Given all game files (sprites, tilesets, audio, fonts, JSON, source code) are audited, when each file is compared against the list of known Nintendo-copyrighted works, then no file contains content directly extracted or derived from Nintendo-published titles.
- NOTES
  Split from BR-043 (asset licensing); this BR covers the IP-exclusion side of the legal compliance gate.
- RELATED
  UC-001, UC-002, UC-003, UC-004, UC-005, UC-006, UC-007, UC-008, UC-009, UC-010, UC-011

---

## BR-049 : The game shall not transmit any user data to any remote server during or after a gameplay session
- TESTABLE CONDITION
  Given the browser network panel is monitored throughout a complete gameplay session, when the session ends, then zero HTTP/HTTPS requests carrying user-identifiable or behavioural data are recorded to any domain.
- NOTES
  Split from BR-044 (no external requests); this BR covers data-transmission privacy. Satisfies OWASP A02.
- RELATED
  UC-001

---

## BR-050 : The audio system shall default to the unmuted (on) state on first load with no user configuration required
- TESTABLE CONDITION
  Given a new browser session with no prior localStorage state, when the game loads and a level starts, then background music and sound effects play at audible volume without any user action.
- NOTES
  Split from BR-035 (mute toggle); this BR covers the default audio-on state.
- RELATED
  UC-010

---

## BR-051 : The player character's jump trajectory shall follow configurable gravity-based projectile physics with a peak determined by initial vertical velocity and per-frame gravity deceleration
- TESTABLE CONDITION
  Given a jump is initiated, when the player character is airborne, then vertical velocity decreases each frame at the configured gravity constant (~500 px/sec²) until the apex is reached, then increases downward at the same rate until the character lands; altering the gravity constant in configuration produces a proportionally different arc.
- NOTES
  Split from BR-007 (movement speed); this BR covers the jump-physics side. Gravity and jump-velocity values are configurable constants.
- RELATED
  UC-002

---

## BR-052 : Each game asset shall be documented in a project asset manifest that records its filename, source URL or origin label, and applicable license
- TESTABLE CONDITION
  Given the project asset manifest file is inspected, when every asset deployed in `./build/` is cross-referenced against the manifest, then a corresponding manifest entry exists for each asset containing filename, source URL or "original", and license identifier; any asset absent from the manifest constitutes a failure.
- NOTES
  Split from BR-043 (CC0 licensing); this BR covers the attribution-documentation side.
- RELATED
  UC-001

---

## BR-053 : No user data shall be stored in any location other than the browser's own localStorage on the user's device
- TESTABLE CONDITION
  Given the browser Application storage panel is inspected after a complete gameplay session, when all storage locations (cookies, sessionStorage, IndexedDB, remote sync) are checked, then user-related data exists only in localStorage under the game's own origin and no other storage is written.
- NOTES
  Split from BR-049 (data transmission); this BR covers the local storage-scope side. Satisfies GDPR/CCPA data residency for a statically served game.
- RELATED
  UC-001

---
