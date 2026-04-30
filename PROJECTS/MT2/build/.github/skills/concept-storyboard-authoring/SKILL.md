# Concept Storyboard Authoring — SKILL.md

> Stage 3 — early visual concepts before requirements are locked.

---

## When to Use

At Stage 3, after the narrative vision is approved. Produces concept storyboard files that visualise the product's key screens, flows, and style direction. These are exploratory — they inform later stages but are not final assets. Final assets are produced at Stage 8.

---

## Target Files

- `3-CONCEPT-STORYBOARD.md`
- `./build/concept/**` (one SVG per CB record)

---

## Record Schema

```
## CB-XXX : STORYBOARD NAME

- **SUMMARY:** One sentence describing what this concept visualises.
- **FILE:** `./build/concept/<filename>.svg`
- **FORMAT:** SVG preferred. Labelled regions, minimal colour, clear structure.
- **SCREENS COVERED:** List of screens or views this concept illustrates.
- **STYLE NOTES:** Mood, palette direction, layout approach, interaction hints.
- **TRACEABILITY:** UC-IDs this concept maps to.
- **RELATED:** Other CB-IDs this concept builds on or contrasts with.
```

---

## Procedure

1. Read `.github/instructions/pipeline.instructions.md`.
2. Read `1-USE-CASES.md` and `2-NARRATIVE-VISION.md` in full.
3. Identify the major screens or flows each UC implies.
4. Group related screens into logical storyboard units — one CB record per major flow or view cluster.
5. For each CB:
   - Write the CB record in `3-CONCEPT-STORYBOARD.md`.
   - Create the SVG file at the path specified in the FILE field.
   - SVG format requirements:
     - Dark background (`#0d1117` or `#161b22`)
     - Labelled regions with clear bounding boxes
     - Include a title bar and screen annotations
     - Use muted colours for exploration; no production polish needed at this stage
6. Add an exit gate section to `3-CONCEPT-STORYBOARD.md`.
7. Validate against the exit gate.

---

## Exit Gate

- [ ] `3-CONCEPT-STORYBOARD.md` contains at least one CB record per major UC flow.
- [ ] Every CB record follows the schema (all fields present).
- [ ] Every CB FILE path exists and is a non-empty SVG.
- [ ] No CB file is a placeholder stub — each must contain meaningful visual structure.
- [ ] TRACEABILITY field references valid UC-IDs.
- [ ] SVG files are legible at standard screen resolution.
