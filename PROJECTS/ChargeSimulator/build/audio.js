// audio.js — DI-009
// Web Audio API synthesised sound effects.

import { state } from './state.js';

export const AudioManager = {
  ctx:   null,
  ready: false,

  init() {
    if (this.ready) return;
    this.ctx   = new AudioContext();
    this.ready = true;
  },

  play(event) {
    if (!this.ready || !state.settings.sound) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;

    const osc  = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (event === 'spawn') {
      osc.type      = 'sine';
      osc.frequency.setValueAtTime(880, now);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      osc.start(now); osc.stop(now + 0.06);

    } else if (event === 'absorb') {
      osc.type      = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(220, now + 0.12);
      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
      osc.start(now); osc.stop(now + 0.15);

    } else if (event === 'wallHit') {
      osc.type      = 'square';
      osc.frequency.setValueAtTime(1200, now);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
      osc.start(now); osc.stop(now + 0.05);
    }
  },
};
