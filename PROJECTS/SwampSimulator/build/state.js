// state.js — central mutable state (DI-003)
export const state = {
  tick: 0,
  paused: false,
  agents: {},                    // speciesId -> Array<Agent>
  plantPatches: {},              // speciesId -> Array<{x,y,density}>
  environment: {
    waterLevel: 1.0,
    waterBaseline: 1.0,
    nutrient: 1.0,
    oxygen: 1.0,
    temperature: 22,
    season: 'spring',
    dayOfYear: 60,
  },
  events: { active: {}, log: [], predationLog: [] },
  scenario: { id: null, checklist: [], startTick: 0, summary: null, history: {} },
  settings: {
    speed: 1,
    seasonLengthSec: 90,
    gridCellSize: 32,
    foodWebRadius: 60,
    overlays: { foodweb: false, nutrient: false, oxygen: false, density: false },
  },
  gatorHoles: [],
  beaverDam: { progress: 0, complete: false },
  dams: [],                      // Array<{id,x,y,width,progress,health,builders,breachTimer}>
  terrain: { biomeMap: null, seed: 0, dirty: true, seasonOffset: 0 },
  milestones: { firstDam: false, heronBreed: false },
  ui: { currentScreen: 'canvas', selectedSpecies: null, foodwebSelected: null },
  nextId: 1,
  canvas: { w: 800, h: 600 },
};

export function nextId() { return state.nextId++; }

export function dayString() {
  const d = Math.floor(state.environment.dayOfYear);
  const s = state.environment.season;
  return `Day ${d} · ${s.charAt(0).toUpperCase() + s.slice(1)}`;
}
