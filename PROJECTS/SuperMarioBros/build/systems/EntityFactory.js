import GoombaEntity from '../entities/GoombaEntity.js';
import KoopaEntity from '../entities/KoopaEntity.js';

export default class EntityFactory {
  static createEnemy(scene, obj) {
    const x = obj.x;
    const y = obj.y - (obj.height || 32) / 2;
    if (obj.type === 'goomba') return new GoombaEntity(scene, x, y);
    if (obj.type === 'koopa') return new KoopaEntity(scene, x, y);
    return null;
  }

  static createItem(scene, obj) {
    const x = obj.x;
    const y = obj.y - 16;
    const type = obj.type;

    if (type === 'coin') {
      const coin = scene.physics.add.sprite(x, y, 'items', 0);
      coin.setData('type', 'coin');
      coin.body.allowGravity = false;
      scene.coins.add(coin);
      return coin;
    }

    if (type === 'block-hidden' || type === 'block-question') {
      const frame = type === 'block-hidden' ? 5 : 3;
      const block = scene.physics.add.staticSprite(x, y, 'tiles-frames', frame);
      block.setData('type', type);
      const contents = (obj.properties || []).find(p => p.name === 'contents')?.value || 'coin';
      block.setData('contents', contents);
      if (type === 'block-hidden') block.setAlpha(0);
      scene.blocks.add(block);
      return block;
    }

    if (type === 'platform-moving' || type === 'platform-breakable' || type === 'platform-disappearing') {
      const platform = scene.physics.add.staticSprite(x, y, 'tiles-frames', 1);
      platform.setData('type', type);
      platform.setData('activeState', true);
      if (type === 'platform-moving') {
        platform.setData('startX', x);
        platform.setData('endX', x + 128);
        platform.setData('dir', 1);
        platform.setData('speed', 48);
      }
      if (type === 'platform-breakable') {
        platform.setData('hitsRemaining', 1);
      }
      if (type === 'platform-disappearing') {
        platform.setData('triggered', false);
      }
      scene.platforms.add(platform);
      return platform;
    }

    if (['mushroom', 'fire-flower', 'star', '1up'].includes(type)) {
      const frameMap = { mushroom: 1, 'fire-flower': 2, star: 3, '1up': 4 };
      const pu = scene.physics.add.sprite(x, y, 'items', frameMap[type]);
      pu.setData('type', type);
      pu.body.allowGravity = false;
      pu.setVisible(false);
      pu.body.enable = false;
      scene.powerUps.add(pu);
      return pu;
    }

    return null;
  }
}
