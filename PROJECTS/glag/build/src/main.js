import { convert } from './converter';
import { buildReferenceTable } from './referenceTable';
const inputEl = document.getElementById('input-text');
const outputEl = document.getElementById('output-text');
const btnCyrGlag = document.getElementById('btn-mode-cyr-glag');
const btnGlagCyr = document.getElementById('btn-mode-glag-cyr');
const btnClear = document.getElementById('btn-clear');
const btnCopy = document.getElementById('btn-copy');
const btnMapping = document.getElementById('btn-mapping');
const btnCloseMapping = document.getElementById('btn-close-mapping');
const toast = document.getElementById('toast');
const sectionMapping = document.getElementById('section-mapping');
const labelInput = document.getElementById('label-input');
const labelOutput = document.getElementById('label-output');
const mappingContainer = document.getElementById('mapping-table-container');
let direction = 'cyr-glag';
let toastTimer = null;
buildReferenceTable(mappingContainer);
function setMode(dir) {
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
    }
    else {
        document.body.classList.add('mode-reverse');
        btnGlagCyr.classList.add('active');
        btnCyrGlag.classList.remove('active');
        labelInput.textContent = 'Input — Glagolitic';
        labelOutput.textContent = 'Output — Cyrillic';
        inputEl.placeholder = 'Type or paste Glagolitic text here…';
    }
    inputEl.focus();
}
function runConversion() {
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
    if (!text)
        return;
    navigator.clipboard.writeText(text).then(() => {
        if (toastTimer !== null)
            clearTimeout(toastTimer);
        toast.classList.add('visible');
        toastTimer = setTimeout(() => {
            toast.classList.remove('visible');
            toastTimer = null;
        }, 2000);
    }).catch(() => { });
});
btnMapping.addEventListener('click', () => {
    sectionMapping.hidden = false;
    sectionMapping.scrollIntoView({ behavior: 'smooth', block: 'start' });
});
btnCloseMapping.addEventListener('click', () => {
    sectionMapping.hidden = true;
});
