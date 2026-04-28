// gatorhole.js — DI-008
import { state } from './state.js';

export function updateGatorHoles(state_ = state) {
  const gators = state_.agents['alligator'] || [];
  if (gators.length === 0) {
    if (!state_.events.active.drought && state_.environment.waterLevel > 0.9) {
      state_.gatorHoles.length = 0;
    }
    return;
  }
  // ensure each gator has a hole entry
  while (state_.gatorHoles.length < gators.length) state_.gatorHoles.push({ x: 0, y: 0, r: 30 });
  while (state_.gatorHoles.length > gators.length && !state_.events.active.drought && state_.environment.waterLevel > 0.9) state_.gatorHoles.pop();
  for (let i = 0; i < gators.length; i++) {
    state_.gatorHoles[i].x = gators[i].x;
    state_.gatorHoles[i].y = gators[i].y;
    state_.gatorHoles[i].r = state_.events.active.drought ? 36 : 28;
  }
}
