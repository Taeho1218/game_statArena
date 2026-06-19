const { WebSocketServer } = require('ws');

let wss = null;
let matchmakingQueue = [];
let activeMatches = new Map(); // roomId -> { p1: socket, p2: socket }

function startWebSocketServer(port = 8081) {
  if (wss) return wss;
  
  wss = new WebSocketServer({ port });
  console.log(`⚡ 스탯 아레나 웹소켓 매칭 서버가 포트 ${port}에서 실행 중입니다...`);

  wss.on('connection', (ws) => {
    ws.id = Math.random().toString(36).substring(2, 9);
    console.log(`🔌 유저 연결됨: ${ws.id}`);

    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message);
        
        switch (data.type) {
          case 'join_queue':
            ws.character = data.character;
            console.log(`🔍 대기열 합류: ${ws.id} (${data.character.name})`);
            
            // 이미 대기열에 있는지 중복 방지
            if (!matchmakingQueue.find(s => s.id === ws.id)) {
              matchmakingQueue.push(ws);
            }
            
            checkAndMatch();
            break;

          case 'leave_queue':
            console.log(`❌ 대기열 이탈: ${ws.id}`);
            matchmakingQueue = matchmakingQueue.filter(s => s.id !== ws.id);
            break;

          case 'game_state':
          case 'action':
          case 'hit':
          case 'projectile_spawn':
          case 'chat':
            // 활성 룸에서 상대방에게 패킷 그대로 중계 (릴레이)
            if (ws.roomId && activeMatches.has(ws.roomId)) {
              const match = activeMatches.get(ws.roomId);
              const opponent = match.p1.id === ws.id ? match.p2 : match.p1;
              if (opponent.readyState === ws.OPEN) {
                opponent.send(JSON.stringify(data));
              }
            }
            break;

          case 'forfeit':
          case 'game_over':
            if (ws.roomId && activeMatches.has(ws.roomId)) {
              const match = activeMatches.get(ws.roomId);
              const opponent = match.p1.id === ws.id ? match.p2 : match.p1;
              console.log(`🏁 게임 종료 (기권/승패 결정): 룸 ${ws.roomId}`);
              if (opponent.readyState === ws.OPEN) {
                opponent.send(JSON.stringify({ type: 'opponent_ended', reason: data.reason || 'normal' }));
              }
              cleanUpMatch(ws.roomId);
            }
            break;
        }
      } catch (e) {
        console.error('메시지 파싱 실패:', e);
      }
    });

    ws.on('close', () => {
      console.log(`🔌 유저 연결 끊김: ${ws.id}`);
      
      // 대기열 제거
      matchmakingQueue = matchmakingQueue.filter(s => s.id !== ws.id);
      
      // 진행 중인 게임이 있는 경우 상대에게 알림
      if (ws.roomId && activeMatches.has(ws.roomId)) {
        const match = activeMatches.get(ws.roomId);
        const opponent = match.p1.id === ws.id ? match.p2 : match.p1;
        
        console.log(`⚠️ 유저 탈주로 인한 룸 파괴: ${ws.roomId}`);
        if (opponent.readyState === ws.OPEN) {
          opponent.send(JSON.stringify({ type: 'opponent_disconnected' }));
        }
        cleanUpMatch(ws.roomId);
      }
    });
  });

  return wss;
}

function checkAndMatch() {
  if (matchmakingQueue.length >= 2) {
    const p1 = matchmakingQueue.shift();
    const p2 = matchmakingQueue.shift();
    
    const roomId = `room_${Math.random().toString(36).substring(2, 9)}`;
    p1.roomId = roomId;
    p2.roomId = roomId;
    
    activeMatches.set(roomId, { p1, p2 });
    console.log(`⚔️ 매치 성사! 룸 ID: ${roomId} [${p1.character.name} VS ${p2.character.name}]`);
    
    // p1은 왼쪽(Left)에서 시작하고, p2는 오른쪽(Right)에서 시작하게 지정
    p1.send(JSON.stringify({
      type: 'match_found',
      roomId: roomId,
      side: 'left',
      opponent: p2.character
    }));
    
    p2.send(JSON.stringify({
      type: 'match_found',
      roomId: roomId,
      side: 'right',
      opponent: p1.character
    }));
  }
}

function cleanUpMatch(roomId) {
  if (activeMatches.has(roomId)) {
    const match = activeMatches.get(roomId);
    match.p1.roomId = null;
    match.p2.roomId = null;
    activeMatches.delete(roomId);
    console.log(`🧹 룸 정리 완료: ${roomId}`);
  }
}

function stopWebSocketServer() {
  if (wss) {
    wss.close();
    wss = null;
    console.log('🧹 웹소켓 서버가 정상 종료되었습니다.');
  }
}

// 직접 실행인 경우 즉시 기동
if (require.main === module) {
  const port = process.env.PORT || 8081;
  startWebSocketServer(port);
}

module.exports = {
  startWebSocketServer,
  stopWebSocketServer
};
