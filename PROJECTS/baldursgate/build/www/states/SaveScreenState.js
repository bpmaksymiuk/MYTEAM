// SaveScreenState — list save slots + text input for new slot name
'use strict';

import { StateManager } from '../StateManager.js';
import SaveManager      from '../engine/SaveManager.js';

export class SaveScreenState {
  constructor(playingState) {
    this._playing = playingState;
    this._panel = null;
  }

  enter() {
    this._panel = document.createElement('div');
    this._panel.id = 'save-screen';
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
    hdr.textContent = 'Save Game';
    Object.assign(hdr.style, { margin: '0 0 16px', color: 'var(--accent)' });
    p.appendChild(hdr);

    // New slot row
    const newRow = document.createElement('div');
    newRow.style.display = 'flex'; newRow.style.gap = '10px'; newRow.style.marginBottom = '16px';

    const inp = document.createElement('input');
    inp.type = 'text'; inp.placeholder = 'New save name…'; inp.maxLength = 40;
    Object.assign(inp.style, {
      flex: '1', padding: '7px', background: '#0a0805',
      border: '1px solid var(--border)', color: 'var(--text-primary)',
      borderRadius: '3px', fontFamily: 'Georgia,serif',
    });

    const saveBtn = document.createElement('button');
    saveBtn.className = 'btn btn-primary'; saveBtn.textContent = 'Save';
    saveBtn.addEventListener('click', async () => {
      const name = inp.value.trim();
      if (!name) { alert('Enter a save name.'); return; }
      await this._save(name);
    });

    newRow.appendChild(inp); newRow.appendChild(saveBtn);
    p.appendChild(newRow);

    // Existing slots
    let slots = [];
    try { slots = await SaveManager.listSlots(); } catch (_) {}

    if (slots.length > 0) {
      const lbl = document.createElement('p');
      lbl.textContent = 'Overwrite existing save:';
      lbl.style.color = 'var(--text-dim)'; lbl.style.marginBottom = '8px';
      p.appendChild(lbl);

      slots.forEach(slot => {
        const row = document.createElement('div');
        row.className = 'item-row';

        const name = document.createElement('span');
        name.textContent = slot.slot || slot.name;
        name.style.flex = '1'; name.style.fontWeight = 'bold';

        const ts = document.createElement('span');
        ts.textContent = slot.timestamp ? new Date(slot.timestamp).toLocaleString() : '';
        ts.style.color = 'var(--text-dim)'; ts.style.fontSize = '12px';

        const overBtn = document.createElement('button');
        overBtn.className = 'btn'; overBtn.textContent = 'Overwrite';
        overBtn.style.padding = '4px 10px'; overBtn.style.fontSize = '12px';
        overBtn.addEventListener('click', () => this._save(slot.slot || slot.name));

        row.appendChild(name); row.appendChild(ts); row.appendChild(overBtn);
        p.appendChild(row);
      });
    }

    const backBtn = document.createElement('button');
    backBtn.className = 'btn'; backBtn.textContent = '← Back to Game';
    backBtn.style.marginTop = '20px';
    backBtn.addEventListener('click', () => {
      StateManager.setState(this._playing);
    });
    p.appendChild(backBtn);
  }

  async _save(name) {
    try {
      const gs = this._playing?.buildGameState?.() || {};
      await SaveManager.save(name, gs);
      alert(`Game saved to "${name}".`);
      this._render();
    } catch (err) {
      alert('Save failed: ' + err.message);
    }
  }
}
