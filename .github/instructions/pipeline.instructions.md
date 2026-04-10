---
applyTo: "PROJECTS/**"
---

# Software Development Pipeline

## Purpose

This pipeline converts business intent into verified software through strict stage gates, traceable artifacts, and controlled rework loops.

Goals:
1. End-to-end traceability from use case to test evidence.
2. Predictable quality gates before code promotion.
3. Fast, safe failure handling through targeted rollback to owning stage.

## Working Directory

Project location convention:
1. `PROJECTS/<APP>`
2. Example: `PROJECTS/BrowserBuddy`

Working rules:
1. Before running the pipeline, change into `PROJECTS/<APP>`.
2. Treat that directory as the active project root for pipeline work.
3. Keep generated paths repository-relative from that root, for example `./build` and `1-USE-CASES.md`.
4. Do not use machine-specific absolute paths in stage outputs.

## Scope

Applies to all product changes delivered through this repository, including:
1. Proposal updates in `1-USE-CASES-PROPOSED.md`.
2. Requirement updates.
3. Architecture and design changes.
4. All source code updates under `./build`.
5. Verification and release recommendation in `6-TEST-REPORT.md`.

Shared resource asset rule:
1. When a use case, requirement, architecture, design, or implementation needs an image or external static file, source it from `./resources` at repository root.
2. Do not pull runtime assets from machine-specific absolute paths.
3. For application runtime delivery, copy required files from `./resources` into the target app's served resources path, for example `./build/resources`.

## Foundational Rules

Core rules:
1. Only the owning stage edits its artifact.
2. Do not cross-edit pipeline artifacts.
3. If an upstream artifact is wrong, route work back to the stage that owns it.
4. Treat `1-USE-CASES.md` as the single source of approved intent.
5. Treat `1-USE-CASES-PROPOSED.md` as advisory input owned by the user.
6. Re-run the full downstream chain after Stage 1 changes.
7. Keep generated artifacts deterministic and schema-stable.
8. Preserve historical verification evidence by appending, not replacing, execution records.

The authoritative owner, artifact, ownership rule, and skill mapping live in the Pipeline Stages table below.

### Quality Gates

Global rules:
1. No stage starts until previous stage exit gate is PASS.
2. A stage output is invalid if required schema fields are missing.
3. A gate is FAIL if evidence is vague, untestable, or missing.
4. Verification can pass with runtime caveats only when explicitly called out in evidence and notes.
5. If any runtime caveat or implementation limitation is identified, it must be documented in `5-RELEASE-NOTES.md`.
6. Avoid manual edits to downstream artifacts that are not derived from their inputs.
7. Prefer small, reviewable increments with one logical scope change per run.

---

# Pipeline Stages

| Stage | Owner | Type | Artifact(s) | Purpose | Ownership Rule | Skill(s) |
|-------|-------|------|-------------|---------|----------------|----------|
| 0 | User, validated by BA | Person + Agent validation | `1-USE-CASES-PROPOSED.md` | Advisory proposed use cases | User-owned; BA may validate only | `.github/skills/use-case-authoring/SKILL.md` |
| 1 | Product Owner / User | Person | `1-USE-CASES.md` | Approved pipeline intent | User instruction required for changes | `.github/skills/use-case-authoring/SKILL.md` |
| 2 | Business Analyst | Agent | `2-REQUIREMENTS.md` | Atomic, testable requirements | Regenerate only after Stage 1 changes | `.github/skills/business-requirements-writing/SKILL.md` |
| 3 | Architect | Agent | `3-ARCHITECTURE-RECOMMENDATIONS.md`, `3-PARTS LIST.md` | Architecture and parts definition | Regenerate only after Stage 2 changes | `.github/skills/architecture-and-parts-authoring/SKILL.md` |
| 4 | Technical Lead | Agent | `4-DESIGN-INSTRUCTIONS.md` | Implementation-ready design | Regenerate only after Stage 3 changes | `.github/skills/design-instructions-authoring/SKILL.md` |
| 5 | Developer | Agent | `./build/**`, `5-RELEASE-NOTES.md` | Implementation and release notes | Keep code in `./build/**`; add a release-notes entry for each code change | `.github/skills/implementation-stage/SKILL.md`, `.github/skills/release-notes-writing/SKILL.md` |
| 6 | Tester | Agent | `6-TEST-REPORT.md`, `7-BUG-REPORT.md` | Verification and release recommendation | Append only; preserve prior runs and bug records | `.github/skills/test-report-writing/SKILL.md`, `.github/skills/bug-report-writing/SKILL.md` |
| Manager | Manager | Agent | No owned build artifact | Gate recovery and reruns | Route to the owning stage; do not cross-edit artifacts | `.github/skills/manager-pipeline-orchestration/SKILL.md` |

Read this file first, then load the skill listed for the current stage or artifact.

---

# Execution Model

## Standard Run Procedure

1. Set the working directory to `PROJECTS/<APP>`.
2. Confirm Stage 1 use cases are the approved source of intent. Stage 0 is advisory only.
3. Run stages 2–6 in order, loading the correct artifact skill for each stage.
4. Do not start a stage until the previous stage passes its exit gate.
5. If a stage fails, route back only to the owning stage, then re-run downstream stages in order.

## Completion Criteria

A pipeline run is **Done** only when:
1. Stages 1–6 all pass their exit gates.
2. The traceability chain is intact: UC → BR → AR → PT → DI → Code → Test Evidence.
3. Source code exists in `./build` for every in-scope DI entry.
4. `6-TEST-REPORT.md` contains a final **PASS PIPELINE** decision.

## Failure Handling Loop

If any gate fails, use `.github/skills/manager-pipeline-orchestration/SKILL.md`: return only to the owning stage, repair that stage, then re-run downstream stages in order until all gates PASS.
