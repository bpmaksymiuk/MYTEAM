# Graphic Assets — Cyrillic ↔ Glagolitic Converter

---

## GA-001 : Converter UI — Cyrillic to Glagolitic Mode

- **SUMMARY:** Production-quality SVG rendering of the main converter screen in Cyrillic → Glagolitic mode, showing the mode toggle, input/output panels with live sample text, action row, and clipboard toast.
- **FILE:** `./build/images/ga-001-converter-ui.svg`
- **FORMAT:** SVG, 900×540 px. Dark theme. Linear gradient background. Drop-shadow filter on panels for depth.
- **STYLE NOTES:** Background gradient #0d1117→#161b22. Active mode tab: #1f6feb fill, #388bfd border. Input panel: #58a6ff border with glow filter. Output panel: #3fb950 border with glow filter. Arrow: #388bfd bold. Toast: #238636 fill, #2ea043 border. Typography: 'Segoe UI', system-ui, sans-serif for UI; 'Consolas','Courier New',monospace for text content.
- **FLAVORS:**
  1. Light mode with parchment background — rejected (does not match the historic/technical aesthetic).
  2. Minimalist single-colour borders — considered as fallback.
  3. Dark theme with glow effects on active panels — **selected** (depth and polish without distraction).
- **SELECTED FLAVOR:** Dark theme with panel glow. Justification: matches the established dark-mode visual language from Stage 3 concepts; the glow effect signals activity without cluttering the layout.
- **TRACEABILITY:** DI-005, DI-006, DI-007.
- **RELATED:** CB-001, GA-002.

---

## GA-002 : Mapping Reference Table

- **SUMMARY:** Production-quality SVG rendering of the mapping reference table section, showing all visible columns, alternating row styling, scrollbar indicator, and back navigation.
- **FILE:** `./build/images/ga-002-mapping-table.svg`
- **FORMAT:** SVG, 700×500 px. Dark theme. Consistent with GA-001 colour palette.
- **STYLE NOTES:** Table header: #21262d background, #c9d1d9 uppercase text. Alternating rows: #161b22 / #0d1117. Glagolitic column tinted #3fb950. Character name columns in #8b949e at 0.8rem. Scrollbar indicator in #388bfd.
- **FLAVORS:**
  1. Full-width table with all 29 rows — impractical for SVG viewport; scrollbar indicator used instead.
  2. Card-grid layout for character pairs — rejected (harder to scan by name).
  3. Tabular layout with alternating rows and scrollbar — **selected**.
- **SELECTED FLAVOR:** Tabular layout. Justification: matches the mental model of a reference document; consistent with the concept storyboard (CB-002).
- **TRACEABILITY:** DI-004, DI-005.
- **RELATED:** CB-002, GA-001.
