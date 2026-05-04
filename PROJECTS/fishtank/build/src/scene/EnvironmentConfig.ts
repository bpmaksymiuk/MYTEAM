import * as THREE from 'three';
import { AppState } from '@/state/AppState';

export interface ObstacleBounds { min: THREE.Vector3; max: THREE.Vector3; }

export function buildObstacleBounds(pos: THREE.Vector3, size: THREE.Vector3): ObstacleBounds {
  return { min: pos.clone().sub(size.clone().multiplyScalar(0.5)), max: pos.clone().add(size.clone().multiplyScalar(0.5)) };
}

export class EnvironmentConfig {
  readonly obstacleBounds: ObstacleBounds[] = [];

  constructor(scene: THREE.Scene) {
    // Substrate
    const subMat = new THREE.MeshStandardMaterial({ color: 0xd2b48c, roughness: 0.95 });
    const subGeo = new THREE.PlaneGeometry(12, 6);
    subGeo.rotateX(-Math.PI / 2);
    const substrate = new THREE.Mesh(subGeo, subMat);
    substrate.position.y = -3;
    substrate.receiveShadow = true;
    scene.add(substrate);

    // Substrate colour change on state
    AppState.instance().subscribe('substrateType', type => {
      if (type === 'sand')   subMat.color.set(0xd2b48c);
      if (type === 'gravel') subMat.color.set(0x808080);
      if (type === 'rock')   subMat.color.set(0x5a5a5a);
    });

    // Decorations
    const decorations: Array<{ key: 'shipwreck' | 'rocks' | 'artifacts'; geo: THREE.BufferGeometry; pos: THREE.Vector3; size: THREE.Vector3; color: number }> = [
      { key: 'shipwreck',  geo: new THREE.BoxGeometry(1.8, 1.0, 0.8), pos: new THREE.Vector3(-3, -2.5, 0),  size: new THREE.Vector3(1.8, 1.0, 0.8), color: 0x6b4f32 },
      { key: 'rocks',      geo: new THREE.DodecahedronGeometry(0.6),  pos: new THREE.Vector3(1.5, -2.7, 1), size: new THREE.Vector3(1.2, 1.2, 1.2), color: 0x555566 },
      { key: 'artifacts',  geo: new THREE.BoxGeometry(0.9, 0.7, 0.7), pos: new THREE.Vector3(3.5, -2.65, -1), size: new THREE.Vector3(0.9, 0.7, 0.7), color: 0x8b7355 },
    ];

    for (const d of decorations) {
      const mat = new THREE.MeshStandardMaterial({ color: d.color });
      const mesh = new THREE.Mesh(d.geo, mat);
      mesh.position.copy(d.pos);
      mesh.castShadow = true;
      scene.add(mesh);
      this.obstacleBounds.push(buildObstacleBounds(d.pos, d.size));

      AppState.instance().subscribe('decorations', decs => {
        mesh.visible = (decs as Record<string, boolean>)[d.key] ?? true;
      });
    }
  }
}
