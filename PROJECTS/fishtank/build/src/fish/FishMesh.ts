import * as THREE from 'three';
import { generateScaleTexture } from './ScaleTextureShader';

export interface FishMeshOptions {
  length: number;
  height: number;
  baseColour: string;
  highlightColour: string;
}

export function createFishMesh(renderer: THREE.WebGLRenderer, opts: FishMeshOptions): THREE.Object3D {
  const root = new THREE.Object3D();

  // Body
  const bodyGeo = new THREE.SphereGeometry(1, 16, 10);
  bodyGeo.scale(opts.length / 2, opts.height / 2, opts.height * 0.6);
  const scaleTex = generateScaleTexture(renderer, {
    scaleRows: 14,
    baseColour: opts.baseColour,
    highlightColour: opts.highlightColour,
    size: 256,
  });
  const bodyMat = new THREE.MeshStandardMaterial({ map: scaleTex, roughness: 0.7, metalness: 0.05 });
  const bodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
  root.add(bodyMesh);

  // Dorsal fin
  const dorsalGeo = new THREE.PlaneGeometry(opts.length * 0.45, opts.height * 0.7);
  dorsalGeo.translate(0, opts.height * 0.85, 0);
  const finMat = new THREE.MeshStandardMaterial({
    color: opts.highlightColour,
    transparent: true,
    opacity: 0.35,
    side: THREE.DoubleSide,
  });
  const dorsalFin = new THREE.Mesh(dorsalGeo, finMat);
  root.add(dorsalFin);

  // Pectoral fins (L and R)
  for (const side of [-1, 1]) {
    const pectGeo = new THREE.PlaneGeometry(opts.length * 0.25, opts.height * 0.55);
    pectGeo.translate(opts.length * -0.15, 0, side * opts.height * 0.35);
    const pectFin = new THREE.Mesh(pectGeo, (finMat.clone() as THREE.MeshStandardMaterial));
    (pectFin.material as THREE.MeshStandardMaterial).opacity = 0.45;
    pectFin.name = side === -1 ? 'pectLeft' : 'pectRight';
    root.add(pectFin);
  }

  // Caudal fin (tail)
  const caudalGeo = new THREE.PlaneGeometry(opts.length * 0.3, opts.height * 1.1);
  caudalGeo.translate(opts.length * 0.5, 0, 0);
  const caudalFin = new THREE.Mesh(caudalGeo, (finMat.clone() as THREE.MeshStandardMaterial));
  (caudalFin.material as THREE.MeshStandardMaterial).opacity = 0.5;
  caudalFin.name = 'caudal';
  root.add(caudalFin);

  // Eye (iris)
  const eyeGeo = new THREE.SphereGeometry(opts.height * 0.18, 8, 6);
  const eyeMat = new THREE.MeshStandardMaterial({ color: '#0a0a0a', roughness: 0.9, metalness: 0.0 });
  const eyeMesh = new THREE.Mesh(eyeGeo, eyeMat);
  eyeMesh.position.set(-opts.length * 0.42, opts.height * 0.1, opts.height * 0.28);
  root.add(eyeMesh);

  // Eye specular disc
  const specGeo = new THREE.SphereGeometry(opts.height * 0.07, 6, 4);
  const specMat = new THREE.MeshStandardMaterial({
    color: '#ffffff',
    roughness: 0.0,
    metalness: 0.1,
    transparent: true,
    opacity: 0.9,
  });
  const specMesh = new THREE.Mesh(specGeo, specMat);
  specMesh.position.copy(eyeMesh.position);
  specMesh.position.z += opts.height * 0.08;
  specMesh.position.y += opts.height * 0.08;
  root.add(specMesh);

  return root;
}
