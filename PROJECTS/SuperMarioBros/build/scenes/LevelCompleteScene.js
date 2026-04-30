// DI-012 — Level complete scene
import { LEVELS } from '../config.js';
import StorageManager from '../systems/StorageManager.js';
import AudioManager from '../systems/AudioManager.js';

export default class LevelCompleteScene extends Phaser.Scene {
  constructor() {
    super('LevelCompleteScene');
  }

  init(data = {}) {
    this.level = data.level || 1;
    this.score = data.score || 0;
    this.timeLeft = data.timeLeft || 0;
    this.lives = data.lives || 3;
  }

  create() {
    const { width, height } = this.scale;
    AudioManager.bindScene(this);
    AudioManager.playBgm(this, 'bgm-levelcomplete');

    const save = StorageManager.load();
    StorageManager.save({
      ...save,
      highScore: Math.max(save.highScore, this.score),
      unlockedLevel: Math.max(save.unlockedLevel, Math.min(this.level + 1, LEVELS.COUNT)),
    });

    this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.55);
    this.add.text(width / 2, 130, 'LEVEL COMPLETE!', { fontFamily: 'monospace', fontSize: '36px', color: '#ffffff' }).setOrigin(0.5);
    this.add.text(width / 2, 210, `SCORE: ${this.score}`, { fontFamily: 'monospace', fontSize: '24px', color: '#f0c000' }).setOrigin(0.5);
    this.add.text(width / 2, 250, `TIME REMAINING: ${this.timeLeft}`, { fontFamily: 'monospace', fontSize: '22px', color: '#ffffff' }).setOrigin(0.5);

    if (this.level < LEVELS.COUNT) {
      this.add.text(width / 2, 320, 'NEXT LEVEL', {
        fontFamily: 'monospace', fontSize: '26px', color: '#ffffff',
      }).setOrigin(0.5).setInteractive({ useHandCursor: true }).on('pointerdown', () => {
        this.scene.start('GameScene', { level: this.level + 1, score: this.score, lives: this.lives });
      });
    } else {
      this.add.text(width / 2, 320, 'CONGRATULATIONS!', {
        fontFamily: 'monospace', fontSize: '28px', color: '#ffffff',
      }).setOrigin(0.5);
      this.add.text(width / 2, 360, 'You cleared all levels!', {
        fontFamily: 'monospace', fontSize: '20px', color: '#f0c000',
      }).setOrigin(0.5);
      this.time.delayedCall(3000, () => this.scene.start('MenuScene'));
    }
  }
}
