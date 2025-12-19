// LoadSh.it Desktop - Download Queue Manager

const { invoke } = window.__TAURI__.core;
const { listen } = window.__TAURI__.event;

class QueueManager {
  constructor() {
    this.queue = [];
    this.currentIndex = -1;
    this.isProcessing = false;
    this.maxConcurrent = 1; // Process one at a time
    this.onQueueUpdate = null;
    this.onProgressUpdate = null;

    this.init();
  }

  async init() {
    // Load queue from localStorage
    this.loadQueue();

    // Listen for download progress events
    await listen('download_progress', (event) => {
      this.handleProgress(event.payload);
    });
  }

  loadQueue() {
    try {
      const saved = localStorage.getItem('loadshit_download_queue');
      if (saved) {
        this.queue = JSON.parse(saved);
        // Reset any "downloading" status to "pending" on load
        this.queue.forEach(item => {
          if (item.status === 'downloading') {
            item.status = 'pending';
            item.progress = 0;
          }
        });
        this.saveQueue();
      }
    } catch (e) {
      console.error('Failed to load queue:', e);
      this.queue = [];
    }
  }

  saveQueue() {
    try {
      localStorage.setItem('loadshit_download_queue', JSON.stringify(this.queue));
    } catch (e) {
      console.error('Failed to save queue:', e);
    }
  }

  addToQueue(item) {
    const queueItem = {
      id: this.generateId(),
      url: item.url,
      title: item.title || 'Unbekanntes Video',
      thumbnail: item.thumbnail || '',
      format: item.format || 'mp4',
      quality: item.quality || '1080p',
      status: 'pending', // pending, downloading, completed, failed
      progress: 0,
      speed: '',
      eta: '',
      error: null,
      jobId: null,
      addedAt: Date.now()
    };

    this.queue.push(queueItem);
    this.saveQueue();
    this.notifyUpdate();

    // Auto-start processing if not already
    if (!this.isProcessing) {
      this.processQueue();
    }

    return queueItem.id;
  }

  removeFromQueue(id) {
    const index = this.queue.findIndex(item => item.id === id);
    if (index !== -1) {
      // Don't remove if currently downloading
      if (this.queue[index].status === 'downloading') {
        return false;
      }
      this.queue.splice(index, 1);
      this.saveQueue();
      this.notifyUpdate();
      return true;
    }
    return false;
  }

  clearCompleted() {
    this.queue = this.queue.filter(item =>
      item.status !== 'completed' && item.status !== 'failed'
    );
    this.saveQueue();
    this.notifyUpdate();
  }

  clearAll() {
    // Only clear if not processing
    if (this.isProcessing) {
      // Keep the current item, clear rest
      this.queue = this.queue.filter(item => item.status === 'downloading');
    } else {
      this.queue = [];
    }
    this.saveQueue();
    this.notifyUpdate();
  }

  async processQueue() {
    if (this.isProcessing) return;

    // Find next pending item
    const nextItem = this.queue.find(item => item.status === 'pending');
    if (!nextItem) {
      this.isProcessing = false;
      return;
    }

    this.isProcessing = true;
    this.currentIndex = this.queue.indexOf(nextItem);

    // Update status
    nextItem.status = 'downloading';
    nextItem.progress = 0;
    this.saveQueue();
    this.notifyUpdate();

    try {
      // Get download directory
      const downloadDir = await invoke('get_download_dir');

      // Start download
      const jobId = await invoke('start_download', {
        request: {
          url: nextItem.url,
          format: nextItem.format,
          quality: nextItem.quality,
          output_dir: downloadDir
        }
      });

      nextItem.jobId = jobId;
      this.saveQueue();

    } catch (error) {
      nextItem.status = 'failed';
      nextItem.error = error.toString();
      this.saveQueue();
      this.notifyUpdate();

      // Continue with next item
      this.isProcessing = false;
      this.processQueue();
    }
  }

  handleProgress(data) {
    // Find item by jobId
    const item = this.queue.find(i => i.jobId === data.job_id);
    if (!item) return;

    // Update progress
    item.progress = data.progress;
    item.speed = data.speed || '';
    item.eta = data.eta || '';

    if (data.status === 'completed') {
      item.status = 'completed';
      item.progress = 100;
      this.saveQueue();
      this.notifyUpdate();

      // Process next item
      this.isProcessing = false;
      this.processQueue();

    } else if (data.status === 'failed') {
      item.status = 'failed';
      item.error = data.error || 'Download fehlgeschlagen';
      this.saveQueue();
      this.notifyUpdate();

      // Process next item
      this.isProcessing = false;
      this.processQueue();

    } else {
      // Update UI without saving to localStorage on every progress tick
      this.notifyUpdate();
    }
  }

  getQueue() {
    return [...this.queue];
  }

  getQueueCount() {
    return this.queue.filter(item => item.status === 'pending' || item.status === 'downloading').length;
  }

  getPendingCount() {
    return this.queue.filter(item => item.status === 'pending').length;
  }

  getCurrentItem() {
    return this.queue.find(item => item.status === 'downloading') || null;
  }

  setUpdateHandler(handler) {
    this.onQueueUpdate = handler;
  }

  notifyUpdate() {
    if (this.onQueueUpdate) {
      this.onQueueUpdate(this.queue);
    }
  }

  generateId() {
    return `q_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Move item up in queue
  moveUp(id) {
    const index = this.queue.findIndex(item => item.id === id);
    if (index > 0 && this.queue[index].status === 'pending') {
      [this.queue[index], this.queue[index - 1]] = [this.queue[index - 1], this.queue[index]];
      this.saveQueue();
      this.notifyUpdate();
      return true;
    }
    return false;
  }

  // Move item down in queue
  moveDown(id) {
    const index = this.queue.findIndex(item => item.id === id);
    if (index < this.queue.length - 1 && this.queue[index].status === 'pending') {
      [this.queue[index], this.queue[index + 1]] = [this.queue[index + 1], this.queue[index]];
      this.saveQueue();
      this.notifyUpdate();
      return true;
    }
    return false;
  }

  // Retry a failed download
  retry(id) {
    const item = this.queue.find(i => i.id === id);
    if (item && item.status === 'failed') {
      item.status = 'pending';
      item.progress = 0;
      item.error = null;
      item.jobId = null;
      this.saveQueue();
      this.notifyUpdate();

      if (!this.isProcessing) {
        this.processQueue();
      }
      return true;
    }
    return false;
  }
}

// Export singleton
const queueManager = new QueueManager();
export { queueManager };
