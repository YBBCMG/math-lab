/* ============================================================
   示范题 3 · (a+b)² = a² + 2ab + b²
   解法一：正方形切成四块再拼
   解法二：横着分两层，用乘法分配律读
   ============================================================ */
(function () {
  var INK = '#16202f';
  var BLUE = '#0f5ef7', ORNG = '#f97316', GREEN = '#00a86b';

  var a = 240, b = 150;
  var S = a + b;                 // 390
  var X = 255, Y = 66;           // 左上角
  var XS = X + a;                // 竖切线 = 495
  var YS = Y + a;                // 横切线 = 306
  var X1 = X + S, Y1 = Y + S;    // 右下角 = 645, 456

  function big() {
    return { id: 'big', k: 'rect', x: X, y: Y, w: S, h: S, fill: '#d6e4ff', stroke: INK, sw: 3 };
  }
  function edgeLabels() {
    return [
      // 四条边的分段标注：a 段用蓝、b 段用橙，和下面切的块一一对应
      { id: 'segAT', k: 'text', at: [X + a / 2, Y - 16], text: 'a', size: 16, fill: BLUE },
      { id: 'segBT', k: 'text', at: [XS + b / 2, Y - 16], text: 'b', size: 16, fill: ORNG },
      { id: 'segAL', k: 'text', at: [X - 20, Y + a / 2], text: 'a', size: 16, fill: BLUE },
      { id: 'segBL', k: 'text', at: [X - 20, YS + b / 2], text: 'b', size: 16, fill: ORNG },
      { id: 'lbB', k: 'text', at: [(X + X1) / 2, Y1 + 32], text: 'a + b', size: 18, fill: INK },
      // 竖边的总长「a + b」不再单独标：它左右各有 a、b 两个分段标签，串成一行会被读成
      // 「a 段的高是 a + b」（视觉复盘连提两轮）。总长只留底边那一个 a + b，左竖边只讲分段。
      // 要恢复就加一条括线，别只是把字挪远。
    ];
  }

  /* ---------- 解法一：四块拼图 ---------- */

  var m1 = [
    {
      say: '一个正方形的边长是 a + b。它的面积就是 (a + b)²。',
      cite: '正方形面积 = 边长 × 边长',
      why: '正方形面积 = 边长 × 边长，这里边长是 (a+b)，所以写成 (a+b)²。',
      add: [big()].concat(edgeLabels()),
      eq: 'S = (a + b)²'
    },
    {
      say: '在距离左边 a 的地方，竖着切一刀。',
      cite: '线段可分成 a 与 b 两段，a + b 就是整条边',
      why: '这一刀把「宽」分成 a 和 b 两段，正好对应边长相加的两部分。',
      add: [{ id: 'cutV', k: 'line', a: [XS, Y], b: [XS, Y1], stroke: ORNG, sw: 2, dash: [8, 6] }]
    },
    {
      say: '再在距离上边 a 的地方，横着切一刀。',
      cite: '两刀一横一竖，把正方形分成四块，互不重叠',
      why: '两刀一横一竖，正方形就被切成了四小块——多一块都切不出来。',
      add: [{ id: 'cutH', k: 'line', a: [X, YS], b: [X1, YS], stroke: ORNG, sw: 2, dash: [8, 6] }]
    },
    {
      say: '四块出来了。先把左上那块大的单独拎出来。',
      cite: '正方形面积 = 边长²，这里边长是 a',
      why: '它的边长是 a，所以面积是 a²。',
      add: [
        { id: 'q1', k: 'rect', x: X, y: Y, w: a, h: a, fill: BLUE, stroke: BLUE, sw: 2, op: 0.72 },
        { id: 't1', k: 'text', at: [X + a / 2, Y + a / 2], text: 'a²', size: 26, fill: BLUE }
      ],
      eq: 'a²'
    },
    {
      say: '右上那块：长是 b，宽是 a，面积是 ab。',
      cite: '长方形面积 = 长 × 宽',
      why: '长方形的面积就是长乘宽。',
      add: [
        { id: 'q2', k: 'rect', x: XS, y: Y, w: b, h: a, fill: ORNG, stroke: ORNG, sw: 2, op: 0.72 },
        { id: 't2', k: 'text', at: [XS + b / 2, Y + a / 2], text: 'ab', size: 22, fill: ORNG }
      ],
      eq: 'a² + ab'
    },
    {
      say: '左下那块：长是 a，宽是 b，面积也是 ab。',
      cite: '长方形面积 = 长 × 宽（两个因数互换，面积不变）',
      why: '右上和左下这两个 ab 一样大——一个横过来，一个竖起来。',
      add: [
        { id: 'q3', k: 'rect', x: X, y: YS, w: a, h: b, fill: ORNG, stroke: ORNG, sw: 2, op: 0.72 },
        { id: 't3', k: 'text', at: [X + a / 2, YS + b / 2], text: 'ab', size: 22, fill: ORNG }
      ],
      eq: 'a² + ab + ab'
    },
    {
      say: '右下那块最小：边长是 b，面积是 b²。',
      cite: '正方形面积 = 边长²，这里边长是 b',
      why: '它是正方形而不是长方形，因为两条边都是 b。',
      add: [
        { id: 'q4', k: 'rect', x: XS, y: YS, w: b, h: b, fill: GREEN, stroke: GREEN, sw: 2, op: 0.72 },
        { id: 't4', k: 'text', at: [XS + b / 2, YS + b / 2], text: 'b²', size: 22, fill: GREEN }
      ],
      eq: 'a² + 2ab + b²'
    },
    {
      say: '四块拼起来就是整个正方形，一块不多、一块不少。',
      cite: '面积可加性：四块互不重叠，合起来正好是整个正方形',
      why: '所以面积可以直接加起来，不用真的去乘。',
      upd: [
        { id: 'big', fill: 'none', stroke: INK, sw: 3 },
        { id: 'q1', op: 0.72 }, { id: 'q2', op: 0.72 },
        { id: 'q3', op: 0.72 }, { id: 'q4', op: 0.72 }
      ],
      eq: '(a + b)² = a² + 2ab + b²'
    },
    {
      say: '这就是完全平方公式。中间那个 2ab，就是两块一样大的 ab 合起来的。',
      cite: '合并同类项：ab + ab = 2ab',
      why: '很多人会漏掉 2ab——因为它藏在图里，是两块而不是一块。注意：这张图默认 a、b 都是正数；负数、字母的情形，由方法二的分配律保证。',
      eq: '(a + b)² = a² + 2ab + b²',
      hold: 3200
    }
  ];

  /* ---------- 解法二：横着分两层（分配律） ---------- */

  var m2 = [
    {
      say: '同一个正方形，换一种看法。',
      cite: '同一个图形面积唯一，换一种分法不影响结果',
      why: '面积没变，只是「怎么分块看」变了——这正是代数里分配律的样子。',
      add: [big()].concat(edgeLabels())
    },
    {
      say: '正方形的面积 = 边长 × 边长，也就是 (a + b) × (a + b)。',
      cite: '正方形面积公式',
      why: '这也是为什么它写成平方——同一个因数自己乘自己。',
      eq: '(a + b) × (a + b)'
    },
    {
      say: '先把高度切成两段：上面一段是 a，下面一段是 b。',
      cite: '线段可分成 a + b 两段',
      why: '切成两层，每一层都还是一条完整的、长为 (a+b) 的长方形。',
      // 这一步只横切一刀，图上还没有竖线：顶边原来那两个「a | b」标签指的是一条不存在的分界
      // （视觉复核原话：「标了 a、b 两段，却没有任何竖直分割线」），一并撤掉，等到第 7 步画竖线时再放回来。
      // 左竖边同理：旧的 segAL/segBL 由下面两条新标签接手，不撤就是两个字母差 6px 叠着画。
      delNow: ['segAL', 'segBL', 'segAT', 'segBT'],
      add: [
        { id: 'stripA', k: 'rect', x: X, y: Y, w: S, h: a, fill: BLUE, stroke: BLUE, sw: 2, op: 0.42 },
        { id: 'stripB', k: 'rect', x: X, y: YS, w: S, h: b, fill: GREEN, stroke: GREEN, sw: 2, op: 0.42 },
        { id: 'lblSA', k: 'text', at: [X - 26, Y + a / 2], text: 'a', size: 16, fill: BLUE },
        { id: 'lblSB', k: 'text', at: [X - 26, YS + b / 2], text: 'b', size: 16, fill: GREEN }
      ]
    },
    {
      say: '上面这一层：宽 a，长 (a+b)，面积是 a × (a+b)。',
      cite: '长方形面积 = 长 × 宽',
      why: '长方形面积 = 长 × 宽，这里长是整条 (a+b)，宽只是上面那一段 a。',
      eq: 'a × (a+b) = a² + ab'
    },
    {
      say: '下面这一层：宽 b，长还是 (a+b)，面积是 b × (a+b)。',
      cite: '长方形面积 = 长 × 宽',
      why: '两层加起来，就是 (a+b) 个 (a+b)——这正是 (a+b)² 的意思。',
      eq: 'b × (a+b) = ab + b²'
    },
    {
      say: '两层加起来，就是 (a+b) 个 (a+b)。',
      cite: '乘法分配律：(a+b)(a+b) = a(a+b) + b(a+b)',
      why: '这正是乘法分配律：(a+b)(a+b) = a(a+b) + b(a+b)。',
      eq: '(a+b)² = a(a+b) + b(a+b)'
    },
    {
      say: '拆开一算，还是那四块。',
      cite: '分配律展开：a(a+b) + b(a+b) = a² + ab + ab + b²',
      why: '两种切法的落点一模一样：都是那四块，谁也逃不掉一个 ab。',
      eq: '(a+b)² = a² + ab + ab + b²',
      add: [
        { id: 'cutV', k: 'line', a: [XS, Y], b: [XS, Y1], stroke: ORNG, sw: 2, dash: [8, 6] },
        // 竖线出来了，顶边的 a | b 这时才有对应的分界
        { id: 'segAT', k: 'text', at: [X + a / 2, Y - 16], text: 'a', size: 16, fill: BLUE },
        { id: 'segBT', k: 'text', at: [XS + b / 2, Y - 16], text: 'b', size: 16, fill: ORNG }
      ]
    },
    {
      say: '合并同类项，得到同一个结果。',
      cite: '合并同类项：ab + ab = 2ab',
      why: 'ab 出现了两次，合并写作 2ab——这就是公式里那个 2 的来历。',
      eq: '(a + b)² = a² + 2ab + b²',
      hold: 3200
    }
  ];

  window.MATHLAB_LESSONS = window.MATHLAB_LESSONS || [];
  window.MATHLAB_LESSONS.push({
    id: 'perfect-square',
    title: '完全平方公式 (a+b)² 为什么多出一个 2ab',
    grade: '初二',
    topic: '代数 · 乘法公式',
    tags: ['代数', '公式', '面积模型'],
    question: '展开 (a + b)²，为什么等于 a² + 2ab + b²，而不是 a² + b²？',
    thumbStep: 7,
    methods: [
      {
        name: '切成四块拼', tier: 'proof',
        sub: '证明 · 面积可加（a、b 为正时）',
        steps: m1
      },
      {
        name: '横着分两层', tier: 'proof',
        sub: '证明 · 乘法分配律，对一切实数成立',
        steps: m2
      }
    ]
  });
})();
