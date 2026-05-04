---
title: Sampling
layout: layouts/topic.njk
summary: Control trace volume to manage cost without losing critical signal.
verifiedOn: '2026-04-22'
signalStability: stable
---

Sampling keeps export costs predictable. Head-based samplers decide at span creation; tail-based sampling requires the OTel Collector (optional). Configure your [OTLP destination](#){data-cfg-open}.

{% tabs "sampling" %}

{% tab "js", "JavaScript" %}

```javascript
const { NodeSDK } = require('@opentelemetry/sdk-node');
const { TraceIdRatioBasedSampler } = require('@opentelemetry/sdk-trace-node');

const sdk = new NodeSDK({
  sampler: new TraceIdRatioBasedSampler(0.1) // 10% of traces
});

sdk.start();
```

{% pitfall "Sampled-out spans still processed" %}
`TraceIdRatioBasedSampler` makes the decision at span start. Spans that are sampled out have `SpanContext.isRemote = false` and are not exported, but they still flow through parent/child propagation. Use `ParentBased` to respect upstream decisions.
{% endpitfall %}

{% endtab %}

{% tab "py", "Python" %}

```python
from opentelemetry.sdk.trace.sampling import TraceIdRatioBased

sampler = TraceIdRatioBased(0.1)  # 10% of traces
provider = TracerProvider(sampler=sampler)
```

{% pitfall "Sampler ignores parent decisions" %}
Wrap with `ParentBased(root=TraceIdRatioBased(0.1))` to honour the upstream sampling flag when context is propagated across service boundaries.
{% endpitfall %}

{% endtab %}

{% tab "dotnet", ".NET" %}

```csharp
var tracerProvider = Sdk.CreateTracerProviderBuilder()
    .SetSampler(new TraceIdRatioBasedSampler(0.1))
    .AddOtlpExporter()
    .Build();
```

{% endtab %}

{% tab "java", "Java" %}

```java
SdkTracerProvider provider = SdkTracerProvider.builder()
    .setSampler(Sampler.traceIdRatioBased(0.1))
    .build();
```

{% pitfall "Use parentBased in distributed systems" %}
Without `Sampler.parentBased(Sampler.traceIdRatioBased(0.1))`, each service independently samples and you may export child spans without their parents.
{% endpitfall %}

{% endtab %}

{% endtabs %}
