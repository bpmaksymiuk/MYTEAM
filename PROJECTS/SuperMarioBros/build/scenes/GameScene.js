// DI-005 — Main gameplay scene
import { GAME, LEVELS, POINTS } from '../config.js';
import StorageManager from '../systems/StorageManager.js';
import AudioManager from '../systems/AudioManager.js';
import LevelLoader from '../systems/LevelLoader.js';
import CollectibleSystem from '../systems/CollectibleSystem.js';
import PlayerEntity from '../entities/PlayerEntity.js';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
  }

  init(data = {}) {
    this.levelNumber = data.level || 1;
    this.score = data.score || 0;
    this.lives = data.lives || GAME.LIVES_START;
  }

  create() {
    this.enemies = this.physics.add.group();
    this.shells = this.physics.add.group();
    this.coins = this.physics.add.group();
    this.powerUps = this.physics.add.group();
    this.blocks = this.physics.add.staticGroup();
    this.platforms = this.physics.add.staticGroup();

    this.levelContext = LevelLoader.load(this, this.levelNumber);

    this.player = new PlayerEntity(this, this.levelContext.playerStart.x, this.levelContext.playerStart.y);
    this.physics.add.collider(this.player, this.levelContext.groundLayer);
    this.physics.add.collider(this.enemies, this.levelContext.groundLayer);
    this.physics.add.collider(this.shells, this.levelContext.groundLayer);
    this.physics.add.collider(this.player, this.platforms, (player, platform) => {
      const type = platform.getData('type');
      if (type === 'platform-breakable' && player.body.touching.down) {
        const hits = (platform.getData('hitsRemaining') ?? 1) - 1;
        platform.setData('hitsRemaining', hits);
        if (hits <= 0) {
          platform.destroy();
        }
      }
      if (type === 'platform-disappearing' && !platform.getData('triggered')) {
        platform.setData('triggered', true);
        this.time.delayedCall(1200, () => {
          if (platform.active) platform.destroy();
        });
      }
    });

    // Enemy interactions
    this.physics.add.overlap(this.player, this.enemies, (player, enemy) => {
      const stomp = player.body.velocity.y > 0 && player.y < enemy.y;
      if (stomp) {
        player.setVelocityY(-180);
        enemy.onStomp();
        this.addScore(enemy.texture.key === 'koopa' ? POINTS.STOMP_KOOPA : POINTS.STOMP_GOOMBA);
        AudioManager.playSfx(this, 'sfx-stomp');
      } else {
        player.onHit();
      }
    });

    this.physics.add.overlap(this.shells, this.enemies, (shell, enemy) => {
      if (!shell.active || !enemy.active) return;
      enemy.onStomp();
      this.addScore(POINTS.SHELL_KILL);
    });

    this.physics.add.overlap(this.player, this.shells, (player, shell) => {
      if (this.time.now < shell.kickerImmuneUntil) return;
      player.onHit();
    });

    this.physics.add.overlap(this.player, this.levelContext.goalZone, () => {
      this.onGoalReached();
    });

    const collectibleSystem = new CollectibleSystem(this);
    collectibleSystem.wire();

    this.cameras.main.setBounds(0, 0, this.levelContext.map.widthInPixels, GAME.HEIGHT);
    this.physics.world.setBounds(0, 0, this.levelContext.map.widthInPixels, GAME.HEIGHT);
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);

    this.pauseKeyEsc = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
    this.pauseKeyP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);
    this.pauseEnabled = true;

    this.levelTimer = GAME.TIME_START;
    this.timerEvent = this.time.addEvent({
      delay: 1000,
      callback: this.tickTimer,
      callbackScope: this,
      loop: true,
    });

    AudioManager.bindScene(this);
    AudioManager.playBgm(this, 'bgm-level');

    this.events.on('player-death', () => this.onPlayerDeath());

    if (!this.scene.isActive('HUDScene')) {
      this.scene.launch('HUDScene');
    }
    this.game.events.emit('score-update', this.score);
    this.game.events.emit('lives-update', this.lives);
    this.game.events.emit('level-update', this.levelNumber);
    this.game.events.emit('timer-update', this.levelTimer);
  }

  update() {
    this.player.update();
    this.enemies.getChildren().forEach(enemy => enemy.update?.());
    this.shells.getChildren().forEach(shell => shell.update?.());
    this._updatePlatforms();

    if (this.pauseEnabled && (Phaser.Input.Keyboard.JustDown(this.pauseKeyEsc) || Phaser.Input.Keyboard.JustDown(this.pauseKeyP))) {
      this.scene.pause('GameScene');
      this.scene.launch('PauseScene');
    }

    if (this.player.y > GAME.HEIGHT + 120) {
      this.onPlayerDeath();
    }
  }

  _updatePlatforms() {
    const dt = this.game.loop.delta / 1000;
    this.platforms.getChildren().forEach((platform) => {
      if (!platform.active) return;
      if (platform.getData('type') !== 'platform-moving') return;

      const minX = platform.getData('startX');
      const maxX = platform.getData('endX');
      let dir = platform.getData('dir') ?? 1;
      const speed = platform.getData('speed') ?? 48;
      let nextX = platform.x + dir * speed * dt;

      if (nextX >= maxX) {
        nextX = maxX;
        dir = -1;
      } else if (nextX <= minX) {
        nextX = minX;
        dir = 1;
      }

      platform.setData('dir', dir);
      platform.x = nextX;
      platform.body.reset(platform.x, platform.y);
    });
  }

  onPlayerJump() {
    AudioManager.playSfx(this, 'sfx-jump');
  }

  addScore(delta) {
    this.score += delta;
    this.game.events.emit('score-update', this.score);
  }

  tickTimer() {
    this.levelTimer -= 1;
    this.game.events.emit('timer-update', this.levelTimer);
    if (this.levelTimer <= 0) {
      this.onPlayerDeath();
    }
  }

  onPlayerDeath() {
    if (this._dying) return;
    this._dying = true;
    this.pauseEnabled = false;
    this.timerEvent?.remove(false);
    AudioManager.playSfx(this, 'sfx-death');

    this.time.delayedCall(800, () => {
      this.lives -= 1;
      this.game.events.emit('lives-update', this.lives);
      if (this.lives > 0) {
        this.scene.restart({ level: this.levelNumber, score: this.score, lives: this.lives });
      } else {
        this.scene.stop('HUDScene');
        this.scene.start('GameOverScene', { score: this.score });
      }
    });
  }

  onGoalReached() {
    if (this._completed) return;
    this._completed = true;
    this.timerEvent?.remove(false);

    const save = StorageManager.load();
    StorageManager.save({
      ...save,
      highScore: Math.max(save.highScore, this.score),
      unlockedLevel: Math.max(save.unlockedLevel, Math.min(this.levelNumber + 1, LEVELS.COUNT)),
    });

    this.scene.stop('HUDScene');
    this.scene.start('LevelCompleteScene', {
      level: this.levelNumber,
      score: this.score + (this.levelTimer * GAME.TIME_BONUS_MULT),
      timeLeft: this.levelTimer,
      lives: this.lives,
    });
  }
}
