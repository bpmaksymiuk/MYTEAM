// DI-015 — Audio manager facade
import StorageManager from './StorageManager.js';

export default class AudioManager {
  static init(scene) {
    AudioManager.scene = scene;
    AudioManager.music = null;
    const save = StorageManager.load();
    AudioManager.muted = Boolean(save.audioMuted);
    scene.sound.setMute(AudioManager.muted);
  }

  static bindScene(scene) {
    AudioManager.scene = scene;
    if (typeof AudioManager.muted === 'boolean') {
      scene.sound.setMute(AudioManager.muted);
    }
  }

  static playBgm(scene, key) {
    const s = scene || AudioManager.scene;
    if (!s) return;
    AudioManager.bindScene(s);
    if (AudioManager.muted) return;
    if (AudioManager.music) {
      AudioManager.music.stop();
      AudioManager.music.destroy();
    }
    AudioManager.music = s.sound.add(key, { loop: true, volume: 0.5 });
    AudioManager.music.play();
  }

  static stopBgm() {
    if (AudioManager.music) {
      AudioManager.music.stop();
      AudioManager.music.destroy();
      AudioManager.music = null;
    }
  }

  static playSfx(scene, key) {
    const s = scene || AudioManager.scene;
    if (!s || AudioManager.muted) return;
    s.sound.play(key, { volume: 0.7 });
  }

  static toggleMute(scene) {
    const s = scene || AudioManager.scene;
    if (!s) return AudioManager.muted;
    AudioManager.bindScene(s);
    AudioManager.muted = !AudioManager.muted;
    s.sound.setMute(AudioManager.muted);
    StorageManager.update({ audioMuted: AudioManager.muted });
    if (AudioManager.muted) {
      AudioManager.stopBgm();
    }
    return AudioManager.muted;
  }
}
