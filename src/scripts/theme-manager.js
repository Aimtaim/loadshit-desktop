// LoadSh.it Desktop - Theme Manager

const THEMES = {
  neon: {
    name: 'Neon',
    color: '#00ff88',
    description: 'Klassisches Neon-Grün'
  },
  cyber: {
    name: 'Cyber Blue',
    color: '#00d4ff',
    description: 'Futuristisches Cyan'
  },
  sunset: {
    name: 'Sunset',
    color: '#ff6b6b',
    description: 'Warme Rot-Orange Töne'
  },
  minimal: {
    name: 'Minimal',
    color: '#ffffff',
    description: 'Schlicht und elegant'
  },
  hacker: {
    name: 'Hacker',
    color: '#00ff00',
    description: 'Matrix-Style Terminal'
  },
  purple: {
    name: 'Purple Dream',
    color: '#a855f7',
    description: 'Mystisches Violett'
  },
  ocean: {
    name: 'Ocean',
    color: '#06b6d4',
    description: 'Tiefes Meeresblau'
  },
  rose: {
    name: 'Rose',
    color: '#f43f5e',
    description: 'Elegantes Rosa-Rot'
  },
  gold: {
    name: 'Gold',
    color: '#fbbf24',
    description: 'Luxuriöses Gold'
  },
  lime: {
    name: 'Lime',
    color: '#84cc16',
    description: 'Frisches Limetten-Grün'
  },
  blood: {
    name: 'Blood',
    color: '#dc2626',
    description: 'Intensives Blutrot'
  },
  ice: {
    name: 'Ice',
    color: '#67e8f9',
    description: 'Kühles Eisblau'
  }
};

const DEFAULT_SETTINGS = {
  theme: 'neon',
  darkMode: true,
  customAccent: null,
  backgroundImage: null,
  appOpacity: 100
};

class ThemeManager {
  constructor() {
    this.settings = { ...DEFAULT_SETTINGS };
    this.loadSettings();
    this.applySettings();
  }

  loadSettings() {
    try {
      const saved = localStorage.getItem('loadshit_theme_settings');
      if (saved) {
        this.settings = { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.error('Failed to load theme settings:', e);
    }
  }

  saveSettings() {
    try {
      localStorage.setItem('loadshit_theme_settings', JSON.stringify(this.settings));
    } catch (e) {
      console.error('Failed to save theme settings:', e);
    }
  }

  applySettings() {
    const html = document.documentElement;

    // Apply theme
    html.setAttribute('data-theme', this.settings.theme);

    // Apply dark/light mode
    html.setAttribute('data-mode', this.settings.darkMode ? 'dark' : 'light');

    // Apply app opacity
    const opacity = this.settings.appOpacity / 100;
    html.style.setProperty('--app-opacity', opacity);

    // Only enable transparency mode when opacity < 100%
    // This prevents rendering glitches when no transparency is needed
    if (this.settings.appOpacity < 100) {
      html.setAttribute('data-transparency', 'true');
    } else {
      html.removeAttribute('data-transparency');
    }

    // Apply background image
    if (this.settings.backgroundImage) {
      html.setAttribute('data-has-bg', 'true');
      html.style.setProperty('--bg-image', `url("${this.settings.backgroundImage}")`);
    } else {
      html.setAttribute('data-has-bg', 'false');
      html.style.removeProperty('--bg-image');
    }

    // Apply custom accent
    if (this.settings.customAccent) {
      html.setAttribute('data-custom-accent', 'true');
      html.style.setProperty('--custom-accent', this.settings.customAccent);
      html.style.setProperty('--custom-accent-dark', this.darkenColor(this.settings.customAccent, 20));
    } else {
      html.removeAttribute('data-custom-accent');
      html.style.removeProperty('--custom-accent');
      html.style.removeProperty('--custom-accent-dark');
    }
  }

  setTheme(themeName) {
    if (THEMES[themeName]) {
      this.settings.theme = themeName;
      this.settings.customAccent = null; // Reset custom accent when changing theme
      this.saveSettings();
      this.applySettings();
      return true;
    }
    return false;
  }

  setDarkMode(isDark) {
    this.settings.darkMode = isDark;
    this.saveSettings();
    this.applySettings();
  }

  toggleDarkMode() {
    this.setDarkMode(!this.settings.darkMode);
    return this.settings.darkMode;
  }

  isDarkMode() {
    return this.settings.darkMode;
  }

  setCustomAccent(color) {
    this.settings.customAccent = color;
    this.saveSettings();
    this.applySettings();
  }

  clearCustomAccent() {
    this.settings.customAccent = null;
    this.saveSettings();
    this.applySettings();
  }

  setBackgroundImage(imageDataUrl) {
    this.settings.backgroundImage = imageDataUrl;
    this.saveSettings();
    this.applySettings();
  }

  clearBackgroundImage() {
    this.settings.backgroundImage = null;
    this.saveSettings();
    this.applySettings();
  }

  setAppOpacity(opacity) {
    this.settings.appOpacity = Math.max(30, Math.min(100, opacity));
    this.saveSettings();
    this.applySettings();
  }

  getThemes() {
    return THEMES;
  }

  getCurrentTheme() {
    return this.settings.theme;
  }

  getSettings() {
    return { ...this.settings };
  }

  resetToDefaults() {
    this.settings = { ...DEFAULT_SETTINGS };
    this.saveSettings();
    this.applySettings();
  }

  exportSettings() {
    return JSON.stringify(this.settings, null, 2);
  }

  importSettings(jsonString) {
    try {
      const imported = JSON.parse(jsonString);
      this.settings = { ...DEFAULT_SETTINGS, ...imported };
      this.saveSettings();
      this.applySettings();
      return true;
    } catch (e) {
      console.error('Failed to import settings:', e);
      return false;
    }
  }

  // Utility: Darken a hex color
  darkenColor(hex, percent) {
    const num = parseInt(hex.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = Math.max((num >> 16) - amt, 0);
    const G = Math.max((num >> 8 & 0x00FF) - amt, 0);
    const B = Math.max((num & 0x0000FF) - amt, 0);
    return `#${(0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1)}`;
  }

  // Utility: Convert hex to RGB
  hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }
}

// Export singleton instance
const themeManager = new ThemeManager();
export { themeManager, THEMES };
