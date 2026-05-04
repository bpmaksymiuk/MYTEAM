---
title: Performance Architecture OTel Cookbook
layout: layouts/base.njk
eleventyExcludeFromCollections: true
---

# Performance Architecture OTel Cookbook

Concrete, copy-paste OTel recipes for JS, Python, .NET, and Java — each exportable to any OTLP endpoint.

Pick a topic to explore code examples in your language of choice.

<div class="topic-grid">
  <a class="topic-card" href="/quickstart/">
    <h2>Quickstart</h2>
    <p>Send your first span in three steps.</p>
  </a>
  <a class="topic-card" href="/traces/">
    <h2>Traces</h2>
    <p>Create and enrich spans manually.</p>
  </a>
  <a class="topic-card" href="/metrics/">
    <h2>Metrics</h2>
    <p>Counters, histograms, and gauges via OTLP.</p>
  </a>
  <a class="topic-card" href="/logs/">
    <h2>Logs</h2>
    <p>Structured log records correlated with traces.</p>
  </a>
  <a class="topic-card" href="/auto/">
    <h2>Auto-instrumentation</h2>
    <p>Zero-code telemetry for common frameworks.</p>
  </a>
  <a class="topic-card" href="/resource-attributes/">
    <h2>Resource Attributes</h2>
    <p>Tag every signal with service, env, and host.</p>
  </a>
  <a class="topic-card" href="/sampling/">
    <h2>Sampling</h2>
    <p>Keep costs down without losing signal.</p>
  </a>
  <a class="topic-card" href="/semantic-conventions-http/">
    <h2>Semantic Conventions (HTTP)</h2>
    <p>Standard span attribute names for HTTP.</p>
  </a>
  <a class="topic-card" href="/batching/">
    <h2>Batching</h2>
    <p>Buffer and flush spans efficiently.</p>
  </a>
  <a class="topic-card" href="/troubleshooting/">
    <h2>Troubleshooting</h2>
    <p>Diagnose common export and auth failures.</p>
  </a>
</div>

Configure your [OTLP destination](#){data-cfg-open} to fill in endpoint values in every code block.
