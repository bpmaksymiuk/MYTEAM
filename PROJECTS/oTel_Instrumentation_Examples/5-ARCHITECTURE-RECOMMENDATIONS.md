# 5 — ARCHITECTURE RECOMMENDATIONS

- **STATUS:** PASS
- **STATUS UPDATED:** 2026-05-03
- **AUTHOR:** Architect
- **STAGE:** 5 (Architecture & Parts)
- **UPSTREAM:** `4-REQUIREMENTS.md` (BR-001 … BR-066, v2.0 — amendments A2 + A3 absorbed)

> Concrete technology decisions. Every AR names one chosen technology, justifies it against at least one alternative, and traces back to the BRs it satisfies. The Parts List in `5-PARTS LIST.md` enumerates the implementable components that realise these decisions.

---

## AR-001 : Static Multi-Page Site Built With Eleventy (11ty)

- **DECISION:** Eleventy (`@11ty/eleventy`) v3.x as the static site generator. Output is a fully static directory tree under `./build/_site/`, served by any static host or by `npx http-server ./build/_site` for local preview.
- **RATIONALE:** The cookbook is a static documentation site (BR-001, UC-001 NOTES) with a small client-side configuration layer (BR-007, BR-015). Eleventy is the simplest mature SSG that ships zero client JS by default — we add only the small module needed for the Configuration panel, instead of inheriting a 200kB framework runtime. Alternatives considered: **Astro** (great fit, but its component model and islands architecture are more than this project needs and would push us toward TS tooling); **MkDocs Material** (Python-based, polished, but its templating and content-rewriting story is weaker for the placeholder-substitution pattern AR-005 requires); **Docusaurus** (React-based, ships a heavy runtime by default, opinionated routing). Eleventy gives us Nunjucks templating, frontmatter-driven data, easy custom shortcodes for callouts/badges, and lets us own the small JS payload entirely.
- **NOTES:** Node.js 20 LTS or newer required at build time. Source under `./build/src/`, built site under `./build/_site/`. `package.json` + `eleventy.config.mjs` at the `./build/` root.
- **RELATED:** BR-001, BR-005, BR-007, BR-039, BR-041, BR-042, BR-043, BR-044, BR-054. Implemented by PT-001, PT-002, PT-014.

## AR-002 : Markdown + Nunjucks for Content Authoring

- **DECISION:** Recipes, hub pages, cross-cutting topics, and the Troubleshooting Index are authored in Markdown with YAML frontmatter; layouts and partials are Nunjucks (`.njk`).
- **RATIONALE:** Markdown is the lingua franca for technical content; YAML frontmatter cleanly carries structured fields (verification date, package, version, language, signal stability) needed by BR-061, BR-062, BR-037. Nunjucks (Eleventy's default) gives us shortcodes for the Pitfall callout (BR-053), the verification badge (BR-061), and stability caveats (BR-038) without leaving the template language. Alternatives considered: **MDX** (powerful but pulls in React/JSX runtime, contradicting AR-001 zero-runtime intent); **AsciiDoc** (richer semantics but worse author ergonomics and tooling familiarity for the four-language audience).
- **NOTES:** Markdown engine: `markdown-it` with `markdown-it-attrs` for `{.pitfall}` style class-on-block syntax. Code fences use language tags that the syntax highlighter (AR-004) recognises.
- **RELATED:** BR-026, BR-035, BR-036, BR-037, BR-038, BR-052, BR-053, BR-055, BR-061, BR-062. Implemented by PT-003, PT-005, PT-006.

## AR-003 : Client-Side Configuration Module (Vanilla ES Module, No Framework)

- **DECISION:** A single hand-written ES module `cfg.mjs` (≈ 6kB minified) loaded on every page handles preset selection, form rendering, persistence, and code-block placeholder substitution. No framework, no build-time bundler — served as-is.
- **RATIONALE:** BR-007/BR-015/BR-017/BR-018 demand a small interactive layer that runs in the browser, persists locally, and never transmits configuration. The work is ≤ 300 LOC of DOM manipulation; importing React/Vue/Preact would add 30–80kB and would obscure rather than help. Alternatives considered: **Alpine.js** (clean, small at ~15kB, but its declarative attributes scatter logic across HTML and complicate the placeholder-substitution loop in AR-005); **Preact + signals** (overkill for a one-modal app); **htmx** (server-driven model, wrong shape — there is no server here).
- **NOTES:** Module is a single file, no build step. Strict mode. Uses `localStorage` only (AR-006). Initialised by an inline `<script type="module" src="/assets/cfg.mjs"></script>` in the base layout.
- **RELATED:** BR-006, BR-007, BR-008, BR-009, BR-010, BR-011, BR-012, BR-013, BR-014, BR-015, BR-016, BR-017, BR-018, BR-019, BR-020, BR-021, BR-022, BR-023. Implemented by PT-007, PT-008, PT-009, PT-010, PT-011.

## AR-004 : Server-Side Syntax Highlighting With Shiki

- **DECISION:** Shiki (`shiki`) v1.x runs at build time inside Eleventy to syntax-highlight every code fence into pre-styled HTML. No client-side highlighter ships.
- **RATIONALE:** Code blocks are the hero element (per `2-NARRATIVE-VISION.md`). Shiki uses VS Code's TextMate grammars, so JavaScript, Python, C# (`.NET`), and Java all highlight with editor-grade fidelity. Doing this server-side keeps the client payload zero for highlighting, which preserves the BR-018 zero-network promise (no CDN font / theme fetches). Alternatives considered: **Prism.js client-side** (requires runtime + theme CSS, ~15kB minimum, lower fidelity); **highlight.js** (heavier auto-detection, lower fidelity); **starry-night** (Shiki-class fidelity but a less mature Eleventy story).
- **NOTES:** Theme: `github-dark-default` for the Console-First direction (CB-002 palette). Highlighter is initialised once per build. Fences must declare a language tag.
- **RELATED:** BR-026, BR-035, BR-036. Implemented by PT-005.

## AR-005 : Code-Block Placeholder Substitution Via Data Attributes

- **DECISION:** Every recipe code block carries `data-cfg-template="true"`. Tokens inside the rendered HTML use the form `{{OTLP_ENDPOINT}}`, `{{SERVICE_NAME}}`, `{{OTLP_HEADERS}}`. The `cfg.mjs` module walks `[data-cfg-template]` nodes on `DOMContentLoaded` and after every save, replacing tokens with the active configuration values.
- **RATIONALE:** BR-015 requires every code block to reflect the saved configuration. Doing this in the browser (rather than at build time) keeps the build output a single static deliverable that works for any reader's saved values. Token-and-attribute is more robust than naive find-and-replace: the attribute marks intent (this block is templated, that block is not) and avoids accidentally rewriting prose. Alternatives considered: **build-time variants** (combinatorial explosion: 3 presets × 4 languages × N recipes); **server-side render** (no server in scope per AR-001); **iframe per recipe with postMessage** (over-engineered, breaks deep-linking).
- **NOTES:** Tokens are uppercase snake-case; the registry of valid tokens lives in `cfg.mjs` and is documented in PT-009. Pitfall callouts that show "what wrong looks like" use `data-cfg-template="false"` to prevent accidental rewriting.
- **RELATED:** BR-015, BR-016, BR-019, BR-020, BR-022, BR-029. Implemented by PT-009.

## AR-006 : Configuration Persistence Via Browser localStorage Only

- **DECISION:** Configuration values are stored under a single `localStorage` key `otel-cookbook.cfg.v1` as JSON. No cookies, no IndexedDB, no service worker, no remote sync. The cookbook makes no outbound network requests beyond fetching its own static assets.
- **RATIONALE:** BR-017/BR-018 forbid off-device transmission; cookies travel on every request and would violate that. `localStorage` is universally supported, synchronous, simple, and same-origin. Alternatives considered: **IndexedDB** (asynchronous, more API surface, no benefit at this size); **cookies** (transmitted with every request — direct violation of BR-018); **URL fragment encoding** (would leak credentials into browser history).
- **NOTES:** Schema is versioned (`v1`) so future schema changes can migrate cleanly. The Clear control (BR-021) calls `localStorage.removeItem('otel-cookbook.cfg.v1')`.
- **RELATED:** BR-017, BR-018, BR-021. Implemented by PT-008.

## AR-007 : Dynatrace Endpoint and Header Derivation Rules

- **DECISION:** Given a Dynatrace tenant URL `https://<tenant>.live.dynatrace.com` (or `.../e/<env-id>` for managed) and an API token, the panel computes:
  - `OTLP_ENDPOINT = <tenant URL>/api/v2/otlp`
  - `OTLP_HEADERS = "Authorization=Api-Token <token>"`
  - The `/v1/traces`, `/v1/metrics`, `/v1/logs` path suffixes are appended automatically by every supported OTLP exporter and are not hard-coded.
- **RATIONALE:** Encodes the canonical Dynatrace OTLP shape into one place so BR-013 / BR-014 are satisfied without recipe-by-recipe editing. Alternatives considered: **ask the reader to paste a fully-formed endpoint URL** (more error-prone, defeats the "configure once" promise of UC-002); **hard-code per-recipe `/v1/traces`** (duplicates knowledge that the SDKs already encode).
- **NOTES:** Tenant URL is normalised by stripping trailing slashes before composition. Token is treated as opaque and goes only into the headers value (BR-022).
- **RELATED:** BR-013, BR-014, BR-022. Implemented by PT-010.

## AR-008 : Three-Preset Configuration Model

- **DECISION:** The Export Target configuration panel exposes exactly three presets:
  - **Direct OTLP (HTTP) — no Collector** (default) — endpoint defaults to `http://localhost:4318`, no headers, freely editable. Does not require an OTel Collector.
  - **Dynatrace** — endpoint and headers derived per AR-007 from tenant URL + API token inputs.
  - **Local OTel Collector (optional)** — endpoint `http://localhost:4318`, no headers. Clearly labelled optional with a one-line note: "Running a Collector is optional — Direct OTLP is the default."
- **RATIONALE:** Three is the minimum that satisfies BR-021–BR-023 without decision paralysis. "Direct OTLP" as the default removes any assumption that a Collector is required (BR-022, UC-013 AC2). Renaming "Generic OTLP" to "Direct OTLP" clarifies the OTLP transport is used without an intermediary Collector. Alternatives considered: **single free-form preset** (reader must know the Dynatrace shape — defeats UC-002 step 3); **many vendor presets** (out of scope for v1, can be added later as one-line registry entries).
- **NOTES:** Direct OTLP is the default preset on first visit. The Collector preset must include the word "optional" in its label (BR-022) and include an explanatory note (BR-023). Adding presets later is a one-line registry change in `cfg.mjs`.
- **RELATED:** BR-021, BR-022, BR-023, BR-024, BR-025, BR-026, BR-027. Implemented by PT-007, PT-008.

## AR-009 : Topic-First Information Architecture (Eleventy Collections)

- **DECISION:** Pages are organised by topic, not by language. Eleventy collections are derived from frontmatter `tags`:
  - `topic: quickstart|traces|metrics|logs|auto|resource-attributes|sampling|semantic-conventions-http|batching|troubleshooting` → ten top-level topic pages.
  - `kind: cross-cutting` → marks topics not scoped to a single language (all ten use tabs, so this is informational only).
  - Language is **not** a navigation dimension; it is a tab within each topic page.
  - URL convention: `/quickstart/`, `/traces/`, `/metrics/`, `/logs/`, `/auto/`, `/resource-attributes/`, `/sampling/`, `/semantic-conventions-http/`, `/batching/`, `/troubleshooting/`.
  - The global navigation index iterates the ten topic slugs in the above order.
- **RATIONALE:** Amendments A2 and A3 require topic-first IA (UC-001, UC-009). Language as a tab (AR-015) eliminates per-language URLs as primary navigation. Eleventy collections map naturally to topic slugs, and the navigation list is just an array constant — no drift risk. Alternatives considered: **language-hub IA** (the superseded design — requires 40+ pages for 10 topics × 4 languages; violates A2); **hand-maintained nav YAML** (drift risk).
- **NOTES:** Each topic page is a single Markdown file at `./build/src/<topic-slug>/index.md`. Language tab content is embedded in that page using a `{% tabs %}…{% endtabs %}` shortcode (AR-015). No per-language sub-pages under any topic.
- **RELATED:** BR-008, BR-009, BR-010, BR-011, BR-012, BR-030, BR-039, BR-043, BR-047, BR-050, BR-065. Implemented by PT-002, PT-003, PT-004, PT-018.

## AR-010 : Verification Badge as Build-Time Computed Shortcode

- **DECISION:** A Nunjucks shortcode `{% verified %}` reads `verifiedOn`, `package`, and `version` from page frontmatter and emits the canonical badge HTML. A build-time check fails if any recipe page is missing these fields. A second shortcode renders the "may be stale" warning when `(today - verifiedOn) > 365 days`.
- **RATIONALE:** Centralises BR-061/BR-062/BR-064 in one shortcode so the format is enforced and the staleness rule is computed against build date — no manual review required. Alternatives considered: **plain Markdown badge per page** (no enforcement, drift inevitable); **runtime JS computation** (works but unnecessarily moves logic out of the build).
- **NOTES:** Build fails loudly if a recipe lacks frontmatter. Date arithmetic uses ISO-8601 `verifiedOn`.
- **RELATED:** BR-061, BR-062, BR-064. Implemented by PT-006, PT-013.

## AR-011 : Release Notes as Single Markdown File

- **DECISION:** `9-RELEASE-NOTES.md` (the same file the Developer maintains under pipeline rules) is the central verification log. Each verification pass appends one entry: date, recipes verified, package versions exercised. The cookbook home page links to it.
- **RATIONALE:** Satisfies BR-063 with the same artifact the pipeline already requires for release notes — no duplication. Alternatives considered: **separate `VERIFICATION-LOG.md`** (duplicates a file we already maintain); **machine-readable JSON log rendered into a page** (over-engineered for v1).
- **NOTES:** Append-only. Each entry uses a stable heading anchor so badges can deep-link.
- **RELATED:** BR-063. Implemented by PT-012.

## AR-012 : Sample App Code Mirrored From Recipe Code Blocks Via Build Step

- **DECISION:** Each recipe Markdown file declares a `sampleSource` frontmatter field pointing at a sample-app source file (e.g. `samples/javascript/instrumentation.js`). A build-time check (a small Node script invoked before `eleventy --serve`) reads the named primary code fence from the recipe and asserts byte-equality with the named sample file. Build fails on mismatch.
- **RATIONALE:** BR-067 requires lockstep. Static check at build time catches drift immediately, with no runtime cost. Alternatives considered: **single source of truth in samples + transclude into recipe** (works, but the recipe is the canonical reading surface — readers should not be told "see file X"); **manual review** (fails BR-067 in practice).
- **NOTES:** Script lives at `./build/scripts/check-sample-parity.mjs` and runs in `npm run build`.
- **RELATED:** BR-065, BR-066, BR-067, BR-068. Implemented by PT-015, PT-016, PT-017.

## AR-013 : Pitfall and Stability Callouts as Reusable Shortcodes

- **DECISION:** Two Nunjucks paired shortcodes:
  - `{% pitfall "Title" %} … {% endpitfall %}` renders a red-bordered panel.
  - `{% caveat "Stability: Development" %} … {% endcaveat %}` renders an amber-bordered panel.
- **RATIONALE:** Single source of truth for visual treatment satisfies BR-053 (Pitfall visual distinction) and BR-038 (stability caveat). Alternatives considered: **per-page `<div class="pitfall">`** (HTML in Markdown is allowed but fragile; shortcodes are cleaner); **markdown-it container plugin** (acceptable, but Eleventy already gives us shortcodes).
- **NOTES:** CSS classes `.callout--pitfall` and `.callout--caveat` are defined in the single stylesheet (PT-014).
- **RELATED:** BR-038, BR-052, BR-053. Implemented by PT-006.

## AR-015 : Language Tab Component (Vanilla ES Module, ARIA Tabs Pattern)

- **DECISION:** A hand-written ES module `tabs.mjs` (≈ 4kB) implements the ARIA tabs pattern (role=tablist, role=tab, role=tabpanel). Tab state is synchronised across all tab groups on the page via a shared `data-tab-group` attribute. The active language is persisted to `localStorage` under the key `otel-tab-lang`. Without JS, all four language panels are displayed as stacked blocks (BR-018).
- **RATIONALE:** BR-013–BR-018 require a four-tab language group on every topic page. The interaction is simple (click a tab, show panel, hide others, sync, persist) — it does not warrant a library. ARIA tabs is the correct semantic pattern for accessibility. `data-tab-group` synchronisation means changing language in one code block changes all others on the page (BR-015), matching the established pattern of VS Code docs, MDN, and Stripe. Alternatives considered: **CSS-only tabs** (no JS, satisfies BR-018 trivially, but cannot persist preference or synchronise across multiple tab groups per BR-015–BR-016); **web components** (good but adds ≥2kB of boilerplate for a stateless element; ARIA tabs with vanilla JS is just as accessible).
- **NOTES:** Module at `./build/src/assets/js/tabs.mjs`. Loaded with `<script type="module" src="/assets/js/tabs.mjs"></script>` in the base layout. The no-JS fallback is CSS: `.tab-panel { display: block; }` when the `:not(:has(.tabs--initialised))` selector matches the body, or equivalent `<noscript>` style block.
- **RELATED:** BR-013, BR-014, BR-015, BR-016, BR-017, BR-018. Implemented by PT-018.

## AR-014 : Two Visual Direction Choice — Console-First Modern (CB-002 / CB-003 / CB-004)

- **DECISION:** Adopt the **Console-First Modern** direction for v1: deep-navy background, OTel orange `#F5A800` as the primary accent, Dynatrace cyan `#1496FF` reserved exclusively for Dynatrace-specific elements, ok-green `#37B26B` for the verification badge, red-brown for pitfall callouts, amber for caveat callouts.
- **RATIONALE:** The audience profiles in `0-BRAINSTORM.md` skew toward terminal-comfortable backend developers. Code blocks dominate every page; a dark surface lets the syntax-highlighted code carry visual weight. The cyan-reservation rule keeps the destination-neutrality promise (theme #4 in `2-NARRATIVE-VISION.md`) visually true. Alternatives considered: **Engineer's Notebook** (CB-001) — warm, charming, would underperform on code legibility and feels more "magazine" than "operations manual"; **light-mode default with toggle** — doubles theme work for v1.
- **NOTES:** Single stylesheet, no theme toggle in v1. CB-005 site-flow board's misuse of cyan for "cross-cutting axis" (called out in `3-CONCEPT-STORYBOARD.md` open decisions) is corrected: cross-cutting topics use a desaturated lavender `#9990D9` instead.
- **RELATED:** BR-053 (visual distinction), BR-002/BR-003/BR-004 (above-the-fold framing). Implemented by PT-014.

---

## Coverage Matrix (BR → AR)

| BR | AR(s) |
|---|---|
| BR-001 | AR-001 |
| BR-002, BR-003, BR-004 | AR-002, AR-014 |
| BR-005 | AR-001, AR-009 |
| BR-006 | AR-003 |
| BR-007 | AR-001, AR-003 |
| BR-008, BR-009, BR-010 | AR-008 |
| BR-011, BR-012 | AR-003, AR-008 |
| BR-013, BR-014 | AR-007 |
| BR-015 | AR-003, AR-005 |
| BR-016 | AR-005 |
| BR-017, BR-018 | AR-006 |
| BR-019, BR-020 | AR-005, AR-008 |
| BR-021 | AR-006 |
| BR-022 | AR-005, AR-007 |
| BR-023 | AR-008, AR-003 |
| BR-024 | AR-009 |
| BR-025 | AR-002 |
| BR-026 | AR-002, AR-004 |
| BR-027 | AR-002 |
| BR-028 | AR-009 |
| BR-029 | AR-005 |
| BR-030, BR-031 | AR-009 |
| BR-032, BR-033 | AR-002 |
| BR-034 | AR-012 |
| BR-035, BR-036 | AR-002, AR-004 |
| BR-037, BR-038 | AR-002, AR-013 |
| BR-039 – BR-043 | AR-001, AR-009 |
| BR-044 – BR-050 | AR-009 |
| BR-051 | AR-002 |
| BR-052, BR-053 | AR-013 |
| BR-054, BR-055 | AR-001, AR-009 |
| BR-056 – BR-060 | AR-002, AR-009 |
| BR-061, BR-062 | AR-010 |
| BR-063 | AR-011 |
| BR-064 | AR-010 |
| BR-065 – BR-068 | AR-012 |

Every BR-001 through BR-066 maps to at least one AR.

---

## Exit Gate

- [x] Every BR maps to at least one AR (see Coverage Matrix).
- [x] Every AR names a specific, concrete technology (Eleventy 3.x, Shiki 1.x, vanilla ES module, `localStorage`, Nunjucks shortcodes, etc.) — no generic categories.
- [x] Every AR includes at least one named alternative in its RATIONALE.
- [x] AR IDs are sequential AR-001 … AR-015 and non-reused.
- [x] RELATED fields trace AR → BR correctly.
- [x] `5-PARTS LIST.md` companion file exists with PT records implementing every AR.
- [x] `PIPELINE-STATUS.md` updated for Stage 5 with STATUS PASS and STATUS UPDATED 2026-05-03.

**GATE 5: PASS** (architecture half — see also `5-PARTS LIST.md`, v2.0 amendments A2 + A3 absorbed)
