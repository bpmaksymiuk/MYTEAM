---
name: use-case-authoring
description: 'Write, revise, or validate 1-USE-CASES.md and 1-USE-CASES-PROPOSED.md. Use for Stage 0 proposed use cases, Stage 1 approved use cases, acceptance criteria quality, use-case schema validation, and implementation caveat wording.'
argument-hint: 'Describe whether you are drafting proposed use cases, updating approved use cases, or validating existing use cases.'
---

# Use Case Authoring

## When to Use
- Updating PROJECTS/**/1-USE-CASES.md
- Updating PROJECTS/**/1-USE-CASES-PROPOSED.md
- Validating Stage 0 or Stage 1 use-case schema
- Checking acceptance criteria quality before Stage 3
- Recording Stage 5 or Stage 6 implementation caveats for a use case

## Target Files
- 1-USE-CASES-PROPOSED.md
- 1-USE-CASES.md

## Record Schema

```markdown
## UC-XXX : ACTOR - USE CASE NAME
- STEPS
- ACCEPTANCE CRITERIA
- NOTES
- RELATED
---
```

## Procedure
1. Read the canonical pipeline file first.
2. Identify whether the task is Stage 0 advisory work or Stage 1 approved intent.
3. Ensure each use case is a complete, end-to-end workflow.
4. Write numbered, observable, testable steps.
5. Write numbered acceptance criteria that are measurable, independent, and user-visible.
6. Add NOTES only for relevant constraints, assumptions, or caveats.
7. Keep IDs sequential and never reuse IDs.

## Stage 0 Rules
- 1-USE-CASES-PROPOSED.md is advisory and does not trigger the pipeline.
- When validating Stage 0, update only the proposed use-case file.
- Do not regenerate downstream artifacts unless 1-USE-CASES.md is explicitly updated for a pipeline run.

## Stage 1 Rules
- 1-USE-CASES.md is the single source of pipeline intent.
- Updating it triggers the downstream pipeline.
- Minimize cross-dependencies between use cases.

## Implementation Caveat Handling
If a use case cannot be fully implemented due to an external constraint, add an IMPLEMENTATION COMMENT inside NOTES and mirror the same caveat in the project release notes file.

## Exit Gate
- Every use case has complete fields.
- Acceptance criteria are measurable and testable.
- IDs are sequential and never reused.
