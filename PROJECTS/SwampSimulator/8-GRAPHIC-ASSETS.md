# SwampSimulator — Graphic Assets

## Style direction
Naturalistic, muted palette (cypress green #3a5a32, water teal #4a6b6b, mud #6b5a3a, ink #cde3c4, accent #ffd34a). All assets are simple flat SVG, vector-only, optimised for small sizes. Per DI-010 the simulation renders agents as primitive circles directly in code; this stage delivers the static reference background, the favicon, and the six environmental-event icons used in the intervention panel and scenario cards.

## GA-001 : Favicon
- SUMMARY: 32×32 favicon for the browser tab.
- FILE: ./build/images/ga-001-favicon.svg
- FORMAT: SVG
- STYLE NOTES: Cypress + water + mud silhouette in palette colours.
- TRACEABILITY: DI-001
- RELATED: UC-001
---

## GA-002 : Scene background reference
- SUMMARY: Reference image of the swamp background. The renderer draws this procedurally per DI-010, but the SVG documents the layout: water gradient, top and bottom mud banks, three cypress silhouettes.
- FILE: ./build/images/ga-002-scene-background.svg
- FORMAT: SVG (reference)
- STYLE NOTES: Soft radial water, ochre mud banks, dark green cypress.
- TRACEABILITY: DI-001, DI-010
- RELATED: UC-001
---

## GA-003 : Event icon — Drought
- SUMMARY: Sun over cracked ground.
- FILE: ./build/images/ga-003-event-drought.svg
- FORMAT: SVG
- STYLE NOTES: Accent yellow sun, mud cracks.
- TRACEABILITY: DI-014, DI-007
- RELATED: UC-006
---

## GA-004 : Event icon — Flood
- SUMMARY: Rising water with rain lines.
- FILE: ./build/images/ga-004-event-flood.svg
- FORMAT: SVG
- TRACEABILITY: DI-014, DI-007
- RELATED: UC-006
---

## GA-005 : Event icon — Pollution
- SUMMARY: Dark water with oil/sludge globs.
- FILE: ./build/images/ga-005-event-pollution.svg
- FORMAT: SVG
- TRACEABILITY: DI-014, DI-007
- RELATED: UC-006
---

## GA-006 : Event icon — Fire
- SUMMARY: Stylised flame.
- FILE: ./build/images/ga-006-event-fire.svg
- FORMAT: SVG
- TRACEABILITY: DI-014, DI-007
- RELATED: UC-006
---

## GA-007 : Event icon — Nutrient runoff
- SUMMARY: Brown runoff streams into greenish water.
- FILE: ./build/images/ga-007-event-runoff.svg
- FORMAT: SVG
- TRACEABILITY: DI-014, DI-007
- RELATED: UC-006, UC-009
---

## GA-008 : Event icon — Cold snap
- SUMMARY: Snowflake.
- FILE: ./build/images/ga-008-event-coldsnap.svg
- FORMAT: SVG
- TRACEABILITY: DI-014, DI-007
- RELATED: UC-006
---

---

## Vibrant Cartoon Graphics (UC-015..UC-017, BR-092..BR-114)

All assets in this addendum are produced by the deterministic generator `./scripts/gen-sprites.py` (DI-024) and committed under `./build/`. Re-running the generator regenerates the same files; manual hand-editing of the PNGs is permitted as a follow-up.

## GA-009 : Animated species sprite-sheets — 28 PNGs
- Path: `./build/sprites/<speciesId>.png` (one per species id)
- Layout: rows = animation states (idle / walk / swim / flight, only those applicable per species), columns = frames; every frame is 64×64.
- Companion `./build/sprites/manifest.js` maps each species id to `{url, frameW, frameH, states: {idle, walk?, swim?, flight?: {row, frames, fps}}, loco}`.
- Style: thick dark outline, two-tone shading, saturated swamp palette per BR-094.

## GA-010 : Species portrait SVGs — 28 files
- Path: `./build/images/portraits/<speciesId>.svg`
- 64×64 viewBox; each portrait is the species' idle frame embedded as a base64 PNG inside an SVG wrapper for crisp scaling.
- Used by the inspector header (PT-028, BR-107), intervention species rows (BR-108), and food-web nodes.

## GA-011 : Cartoon UI icon set — 16 SVGs
- Path: `./build/images/ui/`
- Files: nav-canvas, nav-foodweb, nav-dashboard, nav-intervention, nav-scenarios, nav-saveload, time-pause, time-play, time-x1, time-x5, time-x30, time-skip, overlay-foodweb, overlay-nutrient, overlay-oxygen, overlay-density.
- Plus 6 event icons already shipped under GA-003..GA-008 (drought, flood, pollution, fire, runoff, coldsnap) — re-used; equivalents at this UI scale also written as event-* for symmetry.

## GA-012 : Scenario card illustrated headers — 5 SVGs
- Path: `./build/images/ui/scenario-<scenarioId>.svg`
- Files: scenario-alligator-removed, scenario-mosquito-explosion, scenario-algae-bloom, scenario-beaver-dam, scenario-drought-year.
- 240×140 viewBox; cartoon scene per scenario theme (BR-114).

## Generator
- File: `./scripts/gen-sprites.py` — pure Python + Pillow; no network access.
- Run with: `python3 scripts/gen-sprites.py` from project root.
- Deterministic: same input → same output (no random seeds used).

## Deviation note
- The pipeline cannot author 28 hand-painted sprite-sheets from scratch in-band, so the generator produces *programmatic* cartoon renderings using primitive shapes (ellipses, polygons, eyes) per body class. Each species is silhouette-distinct via per-species body class + palette. Hand-painted replacements may drop into `./build/sprites/` and `./build/images/portraits/` later without code change as long as the `manifest.js` shape remains valid.

## GA-013 : Edge-case status badges (second pass)
- Path: `./build/images/ui/edge-seed-normalized.svg`, `./build/images/ui/edge-construction-paused.svg`
- Purpose: static visual fallbacks for seed normalization and paused dam construction states in reduced-motion or low-density scenarios.
- Style: same cartoon UI token set as GA-011 (paper background, dark outline, warm warning accent).
- Traceability: BR-157, BR-158, BR-162; DI-041, DI-043.
