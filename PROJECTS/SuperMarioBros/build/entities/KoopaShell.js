import { PHYSICS } from '../config.js';

export default class KoopaShell extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, direction = 1) {
    super(scene, x, y, 'koopa', 3);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setCollideWorldBounds(true);
    this.setVelocityX(direction * PHYSICS.SHELL_SPEED);
    this.play('koopa-slide');
    this.kickerImmuneUntil = scene.time.now + 150;
  }

  update() {
    if (!this.active) return;
    if (this.body.blocked.left || this.body.blocked.right) {
      this.setVelocityX(-this.body.velocity.x);
      this.flipX = this.body.velocity.x > 0;
    }
  }
}
