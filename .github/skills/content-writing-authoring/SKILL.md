---
name: content-writing-authoring
description: 'Produce 2-NARRATIVE-VISION.md (Stage 2), 7-TEXT-CONTENT.md (Stage 7), and ./build/text/ outputs from approved upstream artifacts with DI-to-TC traceability.'
argument-hint: 'Describe the text scope, content category, and DI IDs to cover.'
---

# Content Writing Authoring

## When to Use
- Stage 2: create or update `2-NARRATIVE-VISION.md`.
- Stage 7: create or update `7-TEXT-CONTENT.md`.
- Produce text files in `./build/text/**`.
- Respond to Developer feedback on tone/content.

## Target Files
- `2-NARRATIVE-VISION.md`
- `7-TEXT-CONTENT.md`
- `./build/text/utility/**`
- `./build/text/narrative/**`
- `./build/text/ui/**`
- `./build/text/exploratory/**` (on-demand, non-DI work)

## Stage 2 Schema

```markdown
# Narrative / Thematic Vision
## OVERVIEW
## COMPETITIVE & CREATIVE RESEARCH
## THEMES AND TONE
## WORLD-BUILDING / CONCEPTS
---
```

## Stage 6 Required Sections

### GLOSSARY

```markdown
### GLOSSARY
| GL-ID | Term | Canonical Form | Definition | First Appears |
|-------|------|----------------|------------|---------------|
| GL-001 | [term] | [canonical form] | [definition] | DI-XXX |
```

### PHRASEBOOK

```markdown
### PHRASEBOOK
| Category | Tone | Voice | Avoid | Example |
|----------|------|-------|-------|---------|
| Utility | Direct | Second person | Jargon | "Purchase complete." |
```

## TC Record Schema

```markdown
## TC-XXX : TEXT ITEM NAME
- SUMMARY
- FILE
- CATEGORY
- TONE NOTES
- GLOSSARY REFERENCES
- VARIANTS (if applicable)
- SELECTED VARIANT
- TRACEABILITY
- RELATED
---
```

## Procedure (Stage 2)
1. Read pipeline instructions.
2. Read `1-USE-CASES.md`.
3. Research similar products or narratives.
4. Write `2-NARRATIVE-VISION.md` using the Stage 2 schema.

## Procedure (Stage 7)
1. Read pipeline instructions.
2. Read `6-DESIGN-INSTRUCTIONS.md` (and `2-NARRATIVE-VISION.md` if relevant).
3. Draft GLOSSARY and PHRASEBOOK in `7-TEXT-CONTENT.md`.
4. Get Developer approval before creating text files.
5. Create one TC record per text output.
6. For style-open narrative text, provide 2-3 variants and record selected variant.
7. Write final outputs under `./build/text/**`.
8. Keep TC records append-only with REVISION notes.

## Naming Convention
- Utility: `./build/text/utility/tc-{id}-{name}.md`
- Narrative: `./build/text/narrative/tc-{id}-{name}.md`
- UI: `./build/text/ui/tc-{id}-{name}.md`
- Exploratory: `./build/text/exploratory/tc-{id}-{name}.md`

## Quality Rules
- Every TC record must map to a real file.
- Use canonical glossary spellings.
- Do not create text for non-text DIs.
- Keep utility copy concise and unambiguous.
- Keep narrative copy consistent with approved lore and tone.

## Exit Gate
- GLOSSARY exists and is approved.
- PHRASEBOOK exists and is approved.
- Every text-bearing DI has a TC record.
- Every TC has a non-empty file at its canonical path.
- TRACEABILITY and GLOSSARY REFERENCES are valid.
- Variant decisions are recorded.

## Revision Note Format

```markdown
- REVISION [YYYY-MM-DD] — [what changed and why]
```
