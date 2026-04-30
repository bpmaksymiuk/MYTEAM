// DI-002 — Game configuration constants
// All physics, scoring, and gameplay tuning values live here.

export const PHYSICS = {
  GRAVITY: 500,          // px/sec²
  JUMP_VY: -350,         // initial jump Y velocity px/sec
  CUT_GRAVITY: 2.5,      // multiplier applied to gravity when jump key released early (DI-007)
  MAX_SPEED_X: 200,      // horizontal run cap px/sec
  WALK_ACCEL: 600,       // horizontal acceleration px/sec²
  WALK_DRAG: 800,        // horizontal drag (decel) px/sec²
  ENEMY_SPEED: 80,       // base patrol speed px/sec
  SHELL_SPEED: 280,      // koopa shell slide speed px/sec
};

export const GAME = {
  WIDTH: 800,
  HEIGHT: 480,
  TILE_SIZE: 32,
  LIVES_START: 3,
  TIME_START: 300,       // seconds per level
  TIME_BONUS_MULT: 10,   // score per time-remaining second at level end
};

export const POINTS = {
  COIN: 200,
  POWER_UP: 50,
  MUSHROOM: 1000,
  FIRE_FLOWER: 1000,
  STAR: 1000,
  ONE_UP: 0,             // no points, grants extra life
  STOMP_GOOMBA: 100,
  STOMP_KOOPA: 100,
  SHELL_KILL: 500,
  TIME_BONUS: 10,        // per remaining second
};

export const LEVELS = {
  COUNT: 8,
  KEYS: ['level-01','level-02','level-03','level-04','level-05','level-06','level-07','level-08'],
  TILESET_NAME: 'tiles',
  LAYER_GROUND: 'Ground',
  LAYER_OBJECTS: 'Objects',
};

export const STORAGE_KEY = 'smb-save';
