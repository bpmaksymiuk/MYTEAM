# ElectroFlow — Parts List

## PT-001 : index.html — Application Shell
- DESCRIPTION: Single HTML file. Contains the canvas element, sidebar panel with tool buttons, sliders (spawn rate, field strength, friction, slow-mo), toggle buttons (field vis, trails, force vectors, dark mode, sound, stats), and challenge mode selector. Loads `main.js` as a module.
- TECHNOLOGY RECOMMENDATIONS: AR-001 (Canvas 2D), AR-004 (vanilla HTML/CSS)
- NOTES: File location: `./build/index.html`. No external CDN links; fully self-contained.
- RELATED: BR-001, BR-002 | UC-001
---

## PT-002 : style.css — Stylesheet
- DESCRIPTION: Layout of sidebar + canvas, CSS custom properties for colour theme, `.dark-mode` class override block, button active states, slider styling, stats panel overlay, neon glow helper class.
- TECHNOLOGY RECOMMENDATIONS: AR-004, AR-007
- NOTES: File location: `./build/style.css`.
- RELATED: BR-002, BR-028 | UC-005, UC-015
---

## PT-003 : main.js — Entry Point and Game Loop
- DESCRIPTION: Initialises canvas context, imports and wires all modules, sets up event listeners (toolbar clicks, canvas mouse events, slider changes), runs the `requestAnimationFrame` loop calling `simulate(dt)` then `render()` each frame.
- TECHNOLOGY RECOMMENDATIONS: AR-001, AR-003
- NOTES: File location: `./build/main.js`. Exports nothing; is the integration root.
- RELATED: BR-001, BR-003, BR-005, BR-008 | UC-001, UC-002, UC-003
---

## PT-004 : physics.js — Simulation Engine
- DESCRIPTION: Exports `simulate(dt, state)`. Computes: per-particle Coulomb repulsion from other particles, attraction toward collectors (inverse-square), emitter spawn logic, barrier elastic reflection, friction damping, slow-mo time scaling, particle lifetime/removal on absorption. Applies spatial grid bucket optimisation when particle count > 200.
- TECHNOLOGY RECOMMENDATIONS: AR-002, AR-003
- NOTES: File location: `./build/physics.js`. Pure function — takes state, mutates particles array, returns nothing.
- RELATED: BR-004, BR-006, BR-007, BR-009, BR-011, BR-013, BR-014 | UC-001, UC-002, UC-003, UC-005
---

## PT-005 : renderer.js — Canvas Renderer
- DESCRIPTION: Exports `render(ctx, state, options)`. Clears canvas. Draws: barriers (lines), emitters (minus icons), collectors (plus icons with size scaled to absorbed count), particles (filled circles with velocity-based colour hue and optional neon shadow), field visualisation gradients, particle trails (ring buffer of last N positions), force-vector arrows. Applies dark/light theme colours.
- TECHNOLOGY RECOMMENDATIONS: AR-001, AR-007
- NOTES: File location: `./build/renderer.js`. All drawing is synchronous within one `render()` call.
- RELATED: BR-015, BR-016, BR-026, BR-028, BR-030 | UC-006, UC-007, UC-013, UC-015
---

## PT-006 : state.js — Application State Store
- DESCRIPTION: Exports the mutable state object: `{ particles, emitters, collectors, barriers, settings, activeTool, challengeMode }`. `settings` holds all slider values and toggle booleans. All modules import from `state.js`; none hold their own copies.
- TECHNOLOGY RECOMMENDATIONS: AR-003
- NOTES: File location: `./build/state.js`.
- RELATED: BR-003, BR-005, BR-008, BR-010 | UC-001, UC-002, UC-003, UC-004
---

## PT-007 : challenges.js — Challenge Mode Manager
- DESCRIPTION: Exports `ChallengeManager` with `start(mode)`, `update(dt)`, `checkEnd()`, `getScore()`. Implements three modes: `maze-escape` (loads maze layout, checks win), `balance` (places two collectors, checks particle count → 0), `containment` (accelerating spawn, checks boundary exit). Each mode stores its own timers and score state.
- TECHNOLOGY RECOMMENDATIONS: AR-008
- NOTES: File location: `./build/challenges.js`. Maze layout is a hardcoded set of barrier segments defined in this file.
- RELATED: BR-017, BR-018, BR-019, BR-020, BR-021, BR-022 | UC-008, UC-009, UC-010
---

## PT-008 : storage.js — Save/Load Manager
- DESCRIPTION: Exports `save(slot, state)` and `load(slot)`. Serialises/deserialises the relevant state slices (emitters, collectors, barriers, settings) to/from `localStorage` keys `ef_slot_1..3`. Exports `listSlots()` returning an array of which slots have data.
- TECHNOLOGY RECOMMENDATIONS: AR-005
- NOTES: File location: `./build/storage.js`.
- RELATED: BR-023, BR-024 | UC-011
---

## PT-009 : audio.js — Sound Effect Engine
- DESCRIPTION: Exports `AudioManager` with `init()` (called on first user gesture) and `play(event)` where event ∈ `{ spawn, absorb, wallHit }`. Each event triggers a short synthesised tone via `OscillatorNode`. `init()` creates the `AudioContext` and pre-wires node graph. Sound can be muted via `settings.soundEnabled`.
- TECHNOLOGY RECOMMENDATIONS: AR-006
- NOTES: File location: `./build/audio.js`.
- RELATED: BR-029 | UC-015
---

## PT-010 : cs_test_pipeline001.mjs — Playwright Test Script
- DESCRIPTION: Playwright test script serving `./build/` via `python3 -m http.server`. Covers: canvas renders on load, toolbar buttons present and activatable, emitter placement creates emitter, collector placement creates collector, barrier drawing renders a line, delete tool removes element, sliders change values, dark mode toggle, stats panel open/close. Saves screenshots per test step.
- TECHNOLOGY RECOMMENDATIONS: AR-009
- NOTES: File location: `./cs_test_pipeline001.mjs` (project root, not in build). Run with `DISPLAY=:0 node cs_test_pipeline001.mjs`.
- RELATED: BR-001, BR-002, BR-003, BR-005, BR-008, BR-010 | UC-001, UC-002, UC-003
---
