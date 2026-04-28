// intervention.js — DI-014
import { state } from './state.js';
import { SPECIES, getSpecies } from './species.js';
import { spawnAgent, spawnPlantPatch, removeAllOfSpecies } from './sim.js';
import { triggerEvent, clearEvent, labelOf, resetAlertMemory } from './environment.js';
import { removeDam } from './beaverdam.js';

const EVENTS = ['drought','flood','pollution','fire','runoff','coldsnap'];
const EVENT_DESC = {
  drought: 'Lowers water level and stresses aquatic species.',
  flood: 'Raises water level and displaces shoreline animals.',
  pollution: 'Taints the water; sensitive species lose energy faster.',
  fire: 'Burns shoreline plants until the event clears.',
  runoff: 'Spikes nutrients and triggers fast algae growth.',
  coldsnap: 'Drops temperature; cold-blooded species slow down.',
};

export function mountIntervention() {
  const sc = document.getElementById('species-controls');
  const ec = document.getElementById('event-controls');
  if (!sc || !ec) return;
  sc.innerHTML = '<h3>Species</h3>' + SPECIES.map(sp => `
    <div class="species-row" data-species="${sp.id}">
      <img class="species-portrait" src="./images/portraits/${sp.id}.svg" alt="" width="32" height="32">
      <span class="species-name">${sp.commonName}</span>
      <span class="pop" data-pop="${sp.id}">0 alive</span>
      <button data-act="add1">+1</button>
      <button data-act="add10">+10</button>
      <button data-act="remove">Remove all</button>
    </div>`).join('');
  ec.innerHTML = '<h3>Trigger an environmental event</h3>' + EVENTS.map(t => `
    <div class="event-card" data-event="${t}">
      <img class="event-icon" src="./images/ui/event-${t}.svg" alt="">
      <div><h4>${labelOf(t)}</h4><p>${EVENT_DESC[t]}</p></div>
      <span><button data-act="trigger">Trigger</button> <button data-act="clear">Clear</button></span>
    </div>`).join('');
  sc.addEventListener('click', onSpeciesClick);
  ec.addEventListener('click', onEventClick);
  const restore = document.getElementById('btn-restore');
  if (restore) restore.onclick = restoreBaseline;
  updateIntervention();
}

function onSpeciesClick(e) {
  const btn = e.target.closest('button'); if (!btn) return;
  const row = btn.closest('.species-row'); const id = row.dataset.species; const sp = getSpecies(id);
  const act = btn.dataset.act;
  if (act === 'add1') addSome(sp, 1);
  if (act === 'add10') addSome(sp, 10);
  if (act === 'remove') {
    removeAllOfSpecies(id);
    state.events.log.push({ type: 'remove', kind: 'event', tick: state.tick, day: Math.floor(state.environment.dayOfYear), text: `${sp.commonName} removed by user.` });
  }
  updateIntervention();
}
function addSome(sp, n) {
  for (let i = 0; i < n; i++) {
    if (sp.isPlant) spawnPlantPatch(sp.id, Math.random()*state.canvas.w, Math.random()*state.canvas.h, 1);
    else spawnAgent(sp.id, Math.random()*state.canvas.w, Math.random()*state.canvas.h);
  }
}
function onEventClick(e) {
  const btn = e.target.closest('button'); if (!btn) return;
  const card = btn.closest('.event-card'); const t = card.dataset.event;
  if (btn.dataset.act === 'trigger') triggerEvent(t);
  else clearEvent(t);
  updateIntervention();
}

export function updateIntervention() {
  // populations
  for (const sp of SPECIES) {
    const el = document.querySelector(`[data-pop="${sp.id}"]`);
    if (el) {
      const n = sp.isPlant ? (state.plantPatches[sp.id]?.length || 0) : (state.agents[sp.id]?.length || 0);
      el.textContent = `${n} alive`;
    }
  }
  // active events
  const ae = document.getElementById('active-events');
  if (ae) {
    const keys = Object.keys(state.events.active);
    ae.innerHTML = '<h3>Active events</h3>' + (keys.length ? keys.map(k => {
      const e = state.events.active[k];
      const cd = e.autoClearAt ? `clears in ${Math.max(0, Math.ceil((e.autoClearAt - state.tick)/30))}s` : 'manual';
      return `<div class="active-event">${labelOf(k)} · ${cd}</div>`;
    }).join('') : '<p class="muted">none</p>');
  }
}

export function restoreBaseline() {
  for (const sp of SPECIES) removeAllOfSpecies(sp.id);
  for (const t of Object.keys(state.events.active)) clearEvent(t);
  state.events.log.length = 0;
  state.events.predationLog.length = 0;
  state.environment.waterLevel = 1.0; state.environment.waterBaseline = 1.0;
  state.environment.nutrient = 1.0; state.environment.oxygen = 1.0; state.environment.temperature = 22;
  state.gatorHoles.length = 0; removeDam(state); resetAlertMemory();
  // spawn baseline counts
  for (const sp of SPECIES) {
    const n = sp.baselineCount;
    for (let i = 0; i < n; i++) {
      if (sp.isPlant) spawnPlantPatch(sp.id);
      else spawnAgent(sp.id);
    }
  }
  state.events.log.push({ type: 'restore', kind: 'event', tick: state.tick, day: Math.floor(state.environment.dayOfYear), text: 'Baseline populations restored.' });
  updateIntervention();
}
