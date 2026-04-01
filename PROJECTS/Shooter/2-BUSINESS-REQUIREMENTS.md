BUSINESS REQUIREMENT:
- BR ID: UC-01.BR-01
- REQUIREMENT STATEMENT: The system shall load and run as a browser-based game with a startable play session.
- PRIORITY: High
- TESTABLE CONDITION: Opening src/index.html displays a main menu and starting the game enters an interactive scene.
- TESTABLE CONDITION: Opening src/index.html shows a main menu within 5 seconds and Start transitions to a responsive interactive scene without fatal errors.

BUSINESS REQUIREMENT:
- BR ID: UC-02.BR-01
- REQUIREMENT STATEMENT: The player shall control first-person movement with WASD, mouse look, jump, and sprint.
- PRIORITY: High
- TESTABLE CONDITION: While pointer lock is active, keyboard and mouse input moves and rotates the camera, and jump/sprint change movement behavior.
- TESTABLE CONDITION: With pointer lock active, WASD/mouse/jump/sprint update player movement and camera behavior as expected in first-person mode.

BUSINESS REQUIREMENT:
- BR ID: UC-03.BR-01
- REQUIREMENT STATEMENT: The weapon system shall support at least two weapon types, firing, switching, and ammo updates.
- PRIORITY: High
- TESTABLE CONDITION: Player can switch between rifle and launcher, fire both, and HUD ammo reflects usage.
- TESTABLE CONDITION: Player can switch between at least two weapons, fire to damage valid enemies, and HUD ammo/weapon indicators update immediately.

BUSINESS REQUIREMENT:
- BR ID: UC-04.BR-01
- REQUIREMENT STATEMENT: The game shall provide health and ammo pickups that can be collected during play.
- PRIORITY: Medium
- TESTABLE CONDITION: Colliding with pickups increases corresponding resource and removes the pickup from the scene.
- TESTABLE CONDITION: Entering pickup radius applies exactly one health/ammo effect, clamps health max, and removes the pickup from the scene.

BUSINESS REQUIREMENT:
- BR ID: UC-05.BR-01
- REQUIREMENT STATEMENT: The game shall process player damage, death, and respawn/game-over flow.
- PRIORITY: High
- TESTABLE CONDITION: Enemy attacks reduce health, reaching zero triggers game-over overlay, and restart begins a fresh run.
- TESTABLE CONDITION: Enemy damage reduces player health, health zero triggers game-over state, and restart restores valid playable defaults.

BUSINESS REQUIREMENT:
- BR ID: UC-06.BR-01
- REQUIREMENT STATEMENT: The system shall spawn and update at least two enemy archetypes with pursuit/attack behavior.
- PRIORITY: High
- TESTABLE CONDITION: Melee and ranged enemies spawn, track player, and attempt attacks when in range.
- TESTABLE CONDITION: At least two enemy archetypes spawn, pursue/attack by archetype rules, and continue updating without stalling gameplay.

BUSINESS REQUIREMENT:
- BR ID: UC-07.BR-01
- REQUIREMENT STATEMENT: Enemies shall have health, take damage, and on death update score/kill progression.
- PRIORITY: High
- TESTABLE CONDITION: Enemy health decreases on hit, death removes enemy, and kill counter/score increase.
- TESTABLE CONDITION: Enemy hit decreases HP, death is processed once, and score/kill counters increment exactly once per enemy death.

BUSINESS REQUIREMENT:
- BR ID: UC-08.BR-01
- REQUIREMENT STATEMENT: The game shall provide one complete playable map with hazards, pickups, and spawn points.
- PRIORITY: High
- TESTABLE CONDITION: A single level includes hazard zones, enemy spawns, and collectible items while remaining playable end-to-end.
- TESTABLE CONDITION: One map includes hazards, spawns, and pickups and supports a full combat loop without blocking progression.

BUSINESS REQUIREMENT:
- BR ID: UC-09.BR-01
- REQUIREMENT STATEMENT: The UI shall provide main menu, in-game HUD, pause controls, and game-over stats.
- PRIORITY: High
- TESTABLE CONDITION: Menu starts game, HUD updates live, pause toggles gameplay, and game-over screen shows score and kills.
- TESTABLE CONDITION: Menu start, live HUD updates, pause/resume flow, and game-over stats are all visible and state-consistent.

BUSINESS REQUIREMENT:
- BR ID: UC-10.BR-01
- REQUIREMENT STATEMENT: The game shall support configurable key bindings and optional gamepad input.
- PRIORITY: Medium
- TESTABLE CONDITION: Player can remap core movement keys and gamepad axes/buttons can drive movement/look/fire when connected.
- TESTABLE CONDITION: Player can remap core movement keys at runtime, and connected gamepad input drives movement/look/fire with invalid duplicate binds safely rejected.

BUSINESS REQUIREMENT:
- BR ID: UC-11.BR-01
- REQUIREMENT STATEMENT: The game shall provide optional combat and ambience audio feedback.
- PRIORITY: Low
- TESTABLE CONDITION: Weapon, enemy, and ambient cues are generated when audio is enabled and muted when disabled.
- TESTABLE CONDITION: Weapon/combat/ambient audio cues are generated after user-gesture audio init when enabled and suppressed by mute toggle.

BUSINESS REQUIREMENT:
- BR ID: UC-12.BR-01
- REQUIREMENT STATEMENT: The runtime shall apply basic performance optimizations suitable for browser playability.
- PRIORITY: Medium
- TESTABLE CONDITION: The loop uses fixed-step constraints, object pooling/reuse for projectiles, and reports a stable FPS indicator during play.
- TESTABLE CONDITION: Runtime uses bounded dt plus projectile pooling and exposes FPS telemetry while remaining stable through sustained combat and repeated restarts.
