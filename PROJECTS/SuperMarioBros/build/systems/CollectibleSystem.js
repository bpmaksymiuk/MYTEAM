// DI-009 — Collectible and block activation logic
import { POINTS } from '../config.js';
import AudioManager from './AudioManager.js';

export default class CollectibleSystem {
  constructor(scene) {
    this.scene = scene;
  }

  wire() {
    const s = this.scene;

    s.physics.add.overlap(s.player, s.coins, (_p, coin) => {
      coin.destroy();
      s.addScore(POINTS.COIN);
      AudioManager.playSfx(s, 'sfx-coin');
    });

    s.physics.add.overlap(s.player, s.powerUps, (player, pu) => {
      if (!pu.body.enable) return;
      const type = pu.getData('type');
      if (type === '1up') {
        s.lives += 1;
        s.game.events.emit('lives-update', s.lives);
      } else {
        player.applyPowerUp(type);
        s.addScore(POINTS.POWER_UP || 50);
      }
      AudioManager.playSfx(s, 'sfx-powerup');
      pu.destroy();
    });

    s.physics.add.collider(s.player, s.blocks, (player, block) => {
      if (!player.body.blocked.up) return;
      this.activateBlock(block);
    });
  }

  activateBlock(block) {
    if (!block.active || block.getData('used')) return;
    block.setData('used', true);
    block.setFrame(4); // used block tile
    block.setAlpha(1);

    const content = block.getData('contents') || 'coin';
    if (content === 'coin') {
      this.scene.addScore(POINTS.COIN);
      AudioManager.playSfx(this.scene, 'sfx-coin');
      return;
    }

    const frameMap = { mushroom: 1, 'fire-flower': 2, star: 3, '1up': 4 };
    const pu = this.scene.physics.add.sprite(block.x, block.y - 32, 'items', frameMap[content] ?? 1);
    pu.setData('type', content);
    pu.body.allowGravity = false;
    this.scene.powerUps.add(pu);
  }
}
