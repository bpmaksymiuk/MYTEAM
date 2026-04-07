// DI-029: Spellbook Panel — view and memorise spells
'use strict';

const MAX_SPELL_LEVEL = 9;

export class SpellbookPanel {
  constructor(entity, inCombat) {
    this._entity   = entity;
    this._inCombat = inCombat || false;
    this._panel    = null;
    this._draggingSpell = null;
  }

  show() {
    if (this._panel) return;
    this._panel = document.createElement('div');
    this._panel.id = 'spellbook-panel';
    Object.assign(this._panel.style, {
      position: 'absolute', top: '50%', left: '50%',
      transform: 'translate(-50%,-50%)',
      width: '680px', height: '520px',
      background: 'var(--bg-panel)', border: '2px solid var(--border)',
      borderRadius: '6px', display: 'flex', flexDirection: 'column',
      pointerEvents: 'auto', overflow: 'hidden', zIndex: '50',
    });
    document.getElementById('ui-layer').appendChild(this._panel);
    document.getElementById('ui-layer').classList.add('active');
    this._render();
  }

  hide() {
    this._panel?.remove(); this._panel = null;
  }

  _render() {
    const p = this._panel; p.innerHTML = '';
    const e = this._entity;

    const hdr = document.createElement('div');
    hdr.style.display = 'flex'; hdr.style.justifyContent = 'space-between';
    hdr.style.padding = '10px 16px'; hdr.style.borderBottom = '1px solid var(--border)';
    hdr.style.flexShrink = '0';

    const title = document.createElement('h2'); title.textContent = `Spellbook — ${e.name}`;
    Object.assign(title.style, { margin: '0', color: 'var(--accent)' });
    const closeBtn = document.createElement('button');
    closeBtn.className = 'btn'; closeBtn.textContent = 'Close';
    closeBtn.addEventListener('click', () => this.hide());
    hdr.appendChild(title); hdr.appendChild(closeBtn); p.appendChild(hdr);

    if (this._inCombat) {
      const warn = document.createElement('div');
      warn.textContent = 'Cannot rememorize spells during combat.';
      warn.style.color = 'var(--danger)'; warn.style.padding = '8px 16px';
      warn.style.fontSize = '13px'; p.appendChild(warn);
    }

    const body = document.createElement('div');
    body.style.flex = '1'; body.style.display = 'flex'; body.style.overflow = 'hidden';
    p.appendChild(body);

    // Left: known spells by level accordion
    const left = document.createElement('div');
    left.style.width = '300px'; left.style.borderRight = '1px solid var(--border)';
    left.style.overflowY = 'auto'; left.style.padding = '8px';
    body.appendChild(left);

    const knownSpells = e.knownSpells || [];
    const spellData   = window.GameData?.spells || [];

    for (let lvl = 1; lvl <= MAX_SPELL_LEVEL; lvl++) {
      const levelSpells = knownSpells
        .map(id => spellData.find(s => s.id === id || s.name === id))
        .filter(s => s && s.level === lvl);
      if (levelSpells.length === 0) continue;

      const lvlHdr = document.createElement('div');
      lvlHdr.style.color = 'var(--accent)'; lvlHdr.style.fontWeight = 'bold';
      lvlHdr.style.marginTop = '8px'; lvlHdr.style.cursor = 'pointer';
      lvlHdr.textContent = `Level ${lvl} Spells`;
      left.appendChild(lvlHdr);

      levelSpells.forEach(spell => {
        const row = document.createElement('div');
        row.className = 'item-row';
        row.draggable = !this._inCombat;
        row.textContent = spell.name;
        row.title = spell.description || '';
        row.style.fontSize = '13px'; row.style.cursor = this._inCombat ? 'default' : 'grab';

        row.addEventListener('dragstart', e => {
          this._draggingSpell = spell;
          e.dataTransfer.setData('text/plain', spell.id || spell.name);
        });
        left.appendChild(row);
      });
    }

    // Right: memorisation slots
    const right = document.createElement('div');
    right.style.flex = '1'; right.style.overflowY = 'auto'; right.style.padding = '8px';
    body.appendChild(right);

    const cls = window.GameData?.classes?.find?.(c => c.id === e.class || c.name === e.class);
    const slotsByLevel = cls?.spellSlots?.[e.level || 1] || {};
    const memorised = e.memorisedSpells || {};

    for (let lvl = 1; lvl <= MAX_SPELL_LEVEL; lvl++) {
      const slotCount = slotsByLevel[lvl] || 0;
      if (slotCount === 0) continue;

      const lvlHdr = document.createElement('div');
      lvlHdr.style.color = 'var(--accent)'; lvlHdr.style.fontWeight = 'bold';
      lvlHdr.style.marginTop = '8px';
      lvlHdr.textContent = `Level ${lvl} (${slotCount} slots)`;
      right.appendChild(lvlHdr);

      const slotRow = document.createElement('div');
      slotRow.style.display = 'flex'; slotRow.style.flexWrap = 'wrap'; slotRow.style.gap = '4px';
      right.appendChild(slotRow);

      const filled = memorised[lvl] || [];
      for (let s = 0; s < slotCount; s++) {
        const slot = document.createElement('div');
        Object.assign(slot.style, {
          width: '80px', height: '40px', border: '1px dashed var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '10px', textAlign: 'center', padding: '2px',
          color: filled[s] ? 'var(--text-primary)' : 'var(--text-dim)',
          background: filled[s] ? '#1a1408' : '#0a0805',
          cursor: this._inCombat ? 'default' : 'pointer',
        });
        slot.textContent = filled[s] || '(empty)';

        if (!this._inCombat) {
          slot.addEventListener('click', () => {
            // Clear on click
            if (filled[s]) { filled[s] = null; this._render(); }
          });
          slot.addEventListener('dragover', ev2 => ev2.preventDefault());
          slot.addEventListener('drop', () => {
            if (this._draggingSpell) {
              if (!memorised[lvl]) memorised[lvl] = [];
              memorised[lvl][s] = this._draggingSpell.name || this._draggingSpell.id;
              this._draggingSpell = null;
              this._render();
            }
          });
        }
        slotRow.appendChild(slot);
      }
    }

    // Memorise button
    if (!this._inCombat) {
      const memBtn = document.createElement('button');
      memBtn.className = 'btn btn-primary'; memBtn.textContent = 'Memorise All';
      memBtn.style.margin = '12px 0 0 8px';
      memBtn.addEventListener('click', () => {
        e.memorisedSpells = memorised;
        this.hide();
      });
      p.appendChild(memBtn);
    }
  }
}
