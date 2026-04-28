// storage.js — DI-016
import { state } from './state.js';

const KEY = n => `swamp:save:${n}`;
const META = n => `swamp:meta:${n}`;

export function saveSlot(n) {
  // Strip non-serialisable terrain.biomeMap (Uint8Array, regenerable from seed)
  const replacer = (k, v) => (k === 'biomeMap' ? null : v);
  const s = JSON.stringify(state, replacer);
  if (s.length > 5_000_000) throw new Error('Cannot save: state exceeds 5 MB browser limit.');
  if (s.length > 4_000_000) console.warn('Save data approaching 5 MB.');
  localStorage.setItem(KEY(n), s);
  localStorage.setItem(META(n), JSON.stringify({ timestamp: Date.now(), summary: makeSummary() }));
  return true;
}

export function loadSlot(n) {
  const raw = localStorage.getItem(KEY(n)); if (!raw) return false;
  const obj = JSON.parse(raw);
  for (const k of Object.keys(obj)) state[k] = obj[k];
  // Regenerate non-serialised biome map from saved seed
  if (state.terrain && state.terrain.seed != null && state.canvas) {
    import('./terrain.js').then(({ generateTerrain }) => {
      const t = generateTerrain(state.terrain.seed, state.canvas.w, state.canvas.h, state.terrain.seasonOffset || 0);
      state.terrain.biomeMap = t.biomeMap;
      state.terrain.dirty = true;
    });
  }
  // re-init animator state on every restored agent (not serialised — AR-014)
  import('./animator.js').then(({ initAnim }) => {
    import('./species.js').then(({ getSpecies }) => {
      for (const k of Object.keys(state.agents)) {
        const arr = state.agents[k]; if (!arr) continue;
        const sp = getSpecies(k);
        for (const a of arr) initAnim(a, sp);
      }
    });
  });
  return true;
}

export function deleteSlot(n) {
  localStorage.removeItem(KEY(n)); localStorage.removeItem(META(n));
}

export function listSlots() {
  return [1,2,3].map(n => {
    const exists = !!localStorage.getItem(KEY(n));
    let meta = null;
    try { meta = JSON.parse(localStorage.getItem(META(n)) || 'null'); } catch {}
    return { n, exists, timestamp: meta?.timestamp || null, summary: meta?.summary || '' };
  });
}

function makeSummary() {
  const day = Math.floor(state.environment.dayOfYear);
  const ev = Object.keys(state.events.active);
  const evName = ev.length ? ev[0] : 'stable';
  let atRisk = 0;
  for (const k of Object.keys(state.agents)) {
    const arr = state.agents[k]; if (!arr) continue;
    // crude at-risk: count empty species
    if (arr.length === 0) atRisk++;
  }
  return `Day ${day} · ${evName} · ${atRisk} species at risk`;
}
