# Graphic Artwork Authoring — SKILL.md

> Stage 8 — production-quality final graphic assets from approved design instructions.

---

## When to Use

Invoke at Stage 8 (Graphic Artist). Use it when producing formal handoff SVG diagrams that document the interface between pipeline stages for the Developer's reference, showing stage interfaces, ownership boundaries, and gate markers. Produces `8-GRAPHIC-ASSETS.md` and SVG files under `build/images/`. Upstream input: `6-DESIGN-INSTRUCTIONS.md`. These are deliverable assets — not concept sketches. Concept work from Stage 3 is kept in `./build/concept/` and must not be overwritten.

---

## Target Files

- `8-GRAPHIC-ASSETS.md`
- `./build/images/**` (one file per GA record)

---

## Record Schema

```
## GA-XXX : ASSET TITLE

- **SUMMARY:** One sentence describing what this asset illustrates or communicates.
- **FILE:** `./build/images/<filename>.svg` (or .png)
- **FORMAT:** SVG preferred for diagrams; PNG for raster artwork. Specify dimensions.
- **STYLE NOTES:** Colour palette, typography, layout approach, and any conventions inherited from Stage 3 concepts.
- **FLAVORS:** List 2–3 candidate design directions if multiple were considered. State which was selected.
- **SELECTED FLAVOR:** The chosen direction and brief justification.
- **TRACEABILITY:** DI-IDs that required this asset.
- **RELATED:** CB-IDs (Stage 3 concepts) this asset evolved from; other GA-IDs in the same family.
```

---

## Visual Style Standards

For dark-theme pipeline documentation assets:
- **Background:** `#0d1117` (deep) / `#161b22` (surface)
- **Body text:** `#e6edf3` (primary) / `#c9d1d9` (secondary)
- **Muted text / borders:** `#8b949e` / `#21262d` / `#3d444d`
- **Role colours:**
  - User / Analyst / Tech Lead: `#1f6feb` (border) / `#79c0ff` (text)
  - Writer / Tester: `#2ea043` (border) / `#3fb950` (text)
  - Graphic Artist / Manager: `#9e6a03` (border) / `#d29922` (text)
  - Architect / Developer: `#b91c1c` (border) / `#f78166` (text)
- **Typography:** `'Segoe UI', system-ui, sans-serif`
- **Corners:** `rx="8"` for large boxes, `rx="6"` for small boxes

---

## Procedure

1. Read `.github/instructions/pipeline.instructions.md`.
2. Read `6-DESIGN-INSTRUCTIONS.md` and identify all image-bearing DIs.
3. Review the corresponding Stage 3 concept files in `./build/concept/` for visual direction.
4. For each image-bearing DI, write a GA record in `8-GRAPHIC-ASSETS.md`.
5. Create the SVG (or PNG) file at the path specified in the FILE field.
6. Apply production-quality polish: gradients, filters where appropriate, consistent role colours, clean typography, proper viewport dimensions.
7. Validate each file is non-empty and renders correctly at standard screen resolution.
8. Run the exit gate checklist.
9. **Stop. State `GATE 8: PASS` or `GATE 8: FAIL` before taking any further pipeline action.**

---

## Exit Gate

- [ ] `./build/images/` contains final approved assets for all image-bearing DIs.
- [ ] `8-GRAPHIC-ASSETS.md` has one GA record per image-bearing DI.
- [ ] Every GA FILE path exists and is a non-empty SVG or PNG.
- [ ] TRACEABILITY fields reference valid DI-IDs.
- [ ] FLAVORS and SELECTED FLAVOR fields are completed (or marked N/A with justification).
- [ ] Stage 3 concept files in `./build/concept/` are unmodified.
- [ ] All assets follow the visual style standards for colour, typography, and layout.
- [ ] `PIPELINE-STATUS.md` is updated for Stage 8 with STATUS and STATUS UPDATED date.
