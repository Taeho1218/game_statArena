const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

// The corrupted start index
const startIndex = code.indexOf('<h1 class="screen-title">대기실</h1>');
const endIndex = code.indexOf('<div id="ai-difficulty-container" class="difficulty-container">');

if (startIndex !== -1 && endIndex !== -1) {
  const cleanHTML = `<h1 class="screen-title">대기실</h1>
          <p class="screen-desc">전투에 참여할 파이터를 선택하고 모드를 결정하세요.</p>
        </header>

        <div class="lobby-layout">
          <!-- Left: Character List -->
          <div class="lobby-left panel-glass">
            <h2 class="panel-title">보유 파이터</h2>
            <div id="lobby-fighter-list" class="fighter-grid">
              <!-- Dynamically populated -->
            </div>
            
            <div id="lobby-no-fighter" class="empty-state">
              <span class="empty-icon">😢</span>
              <p>보유중인 캐릭터가 없습니다.</p>
              <button id="btn-lobby-goto-create" class="action-btn primary mt-sm">파이터 생성하러 가기</button>
            </div>
          </div>

          <!-- Right: Mode Selection & Status -->
          <div class="lobby-right panel-glass">
            <h2 class="panel-title">전투 설정</h2>
            
            <div class="mode-selectors">
              <!-- AI Battle Mode -->
              <label class="mode-card cursor-pointer">
                <input type="radio" name="battle-mode" value="ai" checked class="hidden-radio">
                <div class="mode-card-content">
                  <div class="mode-icon">🤖</div>
                  <div class="mode-info">
                    <span class="mode-title">AI 대전</span>
                    <span class="mode-desc">선택된 캐릭터와 인공지능 캐릭터의 모의 전투를 치릅니다.</span>
                  </div>
                </div>
              </label>

              <!-- Simulated PvP Matching Mode -->
              <label class="mode-card cursor-pointer">
                <input type="radio" name="battle-mode" value="matching" class="hidden-radio">
                <div class="mode-card-content">
                  <div class="mode-icon">⚔️</div>
                  <div class="mode-info">
                    <span class="mode-title">유저 매칭 시뮬레이터</span>
                    <span class="mode-desc">전 세계의 스탯 조합 파이터를 탐색하여 정면 승부를 겨룹니다.</span>
                  </div>
                </div>
              </label>

              <!-- Real-time Online PvP Mode -->
              <label class="mode-card cursor-pointer">
                <input type="radio" name="battle-mode" value="multiplayer" class="hidden-radio">
                <div class="mode-card-content">
                  <div class="mode-icon">🌐</div>
                  <div class="mode-info">
                    <span class="mode-title">실시간 온라인 대전</span>
                    <span class="mode-desc">실제 접속 중인 다른 유저와 웹소켓을 통해 실시간 1:1 대결을 펼칩니다.</span>
                  </div>
                </div>
              </label>
            </div>

            <!-- AI Difficulty Selection (only shown when AI mode selected) -->
            `;
  
  code = code.substring(0, startIndex) + cleanHTML + code.substring(endIndex);
  fs.writeFileSync('index.html', code, 'utf8');
  console.log("HTML repaired successfully.");
} else {
  console.log("Indices not found.");
}
