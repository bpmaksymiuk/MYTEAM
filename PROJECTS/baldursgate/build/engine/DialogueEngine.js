// DI-017: Dialogue Engine — dialogue tree runner
'use strict';

import QuestEngine from './QuestEngine.js';

const DialogueEngine = {
  tree: null,
  current: null,
  worldState: null,
  _party: null,

  init(tree) {
    this.tree = tree;
  },

  /**
   * Begin a dialogue tree from a node id.
   * Returns the first node (or null if not found).
   */
  startDialogue(nodeId, worldState, party) {
    this.worldState = worldState;
    this._party = party;
    const node = this.tree[nodeId];
    if (!node) return null;
    this.current = { ...node, id: nodeId };
    // Filter responses by condition
    this.current = this._filterResponses(this.current);
    return this.current;
  },

  /**
   * Select a response by index. Executes outcomes, returns next node or null.
   */
  selectResponse(index) {
    if (!this.current) return null;
    const response = this.current.responses[index];
    if (!response) return null;

    // Execute outcomes
    for (const outcome of (response.outcomes || [])) {
      this._executeOutcome(outcome);
    }

    if (response.nextNode) {
      return this.startDialogue(response.nextNode, this.worldState, this._party);
    }
    this.current = null;
    return null;
  },

  _filterResponses(node) {
    const filtered = node.responses.filter(r =>
      !r.condition || this.evaluateCondition(r.condition)
    );
    return { ...node, responses: filtered };
  },

  /**
   * Evaluate a condition against worldState.
   * condition: { flag, op, value }
   */
  evaluateCondition(condition) {
    if (!condition) return true;
    const stateVal = this.worldState[condition.flag];
    switch (condition.op) {
      case '==': return stateVal == condition.value;
      case '!=': return stateVal != condition.value;
      case '>':  return stateVal > condition.value;
      case '<':  return stateVal < condition.value;
      default:   return !!stateVal;
    }
  },

  _executeOutcome(outcome) {
    switch (outcome.type) {
      case 'setFlag':
        this.worldState[outcome.key] = outcome.value;
        break;
      case 'startQuest':
        QuestEngine.startQuest(outcome.questId);
        break;
      case 'updateObjective':
        QuestEngine.setFlag(outcome.questId, outcome.objectiveId);
        break;
      case 'completeQuest':
        QuestEngine.setFlag(outcome.questId, '__complete__');
        break;
      case 'giveItem':
        if (this._party && this._party.length > 0) {
          const leader = this._party[0];
          const itemDef = window.GameData?.items?.find(i => i.id === outcome.itemId);
          if (itemDef) leader.inventory.push({ ...itemDef, identified: true });
        }
        break;
      case 'removeItem':
        if (this._party) {
          for (const member of this._party) {
            const idx = member.inventory.findIndex(i => i.id === outcome.itemId);
            if (idx !== -1) { member.inventory.splice(idx, 1); break; }
          }
        }
        break;
      case 'adjustReputation':
        if (this.worldState.__reputation !== undefined) {
          this.worldState.__reputation = Math.max(1, Math.min(20, this.worldState.__reputation + outcome.delta));
        }
        break;
      case 'triggerCombat':
        // Sentinel picked up by DialogueState
        this._pendingCombat = outcome.groupId;
        break;
      case 'openShop':
        this._pendingShop = outcome.shopId;
        break;
      case 'recruitCompanion':
        this._pendingRecruit = outcome.companionId;
        break;
    }
  },
};

export default DialogueEngine;
