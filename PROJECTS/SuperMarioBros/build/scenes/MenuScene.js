// DI-004 — MenuScene: title screen with menu options
import StorageManager from '../systems/StorageManager.js';
import AudioManager from '../systems/AudioManager.js';

export default class MenuScene extends Phaser.Scene {
  constructor() { super('MenuScene'); }

  create() {
    const { width, height } = this.scale;
    const save = StorageManager.load();

    this.add.image(width / 2, height / 2, 'menu-bg').setDisplaySize(width, height);

    // High score display (TC-002 label pattern)
    if (save.highScore > 0) {
      this.add.text(width / 2, 80, `HIGH SCORE: ${save.highScore}`, {
        fontFamily: 'monospace', fontSize: '18px', color: '#f0c000',
      }).setOrigin(0.5);
    }

    // Menu items (TC-001)
    const menuItems = [
      { label: 'NEW GAME', callback: () => this._startGame(1) },
      { label: 'LEVEL SELECT', callback: () => this._openLevelSelect() },
      { label: save.audioMuted ? 'UNMUTE' : 'MUTE', key: 'muteLabel', callback: () => this._toggleMute() },
    ];

    this._menuIndex = 0;
    this._menuLabels = [];

    menuItems.forEach((item, i) => {
      const txt = this.add.text(width / 2, 280 + i * 48, item.label, {
        fontFamily: 'monospace', fontSize: '24px', color: '#ffffff',
      }).setOrigin(0.5).setInteractive({ useHandCursor: true });

      if (item.key) this[item.key] = txt;

      txt.on('pointerover', () => {
        this._menuIndex = i;
        this._updateSelector();
      });
      txt.on('pointerdown', () => item.callback());
      this._menuLabels.push({ txt, callback: item.callback });
    });

    this._selector = this.add.text(width / 2 - 120, 280, '>', {
      fontFamily: 'monospace', fontSize: '24px', color: '#f0c000',
    });

    this._updateSelector();

    // Keyboard navigation
    const cursors = this.input.keyboard.createCursorKeys();
    const enter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

    this.input.keyboard.on('keydown-UP', () => {
      this._menuIndex = (this._menuIndex - 1 + this._menuLabels.length) % this._menuLabels.length;
      this._updateSelector();
    });
    this.input.keyboard.on('keydown-DOWN', () => {
      this._menuIndex = (this._menuIndex + 1) % this._menuLabels.length;
      this._updateSelector();
    });
    this.input.keyboard.on('keydown-ENTER', () => {
      this._menuLabels[this._menuIndex].callback();
    });
    this.input.keyboard.on('keydown-SPACE', () => {
      this._menuLabels[this._menuIndex].callback();
    });

    // Play menu BGM
    AudioManager.init(this);
    if (!save.audioMuted) AudioManager.playBgm(this, 'bgm-level');
  }

  _updateSelector() {
    if (!this._selector) return;
    const { width } = this.scale;
    const y = 280 + this._menuIndex * 48;
    this._selector.setPosition(width / 2 - 120, y);
  }

  _startGame(level) {
    const save = StorageManager.load();
    this.scene.start('GameScene', { level: level || 1, lives: 3, score: 0, audioMuted: save.audioMuted });
    this.scene.start('HUDScene', { level: level || 1, lives: 3, score: 0, time: 300 });
  }

  _openLevelSelect() {
    const save = StorageManager.load();
    const max = save.unlockedLevel || 1;
    // Simple: cycle to unlocked level selection via number keys
    // Full implementation shows level numbers as clickable items
    const { width, height } = this.scale;
    // Remove existing overlay if any
    if (this._levelSelectGroup) {
      this._levelSelectGroup.destroy(true);
    }
    this._levelSelectGroup = this.add.group();

    const bg = this.add.rectangle(width / 2, height / 2, 400, 300, 0x000000, 0.8);
    this._levelSelectGroup.add(bg);

    const title = this.add.text(width / 2, height / 2 - 120, 'SELECT LEVEL', {
      fontFamily: 'monospace', fontSize: '22px', color: '#f0c000',
    }).setOrigin(0.5);
    this._levelSelectGroup.add(title);

    for (let i = 1; i <= 8; i++) {
      const unlocked = i <= max;
      const btn = this.add.text(width / 2 - 140 + ((i - 1) % 4) * 80, height / 2 - 60 + Math.floor((i - 1) / 4) * 60, `${i}`, {
        fontFamily: 'monospace', fontSize: '28px', color: unlocked ? '#ffffff' : '#666666',
      }).setOrigin(0.5);
      this._levelSelectGroup.add(btn);
      if (unlocked) {
        btn.setInteractive({ useHandCursor: true });
        btn.on('pointerdown', () => this._startGame(i));
      }
    }

    const close = this.add.text(width / 2, height / 2 + 110, '[ESC] CLOSE', {
      fontFamily: 'monospace', fontSize: '16px', color: '#aaaaaa',
    }).setOrigin(0.5);
    this._levelSelectGroup.add(close);

    this.input.keyboard.once('keydown-ESC', () => {
      if (this._levelSelectGroup) {
        this._levelSelectGroup.destroy(true);
        this._levelSelectGroup = null;
      }
    });
  }

  _toggleMute() {
    const save = StorageManager.load();
    save.audioMuted = !save.audioMuted;
    StorageManager.save(save);
    if (this.muteLabel) {
      this.muteLabel.setText(save.audioMuted ? 'UNMUTE' : 'MUTE');
    }
    if (save.audioMuted) {
      AudioManager.stopBgm(this);
    } else {
      AudioManager.playBgm(this, 'bgm-level');
    }
  }
}
