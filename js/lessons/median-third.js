/* ============================================================
   中线与三分点：AF : FC = 1 : 2
   ------------------------------------------------------------
   题：△ABC 中，AD 是 BC 边上的中线，E 是 AD 的中点，BE 的延长线交 AC 于 F。
       求 AF : FC。

   方法一（过 D 作 DG ∥ AC —— 全等 + 中位线）：
       过 D 作 DG ∥ AC，交 BE 于 G
       ∠DEG = ∠AEF（对顶角），DE = AE（E 是 AD 中点），∠GDE = ∠FAE（内错角）
       ⟹ △DGE ≌ △AFE（ASA）⟹ DG = AF
       在 △BCF 中，D 是 BC 中点且 DG ∥ CF ⟹ DG 是中位线 ⟹ DG = CF/2
       ⟹ AF = CF/2 ⟹ AF : FC = 1 : 2

   方法二（面积法 —— 不用相似，初二就能懂）：
       设 S△ABC = S。D 是 BC 中点 ⟹ S△ABD = S/2
       E 是 AD 中点 ⟹ S△ABE = S/4，S△ACE = S/4，且 S△BCE = S/4 + S/4 = S/2
       设 t = EF/BE：同高三角形面积比等于底之比
       ⟹ S△AEF = t·S/4，S△CEF = t·S/2
       又 S△AEF + S△CEF = S△ACE = S/4 ⟹ t(1/4 + 1/2) = 1/4 ⟹ t = 1/3
       ⟹ S△ABF = S/4 + S/12 = S/3 ；同高 ⟹ AF/AC = 1/3 ⟹ AF : FC = 1 : 2

   几何已由 _design_ab.mjs 验算：
       A=(430,110) B=(150,420) C=(700,410)，D=(425,415)、E=(427.5,262.5)
       F = BE ∩ AC = (520,210)，AF=134.536 FC=269.072 ⟹ AF:FC = 0.5
       G = DG ∩ BE = (335,315)，DG = 134.536 = AF，DG/CF = 0.5
       面积法复核：t = 1/3，S△ABF = S/3，AF/AC = 1/3

   角标纪律：中点一族同色（BD/DC 蓝、AE/ED 绿），全等对应边 DG/AF 橙，中位线 CF/DG 紫。
   ============================================================ */
(function () {
  var AN = window.ANNO, ML = window.ML;
  var COL = AN.COL, FS = AN.FS;
  var sub = AN.sub, add = AN.add, mul = AN.mul, unit = AN.unit, dist = AN.dist, mid = AN.mid;

  /* ---------- 几何（全部来自 _design_ab.mjs，4 位以内精确） ---------- */
  var A = [430, 110], B = [150, 400], C = [700, 390];
  var D = mid(B, C);                              // (425, 415)  BC 中点
  var E = mid(A, D);                              // (427.5, 262.5)  AD 中点

  function r3(v) { return Math.round(v * 1000) / 1000; }
  /* 两直线求交：P1 + t·d1 = P2 + s·d2 */
  function inter(P1, d1, P2, d2) {
    var den = d1[0] * d2[1] - d1[1] * d2[0];
    var t = ((P2[0] - P1[0]) * d2[1] - (P2[1] - P1[1]) * d2[0]) / den;
    return [r3(P1[0] + t * d1[0]), r3(P1[1] + t * d1[1])];
  }
  var F = inter(B, sub(E, B), A, sub(C, A));      // (520, 210)  BE ∩ AC
  var G = inter(D, sub(C, A), B, sub(E, B));      // (335, 315)  DG ∩ BE

  var O = [(A[0] + B[0] + C[0]) / 3, (A[1] + B[1] + C[1]) / 3];

  function line(id, X, Y, color, sw, dash) {
    return { id: id, k: 'line', a: X, b: Y, stroke: color || COL.EDGE, sw: sw || 2.4, dash: dash };
  }
  function heavy(id, X, Y, color) {
    return { id: id, k: 'line', a: X, b: Y, stroke: color, sw: 6.0 };
  }
  function poly(id, pts, rgb, a) {
    return { id: id, k: 'poly', pts: pts, fill: AN.wash(rgb || '37,99,235', a == null ? 0.12 : a), stroke: 'none' };
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

  /* ---------- 公共底图 ---------- */
  function fig(p) {
    var e = {};
    e.fill = poly(p + 'fill', [A, B, C], '37,99,235', 0.10);
    e.sAB = line(p + 'sAB', A, B);
    e.sBC = line(p + 'sBC', B, C);
    e.sCA = line(p + 'sCA', C, A);
    e.sAD = line(p + 'sAD', A, D, COL.INK, 2.4);

    e.nA = AN.vname(p + 'A', A, O);
    e.nB = AN.vname(p + 'B', B, O, 22);   // B 在左下角，只推 22 才躲得开左下角的账本
    e.nC = AN.vname(p + 'C', C, O);
    e.nD = AN.txt(p + 'D', [D[0], D[1] + 28], 'D', { size: FS.V, weight: 700, color: COL.INK });
    // E 是 AD 中点又在 BE 上：往右会压 △AFE 的橙块，往右下正好落在 BE 线上，
    // 只有左上这一格同时躲开 AD（竖直）和 BE（斜率 −0.57）两条线
    e.nE = AN.txt(p + 'E', [E[0] - 22, E[1] - 14], 'E', { size: FS.V, weight: 700, color: COL.INK });

    e.cD = { id: p + 'cD', k: 'circ', c: D, r: 4.2, fill: COL.INK, stroke: 'none' };
    e.cE = { id: p + 'cE', k: 'circ', c: E, r: 4.2, fill: COL.INK, stroke: 'none' };
    return e;
  }

  /* ============================================================
     方法一：过 D 作 DG ∥ AC
     ============================================================ */
  var f1 = fig('v');

  var sBF = line('vsBF', B, F, COL.RED, 2.6);     // BE 延长到 F
  var sDG = line('vsDG', D, G, COL.GREY, 2.4, [7, 5]);
  var nF = AN.txt('vnF', [F[0] + 20, F[1] - 22], 'F', { size: FS.V, weight: 700, color: COL.RED });
  var nG = AN.txt('vnG', [G[0] - 28, G[1] - 10], 'G', { size: FS.V, weight: 700, color: COL.TEAL, anchor: 'end' });
  var cF = { id: 'vcF', k: 'circ', c: F, r: 4.2, fill: COL.RED, stroke: 'none' };
  var cG = { id: 'vcG', k: 'circ', c: G, r: 4.2, fill: COL.TEAL, stroke: 'none' };

  var tkBD = AN.tick('vtkBD', B, D, COL.BLUE);
  var tkDC = AN.tick('vtkDC', D, C, COL.BLUE);
  var tkAE = AN.tick('vtkAE', A, E, COL.GREEN);
  var tkED = AN.tick('vtkED', E, D, COL.GREEN);
  var tkAF = AN.tick('vtkAF', A, F, COL.ORANGE);
  var tkDG = AN.tick('vtkDG', D, G, COL.ORANGE);
  var tkFC = AN.tick('vtkFC', F, C, COL.PURPLE);

  var flDGE = poly('vfDGE', [D, G, E], '14,116,144', 0.24);
  var flAFE = poly('vfAFE', [A, F, E], '194,65,12', 0.20);

  var lift1 = ['vsAB', 'vsBC', 'vsCA', 'vsAD', 'vsBF', 'vsDG',
               'vnA', 'vnB', 'vnC', 'vnD', 'vnE', 'vnF', 'vnG',
               'vcD', 'vcE', 'vcF', 'vcG',
               'vtkBD', 'vtkDC', 'vtkAE', 'vtkED', 'vtkAF', 'vtkDG', 'vtkFC',
               'vfDGE', 'vfAFE'];
  var LD1 = ['vled0', 'vled1', 'vled2'];

  var steps1 = [
    {
      say: '三角形 ABC，AD 连到 BC 的中点，所以它是中线。E 又正好是 AD 的中点 —— 两个中点叠在中线上。BE 延长出去交 AC 于 F，问的是 AF 比 FC。',
      cite: '题设：D 是 BC 中点，E 是 AD 中点，F = BE ∩ AC',
      add: [f1.fill, f1.sAB, f1.sBC, f1.sCA, f1.sAD,
            f1.nA, f1.nB, f1.nC, f1.nD, f1.nE, f1.cD, f1.cE]
        .concat(led('v')(['D 是 BC 中点（AD 是中线）', 'E 是 AD 中点', 'BE 交 AC 于 F，求 AF : FC'], 452)),
      eq: '求 AF : FC'
    },
    {
      say: '先把两个中点标清楚：BD 等于 DC，AE 等于 ED。这道题从头到尾用的就是这两组等长，加上一个 E 处的对顶角。',
      cite: '中点：BD = DC，AE = ED',
      add: [tkBD, tkDC, tkAE, tkED].concat(led('v')(['BD = DC，AE = ED', '全题只靠这两组等长'])),
      front: lift1
    },
    {
      say: '把 BE 延长到 F，交上 AC。现在图上有两条穿过 F 的线：一条是 AC，一条是 BF。要求 AF 比 FC，就等于要求 F 把 AC 分成什么样的比例。',
      cite: 'F = BE 的延长线与 AC 的交点',
      add: [sBF, nF, cF].concat(led('v')(['BE 延长交 AC 于 F', '问题变成：F 在 AC 的什么位置'])),
      front: lift1
    },
    {
      say: '关键的一刀：过 D 作一条平行于 AC 的虚线，交 BE 于 G。为什么要作它？因为 D 是 BC 的中点 —— 一旦有了平行线，中位线就出来了。',
      cite: '辅助线：过 D 作 DG ∥ AC，交 BE 于 G',
      add: [sDG, nG, cG].concat(led('v')(['过 D 作 DG ∥ AC', '交 BE 于 G', '理由：D 是中点 + 平行 ⟹ 中位线'])),
      front: lift1
    },
    {
      say: '看青色和橙色这两块小三角形。E 处两个角是对顶角；AE 等于 ED，是 E 作中点的条件；DG 平行 AC，所以 ∠GDE 和 ∠FAE 是内错角。角边角，两块全等。',
      cite: 'ASA：∠DEG = ∠AEF（对顶角），DE = AE，∠GDE = ∠FAE（内错角）⟹ △DGE ≌ △AFE',
      add: [flDGE, flAFE].concat(led('v')(['△DGE ≌ △AFE（ASA）', '对顶角 + 中点 + 内错角'])),
      front: lift1
    },
    {
      say: '全等直接给出 DG 等于 AF。也就是说，那条虚线的长度，就是我们要的 AF —— 问题从 AC 上搬到 BF 这条线上了。',
      cite: '全等性质：DG = AF',
      add: [tkAF, tkDG].concat(led('v')(['DG = AF', '把 AF 搬到 BF 线上'])),
      front: lift1
    },
    {
      say: '再回到大三角形 BCF 看。D 是 BC 的中点，DG 又平行于 CF，那么 G 就是 BF 的中点 —— 这正是中位线的逆用。所以 DG 是 △BCF 的中位线，长度是 CF 的一半。',
      cite: '中位线逆定理：D 是 BC 中点，DG ∥ CF ⟹ G 是 BF 中点，DG = CF/2',
      add: [tkFC].concat(led('v')(['在 △BCF 中：D 是中点，DG ∥ CF', '⟹ G 是 BF 中点', '⟹ DG = CF/2'])),
      front: lift1
    },
    {
      say: '把两件事拼起来：AF 等于 DG，DG 又等于 CF 的一半，所以 AF 就是 FC 的一半。AF 比 FC 等于一比二，答案出来了。',
      cite: 'AF = DG = CF/2 ⟹ AF : FC = 1 : 2',
      add: led('v')(['AF = DG = CF/2', '⟹ AF : FC = 1 : 2 ✓']),
      front: lift1,
      eq: 'AF : FC = 1 : 2'
    }
  ];

  /* ============================================================
     方法二：面积法（不碰相似）
     ============================================================ */
  var f2 = fig('w');
  var sBF2 = line('wsBF', B, F, COL.RED, 2.6);
  var nF2 = AN.txt('wnF', [F[0] + 20, F[1] - 22], 'F', { size: FS.V, weight: 700, color: COL.RED });
  var cF2 = { id: 'wcF', k: 'circ', c: F, r: 4.2, fill: COL.RED, stroke: 'none' };

  // 面积色块
  var sABE = poly('wsABE', [A, B, E], '15,157,88', 0.30);
  var sACE = poly('wsACE', [A, E, C], '194,65,12', 0.26);
  var sBCE = poly('wsBCE', [B, C, E], '37,99,235', 0.18);
  var sABF = poly('wsABF', [A, B, F], '124,58,237', 0.22);

  function lab(id, P, t, color) {
    return AN.txt(id, P, t, { size: FS.NOTE, color: color, weight: 700, halo: true });
  }
  var lABE = lab('wlABE', [336, 268], 'S/4', COL.GREEN);
  var lACE = lab('wlACE', [522, 268], 'S/4', COL.ORANGE);
  var lBCE = lab('wlBCE', [425, 360], 'S/2', COL.BLUE);
  var lABF = lab('wlABF', [367, 247], 'S/3', COL.PURPLE);   // △ABF 重心

  var lift2 = ['wsAB', 'wsBC', 'wsCA', 'wsAD', 'wsBF',
               'wnA', 'wnB', 'wnC', 'wnD', 'wnE', 'wnF',
               'wcD', 'wcE', 'wcF',
               'wsABE', 'wsACE', 'wsBCE', 'wsABF',
               'wlABE', 'wlACE', 'wlBCE', 'wlABF'];
  var LD2 = ['wled0', 'wled1', 'wled2'];

  var steps2 = [
    {
      say: '方法二不画辅助线，只用面积。先把整个三角形的面积记作 S，然后一路把它切下去 —— 每一次切割都靠「中点」这两个字。',
      cite: '设 S△ABC = S',
      add: [f2.fill, f2.sAB, f2.sBC, f2.sCA, f2.sAD,
            f2.nA, f2.nB, f2.nC, f2.nD, f2.nE, f2.cD, f2.cE]
        .concat(led('w')(['设 S△ABC = S', '只用面积比，不碰相似'], 452)),
      eq: '设 S△ABC = S'
    },
    {
      say: 'D 是 BC 的中点，AD 把大三角形分成两块。同高、底相等，所以 S△ABD 就是 S 的一半。',
      cite: 'D 是 BC 中点 ⟹ S△ABD = S△ACD = S/2',
      add: led('w')(['S△ABD = S/2（D 是中点）']),
      front: lift2
    },
    {
      say: '再看 E。E 是 AD 的中点，它把 △ABD 又对半分，把 △ACD 也对半分。所以 △ABE 和 △ACE 各是 S 的四分之一。',
      cite: 'E 是 AD 中点 ⟹ S△ABE = S/4，S△ACE = S/4',
      add: [sABE, sACE, lABE, lACE].concat(led('w')(['S△ABE = S/4', 'S△ACE = S/4'])),
      front: lift2
    },
    {
      say: '把下面两块加起来：△BDE 和 △CDE 各是 S 的四分之一，合起来 △BCE 就是 S 的一半。这个数待会儿要用，因为 F 恰好在 BE 这条线上。',
      cite: 'S△BCE = S△BDE + S△CDE = S/4 + S/4 = S/2',
      add: [sBCE, lBCE].concat(led('w')(['S△BDE = S/4，S△CDE = S/4', '⟹ S△BCE = S/2'])),
      front: lift2
    },
    {
      say: '现在设一个小量：EF 比 BE 记作 t。同高的三角形面积比就是底之比，所以 △AEF 是 △ABE 的 t 倍，△CEF 是 △BCE 的 t 倍。',
      cite: '设 t = EF/BE；同高 ⟹ S△AEF = t·S/4，S△CEF = t·S/2',
      add: [sBF2, nF2, cF2].concat(led('w')(['设 t = EF / BE', 'S△AEF = t · S/4', 'S△CEF = t · S/2'])),
      front: lift2
    },
    {
      say: '这两个三角形加起来就是 △ACE，而 △ACE 是 S 的四分之一。列个方程：四分之一乘 t 加上二分之一乘 t，等于四分之一。解出来 t 等于三分之一。',
      cite: 'S△AEF + S△CEF = S△ACE ⟹ t/4 + t/2 = 1/4 ⟹ t = 1/3',
      add: led('w')(['S△AEF + S△CEF = S△ACE = S/4', 't/4 + t/2 = 1/4', '⟹ t = 1/3']),
      front: lift2
    },
    {
      say: 't 等于三分之一，意思是 EF 是 BE 的三分之一。回到上面：△AEF 就等于 S 的十二分之一。',
      cite: 't = 1/3 ⟹ S△AEF = S/12，S△CEF = S/6',
      add: led('w')(['EF = BE/3', 'S△AEF = S/12，S△CEF = S/6']),
      front: lift2
    },
    {
      say: '把 △ABF 拼出来：它等于 △ABE 加 △AEF，四分之一加十二分之一，等于三分之一。',
      cite: 'S△ABF = S/4 + S/12 = S/3',
      // 绿色 S/4 块叠在紫色 △ABF 下面会把颜色染浑，这一步只留 △ABF 本体
      delNow: ['wsABE', 'wlABE'],
      add: [sABF, lABF].concat(led('w')(['S△ABF = S/4 + S/12', '= S/3'])),
      front: lift2
    },
    {
      say: '最后一步：△ABF 和 △ABC 共用顶点 B、底都在 AC 这条线上，同高，所以面积比就是底边比。三分之一，就是 AF 占 AC 的三分之一。于是 AF 比 FC 等于一比二。',
      cite: '同高 ⟹ S△ABF / S△ABC = AF / AC = 1/3 ⟹ AF : FC = 1 : 2',
      add: led('w')(['同高：S△ABF/S = AF/AC', 'AF/AC = 1/3', '⟹ AF : FC = 1 : 2 ✓']),
      front: lift2,
      eq: 'AF : FC = 1 : 2'
    }
  ];

  window.MATHLAB_LESSONS = window.MATHLAB_LESSONS || [];
  window.MATHLAB_LESSONS.push({
    id: 'median-third',
    title: '中线上的中点：AF : FC = 1 : 2',
    grade: '初二',
    topic: '几何 · 中点模型',
    tags: ['中点', '中线', '中位线', '全等', '面积法', '中点模型'],
    question: '△ABC 中，AD 是 BC 边上的中线，E 是 AD 的中点，BE 的延长线交 AC 于 F。求 AF : FC。',
    thumbStep: 3,
    methods: [
      { name: '过 D 作平行线（全等 + 中位线）', tier: 'proof', steps: steps1 },
      { name: '面积法（不碰相似）', tier: 'proof', steps: steps2 }
    ]
  });
})();
