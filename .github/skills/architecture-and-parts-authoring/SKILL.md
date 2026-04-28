---
name: architecture-and-parts-authoring
description: 'Write 5-ARCHITECTURE-RECOMMENDATIONS.md and 5-PARTS LIST.md from 4-REQUIREMENTS.md. Use for Stage 5 architecture, concrete technology decisions, rationale, component inventories, and BR-to-AR-to-PT traceability.'
argument-hint: 'Describe the Stage 5 architecture or parts-list task.'
---

# Architecture And Parts Authoring

## When to Use
- Creating or updating PROJECTS/**/5-ARCHITECTURE-RECOMMENDATIONS.md
- Creating or updating PROJECTS/**/5-PARTS LIST.md
- Converting BRs into technology decisions and component boundaries

## Target Files
- 5-ARCHITECTURE-RECOMMENDATIONS.md
- 5-PARTS LIST.md

## Architecture Record Schema

```markdown
## AR-XXX : RECOMMENDATION
- RATIONALE
- NOTES
- RELATED
---
```

## Parts Record Schema

```markdown
## PT-XXX : PART/COMPONENT NAME
- DESCRIPTION
- TECHNOLOGY RECOMMENDATIONS
- NOTES
- RELATED
---
```

## Procedure
1. Read the canonical pipeline file first.
2. Read 4-REQUIREMENTS.md in full before writing.
3. Write one AR per distinct technology decision or pattern.
4. Name concrete libraries, APIs, frameworks, or patterns.
5. Explain rationale in terms of fit, tradeoffs, maintainability, and delivery constraints.
6. In the same run, generate the parts list that maps ARs onto logical components.
7. Preserve existing AR and PT IDs during incremental updates.

## Quality Rules
- Do not invent architecture decisions for nonexistent requirements.
- Every AR must point to at least one BR and one UC.
- Every PT must point to upstream UC, BR, and AR records.
- Each part should have a clear boundary and responsibility.

## Exit Gate
- Every BR maps to at least one AR.
- Every AR names a concrete technology or pattern.
- Every PT maps technology recommendations to named parts.
- AR and PT IDs are sequential and never reused.
