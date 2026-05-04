const { trace } = require('@opentelemetry/api');

const tracer = trace.getTracer('sample');
tracer.startActiveSpan('hello', span => {
  span.setAttribute('greeting', 'world');
  span.end();
});

setTimeout(() => process.exit(0), 1000);
