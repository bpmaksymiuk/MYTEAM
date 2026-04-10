---
name: business-requirements-writing
description: 'Write or update 2-REQUIREMENTS.md from 1-USE-CASES.md. Use for Stage 2 business requirements, atomic BR statements, NASA-style shall language, testable conditions, and UC-to-BR traceability.'
argument-hint: 'Describe the use-case change or requirement-writing task.'
---

# Business Requirements Writing

## When to Use
- Creating or updating PROJECTS/**/2-REQUIREMENTS.md
- Converting approved use cases into atomic, testable BR records
- Auditing BR quality, traceability, or Stage 2 exit-gate coverage

## Target File
- 2-REQUIREMENTS.md

## Record Schema

```markdown
## BR-XXX : REQUIREMENT STATEMENT
- TESTABLE CONDITION
- NOTES
- RELATED
---
```

## Procedure
1. Read the canonical pipeline file first.
2. Read 1-USE-CASES.md in full before writing.
3. Generate at least one BR per use-case step; add more when a step is complex.
4. Keep every BR atomic and independent.
5. Write TESTABLE CONDITION as a concrete, observable verification target.
6. Use RELATED to point to the parent UC-XXX, or `(implied)` when appropriate.
7. Preserve existing BR IDs during incremental updates.

## Writing Standard
- Use clear, concise, unambiguous language.
- Prefer mandatory `shall` wording.
- Avoid implementation details.
- Quantify where possible.
- Do not combine multiple requirements in one BR.

## Exit Gate
- Every UC maps to at least one BR.
- Every BR has a testable condition.
- BR IDs are sequential and never reused.
- RELATED fields point to valid UC IDs.
