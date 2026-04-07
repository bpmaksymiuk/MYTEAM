// DI-018: Quest Engine — flag-driven quest state manager
'use strict';

const QuestEngine = {
  active: {},     // questId → { ...questDef, objectivesDone: Set }
  completed: [],
  failed: [],
  _party: null,

  init(party) {
    this._party = party;
    this.active = {};
    this.completed = [];
    this.failed = [];
  },

  startQuest(questId) {
    if (this.active[questId] || this.completed.includes(questId)) return;
    const def = window.GameData?.quests?.find(q => q.id === questId);
    if (!def) return;
    this.active[questId] = { ...def, objectivesDone: new Set() };
  },

  failQuest(questId) {
    if (!this.active[questId]) return;
    delete this.active[questId];
    if (!this.failed.includes(questId)) this.failed.push(questId);
  },

  /**
   * Mark an objective done. If all objectives done, complete the quest.
   */
  setFlag(questId, objectiveId) {
    const q = this.active[questId];
    if (!q) return;
    q.objectivesDone.add(objectiveId);
    const allDone = q.objectives.every(o => q.objectivesDone.has(o.id));
    if (allDone) this._completeQuest(questId);
  },

  _completeQuest(questId) {
    const q = this.active[questId];
    if (!q) return;
    delete this.active[questId];
    if (!this.completed.includes(questId)) this.completed.push(questId);
    // Award XP
    if (this._party && q.xpReward) {
      for (const member of this._party) {
        member.xp = (member.xp || 0) + q.xpReward;
      }
    }
  },

  /**
   * Returns data structure for journal rendering.
   */
  getJournalData() {
    const mapQuest = (questId, src) => {
      const def = window.GameData?.quests?.find(q => q.id === questId) || {};
      const objectivesDone = src?.objectivesDone || new Set();
      return {
        id: questId,
        title: def.title || questId,
        description: def.description || '',
        objectives: (def.objectives || []).map(o => ({
          text: o.text,
          done: objectivesDone.has(o.id),
        })),
      };
    };

    return {
      active:    Object.keys(this.active).map(id => mapQuest(id, this.active[id])),
      completed: this.completed.map(id => mapQuest(id, null)),
      failed:    this.failed.map(id => mapQuest(id, null)),
    };
  },

  serialise() {
    return {
      active: Object.fromEntries(
        Object.entries(this.active).map(([id, q]) => [id, { objectivesDone: [...q.objectivesDone] }])
      ),
      completed: [...this.completed],
      failed: [...this.failed],
    };
  },

  deserialise(data) {
    this.completed = data.completed || [];
    this.failed = data.failed || [];
    this.active = {};
    for (const [id, state] of Object.entries(data.active || {})) {
      const def = window.GameData?.quests?.find(q => q.id === id);
      if (def) this.active[id] = { ...def, objectivesDone: new Set(state.objectivesDone) };
    }
  },
};

export default QuestEngine;
