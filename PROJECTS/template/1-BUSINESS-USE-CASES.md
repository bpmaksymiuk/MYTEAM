USE CASE:
- USE CASE ID: UC-01
- GOAL: Launch and run the FPS game in modern web browsers.
- ACTOR: Player
- STEP BY STEP WALKTHROUGH:
	1. Player opens the game URL in a supported browser.
	2. Main menu appears with a start option.
	3. Player starts a match and game assets initialize.
	4. Scene, HUD, and controls become interactive.
	5. Player enters active gameplay without installing native software.
- ACCEPTANCE CRITERIA:
	- Opening src/index.html in a modern browser shows the main menu within 5 seconds.
	- Pressing Start transitions from menu to active gameplay in one interaction.
	- No native installer, extension, or external runtime is required to start play.
	- During a 2-minute play session, controls and rendering remain responsive without fatal errors.

USE CASE:
- USE CASE ID: UC-02
- GOAL: Control player movement and camera in first-person perspective.
- ACTOR: Player
- STEP BY STEP WALKTHROUGH:
	1. Player starts gameplay and captures pointer for mouse look.
	2. Player uses WASD to move across the map.
	3. Player moves mouse to aim camera direction.
	4. Player presses Space to jump while gravity applies.
	5. Player presses Shift to sprint for faster traversal.
- ACCEPTANCE CRITERIA:
	- With pointer lock active, WASD moves player position along map axes in first-person view.
	- Mouse movement updates yaw and pitch smoothly with no camera inversion glitches.
	- Pressing Space while grounded causes upward movement and returns player to ground via gravity.
	- Holding Shift increases travel speed compared to non-sprinting movement.

USE CASE:
- USE CASE ID: UC-03
- GOAL: Use multiple weapons with firing and switching mechanics.
- ACTOR: Player
- STEP BY STEP WALKTHROUGH:
	1. Player starts with a default weapon.
	2. Player switches between available weapons via number keys or mouse wheel.
	3. Player fires selected weapon at targets.
	4. System handles hit-scan and/or projectile behavior by weapon type.
	5. Ammo count updates and empty-mag behavior is enforced.
- ACCEPTANCE CRITERIA:
	- At least two usable weapons are available during one run.
	- Switching between weapons via numeric keys or scroll-like input works while moving.
	- Firing at a valid target reduces enemy health by weapon-defined damage.
	- HUD weapon label and ammo count update immediately after switch and fire actions.

USE CASE:
- USE CASE ID: UC-04
- GOAL: Collect ammo and health pickups in the level.
- ACTOR: Player
- STEP BY STEP WALKTHROUGH:
	1. Player explores the level and finds pickups.
	2. Player moves into pickup collision range.
	3. System applies pickup effect (ammo refill or health restore).
	4. Pickup is removed or put on cooldown.
	5. HUD reflects updated ammo/health values.
- ACCEPTANCE CRITERIA:
	- Entering pickup radius applies exactly one pickup effect per pickup instance.
	- Health pickup increases health but never exceeds configured maximum.
	- Ammo pickup increases ammo for supported weapons and reflects in HUD.
	- Consumed pickup is removed from scene or disabled immediately after collection.

USE CASE:
- USE CASE ID: UC-05
- GOAL: Handle player damage, death, and respawn flow.
- ACTOR: Player
- STEP BY STEP WALKTHROUGH:
	1. Enemy attack hits the player.
	2. Player health decreases and damage feedback appears.
	3. If health reaches zero, player enters death state.
	4. System shows respawn or game-over transition per mode rules.
	5. Player respawns at a valid spawn point with reset state.
- ACCEPTANCE CRITERIA:
	- Enemy attacks decrement player health by configured damage values.
	- Damage events are visible through HUD health change and/or feedback cue.
	- Health reaching zero transitions game state to game-over screen.
	- Restart action resets player health/position and resumes playable state.

USE CASE:
- USE CASE ID: UC-06
- GOAL: Spawn enemies with distinct AI behaviors.
- ACTOR: Game System
- STEP BY STEP WALKTHROUGH:
	1. Level initializes enemy spawn points.
	2. System spawns at least two enemy archetypes.
	3. Enemies detect player within awareness range.
	4. Enemies navigate toward or attack player based on type.
	5. Enemy behavior updates continuously during combat.
- ACCEPTANCE CRITERIA:
	- At least two enemy archetypes spawn in one session (for example, melee and ranged).
	- Enemies acquire player target and navigate/attack according to archetype rules.
	- Enemy attacks occur only when target is within configured engagement range.
	- Continuous AI updates for 2 minutes do not stall main game loop.

USE CASE:
- USE CASE ID: UC-07
- GOAL: Apply enemy damage, death outcomes, and reward progression.
- ACTOR: Player
- STEP BY STEP WALKTHROUGH:
	1. Player attacks enemy targets.
	2. Enemy health decreases on valid hits.
	3. Enemy health bar reflects damage state.
	4. On zero health, enemy dies and plays death behavior.
	5. Score/kill counter and optional loot drop are updated.
- ACCEPTANCE CRITERIA:
	- Each enemy instance has health state that decreases on valid hits.
	- Enemy health bar visually reflects health reduction after damage.
	- Enemy death removes/deactivates the enemy and prevents duplicate death handling.
	- Kill count and score increment exactly once per enemy death.

USE CASE:
- USE CASE ID: UC-08
- GOAL: Play a complete level with hazards, spawns, and combat loop.
- ACTOR: Player
- STEP BY STEP WALKTHROUGH:
	1. Player loads a playable map.
	2. Player navigates environment containing hazards and pickups.
	3. Player engages enemies while avoiding hazards.
	4. Player survives and progresses through encounter spaces.
	5. Player reaches end condition or loop completion for the level.
- ACCEPTANCE CRITERIA:
	- One playable map loads with valid player spawn and enemy spawn positions.
	- Map contains at least one hazard zone that applies damage when entered.
	- Map includes collectible pickups placed at reachable positions.
	- Player can play through a full combat loop on the map without reset-required blocking issues.

USE CASE:
- USE CASE ID: UC-09
- GOAL: Provide an in-game HUD and menu flow.
- ACTOR: Player
- STEP BY STEP WALKTHROUGH:
	1. Player starts from main menu.
	2. During gameplay, HUD shows health, weapon, ammo, score/kills, and crosshair.
	3. Player pauses game and opens pause menu.
	4. Player resumes from pause or changes available settings.
	5. On loss condition, game-over screen displays match stats.
- ACCEPTANCE CRITERIA:
	- Main menu Start enters gameplay state on first click.
	- HUD continuously shows health, weapon, ammo, kills, and score while running.
	- Pause input opens pause menu and Resume returns to running state.
	- Game-over screen displays final kills and score after player death.

USE CASE:
- USE CASE ID: UC-10
- GOAL: Support configurable controls and optional gamepad input.
- ACTOR: Player
- STEP BY STEP WALKTHROUGH:
	1. Player opens control settings.
	2. Player remaps key bindings for core actions.
	3. Player returns to gameplay and validates new bindings.
	4. Player optionally enables and tests gamepad aiming/movement.
	5. System persists active control configuration for session or profile.
- ACCEPTANCE CRITERIA:
	- At least forward/back/left/right keyboard actions are user-remappable.
	- Updated keybindings take effect without requiring page reload.
	- Connected gamepad can drive movement/look/fire through mapped axes/buttons.
	- Invalid or duplicate remap attempts are rejected or safely ignored.

USE CASE:
- USE CASE ID: UC-11
- GOAL: Deliver immersive game audio feedback.
- ACTOR: Player
- STEP BY STEP WALKTHROUGH:
	1. Player starts gameplay with audio enabled.
	2. Player fires weapons and hears weapon SFX.
	3. Enemies react with vocal/audio cues.
	4. Player movement triggers footstep sounds.
	5. Ambient music/soundscape plays and can be adjusted.
- ACCEPTANCE CRITERIA:
	- Triggering weapon fire produces an audio cue when audio is enabled.
	- Combat-related enemy or impact audio cues are generated during encounters.
	- Ambient/audio loop can play during gameplay after user interaction enables audio context.
	- Mute toggle disables subsequent gameplay audio cues.

USE CASE:
- USE CASE ID: UC-12
- GOAL: Maintain performance optimization for smooth gameplay.
- ACTOR: Game System
- STEP BY STEP WALKTHROUGH:
	1. System initializes rendering and scene optimization settings.
	2. Runtime culls off-screen content and applies efficient draw behavior.
	3. Weapon/projectile entities use pooling where applicable.
	4. Assets use optimized formats and level-of-detail strategies.
	5. System sustains stable frame pacing during combat-heavy moments.
- ACCEPTANCE CRITERIA:
	- Runtime includes explicit optimization mechanisms (for example, pooling and bounded simulation dt).
	- FPS telemetry is visible in HUD during gameplay.
	- Sustained combat with repeated firing does not cause immediate frame collapse or crash.
	- Repeated restarts do not leak active entities beyond expected reset state.
