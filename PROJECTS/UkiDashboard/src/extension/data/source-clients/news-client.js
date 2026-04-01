const NEWS_SOURCES = [
  'Kyiv Wire',
  'Dnipro Desk',
  'Odessa Monitor'
];

const NEWS_TOPICS = [
  'Infrastructure',
  'Energy',
  'Aid',
  'Civil Defense',
  'Transport'
];

export function generateNewsItem(now = Date.now()) {
  const source = NEWS_SOURCES[Math.floor(Math.random() * NEWS_SOURCES.length)];
  const topic = NEWS_TOPICS[Math.floor(Math.random() * NEWS_TOPICS.length)];
  const region = ['Kyiv', 'Kharkiv', 'Lviv', 'Odesa', 'Dnipro'][Math.floor(Math.random() * 5)];

  return {
    sourceId: `news:${source}`,
    source,
    category: 'news',
    title: `${topic} update in ${region}`,
    body: `${source} reports ${topic.toLowerCase()} movement near ${region}.`,
    location: region,
    timestamp: new Date(now).toISOString()
  };
}
