# MT2 — Design Instructions

> Stage 6 artifact. Produced from `4-REQUIREMENTS.md`, `5-ARCHITECTURE-RECOMMENDATIONS.md`, and `5-PARTS LIST.md`.

---

## DI-001 : Create the `./build/.github/` directory scaffold

- **SUMMARY**
  Before any individual files are written, the output directory tree must be created. This DI establishes the skeleton so subsequent DIs can write files into their correct locations without path errors.

- **IMPLEMENTATION STEPS**
  1. Create the following directories (they may be empty until populated by later DIs):
     ```
     ./build/.github/
     ./build/.github/instructions/
     ./build/.github/agents/
     ./build/.github/skills/
     ./build/.github/skills/use-case-authoring/
     ./build/.github/skills/content-writing-authoring/
     ./build/.github/skills/concept-storyboard-authoring/
     ./build/.github/skills/business-requirements-writing/
     ./build/.github/skills/architecture-and-parts-authoring/
     ./build/.github/skills/design-instructions-authoring/
     ./build/.github/skills/graphic-artwork-authoring/
     ./build/.github/skills/implementation-stage/
     ./build/.github/skills/release-notes-writing/
     ./build/.github/skills/test-case-authoring/
     ./build/.github/skills/test-report-writing/
     ./build/.github/skills/bug-report-writing/
     ./build/.github/skills/manager-pipeline-orchestration/
     ./build/.github/skills/auditor/
     ```
  2. No files are written in this DI — directory creation only.
  3. Validate: run `find ./build/.github -type d` and confirm all 20 directories are present.

- **SKILLSET REQUIRED**
  File system operations; shell or IDE directory creation.

- **NOTES**
  Some skill directories correspond to roles that serve two stages (Writer: stages 2 and 7; Graphic Artist: stages 3 and 8). These use a single combined skill file — see DI-004 and DI-007.

- **RELATED**
  UC-001, UC-002, UC-003, UC-004, BR-006, BR-010, BR-013, AR-001, PT-001–PT-006

---

## DI-002 : Write `pipeline.instructions.md` — the master governance file

- **SUMMARY**
  This is the most critical file in the build. It defines the stage table, governance rules, working directory convention, quality gates, and execution model. Every agent reads it before acting. It must be self-contained and correct on first write.

- **IMPLEMENTATION STEPS**
  1. Create `./build/.github/instructions/pipeline.instructions.md`.
  2. Add YAML frontmatter:
     ```yaml
     ---
     applyTo: "PROJECTS/**"
     ---
     ```
  3. Write a `# Purpose` section with 3 goals: traceability, predictable quality gates, safe recovery.
  4. Write a `## Working Directory` section:
     - Convention: `PROJECTS/<APP>/`
     - Rules: change into it before running, treat as active root, use relative paths, no machine-specific absolute paths.
  5. Write a `## Scope` section listing what the pipeline applies to (use-case proposals, requirements, architecture, design, source code, test planning, verification evidence).
  6. Write a `## Foundational Rules` section with numbered imperative rules covering:
     - Only the owning stage edits its artifact.
     - No cross-editing of pipeline artifacts.
     - Route upstream errors back to the owning stage.
     - `1-USE-CASES.md` is the single source of approved intent.
     - `1-USE-CASES-PROPOSED.md` is advisory only.
     - Re-run full downstream chain after Stage 1 changes.
     - Keep generated artifacts deterministic and schema-stable.
     - Preserve historical evidence by appending, not replacing.
     - Each stage must consume all required upstream artifacts.
     - Auditor runs after every stage and documents violations in `X-AUDIT-REPORT.md`.
  7. Write `# Pipeline Stages` with a Markdown table. Columns: `Stage | Owner | Type | Artifact(s) | Purpose | Ownership Rule | Skill(s)`. Include rows for stages 0–10 plus Manager. Each row's Skill(s) column must contain the path to the skill file relative to `./build/` (e.g. `.github/skills/use-case-authoring/SKILL.md`).
  8. Write `# Execution Model` → `## Standard Run Procedure` with numbered steps:
     1. Set working directory to `PROJECTS/<APP>`.
     2. Confirm Stage 1 use cases are approved.
     3. Run stages 2–9 in order, loading the correct skill for each stage.
     4. Complete each stage entirely before starting the next.
     5. On failure, route back to the owning stage, then re-run downstream in order.
  9. Write `# Quality Gates` with global rules: no stage starts until previous gate is PASS; missing schema fields = invalid; vague evidence = FAIL; caveats must be documented in release notes.
  10. Validate: the file is non-empty, frontmatter is valid YAML, the stage table has 13 rows (0–10 + Manager + Auditor), all skill paths resolve within `./build/.github/skills/`.

- **SKILLSET REQUIRED**
  Technical writing; YAML frontmatter; Markdown tables.

- **NOTES**
  Do not duplicate the governance rules from this file in `copilot-instructions.md` — that file references this one.

- **RELATED**
  UC-001, BR-001–BR-006, AR-004, AR-005, PT-001

---

## DI-003 : Write all agent `.agent.md` files (13 files)

- **SUMMARY**
  Each agent file is a VS Code Copilot agent mode definition. There are 13 files total: one per stage (0–10) plus Manager and Auditor. Each file follows the same structural template but with role-specific content.

- **IMPLEMENTATION STEPS**
  1. For each agent, create `./build/.github/agents/<role-name>.agent.md`.
  2. Use the following file naming convention:
     - `user-ba.agent.md` (Stage 0 — User + BA validation)
     - `product-owner.agent.md` (Stage 1 — Product Owner / User)
     - `writer.agent.md` (Stages 2 & 7)
     - `graphic-artist.agent.md` (Stages 3 & 8)
     - `business-analyst.agent.md` (Stage 4)
     - `architect.agent.md` (Stage 5)
     - `technical-lead.agent.md` (Stage 6)
     - `developer.agent.md` (Stage 9)
     - `tester.agent.md` (Stage 10)
     - `manager.agent.md` (Manager)
     - `auditor.agent.md` (Auditor)
  3. Each file's YAML frontmatter block:
     ```yaml
     ---
     name: <Role Name>
     description: >
       <One-sentence role description>. Stage <N>. Owns: <artifact(s)>.
     tools:
       - <tool1>
       - <tool2>
     ---
     ```
  4. Each file's Markdown body must contain these sections:
     - `## Role` — 2–3 sentence description of the agent's purpose and constraints.
     - `## Stage Assignment` — stage number(s) and owned artifact(s).
     - `## Skill` — path to the agent's `SKILL.md` file (e.g. `.github/skills/use-case-authoring/SKILL.md`).
     - `## Must Not` — explicit list of artifacts this agent may not edit (all other stages' artifacts).
     - `## Procedure` — instruction to read the pipeline file, load the skill, consume upstream inputs, produce the artifact, and run the exit gate.
  5. For the **Manager** body, add:
     - `## Gate Failure Loop` — numbered steps: (1) detect failure, (2) identify owning stage, (3) route back with description, (4) monitor re-run, (5) confirm PASS, (6) trigger downstream.
     - `## Must Not` — "Edit any stage-owned artifact directly."
  6. For the **Auditor** body, add:
     - `## Observation Scope` — rules to check per stage: ownership, cross-edit, exit-gate completeness, ID sequencing, traceability coverage.
     - `## Write Target` — `X-AUDIT-REPORT.md` only.
     - `## Must Not` — "Fix violations. Fix is the Manager's responsibility."
  7. Tool lists by role:
     - Writer, BA, Architect, Tech Lead: `read_file`, `create_file`, `replace_string_in_file`, `grep_search`, `file_search`
     - Graphic Artist: above + `create_file` for SVG
     - Developer: above + `run_in_terminal`, `get_errors`
     - Tester: above + `run_in_terminal`, `open_browser_page`, `screenshot_page`
     - Manager, Auditor: `read_file`, `grep_search`, `file_search`, `replace_string_in_file` (Auditor write-target only)
  8. Validate: 13 files present in `./build/.github/agents/`; no two files share an `owns:` artifact path; every `skill:` path resolves.

- **SKILLSET REQUIRED**
  YAML frontmatter; VS Code Copilot agent mode format; role-based access design.

- **NOTES**
  Writer and Graphic Artist each appear at two stages. Their agent files reference their multi-stage skill and list both stages in `## Stage Assignment`.

- **RELATED**
  UC-002, BR-007–BR-010, AR-002, PT-002

---

## DI-004 : Write skill files for documentation stages (Stages 0–8)

- **SUMMARY**
  Each skill file teaches an agent how to execute its stage. Documentation-stage skills (0–8) produce Markdown artifacts only. Write one `SKILL.md` per skill directory. Skills for multi-stage roles (Writer, Graphic Artist) use clearly labelled per-stage sections within a single file.

- **IMPLEMENTATION STEPS**
  1. For each skill, create `./build/.github/skills/<skill-name>/SKILL.md`.
  2. Every file must follow the five-section schema:
     ```
     ## When to Use
     ## Target Files
     ## Record Schema  (where applicable)
     ## Procedure
     ## Exit Gate
     ```
  3. **use-case-authoring** (Stages 0 & 1):
     - Target: `1-USE-CASES-PROPOSED.md`, `1-USE-CASES.md`
     - Schema: `## UC-XXX : ACTOR — USE CASE NAME` with STEPS, ACCEPTANCE CRITERIA, NOTES, RELATED
     - Stage 0 rules: proposed file only; does not trigger pipeline.
     - Stage 1 rules: approved file is single source of intent; triggers downstream.
     - Exit gate: all fields complete, criteria measurable, IDs sequential.
  4. **content-writing-authoring** (Stages 2 & 7):
     - Stage 2 target: `2-NARRATIVE-VISION.md`; sections: OVERVIEW, COMPETITIVE & CREATIVE RESEARCH, THEMES AND TONE, WORLD-BUILDING / CONCEPTS.
     - Stage 7 target: `7-TEXT-CONTENT.md`, `./build/text/**`; includes GLOSSARY table and PHRASEBOOK table.
     - TC record schema: `## TC-XXX` with SUMMARY, FILE, CATEGORY, TONE NOTES, GLOSSARY REFERENCES, TRACEABILITY.
     - Exit gate (Stage 7): GLOSSARY and PHRASEBOOK present; every text-bearing DI has a TC record; every TC has a file.
  5. **concept-storyboard-authoring** (Stage 3):
     - Target: `3-CONCEPT-STORYBOARD.md`, `./build/concept/**`
     - CB record schema: `## CB-XXX` with SUMMARY, FILE, FORMAT, SCREENS COVERED, STYLE NOTES, TRACEABILITY, RELATED.
     - Format: SVG preferred; include labelled regions and interaction notes.
     - Exit gate: one CB per major UC screen; all files non-empty; no stubs.
  6. **business-requirements-writing** (Stage 4):
     - Target: `4-REQUIREMENTS.md`
     - BR record schema: `## BR-XXX : REQUIREMENT STATEMENT` with TESTABLE CONDITION, NOTES, RELATED.
     - Writing standard: shall language; atomic; no implementation details; quantify where possible.
     - Exit gate: every UC maps to ≥1 BR; every BR has testable condition; IDs sequential.
  7. **architecture-and-parts-authoring** (Stage 5):
     - Target: `5-ARCHITECTURE-RECOMMENDATIONS.md`, `5-PARTS LIST.md`
     - AR schema: `## AR-XXX : RECOMMENDATION` with RATIONALE, NOTES, RELATED.
     - PT schema: `## PT-XXX : PART NAME` with DESCRIPTION, TECHNOLOGY RECOMMENDATIONS, NOTES, RELATED.
     - Exit gate: every BR maps to ≥1 AR; every AR names concrete tech; every PT has tech recommendations.
  8. **design-instructions-authoring** (Stage 6):
     - Target: `6-DESIGN-INSTRUCTIONS.md`
     - DI schema: `## DI-XXX : INSTRUCTION` with SUMMARY, IMPLEMENTATION STEPS, SKILLSET REQUIRED, NOTES, RELATED.
     - Quality: Developer must be able to implement without clarifying questions.
     - Exit gate: every BR/AR pair has ≥1 DI; all DIs actionable.
  9. **graphic-artwork-authoring** (Stage 8):
     - Target: `8-GRAPHIC-ASSETS.md`, `./build/images/**`
     - GA record schema: `## GA-XXX` with SUMMARY, FILE, FORMAT, STYLE NOTES, TRACEABILITY, RELATED.
     - Format: SVG or PNG; production-quality (not concept sketches).
     - Exit gate: one GA per DI that requires an image asset; all files non-empty.
  10. Validate: 9 skill directories each contain a non-empty `SKILL.md`; all five required sections present in each.

- **SKILLSET REQUIRED**
  Technical writing; domain knowledge of each stage's deliverable; YAML frontmatter.

- **NOTES**
  Do not copy the skill content verbatim from the existing MYTEAM skills — rewrite them to be optimised, clear, and consistent with the MT2 conventions. The goal is an improved version.

- **RELATED**
  UC-003, BR-011–BR-014, AR-003, PT-003

---

## DI-005 : Write the implementation and release-notes skill files (Stage 9)

- **SUMMARY**
  Stage 9 has two skills: one for implementation (Developer) and one for release notes (Writer). These are separate skill files because they serve different concerns and may be run by different agents in a future extension.

- **IMPLEMENTATION STEPS**
  1. Create `./build/.github/skills/implementation-stage/SKILL.md`:
     - When to Use: Stage 9 code implementation from `6-DESIGN-INSTRUCTIONS.md`.
     - Target Files: `./build/**`, `9-RELEASE-NOTES.md`.
     - Procedure:
       1. Read pipeline instructions.
       2. Read `6-DESIGN-INSTRUCTIONS.md` in full.
       3. Implement each DI in order; write files to `./build/`.
       4. Do not create files not specified in DIs.
       5. After each DI, check for errors (`get_errors`).
       6. Do not add unrequested features, refactors, or comments.
       7. After all DIs are implemented, write a release notes entry.
     - Exit gate: all DI files exist at specified paths; no unresolved compile errors; `9-RELEASE-NOTES.md` updated.
  2. Create `./build/.github/skills/release-notes-writing/SKILL.md`:
     - Target: `9-RELEASE-NOTES.md`
     - RN record schema: `## RN-XXX : vX.X.X — YYYY-MM-DD` with CHANGED FILES, IMPLEMENTATION CAVEATS, UC/BR COVERAGE, NOTES.
     - Rules: append-only; microversion increment per run; list every changed file.
     - Exit gate: entry present with all required fields; version is incremented; no overwriting of prior entries.
  3. Validate: both skill files exist and are non-empty with all five sections.

- **SKILLSET REQUIRED**
  Technical writing; semantic versioning; file-change tracking.

- **NOTES**
  The implementation skill must include the "do not over-engineer" constraint explicitly to prevent developers from adding unrequested code.

- **RELATED**
  UC-003, UC-005, BR-011, BR-020, AR-003, PT-003

---

## DI-006 : Write the test-stage skill files (Stage 10)

- **SUMMARY**
  Stage 10 has three skills: test-case authoring, test-report writing, and bug-report writing. Each is a separate skill file. Together they define the full verification workflow from planning through evidence to defect tracking.

- **IMPLEMENTATION STEPS**
  1. Create `./build/.github/skills/test-case-authoring/SKILL.md`:
     - Target: `10-TEST-CASES.md`
     - T record schema: `## T-XXX : TEST CASE NAME` with UC REFERENCE, BR REFERENCE, PRECONDITIONS, STEPS, EXPECTED RESULT, NOTES.
     - Rules: write test cases before executing; every UC and BR must have ≥1 test case; IDs sequential and stable.
     - Exit gate: all UCs covered; all BRs covered; every test case has observable expected result.
  2. Create `./build/.github/skills/test-report-writing/SKILL.md`:
     - Target: `10-TEST-REPORT.md`
     - Procedure: read `10-TEST-CASES.md`; execute each test case; record PASS/FAIL with evidence (screenshots, output snippets); issue release recommendation.
     - Report schema: header with run ID and date; results table (T-ID, description, result, evidence); summary (total / pass / fail); recommendation (PASS / FAIL / CONDITIONAL).
     - Rules: append-only; each run gets a unique run ID (T-PIPELINE-<APP>-<NNN>); evidence must be concrete and observable.
     - Exit gate: all test cases executed; recommendation issued with justification; evidence present for every FAIL.
  3. Create `./build/.github/skills/bug-report-writing/SKILL.md`:
     - Target: `11-BUG-REPORT.md`
     - BUG record schema: `## BUG-XXX : TITLE` with SEVERITY (Critical/High/Medium/Low), STAGE, DESCRIPTION, ROOT CAUSE, FIX APPLIED, RELATED (T-ID, UC, BR), STATUS (Open/Fixed/Verified).
     - Rules: append-only; severity must be assigned; link to the test case that found it; link to the UC/BR it violates.
     - Exit gate: every FAIL in the test report has a corresponding BUG record; all BUG records have severity and status.
  4. Validate: three skill files present and non-empty; all five sections in each.

- **SKILLSET REQUIRED**
  QA methodology; test-case writing; defect tracking; screenshot/evidence capture.

- **NOTES**
  The test-report skill must instruct the Tester to use a visible browser (not headless) and capture screenshots as evidence. This is a known requirement from prior MYTEAM pipeline runs.

- **RELATED**
  UC-008, BR-011, BR-029, BR-030, AR-003, PT-003

---

## DI-007 : Write the Manager and Auditor skill files

- **SUMMARY**
  The Manager and Auditor are cross-cutting roles. Their skills define behaviours that span the entire pipeline rather than a single stage.

- **IMPLEMENTATION STEPS**
  1. Create `./build/.github/skills/manager-pipeline-orchestration/SKILL.md`:
     - When to Use: any stage gate failure; inter-stage routing; pipeline recovery.
     - Procedure (gate-failure loop):
       1. Receive failure signal (agent self-report or Auditor flag).
       2. Identify the artifact that failed and the stage that owns it.
       3. Write a specific failure description for that stage's agent.
       4. Route work back to the owning stage agent.
       5. Wait for re-run completion; do not proceed until exit gate is PASS.
       6. After PASS, trigger downstream stages in order.
       7. Record failure, routing action, re-run result, and recovery confirmation in the session log.
     - Explicit prohibitions:
       - Do not edit any stage-owned artifact.
       - Do not skip the re-run of any downstream stage after a recovery.
       - Do not close a failure record without a confirmed PASS.
     - Exit gate: no open failures remain unresolved; all records logged; pipeline at PASS on all gates.
  2. Create `./build/.github/skills/auditor/SKILL.md`:
     - When to Use: after every stage completes.
     - Observation scope (check each):
       - Ownership: did the correct agent produce the artifact?
       - Cross-edit: did any agent modify an artifact it does not own?
       - Exit gate completeness: is the exit gate section present and fully checked?
       - ID sequencing: are IDs sequential and non-reused?
       - Traceability coverage: do RELATED fields point to valid upstream IDs?
     - Audit entry schema:
       ```
       ## AUDIT-XXX : Stage N — YYYY-MM-DD
       - RULE VIOLATED: <rule text>
       - ARTIFACT: <file path>
       - EVIDENCE: <specific observation>
       - SEVERITY: Minor | Major | Blocking
       - STATUS: Open | Resolved
       ```
     - Procedure:
       1. Read the pipeline instruction file to confirm rule set.
       2. Read all artifacts produced in the current stage.
       3. Check each observation scope item.
       4. Append any violations to `X-AUDIT-REPORT.md`.
       5. Report to Manager with a summary of violations found.
       6. If no violations, append a "Stage N — Clean" entry.
     - Explicit prohibitions:
       - Do not fix violations.
       - Do not edit stage artifacts.
       - Do not suppress or omit violations to appear clean.
     - Exit gate: every stage has an audit entry in `X-AUDIT-REPORT.md`; no open blocking violations.
  3. Validate: both files exist and are non-empty; all five sections present.

- **SKILLSET REQUIRED**
  Pipeline governance; audit methodology; defect classification.

- **NOTES**
  The Auditor's "Stage N — Clean" entry when no violations are found is important — it confirms the audit ran, not just that violations exist.

- **RELATED**
  UC-004, UC-006, BR-017, BR-023–BR-026, AR-006, AR-007, PT-004, PT-005

---

## DI-008 : Write `copilot-instructions.md` — workspace entry point

- **SUMMARY**
  This file is automatically read by VS Code Copilot when the workspace opens. It must list all agents, reference the pipeline instruction file, and give the default operating order. It must not duplicate governance rules.

- **IMPLEMENTATION STEPS**
  1. Create `./build/.github/copilot-instructions.md`.
  2. Write a `# GitHub Copilot Workspace Instructions` heading.
  3. Add a brief paragraph stating: this repository is a software factory pipeline; the pipeline instruction file is the source of truth; see `.github/instructions/pipeline.instructions.md`.
  4. Write a `## Default Operating Order` section with numbered steps:
     1. Read `.github/instructions/pipeline.instructions.md` first.
     2. Change into `PROJECTS/<APP>/` and treat it as the active project root.
     3. Load the stage-appropriate skill from `.github/skills/`.
     4. Follow the agent and hook rules in `.github/agents/`.
  5. Write a `## Source Of Truth Rule` section: "Do not restate, fork, or override pipeline policy here."
  6. Write an `## Agents` section listing all 13 agents with their file path and one-line description:
     ```markdown
     - [User/BA](.github/agents/user-ba.agent.md) — Stage 0: validate proposed use cases
     - [Product Owner](.github/agents/product-owner.agent.md) — Stage 1: approve use cases
     - [Writer](.github/agents/writer.agent.md) — Stages 2 & 7: narrative vision and text content
     - [Graphic Artist](.github/agents/graphic-artist.agent.md) — Stages 3 & 8: storyboards and final assets
     - [Business Analyst](.github/agents/business-analyst.agent.md) — Stage 4: business requirements
     - [Architect](.github/agents/architect.agent.md) — Stage 5: architecture and parts
     - [Technical Lead](.github/agents/technical-lead.agent.md) — Stage 6: design instructions
     - [Developer](.github/agents/developer.agent.md) — Stage 9: implementation
     - [Tester](.github/agents/tester.agent.md) — Stage 10: verification and release
     - [Manager](.github/agents/manager.agent.md) — gate recovery and pipeline orchestration
     - [Auditor](.github/agents/auditor.agent.md) — stage compliance observation
     ```
  7. Write a `## Skills` section listing all skill paths for reference.
  8. Write a `## General Expectations` section with 4 rules:
     1. Prefer minimal, stage-correct changes over broad rewrites.
     2. Keep paths repository-relative from the active project folder.
     3. Preserve existing project structure unless the active stage artifact requires a change.
     4. For implementation changes, update project release notes and preserve append-only verification history.
  9. Validate: file is non-empty; all 13 agent file paths resolve within `./build/.github/agents/`; pipeline instruction file path resolves.

- **SKILLSET REQUIRED**
  Technical writing; VS Code Copilot workspace configuration.

- **NOTES**
  This file becomes `.github/copilot-instructions.md` when installed in a new project. Keep all paths relative (not absolute) so the file works after installation.

- **RELATED**
  UC-004, BR-015–BR-016, BR-018, AR-008, PT-006

---

## DI-009 : Write `X-AUDIT-REPORT.md` — initial empty report shell

- **SUMMARY**
  The audit report must exist as a file from the start of the pipeline so the Auditor can append to it without creating it. A shell with the correct schema and an introductory header is sufficient at this stage.

- **IMPLEMENTATION STEPS**
  1. Create `./build/.github/X-AUDIT-REPORT.md` (note: this file lives within the build package so it ships as a template with the pipeline).
  2. Also create `PROJECTS/MT2/X-AUDIT-REPORT.md` for the current project run (this is the live audit file for MT2 itself).
  3. Content for both files:
     ```markdown
     # X-AUDIT-REPORT

     > Append-only audit record. Maintained by the Auditor agent.
     > Do not edit or delete existing entries.

     ## Audit Entry Schema
     ## AUDIT-XXX : Stage N — YYYY-MM-DD
     - RULE VIOLATED: <rule text>
     - ARTIFACT: <file path>
     - EVIDENCE: <specific observation>
     - SEVERITY: Minor | Major | Blocking
     - STATUS: Open | Resolved
     ---
     ```
  4. Validate: both files exist and contain the schema header.

- **SKILLSET REQUIRED**
  File creation; Markdown authoring.

- **NOTES**
  The Auditor appends entries below the schema block. Never overwrite this file — always append.

- **RELATED**
  UC-004, BR-017, AR-007, PT-005, PT-008

---

## DI-010 : Document the traceability ID convention in the pipeline instruction file

- **SUMMARY**
  The ID prefix scheme (UC, BR, AR, PT, DI, TC, GL, T, AUDIT) must be defined in the pipeline instruction file so all agents can reference it without loading a separate document. This is an addition to DI-002 rather than a separate file.

- **IMPLEMENTATION STEPS**
  1. In `./build/.github/instructions/pipeline.instructions.md`, after the Pipeline Stages table, add a `## Traceability ID Convention` section.
  2. Include a Markdown table:
     | Prefix | Full Name | Source Artifact |
     |--------|-----------|-----------------|
     | UC | Use Case | 1-USE-CASES.md |
     | BR | Business Requirement | 4-REQUIREMENTS.md |
     | AR | Architecture Recommendation | 5-ARCHITECTURE-RECOMMENDATIONS.md |
     | PT | Part | 5-PARTS LIST.md |
     | DI | Design Instruction | 6-DESIGN-INSTRUCTIONS.md |
     | TC | Text Content | 7-TEXT-CONTENT.md |
     | GL | Glossary Entry | 7-TEXT-CONTENT.md |
     | GA | Graphic Asset | 8-GRAPHIC-ASSETS.md |
     | T | Test Case | 10-TEST-CASES.md |
     | BUG | Bug Report | 11-BUG-REPORT.md |
     | AUDIT | Audit Entry | X-AUDIT-REPORT.md |
     | RN | Release Notes Entry | 9-RELEASE-NOTES.md |
  3. Add rules below the table:
     - IDs are sequential within each prefix and never reused.
     - New IDs are always appended — never inserted or renumbered.
     - RELATED fields must use valid IDs from this table.
  4. Validate: section is present in `pipeline.instructions.md`; table has all 12 prefix rows.

- **SKILLSET REQUIRED**
  Technical writing; Markdown tables.

- **NOTES**
  This section also satisfies the Auditor's need to verify ID sequencing at each stage — it has a canonical reference to check against.

- **RELATED**
  UC-001, UC-008, BR-014, BR-029, AR-010, PT-007

---

## DI-011 : Verify structural completeness of `./build/.github/` before Stage 9 exit

- **SUMMARY**
  After all files are written, a final structural completeness check must be performed. This DI defines the validation procedure the Developer runs at the end of Stage 9 to confirm the build is installable.

- **IMPLEMENTATION STEPS**
  1. Verify directory tree: `find ./build/.github -type f | sort` must include:
     - `./build/.github/copilot-instructions.md`
     - `./build/.github/instructions/pipeline.instructions.md`
     - 13 files matching `./build/.github/agents/*.agent.md`
     - At minimum 13 files matching `./build/.github/skills/**/SKILL.md`
     - `./build/.github/X-AUDIT-REPORT.md`
  2. Verify no broken internal references: for every skill path in the agent files, confirm the file exists.
  3. Verify the pipeline stage table: confirm 13 rows (stages 0–10, Manager, Auditor).
  4. Verify no stage in the pipeline table has an empty Artifact(s) cell.
  5. Verify all ID prefixes used in RELATED fields across any artifact produced so far resolve to a known prefix in the ID convention table.
  6. Write validation results to `9-RELEASE-NOTES.md`.
  7. Validate: zero unresolved references; zero missing required files; release notes entry written.

- **SKILLSET REQUIRED**
  File system verification; cross-reference checking; release notes writing.

- **NOTES**
  This DI is the Stage 9 exit gate check. It must be the last DI executed.

- **RELATED**
  UC-004, UC-007, UC-008, BR-018, BR-027, BR-029, AR-001, PT-010

---

## Exit Gate — Stage 6

- [x] Every BR/AR pair (BR-001–BR-030, AR-001–AR-010) has at least one DI.
- [x] Every DI is actionable: includes specific file paths, concrete steps, and validation checks.
- [x] DI IDs are sequential (DI-001 through DI-011) and none are reused.
- [x] RELATED fields point to valid UC, BR, AR, and PT IDs.
- [x] Developer can implement from these DIs without requiring clarification.
