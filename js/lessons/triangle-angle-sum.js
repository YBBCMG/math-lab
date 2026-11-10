/* ============================================================
   示范题 1 · 三角形内角和为什么是 180°
   三种解法：撕角拼平角 / 平行线内错角 / 外角定理
   所有角度都由代码算出，不手填
   ============================================================ */
(function () {
  var G = ML;
  var A = [150, 300], B = [710, 300], C = [400, 70];
  var R = 88;

  var BLUE = '#2563eb', ORNG = '#ef8b0c', GREEN = '#0f9d68', INK = '#16202f';

  var wA = G.wedge(A, B, C);   // 顶点 A 处的内角
  var wB = G.wedge(B, C, A);   // 顶点 B 处的内角
  var wC = G.wedge(C, A, B);   // 顶点 C 处的内角

  /* ---------- 复用件 ---------- */

  function tri() {
    return { id: 'tri', k: 'poly', pts: [A, B, C], fill: '#eef2fb', stroke: INK, sw: 2.5 };
  }
  function verts() {
    return [
      { id: 'vA', k: 'circ', c: A, r: 4.5, fill: INK },
      { id: 'vB', k: 'circ', c: B, r: 4.5, fill: INK },
      { id: 'vC', k: 'circ', c: C, r: 4.5, fill: INK },
      { id: 'nA', k: 'text', at: [A[0] - 26, A[1] + 22], text: 'A', size: 20, fill: INK },
      { id: 'nB', k: 'text', at: [B[0] + 24, B[1] + 22], text: 'B', size: 20, fill: INK },
      { id: 'nC', k: 'text', at: [C[0], C[1] - 26], text: 'C', size: 20, fill: INK }
    ];
  }
  function wedgeSpec(id, V, w, color, op) {
    return { id: id, k: 'sector', c: V, r: R, from: w.from, to: w.to,
             fill: color, stroke: color, sw: 1.5, op: op };
  }
  function labelAt(V, w, k) {
    return G.pt(V[0], V[1], R * k, G.midDir(w));
  }
  function degText(w) { return G.round1(w.deg) + '°'; }

  /* ============================================================
     解法一：撕角拼平角
     ============================================================ */

  var O = [400, 452];   // 拼装点

  var m1 = [
    {
      say: '任意画一个三角形。三个内角加起来，到底是多少度？',
      why: '先别急着记结论——我们把三个角真的「拿出来」拼一拼。',
      add: [tri()].concat(verts())
    },
    {
      say: '先把三个内角标出来。这三片角，就是待会儿要被拿走的。',
      why: '角的大小只跟两条边张开的程度有关，边画长画短都不影响它。',
      add: [
        wedgeSpec('wA', A, wA, BLUE, 0.3),
        wedgeSpec('wB', B, wB, ORNG, 0.3),
        wedgeSpec('wC', C, wC, GREEN, 0.3)
      ]
    },
    {
      say: '青蓝那片是 ∠A，橙色是 ∠B，绿色是 ∠C。',
      why: '三片角颜色不同，等会儿拼起来时，一眼就能看出哪片是哪个角。',
      eq: '∠A + ∠B + ∠C = ?',
      add: [
        { id: 'lA', k: 'text', at: labelAt(A, wA, 0.62), text: degText(wA), size: 16, fill: BLUE },
        { id: 'lB', k: 'text', at: labelAt(B, wB, 0.62), text: degText(wB), size: 16, fill: ORNG },
        { id: 'lC', k: 'text', at: labelAt(C, wC, 0.62), text: degText(wC), size: 16, fill: GREEN }
      ]
    },
    {
      say: '沿着角的两条边剪开——三片角就离开了原来的三角形。',
      why: '因为「角度」不依赖外框，所以整片角可以原样搬到别处。',
      upd: [
        { id: 'tri', op: 0.16 },
        { id: 'wA', op: 0.72 }, { id: 'wB', op: 0.72 }, { id: 'wC', op: 0.72 },
        { id: 'lA', op: 0 }, { id: 'lB', op: 0 }, { id: 'lC', op: 0 }
      ]
    },
    {
      say: '把三片角一起搬到下面的空白处。',
      why: '平移只改变位置，不改变形状和大小。',
      upd: [
        { id: 'wA', move: [O[0] - A[0], O[1] - A[1]] },
        { id: 'wB', move: [O[0] - B[0], O[1] - B[1]] },
        { id: 'wC', move: [O[0] - C[0], O[1] - C[1]] }
      ]
    },
    {
      say: '转一转，让三片角肩并肩挨着排好。',
      why: '旋转同样不改变角的大小——转完，还是原来那个角。',
      upd: [
        { id: 'wA', rot: 0 - wA.from, origin: A },
        { id: 'wB', rot: wA.deg - wB.from, origin: B },
        { id: 'wC', rot: (wA.deg + wB.deg) - wC.from, origin: C }
      ]
    },
    {
      say: '看：三片角拼在一起，正好铺满直线的一侧。',
      why: '它们的边两两重合，中间没有缝，也没有叠。',
      add: [{ id: 'base', k: 'line', a: [O[0] - R, O[1]], b: [O[0] + R, O[1]], stroke: INK, sw: 3 }]
    },
    {
      say: '一条直线旁边的这些角，加起来是一个平角。',
      why: '平角的两条边拉成一条直线，转过的总量正好是半个整圈。',
      eq: '一个平角 = 180°',
      add: [{ id: 'l180', k: 'text', at: [O[0] + R + 58, O[1] - 4], text: '180°', size: 22, fill: INK }]
    },
    {
      say: '所以，不管三角形长什么样，三个内角之和永远是 180°。',
      why: '换一个三角形，撕角拼接的过程一模一样——结论也一模一样。',
      eq: '∠A + ∠B + ∠C = 180°',
      add: [
        { id: 'lbA', k: 'text', at: G.pt(O[0], O[1], R + 26, wA.deg / 2), text: '∠A', size: 15, fill: BLUE },
        { id: 'lbB', k: 'text', at: G.pt(O[0], O[1], R + 26, wA.deg + wB.deg / 2), text: '∠B', size: 15, fill: ORNG },
        { id: 'lbC', k: 'text', at: G.pt(O[0], O[1], R + 26, wA.deg + wB.deg + wC.deg / 2), text: '∠C', size: 15, fill: GREEN }
      ],
      hold: 2600
    }
  ];

  /* ============================================================
     解法二：过顶点作平行线（内错角）
     ============================================================ */

  var D2 = [A[0] + 30, C[1]], E2 = [B[0] - 80, C[1]];

  var m2 = [
    {
      say: '换一条路走：不撕角，只画一条辅助线。',
      why: '撕角要靠剪刀，平行线只靠画——同样能说明问题，而且更「讲道理」。',
      add: [tri()].concat(verts())
    },
    {
      say: '过顶点 C，画一条和 AB 平行的直线 DE。',
      why: '过直线外一点，有且只有一条直线与已知直线平行——所以这条线是唯一确定的。',
      add: [
        { id: 'lDE', k: 'line', a: D2, b: E2, stroke: INK, sw: 2, dash: [7, 6] },
        { id: 'nD', k: 'text', at: [D2[0] - 22, D2[1] + 4], text: 'D', size: 20, fill: INK },
        { id: 'nE', k: 'text', at: [E2[0] + 22, E2[1] + 4], text: 'E', size: 20, fill: INK }
      ]
    },
    {
      say: '先把三角形自己的三个内角标出来。',
      why: '把这几个角先认清楚，等会儿才好在 C 点把它们对号入座。',
      eq: '∠A + ∠B + ∠ACB = ?',
      add: [
        wedgeSpec('wA', A, wA, BLUE, 0.3),
        wedgeSpec('wB', B, wB, ORNG, 0.3),
        wedgeSpec('wC', C, wC, GREEN, 0.3),
        { id: 'lA', k: 'text', at: labelAt(A, wA, 0.62), text: degText(wA), size: 16, fill: BLUE },
        { id: 'lB', k: 'text', at: labelAt(B, wB, 0.62), text: degText(wB), size: 16, fill: ORNG },
        { id: 'lC', k: 'text', at: labelAt(C, wC, 0.62), text: degText(wC), size: 16, fill: GREEN }
      ]
    },
    {
      say: '注意截线的左边：∠DCA 和 ∠A 是一对内错角。',
      why: '两直线平行，内错角相等——这是平行线的性质。',
      add: [
        { id: 'wDA', k: 'sector', c: C, r: R, from: 180, to: wC.from, fill: BLUE, stroke: BLUE, sw: 1.5, op: 0.45 },
        { id: 'lDA', k: 'text', at: G.pt(C[0], C[1], R * 0.66, (180 + wC.from) / 2), text: degText(wA), size: 15, fill: BLUE }
      ]
    },
    {
      say: '右边同理：∠BCE 和 ∠B 也是一对内错角，所以相等。',
      why: '一左一右是同一套理由：两条平行线被同一条截线所截，内错角必相等。',
      eq: '∠DCA = ∠A,  ∠BCE = ∠B',
      add: [
        { id: 'wBE', k: 'sector', c: C, r: R, from: wC.to, to: 360, fill: ORNG, stroke: ORNG, sw: 1.5, op: 0.45 },
        { id: 'lBE', k: 'text', at: G.pt(C[0], C[1], R * 0.66, (wC.to + 360) / 2), text: degText(wB), size: 15, fill: ORNG }
      ]
    },
    {
      say: '现在看 C 点：三个角排在一起，正好铺满直线 DE 的一侧。',
      why: '左边那片等于 ∠A，中间那片是 ∠ACB，右边那片等于 ∠B。',
      upd: [{ id: 'lDE', sw: 3.5, stroke: INK }]
    },
    {
      say: '所以 ∠A + ∠ACB + ∠B 就是一个平角。',
      why: '左边那片换回 ∠A、中间留 ∠ACB、右边那片换回 ∠B，总量不变。',
      eq: '∠DCA + ∠ACB + ∠BCE = 180°',
      add: [
        { id: 'lN1', k: 'text', at: [450, 498], text: 'D —— C —— E 三点共线', size: 15, fill: '#5b6880' }
      ]
    },
    {
      say: '把相等的角换回去，就得到三角形内角和。',
      why: '全程只用了「平行线内错角相等」这一条性质，没有额外假设。',
      eq: '∠A + ∠B + ∠ACB = 180°',
      hold: 2600
    }
  ];

  /* ============================================================
     解法三：外角定理
     ============================================================ */

  var D3 = [B[0] + 130, B[1]];      // 延长 AB 到 D

  var m3 = [
    {
      say: '第三条路，只用一个外角就够了。',
      why: '外角是「三角形外面的那个角」，它天然等于两个不相邻内角之和。',
      add: [tri()].concat(verts())
    },
    {
      say: '把 AB 延长到点 D，得到一个外角 ∠CBD。',
      why: '外角就是把三角形的一条边延长出去，与相邻的另一条边夹成的角。',
      add: [
        { id: 'lBD', k: 'line', a: B, b: D3, stroke: INK, sw: 2, dash: [7, 6] },
        { id: 'nD', k: 'text', at: [D3[0] + 6, D3[1] + 26], text: 'D', size: 20, fill: INK },
        { id: 'wExt', k: 'sector', c: B, r: R, from: 0, to: wB.from, fill: '#fdeaea', stroke: '#e04545', sw: 2, op: 0.5 }
      ]
    },
    {
      say: '先把三角形的三个内角标出来。',
      why: '待会儿要被搬走的，就是其中两片；第三片留在原地不动。',
      eq: '∠A + ∠B + ∠ACB = ?',
      add: [
        wedgeSpec('wA', A, wA, BLUE, 0.3),
        wedgeSpec('wB', B, wB, ORNG, 0.3),
        wedgeSpec('wC', C, wC, GREEN, 0.3),
        { id: 'lA', k: 'text', at: labelAt(A, wA, 0.6), text: degText(wA), size: 16, fill: BLUE },
        { id: 'lB', k: 'text', at: labelAt(B, wB, 0.6), text: degText(wB), size: 16, fill: ORNG },
        { id: 'lC', k: 'text', at: labelAt(C, wC, 0.6), text: degText(wC), size: 16, fill: GREEN }
      ]
    },
    {
      say: '把 ∠A 这片角从 A 搬到 B 来，放在外角的最外边。',
      why: '角片可以整块搬运——平移不改变角的大小。',
      upd: [
        { id: 'wA', move: [B[0] - A[0], B[1] - A[1]] },
        { id: 'lA', op: 0 }
      ]
    },
    {
      say: '再把 ∠C 那片也搬过来，让它俩接上。',
      why: '这次要转半圈（180°）才能对齐——旋转同样不改角的大小。',
      upd: [
        { id: 'wA', rot: 0, origin: A },
        { id: 'wC', move: [B[0] - C[0], B[1] - C[1]] }
      ]
    },
    {
      say: '两块角片正好把外角填满，一片不剩、一片不多。',
      why: '所以 ∠CBD 就等于 ∠A + ∠C —— 这就是外角定理。',
      upd: [
        { id: 'wC', rot: wA.deg - wC.from, origin: C }
      ],
      eq: '∠CBD = ∠A + ∠C'
    },
    {
      say: '而外角和它旁边的内角 ∠B，正好拼成一条直线。',
      why: 'AB 和 BD 本来就是同一条直线，所以这两个角互补。',
      eq: '∠CBD + ∠B = 180°',
      upd: [{ id: 'lBD', sw: 3 }]
    },
    {
      say: '把 ∠CBD 换成 ∠A + ∠C，就回到三角形的三个内角。',
      why: '等量换等量：位置换了，总量不变。',
      eq: '(∠A + ∠C) + ∠B = 180°',
      hold: 2400
    },
    {
      say: '三条路，同一个结论。',
      why: '撕角拼、画平行线、用外角——本质上都是在数「一个平角」。',
      eq: '∠A + ∠B + ∠C = 180°',
      hold: 3200
    }
  ];

  /* ---------- 注册 ---------- */

  window.MATHLAB_LESSONS = window.MATHLAB_LESSONS || [];
  window.MATHLAB_LESSONS.push({
    id: 'triangle-angle-sum',
    title: '三角形内角和为什么是 180°',
    grade: '初二',
    topic: '几何 · 角度',
    tags: ['几何', '角度', '三角形'],
    question: '任意一个三角形，它的三个内角加起来是多少度？为什么？',
    thumbStep: 2,
    methods: [
      { name: '撕角拼平角', sub: '最直观：把三个角真的拿出来拼', steps: m1 },
      { name: '作平行线看内错角', sub: '不用撕，只加一条辅助线', steps: m2 },
      { name: '外角定理', sub: '把 ∠A、∠C 搬进外角里', steps: m3 }
    ]
  });
})();
