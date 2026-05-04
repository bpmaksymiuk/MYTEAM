# Architecture and Parts Authoring — SKILL.md

> Stage 5 — concrete technology decisions and component inventory from business requirements.

---

## When to Use

Invoke at Stage 5 (Architect). Use it when making technology decisions and building the parts inventory that translates requirements into a concrete technical structure. Every AR must be justified by explicit rationale and at least one named alternative. Produces `5-ARCHITECTURE-RECOMMENDATIONS.md` and `5-PARTS LIST.md`. Upstream input: `4-REQUIREMENTS.md`. Technology choices made here cascade into all downstream stages.

---

## Target Files

- `5-ARCHITECTURE-RECOMMENDATIONS.md`
- `5-PARTS LIST.md`

---

## AR Record Schema

```
## AR-XXX : RECOMMENDATION TITLE

- **DECISION:** The specific technology, pattern, or approach selected.
- **RATIONALE:** Why this decision was made over alternatives. Name at least one alternative considered.
- **NOTES:** Known limitations, version constraints, or configuration requirements.
- **RELATED:** BR-IDs this AR satisfies; PT-IDs that implement this AR.
```

## PT Record Schema

```
## PT-XXX : PART NAME

- **DESCRIPTION:** What this part does in the system.
- **TECHNOLOGY RECOMMENDATIONS:** Specific library, format, tool, or pattern. Not a category — a named choice.
- **NOTES:** File naming conventions, size constraints, runtime behaviour, or integration requirements.
- **RELATED:** AR-IDs this PT implements; BR-IDs it satisfies.
```

---

## Procedure

1. Read `.github/instructions/pipeline.instructions.md`.
2. Read `4-REQUIREMENTS.md` in full.
3. Group related BRs by concern (data, UI, security, integration, etc.).
4. For each concern group, make one or more technology decisions and write an AR record.
5. For each AR, identify the concrete components (files, libraries, config) and write PT records.
6. Assign sequential IDs within each series (AR-001, AR-002, …; PT-001, PT-002, …).
7. Validate against the exit gate.
8. **Stop. State `GATE 5: PASS` or `GATE 5: FAIL` before taking any further pipeline action.**

---

## Exit Gate

- [ ] Every BR maps to at least one AR.
- [ ] Every AR names a specific, concrete technology — no generic categories.
- [ ] Every AR includes at least one alternative considered in RATIONALE.
- [ ] Every PT has a TECHNOLOGY RECOMMENDATIONS field that names a specific choice.
- [ ] AR IDs are sequential and non-reused.
- [ ] PT IDs are sequential and non-reused.
- [ ] RELATED fields trace AR↔BR and PT↔AR correctly.
- [ ] `PIPELINE-STATUS.md` is updated for Stage 5 with STATUS and STATUS UPDATED date.
