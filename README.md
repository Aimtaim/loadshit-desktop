# 🍩 LoadSh.it Desktop v2.0

**Kostenloser & Open Source Video Downloader mit Themes & Queue**

[![Release](https://img.shields.io/github/v/release/Aimtaim/loadshit-desktop?style=flat-square)](https://github.com/Aimtaim/loadshit-desktop/releases)
[![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)](LICENSE)
[![Downloads](https://img.shields.io/github/downloads/Aimtaim/loadshit-desktop/total?style=flat-square)](https://github.com/Aimtaim/loadshit-desktop/releases)

---

## ⬇️ Download

| Platform | Download |
|----------|----------|
| **Windows** | [.exe / .msi](https://github.com/Aimtaim/loadshit-desktop/releases/latest) |
| **macOS** | [.dmg](https://github.com/Aimtaim/loadshit-desktop/releases/latest) |
| **Linux** | [.AppImage / .deb](https://github.com/Aimtaim/loadshit-desktop/releases/latest) |

---

## ✨ Features

### Download
- 🎥 **1000+ Websites** - YouTube, TikTok, Instagram, Twitter/X, Twitch, Reddit, Vimeo...
- 🎵 **Video & Audio** - MP4, WebM, MKV, AVI, MP3, AAC, WAV, FLAC, OGG
- 📊 **Qualitätsauswahl** - 360p bis 4K (2160p)
- 📋 **Download-Queue** - Mehrere Downloads nacheinander
- 🔍 **Clipboard-Monitor** - Automatische URL-Erkennung
- 📜 **Download-Historie** - Letzte 100 Downloads speichern

### Personalisierung (NEU in v2.0)
- 🎨 **7 Themes** - Neon, Cyber Blue, Sunset, Minimal, Hacker, Purple Dream, Ocean
- 🌈 **Custom Akzentfarbe** - Eigene Primärfarbe wählen
- 🖼️ **Hintergrundbilder** - Eigene Bilder mit Blur & Overlay
- ✨ **Glaseffekt** - Windows Mica/Acrylic (Windows 11)
- 📐 **Kompakter Modus** - Für kleine Bildschirme
- 📤 **Export/Import** - Theme-Einstellungen teilen

### System
- 🔔 **System-Tray** - Im Hintergrund laufen
- 📢 **Desktop-Notifications** - Benachrichtigung bei fertigem Download
- ⌨️ **Keyboard Shortcuts** - Ctrl+, für Einstellungen
- 🔒 **100% lokal** - Keine Daten an Server
- 🆓 **Komplett kostenlos** & Open Source

---

## 🎨 Themes

| Theme | Preview |
|-------|---------|
| 💚 **Neon** | Klassisches Neon-Grün (Standard) |
| 💙 **Cyber Blue** | Futuristisches Cyan |
| 🧡 **Sunset** | Warme Rot-Orange Töne |
| 🤍 **Minimal** | Schlicht und elegant |
| 🖥️ **Hacker** | Matrix-Style Terminal |
| 💜 **Purple Dream** | Mystisches Violett |
| 🌊 **Ocean** | Tiefes Meeresblau |

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Aktion |
|----------|--------|
| `Ctrl + ,` | Einstellungen öffnen |
| `Ctrl + V` | URL-Feld fokussieren |
| `Escape` | Einstellungen schließen |

---

## 🛠️ Voraussetzungen

Die App nutzt [yt-dlp](https://github.com/yt-dlp/yt-dlp) für Downloads:

### Windows
```powershell
winget install yt-dlp
```

### macOS
```bash
brew install yt-dlp ffmpeg
```

### Linux
```bash
pip install yt-dlp
sudo apt install ffmpeg  # oder dein Package Manager
```

---

## 📖 Nutzung

1. **App starten**
2. **Video-URL einfügen** (YouTube, TikTok, etc.) oder vom Clipboard-Monitor erkennen lassen
3. **Format & Qualität wählen**
4. **Download starten** ⬇️
5. **⚙️ Einstellungen** - Theme anpassen, Hintergrundbild setzen

Die Datei wird in deinem Downloads-Ordner gespeichert.

---

## 🏗️ Technologie

- [Tauri 2.0](https://tauri.app/) - Desktop-Framework mit Mobile-Support
- [Rust](https://www.rust-lang.org/) - Sicheres & schnelles Backend
- [yt-dlp](https://github.com/yt-dlp/yt-dlp) - Video Download Engine
- [FFmpeg](https://ffmpeg.org/) - Medienkonvertierung
- [window-vibrancy](https://crates.io/crates/window-vibrancy) - Glaseffekte

---

## 🔨 Selbst bauen

```bash
# Repository klonen
git clone https://github.com/Aimtaim/loadshit-desktop.git
cd loadshit-desktop

# Dependencies installieren
npm install

# Development starten
npm run dev

# Produktions-Build erstellen
npm run build
```

### Voraussetzungen zum Bauen

- [Node.js](https://nodejs.org/) >= 18
- [Rust](https://rustup.rs/) >= 1.70
- Tauri CLI: `npm install -g @tauri-apps/cli`

**Linux zusätzlich:**
```bash
sudo apt install libgtk-3-dev libwebkit2gtk-4.1-dev librsvg2-dev
```

---

## 📁 Projektstruktur

```
loadshit-desktop/
├── src/                          # Frontend
│   ├── index.html
│   ├── styles/
│   │   ├── main.css             # Basis-Styles
│   │   ├── themes.css           # Theme-System
│   │   ├── settings.css         # Einstellungen
│   │   └── queue.css            # Queue & Clipboard
│   └── scripts/
│       ├── main.js              # Haupt-Logik
│       ├── theme-manager.js     # Theme-Verwaltung
│       ├── settings.js          # Einstellungen-UI
│       ├── clipboard-monitor.js # Clipboard-Überwachung
│       ├── queue-manager.js     # Download-Queue
│       └── history-manager.js   # Download-Historie
│
├── src-tauri/                    # Rust Backend
│   ├── src/
│   │   ├── main.rs              # App-Setup, Tray, Vibrancy
│   │   └── commands/download.rs # Download-Logik
│   ├── Cargo.toml
│   └── tauri.conf.json
│
└── package.json
```

---

## ⚖️ Rechtliches

Dieses Tool ist für den **persönlichen Gebrauch** bestimmt.

- ✅ Eigene Videos herunterladen
- ✅ Creative Commons Inhalte
- ✅ Lizenzfreie Medien
- ⚠️ Du bist selbst verantwortlich für die rechtmäßige Nutzung

LoadSh.it ist ein Tool-Provider und übernimmt keine Haftung für heruntergeladene Inhalte.

---

## 🔗 Links

- **Website:** [loadsh.it](https://loadsh.it)
- **Android App:** [loadshit-android](../loadshit-android) (geplant)
- **Issues:** [GitHub Issues](https://github.com/Aimtaim/loadshit-desktop/issues)
- **Releases:** [GitHub Releases](https://github.com/Aimtaim/loadshit-desktop/releases)

---

## 📄 Lizenz

MIT License - siehe [LICENSE](LICENSE)

---

<p align="center">
  Made with 🍩 by the LoadSh.it Team
</p>
