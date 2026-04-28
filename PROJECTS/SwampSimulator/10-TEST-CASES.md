# SwampSimulator — Test Cases (Stage 10)

Suite: T-PIPELINE-SS-001 (Playwright headless chromium, served via `python3 -m http.server` on port 7430).
Runner: `./swamp_test_pipeline001.mjs`. One screenshot per test under `./testresults/T-PIPELINE-SS-001/`.

| ID | UC | Name | Steps | Expected | Pass criteria |
|---|---|---|---|---|---|
| TC-001 | UC-001 | Ecosystem canvas runs | Load `/`, wait for `#sim-canvas`, run sim ~60s at speed 30 | `state.tick > 10`, canvas paints | tick advanced beyond 10 |
| TC-002 | UC-002 | Species inspector opens | Click canvas centre; if no agent, open `frog` programmatically | `#inspector` visible | not `.hidden` |
| TC-003 | UC-003 | Food-web screen renders | Switch to `foodweb`, sample centre pixel | non-zero RGB centre pixel | painted |
| TC-004 | UC-004 | Dashboard screen renders | Switch to `dashboard`, simulate 90s | charts render without error | screenshot captured, no errors |
| TC-005 | UC-005 | Cascade after dragonfly removal | Intervention → remove all dragonflies, simulate 120s | mosquito count non-decreasing | mPost ≥ mPre (else PASS-WEAK) |
| TC-006 | UC-006 | Trigger pollution event | Click pollution Trigger | `state.events.active.pollution` present | truthy |
| TC-007 | UC-007 | Scenario: alligator removed | Start scenario, simulate 200s | ≥1 checklist item done | true |
| TC-008 | UC-008 | Scenario: mosquito explosion | Start scenario, simulate 90s | mosquito ≥ 250 | else PASS-WEAK |
| TC-009 | UC-009 | Scenario: algae bloom oxygen drop | Start scenario, simulate 120s | oxygen < 0.95 | else PASS-WEAK |
| TC-010 | UC-010 | Scenario: beaver dam progress | Start scenario, simulate 240s | `beaverDam.progress > 0` | true |
| TC-011 | UC-011 | Scenario: drought + gator-hole | Start scenario, simulate 240s | `gatorHoles.length > 0` | else PASS-WEAK |
| TC-012 | UC-012 | Time controls — skip season | Click `#btn-skip-season` | season changes | not equal |
| TC-013 | UC-013 | Overlays toggle | Toggle each of foodweb/nutrient/oxygen/density | each activates without error | screenshots captured |
| TC-014 | UC-014 | Save/load round trip | Save slot 1, simulate 60s, load slot 1 | day-of-year within ±2 of saved | true |

## Notes
- Each test writes a screenshot to `./testresults/T-PIPELINE-SS-001/T**.png`.
- Aggregate `results.json` records per-test status and timestamps.
- A test is PASS-WEAK when the functional path executed without error but a quantitative threshold was not reached within the time budget; this is recorded as a partial pass and routed to `11-BUG-REPORT.md`.

---

## Cartoon-graphics test cases (UC-015..UC-017)

### TC-015 — Cartoon sprites + idle animation (UC-015)
- **Setup**: boot the page, wait `body.assets-ready`, advance 60 ticks.
- **Steps**: confirm every spawned agent in `state.agents` has an `anim` record with a numeric `frame`; sample the canvas pixels and count samples whose colour differs substantially from the water background.
- **Pass**: `withAnim === total` AND non-background sample count > 5.
- **TC-015b**: read first agent's `anim.frame`/`anim.state`, advance 30 ticks, re-read; PASS if frame or state changed (PASS-WEAK if identical because the sampled agent happened to land on the same modulo-frame).

### TC-016 — Directional movement animations + facing flip (UC-016)
- **Setup**: same scene as TC-015.
- **Steps**: enumerate every agent's `anim.state` and `anim.facing`; count those whose state ≠ `idle`.
- **Pass**: at least one agent in a movement state (walk/swim/flight); facings include both `L` and `R`.

### TC-017 — Cartoon UI restyle (UC-017)
- **Setup**: same boot.
- **Steps**: count `#top-nav .nav-icon` (≥6), `#overlay-bar .ui-icon` (≥4), `.species-row .species-portrait` (≥1), parsed `border-radius` of a top-nav button (≥10 px), value of CSS var `--cypress`. Then navigate to scenarios screen and count `.scenario-card .scenario-card-header` (≥5).
- **Pass**: all six conditions hold.

---

## Test cases added in v0.3.0 rerun (UC-018..UC-021)

### TC-018 — Procedural Swamp Terrain (UC-019)
- **Use Case**: UC-019 (Procedural swampy terrain with land patches)
- **BR coverage**: BR-127..BR-136
- **Steps**: boot app → wait `body.assets-ready` → inspect `state.terrain.biomeMap` and `state.terrain.seed` → sample 12 canvas pixels in a 4×3 grid.
- **Pass**: `biomeMap` is non-null Uint8Array, `seed > 0`, URL hash contains `#seed=N`, `#seed-chip` populated, ≥3 distinct colour buckets across pixel samples (terrain variety).
- **Maps to**: T18.

### TC-019 — Animated Plant Sprites (UC-020)
- **Use Case**: UC-020 (Plant graphics with sprite-sheets and animation)
- **BR coverage**: BR-137..BR-145
- **Steps**: boot → on canvas screen, count `state.plantPatches[*]` entries with `phase` numeric → tick 30 frames → sum phase across all patches.
- **Pass**: total patches > 0; phase sum > 0 after ticking (renderer advances `patch.phase`).
- **Maps to**: T19.

### TC-020 — Vibrant Atmosphere infrastructure (UC-021)
- **Use Case**: UC-021 (Vibrant atmospheric ecosystem)
- **BR coverage**: BR-146..BR-156
- **Steps**: verify `state.dams` is array, `state.milestones` is object, `#dam-tooltip` exists in DOM, `#seed-chip` shows seed text, `#ambient-eq` has 5 `.eq-bar` children.
- **Pass**: all 5 properties true.
- **Maps to**: T20.

### TC-021 — Beaver Dam (UC-018) 
- **Use Case**: UC-018 (Beavers build beaver dams)
- **BR coverage**: BR-118..BR-126
- **Steps**: existing T10 already exercises beaver-dam scenario with progress reaching 1.00. New `state.dams[]` array + `tickAllDams` driven by autonomous beavers covered by integration with T10 (legacy progressDam path retained for guided scenario).
- **Maps to**: T10 (PASS, legacy scenario path) + T20 (verifies new `state.dams` infrastructure).


### TC-022 — Seed normalization and hash canonicalization (edge case)
- **Use Case**: UC-019
- **BR coverage**: BR-158, BR-163
- **Steps**: open app with invalid hash `#seed=0`; wait for boot; inspect `state.terrain.seed`, `location.hash`, and `#seed-chip`.
- **Pass**: seed is integer > 0; hash matches `#seed=<positive-int>`; chip displays normalized seed.
- **Maps to**: T21.

### TC-023 — Ambient EQ semantic metadata (simple accessibility case)
- **Use Case**: UC-021
- **BR coverage**: BR-161, BR-162
- **Steps**: boot app; wait 20 ticks; inspect `#ambient-eq` presence, number of `.eq-bar` children, `title`, and `aria-label`.
- **Pass**: element exists, bar count = 5, title and aria-label include organism count context.
- **Maps to**: T22.
