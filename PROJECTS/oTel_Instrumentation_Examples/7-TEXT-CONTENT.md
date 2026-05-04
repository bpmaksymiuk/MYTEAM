# 7 — TEXT CONTENT

- **STATUS:** PASS
- **STATUS UPDATED:** 2026-05-03
- **AUTHOR:** Writer
- **STAGE:** 7 (Text Content — v2.0, amendments A2 + A3 absorbed)
- **UPSTREAM:** `2-NARRATIVE-VISION.md` (v2.0), `6-DESIGN-INSTRUCTIONS.md` (v2.0)

> Final, approved text for every UI label, heading, body copy block, callout, and navigation element. Tone: precision without intimidation; language-neutral; professional; read-first. All text is written for immediate use in DI-017–DI-027 without further copyediting.

---

## TC-001 : Product Name and Tagline

| Element | Text |
|---------|------|
| Product name | Performance Architecture OTel Cookbook |
| Page `<title>` suffix | · OTel Cookbook |
| Topbar logo text | otel.cookbook |
| Home page `<h1>` | Performance Architecture OTel Cookbook |
| Home page tagline | A topic-first reference for instrumenting applications with OpenTelemetry. |

---

## TC-002 : Home Page Body Copy

```
A topic-first reference for instrumenting applications with **OpenTelemetry**.
Every code example exports via **OTLP** — to Dynatrace, a local Collector, or any
OTLP-compatible backend. Running code and running a Collector are both optional.
```

**Language strip caption:**
```
Every recipe shows JavaScript · Python · .NET · Java side-by-side.
```

**Optional-run notice:**
```
Running code and running a Collector are both optional — this site works as a read-only reference.
```

---

## TC-003 : Topic Hub Labels and One-Sentence Summaries

| Slug | Label | One-sentence summary |
|------|-------|---------------------|
| quickstart | Quickstart | Send your first trace to an OTLP endpoint in under ten minutes. |
| traces | Traces | Create, annotate, and export spans with or without auto-instrumentation. |
| metrics | Metrics | Emit counters, histograms, and gauges to an OTLP metrics endpoint. |
| logs | Logs | Export structured log records or bridge existing logging frameworks to OTel. |
| auto | Auto-instrumentation | Add zero-code instrumentation to an existing application. |
| resource-attributes | Resource Attributes | Attach service name, version, and deployment environment to every signal. |
| sampling | Sampling | Control trace volume with probability, parent-based, or custom samplers. |
| semantic-conventions-http | Semantic Conventions (HTTP) | Apply the standard attribute names for HTTP client and server spans. |
| batching | Batching | Choose and tune the right span processor for your throughput requirements. |
| troubleshooting | Troubleshooting | Diagnose missing spans, endpoint errors, and misconfigured environment variables. |

---

## TC-004 : Language Tab Labels

| `data-lang` | Tab label |
|-------------|-----------|
| js | JavaScript |
| python | Python |
| dotnet | .NET |
| java | Java |

Tab accessibility label (tooltip/aria-label if needed): `View {{ label }} code example`

---

## TC-005 : Export Target Configuration Panel

| Element | Text |
|---------|------|
| Panel heading | Export Target |
| Panel subtitle | Where should these code examples point? Saved to your browser only. |
| Preset 1 label | Direct OTLP (HTTP) — no Collector |
| Preset 1 note | Sends directly to any OTLP HTTP endpoint. Default. |
| Preset 2 label | Dynatrace |
| Preset 2 note | Dynatrace is one of several supported destinations. |
| Preset 3 label | Local OTel Collector *(optional)* |
| Preset 3 note | Running a Collector is optional — Direct OTLP is the default. |
| Endpoint field label | OTLP endpoint URL |
| Endpoint placeholder | http://localhost:4318 |
| Tenant URL field label | Dynatrace tenant URL |
| Tenant URL placeholder | https://your-tenant.live.dynatrace.com |
| API token field label | Dynatrace API token |
| API token placeholder | dt0c01.XXXXX… |
| Service name field label | Service name |
| Service name placeholder | my-service |
| Preview label | Live preview |
| Save button | Save |
| Clear button | Clear |
| Saved notice | Saved to browser — all code examples updated. |
| Storage note | Nothing leaves your browser. |

---

## TC-006 : Verification Badge

**Format:** `Verified YYYY-MM-DD · {package}@{version}`

**Example:** `Verified 2025-09-01 · @opentelemetry/sdk-node@1.25.1`

**Stale warning text:** `This verification is more than 12 months old — SDK versions may have changed.`

---

## TC-007 : Callout Copy Patterns

| Callout type | Heading prefix | Tone guidance |
|---|---|---|
| Pitfall | ⚠ | Imperative, concise. Max 3 sentences. Start with the failure mode, not the fix. |
| Caveat | ℹ | Neutral, informational. Name the limitation; do not apologise. |
| Stale warning | ⏱ | Factual. Link to release notes. |

**Standard pitfall openings (reference):**
- "If this environment variable is unset, …"
- "Always call `span.end()` in a `finally` block — …"
- "This sampler applies only to traces. Metrics and logs are unaffected."

---

## TC-008 : Navigation Copy

| Element | Text |
|---------|------|
| Nav `aria-label` | Topics |
| Nav section heading (screen reader only) | Browse by topic |
| Footer link to release notes | Release notes |
| Footer copyright note | OpenTelemetry is a CNCF project. |
| `aria-current="page"` tooltip | Current page |

---

## TC-009 : Quickstart Page Copy Fragments

**"What you will build" intro:**
```
You will configure the OpenTelemetry SDK, create a tracer, emit one span, and
export it to your chosen OTLP endpoint. No Collector required.
```

**"Configure your export target" instruction:**
```
Open the cfg panel (top-right) to set your OTLP endpoint and service name.
Every code block on this page will update automatically.
```

**Expected output label:** `Expected console output (if run):`

---

## TC-010 : Troubleshooting Page Copy Fragments

**Page intro:**
```
Symptoms are grouped by probable cause. Each entry links to the topic page
where the relevant configuration or code lives.
```

**Symptom: 4xx / 5xx from OTLP endpoint**
```
**Probable cause:** Wrong endpoint URL, missing or malformed `Authorization` header,
or the OTLP endpoint is not reachable.
**Check:** Confirm `OTEL_EXPORTER_OTLP_ENDPOINT` matches the address in your cfg panel.
For Dynatrace, verify the tenant URL and that the token has the *Ingest (logs, metrics, traces)* scope.
```

**Symptom: Spans not appearing**
```
**Probable cause:** SDK not initialised before the first span is created, or the
exporter has not flushed before the process exits.
**Check:** Call `provider.forceFlush()` before `process.exit()` in Node.js.
```

**Symptom: Missing parent-child span relationships**
```
**Probable cause:** Context not propagated across async boundaries.
**Check:** Use `context.with(trace.setSpan(context.active(), parentSpan), ...)` for manual propagation.
See the [Traces](/traces/) page.
```

**Symptom: Environment variable misconfiguration**
```
**Note:** `OTEL_EXPORTER_OTLP_ENDPOINT` sets the base URL for all signals.
`OTEL_EXPORTER_OTLP_TRACES_ENDPOINT` overrides it for traces only.
Signal-specific variables take precedence over the base variable.
```

---

## TC-011 : Glossary

| Term | Definition |
|------|-----------|
| OTLP | OpenTelemetry Protocol. The wire format and transport for telemetry data between an SDK and a backend or Collector. |
| Export Target | The OTLP endpoint (and optional headers) that the SDK sends data to. Configured in the Export Target panel. |
| Topic hub | A page in this cookbook covering one instrumentation concept (e.g. Traces, Metrics). Language is a tab dimension within the page. |
| Language tab | A tab within a code block group that shows the same concept implemented in one of four languages: JavaScript, Python, .NET, or Java. |
| OTel Collector | An optional OpenTelemetry Collector that receives, processes, and forwards telemetry. Not required to use this cookbook. |
| Span | The unit of trace data. Represents a timed operation with a name, attributes, and optional parent span. |
| Sampler | A component that decides whether to record and export a span. |
| Resource | A set of attributes (e.g. service.name) that apply to all telemetry from a process. |
| Semantic conventions | Standard attribute names defined by the OTel specification for common operations (e.g. HTTP, database). |

---

## TC-012 : Phrasebook (Preferred / Avoid)

| Preferred | Avoid |
|-----------|-------|
| OTLP endpoint | "backend", "receiver" |
| Export Target | "destination", "sink" |
| tab | "language tab", "language selector" (first use ok; thereafter just "tab") |
| four languages | "multi-language", "polyglot" |
| optional | "not mandatory", "you can also" |
| Collector | "OTel agent" (the agent is a separate Java thing) |
| Direct OTLP | "OTLP without Collector", "raw OTLP" |

---

## Exit Gate

- [x] All TC records are present: product name (TC-001), home copy (TC-002), topic labels (TC-003), tab labels (TC-004), cfg panel (TC-005), badge format (TC-006), callout patterns (TC-007), nav copy (TC-008), quickstart fragments (TC-009), troubleshooting fragments (TC-010), glossary (TC-011), phrasebook (TC-012).
- [x] All text reflects Amendment A2 (topic-first, language tabs) and A3 (optional Collector, read-only).
- [x] No text claims running code or a Collector is required.
- [x] Product name "Performance Architecture OTel Cookbook" is consistent throughout.
- [x] `PIPELINE-STATUS.md` updated for Stage 7.

**GATE 7: PASS**
