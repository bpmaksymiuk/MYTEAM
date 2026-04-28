// beaverdam.js — DI-009
import { state } from './state.js';

export function progressDam(state_ = state, dt = 0) {
  const beavers = state_.agents['beaver'] || [];
  if (beavers.length === 0) return;
  const active = state_.scenario.id === 'beaver-dam' || beavers.length >= 2;
  if (!active || state_.beaverDam.complete) return;
  state_.beaverDam.progress = Math.min(1, state_.beaverDam.progress + 0.02 * beavers.length * dt);
  if (state_.beaverDam.progress >= 1 && !state_.beaverDam.complete) {
    state_.beaverDam.complete = true;
    state_.environment.waterBaseline = 1.4;
    state_.events.log.push({ type: 'beaver', kind: 'event', tick: state_.tick, day: Math.floor(state_.environment.dayOfYear), text: 'Beaver dam completed; water level rising.' });
  }
}

export function removeDam(state_ = state) {
  state_.beaverDam.progress = 0;
  state_.beaverDam.complete = false;
  state_.environment.waterBaseline = 1.0;
}
