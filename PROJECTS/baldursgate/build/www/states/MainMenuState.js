// DI-004: Main Menu State
'use strict';

import { StateManager }          from '../StateManager.js';
import { AudioManager }          from '../engine/AudioManager.js';
import { AssetLoader }           from '../engine/AssetLoader.js';

export class MainMenuState {
  constructor() {
    this._div = null;
    this._optionsPanel = null;
  }

  enter() {
    AudioManager.playMusic('music_menu');

    this._div = document.createElement('div');
    this._div.id = 'main-menu';
    Object.assign(this._div.style, {
      position: 'absolute',
      top: '0', left: '0', width: '100%', height: '100%',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      gap: '16px',
      pointerEvents: 'auto',
    });

    const title = document.createElement('div');
    title.textContent = "BALDUR'S GATE";
    Object.assign(title.style, {
      fontSize: '64px', fontFamily: 'Georgia, serif',
      color: '#c8960c', textShadow: '0 0 30px rgba(200,150,12,0.6)',
      letterSpacing: '8px', marginBottom: '48px',
    });
    this._div.appendChild(title);

    const buttons = [
      { label: 'New Game',   action: () => this._newGame()  },
      { label: 'Load Game',  action: () => this._loadGame() },
      { label: 'Options',    action: () => this._openOptions() },
      { label: 'Quit',       action: () => this._quit()     },
    ];

    for (const { label, action } of buttons) {
      const btn = document.createElement('button');
      btn.textContent = label;
      btn.className = 'btn btn-primary';
      Object.assign(btn.style, { width: '220px', fontSize: '18px', padding: '12px 0' });
      btn.addEventListener('click', action);
      this._div.appendChild(btn);
    }

    document.getElementById('ui-layer').appendChild(this._div);
    document.getElementById('ui-layer').classList.add('active');
  }

  exit() {
    this._div?.remove();
    this._div = null;
    this._optionsPanel?.remove();
    this._optionsPanel = null;
    const layer = document.getElementById('ui-layer');
    layer.classList.remove('active');
  }

  update(_dt) {}

  render(ctx) {
    // Draw dark gradient title screen background
    const { width, height } = ctx.canvas;
    let bg;
    try { bg = AssetLoader.get('bg_mainmenu'); } catch (_) { bg = null; }

    if (bg) {
      ctx.drawImage(bg, 0, 0, width, height);
    } else {
      const grad = ctx.createLinearGradient(0, 0, 0, height);
      grad.addColorStop(0, '#050310');
      grad.addColorStop(1, '#120a02');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);
      // Decorative stars
      ctx.fillStyle = 'rgba(200,180,120,0.3)';
      for (let i = 0; i < 80; i++) {
        const x = (Math.sin(i * 127.3) * 0.5 + 0.5) * width;
        const y = (Math.sin(i * 53.7)  * 0.5 + 0.5) * height * 0.6;
        ctx.fillRect(x, y, 1, 1);
      }
    }
  }

  _newGame() {
    const { CharacterCreationState } = /** @type {any} */ (window._states || {});
    import('../states/CharacterCreationState.js').then(m => {
      StateManager.setState(new m.CharacterCreationState());
    });
  }

  _loadGame() {
    import('../states/LoadScreenState.js').then(m => {
      StateManager.setState(new m.LoadScreenState());
    });
  }

  _openOptions() {
    import('../states/substate/OptionsState.js').then(m => {
      if (!this._optionsPanel) {
        this._optionsPanel = new m.OptionsState(null, () => {
          this._optionsPanel?.panel?.remove();
          this._optionsPanel = null;
        });
        this._optionsPanel.enter();
      }
    });
  }

  _quit() {
    window.close();
    // browser blocks window.close() on non-script-opened windows
    alert('Close this tab to quit.');
  }
}
