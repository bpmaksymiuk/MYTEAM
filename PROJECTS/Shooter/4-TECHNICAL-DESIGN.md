TECH-DESIGN:
- DESIGN ID: UC-01.BR-01.ARCH-01.DES-01
- IMPLEMENTATION TASKS: Build HTML shell with canvas mount, overlays, and boot sequence that starts from main menu.
- INTERFACES AND DATA CONTRACTS: GamePhase = 'menu'|'running'|'paused'|'gameover'; setPhase(nextPhase: GamePhase): void.
- EDGE CASES AND ERROR HANDLING: If WebGL context init fails, show user-visible fatal error message.
- TEST NOTES: Confirm page opens to menu and Start transitions to running phase.

TECH-DESIGN:
- DESIGN ID: UC-02.BR-01.ARCH-01.DES-01
- IMPLEMENTATION TASKS: Implement pointer-lock look, WASD movement, jump physics, sprint multiplier, and ground checks.
- INTERFACES AND DATA CONTRACTS: PlayerState { position:THREE.Vector3, velocity:THREE.Vector3, onGround:boolean, health:number }.
- EDGE CASES AND ERROR HANDLING: Clamp pitch rotation to avoid camera flips and cap velocity to prevent runaway acceleration.
- TEST NOTES: Validate smooth move/look and jump arc with gravity.

TECH-DESIGN:
- DESIGN ID: UC-03.BR-01.ARCH-01.DES-01
- IMPLEMENTATION TASKS: Create weapon registry (rifle and launcher), switch input handlers, ammo tracking, and fire behaviors.
- INTERFACES AND DATA CONTRACTS: Weapon { id:'rifle'|'launcher', ammo:number, fire(now:number):void }.
- EDGE CASES AND ERROR HANDLING: On zero ammo, block firing and emit dry-fire feedback.
- TEST NOTES: Switch weapons and verify distinct damage model and ammo updates.

TECH-DESIGN:
- DESIGN ID: UC-04.BR-01.ARCH-01.DES-01
- IMPLEMENTATION TASKS: Spawn health and ammo pickups, detect proximity collision, apply resource updates, and despawn items.
- INTERFACES AND DATA CONTRACTS: Pickup { type:'health'|'ammo', amount:number, position:THREE.Vector3, radius:number }.
- EDGE CASES AND ERROR HANDLING: Clamp health to max and prevent duplicate pickup application in same frame.
- TEST NOTES: Walk through pickups and verify resource increase and removal.

TECH-DESIGN:
- DESIGN ID: UC-05.BR-01.ARCH-01.DES-01
- IMPLEMENTATION TASKS: Apply damage from enemy attacks, trigger game-over at health zero, and restart run on user action.
- INTERFACES AND DATA CONTRACTS: applyPlayerDamage(amount:number): void; restartGame(): void.
- EDGE CASES AND ERROR HANDLING: Ignore damage processing when phase is not running.
- TEST NOTES: Force damage and confirm game-over overlay and restart flow.

TECH-DESIGN:
- DESIGN ID: UC-06.BR-01.ARCH-01.DES-01
- IMPLEMENTATION TASKS: Implement melee and ranged enemy spawners with simple pursuit/attack loops and cooldown timers.
- INTERFACES AND DATA CONTRACTS: Enemy { id:string, type:'melee'|'ranged', hp:number, speed:number, cooldown:number }.
- EDGE CASES AND ERROR HANDLING: Remove invalid enemies if NaN positions or out-of-bounds values are detected.
- TEST NOTES: Verify both enemy types move and attack according to their archetype behavior.

TECH-DESIGN:
- DESIGN ID: UC-07.BR-01.ARCH-01.DES-01
- IMPLEMENTATION TASKS: Process enemy damage/death, update score and kill count, and refresh HUD counters.
- INTERFACES AND DATA CONTRACTS: CombatStats { score:number, kills:number }; onEnemyKilled(enemyType:string): void.
- EDGE CASES AND ERROR HANDLING: Ensure kill events execute only once per enemy death.
- TEST NOTES: Eliminate enemies and verify score/kills increment deterministically.

TECH-DESIGN:
- DESIGN ID: UC-08.BR-01.ARCH-01.DES-01
- IMPLEMENTATION TASKS: Build one map with walls/floor, hazard zones, spawn points, and pickup placements.
- INTERFACES AND DATA CONTRACTS: HazardZone { min:THREE.Vector3, max:THREE.Vector3, dps:number }.
- EDGE CASES AND ERROR HANDLING: Apply hazard damage only while player is within bounds.
- TEST NOTES: Traverse map and verify hazards, spawns, and pickups are all active.

TECH-DESIGN:
- DESIGN ID: UC-09.BR-01.ARCH-01.DES-01
- IMPLEMENTATION TASKS: Implement menu overlays, HUD labels, pause toggle, and game-over statistics panel.
- INTERFACES AND DATA CONTRACTS: UIBindings { healthEl:HTMLElement, ammoEl:HTMLElement, scoreEl:HTMLElement, fpsEl:HTMLElement }.
- EDGE CASES AND ERROR HANDLING: If any HUD element is missing, fail gracefully with no hard crash.
- TEST NOTES: Validate menu->run->pause->resume->gameover transitions and visible HUD updates.

TECH-DESIGN:
- DESIGN ID: UC-10.BR-01.ARCH-01.DES-01
- IMPLEMENTATION TASKS: Add keybind editing controls and runtime gamepad polling for movement/look/fire.
- INTERFACES AND DATA CONTRACTS: Keybinds { forward:string, back:string, left:string, right:string, jump:string, sprint:string }.
- EDGE CASES AND ERROR HANDLING: Prevent duplicate keybind assignment conflicts.
- TEST NOTES: Remap one movement key and verify input behavior changes accordingly.

TECH-DESIGN:
- DESIGN ID: UC-11.BR-01.ARCH-01.DES-01
- IMPLEMENTATION TASKS: Build procedural audio cues for fire/hit/ambient and add mute toggle state.
- INTERFACES AND DATA CONTRACTS: AudioState { enabled:boolean, context?:AudioContext }; playCue(type:string): void.
- EDGE CASES AND ERROR HANDLING: Handle autoplay restrictions by initializing audio only after user gesture.
- TEST NOTES: Trigger fire and toggle mute to verify expected audible behavior.

TECH-DESIGN:
- DESIGN ID: UC-12.BR-01.ARCH-01.DES-01
- IMPLEMENTATION TASKS: Implement projectile pool reuse, clamp simulation dt, and compute/update FPS in HUD.
- INTERFACES AND DATA CONTRACTS: ProjectilePool { items:Projectile[], acquire():Projectile|null, release(p:Projectile):void }.
- EDGE CASES AND ERROR HANDLING: If pool is exhausted, skip spawn without crashing.
- TEST NOTES: Sustain firing and verify stable updates with visible FPS telemetry.
