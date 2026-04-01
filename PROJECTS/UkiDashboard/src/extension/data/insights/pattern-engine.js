import { correlateFeeds } from './correlation-service.js';

export function detectPatterns(feedItems, minConfidence = 0) {
  const pool = feedItems.filter((item) => item.confidence >= minConfidence);
  if (pool.length < 6) {
    return {
      insufficientData: true,
      findings: []
    };
  }

  const correlations = correlateFeeds(pool);
  const findings = correlations.slice(0, 3).map((entry, index) => ({
    id: `finding-${index + 1}-${entry.region}`,
    title: `Cross-feed anomaly in ${entry.region}`,
    summary: `${entry.volume} related signals across ${entry.categories.join(', ')}`,
    confidence: Math.min(0.95, 0.55 + entry.volume * 0.04),
    evidence: entry.evidence
  }));

  return {
    insufficientData: false,
    findings
  };
}
