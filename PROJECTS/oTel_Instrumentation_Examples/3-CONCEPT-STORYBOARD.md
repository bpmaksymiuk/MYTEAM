# 3 — CONCEPT STORYBOARD

- **STATUS:** PASS
- **STATUS UPDATED:** 2026-05-03
- **AUTHOR:** Graphic Artist
- **STAGE:** 3 (Concept Storyboard — v2.0, amendments A2 + A3 absorbed)
- **UPSTREAM:** `1-USE-CASES.md` (approved 2026-05-03 incl. A2, A3), `2-NARRATIVE-VISION.md` (v2.0)

> Exploratory visual concepts translating approved use cases and narrative vision into shape, layout, and interaction patterns. The site is now **topic-first** with language expressed as a within-page tab group; per-language hubs are removed. Five concept boards cover the four major surfaces plus the full IA flow.

---

## CB-001 : Home Page — Topic-First Entry

- **SUMMARY:** Dark, engineering-forward home page presenting ten topic hubs as the primary entry points; four languages are referenced once as a supporting caption, not as navigation.
- **FILE:** `./build/concept/cb-001-home-topic-first.svg`
- **FORMAT:** SVG, 1280×800. Deep navy `#0B1020`, surface `#141A2E`, OTel orange `#F5A800`, muted green `#37B26B`.
- **SCREENS COVERED:** Home page — product title, one-paragraph purpose statement, 2×5 grid of topic tiles (Quickstart, Traces, Metrics, Logs, Auto-instrumentation, Resource Attributes, Sampling, Semantic Conventions, Batching, Troubleshooting), language strip ("Every recipe shows JavaScript · Python · .NET · Java side-by-side"), and topbar cfg link.
- **STYLE NOTES:** Topic tiles are the visual heroes; language is a footnote-style strip below the grid. The product name "Performance Architecture OTel Cookbook" is in a bold, narrow sans at full width. Topic tile labels are concise (≤2 words). OTLP is mentioned in the purpose statement; Dynatrace is named as one supported destination. A topbar cfg link or pill opens the Export Target panel.
- **TRACEABILITY:** UC-001 (AC1, AC2, AC3, AC4, AC5, AC6), UC-002 (topbar cfg), UC-009 (AC2 — topic-only primary nav).
- **RELATED:** CB-002 (topic page), CB-003 (cfg panel), CB-005 (IA flow).

---

## CB-002 : Topic Page Anatomy — Language Tab Group

- **SUMMARY:** A single topic page (Quickstart used as the worked example) showing a concept header, an optional export-target toggle, and one or more four-language tab groups (JS / Python / .NET / Java) where the active tab highlights and all others are visible but dimmed.
- **FILE:** `./build/concept/cb-002-topic-page-tabs.svg`
- **FORMAT:** SVG, 1280×900. Same dark palette as CB-001. Tab row uses `#F5A800` underline for the active tab label; inactive tabs are `#8A9BB5`.
- **SCREENS COVERED:** Topic page header (title, verification badge, one-sentence summary), export-target toggle (Direct OTLP / OTel Collector — optional), tab row (JavaScript | Python | .NET | Java), code block for the active tab (pre-filled env vars if cfg is set), Pitfall callout below code block, optional "Why this matters" callout.
- **STYLE NOTES:** The tab row is the interaction centrepiece. Active tab underline is OTel orange. Verification badge is a small pill immediately below the title (ok-green border, mono `Verified YYYY-MM-DD · pkg@version`). Export-target toggle defaults to "Direct OTLP" (checked); "OTel Collector (optional)" is greyed to signal it is available but not required. Pitfall callout sits directly under the step it guards (red-brown surface, red border). No per-language navigation links in sidebar — language selection is tab-only.
- **TRACEABILITY:** UC-003 (AC1–AC7), UC-004 (AC1–AC7), UC-005 (toggle), UC-006 (AC1–AC5), UC-007 (AC1–AC5), UC-010 (Pitfall inline), UC-011 (verification badge), UC-013 (read-only orientation, no required run step).
- **RELATED:** CB-001 (home → topic link), CB-003 (cfg fills the env-var values), CB-005 (IA context).

---

## CB-003 : Export Target Configuration Panel

- **SUMMARY:** Modal configuration panel with three preset options — Direct OTLP (default), Dynatrace, and OTel Collector (clearly labelled optional) — along with conditionally visible fields, a live code-block preview, and a "saved locally only" reassurance.
- **FILE:** `./build/concept/cb-003-config-panel.svg`
- **FORMAT:** SVG, 1280×800. Dark surface `#0D1117`/`#161B22`, ok-green border for the active preset, underlying page dimmed to signal modal context.
- **SCREENS COVERED:** Modal — three preset cards in a row; "Direct OTLP (HTTP)" is the active/checked preset; "Dynatrace" and "OTel Collector (optional)" are available. Below preset row: OTLP endpoint field (default placeholder), service name field. "Dynatrace" selection would reveal tenant URL + API token fields. "OTel Collector" preset shows a one-line callout "Running a Collector is optional — Direct OTLP is the default." Live code-block preview at bottom. Clear / Save buttons.
- **STYLE NOTES:** "Direct OTLP" preset is outlined in ok-green (active). "OTel Collector" preset card includes a small italic explainer: *optional, not required*. Dynatrace card carries a muted note: *one of several supported destinations*. Preview block uses ok-green text on near-black. Margin annotations cite UC-002 AC1–AC7 mapped to each region.
- **TRACEABILITY:** UC-002 (AC1–AC7), UC-013 (AC2 — Collector optional stated in UI).
- **RELATED:** CB-001 (topbar cfg link), CB-002 (env-var values in code tabs come from here).

---

## CB-004 : Manual vs Auto-Instrumentation Style Toggle

- **SUMMARY:** Traces topic page showing the style toggle (Manual SDK / Auto-instrumentation) above the language tab group; selecting a style changes the code block content while the language tab stays selected.
- **FILE:** `./build/concept/cb-004-style-toggle.svg`
- **FORMAT:** SVG, 1280×900. Same dark palette.
- **SCREENS COVERED:** Topic page (Traces) with an extra row above the tab group: [Manual SDK ●] [Auto-instrumentation ○]. Below toggle: four-language tab group with the active tab's code block visible. Pros/cons callout below the code block.
- **STYLE NOTES:** Toggle is a two-button segmented control; active segment is OTel orange filled, inactive is outlined. Pros/cons callout uses a blue-grey surface (distinct from the red pitfall callout). The toggle persists scroll position — changing style doesn't jump the reader back to the top of the page.
- **TRACEABILITY:** UC-005 (AC1–AC5), UC-003 (AC1 — still shows all four language tabs).
- **RELATED:** CB-002 (base topic page), CB-005 (Traces node in IA).

---

## CB-005 : Site Flow — Topic-First Information Architecture

- **SUMMARY:** Four-layer flow diagram (Entry → Topics → Code Blocks → Support) showing every topic is reachable in one click from home, language is a tab dimension within each topic, and the Export Target panel is reachable from every page.
- **FILE:** `./build/concept/cb-005-site-flow.svg`
- **FORMAT:** SVG, 1280×800. Same dark palette. Solid arrows = primary nav; dashed arrows = cross-references; OTel-orange dashed arc = "cfg reachable from every page".
- **SCREENS COVERED:** Whole-site map: Home → 10 topic pages (Quickstart, Traces, Metrics, Logs, Auto-instrumentation, Resource Attributes, Sampling, Semantic Conventions for HTTP, Batching, Troubleshooting). Within each topic page node: four-tab row (JS | Py | .NET | Java) and optional style toggle. Support node row: Export Target panel, Release Notes, Troubleshooting (also a topic), Sample files (parity reference only).
- **STYLE NOTES:** Language tabs are shown as a sub-node inside each topic box, not as separate top-level nodes, to make the tab-not-section distinction visually immediate. The Export Target arc is OTel orange (ubiquitous, not topic-scoped). Release Notes and Sample files are leaf nodes with dashed arrows (reachable but not primary navigation). The ten topic nodes are laid out in two rows of five to match the home-page tile grid.
- **TRACEABILITY:** UC-001 (AC2, AC3, AC5), UC-002 (cfg ubiquity), UC-003 (tab sub-nodes), UC-004–UC-007 (topic nodes), UC-008 (cross-cutting topics), UC-009 (AC1, AC3), UC-010 (Troubleshooting node), UC-011 (Release Notes leaf), UC-012 (Samples leaf), UC-013 (no required-run step in flow).
- **RELATED:** All other CBs are nodes or interactions in this map.

---

## Coverage Matrix

| Use Case | Concept Boards |
|----------|----------------|
| UC-001 Home (topic-first) | CB-001, CB-005 |
| UC-002 Export Target panel | CB-001, CB-002, CB-003, CB-005 |
| UC-003 Language tab group | CB-002, CB-004, CB-005 |
| UC-004 Quickstart (tabbed) | CB-002, CB-005 |
| UC-005 Style toggle | CB-004, CB-005 |
| UC-006 Metrics (tabbed) | CB-002, CB-005 |
| UC-007 Logs (tabbed) | CB-002, CB-005 |
| UC-008 Cross-cutting topics | CB-002, CB-005 |
| UC-009 Navigation (topic-only) | CB-001, CB-005 |
| UC-010 Troubleshooting topic | CB-002, CB-005 |
| UC-011 Verification badge | CB-002, CB-005 |
| UC-012 Sample parity (optional run) | CB-005 |
| UC-013 Read-only mode | CB-002, CB-003, CB-005 |

Every approved use case is covered by at least one concept board.

---

## Open Decisions Forwarded to Stage 5 / Stage 8

1. **Topic tile icon set:** Ten topic tiles on the home page need a consistent icon vocabulary. Recommend line-art sigils per topic (wave = traces, counter = metrics, scroll = logs, robot = auto, tag = resource, funnel = sampling, label = semconv, stack = batching, wrench = troubleshooting). Stage 8 to produce final SVG icons.
2. **Export target panel placement:** Modal (as in CB-003) vs persistent sidebar panel. Recommend modal for v1 (matches existing implementation); sidebar affordance could be added in v2 for power users.
3. **Style toggle visual:** Segmented control (CB-004) vs radio buttons. Recommend segmented control for compactness.
4. **Tab active-state colour:** OTel orange underline (CB-002) vs filled tab. Recommend underline — it is the web-standard pattern for tabs (ARIA tabs) and requires no filled background that might clash with code-block colours.

---

## Exit Gate

- [x] `3-CONCEPT-STORYBOARD.md` contains at least one CB record per major UC flow (Home, Topic+Tabs, Config, Style toggle, Site IA — five records cover all 13 UCs).
- [x] Every CB record follows the schema (SUMMARY, FILE, FORMAT, SCREENS COVERED, STYLE NOTES, TRACEABILITY, RELATED — all present).
- [x] Every CB FILE path exists and is a non-empty SVG.
- [x] TRACEABILITY field references valid UC-IDs from `1-USE-CASES.md` (UC-001 through UC-013).
- [x] All content reflects Amendment A2 (topic-first IA, language tabs) and A3 (optional Collector, read-only reference).
- [x] `PIPELINE-STATUS.md` updated for Stage 3.

**GATE 3: PASS**
