// DI-027: Audio Manager — Web Audio API with crossfade
'use strict';

import { SettingsManager } from './SettingsManager.js';
import { AssetLoader } from './AssetLoader.js';

export const AudioManager = {
  ctx: null,
  masterGain: null,
  musicGain:  null,
  sfxGain:    null,
  currentMusicSource: null,

  init() {
    try {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
      console.warn('AudioManager: Web Audio API unavailable.', e);
      return;
    }
    AssetLoader.setAudioContext(this.ctx);

    this.masterGain = this.ctx.createGain();
    this.masterGain.connect(this.ctx.destination);

    this.musicGain = this.ctx.createGain();
    this.musicGain.connect(this.masterGain);

    this.sfxGain = this.ctx.createGain();
    this.sfxGain.connect(this.masterGain);

    const s = SettingsManager.getAll();
    this.masterGain.gain.value = (s.masterVolume ?? 80) / 100;
    this.musicGain.gain.value  = (s.musicVolume  ?? 70) / 100;
    this.sfxGain.gain.value    = (s.sfxVolume    ?? 80) / 100;
  },

  _resume() {
    if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
  },

  playMusic(trackId) {
    if (!this.ctx) return;
    this._resume();
    let buffer;
    try { buffer = AssetLoader.get(trackId); } catch (_) { return; }
    if (!buffer) return;

    // Crossfade out current track over 1s
    if (this.currentMusicSource) {
      const old = this.currentMusicSource;
      const now = this.ctx.currentTime;
      this.musicGain.gain.setValueAtTime(this.musicGain.gain.value, now);
      this.musicGain.gain.linearRampToValueAtTime(0, now + 1);
      setTimeout(() => { try { old.stop(); } catch (_) {} }, 1100);
    }

    const src = this.ctx.createBufferSource();
    src.buffer = buffer;
    src.loop   = true;
    src.connect(this.musicGain);

    const targetVol = SettingsManager.get('musicVolume') / 100;
    const now = this.ctx.currentTime;
    if (this.currentMusicSource) {
      this.musicGain.gain.linearRampToValueAtTime(targetVol, now + 1);
      src.start(now + 0.5);
    } else {
      this.musicGain.gain.setValueAtTime(targetVol, now);
      src.start();
    }
    this.currentMusicSource = src;
  },

  playSfx(sfxId) {
    if (!this.ctx) return;
    this._resume();
    let buffer;
    try { buffer = AssetLoader.get(sfxId); } catch (_) { return; }
    if (!buffer) return;
    const src = this.ctx.createBufferSource();
    src.buffer = buffer;
    src.connect(this.sfxGain);
    src.onended = () => src.disconnect();
    src.start();
  },

  setMasterVolume(v) {
    if (this.masterGain) this.masterGain.gain.value = Math.max(0, Math.min(1, v));
  },

  setMusicVolume(v) {
    if (this.musicGain) this.musicGain.gain.value = Math.max(0, Math.min(1, v));
  },

  setSfxVolume(v) {
    if (this.sfxGain) this.sfxGain.gain.value = Math.max(0, Math.min(1, v));
  },
};

export default AudioManager;
