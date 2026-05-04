# 5 — PARTS LIST

- **STATUS:** PASS
- **STATUS UPDATED:** 2026-05-03
- **AUTHOR:** Architect
- **STAGE:** 5 (Architecture & Parts)
- **UPSTREAM:** `5-ARCHITECTURE-RECOMMENDATIONS.md` (v2.0 — amendments A2 + A3 absorbed)

> Concrete, implementable parts inventory. Every PT names a specific technology (not a category) and traces back to the AR it implements and the BRs it satisfies. The Developer at Stage 9 builds these parts, in this shape, at these paths.

---

## Build & Project Skeleton

### PT-001 : Eleventy project root

- **DESCRIPTION:** The `./build/` directory containing `package.json`, `eleventy.config.mjs`, source content under `./build/src/`, and built output under `./build/_site/`.
- **TECHNOLOGY RECOMMENDATIONS:** `@11ty/eleventy` ^3.0.0, Node.js 20 LTS. `package.json` declares scripts: `dev` (`eleventy --serve`), `build` (`node scripts/check-sample-parity.mjs && eleventy`), `start` (alias for `dev`).
- **NOTES:** No bundler. Dependencies kept to: `@11ty/eleventy`, `shiki`, `markdown-it-attrs`. Lockfile committed.
- **RELATED:** AR-001. Satisfies BR-001.

### PT-002 : Eleventy configuration

- **DESCRIPTION:** `./build/eleventy.config.mjs`. Wires markdown-it + markdown-it-attrs, registers Shiki highlighter, registers shortcodes (`pitfall`, `caveat`, `verified`, `staleness`, `tabs`, `tab`, `endtab`, `endtabs`), defines the ten-topic nav constant, sets input/output dirs, and passes through `assets/` and `samples/`.
- **TECHNOLOGY RECOMMENDATIONS:** ES module (`.mjs`). Exports a default function receiving the eleventyConfig object. `addPassthroughCopy` for `assets/` (including `assets/js/tabs.mjs`) and `samples/`.
- **NOTES:** No plugins beyond what is named here. ≤ 120 LOC target. The nav order constant is the canonical source for topic order displayed in PT-003 sidebar.
- **RELATED:** AR-001, AR-009, AR-015. Satisfies BR-008, BR-009, BR-010.

### PT-003 : Base layout template

- **DESCRIPTION:** `./build/src/_includes/layouts/base.njk`. Page chrome: `<head>` (single CSS link, two ES module scripts: `cfg.mjs` and `tabs.mjs`), topbar (product title, cfg gear), left-rail navigation index listing all ten topic slugs in canonical order, main content slot, footer with link to release notes.
- **TECHNOLOGY RECOMMENDATIONS:** Nunjucks. Includes `partials/nav-index.njk` and `partials/cfg-modal.njk`. Nav index iterates the ten-topic constant from PT-002.
- **NOTES:** The cfg gear is a `<button data-cfg-open>` so `cfg.mjs` can bind without inline JS. The `tabs.mjs` script is also loaded as `type="module"` (deferred by default). No language sub-items appear in the sidebar — language is a tab within each topic page (BR-009).
- **RELATED:** AR-001, AR-002, AR-003, AR-009, AR-015. Satisfies BR-007, BR-008, BR-009, BR-011, BR-012.

### PT-004 : Topic page layout template

- **DESCRIPTION:** `./build/src/_includes/layouts/topic.njk`. Extends base. Renders a topic page header (title + one-sentence summary from frontmatter), verification badge strip (via `{% verified %}` shortcode), page body (which contains one or more `{% tabs %}…{% endtabs %}` blocks), and a "Related topics" footer. No per-language sub-navigation is rendered.
- **TECHNOLOGY RECOMMENDATIONS:** Nunjucks `{% extends %}`. Reads `title`, `summary`, `verifiedOn`, `package`, `version` from frontmatter.
- **NOTES:** Topic pages set `layout: layouts/topic.njk` in frontmatter. The tab groups inside the body are rendered by the `tabs`/`tab` shortcodes registered in PT-002; JS activation is handled by PT-018.
- **RELATED:** AR-002, AR-009, AR-010, AR-015. Satisfies BR-010, BR-013, BR-030, BR-055, BR-056.

---

## Content Pipeline

### PT-005 : Markdown + Shiki integration

- **DESCRIPTION:** Markdown engine config in `eleventy.config.mjs`. `markdown-it` with `markdown-it-attrs`; code fences highlighted by Shiki at build time; rendered HTML for code fences carries `data-cfg-template="true"` by default (opt out with `{ cfg=false }` attribute on the fence).
- **TECHNOLOGY RECOMMENDATIONS:** `markdown-it` ^14, `markdown-it-attrs` ^4, `shiki` ^1. Theme `github-dark-default` matching PT-014 palette.
- **NOTES:** Languages enabled: `javascript`, `typescript` (read-only for sample bridges), `python`, `csharp`, `java`, `bash`, `text`. Other languages fall back to plain `<pre>`.
- **RELATED:** AR-002, AR-004, AR-005. Satisfies BR-026, BR-035, BR-036.

### PT-006 : Callout and badge shortcodes

- **DESCRIPTION:** Nunjucks shortcodes registered in `eleventy.config.mjs`:
  - `{% pitfall "Title" %} … {% endpitfall %}` → `<aside class="callout callout--pitfall">`
  - `{% caveat "Stability: Development" %} … {% endcaveat %}` → `<aside class="callout callout--caveat">`
  - `{% verified %}` → `<span class="badge badge--verified" data-verified-on="…">Verified on YYYY-MM-DD against pkg@ver</span>`
  - `{% staleness %}` → renders `<aside class="callout callout--stale">may be stale</aside>` only when current date − `verifiedOn` > 365 days.
- **TECHNOLOGY RECOMMENDATIONS:** Nunjucks paired and single shortcodes via `eleventyConfig.addPairedShortcode` / `addShortcode`.
- **NOTES:** All four shortcodes throw a build error with a helpful message when required frontmatter is missing.
- **RELATED:** AR-010, AR-013. Satisfies BR-038, BR-052, BR-053, BR-061, BR-062, BR-064.

---

## Configuration Module (cfg.mjs)

### PT-007 : Configuration modal markup partial

- **DESCRIPTION:** `./build/src/_includes/partials/cfg-modal.njk`. Static HTML for the modal: header, three preset cards (`data-preset="generic|dynatrace|local"`), conditional Dynatrace fields (tenant URL + API token), service name field, preview block, Clear and Save buttons. Hidden by default (`hidden` attribute), shown by `cfg.mjs` when the gear is clicked.
- **TECHNOLOGY RECOMMENDATIONS:** Plain HTML in Nunjucks partial. Form elements use `data-cfg-field="endpoint|tenantUrl|apiToken|serviceName"` for `cfg.mjs` to bind.
- **NOTES:** Markup is identical on every page (included by base layout). The Dynatrace destination-neutrality note (BR-023) is rendered statically inside the Dynatrace preset card.
- **RELATED:** AR-003, AR-008. Satisfies BR-007, BR-008, BR-009, BR-010, BR-011, BR-012, BR-019, BR-021, BR-023.

### PT-008 : Configuration storage adapter

- **DESCRIPTION:** Internal section of `cfg.mjs` that wraps `localStorage` reads/writes under the key `otel-cookbook.cfg.v1`. Exposes `loadCfg()`, `saveCfg(cfg)`, `clearCfg()`. Returns a default config (Generic OTLP preset, `http://localhost:4318`, no headers, service name `my-service`) when no value is stored.
- **TECHNOLOGY RECOMMENDATIONS:** Browser Web Storage API (`localStorage`). JSON serialisation. No external library.
- **NOTES:** Schema versioning via the `v1` suffix. `clearCfg()` calls `localStorage.removeItem`. Wrapped in try/catch for browsers with disabled storage (degrades to in-memory only).
- **RELATED:** AR-003, AR-006. Satisfies BR-017, BR-018, BR-021.

### PT-009 : Placeholder substitution engine

- **DESCRIPTION:** Internal section of `cfg.mjs` that, on `DOMContentLoaded` and after every `saveCfg`, walks `document.querySelectorAll('[data-cfg-template="true"]')` and replaces tokens `{{OTLP_ENDPOINT}}`, `{{OTLP_HEADERS}}`, `{{SERVICE_NAME}}`, `{{OTLP_RESOURCE_ATTRIBUTES}}` with the active config values.
- **TECHNOLOGY RECOMMENDATIONS:** Vanilla DOM API. String replacement via a single regex per token. Idempotent: re-running on already-substituted nodes is a no-op (the substituted value is stored back in a `data-cfg-original` attribute on first run so subsequent saves can re-render from the original template).
- **NOTES:** Token registry is a single object literal at the top of `cfg.mjs`. Pitfall callouts that demonstrate "wrong" values set `data-cfg-template="false"` (PT-005 default can be overridden per fence).
- **RELATED:** AR-003, AR-005. Satisfies BR-015, BR-016, BR-019, BR-020, BR-022, BR-029.

### PT-010 : Dynatrace endpoint/header derivation

- **DESCRIPTION:** Internal pure function `deriveDynatrace(tenantUrl, apiToken)` returning `{ endpoint, headers }` per AR-007 rules: strips trailing slashes, appends `/api/v2/otlp`, builds the `Authorization=Api-Token <token>` header value.
- **TECHNOLOGY RECOMMENDATIONS:** Plain JS, no dependencies. Validates that `tenantUrl` starts with `https://` and contains a host segment; on failure returns `{ error: '…' }` and the panel surfaces the message.
- **NOTES:** Function is pure and unit-testable in isolation (the Tester at Stage 10 may exercise it directly).
- **RELATED:** AR-007. Satisfies BR-013, BR-014, BR-022.

### PT-011 : Configuration panel controller

- **DESCRIPTION:** Top-level orchestration in `cfg.mjs`: binds `data-cfg-open` button to show the modal; binds preset card clicks to switch active preset; toggles Dynatrace field visibility; binds Save (writes via PT-008, then triggers PT-009); binds Clear (calls PT-008 clear, re-renders templates with defaults). Updates the live preview block (BR-019 / CB-003 preview) on any input change.
- **TECHNOLOGY RECOMMENDATIONS:** Vanilla DOM event listeners. No virtual DOM.
- **NOTES:** Total module size budget: 6 kB minified, 0 transitive deps.
- **RELATED:** AR-003, AR-008. Satisfies BR-006, BR-007, BR-019, BR-020, BR-021.

---

## Content (recipes, hubs, topics, troubleshooting)

### PT-012 : Home page

- **DESCRIPTION:** `./build/src/index.md`. Product title "Performance Architecture OTel Cookbook" above the fold, one-paragraph purpose statement naming OTLP as transport and Dynatrace as one supported destination, 2×5 grid of topic tiles (Quickstart, Traces, Metrics, Logs, Auto-instrumentation, Resource Attributes, Sampling, Semantic Conventions for HTTP, Batching, Troubleshooting), a language strip caption ("Every recipe shows JavaScript · Python · .NET · Java side-by-side"), optional-run note ("Running code and running a Collector are both optional"), topbar cfg link, footer link to release notes.
- **TECHNOLOGY RECOMMENDATIONS:** Markdown with `layout: layouts/base.njk` frontmatter. Topic tiles rendered as a Nunjucks include `partials/topic-tiles.njk` that iterates the ten-topic constant.
- **NOTES:** No language tiles as primary navigation. Topic tile order is canonical: Quickstart first, Troubleshooting last.
- **RELATED:** AR-001, AR-002, AR-009. Satisfies BR-001, BR-002, BR-003, BR-004, BR-005, BR-006, BR-007, BR-064.

### PT-013 : Topic content set

- **DESCRIPTION:** Ten Markdown files, one per topic, at `./build/src/<topic-slug>/index.md`:
  - `quickstart/index.md`, `traces/index.md`, `metrics/index.md`, `logs/index.md`, `auto/index.md`, `resource-attributes/index.md`, `sampling/index.md`, `semantic-conventions-http/index.md`, `batching/index.md`, `troubleshooting/index.md`.
  - Each file carries frontmatter: `title`, `summary`, `layout: layouts/topic.njk`, `verifiedOn` (ISO date), `package` (representative SDK), `version`, and optionally `signalStability`.
  - Each file contains one or more `{% tabs %}…{% endtabs %}` blocks with exactly four `{% tab "JavaScript" %} … {% endtab %}` (likewise Python, .NET, Java) entries per block, each containing a fenced code block and a `{% verified %}` call.
  - Quickstart tab also declares `sampleSource` per language (pointing at PT-016/PT-017 sample files).
  - Every Quickstart-style topic contains at least one `{% pitfall %}` callout.
- **TECHNOLOGY RECOMMENDATIONS:** Markdown + frontmatter + Nunjucks shortcodes. Code fences use `js`, `python`, `csharp`, `java` language tags.
- **NOTES:** No per-language sub-pages exist. The tab shortcode emits `<div class="tab-group">` markup that PT-018 activates at runtime.
- **RELATED:** AR-002, AR-009, AR-010, AR-013, AR-015. Satisfies BR-013, BR-019, BR-030–BR-035, BR-039–BR-046, BR-047–BR-049, BR-050–BR-054, BR-055–BR-058, BR-059, BR-065.

### PT-014 : Stylesheet

- **DESCRIPTION:** `./build/src/assets/styles.css` — single hand-authored stylesheet. Implements Console-First Modern palette (AR-014): bg `#0D1117`, surface `#161B22`, ink `#E6ECF5`, muted `#8A93AB`, OTel orange `#F5A800`, Dynatrace cyan `#1496FF`, ok-green `#37B26B`, pitfall red `#B6452C` (with surface `#2A1812`), caveat amber `#E0A030`, cross-cutting lavender `#9990D9`. Defines `.callout`, `.callout--pitfall`, `.callout--caveat`, `.callout--stale`, `.badge--verified`, modal styles, code-block styling (Shiki-themed inner HTML, rounded panel outer).
- **TECHNOLOGY RECOMMENDATIONS:** Plain CSS. No preprocessor. CSS custom properties at `:root` for palette tokens. ≤ 8 kB target.
- **NOTES:** No web fonts (avoids BR-018-relevant outbound requests). System monospace stack for code: `ui-monospace, "Fira Code", "JetBrains Mono", monospace`.
- **RELATED:** AR-014. Satisfies BR-038, BR-053.

---

## Language Tab Component

### PT-018 : Language tab component (tabs.mjs)

- **DESCRIPTION:** `./build/src/assets/js/tabs.mjs`. Implements the ARIA tabs pattern for all `<div class="tab-group">` elements on the page. On load: marks all tab-groups as initialised, hides non-active panels, sets `aria-selected` states. On tab click: activates clicked tab across all tab-groups sharing `data-tab-group` attribute, writes the chosen language key to `localStorage` under `otel-tab-lang`, and re-runs PT-009 placeholder substitution (calls `window.applyConfig()` if available). Without JS: CSS rule `.tab-group:not(.tabs--initialised) .tab-panel { display: block; }` ensures all panels are visible.
- **TECHNOLOGY RECOMMENDATIONS:** Vanilla ES module. No dependencies. ~4 kB target. Loaded as `<script type="module" src="/assets/js/tabs.mjs"></script>` in PT-003 base layout.
- **NOTES:** `localStorage` key is `otel-tab-lang`. Default value is `"js"`. Coordination with `cfg.mjs`: `tabs.mjs` calls `window.applyConfig()` (exported by `cfg.mjs`) after a tab switch so that code blocks in the newly active panel are also substituted.
- **RELATED:** AR-015. Satisfies BR-013, BR-015, BR-016, BR-017, BR-018.

---

## Sample Apps

### PT-015 : Sample-source parity check script

- **DESCRIPTION:** `./build/scripts/check-sample-parity.mjs`. Reads each recipe Markdown's `sampleSource` frontmatter; extracts the primary code fence (the one tagged `{ data-primary }`); reads the named sample source file; asserts byte-equality after stripping a leading shebang from the sample (if any). Exits non-zero on mismatch with a diff.
- **TECHNOLOGY RECOMMENDATIONS:** Node.js 20 built-ins only (`fs`, `path`). No dependencies. Invoked by the `build` npm script.
- **NOTES:** Whitespace and comments are part of the equality check — divergence is a build failure, not a warning.
- **RELATED:** AR-012. Satisfies BR-067.

### PT-016 : JavaScript sample app

- **DESCRIPTION:** `./build/samples/javascript/`: `package.json`, `instrumentation.js` (the file referenced by `sampleSource` in the JS Quickstart), `app.js` (a tiny demo HTTP server that creates a span and exits), `README.md` (≤ 10 numbered run steps).
- **TECHNOLOGY RECOMMENDATIONS:** Node.js 20+. Packages: `@opentelemetry/sdk-node`, `@opentelemetry/exporter-trace-otlp-http`, `@opentelemetry/auto-instrumentations-node`. Versions pinned to whatever version each recipe declares as `verifiedOn`.
- **NOTES:** `OTEL_EXPORTER_OTLP_ENDPOINT` defaults to `http://localhost:4318` if unset. README shows how to point at Dynatrace as an alternative.
- **RELATED:** AR-012. Satisfies BR-065, BR-066, BR-068.

### PT-017 : Python / .NET / Java sample apps

- **DESCRIPTION:**
  - `./build/samples/python/`: `requirements.txt`, `instrumentation.py`, `app.py`, `README.md`.
  - `./build/samples/dotnet/`: `Sample.csproj`, `Instrumentation.cs`, `Program.cs`, `README.md`.
  - `./build/samples/java/`: `build.gradle.kts` (or `pom.xml`), `Instrumentation.java`, `App.java`, `README.md`.
- **TECHNOLOGY RECOMMENDATIONS:**
  - Python 3.9+. `opentelemetry-sdk`, `opentelemetry-exporter-otlp-proto-http`, `opentelemetry-instrumentation`.
  - .NET 8+. `OpenTelemetry`, `OpenTelemetry.Exporter.OpenTelemetryProtocol`, `OpenTelemetry.AutoInstrumentation` (for the auto sample).
  - Java 17+. `io.opentelemetry:opentelemetry-bom`, `io.opentelemetry:opentelemetry-exporter-otlp`. Java agent JAR downloaded by README step rather than bundled.
- **NOTES:** Each sample follows the same shape: `instrumentation.*` is the file mirrored from the recipe; `app.*` is a runnable harness that emits ≥ 1 span; README ≤ 10 steps.
- **RELATED:** AR-012. Satisfies BR-065, BR-066, BR-068.

---

## Coverage Matrix (AR → PT)

| AR | Implementing PT(s) |
|---|---|
| AR-001 | PT-001, PT-002, PT-003, PT-004 |
| AR-002 | PT-002, PT-003, PT-004, PT-005, PT-006, PT-013 |
| AR-003 | PT-007, PT-008, PT-009, PT-010, PT-011 |
| AR-004 | PT-005 |
| AR-005 | PT-005 (default attr), PT-009 (substitution) |
| AR-006 | PT-008 |
| AR-007 | PT-010 |
| AR-008 | PT-007, PT-008, PT-011 |
| AR-009 | PT-002, PT-003, PT-012, PT-013 |
| AR-010 | PT-006, PT-013 |
| AR-011 | (release notes file written at Stage 9 by Developer) |
| AR-012 | PT-015, PT-016, PT-017 |
| AR-013 | PT-006 |
| AR-014 | PT-014 |
| AR-015 | PT-018 |

Every AR-001 through AR-015 has at least one implementing PT (AR-011 is realised by the Stage 9 release notes artifact; no Stage 5 PT is required).

---

## Exit Gate

- [x] Every AR maps to at least one PT (or, for AR-011, to a downstream pipeline artifact named explicitly).
- [x] Every PT has a TECHNOLOGY RECOMMENDATIONS field naming a specific, concrete choice (Eleventy 3.x, Shiki 1.x, markdown-it 14, Nunjucks, vanilla ES module, plain CSS, Node.js 20 built-ins, etc.).
- [x] PT IDs are sequential PT-001 … PT-018 and non-reused.
- [x] RELATED fields trace PT → AR → BR correctly.
- [x] `PIPELINE-STATUS.md` updated for Stage 5 with STATUS PASS and STATUS UPDATED 2026-05-03.

**GATE 5: PASS** (parts half — see also `5-ARCHITECTURE-RECOMMENDATIONS.md`, v2.0 amendments A2 + A3 absorbed)
