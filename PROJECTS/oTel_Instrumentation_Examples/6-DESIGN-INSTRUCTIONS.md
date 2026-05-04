# 6 — DESIGN INSTRUCTIONS

- **STATUS:** PASS
- **STATUS UPDATED:** 2026-05-03
- **AUTHOR:** Technical Lead
- **STAGE:** 6 (Design Instructions — v2.0, amendments A2 + A3 absorbed)
- **UPSTREAM:** `4-REQUIREMENTS.md` (BR-001–BR-066), `5-ARCHITECTURE-RECOMMENDATIONS.md` (AR-001–AR-015), `5-PARTS LIST.md` (PT-001–PT-018)

> Implementation-ready instructions. Each DI is self-contained: file paths are relative to the project root (`PROJECTS/oTel_Instrumentation_Examples/`), function signatures are complete, data shapes are stated, edge cases are enumerated. The Developer at Stage 9 executes these in order without clarifying questions.
>
> The site is now **topic-first** with language expressed as a tab within each topic page. All per-language hub pages and sub-recipes are removed. The tab component (DI-016, DI-016b) and topic pages (DI-018–DI-027) are the central new artefacts.

---

## Execution Order Summary

DI-001 → DI-002 → DI-003 → DI-004 → DI-005 (project skeleton + Eleventy config)
DI-006 → DI-007 → DI-008 → DI-009 (templating partials + shortcodes)
DI-010 → DI-011 → DI-012 → DI-013 → DI-014 (cfg.mjs internals)
DI-015 (stylesheet — includes tab component CSS)
DI-016 (tabs.mjs — language tab component JS)
DI-017 (home page — topic hub grid)
DI-018 → DI-019 → DI-020 → DI-021 → DI-022 → DI-023 → DI-024 → DI-025 → DI-026 → DI-027 (ten topic pages)
DI-028 → DI-029 → DI-030 → DI-031 (sample apps)
DI-032 (sample-parity build script update)

---

## DI-001 : Project Skeleton Cleanup

- **SUMMARY:** Remove old per-language source directories; create new topic-slug directories. The project skeleton, package.json, and build scripts from v0.1.x are retained.
- **IMPLEMENTATION STEPS:**
  1. From `./build/src/`, remove directories: `javascript/`, `python/`, `dotnet/`, `java/` (and all their contents).
  2. Create new topic directories under `./build/src/`: `quickstart/`, `traces/`, `metrics/`, `logs/`, `auto/`, `resource-attributes/`, `sampling/`, `semantic-conventions-http/`, `batching/`, `troubleshooting/`.
  3. Create `./build/src/assets/js/` (for `tabs.mjs` to be added at DI-016).
  4. `package.json`, `eleventy.config.mjs`, `scripts/`, `samples/`, and `_includes/` are preserved — see later DIs for changes to their contents.
- **SKILLSET REQUIRED:** File system.
- **NOTES:** The `samples/` directory at `./build/samples/` is not restructured — it remains `samples/javascript/`, `samples/python/`, `samples/dotnet/`, `samples/java/`.
- **RELATED:** AR-001, AR-009, PT-001.

---

## DI-002 : Eleventy Configuration File

- **SUMMARY:** Update `./build/eleventy.config.mjs` to register tab shortcodes, update the passthrough copy for `assets/js/tabs.mjs`, and replace language-based collections with a topic-order constant.
- **IMPLEMENTATION STEPS:**
  1. Keep existing Shiki highlighter init and markdown-it-attrs wiring unchanged.
  2. Add `eleventyConfig.addPassthroughCopy('src/assets');` (this now covers `assets/js/tabs.mjs` automatically).
  3. Replace the `languages`, `quickstarts`, `byLanguage`, `crossCutting`, `troubleshooting` collection definitions with a single exported constant:
     ```js
     export const TOPIC_ORDER = [
       { slug: 'quickstart',               label: 'Quickstart' },
       { slug: 'traces',                   label: 'Traces' },
       { slug: 'metrics',                  label: 'Metrics' },
       { slug: 'logs',                     label: 'Logs' },
       { slug: 'auto',                     label: 'Auto-instrumentation' },
       { slug: 'resource-attributes',      label: 'Resource Attributes' },
       { slug: 'sampling',                 label: 'Sampling' },
       { slug: 'semantic-conventions-http',label: 'Semantic Conventions (HTTP)' },
       { slug: 'batching',                 label: 'Batching' },
       { slug: 'troubleshooting',          label: 'Troubleshooting' },
     ];
     ```
  4. Register paired shortcodes for tabs (see DI-009 for full spec):
     - `eleventyConfig.addPairedShortcode('tabs', tabsShortcode);`
     - `eleventyConfig.addPairedShortcode('tab', tabShortcode);`
  5. Register shortcodes `pitfall`, `caveat`, `verified`, `staleness` as before (DI-009).
  6. In the `return` value, set `templateFormats: ['njk', 'md', 'html']` and ensure `markdownTemplateEngine: 'njk'`.
- **SKILLSET REQUIRED:** Eleventy 3.x config API.
- **NOTES:** `TOPIC_ORDER` is imported into `nav-index.njk` via Eleventy global data. Add it as a global data entry: `eleventyConfig.addGlobalData('topicOrder', TOPIC_ORDER);`.
- **RELATED:** AR-001, AR-009, AR-015, PT-002.

---

## DI-003 : Base Layout Template

- **SUMMARY:** Update `./build/src/_includes/layouts/base.njk` to add `tabs.mjs` script and update nav to link topic pages.
- **IMPLEMENTATION STEPS:**
  1. In `<head>`, add after the cfg.mjs script line:
     ```html
     <script type="module" src="/assets/js/tabs.mjs"></script>
     ```
  2. In the topbar, change nav links:
     - Remove language hub links.
     - Keep: link to `/` (home), link to cfg gear button.
     - The left-rail nav index (DI-005) handles all topic links.
  3. Update `<title>` tag: `<title>{{ title or 'Performance Architecture OTel Cookbook' }}</title>`.
  4. No other structural changes to base layout.
- **SKILLSET REQUIRED:** Nunjucks, HTML.
- **NOTES:** `tabs.mjs` is loaded as `type="module"` so it is automatically deferred. No inline JS.
- **RELATED:** AR-001, AR-003, AR-015, PT-003, BR-007, BR-008, BR-009.

---

## DI-004 : Topic Page Layout Template

- **SUMMARY:** Create `./build/src/_includes/layouts/topic.njk` extending `base.njk`. This replaces the old `recipe.njk`.
- **IMPLEMENTATION STEPS:**
  1. Create `./build/src/_includes/layouts/topic.njk`:
     ```njk
     ---
     layout: layouts/base.njk
     ---
     <article class="topic-page">
       <header class="topic-header">
         <h1>{{ title }}</h1>
         {% if summary %}<p class="topic-summary">{{ summary }}</p>{% endif %}
         {% verified %}
         {% staleness %}
       </header>
       {{ content | safe }}
     </article>
     ```
  2. Delete (or keep as deprecated alias) `./build/src/_includes/layouts/recipe.njk`. Recipe layout is no longer used.
- **SKILLSET REQUIRED:** Nunjucks template inheritance.
- **NOTES:** `{% verified %}` and `{% staleness %}` shortcodes (DI-009) throw a build error when `verifiedOn`, `package`, or `version` frontmatter is absent.
- **RELATED:** AR-002, AR-009, AR-010, PT-004, BR-055, BR-056.

---

## DI-005 : Navigation Index Partial

- **SUMMARY:** Rewrite `./build/src/_includes/partials/nav-index.njk` to list ten topics (not language hubs).
- **IMPLEMENTATION STEPS:**
  1. Replace entire content with:
     ```njk
     <nav aria-label="Topics">
       <ul class="nav-topics">
         {% for t in topicOrder %}
           <li>
             <a href="/{{ t.slug }}/"
                {% if page.url == '/' + t.slug + '/' %}aria-current="page"{% endif %}>
               {{ t.label }}
             </a>
           </li>
         {% endfor %}
       </ul>
     </nav>
     ```
  2. `topicOrder` is the global data array registered in DI-002.
- **SKILLSET REQUIRED:** Nunjucks, ARIA.
- **NOTES:** `aria-current="page"` highlights the active topic in the sidebar. No language sub-items appear. No JavaScript needed for this navigation.
- **RELATED:** AR-009, PT-005 (via nav-index), BR-008, BR-009, BR-010, BR-011, BR-012.

---

## DI-006 : Configuration Modal Partial

- **SUMMARY:** Update `./build/src/_includes/partials/cfg-modal.njk` to use the new preset labels: "Direct OTLP (HTTP) — no Collector" (default), "Dynatrace", "Local OTel Collector (optional)".
- **IMPLEMENTATION STEPS:**
  1. Locate the three preset cards in the modal markup.
  2. Change preset 1 from "Generic OTLP" to:
     ```html
     <div class="preset-card" data-preset="direct" role="radio" aria-checked="true" tabindex="0">
       <strong>Direct OTLP (HTTP) — no Collector</strong>
       <span class="preset-note">Sends directly to any OTLP HTTP endpoint. Default.</span>
     </div>
     ```
  3. Change preset 3 from "Local OTLP receiver" to:
     ```html
     <div class="preset-card" data-preset="collector" role="radio" aria-checked="false" tabindex="-1">
       <strong>Local OTel Collector <em>(optional)</em></strong>
       <span class="preset-note">Running a Collector is optional — Direct OTLP is the default.</span>
     </div>
     ```
  4. Dynatrace preset (preset 2) label stays as "Dynatrace"; add a one-line note:
     ```html
     <span class="preset-note">Dynatrace is one of several supported destinations.</span>
     ```
  5. All other modal markup (fields, preview, Save/Clear buttons) remains unchanged.
- **SKILLSET REQUIRED:** HTML, ARIA.
- **NOTES:** Update `cfg.mjs` constants (DI-010) to match new preset keys: `'direct'`, `'dynatrace'`, `'collector'` (rename from `'generic'` and `'local'`).
- **RELATED:** AR-008, PT-007, BR-021, BR-022, BR-023, BR-029.

---

## DI-007 : Markdown-it Attrs Integration

- **SUMMARY:** No change from v1. The markdown-it-attrs integration and code-fence `data-cfg-template` default attribute remain unchanged.
- **NOTES:** Verify that the existing implementation wires `markdownItAttrs` in `eleventyConfig.amendLibrary('md', ...)` and that the custom fence renderer correctly propagates `data-cfg-template="true"` by default. If the fence renderer is working, no edit is needed.
- **RELATED:** AR-002, AR-004, AR-005, PT-005.

---

## DI-008 : Shortcodes — Pitfall, Caveat, Verified, Staleness, Tabs

- **SUMMARY:** Register all Nunjucks shortcodes. Add `tabs` and `tab` paired shortcodes for the language tab component.
- **IMPLEMENTATION STEPS:**

  **Existing shortcodes (verify, not change):**
  - `{% pitfall "Title" %} content {% endpitfall %}` → `<aside class="callout callout--pitfall"><h4>⚠ Title</h4>…</aside>`
  - `{% caveat "Label" %} content {% endcaveat %}` → `<aside class="callout callout--caveat"><h4>Label</h4>…</aside>`
  - `{% verified %}` → reads `verifiedOn`, `package`, `version` from page data; emits `<span class="badge badge--verified">Verified YYYY-MM-DD · pkg@version</span>`. Throws if any field missing.
  - `{% staleness %}` → emits `<aside class="callout callout--stale">…</aside>` when `(today - verifiedOn) > 365 days`. Emits nothing otherwise.

  **New shortcodes (add):**

  `tabs` paired shortcode — wraps a group of `tab` blocks:
  ```js
  eleventyConfig.addPairedShortcode('tabs', (content, groupId) => {
    return `<div class="tab-group" data-tab-group="${groupId || 'default'}">\n`
         + `  <div role="tablist" class="tab-list">${_tabButtons}</div>\n`
         + `  ${content}\n`
         + `</div>`;
  });
  ```
  Implementation note: `_tabButtons` must be constructed from the tab labels within `content`. The simplest pattern is for each `tab` block to emit both a button placeholder and its panel; the `tabs` shortcode then reorganises. An easier implementation: **each `tab` block emits a `<div class="tab-panel" data-lang="..." hidden>` and the tab buttons are generated by `tabs.mjs` at runtime by reading the `data-lang` attributes**. This is the recommended approach (buttons-from-data):

  ```js
  eleventyConfig.addPairedShortcode('tabs', (content, groupId) => {
    return `<div class="tab-group" data-tab-group="${groupId || 'main'}">\n${content}\n</div>`;
  });

  eleventyConfig.addPairedShortcode('tab', (content, lang, label) => {
    // lang: 'js'|'python'|'dotnet'|'java'  label: 'JavaScript'|'Python'|'.NET'|'Java'
    return `<div class="tab-panel" data-lang="${lang}" data-label="${label}" role="tabpanel" hidden>\n${content}\n</div>`;
  });
  ```

  `tabs.mjs` (DI-016) reads all `.tab-panel[data-label]` elements to build the tab button row at runtime. Without JS the `hidden` attribute is removed by a `<noscript>` CSS rule, revealing all panels.

- **SKILLSET REQUIRED:** Eleventy shortcodes, JS.
- **NOTES:** The `hidden` attribute on `.tab-panel` is the no-JS fallback hook. CSS: `body:not(.js-tabs-ready) .tab-panel { display: block !important; }` or a `<noscript><style>.tab-panel{display:block}</style></noscript>` block in base layout.
- **RELATED:** AR-015, PT-006, PT-018, BR-013, BR-018.

---

## DI-009 : `cfg.mjs` — Module Skeleton and Constants

- **SUMMARY:** Update the preset registry in `cfg.mjs` to use new preset keys and labels. All other `cfg.mjs` structure is unchanged.
- **IMPLEMENTATION STEPS:**
  1. Locate the PRESETS constant (or equivalent object) in `./build/src/assets/cfg.mjs`.
  2. Replace preset keys from `{ generic, dynatrace, local }` to `{ direct, dynatrace, collector }`:
     ```js
     const PRESETS = {
       direct: {
         label: 'Direct OTLP (HTTP) — no Collector',
         defaultEndpoint: 'http://localhost:4318',
         headers: '',
       },
       dynatrace: {
         label: 'Dynatrace',
         defaultEndpoint: '', // derived from tenantUrl
         headers: '',         // derived from apiToken
       },
       collector: {
         label: 'Local OTel Collector (optional)',
         defaultEndpoint: 'http://localhost:4318',
         headers: '',
       },
     };
     const DEFAULT_PRESET = 'direct';
     ```
  3. Ensure `loadCfg()` returns `DEFAULT_PRESET` when storage is empty.
  4. No other changes to `cfg.mjs`.
- **SKILLSET REQUIRED:** JavaScript.
- **NOTES:** If `cfg.mjs` currently uses `'generic'` or `'local'` as keys, rename them here. Also update `cfg-modal.njk` (DI-006) to use matching `data-preset` attribute values.
- **RELATED:** AR-003, AR-008, PT-009, BR-021.

---

## DI-010 : `cfg.mjs` — Storage Adapter

- **SUMMARY:** No functional change. Verify the storage adapter uses the key `otel-cookbook.cfg.v1` and falls back to the `direct` default preset.
- **NOTES:** If the adapter currently returns `'generic'` as the default preset, change it to `'direct'` (matching DI-009).
- **RELATED:** AR-006, PT-008, BR-026, BR-027.

---

## DI-011 : `cfg.mjs` — Dynatrace Derivation

- **SUMMARY:** No change. The derivation function `deriveDynatrace(tenantUrl, apiToken)` is unchanged.
- **RELATED:** AR-007, PT-010.

---

## DI-012 : `cfg.mjs` — Placeholder Substitution Engine

- **SUMMARY:** Export `applyConfig()` as `window.applyConfig` so that `tabs.mjs` can call it after a tab switch.
- **IMPLEMENTATION STEPS:**
  1. Ensure the substitution function is callable externally. Add at the bottom of `cfg.mjs`:
     ```js
     window.applyConfig = applyConfig;
     ```
  2. `tabs.mjs` (DI-016) calls `window.applyConfig?.()` after switching the active tab, so that newly visible code blocks are substituted.
  3. No other changes to the substitution engine.
- **SKILLSET REQUIRED:** JavaScript module patterns.
- **NOTES:** Using `window.applyConfig` avoids ES module import coupling between the two scripts.
- **RELATED:** AR-003, AR-005, PT-009, BR-025.

---

## DI-013 : `cfg.mjs` — Modal Controller

- **SUMMARY:** No functional change beyond the preset key rename (DI-009). The controller reads `data-preset` attributes from the modal markup to identify which preset was selected.
- **NOTES:** Verify that after DI-006 and DI-009 changes, the modal controller correctly identifies `data-preset="direct"` as the default-active preset.
- **RELATED:** AR-003, PT-011.

---

## DI-014 : `cfg.mjs` — Export `applyConfig` (already covered in DI-012)

- **SUMMARY:** Merged into DI-012. This DI is intentionally blank.

---

## DI-015 : Stylesheet

- **SUMMARY:** Add CSS for the language tab component to the existing `./build/src/assets/styles.css`.
- **IMPLEMENTATION STEPS:**
  1. Add the following at the end of the stylesheet:
     ```css
     /* ── Language Tab Component ─────────────────────────────── */
     .tab-group { margin: 1.5rem 0; }

     /* No-JS fallback: show all panels stacked */
     body:not(.js-tabs-ready) .tab-panel { display: block !important; }

     .tab-list {
       display: flex;
       gap: 0;
       border-bottom: 1px solid #2A3444;
       margin-bottom: 0;
       list-style: none;
       padding: 0;
     }

     .tab-btn {
       background: none;
       border: none;
       border-bottom: 3px solid transparent;
       color: #8A93AB;
       cursor: pointer;
       font-size: 0.875rem;
       font-family: inherit;
       padding: 0.5rem 1rem;
       transition: color 0.15s, border-color 0.15s;
     }

     .tab-btn[aria-selected="true"] {
       color: #F5A800;
       border-bottom-color: #F5A800;
     }

     .tab-btn:hover { color: #E6ECF5; }

     .tab-panel { display: none; padding: 0; }
     .tab-panel[data-active] { display: block; }
     ```
  2. Ensure no existing styles conflict with `.tab-group`, `.tab-list`, `.tab-btn`, `.tab-panel`.
- **SKILLSET REQUIRED:** CSS.
- **NOTES:** The `body.js-tabs-ready` class is set by `tabs.mjs` on `DOMContentLoaded` (DI-016). Until then, `:not(.js-tabs-ready)` keeps all panels visible.
- **RELATED:** AR-014, AR-015, PT-014, PT-018, BR-018.

---

## DI-016 : Language Tab Component (`tabs.mjs`)

- **SUMMARY:** Create `./build/src/assets/js/tabs.mjs` — the ARIA tabs component that activates tab groups, synchronises across the page, and persists language preference.
- **IMPLEMENTATION STEPS:**
  1. Create `./build/src/assets/js/tabs.mjs` with the following logic:
     ```js
     const STORAGE_KEY = 'otel-tab-lang';
     const DEFAULT_LANG = 'js';

     function getStoredLang() {
       try { return localStorage.getItem(STORAGE_KEY) || DEFAULT_LANG; }
       catch { return DEFAULT_LANG; }
     }

     function storeLang(lang) {
       try { localStorage.setItem(STORAGE_KEY, lang); } catch {}
     }

     function buildTabList(group) {
       const panels = group.querySelectorAll('.tab-panel');
       const list = document.createElement('div');
       list.setAttribute('role', 'tablist');
       list.classList.add('tab-list');
       panels.forEach(panel => {
         const btn = document.createElement('button');
         btn.type = 'button';
         btn.role = 'tab';
         btn.classList.add('tab-btn');
         btn.dataset.lang = panel.dataset.lang;
         btn.textContent = panel.dataset.label;
         btn.setAttribute('aria-selected', 'false');
         btn.addEventListener('click', () => selectLang(panel.dataset.lang));
         list.appendChild(btn);
       });
       group.prepend(list);
     }

     function selectLang(lang) {
       storeLang(lang);
       document.querySelectorAll('.tab-group').forEach(group => activateGroup(group, lang));
       window.applyConfig?.();  // re-apply cfg substitutions in newly visible panels
     }

     function activateGroup(group, lang) {
       const panels = group.querySelectorAll('.tab-panel');
       const btns   = group.querySelectorAll('.tab-btn');
       let matched = false;
       panels.forEach(p => {
         const active = p.dataset.lang === lang;
         if (active) matched = true;
         p.toggleAttribute('data-active', active);
         p.style.display = active ? '' : 'none';
         p.hidden = !active;
       });
       btns.forEach(b => b.setAttribute('aria-selected', String(b.dataset.lang === lang)));
       // If no matching panel, activate first
       if (!matched && panels.length) {
         panels[0].toggleAttribute('data-active', true);
         panels[0].hidden = false;
         btns[0]?.setAttribute('aria-selected', 'true');
       }
     }

     document.addEventListener('DOMContentLoaded', () => {
       const groups = document.querySelectorAll('.tab-group');
       groups.forEach(buildTabList);
       document.body.classList.add('js-tabs-ready');
       const lang = getStoredLang();
       groups.forEach(g => activateGroup(g, lang));
     });
     ```
  2. The file is a plain ES module. No default export is needed.
- **SKILLSET REQUIRED:** Vanilla JavaScript, ARIA.
- **NOTES:**
  - `window.applyConfig?.()` calls the cfg.mjs substitution engine (DI-012) after a tab switch so code blocks in the newly visible panel are token-substituted.
  - `body.js-tabs-ready` class is the hook for the CSS no-JS fallback (DI-015).
  - `data-active` attribute (not a class) is used to drive the CSS active state, keeping it inspectable in browser dev tools.
- **RELATED:** AR-015, PT-018, BR-013, BR-015, BR-016, BR-017, BR-018.

---

## DI-017 : Home Page

- **SUMMARY:** Rewrite `./build/src/index.md` for topic-first layout.
- **IMPLEMENTATION STEPS:**
  1. Replace the file content with:
     ```markdown
     ---
     title: Performance Architecture OTel Cookbook
     layout: layouts/base.njk
     ---

     # Performance Architecture OTel Cookbook

     A topic-first reference for instrumenting applications with **OpenTelemetry**.
     Every code example exports via **OTLP** — to Dynatrace, a local Collector, or any
     OTLP-compatible backend. Running code and running a Collector are both optional.

     <div class="topic-grid">
       {% for t in topicOrder %}
         <a class="topic-tile" href="/{{ t.slug }}/">{{ t.label }}</a>
       {% endfor %}
     </div>

     <p class="lang-strip">Every recipe shows <strong>JavaScript</strong> · <strong>Python</strong> · <strong>.NET</strong> · <strong>Java</strong> side-by-side.</p>
     ```
  2. Add CSS for `.topic-grid` and `.lang-strip` to the stylesheet (DI-015):
     ```css
     .topic-grid {
       display: grid;
       grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
       gap: 1rem;
       margin: 2rem 0;
     }
     .topic-tile {
       background: #141A2E;
       border: 1px solid #2A3444;
       border-radius: 6px;
       color: #E6ECF5;
       display: block;
       font-size: 0.95rem;
       font-weight: 600;
       padding: 1rem;
       text-decoration: none;
       transition: border-color 0.15s;
     }
     .topic-tile:hover { border-color: #F5A800; color: #F5A800; }
     .lang-strip { color: #8A93AB; font-size: 0.85rem; margin: 0.5rem 0 2rem; }
     ```
- **SKILLSET REQUIRED:** Markdown, Nunjucks, CSS.
- **NOTES:** The `topicOrder` Eleventy global (DI-002) drives the tile grid — no hardcoded list needed in the template.
- **RELATED:** AR-009, PT-012, BR-001–BR-007, BR-064.

---

## DI-018 : Quickstart Topic Page

- **SUMMARY:** Create `./build/src/quickstart/index.md` — the first-trace topic page with four-language tab group covering install, init, env-vars, and span emission.
- **FRONTMATTER:**
  ```yaml
  ---
  title: Quickstart — Your First Trace
  summary: Send your first trace to an OTLP endpoint in minutes.
  layout: layouts/topic.njk
  verifiedOn: "2025-09-01"
  package: "@opentelemetry/sdk-node | opentelemetry-sdk | OpenTelemetry.Sdk | io.opentelemetry:opentelemetry-sdk"
  version: "1.x"
  ---
  ```
- **CONTENT STRUCTURE:**
  ```
  ## What you will build
  (2–3 sentence description of emitting a span)

  ## Configure your export target
  (one sentence linking to cfg gear, placeholder mention)

  {% tabs "quickstart" %}

  {% tab "js", "JavaScript" %}
  **Install**
  ```bash
  npm install @opentelemetry/sdk-node @opentelemetry/exporter-trace-otlp-http \
    @opentelemetry/resources @opentelemetry/semantic-conventions
  ```
  **Initialise and emit a span** (data-primary marked on this fence)
  ```js {data-primary}
  import { NodeSDK } from '@opentelemetry/sdk-node';
  import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
  import { trace } from '@opentelemetry/api';
  // ... full initialisation code
  ```
  **Expected output** (when run):
  ```text
  Span "my-operation" exported to {{OTLP_ENDPOINT}}
  ```
  {% verified %}
  {% endtab %}

  {% tab "python", "Python" %}
  (equivalent for Python: opentelemetry-sdk, opentelemetry-exporter-otlp-proto-http)
  {% endtab %}

  {% tab "dotnet", ".NET" %}
  (equivalent for .NET: OpenTelemetry.Sdk, OpenTelemetry.Exporter.OpenTelemetryProtocol)
  {% endtab %}

  {% tab "java", "Java" %}
  (equivalent for Java: io.opentelemetry:opentelemetry-sdk, io.opentelemetry:opentelemetry-exporter-otlp)
  {% endtab %}

  {% endtabs %}

  {% pitfall "Missing OTLP_ENDPOINT environment variable" %}
  If the env var is unset, the exporter silently drops spans. Always set
  `OTEL_EXPORTER_OTLP_ENDPOINT` (or configure via the cfg panel above) before running.
  {% endpitfall %}
  ```
- **SAMPLE PARITY:** The JS tab code block marked `{data-primary}` must be identical to `./build/samples/javascript/instrumentation.js`. Set `sampleSource: samples/javascript/instrumentation.js` in frontmatter.
- **SKILLSET REQUIRED:** Markdown, Nunjucks shortcodes, OTel JS/Python/.NET/Java SDKs.
- **NOTES:** Full four-language code is required — no placeholder "to be completed" text. Running the code is not required for the page to satisfy acceptance criteria.
- **RELATED:** PT-013, BR-030–BR-035.

---

## DI-019 : Traces Topic Page

- **SUMMARY:** Create `./build/src/traces/index.md` — spans, span context, parent-child relationships, span attributes, with style toggle (Manual SDK vs Auto-instrumentation).
- **FRONTMATTER:** Same schema as DI-018, with `title: Traces — Spans and Context`.
- **CONTENT STRUCTURE:**
  ```
  ## Manual SDK vs Auto-instrumentation
  (style toggle: two-button segmented control rendered via a partial or class; see DI-016 for tab component — the toggle is a simpler two-option pattern)

  ### Manual SDK
  {% tabs "traces-manual" %}
  (JS tab: create a tracer, start/end spans, set attributes, set parent context)
  {% endtabs %}

  ### Auto-instrumentation
  {% tabs "traces-auto" %}
  (JS: @opentelemetry/auto-instrumentations-node; Python: opentelemetry-instrument;
   .NET: OpenTelemetry.AutoInstrumentation; Java: -javaagent:otel-javaagent.jar)
  {% endtabs %}

  {% caveat "Manual vs Auto" %}
  Manual: full control, more code. Auto: zero code, less visibility into custom spans.
  {% endcaveat %}

  {% pitfall "Span not ending" %}
  Always call span.end() in a finally block to avoid memory leaks.
  {% endpitfall %}
  ```
- **SKILLSET REQUIRED:** OTel tracing concepts; all four SDKs.
- **RELATED:** PT-013, BR-036–BR-038.

---

## DI-020 : Metrics Topic Page

- **SUMMARY:** Create `./build/src/metrics/index.md` — counters, histograms, gauges, export, stability notes.
- **FRONTMATTER:** `title: Metrics — Counters, Histograms, Gauges`; include `signalStability: stable` (JS/Python) or `signalStability: development` (Java metrics SDK as of 2025).
- **CONTENT STRUCTURE:**
  ```
  {% tabs "metrics" %}
  (JS: @opentelemetry/sdk-metrics, createCounter, createHistogram; Verified badge per tab)
  {% endtabs %}

  {% caveat "Stability: Development (Java)" %}
  The Java metrics SDK is in Development status as of 2025. API may change.
  {% endcaveat %}
  ```
- **RELATED:** PT-013, BR-039–BR-042.

---

## DI-021 : Logs Topic Page

- **SUMMARY:** Create `./build/src/logs/index.md` — log records, bridge patterns (e.g. Winston→OTel for JS), stability notes.
- **FRONTMATTER:** `title: Logs — Log Records and Bridge Patterns`.
- **CONTENT STRUCTURE:**
  ```
  {% tabs "logs" %}
  (JS: @opentelemetry/sdk-logs + winston bridge; Python: OTel logging bridge;
   .NET: ILogger bridge; Java: log4j / slf4j appender)
  {% endtabs %}

  {% caveat "Bridge pattern (JavaScript)" %}
  The JS tab uses a Winston→OTel bridge. Native OTel logs API support for JS is
  in development; the bridge is the current recommended approach.
  {% endcaveat %}
  ```
- **RELATED:** PT-013, BR-043–BR-046.

---

## DI-022 : Auto-Instrumentation Topic Page

- **SUMMARY:** Create `./build/src/auto/index.md` — zero-code instrumentation per language.
- **FRONTMATTER:** `title: Auto-instrumentation — Zero-Code Setup`.
- **CONTENT STRUCTURE:**
  ```
  {% tabs "auto" %}
  (JS: require @opentelemetry/auto-instrumentations-node, NODE_OPTIONS=--require;
   Python: opentelemetry-instrument <script>;
   .NET: OTEL_DOTNET_AUTO_* env vars + install script;
   Java: -javaagent:opentelemetry-javaagent.jar)
  {% endtabs %}

  {% pitfall "Auto-instrumentation and custom spans" %}
  Auto-instrumentation does not capture custom business logic spans. Use it alongside
  manual SDK for complete coverage.
  {% endpitfall %}
  ```
- **RELATED:** PT-013, BR-036, BR-038.

---

## DI-023 : Resource Attributes Topic Page

- **SUMMARY:** Create `./build/src/resource-attributes/index.md` — service.name, deployment.environment, service.version, custom attributes.
- **FRONTMATTER:** `title: Resource Attributes`.
- **CONTENT STRUCTURE:**
  ```
  {% tabs "resource-attrs" %}
  (each tab: how to set Resource with service.name, version, env; env-var approach
   OTEL_RESOURCE_ATTRIBUTES vs code-based Resource.create(); both shown)
  {% endtabs %}
  ```
- **RELATED:** PT-013, BR-047–BR-049.

---

## DI-024 : Sampling Topic Page

- **SUMMARY:** Create `./build/src/sampling/index.md` — always-on, probability, parent-based samplers.
- **FRONTMATTER:** `title: Sampling`.
- **CONTENT STRUCTURE:**
  ```
  {% tabs "sampling" %}
  (each tab: ParentBased + TraceIdRatioBased sampler config; env-var OTEL_TRACES_SAMPLER)
  {% endtabs %}

  {% pitfall "Sampling and metrics/logs" %}
  Sampling applies to traces only. Metrics and log records are not sampled by the SDK.
  {% endpitfall %}
  ```
- **RELATED:** PT-013, BR-047–BR-049.

---

## DI-025 : Semantic Conventions for HTTP Topic Page

- **SUMMARY:** Create `./build/src/semantic-conventions-http/index.md` — URL attributes, HTTP method, status code, server vs client span patterns.
- **FRONTMATTER:** `title: Semantic Conventions (HTTP)`.
- **CONTENT STRUCTURE:**
  ```
  (link to official semconv spec: https://opentelemetry.io/docs/specs/semconv/http/)

  {% tabs "semconv-http" %}
  (each tab: manually setting http.request.method, url.full, http.response.status_code
   on a span; note which are auto-set by auto-instrumentation so users avoid duplicates)
  {% endtabs %}
  ```
- **RELATED:** PT-013, BR-047–BR-049.

---

## DI-026 : Batching Topic Page

- **SUMMARY:** Create `./build/src/batching/index.md` — BatchSpanProcessor vs SimpleSpanProcessor, tuning parameters.
- **FRONTMATTER:** `title: Batching vs Simple Span Processors`.
- **CONTENT STRUCTURE:**
  ```
  {% tabs "batching" %}
  (each tab: configure BatchSpanProcessor with maxExportBatchSize, scheduledDelayMillis;
   contrast with SimpleSpanProcessor; recommend Batch for production)
  {% endtabs %}

  {% pitfall "SimpleSpanProcessor in production" %}
  SimpleSpanProcessor exports each span synchronously on end — not suitable for
  high-throughput production workloads.
  {% endpitfall %}
  ```
- **RELATED:** PT-013, BR-047–BR-049.

---

## DI-027 : Troubleshooting Topic Page

- **SUMMARY:** Rewrite (or update) `./build/src/troubleshooting/index.md` — symptoms grouped by cause, language tab links where applicable.
- **FRONTMATTER:** `title: Troubleshooting`.
- **CONTENT STRUCTURE:**
  ```
  ## 4xx / 5xx from OTLP endpoint
  Likely cause: wrong endpoint URL or missing headers.
  See [Quickstart tab](/quickstart/) for env-var setup.
  Common fix (code): …

  ## Spans not appearing
  Likely cause: exporter not flushed, wrong OTLP endpoint, or SDK not initialised before first span.

  ## Missing parent-child span relationships
  Cause: context not propagated across async boundaries. See [Traces](/traces/).

  ## Environment variable misconfiguration
  OTEL_EXPORTER_OTLP_ENDPOINT vs OTEL_EXPORTER_OTLP_TRACES_ENDPOINT precedence.
  ```
- **NOTES:** Each symptom heading should have an `id` attribute so Traces/Quickstart pages can link directly to the relevant section.
- **RELATED:** PT-013, BR-050–BR-054.

---

## DI-028 : JavaScript Sample App

- **SUMMARY:** Update `./build/samples/javascript/instrumentation.js` to match the Quickstart JS tab primary code block exactly.
- **IMPLEMENTATION STEPS:**
  1. Copy the primary code block from the JS Quickstart tab (DI-018) into `instrumentation.js`.
  2. Ensure `package.json` in `samples/javascript/` declares the same package versions as the Quickstart tab `verifiedOn` entry.
  3. `README.md` remains ≤ 10 numbered steps; step 1 must set `OTEL_EXPORTER_OTLP_ENDPOINT`.
- **NOTES:** Running the sample is optional (BR-062, BR-066). README must not claim running is required for verification.
- **RELATED:** AR-012, PT-016, BR-059, BR-060, BR-061, BR-062.

---

## DI-029 : Python Sample App

- **SUMMARY:** Update `./build/samples/python/instrumentation.py` to match the Python Quickstart tab primary code block.
- **IMPLEMENTATION STEPS:** Same pattern as DI-028 for Python. `requirements.txt` version-pins to Quickstart-declared packages.
- **RELATED:** AR-012, PT-017.

---

## DI-030 : .NET Sample App

- **SUMMARY:** Update `./build/samples/dotnet/Instrumentation.cs` to match the .NET Quickstart tab primary code block.
- **RELATED:** AR-012, PT-017.

---

## DI-031 : Java Sample App

- **SUMMARY:** Update `./build/samples/java/Instrumentation.java` (or `App.java`) to match the Java Quickstart tab primary code block.
- **RELATED:** AR-012, PT-017.

---

## DI-032 : Sample-Parity Build Script

- **SUMMARY:** Update `./build/scripts/check-sample-parity.mjs` to read the Quickstart topic page primary code block instead of individual recipe files.
- **IMPLEMENTATION STEPS:**
  1. The script currently reads recipe Markdown files by `sampleSource` frontmatter. The new Quickstart page at `./build/src/quickstart/index.md` carries `sampleSource` per language in frontmatter (or as a structured array).
  2. Update frontmatter schema to support per-language sample sources:
     ```yaml
     sampleSources:
       js:     samples/javascript/instrumentation.js
       python: samples/python/instrumentation.py
       dotnet: samples/dotnet/Instrumentation.cs
       java:   samples/java/Instrumentation.java
     ```
  3. The script reads `sampleSources`, extracts the `{data-primary}` code fence for each language from the Quickstart page, and asserts byte-equality with the named sample file.
  4. Exit 0 on success; exit non-zero with a diff on mismatch.
- **SKILLSET REQUIRED:** Node.js, `fs`, Markdown parsing (manual fence extraction or regex).
- **NOTES:** The script must handle `{data-primary}` detection inside a tab shortcode body, which may involve scanning for the attribute within fenced blocks.
- **RELATED:** AR-012, PT-015, BR-060, BR-061.

---

## DI-033 : Release Notes — RN-003

- **SUMMARY:** Append entry RN-003 (v0.2.0) to `./9-RELEASE-NOTES.md` after Stage 9 build succeeds.
- **IMPLEMENTATION STEPS:**
  1. After `npm run build` exits 0 and all ten topic pages render correctly:
     - Append entry: `## RN-003 — v0.2.0 (YYYY-MM-DD)` with summary of topic-first restructure, language tab component, updated config presets.
     - List packages verified per language.
  2. Update `PIPELINE-STATUS.md` Stage 9 → PASS.
- **RELATED:** AR-011, BR-057.

---

## Exit Gate

- [x] All 33 DIs are self-contained: each names exact file paths, function signatures, or content templates.
- [x] Every PT from the Parts List (PT-001 through PT-018) is addressed by at least one DI.
- [x] Every new requirement (topic-first, language tabs, optional Collector, read-only mode) has a corresponding DI.
- [x] DI-016 (`tabs.mjs`) includes complete, runnable pseudocode the Developer can execute directly.
- [x] DI-006 and DI-009 reflect updated preset labels (Direct OTLP, Collector optional).
- [x] All content reflects amendments A2 and A3.
- [x] `PIPELINE-STATUS.md` updated for Stage 6.

**GATE 6: PASS**
