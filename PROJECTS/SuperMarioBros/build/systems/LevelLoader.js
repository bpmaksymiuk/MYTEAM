// DI-014 — Level loading from Tiled JSON
import EntityFactory from './EntityFactory.js';

export default class LevelLoader {
  static load(scene, levelNumber) {
    const levelKey = `level-${String(levelNumber).padStart(2, '0')}`;
    const map = scene.make.tilemap({ key: levelKey });
    const tileset = map.addTilesetImage('tiles', 'tiles');

    const backgroundLayer = map.createLayer('Background', tileset, 0, 0);
    const groundLayer = map.createLayer('Ground', tileset, 0, 0);
    groundLayer.setCollisionByExclusion([-1]);

    const enemies = map.getObjectLayer('enemies')?.objects ?? [];
    const items = map.getObjectLayer('items')?.objects ?? [];
    const triggers = map.getObjectLayer('triggers')?.objects ?? [];

    enemies.forEach(obj => {
      const enemy = EntityFactory.createEnemy(scene, obj);
      if (enemy) scene.enemies.add(enemy);
    });

    items.forEach(obj => {
      EntityFactory.createItem(scene, obj);
    });

    const hiddenCount = items.filter(o => o.type === 'block-hidden').length;
    console.assert(hiddenCount >= 1, 'Level must contain at least one hidden block (BR-028)');

    const playerStartObj = triggers.find(o => o.name === 'player-start');
    const goalObj = triggers.find(o => o.name === 'goal');
    const pipes = triggers.filter(o => o.type === 'pipe-enter');

    const playerStart = {
      x: playerStartObj?.x ?? 64,
      y: (playerStartObj?.y ?? 320) - 32,
    };

    const goalZone = scene.add.zone(
      goalObj?.x ?? 1500,
      goalObj?.y ?? 320,
      goalObj?.width ?? 32,
      goalObj?.height ?? 96,
    );
    scene.physics.add.existing(goalZone, true);

    return {
      map,
      backgroundLayer,
      groundLayer,
      playerStart,
      goalZone,
      pipes,
    };
  }
}
