# .NET sample

Runnable companion to the [.NET Quickstart](../../src/dotnet/quickstart.md). The `Instrumentation.cs` file in this directory is byte-identical to the primary code block on the recipe page.

## Steps

1. Requires .NET 8 SDK or later.
2. `cd samples/dotnet`.
3. (Optional) Start a local OTLP receiver: `docker run -p 4318:4318 otel/opentelemetry-collector:latest`.
4. `OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4318 dotnet run`.
5. Alternative: for Dynatrace, set `OTEL_EXPORTER_OTLP_ENDPOINT` and `OTEL_EXPORTER_OTLP_HEADERS` per the configuration panel.
6. Expected output: one Activity exported via OTLP to your endpoint.

There is nothing to clean up.
