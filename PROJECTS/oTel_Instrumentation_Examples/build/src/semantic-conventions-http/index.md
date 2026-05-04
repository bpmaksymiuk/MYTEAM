---
title: Semantic Conventions (HTTP)
layout: layouts/topic.njk
summary: Standard span attribute names for HTTP requests and responses.
verifiedOn: '2026-04-22'
signalStability: stable
---

Semantic conventions make spans queryable across services and languages. Use the standard names so your backend can correlate HTTP spans automatically. Configure your [OTLP destination](#){data-cfg-open}.

{% tabs "semconv-http" %}

{% tab "js", "JavaScript" %}

```javascript
const { SemanticAttributes } = require('@opentelemetry/semantic-conventions');

const span = tracer.startSpan('GET /api/orders');
span.setAttributes({
  [SemanticAttributes.HTTP_METHOD]: 'GET',
  [SemanticAttributes.HTTP_URL]: 'https://api.example.com/orders',
  [SemanticAttributes.HTTP_STATUS_CODE]: 200,
  [SemanticAttributes.NET_PEER_NAME]: 'api.example.com'
});
span.end();
```

{% pitfall "SemanticAttributes deprecated in 1.x" %}
`@opentelemetry/semantic-conventions` v1.x exports both stable and experimental constants. Prefer the `SEMATTRS_` prefix constants (e.g. `SEMATTRS_HTTP_REQUEST_METHOD`) for forward compatibility.
{% endpitfall %}

{% endtab %}

{% tab "py", "Python" %}

```python
from opentelemetry.semconv.trace import SpanAttributes

with tracer.start_as_current_span("GET /api/orders") as span:
    span.set_attribute(SpanAttributes.HTTP_METHOD, "GET")
    span.set_attribute(SpanAttributes.HTTP_URL, "https://api.example.com/orders")
    span.set_attribute(SpanAttributes.HTTP_STATUS_CODE, 200)
```

{% endtab %}

{% tab "dotnet", ".NET" %}

```csharp
using var span = Source.StartActivity("GET /api/orders");
span?.SetTag("http.method", "GET");
span?.SetTag("http.url", "https://api.example.com/orders");
span?.SetTag("http.status_code", 200);
```

{% pitfall "Use TagObjects for non-string values" %}
`SetTag(string, int)` is preferred over converting to string. Backends that understand OTLP will receive the correct type.
{% endpitfall %}

{% endtab %}

{% tab "java", "Java" %}

```java
import io.opentelemetry.semconv.trace.attributes.SemanticAttributes;

Span span = tracer.spanBuilder("GET /api/orders")
    .setAttribute(SemanticAttributes.HTTP_METHOD, "GET")
    .setAttribute(SemanticAttributes.HTTP_URL, "https://api.example.com/orders")
    .setAttribute(SemanticAttributes.HTTP_STATUS_CODE, 200L)
    .startSpan();
span.end();
```

{% endtab %}

{% endtabs %}
