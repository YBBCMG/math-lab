/* ============================================================
   角平分线 · 截取（截长模型）
   ------------------------------------------------------------
   题：△ABC 中，AD 平分 ∠BAC 交 BC 于 D，且 AB = AC + CD。
      求证：∠C = 2∠B。

   方法一（截长）：在 AB 上截取 AE = AC，连 DE
       BE = AB − AC = CD
       △AED ≌ △ACD（SAS）⟹ ED = CD = BE
       △BED 等腰 ⟹ ∠EBD = ∠EDB
       ∠AED 是 △BED 的外角 ⟹ ∠AED = 2∠B
       又 ∠AED = ∠C（全等对应角）⟹ ∠C = 2∠B

   方法二（补短）：延长 AC 至 F，使 CF = CD，连 DF
       AF = AC + CD = AB
       △ABD ≌ △AFD（SAS）⟹ ∠AFD = ∠ABD = ∠B
       △CDF 等腰 ⟹ ∠CFD = ∠CDF
       ∠ACD 是 △CDF 的外角 ⟹ ∠C = 2∠CFD = 2∠B

   角标纪律：∠B 一族（∠EBD / ∠EDB / ∠CFD / ∠CDF）统一蓝；
             ∠C 一族（∠C / ∠ACD / ∠AED）= 2∠B 统一紫；
             等长一族：AE = AC 绿，BE = CD = ED（方法二 AF = AB）红。
   ============================================================ */
(function () {
  var AN = window.ANNO, ML = window.ML;
  var COL = AN.COL, FS = AN.FS;
  var sub = AN.sub, add = AN.add, mul = AN.mul, unit = AN.unit, dist = AN.dist;
  var R = AN.D2R;

  /* ---------- 几何：BC 水平，B 左 C 右 ----------
     ∠B = 40°，∠C = 2∠B = 80°，∠A = 60°。
     选 40 而不是 30：30 会让 ∠A 变成直角、三角形退化成特殊形状，
     学生容易误以为结论依赖「直角」这个巧合。              */
  var TH = 40;
  var LEN = 360;
  var Bp = [255, 340];
  var Cp = [Bp[0] + LEN, 340];

  var tB = Math.tan(TH * R), tC = Math.tan(2 * TH * R);
  var h = LEN * tB * tC / (tB + tC);
  var Ap = [Bp[0] + h / tB, Bp[1] - h];

  var AB = dist(Ap, Bp), AC = dist(Ap, Cp);
  var BD = LEN * AB / (AB + AC);                  // 角平分线定理
  var Dp = [Bp[0] + BD, Bp[1]];
  var CD = dist(Cp, Dp);
  var Ep = add(Ap, mul(unit(sub(Bp, Ap)), AC));   // AB 上，AE = AC
  var Fp = add(Cp, mul(unit(sub(Cp, Ap)), CD));   // AC 延长线上，CF = CD

  var O = [(Ap[0] + Bp[0] + Cp[0]) / 3, (Ap[1] + Bp[1] + Cp[1]) / 3];

  function ang(id, V, X, Y, color, text, r, o) {
    var opt = { gap: 24, size: 15 };
    if (o) for (var k in o) opt[k] = o[k];
    return AN.angle(id, V, X, Y, r == null ? 34 : r, color, text, opt);
  }
  function line(id, X, Y, color, sw) {
    return { id: id, k: 'line', a: X, b: Y, stroke: color || COL.EDGE, sw: sw || 2.4 };
  }
  function poly(id, pts, rgb, a) {
    return { id: id, k: 'poly', pts: pts, fill: AN.wash(rgb || '37,99,235', a == null ? 0.13 : a), stroke: 'none' };
  }
  // 账本：底部左对齐三行
  function ledger(p) {
    return function (lines) {
      return lines.map(function (t, i) {
        return AN.txt(p + 'led' + i, [60, 402 + i * 30], t, {
          size: 15, anchor: 'start',
          color: i === lines.length - 1 ? COL.RED : COL.INK
        });
      });
    };
  }
  var LD1 = ['vled0', 'vled1', 'vled2'];
  var LD2 = ['wled0', 'wled1', 'wled2'];
  var led1 = ledger('v'), led2 = ledger('w');

  /* ---------- 两法共用底图（id 前缀区分） ---------- */
  function fig(p) {
    var e = {};
    e.fill = { id: p + 'fill', k: 'poly', pts: [Ap, Bp, Cp], fill: COL.FILL, stroke: 'none' };
    e.sAB = line(p + 'sAB', Ap, Bp);
    e.sBC = line(p + 'sBC', Bp, Cp);
    e.sCA = line(p + 'sCA', Cp, Ap);
    e.sAD = line(p + 'sAD', Ap, Dp);

    e.nA = AN.vname(p + 'A', Ap, O);
    e.nB = AN.vname(p + 'B', Bp, O);
    e.nC = AN.vname(p + 'C', Cp, O);
    e.nD = AN.vname(p + 'D', Dp, O);

    // AD 平分 ∠BAC：两侧各一道同色弧。半径必须错开，
    // 同半径会被 AD 一穿看成「一整条弧跨过整个 ∠A」。
    e.bis = AN.angle(p + 'bis1', Ap, Bp, Dp, 26, COL.INK, null, { sw: 3 })
      .concat(AN.angle(p + 'bis2', Ap, Dp, Cp, 38, COL.INK, null, { sw: 3 }));
    return e;
  }

  /* ============================================================
     方法一：截长 —— 在 AB 上取 E，使 AE = AC
     ============================================================ */
  var f1 = fig('v');
  var nE = AN.txt('vnE', [Ep[0] - 26, Ep[1] - 10], 'E', { size: FS.V, weight: 700 });

  var sED = line('vsED', Ep, Dp);
  var tkAE = AN.tick('vtkAE', Ap, Ep, COL.GREEN);
  var tkAC = AN.tick('vtkAC', Ap, Cp, COL.GREEN);
  var tkBE = AN.tick('vtkBE', Bp, Ep, COL.RED, 9, -28);
  var tkCD = AN.tick('vtkCD', Cp, Dp, COL.RED, 9, 6);
  var tkED = AN.tick('vtkED', Ep, Dp, COL.RED, 9, 28);

  var fAED = poly('vfAED', [Ap, Ep, Dp]);
  var fACD = poly('vfACD', [Ap, Cp, Dp]);

  var aEBD = ang('vaEBD', Bp, Ep, Dp, COL.BLUE);            // = ∠B
  var aEDB = ang('vaEDB', Dp, Ep, Bp, COL.BLUE);            // 等腰底角 = ∠B
  var aAED = ang('vaAED', Ep, Ap, Dp, COL.PURPLE, null, 40); // = ∠C = 2∠B
  var aC = ang('vaC', Cp, Bp, Ap, COL.PURPLE);              // = ∠C

  var lift1 = ['vsAB', 'vsBC', 'vsCA', 'vsAD', 'vsED',
               'vaEBD', 'vaEDB', 'vaAED', 'vaC',
               'vtkAE', 'vtkAC', 'vtkBE', 'vtkCD', 'vtkED'];

  var steps1 = [
    {
      say: '△ABC 里，AD 平分 ∠BAC，交 BC 于 D。题目给的条件是 AB 等于 AC 加 CD，要证的是 ∠C 等于 2 倍的 ∠B。A 处两道弧一样大，就是 AD 平分 ∠A 的记号。',
      cite: '题设：AD 平分 ∠BAC，AB = AC + CD',
      add: [f1.fill, f1.sAB, f1.sBC, f1.sCA, f1.sAD,
            f1.nA, f1.nB, f1.nC, f1.nD]
        .concat(f1.bis, led1(['已知 AB = AC + CD', '求证 ∠C = 2∠B'])),
      eq: '已知 AB = AC + CD，求证 ∠C = 2∠B'
    },
    {
      say: '条件里是两条线段的和，结论是两个角的关系。这两样东西接不上，得先搭一座桥：把 AC 加 CD 变成一条线段。',
      cite: '等量代换：两条线段之和可以看成一条线段',
      delNow: LD1,
      add: led1(['条件：长度关系', '结论：角度关系', '中间要搭桥：AC + CD 拼成一条线段']),
      eq: '目标：把 AC + CD 变成一条线段'
    },
    {
      say: '可是 AC 和 CD 不在同一条直线上，直接拼不起来。那就反过来想：AB 已经是现成的一整段，在它上面截一段 AE，让它等于 AC。',
      cite: '尺规可作：在 AB 上截取 AE = AC',
      delNow: LD1,
      add: [nE, tkAE, tkAC].concat(led1(['在 AB 上取 E，使 AE = AC'])),
      front: lift1,
      eq: 'AE = AC'
    },
    {
      say: 'AE 等于 AC，那么 AB 减掉 AE 只剩 BE；而题目说 AB 减掉 AC 恰好等于 CD。所以 BE 就等于 CD。',
      cite: '等式两边同时减去 AC：AB − AC = CD，而 AB − AE = BE',
      delNow: LD1,
      add: [tkBE, tkCD].concat(led1(['BE = AB − AE = AB − AC = CD', '⟹ BE = CD'])),
      front: lift1,
      eq: 'BE = CD'
    },
    {
      say: '连上 DE。现在有两个三角形：△AED 和 △ACD，它们共用一条边 AD。',
      cite: '两点确定一条线段',
      delNow: LD1,
      add: [sED, fAED, fACD].concat(led1(['连 DE，看 △AED 与 △ACD', '公共边：AD = AD'])),
      front: lift1,
      eq: 'AD 公共'
    },
    {
      say: 'AD 是 ∠BAC 的平分线，而 E 在 AB 上，所以 ∠EAD 和 ∠CAD 是一对相等的角。',
      cite: '角平分线定义：∠BAD = ∠CAD；E 在 AB 上，∠EAD 就是 ∠BAD',
      delNow: LD1,
      add: led1(['∠EAD = ∠BAD = ∠CAD']),
      front: lift1,
      eq: '∠EAD = ∠CAD'
    },
    {
      say: '三样凑齐了：AE 等于 AC，∠EAD 等于 ∠CAD，AD 还是公共边。两边夹一角，SAS，两个三角形全等。',
      cite: 'SAS：两边及其夹角分别相等的两个三角形全等',
      delNow: LD1,
      upd: [
        { id: 'vfAED', fill: AN.wash('15,157,88', 0.16) },
        { id: 'vfACD', fill: AN.wash('15,157,88', 0.16) }
      ],
      add: led1(['AE = AC，∠EAD = ∠CAD，AD = AD', '⟹ △AED ≌ △ACD（SAS）']),
      front: lift1,
      eq: '△AED ≌ △ACD（SAS）'
    },
    {
      say: '全等的对应边相等，所以 ED 等于 CD。而刚刚已经知道 BE 也等于 CD，于是 BE、CD、ED 三条一样长。',
      cite: '全等三角形对应边相等；等量代换',
      delNow: LD1,
      add: [tkED].concat(led1(['ED = CD（全等对应边）', '⟹ BE = CD = ED'])),
      front: lift1,
      eq: 'BE = CD = ED'
    },
    {
      say: '看 △BED：BE 等于 ED，是等腰三角形。等边对等角，两个底角相等，∠EBD 和 ∠EDB 一样大。',
      cite: '等边对等角（△BED 中 BE = ED）',
      delNow: LD1,
      add: aEBD.concat(aEDB, led1(['BE = ED ⟹ ∠EBD = ∠EDB'])),
      front: lift1,
      eq: '∠EBD = ∠EDB'
    },
    {
      say: '再看 E 这个点：A、E、B 三点共线，所以 ∠AED 是 △BED 的一个外角。外角等于不相邻的两个内角之和，正好是 ∠EBD 加 ∠EDB，也就是 2 倍的 ∠B。',
      cite: '三角形外角等于与它不相邻的两个内角之和',
      delNow: LD1,
      add: aAED.concat(led1(['∠EBD = ∠B（E 在 BA 上）', '∠AED = ∠EBD + ∠EDB = 2∠B'])),
      front: lift1,
      eq: '∠AED = 2∠B'
    },
    {
      say: '最后一步收口：全等还给了一个对应角，∠AED 等于 ∠C。两边都是 2 倍的 ∠B，所以 ∠C 也等于 2∠B。',
      cite: '全等三角形对应角相等；等量代换',
      delNow: LD1,
      add: aC.concat(led1(['∠C = ∠AED（全等对应角）', '∠C = 2∠B'])),
      front: lift1,
      eq: '∠C = 2∠B',
      hold: 4200
    }
  ];

  /* ============================================================
     方法二：补短 —— 延长 AC 至 F，使 CF = CD
     ============================================================ */
  var f2 = fig('w');
  var nF = AN.txt('wnF', [Fp[0] + 24, Fp[1] - 6], 'F', { size: FS.V, weight: 700, anchor: 'start' });

  var sCF = line('wsCF', Cp, Fp);
  var sDF = line('wsDF', Dp, Fp);
  var tkCF = AN.tick('wtkCF', Cp, Fp, COL.GREEN, 9, 26);
  var tkCD2 = AN.tick('wtkCD', Cp, Dp, COL.GREEN, 9, 26);
    // AF 的中点正好落在 AC 段里，不挪会被读成「AC 的刻度」。
  // 往 A 拉 110：和 tkAB 一起在 A 附近成对出现，读作「从 A 量出去两条边一样长」。
  var tkAF = AN.tick('wtkAF', Ap, Fp, COL.RED, 9, -110);
  var tkAB2 = AN.tick('wtkAB', Ap, Bp, COL.RED, 9, -110);

  var fABD2 = poly('wfABD', [Ap, Bp, Dp]);
  var fAFD = poly('wfAFD', [Ap, Fp, Dp]);

  var aAFD = ang('waAFD', Fp, Ap, Dp, COL.BLUE);            // = ∠B
  var aCDF = ang('waCDF', Dp, Cp, Fp, COL.BLUE);            // 等腰底角 = ∠B
  var aACD = ang('waACD', Cp, Ap, Dp, COL.PURPLE, null, 40); // = ∠C = 2∠B

  var lift2 = ['wsAB', 'wsBC', 'wsCA', 'wsAD', 'wsCF', 'wsDF',
               'waAFD', 'waCDF', 'waACD',
               'wtkCF', 'wtkCD', 'wtkAF', 'wtkAB'];

  var steps2 = [
    {
      say: '同一个题，换个方向下手：不去切长边，而是把两条短线段接到一起。三角形还是那个三角形，AD 照样平分 ∠A。',
      cite: '题设不变：AD 平分 ∠BAC，AB = AC + CD',
      add: [f2.fill, f2.sAB, f2.sBC, f2.sCA, f2.sAD,
            f2.nA, f2.nB, f2.nC, f2.nD]
        .concat(f2.bis, led2(['已知 AB = AC + CD', '求证 ∠C = 2∠B'])),
      eq: 'AB = AC + CD，求证 ∠C = 2∠B'
    },
    {
      say: '把 AC 从 C 这一头往外延长到 F，让 CF 等于 CD。这样一来，AC 加 CF 就连成了一条完整的线段 AF。',
      cite: '补短法：延长一条线段，把两段拼成一整段',
      delNow: LD2,
      add: [sCF, nF, tkCF, tkCD2].concat(led2(['延长 AC 至 F，使 CF = CD'])),
      front: lift2,
      eq: 'CF = CD'
    },
    {
      say: 'AF 等于 AC 加 CF，也就是 AC 加 CD。而题目说 AC 加 CD 等于 AB。所以 AF 和 AB 一样长。',
      cite: '等量代换：AF = AC + CF = AC + CD = AB',
      delNow: LD2,
      add: [tkAF, tkAB2].concat(led2(['AF = AC + CF = AC + CD = AB', '⟹ AF = AB'])),
      front: lift2,
      eq: 'AF = AB'
    },
    {
      say: '连上 DF。现在有两个三角形：△ABD 和 △AFD，共用一条边 AD。',
      cite: '两点确定一条线段',
      delNow: LD2,
      add: [sDF, fABD2, fAFD].concat(led2(['连 DF，看 △ABD 与 △AFD', '公共边：AD = AD'])),
      front: lift2,
      eq: 'AD 公共'
    },
    {
      say: 'A、C、F 三点共线，所以 ∠FAD 就是 ∠CAD，而 AD 平分 ∠BAC，所以 ∠BAD 和 ∠FAD 相等。',
      cite: '角平分线定义；A、C、F 三点共线，∠FAD 就是 ∠CAD',
      delNow: LD2,
      add: led2(['∠BAD = ∠CAD = ∠FAD']),
      front: lift2,
      eq: '∠BAD = ∠FAD'
    },
    {
      say: 'AB 等于 AF，∠BAD 等于 ∠FAD，AD 又是公共边。两边夹一角，SAS。',
      cite: 'SAS：两边及其夹角分别相等的两个三角形全等',
      delNow: LD2,
      upd: [
        { id: 'wfABD', fill: AN.wash('15,157,88', 0.16) },
        { id: 'wfAFD', fill: AN.wash('15,157,88', 0.16) }
      ],
      add: led2(['AB = AF，∠BAD = ∠FAD，AD = AD', '⟹ △ABD ≌ △AFD（SAS）']),
      front: lift2,
      eq: '△ABD ≌ △AFD（SAS）'
    },
    {
      say: '全等的对应角相等，∠AFD 等于 ∠ABD，而 ∠ABD 就是原来的 ∠B。所以 F 这个角也等于 ∠B。',
      cite: '全等三角形对应角相等',
      delNow: LD2,
      add: aAFD.concat(led2(['∠AFD = ∠ABD = ∠B'])),
      front: lift2,
      eq: '∠AFD = ∠B'
    },
    {
      say: '再看 △CDF：CF 等于 CD，也是等腰三角形，两个底角相等，∠CFD 等于 ∠CDF。',
      cite: '等边对等角（△CDF 中 CF = CD）',
      delNow: LD2,
      add: aCDF.concat(led2(['CF = CD ⟹ ∠CFD = ∠CDF'])),
      front: lift2,
      eq: '∠CFD = ∠CDF'
    },
    {
      say: 'A、C、F 三点共线，∠ACD 是 △CDF 的一个外角，等于两个不相邻内角之和，也就是 2 倍的 ∠CFD。而 ∠CFD 就是 ∠B，所以 ∠C 等于 2∠B。',
      cite: '三角形外角等于与它不相邻的两个内角之和',
      delNow: LD2,
      add: aACD.concat(led2(['∠ACD = ∠CFD + ∠CDF = 2∠CFD', '∠C = ∠ACD = 2∠B'])),
      front: lift2,
      eq: '∠C = 2∠B',
      hold: 4200
    }
  ];

  window.MATHLAB_LESSONS = window.MATHLAB_LESSONS || [];
  window.MATHLAB_LESSONS.push({
    id: 'angle-bisector-cut',
    title: '角平分线 · 截长：AB = AC + CD，证 ∠C = 2∠B',
    grade: '初二',
    topic: '几何 · 全等模型',
    tags: ['几何', '全等', '全等模型', '角平分线', '截长补短', 'SAS'],
    question: '在 △ABC 中，AD 平分 ∠BAC 交 BC 于 D，且 AB = AC + CD。求证：∠C = 2∠B。',
    thumbStep: 7,
    methods: [
      {
        name: '截长法 · 在 AB 上取 AE = AC', tier: 'proof',
        sub: '严格证明 · 11 步，一次截取 + 一次全等 + 一个外角',
        steps: steps1
      },
      {
        name: '补短法 · 延长 AC 至 F 使 CF = CD', tier: 'proof',
        sub: '严格证明 · 9 步，把两条短线段接成一整段',
        steps: steps2
      }
    ]
  });
})();
