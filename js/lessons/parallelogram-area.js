/* ============================================================
   示范题 2 · 平行四边形面积 = 底 × 高
   解法一：沿高剪一刀，平移补成长方形
   解法二：拆成三角形 + 梯形，各算各的
   ============================================================ */
(function () {
  var G = ML;
  var INK = '#16202f';
  var BLUE = '#0f5ef7', ORNG = '#f97316', GREEN = '#00a86b';

  /* 平行四边形：底 360，高 180 */
  var A = [200, 360];
  var B = [560, 360];
  var C = [700, 180];
  var D = [340, 180];
  var E = [340, 360];          // 高与底边的交点

  var BASE = B[0] - A[0];      // 底 = 360
  var HGT  = A[1] - D[1];      // 高 = 180
  var SHIFT = [B[0] - A[0], 0];  // 平移向量 = AB

  var FILL_MAIN = '#d6e4ff';

  /* ---------- 两块（用两块拼成平行四边形，接缝就是高） ---------- */

  function trapezoid() {
    // 切完留下的梯形：E B C D
    return { id: 'trap', k: 'poly', pts: [E, B, C, D], fill: FILL_MAIN, stroke: INK, sw: 2.5 };
  }
  function triangle() {
    // 左侧直角三角形：A D E
    return { id: 'tn', k: 'poly', pts: [A, D, E], fill: FILL_MAIN, stroke: INK, sw: 2.5 };
  }
  function names() {
    return [
      { id: 'nA', k: 'text', at: [A[0] - 24, A[1] + 20], text: 'A', size: 19, fill: INK },
      { id: 'nB', k: 'text', at: [B[0] + 6, B[1] + 30], text: 'B', size: 19, fill: INK },
      { id: 'nC', k: 'text', at: [C[0] + 22, C[1] - 10], text: 'C', size: 19, fill: INK },
      { id: 'nD', k: 'text', at: [D[0] - 24, D[1] - 10], text: 'D', size: 19, fill: INK }
    ];
  }

  var m1 = [
    {
      say: '这是一个平行四边形。它的对边平行，而且相等。',
      cite: '平行四边形的定义：两组对边分别平行；性质：对边相等',
      why: '对边平行且相等，后面那一刀能整块搬过去，全靠它。',
      add: [trapezoid(), triangle()].concat(names())
    },
    {
      say: '先认清它的底：取 AB 这一条边，记作 a。',
      cite: '底：任意一条边都可以当底',
      why: '算面积要选一条边当底，通常选下面这条水平的边，量起来最方便。',
      add: [
        { id: 'baseHi', k: 'line', a: A, b: B, stroke: BLUE, sw: 5 },
        { id: 'lblA', k: 'text', at: [(A[0] + B[0]) / 2, A[1] + 34], text: '底 a', size: 17, fill: BLUE }
      ]
    },
    {
      say: '再从 D 向底边作一条垂线，交点记作 E。DE 就是它的高，记作 h。',
      cite: '高：两条平行线之间的距离（垂线段长度）',
      why: '高必须垂直于底——面积公式里的 h 就是这个距离。',
      add: [
        { id: 'hHi', k: 'line', a: D, b: E, stroke: GREEN, sw: 4 },
        { id: 'nE', k: 'text', at: [E[0] - 20, E[1] + 20], text: 'E', size: 19, fill: INK },
        { id: 'sq', k: 'poly', pts: [E, [E[0] + 22, E[1]], [E[0] + 22, E[1] - 22], [E[0], E[1] - 22]],
          fill: 'none', stroke: GREEN, sw: 2 },
        { id: 'lblH', k: 'text', at: [D[0] - 28, (D[1] + E[1]) / 2], text: '高 h', size: 17, fill: GREEN }
      ]
    },
    {
      say: '现在盯着左边这块直角三角形 ADE。',
      cite: '待处理对象：直角三角形 ADE',
      why: '面积不确定，就是因为它斜着。斜的东西不好算，正方形才好算。',
      upd: [{ id: 'tn', fill: '#b9d3ff' }]
    },
    {
      say: '沿着高 DE 剪一刀——平行四边形被分成一个三角形和一个梯形。',
      cite: '分割：两块内部互不重叠，合起来是整个图形',
      why: '剪开只是把图形分开，总面积一寸都没变。',
      upd: [{ id: 'tn', fill: BLUE, op: 0.85, move: [-22, -18] }]
    },
    {
      say: '把这块三角形整体平移，补到右边缺的那一块上去。',
      cite: '平移不改变图形的形状和大小（合同变换保面积）',
      why: '平移不改变形状和大小，所以面积还是原来的面积。',
      upd: [{ id: 'tn', move: SHIFT }]
    },
    {
      say: '补上了。现在这两块合在一起，是一个……长方形。',
      cite: '平移后三角形的斜边与原边重合，DE 垂直于底边 ⇒ 四个角都是直角',
      why: '右边缺的那个角，正好被搬来的三角形填满，四条边都成了直角。',
      upd: [
        { id: 'nA', op: 0 }, { id: 'nB', op: 0 },
        { id: 'lblA', op: 0 }, { id: 'baseHi', op: 0 }
      ],
      add: [{ id: 'rect', k: 'rect', x: D[0], y: D[1], w: 700 - D[0], h: 360 - D[1],
              fill: 'none', stroke: ORNG, sw: 3.5, dash: [9, 7] }]
    },
    {
      say: '量一量：长正好等于原来的底 a，宽正好等于原来的高 h。',
      cite: '长方形面积 = 长 × 宽',
      why: '剪和移都没有增减任何一块，所以面积从头到尾没变过。',
      add: [
        { id: 'lblW', k: 'text', at: [(D[0] + 700) / 2, 360 + 34], text: '长 = a', size: 17, fill: ORNG },
        { id: 'lblH2', k: 'text', at: [700 + 62, (D[1] + 360) / 2], text: '宽 = h', size: 17, fill: ORNG }
      ],
      eq: '长方形面积 = 长 × 宽 = a × h'
    },
    {
      say: '所以平行四边形的面积，就是底乘高。',
      cite: '等量代换：割补前后总面积不变',
      why: '斜的平行四边形，剪一刀拼一拼，就变成了好算的长方形。',
      eq: 'S = a × h',
      add: [{ id: 'final', k: 'text', at: [450, 500], text: 'S 平行四边形 = 底 × 高', size: 24, fill: INK }],
      hold: 3000
    }
  ];

  /* ---------- 解法二：拆成两个三角形（等底等高） ---------- */

  var m2 = [
    {
      say: '还有一条路：用三角形面积倒推。',
      cite: '已知定理：三角形面积 = ½ × 底 × 高',
      why: '三角形面积已经学过了，是「底 × 高 ÷ 2」——这条路不用剪，只算。',
      add: [trapezoid(), triangle()].concat(names())
    },
    {
      say: '连一条对角线 BD，平行四边形被分成两个三角形。',
      cite: '对角线在图形内部，构成合法分割',
      why: '对角线一定在图形内部，所以一定能把平行四边形正好分成两块。',
      add: [{ id: 'diag', k: 'line', a: B, b: D, stroke: ORNG, sw: 2, dash: [8, 6] }]
    },
    {
      say: '左边这块 △ABD：底是 AB = a，高是从 D 到底边的那一段 h。',
      cite: '三角形面积公式',
      why: '三角形的底和高是垂直的，所以高就是刚才画的那条垂线。',
      add: [
        { id: 'triABD', k: 'poly', pts: [A, B, D], fill: BLUE, stroke: BLUE, sw: 2, op: 0.55 },
        { id: 'hHi', k: 'line', a: D, b: E, stroke: GREEN, sw: 3.5 },
        { id: 'lblA', k: 'text', at: [(A[0] + B[0]) / 2, A[1] + 34], text: '底 a', size: 17, fill: BLUE },
        { id: 'lblH', k: 'text', at: [D[0] - 30, (D[1] + E[1]) / 2], text: '高 h', size: 17, fill: GREEN }
      ],
      eq: 'S△ABD = 1/2 × a × h'
    },
    {
      say: '右边这块 △BCD：底是 CD，也是 a；高是从 B 到 CD 的那一段，也是 h。',
      cite: '平行线间的距离处处相等',
      why: '两条平行线之间的距离处处相等，所以这条高和刚才那条一样长。',
      add: [
        { id: 'triBCD', k: 'poly', pts: [B, C, D], fill: ORNG, stroke: ORNG, sw: 2, op: 0.62 },
        { id: 'hHi2', k: 'line', a: [560, 180], b: [560, 360], stroke: GREEN, sw: 3.5 },
        { id: 'lblA2', k: 'text', at: [(C[0] + D[0]) / 2, 180 - 22], text: '底 a', size: 17, fill: ORNG },
        { id: 'lblH2', k: 'text', at: [596, 270], text: '高 h', size: 17, fill: GREEN }
      ],
      eq: 'S△BCD = 1/2 × a × h'
    },
    {
      say: '不信？把左边这块绕对角线中点转半圈，看它能不能盖住右边。',
      cite: '目测重合只是演示；真正的依据是全等',
      why: '平行四边形的两条对角线互相平分，所以中点正好是两者的公共中心。转半圈是给你看的直观，下面给严格理由。',
      upd: [
        { id: 'triABD', rot: 180, origin: [450, 270], op: 0.6 }
      ]
    },
    {
      say: '严格说：平行四边形的对边相等，所以 AB 等于 CD，AD 等于 BC；再加上公共边 BD，两个三角形三条边全相等。',
      cite: '平行四边形对边相等（性质）+ SSS 全等判定',
      why: '判定全等必须靠判定定理，不能靠“看着能盖上”。SSS 是三条边都对应相等，这是硬条件。',
      upd: [{ id: 'triABD', rot: 0, origin: [450, 270], op: 0.55 }],
      eq: '△ABD ≌ △CDB（SSS）'
    },
    {
      say: '全等的两个三角形面积一定相等。于是各占一半。',
      cite: '全等图形面积相等 + 面积可加性',
      why: '这才是严格的那一步：面积相等来自“全等”，不来自“看起来一样大”。',
      eq: 'S△ABD = S△CBD'
    },
    {
      say: '两块加起来，两个 1/2 正好凑成一个。',
      cite: '面积可加性 + 平行四边形对边相等',
      why: '平行四边形正好被对角线分成这两块，不多也不少。',
      eq: 'S = 1/2·a·h + 1/2·a·h = a·h'
    },
    {
      say: '和方法一得到的结论完全一样。',
      cite: '两条证明路径互不依赖，却得到同一结论',
      why: '一条路靠「剪拼」，一条路靠「算」，殊途同归。',
      eq: 'S = a × h',
      hold: 2800
    }
  ];

  window.MATHLAB_LESSONS = window.MATHLAB_LESSONS || [];
  window.MATHLAB_LESSONS.push({
    id: 'parallelogram-area',
    title: '平行四边形面积为什么是「底 × 高」',
    grade: '初二',
    topic: '几何 · 面积',
    tags: ['几何', '面积', '割补'],
    question: '一个平行四边形，底是 a，高是 h。它的面积为什么等于 a × h？',
    thumbStep: 3,
    methods: [
      {
        name: '剪一刀拼长方形', tier: 'proof',
        sub: '证明 · 依据：分割不重叠 + 平移不改变面积',
        steps: m1
      },
      {
        name: '拆成两个三角形', tier: 'proof',
        sub: '证明 · 依据：SSS 全等 + 面积可加',
        steps: m2
      }
    ]
  });
})();
