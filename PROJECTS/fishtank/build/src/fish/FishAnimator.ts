import * as THREE from 'three';

export type SpeedState = 'idle' | 'cruise' | 'burst';

const CROSSFADE: Record<string, number> = {
  'idle->cruise': 0.4,
  'cruise->idle': 0.6,
  'cruise->burst': 0.2,
  'burst->cruise': 0.6,
  'idle->burst': 0.3,
  'burst->idle': 0.8,
};

const AMP: Record<SpeedState, number> = { idle: 0.08, cruise: 0.20, burst: 0.38 };
const PERIOD: Record<SpeedState, number> = { idle: 2.0, cruise: 1.0, burst: 0.45 };
const PECT_ANGLE: Record<SpeedState, number> = { idle: 0.61, cruise: 0.26, burst: 0.0 };

function makeSinClip(
  name: string,
  bones: THREE.Bone[],
  amp: number,
  period: number
): THREE.AnimationClip {
  const tracks: THREE.KeyframeTrack[] = [];
  const numFrames = 16;
  const times = Array.from({ length: numFrames + 1 }, (_, i) => (i / numFrames) * period);

  bones.forEach((bone, i) => {
    if (i === 0) return;
    const phase = (i / bones.length) * Math.PI;
    const rearWeight = i / bones.length;
    const values: number[] = [];
    times.forEach(t => {
      const angle = Math.sin((2 * Math.PI * t / period) + phase) * amp * rearWeight;
      const q = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, angle, 0));
      values.push(q.x, q.y, q.z, q.w);
    });
    tracks.push(new THREE.QuaternionKeyframeTrack(`${bone.name}.quaternion`, times, values));
  });

  return new THREE.AnimationClip(name, period, tracks);
}

function makeCStartClip(bones: THREE.Bone[]): THREE.AnimationClip {
  const times = [0, 0.08, 0.25];
  const tracks: THREE.KeyframeTrack[] = [];

  bones.forEach((bone, i) => {
    if (i < 2) return;
    const bendAmp = 0.6 * (i / bones.length);
    const q0 = new THREE.Quaternion();
    const q1 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, bendAmp, 0));
    const values = [...q0.toArray(), ...q1.toArray(), ...q0.toArray()];
    tracks.push(new THREE.QuaternionKeyframeTrack(`${bone.name}.quaternion`, times, values as number[]));
  });

  return new THREE.AnimationClip('cstart', 0.25, tracks);
}

export class FishAnimator {
  private mixer: THREE.AnimationMixer;
  private actions: Record<string, THREE.AnimationAction>;
  private currentState: SpeedState = 'idle';
  private pectBones: THREE.Bone[];

  constructor(skinnedMesh: THREE.SkinnedMesh, bones: THREE.Bone[], pectBones: THREE.Bone[]) {
    this.mixer = new THREE.AnimationMixer(skinnedMesh);
    this.pectBones = pectBones;

    const clips = {
      idle: makeSinClip('idle', bones, AMP.idle, PERIOD.idle),
      cruise: makeSinClip('cruise', bones, AMP.cruise, PERIOD.cruise),
      burst: makeSinClip('burst', bones, AMP.burst, PERIOD.burst),
      cstart: makeCStartClip(bones),
    };

    this.actions = {};
    for (const [key, clip] of Object.entries(clips)) {
      this.actions[key] = this.mixer.clipAction(clip);
    }
    this.actions.idle.play();
  }

  setSpeedState(next: SpeedState): void {
    if (next === this.currentState) return;
    const key = `${this.currentState}->${next}`;
    const duration = CROSSFADE[key] ?? 0.4;
    this.actions[this.currentState].crossFadeTo(this.actions[next], duration, true);
    this.actions[next].play();
    this.currentState = next;
    const angle = PECT_ANGLE[next];
    this.pectBones.forEach(b => { b.rotation.z = angle; });
  }

  triggerCStart(): void {
    const cstart = this.actions.cstart;
    cstart.reset().play();
    cstart.clampWhenFinished = true;
    cstart.loop = THREE.LoopOnce;
    const onFinished = (e: { action: THREE.AnimationAction }) => {
      if (e.action === cstart) {
        this.setSpeedState('burst');
        this.mixer.removeEventListener('finished', onFinished);
      }
    };
    this.mixer.addEventListener('finished', onFinished);
  }

  update(dt: number): void {
    this.mixer.update(dt);
  }
}
