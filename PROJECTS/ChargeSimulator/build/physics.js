// physics.js — DI-004
// Simulation engine: Coulomb forces, emitter spawning, absorption, reflection, friction.

import { state, nextId } from './state.js';
import { AudioManager } from './audio.js';

const K_REPEL  = 5000;   // particle–particle repulsion constant
const K_ATTRACT= 8000;   // collector–particle attraction constant
const MAX_PARTICLES = 500;
const BUCKET_SIZE   = 50;

// ── Spatial grid ─────────────────────────────────────────────────────────────
function buildGrid(particles, W, H) {
  const cols = Math.ceil(W / BUCKET_SIZE);
  const rows = Math.ceil(H / BUCKET_SIZE);
  const grid = new Map();
  for (const p of particles) {
    const bx = Math.floor(p.x / BUCKET_SIZE);
    const by = Math.floor(p.y / BUCKET_SIZE);
    const key = `${bx},${by}`;
    if (!grid.has(key)) grid.set(key, []);
    grid.get(key).push(p);
  }
  return { grid, cols, rows };
}

function nearbyParticles(grid, p) {
  const bx = Math.floor(p.x / BUCKET_SIZE);
  const by = Math.floor(p.y / BUCKET_SIZE);
  const out = [];
  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      const key = `${bx+dx},${by+dy}`;
      const bucket = grid.get(key);
      if (bucket) out.push(...bucket);
    }
  }
  return out;
}

// ── Barrier reflection ────────────────────────────────────────────────────────
function reflectBarrier(p, b) {
  const bx = b.x2 - b.x1, by = b.y2 - b.y1;
  const len2 = bx*bx + by*by;
  if (len2 === 0) return;
  const t = Math.max(0, Math.min(1, ((p.x-b.x1)*bx + (p.y-b.y1)*by) / len2));
  const cx = b.x1 + t*bx, cy = b.y1 + t*by;
  const dx = p.x - cx, dy = p.y - cy;
  const dist = Math.sqrt(dx*dx + dy*dy);
  if (dist < 6) {
    // normal toward particle
    const nx = dx / (dist || 1), ny = dy / (dist || 1);
    const dot = p.vx*nx + p.vy*ny;
    if (dot < 0) {  // only reflect if moving toward barrier
      p.vx -= 2 * dot * nx;
      p.vy -= 2 * dot * ny;
      // push out
      p.x = cx + nx * 6;
      p.y = cy + ny * 6;
      AudioManager.play('wallHit');
    }
  }
}

// ── Main simulation tick ──────────────────────────────────────────────────────
export function simulate(dt, canvasW, canvasH) {
  const t = dt * state.settings.slowMo;
  if (t === 0) return;

  const { settings, particles, emitters, collectors, barriers } = state;

  // 1. Emitter spawning
  for (const em of emitters) {
    em.accum = (em.accum || 0) + t;
    const interval = 1000 / settings.spawnRate;
    while (em.accum >= interval && particles.length < MAX_PARTICLES) {
      em.accum -= interval;
      const angle = Math.random() * Math.PI * 2;
      const spd   = 30 + Math.random() * 40;
      particles.push({
        id:    nextId(),
        x:     em.x + (Math.random()-0.5)*6,
        y:     em.y + (Math.random()-0.5)*6,
        vx:    Math.cos(angle) * spd,
        vy:    Math.sin(angle) * spd,
        trail: [],
      });
      AudioManager.play('spawn');
    }
  }

  // 2. Compute forces
  const useGrid = particles.length > 200;
  const { grid } = useGrid ? buildGrid(particles, canvasW, canvasH) : { grid: null };

  for (const p of particles) {
    let fx = 0, fy = 0;
    const multiplier = settings.fieldStrength;

    // Particle–particle repulsion
    const neighbours = useGrid ? nearbyParticles(grid, p) : particles;
    for (const q of neighbours) {
      if (q === p) continue;
      const dx = p.x - q.x, dy = p.y - q.y;
      const dist2 = dx*dx + dy*dy;
      if (dist2 < 1) continue;
      const dist = Math.sqrt(dist2);
      const force = K_REPEL * multiplier / dist2;
      fx += force * dx / dist;
      fy += force * dy / dist;
    }

    // Collector attraction
    for (const c of collectors) {
      const dx = c.x - p.x, dy = c.y - p.y;
      const dist2 = dx*dx + dy*dy;
      if (dist2 < 1) continue;
      const dist = Math.sqrt(dist2);
      const force = K_ATTRACT * c.strength * multiplier / dist2;
      fx += force * dx / dist;
      fy += force * dy / dist;
    }

    p.vx += fx * t / 1000;
    p.vy += fy * t / 1000;
  }

  // 3. Absorption
  const toRemove = new Set();
  for (const p of particles) {
    for (const c of collectors) {
      const dx = p.x - c.x, dy = p.y - c.y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      if (dist < c.radius + 4) {
        toRemove.add(p.id);
        c.absorbedCount++;
        c.radius = Math.min(60, c.radius + 1);
        AudioManager.play('absorb');
        break;
      }
    }
  }
  if (toRemove.size) {
    state.particles = particles.filter(p => !toRemove.has(p.id));
  }

  // 4. Barrier reflection & movement
  for (const p of state.particles) {
    for (const b of barriers) reflectBarrier(p, b);

    // Friction damping
    const damp = 1 - settings.friction * 0.0005 * t;
    p.vx *= damp;
    p.vy *= damp;

    // Integrate
    p.x += p.vx * t / 1000;
    p.y += p.vy * t / 1000;

    // Canvas boundary bounce
    if (p.x < 0) { p.x = 0; p.vx = Math.abs(p.vx); }
    if (p.x > canvasW) { p.x = canvasW; p.vx = -Math.abs(p.vx); }
    if (p.y < 0) { p.y = 0; p.vy = Math.abs(p.vy); }
    if (p.y > canvasH) { p.y = canvasH; p.vy = -Math.abs(p.vy); }

    // Trail
    if (settings.trails) {
      p.trail.unshift([p.x, p.y]);
      if (p.trail.length > 20) p.trail.length = 20;
    } else {
      p.trail.length = 0;
    }
  }
}
