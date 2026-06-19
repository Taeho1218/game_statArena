const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');
content = content.replace(
  `<div class="match-faction">RANKED FIGHTER</div>
          </div>
        </div>
      </div>
    </section>`,
  `<div class="match-faction">RANKED FIGHTER</div>
          </div>
        </div>

        <button id="btn-cancel-matching" class="action-btn secondary large-btn mt-xl" style="display: none;">매칭 취소</button>
      </div>
    </section>`
);
fs.writeFileSync('index.html', content, 'utf8');
