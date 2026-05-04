# Release Notes — oTel Instrumentation Examples

Append-only. One RN entry per Stage 9 implementation run. Versions never decrease.

---

## RN-001 : v0.1.0 — 2026-05-03

- **CHANGED FILES:**
  - `./build/package.json` — Eleventy 3.x + Shiki + markdown-it-attrs project manifest, scripts `dev`/`build`/`start`.
  - `./build/.gitignore` — ignore `node_modules/` and `_site/`.
  - `./build/eleventy.config.mjs` — Shiki highlighter, custom fence renderer that injects `data-cfg-template`/`data-primary`/`data-lang`, four language collections, cross-cutting and troubleshooting collections, passthrough copy for assets, images, samples.
  - `./build/scripts/check-sample-parity.mjs` — Stage 9 build gate: scans every recipe markdown for the `{data-primary}` fence, compares byte-equality to its `sampleSource:` file (trailing `\n` trimmed; sample shebang stripped from comparison).
  - `./build/src/_includes/layouts/base.njk` — base HTML skeleton with topbar, configuration gear, navigation, content slot, footer.
  - `./build/src/_includes/layouts/recipe.njk` — recipe-specific layout, verified badge and staleness shortcode.
  - `./build/src/_includes/partials/nav-index.njk` — left-rail nav grouping languages, cross-cutting topics, troubleshooting, release notes.
  - `./build/src/_includes/partials/cfg-modal.njk` — native `<dialog>` configuration panel with Generic / Dynatrace / Local OTLP presets.
  - `./build/src/_includes/partials/language-tiles.njk` — home-page tile grid linking to the four language hubs.
  - `./build/src/assets/cfg.mjs` — vanilla ES module: localStorage key `otel-cookbook.cfg.v1`, three frozen presets, pure `effectiveEndpoint`/`effectiveHeaders`, idempotent `applyTemplates`, modal binding, in-memory fallback when storage unavailable.
  - `./build/src/assets/styles.css` — Console-First Modern palette, topbar, page grid, navindex, recipe content, callout variants (pitfall/caveat), verified badge, modal with `::backdrop`, preset-card with `:has()`, language-tile grid.
  - `./build/src/index.md` — home page, hero block, language tiles.
  - `./build/src/topics/index.md` — cross-cutting topic index.
  - `./build/src/topics/resource-attributes.md` — definition + per-language quickstart links.
  - `./build/src/topics/sampling.md` — definition + per-language manual links.
  - `./build/src/topics/semantic-conventions-http.md` — definition with citation + per-language auto links.
  - `./build/src/topics/batching.md` — definition + per-language manual links.
  - `./build/src/troubleshooting/index.md` — symptoms grouped by cause, per-language fix links.
  - `./build/src/release-notes.md` — site-published release notes page.
  - `./build/src/javascript/index.md` — JavaScript hub.
  - `./build/src/javascript/quickstart.md` — Node SDK + OTLP/HTTP, primary fence linked to `samples/javascript/instrumentation.js`.
  - `./build/src/javascript/manual.md` — manual `NodeTracerProvider` + `BatchSpanProcessor`.
  - `./build/src/javascript/auto.md` — `getNodeAutoInstrumentations`.
  - `./build/src/javascript/metrics.md` — `MeterProvider` + counter.
  - `./build/src/javascript/logs.md` — `LoggerProvider` (signalStability: development).
  - `./build/src/javascript/troubleshooting.md` — JS-specific symptoms.
  - `./build/src/python/index.md` — Python hub.
  - `./build/src/python/quickstart.md` — `TracerProvider` + OTLP/HTTP, primary fence linked to `samples/python/instrumentation.py`.
  - `./build/src/python/manual.md` — `start_as_current_span` example.
  - `./build/src/python/auto.md` — `opentelemetry-distro` + `opentelemetry-bootstrap`.
  - `./build/src/python/metrics.md` — `MeterProvider` + counter.
  - `./build/src/python/logs.md` — `LoggerProvider` (signalStability: development).
  - `./build/src/python/troubleshooting.md` — Python-specific symptoms.
  - `./build/src/dotnet/index.md` — .NET hub.
  - `./build/src/dotnet/quickstart.md` — `Sdk.CreateTracerProviderBuilder()` with `AddSource` + `AddOtlpExporter`, primary fence linked to `samples/dotnet/Instrumentation.cs`.
  - `./build/src/dotnet/manual.md` — `ActivitySource` example.
  - `./build/src/dotnet/auto.md` — `AddAspNetCoreInstrumentation` + `AddHttpClientInstrumentation`.
  - `./build/src/dotnet/metrics.md` — `Meter` + counter.
  - `./build/src/dotnet/logs.md` — `ILogger` + OpenTelemetry logging integration (stable surface).
  - `./build/src/dotnet/troubleshooting.md` — .NET-specific symptoms.
  - `./build/src/java/index.md` — Java hub.
  - `./build/src/java/quickstart.md` — `SdkTracerProvider` + `BatchSpanProcessor` + OTLP/HTTP, primary fence linked to `samples/java/Instrumentation.java`.
  - `./build/src/java/manual.md` — `Tracer.spanBuilder` + `makeCurrent()` example.
  - `./build/src/java/auto.md` — `-javaagent:` JAR usage.
  - `./build/src/java/metrics.md` — `LongCounter`.
  - `./build/src/java/logs.md` — Development-stage caveat with auto-bridge guidance.
  - `./build/src/java/troubleshooting.md` — Java-specific symptoms.
  - `./build/samples/javascript/instrumentation.js` — byte-identical to JS quickstart primary fence.
  - `./build/samples/javascript/app.js` — emits one custom span and exits.
  - `./build/samples/javascript/package.json` — pinned versions, `start` script preloads instrumentation.
  - `./build/samples/javascript/README.md` — runbook (≤10 numbered steps).
  - `./build/samples/python/instrumentation.py` — byte-identical to Python quickstart primary fence.
  - `./build/samples/python/app.py` — emits one custom span.
  - `./build/samples/python/requirements.txt` — pinned versions.
  - `./build/samples/python/README.md` — runbook.
  - `./build/samples/dotnet/Instrumentation.cs` — byte-identical to .NET quickstart primary fence.
  - `./build/samples/dotnet/Program.cs` — emits one custom Activity.
  - `./build/samples/dotnet/Sample.csproj` — `net8.0`, OpenTelemetry 1.9.0 + OTLP exporter 1.9.0.
  - `./build/samples/dotnet/README.md` — runbook.
  - `./build/samples/java/Instrumentation.java` — byte-identical to Java quickstart primary fence.
  - `./build/samples/java/App.java` — emits one custom span.
  - `./build/samples/java/build.gradle.kts` — Gradle Kotlin DSL with BOM 1.42.0 + OTLP exporter.
  - `./build/samples/java/README.md` — runbook.

- **IMPLEMENTATION CAVEATS:**
  - **Sample-parity script not yet executed.** The build script `check-sample-parity.mjs` was implemented to enforce byte-equality between recipe `{data-primary}` fences and their `sampleSource` files. Recipe authors took care to keep them identical, but the script must be executed at Stage 10 (Tester) via `npm run build` to confirm parity.
  - **Java sigil colour.** The Java sigil SVG (Stage 8 / GA-008) reuses the Dynatrace cyan token (`#1496ff`). This was flagged in `X-Journal.md` JN-021 as an open item for Tester re-review. Not fixed in Stage 9 — Stage 9 implements DIs verbatim and Stage 6 design instructions did not mandate a different sigil colour.
  - **Logs API stability.** JavaScript, Python, and Java log recipes are tagged `signalStability: development` because the upstream OpenTelemetry logs API surfaces are not yet stable. Pinned versions are listed but recipe content may need re-verification after dependency upgrades. .NET logs use the stable `ILogger` integration and have no such caveat.
  - **No live OTLP verification performed during Stage 9.** Recipes were authored from official OTel SDK reference docs. End-to-end verification (running each sample against a collector and confirming spans appear) is the Tester's responsibility at Stage 10.
  - **`npm install` not executed.** `package.json` is authored but dependencies are not installed in `./build/node_modules/`. Tester must run `cd build && npm install && npm run build`.

- **UC/BR COVERAGE:**
  - Use cases: UC-001, UC-002, UC-003, UC-004, UC-005, UC-006, UC-007, UC-008, UC-009, UC-010, UC-011, UC-012, UC-013.
  - Business requirements: BR-001 through BR-068 (full set per `4-REQUIREMENTS.md`). The amendment requiring optional, configurable Dynatrace items is satisfied by the Generic / Dynatrace / Local presets in `cfg.mjs` and `cfg-modal.njk`; Generic is the default and Dynatrace is selectable, not implicit.

- **NOTES:**
  - **For Tester (Stage 10):** Run `cd PROJECTS/oTel_Instrumentation_Examples/build && npm install && npm run build`. The `build` script chains `node scripts/check-sample-parity.mjs` then Eleventy. If parity fails, treat as a Stage 9 bug (Manager will route back). Then serve `_site/` and run Playwright with `--headed` per `pipeline.instructions.md`. Confirm the configuration modal persists state across reload, that `data-primary` fences render with the saved configuration substituted, and that the Dynatrace preset is selectable but not the default.
  - **For Manager:** No upstream artifact changes were required during Stage 9. All DIs from `6-DESIGN-INSTRUCTIONS.md` were implementable as written.
  - **For Auditor:** Append observation entry covering Stage 9 to `X-AUDIT-REPORT.md` after this gate closes.

---

## RN-002 : v0.1.1 — 2026-05-03

- **CHANGED FILES:**
  - `./build/src/troubleshooting/index.md` — added `templateEngineOverride: md` to the frontmatter so Nunjucks does not try to parse the literal `{{` token in the heading "Value contains literal `{{` placeholder". The page already used no Nunjucks shortcodes in its body; the layout (`base.njk`) continues to be rendered through Nunjucks. Build now succeeds (`Wrote 36 files`).
- **IMPLEMENTATION CAVEATS:**
  - BUG-002 (Java sigil cyan reuses Dynatrace cyan) remains open at Low severity. Manager deferred it from this loop. No release-blocking impact.
- **UC/BR COVERAGE:** Restores Stage-10 verifiability for UC-001..UC-012 and BR-001..BR-064 (no functional behaviour changed; only Eleventy build).
- **NOTES:** For Tester — re-run `npm run build` from `./build/` (now exits 0) then re-run `npx playwright test --config=playwright.config.mjs --headed` from `./tests/`. Test cases T-001..T-013 stand as written; only the BLOCKED rows in `10-TEST-REPORT.md` should change.

---

## RN-003 · v0.2.0 · Stage 9 implementation (2026-04-22)

### Summary
Full site restructured from language-first to topic-first information architecture (A2 + A3 amendments). All four languages (JS, Python, .NET, Java) are now presented as tabs within each of ten topic pages. OTel Collector is labelled as optional throughout.

### Changes

**New features**
- `tabs.mjs` — vanilla ES module ARIA tab component, `localStorage` persistence (`otel-tab-lang`), no-JS fallback (all panels visible when `body.js-tabs-ready` absent)
- Ten topic pages: Quickstart, Traces, Metrics, Logs, Auto-instrumentation, Resource Attributes, Sampling, Semantic Conventions (HTTP), Batching, Troubleshooting — each with JS / Python / .NET / Java tabs
- Home page rebuilt as topic hub grid with link cards to all ten topics
- `topic.njk` layout (extends `base.njk`, renders `<article class="topic-page">` with header, summary, verified badge, content)
- Tab CSS + topic grid CSS appended to `styles.css`
- Sidebar `nav-index.njk` rebuilt to iterate `topicOrder` global data

**Updated**
- `eleventy.config.mjs`: added `tabs`/`tab` paired shortcodes; added `topicOrder` global data array; `verified` shortcode now gracefully handles topic pages without `package`/`version` frontmatter
- `base.njk`: added `<script type="module" src="/assets/js/tabs.mjs">`, updated title format, removed old language nav links
- `cfg-modal.njk`: preset `generic` → `direct` ("Direct OTLP (HTTP) — no Collector"), preset `local` → `collector` ("Local OTel Collector (optional)")
- `cfg.mjs`: preset key `generic` → `direct`, `local` → `collector`; `DEFAULT_PRESET` → `'direct'`; exposed `window.applyConfig = applyTemplates` for tab-switch coordination

**Removed**
- `src/javascript/`, `src/python/`, `src/dotnet/`, `src/java/` — old language-first recipe directories
- `src/topics/` — old cross-cutting topic stubs (replaced by top-level topic directories)

### Verification
- `npm run build` → exit 0; 12 files written, 3 passthrough copied
- Sample parity: 1 sample matched (quickstart JS `{data-primary}` ↔ `samples/javascript/instrumentation.js`)

### Known limitations
- Sample parity covers JS only; Python, .NET, Java quickstart samples remain in `samples/` but are not verified by the parity script in this release (deferred to Stage 10)
