// LoadSh.it Desktop - Download History Manager

const MAX_HISTORY_ITEMS = 100;
const STORAGE_KEY = 'loadshit_download_history';

class HistoryManager {
  constructor() {
    this.history = [];
    this.onHistoryUpdate = null;
    this.loadHistory();
  }

  loadHistory() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        this.history = JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load history:', e);
      this.history = [];
    }
  }

  saveHistory() {
    try {
      // Limit to max items
      if (this.history.length > MAX_HISTORY_ITEMS) {
        this.history = this.history.slice(0, MAX_HISTORY_ITEMS);
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.history));
    } catch (e) {
      console.error('Failed to save history:', e);
    }
  }

  addEntry(entry) {
    const historyEntry = {
      id: this.generateId(),
      url: entry.url,
      title: entry.title || 'Unbekanntes Video',
      thumbnail: entry.thumbnail || '',
      format: entry.format,
      quality: entry.quality,
      filename: entry.filename || '',
      filesize: entry.filesize || 0,
      duration: entry.duration || 0,
      platform: this.detectPlatform(entry.url),
      status: entry.status || 'completed', // completed, failed
      error: entry.error || null,
      downloadedAt: Date.now()
    };

    // Add to beginning of array (newest first)
    this.history.unshift(historyEntry);
    this.saveHistory();
    this.notifyUpdate();

    return historyEntry.id;
  }

  removeEntry(id) {
    const index = this.history.findIndex(item => item.id === id);
    if (index !== -1) {
      this.history.splice(index, 1);
      this.saveHistory();
      this.notifyUpdate();
      return true;
    }
    return false;
  }

  clearHistory() {
    this.history = [];
    this.saveHistory();
    this.notifyUpdate();
  }

  clearFailed() {
    this.history = this.history.filter(item => item.status !== 'failed');
    this.saveHistory();
    this.notifyUpdate();
  }

  getHistory() {
    return [...this.history];
  }

  getRecentHistory(limit = 10) {
    return this.history.slice(0, limit);
  }

  searchHistory(query) {
    const lowerQuery = query.toLowerCase();
    return this.history.filter(item =>
      item.title.toLowerCase().includes(lowerQuery) ||
      item.url.toLowerCase().includes(lowerQuery) ||
      item.platform.toLowerCase().includes(lowerQuery)
    );
  }

  getByPlatform(platform) {
    return this.history.filter(item =>
      item.platform.toLowerCase() === platform.toLowerCase()
    );
  }

  getStats() {
    const completed = this.history.filter(item => item.status === 'completed');
    const failed = this.history.filter(item => item.status === 'failed');

    const platforms = {};
    completed.forEach(item => {
      platforms[item.platform] = (platforms[item.platform] || 0) + 1;
    });

    const formats = {};
    completed.forEach(item => {
      formats[item.format] = (formats[item.format] || 0) + 1;
    });

    const totalSize = completed.reduce((acc, item) => acc + (item.filesize || 0), 0);

    return {
      totalDownloads: completed.length,
      failedDownloads: failed.length,
      totalSize: totalSize,
      platforms: platforms,
      formats: formats,
      firstDownload: this.history.length > 0 ? this.history[this.history.length - 1].downloadedAt : null,
      lastDownload: this.history.length > 0 ? this.history[0].downloadedAt : null
    };
  }

  detectPlatform(url) {
    if (!url) return 'Unknown';

    const patterns = {
      'YouTube': /youtube\.com|youtu\.be/i,
      'TikTok': /tiktok\.com/i,
      'Instagram': /instagram\.com/i,
      'Twitter': /twitter\.com|x\.com/i,
      'Twitch': /twitch\.tv/i,
      'Reddit': /reddit\.com|redd\.it/i,
      'Vimeo': /vimeo\.com/i,
      'Dailymotion': /dailymotion\.com/i,
      'SoundCloud': /soundcloud\.com/i,
      'Facebook': /facebook\.com|fb\.watch/i,
      'Spotify': /spotify\.com/i,
      'Bandcamp': /bandcamp\.com/i
    };

    for (const [platform, pattern] of Object.entries(patterns)) {
      if (pattern.test(url)) {
        return platform;
      }
    }

    return 'Other';
  }

  setUpdateHandler(handler) {
    this.onHistoryUpdate = handler;
  }

  notifyUpdate() {
    if (this.onHistoryUpdate) {
      this.onHistoryUpdate(this.history);
    }
  }

  generateId() {
    return `h_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Export history as JSON
  exportHistory() {
    return JSON.stringify(this.history, null, 2);
  }

  // Import history from JSON
  importHistory(jsonString, merge = true) {
    try {
      const imported = JSON.parse(jsonString);
      if (!Array.isArray(imported)) {
        throw new Error('Invalid history format');
      }

      if (merge) {
        // Merge with existing, avoiding duplicates by URL
        const existingUrls = new Set(this.history.map(item => item.url));
        const newItems = imported.filter(item => !existingUrls.has(item.url));
        this.history = [...this.history, ...newItems];
      } else {
        this.history = imported;
      }

      // Sort by date (newest first)
      this.history.sort((a, b) => b.downloadedAt - a.downloadedAt);

      this.saveHistory();
      this.notifyUpdate();
      return true;
    } catch (e) {
      console.error('Failed to import history:', e);
      return false;
    }
  }

  // Format filesize for display
  formatFilesize(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // Format timestamp for display
  formatDate(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;

    // Today
    if (diff < 86400000 && date.getDate() === now.getDate()) {
      return `Heute, ${date.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}`;
    }

    // Yesterday
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    if (date.getDate() === yesterday.getDate() &&
        date.getMonth() === yesterday.getMonth() &&
        date.getFullYear() === yesterday.getFullYear()) {
      return `Gestern, ${date.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}`;
    }

    // This week
    if (diff < 604800000) {
      return date.toLocaleDateString('de-DE', {
        weekday: 'long',
        hour: '2-digit',
        minute: '2-digit'
      });
    }

    // Older
    return date.toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}

// Export singleton
const historyManager = new HistoryManager();
export { historyManager };
