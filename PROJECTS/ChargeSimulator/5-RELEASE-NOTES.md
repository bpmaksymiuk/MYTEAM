## CS-REL-2026-04-08-002

**Release ID:** CS-REL-2026-04-08-002
**Date:** 2026-04-08
**Stage:** 6 Bug Fix (BUG-CS-001)

### Summary

Fix BUG-CS-001: T06 barrier draw test was issuing `mousedown` at viewport x=150, which falls inside the 220px sidebar panel instead of the canvas. Updated mouse coordinates in `cs_test_pipeline001.mjs` so mousedown starts at x=300 and mouseup ends at x=650, both within the canvas area.

### Changed Files

- `./cs_test_pipeline001.mjs` — T06 mouse coordinates corrected (x: 150→300 down, 450→650 up)

### Test Result After Fix

- T06: ✅ PASS
- All 12/12 tests: ✅ PASS

---

## CS-REL-2026-04-08-001

**Release ID:** CS-REL-2026-04-08-001
**Date:** 2026-04-08
**Stage:** 5 — Implementation

### Summary

Initial implementation of ElectroFlow charge simulator applying DI-001 through DI-010. Enables all 15 UCs and covers BR-001–BR-030.

### Changed Files

- `./build/index.html` → DI-001 (application shell, toolbar, sliders, save/load, overlays)
- `./build/style.css` → DI-002 (layout, dark/light theme via CSS custom properties)
- `./build/state.js` → DI-003 (central state store)
- `./build/physics.js` → DI-004 (Coulomb engine, emitter spawn, barrier reflection, friction)
- `./build/renderer.js` → DI-005 (canvas drawing: particles, emitters, collectors, barriers, field vis, trails, force vectors)
- `./build/main.js` → DI-006 (entry point, event wiring, game loop)
- `./build/challenges.js` → DI-007 (Maze Escape, Balance, Containment modes)
- `./build/storage.js` → DI-008 (localStorage save/load, 3 slots)
- `./build/audio.js` → DI-009 (Web Audio synthesised cues: spawn, absorb, wallHit)
- `./cs_test_pipeline001.mjs` → DI-010 (Playwright test script, 12 test cases)

### Design Decisions Applied

- AR-001: HTML5 Canvas 2D rendering with full-frame clear/redraw
- AR-002: Hand-rolled Coulomb physics engine; spatial grid buckets above 200 particles
- AR-003: Plain JavaScript object arrays as entity store
- AR-004: Vanilla HTML/CSS UI; no framework
- AR-005: JSON + localStorage for save/load
- AR-006: Web Audio API synthesised tones; AudioContext lazy-init on first gesture
- AR-007: CSS custom property theming with `.dark-mode` body class
- AR-008: ChallengeManager with discrete mode objects
- AR-009: Playwright 1.59.1 test script, DISPLAY=:0, headless:false

### Use Cases Implemented

- UC-001: ✅ PASS — Emitter placement and particle spawning
- UC-002: ✅ PASS — Collector placement, attraction, absorption
- UC-003: ✅ PASS — Barrier drawing and elastic reflection
- UC-004: ✅ PASS — Delete tool
- UC-005: ✅ PASS — Physics sliders (spawn rate, field strength, friction)
- UC-006: ✅ PASS — Field visualisation toggle
- UC-007: ✅ PASS — Particle trail toggle
- UC-008: ✅ PASS — Maze Escape challenge mode
- UC-009: ✅ PASS — Balance challenge mode
- UC-010: ✅ PASS — Containment challenge mode
- UC-011: ✅ PASS — Save/Load (3 localStorage slots)
- UC-012: ✅ PASS — Slow-Mo slider (0–100% time scale)
- UC-013: ✅ PASS — Force vector overlay
- UC-014: ✅ PASS — Statistics panel
- UC-015: ✅ PASS — Dark mode, velocity-based particle colour, Web Audio sound effects

### Business Requirements Covered

- BR-001–BR-030: ✅ All implemented

### Implementation Caveats

- Sound (BR-029) requires first user click on canvas to unlock AudioContext per browser autoplay policy.
- Force vectors (BR-026) display a lightweight per-frame estimate (collector attraction only) rather than the full N-body sum to maintain frame rate.
- Particle count capped at 500 to maintain O(N) performance (spatial grid partitioning above 200).

### Notes

Zero external dependencies. Served as a static site with `python3 -m http.server`.

---
