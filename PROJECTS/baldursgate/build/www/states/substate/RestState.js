// DI-014: Rest State — party watch assignment + heal on rest
'use strict';

function conModifier(con) {
  if (con <= 3)  return -2;
  if (con <= 6)  return -1;
  if (con <= 14) return 0;
  if (con <= 16) return 1;
  if (con === 17) return 2;
  if (con === 18) return 3;
  return 4;
}

export class RestState {
  constructor(playing) {
    this._playing = playing;
    this._panel   = null;
    this._watch   = new Map(); // entity.name -> 'watch'|'sleep'
  }

  enter() {
    this._panel = document.createElement('div');
    this._panel.id = 'rest-panel';
    Object.assign(this._panel.style, {
      position: 'absolute', top: '50%', left: '50%',
      transform: 'translate(-50%,-50%)',
      width: '420px', background: 'var(--bg-panel)',
      border: '2px solid var(--border)', borderRadius: '6px',
      padding: '24px', pointerEvents: 'auto',
    });
    document.getElementById('ui-layer').appendChild(this._panel);
    document.getElementById('ui-layer').classList.add('active');

    // Default: leader on watch, rest sleeping
    this._playing.party.forEach((m, i) => {
      this._watch.set(m.name, i === 0 ? 'watch' : 'sleep');
    });
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

    const hdr = document.createElement('h2');
    hdr.textContent = 'Rest';
    Object.assign(hdr.style, { margin: '0 0 16px', color: 'var(--accent)' });
    p.appendChild(hdr);

    this._playing.party.forEach(member => {
      const row = document.createElement('div');
      row.style.display = 'flex'; row.style.alignItems = 'center';
      row.style.gap = '12px'; row.style.marginBottom = '10px';

      const name = document.createElement('span');
      name.textContent = member.name; name.style.flex = '1'; name.style.fontWeight = 'bold';

      const watchLabel = document.createElement('label');
      watchLabel.style.display = 'flex'; watchLabel.style.alignItems = 'center'; watchLabel.style.gap = '4px';
      const watchR = document.createElement('input');
      watchR.type = 'radio'; watchR.name = 'watch_' + member.name; watchR.value = 'watch';
      watchR.checked = this._watch.get(member.name) === 'watch';
      watchR.addEventListener('change', () => { if (watchR.checked) this._watch.set(member.name, 'watch'); });
      watchLabel.appendChild(watchR); watchLabel.appendChild(document.createTextNode('On Watch'));

      const sleepLabel = document.createElement('label');
      sleepLabel.style.display = 'flex'; sleepLabel.style.alignItems = 'center'; sleepLabel.style.gap = '4px';
      const sleepR = document.createElement('input');
      sleepR.type = 'radio'; sleepR.name = 'watch_' + member.name; sleepR.value = 'sleep';
      sleepR.checked = this._watch.get(member.name) === 'sleep';
      sleepR.addEventListener('change', () => { if (sleepR.checked) this._watch.set(member.name, 'sleep'); });
      sleepLabel.appendChild(sleepR); sleepLabel.appendChild(document.createTextNode('Sleeping'));

      const hp = document.createElement('span');
      hp.textContent = `HP: ${member.hp}/${member.maxHp}`;
      hp.style.color = 'var(--text-dim)'; hp.style.fontSize = '12px';

      row.appendChild(name); row.appendChild(watchLabel);
      row.appendChild(sleepLabel); row.appendChild(hp);
      p.appendChild(row);
    });

    const btnRow = document.createElement('div');
    btnRow.style.display = 'flex'; btnRow.style.gap = '12px'; btnRow.style.marginTop = '20px';

    const restBtn = document.createElement('button');
    restBtn.className = 'btn btn-primary'; restBtn.textContent = 'Rest Until Dawn';
    restBtn.addEventListener('click', () => this._simulateRest());

    const skipBtn = document.createElement('button');
    skipBtn.className = 'btn'; skipBtn.textContent = 'Cancel';
    skipBtn.addEventListener('click', () => this._returnToExploration());

    btnRow.appendChild(restBtn); btnRow.appendChild(skipBtn);
    p.appendChild(btnRow);
  }

  async _simulateRest() {
    const p = this._playing;
    const area = p.area;

    // Encounter check for dangerous areas
    if (area?.dangerous) {
      const encounterChance = area.encounterChance || 0.3;
      if (Math.random() < encounterChance) {
        const encounters = window.GameData?.encounters || [];
        const enc = encounters.find(e => e.areaId === p.areaId || e.type === 'random');
        if (enc?.enemies?.length > 0) {
          this.exit();
          const { CharacterFactory } = await import('../../engine/CharacterFactory.js');
          const enemies = enc.enemies.map(def =>
            CharacterFactory.createEnemy ? CharacterFactory.createEnemy(def) : def
          );
          import('./CombatState.js').then(m => {
            p.setSubState(new m.CombatState(p, enemies));
            p._hud?.showMessage('Your rest was interrupted!');
          });
          return;
        }
      }
    }

    // Heal sleeping party members
    for (const member of p.party) {
      if (this._watch.get(member.name) === 'sleep') {
        const level = member.level || 1;
        const conMod = conModifier(member.stats?.CON || 10);
        const healed = Math.max(1, level * conMod + level);
        member.hp = Math.min(member.maxHp, (member.hp || 0) + healed);
      }
      // Restore spell slots
      if (member.memorisedSpells) {
        member.usedSpellSlots = {};
      }
    }
    p._hud?.showMessage('The party rests and recovers.');
    this._returnToExploration();
  }

  _returnToExploration() {
    this.exit();
    import('./ExplorationState.js').then(m => {
      this._playing.setSubState(new m.ExplorationState(this._playing));
    });
  }
}
