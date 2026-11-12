/* ============================================================
   直角三角形 · 斜边中线（中点族）
   ------------------------------------------------------------
   题：Rt△ABC 中，∠ACB = 90°，D 是斜边 AB 的中点。求证 CD = AB/2。

   方法一（倍长成矩形）：延长 CD 至 F，使 DF = CD，连 AF、FB
       D 同时平分 AB 与 CF ⟹ 四边形 AFBC 是平行四边形
       又 ∠ACB = 90° ⟹ 是矩形
       矩形对角线相等：AB = CF = 2CD ⟹ CD = AB/2

   方法二（中位线 + 垂直平分线）：取 AC 中点 E，连 DE
       DE 是中位线 ⟹ DE ∥ BC
       BC ⊥ AC ⟹ DE ⊥ AC，且 E 是 AC 中点 ⟹ DE 是 AC 的垂直平分线
       D 在垂直平分线上 ⟹ DA = DC；而 DA = AB/2 ⟹ CD = AB/2

   角标纪律：等长一族统一色 —— D 平分 AB 用绿，D 平分 CF 用红，
             方法二的 DA = DC 用紫；直角符号统一 14px。
   ============================================================ */
(function () {
  var AN = window.ANNO, ML = window.ML;
  var COL = AN.COL, FS = AN.FS;
  var sub = AN.sub, add = AN.add, mul = AN.mul, unit = AN.unit, dist = AN.dist, mid = AN.mid;

  /* ---------- 几何：直角在 C，AC 竖直、BC 水平 ----------
     两条直角边刻意不等（360 vs 250）：若画成正方形，学生会误以为
     题目隐含 AC = BC，而结论其实对任意直角三角形都成立。 */
  var C = [325, 430], A = [325, 70], B = [575, 430];
  var D = mid(A, B);                          // (450, 250) 斜边中点
  var F = [2 * D[0] - C[0], 2 * D[1] - C[1]]; // (575, 70)  = A + B − C
  var E = mid(A, C);                          // (325, 250) AC 中点

  var O = [(A[0] + B[0] + C[0]) / 3, (A[1] + B[1] + C[1]) / 3];

  function line(id, X, Y, color, sw, dash) {
    return { id: id, k: 'line', a: X, b: Y, stroke: color || COL.EDGE, sw: sw || 2.4, dash: dash };
  }
  function heavy(id, X, Y, color) {
    return { id: id, k: 'line', a: X, b: Y, stroke: color, sw: 6.5 };
  }
  function poly(id, pts, rgb, a) {
    return { id: id, k: 'poly', pts: pts, fill: AN.wash(rgb || '37,99,235', a == null ? 0.12 : a), stroke: 'none' };
  }
  function ledger(p) {
    return function (lines) {
      return lines.map(function (t, i) {
        return AN.txt(p + 'led' + i, [60, 470 + i * 30], t, {
          size: 15, anchor: 'start',
          color: i === lines.length - 1 ? COL.RED : COL.INK
        });
      });
    };
  }
  var LD1 = ['vled0', 'vled1'];
  var LD2 = ['wled0', 'wled1'];
  var led1 = ledger('v'), led2 = ledger('w');

  /* ---------- 两法共用底图 ---------- */
  function fig(p) {
    var e = {};
    e.fill = { id: p + 'fill', k: 'poly', pts: [A, B, C], fill: COL.FILL, stroke: 'none' };
    e.sAB = line(p + 'sAB', A, B);
    e.sBC = line(p + 'sBC', B, C);
    e.sCA = line(p + 'sCA', C, A);
    e.sCD = line(p + 'sCD', C, D);

    e.nA = AN.vname(p + 'A', A, O);
    e.nB = AN.vname(p + 'B', B, O);
    e.nC = AN.vname(p + 'C', C, O);
    // D 落在矩形中心 —— 两条对角线交叉的地方。重心外推的外推方向恰好贴着对角线，
    // 末步的粗红对角线会从字上划过去（_collide3 实测 5% 擦过）。
    // 挪到交叉点右侧的扇形空白里，并且开白色描边（halo）兜底。
    e.nD = AN.txt(p + 'D', [D[0] + 46, D[1] - 4], 'D', { size: FS.V, weight: 700, halo: true });

    // 直角符号：从 C 沿「朝 A」「朝 B」两个方向各走 14
    // AN.right 的第 3、4 个参数是「方向向量」，不是端点坐标 —— 传点会按原点算方向，方角歪掉
    e.rt = AN.right(p + 'rtC', C, sub(A, C), sub(B, C), 14, COL.INK);
    return e;
  }

  /* ============================================================
     方法一：倍长成矩形
     ============================================================ */
  var f1 = fig('v');
  var nF = AN.txt('vnF', [F[0] + 28, F[1] + 10], 'F', { size: FS.V, weight: 700, anchor: 'start' });

  var sDF = line('vsDF', D, F);
  var sAF = line('vsAF', A, F);
  var sFB = line('vsFB', F, B);

  var tkCD = AN.tick('vtkCD', C, D, COL.RED);
  var tkDF = AN.tick('vtkDF', D, F, COL.RED);
  var tkAD = AN.tick('vtkAD', A, D, COL.GREEN);
  var tkDB = AN.tick('vtkDB', D, B, COL.GREEN);

  var fRect = poly('vfRect', [A, F, B, C], '15,157,88', 0.10);

  var lift1 = ['vsAB', 'vsBC', 'vsCA', 'vsCD', 'vsDF', 'vsAF', 'vsFB',
               'vtkCD', 'vtkDF', 'vtkAD', 'vtkDB', 'vrtC'];

  var steps1 = [
    {
      say: 'Rt△ABC 里，∠C 是直角，C 处这个方角就是直角记号。D 是斜边 AB 的中点，连上 CD，它就是斜边上的中线。要证的是 CD 等于 AB 的一半。',
      cite: '题设：∠ACB = 90°，D 是 AB 的中点',
      add: [f1.fill, f1.sAB, f1.sBC, f1.sCA, f1.sCD, f1.rt,
            f1.nA, f1.nB, f1.nC, f1.nD]
        .concat(led1(['已知 ∠C = 90°，D 是 AB 中点', '求证 CD = AB/2'])),
      eq: '求证 CD = AB/2'
    },
    {
      say: '「一条线段是另一条的一半」，换个说法就是：这条线段的 2 倍等于另一条。所以先把 2 倍的 CD 造出来 —— 把 CD 原样再接一倍。',
      cite: '要证 CD = AB/2，等价于证 2CD = AB',
      delNow: LD1,
      add: led1(['CD = AB/2  ⟺  2CD = AB', '把 CD 延长一倍，造出 2CD']),
      eq: '2CD = AB'
    },
    {
      say: '延长 CD 到 F，让 DF 等于 CD，再把 AF 和 FB 连起来。现在 CF 就是 2 倍的 CD。',
      cite: '尺规可作：延长 CD 至 F，使 DF = CD',
      delNow: LD1,
      add: [sDF, nF, sAF, sFB, tkCD, tkDF]
        .concat(led1(['延长 CD 至 F，使 DF = CD  ⟹  CF = 2CD'])),
      front: lift1,
      eq: 'CF = 2CD'
    },
    {
      say: '重点来了：看四边形 AFBC 的两条对角线 —— AB 和 FC，它们交于 D 点。',
      cite: '四边形 AFBC 的对角线是 AB 与 FC',
      delNow: LD1,
      add: [heavy('vhlAB', A, B, COL.ORANGE), heavy('vhlFC', F, C, COL.ORANGE)]
        .concat(led1(['四边形 AFBC 的对角线：AB 与 FC', '两条对角线交于 D'])),
      // 粗线必须排在细线之后置顶：front 是按数组顺序 appendChild，
      // 若细线在后面被顶上去，2.4px 的深色细线会从 6.5px 粗线正中间露出来，看着像一条脏线
      front: lift1.concat(['vhlAB', 'vhlFC']),
      eq: '对角线 AB 与 FC 交于 D'
    },
    {
      say: 'D 是 AB 的中点，所以 D 把 AB 平分；而 DF 等于 CD 是刚才作的，所以 D 也把 FC 平分。两条对角线互相平分。',
      cite: 'D 是 AB 中点 ⟹ AD = DB；DF = CD ⟹ DC = DF',
      delNow: LD1.concat(['vhlAB', 'vhlFC']),
      add: [tkAD, tkDB].concat(led1(['D 平分 AB：AD = DB（已知）', 'D 平分 FC：DC = DF（作图）'])),
      front: lift1,
      eq: 'AD = DB 且 DC = DF'
    },
    {
      say: '对角线互相平分的四边形是平行四边形，所以 AFBC 是平行四边形 —— 对边 AF 与 BC 平行且相等，FB 与 AC 平行且相等。',
      cite: '对角线互相平分的四边形是平行四边形',
      delNow: LD1,
      add: [fRect].concat(led1(['对角线互相平分', '⟹ AFBC 是平行四边形'])),
      front: lift1,
      eq: 'AFBC 是平行四边形'
    },
    {
      say: '而这个平行四边形有一个角是直角 —— ∠ACB 就是 90°。有一个角是直角的平行四边形，就是矩形。',
      cite: '有一个角是直角的平行四边形是矩形',
      delNow: LD1,
      add: led1(['∠ACB = 90°', '⟹ AFBC 是矩形']),
      front: lift1,
      eq: 'AFBC 是矩形'
    },
    {
      say: '矩形的两条对角线相等，所以 CF 就等于 AB。而 CF 是 2 倍的 CD，代进去：2CD = AB，CD 就是 AB 的一半。',
      cite: '矩形的对角线相等；等量代换',
      delNow: LD1,
      add: [heavy('vhlCF', C, F, COL.RED), heavy('vhlAB2', A, B, COL.RED)]
        .concat(led1(['CF = AB（矩形对角线相等）', 'CD = CF/2 = AB/2'])),
      front: lift1.concat(['vhlCF', 'vhlAB2']),
      eq: 'CD = AB/2',
      hold: 4200
    }
  ];

  /* ============================================================
     方法二：中位线 + 垂直平分线
     ============================================================ */
  var f2 = fig('w');
  var nE = AN.txt('wnE', [E[0] - 26, E[1]], 'E', { size: FS.V, weight: 700, anchor: 'end' });

  var sDE = line('wsDE', D, E);
  var tkAE = AN.tick('wtkAE', A, E, COL.GREEN);
  var tkEC = AN.tick('wtkEC', E, C, COL.GREEN);
  var rtE = AN.right('wrtE', E, sub(A, E), sub(D, E), 14, COL.TEAL);

  var tkDA = AN.tick('wtkDA', A, D, COL.PURPLE);
  var tkDC = AN.tick('wtkDC', C, D, COL.PURPLE);

  var lift2 = ['wsAB', 'wsBC', 'wsCA', 'wsCD', 'wsDE',
               'wtkAE', 'wtkEC', 'wtkDA', 'wtkDC', 'wrtC', 'wrtE'];

  var steps2 = [
    {
      say: '同一个题，换个想法：不去延长，而是去找中点。∠C 还是直角，D 还是 AB 的中点。',
      cite: '题设不变：∠ACB = 90°，D 是 AB 中点',
      add: [f2.fill, f2.sAB, f2.sBC, f2.sCA, f2.sCD, f2.rt,
            f2.nA, f2.nB, f2.nC, f2.nD]
        .concat(led2(['已知 ∠C = 90°，D 是 AB 中点', '求证 CD = AB/2'])),
      eq: '求证 CD = AB/2'
    },
    {
      say: '取 AC 的中点 E，连上 DE。现在 D 和 E 分别是 AB、AC 的中点。',
      cite: '尺规可作：取 AC 的中点 E',
      delNow: LD2,
      add: [nE, sDE, tkAE, tkEC].concat(led2(['取 AC 中点 E，连 DE', '⟹ AE = EC'])),
      front: lift2,
      eq: 'AE = EC'
    },
    {
      say: 'D 是 AB 的中点，E 是 AC 的中点，所以 DE 是 △ABC 的中位线。中位线平行于第三边，长度是第三边的一半 —— 也就是说 DE 平行于 BC。',
      cite: '三角形中位线定理：中位线平行于第三边，并且等于它的一半',
      delNow: LD2,
      add: [heavy('whlDE', D, E, COL.TEAL), heavy('whlBC', B, C, COL.TEAL)]
        .concat(led2(['DE 是中位线 ⟹ DE ∥ BC，DE = BC/2'])),
      front: lift2.concat(['whlDE', 'whlBC']),
      eq: 'DE ∥ BC，DE = BC/2'
    },
    {
      say: '∠C 是直角，也就是 BC 垂直于 AC。DE 既然平行于 BC，那 DE 也就垂直于 AC。',
      cite: '一条直线垂直于两平行线中的一条，就垂直于另一条',
      delNow: LD2.concat(['whlDE', 'whlBC']),
      // rtE 是 AN.right() 返回的标量，不是数组 —— 不能直接 .concat
      add: [rtE].concat(led2(['BC ⊥ AC，且 DE ∥ BC', '⟹ DE ⊥ AC'])),
      front: lift2,
      eq: 'DE ⊥ AC'
    },
    {
      say: 'DE 经过 AC 的中点 E，又垂直于 AC —— 这两条合起来，DE 就是 AC 的垂直平分线。',
      cite: '垂直平分线：过线段中点且垂直于该线段的直线',
      delNow: LD2,
      add: [heavy('whlPerp', D, E, COL.BLUE)].concat(led2(['DE 过 AC 中点 E，且 DE ⊥ AC', '⟹ DE 是 AC 的垂直平分线'])),
      front: lift2.concat(['whlPerp']),
      eq: 'DE 是 AC 的垂直平分线'
    },
    {
      say: '线段垂直平分线上的点，到线段两端的距离相等。D 正好在这条垂直平分线上，所以 DA 就等于 DC。',
      cite: '线段垂直平分线上的点到线段两端距离相等',
      delNow: LD2.concat(['whlPerp']),
      add: [tkDA, tkDC].concat(led2(['D 在 AC 的垂直平分线上', '⟹ DA = DC'])),
      front: lift2,
      eq: 'DA = DC'
    },
    {
      say: '最后一步：D 是 AB 的中点，DA 本来就等于 AB 的一半。而 DC 等于 DA，所以 CD 也等于 AB 的一半。',
      cite: '中点定义 DA = AB/2；等量代换',
      delNow: LD2,
      add: [heavy('whlCD', C, D, COL.RED), heavy('whlAB', A, B, COL.RED)]
        .concat(led2(['DA = AB/2（D 是中点）', 'CD = DA = AB/2'])),
      front: lift2.concat(['whlCD', 'whlAB']),
      eq: 'CD = AB/2',
      hold: 4200
    }
  ];

  window.MATHLAB_LESSONS = window.MATHLAB_LESSONS || [];
  window.MATHLAB_LESSONS.push({
    id: 'hypotenuse-median',
    title: '直角三角形斜边中线：CD = AB/2',
    grade: '初二',
    topic: '几何 · 中点模型',
    tags: ['几何', '全等模型', '中点', '直角三角形', '中位线', '矩形'],
    question: '在 Rt△ABC 中，∠ACB = 90°，D 是斜边 AB 的中点。求证：CD = AB/2。',
    thumbStep: 5,
    methods: [
      {
        name: '倍长成矩形 · 延长 CD 至 F 使 DF = CD', tier: 'proof',
        sub: '严格证明 · 8 步，用「对角线互相平分」+「矩形对角线相等」',
        steps: steps1
      },
      {
        name: '中位线 + 垂直平分线 · 取 AC 中点 E', tier: 'proof',
        sub: '严格证明 · 7 步，不延长、只用中位线定理',
        steps: steps2
      }
    ]
  });
})();
