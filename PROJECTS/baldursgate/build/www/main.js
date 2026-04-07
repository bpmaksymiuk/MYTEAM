// DI-002: Entry Point — coordinates loading and starts game loop
'use strict';

import { StateManager }   from './StateManager.js';
import { SettingsManager } from './engine/SettingsManager.js';
import { AudioManager }   from './engine/AudioManager.js';
import { AssetLoader }    from './engine/AssetLoader.js';
import SaveManager        from './engine/SaveManager.js';
import { MainMenuState }  from './states/MainMenuState.js';

const canvas = document.getElementById('game-canvas');

function resizeCanvas() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', () => {
  resizeCanvas();
  StateManager.onResize();
});

StateManager.init(canvas);

async function bootstrap() {
  // 1. Load all JSON data in parallel
  const jsonFiles = ['races','classes','spells','items','areas','dialogue','quests','companions','encounters'];
  const fetches = jsonFiles.map(name =>
    fetch(`data/${name}.json`).then(r => {
      if (!r.ok) throw new Error(`Failed to load data/${name}.json`);
      return r.json();
    })
  );
  const results = await Promise.all(fetches);
  window.GameData = Object.freeze(
    Object.fromEntries(jsonFiles.map((name, i) => [name, results[i]]))
  );

  // 2. Initialise singletons
  SettingsManager.init();
  AudioManager.init();
  await SaveManager.init?.();

  // 3. Load assets (with progress)
  let loadPct = 0;
  const ctx = StateManager.ctx;
  await AssetLoader.load(pct => {
    loadPct = pct;
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#c8960c';
      ctx.font = '18px Georgia';
      ctx.textAlign = 'center';
      ctx.fillText(`Loading… ${Math.round(pct * 100)}%`, canvas.width / 2, canvas.height / 2);
      const barW = 300, barH = 10;
      const bx = (canvas.width - barW) / 2, by = canvas.height / 2 + 20;
      ctx.strokeStyle = '#5a4a20';
      ctx.strokeRect(bx, by, barW, barH);
      ctx.fillStyle = '#c8960c';
      ctx.fillRect(bx, by, barW * pct, barH);
    }
  });

  // 4. Bootstrap to main menu
  StateManager.setState(new MainMenuState());

  // 5. Start game loop
  let prev = 0;
  function tick(timestamp) {
    const dt = Math.min((timestamp - prev) / 1000, 0.1);
    prev = timestamp;
    StateManager.update(dt);
    StateManager.render();
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(ts => { prev = ts; requestAnimationFrame(tick); });
}

bootstrap().catch(err => {
  console.error('Bootstrap failed:', err);
  const ctx = StateManager.ctx;
  if (ctx) {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#b03030';
    ctx.font = '16px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('Failed to start: ' + err.message, canvas.width / 2, canvas.height / 2);
  }
});
