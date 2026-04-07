// DI-009: Dialogue State — render dialogue tree nodes, handle responses
'use strict';

import DialogueEngine from '../../engine/DialogueEngine.js';

export class DialogueState {
  constructor(playing, npc) {
    this._playing = playing;
    this._npc = npc;
    this._panel = null;
  }

  enter() {
    this._panel = document.createElement('div');
    this._panel.id = 'dialogue-panel';
    Object.assign(this._panel.style, {
      position: 'absolute', bottom: '0', left: '0', width: '100%',
      background: 'rgba(10,8,5,0.95)', borderTop: '2px solid var(--border)',
      padding: '16px 24px', pointerEvents: 'auto', maxHeight: '40%',
    });
    document.getElementById('ui-layer').appendChild(this._panel);
    document.getElementById('ui-layer').classList.add('active');

    const node = DialogueEngine.startDialogue(
      this._npc.dialogueNodeId,
      this._playing.worldFlags
    );
    this._renderNode(node);
  }

  exit() {
    this._panel?.remove(); this._panel = null;
    document.getElementById('ui-layer').classList.remove('active');
  }

  update(_dt) {}
  render(_ctx) {}

  _renderNode(node) {
    const p = this._panel;
    p.innerHTML = '';
    if (!node) { this._close(); return; }

    // Portrait + name row
    const topRow = document.createElement('div');
    topRow.style.display = 'flex'; topRow.style.alignItems = 'center'; topRow.style.gap = '12px';
    topRow.style.marginBottom = '12px';

    if (this._npc.portrait !== undefined) {
      const img = document.createElement('img');
      img.src = `assets/portraits/portrait_${this._npc.portrait + 1}.png`;
      img.width = 64; img.height = 80;
      img.style.border = '2px solid var(--border)';
      img.onerror = () => { img.style.display = 'none'; };
      topRow.appendChild(img);
    }

    const nameDiv = document.createElement('div');
    nameDiv.textContent = this._npc.name || 'Unknown';
    Object.assign(nameDiv.style, { color: 'var(--accent)', fontWeight: 'bold', fontSize: '18px' });
    topRow.appendChild(nameDiv);
    p.appendChild(topRow);

    // NPC text
    const textDiv = document.createElement('div');
    textDiv.className = 'scroll-box';
    textDiv.textContent = node.text || '';
    Object.assign(textDiv.style, {
      color: 'var(--text-primary)', fontSize: '15px',
      lineHeight: '1.5', marginBottom: '12px', maxHeight: '100px',
    });
    p.appendChild(textDiv);

    // Response buttons
    const responses = (node.responses || []).filter(r =>
      !r.condition || DialogueEngine.evaluateCondition(r.condition)
    );

    responses.forEach((resp, i) => {
      const btn = document.createElement('button');
      btn.className = 'btn';
      btn.style.display = 'block'; btn.style.marginBottom = '6px'; btn.style.textAlign = 'left';
      btn.style.width = '100%';
      const num = document.createTextNode(`${i + 1}. `);
      btn.appendChild(num);
      btn.appendChild(document.createTextNode(resp.text || '...'));

      btn.addEventListener('click', () => {
        const result = DialogueEngine.selectResponse(i);
        if (result && result.type === 'COMBAT') {
          this._close();
          import('./CombatState.js').then(m => {
            const enemies = (window.GameData?.encounters || [])
              .find(enc => enc.id === result.groupId)?.enemies || [];
            this._playing.setSubState(new m.CombatState(this._playing, enemies));
          });
        } else {
          this._renderNode(result);
        }
      });
      p.appendChild(btn);
    });

    if (responses.length === 0) {
      const bye = document.createElement('button');
      bye.className = 'btn'; bye.textContent = '[End conversation]';
      bye.style.display = 'block'; bye.style.marginTop = '8px';
      bye.addEventListener('click', () => this._close());
      p.appendChild(bye);
    }
  }

  _close() {
    this.exit();
    import('./ExplorationState.js').then(m => {
      this._playing.setSubState(new m.ExplorationState(this._playing));
    });
  }
}
