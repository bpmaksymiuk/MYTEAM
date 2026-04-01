export function createPlaybackStore(initial = {}) {
  const state = {
    cursorTs: initial.cursorTs || Date.now(),
    rangeStartTs: initial.rangeStartTs || Date.now() - 60 * 60 * 1000,
    rangeEndTs: initial.rangeEndTs || Date.now(),
    speed: initial.speed || 1,
    paused: initial.paused ?? true
  };
  const listeners = new Set();

  function notify() {
    const snapshot = { ...state };
    listeners.forEach((listener) => listener(snapshot));
  }

  return {
    snapshot() {
      return { ...state };
    },
    update(partial) {
      Object.assign(state, partial);
      if (state.cursorTs < state.rangeStartTs) state.cursorTs = state.rangeStartTs;
      if (state.cursorTs > state.rangeEndTs) state.cursorTs = state.rangeEndTs;
      notify();
    },
    subscribe(listener) {
      listeners.add(listener);
      listener({ ...state });
      return () => listeners.delete(listener);
    }
  };
}
