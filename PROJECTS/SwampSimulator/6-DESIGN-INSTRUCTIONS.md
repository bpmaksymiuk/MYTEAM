# SwampSimulator — Design Instructions

## DI-001 : Scaffold project structure and index.html shell
- SUMMARY: Create the `./build/` skeleton and the main HTML page. The page hosts the top nav, a screen container with one section per major view, the docked species inspector, the overlay toggle bar, and the time controls. All ids/classes named here are referenced by JS modules.
- IMPLEMENTATION STEPS:
  1. Create `./build/index.html` with `<!DOCTYPE html>`, viewport meta, `<link rel="stylesheet" href="style.css">`, and at end of body: `<script src="vendor/chart.umd.js"></script>` then `<script type="module" src="main.js"></script>`.
  2. Top nav `<nav id="top-nav">` with buttons: `data-screen="canvas"`, `data-screen="foodweb"`, `data-screen="dashboard"`, `data-screen="intervention"`, `data-screen="scenarios"`, `data-screen="saveload"`. Time controls at far right: `<button id="btn-pause">⏸</button> <button id="btn-play">▶</button> <button data-speed="1">×1</button> <button data-speed="5">×5</button> <button data-speed="30">×30</button> <button id="btn-skip-season">⏭ Season</button> <span id="time-readout">Day 0 · Spring</span>`.
  3. Main `<main id="screens">` containing one `<section id="screen-canvas" class="screen active">` etc per screen.
  4. In screen-canvas: `<canvas id="sim-canvas"></canvas>`, `<aside id="overlay-bar">` with toggle buttons (`data-overlay="foodweb|nutrient|oxygen|density"`), `<aside id="inspector" class="hidden">` with header and body divs.
  5. In screen-foodweb: `<canvas id="foodweb-canvas"></canvas>` plus a legend div.
  6. In screen-dashboard: two canvas elements `#chart-population` and `#chart-biomass`, plus `<aside id="alert-panel">`.
  7. In screen-intervention: `<section id="species-controls">` and `<section id="event-controls">` and `<section id="active-events">`. Include `<button id="btn-restore">Restore Baseline</button>`.
  8. In screen-scenarios: `<section id="scenario-picker">` (cards) and `<section id="scenario-active" class="hidden">` (checklist + mini-chart canvas).
  9. In screen-saveload: three `<article class="save-slot" data-slot="1|2|3">` blocks.
- SKILLSET REQUIRED: HTML5, semantic markup
- NOTES: No inline styles. All `id` and `data-*` attributes used by JS must match exactly as specified.
- RELATED: BR-001, BR-007, BR-072, BR-079, BR-085 | AR-001, AR-005 | UC-001, UC-002, UC-012
---

## DI-002 : Implement style.css — layout, palette, environmental classes
- SUMMARY: Single stylesheet covering layout grid, palette, panel styling, and body-class-driven environmental tints.
- IMPLEMENTATION STEPS:
  1. Create `./build/style.css`. Define CSS variables on `:root`: `--cypress: #3a5a32; --water: #4a6b6b; --mud: #6b5a3a; --bg: #1a2620; --ink: #cde3c4; --accent: #ffd34a; --warn: #cc8833; --danger: #cc3344; --ok: #88cc66;`.
  2. Layout: `body { display: grid; grid-template-rows: 48px 1fr; }` with `nav#top-nav` at row 1 and `main#screens` at row 2.
  3. Hide all `.screen` by default, show only `.screen.active`.
  4. Style canvas to fill `screen-canvas` minus a left rail (overlay-bar 130px) and right rail (inspector 240px when not hidden).
  5. Style alert panel rows with semantic classes: `.alert-extinction` (red bg+border), `.alert-warn` (amber), `.alert-event` (blue).
  6. Define environmental body classes: `body.event-drought` adds an `--scene-tint: rgba(180,140,60,0.15)`; `.event-flood` blue tint; `.event-pollution` dark green tint; `.event-fire` orange tint. Renderer reads `getComputedStyle(document.body).getPropertyValue('--scene-tint')` and overlays the canvas with that colour.
  7. Define season classes: `body.season-winter` adjusts `--cypress` to a duller variant.
- SKILLSET REQUIRED: CSS, CSS variables, grid layout
- RELATED: BR-034, BR-038, BR-075 | AR-005, AR-010 | UC-006, UC-012
---

## DI-003 : Implement state.js — central mutable state
- SUMMARY: The single source of truth for simulation data. Pure data, no logic.
- IMPLEMENTATION STEPS:
  1. Create `./build/state.js`.
  2. Export:
     ```js
     export const state = {
       tick: 0,
       agents: {},               // keyed by speciesId -> Array<Agent>
       environment: {
         waterLevel: 1.0,        // multiplier on baseline
         nutrient: 1.0,
         oxygen: 1.0,
         temperature: 22,        // °C
         season: 'spring',       // spring | summer | autumn | winter
         dayOfYear: 0,
       },
       events: { active: {}, log: [] },   // active: { drought:true, ... }
       scenario: { id: null, checklist: [], startTick: 0, summary: null },
       settings: {
         speed: 1,
         seasonLengthSec: 90,
         gridCellSize: 32,
         foodWebRadius: 60,
         overlays: { foodweb: false, nutrient: false, oxygen: false, density: false },
       },
       gatorHoles: [],           // [{x, y, r}]
       beaverDam: { progress: 0, complete: false },
       nextId: 1,
     };
     export function nextId() { return state.nextId++; }
     ```
  3. No business logic.
- SKILLSET REQUIRED: JS ES modules
- RELATED: BR-027, BR-086 | AR-004 | UC-002, UC-005, UC-014
---

## DI-004 : Implement species.js — species definitions
- SUMMARY: Define all 25 species as a static data table.
- IMPLEMENTATION STEPS:
  1. Create `./build/species.js`.
  2. Export `SPECIES`: array of records, one per organism in goal.md tables. Each record:
     ```js
     { id: 'frog', commonName: 'Bullfrog', latinName: 'Lithobates catesbeianus',
       trophic: 'secondary',  // producer|primary|secondary|apex|decomposer
       baselineCount: 30, color: '#cc6633', radius: 4,
       speed: 22, sensorRadius: 50, energyPerMeal: 30, reproThreshold: 80, reproRate: 0.4,
       lifespan: 600, sensitivities: { pollution: 0.8, drought: 0.3, cold: 0.5 },
       eats: ['mosquito', 'dragonfly', 'snail'], eatenBy: ['heron', 'snake', 'alligator'],
       role: 'Eats mosquitoes and dragonflies; bioindicator of water quality.',
       isPlant: false, isMigratory: false }
     ```
  3. Include all species from goal.md ecosystem-layers tables: producers (algae, duckweed, cattails, lilies, cypress, sawgrass — set isPlant=true, speed=0, eats=[]), primaries, secondaries, apex, decomposers (vulture, firefly, beaver), and adult mosquito and bat.
  4. Provide helper `export function getSpecies(id)`.
- SKILLSET REQUIRED: JS, ecological domain accuracy
- NOTES: Plants have no agents per se — represented as patches; see DI-005.
- RELATED: BR-002, BR-013, BR-014, BR-035, BR-052 | AR-002 | UC-001, UC-003, UC-006
---

## DI-005 : Implement sim.js — agent simulation engine
- SUMMARY: Per-tick agent update. Movement, sensing, eating, reproduction, death, environmental modifiers.
- IMPLEMENTATION STEPS:
  1. Create `./build/sim.js`. Imports: state, nextId from state.js; SPECIES, getSpecies from species.js; buildGrid, nearby from grid.js.
  2. Export `tick(dt)`:
     - Increment `state.tick`.
     - Build spatial grid over all non-plant agents with `state.settings.gridCellSize`.
     - For each animal species, iterate its agents in reverse order (so we can splice on death):
       - Apply environmental damage: `if (state.events.active.pollution) energy -= sensitivities.pollution * dt * 5`.
       - Apply cold-blooded speed factor: `let speedFactor = 1; if (species.sensitivities.cold > 0.4 && state.environment.temperature < 12) speedFactor = 0.4;`
       - Sense: prey = nearby agents whose speciesId ∈ `species.eats`; predator = nearby whose speciesId ∈ `species.eatenBy`.
       - If predator nearby: vector away. Else if prey nearby: vector toward closest. Else: random walk.
       - Move by `vx,vy * speedFactor * dt`. Clamp to canvas bounds (or aquatic bounds for aquatic species).
       - On overlap with prey agent: eat — remove prey agent, add `species.energyPerMeal` to energy, push to `state.events.predationLog` `{predator: id, prey: prey.id, tick: state.tick}`.
       - Reproduction: if `energy > reproThreshold` and `Math.random() < reproRate * dt`: spawn child agent with half energy; subtract half from parent.
       - Death: if `energy <= 0` or `age > lifespan`: splice from array. If decomposers exist, spawn nutrient pulse (increment `state.environment.nutrient` by tiny amount).
  3. Plants: maintain a patch grid (offscreen) — each tick, plant patches grow if `nutrient > 0.5 && oxygen > 0.3`, retract if not. Herbivore agents eating plants reduce local patch density.
  4. Cap total agents per species at `5 * baselineCount` to prevent runaway simulation.
- SKILLSET REQUIRED: JS, agent simulations, spatial reasoning
- NOTES: Pure function — operates on state only.
- RELATED: BR-003, BR-004, BR-029, BR-035, BR-036, BR-049, BR-067, BR-068 | AR-002, AR-003 | UC-001, UC-005, UC-006, UC-008, UC-011
---

## DI-006 : Implement grid.js — spatial hash
- SUMMARY: Flat 2D bucket grid for O(1) average neighbour lookup.
- IMPLEMENTATION STEPS:
  1. Create `./build/grid.js`.
  2. Export `buildGrid(agents, cellSize, w, h)`: returns `{ cellSize, cols, rows, buckets: Map<key, Agent[]> }`. For each agent, compute `key = \`${col},${row}\`` and push.
  3. Export `nearby(grid, x, y, radius)`: compute the range of cells the radius covers, iterate those buckets, return concatenated agent list (caller filters by precise distance).
- SKILLSET REQUIRED: JS, spatial hashing
- RELATED: BR-006, BR-029, BR-083 | AR-003 | UC-001, UC-005, UC-013
---

## DI-007 : Implement environment.js — environmental events and seasons
- SUMMARY: Environmental tick logic and event triggers.
- IMPLEMENTATION STEPS:
  1. Create `./build/environment.js`. Imports state.
  2. Export `triggerEvent(type)`: sets `state.events.active[type] = true`, pushes `{type, kind:'start', tick}` to log, sets `body.classList.add('event-' + type)`.
  3. Export `clearEvent(type)`: opposite.
  4. Export `tickEnvironment(dt)`:
     - If `events.active.drought`: decrease `waterLevel` by `0.001 * dt` until floor (0.4); decrease oxygen by 0.001*dt.
     - If `events.active.flood`: increase waterLevel by 0.002*dt up to 1.6.
     - If `events.active.pollution`: lower oxygen by 0.0015*dt; per-agent damage applied in sim.js.
     - If `events.active.fire`: kill 5% of shoreline plant patches per tick until cleared after 30s.
     - If `events.active.runoff`: bump nutrient toward 3.0 over 10s (then auto-clears).
     - If `events.active.coldsnap`: drop temperature toward 4°C; auto-clears after 60s.
     - Advance `dayOfYear` by `dt / state.settings.seasonLengthSec`. When crossing 90/180/270/360 boundaries, set season and dispatch migratory species spawn/despawn.
  5. Export `migratorySync(state)`: when season is autumn → remove all migratory agents (Duck, Osprey); when spring → spawn baseline counts for migratory species.
- SKILLSET REQUIRED: JS, simple physical modelling
- RELATED: BR-033, BR-034, BR-038, BR-039, BR-053, BR-054, BR-066, BR-068, BR-071, BR-074, BR-075, BR-076 | AR-002, AR-010 | UC-006, UC-009, UC-011, UC-012
---

## DI-008 : Implement gatorhole.js — alligator water-retention engine
- SUMMARY: Persistent water disks at each alligator position during drought.
- IMPLEMENTATION STEPS:
  1. Create `./build/gatorhole.js`.
  2. Export `updateGatorHoles(state)`:
     - If alligator count is 0: clear `state.gatorHoles` and return.
     - For each alligator agent: ensure a hole entry exists at `{x: agent.x, y: agent.y, r: 30}`. Update `x,y` if alligator moved.
     - Holes do not vanish until `state.events.active.drought` is false AND waterLevel > 0.9.
- SKILLSET REQUIRED: JS
- RELATED: BR-046, BR-069, BR-070 | AR-002 | UC-007, UC-011
---

## DI-009 : Implement beaverdam.js — beaver engineering
- SUMMARY: Build/remove dam progression and water-level effect.
- IMPLEMENTATION STEPS:
  1. Create `./build/beaverdam.js`.
  2. Export `progressDam(state, dt)`: when scenario `beaver-dam` active or beavers cluster near outflow region, increment `state.beaverDam.progress` by `0.01 * beaverCount * dt`. On reaching 1.0, set `complete=true` and bump baseline `waterLevel` to 1.4.
  3. Export `removeDam(state)`: reset progress, complete=false, waterLevel back to 1.0.
- SKILLSET REQUIRED: JS
- RELATED: BR-060, BR-061, BR-065 | AR-002 | UC-010
---

## DI-010 : Implement renderer.js — canvas drawing
- SUMMARY: Draw background, agents, overlays, environmental tints, gator holes.
- IMPLEMENTATION STEPS:
  1. Create `./build/renderer.js`. Imports state, SPECIES, nearby/grid.
  2. On init, create offscreen canvas for static background; draw water polygon, mudbanks, cypress sprites once (re-draw on season change).
  3. Export `render(ctx, w, h)`:
     - Blit offscreen background.
     - Draw plant patches (per patch: small green disk, opacity = patch density).
     - For each animal species, for each agent: draw a circle of `species.radius` in `species.color`.
     - Draw gator hole rings: `state.gatorHoles.forEach(h => arc with --water fill)`.
     - For each enabled overlay:
       - foodweb: iterate predator agents; for each, find nearest prey within `foodWebRadius`; draw thin arrow.
       - nutrient: paint a translucent green gradient mask scaled to `state.environment.nutrient`.
       - oxygen: paint a blue→red heatmap; intensity = 1 - oxygen.
       - density: bin agents into a grid; paint each cell with opacity proportional to count.
     - Apply environmental scene tint as a fillRect over the whole canvas (read CSS variable).
- SKILLSET REQUIRED: Canvas 2D, JS
- RELATED: BR-001, BR-005, BR-006, BR-034, BR-038, BR-058, BR-075, BR-079, BR-081, BR-082, BR-083 | AR-001, AR-010 | UC-001, UC-006, UC-009, UC-012, UC-013
---

## DI-011 : Implement foodweb.js — food web graph
- SUMMARY: Force-laid graph drawn on a dedicated canvas; live node radii and edge weights.
- IMPLEMENTATION STEPS:
  1. Create `./build/foodweb.js`. Imports state, SPECIES.
  2. On init, run a small force-relaxation pass (50 iterations) to position nodes by trophic level (y) and minimised edge crossings (x). Save positions in module-level `nodes[]`.
  3. Export `renderGraph(ctx, w, h)`:
     - Compute current population per species from state; node radius = `8 + 0.4 * sqrt(pop)`.
     - For each edge (predator->prey relationship), compute thickness from `predationLog` count over last N ticks.
     - If a node is selected (highlightChain), dim non-chain nodes/edges to opacity 0.2.
     - Apply red border to nodes whose pop < 10% of baseline.
  4. Export `nodeAt(x, y)`: hit-test against node positions.
  5. Export `edgeAt(x, y)`: hit-test edges (point-to-segment distance).
  6. Wire mouse events in main.js to call these and update `state.foodweb.selected`/`state.foodweb.tooltip`.
- SKILLSET REQUIRED: Canvas 2D, simple force layout
- RELATED: BR-012, BR-013, BR-014, BR-015, BR-016, BR-017, BR-018, BR-019 | AR-007 | UC-002, UC-003
---

## DI-012 : Implement dashboard.js — population dashboard
- SUMMARY: Two Chart.js charts plus alert panel, all live-updating.
- IMPLEMENTATION STEPS:
  1. Create `./build/dashboard.js`. Imports state, SPECIES, Chart from global.
  2. On `mountDashboard()`: instantiate `lineChart` (datasets = one per species, colours from species.color, x-axis time in days), and `biomassChart` (stacked bar, 5 bars: producer/primary/secondary/apex/decomposer).
  3. Maintain a rolling buffer per species: append current population every simulated minute.
  4. Export `updateDashboard(state)`: called by main loop ~ once per second:
     - Append new data points; trim buffer if > 5000 points.
     - Update biomass chart datasets from current populations × species mass weights (use `radius²` as proxy).
     - Render alert panel from `state.events.log` (last 30 entries), classify entries by `kind` (extinction/warn/event), apply CSS class.
  5. Wire legend click: when a species is clicked in legend, dim other lines (set borderColor opacity), display min/max/current overlay.
- SKILLSET REQUIRED: Chart.js, DOM
- RELATED: BR-020 through BR-026, BR-037 | AR-006 | UC-004, UC-005, UC-006
---

## DI-013 : Implement inspector.js — species inspector
- SUMMARY: Right-rail panel; opened by canvas click or food-web click.
- IMPLEMENTATION STEPS:
  1. Create `./build/inspector.js`. Imports SPECIES, state.
  2. Export `openInspector(speciesId)`: read species record + live population; render header (name, trophic, pop), role text, EATS list (linked species names), EATEN BY list (linked). Show panel.
  3. Wire link clicks to call `openInspector` recursively.
  4. Export `closeInspector()`: hide panel.
  5. Export `agentAt(x, y, state)`: scan all agents, return nearest within click radius (8 px). Used by main.js canvas click handler.
- SKILLSET REQUIRED: DOM, JS
- RELATED: BR-007, BR-008, BR-009, BR-010, BR-011, BR-012 | AR-005 | UC-002
---

## DI-014 : Implement intervention.js — intervention panel
- SUMMARY: Species controls + environmental event triggers.
- IMPLEMENTATION STEPS:
  1. Create `./build/intervention.js`. Imports SPECIES, state, sim, environment.
  2. Export `mountIntervention()`: render one row per species with name, live population span, +1, +10, Remove all buttons. Render six event-trigger cards.
  3. Wire +1: spawn one agent of species at random valid position. +10: spawn 10. Remove all: clear `state.agents[id]`, push removal log entry.
  4. Wire each event trigger: call `triggerEvent(type)`. Show "Active" sub-panel listing currently active events with auto-clear countdown.
  5. Wire Restore Baseline: clear all agents, then spawn `baselineCount` of each species, reset environment to defaults, clear events log.
  6. Export `updateIntervention(state)`: called per second to refresh population spans and active-event countdowns.
- SKILLSET REQUIRED: DOM, JS
- RELATED: BR-027 through BR-033 | AR-005 | UC-005, UC-006
---

## DI-015 : Implement scenarios.js — scenario manager
- SUMMARY: Five guided scenarios with setup, checklist tracking, and summary.
- IMPLEMENTATION STEPS:
  1. Create `./build/scenarios.js`.
  2. Define `SCENARIOS` array, one entry per scenario:
     ```js
     {
       id: 'alligator-removed', title: 'Remove the Alligator', icon: '🐊',
       intro: 'Watch the heron and fish populations shift after the apex predator is gone.',
       setup(state) { state.agents.alligator = []; },
       checklist: [
         { label: 'Snake population +20%', test: s => snakePop(s) >= 1.2 * baseline('snake') },
         { label: 'Bass population +35%', test: s => bassPop(s) >= 1.35 * baseline('bass') },
         { label: 'Heron population +18%', test: s => heronPop(s) >= 1.18 * baseline('heron') },
         { label: 'Tadpole population −25%', test: s => tadpolePop(s) <= 0.75 * baseline('tadpole') },
       ],
       summary(state, history) { return `Alligator removed → Snake ${pct(history.snake)} → Bass ${pct(history.bass)} → ...`; }
     }
     ```
  3. Mirror this for `mosquito-explosion`, `algae-bloom`, `beaver-dam`, `drought-year`. Each setup function configures state per BR-040, BR-047, BR-053, BR-060, BR-066.
  4. Export `startScenario(id)`: store `scenario.id`, run `setup`, reset `scenario.checklist = checklist.map(c => ({...c, done: false}))`, record `scenario.startTick`.
  5. Export `tickScenario(state)`: called every tick. For each unchecked item, run `test(state)`; if true, set done=true and record. When all done, call `summary` and store on `scenario.summary`.
  6. Export `endScenario()`: clear scenario state.
  7. Export `mountScenarioPicker()`: render five cards from SCENARIOS metadata, wire Start buttons.
- SKILLSET REQUIRED: JS, simple state machines
- RELATED: BR-040 through BR-071 | AR-008 | UC-007, UC-008, UC-009, UC-010, UC-011
---

## DI-016 : Implement storage.js — save/load manager
- SUMMARY: localStorage-backed save slots with quota guard.
- IMPLEMENTATION STEPS:
  1. Create `./build/storage.js`.
  2. Export `saveSlot(n)`: `const s = JSON.stringify(state); if (s.length > 5_000_000) throw new Error('Too large'); if (s.length > 4_000_000) console.warn('Approaching quota'); localStorage.setItem('swamp:save:' + n, s); localStorage.setItem('swamp:meta:' + n, JSON.stringify({timestamp: Date.now(), summary: makeSummary(state)}));`
  3. Export `loadSlot(n)`: read, JSON.parse, replace each key on the live state object (do not reassign `state` reference). Return true/false.
  4. Export `listSlots()`: return three records `{n, timestamp, summary, exists}`.
  5. Export `deleteSlot(n)`: removeItem both keys.
  6. Helper `makeSummary(state)`: compose `Day ${day} · ${activeEventName || 'stable'} · ${atRiskCount} species at risk`.
- SKILLSET REQUIRED: localStorage, JSON
- RELATED: BR-085 through BR-091 | AR-009 | UC-014
---

## DI-017 : Implement main.js — entry point and main loop
- SUMMARY: Bootstrap. Wires DOM, runs the main loop, dispatches to all modules.
- IMPLEMENTATION STEPS:
  1. Create `./build/main.js`. Imports from all modules.
  2. Get canvas, set width/height to fit canvas-screen area; handle resize.
  3. Spawn baseline populations for every species per `baselineCount`.
  4. Main loop using `requestAnimationFrame`:
     ```js
     let last = performance.now();
     function loop(t) {
       const dtFrame = (t - last) / 1000; last = t;
       const dt = dtFrame * state.settings.speed;
       if (!state.paused) {
         tickEnvironment(dt);
         tick(dt);
         updateGatorHoles(state);
         progressDam(state, dt);
         if (state.scenario.id) tickScenario(state);
       }
       render(ctx, w, h);
       if (state.settings.overlays.foodweb) /* drawn inside render */;
       if (currentScreen === 'foodweb') renderGraph(...);
       updateTimeReadout();
       requestAnimationFrame(loop);
     }
     requestAnimationFrame(loop);
     ```
  5. Wire top-nav buttons to switch active screen (.screen.active class).
  6. Wire time controls: pause/play sets `state.paused`; speed buttons set `state.settings.speed`; skip-season jumps `dayOfYear` to next 90-multiple and dispatches season change.
  7. Wire canvas click → `agentAt()` → `openInspector()`. Wire foodweb canvas click → `nodeAt()` → `openInspector()`.
  8. Wire overlay toggle bar: each click flips the corresponding `state.settings.overlays.X`.
  9. Mount intervention panel, mount dashboard, mount scenario picker, mount save-load slots on DOMContentLoaded.
  10. Save/Load tile click handlers wired to storage module.
  11. Expose `window._state = state` for tests.
- SKILLSET REQUIRED: JS, DOM, requestAnimationFrame
- RELATED: BR-003, BR-005, BR-006, BR-072, BR-073, BR-074, BR-077, BR-078, BR-080, BR-084 | AR-001, AR-002, AR-005 | UC-001, UC-012, UC-013
---

## DI-018 : Vendor — copy Chart.js into ./build/vendor/
- SUMMARY: Local copy of Chart.js to avoid CDN runtime dependence.
- IMPLEMENTATION STEPS:
  1. Create `./build/vendor/`.
  2. Download Chart.js 4.4.x UMD bundle (`chart.umd.js`) and place at `./build/vendor/chart.umd.js`. Reference from index.html as `<script src="vendor/chart.umd.js"></script>` BEFORE the main module.
  3. Verify `Chart` is available on `window` after page load.
- SKILLSET REQUIRED: file management
- NOTES: Use a fixed version. If offline, fall back to a stub dashboard render (line/bar via raw canvas) — but expected path is to vendor the file.
- RELATED: BR-020, BR-021 | AR-006 | UC-004
---

## DI-019 : Write swamp_test_pipeline001.mjs — Playwright test script
- SUMMARY: Automated end-to-end browser test covering every UC; produces screenshots and a results JSON.
- IMPLEMENTATION STEPS:
  1. Create `./swamp_test_pipeline001.mjs` (project root).
  2. `import { chromium } from '/tmp/node_modules/playwright/index.mjs';` and `child_process.spawn('python3', ['-m','http.server','7430'], {cwd: './build'})`.
  3. Launch chromium, open `http://localhost:7430/`, wait for `#sim-canvas`.
  4. Test sequence:
     - **T01 (UC-001)**: assert canvas exists, wait 2 s, screenshot, assert `window._state.tick > 0`.
     - **T02 (UC-002)**: click sim-canvas at (400,400); wait 200 ms; assert `#inspector:not(.hidden)`; screenshot.
     - **T03 (UC-003)**: click `[data-screen="foodweb"]`; screenshot; click an alligator node area (computed); assert highlighted edges visible.
     - **T04 (UC-004)**: click `[data-screen="dashboard"]`; wait for chart canvases; screenshot.
     - **T05 (UC-005)**: click `[data-screen="intervention"]`; click Remove all on dragonfly row; wait 5 s simulated time (use ×30); assert mosquito count rose; screenshot.
     - **T06 (UC-006)**: trigger Pollution; wait 30 simulated seconds; assert otter count dropped; screenshot.
     - **T07 (UC-007)**: click [data-screen="scenarios"]; click "Remove the Alligator" Start; wait until first checklist item completes (poll `window._state.scenario.checklist`); screenshot.
     - **T08 (UC-008)**: start Mosquito Explosion; assert mosquito doubled within sim-time; screenshot.
     - **T09 (UC-009)**: start Algae Bloom; wait for oxygen drop; screenshot.
     - **T10 (UC-010)**: start Beaver Dam; assert water area increased; screenshot.
     - **T11 (UC-011)**: start Drought Year; assert gator-hole present; screenshot.
     - **T12 (UC-012)**: click ×30, wait 10 s wall-clock, assert dayOfYear advanced; click skip-season; assert season changed; screenshot.
     - **T13 (UC-013)**: toggle each overlay; assert overlay rendered; screenshot per overlay.
     - **T14 (UC-014)**: click [data-screen="saveload"]; click Save in slot 1; reload; click Load in slot 1; assert state restored; screenshot.
  5. Write `./testresults/T-PIPELINE-SS-001/results.json` with one entry per test.
  6. Save screenshots under `./testresults/T-PIPELINE-SS-001/T01.png`...`T14.png`.
  7. Close browser; kill server; print summary.
- SKILLSET REQUIRED: Playwright, Node.js ESM, child_process
- NOTES: Port 7430 to avoid conflicts with sibling projects.
- RELATED: All BRs | All UCs
---

---

## Vibrant Cartoon Graphics DIs (PT-019..PT-029)

## DI-020 : Asset preloader (PT-019, AR-013)
File: `./build/assets.js`. Exports:
- `export const ASSETS = { sprites: new Map(), icons: new Map(), portraits: new Map() }`
- `export async function loadAssets(manifest)` — for each entry in `manifest.sprites`, create `new Image()`, set `src`, await `decode()`, store in `ASSETS.sprites.set(speciesId, {img, meta})`. Same pattern for icons and portraits.
- `export function getSprite(id) { return ASSETS.sprites.get(id); }` plus `getIcon`, `getPortrait`.
- On any image error, throw `new Error('Asset failed: ' + url)` so `main.js` can show a friendly failure.
- Progress callback `manifest.onProgress(loaded, total)` is invoked after each asset to feed the loading overlay.

## DI-021 : Animator FSM (PT-020, AR-014)
File: `./build/animator.js`. Exports:
- `initAnim(agent, species)` — sets `agent.anim = {state: 'idle', frame: 0, accumulator: 0, facing: 'R'}`. Also sets `agent.locomotion = species.locomotion` (array of supported modes, e.g. `['walk','swim']` for amphibians).
- `updateAnimator(agent, dt, env)`:
  1. compute speed = √(vx²+vy²);
  2. if speed > IDLE_THRESHOLD (default 4 px/s), pick movement state from `pickLocomotion(agent, env)`; else state = 'idle';
  3. update `facing` from sign of vx (left if vx < -0.5, right if vx > 0.5, retain previous otherwise);
  4. advance `accumulator += dt * fpsFor(state, sheetMeta)`; while accumulator ≥ 1 → frame = (frame + 1) mod frameCount, accumulator -= 1;
  5. if state changed since last call, reset frame = 0 and accumulator = 0 — guarantees BR-103.
- `pickLocomotion(agent, env)`:
  - if species supports flight and agent.altitude > 0 → 'flight';
  - else if agent is in water (env.waterMaskAt(agent.x, agent.y)) AND species supports swim → 'swim';
  - else if species supports walk → 'walk';
  - else → 'idle' (sessile).
- `fpsFor(state, meta)` reads from sheet metadata (idle 3 fps default, walk 8 fps, swim 6 fps, flight 10 fps).

## DI-022 : Sprite-sheet manifest (PT-029)
File: `./build/sprites/manifest.js`. Static const:
```js
export const SPRITE_MANIFEST = {
  frog: { url: './sprites/frog.png', frameW: 64, frameH: 64,
    states: { idle: {row: 0, frames: 4, fps: 3}, walk: {row: 1, frames: 6, fps: 8}, swim: {row: 2, frames: 4, fps: 6} } },
  heron: { url: './sprites/heron.png', frameW: 96, frameH: 96,
    states: { idle: {row: 0, frames: 4, fps: 2}, walk: {row: 1, frames: 6, fps: 6}, flight: {row: 2, frames: 4, fps: 10} } },
  // ... one entry per species; complete list in implementation
};
```
Each species in `species.js` gains a `locomotion` array matching the keys in its sheet's `states` object.

## DI-023 : Sprite-aware renderer (PT-024, AR-015)
Update `./build/renderer.js`:
- Replace `ctx.fillStyle/ctx.arc/fill` agent block with:
  ```
  const sheet = getSprite(agent.species);
  const meta = sheet.meta.states[agent.anim.state];
  const sx = agent.anim.frame * sheet.meta.frameW;
  const sy = meta.row * sheet.meta.frameH;
  const dw = sheet.meta.frameW * agent.scale, dh = sheet.meta.frameH * agent.scale;
  ctx.save();
  ctx.translate(agent.x, agent.y);
  if (agent.anim.facing === 'L') ctx.scale(-1, 1);
  ctx.drawImage(sheet.img, sx, sy, sheet.meta.frameW, sheet.meta.frameH, -dw/2, -dh/2, dw, dh);
  ctx.restore();
  ```
- Skip if agent is outside `[-margin, w+margin] × [-margin, h+margin]` (margin = sheet.frameW).
- Plant patches: `patch.phase += dt * 0.6`; render position uses `Math.sin(patch.phase) * 1.5` x-offset for sway.
- Degrade mode: if last frame's wall-clock dt > 33 ms, force `frame = 0` for any agent whose `state === 'idle'` for that draw.

## DI-024 : Programmatic sprite-sheet generator (PT-021)
Because we cannot author 28 hand-painted sprite-sheets in this pipeline, ship a Node generator script `./scripts/gen-sprites.mjs` that:
- For each species in `species.js`, draws a cartoon body using node-canvas primitives (head, body, legs, eyes, tail, wings — driven by species shape tags) at 64×64 per frame.
- Generates idle (4 frames — body breathes ±2 px), walk (6 frames — legs phase shift), swim (4 frames — body s-curve), flight (4 frames — wing up/down) where applicable.
- Writes one PNG per species to `./build/sprites/<id>.png` and the matching entry in `./build/sprites/manifest.js`.
- The generated cartoons satisfy "thick outline, two-tone fills, distinct silhouettes" by using species-specific palette + body proportions taken from a per-species template table inside the script.
- The same script also writes 64×64 portrait SVGs to `./build/images/portraits/<id>.svg` for inspector/intervention rows.

Run-once at build time: `node scripts/gen-sprites.mjs`. Output is committed under `./build/`.

## DI-025 : Cartoon UI icon set (PT-022, BR-110..BR-114)
- Hand-author small SVG icons (24×24 viewBox) for nav, time controls, overlays, event cards, plus larger (≥ 200×120 viewBox) scenario card headers.
- All icons use the same palette tokens as the canvas (defined in style.css).
- Exposed via plain `<img src=...>` references — no SVG sprite system needed at this scale.
- Naming: `./build/images/ui/nav-canvas.svg`, `./build/images/ui/time-pause.svg`, `./build/images/ui/overlay-foodweb.svg`, `./build/images/ui/event-drought.svg`, `./build/images/ui/scenario-alligator-removed.svg`, etc.

## DI-026 : Cartoon UI restyle (PT-025, AR-016)
Update `./build/style.css`:
- Palette tokens: `--cypress: #2f6b3a; --water: #2d6a73; --mud: #6b4a2b; --sky: #f5efd6; --ink: #1c2429; --accent: #c98b2c; --warn: #c97a2c; --danger: #b13a2c; --ok: #4a8a3f;`
- All buttons: `border-radius: 12px; min-height: 36px; padding: 6px 14px; box-shadow: 0 2px 0 rgba(28,36,41,0.25); transition: transform 120ms, box-shadow 120ms;`
- Hover: `transform: translateY(-1px); filter: brightness(1.05);`
- Active/pressed: `transform: translateY(1px); box-shadow: 0 0 0 rgba(0,0,0,0);` (squash)
- Focus: `outline: 2px solid var(--accent); outline-offset: 2px;`
- Scenario cards: `border-radius: 16px; box-shadow: 0 4px 12px rgba(28,36,41,0.18); overflow: hidden;` with `.scenario-card-header img` displayed at full width.
- Save slot polaroid: `border: 8px solid #fff; border-bottom-width: 36px; box-shadow: 0 6px 14px rgba(0,0,0,0.18); transform: rotate(-1deg);` (alternating rotation on nth-child for variety)
- `@media (prefers-reduced-motion: reduce) { *, *::before, *::after { transition: none !important; animation: none !important; } }`

## DI-027 : index.html icon wiring (PT-026)
- For each nav button, embed `<img class="nav-icon" src="./images/ui/nav-<screen>.svg" alt="">` next to the existing label `<span>`.
- For each time control, embed the matching SVG icon.
- For each overlay button, embed the matching SVG icon.
- For each event card, embed the matching SVG icon header.
- Add `<div id="loading-overlay"><div class="lily-loader"></div><div id="loading-progress">0%</div></div>` at the end of `<body>`; CSS hides it via `body.assets-ready #loading-overlay { display: none; }`.

## DI-028 : main.js boot gate + animator wiring (PT-027)
Update `./build/main.js`:
1. Replace `seedBaseline(); ... requestAnimationFrame(loop);` with:
   ```
   try {
     await loadAssets({ ...SPRITE_MANIFEST, onProgress: updateLoadingUI });
     document.body.classList.add('assets-ready');
     seedBaseline();
     ...
     requestAnimationFrame(loop);
   } catch (e) {
     showFatal(e.message);
   }
   ```
   (Wrap top-level in `(async () => { ... })()` since modules don't allow top-level await everywhere.)
2. In the per-agent simulation loop (sim.js → tick), call `updateAnimator(agent, dt, env)` for each agent.
3. In `spawnAgent`, call `initAnim(agent, species)` so newly spawned agents have animator state.
4. After `loadSlot()`, walk all agents and call `initAnim(agent, getSpecies(agent.species))` to repopulate animator state (animator state is not serialised — AR-014).

## DI-029 : Inspector / intervention / foodweb portrait wiring (PT-028)
- `inspector.js` `openInspector(speciesId)`: set `<img id="inspector-portrait" src="./images/portraits/<id>.svg">`, also start a small JS interval that cycles a sprite-sheet animation in a `<canvas id="inspector-anim">` for the inspector idle preview.
- `intervention.js` species row: prepend `<img class="species-portrait" src="./images/portraits/<id>.svg" width="32" height="32">`.
- `foodweb.js` after drawing each node, call `ctx.drawImage(getPortrait(speciesId).img, node.x - 14, node.y - 14, 28, 28)`.

## DI-030 : Locomotion field on every species (PT-021, DI-021)
Edit `./build/species.js`: add `locomotion: ['walk'|'swim'|'flight'|'sessile']` array to each species record. Examples:
- `frog`: `['walk','swim']`
- `heron`: `['walk','flight']`
- `bass`: `['swim']`
- `osprey`: `['flight']`
- `alligator`: `['walk','swim']`
- `dragonfly`: `['flight']`
- `mosquito`: `['flight']`
- `cypress`, `lily_pad`, `algae`, etc.: `['sessile']` (these are plant patches; sessile entries skip the animator update entirely).


## DI-031 : terrain.js — Perlin-noise biome generator (PT-030, AR-019)

```
// terrain.js
export const BIOME = { DEEP:0, SHALLOW:1, MUD:2, GRASS:3, SAND:4, CYPRESS:5 };

// Classic 2D Perlin — inline permutation table (public domain)
function fade(t) { return t*t*t*(t*(t*6-15)+10); }
function lerp(t,a,b) { return a+t*(b-a); }
const P = new Uint8Array(512);
export function seedRng(s) {
  // fill P from seed using LCG shuffle
  for (let i=0;i<256;i++) P[i]=i;
  let r=s|0;
  for (let i=255;i>0;i--) {
    r=(r*1664525+1013904223)>>>0; const j=r%(i+1);
    [P[i],P[j]]=[P[j],P[i]];
  }
  for (let i=0;i<256;i++) P[256+i]=P[i];
}
function grad(h,x,y) { const u=h<8?x:y,v=h<4?y:h===12||h===14?x:0; return ((h&1)?-u:u)+((h&2)?-v:v); }
function noise(x,y) {
  const X=Math.floor(x)&255, Y=Math.floor(y)&255;
  x-=Math.floor(x); y-=Math.floor(y);
  const u=fade(x),v=fade(y);
  const a=P[X]+Y,aa=P[a],ab=P[a+1],b=P[X+1]+Y,ba=P[b],bb=P[b+1];
  return lerp(v, lerp(u,grad(P[aa],x,y),grad(P[ba],x-1,y)),
                  lerp(u,grad(P[ab],x,y-1),grad(P[bb],x-1,y-1)));
}

const THRESHOLDS = {
  DEEP:  -0.25,  // noise < DEEP  → deep water
  SHALLOW: 0.05, // DEEP..SHALLOW → shallow
  MUD: 0.18,     // SHALLOW..MUD  → mud
  GRASS: 0.35,   // MUD..GRASS    → grass/land
  SAND: 0.48,    // GRASS..SAND   → dry sandbar
  CYPRESS: 0.62  // SAND..CYPRESS → cypress stand; above → also deep water (islands)
};

export function generateTerrain(seed, W, H) {
  seedRng(seed);
  const map = new Uint8Array(W * H);
  for (let y=0;y<H;y++) for (let x=0;x<W;x++) {
    const n = noise(x/120, y/120) + 0.5*noise(x/50, y/50) + 0.25*noise(x/25, y/25);
    let b;
    if (n < THRESHOLDS.DEEP) b = BIOME.DEEP;
    else if (n < THRESHOLDS.SHALLOW) b = BIOME.SHALLOW;
    else if (n < THRESHOLDS.MUD) b = BIOME.MUD;
    else if (n < THRESHOLDS.GRASS) b = BIOME.GRASS;
    else if (n < THRESHOLDS.SAND) b = BIOME.SAND;
    else if (n < THRESHOLDS.CYPRESS) b = BIOME.CYPRESS;
    else b = BIOME.DEEP; // isolated deep pockets
    map[y*W+x] = b;
  }
  return { biomeMap: map, seed };
}

export function zoneAt(biomeMap, x, y, W) {
  const ix=Math.max(0,Math.min(W-1,x|0)), iy=Math.max(0,Math.min((biomeMap.length/W|0)-1,y|0));
  return biomeMap[iy*W+ix];
}

const SEASONAL_SHIFT = { summer: 0.05, winter: -0.05 };
export function terrainSeason(state, season) {
  // Only mark dirty; actual ImageData recomputed in renderer on dirty flag.
  state.terrain.seasonOffset = SEASONAL_SHIFT[season] ?? 0;
  state.terrain.dirty = true;
}
```

## DI-032 : particles.js — particle system (PT-031, AR-021)

```
// particles.js
const MAX = 1200;
const pool = [];
export const PM_REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function spawn(p) { if (PM_REDUCED || pool.length >= MAX) return; pool.push(p); }

export function emitRipple(x,y) {
  for (let i=0;i<3;i++) {
    const a=Math.random()*Math.PI*2, sp=12+Math.random()*8;
    spawn({x,y,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp*0.4,life:0.8,maxLife:0.8,type:'ripple',color:'rgba(150,220,220,0.5)',radius:3});
  }
}
export function emitSplash(x,y) {
  for (let i=0;i<8;i++) {
    const a=Math.random()*Math.PI*2, sp=20+Math.random()*30;
    spawn({x,y,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp-40,life:0.5,maxLife:0.5,type:'splash',color:'#cdeeff',radius:4});
  }
}
export function emitBlink(x,y,color='#ffffaa') {
  spawn({x,y,vx:0,vy:0,life:0.6,maxLife:0.6,type:'blink',color,radius:6});
}
export function emitRain() {
  for (let i=0;i<4;i++) {
    spawn({x:Math.random()*1280,y:0,vx:6,vy:200+Math.random()*80,life:0.4,maxLife:0.4,type:'rain',color:'rgba(180,220,255,0.5)',radius:1});
  }
}
export function emitConfetti() {
  const COLS=['#ffd34a','#2f6b3a','#c8a46e','#cde3c4','#e06040'];
  for (let i=0;i<60;i++) {
    spawn({x:Math.random()*1280,y:Math.random()*200,vx:(Math.random()-0.5)*80,vy:30+Math.random()*60,life:2.5,maxLife:2.5,type:'confetti',color:COLS[i%COLS.length],radius:4});
  }
}

export function tickParticles(dt) {
  for (let i=pool.length-1;i>=0;i--) {
    const p=pool[i]; p.x+=p.vx*dt; p.y+=p.vy*dt; p.life-=dt;
    if (p.life<=0) pool.splice(i,1);
  }
}
export function renderParticles(ctx) {
  for (const p of pool) {
    const a=p.life/p.maxLife;
    ctx.globalAlpha=a*0.85;
    ctx.fillStyle=p.color;
    ctx.beginPath();
    if (p.type==='confetti') { ctx.rect(p.x-p.radius,p.y-p.radius,p.radius*2,p.radius); }
    else { ctx.arc(p.x,p.y,p.radius,0,Math.PI*2); }
    ctx.fill();
  }
  ctx.globalAlpha=1;
}
```

## DI-033 : gen-sprites.py plant extension (PT-039, AR-020)

- Add 10 plant entries to SPECIES dict in `gen-sprites.py` with a `type='plant'` flag.
- Each plant entry has: `id`, `color` (main fill), `outline`, `type='plant'`, `loco=None`.
- Add `STATE_ROWS_PLANT = {'idle':0, 'seasonal-winter':1, 'harvest':2}` constant.
- Plant render helpers:
  - `render_lily_pad(d,W,H,frame,state)` — ellipse pad, 2 round lobes, frame drives bob offset.
  - `render_cattail(d,W,H,frame,state)` — vertical stem, brown oval head; sway offset per frame.
  - `render_cypress(d,W,H,frame,state)` — tall trunk, 3-tier triangle canopy; top-leaf shimmer = frame-based alpha.
  - `render_mangrove(d,W,H,frame,state)` — fan root arcs, round crown; root splay per frame.
  - `render_sawgrass(d,W,H,frame,state)` — 5 tall blades with sway.
  - `render_duckweed(d,W,H,frame,state)` — 4 tiny oval dots with bob.
  - `render_hyacinth(d,W,H,frame,state)` — round pad + 3 purple spike blossoms.
  - `render_algae(d,W,H,frame,state)` — blob with radial spokes; size scales with frame index.
  - `render_bladderwort(d,W,H,frame,state)` — submerged stem with small round bladders.
  - `render_arrowhead(d,W,H,frame,state)` — arrowhead-shaped leaf above water, sway.
- In `main()`, loop over plant entries with `STATE_ROWS_PLANT` and 4 frames each.
- Emit `plant-<id>.png` to `build/sprites/`; add manifest entries with `type:'plant'`.

## DI-034 : renderer.js terrain + plant sprite + atmosphere passes (PT-033, AR-019..021)

Render order (each `ctx.save/restore`):
1. **Sky-bg pass**: draw a vertical gradient rect (sky-top → horizon-water). For night phase overlay `rgba(10,15,40,0.7)`.
2. **Terrain pass**: draw offscreen `ImageData terrainBuffer` (recomputed from biomeMap + seasonOffset when `state.terrain.dirty`). Biome colour map: DEEP=#1b4f5e, SHALLOW=#2a7a8e, MUD=#7a5230, GRASS=#2e5c28, SAND=#b8904a, CYPRESS=#1a3d20.
3. **Dam pass**: for each `state.dams` entry draw log-stack rects from `(dam.x - dam.width/2)` to `(dam.x + dam.width/2)` at `dam.y`, height proportional to `dam.progress`; colour `#6b4226` joints, `#3d2210` logs.
4. **Plant pass**: replaced existing arc/rect with `drawImage` from plant sprite-sheet (sheet row from state, col from `floor(patch.phase * fps) % frames`).
5. **Animal pass**: existing sprite-sheet drawImage loop (unchanged from PT-024).
6. **Particle pass**: call `renderParticles(ctx)`.
7. **Tint pass**: draw full-canvas translucent rect using `TOD_TINT[state.environment.timeOfDay]`. TOD_TINT = {dawn:'rgba(255,160,60,0.18)', noon:'rgba(0,0,0,0)', dusk:'rgba(220,100,30,0.22)', night:'rgba(10,15,40,0.45)'}.

## DI-035 : sim.js dam tick + zone-affinity + particle events (PT-034, AR-018..019, AR-021)

- Import `{ zoneAt, BIOME }` from `./terrain.js`.
- Import `{ emitSplash, emitRipple, emitBlink, emitRain }` from `./particles.js`.
- `spawnAgent(sp, ...)`:  loop until `zoneAt(state.terrain.biomeMap, x, y, W)` satisfies species zone affinity. Aquatic (fish, frog, turtle…): must be DEEP or SHALLOW. Terrestrial (raccoon, firefly…): must be GRASS or SAND. Semi-aquatic (alligator, heron…): any non-CYPRESS.
- Per-tick: if swimming agent (anim.state === 'swim'), call `emitRipple(a.x, a.y)` every 30 ticks. On predation kill: `emitSplash(prey.x, prey.y)`. On firefly alive + night phase: `emitBlink(a.x, a.y)`.
- `tickDam(dam, dt)`:
  - If `dam.progress < 1`: find nearest beaver within 80px; if found, advance `dam.progress += 0.002 * dt`; play beaver build anim phase from `(dam.progress * 3)|0` (0=carry,1=drop,2=pack mapped to anim states). When progress hits 1: fire `emitConfetti()` milestone.
  - Degrade: if storm or drought active, `dam.health -= 0.0005 * dt`. If `dam.health < 0` mark for deletion.
  - Repair: nearest beaver within 60px of completed dam → `dam.health = Math.min(1, dam.health + 0.001 * dt)`.
  - Breach (demolish): `dam.breachTimer -= dt`; when > 0 emit `emitSplash(dam.x + rand, dam.y)` ×3 per tick; when hits 0 splice dam from array.
- `terrainSeason` called on season-boundary tick.

## DI-036 : state.js — terrain + dams fields (PT-035)
- `state.terrain = { biomeMap: null, seed: 0, dirty: true, seasonOffset: 0 }`.
- `state.dams = []` — array of dam objects.
- `initState()` calls `const t = generateTerrain(state.terrain.seed, W, H); state.terrain.biomeMap = t.biomeMap;`.

## DI-037 : main.js — seed from URL + dam click + ambient EQ (PT-036)
- On `boot()`: read `location.hash` for `#seed=N`; if missing, generate `seed = (Math.random()*99999)|0` and push to hash.
- Assign `state.terrain.seed = seed`.
- After loadAssets, call `generateTerrain(seed, CANVAS_W, CANVAS_H)` and store biomeMap.
- Canvas `click` listener: compute canvas-relative coords; test each `state.dams` entry for proximity (≤ dam.width/2 + 10); if hit, populate and show `#dam-tooltip`.
- `#ambient-eq` update: every 2 s, set `--eq-bars` CSS custom property proportional to `totalAgentCount / 200` (clamped 0–1); CSS animation uses that variable.

## DI-038 : index.html additions (PT-037)
- Add `<span id="seed-chip" class="seed-chip"></span>` in top-nav.
- Add `<div id="dam-tooltip" class="dam-tooltip hidden"></div>`.
- Add `<span id="ambient-eq" class="ambient-eq" aria-label="Ecosystem activity"></span>`.

## DI-039 : style.css additions (PT-038)
- `.seed-chip { font-size:11px; opacity:0.6; padding:2px 6px; border-radius:8px; background:rgba(0,0,0,0.3); }`.
- `.dam-tooltip { position:absolute; background:#1a2a1a; color:#cde3c4; border-radius:10px; padding:10px; font-size:13px; box-shadow:0 2px 8px rgba(0,0,0,0.5); min-width:180px; }`.
- `#ambient-eq { display:inline-flex; gap:2px; }` with 5 pseudo-bar spans driven by `--eq-bars`.
- `@keyframes eq-pulse { 0%,100%{transform:scaleY(0.3)} 50%{transform:scaleY(1)} }`.
- Reduced-motion: `@media (prefers-reduced-motion:reduce) { #ambient-eq * { animation:none; } }`.

## DI-040 : Seed normalization contract (PT-040, AR-022)
- Add helper in `main.js`: `parseOrCreateSeed()`.
- Behavior:
  - Parse `seed` from hash if present.
  - Reject values outside `[1,99999]` or non-integer inputs.
  - Generate fallback seed when invalid.
  - Rewrite hash to canonical `#seed=<seed>` whenever input was malformed.

## DI-041 : Dam tooltip safe wiring (PT-041, AR-024)
- Remove inline `onclick` markup from tooltip HTML.
- Render tooltip actions with class selectors (`.dam-demolish`, `.dam-close`).
- Attach listeners with `{ once: true }` each time tooltip opens.
- Show explicit usage fallback text (`none observed`) when builder list is empty.

## DI-042 : Ambient EQ semantic + visual update loop (PT-040, AR-024)
- Implement `updateAmbientEq()` in `main.js`:
  - Compute total population from `state.agents`.
  - Update `title` and `aria-label` with the same population value.
  - Modulate EQ bar opacity/animation cadence from normalized density.
- Call on boot and every 30 ticks.

## DI-043 : Edge-case tests for hardening (PT-043)
- Add test to force invalid seed hash and verify runtime normalization (`state.terrain.seed > 0`, hash canonical format).
- Add test to assert ambient EQ semantic metadata (`title`, `aria-label`) and stable 5-bar structure.
