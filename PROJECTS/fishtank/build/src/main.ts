import { AppState } from '@/state/AppState';
import { Renderer } from '@/renderer/Renderer';
import { SceneManager } from '@/scene/SceneManager';
import { FluidGrid } from '@/simulation/FluidGrid';
import { ParticleSystem } from '@/scene/ParticleSystem';
import { BubbleSystem } from '@/scene/BubbleSystem';
import { PlantSystem } from '@/scene/PlantSystem';
import { EnvironmentConfig } from '@/scene/EnvironmentConfig';
import { FishManager } from '@/fish/FishManager';
import { AudioManager } from '@/audio/AudioManager';
import { InputManager } from '@/input/InputManager';
import { HUD } from '@/ui/HUD';
import { initFrontWindowMode } from '@/ui/FrontWindowMode';

// 1. Resolve DOM elements
const canvas = document.getElementById('tank-canvas') as HTMLCanvasElement;
const hudRoot = document.getElementById('hud-root') as HTMLDivElement;

// 2. Boot state
const state = AppState.instance();

// 3. Renderer
const renderer = new Renderer(canvas);

// 4. Scene
const sceneManager = new SceneManager(renderer);

// 5. Fluid grid
const fluidGrid = new FluidGrid();

// 6. Environment (substrate + decorations + obstacles)
const environment = new EnvironmentConfig(sceneManager.scene);

// 7. Particle system
const particles = new ParticleSystem(sceneManager.scene);

// 8. Bubble system
const bubbles = new BubbleSystem(sceneManager.scene);
state.subscribe('bubblerRate', rate => bubbles.setBubblerRate(rate as number));

// 9. Plant system
const plants = new PlantSystem(sceneManager.scene);

// 10. Fish manager
const fishManager = new FishManager(sceneManager.scene, renderer.threeRenderer);

// 11. Audio manager (lazy-inited on first pointer gesture via InputManager)
const audio = AudioManager.instance();
state.subscribe('audioEnabled', enabled => audio.setEnabled(enabled as boolean));

// 12. Input manager
const input = new InputManager(canvas, sceneManager, particles);
input.setFishManager(fishManager);

// 13. HUD
const hud = new HUD(hudRoot);

// 14. Front window mode
initFrontWindowMode(state, sceneManager);

// 14. Register tick callbacks (order matters)
renderer.onTick(dt => fluidGrid.step(dt));
renderer.onTick(dt => bubbles.tick(dt));
renderer.onTick(dt => plants.tick(dt, fluidGrid));
renderer.onTick(dt => particles.tick(dt, fluidGrid));
renderer.onTick(dt => fishManager.tick(dt, fluidGrid, environment.obstacleBounds, particles));
renderer.onTick(dt => input.tick(dt));
renderer.onTick(dt => sceneManager.tick(dt));

// 15. Start the render loop
renderer.start();
