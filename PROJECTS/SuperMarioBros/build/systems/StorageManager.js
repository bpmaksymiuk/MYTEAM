// DI-016 — localStorage wrapper
import { STORAGE_KEY, GAME } from '../config.js';

const DEFAULTS = {
  highScore: 0,
  unlockedLevel: 1,
  audioMuted: false,
};

export default class StorageManager {
  static load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return { ...DEFAULTS, ...(raw ? JSON.parse(raw) : {}) };
    } catch {
      return { ...DEFAULTS };
    }
  }

  static save(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...DEFAULTS, ...data }));
  }

  static get() {
    return StorageManager.load();
  }

  static set(data) {
    StorageManager.save(data);
  }

  static update(partial) {
    StorageManager.save({ ...StorageManager.load(), ...partial });
  }

  static resetRunState() {
    return {
      lives: GAME.LIVES_START,
      score: 0,
    };
  }
}
