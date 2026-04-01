const SOURCE_BASE_CONFIDENCE = {
  'news:Kyiv Wire': 0.86,
  'news:Dnipro Desk': 0.78,
  'news:Odessa Monitor': 0.82,
  'events:Ops Bulletin': 0.88,
  'events:Civic Pulse': 0.74,
  'events:Field Grid': 0.8
};

export function confidenceForItem(item, now = Date.now()) {
  const base = SOURCE_BASE_CONFIDENCE[item.sourceId] ?? 0.65;
  const ageMs = Math.max(0, now - Date.parse(item.timestamp));
  const freshnessPenalty = Math.min(0.25, ageMs / 120000);
  const confidence = Math.max(0, Math.min(1, base - freshnessPenalty));
  return Number(confidence.toFixed(2));
}
