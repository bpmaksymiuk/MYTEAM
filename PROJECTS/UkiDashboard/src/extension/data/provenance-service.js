export function collectProvenance(items) {
  return items.map((item) => ({
    sourceId: item.sourceId,
    citationUrl: item.provenance?.citationUrl || '',
    collectedAt: item.provenance?.collectedAt || item.timestamp
  }));
}

export function isProvenanceStale(items, now = Date.now(), staleAfterMs = 12 * 60 * 1000) {
  if (!items.length) return true;
  const newest = Math.max(...items.map((item) => Date.parse(item.timestamp)));
  return now - newest > staleAfterMs;
}
