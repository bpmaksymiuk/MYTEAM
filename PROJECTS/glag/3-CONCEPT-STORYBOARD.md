# Concept Storyboard — Cyrillic to Glagolitic Converter

---

## CB-001 : Main Converter Screen — Cyrillic → Glagolitic Mode

- **SUMMARY:** The primary converter interface with a mode toggle, Cyrillic input area, Glagolitic output area, clear button, and copy-to-clipboard button.
- **FILE:** `./build/concept/cb-001-main-converter.svg`
- **FORMAT:** SVG. Labelled bounding boxes, annotated controls, dark background (#0d1117), muted accent colours.
- **SCREENS COVERED:** Converter view (default/landing screen), mode toggle (active: Cyrillic→Glagolitic), clipboard confirmation toast.
- **STYLE NOTES:** Two-panel horizontal layout (input left, output right), separated by a directional arrow. Mode toggle bar above both panels with two tabs — active tab filled blue (#1f6feb), inactive tab muted grey. Blue (#58a6ff) for Cyrillic input panel, green (#3fb950) for Glagolitic output panel. Red (#f85149) for destructive clear action. Toast confirmation in green. Muted greys for disabled/empty state.
- **TRACEABILITY:** UC-001, UC-003, UC-004, UC-005.
- **RELATED:** CB-002 (mapping reference), CB-003 (reverse mode state).

---

## CB-002 : Character Mapping Reference Table

- **SUMMARY:** A read-only scrollable table showing all 31 Cyrillic-to-Glagolitic character pairs with both character names in English.
- **FILE:** `./build/concept/cb-002-mapping-reference.svg`
- **FORMAT:** SVG. Table structure with alternating row fill, header row, scrollbar indicator, annotation callouts, dark background (#0d1117).
- **SCREENS COVERED:** Reference/mapping view, navigation back to converter.
- **STYLE NOTES:** Four-column table: Cyrillic character | Cyrillic name | Glagolitic character | Glagolitic name. Alternating row backgrounds (#161b22 / #0d1117). Header in #21262d. Glagolitic output column tinted green (#3fb950). "Back to Converter" link in title bar. Ellipsis row indicates scroll depth.
- **TRACEABILITY:** UC-002.
- **RELATED:** CB-001.

---

## CB-003 : Main Converter Screen — Glagolitic → Cyrillic Mode

- **SUMMARY:** The converter interface in reverse mode, with Glagolitic input and Cyrillic output, showing the mode toggle in the opposite active state from CB-001.
- **FILE:** `./build/concept/cb-003-reverse-mode.svg`
- **FORMAT:** SVG. Same layout system as CB-001; panel colours swapped to reflect inverted direction.
- **SCREENS COVERED:** Converter view in reverse mode (Glagolitic→Cyrillic tab active), note on tab-switch clearing behaviour.
- **STYLE NOTES:** Mode toggle bar with Glagolitic→Cyrillic tab active (blue #1f6feb), Cyrillic→Glagolitic tab inactive. Green (#3fb950) for Glagolitic input panel, blue (#58a6ff) for Cyrillic output panel — colours follow the script, not the position. Annotation note documents tab-switch clearing behaviour (UC-005 AC5).
- **TRACEABILITY:** UC-005.
- **RELATED:** CB-001.

---

## Exit Gate Checklist

- [x] At least one CB record per major UC flow — CB-001 covers UC-001/UC-003/UC-004/UC-005; CB-002 covers UC-002; CB-003 covers UC-005 reverse mode.
- [x] Every CB record follows the schema (SUMMARY, FILE, FORMAT, SCREENS COVERED, STYLE NOTES, TRACEABILITY, RELATED).
- [x] Every CB FILE path exists and is a non-empty SVG.
- [x] No CB file is a placeholder stub — all three SVGs contain meaningful visual structure with labelled regions.
- [x] TRACEABILITY fields reference valid UC-IDs from `1-USE-CASES.md`.
- [x] SVG files are legible at standard screen resolution.
- [x] `PIPELINE-STATUS.md` updated for Stage 3.
