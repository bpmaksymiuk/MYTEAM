# Software Development Pipeline

## Purpose

This pipeline converts business intent into verified software through strict stage gates, traceable artifacts, and controlled rework loops.

Primary goals:
1. End-to-end traceability from use case to test evidence.
2. Predictable quality gates before code promotion.
3. Fast, safe failure handling through targeted rollback to owning stage.

## Scope

Applies to all product changes delivered through this repository, including:
1. Requirement updates.
2. Architecture and design changes.
3. Source code updates under ./src.
4. Verification and release recommendation in 6-TEST-REPORT.md.

## Roles And Ownership

| Actor | Type | Accountability |
|-------|------|----------------|
| Product Owner (PO) | Person | Defines and approves business intent in use cases |
| Business Analyst (BA) | Agent | Converts use cases into atomic, testable business requirements |
| Architect (A) | Agent | Produces architecture decisions and tradeoffs per requirement |
| Technical Lead (TL) | Agent | Produces implementation-ready technical design |
| Developer | Agent | Implements approved design in ./src with traceability |
| Tester | Agent | Verifies behavior, regressions, and release readiness |
| Pipeline Controller | Agent | Routes failures to owning stage and drives rerun to closure |

## Stage Model

| Stage | Owner | Required Input | Required Output | Exit Gate |
|------|-------|----------------|-----------------|-----------|
| 1. Business Use Cases | PO | Product idea, constraints | 1-BUSINESS-USE-CASES.md | Every use case has complete fields and measurable acceptance criteria |
| 2. Business Requirements | BA | 1-BUSINESS-USE-CASES.md | 2-BUSINESS-REQUIREMENTS.md | Every use case maps to >=1 BR ID; requirements are atomic and testable |
| 3. Software Architecture | A | 2-BUSINESS-REQUIREMENTS.md | 3-SOFTWARE-ARCHITECTURE.md | Every BR ID has >=1 ARCHITECTURE entry with explicit decisions and tradeoffs |
| 4. Technical Design | TL | 2-BUSINESS-REQUIREMENTS.md, 3-SOFTWARE-ARCHITECTURE.md | 4-TECHNICAL-DESIGN.md | Every BR ID has >=1 DESIGN entry with actionable tasks and explicit contracts |
| 5. Implementation | Developer | 4-TECHNICAL-DESIGN.md | ./src updates | Implemented changes are traceable to DESIGN IDs and quality checks pass |
| 6. Verification | Tester | Stages 1-5 artifacts and ./src | 6-TEST-REPORT.md | Critical BR coverage, evidence quality, defects captured, clear PASS or FAIL |

## Artifact Contracts

### 1-BUSINESS-USE-CASES.md

Record schema:

USE CASE:
- USE CASE ID
- GOAL
- ACTOR
- STEP BY STEP WALKTHROUGH
- ACCEPTANCE CRITERIA

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
1. Update 1-BUSINESS-USE-CASES.md.
2. Regenerate 2-BUSINESS-REQUIREMENTS.md.
3. Regenerate 3-SOFTWARE-ARCHITECTURE.md.
4. Regenerate 4-TECHNICAL-DESIGN.md.
5. Implement approved design in ./src.
6. Generate and append results in 6-TEST-REPORT.md.

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
2. Re-run full downstream chain after use case changes.
3. Keep generated artifacts deterministic and schema-stable.
4. Avoid manual edits to downstream docs that are not derived from inputs.
5. Prefer small, reviewable increments; one logical scope change per run.
6. Preserve historical test evidence by appending, not replacing, pipeline execution records.

## Definition Of Done

A pipeline run is Done only when:
1. Stages 1-6 all pass their exit gates.
2. Traceability chain is intact from UC to test evidence.
3. Source outputs exist in ./src for every in-scope DESIGN ID.
4. 6-TEST-REPORT.md contains a final PASS PIPELINE decision for the run.