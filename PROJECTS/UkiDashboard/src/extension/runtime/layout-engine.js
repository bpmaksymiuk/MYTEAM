const WIDGET_MIN_W = 1;
const WIDGET_MAX_W = 4;
const WIDGET_MIN_H = 1;
const WIDGET_MAX_H = 4;

export function defaultLayout() {
  return [
    { widgetId: 'map-panel', x: 1, y: 1, w: 2, h: 2, zIndex: 1 },
    { widgetId: 'feed-panel', x: 3, y: 1, w: 2, h: 2, zIndex: 2 },
    { widgetId: 'insights-panel', x: 1, y: 3, w: 2, h: 2, zIndex: 3 },
    { widgetId: 'alerts-panel', x: 3, y: 3, w: 2, h: 2, zIndex: 4 }
  ];
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, Number(value) || min));
}

function overlaps(a, b) {
  const ax2 = a.x + a.w - 1;
  const ay2 = a.y + a.h - 1;
  const bx2 = b.x + b.w - 1;
  const by2 = b.y + b.h - 1;
  return a.x <= bx2 && ax2 >= b.x && a.y <= by2 && ay2 >= b.y;
}

export function normalizeLayout(layout) {
  const normalized = layout
    .map((item) => ({
      ...item,
      x: clamp(item.x, 1, 4),
      y: clamp(item.y, 1, 30),
      w: clamp(item.w, WIDGET_MIN_W, WIDGET_MAX_W),
      h: clamp(item.h, WIDGET_MIN_H, WIDGET_MAX_H),
      zIndex: clamp(item.zIndex || 1, 1, 99)
    }))
    .sort((a, b) => (a.y - b.y) || (a.x - b.x));

  for (let i = 0; i < normalized.length; i += 1) {
    const current = normalized[i];
    while (current.x + current.w - 1 > 4) {
      current.w -= 1;
    }

    let moved = true;
    while (moved) {
      moved = false;
      for (let j = 0; j < i; j += 1) {
        if (overlaps(current, normalized[j])) {
          current.y += 1;
          moved = true;
          break;
        }
      }
    }
  }

  return normalized;
}

export function reorderLayout(layout, widgetId, direction) {
  const next = [...layout];
  const idx = next.findIndex((entry) => entry.widgetId === widgetId);
  if (idx < 0) return next;
  const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
  if (swapIdx < 0 || swapIdx >= next.length) return next;
  [next[idx], next[swapIdx]] = [next[swapIdx], next[idx]];
  return next.map((entry, index) => ({ ...entry, zIndex: index + 1 }));
}
