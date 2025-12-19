// LoadSh.it Desktop - Custom Alerts System

class AlertManager {
  constructor() {
    this.overlay = null;
    this.toastContainer = null;
    this.init();
  }

  init() {
    // Create alert overlay
    this.overlay = document.createElement('div');
    this.overlay.className = 'alert-overlay';
    this.overlay.innerHTML = `
      <div class="alert-box">
        <div class="alert-header">
          <svg class="alert-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"></svg>
          <span class="alert-title"></span>
        </div>
        <div class="alert-content">
          <p class="alert-message"></p>
        </div>
        <div class="alert-actions"></div>
      </div>
    `;
    document.body.appendChild(this.overlay);

    // Create toast container
    this.toastContainer = document.createElement('div');
    this.toastContainer.className = 'toast-container';
    document.body.appendChild(this.toastContainer);

    // Close on overlay click
    this.overlay.addEventListener('click', (e) => {
      if (e.target === this.overlay) {
        this.close();
      }
    });

    // Close on ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.overlay.classList.contains('visible')) {
        this.close();
      }
    });
  }

  _getIcon(type) {
    const icons = {
      success: '<polyline points="20 6 9 17 4 12"></polyline>',
      error: '<circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line>',
      warning: '<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line>',
      info: '<circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line>'
    };
    return icons[type] || icons.info;
  }

  show({ type = 'info', title, message, buttons = [] }) {
    return new Promise((resolve) => {
      const box = this.overlay.querySelector('.alert-box');
      const icon = this.overlay.querySelector('.alert-icon');
      const titleEl = this.overlay.querySelector('.alert-title');
      const messageEl = this.overlay.querySelector('.alert-message');
      const actionsEl = this.overlay.querySelector('.alert-actions');

      // Set type
      box.className = `alert-box ${type}`;
      icon.innerHTML = this._getIcon(type);
      titleEl.textContent = title;
      messageEl.textContent = message;

      // Create buttons
      actionsEl.innerHTML = '';
      if (buttons.length === 0) {
        buttons = [{ text: 'OK', primary: true, value: true }];
      }

      buttons.forEach(btn => {
        const button = document.createElement('button');
        button.className = `alert-btn ${btn.primary ? 'alert-btn-primary' : 'alert-btn-secondary'}`;
        button.textContent = btn.text;
        button.addEventListener('click', () => {
          this.close();
          resolve(btn.value);
        });
        actionsEl.appendChild(button);
      });

      // Show
      this.overlay.classList.add('visible');
    });
  }

  close() {
    this.overlay.classList.remove('visible');
  }

  // Shorthand methods
  success(title, message) {
    return this.show({ type: 'success', title, message });
  }

  error(title, message) {
    return this.show({ type: 'error', title, message });
  }

  warning(title, message) {
    return this.show({ type: 'warning', title, message });
  }

  info(title, message) {
    return this.show({ type: 'info', title, message });
  }

  confirm(title, message) {
    return this.show({
      type: 'warning',
      title,
      message,
      buttons: [
        { text: 'Abbrechen', primary: false, value: false },
        { text: 'Bestätigen', primary: true, value: true }
      ]
    });
  }

  // Custom dialog for selecting delete count (for duplicates)
  selectDeleteCount(title, count) {
    return new Promise((resolve) => {
      const box = this.overlay.querySelector('.alert-box');
      const icon = this.overlay.querySelector('.alert-icon');
      const titleEl = this.overlay.querySelector('.alert-title');
      const messageEl = this.overlay.querySelector('.alert-message');
      const actionsEl = this.overlay.querySelector('.alert-actions');

      box.className = 'alert-box warning';
      icon.innerHTML = this._getIcon('warning');
      titleEl.textContent = title;

      // Create custom content with selection
      const contentEl = this.overlay.querySelector('.alert-content');
      contentEl.innerHTML = `
        <p class="alert-message">Du hast ${count} Kopien dieses Videos. Wie viele möchtest du löschen?</p>
        <div class="delete-count-selector">
          <label class="delete-option">
            <input type="radio" name="deleteCount" value="1" checked>
            <span class="delete-option-label">1 Kopie löschen</span>
          </label>
          ${count > 2 ? `
          <label class="delete-option">
            <input type="radio" name="deleteCount" value="${count - 1}">
            <span class="delete-option-label">${count - 1} Kopien löschen (eine behalten)</span>
          </label>
          ` : ''}
          <label class="delete-option">
            <input type="radio" name="deleteCount" value="${count}">
            <span class="delete-option-label">Alle ${count} Kopien löschen</span>
          </label>
        </div>
      `;

      // Create buttons
      actionsEl.innerHTML = '';

      const cancelBtn = document.createElement('button');
      cancelBtn.className = 'alert-btn alert-btn-secondary';
      cancelBtn.textContent = 'Abbrechen';
      cancelBtn.addEventListener('click', () => {
        contentEl.innerHTML = '<p class="alert-message"></p>';
        this.close();
        resolve(null);
      });

      const confirmBtn = document.createElement('button');
      confirmBtn.className = 'alert-btn alert-btn-primary';
      confirmBtn.textContent = 'Löschen';
      confirmBtn.addEventListener('click', () => {
        const selected = contentEl.querySelector('input[name="deleteCount"]:checked');
        const deleteCount = selected ? parseInt(selected.value) : 0;
        contentEl.innerHTML = '<p class="alert-message"></p>';
        this.close();
        resolve(deleteCount);
      });

      actionsEl.appendChild(cancelBtn);
      actionsEl.appendChild(confirmBtn);

      this.overlay.classList.add('visible');
    });
  }

  // Toast notifications
  toast({ type = 'info', message, duration = 4000 }) {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
      <svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        ${this._getIcon(type)}
      </svg>
      <span class="toast-message">${message}</span>
      <button class="toast-close">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    `;

    this.toastContainer.appendChild(toast);

    // Animate in
    requestAnimationFrame(() => {
      toast.classList.add('visible');
    });

    // Close button
    toast.querySelector('.toast-close').addEventListener('click', () => {
      this._removeToast(toast);
    });

    // Auto close
    if (duration > 0) {
      setTimeout(() => {
        this._removeToast(toast);
      }, duration);
    }
  }

  _removeToast(toast) {
    toast.classList.remove('visible');
    setTimeout(() => {
      toast.remove();
    }, 200);
  }

  // Toast shorthands
  toastSuccess(message) {
    this.toast({ type: 'success', message });
  }

  toastError(message) {
    this.toast({ type: 'error', message });
  }

  toastWarning(message) {
    this.toast({ type: 'warning', message });
  }

  toastInfo(message) {
    this.toast({ type: 'info', message });
  }
}

export const alerts = new AlertManager();
