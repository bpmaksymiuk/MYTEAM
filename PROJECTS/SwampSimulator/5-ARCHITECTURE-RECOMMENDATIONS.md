# SwampSimulator — Architecture Recommendations

## AR-001 : Use a single HTML5 Canvas 2D context for all ecosystem rendering
- RATIONALE: The ecosystem view is a 2D top-down scene with hundreds of moving sprites, water, plants, and overlays. Canvas 2D is universally supported, has minimal API surface, and renders thousands of simple shapes per frame at ≥ 30 FPS without WebGL complexity. WebGL would be overkill for sprite-circle rendering and would significantly increase implementation cost.
- NOTES: A second offscreen Canvas may be used for slow-changing background terrain (water, mudbanks, cypress) to avoid redrawing it every tick.
- RELATED: BR-001, BR-005, BR-006 | UC-001
---

## AR-002 : Implement the ecosystem as a discrete agent-based simulation in plain JavaScript
- RATIONALE: Goal calls for emergent behaviour from individual agent rules, not closed-form Lotka-Volterra equations. A per-tick update loop iterating each agent (organism) lets predator/prey/reproduction/death rules be expressed in straightforward JS code, producing realistic boom-bust population curves naturally. No third-party simulation library matches the ecological-cascade requirement; a custom engine fits the small scope (≤ 25 species, ≤ ~1000 agents typical).
- NOTES: Per-agent state: id, species, x, y, vx, vy, energy, age, target. All agents stored in a flat array per species in central state.
- RELATED: BR-003, BR-004, BR-029 | UC-001, UC-005
---

## AR-003 : Use a grid-bucket spatial hash for neighbour lookups
- RATIONALE: Predator-prey detection, gator-hole proximity, mosquito breeding clustering, and overlay arrow drawing all require near-neighbour queries. A flat O(N²) scan caps usable population at ~200 agents; a 32×32 px grid bucket reduces typical query cost to O(N) amortised, keeping 30 FPS at the target population.
- NOTES: Bucket cell size tunable in settings. Rebuild buckets at the start of each tick.
- RELATED: BR-006, BR-029, BR-067 | UC-001, UC-005, UC-011
---

## AR-004 : Represent simulation state as plain JavaScript objects in a flat arrays-of-records store
- RATIONALE: All modules import a single mutable `state` object (no proxy/reactive framework). This minimises ceremony, keeps save/load trivial (JSON.stringify(state)), and keeps the data model directly inspectable in DevTools. State surface area is small enough that a reactive store would add cost without benefit.
- NOTES: state.agents (per species), state.environment, state.settings, state.events, state.scenario, state.tick.
- RELATED: BR-027, BR-086 | UC-002, UC-005, UC-014
---

## AR-005 : Use vanilla HTML/CSS for all UI panels (overlays, dashboard, intervention, save/load) — no framework
- RATIONALE: UI is a fixed set of about a dozen panels with no deep component reuse, no client-side routing requirement, and a single user. React/Vue would multiply build complexity, bundle size, and learning surface for negligible developer productivity gain at this scale.
- NOTES: Use semantic HTML (sections, buttons, lists), CSS variables for theming, and a small JS module per panel that subscribes to a tick-based render call.
- RELATED: BR-007, BR-027, BR-072, BR-079 | UC-002, UC-005, UC-012, UC-013
---

## AR-006 : Use Chart.js (CDN, single bundle) for population dashboard charts
- RATIONALE: BR-020 through BR-026 require live multi-series line charts and a stacked bar chart with legend interaction, axis labelling, and animated updates. Chart.js delivers all of this with one `<script>` include and a stable, documented API. D3.js would offer more flexibility but at significantly higher implementation cost; Chart.js is the lowest-friction choice that satisfies the requirements.
- NOTES: Pin to a fixed Chart.js version (e.g. 4.4.x) and serve from a local copy in `./build/vendor/` to avoid CDN dependence at runtime.
- RELATED: BR-020, BR-021, BR-024, BR-025 | UC-004
---

## AR-007 : Implement the Food Web Graph with a custom force-directed layout on a dedicated Canvas
- RATIONALE: BR-013 through BR-018 require a live, interactive graph with hover tooltips, click-to-highlight chains, and node radii that change every tick. A custom Canvas implementation keeps update cost predictable, avoids dragging in a heavy graph library (D3-force, Cytoscape) for one screen, and lets hover/click interactions read directly from the same agent-state tick data.
- NOTES: Initial layout computed once at start using a simple spring-relaxation pass; node positions then frozen. Only node radii and edge thickness vary per tick.
- RELATED: BR-013, BR-014, BR-015, BR-017 | UC-003
---

## AR-008 : Use a single ScenarioManager module to encapsulate all five guided scenarios
- RATIONALE: Each scenario (Remove the Alligator, Mosquito Explosion, Algae Bloom, Beaver Dam, Drought Year) is a small state machine: setup → run → checklist tracking → summary. Centralising this in one module avoids duplication and makes adding scenarios a one-record edit.
- NOTES: Each scenario is a data object with start hooks (set populations, set environment), checklist conditions (functions over state), and summary template strings.
- RELATED: BR-040, BR-047, BR-053, BR-060, BR-066 | UC-007 through UC-011
---

## AR-009 : Use JSON serialisation into localStorage for save/load with a quota guard
- RATIONALE: BR-085 through BR-091 specify three slots, persistence across sessions, ≤ 5 MB per slot. localStorage is sync, simple, and universally supported; JSON.stringify of state is straightforward because state is plain objects (per AR-004). A pre-save size check prevents quota errors.
- NOTES: Slot keys: `swamp:save:1`, `swamp:save:2`, `swamp:save:3`. Validate string length pre-write; warn user if approaching 5 MB.
- RELATED: BR-085, BR-086, BR-087, BR-089, BR-091 | UC-014
---

## AR-010 : Use CSS variables and an HTML class toggle for environmental visual states
- RATIONALE: Drought, flood, pollution, fire, and seasonal vegetation each require canvas-tint and panel-accent shifts. CSS variables driven by `body` classes (e.g. `body.event-drought`, `body.season-winter`) give a single declarative source for these visual states without per-element JS overrides.
- NOTES: Class set by main render loop based on state.environment.
- RELATED: BR-034, BR-038, BR-075 | UC-006, UC-012
---

## AR-011 : Use Playwright 1.59.1 at /tmp/node_modules/playwright/index.mjs for automated browser tests
- RATIONALE: Stage 10 must verify the full pipeline in a real browser. Playwright is the test tool used by sibling projects (PhysicsSimulator, ChargeSimulator) in this repository — re-using it minimises new test infrastructure and keeps the team on a known toolchain.
- NOTES: Test script lives at `./swamp_test_pipeline001.mjs` (project root). Serves `./build/` via `python3 -m http.server`. Captures one screenshot per UC.
- RELATED: All BRs (test coverage) | All UCs
---

---

## Vibrant Cartoon Graphics ARs (UC-015..UC-017, BR-092..BR-117)

## AR-012 : SVG sprite library + sprite-sheet hybrid
- Use SVG for static portraits (inspector, intervention rows, food-web nodes, scenario card headers, UI icons) — single file per sprite, scales without artefacts, easy to ship as text under git.
- Use a single PNG sprite-sheet per animated species for canvas animation — one row per animation state (idle/walk/swim/flight), columns = frames. Loaded once via `Image()` and drawn with `ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh)`. This keeps per-frame cost O(1) and avoids the SVG rasterisation overhead.
- Both asset types live under `./build/sprites/` (animated) and `./build/images/ui/` (UI icons / portraits) and are bundled with the static site — no runtime fetch.

## AR-013 : Asset preloader + boot gate
- A new `assets.js` preloader is the *single* boot gate before the simulation starts ticking.
- `assets.js` exposes `await loadAssets(manifest)` returning `{sprites: Map<speciesId, SpriteSheet>, icons: Map<id, Image>, portraits: Map<speciesId, Image>}`.
- Manifest is a static JS const; missing files fail loud at boot, never silently.
- A simple cartoon "loading lily-pad" overlay shows progress so the gate is visible to the user.

## AR-014 : Per-agent animator state attached to each agent record
- Each agent record gains `{anim: {state: 'idle'|'walk'|'swim'|'flight', frame: int, accumulator: float, facing: 'L'|'R'}}` populated when the agent is spawned.
- `animator.js` exposes `updateAnimator(agent, dt, env)` called once per agent per simulated tick. It picks the state from velocity + species locomotion + environment and advances `frame` by `dt * fps` (fps depends on state).
- This isolates animation state from simulation state — the simulator stays deterministic and save/load remains compatible (animator state is not serialised; it is regenerated on load with default frame 0).

## AR-015 : Sprite-aware renderer with batched draws + culling
- `renderer.js` is updated to call `drawSprite(ctx, agent, sheet)` instead of drawing a circle.
- Off-screen agents (outside canvas viewport with margin) skip `drawImage` entirely.
- When wall-clock dt > 33 ms (frame budget exceeded), `renderer.js` enters degrade mode: idle animations hold on frame 0, movement animations still play. This satisfies BR-105/BR-106 without a hard performance regression.

## AR-016 : Cartoon UI as a CSS-only restyle layer (no DOM rewrite)
- All UI cartoonisation is delivered through `style.css` token updates, additional rules, and SVG icon `<img>` swaps in `index.html`.
- No DOM structure change; existing JS event wiring continues to work unchanged. This protects every UC-001..UC-014 acceptance criterion.
- A `prefers-reduced-motion` media query disables UI transitions in one place, satisfying BR-116.

## AR-017 : Plant-patch animation via shader-style canvas math
- Plant patches are not agents and do not get sprite-sheets. They are animated via a per-tick offset/phase in their record (`patch.phase += dt`) used by `renderer.js` to wobble the patch's draw position or alpha. Cheap, no extra assets, satisfies BR-096.


---

## AR-018 : Beaver dam as a mutable terrain object
- Dams are entries in `state.dams[]` — each with `{id, x, y, width, progress, health, builders}`. They are neither agents nor plant patches.
- `sim.js` runs a `tickDam(dam, dt)` helper: moves beaver agents toward build-site, increments `progress`, degrades `health` during storm/drought, triggers repair when a beaver is within range.
- `renderer.js` draws dams in the terrain pass (above water, below plants) using a procedural cartoon shape: stacked log-rect segments with mud-fill joints.
- Dam inspect is a separate click-handler in `main.js` that detects click proximity to `state.dams` entries and opens a tooltip.
- Breach animation: a short `breachTimer` on the dam record drives a canvas particle flood for 60 frames, then the dam record is deleted.
- Satisfies BR-118..BR-126.

## AR-019 : Seeded Perlin-noise terrain generator
- `terrain.js` (new module) generates a `Float32Array` biome map (width × height) from an integer seed via a fast 2D Perlin-noise implementation (public-domain code inlined, no npm dependency).
- A biome enum (DEEP=0, SHALLOW=1, MUD=2, GRASS=3, SAND=4, CYPRESS=5) is assigned per pixel from threshold buckets applied to the noise field.
- `state.terrain` holds the biome map and the seed.
- `renderer.js` draws the terrain in a single pass from an offscreen ImageData buffer, only recomputing when season changes (dirty flag).
- Zone-affinity lookup: `zoneAt(x, y)` → biome value; used by `sim.js` spawn-check and locomotion-selector.
- Seasonal morph: a `terrainSeason(season)` function shifts threshold buckets in the biome map (shallow/mud expand in winter; shallow widens in summer).
- Satisfies BR-127..BR-136.

## AR-020 : Plant sprite-sheets — same schema as animal sheets
- `gen-sprites.py` extended to emit plant sprite-sheets under `./build/sprites/plant-<id>.png` using the same 64×64-per-frame, row=state, col=frame layout (DI-022).
- States for plants: `idle` (looping bob/sway), `seasonal-winter` (sparse, desaturated), `harvest` (shake + puff).
- `manifest.js` extended with plant entries (type=plant, loco=null, states per sheet).
- `renderer.js` draws plant patches via their sprite-sheet frame (driven by `patch.phase`) rather than the old arc/rect primitives.
- Satisfies BR-137..BR-145.

## AR-021 : Particle system for atmosphere effects
- `particles.js` (new module) manages a flat array of particle objects `{x, y, vx, vy, life, maxLife, type, color, radius}`.
- `emitRipple(x,y)`, `emitSplash(x,y)`, `emitBlink(x,y,color)`, `emitRain()`, `emitConfetti()` are thin factory functions that push entries.
- `tickParticles(dt)` advances each particle, interpolates alpha from `life/maxLife`, removes expired.
- `renderParticles(ctx)` draws all live particles in the top particle-layer pass.
- `prefers-reduced-motion`: a module-level flag `PM_REDUCED` (set once at load from `matchMedia`) clears the array after every spawn call if true — net zero particles.
- Time-of-day tint: `renderer.js` draws a translucent colour rect over the full canvas after the terrain+animal passes, using `state.environment.timeOfDay` to pick a tint preset.
- Firefly blinks: firefly agents emit `emitBlink` once per random phase cycle during night phase.
- Satisfies BR-146..BR-155.

## AR-022 : Seed normalization and hash resilience layer
- `main.js` owns canonical seed normalization (`1..99999`) and hash rewriting.
- Hash parser tolerates unrelated hash keys and malformed seed fragments, always yielding a valid deterministic seed.
- Canonical hash format for runtime is `#seed=<int>`.
- Satisfies BR-158, BR-163.

## AR-023 : Regenerable terrain persistence strategy
- Terrain pixel/biome buffers are classified as regenerable derived state.
- `storage.js` excludes regenerable buffers from serialized payload and reconstructs them from durable fields (`seed`, `seasonOffset`, canvas size) after load.
- This keeps saves compact and prevents load failures tied to oversized snapshots.
- Satisfies BR-159.

## AR-024 : Tooltip interaction safety and ambient metadata exposure
- Dam tooltip uses programmatic event listeners only (no inline handlers), with one-shot listeners on open to prevent duplicate event accumulation.
- Ambient EQ remains both decorative and semantic by updating title and aria-label from live population count.
- Satisfies BR-160, BR-161, BR-162.
