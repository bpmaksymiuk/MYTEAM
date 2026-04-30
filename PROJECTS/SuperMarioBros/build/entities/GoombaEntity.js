import { PHYSICS } from '../config.js';

export default class GoombaEntity extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'goomba', 0);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setVelocityX(-PHYSICS.ENEMY_SPEED);
    this.setCollideWorldBounds(true);
    this.body.setSize(28, 24).setOffset(2, 8);
    this.play('goomba-walk');
  }

  update() {
    if (!this.active) return;
    if (this.body.blocked.left || this.body.blocked.right) {
      this.setVelocityX(-this.body.velocity.x || PHYSICS.ENEMY_SPEED);
      this.flipX = this.body.velocity.x > 0;
    }
  }

  onStomp() {
    if (!this.active) return;
    this.play('goomba-flat');
    this.setVelocity(0, 0);
    this.body.enable = false;
    this.scene.time.delayedCall(300, () => this.destroy());
  }
}
