import * as THREE from 'three';
import type { AppState } from '@/state/AppState';
import type { SceneManager } from '@/scene/SceneManager';
import { TANK_W, TANK_H } from '@/scene/SceneManager';

let frontWindowCamera: THREE.PerspectiveCamera | null = null;
let overlay: HTMLDivElement | null = null;

function buildFrontCamera(): THREE.PerspectiveCamera {
  const fov = 2 * THREE.MathUtils.RAD2DEG * Math.atan((TANK_H / 2) / 14);
  const cam = new THREE.PerspectiveCamera(fov, TANK_W / TANK_H, 0.1, 100);
  cam.position.set(0, 0, 14);
  cam.lookAt(0, 0, 0);
  cam.name = 'frontWindow';
  return cam;
}

function buildOverlay(state: AppState, sceneManager: SceneManager): HTMLDivElement {
  const div = document.createElement('div');
  div.id = 'front-window-overlay';
  div.style.cssText = `
    position: fixed; inset: 0; background: rgba(0,0,0,0.05);
    pointer-events: none; z-index: 90; display: none;
    border: 3px solid rgba(80,160,255,0.45);
  `;

  const exitBtn = document.createElement('button');
  exitBtn.id = 'btn-exit-window';
  exitBtn.setAttribute('aria-label', 'Exit window mode');
  exitBtn.textContent = '✕ Exit Window';
  exitBtn.style.cssText = `
    position: fixed; top: 12px; right: 12px;
    pointer-events: auto; z-index: 95;
    padding: 6px 14px; background: rgba(20,40,80,0.85);
    color: #fff; border: 1px solid rgba(80,160,255,0.5);
    border-radius: 5px; cursor: pointer; font-size: 0.85rem;
    display: none;
  `;
  exitBtn.addEventListener('click', () => {
    state.set('frontWindowMode', false);
  });

  document.body.appendChild(div);
  document.body.appendChild(exitBtn);
  overlay = div;

  return div;
}

export function initFrontWindowMode(state: AppState, sceneManager: SceneManager): void {
  frontWindowCamera = buildFrontCamera();
  buildOverlay(state, sceneManager);

  state.subscribe('frontWindowMode', (active) => {
    if (active) {
      sceneManager.setActiveCamera(frontWindowCamera!);
      if (overlay) overlay.style.display = 'block';
      const exitBtn = document.getElementById('btn-exit-window');
      if (exitBtn) exitBtn.style.display = 'block';
    } else {
      sceneManager.setActiveCamera(sceneManager.defaultCamera);
      if (overlay) overlay.style.display = 'none';
      const exitBtn = document.getElementById('btn-exit-window');
      if (exitBtn) exitBtn.style.display = 'none';
    }
  });
}
