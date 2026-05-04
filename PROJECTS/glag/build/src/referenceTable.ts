import { CHAR_PAIRS } from './mapping';

export function buildReferenceTable(container: HTMLElement): void {
  const table = document.createElement('table');
  table.className = 'mapping-table';

  const thead = document.createElement('thead');
  const headerRow = document.createElement('tr');
  ['Cyrillic', 'Cyrillic Name', 'Glagolitic', 'Glagolitic Name'].forEach((text) => {
    const th = document.createElement('th');
    th.textContent = text;
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);
  table.appendChild(thead);

  const tbody = document.createElement('tbody');
  for (const pair of CHAR_PAIRS) {
    const row = document.createElement('tr');
    const cyrCell = document.createElement('td');
    cyrCell.textContent = pair.cyrillic;
    cyrCell.className = 'char-cell';
    const cyrNameCell = document.createElement('td');
    cyrNameCell.textContent = pair.cyrillicName;
    const glagCell = document.createElement('td');
    glagCell.textContent = pair.glagolitic;
    glagCell.className = 'char-cell glag-cell';
    const glagNameCell = document.createElement('td');
    glagNameCell.textContent = pair.glagoliticName;
    row.appendChild(cyrCell);
    row.appendChild(cyrNameCell);
    row.appendChild(glagCell);
    row.appendChild(glagNameCell);
    tbody.appendChild(row);
  }
  table.appendChild(tbody);
  container.appendChild(table);
}
