# SwampSimulator — Parts List

## PT-001 : index.html — Application Shell
- DESCRIPTION: Root HTML page. Loads stylesheets, vendor scripts (Chart.js), and main module entry. Contains the top navigation, screen container divs (canvas, food-web, dashboard, intervention, scenarios, save-load), the species-inspector panel, the overlay toggle bar, and the time controls. No inline styles or scripts beyond the entry script tag.
- TECHNOLOGY RECOMMENDATIONS: AR-005
- NOTES: File location: `./build/index.html`. All ids and data attributes used by JS must match the spec in DI-001.
- RELATED: BR-001, BR-007, BR-027, BR-072, BR-079, BR-085 | UC-001, UC-002, UC-004, UC-005, UC-012, UC-013, UC-014
---

## PT-002 : style.css — Layout, Theming, and Environmental State Styling
- DESCRIPTION: Main stylesheet. Defines layout for top nav, canvas area, side panels, dashboard grid, scenario cards, save slots. Defines CSS variables for the muted naturalistic palette and per-environmental-event accent colours. Provides body-class hooks for `event-drought`, `event-flood`, `event-pollution`, `event-fire`, `season-spring`, `season-summer`, `season-autumn`, `season-winter`.
- TECHNOLOGY RECOMMENDATIONS: AR-005, AR-010
- NOTES: File location: `./build/style.css`.
- RELATED: BR-034, BR-075 | UC-006, UC-012
---

## PT-003 : state.js — Central Mutable State Store
- DESCRIPTION: Exports a single mutable `state` object containing `agents` (keyed by species), `environment` (water level, nutrient, oxygen, temperature, season, weather), `settings` (speed, season length, overlay toggles, gridCellSize, foodWebRadius), `events` (active event flags + log), `scenario` (current scenario id, checklist state), `tick` counter, and `nextId` allocator. Pure data — no logic.
- TECHNOLOGY RECOMMENDATIONS: AR-004
- NOTES: File location: `./build/state.js`.
- RELATED: BR-027, BR-086 | UC-002, UC-005, UC-014
---

## PT-004 : species.js — Species Definitions Table
- DESCRIPTION: Exports a `SPECIES` constant: ordered list of all 25 species records. Each record: `{ id, commonName, latinName, trophicLevel, baselineCount, role, eats: [], eatenBy: [], color, sprite, speed, sensorRadius, energyPerMeal, reproRate, lifespan, sensitivities: { pollution, drought, cold } }`. Single source of truth for the food web.
- TECHNOLOGY RECOMMENDATIONS: AR-002
- NOTES: File location: `./build/species.js`.
- RELATED: BR-002, BR-013, BR-014, BR-035, BR-036, BR-052 | UC-001, UC-002, UC-003, UC-006
---

## PT-005 : sim.js — Agent Simulation Engine
- DESCRIPTION: Exports `tick(dt)`. Per tick: rebuilds the spatial grid (PT-006); iterates all agents to apply movement (toward target / random walk), sensing (find prey/predator within `sensorRadius`), eating (energy transfer + agent removal), reproduction (when energy > threshold), death (energy ≤ 0 or age > lifespan), and environmental modifiers (cold-blooded speed scaling, pollution sensitivity damage). Spawns new agents per species reproduction rules. Records predation events for BR-067.
- TECHNOLOGY RECOMMENDATIONS: AR-002, AR-003
- NOTES: File location: `./build/sim.js`. Pure function — reads/writes state object only.
- RELATED: BR-003, BR-004, BR-029, BR-035, BR-036, BR-049, BR-067, BR-068 | UC-001, UC-005, UC-006, UC-008, UC-011
---

## PT-006 : grid.js — Spatial Hash for Neighbour Lookups
- DESCRIPTION: Exports `buildGrid(agents, cellSize)` and `nearby(grid, x, y, radius)`. Implements a flat 2D grid bucket spatial hash. Used by sim.js for predator/prey detection and by renderer.js for food-web overlay arrow drawing.
- TECHNOLOGY RECOMMENDATIONS: AR-003
- NOTES: File location: `./build/grid.js`. Cell size tunable via `state.settings.gridCellSize`.
- RELATED: BR-006, BR-029, BR-083 | UC-001, UC-005, UC-013
---

## PT-007 : environment.js — Environmental Event and Season Engine
- DESCRIPTION: Exports `triggerEvent(type)`, `clearEvent(type)`, `tickEnvironment(dt)`. Manages water level, nutrient level, oxygen level, temperature, and season. Applies event modifiers: drought (drop water), flood (raise water), pollution (taint sensitive agents), fire (kill shoreline plants), nutrient runoff (spike algae growth rate), cold snap (drop temperature). Advances seasonal phase based on season-length setting; applies plant growth/dieback and migratory species spawn/despawn.
- TECHNOLOGY RECOMMENDATIONS: AR-002, AR-010
- NOTES: File location: `./build/environment.js`. Concurrent events stack (BR-039).
- RELATED: BR-033, BR-034, BR-035, BR-038, BR-039, BR-053, BR-054, BR-066, BR-068, BR-071, BR-074, BR-075, BR-076 | UC-006, UC-009, UC-011, UC-012
---

## PT-008 : gatorhole.js — Alligator Habitat Engineering
- DESCRIPTION: Exports `updateGatorHoles(state)`. During drought, retains a small water disk around each alligator agent's position, persisting after the surrounding water has receded. Visualised as a small water-coloured circle in the renderer. Drives BR-046, BR-069, BR-070.
- TECHNOLOGY RECOMMENDATIONS: AR-002
- NOTES: File location: `./build/gatorhole.js`. Radius and persistence tunable.
- RELATED: BR-046, BR-069, BR-070 | UC-007, UC-011
---

## PT-009 : beaverdam.js — Beaver Engineering
- DESCRIPTION: Exports `progressDam(state)`, `removeDam(state)`. When the Beaver Dam scenario is active or beaver agents reach a designated outflow, accumulates dam-build progress; on completion, raises baseline water level and expands aquatic-zone bounds. Removal reverses the change.
- TECHNOLOGY RECOMMENDATIONS: AR-002
- NOTES: File location: `./build/beaverdam.js`.
- RELATED: BR-060, BR-061, BR-065 | UC-010
---

## PT-010 : renderer.js — Canvas Drawing
- DESCRIPTION: Exports `render(ctx, state)`. Draws the static background (water, mudbanks, plants — to offscreen canvas, blitted), then animated sprites for each live agent, then enabled overlays (food-web arrows via PT-006, nutrient gradient, oxygen heatmap, population density heatmap), then gator-hole rings. Applies environmental tints (drought yellow, flood blue, pollution dark green) over the scene.
- TECHNOLOGY RECOMMENDATIONS: AR-001, AR-010
- NOTES: File location: `./build/renderer.js`. Maintains an offscreen background canvas to avoid redrawing static terrain every frame.
- RELATED: BR-001, BR-005, BR-006, BR-034, BR-038, BR-058, BR-075, BR-079, BR-081, BR-082, BR-083 | UC-001, UC-006, UC-009, UC-012, UC-013
---

## PT-011 : foodweb.js — Food Web Graph Module
- DESCRIPTION: Exports `initLayout(species)`, `renderGraph(ctx, state)`, `nodeAt(x, y)`. Computes initial force-directed node positions for the species graph, then on every tick updates node radii from live populations and edge thicknesses from recorded predation rates. Handles click (highlight chain) and hover (tooltip) interactions.
- TECHNOLOGY RECOMMENDATIONS: AR-007
- NOTES: File location: `./build/foodweb.js`. Edge tooltips show "{prey} → {predator}: N events/min".
- RELATED: BR-012, BR-013, BR-014, BR-015, BR-016, BR-017, BR-018, BR-019 | UC-002, UC-003
---

## PT-012 : dashboard.js — Population Dashboard
- DESCRIPTION: Exports `mountDashboard()`, `updateDashboard(state)`. Owns Chart.js instances for the per-species line chart and the trophic-level stacked bar chart. Maintains a rolling time-series buffer per species. Renders the alert panel from `state.events.log`. Implements legend-click isolation (BR-024).
- TECHNOLOGY RECOMMENDATIONS: AR-006
- NOTES: File location: `./build/dashboard.js`.
- RELATED: BR-020, BR-021, BR-022, BR-023, BR-024, BR-025, BR-026, BR-037 | UC-004, UC-005, UC-006
---

## PT-013 : inspector.js — Species Inspector Panel
- DESCRIPTION: Exports `openInspector(speciesId)`, `closeInspector()`. Renders the docked right-rail panel from a species record (PT-004) plus live population data. Generates clickable prey/predator links that re-invoke `openInspector` for the linked species. Handles canvas clicks (resolves clicked agent to a species) and food-web node clicks.
- TECHNOLOGY RECOMMENDATIONS: AR-005
- NOTES: File location: `./build/inspector.js`.
- RELATED: BR-007, BR-008, BR-009, BR-010, BR-011, BR-012 | UC-002
---

## PT-014 : intervention.js — Intervention Panel
- DESCRIPTION: Exports `mountIntervention()`, `updateIntervention(state)`. Renders the species control list (+1, +N, Remove all per species) and the environmental event trigger grid. Wires controls to PT-005 (add/remove agents) and PT-007 (trigger events). Renders the "Active events" sub-panel and the Restore Baseline button.
- TECHNOLOGY RECOMMENDATIONS: AR-005
- NOTES: File location: `./build/intervention.js`.
- RELATED: BR-027, BR-028, BR-030, BR-031, BR-032, BR-033 | UC-005, UC-006
---

## PT-015 : scenarios.js — Scenario Manager
- DESCRIPTION: Exports `SCENARIOS` constant (data records for the five scenarios), `startScenario(id)`, `tickScenario(state)`, `endScenario()`. Each scenario record has `setup(state)` (initial population/environment changes), `checklist[]` (functions of state returning bool, each with a label), and `summary(state)` (template producing the cause-effect report). Renders the scenario-picker grid and the active-scenario overlay.
- TECHNOLOGY RECOMMENDATIONS: AR-008
- NOTES: File location: `./build/scenarios.js`. Scenarios: alligator-removed, mosquito-explosion, algae-bloom, beaver-dam, drought-year.
- RELATED: BR-040 through BR-071 | UC-007, UC-008, UC-009, UC-010, UC-011
---

## PT-016 : storage.js — Save/Load Manager
- DESCRIPTION: Exports `saveSlot(n)`, `loadSlot(n)`, `listSlots()`, `deleteSlot(n)`. Serialises the entire state object to JSON and writes to `localStorage` under `swamp:save:N`. Validates payload size before writing (warn at 4 MB, refuse at 5 MB per BR-091). On load, replaces state in place.
- TECHNOLOGY RECOMMENDATIONS: AR-009
- NOTES: File location: `./build/storage.js`.
- RELATED: BR-085, BR-086, BR-087, BR-088, BR-089, BR-090, BR-091 | UC-014
---

## PT-017 : main.js — Entry Point and Game Loop
- DESCRIPTION: Bootstrap. Imports state (PT-003), species (PT-004), sim (PT-005), environment (PT-007), gatorhole (PT-008), beaverdam (PT-009), renderer (PT-010), foodweb (PT-011), dashboard (PT-012), inspector (PT-013), intervention (PT-014), scenarios (PT-015), storage (PT-016). Sets canvas size; wires top-nav screen switching; wires time controls (play/pause/×1/×5/×30/skip-season); runs the `requestAnimationFrame` main loop calling `tick()` and `render()` per frame at the configured speed; updates the time readout. Exposes `window._state` for testability.
- TECHNOLOGY RECOMMENDATIONS: AR-001, AR-002, AR-005
- NOTES: File location: `./build/main.js`.
- RELATED: BR-003, BR-005, BR-006, BR-072, BR-073, BR-074, BR-077, BR-078, BR-080, BR-084 | UC-001, UC-012, UC-013
---

## PT-018 : swamp_test_pipeline001.mjs — Playwright Test Script
- DESCRIPTION: Playwright test script serving `./build/` via `python3 -m http.server` on port 7430. Covers each UC end-to-end: canvas loads, organisms move, species inspector opens, food-web graph renders, dashboard updates, species removal triggers cascade, environmental events render, each of the 5 guided scenarios completes its cascade checklist, time controls work, overlays toggle, save/load round-trips. Saves screenshots per UC under `./testresults/T-PIPELINE-SS-001/`.
- TECHNOLOGY RECOMMENDATIONS: AR-011
- NOTES: File location: `./swamp_test_pipeline001.mjs` (project root, not in build). Run with `DISPLAY=:0 node swamp_test_pipeline001.mjs`.
- RELATED: All BRs | All UCs
---

---

## Vibrant Cartoon Graphics PTs (UC-015..UC-017, AR-012..AR-017)

## PT-019 : ./build/assets.js — asset preloader (AR-013)
- Exports `loadAssets(manifest)` and `getSprite(speciesId)`, `getIcon(id)`, `getPortrait(speciesId)`.
- Loads sprite-sheet PNGs and SVG icons listed in a manifest.
- Boot gate: `main.js` awaits this before starting the RAF loop.

## PT-020 : ./build/animator.js — per-agent animation FSM (AR-014)
- Exports `initAnim(agent, species)`, `updateAnimator(agent, dt, env)`, `currentFrame(agent, sheetMeta)`.
- Selects state {idle, walk, swim, flight} from velocity + species locomotion + environment.
- Advances frame index using simulated dt (so it scales with speed multipliers and pauses with sim).

## PT-021 : ./build/sprites/ — animated sprite-sheets (BR-092..BR-100)
- One PNG per species (28 species total) named `<speciesId>.png`.
- Layout: rows = states (idle, walk, swim, flight; only those applicable to the species), columns = frames.
- Companion `manifest.js` describing each sheet's frame size, rows, frame counts, and fps per state.
- For initial release, sheets are generated programmatically as cartoon vector renderings rasterised at 64×64 per frame (see DI-024).

## PT-022 : ./build/images/ui/ — cartoon UI icon set (BR-110..BR-114)
- SVG icons for the 6 nav buttons (canvas, foodweb, dashboard, intervention, scenarios, saveload).
- SVG icons for the time controls (pause, play, ×1, ×5, ×30, skip-season).
- SVG icons for the 4 overlays (foodweb, nutrient, oxygen, density).
- SVG icons for the 6 event cards (drought, flood, pollution, fire, runoff, coldsnap).
- 5 SVG illustrated headers for the scenario cards.

## PT-023 : ./build/images/portraits/ — species portrait SVGs (BR-107, BR-108)
- One SVG per species (28 total) sized 64×64, used in inspector header, intervention rows, food-web nodes.

## PT-024 : ./build/renderer.js — sprite-aware update (AR-015)
- Replace `ctx.arc` agent drawing with `ctx.drawImage` against the per-species sprite-sheet using the current animator frame.
- Implement viewport culling and degrade mode.
- Plant patches gain wobble via `patch.phase` (AR-017).

## PT-025 : ./build/style.css — cartoon UI restyle layer (AR-016, BR-110..BR-116)
- Update palette tokens, button radii, hit-target heights, hover/focus/pressed states.
- Style scenario cards, polaroid save slots, illustrated headers.
- Add `@media (prefers-reduced-motion: reduce)` block disabling transitions.

## PT-026 : ./build/index.html — icon `<img>` wiring (BR-112)
- Swap text-only buttons to icon+label using `<img src="./images/ui/...">` references.
- Add `<img>` slots for portraits in intervention rows, food-web nodes, inspector header (populated by JS).
- Add `<img>` slots for scenario card headers.
- Add a boot-time `#loading-overlay` element shown until assets resolve.

## PT-027 : ./build/main.js — boot gate + animator wiring (AR-013, AR-014)
- `await loadAssets(MANIFEST)` before scheduling the first RAF.
- Call `updateAnimator(agent, dt, env)` for each agent inside the per-tick loop.
- Hide the loading overlay after assets resolve.

## PT-028 : ./build/inspector.js / intervention.js / foodweb.js — portrait wiring (BR-107, BR-108)
- Inspector header shows `<img>` portrait + plays its idle animation (cycle large sprite-sheet frames in JS).
- Intervention species rows render a 32×32 portrait next to the species name.
- Food-web nodes render the portrait centred under the node circle.

## PT-029 : ./build/sprites/manifest.js — animation manifest (AR-013, PT-021)
- Static const exporting per-species sheet metadata: frame size, rows, frame counts, fps per state, locomotion modes supported.


## PT-030 : ./build/terrain.js — procedural biome generator (AR-019, BR-127..BR-136)
- Exports `generateTerrain(seed, width, height)` → `{biomeMap, seed}`.
- Exports `zoneAt(biomeMap, x, y, width)` → biome enum value.
- Exports `terrainSeason(biomeMap, season, width, height)` → updated biomeMap.
- Exports `BIOME` enum: `{DEEP, SHALLOW, MUD, GRASS, SAND, CYPRESS}`.

## PT-031 : ./build/particles.js — particle system (AR-021, BR-146..BR-155)
- Exports `emitRipple`, `emitSplash`, `emitBlink`, `emitRain`, `emitConfetti`.
- Exports `tickParticles(dt)`, `renderParticles(ctx)`.
- Exports `PM_REDUCED` flag and wires `prefers-reduced-motion` at module init.

## PT-032 : ./build/sprites/plant-*.png — plant sprite-sheets (AR-020, BR-137..BR-145)
- One PNG per plant species: plant-lily_pad.png, plant-cattail.png, plant-cypress.png, plant-mangrove.png, plant-sawgrass.png, plant-duckweed.png, plant-hyacinth.png, plant-algae.png, plant-bladderwort.png, plant-arrowhead.png.
- Same 64×64-frame layout as animal sheets; rows: idle, seasonal-winter, harvest.

## PT-033 : ./build/renderer.js — terrain + plant + atmosphere render update (AR-019..AR-021, BR-128..BR-155)
- Add terrain pre-pass: draw offscreen ImageData buffer to canvas at bottom layer.
- Replace old plant-patch arc/rect with sprite-sheet `drawImage`.
- Add particle overlay pass at top.
- Add full-canvas colour tint pass (time-of-day).
- Add background sky/silhouette layer below terrain.

## PT-034 : ./build/sim.js — dam ticking + zone-affinity spawn + terrain morph (AR-018..AR-019)
- Add `tickDam(dam, dt)` helper.
- Check `zoneAt` on every `spawnAgent` call.
- Call `terrainSeason` on season-change.
- Emit `emitSplash` on predation events.

## PT-035 : ./build/terrain.js (gen) — seasonal dirty flag in state.js
- `state.terrain.dirty = true` when season changes; `renderer.js` recomputes terrain ImageData only when `dirty`.

## PT-036 : ./build/main.js — dam inspect click handler + seed URL hash + ambient EQ icon (AR-018, AR-019, AR-021)
- Add `#ambient-eq` HUD element.
- Append `#seed=N` to URL on new game.
- Register canvas click → proximity test against `state.dams` → open dam tooltip.

## PT-037 : ./build/index.html — terrain seed chip, dam tooltip element, ambient-eq icon (PT-036)
- Add `#seed-chip` span in top-nav.
- Add `#dam-tooltip` floating div.
- Add `#ambient-eq` icon in HUD.

## PT-038 : ./build/style.css — terrain-seed chip, dam-tooltip, ambient-eq, night/dawn tint tokens (AR-021)
- CSS vars: `--dawn`, `--noon`, `--dusk`, `--night`.
- `.dam-tooltip` card style.
- `#seed-chip` pill.
- `#ambient-eq` pulse animation (disabled under reduced-motion).

## PT-039 : ./scripts/gen-sprites.py — plant sprite generation (AR-020)
- Extend SPECIES dict with 10 plant entries; add render helper per plant type.
- Emit plant-*.png sheets and update manifest.js entries.

## PT-040 : ./build/main.js — seed normalization + ambient metadata loop (AR-022, AR-024)
- Add robust seed parser (`parseOrCreateSeed`) and hash normalization writeback.
- Add `updateAmbientEq()` to bind organism count to title/aria/animation intensity.

## PT-041 : ./build/main.js — safe dam tooltip controls (AR-024)
- Replace inline tooltip button handlers with programmatic listeners and explicit close/demolish actions.
- Add lightweight usage text fallback for sparse/empty builder lists.

## PT-042 : ./build/storage.js — regenerable terrain persistence hardening (AR-023)
- Keep excluding `biomeMap` from save payload.
- Rebuild terrain map from persisted seed and season offset immediately after `loadSlot`.

## PT-043 : ./swamp_test_pipeline001.mjs — edge/simple-case verification additions (BR-164)
- Add test for invalid seed hash normalization.
- Add test for ambient EQ semantic metadata and bar structure stability.
