# Pitfall callouts — one per language quickstart

## javascript
**Title:** Endpoint returns 404
Your custom endpoint needs to point at the OTLP base URL, not the signal-specific path. The SDK appends `/v1/traces`, `/v1/metrics`, and `/v1/logs` itself. If you set `OTEL_EXPORTER_OTLP_ENDPOINT=http://collector:4318/v1/traces`, the SDK will request `/v1/traces/v1/traces` and the receiver will return 404.

## python
**Title:** ImportError on `opentelemetry.instrumentation.*`
You installed `opentelemetry-sdk` but not the autoinstrumentation extras. Install the specific package for the library you are tracing — for example `opentelemetry-instrumentation-flask` — or use `opentelemetry-distro` to pull common ones in one shot.

## dotnet
**Title:** No spans appear
You created an `ActivitySource` in your code, but the TracerProvider does not know about it. Add `.AddSource("YourActivitySourceName")` when you build the provider. The source name in the builder must exactly match the string you pass to `new ActivitySource(...)`.

## java
**Title:** Spans appear with no parent
Spans created inside an async boundary lost their context. Either use the OpenTelemetry Java agent (which propagates context through executors automatically) or wrap the work with `Context.current().wrap(runnable)` before submitting it.
