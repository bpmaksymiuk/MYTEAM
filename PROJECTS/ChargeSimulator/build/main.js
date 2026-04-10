// main.js — DI-006
// Entry point: wires all modules, binds DOM events, runs game loop.

import { simulate }        from './physics.js';
import { render }          from './renderer.js';
import { state, nextId }   from './state.js';
import { ChallengeManager }from './challenges.js';
import { StorageManager }  from './storage.js';
import { AudioManager }    from './audio.js';

// ── Canvas setup ──────────────────────────────────────────────────────────────
const canvas = document.getElementById('sim-canvas');
const ctx    = canvas.getContext('2d');
const panel  = document.getElementById('panel');

function resizeCanvas() {
  canvas.width  = window.innerWidth - panel.offsetWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// ── Tool buttons ─────────────────────────────────────────────────────────────
document.querySelectorAll('[data-tool]').forEach(btn => {
  btn.addEventListener('click', () => {
    state.activeTool = btn.dataset.tool;
    document.querySelectorAll('[data-tool]').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  });
});

// ── Canvas mouse interaction ──────────────────────────────────────────────────
let isDrawing = false, startX = 0, startY = 0;
let previewBarrier = null;

canvas.addEventListener('mousedown', e => {
  AudioManager.init();
  isDrawing = true;
  startX = e.offsetX;
  startY = e.offsetY;
  previewBarrier = null;
});

canvas.addEventListener('mousemove', e => {
  if (!isDrawing) return;
  if (state.activeTool === 'barrier') {
    previewBarrier = { x1: startX, y1: startY, x2: e.offsetX, y2: e.offsetY };
  }
});

canvas.addEventListener('mouseup', e => {
  if (!isDrawing) return;
  isDrawing = false;
  const endX = e.offsetX, endY = e.offsetY;

  switch (state.activeTool) {
    case 'emitter':
      state.emitters.push({ id: nextId(), x: endX, y: endY, rate: state.settings.spawnRate, accum: 0 });
      break;
    case 'collector':
      state.collectors.push({ id: nextId(), x: endX, y: endY, strength: 3, absorbedCount: 0, radius: 18 });
      break;
    case 'barrier': {
      const dx = endX - startX, dy = endY - startY;
      if (Math.sqrt(dx*dx + dy*dy) > 5) {
        state.barriers.push({ id: nextId(), x1: startX, y1: startY, x2: endX, y2: endY });
      }
      previewBarrier = null;
      break;
    }
    case 'delete': {
      const SNAP = 20;
      // Try emitter
      const ei = state.emitters.findIndex(e => Math.hypot(e.x-endX, e.y-endY) < SNAP);
      if (ei >= 0) { state.emitters.splice(ei, 1); break; }
      // Try collector
      const ci = state.collectors.findIndex(c => Math.hypot(c.x-endX, c.y-endY) < SNAP);
      if (ci >= 0) { state.collectors.splice(ci, 1); break; }
      // Try barrier (distance to segment midpoint)
      const bi = state.barriers.findIndex(b => {
        const mx = (b.x1+b.x2)/2, my = (b.y1+b.y2)/2;
        return Math.hypot(mx-endX, my-endY) < SNAP * 2;
      });
      if (bi >= 0) state.barriers.splice(bi, 1);
      break;
    }
  }
});

// ── Sliders ───────────────────────────────────────────────────────────────────
function bindSlider(id, settingKey, displayId, transform) {
  const el = document.getElementById(id);
  const dsp = document.getElementById(displayId);
  el.addEventListener('input', () => {
    const v = parseFloat(el.value);
    state.settings[settingKey] = transform ? transform(v) : v;
    if (dsp) dsp.textContent = el.value;
  });
}

bindSlider('spawn-rate',    'spawnRate',     'spawn-rate-val',    null);
bindSlider('field-strength','fieldStrength', 'field-strength-val',null);
bindSlider('friction',      'friction',      'friction-val',      null);
bindSlider('slow-mo',       'slowMo',        'slow-mo-val',       v => v / 100);

// ── Toggle buttons ────────────────────────────────────────────────────────────
document.querySelectorAll('[data-toggle]').forEach(btn => {
  btn.addEventListener('click', () => {
    const key = btn.dataset.toggle;
    state.settings[key] = !state.settings[key];
    btn.classList.toggle('active', state.settings[key]);

    if (key === 'darkMode') {
      document.body.classList.toggle('dark-mode', state.settings.darkMode);
    }
    if (key === 'statsOpen') {
      document.getElementById('stats-overlay').classList.toggle('hidden', !state.settings.statsOpen);
    }
  });
});

// ── Challenge buttons ─────────────────────────────────────────────────────────
document.querySelectorAll('[data-challenge]').forEach(btn => {
  btn.addEventListener('click', () => {
    const mode = btn.dataset.challenge;
    if (mode === 'sandbox') {
      state.particles.length  = 0;
      state.emitters.length   = 0;
      state.collectors.length = 0;
      state.barriers.length   = 0;
      state.challenge         = null;
      ChallengeManager.mode   = null;
    } else {
      ChallengeManager.start(mode, canvas.width, canvas.height);
    }
    document.querySelectorAll('[data-challenge]').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('challenge-overlay').classList.add('hidden');
  });
});

// ── Challenge overlay close ───────────────────────────────────────────────────
document.getElementById('btn-close-challenge').addEventListener('click', () => {
  document.getElementById('challenge-overlay').classList.add('hidden');
});

// ── Save / Load ───────────────────────────────────────────────────────────────
document.querySelectorAll('[data-save]').forEach(btn => {
  btn.addEventListener('click', () => StorageManager.save(parseInt(btn.dataset.save)));
});
document.querySelectorAll('[data-load]').forEach(btn => {
  btn.addEventListener('click', () =>
    StorageManager.load(parseInt(btn.dataset.load), applySettingsToSliders)
  );
});

function applySettingsToSliders(settings) {
  const map = {
    'spawn-rate':     ['spawnRate',     v => v],
    'field-strength': ['fieldStrength', v => v],
    'friction':       ['friction',      v => v],
    'slow-mo':        ['slowMo',        v => Math.round(v * 100)],
  };
  for (const [id, [key, toDisplay]] of Object.entries(map)) {
    const el = document.getElementById(id);
    const dsp = document.getElementById(id + '-val');
    if (el) { el.value = toDisplay(settings[key]); }
    if (dsp) { dsp.textContent = toDisplay(settings[key]); }
  }
  document.body.classList.toggle('dark-mode', settings.darkMode);
  document.querySelectorAll('[data-toggle]').forEach(btn => {
    btn.classList.toggle('active', !!settings[btn.dataset.toggle]);
  });
  document.getElementById('stats-overlay').classList.toggle('hidden', !settings.statsOpen);
}

// ── Stats ─────────────────────────────────────────────────────────────────────
let collisionsLastSec = 0;
let collisionAccum    = 0;
let lastStatTime      = 0;

export function recordCollision() { collisionAccum++; }

function updateStats() {
  if (!state.settings.statsOpen) return;
  const now = Date.now();
  if (now - lastStatTime >= 1000) {
    collisionsLastSec = collisionAccum;
    collisionAccum    = 0;
    lastStatTime      = now;
  }
  document.getElementById('stat-particles').textContent  = state.particles.length;
  document.getElementById('stat-elements').textContent   =
    state.emitters.length + state.collectors.length + state.barriers.length;
  document.getElementById('stat-collisions').textContent = collisionsLastSec;
  const energy = state.particles.reduce((s, p) => s + Math.sqrt(p.vx*p.vx + p.vy*p.vy), 0);
  document.getElementById('stat-energy').textContent = energy.toFixed(0);
}

// ── Preview barrier draw ──────────────────────────────────────────────────────
function drawPreview() {
  if (!previewBarrier) return;
  const b = previewBarrier;
  ctx.save();
  ctx.strokeStyle = 'rgba(120,160,220,0.5)';
  ctx.lineWidth = 2;
  ctx.setLineDash([6, 4]);
  ctx.beginPath();
  ctx.moveTo(b.x1, b.y1);
  ctx.lineTo(b.x2, b.y2);
  ctx.stroke();
  ctx.restore();
}

// ── Game loop ─────────────────────────────────────────────────────────────────
let last = 0;
function loop(ts) {
  const dt = Math.min(ts - last, 50);
  last = ts;

  simulate(dt, canvas.width, canvas.height);
  if (state.challenge) ChallengeManager.update(dt, canvas.width, canvas.height);
  render(ctx, canvas.width, canvas.height);
  drawPreview();
  updateStats();

  requestAnimationFrame(loop);
}
requestAnimationFrame(ts => { last = ts; requestAnimationFrame(loop); });

// Expose state for Playwright tests (DI-010)
window._state = state;
