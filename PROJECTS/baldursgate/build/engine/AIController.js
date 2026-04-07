// DI-020: AI Controller — Aggressive / Defensive / Passive behaviours
'use strict';
import { find as pathFind } from './PathFinder.js';

const BEHAVIOUR = { AGGRESSIVE: 'aggressive', DEFENSIVE: 'defensive', PASSIVE: 'passive' };
const MELEE_RANGE = 1.5; // tiles

function dist(a, b) {
  return Math.sqrt((a.tx - b.tx) ** 2 + (a.ty - b.ty) ** 2);
}

function closestEnemy(entity, entities) {
  let best = null, bestDist = Infinity;
  for (const e of entities) {
    if (e.faction === entity.faction || e.hp <= 0) continue;
    const d = dist(entity, e);
    if (d < bestDist) { bestDist = d; best = e; }
  }
  return { target: best, distance: bestDist };
}

/**
 * Tick AI for one entity. Returns an action object or null.
 * action: { type: 'move', path } | { type: 'attack', target } | { type: 'flee', path } | null
 */
export function tick(entity, entities, collisionMap, mapWidth) {
  if (entity.hp <= 0) return null;
  const behaviour = entity.behaviour ?? BEHAVIOUR.AGGRESSIVE;
  const { target, distance } = closestEnemy(entity, entities);

  if (!target) return null;

  if (behaviour === BEHAVIOUR.PASSIVE) return null;

  if (behaviour === BEHAVIOUR.DEFENSIVE) {
    const hpPct = entity.hp / entity.maxHp;
    if (hpPct < 0.25) {
      // Flee: move away from nearest enemy
      const fx = entity.tx + (entity.tx - target.tx);
      const fy = entity.ty + (entity.ty - target.ty);
      const path = pathFind(entity.tx, entity.ty, Math.max(0, fx), Math.max(0, fy), collisionMap, mapWidth);
      return { type: 'flee', path };
    }
  }

  // Aggressive & defensive (when healthy): close in and attack
  if (distance <= MELEE_RANGE) {
    return { type: 'attack', target };
  }

  const path = pathFind(entity.tx, entity.ty, target.tx, target.ty, collisionMap, mapWidth);
  if (path.length > 1) return { type: 'move', path: path.slice(1, 3) }; // step 1-2 tiles per tick
  return null;
}

/**
 * Apply an AI action to the entity (mutates entity.tx/ty).
 * Combat resolution is delegated to CombatEngine.
 */
export function applyMove(entity, action) {
  if (!action || action.type !== 'move' && action.type !== 'flee') return;
  if (!action.path || action.path.length === 0) return;
  const next = action.path[0];
  entity.tx = next.x;
  entity.ty = next.y;
}

export default { tick, applyMove, BEHAVIOUR };
