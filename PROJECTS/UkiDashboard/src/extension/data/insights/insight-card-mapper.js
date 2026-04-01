export function mapInsightsToCards(patternResult) {
  if (patternResult.insufficientData) {
    return [{
      id: 'insight-insufficient-data',
      title: 'Insufficient data',
      summary: 'Pattern engine needs more recent cross-feed events.',
      confidence: 0,
      evidenceRefs: ['insights://insufficient-data']
    }];
  }

  return patternResult.findings.map((finding) => ({
    id: finding.id,
    title: finding.title,
    summary: finding.summary,
    confidence: finding.confidence,
    evidenceRefs: finding.evidence.map((item) => `feed://${item.sourceId}/${encodeURIComponent(item.title)}`)
  }));
}
