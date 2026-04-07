// LoadScreenState — list save slots; click to load
'use strict';

import { StateManager } from '../StateManager.js';
import SaveManager      from '../engine/SaveManager.js';

export class LoadScreenState {
  constructor() { this._panel = null; }

  enter() {
    this._panel = document.createElement('div');
    this._panel.id = 'load-screen';
    Object.assign(this._panel.style, {
      position: 'absolute', top: '50%', left: '50%',
      transform: 'translate(-50%,-50%)',
      width: '500px', background: 'var(--bg-panel)',
      border: '2px solid var(--border)', borderRadius: '6px',
      padding: '24px', pointerEvents: 'auto',
    });
    document.getElementById('ui-layer').appendChild(this._panel);
    document.getElementById('ui-layer').classList.add('active');
    this._render();
  }

  exit() {
    this._panel?.remove(); this._panel = null;
    document.getElementById('ui-layer').classList.remove('active');
  }

  update(_dt) {}
  render(ctx) {
    ctx.fillStyle = '#050310'; ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  }

  async _render() {
    const p = this._panel;
    p.innerHTML = '';

    const hdr = document.createElement('h2');
    hdr.textContent = 'Load Game';
    Object.assign(hdr.style, { margin: '0 0 20px', color: 'var(--accent)' });
    p.appendChild(hdr);

    let slots = [];
    try { slots = await SaveManager.listSlots(); } catch (e) { console.error(e); }

    if (slots.length === 0) {
      const msg = document.createElement('p');
      msg.textContent = 'No saved games found.';
      msg.style.color = 'var(--text-dim)';
      p.appendChild(msg);
    } else {
      slots.forEach(slot => {
        const row = document.createElement('div');
        row.className = 'item-row';
        row.style.cursor = 'pointer';

        const name = document.createElement('span');
        name.textContent = slot.slot || slot.name;
        name.style.flex = '1'; name.style.fontWeight = 'bold';

        const ts = document.createElement('span');
        ts.textContent = slot.timestamp ? new Date(slot.timestamp).toLocaleString() : '';
        ts.style.color = 'var(--text-dim)'; ts.style.fontSize = '12px';

        row.appendChild(name); row.appendChild(ts);
        row.addEventListener('click', () => this._load(slot.slot || slot.name));
        p.appendChild(row);
      });
    }

    const backBtn = document.createElement('button');
    backBtn.className = 'btn'; backBtn.textContent = '← Back';
    backBtn.style.marginTop = '20px';
    backBtn.addEventListener('click', () => {
      import('./MainMenuState.js').then(m => StateManager.setState(new m.MainMenuState()));
    });
    p.appendChild(backBtn);
  }

  async _load(slotName) {
    try {
      const gameState = await SaveManager.load(slotName);
      if (!gameState) throw new Error('Empty save data');
      import('./PlayingState.js').then(m => {
        const ps = new m.PlayingState(gameState.areaId);
        ps.restoreFromSave(gameState);
        StateManager.setState(ps);
      });
    } catch (err) {
      alert('Failed to load: ' + err.message);
    }
  }
}
