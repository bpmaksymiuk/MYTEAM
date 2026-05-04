import * as THREE from 'three';
import type { FluidGrid } from '@/simulation/FluidGrid';

type ParticleType = 'dust' | 'food' | 'sediment';

interface Particle {
  active: boolean;
  type: ParticleType;
  pos: THREE.Vector3;
  vel: THREE.Vector3;
  life: number;
  maxLife: number;
}

const POOL_SIZE = 500;

export class ParticleSystem {
  private pool: Particle[] = [];
  private points: THREE.Points;
  private positions: Float32Array;
  private colors: Float32Array;
  private scene: THREE.Scene;

  constructor(scene: THREE.Scene) {
    this.scene = scene;
    const geo = new THREE.BufferGeometry();
    this.positions = new Float32Array(POOL_SIZE * 3);
    this.colors = new Float32Array(POOL_SIZE * 3);
    geo.setAttribute('position', new THREE.BufferAttribute(this.positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(this.colors, 3));
    const mat = new THREE.PointsMaterial({ size: 0.07, vertexColors: true, transparent: true, opacity: 0.8 });
    this.points = new THREE.Points(geo, mat);
    scene.add(this.points);

    for (let i = 0; i < POOL_SIZE; i++) {
      this.pool.push({ active: false, type: 'dust', pos: new THREE.Vector3(), vel: new THREE.Vector3(), life: 0, maxLife: 1 });
    }
  }

  emit(type: ParticleType, x: number, y: number, z: number): void {
    const p = this.pool.find(p => !p.active);
    if (!p) return;
    p.active = true;
    p.type = type;
    p.pos.set(x, y, z);
    p.vel.set((Math.random() - 0.5) * 0.4, type === 'food' ? -0.3 : -0.05, (Math.random() - 0.5) * 0.4);
    p.maxLife = type === 'food' ? 8 : type === 'dust' ? 4 : 6;
    p.life = p.maxLife;
  }

  tick(dt: number, fluid: FluidGrid): void {
    let idx = 0;
    for (const p of this.pool) {
      if (p.active) {
        p.life -= dt;
        if (p.life <= 0) { p.active = false; }
        else {
          // fluid nudge (approximate grid coord)
          const gx = (p.pos.x + 6) / 12;
          const gz = (p.pos.z + 3) / 6;
          const [fu, fv] = fluid.sample(Math.max(0, Math.min(0.9999, gx)), Math.max(0, Math.min(0.9999, gz)));
          p.vel.x += fu * 0.3 * dt;
          p.vel.z += fv * 0.3 * dt;
          p.pos.addScaledVector(p.vel, dt);
          p.pos.y = Math.max(-2.9, p.pos.y);
        }
      }
      if (p.active) {
        this.positions[idx * 3]     = p.pos.x;
        this.positions[idx * 3 + 1] = p.pos.y;
        this.positions[idx * 3 + 2] = p.pos.z;
        const t = p.life / p.maxLife;
        if (p.type === 'food')     { this.colors[idx*3]=0.9; this.colors[idx*3+1]=0.7; this.colors[idx*3+2]=0.3; }
        else if (p.type === 'dust'){ this.colors[idx*3]=t*0.6; this.colors[idx*3+1]=t*0.6; this.colors[idx*3+2]=t*0.7; }
        else                       { this.colors[idx*3]=0.5; this.colors[idx*3+1]=0.38; this.colors[idx*3+2]=0.22; }
      } else {
        this.positions[idx * 3] = this.positions[idx * 3 + 1] = this.positions[idx * 3 + 2] = 1e9;
      }
      idx++;
    }
    const geo = this.points.geometry;
    (geo.attributes['position'] as THREE.BufferAttribute).needsUpdate = true;
    (geo.attributes['color'] as THREE.BufferAttribute).needsUpdate = true;
  }

  getFoodParticles(): THREE.Vector3[] {
    return this.pool.filter(p => p.active && p.type === 'food').map(p => p.pos.clone());
  }
}
