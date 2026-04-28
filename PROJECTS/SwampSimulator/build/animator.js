// PT-020 / DI-021 — per-agent animation FSM
import { getSprite } from './assets.js';
import { SPRITE_MANIFEST } from './sprites/manifest.js';

const IDLE_THRESHOLD = 0.3; // unit-vector magnitude (sim.js uses unit vectors scaled by species speed)

export function initAnim(agent, species) {
  agent.anim = { state: 'idle', frame: 0, accumulator: 0, facing: 'R' };
  const fromSpecies = species?.locomotion;
  const fromManifest = SPRITE_MANIFEST[agent.species]?.loco;
  agent.locomotion = fromSpecies || fromManifest || ['walk'];
}

function pickLocomotion(agent, env, sheetMeta) {
  const states = sheetMeta.states;
  const loco = agent.locomotion || [];
  // flight species in air
  if (loco.includes('flight') && (!loco.includes('walk') || (agent.altitude ?? 0) > 0 || loco.length === 1)) {
    if (states.flight) return 'flight';
  }
  // amphibious / aquatic — use water mask (heuristic: nutrient/water always present, fall back to species default)
  if (loco.includes('swim') && env?.inWater?.(agent.x, agent.y) !== false) {
    if (loco.length === 1 || (loco.includes('swim') && !loco.includes('walk'))) return states.swim ? 'swim' : 'idle';
  }
  if (loco.includes('walk') && states.walk) return 'walk';
  if (loco.includes('swim') && states.swim) return 'swim';
  if (loco.includes('flight') && states.flight) return 'flight';
  return 'idle';
}

export function updateAnimator(agent, dt, env) {
  if (!agent.anim) return;
  const sheet = getSprite(agent.species);
  if (!sheet) return;
  const meta = sheet.meta;
  const vx = agent.vx ?? 0, vy = agent.vy ?? 0;
  const speed = Math.hypot(vx, vy);
  const prev = agent.anim.state;
  let next;
  if (speed < IDLE_THRESHOLD) next = 'idle';
  else next = pickLocomotion(agent, env, meta);
  if (!meta.states[next]) next = 'idle';
  if (next !== prev) {
    agent.anim.state = next;
    agent.anim.frame = 0;
    agent.anim.accumulator = 0;
  }
  // facing
  if (vx > 0.5) agent.anim.facing = 'R';
  else if (vx < -0.5) agent.anim.facing = 'L';
  // advance
  const stateMeta = meta.states[next];
  if (stateMeta) {
    agent.anim.accumulator += dt * stateMeta.fps;
    while (agent.anim.accumulator >= 1) {
      agent.anim.frame = (agent.anim.frame + 1) % stateMeta.frames;
      agent.anim.accumulator -= 1;
    }
  }
}
