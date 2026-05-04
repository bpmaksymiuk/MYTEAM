import { AppState } from '@/state/AppState';
import { AudioManager } from '@/audio/AudioManager';
import { SPECIES } from '@/fish/FishSpecies';

export class HUD {
  private root: HTMLElement;

  constructor(root: HTMLElement) {
    this.root = root;
    this._build();
  }

  private _build(): void {
    const state = AppState.instance();
    this.root.setAttribute('aria-label', 'Tank Controls');

    this.root.innerHTML = `
      <div id="controls-panel">
        <h2>Tank Controls</h2>

        <section id="camera-section">
          <button id="btn-iso" aria-pressed="true">Isometric View</button>
          <button id="btn-34"  aria-pressed="false">3/4 View</button>
        </section>

        <section id="substrate-section">
          <label for="substrate-select">Substrate</label>
          <select id="substrate-select">
            <option value="sand">Sand</option>
            <option value="gravel">Gravel</option>
            <option value="rock">Rock</option>
          </select>
        </section>

        <section id="decoration-section">
          <label>Decorations</label>
          <label><input type="checkbox" id="deco-shipwreck" checked /> Shipwreck</label>
          <label><input type="checkbox" id="deco-rocks" /> Rocks</label>
          <label><input type="checkbox" id="deco-artifacts" checked /> Artifacts</label>
        </section>

        <section id="population-section">
          <label for="pop-input">Fish Count <span id="pop-value">10</span></label>
          <input type="range" id="pop-input" min="1" max="20" value="10" />
        </section>

        <section id="audio-section">
          <button id="btn-audio">Sound Off</button>
        </section>
        <section id="window-section">
          <button id="btn-window-mode" aria-label="Switch to window view">Window</button>
        </section>

        <section id="bubbler-section">
          <label for="bubbler-input">Bubbler Rate <span id="bubbler-value">60</span></label>
          <input type="range" id="bubbler-input" min="30" max="200" value="60" />
        </section>
      </div>
      <div id="selection-card" hidden>
        <p id="selection-title"></p>
        <p id="selection-desc"></p>
      </div>
    `;

    // Camera
    this.root.querySelector('#btn-iso')!.addEventListener('click', () => {
      state.set('cameraMode', 'isometric');
      (this.root.querySelector('#btn-iso') as HTMLButtonElement).setAttribute('aria-pressed', 'true');
      (this.root.querySelector('#btn-34') as HTMLButtonElement).setAttribute('aria-pressed', 'false');
    });
    this.root.querySelector('#btn-34')!.addEventListener('click', () => {
      state.set('cameraMode', '3/4');
      (this.root.querySelector('#btn-iso') as HTMLButtonElement).setAttribute('aria-pressed', 'false');
      (this.root.querySelector('#btn-34') as HTMLButtonElement).setAttribute('aria-pressed', 'true');
    });

    // Substrate
    (this.root.querySelector('#substrate-select') as HTMLSelectElement).addEventListener('change', e => {
      state.set('substrateType', (e.target as HTMLSelectElement).value as 'sand' | 'gravel' | 'rock');
    });

    // Decorations
    (['shipwreck', 'rocks', 'artifacts'] as const).forEach(key => {
      const el = this.root.querySelector(`#deco-${key}`) as HTMLInputElement;
      el.addEventListener('change', () => {
        state.set('decorations', { ...state.get('decorations'), [key]: el.checked });
      });
    });

    // Population
    const popInput = this.root.querySelector('#pop-input') as HTMLInputElement;
    const popValue = this.root.querySelector('#pop-value') as HTMLElement;
    popInput.addEventListener('input', () => {
      const v = parseInt(popInput.value, 10);
      popValue.textContent = String(v);
      state.set('populationCount', v);
    });

    // Audio
    const audioBtn = this.root.querySelector('#btn-audio') as HTMLButtonElement;
    audioBtn.addEventListener('click', () => {
      const enabled = !state.get('audioEnabled');
      state.set('audioEnabled', enabled);
      audioBtn.textContent = enabled ? 'Sound On' : 'Sound Off';
      AudioManager.instance().setEnabled(enabled);
    });

    // Front window mode
    const windowBtn = this.root.querySelector('#btn-window-mode') as HTMLButtonElement;
    windowBtn.addEventListener('click', () => {
      state.set('frontWindowMode', true);
    });

    // Bubbler rate
    const bubblerInput = this.root.querySelector('#bubbler-input') as HTMLInputElement;
    const bubblerValue = this.root.querySelector('#bubbler-value') as HTMLElement;
    bubblerInput.addEventListener('input', () => {
      const v = parseInt(bubblerInput.value, 10);
      bubblerValue.textContent = String(v);
      state.set('bubblerRate', v);
    });
  }

  showSelectionCard(type: 'fish' | 'decoration', id: string): void {
    const card = this.root.querySelector('#selection-card') as HTMLElement;
    const titleEl = this.root.querySelector('#selection-title') as HTMLElement;
    const descEl = this.root.querySelector('#selection-desc') as HTMLElement;
    if (type === 'fish' && SPECIES[id]) {
      titleEl.textContent = SPECIES[id].displayName;
      descEl.textContent = '';
    }
    card.hidden = false;
  }
}
