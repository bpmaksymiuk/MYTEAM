# ElectroFlow — Design Instructions

## DI-001 : Scaffold project structure and index.html shell
- SUMMARY: Create the `./build/` folder skeleton and the main HTML file. The page must have exactly one `<canvas id="sim-canvas">` filling the viewport, a `<aside id="panel">` sidebar, and a `<script type="module" src="main.js">` load. This DI enables BR-001 and BR-002.
- IMPLEMENTATION STEPS:
  1. Create `./build/index.html` with DOCTYPE, `<meta charset="UTF-8">`, `<meta name="viewport" content="width=device-width, initial-scale=1">`, `<link rel="stylesheet" href="style.css">`.
  2. Inside `<body>`, add `<canvas id="sim-canvas"></canvas>` and `<aside id="panel"></aside>`.
  3. Inside `#panel`, add the following sections in order:
     - **Tools section**: four `<button>` elements with `data-tool` attributes: `emitter`, `collector`, `barrier`, `delete`. Give each a text label: "− Emitter", "+ Collector", "Barrier", "Delete".
     - **Sliders section**: four labelled `<input type="range">` elements with `id` attributes: `spawn-rate` (min 1 max 20 default 5), `field-strength` (min 1 max 10 default 5), `friction` (min 0 max 10 default 2), `slow-mo` (min 0 max 100 default 100).
     - **Toggles section**: `<button>` toggles for field-vis, trails, force-vectors, dark-mode, sound, stats-panel.
     - **Challenge section**: `<button>` elements for `maze-escape`, `balance`, `containment`, and `sandbox` (return to free play).
     - **Save/Load section**: Three save slots: each row has a `<button>Save</button>` and `<button>Load</button>` labeled "Slot 1/2/3".
  4. At bottom of `<body>`: `<div id="stats-overlay" class="hidden">` containing `<span>` elements for particle count, collision rate, element count, energy.
  5. At bottom of `<body>`: `<div id="challenge-overlay" class="hidden">` for win/fail messages.
  6. Close with `<script type="module" src="main.js"></script>`.
- SKILLSET REQUIRED: HTML5, semantic markup
- NOTES: No inline styles. All ids and data-attributes used by JS must match exactly as specified above.
- RELATED: UC-001, UC-002, UC-003, UC-004, UC-005, UC-011, UC-012, UC-014, UC-015 | BR-001, BR-002 | AR-001, AR-004
---

## DI-002 : Implement style.css — layout and theming
- SUMMARY: Create the CSS file that positions canvas and panel, styles all UI controls, and implements dark/light theme via CSS custom properties. Enables BR-002, BR-028.
- IMPLEMENTATION STEPS:
  1. Create `./build/style.css`.
  2. Reset: `*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }`. Set `body { display: flex; height: 100vh; overflow: hidden; font-family: sans-serif; background: var(--bg); color: var(--fg); }`.
  3. Define CSS custom properties on `:root`: `--bg: #f0f0f0; --fg: #111; --panel-bg: #e0e0e0; --panel-fg: #111; --accent: #0055cc; --neon: rgba(0,0,0,0);`.
  4. Define `.dark-mode` overrides: `--bg: #0a0a0f; --fg: #e0e0ff; --panel-bg: #111128; --panel-fg: #e0e0ff; --accent: #00ccff; --neon: rgba(0,200,255,0.7)`.
  5. `#panel { width: 220px; min-width: 220px; background: var(--panel-bg); color: var(--panel-fg); overflow-y: auto; padding: 12px; display: flex; flex-direction: column; gap: 12px; }`.
  6. `#sim-canvas { flex: 1; display: block; cursor: crosshair; }`.
  7. Style `button`: padding 6px 10px, border-radius 4px, cursor pointer. Active tool button: add `[data-tool].active { background: var(--accent); color: #fff; }`.
  8. Style `input[type=range]`: full width, margin 4px 0.
  9. `#stats-overlay, #challenge-overlay { position: fixed; top: 12px; right: 230px; background: rgba(0,0,0,0.6); color: #fff; padding: 12px; border-radius: 8px; pointer-events: none; }`.
  10. `.hidden { display: none !important; }`.
- SKILLSET REQUIRED: CSS3, CSS custom properties, Flexbox
- NOTES: No media queries needed; layout is fixed sidebar + canvas fill.
- RELATED: UC-005, UC-015 | BR-002, BR-028 | AR-004, AR-007
---

## DI-003 : Implement state.js — centralised mutable state
- SUMMARY: Create `./build/state.js` as the single source of truth for all simulation data. All other modules import from here. Enables BR-003, BR-005, BR-008, BR-010.
- IMPLEMENTATION STEPS:
  1. Create `./build/state.js`.
  2. Export a single mutable object:
  ```js
  export const state = {
    particles: [],    // { id, x, y, vx, vy, trail: [] }
    emitters:  [],    // { id, x, y, rate, nextSpawn }
    collectors: [],   // { id, x, y, strength, absorbedCount, radius }
    barriers:  [],    // { id, x1, y1, x2, y2 }
    settings: {
      spawnRate: 5,       // particles/s
      fieldStrength: 5,   // multiplier 1-10
      friction: 2,        // damping 0-10
      slowMo: 1.0,        // time scale 0-1
      fieldVis: false,
      trails: false,
      forceVectors: false,
      darkMode: false,
      sound: false,
      statsOpen: false,
    },
    activeTool: 'emitter',
    challenge: null,   // null | 'maze-escape' | 'balance' | 'containment'
    nextId: 1,
  };
  export function nextId() { return state.nextId++; }
  ```
  3. No business logic in this file — pure data only.
- SKILLSET REQUIRED: JavaScript ES modules
- NOTES: Mutate state properties directly; no proxy or reactive framework.
- RELATED: UC-001, UC-002, UC-003, UC-004, UC-005 | BR-003, BR-005, BR-008, BR-010 | AR-003
---

## DI-004 : Implement physics.js — simulation engine
- SUMMARY: Core physics tick. Called every frame with delta-time. Handles Coulomb forces, barrier reflection, emitter spawning, collector absorption, friction, and time-scaling. Enables BR-004, BR-006, BR-007, BR-009, BR-011, BR-013, BR-014.
- IMPLEMENTATION STEPS:
  1. Create `./build/physics.js`. Import `{ state, nextId }` from `./state.js`.
  2. Export `function simulate(dt)`. Apply time scale: `const t = dt * state.settings.slowMo;`
  3. **Emitter spawn loop**: for each emitter, accumulate time; if `accum >= 1000 / spawnRate`, push a new particle at emitter position with small random velocity offset; reset accumulator.
  4. **Coulomb particle-particle repulsion**: For each particle pair (or grid bucket pairs if `particles.length > 200`): compute `dx, dy, dist`; if `dist < 1` clamp to 1; force magnitude = `k * fieldStrength / dist²` where `k = 5000`; add `force * dx/dist` and `force * dy/dist` to each particle's velocity (opposite directions).
  5. **Collector attraction**: For each particle × collector pair: compute `dx, dy, dist`; attraction force = `k_c * strength / dist²` where `k_c = 8000`; add velocity toward collector. If `dist < collector.radius + 4`, mark particle for absorption.
  6. **Remove absorbed particles**: filter `state.particles`; for each absorbed particle, increment `collector.absorbedCount`, grow `collector.radius` by 1 (max 60).
  7. **Barrier reflection**: For each particle × barrier segment: compute closest point on segment; if particle distance to closest point < 4, reflect velocity component perpendicular to barrier: `vPerp = dot(v, n) * n; v -= 2 * vPerp;` where `n` is barrier normal.
  8. **Friction damping**: each particle: `vx *= 1 - friction * 0.001 * t; vy *= 1 - friction * 0.001 * t`.
  9. **Integrate position**: `x += vx * t; y += vy * t`.
  10. **Trail update**: if `settings.trails`, prepend `[x, y]` to `particle.trail`; slice to last 20 entries.
  11. **Canvas boundary**: if particle exits canvas bounds, reverse the relevant velocity component and clamp position.
- SKILLSET REQUIRED: JavaScript ES6+, vector math, elastic collision reflection
- NOTES: Particle max cap: 500. If `particles.length >= 500`, skip spawn. Grid bucket size: 50px cells.
- RELATED: UC-001, UC-002, UC-003, UC-005, UC-012 | BR-004, BR-006, BR-007, BR-009, BR-011, BR-013, BR-014 | AR-002, AR-003
---

## DI-005 : Implement renderer.js — canvas drawing
- SUMMARY: Full canvas redraw each frame. Renders all simulation entities and optional overlays. Enables BR-015, BR-016, BR-026, BR-028, BR-030.
- IMPLEMENTATION STEPS:
  1. Create `./build/renderer.js`. Import `{ state }` from `./state.js`.
  2. Export `function render(ctx, W, H)`.
  3. **Clear**: `ctx.clearRect(0, 0, W, H); ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--bg').trim(); ctx.fillRect(0, 0, W, H);`.
  4. **Barriers**: `ctx.strokeStyle = '#888'; ctx.lineWidth = 3;` for each barrier draw a line from (x1,y1) to (x2,y2).
  5. **Field visualisation** (if `settings.fieldVis`): for each emitter and collector, draw a radial gradient from charge colour (semi-transparent) to transparent; radius 120px.
  6. **Trails** (if `settings.trails`): for each particle, draw a polyline through `particle.trail` with progressively lower alpha (1/N per step).
  7. **Particles**: for each particle compute speed = `sqrt(vx²+vy²)`; hue = `lerp(200, 0, clamp(speed/300, 0, 1))`; set `fillStyle = hsl(hue, 90%, 55%)`; if dark mode set `ctx.shadowBlur = 8; ctx.shadowColor`; draw filled circle radius 4.
  8. **Force vectors** (if `settings.forceVectors`): for each particle compute net force vector (reuse physics calc without applying); draw a line from particle center in force direction, length proportional to magnitude (max 30px).
  9. **Emitters**: draw a circle with "−" text label; colour based on theme.
  10. **Collectors**: draw a circle scaled by `radius`; "+" text label; glow proportional to `absorbedCount`.
  11. Reset `ctx.shadowBlur = 0` after particle draw to prevent bleeding onto UI elements.
- SKILLSET REQUIRED: Canvas 2D API, colour interpolation, radial gradients
- NOTES: Keep shadow effects isolated to particle draw section. Use `ctx.save()`/`ctx.restore()` around shadow block.
- RELATED: UC-006, UC-007, UC-013, UC-015 | BR-015, BR-016, BR-026, BR-028, BR-030 | AR-001, AR-007
---

## DI-006 : Implement main.js — entry point, event wiring, game loop
- SUMMARY: Bootstrap the app. Wire all DOM events to state mutations and tool handlers. Run the animation loop. Enables BR-003, BR-005, BR-008, BR-010, BR-012, BR-013, BR-014, BR-025.
- IMPLEMENTATION STEPS:
  1. Create `./build/main.js`. Imports: `simulate` from `./physics.js`; `render` from `./renderer.js`; `{ state }` from `./state.js`; `ChallengeManager` from `./challenges.js`; `StorageManager` from `./storage.js`; `AudioManager` from `./audio.js`.
  2. **Canvas setup**: `const canvas = document.getElementById('sim-canvas'); const ctx = canvas.getContext('2d');` Set canvas width/height to `window.innerWidth - 220` and `window.innerHeight` on load and on `resize`.
  3. **Tool buttons**: query all `[data-tool]` buttons; on click set `state.activeTool = btn.dataset.tool` and update `.active` class.
  4. **Canvas mouse events**:
     - `mousedown`: record `isDrawing = true; startX = e.offsetX; startY = e.offsetY;`
     - `mouseup`: if tool is `emitter` → push emitter to `state.emitters`; if `collector` → push collector; if `barrier` → push barrier from start to end; if `delete` → find and remove nearest element within 20px.
     - `mousemove`: if `isDrawing && tool === 'barrier'` → draw preview line (store in a `previewBarrier` variable, rendered in renderer).
  5. **Sliders**: for each slider, on `input` event update the corresponding `state.settings` property. `slow-mo` maps its 0–100 value to `slowMo = value / 100`.
  6. **Toggle buttons**: on click toggle the relevant `state.settings` boolean; toggle `.dark-mode` on `<body>` for dark mode; toggle `.hidden` on stats overlay.
  7. **Challenge buttons**: on click call `ChallengeManager.start(mode)`; set `state.challenge`.
  8. **Save/Load buttons**: call `StorageManager.save(slot, state)` / `StorageManager.load(slot)`.
  9. **Audio init**: on first `mousedown` on canvas, call `AudioManager.init()`.
  10. **Game loop**:
  ```js
  let last = 0;
  function loop(ts) {
    const dt = Math.min(ts - last, 50); // cap at 50ms to avoid huge jumps
    last = ts;
    simulate(dt);
    if (state.challenge) ChallengeManager.update(dt);
    render(ctx, canvas.width, canvas.height);
    updateStats();
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
  ```
  11. **`updateStats()`**: if `settings.statsOpen`, write particle count, element count to stats overlay spans. Track collisions/s with a rolling counter updated each second.
- SKILLSET REQUIRED: JavaScript ES modules, DOM events, requestAnimationFrame
- NOTES: `dt` cap at 50ms prevents simulation explosions when tab is backgrounded and resumes.
- RELATED: UC-001, UC-002, UC-003, UC-004, UC-005, UC-012, UC-014 | BR-003, BR-005, BR-008, BR-010, BR-012, BR-013, BR-025, BR-027 | AR-001, AR-003, AR-004
---

## DI-007 : Implement challenges.js — challenge mode manager
- SUMMARY: Three challenge modes with initialisation, per-frame update, and win/fail detection. Enables BR-017 through BR-022.
- IMPLEMENTATION STEPS:
  1. Create `./build/challenges.js`. Import `{ state }` from `./state.js`.
  2. Define `mazeBarriers`: an array of barrier segment objects forming a simple 5-corridor maze. Hardcode at least 10 barrier segments to form a solvable path from left side to right side of canvas.
  3. Export `const ChallengeManager = { score: 0, startTime: 0, mode: null, ... }`.
  4. **`start(mode)`**:
     - Clear `state.particles`, `state.emitters`, `state.collectors`, `state.barriers`.
     - `'maze-escape'`: load `mazeBarriers` into `state.barriers`; place one emitter at maze entrance (left edge); place one collector at maze exit (right edge) with `id: 'exit'`.
     - `'balance'`: place two collectors at `(W*0.25, H*0.5)` and `(W*0.75, H*0.5)`; spawn 20 particles at canvas centre.
     - `'containment'`: place one emitter at canvas centre; set `spawnRate = 2` initially; store `startTime = Date.now()`.
     - Start score timer: `this.startTime = Date.now()`.
  5. **`update(dt)`**:
     - `'containment'`: increase emitter spawn rate every 5 s: `emitter.rate = 2 + Math.floor((elapsed/5000))`. Check if any particle is out of bounds → call `end('fail')`.
     - `'balance'`: check if `state.particles.length === 0` → `end('fail')`.
     - `'maze-escape'`: check if `state.particles.length === 0` and exit collector `absorbedCount > 0` → `end('win')`.
  6. **`end(result)`**: compute `score = (Date.now() - startTime) / 1000`; show `#challenge-overlay` with message; set `state.challenge = null`.
- SKILLSET REQUIRED: JavaScript ES6+, game state management
- NOTES: Maze barrier coordinates should be relative fractions of canvas size (multiply by W/H at load time) so they work at any resolution.
- RELATED: UC-008, UC-009, UC-010 | BR-017, BR-018, BR-019, BR-020, BR-021, BR-022 | AR-008
---

## DI-008 : Implement storage.js — save/load manager
- SUMMARY: Persist and restore simulation configurations via localStorage. Enables BR-023, BR-024.
- IMPLEMENTATION STEPS:
  1. Create `./build/storage.js`.
  2. Export `function save(slot, state)`: build a serialisable snapshot:
  ```js
  const snap = {
    emitters: state.emitters.map(e => ({ x: e.x, y: e.y, rate: e.rate })),
    collectors: state.collectors.map(c => ({ x: c.x, y: c.y, strength: c.strength })),
    barriers: state.barriers.map(b => ({ x1: b.x1, y1: b.y1, x2: b.x2, y2: b.y2 })),
    settings: { ...state.settings },
  };
  localStorage.setItem(`ef_slot_${slot}`, JSON.stringify(snap));
  ```
  3. Export `function load(slot)`: read key; if absent, alert user and return. Otherwise, parse JSON; clear `state.particles`, `state.emitters`, `state.collectors`, `state.barriers`; restore each array from snapshot using `nextId()` for fresh IDs; restore `state.settings`.
  4. Export `function listSlots()`: returns `[1,2,3].map(s => !!localStorage.getItem(\`ef_slot_\${s}\`))`.
  5. After load, update all slider DOM elements to reflect restored settings values.
- SKILLSET REQUIRED: JavaScript, localStorage API, JSON serialisation
- NOTES: No try/catch needed beyond a null check on getItem result. Storage quota is not a concern for this data volume.
- RELATED: UC-011 | BR-023, BR-024 | AR-005
---

## DI-009 : Implement audio.js — Web Audio sound effects
- SUMMARY: Synthesise three distinct tones for particle events using the Web Audio API. Enables BR-029.
- IMPLEMENTATION STEPS:
  1. Create `./build/audio.js`.
  2. Export `const AudioManager = { ctx: null, ready: false }`.
  3. **`init()`**: `this.ctx = new AudioContext(); this.ready = true;`.
  4. **`play(event)`**: if `!this.ready || !state.settings.sound` return.
     - `'spawn'`: 880 Hz sine, duration 0.05 s, gain 0.15.
     - `'absorb'`: 440 Hz sine, brief frequency sweep down to 220 Hz, duration 0.12 s, gain 0.4.
     - `'wallHit'`: 1200 Hz square wave, duration 0.04 s, gain 0.1.
     - For each: create `OscillatorNode`, `GainNode`; `gain.gain.setValueAtTime(gainVal, ctx.currentTime)`; `gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)`; connect osc → gain → ctx.destination; `osc.start(); osc.stop(ctx.currentTime + duration)`.
  5. Call `AudioManager.play('spawn')` in physics.js spawn logic; `play('absorb')` on absorption; `play('wallHit')` on barrier reflection.
- SKILLSET REQUIRED: Web Audio API, OscillatorNode, GainNode
- NOTES: All `play()` calls are fire-and-forget; no cleanup needed (nodes auto-GC after `stop()`).
- RELATED: UC-015 | BR-029 | AR-006
---

## DI-010 : Write cs_test_pipeline001.mjs — Playwright test script
- SUMMARY: Automated browser tests verifying core UCs against the built app. Run with `DISPLAY=:0 node cs_test_pipeline001.mjs`. Enables test coverage for BR-001, BR-002, BR-003, BR-005, BR-008, BR-010, BR-028.
- IMPLEMENTATION STEPS:
  1. Create `./cs_test_pipeline001.mjs` (in project root, NOT in ./build).
  2. Header:
  ```js
  import { chromium } from '/tmp/node_modules/playwright/index.mjs';
  import { execSync, spawn } from 'child_process';
  import path from 'path';
  import fs from 'fs';
  ```
  3. Start HTTP server: `const server = spawn('python3', ['-m', 'http.server', '7410', '--directory', './build']);` — add 1 s startup delay.
  4. Define `results = []` and helper `async function t(id, desc, fn)` that runs `fn`, catches errors, records pass/fail, takes a screenshot to `testresults/T-PIPELINE-CS-001/<id>.png`.
  5. Open browser: `const browser = await chromium.launch({ headless: false });`
  6. Tests (each wrapped in `t(...)`):
     - **T01**: Navigate to `http://localhost:7410`; assert `canvas#sim-canvas` is visible.
     - **T02**: Assert all four tool buttons `[data-tool]` are visible.
     - **T03**: Click "− Emitter" button; assert it has `.active` class; click canvas at (200, 200); wait 600 ms; take screenshot — emitter icon should be visible.
     - **T04**: Click "+ Collector" button; click canvas at (400, 300); wait 600 ms; screenshot.
     - **T05**: Click "Barrier" button; mouse down at (100, 100); mouse move to (300, 100); mouse up; screenshot — barrier line should be visible.
     - **T06**: Click "Delete" button; click at emitter position (200, 200); wait 200 ms; screenshot — emitter should be gone.
     - **T07**: Move `#spawn-rate` slider to max; wait 1 s; assert particle count (evaluate `window._state?.particles?.length`) is greater than 0. (Expose state on window in main.js for testability: `window._state = state;`).
     - **T08**: Click "Dark Mode" toggle; assert `document.body.classList.contains('dark-mode')`.
     - **T09**: Click "Stats" toggle; assert `#stats-overlay` is visible.
     - **T10**: Click "Maze Escape" challenge button; wait 500 ms; screenshot — maze barriers should be visible.
  7. Write `testresults/T-PIPELINE-CS-001/results.json` with pass/fail per test.
  8. Kill server; close browser; print summary.
- SKILLSET REQUIRED: Playwright, Node.js ESM, child_process
- NOTES: Expose `window._state = state` at bottom of `main.js` to allow test assertions on simulation state without inspecting canvas pixels. Port 7410 used to avoid conflicts.
- RELATED: UC-001, UC-002, UC-003, UC-004, UC-008, UC-015 | BR-001, BR-002, BR-003, BR-005, BR-008, BR-010, BR-028 | AR-009
---
