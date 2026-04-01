ARCHITECTURE:
- ARCHITECTURE ID: UC-01.BR-01.ARCH-01
- COMPONENTS AFFECTED: src/index.html, src/styles.css, src/app.js
- TECHNOLOGY DECISIONS: Use Three.js via CDN for browser-only rendering and initialize game through an overlay-driven main menu flow.
- TRADEOFFS: CDN setup is fast and simple but less controlled than pinned package builds.

ARCHITECTURE:
- ARCHITECTURE ID: UC-02.BR-01.ARCH-01
- COMPONENTS AFFECTED: src/app.js
- TECHNOLOGY DECISIONS: Implement first-person controls with Pointer Lock API, camera yaw/pitch, velocity integration, gravity, and sprint multiplier.
- TRADEOFFS: Custom controls reduce dependencies but require manual tuning and edge-case handling.

ARCHITECTURE:
- ARCHITECTURE ID: UC-03.BR-01.ARCH-01
- COMPONENTS AFFECTED: src/app.js, src/index.html
- TECHNOLOGY DECISIONS: Use weapon descriptors for rifle (hitscan) and launcher (projectile) with per-weapon ammo state and HUD binding.
- TRADEOFFS: Dual fire models increase complexity but provide distinct combat feel.

ARCHITECTURE:
- ARCHITECTURE ID: UC-04.BR-01.ARCH-01
- COMPONENTS AFFECTED: src/app.js
- TECHNOLOGY DECISIONS: Represent pickups as scene entities with collision radius and typed effect handlers (health/ammo).
- TRADEOFFS: Radius checks are efficient but less precise than mesh-level collisions.

ARCHITECTURE:
- ARCHITECTURE ID: UC-05.BR-01.ARCH-01
- COMPONENTS AFFECTED: src/app.js, src/index.html
- TECHNOLOGY DECISIONS: Use centralized player-state reducer for health and terminal game-over state with restart transition.
- TRADEOFFS: Central state simplifies consistency but can grow large without modularization.

ARCHITECTURE:
- ARCHITECTURE ID: UC-06.BR-01.ARCH-01
- COMPONENTS AFFECTED: src/app.js
- TECHNOLOGY DECISIONS: Implement enemy archetypes as parameterized behavior modules (melee chase, ranged standoff with cooldown).
- TRADEOFFS: Simple state machines are lightweight but less expressive than navmesh/behavior trees.

ARCHITECTURE:
- ARCHITECTURE ID: UC-07.BR-01.ARCH-01
- COMPONENTS AFFECTED: src/app.js, src/index.html
- TECHNOLOGY DECISIONS: Use health components and death handlers to remove enemies, increment score, and update HUD counters.
- TRADEOFFS: Immediate despawn is clear but lacks richer animation transitions.

ARCHITECTURE:
- ARCHITECTURE ID: UC-08.BR-01.ARCH-01
- COMPONENTS AFFECTED: src/app.js
- TECHNOLOGY DECISIONS: Build one arena map from procedural primitives with hazard volumes, spawn points, and pickup placements.
- TRADEOFFS: Primitive maps are quick to build but less detailed than authored 3D assets.

ARCHITECTURE:
- ARCHITECTURE ID: UC-09.BR-01.ARCH-01
- COMPONENTS AFFECTED: src/index.html, src/styles.css, src/app.js
- TECHNOLOGY DECISIONS: Use layered DOM overlays for main menu, pause panel, HUD, and game-over screen tied to game-state transitions.
- TRADEOFFS: DOM overlays are easy to style but require synchronization with render loop state.

ARCHITECTURE:
- ARCHITECTURE ID: UC-10.BR-01.ARCH-01
- COMPONENTS AFFECTED: src/index.html, src/app.js
- TECHNOLOGY DECISIONS: Store keybind mapping in mutable config and poll Gamepad API each frame when available.
- TRADEOFFS: Runtime remapping is flexible but adds additional input conflict validation.

ARCHITECTURE:
- ARCHITECTURE ID: UC-11.BR-01.ARCH-01
- COMPONENTS AFFECTED: src/app.js, src/index.html
- TECHNOLOGY DECISIONS: Generate lightweight procedural tones through Web Audio API for combat and ambience with global mute toggle.
- TRADEOFFS: Procedural audio avoids asset files but has simpler sound quality.

ARCHITECTURE:
- ARCHITECTURE ID: UC-12.BR-01.ARCH-01
- COMPONENTS AFFECTED: src/app.js, src/index.html
- TECHNOLOGY DECISIONS: Apply projectile object pooling, bounded delta-time simulation, and FPS telemetry in HUD.
- TRADEOFFS: Basic optimizations improve consistency but do not replace deeper geometry/material tuning.
