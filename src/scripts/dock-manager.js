// LoadSh.it Desktop - Dock Manager
// Simple widget mode - no collapse, just dock/undock

const { getCurrentWindow } = window.__TAURI__.window;

class DockManager {
  constructor() {
    this.appWindow = getCurrentWindow();

    // State
    this.isWidgetMode = false;
    this.isCollapsed = false;
    this.dockedSide = 'right';
    this.wasMaximized = false;

    // Sizes
    this.normalSize = { width: 900, height: 750 };
    this.widgetSize = { width: 300, height: 400 }; // Increased for video info
    this.collapsedSize = { width: 36, height: 36 };

    // Collapsed position (for dragging along edge)
    this.collapsedY = null;

    // Elements
    this.miniWidget = null;
    this.miniWidgetContent = null;
  }

  async init() {
    this.miniWidget = document.getElementById('miniWidget');
    this.miniWidgetContent = document.getElementById('miniWidgetContent');

    try {
      this.wasMaximized = await this.appWindow.isMaximized();
      if (!this.wasMaximized) {
        const size = await this.appWindow.innerSize();
        this.normalSize = { width: size.width, height: size.height };
      }
    } catch (e) {
      console.error('Init error:', e);
    }

    this._setupLogoInteraction();
    this._setupEscapeKey();
    console.log('DockManager ready');
  }

  _setupEscapeKey() {
    document.addEventListener('keydown', async (e) => {
      if (e.key === 'Escape' && this.isWidgetMode) {
        await this.exitWidgetMode();
      }
    });
  }

  _setupLogoInteraction() {
    const logo = document.getElementById('miniWidgetToggle');
    if (!logo) return;

    let clickStartTime = 0;
    let clickStartPos = { x: 0, y: 0 };

    logo.addEventListener('mousedown', (e) => {
      clickStartTime = Date.now();
      clickStartPos = { x: e.screenX, y: e.screenY };
    });

    // Logo click in widget mode toggles collapse (only if not dragging)
    logo.addEventListener('click', async (e) => {
      if (!this.isWidgetMode) return;

      const clickDuration = Date.now() - clickStartTime;
      const moveDistance = Math.abs(e.screenX - clickStartPos.x) + Math.abs(e.screenY - clickStartPos.y);

      // Only toggle if it was a quick click without much movement
      if (clickDuration < 300 && moveDistance < 10) {
        await this.toggleCollapse();
      }
    });
  }

  _wait(ms) {
    return new Promise(r => setTimeout(r, ms));
  }

  _setupCollapsedDrag() {
    const logo = document.getElementById('miniWidgetToggle');
    if (!logo || this._dragSetup) return;

    this._dragSetup = true;
    let isDragging = false;
    let startY = 0;
    let startWindowY = 0;

    const onMouseDown = async (e) => {
      if (!this.isCollapsed) return;
      isDragging = true;
      startY = e.screenY;
      try {
        const pos = await this.appWindow.outerPosition();
        startWindowY = pos.y;
      } catch (err) {
        startWindowY = 0;
      }
      e.preventDefault();
    };

    const onMouseMove = async (e) => {
      if (!isDragging || !this.isCollapsed) return;

      const deltaY = e.screenY - startY;
      const newY = Math.max(0, startWindowY + deltaY);
      const screen = this._getScreenSize();
      const maxY = screen.height - this.collapsedSize.height;
      const clampedY = Math.min(newY, maxY);

      this.collapsedY = clampedY;

      const { LogicalPosition } = window.__TAURI__.window;
      const x = this.dockedSide === 'left' ? 0 : screen.width - this.collapsedSize.width;

      try {
        await this.appWindow.setPosition(new LogicalPosition(x, clampedY));
      } catch (err) {
        console.error('Drag position error:', err);
      }
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    logo.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }

  _getScreenSize() {
    return {
      width: window.screen.availWidth || window.screen.width || 1920,
      height: window.screen.availHeight || window.screen.height || 1080
    };
  }

  async _resizeWindow(width, height, x, y) {
    const { LogicalSize, LogicalPosition } = window.__TAURI__.window;

    try {
      // Hide briefly for smooth resize on Linux
      await this.appWindow.hide();
      await this._wait(50);

      const targetSize = new LogicalSize(width, height);
      await this.appWindow.setSize(targetSize);
      await this._wait(50);
      await this.appWindow.setPosition(new LogicalPosition(x, y));

      await this.appWindow.show();
      await this.appWindow.setFocus();

      console.log(`Window: ${width}x${height} at ${x},${y}`);
      return true;
    } catch (e) {
      console.error('Resize error:', e);
      await this.appWindow.show();
      return false;
    }
  }

  // ==================== PUBLIC METHODS ====================

  async enterWidgetMode(side = 'right') {
    if (this.isWidgetMode) return;

    console.log('>>> ENTER WIDGET MODE');

    // Store current state
    try {
      this.wasMaximized = await this.appWindow.isMaximized();
      if (this.wasMaximized) {
        await this.appWindow.unmaximize();
        await this._wait(300);
      } else {
        const size = await this.appWindow.innerSize();
        this.normalSize = { width: size.width, height: size.height };
      }
    } catch (e) {}

    // Update state
    this.isWidgetMode = true;
    this.dockedSide = side;

    // Update UI
    document.body.classList.add('widget-mode');
    this.miniWidget.classList.remove('docked-left', 'docked-right', 'docked-top', 'docked-bottom');
    this.miniWidget.classList.add(`docked-${side}`);

    // Calculate position
    const screen = this._getScreenSize();
    const x = side === 'left' ? 0 : screen.width - this.widgetSize.width;
    const y = Math.round((screen.height - this.widgetSize.height) / 2);

    // Resize and position
    await this._resizeWindow(this.widgetSize.width, this.widgetSize.height, x, y);

    // Always on top
    try {
      await this.appWindow.setAlwaysOnTop(true);
    } catch (e) {}

    console.log('<<< WIDGET MODE ACTIVE');

    window.dispatchEvent(new CustomEvent('dockStateChange', {
      detail: { widgetMode: true, side }
    }));
  }

  async exitWidgetMode() {
    if (!this.isWidgetMode) return;

    console.log('>>> EXIT WIDGET MODE');

    // Update state
    this.isWidgetMode = false;
    this.isCollapsed = false;

    // Update UI
    document.body.classList.remove('widget-mode', 'collapsed-mode');
    this.miniWidget.classList.remove('docked-left', 'docked-right', 'docked-top', 'docked-bottom', 'collapsed');

    // Restore minimum size constraint for normal mode
    try {
      const { LogicalSize } = window.__TAURI__.window;
      await this.appWindow.setMinSize(new LogicalSize(300, 320));
    } catch (e) {}

    // Reset window props
    try {
      await this.appWindow.setAlwaysOnTop(false);
    } catch (e) {}

    // Calculate center position
    const screen = this._getScreenSize();
    const w = this.normalSize.width || 900;
    const h = this.normalSize.height || 750;
    const x = Math.round((screen.width - w) / 2);
    const y = Math.round((screen.height - h) / 2);

    // Resize and position
    await this._resizeWindow(w, h, x, y);

    // Re-maximize if needed
    if (this.wasMaximized) {
      await this._wait(100);
      await this.appWindow.maximize();
    }

    console.log('<<< NORMAL MODE');

    window.dispatchEvent(new CustomEvent('dockStateChange', {
      detail: { widgetMode: false }
    }));
  }

  async toggleDock() {
    if (this.isWidgetMode) {
      await this.exitWidgetMode();
    } else {
      await this.enterWidgetMode('right');
    }
  }

  getState() {
    return {
      isWidgetMode: this.isWidgetMode,
      isCollapsed: this.isCollapsed,
      dockedSide: this.dockedSide,
      wasMaximized: this.wasMaximized
    };
  }

  async unsnap() {
    await this.exitWidgetMode();
  }

  // ==================== COLLAPSE METHODS ====================

  async toggleCollapse() {
    if (this.isCollapsed) {
      await this.expandWidget();
    } else {
      await this.collapseWidget();
    }
  }

  async collapseWidget() {
    if (!this.isWidgetMode || this.isCollapsed) return;

    console.log('>>> COLLAPSE WIDGET');
    this.isCollapsed = true;

    // Update UI
    this.miniWidget.classList.add('collapsed');
    document.body.classList.add('collapsed-mode');

    // Remove minimum size constraint for collapsed state
    try {
      await this.appWindow.setMinSize(null);
    } catch (e) {
      console.error('Failed to remove min size:', e);
    }

    // Ensure always on top when collapsed
    try {
      await this.appWindow.setAlwaysOnTop(true);
    } catch (e) {
      console.error('Failed to set always on top:', e);
    }

    // Calculate position - directly at edge
    const screen = this._getScreenSize();
    const x = this.dockedSide === 'left' ? 0 : screen.width - this.collapsedSize.width;
    // Use saved Y position or center
    const y = this.collapsedY !== null
      ? this.collapsedY
      : Math.round((screen.height - this.collapsedSize.height) / 2);

    // Resize window
    await this._resizeWindow(this.collapsedSize.width, this.collapsedSize.height, x, y);

    // Setup drag along edge
    this._setupCollapsedDrag();

    console.log('<<< WIDGET COLLAPSED');

    window.dispatchEvent(new CustomEvent('dockStateChange', {
      detail: { widgetMode: true, collapsed: true, side: this.dockedSide }
    }));
  }

  async expandWidget() {
    if (!this.isWidgetMode || !this.isCollapsed) return;

    console.log('>>> EXPAND WIDGET');
    this.isCollapsed = false;

    // Update UI
    this.miniWidget.classList.remove('collapsed');
    document.body.classList.remove('collapsed-mode');

    // Restore minimum size constraint for widget mode
    try {
      const { LogicalSize } = window.__TAURI__.window;
      await this.appWindow.setMinSize(new LogicalSize(200, 300));
    } catch (e) {
      console.error('Failed to restore min size:', e);
    }

    // Calculate position
    const screen = this._getScreenSize();
    const x = this.dockedSide === 'left' ? 0 : screen.width - this.widgetSize.width;
    const y = Math.round((screen.height - this.widgetSize.height) / 2);

    // Resize window
    await this._resizeWindow(this.widgetSize.width, this.widgetSize.height, x, y);

    console.log('<<< WIDGET EXPANDED');

    window.dispatchEvent(new CustomEvent('dockStateChange', {
      detail: { widgetMode: true, collapsed: false, side: this.dockedSide }
    }));
  }
}

export const dockManager = new DockManager();
