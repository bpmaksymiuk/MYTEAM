# Cross-cutting topic intros

## resource-attributes
**Resource attributes** describe the entity producing telemetry — the service, the host, the runtime version. The single most important one is `service.name`: backends use it as the primary axis for grouping spans, metrics, and logs. Set it via `OTEL_SERVICE_NAME` or via the `OTEL_RESOURCE_ATTRIBUTES` environment variable using `key=value` pairs.

## sampling
**Sampling** decides which spans actually get exported. The default sampler — `ParentBased(AlwaysOn)` — exports every root span and respects the parent's decision for child spans. In production, switch to `ParentBased(TraceIdRatio(0.1))` to keep 10 % of traces. Sampling decisions are made up-front, before any span attributes are known, so plan for it deliberately rather than as an afterthought.

## semantic-conventions-http
**Semantic conventions** are the agreed names for the things spans describe. Following them means your HTTP server spans look the same across every language. The HTTP conventions cover request method, route, status code, scheme, peer address, and user-agent. The full reference lives at https://opentelemetry.io/docs/specs/semconv/http/. Auto-instrumentation packages apply these conventions automatically.

## batching
**Batching** trades latency for throughput. The Batch span processor accumulates spans in memory and flushes them on a schedule or when a size threshold is reached. The Simple span processor exports each span synchronously. Use Batch in production. Use Simple only in short-lived scripts where you must guarantee export before the process exits — or call `tracerProvider.shutdown()` explicitly when using Batch.
