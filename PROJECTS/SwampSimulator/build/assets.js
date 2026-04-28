// PT-019 / DI-020 — asset preloader and registry
import { SPRITE_MANIFEST } from './sprites/manifest.js';

export const ASSETS = {
  sprites: new Map(),    // speciesId -> { img, meta }
  portraits: new Map(),  // speciesId -> Image
  icons: new Map(),      // iconId -> Image
};

function loadImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Asset failed: ' + url));
    img.src = url;
  });
}

const UI_ICONS = [
  'nav-canvas','nav-foodweb','nav-dashboard','nav-intervention','nav-scenarios','nav-saveload',
  'time-pause','time-play','time-x1','time-x5','time-x30','time-skip',
  'overlay-foodweb','overlay-nutrient','overlay-oxygen','overlay-density',
  'event-drought','event-flood','event-pollution','event-fire','event-runoff','event-coldsnap',
  'scenario-alligator-removed','scenario-mosquito-explosion','scenario-algae-bloom','scenario-beaver-dam','scenario-drought-year',
];

export async function loadAssets({ onProgress } = {}) {
  const tasks = [];
  // sprite-sheets
  for (const [sid, meta] of Object.entries(SPRITE_MANIFEST)) {
    tasks.push(loadImage(meta.url).then(img => ASSETS.sprites.set(sid, { img, meta })));
    // Plant sprite-sheets (sid prefixed with 'plant-') have no portrait SVG
    if (!sid.startsWith('plant-')) {
      tasks.push(loadImage(`./images/portraits/${sid}.svg`).then(img => ASSETS.portraits.set(sid, img)));
    }
  }
  for (const id of UI_ICONS) {
    tasks.push(loadImage(`./images/ui/${id}.svg`).then(img => ASSETS.icons.set(id, img)));
  }
  let done = 0; const total = tasks.length;
  await Promise.all(tasks.map(p => p.then(v => { done++; onProgress?.(done, total); return v; })));
  return ASSETS;
}

export function getSprite(id)   { return ASSETS.sprites.get(id); }
export function getPortrait(id) { return ASSETS.portraits.get(id); }
export function getIcon(id)     { return ASSETS.icons.get(id); }
