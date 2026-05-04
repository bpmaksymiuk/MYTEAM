---
title: Logs
layout: layouts/topic.njk
summary: Structured log records correlated with traces via OTLP.
verifiedOn: '2026-04-22'
signalStability: stable
---

OTel Logs Bridge API connects your existing logger to OTel trace context, enabling log-trace correlation in your backend. Configure your [OTLP destination](#){data-cfg-open} to export log records.

{% tabs "logs" %}

{% tab "js", "JavaScript" %}

```javascript
const { logs } = require('@opentelemetry/api-logs');
const { SeverityNumber } = require('@opentelemetry/api-logs');

const logger = logs.getLogger('my-service');

logger.emit({
  severityNumber: SeverityNumber.INFO,
  severityText: 'INFO',
  body: 'Order processed successfully',
  attributes: { 'order.id': '12345' }
});
```

{% pitfall "Logs not correlated with traces" %}
Ensure logs are emitted from within an active span context. The OTel SDK automatically injects `trace_id` and `span_id` into log records when a span is active.
{% endpitfall %}

{% endtab %}

{% tab "py", "Python" %}

```python
import logging
from opentelemetry.instrumentation.logging import LoggingInstrumentor

LoggingInstrumentor().instrument(set_logging_format=True)

logger = logging.getLogger("my-service")
logger.info("Order processed", extra={"order.id": "12345"})
```

{% pitfall "Missing trace context in logs" %}
`LoggingInstrumentor` must be called after the `TracerProvider` is set. Call it during your application startup sequence, after OTel is initialised.
{% endpitfall %}

{% endtab %}

{% tab "dotnet", ".NET" %}

```csharp
using Microsoft.Extensions.Logging;

// In Program.cs, add OTel logging:
builder.Logging.AddOpenTelemetry(opts => {
    opts.AddOtlpExporter();
});

// Then use standard ILogger:
logger.LogInformation("Order processed {OrderId}", orderId);
```

{% endtab %}

{% tab "java", "Java" %}

```java
import io.opentelemetry.instrumentation.log4j.appender.v2_17.OpenTelemetryAppender;

// Add to log4j2.xml:
// <OpenTelemetry name="OpenTelemetryAppender"/>
// Then configure it at startup:
OpenTelemetryAppender.install(openTelemetry);

// Standard Log4j2 usage:
logger.info("Order processed, orderId={}", orderId);
```

{% endtab %}

{% endtabs %}
