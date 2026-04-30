# MT2 — Graphic Assets

> Stage 8 artifact. Produced from `6-DESIGN-INSTRUCTIONS.md` and `3-CONCEPT-STORYBOARD.md`.
> All final assets are in `./build/images/`. Concept files (Stage 3) remain in `./build/concept/`.

---

## GA-001 : Pipeline Flow Diagram

- **SUMMARY**
  Production-quality pipeline flow diagram showing all 11 stages (0–10) with role-coloured top bars, Manager and Auditor support bars, and a legend row. Stage 1 is visually distinguished as the source of approved intent. Suitable for use in `copilot-instructions.md`, README files, and project documentation.

- **FILE**
  `./build/images/ga-001-pipeline-flow.svg`

- **FORMAT**
  SVG — 1200×340px, dark theme, `'Segoe UI'` / `system-ui` sans-serif, rounded-rectangle stage cells, role-colour top accent bars, linear gradient background.

- **STYLE NOTES**
  - Role colour palette: User/Analyst/TechLead → `#1f6feb` (blue), Writer/Tester → `#2ea043` (green), Graphic Artist → `#9e6a03` (amber), Architect/Developer → `#b91c1c` (red).
  - Stage 1 cell has blue border at 2px weight and a `★` annotation to mark it as the single source of approved intent.
  - Stage 10 drops below Stage 9 to reflect its role as the final verification step.
  - Manager bar: amber-toned (`#7d6214` border).
  - Auditor bar: red-toned (`#6e1a10` border).
  - Legend row at the bottom summarises role colours and key pipeline properties.

- **FLAVORS**
  N/A — single canonical version produced.

- **SELECTED FLAVOR**
  N/A

- **TRACEABILITY**
  DI-002 (pipeline stage table), DI-007 (Manager/Auditor roles), DI-008 (copilot-instructions reference)

- **RELATED**
  GA-002, GA-003, CB-001

---

## GA-002 : Traceability Chain Diagram

- **SUMMARY**
  Production-quality horizontal chain diagram showing the full ID traceability thread: UC → BR → AR/PT → DI → (./build, TC, GA) → T → Release Recommendation. Includes node labels, source artifact references, and a summary legend. Intended for the pipeline instruction file and developer onboarding.

- **FILE**
  `./build/images/ga-002-traceability-chain.svg`

- **FORMAT**
  SVG — 1000×220px, dark theme, matching colour scheme to GA-001. UC and Release nodes use thicker blue/green borders to mark them as entry and exit points.

- **STYLE NOTES**
  - UC node: blue double-border (entry point).
  - Release node: green double-border (exit point).
  - AR/PT stacked to show their parallel relationship.
  - DI fans out to three implementation streams (code, text, image) that converge at the test node.
  - Bottom legend explains the RELATED field convention.

- **FLAVORS**
  N/A

- **SELECTED FLAVOR**
  N/A

- **TRACEABILITY**
  DI-010 (traceability ID convention), AR-010 (ID scheme)

- **RELATED**
  GA-001, CB-005

---

## GA-003 : Gate Failure & Recovery Diagram

- **SUMMARY**
  Production-quality two-path diagram showing the happy path (Stage N → Exit Gate PASS → Stage N+1) above, and the failure path (Exit Gate FAIL → Auditor → Manager → re-run → PASS) below. Uses distinct colour coding: green for pass, red for fail, amber for Manager routing. Intended for the Manager skill file and pipeline instruction file.

- **FILE**
  `./build/images/ga-003-gate-recovery.svg`

- **FORMAT**
  SVG — 800×340px, dark theme, two-row swim-lane layout, dashed amber arc for Manager re-routing.

- **STYLE NOTES**
  - Green arrows: PASS paths.
  - Red arrows: FAIL transitions.
  - Amber dashed arc: Manager routing back to owning stage.
  - Auditor box: red-toned background (`#1c1012`).
  - Manager box: amber-toned background (`#1c1a10`).
  - Recovery confirmation box: green border at 2px.

- **FLAVORS**
  N/A

- **SELECTED FLAVOR**
  N/A

- **TRACEABILITY**
  DI-007 (Manager/Auditor skill files), DI-002 (gate failure rules)

- **RELATED**
  GA-001, CB-004

---

## Exit Gate — Stage 8

- [x] `./build/images/` contains final approved assets for all image-bearing DIs.
- [x] `8-GRAPHIC-ASSETS.md` has one GA record per image-bearing DI.
- [x] Every GA FILE path exists and is non-empty SVG.
- [x] TRACEABILITY fields reference valid DI IDs.
- [x] Flavor selection resolved (N/A for all three — single canonical version per asset).
- [x] Concept files (CB-001 through CB-005) exist in `./build/concept/` and were used as visual direction.
