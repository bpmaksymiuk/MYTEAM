# Business Requirements Writing — SKILL.md

> Stage 4 — convert approved use cases into atomic, testable business requirements.

---

## When to Use

At Stage 4, after the concept storyboard is approved. Reads `1-USE-CASES.md` and produces `4-REQUIREMENTS.md`. Every requirement must be derivable from a use case — do not invent requirements without a UC source.

---

## Target Files

- `4-REQUIREMENTS.md`

---

## Record Schema

```
## BR-XXX : REQUIREMENT STATEMENT

The system shall <specific, measurable, atomic condition>.

- **TESTABLE CONDITION:** The specific observable outcome that proves this requirement is met.
- **NOTES:** Constraints, edge cases, or out-of-scope clarifications.
- **RELATED:** UC-IDs this BR derives from; BR-IDs of related requirements.
```

---

## Writing Standard

- Use **shall** language for requirements. "Should" and "may" indicate preferences, not requirements.
- Each BR must be **atomic** — one requirement per BR record. Do not combine two requirements with "and".
- No implementation details — a BR states what the system does, not how.
- Quantify wherever possible: "within 2 seconds" is better than "quickly".
- Testable condition must be independently verifiable without access to source code.

**Correct:** `The system shall display an error message when a required field is left empty.`  
**Incorrect:** `The system should handle errors and also validate inputs before submission.`

---

## Procedure

1. Read `.github/instructions/pipeline.instructions.md`.
2. Read `1-USE-CASES.md` in full.
3. For each UC, identify all behaviours implied by the acceptance criteria and steps.
4. Write one BR per distinct, atomic behaviour.
5. Assign sequential IDs (BR-001, BR-002, …).
6. For each BR, write the TESTABLE CONDITION before writing the requirement statement — this forces clarity.
7. Group BRs by UC in a `## BR-XXX` block for readability.
8. Validate against the exit gate.

---

## Exit Gate

- [ ] Every UC maps to at least one BR.
- [ ] Every BR uses shall language.
- [ ] Every BR is atomic (no compound requirements).
- [ ] Every BR has a TESTABLE CONDITION.
- [ ] No BR contains implementation details (no technology names, no code references).
- [ ] BR IDs are sequential and non-reused.
- [ ] RELATED fields reference valid UC-IDs.
