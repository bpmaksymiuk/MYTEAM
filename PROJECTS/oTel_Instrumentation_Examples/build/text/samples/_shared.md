# Sample app README — shared lead and footer

## Lead paragraph (drop into each `samples/<lang>/README.md`)
This sample is the runnable companion to the {{LANGUAGE}} Quickstart recipe. The instrumentation file in this directory is byte-identical to the primary code block on the recipe page — the build refuses to ship if they drift apart.

## Default destination disclaimer
By default, the sample sends to `http://localhost:4318`. To send to Dynatrace or any other OTLP endpoint, set `OTEL_EXPORTER_OTLP_ENDPOINT` (and `OTEL_EXPORTER_OTLP_HEADERS` if your destination needs an auth header) before `npm start` / `python app.py` / `dotnet run` / `./gradlew run`.

## Expected output paragraph
You should see one span line written to stderr by the exporter. The line includes the trace ID and span ID — the same IDs that should appear in your backend within a few seconds.

## Cleanup paragraph
There is nothing to clean up. The sample exits after one span; no background process remains.
