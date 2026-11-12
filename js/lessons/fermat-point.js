/* ============================================================
   最值 · 费马点（旋转 60°）
   ------------------------------------------------------------
   题：△ABC 各角都小于 120°，P 是内部一点，且 ∠APB = ∠BPC = ∠CPA = 120°。
       求 PA + PB + PC 的最小值。

   方法一（绕 A 转 60°，严格证明）：
       把 △APC 绕 A 转 60°：P → P′，C → C′
       AP = AP′ 且 ∠PAP′ = 60° ⟹ △APP′ 是等边三角形 ⟹ PP′ = PA
       旋转保长 ⟹ P′C′ = PC
       PA + PB + PC = BP + PP′ + P′C′ ≥ BC′（两点之间线段最短）
       等号当且仅当 B、P、P′、C′ 共线；这时 ∠APB = 180° − ∠APP′ = 120°，与费马点特征吻合
       ⟹ 最小值 = BC′

   方法二（绕 B 转 60°，推论/验证档）：
       A → A′、P → P‴，同法得 PA + PB + PC ≥ A′C
       实测 A′C = BC′（同一批旋转下的托里拆利对称性），两条下界是同一个数

   几何已由 _design_new.mjs 验算（Weiszfeld 迭代求出的 P 与解析构造一致）：
       P=(405.792,281.957)  PA+PB+PC = 634.393 = BC′ = A′C，误差 < 1e-9
       B、P、P′、C′ 共线（180.000°）；A′、P‴、P、C 共线

   画布约束：绕 C 转的那一支会让 B″ 落到 y = 813（出画布 520），故只用绕 A、绕 B 两支。
   ============================================================ */
(function () {
  var AN = window.ANNO, ML = window.ML;
  var COL = AN.COL, FS = AN.FS;
  var sub = AN.sub, add = AN.add, mul = AN.mul, unit = AN.unit, dist = AN.dist, mid = AN.mid;

  /* ---------- 几何：三边刻意互不相等，避免学生误以为题目只对等腰成立 ---------- */
  var A = [400, 180], B = [180, 430], C = [640, 400];
  var P = [405.792, 281.957];                     // 费马点（Weiszfeld 收敛值）
  var O = [(A[0] + B[0] + C[0]) / 3, (A[1] + B[1] + C[1]) / 3];

  // 数学角正向（屏幕上是视觉逆时针）
  function rot(P0, O0, deg) {
    var d = sub(P0, O0), t = deg * Math.PI / 180;
    // 保留 3 位小数：C′ 只有 1 位小数时，BC′ 与 PA+PB+PC 会比出 0.047 的假差额
    var r3 = function (v) { return Math.round(v * 1000) / 1000; };
    return [r3(O0[0] + d[0] * Math.cos(t) + d[1] * Math.sin(t)),
            r3(O0[1] - d[0] * Math.sin(t) + d[1] * Math.cos(t))];
  }
  var Pp = rot(P, A, 60), Cp = rot(C, A, 60);      // 绕 A：P→(491.2,226.0)  C→(710.5,82.2)
  var Ap = rot(A, B, 60), Ppp = rot(P, B, 60);     // 绕 B：A→(73.5,114.5)   P→(164.7,160.4)

  function line(id, X, Y, color, sw, dash) {
    return { id: id, k: 'line', a: X, b: Y, stroke: color || COL.EDGE, sw: sw || 2.4, dash: dash };
  }
  function heavy(id, X, Y, color, sw) {
    return { id: id, k: 'line', a: X, b: Y, stroke: color, sw: sw || 5.5 };
  }
  function poly(id, pts, rgb, a) {
    return { id: id, k: 'poly', pts: pts, fill: AN.wash(rgb || '37,99,235', a == null ? 0.12 : a), stroke: 'none' };
  }
  function led(p, start) {
    return function (lines) {
      return lines.map(function (t, i) {
        return AN.txt(p + 'led' + i, [60, (start || 468) + i * 27], t, {
          size: FS.NOTE, color: COL.INK, anchor: 'start', halo: true
        });
      });
    };
  }
  function circ(id, X, r, fill) {
    return { id: id, k: 'circ', c: X, r: r || 4.6, fill: fill || COL.INK, stroke: 'none' };
  }

  /* ---------- 公共底图 ---------- */
  function fig(p) {
    var e = {};
    e.fill = poly(p + 'fill', [A, B, C], '37,99,235', 0.10);
    e.sAB = line(p + 'sAB', A, B);
    e.sBC = line(p + 'sBC', B, C);
    e.sCA = line(p + 'sCA', C, A);
    e.nA = AN.vname(p + 'A', A, O);
    // B 的字母手工放左侧：重心外推会掉到 y≈441，和底部账本撞行
    e.nB = AN.txt(p + 'B', [B[0] - 30, B[1] + 4], 'B', { size: FS.V, weight: 700, anchor: 'end' });
    e.nC = AN.vname(p + 'C', C, O);
    e.cP = circ(p + 'cP', P, 5, COL.RED);
    // P 是个「线丛」：PA 93.3°、P′P″ 153.3°、PB 213.2°、PC 333.3°（A′C 与 PC 共线，方向同）、
    // 方法一还有紫线 BC′ 沿 33.2° 穿过 P。可用的空档里 93.3°→153.3° 那段最干净，
    // 字母放它中点 123°、距 P 30px：离两侧各 30°，垂直让开 15px，_collide3 复扫为 0。
    e.nP = AN.txt(p + 'P', [P[0] - 16, P[1] - 25], 'P', { size: FS.V, weight: 700, color: COL.RED });
    e.sPA = line(p + 'sPA', P, A, COL.RED, 2.6);
    e.sPB = line(p + 'sPB', P, B, COL.RED, 2.6);
    e.sPC = line(p + 'sPC', P, C, COL.RED, 2.6);
    e.aBPC = AN.angle(p + 'aBPC', P, B, C, 34, COL.RED, '120°', { gap: 25, size: FS.NOTE });
    return e;
  }

  var lift = function (p, extra) {
    return [p + 'sAB', p + 'sBC', p + 'sCA', p + 'nA', p + 'nB', p + 'nC',
            p + 'cP', p + 'nP', p + 'sPA', p + 'sPB', p + 'sPC', p + 'aBPC', p + 'aBPCt']
      .concat(extra || []);
  };

  /* ============================================================
     方法一：绕 A 转 60°
     ============================================================ */
  var f1 = fig('v');
  var fAPC = {
    id: 'vfAPC', k: 'poly', pts: [A, P, C],
    fill: AN.wash('14,116,144', 0.22), stroke: COL.TEAL, sw: 3,
    origin: A
  };
  // P′ 落在紫线 B→C′ 上，字母要往线的下侧让开（紫线在 x=Pp 附近只有 y≈212，下移 18 就够）
  var nPp = AN.txt('vnPp', [Pp[0] + 18, Pp[1] + 18], 'P′', { size: FS.V, weight: 700, anchor: 'start', color: COL.TEAL });
  var nCp = AN.txt('vnCp', [Cp[0] + 24, Cp[1] + 6], 'C′', { size: FS.V, weight: 700, anchor: 'start', color: COL.TEAL });
  var cCp = circ('vcCp', Cp, 4.6, COL.TEAL);
  var cAPp = circ('vcAPp', Pp, 4.6, COL.TEAL);

  var sPPp = heavy('vhPPp', P, Pp, COL.GREEN, 4.6);
  var sBCp = heavy('vhBCp', B, Cp, COL.PURPLE);
  var tkAP = AN.tick('vtkAP', A, P, COL.GREEN, 9, 14);
  var tkPPp = AN.tick('vtkPPp', P, Pp, COL.GREEN, 9, 14);
  var tkPC = AN.tick('vtkPC', P, C, COL.ORANGE, 9, -14);
  var tkPpCp = AN.tick('vtkPpCp', Pp, Cp, COL.ORANGE, 9, -14);

  var L1 = led('v');
  var lift1 = lift('v', ['vfAPC', 'vhPPp', 'vhBCp', 'vtkAP', 'vtkPPp', 'vtkPC', 'vtkPpCp']);

  var steps1 = [
    {
      say: '三角形 ABC，三个角都小于 120 度。要在里面找一个点 P，让它到三个顶点的距离之和 PA 加 PB 加 PC 最小。这个点叫费马点。',
      cite: '费马点问题：求内部一点，使到三顶点距离之和最小',
      add: [f1.fill, f1.sAB, f1.sBC, f1.sCA, f1.nA, f1.nB, f1.nC]
        .concat(L1(['△ABC 各角 < 120°', '求 min(PA + PB + PC)'])),
      eq: '求 min(PA + PB + PC)'
    },
    {
      say: '先说这个点长什么样：它到三个顶点连成的三个角，都是 120 度。图上把 ∠BPC 标出来了，另外两个同理。记住这个 120 度，待会儿要用。',
      cite: '费马点特征：∠APB = ∠BPC = ∠CPA = 120°',
      delNow: ['vled0', 'vled1'],
      add: [f1.cP, f1.nP, f1.sPA, f1.sPB, f1.sPC].concat(f1.aBPC, L1(['三个角都是 120°'])),
      front: lift1,
      eq: '∠APB = ∠BPC = ∠CPA = 120°'
    },
    {
      say: '难点在哪？PA、PB、PC 是三条从同一个点散出去的线段，盯着它们没法下手 —— 你没法直接比较三个长度之和的大小。得想办法把这三段「接」成一条更容易比较的折线。',
      cite: '目标：把三段之和拼成一条折线，再用「两点之间线段最短」',
      delNow: ['vled0'],
      add: L1(['三段散在一个点上，没法直接比较', '要拼成一条折线']),
      front: lift1,
      eq: '把三段拼成折线'
    },
    {
      say: '拼接的工具还是旋转。把三角形 APC 整个绕 A 点转 60 度：C 转到 C 撇，P 转到 P 撇。转 60 度是这道题的关键，因为 60 度和 120 度正好互补。',
      cite: '旋转 △APC 60°：P → P′，C → C′（60° 与 120° 互补）',
      delNow: ['vled0'],
      add: [fAPC].concat(L1(['把 △APC 绕 A 转 60°', 'P → P′，C → C′'])),
      front: lift1.concat(['vfAPC']),
      eq: '△APC → △AP′C′'
    },
    {
      say: '转完先看 P：AP 等于 AP 撇，而 ∠PAP 撇正好是 60 度 —— 一个等腰三角形，顶角 60 度，那它就是等边三角形。所以 PP 撇这条边也等于 PA。',
      cite: 'AP = AP′，∠PAP′ = 60° ⟹ △APP′ 是等边三角形',
      delNow: ['vled0'],
      upd: [{ id: 'vfAPC', rot: 60 }],
      add: [cAPp, nPp, sPPp, tkAP, tkPPp].concat(L1(['AP = AP′，∠PAP′ = 60°', '⟹ △APP′ 等边 ⟹ PP′ = PA'])),
      front: lift1.concat(['vfAPC', 'vhPPp', 'vtkAP', 'vtkPPp']),
      eq: 'PP′ = PA'
    },
    {
      say: '再看 C：旋转不改变长度，所以 P 撇 C 撇就等于 PC。橙色刻度标的就是这一对。',
      cite: '旋转是保距变换：P′C′ = PC',
      delNow: ['vled0'],
      add: [cCp, nCp, tkPC, tkPpCp].concat(L1(['P′C′ = PC（旋转保长）'])),
      front: lift1.concat(['vtkPC', 'vtkPpCp']),
      eq: 'P′C′ = PC'
    },
    {
      say: '现在把三段串起来：PA 换成了 PP 撇，PC 换成了 P 撇 C 撇，PB 不动。于是 PA 加 PB 加 PC，就等于从 B 出发，经 P、经 P 撇，最后到 C 撇的一条折线。',
      cite: '等量代换：PA + PB + PC = BP + PP′ + P′C′',
      delNow: ['vled0'],
      add: L1(['PA + PB + PC', '= BP + PP′ + P′C′（一条折线）']),
      front: lift1,
      eq: 'PA + PB + PC = BP + PP′ + P′C′'
    },
    {
      say: '折线的长度至少是两端的直线距离 —— 这就是「两点之间线段最短」。所以这条折线不短于 B 到 C 撇的直线段，也就是 BC 撇。下界找到了。',
      cite: '两点之间线段最短：BP + PP′ + P′C′ ≥ BC′',
      delNow: ['vled0'],
      add: [sBCp].concat(L1(['折线 ≥ 两端直线距离', '⟹ PA + PB + PC ≥ BC′'])),
      front: lift1.concat(['vhBCp']),
      eq: 'PA + PB + PC ≥ BC′'
    },
    {
      say: '什么时候取下界？只有当 B、P、P 撇、C 撇四点连成一条直线时才取等号。图上紫线就是这条直线，它正好从 P 身上穿过去。',
      cite: '等号条件：B、P、P′、C′ 四点共线',
      delNow: ['vled0'],
      add: L1(['等号 ⟸ B、P、P′、C′ 共线', '紫线穿过 P']),
      front: lift1,
      eq: '等号 ⟸ 四点共线'
    },
    {
      say: '顺便验证一下这个位置对不对：四点共线时，P 处的 ∠APP 撇是 60 度，所以 ∠APB 就是 180 度减 60 度，等于 120 度 —— 正好是费马点该有的那个 120 度。特征对上了。',
      cite: '共线时 ∠APB = 180° − ∠APP′ = 180° − 60° = 120°',
      delNow: ['vled0'],
      add: L1(['∠APB = 180° − 60° = 120°', '与费马点特征一致']),
      front: lift1,
      eq: '∠APB = 120°'
    },
    {
      say: '结论：PA 加 PB 加 PC 的最小值就是 BC 撇这条线段的长。取到它的那个点，就是费马点。这道题把一个「最小值」问题，变成了一条直线段的长度。',
      cite: '综上：min(PA + PB + PC) = BC′',
      delNow: ['vled0'],
      add: [tkAP, tkPPp].concat(L1(['最小值 = BC′', '取到它的点就是费马点'])),
      front: lift1,
      eq: 'min(PA + PB + PC) = BC′',
      hold: 4200
    }
  ];

  /* ============================================================
     方法二：绕 B 转 60°（推论/验证档）
     ============================================================ */
  var f2 = fig('w');
  var fBPA = {
    id: 'wfBPA', k: 'poly', pts: [B, P, A],
    fill: AN.wash('124,58,237', 0.20), stroke: COL.PURPLE, sw: 3,
    origin: B
  };
  var nAp = AN.txt('wnAp', [Ap[0], Ap[1] - 30], 'A′', { size: FS.V, weight: 700, color: COL.PURPLE });
  var nPpp = AN.txt('wnPpp', [Ppp[0] - 26, Ppp[1] + 2], 'P″', { size: FS.V, weight: 700, anchor: 'end', color: COL.PURPLE });
  var cAp = circ('wcAp', Ap, 4.6, COL.PURPLE);
  var cPpp = circ('wcPpp', Ppp, 4.6, COL.PURPLE);

  var sPPpp = heavy('whPPpp', P, Ppp, COL.GREEN, 4.6);
  var sApC = heavy('whApC', Ap, C, COL.BLUE);
  var tkBP = AN.tick('wtkBP', B, P, COL.GREEN, 9, 14);
  var tkPPpp = AN.tick('wtkPPpp', P, Ppp, COL.GREEN, 9, 14);
  var tkApCp = AN.tick('wtkApC', Ap, C, COL.BLUE);
  var tkBCp2 = AN.tick('wtkBCp', B, Cp, COL.BLUE);
  // 方法一那条 B→C′ 在本方法里不画，但刻度要标在两段上做对比 ——
  // 补一条虚线把它显式画出来（虚线 = 「上一种转法得到的线」），否则刻度会悬空。
  var sBCp2 = line('wsBCp', B, Cp, COL.BLUE, 2.6, [9, 7]);

  var L2 = led('w');
  var lift2 = lift('w', ['wfBPA', 'whPPpp', 'whApC', 'wsBCp', 'wtkBP', 'wtkPPpp', 'wtkApC', 'wtkBCp']);

  var steps2 = [
    {
      say: '同一个套路，换个顶点再转一次：这次把三角形 BPA 绕 B 点转 60 度，A 转到 A 撇，P 转到 P 双撇。',
      cite: '旋转 △BPA 60°：A → A′，P → P″',
      add: [f2.fill, f2.sAB, f2.sBC, f2.sCA, f2.nA, f2.nB, f2.nC,
            f2.cP, f2.nP, f2.sPA, f2.sPB, f2.sPC]
        .concat(f2.aBPC, L2(['换顶点：把 △BPA 绕 B 转 60°', 'A → A′，P → P″'])),
      front: lift2,
      eq: '△BPA → △BP″A′'
    },
    {
      say: '同样地，BP 等于 BP 双撇、夹角 60 度，所以三角形 BPP 双撇也是等边三角形，PP 双撇等于 PB。而 A 撇 P 双撇等于 AP。',
      cite: 'BP = BP″，∠PBP″ = 60° ⟹ △BPP″ 等边 ⟹ PP″ = PB；A′P″ = AP',
      delNow: ['wled0', 'wled1'],
      upd: [{ id: 'wfBPA', rot: 60 }],
      add: [cAp, nAp, cPpp, nPpp, sPPpp, tkBP, tkPPpp].concat(L2(['PP″ = PB', 'A′P″ = AP'])),
      front: lift2.concat(['wfBPA', 'whPPpp', 'wtkBP', 'wtkPPpp']),
      eq: 'PP″ = PB，A′P″ = AP'
    },
    {
      say: '于是 PA 加 PB 加 PC 等于 A 撇 P 双撇、加 P 双撇 P、加 PC —— 又成了一条从 A 撇到 C 的折线。折线不短于直线，所以它大于等于 A 撇 C。',
      cite: '两点之间线段最短：A′P″ + P″P + PC ≥ A′C',
      delNow: ['wled0', 'wled1'],
      add: [sApC].concat(L2(['PA + PB + PC = A′P″ + P″P + PC', '≥ A′C'])),
      front: lift2.concat(['whApC']),
      eq: 'PA + PB + PC ≥ A′C'
    },
    {
      say: '关键来了：A 撇 C 这条线段，长度和刚才的 BC 撇一模一样。蓝色刻度分别标在两段上 —— 两种转法砍出来的，是同一个下界。',
      cite: '两种转法给出同一个下界：A′C = BC′',
      delNow: ['wled0', 'wled1'],
      add: [sBCp2, tkApCp, tkBCp2].concat(L2(['A′C = BC′', '两种转法给出同一个下界'])),
      front: lift2.concat(['whApC', 'wsBCp', 'wtkApC', 'wtkBCp']),
      eq: 'A′C = BC′'
    },
    {
      say: '为什么必然相等？两次旋转角都是 60 度，各自长出一个等边三角形。这组等边三角形让 A 撇 C 和 BC 撇成了同一个长度的两种画法 —— 这是费马点构造的对称性，用余弦定理一代就能验出来。',
      cite: '托里拆利构造的对称性：两组等边三角形给出同一长度（余弦定理可验，此处只作验证）',
      delNow: ['wled0', 'wled1'],
      add: L2(['两次旋转都是 60°', '各得一个等边三角形', '⟹ A′C 与 BC′ 同长']),
      front: lift2,
      eq: 'A′C = BC′（对称性）'
    },
    {
      say: '两条路殊途同归：不管绕哪个顶点转 60 度，砍出来的下界都是同一个数。这个数就是费马点给出最小值 —— 也就是以任意一边为边、向外作等边三角形后，对面那个顶点到新顶点的距离。',
      cite: '结论：min(PA + PB + PC) = BC′ = A′C',
      delNow: ['wled0', 'wled1'],
      add: L2(['无论绕哪个顶点转，下界相同', '这个下界就是费马点的最小值']),
      front: lift2,
      eq: 'min(PA + PB + PC) = BC′',
      hold: 4200
    }
  ];

  window.MATHLAB_LESSONS = window.MATHLAB_LESSONS || [];
  window.MATHLAB_LESSONS.push({
    id: 'fermat-point',
    title: '费马点：PA + PB + PC 的最小值',
    grade: '初三',
    topic: '几何 · 最值问题',
    tags: ['几何', '最值', '旋转', '费马点', '等边三角形'],
    question: '△ABC 的三个内角都小于 120°，P 是三角形内一点，且 ∠APB = ∠BPC = ∠CPA = 120°。求 PA + PB + PC 的最小值。',
    thumbStep: 7,
    methods: [
      {
        name: '绕 A 转 60° · 折线拉直', tier: 'proof',
        sub: '严格证明 · 11 步，把三段和拉成一条折线，下界是 BC′',
        steps: steps1
      },
      {
        name: '绕 B 转 60° · 殊途同归', tier: 'corollary',
        sub: '推论验证 · 6 步，换顶点再转一次，下界 A′C 与 BC′ 同长',
        steps: steps2
      }
    ]
  });
})();
