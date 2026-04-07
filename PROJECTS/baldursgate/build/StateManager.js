// DI-003: State Manager — top-level finite state machine
'use strict';

export const StateManager = {
  current: null,
  ctx: null,
  canvas: null,

  init(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
  },

  setState(newState) {
    this.current?.exit?.();
    this.current = newState;
    newState.enter?.();
  },

  update(dt) {
    this.current?.update?.(dt);
  },

  render() {
    this.current?.render?.(this.ctx);
  },

  onResize() {
    this.current?.onResize?.();
  },
};
