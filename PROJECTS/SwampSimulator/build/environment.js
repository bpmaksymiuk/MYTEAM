// environment.js — environmental events and seasons (DI-007)
import { state } from './state.js';
import { SPECIES } from './species.js';
import { applyTerrainSeason } from './terrain.js';

const SEASONS = ['spring','summer','autumn','winter'];

export function triggerEvent(type, opts = {}) {
  if (state.events.active[type]) return;
  const auto = opts.autoClearSec ?? defaultAutoClear(type);
  state.events.active[type] = { startTick: state.tick, autoClearAt: auto ? state.tick + auto * 30 : null };
  state.events.log.push({ type, kind: 'start', tick: state.tick, day: Math.floor(state.environment.dayOfYear), text: `${labelOf(type)} began.` });
  if (typeof document !== 'undefined') document.body.classList.add('event-' + type);
}

export function clearEvent(type) {
  if (!state.events.active[type]) return;
  delete state.events.active[type];
  state.events.log.push({ type, kind: 'end', tick: state.tick, day: Math.floor(state.environment.dayOfYear), text: `${labelOf(type)} ended.` });
  if (typeof document !== 'undefined') document.body.classList.remove('event-' + type);
}

function defaultAutoClear(type) {
  return ({ runoff: 10, coldsnap: 60, fire: 30 })[type] || null;
}

export function labelOf(type) {
  return ({
    drought: 'Drought', flood: 'Flood', pollution: 'Pollution',
    fire: 'Fire', runoff: 'Nutrient runoff', coldsnap: 'Cold snap',
  })[type] || type;
}

export function tickEnvironment(dt) {
  const env = state.environment;
  const ev = state.events.active;

  // auto-clear
  for (const t of Object.keys(ev)) {
    if (ev[t].autoClearAt && state.tick > ev[t].autoClearAt) clearEvent(t);
  }

  // Drought
  if (ev.drought) {
    env.waterLevel = Math.max(0.4, env.waterLevel - 0.005 * dt);
    env.oxygen = Math.max(0.2, env.oxygen - 0.002 * dt);
  } else if (env.waterLevel < env.waterBaseline) {
    env.waterLevel = Math.min(env.waterBaseline, env.waterLevel + 0.003 * dt);
  } else if (env.waterLevel > env.waterBaseline && !ev.flood) {
    env.waterLevel = Math.max(env.waterBaseline, env.waterLevel - 0.003 * dt);
  }
  // Flood
  if (ev.flood) env.waterLevel = Math.min(1.6, env.waterLevel + 0.005 * dt);
  // Pollution
  if (ev.pollution) env.oxygen = Math.max(0.15, env.oxygen - 0.003 * dt);
  // Runoff: ramps nutrient
  if (ev.runoff) env.nutrient = Math.min(3.0, env.nutrient + 0.2 * dt);
  else env.nutrient += (1.0 - env.nutrient) * 0.02 * dt;
  // Oxygen recovery
  if (!ev.pollution && !ev.drought) env.oxygen += (1.0 - env.oxygen) * 0.02 * dt;
  // Cold snap
  if (ev.coldsnap) env.temperature += (4 - env.temperature) * 0.05 * dt;
  else {
    const target = baseTemperatureForSeason(env.season);
    env.temperature += (target - env.temperature) * 0.02 * dt;
  }

  // Algae bloom auto-detection: log it
  if (env.nutrient > 1.8 && !state.events.log.some(e => e.type === 'bloom' && e.kind === 'start' && state.tick - e.tick < 300)) {
    state.events.log.push({ type: 'bloom', kind: 'event', tick: state.tick, day: Math.floor(env.dayOfYear), text: 'Algae bloom detected.' });
  }

  // Day / season advance
  env.dayOfYear += dt / state.settings.seasonLengthSec * 30;
  if (env.dayOfYear > 360) env.dayOfYear -= 360;
  const newSeason = seasonForDay(env.dayOfYear);
  if (newSeason !== env.season) {
    const old = env.season;
    env.season = newSeason;
    state.events.log.push({ type: 'season', kind: 'event', tick: state.tick, day: Math.floor(env.dayOfYear), text: `Season changed: ${old} → ${newSeason}.` });
    if (typeof document !== 'undefined') {
      document.body.classList.remove('season-' + old);
      document.body.classList.add('season-' + newSeason);
    }
    migratorySync();
    applyTerrainSeason(state.terrain, newSeason);
  }

  // Periodic alert sweeps
  if (state.tick % 300 === 0) sweepPopulationAlerts();
}

function seasonForDay(d) {
  if (d < 90) return 'spring';
  if (d < 180) return 'summer';
  if (d < 270) return 'autumn';
  return 'winter';
}
function baseTemperatureForSeason(s) {
  return ({ spring: 20, summer: 28, autumn: 16, winter: 8 })[s] || 20;
}

export function migratorySync() {
  for (const sp of SPECIES) if (sp.isMigratory) {
    const arr = state.agents[sp.id] ||= [];
    if (state.environment.season === 'autumn' || state.environment.season === 'winter') {
      arr.length = 0;
    } else if (arr.length === 0) {
      // spawn baseline
      for (let i = 0; i < sp.baselineCount; i++) arr.push(makeAgent(sp));
    }
  }
}

function makeAgent(sp) {
  return {
    id: state.nextId++, species: sp.id,
    x: Math.random() * state.canvas.w, y: Math.random() * state.canvas.h,
    vx: 0, vy: 0, energy: sp.reproThreshold * 0.6 || 50, age: 0, target: null,
  };
}

const ALERT_SEEN = {};
function sweepPopulationAlerts() {
  for (const sp of SPECIES) {
    if (sp.isPlant) continue;
    const cur = state.agents[sp.id]?.length || 0;
    const base = sp.baselineCount;
    const key = sp.id;
    const ratio = base ? cur / base : 1;
    if (cur === 0 && ALERT_SEEN[key] !== 'extinct') {
      state.events.log.push({ type: 'alert', kind: 'extinction', tick: state.tick, day: Math.floor(state.environment.dayOfYear), text: `${sp.commonName} went extinct.` });
      ALERT_SEEN[key] = 'extinct';
    } else if (ratio < 0.10 && ALERT_SEEN[key] !== 'low' && ALERT_SEEN[key] !== 'extinct') {
      state.events.log.push({ type: 'alert', kind: 'warn', tick: state.tick, day: Math.floor(state.environment.dayOfYear), text: `${sp.commonName} dropped below 10% of baseline.` });
      ALERT_SEEN[key] = 'low';
    } else if (ratio > 0.9 && ALERT_SEEN[key] && ALERT_SEEN[key] !== 'recovered') {
      state.events.log.push({ type: 'alert', kind: 'event', tick: state.tick, day: Math.floor(state.environment.dayOfYear), text: `${sp.commonName} returned to baseline.` });
      ALERT_SEEN[key] = 'recovered';
      delete ALERT_SEEN[key];
    }
  }
  if (state.events.log.length > 200) state.events.log.splice(0, state.events.log.length - 200);
}

export function resetAlertMemory() { for (const k of Object.keys(ALERT_SEEN)) delete ALERT_SEEN[k]; }
