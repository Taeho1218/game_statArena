const fs = require('fs');
let code = fs.readFileSync('game.js', 'utf8');

// remove the wrong comma
code = code.replace(`,\n  handleNetworkMessage(msg) {`, `  handleNetworkMessage(msg) {`);

// ensure there is a comma after handleNetworkMessage (which I already added in fix_syntax.js successfully? Let me double check if I added it correctly.)
// My previous script had:
// code.replace(`    } else if (msg.type === 'opponent_disconnected' || msg.type === 'opponent_ended') {
//      this.handleBattleEnd('상대방이 게임을 종료했습니다.');
//    }
//  }
//
//  handleBattleEnd(forceMsg = null) {`, `... }, \n handleBattleEnd`)
// Let's just do a clean regex replacement for any missing comma before handleBattleEnd
code = code.replace(/}\s*handleBattleEnd\(/g, '},\n\n  handleBattleEnd(');

fs.writeFileSync('game.js', code, 'utf8');
