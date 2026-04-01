const DRONE_TYPES = ['shahed', 'recon', 'fpv', 'unknown'];
const DRONE_REGIONS = ['Kharkiv', 'Dnipro', 'Zaporizhzhia', 'Odesa', 'Mykolaiv'];
const DRONE_SOURCES = ['Sky Sentinel', 'Aegis Watch', 'Frontline Radar'];

export function generateDroneItem(now = Date.now()) {
  const type = DRONE_TYPES[Math.floor(Math.random() * DRONE_TYPES.length)];
  const region = DRONE_REGIONS[Math.floor(Math.random() * DRONE_REGIONS.length)];
  const source = DRONE_SOURCES[Math.floor(Math.random() * DRONE_SOURCES.length)];
  const quantity = Math.floor(Math.random() * 4) + 1;

  return {
    sourceId: `drone:${source}`,
    source,
    category: 'drone',
    droneType: type,
    quantity,
    title: `${type.toUpperCase()} drone activity in ${region}`,
    body: `${source} reports ${quantity} ${type} drone signals around ${region}.`,
    location: region,
    timestamp: new Date(now).toISOString(),
    provenance: {
      sourceId: `drone:${source}`,
      citationUrl: '',
      collectedAt: new Date(now).toISOString()
    }
  };
}
