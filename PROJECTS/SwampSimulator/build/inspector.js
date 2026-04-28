// inspector.js — DI-013
import { state } from './state.js';
import { SPECIES, getSpecies } from './species.js';

export function openInspector(speciesId) {
  const sp = getSpecies(speciesId);
  const el = document.getElementById('inspector'); if (!el || !sp) return;
  state.ui.selectedSpecies = speciesId;
  const pop = sp.isPlant ? (state.plantPatches[sp.id]?.length || 0) : (state.agents[sp.id]?.length || 0);
  const eatLinks = sp.eats.map(id => `<a href="#" data-species="${id}">${getSpecies(id)?.commonName || id}</a>`).join(', ') || '—';
  const byLinks = sp.eatenBy.map(id => `<a href="#" data-species="${id}">${getSpecies(id)?.commonName || id}</a>`).join(', ') || '—';
  const sens = [];
  if (sp.sensitivities.pollution > 0.6) sens.push('Pollution-sensitive');
  if (sp.sensitivities.drought > 0.6) sens.push('Drought-sensitive');
  if (sp.sensitivities.cold > 0.6) sens.push('Cold-sensitive');
  el.classList.remove('hidden');
  el.innerHTML = `
    <header>
      <h2>${sp.commonName}</h2>
      <button id="inspector-close" aria-label="Close inspector">✕</button>
    </header>
    <img class="inspector-portrait" src="./images/portraits/${sp.id}.svg" alt="">
    <p class="latin">${sp.latinName}</p>
    <p><strong>Trophic level:</strong> ${sp.trophic}</p>
    <p><strong>Population:</strong> ${pop} alive</p>
    <p><strong>Role:</strong> ${escapeHtml(sp.role)}</p>
    <p><strong>Eats:</strong> ${eatLinks}</p>
    <p><strong>Eaten by:</strong> ${byLinks}</p>
    ${sens.length ? `<p><strong>Sensitivities:</strong> ${sens.join(', ')}</p>` : ''}
  `;
  el.querySelector('#inspector-close').onclick = closeInspector;
  el.querySelectorAll('a[data-species]').forEach(a => a.addEventListener('click', (e) => {
    e.preventDefault(); openInspector(a.dataset.species);
  }));
}

export function closeInspector() {
  const el = document.getElementById('inspector'); if (el) el.classList.add('hidden');
  state.ui.selectedSpecies = null;
}

export function agentAt(x, y) {
  let best = null, bestD = 64;
  for (const sp of SPECIES) if (!sp.isPlant) {
    const arr = state.agents[sp.id]; if (!arr) continue;
    for (const a of arr) { const dx = a.x - x, dy = a.y - y; const d2 = dx*dx + dy*dy; if (d2 < bestD) { bestD = d2; best = a; } }
  }
  return best;
}

function escapeHtml(s) { return String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])); }
