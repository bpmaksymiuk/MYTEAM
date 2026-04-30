# Content Writing — SKILL.md

> Stage 2 (narrative vision) and Stage 7 (text content, glossary, phrasebook).

---

## When to Use

- **Stage 2:** When writing the narrative vision document that establishes tone, themes, and world context for the product.
- **Stage 7:** When producing all application text content, a glossary, and a writing phrasebook from approved design instructions.

---

## Target Files

| Stage | File(s) |
|-------|---------|
| 2 | `2-NARRATIVE-VISION.md` |
| 7 | `7-TEXT-CONTENT.md`, `./build/text/**` |

---

## Record Schema (Stage 7 — TC Records)

```
## TC-XXX : CONTENT TITLE

- **SUMMARY:** One sentence describing the text content piece.
- **FILE:** Relative path in ./build/text/
- **CATEGORY:** `narrative` | `ui` | `utility` | `legal`
- **TONE NOTES:** Key tone and style guidance (formal/casual, active/passive, length constraints).
- **GLOSSARY REFERENCES:** GL-IDs used in this content piece.
- **TRACEABILITY:** DI-IDs that motivated this content piece.
```

---

## Procedure

1. Read `.github/instructions/pipeline.instructions.md`.

**Stage 2:**
2. Read `1-USE-CASES.md` in full.
3. Write `2-NARRATIVE-VISION.md` with four required sections:
   - `## OVERVIEW` — 2–3 paragraphs: what the product is, who it is for, what problem it solves.
   - `## COMPETITIVE & CREATIVE RESEARCH` — reference 3–5 comparable products or approaches; draw relevant lessons.
   - `## THEMES AND TONE` — identify 3–5 named themes; describe the desired voice and register.
   - `## WORLD-BUILDING / CONCEPTS` — name and describe the key concepts, metaphors, or mental models that should permeate the product.
4. Validate against Stage 2 exit gate.

**Stage 7:**
1. Read `6-DESIGN-INSTRUCTIONS.md` in full to identify all text-bearing DIs.
2. For each text-bearing DI, create a TC record in `7-TEXT-CONTENT.md`.
3. Write the corresponding text file at the path specified in the TC record.
4. Build a `## GLOSSARY` table in `7-TEXT-CONTENT.md` with columns: GL-ID | Term | Definition.
5. Build a `## PHRASEBOOK` table with columns: Category | Correct Phrasing | Incorrect Phrasing | Notes.
6. Validate against Stage 7 exit gate.

---

## Exit Gate

**Stage 2:**
- [ ] `2-NARRATIVE-VISION.md` contains all four required sections.
- [ ] OVERVIEW explains what the product does in plain language.
- [ ] COMPETITIVE & CREATIVE RESEARCH cites specific references.
- [ ] THEMES AND TONE names at least three distinct themes.
- [ ] WORLD-BUILDING / CONCEPTS identifies at least two key mental models.

**Stage 7:**
- [ ] `7-TEXT-CONTENT.md` contains a GLOSSARY table and a PHRASEBOOK table.
- [ ] Every text-bearing DI has a corresponding TC record.
- [ ] Every TC record has a FILE path that exists in `./build/text/`.
- [ ] Every TC record includes TRACEABILITY to at least one DI-ID.
- [ ] Glossary entries are consistent with phrasebook entries (no contradictions).
