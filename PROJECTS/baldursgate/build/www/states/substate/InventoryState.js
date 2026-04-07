// DI-010: Inventory State — gear slots, bag, drag-and-drop
'use strict';

const EQUIP_SLOTS = ['Head','Neck','Chest','Cloak','Belt','Boots','Gloves',
                     'Ring L','Ring R','Weapon R','Shield/Off','Ammo'];
const BAG_SIZE = 20;

export class InventoryState {
  constructor(playing, charIndex) {
    this._playing   = playing;
    this._charIndex = charIndex || 0;
    this._panel     = null;
    this._contextMenu = null;
  }

  enter() {
    this._panel = document.createElement('div');
    this._panel.id = 'inventory-panel';
    Object.assign(this._panel.style, {
      position: 'absolute', top: '50%', left: '50%',
      transform: 'translate(-50%,-50%)',
      width: '760px', height: '540px',
      background: 'var(--bg-panel)', border: '2px solid var(--border)',
      borderRadius: '6px', display: 'flex', flexDirection: 'column',
      pointerEvents: 'auto', overflow: 'hidden',
    });
    document.getElementById('ui-layer').appendChild(this._panel);
    document.getElementById('ui-layer').classList.add('active');
    this._render();

    // Close context menu on outside click
    this._onOutsideClick = e => {
      if (this._contextMenu && !this._contextMenu.contains(e.target)) {
        this._contextMenu.remove(); this._contextMenu = null;
      }
    };
    document.addEventListener('click', this._onOutsideClick);
  }

  exit() {
    document.removeEventListener('click', this._onOutsideClick);
    this._contextMenu?.remove(); this._contextMenu = null;
    this._panel?.remove(); this._panel = null;
    document.getElementById('ui-layer').classList.remove('active');
  }

  update(_dt) {}
  render(_ctx) {}

  _char() { return this._playing.party[this._charIndex]; }

  _render() {
    const p = this._panel; p.innerHTML = '';
    const char = this._char();
    if (!char) { this.exit(); return; }

    // Tab bar for party members
    const tabBar = document.createElement('div');
    tabBar.className = 'tab-bar';
    tabBar.style.padding = '0 12px'; tabBar.style.flexShrink = '0';
    this._playing.party.forEach((member, i) => {
      const tab = document.createElement('div');
      tab.className = 'tab' + (i === this._charIndex ? ' active' : '');
      tab.textContent = member.name || `Member ${i + 1}`;
      tab.addEventListener('click', () => { this._charIndex = i; this._render(); });
      tabBar.appendChild(tab);
    });
    const closeTab = document.createElement('div');
    closeTab.className = 'tab'; closeTab.textContent = '✕ Close';
    closeTab.style.marginLeft = 'auto'; closeTab.style.color = 'var(--danger)';
    closeTab.addEventListener('click', () => {
      import('./ExplorationState.js').then(m => {
        this._playing.setSubState(new m.ExplorationState(this._playing));
      });
    });
    tabBar.appendChild(closeTab);
    p.appendChild(tabBar);

    // Main content row
    const row = document.createElement('div');
    row.style.display = 'flex'; row.style.flex = '1'; row.style.overflow = 'hidden';
    p.appendChild(row);

    // Left: stats
    const statsCol = document.createElement('div');
    statsCol.style.width = '160px'; statsCol.style.padding = '12px';
    statsCol.style.borderRight = '1px solid var(--border)'; statsCol.style.flexShrink = '0';

    const img = document.createElement('img');
    img.src = `assets/portraits/portrait_${(char.portrait || 0) + 1}.png`;
    img.className = 'portrait-img'; img.style.width = '100px'; img.style.height = '120px';
    img.onerror = () => { img.style.background = '#333'; img.src = ''; };
    statsCol.appendChild(img);

    const stats = char.stats || {};
    const statList = [
      ['STR', stats.STR], ['DEX', stats.DEX], ['CON', stats.CON],
      ['INT', stats.INT], ['WIS', stats.WIS], ['CHA', stats.CHA],
    ];
    statList.forEach(([name, val]) => {
      const d = document.createElement('div');
      d.style.display = 'flex'; d.style.justifyContent = 'space-between';
      d.style.fontSize = '13px'; d.style.margin = '2px 0';
      const n = document.createElement('span'); n.textContent = name;
      n.style.color = 'var(--text-dim)';
      const v = document.createElement('span'); v.textContent = val ?? '—';
      d.appendChild(n); d.appendChild(v);
      statsCol.appendChild(d);
    });

    [['HP', `${char.hp}/${char.maxHp}`], ['AC', char.ac], ['THAC0', char.thac0],
     ['Gold', this._playing.partyGold || 0]].forEach(([n, v]) => {
      const d = document.createElement('div');
      d.style.display = 'flex'; d.style.justifyContent = 'space-between';
      d.style.fontSize = '13px'; d.style.margin = '4px 0';
      d.style.borderTop = '1px solid var(--border)'; d.style.paddingTop = '3px';
      const nl = document.createElement('span'); nl.textContent = n; nl.style.color = 'var(--text-dim)';
      const vl = document.createElement('span'); vl.textContent = v ?? '—';
      d.appendChild(nl); d.appendChild(vl);
      statsCol.appendChild(d);
    });
    row.appendChild(statsCol);

    // Centre: equipment slots
    const equipCol = document.createElement('div');
    equipCol.style.width = '220px'; equipCol.style.padding = '12px';
    equipCol.style.borderRight = '1px solid var(--border)'; equipCol.style.flexShrink = '0';

    const elbl = document.createElement('div');
    elbl.textContent = 'Equipment'; elbl.style.color = 'var(--accent)';
    elbl.style.marginBottom = '8px'; elbl.style.fontWeight = 'bold';
    equipCol.appendChild(elbl);

    const equipGrid = document.createElement('div');
    equipGrid.style.display = 'grid';
    equipGrid.style.gridTemplateColumns = 'repeat(2,1fr)'; equipGrid.style.gap = '4px';

    const equipped = char.equipped || {};
    EQUIP_SLOTS.forEach(slotName => {
      const slotEl = document.createElement('div');
      slotEl.className = 'inv-slot';
      slotEl.title = slotName;
      slotEl.style.fontSize = '9px'; slotEl.style.flexDirection = 'column';

      const slotLbl = document.createElement('div');
      slotLbl.textContent = slotName; slotLbl.style.fontSize = '8px';
      slotLbl.style.color = 'var(--text-dim)'; slotLbl.style.marginBottom = '2px';
      slotEl.appendChild(slotLbl);

      const itemInSlot = Object.values(equipped).find(it => it?.equipSlot === slotName);
      if (itemInSlot) {
        const iName = document.createElement('div');
        iName.textContent = (itemInSlot.identified ? itemInSlot.name : 'Unidentified') || '?';
        iName.style.fontSize = '9px'; iName.style.color = 'var(--text-primary)';
        iName.style.overflow = 'hidden'; iName.style.textOverflow = 'ellipsis';
        slotEl.appendChild(iName);
        slotEl.addEventListener('contextmenu', e => { e.preventDefault(); this._showContextMenu(e, itemInSlot, char); });
      }
      slotEl.addEventListener('dragover', e => e.preventDefault());
      slotEl.addEventListener('drop', e => this._onDrop(e, slotName, char));
      equipGrid.appendChild(slotEl);
    });
    equipCol.appendChild(equipGrid);
    row.appendChild(equipCol);

    // Right: bag
    const bagCol = document.createElement('div');
    bagCol.style.flex = '1'; bagCol.style.padding = '12px'; bagCol.style.overflowY = 'auto';

    const blbl = document.createElement('div');
    blbl.textContent = 'Inventory'; blbl.style.color = 'var(--accent)';
    blbl.style.marginBottom = '8px'; blbl.style.fontWeight = 'bold';
    bagCol.appendChild(blbl);

    const bagGrid = document.createElement('div');
    bagGrid.style.display = 'grid';
    bagGrid.style.gridTemplateColumns = 'repeat(5,1fr)'; bagGrid.style.gap = '4px';

    const inventory = char.inventory || [];
    for (let i = 0; i < BAG_SIZE; i++) {
      const slot = document.createElement('div');
      slot.className = 'inv-slot';
      const item = inventory[i];
      if (item) {
        const nm = document.createElement('div');
        nm.textContent = (item.identified !== false ? item.name : 'Unid.') || '?';
        nm.style.fontSize = '9px'; nm.style.textAlign = 'center';
        nm.style.overflow = 'hidden'; nm.style.textOverflow = 'ellipsis';
        slot.appendChild(nm);
        slot.draggable = true;
        slot.addEventListener('dragstart', e => {
          e.dataTransfer.setData('application/json', JSON.stringify({ bagIndex: i }));
        });
        slot.addEventListener('contextmenu', e => { e.preventDefault(); this._showContextMenu(e, item, char, i); });
      }
      bagGrid.appendChild(slot);
    }
    bagCol.appendChild(bagGrid);

    // Weight
    const totalW = inventory.reduce((s, it) => s + (it?.weight || 0), 0);
    const maxW = 100 + (char.stats?.STR || 10) * 2;
    const wDiv = document.createElement('div');
    wDiv.style.marginTop = '8px'; wDiv.style.fontSize = '13px';
    wDiv.style.color = totalW > maxW ? 'var(--danger)' : 'var(--text-dim)';
    wDiv.textContent = `Weight: ${totalW} / ${maxW} lbs`;
    bagCol.appendChild(wDiv);

    row.appendChild(bagCol);
  }

  _showContextMenu(e, item, char, bagIndex) {
    this._contextMenu?.remove();
    const menu = document.createElement('div');
    menu.className = 'context-menu';
    Object.assign(menu.style, { left: e.clientX + 'px', top: e.clientY + 'px' });

    const addItem = (label, action) => {
      const li = document.createElement('div'); li.className = 'context-menu-item';
      li.textContent = label;
      li.addEventListener('click', () => { menu.remove(); this._contextMenu = null; action(); });
      menu.appendChild(li);
    };

    if (item.usable) addItem('Use', () => { /* use item */ });
    if (item.equipSlot) addItem('Equip', () => {
      char.equipped = char.equipped || {};
      char.equipped[item.equipSlot] = item;
      if (bagIndex !== undefined) char.inventory.splice(bagIndex, 1, null);
      this._render();
    });
    addItem('Drop', () => {
      if (bagIndex !== undefined) { char.inventory[bagIndex] = null; this._render(); }
    });
    addItem('Give…', () => { /* give to another party member — future enhancement */ });

    document.body.appendChild(menu);
    this._contextMenu = menu;
  }

  _onDrop(e, slotName, char) {
    const raw = e.dataTransfer.getData('application/json');
    if (!raw) return;
    let data;
    try { data = JSON.parse(raw); } catch (_) { return; }
    const item = char.inventory?.[data.bagIndex];
    if (!item) return;
    if (item.equipSlot !== slotName) {
      alert(`Cannot equip ${item.name} in ${slotName} slot.`); return;
    }
    char.equipped = char.equipped || {};
    char.equipped[slotName] = item;
    char.inventory[data.bagIndex] = null;
    this._render();
  }
}
