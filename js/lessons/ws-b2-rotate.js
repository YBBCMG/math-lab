/* ============================================================
   （11.16A 提高班）几何最值探究 · 第 2 题（填空）
   ------------------------------------------------------------
   题：如图，边长为 a 的等边 △ABC 中，BF 是 AC 上的中线且 BF = b，
       点 D 在 BF 上，连接 AD，在 AD 的右侧作等边 △ADE，连接 EF，
       则 △AEF 周长的最小值是 ____。

   几何摆法（a = 1，B 在左下、C 在右下、A 在顶）：
     B = (0, 0)，C = (1, 0)，A = (1/2, √3/2)
     F = (3/4, √3/4)             F 是 AC 中点
     BF = √3/2 = b              中线长 = 高
     D = (1/2, √3/6)             最优位置：△ABC 的重心
     E = (1, √3/3)               最优位置的 E（在 C 的正上方）
     Q = (1/4, √3/4)             AB 中点
     M = (1/2, 0)                BC 中点

   解法链条：
     ① 周长 = AE + EF + AF = AD + EF + a/2，其中 AF = a/2 固定
     ② 等边 △ADE ⟹ E 是 D 绕 A 逆时针转 60° 的像
        等边 △ABC ⟹ 绕 A 顺时针转 60° 把 C 送到 B，于是把 F
        （AC 中点）送到 Q（AB 中点）
     ③ 把 EF 整体绕 A 顺时针转 60°：E → D，F → Q
        ⟹ EF = DQ（旋转不改变长度）
     ④ 沿 BF 翻折：BF 是等边三角形的中线，也是 ∠ABC 的平分线，
        所以 BA 落在 BC 上，Q（AB 中点）落到 M（BC 中点）；
        D 在对称轴 BF 上 ⟹ DQ = DM
     ⑤ 周长 = AD + DM + a/2 ≥ AM + a/2 = b + a/2
     ⑥ 取等：D 落在 AM 上，即 D = AM ∩ BF = △ABC 的重心，
        AD = 2b/3，DM = b/3，恰好相加为 b
     ⑦ 周长最小 = (a + 2b)/2
   ============================================================ */
(function () {
  var AN = window.ANNO;
  var COL = AN.COL, FS = AN.FS;
  var sub = AN.sub, along = AN.along;

  var S3 = Math.sqrt(3);

  /* ---------- 数学坐标 → 画布 ---------- */
  var SC = 300, CXo = 0.5, CYo = 0.43;
  function P(x, y) {
    return [450 + (x - CXo) * SC, 300 - (y - CYo) * SC];
  }

  var Bp = P(0, 0);
  var Cp = P(1, 0);
  var Ap = P(0.5, S3 / 2);
  var Fp = P(0.75, S3 / 4);
  var Dp = P(0.5, S3 / 6);
  var Ep = P(1, S3 / 3);
  var Qp = P(0.25, S3 / 4);
  var Mp = P(0.5, 0);

  var O = [(Ap[0] + Bp[0] + Cp[0]) / 3, (Ap[1] + Bp[1] + Cp[1]) / 3];

  /* ---------- 底色与三边 ---------- */
  var triFill = { id: 'qfill', k: 'poly', pts: [Ap, Bp, Cp], fill: AN.wash('238,241,247', 0.8), stroke: 'none' };
  var sAB = { id: 'qsAB', k: 'line', a: Ap, b: Bp, stroke: COL.EDGE, sw: 2.4 };
  var sBC = { id: 'qsBC', k: 'line', a: Bp, b: Cp, stroke: COL.EDGE, sw: 2.4 };
  var sAC = { id: 'qsAC', k: 'line', a: Ap, b: Cp, stroke: COL.EDGE, sw: 2.4 };

  var nA = AN.vname('vA', Ap, O, 30);
  var nB = AN.txt('qnB', [Bp[0] - 22, Bp[1] + 6], 'B', { size: FS.V, weight: 700 });
  var nC = AN.txt('qnC', [Cp[0] + 22, Cp[1] + 6], 'C', { size: FS.V, weight: 700 });
  var nF = AN.txt('qnF', [Fp[0] + 24, Fp[1] - 4], 'F', { size: FS.V, weight: 700 });

  var aABC = AN.angle('qaABC', Bp, Ap, Cp, 40, COL.PURPLE, '60°', { size: FS.NOTE, gap: 26 });

  /* ---------- 中线 BF ---------- */
  var sBF = { id: 'qsBF', k: 'line', a: Bp, b: Fp, stroke: COL.TEAL, sw: 2.6 };
  var rF = AN.right('qrF', Fp, sub(Ap, Fp), sub(Bp, Fp), 13, COL.TEAL);
  var tkAF = AN.tick('qtkAF', Ap, Fp, COL.ORANGE, 8, 0);
  var tkFC = AN.tick('qtkFC', Fp, Cp, COL.ORANGE, 8, 0);
  var bMark = AN.txt('qbMark', [478, 386], 'BF = b', { size: FS.TINY, color: COL.TEAL, halo: true });

  /* ---------- D 与 AD ---------- */
  var sAD = { id: 'qsAD', k: 'line', a: Ap, b: Dp, stroke: COL.BLUE, sw: 2.4 };
  var nD = AN.txt('qnD', [Dp[0] - 26, Dp[1] + 4], 'D', { size: FS.V, weight: 700 });
  var dotD = { id: 'qdotD', k: 'circ', c: Dp, r: 4, fill: COL.BLUE, stroke: 'none' };

  /* ---------- 等边 △ADE ---------- */
  var sAE = { id: 'qsAE', k: 'line', a: Ap, b: Ep, stroke: COL.PURPLE, sw: 2.4 };
  var sDE = { id: 'qsDE', k: 'line', a: Dp, b: Ep, stroke: COL.PURPLE, sw: 2.4 };
  var nE = AN.txt('qnE', [Ep[0] + 24, Ep[1] - 2], 'E', { size: FS.V, weight: 700 });
  var aDAE = AN.angle('qaDAE', Ap, Dp, Ep, 46, COL.PURPLE, '60°', { size: FS.NOTE, gap: 30 });

  /* ---------- EF ---------- */
  var sEF = { id: 'qsEF', k: 'line', a: Ep, b: Fp, stroke: COL.RED, sw: 3 };

  /* ---------- Q 与 M ---------- */
  var sAQ = { id: 'qsAQ', k: 'line', a: Ap, b: Qp, stroke: COL.GREEN, sw: 2.2, dash: [6, 5] };
  var nQ = AN.txt('qnQ', [Qp[0] - 22, Qp[1] - 8], 'Q', { size: FS.V, weight: 700 });
  var dotQ = { id: 'qdotQ', k: 'circ', c: Qp, r: 4, fill: COL.GREEN, stroke: 'none' };
  var sBM = { id: 'qsBM', k: 'line', a: Bp, b: Mp, stroke: COL.GREEN, sw: 2.2, dash: [6, 5] };
  var nM = AN.txt('qnM', [Mp[0], Mp[1] + 26], 'M', { size: FS.V, weight: 700 });
  var dotM = { id: 'qdotM', k: 'circ', c: Mp, r: 4, fill: COL.GREEN, stroke: 'none' };

  /* ---------- 关键等长与压直 ---------- */
  var sDQ = { id: 'qsDQ', k: 'line', a: Dp, b: Qp, stroke: COL.GREEN, sw: 2.6 };
  var sDM = { id: 'qsDM', k: 'line', a: Dp, b: Mp, stroke: COL.ORANGE, sw: 2.6, dash: [7, 5] };
  var sAM = { id: 'qsAM', k: 'line', a: Ap, b: Mp, stroke: COL.RED, sw: 3 };
  var sQD = { id: 'qsQDfalse', k: 'line', a: Qp, b: Dp, stroke: 'none', sw: 0 };

  /* ---------- 台账 ---------- */
  var LD = ['ql0', 'ql1', 'ql2'];
  function led(lines) {
    return lines.map(function (t, i) {
      return AN.txt('ql' + i, [46, 452 + i * 26], t, {
        size: 16, anchor: 'start', color: i === lines.length - 1 ? COL.RED : COL.INK
      });
    });
  }

  var lift = ['qsAB', 'qsBC', 'qsAC', 'qsBF', 'qrF', 'qsAD', 'qsAE', 'qsDE', 'qsEF', 'qsAM'];

  /* ---------- 步骤 ---------- */
  var steps = [
    {
      say: '这是一个等边三角形，三个顶点分别是 A、B、C，边长是 a。等边的意思是三条边一样长、三个角都是六十度。',
      cite: '题设：等边 △ABC，边长 a',
      add: [triFill, sAB, sBC, sAC, nA, nB, nC].concat(aABC, led(['△ABC 等边，边长 a'])),
      eq: 'AB = BC = CA = a，∠ABC = 60°'
    },
    {
      say: '从 B 出发画一条线，连到对面 AC 的中点，这条线就是题目说的中线。图上这条青色实线就是它。等边三角形里中线、高线、角平分线三线合一，所以它垂直于 AC，F 处是直角，两边 AF 和 FC 一样长，各是 a 的一半。',
      cite: '题设：BF 是 AC 上的中线 ⟹ F 是 AC 中点，BF ⊥ AC（等腰三角形三线合一）',
      delNow: LD,
      add: [sBF, nF, rF, tkAF, tkFC].concat(led(['F 是 AC 中点，BF ⊥ AC', 'AF = FC = a/2'])),
      front: lift,
      eq: 'AF = FC = a/2'
    },
    {
      say: '这条中线有多长呢？它正好是等边三角形的高，边长乘二分之根号三。题目把这个长度记作 b，所以 b 就等于二分之根号三倍的 a。图旁边标上 b。',
      cite: '等边三角形的高 h = (√3/2)a',
      delNow: LD,
      add: [bMark].concat(led(['BF = (√3/2)a = b'])),
      front: lift,
      eq: 'BF = b = (√3/2)a'
    },
    {
      say: '点 D 就在这条中线上，可以沿着它滑动。把 A 和 D 连起来。',
      cite: '题设：点 D 在 BF 上，连接 AD',
      delNow: LD,
      add: [sAD, nD, dotD, sQD].concat(led(['D 在 BF 上滑动'])),
      front: lift,
      eq: 'D ∈ BF'
    },
    {
      say: '以 AD 为一条边，在 AD 的右边再作一个等边三角形，第三个顶点叫 E。等边嘛，AE 等于 AD，中间这个角 DAE 是六十度。',
      cite: '题设：在 AD 的右侧作等边 △ADE ⟹ AE = AD，∠DAE = 60°',
      delNow: LD,
      add: [sAE, sDE, nE].concat(aDAE, led(['△ADE 等边', 'AE = AD，∠DAE = 60°'])),
      front: lift,
      eq: 'AE = AD，∠DAE = 60°'
    },
    {
      say: '连上 EF。现在要问的是三角形 AEF 的周长最小是多少。周长是三段相加：AE 加 EF 加 AF。其中 AE 就是 AD，AF 是 a 的一半固定不动，所以真正会变的只有 EF。',
      cite: '周长 = AE + EF + AF = AD + EF + a/2；AF = a/2 为定值',
      delNow: LD,
      add: [sEF].concat(led(['周长 = AD + EF + a/2', 'AF = a/2 固定，只需 AD + EF 最小'])),
      front: lift,
      eq: '让 AD + EF 最小'
    },
    {
      say: '接下来是这道题的核心想法：等边三角形本质上就是转六十度。看外面这个大三角形 ABC：把 C 点绕着 A 点顺时针转六十度，它正好落到 B 点的位置。所以这个转动会把整条 AC 送到 AB 上。',
      cite: '等边 △ABC ⟹ 绕 A 顺时针转 60° 把 C 送到 B，把 AC 送到 AB',
      delNow: LD,
      add: led(['绕 A 顺时针转 60°：C → B，AC → AB']),
      front: lift,
      eq: 'C 绕 A 顺时针 60° 得 B'
    },
    {
      say: '既然是整条线段搬运过去，那中点也一定搬运过去。F 是 AC 的中点，转六十度之后，它落到 AB 的中点。给这个点起个名字叫 Q，图上用绿色小点标出来。',
      cite: '旋转把线段 AC 送到 AB，因此把 AC 的中点 F 送到 AB 的中点 Q',
      delNow: LD,
      add: [nQ, dotQ, sAQ].concat(led(['Q 是 AB 中点', 'F 绕 A 顺时针 60° ⟹ Q'])),
      front: lift,
      eq: 'Q = AB 中点'
    },
    {
      say: '同样地，里面那个小等边三角形 ADE 也是一个转动：E 是 D 绕着 A 逆时针转六十度得到的。',
      cite: '等边 △ADE ⟹ E 是 D 绕 A 逆时针转 60° 的像',
      delNow: LD,
      add: led(['E 是 D 绕 A 逆时针 60° 的像']),
      front: lift,
      eq: 'E = rot(D)'
    },
    {
      say: '现在把 EF 这条线段整体绕 A 顺时针转六十度。E 转过去正好是 D，因为 E 本来就是 D 逆时针转过来的。F 转过去正好是刚才那个 Q。旋转不改变长度，所以 EF 转完变成 DQ，两段一样长。',
      cite: '把 EF 绕 A 顺时针转 60°：E → D，F → Q ⟹ EF = DQ（旋转保距）',
      delNow: LD,
      add: [sDQ].concat(led(['EF 绕 A 顺时针 60° ⟹ DQ', 'EF = DQ'])),
      front: lift,
      eq: 'EF = DQ'
    },
    {
      say: '于是周长里的 AD 加 EF，就换成了 AD 加 DQ。这两段都从 D 出发，一个到 A、一个到 Q。Q 是 AB 的中点，钉死不动；D 在中线上滑。',
      cite: 'AD + EF = AD + DQ',
      delNow: LD,
      add: led(['AD + EF = AD + DQ']),
      front: lift,
      eq: 'AD + DQ'
    },
    {
      say: '下面把这条折线压直。沿中线 BF 把图翻折过去：因为 BF 在等边三角形里也是角 B 的平分线，所以它把 BA 这条边正好翻到 BC 上。于是 AB 的中点 Q，就落到 BC 的中点。这个新点叫 M。',
      cite: 'BF 平分 ∠ABC ⟹ 沿 BF 翻折把 BA 送到 BC；于是 Q（AB 中点）→ M（BC 中点）',
      delNow: LD,
      add: [nM, dotM, sBM].concat(led(['沿 BF 翻折：Q → M', 'M 是 BC 中点'])),
      front: lift,
      eq: 'Q 关于 BF 的对称点 = M'
    },
    {
      say: 'D 本来就落在这条对称轴 BF 上，对称轴上的点到一对对称点的距离相等，所以 DQ 等于 DM。折线 AD 加 DQ，就变成了 AD 加 DM。',
      cite: 'D 在对称轴 BF 上 ⟹ DQ = DM ⟹ AD + DQ = AD + DM',
      delNow: LD,
      add: [sDM].concat(led(['DQ = DM（D 在对称轴上）', 'AD + DQ = AD + DM'])),
      front: lift,
      eq: 'AD + DQ = AD + DM'
    },
    {
      say: 'A 到 M 是两点，D 是中间那个拐点。两点之间线段最短，所以这两段加起来怎么也短不过直接连 A 和 M。也就是大于等于 AM。',
      cite: '两点之间线段最短（三角形两边之和大于第三边）⟹ AD + DM ≥ AM',
      delNow: LD,
      add: [sAM].concat(led(['AD + DM ≥ AM', '取等 ⟺ D 落在 AM 上'])),
      front: lift,
      eq: 'AD + DM ≥ AM'
    },
    {
      say: 'AM 又是多长呢？M 是 BC 的中点，所以 AM 是等边三角形从 A 到对边中点的那条线，也就是高，长度是二分之根号三倍的 a，刚才已经把它叫做 b 了。所以 AM 就是 b。',
      cite: 'AM 是等边 △ABC 的高 ⟹ AM = (√3/2)a = b',
      delNow: LD,
      add: led(['AM = (√3/2)a = b']),
      front: lift,
      eq: 'AM = b'
    },
    {
      say: '什么时候取等？D 正好落在 AM 这条线上。AM 是中线，BF 也是中线，两条中线相交的地方就是重心。所以最佳位置就是重心，这时候 AD 是 b 的三分之二，DM 是 b 的三分之一，加起来正好是 b。',
      cite: '取等：D = AM ∩ BF = 重心；重心分中线 2:1 ⟹ AD = 2b/3，DM = b/3',
      delNow: LD,
      add: led(['取等：D = 重心', 'AD = 2b/3，DM = b/3，和为 b']),
      front: lift,
      eq: 'AD + DM = b（重心处取等）'
    },
    {
      say: '把这一段代回周长：AF 是 a 的一半，AD 加 EF 最小是 b。所以周长最小就是 a 的一半加上 b，也就是 a 加二 b 再除以二。',
      cite: '周长最小 = AF + (AD + EF)最小 = a/2 + b',
      delNow: LD,
      add: led(['周长最小 = a/2 + b', '= (a + 2b) / 2']),
      front: lift,
      eq: '周长最小 = (a + 2b)/2',
      hold: 4200
    }
  ];

  window.MATHLAB_LESSONS = window.MATHLAB_LESSONS || [];
  window.MATHLAB_LESSONS.push({
    id: 'ws-b2-rotate',
    title: '等边里转六十度：△AEF 周长的最小值（讲义 B2）',
    grade: '初二',
    topic: '几何 · 轴对称与旋转',
    tags: ['几何', '最值', '等边三角形', '旋转', '翻折', '重心', '两点之间线段最短'],
    question: '如图，边长为 a 的等边 △ABC 中，BF 是 AC 上的中线且 BF = b，点 D 在 BF 上，连接 AD，在 AD 的右侧作等边 △ADE，连接 EF，则 △AEF 周长的最小值是 ______。',
    sourceImage: 'img/ws-b2-q.png',
    thumbStep: 5,
    methods: [
      {
        name: '旋转 + 翻折 · 把三段折线压成一条',
        tier: 'proof',
        sub: '严格证明 · 17 步，含重心处取等',
        steps: steps
      }
    ]
  });
})();
