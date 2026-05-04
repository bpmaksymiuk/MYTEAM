---
title: Troubleshooting
layout: layouts/topic.njk
summary: Diagnose common OTLP export failures, authentication errors, and missing spans.
verifiedOn: '2026-04-22'
signalStability: stable
---

Symptoms grouped by cause. Configure your [OTLP destination](#){data-cfg-open} to verify your endpoint and credentials are correct.

{% tabs "troubleshooting" %}

{% tab "js", "JavaScript" %}

## No spans appear in backend

**Check:** Add `ConsoleSpanExporter` to see spans locally.

```javascript
const { SimpleSpanProcessor, ConsoleSpanExporter } = require('@opentelemetry/sdk-trace-node');
sdk = new NodeSDK({ spanProcessor: new SimpleSpanProcessor(new ConsoleSpanExporter()) });
```

If spans appear in the console but not your backend, the issue is the OTLP exporter configuration.

## 401 / 403 from OTLP endpoint

**Cause:** Missing or incorrect `Authorization` header.
**Fix:** Set `OTEL_EXPORTER_OTLP_HEADERS=Authorization=Api-Token YOUR_TOKEN`.

## 404 from OTLP endpoint

**Cause:** Endpoint includes the signal path (`/v1/traces`). The SDK appends it.
**Fix:** Set `OTEL_EXPORTER_OTLP_ENDPOINT` to the base URL only.

{% pitfall "HTTPS certificate errors" %}
If your OTLP endpoint uses a self-signed certificate, set `NODE_TLS_REJECT_UNAUTHORIZED=0` only in dev/test. In production, configure the correct CA certificate.
{% endpitfall %}

{% endtab %}

{% tab "py", "Python" %}

## No spans appear in backend

Enable SDK diagnostics:

```bash
OTEL_LOG_LEVEL=debug opentelemetry-instrument python app.py
```

## 401 / 403 from OTLP endpoint

```bash
export OTEL_EXPORTER_OTLP_HEADERS="Authorization=Api-Token YOUR_TOKEN"
```

## ImportError on startup

```bash
pip install opentelemetry-exporter-otlp-proto-http
```

{% pitfall "Version mismatch between SDK and exporters" %}
Pin `opentelemetry-sdk` and `opentelemetry-exporter-otlp-*` to the same minor version to avoid API incompatibilities.
{% endpitfall %}

{% endtab %}

{% tab "dotnet", ".NET" %}

## No spans appear in backend

Enable OTLP export logging:

```csharp
builder.Services.AddOpenTelemetry()
    .WithTracing(t => t
        .AddOtlpExporter(o => {
            o.Endpoint = new Uri("http://localhost:4318/v1/traces");
        }));
```

Check `dotnet-trace` or event listener for export errors.

## 401 / 403 from OTLP endpoint

Set the `Authorization` header:

```csharp
o.Headers = "Authorization=Api-Token YOUR_TOKEN";
```

{% pitfall "Endpoint must include /v1/traces in .NET" %}
The .NET OTLP exporter does NOT append the signal path by default when `OtlpExportProtocol.HttpProtobuf` is used. Specify the full path including `/v1/traces`.
{% endpitfall %}

{% endtab %}

{% tab "java", "Java" %}

## Enable exporter logging

```bash
-Dotel.logs.exporter=logging -Dotel.traces.exporter=logging,otlp
```

## 401 / 403 from OTLP endpoint

```bash
-Dotel.exporter.otlp.headers="Authorization=Api-Token YOUR_TOKEN"
```

## Spans lost under async load

Wrap runnables with context:

```java
Runnable wrapped = Context.current().wrap(myRunnable);
executor.submit(wrapped);
```

{% pitfall "Agent version vs SDK version conflicts" %}
When using the Java agent alongside manual SDK calls, use the same BOM version for both. Mixing agent and SDK versions causes `ClassCastException` in the context propagation layer.
{% endpitfall %}

{% endtab %}

{% endtabs %}
