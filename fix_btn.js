const fs = require('fs');
let code = fs.readFileSync('game.js', 'utf8');

code = code.replace(`      document.getElementById('btn-lobby-goto-create').addEventListener('click', () => {
        SoundSynth.playClick();
        CreatorPage.init(null);
      });`,
`      const gotoCreateBtn = document.getElementById('btn-lobby-goto-create');
      if (gotoCreateBtn) {
        gotoCreateBtn.addEventListener('click', () => {
          SoundSynth.playClick();
          CreatorPage.init(null);
        });
      }`);

fs.writeFileSync('game.js', code, 'utf8');
