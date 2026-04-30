import { PHYSICS } from '../config.js';
import KoopaShell from './KoopaShell.js';

export default class KoopaEntity extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'koopa', 0);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setVelocityX(-PHYSICS.ENEMY_SPEED);
    this.setCollideWorldBounds(true);
    this.state = 'walk';
    this.play('koopa-walk');
  }

  update() {
    if (!this.active) return;
    if (this.state === 'walk' && (this.body.blocked.left || this.body.blocked.right)) {
      this.setVelocityX(-this.body.velocity.x || PHYSICS.ENEMY_SPEED);
      this.flipX = this.body.velocity.x > 0;
    }
  }

  onStomp() {
    if (!this.active) return;
    if (this.state === 'walk') {
      this.state = 'shell-idle';
      this.setVelocityX(0);
      this.play('koopa-shell');
      return;
    }
    const dir = this.scene.player.x < this.x ? 1 : -1;
    this.onKick(dir);
  }

  onKick(direction) {
    const shell = new KoopaShell(this.scene, this.x, this.y, direction);
    this.scene.shells.add(shell);
    this.destroy();
  }
}
