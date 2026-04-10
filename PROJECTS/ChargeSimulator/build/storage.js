// storage.js — DI-008
// Save/load simulation state via localStorage.

import { state, nextId } from './state.js';

export const StorageManager = {
  save(slot) {
    const snap = {
      emitters:  state.emitters.map(e  => ({ x: e.x,  y: e.y,  rate:     e.rate     })),
      collectors:state.collectors.map(c => ({ x: c.x,  y: c.y,  strength: c.strength })),
      barriers:  state.barriers.map(b  => ({ x1:b.x1, y1:b.y1, x2:b.x2, y2:b.y2    })),
      settings:  { ...state.settings },
    };
    localStorage.setItem(`ef_slot_${slot}`, JSON.stringify(snap));
  },

  load(slot, applySliders) {
    const raw = localStorage.getItem(`ef_slot_${slot}`);
    if (!raw) { alert(`Slot ${slot} is empty.`); return; }
    const snap = JSON.parse(raw);

    state.particles.length  = 0;
    state.emitters.length   = 0;
    state.collectors.length = 0;
    state.barriers.length   = 0;

    for (const e of snap.emitters)
      state.emitters.push({ id: nextId(), x:e.x, y:e.y, rate:e.rate, accum:0 });
    for (const c of snap.collectors)
      state.collectors.push({ id:nextId(), x:c.x, y:c.y, strength:c.strength, absorbedCount:0, radius:18 });
    for (const b of snap.barriers)
      state.barriers.push({ id:nextId(), x1:b.x1, y1:b.y1, x2:b.x2, y2:b.y2 });

    Object.assign(state.settings, snap.settings);
    if (applySliders) applySliders(snap.settings);
  },

  listSlots() {
    return [1, 2, 3].map(s => !!localStorage.getItem(`ef_slot_${s}`));
  },
};
