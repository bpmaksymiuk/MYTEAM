// DI-011: Shop State — buy/sell/identify items
'use strict';

function charismaModifier(cha) {
  if (cha <= 8)  return 0.4;
  if (cha <= 12) return 0.5;
  return 0.6;
}

export class ShopState {
  constructor(playing, merchantInventory) {
    this._playing  = playing;
    this._stock    = merchantInventory || [];
    this._panel    = null;
  }

  enter() {
    this._panel = document.createElement('div');
    this._panel.id = 'shop-panel';
    Object.assign(this._panel.style, {
      position: 'absolute', top: '50%', left: '50%',
      transform: 'translate(-50%,-50%)',
      width: '700px', height: '500px',
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

    const hdr = document.createElement('div');
    hdr.style.display = 'flex'; hdr.style.justifyContent = 'space-between';
    hdr.style.alignItems = 'center'; hdr.style.padding = '12px 16px';
    hdr.style.borderBottom = '1px solid var(--border)'; hdr.style.flexShrink = '0';

    const title = document.createElement('h2'); title.textContent = 'Merchant';
    Object.assign(title.style, { margin: '0', color: 'var(--accent)' });

    const gold = document.createElement('span');
    gold.textContent = `Gold: ${this._playing.partyGold || 0}`;
    gold.style.color = '#e8c050';

    const closeBtn = document.createElement('button');
    closeBtn.className = 'btn'; closeBtn.textContent = 'Leave';
    closeBtn.addEventListener('click', () => {
      import('./ExplorationState.js').then(m => {
        this._playing.setSubState(new m.ExplorationState(this._playing));
      });
    });

    hdr.appendChild(title); hdr.appendChild(gold); hdr.appendChild(closeBtn);
    p.appendChild(hdr);

    const body = document.createElement('div');
    body.style.display = 'flex'; body.style.flex = '1'; body.style.overflow = 'hidden';
    p.appendChild(body);

    // Merchant stock
    const left = document.createElement('div');
    left.style.flex = '1'; left.style.borderRight = '1px solid var(--border)';
    left.style.overflowY = 'auto'; left.style.padding = '8px';
    const llbl = document.createElement('div'); llbl.textContent = 'Merchant Stock';
    llbl.style.color = 'var(--accent)'; llbl.style.marginBottom = '8px'; left.appendChild(llbl);

    const leader = this._playing.party[0];
    const chaMod = charismaModifier(leader?.stats?.CHA || 10);

    this._stock.forEach(item => {
      const row = document.createElement('div'); row.className = 'item-row';
      const nm = document.createElement('span'); nm.style.flex = '1';
      nm.textContent = item.identified !== false ? item.name : `Unidentified ${item.type || 'Item'}`;
      const price = document.createElement('span');
      price.textContent = `${item.value || 0} gp`;
      price.style.color = '#e8c050'; price.style.marginRight = '8px';
      const buyBtn = document.createElement('button');
      buyBtn.className = 'btn'; buyBtn.textContent = 'Buy';
      buyBtn.style.padding = '3px 8px'; buyBtn.style.fontSize = '12px';
      buyBtn.disabled = item.identified === false ||
        (this._playing.partyGold || 0) < (item.value || 0) ||
        (leader?.inventory?.filter(i => i).length >= 20);
      buyBtn.addEventListener('click', () => {
        this._playing.partyGold = (this._playing.partyGold || 0) - (item.value || 0);
        leader.inventory = leader.inventory || [];
        const freeSlot = leader.inventory.findIndex(s => !s);
        if (freeSlot >= 0) leader.inventory[freeSlot] = { ...item };
        else leader.inventory.push({ ...item });
        this._render();
      });
      const idBtn = document.createElement('button');
      idBtn.className = 'btn'; idBtn.textContent = 'Identify (100gp)';
      idBtn.style.padding = '3px 8px'; idBtn.style.fontSize = '12px';
      idBtn.style.display = item.identified === false ? '' : 'none';
      idBtn.disabled = (this._playing.partyGold || 0) < 100;
      idBtn.addEventListener('click', () => {
        this._playing.partyGold -= 100; item.identified = true; this._render();
      });
      row.appendChild(nm); row.appendChild(price); row.appendChild(buyBtn); row.appendChild(idBtn);
      left.appendChild(row);
    });
    body.appendChild(left);

    // Player inventory
    const right = document.createElement('div');
    right.style.flex = '1'; right.style.overflowY = 'auto'; right.style.padding = '8px';
    const rlbl = document.createElement('div'); rlbl.textContent = 'Your Inventory';
    rlbl.style.color = 'var(--accent)'; rlbl.style.marginBottom = '8px'; right.appendChild(rlbl);

    (leader?.inventory || []).forEach((item, idx) => {
      if (!item) return;
      const row = document.createElement('div'); row.className = 'item-row';
      const nm = document.createElement('span'); nm.style.flex = '1';
      nm.textContent = item.name || '?';
      const sellPrice = Math.floor((item.value || 0) * chaMod);
      const sp = document.createElement('span');
      sp.textContent = `→ ${sellPrice} gp`; sp.style.color = '#70c070'; sp.style.marginRight = '8px';
      const sellBtn = document.createElement('button');
      sellBtn.className = 'btn'; sellBtn.textContent = 'Sell';
      sellBtn.style.padding = '3px 8px'; sellBtn.style.fontSize = '12px';
      sellBtn.addEventListener('click', () => {
        this._playing.partyGold = (this._playing.partyGold || 0) + sellPrice;
        leader.inventory[idx] = null;
        this._render();
      });
      row.appendChild(nm); row.appendChild(sp); row.appendChild(sellBtn);
      right.appendChild(row);
    });
    body.appendChild(right);
  }
}
