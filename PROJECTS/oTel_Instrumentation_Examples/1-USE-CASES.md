> **Approved: 2026-05-03** — single source of approved intent for all downstream stages.
>
> Amendment 2026-05-03 (A1): Stakeholder feedback at Stage 1 made Dynatrace optional and configurable through a UI panel; recipes are destination-agnostic.
>
> Amendment 2026-05-03 (A2): (1) Product renamed to **Performance Architecture OTel Cookbook**. (2) Information architecture is reorganised to be **topic-first**: navigation, hubs, and recipes are grouped by *what you are doing* (Quickstart, Traces, Metrics, Logs, Auto-instrumentation, Resource Attributes, Sampling, Semantic Conventions, Batching, Troubleshooting), not by language. (3) Every code example on every topic page is presented as a **multi-language tab group** showing the same operation across JavaScript, Python, .NET, and Java side-by-side, so a reader can compare and copy the language they need without leaving the topic.
>
> Amendment 2026-05-03 (A3): The Cookbook is a **read-and-copy reference**, not a runnable lab. (1) Setting up an OTel Collector is **optional**: recipes show how to point at a Collector if the reader has one, but never require one. (2) Actually **running** any code shown is also optional: every recipe is complete, copy-pasteable, and instructive *as text* — readers do not need to install anything to learn from it. (3) Recipes' job is to show the **code** for setup, spans (traces), metrics, logs, auto-instrumentation, resource attributes, sampling, semantic conventions, batching, and troubleshooting — across all four languages.

# Approved Use Cases — Performance Architecture OTel Cookbook

Derived from `0-AN-IDEA.md` and informed (not constrained) by `0-BRAINSTORM.md`.

**Approved scoping (binding for all downstream stages):**

- **Product name:** Performance Architecture OTel Cookbook (referred to below as "the Cookbook").
- **Languages in scope:** JavaScript (Node.js), Python, .NET (modern .NET 8+), Java. All four are first-class citizens of every topic page.
- **Telemetry signals in scope:** Traces (required), metrics, and logs.
- **Backend in scope:** Generic OTLP HTTP. Dynatrace is one supported — but **optional** — destination, with Dynatrace-specific endpoint and headers configurable through a UI panel in the Cookbook itself rather than hard-coded into recipes.
- **Collector posture (per A3):** A standalone OpenTelemetry Collector is **optional**. Recipes show how to point at one if the reader runs one, but the default story sends OTLP straight from the SDK to the configured endpoint. The Cookbook does not ship, require, or instruct the reader to install a Collector.
- **Reader posture (per A3):** Reading is the primary use; running is optional. Recipes are designed to be valuable purely as reference text. Acceptance criteria that mention an outcome of "runs" or "emits" describe what the *code itself* does when executed by someone who chooses to run it — they do **not** require the reader to do so.
- **Topic coverage (per A3):** Every recipe topic must show the code for setup, traces, metrics, logs, auto-instrumentation, resource attributes, sampling, semantic conventions for HTTP, batching, and troubleshooting, in all four languages.
- **Instrumentation styles:** Both manual SDK use and zero-code/auto-instrumentation, presented within each topic as separate language-tabbed code blocks.
- **Information architecture:** Topic-first. The home page leads to topic hubs (Quickstart / First Trace, Traces, Metrics, Logs, Auto-instrumentation, Resource Attributes, Sampling, Semantic Conventions for HTTP, Batching, Troubleshooting). Per-language hubs are removed as primary navigation; language is selected at the **code-block level** via a tab control that is consistent across the entire site and remembers the reader's preferred language.
- **Deliverable form:** A static, browsable Markdown-based documentation site under `./build/` (technology choice deferred to Architect at Stage 5). The site includes a small client-side configuration panel that lets readers set their OTLP endpoint and (optionally) Dynatrace tenant + token; the site then renders all recipe code blocks and env-var blocks pre-filled with the chosen configuration. The site also includes a client-side **language-tab component** that synchronises tab selection across all code blocks on the current page and persists the reader's language preference locally.
- **Sample apps (per A3):** One minimal, *technically runnable* hello-world sample per language under `./build/samples/<language>/` is retained as a parity reference for the Quickstart tab. Running these samples is **not required** of the reader and is not part of any acceptance test or release recommendation; samples exist so the documented code can be kept honest by the sample-parity check.
- **Out of scope for v1:** End-to-end automated verification of telemetry being received in any backend; browser-side JS instrumentation; languages other than the four named; deep Collector pipeline tuning; server-side storage of any reader-entered tokens (configuration is local to the reader's browser only); **any acceptance criterion that requires the reader to run code or stand up a Collector**.

---

## UC-001 : Reader — Land on the Cookbook and Choose a Topic

- **GOAL:** A reader arriving at the Cookbook can identify, within seconds, that the site is organised by topic (not by language) and pick the topic they need.
- **STEPS:**
  1. Reader opens the Cookbook home page.
  2. Reader sees the Cookbook's name ("Performance Architecture OTel Cookbook") and its purpose (instrument code with OpenTelemetry, send telemetry to any OTLP destination including Dynatrace) stated in one short paragraph.
  3. Reader sees the topic hubs presented as the primary entry points: at minimum *Quickstart / First Trace*, *Traces*, *Metrics*, *Logs*, *Auto-instrumentation*, *Resource Attributes*, *Sampling*, *Semantic Conventions for HTTP*, *Batching*, *Troubleshooting*.
  4. Reader sees the four supported languages named once above the fold as a footnote-style line ("Every recipe shows JavaScript, Python, .NET, and Java side-by-side") rather than as separate navigation entries.
  5. Reader clicks a topic and lands on that topic's hub page.
- **ACCEPTANCE CRITERIA:**
  - AC1: The home page displays the product name "Performance Architecture OTel Cookbook" above the fold.
  - AC2: The home page lists topic hubs (not language hubs) as the primary entry points above the fold.
  - AC3: The home page names the four supported languages above the fold but does not present them as primary navigation.
  - AC4: The home page states OTLP as the transport above the fold and names Dynatrace as one supported destination among others (not the required one).
  - AC5: Each topic entry point links to a working topic hub page.
  - AC6: The home page links to the Configuration panel from UC-002.
- **NOTES:** Constraint — "above the fold" means visible without scrolling on a 1280×800 viewport. Caveat — this UC does not specify visual style; that is the Graphic Artist's domain.
- **RELATED:** UC-002, UC-003, UC-009.

## UC-002 : Reader — Configure the OTLP Destination Once via a UI Panel (Direct or via Optional Collector)

- **GOAL:** The reader optionally configures their OTLP destination (generic OTLP endpoint, Dynatrace tenant + API token, or a local Collector) in a single UI panel; the Cookbook then renders every code tab on every topic page with the reader's chosen values pre-filled. Configuring is optional — the recipes are useful as text without it.
- **STEPS:**
  1. Reader opens the Cookbook's Configuration panel (accessible from every page).
  2. Reader selects a destination preset: "Direct OTLP (HTTP) — no Collector", "Dynatrace", or "Local OTel Collector (optional, localhost:4318)".
  3. If "Dynatrace" is selected, the reader is prompted for their tenant URL and API token; the panel computes the canonical Dynatrace OTLP endpoint URL and required headers from these inputs.
  4. Reader saves the configuration; the panel persists it locally (browser storage only — nothing is sent to any server).
  5. From this point on, every code tab in every language on every topic page renders code snippets and env-var blocks with the reader's chosen endpoint, headers, and service name pre-filled.
  6. Reader can clear or change the configuration at any time from the same panel.
- **ACCEPTANCE CRITERIA:**
  - AC1: A Configuration panel exists and is reachable from every page.
  - AC2: The panel offers at least three destination presets: Direct OTLP (no Collector), Dynatrace, and Local OTel Collector. The Collector preset is clearly labelled **optional**.
  - AC3: When Dynatrace is selected, the panel accepts a tenant URL and API token and derives the canonical OTLP endpoint URL and headers automatically.
  - AC4: All language tabs in all code blocks reflect the reader's saved configuration on render; readers using the Direct OTLP preset see no Dynatrace-specific or Collector-specific values anywhere.
  - AC5: No reader-entered token or URL is transmitted off the reader's machine; persistence is local browser storage only.
  - AC6: A reader who does not configure anything still sees readable, copy-pasteable example values (placeholder endpoints and a clearly fake placeholder token) in every language tab; the Cookbook is fully usable as a read-only reference with no configuration entered.
  - AC7: The Collector preset includes a one-line explainer that running a Collector is optional and that the Direct OTLP preset is the default.
- **NOTES:** Constraint — tokens must never appear in URLs or telemetry; they are written into the `OTEL_EXPORTER_OTLP_HEADERS` value only. Constraint — the Dynatrace preset must show a one-line note explaining that Dynatrace is one of several supported destinations, not a requirement. Per A3 — neither a Collector nor any actual code execution is required to use this UC; it is purely a code-rendering convenience.
- **RELATED:** UC-003, UC-004, UC-005, UC-013.

## UC-003 : Reader — Read Any Code Recipe with Language Tabs (JS / Python / .NET / Java)

- **GOAL:** Every code example on every topic page is presented as a single tab group that shows the same operation in all four supported languages, so the reader can pick or compare languages without leaving the topic.
- **STEPS:**
  1. Reader is on a topic page (e.g. *Traces*, *Metrics*, *Logs*, *Auto-instrumentation*, *Resource Attributes*).
  2. Reader sees a code block with four language tabs labelled JavaScript, Python, .NET, Java in a consistent order across the site.
  3. Reader clicks a tab and the code block reveals that language's equivalent snippet.
  4. The reader's language choice is remembered: every other code block on the same page (and on subsequent pages) opens to the same language by default.
  5. Reader can switch tab at any time; selection is propagated to every code block on the page in one action.
- **ACCEPTANCE CRITERIA:**
  - AC1: Every code block on every topic page renders a tab group with exactly four tabs in the order JavaScript, Python, .NET, Java.
  - AC2: For any given code block, all four language tabs implement the same operation (same setup goal, same expected outcome) — they are language equivalents, not unrelated snippets.
  - AC3: Each tab declares the SDK package(s) and version it was verified against (per UC-012).
  - AC4: The tab control synchronises across all code blocks on the page: changing the active tab in one block changes it in every other code block on the same page.
  - AC5: The reader's preferred language tab is persisted to local browser storage and re-applied on every Cookbook page.
  - AC6: If the user has not chosen a language, the default tab is JavaScript.
  - AC7: When client-side scripting is unavailable, all four language snippets are still rendered (stacked or otherwise visible), so no content is hidden from non-JS readers.
- **NOTES:** Constraint — tab order and labelling must be identical across every page. Caveat — for a given code block, if a language genuinely cannot perform the same operation (rare), its tab must show a short "Not applicable in <language>" note plus a link to the closest equivalent, rather than be omitted.
- **RELATED:** UC-004, UC-005, UC-006, UC-007.

## UC-004 : Backend Developer — Read the First-Trace Quickstart Across All Four Languages (Running Optional)

- **GOAL:** A developer can read or copy the Quickstart recipe for their preferred language from the *Quickstart / First Trace* topic page and see the equivalent code for the other three languages on the same page. Running the snippet is optional; the recipe is complete and instructive purely as text.
- **STEPS:**
  1. Reader opens the *Quickstart / First Trace* topic page.
  2. Reader sees one tab group covering package install, SDK initialisation, env-var block, and minimal span emission, with JavaScript, Python, .NET, and Java tabs.
  3. Reader picks a language tab and reads or copies the steps (package coordinates, the four standard OTLP environment variables — values pre-filled by the Configuration panel, the snippet itself).
  4. Optionally, the reader pastes the snippet into a project of their own and runs it; if they do, they observe the documented expected output for that language. The Cookbook does not require this step.
- **ACCEPTANCE CRITERIA:**
  - AC1: A single Quickstart topic page exists; there are no separate per-language Quickstart pages as primary navigation.
  - AC2: The Quickstart code tab group lists, per tab: exact package coordinates (npm / pip / NuGet / Maven-Gradle), the SDK version verified against, a single copy-pasteable code block that *would* produce at least one span when run, and the expected console / log output if the reader chooses to run it.
  - AC3: Each tab declares a "Verified on YYYY-MM-DD against SDK vX.Y" badge.
  - AC4: The page links to the Configuration panel rather than restating destination-specific values in any tab.
  - AC5: Every tab is destination-agnostic in its prose: it never assumes Dynatrace is the destination or a Collector is present, but renders Dynatrace- or Collector-specific values when the reader has selected those presets.
  - AC6: The four tabs implement the same first-span operation; differences across tabs are language-mechanical (syntax, package names), not goal-level.
  - AC7: No acceptance criterion in this UC requires the reader (or Tester) to actually run the code or stand up a Collector. Verification is satisfied by the page rendering correctly with all required content present.
- **NOTES:** Constraint — Node.js for JavaScript (browser is out of scope); Python 3.9+; modern .NET 8+; Java 17+. Caveat — async/asyncio context propagation, Spring Boot specifics, etc. are referenced from the Quickstart but covered on their own topic pages.
- **RELATED:** UC-002, UC-003, UC-005, UC-013.

## UC-005 : Backend Developer — Choose Manual SDK or Auto-Instrumentation per Topic via Tabs

- **GOAL:** For each topic where both styles apply, the reader can switch between Manual SDK and Auto-instrumentation without leaving the topic page; both styles show all four languages in tabs.
- **STEPS:**
  1. Reader is on a topic page (e.g. *Traces* or *Auto-instrumentation*).
  2. Reader sees a clearly labelled control to choose between "Manual SDK" and "Auto-instrumentation" for that topic.
  3. The code tab group below the control updates to show the chosen style; the four language tabs are still present.
  4. A short callout lists pros and cons of the chosen style.
- **ACCEPTANCE CRITERIA:**
  - AC1: Every topic page where both styles apply exposes a Manual SDK / Auto-instrumentation toggle.
  - AC2: For each style and each language tab, the recipe states which approach it uses in its first sentence.
  - AC3: A short pros/cons callout exists for each style.
  - AC4: At least one of the two styles per language emits a verifiable span/metric/log when followed.
  - AC5: The auto-instrumentation tab for each language uses the language's officially supported zero-code mechanism (JS instrumentation packages, Python `opentelemetry-instrument`, .NET auto-instrumentation, Java agent JAR).
- **NOTES:** Constraint — toggle state may be remembered in local browser storage along with the language tab preference.
- **RELATED:** UC-003, UC-004.

## UC-006 : Backend Developer — Emit Metrics via the Metrics Topic (Tabbed Across Languages)

- **GOAL:** A reader who has traces working can extend their setup to emit metrics by following the *Metrics* topic page; the page shows the same metric-emission recipe across all four languages in tabs.
- **STEPS:**
  1. Reader opens the *Metrics* topic page.
  2. Reader picks their language tab.
  3. Reader follows the recipe to register a meter, record a counter, and observe metrics being exported to the configured OTLP destination.
- **ACCEPTANCE CRITERIA:**
  - AC1: A single *Metrics* topic page exists with one code tab group covering all four languages.
  - AC2: Each tab contains a copy-pasteable code block that *would* emit at least one counter to OTLP if executed; the reader is not required to run it.
  - AC3: Each tab declares the metrics SDK stability level it relies on at the time of verification (Stable / Development).
  - AC4: Tabs that depend on a signal still in Development carry a visible "stability caveat" callout.
  - AC5: The recipe is destination-agnostic and does not assume a Collector is present.
- **NOTES:** Constraint — tabs must follow OpenTelemetry semantic conventions for metrics naming. Per A3 — verification is by page content, not execution.
- **RELATED:** UC-003, UC-005.

## UC-007 : Backend Developer — Emit Logs via the Logs Topic (Tabbed Across Languages)

- **GOAL:** A reader can emit log records to OTLP by following the *Logs* topic page; the page shows the same log-emission recipe across all four languages in tabs.
- **STEPS:**
  1. Reader opens the *Logs* topic page.
  2. Reader picks their language tab.
  3. Reader follows the recipe to emit at least one log record over OTLP.
- **ACCEPTANCE CRITERIA:**
  - AC1: A single *Logs* topic page exists with one code tab group covering all four languages.
  - AC2: Each tab contains a copy-pasteable code block that *would* emit at least one log record to OTLP if executed; the reader is not required to run it.
  - AC3: Each tab declares the logs API stability level it relies on at the time of verification (Stable / Development).
  - AC4: Tabs that rely on the bridge / appender pattern (because the native logs API is still Development for that language) call this out explicitly in a callout.
  - AC5: The recipe is destination-agnostic and does not assume a Collector is present.
- **NOTES:** Constraint — same semantic-conventions and stability-callout rules as UC-006. Per A3 — verification is by page content, not execution.
- **RELATED:** UC-003, UC-005, UC-006.

## UC-008 : Reader — Find Cross-Cutting Topics that Apply Across Languages

- **GOAL:** A reader looking up a cross-cutting concern (resource attributes, sampling, semantic conventions for HTTP, batching, propagation) finds one canonical topic page for it; that page shows applicable code in all four languages via tabs.
- **STEPS:**
  1. Reader opens a cross-cutting topic page from the home or from the navigation index.
  2. Reader reads a single canonical explanation of the concept.
  3. Where code applies, reader sees a tab group with JavaScript, Python, .NET, and Java.
- **ACCEPTANCE CRITERIA:**
  - AC1: A cross-cutting topic page exists for at least: Resource Attributes, Sampling, Semantic Conventions for HTTP, Batching vs. Simple Span Processors.
  - AC2: Each cross-cutting topic page presents any code as a four-language tab group consistent with UC-003.
  - AC3: Each cross-cutting topic page references the official OpenTelemetry semantic conventions document where applicable.
- **NOTES:** Per A2, cross-cutting topics are no longer cross-references between language hubs — they are first-class topic hubs themselves.
- **RELATED:** UC-001, UC-003, UC-009.

## UC-009 : Reader — Find Any Recipe by Topic in One Click

- **GOAL:** Any reader can navigate to any topic in at most one click from the home page or from any other page.
- **STEPS:**
  1. Reader is on any page.
  2. Reader opens the persistent navigation index.
  3. Reader sees recipes grouped **by topic** (Quickstart, Traces, Metrics, Logs, Auto-instrumentation, Resource Attributes, Sampling, Semantic Conventions, Batching, Troubleshooting).
  4. Reader clicks a topic link and lands on it.
- **ACCEPTANCE CRITERIA:**
  - AC1: Every page exposes a navigation index that lists all topic pages.
  - AC2: The index groups recipes **by topic only**; per-language groupings are not part of the primary navigation.
  - AC3: From the home page, every topic page is reachable in exactly one click.
  - AC4: From any topic page, the home page and the navigation index are reachable in exactly one click.
  - AC5: The index works without JavaScript if the documentation engine permits.
- **NOTES:** Per A2, language is a within-page tab dimension (UC-003), not a navigation dimension.
- **RELATED:** UC-001, UC-003, UC-008.

## UC-010 : Reader — Diagnose a Failure with Inline Pitfalls and a Troubleshooting Topic

- **GOAL:** A reader whose recipe did not work can quickly identify the cause and the fix.
- **STEPS:**
  1. Reader runs a recipe in their language tab and sees an unexpected outcome.
  2. Reader scans the topic page for inline "Pitfall" callouts placed next to the step that typically causes that symptom; pitfalls may be language-specific or shared.
  3. If the symptom is not addressed inline, the reader opens the *Troubleshooting* topic, finds the symptom, and follows the linked fix.
- **ACCEPTANCE CRITERIA:**
  - AC1: Every Quickstart-style topic page contains at least one inline Pitfall callout.
  - AC2: A *Troubleshooting* topic page exists that lists symptoms grouped by cause.
  - AC3: The *Troubleshooting* topic covers at minimum: 4xx / 5xx from the OTLP endpoint, missing parent-child span relationships, spans not appearing at all, environment variable misconfiguration.
  - AC4: Each entry in the *Troubleshooting* topic links to the language tab(s) where a language-specific fix applies.
- **NOTES:** Constraint — Pitfall callouts must be visually distinct from regular prose.
- **RELATED:** UC-003, UC-004, UC-005.

## UC-011 : Reader — Trust That Each Tab Is Current and Has Been Verified

- **GOAL:** A reader can immediately tell whether a given language tab is current and which SDK version it was verified against.
- **STEPS:**
  1. Reader opens any topic page.
  2. Reader sees a verification badge on each language tab stating the verification date and the SDK version used.
  3. Reader optionally clicks through to a release notes / changelog entry that explains what changed in the most recent verification pass.
- **ACCEPTANCE CRITERIA:**
  - AC1: Every language tab in every code block carries a "Verified on YYYY-MM-DD against <package>@<version>" badge.
  - AC2: A central release notes file lists each verification pass with the date and the SDK versions exercised.
  - AC3: Tabs whose listed SDK version is more than 12 months out of date carry a visible "may be stale" warning at the tab level.
- **NOTES:** Caveat — actual automated re-verification of running telemetry is out of scope for v1. Badges reflect the date of the last manual review by the Developer / Tester at the time of release.
- **RELATED:** UC-003, UC-004.

## UC-012 : Maintainer — Keep Sample Files in Lockstep with Quickstart Tabs (Running Optional)

- **GOAL:** Per-language sample files exist as parity references for the Quickstart tab snippets so the documented code can be kept honest by an automated parity check. Actually running the samples is optional and not part of any release recommendation.
- **STEPS:**
  1. Maintainer opens `./build/samples/<language>/`.
  2. Maintainer reads (or, optionally, runs) the sample to confirm it matches the corresponding Quickstart language tab.
  3. The sample-parity check is run as part of the build and fails if any sample drifts from its documented Quickstart tab.
- **ACCEPTANCE CRITERIA:**
  - AC1: A sample application file exists at `./build/samples/javascript/`, `./build/samples/python/`, `./build/samples/dotnet/`, and `./build/samples/java/`.
  - AC2: Each sample has a short README; running instructions are provided but flagged as optional.
  - AC3: Each sample's main source file contains the exact instrumentation code shown in the corresponding Quickstart language tab (the existing sample-parity check applies per tab).
  - AC4: The sample-parity check passes as part of the build.
  - AC5: Running the samples is **not** required by any acceptance criterion or release-recommendation rule.
- **NOTES:** Per A3 — samples are kept as parity anchors, not as runnable smoke tests. Caveat — formal verification stays Tester-owned per pipeline rules.
- **RELATED:** UC-003, UC-004, UC-011, UC-013.

---

## UC-013 : Reader — Use the Cookbook as a Read-Only Reference Without Running Anything (per A3)

- **GOAL:** A reader who never installs an SDK, never runs a Collector, and never executes any code can still get full value from the Cookbook by reading and copying. The Cookbook covers, in this read-only mode, the code for: SDK setup, spans (traces), metrics, logs, auto-instrumentation, resource attributes, sampling, semantic conventions for HTTP, batching, and troubleshooting — across all four languages.
- **STEPS:**
  1. Reader opens the Cookbook with no Collector running and no SDK installed.
  2. Reader navigates topic-first; on every topic, the four-language tab group exposes the relevant code without prompting any setup action.
  3. Reader copies snippets into their own codebase at their own pace.
- **ACCEPTANCE CRITERIA:**
  - AC1: No topic page contains a step that requires the reader to run code, install an SDK, or start a Collector in order to get value from the page.
  - AC2: The site explicitly states, on the home page or in a sitewide note, that running code and running a Collector are both optional.
  - AC3: The full topic set is covered as code-only reference: setup, traces, metrics, logs, auto-instrumentation, resource attributes, sampling, semantic conventions for HTTP, batching, troubleshooting.
  - AC4: The Stage 10 release recommendation does not depend on any code being executed against a Collector or backend; it depends only on the rendered site meeting the acceptance criteria of the other UCs.
- **NOTES:** Per A3 — this UC is the operating mode for the v1 release. Other UCs that mention running code do so as optional convenience, not as a required path.
- **RELATED:** UC-001, UC-002, UC-003, UC-004, UC-005, UC-006, UC-007, UC-008, UC-010, UC-011, UC-012.

---

## Exit Gate

- [x] All UC records are schema-compliant.
- [x] Approval date header is present: `Approved: 2026-05-03` with Amendments A1, A2, and A3.
- [x] No UC has vague or unmeasurable acceptance criteria.
- [x] Every UC maps to at least one observable outcome.
- [x] This file is now the single source of approved intent for all downstream stages.
- [x] `PIPELINE-STATUS.md` is updated for Stage 1 with STATUS and STATUS UPDATED date and downstream stages flagged STALE pending Manager-routed re-run.

**GATE 1: PASS**
