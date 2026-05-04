# Design Instructions Authoring — SKILL.md

> Stage 6 — implementation-ready instructions that a Developer can execute without clarifying questions.

---

## When to Use

Invoke at Stage 6 (Technical Lead). Use it when converting architecture decisions into numbered, ordered, file-path-specific implementation instructions that the Developer can execute without ambiguity. Produces `6-DESIGN-INSTRUCTIONS.md`. Upstream inputs: `5-ARCHITECTURE-RECOMMENDATIONS.md`, `5-PARTS LIST.md`. Each DI must be complete enough for the Developer to act on immediately — partial or placeholder DIs are a gate violation.

---

## Target Files

- `6-DESIGN-INSTRUCTIONS.md`

---

## Record Schema

```
## DI-XXX : INSTRUCTION TITLE

- **SUMMARY:** One sentence stating what this DI produces or achieves.
- **IMPLEMENTATION STEPS:**
  1. Numbered, ordered steps.
  2. Each step is a single action.
  3. Include exact file paths, function signatures, data schemas, or pseudocode where needed.
  4. Name every edge case that must be handled.
- **SKILLSET REQUIRED:** Technologies or domain knowledge the Developer must have to implement this DI.
- **NOTES:** Constraints, known limitations, ordering dependencies, or references to related DIs.
- **RELATED:** BR-IDs, AR-IDs, PT-IDs that motivated this DI.
```

---

## Quality Standard

The Developer must be able to implement a DI without asking any clarifying questions. Test each DI by asking: "Could a competent Developer read this and produce the correct output on the first attempt?" If the answer is no, the DI is incomplete.

**Required specificity:**
- File paths must be complete and relative to the project root.
- Function signatures must include parameter names and types.
- Data schemas must list every required field.
- Pseudocode must be implementation-ready, not conceptual.
- Edge cases must be named and their handling specified.

---

## Procedure

1. Read `.github/instructions/pipeline.instructions.md`.
2. Read `4-REQUIREMENTS.md`, `5-ARCHITECTURE-RECOMMENDATIONS.md`, and `5-PARTS LIST.md` in full.
3. Identify all implementation work implied by the BR/AR/PT combinations.
4. Write one DI per logical unit of work (a file, a component, a behaviour, a configuration).
5. Order DIs by dependency: DIs that create directories or scaffolds come before DIs that write files.
6. Assign sequential IDs (DI-001, DI-002, …).
7. For each DI, write implementation steps before writing the summary — this ensures the summary is accurate.
8. Validate against the exit gate.
9. **Stop. State `GATE 6: PASS` or `GATE 6: FAIL` before taking any further pipeline action.**

---

## Exit Gate

- [ ] Every BR/AR pair has at least one DI.
- [ ] Every DI has all five schema sections (SUMMARY, IMPLEMENTATION STEPS, SKILLSET REQUIRED, NOTES, RELATED).
- [ ] No DI contains "TBD", placeholder text, or steps that defer work to the Developer's judgment.
- [ ] Every file path in implementation steps is complete and relative.
- [ ] DI IDs are sequential and non-reused.
- [ ] RELATED fields reference valid BR-IDs, AR-IDs, and PT-IDs.
- [ ] `PIPELINE-STATUS.md` is updated for Stage 6 with STATUS and STATUS UPDATED date.
