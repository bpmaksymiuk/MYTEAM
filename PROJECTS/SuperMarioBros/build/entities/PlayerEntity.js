// DI-006, DI-007 — Player FSM and variable jump
import { PHYSICS } from '../config.js';

export default class PlayerEntity extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'player', 0);
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.state = 'idle';
    this.powerTier = 'base';
    this.invincible = false;
    this.jumpKeyHeld = false;

    this.cursors = scene.input.keyboard.createCursorKeys();
    this.wasd = scene.input.keyboard.addKeys('W,A,S,D');

    this.setCollideWorldBounds(true);
    this.setDragX(PHYSICS.WALK_DRAG);
    this.setMaxVelocity(PHYSICS.MAX_SPEED_X, 1000);
    this.body.setSize(28, 32).setOffset(2, 0);
  }

  _isJumpPressed() {
    return this.cursors.up.isDown || this.cursors.space.isDown || this.wasd.W.isDown;
  }

  update() {
    if (!this.body || !this.active) return;

    const left = this.cursors.left.isDown || this.wasd.A.isDown;
    const right = this.cursors.right.isDown || this.wasd.D.isDown;

    if (left && !right) {
      this.setAccelerationX(-PHYSICS.WALK_ACCEL);
      this.setFlipX(true);
    } else if (right && !left) {
      this.setAccelerationX(PHYSICS.WALK_ACCEL);
      this.setFlipX(false);
    } else {
      this.setAccelerationX(0);
      this.setVelocityX(Phaser.Math.Linear(this.body.velocity.x, 0, 0.2));
    }

    const jumpPressed = this._isJumpPressed();
    const jumpJustDown = Phaser.Input.Keyboard.JustDown(this.cursors.up) ||
      Phaser.Input.Keyboard.JustDown(this.cursors.space) ||
      Phaser.Input.Keyboard.JustDown(this.wasd.W);

    if (jumpJustDown && this.body.blocked.down) {
      this.setVelocityY(PHYSICS.JUMP_VY);
      this.jumpKeyHeld = true;
      this.scene.onPlayerJump();
    }

    if (this.jumpKeyHeld && !jumpPressed && this.body.velocity.y < 0) {
      this.body.setGravityY(PHYSICS.GRAVITY * PHYSICS.CUT_GRAVITY);
      this.jumpKeyHeld = false;
    }
    if (this.body.blocked.down) {
      this.body.setGravityY(0);
      this.jumpKeyHeld = false;
    }

    if (!this.active) {
      this.state = 'dead';
    } else if (!this.body.blocked.down) {
      this.state = this.body.velocity.y < 0 ? 'jump' : 'jump';
    } else if (Math.abs(this.body.velocity.x) > 5) {
      this.state = 'run';
    } else {
      this.state = 'idle';
    }

    this.play(`player-${this.state}`, true);
  }

  applyPowerUp(type) {
    if (type === 'star') {
      this.invincible = true;
      this.scene.time.delayedCall(8000, () => { this.invincible = false; });
      return;
    }
    if (type === 'mushroom' && this.powerTier === 'base') {
      this.powerTier = 'enlarged';
      this.setScale(1, 1.5);
      this.body.setSize(28, 48).setOffset(2, 0);
      return;
    }
    if (type === 'fire-flower') {
      if (this.powerTier === 'base') {
        this.setScale(1, 1.5);
        this.body.setSize(28, 48).setOffset(2, 0);
      }
      this.powerTier = 'fire';
    }
  }

  onHit() {
    if (this.invincible) return;
    if (this.powerTier === 'fire') {
      this.powerTier = 'enlarged';
      return;
    }
    if (this.powerTier === 'enlarged') {
      this.powerTier = 'base';
      this.setScale(1, 1);
      this.body.setSize(28, 32).setOffset(2, 0);
      return;
    }
    this.triggerDeath();
  }

  triggerDeath() {
    if (!this.active) return;
    this.disableBody(false, false);
    this.play('player-dead');
    this.scene.events.emit('player-death');
  }
}
