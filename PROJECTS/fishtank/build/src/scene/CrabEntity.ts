import * as THREE from 'three';

const TANK_W = 12;
const TANK_H = 6;

const CARAPACE_COLOUR = 0x7c3f1e;
const LEG_COLOUR = 0x5a2d12;
const GAIT_FREQ = 1.5;
const SIDE_SPEED = 0.3;
const INTERACT_RADIUS = 1.5;
const PHASE_OFFSETS = [0, Math.PI / 4, Math.PI / 2, (3 * Math.PI) / 4];
const CLAMP_X = TANK_W / 2 - 0.8;
export const SUBSTRATE_Y = -TANK_H / 2;

export class CrabEntity {
  readonly root = new THREE.Object3D();
  private legs: THREE.Object3D[][] = [];
  private claws: THREE.Object3D[][] = [];
  private mixer: THREE.AnimationMixer;
  private defenseAction?: THREE.AnimationAction;
  private gaitTime = 0;
  private direction = 1;
  private walkTime = 0;

  constructor() {
    this.mixer = new THREE.AnimationMixer(this.root);
    this.buildCarapace();
    this.buildLegs();
    this.buildClaws();
    this.buildDefenseClip();
  }

  private buildCarapace(): void {
    const geo = new THREE.CylinderGeometry(0.5, 0.4, 0.18, 8);
    geo.applyMatrix4(new THREE.Matrix4().makeRotationX(Math.PI / 2));
    const mat = new THREE.MeshStandardMaterial({ color: CARAPACE_COLOUR, roughness: 0.8, metalness: 0.1 });
    this.root.add(new THREE.Mesh(geo, mat));
  }

  private buildLegs(): void {
    const lengths = [0.3, 0.28, 0.25];
    for (let side = 0; side < 2; side++) {
      const sideSign = side === 0 ? -1 : 1;
      for (let i = 0; i < 4; i++) {
        const chain: THREE.Object3D[] = [];
        const legRoot = new THREE.Object3D();
        legRoot.position.set(sideSign * 0.45, -0.06, (i - 1.5) * 0.18);
        this.root.add(legRoot);
        chain.push(legRoot);

        let parent = legRoot;
        for (const len of lengths) {
          const seg = new THREE.Object3D();
          seg.position.set(sideSign * len, 0, 0);
          parent.add(seg);
          const segGeo = new THREE.CylinderGeometry(0.025, 0.02, len, 5);
          segGeo.applyMatrix4(new THREE.Matrix4().makeRotationZ(Math.PI / 2));
          seg.add(new THREE.Mesh(segGeo, new THREE.MeshStandardMaterial({ color: LEG_COLOUR })));
          chain.push(seg);
          parent = seg;
        }
        this.legs.push(chain);
      }
    }
  }

  private buildClaws(): void {
    for (let side = 0; side < 2; side++) {
      const sideSign = side === 0 ? -1 : 1;
      const clawRoot = new THREE.Object3D();
      clawRoot.position.set(sideSign * 0.48, 0.04, -0.38);
      this.root.add(clawRoot);
      const chain: THREE.Object3D[] = [clawRoot];

      const merus = new THREE.Object3D();
      merus.name = `merus_${side}`;
      merus.position.set(sideSign * 0.18, 0, 0);
      clawRoot.add(merus);
      chain.push(merus);

      const dactyl = new THREE.Object3D();
      dactyl.position.set(sideSign * 0.14, 0, 0);
      merus.add(dactyl);
      const clawGeo = new THREE.SphereGeometry(0.07, 6, 4);
      dactyl.add(new THREE.Mesh(clawGeo, new THREE.MeshStandardMaterial({ color: CARAPACE_COLOUR })));
      chain.push(dactyl);
      this.claws.push(chain);
    }
  }

  private buildDefenseClip(): void {
    const times = [0, 0.3, 2.5, 2.8];
    const tracks: THREE.KeyframeTrack[] = [];

    this.claws.forEach((chain, side) => {
      const merus = chain[1] as THREE.Object3D;
      const sideSign = side === 0 ? -1 : 1;
      const q0 = new THREE.Quaternion();
      const q1 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, sideSign * 1.4));
      tracks.push(
        new THREE.QuaternionKeyframeTrack(
          `.bones[${merus.name}].quaternion`,
          times,
          [...q0.toArray(), ...q1.toArray(), ...q1.toArray(), ...q0.toArray()] as number[]
        )
      );
    });

    if (tracks.length > 0) {
      const clip = new THREE.AnimationClip('defense', 2.8, tracks);
      this.defenseAction = this.mixer.clipAction(clip);
      this.defenseAction.loop = THREE.LoopOnce;
      this.defenseAction.clampWhenFinished = true;
    }
  }

  onInteract(clickWorldPos: THREE.Vector3): void {
    const dist = this.root.position.distanceTo(clickWorldPos);
    if (dist < INTERACT_RADIUS) {
      this.defenseAction?.reset().play();
    }
  }

  update(dt: number): void {
    this.gaitTime += dt;
    this.walkTime += dt;

    this.legs.forEach((chain, legIdx) => {
      const side = legIdx < 4 ? 0 : 1;
      const localIdx = legIdx % 4;
      const phase = PHASE_OFFSETS[localIdx] + (side === 1 ? Math.PI : 0);
      const angle = Math.sin(2 * Math.PI * GAIT_FREQ * this.gaitTime + phase) * 0.35;
      if (chain[1]) chain[1].rotation.x = angle;
    });

    if (this.walkTime > 4.0) {
      this.direction *= -1;
      this.walkTime = 0;
    }
    this.root.position.x += this.direction * SIDE_SPEED * dt;
    this.root.position.x = THREE.MathUtils.clamp(this.root.position.x, -CLAMP_X, CLAMP_X);

    this.mixer.update(dt);
  }
}
