# Architecture Recommendations

- **STATUS:** PASS
- **STATUS UPDATED:** 2026-05-02

---

## AR-001 : THREE.JS AS WEBGL RENDERING ENGINE

- **DECISION:** Three.js r165+ as the WebGL 2.0 rendering abstraction layer for all scene
  rendering, camera management, mesh creation, and material handling.
- **RATIONALE:** Three.js provides a mature, well-documented scene-graph API over raw WebGL 2.0,
  with built-in support for perspective and orthographic cameras, geometry primitives, shader
  materials, and a large community of aquarium and fluid-simulation reference implementations.
  Alternative considered: **Babylon.js 6.x** — equally capable but carries a heavier bundle
  (~450 KB min+gzip vs Three.js ~160 KB) and is more game-engine-oriented, adding lifecycle
  features not needed for a scene-loop application. Raw WebGL 2.0 was rejected as it would
  require rebuilding scene-graph and material management from scratch.
- **NOTES:** Renderer pixel ratio capped at `window.devicePixelRatio` with a maximum of 2.0
  to prevent GPU overload on high-DPI 4K displays. Three.js r165 requires ES2017+ browser target.
- **RELATED:** BR-001, BR-002, BR-003, BR-023, BR-024, BR-025. PT-003, PT-004, PT-005.

---

## AR-002 : CUSTOM GLSL SHADERS FOR WATER SURFACE AND CAUSTICS

- **DECISION:** Custom GLSL vertex and fragment shaders via `THREE.ShaderMaterial` for the
  animated water surface, caustic light pattern, and volumetric light-diffusion effect.
- **RATIONALE:** `THREE.MeshStandardMaterial` with normal maps produces static or mildly animated
  water but cannot achieve time-varying caustic projection patterns or sub-surface light scatter
  without custom shader code. Alternative considered: **GLSL procedural noise libraries such as
  glslify + glsl-noise** — useful for noise generation but require a build-step integration that
  adds complexity without significant visual gain over a hand-tuned caustic shader using scrolling
  UV offsets and Perlin noise written inline. The inline approach is selected for simplicity and
  reproducibility.
- **NOTES:** Shader uniforms must include `uTime` (float, seconds elapsed) and `uCausticIntensity`
  (float, 0–1). Water surface vertex shader displaces Y-axis vertices using sin/cos wave functions.
  Caustic fragment shader uses layered UV-offset noise to project light patterns onto the substrate.
- **RELATED:** BR-002, BR-011. PT-005.

---

## AR-003 : 2D EULERIAN VELOCITY GRID FOR FLUID SIMULATION

- **DECISION:** A 2D grid-based Eulerian velocity field (64×64 cells mapped to tank XZ plane)
  updated each frame via semi-Lagrangian advection to simulate water currents, bubble-driven
  turbulence, and fish-wake disturbances.
- **RATIONALE:** Full 3D Navier–Stokes is computationally infeasible in a browser game loop at
  60 FPS. Particle-based SPH provides more accurate local interactions but requires O(n²) neighbour
  search without a spatial hash, making it too costly for the particle counts required.
  Alternative considered: **Simple sinusoidal current animation** (constant directional field) —
  visually insufficient for bubbler-localised effects and fish-wake responses. The 2D Eulerian
  grid provides perceptually convincing current variation at O(grid_cells) per frame, which is
  well within budget.
- **NOTES:** Grid resolution is 64×64 by default; configurable at initialisation. Velocity decays
  toward zero each frame (damping coefficient 0.985) to simulate viscosity. Fish wakes inject a
  velocity impulse at the fish's position each movement tick. Bubbler injects upward velocity
  in a column above the emitter position.
- **RELATED:** BR-011, BR-012, BR-026, BR-027, BR-028, BR-031. PT-006, PT-007, PT-008, PT-013.

---

## AR-004 : REYNOLDS BOID STEERING BEHAVIOURS FOR FISH AI

- **DECISION:** Craig Reynolds' weighted steering behaviour composition (seek, flee, wander,
  separation, cohesion, alignment, obstacle avoidance) implemented per-fish with species-specific
  parameter weights, using a spatial grid for neighbour lookup.
- **RATIONALE:** A finite-state machine produces mechanical, predictable movement unsuitable for
  the "living ecology" theme. Full path-finding (A*) is unnecessary for an open-water environment.
  Alternative considered: **Simple procedural oscillation** (sinusoidal position update) — produces
  the correct visual motion for a single species but cannot model interspecies shoaling/avoidance or
  obstacle routing. Reynolds steering behaviours are the established simulation standard for this
  domain and produce the three distinct movement styles required by BR-014 through
  species-specific weight tuning.
- **NOTES:** Species parameter sets define: max speed, wander radius, separation distance, cohesion
  weight, alignment weight. Incompatible species pairs are defined in a species compatibility table
  checked at population initialisation. Population cap is a configurable constant defaulting to 20
  fish.
- **RELATED:** BR-013, BR-014, BR-015, BR-017. PT-009, PT-010, PT-011.

---

## AR-005 : TYPESCRIPT + VITE AS APPLICATION FRAMEWORK AND BUILD TOOL

- **DECISION:** Vanilla TypeScript 5.x with Vite 5.x as the build tool and development server.
  No UI component framework (no React, Vue, or Angular).
- **RATIONALE:** The application is canvas-first: the DOM surface is minimal (HUD overlay
  elements only). React with `react-three-fiber` adds ~45 KB of React runtime and a reconciler
  loop that runs in parallel with the Three.js render loop, creating unnecessary overhead.
  Vue.js and Solid.js have the same mismatch. Alternative considered: **Webpack 5** — more
  configuration overhead with no significant benefit over Vite for a single-entry-point application.
  Vite 5 provides fast HMR, ES module native dev-server, and a Rollup-based production build with
  code splitting and content-hashing out of the box.
- **NOTES:** TypeScript `strict` mode enabled. Build target: `es2020`. Output: `./build/` (single
  `index.html` + hashed JS/CSS/asset bundles). `tsconfig.json` `moduleResolution` set to `bundler`.
- **RELATED:** BR-001, BR-023, BR-024, BR-025. PT-002, PT-019.

---

## AR-006 : HOWLER.JS FOR AUDIO MANAGEMENT

- **DECISION:** Howler.js 2.x as the cross-browser audio abstraction over the Web Audio API for
  all ambient sound playback, enabling/disabling, and volume control.
- **RATIONALE:** The raw Web Audio API requires manual handling of browser autoplay policies,
  AudioContext suspension/resumption, and iOS Safari quirks. Alternative considered: **Tone.js** —
  a synthesis and scheduling library designed for musical composition, which is significant
  over-engineering for ambient looping audio. Howler.js provides a minimal API (`play`, `stop`,
  `volume`, `loop`) with built-in iOS and autoplay-policy handling.
- **NOTES:** All audio assets are MP3 with OGG fallback. Audio files stored under
  `./build/assets/audio/`. Howler autoplay is gated on first user gesture as required by browsers.
- **RELATED:** BR-006. PT-014.

---

## AR-007 : SINGLETON APPSTATE FOR SESSION STATE

- **DECISION:** A plain TypeScript singleton class `AppState` holding all mutable session
  configuration (camera mode, substrate type, active decorations, audio enabled, population count,
  bubbler rate) with typed getter/setter methods and a simple observer list for change notification.
- **RATIONALE:** Reactive state libraries (Zustand, MobX, Jotai) are designed for component-tree
  re-rendering, not for notifying a game-loop render function. Alternative considered:
  **LocalStorage-backed persistence** — out of scope per BR-009 (session-only persistence is
  required; cross-session save is not). The singleton pattern avoids global variable sprawl while
  keeping state access synchronous and zero-dependency.
- **NOTES:** `AppState` is initialised with default values on first call. Changes to camera mode
  or environment configuration are propagated to `SceneManager` via registered callbacks. No
  async operations in the state layer.
- **RELATED:** BR-004, BR-005, BR-007, BR-008, BR-009, BR-029. PT-017.

---

## AR-008 : POINTER EVENTS API AND HAMMERJS FOR INPUT HANDLING

- **DECISION:** Native DOM Pointer Events API for mouse and basic touch input, augmented with
  HammerJS 2.x for multi-touch gesture recognition (pinch, pan/drag).
- **RATIONALE:** Pointer Events unify mouse and single-touch interactions in modern browsers,
  removing the need to maintain parallel `mousedown`/`touchstart` handlers. Alternative considered:
  **Raw TouchEvent API** — requires manual multi-touch tracking, is not unified with mouse events,
  and has documented cross-browser differences on iOS. HammerJS 2.x provides a stable `pinch`
  and `pan` recogniser API with configurable thresholds.
- **NOTES:** All canvas interaction events are registered on the canvas element, not the window,
  to prevent scroll interference. `pointerdown` on the canvas captures the pointer for drag
  continuity. HammerJS is applied only to the canvas element.
- **RELATED:** BR-016, BR-018, BR-020, BR-021, BR-022, BR-032, BR-033, BR-034. PT-015.

---

## AR-009 : RAF GAME LOOP WITH DELTA-TIME CAPPING AND PIXEL RATIO LIMIT

- **DECISION:** `requestAnimationFrame` (rAF) game loop with delta-time capping at 100 ms
  (prevents physics explosion after tab switch) and `renderer.setPixelRatio` capped at 2.0.
- **RATIONALE:** `setInterval` timing is deprioritised by browsers in background tabs and produces
  variable delta-time under load. Alternative considered: **Fixed-timestep loop with accumulator**
  (standard for physics simulations) — adds complexity without visible benefit for a simulation
  that tolerates visual approximation; delta-time capping achieves the same stability guarantee
  with simpler code. Pixel ratio cap prevents the GPU from rendering at 4× native resolution on
  Retina 4K displays, which would fail the 30 FPS lower-end requirement (BR-024).
- **NOTES:** Delta-time cap: `dt = Math.min(rawDt, 0.1)`. Pixel ratio cap: `Math.min(window.devicePixelRatio, 2)`.
  FPS counter written to a debug overlay (hidden in production builds).
- **RELATED:** BR-023, BR-024, BR-025. PT-003.

---

## AR-010 : PBR MATERIAL SYSTEM FOR PHOTOREALISTIC FISH RENDERING

- **DECISION:** `THREE.MeshStandardMaterial` with UV-mapped procedural scale texture (generated
  via GLSL fragment shader into a `THREE.DataTexture`), translucent fin overlay mesh using
  `THREE.MeshStandardMaterial` with `transparent: true` and `opacity: 0.3–0.5`, and a dedicated
  PBR eye material with a high-roughness iris and low-roughness specular highlight using an
  `alphaMap` to isolate the highlight zone.
- **RATIONALE:** `THREE.MeshStandardMaterial` supports roughness, metalness, and transparency
  maps out of the box, enabling PBR lighting without custom shaders for the fish body and fins.
  Procedural scale texture via `DataTexture` avoids the need to bundle large texture atlases
  while allowing per-species colour variation through shader uniforms. Alternative considered:
  **`.gltf` with embedded textures** — achieves higher visual fidelity but requires large binary
  assets (100–500 KB per species) and a content pipeline; rejected in favour of runtime procedural
  generation to keep bundle size within AR-005 constraints.
- **NOTES:** Fin meshes are separate `THREE.Mesh` children parented to the fish `Object3D`
  hierarchy. The `uScaleFrequency` and `uScaleAmplitude` uniforms on the scale texture shader
  allow per-species scale appearance. Eye specular is a white disc at UV position (0.3, 0.7)
  with roughness 0.0.
- **RELATED:** BR-038, BR-039. PT-020, PT-021.

---

## AR-011 : SKELETAL ANIMATION SYSTEM FOR SPECIES-AUTHENTIC LOCOMOTION

- **DECISION:** Runtime bone-chain skeletal animation using `THREE.Skeleton` and
  `THREE.SkinnedMesh`, with a custom `FishAnimator` class managing three `AnimationClip`
  instances per species (idle, cruise, burst) and a `THREE.AnimationMixer` for crossfade
  transitions. The C-start escape clip is a fourth clip triggered by a proximity event and
  crossfaded into the burst clip after completion.
- **RATIONALE:** `THREE.AnimationMixer` with `AnimationAction.crossFadeTo()` provides
  built-in blend-weight interpolation between locomotion states, enabling smooth idle→cruise→burst
  transitions without writing a custom blending system. Alternative considered: **morph-target
  (blendshape) animation** — achieves similar visual results for fish body undulation but requires
  pre-baked per-vertex deltas at multiple keyframes, producing larger geometry data and less
  flexible runtime parameterisation of amplitude and frequency. Rejected in favour of bone chain
  which allows runtime scaling of bone rotation amplitudes to drive the three speed-state
  transitions from shared keyframe data.
- **NOTES:** Bone chain layout: 8 bones along the spine (root at head, tip at tail), 2 pectoral
  fin bones per side, 1 dorsal fin bone. Idle/cruise/burst clips differ in rotation amplitude
  per spine bone. C-start clip bends bones 3–8 to a maximum lateral angle in frame 0 then
  releases. `FishAnimator.setSpeedState(state)` triggers crossfades. Proximity detection calls
  `FishAnimator.triggerCStart()`.
- **RELATED:** BR-041, BR-042, BR-043, BR-044. PT-022.

---

## AR-012 : CRAB ENTITY WITH PROCEDURAL IK LEG ANIMATION

- **DECISION:** Eight-leg crab entity implemented as a `THREE.Object3D` hierarchy with one
  `Object3D` per leg segment (coxa, merus, carpus, dactyl — 4 segments × 8 legs = 32 nodes
  plus carapace, two claw chains of 3 nodes each). Leg positions driven by a procedural
  gait oscillator: each leg has a phase offset in a repeating cycle; when the leg's phase
  reaches the step phase, the foot target position is updated to the next step position. Claw
  idle animation is a simple sine-driven rotation on the dactyl joint. Defensive display
  triggered by a click proximity event raises the merus joint of both claw chains to a defined
  target rotation over 300 ms using `THREE.AnimationMixer` with a two-keyframe clip.
- **RATIONALE:** Procedural IK gait avoids storing keyframe animation data for 32 nodes across
  all 8 legs, which would produce a large and brittle animation clip. A gait oscillator with
  per-leg phase offsets replicates the alternating leg gait (metachronal wave) observed in real
  crabs and is parameterised by a single `gaitFrequency` value. Alternative considered:
  **pre-baked `AnimationClip` for the full crab** — rejected because editing the baked clip to
  change gait frequency or add the defensive display trigger would require regenerating all 32
  bone tracks; the procedural oscillator is more maintainable. Three.js `AnimationMixer` is
  retained for the defensive display clip only since it has a clean start/end boundary.
- **NOTES:** Carapace uses `THREE.MeshStandardMaterial` with a procedural carapace texture
  (same approach as AR-010 scale texture: GLSL fragment into `DataTexture`). Crab body dimensions:
  carapace width 80 px in world units relative to a 1000-unit tank width. Eight legs, four per
  side. Gait phase offsets: [0, π/4, π/2, 3π/4] per side, opposite phase on contralateral legs.
- **RELATED:** BR-045, BR-046, BR-047, BR-048. PT-023.

---

## AR-013 : FRONT-WINDOW CAMERA MODE

- **DECISION:** Clean front-window view mode implemented as a `THREE.OrthographicCamera` with
  frustum parameters set to frame the full tank face (width = tank width, height = tank height,
  near = 0.1, far = 2000). Camera is positioned at (tankCentreX, tankCentreY, frontZ) looking
  along −Z. Mode activation hides all HUD DOM elements by toggling `display: none` on the
  `#hud-root` container. `AppState.frontWindowMode` boolean drives the toggle. An Escape key
  handler and a corner `<button id="exit-window-btn">` restore normal state by toggling
  `AppState.frontWindowMode = false` and restoring HUD visibility.
- **RATIONALE:** `THREE.OrthographicCamera` eliminates perspective foreshortening so the tank
  face appears as a flat window, matching the aesthetic intent of UC-016. Toggling `display: none`
  on the HUD root is the simplest mechanism to hide all UI elements atomically without tracking
  individual element states. Alternative considered: **CSS opacity transition to zero on each
  UI element** — produces a fade-out effect but requires tracking all elements and re-enabling
  them individually; rejected in favour of a single container toggle for correctness and
  maintainability. Alternative considered: **perspective camera at maximum focal length** —
  approximates orthographic projection but introduces a nonzero near-clipping risk; rejected.
- **NOTES:** `AppState.frontWindowMode` is initially `false`. The exit corner button is an
  `<button>` element positioned at `position: absolute; top: 8px; right: 8px; opacity: 0.5`
  with a standard expand-arrow icon SVG. `focus-visible` styles must be present for keyboard
  accessibility. Simulation tick continues unmodified during mode transitions — only camera
  and UI layer are affected.
- **RELATED:** BR-049, BR-050, BR-051, BR-052. PT-024.

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
