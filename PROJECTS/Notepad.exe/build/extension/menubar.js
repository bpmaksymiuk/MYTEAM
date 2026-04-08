// menubar.js — DI-004
// Dropdown menu bar component

const MENU_STRUCTURE = [
  { label: 'File', items: [
    { label: 'New',          action: 'file:new',      shortcut: 'Ctrl+N' },
    { label: 'Open...',      action: 'file:open' },
    { label: 'Save',         action: 'file:save',     shortcut: 'Ctrl+S' },
    { label: 'Save As...',   action: 'file:saveas',   shortcut: 'Ctrl+Shift+S' },
    { type: 'separator' },
    { label: 'Download...',  action: 'file:download' },
    { label: 'Delete Note',  action: 'file:delete' },
    { type: 'separator' },
    { label: 'Exit',         action: 'file:exit' },
  ]},
  { label: 'Edit', items: [
    { label: 'Undo',         action: 'edit:undo',     shortcut: 'Ctrl+Z' },
    { type: 'separator' },
    { label: 'Cut',          action: 'edit:cut',      shortcut: 'Ctrl+X' },
    { label: 'Copy',         action: 'edit:copy',     shortcut: 'Ctrl+C' },
    { label: 'Paste',        action: 'edit:paste',    shortcut: 'Ctrl+V' },
  ]},
  { label: 'View', items: [
    { label: 'Word Wrap',    action: 'view:wordwrap',  checkable: true },
    { label: 'Status Bar',   action: 'view:statusbar', checkable: true },
  ]},
  { label: 'Help', items: [
    { label: 'Keyboard Shortcuts', action: 'help:keyboard' },
  ]},
];

let menubarEl = null;
let actionHandler = null;
const itemElements = new Map(); // action -> li element

export function initMenubar(container, handler) {
  menubarEl = container;
  actionHandler = handler;

  for (const menu of MENU_STRUCTURE) {
    const menuItem = document.createElement('div');
    menuItem.className = 'menu-item';
    menuItem.textContent = menu.label;

    const dropdown = document.createElement('ul');
    dropdown.className = 'menu-dropdown';

    for (const item of menu.items) {
      const li = document.createElement('li');
      if (item.type === 'separator') {
        li.className = 'separator';
      } else {
        const labelSpan = document.createElement('span');
        labelSpan.textContent = item.label;
        li.appendChild(labelSpan);
        if (item.shortcut) {
          const sc = document.createElement('span');
          sc.className = 'menu-shortcut';
          sc.textContent = item.shortcut;
          li.appendChild(sc);
        }
        li.dataset.action = item.action;
        li.addEventListener('click', (e) => {
          e.stopPropagation();
          closeAll();
          if (actionHandler) actionHandler(item.action);
        });
        if (item.checkable) {
          itemElements.set(item.action, li);
        }
      }
      dropdown.appendChild(li);
    }

    menuItem.appendChild(dropdown);

    menuItem.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = menuItem.classList.contains('open');
      closeAll();
      if (!isOpen) menuItem.classList.add('open');
    });

    menuItem.addEventListener('mouseenter', () => {
      // If any menu is open, switch immediately to this one
      if (menubarEl.querySelector('.menu-item.open')) {
        closeAll();
        menuItem.classList.add('open');
      }
    });

    menubarEl.appendChild(menuItem);
  }

  // Close all when clicking outside
  document.addEventListener('click', () => closeAll());
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAll();
  });
}

export function setMenuItemChecked(action, checked) {
  const li = itemElements.get(action);
  if (!li) return;
  const labelSpan = li.querySelector('span:first-child');
  if (!labelSpan) return;
  const baseLabel = labelSpan.dataset.base || labelSpan.textContent.replace(/^✓\s*/, '');
  labelSpan.dataset.base = baseLabel;
  labelSpan.textContent = checked ? `✓ ${baseLabel}` : baseLabel;
}

function closeAll() {
  if (!menubarEl) return;
  menubarEl.querySelectorAll('.menu-item.open').forEach(el => el.classList.remove('open'));
}
