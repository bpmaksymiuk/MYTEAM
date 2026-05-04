import * as THREE from 'three';

const POOL_SIZE = 200;
const BUBBLER_POS = new THREE.Vector3(-5.5, -2.8, -2.8);

export class BubbleSystem {
  private mesh: THREE.InstancedMesh;
  private positions: THREE.Vector3[] = [];
  private speeds: number[] = [];
  private active: boolean[] = [];
  private dummy = new THREE.Object3D();
  private timer = 0;
  private bubblerRate = 60;

  constructor(scene: THREE.Scene) {
    const geo = new THREE.SphereGeometry(0.04, 6, 6);
    const mat = new THREE.MeshStandardMaterial({
      color: 0xadd8f7, transparent: true, opacity: 0.45,
      roughness: 0.05, metalness: 0.1
    });
    this.mesh = new THREE.InstancedMesh(geo, mat, POOL_SIZE);
    this.mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    scene.add(this.mesh);

    for (let i = 0; i < POOL_SIZE; i++) {
      this.positions.push(new THREE.Vector3());
      this.speeds.push(0);
      this.active.push(false);
      this.dummy.position.set(1e9, 1e9, 1e9);
      this.dummy.updateMatrix();
      this.mesh.setMatrixAt(i, this.dummy.matrix);
    }
    this.mesh.instanceMatrix.needsUpdate = true;
  }

  setBubblerRate(rate: number): void {
    this.bubblerRate = rate;
  }

  tick(dt: number): void {
    this.timer += dt;
    const interval = 1 / (this.bubblerRate / 60);
    if (this.timer >= interval) {
      this.timer = 0;
      this._spawn();
    }

    for (let i = 0; i < POOL_SIZE; i++) {
      if (!this.active[i]) continue;
      this.positions[i].y += this.speeds[i] * dt;
      this.positions[i].x += (Math.random() - 0.5) * 0.01;
      this.positions[i].z += (Math.random() - 0.5) * 0.01;
      if (this.positions[i].y > 2.9) {
        this.active[i] = false;
        this.dummy.position.set(1e9, 1e9, 1e9);
      } else {
        this.dummy.position.copy(this.positions[i]);
      }
      this.dummy.updateMatrix();
      this.mesh.setMatrixAt(i, this.dummy.matrix);
    }
    this.mesh.instanceMatrix.needsUpdate = true;
  }

  private _spawn(): void {
    const i = this.active.findIndex(a => !a);
    if (i < 0) return;
    this.active[i] = true;
    this.positions[i].copy(BUBBLER_POS);
    this.positions[i].x += (Math.random() - 0.5) * 0.3;
    this.positions[i].z += (Math.random() - 0.5) * 0.3;
    this.speeds[i] = 0.8 + Math.random() * 0.6;
  }
}
