import * as THREE from 'three';
import type { FishSpecies } from '@/fish/FishSpecies';
import type { FluidGrid } from '@/simulation/FluidGrid';
import type { ObstacleBounds } from '@/scene/EnvironmentConfig';
import { TANK_W, TANK_H, TANK_D } from '@/scene/SceneManager';
import { FishAnimator } from '@/fish/FishAnimator';
import { generateScaleTexture } from '@/fish/ScaleTextureShader';

const HALF_W = TANK_W / 2 - 0.4;
const HALF_H = TANK_H / 2 - 0.4;
const HALF_D = TANK_D / 2 - 0.4;

const SPINE_COUNT = 8;
const CSTART_THRESHOLD = 0.8;
const CSTART_COOLDOWN = 3.0;

/**
 * Build a fish-shaped body using a parametric profile curve swept around the
 * spine. Produces a teardrop body with a head bulge, deep middle, and narrow
 * caudal peduncle. UVs: U around body (0=top dorsal, 0.5=ventral, 1=top seam),
 * V along length (0=head, 1=tail). Skin weights blend two adjacent spine bones
 * for smooth bending under the AnimationMixer's sine-wave clips.
 */
function buildFishBody(
  bodyLength: number,
  bodyHeight: number,
  speciesColor: number,
  finRayColour: number,
  highlightColour: number,
  stripeCount: number,
  stripeColour: number,
  lateralLine: number,
  renderer: THREE.WebGLRenderer,
): {
  skinnedMesh: THREE.SkinnedMesh;
  bones: THREE.Bone[];
  pectBones: THREE.Bone[];
} {
  // ---- Bones ----
  const segLen = bodyLength / SPINE_COUNT;
  const bones: THREE.Bone[] = [];
  for (let i = 0; i < SPINE_COUNT; i++) {
    const b = new THREE.Bone();
    b.name = `spine_${i}`;
    if (i === 0) {
      b.position.set(-bodyLength / 2, 0, 0);
    } else {
      b.position.set(segLen, 0, 0);
      bones[i - 1].add(b);
    }
    bones.push(b);
  }
  const pectBones: THREE.Bone[] = [];
  (['pect_L', 'pect_R'] as const).forEach((name, side) => {
    const pb = new THREE.Bone();
    pb.name = name;
    pb.position.set(0, 0, side === 0 ? -bodyLength * 0.15 : bodyLength * 0.15);
    bones[1].add(pb);
    pectBones.push(pb);
  });

  // ---- Profile curve (radius along the body, t = 0 head .. 1 tail) ----
  // Realistic fish silhouette: small snout, large head behind eyes,
  // peak depth around 0.30–0.35, smooth taper, tiny caudal peduncle.
  const radiusY = (t: number): number => {
    // head bulge contribution: 0..1 ramp to 0.2
    const head = Math.pow(Math.sin(Math.min(t / 0.18, 1) * Math.PI / 2), 0.7);
    // main body: gaussian centred at 0.30
    const main = Math.exp(-Math.pow((t - 0.30) / 0.32, 2.0));
    // peduncle taper to 0 at tail
    const taper = Math.max(0, 1 - Math.pow((t - 0.70) / 0.30, 2)) * (t > 0.70 ? 0.18 : 0);
    return Math.max(0.02, head * 0.55, main, taper);
  };

  const N_RINGS = 32;            // along length
  const M_RADIAL = 28;           // around body
  const HALF_HEIGHT = bodyLength * bodyHeight * 0.5;
  const HALF_WIDTH = bodyLength * 0.15; // lateral half-thickness (compression)

  const positions: number[] = [];
  const normals: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];
  const skinIndices: number[] = [];
  const skinWeights: number[] = [];

  for (let i = 0; i < N_RINGS; i++) {
    const t = i / (N_RINGS - 1);
    const x = -bodyLength / 2 + t * bodyLength;
    const ry = radiusY(t) * HALF_HEIGHT;
    const rz = radiusY(t) * HALF_WIDTH;

    // Skin weight blending across two adjacent spine bones
    const boneT = t * (SPINE_COUNT - 1);
    const boneA = Math.min(SPINE_COUNT - 2, Math.floor(boneT));
    const boneB = boneA + 1;
    const wB = boneT - boneA;
    const wA = 1 - wB;

    for (let j = 0; j < M_RADIAL; j++) {
      // theta: 0 at +Y (top), pi/2 at +Z (one side), pi at -Y (bottom), 3pi/2 at -Z
      const theta = (j / (M_RADIAL - 1)) * Math.PI * 2;
      const cy = Math.cos(theta);
      const cz = Math.sin(theta);
      const px = x;
      const py = ry * cy;
      const pz = rz * cz;
      positions.push(px, py, pz);
      // Approx normal: account for radius variation along the body for a smooth normal
      const n = new THREE.Vector3(0, cy, cz).normalize();
      normals.push(n.x, n.y, n.z);
      uvs.push(j / (M_RADIAL - 1), t);
      skinIndices.push(boneA, boneB, 0, 0);
      skinWeights.push(wA, wB, 0, 0);
    }
  }

  for (let i = 0; i < N_RINGS - 1; i++) {
    for (let j = 0; j < M_RADIAL - 1; j++) {
      const a = i * M_RADIAL + j;
      const b = a + 1;
      const c = a + M_RADIAL;
      const d = c + 1;
      indices.push(a, c, b);
      indices.push(b, c, d);
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geo.setIndex(indices);
  geo.setAttribute('skinIndex', new THREE.Uint16BufferAttribute(skinIndices, 4));
  geo.setAttribute('skinWeight', new THREE.Float32BufferAttribute(skinWeights, 4));
  geo.computeVertexNormals();

  // ---- Body texture ----
  const baseHex = '#' + new THREE.Color(speciesColor).getHexString();
  const hlHex = '#' + new THREE.Color(highlightColour).getHexString();
  const stripeHex = '#' + new THREE.Color(stripeColour).getHexString();
  const scaleTex = generateScaleTexture(renderer, {
    scaleRows: 18,
    baseColour: baseHex,
    highlightColour: hlHex,
    stripeColour: stripeHex,
    stripeCount,
    lateralLine,
    size: 1024,
  });
  const mat = new THREE.MeshStandardMaterial({
    map: scaleTex,
    roughness: 0.45,
    metalness: 0.20,
  });
  const skinnedMesh = new THREE.SkinnedMesh(geo, mat);
  skinnedMesh.castShadow = true;
  skinnedMesh.receiveShadow = true;

  const skeleton = new THREE.Skeleton(bones);
  skinnedMesh.add(bones[0]);
  skinnedMesh.bind(skeleton);

  // ---- Fin material: translucent, with subtle fin-ray colour ----
  const finBase = new THREE.Color(speciesColor).lerp(new THREE.Color(highlightColour), 0.35);
  const finMat = new THREE.MeshStandardMaterial({
    color: finBase,
    transparent: true,
    opacity: 0.78,
    roughness: 0.5,
    metalness: 0.1,
    side: THREE.DoubleSide,
    depthWrite: false,
  });
  const finRayMat = new THREE.LineBasicMaterial({
    color: finRayColour,
    transparent: true,
    opacity: 0.65,
  });

  // Helper: build a curved fin with rays
  function makeFin(
    shape: THREE.Shape,
    rayCount: number,
    rayLength: number,
    name: string,
  ): THREE.Group {
    const g = new THREE.Group();
    g.name = name;
    const fGeo = new THREE.ShapeGeometry(shape);
    const fMesh = new THREE.Mesh(fGeo, finMat.clone());
    g.add(fMesh);

    // Add fin rays as line segments radiating from base
    const rayPositions: number[] = [];
    for (let i = 0; i < rayCount; i++) {
      const u = (i + 0.5) / rayCount;
      // sample shape outline rough start point along x
      const startX = -rayLength * 0.5 + u * rayLength;
      const startY = 0;
      const endY = rayLength * 0.95 * (1.0 - Math.abs(u - 0.5) * 0.4);
      const endX = startX + (u - 0.5) * 0.05 * rayLength;
      rayPositions.push(startX, startY, 0, endX, endY, 0);
    }
    const rayGeo = new THREE.BufferGeometry();
    rayGeo.setAttribute('position', new THREE.Float32BufferAttribute(rayPositions, 3));
    const rays = new THREE.LineSegments(rayGeo, finRayMat);
    g.add(rays);
    return g;
  }

  // ---- Dorsal fin (curved triangle along top of body) ----
  {
    const L = bodyLength * 0.55;
    const H = bodyLength * 0.32 * Math.max(0.7, bodyHeight);
    const s = new THREE.Shape();
    s.moveTo(-L / 2, 0);
    s.bezierCurveTo(-L * 0.35, H * 0.55, -L * 0.05, H * 1.0, L * 0.10, H * 0.85);
    s.bezierCurveTo(L * 0.30, H * 0.60, L * 0.45, H * 0.10, L / 2, 0);
    s.lineTo(-L / 2, 0);
    const dorsal = makeFin(s, 9, L, 'dorsal');
    dorsal.position.set(0, HALF_HEIGHT * 0.95, 0);
    // Render orthogonal to the lateral plane (lying in the XZ→XY rotated):
    // The Shape lives in XY; we want it standing up along XY with thickness in Z (already there).
    skinnedMesh.add(dorsal);
  }

  // ---- Anal fin (smaller, on belly behind midpoint) ----
  {
    const L = bodyLength * 0.30;
    const H = bodyLength * 0.16 * Math.max(0.7, bodyHeight);
    const s = new THREE.Shape();
    s.moveTo(-L / 2, 0);
    s.bezierCurveTo(-L * 0.30, -H * 0.55, L * 0.10, -H * 0.95, L * 0.30, -H * 0.65);
    s.bezierCurveTo(L * 0.40, -H * 0.30, L * 0.50, 0, L / 2, 0);
    s.lineTo(-L / 2, 0);
    const anal = makeFin(s, 7, L, 'anal');
    anal.position.set(bodyLength * 0.18, -HALF_HEIGHT * 0.92, 0);
    skinnedMesh.add(anal);
  }

  // ---- Caudal (tail) fin: forked shape ----
  {
    const L = bodyLength * 0.30;
    const H = bodyLength * 0.55 * Math.max(0.6, bodyHeight);
    const s = new THREE.Shape();
    s.moveTo(0, 0);
    s.bezierCurveTo(L * 0.20, H * 0.35, L * 0.55, H * 0.80, L * 0.95, H * 0.85);
    s.lineTo(L * 0.55, H * 0.20);          // fork notch top
    s.lineTo(L * 0.55, -H * 0.20);         // fork notch bottom
    s.lineTo(L * 0.95, -H * 0.85);
    s.bezierCurveTo(L * 0.55, -H * 0.80, L * 0.20, -H * 0.35, 0, 0);
    const caudalGroup = makeFin(s, 11, L, 'caudal');
    caudalGroup.position.set(bodyLength * 0.50, 0, 0);
    skinnedMesh.add(caudalGroup);
  }

  // ---- Pectoral fins (paired, on each flank) ----
  for (const side of [-1, 1]) {
    const L = bodyLength * 0.22;
    const H = bodyLength * 0.18;
    const s = new THREE.Shape();
    s.moveTo(0, 0);
    s.bezierCurveTo(L * 0.1, H * 0.35, L * 0.55, H * 0.55, L * 0.85, H * 0.30);
    s.bezierCurveTo(L * 0.95, H * 0.05, L * 0.85, -H * 0.30, L * 0.55, -H * 0.45);
    s.bezierCurveTo(L * 0.20, -H * 0.50, L * 0.05, -H * 0.20, 0, 0);
    const pect = makeFin(s, 6, L, `pect_${side === -1 ? 'L' : 'R'}`);
    pect.rotation.y = side * Math.PI / 2;       // make it lie flat on flank
    pect.rotation.z = -0.25;                     // slight downward droop
    pect.position.set(-bodyLength * 0.22, -HALF_HEIGHT * 0.15, side * HALF_WIDTH * 0.95);
    skinnedMesh.add(pect);
  }

  // ---- Pelvic fins (small pair under the belly) ----
  for (const side of [-1, 1]) {
    const L = bodyLength * 0.10;
    const H = bodyLength * 0.13;
    const s = new THREE.Shape();
    s.moveTo(0, 0);
    s.bezierCurveTo(L * 0.2, -H * 0.6, L * 0.7, -H * 0.9, L * 0.9, -H * 0.4);
    s.bezierCurveTo(L * 0.8, -H * 0.1, L * 0.4, 0, 0, 0);
    const pelv = makeFin(s, 4, L, `pelv_${side === -1 ? 'L' : 'R'}`);
    pelv.rotation.y = side * Math.PI / 2;
    pelv.position.set(-bodyLength * 0.05, -HALF_HEIGHT * 0.85, side * HALF_WIDTH * 0.7);
    skinnedMesh.add(pelv);
  }

  // ---- Eye: 3-layer (sclera + iris + pupil) + bright specular dot ----
  for (const side of [-1, 1]) {
    const eyeR = bodyLength * 0.055;
    const eyePos = new THREE.Vector3(-bodyLength * 0.36, bodyLength * 0.12, side * HALF_WIDTH * 1.05);

    // sclera (white)
    const scleraMat = new THREE.MeshStandardMaterial({ color: 0xf2eedd, roughness: 0.4, metalness: 0.1 });
    const sclera = new THREE.Mesh(new THREE.SphereGeometry(eyeR, 16, 12), scleraMat);
    sclera.position.copy(eyePos);
    skinnedMesh.add(sclera);

    // iris (small disc-like sphere offset outward)
    const irisCol = new THREE.Color(highlightColour).lerp(new THREE.Color(0x000000), 0.55);
    const irisMat = new THREE.MeshStandardMaterial({ color: irisCol, roughness: 0.3, metalness: 0.4 });
    const iris = new THREE.Mesh(new THREE.SphereGeometry(eyeR * 0.7, 12, 10), irisMat);
    iris.position.copy(eyePos);
    iris.position.z += side * eyeR * 0.45;
    skinnedMesh.add(iris);

    // pupil
    const pupilMat = new THREE.MeshStandardMaterial({ color: 0x050505, roughness: 0.9 });
    const pupil = new THREE.Mesh(new THREE.SphereGeometry(eyeR * 0.40, 10, 8), pupilMat);
    pupil.position.copy(eyePos);
    pupil.position.z += side * eyeR * 0.65;
    skinnedMesh.add(pupil);

    // specular highlight
    const specMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.95 });
    const spec = new THREE.Mesh(new THREE.SphereGeometry(eyeR * 0.18, 8, 6), specMat);
    spec.position.copy(eyePos);
    spec.position.z += side * eyeR * 0.78;
    spec.position.y += eyeR * 0.30;
    spec.position.x -= eyeR * 0.10;
    skinnedMesh.add(spec);
  }

  // ---- Mouth (small dark line at front of head) ----
  {
    const mouthMat = new THREE.MeshStandardMaterial({ color: 0x1a0e08, roughness: 0.9 });
    const mouth = new THREE.Mesh(new THREE.BoxGeometry(bodyLength * 0.04, bodyLength * 0.012, bodyLength * 0.10), mouthMat);
    mouth.position.set(-bodyLength * 0.48, -bodyLength * 0.02, 0);
    skinnedMesh.add(mouth);
  }

  return { skinnedMesh, bones, pectBones };
}

export class FishAgent {
  readonly species: FishSpecies;
  readonly mesh: THREE.SkinnedMesh;
  readonly animator: FishAnimator;
  pos: THREE.Vector3;
  vel: THREE.Vector3;
  private wander = new THREE.Vector3(1, 0, 0);
  private wanderTimer = 0;
  private cstartCooldown = 0;
  foodTarget: THREE.Vector3 | null = null;

  constructor(species: FishSpecies, startPos: THREE.Vector3, scene: THREE.Scene, renderer: THREE.WebGLRenderer) {
    this.species = species;
    this.pos = startPos.clone();
    this.vel = new THREE.Vector3(
      (Math.random() - 0.5) * species.speed,
      (Math.random() - 0.5) * 0.2,
      (Math.random() - 0.5) * species.speed
    );

    const bodyLength = 0.35 * (species.scale / 0.12);
    const { skinnedMesh, bones, pectBones } = buildFishBody(
      bodyLength,
      species.bodyHeight,
      species.color,
      species.finRayColour,
      species.highlightColour,
      species.stripeCount,
      species.stripeColour,
      species.lateralLine,
      renderer,
    );
    this.mesh = skinnedMesh;
    scene.add(this.mesh);

    this.animator = new FishAnimator(skinnedMesh, bones, pectBones);
  }

  checkCursorProximity(cursorWorld: THREE.Vector3, dt: number): void {
    if (this.cstartCooldown > 0) {
      this.cstartCooldown -= dt;
      return;
    }
    if (this.pos.distanceTo(cursorWorld) < CSTART_THRESHOLD) {
      this.animator.triggerCStart();
      this.cstartCooldown = CSTART_COOLDOWN;
    }
  }

  private _seek(target: THREE.Vector3): THREE.Vector3 {
    return target.clone().sub(this.pos).normalize().multiplyScalar(this.species.speed);
  }

  private _flee(threat: THREE.Vector3): THREE.Vector3 {
    return this.pos.clone().sub(threat).normalize().multiplyScalar(this.species.speed);
  }

  private _wander(dt: number): THREE.Vector3 {
    this.wanderTimer -= dt;
    if (this.wanderTimer <= 0) {
      this.wander.set(Math.random() - 0.5, (Math.random() - 0.5) * 0.3, Math.random() - 0.5).normalize();
      this.wanderTimer = 1.5 + Math.random() * 2;
    }
    return this.wander.clone().multiplyScalar(this.species.speed * 0.5);
  }

  private _separate(neighbours: FishAgent[]): THREE.Vector3 {
    const force = new THREE.Vector3();
    for (const n of neighbours) {
      const d = this.pos.distanceTo(n.pos);
      if (d < 0.8 && d > 0.001) force.add(this.pos.clone().sub(n.pos).normalize().divideScalar(d));
    }
    return force;
  }

  private _align(neighbours: FishAgent[]): THREE.Vector3 {
    if (!neighbours.length) return new THREE.Vector3();
    const avg = new THREE.Vector3();
    for (const n of neighbours) avg.add(n.vel);
    return avg.divideScalar(neighbours.length).normalize().multiplyScalar(this.species.speed);
  }

  private _cohere(neighbours: FishAgent[]): THREE.Vector3 {
    if (!neighbours.length) return new THREE.Vector3();
    const center = new THREE.Vector3();
    for (const n of neighbours) center.add(n.pos);
    center.divideScalar(neighbours.length);
    return this._seek(center);
  }

  private _avoidObstacles(obstacles: ObstacleBounds[]): THREE.Vector3 {
    const force = new THREE.Vector3();
    for (const ob of obstacles) {
      const closest = new THREE.Vector3(
        Math.max(ob.min.x, Math.min(ob.max.x, this.pos.x)),
        Math.max(ob.min.y, Math.min(ob.max.y, this.pos.y)),
        Math.max(ob.min.z, Math.min(ob.max.z, this.pos.z))
      );
      const d = this.pos.distanceTo(closest);
      if (d < 1.0 && d > 0.001) force.add(this.pos.clone().sub(closest).normalize().divideScalar(d));
    }
    return force;
  }

  private _preferredY(): THREE.Vector3 {
    const targetY = -HALF_H + (this.species.preferredY + 0.5) * TANK_H * 0.8;
    return new THREE.Vector3(0, targetY - this.pos.y, 0).multiplyScalar(0.5);
  }

  update(
    dt: number,
    neighbours: FishAgent[],
    obstacles: ObstacleBounds[],
    fluid: FluidGrid,
    foodItems: THREE.Vector3[]
  ): void {
    const w = this.species.weights;
    const steering = new THREE.Vector3();

    // Food seek overrides wander when food is close
    if (foodItems.length > 0) {
      const nearest = foodItems.reduce((best, f) => this.pos.distanceTo(f) < this.pos.distanceTo(best) ? f : best, foodItems[0]);
      const dist = this.pos.distanceTo(nearest);
      if (dist < 3.0) {
        steering.addScaledVector(this._seek(nearest), w.seek * 2.5);
        this.foodTarget = nearest;
      } else {
        this.foodTarget = null;
        steering.addScaledVector(this._wander(dt), w.wander);
      }
    } else {
      this.foodTarget = null;
      steering.addScaledVector(this._wander(dt), w.wander);
    }

    steering.addScaledVector(this._separate(neighbours), w.separate);
    steering.addScaledVector(this._align(neighbours), w.align);
    steering.addScaledVector(this._cohere(neighbours), w.cohere);
    steering.addScaledVector(this._avoidObstacles(obstacles), w.avoidObstacle);
    steering.addScaledVector(this._preferredY(), w.preferredY);

    // Fluid nudge (wake injection: inject impulse on move)
    const gx = (this.pos.x + 6) / 12;
    const gz = (this.pos.z + 3) / 6;
    fluid.addImpulse(
      Math.max(0, Math.min(0.9999, gx)),
      Math.max(0, Math.min(0.9999, gz)),
      this.vel.x * 0.04, this.vel.z * 0.04, 2
    );

    this.vel.addScaledVector(steering, dt);
    const maxSpeed = this.species.speed * 1.2;
    if (this.vel.length() > maxSpeed) this.vel.normalize().multiplyScalar(maxSpeed);

    this.pos.addScaledVector(this.vel, dt);

    // Boundary clamp
    this.pos.x = Math.max(-HALF_W, Math.min(HALF_W, this.pos.x));
    this.pos.y = Math.max(-HALF_H, Math.min(HALF_H, this.pos.y));
    this.pos.z = Math.max(-HALF_D, Math.min(HALF_D, this.pos.z));

    this.mesh.position.copy(this.pos);
    if (this.vel.length() > 0.01) {
      // Fish body is along X axis (-X = head/front). Align -X with the velocity direction.
      const dir = this.vel.clone().normalize();
      const q = new THREE.Quaternion();
      q.setFromUnitVectors(new THREE.Vector3(-1, 0, 0), dir);
      this.mesh.quaternion.copy(q);
    }

    // Drive speed state from velocity magnitude
    const speed = this.vel.length();
    const curMaxSpeed = this.species.speed * 1.2;
    if (speed < curMaxSpeed * 0.3) {
      this.animator.setSpeedState('idle');
    } else if (speed < curMaxSpeed * 0.7) {
      this.animator.setSpeedState('cruise');
    } else {
      this.animator.setSpeedState('burst');
    }
    this.animator.update(dt);
  }
}
