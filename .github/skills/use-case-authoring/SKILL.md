# Use Case Authoring — SKILL.md

> Stage 0 (proposed use cases) and Stage 1 (approved use cases).

---

## When to Use

- **Stage 0:** When drafting proposed use cases from a goal, brief, or stakeholder input. Output goes to `1-USE-CASES-PROPOSED.md` only. Upstream input: the goal statement in `goal.md`.
- **Stage 1:** When promoting proposed use cases to the approved intent file. Output goes to `1-USE-CASES.md`. Upstream input: `1-USE-CASES-PROPOSED.md`.

---

## Target Files

| Stage | File |
|-------|------|
| 0 | `1-USE-CASES-PROPOSED.md` |
| 1 | `1-USE-CASES.md` |

---

## Record Schema

```
## UC-XXX : ACTOR — USE CASE NAME

- **GOAL:** One sentence describing the actor's objective.
- **STEPS:**
  1. Step one.
  2. Step two.
- **ACCEPTANCE CRITERIA:**
  - AC1: Observable, testable condition.
  - AC2: Observable, testable condition.
- **NOTES:** Any constraints, caveats, or out-of-scope clarifications.
- **RELATED:** IDs of related UCs or upstream goals.
```

**Rules:**
- UC IDs are sequential (UC-001, UC-002, …) and never reused.
- Actor names are role titles, not personal names.
- Each acceptance criterion must be independently observable and testable.
- Notes must distinguish between constraints (what it must do) and caveats (what it won't do).

---

## Procedure

1. Read `.github/instructions/pipeline.instructions.md`.

**Stage 0:**
2. Read `goal.md` or stakeholder brief in full.
3. Identify distinct user goals — each becomes one use case.
4. Write each UC in `1-USE-CASES-PROPOSED.md` following the record schema.
5. Add the file header: `> Stage 0 advisory. Does not trigger the pipeline until promoted to 1-USE-CASES.md.`
6. Run the Stage 0 exit gate.
7. **Stop. State `GATE 0: PASS` or `GATE 0: FAIL` before taking any further pipeline action.**

**Stage 1:**
7. Read `1-USE-CASES-PROPOSED.md` in full.
8. Review each UC for completeness: schema-compliant, acceptance criteria measurable, no vague steps.
9. Promote all approved UCs to `1-USE-CASES.md` verbatim or with minimal clarifying edits.
10. Add the approval header: `Approved: YYYY-MM-DD`
11. Run the Stage 1 exit gate.
12. **Stop. State `GATE 1: PASS` or `GATE 1: FAIL` before taking any further pipeline action.**

---

## Exit Gate

**Stage 0:**
- [ ] All UC records follow the schema (GOAL, STEPS, ACCEPTANCE CRITERIA, NOTES, RELATED).
- [ ] UC IDs are sequential starting from UC-001.
- [ ] Every acceptance criterion is independently testable.
- [ ] File contains the Stage 0 advisory header.
- [ ] `PIPELINE-STATUS.md` is updated for Stage 0 with STATUS and STATUS UPDATED date.

**Stage 1:**
- [ ] All UC records are schema-compliant.
- [ ] Approval date header is present: `Approved: YYYY-MM-DD`.
- [ ] No UC has vague or unmeasurable acceptance criteria.
- [ ] Every UC maps to at least one observable outcome.
- [ ] This file is now the single source of approved intent for all downstream stages.
- [ ] `PIPELINE-STATUS.md` is updated for Stage 1 with STATUS and STATUS UPDATED date.
