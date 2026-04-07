// DI-028: HUD — portrait bar, action bar, minimap, messages
'use strict';

export class HUD {
  constructor(party) {
    this._party = party;
    this._hudEl = null;
    this._portraitBar = null;
    this._pauseIndicator = null;
    this._statusMsg = null;
    this._minimapCanvas = null;
    this._fadTimer = null;
    this._onBtnClick = null;
  }

  init() {
    this._hudEl = document.getElementById('hud');
    this._hudEl.innerHTML = '';
    this._hudEl.classList.remove('hidden');
    this._hudEl.classList.add('active');
    this._hudEl.style.pointerEvents = 'none';

    // Portrait bar
    this._portraitBar = document.createElement('div');
    this._portraitBar.id = 'portrait-bar';
    Object.assign(this._portraitBar.style, {
      position: 'absolute', bottom: '80px', left: '10px',
      display: 'flex', flexDirection: 'column', gap: '6px',
      pointerEvents: 'auto',
    });
    this._party?.forEach?.((member, i) => {
      const wrap = document.createElement('div');
      wrap.id = `portrait-${i}`;
      Object.assign(wrap.style, {
        width: '68px', background: 'var(--bg-panel)',
        border: '2px solid var(--border)', borderRadius: '3px',
        padding: '2px', cursor: 'pointer', userSelect: 'none',
      });

      const img = document.createElement('img');
      img.className = 'portrait-img';
      const rawPortrait = member.portrait ?? member.portraitIndex ?? 0;
      const pKey = typeof rawPortrait === 'string' ? rawPortrait : rawPortrait + 1;
      img.src = `assets/portraits/portrait_${pKey}.png`;
      img.style.width = '64px'; img.style.height = '72px';
      img.onerror = () => { img.style.background = `hsl(${i * 70},30%,20%)`; img.src = ''; };
      wrap.appendChild(img);

      const hpWrap = document.createElement('div'); hpWrap.className = 'hp-bar-wrap';
      const hpFill = document.createElement('div');
      hpFill.className = 'hp-bar';
      hpFill.id = `hp-bar-${i}`;
      hpFill.style.width = `${Math.round((member.hp / (member.maxHp || 1)) * 100)}%`;
      hpWrap.appendChild(hpFill); wrap.appendChild(hpWrap);

      const statusIcons = document.createElement('div');
      statusIcons.className = 'status-icons'; statusIcons.id = `status-icons-${i}`;
      statusIcons.style.fontSize = '12px'; statusIcons.style.textAlign = 'center';
      wrap.appendChild(statusIcons);

      wrap.addEventListener('click', () => {
        import('../states/substate/InventoryState.js').then(m => {
          // Notify playing state to open inventory for this character
          const ev = new CustomEvent('hud:openInventory', { detail: { charIndex: i } });
          window.dispatchEvent(ev);
        });
      });

      this._portraitBar.appendChild(wrap);
    });
    this._hudEl.appendChild(this._portraitBar);

    // Action bar
    const actionBar = document.createElement('div');
    actionBar.id = 'action-bar';
    Object.assign(actionBar.style, {
      position: 'absolute', bottom: '10px', left: '50%',
      transform: 'translateX(-50%)',
      display: 'flex', gap: '8px',
      background: 'rgba(10,8,5,0.9)',
      border: '2px solid var(--border)', borderRadius: '4px',
      padding: '6px 12px', pointerEvents: 'auto',
    });

    [
      { id: 'btn-attack',    label: '⚔',  title: 'Attack'    },
      { id: 'btn-spell',     label: '✦',  title: 'Spell'     },
      { id: 'btn-inventory', label: '🎒', title: 'Inventory' },
      { id: 'btn-journal',   label: '📖', title: 'Journal'   },
      { id: 'btn-map',       label: '🗺', title: 'Map'       },
      { id: 'btn-rest',      label: '💤', title: 'Rest'      },
    ].forEach(({ id, label, title }) => {
      const btn = document.createElement('button');
      btn.id = id; btn.className = 'btn'; btn.title = title;
      btn.textContent = label;
      Object.assign(btn.style, { fontSize: '20px', width: '44px', height: '44px', padding: '0' });
      btn.addEventListener('click', () => {
        const ev = new CustomEvent('hud:action', { detail: { action: id } });
        window.dispatchEvent(ev);
      });
      actionBar.appendChild(btn);
    });
    this._hudEl.appendChild(actionBar);

    // Minimap canvas
    this._minimapCanvas = document.createElement('canvas');
    this._minimapCanvas.id = 'minimap-canvas';
    this._minimapCanvas.width = 150; this._minimapCanvas.height = 150;
    Object.assign(this._minimapCanvas.style, {
      position: 'absolute', top: '10px', right: '10px',
      border: '2px solid var(--border)', borderRadius: '2px',
    });
    this._hudEl.appendChild(this._minimapCanvas);

    // Pause indicator
    this._pauseIndicator = document.createElement('div');
    this._pauseIndicator.id = 'pause-indicator';
    this._pauseIndicator.textContent = 'PAUSED';
    this._pauseIndicator.style.display = 'none';
    this._hudEl.appendChild(this._pauseIndicator);

    // Status message
    this._statusMsg = document.createElement('div');
    this._statusMsg.id = 'status-msg';
    this._statusMsg.style.display = 'none';
    this._hudEl.appendChild(this._statusMsg);

    // XP bar
    const xpBar = document.createElement('div'); xpBar.id = 'xp-bar';
    const xpFill = document.createElement('div'); xpFill.id = 'xp-bar-fill';
    xpFill.style.width = '0%';
    xpBar.appendChild(xpFill);
    this._hudEl.appendChild(xpBar);

    // Listen for HUD action events (dispatched from playing state)
    this._onBtnClick = this._handleAction.bind(this);
    window.addEventListener('hud:action', this._onBtnClick);
  }

  update(party, paused) {
    if (!this._hudEl) return;
    this._party = party;

    // Refresh HP bars + status icons
    party?.forEach?.((member, i) => {
      const bar = document.getElementById(`hp-bar-${i}`);
      if (bar) bar.style.width = `${Math.round((member.hp / (member.maxHp || 1)) * 100)}%`;
      const icons = document.getElementById(`status-icons-${i}`);
      if (icons) {
        const conditions = [];
        if (member.poisoned)  conditions.push('☠');
        if (member.confused)  conditions.push('?');
        if (member.blind)     conditions.push('👁');
        icons.textContent = conditions.join('');
      }
    });

    // Pause indicator
    if (this._pauseIndicator) {
      this._pauseIndicator.style.display = paused ? 'block' : 'none';
    }
  }

  showMessage(text) {
    if (!this._statusMsg) return;
    this._statusMsg.textContent = text;
    this._statusMsg.style.display = 'block';
    this._statusMsg.classList.remove('fade');
    clearTimeout(this._fadTimer);
    this._fadTimer = setTimeout(() => {
      this._statusMsg.classList.add('fade');
      setTimeout(() => {
        if (this._statusMsg) this._statusMsg.style.display = 'none';
      }, 1000);
    }, 2000);
  }

  destroy() {
    window.removeEventListener('hud:action', this._onBtnClick);
    if (this._hudEl) {
      this._hudEl.innerHTML = '';
      this._hudEl.classList.add('hidden');
      this._hudEl.classList.remove('active');
    }
  }

  _handleAction(ev) {
    const action = ev.detail?.action;
    const dispatchEv = new CustomEvent('playing:action', { detail: { action } });
    window.dispatchEvent(dispatchEv);
  }
}
