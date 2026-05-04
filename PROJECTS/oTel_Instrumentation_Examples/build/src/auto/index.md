---
title: Auto-instrumentation
layout: layouts/topic.njk
summary: Zero-code telemetry for common web frameworks and HTTP clients.
verifiedOn: '2026-04-22'
signalStability: stable
---

Auto-instrumentation patches popular libraries at startup with no code changes. Configure your [OTLP destination](#){data-cfg-open} and run.

{% tabs "auto" %}

{% tab "js", "JavaScript" %}

```bash
npm i @opentelemetry/auto-instrumentations-node
```

```javascript
// tracing.js — require this BEFORE your app code
const { NodeSDK } = require('@opentelemetry/sdk-node');
const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node');

const sdk = new NodeSDK({
  instrumentations: [getNodeAutoInstrumentations()]
});

sdk.start();
```

```bash
node -r ./tracing.js server.js
```

{% pitfall "http spans missing" %}
`getNodeAutoInstrumentations()` includes the `http` instrumentation. If you see no HTTP spans, ensure `tracing.js` is required before any `http` module usage — including transitive requires.
{% endpitfall %}

{% endtab %}

{% tab "py", "Python" %}

```bash
pip install opentelemetry-distro opentelemetry-exporter-otlp
opentelemetry-bootstrap --action=install
```

```bash
opentelemetry-instrument \
  --traces_exporter otlp \
  --service_name my-service \
  python server.py
```

{% pitfall "opentelemetry-bootstrap installs too many packages" %}
Bootstrap installs instrumentations for all installed packages it detects. Use a virtualenv per project to avoid cross-contamination.
{% endpitfall %}

{% endtab %}

{% tab "dotnet", ".NET" %}

```bash
dotnet add package OpenTelemetry.AutoInstrumentation
```

```bash
# Set env vars and run
OTEL_SERVICE_NAME=my-service \
OTEL_TRACES_EXPORTER=otlp \
dotnet run
```

{% pitfall "Instrumentation not active" %}
Auto-instrumentation for .NET requires the `CORECLR_ENABLE_PROFILING=1` environment variable when using the profiler-based approach. Check the OpenTelemetry .NET auto-instrumentation docs for your deployment target.
{% endpitfall %}

{% endtab %}

{% tab "java", "Java" %}

```bash
# Download the agent JAR
curl -L https://github.com/open-telemetry/opentelemetry-java-instrumentation/releases/latest/download/opentelemetry-javaagent.jar -o otel-agent.jar
```

```bash
java -javaagent:otel-agent.jar \
  -Dotel.service.name=my-service \
  -Dotel.traces.exporter=otlp \
  -jar myapp.jar
```

{% pitfall "Agent causes ClassCastException" %}
This happens when the agent's instrumented class loader conflicts with a framework's class loader. Check the agent GitHub issues for your specific framework version and try pinning to the latest agent release.
{% endpitfall %}

{% endtab %}

{% endtabs %}
