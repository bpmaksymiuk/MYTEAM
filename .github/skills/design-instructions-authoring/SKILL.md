---
name: design-instructions-authoring
description: 'Write 4-DESIGN-INSTRUCTIONS.md from requirements and architecture. Use for Stage 4 technical design, implementation-ready DI records, file-by-file steps, function signatures, pseudocode, edge cases, and developer handoff quality.'
argument-hint: 'Describe the design-instructions task or implementation area.'
---

# Design Instructions Authoring

## When to Use
- Creating or updating PROJECTS/**/4-DESIGN-INSTRUCTIONS.md
- Turning Stage 2 and Stage 3 outputs into implementation-ready steps
- Auditing whether design guidance is detailed enough for Stage 5

## Target File
- 4-DESIGN-INSTRUCTIONS.md

## Record Schema

```markdown
## DI-XXX : INSTRUCTION
- SUMMARY
- IMPLEMENTATION STEPS
- SKILLSET REQUIRED
- NOTES
- RELATED
---
```

## Procedure
1. Read the canonical pipeline file first.
2. Read 2-REQUIREMENTS.md, 3-ARCHITECTURE-RECOMMENDATIONS.md, and 3-PARTS LIST.md in full.
3. Write one DI per distinct implementation task.
4. In SUMMARY, explain the problem, intended approach, and design choices.
5. In IMPLEMENTATION STEPS, include concrete file paths under ./build, APIs, pseudocode, pitfalls, and validation checks.
6. In SKILLSET REQUIRED, list explicit technical competencies.
7. Preserve existing DI IDs during incremental updates.

## Quality Rules
- Do not invent instructions for requirements or architecture that do not exist.
- The Developer should be able to implement without asking clarifying questions.
- Include setup or scaffolding DIs separately when needed.

## Exit Gate
- Every BR/AR pair has at least one DI.
- Every DI is actionable and detailed.
- RELATED fields point to valid UC, BR, and AR IDs.
