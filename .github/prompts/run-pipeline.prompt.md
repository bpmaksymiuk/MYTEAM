---
description: Run the full 6-stage software factory pipeline for a project. Invokes all agents in order: Business Analyst → Architect → Technical Lead → Developer → Tester. Use when starting a new feature, updating requirements, or doing a full pipeline run from scratch.
---

# Run Full Pipeline

Run all 6 pipeline stages in order for the project: **${input:app:Project name (folder under PROJECTS/)}**

Work in `PROJECTS/${input:app}` as the repository root. Read `.github/SoftwareFactory.md` first — it is the source of truth for all stage rules, artifact schemas, and exit gates.

---

## Stage 2 — Business Analyst

`(Business Analyst)` Read `1-USE-CASES.md` in full. Generate or update `2-REQUIREMENTS.md` so every UC step maps to at least one atomic, testable BR record. Follow the BA processing rules in SoftwareFactory.md.

Exit gate: Every UC has at least one BR. Every BR has a testable condition. IDs are sequential and not reused.

---

## Stage 3 — Architect

`(Architect)` Read `2-REQUIREMENTS.md` in full. Generate or update `3-ARCHITECTURE-RECOMMENDATIONS.md` and `3-PARTS LIST.md` in the same run. Each BR maps to at least one AR. Each AR names a concrete library, API, or pattern with rationale.

Exit gate: All BRs traced to AR records. Parts list generated. IDs preserved from prior runs.

---

## Stage 4 — Technical Lead

`(Technical Lead)` Read `2-REQUIREMENTS.md`, `3-ARCHITECTURE-RECOMMENDATIONS.md`, and `3-PARTS LIST.md` in full. Generate or update `4-DESIGN-INSTRUCTIONS.md`. Each DI must be detailed enough for a Developer to implement without guesswork — include file names, code structure, and traps to avoid.

Exit gate: Every BR/AR pair has at least one DI. RELATED fields complete. No guesswork required for Developer.

---

## Stage 5 — Developer

`(Developer)` Read `4-DESIGN-INSTRUCTIONS.md` in full. Implement all instructions in `./build/`. Every changed file must trace to at least one DI ID. Add a new versioned entry (microversion increment) at the top of `5-RELEASE-NOTES.md`.

Exit gate: All DIs implemented. No unresolved diagnostics in changed scope. Release notes updated.

---

## Stage 6 — Tester

`(Tester)` Read `1-USE-CASES.md`, `2-REQUIREMENTS.md`, `5-RELEASE-NOTES.md`, and existing `6-TEST-REPORT.md`. Write a Playwright pipeline script (`<project>_test_pipeline<NNN>.mjs`) in the project folder. Run with `DISPLAY=:0`, `headless: false`. Fix all bugs found, re-run until 0 FAILs remain. Update `6-TEST-REPORT.md`, `7-BUG-REPORT.md`, and `5-RELEASE-NOTES.md`.

Exit gate: All UCs PASS or PARTIAL (external dependency only). results.json written. Final verdict: **PASS PIPELINE** or **FAIL PIPELINE**.
