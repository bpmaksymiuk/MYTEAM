---
applyTo: "PROJECTS/**"
---

# Purpose

This pipeline instruction file governs the MT2 software factory. It exists to achieve three goals:

1. **Traceability** — every artifact traces back to an approved use case in `1-USE-CASES.md`.
2. **Predictable quality gates** — each stage has a defined exit gate that must PASS before the next stage starts.
3. **Safe recovery** — failures are routed back to the owning stage, corrected, and downstream stages re-run in order.

---

## Working Directory

- Convention: `PROJECTS/<APP>/`
- Change into the active project folder before running any pipeline stage.
- Treat the project folder as the active root; use relative paths from it.
- Never use machine-specific absolute paths in pipeline artifacts.

---

## Scope

This pipeline applies to all product work under `PROJECTS/<APP>/`:
- Use-case proposals and approvals
- Business requirements
- Architecture and parts decisions
- Design instructions
- Source code and build assets
- Test planning and verification evidence
- Audit records

---

## Foundational Rules

1. Only the owning stage's agent may write or edit that stage's artifact.
2. No agent may edit an artifact it does not own. Route errors upstream instead.
3. When an artifact at stage N has an error, return work to stage N — do not patch it from a later stage.
4. `1-USE-CASES.md` is the single source of approved intent. All downstream artifacts trace to it.
5. `1-USE-CASES-PROPOSED.md` is advisory only. It does not trigger the pipeline until content is promoted to `1-USE-CASES.md`.
6. After any change to `1-USE-CASES.md`, all downstream stages (2–10) must be re-run in order.
7. All generated artifacts must be deterministic and schema-stable across runs.
8. Historical evidence is append-only. Never delete or overwrite prior entries in release notes, test reports, audit reports, or bug reports.
9. Each stage must read and consume all required upstream artifacts before producing its own output.
10. The Auditor runs after every stage completes and documents any violations in `X-AUDIT-REPORT.md`.

---

# Pipeline Stages

| Stage | Owner | Type | Artifact(s) | Purpose | Ownership Rule | Skill(s) |
|-------|-------|------|-------------|---------|----------------|----------|
| 0 | User / BA | Advisory | `1-USE-CASES-PROPOSED.md` | Propose and validate use cases before approval | Only User/BA may write proposed use cases | `.github/skills/use-case-authoring/SKILL.md` |
| 1 | Product Owner / User | Approved Intent | `1-USE-CASES.md` | Approve use cases as the single source of intent | Only Product Owner may write the approved file | `.github/skills/use-case-authoring/SKILL.md` |
| 2 | Writer | Documentation | `2-NARRATIVE-VISION.md` | Establish tone, themes, and world context | Only Writer may edit the narrative vision | `.github/skills/content-writing-authoring/SKILL.md` |
| 3 | Graphic Artist | Documentation | `3-CONCEPT-STORYBOARD.md`, `./build/concept/**` | Produce early visual concepts and screen flows | Only Graphic Artist may write storyboard and concept assets | `.github/skills/concept-storyboard-authoring/SKILL.md` |
| 4 | Business Analyst | Documentation | `4-REQUIREMENTS.md` | Derive testable business requirements from use cases | Only Business Analyst may write requirements | `.github/skills/business-requirements-writing/SKILL.md` |
| 5 | Architect | Documentation | `5-ARCHITECTURE-RECOMMENDATIONS.md`, `5-PARTS LIST.md` | Make concrete technology and component decisions | Only Architect may write architecture and parts | `.github/skills/architecture-and-parts-authoring/SKILL.md` |
| 6 | Technical Lead | Documentation | `6-DESIGN-INSTRUCTIONS.md` | Write implementation-ready instructions for the Developer | Only Technical Lead may write design instructions | `.github/skills/design-instructions-authoring/SKILL.md` |
| 7 | Writer | Documentation | `7-TEXT-CONTENT.md`, `./build/text/**` | Produce all application text, glossary, and phrasebook | Only Writer may write text content | `.github/skills/content-writing-authoring/SKILL.md` |
| 8 | Graphic Artist | Documentation | `8-GRAPHIC-ASSETS.md`, `./build/images/**` | Produce final production-quality graphic assets | Only Graphic Artist may write final image assets | `.github/skills/graphic-artwork-authoring/SKILL.md` |
| 9 | Developer | Implementation | `./build/**`, `9-RELEASE-NOTES.md` | Implement all design instructions; write release notes | Only Developer may write or edit build files | `.github/skills/implementation-stage/SKILL.md`, `.github/skills/release-notes-writing/SKILL.md` |
| 10 | Tester | Verification | `10-TEST-CASES.md`, `10-TEST-REPORT.md`, `11-BUG-REPORT.md` | Write test cases, execute them, record evidence, issue recommendation | Only Tester may write test and bug artifacts | `.github/skills/test-case-authoring/SKILL.md`, `.github/skills/test-report-writing/SKILL.md`, `.github/skills/bug-report-writing/SKILL.md` |
| — | Manager | Cross-cutting | Session log | Gate failure detection, routing, and recovery | Does not own any stage artifact | `.github/skills/manager-pipeline-orchestration/SKILL.md` |
| — | Auditor | Cross-cutting | `X-AUDIT-REPORT.md` | Observe every stage for compliance violations | Writes only to X-AUDIT-REPORT.md | `.github/skills/auditor/SKILL.md` |

---

## Traceability ID Convention

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

**Rules:**
- IDs are sequential within each prefix and never reused.
- New IDs are always appended — never inserted or renumbered.
- RELATED fields must use valid IDs from this table only.

---

# Execution Model

## Standard Run Procedure

1. Set working directory to `PROJECTS/<APP>/`.
2. Confirm `1-USE-CASES.md` exists and is approved (contains an approval date header).
3. Run stages 2–9 in order, loading the correct skill from `.github/skills/` for each stage.
4. Complete each stage entirely — exit gate must PASS — before starting the next stage.
5. On any gate failure, route work back to the owning stage using the Manager skill, then re-run all downstream stages in order from the failed stage.

---

# Quality Gates

**Global rules that apply at every stage:**
- No stage may begin until the previous stage's exit gate is PASS.
- Artifacts with missing required schema fields are invalid and fail the gate.
- Vague or unverifiable evidence in test reports constitutes a FAIL.
- Any implementation caveat or known limitation must be documented in `9-RELEASE-NOTES.md` before the stage exit gate can PASS.
- Exit gates are checked checklists — every item must be explicitly confirmed, not assumed.
