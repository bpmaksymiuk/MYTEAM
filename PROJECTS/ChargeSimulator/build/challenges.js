// challenges.js — DI-007
// Challenge mode manager: Maze Escape, Balance, Containment.

import { state, nextId } from './state.js';

// ── Maze definition (relative 0-1 coords; scaled at start time) ─────────────
const MAZE_DEF = [
  // outer walls are canvas boundaries
  // vertical dividers with gaps
  [0.20, 0.0,  0.20, 0.4],
  [0.20, 0.6,  0.20, 1.0],
  [0.40, 0.0,  0.40, 0.3],
  [0.40, 0.5,  0.40, 1.0],
  [0.60, 0.0,  0.60, 0.5],
  [0.60, 0.7,  0.60, 1.0],
  [0.80, 0.0,  0.80, 0.4],
  [0.80, 0.6,  0.80, 1.0],
];

function scaleMaze(W, H) {
  return MAZE_DEF.map(([x1r, y1r, x2r, y2r]) => ({
    id: nextId(),
    x1: x1r * W, y1: y1r * H,
    x2: x2r * W, y2: y2r * H,
  }));
}

export const ChallengeManager = {
  mode:      null,
  startTime: 0,
  score:     0,

  start(mode, canvasW, canvasH) {
    // Clear simulation
    state.particles.length  = 0;
    state.emitters.length   = 0;
    state.collectors.length = 0;
    state.barriers.length   = 0;
    state.challenge         = mode;
    this.mode               = mode;
    this.startTime          = Date.now();

    const W = canvasW, H = canvasH;

    if (mode === 'maze-escape') {
      state.barriers.push(...scaleMaze(W, H));
      state.emitters.push({ id: nextId(), x: 30,   y: H/2, rate: 3, accum: 0 });
      state.collectors.push({
        id: 'exit', x: W - 30, y: H/2,
        strength: 6, absorbedCount: 0, radius: 20,
      });

    } else if (mode === 'balance') {
      state.collectors.push(
        { id: nextId(), x: W*0.25, y: H*0.5, strength: 4, absorbedCount: 0, radius: 18 },
        { id: nextId(), x: W*0.75, y: H*0.5, strength: 4, absorbedCount: 0, radius: 18 },
      );
      // Spawn 20 neutral-velocity particles at centre
      for (let i = 0; i < 20; i++) {
        const angle = (i / 20) * Math.PI * 2;
        state.particles.push({
          id: nextId(), x: W/2 + Math.cos(angle)*40, y: H/2 + Math.sin(angle)*40,
          vx: 0, vy: 0, trail: [],
        });
      }

    } else if (mode === 'containment') {
      state.emitters.push({ id: nextId(), x: W/2, y: H/2, rate: 2, accum: 0 });
    }
  },

  update(dt, canvasW, canvasH) {
    if (!this.mode) return;
    const elapsed = Date.now() - this.startTime;

    if (this.mode === 'containment') {
      // Escalate spawn rate every 5 s
      const em = state.emitters[0];
      if (em) em.rate = 2 + Math.floor(elapsed / 5000);
      // Fail if any particle exits canvas
      for (const p of state.particles) {
        if (p.x < 0 || p.x > canvasW || p.y < 0 || p.y > canvasH) {
          this._end('fail', elapsed);
          return;
        }
      }

    } else if (this.mode === 'balance') {
      if (state.particles.length === 0) {
        this._end('fail', elapsed);
      }

    } else if (this.mode === 'maze-escape') {
      const exit = state.collectors.find(c => c.id === 'exit');
      if (state.particles.length === 0 && exit && exit.absorbedCount > 0) {
        this._end('win', elapsed);
      }
    }
  },

  _end(result, elapsed) {
    this.score   = (elapsed / 1000).toFixed(1);
    this.mode    = null;
    state.challenge = null;

    const overlay = document.getElementById('challenge-overlay');
    const msg     = document.getElementById('challenge-message');
    const scoreEl = document.getElementById('challenge-score');
    if (overlay && msg && scoreEl) {
      msg.textContent   = result === 'win' ? '🏆 You Win!' : '💥 Challenge Failed';
      scoreEl.textContent = `Time: ${this.score}s`;
      overlay.classList.remove('hidden');
    }
  },
};
