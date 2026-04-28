// main.js — entry point and main loop (DI-017, DI-037)
import { state, dayString } from './state.js';
import { SPECIES } from './species.js';
import { tick, spawnAgent, spawnPlantPatch, demolishDam } from './sim.js';
import { tickEnvironment, migratorySync } from './environment.js';
import { updateGatorHoles } from './gatorhole.js';
import { progressDam } from './beaverdam.js';
import { render } from './renderer.js';
import { renderGraph, nodeAt, initLayout } from './foodweb.js';
import { mountDashboard, updateDashboard } from './dashboard.js';
import { openInspector, agentAt } from './inspector.js';
import { mountIntervention, updateIntervention } from './intervention.js';
import { mountScenarioPicker, tickScenario } from './scenarios.js';
import { saveSlot, loadSlot, listSlots, deleteSlot } from './storage.js';
import { loadAssets } from './assets.js';
import { generateTerrain } from './terrain.js';
import { tickParticles } from './particles.js';

const canvas = document.getElementById('sim-canvas');
const ctx = canvas.getContext('2d');
const fwCanvas = document.getElementById('foodweb-canvas');
const fwCtx = fwCanvas?.getContext('2d');

function fitCanvas() {
  const rect = canvas.parentElement.getBoundingClientRect();
  canvas.width = state.canvas.w = Math.max(400, Math.floor(rect.width));
  canvas.height = state.canvas.h = Math.max(300, Math.floor(rect.height));
  if (fwCanvas) {
    const r2 = fwCanvas.parentElement.getBoundingClientRect();
    fwCanvas.width = Math.max(400, Math.floor(r2.width));
    fwCanvas.height = Math.max(300, Math.floor(r2.height));
    initLayout(fwCanvas.width, fwCanvas.height);
  }
}
window.addEventListener('resize', fitCanvas);

// Spawn baseline
function seedBaseline() {
  for (const sp of SPECIES) {
    const n = sp.baselineCount;
    for (let i = 0; i < n; i++) {
      if (sp.isPlant) spawnPlantPatch(sp.id);
      else spawnAgent(sp.id);
    }
  }
}

// Top-nav switching
document.querySelectorAll('#top-nav [data-screen]').forEach(b => {
  b.addEventListener('click', () => switchScreen(b.dataset.screen));
});
function switchScreen(name) {
  state.ui.currentScreen = name;
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById('screen-' + name)?.classList.add('active');
  document.querySelectorAll('#top-nav [data-screen]').forEach(b => b.classList.toggle('active', b.dataset.screen === name));
  if (name === 'foodweb' && fwCanvas) initLayout(fwCanvas.width, fwCanvas.height);
  if (name === 'saveload') refreshSaveSlots();
}

// Time controls
document.getElementById('btn-pause')?.addEventListener('click', () => state.paused = true);
document.getElementById('btn-play')?.addEventListener('click', () => state.paused = false);
document.querySelectorAll('[data-speed]').forEach(b => b.addEventListener('click', () => { state.settings.speed = +b.dataset.speed; }));
document.getElementById('btn-skip-season')?.addEventListener('click', () => {
  const d = state.environment.dayOfYear;
  state.environment.dayOfYear = (Math.floor(d / 90) + 1) * 90 + 0.1;
  if (state.environment.dayOfYear >= 360) state.environment.dayOfYear = 0.1;
});

// Canvas click → inspector
canvas.addEventListener('click', e => {
  const r = canvas.getBoundingClientRect();
  const x = e.clientX - r.left, y = e.clientY - r.top;
  const a = agentAt(x, y);
  if (a) openInspector(a.species);
});

// Foodweb canvas click
fwCanvas?.addEventListener('click', e => {
  const r = fwCanvas.getBoundingClientRect();
  const x = e.clientX - r.left, y = e.clientY - r.top;
  const id = nodeAt(x, y);
  if (id) { state.ui.foodwebSelected = id; openInspector(id); }
  else { state.ui.foodwebSelected = null; }
});

// Overlay toggles
document.querySelectorAll('[data-overlay]').forEach(b => b.addEventListener('click', () => {
  const k = b.dataset.overlay;
  state.settings.overlays[k] = !state.settings.overlays[k];
  b.classList.toggle('active', state.settings.overlays[k]);
}));

// Save/Load slots
function refreshSaveSlots() {
  const wrap = document.getElementById('saveload-list'); if (!wrap) return;
  const slots = listSlots();
  wrap.innerHTML = slots.map(s => `
    <article class="save-slot" data-slot="${s.n}">
      <h3>Slot ${s.n}</h3>
      <p>${s.exists ? escapeHtml(s.summary) : 'Empty'}</p>
      ${s.exists ? `<p class="muted">saved ${new Date(s.timestamp).toLocaleString()}</p>` : ''}
      <button data-act="save">Save</button>
      <button data-act="load" ${s.exists?'':'disabled'}>Load</button>
      <button data-act="delete" ${s.exists?'':'disabled'}>Delete</button>
    </article>`).join('');
  wrap.onclick = (e) => {
    const btn = e.target.closest('button'); if (!btn) return;
    const slot = +btn.closest('.save-slot').dataset.slot;
    const act = btn.dataset.act;
    try {
      if (act === 'save') saveSlot(slot);
      if (act === 'load') loadSlot(slot);
      if (act === 'delete') deleteSlot(slot);
    } catch (err) { alert(err.message); }
    refreshSaveSlots();
  };
}
function escapeHtml(s) { return String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])); }

function parseOrCreateSeed() {
  const m = (location.hash || '').match(/(?:^#|&)seed=([0-9]+)/);
  let seed = Number.parseInt(m?.[1] || '', 10);
  if (!Number.isInteger(seed) || seed < 1 || seed > 99999) {
    seed = 1 + ((Math.random() * 99999) | 0);
  }
  return seed;
}

function updateAmbientEq() {
  const eq = document.getElementById('ambient-eq');
  if (!eq) return;
  let total = 0;
  for (const arr of Object.values(state.agents || {})) total += arr?.length || 0;
  const level = Math.max(0, Math.min(1, total / 200));
  eq.title = `Ecosystem activity - ${total} organisms`;
  eq.setAttribute('aria-label', `Ecosystem activity: ${total} organisms`);
  const bars = eq.querySelectorAll('.eq-bar');
  bars.forEach((bar, i) => {
    bar.style.opacity = (0.35 + 0.65 * level).toFixed(2);
    bar.style.animationDuration = `${(0.95 - 0.45 * level + i * 0.03).toFixed(2)}s`;
  });
}

// Boot
async function boot() {
  fitCanvas();
  // PT-027 / DI-028 — preload all sprites + UI before sim starts
  try {
    await loadAssets({
      onProgress: (loaded, total) => {
        const el = document.getElementById('loading-progress');
        if (el) el.textContent = Math.round(100 * loaded / total) + '%';
      }
    });
    document.body.classList.add('assets-ready');
  } catch (e) {
    const o = document.getElementById('loading-overlay');
    if (o) o.innerHTML = `<div class="loading-fail">${e.message}</div>`;
    console.error(e);
    return;
  }

  // Terrain init — seed from URL hash or generate
  {
    const seed = parseOrCreateSeed();
    state.terrain.seed = seed;
    const t = generateTerrain(seed, state.canvas.w, state.canvas.h, 0);
    state.terrain.biomeMap = t.biomeMap;
    state.terrain.dirty = true;
    if (location.hash !== `#seed=${seed}`) history.replaceState(null, '', `#seed=${seed}`);
    const chip = document.getElementById('seed-chip');
    if (chip) chip.textContent = `#seed: ${seed}`;
  }

  // Dam click inspector
  canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const cx = (e.clientX - rect.left) * (state.canvas.w / rect.width);
    const cy = (e.clientY - rect.top)  * (state.canvas.h / rect.height);
    for (const dam of state.dams) {
      if (Math.abs(cx - dam.x) < dam.width/2 + 10 && Math.abs(cy - dam.y) < 20) {
        const tooltip = document.getElementById('dam-tooltip');
        if (tooltip) {
          const pct = (dam.progress*100)|0, hpct = (dam.health*100)|0;
          const users = (dam.builders?.length || 0) > 0 ? `beaver x${dam.builders.length}` : 'none observed';
          tooltip.innerHTML = `<strong>Beaver Dam</strong><br>Progress: ${pct}%<br>Health: ${hpct}%<br>Users: ${users}
            <br><button class="dam-demolish" style="margin-top:6px" data-demolish="${dam.id}">Demolish</button>
            <button class="dam-close" style="margin-top:6px;margin-left:6px">Close</button>`;
          tooltip.style.left = (e.clientX + 12) + 'px';
          tooltip.style.top  = (e.clientY - 20) + 'px';
          tooltip.classList.remove('hidden');
          tooltip.querySelector('.dam-demolish')?.addEventListener('click', (ev) => {
            demolishDam(Number.parseInt(ev.target.dataset.demolish, 10));
            tooltip.classList.add('hidden');
          }, { once: true });
          tooltip.querySelector('.dam-close')?.addEventListener('click', () => {
            tooltip.classList.add('hidden');
          }, { once: true });
        }
        return;
      }
    }
    // Otherwise close tooltip
    document.getElementById('dam-tooltip')?.classList.add('hidden');
  });

  document.body.classList.add('season-' + state.environment.season);
  seedBaseline();
  mountIntervention();
  mountDashboard();
  mountScenarioPicker();
  refreshSaveSlots();
  updateAmbientEq();
  switchScreen('canvas');
  let last = performance.now();
  function loop(t) {
    const dtFrame = Math.min(0.05, (t - last) / 1000); last = t;
    const dt = dtFrame * (state.paused ? 0 : state.settings.speed);
    if (dt > 0) {
      tickEnvironment(dt);
      tick(dt);
      tickParticles(dt);
      updateGatorHoles(state);
      progressDam(state, dt);
      if (state.scenario.id) tickScenario();
    }
    render(ctx, state.canvas.w, state.canvas.h);
    if (state.ui.currentScreen === 'foodweb' && fwCtx) renderGraph(fwCtx, fwCanvas.width, fwCanvas.height);
    if (state.ui.currentScreen === 'dashboard') updateDashboard();
    if (state.ui.currentScreen === 'intervention' && state.tick % 30 === 0) updateIntervention();
    if (state.tick % 30 === 0) updateAmbientEq();
    const tr = document.getElementById('time-readout'); if (tr) tr.textContent = dayString();
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
}

window._state = state;
window._loadSlot = loadSlot; window._saveSlot = saveSlot;
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
else boot();
