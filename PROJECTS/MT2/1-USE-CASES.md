# MT2 — Approved Use Cases

> Stage 1 approved. This file is the single source of pipeline intent for MT2.
> Approved: 2026-04-29

---

## UC-001 : Pipeline Author — Define Pipeline Stages and Governance

- **STEPS**
  1. Author reads `goal.md` to understand the scope of the new pipeline.
  2. Author defines the ordered list of pipeline stages, with one agent assigned per stage.
  3. Author specifies each stage's purpose, owned artifact(s), and acceptance criteria.
  4. Author writes the governance rules: stage ownership, cross-edit prohibition, exit-gate logic, and failure-routing policy.
  5. Author produces a master pipeline instruction file at `./build/.github/instructions/pipeline.instructions.md`.

- **ACCEPTANCE CRITERIA**
  1. Every stage has exactly one owning agent.
  2. Every stage has at least one owned artifact.
  3. Every stage has measurable acceptance criteria that constitute its exit gate.
  4. Governance rules cover: ownership, cross-edit prohibition, exit gates, and failure routing.
  5. The pipeline instruction file is present and complete in `./build/`.

- **NOTES**
  - The pipeline instruction file is the single source of truth for stage order, ownership, and quality gates.

- **RELATED**
  - UC-002, UC-003, UC-004

---

## UC-002 : Pipeline Author — Author Stage Agent Configuration

- **STEPS**
  1. Author identifies each distinct agent role in the pipeline (one per stage plus Manager and Auditor).
  2. Author writes an `.agent.md` file for each agent defining its role, tool permissions, stage assignment, and skill reference.
  3. Author places all agent files under `./build/.github/agents/`.
  4. Author verifies each agent file references the correct skill and artifact for its stage.

- **ACCEPTANCE CRITERIA**
  1. One `.agent.md` file exists per pipeline stage plus Manager and Auditor.
  2. Each file specifies: role description, tool permissions, stage assignment, owned artifact(s), and skill reference.
  3. No two agent files claim ownership of the same artifact.
  4. All agent files are located under `./build/.github/agents/`.

- **NOTES**
  - Agent files are consumed by VS Code Copilot agent mode.

- **RELATED**
  - UC-001, UC-003

---

## UC-003 : Pipeline Author — Author Stage Skill Definitions

- **STEPS**
  1. Author identifies all tasks performed within each pipeline stage.
  2. Author writes a `SKILL.md` file for each stage that defines the procedure, target files, exit gate, and schema rules.
  3. Author optimises each skill for accuracy and completeness, eliminating ambiguity.
  4. Author places each skill under `./build/.github/skills/<skill-name>/SKILL.md`.
  5. Author ensures each skill's exit gate matches the acceptance criteria defined in UC-001.

- **ACCEPTANCE CRITERIA**
  1. One `SKILL.md` exists per pipeline stage.
  2. Each skill file contains: purpose, target files, step-by-step procedure, schema definitions, and an exit gate checklist.
  3. All skill files are located under `./build/.github/skills/`.
  4. Every skill's exit gate is traceable to at least one stage acceptance criterion from UC-001.

- **NOTES**
  - Skills are the executable knowledge base for each stage agent.

- **RELATED**
  - UC-001, UC-002

---

## UC-004 : Pipeline Author — Author Repository Customisation Files

- **STEPS**
  1. Author writes `./build/.github/copilot-instructions.md` referencing the pipeline instruction file and listing all agents.
  2. Author writes the Manager skill under `./build/.github/skills/manager-pipeline-orchestration/SKILL.md`.
  3. Author writes the Auditor agent and skill files.
  4. Author validates that `copilot-instructions.md` correctly lists every agent and skill file path.
  5. Author confirms the complete `./build/.github/` directory contains all required customisation files.

- **ACCEPTANCE CRITERIA**
  1. `./build/.github/copilot-instructions.md` exists and references the pipeline instruction file.
  2. Every agent defined in UC-002 appears in `copilot-instructions.md`.
  3. Every skill defined in UC-003 appears in the agents list or pipeline instruction table.
  4. Auditor agent and skill are present and reference the audit report artifact.
  5. No broken file-path references exist in any customisation file.

- **NOTES**
  - The Auditor runs after every stage and documents violations in `X-AUDIT-REPORT.md`.

- **RELATED**
  - UC-001, UC-002, UC-003

---

## UC-005 : Stage Agent — Execute Assigned Stage Work

- **STEPS**
  1. Agent receives a run instruction identifying the active project and stage.
  2. Agent reads the pipeline instruction file to confirm stage ownership and required upstream artifacts.
  3. Agent loads its assigned skill file.
  4. Agent consumes all required upstream artifacts as inputs.
  5. Agent produces the stage-owned artifact(s) according to the skill procedure.
  6. Agent checks its own exit gate and reports PASS or FAIL with evidence.

- **ACCEPTANCE CRITERIA**
  1. Agent reads the pipeline instruction file before acting.
  2. Agent loads and follows the procedure in its assigned skill file.
  3. All required upstream artifacts are consumed before output is produced.
  4. Owned artifact(s) are produced and conform to the schema defined in the skill.
  5. Agent self-reports exit-gate result with specific evidence for each criterion.

- **NOTES**
  - No stage starts until the previous stage exit gate is PASS.
  - Agent must not edit artifacts owned by other stages.

- **RELATED**
  - UC-001, UC-006

---

## UC-006 : Manager Agent — Recover Failed Stage Gates

- **STEPS**
  1. Manager detects a stage exit-gate FAIL (from agent self-report or Auditor flag).
  2. Manager identifies the owning stage of the failed artifact.
  3. Manager routes work back to that stage's agent with a specific failure description.
  4. Manager monitors re-run completion and confirms the exit gate now passes.
  5. Manager triggers downstream stages in order after the gate passes.
  6. Manager records all gate failures and recovery actions in the session log.

- **ACCEPTANCE CRITERIA**
  1. Manager never edits a stage-owned artifact directly.
  2. Every failure is routed back to the correct owning stage.
  3. Downstream stages are re-run in order after each recovery.
  4. All gate-failure events and resolutions are recorded.
  5. Manager confirms exit-gate PASS before promoting to the next stage.

- **NOTES**
  - Manager is the only role that may interrupt stage order in response to failures.

- **RELATED**
  - UC-005, UC-007

---

## UC-007 : User — Initialise a New Project Using the New Pipeline

- **STEPS**
  1. User creates a new project folder under `PROJECTS/<NEW-APP>/`.
  2. User writes a `goal.md` describing the new project.
  3. User, assisted by the BA agent, drafts proposed use cases into `1-USE-CASES-PROPOSED.md`.
  4. User promotes approved use cases to `1-USE-CASES.md`.
  5. User instructs the Manager to run the pipeline from Stage 2 onward.
  6. User reviews deliverables at each stage gate before approving continuation.

- **ACCEPTANCE CRITERIA**
  1. New project folder exists with `goal.md` and `1-USE-CASES.md` as starting artifacts.
  2. Pipeline stages execute in the defined order with no skipped stages.
  3. Each stage produces its owned artifact before the next stage begins.
  4. User can review and approve or reject each stage gate result.
  5. Final `./build/` contains a working product that satisfies all approved use cases.

- **NOTES**
  - This use case validates the fitness of the new pipeline for real project use.

- **RELATED**
  - UC-001, UC-005, UC-006

---

## UC-008 : Tester — Validate the Assembled Pipeline End-to-End

- **STEPS**
  1. Tester reads all agent files, skill files, and the pipeline instruction file in `./build/`.
  2. Tester verifies structural completeness: one agent per stage, one skill per stage, all cross-references resolve.
  3. Tester executes a sample pipeline run on a minimal test project using the new pipeline.
  4. Tester records pass/fail evidence for each stage gate in a test report.
  5. Tester files any defects as bug reports against the owning stage.
  6. Tester issues a release recommendation (PASS / FAIL / CONDITIONAL).

- **ACCEPTANCE CRITERIA**
  1. Every agent file and skill file in `./build/.github/` is verified for structural completeness.
  2. All cross-references (agent → skill, pipeline table → skill paths) resolve without broken links.
  3. A sample project can be taken from Stage 0 to Stage 10 using only the new pipeline files.
  4. Test report records pass/fail evidence for every stage gate.
  5. A release recommendation is issued with justification.

- **NOTES**
  - A CONDITIONAL recommendation must list specific caveats that must be resolved before production use.

- **RELATED**
  - UC-007, UC-005, UC-006
