// DI-001, DI-002 — Entry point: Phaser Game initialisation
import { GAME, PHYSICS } from './config.js';
import BootScene from './scenes/BootScene.js';
import MenuScene from './scenes/MenuScene.js';
import GameScene from './scenes/GameScene.js';
import HUDScene from './scenes/HUDScene.js';
import PauseScene from './scenes/PauseScene.js';
import LevelCompleteScene from './scenes/LevelCompleteScene.js';
import GameOverScene from './scenes/GameOverScene.js';

const config = {
  type: Phaser.AUTO,
  width: GAME.WIDTH,
  height: GAME.HEIGHT,
  backgroundColor: '#5c94fc',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: PHYSICS.GRAVITY },
      debug: false,
    },
  },
  fps: { target: 60, forceSetTimeOut: false },
  scene: [BootScene, MenuScene, GameScene, HUDScene, PauseScene, LevelCompleteScene, GameOverScene],
};

const game = new Phaser.Game(config);

// Exposed for Stage 10 automated verification hooks.
window.__SMB_GAME__ = game;
