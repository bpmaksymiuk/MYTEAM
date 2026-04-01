import { useEffect, useMemo, useState } from 'react';

type Note = {
  id: string;
  title: string;
  body: string;
  updatedAt: string;
  imageDataUrl?: string;
};

type ViewMode = 'list' | 'grid';
type Tab = 'notes' | 'favorites' | 'options';

type FavoriteNode = {
  id: string;
  parentId: string | null;
  title: string;
  url?: string;
};

const STORAGE_KEYS = {
  notes: 'bbweb_notes',
  view: 'bbweb_view',
  theme: 'bbweb_theme',
  favorites: 'bbweb_favorites',
  favoritesDefaultFolderId: 'bbweb_favorites_default_folder_id'
};

const THEMES = [
  { id: 'midnight-terminal', label: 'Midnight Terminal' },
  { id: 'sunset-neon', label: 'Sunset Neon' },
  { id: 'coastal-mint', label: 'Coastal Mint' },
  { id: 'solar-flare', label: 'Solar Flare' },
  { id: 'paper-ink', label: 'Paper Ink' },
  { id: 'retro-arcade', label: 'Retro Arcade' }
];

function makeNote(title: string, body: string, imageDataUrl?: string): Note {
  const now = new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    title: title.trim() || 'Untitled',
    body: body.trim(),
    updatedAt: now,
    imageDataUrl
  };
}

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') resolve(reader.result);
      else reject(new Error('Invalid image payload'));
    };
    reader.onerror = () => reject(new Error('Failed to read dropped image'));
    reader.readAsDataURL(blob);
  });
}

async function readImageDataUrlFromDrop(dataTransfer: DataTransfer): Promise<string | null> {
  const imageFile = [...dataTransfer.files].find((file) => file.type.startsWith('image/'));
  if (imageFile) return await blobToDataUrl(imageFile);

  const text = dataTransfer.getData('text/plain').trim();
  if (text.startsWith('data:image/')) return text;

  return null;
}

function makeRootFavorites(): FavoriteNode[] {
  return [{ id: 'root', parentId: null, title: 'Favorites' }];
}

export default function App() {
  const [tab, setTab] = useState<Tab>('notes');
  const [view, setView] = useState<ViewMode>('list');
  const [theme, setTheme] = useState('midnight-terminal');
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [titleInput, setTitleInput] = useState('');
  const [bodyInput, setBodyInput] = useState('');
  const [status, setStatus] = useState('');
  const [favorites, setFavorites] = useState<FavoriteNode[]>(makeRootFavorites);
  const [favoritesCurrentFolderId, setFavoritesCurrentFolderId] = useState('root');
  const [favoritesDefaultFolderId, setFavoritesDefaultFolderId] = useState('root');
  const [favoritesSelectedIds, setFavoritesSelectedIds] = useState<string[]>([]);
  const [notesDropActive, setNotesDropActive] = useState(false);

  useEffect(() => {
    const storedNotes = localStorage.getItem(STORAGE_KEYS.notes);
    const storedView = localStorage.getItem(STORAGE_KEYS.view);
    const storedTheme = localStorage.getItem(STORAGE_KEYS.theme);
    const storedFavorites = localStorage.getItem(STORAGE_KEYS.favorites);
    const storedFavoritesDefaultFolderId = localStorage.getItem(STORAGE_KEYS.favoritesDefaultFolderId);

    if (storedNotes) {
      try {
        const parsed = JSON.parse(storedNotes) as Note[];
        if (Array.isArray(parsed)) setNotes(parsed);
      } catch {
        // Ignore malformed local storage payloads.
      }
    }
    if (storedView === 'list' || storedView === 'grid') setView(storedView);
    if (storedTheme) setTheme(storedTheme);

    if (storedFavorites) {
      try {
        const parsed = JSON.parse(storedFavorites) as FavoriteNode[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          setFavorites(parsed);
        }
      } catch {
        // Ignore malformed favorites payload.
      }
    }

    if (storedFavoritesDefaultFolderId) {
      setFavoritesDefaultFolderId(storedFavoritesDefaultFolderId);
      setFavoritesCurrentFolderId(storedFavoritesDefaultFolderId);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.notes, JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.view, view);
  }, [view]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.theme, theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.favorites, JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.favoritesDefaultFolderId, favoritesDefaultFolderId);
  }, [favoritesDefaultFolderId]);

  useEffect(() => {
    if (tab === 'favorites') {
      setFavoritesCurrentFolderId(favoritesDefaultFolderId || 'root');
      setFavoritesSelectedIds([]);
    }
  }, [tab, favoritesDefaultFolderId]);

  const selectedNote = useMemo(
    () => notes.find((note) => note.id === selectedId) ?? null,
    [notes, selectedId]
  );

  const folderNodes = useMemo(
    () => favorites.filter((node) => !node.url),
    [favorites]
  );

  const favoritesCurrentFolder = useMemo(
    () => favorites.find((node) => node.id === favoritesCurrentFolderId && !node.url) ?? null,
    [favorites, favoritesCurrentFolderId]
  );

  const favoritesChildren = useMemo(
    () => favorites.filter((node) => node.parentId === favoritesCurrentFolderId),
    [favorites, favoritesCurrentFolderId]
  );

  function clearForm() {
    setTitleInput('');
    setBodyInput('');
  }

  function onAddNote() {
    const note = makeNote(titleInput, bodyInput);
    setNotes((prev) => [note, ...prev]);
    setSelectedId(note.id);
    clearForm();
    setStatus('Note added.');
  }

  function onLoadSelectedForEdit() {
    if (!selectedNote) return;
    setTitleInput(selectedNote.title);
    setBodyInput(selectedNote.body);
    setStatus('Selected note loaded into editor.');
  }

  function onSaveSelected() {
    if (!selectedNote) return;
    setNotes((prev) =>
      prev.map((note) =>
        note.id === selectedNote.id
          ? {
              ...note,
              title: titleInput.trim() || 'Untitled',
              body: bodyInput.trim(),
              updatedAt: new Date().toISOString()
            }
          : note
      )
    );
    setStatus('Selected note updated.');
  }

  function onDeleteSelected() {
    if (!selectedNote) return;
    setNotes((prev) => prev.filter((note) => note.id !== selectedNote.id));
    setSelectedId(null);
    clearForm();
    setStatus('Selected note deleted.');
  }

  async function onCopySelected() {
    if (!selectedNote) return;

    if (selectedNote.imageDataUrl) {
      try {
        const response = await fetch(selectedNote.imageDataUrl);
        const blob = await response.blob();
        await navigator.clipboard.write([
          new ClipboardItem({
            [blob.type || 'image/png']: blob
          })
        ]);
        setStatus('Selected image note copied.');
        return;
      } catch {
        // Fall back to text copy.
      }
    }

    const payload = `${selectedNote.title}\n${selectedNote.body}`.trim();
    try {
      await navigator.clipboard.writeText(payload);
      setStatus('Selected note copied.');
    } catch {
      setStatus('Copy failed.');
    }
  }

  function onDropOnNote(targetId: string) {
    if (!draggingId || draggingId === targetId) return;

    setNotes((prev) => {
      const from = prev.findIndex((n) => n.id === draggingId);
      const to = prev.findIndex((n) => n.id === targetId);
      if (from < 0 || to < 0) return prev;
      const next = [...prev];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
    setStatus('Notes reordered.');
  }

  async function onNotesDrop(event: React.DragEvent<HTMLUListElement>) {
    event.preventDefault();
    setNotesDropActive(false);

    if (draggingId) {
      setDraggingId(null);
      return;
    }

    const imageDataUrl = await readImageDataUrlFromDrop(event.dataTransfer);
    if (imageDataUrl) {
      const note = makeNote('Dropped image', 'Created from dropped image payload.', imageDataUrl);
      setNotes((prev) => [note, ...prev]);
      setSelectedId(note.id);
      setStatus('Dropped image saved as note.');
      return;
    }

    const text = event.dataTransfer.getData('text/plain').trim();
    if (text) {
      const note = makeNote('Dropped text', text);
      setNotes((prev) => [note, ...prev]);
      setSelectedId(note.id);
      setStatus('Dropped text saved as note.');
      return;
    }

    setStatus('Unsupported drop content. Drop an image or plain text.');
  }

  function toggleFavoriteSelection(id: string) {
    setFavoritesSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  }

  function favoritesParentFolderId(): string | null {
    return favoritesCurrentFolder?.parentId ?? null;
  }

  function onFavoritesGoParent() {
    const parentId = favoritesParentFolderId();
    if (!parentId) return;
    setFavoritesCurrentFolderId(parentId);
    setFavoritesSelectedIds([]);
  }

  function onFavoritesAddLink() {
    const title = window.prompt('Favorite title');
    if (title === null) return;
    const url = window.prompt('Favorite URL', 'https://');
    if (url === null) return;
    if (!url.trim()) {
      setStatus('Favorite URL is required.');
      return;
    }
    const node: FavoriteNode = {
      id: crypto.randomUUID(),
      parentId: favoritesCurrentFolderId,
      title: title.trim() || url.trim(),
      url: url.trim()
    };
    setFavorites((prev) => [...prev, node]);
    setStatus('Favorite link added.');
  }

  function onFavoritesAddFolder() {
    const title = window.prompt('Folder name');
    if (title === null) return;
    const node: FavoriteNode = {
      id: crypto.randomUUID(),
      parentId: favoritesCurrentFolderId,
      title: title.trim() || 'New Folder'
    };
    setFavorites((prev) => [...prev, node]);
    setStatus('Folder added.');
  }

  function collectDescendants(nodes: FavoriteNode[], rootIds: string[]): Set<string> {
    const all = new Set(rootIds);
    let changed = true;
    while (changed) {
      changed = false;
      for (const node of nodes) {
        if (node.parentId && all.has(node.parentId) && !all.has(node.id)) {
          all.add(node.id);
          changed = true;
        }
      }
    }
    return all;
  }

  function onFavoritesRemoveSelected() {
    if (!favoritesSelectedIds.length) return;
    setFavorites((prev) => {
      const toRemove = collectDescendants(prev, favoritesSelectedIds);
      return prev.filter((node) => !toRemove.has(node.id));
    });
    setFavoritesSelectedIds([]);
    setStatus('Selected favorites removed.');
  }

  async function onFavoritesCopySelected() {
    if (!favoritesSelectedIds.length) return;
    const lines = favorites
      .filter((node) => favoritesSelectedIds.includes(node.id) && node.url)
      .map((node) => `${node.title} - ${node.url}`);
    if (!lines.length) {
      setStatus('No link favorites selected.');
      return;
    }
    try {
      await navigator.clipboard.writeText(lines.join('\n'));
      setStatus('Selected favorites copied.');
    } catch {
      setStatus('Copy favorites failed.');
    }
  }

  function onFavoritesOpenFolder(folderId: string) {
    setFavoritesCurrentFolderId(folderId);
    setFavoritesSelectedIds([]);
  }

  function onFavoritesDragStart(event: React.DragEvent<HTMLLIElement>, node: FavoriteNode) {
    if (!node.url) return;
    event.dataTransfer.setData('text/plain', `${node.title}\n${node.url}`);
    event.dataTransfer.setData('text/uri-list', node.url);
    event.dataTransfer.effectAllowed = 'copy';
  }

  return (
    <main className="app-shell">
      <section className="panel">
        <header className="panel-header">
          <h1 className="brand-title">
            <img src="/resources/pnp.png" alt="pnp" className="brand-icon" />
            <span>Browser Buddy Web</span>
          </h1>
          <span className="badge">React</span>
        </header>

        <nav className="tabs" aria-label="Main tabs">
          <button className={`tab ${tab === 'notes' ? 'active' : ''}`} onClick={() => setTab('notes')}>
            NOTES
          </button>
          <button className={`tab ${tab === 'favorites' ? 'active' : ''}`} onClick={() => setTab('favorites')}>
            FAVORITES
          </button>
          <button className={`tab ${tab === 'options' ? 'active' : ''}`} onClick={() => setTab('options')}>
            OPTIONS
          </button>
        </nav>

        {tab === 'notes' ? (
          <section>
            <div className="editor">
              <input
                value={titleInput}
                onChange={(event) => setTitleInput(event.target.value)}
                placeholder="Note title"
              />
              <textarea
                value={bodyInput}
                onChange={(event) => setBodyInput(event.target.value)}
                placeholder="Write your note"
                rows={3}
              />
            </div>

            <div className="actions">
              <button onClick={onAddNote}>Add</button>
              <button onClick={onLoadSelectedForEdit} disabled={!selectedNote}>
                Edit
              </button>
              <button onClick={onSaveSelected} disabled={!selectedNote}>
                Save
              </button>
              <button onClick={onCopySelected} disabled={!selectedNote}>
                Copy
              </button>
              <button onClick={onDeleteSelected} disabled={!selectedNote}>
                Delete
              </button>
            </div>

            <div className="view-toggle">
              <button className={view === 'list' ? 'active' : ''} onClick={() => setView('list')}>
                List
              </button>
              <button className={view === 'grid' ? 'active' : ''} onClick={() => setView('grid')}>
                Grid
              </button>
            </div>

            <p className="status">{status || 'Ready.'}</p>

            <p className="muted">Drop image or text onto NOTES to create a new note.</p>

            <ul
              className={`notes ${view} ${notesDropActive ? 'drop-active' : ''}`}
              onDragOver={(event) => {
                event.preventDefault();
                setNotesDropActive(true);
                event.dataTransfer.dropEffect = draggingId ? 'move' : 'copy';
              }}
              onDragLeave={(event) => {
                if (event.currentTarget.contains(event.relatedTarget as Node)) return;
                setNotesDropActive(false);
              }}
              onDrop={onNotesDrop}
            >
              {notes.map((note) => (
                <li
                  key={note.id}
                  className={`note ${selectedId === note.id ? 'selected' : ''}`}
                  onClick={() => setSelectedId(note.id)}
                  draggable
                  onDragStart={() => setDraggingId(note.id)}
                  onDragEnd={() => setDraggingId(null)}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={(event) => {
                    if (!draggingId) return;
                    event.preventDefault();
                    event.stopPropagation();
                    onDropOnNote(note.id);
                  }}
                >
                  <h3>{note.title}</h3>
                  <p>{note.body || '(empty note)'}</p>
                  {note.imageDataUrl ? <img src={note.imageDataUrl} alt={note.title} className="note-image" /> : null}
                  <small>{new Date(note.updatedAt).toLocaleString()}</small>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {tab === 'favorites' ? (
          <section className="favorites">
            <div className="actions">
              <button onClick={onFavoritesGoParent} disabled={!favoritesParentFolderId()}>
                Back
              </button>
              <button onClick={onFavoritesAddLink}>Add Link</button>
              <button onClick={onFavoritesAddFolder}>Add Folder</button>
              <button onClick={onFavoritesRemoveSelected} disabled={!favoritesSelectedIds.length}>
                Remove
              </button>
              <button onClick={onFavoritesCopySelected} disabled={!favoritesSelectedIds.length}>
                Copy Selected
              </button>
            </div>

            <p className="status">Folder: {favoritesCurrentFolder?.title || 'Favorites'}</p>

            <ul className="notes list">
              {favoritesChildren.map((node) => (
                <li
                  key={node.id}
                  className="note"
                  draggable={Boolean(node.url)}
                  onDragStart={(event) => onFavoritesDragStart(event, node)}
                >
                  <div className="favorite-row">
                    <input
                      type="checkbox"
                      checked={favoritesSelectedIds.includes(node.id)}
                      onChange={() => toggleFavoriteSelection(node.id)}
                    />
                    {node.url ? (
                      <a href={node.url} target="_blank" rel="noreferrer">
                        {node.title}
                      </a>
                    ) : (
                      <button className="folder-btn" onClick={() => onFavoritesOpenFolder(node.id)}>
                        {node.title}
                      </button>
                    )}
                    <small>{node.url ? 'Link' : 'Folder'}</small>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {tab === 'options' ? (
          <section className="options">
            <h2>Theme</h2>
            <select value={theme} onChange={(event) => setTheme(event.target.value)}>
              {THEMES.map((themeOption) => (
                <option key={themeOption.id} value={themeOption.id}>
                  {themeOption.label}
                </option>
              ))}
            </select>

            <h2>Default Favorites Folder</h2>
            <select
              value={favoritesDefaultFolderId}
              onChange={(event) => setFavoritesDefaultFolderId(event.target.value)}
            >
              {folderNodes.map((folder) => (
                <option key={folder.id} value={folder.id}>
                  {folder.title}
                </option>
              ))}
            </select>
            <p className="muted">Theme and view mode persist in local storage.</p>
          </section>
        ) : null}
      </section>
    </main>
  );
}
