// DI-015: Options State — volume sliders, difficulty, subtitles, scroll speed
'use strict';

import { SettingsManager } from '../../engine/SettingsManager.js';
import { AudioManager }    from '../../engine/AudioManager.js';

export class OptionsState {
  constructor(playing, onClose) {
    this._playing = playing;
    this._onClose = onClose || null;
    this.panel = null;
  }

  enter() {
    this.panel = document.createElement('div');
    this.panel.id = 'options-panel';
    Object.assign(this.panel.style, {
      position: 'absolute', top: '50%', left: '50%',
      transform: 'translate(-50%,-50%)',
      width: '480px', background: 'var(--bg-panel)',
      border: '2px solid var(--border)', borderRadius: '6px',
      padding: '24px', zIndex: '100', pointerEvents: 'auto',
    });
    document.getElementById('ui-layer').appendChild(this.panel);
    document.getElementById('ui-layer').classList.add('active');
    this._render();
  }

  exit() {
    this.panel?.remove(); this.panel = null;
    if (!this._playing) {
      document.getElementById('ui-layer').classList.remove('active');
    }
  }

  update(_dt) {}
  render(_ctx) {}

  _render() {
    const p = this.panel;
    p.innerHTML = '';

    const hdr = document.createElement('h2');
    hdr.textContent = 'Options';
    Object.assign(hdr.style, { margin: '0 0 20px', color: 'var(--accent)' });
    p.appendChild(hdr);

    // Volume sliders
    [
      { label: 'Master Volume', key: 'masterVolume', fn: v => AudioManager.setMasterVolume(v/100) },
      { label: 'Music Volume',  key: 'musicVolume',  fn: v => AudioManager.setMusicVolume(v/100)  },
      { label: 'SFX Volume',    key: 'sfxVolume',    fn: v => AudioManager.setSfxVolume(v/100)    },
    ].forEach(({ label, key, fn }) => {
      const row = document.createElement('div');
      row.className = 'slider-row';

      const lbl = document.createElement('label');
      lbl.textContent = label;

      const slider = document.createElement('input');
      slider.type = 'range'; slider.min = '0'; slider.max = '100';
      slider.value = String(SettingsManager.get(key) ?? 80);

      const valSpan = document.createElement('span');
      valSpan.className = 'slider-val';
      valSpan.textContent = slider.value;

      slider.addEventListener('input', () => {
        const v = Number(slider.value);
        valSpan.textContent = String(v);
        fn(v);
        SettingsManager.set(key, v);
      });

      row.appendChild(lbl); row.appendChild(slider); row.appendChild(valSpan);
      p.appendChild(row);
    });

    const sep = () => { const hr = document.createElement('hr');
      hr.style.borderColor = 'var(--border)'; hr.style.margin = '16px 0'; p.appendChild(hr); };
    sep();

    // Difficulty
    const diffRow = document.createElement('div');
    diffRow.style.display = 'flex'; diffRow.style.alignItems = 'center'; diffRow.style.gap = '12px';
    diffRow.style.marginBottom = '12px';

    const diffLbl = document.createElement('label');
    diffLbl.textContent = 'Difficulty:';
    diffLbl.style.width = '140px'; diffLbl.style.textAlign = 'right';
    diffLbl.style.color = 'var(--text-dim)';

    const diffSel = document.createElement('select');
    Object.assign(diffSel.style, {
      background: '#0a0805', border: '1px solid var(--border)',
      color: 'var(--text-primary)', padding: '4px 8px', borderRadius: '3px',
      fontFamily: 'Georgia,serif',
    });
    ['Easy','Normal','Hard','Insane'].forEach(d => {
      const opt = document.createElement('option');
      opt.value = d; opt.textContent = d;
      opt.selected = SettingsManager.get('difficulty') === d;
      diffSel.appendChild(opt);
    });
    diffSel.addEventListener('change', () => SettingsManager.set('difficulty', diffSel.value));

    diffRow.appendChild(diffLbl); diffRow.appendChild(diffSel);
    p.appendChild(diffRow);

    // Subtitles
    const subRow = document.createElement('div');
    subRow.style.display = 'flex'; subRow.style.alignItems = 'center'; subRow.style.gap = '12px';
    subRow.style.marginBottom = '12px';

    const subLbl = document.createElement('label');
    subLbl.textContent = 'Subtitles:';
    subLbl.style.width = '140px'; subLbl.style.textAlign = 'right';
    subLbl.style.color = 'var(--text-dim)';

    const subChk = document.createElement('input');
    subChk.type = 'checkbox';
    subChk.checked = SettingsManager.get('subtitles') !== false;
    subChk.addEventListener('change', () => SettingsManager.set('subtitles', subChk.checked));

    subRow.appendChild(subLbl); subRow.appendChild(subChk);
    p.appendChild(subRow);

    // Scroll Speed
    const scrRow = document.createElement('div');
    scrRow.style.display = 'flex'; scrRow.style.alignItems = 'center'; scrRow.style.gap = '12px';
    scrRow.style.marginBottom = '12px';

    const scrLbl = document.createElement('label');
    scrLbl.textContent = 'Scroll Speed:';
    scrLbl.style.width = '140px'; scrLbl.style.textAlign = 'right';
    scrLbl.style.color = 'var(--text-dim)';

    const scrSel = document.createElement('select');
    Object.assign(scrSel.style, {
      background: '#0a0805', border: '1px solid var(--border)',
      color: 'var(--text-primary)', padding: '4px 8px', borderRadius: '3px',
      fontFamily: 'Georgia,serif',
    });
    [{ v: 150, l: 'Slow' },{ v: 250, l: 'Medium' },{ v: 400, l: 'Fast' }].forEach(({ v, l }) => {
      const opt = document.createElement('option');
      opt.value = String(v); opt.textContent = l;
      opt.selected = Number(SettingsManager.get('scrollSpeed')) === v;
      scrSel.appendChild(opt);
    });
    scrSel.addEventListener('change', () => SettingsManager.set('scrollSpeed', Number(scrSel.value)));

    scrRow.appendChild(scrLbl); scrRow.appendChild(scrSel);
    p.appendChild(scrRow);

    sep();

    const closeBtn = document.createElement('button');
    closeBtn.className = 'btn'; closeBtn.textContent = 'Close';
    closeBtn.addEventListener('click', () => {
      if (this._onClose) { this._onClose(); } else { this.exit(); }
    });
    p.appendChild(closeBtn);
  }
}
