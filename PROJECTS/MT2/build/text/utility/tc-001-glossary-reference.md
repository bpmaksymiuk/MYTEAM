# MT2 Pipeline — Glossary Reference Card

> Canonical terms for the MT2 software factory pipeline.
> Use these exact forms in all pipeline artifacts, skill files, and agent configurations.

| GL-ID | Term | Definition |
|-------|------|------------|
| GL-001 | agent | A VS Code Copilot agent mode defined by an `.agent.md` file. Each agent has exactly one stage assignment, one skill, and one set of owned artifacts. |
| GL-002 | skill | A `SKILL.md` file that encodes the domain knowledge for a pipeline stage. Contains five mandatory sections: When to Use, Target Files, Procedure, Schema, Exit Gate. |
| GL-003 | exit gate | A numbered checklist at the end of a skill file. The owning agent self-evaluates each criterion and reports PASS or FAIL with evidence before the next stage may begin. |
| GL-004 | pipeline instruction file | The master governance document at `.github/instructions/pipeline.instructions.md`. Contains the stage table, foundational rules, and execution model. The single source of truth for stage ownership and quality gates. |
| GL-005 | stage artifact | The Markdown file (or directory of files) that a specific stage is solely responsible for producing and maintaining. No other stage may edit a stage artifact. |
| GL-006 | gate failure | The state that occurs when an agent's exit-gate self-evaluation produces a FAIL result on one or more criteria. A gate failure must be routed to the Manager before the pipeline may advance. |
| GL-007 | owning stage | The pipeline stage that has exclusive write authority over a specific artifact. Defined in the Artifact(s) column of the pipeline stage table. |
| GL-008 | cross-edit | Any modification to a stage artifact by an agent that is not the artifact's owning stage. Strictly prohibited by the pipeline foundational rules. |
| GL-009 | traceability | The property of a pipeline artifact whereby every element can be traced back to its originating use case via the ID chain: UC → BR → AR/PT → DI → artifact. |
| GL-010 | Manager | The cross-cutting pipeline role responsible for detecting gate failures, routing work back to the owning stage, and confirming recovery before advancing the pipeline. Does not own or edit any stage artifact. |
| GL-011 | Auditor | The cross-cutting pipeline role responsible for observing each stage after it completes and recording any rule violations in `X-AUDIT-REPORT.md`. Does not fix violations. |
| GL-012 | append-only | A constraint on certain artifacts (`X-AUDIT-REPORT.md`, `10-TEST-REPORT.md`, `11-BUG-REPORT.md`, `9-RELEASE-NOTES.md`) that prohibits editing or deleting existing entries. New records are always added at the end. |
| GL-013 | portable installation package | The complete `./build/.github/` directory tree, structured so it can be copied into any new project's `.github/` folder to activate the MT2 pipeline immediately. |
| GL-014 | advisory input | Content in `1-USE-CASES-PROPOSED.md`. It informs but does not trigger the pipeline. Only content promoted to `1-USE-CASES.md` constitutes approved intent. |
| GL-015 | approved intent | Content in `1-USE-CASES.md`. The single source of truth for what the pipeline must deliver. Changing this file triggers the full downstream pipeline. |
| GL-016 | shall | The mandatory auxiliary verb used in all business requirement (BR) statements. Indicates a non-negotiable, testable condition. Not interchangeable with "should" or "may". |
| GL-017 | RELATED field | A metadata field present in every pipeline artifact record that lists the IDs of upstream artifacts this record depends on or derives from. |
| GL-018 | run ID | A unique identifier assigned to each test pipeline execution. Format: `T-PIPELINE-<APP>-<NNN>`. Stored in `10-TEST-REPORT.md`. |
| GL-019 | working directory | The `PROJECTS/<APP>/` folder that agents treat as the active project root for all relative file paths during a pipeline run. |
| GL-020 | frontmatter | A YAML block delimited by `---` at the start of a Markdown file. Used by VS Code Copilot to read structured metadata from `.agent.md` and `.instructions.md` files. |
