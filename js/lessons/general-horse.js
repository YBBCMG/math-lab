/* ============================================================
   将军饮马：直线上找一点 P，使 PA + PB 最小
   ------------------------------------------------------------
   题：直线 l 同侧有两点 A、B。P 在 l 上动，求 PA + PB 的最小值。

   方法一（演示档 · 量一量）：
       P 沿 l 走，PA + PB 先降后升，谷底出现在「PA、PB 与 l 夹角相等」的位置

   方法二（证明档 · 对称法）：
       作 A 关于 l 的对称点 A′ ⟹ l 是 AA′ 的垂直平分线 ⟹ PA = PA′（对 l 上任意 P）
       ⟹ PA + PB = PA′ + PB ≥ A′B（两点之间线段最短）
       等号当 A′、P、B 共线 ⟹ 连 A′B 交 l 于 P₀ 即所求

   几何已由 _design_cd.mjs 验算（50px = 1 单位，原点 [450,350]，l: y=350）：
       A=(4,2) B=(-4,4)，A′=(4,−2)，A′B = √(8²+6²) = 10
       P₀ = A′B ∩ l = (4/3, 0) → 像素 [516.667, 350]
       P₀ 处 PA = 3.33、PB = 6.67，和 = 10.00（数值搜索最小值点 x=516.5 ✓）
       PA、PB 与 l 的夹角都是 36.87°
   注：一度想用「同一对称点再求 |PA−PB| 最大」，算了才发现 A、B 同侧时它只有上确界
       400、取不到 A′B —— 那个变式是错的，别写回来。

   配色纪律：待最小化的折线红、对称虚线灰、下界 A′B 蓝、等长 PA = PA′ 绿。
   ============================================================ */
(function () {
  var AN = window.ANNO, ML = window.ML;
  var COL = AN.COL, FS = AN.FS;
  var sub = AN.sub, add = AN.add, mul = AN.mul, unit = AN.unit, dist = AN.dist, mid = AN.mid;

  /* ---------- 几何（50px = 1 单位，来自 _design_cd.mjs） ---------- */
  // 账本固定在左下角 y=452，图形的底边（A′ 所在高度）必须离它 20px 以上，否则虚线压字
  var Ll = [110, 330], Rl = [800, 330];          // 直线 l
  var A = [650, 230], B = [250, 130];
  var Ap = [650, 430];                            // A 关于 l 的对称点
  var M = [650, 330];                             // AA′ 与 l 的交点
  var P = [516.667, 330];                         // 最小点 = A′B ∩ l

  var O = [450, 260];                             // 顶点字母外推用的「重心」

  function line(id, X, Y, color, sw, dash) {
    return { id: id, k: 'line', a: X, b: Y, stroke: color || COL.EDGE, sw: sw || 2.4, dash: dash };
  }
  function heavy(id, X, Y, color) {
    return { id: id, k: 'line', a: X, b: Y, stroke: color, sw: 5.5 };
  }
  function dot(id, C, color, r) {
    return { id: id, k: 'circ', c: C, r: r || 4.4, fill: color, stroke: 'none' };
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
  /* 比例尺：50px 一段，标「1」 */
  function scaleBar(p) {
    return [
      line(p + 'scA', [700, 84], [700, 100], COL.INK, 2),
      line(p + 'scB', [750, 84], [750, 100], COL.INK, 2),
      line(p + 'scL', [700, 92], [750, 92], COL.INK, 2.2),
      AN.txt(p + 'scT', [725, 76], '1', { size: FS.TINY, color: COL.INK })
    ];
  }

  /* ============================================================
     方法一：量一量（演示档）
     ============================================================ */
  var p1 = 'v';
  var L1 = line('vsL', Ll, Rl, COL.INK, 2.6);
  var nA1 = AN.vname('vA', A, O);
  var nB1 = AN.vname('vB', B, O);
  var cA1 = dot('vcA', A, COL.INK, 5);
  var cB1 = dot('vcB', B, COL.INK, 5);
  var sb1 = scaleBar('v');

  /* 三个试探位置 + 最优点，各自成组 */
  function trial(tag, Q) {
    return {
      q: dot(p1 + 'q' + tag, Q, COL.PURPLE, 4.6),
      qa: line(p1 + 'qa' + tag, Q, A, COL.RED, 2.4),
      qb: line(p1 + 'qb' + tag, Q, B, COL.RED, 2.4),
      // 标签用下标（P₁ P₂ P₃），跟站里其它题一致
      qn: AN.txt(p1 + 'qn' + tag, [Q[0], Q[1] + 30],
        'P' + ({ '1': '₁', '2': '₂', '3': '₃' }[tag] || ''),
        { size: FS.NOTE, color: COL.PURPLE, weight: 700 })
    };
  }
  var T1 = trial('1', [300, 330]);
  var T2 = trial('2', [400, 330]);
  var T3 = trial('3', [620, 330]);
  var TP = trial('', P);

  var lift1 = ['vsL', 'vA', 'vB', 'vcA', 'vcB',
               'vscA', 'vscB', 'vscL', 'vscT',
               'vq1', 'vq2', 'vq3', 'vq', 'vqn1', 'vqn2', 'vqn3', 'vqn',
               'vqa1', 'vqb1', 'vqa2', 'vqb2', 'vqa3', 'vqb3', 'vqa', 'vqb'];

  var steps1 = [
    {
      say: '一条直线上，要找一个点 P，让它到 A 和到 B 的距离加起来最小。这条线就叫 l，A 和 B 都在这条线的一侧 —— 这就是「将军饮马」：将军从 A 出发，到河边饮马，再回 B，走哪条路最短。',
      cite: '题设：A、B 在直线 l 同侧，P 在 l 上，求 PA + PB 最小',
      // 账本：全方法统一 2 行。行数一变，多出来的那行会一直是上一步的旧文字
      // （引擎按 id 覆盖添加，不会自动清掉多的行）—— 第一版这里写了 3 行，
      // 结果第 2 步起第 3 行永远停在「求 PA + PB 的最小值」。
      add: [L1, cA1, cB1, nA1, nB1].concat(sb1)
        .concat(led(p1)(['A、B 在 l 同侧，P 在 l 上动', '求 PA + PB 的最小值'], 452)),
      eq: '求 min(PA + PB)'
    },
    {
      say: '不猜，先量。把 P 放在左边一点，连出 PA 和 PB，量一量：一段七点三，一段四点一，加起来十一点四。',
      cite: 'P₁ 在偏左位置：PA ≈ 7.28，PB ≈ 4.12，和 ≈ 11.40',
      add: [T1.qa, T1.qb, T1.q, T1.qn].concat(led(p1)(['P₁：PA = 7.28，PB = 4.12', 'PA + PB = 11.40'])),
      front: lift1.concat(['vqa1', 'vqb1', 'vq1', 'vqn1'])
    },
    {
      say: '往右挪一格再量：五十三加五十，十点四。变小了。',
      cite: 'P₂ 略靠右：PA ≈ 5.39，PB ≈ 5.00，和 ≈ 10.39',
      delNow: ['vqa1', 'vqb1'],
      add: [T2.qa, T2.qb, T2.q, T2.qn].concat(led(p1)(['P₁ → P₂：11.40 → 10.39', '在变小'])),
      front: lift1.concat(['vqa2', 'vqb2', 'vq2', 'vqn2'])
    },
    {
      say: '再往右挪很多：两段变成二点一和八点四，加起来十点五 —— 反而大了。说明刚才走过头了，谷底在中间某处。',
      cite: 'P₃ 冲过头：PA ≈ 2.09，PB ≈ 8.41，和 ≈ 10.50（又回升）',
      delNow: ['vqa2', 'vqb2'],
      add: [T3.qa, T3.qb, T3.q, T3.qn].concat(led(p1)(['P₃：10.50（回升）', '谷底落在 P₂ 与 P₃ 之间'])),
      front: lift1.concat(['vqa3', 'vqb3', 'vq3', 'vqn3'])
    },
    {
      say: '把 P 卡在中间那个位置，再量一次。',
      cite: '在 P₂ 与 P₃ 之间取点，重新量',
      delNow: ['vqa3', 'vqb3'],
      add: [TP.qa, TP.qb, TP.q, TP.qn].concat(led(p1)(['谷底就在这一段里', '再精确量一次'])),
      front: lift1.concat(['vqa', 'vqb', 'vq', 'vqn'])
    },
    {
      say: '三点三、六点七，正好十。比刚才每一次都小 —— 这就是最小值。全程没有用任何技巧，纯靠量。',
      cite: '谷底位置：PA ≈ 3.33，PB ≈ 6.67，PA + PB = 10.00（最小）',
      add: led(p1)(['PA = 3.33，PB = 6.67', 'PA + PB = 10.00（最小）']),
      front: lift1.concat(['vqa', 'vqb', 'vq', 'vqn'])
    },
    {
      say: '量完了得看门道：这个点特殊在哪？注意左边这段和右边这段，它们跟直线 l 的夹角是一模一样的，都是三十六点九度。也就是说，PA 和 PB 关于「过 P 的垂线」对称。',
      cite: 'P₀ 处 ∠(PA, l) = ∠(PB, l) ≈ 36.87° —— 两段关于过 P 的垂线对称',
      add: [
        AN.arc('varcA', P, A, Rl, 46, COL.ORANGE),
        AN.arc('varcB', P, B, Ll, 46, COL.ORANGE),
        AN.txt('varcT', [P[0] + 66, P[1] - 26], 'θ', { size: FS.NOTE, color: COL.ORANGE, weight: 700 }),
        AN.txt('varcT2', [P[0] - 70, P[1] - 26], 'θ', { size: FS.NOTE, color: COL.ORANGE, weight: 700 })
      ].concat(led(p1)(['谷底处：两段与 l 的夹角相等', 'θ = θ ≈ 36.87°'])),
      front: lift1.concat(['vqa', 'vqb', 'vq', 'vqn', 'varcA', 'varcB'])
    },
    {
      say: '这个「对称」不是巧合 —— 光打在镜面上反射，走的就是最短路，入射角等于反射角。既然最短路自带对称，那我们反过来：先把 A 关于 l 镜像过去，让折线变成一条直的。这就是下一个方法。',
      cite: '启发：最短路自带「对称」，那就主动造一个对称点',
      add: led(p1)(['最短路自带对称', '⟹ 把 A 镜像到 l 另一侧']),
      front: lift1.concat(['vqa', 'vqb', 'vq', 'vqn', 'varcA', 'varcB'])
    }
  ];

  /* ============================================================
     方法二：对称法（证明档）
     ============================================================ */
  var p2 = 'w';
  var L2 = line('wsL', Ll, Rl, COL.INK, 2.6);
  var nA2 = AN.vname('wA', A, O);
  var nB2 = AN.vname('wB', B, O);
  // A′ 带撇号，vname 拼不出来（它只剥前缀、显示剩余字母），手写位置
  var nAp = AN.txt('wnAp', [Ap[0] + 26, Ap[1] + 20], 'A′', { size: FS.V, weight: 700, color: COL.INK });
  var cA2 = dot('wcA', A, COL.INK, 5);
  var cB2 = dot('wcB', B, COL.INK, 5);
  var cAp = dot('wcAp', Ap, COL.INK, 5);
  var sb2 = scaleBar('w');

  var sAAp = line('wsAAp', A, Ap, COL.GREY, 2.2, [8, 6]);
  var rtM = AN.right('wrtM', M, sub(A, M), sub(Rl, M), 14, COL.GREY);
  var cM = dot('wcM', M, COL.GREY, 3.6);

  var sPA2 = line('wsPA', A, P, COL.RED, 2.6);
  var sPB2 = line('wsPB', P, B, COL.RED, 2.6);
  var sPAp = line('wsPAp', Ap, P, COL.GREEN, 2.6);
  var hApB = heavy('whApB', Ap, B, COL.BLUE);
  var cP2 = dot('wcP', P, COL.RED, 5);

  // P₀ 的字母放在 l 下方偏左：上方是红绿两段的交汇、右下是蓝线，只有左下空着
  var nP0 = AN.txt('wnP0', [P[0] - 30, P[1] + 30], 'P₀', { size: FS.V, weight: 700, color: COL.RED });

  var tkPA = AN.tick('wtkPA', A, P, COL.GREEN);
  var tkPAp = AN.tick('wtkPAp', Ap, P, COL.GREEN);

  /* 第 9 步的直角三角形两条直角边（虚线） */
  var sBase = line('wsBase', [B[0], Ap[1]], Ap, COL.GREY, 2.2, [8, 6]);
  var sSide = line('wsSide', B, [B[0], Ap[1]], COL.GREY, 2.2, [8, 6]);
  var n8 = AN.txt('wn8', [mid([B[0], Ap[1]], Ap)[0], Ap[1] - 24], '8', { size: FS.SIDE, color: COL.TEAL, weight: 700 });
  var n6 = AN.txt('wn6', [B[0] - 24, mid(B, [B[0], Ap[1]])[1]], '6', { size: FS.SIDE, color: COL.TEAL, weight: 700 });

  // P 点长在红绿线的交汇处、后来又长在蓝色粗线 A′B 上 ——
  // 必须排在所有线之后，否则那 5px 的红点会被线整个盖掉（第一版就是这么丢的）
  var lift2 = ['wsL', 'wA', 'wB', 'wnAp',
               'wcA', 'wcB', 'wcAp',
               'wscA', 'wscB', 'wscL', 'wscT',
               'wsAAp', 'wrtM', 'wsPA', 'wsPB', 'wsPAp',
               'wtkPA', 'wtkPAp', 'wsBase', 'wsSide', 'wn8', 'wn6',
               'whApB', 'wcM', 'wcP', 'wnP0'];

  var steps2 = [
    {
      say: '目标还是 PA 加 PB。麻烦在哪？P 一动，两段一起变，一个变量牵着两个量，没法直接下手。',
      cite: '难点：P 一动，PA、PB 同时变，两个量不好一起控',
      add: [L2, cA2, cB2, nA2, nB2].concat(sb2)
        .concat(led(p2)(['难点：P 一动，两段一起变'], 452)),
      front: lift2
    },
    {
      say: '换个思路：能不能让其中一段「不变」？把 A 关于直线 l 翻折到另一侧，落点叫 A′。翻折的意思是 —— 垂直，而且距离相等。',
      cite: '作 A 关于 l 的对称点 A′（AA′ ⊥ l 且被 l 平分）',
      add: [sAAp, cAp, nAp, rtM, cM].concat(led(p2)(['作 A 关于 l 的对称点 A′', 'AA′ ⊥ l，且 l 平分 AA′'])),
      front: lift2
    },
    {
      say: '所以 l 就是线段 AA′ 的垂直平分线。这一步没有任何计算，纯粹是「翻折」这个动作的含义。',
      cite: 'l 是 AA′ 的垂直平分线',
      add: led(p2)(['l 垂直平分 AA′', '这是「翻折」的定义']),
      front: lift2
    },
    {
      say: '垂直平分线有一条看家性质：线上的点到两端距离相等。P 就长在 l 上，所以在 l 上不论 P 跑到哪，都有 PA 等于 PA′。',
      cite: '垂直平分线性质：P 在 l 上 ⟹ PA = PA′',
      add: [sPA2, sPAp, cP2, tkPA, tkPAp].concat(led(p2)(['垂直平分线上的点到两端等距', '⟹ PA = PA′（对 l 上任意 P）'])),
      front: lift2
    },
    {
      say: '等量代换，把 PA 换成 PA′。现在整个问题变成了：从 A′ 出发，经过 l 上的 P，再到 B，求这段折线最短。前者是定点点，后者也是定点点，中间这段必须踩在 l 上。',
      cite: 'PA + PB = PA′ + PB —— 折线 A′→P→B，两端都是定点',
      add: [sPB2].concat(led(p2)(['PA + PB = PA′ + PB', '变成折线 A′ → P → B'])),
      front: lift2
    },
    {
      say: '折线的最短，答案永远是「拉直」。三角形两边之和大于第三边：A′P 加 PB，一定不小于 A′B。',
      cite: '三角不等式：A′P + PB ≥ A′B（两点之间线段最短）',
      add: led(p2)(['A′P + PB ≥ A′B', '三角形两边之和 > 第三边']),
      front: lift2
    },
    {
      say: '什么时候取等号？只有 A′、P、B 三点正好排成一条直线的时候。三个点一共线，折线就没了弯曲，等于那条线段。',
      cite: '等号条件：A′、P、B 共线',
      add: led(p2)(['取等 ⟺ A′、P、B 共线', '折线被拉直']),
      front: lift2
    },
    {
      say: '那就把 A′ 和 B 连起来 —— 蓝线。它和 l 的交点，就是我们要找的 P。这个位置不用试，是几何直接指定的。',
      cite: '连 A′B 交 l 于 P₀，P₀ 即所求',
      add: [hApB, nP0].concat(led(p2)(['连 A′B，交 l 于 P₀', 'P₀ 就是最小值点'])),
      front: lift2
    },
    {
      say: '最后算长度。从 A′ 到 B：横着八格，竖着六格 —— 竖着的六格拉直看，是 A′ 到 l 的两格加上 l 到 B 的四格。直角三角形里勾股：八八六十四，六六三十六，加起来一百，开出来十。',
      cite: '勾股：A′B = √(8² + 6²) = √100 = 10',
      add: [sBase, sSide, n8, n6].concat(led(p2)(['横 8、竖 6（2 + 4）', 'A′B = √(8² + 6²) = 10'])),
      front: lift2
    },
    {
      say: '回头看整条逻辑：翻折让一段长度不变，等量代换把两段接到一条折线上，三角不等式把折线压成直线，最后勾股给出数字。最小值就是十 —— 而且这个 P 点，恰好就是刚才量出来的那个角θ相等的位置。',
      cite: 'min(PA + PB) = A′B = 10，等号在 P₀ = A′B ∩ l',
      add: led(p2)(['min(PA + PB) = A′B = 10', '取到它的点：A′B ∩ l']),
      front: lift2,
      eq: 'min(PA + PB) = A′B = 10'
    }
  ];

  window.MATHLAB_LESSONS = window.MATHLAB_LESSONS || [];
  window.MATHLAB_LESSONS.push({
    id: 'general-horse',
    title: '将军饮马：直线上一点，让两段距离之和最小',
    grade: '初二',
    topic: '几何 · 最值',
    tags: ['最值', '动点', '将军饮马', '对称', '垂直平分线', '三角不等式', '勾股定理'],
    question: '直线 l 同侧有两点 A、B，P 是 l 上一动点。求 PA + PB 的最小值（A 距 l 2 格、B 距 l 4 格，水平相距 8 格）。',
    thumbStep: 5,
    methods: [
      { name: '量一量：谷底在哪', tier: 'demo', steps: steps1 },
      { name: '对称法：翻折 + 三角不等式', tier: 'proof', steps: steps2 }
    ]
  });
})();
