// DI-003 — BootScene: preloads all assets then starts MenuScene
import { LEVELS } from '../config.js';
import AudioManager from '../systems/AudioManager.js';
import StorageManager from '../systems/StorageManager.js';

export default class BootScene extends Phaser.Scene {
  constructor() { super('BootScene'); }

  preload() {
    // Loading label (TC-006)
    const { width, height } = this.scale;
    this.add.text(width / 2, height / 2, 'LOADING\u2026', {
      fontFamily: 'monospace', fontSize: '28px', color: '#ffffff',
    }).setOrigin(0.5);

    // Spritesheets
    this.load.spritesheet('player', 'images/ga-001-player.svg', { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('goomba', 'images/ga-002-goomba.svg', { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('koopa',  'images/ga-003-koopa.svg',  { frameWidth: 32, frameHeight: 32 });
    this.load.image('tiles', 'images/ga-004-tiles.svg');
    this.load.spritesheet('tiles-frames', 'images/ga-004-tiles.svg', { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('items',  'images/ga-005-items.svg',  { frameWidth: 32, frameHeight: 32 });
    this.load.image('menu-bg', 'images/ga-006-menu-bg.svg');

    // Level tilemaps
    LEVELS.KEYS.forEach(key => {
      this.load.tilemapTiledJSON(key, `levels/${key}.json`);
    });

    // Audio (ogg preferred, mp3 fallback — CC0 sources documented in release notes)
    const audioFiles = [
      'bgm-level', 'bgm-gameover', 'bgm-levelcomplete',
      'sfx-jump', 'sfx-stomp', 'sfx-coin', 'sfx-powerup', 'sfx-death', 'sfx-levelcomplete',
    ];
    audioFiles.forEach(key => {
      this.load.audio(key, [`audio/${key}.ogg`, `audio/${key}.mp3`]);
    });

    this.load.json('assetManifest', 'assets-manifest.json');

    this.load.on('loaderror', (file) => {
      // Gracefully skip missing audio — game continues without sound
      console.warn(`Asset load failed (non-fatal): ${file.src}`);
    });
  }

  create() {
    StorageManager.load();
    AudioManager.init(this);
    this._defineAnimations();
    this.scene.start('MenuScene');
  }

  _defineAnimations() {
    // Player (GA-001: frames 0-4: idle, run1, run2, jump, dead)
    this.anims.create({ key: 'player-idle',    frames: [{ key: 'player', frame: 0 }], frameRate: 1, repeat: -1 });
    this.anims.create({ key: 'player-run',     frames: this.anims.generateFrameNumbers('player', { start: 1, end: 2 }), frameRate: 10, repeat: -1 });
    this.anims.create({ key: 'player-jump',    frames: [{ key: 'player', frame: 3 }], frameRate: 1 });
    this.anims.create({ key: 'player-dead',    frames: [{ key: 'player', frame: 4 }], frameRate: 1 });

    // Goomba (GA-002: frames 0-2: walk1, walk2, flat)
    this.anims.create({ key: 'goomba-walk',    frames: this.anims.generateFrameNumbers('goomba', { start: 0, end: 1 }), frameRate: 6, repeat: -1 });
    this.anims.create({ key: 'goomba-flat',    frames: [{ key: 'goomba', frame: 2 }], frameRate: 1 });

    // Koopa (GA-003: frames 0-3: walk1, walk2, shell-idle, shell-sliding)
    this.anims.create({ key: 'koopa-walk',     frames: this.anims.generateFrameNumbers('koopa', { start: 0, end: 1 }), frameRate: 6, repeat: -1 });
    this.anims.create({ key: 'koopa-shell',    frames: [{ key: 'koopa', frame: 2 }], frameRate: 1 });
    this.anims.create({ key: 'koopa-slide',    frames: [{ key: 'koopa', frame: 3 }], frameRate: 1 });
  }
}
