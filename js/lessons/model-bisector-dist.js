/* ============================================================
   几何模型课 · 角平分线「垂两边」：角平分线上的点到角两边的距离相等
   ------------------------------------------------------------
   模型（不绑定某一道原题，讲的是这个模型本身）：
     ∠AOB 的平分线上有一点 P，过 P 作 PM ⊥ OA 于 M、PN ⊥ OB 于 N。
     ① 正命题：PM = PN —— 角平分线上的点到角两边的距离相等；
     ② 逆命题：若 PM ⊥ OA、PN ⊥ OB 且 PM = PN（P 在角内部），
        则 OP 平分 ∠AOB。

   证明骨架：
     正命题走 AAS —— ∠OMP = ∠ONP = 90°（垂直的定义）、
       ∠MOP = ∠NOP（平分线的定义）、OP = OP（公共斜边）；
     逆命题走 HL —— 两个直角相等、斜边 OP 公共、直角边 PM = PN。
     于是「点在平分线上」与「两段距离相等」互为充要，
     这正是四个角平分线模型里最常用的那一支「垂」。

   几何（屏幕坐标，y 向下；角度按逆时针为正的数学角，画布上表现为向上）：
     O = (110, 460)，∠AOB = 50°，OA 在 70° 方向、OB 在 20° 方向，
     平分线 OP 在 45° 方向。P 取 OP = 320。
     垂足到 O 的距离 = OP·cos25° = 290.019，故
       M = O + 290.019·u(70°) = (209.192, 187.471)
       N = O + 290.019·u(20°) = (382.528, 360.809)
       P = O + 320·u(45°)     = (336.274, 233.726)
       A = O + 400·u(70°)     = (246.808, 84.123)
       B = O + 740·u(20°)     = (805.373, 206.905)
     两条距离 = OP·sin25° = 135.2378（PM、PN 各一条，相等）。

   版面预算（画布 900×520）：
     · 图形占 x∈[110,834]、y∈[47,503]（含字母），撑住左侧与上方；
     · 右下角 x=566 起的空白区放「结论条」，最多 4 行（y=336/364/392/420，
       末行底边 431，离画布下沿还有 89px）；
     · 左上角 x=40 放模型名（该处唯一空档：射线 OA 在此高度已到 x≈247）。

   标注纪律：
     · 顶点字母一律由向量算出来（沿射线外推 / 沿「远离角内部」的法向外推），
       不手填坐标，角度一改也不会歪；
     · 等长关系用 tick（短横线），不重复写字母；
     · 直角符号统一 14px，画在垂足靠角内的一侧；
     · 两个相等的角同色同半径（紫色 140），阿尔法只写一次（写在上面那道弧外）；
     · 半透明色块只用 rgba 填充、不描边（用 op 会把描边一起削淡；描边会盖住
       原本的深色边），加完色块用 front 把线、直角符号、字母顶回去。
   ============================================================ */
(function () {
  var AN = window.ANNO, ML = window.ML;
  var COL = AN.COL, FS = AN.FS;
  var sub = AN.sub, add = AN.add, mul = AN.mul, unit = AN.unit, along = AN.along, mid = AN.mid;

  var DEG = Math.PI / 180;
  function dir(deg) { return [Math.cos(deg * DEG), -Math.sin(deg * DEG)]; }   // 屏幕 y 向下
  function R(p) { return [Math.round(p[0] * 1000) / 1000, Math.round(p[1] * 1000) / 1000]; }

  /* ---------- 几何：全部由角度与长度算出来 ---------- */
  var O = [110, 460];
  var D_A = 70, D_B = 20, D_P = 45;            // OA、OB、平分线的方向角
  var uA = dir(D_A), uB = dir(D_B), uP = dir(D_P);
  var HALF = (D_A - D_B) / 2;                  // 25°，半角
  var OP = 320;                                // P 到 O 的距离
  var OM = OP * Math.cos(HALF * DEG);          // 垂足到 O 的距离 290.019

  var A = R(along(O, uA, 400));                // (246.808, 84.123)
  var B = R(along(O, uB, 740));                // (805.373, 206.905)
  var P = R(along(O, uP, OP));                 // (336.274, 233.726)
  var M = R(along(O, uA, OM));                 // (209.188, 187.471)
  var N = R(along(O, uB, OM));                 // (382.529, 360.812)
  var PE = R(along(O, uP, 520));               // 平分线画到画布内为止

  // 法向：nrm(u) 是 u 左转 90°；outward 取「背离角内部」的那一侧，字母才落在图形外
  function nrm(u) { return [-u[1], u[0]]; }
  function outward(u) {
    var n = nrm(u);
    return (n[0] * uP[0] + n[1] * uP[1]) > 0 ? [-n[0], -n[1]] : n;
  }
  var nA = outward(uA), nB = outward(uB), nP = nrm(uP);

  var R_ARC = 140;                             // 两个相等的角共用半径
  // 两段弧必须在平分线两侧各让开一点（ARC_GAP）：同色、同半径、首尾相接时，
  // 它们会连成「整个角一条弧」，看起来像在标一个角而不是两个相等的角。
  var ARC_GAP = 4;
  var A0 = D_P + ARC_GAP, A1 = D_A;            // 上半角：49° → 70°
  var B0 = D_B, B1 = D_P - ARC_GAP;            // 下半角：20° → 41°
  var ALPHA_AT = ML.pt(O[0], O[1], R_ARC + 32, (A0 + A1) / 2);    // 上面那道弧的外侧、居中

  /* ---------- 图元 ---------- */
  // 两条边、平分线
  var sOA = { id: 'sOA', k: 'line', a: O, b: A, stroke: COL.EDGE, sw: 2.6 };
  var sOB = { id: 'sOB', k: 'line', a: O, b: B, stroke: COL.EDGE, sw: 2.6 };
  var sOP = { id: 'sOP', k: 'line', a: O, b: PE, stroke: COL.PURPLE, sw: 2.4 };

  // 两条待证的垂线段（答案线：最粗、最红，必须一眼看得见）
  var sPM = { id: 'sPM', k: 'line', a: P, b: M, stroke: COL.RED, sw: 3.4 };
  var sPN = { id: 'sPN', k: 'line', a: P, b: N, stroke: COL.RED, sw: 3.4 };

  // 点
  var dP = { id: 'dP', k: 'circ', c: P, r: 5, fill: COL.PURPLE, stroke: 'none' };
  var dM = { id: 'dM', k: 'circ', c: M, r: 4.2, fill: COL.RED, stroke: 'none' };
  var dN = { id: 'dN', k: 'circ', c: N, r: 4.2, fill: COL.RED, stroke: 'none' };

  // 字母：顶点沿射线外推，垂足沿外法向外推
  var vO = AN.txt('vO', R(along(O, mul(uP, -1), 38)), 'O', { size: FS.V, weight: 700, halo: false });
  var vA = AN.txt('vA', R(along(A, uA, 28)), 'A', { size: FS.V, weight: 700, halo: false });
  var vB = AN.txt('vB', R(along(B, uB, 30)), 'B', { size: FS.V, weight: 700, halo: false });
  var vP_ = AN.txt('vP', R(add(along(P, uP, 34), mul(nP, 28))), 'P', { size: FS.V, weight: 700, halo: false });
  var vM = AN.txt('vM', R(along(M, nA, 30)), 'M', { size: FS.V, weight: 700, halo: false });
  var vN = AN.txt('vN', R(along(N, nB, 30)), 'N', { size: FS.V, weight: 700, halo: false });

  // 两个相等的角（同色同半径、跨度也相等；阿尔法只写一次，写在上弧外侧）
  var aAOP = { id: 'aAOP', k: 'arc', c: O, r: R_ARC, from: A0, to: A1, stroke: COL.PURPLE, sw: 2.4 };
  var aPOB = { id: 'aPOB', k: 'arc', c: O, r: R_ARC, from: B0, to: B1, stroke: COL.PURPLE, sw: 2.4 };
  var aAlpha = AN.txt('aAlpha', ALPHA_AT, 'α', { size: FS.NOTE, color: COL.PURPLE, weight: 700, halo: false });

  // 两个直角（垂足处，画在靠角内部的一侧）
  var rM = AN.right('rM', M, sub(O, M), sub(P, M), 14, COL.RED);
  var rN = AN.right('rN', N, sub(O, N), sub(P, N), 14, COL.RED);

  // 两块直角三角形（浅填充、不描边：描边会盖住原本的深色边）
  var fOMP = { id: 'fOMP', k: 'poly', pts: [O, M, P], fill: 'rgba(37,99,235,0.13)', stroke: 'none' };
  var fONP = { id: 'fONP', k: 'poly', pts: [O, N, P], fill: 'rgba(37,99,235,0.13)', stroke: 'none' };
  var nOMP = AN.txt('nOMP', [240, 255], '△OMP', { size: FS.TINY, color: COL.BLUE, halo: false });
  var nONP = AN.txt('nONP', [315, 330], '△ONP', { size: FS.TINY, color: COL.BLUE, halo: false });

  // 等长记号
  var tkPM = AN.tick('tkPM', P, M, COL.GREEN, 10);
  var tkPN = AN.tick('tkPN', P, N, COL.GREEN, 10);

  // 模型名（左上角唯一空档处）。注意 AN.txt 的 anchor 缺省是 middle：
  // 不写 anchor:'start' 就会以 x=40 为中心左右各伸一半，左边直接出画布。
  var cap = AN.txt('cap', [40, 40], '角平分线 · 垂两边', { size: 15, color: COL.INK, weight: 700, anchor: 'start', halo: false });

  /* ---------- 右下角结论条（x=566 起，最多 4 行） ---------- */
  var PX0 = 566, PY0 = 336;
  function led(id, i, text, o) {
    o = o || {};
    return AN.txt(id, [PX0, PY0 + i * 30], text, {
      size: o.size || FS.NOTE,
      color: o.color || COL.INK,
      weight: o.weight || 600,
      anchor: 'start',
      halo: false
    });
  }

  // 加完色块要把线、点、记号、字母顶回去：front 数组越靠后越上层
  var LIFT = ['sOA', 'sOB', 'sOP', 'sPM', 'sPN', 'rM', 'rN', 'dP', 'dM', 'dN',
    'aAOP', 'aPOB', 'aAlpha', 'tkPM', 'tkPN',
    'vO', 'vA', 'vB', 'vM', 'vN', 'vP', 'nOMP', 'nONP', 'cap'];

  /* ---------- 讲稿 ---------- */
  var steps = [

    /* 1 认图：先说它是什么，再给名字 */
    {
      say: '先看图：左边有一个点，从它往右上方伸出一条边，往右边偏下又伸出一条边。这个点叫 O，上面那条边叫 OA，下面那条边叫 OB。',
      cite: '∠AOB 由两条射线 OA、OB 组成，顶点是 O',
      add: [sOA, sOB, vO, vA, vB, cap],
      eq: '∠AOB'
    },

    /* 2 平分线：把角切成一样大的两半 */
    {
      say: '在这个角的里面，从 O 出发往右边画一条线，它把角切成一样大的两半，这条线叫角平分线。在它上面取一点，位置在角的中间偏右，记作 P。',
      cite: '角平分线：射线 OP 平分 ∠AOB ⟹ ∠AOP = ∠POB = α',
      add: [sOP, aAOP, aPOB, aAlpha, dP, vP_],
      front: LIFT,
      eq: '∠AOP = ∠POB = α'
    },

    /* 3 垂两边 —— 这一课要学的动作 */
    {
      say: '从 P 往上面那条边 OA 作垂线，垂足记作 M；再从 P 往下面那条边 OB 作垂线，垂足记作 N。PM 和 PN 就是 P 到两条边的距离。',
      cite: 'PM ⊥ OA 于 M，PN ⊥ OB 于 N；PM、PN 即点 P 到 OA、OB 的距离',
      add: [sPM, sPN, dM, dN, vM, vN],
      eq: 'PM ⊥ OA，PN ⊥ OB'
    },

    /* 4 两个直角 ⟹ 两个直角三角形 */
    {
      say: '两个垂足处各出现一个直角：M 那里的直角，是 PM 和 OA 夹出来的；N 那里的直角，是 PN 和 OB 夹出来的。于是图里出现两个直角三角形。',
      cite: 'PM ⊥ OA ⟹ ∠OMP = 90°；PN ⊥ OB ⟹ ∠ONP = 90°',
      add: [rM, rN],
      front: LIFT,
      eq: '∠OMP = ∠ONP = 90°'
    },

    /* 5 锁定对象 */
    {
      say: '要证的是 PM 和 PN 相等。它们分别在两个三角形里：一个由 O、M、P 围成，一个由 O、N、P 围成。这两个三角形还共用同一条边 OP。',
      cite: 'Rt△OMP 与 Rt△ONP，公共边（斜边）OP = OP',
      add: [fOMP, fONP, nOMP, nONP],
      front: LIFT,
      eq: '△OMP 与 △ONP，OP = OP'
    },

    /* 6 条件一：两个角相等（把弧打亮） */
    {
      say: '先看角：OP 是角平分线，所以角 MOP 和角 NOP 一样大，都是阿尔法。',
      cite: 'OP 平分 ∠AOB ⟹ ∠MOP = ∠NOP = α',
      upd: [
        { id: 'aAOP', stroke: COL.GREEN, sw: 3 },
        { id: 'aPOB', stroke: COL.GREEN, sw: 3 },
        { id: 'aAlpha', fill: COL.GREEN }
      ],
      eq: '∠MOP = ∠NOP = α'
    },

    /* 7 条件二 + 三，AAS */
    {
      say: '再看直角：两个三角形都是直角三角形，直角自然相等。最后一条是公共边，OP 自己等于自己。两个角加一条边，用角角边判定，两个三角形全等。',
      cite: 'AAS：∠OMP = ∠ONP，∠MOP = ∠NOP，OP = OP ⟹ △OMP ≌ △ONP',
      upd: [
        { id: 'fOMP', fill: 'rgba(15,157,88,0.13)' },
        { id: 'fONP', fill: 'rgba(15,157,88,0.13)' },
        { id: 'nOMP', fill: COL.GREEN },
        { id: 'nONP', fill: COL.GREEN }
      ],
      eq: '△OMP ≌ △ONP（AAS）'
    },

    /* 8 对应边相等 ⟹ 结论 */
    {
      say: '全等三角形的对应边相等，所以 PM 就等于 PN。',
      cite: '全等三角形对应边相等 ⟹ PM = PN',
      add: [tkPM, tkPN],
      front: LIFT,
      eq: 'PM = PN'
    },

    /* 9 这就是模型：怎么用 */
    {
      say: '把这句话记住：角平分线上的点，到角两边的距离相等。这就是垂两边这个模型，它把「点在平分线上」换成了「两条线段相等」，以后看到平分线就知道该往哪儿想。',
      cite: '角平分线的性质：角平分线上的点到角两边的距离相等',
      delNow: ['fOMP', 'fONP', 'nOMP', 'nONP'],
      add: [
        led('p9a', 0, '模型：垂两边', { weight: 700 }),
        led('p9b', 1, '角平分线上的点，', { color: COL.RED }),
        led('p9c', 2, '到角两边的距离相等', { color: COL.RED }),
        led('p9d', 3, '反过来也成立 —— 下一步证', { size: FS.TINY, color: COL.GREY })
      ],
      eq: 'PM = PN（P 到 OA、OB 的距离相等）'
    },

    /* 10 逆命题：条件与结论互换 */
    {
      say: '反过来问一句：如果一个点到角两边的距离相等，它是不是一定在角平分线上？这时候已知的成了两条垂线段相等，要证的变成 OP 平分这个角。',
      cite: '逆命题：PM ⊥ OA，PN ⊥ OB，PM = PN ⟹ OP 平分 ∠AOB（P 在角内部）',
      delNow: ['aAOP', 'aPOB', 'aAlpha', 'p9a', 'p9b', 'p9c', 'p9d'],
      add: [
        led('p10a', 0, '逆命题：条件与结论互换', { weight: 700 }),
        led('p10b', 1, '已知 PM ⊥ OA，PN ⊥ OB，'),
        led('p10c', 2, '且两条垂线一样长'),
        led('p10d', 3, '要证 OP 平分 ∠AOB', { color: COL.RED })
      ],
      eq: '已知 PM = PN，求证 ∠MOP = ∠NOP'
    },

    /* 11 HL 判定 */
    {
      say: '还是那两个三角形。两个直角相等，斜边 OP 是公共的，两条直角边 PM 和 PN 又相等。斜边加一条直角边，用 HL 判定，两个直角三角形全等。',
      cite: 'HL：∠OMP = ∠ONP = 90°，OP = OP（斜边），PM = PN（直角边）⟹ Rt△OMP ≌ Rt△ONP',
      delNow: ['p10a', 'p10b', 'p10c', 'p10d'],
      add: [fOMP, fONP, nOMP, nONP,
        led('p11a', 0, '两个直角三角形', { weight: 700 }),
        led('p11b', 1, '直角相等，斜边 OP 公共，'),
        led('p11c', 2, '直角边 PM = PN'),
        led('p11d', 3, 'HL ⟹ Rt△OMP ≌ Rt△ONP', { color: COL.GREEN })
      ],
      upd: [
        { id: 'fOMP', fill: 'rgba(15,157,88,0.13)' },
        { id: 'fONP', fill: 'rgba(15,157,88,0.13)' },
        { id: 'nOMP', fill: COL.GREEN },
        { id: 'nONP', fill: COL.GREEN }
      ],
      front: LIFT,
      eq: 'Rt△OMP ≌ Rt△ONP（HL）'
    },

    /* 12 对应角相等 ⟹ 在平分线上（弧以绿色重新出现：这回是被证出来的） */
    {
      say: '全等三角形的对应角相等，所以角 MOP 等于角 NOP。两个角一样大，说明 OP 就是角平分线，这个点确实在平分线上。逆命题成立。',
      cite: '全等三角形对应角相等 ⟹ ∠MOP = ∠NOP ⟹ OP 平分 ∠AOB',
      delNow: ['fOMP', 'fONP', 'nOMP', 'nONP', 'p11a', 'p11b', 'p11c', 'p11d'],
      add: [
        { id: 'aAOP', k: 'arc', c: O, r: R_ARC, from: A0, to: A1, stroke: COL.GREEN, sw: 3 },
        { id: 'aPOB', k: 'arc', c: O, r: R_ARC, from: B0, to: B1, stroke: COL.GREEN, sw: 3 },
        AN.txt('aAlpha', ALPHA_AT, 'α', { size: FS.NOTE, color: COL.GREEN, weight: 700, halo: false }),
        led('p12a', 0, '对应角相等', { weight: 700 }),
        led('p12b', 1, '⟹ ∠MOP = ∠NOP'),
        led('p12c', 2, '两个角一样大'),
        led('p12d', 3, '所以 OP 平分 ∠AOB（逆命题成立）', { color: COL.GREEN })
      ],
      front: LIFT,
      eq: '∠MOP = ∠NOP ⟹ P 在 ∠AOB 的平分线上'
    },

    /* 13 口诀 + 一句话记法 */
    {
      say: '记法就一句：见角平分线，先垂两边 —— 垂出来的两条距离相等，反过来也成立。这也是口诀垂、截、垂延长、平行中的第一支。',
      cite: '角平分线四模型：垂两边 · 截取对称 · 垂中间（延长）· 平行出等腰；本课是「垂两边」，正反两向都成立',
      delNow: ['p12a', 'p12b', 'p12c', 'p12d'],
      add: [
        led('p13a', 0, '见角平分线，先垂两边', { size: 18, color: COL.RED, weight: 700 }),
        led('p13b', 1, '垂出来的两条距离相等，'),
        led('p13c', 2, '反过来也成立'),
        led('p13d', 3, '口诀：垂、截、垂延长、平行', { size: FS.TINY, color: COL.GREY })
      ],
      eq: '见角平分线 ⟹ 想「垂、截、垂延长、平行」—— 这一课是「垂」',
      hold: 3400
    }
  ];

  window.MATHLAB_LESSONS = window.MATHLAB_LESSONS || [];
  window.MATHLAB_LESSONS.push({
    id: 'model-bisector-dist',
    title: '角平分线·垂两边：为什么到角两边的距离相等',
    grade: '初二',
    topic: '几何 · 角平分线',
    tags: ['几何', '角平分线', '垂两边', '模型', '全等', 'AAS', 'HL', '距离'],
    question: '∠AOB 的平分线上有一点 P，过 P 作 PM ⊥ OA 于 M，PN ⊥ OB 于 N。求证：PM = PN。再证明它的逆命题：若 PM ⊥ OA、PN ⊥ OB，且 PM = PN（P 在角内部），则 OP 平分 ∠AOB。',
    thumbStep: 8,
    methods: [
      {
        name: '垂两边：正命题 AAS + 逆命题 HL',
        tier: 'proof',
        sub: '模型课 · 13 步，正反两向都证',
        steps: steps
      }
    ]
  });
})();
