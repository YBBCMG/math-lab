/* ============================================================
   几何模型课 · 角平分线「截取」：两边截等长，用 SAS 造全等
   ------------------------------------------------------------
   模型（不绑定某一道原题，讲的是这个模型本身）：
     ∠AOB 的平分线是射线 OP，点 P 在平分线上。在射线 OA 上取 M、
     射线 OB 上取 N，使 OM = ON，连 PM、PN。
     求证：PM = PN。

   证明骨架（一个 SAS，全程不要直角）：
       OM = ON          （截取，已知）
       ∠MOP = ∠NOP     （OP 是平分线）
       OP = OP          （公共边）
     ⟹ △MOP ≌ △NOP    （SAS：两边及其夹角）
     ⟹ PM = PN          （全等三角形对应边相等）

   这一课在「垂、截、垂延长、平行」四支里的位置：
     就是其中的「截」。和姊妹课「垂两边」给出同一个结论 PM = PN，
     但判定不同 —— 垂两边必须先作垂线、用 AAS 或 HL，必须有直角；
     截取只要两段等长加一个公共边，用 SAS，不需要直角。
     反过来看，垂两边的两个垂足恰好满足 OM′ = ON′ = OP·cos(半角)
     （两个直角三角形全等就给出这一点），所以「垂两边」是「截取」的特例。
     —— 已由 _bsas_geom.mjs 扫 1000 组独立验算。

   几何（屏幕坐标，y 向下；角度按逆时针为正的数学角，画布上表现为向上）：
     O = (118, 462)，∠AOB = 58°，OA 在 74° 方向、OB 在 16° 方向，
     平分线 OP 在 45° 方向。OM = ON = 250，OP = 330。
       A = O + 400·u(74°) = (228.255, 77.495)
       B = O + 740·u(16°) = (829.334, 258.028)
       M = O + 250·u(74°) = (186.909, 221.685)
       N = O + 250·u(16°) = (358.315, 393.091)
       P = O + 330·u(45°) = (351.345, 228.655)
     结论 |PM| = |PN| = 164.583560（_bsas_geom.mjs 三条独立路线互校，
     随机扫 5000 组最大偏差 1.0e-12）。

   版面预算（画布 900×520）：
     · 图形占 x∈[91,865]、y∈[41,500]（含字母），左下与右上撑开；
     · 右下角 x=600 起的空白区放「结论条」，最多 4 行（y=352/386/420/454，
       行距 34：一行的字框高约 21，34 才不会压字；末行底边 464，离下沿 56）；
       该区唯一的邻居是射线 OB（x=600 处 y≈324），与第一行顶边还隔 17px；
     · 左上角 x=40 放模型名（射线 OA 在 y=40 处已到 x≈215，100px 宽的字够放）。

   标注纪律（都是踩过的坑）：
     · 顶点字母一律由向量算出来（沿射线外推 / 沿背离角内部的外法向外推），
       不手填坐标，角度一改也不会歪；
     · 两组等长用【不同杠数】区分：OM = ON 一道杠，PM = PN 两道杠；
       OM、ON 的杠沿射线挪 25px 避开角弧，PM、PN 的两道杠错开 ±7px；
     · 两个相等的角【同色同半径】（紫色，r=104），而且在平分线两侧各让开
       5°：首尾相接连成一条弧，看起来像在标「整个角一个角」，反而误导；
     · 图上没有任何直角符号 —— 这一支的关键恰恰是「不需要直角」，
       画个直角出来就等于把结论偷偷塞进了条件；
     · 半透明色块只用 rgba 填充、不描边（用 op 会把描边一起削淡；描边会盖住
       原本的深色边），加完色块用 front 把线、记号、字母顶回去。
   ============================================================ */
(function () {
  var AN = window.ANNO, ML = window.ML;
  var COL = AN.COL, FS = AN.FS;
  var sub = AN.sub, add = AN.add, mul = AN.mul, unit = AN.unit, along = AN.along;

  var DEG = Math.PI / 180;
  function dir(deg) { return [Math.cos(deg * DEG), -Math.sin(deg * DEG)]; }   // 屏幕 y 向下
  function R(p) { return [Math.round(p[0] * 1000) / 1000, Math.round(p[1] * 1000) / 1000]; }

  /* ---------- 几何：全部由角度与长度算出来 ---------- */
  var O = [118, 462];
  var D_A = 74, D_B = 16, D_P = 45;            // OA、OB、平分线的方向角
  var uA = dir(D_A), uB = dir(D_B), uP = dir(D_P);
  var HALF = (D_A - D_B) / 2;                  // 29°，半角
  var CUT = 250;                               // 截出来的长度 OM = ON
  var OP = 330;                                // P 到 O 的距离

  var A = R(along(O, uA, 400));                // (228.255, 77.495)
  var B = R(along(O, uB, 740));                // (829.334, 258.028)
  var M = R(along(O, uA, CUT));                // (186.909, 221.685)
  var N = R(along(O, uB, CUT));                // (358.315, 393.091)
  var P = R(along(O, uP, OP));                 // (351.345, 228.655)
  var PE = R(along(O, uP, 392));               // 平分线画到 P 之外一点，表示它是射线

  // 法向：nrm(u) 是 u 左转 90°；outward 取「背离角内部」的那一侧，字母才落在图形外
  function nrm(u) { return [-u[1], u[0]]; }
  function outward(u) {
    var n = nrm(u);
    return (n[0] * uP[0] + n[1] * uP[1]) > 0 ? [-n[0], -n[1]] : n;
  }
  var nA = outward(uA), nB = outward(uB), nP = nrm(uP);
  var nO = dir(D_P + 180);                     // O 的字母朝角的开口反面外推

  var R_ARC = 104;                             // 两个相等的角共用半径
  // 两段弧必须在平分线两侧各让开一点（ARC_GAP）：同色、同半径、首尾相接时，
  // 它们会连成「整个角一条弧」，看起来像在标一个角而不是两个相等的角。
  var ARC_GAP = 5;
  var A0 = D_P + ARC_GAP, A1 = D_A;            // 上半角：50° → 74°
  var B0 = D_B, B1 = D_P - ARC_GAP;            // 下半角：16° → 40°
  var ALPHA_AT = ML.pt(O[0], O[1], R_ARC + 30, (A0 + A1) / 2);    // 上面那道弧的外侧、居中

  /* ---------- 图元 ---------- */
  // 两条边、平分线
  var sOA = { id: 'sOA', k: 'line', a: O, b: A, stroke: COL.EDGE, sw: 2.6 };
  var sOB = { id: 'sOB', k: 'line', a: O, b: B, stroke: COL.EDGE, sw: 2.6 };
  var sOP = { id: 'sOP', k: 'line', a: O, b: PE, stroke: COL.PURPLE, sw: 2.6 };

  // 两条待证的线段（答案线：最粗、最红，必须一眼看得见）
  var sPM = { id: 'sPM', k: 'line', a: P, b: M, stroke: COL.RED, sw: 3.4 };
  var sPN = { id: 'sPN', k: 'line', a: P, b: N, stroke: COL.RED, sw: 3.4 };

  // 点
  var dO = { id: 'dO', k: 'circ', c: O, r: 4.2, fill: COL.INK, stroke: 'none' };
  var dP = { id: 'dP', k: 'circ', c: P, r: 5, fill: COL.PURPLE, stroke: 'none' };
  var dM = { id: 'dM', k: 'circ', c: M, r: 4.6, fill: COL.RED, stroke: 'none' };
  var dN = { id: 'dN', k: 'circ', c: N, r: 4.6, fill: COL.RED, stroke: 'none' };

  // 字母：顶点沿射线外推，边上截出来的点沿外法向外推
  var vO = AN.txt('vO', R(along(O, nO, 38)), 'O', { size: FS.V, weight: 700, halo: false });
  var vA = AN.txt('vA', R(along(A, uA, 26)), 'A', { size: FS.V, weight: 700, halo: false });
  var vB = AN.txt('vB', R(along(B, uB, 26)), 'B', { size: FS.V, weight: 700, halo: false });
  // P 的字母：沿平分线外推 30，再朝垂直方向让开 38。
  // 注意：沿线方向外推对「离线的距离」毫无贡献（平行嘛），只有这个 38 起作用。
  // 早先用 26 —— 字框半对角投影到法向就有 16.9，加上 2.2 描边余量和线宽 4.2 的一半，
  // 净空只剩 5 左右，P 看着像贴在平分线上（_bsas_page.mjs 量出来的最小边距 5.18）。
  var vP = AN.txt('vP', R(add(along(P, uP, 30), mul(nP, 38))), 'P', { size: FS.V, weight: 700, halo: false });
  var vM = AN.txt('vM', R(along(M, nA, 30)), 'M', { size: FS.V, weight: 700, halo: false });
  var vN = AN.txt('vN', R(along(N, nB, 30)), 'N', { size: FS.V, weight: 700, halo: false });

  // 两个相等的角（同色同半径、跨度也相等；阿尔法只写一次，写在上弧外侧）
  var aAOP = { id: 'aAOP', k: 'arc', c: O, r: R_ARC, from: A0, to: A1, stroke: COL.PURPLE, sw: 2.4 };
  var aPOB = { id: 'aPOB', k: 'arc', c: O, r: R_ARC, from: B0, to: B1, stroke: COL.PURPLE, sw: 2.4 };
  var aAlpha = AN.txt('aAlpha', ALPHA_AT, 'α', { size: FS.NOTE, color: COL.PURPLE, weight: 700, halo: false });

  // 两个三角形（浅填充、不描边：描边会盖住原本的深色边）
  var fMOP = { id: 'fMOP', k: 'poly', pts: [O, M, P], fill: 'rgba(37,99,235,0.13)', stroke: 'none' };
  var fNOP = { id: 'fNOP', k: 'poly', pts: [O, N, P], fill: 'rgba(37,99,235,0.13)', stroke: 'none' };
  var nMOP = AN.txt('nMOP', [219, 304], '△MOP', { size: FS.TINY, color: COL.BLUE, halo: false });
  var nNOP = AN.txt('nNOP', [276, 361], '△NOP', { size: FS.TINY, color: COL.BLUE, halo: false });

  // 两组等长，用【不同杠数】区分（同杠数会读成「四条边都相等」）：
  //   第一组 OM = ON 一道杠，沿射线外移 25px 躲开角弧；
  //   第二组 PM = PN 两道杠，沿线段错开 ±7px。
  var tkOM = AN.tick('tkOM', O, M, COL.BLUE, 10, 25);
  var tkON = AN.tick('tkON', O, N, COL.BLUE, 10, 25);
  var tkPM1 = AN.tick('tkPM1', P, M, COL.GREEN, 10, 7);
  var tkPM2 = AN.tick('tkPM2', P, M, COL.GREEN, 10, -7);
  var tkPN1 = AN.tick('tkPN1', P, N, COL.GREEN, 10, 7);
  var tkPN2 = AN.tick('tkPN2', P, N, COL.GREEN, 10, -7);

  // 模型名（左上角空档处）。注意 AN.txt 的 anchor 缺省是 middle：
  // 不写 anchor:'start' 就会以 x=40 为中心左右各伸一半，左边直接出画布。
  var cap = AN.txt('cap', [40, 40], '角平分线 · 截取', { size: 15, color: COL.INK, weight: 700, anchor: 'start', halo: false });

  /* ---------- 右下角结论条（x=600 起，最多 4 行，行距 34） ---------- */
  var PX0 = 600, PY0 = 352, LDH = 34;
  function led(id, i, text, o) {
    o = o || {};
    return AN.txt(id, [PX0, PY0 + i * LDH], text, {
      size: o.size || FS.NOTE,
      color: o.color || COL.INK,
      weight: o.weight || 600,
      anchor: 'start',
      halo: false
    });
  }

  // 加完色块要把线、点、记号、字母顶回去：front 数组越靠后越上层
  var LIFT = ['sOA', 'sOB', 'sOP', 'sPM', 'sPN', 'dO', 'dM', 'dN', 'dP',
    'aAOP', 'aPOB', 'aAlpha', 'tkOM', 'tkON', 'tkPM1', 'tkPM2', 'tkPN1', 'tkPN2',
    'vO', 'vA', 'vB', 'vM', 'vN', 'vP', 'nMOP', 'nNOP', 'cap'];

  /* ---------- 讲稿 ---------- */
  var steps = [

    /* 1 认图：先说它是什么，再给名字 */
    {
      say: '先看图：左下角有一个点，从它向右上方伸出一条比较陡的边，还有一条比较平缓、几乎横着向右伸出去的边。这个点叫 O，陡的那条边叫 OA，平的那条边叫 OB。',
      cite: '∠AOB 是一个角：顶点是 O，两条边是从 O 出发的射线 OA、OB',
      add: [sOA, sOB, dO, vO, vA, vB, cap],
      eq: '∠AOB'
    },

    /* 2 平分线：把角切成一样大的两半 */
    {
      say: '在这个角的里面，从 O 出发再画一条线，它把角切成一样大的两半，这条线叫做这个角的平分线。在这条平分线上取一点，位置在角的中间偏右，记作 P。',
      cite: '射线 OP 平分 ∠AOB ⟹ ∠AOP = ∠POB = α',
      add: [sOP, aAOP, aPOB, aAlpha, dP, vP],
      front: LIFT,
      eq: '∠AOP = ∠POB = α'
    },

    /* 3 截取 —— 这一课的核心动作 */
    {
      say: '现在做这一课的核心动作：在陡的那条边 OA 上，从 O 顺着边量出一段，落点记作 M；在平的那条边 OB 上，也从 O 量出一段，落点记作 N。两段要量得一样长，这个动作就叫截 —— 两条边上各截一段，长度相同。',
      cite: '在射线 OA 上截取 OM，在射线 OB 上截取 ON，使 OM = ON（截取相等线段）',
      add: [dM, dN, vM, vN, tkOM, tkON],
      front: LIFT,
      eq: 'OM = ON'
    },

    /* 4 连起来：锁定要证的两条线 */
    {
      say: '把 P 和 M 连起来，再把 P 和 N 连起来。要证的就是这两条连出来的线段一样长。这里先提个醒：M 不是从 P 垂下来的垂足，它是从 O 沿着边量出来的点，所以 PM 一般不垂直于 OA，这张图上没有现成的直角。',
      cite: '连 PM、PN，求证 PM = PN（本课结论）；注意 PM 不必垂直于 OA',
      add: [sPM, sPN],
      front: LIFT,
      eq: '求证 PM = PN'
    },

    /* 5 锁定两个三角形 */
    {
      say: '看 O、M、P 三点围出来的那个三角形，再看 O、N、P 三点围出来的那个三角形。要证的两条线段，一条在头一个三角形里，一条在后一个三角形里。这两个三角形还共用一条边，就是 OP。',
      cite: '△MOP 与 △NOP，公共边 OP = OP',
      add: [fMOP, fNOP, nMOP, nNOP],
      front: LIFT,
      eq: '△MOP 与 △NOP（公共边 OP）'
    },

    /* 6 条件一：截出来的等长 */
    {
      say: '第一条条件就是刚才截出来的那两段：OM 和 ON 一样长。这是作图的时候照着量好定下来的，属于已知条件，不用再证。',
      cite: 'OM = ON（截取，已知条件）',
      upd: [
        { id: 'tkOM', stroke: COL.GREEN, sw: 3.6 },
        { id: 'tkON', stroke: COL.GREEN, sw: 3.6 }
      ],
      front: LIFT,
      eq: 'OM = ON（已知）'
    },

    /* 7 条件二：平分线给出两个半角 */
    {
      say: '第二条条件是角：OP 是平分线，所以它两侧的那两个角一样大 —— 一个是 OM 和 OP 夹出来的，一个是 ON 和 OP 夹出来的，两个都等于半角。',
      cite: 'OP 平分 ∠AOB ⟹ ∠MOP = ∠NOP = α（半角）',
      upd: [
        { id: 'aAOP', stroke: COL.GREEN, sw: 3 },
        { id: 'aPOB', stroke: COL.GREEN, sw: 3 },
        { id: 'aAlpha', fill: COL.GREEN }
      ],
      front: LIFT,
      eq: '∠MOP = ∠NOP = α'
    },

    /* 8 条件三：公共边（保持紫色 —— 它同时是平分线，不该被改成绿色） */
    {
      say: '第三条是公共边：OP 是头一个三角形的一条边，也是后一个三角形的一条边，同一段线段自己等于自己，这条不用量，也不用作任何辅助线。',
      cite: 'OP = OP（公共边）',
      upd: [{ id: 'sOP', sw: 4.2 }],
      front: LIFT,
      eq: 'OP = OP'
    },

    /* 9 SAS：两边夹一角 */
    {
      say: '三条凑齐了：一条边、夹出来的那个角、再加一条边 —— 两段边夹着一个角，位置对得上。用的判定叫边角边，两个三角形全等。这里一个直角都没有用上，全靠等长和夹出来的那个角。',
      cite: 'SAS（边角边）：OM = ON，∠MOP = ∠NOP，OP = OP ⟹ △MOP ≌ △NOP',
      upd: [
        { id: 'fMOP', fill: 'rgba(15,157,88,0.13)' },
        { id: 'fNOP', fill: 'rgba(15,157,88,0.13)' },
        { id: 'nMOP', fill: COL.GREEN },
        { id: 'nNOP', fill: COL.GREEN }
      ],
      front: LIFT,
      eq: '△MOP ≌ △NOP（SAS）'
    },

    /* 10 对应边相等 ⟹ 结论（第二组等长：两道杠） */
    {
      say: '两个三角形全等，对应边就相等，所以 PM 等于 PN。到这里这一支就走完了：两条边上各截一段相等的、加上公共边和半角，就把两条线段证成一样长。',
      cite: '全等三角形对应边相等 ⟹ PM = PN',
      add: [tkPM1, tkPM2, tkPN1, tkPN2,
        led('p10a', 0, '模型：角平分线 · 截取', { weight: 700 }),
        led('p10b', 1, '两边各截一段等长，'),
        led('p10c', 2, '两段之间的两个三角形'),
        led('p10d', 3, '边角边全等 ⟹ PM = PN', { color: COL.GREEN })
      ],
      front: LIFT,
      eq: 'PM = PN'
    },

    /* 11 和「垂两边」比：同一个结论，两条路 */
    {
      say: '把两支摆在一起看。另一支是从 P 往两条边垂下去，靠的是直角，判定用角角边或者斜边直角边；这一支不垂，靠的是两段截出来的等长，判定用边角边，一个直角都不要。所以题目里没给垂直条件的时候，截取往往更顺手。',
      cite: '垂两边：作垂线 → 直角 → AAS / HL；截取：截等长 → SAS（不需要直角）。垂足恰满足 OM = ON，故垂两边是截取的特例',
      delNow: ['p10a', 'p10b', 'p10c', 'p10d'],
      add: [
        led('p11a', 0, '和「垂两边」比', { weight: 700 }),
        led('p11b', 1, '垂：先有直角，再 AAS / HL'),
        led('p11c', 2, '截：只要等长，用 SAS'),
        led('p11d', 3, '有直角走垂，没直角走截', { color: COL.RED })
      ],
      front: LIFT,
      eq: '垂两边（AAS / HL）与截取（SAS）给出同一个结论 PM = PN'
    },

    /* 12 怎么用：截多长 */
    {
      say: '用的时候这样想：看到角平分线，又要把两条线段证成相等，除了作垂线，还可以在两条边上各截一段相等的，凑出边角边。截多长有讲究，一般照着题目里已经有的线段去截，比如这条边上已知的那一段。',
      cite: '用法：角平分线 + 要证两条线段相等（或证某点到两边等距）⟹ 在两边截等长造 SAS 全等；截取的长度取已知线段',
      delNow: ['p11a', 'p11b', 'p11c', 'p11d'],
      add: [
        led('p12a', 0, '怎么用', { weight: 700 }),
        led('p12b', 1, '见平分线 + 要证等线段'),
        led('p12c', 2, '就在两边截等长，造全等'),
        led('p12d', 3, '截多长？照已知的那条', { color: COL.RED })
      ],
      front: LIFT,
      eq: '见角平分线 + 证等线段 ⟹ 两边截等长（长度照已知线段）'
    },

    /* 13 口诀：本课是「截」 */
    {
      say: '最后把口诀补全：见角平分线，可以垂、可以截、可以把垂线延长、也可以作平行。这一门讲的是截。它和垂两边那一门是同一家的两支：一个结论，两条路，有直角条件就走垂，没有直角就走截。',
      cite: '角平分线四模型：垂 · 截 · 垂延长 · 平行；本课是「截」，与「垂两边」同结论、不同判定',
      delNow: ['p12a', 'p12b', 'p12c', 'p12d'],
      add: [
        led('p13a', 0, '见角平分线，可以截', { size: 18, color: COL.RED, weight: 700 }),
        led('p13b', 1, '两边各截一段等长，造边角边'),
        led('p13c', 2, '和「垂两边」同一个结论，两条路'),
        led('p13d', 3, '口诀：垂 · 截 · 垂延长 · 平行', { size: FS.TINY, color: COL.GREY })
      ],
      front: LIFT,
      eq: '见角平分线 ⟹ 「垂 · 截 · 垂延长 · 平行」—— 本课是「截」',
      hold: 3800
    }
  ];

  window.MATHLAB_LESSONS = window.MATHLAB_LESSONS || [];
  window.MATHLAB_LESSONS.push({
    id: 'model-bisector-sas',
    title: '角平分线·截取：两边截等长，用 SAS 造全等',
    grade: '初二',
    topic: '几何 · 角平分线',
    tags: ['几何', '角平分线', '截取', '模型', '全等', 'SAS', '辅助线'],
    question: '∠AOB 的平分线是射线 OP，点 P 在平分线上。在射线 OA 上取一点 M、射线 OB 上取一点 N，使 OM = ON，连 PM、PN。求证：PM = PN。',
    thumbStep: 9,
    methods: [
      {
        name: '截取：两边截等长，SAS 一次全等',
        tier: 'proof',
        sub: '模型课 · 13 步，一个 SAS 走完，全程不要直角',
        steps: steps
      }
    ]
  });
})();
