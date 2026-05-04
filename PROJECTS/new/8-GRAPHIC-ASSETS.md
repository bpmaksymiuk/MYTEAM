# Graphic Assets — X-Optimizer / ViralReword

- **STATUS:** PASS
- **STATUS UPDATED:** 2026-05-04
- **AUTHOR:** Graphic Artist
- **SOURCE:** `6-DESIGN-INSTRUCTIONS.md`, `./build/concept/`

---

## GA-001 : WORKSPACE LAYOUT — PRODUCTION REFERENCE

- **SUMMARY:** Production-quality annotated layout diagram of the full Workspace page showing header, input column, tile grid, and panel overlay positions.
- **FILE:** `./build/images/ga-001-workspace-layout.svg`
- **FORMAT:** SVG, 1200×700px.
- **STYLE NOTES:** Signal & Noise dark theme. `#0d0f12` background. `#00e5a0` accent. Labels in monospace. Bounding box annotations with dashed borders. Arrows with arrowhead markers indicating data flow direction.
- **FLAVORS:** (A) Annotated wireframe with callout labels; (B) Filled UI mockup with representative content.
- **SELECTED FLAVOR:** A — annotated wireframe. Provides clearer component boundary guidance for Developer implementation.
- **TRACEABILITY:** DI-019, DI-025.
- **RELATED:** CB-001.

---

## GA-002 : REWRITE TILE STATES — PRODUCTION REFERENCE

- **SUMMARY:** Production-quality diagram showing all four rewrite tile states: standard, fidelity-warning, advisory guardrail, and blocked.
- **FILE:** `./build/images/ga-002-tile-states.svg`
- **FORMAT:** SVG, 1000×480px.
- **STYLE NOTES:** Four tiles side-by-side. Each tile has labelled state indicator, colour-coded fidelity badge, and annotation area. Copy button shown in active and disabled states.
- **FLAVORS:** (A) All four states in a single row; (B) Before/after pairs showing state transitions.
- **SELECTED FLAVOR:** A — single row. Developer can compare states at a glance.
- **TRACEABILITY:** DI-018.
- **RELATED:** CB-003.

---

## GA-003 : STRATEGY CHIP BAR STATES — PRODUCTION REFERENCE

- **SUMMARY:** Production diagram of strategy chip bar showing all active, mixed, and locked (one-remaining) states with the minimum-active warning inline element.
- **FILE:** `./build/images/ga-003-chip-bar-states.svg`
- **FORMAT:** SVG, 900×280px.
- **STYLE NOTES:** Three rows: all 5 active, 3 of 5 active, 1 remaining (locked). Locked chip shown with padlock indicator. Warning text inline below bar.
- **FLAVORS:** N/A — single clear direction.
- **SELECTED FLAVOR:** N/A.
- **TRACEABILITY:** DI-016.
- **RELATED:** CB-002.

---

## GA-004 : TIER STATUS AND UPGRADE FLOW — PRODUCTION REFERENCE

- **SUMMARY:** Production diagram showing the tier indicator in header, the daily limit banner, and the upgrade modal layout.
- **FILE:** `./build/images/ga-004-tier-upgrade-flow.svg`
- **FORMAT:** SVG, 900×420px.
- **STYLE NOTES:** Three vertical sections: (1) header tier indicator Free/Pro states, (2) limit banner with CTA, (3) upgrade modal with Free vs Pro comparison columns.
- **FLAVORS:** (A) Flat layout in rows; (B) Sequential flow with arrows.
- **SELECTED FLAVOR:** A — flat layout. Easier to measure pixel dimensions from.
- **TRACEABILITY:** DI-020.
- **RELATED:** CB-007.

---

## GA-005 : THREAD COMPOSER LAYOUT — PRODUCTION REFERENCE

- **SUMMARY:** Production diagram of the Thread Composer view showing segment list with numbering, drag handles, per-segment regenerate buttons, and Copy All sticky action.
- **FILE:** `./build/images/ga-005-thread-composer.svg`
- **FORMAT:** SVG, 900×500px.
- **STYLE NOTES:** Hook tweet at top with amber accent. 4 subsequent segments numbered. Drag handle icon on left edge of each card. Regenerate button on right. Sticky footer with Copy All.
- **FLAVORS:** N/A — single clear direction inherited from CB-004.
- **SELECTED FLAVOR:** N/A.
- **TRACEABILITY:** DI-023.
- **RELATED:** CB-004.
