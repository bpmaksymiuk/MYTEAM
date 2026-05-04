---
title: Quickstart
layout: layouts/topic.njk
summary: Send your first span in three steps — install, configure, run.
sampleSource: samples/javascript/instrumentation.js
verifiedOn: '2026-04-22'
signalStability: stable
---

This recipe sends one span to your configured OTLP destination. Configure your [destination](#){data-cfg-open} first — Direct OTLP (no Collector needed), Dynatrace, or a local OTel Collector.

{% tabs "quickstart" %}

{% tab "js", "JavaScript" %}

### Install

```bash
npm i @opentelemetry/sdk-node @opentelemetry/exporter-trace-otlp-http
```

### Environment variables

```bash
OTEL_EXPORTER_OTLP_ENDPOINT={{OTLP_ENDPOINT}}
OTEL_SERVICE_NAME={{SERVICE_NAME}}
OTEL_RESOURCE_ATTRIBUTES={{OTEL_RESOURCE_ATTRIBUTES}}
OTEL_EXPORTER_OTLP_HEADERS={{OTLP_HEADERS}}
```
{data-cfg-template="true"}

### Entry file

```javascript {data-primary}
const { NodeSDK } = require('@opentelemetry/sdk-node');
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-http');

const sdk = new NodeSDK({
  traceExporter: new OTLPTraceExporter()
});

sdk.start();

process.on('SIGTERM', () => {
  sdk.shutdown().finally(() => process.exit(0));
});
```

{% pitfall "Endpoint returns 404" %}
The SDK appends `/v1/traces` to your endpoint. Set `OTEL_EXPORTER_OTLP_ENDPOINT` to the base URL only, e.g. `http://localhost:4318`.
{% endpitfall %}

{% endtab %}

{% tab "py", "Python" %}

### Install

```bash
pip install opentelemetry-sdk opentelemetry-exporter-otlp-proto-http
```

### Environment variables

```bash
OTEL_EXPORTER_OTLP_ENDPOINT={{OTLP_ENDPOINT}}
OTEL_SERVICE_NAME={{SERVICE_NAME}}
OTEL_RESOURCE_ATTRIBUTES={{OTEL_RESOURCE_ATTRIBUTES}}
OTEL_EXPORTER_OTLP_HEADERS={{OTLP_HEADERS}}
```
{data-cfg-template="true"}

### Startup module

```python
from opentelemetry import trace
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor
from opentelemetry.exporter.otlp.proto.http.trace_exporter import OTLPSpanExporter

provider = TracerProvider()
provider.add_span_processor(BatchSpanProcessor(OTLPSpanExporter()))
trace.set_tracer_provider(provider)
```

{% pitfall "ImportError on opentelemetry.instrumentation.*" %}
Install the specific package for the library you are tracing, e.g. `opentelemetry-instrumentation-flask`.
{% endpitfall %}

{% endtab %}

{% tab "dotnet", ".NET" %}

### Install

```bash
dotnet add package OpenTelemetry.Exporter.OpenTelemetryProtocol
```

### Startup code

```csharp
using OpenTelemetry;
using OpenTelemetry.Trace;

var tracerProvider = Sdk.CreateTracerProviderBuilder()
    .AddSource("MyCompany.MyApp")
    .AddOtlpExporter()
    .Build();
```

{% pitfall "No spans appear" %}
Add `.AddSource("YourActivitySourceName")` when building the provider. The name must exactly match the string passed to `new ActivitySource(...)`.
{% endpitfall %}

{% endtab %}

{% tab "java", "Java" %}

### Maven dependency

```xml
<dependency>
  <groupId>io.opentelemetry</groupId>
  <artifactId>opentelemetry-bom</artifactId>
  <version>1.42.0</version>
  <type>pom</type>
  <scope>import</scope>
</dependency>
```

### Initialisation

```java
import io.opentelemetry.api.OpenTelemetry;
import io.opentelemetry.exporter.otlp.http.trace.OtlpHttpSpanExporter;
import io.opentelemetry.sdk.OpenTelemetrySdk;
import io.opentelemetry.sdk.trace.SdkTracerProvider;
import io.opentelemetry.sdk.trace.export.BatchSpanProcessor;

public final class Instrumentation {
  public static OpenTelemetry init() {
    SdkTracerProvider provider = SdkTracerProvider.builder()
        .addSpanProcessor(BatchSpanProcessor.builder(OtlpHttpSpanExporter.builder().build()).build())
        .build();
    return OpenTelemetrySdk.builder().setTracerProvider(provider).buildAndRegisterGlobal();
  }
}
```

{% pitfall "Spans appear with no parent" %}
Async boundaries lose span context. Use the OTel Java agent, or wrap work with `Context.current().wrap(runnable)` before submitting to an executor.
{% endpitfall %}

{% endtab %}

{% endtabs %}
