// DI-013 — Game over scene
import { GAME } from '../config.js';
import StorageManager from '../systems/StorageManager.js';
import AudioManager from '../systems/AudioManager.js';

export default class GameOverScene extends Phaser.Scene {
  constructor() {
    super('GameOverScene');
  }

  init(data = {}) {
    this.score = data.score || 0;
  }

  create() {
    const { width, height } = this.scale;
    AudioManager.bindScene(this);
    AudioManager.playBgm(this, 'bgm-gameover');

    this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.65);
    this.add.text(width / 2, 150, 'GAME OVER', {
      fontFamily: 'monospace', fontSize: '48px', color: '#ffffff',
    }).setOrigin(0.5);

    this.add.text(width / 2, 215, `SCORE: ${this.score}`, {
      fontFamily: 'monospace', fontSize: '24px', color: '#f0c000',
    }).setOrigin(0.5);

    this.add.text(width / 2, 290, 'RETRY', {
      fontFamily: 'monospace', fontSize: '30px', color: '#ffffff',
    }).setOrigin(0.5).setInteractive({ useHandCursor: true }).on('pointerdown', () => {
      const save = StorageManager.load();
      StorageManager.save({ ...save });
      this.scene.start('GameScene', { level: 1, lives: GAME.LIVES_START, score: 0 });
    });

    this.add.text(width / 2, 340, 'MAIN MENU', {
      fontFamily: 'monospace', fontSize: '24px', color: '#ffffff',
    }).setOrigin(0.5).setInteractive({ useHandCursor: true }).on('pointerdown', () => {
      this.scene.start('MenuScene');
    });
  }
}
