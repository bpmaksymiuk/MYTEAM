// DI-011 — Pause overlay scene
export default class PauseScene extends Phaser.Scene {
  constructor() {
    super('PauseScene');
  }

  create() {
    const { width, height } = this.scale;
    this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.6);
    this.add.text(width / 2, 170, 'PAUSED', {
      fontFamily: 'monospace', fontSize: '42px', color: '#ffffff',
    }).setOrigin(0.5);

    const resume = this.add.text(width / 2, 250, 'RESUME', {
      fontFamily: 'monospace', fontSize: '28px', color: '#f0c000',
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    const menu = this.add.text(width / 2, 300, 'MAIN MENU', {
      fontFamily: 'monospace', fontSize: '24px', color: '#ffffff',
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    resume.on('pointerdown', () => {
      this.scene.resume('GameScene');
      this.scene.stop();
    });

    menu.on('pointerdown', () => {
      this.scene.stop('GameScene');
      this.scene.stop('HUDScene');
      this.scene.start('MenuScene');
    });

    this.input.keyboard.once('keydown-ESC', () => {
      this.scene.resume('GameScene');
      this.scene.stop();
    });
  }
}
