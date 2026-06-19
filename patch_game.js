const fs = require('fs');
let code = fs.readFileSync('game.js', 'utf8');

code = code.replace('// --- Canvas Battle Arena Engine ---', `// --- Multiplayer WebSocket Manager ---
const MultiplayerManager = {
  ws: null,
  isConnected: false,
  roomId: null,
  side: null,
  tickInterval: null,

  connect(character, onMatchFound, onDisconnect, onMessage) {
    if (this.ws) this.disconnect();
    this.ws = new WebSocket('ws://localhost:8080');
    
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

// --- Canvas Battle Arena Engine ---`);

code = code.replace(`    const aiRadio = document.querySelector('input[name="battle-mode"][value="ai"]');
    const matchRadio = document.querySelector('input[name="battle-mode"][value="matching"]');
    const diffContainer = document.getElementById('ai-difficulty-container');

    const toggleDiff = () => {
      if (aiRadio.checked) {
        diffContainer.style.display = 'flex';
      } else {
        diffContainer.style.display = 'none';
      }
    };

    aiRadio.addEventListener('change', toggleDiff);
    matchRadio.addEventListener('change', toggleDiff);`,
`    const aiRadio = document.querySelector('input[name="battle-mode"][value="ai"]');
    const matchRadio = document.querySelector('input[name="battle-mode"][value="matching"]');
    const multiRadio = document.querySelector('input[name="battle-mode"][value="multiplayer"]');
    const diffContainer = document.getElementById('ai-difficulty-container');

    const toggleDiff = () => {
      if (aiRadio.checked) {
        diffContainer.style.display = 'flex';
      } else {
        diffContainer.style.display = 'none';
      }
    };

    aiRadio.addEventListener('change', toggleDiff);
    matchRadio.addEventListener('change', toggleDiff);
    if(multiRadio) multiRadio.addEventListener('change', toggleDiff);`);

code = code.replace(`      document.getElementById('btn-lobby-goto-create').addEventListener('click', () => {
        SoundSynth.playClick();
        CreatorPage.init(null);
      });
      this.eventsBound = true;`,
`      document.getElementById('btn-lobby-goto-create').addEventListener('click', () => {
        SoundSynth.playClick();
        CreatorPage.init(null);
      });
      
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
      this.eventsBound = true;`);

code = code.replace(`    Navigation.go('matching-screen');

    // Start simulated matching logic
    let elapsed = 0;`,
`    const cancelBtn = document.getElementById('btn-cancel-matching');
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
    let elapsed = 0;`);

code = code.replace(`  start(playerData, opponentData, isAI, isSandbox = false) {
    if (!this.canvas) this.init();

    this.isAIOnly = isAI;
    this.isSandbox = isSandbox;`,
`  start(playerData, opponentData, isAI, isSandbox = false, isMultiplayer = false, mySide = 'left') {
    if (!this.canvas) this.init();

    this.isAIOnly = isAI;
    this.isSandbox = isSandbox;
    this.isMultiplayer = isMultiplayer;`);

code = code.replace(`    // Setup fighters formulas (Starting at center of block 2 and block 15/17)
    this.player = this.createFighter(playerData, 125, true);
    
    const oppX = this.isSandbox ? 775 : 875; // closer in sandbox (block 15 center)
    this.opponent = this.createFighter(opponentData, oppX, false);`,
`    // Setup fighters formulas
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
    }`);

code = code.replace(`  handleBattleEnd() {`,
`  handleNetworkMessage(msg) {
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
  }

  handleBattleEnd(forceMsg = null) {`);

code = code.replace(`      } else {
        // AI Logic
        if (this.isSandbox) return; // Dummy does nothing`,
`      } else {
        if (this.isMultiplayer) return; // Opponent controlled by network
        // AI Logic
        if (this.isSandbox) return; // Dummy does nothing`);

code = code.replace(`  applyDamage(target, damage, isCritical = false) {`,
`  applyDamage(target, damage, isCritical = false, broadcast = true) {
    if (this.isMultiplayer && target === this.opponent && broadcast) {
       MultiplayerManager.send({ type: 'hit', damage, isCritical });
    }`);

code = code.replace(`      // Ranged Attack (Spawn Projectile)
      attacker.shotsFired++;
      
      const projSpeed = 12;
      const vx = attacker.facingRight ? projSpeed : -projSpeed;
      const projColor = attacker.isPlayer ? '#06b6d4' : '#ec4899'; // Cyan for player, Pink for Opponent
      
      const newProj = {
        x: attacker.x + (attacker.facingRight ? 25 : -25),
        y: attacker.y - 35,
        startX: attacker.x, // Store the attacker center for exact range measurement
        range: attacker.atkRange,
        vx: vx,
        vy: 0,
        radius: 6,
        color: projColor,
        isPlayer: attacker.isPlayer,
        damage: attacker.atkDamage,
        active: true,
        isCritical: isCritical
      };

      this.projectiles.push(newProj);
      SoundSynth.playShoot();`,
`      // Ranged Attack (Spawn Projectile)
      attacker.shotsFired++;
      
      const projSpeed = 12;
      const vx = attacker.facingRight ? projSpeed : -projSpeed;
      const projColor = attacker.isPlayer ? '#06b6d4' : '#ec4899'; // Cyan for player, Pink for Opponent
      
      const newProj = {
        x: attacker.x + (attacker.facingRight ? 25 : -25),
        y: attacker.y - 35,
        startX: attacker.x, // Store the attacker center for exact range measurement
        range: attacker.atkRange,
        vx: vx,
        vy: 0,
        radius: 6,
        color: projColor,
        isPlayer: attacker.isPlayer,
        damage: attacker.atkDamage,
        active: true,
        isCritical: isCritical
      };

      this.projectiles.push(newProj);
      SoundSynth.playShoot();

      if (this.isMultiplayer && attacker.isPlayer) {
        MultiplayerManager.send({
          type: 'projectile_spawn',
          x: newProj.x,
          y: newProj.y,
          startX: newProj.startX,
          range: newProj.range,
          vx: newProj.vx,
          vy: newProj.vy,
          radius: newProj.radius,
          color: newProj.color,
          damage: newProj.damage,
          isCritical: newProj.isCritical
        });
        MultiplayerManager.send({ type: 'action', action: 'attack' });
      }`);

code = code.replace(`      // Melee Attack (Instant range check)
      attacker.hitsLanded++;`,
`      // Melee Attack (Instant range check)
      attacker.hitsLanded++;
      if (this.isMultiplayer && attacker.isPlayer) {
        MultiplayerManager.send({ type: 'action', action: 'attack' });
      }`);

code = code.replace(`  forfeit() {
    this.player.hp = 0;
    this.handleBattleEnd();
  },`,
`  forfeit() {
    if (this.isMultiplayer) {
      MultiplayerManager.send({ type: 'forfeit', reason: 'player_forfeit' });
      MultiplayerManager.disconnect();
    }
    this.player.hp = 0;
    this.handleBattleEnd();
  },`);

code = code.replace(`  handleBattleEnd() {
    this.isRunning = false;`,
`  handleBattleEnd(forceMsg = null) {
    this.isRunning = false;
    if (this.isMultiplayer) {
      MultiplayerManager.send({ type: 'game_over' });
      MultiplayerManager.disconnect();
    }`);

code = code.replace(`    const isVictory = this.player.hp > 0;
    const isSandbox = this.isSandbox;`,
`    const isVictory = this.player.hp > 0;
    const isSandbox = this.isSandbox;
    if (forceMsg && typeof forceMsg === 'string') {
      document.getElementById('result-subtitle').innerText = forceMsg;
    } else {
      document.getElementById('result-subtitle').innerText = isVictory ? '축하합니다! 완벽한 스탯의 승리입니다.' : '패배했습니다... 스탯을 다시 점검하세요.';
    }`);

fs.writeFileSync('game.js', code, 'utf8');
