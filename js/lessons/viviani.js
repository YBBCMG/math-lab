/* ============================================================
   维维亚尼定理（Viviani, 1659）
   等边三角形内任取一点 P，P 到三边的距离之和恒等于三角形的高。

   讲稿结构（严格区分「演示 / 证明 / 推论」三档）：
     方法一 · 量一量        tier=demo    —— 只能提出猜想
     方法二 · 面积法        tier=proof   —— 唯一完整的证明
     方法三 · 特殊位置法    tier=corollary，依赖方法二 —— 只负责速算

   每个步骤都带三个字段：
     say  讲解（也用来生成配音）
     cite 依据（引用的那条定理/性质，界面上单独显示）
     why  补充说明（为什么这一步可以使用）

   所有坐标一律由代码算，绝不手填数值（见 SPEC.md 失败模式第 1 条）。
   ============================================================ */
(function () {
  var G = ML;
  var INK = '#16202f';

  /* ---------- 配色：高饱和，远看也分得清 ---------- */
  var BLUE = '#0f5ef7', ORNG = '#f97316', GREEN = '#00a86b', GREY = '#7c8aa0';
  var FILL = '#d6e4ff';          // 三角形底色（比原来的 #d6e4ff 明显一档）
  var OP = 0.55;                 // 三块高亮的不透明度

  /* ---------- 向量小工具 ---------- */
  function sub(p, q) { return [p[0] - q[0], p[1] - q[1]]; }
  function add(p, q) { return [p[0] + q[0], p[1] + q[1]]; }
  function mul(p, k) { return [p[0] * k, p[1] * k]; }
  function len(p) { return Math.sqrt(p[0] * p[0] + p[1] * p[1]); }
  function unit(p) { var L = len(p) || 1; return [p[0] / L, p[1] / L]; }
  function lerp(p, q, t) { return [p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t]; }

  /* ---------- 基本图形 ---------- */
  var A = [190, 440], B = [610, 440];
  var SIDE = B[0] - A[0];                 // 边长 a
  var HGT = SIDE * Math.sqrt(3) / 2;      // 高三 H
  var C = [(A[0] + B[0]) / 2, A[1] - HGT];
  var CTR = [(A[0] + B[0] + C[0]) / 3, (A[1] + B[1] + C[1]) / 3];

  // 点 P 到直线 XY 的距离 + 垂足
  function perp(P, X, Y) {
    var u = unit(sub(Y, X));
    var v = sub(P, X);
    var t = v[0] * u[0] + v[1] * u[1];
    var foot = add(X, mul(u, t));
    var d = Math.abs(v[0] * u[1] - v[1] * u[0]);
    return { d: d, foot: foot };
  }

  function dists(P) {
    var f1 = perp(P, B, C);   // 到 BC  → h1，垂足 D
    var f2 = perp(P, C, A);   // 到 CA  → h2，垂足 E
    var f3 = perp(P, A, B);   // 到 AB  → h3，垂足 F
    return { h1: f1.d, h2: f2.d, h3: f3.d, D: f1.foot, E: f2.foot, F: f3.foot };
  }

  // 垂足处的小直角标记
  function rmark(V, P1, P2, size) {
    size = size || 14;
    var u = mul(unit(sub(P1, V)), size);
    var w = mul(unit(sub(P2, V)), size);
    return [V, add(V, u), add(add(V, u), w), add(V, w)];
  }

  // 线段标签位置：中点沿法向推开，推向远离三角形内部的一侧
  function lblAt(P, foot, gap) {
    var mid = lerp(P, foot, 0.55);
    var u = unit(sub(foot, P));
    var w = [-u[1], u[0]];
    var s = (w[0] * (mid[0] - CTR[0]) + w[1] * (mid[1] - CTR[1])) >= 0 ? 1 : -1;
    return add(mid, mul(w, (gap || 26) * s));
  }

  function outward(mid, d) { return add(mid, mul(unit(sub(mid, CTR)), d || 30)); }

  // 沿边 from→to 的 t 处取点，再朝三角形内部推开 gap
  function innerLabel(from, to, t, gap) {
    var p = lerp(from, to, t);
    return add(p, mul(unit(sub(CTR, p)), gap || 24));
  }

  var r1 = G.round1;

  /* ---------- 静态元素 ---------- */
  var tri = { id: 'tri', k: 'poly', pts: [A, B, C], fill: FILL, stroke: INK, sw: 3 };

  var vnames = [
    { id: 'nA', k: 'text', at: [A[0] - 26, A[1] + 24], text: 'A', size: 20, fill: INK },
    { id: 'nB', k: 'text', at: [B[0] + 24, B[1] + 24], text: 'B', size: 20, fill: INK },
    { id: 'nC', k: 'text', at: [C[0], C[1] - 26], text: 'C', size: 20, fill: INK }
  ];

  var midAB = lerp(A, B, 0.5);

  var sideMarks = [
    { id: 'sa1', k: 'line', a: A, b: B, stroke: BLUE, sw: 6 },
    { id: 'sa2', k: 'line', a: B, b: C, stroke: BLUE, sw: 6 },
    { id: 'sa3', k: 'line', a: C, b: A, stroke: BLUE, sw: 6 },
    { id: 'la1', k: 'text', at: [midAB[0], midAB[1] + 56], text: 'a', size: 20, fill: BLUE },
    // 斜边上的 a 放在靠近顶点 C 的内侧：
    // 垂足 D、E 本来就落在两条边的中点附近，把 a 放在中点外侧会和 D/E 的标签黏在一起。
    { id: 'la2', k: 'text', at: innerLabel(C, B, 0.28, 26), text: 'a', size: 20, fill: BLUE },
    { id: 'la3', k: 'text', at: innerLabel(C, A, 0.28, 26), text: 'a', size: 20, fill: BLUE }
  ];

  /* ============================================================
     方法一：量一量（演示 —— 只能得到猜想）
     ============================================================ */

  var P0 = [370, 310];
  var d0 = dists(P0);
  var P1 = lerp(P0, A, 0.55);

  var S = {
    pg: { id: 'pg', k: 'circ', c: P0, r: 8, fill: BLUE, stroke: '#ffffff', sw: 2.5 },
    nP: { id: 'nP', k: 'text', at: [P0[0] - 2, P0[1] - 30], text: 'P', size: 20, fill: INK },

    l3: { id: 'l3', k: 'line', a: P0, b: d0.F, stroke: GREEN, sw: 4 },
    m3: { id: 'm3', k: 'poly', pts: rmark(d0.F, P0, B), fill: 'none', stroke: GREEN, sw: 1.8 },
    nF: { id: 'nF', k: 'text', at: [d0.F[0] - 18, d0.F[1] + 20], text: 'F', size: 17, fill: INK },
    lh3: { id: 'lh3', k: 'text', at: lblAt(P0, d0.F), text: 'h\u2083', size: 19, fill: GREEN },

    l1: { id: 'l1', k: 'line', a: P0, b: d0.D, stroke: BLUE, sw: 4 },
    m1: { id: 'm1', k: 'poly', pts: rmark(d0.D, P0, C), fill: 'none', stroke: BLUE, sw: 1.8 },
    nD: { id: 'nD', k: 'text', at: outward(d0.D, 26), text: 'D', size: 17, fill: INK },
    lh1: { id: 'lh1', k: 'text', at: lblAt(P0, d0.D), text: 'h\u2081', size: 19, fill: BLUE },

    l2: { id: 'l2', k: 'line', a: P0, b: d0.E, stroke: ORNG, sw: 4 },
    m2: { id: 'm2', k: 'poly', pts: rmark(d0.E, P0, A), fill: 'none', stroke: ORNG, sw: 1.8 },
    nE: { id: 'nE', k: 'text', at: outward(d0.E, 38), text: 'E', size: 17, fill: INK },
    lh2: { id: 'lh2', k: 'text', at: lblAt(P0, d0.E), text: 'h\u2082', size: 19, fill: ORNG },

    pa: { id: 'pa', k: 'line', a: P0, b: A, stroke: INK, sw: 2, dash: [6, 5] },
    pb: { id: 'pb', k: 'line', a: P0, b: B, stroke: INK, sw: 2, dash: [6, 5] },
    pc: { id: 'pc', k: 'line', a: P0, b: C, stroke: INK, sw: 2, dash: [6, 5] },

    t3: { id: 't3', k: 'poly', pts: [P0, A, B], fill: GREEN, stroke: GREEN, op: OP },
    t1: { id: 't1', k: 'poly', pts: [P0, B, C], fill: BLUE, stroke: BLUE, op: OP },
    t2: { id: 't2', k: 'poly', pts: [P0, C, A], fill: ORNG, stroke: ORNG, op: OP }
  };

  // 三角形整体的高：C 到底边 AB 的垂足 G
  var gFoot = perp(C, A, B).foot;

  var alt = [
    { id: 'alt', k: 'line', a: C, b: gFoot, stroke: INK, sw: 3.4, dash: [9, 7] },
    { id: 'mAlt', k: 'poly', pts: rmark(gFoot, C, B, 16), fill: 'none', stroke: INK, sw: 1.8 },
    { id: 'nG', k: 'text', at: [gFoot[0] - 18, gFoot[1] + 20], text: 'G', size: 17, fill: INK },
    // H 的标签往下挪：y 取中线会正好压住 h₁ 的标签
    { id: 'lhH', k: 'text', at: [gFoot[0] + 34, 380], text: 'H', size: 20, fill: INK }
  ];

  /* ---- 右边那把「尺子」：三段首尾相接摞起来 ---- */
  var BX = 760, BW = 38;
  var y0 = 440;                       // 底边高度
  var y1 = y0 - d0.h1;
  var y2 = y1 - d0.h2;
  var y3 = y2 - d0.h3;                // 应该正好等于 C[1]

  var stack = [
    // 两条对齐辅助线：底边水平线、顶点水平线
    { id: 'gd1', k: 'line', a: [B[0], y0], b: [BX - 6, y0], stroke: GREY, sw: 1.8, dash: [7, 6] },
    { id: 'gd2', k: 'line', a: [C[0], y3], b: [BX - 6, y3], stroke: GREY, sw: 1.8, dash: [7, 6] },
    // 三段
    { id: 'b1', k: 'rect', x: BX, y: y1, w: BW, h: d0.h1, fill: BLUE, stroke: INK, sw: 2 },
    { id: 'b2', k: 'rect', x: BX, y: y2, w: BW, h: d0.h2, fill: ORNG, stroke: INK, sw: 2 },
    { id: 'b3', k: 'rect', x: BX, y: y3, w: BW, h: d0.h3, fill: GREEN, stroke: INK, sw: 2 },
    // 三段的标签
    { id: 'lb1', k: 'text', at: [BX + BW + 18, (y0 + y1) / 2], text: 'h\u2081', size: 17, fill: BLUE },
    { id: 'lb2', k: 'text', at: [BX + BW + 18, (y1 + y2) / 2], text: 'h\u2082', size: 17, fill: ORNG },
    { id: 'lb3', k: 'text', at: [BX + BW + 18, (y2 + y3) / 2], text: 'h\u2083', size: 17, fill: GREEN },
    // 总高括线
    { id: 'brace', k: 'line', a: [BX + BW + 44, y0], b: [BX + BW + 44, y3], stroke: INK, sw: 2 },
    { id: 'capT', k: 'line', a: [BX + BW + 38, y3], b: [BX + BW + 50, y3], stroke: INK, sw: 2 },
    { id: 'capB', k: 'line', a: [BX + BW + 38, y0], b: [BX + BW + 50, y0], stroke: INK, sw: 2 },
    { id: 'lbH', k: 'text', at: [BX + BW + 64, (y0 + y3) / 2], text: 'H', size: 20, fill: INK }
  ];

  /* ---- 一个位置的完整读数（P + 三条垂线 + 求和） ---- */
  function snap(P, tag, title) {
    var d = dists(P);
    var out = [
      { id: 'c' + tag, k: 'circ', c: P, r: 8, fill: BLUE, stroke: '#ffffff', sw: 2.5 },
      { id: 't' + tag, k: 'text', at: [P[0], P[1] - 30], text: title, size: 18, fill: INK }
    ];
    var segs = [
      { id: 'q1' + tag, a: P, b: d.D, col: BLUE, t: 'h\u2081', v: d.h1, mid: lerp(B, C, 0.5) },
      { id: 'q2' + tag, a: P, b: d.E, col: ORNG, t: 'h\u2082', v: d.h2, mid: lerp(C, A, 0.5) },
      { id: 'q3' + tag, a: P, b: d.F, col: GREEN, t: 'h\u2083', v: d.h3, mid: midAB }
    ];
    segs.forEach(function (s, i) {
      var isZero = s.v < 0.5;
      out.push({ id: s.id, k: 'line', a: s.a, b: s.b, stroke: s.col, sw: 4, dash: isZero ? [5, 5] : null });
      // 距离为 0 时 P 与垂足重合，标签不能贴着 P 放，改放到那条边的中点外侧
      out.push({
        id: 'L' + tag + i, k: 'text',
        at: isZero ? outward(s.mid, 24) : lblAt(P, s.b, 20),
        text: s.t + ' = ' + (isZero ? '0' : r1(s.v)), size: 16, fill: s.col
      });
    });
    // 求和读数
    out.push({
      id: 'sum' + tag, k: 'text', at: [400, 502],
      text: (d.h1 < 0.5 ? '0' : r1(d.h1)) + ' + ' + (d.h2 < 0.5 ? '0' : r1(d.h2)) +
            ' + ' + (d.h3 < 0.5 ? '0' : r1(d.h3)) + ' = ' + r1(HGT),
      size: 22, fill: INK
    });
    return out;
  }

  function idsOf(arr) { return arr.map(function (s) { return s.id; }); }

  var s0 = snap(P0, '0', 'P');
  var s1 = snap(P1, '1', 'P');
  var s2 = snap(A, '2', 'P 落在顶点 A');

  /* ============================================================
     方法一：量一量（tier = demo）
     ============================================================ */

  var m1 = [
    {
      say: '先看一个等边三角形，三条边一样长，都记作 a。',
      cite: '等边三角形：三边相等，三个内角都是 60°',
      why: '“三条边相等”这个条件，后面是本题能成立的根本原因，不是装饰。',
      add: [tri].concat(vnames)
    },
    {
      say: '三条边都标上 a。请注意：它们是完全相等的三个数，不是三个不同的数。',
      cite: '等边的三条边长度相同',
      why: '等会儿要把 a 当成公共的底提出来——只有真的相等才提得出来。',
      add: sideMarks
    },
    {
      say: '在三角形内部随便点一个 P，量出它到三条边的距离：' + r1(d0.h1) + '、' + r1(d0.h2) + '、' +
           r1(d0.h3) + '。三个数加起来是 ' + r1(HGT) + '。',
      cite: '点到直线的距离，就是垂线段的长度',
      why: '注意每个垂足处的小直角——距离必须是垂直的那一段，斜着画的线不算。',
      add: [S.pg, S.nP, S.l1, S.m1, S.nD, S.lh1, S.l2, S.m2, S.nE, S.lh2, S.l3, S.m3, S.nF, S.lh3].concat(s0),
      eq: 'h\u2081 + h\u2082 + h\u2083 = ' + r1(d0.h1) + ' + ' + r1(d0.h2) + ' + ' + r1(d0.h3) + ' = ' + r1(HGT),
      hold: 2800
    },
    {
      say: '换个位置再量一次：' + r1(dists(P1).h1) + '、' + r1(dists(P1).h2) + '、' + r1(dists(P1).h3) +
           '。单个数字全变了，可是加起来，还是 ' + r1(HGT) + '。',
      cite: '重复测量：换一个位置，观察和会不会变',
      why: '三个数里有变大的、有变小的，和却一点不动——这不是巧合的样子。',
      delNow: idsOf(s0).concat(idsOf([S.pg, S.nP, S.l1, S.m1, S.nD, S.lh1, S.l2, S.m2, S.nE, S.lh2, S.l3, S.m3, S.nF, S.lh3])),
      add: s1,
      eq: 'h\u2081 + h\u2082 + h\u2083 = ' + r1(HGT) + '（没变）',
      hold: 2800
    },
    {
      say: '于是我们猜想：P 到三边的距离之和，永远等于三角形的高。但请注意——这只是猜想。',
      cite: '有限次验证 ≠ 证明',
      why: '量一万个位置，也不能保证第一万零一个位置还成立。数学要的是“对任意一个 P 都能保证”，这就是下面要做的证明。',
      eq: '猜想：h\u2081 + h\u2082 + h\u2083 = H（对任意 P ?）',
      hold: 3800
    }
  ];

  /* ============================================================
     方法二：面积法（tier = proof）—— 唯一完整的证明
     ============================================================ */

  var m2 = [
    {
      say: '现在来证明。第一步，把已知条件写清楚：等边三角形，边长 a，高 H。',
      cite: '已知：△ABC 是等边三角形，边长 a，高 H',
      why: '证明的每一步都必须只依赖已知条件和已证的定理。H 就是我们要比较的那个定值。',
      add: [tri].concat(vnames).concat(sideMarks).concat(alt)
    },
    {
      say: 'P 是三角形内部的任意一点。请留意“内部”和“任意”这两个词。',
      cite: '题设：P 在 △ABC 内部，位置任意',
      why: '“内部”保证了下一步能把三角形完整剖分；“任意”意味着整个证明里不能用到 P 的具体坐标。',
      add: [S.pg, S.nP]
    },
    {
      say: '定义 h₁、h₂、h₃：P 到三条边的垂线段长度。',
      cite: '点到直线的距离 = 垂线段的长度',
      why: '这不是随便一条线，必须是垂直于那条边的那一段——垂线段最短，所以它才叫距离。',
      add: [S.l1, S.m1, S.nD, S.lh1, S.l2, S.m2, S.nE, S.lh2, S.l3, S.m3, S.nF, S.lh3]
    },
    {
      say: '连 PA、PB、PC。大三角形被切成三块，互不重叠，合起来不重不漏。',
      cite: '剖分：三条线段只在 P 相交，且都落在三角形内部',
      why: '这一步能成立，全靠“P 在内部”。如果 P 跑到外面去，切出来的三块就不是这样拼的了。',
      add: [S.pa, S.pb, S.pc]
    },
    {
      say: '第一块，三角形 PAB：底是 AB，长度 a；高是 P 到 AB 的距离 h₃。',
      cite: '三角形面积 = ½ × 底 × 高',
      why: '底和高都确定，这块的面积就唯一确定，不需要再量。',
      add: [S.t3],
      eq: 'S\u2081 = ½ · a · h\u2083'
    },
    {
      say: '第二块，三角形 PBC：底是 BC，也是 a；高是 h₁。',
      cite: '同一个面积公式，底换成 BC',
      why: '底边换成另一条边，高就必须跟着换成到那条边的距离，两者要配对。',
      add: [S.t1],
      eq: 'S\u2082 = ½ · a · h\u2081'
    },
    {
      say: '第三块，三角形 PCA：底是 CA，还是 a；高是 h₂。',
      cite: '同一个面积公式，底换成 CA',
      why: '到这里，三条边都当过一次底了——这正是等边三角形的好处：三次的底都是同一个数。',
      add: [S.t2],
      eq: 'S\u2083 = ½ · a · h\u2082'
    },
    {
      say: '三块互不重叠，合起来正好是整个三角形，所以它们的面积加起来，等于大三角形的面积。',
      cite: '面积可加性：不重叠的两块拼在一起，面积等于两块之和',
      why: '这一条是面积这个概念本身的性质，不用证明，可以直接用。',
      upd: [
        { id: 't3', op: 0.62 }, { id: 't1', op: 0.62 }, { id: 't2', op: 0.62 }
      ],
      eq: 'S\u2081 + S\u2082 + S\u2083 = S\u25B3ABC'
    },
    {
      say: '那大三角形的面积呢？还是同一个公式：底是 a，高是整个三角形的高 H。',
      cite: '三角形面积公式，底取 AB，高取 H',
      why: '注意这里用的公式和前三块是同一个，所以两边可以直接比较。',
      eq: 'S\u25B3ABC = ½ · a · H',
      hold: 2400
    },
    {
      say: '两个式子算的是同一块面积，所以可以把它们连起来。',
      cite: '等量代换：都等于同一个量，所以彼此相等',
      why: '左边是“三块之和”，右边是“整体”，而三块拼起来就是整体。',
      eq: '½a·h\u2081 + ½a·h\u2082 + ½a·h\u2083 = ½a·H',
      hold: 2600
    },
    {
      say: '左边提出公因式 ½a，变成 ½a 乘上括号里三个 h 的和。',
      cite: '乘法分配律',
      why: '三个式子都含 ½a 这个因子，所以能提出来。',
      eq: '½a·(h\u2081 + h\u2082 + h\u2083) = ½a·H'
    },
    {
      say: '两边同时除以 ½a。因为 a 是正数，这个除法完全合法，等式依然成立。',
      cite: '等式性质：两边同除以同一个非零数，等式不变',
      why: '这一步是整道题的关键——a 被约掉了，所以答案里不会出现 a。',
      eq: 'h\u2081 + h\u2082 + h\u2083 = H',
      hold: 3000
    },
    {
      say: '现在回答最关键的问题：为什么这个结论跟 P 的位置无关？回看前面每一步——我们只用到了“P 在内部”，没有任何一步用到 P 的坐标。',
      cite: '全称命题：推导中没有使用 P 的具体位置，故对任意 P 成立',
      why: '这正是“任意”两个字的用处：证明里不能偷偷用到某个特定位置的性质。',
      eq: '对任意 P 在内部：h\u2081 + h\u2082 + h\u2083 = H',
      hold: 3400
    },
    {
      say: '再检查一下“等边”这个条件用在哪：三条底都等于 a，才能提出公因式 ½a。如果三条边不一样长，就只能得到加权和。',
      cite: '等边条件的作用：三边相等，才能提出公共因子',
      why: '一般三角形只能得到 a·h₁ + b·h₂ + c·h₃ = 2S。所以“等边”是本质条件，换成普通三角形结论就不成立了。',
      eq: '一般三角形：a·h\u2081 + b·h\u2082 + c·h\u2083 = 2S（不相等）',
      hold: 3600
    },
    {
      say: '右边这把尺子，就是把刚证完的结论画出来：三段首尾相接摞起来，正好和 H 一样长。',
      cite: '结论的可视化，不是证明本身',
      why: '注意：这把尺子是“给你看结论长什么样”，证明已经在前面十几步里写完了。别把它当证明。',
      add: stack,
      eq: 'h\u2081 + h\u2082 + h\u2083 = H',
      hold: 3000
    },
    {
      say: '证明结束。这条结论叫维维亚尼定理，1659 年由意大利数学家维维亚尼给出。',
      cite: '维维亚尼（Vincenzo Viviani），1659',
      why: '它还有一个更一般的版本：正多边形内一点到各边的距离之和也是定值。',
      add: [{ id: 'final', k: 'text', at: [400, 26], text: 'h\u2081 + h\u2082 + h\u2083 = 高 H（对任意 P 成立）', size: 22, fill: INK }],
      eq: 'H = (√3 / 2) · a ≈ 0.866a',
      hold: 3800
    }
  ];

  /* ============================================================
     方法三：特殊位置法（tier = corollary，依赖方法二）
     ============================================================ */

  var m3 = [
    {
      say: '这个方法最短，但它有一个前提：必须先用面积法证明“和是定值”。没有那个前提，下面每一步都只是猜测。',
      cite: '推论：本方法依赖方法二的结论',
      why: '这也是它排在方法二后面的原因——顺序不能颠倒，颠倒了就是循环论证。',
      add: [tri].concat(vnames).concat(sideMarks)
    },
    {
      say: '题干说“任意一点”，而我们已经证明：对任意一点，和都等于 H。所以可以挑一个最省事的位置。',
      cite: '全称命题成立，则可以取任意一个特例',
      why: '注意逻辑方向：是先证明“对所有 P 都成立”，然后才允许“挑一个 P”。反过来不成立。',
      eq: '已证：∀P，h\u2081+h\u2082+h\u2083 = H'
    },
    {
      say: '那就让 P 落在顶点 A 上。',
      cite: '取特例：P = A',
      why: '顶点是边界点，按道理要单独说明。下面一步就是补这个说明。',
      add: s2
    },
    {
      say: '算三个距离：A 到 BC 的距离，就是三角形的高 H；A 在直线 CA 上，所以到 CA 的距离是 0；A 也在直线 AB 上，到 AB 的距离还是 0。',
      cite: '点在直线上 ⇒ 到该直线的距离为 0',
      why: '严格说，P 落在顶点时，前面那个剖分退化成两个面积为 0 的三角形，面积公式依然成立；也可以由内部点取极限得到。所以取顶点是合法的。',
      eq: 'h\u2081 = H，h\u2082 = 0，h\u2083 = 0',
      hold: 3400
    },
    {
      say: '所以 h₁ + h₂ + h₃ 就是 H 加 0 加 0，等于 H。三秒算完。',
      cite: '代入求和',
      why: '难算的部分被完全绕开了，我们从来没有算过“任意位置的三段分别是多少”。',
      eq: 'h\u2081 + h\u2082 + h\u2083 = H + 0 + 0 = H',
      hold: 2800
    },
    {
      say: '但要记住它的定位：这个方法只负责“算得快”，不负责“证明为什么”。原理和证明，都在方法二里。',
      cite: '方法定位：速算技巧，不是证明',
      why: '如果只看这一段，你只是猜到了答案。数学的分量在证明那一边。',
      add: [{ id: 'final2', k: 'text', at: [400, 26], text: '速算靠方法三 · 证明靠方法二', size: 21, fill: INK }],
      eq: 'H = (√3 / 2) · a ≈ 0.866a',
      hold: 3600
    }
  ];

  window.MATHLAB_LESSONS = window.MATHLAB_LESSONS || [];
  window.MATHLAB_LESSONS.push({
    id: 'viviani',
    title: '三角形内一点到三边的距离，加起来为什么是定值',
    grade: '初二',
    topic: '几何 · 定值',
    tags: ['几何', '定值', '面积法', '证明'],
    question: '在等边三角形 ABC 的内部随便点一个点 P，它到三条边的距离分别是 h₁、h₂、h₃。这三个数加起来等于多少？换一个 P 会变吗？',
    thumbStep: 2,
    methods: [
      {
        name: '先量一量', tier: 'demo',
        sub: '只能得到猜想，还不是证明',
        steps: m1
      },
      {
        name: '面积法：切成三块', tier: 'proof',
        sub: '严格证明 · 只用面积公式和剖分',
        steps: m2
      },
      {
        name: '特殊位置法：挪到顶点', tier: 'corollary',
        sub: '推论 · 必须先看方法二',
        needs: '面积法',
        needsMsg: '本方法依赖方法二（面积法）已证得的结论：对任意 P，h₁+h₂+h₃ = H。没有这个前提，挪位置只是在猜。',
        steps: m3
      }
    ]
  });
})();
