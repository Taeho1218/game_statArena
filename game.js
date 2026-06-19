/* ==========================================================================
   GAME ENGINE - ARENA OF STATS
   ========================================================================== */

// --- Global Sound Synthesizer (Web Audio API) ---
const SoundSynth = {
  ctx: null,

  init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
  },

  playClick() {
    this.init();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, this.ctx.currentTime + 0.05);

    gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.05);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.05);
  },

  playShoot() {
    this.init();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(300, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1200, this.ctx.currentTime + 0.15);

    gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.15);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.15);
  },

  playHit(isCritical = false) {
    this.init();
    if (!this.ctx) return;
    // Sound generation: Noise & low freq sweep for impact
    const bufferSize = this.ctx.sampleRate * 0.1;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(isCritical ? 800 : 400, this.ctx.currentTime);

    const gain = this.ctx.createGain();
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    gain.gain.setValueAtTime(isCritical ? 0.25 : 0.15, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.1);

    // Add extra metal tone for critical hits
    if (isCritical) {
      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();
      osc.connect(oscGain);
      oscGain.connect(this.ctx.destination);
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(150, this.ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(50, this.ctx.currentTime + 0.08);
      oscGain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      oscGain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.08);
    }

    noise.start();
    noise.stop(this.ctx.currentTime + 0.1);
  },

  playVictory() {
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const notes = [261.63, 329.63, 392.00, 523.25]; // C4, E4, G4, C5
    notes.forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + i * 0.1);
      gain.gain.setValueAtTime(0.08, now + i * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.1 + 0.3);
      osc.start(now + i * 0.1);
      osc.stop(now + i * 0.1 + 0.35);
    });
  },

  playDefeat() {
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const notes = [220.00, 207.65, 196.00, 164.81]; // A3, Ab3, G3, E3
    notes.forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, now + i * 0.15);
      gain.gain.setValueAtTime(0.06, now + i * 0.15);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.15 + 0.4);
      osc.start(now + i * 0.15);
      osc.stop(now + i * 0.15 + 0.45);
    });
  },

  playJump() {
    this.init();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(150, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(600, this.ctx.currentTime + 0.12);

    gain.gain.setValueAtTime(0.06, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.12);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.12);
  }
};

// --- Procedural SVG Avatar Generator ---
function generateAvatarSVG(stats, size = 120) {
  if (stats.id === 'dummy' || stats.name === '목각인형 샌드백') {
    return `
      <svg width="${size}" height="${size}" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="dummyWood" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#b45309"/>
            <stop offset="100%" stop-color="#451a03"/>
          </radialGradient>
        </defs>
        <rect x="10" y="10" width="100" height="100" rx="12" fill="url(#dummyWood)" stroke="#d97706" stroke-width="3"/>
        <circle cx="60" cy="60" r="32" fill="none" stroke="#ffffff" stroke-width="3"/>
        <circle cx="60" cy="60" r="20" fill="#ef4444" stroke="#ffffff" stroke-width="2"/>
        <circle cx="60" cy="60" r="8" fill="#ffffff"/>
        <line x1="60" y1="100" x2="60" y2="120" stroke="#78350f" stroke-width="6"/>
      </svg>
    `;
  }
  const { atk = 0, rng = 0, spd = 0, asp = 0, hp = 0 } = stats;

  // Determine main aesthetic attributes based on stats
  let primaryColor = '#8b5cf6'; // Violet base
  let secondaryColor = '#ec4899'; // Pink/Magenta base
  let eyeColor = '#06b6d4'; // Cyan base

  if (atk > hp && atk > rng) {
    primaryColor = '#ef4444'; // Red for heavy attack
    secondaryColor = '#f97316'; // Orange
    eyeColor = '#ef4444';
  } else if (hp > atk && hp > spd) {
    primaryColor = '#a855f7'; // Purple for high HP/Tank
    secondaryColor = '#6366f1'; // Indigo
    eyeColor = '#10b981'; // Green eyes
  } else if (rng > atk && rng > spd) {
    primaryColor = '#3b82f6'; // Blue for ranged
    secondaryColor = '#06b6d4'; // Cyan
    eyeColor = '#eab308'; // Gold eyes
  } else if (spd > hp && spd > atk) {
    primaryColor = '#10b981'; // Green for speed
    secondaryColor = '#34d399';
    eyeColor = '#06b6d4';
  } else if (asp > hp) {
    primaryColor = '#f59e0b'; // Gold for attack speed
    secondaryColor = '#f97316';
    eyeColor = '#ec4899';
  }

  // Draw elements dynamically
  const isTank = hp > 35;
  const isRanged = rng > 35;
  const isHeavyDealer = atk > 35;
  const isSpeedster = spd > 30;

  // SVG components
  let weapons = '';
  let armor = '';
  let aura = '';

  // 1. Aura Effects
  if (isSpeedster) {
    aura += `
      <path d="M 10,60 L 30,55 M 10,75 L 30,70" stroke="${secondaryColor}" stroke-width="3" stroke-linecap="round" opacity="0.6"/>
      <path d="M 110,60 L 90,55 M 110,75 L 90,70" stroke="${secondaryColor}" stroke-width="3" stroke-linecap="round" opacity="0.6"/>
    `;
  }
  if (asp > 30) {
    aura += `
      <circle cx="60" cy="60" r="48" fill="none" stroke="${primaryColor}" stroke-width="2" stroke-dasharray="8,6" opacity="0.5">
        <animateTransform attributeName="transform" type="rotate" from="0 60 60" to="360 60 60" dur="8s" repeatCount="indefinite" />
      </circle>
    `;
  }

  // 2. Weapons
  if (isRanged) {
    // Magic Orb / Wand
    weapons += `
      <circle cx="28" cy="80" r="10" fill="url(#orbGrad)" filter="url(#glow)"/>
      <line x1="28" y1="80" x2="28" y2="105" stroke="#78350f" stroke-width="4" stroke-linecap="round"/>
      <path d="M 28,68 L 22,74 M 28,68 L 34,74" stroke="${eyeColor}" stroke-width="2" stroke-linecap="round"/>
    `;
  } else {
    // Melee: Sword or Axe
    if (isHeavyDealer) {
      // Big Sword
      weapons += `
        <path d="M 25,45 L 35,45 L 35,95 L 30,105 L 25,95 Z" fill="#9ca3af" stroke="${primaryColor}" stroke-width="2"/>
        <line x1="20" y1="95" x2="40" y2="95" stroke="#4b5563" stroke-width="4"/>
        <line x1="30" y1="95" x2="30" y2="110" stroke="#1f2937" stroke-width="4"/>
        <circle cx="30" cy="40" r="3" fill="${secondaryColor}"/>
      `;
    } else {
      // Light Dagger / Shortsword
      weapons += `
        <path d="M 27,65 L 33,65 L 33,95 L 30,100 L 27,95 Z" fill="#d1d5db" stroke="${secondaryColor}" stroke-width="1.5"/>
        <line x1="24" y1="95" x2="36" y2="95" stroke="#4b5563" stroke-width="2"/>
        <line x1="30" y1="95" x2="30" y2="105" stroke="#1f2937" stroke-width="3"/>
      `;
    }
  }

  // Shield
  if (isTank) {
    weapons += `
      <path d="M 82,75 C 82,75 82,105 92,105 C 102,105 102,75 102,75 Z" fill="${primaryColor}" stroke="#ffffff" stroke-width="2"/>
      <path d="M 87,80 L 97,95 M 97,80 L 87,95" stroke="${secondaryColor}" stroke-width="1.5"/>
    `;
  }

  // 3. Armor/Helmet
  if (isTank) {
    armor += `
      <!-- Heavy Pauldrons -->
      <path d="M 32,80 Q 40,65 52,72" stroke="#4b5563" stroke-width="8" stroke-linecap="round"/>
      <path d="M 88,80 Q 80,65 68,72" stroke="#4b5563" stroke-width="8" stroke-linecap="round"/>
      <!-- Iron Helmet -->
      <path d="M 42,52 Q 60,32 78,52 Z" fill="#374151" stroke="${primaryColor}" stroke-width="2"/>
      <path d="M 52,48 L 68,48 L 60,35 Z" fill="${secondaryColor}"/>
    `;
  } else {
    armor += `
      <!-- Shoulder pads -->
      <circle cx="42" cy="76" r="6" fill="${primaryColor}"/>
      <circle cx="78" cy="76" r="6" fill="${primaryColor}"/>
      <!-- Hood -->
      <path d="M 42,55 Q 60,38 78,55 Q 85,75 75,85 L 45,85 Q 35,75 42,55 Z" fill="#1f2937" stroke="${secondaryColor}" stroke-width="1" opacity="0.9"/>
    `;
  }

  const svg = `
    <svg width="${size}" height="${size}" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="bgGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="${primaryColor}" stop-opacity="0.2"/>
          <stop offset="100%" stop-color="#090514" stop-opacity="0.9"/>
        </radialGradient>
        <radialGradient id="orbGrad" cx="35%" cy="35%" r="50%">
          <stop offset="0%" stop-color="#ffffff"/>
          <stop offset="70%" stop-color="${eyeColor}"/>
          <stop offset="100%" stop-color="${primaryColor}"/>
        </radialGradient>
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      <!-- Background circle -->
      <circle cx="60" cy="60" r="54" fill="url(#bgGrad)" stroke="${primaryColor}" stroke-width="2" opacity="0.85"/>
      <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="1"/>

      <!-- Aura Effects -->
      ${aura}

      <!-- Character Shadow -->
      <ellipse cx="60" cy="108" rx="22" ry="5" fill="#000000" opacity="0.5"/>

      <!-- Body / Head -->
      <path d="M 45,82 C 45,72 75,72 75,82 L 72,102 L 48,102 Z" fill="#4b5563" stroke="#1f2937" stroke-width="2"/>
      <circle cx="60" cy="62" r="18" fill="#e5e7eb" stroke="#374151" stroke-width="2"/>

      <!-- Eyes (Glowing) -->
      <circle cx="53" cy="60" r="3" fill="${eyeColor}" filter="url(#glow)"/>
      <circle cx="67" cy="60" r="3" fill="${eyeColor}" filter="url(#glow)"/>

      <!-- Armor & Helmet Overlay -->
      ${armor}

      <!-- Weapons & Equipment Overlay -->
      ${weapons}

      <!-- Center Crest (Small emblem) -->
      <polygon points="60,78 64,84 60,90 56,84" fill="${secondaryColor}"/>
    </svg>
  `;
  return svg;
}

// --- Local Storage Management ---
const CharDB = {
  KEY: 'stat_arena_characters',

  get() {
    try {
      const data = localStorage.getItem(this.KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('로컬스토리지 로드 실패', e);
      return [];
    }
  },

  save(characters) {
    try {
      localStorage.setItem(this.KEY, JSON.stringify(characters));
    } catch (e) {
      console.error('로컬스토리지 저장 실패', e);
    }
  },

  add(character) {
    const list = this.get();
    if (list.length >= 6) return false;
    list.push(character);
    this.save(list);
    return true;
  },

  update(id, updatedChar) {
    const list = this.get();
    const idx = list.findIndex(c => c.id === id);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...updatedChar };
      this.save(list);
      return true;
    }
    return false;
  },

  delete(id) {
    const list = this.get();
    const filtered = list.filter(c => c.id !== id);
    this.save(filtered);
    return true;
  }
};

// --- SPA Screen Manager ---
const Navigation = {
  screens: ['main-menu-screen', 'characters-screen', 'creator-screen', 'battle-lobby-screen', 'matching-screen', 'arena-screen', 'guide-screen'],

  init() {
    // Back buttons with data-target
    document.querySelectorAll('.btn-back').forEach(btn => {
      btn.addEventListener('click', (e) => {
        SoundSynth.playClick();
        const target = btn.getAttribute('data-target');
        this.go(target);
      });
    });

    document.getElementById('btn-goto-characters').addEventListener('click', () => {
      SoundSynth.playClick();
      CharactersPage.renderGrid();
      this.go('characters-screen');
    });

    document.getElementById('btn-quick-battle').addEventListener('click', () => {
      SoundSynth.playClick();
      LobbyPage.init();
      this.go('battle-lobby-screen');
    });

    document.getElementById('btn-goto-guide').addEventListener('click', () => {
      SoundSynth.playClick();
      this.go('guide-screen');
    });
  },

  go(screenId) {
    this.screens.forEach(s => {
      const el = document.getElementById(s);
      if (s === screenId) {
        el.classList.add('active');
      } else {
        el.classList.remove('active');
      }
    });

    // Handle screen transition logic / cleanups
    if (screenId !== 'arena-screen') {
      BattleArena.stop();
    }
  }
};

// --- Radar Chart Drawing ---
const RadarChart = {
  canvas: null,
  ctx: null,
  labels: ['공격력', '사거리', '이동속도', '공격속도', '체력'],

  init() {
    this.canvas = document.getElementById('radar-chart');
    this.ctx = this.canvas.getContext('2d');
  },

  draw(stats) {
    if (!this.canvas) this.init();
    const ctx = this.ctx;
    const cw = this.canvas.width;
    const ch = this.canvas.height;
    ctx.clearRect(0, 0, cw, ch);

    const cx = cw / 2;
    const cy = ch / 2;
    const radius = 70;
    const numAxes = 5;

    // Background Hexagon Grid
    const levels = [25, 50, 75, 100];
    levels.forEach(lvl => {
      ctx.beginPath();
      for (let i = 0; i < numAxes; i++) {
        const angle = i * 2 * Math.PI / numAxes - Math.PI / 2;
        const x = cx + Math.cos(angle) * (radius * (lvl / 100));
        const y = cy + Math.sin(angle) * (radius * (lvl / 100));
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.strokeStyle = 'rgba(139, 92, 246, 0.15)';
      ctx.lineWidth = 1;
      ctx.stroke();
    });

    // Draw Axes Lines
    ctx.strokeStyle = 'rgba(139, 92, 246, 0.2)';
    for (let i = 0; i < numAxes; i++) {
      const angle = i * 2 * Math.PI / numAxes - Math.PI / 2;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius);
      ctx.stroke();

      // Labels Text
      const textDist = radius + 15;
      const lx = cx + Math.cos(angle) * textDist;
      const ly = cy + Math.sin(angle) * textDist;
      ctx.font = '700 10px "Noto Sans KR"';
      ctx.fillStyle = '#9ca3af';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(this.labels[i], lx, ly);
    }

    // Draw Player Stat Area
    const statKeys = ['atk', 'rng', 'spd', 'asp', 'hp'];
    ctx.beginPath();
    for (let i = 0; i < numAxes; i++) {
      const val = stats[statKeys[i]] || 0;
      const angle = i * 2 * Math.PI / numAxes - Math.PI / 2;
      // Map 0-100 to 0-radius. Cap min scale to show central node
      const dist = (Math.max(val, 2) / 100) * radius;
      const x = cx + Math.cos(angle) * dist;
      const y = cy + Math.sin(angle) * dist;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();

    // Fill Color Gradient
    const gradient = ctx.createRadialGradient(cx, cy, 5, cx, cy, radius);
    gradient.addColorStop(0, 'rgba(6, 182, 212, 0.3)');
    gradient.addColorStop(1, 'rgba(139, 92, 246, 0.55)');
    ctx.fillStyle = gradient;
    ctx.fill();

    ctx.strokeStyle = '#22d3ee';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw Vertices Points
    for (let i = 0; i < numAxes; i++) {
      const val = stats[statKeys[i]] || 0;
      const angle = i * 2 * Math.PI / numAxes - Math.PI / 2;
      const dist = (Math.max(val, 2) / 100) * radius;
      const x = cx + Math.cos(angle) * dist;
      const y = cy + Math.sin(angle) * dist;

      ctx.beginPath();
      ctx.circle = ctx.arc(x, y, 4, 0, 2 * Math.PI);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
      ctx.strokeStyle = '#ec4899';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }
  }
};

// --- Page: Characters Manager ---
const CharactersPage = {
  renderGrid() {
    const list = CharDB.get();
    const grid = document.getElementById('character-grid');
    grid.innerHTML = '';

    // Render slots (Total 6)
    for (let i = 0; i < 6; i++) {
      if (i < list.length) {
        const char = list[i];
        const winRate = char.winCount + char.lossCount > 0 
          ? Math.round((char.winCount / (char.winCount + char.lossCount)) * 100) 
          : 0;

        const card = document.createElement('div');
        card.className = 'character-card card-glass';
        card.innerHTML = `
          <button class="btn-card-delete" data-id="${char.id}" title="삭제">✕</button>
          <div class="char-card-avatar">
            ${generateAvatarSVG(char, 75)}
          </div>
          <h2 class="char-card-name">${escapeHTML(char.name)}</h2>
          <div class="char-card-level">RATING: ${char.rating || 1000} (${char.winCount}승 ${char.lossCount}패, ${winRate}%)</div>
          
          <div class="char-card-stats">
            <span class="stat-chip atk">공격력 ${char.atk}</span>
            <span class="stat-chip rng">사거리 ${char.rng}</span>
            <span class="stat-chip spd">이속 ${char.spd}</span>
            <span class="stat-chip asp">공속 ${char.asp}</span>
            <span class="stat-chip hp">체력 ${char.hp}</span>
          </div>
        `;

        // Action Bindings - clicking card opens character creator details
        card.addEventListener('click', () => {
          SoundSynth.playClick();
          CreatorPage.init(char);
        });

        card.querySelector('.btn-card-delete').addEventListener('click', (e) => {
          e.stopPropagation(); // Prevent opening creator when deleting
          SoundSynth.playClick();
          if (confirm(`정말 "${char.name}" 캐릭터를 삭제하시겠습니까?`)) {
            CharDB.delete(char.id);
            this.renderGrid();
          }
        });

        grid.appendChild(card);
      } else {
        // Empty Plus slot
        const emptyCard = document.createElement('div');
        emptyCard.className = 'empty-slot-card';
        emptyCard.innerHTML = `
          <div class="plus-icon">+</div>
          <div class="empty-slot-text">캐릭터 생성</div>
        `;
        emptyCard.addEventListener('click', () => {
          SoundSynth.playClick();
          CreatorPage.init(null);
        });
        grid.appendChild(emptyCard);
      }
    }
  }
};

// --- Page: Character Creator ---
const CreatorPage = {
  currentId: null, // null if creating, string if editing
  stats: { atk: 20, rng: 20, spd: 20, asp: 20, hp: 20 },
  maxPoints: 100,

  init(editingChar = null) {
    this.currentId = editingChar ? editingChar.id : null;
    
    // Set Title
    document.getElementById('creator-title').innerText = editingChar ? '캐릭터 수정' : '신규 캐릭터 생성';
    
    // Set Name
    const nameInput = document.getElementById('char-name');
    nameInput.value = editingChar ? editingChar.name : '';
    nameInput.disabled = editingChar ? true : false; // Do not allow name edits to keep it clean

    // Set Stats
    if (editingChar) {
      this.stats = {
        atk: editingChar.atk,
        rng: editingChar.rng,
        spd: editingChar.spd,
        asp: editingChar.asp,
        hp: editingChar.hp
      };
    } else {
      this.stats = { atk: 20, rng: 20, spd: 20, asp: 20, hp: 20 };
    }

    // Set Up Sliders
    this.updateUI();

    // Attach Event Listeners (Once)
    if (!this.initialized) {
      this.bindEvents();
      this.initialized = true;
    }

    Navigation.go('creator-screen');
  },

  bindEvents() {
    const statKeys = ['atk', 'rng', 'spd', 'asp', 'hp'];
    
    statKeys.forEach(key => {
      const slider = document.getElementById(`slider-${key}`);
      const btnMinus = document.querySelector(`.slider-item[data-stat="${key}"] .btn-minus`);
      const btnPlus = document.querySelector(`.slider-item[data-stat="${key}"] .btn-plus`);

      // Slider change
      slider.addEventListener('input', (e) => {
        const targetVal = parseInt(e.target.value);
        this.adjustStat(key, targetVal);
      });

      // Minus button
      btnMinus.addEventListener('click', () => {
        SoundSynth.playClick();
        this.adjustStat(key, this.stats[key] - 5);
      });

      // Plus button
      btnPlus.addEventListener('click', () => {
        SoundSynth.playClick();
        this.adjustStat(key, this.stats[key] + 5);
      });
    });

    document.getElementById('btn-try-character').addEventListener('click', () => {
      SoundSynth.playClick();
      let name = document.getElementById('char-name').value.trim();
      if (!name) name = '체험용 캐릭터';
      
      const tempData = {
        id: this.currentId || 'temp_try',
        name: name,
        atk: this.stats.atk,
        rng: this.stats.rng,
        spd: this.stats.spd,
        asp: this.stats.asp,
        hp: this.stats.hp,
        rating: 1000
      };

      const dummyChar = {
        id: 'dummy',
        name: '목각인형 샌드백',
        atk: 5,
        rng: 5,
        spd: 5,
        asp: 5,
        hp: 9999,
        rating: 1000
      };

      Navigation.go('arena-screen');
      BattleArena.start(tempData, dummyChar, false, true); // isSandbox = true
    });

    document.getElementById('btn-save-character').addEventListener('click', () => {
      SoundSynth.playClick();
      this.saveCharacter();
    });

    document.getElementById('btn-creator-back').addEventListener('click', () => {
      SoundSynth.playClick();
      Navigation.go('characters-screen');
    });

    // Validation on name keyup
    document.getElementById('char-name').addEventListener('input', () => {
      this.validateForm();
    });
  },

  adjustStat(key, targetValue) {
    const list = CharDB.get();
    if (!this.currentId && list.length >= 6) {
      alert('캐릭터는 최대 6개까지 생성 가능합니다.');
      return;
    }

    const currentSum = this.getSumExcluding(key);
    const maxAllowed = this.maxPoints - currentSum;
    
    const minVal = key === 'spd' ? 0 : 5;
    let finalVal = Math.max(minVal, Math.min(targetValue, maxAllowed));
    this.stats[key] = finalVal;

    this.updateUI();
  },

  getSumExcluding(key) {
    let sum = 0;
    for (let k in this.stats) {
      if (k !== key) sum += this.stats[k];
    }
    return sum;
  },

  updateUI() {
    let totalDistributed = 0;
    for (let k in this.stats) {
      const val = this.stats[k];
      totalDistributed += val;

      // Update Slider Value Label
      document.getElementById(`val-${k}`).innerText = val;
      
      // Update Slider Element value
      document.getElementById(`slider-${k}`).value = val;
    }

    const remaining = this.maxPoints - totalDistributed;
    const poolDisplay = document.getElementById('stat-pool-display');
    poolDisplay.innerText = remaining;

    // Toggle color depending on pool
    if (remaining === 0) {
      poolDisplay.style.color = '#10b981'; // Green
    } else {
      poolDisplay.style.color = '#06b6d4'; // Cyan
    }

    // Render Previews
    RadarChart.draw(this.stats);
    document.getElementById('avatar-preview').innerHTML = generateAvatarSVG(this.stats, 180);

    this.validateForm();
  },

  validateForm() {
    const name = document.getElementById('char-name').value.trim();
    const sum = Object.values(this.stats).reduce((a, b) => a + b, 0);
    const saveBtn = document.getElementById('btn-save-character');

    const isValid = name.length > 0 && sum === 100;
    saveBtn.disabled = !isValid;

    if (sum === 100) {
      saveBtn.innerText = '저장하기';
    } else {
      saveBtn.innerText = `저장하기 (${100 - sum > 0 ? (100 - sum) + '포인트 더 필요' : (sum - 100) + '포인트 초과'})`;
    }
  },

  saveCharacter() {
    const name = document.getElementById('char-name').value.trim();
    if (!name) return;

    if (this.currentId) {
      // Editing Mode
      CharDB.update(this.currentId, {
        atk: this.stats.atk,
        rng: this.stats.rng,
        spd: this.stats.spd,
        asp: this.stats.asp,
        hp: this.stats.hp
      });
    } else {
      // Create Mode
      const list = CharDB.get();
      if (list.length >= 6) {
        alert('캐릭터는 최대 6개까지 생성 가능합니다.');
        return;
      }
      
      const newChar = {
        id: Date.now().toString(),
        name: name,
        atk: this.stats.atk,
        rng: this.stats.rng,
        spd: this.stats.spd,
        asp: this.stats.asp,
        hp: this.stats.hp,
        winCount: 0,
        lossCount: 0,
        rating: 1000
      };
      CharDB.add(newChar);
    }

    CharactersPage.renderGrid();
    Navigation.go('characters-screen');
  }
};

// --- Page: Battle Lobby ---
const LobbyPage = {
  selectedFighterId: null,

  init() {
    const list = CharDB.get();
    const fighterGrid = document.getElementById('lobby-fighter-list');
    const alertBox = document.getElementById('lobby-no-fighter');
    const startBtn = document.getElementById('btn-start-battle');
    
    fighterGrid.innerHTML = '';
    this.selectedFighterId = null;

    if (list.length === 0) {
      alertBox.style.display = 'flex';
      fighterGrid.style.display = 'none';
      startBtn.disabled = true;
    } else {
      alertBox.style.display = 'none';
      fighterGrid.style.display = 'grid';

      list.forEach((char, idx) => {
        const el = document.createElement('div');
        el.className = 'lobby-fighter-card';
        if (idx === 0) {
          el.classList.add('selected');
          this.selectedFighterId = char.id;
        }

        el.innerHTML = `
          <div class="lobby-char-avatar">
            ${generateAvatarSVG(char, 46)}
          </div>
          <div class="lobby-char-info">
            <span class="lobby-char-name">${escapeHTML(char.name)}</span>
            <span class="lobby-char-desc">Rating: ${char.rating || 1000}</span>
          </div>
        `;

        el.addEventListener('click', () => {
          SoundSynth.playClick();
          document.querySelectorAll('.lobby-fighter-card').forEach(c => c.classList.remove('selected'));
          el.classList.add('selected');
          this.selectedFighterId = char.id;
          this.validateLobby();
        });

        fighterGrid.appendChild(el);
      });
    }

    this.validateLobby();

    // Toggle AI Difficulty view
    const aiRadio = document.querySelector('input[name="battle-mode"][value="ai"]');
    const multiRadio = document.querySelector('input[name="battle-mode"][value="multiplayer"]');
    const diffContainer = document.getElementById('ai-difficulty-container');

    const toggleDiff = () => {
      if (aiRadio && aiRadio.checked) {
        diffContainer.style.display = 'flex';
      } else {
        diffContainer.style.display = 'none';
      }
    };

    if (aiRadio) aiRadio.addEventListener('change', toggleDiff);
    if (multiRadio) multiRadio.addEventListener('change', toggleDiff);
    toggleDiff(); // Initial state check

    if (!this.eventsBound) {
      document.getElementById('btn-start-battle').addEventListener('click', () => {
        SoundSynth.playClick();
        this.startMatchingFlow();
      });
      const gotoCreateBtn = document.getElementById('btn-lobby-goto-create');
      if (gotoCreateBtn) {
        gotoCreateBtn.addEventListener('click', () => {
          SoundSynth.playClick();
          CreatorPage.init(null);
        });
      }
      
      const cancelBtn = document.getElementById('btn-cancel-matching');
      if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
          SoundSynth.playClick();
          if (MultiplayerManager.isConnected) {
            MultiplayerManager.send({ type: 'leave_queue' });
            MultiplayerManager.disconnect();
          }
          Navigation.go('battle-lobby-screen');
        });
      }
      this.eventsBound = true;
    }
  },

  validateLobby() {
    const startBtn = document.getElementById('btn-start-battle');
    startBtn.disabled = !this.selectedFighterId;
  },

  startMatchingFlow() {
    const list = CharDB.get();
    const playerChar = list.find(c => c.id === this.selectedFighterId);
    if (!playerChar) return;

    const battleMode = document.querySelector('input[name="battle-mode"]:checked').value;
    
    // Set player card visual in matching screen
    document.getElementById('match-player-avatar').innerHTML = generateAvatarSVG(playerChar, 90);
    document.getElementById('match-player-name').innerText = playerChar.name;

    // Reset Opponent card
    const oppCard = document.querySelector('.vs-card.opponent-side');
    oppCard.classList.add('unknown');
    document.getElementById('match-opponent-avatar').innerHTML = '<div class="avatar-shimmer"></div>';
    document.getElementById('match-opponent-name').innerText = '상대 탐색 중...';

    const cancelBtn = document.getElementById('btn-cancel-matching');
    if (cancelBtn) cancelBtn.style.display = battleMode === 'multiplayer' ? 'inline-flex' : 'none';

    Navigation.go('matching-screen');

    if (battleMode === 'multiplayer') {
      MultiplayerManager.connect(playerChar, (opponentChar, side) => {
        oppCard.classList.remove('unknown');
        document.getElementById('match-opponent-avatar').innerHTML = generateAvatarSVG(opponentChar, 90);
        document.getElementById('match-opponent-name').innerText = opponentChar.name;
        SoundSynth.playVictory();

        let count = 3;
        const overlayText = document.getElementById('canvas-overlay-text');
        overlayText.style.display = 'block';
        overlayText.innerText = '3';

        const countdownInterval = setInterval(() => {
          count--;
          if (count > 0) {
            overlayText.innerText = count.toString();
          } else if (count === 0) {
            overlayText.innerText = 'FIGHT!';
            clearInterval(countdownInterval);
            setTimeout(() => { overlayText.style.display = 'none'; }, 800);
            
            Navigation.go('arena-screen');
            BattleArena.start(playerChar, opponentChar, false, false, true, side);
          }
        }, 700);
      }, () => {
        if (BattleArena.isRunning && BattleArena.isMultiplayer) {
          BattleArena.handleBattleEnd('상대방이 연결을 끊었습니다.');
        }
      }, (msg) => {
        if (BattleArena.isRunning && BattleArena.isMultiplayer) {
          BattleArena.handleNetworkMessage(msg);
        }
      });
      return;
    }

    // Start simulated matching logic
    let elapsed = 0;
    const timerEl = document.getElementById('matching-timer');
    timerEl.innerText = '00:00';

    const matchInterval = setInterval(() => {
      elapsed++;
      const min = String(Math.floor(elapsed / 60)).padStart(2, '0');
      const sec = String(elapsed % 60).padStart(2, '0');
      timerEl.innerText = `${min}:${sec}`;
    }, 1000);

    // Opponent generation
    let opponentChar = null;
    const matchDelay = 2000 + Math.random() * 2000; // 2 to 4 seconds delay

    setTimeout(() => {
      clearInterval(matchInterval);

      if (battleMode === 'ai') {
        // Generate AI matching difficulty
        const difficulty = document.querySelector('input[name="ai-diff"]:checked').value;
        opponentChar = this.generateAI(playerChar, difficulty);
        opponentChar.difficulty = difficulty;
      } else {
        // Generate Simulated player (Ranked Matchmaking)
        opponentChar = this.generateMatchOpponent(playerChar);
      }

      // Found animation
      oppCard.classList.remove('unknown');
      document.getElementById('match-opponent-avatar').innerHTML = generateAvatarSVG(opponentChar, 90);
      document.getElementById('match-opponent-name').innerText = opponentChar.name;
      SoundSynth.playVictory(); // Play nice alarm note

      // Match countdown before going into arena
      let count = 3;
      const overlayText = document.getElementById('canvas-overlay-text');
      overlayText.style.display = 'block';
      overlayText.innerText = '3';

      const countdownInterval = setInterval(() => {
        count--;
        if (count > 0) {
          overlayText.innerText = count.toString();
        } else if (count === 0) {
          overlayText.innerText = 'FIGHT!';
          clearInterval(countdownInterval);
          setTimeout(() => {
            overlayText.style.display = 'none';
          }, 800);
          
          // Go to arena screen
          Navigation.go('arena-screen');
          BattleArena.start(playerChar, opponentChar, battleMode === 'ai');
        }
      }, 700);

    }, matchDelay);
  },

  generateAI(playerChar, difficulty) {
    let statTotal = 100;
    let namePrefix = '훈련용 AI';

    if (difficulty === 'easy') {
      statTotal = 80;
      namePrefix = '이지 봇';
    } else if (difficulty === 'hard') {
      statTotal = 120;
      namePrefix = '프로 봇';
    }

    const aiStats = distributeRandomPoints(statTotal);
    return {
      id: 'ai_' + Date.now().toString(),
      name: `${namePrefix} (${aiStats.archetype})`,
      atk: aiStats.atk,
      rng: aiStats.rng,
      spd: aiStats.spd,
      asp: aiStats.asp,
      hp: aiStats.hp,
      rating: playerChar.rating ? Math.max(800, playerChar.rating - 150) : 900
    };
  },

  generateMatchOpponent(playerChar) {
    const oppNames = [
      '스탯최강자', '무빙마스터', '극딜러_K', '탱커장인', '연속타격기',
      '신속의저격수', '스피드스터', '방벽제작자', '스펙터', '레디언트'
    ];
    const name = oppNames[Math.floor(Math.random() * oppNames.length)] + '#' + Math.floor(1000 + Math.random() * 9000);
    
    // Opponent stat distribution (exactly 100 points)
    const stats = distributeRandomPoints(100);

    // Dynamic rating generation based on Player's ELO rating
    const ratingVariance = Math.floor(Math.random() * 100) - 50; // +- 50 ELO
    const oppRating = Math.max(800, (playerChar.rating || 1000) + ratingVariance);

    return {
      id: 'sim_' + Date.now().toString(),
      name: name,
      atk: stats.atk,
      rng: stats.rng,
      spd: stats.spd,
      asp: stats.asp,
      hp: stats.hp,
      rating: oppRating
    };
  }
};

// Helper: Distribute points randomly but into realistic archetypes (multiples of 5, minimum 5)
function distributeRandomPoints(total) {
  const remainingTotal = total - 25;
  const basePoints = Math.round(remainingTotal / 5);
  const archetypes = [
    { name: '공격형', weights: [5, 1, 2, 2, 2] }, // High ATK
    { name: '저격형', weights: [2, 5, 2, 1, 2] }, // High RNG
    { name: '속도형', weights: [2, 1, 5, 4, 1] }, // High SPD/ASP
    { name: '체력형', weights: [2, 1, 2, 1, 6] }, // High HP
    { name: '밸런스', weights: [2.5, 2.5, 2.5, 2.5, 2.5] }
  ];

  const arch = archetypes[Math.floor(Math.random() * archetypes.length)];
  const weightSum = arch.weights.reduce((a, b) => a + b, 0);
  
  let distributed = { atk: 0, rng: 0, spd: 0, asp: 0, hp: 0 };
  let keys = ['atk', 'rng', 'spd', 'asp', 'hp'];
  let sum = 0;

  // Initial distribution based on weights
  keys.forEach((k, idx) => {
    let pts = Math.floor((arch.weights[idx] / weightSum) * basePoints);
    distributed[k] = pts;
    sum += pts;
  });

  // Distribute remaining fractional points
  let diff = basePoints - sum;
  while (diff !== 0) {
    const k = keys[Math.floor(Math.random() * keys.length)];
    if (diff > 0) {
      distributed[k]++;
      diff--;
    } else {
      if (distributed[k] > 0) {
        distributed[k]--;
        diff++;
      }
    }
  }

  // Scale back up by 5 and add base 5 points
  for (let k in distributed) {
    distributed[k] = (distributed[k] * 5) + 5;
  }

  return {
    ...distributed,
    archetype: arch.name
  };
}

// --- Multiplayer WebSocket Manager ---
const MultiplayerManager = {
  ws: null,
  isConnected: false,
  roomId: null,
  side: null,
  tickInterval: null,

  connect(character, onMatchFound, onDisconnect, onMessage) {
    if (this.ws) this.disconnect();
    const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    
    // 🚀 Render.com 등 퍼블릭 클라우드에 배포된 대전 서버 도메인 주소를 적어줍니다.
    // (예: Render 앱 이름이 'stat-arena'라면 'stat-arena.onrender.com' 기재)
    const PUBLIC_SERVER_URL = 'stat-arena-server.onrender.com'; 

    let wsUrl = '';
    // 모바일 앱(capacitor) 혹은 로컬(localhost) 테스트 환경 구분
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const isMobileApp = window.location.hostname.includes('capacitor') || window.location.protocol.startsWith('capacitor');

    // 만약 도메인이 기본 설정값이 아니고 유효한 주소라면 퍼블릭 서버에 연결 시도
    if (PUBLIC_SERVER_URL && PUBLIC_SERVER_URL !== '' && PUBLIC_SERVER_URL !== 'localhost') {
      wsUrl = `wss://${PUBLIC_SERVER_URL}`;
    } else {
      // 로컬 개발 Fallback (기존 로컬 포트 8081 연결)
      const wsHost = window.location.hostname || 'localhost';
      wsUrl = `${wsProtocol}//${wsHost === 'localhost' || isMobileApp ? 'localhost' : wsHost}:8081`;
    }
    
    console.log(`📡 멀티플레이어 서버 연결 시도: ${wsUrl}`);
    this.ws = new WebSocket(wsUrl);
    
    this.ws.onopen = () => {
      this.isConnected = true;
      console.log('웹소켓 연결 성공. 대기열 참가.');
      this.send({ type: 'join_queue', character: character });
    };

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'match_found') {
          this.roomId = data.roomId;
          this.side = data.side;
          onMatchFound(data.opponent, data.side);
        } else {
          onMessage(data);
        }
      } catch (e) {
        console.error('메시지 파싱 에러', e);
      }
    };

    this.ws.onclose = () => {
      this.isConnected = false;
      this.roomId = null;
      console.log('웹소켓 연결 종료.');
      onDisconnect();
    };
  },

  send(data) {
    if (this.ws && this.ws.readyState === 1) {
      this.ws.send(JSON.stringify(data));
    }
  },

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.isConnected = false;
    this.roomId = null;
    this.stopTick();
  },

  startTick(player) {
    this.stopTick();
    this.tickInterval = setInterval(() => {
      if (!this.isConnected || !this.roomId) return;
      this.send({
        type: 'game_state',
        x: player.x,
        y: player.y,
        vy: player.vy,
        facingRight: player.facingRight,
        hp: player.hp,
        isStunned: player.isStunned
      });
    }, 1000 / 30);
  },

  stopTick() {
    if (this.tickInterval) {
      clearInterval(this.tickInterval);
      this.tickInterval = null;
    }
  }
};

// --- Canvas Battle Arena Engine ---
const BattleArena = {
  canvas: null,
  ctx: null,
  player: null,
  opponent: null,
  isAIOnly: false,
  isRunning: false,
  isPaused: false,
  speedMultiplier: 1,
  
  // Game state entities
  entities: [],
  projectiles: [],
  particles: [],
  floats: [],

  // Arena Physics Setup
  groundY: 340,
  arenaWidth: 1000,
  arenaHeight: 420,
  
  // Game Loop Handles
  animationFrameId: null,
  battleStartTime: 0,
  battleLogs: [],
  
  // Controls
  keys: {},

  init() {
    this.canvas = document.getElementById('battle-canvas');
    this.ctx = this.canvas.getContext('2d');

    // Controls setup
    window.addEventListener('keydown', (e) => {
      this.keys[e.code] = true;
    });
    window.addEventListener('keyup', (e) => {
      this.keys[e.code] = false;
    });

    // Mobile Virtual Touch Controls Bindings
    const bindTouchBtn = (id, keyCode) => {
      const btn = document.getElementById(id);
      if (!btn) return;

      const press = (e) => {
        this.keys[keyCode] = true;
        if (e.cancelable) e.preventDefault();
      };

      const release = (e) => {
        this.keys[keyCode] = false;
        if (e.cancelable) e.preventDefault();
      };

      // Touch events (Mobile)
      btn.addEventListener('touchstart', press, { passive: false });
      btn.addEventListener('touchend', release, { passive: false });
      btn.addEventListener('touchcancel', release, { passive: false });

      // Mouse events (Simulators)
      btn.addEventListener('mousedown', press);
      btn.addEventListener('mouseup', release);
      btn.addEventListener('mouseleave', release);
    };

    // Bind Attack Button
    bindTouchBtn('btn-touch-attack', 'Space');

    // Virtual Joystick Binding
    const joystick = document.getElementById('joystick-container');
    const knob = document.getElementById('joystick-knob');
    if (joystick && knob) {
      let isDragging = false;

      const updateJoystick = (clientX, clientY) => {
        const rect = joystick.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        let deltaX = clientX - centerX;
        let deltaY = clientY - centerY;

        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        
        // Calculate dynamic maximum distance based on current container size
        const currentMaxDist = rect.width / 2 - knob.offsetWidth / 2 + 5;

        if (distance > currentMaxDist) {
          const angle = Math.atan2(deltaY, deltaX);
          deltaX = Math.cos(angle) * currentMaxDist;
          deltaY = Math.sin(angle) * currentMaxDist;
        }

        // Apply style transform instantly
        knob.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
        knob.style.transition = 'none';

        // Map movement vectors to Key inputs
        const thresholdX = currentMaxDist * 0.3; // 30% drag triggers left/right
        const thresholdY = currentMaxDist * 0.4; // 40% drag triggers jump

        if (deltaX < -thresholdX) {
          this.keys['KeyA'] = true;
          this.keys['KeyD'] = false;
        } else if (deltaX > thresholdX) {
          this.keys['KeyD'] = true;
          this.keys['KeyA'] = false;
        } else {
          this.keys['KeyA'] = false;
          this.keys['KeyD'] = false;
        }

        if (deltaY < -thresholdY) {
          this.keys['KeyW'] = true;
        } else {
          this.keys['KeyW'] = false;
        }
      };

      const resetJoystick = () => {
        isDragging = false;
        knob.style.transform = 'translate(0px, 0px)';
        knob.style.transition = 'transform 0.15s cubic-bezier(0.25, 1, 0.5, 1)';
        this.keys['KeyA'] = false;
        this.keys['KeyD'] = false;
        this.keys['KeyW'] = false;
      };

      joystick.addEventListener('touchstart', (e) => {
        isDragging = true;
        const touch = e.touches[0];
        updateJoystick(touch.clientX, touch.clientY);
        if (e.cancelable) e.preventDefault();
      }, { passive: false });

      joystick.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        const touch = e.touches[0];
        updateJoystick(touch.clientX, touch.clientY);
        if (e.cancelable) e.preventDefault();
      }, { passive: false });

      joystick.addEventListener('touchend', (e) => {
        resetJoystick();
        if (e.cancelable) e.preventDefault();
      }, { passive: false });

      joystick.addEventListener('touchcancel', (e) => {
        resetJoystick();
        if (e.cancelable) e.preventDefault();
      }, { passive: false });

      // Simulator Mouse Drag Support
      joystick.addEventListener('mousedown', (e) => {
        isDragging = true;
        updateJoystick(e.clientX, e.clientY);

        const onMouseMove = (moveEvent) => {
          if (!isDragging) return;
          updateJoystick(moveEvent.clientX, moveEvent.clientY);
        };

        const onMouseUp = () => {
          resetJoystick();
          window.removeEventListener('mousemove', onMouseMove);
          window.removeEventListener('mouseup', onMouseUp);
        };

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
      });
    }

    // Speed buttons
    document.querySelectorAll('.speed-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        SoundSynth.playClick();
        document.querySelectorAll('.speed-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.speedMultiplier = parseInt(btn.getAttribute('data-speed'));
      });
    });

    // Pause/Forfeit buttons
    document.getElementById('btn-pause-battle').addEventListener('click', () => {
      SoundSynth.playClick();
      this.togglePause();
    });

    document.getElementById('btn-forfeit-battle').addEventListener('click', () => {
      SoundSynth.playClick();
      this.forfeit();
    });

    // Manual control toggle (Removed, always manual control)

    // Log panel collapse toggle
    const toggleLogsBtn = document.getElementById('btn-toggle-logs');
    if (toggleLogsBtn) {
      toggleLogsBtn.addEventListener('click', () => {
        SoundSynth.playClick();
        document.querySelector('.logs-panel-wrapper').classList.toggle('collapsed');
      });
    }

    // Result dialog buttons
    document.getElementById('btn-result-rematch').addEventListener('click', () => {
      SoundSynth.playClick();
      document.getElementById('battle-result-dialog').close();
      LobbyPage.startMatchingFlow();
    });

    document.getElementById('btn-result-lobby').addEventListener('click', () => {
      SoundSynth.playClick();
      document.getElementById('battle-result-dialog').close();
      Navigation.go('battle-lobby-screen');
    });
    
    // Result dialog light-dismiss Safari Fallback
    const resultDialog = document.getElementById('battle-result-dialog');
    if (!('closedBy' in HTMLDialogElement.prototype)) {
      resultDialog.addEventListener('click', (event) => {
        if (event.target !== resultDialog) return;
        const rect = resultDialog.getBoundingClientRect();
        const isDialogContent = (
          rect.top <= event.clientY &&
          event.clientY <= rect.top + rect.height &&
          rect.left <= event.clientX &&
          event.clientX <= rect.left + rect.width
        );
        if (isDialogContent) return;
        resultDialog.close();
      });
    }
  },

  start(playerData, opponentData, isAI, isSandbox = false, isMultiplayer = false, mySide = 'left') {
    if (!this.canvas) this.init();

    this.isAIOnly = isAI;
    this.isSandbox = isSandbox;
    this.isMultiplayer = isMultiplayer;
    this.opponentDifficulty = opponentData.difficulty || 'normal';
    this.isRunning = true;
    this.isPaused = false;
    this.battleStartTime = Date.now();
    this.battleLogs = [];
    const logBox = document.getElementById('combat-logs');
    if (logBox) logBox.innerHTML = '';
    
    // Speed defaults to 1x
    this.speedMultiplier = 1;
    document.querySelectorAll('.speed-btn').forEach(b => {
      b.classList.remove('active');
      if (b.getAttribute('data-speed') === '1') b.classList.add('active');
    });

    // Set UI Header values
    const pName = document.getElementById('arena-player-name');
    if (pName) pName.innerText = playerData.name;
    const pRng = document.getElementById('arena-player-rng');
    if (pRng) pRng.innerText = `RNG ${playerData.rng}`;
    
    const oName = document.getElementById('arena-opponent-name');
    if (oName) oName.innerText = opponentData.name;
    const oRng = document.getElementById('arena-opponent-rng');
    if (oRng) oRng.innerText = `RNG ${opponentData.rng}`;
    
    const oLabel = document.getElementById('arena-opponent-label');
    if (oLabel) {
      oLabel.innerText = this.isSandbox ? 'DUMMY' : (isAI ? 'AI BOT' : 'PLAYER');
    }

    // Dynamic Forfeit button styling based on Sandbox
    const forfeitBtn = document.getElementById('btn-forfeit-battle');
    if (forfeitBtn) {
      if (this.isSandbox) {
        forfeitBtn.innerText = '✕';
        forfeitBtn.title = '체험 종료';
        forfeitBtn.className = 'floating-btn';
      } else {
        forfeitBtn.innerText = '🏳️';
        forfeitBtn.title = '항복하기';
        forfeitBtn.className = 'floating-btn danger';
      }
    }

    // Setup fighters formulas
    let pX = 125;
    let oX = this.isSandbox ? 775 : 875;
    if (this.isMultiplayer && mySide === 'right') {
      pX = 875;
      oX = 125;
    }
    
    this.player = this.createFighter(playerData, pX, true);
    this.opponent = this.createFighter(opponentData, oX, false);
    
    if (this.isMultiplayer) {
      MultiplayerManager.startTick(this.player);
    }
    
    this.entities = [this.player, this.opponent];
    this.projectiles = [];
    this.particles = [];
    this.floats = [];

    // Screen Shake controller
    this.shakeIntensity = 0;

    let startMsg = '⚔️ 전설적인 아레나 결투가 곧 시작됩니다!';
    if (this.isSandbox) {
      startMsg = '🔧 샌드박스 스탯 체험이 시작되었습니다!';
    } else if (this.isMultiplayer) {
      startMsg = `🌐 실시간 온라인 대전이 시작되었습니다! (진영: ${mySide === 'left' ? '왼쪽' : '오른쪽'})`;
    }
    this.log(startMsg, 'system');

    // Run game loop
    if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
    this.lastTime = performance.now();
    this.loop();
  },

  createFighter(data, startX, isPlayerSide) {
    // Exact scaling formulas (1:1 stats to game values, block-based physics)
    let maxHP = data.hp;
    if (data.hp >= 25) {
      maxHP = data.hp + 1 + Math.floor((data.hp - 25) / 5) * 2;
    }
    const atkDamage = data.id === 'dummy' ? 0 : data.atk;
    const atkRange = data.rng * (1000 / 85); // 85 range = 1000px (field end-to-end)
    const moveSpeed = data.id === 'dummy' ? 0 : data.spd / 12; // 10 speed = 1 block/sec = 50px/sec (50/60px per frame at 10spd)
    const attackCooldownMax = data.id === 'dummy' ? 999999 : 600 / data.asp; // 10 speed = 1 attack/sec (cooldown 60 frames)

    return {
      id: data.id,
      name: data.name,
      stats: { ...data },
      isPlayer: isPlayerSide,
      
      // Dynamic state variables
      x: startX,
      y: this.groundY,
      vy: 0, // Vertical velocity for jump mechanics
      width: 40,
      height: 60,
      facingRight: isPlayerSide,
      
      hp: maxHP,
      maxHP: maxHP,
      atkDamage: atkDamage,
      atkRange: atkRange,
      moveSpeed: moveSpeed,
      attackCooldownMax: attackCooldownMax,
      attackCooldown: 0,

      // Animation parameters
      flashTime: 0,
      visualOffset: 0,
      hopOffset: 0,
      weaponAngle: 0,
      attackSwingTimer: 0,
      
      isStunned: false,
      stunDuration: 0,
      
      // Combat statistics tracking
      damageDealt: 0,
      damageTaken: 0,
      hitsLanded: 0,
      shotsFired: 0
    };
  },

  loop(timestamp = performance.now()) {
    if (!this.isRunning) return;

    let dt = (timestamp - this.lastTime) / 16.666; // Normalized to 60fps unit (16.66ms = 1)
    if (dt > 4) dt = 4; // Cap dt spike on frame lag
    this.lastTime = timestamp;

    if (!this.isPaused) {
      // Loop execution multiple times for 배속 (Speed multiplier)
      const loops = this.speedMultiplier;
      for (let i = 0; i < loops; i++) {
        this.update(dt);
      }
    }

    this.render();
    this.animationFrameId = requestAnimationFrame((t) => this.loop(t));
  },

  update(dt) {
    // Sandbox auto-heal check for Dummy
    if (this.isSandbox && this.opponent.hp < 1000) {
      const healAmt = 9999 - this.opponent.hp;
      this.opponent.hp = 9999;
      this.spawnFloat(this.opponent.x, this.opponent.y - 65, `+${healAmt} (부활)`, '#10b981', 40, 'bold 18px Outfit');
      this.updateHPUI();
      this.log('목각인형 샌드백의 체력이 가득 채워졌습니다!', 'system');
      SoundSynth.playVictory();
    }

    if (this.player.hp <= 0 || this.opponent.hp <= 0) {
      this.handleBattleEnd();
      return;
    }

    // Update screen shake
    if (this.shakeIntensity > 0) {
      this.shakeIntensity -= 0.1 * dt;
    }

    // 1. Entities Behavior
    this.entities.forEach(ent => {
      // Manage Stun
      if (ent.isStunned) {
        ent.stunDuration -= dt;
        if (ent.stunDuration <= 0) {
          ent.isStunned = false;
        }
        return; // Stunned character cannot move or attack
      }

      // Attack cooldown countdown
      if (ent.attackCooldown > 0) {
        ent.attackCooldown -= dt;
      }

      // Attack animations reset
      if (ent.attackSwingTimer > 0) {
        ent.attackSwingTimer -= dt;
        if (ent.attackSwingTimer <= 0) {
          ent.weaponAngle = 0;
        }
      }

      // Get target (which is the opponent)
      const target = ent.isPlayer ? this.opponent : this.player;
      const dist = Math.abs(ent.x - target.x);

      // Apply Gravity and Vertical Velocity updates
      if (ent.y < this.groundY || ent.vy !== 0) {
        ent.vy += 0.6 * dt; // Gravity acceleration
        ent.y += ent.vy * dt;
        if (ent.y >= this.groundY) {
          ent.y = this.groundY;
          ent.vy = 0;
        }
      }
      
      const manualMode = ent.isPlayer; // Player is always controlled manually

      if (manualMode) {
        // Manual Control mode for Player
        let moveDir = 0;
        if (this.keys['KeyA'] || this.keys['ArrowLeft']) {
          moveDir = -1;
          ent.facingRight = false;
        } else if (this.keys['KeyD'] || this.keys['ArrowRight']) {
          moveDir = 1;
          ent.facingRight = true;
        }

        // Apply Speed
        ent.x += moveDir * ent.moveSpeed * dt;
        // Keep in arena boundary (buffer 25px)
        ent.x = Math.max(25, Math.min(ent.x, this.arenaWidth - 25));

        // Hop animation while moving (only on ground)
        if (moveDir !== 0 && ent.y === this.groundY) {
          ent.hopOffset = Math.abs(Math.sin(performance.now() * 0.015)) * 6;
          // Spawn dust particles
          if (Math.random() < 0.1) {
            this.spawnParticle(ent.x, ent.y, (Math.random() - 0.5) * 2, -Math.random() * 2, 4, 0.8, '#4b5563');
          }
        } else {
          ent.hopOffset = 0;
        }

        // Keyboard Jump triggers (W or Up Arrow)
        if ((this.keys['KeyW'] || this.keys['ArrowUp']) && ent.y === this.groundY && ent.vy === 0) {
          ent.vy = -12; // Upward impulse
          SoundSynth.playJump();
        }

        // Manual Attack
        if (this.keys['Space'] && ent.attackCooldown <= 0) {
          this.executeAttack(ent, target);
        }

      } else {
        if (this.isMultiplayer) return; // Opponent is controlled by network
        
        // AI Auto Combat Behavior for Opponent (Dummies don't do anything)
        if (ent.id !== 'dummy') {
          // AI Auto-Dodge Projectile Jump
          if (ent.y === this.groundY && ent.vy === 0) {
            const incomingProj = this.projectiles.find(p => p.isPlayer && Math.abs(p.x - ent.x) < 180 && p.vx * (ent.x - p.x) > 0);
            if (incomingProj) {
              let jumpChance = 0.03;
              if (this.opponentDifficulty === 'easy') jumpChance = 0.01;
              if (this.opponentDifficulty === 'hard') jumpChance = 0.08;

              if (Math.random() < jumpChance * dt) {
                ent.vy = -12; // AI jumps!
                SoundSynth.playJump();
              }
            }
          }

          if (dist > ent.atkRange) {
            // Move toward player
            const dir = target.x > ent.x ? 1 : -1;
            ent.x += dir * ent.moveSpeed * dt;
            ent.facingRight = dir > 0;

            // Running animation (Hop offset) only on ground
            if (ent.y === this.groundY) {
              ent.hopOffset = Math.abs(Math.sin(performance.now() * 0.015)) * 6;
            } else {
              ent.hopOffset = 0;
            }

            // Spawn dust particles
            if (Math.random() < 0.15) {
              this.spawnParticle(ent.x, ent.y, -dir * 1.5, -Math.random() * 2, 4, 0.8, '#4b5563');
            }
          } else {
            // Within Range -> Attack!
            ent.hopOffset = 0;
            if (ent.attackCooldown <= 0) {
              this.executeAttack(ent, target);
            }
          }
        }
      }
    });

    // 2. Projectiles Update (Backwards loop to prevent splicing index shift issues)
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const proj = this.projectiles[i];
      proj.x += proj.vx * dt;
      proj.y += proj.vy * dt;

      // Spark trail
      if (Math.random() < 0.4) {
        this.spawnParticle(proj.x, proj.y, (Math.random() - 0.5) * 1, (Math.random() - 0.5) * 1, 3, 0.6, proj.color);
      }

      // Check collision with target
      const target = proj.isPlayer ? this.opponent : this.player;
      const bounds = {
        left: target.x - target.width/2,
        right: target.x + target.width/2,
        top: target.y - target.height,
        bottom: target.y
      };

      if (proj.x >= bounds.left && proj.x <= bounds.right && proj.y >= bounds.top && proj.y <= bounds.bottom) {
        // Hit opponent!
        this.applyDamage(target, proj.damage, proj.isCritical);
        this.projectiles.splice(i, 1);
        
        // Spawn splash particles
        for (let p = 0; p < 8; p++) {
          this.spawnParticle(proj.x, proj.y, (Math.random() - 0.5) * 6, (Math.random() - 0.5) * 6, 5, 0.9, proj.color);
        }
        continue;
      }

      // Check max travel range (from attacker center at time of firing)
      const distTravelled = Math.abs(proj.x - proj.startX);
      if (distTravelled >= proj.range) {
        this.projectiles.splice(i, 1);
        // Spawn small fizzle particles
        for (let p = 0; p < 4; p++) {
          this.spawnParticle(proj.x, proj.y, (Math.random() - 0.5) * 2, (Math.random() - 0.5) * 2, 2, 0.6, proj.color);
        }
        continue;
      }

      // Check out of bounds
      if (proj.x < 0 || proj.x > this.arenaWidth) {
        this.projectiles.splice(i, 1);
      }
    }

    // 3. Particles Update (Backwards loop)
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const part = this.particles[i];
      part.x += part.vx * dt;
      part.y += part.vy * dt;
      part.alpha -= part.decay * dt;
      if (part.alpha <= 0) {
        this.particles.splice(i, 1);
      }
    }

    // 4. Floating texts (Backwards loop)
    for (let i = this.floats.length - 1; i >= 0; i--) {
      const fl = this.floats[i];
      fl.y -= 1.2 * dt;
      fl.life -= dt;
      if (fl.life <= 0) {
        this.floats.splice(i, 1);
      }
    }
  },

  executeAttack(attacker, target) {
    attacker.attackCooldown = attacker.attackCooldownMax;
    attacker.attackSwingTimer = 12; // Swing frame length

    const isCritical = Math.random() < 0.15 + ((attacker.stats?.asp || 5) * 0.001); // Crit rate scales with ASP slightly

    // Visual weapon angle trigger
    attacker.weaponAngle = attacker.facingRight ? Math.PI / 3 : -Math.PI / 3;

    const rangeStat = attacker.stats ? (attacker.stats.rng || 5) : 5;

    if (rangeStat > 5) {
      // Ranged Attack (Spawn Projectile)
      attacker.shotsFired++;
      SoundSynth.playShoot();
      
      const projSpeed = 10;
      const vx = attacker.facingRight ? projSpeed : -projSpeed;
      const projColor = attacker.isPlayer ? '#06b6d4' : '#ec4899'; // Cyan for player, Pink for Opponent

      const newProj = {
        x: attacker.x + (attacker.facingRight ? 25 : -25),
        y: attacker.y - 35,
        startX: attacker.x, // Store the attacker center for exact range measurement
        range: attacker.atkRange,
        vx: vx,
        vy: 0,
        color: projColor,
        isPlayer: attacker.isPlayer,
        damage: attacker.atkDamage,
        isCritical: isCritical
      };

      this.projectiles.push(newProj);

      this.log(`${attacker.name}이(가) ${isCritical ? '🔥강화 마법탄' : '🌀마법탄'}을 발사했습니다.`, attacker.isPlayer ? 'player' : 'opponent');

      if (this.isMultiplayer && attacker.isPlayer) {
        MultiplayerManager.send({
          type: 'projectile_spawn',
          x: newProj.x,
          y: newProj.y,
          startX: newProj.startX,
          range: newProj.range,
          vx: newProj.vx,
          vy: newProj.vy,
          color: newProj.color,
          damage: newProj.damage,
          isCritical: newProj.isCritical
        });
        MultiplayerManager.send({ type: 'action', action: 'attack' });
      }
    } else {
      // Melee Attack (Instant range check)
      attacker.hitsLanded++;
      if (this.isMultiplayer && attacker.isPlayer) {
        MultiplayerManager.send({ type: 'action', action: 'attack' });
      }
      const dist = Math.abs(attacker.x - target.x);
      
      const isTargetDodgingMelee = Math.abs(attacker.y - target.y) > 40;
      const isHit = dist <= attacker.atkRange && !isTargetDodgingMelee;

      // Slash VFX Particle trigger at target's position if hit, or at max range if whiff
      const slashX = isHit ? target.x : attacker.x + (attacker.facingRight ? attacker.atkRange : -attacker.atkRange);
      const slashY = attacker.y - 30;

      for (let p = 0; p < 12; p++) {
        this.spawnParticle(slashX, slashY, (Math.random() - 0.5) * 5, (Math.random() - 0.5) * 5, 4, 0.9, '#f43f5e');
      }

      if (isHit) {
        // Hit!
        this.applyDamage(target, attacker.atkDamage, isCritical);
      } else {
        // Whiff
        this.spawnFloat(slashX, slashY - 20, isTargetDodgingMelee && dist <= attacker.atkRange ? 'DODGED' : 'MISS', '#6b7280', 12);
        this.log(`${attacker.name}이(가) 헛스윙을 시전했습니다!${isTargetDodgingMelee && dist <= attacker.atkRange ? ' (공중 회피)' : ''}`, attacker.isPlayer ? 'player' : 'opponent');
      }
    }
  },

  applyDamage(target, baseDamage, isCritical) {
    const attacker = target.isPlayer ? this.opponent : this.player;

    // Check if the attack came from behind (target is facing away from attacker)
    const isBehind = (target.x > attacker.x && target.facingRight) || (target.x < attacker.x && !target.facingRight);
    
    let finalIsCritical = isCritical;
    if (isBehind) {
      finalIsCritical = true;
    }

    let finalDamage = baseDamage;
    if (finalIsCritical) finalDamage = Math.round(finalDamage * 1.4);
    
    // Apply Damage Reduction based on target's HP stat
    const targetHPStat = target.stats ? (target.stats.hp || 5) : 5;
    let reduction = 0;
    if (targetHPStat >= 25) {
      reduction = 1 + Math.floor((targetHPStat - 25) / 5) * 2;
    }
    finalDamage = Math.max(1, finalDamage - reduction);

    // Subtract HP
    target.hp = Math.max(0, target.hp - finalDamage);
    target.flashTime = 8; // Flash red for 8 frames
    
    // Impact Sound
    SoundSynth.playHit(finalIsCritical);

    // Record battle stats
    attacker.damageDealt += finalDamage;
    target.damageTaken += finalDamage;

    // Apply Knockback & Screen shake (Knockback only on critical hits)
    if (finalIsCritical) {
      this.shakeIntensity = Math.min(this.shakeIntensity + 5, 12);
      
      const kbDir = attacker.x < target.x ? 1 : -1;
      const kbForce = 15; // knockback distance
      
      // Apply knockback to target
      target.x = Math.max(target.width/2, Math.min(this.arenaWidth - target.width/2, target.x + kbDir * kbForce));
      
      // Attacker recoil
      attacker.x = Math.max(attacker.width/2, Math.min(this.arenaWidth - attacker.width/2, attacker.x - kbDir * 4));

      // Apply Stun so they cannot move or turn around immediately
      if (target.id !== 'dummy') {
        target.isStunned = true;
        target.stunDuration = 15; // 15 frames stun
      }
    }

    // Spawn damage floating text
    const textStyle = finalIsCritical ? 'bold 22px Outfit' : 'bold 16px Outfit';
    const textColor = finalIsCritical ? '#f59e0b' : (target.isPlayer ? '#ef4444' : '#22d3ee');
    const msg = finalIsCritical ? (isBehind ? `💥 배후 ${finalDamage}!` : `💥 ${finalDamage}!`) : `${finalDamage}`;
    this.spawnFloat(target.x + (Math.random() - 0.5) * 15, target.y - 65, msg, textColor, finalIsCritical ? 24 : 14, textStyle);

    // Update HP UI Bars
    this.updateHPUI();

    this.log(`${attacker.name}이(가) ${target.name}에게 ${finalDamage}의 피해를 입혔습니다! ${finalIsCritical ? (isBehind ? '(배후 치명타!)' : '(치명타!)') : ''}`, attacker.isPlayer ? 'player' : 'opponent');
  },

  updateHPUI() {
    const pPercent = Math.max(0, (this.player.hp / this.player.maxHP) * 100);
    const oPercent = Math.max(0, (this.opponent.hp / this.opponent.maxHP) * 100);

    document.getElementById('arena-player-hp-fill').style.width = `${pPercent}%`;
    document.getElementById('arena-player-hp-text').innerText = `${this.player.hp} / ${this.player.maxHP}`;

    document.getElementById('arena-opponent-hp-fill').style.width = `${oPercent}%`;
    document.getElementById('arena-opponent-hp-text').innerText = `${this.opponent.hp} / ${this.opponent.maxHP}`;
  },

  spawnParticle(x, y, vx, vy, size, alpha, color) {
    this.particles.push({
      x, y, vx, vy, size, alpha, color,
      decay: 0.02 + Math.random() * 0.03
    });
  },

  spawnFloat(x, y, text, color, life = 30, font = 'bold 14px Outfit') {
    this.floats.push({ x, y, text, color, life, font });
  },

  render() {
    const ctx = this.ctx;
    ctx.save();
    
    // Apply Screen Shake
    if (this.shakeIntensity > 0.1) {
      const sx = (Math.random() - 0.5) * this.shakeIntensity;
      const sy = (Math.random() - 0.5) * this.shakeIntensity;
      ctx.translate(sx, sy);
    }

    // Clear Canvas
    ctx.fillStyle = '#0a0612';
    ctx.fillRect(0, 0, this.arenaWidth, this.arenaHeight);

    // Draw grid mesh lines in Canvas (Perspective arena)
    ctx.strokeStyle = 'rgba(139, 92, 246, 0.03)';
    ctx.lineWidth = 1;
    for (let x = 0; x < this.arenaWidth; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, this.groundY);
      ctx.stroke();
    }
    
    // Draw 20 Floor Blocks (50px each)
    const blockWidth = 50;
    const numBlocks = 20;
    for (let b = 0; b < numBlocks; b++) {
      const bx = b * blockWidth;
      
      // Alternate block fill colors
      ctx.fillStyle = (b % 2 === 0) ? '#120b24' : '#180f30';
      ctx.fillRect(bx, this.groundY, blockWidth, this.arenaHeight - this.groundY);
      
      // Draw block divider lines
      ctx.strokeStyle = 'rgba(139, 92, 246, 0.12)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(bx, this.groundY);
      ctx.lineTo(bx, this.arenaHeight);
      ctx.stroke();

      // Draw Block Index Numbers
      ctx.fillStyle = 'rgba(139, 92, 246, 0.35)';
      ctx.font = 'bold 10px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(b.toString(), bx + blockWidth / 2, this.arenaHeight - 15);
    }
    // End line for the last block
    ctx.strokeStyle = 'rgba(139, 92, 246, 0.12)';
    ctx.beginPath();
    ctx.moveTo(this.arenaWidth, this.groundY);
    ctx.lineTo(this.arenaWidth, this.arenaHeight);
    ctx.stroke();

    // Draw Player Range Overlay on the ground (Cyan glow)
    if (this.player && this.player.hp > 0) {
      const rangeWidth = this.player.atkRange;
      const startX = this.player.facingRight ? this.player.x : this.player.x - rangeWidth;
      
      ctx.fillStyle = 'rgba(6, 182, 212, 0.12)'; // Translucent cyan
      ctx.fillRect(startX, this.groundY, rangeWidth, 20);
      
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.4)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(startX, this.groundY);
      ctx.lineTo(startX + rangeWidth, this.groundY);
      ctx.stroke();
    }

    // Draw Opponent Range Overlay on the ground (Red/Danger glow)
    if (this.opponent && this.opponent.hp > 0) {
      const rangeWidth = this.opponent.atkRange;
      const startX = this.opponent.facingRight ? this.opponent.x : this.opponent.x - rangeWidth;
      
      ctx.fillStyle = 'rgba(239, 68, 68, 0.1)'; // Translucent red
      ctx.fillRect(startX, this.groundY, rangeWidth, 20);
      
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.35)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(startX, this.groundY);
      ctx.lineTo(startX + rangeWidth, this.groundY);
      ctx.stroke();
    }

    // Draw Ground Border Line
    ctx.fillStyle = '#110c22';
    ctx.strokeStyle = 'rgba(139, 92, 246, 0.2)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, this.groundY);
    ctx.lineTo(this.arenaWidth, this.groundY);
    ctx.stroke();

    // Draw Particles
    this.particles.forEach(p => {
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;

    // Draw Projectiles
    this.projectiles.forEach(proj => {
      ctx.fillStyle = proj.color;
      ctx.beginPath();
      ctx.arc(proj.x, proj.y, 6, 0, Math.PI * 2);
      ctx.fill();

      // Glowing outline
      ctx.shadowBlur = 12;
      ctx.shadowColor = proj.color;
      ctx.beginPath();
      ctx.arc(proj.x, proj.y, 10, 0, Math.PI * 2);
      ctx.strokeStyle = proj.color;
      ctx.stroke();
      ctx.shadowBlur = 0; // Reset
    });

    // Draw Fighters
    this.entities.forEach(ent => {
      // Draw shadow on the ground (always at groundY)
      ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
      ctx.beginPath();
      // Scale shadow based on jump height
      const shadowScale = Math.max(0.3, 1 - (this.groundY - ent.y) / 200);
      ctx.ellipse(ent.x, this.groundY, 24 * shadowScale, 6 * shadowScale, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.save();
      ctx.translate(ent.x, ent.y - ent.hopOffset);

      // Flash red logic on hit
      if (ent.flashTime > 0) {
        ent.flashTime--;
        ctx.filter = 'brightness(1.5) sepia(1) saturate(10000%) hue-rotate(320deg)'; // Dynamic red flash filter
      }

      if (ent.id === 'dummy') {
        // Draw Wooden Target dummy representation
        ctx.fillStyle = '#78350f'; // dark wood
        ctx.fillRect(-5, -12, 10, 12); // vertical post

        // Target Board Circle
        ctx.fillStyle = '#b45309'; // lighter wood board
        ctx.strokeStyle = '#d97706';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(0, -32, 20, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Target rings
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(0, -32, 13, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = '#ef4444'; // red bullseye
        ctx.beginPath();
        ctx.arc(0, -32, 7, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        return;
      }

      // Draw Character Body base
      const primary = ent.isPlayer ? '#8b5cf6' : '#ec4899';
      const secondary = ent.isPlayer ? '#06b6d4' : '#f59e0b';
      
      // Base Shield Body
      ctx.fillStyle = primary;
      ctx.beginPath();
      ctx.arc(0, -30, 20, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Eyes (Glowing)
      ctx.fillStyle = ent.isPlayer ? '#22d3ee' : '#f43f5e';
      const eyeOffset = ent.facingRight ? 6 : -6;
      ctx.beginPath();
      ctx.arc(eyeOffset - 3, -32, 3, 0, Math.PI * 2);
      ctx.arc(eyeOffset + 3, -32, 3, 0, Math.PI * 2);
      ctx.fill();

      // Draw Armor details based on HP
      if (ent.stats.hp > 35) {
        // Bulky Shoulder Armor
        ctx.fillStyle = '#4b5563';
        ctx.fillRect(-22, -35, 8, 12);
        ctx.fillRect(14, -35, 8, 12);
        
        // Face visor
        ctx.fillStyle = '#1f2937';
        ctx.fillRect(-10, -26, 20, 5);
      } else {
        // Light hood/scarf
        ctx.fillStyle = secondary;
        ctx.fillRect(-15, -20, 30, 6);
      }

      // Weapon Rotation and Swing
      ctx.save();
      ctx.translate(ent.facingRight ? 18 : -18, -25);
      ctx.rotate(ent.weaponAngle);

      if (ent.stats.rng > 35) {
        // Wand / Staff
        ctx.strokeStyle = '#78350f';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(0, 15);
        ctx.lineTo(0, -15);
        ctx.stroke();
        // Wand glowing tip
        ctx.fillStyle = ent.isPlayer ? '#22d3ee' : '#ec4899';
        ctx.beginPath();
        ctx.arc(0, -16, 5, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Sword
        ctx.fillStyle = '#cbd5e1';
        ctx.strokeStyle = secondary;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(-4, 8);
        ctx.lineTo(4, 8);
        ctx.lineTo(3, -25);
        ctx.lineTo(0, -32);
        ctx.lineTo(-3, -25);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        // Guard handle
        ctx.fillStyle = '#374151';
        ctx.fillRect(-8, 8, 16, 3);
        ctx.fillRect(-2, 11, 4, 8);
      }
      ctx.restore();

      // Shield (Tanks)
      if (ent.stats.hp > 35) {
        ctx.fillStyle = secondary;
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.beginPath();
        const sx = ent.facingRight ? -16 : 10;
        ctx.rect(sx, -28, 8, 16);
        ctx.fill();
        ctx.stroke();
      }

      ctx.restore(); // Flash filter end
    });

    // Draw damage floating text
    this.floats.forEach(fl => {
      ctx.font = fl.font;
      ctx.fillStyle = fl.color;
      ctx.textAlign = 'center';
      ctx.shadowBlur = 4;
      ctx.shadowColor = 'black';
      ctx.fillText(fl.text, fl.x, fl.y);
      ctx.shadowBlur = 0;
    });

    ctx.restore(); // Screen shake end
  },

  log(msg, type = 'normal') {
    const time = ((Date.now() - this.battleStartTime) / 1000).toFixed(1);
    const logObj = { time, msg, type };
    this.battleLogs.push(logObj);

    const logBox = document.getElementById('combat-logs');
    if (logBox) {
      const line = document.createElement('div');
      line.className = `combat-log-line ${type}`;
      line.innerText = `[${time}초] ${msg}`;
      logBox.appendChild(line);

      // Auto-scroll
      logBox.scrollTop = logBox.scrollHeight;
    }
  },

  togglePause() {
    this.isPaused = !this.isPaused;
    const btn = document.getElementById('btn-pause-battle');
    if (btn) {
      btn.innerText = this.isPaused ? '▶' : '⏸';
      btn.title = this.isPaused ? '이어하기' : '일시정지';
    }
  },

  forfeit() {
    if (!this.isRunning) return;
    if (this.isSandbox) {
      this.log('🏳️ 체험을 종료하고 캐릭터 생성 화면으로 복귀합니다.', 'system');
      this.stop();
      Navigation.go('creator-screen');
      return;
    }
    this.log('🏳️ 플레이어가 항복을 선언했습니다.', 'system');
    this.player.hp = 0;
    this.handleBattleEnd();
  },

  stop() {
    this.isRunning = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  },

  handleNetworkMessage(msg) {
    if (msg.type === 'game_state') {
      this.opponent.x = msg.x;
      this.opponent.y = msg.y;
      this.opponent.vy = msg.vy;
      this.opponent.facingRight = msg.facingRight;
      this.opponent.hp = msg.hp;
      this.opponent.isStunned = msg.isStunned;
      this.updateHPUI();
    } else if (msg.type === 'action') {
      if (msg.action === 'attack') {
        this.opponent.attackCooldown = this.opponent.attackCooldownMax;
        this.opponent.attackSwingTimer = 12;
        this.opponent.weaponAngle = this.opponent.facingRight ? Math.PI / 3 : -Math.PI / 3;
        this.opponent.shotsFired++;
        this.opponent.hitsLanded++;
      }
    } else if (msg.type === 'hit') {
      this.applyDamage(this.player, msg.damage, msg.isCritical, false);
    } else if (msg.type === 'projectile_spawn') {
      this.projectiles.push({
        x: msg.x,
        y: msg.y,
        startX: msg.startX,
        range: msg.range,
        vx: msg.vx,
        vy: msg.vy,
        radius: msg.radius,
        color: msg.color,
        isPlayer: false,
        damage: msg.damage,
        active: true,
        isCritical: msg.isCritical
      });
      SoundSynth.playShoot();
    } else if (msg.type === 'opponent_disconnected' || msg.type === 'opponent_ended') {
      this.handleBattleEnd('상대방이 게임을 종료했습니다.');
    }
  },

  handleBattleEnd(forceMsg = null) {
    this.stop();
    const playerWon = this.player.hp > 0 && this.opponent.hp <= 0;

    // Play ending sound
    if (playerWon) {
      SoundSynth.playVictory();
    } else {
      SoundSynth.playDefeat();
    }

    this.log(playerWon ? '🏆 전투 종료: 플레이어 승리!' : '💀 전투 종료: 플레이어 패배...', playerWon ? 'victory' : 'defeat');

    // ELO Rating calculation (For simulated matching ELO updates)
    const list = CharDB.get();
    const playerChar = list.find(c => c.id === this.player.id);
    
    let eloDiffText = '';
    
    if (playerChar) {
      const oldRating = playerChar.rating || 1000;
      const oppRating = this.opponent.stats.rating || 1000;
      
      // Expected score
      const expected = 1 / (1 + Math.pow(10, (oppRating - oldRating) / 400));
      const score = playerWon ? 1 : 0;
      const K = 32;
      const ratingChange = Math.round(K * (score - expected));
      
      const newRating = Math.max(800, oldRating + ratingChange);

      // Save stats
      playerChar.rating = newRating;
      if (playerWon) {
        playerChar.winCount = (playerChar.winCount || 0) + 1;
      } else {
        playerChar.lossCount = (playerChar.lossCount || 0) + 1;
      }
      CharDB.update(playerChar.id, playerChar);

      eloDiffText = `${ratingChange >= 0 ? '+' + ratingChange : ratingChange} Rating (${oldRating} → ${newRating})`;
    }

    // Trigger Result Dialog
    setTimeout(() => {
      const dialog = document.getElementById('battle-result-dialog');
      dialog.className = playerWon ? 'victory' : 'defeat';

      // Update text
      document.getElementById('result-title').innerText = playerWon ? '승리!' : '패배...';
      document.getElementById('result-subtitle').innerText = playerWon 
        ? `탁월한 선택입니다! 전투에서 승리했습니다. (${eloDiffText})`
        : `안타깝군요. 스탯 분배를 고민해 봅시다. (${eloDiffText})`;

      // Render avatars in result
      document.getElementById('result-player-avatar').innerHTML = generateAvatarSVG(this.player.stats, 60);
      document.getElementById('result-player-name').innerText = this.player.name;

      document.getElementById('result-opponent-avatar').innerHTML = generateAvatarSVG(this.opponent.stats, 60);
      document.getElementById('result-opponent-name').innerText = this.opponent.name;



      dialog.showModal();
    }, 1000);
  }
};

// --- Helper Functions ---
function escapeHTML(str) {
  return str.replace(/[&<>'"]/g, 
    tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag)
  );
}

// --- App Initialization ---
document.addEventListener('DOMContentLoaded', () => {
  // Check if touch device and add layout marker
  if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
    document.body.classList.add('touch-device');
  }

  // Prevent Safari / WebView pinch-to-zoom (two or more fingers)
  document.addEventListener('touchstart', (e) => {
    if (e.touches && e.touches.length > 1) {
      if (e.cancelable) e.preventDefault();
    }
  }, { passive: false });

  // Prevent Safari / WebView double-tap-to-zoom
  let lastTouchEnd = 0;
  document.addEventListener('touchend', (e) => {
    const now = Date.now();
    if (now - lastTouchEnd <= 300) {
      if (e.cancelable) e.preventDefault();
    }
    lastTouchEnd = now;
  }, { passive: false });

  // Tracking touch coordinates to distinguish between brief taps and actual scrolls
  let touchStartX = 0;
  let touchStartY = 0;

  document.addEventListener('touchstart', (e) => {
    if (e.touches && e.touches[0]) {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    }
  }, { passive: true });

  // Prevent drag-to-scroll bounce effect on mobile browsers, except for selected scroll views
  document.addEventListener('touchmove', (e) => {
    // If inside Capacitor App shell, native configuration handles scroll margins, 
    // so bypass to prevent any input delay or double tap cancellation.
    if (window.Capacitor) return;

    const isScrollable = e.target.closest('.sliders-list') || 
                         e.target.closest('.character-grid') || 
                         e.target.closest('.fighter-grid') || 
                         e.target.closest('.mode-selectors');
    if (!isScrollable) {
      if (e.touches && e.touches[0]) {
        const deltaX = Math.abs(e.touches[0].clientX - touchStartX);
        const deltaY = Math.abs(e.touches[0].clientY - touchStartY);
        
        // Prevent default only if it's a real scroll movement (> 6px drag)
        if ((deltaX > 6 || deltaY > 6) && e.cancelable) {
          e.preventDefault();
        }
      }
    }
  }, { passive: false });

  // Dynamically manage orientation body classes and handle Capacitor app override
  function updateOrientation() {
    const isPortrait = window.innerHeight > window.innerWidth;
    
    if (window.Capacitor) {
      // If running inside native app shell, orientation lock is handled natively, 
      // so completely hide the web-based landscape warning overlay.
      document.body.classList.remove('orientation-portrait');
      document.body.classList.add('orientation-landscape');
      const warningOverlay = document.querySelector('.portrait-warning-overlay');
      if (warningOverlay) {
        warningOverlay.style.setProperty('display', 'none', 'important');
      }
      return;
    }
    
    if (isPortrait) {
      document.body.classList.add('orientation-portrait');
      document.body.classList.remove('orientation-landscape');
    } else {
      document.body.classList.remove('orientation-portrait');
      document.body.classList.add('orientation-landscape');
    }
  }

  window.addEventListener('resize', updateOrientation);
  window.addEventListener('orientationchange', updateOrientation);
  updateOrientation();

  Navigation.init();
  RadarChart.init();
  
  // Initial screen
  Navigation.go('main-menu-screen');
});
