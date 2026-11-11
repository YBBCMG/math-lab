/* ============================================================
   试卷 26 题 · 第 (1) 问
   ------------------------------------------------------------
   题：等腰 △ABC 中 AB = AC，AD、CE 分别是 △ABC 的角平分线。
       过 C 作 CF ⊥ CE，交 AD 的延长线于 F。∠B = 2α。
       求 ∠F 的度数（用含 α 的代数式表示）。

   方法一（三线合一 + 直角三角形）：
     AB = AC、AD 平分顶角 ⟹ AD ⊥ BC ⟹ △DCF 是直角三角形
     ∠DCF = 90° − α ⟹ ∠F = α

   方法二（两次内角和，全程不用垂直）：
     ∠ACF = 90° + α，∠CAF = 90° − 2α ⟹ ∠F = 180° − ⋯ = α

   答案：∠F = α。两问分开讲，这一节只做第 (1) 问。
   ============================================================ */
(function () {
  var AN = window.ANNO, ML = window.ML;
  var COL = AN.COL, FS = AN.FS;
  var sub = AN.sub, add = AN.add, mul = AN.mul, unit = AN.unit, dist = AN.dist;

  /* ---------- 几何：题图的摆法 —— B 在上、C 在下、A 在右，BC 竖直 ---------- */
  var ALPHA = 22;                       // ∠B = ∠C = 2α = 44°
  var bl = 210;                         // BC
  var Bp = [440, 120], Cp = [440, 120 + bl];
  var hp = (bl / 2) * Math.tan(2 * ALPHA * AN.D2R);   // tan(∠C) = h / (BC/2)
  var Ap = [Bp[0] + hp, Bp[1] + bl / 2];
  var Dp = [Bp[0], Bp[1] + bl / 2];
  var O = [(Ap[0] + Bp[0] + Cp[0]) / 3, (Ap[1] + Bp[1] + Cp[1]) / 3];

  // E：从 C 出发的角平分线（两条边的单位向量和）与 AB 的交点
  function rayLine(P, dir, Q1, Q2) {
    var d = unit(dir), e = sub(Q2, Q1);
    var den = d[0] * e[1] - d[1] * e[0];
    var t = ((Q1[0] - P[0]) * e[1] - (Q1[1] - P[1]) * e[0]) / den;
    return [P[0] + d[0] * t, P[1] + d[1] * t];
  }
  var bisC = unit(add(unit(sub(Bp, Cp)), unit(sub(Ap, Cp))));
  var Ep = rayLine(Cp, bisC, Ap, Bp);

  // F：过 C 作 CE 的垂线，与直线 AD（水平）的交点，取远离 A 的那一侧
  var perp = [-bisC[1], bisC[0]];
  var tF = (Dp[1] - Cp[1]) / perp[1];
  var Fp = [Cp[0] + tF * perp[0], Dp[1]];
  if (Fp[0] > Bp[0]) {
    perp = [bisC[1], -bisC[0]];
    tF = (Dp[1] - Cp[1]) / perp[1];
    Fp = [Cp[0] + tF * perp[0], Dp[1]];
  }

  /* ---------- 图元工厂（两种解法各一份，id 前缀区分） ---------- */
  function fig(p) {
    var e = {};
    e.fill = { id: p + 'fill', k: 'poly', pts: [Ap, Bp, Cp], fill: COL.FILL, stroke: 'none' };
    e.sAB = { id: p + 'sAB', k: 'line', a: Ap, b: Bp, stroke: COL.EDGE, sw: 2.4 };
    e.sBC = { id: p + 'sBC', k: 'line', a: Bp, b: Cp, stroke: COL.EDGE, sw: 2.4 };
    e.sCA = { id: p + 'sCA', k: 'line', a: Cp, b: Ap, stroke: COL.EDGE, sw: 2.4 };
    e.sAF = { id: p + 'sAF', k: 'line', a: Ap, b: Fp, stroke: COL.EDGE, sw: 2.4 };
    e.sCE = { id: p + 'sCE', k: 'line', a: Cp, b: Ep, stroke: COL.EDGE, sw: 2.4 };
    e.sCF = { id: p + 'sCF', k: 'line', a: Cp, b: Fp, stroke: COL.EDGE, sw: 2.4 };

    e.nA = AN.vname(p + 'A', Ap, O);
    e.nB = AN.vname(p + 'B', Bp, O);
    e.nC = AN.vname(p + 'C', Cp, O);
    e.nD = AN.txt(p + 'vD', [Dp[0] - 26, Dp[1] + 26], 'D', { size: FS.V, weight: 700 });
    e.nE = AN.txt(p + 'vE', AN.along(Ep, sub(Ep, O), 24), 'E', { size: FS.V, weight: 700 });
    e.nF = AN.txt(p + 'vF', [Fp[0] - 26, Fp[1] + 6], 'F', { size: FS.V, weight: 700 });

    // ∠B = 2α；∠C 被 CE 分成两个 α
    e.aB = AN.angle(p + 'aB', Bp, Ap, Cp, 44, COL.PURPLE, '2α', { size: FS.NOTE, gap: 24 });
    e.aC1 = AN.angle(p + 'aC1', Cp, Bp, Ep, 26, COL.BLUE, 'α', { size: FS.NOTE, gap: 18 });
    // 同一个值只写一次数字：另一道 α 弧靠同色同半径表示相等
    e.aC2 = AN.angle(p + 'aC2', Cp, Ep, Ap, 26, COL.BLUE, null, { size: FS.NOTE, gap: 18 });
    // ∠A 被 AD 平分：两道同色等半径的弧
    e.bis = AN.angle(p + 'b1', Ap, Bp, Dp, 38, COL.INK, null, { sw: 3 }).concat(
            AN.angle(p + 'b2', Ap, Dp, Cp, 38, COL.INK, null, { sw: 3 }));

    e.cap = AN.txt(p + 'cap', [50, 44], 'AB = AC，AD 平分 ∠A，CE 平分 ∠C，CF ⊥ CE',
      { size: FS.NOTE, anchor: 'start' });
    return e;
  }

  function ledger(p) {
    return function (lines) {
      return lines.map(function (t, i) {
        return AN.txt(p + 'led' + i, [50, 372 + i * 28], t, {
          size: 16, anchor: 'start',
          color: i === lines.length - 1 ? COL.RED : COL.INK
        });
      });
    };
  }
  var LD1 = ['vled0', 'vled1', 'vled2', 'vled3'];
  var LD2 = ['wled0', 'wled1', 'wled2', 'wled3'];
  var led1 = ledger('v'), led2 = ledger('w');

  /* ============================================================
     方法一：三线合一 → 直角三角形
     ============================================================ */
  var f1 = fig('v');
  var raD = AN.right('vraD', Dp, sub(Cp, Dp), sub(Fp, Dp), 14, COL.RED);
  var raDb = AN.right('vraDb', Dp, sub(Bp, Dp), sub(Ap, Dp), 14, COL.RED);
  var raC = AN.right('vraC', Cp, sub(Ep, Cp), sub(Fp, Cp), 14, COL.RED);
  var tkBD = AN.tick('vtkBD', Bp, Dp, COL.GREEN, 9, -26);
  var tkDC = AN.tick('vtkDC', Dp, Cp, COL.GREEN, 9, 26);
  var aDCF = AN.angle('vaDCF', Cp, Dp, Fp, 66, COL.ORANGE, '90°−α', { size: 15, gap: 28, dir: 146 });
  var aF = AN.angle('vaF', Fp, Bp, Dp, 34, COL.RED, 'α', { size: 16, gap: 24, dir: 25 });

  var lift1 = ['vsAB', 'vsBC', 'vsCA', 'vsAF', 'vsCE', 'vsCF',
               'vaB', 'vaC1', 'vaC2', 'vb1', 'vb2', 'vraD', 'vraDb', 'vraC', 'vaDCF', 'vaF'];

  var steps1 = [
    {
      say: '等腰三角形 ABC，AB = AC，∠B = 2α。AD 平分顶角，CE 平分 ∠ACB；在 C 处作 CF ⊥ CE，交 AD 的延长线于 F。求 ∠F。',
      cite: '题设：AB = AC，AD 平分 ∠BAC，CE 平分 ∠ACB，CF ⊥ CE，F 在 AD 的延长线上',
      add: [f1.fill, f1.sAB, f1.sBC, f1.sCA, f1.sAF, f1.sCE, f1.sCF,
            f1.nA, f1.nB, f1.nC, f1.nD, f1.nE, f1.nF,
            ].concat(f1.aB, f1.aC1, f1.aC2, f1.bis, [f1.cap]),
      eq: '∠B = ∠ACB = 2α'
    },
    {
      say: 'AB = AC，AD 又是顶角的平分线 —— 三线合一，所以 AD ⊥ BC，D 还是 BC 的中点。',
      cite: '等腰三角形三线合一：顶角的平分线也是底边上的高线和中线',
      add: [raD, raDb, tkBD, tkDC],
      front: lift1,
      eq: 'AD ⊥ BC，BD = DC'
    },
    {
      say: 'CE 平分 ∠ACB = 2α，所以 ∠ECD = α；CF ⊥ CE，所以 ∠ECF = 90°。',
      cite: '角平分线的定义；垂直的定义',
      add: [raC],
      front: lift1,
      eq: '∠ECD = α，∠ECF = 90°'
    },
    {
      say: 'F 在 AD 的延长线上、D 在 BC 上，所以 F 与 A 分居直线 BC 的两侧；E 却在 AB 上。也就是说射线 CD 落在 ∠ECF 里面，把它分成 α 和另一块。',
      cite: '∠ECF = ∠ECD + ∠DCF（射线 CD 在 ∠ECF 内部）',
      delNow: LD1,
      add: aDCF.concat(led1(['∠ECF = ∠ECD + ∠DCF', '90° = α + ∠DCF ⟹ ∠DCF = 90° − α'])),
      front: lift1,
      eq: '∠DCF = 90° − α'
    },
    {
      say: '在直角三角形 DCF 里，两个锐角互余：∠F = 90° − ∠DCF = α。',
      cite: '直角三角形两锐角互余',
      delNow: LD1,
      add: aF.concat(led1(['∠F = 90° − (90° − α) = α'])),
      front: lift1,
      eq: '∠F = α',
      hold: 3800
    }
  ];

  /* ============================================================
     方法二：两次内角和（不用三线合一）
     ============================================================ */
  var f2 = fig('w');
  var raC2 = AN.right('wraC', Cp, sub(Ep, Cp), sub(Fp, Cp), 14, COL.RED);
  var aACF = AN.angle('waACF', Cp, Ap, Fp, 62, COL.ORANGE, '90°+α', { size: 15, gap: 28, dir: 135 });
  var aF2 = AN.angle('waF', Fp, Bp, Dp, 34, COL.RED, 'α', { size: 16, gap: 24, dir: 25 });

  var lift2 = ['wsAB', 'wsBC', 'wsCA', 'wsAF', 'wsCE', 'wsCF',
               'waB', 'waC1', 'waC2', 'wb1', 'wb2', 'wraC', 'waACF', 'waF'];

  var steps2 = [
    {
      say: '同一道题，换一条路：这一次完全不用 AD ⊥ BC，只用角。',
      cite: '题设：AB = AC，AD 平分 ∠BAC，CE 平分 ∠ACB，CF ⊥ CE',
      add: [f2.fill, f2.sAB, f2.sBC, f2.sCA, f2.sAF, f2.sCE, f2.sCF,
            f2.nA, f2.nB, f2.nC, f2.nD, f2.nE, f2.nF,
            ].concat(f2.aB, f2.aC1, f2.aC2, f2.bis, [f2.cap]),
      eq: '∠B = ∠ACB = 2α'
    },
    {
      say: 'CE 平分 ∠ACB，所以 ∠ACE = α；CF ⊥ CE，所以 ∠ECF = 90°。',
      cite: '角平分线的定义；垂直的定义',
      add: [raC2],
      front: lift2,
      eq: '∠ACE = α，∠ECF = 90°'
    },
    {
      say: '同样因为 F 与 A 分居 BC 两侧，CE 落在 ∠ACF 里面。所以 ∠ACF 是这两块的和：90° + α。',
      cite: '∠ACF = ∠ACE + ∠ECF（射线 CE 在 ∠ACF 内部）',
      delNow: LD2,
      add: aACF.concat(led2(['∠ACF = ∠ACE + ∠ECF = 90° + α'])),
      front: lift2,
      eq: '∠ACF = 90° + α'
    },
    {
      say: '再看 A 处。∠BAC = 180° − 2α − 2α = 180° − 4α，AD 平分它，而 F 就在 AD 上，所以 ∠CAF = 90° − 2α。',
      cite: '三角形内角和 180°；角平分线的定义（射线 AF 就是射线 AD）',
      delNow: LD2,
      add: led2(['∠BAC = 180° − 4α', '∠CAF = ∠CAD = 90° − 2α']),
      front: lift2,
      eq: '∠CAF = 90° − 2α'
    },
    {
      say: '△ACF 的两角已知，第三个角用内角和减出来：α 被加两次、一次被减 —— 消掉了，只剩 α。',
      cite: '三角形内角和 180°',
      delNow: LD2,
      add: aF2.concat(led2(['∠F = 180° − (90° + α) − (90° − 2α)', '∠F = α'])),
      front: lift2,
      eq: '∠F = α',
      hold: 3800
    }
  ];

  /* ============================================================
     注册
     ============================================================ */
  window.MATHLAB_LESSONS = window.MATHLAB_LESSONS || [];
  window.MATHLAB_LESSONS.push({
    id: 'exam-26-1',
    title: '角平分线遇上垂线：∠F 等于多少（试卷 26 · 第 1 问）',
    grade: '初二',
    topic: '几何 · 角平分线',
    tags: ['几何', '角平分线', '三线合一', '等腰', '直角三角形', '内角和'],
    question: '等腰 △ABC 中 AB = AC，AD、CE 是角平分线，CF ⊥ CE 交 AD 延长线于 F，∠B = 2α。求 ∠F（用含 α 的式子表示）。',
    thumbStep: 4,
    methods: [
      {
        name: '三线合一 · 直角三角形两锐角互余', tier: 'proof',
        sub: '严格证明 · 5 步，先证 AD ⊥ BC',
        steps: steps1
      },
      {
        name: '两次内角和 · 全程不用垂直', tier: 'proof',
        sub: '严格证明 · 5 步，只做角度计算',
        steps: steps2
      }
    ]
  });
})();
