export interface AppStateData {
  cameraMode: 'isometric' | '3/4';
  substrateType: 'sand' | 'gravel' | 'rock';
  decorations: { shipwreck: boolean; rocks: boolean; artifacts: boolean };
  audioEnabled: boolean;
  populationCount: number;
  bubblerRate: number;
  frontWindowMode: boolean;
}

const DEFAULTS: AppStateData = {
  cameraMode: 'isometric',
  substrateType: 'sand',
  decorations: { shipwreck: true, rocks: false, artifacts: true },
  audioEnabled: false,
  populationCount: 10,
  bubblerRate: 60,
  frontWindowMode: false,
};

type StateKey = keyof AppStateData;
type Callback<K extends StateKey> = (value: AppStateData[K]) => void;

export class AppState {
  private static _instance: AppState;
  private data: AppStateData = { ...DEFAULTS, decorations: { ...DEFAULTS.decorations } };
  private listeners: Map<StateKey, Callback<any>[]> = new Map();

  private constructor() {}

  static instance(): AppState {
    if (!AppState._instance) {
      AppState._instance = new AppState();
    }
    return AppState._instance;
  }

  get<K extends StateKey>(key: K): AppStateData[K] {
    return this.data[key];
  }

  set<K extends StateKey>(key: K, value: AppStateData[K]): void {
    if (key === 'populationCount') {
      (this.data as any)[key] = Math.max(1, Math.min(20, value as number));
    } else if (key === 'bubblerRate') {
      (this.data as any)[key] = Math.max(30, Math.min(200, value as number));
    } else if (key === 'decorations') {
      this.data.decorations = { ...this.data.decorations, ...(value as object) };
    } else {
      (this.data as any)[key] = value;
    }
    this.notify(key);
  }

  subscribe<K extends StateKey>(key: K, cb: Callback<K>): void {
    const existing = this.listeners.get(key) ?? [];
    existing.push(cb);
    this.listeners.set(key, existing);
  }

  private notify<K extends StateKey>(key: K): void {
    const cbs = this.listeners.get(key) ?? [];
    for (const cb of cbs) {
      try {
        cb(this.data[key]);
      } catch (err) {
        console.error(`AppState listener error for key "${key}":`, err);
      }
    }
  }
}
