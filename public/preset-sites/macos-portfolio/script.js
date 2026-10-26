/**
 * ========================================================
 * macOS Interactive Animation Portfolio — Logic & Engine
 * Direct integration of 21st.dev mac-os-dock.tsx physics
 * ========================================================
 */

// Global State
let highestZIndex = 200;
let activeWindowId = null;
const wallpapers = [
  'wallpaper-sonoma', 'wallpaper-dusk', 'wallpaper-cyber', 'wallpaper-coquette',
  'wallpaper-noon', 'wallpaper-sunrise', 'wallpaper-sunset', 'wallpaper-night',
  'wallpaper-rain', 'wallpaper-storm', 'wallpaper-snow',
  'wallpaper-classic', 'wallpaper-sky', 'wallpaper-deepblue', 'wallpaper-midnight'
];

// Sound Engine using Web Audio API (Synthesized in-browser, zero external files)
class MacAudio {
  constructor() {
    this.ctx = null;
    this.enabled = true;
    this.volume = 0.85;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }
  }

  playPop() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.12 * this.volume, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.09);
    } catch(e) {}
  }

  playChime() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      [523.25, 659.25, 783.99].forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + i * 0.05);

        gain.gain.setValueAtTime(0.1 * this.volume, now + i * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.05 + 0.25);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + i * 0.05);
        osc.stop(now + i * 0.05 + 0.3);
      });
    } catch(e) {}
  }

  playTrash() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    try {
      const node = this.ctx.createBufferSource();
      const buffer = this.ctx.createBuffer(1, this.ctx.sampleRate * 0.15, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < buffer.length; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      node.buffer = buffer;
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.15 * this.volume, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.15);
      node.connect(gain);
      gain.connect(this.ctx.destination);
      node.start();
    } catch(e) {}
  }
}

const macAudio = new MacAudio();

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', () => {
  initClock();
  initDockMagnification();
  initDragAndDrop();
  initTerminal();
  initSpotlight();
  initKeyboardShortcuts();
  initGlobalEvents();

  // Open initial welcome window
  setTimeout(() => {
    openWindow('finder');
  }, 400);
});

// ==================== REAL-TIME CLOCK ====================
function initClock() {
  const clockEl = document.getElementById('menu-clock');
  function update() {
    const now = new Date();
    const options = { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true };
    if (clockEl) {
      clockEl.textContent = now.toLocaleString('en-US', options).replace(/,/g, '');
    }
  }
  update();
  setInterval(update, 1000);
}

// ==================== WINDOW MANAGER ====================
function openWindow(appId) {
  const win = document.getElementById(`window-${appId}`);
  if (!win) return;

  macAudio.playPop();

  if (win.classList.contains('minimized')) {
    win.classList.remove('minimized');
  }

  win.classList.remove('closing');
  win.style.display = 'flex';
  win.classList.add('opening');
  setTimeout(() => win.classList.remove('opening'), 260);

  bringToFront(win, appId);
  updateDockDot(appId, true);

  // Trigger bounce on dock icon matching mac-os-dock.tsx
  const dockItem = document.querySelector(`.dock-item[data-app="${appId}"]`);
  if (dockItem) {
    createBounceAnimation(dockItem);
  }
}

function closeWindow(appId) {
  const win = document.getElementById(`window-${appId}`);
  if (!win) return;

  macAudio.playPop();
  win.classList.remove('opening');
  win.classList.add('closing');
  setTimeout(() => {
    win.style.display = 'none';
    win.classList.remove('closing');
    win.classList.remove('minimized');
  }, 180);

  updateDockDot(appId, false);

  if (activeWindowId === appId) {
    activeWindowId = null;
    updateActiveAppName('Finder');
  }
}

function minimizeWindow(appId) {
  const win = document.getElementById(`window-${appId}`);
  if (!win) return;

  macAudio.playPop();
  win.classList.add('minimized');
  if (activeWindowId === appId) {
    activeWindowId = null;
    updateActiveAppName('Finder');
  }
}

function maximizeWindow(appId) {
  const win = document.getElementById(`window-${appId}`);
  if (!win) return;

  macAudio.playPop();
  win.classList.toggle('maximized');
}

function toggleWindow(appId) {
  const win = document.getElementById(`window-${appId}`);
  if (!win) return;

  if (win.style.display === 'none' || !win.style.display) {
    openWindow(appId);
  } else if (win.classList.contains('minimized')) {
    openWindow(appId);
  } else if (activeWindowId === appId) {
    minimizeWindow(appId);
  } else {
    bringToFront(win, appId);
  }
}

function bringToFront(win, appId) {
  highestZIndex += 2;
  win.style.zIndex = highestZIndex;

  document.querySelectorAll('.mac-window').forEach(w => w.classList.remove('active-window'));
  win.classList.add('active-window');

  activeWindowId = appId;
  const prettyNames = {
    finder: 'Finder',
    safari: 'Safari',
    terminal: 'Terminal',
    notes: 'Notes',
    calculator: 'Calculator',
    photos: 'Photos',
    calendar: 'Calendar',
    music: 'Music',
    contact: 'Mail',
    shortcuts: 'Shortcuts',
    settings: 'System Settings',
    about: 'About This Mac'
  };
  updateActiveAppName(prettyNames[appId] || 'Finder');
}

function updateActiveAppName(name) {
  const label = document.getElementById('active-app-name');
  if (label) label.textContent = name;
}

function openAboutModal() {
  openWindow('about');
}

let isTrashFull = false;

function emptyTrash() {
  macAudio.playTrash();
  const trashImg = document.getElementById('dock-trash-img');

  if (isTrashFull) {
    isTrashFull = false;
    if (trashImg) {
      trashImg.src = 'assets/icons/trash-empty.png';
      trashImg.alt = 'Trash (Empty)';
    }
    showToast('Trash Emptied');
  } else {
    isTrashFull = true;
    if (trashImg) {
      trashImg.src = 'assets/icons/trash-full.png';
      trashImg.alt = 'Trash (Full)';
    }
    showToast('Item moved to Trash');
  }
}

function showToast(message) {
  let toast = document.getElementById('macos-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'macos-toast';
    toast.style.cssText = 'position: fixed; top: 42px; right: 20px; background: rgba(30, 30, 35, 0.9); color: #f8fafc; padding: 10px 16px; border-radius: 12px; font-size: 13px; font-weight: 500; border: 1px solid rgba(255, 255, 255, 0.15); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); box-shadow: 0 10px 25px rgba(0,0,0,0.4); z-index: 99999; display: flex; align-items: center; gap: 8px; opacity: 0; transform: translateY(-8px); transition: opacity 0.2s ease, transform 0.2s ease; pointer-events: none;';
    document.body.appendChild(toast);
  }
  toast.innerHTML = `<img src="${isTrashFull ? 'assets/icons/trash-full.png' : 'assets/icons/trash-empty.png'}" width="18" height="18" style="vertical-align:middle;" /> <span>${message}</span>`;
  toast.style.opacity = '1';
  toast.style.transform = 'translateY(0)';
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(-8px)';
  }, 2200);
}

function updateDockDot(appId, isOpen) {
  const dockItem = document.querySelector(`.dock-item[data-app="${appId}"]`);
  if (dockItem) {
    if (isOpen) {
      dockItem.classList.add('running');
    } else {
      dockItem.classList.remove('running');
    }
  }
}

function closeAllWindows() {
  document.querySelectorAll('.mac-window').forEach(win => {
    win.style.display = 'none';
  });
  document.querySelectorAll('.dock-item').forEach(item => {
    item.classList.remove('running');
  });
  activeWindowId = null;
  updateActiveAppName('Finder');
}

// Bounce Animation matching mac-os-dock.tsx
function createBounceAnimation(element) {
  element.style.transition = 'transform 0.2s cubic-bezier(0.18, 0.89, 0.32, 1.28)';
  element.style.transform = 'translateY(-22px) scale(1.15)';
  setTimeout(() => {
    element.style.transform = 'translateY(0px) scale(1)';
  }, 220);
}

// ==================== DRAGGABLE WINDOWS ====================
let draggedWindow = null;
let dragOffsetX = 0;
let dragOffsetY = 0;

function initDragAndDrop() {
  document.addEventListener('mousemove', (e) => {
    if (!draggedWindow) return;
    if (draggedWindow.classList.contains('maximized')) return;

    let newX = e.clientX - dragOffsetX;
    let newY = e.clientY - dragOffsetY;

    newY = Math.max(30, newY);
    newY = Math.min(window.innerHeight - 100, newY);

    draggedWindow.style.left = `${newX}px`;
    draggedWindow.style.top = `${newY}px`;
  });

  document.addEventListener('mouseup', () => {
    if (draggedWindow) {
      draggedWindow = null;
    }
  });

  document.querySelectorAll('.mac-window').forEach(win => {
    win.addEventListener('mousedown', () => {
      const appId = win.id.replace('window-', '');
      bringToFront(win, appId);
    });
  });
}

function startDrag(e, windowElementId) {
  if (e.target.classList.contains('traffic-btn') || e.target.classList.contains('tl-btn')) return;
  const fullId = windowElementId.startsWith('window-') ? windowElementId : `window-${windowElementId}`;
  const win = document.getElementById(fullId);
  if (!win) return;

  const appId = fullId.replace('window-', '');
  bringToFront(win, appId);

  draggedWindow = win;
  const rect = win.getBoundingClientRect();
  dragOffsetX = e.clientX - rect.left;
  dragOffsetY = e.clientY - rect.top;
}

// ==================== AUTHENTIC MACOS COSINE MAGNIFICATION PHYSICS ====================
// Exactly ported from mac-os-dock.tsx algorithm
function initDockMagnification() {
  const dock = document.getElementById('mac-dock');
  const items = Array.from(dock.querySelectorAll('.dock-item'));

  const getResponsiveConfig = () => {
    const smallerDimension = Math.min(window.innerWidth, window.innerHeight);
    if (smallerDimension < 480) {
      return { baseIconSize: Math.max(40, smallerDimension * 0.08), maxScale: 1.4, effectWidth: smallerDimension * 0.4 };
    } else if (smallerDimension < 768) {
      return { baseIconSize: Math.max(48, smallerDimension * 0.07), maxScale: 1.5, effectWidth: smallerDimension * 0.35 };
    } else if (smallerDimension < 1024) {
      return { baseIconSize: Math.max(54, smallerDimension * 0.06), maxScale: 1.6, effectWidth: smallerDimension * 0.3 };
    } else {
      return { baseIconSize: Math.max(58, Math.min(68, smallerDimension * 0.05)), maxScale: 1.7, effectWidth: 280 };
    }
  };

  let config = getResponsiveConfig();
  window.addEventListener('resize', () => { config = getResponsiveConfig(); });

  let mouseX = null;
  let currentScales = items.map(() => 1.0);
  let animationFrameId = null;

  const calculateTargetMagnification = (mousePosition) => {
    if (mousePosition === null) {
      return items.map(() => 1.0);
    }
    const { baseIconSize, maxScale, effectWidth } = config;
    const baseSpacing = Math.max(4, baseIconSize * 0.08);

    return items.map((_, index) => {
      const normalIconCenter = (index * (baseIconSize + baseSpacing)) + (baseIconSize / 2);
      const minX = mousePosition - (effectWidth / 2);
      const maxX = mousePosition + (effectWidth / 2);

      if (normalIconCenter < minX || normalIconCenter > maxX) {
        return 1.0;
      }

      const theta = ((normalIconCenter - minX) / effectWidth) * 2 * Math.PI;
      const cappedTheta = Math.min(Math.max(theta, 0), 2 * Math.PI);
      const scaleFactor = (1 - Math.cos(cappedTheta)) / 2;

      return 1.0 + (scaleFactor * (maxScale - 1.0));
    });
  };

  const animate = () => {
    const targetScales = calculateTargetMagnification(mouseX);
    const lerpFactor = mouseX !== null ? 0.22 : 0.12;
    let needsUpdate = false;

    currentScales = currentScales.map((scale, i) => {
      const diff = targetScales[i] - scale;
      const next = scale + (diff * lerpFactor);
      if (Math.abs(diff) > 0.002) needsUpdate = true;
      return next;
    });

    items.forEach((item, i) => {
      const scale = currentScales[i];
      const translateY = (scale - 1) * -16;
      item.style.transform = `scale(${scale.toFixed(3)}) translateY(${translateY.toFixed(1)}px)`;
      item.style.zIndex = Math.round(scale * 10);
    });

    if (needsUpdate || mouseX !== null) {
      animationFrameId = requestAnimationFrame(animate);
    } else {
      animationFrameId = null;
    }
  };

  dock.addEventListener('mousemove', (e) => {
    const rect = dock.getBoundingClientRect();
    const padding = Math.max(8, config.baseIconSize * 0.12);
    mouseX = e.clientX - rect.left - padding;

    if (!animationFrameId) {
      animationFrameId = requestAnimationFrame(animate);
    }
  });

  dock.addEventListener('mouseleave', () => {
    mouseX = null;
    if (!animationFrameId) {
      animationFrameId = requestAnimationFrame(animate);
    }
  });
}

// ==================== KEYBOARD SHORTCUTS ENGINE ====================
function initKeyboardShortcuts() {
  window.addEventListener('keydown', (e) => {
    const isCmdOrCtrl = e.metaKey || e.ctrlKey;
    const activeEl = document.activeElement;
    const isTyping = activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA') && activeEl.id !== 'terminal-input';

    if (isCmdOrCtrl && (e.code === 'Space' || e.key.toLowerCase() === 'k')) {
      e.preventDefault();
      toggleSpotlight();
      return;
    }

    if ((isCmdOrCtrl && e.key === '/') || (e.key === '?' && !isTyping)) {
      e.preventDefault();
      toggleWindow('shortcuts');
      return;
    }

    if (isCmdOrCtrl && e.key.toLowerCase() === 'd') {
      e.preventDefault();
      toggleTheme();
      return;
    }

    if (isCmdOrCtrl && e.key.toLowerCase() === 'w') {
      e.preventDefault();
      if (activeWindowId) {
        closeWindow(activeWindowId);
      }
      return;
    }

    if (isCmdOrCtrl && e.key.toLowerCase() === 'm') {
      e.preventDefault();
      if (activeWindowId) {
        minimizeWindow(activeWindowId);
      }
      return;
    }

    if (isCmdOrCtrl && e.key.toLowerCase() === 'f' && !isTyping) {
      e.preventDefault();
      if (activeWindowId) {
        maximizeWindow(activeWindowId);
      }
      return;
    }

    if (isCmdOrCtrl && e.key.toLowerCase() === 'q') {
      e.preventDefault();
      closeAllWindows();
      return;
    }

    if (isCmdOrCtrl && e.key >= '1' && e.key <= '9') {
      e.preventDefault();
      const apps = ['finder', 'safari', 'notes', 'terminal', 'calculator', 'photos', 'music', 'calendar', 'contact'];
      const targetApp = apps[parseInt(e.key) - 1];
      if (targetApp) toggleWindow(targetApp);
      return;
    }

    if (e.key === 'Escape') {
      closeSpotlight();
      closeControlCenter();
      closeDropdowns();
      return;
    }

    // Calculator keyboard controls
    const calcWin = document.getElementById('window-calculator');
    const isCalcOpen = calcWin && calcWin.style.display !== 'none' && !calcWin.classList.contains('minimized');
    if (isCalcOpen && (!isTyping || activeEl.closest('#window-calculator'))) {
      if (e.key >= '0' && e.key <= '9') {
        calcAction('num', e.key);
      } else if (e.key === '.') {
        calcAction('decimal');
      } else if (e.key === '+') {
        calcAction('op', '+');
      } else if (e.key === '-') {
        calcAction('op', '-');
      } else if (e.key === '*' || e.key === 'x') {
        calcAction('op', '*');
      } else if (e.key === '/') {
        calcAction('op', '/');
      } else if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        calcAction('equals');
      } else if (e.key === 'Backspace') {
        calcAction('backspace');
      } else if (e.key === 'c' || e.key === 'C') {
        calcAction('clear');
      } else if (e.key === '%') {
        calcAction('percent');
      }
    }
  });
}

// ==================== TERMINAL CLI ENGINE ====================
let commandHistory = [];
let historyIndex = -1;

function initTerminal() {
  const termInput = document.getElementById('terminal-input');
  if (!termInput) return;

  termInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const cmd = termInput.value.trim();
      executeTerminalCommand(cmd);
      if (cmd) {
        commandHistory.push(cmd);
        historyIndex = commandHistory.length;
      }
      termInput.value = '';
    } else if (e.key === 'ArrowUp') {
      if (historyIndex > 0) {
        historyIndex--;
        termInput.value = commandHistory[historyIndex];
      }
    } else if (e.key === 'ArrowDown') {
      if (historyIndex < commandHistory.length - 1) {
        historyIndex++;
        termInput.value = commandHistory[historyIndex];
      } else {
        historyIndex = commandHistory.length;
        termInput.value = '';
      }
    }
  });
}

function focusTerminalInput() {
  const termInput = document.getElementById('terminal-input');
  if (termInput) termInput.focus();
}

function executeTerminalCommand(input) {
  const output = document.getElementById('terminal-output');
  const cmd = input.toLowerCase().trim();

  const row = document.createElement('div');
  row.className = 'term-line';
  row.innerHTML = `<span class="prompt-user">vishwajeet@macbook</span>:<span class="prompt-path">~</span>$ ${escapeHtml(input)}`;
  output.appendChild(row);

  let response = '';

  switch (cmd) {
    case 'help':
      response = `Available commands:
  • <span class="term-highlight">about</span>       - Developer bio overview
  • <span class="term-highlight">projects</span>    - List featured applications
  • <span class="term-highlight">skills</span>      - Technical stack breakdown
  • <span class="term-highlight">contact</span>     - Email and networking links
  • <span class="term-highlight">resume</span>      - Experience and career details
  • <span class="term-highlight">shortcuts</span>   - View keyboard shortcuts
  • <span class="term-highlight">theme</span>       - Toggle light/dark wallpaper
  • <span class="term-highlight">whoami</span>      - Current system user
  • <span class="term-highlight">date</span>        - Current date and time
  • <span class="term-highlight">clear</span>       - Clear terminal window
  • <span class="term-highlight">gui [app]</span>    - Open GUI app (finder, safari, notes, calc, music, photos, calendar)`;
      break;

    case 'about':
      response = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle; margin-right:4px;"><circle cx="12" cy="7" r="4"></circle><path d="M5.5 21a8.5 8.5 0 0 1 13 0"></path></svg><strong>Vishwajeet</strong>
Full Stack Engineer & Creative UI Architect.
Passionate about crafting fluid, responsive interfaces, AI-powered applications, and high-performance web systems.`;
      break;

    case 'projects':
      response = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle; margin-right:4px;"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg><strong>Featured Work:</strong>
1. <strong>macOS Web Operating System</strong> [HTML5, CSS3, JS, React Architecture]
2. <strong>AI Multimodal Assistant</strong> [Gemini API, WebSockets, Next.js]
3. <strong>Cloud Commerce Engine</strong> [PostgreSQL, Node.js, Stripe, Redis]
4. <strong>Coquette UI Kit</strong> [Modern Component Library, Micro-animations]

Type <span class="term-highlight">'gui finder'</span> or <span class="term-highlight">'gui safari'</span>!`;
      break;

    case 'skills':
      response = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle; margin-right:4px;"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg><strong>Core Competencies:</strong>
• <strong>Frontend:</strong> React, Next.js, TypeScript, JavaScript (ES6+), Modern CSS3, Tailwind CSS
• <strong>Backend:</strong> Node.js, Express, Python, REST APIs, GraphQL
• <strong>Databases & Cloud:</strong> PostgreSQL, MongoDB, Docker, Git, Vercel, Linux CLI`;
      break;

    case 'contact':
      response = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle; margin-right:4px;"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg><strong>Get in touch:</strong>
• Email: vishwajeet@developer.io
• GitHub: https://github.com
• LinkedIn: https://linkedin.com`;
      break;

    case 'shortcuts':
      openWindow('shortcuts');
      response = `Opening Keyboard Shortcuts cheatsheet...`;
      break;

    case 'resume':
    case 'cat resume':
      response = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle; margin-right:4px;"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg><strong>Experience:</strong>
• Senior Full Stack Developer (2024 - Present)
• Frontend Software Engineer (2022 - 2024)
• B.Tech in Computer Science & Engineering (First Class Honors)`;
      break;

    case 'clear':
      output.innerHTML = '';
      return;

    case 'date':
      response = new Date().toString();
      break;

    case 'whoami':
      response = `vishwajeet (admin) - privileges: full stack root access`;
      break;

    case 'theme':
      toggleTheme();
      response = `Theme toggled successfully!`;
      break;

    case 'gui finder':
      openWindow('finder');
      response = `Opening Finder...`;
      break;

    case 'gui safari':
      openWindow('safari');
      response = `Opening Safari Browser...`;
      break;

    case 'gui notes':
      openWindow('notes');
      response = `Opening Notes...`;
      break;

    case 'gui calc':
    case 'gui calculator':
      openWindow('calculator');
      response = `Opening Calculator...`;
      break;

    case 'gui photos':
      openWindow('photos');
      response = `Opening Photos...`;
      break;

    case 'gui calendar':
      openWindow('calendar');
      response = `Opening Calendar...`;
      break;

    case 'gui music':
      openWindow('music');
      response = `Opening Music Player...`;
      break;

    case 'sudo':
    case 'sudo su':
      response = `[Security] Nice try! With great power comes great responsibility.`;
      break;

    case '':
      break;

    default:
      response = `zsh: command not found: ${escapeHtml(input)}. Type <span class="term-highlight">'help'</span> for a list of commands.`;
  }

  if (response) {
    const resLine = document.createElement('div');
    resLine.className = 'term-line';
    resLine.innerHTML = response;
    output.appendChild(resLine);
  }

  const termBody = document.querySelector('.terminal-body');
  if (termBody) termBody.scrollTop = termBody.scrollHeight;
}

function escapeHtml(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// ==================== FULLY WORKING CALCULATOR ENGINE ====================
let calcCurrent = '0';
let calcPrev = null;
let calcOp = null;
let calcResetOnNext = false;

function calcAction(type, val) {
  macAudio.playPop();
  const screen = document.getElementById('calc-display');
  const formula = document.getElementById('calc-formula');
  const clearBtn = document.getElementById('btn-clear');

  if (type === 'num') {
    if (calcCurrent === '0' || calcResetOnNext) {
      calcCurrent = val;
      calcResetOnNext = false;
    } else {
      if (calcCurrent.length < 12) calcCurrent += val;
    }
  } else if (type === 'decimal') {
    if (calcResetOnNext) {
      calcCurrent = '0.';
      calcResetOnNext = false;
    } else if (!calcCurrent.includes('.')) {
      calcCurrent += '.';
    }
  } else if (type === 'clear') {
    calcCurrent = '0';
    calcPrev = null;
    calcOp = null;
    if (formula) formula.innerHTML = '&nbsp;';
  } else if (type === 'backspace') {
    if (calcCurrent.length > 1) {
      calcCurrent = calcCurrent.slice(0, -1);
    } else {
      calcCurrent = '0';
    }
  } else if (type === 'percent') {
    calcCurrent = (parseFloat(calcCurrent) / 100).toString();
  } else if (type === 'op') {
    calcPrev = parseFloat(calcCurrent);
    calcOp = val;
    calcResetOnNext = true;
    const opSymbols = { '+': '+', '-': '−', '*': '×', '/': '÷' };
    if (formula) formula.textContent = `${calcPrev} ${opSymbols[val] || val}`;
  } else if (type === 'equals') {
    if (calcOp && calcPrev !== null) {
      const cur = parseFloat(calcCurrent);
      let res = 0;
      switch (calcOp) {
        case '+': res = calcPrev + cur; break;
        case '-': res = calcPrev - cur; break;
        case '*': res = calcPrev * cur; break;
        case '/': res = cur !== 0 ? calcPrev / cur : 'Error'; break;
      }
      const opSymbols = { '+': '+', '-': '−', '*': '×', '/': '÷' };
      if (formula) formula.textContent = `${calcPrev} ${opSymbols[calcOp] || calcOp} ${cur} =`;
      calcCurrent = res.toString();
      calcOp = null;
      calcPrev = null;
      calcResetOnNext = true;
    }
  }

  if (screen) {
    screen.textContent = calcCurrent.length > 10 ? parseFloat(calcCurrent).toPrecision(6) : calcCurrent;
  }
  if (clearBtn) {
    clearBtn.textContent = calcCurrent !== '0' ? 'C' : 'AC';
  }
}

// ==================== SAFARI BROWSER ====================
function handleSafariUrl(e) {
  if (e.key === 'Enter') {
    const input = document.getElementById('safari-url');
    if (input) {
      macAudio.playPop();
      const tabLabel = document.getElementById('safari-tab-label');
      if (tabLabel) tabLabel.textContent = input.value.replace(/https?:\/\//, '');
      alert(`Safari Navigated to: ${input.value}`);
    }
  }
}

function safariReload() {
  macAudio.playPop();
  const vp = document.getElementById('safari-viewport');
  if (vp) {
    vp.style.opacity = '0.4';
    setTimeout(() => { vp.style.opacity = '1'; }, 300);
  }
}

function safariGoBack() {
  macAudio.playPop();
  openWindow('finder');
}

// ==================== MUSIC PLAYER ====================
let isPlaying = false;
let currentSongIndex = 0;
const playlist = [
  { title: 'Chill Vibes & Coding', artist: 'Lofi Study Beats', gradient: 'linear-gradient(135deg, #fa709a, #fee140)' },
  { title: 'Sonoma Sunset', artist: 'Ambient Chillhop', gradient: 'linear-gradient(135deg, #a18cd1, #fbc2eb)' },
  { title: 'Deep Focus Flow', artist: 'Synthwave Night', gradient: 'linear-gradient(135deg, #84fab0, #8fd3f4)' }
];

function togglePlayMusic() {
  isPlaying = !isPlaying;
  const btn = document.getElementById('music-play-btn');
  const viz = document.getElementById('music-visualizer');
  macAudio.playPop();

  if (isPlaying) {
    if (btn) btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>';
    if (viz) viz.classList.add('playing');
    macAudio.playChime();
  } else {
    if (btn) btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>';
    if (viz) viz.classList.remove('playing');
  }
}

function nextSong() {
  currentSongIndex = (currentSongIndex + 1) % playlist.length;
  updateSongDetails();
}

function prevSong() {
  currentSongIndex = (currentSongIndex - 1 + playlist.length) % playlist.length;
  updateSongDetails();
}

function updateSongDetails() {
  macAudio.playPop();
  const track = playlist[currentSongIndex];
  document.getElementById('music-track-title').textContent = track.title;
  document.getElementById('music-track-artist').textContent = track.artist;
  document.getElementById('album-art').style.background = track.gradient;
}

// ==================== FINDER FILTERING ====================
function filterCategory(category, el) {
  macAudio.playPop();
  document.querySelectorAll('.sidebar-item').forEach(i => i.classList.remove('active'));
  if (el) el.classList.add('active');

  const cards = document.querySelectorAll('.project-card');
  cards.forEach(card => {
    if (category === 'all' || card.dataset.cat === category) {
      card.style.display = 'flex';
    } else {
      card.style.display = 'none';
    }
  });
}

function filterProjects(query) {
  const q = query.toLowerCase();
  const cards = document.querySelectorAll('.project-card');
  cards.forEach(card => {
    const text = card.textContent.toLowerCase();
    card.style.display = text.includes(q) ? 'flex' : 'none';
  });
}

// ==================== NOTES TABS ====================
function switchNoteTab(tabId, el) {
  macAudio.playPop();
  document.querySelectorAll('.note-list-item').forEach(i => i.classList.remove('active'));
  if (el) el.classList.add('active');

  document.querySelectorAll('.note-tab-content').forEach(c => c.classList.remove('active'));
  const target = document.getElementById(`tab-${tabId}`);
  if (target) target.classList.add('active');
}

// ==================== SPOTLIGHT SEARCH ====================
function initSpotlight() {
  const input = document.getElementById('spotlight-input');
  const trigger = document.getElementById('spotlight-btn');

  if (trigger) {
    trigger.addEventListener('click', toggleSpotlight);
  }

  if (input) {
    input.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase();
      document.querySelectorAll('.spotlight-row').forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(q) ? 'flex' : 'none';
      });
    });
  }
}

function toggleSpotlight() {
  const overlay = document.getElementById('spotlight-overlay');
  const input = document.getElementById('spotlight-input');
  if (!overlay) return;

  if (overlay.classList.contains('hidden')) {
    overlay.classList.remove('hidden');
    macAudio.playPop();
    setTimeout(() => { if (input) input.focus(); }, 50);
  } else {
    closeSpotlight();
  }
}

function closeSpotlight() {
  const overlay = document.getElementById('spotlight-overlay');
  if (overlay) overlay.classList.add('hidden');
}

// ==================== CONTROL CENTER & THEME ====================
function openControlCenter() {
  const cc = document.getElementById('control-center-popover');
  if (!cc) return;
  cc.classList.toggle('hidden');
  macAudio.playPop();
}

function closeControlCenter() {
  const cc = document.getElementById('control-center-popover');
  if (cc) cc.classList.add('hidden');
}

function toggleTheme() {
  macAudio.playPop();
  const root = document.documentElement;
  const isDark = root.getAttribute('data-theme') === 'dark';
  const newTheme = isDark ? 'light' : 'dark';
  root.setAttribute('data-theme', newTheme);

  const icon = document.getElementById('theme-icon');
  if (icon) icon.innerHTML = isDark ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>' : '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>';
}

function cycleWallpaper() {
  macAudio.playPop();
  wallpapers.forEach(w => document.body.classList.remove(w));
  currentWallpaperIndex = (currentWallpaperIndex + 1) % wallpapers.length;
  document.body.classList.add(wallpapers[currentWallpaperIndex]);
}

function cycleWallpaperSpecific(name) {
  macAudio.playPop();
  wallpapers.forEach(w => document.body.classList.remove(w));
  document.body.classList.add(name);
}

function updateBrightness(val) {
  const dimmer = document.getElementById('screen-dimmer');
  const label = document.getElementById('brightness-val');
  if (dimmer) {
    const opacity = (100 - val) / 100 * 0.75;
    dimmer.style.opacity = opacity;
  }
  if (label) label.textContent = `${val}%`;
}

function updateVolume(val) {
  macAudio.volume = val / 100;
  const label = document.getElementById('volume-val');
  if (label) label.textContent = `${val}%`;
}

function toggleCcItem(el) {
  macAudio.playPop();
  el.classList.toggle('active');
}

// ==================== TRASH ====================
function emptyTrash() {
  macAudio.playTrash();
  alert('macOS Trash has been safely emptied!');
}

// ==================== DESKTOP CONTEXT MENU & EVENTS ====================
function initGlobalEvents() {
  const appleTrigger = document.getElementById('apple-menu-trigger');
  const appleDropdown = document.getElementById('apple-dropdown');
  const ccBtn = document.getElementById('control-center-btn');
  const contextMenu = document.getElementById('desktop-context-menu');

  if (appleTrigger && appleDropdown) {
    appleTrigger.addEventListener('click', (e) => {
      e.stopPropagation();
      appleDropdown.classList.toggle('visible');
    });
  }

  if (ccBtn) {
    ccBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      openControlCenter();
    });
  }

  const desktop = document.getElementById('desktop');
  if (desktop && contextMenu) {
    desktop.addEventListener('contextmenu', (e) => {
      if (e.target.closest('.mac-window')) return;
      e.preventDefault();
      contextMenu.style.top = `${e.clientY}px`;
      contextMenu.style.left = `${e.clientX}px`;
      contextMenu.classList.add('visible');
    });
  }

  window.addEventListener('click', () => {
    closeDropdowns();
  });
}

function closeDropdowns() {
  document.querySelectorAll('.mac-dropdown').forEach(d => d.classList.remove('visible'));
  const cc = document.getElementById('control-center-popover');
  if (cc && !cc.classList.contains('hidden')) {
    cc.classList.add('hidden');
  }
}

function selectDesktopIcon(el) {
  document.querySelectorAll('.desktop-icon').forEach(i => i.classList.remove('selected'));
  el.classList.add('selected');
}

// ==================== CONTACT FORM SUBMIT ====================
function handleContactSubmit(e) {
  e.preventDefault();
  macAudio.playChime();

  const email = document.getElementById('contact-email').value;
  const subject = document.getElementById('contact-subject').value;

  alert(`Thank you! Your message regarding "${subject}" has been received. I will reply to ${email} shortly.`);
  closeWindow('contact');
  e.target.reset();
}

// ==================== QUICKLOOK & MULTI-FORMAT DOCUMENT VIEWER ====================
const FILE_DATABASE = {
  'resume.pdf': {
    name: 'Resume.pdf',
    type: 'PDF Document',
    tag: 'PDF',
    size: '482 KB',
    date: 'Oct 4, 2026',
    render: () => `
      <div class="quicklook-paper">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:12px;">
          <div>
            <h1>Vishwajeet</h1>
            <p style="font-weight:600; color:#555; margin-bottom:4px;">Senior AI & Full-Stack Systems Engineer · Bengaluru, India</p>
            <p style="font-size:12px; color:#777;">Email: vishwajeet@engineer.dev · GitHub: @vishwajeet · Web: portfolio.internal</p>
          </div>
          <span style="background:#e74c3c; color:#fff; font-size:10px; font-weight:800; padding:3px 8px; border-radius:4px;">VERIFIED PDF</span>
        </div>
        <h2>Summary & Core Competencies</h2>
        <p>Architect of distributed AI agentic workflows, high-throughput microservices, and interactive macOS desktop experiences. Specializing in TypeScript, React, Python, PyTorch, Go, Docker, WebGL/Canvas shaders, and Kubernetes.</p>
        <h2>Featured Engineering Highlights</h2>
        <ul style="font-size:13px; color:#333; margin-left:18px; margin-bottom:12px; line-height:1.6;">
          <li><b>JARVIS AI Operating System</b>: Voice-activated autonomous workstation controller with sub-180ms latency.</li>
          <li><b>Learnify AI EdTech Engine</b>: Adaptive pedagogical curriculum system serving 120,000+ active scholars.</li>
          <li><b>DreamSync Autonomous Sync</b>: Zero-conflict multi-cloud replication daemon across S3, R2, and GCS.</li>
        </ul>
        <h2>Education & Accreditations</h2>
        <p>Bachelor of Technology in Computer Science & Engineering · First Class with Distinction</p>
      </div>
    `
  },
  'project-spec.docx': {
    name: 'project-spec.docx',
    type: 'Word Document',
    tag: 'DOCX',
    size: '128 KB',
    date: 'Today at 10:45 AM',
    render: () => `
      <div class="quicklook-paper">
        <div style="text-align:center; margin-bottom:20px;">
          <span style="font-size:11px; text-transform:uppercase; letter-spacing:1.5px; color:#2980b9; font-weight:700;">Internal Engineering RFC #204</span>
          <h1 style="border:none; margin-top:6px;">Next-Gen macOS Web Portfolio Specification</h1>
          <p style="font-size:12px; color:#666;">Authored by Vishwajeet · Status: Approved for Production</p>
        </div>
        <h2>1. Abstract & High-Level Goal</h2>
        <p>This technical specification outlines the design standards, cosine-based dock physics, responsive window management, and procedural canvas landscape backgrounds for the dual-portfolio distribution.</p>
        <h2>2. Architecture Principles</h2>
        <p>1. <b>Zero-Dependency Reliability</b>: Pure Vanilla CSS3 transitions, semantic HTML5, and ES6+ modular architecture ensuring instant page loads.</p>
        <p>2. <b>Authentic macOS Ergonomics</b>: Exact Monterey/Sonoma/Sequoia border radii, drop shadows, vibrancy backdrops, and QuickLook inspection.</p>
      </div>
    `
  },
  'financial-model.xlsx': {
    name: 'financial-model.xlsx',
    type: 'Excel Spreadsheet',
    tag: 'XLSX',
    size: '94 KB',
    date: 'Yesterday at 4:18 PM',
    render: () => `
      <div class="quicklook-sheet-wrap">
        <div class="quicklook-formula-bar">
          <span style="color:#27ae60; font-weight:700;">fx</span>
          <span style="color:#aaa;">=SUM(B2:E2) — Total FY26 Cloud & AI Infrastructure Budget</span>
        </div>
        <table class="quicklook-sheet-table">
          <thead>
            <tr>
              <th>Row</th>
              <th>Category</th>
              <th>Q1 (USD)</th>
              <th>Q2 (USD)</th>
              <th>Q3 (USD)</th>
              <th>Q4 (USD)</th>
              <th>Annual Total</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="text-align:center; color:#888;">1</td>
              <td><b>GPU Inference Cluster</b></td>
              <td>$14,200</td><td>$18,400</td><td>$22,100</td><td>$26,500</td>
              <td style="font-weight:700; color:#27ae60;">$81,200</td>
              <td><span style="color:#27ae60;">● Active</span></td>
            </tr>
            <tr>
              <td style="text-align:center; color:#888;">2</td>
              <td><b>Cloud Storage (S3 / R2)</b></td>
              <td>$3,100</td><td>$3,800</td><td>$4,200</td><td>$4,900</td>
              <td style="font-weight:700; color:#27ae60;">$16,000</td>
              <td><span style="color:#27ae60;">● Active</span></td>
            </tr>
            <tr>
              <td style="text-align:center; color:#888;">3</td>
              <td><b>Database Sharding (Postgres)</b></td>
              <td>$2,400</td><td>$2,600</td><td>$2,800</td><td>$3,200</td>
              <td style="font-weight:700; color:#27ae60;">$11,000</td>
              <td><span style="color:#27ae60;">● Active</span></td>
            </tr>
            <tr>
              <td style="text-align:center; color:#888;">4</td>
              <td><b>Edge CDN & DDoS Shield</b></td>
              <td>$1,200</td><td>$1,400</td><td>$1,500</td><td>$1,700</td>
              <td style="font-weight:700; color:#27ae60;">$5,800</td>
              <td><span style="color:#27ae60;">● Active</span></td>
            </tr>
            <tr style="background:rgba(39, 174, 96, 0.12); font-weight:700;">
              <td style="text-align:center; color:#27ae60;">Σ</td>
              <td><b>Consolidated Total</b></td>
              <td>$20,900</td><td>$26,200</td><td>$30,600</td><td>$36,300</td>
              <td style="color:#27ae60; font-size:13px;">$114,000</td>
              <td><b>Target Achieved</b></td>
            </tr>
          </tbody>
        </table>
      </div>
    `
  },
  'architecture.md': {
    name: 'architecture.md',
    type: 'Markdown Document',
    tag: 'MD',
    size: '18 KB',
    date: 'Oct 3, 2026',
    render: () => `
      <div class="quicklook-md-wrap">
        <h1># Learnify AI Core Architecture</h1>
        <p>A distributed microservices topology leveraging event-driven queues, vector embeddings, and real-time WebSockets.</p>
        <h2>## Pipeline Topology</h2>
        <pre><code>Client Request -> Cloudflare Edge -> Envoy Gateway -> FastAPI Controller
                                                     │
                                                     ├──-> Redis Cache (State)
                                                     ├──-> PostgreSQL (Prisma)
                                                     └──-> Ray Cluster (LLM Inference)</code></pre>
        <h2>## Key Specifications</h2>
        <p>- <b>Latency SLA</b>: p99 &lt; 220ms on streaming responses</p>
        <p>- <b>Fault Tolerance</b>: Automatic circuit-breaker failover with exponential backoff</p>
        <p>- <b>Observability</b>: OpenTelemetry traces piped to Grafana & Prometheus</p>
      </div>
    `
  },
  'algorithm.js': {
    name: 'algorithm.js',
    type: 'JavaScript Source',
    tag: 'JS',
    size: '8.4 KB',
    date: 'Oct 2, 2026',
    render: () => `
      <div class="quicklook-code-wrap">
        <div class="quicklook-code-lines">
          1<br>2<br>3<br>4<br>5<br>6<br>7<br>8<br>9<br>10<br>11<br>12<br>13<br>14<br>15<br>16<br>17<br>18<br>19<br>20
        </div>
        <div class="quicklook-code-content">
<span class="code-comment">// High-performance Token Bucket Rate Limiter with sub-millisecond precision</span>
<span class="code-keyword">export class</span> <span class="code-fn">TokenBucket</span> {
  <span class="code-fn">constructor</span>(capacity = <span class="code-num">100</span>, refillRate = <span class="code-num">10</span>) {
    <span class="code-keyword">this</span>.capacity = capacity;
    <span class="code-keyword">this</span>.refillRate = refillRate; <span class="code-comment">// tokens added per second</span>
    <span class="code-keyword">this</span>.tokens = capacity;
    <span class="code-keyword">this</span>.lastRefill = Date.<span class="code-fn">now</span>();
  }

  <span class="code-fn">consume</span>(count = <span class="code-num">1</span>) {
    <span class="code-keyword">const</span> now = Date.<span class="code-fn">now</span>();
    <span class="code-keyword">const</span> delta = (now - <span class="code-keyword">this</span>.lastRefill) / <span class="code-num">1000</span>;
    <span class="code-keyword">this</span>.tokens = Math.<span class="code-fn">min</span>(<span class="code-keyword">this</span>.capacity, <span class="code-keyword">this</span>.tokens + delta * <span class="code-keyword">this</span>.refillRate);
    <span class="code-keyword">this</span>.lastRefill = now;

    <span class="code-keyword">if</span> (<span class="code-keyword">this</span>.tokens &gt;= count) {
      <span class="code-keyword">this</span>.tokens -= count;
      <span class="code-keyword">return true</span>; <span class="code-comment">// Approved</span>
    }
    <span class="code-keyword">return false</span>; <span class="code-comment">// Rate limited</span>
  }
}</div>
      </div>
    `
  }
};

let currentQuickLookFile = null;

function openQuickLookFile(filename) {
  const fileKey = filename.toLowerCase();
  const fileData = FILE_DATABASE[fileKey] || {
    name: filename,
    type: 'Plain Text Document',
    tag: filename.split('.').pop().toUpperCase() || 'TXT',
    size: '12 KB',
    date: 'Just now',
    render: () => `
      <div style="padding: 24px; font-family: ui-monospace, Menlo, monospace; font-size: 13px; line-height: 1.6;">
        <h3 style="margin-bottom:12px; font-family: var(--font-system);"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle; margin-right:6px;"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>${filename}</h3>
        <textarea style="width:100%; height:320px; background:rgba(0,0,0,0.25); color:#fff; border:1px solid var(--window-border); border-radius:8px; padding:12px; font-family:inherit; font-size:12.5px; resize:none;">
// File content for ${filename}
// Created dynamically via macOS Portfolio File System
console.log("Interactive file viewer loaded successfully for ${filename}");
        </textarea>
      </div>
    `
  };

  currentQuickLookFile = fileData;
  const win = document.getElementById('window-quicklook');
  const titleEl = document.getElementById('quicklook-title');
  const typeEl = document.getElementById('quicklook-type');
  const metaEl = document.getElementById('quicklook-meta');
  const bodyEl = document.getElementById('quicklook-body');

  if (titleEl) titleEl.textContent = `${fileData.name} — Quick Look`;
  if (typeEl) typeEl.textContent = fileData.tag;
  if (metaEl) metaEl.textContent = `Size: ${fileData.size} · Modified: ${fileData.date} · Format: ${fileData.type}`;
  if (bodyEl) bodyEl.innerHTML = fileData.render();

  openWindow('quicklook');
}

function quicklookCopy() {
  macAudio.playPop();
  navigator.clipboard?.writeText(currentQuickLookFile?.name || 'Copied');
  alert(`Copied "${currentQuickLookFile?.name || 'File'}" details to clipboard.`);
}

function quicklookPrint() {
  macAudio.playPop();
  window.print();
}

// ==================== NEW FILE & FOLDER CREATION MODAL ====================
let selectedCreationFormat = 'txt';

function openCreateModal(initialType = 'file') {
  macAudio.playPop();
  closeDropdowns();
  const modal = document.getElementById('file-creation-modal');
  const title = document.getElementById('create-modal-title');
  const icon = document.getElementById('create-modal-icon');
  const input = document.getElementById('create-file-name');

  if (modal) modal.style.display = 'flex';
  if (initialType === 'folder') {
    if (title) title.textContent = 'Create New Folder';
    if (icon) icon.innerHTML = '<img src="./assets/icons/folder.png" style="width:20px; height:20px; object-fit:contain; vertical-align:middle;" alt="">';
    if (input) input.value = 'New Folder';
    selectCreateFormat('folder');
  } else {
    if (title) title.textContent = 'Create New File';
    if (icon) icon.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>';
    if (input) input.value = 'untitled.txt';
    selectCreateFormat('txt');
  }

  setTimeout(() => input?.focus(), 50);
}

function closeCreateModal() {
  macAudio.playPop();
  const modal = document.getElementById('file-creation-modal');
  if (modal) modal.style.display = 'none';
}

function selectCreateFormat(fmt) {
  selectedCreationFormat = fmt;
  document.querySelectorAll('.format-chip').forEach(c => c.classList.remove('active'));
  const target = Array.from(document.querySelectorAll('.format-chip')).find(c => c.textContent.trim().toLowerCase() === fmt.toLowerCase());
  if (target) target.classList.add('active');

  const input = document.getElementById('create-file-name');
  if (input) {
    if (fmt === 'folder') {
      input.value = 'New Folder';
    } else {
      const base = input.value.split('.')[0] || 'untitled';
      input.value = `${base}.${fmt}`;
    }
  }
}

function confirmCreateFile() {
  const input = document.getElementById('create-file-name');
  const name = input?.value.trim() || (selectedCreationFormat === 'folder' ? 'New Folder' : `untitled.${selectedCreationFormat}`);
  closeCreateModal();
  macAudio.playChime();

  createDesktopItem(name, selectedCreationFormat);
}

function openCreateSpecific(defaultName) {
  closeDropdowns();
  macAudio.playChime();
  const ext = defaultName.split('.').pop();
  createDesktopItem(defaultName, ext);
}

function createDesktopItem(name, type) {
  const desktopGrid = document.querySelector('.desktop-grid');
  if (!desktopGrid) return;

  const item = document.createElement('div');
  item.className = 'desktop-icon';
  item.style.animation = 'macWindowOpen 0.35s cubic-bezier(0.16, 1, 0.3, 1)';
  item.onclick = function() { selectDesktopIcon(this); };

  let iconSvg = '';
  if (type === 'folder') {
    item.ondblclick = () => openWindow('finder');
    iconSvg = '<img src="assets/icons/folder.png" width="54" height="54" alt="Folder" class="desktop-img-icon" />';
  } else if (type === 'pdf') {
    item.ondblclick = () => openQuickLookFile(name);
    iconSvg = '<svg viewBox="0 0 54 54" width="54" height="54"><rect x="7" y="3" width="40" height="48" rx="6" fill="#e74c3c"/><path d="M33 3 L47 17 L33 17 Z" fill="#c0392b"/><text x="27" y="32" font-family="sans-serif" font-size="9" font-weight="800" fill="#fff" text-anchor="middle">PDF</text></svg>';
  } else if (type === 'xlsx') {
    item.ondblclick = () => openQuickLookFile(name);
    iconSvg = '<svg viewBox="0 0 54 54" width="54" height="54"><rect x="7" y="3" width="40" height="48" rx="6" fill="#27ae60"/><path d="M33 3 L47 17 L33 17 Z" fill="#219653"/><text x="27" y="32" font-family="sans-serif" font-size="9" font-weight="800" fill="#fff" text-anchor="middle">XLSX</text></svg>';
  } else if (type === 'docx') {
    item.ondblclick = () => openQuickLookFile(name);
    iconSvg = '<svg viewBox="0 0 54 54" width="54" height="54"><rect x="7" y="3" width="40" height="48" rx="6" fill="#2980b9"/><path d="M33 3 L47 17 L33 17 Z" fill="#1f618d"/><text x="27" y="32" font-family="sans-serif" font-size="9" font-weight="800" fill="#fff" text-anchor="middle">DOCX</text></svg>';
  } else if (type === 'md') {
    item.ondblclick = () => openQuickLookFile(name);
    iconSvg = '<svg viewBox="0 0 54 54" width="54" height="54"><rect x="7" y="3" width="40" height="48" rx="6" fill="#8e44ad"/><path d="M33 3 L47 17 L33 17 Z" fill="#71368a"/><text x="27" y="32" font-family="monospace" font-size="11" font-weight="800" fill="#fff" text-anchor="middle">#MD</text></svg>';
  } else if (type === 'js' || type === 'py') {
    item.ondblclick = () => openQuickLookFile(name);
    iconSvg = '<svg viewBox="0 0 54 54" width="54" height="54"><rect x="7" y="3" width="40" height="48" rx="6" fill="#f39c12"/><path d="M33 3 L47 17 L33 17 Z" fill="#d68910"/><text x="27" y="32" font-family="monospace" font-size="11" font-weight="800" fill="#fff" text-anchor="middle">&lt;/&gt;</text></svg>';
  } else {
    item.ondblclick = () => openQuickLookFile(name);
    iconSvg = '<img src="assets/icons/notes.png" width="54" height="54" alt="File" class="desktop-img-icon" />';
  }

  item.innerHTML = `
    <div class="icon-graphic" style="position: relative;">
      ${iconSvg}
    </div>
    <span class="icon-title">${name}</span>
  `;

  desktopGrid.appendChild(item);
  alert(`Created new ${type === 'folder' ? 'folder' : 'file'}: "${name}". Double-click to open.`);
}

