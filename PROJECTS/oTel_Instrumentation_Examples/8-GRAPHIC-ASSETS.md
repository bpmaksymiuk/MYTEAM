# 8 — GRAPHIC ASSETS

- **STATUS:** PASS
- **STATUS UPDATED:** 2026-05-03
- **AUTHOR:** Graphic Artist
- **STAGE:** 8 (Final Graphic Assets)
- **UPSTREAM:** `6-DESIGN-INSTRUCTIONS.md` (v2.0), `3-CONCEPT-STORYBOARD.md` (visual reference only — concepts not modified)

> Stage 8 v2.0 (amendments A2 + A3): Palette unchanged. Language sigils (GA-004–GA-007) are now also used as tab icons in the language tab component. Topic hub tile grid on the home page is text-only in v1 (no per-topic SVG icons required). GA-001 product wordmark updated to reflect new product name. BUG-002 (Java sigil cyan) remains deferred.

> No emoji in any asset. No Dynatrace logo (license).

---

## GA-001 : Site Logo Wordmark

- **SUMMARY:** Site logo wordmark used in the topbar and the OG card lockup.
- **FILE:** `./build/images/logo-wordmark.svg`
- **FORMAT:** SVG, viewBox 320×64.
- **STYLE NOTES:** Mono font (`ui-monospace, JetBrains Mono`). The OTel-orange dot sits between `otel` and `cookbook` per the brief. Background filled `#0d1117` so the asset reads correctly when used in isolation.
- **FLAVORS:** (1) wordmark with orange dot separator; (2) wordmark with orange underline; (3) all-orange wordmark.
- **SELECTED FLAVOR:** (1) — the dot reads as a console prompt and reuses the OTel orange without overwhelming the chrome.
- **TRACEABILITY:** DI-003 (topbar logo span).
- **RELATED:** CB-002 (Console-First home), GA-002, GA-003.

## GA-002 : Favicon

- **SUMMARY:** Square favicon — single rounded tile with monogram `o` and the OTel-orange dot.
- **FILE:** `./build/images/favicon.svg`
- **FORMAT:** SVG, viewBox 64×64. Browsers will rasterise to 16/32/180.
- **STYLE NOTES:** Surface tile on bg, 1px subtle border. Monogram is a single character so it remains legible at 16×16.
- **FLAVORS:** (1) `o` monogram with dot; (2) full wordmark scaled down.
- **SELECTED FLAVOR:** (1) — the wordmark is unreadable below 32px.
- **TRACEABILITY:** DI-003 (head icons).
- **RELATED:** GA-001.

## GA-003 : Open Graph Card

- **SUMMARY:** 1200×630 OG image rendering the home-page hero line with the four language tiles below.
- **FILE:** `./build/images/og-card.svg`
- **FORMAT:** SVG, viewBox 1200×630. Convertible to PNG at build time if needed.
- **STYLE NOTES:** Vertical bg gradient `#0d1117 → #161b22`. Wordmark top-left, hero text in two display-size lines, single-sentence subtitle in muted ink, four language tiles along the bottom each with an ok-green border to signal "verified".
- **FLAVORS:** (1) hero text + four tiles; (2) hero text only; (3) split panel (hero left, code preview right).
- **SELECTED FLAVOR:** (1) — communicates the four-language scope at a glance, which is the home-page differentiator.
- **TRACEABILITY:** DI-003 (head meta), DI-015 (home page).
- **RELATED:** GA-001.

## GA-004 : Language Sigil — JavaScript

- **SUMMARY:** Square sigil tile for JavaScript used in the nav-index and language tiles.
- **FILE:** `./build/images/sigil-javascript.svg`
- **FORMAT:** SVG, viewBox 32×32.
- **STYLE NOTES:** Surface tile, mono `js` glyph in OTel orange. Family is consistent across the four sigils — same tile, same type, swap colour and label only.
- **FLAVORS:** N/A — derived as one set of four (GA-004 through GA-007).
- **SELECTED FLAVOR:** N/A.
- **TRACEABILITY:** DI-005 (nav-index), DI-016 (language hub), DI-015 (home tiles).
- **RELATED:** GA-005, GA-006, GA-007.

## GA-005 : Language Sigil — Python

- **SUMMARY:** Square sigil tile for Python.
- **FILE:** `./build/images/sigil-python.svg`
- **FORMAT:** SVG, viewBox 32×32.
- **STYLE NOTES:** Same tile family. Glyph `py` rendered in lavender `#9990d9` to differentiate from the OTel orange used by JavaScript.
- **FLAVORS:** N/A.
- **SELECTED FLAVOR:** N/A.
- **TRACEABILITY:** DI-005, DI-016.
- **RELATED:** GA-004, GA-006, GA-007.

## GA-006 : Language Sigil — .NET

- **SUMMARY:** Sigil tile for .NET.
- **FILE:** `./build/images/sigil-dotnet.svg`
- **FORMAT:** SVG, viewBox 40×32 (label is four characters).
- **STYLE NOTES:** Glyph `.net` rendered in ok-green `#37b26b`.
- **FLAVORS:** N/A.
- **SELECTED FLAVOR:** N/A.
- **TRACEABILITY:** DI-005, DI-016.
- **RELATED:** GA-004, GA-005, GA-007.

## GA-007 : Language Sigil — Java

- **SUMMARY:** Sigil tile for Java.
- **FILE:** `./build/images/sigil-java.svg`
- **FORMAT:** SVG, viewBox 40×32.
- **STYLE NOTES:** Glyph `java` rendered in Dynatrace cyan `#1496ff` — note this is the only non-Dynatrace surface that borrows the cyan; chosen because Java's documentation traditionally uses a cool blue and no Dynatrace-card collision exists in the nav-index. If a future audit objects, swap to a neutral ink colour.
- **FLAVORS:** (1) cyan; (2) neutral ink.
- **SELECTED FLAVOR:** (1) — see style note. Marked for re-review at Stage 10 if the Tester flags neutrality concerns.
- **TRACEABILITY:** DI-005, DI-016.
- **RELATED:** GA-004, GA-005, GA-006.

## GA-008 : Configuration Gear Icon

- **SUMMARY:** Gear icon for the topbar `cfg` button.
- **FILE:** `./build/images/icon-cfg-gear.svg`
- **FORMAT:** SVG, viewBox 24×24, `stroke="currentColor"` so it inherits the button colour and hovers to OTel orange via CSS.
- **STYLE NOTES:** Standard 8-tooth gear. Stroke 1.6px to match the topbar typography weight. No fill.
- **FLAVORS:** (1) classic gear; (2) the literal word "cfg" in mono. The wordmark already uses mono `cfg` text per DI-003 — this icon is the optional adornment if the topbar gains room.
- **SELECTED FLAVOR:** (1) — provided as an optional decoration; the text-only `cfg` button per DI-003 is canonical.
- **TRACEABILITY:** DI-003 (topbar), DI-006 (modal trigger).
- **RELATED:** GA-001.

## GA-009 : Pitfall Glyph

- **SUMMARY:** Triangle-with-bang glyph used in the pitfall callout header.
- **FILE:** `./build/images/glyph-pitfall.svg`
- **FORMAT:** SVG, viewBox 24×24, `stroke="currentColor"`.
- **STYLE NOTES:** Inherits the callout's `--pitfall-fg` (`#b6452c`). Stroke-only design keeps the glyph quiet next to the title text.
- **FLAVORS:** (1) triangle with bang; (2) hazard sign with diagonal hatching. (1) matches the engineer-notebook tone better than the busier hatched variant.
- **SELECTED FLAVOR:** (1).
- **TRACEABILITY:** DI-008 (`pitfall` shortcode).
- **RELATED:** GA-010, GA-011.

## GA-010 : Caveat Glyph

- **SUMMARY:** Circled-bang glyph used in the caveat callout header (also reused by the staleness callout).
- **FILE:** `./build/images/glyph-caveat.svg`
- **FORMAT:** SVG, viewBox 24×24, `stroke="currentColor"`.
- **STYLE NOTES:** Inherits the callout's `--caveat` (`#e0a030`). Visually distinct from the pitfall triangle so the two callout severities are not confused.
- **FLAVORS:** (1) circled bang; (2) lowercase `i` in a circle (info). Caveat carries more weight than info, so the bang variant is preferred.
- **SELECTED FLAVOR:** (1).
- **TRACEABILITY:** DI-008 (`caveat` and `staleness` shortcodes).
- **RELATED:** GA-009.

## GA-011 : Verified Badge Glyph

- **SUMMARY:** Shield-with-tick glyph used in the verification badge.
- **FILE:** `./build/images/glyph-verified.svg`
- **FORMAT:** SVG, viewBox 24×24, `stroke="currentColor"`.
- **STYLE NOTES:** Inherits the badge's `--ok` (`#37b26b`). Shield silhouette is more legible than a bare check at the badge's small render size.
- **FLAVORS:** (1) shield + tick; (2) bare tick in a circle. Shield reads as "verified by us" rather than "task complete".
- **SELECTED FLAVOR:** (1).
- **TRACEABILITY:** DI-004 (recipe layout), DI-008 (`verified` shortcode).
- **RELATED:** GA-009, GA-010.

---

## Coverage (Image-bearing DIs → GA)

| DI | Asset(s) |
|---|---|
| DI-003 (base layout chrome) | GA-001, GA-002, GA-003, GA-008 |
| DI-004 (topic layout) | GA-011 |
| DI-005 (nav-index) | (text-only, no SVG) |
| DI-006 (cfg modal) | GA-008 |
| DI-008 (shortcodes) | GA-009, GA-010, GA-011 |
| DI-016 (tabs.mjs / tab buttons) | GA-004, GA-005, GA-006, GA-007 (as tab icons, optional) |
| DI-017 (home page) | GA-003 (OG card) |

Every image-bearing DI maps to at least one GA.

---

## Exit Gate

- [x] `./build/images/` contains final approved assets for every image-bearing DI.
- [x] `8-GRAPHIC-ASSETS.md` has one GA record per asset with all required fields.
- [x] Every GA FILE path exists and is a non-empty SVG.
- [x] TRACEABILITY references valid DI-IDs.
- [x] FLAVORS / SELECTED FLAVOR completed (or marked N/A with justification — the four sigils are a derived family).
- [x] Stage 3 concept files at `./build/concept/` are unmodified.
- [x] All assets respect the Console-First Modern palette locked in DI-014.
- [x] `PIPELINE-STATUS.md` updated for Stage 8 with STATUS PASS and STATUS UPDATED 2026-05-03.

**GATE 8: PASS** (v2.0 — amendments A2 + A3 absorbed)
