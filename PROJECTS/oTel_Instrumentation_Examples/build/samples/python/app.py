import instrumentation  # noqa: F401
from opentelemetry import trace

tracer = trace.get_tracer('sample')
with tracer.start_as_current_span('hello') as span:
    span.set_attribute('greeting', 'world')
