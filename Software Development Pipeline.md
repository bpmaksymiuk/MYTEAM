# Software Development Pipeline

## Purpose

This pipeline converts business intent into verified software through strict stage gates, traceable artifacts, and controlled rework loops.

Primary goals:
1. End-to-end traceability from use case to test evidence.
2. Predictable quality gates before code promotion.
3. Fast, safe failure handling through targeted rollback to owning stage.

## Repository Location And Working Directory

Repository location convention:
1. PROJECTS/(APPLICATIONNAME)
2. Example: PROJECTS/BrowserBuddy

Working-directory rule:
1. Before running the pipeline, set the working directory to PROJECTS/(APPLICATIONNAME).
2. Treat that directory as repository root for all pipeline operations.
3. Keep all paths in this document and generated artifacts repository-relative (for example: ./src, 1-BUSINESS-USE-CASES.md).
4. Do not use absolute machine-specific paths in stage outputs.

## Scope

Applies to all product changes delivered through this repository, including:
1. Proposal updates in 0-PROPOSED-BUSINESS-USE-CASES.md.
2. Requirement updates.
3. Architecture and design changes.
4. Source code updates under ./src.
5. Verification and release recommendation in 6-TEST-REPORT.md.

Shared resource asset rule:
1. When a use case, requirement, architecture, design, or implementation needs an image or external static file, source it from ./resources at repository root.
2. Do not pull runtime assets from machine-specific absolute paths.
3. For application runtime delivery, copy required files from ./resources into the target app's served resources path (for example: ./public/resources).

## Roles And Ownership

| Actor | Type | Accountability |
|-------|------|----------------|
| User | Person | Authors proposal use cases in 0-PROPOSED-BUSINESS-USE-CASES.md |
| Product Owner (PO) | Person | Defines and approves business intent in use cases |
| Business Analyst (BA) | Agent | Converts use cases into atomic, testable business requirements |
| Architect (A) | Agent | Produces architecture decisions and tradeoffs per requirement |
| Technical Lead (TL) | Agent | Produces implementation-ready technical design |
| Developer | Agent | Implements approved design in ./src with traceability |
| Tester | Agent | Verifies behavior, regressions, and release readiness |
| Pipeline Controller | Agent | Routes failures to owning stage and drives rerun to closure |

## Agent Self-Reference Protocol

1. In all pipeline chat responses, an agent must identify itself by role when using first-person phrasing.
2. Preferred format: `I (the <ROLE>) ...`.
3. Examples:
   - `I (the Business Analyst) will convert UC records into BR entries.`
   - `I (the Technical Lead) will produce implementation-ready design records.`
4. The active role must match the stage currently being executed.
5. This protocol applies to all stage agents and the Pipeline Controller in both chat updates and final summaries.

## Stage Model

| Stage | Owner | Required Input | Required Output | Exit Gate |
|------|-------|----------------|-----------------|-----------|
| 0. Proposed Business Use Cases (Advisory) | User (validated by BA) | Product idea, constraints | 0-PROPOSED-BUSINESS-USE-CASES.md | File follows use-case schema and records are high quality; this stage never starts the pipeline |
| 1. Business Use Cases | PO | Product idea, constraints, optional proposals from Stage 0 | 1-BUSINESS-USE-CASES.md | Every use case has complete fields and measurable acceptance criteria |
| 2. Business Requirements | BA | 1-BUSINESS-USE-CASES.md | 2-BUSINESS-REQUIREMENTS.md | Every use case maps to >=1 BR ID; requirements are atomic and testable |
| 3. Software Architecture | A | 2-BUSINESS-REQUIREMENTS.md | 3-SOFTWARE-ARCHITECTURE.md | Every BR ID has >=1 ARCHITECTURE entry with explicit decisions and tradeoffs |
| 4. Technical Design | TL | 2-BUSINESS-REQUIREMENTS.md, 3-SOFTWARE-ARCHITECTURE.md | 4-TECHNICAL-DESIGN.md | Every BR ID has >=1 DESIGN entry with actionable tasks and explicit contracts |
| 5. Implementation | Developer | 4-TECHNICAL-DESIGN.md | ./src , 5-IMPLEMENTATION-RELEASE-NOTES.md | Implemented changes are traceable to DESIGN IDs and quality checks pass, and version documented here 5-IMPLEMENTATION-RELEASE-NOTES.md with historical information preserved |
| 6. Verification | Tester | Stages 1-5 artifacts and ./src | 6-TEST-REPORT.md | Critical BR coverage, evidence quality, defects captured, clear PASS or FAIL |

Stage 0 execution policy:
1. Stage 0 is advisory and optional.
2. Updating Stage 0 does not trigger Stage 1 or any downstream pipeline stage.
3. Stage 1 remains the only kickoff point for a full pipeline run.
4. BA validates Stage 0 quality and format whenever Stage 0 is updated.

## Artifact Contracts

### 0-PROPOSED-BUSINESS-USE-CASES.md

Record schema:

USE CASE:
- USE CASE ID
- GOAL
- ACTOR
- STEP BY STEP WALKTHROUGH
- ACCEPTANCE CRITERIA

Notes:
1. This file is user-authored and advisory.
2. This file does not replace 1-BUSINESS-USE-CASES.md as the source of pipeline intent.

### 1-BUSINESS-USE-CASES.md

Record schema:

USE CASE:
- USE CASE ID
- GOAL
- ACTOR
- STEP BY STEP WALKTHROUGH
- ACCEPTANCE CRITERIA

Caveat annotation rule:
1. If any runtime caveat, platform limitation, permission dependency, or partial implementation exists for a use case, add `- IMPLEMENTATION COMMENT: <clear caveat text>` directly under ACTOR in that use case.
2. If no caveat exists, omit IMPLEMENTATION COMMENT.

### 2-BUSINESS-REQUIREMENTS.md

Record schema:

BUSINESS REQUIREMENT:
- BR ID
- REQUIREMENT STATEMENT
- PRIORITY
- TESTABLE CONDITION

### 3-SOFTWARE-ARCHITECTURE.md

Record schema:

ARCHITECTURE:
- ARCHITECTURE ID
- COMPONENTS AFFECTED
- TECHNOLOGY DECISIONS
- TRADEOFFS

### 4-TECHNICAL-DESIGN.md

Record schema:

TECH-DESIGN:
- DESIGN ID
- IMPLEMENTATION TASKS
- INTERFACES AND DATA CONTRACTS
- EDGE CASES AND ERROR HANDLING
- TEST NOTES

### 5-IMPLEMENTATION-RELEASE-NOTES.md

RELEASE-NOTES:
- Version ID
- Summary of features implemented.  

Runtime caveat contract:
1. Any use case with IMPLEMENTATION COMMENT in 1-BUSINESS-USE-CASES.md must be listed in a Runtime caveats and implementation constraints section in 5-IMPLEMENTATION-RELEASE-NOTES.md for the same run.

### 6-TEST-REPORT.md

Record schema:

TEST RESULT:
- TEST ID
- RELATED BR ID
- STATUS (PASS or FAIL)
- EVIDENCE
- DEFECT LINK OR NOTE

PIPELINE EXECUTION:
- TEST ID
- STATUS (PASS or FAIL)
- NOTES

## ID And Traceability Policy

1. Use fixed-width hierarchical IDs.
2. ID formats:
   - USE CASE ID: UC-XX
   - BUSINESS REQUIREMENT ID: UC-XX.BR-YY
   - ARCHITECTURE ID: UC-XX.BR-YY.ARCH-ZZ
   - DESIGN ID: UC-XX.BR-YY.ARCH-ZZ.DES-AA
3. Parent linkage is derived from identifier prefix; separate parent ID fields are optional and should be avoided unless needed for tooling.
4. IDs are immutable after publication.
5. If scope changes materially, add new IDs instead of renaming existing IDs.
6. Numbering starts at 01 within each parent scope.

Minimum traceability chain:
1. Every TEST RESULT.RELATED BR ID maps to an existing BR ID.
2. Every code change maps to at least one DESIGN ID.
3. Every DESIGN ID maps to an ARCHITECTURE ID prefix.
4. Every ARCHITECTURE ID maps to a BR ID prefix.
5. Every BR ID maps to a USE CASE ID prefix.

## Quality Gates

Global rules:
1. No stage starts until previous stage exit gate is PASS.
2. A stage output is invalid if required schema fields are missing.
3. A gate is FAIL if evidence is vague, untestable, or missing.
4. Verification can pass with runtime caveats only when explicitly called out in evidence and notes.
5. If any runtime caveat or implementation limitation is identified, it must be documented in both 1-BUSINESS-USE-CASES.md (per-use-case IMPLEMENTATION COMMENT) and 5-IMPLEMENTATION-RELEASE-NOTES.md (run-level caveat section).

Implementation quality bar (Stage 5):
1. No unresolved diagnostics in modified scope.
2. No dead references to missing design records.
3. Sensitive operations (clipboard, storage, messaging) must include failure handling and user-visible error path.

Verification quality bar (Stage 6):
1. All High-priority BR IDs have evidence.
2. Defects are recorded for every FAIL test.
3. Final recommendation is explicit: PASS PIPELINE or FAIL PIPELINE.

## Run Procedure

Standard flow:
0. Set working directory to PROJECTS/(APPLICATIONNAME).
1. Optionally update 0-PROPOSED-BUSINESS-USE-CASES.md for candidate ideas (advisory only).
2. Update 1-BUSINESS-USE-CASES.md.
3. Regenerate 2-BUSINESS-REQUIREMENTS.md.
4. Regenerate 3-SOFTWARE-ARCHITECTURE.md 
5. Regenerate 4-TECHNICAL-DESIGN.md.
6. Implement approved design in ./src and document in 5-IMPLEMENTATION-RELEASE-NOTES.md. Preserve historical information in this document and place the new parts at the top. 
7. Generate and append results in 6-TEST-REPORT.md.
8. If runtime caveats or non-implemented constraints exist, update per-use-case IMPLEMENTATION COMMENT fields in 1-BUSINESS-USE-CASES.md and mirror them in 5-IMPLEMENTATION-RELEASE-NOTES.md.
9. If implementation needs shared static assets, copy them from ./resources to app runtime resources (for example ./public/resources) and reference them with repository-relative web paths.

Completion criteria:
1. All stage gates PASS.
2. A new PIPELINE EXECUTION record is appended.
3. Any runtime caveats are explicitly listed in notes.

## Failure Handling Loop

If any gate fails:
1. Identify failed gate item and owning stage.
2. Return only to the owning stage.
3. Regenerate that stage output.
4. Re-run all downstream stages in order.
5. Append a new PIPELINE EXECUTION record.
6. Repeat until all gates PASS.

Ownership routing:
1. Use case quality issue: Stage 1.
2. Requirement quality issue: Stage 2.
3. Architecture quality issue: Stage 3.
4. Design quality issue: Stage 4.
5. Code or build quality issue: Stage 5.
6. Test quality or recommendation issue: Stage 6.

## Change Control Best Practices

1. Treat 1-BUSINESS-USE-CASES.md as the single source of intent.
2. Treat 0-PROPOSED-BUSINESS-USE-CASES.md as advisory input owned by the user.
3. Re-run full downstream chain after Stage 1 use case changes.
4. Keep generated artifacts deterministic and schema-stable.
5. Avoid manual edits to downstream docs that are not derived from inputs.
6. Prefer small, reviewable increments; one logical scope change per run.
7. Preserve historical test evidence by appending, not replacing, pipeline execution records.

## Definition Of Done

A pipeline run is Done only when:
1. Stages 1-6 all pass their exit gates.
2. Traceability chain is intact from UC to test evidence.
3. Source outputs exist in ./src for every in-scope DESIGN ID.
4. 6-TEST-REPORT.md contains a final PASS PIPELINE decision for the run.