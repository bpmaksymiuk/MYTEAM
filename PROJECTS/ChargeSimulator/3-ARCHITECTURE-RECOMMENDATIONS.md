# ElectroFlow — Architecture Recommendations

## AR-001 : Use a single HTML5 Canvas 2D context for all rendering
- RATIONALE: The simulation requires per-frame full canvas redraws with thousands of small particle objects. Canvas 2D provides direct pixel-level control, avoids DOM-per-particle overhead, and is sufficient for 2D physics rendering without a heavy dependency. WebGL would be over-engineered for this scope.
- NOTES: Use `requestAnimationFrame` for the game loop; clear and redraw the full canvas each frame.
- RELATED: BR-001 | UC-001, UC-002, UC-003
---

## AR-002 : Implement Coulomb force physics in a plain JavaScript simulation engine (no physics library)
- RATIONALE: The physics model is simple N-body Coulomb electrostatics (inverse-square attraction/repulsion) plus elastic reflection. A hand-rolled engine avoids the weight (and constraints) of Box2D or Matter.js, keeps full controllability for sliders, and can be written in ~200 lines. Performance is sufficient for up to ~500 particles at 60 fps.
- NOTES: Cap particle count to avoid O(N²) perf degradation; use spatial partitioning (grid buckets) if particle count exceeds 200.
- RELATED: BR-004, BR-006, BR-009, BR-011, BR-013, BR-014 | UC-001, UC-002, UC-003
---

## AR-003 : Represent simulation entities as plain JavaScript objects in a flat arrays-of-records store
- RATIONALE: No framework overhead. Entities (particles, emitters, collectors, barriers) are plain `{}` objects held in module-level arrays. Update and render loops iterate these arrays directly. This pattern is idiomatic, debuggable, and performant for a canvas game.
- NOTES: State slices: `particles[]`, `emitters[]`, `collectors[]`, `barriers[]`, `settings{}`.
- RELATED: BR-003, BR-005, BR-008, BR-010 | UC-001, UC-002, UC-003, UC-004
---

## AR-004 : Use vanilla HTML/CSS for the UI panel (toolbox, sliders, stats); no framework
- RATIONALE: The UI is a simple sidebar with buttons and range inputs. No virtual DOM, component tree, or bundler needed. Keeps the deliverable as a zero-dependency single-page app that can be served with `python3 -m http.server`.
- NOTES: Use CSS custom properties for theming (dark/light mode toggle).
- RELATED: BR-002, BR-012, BR-013, BR-014, BR-025, BR-027, BR-028 | UC-005, UC-012, UC-014, UC-015
---

## AR-005 : Use JSON serialisation into localStorage for save/load
- RATIONALE: No backend required. `JSON.stringify` / `JSON.parse` on the state arrays is sufficient. `localStorage` supports at least 5 MB — more than enough for 3 save slots of element positions and settings.
- NOTES: Keys: `ef_slot_1`, `ef_slot_2`, `ef_slot_3`.
- RELATED: BR-023, BR-024 | UC-011
---

## AR-006 : Use Web Audio API for sound effects (generated tones, no audio file dependencies)
- RATIONALE: Avoiding audio file assets removes a loading dependency and bundle complexity. Short synthesised beeps/pings via `OscillatorNode` and `GainNode` cover the required sound cues. Web Audio API is universally supported. Must be unlocked after user gesture (click).
- NOTES: Create `AudioContext` lazily on first user interaction to comply with browser autoplay policy.
- RELATED: BR-029 | UC-015
---

## AR-007 : Use CSS variables and a body class toggle for dark/light theming
- RATIONALE: A single `.dark-mode` class on `<body>` with CSS variable overrides is the simplest, most performant theme implementation. Zero JS computation; instant toggle.
- NOTES: Neon glow on canvas is rendered via `ctx.shadowBlur` / `ctx.shadowColor` in the draw loop, not via CSS.
- RELATED: BR-028 | UC-015
---

## AR-008 : Implement challenge modes as discrete state objects loaded by a ChallengeManager module
- RATIONALE: Each challenge (Maze Escape, Balance, Containment) has distinct initialisation, win/fail conditions, and scoring logic. Isolating each into a named state object loaded by a central manager avoids mode-specific branches scattered across the main loop, and makes adding future modes trivial.
- NOTES: ChallengeManager exposes `start(mode)`, `update(dt)`, `checkEnd()` interface.
- RELATED: BR-017, BR-018, BR-019, BR-020, BR-021, BR-022 | UC-008, UC-009, UC-010
---

## AR-009 : Use Playwright 1.59.1 at /tmp/node_modules/playwright/index.mjs for automated browser tests
- RATIONALE: Consistent with the wider test pipeline. Tests run headful (`headless: false`, `DISPLAY=:0`) against the build served by `python3 -m http.server`.
- NOTES: Test script: `cs_test_pipeline001.mjs`. Screenshots to `testresults/T-PIPELINE-CS-001/`.
- RELATED: BR-001, BR-002, BR-003 | UC-001
---
