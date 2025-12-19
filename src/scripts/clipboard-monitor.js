// LoadSh.it Desktop - Clipboard Monitor

// Supported video platforms regex patterns
const VIDEO_URL_PATTERNS = [
  // YouTube
  /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=[\w-]+/i,
  /(?:https?:\/\/)?(?:www\.)?youtu\.be\/[\w-]+/i,
  /(?:https?:\/\/)?(?:www\.)?youtube\.com\/shorts\/[\w-]+/i,

  // TikTok
  /(?:https?:\/\/)?(?:www\.)?tiktok\.com\/@[\w.-]+\/video\/\d+/i,
  /(?:https?:\/\/)?(?:vm\.)?tiktok\.com\/[\w-]+/i,

  // Instagram
  /(?:https?:\/\/)?(?:www\.)?instagram\.com\/(?:p|reel|tv)\/[\w-]+/i,

  // Twitter/X
  /(?:https?:\/\/)?(?:www\.)?(?:twitter|x)\.com\/\w+\/status\/\d+/i,

  // Twitch
  /(?:https?:\/\/)?(?:www\.)?twitch\.tv\/videos\/\d+/i,
  /(?:https?:\/\/)?clips\.twitch\.tv\/[\w-]+/i,

  // Reddit
  /(?:https?:\/\/)?(?:www\.)?reddit\.com\/r\/\w+\/comments\/[\w-]+/i,
  /(?:https?:\/\/)?v\.redd\.it\/[\w-]+/i,

  // Vimeo
  /(?:https?:\/\/)?(?:www\.)?vimeo\.com\/\d+/i,

  // Dailymotion
  /(?:https?:\/\/)?(?:www\.)?dailymotion\.com\/video\/[\w-]+/i,

  // SoundCloud
  /(?:https?:\/\/)?(?:www\.)?soundcloud\.com\/[\w-]+\/[\w-]+/i,

  // Facebook
  /(?:https?:\/\/)?(?:www\.)?facebook\.com\/.*\/videos\/\d+/i,
  /(?:https?:\/\/)?(?:www\.)?fb\.watch\/[\w-]+/i,

  // General video URLs
  /(?:https?:\/\/)?[\w.-]+\.[\w]{2,}\/.*\.(mp4|webm|mkv|avi|mov)/i,
];

class ClipboardMonitor {
  constructor() {
    this.isEnabled = true;
    this.lastClipboardContent = '';
    this.checkInterval = null;
    this.indicator = null;
    this.detectedUrl = null;
    this.onUrlDetected = null;

    this.init();
  }

  init() {
    this.indicator = document.getElementById('clipboardIndicator');
    this.addButton = document.getElementById('clipboardAddBtn');

    if (this.addButton) {
      this.addButton.addEventListener('click', () => this.handleAddUrl());
    }

    // Load preference
    this.isEnabled = localStorage.getItem('loadshit_clipboard_monitor') !== 'false';

    if (this.isEnabled) {
      this.start();
    }
  }

  start() {
    if (this.checkInterval) return;

    // Check clipboard every 1.5 seconds
    this.checkInterval = setInterval(() => this.checkClipboard(), 1500);
    console.log('Clipboard monitor started');
  }

  stop() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
    console.log('Clipboard monitor stopped');
  }

  enable() {
    this.isEnabled = true;
    localStorage.setItem('loadshit_clipboard_monitor', 'true');
    this.start();
  }

  disable() {
    this.isEnabled = false;
    localStorage.setItem('loadshit_clipboard_monitor', 'false');
    this.stop();
    this.hideIndicator();
  }

  toggle() {
    if (this.isEnabled) {
      this.disable();
    } else {
      this.enable();
    }
    return this.isEnabled;
  }

  async checkClipboard() {
    try {
      const text = await navigator.clipboard.readText();

      // Skip if same as last check
      if (text === this.lastClipboardContent) return;

      this.lastClipboardContent = text;

      // Check if it's a video URL
      const url = this.extractVideoUrl(text);
      if (url) {
        this.detectedUrl = url;
        this.showIndicator(url);
      }
    } catch (e) {
      // Clipboard access denied or empty - ignore silently
    }
  }

  extractVideoUrl(text) {
    if (!text) return null;

    // Clean up the text
    const cleaned = text.trim();

    // Check against patterns
    for (const pattern of VIDEO_URL_PATTERNS) {
      const match = cleaned.match(pattern);
      if (match) {
        return match[0];
      }
    }

    // Also check if it's a general valid URL
    try {
      const url = new URL(cleaned);
      if (url.protocol === 'http:' || url.protocol === 'https:') {
        // Basic heuristic: if it contains video-related keywords
        const videoKeywords = ['video', 'watch', 'clip', 'stream', 'play'];
        if (videoKeywords.some(kw => cleaned.toLowerCase().includes(kw))) {
          return cleaned;
        }
      }
    } catch {
      // Not a valid URL
    }

    return null;
  }

  showIndicator(url) {
    if (!this.indicator) return;

    // Update URL text if exists
    const urlText = this.indicator.querySelector('.clipboard-url');
    if (urlText) {
      urlText.textContent = url;
    }

    this.indicator.classList.remove('hidden');
    this.indicator.classList.add('visible');

    // Auto-hide after 8 seconds
    setTimeout(() => {
      if (this.detectedUrl === url) {
        this.hideIndicator();
      }
    }, 8000);
  }

  hideIndicator() {
    if (!this.indicator) return;

    this.indicator.classList.remove('visible');
    this.indicator.classList.add('hidden');
    this.detectedUrl = null;
  }

  handleAddUrl() {
    if (this.detectedUrl && this.onUrlDetected) {
      this.onUrlDetected(this.detectedUrl);
      this.hideIndicator();
      // Clear so we don't detect the same URL again immediately
      this.lastClipboardContent = '';
    }
  }

  setUrlHandler(handler) {
    this.onUrlDetected = handler;
  }

  getDetectedUrl() {
    return this.detectedUrl;
  }

  isRunning() {
    return this.checkInterval !== null;
  }
}

// Export singleton
const clipboardMonitor = new ClipboardMonitor();
export { clipboardMonitor };
