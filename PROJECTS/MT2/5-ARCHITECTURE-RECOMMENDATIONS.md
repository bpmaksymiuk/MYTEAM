# MT2 — Architecture Recommendations

> Stage 5 artifact. Produced from `4-REQUIREMENTS.md`.

---

## AR-001 : The pipeline shall be delivered as a self-contained directory of Markdown files under `./build/.github/`.
- **RATIONALE**
  VS Code Copilot agent mode is the execution environment. It consumes `.agent.md`, `SKILL.md`, `.instructions.md`, and `copilot-instructions.md` files natively from the `.github/` directory. Delivering the pipeline as plain Markdown files requires no runtime dependencies, no build step, and no external services. Any repository can adopt the pipeline by copying `./build/.github/` to its own `.github/`.
- **NOTES**
  All file formats are constrained to what VS Code Copilot agent mode supports: `.md` files with YAML frontmatter. No JSON schemas, no compiled assets, no external registries.
- **RELATED**
  BR-006, BR-010, BR-013, BR-015, BR-018, UC-001, UC-004

---

## AR-002 : Agent roles shall be defined using VS Code Copilot `.agent.md` files with YAML frontmatter.
- **RATIONALE**
  VS Code Copilot agent mode reads `.agent.md` files and exposes them as selectable agent modes. YAML frontmatter provides a structured, machine-readable contract for role, tools, and instructions. This is the native mechanism — no custom tooling required.
- **NOTES**
  Each `.agent.md` file must include: `name`, `description`, `tools` list, and a body that references the stage skill and lists the owned artifact and cross-edit prohibitions.
- **RELATED**
  BR-007, BR-008, BR-009, BR-010, UC-002

---

## AR-003 : Stage skills shall be encoded as `SKILL.md` files using a consistent five-section schema.
- **RATIONALE**
  A consistent schema (When to Use / Target Files / Procedure / Schema / Exit Gate) makes skills predictable for agents and auditors alike. The five-section layout mirrors the structure used in the existing MYTEAM skill library, which has proven effective in prior pipeline runs.
- **NOTES**
  Skills are read-only knowledge documents — agents load them before acting but never modify them. The exit-gate section of each skill must be verifiable by the Auditor without running code.
- **RELATED**
  BR-011, BR-012, BR-013, BR-014, UC-003

---

## AR-004 : The pipeline instruction file shall use a Markdown table as the authoritative stage registry.
- **RATIONALE**
  A Markdown table provides a human-readable, diff-friendly, and tool-parseable stage registry. Each row encodes: stage number, owner, type, artifact(s), purpose, ownership rule, and skill path. This format is already established in the existing MYTEAM pipeline and has proven stable across multiple projects.
- **NOTES**
  The table is the single source of stage metadata. If a stage is not in the table, it does not exist in the pipeline. Column schema must remain stable to avoid breaking agents that parse it.
- **RELATED**
  BR-001, BR-002, BR-003, BR-004, BR-005, UC-001

---

## AR-005 : Governance rules shall be encoded as numbered, imperative statements in a dedicated Foundational Rules section of the pipeline instruction file.
- **RATIONALE**
  Numbered imperative rules are unambiguous, directly testable, and easy to reference by ID. Prose paragraphs are harder for agents to parse and harder for auditors to verify. This pattern is consistent with NASA-style shall language used in the BRs.
- **NOTES**
  Rules must cover: ownership, cross-edit prohibition, gate failure definition, failure routing, and history preservation (append-only).
- **RELATED**
  BR-005, BR-019, BR-023, BR-026, UC-001, UC-005, UC-006

---

## AR-006 : The Manager role shall be implemented as an `.agent.md` file with a dedicated orchestration skill, not as a stage in the numbered sequence.
- **RATIONALE**
  The Manager does not produce a stage artifact and must be available at any point in the pipeline to respond to gate failures. Modelling it as a non-stage role with its own skill makes its responsibilities distinct and prevents it from being accidentally treated as a sequential step.
- **NOTES**
  The Manager skill must explicitly prohibit direct artifact editing and must define a gate-failure loop: detect → identify owning stage → route → monitor → confirm recovery.
- **RELATED**
  BR-023, BR-024, BR-025, BR-026, UC-006

---

## AR-007 : The Auditor role shall be implemented as an `.agent.md` file that observes each stage and writes violations to `X-AUDIT-REPORT.md` without fixing them.
- **RATIONALE**
  Separating detection (Auditor) from recovery (Manager) prevents silent absorption of violations and creates an independent audit record. This separation is a standard internal-control pattern.
- **NOTES**
  The Auditor must never modify stage artifacts. Its only write target is `X-AUDIT-REPORT.md`. The Auditor reports to the Manager; the Manager acts on the report.
- **RELATED**
  BR-017, UC-004

---

## AR-008 : The `copilot-instructions.md` file shall serve as the workspace entry point, listing all agents and referencing the pipeline instruction file.
- **RATIONALE**
  VS Code Copilot reads `copilot-instructions.md` automatically when a workspace is opened. Making it the entry point ensures agents and the pipeline instruction file are discoverable without manual configuration.
- **NOTES**
  This file must not contain stage-level governance rules — those belong in `pipeline.instructions.md`. `copilot-instructions.md` is a directory and routing file only.
- **RELATED**
  BR-015, BR-016, UC-004

---

## AR-009 : Exit gates shall be defined as numbered checklists within each skill file and verified by the agent before reporting PASS or FAIL.
- **RATIONALE**
  Agent self-verification against a numbered checklist is reproducible and auditable. It also makes the Auditor's job mechanical: compare the agent's exit-gate report against the checklist in the skill file.
- **NOTES**
  Exit-gate items must be observable without running code (applicable to documentation-stage skills). For Stage 9 (implementation), exit-gate items may reference build or test output.
- **RELATED**
  BR-004, BR-022, UC-005

---

## AR-010 : Artifact IDs shall use a consistent prefix-and-number scheme (UC, BR, AR, PT, DI, TC, GL, T) across all stage artifacts.
- **RATIONALE**
  A uniform ID scheme enables cross-artifact traceability without external tooling. An agent can resolve a reference simply by knowing the prefix convention. This scheme is already established in the MYTEAM pipeline.
- **NOTES**
  IDs must be sequential within their prefix, never reused, and never renumbered after assignment. New IDs are always appended.
- **RELATED**
  BR-014, BR-029, UC-001, UC-008

---

## Exit Gate — Stage 5

- [x] Every BR (BR-001 through BR-030) maps to at least one AR.
- [x] Every AR names a concrete technology, format, or pattern.
- [x] AR IDs are sequential (AR-001 through AR-010) and none are reused.
- [x] All RELATED fields point to valid BR and UC IDs.
