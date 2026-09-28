/**
 * 🚂 數字小火車與積木島：數列大冒險 - audio.js
 * 純原生 Web Audio API 音效合成引擎 + 輕快循環背景音樂 + 國小中文數字語音朗讀
 */

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.soundEnabled = true;
    this.bgmEnabled = false;
    this.speechEnabled = true;
    this.bgmTimer = null;
    this.bgmStep = 0;
    this.isSpeakingSequence = false;
    this.sequenceSpeechTimer = null;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // 1. 積木放置／按鈕點擊清脆泡泡音
  playPop() {
    if (!this.soundEnabled) return;
    this.init();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    const now = this.ctx.currentTime;
    osc.frequency.setValueAtTime(400, now);
    osc.frequency.exponentialRampToValueAtTime(800, now + 0.08);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.09);
  }

  // 2. 萌趣小火車鳴笛聲（雙音和弦汽笛）
  playTrainWhistle() {
    if (!this.soundEnabled) return;
    this.init();
    const now = this.ctx.currentTime;
    
    // 主音 F5 (698Hz) 與 A5 (880Hz) 經典火車汽笛和弦
    [698.46, 880.00].forEach((freq) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq - 15, now);
      osc.frequency.linearRampToValueAtTime(freq + 10, now + 0.15);
      osc.frequency.linearRampToValueAtTime(freq, now + 0.5);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.18, now + 0.06);
      gain.gain.setValueAtTime(0.18, now + 0.35);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.6);
    });
  }

  // 3. 十合一魔法融合進位音（向上琶音 + 晶亮感）
  playMagicMerge() {
    if (!this.soundEnabled) return;
    this.init();
    const now = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51]; // C5, E5, G5, C6, E6

    notes.forEach((freq, index) => {
      const noteTime = now + index * 0.07;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, noteTime);

      gain.gain.setValueAtTime(0, noteTime);
      gain.gain.linearRampToValueAtTime(0.2, noteTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(noteTime);
      osc.stop(noteTime + 0.28);
    });
  }

  // 4. 大積木敲碎／退位拆解音（俏皮彈性水滴音）
  playUnbundleBreak() {
    if (!this.soundEnabled) return;
    this.init();
    const now = this.ctx.currentTime;
    const notes = [1046.50, 783.99, 523.25]; // C6 -> G5 -> C5 下滑

    notes.forEach((freq, idx) => {
      const noteTime = now + idx * 0.06;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, noteTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.7, noteTime + 0.12);

      gain.gain.setValueAtTime(0.2, noteTime);
      gain.gain.exponentialRampToValueAtTime(0.01, noteTime + 0.12);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(noteTime);
      osc.stop(noteTime + 0.13);
    });
  }

  // 5. 答對歡慶和弦與過關大調
  playCorrect() {
    if (!this.soundEnabled) return;
    this.init();
    const now = this.ctx.currentTime;
    const chord = [523.25, 659.25, 783.99, 1046.50]; // C大調和弦

    chord.forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + i * 0.04);

      gain.gain.setValueAtTime(0, now + i * 0.04);
      gain.gain.linearRampToValueAtTime(0.22, now + i * 0.04 + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now + i * 0.04);
      osc.stop(now + 0.75);
    });
  }

  // 6. 答錯溫柔引導音（彈簧 wobble，不刺耳）
  playWrong() {
    if (!this.soundEnabled) return;
    this.init();
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(260, now);
    osc.frequency.exponentialRampToValueAtTime(180, now + 0.25);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.28);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.3);
  }

  // 7. 獲得星星叮咚聲
  playStar() {
    if (!this.soundEnabled) return;
    this.init();
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1567.98, now); // G6
    osc.frequency.exponentialRampToValueAtTime(2093.00, now + 0.15); // C7

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.005, now + 0.3);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.32);
  }

  // 8. 輕快木琴／八音盒背景音樂 (BGM)
  startBGM() {
    this.bgmEnabled = true;
    this.init();
    if (this.bgmTimer) clearInterval(this.bgmTimer);

    // 輕快五聲音階旋律：C4, D4, E4, G4, A4, C5
    const melody = [
      523.25, 0, 659.25, 783.99, 659.25, 523.25, 0, 783.99,
      880.00, 783.99, 659.25, 523.25, 587.33, 0, 659.25, 0,
      523.25, 659.25, 783.99, 1046.50, 880.00, 783.99, 659.25, 0,
      587.33, 659.25, 783.99, 587.33, 523.25, 0, 0, 0
    ];

    this.bgmStep = 0;
    this.bgmTimer = setInterval(() => {
      if (!this.bgmEnabled || !this.ctx) return;
      const freq = melody[this.bgmStep % melody.length];
      this.bgmStep++;

      if (freq > 0) {
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.04, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.24);
      }
    }, 240); // 約 125 BPM 輕快節奏
  }

  stopBGM() {
    this.bgmEnabled = false;
    if (this.bgmTimer) {
      clearInterval(this.bgmTimer);
      this.bgmTimer = null;
    }
  }

  toggleBGM() {
    if (this.bgmEnabled) {
      this.stopBGM();
      return false;
    } else {
      this.startBGM();
      return true;
    }
  }

  toggleSound() {
    this.soundEnabled = !this.soundEnabled;
    return this.soundEnabled;
  }

  // 9. 中文數字語音朗讀 (Web Speech API)
  // 正確處理台灣國小「讀作」規範：如 3009 讀作「三千零九」、4980 讀作「四千九百八十」、10000 讀作「一萬」
  numberToChineseWords(num) {
    if (num === 0) return '零';
    if (num === 10000) return '一萬';

    const digits = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
    const units = ['', '十', '百', '千'];

    let str = num.toString().padStart(4, '0');
    let qian = parseInt(str[0], 10);
    let bai = parseInt(str[1], 10);
    let shi = parseInt(str[2], 10);
    let ge = parseInt(str[3], 10);

    let result = '';

    // 千位
    if (qian > 0) {
      result += digits[qian] + '千';
    }

    // 百位
    if (bai > 0) {
      result += digits[bai] + '百';
    } else if (qian > 0 && (shi > 0 || ge > 0)) {
      result += '零';
    }

    // 十位
    if (shi > 0) {
      result += digits[shi] + '十';
    } else if (bai > 0 && ge > 0 && !result.endsWith('零')) {
      result += '零';
    }

    // 個位
    if (ge > 0) {
      result += digits[ge];
    }

    // 清理重複的零
    result = result.replace(/零+/g, '零').replace(/零$/, '');
    return result || '零';
  }

  speakNumber(num) {
    if (!this.speechEnabled || !('speechSynthesis' in window)) return;
    this.stopSequenceSpeech();
    window.speechSynthesis.cancel(); // 停止先前的朗讀

    const text = this.numberToChineseWords(num);
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = 'zh-TW';
    utter.rate = 0.9; // 稍慢、清晰，最適合兒童
    utter.pitch = 1.1; // 輕快親切

    window.speechSynthesis.speak(utter);
  }

  // 10. 整列火車數字連續朗讀（支援問號車廂與同步高亮回呼）
  speakSequence(sequence, onHighlight, onDone) {
    if (!this.speechEnabled || !('speechSynthesis' in window)) {
      if (onDone) onDone();
      return;
    }
    this.stopSequenceSpeech();
    this.isSpeakingSequence = true;

    let index = 0;

    const speakNext = () => {
      if (!this.isSpeakingSequence || index >= sequence.length) {
        this.isSpeakingSequence = false;
        if (onHighlight) onHighlight(-1);
        if (onDone) onDone();
        return;
      }

      const currentIdx = index;
      const val = sequence[currentIdx];
      let text = '';
      if (val === null || val === undefined || val === '?') {
        text = '問號';
      } else {
        text = this.numberToChineseWords(val);
      }

      if (onHighlight) onHighlight(currentIdx);

      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = 'zh-TW';
      utter.rate = 0.85; // 稍慢、親切
      utter.pitch = 1.1;

      utter.onend = () => {
        if (!this.isSpeakingSequence) return;
        index++;
        // 車廂之間停頓 350ms，聽起來自然流暢
        this.sequenceSpeechTimer = setTimeout(speakNext, 350);
      };

      utter.onerror = () => {
        if (!this.isSpeakingSequence) return;
        index++;
        this.sequenceSpeechTimer = setTimeout(speakNext, 200);
      };

      window.speechSynthesis.speak(utter);
    };

    speakNext();
  }

  stopSequenceSpeech() {
    this.isSpeakingSequence = false;
    if (this.sequenceSpeechTimer) {
      clearTimeout(this.sequenceSpeechTimer);
      this.sequenceSpeechTimer = null;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }
}

// 實例化全域音效控制器
window.soundEngine = new SoundEngine();
