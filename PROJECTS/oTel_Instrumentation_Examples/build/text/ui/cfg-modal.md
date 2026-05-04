# Configuration modal — UI strings

## Title
Configure your OTLP destination

## Subtitle
Pick a preset. Saved locally in your browser only — nothing leaves this page.

## Preset cards

### Generic OTLP
**Generic OTLP**
Send to any OTLP/HTTP receiver.

### Dynatrace
**Dynatrace**
Tenant URL + API token.
*Dynatrace is one of several supported destinations.*

### Local OTLP receiver
**Local OTLP receiver**
localhost:4318 — collector dev mode.

## Field labels and placeholders

| Field | Label | Placeholder | Helper |
|---|---|---|---|
| endpoint | OTLP endpoint | `http://localhost:4318` | The base URL of an OTLP/HTTP receiver. The `/v1/traces` suffix is appended by the SDK. |
| tenantUrl | Dynatrace tenant URL | `https://abc12345.live.dynatrace.com` | Your tenant's base URL. We append `/api/v2/otlp` automatically. |
| apiToken | Dynatrace API token | `dt0c01.…` | A token with the `openTelemetryTrace.ingest`, `metrics.ingest`, and `logs.ingest` scopes. |
| serviceName | Service name | `my-service` | Becomes `service.name` in your resource attributes. |

## Buttons
- **Save** — saves to your browser only.
- **Clear** — removes saved values; recipes render with placeholder tokens.
- **Close** — dismiss without saving.

## Preview heading
Preview · what every recipe will render

## Empty-state token notice
Until you save a configuration, recipes show literal `{{OTLP_ENDPOINT}}` tokens so it is obvious what hasn't been filled in.
