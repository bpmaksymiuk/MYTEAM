import { Howl, Howler } from 'howler';

type SoundKey = 'ambient' | 'feed' | 'bubble';

export class AudioManager {
  private static _instance: AudioManager;
  private sounds: Map<SoundKey, Howl> = new Map();
  private ready = false;
  private enabled = false;

  private constructor() {
    Howler.autoUnlock = false;
  }

  static instance(): AudioManager {
    if (!AudioManager._instance) AudioManager._instance = new AudioManager();
    return AudioManager._instance;
  }

  init(): void {
    if (this.ready) return;
    this.ready = true;
    this.sounds.set('ambient', new Howl({ src: ['/audio/ambient.mp3', '/audio/ambient.ogg'], loop: true, volume: 0.35 }));
    this.sounds.set('feed',    new Howl({ src: ['/audio/feed.mp3',    '/audio/feed.ogg'],    loop: false, volume: 0.6  }));
    this.sounds.set('bubble',  new Howl({ src: ['/audio/bubble.mp3',  '/audio/bubble.ogg'],  loop: false, volume: 0.25 }));
    this.setEnabled(this.enabled);
  }

  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
    if (!this.ready) return;
    if (enabled) {
      this.sounds.get('ambient')?.play();
    } else {
      this.sounds.get('ambient')?.pause();
    }
  }

  play(key: SoundKey): void {
    if (!this.ready || !this.enabled) return;
    this.sounds.get(key)?.play();
  }
}
