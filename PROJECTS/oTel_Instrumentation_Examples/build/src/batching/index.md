---
title: Batching
layout: layouts/topic.njk
summary: Buffer and flush spans efficiently with BatchSpanProcessor.
verifiedOn: '2026-04-22'
signalStability: stable
---

Batching trades per-span latency for throughput. Use `BatchSpanProcessor` in production and call `shutdown()` before process exit to guarantee a final flush. Configure your [OTLP destination](#){data-cfg-open}.

{% tabs "batching" %}

{% tab "js", "JavaScript" %}

```javascript
const { NodeSDK } = require('@opentelemetry/sdk-node');
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-http');
const { BatchSpanProcessor } = require('@opentelemetry/sdk-trace-node');

const sdk = new NodeSDK({
  spanProcessor: new BatchSpanProcessor(new OTLPTraceExporter(), {
    maxQueueSize: 2048,
    scheduledDelayMillis: 5000
  })
});

sdk.start();

process.on('SIGTERM', async () => {
  await sdk.shutdown();
  process.exit(0);
});
```

{% pitfall "Spans lost on process exit" %}
If your process exits without calling `sdk.shutdown()`, spans buffered in the `BatchSpanProcessor` queue will be dropped. Always hook `SIGTERM` and `SIGINT` to flush before exit.
{% endpitfall %}

{% endtab %}

{% tab "py", "Python" %}

```python
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor
from opentelemetry.exporter.otlp.proto.http.trace_exporter import OTLPSpanExporter

provider = TracerProvider()
provider.add_span_processor(BatchSpanProcessor(OTLPSpanExporter()))

import atexit
atexit.register(provider.shutdown)
```

{% pitfall "BatchSpanProcessor drops spans under high load" %}
The default `max_queue_size` is 2048. If spans are created faster than they can be exported, the queue fills and new spans are dropped. Monitor `otel.bsp.buffer.utilization` if your backend exposes it, and increase `max_queue_size` or reduce `schedule_delay_millis`.
{% endpitfall %}

{% endtab %}

{% tab "dotnet", ".NET" %}

```csharp
var tracerProvider = Sdk.CreateTracerProviderBuilder()
    .AddSource("MyCompany.MyApp")
    .AddOtlpExporter()
    .Build();

// Dispose triggers flush:
// tracerProvider.Dispose();
```

{% pitfall "No explicit BatchProcessor needed in .NET" %}
The `AddOtlpExporter()` in .NET uses `BatchExportProcessor` by default. You do not need to wire a batch processor manually; `Dispose()` on the provider triggers the final flush.
{% endpitfall %}

{% endtab %}

{% tab "java", "Java" %}

```java
SdkTracerProvider provider = SdkTracerProvider.builder()
    .addSpanProcessor(BatchSpanProcessor.builder(
        OtlpHttpSpanExporter.builder().build())
        .setMaxQueueSize(2048)
        .setScheduleDelay(Duration.ofSeconds(5))
        .build())
    .build();

Runtime.getRuntime().addShutdownHook(new Thread(provider::shutdown));
```

{% endtab %}

{% endtabs %}
