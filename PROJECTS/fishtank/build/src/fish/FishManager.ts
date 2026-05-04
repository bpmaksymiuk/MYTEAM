import * as THREE from 'three';
import { FishAgent } from '@/fish/FishAgent';
import { SPECIES, areCompatible } from '@/fish/FishSpecies';
import { AppState } from '@/state/AppState';
import type { FluidGrid } from '@/simulation/FluidGrid';
import type { ObstacleBounds } from '@/scene/EnvironmentConfig';
import type { ParticleSystem } from '@/scene/ParticleSystem';

const CELL_SIZE = 2.5;

export class FishManager {
  private agents: FishAgent[] = [];
  private scene: THREE.Scene;
  private renderer: THREE.WebGLRenderer;
  private grid: Map<string, FishAgent[]> = new Map();
  private cursorWorld: THREE.Vector3 | null = null;

  constructor(scene: THREE.Scene, renderer: THREE.WebGLRenderer) {
    this.scene = scene;
    this.renderer = renderer;

    const state = AppState.instance();
    const count = state.get('populationCount');
    this._initPopulation(count);

    state.subscribe('populationCount', count => this._initPopulation(count));
  }

  private _cellKey(pos: THREE.Vector3): string {
    return `${Math.floor(pos.x / CELL_SIZE)},${Math.floor(pos.y / CELL_SIZE)},${Math.floor(pos.z / CELL_SIZE)}`;
  }

  private _buildGrid(): void {
    this.grid.clear();
    for (const agent of this.agents) {
      const key = this._cellKey(agent.pos);
      const cell = this.grid.get(key) ?? [];
      cell.push(agent);
      this.grid.set(key, cell);
    }
  }

  private _getNeighbours(agent: FishAgent): FishAgent[] {
    const neighbours: FishAgent[] = [];
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        for (let dz = -1; dz <= 1; dz++) {
          const key = `${Math.floor(agent.pos.x / CELL_SIZE) + dx},${Math.floor(agent.pos.y / CELL_SIZE) + dy},${Math.floor(agent.pos.z / CELL_SIZE) + dz}`;
          const cell = this.grid.get(key) ?? [];
          for (const n of cell) {
            if (n !== agent && agent.pos.distanceTo(n.pos) < 2.5) neighbours.push(n);
          }
        }
      }
    }
    return neighbours;
  }

  private _initPopulation(count: number): void {
    for (const agent of this.agents) { this.scene.remove(agent.mesh); }
    this.agents = [];

    const speciesKeys = Object.keys(SPECIES);
    for (let i = 0; i < count; i++) {
      const key = speciesKeys[i % speciesKeys.length];
      const species = SPECIES[key];
      const pos = new THREE.Vector3(
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 4,
        (Math.random() - 0.5) * 4
      );
      this.agents.push(new FishAgent(species, pos, this.scene, this.renderer));
    }

    // Compatibility check
    const incompatible = this.agents.filter((a, _, arr) =>
      arr.some(b => b !== a && !areCompatible(a.species, b.species))
    );
    if (incompatible.length > 0) {
      console.warn('[FishManager] Incompatible species mix detected:', incompatible.map(a => a.species.id));
    }
  }

  tick(dt: number, fluid: FluidGrid, obstacles: ObstacleBounds[], particles: ParticleSystem): void {
    this._buildGrid();
    const foodItems = particles.getFoodParticles();
    for (const agent of this.agents) {
      const neighbours = this._getNeighbours(agent);
      agent.update(dt, neighbours, obstacles, fluid, foodItems);
      if (this.cursorWorld) agent.checkCursorProximity(this.cursorWorld, dt);
    }
  }

  setCursorWorld(pos: THREE.Vector3): void {
    this.cursorWorld = pos;
  }

  getAgents(): FishAgent[] { return this.agents; }
}
