# 🍩 LoadSh.it Desktop

**Kostenloser & Open Source Video Downloader**

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

- 🎥 **Videos herunterladen** von YouTube, TikTok, Instagram & 1000+ Websites
- 🎵 **Audio extrahieren** (MP3, WAV, FLAC, AAC, OGG)
- 📊 **Qualitätsauswahl** von 360p bis 4K
- 🔒 **100% lokal** - Keine Daten werden an Server gesendet
- 🆓 **Komplett kostenlos** & Open Source
- 💻 **Cross-Platform** - Windows, macOS, Linux

---

## 🛠️ Voraussetzungen

Die App nutzt [yt-dlp](https://github.com/yt-dlp/yt-dlp) für Downloads. Bitte installiere es vor der Nutzung:

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
2. **Video-URL einfügen** (YouTube, TikTok, etc.)
3. **Format & Qualität wählen**
4. **Download starten** ⬇️

Die Datei wird in deinem Downloads-Ordner gespeichert.

---

## 🏗️ Technologie

- [Tauri](https://tauri.app/) - Leichtgewichtiges Desktop-Framework (~10MB)
- [Rust](https://www.rust-lang.org/) - Sicheres & schnelles Backend
- [yt-dlp](https://github.com/yt-dlp/yt-dlp) - Video Download Engine
- [FFmpeg](https://ffmpeg.org/) - Medienkonvertierung

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
- **Issues:** [GitHub Issues](https://github.com/Aimtaim/loadshit-desktop/issues)
- **Releases:** [GitHub Releases](https://github.com/Aimtaim/loadshit-desktop/releases)

---

## 📄 Lizenz

MIT License - siehe [LICENSE](LICENSE)

---

<p align="center">
  Made with 🍩 by the LoadSh.it Team
</p>
