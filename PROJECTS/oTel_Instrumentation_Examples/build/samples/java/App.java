import io.opentelemetry.api.OpenTelemetry;
import io.opentelemetry.api.trace.Span;
import io.opentelemetry.api.trace.Tracer;

public final class App {
  public static void main(String[] args) {
    OpenTelemetry sdk = Instrumentation.init();
    Tracer tracer = sdk.getTracer("sample");
    Span span = tracer.spanBuilder("hello").startSpan();
    span.setAttribute("greeting", "world");
    span.end();
  }
}
