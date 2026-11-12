/* ============================================================
   等边三角形的高 · 纯证明
   ------------------------------------------------------------
   题设：等边 △ABC，边长 a；作高 CG ⊥ AB 于 G，记 CG = H。
   要证：① G 是 AB 的中点（从而 AG = a/2）
         ② H = (√3/2)a

   全篇只有证明，没有「量一量」「拼一拼」这类演示，也没有解释
   「三角形内角和 180°」这种常识。

   标注规范（2026-11-11 重做，针对「标注难看」）：
     · 顶点字母：沿「重心 → 顶点」方向外推固定距离，坐标一律算出来
     · 等长关系：边上画一道垂直短横线（tick），不重复写字母
     · 直角符号：统一 14px，画在垂足靠内侧
     · 字号只有三档：顶点 22 / 边与高 21 / 说明 17
     · 图形外空白处的字母一律关掉白色描边（halo:false），边缘才不糊
   ============================================================ */
(function () {
  var G = ML;
  var INK = '#16202f';
  var EDGE = '#1f3a68';    // 边
  var FILL = '#eef1f7';    // 三角形底色（中性灰白：叠蓝不发紫，叠绿不发青）
  var RED = '#e11d48';     // 高
  var BLUE = '#2563eb';    // 两个直角三角形（同一个色：它们是同类，不该用对比色）
  var GREEN = '#0f9d58';   // 全等 / 相等
  var GREY = '#93a1b5';    // 延长线等辅助

  /* ---------- 向量小工具 ---------- */
  function sub(p, q) { return [p[0] - q[0], p[1] - q[1]]; }
  function add(p, q) { return [p[0] + q[0], p[1] + q[1]]; }
  function mul(p, k) { return [p[0] * k, p[1] * k]; }
  function len(p) { return Math.sqrt(p[0] * p[0] + p[1] * p[1]); }
  function unit(p) { var L = len(p) || 1; return [p[0] / L, p[1] / L]; }
  function mid(p, q) { return [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2]; }
  function nf(v) { return Math.abs(v) < 1e-9 ? 0 : Math.round(v * 100) / 100; }

  /* ---------- 关键点：高撑满画布，边长由 2H/√3 推出 ---------- */
  var Hpx = 420;                       // 高占 420 像素（画布 900×520）
  var apx = 2 * Hpx / Math.sqrt(3);    // 484.97

  var C = [450, 60];
  var F = [450, 60 + Hpx];             // 垂足 G
  var A = [450 - apx / 2, F[1]];       // 207.51
  var B = [450 + apx / 2, F[1]];       // 692.49
  var O = [(A[0] + B[0] + C[0]) / 3, (A[1] + B[1] + C[1]) / 3];  // 重心

  /* ---------- 标注工具 ---------- */

  // 顶点字母：从重心指向顶点再外推，永远落在图形外侧
  function vname(id, V, d) {
    var p = add(V, mul(unit(sub(V, O)), d == null ? 30 : d));
    return { id: id, k: 'text', at: p, text: id.slice(1), size: 22, fill: INK, weight: 700, halo: false };
  }

  // 直角符号：从 V 沿 u、w 两个单位方向各走 s，画出方角
  function rightAngle(id, V, u, w, s, color) {
    var p1 = add(V, mul(u, s));
    var p2 = add(p1, mul(w, s));
    var p3 = add(V, mul(w, s));
    return {
      id: id, k: 'path',
      d: 'M' + nf(p1[0]) + ',' + nf(p1[1]) +
         ' L' + nf(p2[0]) + ',' + nf(p2[1]) +
         ' L' + nf(p3[0]) + ',' + nf(p3[1]),
      stroke: color, sw: 2
    };
  }

  // 等长记号：画在边中点、垂直于该边的一道短横线
  function tickMark(id, X, Y, color, half) {
    var u = unit(sub(Y, X));
    var w = [-u[1], u[0]];
    var m = mid(X, Y);
    var h = half == null ? 9 : half;
    return {
      id: id, k: 'line',
      a: add(m, mul(w, -h)), b: add(m, mul(w, h)),
      stroke: color, sw: 3.2
    };
  }

  // 角标记：弧 + 角度数字（数字放角平分线方向上，不手填方位角）
  function angleMark(idArc, idTxt, V, X, Y, r, color, label) {
    var w = G.wedge(V, X, Y);
    return [
      { id: idArc, k: 'arc', c: V, r: r, from: w.from, to: w.to, stroke: color, sw: 2.2 },
      {
        id: idTxt, k: 'text', at: G.pt(V[0], V[1], r + 27, w.from + w.deg / 2),
        text: label, size: 17, fill: color, halo: false
      }
    ];
  }

  /* ---------- 常驻骨架 ---------- */

  var tri = { id: 'tri', k: 'poly', pts: [A, B, C], fill: FILL, stroke: EDGE, sw: 2.6 };

  var names = [vname('vA', A), vname('vB', B), vname('vC', C, 27)];

  // 边长 a：底边下方居中，图形外，不加白边
  var lbA = { id: 'lbA', k: 'text', at: [450, 504], text: 'a', size: 21, fill: EDGE, halo: false };

  // 高 CG（虚线）+ 直角符号 + 垂足字母 + 高记作 H
  var alt = { id: 'alt', k: 'line', a: C, b: F, stroke: RED, sw: 3.4, dash: [10, 7] };
  var ra = rightAngle('ra', F, unit(sub(B, A)), unit(sub(C, F)), 14, EDGE);
  var lbG = { id: 'lbG', k: 'text', at: [F[0] - 30, F[1] - 27], text: 'G', size: 22, fill: INK, weight: 700, halo: false };
  var lbH = { id: 'lbH', k: 'text', at: [F[0] + 30, (C[1] + F[1]) / 2], text: 'H', size: 21, fill: RED, halo: false };

  // 两个直角三角形（步骤 5 起用）
  // 关键：淡填充用 rgba，描边保持不透明。
  // engine 的 op 是设在 <g> 上的整组透明度，用它会把描边一起削淡（看起来像糊了一层灰）。
  // 不描边：描边会盖住原三角形那条深色边，让整个外框凭空变成亮蓝。
  // 分区靠填充即可（0.14 的蓝铺在 #e9f0fb 上，差别看得清）。
  var triAGC = { id: 'tAGC', k: 'poly', pts: [A, F, C], fill: 'rgba(37,99,235,0.13)', stroke: 'rgba(37,99,235,0.45)', sw: 2.2 };
  var triBGC = { id: 'tBGC', k: 'poly', pts: [B, F, C], fill: 'rgba(37,99,235,0.13)', stroke: 'rgba(37,99,235,0.45)', sw: 2.2 };
  // 垫在色块与高线之间的白色分界：盖住两块在 CG 上的重复描边
  var sep = { id: 'sep', k: 'line', a: C, b: F, stroke: '#ffffff', sw: 5.5 };
  var nameAGC = { id: 'nAGC', k: 'text', at: [369, 342], text: '△AGC', size: 17, fill: BLUE };
  var nameBGC = { id: 'nBGC', k: 'text', at: [531, 342], text: '△BGC', size: 17, fill: BLUE };

  // 等长记号
  var tkAC = tickMark('tkAC', A, C, EDGE);
  var tkBC = tickMark('tkBC', B, C, EDGE);
  var tkAG = tickMark('tkAG', A, F, GREEN);
  var tkGB = tickMark('tkGB', F, B, GREEN);

  // 底角 60°
  var angA = angleMark('arcA', 'txtA', A, B, C, 56, EDGE, '60°');
  var angB = angleMark('arcB', 'txtB', B, A, C, 56, EDGE, '60°');

  /* ---------- 讲稿 ---------- */

  var steps = [
    /* 1 题面 */
    {
      say: '等边三角形 ABC，三条边都是 a。',
      cite: '等边三角形：AB = BC = CA = a',
      add: [tri].concat(names, [lbA]),
      eq: 'AB = BC = CA = a'
    },

    /* 2 作高 */
    {
      say: '从 C 向 AB 作高，垂足是 G，记高 CG = H。要证两件事：G 平分 AB，以及 H 到底多长。',
      cite: '高：CG ⊥ AB；待证 ① AG = GB = a/2  ② H = (√3/2)a',
      add: [alt, ra, lbG, lbH],
      eq: '已知 CG ⊥ AB'
    },

    /* 3 不能循环论证 */
    {
      say: '注意：「高平分底边」不是定义，是结论。谁直接拿来用，谁就是在循环论证。',
      cite: '待证结论不能当作条件使用',
      add: [{ id: 'warnTxt', k: 'text', at: [762, 132], text: '高平分底边 = 待证', size: 17, fill: RED, halo: false }],
      eq: '不能先假设 AG = GB'
    },

    /* 4 垂足在内部 */
    {
      say: '先确认 G 落在 AB 内部。底角都是 60°，都是锐角，所以从 C 作的高一定落在底边上，不在延长线上。',
      cite: '锐角三角形的垂心（及各垂足）都在三角形内部',
      add: angA.concat(angB),
      eq: '∠A = ∠B = 60° < 90°'
    },

    /* 5 两个直角三角形 */
    {
      say: '于是得到两个直角三角形：△AGC 和 △BGC。',
      cite: 'CG ⊥ AB ⟹ ∠AGC = ∠BGC = 90°',
      delNow: ['warnTxt'],
      add: [triAGC, triBGC, sep, nameAGC, nameBGC],
      // sep 是白色遮罩线（盖住原来的边，做出「撕下来」的效果），必须排在 alt 之后置顶，
      // 否则红色虚线 alt 会穿出遮罩，白色挡不住
      front: ['alt', 'ra', 'lbG', 'lbH', 'vC', 'sep'],
      eq: '∠AGC = ∠BGC = 90°'
    },

    /* 6 条件 */
    {
      say: 'AC 和 BC 都是 a；CG 是两个三角形共用的边。',
      cite: '等边三角形三边相等；公共边 CG = CG',
      add: [tkAC, tkBC],
      eq: 'AC = BC = a，CG = CG'
    },

    /* 7 HL 全等 */
    {
      say: '斜边相等，一条直角边也相等，由 HL 判定，两个直角三角形全等。',
      cite: 'HL：斜边和一条直角边对应相等的两个直角三角形全等',
      upd: [
        { id: 'tAGC', fill: 'rgba(15,157,88,0.12)', stroke: 'rgba(15,157,88,0.48)' },
        { id: 'tBGC', fill: 'rgba(15,157,88,0.12)', stroke: 'rgba(15,157,88,0.48)' },
        { id: 'nAGC', fill: GREEN },
        { id: 'nBGC', fill: GREEN }
      ],
      eq: 'Rt△AGC ≌ Rt△BGC（HL）'
    },

    /* 8 对应边相等 */
    {
      say: '全等三角形的对应边相等，所以 AG = GB。',
      cite: '全等三角形对应边相等',
      add: [tkAG, tkGB],
      eq: 'AG = GB'
    },

    /* 9 一半 */
    {
      say: '而 AG 加 GB 就是整条 AB，等于 a。两段一样长，各是 a 的一半。',
      cite: '线段加法：AG + GB = AB；等量代换：AG = GB = a/2',
      delNow: ['tAGC', 'tBGC', 'sep', 'nAGC', 'nBGC', 'tkAC', 'tkBC'],
      del: ['lbA'],
      add: [
        { id: 'halfA', k: 'text', at: [mid(A, F)[0], 504], text: 'a/2', size: 19, fill: EDGE, halo: false },
        { id: 'halfB', k: 'text', at: [mid(F, B)[0], 504], text: 'a/2', size: 19, fill: EDGE, halo: false }
      ],
      eq: 'AG + GB = a  ⟹  AG = a/2'
    },

    /* 10 勾股 */
    {
      say: '回到直角三角形 AGC，斜边是 a，一条直角边是 a/2。勾股定理一算，另一条直角边就是 √3/2 个 a。',
      cite: '勾股定理：斜边² = 两直角边² 之和（长度取正根）',
      add: [
        { id: 'pyth1', k: 'text', at: [668, 196], anchor: 'start', text: 'CG² = a² − (a/2)²', size: 18, fill: INK, halo: false },
        { id: 'pyth2', k: 'text', at: [668, 232], anchor: 'start', text: '= 3a²/4', size: 18, fill: INK, halo: false },
        { id: 'pyth3', k: 'text', at: [668, 276], anchor: 'start', text: 'CG = (√3/2)a', size: 20, fill: RED, halo: false }
      ],
      eq: 'H = CG = (√3/2)a ≈ 0.866a',
      hold: 3400
    }
  ];

  window.MATHLAB_LESSONS = window.MATHLAB_LESSONS || [];
  window.MATHLAB_LESSONS.push({
    id: 'equilateral-altitude',
    title: '等边三角形的高：(√3/2)a 是怎么证出来的',
    grade: '初二',
    topic: '几何 · 三角形',
    tags: ['几何', '等边三角形', 'HL', '勾股定理', '证明'],
    question: '等边三角形 ABC 的边长是 a，作高 CG ⊥ AB。求证：(1) G 是 AB 的中点；(2) 高 CG = (√3/2)a。',
    thumbStep: 8,
    methods: [
      {
        name: 'HL 全等 + 勾股定理', tier: 'proof',
        sub: '严格证明 · 10 步，每步都有依据',
        steps: steps
      }
    ]
  });
})();
