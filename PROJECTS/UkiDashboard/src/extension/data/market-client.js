const INDICATORS = [
  { key: 'uah_usd', label: 'UAH/USD', base: 39.1 },
  { key: 'grain_index', label: 'Grain Index', base: 112.4 },
  { key: 'energy_signal', label: 'Energy Signal', base: 86.0 }
];

function jitter(value) {
  const drift = (Math.random() - 0.5) * 1.4;
  return Number((value + drift).toFixed(2));
}

export function createMarketClient(onIndicatorPoint) {
  let running = false;
  let timer = null;
  const state = new Map(INDICATORS.map((item) => [item.key, item.base]));

  function emit() {
    if (!running) return;
    const now = Date.now();
    for (const indicator of INDICATORS) {
      const prev = state.get(indicator.key) ?? indicator.base;
      const next = jitter(prev);
      state.set(indicator.key, next);
      onIndicatorPoint({
        key: indicator.key,
        label: indicator.label,
        value: next,
        delta: Number((next - prev).toFixed(2)),
        timestamp: new Date(now).toISOString()
      });
    }
  }

  return {
    start() {
      if (running) return;
      running = true;
      emit();
      timer = setInterval(emit, 5000);
    },
    stop() {
      running = false;
      clearInterval(timer);
      timer = null;
    }
  };
}
