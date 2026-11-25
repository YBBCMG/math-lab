/* ============================================================
   中点四边形（瓦里尼翁平行四边形）· 几何模型课
   ------------------------------------------------------------
   模型：任意四边形 ABCD，E、F、G、H 分别是 AB、BC、CD、DA 的中点，
        依次连接得到 EFGH。
   结论：EFGH 一定是平行四边形 —— 与 ABCD 长什么样无关。

   证法（唯一一条主线，全程只用到「中点」）：
       连 AC ⟹ ABCD 拆成 △ABC 与 △ACD
       △ABC 中 E、F 是中点 ⟹ EF 是中位线 ⟹ EF ∥ AC，EF = AC/2
       △ACD 中 H、G 是中点 ⟹ HG 是中位线 ⟹ HG ∥ AC，HG = AC/2
       ⟹ EF ∥ HG 且 EF = HG ⟹ 一组对边平行且相等 ⟹ 平行四边形
   另一条对角线 BD 同理：FG ∥ EH，FG = EH = BD/2。

   延伸（第 11、12 步，另起两幅图）：
       对角线相等 ⟹ EF = FG ⟹ 菱形
       对角线垂直 ⟹ EF ⊥ FG ⟹ 矩形

   【几何为什么这么定】（数值都在 _mmq-verify 里量过）
     · ABCD 特意取成「一般四边形」：两组对边夹角 14.6° / 17.9°（明确不是梯形，
       更不是平行四边形），四个内角 131° / 67° / 98° / 64°，四条边 472 / 307 /
       504 / 205 —— 一眼就是随手画的，学生没法把结论归因于原图形的特殊性。
     · 两条对角线夹角 53.1°、长度比 1.381 —— 于是中点四边形既不方（非矩形）
       也不正（非菱形），是标准答案里那种「明显歪着的平行四边形」。
     · 八个字母的位置不是手填的：按「到所有线 / 所有点 / 其它字 / 画布边界的最小
       净空最大」在 40 个半径 × 144 个方向里搜出来，再写死在这里。量出来的最小
       净空 20.36px（判据要求 ≥ 6）。
     · 两幅延伸小图的坐标由参数算出，不是量出来的：panel1 用 a+c = b+d 保证
       |AC| = |BD| 精确成立；panel2 用 t2 = t1 + 90 保证两条对角线精确垂直。
       图上说的和算的完全一致，不靠「看着像」。

   配色语义（全篇一致）：
     · 深蓝 = 原来的四边形 ABCD
     · 紫   = 中点四边形 EFGH（本课的主角）
     · 蓝虚线 = 对角线（辅助线）
     · 绿杠 = 一组相等的边；青杠 = 另一组相等的边（两组不能同色，否则误读成全都相等）
     · 直角符号：蓝 = 对角线的性质，绿 = 中点四边形的性质
   ============================================================ */
(function () {
  var AN = window.ANNO, ML = window.ML;
  var COL = AN.COL, FS = AN.FS;
  var sub = AN.sub, add = AN.add, mul = AN.mul, unit = AN.unit, dist = AN.dist, mid = AN.mid;
  var RAD = AN.D2R;

  var INK = COL.INK, EDGE = COL.EDGE, FILL = COL.FILL;
  var PURPLE = COL.PURPLE;      // #7c3aed 中点四边形
  var BLUE = COL.BLUE;          // #2563eb 对角线
  var GREEN = COL.GREEN;        // #0f9d58 一组相等
  var TEAL = COL.TEAL;          // #0e7490 另一组相等
  var RED = COL.RED;

  /* ============================================================
     一、主图：一个「歪」的一般四边形 ABCD
     ============================================================ */
  var A = [266, 158], B = [734, 96], C = [654, 392], D = [154, 330];
  var E = mid(A, B), F = mid(B, C), G = mid(C, D), H = mid(D, A);

  /* 八个字母的落位：由净空搜索算好写死（见文件头说明），单位是 viewBox 坐标。
     中点字母 E 在 AB 外侧上方、F 在 BC 外侧右方、G 在 CD 外侧下方、H 在 DA 外侧左方 ——
     都在图形外面，所以一律关掉白色描边（halo 默认就是关的）。 */
  var POS = {
    A: [235, 130], B: [775, 88], C: [694, 406], D: [112, 329],
    E: [500, 85], F: [736, 248], G: [404, 403], H: [171, 228]
  };

  function line(id, X, Y, color, sw, dash) {
    return { id: id, k: 'line', a: X, b: Y, stroke: color, sw: sw, dash: dash };
  }
  function wash(id, pts, rgb, a) {
    return { id: id, k: 'poly', pts: pts, fill: AN.wash(rgb, a), stroke: 'none' };
  }
  function vlabel(id, p, text) {
    return AN.txt(id, p, text, { size: FS.V, weight: 700, color: INK });
  }
  function dot(id, p, color) {
    return { id: id, k: 'circ', c: p, r: 4.6, fill: color, stroke: 'none' };
  }

  var f = {};                                     // 主图元素字典
  f.qABCD = { id: 'qABCD', k: 'poly', pts: [A, B, C, D], fill: FILL, stroke: 'none' };
  f.sAB = line('sAB', A, B, EDGE, 2.8);
  f.sBC = line('sBC', B, C, EDGE, 2.8);
  f.sCD = line('sCD', C, D, EDGE, 2.8);
  f.sDA = line('sDA', D, A, EDGE, 2.8);

  // 中点四边形：紫色淡填充 + 略粗的边（它是主角，比其他线重一点）
  f.qEFGH = wash('qEFGH', [E, F, G, H], '124,58,237', 0.12);
  f.sEF = line('sEF', E, F, PURPLE, 3.2);
  f.sFG = line('sFG', F, G, PURPLE, 3.2);
  f.sGH = line('sGH', G, H, PURPLE, 3.2);
  f.sHE = line('sHE', H, E, PURPLE, 3.2);

  // 两条对角线（第 5 步起才画）
  f.dAC = line('dAC', A, C, BLUE, 2.6, [11, 7]);
  f.dBD = line('dBD', B, D, BLUE, 2.4, [9, 7]);

  // 两个三角形（第 5 步起，用来说明「四边形被切成两个三角形」）
  f.tABC = wash('tABC', [A, B, C], '37,99,235', 0.13);
  f.tACD = wash('tACD', [A, C, D], '37,99,235', 0.13);

  // 等长记号：EF 与 HG 一组（绿），EH 与 FG 一组（青）
  f.tkEF = AN.tick('tkEF', E, F, GREEN, 10);
  f.tkHG = AN.tick('tkHG', H, G, GREEN, 10);
  f.tkEH = AN.tick('tkEH', E, H, TEAL, 10);
  f.tkFG = AN.tick('tkFG', F, G, TEAL, 10);

  // 四个中点的小圆点
  f.pE = dot('pE', E, PURPLE);
  f.pF = dot('pF', F, PURPLE);
  f.pG = dot('pG', G, PURPLE);
  f.pH = dot('pH', H, PURPLE);

  // 八个字母
  f.vA = vlabel('vA', POS.A, 'A');
  f.vB = vlabel('vB', POS.B, 'B');
  f.vC = vlabel('vC', POS.C, 'C');
  f.vD = vlabel('vD', POS.D, 'D');
  f.vE = vlabel('vE', POS.E, 'E');
  f.vF = vlabel('vF', POS.F, 'F');
  f.vG = vlabel('vG', POS.G, 'G');
  f.vH = vlabel('vH', POS.H, 'H');

  /* 主图的图层顺序：先摆填充（外四边形 → 两个三角形 → 内四边形），再摆线，
     最后才是记号和字母。每次 add 完都按这个序重新 front 一遍，
     否则后加的淡色块会把先画好的线压淡（引擎的 op 是整组透明度，压不住就发灰）。 */
  var LIFT = ['qABCD', 'tABC', 'tACD', 'qEFGH',
              'sAB', 'sBC', 'sCD', 'sDA', 'sEF', 'sFG', 'sGH', 'sHE', 'dAC', 'dBD',
              'tkEF', 'tkHG', 'tkEH', 'tkFG',
              'pE', 'pF', 'pG', 'pH', 'vA', 'vB', 'vC', 'vD', 'vE', 'vF', 'vG', 'vH'];

  var MAIN_BASE = [f.qABCD, f.sAB, f.sBC, f.sCD, f.sDA];
  var MAIN_VERT = [f.vA, f.vB, f.vC, f.vD];
  var MAIN_EFGH = [f.qEFGH, f.sEF, f.sFG, f.sGH, f.sHE];
  var MAIN_MIDS = [f.pE, f.pF, f.pG, f.pH, f.vE, f.vF, f.vG, f.vH];

  /* ============================================================
     二、两幅延伸小图
     ------------------------------------------------------------
     坐标全由参数算出来，保证「对角线相等 / 对角线垂直」在图上精确成立，
     而不是画个看着差不多的。图里不写字母（八个小字母挤在两幅小图里必然打架），
     条件与结论由标题和结论句说清楚。
     ============================================================ */
  function diagQuad(cfg) {
    var e1 = [Math.cos(cfg.t1 * RAD), Math.sin(cfg.t1 * RAD)];
    var e2 = [Math.cos(cfg.t2 * RAD), Math.sin(cfg.t2 * RAD)];
    var q = {
      I: cfg.I,
      A: add(cfg.I, mul(e1, -cfg.a)), C: add(cfg.I, mul(e1, cfg.c)),
      B: add(cfg.I, mul(e2, -cfg.b)), D: add(cfg.I, mul(e2, cfg.d))
    };
    q.E = mid(q.A, q.B); q.F = mid(q.B, q.C);
    q.G = mid(q.C, q.D); q.H = mid(q.D, q.A);
    return q;
  }

  var Q1 = diagQuad({ I: [446.7, 229.5], t1: -25.99, t2: 43.90, a: 135.41, c: 255.08, b: 179.50, d: 210.99 });
  var Q2 = diagQuad({ I: [439.8, 224.2], t1: 21.85, t2: 111.85, a: 132.19, c: 253.56, b: 131.70, d: 155.74 });

  function panel(prefix, q) {
    var e = {};
    e.qABCDFill = { id: prefix + 'qABCD', k: 'poly', pts: [q.A, q.B, q.C, q.D], fill: FILL, stroke: 'none' };
    e.dAC = line(prefix + 'dAC', q.A, q.C, BLUE, 2.2, [10, 7]);
    e.dBD = line(prefix + 'dBD', q.B, q.D, BLUE, 2.2, [10, 7]);
    e.qEFGH = wash(prefix + 'qEFGH', [q.E, q.F, q.G, q.H], '124,58,237', 0.14);
    e.sAB = line(prefix + 'sAB', q.A, q.B, EDGE, 2.4);
    e.sBC = line(prefix + 'sBC', q.B, q.C, EDGE, 2.4);
    e.sCD = line(prefix + 'sCD', q.C, q.D, EDGE, 2.4);
    e.sDA = line(prefix + 'sDA', q.D, q.A, EDGE, 2.4);
    e.sEF = line(prefix + 'sEF', q.E, q.F, PURPLE, 3);
    e.sFG = line(prefix + 'sFG', q.F, q.G, PURPLE, 3);
    e.sGH = line(prefix + 'sGH', q.G, q.H, PURPLE, 3);
    e.sHE = line(prefix + 'sHE', q.H, q.E, PURPLE, 3);
    e.pE = dot(prefix + 'pE', q.E, PURPLE);
    e.pF = dot(prefix + 'pF', q.F, PURPLE);
    e.pG = dot(prefix + 'pG', q.G, PURPLE);
    e.pH = dot(prefix + 'pH', q.H, PURPLE);
    e.LIFT = [e.qABCDFill, e.dAC, e.dBD, e.qEFGH, e.sAB, e.sBC, e.sCD, e.sDA,
              e.sEF, e.sFG, e.sGH, e.sHE, e.pE, e.pF, e.pG, e.pH].map(function (x) { return x.id; });
    return e;
  }
  var P1 = panel('a1', Q1);
  var P2 = panel('a2', Q2);

  // panel1：四条边各打一道绿杠（四边相等 ⟹ 菱形）；两条对角线各打一道蓝杠（一样长）
  P1.marks = [
    AN.tick('a1tkEF', Q1.E, Q1.F, GREEN, 11),
    AN.tick('a1tkFG', Q1.F, Q1.G, GREEN, 11),
    AN.tick('a1tkGH', Q1.G, Q1.H, GREEN, 11),
    AN.tick('a1tkHE', Q1.H, Q1.E, GREEN, 11),
    AN.tick('a1tkAC', Q1.A, Q1.C, BLUE, 9, -78),
    AN.tick('a1tkBD', Q1.B, Q1.D, BLUE, 9, 62)
  ];
  P1.LIFT = P1.LIFT.concat(['a1tkEF', 'a1tkFG', 'a1tkGH', 'a1tkHE', 'a1tkAC', 'a1tkBD']);

  // panel2：两条对角线互相垂直（交点处打直角，蓝），中点四边形有一个直角（F 处打直角，绿）
  P2.marks = [
    AN.right('a2rtI', Q2.I, sub(Q2.A, Q2.I), sub(Q2.B, Q2.I), 15, BLUE),
    AN.right('a2rtF', Q2.F, sub(Q2.E, Q2.F), sub(Q2.G, Q2.F), 15, GREEN)
  ];
  P2.LIFT = P2.LIFT.concat(['a2rtI', 'a2rtF']);

  var cap = function (id, at, text, color, size, weight) {
    return AN.txt(id, at, text, { size: size || 21, weight: weight || 700, color: color || INK });
  };

  /* ============================================================
     三、讲稿（13 步）
     ============================================================ */
  var steps = [

    /* 1 题面：先说这是什么，再说字母在哪，并强调它不特殊 */
    {
      say: '先看这张图。四条边首尾相接围出一块地，这就是一个四边形。四个顶点按顺序标了字母：A 在左上，B 在右上，C 在右下，D 在左下。它是随手画的那种歪四边形 —— 四条边各朝一个方向，两组对边都不平行，也没有哪个角是直角。这一点很要紧：后面证出来的结论，不能靠「它刚好是平行四边形或者矩形」来解释。',
      cite: '题设：ABCD 是任意一个一般的四边形，没有任何特殊性质',
      add: MAIN_BASE.concat(MAIN_VERT),
      front: LIFT,
      eq: 'ABCD：一般四边形（对边不平行、无直角、邻边不等）'
    },

    /* 2 取四个中点 */
    {
      say: '接下来在四条边上各取一个点，取法是让这个点把这条边正好分成一样长的两段 —— 这样取出来的点，叫这条边的中点。A 和 B 之间那条边上的点记作 E，B 和 C 之间的记作 F，C 和 D 之间的记作 G，D 和 A 之间的记作 H，图上用小圆点标出来了。',
      cite: '中点：AE = EB，BF = FC，CG = GD，DH = HA',
      add: MAIN_MIDS,
      front: LIFT,
      eq: 'E、F、G、H 分别是 AB、BC、CD、DA 的中点'
    },

    /* 3 连成中点四边形，亮出要证的结论 */
    {
      say: '把这四个中点依次连起来，围出里面这个紫色的小四边形。它叫中点四边形 —— 名字的来由就是它的四个顶点全是原四边形四条边的中点。要证的就一件事：不管外面那个图形歪成什么样，里面这个紫色的四边形，一定是平行四边形。',
      cite: '待证：四边形 EFGH 是平行四边形（对任意四边形 ABCD 都成立）',
      add: MAIN_EFGH,
      front: LIFT,
      eq: '求证：EFGH 是平行四边形'
    },

    /* 4 核心想法：中点要用在三角形里 */
    {
      say: '怎么证？盯住「中点」这两个字。中点在三角形里特别好使：一个三角形，两边各取一个中点，把这两个中点连起来，这条线一定平行于第三条边，长度还正好是第三条边的一半。所以思路是 —— 想办法把中点塞进三角形里去。',
      cite: '三角形中位线定理：连接三角形两边中点的线段平行于第三边，且等于第三边的一半',
      front: LIFT,
      eq: '中位线 ∥ 第三边，中位线 = 第三边 / 2'
    },

    /* 5 连对角线 AC：先说它是什么，再给名字 */
    {
      say: '现在图上还缺两条线：A 和 C 之间那条没画出来的、B 和 D 之间那条没画出来的。这种连接两个不相邻顶点的线，题目里叫对角线。先把 A 和 C 连起来 —— 这一笔把外面这个大四边形切成两个三角形，中点 E、F 落在上面那个里，H、G 落在下面那个里。',
      cite: '辅助线：连接 AC（对角线），把 ABCD 分成 △ABC 和 △ACD',
      add: [f.tABC, f.tACD, f.dAC],
      front: LIFT,
      eq: '连 AC ⟹ ABCD 分成 △ABC 与 △ACD'
    },

    /* 6 EF 是中位线（先说它是连接两边中点的线段，再给名字） */
    {
      say: '先看上边那个三角形，它的三个顶点是 A、B、C。E 在 AB 上、F 在 BC 上，而且两个都是中点 —— 于是 EF 就是连接三角形两边中点的线段，三角形里管它叫中位线。',
      cite: '△ABC 中，E 是 AB 中点、F 是 BC 中点 ⟹ EF 是 △ABC 的中位线',
      front: LIFT,
      eq: 'EF 是 △ABC 的中位线'
    },

    /* 7 中位线定理给出平行和一半 */
    {
      say: '中位线定理直接给两条结论。位置上的：EF 平行于第三条边，这里的第三条边就是 AC。长度上的：EF 正好是 AC 的一半。',
      cite: '中位线定理：EF ∥ AC，EF = AC / 2',
      front: LIFT,
      eq: 'EF ∥ AC，EF = ½AC'
    },

    /* 8 下面那个三角形同样办 */
    {
      say: '下面那个三角形 A、C、D 照方抓药。H 在 DA 上、G 在 CD 上，两个也都是中点，所以 HG 同样是它的中位线。定理再套一遍：HG 平行于 AC，长度也是 AC 的一半。',
      cite: '△ACD 中，H 是 AD 中点、G 是 CD 中点 ⟹ HG ∥ AC，HG = AC / 2',
      front: LIFT,
      eq: 'HG ∥ AC，HG = ½AC'
    },

    /* 9 合起来 → 平行四边形 */
    {
      say: '把两条结论并排看。EF 平行于 AC，HG 也平行于 AC —— 平行于同一条线的两条线互相平行，所以 EF 平行于 HG。长度上一个是一半、另一个也是一半，所以 EF 等于 HG。一组对边既平行又相等，这样的四边形就是平行四边形。证完了。',
      cite: 'EF ∥ AC ∥ HG ⟹ EF ∥ HG；EF = HG = AC/2 ⟹ 一组对边平行且相等',
      add: [f.tkEF, f.tkHG],
      front: LIFT,
      eq: 'EF ∥ HG 且 EF = HG ⟹ EFGH 是平行四边形'
    },

    /* 10 另一条对角线 + 为什么「任意」都行 */
    {
      say: '另一条对角线也没闲着。把 B 和 D 连起来，同样的推理走一遍：FG 和 EH 都平行于 BD，都等于 BD 的一半，所以也各打一道杠。更要紧的是回头看整段证明 —— 从头到尾只用到了「这里是中点」这一件事，从来没用到 AB 有多长、哪个角是多少度。所以外面那个四边形长什么样都无所谓，这才是它敢叫「任意四边形」的理由。',
      cite: '同理：FG ∥ BD ∥ EH，FG = EH = BD/2；证明全程未使用 ABCD 的任何特殊性质',
      add: [f.dBD, f.tkEH, f.tkFG],
      front: LIFT,
      eq: 'FG ∥ EH，FG = EH = ½BD'
    },

    /* 11 延伸一：对角线相等 ⟹ 菱形 */
    {
      say: '既然中点四边形的四条边被两条对角线管死了，那就能反过来出题。看这幅新的图：它的两条对角线一样长。这时 EF 是 AC 的一半、FG 是 BD 的一半，两个一半一样长，所以 EF 等于 FG —— 邻边相等了。平行四边形再叠上邻边相等，就是菱形，图上四条边都打了杠。',
      cite: '若 AC = BD，则 EF = AC/2 = BD/2 = FG ⟹ 平行四边形 + 邻边相等 ⟹ 菱形',
      delNow: LIFT.concat(['qABCD', 'qEFGH']),
      add: [P1.qABCDFill, P1.dAC, P1.dBD, P1.qEFGH, P1.sAB, P1.sBC, P1.sCD, P1.sDA,
            P1.sEF, P1.sFG, P1.sGH, P1.sHE, P1.pE, P1.pF, P1.pG, P1.pH,
            cap('a1cap', [450, 46], '对角线一样长', BLUE)]
        .concat(P1.marks, [
          cap('a1note', [450, 452], 'EF = ½AC，FG = ½BD，AC = BD ⟹ EF = FG ⟹ 菱形', GREEN, 18)
        ]),
      front: P1.LIFT.concat(['a1cap', 'a1note']),
      eq: 'AC = BD ⟹ EF = FG ⟹ EFGH 是菱形'
    },

    /* 12 延伸二：对角线垂直 ⟹ 矩形 */
    {
      say: '换第二个条件。这一幅图的两条对角线互相垂直 —— 交点那里打了直角。EF 平行于 AC，FG 平行于 BD，两条对角线的夹角是直角，那 EF 和 FG 的夹角自然也是直角。平行四边形有一个角是直角，就成了矩形。',
      cite: '若 AC ⊥ BD，则 EF ∥ AC、FG ∥ BD ⟹ EF ⊥ FG ⟹ 平行四边形 + 一个直角 ⟹ 矩形',
      delNow: P1.LIFT.concat(['a1cap', 'a1note']),
      add: [P2.qABCDFill, P2.dAC, P2.dBD, P2.qEFGH, P2.sAB, P2.sBC, P2.sCD, P2.sDA,
            P2.sEF, P2.sFG, P2.sGH, P2.sHE, P2.pE, P2.pF, P2.pG, P2.pH,
            cap('a2cap', [450, 46], '对角线互相垂直', BLUE)]
        .concat(P2.marks, [
          cap('a2note', [450, 452], 'EF ∥ AC，FG ∥ BD，AC ⊥ BD ⟹ EF ⊥ FG ⟹ 矩形', GREEN, 18)
        ]),
      front: P2.LIFT.concat(['a2cap', 'a2note']),
      eq: 'AC ⊥ BD ⟹ EF ⊥ FG ⟹ EFGH 是矩形'
    },

    /* 13 回到主图 + 一句话记法 */
    {
      say: '最后把这句话记住：中点四边形的每一条边，都平行于原来四边形的一条对角线，长度是那条对角线的一半。所以它的形状完全由对角线决定 —— 对角线相等，出菱形；对角线垂直，出矩形；两样都占，就是正方形。',
      cite: '记法：EF = ½AC ∥ AC，FG = ½BD ∥ BD；对角线相等 ⟹ 菱形，对角线垂直 ⟹ 矩形，兼有 ⟹ 正方形',
      delNow: P2.LIFT.concat(['a2cap', 'a2note']),
      add: MAIN_BASE.concat(MAIN_EFGH, MAIN_MIDS, MAIN_VERT, [f.dAC, f.dBD, f.tkEF, f.tkHG, f.tkEH, f.tkFG], [
        cap('end1', [450, 452], '中点四边形的边：∥ 对角线，长度是它的一半', PURPLE, 19),
        cap('end2', [450, 488], '对角线相等 → 菱形　　对角线垂直 → 矩形', GREEN, 19)
      ]),
      front: LIFT.concat(['end1', 'end2']),
      hold: 3600,
      eq: 'EF = ½AC ∥ AC，FG = ½BD ∥ BD ⟹ EFGH 恒为平行四边形'
    }
  ];

  window.MATHLAB_LESSONS = window.MATHLAB_LESSONS || [];
  window.MATHLAB_LESSONS.push({
    id: 'model-midpoint-quad',
    title: '中点四边形：任意四边形，四个中点一连就是平行四边形',
    grade: '初二',
    topic: '几何 · 中点模型',
    tags: ['几何', '中点', '中点四边形', '中位线', '平行四边形', '模型'],
    question: '任意四边形 ABCD 中，E、F、G、H 分别是边 AB、BC、CD、DA 的中点，依次连接四点得到四边形 EFGH。求证：EFGH 是平行四边形。',
    thumbStep: 2,
    methods: [
      {
        name: '连对角线，用两次中位线定理', tier: 'proof',
        sub: '模型课 · 13 步，从「为什么对任意四边形都成立」讲到两条延伸',
        steps: steps
      }
    ]
  });
})();
