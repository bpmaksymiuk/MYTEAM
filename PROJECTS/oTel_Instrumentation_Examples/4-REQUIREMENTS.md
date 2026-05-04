# 4 — BUSINESS REQUIREMENTS

- **STATUS:** PASS
- **STATUS UPDATED:** 2026-05-03
- **AUTHOR:** Business Analyst
- **STAGE:** 4 (Business Requirements — v2.0, amendments A2 + A3 absorbed)
- **UPSTREAM:** `1-USE-CASES.md` (approved 2026-05-03 incl. A1, A2, A3)

> Atomic, testable, shall-language requirements derived from amended use cases UC-001 through UC-013 (A2 + A3 applied). All BRs are renumbered in this re-run. No implementation choices here — those belong to the Architect at Stage 5.

---

## Product Name and Home Page

### BR-001 — Product name on home page
The system shall display the product name "Performance Architecture OTel Cookbook" above the fold on the home page.
- **TESTABLE CONDITION:** Playwright: page heading or prominent text matching the product name is visible at 1280×800 without scrolling.
- **RELATED:** UC-001 AC1.

### BR-002 — Topic hubs are primary home-page navigation
The system shall list topic hubs (Quickstart, Traces, Metrics, Logs, Auto-instrumentation, Resource Attributes, Sampling, Semantic Conventions for HTTP, Batching, Troubleshooting) as the primary entry points above the fold.
- **TESTABLE CONDITION:** Home page at 1280×800 shows all ten topic labels without scrolling; no language name appears as a navigation tile.
- **RELATED:** UC-001 AC2, UC-009 AC2.

### BR-003 — Four languages named above fold (supporting caption, not navigation)
The system shall name the four supported languages (JavaScript, Python, .NET, Java) above the fold as a supporting caption, not as primary navigation items.
- **TESTABLE CONDITION:** All four language names appear on the home page at 1280×800; none is rendered as a clickable navigation tile separate from topic hubs.
- **RELATED:** UC-001 AC3.

### BR-004 — OTLP named above fold
The system shall state OTLP as the telemetry transport above the fold.
- **TESTABLE CONDITION:** The text "OTLP" appears on the home page at 1280×800 without scrolling.
- **RELATED:** UC-001 AC4.

### BR-005 — Dynatrace named as optional destination
The system shall name Dynatrace as one supported destination among others, not the required one, on the home page.
- **TESTABLE CONDITION:** "Dynatrace" appears on the home page; no text states Dynatrace is the only or required destination.
- **RELATED:** UC-001 AC4.

### BR-006 — Each topic tile links to a working topic page
The system shall link each topic tile on the home page to a working topic hub page.
- **TESTABLE CONDITION:** Clicking any topic tile results in a 200 response to a topic-specific URL with matching page content.
- **RELATED:** UC-001 AC5.

### BR-007 — Home page links to the Export Target panel
The system shall include a visible link or control on the home page that opens the Export Target configuration panel.
- **TESTABLE CONDITION:** A link or button labelled for configuration exists on the home page and opens the panel.
- **RELATED:** UC-001 AC6, UC-002 AC1.

---

## Navigation

### BR-008 — Every page exposes a navigation index
The system shall expose a navigation index listing all topic pages on every page of the site.
- **TESTABLE CONDITION:** Every page contains links to all ten topic pages.
- **RELATED:** UC-009 AC1.

### BR-009 — Navigation index groups by topic only
The system shall group the navigation index by topic; per-language groupings shall not appear as primary navigation sections.
- **TESTABLE CONDITION:** Navigation index contains no section labelled by language name as a top-level group.
- **RELATED:** UC-009 AC2.

### BR-010 — Every topic reachable in one click from home
The system shall make every topic page reachable in exactly one click from the home page.
- **TESTABLE CONDITION:** All ten topic links appear on the home page; no intermediate page is required.
- **RELATED:** UC-009 AC3.

### BR-011 — Home reachable in one click from any topic
The system shall make the home page reachable in exactly one click from any topic page.
- **TESTABLE CONDITION:** A link to the home page appears in the navigation or topbar of every topic page.
- **RELATED:** UC-009 AC4.

### BR-012 — Navigation works without JavaScript
The system shall render the navigation index without relying on client-side JavaScript.
- **TESTABLE CONDITION:** With JS disabled, all navigation links are present and functional.
- **RELATED:** UC-009 AC5.

---

## Language Tab Component

### BR-013 — Every code block renders a four-tab group
The system shall render every code block on every topic page as a tab group with exactly four tabs in the order JavaScript, Python, .NET, Java.
- **TESTABLE CONDITION:** Every code block on every topic page contains exactly four tabs labelled JavaScript, Python, .NET, Java in that order.
- **RELATED:** UC-003 AC1.

### BR-014 — Tabs implement the same operation
The system shall ensure that all four language tabs in any given code block implement the same operation with the same goal and expected outcome.
- **TESTABLE CONDITION:** Manual review: for any code block, the JavaScript and .NET tabs (for example) achieve the same instrumentation goal.
- **RELATED:** UC-003 AC2.

### BR-015 — Tab selection synchronises across all code blocks on a page
The system shall synchronise the active language tab across all code blocks on the current page such that changing the tab in one block changes it in all others.
- **TESTABLE CONDITION:** Clicking "Python" on one code block causes all other code blocks on the same page to switch to the Python tab.
- **RELATED:** UC-003 AC4.

### BR-016 — Language preference persists to browser storage
The system shall persist the reader's preferred language tab to local browser storage and re-apply it on every Cookbook page.
- **TESTABLE CONDITION:** Selecting "Java" on one page, navigating to another page, and loading that page shows the Java tab active by default.
- **RELATED:** UC-003 AC5.

### BR-017 — Default language tab is JavaScript
The system shall default to the JavaScript tab when no language preference is stored.
- **TESTABLE CONDITION:** On first load with no stored preference, the JavaScript tab is active.
- **RELATED:** UC-003 AC6.

### BR-018 — All language snippets render without JavaScript
The system shall render all four language snippets in a code block when client-side scripting is unavailable, so no content is hidden from non-JS readers.
- **TESTABLE CONDITION:** With JS disabled, all four code snippets for any block are visible in the page source and rendered.
- **RELATED:** UC-003 AC7.

### BR-019 — Each tab declares SDK version verified against
The system shall display the SDK package name and version that the tab's code was verified against, on or near each tab.
- **TESTABLE CONDITION:** A verification note of the form "pkg@version" or "Verified YYYY-MM-DD against pkg@version" appears in or adjacent to each language tab.
- **RELATED:** UC-003 AC3, UC-011 AC1.

---

## Export Target Configuration Panel

### BR-020 — Configuration panel exists and is reachable from every page
The system shall provide a configuration panel reachable from every page of the site.
- **TESTABLE CONDITION:** Every page contains a link or control that opens the configuration panel.
- **RELATED:** UC-002 AC1.

### BR-021 — Panel offers Direct OTLP, Dynatrace, and Local OTel Collector presets
The system shall offer at least three destination presets: Direct OTLP (default), Dynatrace, and Local OTel Collector (optional).
- **TESTABLE CONDITION:** The panel displays three selectable presets with these labels.
- **RELATED:** UC-002 AC2.

### BR-022 — OTel Collector preset is labelled optional
The system shall label the OTel Collector preset as optional.
- **TESTABLE CONDITION:** The OTel Collector preset card or radio option includes the word "optional".
- **RELATED:** UC-002 AC2, UC-002 AC7, UC-013 AC2.

### BR-023 — OTel Collector preset includes an explanatory note
The system shall include a one-line note in the OTel Collector preset stating that running a Collector is optional and that Direct OTLP is the default.
- **TESTABLE CONDITION:** The note text is visible when the OTel Collector preset is displayed.
- **RELATED:** UC-002 AC7.

### BR-024 — Dynatrace preset derives OTLP endpoint and headers
The system shall accept a tenant URL and API token in the Dynatrace preset and automatically derive the canonical OTLP endpoint URL and required headers.
- **TESTABLE CONDITION:** Entering a Dynatrace tenant URL and token causes the preview to show a valid OTLP endpoint URL and Authorization header.
- **RELATED:** UC-002 AC3.

### BR-025 — Code blocks reflect saved configuration
The system shall render all code blocks and env-var blocks with the reader's saved configuration values on page load.
- **TESTABLE CONDITION:** After saving a configuration, navigating to a topic page shows the saved endpoint and service name substituted into every code block.
- **RELATED:** UC-002 AC4.

### BR-026 — No token or URL is transmitted off the reader's machine
The system shall not transmit any reader-entered token or URL to any server; all persistence shall use local browser storage.
- **TESTABLE CONDITION:** Network traffic inspection shows no requests carrying configuration values to any external host.
- **RELATED:** UC-002 AC5.

### BR-027 — Unconfigured readers see readable placeholder values
The system shall display readable, copy-pasteable placeholder values in every language tab when no configuration has been entered.
- **TESTABLE CONDITION:** With no configuration saved, code blocks display placeholder endpoint URLs and a clearly fake token string.
- **RELATED:** UC-002 AC6.

### BR-028 — API tokens appear only in OTLP headers, not in URLs
The system shall write API tokens exclusively into the OTLP headers value (e.g. `Authorization: Api-Token …`), never into endpoint URLs.
- **TESTABLE CONDITION:** No code block or env-var block generated by the Dynatrace preset embeds the token in a URL.
- **RELATED:** UC-002 notes.

### BR-029 — Dynatrace preset includes destination-neutrality note
The system shall include a one-line note in the Dynatrace preset stating that Dynatrace is one of several supported destinations.
- **TESTABLE CONDITION:** The note is visible in the Dynatrace preset card.
- **RELATED:** UC-002 notes.

---

## Quickstart / First Trace Topic

### BR-030 — A single Quickstart topic page exists
The system shall provide a single Quickstart / First Trace topic page; no separate per-language Quickstart pages shall exist as primary navigation.
- **TESTABLE CONDITION:** Exactly one URL in the form /quickstart/ returns a 200 response; no /javascript/quickstart/ or equivalent exists as primary navigation.
- **RELATED:** UC-004 AC1.

### BR-031 — Quickstart tab group covers install, init, env-vars, and span emission
The system shall display on the Quickstart page a single code tab group with four language tabs covering package installation, SDK initialisation, OTLP environment variables, and a minimal span emission, in each tab.
- **TESTABLE CONDITION:** All four tabs contain sections covering dependencies, initialisation, env-var block, and a code block producing at least one span.
- **RELATED:** UC-004 AC2.

### BR-032 — Quickstart tabs list exact package coordinates
The system shall list exact package names and coordinates in each Quickstart tab (npm package name, pip package name, NuGet package name, Maven/Gradle artifact ID).
- **TESTABLE CONDITION:** Each Quickstart tab contains a package installation command with a specific named package.
- **RELATED:** UC-004 AC2.

### BR-033 — Quickstart tabs show expected output
The system shall include the expected console or log output for each Quickstart language tab, so readers can confirm correctness if they choose to run the code.
- **TESTABLE CONDITION:** Each Quickstart tab includes a code or text block labelled as expected output.
- **RELATED:** UC-004 AC2.

### BR-034 — Quickstart links to Export Target panel, not hardcoded values
The system shall link to the Export Target configuration panel from the Quickstart page rather than restating destination-specific values in prose.
- **TESTABLE CONDITION:** The Quickstart page contains no hardcoded endpoint URL in prose; it references the configuration panel for endpoint values.
- **RELATED:** UC-004 AC4.

### BR-035 — No Quickstart acceptance criterion requires running code
The system shall present all Quickstart content such that acceptance verification is satisfied by the page rendering correctly, without requiring any code to be executed.
- **TESTABLE CONDITION:** All Quickstart ACs can be verified by inspecting rendered page content without running the code snippets.
- **RELATED:** UC-004 AC7, UC-013 AC1.

---

## Manual / Auto-Instrumentation Style Toggle

### BR-036 — Topic pages expose a manual/auto style toggle where applicable
The system shall expose a Manual SDK / Auto-instrumentation style toggle on every topic page where both styles apply.
- **TESTABLE CONDITION:** The Traces topic page contains a segmented control or equivalent with "Manual SDK" and "Auto-instrumentation" options.
- **RELATED:** UC-005 AC1.

### BR-037 — Each style includes a pros/cons callout
The system shall display a short pros/cons callout for each instrumentation style.
- **TESTABLE CONDITION:** Both style sections on applicable topic pages contain a callout box with advantages and disadvantages of that style.
- **RELATED:** UC-005 AC3.

### BR-038 — Auto-instrumentation uses officially supported zero-code mechanism per language
The system shall use each language's officially supported zero-code instrumentation mechanism in the auto-instrumentation tab.
- **TESTABLE CONDITION:** JavaScript auto tab uses OTel JS instrumentation packages; Python uses opentelemetry-instrument; .NET uses auto-instrumentation; Java uses the agent JAR.
- **RELATED:** UC-005 AC5.

---

## Metrics Topic

### BR-039 — A single Metrics topic page exists
The system shall provide a single Metrics topic page with a four-language tab group.
- **TESTABLE CONDITION:** /metrics/ returns a 200 response and contains a four-tab language group.
- **RELATED:** UC-006 AC1.

### BR-040 — Each Metrics tab emits at least one counter
The system shall include in each Metrics language tab a copy-pasteable code block that would emit at least one counter to OTLP if executed.
- **TESTABLE CONDITION:** Each Metrics tab contains a code block referencing counter creation and recording.
- **RELATED:** UC-006 AC2.

### BR-041 — Metrics tabs declare signal stability level
The system shall declare the OTel metrics SDK stability level (Stable or Development) in each Metrics language tab.
- **TESTABLE CONDITION:** Each Metrics tab contains a "Stability: Stable" or "Stability: Development" label.
- **RELATED:** UC-006 AC3.

### BR-042 — Development-status Metrics tabs carry a stability callout
The system shall display a visible "stability caveat" callout in any Metrics tab that relies on a signal still in Development status.
- **TESTABLE CONDITION:** Any tab labelled Development contains a visually distinct callout noting the stability status.
- **RELATED:** UC-006 AC4.

---

## Logs Topic

### BR-043 — A single Logs topic page exists
The system shall provide a single Logs topic page with a four-language tab group.
- **TESTABLE CONDITION:** /logs/ returns a 200 response and contains a four-tab language group.
- **RELATED:** UC-007 AC1.

### BR-044 — Each Logs tab emits at least one log record
The system shall include in each Logs language tab a copy-pasteable code block that would emit at least one log record to OTLP if executed.
- **TESTABLE CONDITION:** Each Logs tab contains a code block referencing log record creation and emission.
- **RELATED:** UC-007 AC2.

### BR-045 — Logs tabs declare signal stability level
The system shall declare the OTel logs API stability level in each Logs language tab.
- **TESTABLE CONDITION:** Each Logs tab contains a stability label.
- **RELATED:** UC-007 AC3.

### BR-046 — Bridge/appender pattern tabs include an explicit callout
The system shall display an explicit callout in any Logs tab that uses a bridge or appender pattern rather than the native logs API.
- **TESTABLE CONDITION:** Any Logs tab using a bridge/appender contains a callout noting the pattern in use.
- **RELATED:** UC-007 AC4.

---

## Cross-Cutting Topics

### BR-047 — Cross-cutting topic pages exist for Resource Attributes, Sampling, Semantic Conventions for HTTP, Batching
The system shall provide a dedicated topic page for each of: Resource Attributes, Sampling, Semantic Conventions for HTTP, Batching vs. Simple Span Processors.
- **TESTABLE CONDITION:** /resource-attributes/, /sampling/, /semantic-conventions-http/, /batching/ each return a 200 response.
- **RELATED:** UC-008 AC1.

### BR-048 — Cross-cutting topic code blocks use four-language tab groups
The system shall present all code examples on cross-cutting topic pages as four-language tab groups consistent with BR-013 through BR-018.
- **TESTABLE CONDITION:** Every code block on cross-cutting topic pages has exactly four language tabs.
- **RELATED:** UC-008 AC2.

### BR-049 — Cross-cutting topics reference official OTel semantic conventions
The system shall include a reference to the official OpenTelemetry semantic conventions document on every topic page where semantic conventions apply.
- **TESTABLE CONDITION:** The Semantic Conventions for HTTP page and any other applicable page contains a link to opentelemetry.io semconv documentation.
- **RELATED:** UC-008 AC3.

---

## Troubleshooting Topic

### BR-050 — Troubleshooting topic page exists
The system shall provide a Troubleshooting topic page listing symptoms grouped by cause.
- **TESTABLE CONDITION:** /troubleshooting/ returns a 200 response and contains symptom headings.
- **RELATED:** UC-010 AC2.

### BR-051 — Troubleshooting covers four required symptoms
The system shall cover at minimum in the Troubleshooting topic: 4xx/5xx responses from the OTLP endpoint, missing parent-child span relationships, spans not appearing at all, and environment variable misconfiguration.
- **TESTABLE CONDITION:** The Troubleshooting page contains at least one entry for each of these four symptom classes.
- **RELATED:** UC-010 AC3.

### BR-052 — Troubleshooting entries link to language-specific fixes
The system shall link each Troubleshooting entry to the language tab where a language-specific fix applies.
- **TESTABLE CONDITION:** Troubleshooting entries that have language-specific fixes contain links to the relevant topic page and tab.
- **RELATED:** UC-010 AC4.

### BR-053 — Quickstart-style topic pages contain at least one inline Pitfall callout
The system shall include at least one inline Pitfall callout in every Quickstart-style topic page.
- **TESTABLE CONDITION:** The Quickstart page contains at least one element with a Pitfall label or equivalent visually distinct callout.
- **RELATED:** UC-010 AC1.

### BR-054 — Pitfall callouts are visually distinct from regular prose
The system shall render Pitfall callouts in a visual style distinct from regular body prose.
- **TESTABLE CONDITION:** Pitfall callouts use a different background colour, border, or icon than surrounding paragraph text.
- **RELATED:** UC-010 notes.

---

## Verification Badges

### BR-055 — Every language tab carries a verification badge
The system shall display a verification badge on every language tab in every code block.
- **TESTABLE CONDITION:** Every language tab contains a badge with a date and package reference.
- **RELATED:** UC-011 AC1.

### BR-056 — Verification badge follows canonical format
The system shall format verification badges as "Verified YYYY-MM-DD against pkg@version".
- **TESTABLE CONDITION:** Badge text matches the pattern `Verified [date] against [package]@[version]`.
- **RELATED:** UC-011 AC1.

### BR-057 — A release notes page lists every verification pass
The system shall provide a release notes page listing each verification pass with date and SDK versions exercised.
- **TESTABLE CONDITION:** /release-notes/ returns a 200 response and contains at least one verification pass entry.
- **RELATED:** UC-011 AC2.

### BR-058 — Stale tabs carry a warning
The system shall display a visible "may be stale" warning on any language tab whose listed SDK version is more than 12 months out of date.
- **TESTABLE CONDITION:** Any tab with a verification date more than 12 months prior to today contains a stale warning.
- **RELATED:** UC-011 AC3.

---

## Sample Parity

### BR-059 — Sample files exist for all four languages
The system shall include a sample file directory for each language: ./build/samples/javascript/, ./build/samples/python/, ./build/samples/dotnet/, ./build/samples/java/.
- **TESTABLE CONDITION:** All four sample directories exist and contain a main source file.
- **RELATED:** UC-012 AC1.

### BR-060 — Each sample's source code matches its Quickstart language tab
The system shall ensure each sample's main source file contains the same instrumentation code as shown in the corresponding Quickstart language tab.
- **TESTABLE CONDITION:** The sample-parity check script passes (exit 0) as part of the build.
- **RELATED:** UC-012 AC3.

### BR-061 — Sample-parity check runs as part of the build
The system shall run an automated sample-parity check during the build process and fail the build if any sample drifts from its Quickstart tab code.
- **TESTABLE CONDITION:** npm run build fails with a non-zero exit code if a sample file diverges from its Quickstart tab code.
- **RELATED:** UC-012 AC4, BR-060.

### BR-062 — Running samples is not required for any acceptance criterion
The system shall not require execution of any sample file to satisfy any acceptance criterion or release recommendation.
- **TESTABLE CONDITION:** All acceptance criteria in this file are verifiable by inspecting rendered page content or build outputs, without running sample code.
- **RELATED:** UC-012 AC5, UC-013.

---

## Read-Only Mode (per Amendment A3)

### BR-063 — No topic page requires code execution to get value
The system shall present every topic page such that the reader gains value from reading alone, without running any code or starting a Collector.
- **TESTABLE CONDITION:** No topic page contains instructional steps labelled as required that depend on a running environment.
- **RELATED:** UC-013 AC1.

### BR-064 — Site explicitly states running code and Collector are optional
The system shall state, on the home page or in a site-wide note, that running code and running a Collector are both optional.
- **TESTABLE CONDITION:** The home page or a prominent site-wide element contains text stating that running code is optional and a Collector is not required.
- **RELATED:** UC-013 AC2.

### BR-065 — Site covers all ten topic areas as code-only reference
The system shall cover the following topics as code-only reference pages: setup, traces, metrics, logs, auto-instrumentation, resource attributes, sampling, semantic conventions for HTTP, batching, troubleshooting.
- **TESTABLE CONDITION:** Each of the ten topic areas has a corresponding page that includes code examples for all four languages.
- **RELATED:** UC-013 AC3.

### BR-066 — Release recommendation does not depend on code execution
The system's test and release process shall not require any code to be executed against a Collector or backend; all release criteria shall be satisfiable by inspecting the rendered site.
- **TESTABLE CONDITION:** The Stage 10 exit gate criteria reference only rendered page content, build success, and sample-parity script, not execution of instrumented code.
- **RELATED:** UC-013 AC4.

---

## Traceability Summary

| Req Group | BRs | Source UCs |
|-----------|-----|-----------|
| Product name & home | BR-001 – BR-007 | UC-001 |
| Navigation | BR-008 – BR-012 | UC-009 |
| Language tabs | BR-013 – BR-019 | UC-003 |
| Export Target panel | BR-020 – BR-029 | UC-002 |
| Quickstart topic | BR-030 – BR-035 | UC-004 |
| Style toggle | BR-036 – BR-038 | UC-005 |
| Metrics topic | BR-039 – BR-042 | UC-006 |
| Logs topic | BR-043 – BR-046 | UC-007 |
| Cross-cutting topics | BR-047 – BR-049 | UC-008 |
| Troubleshooting topic | BR-050 – BR-054 | UC-010 |
| Verification badges | BR-055 – BR-058 | UC-011 |
| Sample parity | BR-059 – BR-062 | UC-012 |
| Read-only mode | BR-063 – BR-066 | UC-013 |

---

## Exit Gate

- [x] All BR records follow the schema (statement, TESTABLE CONDITION, RELATED).
- [x] Every BR uses "shall" language and is atomic.
- [x] Every BR is traceable to at least one UC from `1-USE-CASES.md`.
- [x] No BR specifies an implementation choice.
- [x] All UCs UC-001 through UC-013 are covered by at least one BR.
- [x] All content reflects amendments A2 and A3.
- [x] `PIPELINE-STATUS.md` updated for Stage 4.

**GATE 4: PASS**
