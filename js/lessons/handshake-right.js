/* ============================================================
   手拉手 · 等腰直角三角形（旋转族）
   ------------------------------------------------------------
   题：△ABC、△ADE 都是等腰直角三角形，公共顶点 A，
      ∠BAC = ∠DAE = 90°。连 BD、CE。
      求证：BD = CE 且 BD ⊥ CE。

   方法一（SAS 全等 + 角度追踪）：
       ∠BAD = ∠BAC + ∠CAD = 90° + ∠CAD
       ∠CAE = ∠CAD + ∠DAE = ∠CAD + 90°  ⟹ ∠BAD = ∠CAE
       AB = AC，AD = AE，∠BAD = ∠CAE ⟹ △BAD ≌ △CAE（SAS）
       ⟹ BD = CE，∠ABD = ∠ACE
       设 BD 与 CE 交于 P：∠PBC = 45° − ∠ABD，∠PCB = 45° + ∠ACE
       ⟹ ∠BPC = 180° − (45° − ∠ABD) − (45° + ∠ACE) = 90°

   方法二（旋转 90°）：
       AB = AC 且 ∠BAC = 90° ⟹ 绕 A 顺时针转 90°，B 落到 C
       AD = AE 且 ∠DAE = 90° ⟹ 同一个旋转把 D 送到 E
       ⟹ 线段 BD 旋转 90° 后就是 CE
       ⟹ BD = CE（旋转保持长度），BD ⊥ CE（转了 90°）

   角标纪律：等长一族 —— AB = AC 绿、AD = AE 橙、BD = CE 红；
             两个直角都用 14px 方角，都在 A 点但分居两侧，不重叠。
   ============================================================ */
(function () {
  var AN = window.ANNO, ML = window.ML;
  var COL = AN.COL, FS = AN.FS;
  var sub = AN.sub, add = AN.add, mul = AN.mul, unit = AN.unit, dist = AN.dist;

  /* ---------- 几何：A 为公共顶点，AB 竖直向上，AC 水平向右 ---------- */
  var A = [405, 290];
  var c = 200, d = 135;
  var B = [A[0], A[1] - c];                 // (405,  90)  正上
  var C = [A[0] + c, A[1]];                 // (605, 290)  正右
  var D = ML.pt(A[0], A[1], d, -60);        // (472.5, 406.9) 右下
  var E = ML.pt(A[0], A[1], d, -150);       // (288.1, 357.5) 左下

  /* BD 与 CE 的交点 P（两线段真交点，程序解，不手填） */
  var P = (function () {
    var u = sub(D, B), v = sub(E, C), w = sub(C, B);
    var den = u[0] * v[1] - u[1] * v[0];
    var t = (w[0] * v[1] - w[1] * v[0]) / den;
    return [B[0] + t * u[0], B[1] + t * u[1]];
  })();

  var O = [(A[0] + B[0] + C[0]) / 3, (A[1] + B[1] + C[1]) / 3];

  function line(id, X, Y, color, sw, dash) {
    return { id: id, k: 'line', a: X, b: Y, stroke: color || COL.EDGE, sw: sw || 2.4, dash: dash };
  }
  function heavy(id, X, Y, color) {
    return { id: id, k: 'line', a: X, b: Y, stroke: color, sw: 5.5 };
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
    e.t1 = poly(p + 't1', [A, B, C], '37,99,235', 0.10);
    e.t2 = poly(p + 't2', [A, D, E], '194,65,12', 0.10);

    e.sAB = line(p + 'sAB', A, B);
    e.sAC = line(p + 'sAC', A, C);
    e.sBC = line(p + 'sBC', B, C);
    e.sAD = line(p + 'sAD', A, D);
    e.sAE = line(p + 'sAE', A, E);
    e.sDE = line(p + 'sDE', D, E);

    // BD/CE 用深色画，等长刻度才用红 —— 红线配红刻度会互相吞掉（同色 2.8 vs 3.2 看不出来）
    e.sBD = line(p + 'sBD', B, D, COL.EDGE, 2.8);
    e.sCE = line(p + 'sCE', C, E, COL.EDGE, 2.8);

    e.nA = AN.vname(p + 'A', A, O);
    e.nB = AN.vname(p + 'B', B, O);
    e.nC = AN.vname(p + 'C', C, O);
    e.nD = AN.vname(p + 'D', D, O);
    e.nE = AN.vname(p + 'E', E, O);

    // 两个直角都在 A，一个朝上右、一个朝下，方角不重叠
    e.rt1 = AN.right(p + 'rt1', A, B, C, 14, COL.BLUE);
    e.rt2 = AN.right(p + 'rt2', A, D, E, 14, COL.ORANGE);
    return e;
  }

  /* ============================================================
     方法一：SAS 全等 + 角度追踪
     ============================================================ */
  var f1 = fig('v');
  var nP = AN.txt('vnP', [P[0] + 26, P[1] + 22], 'P', { size: FS.V, weight: 700, anchor: 'start' });

  var tkAB = AN.tick('vtkAB', A, B, COL.GREEN, 9, -40);
  var tkAC = AN.tick('vtkAC', A, C, COL.GREEN, 9, -40);
  var tkAD = AN.tick('vtkAD', A, D, COL.ORANGE, 9, 30);
  var tkAE = AN.tick('vtkAE', A, E, COL.ORANGE, 9, 30);
  var tkBD = AN.tick('vtkBD', B, D, COL.RED);
  var tkCE = AN.tick('vtkCE', C, E, COL.RED);

  // ∠BAD 与 ∠CAE 都是 150° 的钝角：这种角画成弧必然横跨 AC 或 AE，
  // 两条大弧在 A 附近交叉，整张图糊成一团（实拍验证过）。
  // 改成「两个 90° 方角 + 同一个公共角 ∠CAD」——读者一眼能看出
  // 两个大角 = 各自的直角 + 同一个角，逻辑照样成立，图却干净。
  var aCAD = AN.angle('vaCAD', A, C, D, 32, COL.TEAL);
  var rtP = AN.right('vrtP', P, B, C, 11, COL.RED);

  var fBAD = poly('vfBAD', [B, A, D], '15,157,88', 0.16);
  var fCAE = poly('vfCAE', [C, A, E], '15,157,88', 0.16);

  var lift1 = ['vsAB', 'vsAC', 'vsBC', 'vsAD', 'vsAE', 'vsDE', 'vsBD', 'vsCE',
               'vtkAB', 'vtkAC', 'vtkAD', 'vtkAE', 'vtkBD', 'vtkCE',
               'vaCAD', 'vrt1', 'vrt2', 'vrtP'];

  var steps1 = [
    {
      say: '△ABC 和 △ADE 都是等腰直角三角形，公共顶点是 A。B 处这个方角是 ∠BAC 的直角记号，A 下面那个方角是 ∠DAE 的直角。连上 BD 和 CE，要证它们一样长，而且互相垂直。',
      cite: '题设：AB = AC，AD = AE，∠BAC = ∠DAE = 90°',
      add: [f1.t1, f1.t2, f1.sAB, f1.sAC, f1.sBC, f1.sAD, f1.sAE, f1.sDE,
            f1.rt1, f1.rt2, f1.nA, f1.nB, f1.nC, f1.nD, f1.nE]
        .concat(led1(['已知 AB = AC，AD = AE', '∠BAC = ∠DAE = 90°', '求证 BD = CE 且 BD ⊥ CE'])),
      eq: '求证 BD = CE 且 BD ⊥ CE'
    },
    {
      say: '先把 BD 和 CE 连起来。这两条线段分属两个三角形 —— △BAD 和 △CAE，长度关系通常从全等里拿。',
      cite: '要证的两条线段分别在 △BAD 与 △CAE 中',
      add: [f1.sBD, f1.sCE, tkAB, tkAC, tkAD, tkAE]
        .concat(led1(['看 △BAD 与 △CAE', 'AB = AC，AD = AE（等腰直角）'])),
      front: lift1,
      eq: '△BAD 与 △CAE'
    },
    {
      say: '全等还差夹角。两个直角分别被 AD 切成两半，先看 ∠BAD：它等于 ∠BAC 加上 ∠CAD，也就是 90° 加上中间那个角。',
      cite: '角的和差：∠BAD = ∠BAC + ∠CAD',
      delNow: LD1,
      add: aCAD.concat(led1(['∠BAD = ∠BAC + ∠CAD = 90° + ∠CAD'])),
      front: lift1,
      eq: '∠BAD = 90° + ∠CAD'
    },
    {
      say: '再看 ∠CAE：它等于 ∠CAD 加上 ∠DAE，也是 90° 加上同一个中间角。所以这两个角相等。',
      cite: '角的和差：∠CAE = ∠CAD + ∠DAE = ∠CAD + 90°',
      delNow: LD1,
      upd: [{ id: 'vaCAD', sw: 3.6 }],
      add: led1(['∠CAE = ∠CAD + ∠DAE = ∠CAD + 90°', '⟹ ∠BAD = ∠CAE']),
      front: lift1,
      eq: '∠BAD = ∠CAE'
    },
    {
      say: '现在三样齐了：AB 等于 AC，AD 等于 AE，夹角 ∠BAD 等于 ∠CAE。两边夹一角，SAS。',
      cite: 'SAS：两边及其夹角分别相等的两个三角形全等',
      delNow: LD1,
      upd: [
        { id: 'vfBAD', fill: AN.wash('15,157,88', 0.20) },
        { id: 'vfCAE', fill: AN.wash('15,157,88', 0.20) }
      ],
      add: [fBAD, fCAE].concat(led1(['AB = AC，AD = AE，∠BAD = ∠CAE', '⟹ △BAD ≌ △CAE（SAS）'])),
      front: lift1,
      eq: '△BAD ≌ △CAE（SAS）'
    },
    {
      say: '全等的对应边相等，所以 BD 等于 CE。长度这一半就拿下了。',
      cite: '全等三角形对应边相等',
      delNow: LD1,
      add: [tkBD, tkCE].concat(led1(['⟹ BD = CE'])),
      front: lift1,
      eq: 'BD = CE'
    },
    {
      say: '全等还给了一对对应角：∠ABD 等于 ∠ACE。垂直那一半要靠它。',
      cite: '全等三角形对应角相等',
      delNow: LD1,
      add: led1(['∠ABD = ∠ACE']),
      front: lift1,
      eq: '∠ABD = ∠ACE'
    },
    {
      say: '设 BD 与 CE 交于 P。在 △PBC 里：∠PBC 是 45° 减掉 ∠ABD，∠PCB 是 45° 加上 ∠ACE。',
      cite: '△ABC 是等腰直角 ⟹ ∠ABC = ∠ACB = 45°；角的和差',
      delNow: LD1,
      add: [nP].concat(led1(['∠PBC = 45° − ∠ABD', '∠PCB = 45° + ∠ACE'])),
      front: lift1,
      eq: '∠PBC = 45° − ∠ABD，∠PCB = 45° + ∠ACE'
    },
    {
      say: '代进 △PBC 的内角和。一减一加正好抵消，180 减 45 再减 45，剩下 90 度。',
      cite: '三角形内角和 180°；∠ABD = ∠ACE',
      delNow: LD1,
      // rtP 是 AN.right() 的标量返回，不能直接 .concat
      add: [rtP].concat(led1(['∠BPC = 180° − (45° − ∠ABD) − (45° + ∠ACE)',
                            '= 90°'])),
      front: lift1,
      eq: '∠BPC = 90°'
    },
    {
      say: 'P 处是直角，说明 BD 垂直于 CE。两条结论都证完了。',
      cite: '两条直线相交成直角 ⟹ 互相垂直',
      delNow: LD1,
      add: [heavy('vhlBD', B, D, COL.RED), heavy('vhlCE', C, E, COL.RED)]
        .concat(led1(['BD = CE，且 ∠BPC = 90°', 'BD = CE 且 BD ⊥ CE'])),
      front: lift1,
      eq: 'BD = CE 且 BD ⊥ CE',
      hold: 4200
    }
  ];

  /* ============================================================
     方法二：旋转 90°
     ============================================================ */
  var f2 = fig('w');

  var tkAB2 = AN.tick('wtkAB', A, B, COL.GREEN, 9, -40);
  var tkAC2 = AN.tick('wtkAC', A, C, COL.GREEN, 9, -40);
  var tkAD2 = AN.tick('wtkAD', A, D, COL.ORANGE, 9, 30);
  var tkAE2 = AN.tick('wtkAE', A, E, COL.ORANGE, 9, 30);

  var rtP2 = AN.right('wrtP', P, B, C, 11, COL.RED);
  var lift2 = ['wsAB', 'wsAC', 'wsBC', 'wsAD', 'wsAE', 'wsDE', 'wsBD', 'wsCE',
               'wtkAB', 'wtkAC', 'wtkAD', 'wtkAE', 'wrt1', 'wrt2', 'wrtP'];

  var steps2 = [
    {
      say: '同一个图，换一个眼光看：不证全等，改成「转一下」。还是这两个等腰直角三角形，共顶点 A。',
      cite: '题设不变：AB = AC，AD = AE，∠BAC = ∠DAE = 90°',
      add: [f2.t1, f2.t2, f2.sAB, f2.sAC, f2.sBC, f2.sAD, f2.sAE, f2.sDE,
            f2.sBD, f2.sCE, f2.rt1, f2.rt2,
            f2.nA, f2.nB, f2.nC, f2.nD, f2.nE]
        .concat(led2(['AB = AC，AD = AE', '两个顶角都是 90°'])),
      front: lift2,
      eq: '两个等腰直角共顶点 A'
    },
    {
      say: '先看 B 和 C：AB 等于 AC，而且 ∠BAC 是 90°。这两条合起来说明 —— 把 B 绕 A 顺时针转 90°，正好落到 C 上。',
      cite: 'AB = AC 且 ∠BAC = 90° ⟹ B 绕 A 顺时针旋转 90° 落在 C',
      delNow: LD2,
      add: [tkAB2, tkAC2].concat(led2(['AB = AC，∠BAC = 90°', '⟹ B 绕 A 转 90° 落到 C'])),
      front: lift2,
      eq: 'B →(绕 A 顺时针 90°)→ C'
    },
    {
      say: '再看 D 和 E：AD 等于 AE，∠DAE 也是 90°，而且是同一个方向。所以同一个旋转把 D 送到 E。',
      cite: 'AD = AE 且 ∠DAE = 90° ⟹ D 绕 A 顺时针旋转 90° 落在 E',
      delNow: LD2,
      add: [tkAD2, tkAE2].concat(led2(['AD = AE，∠DAE = 90°', '⟹ 同一个旋转把 D 送到 E'])),
      front: lift2,
      eq: 'D →(绕 A 顺时针 90°)→ E'
    },
    {
      say: '既然 B 到 C、D 到 E，那么整条线段 BD 转过去，就正好是线段 CE。现在把 BD 真转一次。',
      cite: '旋转把端点映到端点 ⟹ 线段映成线段',
      delNow: LD2,
      // 必须加粗 wsBD 本身：另起一个 heavy 元素的话，下一步旋转的是 wsBD，粗线不会跟着转
      upd: [{ id: 'wsBD', sw: 5.5 }],
      add: led2(['整条 BD 旋转 90° 就是 CE']),
      front: lift2,
      eq: 'BD 旋转 90° → CE'
    },
    {
      say: '转完了：BD 落在 CE 的位置上，完完全全重合。',
      cite: '旋转不改变图形的形状和大小',
      delNow: LD2,
      upd: [{ id: 'wsBD', rot: -90, origin: A }],
      // 留一条灰虚线残影在 BD 原位：静止截图里才看得出「它刚才是从这儿转过去的」
      add: [{ id: 'wghostBD', k: 'line', a: B, b: D, stroke: COL.GREY, sw: 2.2, dash: [8, 6] }]
        .concat(led2(['BD 旋转 90° 后与 CE 重合'])),
      front: lift2,
      eq: 'BD → CE'
    },
    {
      say: '重合就说明长度一样，所以 BD 等于 CE。',
      cite: '旋转是保距变换：对应线段相等',
      delNow: LD2,
      add: led2(['⟹ BD = CE']),
      front: lift2,
      eq: 'BD = CE'
    },
    {
      say: '再看方向：BD 要转过整整 90° 才能落到 CE 上。把它转回来，两条线在 P 处的夹角就是这 90°。',
      cite: '旋转角 90° ⟹ 原线段与像的夹角是 90°',
      delNow: LD2,
      del: ['wghostBD'],
      upd: [{ id: 'wsBD', rot: 0, origin: A }],
      add: [rtP2].concat(led2(['旋转角 = 90°', '⟹ BD 与 CE 的夹角是 90°'])),
      front: lift2,
      eq: 'BD ⊥ CE'
    },
    {
      say: '长度相等、方向垂直，两条结论一次拿下。这就是「手拉手」模型名字的来历 —— 两个等腰三角形像两只手扣在一起，一转就重合。',
      cite: '保距变换 + 旋转角 90°',
      delNow: LD2,
      add: [heavy('whlBD2', B, D, COL.RED), heavy('whlCE2', C, E, COL.BLUE)]
        .concat(led2(['BD = CE，∠BPC = 90°', 'BD = CE 且 BD ⊥ CE'])),
      front: lift2,
      eq: 'BD = CE 且 BD ⊥ CE',
      hold: 4200
    }
  ];

  window.MATHLAB_LESSONS = window.MATHLAB_LESSONS || [];
  window.MATHLAB_LESSONS.push({
    id: 'handshake-right',
    title: '手拉手 · 等腰直角：BD = CE 且 BD ⊥ CE',
    grade: '初二',
    topic: '几何 · 全等模型',
    tags: ['几何', '全等模型', '手拉手', '旋转', 'SAS', '等腰直角三角形'],
    question: '△ABC 与 △ADE 都是等腰直角三角形，公共顶点 A，∠BAC = ∠DAE = 90°。连 BD、CE，求证：BD = CE 且 BD ⊥ CE。',
    thumbStep: 8,
    methods: [
      {
        name: 'SAS 全等 + 角度追踪', tier: 'proof',
        sub: '严格证明 · 10 步，先证 BD = CE，再用内角和证垂直',
        steps: steps1
      },
      {
        name: '旋转 90° · 一次拿下两个结论', tier: 'proof',
        sub: '严格证明 · 8 步，靠保距变换与旋转角',
        steps: steps2
      }
    ]
  });
})();
