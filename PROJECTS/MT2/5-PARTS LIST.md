# MT2 — Parts List

> Stage 5 artifact. Produced alongside `5-ARCHITECTURE-RECOMMENDATIONS.md` from `4-REQUIREMENTS.md`.

---

## PT-001 : Pipeline Instruction File
- **DESCRIPTION**
  The master governance document for the pipeline. Contains the ordered stage table, foundational rules, working directory convention, quality gates, and execution model. This is the single source of truth for stage ownership, artifact mapping, and quality gate criteria.
- **TECHNOLOGY RECOMMENDATIONS**
  Plain Markdown (`.md`) with YAML-compatible frontmatter. Stored at `./build/.github/instructions/pipeline.instructions.md`. No special tooling required — readable natively by VS Code Copilot via the `.github/instructions/` discovery mechanism.
- **NOTES**
  Must include an `applyTo` frontmatter field scoped to `PROJECTS/**` so VS Code Copilot attaches it to all project-level work.
- **RELATED**
  UC-001, BR-001–BR-006, AR-001, AR-004, AR-005

---

## PT-002 : Agent Configuration Files
- **DESCRIPTION**
  One `.agent.md` file per pipeline role (stages 0–10 plus Manager and Auditor = 13 files). Each file is a VS Code Copilot agent mode definition: it names the agent, describes its role, declares allowed tools, references its skill, lists owned artifacts, and prohibits cross-editing.
- **TECHNOLOGY RECOMMENDATIONS**
  VS Code Copilot `.agent.md` format with YAML frontmatter (`name`, `description`, `tools`). Body written in Markdown. Stored under `./build/.github/agents/`. Named by role in lowercase-hyphenated convention (e.g. `business-analyst.agent.md`).
- **NOTES**
  The `tools` list should be the minimal set required for the stage — agents that only read and write Markdown do not need browser or terminal tools.
- **RELATED**
  UC-002, BR-007–BR-010, AR-002

---

## PT-003 : Stage Skill Files
- **DESCRIPTION**
  One `SKILL.md` per pipeline stage (11 files: stages 0–10). Each skill encodes the domain knowledge for that stage: the procedure an agent follows, the schema of the artifact it produces, and the exit-gate checklist it must satisfy. Skills are loaded by agents at runtime and checked by the Auditor after each stage run.
- **TECHNOLOGY RECOMMENDATIONS**
  Plain Markdown with YAML frontmatter (`name`, `description`, `argument-hint`). Five mandatory sections: When to Use, Target Files, Procedure, Schema, Exit Gate. Stored under `./build/.github/skills/<skill-name>/SKILL.md`. Named by stage function in lowercase-hyphenated convention (e.g. `use-case-authoring`, `business-requirements-writing`).
- **NOTES**
  Skills for roles that appear at multiple stages (Writer: stages 2 and 7; Graphic Artist: stages 3 and 8) may be combined into a single skill file with clearly labelled per-stage sections, or split into two separate files — implementation decision to be made at Stage 6.
- **RELATED**
  UC-003, BR-011–BR-014, AR-003

---

## PT-004 : Manager Skill File
- **DESCRIPTION**
  A dedicated orchestration skill for the Manager role. Defines the gate-failure detection loop, the routing protocol for returning work to the owning stage, the downstream re-run sequence, and the logging requirements for all failure and recovery events.
- **TECHNOLOGY RECOMMENDATIONS**
  Same `SKILL.md` format as PT-003. Stored at `./build/.github/skills/manager-pipeline-orchestration/SKILL.md`. The Manager agent (PT-002) references this skill.
- **NOTES**
  The skill must contain an explicit step that prohibits the Manager from editing any stage-owned artifact. The gate-failure loop must be expressed as a numbered procedure.
- **RELATED**
  UC-006, BR-023–BR-026, AR-006

---

## PT-005 : Auditor Agent and Skill File
- **DESCRIPTION**
  The Auditor agent configuration (`auditor.agent.md`) and its skill file define: which rule categories to check per stage, how to record violations in `X-AUDIT-REPORT.md`, and how to notify the Manager. The Auditor has no write access to stage artifacts.
- **TECHNOLOGY RECOMMENDATIONS**
  Agent file: `./build/.github/agents/auditor.agent.md`. Skill file: `./build/.github/skills/auditor/SKILL.md`. `X-AUDIT-REPORT.md` is the sole write target. Violations are appended — the report is never overwritten.
- **NOTES**
  The Auditor skill must list the specific rule categories it checks (ownership, cross-edit, exit-gate completeness, ID sequencing, traceability coverage) so audits are reproducible.
- **RELATED**
  UC-004, BR-017, AR-007

---

## PT-006 : Workspace Entry-Point File (`copilot-instructions.md`)
- **DESCRIPTION**
  The top-level workspace instruction file that VS Code Copilot reads automatically. Lists all agent files, references the pipeline instruction file, and provides the default operating order (read pipeline → select agent → load skill → follow pipeline). This file is the first thing any contributor encounters when opening the workspace.
- **TECHNOLOGY RECOMMENDATIONS**
  Standard VS Code Copilot `copilot-instructions.md` at `./build/.github/copilot-instructions.md`. Plain Markdown, no YAML frontmatter required. Must not duplicate governance rules — cross-reference `pipeline.instructions.md` instead.
- **NOTES**
  When MT2's `./build/` is installed into a new project, this file goes to `.github/copilot-instructions.md` at the new project root.
- **RELATED**
  UC-004, BR-015–BR-016, BR-018, AR-008

---

## PT-007 : Traceability ID Convention
- **DESCRIPTION**
  A documented, enforced ID scheme used across all stage artifacts. Prefixes: UC (use cases), BR (business requirements), AR (architecture recommendations), PT (parts), DI (design instructions), TC (text content), GL (glossary), T (test cases). IDs are sequential within each prefix, append-only, and never reused.
- **TECHNOLOGY RECOMMENDATIONS**
  Implemented as a written convention in the pipeline instruction file and referenced in every skill file's schema section. No external tooling required — IDs are embedded as Markdown heading anchors (`## BR-001 : ...`). The Auditor checks ID sequencing at each stage.
- **NOTES**
  The convention must be stated in the pipeline instruction file so it is available to all agents without loading a separate document.
- **RELATED**
  UC-001, UC-008, BR-014, BR-029, AR-010

---

## PT-008 : Audit Report (`X-AUDIT-REPORT.md`)
- **DESCRIPTION**
  An append-only Markdown document that records every pipeline rule violation detected by the Auditor. Each entry identifies the stage, the violated rule, the artifact affected, and the date. The Manager reads this document to prioritise recovery actions.
- **TECHNOLOGY RECOMMENDATIONS**
  Plain Markdown, stored at the project root alongside other stage artifacts (e.g. `PROJECTS/MT2/X-AUDIT-REPORT.md`). When MT2 is used as a template, each new project gets its own `X-AUDIT-REPORT.md`. Append-only — violations are never removed or edited after recording.
- **NOTES**
  The Auditor skill must define a consistent record schema for audit entries so reports are machine-readable as well as human-readable.
- **RELATED**
  UC-004, BR-017, AR-007

---

## PT-009 : Exit Gate Checklist Mechanism
- **DESCRIPTION**
  A standardised section at the end of every skill file that lists numbered, verifiable exit criteria. After completing a stage, the agent self-evaluates each criterion and reports PASS or FAIL with evidence. The Auditor independently verifies the self-report.
- **TECHNOLOGY RECOMMENDATIONS**
  Implemented as a Markdown checklist (`- [ ]` / `- [x]`) at the end of each `SKILL.md`. The agent writes its exit-gate evidence inline or as a separate exit-gate report block in its stage output. No external CI/CD integration required for documentation stages.
- **NOTES**
  For Stage 9 (implementation), exit-gate items may reference observable browser or terminal output. All other stages' exit gates must be satisfiable from document content alone.
- **RELATED**
  UC-005, UC-008, BR-004, BR-022, BR-029, AR-009

---

## PT-010 : Portable Installation Package
- **DESCRIPTION**
  The complete `./build/.github/` directory tree, structured so it can be copied directly into any new project's `.github/` folder to activate the MT2 pipeline. Includes all agent files (PT-002), skill files (PT-003, PT-004, PT-005), the pipeline instruction file (PT-001), and the workspace entry point (PT-006).
- **TECHNOLOGY RECOMMENDATIONS**
  Directory structure: `./build/.github/` containing `copilot-instructions.md`, `instructions/pipeline.instructions.md`, `agents/*.agent.md`, `skills/**/SKILL.md`. No build script required — installation is a directory copy. May be distributed as a zip archive or cloned from a template repository.
- **NOTES**
  The MT2 Tester (UC-008) must verify the package is installable by walking through a sample project run using only these files.
- **RELATED**
  UC-007, UC-008, BR-027, BR-028, AR-001

---

## Exit Gate — Stage 5

- [x] Every BR (BR-001 through BR-030) maps to at least one PT via its AR.
- [x] Every PT names a concrete technology, format, or file path.
- [x] PT IDs are sequential (PT-001 through PT-010) and none are reused.
- [x] All RELATED fields point to valid UC, BR, and AR IDs.
