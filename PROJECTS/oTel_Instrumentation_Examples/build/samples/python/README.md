# Python sample

Runnable companion to the [Python Quickstart](../../src/python/quickstart.md). The `instrumentation.py` file in this directory is byte-identical to the primary code block on the recipe page.

## Steps

1. Requires Python 3.9 or later.
2. `cd samples/python && pip install -r requirements.txt`.
3. (Optional) Start a local OTLP receiver: `docker run -p 4318:4318 otel/opentelemetry-collector:latest`.
4. `OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4318 python app.py`.
5. Alternative: for Dynatrace, set `OTEL_EXPORTER_OTLP_ENDPOINT` and `OTEL_EXPORTER_OTLP_HEADERS` per the configuration panel.
6. Expected output: one span emitted to your OTLP endpoint within a few seconds.

There is nothing to clean up.
