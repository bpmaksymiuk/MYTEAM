const SAVE_PREFIX = 'bg-prototype-save-';

export function listSlots() {
  return [1, 2, 3].map((slot) => {
    const raw = localStorage.getItem(`${SAVE_PREFIX}${slot}`);
    return raw ? JSON.parse(raw) : null;
  });
}

export function saveSlot(slot, snapshot) {
  localStorage.setItem(`${SAVE_PREFIX}${slot}`, JSON.stringify(snapshot));
}

export function loadSlot(slot) {
  const raw = localStorage.getItem(`${SAVE_PREFIX}${slot}`);
  return raw ? JSON.parse(raw) : null;
}