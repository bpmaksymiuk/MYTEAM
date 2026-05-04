import * as THREE from 'three';
import Hammer from 'hammerjs';
import type { SceneManager } from '@/scene/SceneManager';
import type { ParticleSystem } from '@/scene/ParticleSystem';
import type { FishManager } from '@/fish/FishManager';
import { AppState } from '@/state/AppState';
import { AudioManager } from '@/audio/AudioManager';

type GameAction =
  | { type: 'FEED'; x: number; y: number; z: number }
  | { type: 'PAN';  dx: number; dz: number }
  | { type: 'ZOOM'; delta: number };

export class InputManager {
  private canvas: HTMLElement;
  private hammer: HammerManager;
  private feedCooldown = 0;
  private lastPointer: { x: number; y: number } | null = null;
  private scene: SceneManager;
  private particles: ParticleSystem;
  private fishManager: FishManager | null = null;

  constructor(canvas: HTMLElement, scene: SceneManager, particles: ParticleSystem) {
    this.canvas = canvas;
    this.scene = scene;
    this.particles = particles;

    canvas.addEventListener('pointerdown', this._onPointerDown.bind(this), { passive: false });
    canvas.addEventListener('pointermove', this._onPointerMove.bind(this), { passive: false });
    canvas.addEventListener('pointerup',   this._onPointerUp.bind(this));

    this.hammer = new Hammer(canvas as HTMLElement, { recognizers: [[Hammer.Pinch], [Hammer.Pan]] });
    this.hammer.get('pinch').set({ enable: true });
    this.hammer.on('pinch', (e: HammerInput) => this._dispatch({ type: 'ZOOM', delta: e.scale - 1 }));
    this.hammer.on('panmove', (e: HammerInput) => this._dispatch({ type: 'PAN', dx: e.deltaX * 0.01, dz: e.deltaY * 0.01 }));
  }

  setFishManager(fm: FishManager): void {
    this.fishManager = fm;
  }

  tick(dt: number): void {
    if (this.feedCooldown > 0) this.feedCooldown -= dt;
  }

  private _onPointerDown(e: PointerEvent): void {
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    this.lastPointer = { x: e.clientX, y: e.clientY };
    AudioManager.instance().init();

    if (this.feedCooldown <= 0) {
      // Fire feed action at canvas centre depth
      this.feedCooldown = 0.8;
      const x = (e.clientX / window.innerWidth - 0.5) * 10;
      const y = 1.5 + Math.random() * 0.5;
      const z = (e.clientY / window.innerHeight - 0.5) * -4;
      const worldPos = new THREE.Vector3(x, y, z);
      this._dispatch({ type: 'FEED', x, y, z });
      this.scene.crab?.onInteract(worldPos);
      this.fishManager?.setCursorWorld(worldPos);
    }
  }

  private _onPointerMove(e: PointerEvent): void {
    if (!this.lastPointer) return;
    const dx = (e.clientX - this.lastPointer.x) * 0.01;
    const dz = (e.clientY - this.lastPointer.y) * 0.01;
    this.lastPointer = { x: e.clientX, y: e.clientY };
    this._dispatch({ type: 'PAN', dx, dz });
  }

  private _onPointerUp(): void {
    this.lastPointer = null;
  }

  private _dispatch(action: GameAction): void {
    if (action.type === 'FEED') {
      this.particles.emit('food', action.x, action.y, action.z);
      AudioManager.instance().play('feed');
    }
    if (action.type === 'ZOOM') {
      const state = AppState.instance();
      const pop = state.get('populationCount');
      state.set('bubblerRate', state.get('bubblerRate') + action.delta * 20);
    }
  }
}
