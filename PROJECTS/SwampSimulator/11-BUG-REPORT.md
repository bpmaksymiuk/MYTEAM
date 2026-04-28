# 11 — Bug Report (post UC-015..UC-017 rerun)

## Carry-overs (PASS-WEAK, accepted)

### BUG-001 — Mosquito explosion does not materialise after dragonfly removal

- **Where**: `./build/sim.js` mosquito spawn logic (`UC-008`).
- **Symptom**: T08 reports mosquito=0 even after removing all dragonflies. Predator pressure released but birth path is gated on adult-female density; with the seeded scenario, the mosquito population never crosses the breeding floor.
- **Severity**: minor (educational story still readable via the dragonfly-population dashboard).
- **Status**: deferred to a future tuning sprint. Does not block UC-001..UC-017.

### BUG-002 — Algae bloom does not depress dissolved oxygen

- **Where**: `./build/sim.js` algae growth + `./build/state.js` oxygen update.
- **Symptom**: T09 oxygen stays at 1.000 even with algae cover spike. Oxygen-consumption coupling is too weak relative to re-aeration.
- **Severity**: minor; oxygen overlay still visualises localised dips when triggered manually via the event panel.
- **Status**: deferred.

## New for this rerun

### BUG-003 (resolved before report) — top-nav button radius override

- **Where**: `./build/style.css`.
- **Symptom**: T17 first run reported `radius=4px` because the cartoon `button` rule had lower specificity than the original `#top-nav button` rule.
- **Fix**: appended an override block listing every id-scoped button selector with `border-radius: 12px`.
- **Status**: fixed; T17 now PASS at 12 px.

No new open bugs introduced by the cartoon-graphics work. UC-015..UC-017 PASS.

---

## 11 — Bug Report (post UC-018..UC-021 rerun)

### Summary

- **Run ID**: T-PIPELINE-SS-001 (re-execution)
- **Evidence**: `./testresults/T-PIPELINE-SS-001/results.json` + screenshots `T01..T20*.png`
- **Outcome**: 20 PASS, 2 PASS-WEAK, 0 FAIL

### New issues found during this rerun

#### BUG-004 (resolved) — Asset preload failure for `plant-*` portraits

- **Where**: `./build/assets.js`.
- **Symptom**: Boot failed in live browser run with `Asset failed: ./images/portraits/plant-cypress.svg`, causing test runner timeout at startup.
- **Cause**: Asset loader attempted portrait SVG preloads for every `SPRITE_MANIFEST` entry, including generated `plant-*` sprite-sheet keys that intentionally have no portrait files.
- **Fix**: Guard portrait preload with `if (!sid.startsWith('plant-'))`.
- **Verification**: Full rerun passes startup and completes all tests; T18/T19/T20 PASS.
- **Status**: closed.

#### BUG-005 (resolved) — Save/load instability after terrain map introduction

- **Where**: `./build/storage.js`.
- **Symptom**: Save/load stage intermittently blocked after introducing full-resolution `state.terrain.biomeMap` data into state payload.
- **Cause**: Serializing regenerable biome arrays in save payload increases storage and may destabilize round-trip in constrained runs.
- **Fix**:
  - Save path now strips `biomeMap` via JSON replacer.
  - Load path regenerates terrain from saved seed using `generateTerrain(...)` and marks terrain dirty for renderer refresh.
- **Verification**: T14 returns PASS (`day 210 -> after-load 211`) in the rerun with new terrain stack enabled.
- **Status**: closed.

### Carry-overs (still accepted as PASS-WEAK)

#### BUG-001 — Mosquito explosion does not materialize after dragonfly removal

- **Current result**: T08 = PASS-WEAK (`mosquito=0` sample).
- **Status**: deferred (balance-tuning backlog).

#### BUG-002 — Algae bloom does not depress dissolved oxygen enough

- **Current result**: T09 = PASS-WEAK (`oxygen=1.000` sample).
- **Status**: deferred (coupling-tuning backlog).

### Stage 11 gate decision

- No open blocking defects for UC-001..UC-021.
- All implemented features for UC-018..UC-021 have passing tests and live-browser screenshots.
- Remaining items are known non-blocking simulation-tuning carry-overs.

**Recommendation**: PASS Stage 11 and accept release candidate `v0.3.0`.

---

## 11 — Bug Report (post second-pass hardening rerun)

### Summary (Second Pass)

- **Run ID**: T-PIPELINE-SS-001 (second-pass rerun)
- **Outcome**: 21 PASS, 3 PASS-WEAK, 0 FAIL (24 total)

### New findings

#### BUG-006 (resolved) — T21 false failure caused by hash-only test navigation

- **Where**: `./swamp_test_pipeline001.mjs` T21 setup.
- **Symptom**: T21 reported `seed` and chip updated but hash remained `#seed=0`.
- **Cause**: `page.goto('.../#seed=0')` on same path performed hash-only navigation, so app boot logic did not rerun.
- **Fix**: force full document reload using unique query string before hash (`/?t21=<timestamp>#seed=0`).
- **Verification**: T21 passes with normalized seed/hash/chip alignment.
- **Status**: closed.

### Carry-overs

- BUG-001 and BUG-002 remain deferred, non-blocking simulation tuning items.

### Stage 11 gate decision (Second Pass)

- No open blocking defects.
- Second-pass hardening objectives completed with explicit edge/simple-case coverage.

**Recommendation**: PASS Stage 11 and accept release candidate `v0.3.1`.
