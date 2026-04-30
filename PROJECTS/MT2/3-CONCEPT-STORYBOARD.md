# MT2 — Concept Storyboard

> Stage 3 artifact. Produced from `2-NARRATIVE-VISION.md` and `1-USE-CASES.md`.
> All concept files are in `./build/concept/`. These are illustrative — final artwork is produced at Stage 8.

---

## CB-001 : Pipeline Overview — Stage Flow Diagram

- **SUMMARY**
  Annotated flow diagram showing all 11 stages (0–10) in left-to-right order, with stage owner labels, artifact names, and the Manager/Auditor support bars beneath the flow. Conveys the single-pass sequential nature of the pipeline with a clear visual hierarchy.

- **FILE**
  `./build/concept/concept-pipeline-overview.svg`

- **FORMAT**
  SVG — dark theme, monospace font, colour-coded by role (blue = user/analyst, green = writer/tester, amber = graphic artist/manager, red/orange = architect/developer)

- **SCREENS COVERED**
  Pipeline introduction view — the first diagram any new user of MT2 should see.

- **STYLE NOTES**
  - Dark background (#0d1117) consistent across all concept files.
  - Role colours: Writer/Tester → green (#3fb950), Graphic Artist/Manager → amber (#d29922), Architect/Developer → orange-red (#f78166), Analyst/TechLead → blue (#58a6ff).
  - Stage 1 box highlighted with blue border (source of truth).
  - Manager and Auditor rendered as full-width bars below the stage row.

- **TRACEABILITY**
  - UC-001 (stage definitions and governance)
  - UC-005 (agent executes stage)
  - UC-006 (manager recovery)

- **RELATED**
  CB-002, CB-003

---

## CB-002 : Agent Ecosystem — Role Map

- **SUMMARY**
  Hub-and-spoke diagram with the pipeline instruction file at the centre and one agent card for each role radiating outward. Each card shows the agent's stage, owned artifacts, and assigned skill. Reinforces the "one specialist per stage" principle.

- **FILE**
  `./build/concept/concept-agent-ecosystem.svg`

- **FORMAT**
  SVG — spoke layout, dark theme, role-colour borders on each agent card.

- **SCREENS COVERED**
  Agent configuration reference view — used during UC-002 implementation.

- **STYLE NOTES**
  - Agent cards use the role colour as their border.
  - The central `pipeline.instructions.md` box is blue-bordered (source of truth).
  - Dashed spokes to indicate "reads from" relationship, not data flow.

- **TRACEABILITY**
  - UC-002 (agent configuration)
  - UC-003 (skill definitions)
  - UC-004 (repo customisation files)

- **RELATED**
  CB-001, CB-003

---

## CB-003 : File Structure — Directory Tree Concept

- **SUMMARY**
  Annotated directory tree of `./build/.github/` showing the three top-level directories (`instructions/`, `agents/`, `skills/`) with representative file listings and side-panel callouts explaining the contents of each file type. The final file in the tree (`copilot-instructions.md`) is the workspace entry point.

- **FILE**
  `./build/concept/concept-file-structure.svg`

- **FORMAT**
  SVG — vertical tree layout, annotation panels to the right of the tree, dark theme.

- **SCREENS COVERED**
  Installation and structure reference view — used during UC-004 implementation.

- **STYLE NOTES**
  - Green annotation panel for agent card contents (amber border).
  - Blue annotation panel for skill file contents (green border).
  - Entry-point file (`copilot-instructions.md`) highlighted in blue.

- **TRACEABILITY**
  - UC-002 (agent files under `./build/.github/agents/`)
  - UC-003 (skill files under `./build/.github/skills/`)
  - UC-004 (repo customisation, `copilot-instructions.md`)

- **RELATED**
  CB-002, CB-004

---

## CB-004 : Gate Failure & Recovery Flow

- **SUMMARY**
  Two-path diagram showing the happy path (stage → exit gate PASS → next stage) above, and the failure path (exit gate FAIL → Auditor flags → Manager routes back → re-run → PASS) below. Annotated with recovery rules at the bottom.

- **FILE**
  `./build/concept/concept-failure-recovery.svg`

- **FORMAT**
  SVG — two horizontal swim lanes, colour-coded arrows (green = pass, red = fail, amber = manager routing), dark theme.

- **SCREENS COVERED**
  Manager and Auditor behavioural reference — used during UC-006 and UC-002 implementation.

- **STYLE NOTES**
  - Green arrows for PASS paths.
  - Red arrows for FAIL transitions.
  - Amber dashed arc for Manager re-routing back to owning stage.
  - Rules callout box at the bottom in dark panel.

- **TRACEABILITY**
  - UC-006 (manager gate recovery)
  - UC-005 (agent self-checks exit gate)

- **RELATED**
  CB-001, CB-005

---

## CB-005 : Traceability Thread — ID Chain Diagram

- **SUMMARY**
  Linear chain diagram showing how a use case (UC) flows through every stage ID: UC → BR → AR/PT → DI → Code/TC/GL → T. Each node shows the ID prefix, source artifact, and a one-line description. An ID prefix reference table occupies the lower half of the diagram.

- **FILE**
  `./build/concept/concept-traceability-thread.svg`

- **FORMAT**
  SVG — horizontal chain of boxes with diverging branches at the DI node (code, text, glossary all branch to a single test node), dark theme.

- **SCREENS COVERED**
  Traceability reference view — used by all agents when populating TRACEABILITY fields.

- **STYLE NOTES**
  - UC and BR nodes in blue (approved intent layer).
  - AR/PT nodes in orange-red (architecture layer).
  - DI in blue (design layer).
  - Code/TC/GL in green/amber (implementation layer).
  - Test in green with thick border (verification layer).
  - ID prefix reference table uses consistent role colours.

- **TRACEABILITY**
  - UC-001 (full chain defined by stage governance)
  - UC-005 (each agent populates TRACEABILITY fields)
  - UC-008 (tester verifies traceability completeness)

- **RELATED**
  CB-001, CB-004

---

## Exit Gate — Stage 3

- [x] `3-CONCEPT-STORYBOARD.md` exists with one CB record per major concept.
- [x] All five CB FILE paths exist in `./build/concept/` and are non-empty SVG files.
- [x] All major UC flows (pipeline overview, agent roles, file structure, gate recovery, traceability) are represented.
- [x] TRACEABILITY fields reference valid UC IDs from `1-USE-CASES.md`.
- [x] No stubs or placeholder records remain.
