// scenarios.js — DI-015
import { state } from './state.js';
import { SPECIES, getSpecies } from './species.js';
import { spawnAgent, removeAllOfSpecies } from './sim.js';
import { triggerEvent, clearEvent } from './environment.js';
import { restoreBaseline } from './intervention.js';

const pop = id => state.agents[id]?.length || 0;
const plantCount = id => state.plantPatches[id]?.length || 0;
const baseline = id => getSpecies(id)?.baselineCount || 0;

export const SCENARIOS = [
  {
    id: 'alligator-removed', title: 'Remove the Alligator', icon: '🐊',
    intro: 'Watch what happens when the apex predator is removed. The food web rebalances over a few simulated weeks.',
    setup() { restoreBaseline(); removeAllOfSpecies('alligator'); state.events.log.push({type:'scenario',kind:'event',tick:state.tick,day:Math.floor(state.environment.dayOfYear),text:'Scenario started: alligator removed.'}); },
    checklist: [
      { label: 'Snake population +20%', test: () => pop('snake') >= 1.2 * baseline('snake') },
      { label: 'Bass population +35%', test: () => pop('bass') >= 1.35 * baseline('bass') },
      { label: 'Heron population +18%', test: () => pop('heron') >= 1.18 * baseline('heron') },
      { label: 'Tadpole population −25%', test: () => pop('tadpole') <= 0.75 * baseline('tadpole') },
    ],
    summary: () => `Removing the alligator allowed snakes (${pct('snake')}), bass (${pct('bass')}), and herons (${pct('heron')}) to expand. Their pressure pushed tadpoles to ${pct('tadpole')}.`,
  },
  {
    id: 'mosquito-explosion', title: 'Mosquito explosion', icon: '🦟',
    intro: 'Begin with a tenfold mosquito surge. Watch their predators respond — and what is lost when they cannot.',
    setup() { restoreBaseline(); for (let i = 0; i < baseline('mosquito')*10; i++) spawnAgent('mosquito'); },
    checklist: [
      { label: 'Mosquitoes ≥ 5× baseline', test: () => pop('mosquito') >= 5 * baseline('mosquito') },
      { label: 'Dragonfly population +30%', test: () => pop('dragonfly') >= 1.3 * baseline('dragonfly') },
      { label: 'Bat or frog population +20%', test: () => pop('bat') >= 1.2*baseline('bat') || pop('frog') >= 1.2*baseline('frog') },
      { label: 'Mosquitoes back below 1.5× baseline', test: () => pop('mosquito') < 1.5 * baseline('mosquito') },
    ],
    summary: () => `Mosquitoes peaked then settled at ${pct('mosquito')} of baseline as predators (dragonfly ${pct('dragonfly')}, bat ${pct('bat')}) responded.`,
  },
  {
    id: 'algae-bloom', title: 'Algae bloom', icon: '🌿',
    intro: 'A nutrient surge feeds the algae. Watch the oxygen — and the fish that depend on it.',
    setup() { restoreBaseline(); triggerEvent('runoff'); },
    checklist: [
      { label: 'Algae mass ≥ 4× baseline', test: () => plantCount('algae') >= 4 * baseline('algae') },
      { label: 'Oxygen drops below 0.5', test: () => state.environment.oxygen < 0.5 },
      { label: 'Bass population −30%', test: () => pop('bass') <= 0.7 * baseline('bass') },
      { label: 'Snail population +20%', test: () => pop('snail') >= 1.2 * baseline('snail') },
    ],
    summary: () => `Algae grew to ${plantCount('algae')} patches; oxygen reached ${state.environment.oxygen.toFixed(2)}; bass at ${pct('bass')}.`,
  },
  {
    id: 'beaver-dam', title: 'Beaver dam', icon: '🦫',
    intro: 'A beaver pair begins building. Watch the water rise and the wetlands expand.',
    setup() { restoreBaseline(); for (let i = 0; i < 3; i++) spawnAgent('beaver'); },
    checklist: [
      { label: 'Dam reaches 100%', test: () => state.beaverDam.complete },
      { label: 'Water level rises ≥ 30%', test: () => state.environment.waterLevel >= 1.3 },
      { label: 'Aquatic combined +15%', test: () => (pop('bass')+pop('frog')+pop('dragonfly')) >= 1.15 * (baseline('bass')+baseline('frog')+baseline('dragonfly')) },
      { label: 'Shoreline plants +25%', test: () => (plantCount('cattails')+plantCount('sawgrass')) >= 1.25 * (baseline('cattails')+baseline('sawgrass')) },
    ],
    summary: () => `Dam at ${Math.round(state.beaverDam.progress*100)}%; water at ${state.environment.waterLevel.toFixed(2)}; aquatic species expanded.`,
  },
  {
    id: 'drought-year', title: 'Drought year', icon: '☀️',
    intro: 'Rains fail. Watch the water shrink — and where life retreats. Notice what the alligator does.',
    setup() { restoreBaseline(); triggerEvent('drought'); },
    checklist: [
      { label: 'Water level falls to 0.5×', test: () => state.environment.waterLevel <= 0.5 },
      { label: 'At least one gator-hole established', test: () => state.gatorHoles.length > 0 },
      { label: 'Fish population −40%', test: () => (pop('bass')+pop('mullet')) <= 0.6 * (baseline('bass')+baseline('mullet')) },
      { label: 'Refuge species near a gator-hole', test: () => refugeNearGatorHole() >= 1 },
    ],
    summary: () => `Water reached ${state.environment.waterLevel.toFixed(2)}; alligators maintained ${state.gatorHoles.length} hole(s); fish at ${pct('bass')} bass, ${pct('mullet')} mullet.`,
  },
];

function refugeNearGatorHole() {
  let n = 0;
  for (const h of state.gatorHoles) {
    for (const sp of SPECIES) if (!sp.isPlant && sp.id !== 'alligator') {
      const arr = state.agents[sp.id]; if (!arr) continue;
      for (const a of arr) {
        const dx = a.x - h.x, dy = a.y - h.y; if (dx*dx + dy*dy < (h.r+10)*(h.r+10)) { n++; break; }
      }
    }
  }
  return n;
}
function pct(id) {
  const b = baseline(id) || 1; return Math.round(100 * pop(id) / b) + '%';
}

export function startScenario(id) {
  const s = SCENARIOS.find(x => x.id === id); if (!s) return;
  s.setup();
  state.scenario.id = id;
  state.scenario.startTick = state.tick;
  state.scenario.checklist = s.checklist.map(c => ({ label: c.label, done: false, doneAt: null }));
  state.scenario.summary = null;
  state.scenario.history = {};
  // Speed up to ×5 to make checklists reachable in test time
  state.settings.speed = Math.max(state.settings.speed, 5);
  renderActiveScenario();
}

export function tickScenario() {
  const s = SCENARIOS.find(x => x.id === state.scenario.id); if (!s) return;
  let allDone = true;
  for (let i = 0; i < s.checklist.length; i++) {
    const item = state.scenario.checklist[i];
    if (!item.done && s.checklist[i].test()) { item.done = true; item.doneAt = state.tick; }
    if (!item.done) allDone = false;
  }
  if (allDone && !state.scenario.summary) {
    state.scenario.summary = s.summary();
    state.events.log.push({ type:'scenario', kind:'event', tick:state.tick, day:Math.floor(state.environment.dayOfYear), text: `Scenario "${s.title}" — all checklist items observed.` });
  }
  if (state.tick % 30 === 0) renderActiveScenario();
}

export function endScenario() {
  state.scenario.id = null; state.scenario.checklist = []; state.scenario.summary = null;
  const el = document.getElementById('scenario-active'); if (el) el.classList.add('hidden');
  const pick = document.getElementById('scenario-picker'); if (pick) pick.classList.remove('hidden');
}

export function mountScenarioPicker() {
  const el = document.getElementById('scenario-picker'); if (!el) return;
  el.innerHTML = SCENARIOS.map(s => `
    <article class="scenario-card" data-scenario="${s.id}">
      <img class="scenario-card-header" src="./images/ui/scenario-${s.id}.svg" alt="">
      <div class="scenario-card-body">
        <h4>${s.icon || ''} ${s.title}</h4>
        <p>${s.intro}</p>
        <button data-act="start">Start</button>
      </div>
    </article>`).join('');
  el.addEventListener('click', e => {
    const btn = e.target.closest('button'); if (!btn) return;
    const id = btn.closest('[data-scenario]').dataset.scenario;
    startScenario(id);
    el.classList.add('hidden');
    document.getElementById('scenario-active').classList.remove('hidden');
  });
}

function renderActiveScenario() {
  const el = document.getElementById('scenario-active'); if (!el) return;
  const s = SCENARIOS.find(x => x.id === state.scenario.id); if (!s) return;
  const items = state.scenario.checklist.map(c => `<li class="${c.done ? 'done' : ''}">${c.done ? '✔' : '○'} ${c.label}</li>`).join('');
  el.innerHTML = `
    <header><h2>${s.icon} ${s.title}</h2><button id="scenario-end">End</button></header>
    <p>${s.intro}</p>
    <ul class="scenario-checklist">${items}</ul>
    ${state.scenario.summary ? `<div class="scenario-summary"><strong>Summary:</strong> ${state.scenario.summary}</div>` : ''}
  `;
  document.getElementById('scenario-end').onclick = endScenario;
}
