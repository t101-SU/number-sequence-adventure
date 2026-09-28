/**
 * 🚂 數字小火車與積木島：數列大冒險 - game.js
 * 遊戲主邏輯控制器：模式管理、互動反應、答題判定、積木透視鏡鷹架與獎勵系統
 */

class SequenceGame {
  constructor() {
    this.currentMode = 'explorer'; // 'explorer' | 'quest' | 'magic'
    
    // 模式一：探索島狀態
    this.explorerNumber = 3000;
    this.explorerPrevNumber = null;
    this.explorerHistory = [3000];

    // 模式二：火車闖關狀態
    this.currentLevelId = 1;
    this.currentQuestionIndex = 0;
    this.currentQuestion = null;
    this.starsCount = parseInt(localStorage.getItem('seq_game_stars') || '0', 10);
    this.isAnswering = false;

    // 模式三：魔術箱狀態
    this.currentMagicIndex = 0;
    this.isTransformed = false;
  }

  init() {
    this.setupEventListeners();
    this.updateStarsDisplay();

    // 初始化模式一
    this.setExplorerNumber(3000, 0);

    // 初始化模式二關卡按鈕
    this.renderLevelButtons();
    this.loadQuestQuestion(1, 0);

    // 初始化模式三魔術箱標籤
    this.renderMagicCases();
    this.loadMagicCase(0);
  }

  // ==================== 事件監聽設定 ====================
  setupEventListeners() {
    // 1. 模式分頁切換
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const mode = btn.dataset.mode;
        this.switchMode(mode);
      });
    });

    // 2. 音效與音樂開關
    const soundToggle = document.getElementById('sound-toggle');
    const bgmToggle = document.getElementById('bgm-toggle');

    if (soundToggle) {
      soundToggle.addEventListener('click', () => {
        const enabled = window.soundEngine.toggleSound();
        soundToggle.classList.toggle('active', enabled);
        soundToggle.innerHTML = enabled ? '🔊 音效: 開' : '🔇 音效: 關';
        if (enabled) window.soundEngine.playPop();
      });
    }

    if (bgmToggle) {
      bgmToggle.addEventListener('click', () => {
        const playing = window.soundEngine.toggleBGM();
        bgmToggle.classList.toggle('active', playing);
        bgmToggle.innerHTML = playing ? '🎵 音樂: 播' : '🔈 音樂: 停';
      });
    }

    // 3. 模式一：課本預設按鈕
    document.querySelectorAll('.preset-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const val = parseInt(btn.dataset.val, 10);
        this.setExplorerNumber(val, 0);
      });
    });

    // 4. 模式一：隨機骰子與自訂輸入
    const btnRandom = document.getElementById('btn-random-num');
    const btnApplyInput = document.getElementById('btn-apply-input');
    const customInput = document.getElementById('custom-num-input');

    if (btnRandom) {
      btnRandom.addEventListener('click', () => {
        const randoms = [3000, 3009, 4980, 4990, 1735, 1935, 4213, 7005, 8965, 9999];
        const picked = randoms[Math.floor(Math.random() * randoms.length)];
        this.setExplorerNumber(picked, 0);
      });
    }

    if (btnApplyInput && customInput) {
      btnApplyInput.addEventListener('click', () => {
        const val = parseInt(customInput.value, 10);
        if (!isNaN(val) && val >= 0 && val <= 10000) {
          this.setExplorerNumber(val, 0);
        } else {
          alert('請輸入 0 到 10000 之間的數字喔！');
        }
      });
    }

    // 5. 模式一：語音發音按鈕
    const speakBtn = document.getElementById('speak-num-btn');
    if (speakBtn) {
      speakBtn.addEventListener('click', () => {
        window.soundEngine.speakNumber(this.explorerNumber);
      });
    }

    // 6. 模式一：增減步進按鈕 (+1, +10, +100, +1000...)
    document.querySelectorAll('.btn-step').forEach(btn => {
      btn.addEventListener('click', () => {
        const step = parseInt(btn.dataset.step, 10);
        this.stepExplorerNumber(step);
      });
    });

    // 7. 模式二：積木透視鏡切換按鈕
    const hintToggleBtn = document.getElementById('toggle-hint-btn');
    if (hintToggleBtn) {
      hintToggleBtn.addEventListener('click', () => {
        const hintBox = document.getElementById('quest-hint-box');
        if (hintBox) {
          const isShown = hintBox.classList.toggle('show');
          hintToggleBtn.innerHTML = isShown ? '💡 隱藏積木透視鏡' : '💡 打開積木透視鏡';
          if (isShown) {
            window.soundEngine.playPop();
          }
        }
      });
    }

    // 8. 模式二：火車整列數字連續發音按鈕
    const questSpeakBtn = document.getElementById('quest-speak-btn');
    if (questSpeakBtn) {
      questSpeakBtn.addEventListener('click', () => {
        this.toggleTrainSequenceSpeech();
      });
    }

    // 9. 模式三：魔術杖按鈕
    const magicWandBtn = document.getElementById('magic-wand-btn');
    if (magicWandBtn) {
      magicWandBtn.addEventListener('click', () => {
        this.performMagicTransformation();
      });
    }

    // 10. 彈窗關閉按鈕
    const modalCloseBtn = document.getElementById('modal-close-btn');
    if (modalCloseBtn) {
      modalCloseBtn.addEventListener('click', () => {
        document.getElementById('celebration-modal').classList.remove('show');
      });
    }
  }

  switchMode(mode) {
    if (window.soundEngine) {
      window.soundEngine.stopSequenceSpeech();
      this.resetTrainSpeechButton();
      this.clearCarHighlights();
    }
    this.currentMode = mode;
    window.soundEngine.playPop();

    // 更新分頁按鈕外觀
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.mode === mode);
    });

    // 更新內容區塊
    document.querySelectorAll('.mode-section').forEach(sec => {
      sec.classList.remove('active');
    });

    const activeSec = document.getElementById(`mode-${mode}`);
    if (activeSec) {
      activeSec.classList.add('active');
    }

    if (mode === 'quest') {
      window.soundEngine.playTrainWhistle();
    }
  }

  // ==================== 模式一：探索島邏輯 ====================
  setExplorerNumber(num, stepDiff = 0) {
    const clamped = Math.max(0, Math.min(10000, num));
    this.explorerPrevNumber = this.explorerNumber;
    this.explorerNumber = clamped;

    // 更新輸入框
    const input = document.getElementById('custom-num-input');
    if (input) input.value = clamped;

    // 更新大數字顯示
    const bigBadge = document.getElementById('big-number-val');
    if (bigBadge) bigBadge.innerText = clamped;

    // 判斷哪一位在變動
    let highlightCol = null;
    const absStep = Math.abs(stepDiff);
    if (absStep === 1) highlightCol = 'ge';
    else if (absStep === 10) highlightCol = 'shi';
    else if (absStep === 100) highlightCol = 'bai';
    else if (absStep === 1000) highlightCol = 'qian';

    // 滿萬時高亮萬位
    if (clamped === 10000) highlightCol = 'wan';

    // 更新定位板
    const pvBoard = document.getElementById('explorer-pv-board');
    window.blockEngine.updatePlaceValueBoard(pvBoard, clamped, highlightCol);

    // 更新積木舞台
    const blocksStage = document.getElementById('explorer-blocks-stage');
    window.blockEngine.renderBlocksStage(blocksStage, clamped, this.explorerPrevNumber);

    // 更新教學講解說明
    const expText = document.getElementById('explorer-explanation-text');
    if (expText) {
      expText.innerHTML = window.blockEngine.generateExplanationText(
        this.explorerPrevNumber || clamped,
        clamped,
        stepDiff
      );
    }

    // 播放音效或發音
    if (stepDiff !== 0) {
      if ((absStep === 1 && (clamped % 10 === 0)) ||
          (absStep === 10 && (clamped % 100 === 0)) ||
          (absStep === 100 && (clamped % 1000 === 0)) ||
          (clamped === 10000)) {
        window.soundEngine.playMagicMerge();
      } else if (stepDiff < 0) {
        window.soundEngine.playUnbundleBreak();
      }
    }

    // 更新歷史數列軌道
    this.updateHistoryTrail(stepDiff);
  }

  stepExplorerNumber(step) {
    const nextVal = this.explorerNumber + step;
    if (nextVal < 0) {
      alert('積木已經全部拿完囉，不能再拿走了！');
      return;
    }
    if (nextVal > 10000) {
      alert('已經達到最大的一萬（10000）囉！');
      return;
    }
    this.setExplorerNumber(nextVal, step);
  }

  updateHistoryTrail(stepDiff) {
    const trailContainer = document.getElementById('history-trail-items');
    if (!trailContainer) return;

    if (this.explorerHistory.length > 5) {
      this.explorerHistory.shift();
    }
    this.explorerHistory.push(this.explorerNumber);

    trailContainer.innerHTML = this.explorerHistory.map((num, idx) => {
      const isCurrent = idx === this.explorerHistory.length - 1;
      const arrowHtml = idx > 0 ? `<span class="trail-arrow">➔</span>` : '';
      return `
        ${arrowHtml}
        <div class="trail-chip ${isCurrent ? 'current' : ''}">
          ${num}
        </div>
      `;
    }).join('');
  }

  // ==================== 模式二：火車闖關邏輯 ====================
  renderLevelButtons() {
    const container = document.getElementById('level-badges-list');
    if (!container) return;

    container.innerHTML = window.SEQUENCE_LEVELS.map(lvl => `
      <button class="level-btn ${lvl.id === this.currentLevelId ? 'active' : ''}" data-level="${lvl.id}">
        <span>${lvl.badge}</span>
        <span>第 ${lvl.id} 關：${lvl.name}</span>
      </button>
    `).join('');

    container.querySelectorAll('.level-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const lvlId = parseInt(btn.dataset.level, 10);
        this.selectLevel(lvlId);
      });
    });
  }

  selectLevel(levelId) {
    this.currentLevelId = levelId;
    this.currentQuestionIndex = 0;
    this.renderLevelButtons();
    this.loadQuestQuestion(levelId, 0);
  }

  loadQuestQuestion(levelId, qIndex) {
    if (window.soundEngine) {
      window.soundEngine.stopSequenceSpeech();
      this.resetTrainSpeechButton();
      this.clearCarHighlights();
    }
    const level = window.SEQUENCE_LEVELS.find(l => l.id === levelId);
    if (!level) return;

    let question;
    if (levelId === 5) {
      question = window.QuestionGenerator.generateRandomQuestion(5);
    } else {
      question = level.questions[qIndex % level.questions.length];
    }

    this.currentQuestion = question;
    this.isAnswering = false;

    // 關閉透視鏡提示預設
    const hintBox = document.getElementById('quest-hint-box');
    const hintToggleBtn = document.getElementById('toggle-hint-btn');
    if (hintBox) hintBox.classList.remove('show');
    if (hintToggleBtn) hintToggleBtn.innerHTML = '💡 打開積木透視鏡';

    // 更新標題與提示
    const promptBanner = document.getElementById('question-prompt-banner');
    if (promptBanner) {
      promptBanner.innerText = `【${level.name}】${question.title || '請找出問號車廂的數字！'}`;
    }

    // 渲染火車車廂
    this.renderTrainConvoy(question);

    // 渲染透視鏡內容
    this.renderHintContent(question);

    // 渲染選項按鈕
    this.renderOptionButtons(question);
  }

  renderTrainConvoy(q) {
    const convoy = document.getElementById('train-convoy');
    if (!convoy) return;

    let carsHtml = `
      <div class="train-engine">
        <div class="train-chimney">
          <div class="smoke-puff"></div>
        </div>
        <div class="engine-face">🚂</div>
        <div class="engine-title">嘟嘟號</div>
        <div class="train-wheels">
          <div class="wheel"></div>
          <div class="wheel"></div>
        </div>
      </div>
    `;

    q.sequence.forEach((num, idx) => {
      const isMissing = num === null;
      const ruleText = (idx > 0 && q.step) ? `${q.step > 0 ? '+' : ''}${q.step}` : '';
      const ruleTag = ruleText ? `<div class="car-rule-arrow">${ruleText}</div>` : '';

      carsHtml += `
        <div class="train-car ${isMissing ? 'question-car' : ''}" id="car-${idx}">
          ${ruleTag}
          <div class="car-number">${isMissing ? '❓' : num}</div>
          <div class="train-wheels">
            <div class="wheel"></div>
            <div class="wheel"></div>
          </div>
        </div>
      `;
    });

    convoy.innerHTML = carsHtml;
  }

  renderHintContent(q) {
    const hintContent = document.getElementById('hint-content');
    if (!hintContent || !window.blockEngine) return;
    window.blockEngine.renderTrainHintBlocks(hintContent, q);
  }

  renderOptionButtons(q) {
    const container = document.getElementById('options-grid');
    if (!container) return;

    container.innerHTML = q.options.map(opt => `
      <button class="option-btn" data-val="${opt}">
        ${opt}
      </button>
    `).join('');

    container.querySelectorAll('.option-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (this.isAnswering) return;
        const val = parseInt(btn.dataset.val, 10);
        this.handleAnswer(val, btn);
      });
    });
  }

  handleAnswer(selectedVal, btnElement) {
    if (this.isAnswering || !this.currentQuestion) return;
    this.isAnswering = true;

    if (selectedVal === this.currentQuestion.answer) {
      // 答對了！
      btnElement.classList.add('correct');
      window.soundEngine.playCorrect();
      window.soundEngine.playStar();
      window.soundEngine.playTrainWhistle();

      // 更新車廂問號為正確數字
      const missingCar = document.querySelector('.train-car.question-car .car-number');
      if (missingCar) {
        missingCar.innerText = selectedVal;
        missingCar.style.color = '#2E7D32';
      }

      // 獎勵加星星
      this.addStars(1);

      setTimeout(() => {
        this.currentQuestionIndex++;
        // 5題過關慶祝
        if (this.currentQuestionIndex % 5 === 0) {
          this.showCelebrationModal();
        } else {
          this.loadQuestQuestion(this.currentLevelId, this.currentQuestionIndex);
        }
      }, 1500);

    } else {
      // 答錯溫柔引導
      btnElement.classList.add('wrong');
      window.soundEngine.playWrong();

      // 自動打開透視鏡輔助孩子
      const hintBox = document.getElementById('quest-hint-box');
      const hintToggleBtn = document.getElementById('toggle-hint-btn');
      if (hintBox) hintBox.classList.add('show');
      if (hintToggleBtn) hintToggleBtn.innerHTML = '💡 隱藏積木透視鏡';

      setTimeout(() => {
        btnElement.classList.remove('wrong');
        this.isAnswering = false;
      }, 800);
    }
  }

  addStars(count = 1) {
    this.starsCount += count;
    localStorage.setItem('seq_game_stars', this.starsCount.toString());
    this.updateStarsDisplay();
  }

  updateStarsDisplay() {
    const badge = document.getElementById('star-count-num');
    if (badge) badge.innerText = this.starsCount;
  }

  showCelebrationModal() {
    const modal = document.getElementById('celebration-modal');
    if (modal) {
      modal.classList.add('show');
      window.soundEngine.playCorrect();
    }
  }

  // ==================== 火車整列數字朗讀控制 ====================
  toggleTrainSequenceSpeech() {
    if (!this.currentQuestion) return;
    const btn = document.getElementById('quest-speak-btn');

    if (window.soundEngine.isSpeakingSequence) {
      window.soundEngine.stopSequenceSpeech();
      this.resetTrainSpeechButton();
      this.clearCarHighlights();
      return;
    }

    if (btn) btn.innerHTML = '⏹️ 停止朗讀整列';

    // 判斷車廂是否已答對完成
    const missingCar = document.querySelector('.train-car.question-car');
    const isAnswered = !missingCar;

    const seqToSpeak = this.currentQuestion.sequence.map((n, i) => {
      if (i === this.currentQuestion.missingIndex) {
        return isAnswered ? this.currentQuestion.answer : null;
      }
      return n;
    });

    window.soundEngine.speakSequence(
      seqToSpeak,
      (highlightIdx) => {
        this.clearCarHighlights();
        if (highlightIdx >= 0) {
          const carEl = document.getElementById(`car-${highlightIdx}`);
          if (carEl) {
            carEl.classList.add('speaking-active');
          }
        }
      },
      () => {
        this.resetTrainSpeechButton();
        this.clearCarHighlights();
      }
    );
  }

  resetTrainSpeechButton() {
    const btn = document.getElementById('quest-speak-btn');
    if (btn) btn.innerHTML = '🔊 朗讀整列火車數字';
  }

  clearCarHighlights() {
    document.querySelectorAll('.train-car').forEach(car => {
      car.classList.remove('speaking-active');
    });
  }

  // ==================== 模式三：魔術箱邏輯 ====================
  renderMagicCases() {
    const container = document.getElementById('magic-cases-selector');
    if (!container) return;

    container.innerHTML = window.MAGIC_BREAKTHROUGH_CASES.map((item, idx) => `
      <div class="case-chip ${idx === this.currentMagicIndex ? 'active' : ''}" data-idx="${idx}">
        ${item.label}
      </div>
    `).join('');

    container.querySelectorAll('.case-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const idx = parseInt(chip.dataset.idx, 10);
        this.loadMagicCase(idx);
      });
    });
  }

  loadMagicCase(index) {
    this.currentMagicIndex = index;
    this.isTransformed = false;
    const c = window.MAGIC_BREAKTHROUGH_CASES[index];
    if (!c) return;

    // 更新標籤高亮
    document.querySelectorAll('.case-chip').forEach((chip, i) => {
      chip.classList.toggle('active', i === index);
    });

    // 渲染原始狀態
    const numBefore = document.getElementById('magic-num-before');
    const numAfter = document.getElementById('magic-num-after');
    const titleBefore = document.getElementById('magic-title-before');
    const titleAfter = document.getElementById('magic-title-after');
    const storyText = document.getElementById('magic-story-text');
    const wandBtn = document.getElementById('magic-wand-btn');

    if (numBefore) numBefore.innerText = c.start;
    if (numAfter) numAfter.innerText = '?';
    if (titleBefore) titleBefore.innerText = `原數字：${c.start}`;
    if (titleAfter) titleAfter.innerText = `魔術變化後：${c.label.split(' ')[0]}`;

    if (storyText) storyText.innerText = c.story;
    if (wandBtn) {
      wandBtn.innerHTML = c.type === 'bundle' ? '✨ 施展十合一魔法！' : '🔨 施展敲碎拆解魔法！';
    }

    // 渲染左側積木
    const stageBefore = document.getElementById('magic-blocks-before');
    const stageAfter = document.getElementById('magic-blocks-after');

    if (stageBefore) {
      window.blockEngine.renderBlocksStage(stageBefore, c.start);
    }
    if (stageAfter) {
      stageAfter.innerHTML = `<div style="text-align: center; color: #9C27B0; font-weight: 800; padding: 40px 0;">點擊中間魔法杖，見證積木變身！</div>`;
    }
  }

  performMagicTransformation() {
    const c = window.MAGIC_BREAKTHROUGH_CASES[this.currentMagicIndex];
    if (!c) return;

    const stageAfter = document.getElementById('magic-blocks-after');
    const numAfter = document.getElementById('magic-num-after');

    if (c.type === 'bundle') {
      window.soundEngine.playMagicMerge();
    } else {
      window.soundEngine.playUnbundleBreak();
    }

    if (numAfter) numAfter.innerText = c.target;
    if (stageAfter) {
      window.blockEngine.renderBlocksStage(stageAfter, c.target);
    }

    this.isTransformed = true;
    this.addStars(1);
  }
}

// 頁面載入完成後啟動遊戲
window.addEventListener('DOMContentLoaded', () => {
  window.sequenceGame = new SequenceGame();
  window.sequenceGame.init();
});
