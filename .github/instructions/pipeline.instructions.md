---
applyTo: "PROJECTS/**"
---

# Software Development Pipeline

## Purpose

This pipeline converts business intent into verified software through strict stage gates, traceable artifacts, and controlled rework loops.

Primary goals:
1. End-to-end traceability from use case to test evidence.
2. Predictable quality gates before code promotion.
3. Fast, safe failure handling through targeted rollback to owning stage.

## Repository Location And Working Directory

Repository location convention:
1. PROJECTS/(APPLICATION NAME)
2. Example: PROJECTS/BrowserBuddy

Working-directory rule:
1. Before running the pipeline, set the working directory to PROJECTS/(APPLICATION NAME).
2. Treat that directory as repository root for all pipeline operations.
3. Keep all paths in this document and generated artifacts repository-relative (for example: ./build, 1-USE-CASES.md).
4. Do not use absolute machine-specific paths in stage outputs.

## Scope

Applies to all product changes delivered through this repository, including:
1. Proposal updates in 1-USE-CASES-PROPOSED.md.
2. Requirement updates.
3. Architecture and design changes.
4. All source code updates under ./build.
5. Verification and release recommendation in 6-TEST-REPORT.md.

Shared resource asset rule:
1. When a use case, requirement, architecture, design, or implementation needs an image or external static file, source it from ./resources at repository root.
2. Do not pull runtime assets from machine-specific absolute paths.
3. For application runtime delivery, copy required files from ./resources into the target app's served resources path (for example: ./build/resources).

## Foundational Rules

### Artifact Ownership — Do Not Cross Boundaries

| File | Owner | Rule |
|------|-------|-------|
| `1-USE-CASES.md` | User | Never modify without user instruction |
| `2-REQUIREMENTS.md` | Business Analyst | Regenerate only when `1-USE-CASES.md` changes |
| `3-ARCHITECTURE-RECOMMENDATIONS.md`, `3-PARTS LIST.md` | Architect | Regenerate only when `2-REQUIREMENTS.md` changes |
| `4-DESIGN-INSTRUCTIONS.md` | Technical Lead | Regenerate only when Stage 3 changes |
| `./build/**` | Developer | All code output goes here |
| `5-RELEASE-NOTES.md` | Developer | Append new entry at top for every code change |
| `6-TEST-REPORT.md` | Tester | Append-only; never overwrite existing runs |
| `7-BUG-REPORT.md` | Tester | Append-only; one section per bug |

### Artifact Documentation

Each artifact has a dedicated instruction file in `.github/instructions/` with complete schema, field guidance, processing rules, and exit gates:

| Artifact | Instruction File |
|----------|------------------|
| `1-USE-CASES.md` | `.github/instructions/1-use-cases.instructions.md` |
| `2-REQUIREMENTS.md` | `.github/instructions/2-requirements.instructions.md` |
| `3-ARCHITECTURE-RECOMMENDATIONS.md`, `3-PARTS LIST.md` | `.github/instructions/3-architecture.instructions.md` |
| `4-DESIGN-INSTRUCTIONS.md` | `.github/instructions/4-design-instructions.instructions.md` |
| `5-RELEASE-NOTES.md` | `.github/instructions/5-release-notes.instructions.md` |
| `6-TEST-REPORT.md` | `.github/instructions/6-test-report.instructions.md` |
| `7-BUG-REPORT.md` | `.github/instructions/7-bug-report.instructions.md` |

When working on any artifact, load the corresponding instruction file for detailed field guidance, processing rules, and exit gates.

### ID Conventions

- Use Cases: `UC-XXX` — never reuse
- Requirements: `BR-XXX` — never reuse
- Architecture: `AR-XXX` — never reuse
- Parts: `PT-XXX` — never reuse
- Design instructions: `DI-XXX` — never reuse
- Bugs: `BUG-<PROJECTABBR>-NNN` — 2–3 letter abbreviation from project name, never reuse
- Test pipelines: `T-PIPELINE-<PROJECT>-NNN` — sequential per project

### ID And Traceability Policy

1. Use fixed-width hierarchical IDs.
2. Parent linkage is explicit through RELATED fields in records.
3. IDs are immutable after publication.
4. If scope changes materially, add new IDs instead of renaming existing IDs.
5. Numbering starts at 001 within each parent scope.

Minimum traceability chain:
1. Every TEST RESULT.RELATED BR ID maps to an existing BR ID.
2. Every code change maps to at least one DI ID.
3. Every DI-XXX has an explicit RELATED field listing parent UC-XXX, BR-XXX, and AR-XXX.
4. Every DI RELATED AR-XXX maps to an existing AR-XXX.
5. Every AR-XXX has an explicit RELATED field listing its parent BR-XXX and UC-XXX.
6. Every BR-XXX has an explicit RELATED field listing its parent UC-XXX.
7. Every BR RELATED UC-XXX maps to an existing UC-XXX in 1-USE-CASES.md.
8. Every AR RELATED BR-XXX and UC-XXX map to existing records.

### Roles And Ownership

| Actor | Type | Accountability |
|-------|------|----------------|
| User | Person | Authors proposal use cases in 1-USE-CASES-PROPOSED.md |
| Product Owner (PO) | Person | Defines and approves business intent in use cases |
| Business Analyst (BA) | Agent | Converts use cases into atomic, testable business requirements |
| Architect (A) | Agent | Produces architecture decisions and tradeoffs per requirement |
| Technical Lead (TL) | Agent | Produces implementation-ready technical design |
| Developer | Agent | Implements approved design in ./build with traceability |
| Tester | Agent | Verifies behavior, regressions, and release readiness |
| Manager | Agent | Routes failures to owning stage and drives rerun to closure |

### Agent Communication Protocols

Each agent is responsible for adhering to role identification and avatar display standards in pipeline chat. For detailed communication protocol requirements (Self-Reference Protocol and Avatar Protocol), see each agent's Communication Protocol section:

- [Business Analyst](.github/agents/business-analyst.agent.md#communication-protocol)
- [Architect](.github/agents/architect.agent.md#communication-protocol)
- [Technical Lead](.github/agents/technical-lead.agent.md#communication-protocol)
- [Developer](.github/agents/developer.agent.md#communication-protocol)
- [Tester](.github/agents/tester.agent.md#communication-protocol)
- [Manager](.github/agents/manager.agent.md#communication-protocol)

### Quality Gates

Global rules:
1. No stage starts until previous stage exit gate is PASS.
2. A stage output is invalid if required schema fields are missing.
3. A gate is FAIL if evidence is vague, untestable, or missing.
4. Verification can pass with runtime caveats only when explicitly called out in evidence and notes.
5. If any runtime caveat or implementation limitation is identified, it must be documented in both 1-USE-CASES.md (per-use-case IMPLEMENTATION COMMENT) and 5-RELEASE-NOTES.md (run-level caveat section).

### Change Control Best Practices

1. Treat 1-USE-CASES.md as the single source of intent.
2. Treat 1-USE-CASES-PROPOSED.md as advisory input owned by the user.
3. Re-run full downstream chain after Stage 1 use case changes.
4. Keep generated artifacts deterministic and schema-stable.
5. Avoid manual edits to downstream docs that are not derived from inputs.
6. Prefer small, reviewable increments; one logical scope change per run.
7. Preserve historical test evidence by appending, not replacing, pipeline execution records.

---

# Pipeline Stages

## Stage 0: Proposed Business Use Cases (Advisory)

**Owner:** User (validated by BA)  
**Artifact:** `1-USE-CASES-PROPOSED.md`  
**Input:** Product idea, constraints  
**Output:** Proposed use cases for review

### User Responsibility

Author use case proposals in `1-USE-CASES-PROPOSED.md` with potential features, workflows, and user interactions. This stage is advisory only and does not trigger the pipeline.

### Business Analyst Validation

Whenever `1-USE-CASES-PROPOSED.md` is updated:
1. Validate that each record follows the use-case schema
2. Verify high-quality, testable acceptance criteria
3. If issues found, report specific corrections
4. Update only `1-USE-CASES-PROPOSED.md` — do not generate `2-REQUIREMENTS.md`

Stage 0 quality gate passes when:
- File follows use-case schema (UC-XXX header, STEPS, ACCEPTANCE CRITERIA, NOTES, RELATED fields)
- Records are high quality and actionable

### Execution Policy

1. Stage 0 is advisory and optional.
2. Updating Stage 0 does **not** trigger Stage 1 or downstream stages.
3. Stage 1 is the only official kickoff for the pipeline.
4. BA validates Stage 0 quality and format whenever it is updated.

**For detailed guidance:** See `.github/instructions/1-use-cases.instructions.md`

---

## Stage 1: Business Use Cases (Official Kickoff)

**Owner:** Product Owner / User  
**Artifact:** `1-USE-CASES.md`  
**Input:** Product idea, constraints, optional Stage 0 proposals  
**Output:** Approved use cases that define pipeline intent  

### PO / User Responsibility

Author or refine use cases in `1-USE-CASES.md`. This is the **single source of pipeline intent**. Updating this file triggers Stage 2 and downstream execution.

Each use case must include:
- Actor and use case name
- Clear, numbered steps
- Measurable acceptance criteria
- Related use cases or dependencies

### Exit Gate (Stage 1)

Pipeline stages 2–6 may only run when:
1. Every use case has complete fields
2. Every use case has clear, measurable acceptance criteria
3. All records follow the use-case schema

**For detailed guidance:** See `.github/instructions/1-use-cases.instructions.md`

---

## Stage 2: Business Requirements

**Owner:** Business Analyst (BA)  
**Artifact:** `2-REQUIREMENTS.md`  
**Input:** `1-USE-CASES.md`  
**Output:** Atomic, testable business requirements  

### Business Analyst Responsibility

Convert use cases into complete, testable business requirements. Trigger this stage by updating `1-USE-CASES.md`.

**For detailed guidance and exit gate criteria:** See `.github/instructions/2-requirements.instructions.md`

---
## Stage 3: Software Architecture

**Owner:** Architect (A)  
**Artifacts:** `3-ARCHITECTURE-RECOMMENDATIONS.md`, `3-PARTS LIST.md`  
**Input:** `2-REQUIREMENTS.md`  
**Output:** Architecture decisions and component inventory  

### Architect Responsibility

Translate every business requirement into one or more concrete architecture decisions. Both artifacts **must be generated in the same Stage 3 run**: `3-ARCHITECTURE-RECOMMENDATIONS.md` and `3-PARTS LIST.md`.

**For detailed guidance and exit gate criteria:** See `.github/instructions/3-architecture.instructions.md`

## Stage 4: Technical Design

**Owner:** Technical Lead (TL)  
**Artifact:** `4-DESIGN-INSTRUCTIONS.md`  
**Input:** `2-REQUIREMENTS.md`, `3-ARCHITECTURE-RECOMMENDATIONS.md`, `3-PARTS LIST.md`  
**Output:** Implementation-ready instructions for Developer  

### Technical Lead Responsibility

Produce detailed, actionable implementation instructions in `4-DESIGN-INSTRUCTIONS.md` that Developers can follow without clarifying questions.

**For detailed guidance and exit gate criteria:** See `.github/instructions/4-design-instructions.instructions.md`

---
## Stage 5: Implementation & Release

**Owner:** Developer  
**Artifacts:** `./build/` + `5-RELEASE-NOTES.md`  
**Input:** `4-DESIGN-INSTRUCTIONS.md`  
**Output:** Source code + release notes with traceability

### Developer Responsibility
I
1. Implement approved design. in `.github/instructions/5-implementation.instructions.md`

2. Generate release notes with traceability to design instructions.See `.github/instructions/5-release-notes.instructions.md`

---
## Stage 6: Verification & Release

**Owner:** Tester  
**Artifacts:** `6-TEST-REPORT.md`, `7-BUG-REPORT.md`  
**Input:** All Stage 1–5 artifacts + `./build`  
**Output:** Test evidence + release decision  

### Tester Responsibility
1. Verify that implemented code meets all use cases and requirements.
2. Record test results in `6-TEST-REPORT.md` and any defects in `7-BUG-REPORT.md`.
3. Provide a final release recommendation based on test outcomes.

For detailed test report and bug report guidance, see `../instructions/6-test-report.instructions.md` and `../instructions/7-bug-report.instructions.md`.

Before testing, read `1-USE-CASES.md`, `2-REQUIREMENTS.md`, `5-RELEASE-NOTES.md`, and existing `6-TEST-REPORT.md`.

## Manager: Gate Failure Loop

**Owner:** Manager  
**Role:** Pipeline orchestration and failure recovery  

### Responsibilities

When any stage gate fails:
1. **Diagnose** — Identify failed gate item and owning stage
2. **Route** — Return work **only** to the owning stage
3. **Regenerate** — Regenerate that stage's output
4. **Cascade** — Re-run all downstream stages in order
5. **Update** — Append new PIPELINE EXECUTION record
6. **Repeat** — Continue until all gates PASS

#### Artifact Verification

When routing work back to a failing stage, ensure that stage owner creates/updates their artifacts correctly. If a stage reports success but artifacts don't exist, route work back to that stage owner with explicit instruction to use `create_file` or `replace_string_in_file` tools to actually create/write the files.

Verify artifacts exist and gates pass. If artifact files are missing or incomplete, it is a stage failure — do not accept the work as complete.

#### Ownership Routing

| Issue | Route To |
|-------|----------|
| Use case quality | Stage 1 |
| Requirement quality | Stage 2 |
| Architecture quality | Stage 3 |
| Design quality | Stage 4 |
| Code or build quality | Stage 5 |
| Test quality or recommendation | Stage 6 |

### Communication Requirements

1. Use role-labeled phrasing: `(Manager) ...`
2. Include avatar whenever possible.
3. For full pipeline runs, orchestrate visible role handoffs:
   - Ensure ≥1 message from each: BA, Architect, TL, Developer, Tester, then Manager
   - Messages must be in execution order
   - Do **not** present all execution as Manager narration only
   - When routing failures, clearly communicate which stage is being re-run and why (for example: `(Manager) Routing back to Stage 3 Architect due to failed architecture gate: missing traceability from AR-XXX to BR-XXX`)
   - Announce artifacts that are ready. For example: `(Manager) Stage 4 complete. 4-DESIGN-INSTRUCTIONS.md is ready for Developer implementation.`
   - Announce when an agent is starting work on a stage. For example: `(Developer) Starting implementation for Stage 5 based on 4-DESIGN-INSTRUCTIONS.md...`
   - Announce when an agent has completed their stage work. For example: `(Developer)
      Completed implementation for Stage 5. Code is in ./build/ and release notes updated in 5-RELEASE-NOTES.md.`

4. Clearly communicate which stage is being re-run and why

---

# Pipeline Execution Model

## Standard Run Procedure

1. **Set working directory** to `PROJECTS/<APP>`
2. **(Optional) Stage 0:** Update `1-USE-CASES-PROPOSED.md` for ideas (BA validates; does not trigger pipeline)
3. **Stage 1:** Update `1-USE-CASES.md` (official kickoff)
4. **Stage 2:** Regenerate `2-REQUIREMENTS.md`
5. **Stage 3:** Regenerate `3-ARCHITECTURE-RECOMMENDATIONS.md` and `3-PARTS LIST.md` in same run
6. **Stage 4:** Regenerate `4-DESIGN-INSTRUCTIONS.md`
7. **Stage 5:** Implement in `./build` and document in `5-RELEASE-NOTES.md`
8. **Stage 6:** Generate `6-TEST-REPORT.md` and append `7-BUG-REPORT.md` entries
9. **Manager (if needed):** Route any gate failures back to owning stage and cascade

## Completion Criteria

A pipeline run is **Done** only when:
1. Stages 1–6 all pass their exit gates
2. Traceability chain is intact: UC → BR → AR → PT → DI → Code → Test Evidence
3. Source code exists in `./build` for every in-scope DI-XXX ID
4. `6-TEST-REPORT.md` contains final **PASS PIPELINE** decision
5. All runtime caveats explicitly documented in UC IMPLEMENTATION COMMENT and release notes

## Failure Handling Loop

If any gate fails:
1. Identify failed stage and gate item detail
2. Return **only** to that stage (do not skip upstream)
3. Regenerate that stage's output
4. Re-run all downstream stages in execution order
5. Manager appends new PIPELINE EXECUTION record
6. Repeat until all gates PASS
