# Troubleshooting Index — symptom + cause sentences

## OTLP endpoint returns 4xx or 5xx

### 401 / 403
**Symptom:** Exporter logs `unauthenticated` or `permission denied`.
**Cause:** The `Authorization` header is missing, malformed, or the token lacks the required ingest scopes.

### 404
**Symptom:** Exporter logs `404 Not Found` from the OTLP endpoint.
**Cause:** Your endpoint URL already includes `/v1/traces` or `/v1/metrics` — the SDK appends those paths itself.

### 5xx
**Symptom:** Exporter logs `503 Service Unavailable` or repeated retries.
**Cause:** The OTLP receiver is down, overloaded, or unreachable from this network.

## Spans do not appear at all

### SDK never started
**Symptom:** No exporter logs at all, even at debug log level.
**Cause:** Your initialisation file was not loaded before the code that creates spans.

### Exporter shutdown not called
**Symptom:** Spans appear in dev but not in short-lived scripts.
**Cause:** The Batch processor was buffering spans when the process exited. Call the SDK's shutdown method.

### Batch processor flushed before spans accumulated
**Symptom:** Only some spans appear under load.
**Cause:** The Batch processor's queue is full and dropping spans. Increase `maxQueueSize` or reduce span volume.

## Parent-child span relationship missing

### Context propagation not set up
**Symptom:** Two services each have spans, but they do not link into one trace.
**Cause:** The receiving service is not extracting the trace context from incoming request headers.

### Manual span created outside an active context
**Symptom:** A manual span appears as a root, not as a child of the current operation.
**Cause:** You called `startSpan` instead of `startActiveSpan` (or the language equivalent), so the new span did not adopt the current context.

### Async boundary lost context
**Symptom:** Spans created inside a `setTimeout`, executor, or async task are orphans.
**Cause:** The runtime did not propagate context across the boundary. Use the auto-instrumentation context-propagating wrappers, or capture and rebind context manually.

## Environment variable misconfiguration

### Typo in env-var name
**Symptom:** SDK uses defaults instead of your configured values.
**Cause:** `OTEL_EXPORTER_OTLP_ENPOINT` (note the missing `D`) and similar typos are silently ignored.

### Value contains literal `{{...}}` placeholder
**Symptom:** Exporter logs show the literal string `{{OTLP_ENDPOINT}}`.
**Cause:** You copied a recipe before saving a configuration in the panel. Open the [configuration panel](#){data-cfg-open} and save once.

### Conflicting `OTEL_TRACES_EXPORTER`
**Symptom:** Spans go to a different destination than expected, or to the console only.
**Cause:** `OTEL_TRACES_EXPORTER` is set globally to `none` or `console`, overriding your OTLP exporter setup.
