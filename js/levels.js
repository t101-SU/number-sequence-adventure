/**
 * 🚂 數字小火車與積木島：數列大冒險 - levels.js
 * 國小三年級數學課本（康軒/南一/翰林版 1-1 數到10000）題庫與動態題目生成器
 */

const SEQUENCE_LEVELS = [
  {
    id: 1,
    name: '小蝸牛散步',
    badge: '🐌',
    description: '+1 與 -1 個位數列（包含逢九進位與跨十退位）',
    ruleHint: '觀察最後面的「個位數」每次增加 1 還是減少 1！注意：遇到 9 會進位變成 0，前一位加 1 喔！',
    questions: [
      {
        title: '課本第 5 題：漁船賣出飛魚（+1）',
        sequence: [3000, 3001, 3002, null, 3004],
        missingIndex: 3,
        step: 1,
        options: [3003, 3013, 3005, 3103],
        answer: 3003,
        explanation: '3000 -> 3001 -> 3002，每次都 +1，所以 3002 + 1 = 3003！'
      },
      {
        title: '課本經典題：逢九進位大挑戰（+1）',
        sequence: [3008, 3009, null, 3011, 3012],
        missingIndex: 2,
        step: 1,
        options: [3010, 30010, 3020, 3100],
        answer: 3010,
        explanation: '3009 再加 1，個位 9 滿十進位！十位變成 1，個位變成 0，合起來是 3010（讀作三千零一十）。'
      },
      {
        title: '課本做做看第 1 題：連續進位填空（+1）',
        sequence: [3027, 3028, 3029, null, 3031],
        missingIndex: 3,
        step: 1,
        options: [3030, 30210, 3040, 3020],
        answer: 3030,
        explanation: '3029 + 1 = 3030！個位 9 進到十位，2 個十變成 3 個十。'
      },
      {
        title: '課本第 7 題：拿走 1 個積木（-1）',
        sequence: [4213, 4212, 4211, 4210, null],
        missingIndex: 4,
        step: -1,
        options: [4209, 4200, 4219, 4109],
        answer: 4209,
        explanation: '4210 拿走 1，個位沒有積木，向十位借 1 條拆成 10 粒，拿走 1 粒剩 9 粒，所以是 4209！'
      },
      {
        title: '課本做做看第 3 題：倒數填空（-1）',
        sequence: [3811, 3810, null, 3808, 3807],
        missingIndex: 2,
        step: -1,
        options: [3809, 3800, 3819, 3709],
        answer: 3809,
        explanation: '3810 - 1 = 3809！每次向後倒數 1 步。'
      }
    ]
  },

  {
    id: 2,
    name: '袋鼠跳十步',
    badge: '🦘',
    description: '+10 與 -10 十位數列（逢九十進位與跨百退位）',
    ruleHint: '觀察「十位數」每次跳 10！注意：90 加 10 會進位變成整百，百位會加 1 喔！',
    questions: [
      {
        title: '課本第 5 題：飛魚成批賣出（+10）',
        sequence: [3390, 3400, null, 3420, 3430],
        missingIndex: 2,
        step: 10,
        options: [3410, 3401, 3500, 3310],
        answer: 3410,
        explanation: '3390 -> 3400，十位每次 +10，3400 + 10 = 3410（讀作三千四百一十）。'
      },
      {
        title: '課本挑戰：連環進位到整千（+10）',
        sequence: [4980, 4990, null, 5010, 5020],
        missingIndex: 2,
        step: 10,
        options: [5000, 49100, 5090, 5100],
        answer: 5000,
        explanation: '4990 再加 10，90 變 100 進位到百，百位 9 百又滿 10 進位到千，千位 4 加 1 變成 5000！'
      },
      {
        title: '課本做做看第 2 題：十位跳躍（+10）',
        sequence: [4951, 4961, null, 4981, 4991],
        missingIndex: 2,
        step: 10,
        options: [4971, 4962, 5051, 4991],
        answer: 4971,
        explanation: '十位數從 5 -> 6 -> 7，所以是 4971！'
      },
      {
        title: '課本第 7 題：拿走 10 的積木（-10）',
        sequence: [4213, 4203, null, 4183, 4173],
        missingIndex: 2,
        step: -10,
        options: [4193, 4293, 4103, 4093],
        answer: 4193,
        explanation: '4203 拿走 10，十位是 0 向百位借 1 片拆成 10 條，扣掉 1 條剩 9 條，所以是 4193！'
      },
      {
        title: '倒數十步挑戰（-10）',
        sequence: [5020, 5010, null, 4990, 4980],
        missingIndex: 2,
        step: -10,
        options: [5000, 5009, 4900, 5100],
        answer: 5000,
        explanation: '5010 - 10 = 5000，整千退位前一步！'
      }
    ]
  },

  {
    id: 3,
    name: '老鷹百米飛',
    badge: '🦅',
    description: '+100 與 -100 百位數列（跨千進位與跨千退位大魔王）',
    ruleHint: '觀察「百位數」！當百位是 9 再加 100，就會進到千位（如 1935 變成 2035）；退位時千位會少 1、百位變 9！',
    questions: [
      {
        title: '課本第 6 題：動物園入園人數（+100）',
        sequence: [1735, 1835, null, 2035, 2135],
        missingIndex: 2,
        step: 100,
        options: [1935, 1845, 2035, 1745],
        answer: 1935,
        explanation: '1735 -> 1835，百位每次加 1 片平板（+100），所以是 1935！'
      },
      {
        title: '課本第 6 題延伸：再進場 100 人跨千位（+100）',
        sequence: [1835, 1935, null, 2135, 2235],
        missingIndex: 2,
        step: 100,
        options: [2035, 1945, 2105, 3035],
        answer: 2035,
        explanation: '1935 + 100 = 2035！9 個百加 1 個百等於 1 個千，千位 1 變成 2，百位歸 0！'
      },
      {
        title: '課本做做看第 3 題：百位連續跳躍（+100）',
        sequence: [6605, 6705, null, 6905, 7005],
        missingIndex: 2,
        step: 100,
        options: [6805, 6715, 6905, 7705],
        answer: 6805,
        explanation: '6605 -> 6705 -> 6805 -> 6905 -> 7005，每次百位加 100！'
      },
      {
        title: '課本第 7 題：拿走 100 的積木（-100）',
        sequence: [4213, 4113, 4013, null, 3813],
        missingIndex: 3,
        step: -100,
        options: [3913, 4003, 3013, 4913],
        answer: 3913,
        explanation: '4013 - 100 = 3913！百位是 0，敲碎千位 1 個大金塊變 10 片，拿走 1 片剩下 9 片，千位 4 變成 3！'
      },
      {
        title: '課本做做看第 2 題：跨千退位大考驗（-100）',
        sequence: [7105, 7005, null, 6805, 6705],
        missingIndex: 2,
        step: -100,
        options: [6905, 6005, 7905, 6095],
        answer: 6905,
        explanation: '7005 拿走 100 = 6905！千位 7 個大金塊借出 1 個，剩下 6 個千，百位變成 9 個百！'
      }
    ]
  },

  {
    id: 4,
    name: '火箭千里行',
    badge: '🚀',
    description: '+1000 與 -1000 千位數列（滿十個千合為一萬！）',
    ruleHint: '觀察最前面的「千位大金塊」！10 個千合起來就是 10000（讀作一萬）！',
    questions: [
      {
        title: '課本第 3 題：飛魚成千賣出（+1000）',
        sequence: [1000, 2000, 3000, null, 5000],
        missingIndex: 3,
        step: 1000,
        options: [4000, 3100, 400, 3010],
        answer: 4000,
        explanation: '1000 -> 2000 -> 3000，每次多 1 個千塊，3000 + 1000 = 4000（讀作四千）。'
      },
      {
        title: '課本第 2 題：衝刺一萬大關（+1000）',
        sequence: [6000, 7000, 8000, 9000, null],
        missingIndex: 4,
        step: 1000,
        options: [10000, 9100, 9010, 1000],
        answer: 10000,
        explanation: '9000 再加 1000 是 10 個千，合起來是 10000，讀作「一萬」！'
      },
      {
        title: '課本第 7 題：拿走 1000 的積木（-1000）',
        sequence: [4213, 3213, null, 1213, 213],
        missingIndex: 2,
        step: -1000,
        options: [2213, 3113, 2113, 3203],
        answer: 2213,
        explanation: '千位從 4 -> 3 -> 2 -> 1，拿走 1000，所以是 2213！'
      },
      {
        title: '課本做做看第 1 題：千里倒數（-1000）',
        sequence: [8965, 7965, null, 5965, 4965],
        missingIndex: 2,
        step: -1000,
        options: [6965, 6865, 7865, 5865],
        answer: 6965,
        explanation: '8965 -> 7965 -> 6965，千位每次減少 1000！'
      }
    ]
  },

  {
    id: 5,
    name: '全能火車長',
    badge: '👑',
    description: '綜合混合挑戰（+1, +10, +100, +1000 隨機出題，檢驗全能數感）',
    ruleHint: '全能大考驗！先比較相鄰兩個數字，看是哪一位（千、百、十、個）在變動，推算規則！',
    questions: [] // 題目將動態即時生成
  }
];

// 動態題目產生器
class QuestionGenerator {
  static generateRandomQuestion(levelId = 5) {
    const stepChoices = [1, -1, 10, -10, 100, -100, 1000, -1000];
    const step = stepChoices[Math.floor(Math.random() * stepChoices.length)];

    let start;
    if (step === 1) start = Math.floor(Math.random() * 8000) + 1000;
    else if (step === -1) start = Math.floor(Math.random() * 8000) + 1020;
    else if (step === 10) start = Math.floor(Math.random() * 80) * 100 + 1950;
    else if (step === -10) start = Math.floor(Math.random() * 80) * 100 + 2030;
    else if (step === 100) start = Math.floor(Math.random() * 8) * 1000 + 1750;
    else if (step === -100) start = Math.floor(Math.random() * 8) * 1000 + 2050;
    else if (step === 1000) start = Math.floor(Math.random() * 5) * 1000 + 1200;
    else start = Math.floor(Math.random() * 4) * 1000 + 5500;

    const sequence = [
      start,
      start + step,
      start + step * 2,
      start + step * 3,
      start + step * 4
    ];

    const missingIndex = Math.floor(Math.random() * 3) + 1; // 1, 2, 3
    const answer = sequence[missingIndex];
    sequence[missingIndex] = null;

    // 產生 3 個具迷惑性的干擾選項
    const fakeDistractors = [
      answer + (step > 0 ? 10 : -10),
      answer + (step > 0 ? 1 : -1),
      answer + (step > 0 ? 100 : -100),
      answer + step * 2,
      answer - step
    ].filter(n => n > 0 && n <= 10000 && n !== answer);

    const shuffledDistractors = fakeDistractors.sort(() => 0.5 - Math.random()).slice(0, 3);
    const options = [answer, ...shuffledDistractors].sort(() => 0.5 - Math.random());

    let absStep = Math.abs(step);
    let stepName = absStep === 1 ? '個位 (1)' : absStep === 10 ? '十位 (10)' : absStep === 100 ? '百位 (100)' : '千位 (1000)';
    let dir = step > 0 ? '增加' : '減少';

    return {
      title: `全能綜合題：${dir} ${absStep}`,
      sequence,
      missingIndex,
      step,
      options,
      answer,
      explanation: `觀察相鄰的數字，可以發現每次都「${dir} ${absStep}」（變動的是${stepName}）。所以問號是 ${answer}！`
    };
  }
}

// 模式三：進退位魔術箱精選關鍵臨界題
const MAGIC_BREAKTHROUGH_CASES = [
  {
    id: 'c1',
    label: '3009 + 1 (逢九進位)',
    start: 3009,
    step: 1,
    target: 3010,
    type: 'bundle',
    unitName: '個位綠小粒',
    higherName: '十位粉長條',
    story: '原本有 9 粒小積木，加上第 10 粒！滿 10 個個位，點擊魔法杖合體成 1 根十條！'
  },
  {
    id: 'c2',
    label: '4990 + 10 (連鎖進位到5000)',
    start: 4990,
    step: 10,
    target: 5000,
    type: 'bundle',
    unitName: '十位粉長條',
    higherName: '百位藍平板與千位大金塊',
    story: '4990 再加 10，十位滿 10 進到百位，百位滿 10 又進到千位！直接升級成 5000！'
  },
  {
    id: 'c3',
    label: '1935 + 100 (九百跨千進位)',
    start: 1935,
    step: 100,
    target: 2035,
    type: 'bundle',
    unitName: '百位藍平板',
    higherName: '千位大金塊',
    story: '1935 再加 100，9 片藍平板加上 1 片變 10 片，合體成 1 個金色千位大方塊！千位變成 2，百位歸 0！'
  },
  {
    id: 'c4',
    label: '9000 + 1000 (衝刺一萬)',
    start: 9000,
    step: 1000,
    target: 10000,
    type: 'bundle',
    unitName: '千位大金塊',
    higherName: '萬位紫晶石',
    story: '9 個千再加 1 個千，就是 10 個千！10 個千合起來就是 10000（讀作一萬）！'
  },
  {
    id: 'c5',
    label: '3810 - 1 (跨十退位)',
    start: 3810,
    step: -1,
    target: 3809,
    type: 'unbundle',
    unitName: '十位粉長條',
    higherName: '個位綠小粒',
    story: '個位是 0 拿不走 1，點擊魔法敲敲槌把 1 根十位長條敲碎成 10 粒，拿走 1 粒剩 9 粒！變成 3809！'
  },
  {
    id: 'c6',
    label: '4013 - 100 (跨千退位拆大金塊)',
    start: 4013,
    step: -100,
    target: 3913,
    type: 'unbundle',
    unitName: '千位大金塊',
    higherName: '百位藍平板',
    story: '百位是 0 沒有平板可拿，用魔法槌敲開 1 個大金塊，爆出 10 片藍平板！拿走 1 片剩 9 片，千位剩 3 個！'
  },
  {
    id: 'c7',
    label: '7005 - 100 (跨零退位魔王題)',
    start: 7005,
    step: -100,
    target: 6905,
    type: 'unbundle',
    unitName: '千位大金塊',
    higherName: '百位藍平板',
    story: '7005 - 100，千位 7 拿走 1 個金塊敲碎成 10 片百，扣掉 1 片剩 9 片，千位變 6！所以是 6905！'
  }
];

window.SEQUENCE_LEVELS = SEQUENCE_LEVELS;
window.QuestionGenerator = QuestionGenerator;
window.MAGIC_BREAKTHROUGH_CASES = MAGIC_BREAKTHROUGH_CASES;
