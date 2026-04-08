// downloader.js — DI-008
// Client-side file download via Blob

export function downloadAsText(content, filename) {
  let name = (filename || 'Untitled.txt').trim();
  if (!name.toLowerCase().endsWith('.txt')) name += '.txt';

  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
