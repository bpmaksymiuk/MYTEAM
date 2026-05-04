plugins {
  application
  java
}

repositories { mavenCentral() }

dependencies {
  implementation(platform("io.opentelemetry:opentelemetry-bom:1.42.0"))
  implementation("io.opentelemetry:opentelemetry-api")
  implementation("io.opentelemetry:opentelemetry-sdk")
  implementation("io.opentelemetry:opentelemetry-exporter-otlp")
}

application {
  mainClass.set("App")
}

java {
  toolchain { languageVersion.set(JavaLanguageVersion.of(17)) }
}
