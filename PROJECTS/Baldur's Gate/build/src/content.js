export const characterOptions = {
  races: ['Human', 'Elf', 'Half-Elf', 'Dwarf', 'Halfling'],
  classes: ['Fighter', 'Mage', 'Cleric', 'Ranger', 'Thief'],
  alignments: ['Lawful Good', 'Neutral Good', 'Chaotic Good', 'True Neutral', 'Neutral Evil'],
  portraits: ['Ward of Candlekeep', 'Sword Coast Wanderer', 'Child of Murder'],
};

export const areas = {
  candlekeep: {
    id: 'candlekeep',
    name: 'Candlekeep',
    palette: ['#203246', '#465f72'],
    description: 'A sheltered citadel of lore where the journey begins.',
    nodes: [
      { id: 'firebead', label: 'Firebead', type: 'npc', x: 170, y: 180 },
      { id: 'imoen', label: 'Imoen', type: 'npc', x: 360, y: 300 },
      { id: 'gorion', label: 'Gorion', type: 'story', x: 650, y: 210 },
    ],
  },
  road: {
    id: 'road',
    name: 'Lion\'s Way',
    palette: ['#1f2d18', '#4c5a2b'],
    description: 'The road south of Candlekeep, marked by sudden danger and grief.',
    nodes: [
      { id: 'gorion-memory', label: 'Gorion\'s Death', type: 'story', x: 230, y: 190 },
      { id: 'travel-fa', label: 'Travel Signpost', type: 'travel', x: 710, y: 300 },
    ],
  },
  friendlyArm: {
    id: 'friendlyArm',
    name: 'Friendly Arm Inn',
    palette: ['#39261c', '#8e6d4f'],
    description: 'A fortified inn that serves as the first reliable refuge on the Sword Coast.',
    nodes: [
      { id: 'jaheira', label: 'Jaheira & Khalid', type: 'npc', x: 245, y: 160 },
      { id: 'bentley', label: 'Bentley Mirrorshade', type: 'npc', x: 430, y: 320 },
      { id: 'tarnesh', label: 'Tarnesh', type: 'encounter', x: 640, y: 220 },
      { id: 'travel-bg', label: 'Road South', type: 'travel', x: 770, y: 360 },
    ],
  },
  beregost: {
    id: 'beregost',
    name: 'Beregost',
    palette: ['#57351f', '#9d7042'],
    description: 'A restless town full of rumors, errands, and rising tension.',
    nodes: [
      { id: 'marl', label: 'Marl', type: 'npc', x: 160, y: 140 },
      { id: 'garrick', label: 'Garrick', type: 'npc', x: 420, y: 285 },
      { id: 'travel-na', label: 'Road to Nashkel', type: 'travel', x: 760, y: 340 },
    ],
  },
  nashkel: {
    id: 'nashkel',
    name: 'Nashkel',
    palette: ['#3c2f4b', '#8573a6'],
    description: 'A mining town desperate for relief from sabotage and fear.',
    nodes: [
      { id: 'berrun', label: 'Berrun Ghastkill', type: 'npc', x: 190, y: 150 },
      { id: 'nashkel-store', label: 'Nashkel Supplies', type: 'npc', x: 525, y: 170 },
      { id: 'minsc', label: 'Minsc', type: 'npc', x: 380, y: 300 },
      { id: 'mines', label: 'Nashkel Mines', type: 'story', x: 710, y: 220 },
    ],
  },
};

export const worldMap = {
  candlekeep: { label: 'Candlekeep', unlockFlag: null },
  road: { label: 'Lion\'s Way', unlockFlag: 'leftCandlekeep' },
  friendlyArm: { label: 'Friendly Arm Inn', unlockFlag: 'leftCandlekeep' },
  beregost: { label: 'Beregost', unlockFlag: 'leftCandlekeep' },
  nashkel: { label: 'Nashkel', unlockFlag: 'metJaheira' },
};

export const npcScripts = {
  firebead: {
    name: 'Firebead Elvenhair',
    portrait: 'Scholar of Candlekeep',
    lines: (state) => ({
      text: state.flags.firebeadMet
        ? 'The roads beyond these walls are harsher than any tome. Keep your wits sharp.'
        : 'A traveler should carry more than steel. Take this note, and remember that knowledge is also a weapon.',
      choices: [
        {
          id: 'firebead-lore',
          label: 'Ask about the Sword Coast',
          effect: (game) => {
            game.addJournal('Firebead described the iron crisis spreading across the Coast and urged caution.');
            game.state.flags.firebeadMet = true;
            game.log('Firebead shares rumors of failing iron and troubled roads.');
          },
        },
        { id: 'firebead-close', label: 'Take your leave', close: true },
      ],
    }),
  },
  imoen: {
    name: 'Imoen',
    portrait: 'Quick-Fingered Friend',
    lines: (state) => ({
      text: state.party.some((member) => member.id === 'imoen')
        ? 'You know I\'m sticking with you. Someone has to keep this gloomy trip lively.'
        : 'If Gorion is sending you away, I\'m not letting you wander the Coast alone.',
      choices: [
        {
          id: 'recruit-imoen',
          label: state.party.some((member) => member.id === 'imoen') ? 'Imoen is already in the party' : 'Recruit Imoen',
          disabled: state.party.some((member) => member.id === 'imoen'),
          effect: (game) => {
            game.recruitCompanion({ id: 'imoen', name: 'Imoen', role: 'Thief', hp: 18, maxHp: 18 });
            game.addJournal('Imoen insisted on joining the journey beyond Candlekeep.');
          },
        },
        { id: 'imoen-close', label: 'Not now', close: true },
      ],
    }),
  },
  gorion: {
    name: 'Gorion',
    portrait: 'Harried Mentor',
    lines: () => ({
      text: 'There is no time for argument. Take what courage you can and prepare to leave Candlekeep with me at once.',
      choices: [
        {
          id: 'leave-candlekeep',
          label: 'Leave Candlekeep',
          effect: (game) => {
            game.state.flags.leftCandlekeep = true;
            game.advanceTime(2);
            game.state.chapter = 'road';
            game.setArea('road');
            game.addJournal('Gorion led the way from Candlekeep. The journey ended in a deadly ambush.');
            game.log('The ambush on the Lion\'s Way leaves the ward alone on the road.');
          },
          close: true,
        },
      ],
    }),
  },
  jaheira: {
    name: 'Jaheira',
    portrait: 'Harper Operative',
    lines: (state) => ({
      text: state.flags.metJaheira
        ? 'The iron crisis deepens. Nashkel must be investigated before panic spreads further.'
        : 'Gorion was our friend. We will honor him, but first we must understand who benefits from this iron crisis.',
      choices: [
        {
          id: 'recruit-jaheira',
          label: state.party.some((member) => member.id === 'jaheira') ? 'Jaheira is already in the party' : 'Ask Jaheira and Khalid to join',
          disabled: state.party.some((member) => member.id === 'jaheira'),
          effect: (game) => {
            game.recruitCompanion({ id: 'jaheira', name: 'Jaheira', role: 'Fighter/Druid', hp: 24, maxHp: 24 });
            game.recruitCompanion({ id: 'khalid', name: 'Khalid', role: 'Fighter', hp: 22, maxHp: 22 });
            game.state.flags.metJaheira = true;
            game.discover('nashkel');
            game.addJournal('Jaheira and Khalid urged an investigation into Nashkel and the troubled mines.');
          },
        },
        {
          id: 'jaheira-rumor',
          label: 'Ask about the iron crisis',
          effect: (game) => {
            game.state.flags.metJaheira = true;
            game.discover('nashkel');
            game.addJournal('Jaheira believes the troubles in Nashkel will reveal who is behind the iron crisis.');
          },
        },
        { id: 'jaheira-close', label: 'Enough for now', close: true },
      ],
    }),
  },
  bentley: {
    name: 'Bentley Mirrorshade',
    portrait: 'Innkeeper and Merchant',
    lines: () => ({
      text: 'Supplies, rooms, and a strong wall between you and the road. The Friendly Arm can provide all three.',
      choices: [
        {
          id: 'bentley-store',
          label: 'Browse wares',
          effect: (game) => {
            game.openServices('friendlyArm');
          },
          close: true,
        },
        {
          id: 'bentley-rumor',
          label: 'Ask for local rumors',
          effect: (game) => {
            game.addJournal('Bentley warned that assassins and frightened merchants are only the first signs of wider trouble.');
            game.log('Bentley notes that the iron crisis is hurting trade across the Coast.');
          },
        },
        { id: 'bentley-close', label: 'Leave', close: true },
      ],
    }),
  },
  marl: {
    name: 'Marl',
    portrait: 'Sour Drunk',
    lines: () => ({
      text: 'Nothing good comes from heroes and prophecy. Leave me to my cup unless you can offer kinder words.',
      choices: [
        {
          id: 'marl-calm',
          label: 'Try to calm him',
          effect: (game) => {
            game.state.reputation += 1;
            game.addJournal('A quiet word settled Marl\'s anger in Beregost.');
          },
          close: true,
        },
        {
          id: 'marl-taunt',
          label: 'Taunt him',
          effect: (game) => {
            game.state.reputation -= 1;
            game.log('The room sours as Marl lashes out at the party.');
          },
          close: true,
        },
      ],
    }),
  },
  garrick: {
    name: 'Garrick',
    portrait: 'Young Bard',
    lines: () => ({
      text: 'Beregost has stories in every doorway, but not all of them end in song.',
      choices: [
        {
          id: 'garrick-rumor',
          label: 'Ask for a rumor',
          effect: (game) => {
            game.addJournal('Garrick warned that trouble gathers on the roads south of Beregost.');
            game.log('A bard\'s rumor points the party onward toward Nashkel.');
          },
        },
        { id: 'garrick-close', label: 'Move on', close: true },
      ],
    }),
  },
  berrun: {
    name: 'Berrun Ghastkill',
    portrait: 'Nashkel Mayor',
    lines: (state) => ({
      text: state.flags.mineCleared
        ? 'You have done Nashkel a great service. Word of your victory will spread.'
        : 'The mines are overrun and the ore is tainted. If you can clear them, the town may yet survive this panic.',
      choices: [
        {
          id: 'berrun-quest',
          label: state.flags.mineCleared ? 'Report success' : 'Accept the mine assignment',
          effect: (game) => {
            if (game.state.flags.mineCleared) {
              game.state.chapter = 'nashkel-cleared';
              game.addCompletedQuest('Clear the Nashkel Mines');
              game.discover('friendlyArm');
              game.log('Berrun confirms that the mine victory changes the course of the crisis.');
            } else {
              game.state.flags.mineQuestAccepted = true;
              game.addJournal('Berrun Ghastkill asked the party to investigate and clear the Nashkel Mines.');
            }
          },
          close: true,
        },
        { id: 'berrun-close', label: 'Leave', close: true },
      ],
    }),
  },
  minsc: {
    name: 'Minsc',
    portrait: 'Rashemi Ranger',
    lines: (state) => ({
      text: state.party.some((member) => member.id === 'minsc')
        ? 'Evil has many dens, but Boo and I are ready.'
        : 'My witch Dynaheir needs rescue, and villains deserve a righteous boot besides.',
      choices: [
        {
          id: 'recruit-minsc',
          label: state.party.some((member) => member.id === 'minsc') ? 'Minsc is already in the party' : 'Recruit Minsc',
          disabled: state.party.some((member) => member.id === 'minsc'),
          effect: (game) => {
            game.recruitCompanion({ id: 'minsc', name: 'Minsc', role: 'Ranger', hp: 30, maxHp: 30 });
            game.addJournal('Minsc joined the party and pressed for swift action in the south.');
          },
        },
        { id: 'minsc-close', label: 'Later', close: true },
      ],
    }),
  },
  'nashkel-store': {
    name: 'Nashkel Quartermaster',
    portrait: 'Temple and Supply Clerk',
    lines: () => ({
      text: 'The town still has salves, bandages, and a few useful tools, if you have coin enough to spare.',
      choices: [
        {
          id: 'nashkel-services',
          label: 'Request supplies or healing',
          effect: (game) => {
            game.openServices('nashkel');
          },
          close: true,
        },
        { id: 'nashkel-close', label: 'Leave', close: true },
      ],
    }),
  },
};

export const encounters = {
  tarnesh: {
    id: 'tarnesh',
    name: 'Tarnesh',
    hp: 26,
    attack: [4, 8],
    spell: { label: 'Magic Missile', damage: [5, 9] },
    rewardJournal: 'The assassin Tarnesh fell at the walls of the Friendly Arm Inn.',
  },
  mines: {
    id: 'mines',
    name: 'Mulahey\'s Vanguard',
    hp: 34,
    attack: [5, 10],
    spell: { label: 'Dark Blessing', damage: [4, 7] },
    rewardJournal: 'The first hostile force within the Nashkel Mines has been broken. The deeper corruption is now visible.',
  },
};

export const starterInventory = [
  {
    id: 'longsword',
    name: 'Longsword',
    type: 'weapon',
    slot: 'weapon',
    attackBonus: 2,
    allowedClasses: ['Fighter', 'Ranger', 'Thief'],
    price: 45,
  },
  {
    id: 'travel-cloak',
    name: 'Travel Cloak',
    type: 'armor',
    slot: 'armor',
    defenseBonus: 1,
    allowedClasses: ['Fighter', 'Mage', 'Cleric', 'Ranger', 'Thief'],
    price: 20,
  },
  {
    id: 'healing-potion',
    name: 'Healing Potion',
    type: 'consumable',
    healing: 8,
    price: 30,
  },
];

export const servicesByArea = {
  friendlyArm: {
    title: 'Friendly Arm Services',
    lodgingCost: 10,
    donationCost: 15,
    healCost: 18,
    storeInventory: [
      {
        id: 'shortbow',
        name: 'Shortbow',
        type: 'weapon',
        slot: 'weapon',
        attackBonus: 1,
        allowedClasses: ['Fighter', 'Ranger', 'Thief'],
        price: 35,
      },
      {
        id: 'chain-shirt',
        name: 'Chain Shirt',
        type: 'armor',
        slot: 'armor',
        defenseBonus: 2,
        allowedClasses: ['Fighter', 'Ranger', 'Cleric'],
        price: 55,
      },
      {
        id: 'healing-potion-stock',
        name: 'Healing Potion',
        type: 'consumable',
        healing: 8,
        price: 30,
      },
    ],
  },
  nashkel: {
    title: 'Nashkel Supplies and Healing',
    lodgingCost: 8,
    donationCost: 12,
    healCost: 16,
    storeInventory: [
      {
        id: 'warhammer',
        name: 'War Hammer',
        type: 'weapon',
        slot: 'weapon',
        attackBonus: 2,
        allowedClasses: ['Fighter', 'Cleric'],
        price: 50,
      },
      {
        id: 'traveler-boots',
        name: 'Traveler Boots',
        type: 'trinket',
        slot: 'trinket',
        defenseBonus: 1,
        allowedClasses: ['Fighter', 'Mage', 'Cleric', 'Ranger', 'Thief'],
        price: 22,
      },
      {
        id: 'healing-potion-nashkel',
        name: 'Healing Potion',
        type: 'consumable',
        healing: 8,
        price: 30,
      },
    ],
  },
};