const seen = new Set();

function signature(item) {
  const minute = item.timestamp.slice(0, 16);
  return `${item.category}|${item.title}|${minute}`.toLowerCase();
}

export function dedupFeedItem(item) {
  const key = signature(item);
  if (seen.has(key)) {
    return { accepted: false, duplicateOf: key };
  }
  seen.add(key);
  return { accepted: true };
}

export function resetDedup() {
  seen.clear();
}
