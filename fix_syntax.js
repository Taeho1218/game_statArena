const fs = require('fs');
let code = fs.readFileSync('game.js', 'utf8');

code = code.replace(`  handleNetworkMessage(msg) {
    if (msg.type === 'game_state') {`, `,
  handleNetworkMessage(msg) {
    if (msg.type === 'game_state') {`);

code = code.replace(`    } else if (msg.type === 'opponent_disconnected' || msg.type === 'opponent_ended') {
      this.handleBattleEnd('상대방이 게임을 종료했습니다.');
    }
  }

  handleBattleEnd(forceMsg = null) {`, `    } else if (msg.type === 'opponent_disconnected' || msg.type === 'opponent_ended') {
      this.handleBattleEnd('상대방이 게임을 종료했습니다.');
    }
  },

  handleBattleEnd(forceMsg = null) {`);

// Also fix the first one if there's a missing comma before handleNetworkMessage?
// wait, my original replacement was:
// code = code.replace(`  handleBattleEnd() {`, `  handleNetworkMessage(msg) { ... } \n\n handleBattleEnd(forceMsg=null) {`)
// The method before handleBattleEnd was probably separated by a comma.
// e.g. `  something(),\n\n  handleBattleEnd() {` -> `  something(),\n\n  handleNetworkMessage() {...} handleBattleEnd() {`
// So handleNetworkMessage doesn't need a comma BEFORE it, because `something(),` already provided it.
// The comma is needed AFTER handleNetworkMessage.

fs.writeFileSync('game.js', code, 'utf8');
