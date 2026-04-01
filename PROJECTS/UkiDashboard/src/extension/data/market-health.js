export function getMarketFreshness(lastUpdateMs, now = Date.now()) {
  if (!lastUpdateMs) return 'unavailable';
  const age = now - lastUpdateMs;
  if (age > 30000) return 'stale';
  if (age > 12000) return 'delayed';
  return 'live';
}
