/* ============================================================
   瓜豆原理：主动点在定直线上跑，从动点由「绕定点旋转定角」得到，
   从动点的轨迹仍然是一条直线（同形），于是「动点到定点最近」就变成
   「定点到直线」的垂线段。

   题（模型课，不绑定某一道原题）：
     定点 A、定直线 l，P 在 l 上动。
     每取一个 P，就把 AP 绕 A 旋转 60° 得到 Q（即 △APQ 是等边三角形）。
     问：P 动起来，Q 走的是什么路线？CQ 什么时候最短？

   方法一（演示档 · 描点）：
     取三个 P，画出三个 Q ⟹ 三点共线 ⟹ 轨迹是直线 l′
     再看 l′ 是怎么来的：就是 l 绕 A 转 60°

   方法二（证明档 · SAS 全等）：
     任取 l 上 P₁、P₂，像为 Q₁、Q₂
     ∠Q₁AP₁ = ∠Q₂AP₂ = 60° ⟹ 两边各减掉同一块 ⟹ ∠Q₁AQ₂ = ∠P₁AP₂
     AQ₁ = AP₁、AQ₂ = AP₂ ⟹ △AQ₁Q₂ ≌ △AP₁P₂（SAS）
     ⟹ Q₁Q₂ = P₁P₂；且 P₁ 固定时 ∠AQ₁Q₂ = ∠AP₁P₂ 是定值
     ⟹ Q 只能落在「过 Q₁、与 AQ₁ 成定角」的那条直线上，也就是 l 的像 l′

   几何已验（屏幕坐标，50px = 1 格，旋转 −60°）：
     A = [330,400]，l: y = 270，H = [330,270]（A 到 l 的垂足）
     H′ = [217.42, 335]，AH = AH′ = 130，AH′ ⊥ l′
     P₁[280,270] → Q₁[192.4,378.3]
     P₂[400,270] → Q₂[252.4,274.4]
     P₃[520,270] → Q₃[312.4,170.5]    三点共线于 l′（斜率 −1.732）
     C = [653.8,379.1]，到 l′ 距离 = 400 = 8 格，垂足 T = [307.4,179.1]

   配色纪律：主动点/线紫，从动点/轨迹橙，轨迹直线蓝，待最小化段红。
   ============================================================ */
(function () {
  var AN = window.ANNO, ML = window.ML;
  var COL = AN.COL, FS = AN.FS;
  var sub = AN.sub, add = AN.add, mul = AN.mul, unit = AN.unit, dist = AN.dist;

  /* ---------- 几何 ---------- */
  var A = [330, 400];
  var LY = 270;
  var Ll = [170, LY], Rl = [860, LY];          // 直线 l
  var H = [A[0], LY];                          // A 到 l 的垂足
  var DEG = -60;                               // 旋转角（屏幕顺时针为正）
  var T = DEG * Math.PI / 180;
  var K = [Math.cos(T), Math.sin(T)];          // l′ 的方向（= l 转 60°）
  var NN = [-K[1], K[0]];                       // l′ 的法向，指向 C 那一侧

  // 绕 A 旋转 deg 度（屏幕坐标，正的顺时针）
  function rot(P, deg) {
    var t = (deg == null ? DEG : deg) * Math.PI / 180, cs = Math.cos(t), sn = Math.sin(t);
    var dx = P[0] - A[0], dy = P[1] - A[1];
    return [A[0] + dx * cs - dy * sn, A[1] + dx * sn + dy * cs];
  }
  function onLine(P, dir, s) { return [P[0] + dir[0] * s, P[1] + dir[1] * s]; }
  function dotv(P, dir) { return P[0] * dir[0] + P[1] * dir[1]; }
  // C 到 l′ 的垂足与距离
  function foot(C, O, dir) {
    var s = dotv(sub(C, O), dir);
    var F = onLine(O, dir, s);
    return { p: F, d: dist(C, F) };
  }

  var Hp = rot(H);                              // H 的像 = A 到 l′ 的垂足
  // 采样点避开「l 与 l′ 的交点」(约 x=255)：交点附近 P 和 Q 会重合，标签必然打架
  var P1 = [340, LY], P2 = [460, LY], P3 = [580, LY];
  var Q1 = rot(P1), Q2 = rot(P2), Q3 = rot(P3);
  var C = [653.8, 379.1];
  var FT = foot(C, Hp, K);                      // 垂足
  var TP = FT.p;

  /* ---------- 元素工厂 ---------- */
  function line(id, X, Y, color, sw, dash) {
    return { id: id, k: 'line', a: X, b: Y, stroke: color || COL.EDGE, sw: sw || 2.4, dash: dash };
  }
  function heavy(id, X, Y, color) {
    return { id: id, k: 'line', a: X, b: Y, stroke: color, sw: 5 };
  }
  function dot(id, P, color, r) {
    return { id: id, k: 'circ', c: P, r: r || 4.4, fill: color, stroke: 'none' };
  }
  // 账本：每个方法统一 2 行（行数一变，多出来的那行会一直停在旧文字）
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
  // 等边三角形 APQ 的三条边（细线，别抢视线）
  function tri(p, P, Q, color) {
    return [
      line(p + 'a', A, P, color, 1.6),
      line(p + 'b', P, Q, color, 1.6),
      line(p + 'c', Q, A, color, 1.6)
    ];
  }

  var l1 = line('vl', Ll, Rl, COL.INK, 2.6);
  var lp1 = line('vlp', onLine(Hp, K, -100), onLine(Hp, K, 350), COL.BLUE, 2.6, [10, 8]);
  var lpT = AN.txt('vlpT', onLine(Hp, K, 330), "l′", { size: FS.SIDE, color: COL.BLUE, weight: 700, halo: true });

  var dA = dot('vA1', A, COL.INK);
  var dH = dot('vH1', H, COL.TEAL);
  var dHp = dot('vHp1', Hp, COL.TEAL);
  var dC = dot('vC1', C, COL.INK);
  var dT = dot('vT1', TP, COL.RED, 4);
  var dP = [dot('vP1', P1, COL.PURPLE, 3.6), dot('vP2', P2, COL.PURPLE, 3.6), dot('vP3', P3, COL.PURPLE, 3.6)];
  var dQ = [dot('vQ1', Q1, COL.ORANGE, 4.2), dot('vQ2', Q2, COL.ORANGE, 4.2), dot('vQ3', Q3, COL.ORANGE, 4.2)];

  // 字母
  var nA = AN.txt('vnA', [313, 425], 'A', { size: FS.V, weight: 700, halo: false });
  var nH = AN.txt('vnH', [303, 242], 'H', { size: FS.V, weight: 700, halo: false });
  var nHp = AN.txt('vnHp', [200, 300], "H′", { size: FS.V, weight: 700, halo: false });
  var nC = AN.txt('vnC', [683, 386], 'C', { size: FS.V, weight: 700, halo: false });
  var nP = [
    AN.txt('vnP1', [P1[0] + 18, 258], 'P₁', { size: FS.NOTE, color: COL.PURPLE, weight: 700, halo: false }),
    AN.txt('vnP2', [P2[0], 244], 'P₂', { size: FS.NOTE, color: COL.PURPLE, weight: 700, halo: false }),
    AN.txt('vnP3', [P3[0], 244], 'P₃', { size: FS.NOTE, color: COL.PURPLE, weight: 700, halo: false })
  ];
  var nQ = [
    AN.txt('vnQ1', [188, 326], 'Q₁', { size: FS.NOTE, color: COL.ORANGE, weight: 700, halo: false }),
    AN.txt('vnQ2', [Q2[0] - 20, Q2[1] - 14], 'Q₂', { size: FS.NOTE, color: COL.ORANGE, weight: 700, halo: false }),
    AN.txt('vnQ3', [Q3[0] - 22, Q3[1] - 12], 'Q₃', { size: FS.NOTE, color: COL.ORANGE, weight: 700, halo: false })
  ];

  var tr1 = tri('vt1', P1, Q1, AN.wash('124,58,237', 0.55));
  var tr2 = tri('vt2', P2, Q2, AN.wash('124,58,237', 0.55));
  var tr3 = tri('vt3', P3, Q3, AN.wash('124,58,237', 0.55));
  var trc = heavy('vtrace', Q1, Q3, COL.ORANGE);

  // 垂足处直角：u = A→H 方向，w = l′ 方向
  var rtH = AN.right('vrtH', H, sub(A, H), sub(Rl, Ll), 13, COL.TEAL);
  var rtHp = AN.right('vrtHp', Hp, sub(A, Hp), K, 13, COL.TEAL);
  var rtT = AN.right('vrtT', TP, sub(C, TP), K, 13, COL.RED);
  var segC = line('vsegC', C, TP, COL.RED, 2.8);
  var segAh = line('vsegAh', A, Hp, COL.TEAL, 2.2, [7, 6]);

  var SB = scaleBar('v');
  var sb1 = SB;

  var lift1 = ['vl', 'vlp', 'vt1a', 'vt1b', 'vt1c', 'vt2a', 'vt2b', 'vt2c', 'vt3a', 'vt3b', 'vt3c',
    'vsegAh', 'vtrace', 'vsegC', 'vrtH', 'vrtHp', 'vrtT',
    'vnA', 'vnP1', 'vnP2', 'vnP3', 'vnQ1', 'vnQ2', 'vnQ3', 'vnH', 'vnHp', 'vnC', 'vlpT', 'vscA', 'vscB', 'vscL', 'vscT',
    'vA1', 'vH1', 'vHp1', 'vC1', 'vT1', 'vP1', 'vP2', 'vP3', 'vQ1', 'vQ2', 'vQ3'];

  /* ============================================================
     方法一：描点（演示档，8 步）
     ============================================================ */
  var p1 = 'v';
  var steps1 = [
    {
      say: '先摆一个定点 A，再画一条定直线 l。现在 l 上放一个动点 P，它可以整条线上来回跑。问题来了：如果每取一个 P，我们都把 AP 绕 A 转六十度，转到 AQ 的位置，那 Q 会怎么跑？它走的是一条乱七八糟的曲线，还是一条有规矩的路？',
      cite: '设定：A 是定点，l 是定直线，P 在 l 上动；把 AP 绕 A 转 60° 得 Q',
      add: [l1, dA, nA].concat(sb1)
        .concat(led(p1)(['A 定点、l 定直线，P 在 l 上动', '把 AP 绕 A 转 60° 得 Q'], 452)),
      eq: 'AQ = AP，∠PAQ = 60°'
    },
    {
      say: '光想没用，动手描。P 放在左边这个位置，叫 P₁。把 △AP₁Q₁ 画成等边三角形 —— 这一画，Q₁ 的位置就钉住了。',
      cite: 'P₁ 在 l 偏左处，作等边 △AP₁Q₁，得到 Q₁',
      add: tr1.concat([dP[0], dQ[0], nP[0], nQ[0]]),
      front: lift1
    },
    {
      say: 'P 往右挪到 P₂，同样作等边三角形，拿到 Q₂。注意 Q₂ 比 Q₁ 高了。',
      cite: 'P₂ 右移，作等边 △AP₂Q₂，得到 Q₂（比 Q₁ 高）',
      add: tr2.concat([dP[1], dQ[1], nP[1], nQ[1]]),
      front: lift1
    },
    {
      say: '再挪到 P₃，作等边三角形，拿到 Q₃。P 一路往右，Q 一路往左上跑 —— 方向都不一样。',
      cite: 'P₃ 继续右移，作等边 △AP₃Q₃，得到 Q₃',
      add: tr3.concat([dP[2], dQ[2], nP[2], nQ[2]]),
      front: lift1
    },
    {
      say: '三个 Q 摆在一起看 —— 把 Q₁、Q₂、Q₃ 连起来，一条直线，没有一点弯。这就怪了：P 明明在一条直线上跑，Q 怎么也在一条直线上跑？',
      cite: '描点结果：Q₁、Q₂、Q₃ 三点共线',
      add: [trc].concat(led(p1)(['三个 Q 连起来', '是一条直线，不弯'])),
      front: lift1,
      eq: 'Q₁、Q₂、Q₃ 共线'
    },
    {
      say: '这条线是被谁定出来的？答案很漂亮：就是 l 自己。把整条 l 绕 A 转六十度，它正好落在这条线上 —— 也就是说，Q 走的路线，是 P 走的路线转了个身。所以这条线叫 l 撇。',
      cite: '轨迹 l′ = l 绕 A 旋转 60° 的像（虚线蓝）',
      add: [lp1, lpT].concat(led(p1)(["轨迹 l′ = l 绕 A 转 60°", '形状不变，只转了个身'])),
      front: lift1
    },
    {
      say: '还有一个更好用的性质。从 A 朝 l 作垂线，垂足叫 H。把 H 也转六十度，得到 H 撇 —— 神奇的是，AH 撇正好垂直于 l 撇。因为旋转不改角度：垂直转完还是垂直。所以 A 到 l 撇的距离，就等于 AH，一点没变。',
      cite: '旋转保角保距：AH ⊥ l ⟹ AH′ ⊥ l′，且 AH′ = AH',
      add: [dH, nH, dHp, nHp, rtH, rtHp, segAh].concat(led(p1)(['AH ⊥ l ⟹ AH′ ⊥ l′', 'AH′ = AH（旋转保距）'])),
      front: lift1,
      eq: 'AH′ ⊥ l′，AH′ = AH'
    },
    {
      say: '这一套讲完，最值就落地了。外面随便给一个定点 C，问 CQ 最短是多少 —— Q 只能在 l 撇上跑，那最短当然是 C 到 l 撇的垂线段。量一下，八格。这就是瓜豆原理干的事：把一个「动点追动点」的糊涂问题，换成一个「定点到定直线」的清楚问题。',
      cite: 'C 到 l′ 的垂线段 = 最短的 CQ = 400px = 8 格（垂足 T 处取到）',
      add: [dC, nC, dT, segC, rtT].concat(led(p1)(['C 到 l′ 的垂线段最短', 'min(CQ) = 8 格（垂足 T）'])),
      front: lift1,
      eq: 'min(CQ) = C 到 l′ 的距离'
    }
  ];

  /* ============================================================
     方法二：SAS 全等（证明档，10 步）
     ============================================================ */
  var p2 = 'w';
  var w2l = line('wl', Ll, Rl, COL.INK, 2.6);
  var w2lp = line('wlp', onLine(Hp, K, -100), onLine(Hp, K, 350), COL.BLUE, 2.6, [10, 8]);
  var w2dA = dot('wA1', A, COL.INK);
  var w2nA = AN.txt('wnA', [313, 425], 'A', { size: FS.V, weight: 700, halo: false });
  var w2dP1 = dot('wP1', P1, COL.PURPLE, 4);
  var w2dP2 = dot('wP2', P3, COL.PURPLE, 4);
  var w2dQ1 = dot('wQ1', Q1, COL.ORANGE, 4.4);
  var w2dQ2 = dot('wQ2', Q3, COL.ORANGE, 4.4);
  var w2nP1 = AN.txt('wnP1', [P1[0] + 18, 258], 'P₁', { size: FS.NOTE, color: COL.PURPLE, weight: 700, halo: false });
  var w2nP2 = AN.txt('wnP2', [P3[0], 244], 'P₂', { size: FS.NOTE, color: COL.PURPLE, weight: 700, halo: false });
  var w2nQ1 = AN.txt('wnQ1', [188, 326], 'Q₁', { size: FS.NOTE, color: COL.ORANGE, weight: 700, halo: false });
  var w2nQ2 = AN.txt('wnQ2', [320, 106], 'Q₂', { size: FS.NOTE, color: COL.ORANGE, weight: 700, halo: false });
  var w2tr1 = tri('wt1', P1, Q1, AN.wash('124,58,237', 0.5));
  var w2tr2 = tri('wt2', P3, Q3, AN.wash('124,58,237', 0.5));
  var w2q12 = line('wq12', Q1, Q3, COL.ORANGE, 3.2);
  var w2p12 = line('wp12', P1, P3, COL.PURPLE, 3.2);
  var w2tP = AN.tick('wtP1', A, P1, COL.GREEN);
  var w2tQ = AN.tick('wtQ1', A, Q1, COL.GREEN);
  var w2tP2 = AN.tick('wtP2', A, P3, COL.GREEN, 8, 6);
  // A→Q₃ 的中点正好落在 P₁ 上（P₁ 在 [340,270]、中点 [336,259]）——沿边挪 60px 再画
  var w2tQ2 = AN.tick('wtQ2', A, Q3, COL.GREEN, 8, 60);
  var w2a1 = AN.angle('warc1', A, P1, Q1, 46, COL.BLUE);
  var w2a2 = AN.angle('warc2', A, P3, Q3, 62, COL.BLUE);
  var w2a3 = AN.angle('warc3', A, Q3, Q1, 86, COL.ORANGE);
  var w2a4 = AN.angle('warc4', A, P1, P3, 104, COL.ORANGE);
  var w2nC = AN.txt('wnC', [683, 386], 'C', { size: FS.V, weight: 700, halo: false });
  var w2dC = dot('wC1', C, COL.INK);
  var w2dT = dot('wT1', TP, COL.RED, 4);
  var w2segC = line('wsegC', C, TP, COL.RED, 2.8);
  var w2rtT = AN.right('wrtT', TP, sub(C, TP), K, 13, COL.RED);

  var lift2 = ['wl', 'wlp', 'wt1a', 'wt1b', 'wt1c', 'wt2a', 'wt2b', 'wt2c',
    'wp12', 'wq12', 'wsegC', 'wrtT',
    'warc1', 'warc2', 'warc3', 'warc4', 'wtP1', 'wtQ1', 'wtP2', 'wtQ2',
    'wnA', 'wnP1', 'wnP2', 'wnQ1', 'wnQ2', 'wnC',
    'wA1', 'wP1', 'wP2', 'wQ1', 'wQ2', 'wC1', 'wT1'];

  var steps2 = [
    {
      say: '刚才靠描三个点看出来它是一条直线 —— 描点只能让你相信，不能算证明。现在把话说明白：为什么 Q 一定在一条直线上。',
      cite: '目标：证明 Q 的轨迹是一条直线',
      add: [w2l, w2dA, w2nA].concat(led(p2)(['要证：Q 的轨迹是直线', '而不是凭描点猜'])),
      eq: '证 Q 的轨迹是定直线'
    },
    {
      say: '在 l 上随便取两个点 P₁、P₂，它们的像分别叫 Q₁、Q₂。每个 Q 都是把对应的 AP 转六十度来的，所以两个等边三角形都在。',
      cite: '任取 l 上 P₁、P₂，像为 Q₁、Q₂（两个等边三角形）',
      add: w2tr1.concat([w2dP1, w2dQ1, w2nP1, w2nQ1]).concat(w2tr2).concat([w2dP2, w2dQ2, w2nP2, w2nQ2]),
      front: lift2,
      eq: 'AQ₁ = AP₁，AQ₂ = AP₂，∠Q₁AP₁ = ∠Q₂AP₂ = 60°'
    },
    {
      say: '把已知条件摆出来：AQ₁ 等于 AP₁，AQ₂ 等于 AP₂，两个角都是六十度。三条信息，都来自「等边三角形」这一个设定。',
      cite: '已知：AQ₁ = AP₁，AQ₂ = AP₂，∠Q₁AP₁ = ∠Q₂AP₂ = 60°',
      add: [w2tP, w2tQ, w2tP2, w2tQ2].concat(w2a1).concat(w2a2)
        .concat(led(p2)(['AQ₁ = AP₁，AQ₂ = AP₂', '∠Q₁AP₁ = ∠Q₂AP₂ = 60°'])),
      front: lift2
    },
    {
      say: '关键的一步在这里。看 A 点周围那四块角：从 Q₁ 到 P₁ 是六十度，从 Q₂ 到 P₂ 也是六十度。中间那块「Q₂ 到 P₁」是公共的 —— 两个六十度各自减掉同一块，剩下的两块一定相等。所以 ∠Q₁AQ₂ 等于 ∠P₁AP₂。',
      cite: '两个 60° 各减掉公共块 ⟹ ∠Q₁AQ₂ = ∠P₁AP₂',
      add: w2a3.concat(w2a4).concat(led(p2)(['两个 60° 减同一块', '⟹ ∠Q₁AQ₂ = ∠P₁AP₂'])),
      front: lift2,
      eq: '∠Q₁AQ₂ = ∠P₁AP₂'
    },
    {
      say: '把 Q₁Q₂ 和 P₁P₂ 连起来，看两个三角形：△AQ₁Q₂ 和 △AP₁P₂。两组边对应相等，夹角又相等 —— 边角边，两个三角形全等。',
      cite: 'SAS：△AQ₁Q₂ ≌ △AP₁P₂',
      add: [w2q12, w2p12].concat(led(p2)(['两组边 + 夹角相等', '△AQ₁Q₂ ≌ △AP₁P₂'])),
      front: lift2,
      eq: '△AQ₁Q₂ ≌ △AP₁P₂（SAS）'
    },
    {
      say: '全等带来两条结论：Q₁Q₂ 等于 P₁P₂，还有 ∠AQ₁Q₂ 等于 ∠AP₁P₂。第二条是要害 —— 它说的是「Q 那边看到的角度」和「P 那边看到的角度」永远一样。',
      cite: '全等的对应结论：Q₁Q₂ = P₁P₂，∠AQ₁Q₂ = ∠AP₁P₂',
      add: led(p2)(['Q₁Q₂ = P₁P₂', '∠AQ₁Q₂ = ∠AP₁P₂']),
      front: lift2
    },
    {
      say: '现在把 P₁ 钉死不动，只让 P₂ 沿着 l 跑。P₁ 固定了，AP₁ 的方向是定的；P₂ 在 l 上，所以 P₁P₂ 的方向也是定的。两个定方向之间的夹角 ∠AP₁P₂，就是一个定值。',
      cite: '固定 P₁，P₂ 沿 l 动：AP₁ 方向定、P₁P₂ 沿 l 方向定 ⟹ ∠AP₁P₂ 定值',
      add: led(p2)(['固定 P₁：AP₁ 方向定', 'P₁P₂ 沿 l ⟹ 夹角是定值']),
      front: lift2
    },
    {
      say: '定值传过去 —— Q₁ 也固定，∠AQ₁Q₂ 就等于那个定值。意思是：不管 P₂ 跑到哪，Q₂ 永远出现在「从 Q₁ 出发、跟 AQ₁ 夹一个固定角」的那条射线上。方向定死，起点定死，那不是直线还能是什么？',
      cite: '⟹ Q 的轨迹 = 过 Q₁、与 AQ₁ 成定角的直线',
      add: led(p2)(['Q₂ 只能在这条固定射线上', '⟹ 轨迹是一条直线']),
      front: lift2,
      eq: 'Q 的轨迹是一条直线'
    },
    {
      say: '这条直线不必另找，就是 l 的像：把 l 整个绕 A 转六十度，P 的每个位置都落到 Q 的位置上，l 就落到这条线上。所以叫它 l 撇。',
      cite: 'l′ = l 绕 A 旋转 60° 的像（虚线蓝）',
      add: [w2lp].concat(led(p2)(["l′ 就是 l 转 60° 的像", '直线转完还是直线'])),
      front: lift2
    },
    {
      say: '最后一句话收掉：定点 C 到 l 撇上一点 Q 的最短距离，就是 C 到 l 撇的垂线段，垂足 T 处取到。所以以后看到「动点绕定点转」，第一反应是「答案在轨迹直线上」，然后一条垂线就完事。',
      cite: '等腰三角形那套都不用：min(CQ) = C 到 l′ 的垂线段',
      add: [w2dC, w2nC, w2dT, w2segC, w2rtT]
        .concat(led(p2)(['min(CQ) = C 到 l′ 的距离', '取等：Q 落在垂足 T'])),
      front: lift2,
      eq: 'min(CQ) = C 到 l′ 的距离'
    }
  ];

  window.MATHLAB_LESSONS = window.MATHLAB_LESSONS || [];
  window.MATHLAB_LESSONS.push({
    id: 'guadou-principle',
    title: '瓜豆原理：动点绕着定点转，轨迹还是一条直线',
    grade: '初三',
    topic: '几何 · 最值',
    tags: ['最值', '动点', '瓜豆原理', '旋转', '轨迹', '全等', 'SAS', '点到直线距离'],
    question: '定点 A、定直线 l，P 在 l 上动。把 AP 绕 A 旋转 60° 得到 Q（△APQ 为等边三角形）。求定点 C 到 Q 的距离最小值，以及 Q 的轨迹。',
    thumbStep: 6,
    methods: [
      { name: '描一描：三个 Q 连成线', tier: 'demo', steps: steps1 },
      { name: '证一证：SAS 全等锁死方向', tier: 'proof', steps: steps2 }
    ]
  });
})();
