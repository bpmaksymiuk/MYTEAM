const STORAGE_KEY = 'otel-tab-lang';
const DEFAULT_LANG = 'js';

function getStoredLang() {
  try { return localStorage.getItem(STORAGE_KEY) || DEFAULT_LANG; }
  catch { return DEFAULT_LANG; }
}

function storeLang(lang) {
  try { localStorage.setItem(STORAGE_KEY, lang); } catch {}
}

function buildTabList(group) {
  const panels = Array.from(group.querySelectorAll(':scope > .tab-panel'));
  if (!panels.length) return;
  const list = document.createElement('div');
  list.setAttribute('role', 'tablist');
  list.classList.add('tab-list');
  panels.forEach(panel => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.setAttribute('role', 'tab');
    btn.classList.add('tab-btn');
    btn.dataset.lang = panel.dataset.lang;
    btn.textContent = panel.dataset.label;
    btn.setAttribute('aria-selected', 'false');
    btn.addEventListener('click', () => selectLang(panel.dataset.lang));
    list.appendChild(btn);
  });
  group.prepend(list);
}

function selectLang(lang) {
  storeLang(lang);
  document.querySelectorAll('.tab-group').forEach(group => activateGroup(group, lang));
  window.applyConfig?.();
}

function activateGroup(group, lang) {
  const panels = Array.from(group.querySelectorAll(':scope > .tab-panel'));
  const btns   = Array.from(group.querySelectorAll(':scope > .tab-list .tab-btn'));
  let matched = false;
  panels.forEach(p => {
    const active = p.dataset.lang === lang;
    if (active) matched = true;
    p.hidden = !active;
    if (active) p.setAttribute('data-active', '');
    else p.removeAttribute('data-active');
  });
  btns.forEach(b => b.setAttribute('aria-selected', String(b.dataset.lang === lang)));
  if (!matched && panels.length) {
    panels[0].hidden = false;
    panels[0].setAttribute('data-active', '');
    btns[0]?.setAttribute('aria-selected', 'true');
  }
}

function init() {
  document.querySelectorAll('.tab-group').forEach(buildTabList);
  document.body.classList.add('js-tabs-ready');
  const lang = getStoredLang();
  document.querySelectorAll('.tab-group').forEach(g => activateGroup(g, lang));
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
