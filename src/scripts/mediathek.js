// LoadSh.it Desktop - Mediathek (Media Library)

import { historyManager } from './history-manager.js';
import { alerts } from './alerts.js';

const { open } = window.__TAURI__.shell;

class MediathekUI {
  constructor() {
    this.overlay = null;
    this.isOpen = false;
    this.currentFilter = 'all';
    this.searchQuery = '';
    this.init();
  }

  init() {
    this.createMediathekModal();
    this.bindEvents();

    // Listen for history updates
    historyManager.setUpdateHandler(() => {
      if (this.isOpen) {
        this.renderMediaList();
        this.renderStats();
      }
    });
  }

  createMediathekModal() {
    const overlay = document.createElement('div');
    overlay.className = 'mediathek-overlay';
    overlay.id = 'mediathekOverlay';

    overlay.innerHTML = `
      <div class="mediathek-modal">
        <div class="mediathek-header">
          <h2>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M4 11v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
              <path d="M4 11V6a2 2 0 0 1 2-2h3l2 2h7a2 2 0 0 1 2 2v3"></path>
              <circle cx="12" cy="15" r="2"></circle>
            </svg>
            Mediathek
          </h2>
          <button class="close-mediathek-btn" id="closeMediathek">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div class="mediathek-toolbar">
          <div class="mediathek-search">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input type="text" id="mediathekSearch" placeholder="Suchen...">
          </div>
          <div class="mediathek-filters">
            <button class="filter-btn active" data-filter="all">Alle</button>
            <button class="filter-btn" data-filter="YouTube">YouTube</button>
            <button class="filter-btn" data-filter="TikTok">TikTok</button>
            <button class="filter-btn" data-filter="Instagram">Instagram</button>
            <button class="filter-btn" data-filter="Other">Andere</button>
          </div>
        </div>

        <div class="mediathek-stats" id="mediathekStats">
          <!-- Stats will be rendered here -->
        </div>

        <div class="mediathek-content" id="mediathekContent">
          <div class="mediathek-list" id="mediathekList">
            <!-- Media items will be rendered here -->
          </div>
          <div class="mediathek-empty" id="mediathekEmpty">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M4 11v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
              <path d="M4 11V6a2 2 0 0 1 2-2h3l2 2h7a2 2 0 0 1 2 2v3"></path>
            </svg>
            <p>Keine Downloads gefunden</p>
            <span>Deine heruntergeladenen Videos erscheinen hier</span>
          </div>
        </div>

        <div class="mediathek-footer">
          <button class="footer-btn" id="openDownloadFolder">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
            </svg>
            Ordner öffnen
          </button>
          <button class="footer-btn danger" id="clearHistory">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
            Verlauf löschen
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);
    this.overlay = overlay;
  }

  bindEvents() {
    // Close button
    document.getElementById('closeMediathek').addEventListener('click', () => this.close());

    // Click outside to close
    this.overlay.addEventListener('click', (e) => {
      if (e.target === this.overlay) this.close();
    });

    // ESC key to close
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) this.close();
    });

    // Search input
    const searchInput = document.getElementById('mediathekSearch');
    let searchTimeout;
    searchInput.addEventListener('input', (e) => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        this.searchQuery = e.target.value.trim();
        this.renderMediaList();
      }, 300);
    });

    // Filter buttons
    this.overlay.querySelector('.mediathek-filters').addEventListener('click', (e) => {
      const btn = e.target.closest('.filter-btn');
      if (btn) {
        this.overlay.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentFilter = btn.dataset.filter;
        this.renderMediaList();
      }
    });

    // Open download folder
    document.getElementById('openDownloadFolder').addEventListener('click', async () => {
      try {
        const downloadDir = localStorage.getItem('loadshit_download_path') ||
                           await window.__TAURI__.core.invoke('get_download_dir');
        await open(downloadDir);
      } catch (e) {
        console.error('Failed to open folder:', e);
      }
    });

    // Clear history
    document.getElementById('clearHistory').addEventListener('click', async () => {
      const confirmed = await alerts.confirm(
        'Verlauf löschen',
        'Alle Download-Einträge werden gelöscht. Die Dateien bleiben erhalten.'
      );
      if (confirmed) {
        historyManager.clearHistory();
        this.renderMediaList();
        this.renderStats();
        alerts.toastSuccess('Verlauf gelöscht');
      }
    });

    // Delegate click events for media items
    document.getElementById('mediathekList').addEventListener('click', (e) => {
      const item = e.target.closest('.media-item');
      if (!item) return;

      const action = e.target.closest('[data-action]');
      if (action) {
        const actionType = action.dataset.action;
        const itemId = item.dataset.id;

        const count = parseInt(item.dataset.count) || 1;
        const allIds = item.dataset.allIds ? item.dataset.allIds.split(',') : [itemId];

        switch (actionType) {
          case 'open':
            this.openFile(item.dataset.filename);
            break;
          case 'folder':
            this.openFolderWithSelection(item.dataset.filename);
            break;
          case 'delete':
            this.deleteItem(itemId, count, allIds);
            break;
          case 'copy-file':
            this.copyFile(item.dataset.filename);
            break;
        }
      }
    });
  }

  async openFile(filename) {
    if (!filename) {
      alerts.toastWarning('Datei nicht gefunden');
      return;
    }
    try {
      const downloadDir = localStorage.getItem('loadshit_download_path') ||
                         await window.__TAURI__.core.invoke('get_download_dir');
      const filePath = `${downloadDir}/${filename}`;
      // Use backend command for reliable file opening
      await window.__TAURI__.core.invoke('open_file', { filePath });
    } catch (e) {
      console.error('Failed to open file:', e);
      alerts.toastError('Datei konnte nicht geöffnet werden');
    }
  }

  async deleteItem(id, count = 1, allIds = []) {
    // If there are duplicates, show selection dialog
    if (count > 1) {
      const deleteCount = await alerts.selectDeleteCount('Kopien löschen', count);

      if (deleteCount === null) {
        return; // User cancelled
      }

      // Delete the selected number of copies (oldest first)
      const idsToDelete = allIds.slice(-deleteCount); // Take from the end (oldest)
      idsToDelete.forEach(deleteId => {
        historyManager.removeEntry(deleteId);
      });

      if (deleteCount === count) {
        alerts.toastSuccess('Alle Kopien gelöscht');
      } else {
        alerts.toastSuccess(`${deleteCount} Kopie${deleteCount > 1 ? 'n' : ''} gelöscht`);
      }
    } else {
      // Single item, show simple confirm dialog
      const confirmed = await alerts.confirm(
        'Eintrag löschen',
        'Der Eintrag wird aus dem Verlauf entfernt. Die Datei bleibt erhalten.'
      );
      if (confirmed) {
        historyManager.removeEntry(id);
        alerts.toastSuccess('Eintrag gelöscht');
      }
    }

    this.renderMediaList();
    this.renderStats();
  }

  async copyFile(filename) {
    if (!filename) {
      alerts.toastWarning('Keine Datei vorhanden');
      return;
    }

    try {
      const downloadDir = localStorage.getItem('loadshit_download_path') ||
                         await window.__TAURI__.core.invoke('get_download_dir');
      const sourcePath = `${downloadDir}/${filename}`;

      // Use Tauri dialog to ask where to save
      const { save } = window.__TAURI__.dialog;
      const destPath = await save({
        title: 'Video speichern unter',
        defaultPath: filename,
        filters: [{
          name: 'Video',
          extensions: ['mp4', 'webm', 'mkv', 'avi', 'mov']
        }]
      });

      if (destPath) {
        // Use Tauri command to copy the file
        await window.__TAURI__.core.invoke('copy_file', {
          source: sourcePath,
          destination: destPath
        });
        alerts.toastSuccess('Video kopiert!');
      }
    } catch (e) {
      console.error('Failed to copy file:', e);
      alerts.toastError('Kopieren fehlgeschlagen');
    }
  }

  async openFolderWithSelection(filename) {
    try {
      const downloadDir = localStorage.getItem('loadshit_download_path') ||
                         await window.__TAURI__.core.invoke('get_download_dir');

      if (!filename) {
        // No specific file, just open folder
        await window.__TAURI__.core.invoke('open_folder', { folderPath: downloadDir });
        return;
      }

      const fullPath = `${downloadDir}/${filename}`;

      // Use Tauri command to open folder with file selected
      await window.__TAURI__.core.invoke('open_folder_with_selection', { filePath: fullPath });
    } catch (e) {
      console.error('Failed to open folder:', e);
      // Fallback: just open the folder using shell open
      try {
        const fallbackDir = localStorage.getItem('loadshit_download_path') ||
                           await window.__TAURI__.core.invoke('get_download_dir');
        await open(fallbackDir);
      } catch {
        alerts.toastError('Ordner konnte nicht geöffnet werden');
      }
    }
  }

  renderStats() {
    const stats = historyManager.getStats();
    const statsEl = document.getElementById('mediathekStats');

    statsEl.innerHTML = `
      <div class="stat-item">
        <span class="stat-value">${stats.totalDownloads}</span>
        <span class="stat-label">Downloads</span>
      </div>
      <div class="stat-item">
        <span class="stat-value">${Object.keys(stats.platforms).length}</span>
        <span class="stat-label">Plattformen</span>
      </div>
      <div class="stat-item">
        <span class="stat-value">${historyManager.formatFilesize(stats.totalSize)}</span>
        <span class="stat-label">Gesamt</span>
      </div>
    `;
  }

  renderMediaList() {
    const listEl = document.getElementById('mediathekList');
    const emptyEl = document.getElementById('mediathekEmpty');

    let items = historyManager.getHistory();

    // Filter by platform
    if (this.currentFilter !== 'all') {
      if (this.currentFilter === 'Other') {
        const mainPlatforms = ['YouTube', 'TikTok', 'Instagram', 'Twitter'];
        items = items.filter(item => !mainPlatforms.includes(item.platform));
      } else {
        items = items.filter(item => item.platform === this.currentFilter);
      }
    }

    // Filter by search query
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      items = items.filter(item =>
        item.title.toLowerCase().includes(query) ||
        item.platform.toLowerCase().includes(query) ||
        item.url.toLowerCase().includes(query)
      );
    }

    // Only show completed downloads
    items = items.filter(item => item.status === 'completed');

    // Group duplicates by URL (same video downloaded multiple times)
    const groupedItems = this.groupDuplicates(items);

    if (groupedItems.length === 0) {
      listEl.style.display = 'none';
      emptyEl.style.display = 'flex';
      return;
    }

    listEl.style.display = 'grid';
    emptyEl.style.display = 'none';

    listEl.innerHTML = groupedItems.map(group => this.renderMediaItem(group.item, group.count, group.allIds)).join('');
  }

  groupDuplicates(items) {
    const groups = new Map();

    items.forEach(item => {
      // Use URL as the key for grouping (same video = same URL)
      // If no URL, use item ID as fallback to avoid grouping unrelated items
      const key = item.url || item.id || `item_${Date.now()}_${Math.random()}`;

      if (groups.has(key)) {
        const group = groups.get(key);
        group.count++;
        group.allIds.push(item.id);
        // Keep the most recent download as the main item
        if (item.downloadedAt > group.item.downloadedAt) {
          group.item = item;
        }
      } else {
        groups.set(key, { item, count: 1, allIds: [item.id] });
      }
    });

    // Convert to array and sort by most recent
    return Array.from(groups.values()).sort((a, b) => b.item.downloadedAt - a.item.downloadedAt);
  }

  renderMediaItem(item, count = 1, allIds = []) {
    const platformIcon = this.getPlatformIcon(item.platform);
    // Store all IDs for deletion of duplicates
    const allIdsAttr = allIds.length > 0 ? allIds.join(',') : item.id;
    const duration = item.duration
      ? `${Math.floor(item.duration / 60)}:${Math.floor(item.duration % 60).toString().padStart(2, '0')}`
      : '';

    // Count badge for duplicates (neo-brutalism style)
    const countBadge = count > 1
      ? `<span class="media-count-badge">x${count}</span>`
      : '';

    return `
      <div class="media-item" data-id="${item.id}" data-filename="${item.filename || ''}" data-url="${item.url}" data-count="${count}" data-all-ids="${allIdsAttr}">
        <div class="media-thumbnail" data-action="open">
          ${item.thumbnail
            ? `<img src="${item.thumbnail}" alt="" onerror="this.style.display='none'">`
            : `<div class="thumbnail-placeholder">${platformIcon}</div>`
          }
          ${duration ? `<span class="media-duration">${duration}</span>` : ''}
          ${countBadge}
          <div class="media-overlay">
            <button class="media-action-btn" data-action="open" title="Abspielen">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
              </svg>
            </button>
          </div>
        </div>
        <div class="media-info" data-action="open">
          <h4 class="media-title" title="${this.escapeHtml(item.title)}">${this.escapeHtml(item.title)}</h4>
          <div class="media-meta">
            <span class="media-platform">${platformIcon} ${item.platform}</span>
            <span class="media-date">${historyManager.formatDate(item.downloadedAt)}</span>
          </div>
          <div class="media-details">
            <span class="media-quality">${item.quality || 'best'}</span>
            <span class="media-format">${item.format?.toUpperCase() || 'MP4'}</span>
          </div>
        </div>
        <div class="media-actions">
          <button class="media-action-small" data-action="folder" title="Im Ordner zeigen">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
            </svg>
          </button>
          <button class="media-action-small" data-action="copy-file" title="Video kopieren">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
          </button>
          <button class="media-action-small danger" data-action="delete" title="Löschen">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
          </button>
        </div>
      </div>
    `;
  }

  getPlatformIcon(platform) {
    const icons = {
      'YouTube': '<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>',
      'TikTok': '<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/></svg>',
      'Instagram': '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/></svg>',
      'Twitter': '<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>',
      'Twitch': '<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z"/></svg>',
      'Reddit': '<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><circle cx="9" cy="12" r="1"/><circle cx="15" cy="12" r="1"/><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5.8 11.33c.02.16.03.33.03.5 0 2.49-2.91 4.5-6.5 4.5s-6.5-2.01-6.5-4.5c0-.17.01-.34.03-.5-.46-.27-.78-.74-.78-1.28 0-.83.67-1.5 1.5-1.5.39 0 .74.15 1.01.39 1.13-.79 2.66-1.28 4.34-1.33l.89-3.22c.06-.22.28-.35.5-.29l2.3.61c.17-.36.54-.61.97-.61.58 0 1.05.47 1.05 1.05 0 .58-.47 1.05-1.05 1.05-.53 0-.96-.4-1.03-.91l-2.03-.54-.75 2.72c1.59.08 3.03.55 4.13 1.3.26-.23.6-.37.97-.37.83 0 1.5.67 1.5 1.5 0 .54-.32 1.01-.78 1.28z"/></svg>',
      'Vimeo': '<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M23.9765 6.4168c-.105 2.338-1.739 5.5429-4.894 9.6088-3.2679 4.247-6.0258 6.3699-8.2898 6.3699-1.409 0-2.578-1.294-3.553-3.881l-1.9179-7.1138c-.719-2.584-1.488-3.878-2.312-3.878-.179 0-.806.378-1.8809 1.132l-1.129-1.457a315.06 315.06 0 003.501-3.1279c1.579-1.368 2.765-2.085 3.5549-2.159 1.867-.18 3.016 1.1 3.447 3.838.465 2.953.789 4.789.971 5.5079.5765 2.329 1.165 3.4919 1.765 3.4919.499 0 1.25-.7879 2.25-2.3679 1-1.576 1.537-2.7759 1.612-3.5959.144-1.374-.395-2.061-1.614-2.061-.576 0-1.168.132-1.777.391 1.186-3.8679 3.434-5.7568 6.7619-5.6368 2.4729.06 3.6279 1.664 3.4929 4.7969z"/></svg>'
    };
    return icons[platform] || '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>';
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  open() {
    this.renderStats();
    this.renderMediaList();
    this.overlay.classList.add('visible');
    this.isOpen = true;
    document.getElementById('mediathekSearch').focus();
  }

  close() {
    this.overlay.classList.remove('visible');
    this.isOpen = false;
  }

  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }
}

// Export singleton
const mediathekUI = new MediathekUI();
export { mediathekUI };
