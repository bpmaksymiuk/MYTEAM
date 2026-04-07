// DI-030: Level Up Panel — animated HP roll, new abilities display
'use strict';

import { rollD } from '../engine/CombatEngine.js';

function conModifier(con) {
  if (con <= 3)  return -2;
  if (con <= 6)  return -1;
  if (con <= 14) return 0;
  if (con <= 16) return 1;
  if (con === 17) return 2;
  if (con === 18) return 3;
  return 4;
}

export class LevelUpPanel {
  constructor(entity) {
    this._entity = entity;
    this._panel  = null;
    this._hpRoll = 0;
  }

  show() {
    const e = this._entity;
    const cls = window.GameData?.classes?.find?.(c => c.id === e.class || c.name === e.class);
    const hitDie = cls?.hitDie || 8;
    const conMod = conModifier(e.stats?.CON || 10);
    this._hpRoll = Math.max(1, rollD(1, hitDie) + conMod);

    this._panel = document.createElement('div');
    this._panel.id = 'levelup-panel';
    Object.assign(this._panel.style, {
      position: 'absolute', top: '50%', left: '50%',
      transform: 'translate(-50%,-50%)',
      width: '480px', background: 'var(--bg-panel)',
      border: '2px solid var(--accent)', borderRadius: '6px',
      padding: '28px', pointerEvents: 'auto', zIndex: '60',
      textAlign: 'center',
    });
    document.getElementById('ui-layer').appendChild(this._panel);
    document.getElementById('ui-layer').classList.add('active');
    this._render(hitDie, cls, conMod);
  }

  _render(hitDie, cls, conMod) {
    const p = this._panel; p.innerHTML = '';
    const e = this._entity;

    const hdr = document.createElement('h2');
    hdr.textContent = `${e.name} has reached Level ${e.level}!`;
    Object.assign(hdr.style, { margin: '0 0 20px', color: 'var(--accent)', fontSize: '22px' });
    p.appendChild(hdr);

    // HP roll animation
    const hpDiv = document.createElement('div');
    hpDiv.style.marginBottom = '20px';

    const hpLbl = document.createElement('div');
    hpLbl.textContent = `HP Roll (d${hitDie} + CON mod ${conMod >= 0 ? '+' : ''}${conMod}):`;
    hpLbl.style.color = 'var(--text-dim)'; hpLbl.style.marginBottom = '8px';
    hpDiv.appendChild(hpLbl);

    const hpVal = document.createElement('div');
    hpVal.style.fontSize = '48px'; hpVal.style.fontWeight = 'bold'; hpVal.style.color = 'var(--accent)';
    hpVal.textContent = '?';
    hpDiv.appendChild(hpVal);
    p.appendChild(hpDiv);

    // Animate number cycling
    let count = 0;
    const interval = setInterval(() => {
      hpVal.textContent = String(Math.floor(Math.random() * hitDie) + 1);
      count++;
      if (count > 15) {
        clearInterval(interval);
        hpVal.textContent = String(this._hpRoll);
        hpVal.style.color = '#80ff80';
      }
    }, 60);

    // Class-specific messages
    if (cls) {
      if (cls.type === 'caster' || cls.spellSlots) {
        const spellInfo = document.createElement('div');
        spellInfo.style.color = 'var(--text-dim)'; spellInfo.style.fontSize = '13px';
        spellInfo.style.marginBottom = '10px';
        const prevSlots = cls.spellSlots?.[e.level - 1] || {};
        const newSlots  = cls.spellSlots?.[e.level]     || {};
        const gained = Object.entries(newSlots)
          .filter(([lv, cnt]) => (cnt || 0) > (prevSlots[lv] || 0))
          .map(([lv, cnt]) => `${cnt - (prevSlots[lv] || 0)} Level ${lv} spell slot(s)`);
        if (gained.length > 0) {
          spellInfo.textContent = 'New spell slots: ' + gained.join(', ');
          p.appendChild(spellInfo);
        }
      }
      if (cls.type === 'thief' || cls.skills) {
        const thievDiv = document.createElement('div');
        thievDiv.textContent = 'You gain skill points. Allocate them below:';
        thievDiv.style.color = 'var(--text-dim)'; thievDiv.style.marginBottom = '8px';
        p.appendChild(thievDiv);
        const skills = ['Pick Pockets','Open Locks','Find/Remove Traps','Move Silently','Hide in Shadows'];
        skills.forEach(skill => {
          const row = document.createElement('div');
          row.style.display = 'flex'; row.style.justifyContent = 'space-between';
          row.style.alignItems = 'center'; row.style.margin = '4px 0';
          const lbl = document.createElement('span'); lbl.textContent = skill; lbl.style.flex = '1';
          const sl = document.createElement('input'); sl.type = 'range';
          sl.min = '0'; sl.max = '15'; sl.value = '0';
          sl.style.width = '120px'; sl.style.accentColor = 'var(--accent)';
          const vl = document.createElement('span'); vl.textContent = '0'; vl.style.width = '24px';
          sl.addEventListener('input', () => { vl.textContent = sl.value; });
          row.appendChild(lbl); row.appendChild(sl); row.appendChild(vl);
          p.appendChild(row);
        });
      }
      if (cls.type === 'fighter' || cls.weaponProficiencies) {
        const fighterDiv = document.createElement('div');
        fighterDiv.textContent = 'You gain 1 weapon proficiency slot.';
        fighterDiv.style.color = '#80c080'; fighterDiv.style.marginBottom = '8px';
        p.appendChild(fighterDiv);
      }
    }

    const confirmBtn = document.createElement('button');
    confirmBtn.className = 'btn btn-primary'; confirmBtn.textContent = 'Confirm';
    confirmBtn.style.marginTop = '20px'; confirmBtn.style.fontSize = '16px'; confirmBtn.style.padding = '10px 32px';
    confirmBtn.addEventListener('click', () => {
      // Apply HP increase
      e.maxHp = (e.maxHp || 0) + this._hpRoll;
      e.hp    = Math.min((e.hp || 0) + this._hpRoll, e.maxHp);
      this._panel?.remove(); this._panel = null;
    });
    p.appendChild(confirmBtn);
  }
}
