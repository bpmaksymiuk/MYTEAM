import * as THREE from 'three';
import type { FluidGrid } from '@/simulation/FluidGrid';

interface Plant {
  mesh: THREE.Mesh;
  baseX: number;
  baseZ: number;
  phase: number;
}

export class PlantSystem {
  private plants: Plant[] = [];

  constructor(scene: THREE.Scene) {
    const positions: [number, number][] = [
      [-5, -2.5], [-4, 2], [4.5, -2.3], [5, 2.4], [0, -2.8], [1, 2.6]
    ];

    for (const [bx, bz] of positions) {
      const points: THREE.Vector3[] = [];
      const height = 1.5 + Math.random() * 1.2;
      for (let i = 0; i <= 6; i++) {
        points.push(new THREE.Vector3(bx + Math.sin(i * 0.5) * 0.1, -3 + (i / 6) * height, bz));
      }
      const curve = new THREE.CatmullRomCurve3(points);
      const geo = new THREE.TubeGeometry(curve, 10, 0.06, 5, false);
      const mat = new THREE.MeshStandardMaterial({ color: 0x2e7d32, roughness: 0.8 });
      const mesh = new THREE.Mesh(geo, mat);
      scene.add(mesh);
      this.plants.push({ mesh, baseX: bx, baseZ: bz, phase: Math.random() * Math.PI * 2 });
    }
  }

  tick(dt: number, fluid: FluidGrid): void {
    for (const plant of this.plants) {
      plant.phase += dt;
      const gx = (plant.baseX + 6) / 12;
      const gz = (plant.baseZ + 3) / 6;
      const [fu] = fluid.sample(Math.max(0, Math.min(0.9999, gx)), Math.max(0, Math.min(0.9999, gz)));
      const sway = Math.sin(plant.phase * 0.7) * 0.04 + fu * 0.15;
      plant.mesh.rotation.z = sway;
    }
  }
}
