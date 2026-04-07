// DI-012: Journal State — read-only quest journal with three tabs
'use strict';

import QuestEngine from '../../engine/QuestEngine.js';

export class JournalState {
  constructor(playing) {
    this._playing = playing;
    this._panel   = null;
    this._tab     = 'active';
  }

  enter() {
    this._panel = document.createElement('div');
    this._panel.id = 'journal-panel';
    Object.assign(this._panel.style, {
      position: 'absolute', top: '50%', left: '50%',
      transform: 'translate(-50%,-50%)',
      width: '560px', height: '480px',
      background: 'var(--bg-panel)', border: '2px solid var(--border)',
      borderRadius: '6px', display: 'flex', flexDirection: 'column',
      pointerEvents: 'auto', overflow: 'hidden',
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
  render(_ctx) {}

  _render() {
    const p = this._panel; p.innerHTML = '';

    // Header
    const hdr = document.createElement('div');
    hdr.style.display = 'flex'; hdr.style.justifyContent = 'space-between';
    hdr.style.alignItems = 'center'; hdr.style.padding = '12px 16px';
    hdr.style.borderBottom = '1px solid var(--border)'; hdr.style.flexShrink = '0';
    const title = document.createElement('h2'); title.textContent = 'Journal';
    Object.assign(title.style, { margin: '0', color: 'var(--accent)' });
    const closeBtn = document.createElement('button');
    closeBtn.className = 'btn'; closeBtn.textContent = 'Close';
    closeBtn.addEventListener('click', () => {
      import('./ExplorationState.js').then(m => {
        this._playing.setSubState(new m.ExplorationState(this._playing));
      });
    });
    hdr.appendChild(title); hdr.appendChild(closeBtn); p.appendChild(hdr);

    // Tabs
    const tabBar = document.createElement('div'); tabBar.className = 'tab-bar';
    tabBar.style.padding = '0 12px'; tabBar.style.flexShrink = '0';
    [['active','Active'],['completed','Completed'],['failed','Failed']].forEach(([key,lbl]) => {
      const tab = document.createElement('div');
      tab.className = 'tab' + (this._tab === key ? ' active' : '');
      tab.textContent = lbl;
      tab.addEventListener('click', () => { this._tab = key; this._render(); });
      tabBar.appendChild(tab);
    });
    p.appendChild(tabBar);

    // Content
    const content = document.createElement('div');
    content.className = 'scroll-box';
    content.style.flex = '1'; content.style.padding = '12px';
    p.appendChild(content);

    const data = QuestEngine.getJournalData ? QuestEngine.getJournalData() : { active: [], completed: [], failed: [] };
    const quests = data[this._tab] || [];

    if (quests.length === 0) {
      const msg = document.createElement('p');
      msg.textContent = `No ${this._tab} quests.`;
      msg.style.color = 'var(--text-dim)'; content.appendChild(msg);
      return;
    }

    quests.forEach(quest => {
      const block = document.createElement('div');
      block.style.marginBottom = '20px';

      const titleEl = document.createElement('div');
      titleEl.textContent = quest.title || '(Unknown Quest)';
      Object.assign(titleEl.style, {
        fontWeight: 'bold', color: 'var(--accent)', fontSize: '16px', marginBottom: '6px',
      });
      block.appendChild(titleEl);

      const desc = document.createElement('p');
      desc.textContent = quest.description || '';
      Object.assign(desc.style, { margin: '0 0 8px', fontSize: '13px', lineHeight: '1.5' });
      block.appendChild(desc);

      const ul = document.createElement('ul');
      ul.style.margin = '0'; ul.style.paddingLeft = '20px';
      (quest.objectives || []).forEach(obj => {
        const li = document.createElement('li');
        li.style.fontSize = '13px'; li.style.marginBottom = '3px';
        li.style.color = obj.done ? 'var(--text-dim)' : 'var(--text-primary)';
        li.textContent = (obj.done ? '✓ ' : '○ ') + (obj.text || obj);
        ul.appendChild(li);
      });
      block.appendChild(ul);
      content.appendChild(block);
    });
  }
}
