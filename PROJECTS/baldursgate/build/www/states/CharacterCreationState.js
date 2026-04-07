// DI-005: Character Creation State — five-step wizard
'use strict';

import { StateManager }    from '../StateManager.js';
import { roll4d6DropLowest } from '../engine/CombatEngine.js';

const STEPS = ['Name', 'Race', 'Class', 'Ability Scores', 'Portrait'];
const STAT_NAMES = ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'];
const PORTRAIT_COUNT = 8;

export class CharacterCreationState {
  constructor() {
    this._panel = null;
    this._step = 0;
    this._data = {
      name: '',
      race: null,
      cls: null,
      stats: { STR: 10, DEX: 10, CON: 10, INT: 10, WIS: 10, CHA: 10 },
      portrait: 0,
    };
  }

  enter() {
    this._panel = document.createElement('div');
    this._panel.id = 'char-creation';
    Object.assign(this._panel.style, {
      position: 'absolute', top: '50%', left: '50%',
      transform: 'translate(-50%,-50%)',
      width: '640px', maxHeight: '80vh',
      background: 'var(--bg-panel)',
      border: '2px solid var(--border)',
      borderRadius: '6px', padding: '24px',
      pointerEvents: 'auto', overflowY: 'auto',
    });
    document.getElementById('ui-layer').appendChild(this._panel);
    document.getElementById('ui-layer').classList.add('active');
    this._renderStep();
  }

  exit() {
    this._panel?.remove(); this._panel = null;
    document.getElementById('ui-layer').classList.remove('active');
  }

  update(_dt) {}
  render(ctx) {
    const { width, height } = ctx.canvas;
    const grad = ctx.createLinearGradient(0, 0, 0, height);
    grad.addColorStop(0, '#040210'); grad.addColorStop(1, '#100802');
    ctx.fillStyle = grad; ctx.fillRect(0, 0, width, height);
  }

  _renderStep() {
    const p = this._panel;
    p.innerHTML = '';

    // Header
    const hdr = document.createElement('h2');
    hdr.textContent = `Character Creation — Step ${this._step + 1}: ${STEPS[this._step]}`;
    Object.assign(hdr.style, { margin: '0 0 16px', color: 'var(--accent)' });
    p.appendChild(hdr);

    // Step indicator
    const stepRow = document.createElement('div');
    stepRow.style.display = 'flex'; stepRow.style.gap = '8px'; stepRow.style.marginBottom = '20px';
    STEPS.forEach((s, i) => {
      const dot = document.createElement('span');
      dot.textContent = String(i + 1);
      Object.assign(dot.style, {
        width: '28px', height: '28px', borderRadius: '50%',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        background: i === this._step ? 'var(--accent)' : 'var(--border)',
        color: i === this._step ? '#000' : 'var(--text-dim)',
        fontSize: '12px', fontWeight: 'bold',
      });
      stepRow.appendChild(dot);
    });
    p.appendChild(stepRow);

    // Content pane
    const content = document.createElement('div');
    p.appendChild(content);

    switch (this._step) {
      case 0: this._renderName(content);    break;
      case 1: this._renderRace(content);    break;
      case 2: this._renderClass(content);   break;
      case 3: this._renderStats(content);   break;
      case 4: this._renderPortrait(content);break;
    }

    // Nav buttons
    const nav = document.createElement('div');
    Object.assign(nav.style, { display: 'flex', justifyContent: 'space-between', marginTop: '20px' });

    if (this._step > 0) {
      const back = document.createElement('button');
      back.className = 'btn'; back.textContent = '← Back';
      back.addEventListener('click', () => { this._step--; this._renderStep(); });
      nav.appendChild(back);
    } else {
      nav.appendChild(document.createElement('span'));
    }

    const next = document.createElement('button');
    next.className = 'btn btn-primary';
    next.textContent = this._step === 4 ? 'Create Character' : 'Next →';
    next.addEventListener('click', () => this._advance());
    nav.appendChild(next);
    p.appendChild(nav);
  }

  _renderName(c) {
    const lbl = document.createElement('label');
    lbl.textContent = "Enter your character's name:";
    lbl.style.display = 'block'; lbl.style.marginBottom = '8px';
    c.appendChild(lbl);

    const inp = document.createElement('input');
    inp.type = 'text'; inp.maxLength = 30;
    inp.value = this._data.name;
    Object.assign(inp.style, {
      width: '100%', padding: '8px', fontSize: '16px',
      background: '#0a0805', border: '1px solid var(--border)',
      color: 'var(--text-primary)', borderRadius: '3px',
    });
    inp.addEventListener('input', () => { this._data.name = inp.value.trim(); });
    c.appendChild(inp);
    setTimeout(() => inp.focus(), 50);
  }

  _renderRace(c) {
    const races = window.GameData?.races || [];
    const list = Array.isArray(races) ? races : Object.values(races);
    list.forEach(race => {
      const label = document.createElement('label');
      label.style.display = 'flex'; label.style.alignItems = 'center';
      label.style.gap = '10px'; label.style.marginBottom = '10px';
      label.style.cursor = 'pointer';

      const radio = document.createElement('input');
      radio.type = 'radio'; radio.name = 'race'; radio.value = race.id || race.name;
      radio.checked = this._data.race === (race.id || race.name);
      radio.addEventListener('change', () => { this._data.race = radio.value; this._data.cls = null; });

      const info = document.createElement('span');
      info.textContent = `${race.name}  —  ${race.description || ''}`;
      info.style.fontSize = '14px';

      label.appendChild(radio); label.appendChild(info);
      c.appendChild(label);
    });
  }

  _renderClass(c) {
    const classes = window.GameData?.classes || [];
    const classList = Array.isArray(classes)
      ? classes
      : Object.entries(classes).map(([id, cls]) => ({ ...cls, id }));
    const races = window.GameData?.races || [];
    const raceList = Array.isArray(races) ? races : Object.values(races);
    const selectedRace = raceList.find(r => (r.id || r.name) === this._data.race);
    const allowed = selectedRace?.allowedClasses || classList.map(c2 => c2.id || c2.name);

    classList.forEach(cls => {
      const clsId = cls.id || cls.name;
      const isAllowed = allowed.includes(clsId);

      const label = document.createElement('label');
      label.style.display = 'flex'; label.style.alignItems = 'center';
      label.style.gap = '10px'; label.style.marginBottom = '10px';
      label.style.cursor = isAllowed ? 'pointer' : 'not-allowed';
      label.style.opacity = isAllowed ? '1' : '0.4';

      const radio = document.createElement('input');
      radio.type = 'radio'; radio.name = 'class'; radio.value = clsId;
      radio.disabled = !isAllowed;
      radio.checked = this._data.cls === clsId;
      radio.addEventListener('change', () => { this._data.cls = radio.value; });

      const info = document.createElement('span');
      info.textContent = `${cls.name}  —  ${cls.description || ''}`;
      info.style.fontSize = '14px';

      label.appendChild(radio); label.appendChild(info);
      c.appendChild(label);
    });
  }

  _renderStats(c) {
    const rollBtn = document.createElement('button');
    rollBtn.className = 'btn';
    rollBtn.textContent = 'Roll 4d6 Drop Lowest';
    rollBtn.style.marginBottom = '16px';
    rollBtn.addEventListener('click', () => {
      STAT_NAMES.forEach(s => { this._data.stats[s] = roll4d6DropLowest(); });
      this._renderStep();
    });
    c.appendChild(rollBtn);

    const grid = document.createElement('div');
    grid.style.display = 'grid';
    grid.style.gridTemplateColumns = 'repeat(3, 1fr)';
    grid.style.gap = '12px';

    STAT_NAMES.forEach(stat => {
      const block = document.createElement('div');
      Object.assign(block.style, {
        background: '#0a0805', border: '1px solid var(--border)',
        borderRadius: '4px', padding: '10px', textAlign: 'center',
      });

      const lbl = document.createElement('div');
      lbl.textContent = stat;
      lbl.style.color = 'var(--text-dim)'; lbl.style.fontSize = '12px';

      const val = document.createElement('div');
      val.textContent = this._data.stats[stat];
      val.style.fontSize = '28px'; val.style.color = 'var(--accent)';
      val.style.fontWeight = 'bold';

      block.appendChild(lbl); block.appendChild(val);
      grid.appendChild(block);
    });
    c.appendChild(grid);
  }

  _renderPortrait(c) {
    const lbl = document.createElement('p');
    lbl.textContent = 'Choose a portrait:';
    lbl.style.marginBottom = '12px';
    c.appendChild(lbl);

    const grid = document.createElement('div');
    grid.style.display = 'flex'; grid.style.flexWrap = 'wrap'; grid.style.gap = '10px';

    for (let i = 0; i < PORTRAIT_COUNT; i++) {
      const wrap = document.createElement('div');
      wrap.style.cursor = 'pointer';
      wrap.style.border = i === this._data.portrait ? '3px solid var(--accent)' : '3px solid transparent';
      wrap.style.borderRadius = '4px';

      const img = document.createElement('img');
      img.src = `assets/portraits/portrait_${i + 1}.png`;
      img.width = 72; img.height = 90;
      img.style.display = 'block'; img.style.background = '#222';
      img.onerror = () => {
        // Fallback: coloured rectangle
        img.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
        img.style.background = `hsl(${i * 45},40%,20%)`;
      };

      wrap.addEventListener('click', () => {
        this._data.portrait = i;
        c.querySelectorAll('[data-portrait]').forEach(el => {
          el.style.border = '3px solid transparent';
        });
        wrap.style.border = '3px solid var(--accent)';
      });
      wrap.dataset.portrait = i;
      wrap.appendChild(img);
      grid.appendChild(wrap);
    }
    c.appendChild(grid);

    const namePrev = document.createElement('p');
    namePrev.style.marginTop = '16px';
    namePrev.style.color = 'var(--text-dim)';
    const d = this._data;
    namePrev.textContent = `${d.name || '(unnamed)'} — ${d.race || '?'} ${d.cls || '?'}`;
    c.appendChild(namePrev);
  }

  _advance() {
    switch (this._step) {
      case 0:
        if (!this._data.name) { alert('Please enter a name.'); return; }
        break;
      case 1:
        if (!this._data.race) { alert('Please select a race.'); return; }
        break;
      case 2:
        if (!this._data.cls) { alert('Please select a class.'); return; }
        break;
      case 4:
        this._finishCreation(); return;
    }
    this._step++;
    this._renderStep();
  }

  _finishCreation() {
    import('../engine/CharacterFactory.js').then(m => {
      const factory = m.default || m;
      const entity = (factory.createCharacter || factory.default?.createCharacter)?.call(
        factory,
        this._data.name,
        this._data.race,
        this._data.cls,
        this._data.stats,
        this._data.portrait
      );
      import('./PlayingState.js').then(pm => {
        const ps = new pm.PlayingState('candlekeep');
        ps.party = entity ? [entity] : [];
        StateManager.setState(ps);
      });
    });
  }
}
