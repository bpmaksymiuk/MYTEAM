export function createSnapshotService(now = () => Date.now()) {
  function createSnapshot(state) {
    return {
      id: `snap-${Math.random().toString(36).slice(2, 10)}`,
      timestamp: new Date(now()).toISOString(),
      visualState: {
        statusText: state.statusText,
        statusMode: state.statusMode,
        kpis: { ...state.kpis }
      },
      filters: {
        minConfidence: state.minConfidence,
        activeRuleIds: [...state.activeRuleIds]
      },
      timeframe: {
        minutes: state.timeframeMinutes
      },
      selectedInsights: [...state.selectedInsights],
      feedPaused: Boolean(state.feedPaused)
    };
  }

  function applySnapshot(snapshot, currentState) {
    return {
      ...currentState,
      minConfidence: snapshot.filters.minConfidence,
      timeframeMinutes: snapshot.timeframe.minutes,
      selectedInsights: [...snapshot.selectedInsights],
      feedPaused: snapshot.feedPaused
    };
  }

  return {
    createSnapshot,
    applySnapshot
  };
}
