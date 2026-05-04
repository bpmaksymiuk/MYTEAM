# 2 — Narrative Vision

**Product:** Performance Architecture OTel Cookbook
**Stage:** 2 — Narrative Vision (v2.0 — amendments A2 + A3 absorbed)
**Author:** Writer
**Status:** PASS | 2026-05-03

---

## OVERVIEW

The **Performance Architecture OTel Cookbook** is a curated, multilingual reference site that gives performance engineers, SREs, and developers ready-to-use OpenTelemetry instrumentation patterns across four languages: JavaScript, Python, .NET, and Java. The site is organised **topic-first** — primary navigation follows engineering concerns (Quickstart, Traces, Metrics, Logs, Auto-instrumentation, Resource Attributes, Sampling, Semantic Conventions for HTTP, Batching, Troubleshooting) rather than by language or SDK. Within each topic page, all four languages appear as a synchronised tab group so the reader resolves their language choice after understanding the concept. Running code locally is explicitly optional — the Cookbook is a read-and-copy reference first.

The product targets practitioners who already understand the basics of observability but need quick, accurate instrumentation patterns without wading through framework-heavy tutorials or installation ceremonies. It fills the gap between the official OpenTelemetry documentation — authoritative but often abstract — and framework-specific tutorials — concrete but narrow. Every recipe shows the minimum correct code for the engineering concern, in all four languages, with OTel Collector routing as an optional switch, not a prerequisite.

The product is destination-agnostic by design. OTLP is the transport; Dynatrace is one supported destination, configurable via a small in-page panel. A reader without Dynatrace sees clean examples using a direct OTLP endpoint or placeholder values. A reader with Dynatrace enters their tenant URL and token once; every code block renders pre-filled. No configuration data leaves the reader's browser.

---

## COMPETITIVE & CREATIVE RESEARCH

**MDN Web Docs** — gold standard for topic-per-page discipline. One concept per page; language/environment variations as within-page tabs or tables. Lesson: topic ownership is total — a topic page answers its question completely, and language tabs serve code variety, not structural division.

**Stripe API Documentation** — definitive model for language-tab code switching. Prose is language-agnostic and constant; only the code panel switches on tab selection. Readers understand the concept once, then pick their implementation. The Performance Architecture OTel Cookbook adopts this verbatim: explanation does not change per language; code blocks do.

**AWS Documentation** — cautionary example of service-first rather than task-first organisation, making it difficult to answer "how do I do X?" without knowing which service owns the answer. The Cookbook explicitly inverts this: the engineering concern (Sampling, Batching, Traces) is the entry point, not the SDK or runtime.

**OpenTelemetry Official Documentation** (opentelemetry.io) — comprehensive and authoritative; navigated by signal type and language simultaneously, creating a combinatorial lookup burden. The Cookbook treats it as upstream truth, curates from it, and links back — never restating the specification, always improving task-oriented access.

**Grafana Cloud Documentation** — demonstrates calibrated contextual prose: "Why this matters" callouts that add genuine engineering context (performance implication, pitfall, semconv rationale) without padding. Tone is direct and engineering-forward. Lesson: brief contextual prose alongside code reduces confusion without ceremony.

**Synthesis:** MDN's one-topic-per-page discipline + Stripe's language-tab code switching + task-first orientation (correcting the AWS pattern) + deference to OTel official docs as the specification authority + Grafana's calibrated contextual callout style.

---

## THEMES AND TONE

**1. Precision Without Intimidation** — technically exact (correct semconv attribute names, correct SDK method signatures, correct export configuration) but never uses complexity as a credibility signal. Every snippet is the minimum correct version. The voice is confident, not academic.

**2. Language Neutrality** — no opinion on which language is best. JavaScript, Python, .NET, and Java receive identical coverage, identical structure, identical quality of example. The tab is a selector, not a ranking. Prose is language-agnostic; code blocks carry the language-specific detail. When OTel behaviour genuinely differs by SDK, the difference is noted factually, not editorially.

**3. The Professional Reader** — competent engineer, possibly under time pressure, wanting the right answer without ceremony. The Cookbook respects that. It does not explain what a span is on every page. It does not apologise for being technical. It treats the reader as a professional colleague who arrived with a specific question and wants to leave with a specific answer.

**4. Read-First, Run-Later** — recipes are written to be understood by reading alone. A reader who never runs the code still understands what it does, why it is structured that way, and what to change for their environment. Architects and team leads evaluating OTel adoption are served equally with developers actively integrating.

**5. Signal Over Noise** — every element earns its place. No decorative prose, no extended analogies, no filler callouts. If a "Why this matters" note appears, it adds genuine context — a performance implication, a common pitfall, or a semantic convention rationale. Editorial density is calibrated for experienced engineers scanning at speed.

---

## WORLD-BUILDING / CONCEPTS

**The Cookbook Metaphor** — a cookbook is not a restaurant and not a cooking school. It is a reference object held in one hand while the other hand works. Each topic page is a recipe; each language tab is a regional variation of the same dish; the reader is always the chef. The Cookbook does not run the kitchen for you; it gives you the recipe.

**Topic-First Navigation** — the reader arrives with a question ("How do I configure head sampling?") not with a language already in mind. The Cookbook meets them at the question. Language is resolved after the concept is understood, not before it is found. The engineering concern — not the SDK — is the primary organising axis.

**Language as a Tab, Not a Section** — in a language-first architecture, adding a fifth language multiplies the navigation surface. In a topic-first, tab-based architecture, it adds one tab to each existing page. Language is a property of a code block, not a chapter. Every code block carries all four languages in a fixed order (JavaScript, Python, .NET, Java). The information architecture remains stable as the language set grows.

**Optional Execution** — the Cookbook does not require a running environment. This is a design choice that expands the audience beyond active integrators to architects evaluating OTel adoption, team leads writing ADRs, and developers reviewing options before writing a line of code. Code blocks are explanatory text first; executable artifacts second.

**The Export Target Panel as Once-and-Done** — defaults to direct SDK-to-endpoint (simplest, most portable, no additional infrastructure). OTel Collector routing is one click away for those who have one. The panel is a convenience, not a prerequisite. OTel Collector is optional infrastructure, not a required layer. Get the recipe first; configure the kitchen second.

---

## Exit Gate

- [x] OVERVIEW present (2–3 paragraphs, covers product, audience, value proposition).
- [x] COMPETITIVE & CREATIVE RESEARCH present (5 references with lessons drawn).
- [x] THEMES AND TONE present (5 named themes).
- [x] WORLD-BUILDING / CONCEPTS present (5 named concepts).
- [x] All content reflects Amendment A2 (topic-first IA, language tabs) and A3 (optional Collector, read-only reference, full topic coverage).
- [x] PIPELINE-STATUS.md updated for Stage 2.

**GATE 2: PASS**
