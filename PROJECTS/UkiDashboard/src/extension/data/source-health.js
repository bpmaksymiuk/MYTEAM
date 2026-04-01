const state = new Map();

export function markSourceSuccess(sourceId) {
  state.set(sourceId, {
    sourceId,
    lastSuccessAt: Date.now(),
    failures: 0
  });
}

export function markSourceFailure(sourceId) {
  const prev = state.get(sourceId) || { sourceId, lastSuccessAt: 0, failures: 0 };
  state.set(sourceId, {
    ...prev,
    failures: prev.failures + 1
  });
}

export function getHealthSnapshot(now = Date.now()) {
  const snapshot = [];
  for (const info of state.values()) {
    const ageMs = info.lastSuccessAt ? now - info.lastSuccessAt : Number.POSITIVE_INFINITY;
    let status = 'online';
    if (ageMs > 30000) status = 'offline';
    else if (ageMs > 12000) status = 'degraded';
    else if (ageMs > 6000) status = 'delayed';

    snapshot.push({
      sourceId: info.sourceId,
      status,
      ageMs,
      lastSuccessAt: info.lastSuccessAt
    });
  }
  return snapshot.sort((a, b) => a.sourceId.localeCompare(b.sourceId));
}
