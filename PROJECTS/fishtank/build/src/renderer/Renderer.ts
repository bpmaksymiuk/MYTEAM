import * as THREE from 'three';

export type TickCallback = (dt: number) => void;

export class Renderer {
  readonly threeRenderer: THREE.WebGLRenderer;
  private tickCallbacks: TickCallback[] = [];
  private lastTime = 0;
  private resizeObserver: ResizeObserver;

  constructor(canvas: HTMLCanvasElement) {
    this.threeRenderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
    this.threeRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.threeRenderer.setSize(window.innerWidth, window.innerHeight);
    this.threeRenderer.shadowMap.enabled = true;
    this.threeRenderer.shadowMap.type = THREE.PCFSoftShadowMap;

    this.resizeObserver = new ResizeObserver(() => this._onResize());
    this.resizeObserver.observe(document.body);
  }

  onTick(cb: TickCallback): void {
    this.tickCallbacks.push(cb);
  }

  start(): void {
    requestAnimationFrame(this._loop.bind(this));
  }

  private _loop(now: number): void {
    const rawDt = (now - this.lastTime) / 1000;
    const dt = Math.min(rawDt, 0.1);
    this.lastTime = now;

    for (const cb of this.tickCallbacks) {
      cb(dt);
    }

    requestAnimationFrame(this._loop.bind(this));
  }

  private _onResize(): void {
    this.threeRenderer.setSize(window.innerWidth, window.innerHeight);
  }
}
