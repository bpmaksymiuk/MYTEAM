---
name: graphic-artwork-authoring
description: 'Produce 8-GRAPHIC-ASSETS.md and final image assets in ./build/images/ from 6-DESIGN-INSTRUCTIONS.md at Stage 8. Concept storyboards in ./build/concept/ are produced at Stage 3 using the concept-storyboard-authoring skill.'
argument-hint: 'Describe the artwork scope, style direction, and DI IDs to cover.'
---

# Graphic Artwork Authoring

## When to Use
- Create or update `8-GRAPHIC-ASSETS.md`.
- Produce concept files in `./build/concept/`.
- Produce final assets in `./build/images/`.
- Provide style variants and process Developer feedback.

## Target Files
- `8-GRAPHIC-ASSETS.md`
- `./build/images/**`
- `./build/images/flavors/**`

## Required Phases
1. Concept phase: create storyboard/wireframe files and get approval.
2. Asset phase: produce image files required by DIs.
3. Iteration phase: revise style/technical specs on request.

## GA Record Schema

```markdown
## GA-XXX : ASSET NAME
- SUMMARY
- FILE
- FORMAT
- STYLE NOTES
- FLAVORS (if applicable)
- SELECTED FLAVOR
- TRACEABILITY
- RELATED
---
```

## Procedure
1. Read pipeline instructions.
2. Read `6-DESIGN-INSTRUCTIONS.md` and list image-bearing DIs.
3. Read `3-CONCEPT-STORYBOARD.md` and approved concept files from `./build/concept/` for visual direction.
4. Create one GA record per asset in `8-GRAPHIC-ASSETS.md`.
5. For style-open assets, create 2-3 flavors in `./build/images/flavors/`.
6. Promote selected files to canonical paths in `./build/images/`.
7. Keep records append-only with REVISION notes.

## Naming Convention
- Final: `ga-{id}-{name}.{ext}`
- Flavor: `ga-{id}-{name}-flavor-{a|b|c}.{ext}`
- Concept: `concept-{screen-name}.svg`

## Quality Rules
- Every GA record must map to a real file.
- Concept files must exist before final asset production.
- Artwork must follow DI style direction.
- Remove unselected flavor files after selection.
- Do not create assets for non-image DIs.

## Exit Gate
- `./build/images/` has approved final assets for all image-bearing DIs.
- `8-GRAPHIC-ASSETS.md` has one GA record per image-bearing DI.
- Every GA FILE path exists and is non-empty.
- TRACEABILITY fields reference valid DI IDs.
- Flavor selection is resolved and recorded.

## Revision Note Format

```markdown
- REVISION [YYYY-MM-DD] — [what changed] — [style/technical reason]
```
