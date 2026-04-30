# MT2 — Release Notes

> Append-only. Each entry records one implementation run. Do not edit or delete prior entries.

---

## RN-001 : v0.1.0 — 2026-04-29

- **CHANGED FILES:**
  - `build/.github/instructions/pipeline.instructions.md` — master governance file: stage table (13 rows), foundational rules, execution model, quality gates, traceability ID convention table
  - `build/.github/copilot-instructions.md` — workspace entry point: agent list, skills table, default operating order, source-of-truth rule, general expectations
  - `build/.github/X-AUDIT-REPORT.md` — audit report shell with schema and append target
  - `build/.github/agents/user-ba.agent.md` — Stage 0 agent: proposed use case authoring
  - `build/.github/agents/product-owner.agent.md` — Stage 1 agent: use case approval
  - `build/.github/agents/writer.agent.md` — Stages 2 & 7 agent: narrative vision and text content
  - `build/.github/agents/graphic-artist.agent.md` — Stages 3 & 8 agent: storyboards and final assets
  - `build/.github/agents/business-analyst.agent.md` — Stage 4 agent: business requirements
  - `build/.github/agents/architect.agent.md` — Stage 5 agent: architecture and parts
  - `build/.github/agents/technical-lead.agent.md` — Stage 6 agent: design instructions
  - `build/.github/agents/developer.agent.md` — Stage 9 agent: implementation
  - `build/.github/agents/tester.agent.md` — Stage 10 agent: test cases, report, and bug tracking
  - `build/.github/agents/manager.agent.md` — Manager agent: gate failure loop and recovery
  - `build/.github/agents/auditor.agent.md` — Auditor agent: compliance observation
  - `build/.github/skills/use-case-authoring/SKILL.md` — stages 0 and 1 skill
  - `build/.github/skills/content-writing-authoring/SKILL.md` — stages 2 and 7 skill
  - `build/.github/skills/concept-storyboard-authoring/SKILL.md` — stage 3 skill
  - `build/.github/skills/business-requirements-writing/SKILL.md` — stage 4 skill
  - `build/.github/skills/architecture-and-parts-authoring/SKILL.md` — stage 5 skill
  - `build/.github/skills/design-instructions-authoring/SKILL.md` — stage 6 skill
  - `build/.github/skills/graphic-artwork-authoring/SKILL.md` — stage 8 skill
  - `build/.github/skills/implementation-stage/SKILL.md` — stage 9 implementation skill
  - `build/.github/skills/release-notes-writing/SKILL.md` — stage 9 release notes skill
  - `build/.github/skills/test-case-authoring/SKILL.md` — stage 10 test case skill
  - `build/.github/skills/test-report-writing/SKILL.md` — stage 10 test report skill
  - `build/.github/skills/bug-report-writing/SKILL.md` — stage 10 bug report skill
  - `build/.github/skills/manager-pipeline-orchestration/SKILL.md` — manager skill
  - `build/.github/skills/auditor/SKILL.md` — auditor skill
  - `PROJECTS/MT2/X-AUDIT-REPORT.md` — live audit report shell for MT2 run

- **IMPLEMENTATION CAVEATS:**
  - Agent count is 11 files (not 13) because Writer covers stages 2 and 7 and Graphic Artist covers stages 3 and 8. The pipeline table references 13 stage-role assignments; the agent file count is 11 unique files. This is a deliberate design decision per DI-003.
  - The `pipeline.instructions.md` traceability ID convention (DI-010) is included in the same file as DI-002 — they were written as a single document per the DI design.

- **UC/BR COVERAGE:**
  - UC-001, UC-002, UC-003, UC-004, UC-005, UC-006, UC-007, UC-008
  - BR-001 through BR-030 (all 30 BRs addressed)

- **NOTES:**
  - The `./build/.github/` package is self-contained and portable. To install in a new project, copy the `.github/` directory to the project workspace root. All paths in agent and skill files are relative to `.github/` and will resolve correctly after installation.
  - Stage 10 testing has not yet run. Tester should verify all 11 agent files, 14 skill files, `pipeline.instructions.md`, `copilot-instructions.md`, and `X-AUDIT-REPORT.md` against the test cases derived from UC-001 through UC-008.

---

## RN-002 : v0.1.1 — 2026-04-29

- **CHANGED FILES:**
  - `build/.github/agents/manager.agent.md` — added `## Procedure` section preamble (BUG-001 fix)
  - `build/.github/skills/manager-pipeline-orchestration/SKILL.md` — added `## Procedure` section preamble (BUG-002 fix)
  - `build/.github/skills/bug-report-writing/SKILL.md` — prepended step 1 "Read pipeline.instructions.md"; renumbered steps (BUG-003 fix)
  - `build/.github/skills/concept-storyboard-authoring/SKILL.md` — prepended step 1 "Read pipeline.instructions.md"; renumbered steps (BUG-003 fix)
  - `build/.github/skills/content-writing-authoring/SKILL.md` — prepended step 1 "Read pipeline.instructions.md" before Stage 2 sub-header; renumbered steps (BUG-003 fix)
  - `build/.github/skills/release-notes-writing/SKILL.md` — prepended step 1 "Read pipeline.instructions.md"; renumbered steps (BUG-003 fix)
  - `build/.github/skills/test-report-writing/SKILL.md` — prepended step 1 "Read pipeline.instructions.md"; renumbered steps (BUG-003 fix)
  - `build/.github/skills/use-case-authoring/SKILL.md` — prepended step 1 "Read pipeline.instructions.md" before Stage 0 sub-header; renumbered steps (BUG-003 fix)
  - `10-TEST-CASES.md` — T-001 through T-020 written (Stage 10 artifact)
  - `10-TEST-REPORT.md` — T-PIPELINE-MT2-001 run results (Stage 10 artifact)
  - `11-BUG-REPORT.md` — BUG-001, BUG-002, BUG-003 (Stage 10 artifact)
- **IMPLEMENTATION CAVEATS:**
  - All three bugs (BUG-001, BUG-002, BUG-003) were discovered during Stage 10 execution and fixed inline during the same run. No re-run of downstream stages was required since these were documentation schema fixes with no functional impact on pipeline governance.
  - T-PIPELINE-MT2-001 result: CONDITIONAL PASS → post-fix result: all 20 test cases PASS.
- **UC/BR COVERAGE:** UC-001, UC-002, UC-003, UC-004, UC-005, UC-006, UC-007, UC-008 · BR-008, BR-012, BR-019

