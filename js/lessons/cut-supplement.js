/* ============================================================
   截长补短 · 通用模型
   ------------------------------------------------------------
   题：△ABC 中，∠B = 2∠C，AD 平分 ∠BAC 交 BC 于 D。
      求证：AC = AB + BD。

   记 ∠C = θ，则 ∠B = 2θ，∠A = 180° − 3θ。

   方法一（截长）：在 AC 上取 E，使 AE = AB
       △ABD ≌ △AED（SAS）⟹ BD = ED，∠AED = ∠B = 2θ
       ∠DEC = 180° − 2θ，∠C = θ ⟹ ∠EDC = θ ⟹ ED = EC
       ⟹ AC = AE + EC = AB + BD

   方法二（补短）：延长 AB 至 F，使 BF = BD
       ∠DBF = 180° − 2θ，BF = BD ⟹ ∠BFD = ∠BDF = θ
       ∠AFD = ∠ACD，∠DAF = ∠DAC，AD 公共 ⟹ △ADF ≌ △ADC（AAS）
       ⟹ AC = AF = AB + BD

   方法三（延长 CB）：延长 CB 至 F，使 BF = AB
       ∠ABF = 180° − 2θ，AB = BF ⟹ ∠BAF = ∠BFA = θ = ∠ACB
       ⟹ AF = AC（△ACF）
       ∠ADF = ∠ADB = ∠DAC + ∠ACD（△ADC 的外角）= ∠DAC + θ
       ∠DAF = ∠DAB + ∠BAF = ∠DAC + θ ⟹ ∠ADF = ∠DAF ⟹ AF = DF
       ⟹ AC = DF = DB + BF = BD + AB

   角标规矩：弧半径统一 34（同顶点两弧才拉开到 60），数字只离弧 9px；
            同值同色（θ 蓝 / 2θ 紫），算得出来的角不写数字，交给账本。
   ============================================================ */
(function () {
  var AN = window.ANNO, ML = window.ML;
  var COL = AN.COL, FS = AN.FS;
  var sub = AN.sub, add = AN.add, mul = AN.mul, unit = AN.unit, dist = AN.dist;
  var R = AN.D2R;

  /* ---------- 几何：BC 水平，B 在左、C 在右、A 在上 ---------- */
  var TH = 40;                       // ∠C = θ
  var LEN = 300;                     // BC
  var BETA = 2 * TH;                 // ∠B = 2θ
  var Bp = [350, 305];
  var Cp = [Bp[0] + LEN, 305];

  var tC = Math.tan(TH * R), tB = Math.tan(BETA * R);
  var h = LEN * tC * tB / (tC + tB);                       // A 到 BC 的高
  var Ap = [Bp[0] + h / tB, Bp[1] - h];
  var AB = dist(Ap, Bp), AC = dist(Ap, Cp);
  var BD = LEN * AB / (AB + AC);                           // 角平分线定理
  var Dp = [Bp[0] + BD, Bp[1]];
  var Ep = add(Ap, mul(unit(sub(Cp, Ap)), AB));            // 方法一：AC 上，AE = AB
  var F2 = add(Bp, mul(unit(sub(Bp, Ap)), BD));            // 方法二：AB 延长线上，BF = BD
  var F3 = add(Bp, mul(unit(sub(Bp, Cp)), AB));            // 方法三：CB 延长线上，BF = AB

  var O = [(Ap[0] + Bp[0] + Cp[0]) / 3, (Ap[1] + Bp[1] + Cp[1]) / 3];

  /* ---------- 角标：弧 34、数字离弧 9 ---------- */
  function ang(id, V, X, Y, color, text, r, o) {
    var opt = { gap: 24, size: 15 };
    if (o) for (var k in o) opt[k] = o[k];
    return AN.angle(id, V, X, Y, r == null ? 34 : r, color, text, opt);
  }
  function line(id, X, Y, color, sw) {
    return { id: id, k: 'line', a: X, b: Y, stroke: color || COL.EDGE, sw: sw || 2.4 };
  }
  function heavy(id, X, Y, color) {
    return { id: id, k: 'line', a: X, b: Y, stroke: color, sw: 6.5 };
  }
  function poly(id, pts, a) {
    return { id: id, k: 'poly', pts: pts, fill: AN.wash('15,157,88', a == null ? 0.15 : a), stroke: 'none' };
  }
  function ledger(p) {
    return function (lines) {
      return lines.map(function (t, i) {
        return AN.txt(p + 'led' + i, [60, 462 + i * 30], t, {
          size: 15, anchor: 'start',
          color: i === lines.length - 1 ? COL.RED : COL.INK
        });
      });
    };
  }
  var LD1 = ['vled0', 'vled1', 'vled2', 'vled3'];
  var LD2 = ['wled0', 'wled1', 'wled2', 'wled3'];
  var LD3 = ['xled0', 'xled1', 'xled2', 'xled3'];
  var led1 = ledger('v'), led2 = ledger('w'), led3 = ledger('x');

  /* ---------- 三法共用的底图 ---------- */
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

    // 同一个值只用一种颜色：θ 蓝、2θ 紫
    e.aC = ang(p + 'aC', Cp, Bp, Ap, COL.BLUE, 'θ');
    e.aB = ang(p + 'aB', Bp, Ap, Cp, COL.PURPLE, '2θ');
    // AD 平分 ∠A：两侧各一道同色小弧（同色 = 相等）
    e.bis = AN.angle(p + 'bis1', Ap, Bp, Dp, 30, COL.INK, null, { sw: 3 })
      .concat(AN.angle(p + 'bis2', Ap, Dp, Cp, 30, COL.INK, null, { sw: 3 }));

    e.cap = AN.txt(p + 'cap', [620, 40], '∠B = 2∠C：设 ∠C = θ ⟹ ∠B = 2θ', { size: 16, anchor: 'start' });
    return e;
  }

  /* ============================================================
     方法一：截长
     ============================================================ */
  var f1 = fig('v');
  var sE = line('vsE', Ep, Dp);                       // 断言脚本按 a=E、b=D 读
  var tkAE = AN.tick('vtkAE', Ap, Ep, COL.GREEN);
  var tkAB = AN.tick('vtkAB', Ap, Bp, COL.GREEN);
  var tkBD = AN.tick('vtkBD', Bp, Dp, COL.RED);
  var tkED = AN.tick('vtkED', Dp, Ep, COL.RED);
  var tkEC = AN.tick('vtkEC', Cp, Ep, COL.RED);

  var aAED = ang('vaAED', Ep, Ap, Dp, COL.PURPLE, '2θ');
  var aEDC = ang('vaEDC', Dp, Ep, Cp, COL.BLUE, 'θ');

  var fABD = poly('vfABD', [Ap, Bp, Dp]);
  var fAED = poly('vfAED', [Ap, Ep, Dp]);

  var nE = AN.txt('vnE', [Ep[0] + 26, Ep[1] - 14], 'E', { size: FS.V, weight: 700 });

  var lift1 = ['vsAB', 'vsBC', 'vsCA', 'vsAD', 'vsE',
               'vaC', 'vaB', 'vbis1', 'vbis2', 'vaAED', 'vaEDC'];

  var steps1 = [
    {
      say: '题目给的是一条等式：AC = AB + BD。先把它翻译成图形语言 —— ∠C 记作 θ，那 ∠B 就是 2θ，∠A = 180° − 3θ。AD 把 ∠A 劈成相等的两半。',
      cite: '三角形内角和 180°；角平分线的定义',
      add: [f1.fill, f1.sAB, f1.sBC, f1.sCA, f1.sAD,
            f1.nA, f1.nB, f1.nC, f1.nD]
        .concat(f1.aC, f1.aB, f1.bis, [f1.cap]),
      eq: '∠C = θ，∠B = 2θ，∠A = 180° − 3θ'
    },
    {
      say: '要证的是 AC = AB + BD。AC 是外面那条长边，AB 和 BD 分居两处 —— 「一条长 = 两段短」，标准套路就是截长或补短。先走截长。',
      cite: '要证的整体在 AC 上，两段碎片在别处',
      delNow: LD1,
      add: [heavy('vhlAC', Ap, Cp, COL.BLUE)].concat(led1(['要证：AC = AB + BD'])),
      front: lift1,
      eq: 'AC = AB + BD'
    },
    {
      say: '在 AC 上截一段 AE，让 AE = AB。这样 AB 这一段就被搬到了长边上面，剩下只要搞定 EC = BD。',
      cite: '截长法：在长线段上截取一段等于已知线段',
      delNow: LD1,
      add: [nE, tkAE, tkAB].concat(led1(['在 AC 上取 E，使 AE = AB', '只要再证 EC = BD'])),
      front: lift1,
      eq: 'AE = AB'
    },
    {
      say: '连 ED，看 △ABD 和 △AED：AB = AE，∠BAD = ∠EAD（AD 是角平分线），AD 还是公共边。两边夹一角，SAS 全等。',
      cite: 'SAS：两边及其夹角分别相等的两个三角形全等',
      delNow: LD1,
      add: [sE, fABD, fAED].concat(led1(['AB = AE，∠BAD = ∠EAD，AD = AD', '⟹ △ABD ≌ △AED（SAS）'])),
      front: lift1,
      eq: '△ABD ≌ △AED（SAS）'
    },
    {
      say: '全等的对应边和对应角：BD = ED，∠AED = ∠B = 2θ。BD 就这么变成了 ED。',
      cite: '全等三角形对应边相等、对应角相等',
      delNow: LD1,
      add: [tkBD, tkED].concat(aAED, led1(['BD = ED', '∠AED = ∠ABD = 2θ'])),
      front: lift1,
      eq: 'BD = ED，∠AED = 2θ'
    },
    {
      say: 'A、E、C 三点共线，所以 ∠AED 和 ∠DEC 是邻补角，∠DEC = 180° − 2θ。',
      cite: '邻补角互补',
      delNow: LD1,
      add: led1(['∠DEC = 180° − ∠AED = 180° − 2θ']),
      front: lift1,
      eq: '∠DEC = 180° − 2θ'
    },
    {
      say: '在 △DEC 里用内角和：∠EDC = 180° − ∠DEC − ∠C = 180° − (180° − 2θ) − θ = θ。它和 ∠C 一样大。',
      cite: '三角形内角和 180°',
      delNow: LD1,
      add: aEDC.concat(led1(['∠EDC = 180° − (180° − 2θ) − θ', '= θ'])),
      front: lift1,
      eq: '∠EDC = θ'
    },
    {
      say: '∠EDC = ∠C，等角对等边，在 △DEC 里就是 ED = EC。而 ED 刚才已经等于 BD 了，所以 EC = BD。',
      cite: '等角对等边（△DEC 中 ∠EDC = ∠C ⟹ ED = EC）',
      delNow: LD1,
      add: [tkEC].concat(led1(['∠EDC = ∠C ⟹ ED = EC', '⟹ EC = BD'])),
      front: lift1,
      eq: 'EC = BD'
    },
    {
      say: '收口：AC 本来就是 AE 加 EC，把两段分别换成 AB 和 BD，等式就出来了。',
      cite: '等量代换',
      delNow: LD1,
      add: [heavy('vhlAE', Ap, Ep, COL.GREEN), heavy('vhlEC', Ep, Cp, COL.RED)]
        .concat(led1(['AC = AE + EC = AB + BD', 'AC = AB + BD'])),
      front: lift1,
      eq: 'AC = AB + BD',
      hold: 4200
    }
  ];

  /* ============================================================
     方法二：补短
     ============================================================ */
  var f2 = fig('w');
  var sBF2 = line('wsBF', Bp, F2);
  var tkBF2 = AN.tick('wtkBF', Bp, F2, COL.ORANGE);
  var tkBD2 = AN.tick('wtkBD', Bp, Dp, COL.ORANGE);
  var tkAF = AN.tick('wtkAF', Ap, F2, COL.GREEN);
  var tkAC2 = AN.tick('wtkAC', Ap, Cp, COL.GREEN);

  var aBFD = ang('waBFD', F2, Bp, Dp, COL.BLUE, 'θ');
  var aBDF = ang('waBDF', Dp, Bp, F2, COL.BLUE);

  var fADF = poly('wfADF', [Ap, Dp, F2]);
  var fADC = poly('wfADC', [Ap, Dp, Cp]);

  var nF2 = AN.txt('wF', [F2[0] - 18, F2[1] + 8], 'F', { size: FS.V, weight: 700, anchor: 'end' });

  var lift2 = ['wsAB', 'wsBC', 'wsCA', 'wsAD', 'wsBF',
               'waC', 'waB', 'wbis1', 'wbis2', 'waBFD', 'waBDF'];

  var steps2 = [
    {
      say: '同一个题，换个方向：不切长边，而是把两条短边接到一起。还是 ∠C = θ、∠B = 2θ、AD 平分 ∠A。',
      cite: '题设不变',
      add: [f2.fill, f2.sAB, f2.sBC, f2.sCA, f2.sAD,
            f2.nA, f2.nB, f2.nC, f2.nD]
        .concat(f2.aC, f2.aB, f2.bis, [f2.cap]),
      eq: 'AC = AB + BD'
    },
    {
      say: '把 AB 从 B 往外延长到 F，让 BF = BD。这样 AB + BD 就整个搬到了 AF 上，接下来只要证 AF = AC。',
      cite: '补短法：延长一条线段，把两段拼成一整段',
      delNow: LD2,
      add: [sBF2, nF2, tkBF2, tkBD2].concat(led2(['延长 AB 至 F，使 BF = BD', '只要再证 AF = AC'])),
      front: lift2,
      eq: 'AF = AB + BD'
    },
    {
      say: 'A、B、F 共线，所以 ∠DBF = 180° − ∠ABC = 180° − 2θ。',
      cite: '平角 180°',
      delNow: LD2,
      add: led2(['∠DBF = 180° − 2θ']),
      front: lift2,
      eq: '∠DBF = 180° − 2θ'
    },
    {
      say: '△BDF 里 BF = BD，是等腰三角形。顶角 180° − 2θ，两个底角就对半分，各是 θ。',
      cite: '等腰三角形两底角相等；内角和 180°',
      delNow: LD2,
      add: [].concat(aBFD, aBDF, led2(['BF = BD ⟹ ∠BFD = ∠BDF', '= (180° − (180° − 2θ)) ÷ 2 = θ'])),
      front: lift2,
      eq: '∠BFD = θ'
    },
    {
      say: '∠AFD 就是 ∠BFD，还是 θ；而 ∠ACD 也是 θ。两个角对上了 —— 这就是能往全等上凑的一半。',
      cite: 'A、B、F 共线，射线 FB 与射线 FA 是同一条',
      delNow: LD2,
      add: led2(['∠AFD = ∠BFD = θ', '∠ACD = ∠ACB = θ ⟹ ∠AFD = ∠ACD']),
      front: lift2,
      eq: '∠AFD = ∠ACD'
    },
    {
      say: '另外半边：AD 是角平分线，∠DAF = ∠DAC；AD 又是两个三角形的公共边。两角夹一边，AAS 全等。',
      cite: 'AAS：两角分别相等且其中一组等角的对边相等',
      delNow: LD2,
      add: [fADF, fADC].concat(led2(['∠AFD = ∠ACD，∠DAF = ∠DAC，AD = AD', '⟹ △ADF ≌ △ADC（AAS）'])),
      front: lift2,
      eq: '△ADF ≌ △ADC（AAS）'
    },
    {
      say: '全等的对应边相等：AF = AC。',
      cite: '全等三角形对应边相等',
      delNow: LD2,
      add: [tkAF, tkAC2].concat(led2(['AF = AC'])),
      front: lift2,
      eq: 'AF = AC'
    },
    {
      say: 'AF 本来就是 AB 加 BF，再把 BF 换回 BD —— AC = AB + BD。两条路殊途同归。',
      cite: '等量代换',
      delNow: LD2,
      add: [heavy('whlAF', Ap, F2, COL.GREEN)].concat(led2(['AC = AF = AB + BF = AB + BD', 'AC = AB + BD'])),
      front: lift2,
      eq: 'AC = AB + BD',
      hold: 4200
    }
  ];

  /* ============================================================
     方法三：延长 CB 至 F，使 BF = AB
     ============================================================ */
  var f3 = fig('x');
  var sBF3 = line('xsBF', Bp, F3);
  var tkAB3 = AN.tick('xtkAB', Ap, Bp, COL.ORANGE);
  var tkBF3 = AN.tick('xtkBF', Bp, F3, COL.ORANGE, 9, 30);
  var tkAC3 = AN.tick('xtkAC', Ap, Cp, COL.GREEN);
  var tkAF3 = AN.tick('xtkAF', Ap, F3, COL.GREEN);
  var tkDF3 = AN.tick('xtkDF', Dp, F3, COL.GREEN);

  var aBAF = ang('xaBAF', Ap, Bp, F3, COL.BLUE, 'θ');
  var aBFA = ang('xaBFA', F3, Bp, Ap, COL.BLUE, 'θ');
  // ∠ADF 与 ∠DAF 相等（都等于 ∠DAC + θ），同色、不写数字
  var aADF = ang('xaADF', Dp, Ap, F3, COL.GREEN, null, 34);
  var aDAF = ang('xaDAF', Ap, Dp, F3, COL.GREEN, null, 70);

  var fACF = poly('xfACF', [Ap, Cp, F3]);
  var fADF3 = poly('xfADF', [Ap, Dp, F3]);

  var nF3 = AN.vname('xF', F3, O);

  var lift3 = ['xsAB', 'xsBC', 'xsCA', 'xsAD', 'xsBF',
               'xaC', 'xaB', 'xbis1', 'xbis2', 'xaBAF', 'xaBFA', 'xaADF', 'xaDAF'];

  var steps3 = [
    {
      say: '第三个方向：这次不把两条短边拼在 A 那边，而是从 B 往回接。还是那句：∠C = θ，∠B = 2θ，AD 平分 ∠A。',
      cite: '题设不变',
      add: [f3.fill, f3.sAB, f3.sBC, f3.sCA, f3.sAD,
            f3.nA, f3.nB, f3.nC, f3.nD]
        .concat(f3.aC, f3.aB, f3.bis, [f3.cap]),
      eq: 'AC = AB + BD'
    },
    {
      say: '延长 CB 到 F，让 BF = AB。注意顺序：C、D、B、F 依次排开，B 夹在 D 和 F 中间 —— 这一点后面要用。',
      cite: '延长线作法：F 在射线 CB 上，B 在 C 与 F 之间',
      delNow: LD3,
      add: [sBF3, nF3, tkAB3, tkBF3].concat(led3(['延长 CB 至 F，使 BF = AB', 'B 在 D 与 F 之间'])),
      front: lift3,
      eq: 'BF = AB'
    },
    {
      say: 'A、B、F 共线，所以 ∠ABF = 180° − ∠ABC = 180° − 2θ。',
      cite: '平角 180°',
      delNow: LD3,
      add: led3(['∠ABF = 180° − 2θ']),
      front: lift3,
      eq: '∠ABF = 180° − 2θ'
    },
    {
      say: '△ABF 里 AB = BF，等腰。顶角 180° − 2θ，两个底角各是 θ —— 也就是 ∠BAF = ∠BFA = θ。',
      cite: '等腰三角形两底角相等；内角和 180°',
      delNow: LD3,
      add: [].concat(aBAF, aBFA, led3(['AB = BF ⟹ ∠BAF = ∠BFA', '= θ'])),
      front: lift3,
      eq: '∠BAF = ∠BFA = θ'
    },
    {
      say: '把 ∠BFA 和 ∠ACB 放在一起看：都是 θ。在 △ACF 里两个底角相等，等角对等边，所以 AF = AC。',
      cite: '等角对等边（△ACF 中 ∠BFA = ∠ACB ⟹ AF = AC）',
      delNow: LD3,
      add: [fACF, tkAC3, tkAF3].concat(led3(['∠BFA = θ = ∠ACB', '⟹ AF = AC'])),
      front: lift3,
      eq: 'AF = AC'
    },
    {
      say: '再看 △ADF 的 ∠ADF。D、B、F 共线，所以它就是 ∠ADB；而 ∠ADB 是 △ADC 在 D 处的外角，等于两个不相邻内角之和：∠DAC + ∠ACD = ∠DAC + θ。',
      cite: '三角形的外角等于与它不相邻的两个内角之和',
      delNow: LD3,
      add: aADF.concat(led3(['∠ADF = ∠ADB（D、B、F 共线）', '= ∠DAC + ∠ACD = ∠DAC + θ'])),
      front: lift3,
      eq: '∠ADF = ∠DAC + θ'
    },
    {
      say: '另一边，∠DAF = ∠DAB + ∠BAF：前半是 ∠DAC（角平分线），后半是 θ。两头一对照，∠ADF = ∠DAF，于是 AF = DF。',
      cite: '角的和；等角对等边（△ADF 中 ∠ADF = ∠DAF ⟹ AF = DF）',
      delNow: LD3,
      add: [fADF3, tkDF3].concat(aDAF, led3(['∠DAF = ∠DAB + ∠BAF = ∠DAC + θ', '⟹ ∠ADF = ∠DAF ⟹ AF = DF'])),
      front: lift3,
      eq: 'AF = DF'
    },
    {
      say: '最后一步全是替换：DF 是 D 到 F，中间经过 B，所以 DF = DB + BF = DB + AB；而 DF = AF = AC。',
      cite: '等量代换',
      delNow: LD3.concat(['xfACF', 'xfADF']),
      add: [heavy('xhlDF', Dp, F3, COL.GREEN), heavy('xhlAC', Ap, Cp, COL.GREEN),
            heavy('xhlAF', Ap, F3, COL.GREEN)]
        .concat(led3(['AC = AF = DF = DB + BF = BD + AB', 'AC = AB + BD'])),
      front: lift3,
      eq: 'AC = AB + BD',
      hold: 4200
    }
  ];

  /* ============================================================
     注册
     ============================================================ */
  window.MATHLAB_LESSONS = window.MATHLAB_LESSONS || [];
  window.MATHLAB_LESSONS.push({
    id: 'cut-supplement',
    title: '截长补短：把「两段之和」凑成「一条线段」',
    grade: '初二',
    topic: '几何 · 全等模型',
    tags: ['几何', '全等', 'SAS', 'AAS', '截长补短', '等腰', '角平分线', '外角'],
    question: '△ABC 中，∠B = 2∠C，AD 平分 ∠BAC 交 BC 于 D。求证：AC = AB + BD。',
    thumbStep: 5,
    methods: [
      {
        name: '截长法 · 在 AC 上取 AE = AB', tier: 'proof',
        sub: '严格证明 · 9 步，SAS 全等 + 等角对等边',
        steps: steps1
      },
      {
        name: '补短法 · 延长 AB 至 F 使 BF = BD', tier: 'proof',
        sub: '严格证明 · 8 步，等腰 + AAS 全等',
        steps: steps2
      },
      {
        name: '延长 CB · 取 BF = AB 造等腰', tier: 'proof',
        sub: '严格证明 · 8 步，两次等角对等边 + 外角',
        steps: steps3
      }
    ]
  });
})();
