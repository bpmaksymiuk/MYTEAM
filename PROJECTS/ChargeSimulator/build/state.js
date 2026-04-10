// state.js — DI-003
// Central mutable state store. All modules import from here.

export const state = {
  particles: [],   // { id, x, y, vx, vy, trail: [] }
  emitters:  [],   // { id, x, y, rate, accum }
  collectors:[],   // { id, x, y, strength, absorbedCount, radius }
  barriers:  [],   // { id, x1, y1, x2, y2 }
  settings: {
    spawnRate:    5,      // particles/s per emitter
    fieldStrength:5,      // Coulomb multiplier 1–10
    friction:     2,      // damping 0–10
    slowMo:       1.0,    // time-scale 0–1
    fieldVis:     false,
    trails:       false,
    forceVectors: false,
    darkMode:     false,
    sound:        false,
    statsOpen:    false,
  },
  activeTool: 'emitter',
  challenge:  null,   // null | 'maze-escape' | 'balance' | 'containment'
  nextId:     1,
};

export function nextId() {
  return state.nextId++;
}
