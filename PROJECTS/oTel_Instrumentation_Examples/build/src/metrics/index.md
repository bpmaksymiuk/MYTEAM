---
title: Metrics
layout: layouts/topic.njk
summary: Counters, histograms, and gauges exported via OTLP.
verifiedOn: '2026-04-22'
signalStability: stable
---

Metrics capture numeric measurements over time. Use counters for rates, histograms for latency distributions, and gauges for current values. Configure your [OTLP destination](#){data-cfg-open} to route metrics exports.

{% tabs "metrics" %}

{% tab "js", "JavaScript" %}

```javascript
const { metrics } = require('@opentelemetry/api');
const meter = metrics.getMeter('my-service');

const requestCounter = meter.createCounter('http.server.requests', {
  description: 'Total HTTP requests received'
});

const latencyHistogram = meter.createHistogram('http.server.duration', {
  description: 'HTTP request duration in milliseconds',
  unit: 'ms'
});

// In your request handler:
requestCounter.add(1, { 'http.method': 'GET', 'http.route': '/api/orders' });
latencyHistogram.record(42, { 'http.method': 'GET' });
```

{% pitfall "Metrics not exported" %}
Metrics require a `MetricReader` (e.g. `PeriodicExportingMetricReader`) attached to your `MeterProvider`. The `NodeSDK` does not add one by default; pass it via `metricReader` option.
{% endpitfall %}

{% endtab %}

{% tab "py", "Python" %}

```python
from opentelemetry import metrics

meter = metrics.get_meter("my-service")

request_counter = meter.create_counter(
    "http.server.requests",
    description="Total HTTP requests received"
)

latency = meter.create_histogram(
    "http.server.duration",
    unit="ms",
    description="HTTP request duration"
)

request_counter.add(1, {"http.method": "GET"})
latency.record(42, {"http.method": "GET"})
```

{% pitfall "No MeterProvider set" %}
Call `metrics.set_meter_provider(provider)` with a `MeterProvider` that has an `PeriodicExportingMetricExporter` attached.
{% endpitfall %}

{% endtab %}

{% tab "dotnet", ".NET" %}

```csharp
using System.Diagnostics.Metrics;

static readonly Meter MyMeter = new("MyCompany.MyApp", "1.0");
static readonly Counter<long> RequestCount = MyMeter.CreateCounter<long>("http.server.requests");
static readonly Histogram<double> Latency = MyMeter.CreateHistogram<double>("http.server.duration", unit: "ms");

// In your request handler:
RequestCount.Add(1, new("http.method", "GET"));
Latency.Record(42, new("http.method", "GET"));
```

{% endtab %}

{% tab "java", "Java" %}

```java
import io.opentelemetry.api.metrics.LongCounter;
import io.opentelemetry.api.metrics.Meter;

Meter meter = openTelemetry.getMeter("my-service");

LongCounter requestCounter = meter.counterBuilder("http.server.requests")
    .setDescription("Total HTTP requests received")
    .build();

requestCounter.add(1, Attributes.of(AttributeKey.stringKey("http.method"), "GET"));
```

{% endtab %}

{% endtabs %}
