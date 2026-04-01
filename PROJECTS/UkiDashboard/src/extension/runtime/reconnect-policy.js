export function createReconnectPolicy(config = {}) {
  const baseDelayMs = config.baseDelayMs ?? 1000;
  const maxDelayMs = config.maxDelayMs ?? 15000;
  const jitterRatio = config.jitterRatio ?? 0.2;

  const attempts = new Map();

  function nextDelay(sourceId) {
    const attempt = (attempts.get(sourceId) ?? 0) + 1;
    attempts.set(sourceId, attempt);

    const backoff = Math.min(maxDelayMs, baseDelayMs * 2 ** (attempt - 1));
    const jitter = backoff * jitterRatio * Math.random();
    return Math.round(backoff + jitter);
  }

  function reset(sourceId) {
    attempts.set(sourceId, 0);
  }

  return {
    nextDelay,
    reset
  };
}
