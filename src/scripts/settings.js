// LoadSh.it Desktop - Settings Module

import { themeManager, THEMES } from './theme-manager.js';

const { open } = window.__TAURI__.shell;
const { invoke } = window.__TAURI__.core;

class SettingsUI {
  constructor() {
    this.overlay = null;
    this.isOpen = false;
    this.init();
  }

  init() {
    this.createSettingsModal();
    this.bindEvents();
  }

  createSettingsModal() {
    const overlay = document.createElement('div');
    overlay.className = 'settings-overlay';
    overlay.id = 'settingsOverlay';

    overlay.innerHTML = `
      <div class="settings-modal">
        <div class="settings-header">
          <h2>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
            </svg>
            Einstellungen
          </h2>
          <button class="close-settings-btn" id="closeSettings">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div class="settings-content">
          <!-- Download Location -->
          <div class="settings-section">
            <h3>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
              </svg>
              Speicherort
            </h3>
            <div class="setting-row">
              <div class="setting-info">
                <div class="setting-label">Download-Ordner</div>
                <div class="setting-desc download-path" id="downloadPathDisplay">Standard (Downloads)</div>
              </div>
              <div class="folder-picker-wrapper">
                <button class="file-input-btn" id="selectDownloadFolder">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                  </svg>
                  Ändern
                </button>
                <button class="clear-bg-btn" id="resetDownloadFolder" title="Zurücksetzen">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
                    <path d="M3 3v5h5"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- Theme Section -->
          <div class="settings-section">
            <div class="section-header-row">
              <h3>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="13.5" cy="6.5" r="2.5"></circle>
                  <circle cx="17.5" cy="10.5" r="2.5"></circle>
                  <circle cx="8.5" cy="7.5" r="2.5"></circle>
                  <circle cx="6.5" cy="12.5" r="2.5"></circle>
                  <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.555C21.965 6.012 17.461 2 12 2z"></path>
                </svg>
                Farbschema
              </h3>
              <div class="mode-toggle" id="modeToggle">
                <button class="mode-btn" data-mode="light" title="Hell">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="5"></circle>
                    <line x1="12" y1="1" x2="12" y2="3"></line>
                    <line x1="12" y1="21" x2="12" y2="23"></line>
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                    <line x1="1" y1="12" x2="3" y2="12"></line>
                    <line x1="21" y1="12" x2="23" y2="12"></line>
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                  </svg>
                </button>
                <button class="mode-btn active" data-mode="dark" title="Dunkel">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                  </svg>
                </button>
              </div>
            </div>
            <div class="theme-grid" id="themeGrid">
              ${this.renderThemeCards()}
            </div>
          </div>

          <!-- Custom Accent Color -->
          <div class="settings-section">
            <h3>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path>
              </svg>
              Eigene Akzentfarbe
            </h3>
            <div class="setting-row">
              <div class="setting-info">
                <div class="setting-label">Farbe wählen</div>
                <div class="setting-desc">Überschreibt die Theme-Akzentfarbe</div>
              </div>
              <div class="color-picker-wrapper">
                <input type="color" class="color-picker" id="accentColorPicker" value="#00ff88">
                <span class="color-value" id="accentColorValue">#00ff88</span>
                <button class="reset-color-btn" id="resetAccentColor">Reset</button>
              </div>
            </div>
          </div>

          <!-- App Opacity -->
          <div class="settings-section">
            <h3>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M12 2a10 10 0 0 1 0 20"></path>
              </svg>
              Deckkraft
            </h3>
            <div class="setting-row">
              <div class="setting-info">
                <div class="setting-label">App Transparenz</div>
                <div class="setting-desc">Deckkraft der Anwendung (30-100%)</div>
              </div>
              <div class="slider-container">
                <input type="range" class="slider-input" id="opacitySlider" min="30" max="100" value="100">
                <span class="slider-value" id="opacityValue">100%</span>
              </div>
            </div>
          </div>

          <!-- Background Image -->
          <div class="settings-section">
            <h3>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                <polyline points="21 15 16 10 5 21"></polyline>
              </svg>
              Hintergrundbild
            </h3>
            <div class="setting-row">
              <div class="setting-info">
                <div class="setting-label">Bild auswählen</div>
                <div class="setting-desc">Nur WebP-Format (optimierte Dateigröße)</div>
              </div>
              <div class="file-input-wrapper">
                <button class="file-input-btn" id="selectBgImage">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="17 8 12 3 7 8"></polyline>
                    <line x1="12" y1="3" x2="12" y2="15"></line>
                  </svg>
                  Durchsuchen
                </button>
                <button class="clear-bg-btn" id="clearBgImage">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  </svg>
                </button>
                <input type="file" class="hidden-file-input" id="bgImageInput" accept=".webp,image/webp">
              </div>
            </div>
            <div class="bg-preview" id="bgPreview">
              <img id="bgPreviewImg" src="" alt="Hintergrund Vorschau">
            </div>
            <div class="converter-hint">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
              <span>PNG oder JPG? </span>
              <a href="#" id="converterLink">Hier konvertieren</a>
            </div>
          </div>
        </div>

        <div class="settings-footer">
          <button class="footer-btn danger" id="resetSettings">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
              <path d="M3 3v5h5"></path>
            </svg>
            Reset
          </button>
          <span class="version-info">v2.0</span>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);
    this.overlay = overlay;
  }

  renderThemeCards() {
    return Object.entries(THEMES).map(([key, theme]) => `
      <div class="theme-card" data-theme="${key}">
        <div class="theme-color-swatch" style="background: ${theme.color}"></div>
        <div class="theme-name">${theme.name}</div>
        <div class="theme-desc">${theme.description}</div>
      </div>
    `).join('');
  }

  bindEvents() {
    // Close button
    document.getElementById('closeSettings').addEventListener('click', () => this.close());

    // Click outside to close
    this.overlay.addEventListener('click', (e) => {
      if (e.target === this.overlay) this.close();
    });

    // ESC key to close
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) this.close();
    });

    // Theme selection
    document.getElementById('themeGrid').addEventListener('click', (e) => {
      const card = e.target.closest('.theme-card');
      if (card) {
        const themeName = card.dataset.theme;
        themeManager.setTheme(themeName);
        this.updateActiveTheme();
      }
    });

    // Dark/Light mode toggle
    document.getElementById('modeToggle').addEventListener('click', (e) => {
      const btn = e.target.closest('.mode-btn');
      if (btn) {
        const mode = btn.dataset.mode;
        const isDark = mode === 'dark';
        themeManager.setDarkMode(isDark);
        this.updateModeToggle();
      }
    });

    // Accent color
    const accentPicker = document.getElementById('accentColorPicker');
    const accentValue = document.getElementById('accentColorValue');
    accentPicker.addEventListener('input', (e) => {
      const color = e.target.value;
      accentValue.textContent = color;
      themeManager.setCustomAccent(color);
    });

    document.getElementById('resetAccentColor').addEventListener('click', () => {
      themeManager.clearCustomAccent();
      accentPicker.value = '#00ff88';
      accentValue.textContent = '#00ff88';
    });

    // Opacity slider
    const opacitySlider = document.getElementById('opacitySlider');
    const opacityValue = document.getElementById('opacityValue');
    opacitySlider.addEventListener('input', (e) => {
      const value = e.target.value;
      opacityValue.textContent = `${value}%`;
      themeManager.setAppOpacity(parseInt(value));
    });

    // Background image
    const bgInput = document.getElementById('bgImageInput');
    document.getElementById('selectBgImage').addEventListener('click', () => bgInput.click());

    bgInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        // Verify it's WebP
        if (!file.type.includes('webp') && !file.name.toLowerCase().endsWith('.webp')) {
          alert('Bitte nur WebP-Dateien verwenden. Du kannst andere Formate auf loadsh.it/file-converter/ konvertieren.');
          bgInput.value = '';
          return;
        }
        this.handleBackgroundImage(file);
      }
    });

    document.getElementById('clearBgImage').addEventListener('click', () => {
      themeManager.clearBackgroundImage();
      this.updateBackgroundPreview();
    });

    // Converter link
    document.getElementById('converterLink').addEventListener('click', async (e) => {
      e.preventDefault();
      try {
        await open('https://loadsh.it/file-converter/');
      } catch (err) {
        console.error('Failed to open converter:', err);
      }
    });

    // Reset
    document.getElementById('resetSettings').addEventListener('click', () => this.resetSettings());

    // Download folder selection
    document.getElementById('selectDownloadFolder').addEventListener('click', async () => {
      try {
        // Access dialog API dynamically
        const dialog = window.__TAURI__?.dialog;
        if (!dialog) {
          console.error('Dialog plugin not available');
          alert('Dialog-Plugin nicht verfügbar. Bitte App neu starten.');
          return;
        }

        const selected = await dialog.open({
          directory: true,
          multiple: false,
          title: 'Download-Ordner auswählen'
        });

        if (selected) {
          this.setDownloadPath(selected);
        }
      } catch (err) {
        console.error('Failed to open folder dialog:', err);
        alert('Fehler beim Öffnen des Ordner-Dialogs: ' + err);
      }
    });

    // Reset download folder
    document.getElementById('resetDownloadFolder').addEventListener('click', async () => {
      this.resetDownloadPath();
    });
  }

  handleBackgroundImage(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target.result;
      themeManager.setBackgroundImage(dataUrl);
      this.updateBackgroundPreview();
    };
    reader.readAsDataURL(file);
  }

  // Download path methods
  setDownloadPath(path) {
    localStorage.setItem('loadshit_download_path', path);
    this.updateDownloadPathDisplay();
    // Dispatch event for main.js to update
    window.dispatchEvent(new CustomEvent('downloadPathChanged', { detail: { path } }));
  }

  getDownloadPath() {
    return localStorage.getItem('loadshit_download_path') || null;
  }

  async resetDownloadPath() {
    localStorage.removeItem('loadshit_download_path');
    this.updateDownloadPathDisplay();
    // Get default path from backend
    try {
      const defaultPath = await invoke('get_download_dir');
      window.dispatchEvent(new CustomEvent('downloadPathChanged', { detail: { path: defaultPath } }));
    } catch (e) {
      console.error('Failed to get default download dir:', e);
    }
  }

  updateDownloadPathDisplay() {
    const pathDisplay = document.getElementById('downloadPathDisplay');
    const customPath = this.getDownloadPath();

    if (customPath) {
      // Shorten path for display
      const parts = customPath.split(/[/\\]/);
      const shortPath = parts.length > 3
        ? '.../' + parts.slice(-2).join('/')
        : customPath;
      pathDisplay.textContent = shortPath;
      pathDisplay.title = customPath;
    } else {
      pathDisplay.textContent = 'Standard (Downloads)';
      pathDisplay.title = '';
    }
  }

  updateActiveTheme() {
    const currentTheme = themeManager.getCurrentTheme();
    document.querySelectorAll('.theme-card').forEach(card => {
      card.classList.toggle('active', card.dataset.theme === currentTheme);
    });
  }

  updateModeToggle() {
    const isDark = themeManager.isDarkMode();
    document.querySelectorAll('.mode-btn').forEach(btn => {
      const btnMode = btn.dataset.mode;
      btn.classList.toggle('active', (btnMode === 'dark') === isDark);
    });
  }

  updateBackgroundPreview() {
    const settings = themeManager.getSettings();
    const preview = document.getElementById('bgPreview');
    const previewImg = document.getElementById('bgPreviewImg');
    const clearBtn = document.getElementById('clearBgImage');
    const selectBtn = document.getElementById('selectBgImage');

    if (settings.backgroundImage) {
      preview.classList.add('visible');
      previewImg.src = settings.backgroundImage;
      clearBtn.classList.add('visible');
      selectBtn.classList.add('has-image');
    } else {
      preview.classList.remove('visible');
      clearBtn.classList.remove('visible');
      selectBtn.classList.remove('has-image');
    }
  }

  loadCurrentSettings() {
    const settings = themeManager.getSettings();

    // Download path
    this.updateDownloadPathDisplay();

    // Theme
    this.updateActiveTheme();

    // Dark/Light mode
    this.updateModeToggle();

    // Accent color
    if (settings.customAccent) {
      document.getElementById('accentColorPicker').value = settings.customAccent;
      document.getElementById('accentColorValue').textContent = settings.customAccent;
    }

    // Opacity
    document.getElementById('opacitySlider').value = settings.appOpacity;
    document.getElementById('opacityValue').textContent = `${settings.appOpacity}%`;

    // Background
    this.updateBackgroundPreview();
  }

  resetSettings() {
    if (confirm('Alle Einstellungen auf Standard zurücksetzen?')) {
      themeManager.resetToDefaults();
      this.loadCurrentSettings();
    }
  }

  open() {
    this.loadCurrentSettings();
    this.overlay.classList.add('visible');
    this.isOpen = true;
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
const settingsUI = new SettingsUI();
export { settingsUI };
