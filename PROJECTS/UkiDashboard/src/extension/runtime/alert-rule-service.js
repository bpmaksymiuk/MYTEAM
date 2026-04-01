export function createAlertRuleService(now = () => Date.now()) {
  function defaultRule() {
    const createdAt = new Date(now()).toISOString();
    return {
      id: `rule-${Math.random().toString(36).slice(2, 9)}`,
      name: 'High-confidence Events',
      category: 'event',
      minConfidence: 0.7,
      threshold: 2,
      windowMinutes: 30,
      cooldownMs: 5 * 60 * 1000,
      enabled: true,
      lastTriggeredAt: null,
      createdAt,
      updatedAt: createdAt
    };
  }

  function createRule(input) {
    const createdAt = new Date(now()).toISOString();
    return {
      id: input.id || `rule-${Math.random().toString(36).slice(2, 9)}`,
      name: input.name,
      category: input.category,
      minConfidence: Number(input.minConfidence),
      threshold: Number(input.threshold),
      windowMinutes: Number(input.windowMinutes),
      cooldownMs: Number(input.cooldownMs),
      enabled: Boolean(input.enabled),
      lastTriggeredAt: input.lastTriggeredAt || null,
      createdAt: input.createdAt || createdAt,
      updatedAt: createdAt
    };
  }

  function evaluateRules(rules, feedItems, latestItem) {
    const currentMs = now();
    const nextRules = rules.map((rule) => ({ ...rule }));
    const triggered = [];

    nextRules.forEach((rule) => {
      if (!rule.enabled) return;
      if (rule.category !== 'any' && rule.category !== latestItem.category) return;
      if (latestItem.confidence < rule.minConfidence) return;

      const windowStart = currentMs - rule.windowMinutes * 60 * 1000;
      const matches = feedItems.filter((item) => {
        const ts = Date.parse(item.timestamp);
        const categoryMatch = rule.category === 'any' || item.category === rule.category;
        return ts >= windowStart && categoryMatch && item.confidence >= rule.minConfidence;
      });

      if (matches.length < rule.threshold) return;

      if (rule.lastTriggeredAt) {
        const sinceLast = currentMs - Date.parse(rule.lastTriggeredAt);
        if (sinceLast < rule.cooldownMs) return;
      }

      const timestamp = new Date(currentMs).toISOString();
      rule.lastTriggeredAt = timestamp;
      rule.updatedAt = timestamp;
      triggered.push({
        id: `alert-${Math.random().toString(36).slice(2, 10)}`,
        ruleId: rule.id,
        ruleName: rule.name,
        reason: `${matches.length} ${rule.category === 'any' ? 'items' : rule.category + ' items'} met threshold ${rule.threshold} in ${rule.windowMinutes}m`,
        timestamp,
        evidenceLinks: matches.slice(0, 3).map((item) => `feed://${item.sourceId}/${encodeURIComponent(item.title)}`),
        state: 'new',
        snoozeUntil: null
      });
    });

    return { nextRules, triggered };
  }

  function transitionAlert(alert, action, actionMs = now()) {
    const timestamp = new Date(actionMs).toISOString();
    if (action === 'ack') {
      return { ...alert, state: 'acknowledged', updatedAt: timestamp };
    }
    if (action === 'snooze') {
      return {
        ...alert,
        state: 'snoozed',
        snoozeUntil: new Date(actionMs + 5 * 60 * 1000).toISOString(),
        updatedAt: timestamp
      };
    }
    if (action === 'escalate') {
      return { ...alert, state: 'escalated', updatedAt: timestamp };
    }
    return alert;
  }

  return {
    defaultRule,
    createRule,
    evaluateRules,
    transitionAlert
  };
}
