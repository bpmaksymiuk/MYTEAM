import { areas, characterOptions, encounters, npcScripts, servicesByArea, starterInventory, worldMap } from './content.js';
import { listSlots, loadSlot, saveSlot } from './storage.js';

export function initGame(root) {
  const game = createGame(root);
  game.render();
}

function createGame(root) {
  const state = {
    mode: 'title',
    protagonist: null,
    party: [],
    chapter: 'title',
    areaId: 'candlekeep',
    selectedNodeId: null,
    discovered: ['candlekeep'],
    journal: ['The quiet safety of Candlekeep cannot last forever.'],
    completedQuests: [],
    dismissedCompanions: [],
    log: ['The Sword Coast waits beyond Candlekeep.'],
    time: 8,
    reputation: 10,
    gold: 120,
    flags: {
      leftCandlekeep: false,
      firebeadMet: false,
      metJaheira: false,
      tarneshDefeated: false,
      mineQuestAccepted: false,
      mineCleared: false,
    },
    ui: {
      dialogue: null,
      journalOpen: false,
      worldMapOpen: false,
      savesOpen: false,
      loadOpen: false,
      inventoryOpen: false,
      partyOpen: false,
      servicesOpen: null,
    },
    areaPosition: { x: 120, y: 360, targetX: 120, targetY: 360 },
    combat: null,
    creation: {
      name: 'Charname',
      race: characterOptions.races[0],
      class: characterOptions.classes[0],
      alignment: characterOptions.alignments[0],
      portrait: characterOptions.portraits[0],
      stats: rollStats(),
    },
  };

  const canvas = document.createElement('canvas');
  canvas.width = 960;
  canvas.height = 540;
  canvas.id = 'game-canvas';

  let combatTimer = null;
  let animationFrame = null;

  const game = {
    state,
    root,
    addJournal(text) {
      if (!state.journal.includes(text)) {
        state.journal.unshift(text);
      }
      game.render();
    },
    addCompletedQuest(text) {
      if (!state.completedQuests.includes(text)) {
        state.completedQuests.unshift(text);
      }
      game.render();
    },
    log(text) {
      state.log.unshift(text);
      state.log = state.log.slice(0, 12);
      game.render();
    },
    discover(areaId) {
      if (!state.discovered.includes(areaId)) {
        state.discovered.push(areaId);
      }
    },
    recruitCompanion(member) {
      if (state.party.length >= 6) {
        game.log('The party is full. Someone must be dismissed before another companion can join.');
        return;
      }
      if (!state.party.some((entry) => entry.id === member.id)) {
        state.party.push(withCharacterDefaults(member));
        game.log(`${member.name} joins the party.`);
      }
      game.render();
    },
    dismissCompanion(memberId) {
      if (memberId === 'charname') {
        game.log('The protagonist cannot be dismissed from the party.');
        return;
      }
      const member = state.party.find((entry) => entry.id === memberId);
      if (!member) {
        return;
      }
      state.party = state.party.filter((entry) => entry.id !== memberId);
      state.dismissedCompanions.unshift({ ...member, dismissedAt: state.areaId });
      game.log(`${member.name} is dismissed and remains at ${areas[state.areaId].name}.`);
      game.render();
    },
    setArea(areaId) {
      state.areaId = areaId;
      state.mode = 'exploration';
      state.ui.dialogue = null;
      state.ui.worldMapOpen = false;
      state.ui.journalOpen = false;
      state.ui.inventoryOpen = false;
      state.ui.partyOpen = false;
      state.ui.servicesOpen = null;
      state.selectedNodeId = null;
      state.areaPosition = { x: 120, y: 360, targetX: 120, targetY: 360 };
      game.discover(areaId);
      game.render();
    },
    advanceTime(hours) {
      state.time = (state.time + hours) % 24;
    },
    openDialogue(nodeId) {
      const script = npcScripts[nodeId];
      if (!script) {
        return;
      }
      state.ui.dialogue = {
        nodeId,
        script: script.lines(state),
      };
      game.render();
    },
    closeDialogue() {
      state.ui.dialogue = null;
      game.render();
    },
    openServices(areaId) {
      state.ui.servicesOpen = areaId;
      game.render();
    },
    closeServices() {
      state.ui.servicesOpen = null;
      game.render();
    },
    equipItem(itemId) {
      const character = getLeadCharacter(state);
      const item = character?.inventory.find((entry) => entry.id === itemId);
      if (!character || !item || !item.slot) {
        return;
      }
      if (!canEquip(character, item)) {
        game.log(`${character.name} cannot equip ${item.name}.`);
        return;
      }
      const equipped = character.equipment[item.slot];
      if (equipped?.id === item.id) {
        character.equipment[item.slot] = null;
        game.log(`${character.name} unequips ${item.name}.`);
      } else {
        character.equipment[item.slot] = item;
        game.log(`${character.name} equips ${item.name}.`);
      }
      syncProtagonist(state);
      game.render();
    },
    useItem(itemId) {
      const character = getLeadCharacter(state);
      const index = character?.inventory.findIndex((entry) => entry.id === itemId) ?? -1;
      if (!character || index < 0) {
        return;
      }
      const item = character.inventory[index];
      if (item.type !== 'consumable') {
        game.log(`${item.name} cannot be used directly.`);
        return;
      }
      character.hp = Math.min(character.maxHp, character.hp + (item.healing || 0));
      character.inventory.splice(index, 1);
      syncProtagonist(state);
      game.log(`${character.name} uses ${item.name} and recovers strength.`);
      game.render();
    },
    buyItem(itemId) {
      const service = servicesByArea[state.ui.servicesOpen];
      const item = service?.storeInventory.find((entry) => entry.id === itemId);
      if (!item) {
        return;
      }
      const price = adjustedPrice(item.price, state.reputation);
      if (state.gold < price) {
        game.log(`The party lacks the ${price} gold required for ${item.name}.`);
        return;
      }
      state.gold -= price;
      getLeadCharacter(state).inventory.push({ ...item, id: `${item.id}-${Date.now()}` });
      game.log(`Purchased ${item.name} for ${price} gold.`);
      syncProtagonist(state);
      game.render();
    },
    sellItem(itemId) {
      const character = getLeadCharacter(state);
      const index = character?.inventory.findIndex((entry) => entry.id === itemId) ?? -1;
      if (!character || index < 0) {
        return;
      }
      const [item] = character.inventory.splice(index, 1);
      state.gold += Math.max(1, Math.floor((item.price || 10) * 0.5));
      if (character.equipment[item.slot]?.id === item.id) {
        character.equipment[item.slot] = null;
      }
      game.log(`Sold ${item.name} for ${Math.max(1, Math.floor((item.price || 10) * 0.5))} gold.`);
      syncProtagonist(state);
      game.render();
    },
    purchaseService(kind) {
      const service = servicesByArea[state.ui.servicesOpen];
      if (!service) {
        return;
      }
      const lead = getLeadCharacter(state);
      const costs = {
        heal: service.healCost,
        donate: service.donationCost,
        lodge: service.lodgingCost,
      };
      if (state.gold < costs[kind]) {
        game.log(`The party lacks the ${costs[kind]} gold required for that service.`);
        return;
      }
      state.gold -= costs[kind];
      if (kind === 'heal') {
        state.party = state.party.map((member) => ({ ...member, hp: member.maxHp }));
        syncProtagonist(state);
        game.log('The party receives healing and recovers to full strength.');
      }
      if (kind === 'donate') {
        state.reputation += 1;
        game.log('A donation improves the party\'s standing among the faithful.');
      }
      if (kind === 'lodge') {
        healParty(state, 10);
        game.advanceTime(8);
        game.log(`${lead.name} rents a room and the party sleeps in safety.`);
      }
      game.render();
    },
    startCombat(encounterId) {
      const encounter = encounters[encounterId];
      if (!encounter) {
        return;
      }
      clearInterval(combatTimer);
      state.mode = 'combat';
      state.combat = {
        encounterId,
        enemyName: encounter.name,
        enemyHp: encounter.hp,
        enemyMaxHp: encounter.hp,
        partyHp: state.party.reduce((sum, member) => sum + member.hp, 0) || 20,
        partyMaxHp: state.party.reduce((sum, member) => sum + member.maxHp, 0) || 20,
        paused: true,
        queue: [],
        timerId: null,
        log: ['Combat begins. Pause to issue commands, then resume the clash.'],
      };
      combatTimer = window.setInterval(() => tickCombat(game), 850);
      state.combat.timerId = combatTimer;
      game.render();
    },
    save(slot) {
      const snapshot = {
        savedAt: new Date().toISOString(),
        areaId: state.areaId,
        chapter: state.chapter,
        protagonist: state.protagonist,
        party: state.party,
        discovered: state.discovered,
        journal: state.journal,
        completedQuests: state.completedQuests,
        time: state.time,
        reputation: state.reputation,
        flags: state.flags,
        gold: state.gold,
        dismissedCompanions: state.dismissedCompanions,
      };
      saveSlot(slot, snapshot);
      state.ui.savesOpen = false;
      game.log(`Saved the campaign to slot ${slot}.`);
    },
    load(slot) {
      const snapshot = loadSlot(slot);
      if (!snapshot) {
        game.log(`Save slot ${slot} is empty.`);
        return;
      }
      state.mode = 'exploration';
      state.protagonist = snapshot.protagonist;
      state.party = snapshot.party;
      state.areaId = snapshot.areaId;
      state.chapter = snapshot.chapter;
      state.discovered = snapshot.discovered;
      state.journal = snapshot.journal;
      state.completedQuests = snapshot.completedQuests;
      state.time = snapshot.time;
      state.reputation = snapshot.reputation;
      state.gold = snapshot.gold ?? 0;
      state.flags = snapshot.flags;
      state.dismissedCompanions = snapshot.dismissedCompanions ?? [];
      state.ui.loadOpen = false;
      state.ui.savesOpen = false;
      state.ui.worldMapOpen = false;
      state.ui.journalOpen = false;
      state.ui.inventoryOpen = false;
      state.ui.partyOpen = false;
      state.ui.servicesOpen = null;
      state.areaPosition = { x: 120, y: 360, targetX: 120, targetY: 360 };
      game.log(`Loaded save slot ${slot}.`);
      game.render();
    },
    render,
  };

  function render() {
    root.innerHTML = '';
    root.appendChild(buildShell(game, canvas));
    drawScene(game, canvas);
    cancelAnimationFrame(animationFrame);
    animationFrame = requestAnimationFrame(() => animateParty(game, canvas));
  }

  canvas.addEventListener('click', (event) => {
    if (state.mode !== 'exploration') {
      return;
    }
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    state.areaPosition.targetX = x;
    state.areaPosition.targetY = y;
    const node = areas[state.areaId].nodes.find((entry) => distance(entry.x, entry.y, x, y) < 28);
    state.selectedNodeId = node ? node.id : null;
    game.render();
  });

  return game;
}

function buildShell(game, canvas) {
  const { state } = game;
  const shell = document.createElement('div');
  shell.className = 'shell';

  const header = document.createElement('header');
  header.className = 'topbar';
  header.innerHTML = `
    <div>
      <h1>Baldur's Gate Prototype</h1>
      <p>${getSubtitle(state)}</p>
    </div>
    <div class="status-pill">Time ${formatHour(state.time)} | Reputation ${state.reputation}</div>
  `;

  const main = document.createElement('main');
  main.className = 'layout';

  const left = document.createElement('section');
  left.className = 'panel narrative-panel';
  left.appendChild(buildPrimaryPanel(game));

  const center = document.createElement('section');
  center.className = 'stage';
  center.appendChild(canvas);

  const right = document.createElement('aside');
  right.className = 'panel sidebar';
  right.appendChild(buildSidebar(game));

  main.append(left, center, right);

  const logPanel = document.createElement('section');
  logPanel.className = 'panel log-panel';
  logPanel.innerHTML = `<h3>Travel Log</h3>${state.log.map((entry) => `<p>${entry}</p>`).join('')}`;

  shell.append(header, main, logPanel);

  if (state.ui.dialogue) {
    shell.appendChild(buildDialogueOverlay(game));
  }
  if (state.ui.worldMapOpen) {
    shell.appendChild(buildWorldMapOverlay(game));
  }
  if (state.ui.journalOpen) {
    shell.appendChild(buildJournalOverlay(game));
  }
  if (state.ui.inventoryOpen) {
    shell.appendChild(buildInventoryOverlay(game));
  }
  if (state.ui.partyOpen) {
    shell.appendChild(buildPartyOverlay(game));
  }
  if (state.ui.servicesOpen) {
    shell.appendChild(buildServicesOverlay(game));
  }
  if (state.ui.savesOpen || state.ui.loadOpen) {
    shell.appendChild(buildSaveOverlay(game));
  }

  return shell;
}

function buildPrimaryPanel(game) {
  const { state } = game;
  const wrapper = document.createElement('div');

  if (state.mode === 'title') {
    wrapper.innerHTML = `
      <h2>Title Screen</h2>
      <p>A prototype reconstruction of the opening Sword Coast journey. Begin a new campaign or load a saved state.</p>
    `;
    wrapper.appendChild(buttonRow([
      makeButton('New Game', () => {
        state.mode = 'characterCreation';
        state.chapter = 'prologue';
        game.render();
      }),
      makeButton('Load Game', () => {
        state.ui.loadOpen = true;
        game.render();
      }),
    ]));
    return wrapper;
  }

  if (state.mode === 'characterCreation') {
    wrapper.innerHTML = '<h2>Create Your Bhaalspawn</h2><p>Choose an identity, class, alignment, and starting attributes.</p>';
    wrapper.appendChild(buildCharacterForm(game));
    return wrapper;
  }

  if (state.mode === 'combat') {
    wrapper.appendChild(buildCombatPanel(game));
    return wrapper;
  }

  const area = areas[state.areaId];
  const selected = area.nodes.find((entry) => entry.id === state.selectedNodeId);
  wrapper.innerHTML = `
    <h2>${area.name}</h2>
    <p>${area.description}</p>
    <p class="muted">Chapter: ${formatLabel(state.chapter)}</p>
  `;
  if (selected) {
    wrapper.innerHTML += `<div class="focus-card"><h3>${selected.label}</h3><p>${describeNode(selected)}</p></div>`;
    wrapper.appendChild(buildNodeActions(game, selected));
  } else {
    wrapper.innerHTML += '<p class="muted">Click a highlighted location in the scene to focus it, then choose an action here.</p>';
  }
  wrapper.appendChild(buttonRow([
    makeButton('World Map', () => {
      state.ui.worldMapOpen = true;
      game.render();
    }),
    makeButton('Journal', () => {
      state.ui.journalOpen = true;
      game.render();
    }),
    makeButton('Inventory', () => {
      state.ui.inventoryOpen = true;
      game.render();
    }),
    makeButton('Party', () => {
      state.ui.partyOpen = true;
      game.render();
    }),
    makeButton('Services', () => {
      game.openServices(state.areaId);
    }, !servicesByArea[state.areaId]),
    makeButton('Rest', () => {
      const before = totalPartyHp(state);
      healParty(state, 6);
      game.advanceTime(8);
      game.log(`The party rests. Health improves from ${before} to ${totalPartyHp(state)}.`);
    }),
    makeButton('Save', () => {
      state.ui.savesOpen = true;
      game.render();
    }),
  ]));
  return wrapper;
}

function buildCharacterForm(game) {
  const { creation } = game.state;
  const form = document.createElement('div');
  form.className = 'character-form';

  form.appendChild(labeledInput('Name', 'text', creation.name, (value) => {
    creation.name = value;
  }));
  form.appendChild(labeledSelect('Race', characterOptions.races, creation.race, (value) => {
    creation.race = value;
  }));
  form.appendChild(labeledSelect('Class', characterOptions.classes, creation.class, (value) => {
    creation.class = value;
  }));
  form.appendChild(labeledSelect('Alignment', characterOptions.alignments, creation.alignment, (value) => {
    creation.alignment = value;
  }));
  form.appendChild(labeledSelect('Portrait', characterOptions.portraits, creation.portrait, (value) => {
    creation.portrait = value;
  }));

  const stats = document.createElement('div');
  stats.className = 'stats-grid';
  Object.entries(creation.stats).forEach(([key, value]) => {
    const cell = document.createElement('div');
    cell.className = 'stat-cell';
    cell.innerHTML = `<span>${key.toUpperCase()}</span><strong>${value}</strong>`;
    stats.appendChild(cell);
  });
  form.appendChild(stats);

  form.appendChild(buttonRow([
    makeButton('Roll Stats', () => {
      creation.stats = rollStats();
      game.render();
    }),
    makeButton('Confirm Character', () => {
      if (!creation.name.trim()) {
        game.log('A name is required before the journey can begin.');
        return;
      }
      game.state.protagonist = {
        id: 'charname',
        name: creation.name.trim(),
        race: creation.race,
        class: creation.class,
        alignment: creation.alignment,
        portrait: creation.portrait,
        stats: { ...creation.stats },
        gold: 120,
        hp: 22,
        maxHp: 22,
        inventory: starterInventory.map((item) => ({ ...item, id: `${item.id}-starter` })),
        equipment: {
          weapon: null,
          armor: null,
          trinket: null,
        },
      };
      game.state.party = [game.state.protagonist];
      game.state.mode = 'exploration';
      game.state.chapter = 'prologue';
      game.setArea('candlekeep');
      game.log(`${game.state.protagonist.name} begins the journey in Candlekeep.`);
      game.addJournal(`${game.state.protagonist.name} prepared to leave Candlekeep under Gorion's urgent command.`);
    }),
  ]));

  return form;
}

function buildCombatPanel(game) {
  const { combat } = game.state;
  const panel = document.createElement('div');
  panel.innerHTML = `
    <h2>${combat.enemyName}</h2>
    <p>Issue commands while paused, then resume the fight to resolve them in real time.</p>
    <div class="combat-bars">
      <div><span>Party</span><strong>${combat.partyHp} / ${combat.partyMaxHp}</strong></div>
      <div><span>${combat.enemyName}</span><strong>${combat.enemyHp} / ${combat.enemyMaxHp}</strong></div>
    </div>
  `;

  panel.appendChild(buttonRow([
    makeButton(combat.paused ? 'Resume Combat' : 'Pause Combat', () => {
      combat.paused = !combat.paused;
      game.render();
    }),
    makeButton('Queue Attack', () => {
      combat.queue.push({ type: 'attack', label: 'Weapon Attack' });
      combat.log.unshift('The protagonist prepares a measured strike.');
      game.render();
    }),
    makeButton('Queue Spell', () => {
      combat.queue.push({ type: 'spell', label: 'Arcane Bolt' });
      combat.log.unshift('Arcane power gathers behind the party line.');
      game.render();
    }),
    makeButton('Drink Potion', () => {
      combat.partyHp = Math.min(combat.partyMaxHp, combat.partyHp + 6);
      combat.log.unshift('A quick draught steadies the front line.');
      game.render();
    }),
  ]));

  const feed = document.createElement('div');
  feed.className = 'combat-feed';
  feed.innerHTML = combat.log.slice(0, 8).map((entry) => `<p>${entry}</p>`).join('');
  panel.appendChild(feed);
  return panel;
}

function buildNodeActions(game, node) {
  if (node.type === 'npc') {
    return buttonRow([makeButton('Speak', () => game.openDialogue(node.id))]);
  }
  if (node.type === 'story') {
    if (node.id === 'gorion') {
      return buttonRow([makeButton('Speak With Gorion', () => game.openDialogue('gorion'))]);
    }
    if (node.id === 'gorion-memory') {
      return buttonRow([makeButton('Reflect On The Ambush', () => {
        game.addJournal('The memory of Gorion\'s sacrifice hardens the party\'s resolve.');
        game.log('The grief of the ambush still hangs on the road.');
      })]);
    }
    if (node.id === 'mines') {
      return buttonRow([makeButton('Enter The Mines', () => {
        game.startCombat('mines');
      })]);
    }
  }
  if (node.type === 'encounter') {
    if (node.id === 'tarnesh' && game.state.flags.tarneshDefeated) {
      return buttonRow([makeButton('The assassin lies defeated', () => {}, true)]);
    }
    return buttonRow([makeButton('Confront The Threat', () => game.startCombat(node.id))]);
  }
  if (node.type === 'travel') {
    return buttonRow([makeButton('Use Travel Route', () => {
      const next = travelFromNode(game.state.areaId, node.id);
      if (next) {
        game.advanceTime(4);
        game.setArea(next);
        game.log(`The party travels onward to ${areas[next].name}.`);
      }
    })]);
  }
  return document.createElement('div');
}

function buildSidebar(game) {
  const { state } = game;
  const sidebar = document.createElement('div');
  sidebar.innerHTML = `
    <h3>Party</h3>
    <div class="party-list">${state.party.map((member) => `<div class="party-card"><strong>${member.name}</strong><span>${member.role || member.class}</span><span>${member.hp}/${member.maxHp} HP</span><span>ATK ${derivedStats(member).attack} | DEF ${derivedStats(member).defense}</span></div>`).join('') || '<p>No party members yet.</p>'}</div>
    <h3>Inventory</h3>
    <div class="inventory-list">${(state.protagonist?.inventory || []).map((item) => `<span>${item.name}</span>`).join('') || '<span>No gear.</span>'}</div>
    <h3>Treasury</h3>
    <div class="tag-list"><span>${state.gold} gold</span></div>
    <h3>Discovered Destinations</h3>
    <div class="tag-list">${state.discovered.map((id) => `<span>${worldMap[id].label}</span>`).join('')}</div>
  `;
  return sidebar;
}

function buildDialogueOverlay(game) {
  const overlay = document.createElement('div');
  overlay.className = 'overlay';
  const { script, nodeId } = game.state.ui.dialogue;
  overlay.innerHTML = `
    <div class="modal">
      <h2>${npcScripts[nodeId].name}</h2>
      <p class="portrait-label">${npcScripts[nodeId].portrait}</p>
      <p>${script.text}</p>
    </div>
  `;
  const modal = overlay.querySelector('.modal');
  script.choices.forEach((choice) => {
    const button = makeButton(choice.label, () => {
      if (choice.effect) {
        choice.effect(game);
      }
      if (choice.close !== false) {
        game.closeDialogue();
      } else {
        game.state.ui.dialogue = {
          nodeId,
          script: npcScripts[nodeId].lines(game.state),
        };
        game.render();
      }
    }, choice.disabled);
    modal.appendChild(button);
  });
  modal.appendChild(makeButton('Close', () => game.closeDialogue()));
  return overlay;
}

function buildWorldMapOverlay(game) {
  const overlay = document.createElement('div');
  overlay.className = 'overlay';
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.innerHTML = '<h2>World Map</h2><p>Travel to any discovered destination. Locked regions remain hidden until the chapter reveals them.</p>';
  game.state.discovered.forEach((id) => {
    modal.appendChild(makeButton(worldMap[id].label, () => {
      game.advanceTime(3);
      game.setArea(id);
      game.log(`The party travels to ${worldMap[id].label}.`);
    }));
  });
  modal.appendChild(makeButton('Close', () => {
    game.state.ui.worldMapOpen = false;
    game.render();
  }));
  overlay.appendChild(modal);
  return overlay;
}

function buildJournalOverlay(game) {
  const overlay = document.createElement('div');
  overlay.className = 'overlay';
  const modal = document.createElement('div');
  modal.className = 'modal journal-modal';
  modal.innerHTML = `
    <h2>Journal</h2>
    <h3>Active Notes</h3>
    ${game.state.journal.map((entry) => `<p>${entry}</p>`).join('')}
    <h3>Completed</h3>
    ${game.state.completedQuests.map((entry) => `<p>${entry}</p>`).join('') || '<p>No completed quests yet.</p>'}
    <h3>Map Notes</h3>
    ${game.state.discovered.map((id) => `<p>${worldMap[id].label} has been marked on the map.</p>`).join('')}
  `;
  modal.appendChild(makeButton('Close', () => {
    game.state.ui.journalOpen = false;
    game.render();
  }));
  overlay.appendChild(modal);
  return overlay;
}

function buildInventoryOverlay(game) {
  const overlay = document.createElement('div');
  overlay.className = 'overlay';
  const modal = document.createElement('div');
  modal.className = 'modal inventory-modal';
  const character = getLeadCharacter(game.state);
  const stats = derivedStats(character);
  modal.innerHTML = `
    <h2>Inventory and Equipment</h2>
    <p>${character.name} carries ${character.inventory.length} items. Attack ${stats.attack}, Defense ${stats.defense}.</p>
    <div class="equipment-grid">
      <div><strong>Weapon</strong><span>${character.equipment.weapon?.name || 'None equipped'}</span></div>
      <div><strong>Armor</strong><span>${character.equipment.armor?.name || 'None equipped'}</span></div>
      <div><strong>Trinket</strong><span>${character.equipment.trinket?.name || 'None equipped'}</span></div>
    </div>
  `;
  const list = document.createElement('div');
  list.className = 'inventory-actions';
  character.inventory.forEach((item) => {
    const row = document.createElement('div');
    row.className = 'action-row';
    row.innerHTML = `<span>${item.name}</span><span>${item.type}</span>`;
    row.appendChild(makeButton(item.slot ? 'Equip/Unequip' : 'Use', () => {
      if (item.slot) {
        game.equipItem(item.id);
      } else {
        game.useItem(item.id);
      }
    }));
    row.appendChild(makeButton('Sell', () => game.sellItem(item.id), !servicesByArea[game.state.areaId]));
    list.appendChild(row);
  });
  modal.appendChild(list);
  modal.appendChild(makeButton('Close', () => {
    game.state.ui.inventoryOpen = false;
    game.render();
  }));
  overlay.appendChild(modal);
  return overlay;
}

function buildPartyOverlay(game) {
  const overlay = document.createElement('div');
  overlay.className = 'overlay';
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.innerHTML = '<h2>Party Management</h2><p>Dismiss companions to make room for new allies. Dismissed companions remain tied to their last known location.</p>';
  game.state.party.forEach((member) => {
    const row = document.createElement('div');
    row.className = 'action-row';
    row.innerHTML = `<span>${member.name}</span><span>${member.role || member.class}</span>`;
    row.appendChild(makeButton('Dismiss', () => game.dismissCompanion(member.id), member.id === 'charname'));
    modal.appendChild(row);
  });
  if (game.state.dismissedCompanions.length) {
    modal.innerHTML += '<h3>Dismissed Companions</h3>';
    game.state.dismissedCompanions.forEach((member) => {
      const row = document.createElement('p');
      row.textContent = `${member.name} last remained at ${areas[member.dismissedAt]?.name || member.dismissedAt}.`;
      modal.appendChild(row);
    });
  }
  modal.appendChild(makeButton('Close', () => {
    game.state.ui.partyOpen = false;
    game.render();
  }));
  overlay.appendChild(modal);
  return overlay;
}

function buildServicesOverlay(game) {
  const overlay = document.createElement('div');
  overlay.className = 'overlay';
  const modal = document.createElement('div');
  modal.className = 'modal';
  const service = servicesByArea[game.state.ui.servicesOpen];
  if (!service) {
    return overlay;
  }
  modal.innerHTML = `
    <h2>${service.title}</h2>
    <p>Prices already reflect the party's current reputation. Funds available: ${game.state.gold} gold.</p>
  `;
  const serviceList = document.createElement('div');
  serviceList.className = 'inventory-actions';
  [
    { id: 'heal', label: `Full Healing (${service.healCost} gold)` },
    { id: 'donate', label: `Donation (${service.donationCost} gold)` },
    { id: 'lodge', label: `Rent Room (${service.lodgingCost} gold)` },
  ].forEach((entry) => {
    const row = document.createElement('div');
    row.className = 'action-row';
    row.innerHTML = `<span>${entry.label}</span><span>Service</span>`;
    row.appendChild(makeButton('Purchase', () => game.purchaseService(entry.id)));
    serviceList.appendChild(row);
  });
  service.storeInventory.forEach((item) => {
    const row = document.createElement('div');
    row.className = 'action-row';
    row.innerHTML = `<span>${item.name}</span><span>${adjustedPrice(item.price, game.state.reputation)} gold</span>`;
    row.appendChild(makeButton('Buy', () => game.buyItem(item.id)));
    serviceList.appendChild(row);
  });
  modal.appendChild(serviceList);
  modal.appendChild(makeButton('Close', () => game.closeServices()));
  overlay.appendChild(modal);
  return overlay;
}

function buildSaveOverlay(game) {
  const overlay = document.createElement('div');
  overlay.className = 'overlay';
  const modal = document.createElement('div');
  modal.className = 'modal';
  const slots = listSlots();
  modal.innerHTML = `<h2>${game.state.ui.loadOpen ? 'Load Game' : 'Save Game'}</h2>`;
  slots.forEach((slot, index) => {
    const label = slot
      ? `Slot ${index + 1}: ${slot.protagonist?.name || 'Unknown'} - ${areas[slot.areaId]?.name || slot.areaId} - ${slot.savedAt.slice(0, 16).replace('T', ' ')}`
      : `Slot ${index + 1}: Empty`;
    modal.appendChild(makeButton(label, () => {
      if (game.state.ui.loadOpen) {
        game.load(index + 1);
      } else {
        game.save(index + 1);
      }
    }, game.state.ui.loadOpen && !slot));
  });
  modal.appendChild(makeButton('Close', () => {
    game.state.ui.loadOpen = false;
    game.state.ui.savesOpen = false;
    game.render();
  }));
  overlay.appendChild(modal);
  return overlay;
}

function drawScene(game, canvas) {
  const context = canvas.getContext('2d');
  const area = areas[game.state.areaId];
  const gradient = context.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, area.palette[0]);
  gradient.addColorStop(1, area.palette[1]);
  context.fillStyle = gradient;
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.fillStyle = 'rgba(245, 225, 192, 0.1)';
  for (let index = 0; index < 8; index += 1) {
    context.fillRect(index * 120, 0, 2, canvas.height);
  }
  for (let index = 0; index < 5; index += 1) {
    context.fillRect(0, index * 108, canvas.width, 2);
  }

  area.nodes.forEach((node) => {
    const isSelected = game.state.selectedNodeId === node.id;
    context.beginPath();
    context.fillStyle = isSelected ? '#f8d36a' : colorForNode(node.type);
    context.arc(node.x, node.y, isSelected ? 14 : 11, 0, Math.PI * 2);
    context.fill();
    context.fillStyle = '#fff4df';
    context.font = '16px Georgia, serif';
    context.fillText(node.label, node.x + 18, node.y + 5);
  });

  if (game.state.mode === 'combat') {
    context.fillStyle = 'rgba(21, 6, 6, 0.7)';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = '#f6e3c0';
    context.font = '44px Georgia, serif';
    context.fillText(game.state.combat.enemyName, 340, 120);
    context.font = '22px Georgia, serif';
    context.fillText('Real-time-with-pause prototype encounter', 300, 160);
    drawHealthBar(context, 180, 380, 250, game.state.combat.partyHp, game.state.combat.partyMaxHp, '#6ca96a');
    drawHealthBar(context, 530, 170, 250, game.state.combat.enemyHp, game.state.combat.enemyMaxHp, '#b85858');
    return;
  }

  context.beginPath();
  context.fillStyle = '#f7f0d7';
  context.arc(game.state.areaPosition.x, game.state.areaPosition.y, 10, 0, Math.PI * 2);
  context.fill();
  context.strokeStyle = '#1e1510';
  context.lineWidth = 3;
  context.stroke();
}

function animateParty(game, canvas) {
  if (game.state.mode === 'exploration') {
    const { areaPosition } = game.state;
    const dx = areaPosition.targetX - areaPosition.x;
    const dy = areaPosition.targetY - areaPosition.y;
    if (Math.abs(dx) > 1 || Math.abs(dy) > 1) {
      areaPosition.x += dx * 0.08;
      areaPosition.y += dy * 0.08;
      drawScene(game, canvas);
      animationFrame = requestAnimationFrame(() => animateParty(game, canvas));
      return;
    }
  }
  drawScene(game, canvas);
}

function tickCombat(game) {
  const { state } = game;
  if (state.mode !== 'combat' || !state.combat || state.combat.paused) {
    return;
  }
  const encounter = encounters[state.combat.encounterId];
  const command = state.combat.queue.shift() || { type: 'attack', label: 'Weapon Attack' };
  const partyDamage = command.type === 'spell' ? randomBetween(6, 10) : randomBetween(4, 8);
  state.combat.enemyHp = Math.max(0, state.combat.enemyHp - partyDamage);
  state.combat.log.unshift(`The party uses ${command.label} for ${partyDamage} damage.`);

  if (state.combat.enemyHp <= 0) {
    resolveVictory(game, encounter.id);
    return;
  }

  const enemyUsesSpell = Math.random() > 0.55;
  const enemyDamage = enemyUsesSpell
    ? randomBetween(encounter.spell.damage[0], encounter.spell.damage[1])
    : randomBetween(encounter.attack[0], encounter.attack[1]);
  state.combat.partyHp = Math.max(0, state.combat.partyHp - enemyDamage);
  state.combat.log.unshift(`${encounter.name} answers with ${enemyUsesSpell ? encounter.spell.label : 'a brutal strike'} for ${enemyDamage} damage.`);

  if (state.combat.partyHp <= 0) {
    state.combat.paused = true;
    state.combat.log.unshift('The party is overwhelmed. Rest, regroup, and try again from a prior save.');
  }

  game.render();
}

function resolveVictory(game, encounterId) {
  const { state } = game;
  clearInterval(state.combat?.timerId);
  state.mode = 'exploration';
  state.combat = null;
  if (encounterId === 'tarnesh') {
    state.flags.tarneshDefeated = true;
    state.flags.metJaheira = true;
    game.discover('beregost');
    game.discover('nashkel');
    game.addJournal('Tarnesh was slain at the Friendly Arm, confirming that someone powerful wants the ward dead.');
    game.log('Friendly Arm is secure for the moment, and the party can continue south.');
  }
  if (encounterId === 'mines') {
    state.flags.mineCleared = true;
    game.addJournal('The first resistance in the Nashkel Mines has been broken, and the sabotage is no longer rumor.');
    game.addJournal('Berrun Ghastkill should hear that the Nashkel Mines have been secured for the moment.');
    game.log('The mines begin to yield their secrets after a hard fight underground.');
  }
  healParty(state, 4);
  game.render();
}

function totalPartyHp(state) {
  return state.party.reduce((sum, member) => sum + member.hp, 0);
}

function healParty(state, amount) {
  state.party = state.party.map((member) => ({
    ...member,
    hp: Math.min(member.maxHp, member.hp + amount),
  }));
  syncProtagonist(state);
}

function getLeadCharacter(state) {
  return state.party.find((member) => member.id === 'charname') || state.protagonist;
}

function withCharacterDefaults(member) {
  return {
    inventory: member.inventory || [],
    equipment: member.equipment || { weapon: null, armor: null, trinket: null },
    ...member,
  };
}

function syncProtagonist(state) {
  state.protagonist = state.party.find((member) => member.id === 'charname') || state.protagonist;
}

function canEquip(character, item) {
  const role = character.class || character.role || '';
  return !item.allowedClasses || item.allowedClasses.some((entry) => role.includes(entry));
}

function derivedStats(character) {
  const weaponBonus = character?.equipment?.weapon?.attackBonus || 0;
  const armorBonus = (character?.equipment?.armor?.defenseBonus || 0) + (character?.equipment?.trinket?.defenseBonus || 0);
  return {
    attack: 5 + weaponBonus,
    defense: 10 + armorBonus,
  };
}

function adjustedPrice(basePrice, reputation) {
  if (reputation >= 12) {
    return Math.max(1, Math.floor(basePrice * 0.9));
  }
  if (reputation <= 8) {
    return Math.max(1, Math.ceil(basePrice * 1.15));
  }
  return basePrice;
}

function rollStats() {
  return {
    str: randomBetween(9, 18),
    dex: randomBetween(9, 18),
    con: randomBetween(9, 18),
    int: randomBetween(9, 18),
    wis: randomBetween(9, 18),
    cha: randomBetween(9, 18),
  };
}

function labeledInput(label, type, value, onInput) {
  const wrapper = document.createElement('label');
  wrapper.className = 'field';
  const span = document.createElement('span');
  span.textContent = label;
  const input = document.createElement('input');
  input.type = type;
  input.value = value;
  input.addEventListener('input', (event) => onInput(event.target.value));
  wrapper.append(span, input);
  return wrapper;
}

function labeledSelect(label, options, selectedValue, onChange) {
  const wrapper = document.createElement('label');
  wrapper.className = 'field';
  const span = document.createElement('span');
  span.textContent = label;
  const select = document.createElement('select');
  options.forEach((option) => {
    const entry = document.createElement('option');
    entry.value = option;
    entry.textContent = option;
    entry.selected = option === selectedValue;
    select.appendChild(entry);
  });
  select.addEventListener('change', (event) => onChange(event.target.value));
  wrapper.append(span, select);
  return wrapper;
}

function buttonRow(buttons) {
  const row = document.createElement('div');
  row.className = 'button-row';
  buttons.forEach((button) => row.appendChild(button));
  return row;
}

function makeButton(label, onClick, disabled = false) {
  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = label;
  button.disabled = disabled;
  button.addEventListener('click', onClick);
  return button;
}

function getSubtitle(state) {
  if (state.mode === 'title') {
    return 'Stage 5 vertical slice: character creation, exploration, dialogue, world travel, saves, and prototype combat.';
  }
  if (state.mode === 'characterCreation') {
    return 'Create the protagonist who will carry the crisis beyond Candlekeep.';
  }
  if (state.mode === 'combat') {
    return 'Pause, queue commands, and resume to resolve a prototype real-time-with-pause fight.';
  }
  return `${areas[state.areaId].name} - ${areas[state.areaId].description}`;
}

function describeNode(node) {
  return {
    npc: 'A talkative figure whose words may shift the party, the journal, or the road ahead.',
    story: 'A story-critical location or event anchor.',
    encounter: 'A dangerous threat that can trigger combat.',
    travel: 'A route onward to another area of the Coast.',
  }[node.type] || 'An unexplained point of interest.';
}

function colorForNode(type) {
  return {
    npc: '#81c4b7',
    story: '#f4cb6b',
    encounter: '#d06b6b',
    travel: '#a8a3d8',
  }[type] || '#f6e3c0';
}

function drawHealthBar(context, x, y, width, value, max, color) {
  context.fillStyle = 'rgba(245, 227, 192, 0.18)';
  context.fillRect(x, y, width, 24);
  context.fillStyle = color;
  context.fillRect(x, y, width * (value / max), 24);
  context.strokeStyle = '#f6e3c0';
  context.strokeRect(x, y, width, 24);
}

function travelFromNode(areaId, nodeId) {
  const routes = {
    road: { 'travel-fa': 'friendlyArm' },
    friendlyArm: { 'travel-bg': 'beregost' },
    beregost: { 'travel-na': 'nashkel' },
  };
  return routes[areaId]?.[nodeId] || null;
}

function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function distance(x1, y1, x2, y2) {
  return Math.hypot(x2 - x1, y2 - y1);
}

function formatHour(hour) {
  return `${String(hour).padStart(2, '0')}:00`;
}

function formatLabel(value) {
  return value.split('-').map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`).join(' ');
}