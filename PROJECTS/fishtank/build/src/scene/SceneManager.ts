import * as THREE from 'three';
import { AppState } from '@/state/AppState';
import type { Renderer } from '@/renderer/Renderer';
import { CrabEntity, SUBSTRATE_Y } from '@/scene/CrabEntity';

export const TANK_W = 12;
export const TANK_H = 6;
export const TANK_D = 6;

import waterVert from '@/renderer/shaders/water.vert?raw';
import waterFrag from '@/renderer/shaders/water.frag?raw';
import causticsFrag from '@/renderer/shaders/caustics.frag?raw';

export class SceneManager {
  readonly scene: THREE.Scene;
  readonly isoCamera: THREE.OrthographicCamera;
  readonly perspCamera: THREE.PerspectiveCamera;
  private activeCamera: THREE.Camera;
  private waterMesh: THREE.Mesh;
  private causticMesh: THREE.Mesh;
  private waterUniforms: Record<string, THREE.IUniform>;
  private causticUniforms: Record<string, THREE.IUniform>;
  private renderer: Renderer;
  readonly crab: CrabEntity;

  constructor(renderer: Renderer) {
    this.renderer = renderer;
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x050e1a);

    // Cameras
    const aspect = window.innerWidth / window.innerHeight;
    const viewSize = TANK_H * 1.4;
    this.isoCamera = new THREE.OrthographicCamera(
      -viewSize * aspect / 2, viewSize * aspect / 2,
      viewSize / 2, -viewSize / 2, 0.1, 100
    );
    this.isoCamera.position.set(14, 10, 14);
    this.isoCamera.lookAt(0, 0, 0);

    this.perspCamera = new THREE.PerspectiveCamera(55, aspect, 0.1, 100);
    this.perspCamera.position.set(0, 3, 14);
    this.perspCamera.lookAt(0, 0, 0);

    const state = AppState.instance();
    this.activeCamera = state.get('cameraMode') === 'isometric' ? this.isoCamera : this.perspCamera;
    state.subscribe('cameraMode', mode => {
      this.activeCamera = mode === 'isometric' ? this.isoCamera : this.perspCamera;
    });

    // Lighting
    const ambient = new THREE.AmbientLight(0x112233, 0.9);
    const dirLight = new THREE.DirectionalLight(0xaad4f5, 1.4);
    dirLight.position.set(5, 12, 8);
    dirLight.castShadow = true;
    this.scene.add(ambient, dirLight);

    // Tank walls (transparent box)
    const wallMat = new THREE.MeshStandardMaterial({
      color: 0x1a4a6a, transparent: true, opacity: 0.12, side: THREE.BackSide
    });
    const tankGeo = new THREE.BoxGeometry(TANK_W, TANK_H, TANK_D);
    const walls = new THREE.Mesh(tankGeo, wallMat);
    this.scene.add(walls);

    // Water surface
    this.waterUniforms = {
      uTime: { value: 0 },
      uWaveAmplitude: { value: 0.08 },
      uWaveFrequency: { value: 1.5 },
    };
    const waterGeo = new THREE.PlaneGeometry(TANK_W, TANK_D, 32, 32);
    waterGeo.rotateX(-Math.PI / 2);
    this.waterMesh = new THREE.Mesh(waterGeo, new THREE.ShaderMaterial({
      vertexShader: waterVert,
      fragmentShader: waterFrag,
      uniforms: this.waterUniforms,
      transparent: true,
      side: THREE.DoubleSide,
    }));
    this.waterMesh.position.y = TANK_H / 2 - 0.05;
    this.scene.add(this.waterMesh);

    // Caustic plane (floor)
    this.causticUniforms = {
      uTime: { value: 0 },
      uCausticIntensity: { value: 1.2 },
    };
    const causticGeo = new THREE.PlaneGeometry(TANK_W, TANK_D);
    causticGeo.rotateX(-Math.PI / 2);
    this.causticMesh = new THREE.Mesh(causticGeo, new THREE.ShaderMaterial({
      vertexShader: 'varying vec2 vUv; void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}',
      fragmentShader: causticsFrag,
      uniforms: this.causticUniforms,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }));
    this.causticMesh.position.y = -TANK_H / 2 + 0.01;
    this.scene.add(this.causticMesh);

    // Crab
    this.crab = new CrabEntity();
    this.crab.root.position.set(0, SUBSTRATE_Y + 0.12, 0);
    this.scene.add(this.crab.root);
  }

  setActiveCamera(cam: THREE.Camera): void {
    this.activeCamera = cam;
  }

  get defaultCamera(): THREE.Camera {
    return AppState.instance().get('cameraMode') === 'isometric' ? this.isoCamera : this.perspCamera;
  }

  tick(dt: number): void {
    this.waterUniforms['uTime'].value += dt;
    this.causticUniforms['uTime'].value += dt;
    this.crab.update(dt);
    this.renderer.threeRenderer.render(this.scene, this.activeCamera);
  }
}
