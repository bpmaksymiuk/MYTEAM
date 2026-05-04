# Brainstorm — OpenTelemetry Instrumentation Cookbook

- **STATUS:** In Progress
- **STATUS UPDATED:** 2026-05-03
- **AUTHOR:** Writer
- **SOURCE IDEA:** `0-AN-IDEA.md` — A multi-language (JavaScript, Python, .NET, Java) OpenTelemetry instrumentation cookbook with copy-pasteable setup, instrumentation, and Dynatrace export examples; navigable by language and topic; concise, practical, troubleshooting-aware; no end-to-end testing required.

---

## ELEVATOR PITCH

A friendly, fast, copy-and-go OpenTelemetry **cookbook** that turns the dry official spec pages into something you can actually use on a Monday morning. Pick your language, pick your task, copy the snippet, paste your Dynatrace token, and you are emitting traces, metrics, and logs into Dynatrace before your coffee is cold. It feels less like a manual and more like a well-loved, dog-eared recipe book left on the kitchen counter — every page begins with "you'll need…" and ends with "now try this".

## AUDIENCE & EMOTIONAL GOALS

- **The Time-Pressed Backend Developer (primary).** Has a service that needs traces in production today; doesn't want to read the OpenTelemetry spec; wants a working copy-paste recipe. **Emotion: relief and competence.**
- **The Polyglot Platform Engineer.** Owns five microservices in four languages; needs consistency across them. **Emotion: confidence and control.**
- **The Curious Newcomer to Observability.** Has heard "spans" and "traces" thrown around; needs a gentle ramp without dumbing things down. **Emotion: curiosity and aha-moments.**
- **The Dynatrace-Adopting SRE.** Has a Dynatrace tenant, has heard OTel is the future, and needs a clear bridge between the two. **Emotion: certainty — "this will plug straight in".**

## EXPERIENCE EXPLORATION

- **The first 30 seconds.** Reader lands on the homepage. A clean banner says **"OpenTelemetry → Dynatrace, in four languages, in five minutes"**. Below: four language tiles (JS, Python, .NET, Java) with a fifth tile saying "Dynatrace setup". Hovering a tile reveals "Quickstart · Traces · Metrics · Logs · Troubleshooting". One click, one scroll, code on screen.
- **The peak moment of joy.** The reader copies a complete code block, pastes their `DT_API_TOKEN` and `DT_TENANT_URL`, runs the app, refreshes the Dynatrace UI, and sees their first span appear. The cookbook offers a "Did it work?" callout right next to the snippet that shows exactly what they should see in Dynatrace, with a screenshot.
- **A surprising or memorable detail.** Each recipe includes a "Common pitfalls" sidebar in a warm, conversational voice — e.g. *"If you forgot the `/v1/traces` suffix, Dynatrace will return 404 silently. Yes, we have all done this."* Tone: empathetic, slightly funny, never condescending.
- **An optional ambient/idle behaviour.** A subtle "Last verified against OTel SDK vX.Y on YYYY-MM-DD" badge on every recipe so readers trust freshness. A persistent table-of-contents rail on the left that highlights where you are in the recipe.

## SCREEN & FLOW IDEAS

Six candidate surfaces. (Cookbook is delivered as a static documentation site — these are pages or panes.)

```
[Home] ──► [Language Hub] ──► [Recipe Page] ──► [Troubleshooting]
   │             │                  ▲
   │             ▼                  │
   ├──► [Dynatrace Setup] ──────────┤
   │                                │
   └──► [Cross-Cutting Topics] ─────┘
```

1. **Home.** Hero pitch, four language tiles, "Start with Dynatrace setup" CTA, latest verification badge, search bar.
2. **Language Hub** (one per language). A two-column layout: left = recipes index (Quickstart, Manual traces, Auto-instrumentation, Metrics, Logs, Context propagation, Troubleshooting); right = "What you need before you start" callout (SDK version, runtime, package manager).
3. **Recipe Page.** The atomic unit of the cookbook. Header with recipe title, "Time" estimate, and "Difficulty" stars. Body = numbered steps with code blocks, expected output blocks, and inline pitfalls. Footer = "Next recipe" suggestion + "Verified on" badge.
4. **Dynatrace Setup.** A single canonical page that every recipe links to. Generates the OTLP endpoint URL, explains where to find/create the API token, and shows the four required environment variables in one block. This page is referenced — never duplicated — by language recipes.
5. **Cross-Cutting Topics.** Topic-first pages (e.g. "Resource attributes", "Sampling", "Semantic conventions for HTTP", "Batching vs. simple processors") that link sideways into per-language recipes.
6. **Troubleshooting Index.** A flat searchable list of symptoms ("404 from OTLP endpoint", "spans missing parentage", "metrics show up but logs don't") each linking to fixes grouped by language.

Transitions: every recipe ends with two prominent next-action buttons — "Try the next recipe in this language" and "Send this same data type from another language". The Dynatrace Setup page links back contextually to whichever language brought the reader in.

## VISUAL DIRECTION

### Direction A — "Engineer's Notebook"

- **Descriptor.** Warm, paper-like, hand-annotated cookbook. Feels like a senior engineer's well-loved Moleskine — generous margins, occasional sketched arrows, conversational asides in the gutter.
- **References.**
  - The original *Joy of Cooking* layout (compact recipes, sidebars, generous numbered steps).
  - GitHub's old "Octocat" personality — friendly mascot in the margins.
  - Stripe API docs (clean two-column code/prose pairing).
- **Mood adjectives.** Warm, trusted, calm, practical, slightly playful.
- **Suggested palette.** Cream `#F8F4EC`, ink `#1B1A17`, accent ochre `#C58A3F`, sage `#6E8B5A`, signal red `#B6452C` (for "pitfall" callouts).
- **Typography.** Headings: a humanist serif like *Source Serif 4*. Body: a comfortable sans like *Inter* at 17px. Code: *JetBrains Mono* with mild ligatures.

### Direction B — "Console-First Modern"

- **Descriptor.** Clean, dark-by-default, terminal-aesthetic. Feels native to the command line and to modern observability dashboards.
- **References.**
  - The OpenTelemetry website itself (clean, slightly Material).
  - Dynatrace's own dark-mode app (deep navy + cyan accent).
  - Vercel and Tailwind documentation (high-contrast, snappy).
- **Mood adjectives.** Confident, modern, technical, fast, production-ready.
- **Suggested palette.** Background `#0B1020`, surface `#141A2E`, ink `#E6ECF5`, OTel-orange accent `#F5A800`, Dynatrace-cyan accent `#1496FF`, success green `#37B26B`, warning amber `#E0A030`.
- **Typography.** Headings: *Inter Tight* semibold. Body: *Inter* 16px. Code: *Fira Code* with ligatures.

> Both directions should be evaluated by the Graphic Artist at Stage 3. Direction A favours readability and emotional comfort; Direction B favours feeling native to the observability tooling the reader already uses.

## MOOD & ATMOSPHERE

If this cookbook had a soundtrack it would be a quiet jazz-piano playlist — competent, unhurried, thinking. The reading rhythm should feel like a kitchen at 3pm: the loud parts are the snippets you copy; the quiet parts are the explanations you appreciate but rarely re-read. Even though the product is silent text, the *cadence* matters: short headings, generous code blocks, callouts that breathe. Nothing should feel like a wall of YAML.

## UI & INTERACTION PRINCIPLES

1. **Every recipe is one scroll, one copy.** If a reader needs to context-switch to another page mid-recipe, the recipe is too long.
2. **Code blocks are the hero.** Prose exists to support the snippet, not surround it.
3. **Pitfalls live next to the cause.** Don't push problems to a separate troubleshooting page — annotate them inline where they happen.
4. **Dynatrace-specifics are abstracted to one page.** Endpoint URL, headers, tokens — defined once, referenced everywhere.
5. **Verification beats promises.** Every recipe shows expected output (terminal text or screenshot) so the reader knows when they have succeeded.
6. **No screen is a dead end.** Every page suggests a meaningful next move.

## METAPHORS & MENTAL MODELS

- **The Cookbook.** The dominant metaphor. Recipes, ingredients, steps, tasting notes (verification), substitutions (different SDK versions), and a chef's notes column (pitfalls).
- **The Wiring Diagram.** OpenTelemetry as plumbing: instrumentation = sensors, the SDK = pipes, the exporter = the spigot, Dynatrace = the reservoir. Useful for the conceptual intro pages.
- **The Phrasebook.** When travelling between languages, you want the same sentence in the local dialect. Cross-language sections frame the same concept (e.g. "create a span with attributes") in each language's idiom.
- **The Lighthouse.** Dynatrace as the destination beacon — every recipe ultimately points data toward it.

## "WHAT IF" PROVOCATIONS

1. **What if every recipe has a one-click "Open in StackBlitz/Codespace" button** that boots a working sandbox with the snippet preloaded? *(Ambitious — out of scope for v1 but a strong v2 candidate.)*
2. **What if the Dynatrace Setup page generates the user's actual env-var block** based on a tenant URL the reader pastes in? Pure client-side string-templating; no secrets stored.
3. **What if recipes are versioned per OTel SDK release**, with a small dropdown to switch between, say, JS SDK 1.x and 2.x?
4. **What if there's a "polyglot mode"** that stacks the same recipe in all four languages side-by-side in tabs, so platform engineers can compare?
5. **What if the cookbook ships a tiny CLI** — `otel-cookbook init python` — that scaffolds a working hello-world OTel project locally? *(Intentionally ambitious — flagged exploratory.)*
6. **What if "pitfall" callouts are crowdsourced** with a GitHub-issue template so readers can submit their own gotchas?
7. **What if every code block carries a hash of the verification run** (date, SDK version, Dynatrace API version) right under it?
8. **What if there's a printable "kitchen poster"** PDF that summarises the four-language Dynatrace export in one page?
9. **What if the cookbook has a "from zero to first span" guarantee** — a top-level promise that any reader following the Quickstart can see a span in Dynatrace within five minutes, with a refund (in jokes) if it takes longer? *(Intentionally playful — flagged exploratory.)*
10. **What if there's a "leave the kitchen tidy" final recipe per language** that covers graceful shutdown, flushing pending spans, and avoiding span loss on container exit?

## OPEN QUESTIONS FOR PRODUCT OWNER

1. **Delivery format.** Static documentation site (e.g. MkDocs/Docusaurus/Astro Starlight), a single long Markdown document, a printable PDF, or all three? This shapes Stage 5 architecture significantly.
2. **Languages in scope for v1.** The idea names JavaScript, Python, .NET, and Java. Does "JavaScript" mean Node.js only, or also browser? Does ".NET" mean modern .NET (6/8) only or also .NET Framework?
3. **Telemetry signals in scope.** Traces are clearly required; are metrics and logs in scope for v1, or staged later?
4. **Auto-instrumentation vs manual.** Should each language cover both zero-code (e.g. JS instrumentation packages, .NET auto-instrumentation, Java agent) and manual SDK use, or one path only?
5. **Dynatrace export style.** Direct OTLP API, OTel Collector, or Dynatrace OTel Collector? The reader needs at least the direct OTLP path, but should the cookbook also show the collector pattern?
6. **Hosting and update model.** Self-hosted in this repo, published to GitHub Pages, or somewhere else? How often are recipes re-verified?
7. **Sample applications.** Should each recipe be self-contained snippets only, or accompanied by a small runnable sample app in `./build/samples/<language>/`?
8. **Tone calibration.** Is the warm, slightly playful "engineer's notebook" voice acceptable, or does the audience expect a strictly formal corporate-doc voice?

## REFERENCES

Sources collected during this brainstorm.

- **OpenTelemetry official language status table.** Confirms stability of Java, .NET, Python, and JavaScript SDKs (all Stable for traces and metrics; logs Stable for Java/.NET, Development for JS/Python). <https://opentelemetry.io/docs/languages/>
- **OpenTelemetry zero-code instrumentation overview.** Confirms zero-code paths exist for JS, .NET, Python, and Java — relevant to the auto-vs-manual question above. <https://opentelemetry.io/docs/zero-code/>
- **Dynatrace OpenTelemetry ingest documentation.** Confirms three ingest paths: direct OTLP API, standard OTel Collector, and Dynatrace OTel Collector. Also documents the Dynatrace Semantic Dictionary that recipes should follow. <https://docs.dynatrace.com/docs/ingest-from/opentelemetry>
- **Dynatrace OTLP API endpoints and Getting Started.** Source of the canonical endpoint URL pattern and required headers; used to design the single canonical "Dynatrace Setup" page. <https://docs.dynatrace.com/docs/ingest-from/opentelemetry/getting-started>, <https://docs.dynatrace.com/docs/ingest-from/opentelemetry/otlp-api>
- **Diátaxis documentation framework** (Procida). Direct influence on the four-quadrant cookbook structure: tutorial-style Quickstart, how-to-style Recipe pages, reference-style cross-cutting topics, and explanation-style intro. <https://diataxis.fr/>
- **Divio Documentation System.** The earlier articulation of the same four-mode model; reinforces the recipe/reference split adopted here. <https://docs.divio.com/documentation-system/>

---

## Exit Gate

- [x] `0-AN-IDEA.md` exists and was read in full.
- [x] All required sections are present and non-empty.
- [x] At least two distinct VISUAL DIRECTIONs are explored (Engineer's Notebook + Console-First Modern).
- [x] At least one ambitious "What if" provocation is marked exploratory (#1, #5, #9).
- [x] At least three references with sources are cited (six cited).
- [x] OPEN QUESTIONS FOR PRODUCT OWNER lists at least three concrete questions (eight listed).
- [x] STATUS and STATUS UPDATED fields are present.
- [x] `PIPELINE-STATUS.md` is updated for Stage B with STATUS and STATUS UPDATED date.
- [x] X-Journal START and COMPLETE entries are appended for Stage B.
- [x] Gate result is explicitly stated as `GATE B: PASS` or `GATE B: FAIL`.

**GATE B: PASS**
