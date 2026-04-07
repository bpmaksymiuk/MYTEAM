// DI-026: Asset Loader — loads images and audio with fallbacks
'use strict';

// Inline 1×1 transparent PNG data URL used as image fallback
const FALLBACK_PNG = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

// Manifest of known assets: { key, type: 'image'|'audio', url }
const MANIFEST = [
  { key: 'bg_mainmenu',    type: 'image', url: 'assets/areas/mainmenu.png'       },
  { key: 'bg_candlekeep',  type: 'image', url: 'assets/areas/candlekeep.png'     },
  { key: 'bg_sword_coast', type: 'image', url: 'assets/areas/sword_coast.png'    },
  { key: 'bg_world_map',   type: 'image', url: 'assets/areas/world_map.png'      },
  { key: 'music_menu',     type: 'audio', url: 'assets/audio/menu.ogg'           },
  { key: 'music_explore',  type: 'audio', url: 'assets/audio/explore.ogg'        },
  { key: 'music_combat',   type: 'audio', url: 'assets/audio/combat.ogg'         },
  { key: 'sfx_sword',      type: 'audio', url: 'assets/audio/sword.ogg'          },
  { key: 'sfx_spell',      type: 'audio', url: 'assets/audio/spell.ogg'          },
  { key: 'sfx_click',      type: 'audio', url: 'assets/audio/click.ogg'          },
];

// Shared AudioContext — must be set by AudioManager before load() is called
let _audioCtx = null;

export const AssetLoader = {
  store: {},

  setAudioContext(ctx) {
    _audioCtx = ctx;
  },

  async load(onProgress) {
    const total = MANIFEST.length;
    let loaded = 0;

    const tasks = MANIFEST.map(async ({ key, type, url }) => {
      try {
        if (type === 'image') {
          this.store[key] = await this._loadImage(url);
        } else if (type === 'audio') {
          this.store[key] = await this._loadAudio(url);
        }
      } catch (err) {
        console.warn(`AssetLoader: failed to load '${url}', using fallback.`, err);
        this.store[key] = type === 'image'
          ? await this._loadImage(FALLBACK_PNG)
          : this._silentBuffer();
      }
      loaded++;
      onProgress?.(loaded / total);
    });

    await Promise.all(tasks);
  },

  get(key) {
    if (!(key in this.store)) throw new Error(`AssetLoader: unknown key '${key}'`);
    return this.store[key];
  },

  _loadImage(url) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload  = () => resolve(img);
      img.onerror = () => reject(new Error(`img load failed: ${url}`));
      img.src = url;
    });
  },

  async _loadAudio(url) {
    if (!_audioCtx) return this._silentBuffer();
    const resp = await fetch(url);
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const ab = await resp.arrayBuffer();
    return _audioCtx.decodeAudioData(ab);
  },

  _silentBuffer() {
    if (!_audioCtx) return null;
    const buf = _audioCtx.createBuffer(1, 1, 22050);
    return buf;
  },
};

export default AssetLoader;
