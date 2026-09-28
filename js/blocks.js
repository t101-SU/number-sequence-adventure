/**
 * 🚂 數字小火車與積木島：數列大冒險 - blocks.js
 * 具象十進位積木繪製、定位板更新與進退位動態融合/拆解動畫引擎
 */

class BlockEngine {
  constructor() {
    this.blockColors = {
      wan: '#9C27B0',
      qian: '#FF9800',
      bai: '#2196F3',
      shi: '#E91E63',
      ge: '#4CAF50'
    };
  }

  // 1. 拆解四位數字為 萬、千、百、十、個
  decomposeNumber(num) {
    const clamped = Math.max(0, Math.min(10000, num));
    const wan = Math.floor(clamped / 10000);
    const remainder = clamped % 10000;
    const qian = Math.floor(remainder / 1000);
    const bai = Math.floor((remainder % 1000) / 100);
    const shi = Math.floor((remainder % 100) / 10);
    const ge = remainder % 10;

    return { total: clamped, wan, qian, bai, shi, ge };
  }

  // 2. 繪製單個立體積木元素的 HTML
  createBlockHtml(type) {
    if (type === 'qian') {
      return `<div class="cube-1000 block-pop-in" title="千位大方塊 (1000)"></div>`;
    } else if (type === 'bai') {
      return `<div class="flat-100 block-pop-in" title="百位平板 (100)">100</div>`;
    } else if (type === 'shi') {
      return `<div class="rod-10 block-pop-in" title="十位長條 (10)"></div>`;
    } else if (type === 'ge') {
      return `<div class="unit-1 block-pop-in" title="個位小顆粒 (1)"></div>`;
    }
    return '';
  }

  // 3. 渲染積木展示台
  renderBlocksStage(containerEl, num, prevNum = null) {
    if (!containerEl) return;
    const current = this.decomposeNumber(num);
    const prev = prevNum !== null ? this.decomposeNumber(prevNum) : null;

    // 清空並生成 4 欄展示區（千、百、十、個）
    containerEl.innerHTML = `
      <div class="block-column col-qian-stage ${prev && prev.qian !== current.qian ? 'changed' : ''}">
        <div class="block-col-header" style="color: #E65100;">
          <span>千位 (大金塊)</span>
          <span class="badge-count">${current.qian} 個 (${current.qian * 1000})</span>
        </div>
        <div class="block-display-area" id="block-area-qian">
          ${this.generateBlockList('qian', current.qian)}
        </div>
      </div>

      <div class="block-column col-bai-stage ${prev && prev.bai !== current.bai ? 'changed' : ''}">
        <div class="block-col-header" style="color: #0288D1;">
          <span>百位 (藍平板)</span>
          <span class="badge-count">${current.bai} 片 (${current.bai * 100})</span>
        </div>
        <div class="block-display-area" id="block-area-bai">
          ${this.generateBlockList('bai', current.bai)}
        </div>
      </div>

      <div class="block-column col-shi-stage ${prev && prev.shi !== current.shi ? 'changed' : ''}">
        <div class="block-col-header" style="color: #D81B60;">
          <span>十位 (粉長條)</span>
          <span class="badge-count">${current.shi} 條 (${current.shi * 10})</span>
        </div>
        <div class="block-display-area" id="block-area-shi">
          ${this.generateBlockList('shi', current.shi)}
        </div>
      </div>

      <div class="block-column col-ge-stage ${prev && prev.ge !== current.ge ? 'changed' : ''}">
        <div class="block-col-header" style="color: #2E7D32;">
          <span>個位 (綠小粒)</span>
          <span class="badge-count">${current.ge} 粒 (${current.ge})</span>
        </div>
        <div class="block-display-area" id="block-area-ge">
          ${this.generateBlockList('ge', current.ge)}
        </div>
      </div>
    `;

    // 播放音效
    if (window.soundEngine) {
      window.soundEngine.playPop();
    }
  }

  // 輔助生成積木堆疊
  generateBlockList(type, count) {
    if (count === 0) {
      return `<div style="color: #A0AEC0; font-size: 0.85rem; font-weight: 700; margin: auto;">(無積木)</div>`;
    }
    let html = '';
    for (let i = 0; i < count; i++) {
      html += this.createBlockHtml(type);
    }
    return html;
  }

  // 4. 更新定位板 (Place Value Board)
  updatePlaceValueBoard(boardEl, num, highlightCol = null) {
    if (!boardEl) return;
    const parts = this.decomposeNumber(num);

    const columns = [
      { id: 'wan', label: '萬位', val: parts.wan, unitText: parts.wan > 0 ? '10000' : '0' },
      { id: 'qian', label: '千位', val: parts.qian, unitText: `${parts.qian * 1000}` },
      { id: 'bai', label: '百位', val: parts.bai, unitText: `${parts.bai * 100}` },
      { id: 'shi', label: '十位', val: parts.shi, unitText: `${parts.shi * 10}` },
      { id: 'ge', label: '個位', val: parts.ge, unitText: `${parts.ge}` }
    ];

    boardEl.innerHTML = columns.map(col => `
      <div class="pv-column col-${col.id} ${highlightCol === col.id ? 'highlight-change' : ''}">
        <div class="pv-header">${col.label}</div>
        <div class="pv-digit">${col.val}</div>
        <div class="pv-subtext">${col.unitText}</div>
      </div>
    `).join('');
  }

  // 5. 產生兒童友善的進退位教學講解文字
  generateExplanationText(prevNum, currentNum, stepDiff) {
    const prev = this.decomposeNumber(prevNum);
    const curr = this.decomposeNumber(currentNum);

    if (stepDiff === 1) {
      if (prev.ge === 9) {
        return `🌟 <span class="highlight">逢九進位！</span>原本有 9 個綠小粒，加上 1 個變成 10 個小粒。10 個小粒聚光<span class="highlight">變身成 1 根粉紅十條</span>！所以個位歸 0，十位增加 1！`;
      }
      return `🌱 個位增加 1：綠色小積木從 <b>${prev.ge}</b> 個增加為 <b>${curr.ge}</b> 個。`;
    }

    if (stepDiff === 10) {
      if (prev.shi === 9) {
        return `🚀 <span class="highlight">十位逢九進位！</span>9 根粉紅十條再加 1 根變成 10 條，10 條合拼<span class="highlight">變身成 1 片百位藍平板</span>！十位歸 0，百位加 1！`;
      }
      return `🦘 十位增加 10：粉紅長條從 <b>${prev.shi}</b> 條增加為 <b>${curr.shi}</b> 條。`;
    }

    if (stepDiff === 100) {
      if (prev.bai === 9) {
        return `✨ <span class="highlight">百位跨千進位！</span>9 片藍平板再加 1 片變成 10 片，10 片組裝<span class="highlight">升級成 1 個千位大金塊</span>！百位歸 0，千位加 1！`;
      }
      return `🦅 百位增加 100：藍色平板從 <b>${prev.bai}</b> 片增加為 <b>${curr.bai}</b> 片。`;
    }

    if (stepDiff === 1000) {
      if (currentNum === 10000) {
        return `👑 <span class="highlight">太厲害了！滿一萬！</span>10 個千位大金塊合在一起，就是最大的 <span class="highlight">10000（讀作一萬）</span>！萬位亮起！`;
      }
      return `🚀 千位增加 1000：大金塊從 <b>${prev.qian}</b> 個增加為 <b>${curr.qian}</b> 個。`;
    }

    // 減法/拿走積木 (退位/借位)
    if (stepDiff === -1) {
      if (prev.ge === 0) {
        return `🔨 <span class="highlight">倒數退位拆解！</span>個位是 0 沒有小積木可拿，必須向十位借 1 根粉紅長條，拆開成 <span class="highlight">10 個綠小粒</span>！拿走 1 粒剩下 9 粒，十位少 1！`;
      }
      return `🍂 個位拿走 1：綠小粒減少 1，剩下 <b>${curr.ge}</b> 個。`;
    }

    if (stepDiff === -10) {
      if (prev.shi === 0) {
        return `🔨 <span class="highlight">十位跨百退位！</span>十位是 0，必須敲開百位 1 片藍平板，拆解成 <span class="highlight">10 根粉紅長條</span>！拿走 1 條後十位剩下 9 條，百位少 1！`;
      }
      return `🍂 十位拿走 10：粉紅長條減少 1 條，剩下 <b>${curr.shi}</b> 條。`;
    }

    if (stepDiff === -100) {
      if (prev.bai === 0) {
        return `🔨 <span class="highlight">百位跨千退位！</span>百位是 0（如 ${prevNum}），向千位借 1 個大金塊敲碎成 <span class="highlight">10 片藍平板</span>！拿走 1 片剩下 9 片，千位少 1！所以變成了 ${currentNum}！`;
      }
      return `🍂 百位拿走 100：藍色平板減少 1 片，剩下 <b>${curr.bai}</b> 片。`;
    }

    if (stepDiff === -1000) {
      return `🍂 千位拿走 1000：金色大方塊拿走 1 個，剩下 <b>${curr.qian}</b> 個。`;
    }

    return `數字從 <b>${prevNum}</b> 變成 <b>${currentNum}</b>。點擊上方喇叭可以聽發音喔！`;
  }

  // 6. 繪製微型積木圖示
  renderMiniBlocksHtml(type, count) {
    if (count === 0) {
      return `<span class="mini-empty-dash">0</span>`;
    }
    let html = '';
    for (let i = 0; i < count; i++) {
      if (type === 'qian') {
        html += `<span class="mini-cube-1000" title="1000">1k</span>`;
      } else if (type === 'bai') {
        html += `<span class="mini-flat-100" title="100">100</span>`;
      } else if (type === 'shi') {
        html += `<span class="mini-rod-10" title="10"></span>`;
      } else if (type === 'ge') {
        html += `<span class="mini-unit-1" title="1"></span>`;
      }
    }
    return html;
  }

  // 7. 產生單一數字的具體四欄 3D 積木展示 HTML
  renderBlockColumnsHtml(num, highlightPlace = null) {
    const parts = this.decomposeNumber(num);
    return `
      <div class="hint-block-grid">
        <div class="hint-col-box col-qian ${highlightPlace === 'qian' ? 'place-pulse' : ''}">
          <div class="hint-col-title" style="color: #E65100;">千位：${parts.qian}個</div>
          <div class="hint-col-cubes">${this.generateBlockList('qian', parts.qian)}</div>
        </div>
        <div class="hint-col-box col-bai ${highlightPlace === 'bai' ? 'place-pulse' : ''}">
          <div class="hint-col-title" style="color: #0288D1;">百位：${parts.bai}片</div>
          <div class="hint-col-cubes">${this.generateBlockList('bai', parts.bai)}</div>
        </div>
        <div class="hint-col-box col-shi ${highlightPlace === 'shi' ? 'place-pulse' : ''}">
          <div class="hint-col-title" style="color: #D81B60;">十位：${parts.shi}條</div>
          <div class="hint-col-cubes">${this.generateBlockList('shi', parts.shi)}</div>
        </div>
        <div class="hint-col-box col-ge ${highlightPlace === 'ge' ? 'place-pulse' : ''}">
          <div class="hint-col-title" style="color: #2E7D32;">個位：${parts.ge}粒</div>
          <div class="hint-col-cubes">${this.generateBlockList('ge', parts.ge)}</div>
        </div>
      </div>
    `;
  }

  // 8. 專門為數列小火車「積木透視小幫手」渲染具體積木圖示
  renderTrainHintBlocks(containerEl, q) {
    if (!containerEl || !q) return;

    const absStep = Math.abs(q.step);
    const changedPlace = absStep === 1 ? 'ge' : absStep === 10 ? 'shi' : absStep === 100 ? 'bai' : 'qian';
    const placeName = absStep === 1 ? '個位 (綠小粒 1)' :
                      absStep === 10 ? '十位 (粉長條 10)' :
                      absStep === 100 ? '百位 (藍平板 100)' : '千位 (大金塊 1000)';
    const dirText = q.step > 0 ? '每次增加' : '每次減少';

    // 取得完整數列（將問號補上正確答案）
    const fullSequence = q.sequence.map((n, i) => (i === q.missingIndex ? q.answer : n));

    // 找出問號前一節車廂（若問號在第0節則取後一節）
    let fromNum, toNum, fromLabel, toLabel;
    if (q.missingIndex > 0) {
      fromNum = fullSequence[q.missingIndex - 1];
      toNum = q.answer;
      fromLabel = `車廂 ${q.missingIndex} (${fromNum})`;
      toLabel = `問號車廂 ${q.missingIndex + 1} (${toNum})`;
    } else {
      fromNum = q.answer;
      toNum = fullSequence[1];
      fromLabel = `問號車廂 1 (${fromNum})`;
      toLabel = `車廂 2 (${toNum})`;
    }

    // 產生 5 節車廂的微型積木圖示卡
    const carsCardsHtml = fullSequence.map((val, idx) => {
      const isTarget = idx === q.missingIndex;
      const parts = this.decomposeNumber(val);
      return `
        <div class="hint-car-card ${isTarget ? 'is-target' : ''}">
          <div class="hint-car-badge ${isTarget ? 'target-badge' : ''}">
            ${isTarget ? '🎯 答案車廂' : `第 ${idx + 1} 節`}
          </div>
          <div class="hint-car-num ${isTarget ? 'target-num' : ''}">${val}</div>
          <div class="hint-car-blocks-list">
            <div class="mini-block-row ${changedPlace === 'qian' ? 'highlight-place' : ''}">
              <span class="mini-col-tag qian">千</span>
              <div class="mini-blocks-pack">${this.renderMiniBlocksHtml('qian', parts.qian)}</div>
              <span class="mini-count">(${parts.qian})</span>
            </div>
            <div class="mini-block-row ${changedPlace === 'bai' ? 'highlight-place' : ''}">
              <span class="mini-col-tag bai">百</span>
              <div class="mini-blocks-pack">${this.renderMiniBlocksHtml('bai', parts.bai)}</div>
              <span class="mini-count">(${parts.bai})</span>
            </div>
            <div class="mini-block-row ${changedPlace === 'shi' ? 'highlight-place' : ''}">
              <span class="mini-col-tag shi">十</span>
              <div class="mini-blocks-pack">${this.renderMiniBlocksHtml('shi', parts.shi)}</div>
              <span class="mini-count">(${parts.shi})</span>
            </div>
            <div class="mini-block-row ${changedPlace === 'ge' ? 'highlight-place' : ''}">
              <span class="mini-col-tag ge">個</span>
              <div class="mini-blocks-pack">${this.renderMiniBlocksHtml('ge', parts.ge)}</div>
              <span class="mini-count">(${parts.ge})</span>
            </div>
          </div>
        </div>
      `;
    }).join('');

    // 渲染進退位具體積木對照台
    const transitionExplanation = this.generateExplanationText(fromNum, toNum, q.step);

    containerEl.innerHTML = `
      <!-- 車長透視文字報告 -->
      <div class="hint-text-header">
        <p style="font-size: 1.05rem; font-weight: 800; color: #2E7D32;">
          🔍 <b>車長嘟嘟熊的透視報告：</b>
        </p>
        <p style="margin: 6px 0; font-size: 1rem; color: #1B5E20;">
          這列火車的車廂規律是：<b>${dirText} ${absStep}</b>！變動的是「<b>${placeName}</b>」。
        </p>
        <p style="color: #558B2F; margin-bottom: 12px; font-weight: 700;">
          ${q.explanation}
        </p>
      </div>

      <!-- 區塊一：5 節車廂積木圖示軸 -->
      <div class="hint-section-title">
        <span>🚂 整列火車車廂積木透視圖（比一比哪一位在變動）：</span>
      </div>
      <div class="hint-cars-scroll-wrap">
        ${carsCardsHtml}
      </div>

      <!-- 區塊二：關鍵進退位積木大特寫對照台 -->
      <div class="hint-section-title" style="margin-top: 16px;">
        <span>🔬 關鍵進退位積木放大鏡（看見積木數量變化）：</span>
      </div>
      <div class="hint-transform-stage">
        <!-- 左：前一節車廂積木 -->
        <div class="hint-stage-box">
          <div class="hint-box-title" style="color: #2B6CB0;">
            ${fromLabel}
          </div>
          ${this.renderBlockColumnsHtml(fromNum, changedPlace)}
        </div>

        <!-- 中：變化箭頭與規則 -->
        <div class="hint-stage-center">
          <div class="hint-rule-pill ${q.step > 0 ? 'rule-add' : 'rule-sub'}">
            ${q.step > 0 ? '＋' : '－'} ${absStep}
          </div>
          <div class="hint-arrow-icon">➔</div>
          <div class="hint-rule-subtext">
            ${q.step > 0 ? '加入積木' : '拿走積木'}
          </div>
        </div>

        <!-- 右：目標答案車廂積木 -->
        <div class="hint-stage-box target-box">
          <div class="hint-box-title" style="color: #E65100;">
            ${toLabel}
          </div>
          ${this.renderBlockColumnsHtml(toNum, changedPlace)}
        </div>
      </div>

      <!-- 下方小結 -->
      <div class="hint-summary-banner">
        💡 <b>積木變化小結：</b> ${transitionExplanation}
      </div>
    `;
  }
}

// 實例化全域積木引擎
window.blockEngine = new BlockEngine();
