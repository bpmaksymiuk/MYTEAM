---
name: concept-storyboard-authoring
description: 'Produce 3-CONCEPT-STORYBOARD.md and ./build/concept/** storyboard files from 2-NARRATIVE-VISION.md and 1-USE-CASES.md. Use for Stage 3 early visual concept work, screen-by-screen storyboarding, and style direction before requirements are written.'
argument-hint: 'Describe the concept scope, visual style direction, and UC IDs to cover.'
---

# Concept Storyboard Authoring

## When to Use
- Creating or updating `3-CONCEPT-STORYBOARD.md`.
- Producing concept storyboard files in `./build/concept/` at Stage 3.
- Establishing visual direction and screen layout before requirements are written.
- Giving the Business Analyst, Architect, and Technical Lead a visual reference.

## Target Files
- `3-CONCEPT-STORYBOARD.md`
- `./build/concept/**`

## CB Record Schema

```markdown
## CB-XXX : CONCEPT NAME
- SUMMARY
- FILE
- FORMAT
- SCREENS COVERED
- STYLE NOTES
- TRACEABILITY
- RELATED
---
```

## Procedure
1. Read pipeline instructions.
2. Read `2-NARRATIVE-VISION.md` in full for tone, themes, and creative direction.
3. Read `1-USE-CASES.md` for the list of screens and user flows to visualise.
4. Produce one concept file per major screen or user flow in `./build/concept/`.
5. Use SVG format for all concept files unless a raster format is explicitly required.
6. Annotate each storyboard file with labelled regions (e.g. title bar, toolbar, editor, status bar) and interaction notes.
7. Create one CB record per concept file in `3-CONCEPT-STORYBOARD.md`.
8. Keep storyboards illustrative — do not produce pixel-perfect finalised artwork at this stage; that belongs to Stage 8.

## Naming Convention
- Concept files: `concept-{screen-name}.svg`
- Record IDs: `CB-001`, `CB-002`, ...

## Quality Rules
- Every CB record must map to a real, non-empty file in `./build/concept/`.
- Concept files must cover all major screens identified in `1-USE-CASES.md`.
- Storyboards must be legible at a glance; include visible labels.
- Do not produce final production image assets at this stage.
- TRACEABILITY fields must reference valid UC IDs from `1-USE-CASES.md`.

## Exit Gate
- `3-CONCEPT-STORYBOARD.md` exists with one CB record per major screen.
- Every CB FILE path exists in `./build/concept/` and is non-empty.
- All major UC screens are represented in at least one concept file.
- TRACEABILITY fields reference valid UC IDs.
- No stubs or placeholder records remain.
