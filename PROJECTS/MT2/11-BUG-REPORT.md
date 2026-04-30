# MT2 — Bug Report

> Append-only. Do not delete or overwrite records. STATUS values: Open / Fixed / Verified.

---

## BUG-001

- **BUG-ID:** BUG-001
- **DATE FILED:** 2026-04-29
- **SEVERITY:** Medium
- **STATUS:** Verified
- **RELATED:** T-007 · UC-002 · BR-008 · T-PIPELINE-MT2-001
- **TITLE:** manager.agent.md missing required `## Procedure` section
- **DESCRIPTION:** The manager.agent.md file used `## Gate Failure Loop` as the sole procedure section, omitting the required `## Procedure` heading that all agent files must have per DI-003 schema. The schema requires: Role, Stage Assignment, Skill, Must Not, Procedure.
- **ROOT CAUSE:** During Stage 9 implementation, the Manager agent was authored with a domain-specific `## Gate Failure Loop` section but the base `## Procedure` header was not added above it. The DI specified both sections for the Manager but the implementation merged them.
- **FIX APPLIED:** Added a `## Procedure` preamble section to `build/.github/agents/manager.agent.md` immediately before `## Gate Failure Loop`. The preamble reads: "Activate on any stage gate failure or Auditor-flagged blocking violation. Follow the Gate Failure Loop below. Do not run at a fixed stage cadence — run on demand only."
- **FILES CHANGED:** `build/.github/agents/manager.agent.md`
- **VERIFIED BY:** T-007 recheck grep — 1 match for `## Procedure` confirmed.

---

## BUG-002

- **BUG-ID:** BUG-002
- **DATE FILED:** 2026-04-29
- **SEVERITY:** Medium
- **STATUS:** Verified
- **RELATED:** T-010 · UC-003 · BR-012 · T-PIPELINE-MT2-001
- **TITLE:** manager-pipeline-orchestration/SKILL.md missing required `## Procedure` section
- **DESCRIPTION:** Same pattern as BUG-001. The manager-pipeline-orchestration SKILL.md contained `## Gate Failure Loop` as its main body without a wrapping `## Procedure` heading. All skill files must have a `## Procedure` section per the universal skill schema.
- **ROOT CAUSE:** Consistent with BUG-001 — the Manager-specific `## Gate Failure Loop` section was authored as a standalone section rather than nested under `## Procedure`.
- **FIX APPLIED:** Added a `## Procedure` section before `## Gate Failure Loop` in `build/.github/skills/manager-pipeline-orchestration/SKILL.md` with preamble text "Follow the Gate Failure Loop below. Activate on demand only — not on a fixed stage cadence."
- **FILES CHANGED:** `build/.github/skills/manager-pipeline-orchestration/SKILL.md`
- **VERIFIED BY:** T-010 recheck grep — 1 match for `## Procedure` confirmed.

---

## BUG-003

- **BUG-ID:** BUG-003
- **DATE FILED:** 2026-04-29
- **SEVERITY:** High
- **STATUS:** Verified
- **RELATED:** T-011 · UC-005 · BR-019 · BR-021 · T-PIPELINE-MT2-001
- **TITLE:** 6 stage skill files do not begin Procedure with pipeline.instructions.md read step
- **DESCRIPTION:** BR-019 requires every SKILL.md Procedure to begin with a step that reads `pipeline.instructions.md`. Six skill files failed this check: bug-report-writing, concept-storyboard-authoring, content-writing-authoring, release-notes-writing, test-report-writing, and use-case-authoring. Their first Procedure step went directly to reading product-specific artifacts instead.
- **ROOT CAUSE:** During Stage 9 implementation, six skill files were authored starting at their domain-specific first step rather than the universal "read governance file" step. The six skills that were already correct (architecture-and-parts, business-requirements, design-instructions, graphic-artwork, implementation-stage, test-case-authoring) were authored with the correct step; the others were not.
- **FIX APPLIED:** In each of the six affected files, a new step 1 was inserted: `1. Read '.github/instructions/pipeline.instructions.md'.` — existing steps renumbered accordingly. For the two multi-stage skills (content-writing-authoring and use-case-authoring), a single step 1 was inserted before the first stage sub-header.
- **FILES CHANGED:**
  - `build/.github/skills/bug-report-writing/SKILL.md`
  - `build/.github/skills/concept-storyboard-authoring/SKILL.md`
  - `build/.github/skills/content-writing-authoring/SKILL.md`
  - `build/.github/skills/release-notes-writing/SKILL.md`
  - `build/.github/skills/test-report-writing/SKILL.md`
  - `build/.github/skills/use-case-authoring/SKILL.md`
- **VERIFIED BY:** T-011 full recheck — all 13 checked SKILL.md files (11 stage skills + manager + auditor) now PASS the first-step check.
