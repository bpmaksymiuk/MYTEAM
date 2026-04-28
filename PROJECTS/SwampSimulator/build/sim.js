// sim.js — agent simulation (DI-005)
import { state, nextId } from './state.js';
import { initAnim, updateAnimator } from './animator.js';
import { SPECIES, getSpecies } from './species.js';
import { buildGrid, nearby } from './grid.js';
import { zoneAt, BIOME, applyTerrainSeason } from './terrain.js';
import { emitSplash, emitRipple, emitBlink, emitRain, emitConfetti } from './particles.js';

// Zone affinity: which biomes each species type prefers for spawning
const AQUATIC_SP  = new Set(['bass','mullet','tadpole','mosquito_larva','crayfish']);
const TERRESTRIAL_SP = new Set(['deer','panther','raccoon','firefly','mosquito','bat']);
const SEMI_SP     = new Set(['frog','alligator','snake','turtle','otter','beaver','heron','osprey','owl','vulture','snail']);

function zoneOk(speciesId, x, y) {
  const bm = state.terrain.biomeMap;
  if (!bm) return true;
  const z = zoneAt(bm, x, y, state.canvas.w, state.canvas.h);
  if (AQUATIC_SP.has(speciesId))    return z === BIOME.DEEP || z === BIOME.SHALLOW;
  if (TERRESTRIAL_SP.has(speciesId)) return z === BIOME.GRASS || z === BIOME.SAND;
  if (z === BIOME.CYPRESS) return false; // no spawning in cypress stands
  return true;
}

export function spawnAgent(speciesId, x, y, energy) {
  const sp = getSpecies(speciesId);
  if (!sp) return null;
  // Attempt up to 20 random positions respecting zone affinity
  let ax = x ?? Math.random() * state.canvas.w;
  let ay = y ?? Math.random() * state.canvas.h;
  if (x == null && y == null) {
    for (let attempt=0; attempt<20; attempt++) {
      ax = Math.random() * state.canvas.w;
      ay = Math.random() * state.canvas.h;
      if (zoneOk(speciesId, ax, ay)) break;
    }
  }
  const a = {
    id: nextId(), species: speciesId,
    x: ax, y: ay,
    vx: 0, vy: 0,
    energy: energy ?? ((sp.reproThreshold * 0.6) || 50),
    age: 0,
    target: null,
  };
  if (!state.agents[speciesId]) state.agents[speciesId] = [];
  state.agents[speciesId].push(a);
  initAnim(a, sp);
  return a;
}

export function spawnPlantPatch(speciesId, x, y, density) {
  const sp = getSpecies(speciesId);
  if (!sp || !sp.isPlant) return;
  if (!state.plantPatches[speciesId]) state.plantPatches[speciesId] = [];
  state.plantPatches[speciesId].push({
    x: x ?? Math.random() * state.canvas.w,
    y: y ?? Math.random() * state.canvas.h,
    density: density ?? 1.0,
  });
}

export function removeAllOfSpecies(speciesId) {
  if (state.agents[speciesId]) state.agents[speciesId] = [];
  if (state.plantPatches[speciesId]) state.plantPatches[speciesId] = [];
}

export function totalAnimals() {
  let n = 0;
  for (const sp of SPECIES) if (!sp.isPlant) n += (state.agents[sp.id]?.length || 0);
  return n;
}

function flatAnimals() {
  const out = [];
  for (const sp of SPECIES) if (!sp.isPlant) {
    const arr = state.agents[sp.id]; if (arr) for (const a of arr) out.push(a);
  }
  return out;
}

function ensurePlantBaseline() {
  for (const sp of SPECIES) if (sp.isPlant) {
    const arr = state.plantPatches[sp.id] ||= [];
    while (arr.length < Math.floor(sp.baselineCount * 0.4)) {
      arr.push({ x: Math.random() * state.canvas.w, y: Math.random() * state.canvas.h, density: 0.5 });
    }
  }
}

export function tick(dt) {
  if (dt <= 0) return;
  state.tick++;
  // Build spatial grid over all animals
  const animals = flatAnimals();
  const grid = buildGrid(animals, state.settings.gridCellSize, state.canvas.w, state.canvas.h);

  // Plant tick: grow / retract patches
  for (const sp of SPECIES) if (sp.isPlant) {
    const arr = state.plantPatches[sp.id] ||= [];
    const env = state.environment;
    const grow = (env.nutrient > 0.5 && env.oxygen > 0.3 && env.waterLevel > 0.5);
    if (grow && Math.random() < 0.02 * dt && arr.length < sp.baselineCount * 5) {
      arr.push({ x: Math.random() * state.canvas.w, y: Math.random() * state.canvas.h, density: 0.4 });
    }
    for (let i = arr.length - 1; i >= 0; i--) {
      const p = arr[i];
      if (grow) p.density = Math.min(1.5, p.density + 0.05 * dt);
      else p.density -= 0.04 * dt;
      // Algae bloom: extra-fast growth when nutrient very high
      if (sp.id === 'algae' && env.nutrient > 1.8) p.density = Math.min(2.5, p.density + 0.5 * dt);
      // Pollution sensitivity
      if (state.events.active.pollution) p.density -= sp.sensitivities.pollution * 0.04 * dt;
      // Drought
      if (state.events.active.drought && sp.sensitivities.drought > 0.5) p.density -= 0.05 * dt;
      // Fire kills shoreline plants
      if (state.events.active.fire && (p.y < 90 || p.y > state.canvas.h - 90)) p.density -= 0.3 * dt;
      if (p.density <= 0) arr.splice(i, 1);
    }
  }

  // Animals
  for (const sp of SPECIES) if (!sp.isPlant) {
    const arr = state.agents[sp.id]; if (!arr) continue;
    for (let i = arr.length - 1; i >= 0; i--) {
      const a = arr[i];
      a.age += dt;

      // Environmental damage
      if (state.events.active.pollution) a.energy -= sp.sensitivities.pollution * 4 * dt;
      if (state.events.active.drought && sp.sensitivities.drought > 0.5) a.energy -= 1 * dt;
      if (state.environment.oxygen < 0.4 && (sp.id === 'bass' || sp.id === 'mullet' || sp.id === 'tadpole' || sp.id === 'crayfish')) {
        a.energy -= (0.4 - state.environment.oxygen) * 8 * dt;
      }

      // Cold-blooded slowdown
      let speedFactor = 1;
      if (sp.sensitivities.cold > 0.5 && state.environment.temperature < 12) speedFactor = 0.4;

      // Sense neighbours
      const cells = nearby(grid, a.x, a.y, sp.sensorRadius);
      let prey = null, predator = null, dPrey = Infinity, dPred = Infinity;
      for (const o of cells) {
        if (o.id === a.id) continue;
        const dx = o.x - a.x, dy = o.y - a.y; const d2 = dx*dx + dy*dy;
        if (sp.eats.includes(o.species) && d2 < dPrey) { dPrey = d2; prey = o; }
        if (sp.eatenBy.includes(o.species) && d2 < dPred) { dPred = d2; predator = o; }
      }

      // Plant prey: also seek nearest plant patch if hungry
      let plantTarget = null, dPlant = Infinity;
      if (a.energy < sp.reproThreshold * 0.7) {
        for (const peatId of sp.eats) {
          const sp2 = getSpecies(peatId);
          if (!sp2 || !sp2.isPlant) continue;
          const arr2 = state.plantPatches[peatId];
          if (!arr2) continue;
          for (const p of arr2) {
            const dx = p.x - a.x, dy = p.y - a.y; const d2 = dx*dx + dy*dy;
            if (d2 < dPlant && d2 < sp.sensorRadius * sp.sensorRadius) { dPlant = d2; plantTarget = p; }
          }
        }
      }

      // Movement decision
      let tx = null, ty = null, flee = false;
      if (predator && Math.sqrt(dPred) < sp.sensorRadius * 0.7) {
        tx = a.x - (predator.x - a.x); ty = a.y - (predator.y - a.y); flee = true;
      } else if (prey) {
        tx = prey.x; ty = prey.y;
      } else if (plantTarget) {
        tx = plantTarget.x; ty = plantTarget.y;
      } else {
        // random walk: change direction occasionally
        if (Math.random() < 0.05 || (a.vx === 0 && a.vy === 0)) {
          const ang = Math.random() * Math.PI * 2;
          a.vx = Math.cos(ang); a.vy = Math.sin(ang);
        }
      }
      if (tx !== null) {
        const dx = tx - a.x, dy = ty - a.y;
        const m = Math.hypot(dx, dy) || 1;
        a.vx = dx / m; a.vy = dy / m;
        if (flee) { a.vx = -a.vx; a.vy = -a.vy; }
      }

      const sp_ = sp.speed * speedFactor;
      a.x += a.vx * sp_ * dt;
      a.y += a.vy * sp_ * dt;
      // bounds
      if (a.x < 4) { a.x = 4; a.vx *= -1; }
      if (a.x > state.canvas.w - 4) { a.x = state.canvas.w - 4; a.vx *= -1; }
      if (a.y < 4) { a.y = 4; a.vy *= -1; }
      if (a.y > state.canvas.h - 4) { a.y = state.canvas.h - 4; a.vy *= -1; }

      // animator
      if (!a.anim) initAnim(a, sp);
      updateAnimator(a, dt, null);

      // Eat prey if overlapping
      if (prey && Math.sqrt(dPrey) < (sp.radius + getSpecies(prey.species).radius + 2)) {
        a.energy += sp.energyPerMeal;
        // remove prey
        const parr = state.agents[prey.species];
        const idx = parr.indexOf(prey);
        if (idx >= 0) parr.splice(idx, 1);
        state.events.predationLog.push({ predator: a.species, prey: prey.species, tick: state.tick });
        if (state.events.predationLog.length > 2000) state.events.predationLog.splice(0, 1000);
        emitSplash(prey.x, prey.y);
      }
      // Eat plant patch
      if (plantTarget && Math.sqrt(dPlant) < (sp.radius + 6)) {
        a.energy += sp.energyPerMeal * 0.5;
        plantTarget.density -= 0.15;
      }

      // Energy decay (basal metabolism)
      a.energy -= 0.5 * dt;

      // Reproduction
      if (a.energy > sp.reproThreshold && Math.random() < sp.reproRate * dt) {
        const cap = sp.baselineCount * 5;
        if ((arr.length) < cap) {
          spawnAgent(sp.id, a.x + (Math.random()-0.5)*10, a.y + (Math.random()-0.5)*10, a.energy * 0.4);
          a.energy *= 0.6;
        }
      }

      // Death
      if (a.energy <= 0 || a.age > sp.lifespan) {
        arr.splice(i, 1);
        // nutrient pulse
        state.environment.nutrient = Math.min(3, state.environment.nutrient + 0.001);
      }
    }
  }

  // Mosquito surge mechanic: larvae mature into adults
  if (state.tick % 30 === 0) {
    const larvae = state.agents['mosquito_larva'];
    if (larvae && larvae.length > 0) {
      const matCount = Math.min(larvae.length, Math.ceil(larvae.length * 0.05));
      for (let k = 0; k < matCount; k++) {
        const m = larvae.pop();
        if (m) spawnAgent('mosquito', m.x, m.y, 20);
      }
    }
  }

  ensurePlantBaseline();

  // Dam tick
  tickAllDams(dt);

  // Firefly particle blinks (night phase)
  if (state.environment.timeOfDay === 'night') {
    for (const a of (state.agents['firefly'] || [])) {
      if (Math.random() < 0.04) emitBlink(a.x, a.y);
    }
  }

  // Rain particles during precipitation event
  if (state.events.active['rain'] || state.events.active['storm']) {
    emitRain();
  }

  // Water ripple from swimming agents (every 30 ticks)
  if (state.tick % 30 === 0) {
    for (const agents of Object.values(state.agents)) {
      for (const a of agents) {
        if (a.anim && a.anim.state === 'swim') emitRipple(a.x, a.y);
      }
    }
  }
}

function tickAllDams(dt) {
  const beavers = state.agents['beaver'] || [];
  for (let i = state.dams.length - 1; i >= 0; i--) {
    const dam = state.dams[i];

    // Breach timer
    if (dam.breachTimer > 0) {
      dam.breachTimer -= dt;
      for (let k=0; k<3; k++) emitSplash(dam.x + (Math.random()-0.5)*dam.width, dam.y);
      if (dam.breachTimer <= 0) { state.dams.splice(i, 1); }
      continue;
    }

    // Build phase
    if (dam.progress < 1) {
      const nearby = beavers.find(b => Math.hypot(b.x-dam.x, b.y-dam.y) < 80);
      if (nearby) {
        dam.progress = Math.min(1, dam.progress + 0.002 * dt);
        // map build phase to beaver anim
        const phase = Math.floor(dam.progress * 3);
        const phaseStates = ['swim', 'walk', 'idle'];
        if (nearby.anim) nearby.anim.forcedState = phaseStates[phase];
        if (dam.progress >= 1 && !state.milestones.firstDam) {
          state.milestones.firstDam = true;
          emitConfetti();
          state.events.log.push({ type:'milestone', kind:'event', tick:state.tick,
            day:Math.floor(state.environment.dayOfYear),
            text:'First beaver dam complete! 🦫 The swamp has been reshaped.' });
        }
      }
    }

    // Health degradation
    if (state.events.active['storm'] || state.events.active['drought']) {
      dam.health = Math.max(0, dam.health - 0.0005 * dt);
    }

    // Repair
    if (dam.progress >= 1) {
      const repairer = beavers.find(b => Math.hypot(b.x-dam.x, b.y-dam.y) < 60);
      if (repairer) dam.health = Math.min(1, dam.health + 0.001 * dt);
    }

    if (dam.health <= 0) { dam.breachTimer = 2; }
  }

  // Auto-initiate dam build: if a beaver has no active dam within 200px, create one
  for (const b of beavers) {
    const hasDam = state.dams.some(d => Math.hypot(d.x-b.x, d.y-b.y) < 200);
    if (!hasDam && state.dams.length < 3 && Math.random() < 0.0001) {
      state.dams.push({
        id: nextId(), x: b.x, y: b.y,
        width: 80 + Math.random()*40, progress: 0, health: 1, builders: [],
        breachTimer: 0
      });
    }
  }
}

export function demolishDam(damId) {
  const dam = state.dams.find(d => d.id === damId);
  if (dam) { dam.breachTimer = 3; }
}
