// DI-010 — HUD overlay scene
export default class HUDScene extends Phaser.Scene {
  constructor() {
    super('HUDScene');
  }

  create() {
    this.cameras.main.setScroll(0, 0);
    this.add.rectangle(400, 16, 800, 32, 0x000000, 0.35).setOrigin(0.5);

    this.scoreText = this.add.text(16, 8, 'SCORE: 0', { fontFamily: 'monospace', fontSize: '16px', color: '#fff' });
    this.livesText = this.add.text(200, 8, 'LIVES: 3', { fontFamily: 'monospace', fontSize: '16px', color: '#fff' });
    this.levelText = this.add.text(400, 8, 'LEVEL: 1', { fontFamily: 'monospace', fontSize: '16px', color: '#fff' });
    this.timerText = this.add.text(640, 8, 'TIME: 300', { fontFamily: 'monospace', fontSize: '16px', color: '#fff' });

    this._onScore = (v) => this.scoreText.setText(`SCORE: ${v}`);
    this._onLives = (v) => this.livesText.setText(`LIVES: ${v}`);
    this._onLevel = (v) => this.levelText.setText(`LEVEL: ${v}`);
    this._onTimer = (v) => this.timerText.setText(`TIME: ${v}`);

    this.game.events.on('score-update', this._onScore);
    this.game.events.on('lives-update', this._onLives);
    this.game.events.on('level-update', this._onLevel);
    this.game.events.on('timer-update', this._onTimer);

    this.events.once('shutdown', () => {
      this.game.events.off('score-update', this._onScore);
      this.game.events.off('lives-update', this._onLives);
      this.game.events.off('level-update', this._onLevel);
      this.game.events.off('timer-update', this._onTimer);
    });
  }
}
