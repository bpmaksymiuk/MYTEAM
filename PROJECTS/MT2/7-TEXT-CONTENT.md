# MT2 — Text Content

> Stage 7 artifact. Produced from `6-DESIGN-INSTRUCTIONS.md` and `2-NARRATIVE-VISION.md`.

---

### GLOSSARY

| GL-ID | Term | Canonical Form | Definition | First Appears |
|-------|------|----------------|------------|---------------|
| GL-001 | agent | agent | A VS Code Copilot agent mode defined by an `.agent.md` file. Each agent has exactly one stage assignment, one skill, and one set of owned artifacts. | DI-003 |
| GL-002 | skill | skill | A `SKILL.md` file that encodes the domain knowledge for a pipeline stage. Contains five mandatory sections: When to Use, Target Files, Procedure, Schema, Exit Gate. | DI-004 |
| GL-003 | exit gate | exit gate | A numbered checklist at the end of a skill file. The owning agent self-evaluates each criterion and reports PASS or FAIL with evidence before the next stage may begin. | DI-002 |
| GL-004 | pipeline instruction file | pipeline instruction file | The master governance document at `.github/instructions/pipeline.instructions.md`. Contains the stage table, foundational rules, and execution model. The single source of truth for stage ownership and quality gates. | DI-002 |
| GL-005 | stage artifact | stage artifact | The Markdown file (or directory of files) that a specific stage is solely responsible for producing and maintaining. No other stage may edit a stage artifact. | DI-002 |
| GL-006 | gate failure | gate failure | The state that occurs when an agent's exit-gate self-evaluation produces a FAIL result on one or more criteria. A gate failure must be routed to the Manager before the pipeline may advance. | DI-007 |
| GL-007 | owning stage | owning stage | The pipeline stage that has exclusive write authority over a specific artifact. Defined in the Artifact(s) column of the pipeline stage table. | DI-002 |
| GL-008 | cross-edit | cross-edit | Any modification to a stage artifact by an agent that is not the artifact's owning stage. Strictly prohibited by the pipeline foundational rules. | DI-002 |
| GL-009 | traceability | traceability | The property of a pipeline artifact whereby every element can be traced back to its originating use case via the ID chain: UC → BR → AR/PT → DI → artifact. | DI-010 |
| GL-010 | Manager | Manager | The cross-cutting pipeline role responsible for detecting gate failures, routing work back to the owning stage, and confirming recovery before advancing the pipeline. Does not own or edit any stage artifact. | DI-007 |
| GL-011 | Auditor | Auditor | The cross-cutting pipeline role responsible for observing each stage after it completes and recording any rule violations in `X-AUDIT-REPORT.md`. Does not fix violations. | DI-007 |
| GL-012 | append-only | append-only | A constraint on certain artifacts (`X-AUDIT-REPORT.md`, `10-TEST-REPORT.md`, `11-BUG-REPORT.md`, `9-RELEASE-NOTES.md`) that prohibits editing or deleting existing entries. New records are always added at the end. | DI-009 |
| GL-013 | portable installation package | portable installation package | The complete `./build/.github/` directory tree, structured so it can be copied into any new project's `.github/` folder to activate the MT2 pipeline immediately. | DI-011 |
| GL-014 | advisory input | advisory input | Content in `1-USE-CASES-PROPOSED.md`. It informs but does not trigger the pipeline. Only content promoted to `1-USE-CASES.md` constitutes approved intent. | DI-004 |
| GL-015 | approved intent | approved intent | Content in `1-USE-CASES.md`. The single source of truth for what the pipeline must deliver. Changing this file triggers the full downstream pipeline. | DI-004 |
| GL-016 | shall | shall | The mandatory auxiliary verb used in all business requirement (BR) statements. Indicates a non-negotiable, testable condition. Not interchangeable with "should" or "may". | DI-004 |
| GL-017 | RELATED field | RELATED field | A metadata field present in every pipeline artifact record (UC, BR, AR, PT, DI, TC, GA, T, BUG, AUDIT) that lists the IDs of upstream artifacts that this record depends on or derives from. | DI-010 |
| GL-018 | run ID | run ID | A unique identifier assigned to each test pipeline execution. Format: `T-PIPELINE-<APP>-<NNN>`. Stored in `10-TEST-REPORT.md`. | DI-006 |
| GL-019 | working directory | working directory | The `PROJECTS/<APP>/` folder that agents treat as the active project root for all relative file paths during a pipeline run. | DI-002 |
| GL-020 | frontmatter | frontmatter | A YAML block delimited by `---` at the start of a Markdown file. Used by VS Code Copilot to read structured metadata from `.agent.md` and `.instructions.md` files. | DI-003 |

---

### PHRASEBOOK

| Category | Tone | Voice | Avoid | Example |
|----------|------|-------|-------|---------|
| Governance rules | Authoritative, non-negotiable | Third person (the agent, the stage) | "You should", "consider", "try to" | "Only the owning stage edits its artifact." |
| Procedure steps | Directive, numbered | Imperative (verb-first) | Passive constructions, hedging | "Read the pipeline instruction file first." |
| Exit gate items | Objective, verifiable | Passive observable | Subjective adjectives ("good", "clear") | "Every UC maps to at least one BR." |
| BR statements | Mandatory, atomic | Subject + shall + predicate | "must", "will", "should", multiple conditions in one statement | "The pipeline instruction file shall be located at `./build/.github/instructions/pipeline.instructions.md`." |
| Error/failure descriptions | Precise, actionable | Declarative | Vague blame, emotional language | "Stage 4 exit gate FAIL: BR-007 missing TESTABLE CONDITION." |
| Skill summaries | Concise, purposeful | Third person (this skill, the agent) | First person, marketing language | "This skill encodes the domain knowledge for Stage 4 business requirements." |
| Agent role descriptions | Specialist, bounded | Third person | Generalist framing, scope creep | "The Architect selects technology and makes architecture decisions per business requirements." |
| Audit entries | Factual, traceable | Passive/declarative | Speculation, interpretation | "Stage 5 artifact `5-ARCHITECTURE-RECOMMENDATIONS.md` modified by a non-owning agent." |
| Release notes | Informative, append-only | Past tense declarative | Future tense, incomplete references | "Implemented DI-003 through DI-008. Added 13 agent files to `./build/.github/agents/`." |

---

## TC-001 : Glossary Reference Card

- **SUMMARY**
  A standalone quick-reference card listing all 20 canonical terms defined in the MT2 pipeline glossary. Intended for use by any agent or developer working with the pipeline for the first time.

- **FILE**
  `./build/text/utility/tc-001-glossary-reference.md`

- **CATEGORY**
  Utility

- **TONE NOTES**
  Concise definitions. No prose padding. Canonical form must be used exactly as listed — agents reference these terms when writing skill files and governance rules.

- **GLOSSARY REFERENCES**
  GL-001 through GL-020 (all entries)

- **TRACEABILITY**
  DI-010, AR-010, PT-007

- **RELATED**
  TC-002

---

## TC-002 : Writing Style Guide (Phrasebook Reference)

- **SUMMARY**
  A standalone writing style guide encoding the Phrasebook conventions for anyone authoring new pipeline files. Covers tone rules for governance, procedures, exit gates, BR statements, error descriptions, and audit entries.

- **FILE**
  `./build/text/utility/tc-002-writing-style-guide.md`

- **CATEGORY**
  Utility

- **TONE NOTES**
  Uses the rules it describes. All examples in the style guide must themselves follow the conventions they illustrate.

- **GLOSSARY REFERENCES**
  GL-016 (shall), GL-003 (exit gate), GL-005 (stage artifact)

- **TRACEABILITY**
  DI-002, DI-003, DI-004, AR-005

- **RELATED**
  TC-001

---

## TC-003 : Pipeline Onboarding Narrative

- **SUMMARY**
  A short narrative text (300–400 words) that orients a first-time user of the MT2 pipeline. Explains what the pipeline is, how to start a new project with it, and where to find the key files. Suitable for use in a `README.md` or as the introductory section of `copilot-instructions.md`.

- **FILE**
  `./build/text/narrative/tc-003-onboarding-narrative.md`

- **CATEGORY**
  Narrative

- **TONE NOTES**
  Welcoming but authoritative. Assumes the reader is a developer, not a non-technical stakeholder. Consistent with the "Clarity Over Cleverness" theme from `2-NARRATIVE-VISION.md`.

- **GLOSSARY REFERENCES**
  GL-004 (pipeline instruction file), GL-001 (agent), GL-002 (skill), GL-013 (portable installation package), GL-019 (working directory)

- **TRACEABILITY**
  DI-008, UC-007

- **RELATED**
  TC-001, TC-002

---

## Exit Gate — Stage 7

- [x] GLOSSARY exists with 20 entries (GL-001 through GL-020) covering all key pipeline terms.
- [x] PHRASEBOOK exists with 9 category rows covering all major writing contexts.
- [x] Every text-bearing DI has a TC record.
- [x] TC-001, TC-002, TC-003 each have a non-empty file path at their canonical path.
- [x] TRACEABILITY and GLOSSARY REFERENCES fields are valid.
- [x] Variant decisions are recorded (not applicable — no style-open narrative variants required for utility content).
