# Release Notes

---

## RN-001 : v0.1.0 — 2026-05-01

- **CHANGED FILES:**
  - `build/package.json` — project manifest with three, howler, hammerjs and dev dependencies
  - `build/tsconfig.json` — TypeScript 5.x strict, ES2020, bundler moduleResolution, @/ path alias
  - `build/vite.config.ts` — Vite 5.x config; outDir dist, @/ alias via fileURLToPath
  - `build/index.html` — application entry point; links hud.css and src/main.ts
  - `build/src/vite-env.d.ts` — Vite client types (enables ?raw shader imports)
  - `build/src/main.ts` — 15-step bootstrap: resolves DOM, creates all systems, registers tick callbacks, starts rAF loop
  - `build/src/state/AppState.ts` — singleton observer-pattern state store; subscribe/set/get; session-only (no localStorage)
  - `build/src/renderer/Renderer.ts` — WebGLRenderer wrapper; dt cap 0.1s; pixel-ratio cap 2; ResizeObserver
  - `build/src/renderer/shaders/water.vert` — GLSL vertex shader; sine×cosine wave displacement
  - `build/src/renderer/shaders/water.frag` — GLSL fragment shader; deep/shallow colour blend, alpha
  - `build/src/renderer/shaders/caustics.frag` — GLSL fragment shader; two-layer noise caustic pattern, additive blend
  - `build/src/scene/SceneManager.ts` — Three.js scene, isometric + perspective cameras, water surface ShaderMaterial, caustic plane, ambient + directional lighting
  - `build/src/simulation/FluidGrid.ts` — 64×64 Float32Array Eulerian grid; semi-Lagrangian advection; decay 0.985; addImpulse/sample/step API
  - `build/src/scene/ParticleSystem.ts` — 500-slot pool; dust/food/sediment types; fluid-nudge on tick; getFoodParticles()
  - `build/src/scene/BubbleSystem.ts` — 200-slot InstancedMesh; BUBBLER_POS at back-left corner (-5.5, -2.8, -2.8); rate-driven spawn
  - `build/src/scene/PlantSystem.ts` — 6 TubeGeometry CatmullRom splines; fluid-driven sway via rotation.z
  - `build/src/scene/EnvironmentConfig.ts` — substrate plane (colour-reactive); 3 placeholder decorations (shipwreck box, rocks dodecahedron, artifacts box); obstacleBounds exported
  - `build/src/fish/FishSpecies.ts` — FishSpecies interface; 4 species records (clownfish, angelfish, tetra, gourami); areCompatible()
  - `build/src/fish/FishAgent.ts` — 11 steering methods; Reynolds weighted sum; wake injection into FluidGrid; food-seek override; boundary clamp
  - `build/src/fish/FishManager.ts` — spatial grid (2.5-unit cells); neighbour lookup; population init from AppState; compatibility warning
  - `build/src/audio/AudioManager.ts` — Howler.js singleton; gesture-gate via init(); ambient/feed/bubble slots; setEnabled()
  - `build/src/input/InputManager.ts` — Pointer Events API (pointerdown/move/up, setPointerCapture); HammerJS Pinch/Pan; typed GameAction dispatch; 0.8 s feed cooldown
  - `build/src/ui/HUD.ts` — DOM controls panel (camera, substrate, decorations, population, audio, bubbler-rate); selection card
  - `build/src/ui/hud.css` — dark-theme panel; CSS for controls, buttons, sliders, selection card
  - `build/public/audio/ambient.mp3` — placeholder zero-byte audio asset
  - `build/public/audio/ambient.ogg` — placeholder zero-byte audio asset
  - `build/public/audio/feed.mp3` — placeholder zero-byte audio asset
  - `build/public/audio/feed.ogg` — placeholder zero-byte audio asset
  - `build/public/audio/bubble.mp3` — placeholder zero-byte audio asset
  - `build/public/audio/bubble.ogg` — placeholder zero-byte audio asset

- **IMPLEMENTATION CAVEATS:**
  - Audio assets are zero-byte placeholders. Real MP3/OGG files must be supplied before audio functionality can be verified.
  - ~~GLSL shaders are written for Vite's ?raw import pipeline; they are not valid standalone GLSL 300 es files when treated as Three.js ShaderMaterial source (Three.js injects its own `#version` and precision pragmas). The `#version 300 es` and `precision` lines should be removed from the shader source if Three.js WebGL2 mode conflicts. Functional test will confirm at Stage 10.~~ **RESOLVED at Stage 10 (RES-001):** All three shaders converted to Three.js standard ShaderMaterial style (`varying`/`gl_FragColor`). Zero runtime shader errors confirmed in verified test run.
  - The Vite chunk size warning (>500 kB) is a bundler advisory; it does not block the build.
  - `areCompatible()` warns to console only; no in-app enforcement of species removal.

- **UC/BR COVERAGE:**
  - UC-001 (view tank), UC-002 (camera modes), UC-003 (feed fish), UC-004 (fish behaviour), UC-005 (fluid simulation), UC-006 (decorations), UC-007 (substrate), UC-008 (bubbler), UC-009 (plants), UC-010 (audio), UC-011 (population control), UC-012 (species selection)
  - BR-001–BR-037 (all 37 requirements addressed)

- **NOTES:**
  - `npm run dev` and `npm run build` must be run from `PROJECTS/example/build/` (not the project root).
  - Tester should verify: rAF loop starts, fish render and move, HUD controls respond, fluid grid drives plant sway and particle drift, bubbles spawn from back-left corner.
  - ~~GLSL shader `#version 300 es` pragma may need to be removed for Three.js r165 WebGL2 renderer — confirm at Stage 10.~~ **RESOLVED at Stage 10 (RES-001).** Shaders converted to standard Three.js ShaderMaterial syntax.
  - Selection card `showSelectionCard('fish', id)` populates name only; description lookup from `7-TEXT-CONTENT.md` TC-006 data not wired (out of DI scope).

---

## v0.2.0 — DI-019–DI-022 Implementation — 2026-05-02

### Summary
Photorealistic PBR fish rendering, species-authentic skeletal swimming animations, photorealistic crab entity with C-start fright response, and front-window orthographic view mode.

### Changed Files
| File | Action | DI |
|------|--------|-----|
| `src/fish/ScaleTextureShader.ts` | **NEW** — GPU-rendered procedural fish scale texture via ShaderMaterial + WebGLRenderTarget | DI-019 |
| `src/fish/FishMesh.ts` | **NEW** — PBR multi-part fish body (body, fins, eye, specular highlight) using generated scale texture | DI-019 |
| `src/fish/FishAnimator.ts` | **NEW** — AnimationMixer-based skeletal animator; idle/cruise/burst sine-wave clips; C-start escape clip; pectoral bone angle per state | DI-020 |
| `src/fish/FishAgent.ts` | **MODIFIED** — Replaced ConeGeometry with SkinnedMesh+buildBoneChain; added FishAnimator instance; speed-state transitions; checkCursorProximity for C-start trigger | DI-020 |
| `src/fish/FishManager.ts` | **MODIFIED** — Added cursorWorld tracking, `setCursorWorld()`, calls `checkCursorProximity` each tick | DI-020 |
| `src/scene/CrabEntity.ts` | **NEW** — Procedural crab: carapace CylinderGeometry, 4-per-side leg chains, claw merus bones; sine-gait locomotion; defense AnimationClip; `onInteract()` | DI-021 |
| `src/scene/SceneManager.ts` | **MODIFIED** — Instantiates CrabEntity at substrate; calls `crab.update(dt)`; adds `setActiveCamera()` and `defaultCamera` getter | DI-021, DI-022 |
| `src/state/AppState.ts` | **MODIFIED** — Added `frontWindowMode: boolean` to `AppStateData` and `DEFAULTS` | DI-022 |
| `src/ui/FrontWindowMode.ts` | **NEW** — `initFrontWindowMode(appState, sceneManager)`: front-facing PerspectiveCamera; overlay indicator; exit button; AppState `frontWindowMode` subscription | DI-022 |
| `src/ui/HUD.ts` | **MODIFIED** — Added `#btn-window-mode` button; wired click → `state.set('frontWindowMode', true)` | DI-022 |
| `src/input/InputManager.ts` | **MODIFIED** — Added THREE import; `setFishManager()`; on pointer: `crab.onInteract()` + `fishManager.setCursorWorld()` | DI-021, DI-022 |
| `src/main.ts` | **MODIFIED** — Import `initFrontWindowMode`; call `input.setFishManager(fishManager)`; call `initFrontWindowMode(state, sceneManager)` | DI-021, DI-022 |

### UC/BR Coverage (new in v0.2.0)
- UC-013 (photorealistic rendering) — BR-038–BR-041
- UC-014 (species-authentic swimming) — BR-042–BR-046
- UC-015 (photorealistic crab) — BR-047–BR-050
- UC-016 (front-window view mode) — BR-051–BR-052

### Notes
- `buildBoneChain()` uses world units (body length ≈ 0.35 × species.scale / 0.12). DI pixel-scale values were converted.
- `FrontWindowMode` wires to `SceneManager.setActiveCamera()` (not `Renderer.setCamera()`); render call remains in `SceneManager.tick()`.
- C-start COOLDOWN = 3 s; threshold = 0.8 world units; resets to burst state after 0.25 s bend clip.
- Crab clamp: ±(TANK_W/2 − 0.8) = ±5.2 units; walk reversal period = 4 s.
- Scale texture is rendered to a 256×256 WebGLRenderTarget at agent construction; disposed with scene.
