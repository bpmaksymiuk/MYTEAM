# Bug Report — Fish Tank Simulator

- **Run ID:** T-PIPELINE-EXAMPLE-001
- **Date:** 2026-05-01
- **Product:** Fish Tank Simulator v0.1.0

---

## No Defects Found

All 36 test cases in run T-PIPELINE-EXAMPLE-001 passed. No bugs were identified during Stage 10 verification.

> Note: One defect was discovered and fixed during Stage 10 test execution prior to the final verified run. It is recorded below as a resolved issue for traceability.

---

## Resolved Issues (Fixed Before Final Run)

### RES-001 — GLSL ES 3.0 shader syntax incompatible with Three.js r165 ShaderMaterial

| Field        | Value |
|--------------|-------|
| **Severity** | Major |
| **Status**   | Resolved — Fixed during Stage 10 |
| **Discovered** | Stage 10 test execution |
| **Fixed by** | Developer (Stage 10 corrective action) |

**Description:**  
The three GLSL shader files (`water.vert`, `water.frag`, `caustics.frag`) used GLSL ES 3.0 explicit-output syntax (`in`/`out` declarations, `out vec4 fragColor`, explicit `in vec3 position`, `in vec2 uv`). Three.js r165 in `ShaderMaterial` mode (without `glslVersion: THREE.GLSL3`) injects its own attribute declarations and `pc_fragColor` output automatically, causing duplicate-declaration and multiple-output-location GLSL compile errors at runtime. These produced 2–3 `THREE.WebGLProgram: Shader Error` console errors per page load, causing T-023, T-030, T-034, and T-036 to fail.

**Fix Applied:**  
Converted all three shaders to Three.js standard ShaderMaterial style:
- Replaced `in vec3 position` / `in vec2 uv` with Three.js built-in injection (removed explicit declarations).
- Replaced `out vec2 vUv` / `out float vHeight` with GLSL ES 1.0 `varying` syntax.
- Replaced `out vec4 fragColor` / `fragColor = ...` with `gl_FragColor = ...`.
- Removed `#version 300 es` pragma (Three.js r165 manages this for WebGL2).
- Added `varying vec2 vUv` output to the caustic inline vertex shader in `SceneManager.ts`.

**Verification:** Zero console errors observed in headless diagnostic and confirmed by 36/36 test pass in final run.

---

## Open Defects

None.

---

# v0.2.0 Bug Report — 2026-05-02

## BUG-001 : Circular import — CrabEntity/SceneManager TDZ crash → blank canvas

- **Severity:** Critical (P0) — complete blank canvas, app non-functional
- **Status:** RESOLVED before test run
- **Discovered:** Browser opened to http://localhost:5173 — console showed `ReferenceError: Cannot access 'TANK_W' before initialization at CrabEntity.ts:9`
- **Root cause:** `CrabEntity.ts` imported `{ TANK_W, TANK_H }` from `@/scene/SceneManager`. `SceneManager.ts` imports `{ CrabEntity }` from `@/scene/CrabEntity`. This circular dependency caused a JavaScript Temporal Dead Zone (TDZ) error: when `CrabEntity.ts` was evaluated, the `TANK_W`/`TANK_H` exports from `SceneManager.ts` had not yet been initialised (ES module bindings exist but are not yet assigned).
- **Fix:** Removed the import of `TANK_W`/`TANK_H` from `SceneManager` in `CrabEntity.ts`. Replaced with locally-defined `const TANK_W = 12; const TANK_H = 6;` (same values — these are architectural constants unlikely to change independently).
- **Files changed:** `build/src/scene/CrabEntity.ts` (line 2 — replaced import with inline consts)
- **Verified by:** T-044, T-045, T-046, T-047, T-052 all PASS; canvas renders correctly.

## Open Defects

None.
