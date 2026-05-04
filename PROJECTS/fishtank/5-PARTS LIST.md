# Parts List

- **STATUS:** PASS
- **STATUS UPDATED:** 2026-05-02

---

## PT-001 : HTML ENTRY POINT

- **DESCRIPTION:** Root HTML document loaded by the browser. Mounts the canvas element,
  loads the built JavaScript bundle, and provides the minimal DOM structure for the HUD overlay.
- **TECHNOLOGY RECOMMENDATIONS:** Static `index.html` authored by hand; processed and
  content-hashed by Vite 5.x at build time. Single `<canvas id="tank-canvas">` element plus
  a `<div id="hud-root">` overlay container.
- **NOTES:** No server-side rendering. `<meta name="viewport" content="width=device-width,
  initial-scale=1.0">` required for mobile scaling. Character encoding: UTF-8.
- **RELATED:** AR-005. BR-001, BR-003.

---

## PT-002 : APPLICATION BOOTSTRAP

- **DESCRIPTION:** TypeScript entry-point module that initialises all subsystems in dependency
  order, starts the rAF game loop, and wires subsystem references together.
- **TECHNOLOGY RECOMMENDATIONS:** `src/main.ts` — TypeScript 5.x strict mode. Imports and
  initialises: `Renderer`, `SceneManager`, `AppState`, `InputManager`, `AudioManager`,
  `FishManager`, `FluidGrid`, `ParticleSystem`, `BubbleSystem`, `PlantSystem`, `HUD`.
- **NOTES:** No side-effects at module scope outside the single `main()` async function.
  Bootstrap sequence: Renderer → SceneManager → AppState → subsystems → InputManager → HUD →
  start loop.
- **RELATED:** AR-005. BR-001.

---

## PT-003 : WEBGL RENDERER WRAPPER

- **DESCRIPTION:** Wraps `THREE.WebGLRenderer` configuration, pixel ratio capping, resize
  handling, and the rAF game loop with delta-time capping.
- **TECHNOLOGY RECOMMENDATIONS:** `src/renderer/Renderer.ts` — TypeScript class using
  `THREE.WebGLRenderer` (Three.js r165+). `setPixelRatio(Math.min(window.devicePixelRatio, 2))`.
  `setSize(window.innerWidth, window.innerHeight)`. ResizeObserver on the canvas element.
  Delta-time cap: `Math.min(rawDt, 0.1)`.
- **NOTES:** Exposes a `tick(dt: number): void` callback registration API. Does not own the
  scene or camera — those belong to `SceneManager`.
- **RELATED:** AR-001, AR-009. BR-001, BR-023, BR-024, BR-025.

---

## PT-004 : SCENE MANAGER

- **DESCRIPTION:** Manages the Three.js scene graph, active camera, environment mesh objects
  (tank glass, substrate, decorations), and responds to `AppState` configuration changes.
- **TECHNOLOGY RECOMMENDATIONS:** `src/renderer/SceneManager.ts` — TypeScript class holding
  a `THREE.Scene`, a `THREE.PerspectiveCamera` (3/4 mode) and a `THREE.OrthographicCamera`
  (isometric mode). Camera swap on `AppState.cameraMode` change. Substrate swap via
  `THREE.MeshStandardMaterial` texture replacement.
- **NOTES:** All environment mesh geometry is generated procedurally (box for tank glass,
  plane for substrate, imported GLTF for shipwreck/decorations). GLTF assets stored under
  `./build/assets/models/`.
- **RELATED:** AR-001, AR-007. BR-004, BR-005, BR-007, BR-008.

---

## PT-005 : GLSL SHADER FILES

- **DESCRIPTION:** Vertex and fragment GLSL shaders implementing the animated water surface
  displacement, caustic light projection, and underwater light-diffusion effect.
- **TECHNOLOGY RECOMMENDATIONS:** Three files under `src/renderer/shaders/`:
  `water.vert` (vertex — Y-axis displacement via sin/cos wave functions, `uTime` uniform),
  `water.frag` (fragment — surface colour, Fresnel rim, transparency),
  `caustics.frag` (fragment — layered UV-offset Perlin noise for caustic pattern projection
  onto substrate mesh, uniforms: `uTime`, `uCausticIntensity`).
  Applied via `THREE.ShaderMaterial` instances.
- **NOTES:** Shaders imported as raw strings using Vite's `?raw` import suffix. Uniform
  `uTime` updated each frame in the render loop. GLSL version: `#version 300 es` (WebGL 2.0).
- **RELATED:** AR-002. BR-002, BR-011.

---

## PT-006 : FLUID VELOCITY GRID

- **DESCRIPTION:** 2D Eulerian grid (64×64 cells) storing X and Z velocity components per
  cell, updated each frame via semi-Lagrangian advection and velocity decay.
- **TECHNOLOGY RECOMMENDATIONS:** `src/simulation/FluidGrid.ts` — TypeScript class using
  two `Float32Array` buffers (current and previous velocity fields). Semi-Lagrangian advection
  via bilinear interpolation. Velocity decay coefficient 0.985 per frame. Public API:
  `addImpulse(x, z, vx, vz, radius)`, `sample(x, z): {vx, vz}`, `step(dt)`.
- **NOTES:** Grid maps to tank XZ dimensions. Cell size = tankWidth / 64. Boundary cells
  clamped to zero velocity (no-slip walls). Fish and bubble systems call `addImpulse` each tick.
- **RELATED:** AR-003. BR-011, BR-012, BR-026, BR-028, BR-031.

---

## PT-007 : PARTICLE SYSTEM

- **DESCRIPTION:** Manages dust, sediment, and food-debris particles — their spawn, drift
  (sampled from `FluidGrid`), gravity settlement, and despawn lifecycle.
- **TECHNOLOGY RECOMMENDATIONS:** `src/simulation/ParticleSystem.ts` — TypeScript class using
  a `THREE.Points` object with a `THREE.BufferGeometry` (position, opacity, size attributes,
  updated in-place each frame). Maximum 500 active particles. Particle velocity = fluid grid
  sample + downward gravity component (0.02 units/s²). Despawn on Y ≤ substrate level or after
  `maxLifetime` seconds (configurable, default 30 s for dust, 8 s for food).
- **NOTES:** Food particles are a sub-class with an additional `isFood: boolean` flag so
  `FishManager` can query nearby food. Particle pool pre-allocated at init to avoid GC pressure.
- **RELATED:** AR-003. BR-011, BR-019, BR-027.

---

## PT-008 : BUBBLE SYSTEM

- **DESCRIPTION:** Emits bubble particles from the bubbler position, simulates buoyant rise
  with horizontal drift, size variation, and surface pop; injects upward velocity impulse
  into `FluidGrid`.
- **TECHNOLOGY RECOMMENDATIONS:** `src/simulation/BubbleSystem.ts` — TypeScript class.
  Bubble geometry: `THREE.SphereGeometry` instances batched in an `THREE.InstancedMesh`
  (max 200 instances). Radius per bubble: random in range [0.01, 0.05] (scene units mapping
  to 1–5 mm). Rise velocity: 0.3–0.6 units/s upward + `±0.05` horizontal noise per frame.
  Pop: remove instance when Y ≥ water-surface Y; emit a 4-particle splash `ParticleSystem` burst.
  Emission rate: driven by `AppState.bubblerRate` (30–200 bubbles/min).
- **NOTES:** `BubbleSystem.step(dt)` calls `FluidGrid.addImpulse` at the bubble column
  centre each frame with upward vz proportional to active bubble count.
- **RELATED:** AR-003. BR-010, BR-029, BR-030, BR-031.

---

## PT-009 : FISH AGENT

- **DESCRIPTION:** Represents a single fish entity: position, velocity, species parameters,
  current steering state, and mesh reference. Computes weighted steering force each tick.
- **TECHNOLOGY RECOMMENDATIONS:** `src/fish/FishAgent.ts` — TypeScript class. Steering
  behaviours implemented as methods returning `THREE.Vector3` force vectors:
  `seek(target)`, `wander()`, `separate(neighbours[])`, `align(neighbours[])`,
  `cohese(neighbours[])`, `avoidObstacles(obstacles[])`. Final force = weighted sum clamped
  to `species.maxForce`. Velocity integration: Euler with `dt`. Mesh is a `THREE.Mesh` with
  species-specific geometry/material from `FishSpecies`.
- **NOTES:** Fish orientation updated each frame via `mesh.lookAt(position + velocity)`.
  Wake impulse injected into `FluidGrid` at fish position each tick.
- **RELATED:** AR-004. BR-014, BR-015, BR-017.

---

## PT-010 : FISH SPECIES CONFIGURATION

- **DESCRIPTION:** Static data records defining per-species visual appearance and behaviour
  parameters: max speed, wander radius, separation distance, cohesion weight, alignment weight,
  geometry dimensions, and material colour.
- **TECHNOLOGY RECOMMENDATIONS:** `src/fish/FishSpecies.ts` — TypeScript `const` record map
  keyed by species ID string. Each record typed as `FishSpeciesConfig` interface. Minimum four
  species defined: `clownfish`, `angelfish`, `tetra`, `gourami`. Compatibility exclusion table
  as a `Set<string>` of incompatible pair keys.
- **NOTES:** Geometry: `THREE.ConeGeometry` oriented along X-axis for simplified fish shape
  (art-quality 3D models are a Stage 8 asset concern if applicable). Species file is the single
  source for all per-species constants — no magic numbers in `FishAgent.ts`.
- **RELATED:** AR-004. BR-013, BR-014, BR-015.

---

## PT-011 : FISH MANAGER

- **DESCRIPTION:** Owns the population array of `FishAgent` instances, handles initialisation
  (species mix selection, compatibility check), spatial grid for neighbour lookup, and per-frame
  update dispatch.
- **TECHNOLOGY RECOMMENDATIONS:** `src/fish/FishManager.ts` — TypeScript class. Spatial
  partition: uniform grid with cell size = 2× max separation distance, rebuilt each frame via
  `Array.fill` + index insertion (O(n)). Population initialised from `AppState.populationCount`
  (default 10, max 20). `FishManager.update(dt)` iterates all agents, queries neighbours from
  spatial grid, calls `FishAgent.steer(neighbours, obstacles, fluidGrid)`, integrates position.
- **NOTES:** Food detection: each agent queries `ParticleSystem.getFoodNear(position, radius)`
  each tick; if food found, seek overrides wander with highest weight.
- **RELATED:** AR-004. BR-013, BR-014, BR-015, BR-017.

---

## PT-012 : ENVIRONMENT CONFIGURATION

- **DESCRIPTION:** Manages the substrate mesh texture swap and the visibility of decoration
  meshes in response to `AppState` changes.
- **TECHNOLOGY RECOMMENDATIONS:** `src/environment/EnvironmentConfig.ts` — TypeScript class.
  Substrate options: `{ sand: Texture, gravel: Texture, rock: Texture }` loaded via
  `THREE.TextureLoader` at init. Decoration meshes (`shipwreck`, `rocks`, `artifacts`) loaded
  via `THREE.GLTFLoader` at init and toggled via `mesh.visible = bool`. Registers an
  `AppState` change callback to apply updates without scene reload.
- **NOTES:** GLTF models for decorations stored at `./build/assets/models/`. Obstacle
  bounding boxes extracted from decoration meshes and passed to `FishManager` at init.
- **RELATED:** AR-007. BR-007, BR-008, BR-009.

---

## PT-013 : PLANT SYSTEM

- **DESCRIPTION:** Manages procedurally placed plant meshes whose vertices are displaced each
  frame based on the local fluid velocity sampled from `FluidGrid` at the plant base position.
- **TECHNOLOGY RECOMMENDATIONS:** `src/environment/PlantSystem.ts` — TypeScript class.
  Plant mesh: `THREE.TubeGeometry` spline segments (3–6 per plant, 4–8 plants). Each frame,
  sample `FluidGrid.sample(plantBase.x, plantBase.z)`; apply lateral vertex displacement to
  top segments via `geometry.attributes.position` mutation + `needsUpdate = true`. Displacement
  magnitude clamped to `[−0.15, 0.15]` scene units to prevent visual instability.
- **NOTES:** Plants initialised at random substrate positions avoiding decoration bounding boxes.
  Slow growth/decay cycle (visual only): plant height oscillates ±10% over a 120-second sine
  period.
- **RELATED:** AR-003. BR-012, BR-026, BR-028.

---

## PT-014 : AUDIO MANAGER

- **DESCRIPTION:** Wraps Howler.js 2.x to load, loop, and control ambient audio tracks and
  respond to `AppState.audioEnabled` changes.
- **TECHNOLOGY RECOMMENDATIONS:** `src/audio/AudioManager.ts` — TypeScript class importing
  `howler` npm package (2.x). Loads two audio files: `ambient-underwater.mp3` and
  `ambient-bubbles.mp3` as looping `Howl` instances. `enable()` calls `.play()` on both;
  `disable()` calls `.stop()`. Volume levels: underwater 0.6, bubbles 0.4.
- **NOTES:** `AudioManager.init()` must be called inside a user-gesture handler (first
  click/tap) to satisfy browser autoplay policy. Audio files stored under
  `./build/assets/audio/`. OGG fallback files must be present alongside MP3.
- **RELATED:** AR-006. BR-006.

---

## PT-015 : INPUT MANAGER

- **DESCRIPTION:** Captures Pointer Events on the canvas element and HammerJS gestures for
  pinch/pan, translates them into semantic game actions, and dispatches to registered handlers.
- **TECHNOLOGY RECOMMENDATIONS:** `src/input/InputManager.ts` — TypeScript class. Registers
  `pointerdown`, `pointermove`, `pointerup` on the canvas element. Uses `canvas.setPointerCapture`
  on `pointerdown` for drag continuity. Constructs a HammerJS 2.x `Manager` on the canvas with
  `Pinch` and `Pan` recognisers enabled. Dispatches typed action events:
  `FeedAction { x, z }`, `SelectAction { screenX, screenY }`, `ZoomAction { scale }`,
  `DragFeedAction { x, z }`.
- **NOTES:** Ray-casting for `SelectAction` performed in `SceneManager` using
  `THREE.Raycaster`. HammerJS CDN import avoided — use npm package `hammerjs` 2.x with
  TypeScript types from `@types/hammerjs`.
- **RELATED:** AR-008. BR-016, BR-018, BR-020, BR-021, BR-022, BR-032, BR-033, BR-034.

---

## PT-016 : HUD OVERLAY

- **DESCRIPTION:** DOM-based HUD rendered as absolutely positioned `<div>` elements over the
  canvas, containing the camera mode toggle, substrate selector, decoration toggles, audio
  toggle, and selection info card.
- **TECHNOLOGY RECOMMENDATIONS:** `src/ui/HUD.ts` — TypeScript class that creates and manages
  DOM elements via `document.createElement`. No HTML template engine or component framework.
  Camera mode: two `<button>` elements updating `AppState.cameraMode`. Substrate: `<select>`
  element updating `AppState.substrateType`. Decoration toggles: `<input type="checkbox">`
  elements per decoration. Audio: `<button>` toggling `AppState.audioEnabled`. Selection card:
  a `<div id="selection-card">` shown/hidden on fish/decoration selection events.
- **NOTES:** HUD styles defined in `src/ui/hud.css` (inlined by Vite). All HUD event listeners
  use `addEventListener` with explicit `{ passive: true }` where applicable.
- **RELATED:** AR-007, AR-008. BR-003, BR-004, BR-006, BR-007, BR-008, BR-020, BR-021.

---

## PT-017 : APP STATE SINGLETON

- **DESCRIPTION:** Typed singleton holding all mutable session configuration and providing
  typed setters that notify registered callbacks.
- **TECHNOLOGY RECOMMENDATIONS:** `src/state/AppState.ts` — TypeScript class with a private
  constructor and a `static instance()` factory. Stored fields:
  `cameraMode: 'isometric' | '3/4'`,
  `substrateType: 'sand' | 'gravel' | 'rock'`,
  `decorations: { shipwreck: boolean, rocks: boolean, artifacts: boolean }`,
  `audioEnabled: boolean`,
  `populationCount: number` (1–20),
  `bubblerRate: number` (30–200).
  Observer pattern: `subscribe(key, callback)` / `notify(key)`.
- **NOTES:** Default values: `cameraMode = 'isometric'`, `substrateType = 'sand'`,
  all decorations `true`, `audioEnabled = false`, `populationCount = 10`,
  `bubblerRate = 60`. No persistence to LocalStorage.
- **RELATED:** AR-007. BR-004, BR-007, BR-008, BR-009, BR-029.

---

## PT-018 : VITE BUILD CONFIGURATION

- **DESCRIPTION:** Vite 5.x project configuration defining entry point, output directory,
  build target, asset handling, and TypeScript integration.
- **TECHNOLOGY RECOMMENDATIONS:** `vite.config.ts` at project root. Configuration:
  `build.outDir = './build'`, `build.target = 'es2020'`, `build.assetsDir = 'assets'`,
  `build.rollupOptions.input = 'index.html'`. Plugin: `@vitejs/plugin-basic-ssl` not included
  (HTTPS not required for local dev). TypeScript path aliases configured via `resolve.alias`
  mapping `@/` to `src/`.
- **NOTES:** `vite.config.ts` must remain at the project root (same level as `package.json`).
  `package.json` scripts: `dev` → `vite`, `build` → `vite build`, `preview` → `vite preview`.
  Dependencies in `package.json`: `three`, `howler`, `hammerjs`. Dev dependencies:
  `vite`, `typescript`, `@types/three`, `@types/howler`, `@types/hammerjs`.
- **RELATED:** AR-005. BR-001.

---

## PT-019 : SCALE TEXTURE SHADER

- **DESCRIPTION:** GLSL fragment shader that generates a procedural fish-scale UV pattern at
  runtime, rendered into a `THREE.DataTexture` and assigned as the `map` on fish body materials.
  Accepts uniforms `uScaleFrequency`, `uScaleAmplitude`, `uBaseColour`, and `uHighlightColour`.
- **TECHNOLOGY RECOMMENDATIONS:** `src/fish/ScaleTextureShader.ts` — TypeScript module that
  creates a `THREE.WebGLRenderTarget` (256×256), renders the shader once per species, and
  returns the `THREE.Texture` for assignment to `MeshStandardMaterial.map`. Shader implemented
  as `THREE.ShaderMaterial` with `defines.SCALE_ROWS` controlling scale row density.
- **NOTES:** Rendered once at initialisation per species, not per frame. Texture should be
  mipmapped (`texture.generateMipmaps = true`). `uHighlightColour` drives the specular-look
  scale edge highlight; actual PBR specular remains in the material roughness/metalness channels.
- **RELATED:** AR-010. BR-038.

---

## PT-020 : FIN OVERLAY MESH

- **DESCRIPTION:** Transparent `THREE.Mesh` children representing dorsal, pectoral, anal, and
  caudal fins, parented to the fish `Object3D` hierarchy and animated by the skeletal bone chain.
  Each fin mesh uses a dedicated `THREE.MeshStandardMaterial` with `transparent: true` and
  `opacity: 0.35–0.5`.
- **TECHNOLOGY RECOMMENDATIONS:** `src/fish/FishMesh.ts` — TypeScript class that creates fin
  meshes as `THREE.BufferGeometry` plane fans with UV layout matching the fin-ray line pattern.
  Material: `new THREE.MeshStandardMaterial({ transparent: true, opacity: 0.4, side: THREE.DoubleSide })`.
  Fin-ray lines rendered as a second material layer via `THREE.LineSegments` at opacity 0.55.
- **NOTES:** Fin meshes are skinned with 1–2 bone influences each. `DoubleSide` required so
  fins are visible from both faces during rotation. Opacity varies per fin: dorsal 0.35, pectoral
  0.45, caudal 0.5, anal 0.35.
- **RELATED:** AR-010. BR-038.

---

## PT-021 : EYE PBR MATERIAL

- **DESCRIPTION:** `THREE.MeshStandardMaterial` configured for the fish eye sphere with a low
  roughness specular zone (the highlight disc) isolated by an `alphaMap` and a dark iris base.
- **TECHNOLOGY RECOMMENDATIONS:** `src/fish/FishMesh.ts` — eye sphere `THREE.SphereGeometry`
  radius 0.05 (relative to fish body). Material: `roughness: 0.9` on the iris zone, `roughness: 0.0`
  and `metalness: 0.1` on the highlight disc. `alphaMap` is a `THREE.DataTexture` (16×16) with
  a single white disc at UV (0.3, 0.7), alpha 1.0; all other texels alpha 0.0.
- **NOTES:** Eye sphere is a child of the fish head bone node, so it follows skeletal animation.
  Specular highlight appears at a fixed UV position regardless of lighting angle (artistic
  approximation, not physically accurate). Acceptable per BR-039.
- **RELATED:** AR-010. BR-039.

---

## PT-022 : FISH ANIMATOR

- **DESCRIPTION:** TypeScript class that manages `THREE.Skeleton`, `THREE.SkinnedMesh`, and
  `THREE.AnimationMixer` per fish entity. Exposes `setSpeedState(state: 'idle'|'cruise'|'burst')`
  and `triggerCStart()`. Internally crossfades between four `AnimationClip` instances.
- **TECHNOLOGY RECOMMENDATIONS:** `src/fish/FishAnimator.ts` — TypeScript class.
  `THREE.AnimationMixer` per fish instance. Four clips: `clip_idle`, `clip_cruise`, `clip_burst`,
  `clip_cstart`. Crossfade duration: idle→cruise 0.4 s, cruise→burst 0.2 s, burst→cruise 0.6 s.
  C-start clip duration 0.25 s; on complete, crossfades to burst.
  Pectoral fin bones: `setSpeedState` drives a separate pectoral fan/flatten lerp:
  fan angle 35° at idle, 0° at burst.
- **NOTES:** `FishAnimator.update(dt)` must be called each frame. Bone chain: 8 spine bones,
  4 pectoral fin bones (2 per side), 1 dorsal fin bone. `triggerCStart()` is called by
  `FishBehaviour` when cursor proximity event fires.
- **RELATED:** AR-011. BR-041, BR-042, BR-043, BR-044.

---

## PT-023 : CRAB ENTITY

- **DESCRIPTION:** Full crab `THREE.Object3D` hierarchy including carapace mesh, 8 leg chains
  (4 nodes per leg), 2 claw chains (3 nodes each), eye stalk nodes. Leg animation driven by
  a procedural gait oscillator. Claw idle and defensive display driven by `THREE.AnimationMixer`.
- **TECHNOLOGY RECOMMENDATIONS:** `src/scene/CrabEntity.ts` — TypeScript class.
  Carapace: `THREE.CylinderGeometry` (radiusTop 80, radiusBottom 65, height 30, radialSegments 8)
  scaled and flattened. Leg segments: `THREE.CylinderGeometry` (radius 4, height 20) per
  segment. Material: procedural carapace texture (same `DataTexture` approach as PT-019) with
  `uBaseColour = #7c3f1e`. Gait oscillator: `CrabGait` inner class with properties
  `gaitFrequency = 1.5 Hz`, per-leg phase offsets `[0, π/4, π/2, 3π/4]` × side polarity.
  Defensive display clip: `AnimationMixer` clip raising merus rotation 80° over 300 ms.
- **NOTES:** `CrabEntity.update(dt)` updates gait oscillator and mixes animations. Click
  proximity detection: `InputManager` passes world-space click position; `CrabEntity.onInteract()`
  triggers defensive display if click within 120 world units. Crab mounted at `y = substrate + 15`
  world units.
- **RELATED:** AR-012. BR-045, BR-046, BR-047, BR-048.

---

## PT-024 : FRONT-WINDOW CAMERA CONTROLLER

- **DESCRIPTION:** TypeScript module managing the front-window camera mode: switching between
  the normal scene camera and a `THREE.OrthographicCamera`, toggling HUD visibility, and
  wiring Escape key and corner-button exit handlers.
- **TECHNOLOGY RECOMMENDATIONS:** `src/ui/FrontWindowMode.ts` — TypeScript module.
  `THREE.OrthographicCamera` with frustum: left = −tankWidth/2, right = tankWidth/2,
  top = tankHeight/2, bottom = −tankHeight/2, near = 0.1, far = 2000. Positioned at
  `(0, 0, 500)` looking toward `(0, 0, 0)`. HUD toggle: `document.getElementById('hud-root').style.display = isActive ? 'none' : ''`.
  Exit button: `<button id="exit-window-btn">` injected at DOM bootstrap, styled
  `position:absolute; top:8px; right:8px; opacity:0.5; z-index:10`.
  Escape key: `document.addEventListener('keydown', e => e.key === 'Escape' && deactivate())`.
- **NOTES:** `AppState.frontWindowMode` is set `true` on activation and `false` on deactivation.
  Activation path: one click on a "Window Mode" button in the HUD (satisfies ≤2 interactions
  from BR-049). Camera switch via `Renderer.setCamera(cam)`. Simulation tick is not paused.
- **RELATED:** AR-013. BR-049, BR-050, BR-051, BR-052.

---

## Exit Gate

- [x] Every BR maps to at least one AR.
- [x] Every AR names a specific, concrete technology — no generic categories.
- [x] Every AR includes at least one alternative considered in RATIONALE.
- [x] Every PT has a TECHNOLOGY RECOMMENDATIONS field that names a specific choice.
- [x] AR IDs are sequential and non-reused.
- [x] PT IDs are sequential and non-reused.
- [x] RELATED fields trace AR↔BR and PT↔AR correctly.
- [x] `PIPELINE-STATUS.md` is updated for Stage 5 with STATUS and STATUS UPDATED date.
