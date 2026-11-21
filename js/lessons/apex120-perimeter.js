/* ============================================================
   B1：AB = AC = a、∠BAC = 120°，l 是 AC 的垂直平分线，P 在 l 上动，
       以 AP 为边作等边 △APQ，求 △ADQ 周长的最小值（用 a、b 表示，最小处 AP = b）

   ------------------------------------------------------------
   △ADQ 周长 = AD + DQ + AQ
     AD = a/2          —— 定值（D 是 AC 中点）
     AQ = AP           —— 等边三角形，不是定值
   ⟹ 周长 = a/2 + (DQ + AQ)，要压的是 DQ + AQ 这两段

   瓜豆：P 在直线 l 上 ⟹ Q = P 绕 A 转 −60° ⟹ Q 在 l 的像 l′ 上（直线）
   剪网：A、D 是定点，Q 在定直线 l′ 上 ⟹ 作 A 关于 l′ 的对称点 A″
        DQ + AQ = DQ + QA″ ≥ DA″，等号当 A″、Q、D 共线
        最小值 = a/2 + a√3/2 = a(1+√3)/2
   代入 b：最小值处 AQ = a/√3 = b ⟹ a = √3 b ⟹ 答案 = b(3+√3)/2

   几何已由 _design_b1.mjs 验算（a = 6 格，1 格 = 50px，屏幕坐标）：
     A[420,400] B[720,400] C[270,140.2] D[345,270.1] D′[495,270.1] A″[570,140.2]
     l 过 D 方向 (0.866,−0.5)；l′ 过 D′ 方向 (0.866,0.5)（l′ 必然经过 B）
     Q₀ = [420,226.8]（A 的正上方），周长 8.1962 格，AP = 3.4641 格
     演示三点 t = −3.0 / −0.5 / 2.0：周长 8.79 → 8.62 → 11.44（先降后升）
     谷底 t = −a/(2√3) = −1.7321，两侧不对称，采样点得按这个位置选
   注 1：t 是沿 l 的「格」单位，别当 px 用（第一版写成 t=−300，点飞到画外）
   注 2：a 最初取 4 格，结果 120° 角把图形压成画面 1/3 高 —— 放大到 6 格才撑满
   ============================================================ */
(function () {
  var AN = window.ANNO, ML = window.ML;
  var COL = AN.COL, FS = AN.FS;
  var sub = AN.sub, add = AN.add, mul = AN.mul, unit = AN.unit, dist = AN.dist;

  /* ---------- 几何 ---------- */
  var S = 50;                    // 1 格 = 50px
  var A = [420, 400], B = [720, 400], C = [270, 140.2];
  var D = [345, 270.1];          // AC 中点 + l 的垂足
  var Dp = [495, 270.1];         // D 的像，在 l′ 上（l′ 必然经过 B）
  var Ap = [570, 140.2];         // A 关于 l′ 的对称点
  var K = [0.8660254, -0.5];     // l 的方向（屏幕）
  var K2 = [0.8660254, 0.5];     // l′ 的方向（屏幕）

  function on(P, d, s) { return [P[0] + d[0] * s, P[1] + d[1] * s]; }
  // 绕 A 在屏幕上转 +60°（= 数学 −60°），把 P 送到 Q
  function toQ(P) {
    var dx = P[0] - A[0], dy = P[1] - A[1];
    var c = 0.5, s = 0.8660254;
    return [A[0] + dx * c - dy * s, A[1] + dx * s + dy * c];
  }
  function onL(t) { return on(D, K, t * S); }   // t 的单位是「格」

  var P1 = onL(-3.0), P2 = onL(-0.5), P3 = onL(2.0);   // 谷底在 t=−1.732，两侧对称取样
  var Q1 = toQ(P1), Q2 = toQ(P2), Q3 = toQ(P3);
  var P0 = onL(-1.7320508), Q0 = toQ(P0);

  /* ---------- 元素工厂 ---------- */
  function line(id, X, Y, color, sw, dash) {
    return { id: id, k: 'line', a: X, b: Y, stroke: color || COL.EDGE, sw: sw || 2.4, dash: dash };
  }
  function heavy(id, X, Y, color, sw) {
    return { id: id, k: 'line', a: X, b: Y, stroke: color, sw: sw || 5 };
  }
  function dot(id, P, color, r) {
    return { id: id, k: 'circ', c: P, r: r || 4.4, fill: color, stroke: 'none' };
  }
  function led(p) {
    return function (lines, start) {
      return lines.map(function (t, i) {
        return AN.txt(p + 'led' + i, [60, (start || 452) + i * 25], t, {
          size: FS.NOTE, color: COL.INK, anchor: 'start', halo: true
        });
      });
    };
  }
  function scaleBar(p) {
    return [
      line(p + 'scA', [700, 84], [700, 100], COL.INK, 2),
      line(p + 'scB', [750, 84], [750, 100], COL.INK, 2),
      line(p + 'scL', [700, 92], [750, 92], COL.INK, 2),
      AN.txt(p + 'scT', [725, 70], '1 格', { size: FS.TINY, color: COL.INK, halo: false })
    ];
  }
  function tri(p, P, Q, color) {
    return [
      line(p + 'a', A, P, color, 1.6),
      line(p + 'b', P, Q, color, 1.6),
      line(p + 'c', Q, A, color, 1.6)
    ];
  }

  /* ---------- 方法一的元素 ---------- */
  var vAB = heavy('vAB', A, B, COL.EDGE, 3.2);
  var vAC = heavy('vAC', A, C, COL.EDGE, 3.2);
  var vl = line('vl', on(D, K, -180), on(D, K, 220), COL.BLUE, 2.4, [10, 8]);
  var vlt = line('vlt', on(Dp, K2, -250), on(Dp, K2, 280), COL.TEAL, 2.4, [10, 8]);
  var vrtD = AN.right('vrtD', D, sub(C, D), K, 13, COL.TEAL);

  var vA1 = dot('vA1', A, COL.INK), vB1 = dot('vB1', B, COL.INK);
  var vC1 = dot('vC1', C, COL.INK), vD1 = dot('vD1', D, COL.TEAL);
  var vnA = AN.txt('vnA', [412, 430], 'A', { size: FS.V, weight: 700, halo: false });
  var vnB = AN.txt('vnB', [728, 430], 'B', { size: FS.V, weight: 700, halo: false });
  var vnC = AN.txt('vnC', [252, 120], 'C', { size: FS.V, weight: 700, halo: false });
  var vnD = AN.txt('vnD', [319, 259], 'D', { size: FS.V, color: COL.TEAL, weight: 700, halo: false });
  var vlT = AN.txt('vlT', on(D, K, 214), 'l', { size: FS.SIDE, color: COL.BLUE, weight: 700, halo: true });
  var vltT = AN.txt('vltT', on(Dp, K2, 214), "l′", { size: FS.SIDE, color: COL.TEAL, weight: 700, halo: true });

  var vtr1 = tri('vt1', P1, Q1, AN.wash('124,58,237', 0.55));
  var vtr2 = tri('vt2', P2, Q2, AN.wash('124,58,237', 0.55));
  var vtr3 = tri('vt3', P3, Q3, AN.wash('124,58,237', 0.55));

  var vd1 = dot('vP1', P1, COL.PURPLE, 4), vq1 = dot('vQ1', Q1, COL.ORANGE, 4.4);
  var vd2 = dot('vP2', P2, COL.PURPLE, 4), vq2 = dot('vQ2', Q2, COL.ORANGE, 4.4);
  var vd3 = dot('vP3', P3, COL.PURPLE, 4), vq3 = dot('vQ3', Q3, COL.ORANGE, 4.4);
  var vnP1 = AN.txt('vnP1', [P1[0] - 8, P1[1] + 26], 'P₁', { size: FS.NOTE, color: COL.PURPLE, weight: 700, halo: false });
  var vnP2 = AN.txt('vnP2', [P2[0] - 24, P2[1] + 4], 'P₂', { size: FS.NOTE, color: COL.PURPLE, weight: 700, halo: false });
  var vnP3 = AN.txt('vnP3', [P3[0] + 24, P3[1] - 2], 'P₃', { size: FS.NOTE, color: COL.PURPLE, weight: 700, halo: false });
  var vnQ1 = AN.txt('vnQ1', [Q1[0] - 24, Q1[1] - 8], 'Q₁', { size: FS.NOTE, color: COL.ORANGE, weight: 700, halo: false });
  var vnQ2 = AN.txt('vnQ2', [Q2[0] - 26, Q2[1] + 18], 'Q₂', { size: FS.NOTE, color: COL.ORANGE, weight: 700, halo: false });
  var vnQ3 = AN.txt('vnQ3', [Q3[0] + 24, Q3[1] + 12], 'Q₃', { size: FS.NOTE, color: COL.ORANGE, weight: 700, halo: false });

  var vdq1 = heavy('vdq1', D, Q1, COL.RED, 3.4), vaq1 = heavy('vaq1', Q1, A, COL.RED, 3.4);
  var vdq2 = heavy('vdq2', D, Q2, COL.RED, 3.4), vaq2 = heavy('vaq2', Q2, A, COL.RED, 3.4);
  var vdq3 = heavy('vdq3', D, Q3, COL.RED, 3.4), vaq3 = heavy('vaq3', Q3, A, COL.RED, 3.4);
  var vql = heavy('vql', Q1, Q3, COL.ORANGE, 4.6);

  var vd0 = dot('vP0', P0, COL.PURPLE, 4.4), vq0 = dot('vQ0', Q0, COL.ORANGE, 5);
  var vdq0 = heavy('vdq0', D, Q0, COL.RED, 4.4), vaq0 = heavy('vaq0', Q0, A, COL.RED, 4.4);
  var vnQ0 = AN.txt('vnQ0', [Q0[0] - 42, Q0[1] + 2], 'Q₀', { size: FS.NOTE, color: COL.ORANGE, weight: 700, halo: false });
  var vnP0 = AN.txt('vnP0', [P0[0] - 26, P0[1] + 6], 'P₀', { size: FS.NOTE, color: COL.PURPLE, weight: 700, halo: false });

  var SB1 = scaleBar('v');

  var lift1 = ['vAB', 'vAC', 'vl', 'vlt', 'vt1a', 'vt1b', 'vt1c', 'vt2a', 'vt2b', 'vt2c',
    'vt3a', 'vt3b', 'vt3c', 'vdq1', 'vaq1', 'vdq2', 'vaq2', 'vdq3', 'vaq3', 'vdq0', 'vaq0', 'vql',
    'vrtD', 'vnA', 'vnB', 'vnC', 'vnD', 'vlT', 'vltT', 'vnP1', 'vnP2', 'vnP3', 'vnQ1', 'vnQ2', 'vnQ3',
    'vnP0', 'vnQ0', 'vscA', 'vscB', 'vscL', 'vscT',
    'vA1', 'vB1', 'vC1', 'vD1', 'vP1', 'vQ1', 'vP2', 'vQ2', 'vP3', 'vQ3', 'vP0', 'vQ0'];

  /* ============================================================
     方法一：量一量（演示档，8 步）
     ============================================================ */
  var p1 = 'v';
  var steps1 = [
    {
      say: '先看这道题的骨架：AB 和 AC 一样长，都叫 a，顶角一百二十度。D 是 AC 的中点。过 D 作 AC 的垂线。P 是这条垂线上的动点，每取一个 P，就以 AP 为边往外翻一个等边三角形，翻出来的顶点叫 Q。问的是三角形 ADQ 的周长什么时候最小。为了好量，图里取 a 等于六格。',
      cite: '设定：AB = AC = 6 格，∠BAC = 120°，l ⊥ AC 于中点 D，P 在 l 上',
      add: [vAB, vAC, vl, vA1, vB1, vC1, vD1, vnA, vnB, vnC, vnD, vlT, vrtD]
        .concat(AN.angle('varcA', A, B, C, 56, COL.ORANGE, '120°'))
        .concat(SB1)
        .concat(led(p1)(['AB = AC = 6 格，∠BAC = 120°', 'l ⊥ AC 于 D，P 在 l 上动'], 452)),
      front: lift1,
      eq: '求 min(△ADQ 的周长)'
    },
    {
      say: '周长的三边先拆开看。AD 是定值 —— D 是 AC 中点，所以 AD 就是半个 a，三格。AQ 呢？它就是 AP，跟着 P 变。真正麻烦的只有 DQ 和 AQ 两段加起来。所以这题的全部难度，都压在「怎么让 DQ 加 AQ 最短」上。',
      cite: '周长 = AD + DQ + AQ，AD = a/2 = 3 格（定值），AQ = AP',
      add: led(p1)(['周长 = AD + DQ + AQ', 'AD = 3 格定值，AQ = AP 跟着变']),
      front: lift1,
      eq: 'min(周长) = a/2 + min(DQ + AQ)'
    },
    {
      say: '把 P 放到左边这个位置，叫 P₁。以 AP₁ 为边翻出等边三角形，顶点是 Q₁。量一下：AQ₁ 四点二四格，DQ₁ 一点五五格，加上那三格，周长八点七九。',
      cite: 'P₁ 在 l 偏左下：AQ₁ = 4.24，DQ₁ = 1.55，周长 = 8.79 格',
      add: vtr1.concat([vd1, vq1, vnP1, vnQ1, vdq1, vaq1])
        .concat(led(p1)(['P₁：AQ = 4.24，DQ = 1.55', '周长 = 8.79 格'])),
      front: lift1,
      eq: '周长 = 3 + 4.24 + 1.55 = 8.79'
    },
    {
      say: 'P 沿着这条垂线往上挪到 P₂，再翻一次，拿到 Q₂。这回 AQ₂ 三点零四，DQ₂ 二点五八 —— 两段一涨一落，但加起来只有五点六二，比刚才小。周长八点六二，降了。',
      cite: 'P₂ 上移：AQ₂ = 3.04，DQ₂ = 2.58，周长 = 8.62 格（比 P₁ 小）',
      add: vtr2.concat([vd2, vq2, vnP2, vnQ2, vdq2, vaq2])
        .concat(led(p1)(['P₂：AQ = 3.04，DQ = 2.58', '周长 = 8.62 格（降）'])),
      front: lift1,
      eq: '周长 = 3 + 3.04 + 2.58 = 8.62'
    },
    {
      say: '继续往上，到 P₃。AQ₃ 三点六一，DQ₃ 四点八四，周长十一点四四 —— 反而比刚才大了一大截。说明刚才那一步走对了方向，但走过头了，谷底就在 P₁ 和 P₃ 之间某处。',
      cite: 'P₃ 继续上移：AQ₃ = 3.61，DQ₃ = 4.84，周长 = 11.44 格（回升）',
      add: vtr3.concat([vd3, vq3, vnP3, vnQ3, vdq3, vaq3])
        .concat(led(p1)(['P₃：AQ = 3.61，DQ = 4.84', '周长 = 11.44 格（回升）'])),
      front: lift1,
      eq: '周长 = 3 + 3.61 + 4.84 = 11.44'
    },
    {
      say: '先别急着找谷底，先看一件更奇怪的事：Q₁、Q₂、Q₃ 这三个点，连起来是一条直线。P 明明在垂线上跑，Q 却在另一条直线上跑 —— 这就是瓜豆原理：Q 是 P 绕 A 转六十度来的，所以 Q 的轨迹，是垂线转过六十度之后落的那条线。我们就叫它轨迹线。',
      cite: '三个 Q 共线 ⟹ Q 的轨迹 l′ = l 绕 A 旋转 60°（瓜豆原理）',
      // 三个三角形和三对红线在 6 格尺寸下会叠成一团 —— 讲共线时先清掉，只留 Q 点
      add: [vql, vlt, vltT].concat(led(p1)(['三个 Q 拉成一条线', "轨迹 l′ = l 绕 A 转 60°"])),
      del: ['vt1a', 'vt1b', 'vt1c', 'vt2a', 'vt2b', 'vt2c', 'vt3a', 'vt3b', 'vt3c',
        'vdq1', 'vaq1', 'vdq2', 'vaq2', 'vdq3', 'vaq3'],
      front: ['vAB', 'vAC', 'vl', 'vlt', 'vql', 'vrtD', 'vnA', 'vnB', 'vnC', 'vnD', 'vlT', 'vltT',
        'vnP1', 'vnP2', 'vnP3', 'vnQ1', 'vnQ2', 'vnQ3', 'vnP0', 'vnQ0', 'vscA', 'vscB', 'vscL', 'vscT',
        'vA1', 'vB1', 'vC1', 'vD1', 'vP1', 'vQ1', 'vP2', 'vQ2', 'vP3', 'vQ3'],
      eq: 'Q 在定直线 l′ 上'
    },
    {
      say: '有了轨迹就好办了。把 P 卡在谷底位置，翻出来的 Q 叫 Q₀。量一下：AQ₀ 三点四六，DQ₀ 一点七三，周长八点二 —— 比刚才量的每一次都小。注意 Q₀ 的位置很特别，它正好在 A 的正上方。',
      cite: '谷底：AQ₀ = 3.46，DQ₀ = 1.73，周长 = 8.20 格（最小）',
      add: [vd0, vq0, vdq0, vaq0, vnQ0, vnP0]
        .concat(led(p1)(['谷底：AQ = 3.46，DQ = 1.73', '周长 = 8.20 格（最小）'])),
      front: lift1,
      eq: 'min(周长) = 3 + 3.46 + 1.73 = 8.20'
    },
    {
      say: '量出来的八点二格，换算回字母：a 等于六格时，六乘一加根号三再除以二，正好八点二。但题目要的是含 a 和 b 的式子 —— 这里 b 是谷底时的 AP，也就是三点四六格，等于 a 除以根号三。所以最小值其实可以写成 b 乘以三加根号三除以二。为什么，下一个方法证给你看。',
      cite: '代入 a = 6：6(1+√3)/2 = 8.196 ✓；谷底 AP = a/√3 = b',
      add: led(p1)(['8.20 格 = a(1+√3)/2（a = 6）', '谷底 AP = a/√3 = b'])
        .concat(SB1),
      front: lift1,
      eq: 'min(周长) = a(1+√3)/2 = b(3+√3)/2'
    }
  ];

  /* ============================================================
     方法二：对称 + 三角不等式（证明档，10 步）
     ============================================================ */
  var p2 = 'w';
  var wAB = heavy('wAB', A, B, COL.EDGE, 3.2);
  var wAC = heavy('wAC', A, C, COL.EDGE, 3.2);
  var wl = line('wl', on(D, K, -180), on(D, K, 220), COL.BLUE, 2.4, [10, 8]);
  var wlp = line('wlp', on(Dp, K2, -250), on(Dp, K2, 280), COL.TEAL, 2.4, [10, 8]);
  var wA1 = dot('wA1', A, COL.INK), wD1 = dot('wD1', D, COL.TEAL);
  var wDp1 = dot('wDp1', Dp, COL.TEAL, 3.6), wAp1 = dot('wAp1', Ap, COL.GREEN, 4.8);
  var wQ01 = dot('wQ01', Q0, COL.ORANGE, 5);
  var wnA = AN.txt('wnA', [412, 430], 'A', { size: FS.V, weight: 700, halo: false });
  var wnD = AN.txt('wnD', [319, 259], 'D', { size: FS.V, color: COL.TEAL, weight: 700, halo: false });
  var wnDp = AN.txt('wnDp', [507, 232], "D′", { size: FS.NOTE, color: COL.TEAL, weight: 700, halo: false });
  var wnAp = AN.txt('wnAp', [592, 124], "A″", { size: FS.V, color: COL.GREEN, weight: 700, halo: false });
  var wnQ0 = AN.txt('wnQ0', [Q0[0] - 42, Q0[1] + 2], 'Q₀', { size: FS.NOTE, color: COL.ORANGE, weight: 700, halo: false });
  var wltT = AN.txt('wltT', on(Dp, K2, 214), "l′", { size: FS.SIDE, color: COL.TEAL, weight: 700, halo: true });

  var wB1 = dot('wB1', B, COL.INK);
  var wnB = AN.txt('wnB', [728, 430], 'B', { size: FS.V, weight: 700, halo: false });
  var wQ2 = dot('wQ2', Q2, COL.ORANGE, 4.4);
  var wnQ2 = AN.txt('wnQ2', [Q2[0] - 4, Q2[1] - 30], 'Q', { size: FS.NOTE, color: COL.ORANGE, weight: 700 });
  var wdq2 = heavy('wdq2', D, Q2, COL.RED, 3.6);
  var waq3 = heavy('waq3', Q2, A, COL.RED, 3.6);
  var wsegAp = line('wsegAp', A, Ap, COL.GREEN, 2.2, [7, 6]);   // AA″ 对称虚线
  var wdap = heavy('wdap', D, Ap, COL.GREEN, 3.6);              // DA″ 下界
  var wdq = heavy('wdq', D, Q0, COL.RED, 4.4);
  var waq = heavy('waq', Q0, A, COL.RED, 4.4);
  var waq2 = line('waq2', Q2, Ap, COL.GREEN, 2.6, [6, 5]);      // QA″ = QA（用 Q₂ 演示，Q₀ 在 DA″ 上会退化成直线）
  var wrtD = AN.right('wrtD', D, sub(C, D), K, 13, COL.TEAL);

  var lift2 = ['wAB', 'wAC', 'wl', 'wlp', 'wsegAp', 'waq2', 'wdq2', 'waq3', 'wdap', 'wdq', 'waq',
    'wrtD', 'wnA', 'wnB', 'wnD', 'wnDp', 'wnAp', 'wnQ0', 'wnQ2', 'wltT',
    'wA1', 'wB1', 'wD1', 'wDp1', 'wAp1', 'wQ01', 'wQ2'];

  var steps2 = [
    {
      say: '现在把刚才量出来的结论证明掉。目标只有一个：把 DQ 加 AQ 这两段的长度和，压成一条笔直的线段。',
      cite: '目标：把 DQ + AQ 压成一条线段',
      add: [wAB, wAC, wl, wA1, wB1, wD1, wnA, wnB, wnD].concat(led(p2)(['目标：把 DQ + AQ 压直', '周长 = a/2 + (DQ + AQ)'])),
      front: lift2,
      eq: '要证 min(DQ + AQ) = a√3/2'
    },
    {
      say: '第一步还是瓜豆。P 在垂线上，Q 是 P 绕 A 转六十度的像，所以 Q 的轨迹，就是垂线绕 A 转六十度之后的像 —— 还是那条轨迹线。这一步的含义是：Q 不是一个乱跑的点，它被锁死在一条直线上。本来 DQ 加 AQ 是「两个都在动的线段」，现在只剩「Q 在一条线上动」。',
      cite: '瓜豆：P 在 l 上 ⟹ Q 在 l′ 上（l′ = l 绕 A 转 60°）',
      add: [wlp, wltT, wDp1, wnDp].concat(led(p2)(['P 在 l 上 ⟹ Q 在 l′ 上', 'Q 被锁在一条定直线上'])),
      front: lift2,
      eq: 'Q 的轨迹是定直线 l′'
    },
    {
      say: '第二步做对称。A 是定点，轨迹线是定直线 —— 那就把 A 翻到轨迹线的另一侧，翻出来的点叫 A 两撇。做法很朴素：过 A 作轨迹线的垂线，垂足记下来，再等距离延长出去。',
      cite: '作 A 关于 l′ 的对称点 A″',
      add: [wsegAp, wAp1, wnAp].concat(led(p2)(['作 A 关于 l′ 的对称点 A″', 'A″ 在 l′ 的另一侧'])),
      del: ['wnDp', 'wDp1'],
      front: lift2
    },
    {
      say: '对称点一出来，魔法就生效了。因为 A 和 A 两撇关于轨迹线对称，而 Q 就在轨迹线上 —— 所以 QA 和 QA 两撇永远是相等的两段。把 AQ 换成 QA 两撇，折线 DQ 加 AQ 就变成了 D 到 Q 再到 A 两撇。',
      cite: 'l′ 是 AA″ 的垂直平分线 ⟹ QA = QA″（对 l′ 上任一点 Q）',
      add: [wQ2, wnQ2, wdq2, waq3, waq2].concat(led(p2)(['l′ 垂直平分 AA″', '⟹ QA = QA″（Q 在 l′ 上）'])),
      front: lift2,
      eq: 'QA = QA″'
    },
    {
      say: '折线一旦换完，三角不等式就上了。从 D 出发走到 Q 再走到 A 两撇，这条路永远不比「直接走 DA 两撇」更短 —— 两点之间线段最短。等下号成立时，Q 必须正好落在 DA 两撇这条直线上。',
      cite: 'DQ + QA″ ≥ DA″（两点之间线段最短）',
      add: [wdap].concat(led(p2)(['DQ + QA″ ≥ DA″', '等号当 A″、Q、D 共线'])),
      front: lift2,
      eq: 'DQ + AQ ≥ DA″'
    },
    {
      say: '下界找到了，那就得把 DA 两撇的长度算出来。这里有个漂亮的事实：A 到轨迹线的距离，等于 A 到垂线的距离 —— 因为轨迹线就是垂线转过来的，转不改变距离。而 A 到垂线的距离是多少？这条垂线垂直平分 AC，所以正好是半个 AC，也就是二分之 a。',
      cite: '旋转保距：d(A, l′) = d(A, l) = AC/2 = a/2',
      add: [wrtD].concat(led(p2)(['d(A, l′) = d(A, l)（旋转保距）', '= a/2（l 平分 AC，D 处直角）'])),
      front: lift2
    },
    {
      say: '于是 AA 两撇的长度就是 a —— 对称点到原点的距离是垂距的两倍。方向呢？AA 两撇垂直于轨迹线，而轨迹线比垂线多转了六十度，垂线又垂直 AC —— 算下来 AA 两撇正好落在「AC 往 AB 那边转六十度」的方向上。',
      cite: '|AA″| = 2·(a/2) = a，方向 = AC 方向 − 60°',
      add: led(p2)(['|AA″| = 2 × a/2 = a', '方向 = AC 转 60° 到 AB 那侧']),
      front: lift2,
      eq: '|AA″| = a'
    },
    {
      say: '两支都齐了：DA 两撇这条边，一头是 D（在 AC 上，距 A 二分之 a，方向一百二十度），一头是 A 两撇（距 A 为 a，方向六十度）。用勾股或者余弦定理算一下，长度是 a 乘根号三再除以二。',
      cite: 'DA″ = a√3/2（D 在 AC 上距 A a/2、A″ 距 A 为 a、夹角 60°）',
      add: led(p2)(['DA″ = a√3/2', '（两边 a/2 与 a，夹角 60°）']),
      front: lift2,
      eq: 'DA″ = a√3/2'
    },
    {
      say: '所以周长最小值就是二分之 a 加上二分之根号三 a，也就是 a 乘一加根号三除以二。取等的位置：Q 落在 DA 两撇与轨迹线的交点上 —— 图上那个 Q₀ 就是它。',
      cite: 'min(周长) = a/2 + a√3/2 = a(1+√3)/2，取等 Q = DA″ ∩ l′',
      add: [wdq, waq, wQ01, wnQ0].concat(led(p2)(['min(周长) = a/2 + a√3/2', '= a(1+√3)/2'])),
      del: ['wdq2', 'waq3', 'waq2'],
      front: lift2,
      eq: 'min(周长) = a(1+√3)/2'
    },
    {
      say: '最后把 b 接进来。题目说周长最小时 AP 等于 b，而这时 AQ 就是 AP —— 算一下取等点，AQ 等于 a 除以根号三，所以 b 等于 a 除以根号三，反过来 a 等于根号三 b。代回答案：根号三 b 乘一加根号三再除以二，化简就是 b 乘三加根号三除以二。',
      cite: '取等时 AQ = a/√3 = b ⟹ a = √3b ⟹ 答案 = b(3+√3)/2',
      add: led(p2)(['取等时 AP = a/√3 = b', '⟹ a = √3b ⟹ 答案 b(3+√3)/2']),
      del: ['wQ2', 'wnQ2'],
      front: lift2,
      eq: 'min(周长) = b(3+√3)/2'
    }
  ];

  /* ---------- 拖动探索（只在演示档开） ----------
     这一课的核心是「先降后升」，三个采样点说得再好也只是三个点。
     讲完之后把 P 交到手上拖一遍：周长读数一路降到底再升回来，
     谷底的位置是自己摸出来的。 */

  function trailPath(pts) {
    if (!pts || !pts.length) return 'M0,0';
    var step = pts.length > 260 ? 2 : 1;
    var d = 'M' + AN.nf(pts[0][0]) + ',' + AN.nf(pts[0][1]);
    for (var i = step; i < pts.length; i += step) {
      d += ' L' + AN.nf(pts[i][0]) + ',' + AN.nf(pts[i][1]);
    }
    return d;
  }

  var AD_GRID = dist(A, D) / S;                  // = a/2 = 3 格，定值
  // 最小周长 = a/2 + a√3/2（取等时 DQ + QA 被压成直线 DA″）
  // 别写成 AD_GRID + Math.sqrt(3) —— 那是 4.73，永远命不中，读数永远灰着
  var MIN_PERI = AD_GRID + (AD_GRID * Math.sqrt(3));   // 3 + 5.196 = 8.196

  var drag1 = {
    handle: 'vP1',
    rail: { a: onL(-3.4), b: onL(3.0) },
    start: P1,
    hint: '拖动紫色点 P，看周长先降后升',
    onDrag: function (P, ctx) {
      var Q = toQ(P);

      if (ctx.reset) {
        [
          'vP2', 'vP3', 'vQ2', 'vQ3', 'vnP2', 'vnP3', 'vnQ2', 'vnQ3',
          'vql',                                   // 手画的那条 Q₁→Q₃ 粗线
          'vP0', 'vQ0', 'vdq0', 'vaq0', 'vnP0', 'vnQ0'
        ].forEach(function (id) { ctx.stage.rip(id); });
      }

      ctx.push(Q);

      var dq = dist(D, Q) / S;
      var aq = dist(A, Q) / S;
      var total = AD_GRID + dq + aq;
      var near = Math.abs(total - MIN_PERI) < 0.025;

      return [
        dot('vP1', P, COL.PURPLE, 6),
        dot('vQ1', Q, COL.ORANGE, 6.4),

        // 两条关键线段：DQ 和 AQ —— 周长的可变部分
        heavy('vdq1', D, Q, COL.RED, 3.4),
        heavy('vaq1', Q, A, COL.RED, 3.4),

        // AP 的本边（说明 Q 确实是把 AP 转过来的）
        line('vdap', A, P, AN.wash('124,58,237', 0.55), 1.8, [6, 5]),

        // Q 走过的痕迹
        {
          id: 'vdtr', k: 'path', d: trailPath(ctx.trail),
          stroke: AN.wash('249,115,22', 0.42), sw: 7
        },

        AN.txt('vnP1', [P[0] - 10, P[1] + 26], 'P',
          { size: FS.NOTE, color: COL.PURPLE, weight: 700, halo: false }),
        AN.txt('vnQ1', [
          Q[0] + (Q[0] > A[0] ? 22 : -22),
          Q[1] + (Q[1] > A[1] ? 18 : -16)
        ], 'Q', { size: FS.NOTE, color: COL.ORANGE, weight: 700, halo: false }),

        AN.txt('vled0', [60, 452], '周长 = AD + DQ + AQ，AD 始终是 3.00 格',
          { size: FS.NOTE, color: COL.INK, anchor: 'start', halo: true }),
        AN.txt('vled1', [60, 477],
          '3.00 + ' + dq.toFixed(2) + ' + ' + aq.toFixed(2) + ' = ' + total.toFixed(2) + ' 格' +
          (near ? ' · 已经到谷底' : ''),
          { size: FS.NOTE, color: near ? COL.GREEN : COL.INK, anchor: 'start', halo: true })
      ];
    }
  };

  window.MATHLAB_LESSONS = window.MATHLAB_LESSONS || [];
  window.MATHLAB_LESSONS.push({
    id: 'apex120-perimeter',
    title: '顶角 120°：等边三角形翻出来的周长最小值',
    grade: '初三',
    topic: '几何 · 最值',
    tags: ['最值', '动点', '瓜豆原理', '旋转', '垂直平分线', '对称', '三角不等式', '周长'],
    question: 'AB = AC = a，∠BAC = 120°，l 是 AC 的垂直平分线，P 是 l 上一动点。以 AP 为边作等边 △APQ，连接 DQ。当 △ADQ 的周长最小时 AP = b，求 △ADQ 周长的最小值（用 a、b 表示）。',
    thumbStep: 6,
    drag: { methods: [drag1, null] },
    methods: [
      { name: '量一量：三个 P 看周长先降后升', tier: 'demo', steps: steps1 },
      { name: '对称 + 三角不等式：压成 DA″', tier: 'proof', steps: steps2 }
    ]
  });
})();
