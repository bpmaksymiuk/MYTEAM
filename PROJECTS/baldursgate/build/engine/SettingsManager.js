// DI-025: Settings Manager — localStorage persistence
'use strict';

const LS_KEY = 'bg_settings';

export const SettingsManager = {
  defaults: {
    masterVolume: 80,
    musicVolume:  70,
    sfxVolume:    80,
    difficulty:   'Normal',
    subtitles:    true,
    scrollSpeed:  250,
  },
  _data: null,

  init() {
    const raw = localStorage.getItem(LS_KEY);
    let saved = {};
    if (raw) {
      try { saved = JSON.parse(raw); } catch (_) { /* ignore corrupt data */ }
    }
    this._data = Object.assign({}, this.defaults, saved);
  },

  get(key) {
    return this._data[key];
  },

  set(key, value) {
    this._data[key] = value;
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(this._data));
    } catch (e) {
      console.warn('SettingsManager: failed to persist settings', e);
    }
  },

  getAll() {
    return Object.assign({}, this._data);
  },
};

export default SettingsManager;
