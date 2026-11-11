/* ============================================================
   半角模型（正方形 45° 角）· 纯证明
   ------------------------------------------------------------
   题设：正方形 ABCD，E 在 BC 上，F 在 CD 上，∠EAF = 45°
   要证：EF = BE + DF

   方法：补短法（把 △ABE 搬到 D 的左侧，凑出一条等于 BE + DF 的线段），
   两次 SAS。全程不需要「旋转」这个词，初二就能讲。
   ============================================================ */
(function () {
  var AN = window.ANNO, ML = window.ML;
  var COL = AN.COL, FS = AN.FS;
  var sub = AN.sub, add = AN.add, mul = AN.mul;

  /* ---------- 坐标：正方形边长 320 ---------- */
  var S = 360;
  var A = [205, 55], B = [565, 55], C = [565, 415], D = [205, 415];
  var e = 0.5, f = 1 / 3;                 // BE/BC、DF/DC 的比例（保证 ∠EAF = 45°）
  var E = [B[0], B[1] + S * e];           // (540, 250)
  var F = [D[0] + S * f, D[1]];           // (326.67, 410)
  var G = [D[0] - S * e, D[1]];           // (60, 410)  DG = BE
  var O = [(A[0] + B[0] + C[0] + D[0]) / 4, (A[1] + B[1] + C[1] + D[1]) / 4];

  /* ---------- 骨架 ---------- */
  var sq = { id: 'sq', k: 'poly', pts: [A, B, C, D], fill: COL.FILL, stroke: COL.EDGE, sw: 2.6 };
  var nA = AN.vname('vA', A, O), nB = AN.vname('vB', B, O), nC = AN.vname('vC', C, O), nD = AN.vname('vD', D, O);
  var nE = AN.txt('vE', [E[0] + 30, E[1]], 'E', { size: FS.V, weight: 700 });
  var nF = AN.txt('vF', [F[0], F[1] + 30], 'F', { size: FS.V, weight: 700 });
  var nG = AN.txt('vG', [G[0], G[1] + 30], 'G', { size: FS.V, weight: 700 });

  var segEF = { id: 'segEF', k: 'line', a: E, b: F, stroke: COL.RED, sw: 3.2 };
  var segDG = { id: 'segDG', k: 'line', a: D, b: G, stroke: COL.GREEN, sw: 3.2 };
  var segAG = { id: 'segAG', k: 'line', a: A, b: G, stroke: COL.GREEN, sw: 3.2 };

  var raB = AN.right('raB', B, sub(A, B), sub(E, B), 14, COL.EDGE);
  var raD = AN.right('raD', D, sub(A, D), sub(G, D), 14, COL.EDGE);

  /* ---------- 角标记 ---------- */
  var aBAE = AN.angle('aBAE', A, B, E, 38, COL.ORANGE, '①', { size: FS.NOTE, gap: 40 });
  var aDAG = AN.angle('aDAG', A, D, G, 38, COL.ORANGE, '①', { size: FS.NOTE, gap: 42 });
  var aDAF = AN.angle('aDAF', A, D, F, 92, COL.PURPLE, '②', { size: FS.NOTE, gap: 24 });
  var aEAF = AN.angle('aEAF', A, E, F, 64, COL.BLUE, '45°', { size: FS.NOTE, gap: 30 });
  // ∠GAF 的角平分线几乎正对 AD，标签会被那条边压住 —— 指定方位角掉到左侧空白处
  var aGAF = AN.angle('aGAF', A, G, F, 134, COL.GREEN, '45°', { size: FS.NOTE, dir: 252 });

  /* ---------- 全等色块 ---------- */
  var fABE = { id: 'fABE', k: 'poly', pts: [A, B, E], fill: AN.wash('37,99,235', 0.13), stroke: 'rgba(37,99,235,0.5)', sw: 2 };
  var fADG = { id: 'fADG', k: 'poly', pts: [A, D, G], fill: AN.wash('37,99,235', 0.13), stroke: 'rgba(37,99,235,0.5)', sw: 2 };
  var fAEF = { id: 'fAEF', k: 'poly', pts: [A, E, F], fill: AN.wash('194,65,12', 0.12), stroke: 'rgba(194,65,12,0.5)', sw: 2 };
  var fAGF = { id: 'fAGF', k: 'poly', pts: [A, G, F], fill: AN.wash('194,65,12', 0.12), stroke: 'rgba(194,65,12,0.5)', sw: 2 };

  /* ---------- 右侧推导栏 ---------- */
  var P_IDS = ['p0', 'p1', 'p2', 'p3'];
  function panel(lines) {
    return lines.map(function (t, i) {
      // x 从 622 退到 596：最长那条「AB = AD，∠ABE = ∠ADG，BE = DG」在 622 处右缘到 903，被画布切掉 3px
      return AN.txt('p' + i, [596, 132 + i * 30], t, {
        size: 16, anchor: 'start',
        color: i === lines.length - 1 ? COL.RED : COL.INK
      });
    });
  }

  var steps = [
    {
      say: '正方形 ABCD，E 在 BC 上，F 在 CD 上，∠EAF 等于 45°。要证 EF = BE + DF。',
      cite: '题设：正方形 ABCD；E ∈ BC，F ∈ CD；∠EAF = 45°',
      add: [sq, nA, nB, nC, nD, nE, nF, segEF].concat(aEAF, panel(['求证  EF = BE + DF'])),
      eq: 'EF = BE + DF？'
    },
    {
      say: '一条线段等于另外两条之和——这种结论，套路是把那两条短的接成一条。',
      cite: '欲证 a = b + c，先构造一条长 b + c 的线段作桥',
      delNow: P_IDS,
      add: panel(['结论是「两段之和」', '⟹ 先把 BE、DF 接成一条']),
      eq: '目标：造一条等于 BE + DF 的线段'
    },
    {
      say: '延长 CD 到 G，让 DG 等于 BE，再连 AG。',
      cite: '尺规可作：延长线段、截取等长（这是构造，不是结论）',
      delNow: P_IDS,
      add: [nG, segDG, segAG].concat(panel(['延长 CD 至 G，使 DG = BE', '连 AG'])),
      eq: 'DG = BE（构造）'
    },
    {
      say: '看 △ABE 和 △ADG：AB 等于 AD 是正方形的边；两个角都是 90°；BE 等于 DG 是刚作的。',
      cite: '正方形四边相等、四角为 90°；DG 在 CD 的延长线上 ⟹ ∠ADG = 90°；作图 DG = BE',
      delNow: P_IDS,
      add: [raB, raD, fABE, fADG, AN.tick('tkAB', A, B, COL.EDGE), AN.tick('tkAD', A, D, COL.EDGE)]
        .concat(panel(['AB = AD（正方形边）', '∠ABE = ∠ADG = 90°', 'BE = DG（作图）'])),
      front: ['segAG', 'segDG', 'segEF'],
      eq: 'AB = AD，∠ABE = ∠ADG = 90°，BE = DG'
    },
    {
      say: '两边夹一角，SAS，两个三角形全等。',
      cite: 'SAS：两边及其夹角对应相等的两个三角形全等',
      delNow: P_IDS,
      upd: [
        { id: 'fABE', fill: AN.wash('15,157,88', 0.13), stroke: 'rgba(15,157,88,0.5)' },
        { id: 'fADG', fill: AN.wash('15,157,88', 0.13), stroke: 'rgba(15,157,88,0.5)' }
      ],
      add: panel(['AB = AD，∠ABE = ∠ADG，BE = DG', '⟹ △ABE ≌ △ADG（SAS）']),
      eq: '△ABE ≌ △ADG（SAS）'
    },
    {
      say: '全等的对应边、对应角都相等：AE = AG，∠BAE = ∠DAG。这两个角相等，标成同一个 ①。',
      cite: '全等三角形对应边相等、对应角相等',
      delNow: P_IDS,
      add: [AN.tick('tkAE', A, E, COL.GREEN), AN.tick('tkAG', A, G, COL.GREEN)]
        .concat(aBAE, aDAG, panel(['AE = AG', '∠BAE = ∠DAG（都记作 ①）'])),
      eq: 'AE = AG，∠BAE = ∠DAG'
    },
    {
      say: '现在算 ∠GAF。它被 AD 分成两块：① 加上 ②。',
      cite: '角的和：AD 在 ∠GAF 内部 ⟹ ∠GAF = ∠GAD + ∠DAF',
      delNow: P_IDS,
      add: aGAF.concat(aDAF, panel(['∠GAF = ∠GAD + ∠DAF', '= ① + ②'])),
      eq: '∠GAF = ① + ②'
    },
    {
      say: '∠BAD 是 90°，但它是 ①、∠EAF、② 三块拼起来的。∠EAF 占 45°，所以剩下 ① 加 ② 是 45°。',
      cite: '∠BAD = ∠BAE + ∠EAF + ∠DAF = 90°；已知 ∠EAF = 45°',
      delNow: P_IDS,
      add: panel(['∠BAD = ① + 45° + ② = 90°', '⟹ ① + ② = 45°', '⟹ ∠GAF = ∠EAF']),
      eq: '∠GAF = ∠EAF = 45°'
    },
    {
      say: '于是 △AEF 和 △AGF：AE = AG，夹角都是 45°，AF 是公共边。',
      cite: '公共边 AF = AF',
      delNow: P_IDS,
      upd: [
        { id: 'fABE', fill: AN.wash('15,157,88', 0.05), stroke: 'rgba(15,157,88,0.28)' },
        { id: 'fADG', fill: AN.wash('15,157,88', 0.05), stroke: 'rgba(15,157,88,0.28)' }
      ],
      add: [fAEF, fAGF].concat(panel(['AE = AG', '∠EAF = ∠GAF', 'AF = AF（公共边）'])),
      front: ['segEF', 'segAG', 'segDG', 'raB', 'raD',
        'aBAE', 'aBAEt', 'aDAG', 'aDAGt', 'aDAF', 'aDAFt', 'aEAF', 'aEAFt', 'aGAF', 'aGAFt',
        'tkAB', 'tkAD', 'tkAE', 'tkAG'],
      eq: 'AE = AG，∠EAF = ∠GAF，AF = AF'
    },
    {
      say: '又是两边夹一角，SAS。',
      cite: 'SAS',
      delNow: P_IDS,
      add: panel(['⟹ △AEF ≌ △AGF（SAS）']),
      eq: '△AEF ≌ △AGF（SAS）'
    },
    {
      say: '所以 EF 等于 GF。',
      cite: '全等三角形对应边相等',
      delNow: P_IDS,
      add: [AN.tick('tkEF', E, F, COL.RED, 11), AN.tick('tkGF', G, F, COL.RED, 11, -78)]
        .concat(panel(['⟹ EF = GF'])),
      eq: 'EF = GF'
    },
    {
      say: 'G、D、F 在同一条直线上，GF 就是 GD 加 DF。',
      cite: 'G、D、F 依次共线 ⟹ GF = GD + DF',
      delNow: P_IDS,
      add: panel(['G、D、F 共线', 'GF = GD + DF = BE + DF']),
      eq: 'GF = GD + DF = BE + DF'
    },
    {
      say: '把 DG 换回 BE，两段加起来正好是 GF，也就是 EF。',
      cite: '等量代换',
      delNow: P_IDS,
      add: panel(['⟹ EF = BE + DF']),
      eq: 'EF = BE + DF',
      hold: 3400
    },
    {
      say: '顺手一个结论：△CEF 的周长等于 CE 加 BE、CF 加 DF，也就是两条边长，2 个 a。',
      cite: 'CE + BE = BC，CF + DF = CD，BC = CD = a',
      delNow: P_IDS,
      add: panel(['△CEF 周长 = CE + CF + EF', '= (CE + BE) + (CF + DF)', '= BC + CD = 2a']),
      eq: '△CEF 周长 = 2a（定值）',
      hold: 3600
    }
  ];

  window.MATHLAB_LESSONS = window.MATHLAB_LESSONS || [];
  window.MATHLAB_LESSONS.push({
    id: 'half-angle',
    title: '半角模型：正方形里的 45°，EF = BE + DF',
    grade: '初二',
    topic: '几何 · 全等模型',
    tags: ['几何', '全等', '全等模型', 'SAS', '半角模型', '截长补短'],
    question: '正方形 ABCD 中，E 在 BC 上，F 在 CD 上，∠EAF = 45°。求证：EF = BE + DF。',
    thumbStep: 12,
    methods: [
      {
        name: '补短法 · 两次 SAS', tier: 'proof',
        sub: '严格证明 · 14 步，不用「旋转」，初二可读',
        steps: steps
      }
    ]
  });
})();
