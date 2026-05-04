# Design Instructions

- **STATUS:** PASS
- **STATUS UPDATED:** 2026-05-02

---

## DI-001 : PROJECT SCAFFOLD AND BUILD CONFIGURATION

- **SUMMARY:** Create the project directory structure, `package.json`, `tsconfig.json`,
  `vite.config.ts`, and `index.html` so that `npm run dev` and `npm run build` succeed on a
  clean checkout.
- **IMPLEMENTATION STEPS:**
  1. Create `package.json` at `PROJECTS/fishtank/` with the following exact content:
     ```json
     {
       "name": "fish-tank-simulator",
       "version": "0.1.0",
       "private": true,
       "scripts": {
         "dev": "vite",
         "build": "vite build",
         "preview": "vite preview"
       },
       "dependencies": {
         "hammerjs": "^2.0.8",
         "howler": "^2.2.4",
         "three": "^0.165.0"
       },
       "devDependencies": {
         "@types/hammerjs": "^2.0.45",
         "@types/howler": "^2.2.11",
         "@types/three": "^0.165.0",
         "typescript": "^5.4.5",
         "vite": "^5.2.11"
       }
     }
     ```
  2. Create `tsconfig.json` at `PROJECTS/fishtank/`:
     ```json
     {
       "compilerOptions": {
         "target": "ES2020",
         "module": "ESNext",
         "moduleResolution": "bundler",
         "strict": true,
         "noEmit": true,
         "skipLibCheck": true,
         "baseUrl": ".",
         "paths": { "@/*": ["src/*"] }
       },
       "include": ["src/**/*", "vite.config.ts"]
     }
     ```
  3. Create `vite.config.ts` at `PROJECTS/fishtank/`:
     ```typescript
     import { defineConfig } from 'vite';
     import { resolve } from 'path';
     export default defineConfig({
       resolve: { alias: { '@': resolve(__dirname, 'src') } },
       build: {
         outDir: 'build',
         target: 'es2020',
         assetsDir: 'assets',
         rollupOptions: { input: resolve(__dirname, 'index.html') }
       }
     });
     ```
  4. Create `index.html` at `PROJECTS/fishtank/`:
     ```html
     <!DOCTYPE html>
     <html lang="en">
     <head>
       <meta charset="UTF-8" />
       <meta name="viewport" content="width=device-width, initial-scale=1.0" />
       <title>Fish Tank Simulator</title>
       <link rel="stylesheet" href="/src/ui/hud.css" />
     </head>
     <body>
       <canvas id="tank-canvas"></canvas>
       <div id="hud-root"></div>
       <script type="module" src="/src/main.ts"></script>
     </body>
     </html>
     ```
  5. Create the following empty directories (with `.gitkeep` files where needed):
     `src/renderer/shaders/`, `src/simulation/`, `src/fish/`, `src/environment/`,
     `src/audio/`, `src/input/`, `src/ui/`, `src/state/`,
     `build/assets/audio/`, `build/assets/models/`, `build/concept/` (already exists),
     `build/tests/specs/`, `build/tests/results/`.
  6. After scaffold is in place, run `npm install` from `PROJECTS/fishtank/` to produce
     `node_modules/` and `package-lock.json`. Do not commit `node_modules/`.
- **SKILLSET REQUIRED:** Node.js package management, Vite 5.x configuration, TypeScript
  project setup.
- **NOTES:** All subsequent DIs assume this scaffold exists. DI-001 must complete before any
  other DI begins. The `build/` directory is the Vite output target — do not hand-write files
  directly into `build/` except for assets (`build/assets/`) and test artefacts.
- **RELATED:** BR-001. AR-005. PT-001, PT-002, PT-018.

---

## DI-002 : APP STATE SINGLETON

- **SUMMARY:** Implement `src/state/AppState.ts` — the typed singleton storing all session
  configuration with observer-pattern change notification.
- **IMPLEMENTATION STEPS:**
  1. Create `src/state/AppState.ts`.
  2. Define the `AppStateData` interface:
     ```typescript
     export interface AppStateData {
       cameraMode: 'isometric' | '3/4';
       substrateType: 'sand' | 'gravel' | 'rock';
       decorations: { shipwreck: boolean; rocks: boolean; artifacts: boolean };
       audioEnabled: boolean;
       populationCount: number;   // 1–20 inclusive
       bubblerRate: number;       // 30–200 inclusive
     }
     ```
  3. Define the default values constant:
     ```typescript
     const DEFAULTS: AppStateData = {
       cameraMode: 'isometric',
       substrateType: 'sand',
       decorations: { shipwreck: true, rocks: false, artifacts: true },
       audioEnabled: false,
       populationCount: 10,
       bubblerRate: 60,
     };
     ```
  4. Implement the `AppState` class with a private constructor and static `instance()`:
     ```typescript
     type StateKey = keyof AppStateData;
     type Callback<K extends StateKey> = (value: AppStateData[K]) => void;
     export class AppState {
       private static _instance: AppState;
       private data: AppStateData = { ...DEFAULTS, decorations: { ...DEFAULTS.decorations } };
       private listeners: Map<StateKey, Callback<any>[]> = new Map();
       private constructor() {}
       static instance(): AppState { ... }
       get<K extends StateKey>(key: K): AppStateData[K] { return this.data[key]; }
       set<K extends StateKey>(key: K, value: AppStateData[K]): void { ... notify ... }
       subscribe<K extends StateKey>(key: K, cb: Callback<K>): void { ... }
       private notify<K extends StateKey>(key: K): void { ... }
     }
     ```
  5. In `set()`: validate range constraints before assignment —
     if `key === 'populationCount'`, clamp to `[1, 20]`;
     if `key === 'bubblerRate'`, clamp to `[30, 200]`.
     After assignment, call `this.notify(key)`.
  6. In `subscribe()`: push the callback into `this.listeners.get(key) ?? []`; store back.
  7. In `notify()`: call each registered callback with the current value for that key.
     Guard against callbacks that throw — wrap each call in try/catch and log the error.
  8. Edge case: `set('decorations', ...)` receives a partial object — always merge with the
     existing `decorations` object rather than replacing it:
     ```typescript
     if (key === 'decorations') {
       this.data.decorations = { ...this.data.decorations, ...(value as object) };
     } else { this.data[key] = value; }
     ```
- **SKILLSET REQUIRED:** TypeScript generics, observer pattern.
- **NOTES:** No async code. No LocalStorage. `AppState.instance()` is safe to call before
  `main()` runs.
- **RELATED:** BR-004, BR-006, BR-007, BR-008, BR-009, BR-029. AR-007. PT-017.

---

## DI-003 : WEBGL RENDERER WRAPPER

- **SUMMARY:** Implement `src/renderer/Renderer.ts` — wraps `THREE.WebGLRenderer`, enforces
  pixel-ratio cap, handles canvas resize, and drives the rAF game loop with delta-time capping.
- **IMPLEMENTATION STEPS:**
  1. Create `src/renderer/Renderer.ts`.
  2. Import `THREE` from `'three'`.
  3. Class signature:
     ```typescript
     export class Renderer {
       readonly threeRenderer: THREE.WebGLRenderer;
       private tickCallbacks: Array<(dt: number) => void> = [];
       private lastTime = 0;
       constructor(canvas: HTMLCanvasElement) { ... }
       onTick(cb: (dt: number) => void): void { this.tickCallbacks.push(cb); }
       start(): void { requestAnimationFrame(this._loop.bind(this)); }
       private _loop(now: number): void { ... }
       private _onResize(): void { ... }
     }
     ```
  4. In `constructor`:
     - Create `THREE.WebGLRenderer({ canvas, antialias: true, alpha: false })`.
     - Call `threeRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))`.
     - Call `threeRenderer.setSize(window.innerWidth, window.innerHeight)`.
     - Create a `ResizeObserver` targeting `document.body`; on resize call `_onResize()`.
     - Enable shadow maps: `threeRenderer.shadowMap.enabled = true`,
       `threeRenderer.shadowMap.type = THREE.PCFSoftShadowMap`.
  5. In `_loop(now)`:
     - Compute `rawDt = (now - this.lastTime) / 1000`; clamp: `const dt = Math.min(rawDt, 0.1)`.
     - Update `this.lastTime = now`.
     - Call all `tickCallbacks` in registration order, passing `dt`.
     - Schedule next frame: `requestAnimationFrame(this._loop.bind(this))`.
     - Edge case: first frame — `lastTime` is 0, so `rawDt` will be large; the cap handles it.
  6. In `_onResize()`:
     - Read `window.innerWidth`, `window.innerHeight`.
     - Call `threeRenderer.setSize(w, h)`.
     - The active camera aspect update is handled by `SceneManager` (DI-004) which also
       registers a tick callback; resize notification to SceneManager is via a second
       `ResizeObserver` subscription registered by SceneManager itself.
  7. Export type `TickCallback = (dt: number) => void`.
- **SKILLSET REQUIRED:** Three.js WebGLRenderer API, `requestAnimationFrame`, ResizeObserver.
- **NOTES:** `Renderer` does not hold a reference to the scene or camera. It calls
  `threeRenderer.render(scene, camera)` — but `scene` and `camera` are passed in by
  `SceneManager` registering a tick callback that calls `renderer.threeRenderer.render(...)`.
- **RELATED:** BR-001, BR-023, BR-024, BR-025. AR-001, AR-009. PT-003.

---

## DI-004 : GLSL SHADER FILES

- **SUMMARY:** Create the three GLSL shader source files for animated water surface,
  water fragment colouring, and caustic light projection.
- **IMPLEMENTATION STEPS:**
  1. Create `src/renderer/shaders/water.vert`:
     ```glsl
     #version 300 es
     precision highp float;
     uniform float uTime;
     uniform float uWaveAmplitude;   // default 0.04
     uniform float uWaveFrequency;   // default 2.5
     in vec3 position;
     in vec2 uv;
     out vec2 vUv;
     out float vHeight;
     void main() {
       vUv = uv;
       float wave = sin(position.x * uWaveFrequency + uTime * 1.2)
                  * cos(position.z * uWaveFrequency * 0.8 + uTime * 0.9)
                  * uWaveAmplitude;
       vHeight = wave;
       vec3 displaced = position + vec3(0.0, wave, 0.0);
       gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
     }
     ```
     Note: Three.js automatically provides `projectionMatrix` and `modelViewMatrix` uniforms
     inside `ShaderMaterial` — do not redeclare them.
  2. Create `src/renderer/shaders/water.frag`:
     ```glsl
     #version 300 es
     precision highp float;
     in vec2 vUv;
     in float vHeight;
     out vec4 fragColor;
     uniform float uTime;
     void main() {
       vec3 deepColor  = vec3(0.02, 0.07, 0.18);
       vec3 shallowColor = vec3(0.05, 0.18, 0.32);
       float t = clamp(vHeight * 8.0 + 0.5, 0.0, 1.0);
       vec3 col = mix(deepColor, shallowColor, t);
       float alpha = 0.72 + vHeight * 0.3;
       fragColor = vec4(col, clamp(alpha, 0.6, 0.88));
     }
     ```
  3. Create `src/renderer/shaders/caustics.frag`:
     ```glsl
     #version 300 es
     precision highp float;
     in vec2 vUv;
     out vec4 fragColor;
     uniform float uTime;
     uniform float uCausticIntensity;  // 0.0–1.0
     float hash(vec2 p) {
       return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
     }
     float noise(vec2 p) {
       vec2 i = floor(p); vec2 f = fract(p);
       float a = hash(i); float b = hash(i + vec2(1.0, 0.0));
       float c = hash(i + vec2(0.0, 1.0)); float d = hash(i + vec2(1.0, 1.0));
       vec2 u = f * f * (3.0 - 2.0 * f);
       return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
     }
     void main() {
       vec2 uv1 = vUv * 4.0 + vec2(uTime * 0.07, uTime * 0.05);
       vec2 uv2 = vUv * 6.5 - vec2(uTime * 0.04, uTime * 0.08);
       float n = noise(uv1) * 0.6 + noise(uv2) * 0.4;
       float caustic = pow(n, 2.2) * uCausticIntensity;
       vec3 lightColor = vec3(0.45, 0.72, 0.95);
       fragColor = vec4(lightColor * caustic, caustic * 0.6);
     }
     ```
  4. The caustics shader is applied to a `THREE.PlaneGeometry` mesh placed just above the
     substrate. It uses additive blending: in the Three.js material, set
     `blending: THREE.AdditiveBlending`, `depthWrite: false`, `transparent: true`.
  5. Edge case: if `uCausticIntensity` is 0.0 the fragment outputs a zero-alpha quad —
     this is correct and produces no visual artefact.
- **SKILLSET REQUIRED:** GLSL 300 es, Three.js ShaderMaterial, procedural noise.
- **NOTES:** Shaders are imported in TypeScript using Vite's `?raw` suffix:
  `import waterVert from './shaders/water.vert?raw'`. The `projectionMatrix` and
  `modelViewMatrix` uniforms are injected by Three.js automatically when using
  `ShaderMaterial` — they must not be declared in the shader.
- **RELATED:** BR-002, BR-011. AR-002. PT-005.

---

## DI-005 : SCENE MANAGER

- **SUMMARY:** Implement `src/renderer/SceneManager.ts` — manages the Three.js scene graph,
  dual cameras, tank geometry, lighting, water surface mesh, and caustic plane.
- **IMPLEMENTATION STEPS:**
  1. Create `src/renderer/SceneManager.ts`.
  2. Class signature:
     ```typescript
     export class SceneManager {
       readonly scene: THREE.Scene;
       private isoCamera: THREE.OrthographicCamera;
       private perspCamera: THREE.PerspectiveCamera;
       private waterMesh: THREE.Mesh;
       private causticPlane: THREE.Mesh;
       private waterUniforms: { uTime: { value: number }; uWaveAmplitude: { value: number }; uWaveFrequency: { value: number } };
       private causticUniforms: { uTime: { value: number }; uCausticIntensity: { value: number } };
       constructor(renderer: Renderer, appState: AppState) { ... }
       get activeCamera(): THREE.Camera { ... }
       update(dt: number): void { ... }
       private _buildTank(): void { ... }
       private _buildLighting(): void { ... }
       private _buildWaterSurface(): void { ... }
       private _buildCausticPlane(): void { ... }
       private _onResize(w: number, h: number): void { ... }
       private _onCameraModeChange(mode: 'isometric' | '3/4'): void { ... }
     }
     ```
  3. Tank dimensions constants (define at top of file):
     ```typescript
     export const TANK = { W: 12, H: 6, D: 6 } as const; // scene units
     export const WATER_Y = TANK.H * 0.5;       // water surface Y
     export const SUBSTRATE_Y = -TANK.H * 0.5;  // substrate floor Y
     ```
  4. In `constructor`:
     - Build `THREE.Scene` with background `new THREE.Color(0x071020)`.
     - Build isometric camera: `THREE.OrthographicCamera` with frustum
       `(-aspect*zoom, aspect*zoom, zoom, -zoom)` where `zoom = 5`, updated in `_onResize`.
       Position `(12, 10, 12)`, looking at `(0, 0, 0)`.
     - Build perspective camera: `THREE.PerspectiveCamera(50, aspect, 0.1, 200)`.
       Position `(0, 4, 14)`, looking at `(0, 0, 0)`.
     - Register `appState.subscribe('cameraMode', ...)` → `_onCameraModeChange`.
     - Register `renderer.onTick(dt => this.update(dt))`.
     - Add a `ResizeObserver` on `document.body` → `_onResize(w, h)`.
     - Call `_buildTank()`, `_buildLighting()`, `_buildWaterSurface()`, `_buildCausticPlane()`.
     - Register a tick callback to call `renderer.threeRenderer.render(this.scene, this.activeCamera)`.
  5. In `_buildTank()`:
     - Create 5 glass panels (front missing for view): left, right, back, bottom, top.
       Each: `THREE.BoxGeometry` with a `THREE.MeshPhysicalMaterial` set to
       `color: 0x88bbcc`, `transparent: true`, `opacity: 0.18`, `roughness: 0.05`,
       `transmission: 0.9`.
     - Panel dimensions: left/right = `(0.1, TANK.H, TANK.D)`, back = `(TANK.W, TANK.H, 0.1)`,
       bottom/top = `(TANK.W, 0.1, TANK.D)`.
     - Position each panel at the appropriate tank boundary.
  6. In `_buildLighting()`:
     - Add `THREE.AmbientLight(0x1a3060, 0.6)`.
     - Add a `THREE.DirectionalLight(0x9dcfff, 1.2)` positioned at `(4, 12, 6)`, casting
       shadows, targeting `(0, 0, 0)`.
     - Add a `THREE.PointLight(0x3fa8e0, 0.8, 18)` positioned at `(0, WATER_Y - 0.2, 0)`
       to simulate sub-surface diffusion glow.
  7. In `_buildWaterSurface()`:
     - Geometry: `new THREE.PlaneGeometry(TANK.W, TANK.D, 32, 32)`.
     - Rotate: `geometry.rotateX(-Math.PI / 2)`.
     - Create `waterUniforms`: `{ uTime: { value: 0 }, uWaveAmplitude: { value: 0.04 }, uWaveFrequency: { value: 2.5 } }`.
     - Material: `new THREE.ShaderMaterial({ vertexShader: waterVert, fragmentShader: waterFrag, uniforms: waterUniforms, transparent: true, side: THREE.DoubleSide })`.
     - Position mesh at `y = WATER_Y`. Add to scene.
  8. In `_buildCausticPlane()`:
     - Geometry: `new THREE.PlaneGeometry(TANK.W, TANK.D)` rotated `(-Math.PI/2)`.
     - Create `causticUniforms`: `{ uTime: { value: 0 }, uCausticIntensity: { value: 0.55 } }`.
     - Material: `new THREE.ShaderMaterial({ fragmentShader: causticFrag, uniforms: causticUniforms, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true })`.
       Vertex shader: use Three.js built-in (`vertexShader` omitted — use the default
       `THREE.ShaderMaterial` pass-through vertex by passing an empty vertex shader string
       or the standard position-only vert).
     - Position at `y = SUBSTRATE_Y + 0.01`. Add to scene.
  9. In `update(dt)`:
     - Advance `waterUniforms.uTime.value += dt`.
     - Advance `causticUniforms.uTime.value += dt`.
  10. In `_onResize(w, h)`:
      - Update `perspCamera.aspect = w / h`; call `perspCamera.updateProjectionMatrix()`.
      - Recalculate orthographic frustum: `const aspect = w/h; const zoom = 5`;
        set `isoCamera.left/right/top/bottom` accordingly; call `isoCamera.updateProjectionMatrix()`.
  11. In `_onCameraModeChange(mode)`: the `activeCamera` getter returns `isoCamera` when
      `mode === 'isometric'`, else `perspCamera`. No scene rebuild needed.
  12. Edge case: on first frame `dt` may be 0 — shader time will stay 0, which is valid.
- **SKILLSET REQUIRED:** Three.js scene graph, cameras, ShaderMaterial, lighting.
- **NOTES:** The substrate plane and decoration meshes are added to the scene by
  `EnvironmentConfig` (DI-010), not here. `SceneManager` exposes `scene` as readonly so
  other systems can call `scene.add()`.
- **RELATED:** BR-001, BR-002, BR-003, BR-004, BR-005, BR-025. AR-001, AR-002. PT-004, PT-005.

---

## DI-006 : FLUID VELOCITY GRID

- **SUMMARY:** Implement `src/simulation/FluidGrid.ts` — 2D Eulerian velocity grid with
  semi-Lagrangian advection, velocity decay, impulse injection, and bilinear velocity sampling.
- **IMPLEMENTATION STEPS:**
  1. Create `src/simulation/FluidGrid.ts`.
  2. Class signature:
     ```typescript
     export class FluidGrid {
       readonly cols: number;   // default 64
       readonly rows: number;   // default 64
       readonly cellW: number;  // TANK.W / cols
       readonly cellH: number;  // TANK.D / rows
       private vx: Float32Array;   // current frame
       private vz: Float32Array;
       private vxPrev: Float32Array; // previous frame (swap buffer)
       private vzPrev: Float32Array;
       constructor(cols = 64, rows = 64) { ... }
       addImpulse(worldX: number, worldZ: number, dvx: number, dvz: number, radius: number): void { ... }
       sample(worldX: number, worldZ: number): { vx: number; vz: number } { ... }
       step(dt: number): void { ... }
       private _advect(src: Float32Array, dst: Float32Array, vxField: Float32Array, vzField: Float32Array, dt: number): void { ... }
       private _idx(col: number, row: number): number { return row * this.cols + col; }
       private _clampCol(c: number): number { return Math.max(0, Math.min(this.cols - 1, c)); }
       private _clampRow(r: number): number { return Math.max(0, Math.min(this.rows - 1, r)); }
     }
     ```
  3. In `constructor`: allocate four `Float32Array(cols * rows)` buffers, all zeroed.
     `cellW = TANK.W / cols`, `cellH = TANK.D / rows`.
  4. Coordinate mapping helpers (private):
     - `worldToCell(worldX, worldZ)` → `{ col, row }` where
       `col = Math.floor((worldX + TANK.W/2) / cellW)`,
       `row = Math.floor((worldZ + TANK.D/2) / cellH)`.
     - `cellToWorld(col, row)` → `{ x, z }` — centre of cell.
  5. In `addImpulse(worldX, worldZ, dvx, dvz, radius)`:
     - Convert `worldX/Z` to fractional grid coords.
     - For each cell within `radius` in grid units, compute distance; if within radius,
       add `dvx` and `dvz` to that cell's velocity (Gaussian falloff: `exp(-dist²/(2*r²))`).
     - Clamp cols/rows to `[0, cols-1]` / `[0, rows-1]`.
  6. In `step(dt)`:
     - Swap buffers: copy current into prev.
     - Call `_advect(vxPrev, vx, vxPrev, vzPrev, dt)` and
       `_advect(vzPrev, vz, vxPrev, vzPrev, dt)`.
     - Apply viscosity decay: multiply every element of `vx` and `vz` by `0.985`.
     - Enforce boundary (no-slip): set velocity of border cells to 0.
  7. In `_advect(src, dst, vxField, vzField, dt)`:
     - For each cell `(c, r)`:
       - Back-trace: `prevC = c - vxField[idx] * dt / cellW`,
         `prevR = r - vzField[idx] * dt / cellH`.
       - Clamp `prevC` to `[0, cols-1]`, `prevR` to `[0, rows-1]`.
       - Bilinear interpolation of `src` at `(prevC, prevR)` → write to `dst[idx]`.
  8. In `sample(worldX, worldZ)`:
     - Convert world coords to fractional grid coords.
     - Clamp to grid bounds.
     - Bilinear interpolate `vx` and `vz` at fractional position.
     - Return `{ vx, vz }`.
  9. Edge case: if `worldX` or `worldZ` is outside tank bounds, clamp to grid boundary before
     sampling — do not throw.
- **SKILLSET REQUIRED:** Numerical methods, typed arrays, 2D grid indexing.
- **NOTES:** Grid is tank-XZ-plane only; Y-axis (vertical) is handled separately by each
  subsystem (bubbles rise at fixed rate; particles fall at fixed gravity). Import `TANK` from
  `SceneManager.ts`.
- **RELATED:** BR-011, BR-012, BR-026, BR-028, BR-031. AR-003. PT-006.

---

## DI-007 : PARTICLE SYSTEM

- **SUMMARY:** Implement `src/simulation/ParticleSystem.ts` — manages dust, sediment, and
  food-debris particles using a pre-allocated pool, `FluidGrid`-driven drift, gravity
  settlement, and bounded despawn.
- **IMPLEMENTATION STEPS:**
  1. Create `src/simulation/ParticleSystem.ts`.
  2. Define `ParticleType`:
     ```typescript
     export type ParticleType = 'dust' | 'sediment' | 'food';
     ```
  3. Define `Particle` interface (internal):
     ```typescript
     interface Particle {
       active: boolean;
       type: ParticleType;
       x: number; y: number; z: number;
       vx: number; vy: number; vz: number;
       life: number;      // seconds remaining
       maxLife: number;
       size: number;      // 0.02–0.06 scene units
       isFood: boolean;
     }
     ```
  4. Class signature:
     ```typescript
     export class ParticleSystem {
       private pool: Particle[];        // MAX_PARTICLES = 500 slots
       private points: THREE.Points;
       private positions: Float32Array; // 3 * MAX_PARTICLES
       private sizes: Float32Array;
       private alphas: Float32Array;
       constructor(scene: THREE.Scene, fluidGrid: FluidGrid) { ... }
       spawnFood(worldX: number, worldY: number, worldZ: number, count?: number): void { ... }
       spawnDust(count?: number): void { ... }
       getFoodNear(x: number, y: number, z: number, radius: number): Particle[] { ... }
       consumeFood(p: Particle): void { ... }
       update(dt: number): void { ... }
       private _acquire(): Particle | null { ... }
       private _syncBuffers(): void { ... }
     }
     ```
  5. In `constructor`:
     - Pre-allocate `pool` of 500 `Particle` objects with `active = false`.
     - Create `THREE.BufferGeometry`; attach `position`, `size`, `alpha` buffer attributes.
     - Shader material for points: `THREE.PointsMaterial({ vertexColors: false, size: 0.05,
       sizeAttenuation: true, transparent: true, opacity: 0.6, color: 0xc8b89a })`.
       Edge case: all-zero positions are fine — inactive particles have `alpha = 0` so they
       are invisible.
     - Call `scene.add(this.points)`.
     - Call `spawnDust(120)` to seed background particles at random positions within tank bounds.
  6. In `spawnFood(x, y, z, count = 8)`:
     - Acquire up to `count` particles; for each: set `type = 'food'`, `isFood = true`,
       position = `(x ± rand*0.15, y, z ± rand*0.15)`, `maxLife = 8`, `life = 8`,
       `vy = -0.02` (sink slightly), `size = 0.045`.
  7. In `spawnDust(count = 120)`:
     - For each: random position within `[-TANK.W/2+0.1, TANK.W/2-0.1]` × `[SUBSTRATE_Y+0.1, WATER_Y-0.1]` × `[-TANK.D/2+0.1, TANK.D/2-0.1]`.
       `maxLife = life = 30`, `type = 'dust'`, `size = 0.025`, `isFood = false`.
  8. In `update(dt)`:
     - For each active particle:
       - Sample `fluidGrid.sample(p.x, p.z)` → `{ vx, vz }`.
       - Apply drift: `p.x += (vx + p.vx) * dt`, `p.z += (vz + p.vz) * dt`.
       - Apply gravity: `p.vy -= 0.02 * dt` (sediment/food); dust: `vy` stays near zero.
       - Update position: `p.y += p.vy * dt`.
       - Clamp to tank bounds: if `p.y <= SUBSTRATE_Y`, set `p.y = SUBSTRATE_Y + 0.01`,
         `p.vy = 0`. If `p.y >= WATER_Y`, set `p.y = WATER_Y - 0.01`, `p.vy *= -0.5`.
       - Decrement `p.life -= dt`. If `p.life <= 0`, deactivate.
       - Dust respawns: if `type === 'dust'` and deactivated, respawn at a new random position
         (recycle slot) so the background cloud is persistent.
     - Call `_syncBuffers()`.
  9. In `_syncBuffers()`:
     - Write `p.x, p.y, p.z` → `positions[3*i..3*i+2]` for each slot.
     - Write `p.active ? p.size : 0` → `sizes[i]`.
     - Write `p.active ? (p.life / p.maxLife) * 0.8 : 0` → `alphas[i]`.
     - Mark `geometry.attributes.position.needsUpdate = true`.
  10. `getFoodNear` returns all active food particles within Euclidean distance `radius`.
  11. `consumeFood(p)`: set `p.active = false` immediately.
- **SKILLSET REQUIRED:** Three.js BufferGeometry/Points, object pooling, vector math.
- **NOTES:** `ParticleSystem` must be constructed after `FluidGrid` (DI-006). Maximum 500
  active particles enforced by the pool — `_acquire()` returns null if pool is exhausted;
  callers must handle null gracefully (no crash).
- **RELATED:** BR-011, BR-019, BR-027. AR-003. PT-007.

---

## DI-008 : BUBBLE SYSTEM

- **SUMMARY:** Implement `src/simulation/BubbleSystem.ts` — emits bubbles from the bubbler
  position using `THREE.InstancedMesh`, animates buoyant rise with drift, pops at surface,
  injects velocity impulse into `FluidGrid`, and respects `AppState.bubblerRate`.
- **IMPLEMENTATION STEPS:**
  1. Create `src/simulation/BubbleSystem.ts`.
  2. Bubbler world position constant: `BUBBLER_POS = { x: -TANK.W/2 + 1.2, y: SUBSTRATE_Y + 0.1, z: -TANK.D/2 + 1.0 }`.
  3. Define `Bubble` internal interface:
     ```typescript
     interface Bubble {
       active: boolean;
       x: number; y: number; z: number;
       vx: number; vy: number; vz: number;  // vy ≈ 0.35–0.55
       radius: number;   // 0.01–0.05 scene units
       life: number;     // seconds; expires when y >= WATER_Y
     }
     ```
  4. Class signature:
     ```typescript
     const MAX_BUBBLES = 200;
     export class BubbleSystem {
       private pool: Bubble[];
       private mesh: THREE.InstancedMesh;
       private emitAccum: number = 0;
       constructor(scene: THREE.Scene, fluidGrid: FluidGrid, appState: AppState) { ... }
       update(dt: number): void { ... }
       private _emit(): void { ... }
       private _syncMesh(): void { ... }
     }
     ```
  5. In `constructor`:
     - Pre-allocate `pool` of `MAX_BUBBLES` bubble objects.
     - Geometry: `new THREE.SphereGeometry(1, 6, 4)` (radius=1, low-poly; scaled per instance).
     - Material: `new THREE.MeshPhysicalMaterial({ color: 0xaaddff, transparent: true,
       opacity: 0.35, roughness: 0, transmission: 0.7 })`.
     - `mesh = new THREE.InstancedMesh(geometry, material, MAX_BUBBLES)`.
     - `mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage)`.
     - Set all instance scales to 0 initially (invisible inactive slots).
     - `scene.add(mesh)`.
  6. In `update(dt)`:
     - Compute emit interval: `interval = 60 / appState.get('bubblerRate')` seconds.
     - `emitAccum += dt`; while `emitAccum >= interval`: `_emit()`, `emitAccum -= interval`.
     - For each active bubble:
       - `b.y += b.vy * dt`.
       - `b.x += b.vx * dt + (Math.random() - 0.5) * 0.012 * dt`.
       - `b.z += b.vz * dt + (Math.random() - 0.5) * 0.012 * dt`.
       - Clamp X/Z to tank interior (leave 0.1 margin).
       - If `b.y >= WATER_Y`: deactivate bubble; optionally spawn a 3-particle splash burst
         in `ParticleSystem` at `(b.x, WATER_Y, b.z)` (pass reference in constructor if desired).
     - Inject impulse into `fluidGrid` once per frame (not per bubble) at `BUBBLER_POS`:
       `fluidGrid.addImpulse(BUBBLER_POS.x, BUBBLER_POS.z, 0, activeBubbleCount * 0.002, 1.5)`.
     - Call `_syncMesh()`.
  7. In `_emit()`:
     - Find an inactive slot in `pool`; if none, skip.
     - Initialise: position = `BUBBLER_POS` with ±0.1 random horizontal offset,
       `vy = 0.35 + Math.random() * 0.2`, `vx = (Math.random()-0.5) * 0.05`,
       `vz = (Math.random()-0.5) * 0.05`, `radius = 0.01 + Math.random() * 0.04`,
       `active = true`.
  8. In `_syncMesh()`:
     - For each slot `i`: if active, set instance matrix to a scale matrix with
       `scale = bubble.radius * 2` centred at `(bubble.x, bubble.y, bubble.z)`.
       If inactive, set scale to 0.
     - `mesh.instanceMatrix.needsUpdate = true`.
  9. Edge case: `bubblerRate` changes mid-session (user adjusts slider). `appState.get('bubblerRate')`
     is read each `update()` call so it picks up changes automatically — no event subscription needed.
- **SKILLSET REQUIRED:** Three.js InstancedMesh, instance matrix manipulation.
- **NOTES:** `dummy = new THREE.Object3D()` is the standard idiom for building instance
  matrices: call `dummy.position.set(...)`, `dummy.scale.set(r,r,r)`, `dummy.updateMatrix()`,
  then `mesh.setMatrixAt(i, dummy.matrix)`.
- **RELATED:** BR-010, BR-029, BR-030, BR-031. AR-003. PT-008.

---

## DI-009 : PLANT SYSTEM

- **SUMMARY:** Implement `src/environment/PlantSystem.ts` — creates procedurally placed plant
  tube meshes whose top vertices are displaced each frame by `FluidGrid` velocity sampling.
- **IMPLEMENTATION STEPS:**
  1. Create `src/environment/PlantSystem.ts`.
  2. Constants: `NUM_PLANTS = 6`, `PLANT_COLORS = [0x2d7a3a, 0x4aae5a, 0x8bc34a, 0x558b2f, 0x33691e, 0x76ff03]`.
  3. Define `Plant` internal interface:
     ```typescript
     interface Plant {
       baseX: number; baseZ: number;
       baseHeight: number;       // 0.8–2.2 scene units
       segments: number;         // 4–6
       mesh: THREE.Mesh;
       heightPhase: number;      // random 0–2π for growth cycle
     }
     ```
  4. Class:
     ```typescript
     export class PlantSystem {
       private plants: Plant[] = [];
       constructor(scene: THREE.Scene, fluidGrid: FluidGrid, obstacleBoxes: THREE.Box3[]) { ... }
       update(dt: number, elapsed: number): void { ... }
       private _buildPlant(baseX: number, baseZ: number): Plant { ... }
     }
     ```
  5. In `constructor`:
     - Generate `NUM_PLANTS` positions via rejection sampling: random `(x, z)` in
       `[-TANK.W/2 + 0.5, TANK.W/2 - 0.5]` × `[-TANK.D/2 + 0.5, TANK.D/2 - 0.5]`; reject
       if position is within 0.6 units of any `obstacleBox` centre (use `box.containsPoint`
       after expanding box by 0.6). Maximum 50 attempts per plant; if exhausted, place anyway.
     - For each accepted position, call `_buildPlant(x, z)`, add `plant.mesh` to scene.
  6. In `_buildPlant(baseX, baseZ)`:
     - `segments = Math.floor(Math.random() * 3) + 4` (4–6).
     - `baseHeight = 0.8 + Math.random() * 1.4`.
     - Build a `THREE.CatmullRomCurve3` from `segments+1` points:
       point 0 = `(baseX, SUBSTRATE_Y, baseZ)`;
       each subsequent point adds `(baseHeight / segments)` to Y and a small random XZ offset
       `(±0.08)` per segment.
     - Create `THREE.TubeGeometry(curve, segments * 4, 0.04, 4, false)`.
     - Material: `new THREE.MeshLambertMaterial({ color: PLANT_COLORS[i % PLANT_COLORS.length] })`.
     - Mark the geometry as `geometry.attributes.position.setUsage(THREE.DynamicDrawUsage)`.
     - Return plant with `heightPhase = Math.random() * Math.PI * 2`.
  7. In `update(dt, elapsed)`:
     - For each plant:
       - Sample fluid: `{ vx, vz } = fluidGrid.sample(plant.baseX, plant.baseZ)`.
       - Compute `sway = Math.sqrt(vx*vx + vz*vz) * 1.5 + 0.08` (base ambient sway).
       - Growth oscillation: `heightMod = 1.0 + 0.1 * Math.sin(elapsed * 0.0083 * Math.PI * 2 + plant.heightPhase)`.
       - Update top-half of geometry vertices: iterate through positions buffer; for vertices
         with local Y in the top 60% of the plant height, apply lateral offset
         `dx = sway * vx_normalized * relativeHeight`, `dz = sway * vz_normalized * relativeHeight`.
         Clamp `|dx|` and `|dz|` to 0.15.
       - `geometry.attributes.position.needsUpdate = true`.
  8. Edge case: if `fluidGrid.sample` returns `{vx:0, vz:0}` (calm water), the ambient sway
     constant `0.08` keeps plants gently moving — this is intentional per the "living ecology"
     theme.
- **SKILLSET REQUIRED:** Three.js CatmullRomCurve3, TubeGeometry, vertex animation.
- **NOTES:** Vertex animation via direct position buffer mutation requires `DynamicDrawUsage`
  on the geometry attribute to avoid GPU stalls. Pass `elapsed` (total seconds) from the main
  loop for the growth cycle.
- **RELATED:** BR-012, BR-026, BR-028. AR-003. PT-013.

---

## DI-010 : ENVIRONMENT CONFIGURATION

- **SUMMARY:** Implement `src/environment/EnvironmentConfig.ts` — creates the substrate plane,
  loads decoration placeholder meshes, toggles visibility via `AppState`, and exports obstacle
  bounding boxes.
- **IMPLEMENTATION STEPS:**
  1. Create `src/environment/EnvironmentConfig.ts`.
  2. Class signature:
     ```typescript
     export class EnvironmentConfig {
       readonly obstacleBounds: THREE.Box3[] = [];
       private substrateMesh: THREE.Mesh;
       private decoMeshes: { shipwreck: THREE.Mesh; rocks: THREE.Mesh; artifacts: THREE.Mesh };
       constructor(scene: THREE.Scene, appState: AppState) { ... }
       private _buildSubstrate(appState: AppState): void { ... }
       private _buildDecorations(scene: THREE.Scene, appState: AppState): void { ... }
       private _applySubstrate(type: 'sand' | 'gravel' | 'rock'): void { ... }
       private _applyDecoration(key: keyof AppStateData['decorations'], visible: boolean): void { ... }
     }
     ```
  3. Substrate colours (use `MeshLambertMaterial` `color` since no texture assets exist at
     this stage): `sand = 0xd4b483`, `gravel = 0x8e8270`, `rock = 0x5c5248`.
  4. In `_buildSubstrate(appState)`:
     - Geometry: `new THREE.PlaneGeometry(TANK.W, TANK.D)` rotated `(-Math.PI/2)`.
     - Position at `y = SUBSTRATE_Y`. Create material from `appState.get('substrateType')`.
     - Add to scene. Register `appState.subscribe('substrateType', t => _applySubstrate(t))`.
  5. In `_buildDecorations(scene, appState)`:
     - Shipwreck: `new THREE.BoxGeometry(2.5, 1.2, 1.0)` at position `(-2, SUBSTRATE_Y + 0.6, -1)`,
       material `color: 0x4a3d2e`. Add to scene. Extract bounding box and push to `obstacleBounds`.
     - Rocks: `new THREE.DodecahedronGeometry(0.5)` at `(2.5, SUBSTRATE_Y + 0.5, 1)`,
       material `color: 0x5c5248`. Add to scene. Extract bounding box, push to `obstacleBounds`.
     - Artifacts (treasure chest): `new THREE.BoxGeometry(0.4, 0.3, 0.3)` at `(-1.5, SUBSTRATE_Y + 0.15, 1.5)`,
       material `color: 0xb8860b`. Add to scene. Extract bounding box, push to `obstacleBounds`.
     - Apply initial visibility from `appState.get('decorations')`.
     - Subscribe to `appState.subscribe('decorations', d => ...)` and call `_applyDecoration`
       for each key.
  6. In `_applySubstrate(type)`: update `substrateMesh.material` color based on type.
  7. In `_applyDecoration(key, visible)`: `decoMeshes[key].visible = visible`.
  8. Edge case: `obstacleBounds` must be computed after decoration meshes are positioned.
     Use `new THREE.Box3().setFromObject(mesh)` after adding to scene and calling
     `mesh.updateMatrixWorld(true)`.
- **SKILLSET REQUIRED:** Three.js geometry, materials, bounding boxes.
- **NOTES:** Placeholder geometry is used here (boxes, dodecahedron) because GLTF models
  are not provided as build assets. The Technical Lead specifies this as an explicit
  implementation constraint — fish obstacle avoidance and the visual result are valid with
  placeholder geometry.
- **RELATED:** BR-007, BR-008, BR-009. AR-007. PT-012.

---

## DI-011 : FISH SPECIES CONFIGURATION

- **SUMMARY:** Create `src/fish/FishSpecies.ts` — define the `FishSpeciesConfig` interface,
  four species records, and the incompatibility exclusion table.
- **IMPLEMENTATION STEPS:**
  1. Create `src/fish/FishSpecies.ts`.
  2. Define the interface:
     ```typescript
     export interface FishSpeciesConfig {
       id: string;
       color: number;              // THREE.Color hex
       bodyLength: number;         // scene units, 0.15–0.35
       maxSpeed: number;           // scene units/s
       maxForce: number;           // scene units/s²
       wanderRadius: number;
       wanderDistance: number;
       separationDist: number;
       cohesionWeight: number;
       alignmentWeight: number;
       separationWeight: number;
       wanderWeight: number;
       preferredY: number;         // preferred swim depth (-2 to 2)
       preferredYWeight: number;
     }
     ```
  3. Define four species:
     ```typescript
     export const SPECIES: Record<string, FishSpeciesConfig> = {
       clownfish: {
         id: 'clownfish', color: 0xf05028, bodyLength: 0.2,
         maxSpeed: 2.2, maxForce: 3.5, wanderRadius: 1.0, wanderDistance: 2.0,
         separationDist: 0.6, cohesionWeight: 0.7, alignmentWeight: 0.6,
         separationWeight: 1.2, wanderWeight: 0.5, preferredY: 0.5, preferredYWeight: 0.4,
       },
       angelfish: {
         id: 'angelfish', color: 0xf0c040, bodyLength: 0.28,
         maxSpeed: 1.4, maxForce: 2.0, wanderRadius: 1.6, wanderDistance: 2.5,
         separationDist: 1.0, cohesionWeight: 0.2, alignmentWeight: 0.3,
         separationWeight: 1.5, wanderWeight: 0.8, preferredY: 0.0, preferredYWeight: 0.3,
       },
       tetra: {
         id: 'tetra', color: 0x40c0f0, bodyLength: 0.15,
         maxSpeed: 3.2, maxForce: 5.0, wanderRadius: 0.8, wanderDistance: 1.5,
         separationDist: 0.4, cohesionWeight: 1.2, alignmentWeight: 1.0,
         separationWeight: 0.9, wanderWeight: 0.6, preferredY: 1.5, preferredYWeight: 0.5,
       },
       gourami: {
         id: 'gourami', color: 0xd08030, bodyLength: 0.25,
         maxSpeed: 1.2, maxForce: 1.8, wanderRadius: 1.2, wanderDistance: 2.0,
         separationDist: 0.8, cohesionWeight: 0.1, alignmentWeight: 0.2,
         separationWeight: 1.4, wanderWeight: 1.0, preferredY: -1.8, preferredYWeight: 0.6,
       },
     };
     ```
  4. Define incompatibility set (no incompatible pairs in the default 4-species set, but
     the table must exist for future extension):
     ```typescript
     export const INCOMPATIBLE_PAIRS: Set<string> = new Set([
       // Format: 'speciesA:speciesB' (alphabetically ordered)
       // e.g. 'angelfish:gourami' if they were incompatible
     ]);
     export function areCompatible(a: string, b: string): boolean {
       const key = [a, b].sort().join(':');
       return !INCOMPATIBLE_PAIRS.has(key);
     }
     ```
  5. Export `SPECIES_IDS = Object.keys(SPECIES)` as a convenience array.
- **SKILLSET REQUIRED:** TypeScript const records, domain modelling.
- **NOTES:** Species parameters are tuned for visual plausibility. Population initialisation
  in `FishManager` (DI-013) validates compatibility before adding any species.
- **RELATED:** BR-013, BR-014, BR-015. AR-004. PT-010.

---

## DI-012 : FISH AGENT

- **SUMMARY:** Implement `src/fish/FishAgent.ts` — single-fish entity with Reynolds steering
  behaviour composition, mesh management, wake injection, and food-seeking override.
- **IMPLEMENTATION STEPS:**
  1. Create `src/fish/FishAgent.ts`.
  2. Class signature:
     ```typescript
     export class FishAgent {
       readonly species: FishSpeciesConfig;
       position: THREE.Vector3;
       velocity: THREE.Vector3;
       mesh: THREE.Mesh;
       private wanderAngle: number = Math.random() * Math.PI * 2;
       private _tmp = new THREE.Vector3(); // reusable scratch vector
       constructor(species: FishSpeciesConfig, startPos: THREE.Vector3, scene: THREE.Scene) { ... }
       steer(
         neighbours: FishAgent[],
         obstacles: THREE.Box3[],
         fluidGrid: FluidGrid,
         particleSystem: ParticleSystem,
         dt: number
       ): void { ... }
       private _seek(target: THREE.Vector3): THREE.Vector3 { ... }
       private _wander(): THREE.Vector3 { ... }
       private _separate(neighbours: FishAgent[]): THREE.Vector3 { ... }
       private _align(neighbours: FishAgent[]): THREE.Vector3 { ... }
       private _cohese(neighbours: FishAgent[]): THREE.Vector3 { ... }
       private _avoidObstacles(obstacles: THREE.Box3[]): THREE.Vector3 { ... }
       private _seekPreferredY(): THREE.Vector3 { ... }
       private _clampToTank(): void { ... }
     }
     ```
  3. In `constructor`:
     - Create `THREE.ConeGeometry(species.bodyLength * 0.25, species.bodyLength, 6)`.
     - Rotate geometry -90° around Z so cone tip points in +X direction.
     - Material: `new THREE.MeshLambertMaterial({ color: species.color })`.
     - Initial position: copy `startPos`. Initial velocity: random unit vector × `species.maxSpeed * 0.5`.
  4. In `steer(...)`:
     - Collect steering forces:
       - `food = particleSystem.getFoodNear(position.x, position.y, position.z, 2.0)`.
         If food found: `f_seek = _seek(nearestFood.position) × 3.0` (dominant).
       - Else: `f_wander = _wander() × species.wanderWeight`.
       - `f_sep = _separate(neighbours) × species.separationWeight`.
       - `f_ali = _align(neighbours) × species.alignmentWeight`.
       - `f_coh = _cohese(neighbours) × species.cohesionWeight`.
       - `f_obs = _avoidObstacles(obstacles) × 4.0`.
       - `f_y   = _seekPreferredY() × species.preferredYWeight`.
       - `f_cur = new THREE.Vector3(fluidGrid.sample(...).vx, 0, fluidGrid.sample(...).vz) × 0.3`.
     - Sum all forces; clamp magnitude to `species.maxForce`.
     - `velocity.add(force × dt)`. Clamp velocity magnitude to `species.maxSpeed`.
     - `position.add(velocity × dt)`.
     - `_clampToTank()`.
     - Update `mesh.position.copy(position)`.
     - Update `mesh.lookAt(position.clone().add(velocity))` — face direction of travel.
     - Inject wake: `fluidGrid.addImpulse(position.x, position.z, velocity.x * 0.15, velocity.z * 0.15, 0.4)`.
     - Food consumption: if food was found and distance < `species.bodyLength * 0.8`,
       call `particleSystem.consumeFood(nearestFood)`.
  5. In `_wander()`:
     - Project a circle ahead of the fish: `circleCenter = velocity.normalized × wanderDistance`.
     - `wanderAngle += (Math.random() - 0.5) * 0.4` (jitter).
     - Displacement on circle: `(cos(wanderAngle) × wanderRadius, sin(wanderAngle) × wanderRadius, 0)`.
       Rotate displacement to align with velocity heading.
     - Return `_seek(position + circleCenter + displacement)`.
  6. In `_separate(neighbours)`:
     - Sum `(position - neighbour.position).normalize() / distance` for all neighbours within
       `species.separationDist`. Normalise result.
  7. In `_align(neighbours)`:
     - Average velocity of neighbours within `species.separationDist * 2`. Return steering
       force toward that average velocity.
  8. In `_cohese(neighbours)`:
     - Average position of neighbours within `species.separationDist * 3`. Seek that centroid.
  9. In `_avoidObstacles(obstacles)`:
     - Ray-cast velocity direction forward `species.bodyLength * 4` units.
     - If ray intersects any bounding box (use `THREE.Raycaster` or manual AABB intersection),
       return a steering force perpendicular to and away from the box surface.
  10. In `_seekPreferredY()`:
      - Return `_seek(new THREE.Vector3(position.x, species.preferredY, position.z))`.
  11. In `_clampToTank()`:
      - Clamp `position.x` to `[−TANK.W/2 + margin, TANK.W/2 − margin]` where `margin = bodyLength`.
      - Clamp `position.y` to `[SUBSTRATE_Y + margin, WATER_Y − margin]`.
      - Clamp `position.z` to `[−TANK.D/2 + margin, TANK.D/2 − margin]`.
      - On any clamp, reflect the corresponding velocity component: `velocity.x *= -0.5` etc.
- **SKILLSET REQUIRED:** 3D vector arithmetic, Reynolds steering behaviours, Three.js mesh API.
- **NOTES:** All `THREE.Vector3` operations should reuse the `_tmp` scratch vector where
  possible to reduce GC pressure. `_seek` returns `(target - position).normalize() × maxSpeed - velocity`.
- **RELATED:** BR-014, BR-015, BR-017. AR-004. PT-009.

---

## DI-013 : FISH MANAGER

- **SUMMARY:** Implement `src/fish/FishManager.ts` — population initialisation with species
  mix and compatibility check, spatial grid for O(n) neighbour lookup, per-frame agent update.
- **IMPLEMENTATION STEPS:**
  1. Create `src/fish/FishManager.ts`.
  2. Class signature:
     ```typescript
     export class FishManager {
       private agents: FishAgent[] = [];
       private spatialGrid: Map<string, FishAgent[]>;
       private cellSize: number;
       constructor(
         scene: THREE.Scene,
         appState: AppState,
         obstacles: THREE.Box3[],
         fluidGrid: FluidGrid,
         particleSystem: ParticleSystem
       ) { ... }
       update(dt: number): void { ... }
       private _initPopulation(scene: THREE.Scene, count: number, obstacles: THREE.Box3[]): void { ... }
       private _buildSpatialGrid(): void { ... }
       private _getNeighbours(agent: FishAgent): FishAgent[] { ... }
       private _gridKey(x: number, y: number, z: number): string { ... }
     }
     ```
  3. In `constructor`:
     - `cellSize = 2.0` (twice max separation distance).
     - Call `_initPopulation(scene, appState.get('populationCount'), obstacles)`.
  4. In `_initPopulation(scene, count, obstacles)`:
     - Create a shuffled list of species IDs repeated to fill `count` slots:
       `[...SPECIES_IDS, ...SPECIES_IDS, ...]`.splice to `count`.
     - For each entry, check compatibility against all already-added species IDs using
       `areCompatible`; if incompatible, replace with a compatible species from `SPECIES_IDS`.
     - For each species ID, compute a random spawn position:
       `x ∈ [−TANK.W/2+1, TANK.W/2−1]`, `z ∈ [−TANK.D/2+1, TANK.D/2−1]`,
       `y ∈ [SUBSTRATE_Y+0.5, WATER_Y−0.5]`.
       Reject if position is inside any obstacle bounding box (attempt up to 10 positions;
       if all rejected, use the last attempt anyway).
     - Construct `new FishAgent(SPECIES[speciesId], position, scene)` and push to `agents`.
  5. In `update(dt)`:
     - Call `_buildSpatialGrid()`.
     - For each agent: `agent.steer(_getNeighbours(agent), obstacles, fluidGrid, particleSystem, dt)`.
  6. In `_buildSpatialGrid()`:
     - Clear `spatialGrid`.
     - For each agent, compute `_gridKey(agent.position.x, agent.position.y, agent.position.z)`.
     - Push agent into `spatialGrid.get(key) ?? []`; store back.
  7. In `_getNeighbours(agent)`:
     - Compute the 27 adjacent cell keys (3³ cube in 3D grid).
     - Flatten all agents in those cells; filter out `agent` itself.
  8. In `_gridKey(x, y, z)`:
     - `return \`${Math.floor(x/cellSize)},${Math.floor(y/cellSize)},${Math.floor(z/cellSize)}\``.
  9. Edge case: if `agents.length === 0`, `update` must not throw.
     Edge case: if two fish are at the same position (unlikely but possible at spawn), the
     separation force pushes them apart — no special handling needed.
- **SKILLSET REQUIRED:** Spatial partitioning, boids algorithm composition.
- **NOTES:** `obstacles` is passed in from `EnvironmentConfig.obstacleBounds` (DI-010).
  This must be constructed after `EnvironmentConfig`.
- **RELATED:** BR-013, BR-014, BR-015, BR-017. AR-004. PT-011.

---

## DI-014 : AUDIO MANAGER

- **SUMMARY:** Implement `src/audio/AudioManager.ts` — wraps Howler.js to load, loop,
  and control ambient audio tracks, gated behind a first-user-gesture call.
- **IMPLEMENTATION STEPS:**
  1. Create `src/audio/AudioManager.ts`.
  2. Import `{ Howl, Howler }` from `'howler'`.
  3. Class:
     ```typescript
     export class AudioManager {
       private underwater: Howl;
       private bubbles: Howl;
       private ready = false;
       constructor(appState: AppState) { ... }
       init(): void { ... }
       private _applyState(enabled: boolean): void { ... }
     }
     ```
  4. In `constructor`:
     - Create Howls (not yet playing):
       ```typescript
       this.underwater = new Howl({ src: ['assets/audio/ambient-underwater.mp3', 'assets/audio/ambient-underwater.ogg'], loop: true, volume: 0.6, autoplay: false });
       this.bubbles    = new Howl({ src: ['assets/audio/ambient-bubbles.mp3', 'assets/audio/ambient-bubbles.ogg'],    loop: true, volume: 0.4, autoplay: false });
       ```
     - Subscribe: `appState.subscribe('audioEnabled', enabled => { if (this.ready) this._applyState(enabled); })`.
  5. In `init()`:
     - Set `this.ready = true`.
     - Apply current state: `_applyState(appState.get('audioEnabled'))`.
     - This method must be called from inside a user-gesture event handler (pointer down),
       not from the module load path.
  6. In `_applyState(enabled)`:
     - If `enabled`: call `underwater.play()` and `bubbles.play()` only if not already playing
       (`!underwater.playing()`).
     - If `!enabled`: call `underwater.stop()` and `bubbles.stop()`.
  7. Edge case: audio files may be absent in development (`build/assets/audio/` may be empty).
     Howler silently fails to load missing files — the app must not crash. Wrap Howl creation
     in try/catch; if an error occurs, log a warning and set `ready = false` permanently.
  8. Placeholder audio: create zero-byte placeholder files `build/assets/audio/ambient-underwater.mp3`,
     `build/assets/audio/ambient-underwater.ogg`, `build/assets/audio/ambient-bubbles.mp3`,
     `build/assets/audio/ambient-bubbles.ogg` so Howler does not log network errors. The
     Developer must create these placeholder files as part of DI-014 implementation.
     Content: minimal valid MP3 header (1-second silence). Use any freely available
     1-second-silence.mp3 or generate with `ffmpeg -f lavfi -i anullsrc -t 1 silence.mp3`.
- **SKILLSET REQUIRED:** Howler.js API, browser autoplay policy.
- **NOTES:** `AudioManager.init()` is called from `InputManager` on the first `pointerdown`
  event (DI-015). `AudioManager` must be constructed before `InputManager`.
- **RELATED:** BR-006. AR-006. PT-014.

---

## DI-015 : INPUT MANAGER

- **SUMMARY:** Implement `src/input/InputManager.ts` — captures Pointer Events and HammerJS
  gestures on the canvas, performs ray-cast selection, and dispatches typed semantic actions.
- **IMPLEMENTATION STEPS:**
  1. Create `src/input/InputManager.ts`.
  2. Import `Hammer` from `'hammerjs'`.
  3. Define action types:
     ```typescript
     export interface FeedAction   { type: 'feed';   worldX: number; worldZ: number }
     export interface SelectAction { type: 'select'; screenX: number; screenY: number }
     export interface ZoomAction   { type: 'zoom';   scale: number }
     export interface DragFeedAction { type: 'dragfeed'; worldX: number; worldZ: number }
     export type GameAction = FeedAction | SelectAction | ZoomAction | DragFeedAction;
     type ActionHandler = (action: GameAction) => void;
     ```
  4. Class:
     ```typescript
     export class InputManager {
       private handlers: ActionHandler[] = [];
       private isDragging = false;
       private feedCooldown = 0;           // seconds remaining
       readonly FEED_COOLDOWN_S = 0.8;     // 0.8 s between feeds
       constructor(canvas: HTMLCanvasElement, audioManager: AudioManager, sceneManager: SceneManager) { ... }
       onAction(h: ActionHandler): void { this.handlers.push(h); }
       update(dt: number): void { this.feedCooldown = Math.max(0, this.feedCooldown - dt); }
       private _dispatch(action: GameAction): void { this.handlers.forEach(h => h(action)); }
       private _screenToWorld(sx: number, sy: number, sceneManager: SceneManager): { x: number; z: number } { ... }
     }
     ```
  5. In `constructor`:
     - Register `canvas.addEventListener('pointerdown', handler, { passive: false })`.
       In handler: call `audioManager.init()` on first call (guard with `_audioInitialised`
       flag). Then if `feedCooldown <= 0`: dispatch `FeedAction` with world coords;
       set `feedCooldown = FEED_COOLDOWN_S`. Also dispatch `SelectAction` (select is
       not rate-limited). Call `canvas.setPointerCapture(e.pointerId)`.
     - Register `canvas.addEventListener('pointermove', handler, { passive: true })`.
       If `isDragging`: dispatch `DragFeedAction`.
     - Register `canvas.addEventListener('pointerup', handler, { passive: true })`.
       `isDragging = false`. Call `canvas.releasePointerCapture(e.pointerId)`.
     - Create HammerJS manager:
       ```typescript
       const mc = new Hammer.Manager(canvas);
       mc.add(new Hammer.Pinch({ threshold: 0.1 }));
       mc.add(new Hammer.Pan({ direction: Hammer.DIRECTION_ALL, threshold: 5 }));
       mc.on('pinch', e => this._dispatch({ type: 'zoom', scale: e.scale }));
       mc.on('panstart', () => { this.isDragging = true; });
       mc.on('panmove', e => this._dispatch({ type: 'dragfeed', worldX: ..., worldZ: ... }));
       mc.on('panend', () => { this.isDragging = false; });
       ```
  6. In `_screenToWorld(sx, sy, sceneManager)`:
     - Create `THREE.Raycaster`. Set from camera using `raycaster.setFromCamera(ndc, camera)`
       where `ndc = new THREE.Vector2((sx/w)*2-1, -(sy/h)*2+1)`.
     - Intersect a horizontal plane at `y = WATER_Y`:
       `const plane = new THREE.Plane(new THREE.Vector3(0,1,0), -WATER_Y)`.
       `raycaster.ray.intersectPlane(plane, target)`.
     - Clamp `target.x` to `[−TANK.W/2+0.2, TANK.W/2−0.2]`,
       `target.z` to `[−TANK.D/2+0.2, TANK.D/2−0.2]`.
     - Return `{ x: target.x, z: target.z }`.
  7. Edge case: if `_screenToWorld` returns no intersection (ray parallel to plane), skip
     dispatch rather than passing `NaN` coordinates.
  8. For `SelectAction`, ray-cast against all `FishAgent.mesh` and decoration meshes using
     `THREE.Raycaster.intersectObjects(scene.children, true)` in `HUD` (DI-016) — the
     `InputManager` dispatches screen coordinates only; `HUD` performs the intersection.
- **SKILLSET REQUIRED:** Pointer Events API, HammerJS 2.x, Three.js Raycaster.
- **NOTES:** `canvas.setPointerCapture` requires calling `preventDefault()` on the
  `pointerdown` event for non-passive listeners — this is why `pointerdown` is registered
  with `{ passive: false }`.
- **RELATED:** BR-016, BR-018, BR-020, BR-021, BR-022, BR-032, BR-033, BR-034. AR-008. PT-015.

---

## DI-016 : HUD OVERLAY

- **SUMMARY:** Implement `src/ui/HUD.ts` and `src/ui/hud.css` — creates the DOM control
  panel with camera toggle, substrate selector, decoration checkboxes, and audio toggle;
  handles fish/decoration selection display.
- **IMPLEMENTATION STEPS:**
  1. Create `src/ui/hud.css`:
     ```css
     * { box-sizing: border-box; margin: 0; padding: 0; }
     body { overflow: hidden; background: #000; }
     canvas#tank-canvas { display: block; width: 100vw; height: 100vh; }
     #hud-root {
       position: absolute; top: 0; left: 0; width: 100%; height: 100%;
       pointer-events: none;
     }
     #hud-controls {
       position: absolute; top: 8px; left: 8px;
       background: rgba(13,17,23,0.82); border: 1px solid #3d444d;
       border-radius: 8px; padding: 10px 14px; pointer-events: all;
       display: flex; flex-direction: column; gap: 8px; min-width: 180px;
     }
     #hud-controls label { color: #c9d1d9; font: 12px 'Segoe UI', system-ui, sans-serif; }
     #hud-controls button, #hud-controls select {
       background: #21262d; color: #c9d1d9; border: 1px solid #3d444d;
       border-radius: 4px; padding: 4px 8px; cursor: pointer; font-size: 12px;
     }
     #hud-controls button.active { background: #1f6feb; border-color: #79c0ff; color: #e6edf3; }
     #selection-card {
       position: absolute; bottom: 20px; right: 20px;
       background: rgba(13,17,23,0.88); border: 1px solid #3d444d;
       border-radius: 8px; padding: 10px 14px; color: #e6edf3;
       font: 12px 'Segoe UI', system-ui, sans-serif; pointer-events: none;
       display: none; min-width: 140px;
     }
     #selection-card.visible { display: block; }
     ```
  2. Create `src/ui/HUD.ts`:
     ```typescript
     export class HUD {
       private selectionCard: HTMLDivElement;
       constructor(
         hudRoot: HTMLDivElement,
         appState: AppState,
         inputManager: InputManager,
         sceneManager: SceneManager
       ) { ... }
       showSelection(name: string, description: string): void { ... }
       hideSelection(): void { ... }
     }
     ```
  3. In `constructor`:
     - Create `#hud-controls` div. Append to `hudRoot`.
     - **Camera mode row:** Create two `<button>` elements labelled "Isometric" and "3/4".
       On click: `appState.set('cameraMode', ...)`. Subscribe to `appState` and update
       `.active` class accordingly.
     - **Substrate row:** Create `<label>` + `<select>` with options "sand", "gravel", "rock".
       On change: `appState.set('substrateType', select.value as ...)`.
     - **Decoration rows:** For each key in `['shipwreck', 'rocks', 'artifacts']`, create
       `<label><input type="checkbox" /> Label text</label>`. On change: merge into
       `appState.get('decorations')` and call `appState.set('decorations', ...)`.
     - **Audio row:** Create toggle `<button>`. On click: `appState.set('audioEnabled', !appState.get('audioEnabled'))`.
       Subscribe and update button text ("Audio ON" / "Audio OFF").
     - Create `#selection-card` div; append to `hudRoot`. Store reference.
     - Register `inputManager.onAction(action => { if (action.type === 'select') _handleSelect(action, sceneManager); })`.
  4. `_handleSelect(action, sceneManager)`:
     - Build `THREE.Raycaster` from screen coords against `sceneManager.activeCamera`.
     - Call `raycaster.intersectObjects(sceneManager.scene.children, true)`.
     - If first hit is a fish mesh: `showSelection(species.id, 'Species: ' + species.id)`.
     - If first hit is a decoration mesh: `showSelection(mesh.name, 'Decoration: ' + mesh.name)`.
     - If no hit: `hideSelection()`.
  5. `showSelection(name, description)`:
     - Set `selectionCard.innerHTML = \`<strong>\${name}</strong><br/>\${description}\``.
     - Add class `visible`.
  6. `hideSelection()`: remove class `visible`.
  7. Edge case: `_handleSelect` must guard against `sceneManager.scene.children` being
     modified during iteration — use a snapshot array copy.
- **SKILLSET REQUIRED:** DOM manipulation, TypeScript, Three.js Raycaster.
- **NOTES:** The HUD `pointer-events: none` rule on `#hud-root` allows clicks to pass
  through to the canvas except on `#hud-controls` which re-enables pointer events. This
  ensures feeding/selection clicks on the tank area work even when HUD is visible.
- **RELATED:** BR-003, BR-004, BR-006, BR-007, BR-008, BR-020, BR-021, BR-022. AR-007, AR-008. PT-016.

---

## DI-017 : APPLICATION BOOTSTRAP

- **SUMMARY:** Implement `src/main.ts` — initialises all subsystems in dependency order,
  wires subsystem references, and starts the render loop.
- **IMPLEMENTATION STEPS:**
  1. Create `src/main.ts`.
  2. Import all subsystem classes in dependency order. Do not import anything at module scope
     that triggers side effects.
  3. Implement a single async `main()` function and call it:
     ```typescript
     async function main(): Promise<void> {
       const canvas  = document.getElementById('tank-canvas') as HTMLCanvasElement;
       const hudRoot = document.getElementById('hud-root')    as HTMLDivElement;

       // 1. State (no deps)
       const appState = AppState.instance();

       // 2. Renderer (depends on canvas)
       const renderer = new Renderer(canvas);

       // 3. Scene (depends on renderer + appState)
       const sceneManager = new SceneManager(renderer, appState);

       // 4. Simulation grid (no scene dep)
       const fluidGrid = new FluidGrid();

       // 5. Particles (depends on scene + grid)
       const particles = new ParticleSystem(sceneManager.scene, fluidGrid);

       // 6. Bubbles (depends on scene + grid + appState)
       const bubbles = new BubbleSystem(sceneManager.scene, fluidGrid, appState);

       // 7. Environment (depends on scene + appState)
       const environment = new EnvironmentConfig(sceneManager.scene, appState);

       // 8. Plants (depends on scene + grid + obstacles)
       const plants = new PlantSystem(sceneManager.scene, fluidGrid, environment.obstacleBounds);

       // 9. Fish (depends on scene + appState + obstacles + grid + particles)
       const fish = new FishManager(sceneManager.scene, appState, environment.obstacleBounds, fluidGrid, particles);

       // 10. Audio (depends on appState)
       const audio = new AudioManager(appState);

       // 11. Input (depends on canvas + audio + sceneManager)
       const input = new InputManager(canvas, audio, sceneManager);

       // 12. HUD (depends on hudRoot + appState + input + sceneManager)
       const hud = new HUD(hudRoot, appState, input, sceneManager);

       // 13. Wire feeding action to particle spawn
       let elapsed = 0;
       input.onAction(action => {
         if (action.type === 'feed' || action.type === 'dragfeed') {
           particles.spawnFood(action.worldX, sceneManager.WATER_Y - 0.05, action.worldZ);
         }
       });

       // 14. Register simulation tick callbacks
       renderer.onTick(dt => {
         elapsed += dt;
         input.update(dt);
         fluidGrid.step(dt);
         particles.update(dt);
         bubbles.update(dt);
         plants.update(dt, elapsed);
         fish.update(dt);
       });

       // 15. Start loop
       renderer.start();
     }

     main().catch(console.error);
     ```
  4. Export nothing from `main.ts` — it is the application entry point only.
  5. Edge case: `document.getElementById` may return null if the HTML is malformed. Add
     runtime guards:
     ```typescript
     if (!canvas) throw new Error('Canvas element #tank-canvas not found');
     if (!hudRoot) throw new Error('HUD root element #hud-root not found');
     ```
  6. Edge case: if `new Renderer(canvas)` throws (WebGL not supported), the error propagates
     to `main().catch(console.error)` which logs it. No additional handling needed.
- **SKILLSET REQUIRED:** TypeScript module system, async/await, dependency ordering.
- **NOTES:** The `SceneManager` constructor (DI-005 step 4) registers its own `renderer.onTick`
  callback to call `renderer.threeRenderer.render(scene, camera)`. The render call must happen
  after all simulation ticks in the same frame — the `SceneManager` tick callback is registered
  before the simulation callbacks above (step 14) but the render call inside it checks
  `requestAnimationFrame` ordering: all `onTick` callbacks are called in registration order.
  Register `SceneManager`'s render tick last by moving its registration here instead of in
  the `SceneManager` constructor. To do this: expose a `render()` method on `SceneManager`
  and call it as the last `renderer.onTick` callback in `main.ts`.
- **RELATED:** BR-001. AR-005. PT-002.

---

## DI-018 : STATIC AUDIO PLACEHOLDER ASSETS

- **SUMMARY:** Create four minimal placeholder audio files so Howler.js does not log network
  errors in development. These are 1-second silence files.
- **IMPLEMENTATION STEPS:**
  1. Create `build/assets/audio/ambient-underwater.mp3` — a valid MP3 file containing 1 second
     of silence (44100 Hz, mono). Generate using any available tool:
     - With ffmpeg: `ffmpeg -f lavfi -i anullsrc=r=44100:cl=mono -t 1 -q:a 9 ambient-underwater.mp3`.
     - If ffmpeg is unavailable, use a minimal MP3 binary: any existing 1-second-silence.mp3
       from the web (public domain) is acceptable.
  2. Copy the same file to:
     - `build/assets/audio/ambient-underwater.ogg` (OGG fallback — same silence content,
       re-encode with ffmpeg: `ffmpeg -i silence.mp3 -c:a libvorbis ambient-underwater.ogg`).
     - `build/assets/audio/ambient-bubbles.mp3`.
     - `build/assets/audio/ambient-bubbles.ogg`.
  3. If ffmpeg is unavailable, create zero-byte placeholder files. Howler will fail to play
     silently — log a warning in `AudioManager` — but the app must not crash.
  4. Note: these are placeholder assets. Production audio is outside implementation scope for
     this pipeline run.
- **SKILLSET REQUIRED:** ffmpeg or equivalent audio tool; shell.
- **NOTES:** These files are in `build/assets/` (not `src/`) because they are binary assets
  served directly. Vite copies `public/` contents, but these are placed in `build/` directly
  since they are not TypeScript-importable source assets. Alternatively, move to
  `public/assets/audio/` and reference via `/assets/audio/...` in `AudioManager` — either
  location is acceptable as long as the path in `AudioManager` matches.
- **RELATED:** BR-006. AR-006. PT-014.

---

## DI-019 : SCALE TEXTURE SHADER AND FISH PBR MATERIAL

- **SUMMARY:** Create `src/fish/ScaleTextureShader.ts` that generates a per-species procedural
  scale texture using a GLSL fragment shader rendered into a `THREE.DataTexture`. Create
  `src/fish/FishMesh.ts` factory that builds the fish body mesh with the scale material, plus
  separate fin overlay meshes and an eye sphere mesh.
- **IMPLEMENTATION STEPS:**
  1. Create `src/fish/ScaleTextureShader.ts`:
     ```typescript
     import * as THREE from 'three';

     export interface ScaleTextureOptions {
       scaleRows: number;      // default 14
       baseColour: string;     // CSS hex e.g. '#1a5c7a'
       highlightColour: string; // CSS hex e.g. '#2a8fbb'
       size: number;           // texture size, default 256
     }

     export function generateScaleTexture(
       renderer: THREE.WebGLRenderer,
       opts: ScaleTextureOptions
     ): THREE.Texture {
       const { size = 256, scaleRows = 14, baseColour, highlightColour } = opts;
       const fragShader = `
         uniform vec3 uBase;
         uniform vec3 uHighlight;
         uniform float uRows;
         varying vec2 vUv;
         void main() {
           vec2 uv = vUv;
           float cols = uRows * 1.8;
           vec2 cell = vec2(floor(uv.x * cols), floor(uv.y * uRows));
           float offset = mod(cell.y, 2.0) * 0.5;
           vec2 local = vec2(
             fract(uv.x * cols + offset),
             fract(uv.y * uRows)
           );
           float dist = length(local - vec2(0.5));
           float edge = smoothstep(0.38, 0.48, dist);
           vec3 colour = mix(uBase, uHighlight, edge * 0.7);
           gl_FragColor = vec4(colour, 1.0);
         }
       `;
       const scene = new THREE.Scene();
       const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
       const geo = new THREE.PlaneGeometry(2, 2);
       const mat = new THREE.ShaderMaterial({
         fragmentShader: fragShader,
         vertexShader: `varying vec2 vUv; void main() { vUv = uv; gl_Position = vec4(position, 1.0); }`,
         uniforms: {
           uBase: { value: new THREE.Color(baseColour) },
           uHighlight: { value: new THREE.Color(highlightColour) },
           uRows: { value: scaleRows },
         },
       });
       const mesh = new THREE.Mesh(geo, mat);
       scene.add(mesh);
       const rt = new THREE.WebGLRenderTarget(size, size, { minFilter: THREE.LinearMipmapLinearFilter, generateMipmaps: true });
       renderer.setRenderTarget(rt);
       renderer.render(scene, camera);
       renderer.setRenderTarget(null);
       mat.dispose(); geo.dispose();
       return rt.texture;
     }
     ```
  2. Create `src/fish/FishMesh.ts`:
     ```typescript
     import * as THREE from 'three';
     import { generateScaleTexture } from './ScaleTextureShader';

     export interface FishMeshOptions {
       length: number;   // body length in world units, e.g. 60
       height: number;   // body height in world units, e.g. 22
       baseColour: string;
       highlightColour: string;
     }

     export function createFishMesh(renderer: THREE.WebGLRenderer, opts: FishMeshOptions): THREE.Object3D {
       const root = new THREE.Object3D();

       // Body
       const bodyGeo = new THREE.SphereGeometry(1, 16, 10);
       bodyGeo.scale(opts.length / 2, opts.height / 2, opts.height * 0.6);
       const scaleTex = generateScaleTexture(renderer, { scaleRows: 14, baseColour: opts.baseColour, highlightColour: opts.highlightColour, size: 256 });
       const bodyMat = new THREE.MeshStandardMaterial({ map: scaleTex, roughness: 0.7, metalness: 0.05 });
       const bodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
       root.add(bodyMesh);

       // Dorsal fin
       const dorsalGeo = new THREE.PlaneGeometry(opts.length * 0.45, opts.height * 0.7);
       dorsalGeo.translate(0, opts.height * 0.85, 0);
       const finMat = new THREE.MeshStandardMaterial({ color: opts.highlightColour, transparent: true, opacity: 0.35, side: THREE.DoubleSide });
       const dorsalFin = new THREE.Mesh(dorsalGeo, finMat);
       root.add(dorsalFin);

       // Pectoral fins (L and R)
       for (const side of [-1, 1]) {
         const pectGeo = new THREE.PlaneGeometry(opts.length * 0.25, opts.height * 0.55);
         pectGeo.translate(opts.length * -0.15, 0, side * opts.height * 0.35);
         const pectFin = new THREE.Mesh(pectGeo, finMat.clone());
         (pectFin.material as THREE.MeshStandardMaterial).opacity = 0.45;
         pectFin.name = side === -1 ? 'pectLeft' : 'pectRight';
         root.add(pectFin);
       }

       // Caudal fin (tail)
       const caudalGeo = new THREE.PlaneGeometry(opts.length * 0.3, opts.height * 1.1);
       caudalGeo.translate(opts.length * 0.5, 0, 0);
       const caudalFin = new THREE.Mesh(caudalGeo, finMat.clone());
       (caudalFin.material as THREE.MeshStandardMaterial).opacity = 0.5;
       caudalFin.name = 'caudal';
       root.add(caudalFin);

       // Eye
       const eyeGeo = new THREE.SphereGeometry(opts.height * 0.18, 8, 6);
       const eyeMat = new THREE.MeshStandardMaterial({ color: '#0a0a0a', roughness: 0.9, metalness: 0.0 });
       const eyeMesh = new THREE.Mesh(eyeGeo, eyeMat);
       eyeMesh.position.set(-opts.length * 0.42, opts.height * 0.1, opts.height * 0.28);
       root.add(eyeMesh);
       // Eye specular disc
       const specGeo = new THREE.SphereGeometry(opts.height * 0.07, 6, 4);
       const specMat = new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.0, metalness: 0.1, transparent: true, opacity: 0.9 });
       const specMesh = new THREE.Mesh(specGeo, specMat);
       specMesh.position.copy(eyeMesh.position);
       specMesh.position.z += opts.height * 0.08;
       specMesh.position.y += opts.height * 0.08;
       root.add(specMesh);

       return root;
     }
     ```
- **SKILLSET REQUIRED:** TypeScript, Three.js, GLSL.
- **NOTES:** `generateScaleTexture` renders once per species instance at initialisation; the
  WebGLRenderTarget texture is then used as a static map. The `renderer` reference must be
  passed from the top-level bootstrap (PT-002). Fin meshes are children of `root` and inherit
  its transform. Fin opacity values match PT-020 spec.
- **RELATED:** BR-038, BR-039. AR-010. PT-019, PT-020, PT-021.

---

## DI-020 : FISH ANIMATOR — SKELETAL ANIMATION SYSTEM

- **SUMMARY:** Create `src/fish/FishAnimator.ts` implementing bone-chain skeletal animation
  with `THREE.Skeleton`, `THREE.AnimationMixer`, and four `AnimationClip` instances
  (idle, cruise, burst, cstart). Expose `setSpeedState()`, `triggerCStart()`, and `update()`.
- **IMPLEMENTATION STEPS:**
  1. Create `src/fish/FishAnimator.ts`:
     ```typescript
     import * as THREE from 'three';

     export type SpeedState = 'idle' | 'cruise' | 'burst';

     const CROSSFADE: Record<string, number> = {
       'idle->cruise': 0.4, 'cruise->idle': 0.6,
       'cruise->burst': 0.2, 'burst->cruise': 0.6,
       'idle->burst': 0.3, 'burst->idle': 0.8,
     };

     // Spine bone rotation amplitudes (radians) per speed state
     const AMP: Record<SpeedState, number> = { idle: 0.08, cruise: 0.20, burst: 0.38 };
     // Tail beat period (seconds) per speed state
     const PERIOD: Record<SpeedState, number> = { idle: 2.0, cruise: 1.0, burst: 0.45 };

     function makeSinClip(name: string, bones: THREE.Bone[], amp: number, period: number): THREE.AnimationClip {
       const tracks: THREE.KeyframeTrack[] = [];
       const numFrames = 16;
       const times = Array.from({ length: numFrames + 1 }, (_, i) => (i / numFrames) * period);
       bones.forEach((bone, i) => {
         if (i === 0) return; // head bone does not rotate
         const phase = (i / bones.length) * Math.PI;
         const rearWeight = i / bones.length;
         const values: number[] = [];
         times.forEach(t => {
           const angle = Math.sin((2 * Math.PI * t / period) + phase) * amp * rearWeight;
           const q = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, angle, 0));
           values.push(q.x, q.y, q.z, q.w);
         });
         tracks.push(new THREE.QuaternionKeyframeTrack(`${bone.name}.quaternion`, times, values));
       });
       return new THREE.AnimationClip(name, period, tracks);
     }

     function makeCStartClip(bones: THREE.Bone[]): THREE.AnimationClip {
       // Frame 0: straight; Frame 1 (0.08 s): max C-bend; Frame 2 (0.25 s): back to straight
       const times = [0, 0.08, 0.25];
       const tracks: THREE.KeyframeTrack[] = [];
       bones.forEach((bone, i) => {
         if (i < 2) return;
         const bendAmp = 0.6 * (i / bones.length);
         const q0 = new THREE.Quaternion();
         const q1 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, bendAmp, 0));
         const values = [...q0.toArray(), ...q1.toArray(), ...q0.toArray()];
         tracks.push(new THREE.QuaternionKeyframeTrack(`${bone.name}.quaternion`, times, values));
       });
       return new THREE.AnimationClip('cstart', 0.25, tracks);
     }

     export class FishAnimator {
       private mixer: THREE.AnimationMixer;
       private actions: Record<string, THREE.AnimationAction>;
       private currentState: SpeedState = 'idle';
       private bones: THREE.Bone[];
       private pectBones: THREE.Bone[];

       constructor(skinnedMesh: THREE.SkinnedMesh, bones: THREE.Bone[], pectBones: THREE.Bone[]) {
         this.mixer = new THREE.AnimationMixer(skinnedMesh);
         this.bones = bones;
         this.pectBones = pectBones;

         const clips = {
           idle:   makeSinClip('idle',   bones, AMP.idle,   PERIOD.idle),
           cruise: makeSinClip('cruise', bones, AMP.cruise, PERIOD.cruise),
           burst:  makeSinClip('burst',  bones, AMP.burst,  PERIOD.burst),
           cstart: makeCStartClip(bones),
         };
         this.actions = {};
         for (const [key, clip] of Object.entries(clips)) {
           this.actions[key] = this.mixer.clipAction(clip);
         }
         this.actions.idle.play();
       }

       setSpeedState(next: SpeedState): void {
         if (next === this.currentState) return;
         const key = `${this.currentState}->${next}`;
         const duration = CROSSFADE[key] ?? 0.4;
         this.actions[this.currentState].crossFadeTo(this.actions[next], duration, true);
         this.actions[next].play();
         this.currentState = next;
         // Pectoral fin fan angle: idle=35°, cruise=15°, burst=0°
         const pectAngle = { idle: 0.61, cruise: 0.26, burst: 0.0 }[next];
         this.pectBones.forEach(b => b.rotation.z = pectAngle);
       }

       triggerCStart(): void {
         const cstart = this.actions.cstart;
         cstart.reset().play();
         cstart.clampWhenFinished = true;
         cstart.loop = THREE.LoopOnce;
         this.mixer.addEventListener('finished', (e) => {
           if (e.action === cstart) {
             this.setSpeedState('burst');
             this.mixer.removeEventListener('finished', () => {});
           }
         });
       }

       update(dt: number): void {
         this.mixer.update(dt);
       }
     }
     ```
  2. In `src/fish/Fish.ts`, import and instantiate `FishAnimator` after creating the fish mesh:
     ```typescript
     // After buildBoneChain() returns { skinnedMesh, bones, pectBones }:
     this.animator = new FishAnimator(skinnedMesh, bones, pectBones);
     ```
  3. In the game loop tick, call `this.animator.update(dt)` for each fish.
  4. In `src/fish/FishBehaviour.ts`, detect cursor proximity:
     ```typescript
     const dist = fish.position.distanceTo(cursorWorld);
     if (dist < CSTART_THRESHOLD && !fish.cstartCooldown) {
       fish.animator.triggerCStart();
       fish.cstartCooldown = 3.0; // seconds
     }
     ```
     Define `CSTART_THRESHOLD = 80` (world units).
- **SKILLSET REQUIRED:** TypeScript, Three.js AnimationMixer, quaternion keyframe animation.
- **NOTES:** `makeSinClip` generates keyframe tracks as sine waves with phase offsets per bone,
  producing rear-body wave propagation. Bone index 0 (head) is excluded from rotation.
  `rearWeight` scales amplitude by bone position so the head moves less than the tail.
  The pectoral bone fan-angle update happens synchronously in `setSpeedState` — this is
  intentional since pectoral fan state changes are instantaneous style choices, not animated.
- **RELATED:** BR-041, BR-042, BR-043, BR-044. AR-011. PT-022.

---

## DI-021 : CRAB ENTITY

- **SUMMARY:** Create `src/scene/CrabEntity.ts` implementing the full crab `THREE.Object3D`
  hierarchy, procedural gait oscillator for 8-leg alternating lateral locomotion, claw idle
  animation, and defensive display on click.
- **IMPLEMENTATION STEPS:**
  1. Create `src/scene/CrabEntity.ts`:
     ```typescript
     import * as THREE from 'three';

     const CARAPACE_COLOUR = 0x7c3f1e;
     const LEG_COLOUR = 0x5a2d12;
     const GAIT_FREQ = 1.5; // Hz
     const SIDE_SPEED = 18; // world units/sec
     const INTERACT_RADIUS = 120; // world units
     const PHASE_OFFSETS = [0, Math.PI / 4, Math.PI / 2, (3 * Math.PI) / 4];

     export class CrabEntity {
       readonly root = new THREE.Object3D();
       private legs: THREE.Object3D[][] = []; // [legIndex][segmentIndex]
       private claws: THREE.Object3D[][] = [];
       private mixer = new THREE.AnimationMixer(new THREE.Object3D());
       private defenseAction?: THREE.AnimationAction;
       private gaitTime = 0;
       private direction = 1; // 1 = right, -1 = left
       private walkTime = 0;

       constructor() {
         this.buildCarapace();
         this.buildLegs();
         this.buildClaws();
         this.buildDefenseClip();
       }

       private buildCarapace(): void {
         const geo = new THREE.CylinderGeometry(80, 65, 30, 8);
         geo.applyMatrix4(new THREE.Matrix4().makeRotationX(Math.PI / 2));
         const mat = new THREE.MeshStandardMaterial({ color: CARAPACE_COLOUR, roughness: 0.8, metalness: 0.1 });
         this.root.add(new THREE.Mesh(geo, mat));
       }

       private buildLegs(): void {
         for (let side = 0; side < 2; side++) {
           const sideSign = side === 0 ? -1 : 1;
           for (let i = 0; i < 4; i++) {
             const chain: THREE.Object3D[] = [];
             const legRoot = new THREE.Object3D();
             legRoot.position.set(sideSign * 70, -10, (i - 1.5) * 25);
             this.root.add(legRoot);
             chain.push(legRoot);
             // 3 segments: coxa, merus, dactyl
             let parent = legRoot;
             const lengths = [22, 20, 18];
             for (const len of lengths) {
               const seg = new THREE.Object3D();
               seg.position.set(sideSign * len, 0, 0);
               parent.add(seg);
               const geo = new THREE.CylinderGeometry(4, 3, len, 6);
               geo.applyMatrix4(new THREE.Matrix4().makeRotationZ(Math.PI / 2));
               seg.add(new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color: LEG_COLOUR })));
               chain.push(seg);
               parent = seg;
             }
             this.legs.push(chain);
           }
         }
       }

       private buildClaws(): void {
         for (let side = 0; side < 2; side++) {
           const sideSign = side === 0 ? -1 : 1;
           const clawRoot = new THREE.Object3D();
           clawRoot.position.set(sideSign * 72, 5, -55);
           this.root.add(clawRoot);
           const chain: THREE.Object3D[] = [clawRoot];
           const merus = new THREE.Object3D();
           merus.position.set(sideSign * 25, 0, 0);
           clawRoot.add(merus);
           chain.push(merus);
           const dactyl = new THREE.Object3D();
           dactyl.position.set(sideSign * 20, 0, 0);
           merus.add(dactyl);
           const geo = new THREE.SphereGeometry(10, 6, 4);
           dactyl.add(new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color: CARAPACE_COLOUR })));
           chain.push(dactyl);
           this.claws.push(chain);
         }
       }

       private buildDefenseClip(): void {
         const times = [0, 0.3, 2.5, 2.8];
         const tracks: THREE.KeyframeTrack[] = [];
         this.claws.forEach((chain, side) => {
           const merus = chain[1];
           const sideSign = side === 0 ? -1 : 1;
           // Raise merus to 80 degrees then return
           const q0 = new THREE.Quaternion();
           const q1 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, sideSign * 1.4));
           tracks.push(new THREE.QuaternionKeyframeTrack(
             `${merus.uuid}.quaternion`,
             times,
             [...q0.toArray(), ...q1.toArray(), ...q1.toArray(), ...q0.toArray()]
           ));
         });
         const clip = new THREE.AnimationClip('defense', 2.8, tracks);
         this.defenseAction = this.mixer.clipAction(clip);
         this.defenseAction.loop = THREE.LoopOnce;
         this.defenseAction.clampWhenFinished = true;
       }

       onInteract(clickWorldPos: THREE.Vector3): void {
         const dist = this.root.position.distanceTo(clickWorldPos);
         if (dist < INTERACT_RADIUS) {
           this.defenseAction?.reset().play();
         }
       }

       update(dt: number): void {
         this.gaitTime += dt;
         this.walkTime += dt;
         // Gait oscillator: move legs based on sine phase
         this.legs.forEach((chain, legIdx) => {
           const side = legIdx < 4 ? 0 : 1;
           const localIdx = legIdx % 4;
           const phase = PHASE_OFFSETS[localIdx] + (side === 1 ? Math.PI : 0);
           const angle = Math.sin(2 * Math.PI * GAIT_FREQ * this.gaitTime + phase) * 0.35;
           chain[1].rotation.x = angle;
         });
         // Lateral movement
         if (this.walkTime > 4.0) { this.direction *= -1; this.walkTime = 0; }
         this.root.position.x += this.direction * SIDE_SPEED * dt;
         // Clamp to tank bounds
         this.root.position.x = THREE.MathUtils.clamp(this.root.position.x, -380, 380);
         this.mixer.update(dt);
       }
     }
     ```
  2. In `src/scene/SceneManager.ts`, instantiate `CrabEntity` and add its `root` to the scene:
     ```typescript
     this.crab = new CrabEntity();
     this.crab.root.position.set(0, SUBSTRATE_Y + 15, 0);
     this.scene.add(this.crab.root);
     ```
  3. In `src/input/InputManager.ts`, on click events pass the world-space position to
     `sceneManager.crab.onInteract(worldPos)`.
  4. In the game loop, call `this.crab.update(dt)`.
- **SKILLSET REQUIRED:** TypeScript, Three.js Object3D hierarchy, AnimationMixer.
- **NOTES:** `SUBSTRATE_Y` is the world-space y coordinate of the tank floor, defined in
  `SceneManager`. The `mixer` in `CrabEntity` uses `new THREE.Object3D()` as its root since
  `AnimationMixer` expects an Object3D but the claw tracks reference child UUIDs directly.
  Alternatively, use the `this.root` as the mixer root and reference bone names via `name`
  properties set on the claw chain nodes. Either approach is acceptable; consistency is required.
- **RELATED:** BR-045, BR-046, BR-047, BR-048. AR-012. PT-023.

---

## DI-022 : FRONT-WINDOW CAMERA MODE

- **SUMMARY:** Create `src/ui/FrontWindowMode.ts` implementing the clean front-window view mode:
  orthographic camera switch, HUD DOM visibility toggle, Escape key handler, and corner exit button.
- **IMPLEMENTATION STEPS:**
  1. In `src/state/AppState.ts`, add `frontWindowMode: boolean = false` to the state object
     and ensure `notify('frontWindowMode')` is called when it changes.
  2. Create `src/ui/FrontWindowMode.ts`:
     ```typescript
     import * as THREE from 'three';
     import { AppState } from '../state/AppState';
     import { Renderer } from '../renderer/Renderer';

     const TANK_W = 800;
     const TANK_H = 500;

     export function initFrontWindowMode(appState: AppState, renderer: Renderer): void {
       const orthoCamera = new THREE.OrthographicCamera(
         -TANK_W / 2, TANK_W / 2,
         TANK_H / 2, -TANK_H / 2,
         0.1, 2000
       );
       orthoCamera.position.set(0, 0, 500);
       orthoCamera.lookAt(0, 0, 0);

       const hudRoot = document.getElementById('hud-root')!;

       // Create corner exit button
       const exitBtn = document.createElement('button');
       exitBtn.id = 'exit-window-btn';
       exitBtn.innerHTML = `<svg width="18" height="18" viewBox="0 0 18 18" fill="none">
         <path d="M3 3 L15 3 L15 15" stroke="currentColor" stroke-width="2"/>
         <line x1="3" y1="3" x2="15" y2="15" stroke="currentColor" stroke-width="2"/>
       </svg>`;
       Object.assign(exitBtn.style, {
         position: 'absolute', top: '8px', right: '8px',
         opacity: '0.5', zIndex: '10', background: 'none',
         border: 'none', cursor: 'pointer', color: '#8b949e',
         display: 'none',
       });
       exitBtn.setAttribute('aria-label', 'Exit window mode');
       document.body.appendChild(exitBtn);

       function activate(): void {
         appState.frontWindowMode = true;
         renderer.setCamera(orthoCamera);
         hudRoot.style.display = 'none';
         exitBtn.style.display = 'block';
       }

       function deactivate(): void {
         appState.frontWindowMode = false;
         renderer.setCamera(renderer.defaultCamera);
         hudRoot.style.display = '';
         exitBtn.style.display = 'none';
       }

       // Escape key handler
       document.addEventListener('keydown', (e) => {
         if (e.key === 'Escape' && appState.frontWindowMode) deactivate();
       });

       exitBtn.addEventListener('click', deactivate);

       // Window Mode button in HUD calls activate()
       document.getElementById('btn-window-mode')?.addEventListener('click', activate);
     }
     ```
  3. In `src/ui/HUD.ts`, add a "Window Mode" button:
     ```typescript
     const winBtn = document.createElement('button');
     winBtn.id = 'btn-window-mode';
     winBtn.textContent = 'Window';
     winBtn.className = 'hud-btn';
     hudRoot.appendChild(winBtn);
     ```
  4. In `src/renderer/Renderer.ts`, expose `setCamera(cam: THREE.Camera)`:
     ```typescript
     private _camera: THREE.Camera;
     get defaultCamera(): THREE.Camera { return this._defaultCamera; }
     setCamera(cam: THREE.Camera): void { this._camera = cam; }
     ```
     Use `this._camera` in the render loop instead of a hard-coded camera reference.
  5. In `src/main.ts`, call `initFrontWindowMode(appState, renderer)` after HUD initialisation.
- **SKILLSET REQUIRED:** TypeScript, Three.js, DOM API.
- **NOTES:** `TANK_W` and `TANK_H` should match the actual scene dimensions defined in
  `SceneManager`. The exit button SVG uses a minimal resize-arrow icon. `focus-visible` CSS
  should be applied to `#exit-window-btn` in `index.html` styles for keyboard accessibility.
  The simulation tick is not paused — only camera and HUD visibility change.
- **RELATED:** BR-049, BR-050, BR-051, BR-052. AR-013. PT-024.

---

## Exit Gate

- [x] Every BR/AR pair has at least one DI.
- [x] Every DI has all five schema sections (SUMMARY, IMPLEMENTATION STEPS, SKILLSET REQUIRED, NOTES, RELATED).
- [x] No DI contains "TBD", placeholder text, or steps that defer work to the Developer's judgment.
- [x] Every file path in implementation steps is complete and relative.
- [x] DI IDs are sequential and non-reused.
- [x] RELATED fields reference valid BR-IDs, AR-IDs, and PT-IDs.
- [x] `PIPELINE-STATUS.md` is updated for Stage 6 with STATUS and STATUS UPDATED date.
