// LoadSh.it Desktop - Main JavaScript

const { invoke } = window.__TAURI__.core;
const { listen } = window.__TAURI__.event;
const { open } = window.__TAURI__.shell;

// DOM Elements
const form = document.getElementById('downloadForm');
const urlInput = document.getElementById('videoUrl');
const formatSelect = document.getElementById('formatSelect');
const qualitySelect = document.getElementById('qualitySelect');
const downloadBtn = document.getElementById('downloadBtn');
const pasteBtn = document.getElementById('pasteBtn');

const videoInfo = document.getElementById('videoInfo');
const videoThumbnail = document.getElementById('videoThumbnail');
const videoTitle = document.getElementById('videoTitle');
const videoChannel = document.getElementById('videoChannel');
const videoDuration = document.getElementById('videoDuration');

const progressSection = document.getElementById('progressSection');
const progressStatus = document.getElementById('progressStatus');
const progressPercent = document.getElementById('progressPercent');
const progressFill = document.getElementById('progressFill');
const progressSpeed = document.getElementById('progressSpeed');
const progressEta = document.getElementById('progressEta');

const errorSection = document.getElementById('errorSection');
const errorMessage = document.getElementById('errorMessage');
const errorDismiss = document.getElementById('errorDismiss');

const successSection = document.getElementById('successSection');
const openFolderBtn = document.getElementById('openFolder');

// State
let currentJobId = null;
let downloadDir = '';
let fetchInfoTimeout = null;

// Initialize
async function init() {
  // Get download directory
  try {
    downloadDir = await invoke('get_download_dir');
  } catch (e) {
    console.error('Failed to get download dir:', e);
  }

  // Listen for progress updates
  await listen('download_progress', (event) => {
    handleProgress(event.payload);
  });

  // Setup event listeners
  setupEventListeners();
}

function setupEventListeners() {
  // Form submit
  form.addEventListener('submit', handleSubmit);

  // Paste button
  pasteBtn.addEventListener('click', async () => {
    try {
      const text = await navigator.clipboard.readText();
      urlInput.value = text;
      urlInput.dispatchEvent(new Event('input'));
    } catch (e) {
      console.error('Clipboard access denied');
    }
  });

  // URL input - fetch video info on paste/change
  urlInput.addEventListener('input', () => {
    clearTimeout(fetchInfoTimeout);
    fetchInfoTimeout = setTimeout(() => {
      const url = urlInput.value.trim();
      if (url && isValidUrl(url)) {
        fetchVideoInfo(url);
      } else {
        hideVideoInfo();
      }
    }, 500);
  });

  // Error dismiss
  errorDismiss.addEventListener('click', () => {
    errorSection.classList.add('hidden');
  });

  // Open folder
  openFolderBtn.addEventListener('click', async () => {
    try {
      await open(downloadDir);
    } catch (e) {
      console.error('Failed to open folder:', e);
    }
  });

  // Format change - show/hide quality based on audio formats
  formatSelect.addEventListener('change', () => {
    const isAudio = ['mp3', 'aac', 'wav', 'flac', 'ogg'].includes(formatSelect.value);
    qualitySelect.parentElement.style.opacity = isAudio ? '0.5' : '1';
    qualitySelect.disabled = isAudio;
  });
}

async function handleSubmit(e) {
  e.preventDefault();

  const url = urlInput.value.trim();
  if (!url) return;

  // Reset UI
  hideError();
  hideSuccess();
  showProgress();

  // Disable button
  downloadBtn.disabled = true;
  downloadBtn.querySelector('.btn-text').textContent = 'LÄDT...';

  try {
    currentJobId = await invoke('start_download', {
      request: {
        url,
        format: formatSelect.value,
        quality: qualitySelect.value,
        output_dir: downloadDir,
      },
    });
  } catch (error) {
    showError(error.toString());
    resetButton();
  }
}

function handleProgress(data) {
  if (data.job_id !== currentJobId) return;

  // Update progress bar
  progressFill.style.width = `${data.progress}%`;
  progressPercent.textContent = `${Math.round(data.progress)}%`;

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
  if (data.status === 'completed') {
    hideProgress();
    showSuccess();
    resetButton();
  } else if (data.status === 'failed') {
    hideProgress();
    showError(data.error || 'Download fehlgeschlagen');
    resetButton();
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

async function fetchVideoInfo(url) {
  try {
    const info = await invoke('get_video_info', { url });

    videoTitle.textContent = info.title || 'Unbekannt';
    videoChannel.textContent = info.channel || '';

    if (info.duration) {
      const mins = Math.floor(info.duration / 60);
      const secs = Math.floor(info.duration % 60);
      videoDuration.textContent = `${mins}:${secs.toString().padStart(2, '0')}`;
    } else {
      videoDuration.textContent = '';
    }

    if (info.thumbnail) {
      videoThumbnail.src = info.thumbnail;
      videoThumbnail.onerror = () => {
        videoThumbnail.src = '';
      };
    }

    videoInfo.classList.remove('hidden');
  } catch (e) {
    hideVideoInfo();
  }
}

function hideVideoInfo() {
  videoInfo.classList.add('hidden');
}

function showProgress() {
  progressSection.classList.remove('hidden');
  progressFill.style.width = '0%';
  progressPercent.textContent = '0%';
  progressSpeed.textContent = '-- /s';
  progressEta.textContent = 'ETA: --:--';
}

function hideProgress() {
  progressSection.classList.add('hidden');
}

function showError(message) {
  errorMessage.textContent = message;
  errorSection.classList.remove('hidden');
}

function hideError() {
  errorSection.classList.add('hidden');
}

function showSuccess() {
  successSection.classList.remove('hidden');
}

function hideSuccess() {
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

// Format duration
function formatDuration(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);

  if (h > 0) {
    return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }
  return `${m}:${s.toString().padStart(2, '0')}`;
}

// Initialize on load
init();
