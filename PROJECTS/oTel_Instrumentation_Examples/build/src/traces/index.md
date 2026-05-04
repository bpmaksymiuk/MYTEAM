---
title: Traces
layout: layouts/topic.njk
summary: Create and enrich spans manually across JS, Python, .NET, and Java.
verifiedOn: '2026-04-22'
signalStability: stable
---

Manual tracing gives you control over span names, attributes, and events that auto-instrumentation cannot capture. Configure your [OTLP destination](#){data-cfg-open} before running the samples.

{% tabs "traces" %}

{% tab "js", "JavaScript" %}

```javascript
const { trace } = require('@opentelemetry/api');
const tracer = trace.getTracer('my-service');

async function processOrder(orderId) {
  const span = tracer.startSpan('processOrder');
  span.setAttribute('order.id', orderId);
  try {
    // business logic
    span.setStatus({ code: trace.SpanStatusCode.OK });
  } catch (err) {
    span.recordException(err);
    span.setStatus({ code: trace.SpanStatusCode.ERROR });
  } finally {
    span.end();
  }
}
```

{% pitfall "Span not exported" %}
Ensure your SDK is initialised (NodeSDK.start()) before calling `trace.getTracer()`. If the SDK has not started, the tracer returned is a no-op.
{% endpitfall %}

{% endtab %}

{% tab "py", "Python" %}

```python
from opentelemetry import trace

tracer = trace.get_tracer("my-service")

def process_order(order_id: str):
    with tracer.start_as_current_span("processOrder") as span:
        span.set_attribute("order.id", order_id)
        # business logic
```

{% pitfall "AttributeError on trace" %}
Call `trace.set_tracer_provider(provider)` during startup before using `trace.get_tracer()`.
{% endpitfall %}

{% endtab %}

{% tab "dotnet", ".NET" %}

```csharp
using System.Diagnostics;

static readonly ActivitySource Source = new("MyCompany.MyApp");

void ProcessOrder(string orderId)
{
    using var span = Source.StartActivity("ProcessOrder");
    span?.SetTag("order.id", orderId);
    // business logic
}
```

{% pitfall "ActivitySource not tracked" %}
The `ActivitySource` name must be registered with `.AddSource("MyCompany.MyApp")` on your `TracerProvider` builder.
{% endpitfall %}

{% endtab %}

{% tab "java", "Java" %}

```java
import io.opentelemetry.api.trace.Span;
import io.opentelemetry.api.trace.Tracer;

Tracer tracer = openTelemetry.getTracer("my-service");

void processOrder(String orderId) {
    Span span = tracer.spanBuilder("processOrder")
        .setAttribute("order.id", orderId)
        .startSpan();
    try (var scope = span.makeCurrent()) {
        // business logic
    } finally {
        span.end();
    }
}
```

{% endtab %}

{% endtabs %}
