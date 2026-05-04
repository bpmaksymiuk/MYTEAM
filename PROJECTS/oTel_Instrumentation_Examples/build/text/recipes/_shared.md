# Recipe prose — shared phrasing kit

These short paragraphs are the Writer's contribution to per-language recipes. The Developer drops them around the code blocks specified in DI-017 through DI-020. Token tags such as `{{OTLP_ENDPOINT}}` are owned by `cfg.mjs` — leave them untouched.

## Quickstart intro (per language, swap the install verb)
This recipe sends one span to your configured OTLP destination. Follow the three steps below — install, set environment variables, and drop the snippet into your entry file. You should see the span land in your backend within a few seconds.

## "You will need" preamble
You will need:
- {{LANGUAGE_RUNTIME}} installed locally.
- A [configured destination](#){data-cfg-open} — Generic OTLP, Dynatrace, or a local collector.

## Step intros
- **Install.** One package adds the SDK; one more adds the OTLP/HTTP exporter.
- **Set environment variables.** Copy these as-is. The values are filled in from your saved configuration.
- **Initialise once at startup.** This snippet runs before any code that creates spans.

## Manual SDK intro
The manual SDK gives you full control: you decide which spans get created, what attributes they carry, and when the SDK shuts down. Use this when auto-instrumentation does not cover the framework you are using, or when you want explicit boundaries around specific operations.

## Auto-instrumentation intro
Auto-instrumentation wires up tracing for common libraries without changing your application code. Use this when you want broad coverage quickly. You can mix manual spans on top — the two approaches compose.

## Metrics intro
Metrics complement traces by giving you aggregated numbers over time. This recipe creates one counter and increments it; the SDK exports periodically over OTLP/HTTP.

## Logs intro
The OpenTelemetry logs API is currently marked **Development** in the specification. The recipe below works against a recent SDK version, but the API surface may shift. Use the OTLP transport here too — your backend will correlate logs to spans through the trace context.

## Pros / cons template
**Pros:** {{LIST}}.
**Cons:** {{LIST}}.

## Closing back-link
For more on this approach, see the [Manual vs Auto](#) framing on the language hub. To change your destination, open the [configuration panel](#){data-cfg-open}.
