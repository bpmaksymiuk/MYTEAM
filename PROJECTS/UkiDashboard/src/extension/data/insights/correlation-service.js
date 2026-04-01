export function correlateFeeds(feedItems, now = Date.now()) {
  const oneHourAgo = now - 60 * 60 * 1000;
  const recent = feedItems.filter((item) => Date.parse(item.timestamp) >= oneHourAgo);
  const byRegion = new Map();

  recent.forEach((item) => {
    const region = item.location || 'unknown';
    const regionItems = byRegion.get(region) || [];
    regionItems.push(item);
    byRegion.set(region, regionItems);
  });

  const correlations = [];
  for (const [region, items] of byRegion.entries()) {
    const categories = new Set(items.map((item) => item.category));
    if (categories.size < 2) continue;

    correlations.push({
      region,
      categories: [...categories],
      volume: items.length,
      evidence: items.slice(0, 4)
    });
  }

  return correlations.sort((a, b) => b.volume - a.volume);
}
