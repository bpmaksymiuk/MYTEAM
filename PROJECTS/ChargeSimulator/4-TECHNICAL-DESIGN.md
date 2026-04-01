TECH-DESIGN:
- DESIGN ID: UC-01.BR-01.ARCH-01.DES-01
- IMPLEMENTATION TASKS: Build browser-delivered single page with canvas, controls panel, and script bootstrap.
- INTERFACES AND DATA CONTRACTS: AppState { running:boolean, canvas:{width:number,height:number} }.
- EDGE CASES AND ERROR HANDLING: If canvas context cannot initialize, show visible error and disable run controls.
- TEST NOTES: Open src/index.html and verify app shell and controls render.

TECH-DESIGN:
- DESIGN ID: UC-02.BR-01.ARCH-01.DES-01
- IMPLEMENTATION TASKS: Add polarity selector and placement tool; place static charges on canvas pointer interaction.
- INTERFACES AND DATA CONTRACTS: ChargeNode { id:string, x:number, y:number, polarity:1|-1, role:'sink'|'source' }.
- EDGE CASES AND ERROR HANDLING: Reject placement near canvas edge margins to prevent clipped markers.
- TEST NOTES: Place both polarities and verify visual plus/minus markers.

TECH-DESIGN:
- DESIGN ID: UC-03.BR-01.ARCH-01.DES-01
- IMPLEMENTATION TASKS: Implement barrier draw drag flow and eraser mode with nearest-segment deletion and bounce physics.
- INTERFACES AND DATA CONTRACTS: BarrierSegment { id:string, x1:number, y1:number, x2:number, y2:number }.
- EDGE CASES AND ERROR HANDLING: Ignore too-short barrier drags and skip zero-length normal computations.
- TEST NOTES: Draw a barrier crossing particle path and confirm reflection; erase and confirm removal.

TECH-DESIGN:
- DESIGN ID: UC-04.BR-01.ARCH-01.DES-01
- IMPLEMENTATION TASKS: Maintain spawn accumulators for each negative node and emit particles at configured interval.
- INTERFACES AND DATA CONTRACTS: Particle { id:string, x:number, y:number, vx:number, vy:number, age:number }.
- EDGE CASES AND ERROR HANDLING: Clamp maximum particle count and stop spawning when paused.
- TEST NOTES: With one source, verify periodic new particle creation while running.

TECH-DESIGN:
- DESIGN ID: UC-05.BR-01.ARCH-01.DES-01
- IMPLEMENTATION TASKS: Detect sink capture using configurable radius and remove captured particles while tracking counter.
- INTERFACES AND DATA CONTRACTS: Stats { active:number, spawned:number, annihilated:number }.
- EDGE CASES AND ERROR HANDLING: Ensure one particle increments annihilation once before removal.
- TEST NOTES: Route particles toward a sink and verify counter increments.

TECH-DESIGN:
- DESIGN ID: UC-06.BR-01.ARCH-01.DES-01
- IMPLEMENTATION TASKS: Wire spawn-rate range input to config and update display labels live.
- INTERFACES AND DATA CONTRACTS: SimConfig { spawnPerSecond:number }.
- EDGE CASES AND ERROR HANDLING: Clamp spawn rate to slider min/max bounds.
- TEST NOTES: Adjust slider and verify measured emission frequency changes.

TECH-DESIGN:
- DESIGN ID: UC-07.BR-01.ARCH-01.DES-01
- IMPLEMENTATION TASKS: Compute force field from static nodes and particle repulsion with softening epsilon and capped acceleration.
- INTERFACES AND DATA CONTRACTS: ForceParams { k:number, particleRepel:number, epsilon:number, maxAccel:number }.
- EDGE CASES AND ERROR HANDLING: Avoid division by zero with epsilon when distances are very small.
- TEST NOTES: Verify attraction/repulsion trends by placing opposite and like-polarity nodes.

TECH-DESIGN:
- DESIGN ID: UC-08.BR-01.ARCH-01.DES-01
- IMPLEMENTATION TASKS: Apply speed and strength multipliers in update integration and UI labels.
- INTERFACES AND DATA CONTRACTS: SimConfig { simSpeed:number, forceStrength:number }.
- EDGE CASES AND ERROR HANDLING: Use bounded dt and damping to prevent unstable explosive motion.
- TEST NOTES: Change controls at runtime and observe immediate trajectory differences.

TECH-DESIGN:
- DESIGN ID: UC-09.BR-01.ARCH-01.DES-01
- IMPLEMENTATION TASKS: Add advanced controls (lifetime, damping, capture radius, trails) and a reset button to defaults.
- INTERFACES AND DATA CONTRACTS: AdvancedConfig { particleLifetime:number, damping:number, captureRadius:number, showTrails:boolean }.
- EDGE CASES AND ERROR HANDLING: Keep reset idempotent and update all control labels.
- TEST NOTES: Modify advanced options, then reset and verify defaults restored.

TECH-DESIGN:
- DESIGN ID: UC-10.BR-01.ARCH-01.DES-01
- IMPLEMENTATION TASKS: Build intuitive control groups, active mode highlighting, run/pause button, and live stats/status text.
- INTERFACES AND DATA CONTRACTS: UIState { mode:string, statusText:string }.
- EDGE CASES AND ERROR HANDLING: If no source exists while running, show guidance status instead of silent idle behavior.
- TEST NOTES: Confirm active mode and status text change as user interacts.
