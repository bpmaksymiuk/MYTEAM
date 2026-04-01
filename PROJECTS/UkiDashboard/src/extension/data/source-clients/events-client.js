const EVENT_SOURCES = [
  'Ops Bulletin',
  'Civic Pulse',
  'Field Grid'
];

const EVENT_TYPES = [
  'Logistics event',
  'Defense event',
  'Relief event',
  'Signal event'
];

export function generateEventItem(now = Date.now()) {
  const source = EVENT_SOURCES[Math.floor(Math.random() * EVENT_SOURCES.length)];
  const eventType = EVENT_TYPES[Math.floor(Math.random() * EVENT_TYPES.length)];
  const region = ['Mykolaiv', 'Zaporizhzhia', 'Poltava', 'Chernihiv', 'Kherson'][Math.floor(Math.random() * 5)];

  return {
    sourceId: `events:${source}`,
    source,
    category: 'event',
    title: `${eventType} tagged in ${region}`,
    body: `${source} reports a ${eventType.toLowerCase()} for ${region}.`,
    location: region,
    timestamp: new Date(now).toISOString()
  };
}
