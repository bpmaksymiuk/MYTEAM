import io.opentelemetry.api.OpenTelemetry;
import io.opentelemetry.exporter.otlp.http.trace.OtlpHttpSpanExporter;
import io.opentelemetry.sdk.OpenTelemetrySdk;
import io.opentelemetry.sdk.trace.SdkTracerProvider;
import io.opentelemetry.sdk.trace.export.BatchSpanProcessor;

public final class Instrumentation {
  public static OpenTelemetry init() {
    SdkTracerProvider provider = SdkTracerProvider.builder()
        .addSpanProcessor(BatchSpanProcessor.builder(OtlpHttpSpanExporter.builder().build()).build())
        .build();
    return OpenTelemetrySdk.builder().setTracerProvider(provider).buildAndRegisterGlobal();
  }
}
