/* ============================================================
   维维亚尼定理（Viviani, 1659）
   等边三角形内任取一点 P，P 到三边的距离之和恒等于三角形的高。
   解法一：面积法 —— 把大三角形切成三块小三角形
   解法二：特殊位置法 —— 既然是定值，就把 P 挪到顶点
   ------------------------------------------------------------
   所有坐标一律由代码算，绝不手填数值（见 SPEC.md 失败模式第 1 条）。
   ============================================================ */
(function () {
  var G = ML;
  var INK = '#16202f';
  var BLUE = '#2563eb', ORNG = '#ef8b0c', GREEN = '#0f9d68', GREY = '#8a94a6';

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
  var tri = { id: 'tri', k: 'poly', pts: [A, B, C], fill: '#eff3fb', stroke: INK, sw: 2.6 };

  var vnames = [
    { id: 'nA', k: 'text', at: [A[0] - 26, A[1] + 24], text: 'A', size: 19, fill: INK },
    { id: 'nB', k: 'text', at: [B[0] + 24, B[1] + 24], text: 'B', size: 19, fill: INK },
    { id: 'nC', k: 'text', at: [C[0], C[1] - 26], text: 'C', size: 19, fill: INK }
  ];

  var midAB = lerp(A, B, 0.5), midBC = lerp(B, C, 0.5), midCA = lerp(C, A, 0.5);

  var sideMarks = [
    { id: 'sa1', k: 'line', a: A, b: B, stroke: BLUE, sw: 5 },
    { id: 'sa2', k: 'line', a: B, b: C, stroke: BLUE, sw: 5 },
    { id: 'sa3', k: 'line', a: C, b: A, stroke: BLUE, sw: 5 },
    { id: 'la1', k: 'text', at: [midAB[0], midAB[1] + 54], text: 'a', size: 18, fill: BLUE },
    // 斜边上的 a 放在靠近顶点 C 的内侧：
    // 垂足 D、E 本来就落在两条边的中点附近，把 a 放在中点外侧会和 D/E 的标签黏在一起。
    { id: 'la2', k: 'text', at: innerLabel(C, B, 0.28, 26), text: 'a', size: 18, fill: BLUE },
    { id: 'la3', k: 'text', at: innerLabel(C, A, 0.28, 26), text: 'a', size: 18, fill: BLUE }
  ];

  /* ============================================================
     解法一：面积法
     ============================================================ */

  var P0 = [370, 310];
  var d0 = dists(P0);

  var S = {
    pg: { id: 'pg', k: 'circ', c: P0, r: 7, fill: BLUE, stroke: '#ffffff', sw: 2 },
    nP: { id: 'nP', k: 'text', at: [P0[0] - 2, P0[1] - 28], text: 'P', size: 18, fill: INK },

    l3: { id: 'l3', k: 'line', a: P0, b: d0.F, stroke: GREEN, sw: 3.5 },
    m3: { id: 'm3', k: 'poly', pts: rmark(d0.F, P0, B), fill: 'none', stroke: GREEN, sw: 1.6 },
    nF: { id: 'nF', k: 'text', at: [d0.F[0] - 18, d0.F[1] + 20], text: 'F', size: 17, fill: INK },
    lh3: { id: 'lh3', k: 'text', at: lblAt(P0, d0.F), text: 'h\u2083', size: 18, fill: GREEN },

    l1: { id: 'l1', k: 'line', a: P0, b: d0.D, stroke: BLUE, sw: 3.5 },
    m1: { id: 'm1', k: 'poly', pts: rmark(d0.D, P0, C), fill: 'none', stroke: BLUE, sw: 1.6 },
    nD: { id: 'nD', k: 'text', at: outward(d0.D, 26), text: 'D', size: 17, fill: INK },
    lh1: { id: 'lh1', k: 'text', at: lblAt(P0, d0.D), text: 'h\u2081', size: 18, fill: BLUE },

    l2: { id: 'l2', k: 'line', a: P0, b: d0.E, stroke: ORNG, sw: 3.5 },
    m2: { id: 'm2', k: 'poly', pts: rmark(d0.E, P0, A), fill: 'none', stroke: ORNG, sw: 1.6 },
    nE: { id: 'nE', k: 'text', at: outward(d0.E, 38), text: 'E', size: 17, fill: INK },
    lh2: { id: 'lh2', k: 'text', at: lblAt(P0, d0.E), text: 'h\u2082', size: 18, fill: ORNG },

    pa: { id: 'pa', k: 'line', a: P0, b: A, stroke: INK, sw: 1.8, dash: [6, 5] },
    pb: { id: 'pb', k: 'line', a: P0, b: B, stroke: INK, sw: 1.8, dash: [6, 5] },
    pc: { id: 'pc', k: 'line', a: P0, b: C, stroke: INK, sw: 1.8, dash: [6, 5] },

    t3: { id: 't3', k: 'poly', pts: [P0, A, B], fill: GREEN, stroke: 'none', op: 0.22 },
    t1: { id: 't1', k: 'poly', pts: [P0, B, C], fill: BLUE, stroke: 'none', op: 0.22 },
    t2: { id: 't2', k: 'poly', pts: [P0, C, A], fill: ORNG, stroke: 'none', op: 0.22 }
  };

  // 三角形整体的高：C 到底边 AB 的垂足 G
  var gFoot = perp(C, A, B).foot;

  var alt = [
    { id: 'alt', k: 'line', a: C, b: gFoot, stroke: INK, sw: 3.2, dash: [9, 7] },
    { id: 'mAlt', k: 'poly', pts: rmark(gFoot, C, B, 16), fill: 'none', stroke: INK, sw: 1.6 },
    { id: 'nG', k: 'text', at: [gFoot[0] - 18, gFoot[1] + 20], text: 'G', size: 17, fill: INK },
    // H 的标签往下挪：y 取中线会正好压住 h₁ 的标签
    { id: 'lhH', k: 'text', at: [gFoot[0] + 34, 380], text: 'H', size: 19, fill: INK }
  ];

  /* ---- 右边那把「尺子」：三段首尾相接摞起来 ---- */
  var BX = 760, BW = 36;
  var y0 = 440;                       // 底边高度
  var y1 = y0 - d0.h1;
  var y2 = y1 - d0.h2;
  var y3 = y2 - d0.h3;                // 应该正好等于 C[1]

  var stack = [
    // 两条对齐辅助线：底边水平线、顶点水平线
    { id: 'gd1', k: 'line', a: [B[0], y0], b: [BX - 6, y0], stroke: GREY, sw: 1.6, dash: [7, 6] },
    { id: 'gd2', k: 'line', a: [C[0], y3], b: [BX - 6, y3], stroke: GREY, sw: 1.6, dash: [7, 6] },
    // 三段
    { id: 'b1', k: 'rect', x: BX, y: y1, w: BW, h: d0.h1, fill: BLUE, stroke: INK, sw: 2, op: 0.9 },
    { id: 'b2', k: 'rect', x: BX, y: y2, w: BW, h: d0.h2, fill: ORNG, stroke: INK, sw: 2, op: 0.9 },
    { id: 'b3', k: 'rect', x: BX, y: y3, w: BW, h: d0.h3, fill: GREEN, stroke: INK, sw: 2, op: 0.9 },
    // 三段的标签
    { id: 'lb1', k: 'text', at: [BX + BW + 18, (y0 + y1) / 2], text: 'h\u2081', size: 16, fill: BLUE },
    { id: 'lb2', k: 'text', at: [BX + BW + 18, (y1 + y2) / 2], text: 'h\u2082', size: 16, fill: ORNG },
    { id: 'lb3', k: 'text', at: [BX + BW + 18, (y2 + y3) / 2], text: 'h\u2083', size: 16, fill: GREEN },
    // 总高括线
    { id: 'brace', k: 'line', a: [BX + BW + 44, y0], b: [BX + BW + 44, y3], stroke: INK, sw: 2 },
    { id: 'capT', k: 'line', a: [BX + BW + 38, y3], b: [BX + BW + 50, y3], stroke: INK, sw: 2 },
    { id: 'capB', k: 'line', a: [BX + BW + 38, y0], b: [BX + BW + 50, y0], stroke: INK, sw: 2 },
    { id: 'lbH', k: 'text', at: [BX + BW + 66, (y0 + y3) / 2], text: 'H', size: 19, fill: INK }
  ];

  var m1 = [
    {
      say: '这是一个等边三角形 ABC，三条边一样长。',
      why: '等边三角形：三边相等，三个内角都是 60°。题目里“等边”这两个字，后面每一步都要用到。',
      add: [tri].concat(vnames)
    },
    {
      say: '把边长记作 a —— 三条边都是 a。',
      why: '后面拆出来的三个小三角形，都以 a 作底，所以这个 a 是公共的。',
      add: sideMarks
    },
    {
      say: '在三角形内部随便点一个点 P。',
      why: '注意“随便”两个字 —— 这道题的结论跟 P 在哪里毫无关系，这一点到最后会看得很清楚。',
      add: [S.pg, S.nP]
    },
    {
      say: '从 P 向底边 AB 作垂线，垂足 F，这条垂线的长度记作 h\u2083。',
      why: '点到直线的距离，就是这条垂线段的长度。垂线段最短，所以只有它才是“距离”。',
      add: [S.l3, S.m3, S.nF, S.lh3]
    },
    {
      say: '同样地，向 BC 作垂线得 D、向 CA 作垂线得 E，长度分别是 h\u2081 和 h\u2082。',
      why: '三条边地位完全相同，所以作垂线的方法也完全一样，只是方向不同。',
      add: [S.l1, S.m1, S.nD, S.lh1, S.l2, S.m2, S.nE, S.lh2]
    },
    {
      say: '连接 PA、PB、PC —— 大三角形被分成了三块。',
      why: '这三条线都落在三角形内部，所以它们一定把大三角形不重不漏地分成三块。',
      add: [S.pa, S.pb, S.pc]
    },
    {
      say: '第一块 △PAB：底是 AB，长 a；高就是刚才那条垂线 h\u2083。',
      why: '三角形面积 = ½ × 底 × 高，这里的“高”必须是垂直于底的那条，正是 h\u2083。',
      add: [S.t3],
      eq: 'S△PAB = ½ · a · h\u2083'
    },
    {
      say: '第二块 △PBC：底是 BC，也是 a；高是 PD，也就是 h\u2081。',
      why: '等边三角形三边相等，所以底仍然是 a，只是高换成了 h\u2081。',
      add: [S.t1],
      eq: 'S△PBC = ½ · a · h\u2081'
    },
    {
      say: '第三块 △PCA：底是 CA，还是 a；高是 PE，也就是 h\u2082。',
      why: '同一个公式套三次，唯一在变的就是那个“高”。',
      add: [S.t2],
      eq: 'S△PCA = ½ · a · h\u2082'
    },
    {
      say: '三块拼起来，正好是原来的大三角形，不多一块、也不少一块。',
      why: '所以三块的面积和，就等于大三角形的面积。',
      upd: [
        { id: 't3', op: 0.34 }, { id: 't1', op: 0.34 }, { id: 't2', op: 0.34 }
      ],
      eq: 'S△PAB + S△PBC + S△PCA = S△ABC'
    },
    {
      say: '那大三角形的面积怎么算？还是底 a，高换成整个三角形的高 H（从 C 垂直到底边）。',
      why: '同一个面积公式。底一样是 a，高换成三角形整体的高 H。',
      add: alt,
      eq: 'S△ABC = ½ · a · H'
    },
    {
      say: '两个算式算的是同一块面积，所以它们相等。两边同时约掉 ½·a。',
      why: '等式两边同时除以同一个正数 ½a，等式仍然成立 —— 这就是 a 消失的原因。',
      eq: '½·a·(h\u2081+h\u2082+h\u2083) = ½·a·H  ⟹  h\u2081+h\u2082+h\u2083 = H',
      hold: 2600
    },
    {
      say: '看右边这把尺子：把三段垂线首尾相接摞起来，正好和三角形的高一样长。',
      why: '这不是巧合 —— 上面的等式说的就是这件事：三段加起来，恰好等于 H。',
      add: stack,
      eq: 'h\u2081 + h\u2082 + h\u2083 = H',
      hold: 2800
    },
    {
      say: '所以：等边三角形内任取一点 P，它到三边的距离之和，永远是这条高 —— 跟 P 在哪毫无关系。',
      why: '这个结论叫“维维亚尼定理”，1659 年由意大利数学家维维亚尼（Viviani）给出。',
      add: [{ id: 'final', k: 'text', at: [400, 26], text: 'h\u2081 + h\u2082 + h\u2083 = 高 H（定值）', size: 21, fill: INK }],
      eq: 'h\u2081 + h\u2082 + h\u2083 = H = (√3 / 2) · a ≈ 0.866a',
      hold: 3400
    }
  ];

  /* ============================================================
     解法二：特殊位置法
     ============================================================ */

  var P1 = lerp(P0, A, 0.55);

  function snap(P, tag, title) {
    var d = dists(P);
    var out = [
      { id: 'c' + tag, k: 'circ', c: P, r: 7, fill: BLUE, stroke: '#ffffff', sw: 2 },
      { id: 't' + tag, k: 'text', at: [P[0], P[1] - 28], text: title, size: 17, fill: INK }
    ];
    // 三条垂线
    var segs = [
      { id: 'q1' + tag, a: P, b: d.D, col: BLUE, t: 'h\u2081', v: d.h1, mid: midBC },
      { id: 'q2' + tag, a: P, b: d.E, col: ORNG, t: 'h\u2082', v: d.h2, mid: midCA },
      { id: 'q3' + tag, a: P, b: d.F, col: GREEN, t: 'h\u2083', v: d.h3, mid: midAB }
    ];
    segs.forEach(function (s, i) {
      var isZero = s.v < 0.5;
      out.push({ id: s.id, k: 'line', a: s.a, b: s.b, stroke: s.col, sw: 3.4, dash: isZero ? [5, 5] : null });
      // 距离为 0 时 P 与垂足重合，标签不能贴着 P 放，改放到那条边的中点外侧
      out.push({
        id: 'L' + tag + i, k: 'text',
        at: isZero ? outward(s.mid, 24) : lblAt(P, s.b, 20),
        text: s.t + ' = ' + (isZero ? '0' : r1(s.v)), size: 15, fill: s.col
      });
    });
    // 求和读数
    out.push({
      id: 'sum' + tag, k: 'text', at: [400, 500],
      text: (d.h1 < 0.5 ? '0' : r1(d.h1)) + ' + ' + (d.h2 < 0.5 ? '0' : r1(d.h2)) +
            ' + ' + (d.h3 < 0.5 ? '0' : r1(d.h3)) + ' = ' + r1(HGT),
      size: 21, fill: INK
    });
    return out;
  }

  function idsOf(arr) { return arr.map(function (s) { return s.id; }); }

  var s0 = snap(P0, '0', 'P');
  var s1 = snap(P1, '1', 'P');
  var s2 = snap(A, '2', 'P 就在 A 处');

  var m2 = [
    {
      say: '还是这个等边三角形。P 在中间，三条垂线量出来是 ' + r1(d0.h1) + '、' + r1(d0.h2) + '、' + r1(d0.h3) + '。',
      why: '先把这三段量出来，一会儿要看它们的和会不会变。',
      add: [tri].concat(vnames).concat(s0),
      eq: 'h\u2081 + h\u2082 + h\u2083 = ' + r1(d0.h1) + ' + ' + r1(d0.h2) + ' + ' + r1(d0.h3) + ' = ' + r1(HGT),
      hold: 2600
    },
    {
      say: '加起来是 ' + r1(HGT) + '。记住这个数 —— 它正好等于三角形的高。',
      why: '如果这个和真的是定值，那么把 P 挪到任何地方，它都不应该变。',
      eq: 'h\u2081 + h\u2082 + h\u2083 = ' + r1(HGT) + ' = H',
      hold: 2600
    },
    {
      say: '现在把 P 挪到靠近顶点 A 的位置，重新量一次。',
      why: '换一个位置，是检验“定值”最直接的办法。',
      delNow: idsOf(s0),
      add: s1,
      eq: 'h\u2081 + h\u2082 + h\u2083 = ' + r1(dists(P1).h1) + ' + ' + r1(dists(P1).h2) + ' + ' + r1(dists(P1).h3) + ' = ' + r1(HGT),
      hold: 2600
    },
    {
      say: '三段长度全都变了：一条变长，两条变短。可是加起来 —— 还是 ' + r1(HGT) + '，一动不动。',
      why: '解法一已经证明：这个和是定值。既然是定值，就说明它跟 P 的位置无关。',
      eq: 'h\u2081 + h\u2082 + h\u2083 = ' + r1(HGT) + '（没变）',
      hold: 2800
    },
    {
      say: '那就干脆把 P 搬到顶点 A 上去 —— 反正结果一样，为什么要挑难算的位置？',
      why: '这就是“特殊位置法”：题目说随便取一点，那就取一个最好算的点。',
      delNow: idsOf(s1),
      add: s2,
      eq: 'h\u2081 = ' + r1(HGT) + '，h\u2082 = 0，h\u2083 = 0',
      hold: 2600
    },
    {
      say: 'P 落在 A 点时，它就在 AB 和 CA 上，到这两条边的距离当然是 0；到 BC 的距离，正好是整个三角形的高。',
      why: '一个点就在这条直线上，它到这条直线的距离就是 0 —— 不需要算，这是最省事的位置。',
      eq: 'h\u2081 + h\u2082 + h\u2083 = H + 0 + 0',
      hold: 2800
    },
    {
      say: '所以答案就是：等于三角形的高。口算三步，结束。',
      why: '难算的部分（三个距离分别多少）被完全绕开了，只利用了“和是定值”这一条。',
      add: alt,
      eq: 'h\u2081 + h\u2082 + h\u2083 = H',
      hold: 2600
    },
    {
      say: '这个套路记住：题目说“随便取一点”，那就先把它挪到顶点、中点、圆心这些最好算的地方。',
      why: '但前提是 —— 你得先用解法一证明它确实是定值，否则挪位置只是在猜。',
      add: [{ id: 'final2', k: 'text', at: [400, 26], text: 'h\u2081 + h\u2082 + h\u2083 = 高 H（与 P 无关）', size: 21, fill: INK }],
      eq: 'H = (√3 / 2) · a ≈ 0.866a',
      hold: 3400
    }
  ];

  window.MATHLAB_LESSONS = window.MATHLAB_LESSONS || [];
  window.MATHLAB_LESSONS.push({
    id: 'viviani',
    title: '三角形内一点到三边的距离，加起来为什么是定值',
    grade: '初二',
    topic: '几何 · 定值',
    tags: ['几何', '定值', '面积法', '割补'],
    question: '在等边三角形 ABC 的内部随便点一个点 P，它到三条边的距离分别是 h₁、h₂、h₃。这三个数加起来等于多少？换一个 P 会变吗？',
    thumbStep: 4,
    methods: [
      { name: '面积法：切成三块', sub: '三块加起来就是大三角形', steps: m1 },
      { name: '特殊位置法：把点挪到顶点', sub: '既然是定值，就挑最好算的地方', steps: m2 }
    ]
  });
})();
