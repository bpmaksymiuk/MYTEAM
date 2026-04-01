import { createFeedOrchestrator } from './data/feed-orchestrator.js';
import { dedupFeedItem } from './data/dedup-engine.js';
import { markSourceFailure, markSourceSuccess, getHealthSnapshot } from './data/source-health.js';
import { confidenceForItem } from './data/confidence.js';
import { createDegradedModeController } from './runtime/degraded-mode-controller.js';
import { createMarketClient } from './data/market-client.js';
import { getMarketFreshness } from './data/market-health.js';
import { createAlertRuleService } from './runtime/alert-rule-service.js';
import { createSnapshotService } from './runtime/snapshot-service.js';
import { aggregateDroneIntel } from './data/drone-aggregator.js';
import { detectPatterns } from './data/insights/pattern-engine.js';
import { mapInsightsToCards } from './data/insights/insight-card-mapper.js';
import { createPlaybackStore } from './runtime/playback-store.js';
import { applyThemeConfig } from './runtime/theme-engine.js';
import { defaultLayout, normalizeLayout, reorderLayout } from './runtime/layout-engine.js';
import { createLayoutProfileManager } from './runtime/layout-profile-manager.js';

const statusEl = document.getElementById('status');
const feedListEl = document.getElementById('feed-list');
const sourceListEl = document.getElementById('source-health-list');
const alertsListEl = document.getElementById('alerts-list');
const ruleListEl = document.getElementById('rule-list');
const snapshotListEl = document.getElementById('snapshot-list');
const captureSnapshotBtn = document.getElementById('capture-snapshot-btn');
const snapshotInsightsEl = document.getElementById('snapshot-insights');
const feedToggleBtn = document.getElementById('feed-toggle-btn');
const confidenceSlider = document.getElementById('confidence-threshold');
const confidenceLabel = document.getElementById('confidence-label');
const kpiEventsEl = document.getElementById('kpi-events');
const kpiMarketsEl = document.getElementById('kpi-markets');
const kpiDronesEl = document.getElementById('kpi-drones');
const kpiSourceHealthEl = document.getElementById('kpi-source-health');
const mapSyncStatusEl = document.getElementById('map-sync-status');
const timelinePlayBtn = document.getElementById('timeline-play-btn');
const timelineScrubber = document.getElementById('timeline-scrubber');
const timelineSpeed = document.getElementById('timeline-speed');
const timelineLabel = document.getElementById('timeline-label');
const themeModeEl = document.getElementById('theme-mode');
const heroProfileEl = document.getElementById('hero-profile');
const effectsLevelEl = document.getElementById('effects-level');
const effectsLabelEl = document.getElementById('effects-label');
const heroHighContrastEl = document.getElementById('hero-high-contrast');
const heroReducedMotionEl = document.getElementById('hero-reduced-motion');
const heroPerformanceModeEl = document.getElementById('hero-performance-mode');
const heroStatusEl = document.getElementById('hero-status');
const droneTypeFilterEl = document.getElementById('drone-type-filter');
const droneRegionFilterEl = document.getElementById('drone-region-filter');
const droneTimeframeFilterEl = document.getElementById('drone-timeframe-filter');
const droneIntelListEl = document.getElementById('drone-intel-list');
const droneProvenanceStatusEl = document.getElementById('drone-provenance-status');
const runInsightsBtn = document.getElementById('run-insights-btn');
const insightsListEl = document.getElementById('insights-list');
const insightsStatusEl = document.getElementById('insights-status');
const ruleFormEl = document.getElementById('rule-form');
const ruleNameEl = document.getElementById('rule-name');
const ruleCategoryEl = document.getElementById('rule-category');
const ruleMinConfidenceEl = document.getElementById('rule-min-confidence');
const ruleThresholdEl = document.getElementById('rule-threshold');
const ruleWindowMinutesEl = document.getElementById('rule-window-minutes');
const saveRuleBtn = document.getElementById('save-rule-btn');
const resetRuleBtn = document.getElementById('reset-rule-btn');
const layoutProfileNameEl = document.getElementById('layout-profile-name');
const saveLayoutProfileBtn = document.getElementById('save-layout-profile-btn');
const layoutProfileSelectEl = document.getElementById('layout-profile-select');
const loadLayoutProfileBtn = document.getElementById('load-layout-profile-btn');
const deleteLayoutProfileBtn = document.getElementById('delete-layout-profile-btn');
const layoutStatusEl = document.getElementById('layout-status');
const layoutWidgetListEl = document.getElementById('layout-widget-list');
const mainGridEl = document.querySelector('.main-grid');

const STORAGE_KEYS = {
  alertRules: 'uki.alertRules',
  triggeredAlerts: 'uki.triggeredAlerts',
  snapshots: 'uki.snapshots',
  minConfidence: 'uki.minConfidence',
  layoutProfiles: 'uki.layoutProfiles',
  activeLayoutProfileId: 'uki.activeLayoutProfileId',
  themeState: 'uki.themeState'
};

let feedItems = [];
let minConfidence = 0;
let marketLastUpdateMs = 0;
let editingRuleId = null;
let alertRules = [];
let triggeredAlerts = [];
let snapshots = [];
let insightCards = [];
let playbackTimer = null;
let themeState = {
  themeId: 'command',
  effectsLevel: 50,
  heroProfile: 'off',
  highContrast: false,
  reducedMotion: false,
  performanceMode: false,
  effectiveEffects: 50
};
let layoutProfiles = [];
let activeLayoutProfileId = null;
let currentLayout = defaultLayout();
let draggedWidgetId = null;
let droneFilters = {
  type: 'all',
  region: 'all',
  timeframeMinutes: 60
};
const degradedController = createDegradedModeController();
const playbackStore = createPlaybackStore();
const marketSeries = [];
const alertRuleService = createAlertRuleService();
const snapshotService = createSnapshotService();
const layoutProfileManager = createLayoutProfileManager();

function storageGet(key, fallbackValue) {
  return new Promise((resolve) => {
    chrome.storage.local.get([key], (result) => {
      resolve(result[key] ?? fallbackValue);
    });
  });
}

function storageSet(key, value) {
  return new Promise((resolve) => {
    chrome.storage.local.set({ [key]: value }, () => resolve());
  });
}

async function persistRulesAndAlerts() {
  await Promise.all([
    storageSet(STORAGE_KEYS.alertRules, alertRules),
    storageSet(STORAGE_KEYS.triggeredAlerts, triggeredAlerts)
  ]);
}

function resetRuleForm() {
  editingRuleId = null;
  ruleFormEl.reset();
  ruleCategoryEl.value = 'event';
  ruleMinConfidenceEl.value = '0.7';
  ruleThresholdEl.value = '2';
  ruleWindowMinutesEl.value = '30';
  saveRuleBtn.textContent = 'Create Rule';
}

function renderRuleList() {
  if (!alertRules.length) {
    ruleListEl.innerHTML = '<li>No rules configured yet.</li>';
    return;
  }

  ruleListEl.innerHTML = alertRules
    .map((rule) => {
      const mode = rule.enabled ? 'enabled' : 'disabled';
      return `<li>
        <strong>${rule.name}</strong>
        <p class="rule-meta">category=${rule.category} min=${Math.round(rule.minConfidence * 100)}% threshold=${rule.threshold}/${rule.windowMinutes}m (${mode})</p>
        <div class="rule-actions">
          <button type="button" data-action="edit" data-rule-id="${rule.id}">Edit</button>
          <button type="button" data-action="toggle" data-rule-id="${rule.id}">${rule.enabled ? 'Disable' : 'Enable'}</button>
          <button type="button" data-action="delete" data-rule-id="${rule.id}">Delete</button>
        </div>
      </li>`;
    })
    .join('');
}

function renderTriggeredAlerts() {
  if (!triggeredAlerts.length) {
    alertsListEl.innerHTML = '<li>No triggered alerts.</li>';
    return;
  }

  alertsListEl.innerHTML = triggeredAlerts
    .slice(0, 30)
    .map((alert) => {
      const ts = new Date(alert.timestamp).toLocaleTimeString();
      const snooze = alert.snoozeUntil ? ` snooze until ${new Date(alert.snoozeUntil).toLocaleTimeString()}` : '';
      const evidence = alert.evidenceLinks.length ? alert.evidenceLinks.join(' | ') : 'none';
      return `<li>
        <strong>${alert.ruleName}</strong> <span class="alert-state ${alert.state}">${alert.state}</span>
        <p class="alert-meta">${alert.reason}</p>
        <p class="alert-meta">${ts}${snooze}</p>
        <span class="evidence-links">Evidence: ${evidence}</span>
        <div class="alert-actions">
          <button type="button" data-action="ack" data-alert-id="${alert.id}">Acknowledge</button>
          <button type="button" data-action="snooze" data-alert-id="${alert.id}">Snooze 5m</button>
          <button type="button" data-action="escalate" data-alert-id="${alert.id}">Escalate</button>
        </div>
      </li>`;
    })
    .join('');
}

function renderDroneIntel() {
  const intel = aggregateDroneIntel(feedItems, droneFilters);
  kpiDronesEl.textContent = `${intel.totalQuantity}`;

  if (!intel.count) {
    droneIntelListEl.innerHTML = '<li>No drone aggregates for selected filters.</li>';
    droneProvenanceStatusEl.classList.remove('provenance-live', 'provenance-stale');
    droneProvenanceStatusEl.classList.add('provenance-stale');
    droneProvenanceStatusEl.textContent = 'Provenance unavailable for current selection.';
    return;
  }

  const topType = intel.byType[0];
  const topRegion = intel.byRegion[0];
  const provenanceText = intel.provenance
    .slice(0, 3)
    .map((item) => `${item.sourceId} @ ${new Date(item.collectedAt).toLocaleTimeString()}`)
    .join(' | ');

  droneIntelListEl.innerHTML = `
    <li><strong>Total quantity:</strong> ${intel.totalQuantity} from ${intel.count} events</li>
    <li><strong>Top type:</strong> ${topType ? topType[0] : 'n/a'} (${topType ? topType[1] : 0})</li>
    <li><strong>Top region:</strong> ${topRegion ? topRegion[0] : 'n/a'} (${topRegion ? topRegion[1] : 0})</li>
    <li><strong>Provenance:</strong> ${provenanceText || 'source unavailable'}</li>
  `;

  droneProvenanceStatusEl.classList.remove('provenance-live', 'provenance-stale');
  droneProvenanceStatusEl.classList.add(intel.stale ? 'provenance-stale' : 'provenance-live');
  droneProvenanceStatusEl.textContent = intel.stale
    ? 'Drone aggregate stale marker active.'
    : 'Drone aggregate provenance is fresh.';
}

function renderInsights() {
  if (!insightCards.length) {
    insightsListEl.innerHTML = '<li>No insight cards generated.</li>';
    insightsStatusEl.textContent = 'Awaiting sufficient data.';
    return;
  }

  insightsListEl.innerHTML = insightCards
    .map((card) => {
      const confidence = Math.round(card.confidence * 100);
      return `<li>
        <strong>${card.title}</strong>
        <p class="panel-meta">${card.summary}</p>
        <p class="insight-confidence">Confidence ${confidence}%</p>
        <span class="evidence-links">Evidence: ${card.evidenceRefs.join(' | ')}</span>
      </li>`;
    })
    .join('');

  const strong = insightCards.filter((card) => card.confidence >= 0.7).length;
  insightsStatusEl.textContent = `${insightCards.length} insight cards (${strong} high-confidence)`;
}

function runPatternEngine() {
  const result = detectPatterns(feedItems, minConfidence);
  insightCards = mapInsightsToCards(result);
  renderInsights();
}

function renderPlayback(snapshot) {
  const span = snapshot.rangeEndTs - snapshot.rangeStartTs;
  const progress = span > 0 ? ((snapshot.cursorTs - snapshot.rangeStartTs) / span) * 100 : 100;
  timelineScrubber.value = `${Math.max(0, Math.min(100, Math.round(progress)))}`;
  timelineSpeed.value = `${snapshot.speed}`;
  timelinePlayBtn.textContent = snapshot.paused ? 'Play' : 'Pause';
  timelineLabel.textContent = new Date(snapshot.cursorTs).toLocaleTimeString();

  const cursorItems = feedItems.filter((item) => Date.parse(item.timestamp) <= snapshot.cursorTs).slice(0, 3);
  const mapPreview = cursorItems.map((item) => `${item.category.toUpperCase()}@${item.location || 'n/a'}`).join(' | ') || 'no overlays in range';
  mapSyncStatusEl.textContent = `Map synced to timeline ${timelineLabel.textContent}: ${mapPreview}`;
}

function startPlaybackTick() {
  if (playbackTimer) return;
  playbackTimer = setInterval(() => {
    const snap = playbackStore.snapshot();
    if (snap.paused) return;
    const delta = 1000 * snap.speed;
    const nextCursor = Math.min(snap.rangeEndTs, snap.cursorTs + delta);
    const paused = nextCursor >= snap.rangeEndTs;
    playbackStore.update({ cursorTs: nextCursor, paused });
  }, 1000);
}

function applyTheme() {
  themeState = applyThemeConfig(document.body, themeState);
  effectsLabelEl.textContent = `${themeState.effectiveEffects}%`;
  heroStatusEl.textContent = themeState.heroProfile === 'off'
    ? 'Hero mode disabled.'
    : `Hero mode ${themeState.heroProfile} active.`;
  themeModeEl.value = themeState.themeId;
  heroProfileEl.value = themeState.heroProfile;
  effectsLevelEl.value = `${themeState.effectsLevel}`;
  heroHighContrastEl.checked = themeState.highContrast;
  heroReducedMotionEl.checked = themeState.reducedMotion;
  heroPerformanceModeEl.checked = themeState.performanceMode;
}

async function persistThemeState() {
  await storageSet(STORAGE_KEYS.themeState, themeState);
}

function selectedInsights() {
  return feedItems.slice(0, 3).map((item) => `${item.category}:${item.title}`);
}

function snapshotState() {
  const statusMode = statusEl.classList.contains('degraded') ? 'degraded' : 'live';
  return {
    statusText: statusEl.textContent,
    statusMode,
    kpis: {
      events: kpiEventsEl.textContent,
      markets: kpiMarketsEl.textContent,
      drones: kpiDronesEl.textContent,
      sourceHealth: kpiSourceHealthEl.textContent
    },
    minConfidence,
    activeRuleIds: alertRules.filter((rule) => rule.enabled).map((rule) => rule.id),
    timeframeMinutes: droneFilters.timeframeMinutes,
    selectedInsights: selectedInsights(),
    feedPaused: !orchestrator.isRunning()
  };
}

function renderSnapshots() {
  if (!snapshots.length) {
    snapshotListEl.innerHTML = '<li>No snapshots recorded yet.</li>';
    snapshotInsightsEl.textContent = 'No mission snapshots captured.';
    return;
  }

  snapshotListEl.innerHTML = snapshots
    .map((snap) => {
      const ts = new Date(snap.timestamp).toLocaleString();
      return `<li>
        <strong>${ts}</strong>
        <p class="snapshot-meta">confidence=${Math.round(snap.filters.minConfidence * 100)}% timeframe=${snap.timeframe.minutes}m feed=${snap.feedPaused ? 'paused' : 'running'}</p>
        <div class="snapshot-actions">
          <button type="button" data-action="restore" data-snapshot-id="${snap.id}">Restore</button>
          <button type="button" data-action="delete" data-snapshot-id="${snap.id}">Delete</button>
        </div>
      </li>`;
    })
    .join('');

  snapshotInsightsEl.textContent = `Latest insights: ${snapshots[0].selectedInsights.join(' | ') || 'none'}`;
}

function widgetLabel(widgetId) {
  if (widgetId === 'map-panel') return 'Tactical Map';
  if (widgetId === 'feed-panel') return 'Realtime Feed';
  if (widgetId === 'insights-panel') return 'Insights';
  if (widgetId === 'alerts-panel') return 'Alerts';
  return widgetId;
}

function applyLayoutToPanels(layout) {
  const normalized = normalizeLayout(layout);
  currentLayout = normalized;

  normalized.forEach((item, index) => {
    const panel = document.getElementById(item.widgetId);
    if (!panel) return;
    panel.style.gridColumn = `${item.x} / span ${item.w}`;
    panel.style.gridRow = `${item.y} / span ${item.h}`;
    panel.style.order = `${index + 1}`;
  });

  mainGridEl.dataset.layoutApplied = 'true';
}

function renderLayoutProfileSelect() {
  if (!layoutProfiles.length) {
    layoutProfileSelectEl.innerHTML = '<option value="">No profiles</option>';
    return;
  }

  layoutProfileSelectEl.innerHTML = layoutProfiles
    .map((profile) => `<option value="${profile.id}" ${profile.id === activeLayoutProfileId ? 'selected' : ''}>${profile.name}</option>`)
    .join('');
}

function renderLayoutEditor() {
  if (!currentLayout.length) {
    layoutWidgetListEl.innerHTML = '<li>No layout widgets configured.</li>';
    return;
  }

  layoutWidgetListEl.innerHTML = currentLayout
    .map((entry) => `
      <li draggable="true" data-widget-id="${entry.widgetId}">
        <div class="layout-widget-row">
          <strong>${widgetLabel(entry.widgetId)}</strong>
          <div class="layout-widget-actions">
            <button type="button" data-action="move-up" data-widget-id="${entry.widgetId}">Up</button>
            <button type="button" data-action="move-down" data-widget-id="${entry.widgetId}">Down</button>
          </div>
        </div>
        <div class="layout-widget-meta">
          <label>X<input type="number" min="1" max="4" data-key="x" data-widget-id="${entry.widgetId}" value="${entry.x}"></label>
          <label>Y<input type="number" min="1" max="30" data-key="y" data-widget-id="${entry.widgetId}" value="${entry.y}"></label>
          <label>W<input type="number" min="1" max="4" data-key="w" data-widget-id="${entry.widgetId}" value="${entry.w}"></label>
          <label>H<input type="number" min="1" max="4" data-key="h" data-widget-id="${entry.widgetId}" value="${entry.h}"></label>
        </div>
      </li>
    `)
    .join('');
}

async function persistLayoutProfiles() {
  await Promise.all([
    storageSet(STORAGE_KEYS.layoutProfiles, layoutProfiles),
    storageSet(STORAGE_KEYS.activeLayoutProfileId, activeLayoutProfileId)
  ]);
}

function loadActiveLayoutProfile() {
  const profile = layoutProfiles.find((entry) => entry.id === activeLayoutProfileId) || layoutProfiles[0];
  if (!profile) return;
  activeLayoutProfileId = profile.id;
  currentLayout = profile.widgets;
  applyLayoutToPanels(currentLayout);
  renderLayoutProfileSelect();
  renderLayoutEditor();
  layoutStatusEl.textContent = `Active profile: ${profile.name}`;
}

function setStatusLive(text) {
  statusEl.classList.remove('degraded');
  statusEl.classList.add('live');
  statusEl.textContent = text;
}

function setStatusDegraded(text) {
  statusEl.classList.remove('live');
  statusEl.classList.add('degraded');
  statusEl.textContent = text;
}

function renderFeed() {
  const visible = feedItems.filter((item) => item.confidence >= minConfidence);
  if (!visible.length) {
    feedListEl.innerHTML = '<li>No feed items match current confidence threshold.</li>';
    return;
  }

  feedListEl.innerHTML = visible
    .slice(0, 25)
    .map((item) => {
      const ts = new Date(item.timestamp).toLocaleTimeString();
      return `<li><strong>[${item.category.toUpperCase()}]</strong> ${item.title} (${item.source}) - ${item.location || 'n/a'} - ${ts} - confidence ${Math.round(item.confidence * 100)}%</li>`;
    })
    .join('');

  const oneHourAgo = Date.now() - 60 * 60 * 1000;
  const eventsPerHour = feedItems.filter((item) => item.category === 'event' && Date.parse(item.timestamp) >= oneHourAgo).length;
  const droneSignals = feedItems.filter((item) => item.category === 'drone').reduce((sum, item) => sum + (Number(item.quantity) || 1), 0);
  kpiEventsEl.textContent = `${eventsPerHour}`;
  kpiDronesEl.textContent = `${droneSignals}`;
}

function renderSourceHealth() {
  const snapshot = getHealthSnapshot();
  if (!snapshot.length) {
    sourceListEl.innerHTML = '<li>No source telemetry yet.</li>';
    return;
  }

  sourceListEl.innerHTML = snapshot
    .map((entry) => {
      const age = entry.ageMs === Number.POSITIVE_INFINITY ? 'never' : `${Math.round(entry.ageMs / 1000)}s ago`;
      return `<li><span>${entry.sourceId} (${age})</span><span class="state ${entry.status}">${entry.status}</span></li>`;
    })
    .join('');

  degradedController.update(snapshot);
  const degraded = degradedController.state();
  if (degraded.active) {
    setStatusDegraded(`Degraded mode active for ${degraded.affectedSources.join(', ')}`);
  } else {
    setStatusLive('Console online. Feed orchestrator and source intelligence active.');
  }

  const onlineCount = snapshot.filter((entry) => entry.status === 'online').length;
  kpiSourceHealthEl.textContent = `${onlineCount}/${snapshot.length} online`;
}

function onMarketIndicator(point) {
  marketLastUpdateMs = Date.now();
  marketSeries.push(point);
  while (marketSeries.length > 50) marketSeries.shift();

  const latest = marketSeries.filter((item) => item.key === 'uah_usd').at(-1) || point;
  const sign = latest.delta > 0 ? '+' : '';
  kpiMarketsEl.textContent = `${latest.label}: ${latest.value} (${sign}${latest.delta})`;

  const freshness = getMarketFreshness(marketLastUpdateMs);
  kpiMarketsEl.classList.remove('live', 'delayed', 'stale');
  kpiMarketsEl.classList.add(freshness === 'unavailable' ? 'stale' : freshness);
}

async function ingestItem(item) {
  const dedup = dedupFeedItem(item);
  if (!dedup.accepted) return;

  const enriched = {
    ...item,
    confidence: confidenceForItem(item)
  };

  markSourceSuccess(item.sourceId);
  feedItems = [enriched, ...feedItems].slice(0, 200);

  const evaluation = alertRuleService.evaluateRules(alertRules, feedItems, enriched);
  alertRules = evaluation.nextRules;
  if (evaluation.triggered.length) {
    triggeredAlerts = [...evaluation.triggered, ...triggeredAlerts].slice(0, 100);
    await persistRulesAndAlerts();
    renderTriggeredAlerts();
  }

  renderFeed();
  renderSourceHealth();
  renderDroneIntel();
  renderRuleList();
  runPatternEngine();
}

const orchestrator = createFeedOrchestrator(
  ingestItem,
  (sourceId) => {
    markSourceFailure(sourceId);
    renderSourceHealth();
  },
  (sourceId) => {
    markSourceSuccess(sourceId);
    renderSourceHealth();
  }
);

const marketClient = createMarketClient(onMarketIndicator);

window.addEventListener('DOMContentLoaded', () => {
  (async () => {
    const [savedRules, savedAlerts, savedSnapshots, savedMinConfidence, savedLayoutProfiles, savedActiveLayoutProfileId, savedThemeState] = await Promise.all([
      storageGet(STORAGE_KEYS.alertRules, []),
      storageGet(STORAGE_KEYS.triggeredAlerts, []),
      storageGet(STORAGE_KEYS.snapshots, []),
      storageGet(STORAGE_KEYS.minConfidence, 0),
      storageGet(STORAGE_KEYS.layoutProfiles, []),
      storageGet(STORAGE_KEYS.activeLayoutProfileId, null),
      storageGet(STORAGE_KEYS.themeState, null)
    ]);

    minConfidence = Number(savedMinConfidence) || 0;
    confidenceSlider.value = `${Math.round(minConfidence * 100)}`;
    confidenceLabel.textContent = `${Math.round(minConfidence * 100)}%`;

    alertRules = savedRules.length ? savedRules : [alertRuleService.defaultRule()];
    triggeredAlerts = savedAlerts;
    snapshots = savedSnapshots;
    layoutProfiles = layoutProfileManager.ensureProfiles(savedLayoutProfiles);
    activeLayoutProfileId = savedActiveLayoutProfileId || layoutProfiles[0]?.id || null;
    themeState = { ...themeState, ...(savedThemeState || {}) };

    renderRuleList();
    renderTriggeredAlerts();
    renderSnapshots();
    loadActiveLayoutProfile();
    if (!savedLayoutProfiles.length) {
      await persistLayoutProfiles();
    }
    renderFeed();
    renderSourceHealth();
    renderDroneIntel();
    runPatternEngine();
    const spanStart = Date.now() - droneFilters.timeframeMinutes * 60 * 1000;
    playbackStore.update({
      rangeStartTs: spanStart,
      rangeEndTs: Date.now(),
      cursorTs: Date.now(),
      speed: 1,
      paused: true
    });
    applyTheme();
  })();

  playbackStore.subscribe(renderPlayback);
  startPlaybackTick();

  setStatusLive('Console online. Feed orchestrator and source intelligence active.');
  orchestrator.start();
  marketClient.start();

  feedToggleBtn.addEventListener('click', () => {
    if (orchestrator.isRunning()) {
      orchestrator.stop();
      marketClient.stop();
      feedToggleBtn.textContent = 'Resume Feed';
      setStatusLive('Feed paused. Existing data retained.');
    } else {
      orchestrator.start();
      marketClient.start();
      feedToggleBtn.textContent = 'Pause Feed';
      setStatusLive('Feed resumed.');
    }
  });

  confidenceSlider.addEventListener('input', () => {
    minConfidence = Number(confidenceSlider.value) / 100;
    confidenceLabel.textContent = `${confidenceSlider.value}%`;
    renderFeed();
    runPatternEngine();
    void storageSet(STORAGE_KEYS.minConfidence, minConfidence);
  });

  droneTypeFilterEl.addEventListener('change', () => {
    droneFilters.type = droneTypeFilterEl.value;
    renderDroneIntel();
  });

  droneRegionFilterEl.addEventListener('change', () => {
    droneFilters.region = droneRegionFilterEl.value;
    renderDroneIntel();
  });

  droneTimeframeFilterEl.addEventListener('change', () => {
    droneFilters.timeframeMinutes = Number(droneTimeframeFilterEl.value);
    renderDroneIntel();
    const end = Date.now();
    playbackStore.update({
      rangeEndTs: end,
      rangeStartTs: end - droneFilters.timeframeMinutes * 60 * 1000,
      cursorTs: end
    });
  });

  timelinePlayBtn.addEventListener('click', () => {
    const snap = playbackStore.snapshot();
    playbackStore.update({ paused: !snap.paused });
  });

  timelineScrubber.addEventListener('input', () => {
    const snap = playbackStore.snapshot();
    const ratio = Number(timelineScrubber.value) / 100;
    const cursorTs = snap.rangeStartTs + (snap.rangeEndTs - snap.rangeStartTs) * ratio;
    playbackStore.update({ cursorTs, paused: true });
  });

  timelineSpeed.addEventListener('change', () => {
    playbackStore.update({ speed: Number(timelineSpeed.value) || 1 });
  });

  themeModeEl.addEventListener('change', () => {
    themeState = { ...themeState, themeId: themeModeEl.value, heroProfile: 'off' };
    applyTheme();
    void persistThemeState();
  });

  heroProfileEl.addEventListener('change', () => {
    themeState = { ...themeState, heroProfile: heroProfileEl.value };
    applyTheme();
    void persistThemeState();
  });

  effectsLevelEl.addEventListener('input', () => {
    themeState = { ...themeState, effectsLevel: Number(effectsLevelEl.value) || 0, heroProfile: 'off' };
    applyTheme();
    void persistThemeState();
  });

  heroHighContrastEl.addEventListener('change', () => {
    themeState = { ...themeState, highContrast: heroHighContrastEl.checked };
    applyTheme();
    void persistThemeState();
  });

  heroReducedMotionEl.addEventListener('change', () => {
    themeState = { ...themeState, reducedMotion: heroReducedMotionEl.checked };
    applyTheme();
    void persistThemeState();
  });

  heroPerformanceModeEl.addEventListener('change', () => {
    themeState = { ...themeState, performanceMode: heroPerformanceModeEl.checked };
    applyTheme();
    void persistThemeState();
  });

  runInsightsBtn.addEventListener('click', () => {
    runPatternEngine();
  });

  saveLayoutProfileBtn.addEventListener('click', async () => {
    const profileName = layoutProfileNameEl.value.trim();
    if (!profileName) {
      layoutStatusEl.textContent = 'Enter a profile name before saving.';
      return;
    }

    const existing = layoutProfiles.find((entry) => entry.name.toLowerCase() === profileName.toLowerCase());
    layoutProfiles = layoutProfileManager.upsertProfile(layoutProfiles, {
      id: existing?.id,
      name: profileName,
      widgets: normalizeLayout(currentLayout)
    });

    activeLayoutProfileId = (existing && existing.id) || layoutProfiles[0].id;
    renderLayoutProfileSelect();
    await persistLayoutProfiles();
    layoutStatusEl.textContent = `Saved profile: ${profileName}`;
  });

  loadLayoutProfileBtn.addEventListener('click', async () => {
    const selectedId = layoutProfileSelectEl.value;
    const profile = layoutProfiles.find((entry) => entry.id === selectedId);
    if (!profile) return;

    activeLayoutProfileId = profile.id;
    applyLayoutToPanels(profile.widgets);
    renderLayoutEditor();
    renderLayoutProfileSelect();
    await persistLayoutProfiles();
    layoutStatusEl.textContent = `Loaded profile: ${profile.name}`;
  });

  deleteLayoutProfileBtn.addEventListener('click', async () => {
    const selectedId = layoutProfileSelectEl.value;
    const selected = layoutProfiles.find((entry) => entry.id === selectedId);
    if (!selected) return;

    layoutProfiles = layoutProfileManager.deleteProfile(layoutProfiles, selectedId);
    activeLayoutProfileId = layoutProfiles[0].id;
    loadActiveLayoutProfile();
    await persistLayoutProfiles();
    layoutStatusEl.textContent = `Deleted profile: ${selected.name}`;
  });

  layoutWidgetListEl.addEventListener('input', (event) => {
    const input = event.target.closest('input[data-key]');
    if (!input) return;

    const widgetId = input.dataset.widgetId;
    const key = input.dataset.key;
    currentLayout = currentLayout.map((entry) => {
      if (entry.widgetId !== widgetId) return entry;
      return { ...entry, [key]: Number(input.value) };
    });

    applyLayoutToPanels(currentLayout);
    renderLayoutEditor();
    layoutStatusEl.textContent = 'Layout changed. Save profile to persist.';
  });

  layoutWidgetListEl.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-action]');
    if (!button) return;
    const action = button.dataset.action;
    const widgetId = button.dataset.widgetId;

    if (action === 'move-up' || action === 'move-down') {
      currentLayout = reorderLayout(currentLayout, widgetId, action === 'move-up' ? 'up' : 'down');
      applyLayoutToPanels(currentLayout);
      renderLayoutEditor();
      layoutStatusEl.textContent = 'Widget order updated. Save profile to persist.';
    }
  });

  layoutWidgetListEl.addEventListener('dragstart', (event) => {
    const item = event.target.closest('li[data-widget-id]');
    if (!item) return;
    draggedWidgetId = item.dataset.widgetId;
  });

  layoutWidgetListEl.addEventListener('dragover', (event) => {
    event.preventDefault();
  });

  layoutWidgetListEl.addEventListener('drop', (event) => {
    event.preventDefault();
    const target = event.target.closest('li[data-widget-id]');
    if (!target || !draggedWidgetId) return;
    const targetWidgetId = target.dataset.widgetId;
    if (!targetWidgetId || targetWidgetId === draggedWidgetId) return;

    const orderedIds = currentLayout.map((entry) => entry.widgetId).filter((id) => id !== draggedWidgetId);
    const targetIndex = orderedIds.indexOf(targetWidgetId);
    orderedIds.splice(targetIndex, 0, draggedWidgetId);

    currentLayout = orderedIds
      .map((widgetId) => currentLayout.find((entry) => entry.widgetId === widgetId))
      .filter(Boolean)
      .map((entry, index) => ({ ...entry, zIndex: index + 1 }));

    applyLayoutToPanels(currentLayout);
    renderLayoutEditor();
    layoutStatusEl.textContent = 'Drag reorder applied. Save profile to persist.';
    draggedWidgetId = null;
  });

  ruleFormEl.addEventListener('submit', async (event) => {
    event.preventDefault();
    const payload = {
      id: editingRuleId || undefined,
      name: ruleNameEl.value.trim(),
      category: ruleCategoryEl.value,
      minConfidence: Number(ruleMinConfidenceEl.value),
      threshold: Number(ruleThresholdEl.value),
      windowMinutes: Number(ruleWindowMinutesEl.value),
      cooldownMs: 5 * 60 * 1000,
      enabled: true
    };

    const nextRule = alertRuleService.createRule(payload);
    if (editingRuleId) {
      alertRules = alertRules.map((rule) => (rule.id === editingRuleId ? { ...nextRule, createdAt: rule.createdAt } : rule));
    } else {
      alertRules = [nextRule, ...alertRules];
    }

    resetRuleForm();
    renderRuleList();
    await storageSet(STORAGE_KEYS.alertRules, alertRules);
  });

  resetRuleBtn.addEventListener('click', () => {
    resetRuleForm();
  });

  ruleListEl.addEventListener('click', async (event) => {
    const button = event.target.closest('button[data-action]');
    if (!button) return;

    const action = button.dataset.action;
    const ruleId = button.dataset.ruleId;
    const rule = alertRules.find((entry) => entry.id === ruleId);
    if (!rule) return;

    if (action === 'edit') {
      editingRuleId = rule.id;
      ruleNameEl.value = rule.name;
      ruleCategoryEl.value = rule.category;
      ruleMinConfidenceEl.value = `${rule.minConfidence}`;
      ruleThresholdEl.value = `${rule.threshold}`;
      ruleWindowMinutesEl.value = `${rule.windowMinutes}`;
      saveRuleBtn.textContent = 'Update Rule';
      return;
    }

    if (action === 'toggle') {
      alertRules = alertRules.map((entry) => {
        if (entry.id !== rule.id) return entry;
        return { ...entry, enabled: !entry.enabled, updatedAt: new Date().toISOString() };
      });
    }

    if (action === 'delete') {
      alertRules = alertRules.filter((entry) => entry.id !== rule.id);
      if (editingRuleId === rule.id) resetRuleForm();
    }

    renderRuleList();
    await storageSet(STORAGE_KEYS.alertRules, alertRules);
  });

  alertsListEl.addEventListener('click', async (event) => {
    const button = event.target.closest('button[data-action]');
    if (!button) return;

    const action = button.dataset.action;
    const alertId = button.dataset.alertId;
    if (!alertId) return;

    triggeredAlerts = triggeredAlerts.map((alert) => {
      if (alert.id !== alertId) return alert;
      return alertRuleService.transitionAlert(alert, action);
    });

    renderTriggeredAlerts();
    await storageSet(STORAGE_KEYS.triggeredAlerts, triggeredAlerts);
  });

  captureSnapshotBtn.addEventListener('click', async () => {
    const snap = snapshotService.createSnapshot(snapshotState());
    snapshots = [snap, ...snapshots].slice(0, 50);
    renderSnapshots();
    await storageSet(STORAGE_KEYS.snapshots, snapshots);
  });

  snapshotListEl.addEventListener('click', async (event) => {
    const button = event.target.closest('button[data-action]');
    if (!button) return;

    const action = button.dataset.action;
    const snapshotId = button.dataset.snapshotId;
    const snapshot = snapshots.find((entry) => entry.id === snapshotId);
    if (!snapshot) return;

    if (action === 'delete') {
      snapshots = snapshots.filter((entry) => entry.id !== snapshotId);
      renderSnapshots();
      await storageSet(STORAGE_KEYS.snapshots, snapshots);
      return;
    }

    if (action === 'restore') {
      const applied = snapshotService.applySnapshot(snapshot, {
        minConfidence,
        timeframeMinutes: 60,
        selectedInsights: selectedInsights(),
        feedPaused: !orchestrator.isRunning()
      });

      minConfidence = applied.minConfidence;
      confidenceSlider.value = `${Math.round(minConfidence * 100)}`;
      confidenceLabel.textContent = `${Math.round(minConfidence * 100)}%`;

      if (applied.feedPaused && orchestrator.isRunning()) {
        orchestrator.stop();
        marketClient.stop();
        feedToggleBtn.textContent = 'Resume Feed';
        setStatusLive('Feed paused from restored snapshot context.');
      }

      if (!applied.feedPaused && !orchestrator.isRunning()) {
        orchestrator.start();
        marketClient.start();
        feedToggleBtn.textContent = 'Pause Feed';
        setStatusLive('Feed resumed from restored snapshot context.');
      }

      renderFeed();
      renderDroneIntel();
      runPatternEngine();
      await storageSet(STORAGE_KEYS.minConfidence, minConfidence);
    }
  });

  setInterval(renderSourceHealth, 3000);
  setInterval(() => {
    const freshness = getMarketFreshness(marketLastUpdateMs);
    kpiMarketsEl.classList.remove('live', 'delayed', 'stale');
    kpiMarketsEl.classList.add(freshness === 'unavailable' ? 'stale' : freshness);
  }, 3000);
});
