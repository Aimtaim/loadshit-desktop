// LoadSh.it Desktop - Main JavaScript

const { invoke } = window.__TAURI__.core;
const { listen } = window.__TAURI__.event;
const { open } = window.__TAURI__.shell;
const { getCurrentWindow } = window.__TAURI__.window;

// Import modules
import { themeManager } from './theme-manager.js';
import { settingsUI } from './settings.js';
import { clipboardMonitor } from './clipboard-monitor.js';
import { queueManager } from './queue-manager.js';
import { historyManager } from './history-manager.js';
import { dockManager } from './dock-manager.js';
import { alerts } from './alerts.js';
import { detectPlatform } from './platforms.js';
import { mediathekUI } from './mediathek.js';

// Window instance
const appWindow = getCurrentWindow();

// DOM Elements
const form = document.getElementById('downloadForm');
const urlInput = document.getElementById('urlInput');
const pasteBtn = document.getElementById('pasteBtn');
const formatSelect = document.getElementById('formatSelect');
const qualitySelect = document.getElementById('qualitySelect');
const downloadBtn = document.getElementById('downloadBtn');
const settingsBtn = document.getElementById('settingsBtn');
const titlebarLink = document.getElementById('titlebarLink');

// Video preview elements
const videoPreview = document.getElementById('videoPreview');
const videoPreviewClose = document.getElementById('videoPreviewClose');
const videoThumbnail = document.getElementById('videoThumbnail');
const videoTitle = document.getElementById('videoTitle');
const videoChannel = document.getElementById('videoChannel');
const videoDuration = document.getElementById('videoDuration');
const qualityButtons = document.getElementById('qualityButtons');
const loadingState = document.getElementById('loadingState');

// Platform icon element
const platformIcon = document.getElementById('platformIcon');
const urlInputWrapper = document.querySelector('.url-input-wrapper');

// Progress elements
const progressSection = document.getElementById('progressSection');
const progressStatus = document.getElementById('progressStatus');
const progressPercent = document.getElementById('progressPercent');
const progressFill = document.getElementById('progressFill');
const progressSpeed = document.getElementById('progressSpeed');
const progressEta = document.getElementById('progressEta');

// Inline progress elements (inside video preview)
const inlineProgress = document.getElementById('inlineProgress');
const inlineProgressStatus = document.getElementById('inlineProgressStatus');
const inlineProgressPercent = document.getElementById('inlineProgressPercent');
const inlineProgressFill = document.getElementById('inlineProgressFill');
const inlineProgressSpeed = document.getElementById('inlineProgressSpeed');
const inlineProgressEta = document.getElementById('inlineProgressEta');

// Success elements
const successSection = document.getElementById('successSection');
const openFolderBtn = document.getElementById('openFolder');
const closeSuccessBtn = document.getElementById('closeSuccess');
const successFilename = document.getElementById('successFilename');

// Auto-close timer for success
let successAutoCloseTimer = null;

// Queue elements
const queueSection = document.getElementById('queueSection');
const queueList = document.getElementById('queueList');
const queueCount = document.getElementById('queueCount');
const clearQueueBtn = document.getElementById('clearQueue');

// Window control elements
const minimizeBtn = document.getElementById('minimizeBtn');
const closeBtn = document.getElementById('closeBtn');
const dockBtn = document.getElementById('dockBtn');

// Mini-widget elements
const miniWidget = document.getElementById('miniWidget');
const miniWidgetInput = document.getElementById('miniWidgetInput');
const miniWidgetPaste = document.getElementById('miniWidgetPaste');
const miniWidgetDownload = document.getElementById('miniWidgetDownload');
const miniWidgetProgress = document.getElementById('miniWidgetProgress');
const miniWidgetProgressBar = document.getElementById('miniWidgetProgressBar');
const miniWidgetProgressText = document.getElementById('miniWidgetProgressText');
const miniWidgetOpenFolder = document.getElementById('miniWidgetOpenFolder');
const miniWidgetUndock = document.getElementById('miniWidgetUndock');
const miniWidgetVideoPreview = document.getElementById('miniWidgetVideoPreview');
const miniWidgetThumbnail = document.getElementById('miniWidgetThumbnail');
const miniWidgetVideoTitle = document.getElementById('miniWidgetVideoTitle');
const miniWidgetVideoChannel = document.getElementById('miniWidgetVideoChannel');
const miniWidgetVideoDuration = document.getElementById('miniWidgetVideoDuration');
const miniWidgetQualityRow = document.getElementById('miniWidgetQualityRow');
const miniWidgetPreviewClose = document.getElementById('miniWidgetPreviewClose');
const miniWidgetLoading = document.getElementById('miniWidgetLoading');

// Mini-mediathek elements
const miniMediathek = document.getElementById('miniMediathek');
const miniMediathekList = document.getElementById('miniMediathekList');
const miniMediathekEmpty = document.getElementById('miniMediathekEmpty');
const miniMediathekClose = document.getElementById('miniMediathekClose');
const miniMediathekFolder = document.getElementById('miniMediathekFolder');

// State
let currentJobId = null;
let downloadDir = '';
let fetchInfoTimeout = null;
let currentVideoInfo = null;
let selectedQuality = 'best';
let miniWidgetVideoInfo = null;
let miniWidgetSelectedQuality = 'best';
let miniWidgetFetchTimeout = null;

// Initialize
async function init() {
  // Get download directory (check custom path first)
  try {
    const customPath = localStorage.getItem('loadshit_download_path');
    if (customPath) {
      downloadDir = customPath;
    } else {
      downloadDir = await invoke('get_download_dir');
    }
  } catch (e) {
    console.error('Failed to get download dir:', e);
  }

  // Listen for download path changes from settings
  window.addEventListener('downloadPathChanged', (e) => {
    downloadDir = e.detail.path;
    console.log('Download path changed to:', downloadDir);
  });

  // Listen for progress updates
  await listen('download_progress', (event) => {
    handleProgress(event.payload);
  });

  // Setup window controls
  setupWindowControls();

  // Setup URL input
  setupUrlInput();

  // Setup titlebar link
  setupTitlebarLink();

  // Setup event listeners
  setupEventListeners();

  // Setup queue manager
  setupQueueManager();

  // Setup clipboard monitor
  setupClipboardMonitor();

  // Initial queue render
  renderQueue();

  // Initialize dock manager
  await dockManager.init();

  // Setup mini-widget
  setupMiniWidget();

  console.log('LoadSh.it Desktop v2.0 initialized');
}

function setupWindowControls() {
  // Minimize
  minimizeBtn.addEventListener('click', () => {
    appWindow.minimize();
  });

  // Close
  closeBtn.addEventListener('click', () => {
    appWindow.close();
  });

  // Dock toggle button
  dockBtn.addEventListener('click', () => {
    dockManager.toggleDock();
  });

  // Window dragging - Tauri 2.0 requires JS API
  const titlebar = document.querySelector('.titlebar');

  // Make titlebar itself draggable
  titlebar.addEventListener('mousedown', async (e) => {
    // Don't drag if clicking on buttons or links
    if (e.target.closest('.titlebar-btn') ||
        e.target.closest('.titlebar-link') ||
        e.target.closest('button') ||
        e.target.closest('a')) {
      return;
    }

    // Start window drag
    await appWindow.startDragging();
  });
}

function setupUrlInput() {
  // Paste button
  pasteBtn.addEventListener('click', async () => {
    try {
      const text = await navigator.clipboard.readText();
      urlInput.value = text;
      updatePlatformIcon(text);
      fetchVideoInfo(text);
    } catch (e) {
      alerts.toastError('Clipboard-Zugriff verweigert');
    }
  });

  // URL input change - fetch video info with debounce
  let inputTimeout = null;
  urlInput.addEventListener('input', () => {
    clearTimeout(inputTimeout);
    const url = urlInput.value.trim();

    // Always update platform icon immediately
    updatePlatformIcon(url);

    if (!url) {
      hideVideoPreview();
      return;
    }

    inputTimeout = setTimeout(() => {
      if (isValidUrl(url)) {
        fetchVideoInfo(url);
      }
    }, 500);
  });

  // Enter key to download
  urlInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      form.dispatchEvent(new Event('submit'));
    }
  });
}

// Update platform icon based on URL
function updatePlatformIcon(url) {
  if (!platformIcon || !urlInputWrapper) return;

  // Remove all platform classes
  const platformClasses = ['youtube', 'tiktok', 'instagram', 'twitter', 'facebook', 'vimeo',
    'twitch', 'reddit', 'soundcloud', 'dailymotion', 'bilibili', 'pinterest',
    'linkedin', 'tumblr', 'spotify', 'vk', 'niconico', 'unknown', 'visible'];
  platformClasses.forEach(cls => platformIcon.classList.remove(cls));
  urlInputWrapper.classList.remove('has-platform');
  platformIcon.innerHTML = '';

  if (!url || url.trim() === '') {
    return;
  }

  const platform = detectPlatform(url);
  if (platform) {
    platformIcon.innerHTML = platform.icon;
    platformIcon.classList.add(platform.key);
    platformIcon.classList.add('visible');
    platformIcon.title = platform.name;
    urlInputWrapper.classList.add('has-platform');
  }
}

function setupMiniWidget() {
  // Paste button - paste URL from clipboard
  miniWidgetPaste.addEventListener('click', async () => {
    try {
      const text = await navigator.clipboard.readText();
      miniWidgetInput.value = text;
      // Trigger video info fetch after paste
      fetchMiniWidgetVideoInfo(text);
    } catch (e) {
      console.error('Clipboard access denied');
    }
  });

  // Input change - fetch video info with debounce
  miniWidgetInput.addEventListener('input', (e) => {
    const url = e.target.value.trim();

    // Clear previous timeout
    if (miniWidgetFetchTimeout) {
      clearTimeout(miniWidgetFetchTimeout);
    }

    // Hide preview if empty
    if (!url) {
      hideMiniWidgetPreview();
      return;
    }

    // Debounce fetch
    miniWidgetFetchTimeout = setTimeout(() => {
      fetchMiniWidgetVideoInfo(url);
    }, 500);
  });

  // Download button - start download
  miniWidgetDownload.addEventListener('click', async () => {
    const url = miniWidgetInput.value.trim();
    if (!url || !isValidUrl(url)) return;

    // Hide open folder button and video preview
    miniWidgetOpenFolder.classList.remove('visible');
    hideMiniWidgetPreview();

    // Show progress
    miniWidgetProgress.classList.add('active');
    miniWidgetProgressBar.style.width = '0%';
    miniWidgetProgressText.textContent = '0%';

    // Disable download button
    miniWidgetDownload.disabled = true;
    miniWidgetDownload.querySelector('span').textContent = 'Lädt...';

    try {
      currentJobId = await invoke('start_download', {
        request: {
          url,
          format: 'mp4',
          quality: miniWidgetSelectedQuality,
          output_dir: downloadDir,
        },
      });
    } catch (error) {
      // Reset on error
      miniWidgetProgress.classList.remove('active');
      miniWidgetDownload.disabled = false;
      miniWidgetDownload.querySelector('span').textContent = 'Download';
      console.error('Mini-widget download error:', error);
    }
  });

  // Open folder button
  miniWidgetOpenFolder.addEventListener('click', async () => {
    try {
      if (downloadDir) {
        await open(downloadDir);
      } else {
        const homeDir = await invoke('get_download_dir');
        await open(homeDir);
      }
    } catch (e) {
      console.error('Failed to open folder:', e);
    }
  });

  // Undock button - exit widget mode
  miniWidgetUndock.addEventListener('click', () => {
    dockManager.exitWidgetMode();
  });

  // Mediathek button in mini-widget - toggles mini-mediathek
  const miniWidgetMediathek = document.getElementById('miniWidgetMediathek');
  if (miniWidgetMediathek) {
    miniWidgetMediathek.addEventListener('click', () => {
      toggleMiniMediathek();
    });
  }

  // Mini-mediathek close button
  if (miniMediathekClose) {
    miniMediathekClose.addEventListener('click', () => {
      hideMiniMediathek();
    });
  }

  // Mini-mediathek folder button
  if (miniMediathekFolder) {
    miniMediathekFolder.addEventListener('click', async () => {
      try {
        if (downloadDir) {
          await open(downloadDir);
        } else {
          const homeDir = await invoke('get_download_dir');
          await open(homeDir);
        }
      } catch (e) {
        console.error('Failed to open folder:', e);
      }
    });
  }

  // Listen for history updates to refresh mini-mediathek
  historyManager.setUpdateHandler(() => {
    renderMiniMediathek();
  });

  // Close video preview button
  miniWidgetPreviewClose.addEventListener('click', () => {
    hideMiniWidgetPreview();
  });

  // Handle Enter key in input
  miniWidgetInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      miniWidgetDownload.click();
    }
  });
}

// Fetch video info for mini widget
async function fetchMiniWidgetVideoInfo(url) {
  if (!url || !isValidUrl(url)) {
    hideMiniWidgetPreview();
    return;
  }

  // Show loading
  miniWidgetLoading.style.display = 'flex';
  hideMiniWidgetPreview();

  try {
    const info = await invoke('get_video_info', { url });
    miniWidgetVideoInfo = info;

    // Update preview
    miniWidgetVideoTitle.textContent = info.title || 'Unbekannt';
    miniWidgetVideoChannel.textContent = info.channel || '';

    if (info.duration) {
      const mins = Math.floor(info.duration / 60);
      const secs = Math.floor(info.duration % 60);
      miniWidgetVideoDuration.textContent = `${mins}:${secs.toString().padStart(2, '0')}`;
    } else {
      miniWidgetVideoDuration.textContent = '';
    }

    if (info.thumbnail) {
      miniWidgetThumbnail.src = info.thumbnail;
      miniWidgetThumbnail.style.display = 'block';
    } else {
      miniWidgetThumbnail.style.display = 'none';
    }

    // Build quality buttons
    buildMiniWidgetQualityButtons(info.formats || []);

    // Show preview
    miniWidgetVideoPreview.classList.add('visible');
  } catch (e) {
    console.error('Failed to fetch mini-widget video info:', e);
  } finally {
    // Hide loading
    miniWidgetLoading.style.display = 'none';
  }
}

// Build quality buttons for mini widget
function buildMiniWidgetQualityButtons(formats) {
  miniWidgetQualityRow.innerHTML = '';

  // Always show these qualities
  const qualities = ['best', '1080p', '720p', '480p'];

  // Create buttons for each quality
  qualities.forEach(quality => {
    const btn = document.createElement('button');
    btn.className = 'mini-widget-quality-btn';
    btn.type = 'button'; // Prevent form submission
    btn.textContent = quality === 'best' ? 'BEST' : quality.toUpperCase();
    btn.dataset.quality = quality;

    if (quality === miniWidgetSelectedQuality) {
      btn.classList.add('selected');
    }

    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();

      // Update selection
      miniWidgetQualityRow.querySelectorAll('.mini-widget-quality-btn').forEach(b => {
        b.classList.remove('selected');
      });
      btn.classList.add('selected');
      miniWidgetSelectedQuality = quality;

      console.log('Mini-widget quality selected:', quality);
    });

    miniWidgetQualityRow.appendChild(btn);
  });
}

// Hide mini widget video preview
function hideMiniWidgetPreview() {
  miniWidgetVideoPreview.classList.remove('visible');
  miniWidgetVideoInfo = null;
}

// Mini-mediathek functions
function toggleMiniMediathek() {
  if (miniMediathek.classList.contains('visible')) {
    hideMiniMediathek();
  } else {
    showMiniMediathek();
  }
}

function showMiniMediathek() {
  miniMediathek.classList.add('visible');
  renderMiniMediathek();
}

function hideMiniMediathek() {
  miniMediathek.classList.remove('visible');
}

function renderMiniMediathek() {
  if (!miniMediathekList) return;

  const history = historyManager.getRecentHistory(20);
  const completedItems = history.filter(item => item.status === 'completed');

  // Group duplicates by URL
  const groupedItems = groupMiniMediathekDuplicates(completedItems);

  // Show/hide empty state
  if (groupedItems.length === 0) {
    miniMediathekEmpty.style.display = 'flex';
    miniMediathekList.innerHTML = '';
    return;
  }

  miniMediathekEmpty.style.display = 'none';

  // Render items (limit to 8 for mini view)
  miniMediathekList.innerHTML = groupedItems.slice(0, 8).map(group => {
    const item = group.item;
    const count = group.count;
    const countBadge = count > 1 ? `<span class="mini-mediathek-count">x${count}</span>` : '';

    return `
      <div class="mini-mediathek-item" data-id="${item.id}" data-filename="${escapeHtml(item.filename || '')}">
        <div class="mini-mediathek-thumb-wrapper">
          ${item.thumbnail
            ? `<img class="mini-mediathek-thumb" src="${escapeHtml(item.thumbnail)}" alt="" onerror="this.outerHTML='<div class=\\'mini-mediathek-thumb-placeholder\\'><svg width=\\'14\\' height=\\'14\\' viewBox=\\'0 0 24 24\\' fill=\\'none\\' stroke=\\'currentColor\\' stroke-width=\\'2\\'><polygon points=\\'5 3 19 12 5 21 5 3\\'></polygon></svg></div>'">`
            : `<div class="mini-mediathek-thumb-placeholder"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg></div>`
          }
          ${countBadge}
        </div>
        <div class="mini-mediathek-info">
          <div class="mini-mediathek-item-title">${escapeHtml(item.title)}</div>
          <div class="mini-mediathek-item-meta">${item.platform} • ${item.quality}</div>
        </div>
      </div>
    `;
  }).join('');

  // Bind click events to open files in media player
  miniMediathekList.querySelectorAll('.mini-mediathek-item').forEach(el => {
    el.addEventListener('click', async () => {
      const filename = el.dataset.filename;
      if (filename && downloadDir) {
        try {
          // Open the file with default media player using backend command
          const filePath = `${downloadDir}/${filename}`;
          await invoke('open_file', { filePath });
        } catch (e) {
          console.error('Failed to open file:', e);
          alerts.show({
            type: 'error',
            title: 'Datei nicht gefunden',
            message: `Die Datei "${filename}" existiert nicht mehr.`
          });
        }
      } else if (downloadDir) {
        await invoke('open_folder', { folderPath: downloadDir });
      }
    });
  });
}

function groupMiniMediathekDuplicates(items) {
  const groups = new Map();

  items.forEach(item => {
    // Use URL as key, fallback to ID if URL is missing
    const key = item.url || item.id || `item_${Date.now()}_${Math.random()}`;

    if (groups.has(key)) {
      const group = groups.get(key);
      group.count++;
      // Keep the most recent download
      if (item.downloadedAt > group.item.downloadedAt) {
        group.item = item;
      }
    } else {
      groups.set(key, { item, count: 1 });
    }
  });

  // Sort by most recent
  return Array.from(groups.values()).sort((a, b) => b.item.downloadedAt - a.item.downloadedAt);
}

function updateMiniWidgetProgress(data) {
  const state = dockManager.getState();
  if (!state.isWidgetMode) return;

  miniWidgetProgressBar.style.width = `${data.progress}%`;
  miniWidgetProgressText.textContent = `${Math.round(data.progress)}%`;

  if (data.status === 'completed') {
    // Hide progress, show open folder
    miniWidgetProgress.classList.remove('active');
    miniWidgetOpenFolder.classList.add('visible');

    // Reset download button
    miniWidgetDownload.disabled = false;
    miniWidgetDownload.querySelector('span').textContent = 'Download';

    // Clear input and reset state
    miniWidgetInput.value = '';
    miniWidgetSelectedQuality = 'best';
    hideMiniWidgetPreview();
  } else if (data.status === 'failed') {
    // Hide progress on failure
    miniWidgetProgress.classList.remove('active');

    // Reset download button
    miniWidgetDownload.disabled = false;
    miniWidgetDownload.querySelector('span').textContent = 'Download';
  }
}

function setupTitlebarLink() {
  // Prevent default link behavior and use Tauri shell open
  titlebarLink.addEventListener('click', async (e) => {
    e.preventDefault();
    try {
      await open('https://loadsh.it');
    } catch (err) {
      console.error('Failed to open link:', err);
    }
  });
}

function setupEventListeners() {
  // Form submit
  form.addEventListener('submit', handleSubmit);

  // Settings button
  settingsBtn.addEventListener('click', () => {
    settingsUI.open();
  });

  // Mediathek button
  const mediathekBtn = document.getElementById('mediathekBtn');
  if (mediathekBtn) {
    mediathekBtn.addEventListener('click', () => {
      mediathekUI.open();
    });
  }

  // Open folder
  openFolderBtn.addEventListener('click', async () => {
    try {
      if (downloadDir) {
        await open(downloadDir);
      } else {
        const homeDir = await invoke('get_download_dir');
        await open(homeDir);
      }
    } catch (e) {
      console.error('Failed to open folder:', e);
    }
  });

  // Close success button
  closeSuccessBtn.addEventListener('click', () => {
    hideSuccess();
  });

  // Close video preview button
  videoPreviewClose.addEventListener('click', () => {
    hideVideoPreview();
    urlInput.value = '';
    updatePlatformIcon('');
  });

  // Clear queue button
  clearQueueBtn.addEventListener('click', async () => {
    const confirmed = await alerts.confirm('Warteschlange leeren', 'Alle Einträge werden entfernt.');
    if (confirmed) {
      queueManager.clearAll();
      alerts.toastSuccess('Warteschlange geleert');
    }
  });

  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    // Ctrl+V in input focuses and pastes
    if (e.ctrlKey && e.key === 'v' && !document.activeElement.matches('input')) {
      urlInput?.focus();
    }

    // Ctrl+, opens settings
    if (e.ctrlKey && e.key === ',') {
      e.preventDefault();
      settingsUI.toggle();
    }

    // Ctrl+D toggles dock mode
    if (e.ctrlKey && e.key === 'd') {
      e.preventDefault();
      dockManager.toggleDock();
    }

    // Ctrl+M opens mediathek
    if (e.ctrlKey && e.key === 'm') {
      e.preventDefault();
      mediathekUI.toggle();
    }
  });

  // Listen for dock state changes
  window.addEventListener('dockStateChange', (e) => {
    const { docked, side } = e.detail;
    const versionBadge = document.querySelector('.titlebar-version');
    if (versionBadge) {
      versionBadge.textContent = docked ? 'DOCKED' : 'DESKTOP V2.0';
    }
  });
}

function setupQueueManager() {
  queueManager.setUpdateHandler((queue) => {
    renderQueue();
  });
}

function setupClipboardMonitor() {
  clipboardMonitor.setUrlHandler((url) => {
    // If input is empty, paste URL there
    if (urlInput && urlInput.value.trim() === '') {
      urlInput.value = url;
      updatePlatformIcon(url);
      fetchVideoInfo(url);
    } else {
      // Add to queue
      addToQueueWithInfo(url);
    }
  });
}

async function addToQueueWithInfo(url) {
  try {
    const info = await invoke('get_video_info', { url });
    queueManager.addToQueue({
      url,
      title: info.title || 'Unbekanntes Video',
      thumbnail: info.thumbnail || '',
      format: 'mp4',
      quality: selectedQuality
    });
  } catch (e) {
    // Add without info
    queueManager.addToQueue({
      url,
      title: 'Unbekanntes Video',
      thumbnail: '',
      format: 'mp4',
      quality: selectedQuality
    });
  }
}

async function handleSubmit(e) {
  e.preventDefault();

  const url = urlInput.value.trim();
  if (!url || !isValidUrl(url)) {
    alerts.warning('Ungültige URL', 'Bitte gib eine gültige Video-URL ein.');
    return;
  }

  // Check if we should add to queue instead of direct download
  const pendingQueueCount = queueManager.getQueueCount();
  if (pendingQueueCount > 0) {
    await addToQueueWithInfo(url);
    urlInput.value = '';
    updatePlatformIcon('');
    hideVideoPreview();
    alerts.toastInfo('Zur Warteschlange hinzugefügt');
    return;
  }

  // Reset UI
  hideSuccess();
  showProgress();

  // Disable button
  downloadBtn.disabled = true;
  downloadBtn.querySelector('.btn-text').textContent = 'LÄDT...';

  try {
    currentJobId = await invoke('start_download', {
      request: {
        url,
        format: 'mp4',
        quality: selectedQuality,
        output_dir: downloadDir,
      },
    });
  } catch (error) {
    alerts.error('Download-Fehler', error.toString());
    resetButton();
    hideProgress();
  }
}

function handleProgress(data) {
  if (data.job_id !== currentJobId) return;

  // Update mini-widget progress if in widget mode
  updateMiniWidgetProgress(data);

  // Update main progress bar
  progressFill.style.width = `${data.progress}%`;
  progressPercent.textContent = `${Math.round(data.progress)}%`;

  // Update inline progress bar (inside video preview)
  updateInlineProgress(data);

  // Update status badge
  updateStatusBadge(data.status);

  // Update speed and ETA
  if (data.speed) {
    progressSpeed.textContent = data.speed;
  }
  if (data.eta) {
    progressEta.textContent = `ETA: ${data.eta}`;
  }

  // Handle completion
  const currentUrl = urlInput?.value || '';

  if (data.status === 'completed') {
    hideProgress();
    showSuccess(data.filename || currentVideoInfo?.title || 'video.mp4');
    resetButton();

    // Add to history
    historyManager.addEntry({
      url: currentUrl,
      title: currentVideoInfo?.title || 'Unbekanntes Video',
      thumbnail: currentVideoInfo?.thumbnail || '',
      format: 'mp4',
      quality: selectedQuality,
      filename: data.filename || '',
      duration: currentVideoInfo?.duration || 0,
      status: 'completed'
    });

    // Show notification
    showNotification('Download abgeschlossen', currentVideoInfo?.title || 'Video wurde heruntergeladen');

    // Reset input and preview
    urlInput.value = '';
    updatePlatformIcon('');
    hideVideoPreview();

    // Toast notification
    alerts.toastSuccess('Download abgeschlossen!');
  } else if (data.status === 'failed') {
    hideProgress();
    alerts.error('Download fehlgeschlagen', data.error || 'Unbekannter Fehler');
    resetButton();

    // Add failed entry to history
    historyManager.addEntry({
      url: currentUrl,
      title: currentVideoInfo?.title || 'Unbekanntes Video',
      thumbnail: currentVideoInfo?.thumbnail || '',
      format: 'mp4',
      quality: selectedQuality,
      status: 'failed',
      error: data.error
    });
  }
}

function updateStatusBadge(status) {
  progressStatus.className = 'status-badge';

  switch (status) {
    case 'starting':
      progressStatus.textContent = 'Starte...';
      break;
    case 'downloading':
      progressStatus.textContent = 'Lädt...';
      progressStatus.classList.add('downloading');
      break;
    case 'merging':
      progressStatus.textContent = 'Finalisiere...';
      progressStatus.classList.add('merging');
      break;
    case 'completed':
      progressStatus.textContent = 'Fertig!';
      progressStatus.classList.add('completed');
      break;
    case 'failed':
      progressStatus.textContent = 'Fehler';
      progressStatus.classList.add('failed');
      break;
  }
}

// Update inline progress bar (inside video preview)
function updateInlineProgress(data) {
  if (!inlineProgress) return;

  // Update progress bar
  inlineProgressFill.style.width = `${data.progress}%`;
  inlineProgressPercent.textContent = `${Math.round(data.progress)}%`;

  // Update status
  inlineProgressStatus.className = 'inline-status';
  switch (data.status) {
    case 'starting':
      inlineProgressStatus.textContent = 'STARTE';
      break;
    case 'downloading':
      inlineProgressStatus.textContent = 'DOWNLOAD';
      inlineProgressStatus.classList.add('downloading');
      break;
    case 'merging':
      inlineProgressStatus.textContent = 'MERGE';
      inlineProgressStatus.classList.add('merging');
      break;
    case 'completed':
      inlineProgressStatus.textContent = 'FERTIG';
      inlineProgressStatus.classList.add('completed');
      break;
    case 'failed':
      inlineProgressStatus.textContent = 'FEHLER';
      inlineProgressStatus.classList.add('failed');
      break;
  }

  // Update speed and ETA
  if (data.speed) {
    inlineProgressSpeed.textContent = data.speed;
  }
  if (data.eta) {
    inlineProgressEta.textContent = `ETA: ${data.eta}`;
  }

  // Hide inline progress on completion or failure
  if (data.status === 'completed' || data.status === 'failed') {
    setTimeout(() => {
      hideInlineProgress();
    }, 2000);
  }
}

function showInlineProgress() {
  if (inlineProgress) {
    inlineProgress.classList.remove('hidden');
    inlineProgressFill.style.width = '0%';
    inlineProgressPercent.textContent = '0%';
    inlineProgressSpeed.textContent = '-- /s';
    inlineProgressEta.textContent = 'ETA: --:--';
    inlineProgressStatus.className = 'inline-status';
    inlineProgressStatus.textContent = 'STARTE';
  }
}

function hideInlineProgress() {
  if (inlineProgress) {
    inlineProgress.classList.add('hidden');
  }
}

async function fetchVideoInfo(url) {
  if (!isValidUrl(url)) {
    hideVideoPreview();
    return;
  }

  // Show loading state
  loadingState.classList.remove('hidden');
  videoPreview.classList.add('hidden');

  try {
    const info = await invoke('get_video_info', { url });
    currentVideoInfo = info;

    // Update preview
    videoTitle.textContent = info.title || 'Unbekannt';
    videoChannel.textContent = info.channel || '';

    if (info.duration) {
      const mins = Math.floor(info.duration / 60);
      const secs = Math.floor(info.duration % 60);
      videoDuration.textContent = `${mins}:${secs.toString().padStart(2, '0')}`;
    } else {
      videoDuration.textContent = '--:--';
    }

    if (info.thumbnail) {
      videoThumbnail.src = info.thumbnail;
      videoThumbnail.onerror = () => {
        videoThumbnail.src = '';
      };
    }

    // Generate quality buttons from available formats
    generateQualityButtons(info.formats || []);

    // Hide loading, show preview
    loadingState.classList.add('hidden');
    videoPreview.classList.remove('hidden');
  } catch (e) {
    loadingState.classList.add('hidden');
    videoPreview.classList.add('hidden');
    currentVideoInfo = null;
    alerts.toastWarning('Video-Info konnte nicht geladen werden');
  }
}

function generateQualityButtons(formats) {
  // Clear existing buttons
  qualityButtons.innerHTML = '';

  // Extract unique video qualities
  const qualities = new Set();

  formats.forEach(f => {
    if (f.height && f.vcodec && f.vcodec !== 'none') {
      qualities.add(f.height);
    }
  });

  // Sort qualities descending
  const sortedQualities = Array.from(qualities).sort((a, b) => b - a);

  // If no qualities found, add default options
  if (sortedQualities.length === 0) {
    sortedQualities.push(1080, 720, 480, 360);
  }

  // Add "Best" option first
  const bestBtn = createQualityButton('best', 'BEST');
  bestBtn.classList.add('selected');
  qualityButtons.appendChild(bestBtn);

  // Add quality buttons
  sortedQualities.slice(0, 5).forEach(quality => {
    const label = `${quality}p`;
    const btn = createQualityButton(quality.toString(), label);
    qualityButtons.appendChild(btn);
  });

  // Reset selected quality
  selectedQuality = 'best';
  qualitySelect.value = 'best';
}

function createQualityButton(value, label) {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'quality-btn';
  btn.textContent = label;
  btn.dataset.quality = value;

  btn.addEventListener('click', () => {
    // Remove selected class from all buttons
    qualityButtons.querySelectorAll('.quality-btn').forEach(b => {
      b.classList.remove('selected');
    });

    // Add selected class to clicked button
    btn.classList.add('selected');

    // Update selected quality
    selectedQuality = value;
    qualitySelect.value = value;
  });

  return btn;
}

function hideVideoPreview() {
  videoPreview.classList.add('hidden');
  loadingState.classList.add('hidden');
  currentVideoInfo = null;
  // Also clear platform icon if input is empty
  if (urlInput && urlInput.value.trim() === '') {
    updatePlatformIcon('');
  }
}

function showProgress() {
  // Hide main progress section (we use inline progress now)
  progressSection.classList.add('hidden');
  progressFill.style.width = '0%';
  progressPercent.textContent = '0%';
  progressSpeed.textContent = '-- /s';
  progressEta.textContent = 'ETA: --:--';

  // Show inline progress (inside video preview)
  showInlineProgress();
}

function hideProgress() {
  progressSection.classList.add('hidden');
  hideInlineProgress();
}

function showSuccess(filename = '') {
  // Clear any existing timer
  if (successAutoCloseTimer) {
    clearTimeout(successAutoCloseTimer);
  }

  // Update filename display
  if (successFilename && filename) {
    successFilename.textContent = filename;
  } else if (successFilename) {
    successFilename.textContent = 'Datei heruntergeladen';
  }

  successSection.classList.remove('hidden');

  // Auto-close after 10 seconds
  successAutoCloseTimer = setTimeout(() => {
    hideSuccess();
  }, 10000);
}

function hideSuccess() {
  // Clear timer
  if (successAutoCloseTimer) {
    clearTimeout(successAutoCloseTimer);
    successAutoCloseTimer = null;
  }

  successSection.classList.add('hidden');
}

function resetButton() {
  downloadBtn.disabled = false;
  downloadBtn.querySelector('.btn-text').textContent = 'DOWNLOAD STARTEN';
}

function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch {
    return false;
  }
}

// Queue Rendering
function renderQueue() {
  const queue = queueManager.getQueue();
  const pendingCount = queueManager.getQueueCount();

  // Update count badge
  queueCount.textContent = pendingCount;

  // Show/hide queue section
  if (queue.length > 0) {
    queueSection.classList.remove('hidden');
  } else {
    queueSection.classList.add('hidden');
    return;
  }

  // Render queue items
  queueList.innerHTML = queue.map(item => `
    <div class="queue-item ${item.status}" data-id="${item.id}">
      <img class="queue-item-thumbnail" src="${item.thumbnail || ''}" alt="" onerror="this.style.display='none'">
      <div class="queue-item-info">
        <div class="queue-item-title">${escapeHtml(item.title)}</div>
        <div class="queue-item-meta">
          <span>MP4</span>
          <span>${item.quality}</span>
        </div>
        ${item.status === 'downloading' ? `
          <div class="queue-item-progress">
            <div class="queue-item-progress-fill" style="width: ${item.progress}%"></div>
          </div>
        ` : ''}
      </div>
      <span class="queue-item-status ${item.status}">
        ${getStatusText(item.status)}
      </span>
      ${item.status !== 'downloading' ? `
        <button class="queue-item-remove" data-action="remove" data-id="${item.id}">✕</button>
      ` : ''}
      ${item.status === 'failed' ? `
        <button class="queue-item-remove" data-action="retry" data-id="${item.id}" style="color: var(--warning)">↻</button>
      ` : ''}
    </div>
  `).join('');

  // Bind queue item actions
  queueList.querySelectorAll('[data-action]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const action = e.target.dataset.action;
      const id = e.target.dataset.id;

      if (action === 'remove') {
        queueManager.removeFromQueue(id);
      } else if (action === 'retry') {
        queueManager.retry(id);
      }
    });
  });
}

function getStatusText(status) {
  switch (status) {
    case 'pending': return 'Wartend';
    case 'downloading': return 'Lädt...';
    case 'completed': return 'Fertig';
    case 'failed': return 'Fehler';
    default: return status;
  }
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Show system notification
async function showNotification(title, body) {
  try {
    // Try Tauri notification plugin first
    if (window.__TAURI__?.notification) {
      const { sendNotification, isPermissionGranted, requestPermission } = window.__TAURI__.notification;
      let permissionGranted = await isPermissionGranted();
      if (!permissionGranted) {
        const permission = await requestPermission();
        permissionGranted = permission === 'granted';
      }
      if (permissionGranted) {
        sendNotification({ title, body });
      }
    } else if ('Notification' in window) {
      // Fallback to Web Notification API
      if (Notification.permission === 'granted') {
        new Notification(title, { body, icon: '/icons/32x32.png' });
      } else if (Notification.permission !== 'denied') {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          new Notification(title, { body, icon: '/icons/32x32.png' });
        }
      }
    }
  } catch (e) {
    console.log('Notification not available:', e);
  }
}

// Initialize on load
init();
