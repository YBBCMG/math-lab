/* ============================================================
   手拉手模型（两个等边三角形共顶点）
   ------------------------------------------------------------
   △ABC、△ADE 都是等边三角形，共用顶点 A，连接 BD、CE。
   结论一：BD = CE
   结论二：BD 与 CE 的夹角恒为 60°

   讲稿结构（严格区分「证明 / 推论」）：
     方法一 · SAS 全等      tier=proof   —— 证 BD = CE
     方法二 · 角度追踪      tier=proof   —— 证夹角 60°
     方法三 · 旋转          tier=corollary，依赖方法一 —— 换视角看本质

   每一步都带：
     say  讲解（同时用来生成配音）
     cite 依据（引用的定理/性质，界面上单独显示）
     why  补充说明（这一步凭什么能用）

   坐标一律由代码算（角度 + 边长 → 点），不手填数值。
   关键几何已离线核过：|BD| = |CE| = 374.89，两线夹角 60.00°。
   ============================================================ */
(function () {
  var G = ML;
  var INK = '#16202f';

  /* ---------- 配色 ---------- */
  var BLUE = '#0f5ef7';    // 蓝边（△ABC）
  var ORNG = '#f97316';    // 橙边（△ADE）
  var GREEN = '#00a86b';   // 全等的一对（△ABD / △ACE）
  var RED = '#e11d48';     // 关键角 / 结论
  var GREY = '#7c8aa0';    // 公共角 / 辅助

  var FILL_B = '#dbe7ff';  // △ABC 底色
  var FILL_O = '#ffe8d6';  // △ADE 底色
  var OP_HL = 0.38;        // 高亮填充

  /* ---------- 向量小工具 ---------- */
  function sub(p, q) { return [p[0] - q[0], p[1] - q[1]]; }
  function add(p, q) { return [p[0] + q[0], p[1] + q[1]]; }
  function mul(p, k) { return [p[0] * k, p[1] * k]; }
  function len(p) { return Math.sqrt(p[0] * p[0] + p[1] * p[1]); }
  function unit(p) { var L = len(p) || 1; return [p[0] / L, p[1] / L]; }
  function lerp(p, q, t) { return [p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t]; }

  // 直线 P1P2 与 P3P4 的交点（可能在线段外，调用方自己判断）
  function inter(P1, P2, P3, P4) {
    var d1 = sub(P2, P1), d2 = sub(P4, P3);
    var den = d1[0] * d2[1] - d1[1] * d2[0];
    if (Math.abs(den) < 1e-9) return null;
    var t = ((P3[0] - P1[0]) * d2[1] - (P3[1] - P1[1]) * d2[0]) / den;
    return add(P1, mul(d1, t));
  }

  /* ---------- 基本图形：两个等边三角形 ---------- */
  var A = [471, 332];
  var S1 = 240;                               // △ABC 边长（像素）
  var S2 = 192;                               // △ADE 边长
  var B = G.pt(A[0], A[1], S1, 150);
  var C = G.pt(A[0], A[1], S1, 90);
  var D = G.pt(A[0], A[1], S2, 30);
  var E = G.pt(A[0], A[1], S2, -30);

  var P = inter(B, D, C, E);                  // BD 与 CE 的交点
  var O = inter(B, D, A, C);                  // BD 与 AC 的交点

  /* ---------- 等长记号：边中点处画 n 条垂直短线 ---------- */
  function tickSegs(X, Y, n, half) {
    var u = unit(sub(Y, X)), w = [-u[1], u[0]];
    var mid = lerp(X, Y, 0.5);
    var out = [];
    for (var i = 0; i < n; i++) {
      var off = (i - (n - 1) / 2) * 8;
      var c = add(mid, mul(u, off));
      out.push([add(c, mul(w, -half)), add(c, mul(w, half))]);
    }
    return out;
  }
  function ticks(idBase, color, segs, sw) {
    return segs.map(function (s, i) {
      return { id: idBase + i, k: 'line', a: s[0], b: s[1], stroke: color, sw: sw || 3 };
    });
  }

  /* ---------- 顶点标注 ---------- */
  function vlabel(id, V, from, dist) {
    var p = add(V, mul(unit(sub(V, from)), dist));
    return { id: id, k: 'text', at: p, text: id.slice(1), size: 21, fill: INK };
  }

  var names = [
    vlabel('nA', A, lerp(B, E, 0.3), 30),      // A 的标签往左下挪，避开三条边
    vlabel('nB', B, A, 30),
    vlabel('nC', C, A, 28),
    vlabel('nD', D, A, 30),
    vlabel('nE', E, A, 30)
  ];
  names[0].at = [A[0] - 26, A[1] + 26];        // A 单独微调：避开 AC 与 AE

  /* ---------- 角弧工具 ---------- */
  function arcAt(id, V, X, Y, r, color, sw) {
    var w = G.wedge(V, X, Y);
    return { id: id, k: 'arc', c: V, r: r, from: w.from, to: w.to, stroke: color, sw: sw || 3.2 };
  }
  function sectorAt(id, V, X, Y, r, color, op, sw) {
    var w = G.wedge(V, X, Y);
    return { id: id, k: 'sector', c: V, r: r, from: w.from, to: w.to,
             fill: color, stroke: color, sw: sw == null ? 1.5 : sw, op: op };
  }
  // 某个方向角上、距顶点 r 的位置（放角度数字用）
  function atDir(V, r, deg) { return G.pt(V[0], V[1], r, deg); }

  // 角度数字的落点：一律取角平分线方向 r 处（手填方位角会算错，别手填）
  function midAt(V, X, Y, r) {
    var w = G.wedge(V, X, Y);
    return atDir(V, r, w.from + w.deg / 2);
  }

  /* ---------- 静态骨架元素 ---------- */
  var triABC = { id: 'tABC', k: 'poly', pts: [A, B, C], fill: FILL_B, stroke: BLUE, sw: 3 };
  var triADE = { id: 'tADE', k: 'poly', pts: [A, D, E], fill: FILL_O, stroke: ORNG, sw: 3 };

  // 三条蓝边 / 三条橙边（画在面之上，颜色更实）
  function edge(id, X, Y, color) { return { id: id, k: 'line', a: X, b: Y, stroke: color, sw: 4.5 }; }
  var edgesABC = [edge('eAB', A, B, BLUE), edge('eAC', A, C, BLUE), edge('eBC', B, C, BLUE)];
  var edgesADE = [edge('eAD', A, D, ORNG), edge('eAE', A, E, ORNG), edge('eDE', D, E, ORNG)];

  // 等边记号：△ABC 三条边各 1 条，△ADE 三条边各 2 条
  var marksABC = ticks('mkb', BLUE, [].concat(
    tickSegs(A, B, 1, 8), tickSegs(A, C, 1, 8), tickSegs(B, C, 1, 8)), 3);
  var marksADE = ticks('mko', ORNG, [].concat(
    tickSegs(A, D, 2, 8), tickSegs(A, E, 2, 8), tickSegs(D, E, 2, 8)), 3);

  // 边长标签 a / b：放在边中点朝三角形内部挪一点
  function innerLabel(X, Y, toward, gap) {
    var mid = lerp(X, Y, 0.5);
    return add(mid, mul(unit(sub(toward, mid)), gap || 26));
  }
  var sideLabels = [
    { id: 'lab1', k: 'text', at: innerLabel(B, C, A, 30), text: 'a', size: 20, fill: BLUE },
    { id: 'lab2', k: 'text', at: innerLabel(A, B, lerp(B, C, 0.5), 26), text: 'a', size: 20, fill: BLUE },
    { id: 'lab3', k: 'text', at: innerLabel(A, C, lerp(B, C, 0.5), 26), text: 'a', size: 20, fill: BLUE },
    { id: 'lab4', k: 'text', at: innerLabel(D, E, A, 30), text: 'b', size: 20, fill: ORNG },
    { id: 'lab5', k: 'text', at: innerLabel(A, D, lerp(D, E, 0.5), 24), text: 'b', size: 20, fill: ORNG },
    { id: 'lab6', k: 'text', at: innerLabel(A, E, lerp(D, E, 0.5), 24), text: 'b', size: 20, fill: ORNG }
  ];

  // 两条「手」：BD 与 CE
  var BD = { id: 'BD', k: 'line', a: B, b: D, stroke: BLUE, sw: 5 };
  var CE = { id: 'CE', k: 'line', a: C, b: E, stroke: ORNG, sw: 5 };
  var bdLab = { id: 'bdLab', k: 'text', at: lerp(B, D, 0.22), text: 'BD', size: 19, fill: BLUE };
  var ceLab = { id: 'ceLab', k: 'text', at: lerp(C, E, 0.80), text: 'CE', size: 19, fill: ORNG };
  // 线标签统一沿「法向、朝图形外侧」偏移。
  // 原来写死 [0,-20] / [26,0] 是轴对齐偏移，遇到陡线（CE）等于没挪，
  // 实测标签直接压在 DE 边上（_collide.mjs 量的）。
  function offLine(X, Y, t, gap) {
    var d = unit(sub(Y, X));
    var nrm = [-d[1], d[0]];
    var mid = lerp(X, Y, t);
    var side = ((mid[0] - A[0]) * nrm[0] + (mid[1] - A[1]) * nrm[1]) > 0 ? 1 : -1;
    return add(mid, mul(nrm, gap * side));
  }
  bdLab.at = offLine(B, D, 0.22, 24);
  ceLab.at = offLine(C, E, 0.20, 26);

  // 两块全等三角形
  var hABD = { id: 'hABD', k: 'poly', pts: [A, B, D], fill: GREEN, stroke: GREEN, sw: 4, op: OP_HL };
  var hACE = { id: 'hACE', k: 'poly', pts: [A, C, E], fill: GREEN, stroke: GREEN, sw: 4, op: OP_HL };

  /* ============================================================
     方法一：SAS 全等（tier = proof）
     ============================================================ */

  // 三个 60° 的公共角扇形：分布在 A 周围 -30° ~ 150°
  var secEAD = sectorAt('sEAD', A, E, D, 52, ORNG, 0.42);   // -30 ~ 30
  var secDAC = sectorAt('sDAC', A, D, C, 52, RED, 0.42, 2.2); //  30 ~ 90  ← 公共角（枢纽，用红）
  var secCAB = sectorAt('sCAB', A, C, B, 52, BLUE, 0.42);   //  90 ~ 150

  var lblEAD = { id: 'lEAD', k: 'text', at: atDir(A, 74, 0), text: '60°', size: 19, fill: ORNG };
  var lblDAC = { id: 'lDAC', k: 'text', at: atDir(A, 74, 60), text: '60°', size: 19, fill: RED };
  var lblCAB = { id: 'lCAB', k: 'text', at: atDir(A, 74, 120), text: '60°', size: 19, fill: BLUE };

  // 两个 120° 的角弧，半径更大，让它们各自跨过「公共角 + 一个 60°」
  var arcDAB = arcAt('aDAB', A, D, B, 92, BLUE, 4);         //  30 ~ 150（内圈）
  var arcCAE = arcAt('aCAE', A, C, E, 116, ORNG, 4);        // -30 ~  90（外圈，错开 24px）
  var lblDAB = { id: 'lDAB', k: 'text', at: atDir(A, 112, 168), text: '∠DAB', size: 19, fill: BLUE };
  var lblCAE = { id: 'lCAE', k: 'text', at: atDir(A, 112, -42), text: '∠CAE', size: 19, fill: ORNG };

  var m1 = [
    {
      say: '先看清题目：三角形 ABC 是等边三角形，边长记作 a。三条边相等，三个角都是 60 度。',
      cite: '等边三角形：三边相等，三个内角都是 60°',
      why: '这个性质是后面所有推理的出发点——没有“三边相等”和“60 度”，下面一步都走不了。',
      add: [triABC].concat(edgesABC).concat(names.slice(0, 3)).concat([sideLabels[0]]).concat(marksABC)
    },
    {
      say: '再画第二个等边三角形 ADE，它和第一个共用顶点 A，边长记作 b。',
      cite: '已知：△ADE 也是等边三角形，与 △ABC 共用顶点 A',
      why: '共用顶点 A 是这道题的关键结构——两个三角形绕同一个点“转了一下”，这就是“手拉手”。',
      add: [triADE].concat(edgesADE).concat(names.slice(3)).concat([sideLabels[3]]).concat(marksADE)
    },
    {
      say: '把 B 和 D 连起来，把 C 和 E 连起来。这两条线就是这个模型名字的由来——像两只手拉在一起。',
      cite: '连接 BD 与 CE（题目给定的两条线段）',
      why: '注意：我们要研究的是 BD 和 CE，它们本身不属于任何一个给定的等边三角形，而是“跨”出来的。',
      add: [BD, CE, bdLab, ceLab],
      eq: '求：BD 与 CE 有什么关系？',
      hold: 2200
    },
    {
      say: '第一问只有一句话：BD 和 CE 谁长？先别急着量。',
      cite: '目标：证明 BD = CE',
      why: '量出来的相等只是这一个图形碰巧相等。题目问的是“任意画两个等边三角形手拉手”，所以要证。',
      eq: '目标：BD = CE'
    },
    {
      say: '找载体。BD 是三角形 ABD 的一条边，CE 是三角形 ACE 的一条边。',
      cite: '把待证的两条线段，分别放进一个三角形里',
      why: '这是全等类题目的标准打法：要证两条线段相等，就让它们各自成为一对全等三角形的对应边。',
      add: [hABD, hACE]
    },
    {
      say: '所以问题变成：三角形 ABD 和三角形 ACE 全等吗？全等了，对应边自然相等。',
      cite: '全等三角形的对应边相等（反过来用）',
      why: '注意逻辑：不是“因为它们相等所以全等”，而是“先证全等，再由全等推出相等”。',
      eq: '只需证 △ABD ≌ △ACE'
    },
    {
      say: '第一组条件：AB 等于 AC。它们都是等边三角形 ABC 的边。',
      cite: '△ABC 是等边三角形 ⟹ AB = AC',
      why: '一是等边三角形的定义直接给出的，不需要再证。',
      // 直接加粗原边：保持蓝/橙编码（蓝对蓝、橙对橙正是等长的来源），
      // 也不遮挡边中点上的等长记号。比盖一条红线干净得多。
      upd: [{ id: 'eAB', sw: 9 }, { id: 'eAC', sw: 9 }],
      eq: '① AB = AC'
    },
    {
      say: '第二组条件：AD 等于 AE。它们都是等边三角形 ADE 的边。',
      cite: '△ADE 是等边三角形 ⟹ AD = AE',
      why: '同样是定义直接给出的。到这里，两边已经对上了。',
      upd: [{ id: 'eAD', sw: 9 }, { id: 'eAE', sw: 9 }],
      eq: '② AD = AE'
    },
    {
      say: '第三组条件，也是最容易被跳过的一组：夹角。要用的是 AB 与 AD 的夹角，和 AC 与 AE 的夹角。',
      cite: 'SAS 要求的是“两边及其夹角”',
      why: '这一组最容易出错：如果误用成“两边和另一边对应的角”，那是 SSA，全等不成立。这里必须是夹角。',
      add: [arcDAB, arcCAE, lblDAB, lblCAE],
      eq: '③ ∠DAB = ∠CAE ？'
    },
    {
      say: '把这两个角拆开看。先在顶点 A 周围找出三个 60 度的角：角 EAD、角 DAC、角 CAB。',
      cite: '∠EAD = 60°（△ADE 的内角），∠CAB = 60°（△ABC 的内角）',
      why: '中间那个 ∠DAC 不是任何一个三角形的内角，它是两个三角形“错开”留下的公共部分。',
      // 焦点从「两个三角形」转到「三个角」，绿色高亮让位——不然红色公共角叠在绿上会变棕，
      // 和旁边的橙色扇形糊成一片（放大截图看出来的）。
      upd: [{ id: 'hABD', op: 0.14 }, { id: 'hACE', op: 0.14 }],
      add: [secEAD, secDAC, secCAB, lblEAD, lblDAC, lblCAB],
      eq: '∠EAD = ∠CAB = 60°，中间的 ∠DAC 是公共角'
    },
    {
      say: '看角 DAB：它由角 DAC 和角 CAB 拼成，所以等于公共角加 60 度。',
      cite: '角的和：∠DAB = ∠DAC + ∠CAB',
      why: 'AC 这条射线正好落在 ∠DAB 的内部，把大角分成两块——所以可以直接相加。',
      add: [arcDAB], eq: '∠DAB = ∠DAC + 60°'
    },
    {
      say: '再看角 CAE：它由角 CAD 和角 DAE 拼成，等于同一个公共角加 60 度。',
      cite: '角的和：∠CAE = ∠CAD + ∠DAE',
      why: 'AD 落在 ∠CAE 内部，同样是分成两块相加。注意 ∠CAD 和 ∠DAC 是同一个角，只是读的顺序不同。',
      add: [arcCAE], eq: '∠CAE = ∠DAC + 60°'
    },
    {
      say: '两个角都等于“公共角加 60 度”，公共角是同一个角，60 度也是同一个数，所以这两个角相等。',
      cite: '等量加等量，和相等（等式的加法性质）',
      why: '这一步就是“同加一个角”的标准写法，也是手拉手模型的核心——换个角度看，这两个三角形是同一个三角形转了一下。',
      eq: '③ ∠DAB = ∠CAE',
      hold: 3000
    },
    {
      say: '三组条件齐了：两边及其夹角分别相等。由边角边判定，三角形 ABD 全等于三角形 ACE。',
      cite: 'SAS（边角边）：两边及其夹角分别相等的两个三角形全等',
      why: '顺序要对上：AB 对 AC，AD 对 AE，夹角 ∠DAB 对 ∠CAE。写成 △ABD ≌ △ACE，字母顺序就是对应关系。',
      // 角已经用完了，把扇形和弧撤掉；同时把两块三角形的高亮重新点亮——
      // 这一步的主角是「这两个三角形全等」，不是角。
      delNow: ['sEAD', 'sDAC', 'sCAB', 'lEAD', 'lDAC', 'lCAB', 'aDAB', 'aCAE', 'lDAB', 'lCAE'],
      upd: [{ id: 'hABD', op: OP_HL }, { id: 'hACE', op: OP_HL }],
      eq: '△ABD ≌ △ACE（SAS）',
      hold: 3000
    },
    {
      say: '全等三角形对应边相等。BD 对应 CE，所以 BD 等于 CE。第一问证完。',
      cite: '全等三角形的对应边相等',
      why: '再确认一次对应关系：A 对 A，B 对 C，D 对 E，所以 BD 一定对 CE，不会对错。',
      add: [{ id: 'rBD', k: 'line', a: B, b: D, stroke: RED, sw: 7 },
            { id: 'rCE', k: 'line', a: C, b: E, stroke: RED, sw: 7 }],
      eq: 'BD = CE',
      hold: 3200
    }
  ];

  /* ============================================================
     方法二：角度追踪（tier = proof）—— 证夹角恒为 60°
     ============================================================ */

  var dotP = { id: 'dotP', k: 'circ', c: P, r: 7, fill: RED, stroke: '#ffffff', sw: 2.5 };
  var dotO = { id: 'dotO', k: 'circ', c: O, r: 7, fill: GREY, stroke: '#ffffff', sw: 2.5 };
  var labP = { id: 'labP', k: 'text', at: add(P, [22, -18]), text: 'P', size: 20, fill: RED };
  var labO = { id: 'labO', k: 'text', at: add(O, [-24, -16]), text: 'O', size: 20, fill: GREY };

  // 角度：∠ABD（B 处）、∠ACE（C 处）、∠AOB（O 处）、∠POC（O 处）、∠OPC（P 处）
  var arcABD = arcAt('aABD', B, A, D, 40, RED, 3.4);
  var arcACE = arcAt('aACE', C, A, E, 40, RED, 3.4);
  var arcAOB = arcAt('aAOB', O, A, B, 34, BLUE, 3.4);
  var arcPOC = arcAt('aPOC', O, P, C, 34, BLUE, 3.4);
  var arcOPC = arcAt('aOPC', P, O, C, 38, GREEN, 4);

  var lblABD = { id: 'lABD', k: 'text', at: midAt(B, A, D, 56), text: 'α', size: 19, fill: RED };
  var lblACE = { id: 'lACE', k: 'text', at: midAt(C, A, E, 56), text: 'α', size: 19, fill: RED };
  var lblAOB = { id: 'lAOB', k: 'text', at: midAt(O, A, B, 50), text: 'β', size: 19, fill: BLUE };
  var lblPOC = { id: 'lPOC', k: 'text', at: midAt(O, P, C, 70), text: 'β', size: 19, fill: BLUE };
  var lblOPC = { id: 'lOPC', k: 'text', at: midAt(P, O, C, 58), text: '60°', size: 20, fill: GREEN };

  // 右侧「角度账本」：把推导过程一行行累加上去
  function ledger(id, y, text, color) {
    return { id: id, k: 'text', at: [790, y], text: text, size: 17, fill: color || INK };
  }

  var m2 = [
    {
      say: '第一问证完了。第二问更难：BD 和 CE 这两条线，夹角是多少？',
      cite: '目标：求 BD 与 CE 所成的角',
      why: '这类“求夹角”的题答案往往是一个定值，跟两个三角形怎么摆无关。我们先猜这个定值可能和 60 度有关。',
      add: [triABC].concat(edgesABC).concat([triADE]).concat(edgesADE)
        .concat(names).concat([BD, CE, bdLab, ceLab]),
      eq: '求 ∠BPC = ?'
    },
    {
      say: '设 BD 与 CE 交于点 P。要回答的，就是三角形 P 处的那个角。',
      cite: '记 BD 与 CE 的交点为 P',
      why: '注意：必须先确认它们真的相交。BD 和 CE 的夹角是 60°，两条直线不平行，所以一定交于一点。',
      add: [dotP, labP],
      eq: '求 ∠BPC（或它的对顶角 ∠E P D）'
    },
    {
      say: '再设 BD 与 AC 交于点 O。这个点是为了造一个能算内角和的三角形。',
      cite: '记 BD 与 AC 的交点为 O',
      why: '为什么偏偏选 AC？因为 AC 和 AB 的夹角是已知的 60 度，把它拉进同一个三角形，就能把 60 度用起来。',
      add: [dotO, labO]
    },
    {
      say: '先把方法一的成果拿过来：两个三角形全等，所以角 ABD 等于角 ACE。把这两个角都记作阿尔法。',
      cite: '由 △ABD ≌ △ACE 得 ∠ABD = ∠ACE（对应角相等）',
      why: '这是第二问的命根子：没有这条，后面一个数都推不出来。',
      add: [arcABD, arcACE, lblABD, lblACE],
      eq: '∠ABD = ∠ACE = α'
    },
    {
      say: '看三角形 ABO。O 在 AC 上，所以角 BAO 就是角 BAC，等于 60 度。',
      cite: 'O 在 AC 上 ⟹ ∠BAO = ∠BAC = 60°',
      why: '这里用到了 O 的选法：正因为 O 落在 AC 上，这个角才等于 60 度。换个交点这个角就不是 60 了。',
      add: [sectorAt('sBAO', A, B, C, 60, BLUE, 0.28),
            // 这个 60° 只能放在扇形内部（半径 38）：放到弧外会同时压住 AB 边和 O 处的 β
            { id: 'lBAO', k: 'text', at: atDir(A, 38, 120), text: '60°', size: 17, fill: BLUE }],
      eq: '∠BAO = 60°'
    },
    {
      say: '三角形 ABO 的内角和是 180 度，所以角 AOB 等于 180 减 60 再减阿尔法，也就是 120 度减阿尔法。',
      cite: '三角形内角和 = 180°',
      why: '把 180 减 60 先算出来，得到 120。这样后面代入时式子最短。',
      add: [arcAOB, lblAOB],
      eq: '∠AOB = 180° − 60° − α = 120° − α'
    },
    {
      say: '再看三角形 POC。角 POC 和角 AOB 是对顶角，所以也等于 120 度减阿尔法。',
      cite: '对顶角相等',
      why: '为什么是对顶角？因为 P、O、B 三点共线（都在 BD 上），C、O、A 三点共线（都在 AC 上），两条直线交于 O。',
      add: [arcPOC, lblPOC],
      eq: '∠POC = ∠AOB = 120° − α'
    },
    {
      say: '而角 PCO 就是角 ACE，还是那个阿尔法。因为 C、P、E 共线，C、O、A 共线。',
      cite: 'P 在 CE 上、O 在 CA 上 ⟹ ∠PCO = ∠ACE',
      why: '这一步是把“已知的阿尔法”搬进三角形 POC。不搬进去，三角形 POC 就只有两个角可用。',
      eq: '∠PCO = ∠ACE = α'
    },
    {
      say: '现在三角形 POC 的三个角都知道两个了：一个 120 减阿尔法，一个阿尔法。用内角和求第三个。',
      cite: '三角形内角和 = 180°',
      why: '这是整道题的高潮：阿尔法 被消掉了。也就是说，无论两个三角形怎么摆，这个角都不变。',
      add: [arcOPC],
      eq: '∠OPC = 180° − (120° − α) − α'
    },
    {
      say: '把括号拆开：180 减 120 等于 60，再减阿尔法 再加阿尔法 正好抵消。结果是 60 度。',
      cite: '去括号 + 合并同类项（阿尔法 项相互抵消）',
      why: '阿尔法 消失不是巧合，它正是“任意摆都成立”的原因——结论里不含任何描述摆放位置的量。',
      add: [lblOPC],
      eq: '∠OPC = 180° − 120° + α − α = 60°',
      hold: 3200
    },
    {
      say: '所以 BD 与 CE 的夹角恒为 60 度。这跟两个三角形的大小、摆放角度都无关。',
      cite: '结论：BD 与 CE 所成的角 = 60°（定值）',
      why: '注意结论的强度：不是“这个图里等于 60 度”，而是“任意画两个等边三角形手拉手，都是 60 度”。',
      add: [ledger('led1', 96, 'α = 260° − 90°', GREY)],
      eq: '∠BPC = 60°（定值）',
      hold: 3600
    }
  ];
  // 账本那条是占位，下面统一改成完整推导
  m2[10].add = [
    { id: 'led-box', k: 'rect', x: 688, y: 56, w: 204, h: 236, fill: '#ffffff', stroke: GREY, sw: 1.5, op: 0.92 },
    { id: 'led-t', k: 'text', at: [790, 80], text: '角度账本', size: 16, fill: INK, weight: 700 },
    { id: 'led-line', k: 'line', a: [702, 96], b: [878, 96], stroke: GREY, sw: 1 },
    ledger('led1', 122, '∠ABD = ∠ACE = α', RED),
    ledger('led2', 156, '∠AOB = 120° − α', BLUE),
    ledger('led3', 190, '∠POC = ∠AOB = β', BLUE),
    ledger('led4', 224, '∠PCO = ∠ACE = α', RED),
    ledger('led5', 258, '∠OPC = 180° − β − α', GREY),
    ledger('led6', 284, '= 60°', GREEN)
  ];
  m2[10].eq = '∠OPC = 180° − (120° − α) − α = 60°';

  /* ============================================================
     方法三：旋转（tier = corollary，依赖方法一）
     ============================================================ */

  // 可旋转的「搬运工」：一块绿色三角形 + 一条绿色 BD
  // origin 必须写：engine 的 tfString 在没给 origin 时按 [0,0] 旋转，
  // 那样会绕画布原点转，整块飞出舞台（第一次就是这样飞出去的）。
  var mvTri = { id: 'mvTri', k: 'poly', pts: [A, B, D], fill: GREEN, stroke: GREEN, sw: 3.5, op: 0.28, origin: A };
  // 绿色 BD 要比 CE（橙，sw 5）细一档：转过去之后橙色从两边露出来，
  // 才能看出「绿线正好落在橙线上」，否则整条盖死，读者只看到一条绿线。
  // 加 dash：旋转前 mvBD 与 BD 完全重合，实线绿细线压在蓝粗线中间会看成「画脏了」；
  // 改成绿色虚线后是一条看得懂的「标记线」，旋转后仍比 CE 细，橙色照样从两边露出来。
  var mvBD = { id: 'mvBD', k: 'line', a: B, b: D, stroke: GREEN, sw: 3.2, dash: [9, 6], origin: A };

  // 旋转到位后，在交点 P 处标出 BD 与 CE 的夹角（也就是旋转角）
  var arcP60 = arcAt('aP60', P, B, C, 44, RED, 4);
  var lblP60 = { id: 'lP60', k: 'text', at: midAt(P, B, C, 52), text: '60°', size: 21, fill: RED };

  function rotAll(deg) {
    return [
      { id: 'mvTri', rot: deg }, { id: 'mvBD', rot: deg }
    ];
  }

  var m3 = [
    {
      say: '还有一个更痛快的看法。先把三角形 ABD 单独拎出来，它就是用绿色标出的那一块。',
      cite: '取 △ABD 作为研究对象',
      why: '这个看法不新增任何条件，只是换个角度理解同一个事实。所以它排在两个证明后面。',
      add: [triABC].concat(edgesABC).concat([triADE]).concat(edgesADE).concat(names)
        .concat([BD, CE]).concat([mvTri, mvBD])
    },
    {
      say: '看边 AB 和边 AC：长度都等于 a（等边三角形），夹角是 60 度。',
      cite: 'AB = AC = a，∠BAC = 60°',
      why: '长度相等加上夹角 60 度，意味着：把 AB 绕 A 顺时针转 60 度，它正好落到 AC 上。',
      add: [{ id: 'spinArc', k: 'arc', c: A, r: 120, from: 150, to: 90, stroke: GREY, sw: 2.5, dash: [7, 6] },
            lblCAB],
      eq: 'AB 绕 A 顺时针旋转 60° → AC'
    },
    {
      say: '边 AD 和边 AE 也一样：长度都等于 b，夹角也是 60 度。所以 AD 转过去正好落在 AE 上。',
      cite: 'AD = AE = b，∠DAE = 60°',
      why: '两个端点都对上了：B 落到 C，D 落到 E。两对端点都重合，三角形就整体重合。',
      eq: 'AD 绕 A 顺时针旋转 60° → AE'
    },
    {
      say: '那就真的转一下。把整块绿色三角形，连同那条绿边 BD，一起绕 A 顺时针转 60 度。',
      cite: '合同变换：绕定点旋转，图形形状大小都不变',
      why: '注意旋转中心必须是 A——两个三角形的公共顶点。转别的点，B 和 D 都不会落到目标位置。',
      upd: rotAll(-60),
      dur: 1600,
      eq: '把 △ABD 整体旋转 60°',
      hold: 900
    },
    {
      say: '看结果：绿色三角形正好盖住了三角形 ACE，一点不差。这说明它们全等。',
      cite: '旋转后完全重合 ⟹ 两个图形全等',
      why: '这就是全等的本来面目：能通过平移、旋转、翻折完全重合的图形叫全等。SAS 判定只是它的一个快捷方式。',
      add: [{ id: 'fitTxt', k: 'text', at: [471, 36], text: '旋转 60° 后，△ABD 与 △ACE 完全重合', size: 20, fill: GREEN }],
      eq: '△ABD ≌ △ACE（重合）',
      hold: 3000
    },
    {
      say: '旋转保持长度不变，所以绿边 BD 转动之后，长度一点没变，而它现在的位置正好是 CE。',
      cite: '旋转是保距变换：对应线段长度相等',
      why: '于是 BD 等于 CE，这和用 SAS 证出来的结论完全一致。两条路，同一个终点。',
      add: [{ id: 'sameTxt', k: 'text', at: [471, 468], text: 'BD 转到 CE 的位置，长度不变 ⟹ BD = CE', size: 19, fill: GREEN }],
      eq: 'BD = CE'
    },
    {
      say: '再看方向：BD 是整整转了 60 度才变成 CE 的，所以这两条直线的夹角就是 60 度。',
      cite: '一条直线旋转 θ 角后，与原直线的夹角为 θ（θ ≤ 90°）',
      why: '这也解释了为什么方法二里阿尔法 会被消掉——不管怎么摆，转的角度永远是 60 度。',
      add: [arcP60, lblP60],
      eq: 'BD 与 CE 的夹角 = 旋转角 = 60°',
      hold: 3200
    },
    {
      say: '这个看法还能推广：如果换成两个正方形共顶点，就转 90 度，得到 BD 等于 CE 且夹角 90 度。换成两个等腰直角三角形，结论一样。',
      cite: '推广：手拉手模型的旋转角 = 两个等腰三角形的顶角',
      why: '关键条件只有两条：两条腰分别相等、顶角相等。满足这两条，就自动全等，夹角就等于顶角。',
      delNow: ['fitTxt'],
      add: [{ id: 'genTxt', k: 'text', at: [471, 36], text: '顶角 θ → 旋转 θ → BD = CE，夹角 = θ', size: 20, fill: INK }],
      eq: '等边 θ=60° / 正方形 θ=90° / 等腰直角 θ=90°',
      hold: 3800
    }
  ];

  window.MATHLAB_LESSONS = window.MATHLAB_LESSONS || [];
  window.MATHLAB_LESSONS.push({
    id: 'handshake',
    title: '手拉手：两个等边三角形一拉手，边长和夹角都定死了',
    grade: '初二',
    topic: '几何 · 全等',
    tags: ['几何', '全等', 'SAS', '手拉手', '证明'],
    question: '△ABC 和 △ADE 都是等边三角形，它们共用顶点 A。连接 BD 和 CE。问：(1) BD 与 CE 有什么数量关系？(2) 这两条线的夹角是多少度？',
    thumbStep: 2,
    methods: [
      {
        name: 'SAS 全等：找到那一对三角形', tier: 'proof',
        sub: '严格证明 · 三组条件一条不缺',
        steps: m1
      },
      {
        name: '角度追踪：夹角为什么是 60°', tier: 'proof',
        sub: '严格证明 · 内角和 + 对顶角',
        steps: m2
      },
      {
        name: '旋转：一眼看穿本质', tier: 'corollary',
        sub: '推论 · 必须先看方法一',
        needs: 'SAS 全等',
        needsMsg: '本方法用「旋转后重合」来解释全等，前提是已经知道 △ABD 与 △ACE 全等（方法一）。它换的是看法，不是条件。',
        steps: m3
      }
    ]
  });
})();
