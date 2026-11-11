/* ============================================================
   倍长中线 · 纯证明
   ------------------------------------------------------------
   题设：△ABC 中，D 是 BC 的中点，AD 是中线
   要证：AB + AC > 2AD

   方法：把 AD 原样延长一倍（倍长中线），用 SAS 把 AC 搬到 BE 的位置，
   再用「三角形两边之和大于第三边」。全程只做一次构造、一次全等。
   ============================================================ */
(function () {
  var AN = window.ANNO, ML = window.ML;
  var COL = AN.COL, FS = AN.FS;
  var sub = AN.sub, mid = AN.mid, add = AN.add, mul = AN.mul;

  /* ---------- 坐标：AD 恰好 200，倍长后 E 落在 450 ---------- */
  var A = [450, 50], B = [180, 270], C = [720, 230];
  var D = mid(B, C);                       // (450, 250)
  var E = [2 * D[0] - A[0], 2 * D[1] - A[1]];   // (450, 450)
  var O = [(A[0] + B[0] + C[0]) / 3, (A[1] + B[1] + C[1]) / 3];

  var tri = { id: 'tri', k: 'poly', pts: [A, B, C], fill: COL.FILL, stroke: COL.EDGE, sw: 2.6 };
  var nA = AN.vname('vA', A, O), nB = AN.vname('vB', B, O), nC = AN.vname('vC', C, O);
  var nD = AN.txt('vD', [D[0] + 42, D[1] + 26], 'D', { size: FS.V, weight: 700 });
  var nE = AN.txt('vE', [E[0], E[1] + 28], 'E', { size: FS.V, weight: 700 });

  var segAD = { id: 'segAD', k: 'line', a: A, b: D, stroke: COL.RED, sw: 3, dash: [9, 6] };
  var segDE = { id: 'segDE', k: 'line', a: D, b: E, stroke: COL.RED, sw: 3, dash: [9, 6] };
  var segBE = { id: 'segBE', k: 'line', a: B, b: E, stroke: COL.GREEN, sw: 2.8 };

  // 对顶角：只画两道同样的弧，不写字（顶点字母 D 就在旁边，写字会撞）
  var arc1 = AN.arc('arc1', D, A, C, 34, COL.ORANGE);
  var arc2 = AN.arc('arc2', D, E, B, 34, COL.ORANGE);

  var fADC = { id: 'fADC', k: 'poly', pts: [A, D, C], fill: AN.wash('37,99,235', 0.13), stroke: 'rgba(37,99,235,0.5)', sw: 2 };
  var fEDB = { id: 'fEDB', k: 'poly', pts: [E, D, B], fill: AN.wash('37,99,235', 0.13), stroke: 'rgba(37,99,235,0.5)', sw: 2 };
  var fABE = { id: 'fABE', k: 'poly', pts: [A, B, E], fill: AN.wash('194,65,12', 0.11), stroke: 'rgba(194,65,12,0.45)', sw: 2 };

  var P_IDS = ['p0', 'p1', 'p2'];
  function panel(lines) {
    return lines.map(function (t, i) {
      return AN.txt('p' + i, [60, 436 + i * 28], t, {
        size: 16, anchor: 'start',
        color: i === lines.length - 1 ? COL.RED : COL.INK
      });
    });
  }

  var steps = [
    {
      say: '△ABC 里，D 是 BC 的中点，AD 就是中线。要证 AB + AC 大于 2 倍的 AD。',
      cite: '题设：BD = DC（D 是 BC 中点）',
      add: [tri, nA, nB, nC, segAD, nD].concat(panel(['求证  AB + AC > 2AD'])),
      eq: 'BD = DC'
    },
    {
      say: '左边是两条边，右边是一条线段的 2 倍。这种式子，先把这三条线段塞进同一个三角形里。',
      cite: '三角形两边之和大于第三边，前提是这三条边在同一个三角形里',
      delNow: P_IDS,
      add: panel(['左边两条边，右边一条线段的 2 倍', '⟹ 先把它们放进同一个三角形']),
      eq: '目标：找一个含 AB、AC、2AD 的三角形'
    },
    {
      say: '延长 AD 到 E，使 DE 等于 AD，再连 BE。这一步叫「倍长中线」——把中线原样再接一倍。',
      cite: '尺规可作：延长 AD 至 E，DE = AD',
      delNow: P_IDS,
      add: [segDE, nE, segBE].concat(panel(['延长 AD 至 E，DE = AD', '连 BE ⟹ AE = 2AD'])),
      eq: 'DE = AD，AE = 2AD'
    },
    {
      say: '先证 △ADC 和 △EDB 全等。AD 等于 ED 是作的；两个角是对顶角；DC 等于 DB 因为 D 是中点。',
      cite: '对顶角相等；中点定义 DC = DB',
      delNow: P_IDS,
      add: [fADC, fEDB, arc1, arc2, AN.tick('tkBD', B, D, COL.EDGE, 8), AN.tick('tkDC', D, C, COL.EDGE, 8)]
        .concat(panel(['AD = ED（作图）', '∠ADC = ∠EDB（对顶角）', 'DC = DB（中点）'])),
      front: ['segAD', 'segDE', 'segBE'],
      eq: 'AD = ED，∠ADC = ∠EDB，DC = DB'
    },
    {
      say: '两边夹一角，SAS，两个三角形全等。',
      cite: 'SAS：两边及其夹角对应相等的两个三角形全等',
      delNow: P_IDS,
      upd: [
        { id: 'fADC', fill: AN.wash('15,157,88', 0.13), stroke: 'rgba(15,157,88,0.5)' },
        { id: 'fEDB', fill: AN.wash('15,157,88', 0.13), stroke: 'rgba(15,157,88,0.5)' }
      ],
      add: panel(['⟹ △ADC ≌ △EDB（SAS）']),
      eq: '△ADC ≌ △EDB（SAS）'
    },
    {
      say: '全等的对应边相等，所以 BE 等于 AC——AC 被原封不动搬到了 BE 的位置。',
      cite: '全等三角形对应边相等',
      delNow: P_IDS,
      add: [AN.tick('tkAC', A, C, COL.GREEN, 9), AN.tick('tkBE', B, E, COL.GREEN, 9)].concat(panel(['⟹ BE = AC'])),
      eq: 'BE = AC'
    },
    {
      say: '现在看 △ABE：三条边是 AB、BE、AE，正好凑齐了。',
      cite: '三角形两边之和大于第三边',
      delNow: P_IDS,
      // △EDB 整块内嵌在 △ABE 里，留着会把 △ABE 割成两块颜色；删掉它，
      // 「BE = AC」由第 6 步那两道绿色等长记号继续承担。
      delNow: P_IDS.concat(['fEDB']),
      upd: [{ id: 'fADC', fill: AN.wash('37,99,235', 0.05), stroke: 'rgba(37,99,235,0.26)' }],
      add: [fABE].concat(panel(['△ABE 中：AB + BE > AE'])),
      front: ['segBE', 'segAD', 'segDE', 'arc1', 'arc2', 'tkBD', 'tkDC', 'tkAC', 'tkBE'],
      eq: 'AB + BE > AE'
    },
    {
      say: '而 AE 就是 AD 加 DE，也就是 2 倍的 AD。',
      cite: 'A、D、E 依次共线，且 AD = DE',
      delNow: P_IDS,
      add: panel(['AE = AD + DE = 2AD']),
      eq: 'AE = 2AD'
    },
    {
      say: '把 BE 换回 AC，代进不等式：AB + AC > 2AD。',
      cite: '等量代换',
      delNow: P_IDS,
      add: panel(['⟹ AB + AC > 2AD']),
      eq: 'AB + AC > 2AD',
      hold: 3400
    },
    {
      say: '两边同除以 2，就得到中线长度的范围：AD 小于两边和的一半。',
      cite: '不等式两边同除以 2',
      delNow: P_IDS,
      add: panel(['⟹ AD < (AB + AC) / 2']),
      eq: 'AD < (AB + AC) / 2',
      hold: 3200
    }
  ];

  window.MATHLAB_LESSONS = window.MATHLAB_LESSONS || [];
  window.MATHLAB_LESSONS.push({
    id: 'double-median',
    title: '倍长中线：把 AC 搬到 BE 的位置',
    grade: '初二',
    topic: '几何 · 全等模型',
    tags: ['几何', '全等', '全等模型', 'SAS', '中线', '三角形三边关系'],
    question: '在 △ABC 中，D 是 BC 的中点，AD 是中线。求证：AB + AC > 2AD。',
    thumbStep: 4,
    methods: [
      {
        name: '倍长中线 · SAS 全等', tier: 'proof',
        sub: '严格证明 · 10 步，一次构造 + 一次全等',
        steps: steps
      }
    ]
  });
})();
