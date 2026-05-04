'use strict';

const STORAGE_KEY = 'otel-cookbook.cfg.v1';
const DEFAULTS = Object.freeze({
  preset: 'direct',
  endpoint: 'http://localhost:4318',
  tenantUrl: '',
  apiToken: '',
  serviceName: 'my-service'
});

const TOKENS = Object.freeze({
  OTLP_ENDPOINT: cfg => effectiveEndpoint(cfg),
  OTLP_HEADERS: cfg => effectiveHeaders(cfg),
  SERVICE_NAME: cfg => cfg.serviceName || DEFAULTS.serviceName,
  OTEL_RESOURCE_ATTRIBUTES: cfg => `service.name=${cfg.serviceName || DEFAULTS.serviceName},deployment.environment=dev`
});

let memoryFallback = null;

function loadCfg() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULTS };
    const parsed = JSON.parse(raw);
    return { ...DEFAULTS, ...parsed };
  } catch {
    return memoryFallback ? { ...memoryFallback } : { ...DEFAULTS };
  }
}

function saveCfg(cfg) {
  const next = { ...DEFAULTS, ...cfg };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    memoryFallback = next;
  }
  return next;
}

function clearCfg() {
  try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
  memoryFallback = null;
}

function effectiveEndpoint(cfg) {
  if (cfg.preset === 'dynatrace') {
    const base = (cfg.tenantUrl || '').trim().replace(/\/+$/, '');
    if (!/^https:\/\/.+/.test(base)) return 'https://YOUR-TENANT.live.dynatrace.com/api/v2/otlp';
    return `${base}/api/v2/otlp`;
  }
  if (cfg.preset === 'collector') return 'http://localhost:4318';
  return cfg.endpoint || DEFAULTS.endpoint;
}

function effectiveHeaders(cfg) {
  if (cfg.preset === 'dynatrace') {
    const token = cfg.apiToken || 'dt0c01.PLACEHOLDER_TOKEN';
    return `Authorization=Api-Token ${token}`;
  }
  return '';
}

function applyTemplates() {
  const cfg = loadCfg();
  const nodes = document.querySelectorAll('[data-cfg-template="true"]');
  nodes.forEach(node => {
    if (!node.dataset.cfgOriginal) node.dataset.cfgOriginal = node.innerHTML;
    let html = node.dataset.cfgOriginal;
    for (const [tokenName, fn] of Object.entries(TOKENS)) {
      const value = String(fn(cfg));
      const safe = value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      html = html.replaceAll(`{{${tokenName}}}`, safe);
    }
    node.innerHTML = html;
  });
  updatePreview(cfg);
}

function readForm(form) {
  return {
    preset: form.querySelector('input[name="preset"]:checked').value,
    endpoint: form.querySelector('[data-cfg-field="endpoint"]').value,
    tenantUrl: form.querySelector('[data-cfg-field="tenantUrl"]').value,
    apiToken: form.querySelector('[data-cfg-field="apiToken"]').value,
    serviceName: form.querySelector('[data-cfg-field="serviceName"]').value
  };
}

function updateConditionalVisibility(form, preset) {
  form.querySelectorAll('[data-show-when-preset]').forEach(el => {
    const show = el.dataset.showWhenPreset.split(/\s+/).includes(preset);
    el.hidden = !show;
  });
}

function updatePreview(cfg) {
  const previewCode = document.querySelector('[data-cfg-preview] code');
  if (!previewCode) return;
  const lines = [
    `OTEL_EXPORTER_OTLP_ENDPOINT=${effectiveEndpoint(cfg)}`,
    `OTEL_SERVICE_NAME=${cfg.serviceName || DEFAULTS.serviceName}`
  ];
  const headers = effectiveHeaders(cfg);
  if (headers) lines.push(`OTEL_EXPORTER_OTLP_HEADERS=${headers}`);
  previewCode.textContent = lines.join('\n');
}

function init() {
  const modal = document.getElementById('cfg-modal');
  if (!modal) return;
  const form = modal.querySelector('[data-cfg-form]');

  const populate = () => {
    const cfg = loadCfg();
    const presetInput = form.querySelector('input[name="preset"][value="' + cfg.preset + '"]');
    if (presetInput) presetInput.checked = true;
    form.querySelector('[data-cfg-field="endpoint"]').value = cfg.endpoint;
    form.querySelector('[data-cfg-field="tenantUrl"]').value = cfg.tenantUrl;
    form.querySelector('[data-cfg-field="apiToken"]').value = cfg.apiToken;
    form.querySelector('[data-cfg-field="serviceName"]').value = cfg.serviceName;
    updateConditionalVisibility(form, cfg.preset);
    updatePreview(cfg);
  };
  populate();

  document.querySelectorAll('[data-cfg-open]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      if (typeof modal.showModal === 'function') modal.showModal();
      else modal.setAttribute('open', '');
    });
  });

  modal.querySelector('[data-cfg-close]').addEventListener('click', () => {
    if (typeof modal.close === 'function') modal.close();
    else modal.removeAttribute('open');
  });

  form.querySelectorAll('input[name="preset"]').forEach(input => {
    input.addEventListener('change', () => {
      updateConditionalVisibility(form, input.value);
      updatePreview(readForm(form));
    });
  });

  form.querySelectorAll('input[data-cfg-field]').forEach(input => {
    input.addEventListener('input', () => updatePreview(readForm(form)));
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    saveCfg(readForm(form));
    applyTemplates();
    if (typeof modal.close === 'function') modal.close();
    else modal.removeAttribute('open');
  });

  form.querySelector('[data-cfg-clear]').addEventListener('click', () => {
    clearCfg();
    populate();
    applyTemplates();
  });

  applyTemplates();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

window.applyConfig = applyTemplates;
