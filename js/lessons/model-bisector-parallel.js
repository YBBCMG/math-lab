/* ============================================================
   角平分线 · 平行出等腰（模型课）
   ------------------------------------------------------------
   模型：∠AOB 的平分线是射线 OP；过 P 作 PQ ∥ OB，交 OA 于 Q。
         结论：OQ = QP —— 角平分线 + 平行 ⟹ 等腰三角形。

   证明链（每一步都能倒查依据）：
     ① PQ ∥ OB，OP 是截线 ⟹ ∠OPQ = ∠POB      （两直线平行，内错角相等）
     ② OP 平分 ∠AOB         ⟹ ∠AOP = ∠POB      （角平分线的定义）
     ③ 等量代换             ⟹ ∠AOP = ∠OPQ      （∠AOP 与 ∠POQ 是同一个角）
     ④ △OPQ 中 ∠POQ = ∠OPQ  ⟹ OQ = QP          （等角对等边）
   逆用（同一张图，读法反转）：
     OQ = QP 且 PQ ∥ OB ⟹ ∠POQ = ∠OPQ = ∠POB ⟹ OP 平分 ∠AOB。
   所以这个模型一次给两样：一个等腰三角形，一对相等的角。

   作图纪律（本文件的坐标全部算出来，没有手填的点）：
     · Q 由「OA 与过 P 平行于 OB 的直线」求交得到，不是按公式直接放点
     · 顶点字母一律沿「背对角内部」的方向外推，方向由两条臂的单位向量求和再取反
     · 等长用 tick（红），等角用同色同半径的弧（绿），平行用双箭头（青）
     · 右侧 x = 600 起是账本列，图形最右（含字母）x = 571，留 29px 余量

   几何已由 _bisector_geom.mjs 独立验算：
     坐标法 OQ = QP = 225.166604984；三角法（正弦定理，不复用 Q）差 2.8e-14
     扫 1872 组构型（半角 8°~44° × OP 130~470 × 倾斜 8 种）最大偏差 6.3e-13
   ============================================================ */
(function () {
  var AN = window.ANNO;
  var COL = AN.COL, FS = AN.FS;
  var sub = AN.sub, add = AN.add, mul = AN.mul, unit = AN.unit, dist = AN.dist;
  var R = AN.D2R;

  /* ---------- 小工具（只服务这张图） ---------- */
  // 极坐标取点：deg 是数学角（逆时针为正），画布 y 轴向下所以取负
  function at(P, L, deg) { return [P[0] + L * Math.cos(deg * R), P[1] - L * Math.sin(deg * R)]; }
  function dir(deg) { return [Math.cos(deg * R), -Math.sin(deg * R)]; }
  // 两直线求交：P1 + t·d1 = P2 + s·d2
  function meet(P1, d1, P2, d2) {
    var cr = d1[0] * d2[1] - d1[1] * d2[0];
    if (Math.abs(cr) < 1e-12) return null;
    var t = ((P2[0] - P1[0]) * d2[1] - (P2[1] - P1[1]) * d2[0]) / cr;
    return [P1[0] + t * d1[0], P1[1] + t * d1[1]];
  }
  // 背对「X、Y 张成的那个角」的方向外推 d：两条臂单位向量求和 → 取反 → 走 d
  function outer(V, X, Y, d) {
    var a = unit(sub(X, V)), b = unit(sub(Y, V));
    var s = [a[0] + b[0], a[1] + b[1]];
    if (Math.hypot(s[0], s[1]) < 1e-6) s = [-a[1], a[0]];   // 平角兜底：取垂向
    return add(V, mul(unit(s), -d));
  }

  /* ---------- 几何：全部算出来 ---------- */
  var O = [150, 345];
  var TILT = -20;          // OB 的方向角（数学角，负 = 朝右下）
  var HALF = 30;           // 半角 → ∠AOB = 60°
  var LA = 430, LB = 380, LP = 390;

  var angOA = TILT + 2 * HALF;   // 40°
  var angOB = TILT;              // -20°
  var angOP = TILT + HALF;       // 10°

  var uOA = dir(angOA), uOB = dir(angOB);
  var A = at(O, LA, angOA);      // [479.399, 68.601]
  var B = at(O, LB, angOB);      // [507.083, 474.968]
  var P = at(O, LP, angOP);      // [534.075, 277.277]
  var Q = meet(O, uOA, P, uOB);  // [322.488, 200.266]  过 P 平行于 OB 的直线 ∩ OA

  /* ---------- 元素构造 ---------- */
  function line(id, X, Y, color, sw) {
    return { id: id, k: 'line', a: X, b: Y, stroke: color || COL.EDGE, sw: sw || 2.6 };
  }
  function dot(id, P) {
    return { id: id, k: 'circ', c: P, r: 4.2, fill: COL.INK, stroke: 'none' };
  }
  function letter(id, atp, color) {
    return AN.txt(id, atp, id.slice(1), { size: FS.V, weight: 700, color: color || COL.INK });
  }
  function wash(id, pts, rgb, a) {
    return { id: id, k: 'poly', pts: pts, fill: AN.wash(rgb, a), stroke: 'none' };
  }

  // 平行记号：沿线段方向的「双箭头」，画在线段 at 比例处
  function pmark(id, X, Y, frac, color) {
    var u = unit(sub(Y, X)), w = [-u[1], u[0]];
    var M = add(X, mul(u, dist(X, Y) * frac));
    var out = [];
    for (var k = 0; k < 2; k++) {
      var tip = add(M, mul(u, 7 - k * 14));
      var b1 = add(tip, add(mul(u, -10), mul(w, 5)));
      var b2 = add(tip, add(mul(u, -10), mul(w, -5)));
      out.push({
        id: id + k, k: 'path',
        d: 'M' + AN.nf(b1[0]) + ',' + AN.nf(b1[1]) +
           ' L' + AN.nf(tip[0]) + ',' + AN.nf(tip[1]) +
           ' L' + AN.nf(b2[0]) + ',' + AN.nf(b2[1]),
        stroke: color, sw: 2.6
      });
    }
    return out;
  }

  /* ---------- 骨架 ---------- */
  var sOA = line('sOA', O, A, COL.EDGE, 2.6);
  var sOB = line('sOB', O, B, COL.EDGE, 2.6);
  var sOP = line('sOP', O, P, COL.BLUE, 3.0);              // 平分线
  var sPQ = line('sPQ', Q, P, COL.TEAL, 3.0);              // 平行线

  var dO = dot('dO', O), dP = dot('dP', P), dQ = dot('dQ', Q);

  // 字母：顶点一律背对角内部外推；A、B 沿各自的边往外走
  var nO = letter('nO', outer(O, A, B, 30));
  var nA = letter('nA', add(A, mul(uOA, 26)));
  var nB = letter('nB', add(B, mul(uOB, 26)));
  var nP = letter('nP', outer(P, Q, O, 28));
  var nQ = letter('nQ', outer(Q, O, P, 32));

  // 三个等角的弧：同半径（ARC_R）同颜色才是「同值同标记」。
  // 顶点处两条正好被 OP 分开，读数就是「平分」；P 处那条半径一样，读数就是「和半角一样大」。
  // （早先用 70/70/55，等角的标记大小不同，反而暗示它们不等 —— 记号规范上的错。）
  var ARC_R = 66;
  var arcAOP = AN.arc('arcAOP', O, A, P, ARC_R, COL.GREEN, 2.4);
  var arcPOB = AN.arc('arcPOB', O, P, B, ARC_R, COL.GREEN, 2.4);
  var arcOPQ = AN.arc('arcOPQ', P, Q, O, ARC_R, COL.GREEN, 2.4);

  // 平行记号：用标注本色（INK），不跟 PQ 的青线同色 ——
  // 同色时记号糊在线上分不出来，而这两道记号必须一眼认出「它们在一对平行线上」。
  var pmOB = pmark('pmOB', O, B, 0.5, COL.INK);
  var pmPQ = pmark('pmPQ', Q, P, 0.3, COL.INK);

  // 等长记号：OQ、QP 各一道红 tick（同色同形 = 一样长）
  var tkOQ = AN.tick('tkOQ', O, Q, COL.RED);
  var tkQP = AN.tick('tkQP', Q, P, COL.RED);

  // 等腰三角形底色（第 9 步才上，随后用 front 把线、弧、字母顶回去）
  var walOPQ = wash('walOPQ', [O, P, Q], '15,157,88', 0.10);

  // 细线在前、粗线在后，字母和点最上：front 按数组顺序依次提到末尾（越后越上层）
  var LIFT = ['sOA', 'sOB', 'sOP', 'sPQ',
              'arcAOP', 'arcPOB', 'arcOPQ',
              'pmOB0', 'pmOB1', 'pmPQ0', 'pmPQ1',
              'tkOQ', 'tkQP',
              'dO', 'dP', 'dQ',
              'nO', 'nA', 'nB', 'nP', 'nQ'];

  /* ---------- 右侧账本列 ---------- */
  var LD_X = 600;
  var ALL_LG = ['lg0', 'lg1', 'lg2', 'lg3', 'lg4', 'lg5'];
  function led(lines, o) {
    o = o || {};
    return lines.map(function (t, i) {
      return AN.txt('lg' + i, [LD_X, (o.y0 == null ? 104 : o.y0) + i * (o.lh || 34)], t, {
        size: o.size || FS.NOTE, color: o.color || COL.INK, anchor: 'start'
      });
    });
  }

  /* ============================================================
     讲稿：十二步
     ============================================================ */
  var steps = [
    /* 1 · 建角：先说是什么，再落到字母上 */
    {
      say: '先看这个角：顶点在左下角，一条边朝右上方斜出去，另一条朝右下方斜出去。顶点记作 O，两条边另一头分别记作 A 和 B。',
      cite: '∠AOB：顶点 O，两边是射线 OA、OB',
      eq: '∠AOB',
      add: [sOA, sOB, dO, nO, nA, nB]
    },

    /* 2 · 作角平分线 */
    {
      say: '从顶点 O 出发，再画一条线，它夹在两条边正中间，把整个角分成一样大的两份。这条线叫作这个角的平分线，上面取一点记作 P。',
      cite: '射线 OP 平分 ∠AOB ⟹ ∠AOP = ∠POB',
      eq: '∠AOP = ∠POB',
      add: [sOP, dP, nP]
    },

    /* 3 · 过 P 作平行线，交 OA 于 Q */
    {
      say: '接着从 P 出发，画一条和下面那条边同方向、永远不碰头的线，这样的两条线叫平行。它朝左上方走，撞到上面那条边上，撞点记作 Q。',
      cite: '过 P 作 PQ ∥ OB，交 OA 于点 Q',
      eq: 'PQ ∥ OB，Q = PQ ∩ OA',
      add: [sPQ, dQ, nQ]
    },

    /* 4 · 平行记号 + 说清要证什么（结论不能当条件） */
    {
      say: '这两道同向的小箭头就是平行记号。到这儿该有的都齐了：一个角、一条平分线、一条平行线。要证的是两段一样长——顶点到撞点这一段，和撞点到 P 这一段。',
      cite: '待证：OQ = QP（这是结论，不是已知条件，不能直接拿来用）',
      eq: '待证：OQ = QP',
      add: pmOB.concat(pmPQ)
    },

    /* 5 · 平行 ⟹ 内错角相等 */
    {
      say: '先从平行这一边下手。从顶点到 P 的这条线，横穿了那一对平行线；两条平行线被同一条线横穿，内错角一定相等。所以顶点那里靠下面那条边的角，和 P 点这里的角，一样大。',
      cite: '两直线平行，内错角相等：PQ ∥ OB ⟹ ∠OPQ = ∠POB',
      eq: '∠OPQ = ∠POB',
      delNow: ALL_LG,
      add: [arcOPQ].concat(led(['① PQ ∥ OB（已知）', '⟹ ∠OPQ = ∠POB（内错角）']))
    },

    /* 6 · 平分线 ⟹ 两半相等 */
    {
      say: '再看平分线这一边。平分线的意思就是它把角分成一样大的两份：上面那一半和下面那一半一样大，这是作图的时候就说好的条件。',
      cite: '角平分线的定义：∠AOP = ∠POB',
      eq: '∠AOP = ∠POB',
      delNow: ALL_LG,
      add: [arcAOP, arcPOB].concat(led(['② OP 平分 ∠AOB（已知）', '⟹ ∠AOP = ∠POB（定义）']))
    },

    /* 7 · 等量代换：三个角同色 */
    {
      say: '把两句话叠在一起：上面那一半等于下面那一半，下面那一半又等于 P 点那个角。中间那个角当了两次桥，于是上面那一半和 P 点那个角，也一样大。图上三道弧同一个颜色，说的就是这件事。',
      cite: '等量代换：∠AOP = ∠POB，∠OPQ = ∠POB ⟹ ∠AOP = ∠OPQ',
      eq: '∠AOP = ∠OPQ（∠AOP 与 ∠POQ 是同一个角）',
      upd: [
        { id: 'arcAOP', sw: 3.6 },
        { id: 'arcPOB', sw: 3.6 },
        { id: 'arcOPQ', sw: 3.6 }
      ],
      delNow: ALL_LG,
      add: led(['③ 等量代换 ⟹ ∠AOP = ∠OPQ', '　（三道弧同色 = 三个角一样大）'])
    },

    /* 8 · 等角对等边 */
    {
      say: '最后只靠一条定理：三角形里两个角相等，它们对着的两条边就相等。看顶点、Q、P 这三点围成的三角形：顶点处的角对着 QP 这一条，P 处的角对着 OQ 这一条。两个角一样大，这两条边就一样长。',
      cite: '等角对等边：△OPQ 中 ∠POQ = ∠OPQ ⟹ OQ = QP',
      eq: '∠POQ = ∠OPQ ⟹ OQ = QP',
      delNow: ALL_LG,
      add: [tkOQ, tkQP].concat(led(['④ 等角对等边 ⟹ OQ = QP']))
    },

    /* 9 · 结论：这就是模型全部的秘密 */
    {
      say: '两段一样长，这个三角形就是等腰三角形。所以只要角平分线和一条平行线凑在一起，一个等腰三角形就白送给你了——这就是这个模型全部的秘密。',
      cite: '等腰三角形的定义：两边相等的三角形',
      eq: '△OPQ 是等腰三角形，腰 OQ = QP',
      delNow: ALL_LG,
      add: [walOPQ].concat(led(['⟹ △OPQ 是等腰三角形'])),
      front: LIFT
    },

    /* 10 · 逆用：同一张图，读法反转 */
    {
      say: '这三句话还可以倒过来念。如果已知这两段一样长，又知道 PQ 平行于 OB，那么从顶点到 P 的这条线一定是平分线：两个角一样大，平行再送一个内错角，角就被分平了。',
      cite: '逆用：OQ = QP 且 PQ ∥ OB ⟹ ∠AOP = ∠POB，即 OP 平分 ∠AOB',
      eq: 'OQ = QP，PQ ∥ OB ⟹ OP 平分 ∠AOB',
      delNow: ALL_LG,
      add: led(['倒过来念也成立：', 'OQ = QP 且 PQ ∥ OB', '⟹ OP 平分 ∠AOB'])
    },

    /* 11 · 做题时怎么用（补辅助线） */
    {
      say: '做题的时候，它更常被倒着用：题目只给了角平分线，没有平行线，那就自己过 P 画一条和另一条边平行的线，等腰三角形立刻出现，长度关系也就跟着搬过来了。',
      cite: '常见用法：见角平分线而缺等腰，就过 P 作另一条边的平行线（辅助线）',
      eq: '角平分线 ＋ 补一条平行线 ⟹ 等腰三角形',
      delNow: ALL_LG,
      add: led(['这个模型一次给两样：', '① 等腰：OQ = QP', '② 角相等：∠AOP = ∠OPQ'])
    },

    /* 12 · 一句话记法 */
    {
      say: '一句话记牢：见角平分线，就想垂、截、垂延长、平行这四个字。这一支是里面的平行——平行一出，等腰自己冒出来，顺带还把角搬了个家。',
      cite: '口诀：见角平分线 —— 垂、截、垂延长、平行；本支＝平行（既得等腰，又得角相等）',
      eq: '角平分线 ＋ 平行 ⟹ 等腰 ＋ 角相等',
      delNow: ALL_LG,
      add: led(['见角平分线，想：', '垂、截、垂延长、平行', '这一支是「平行」', '⟹ 等腰 ＋ 角相等'],
        { y0: 118, lh: 36, size: 19, color: COL.INK }).map(function (s, i) {
          if (i === 2) { s.fill = COL.GREEN; s.weight = 700; }
          if (i === 3) { s.fill = COL.RED; s.weight = 700; }
          return s;
        }),
      hold: 3600
    }
  ];

  window.MATHLAB_LESSONS = window.MATHLAB_LESSONS || [];
  window.MATHLAB_LESSONS.push({
    id: 'model-bisector-parallel',
    title: '角平分线模型 · 平行出等腰：为什么 OQ = QP',
    grade: '初二',
    topic: '几何 · 角平分线模型',
    tags: ['几何', '模型课', '角平分线', '平行线', '等腰三角形', '等角对等边'],
    question: '∠AOB 的平分线是射线 OP，过 P 作 PQ ∥ OB 交 OA 于 Q。求证：OQ = QP。',
    thumbStep: 9,
    methods: [
      {
        name: '平行出等腰（模型课）',
        tier: 'proof',
        sub: '十二步 · 每步一条依据，末步给记法',
        steps: steps
      }
    ]
  });
})();
