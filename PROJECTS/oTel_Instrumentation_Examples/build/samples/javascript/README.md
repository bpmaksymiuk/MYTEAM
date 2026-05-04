# JavaScript sample

Runnable companion to the [JavaScript Quickstart](../../src/javascript/quickstart.md). The `instrumentation.js` file in this directory is byte-identical to the primary code block on the recipe page — the build refuses to ship if they drift apart.

## Steps

1. Requires Node.js 20 or later.
2. `cd samples/javascript && npm install`.
3. (Optional) Start a local OTLP receiver: `docker run -p 4318:4318 otel/opentelemetry-collector:latest`.
4. `OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4318 npm start`.
5. Alternative: for Dynatrace, set `OTEL_EXPORTER_OTLP_ENDPOINT` and `OTEL_EXPORTER_OTLP_HEADERS` per the configuration panel on the website.
6. Expected output: one span line printed to stderr by the exporter, including the trace ID and span ID.

There is nothing to clean up. The sample exits after one span; no background process remains.
