# Java sample

Runnable companion to the [Java Quickstart](../../src/java/quickstart.md). The `Instrumentation.java` file in this directory is byte-identical to the primary code block on the recipe page.

## Steps

1. Requires JDK 17 or later.
2. `cd samples/java`.
3. (Optional) Start a local OTLP receiver: `docker run -p 4318:4318 otel/opentelemetry-collector:latest`.
4. `OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4318 ./gradlew run`.
5. Alternative: download `opentelemetry-javaagent.jar` and run with `-javaagent:` for zero-code auto-instrumentation.
6. Expected output: one span exported via OTLP to your endpoint.

There is nothing to clean up.
