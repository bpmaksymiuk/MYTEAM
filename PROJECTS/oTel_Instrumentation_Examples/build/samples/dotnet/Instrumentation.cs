using OpenTelemetry;
using OpenTelemetry.Trace;

var tracerProvider = Sdk.CreateTracerProviderBuilder()
    .AddSource("MyCompany.MyApp")
    .AddOtlpExporter()
    .Build();
