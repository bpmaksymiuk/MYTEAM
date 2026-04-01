import { collectProvenance, isProvenanceStale } from './provenance-service.js';

export function aggregateDroneIntel(feedItems, filters, now = Date.now()) {
  const timeframeMs = filters.timeframeMinutes * 60 * 1000;
  const windowStart = now - timeframeMs;

  const filtered = feedItems.filter((item) => {
    if (item.category !== 'drone') return false;
    const ts = Date.parse(item.timestamp);
    if (ts < windowStart) return false;
    if (filters.type !== 'all' && (item.droneType || 'unknown') !== filters.type) return false;
    if (filters.region !== 'all' && item.location !== filters.region) return false;
    return true;
  });

  const byType = new Map();
  const byRegion = new Map();
  let totalQuantity = 0;

  filtered.forEach((item) => {
    const type = item.droneType || 'unknown';
    const region = item.location || 'unknown';
    const quantity = Number(item.quantity) || 1;

    totalQuantity += quantity;
    byType.set(type, (byType.get(type) || 0) + quantity);
    byRegion.set(region, (byRegion.get(region) || 0) + quantity);
  });

  return {
    totalQuantity,
    count: filtered.length,
    byType: [...byType.entries()].sort((a, b) => b[1] - a[1]),
    byRegion: [...byRegion.entries()].sort((a, b) => b[1] - a[1]),
    provenance: collectProvenance(filtered),
    stale: isProvenanceStale(filtered, now)
  };
}
