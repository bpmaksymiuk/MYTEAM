export function createDegradedModeController() {
  let active = false;
  let affected = new Set();

  function update(healthSnapshot) {
    const degraded = healthSnapshot.filter((entry) => entry.status === 'degraded' || entry.status === 'offline');
    active = degraded.length > 0;
    affected = new Set(degraded.map((entry) => entry.sourceId));
  }

  function state() {
    return {
      active,
      affectedSources: [...affected]
    };
  }

  return {
    update,
    state
  };
}
