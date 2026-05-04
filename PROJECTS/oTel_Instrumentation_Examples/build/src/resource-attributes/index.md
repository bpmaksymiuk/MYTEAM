---
title: Resource Attributes
layout: layouts/topic.njk
summary: Tag every signal with service name, environment, host, and more.
verifiedOn: '2026-04-22'
signalStability: stable
---

Resource attributes describe the entity producing telemetry — service name, deployment environment, host name. They appear on every span, metric, and log record. Configure your [OTLP destination](#){data-cfg-open}.

{% tabs "resource-attributes" %}

{% tab "js", "JavaScript" %}

```javascript
const { NodeSDK } = require('@opentelemetry/sdk-node');
const { Resource } = require('@opentelemetry/resources');
const { SemanticResourceAttributes } = require('@opentelemetry/semantic-conventions');

const sdk = new NodeSDK({
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: 'my-service',
    [SemanticResourceAttributes.DEPLOYMENT_ENVIRONMENT]: 'production',
    [SemanticResourceAttributes.SERVICE_VERSION]: '1.0.0'
  })
});

sdk.start();
```

{% pitfall "OTEL_RESOURCE_ATTRIBUTES overrides SDK resource" %}
Environment-variable resource attributes are merged with SDK-defined ones. If you set `OTEL_RESOURCE_ATTRIBUTES=service.name=…`, it takes precedence over the SDK `Resource` value for that key.
{% endpitfall %}

{% endtab %}

{% tab "py", "Python" %}

```python
from opentelemetry.sdk.resources import Resource
from opentelemetry.semconv.resource import ResourceAttributes

resource = Resource.create({
    ResourceAttributes.SERVICE_NAME: "my-service",
    ResourceAttributes.DEPLOYMENT_ENVIRONMENT: "production",
    ResourceAttributes.SERVICE_VERSION: "1.0.0"
})
provider = TracerProvider(resource=resource)
```

{% endtab %}

{% tab "dotnet", ".NET" %}

```csharp
var tracerProvider = Sdk.CreateTracerProviderBuilder()
    .ConfigureResource(resource => resource
        .AddService("my-service", serviceVersion: "1.0.0")
        .AddAttributes(new Dictionary<string, object> {
            ["deployment.environment"] = "production"
        }))
    .AddOtlpExporter()
    .Build();
```

{% endtab %}

{% tab "java", "Java" %}

```java
Resource resource = Resource.getDefault().merge(
    Resource.create(Attributes.of(
        ResourceAttributes.SERVICE_NAME, "my-service",
        ResourceAttributes.DEPLOYMENT_ENVIRONMENT, "production",
        ResourceAttributes.SERVICE_VERSION, "1.0.0"
    ))
);

SdkTracerProvider provider = SdkTracerProvider.builder()
    .setResource(resource)
    .build();
```

{% endtab %}

{% endtabs %}
