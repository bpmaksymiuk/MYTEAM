import { convert, Direction } from './converter';
import { buildReferenceTable } from './referenceTable';

const inputEl = document.getElementById('input-text') as HTMLTextAreaElement;
const outputEl = document.getElementById('output-text') as HTMLDivElement;
const btnCyrGlag = document.getElementById('btn-mode-cyr-glag') as HTMLButtonElement;
const btnGlagCyr = document.getElementById('btn-mode-glag-cyr') as HTMLButtonElement;
const btnClear = document.getElementById('btn-clear') as HTMLButtonElement;
const btnCopy = document.getElementById('btn-copy') as HTMLButtonElement;
const btnMapping = document.getElementById('btn-mapping') as HTMLButtonElement;
const btnCloseMapping = document.getElementById('btn-close-mapping') as HTMLButtonElement;
const toast = document.getElementById('toast') as HTMLDivElement;
const sectionMapping = document.getElementById('section-mapping') as HTMLElement;
const labelInput = document.getElementById('label-input') as HTMLDivElement;
const labelOutput = document.getElementById('label-output') as HTMLDivElement;
const mappingContainer = document.getElementById('mapping-table-container') as HTMLDivElement;

let direction: Direction = 'cyr-glag';
let toastTimer: ReturnType<typeof setTimeout> | null = null;

buildReferenceTable(mappingContainer);

function setMode(dir: Direction): void {
  direction = dir;
  inputEl.value = '';
  outputEl.textContent = '';
  btnCopy.disabled = true;

  if (dir === 'cyr-glag') {
    document.body.classList.remove('mode-reverse');
    btnCyrGlag.classList.add('active');
    btnGlagCyr.classList.remove('active');
    labelInput.textContent = 'Input — Cyrillic';
    labelOutput.textContent = 'Output — Glagolitic';
    inputEl.placeholder = 'Type or paste Cyrillic text here…';
  } else {
    document.body.classList.add('mode-reverse');
    btnGlagCyr.classList.add('active');
    btnCyrGlag.classList.remove('active');
    labelInput.textContent = 'Input — Glagolitic';
    labelOutput.textContent = 'Output — Cyrillic';
    inputEl.placeholder = 'Type or paste Glagolitic text here…';
  }

  inputEl.focus();
}

function runConversion(): void {
  const result = convert(inputEl.value, direction);
  outputEl.textContent = result;
  btnCopy.disabled = result.length === 0;
}

btnCyrGlag.addEventListener('click', () => setMode('cyr-glag'));
btnGlagCyr.addEventListener('click', () => setMode('glag-cyr'));

inputEl.addEventListener('input', runConversion);

btnClear.addEventListener('click', () => {
  inputEl.value = '';
  outputEl.textContent = '';
  btnCopy.disabled = true;
  inputEl.focus();
});

btnCopy.addEventListener('click', () => {
  const text = outputEl.textContent ?? '';
  if (!text) return;

  navigator.clipboard.writeText(text).then(() => {
    if (toastTimer !== null) clearTimeout(toastTimer);
    toast.classList.add('visible');
    toastTimer = setTimeout(() => {
      toast.classList.remove('visible');
      toastTimer = null;
    }, 2000);
  }).catch(() => { /* silent — clipboard not available */ });
});

btnMapping.addEventListener('click', () => {
  sectionMapping.hidden = false;
  sectionMapping.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

btnCloseMapping.addEventListener('click', () => {
  sectionMapping.hidden = true;
});
