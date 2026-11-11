/* ============================================================
   截长补短 · 纯证明（方法课）
   ------------------------------------------------------------
   题：在 △ABC 中，∠B = 2∠C，AD 平分 ∠BAC 交 BC 于 D。
       求证：AC = AB + BD。

   为什么要专门学这一招：
     AC 是一条完整的边，AB 和 BD 分居两处、还不在同一条直线上，
     直接相加没有意义。截长补短就是「把两段碎片凑成一条线」的两个方向：
       · 截长：在长线段上截下一段 = 短线段，剩下的证明它等于另一段
       · 补短：把短线段接在另一段后面，凑成一条长线段再去证相等

   方法一（截长）：AC 上取 E 使 AE = AB → SAS 全等 → ∠EDC = ∠C → ED = EC
   方法二（补短）：延长 AB 到 F 使 BF = BD → 等腰求 ∠F = ∠C → AAS 全等

   图形摆法：B 在上、C 在下、A 在左（BC 竖直），
   所有点由角度算出，坐标一律不手填。
   ============================================================ */
(function () {
  var AN = window.ANNO, ML = window.ML;
  var COL = AN.COL, FS = AN.FS;
  var sub = AN.sub, add = AN.add, mul = AN.mul, unit = AN.unit, dist = AN.dist;

  /* ---------- 几何 ---------- */
  var BC = 380, angC = 40;                       // ∠C = 40°，∠B = 2∠C = 80°
  var angB = 2 * angC, angA = 180 - angC - angB; // ∠A = 60°
  var Bp = [520, 80], Cp = [520, 80 + BC];
  var AC = BC * Math.sin(angB * AN.D2R) / Math.sin(angA * AN.D2R);
  var dirCA = [-Math.sin(angC * AN.D2R), -Math.cos(angC * AN.D2R)];  // C → A：与 CB 夹 ∠C
  var Ap = add(Cp, mul(dirCA, AC));
  var AB = dist(Ap, Bp);
  var O = [(Ap[0] + Bp[0] + Cp[0]) / 3, (Ap[1] + Bp[1] + Cp[1]) / 3];

  // D：∠A 的平分线与 BC 的交点（BC 是竖直线，直接解出 y）
  var bisA = unit(add(unit(sub(Bp, Ap)), unit(sub(Cp, Ap))));
  var Dp = [Bp[0], Ap[1] + bisA[1] * (Bp[0] - Ap[0]) / bisA[0]];
  var BD = dist(Bp, Dp);

  var Ep = add(Ap, mul(unit(sub(Cp, Ap)), AB));   // AC 上，AE = AB
  var Fp = add(Bp, mul(unit(sub(Bp, Ap)), BD));   // AB 延长线上，BF = BD

  /* ---------- 一组图元（两种解法各建一份，id 前缀区分） ---------- */
  function fig(p) {
    var e = {};
    e.fill = { id: p + 'fill', k: 'poly', pts: [Ap, Bp, Cp], fill: COL.FILL };
    e.sAB = { id: p + 'sAB', k: 'line', a: Ap, b: Bp, stroke: COL.EDGE, sw: 2.4 };
    e.sBC = { id: p + 'sBC', k: 'line', a: Bp, b: Cp, stroke: COL.EDGE, sw: 2.4 };
    e.sCA = { id: p + 'sCA', k: 'line', a: Cp, b: Ap, stroke: COL.EDGE, sw: 2.4 };
    e.sAD = { id: p + 'sAD', k: 'line', a: Ap, b: Dp, stroke: COL.EDGE, sw: 2.4 };

    e.nA = AN.vname(p + 'A', Ap, O);
    e.nB = AN.vname(p + 'B', Bp, O);
    e.nC = AN.vname(p + 'C', Cp, O);
    e.nD = AN.txt(p + 'vD', [Dp[0] + 22, Dp[1] + 22], 'D', { size: FS.V, weight: 700 });

    // ∠C = θ、∠B = 2θ：整块的标记压在各自的顶点上，不写字（免得字号打架）
    // 同一个值用同一个颜色：θ 一律蓝，2θ 一律紫
    e.aC = AN.angle(p + 'aC', Cp, Bp, Ap, 48, COL.BLUE, 'θ', { size: FS.NOTE });
    e.aB = AN.angle(p + 'aB', Bp, Ap, Cp, 48, COL.PURPLE, '2θ', { size: FS.NOTE });
    // ∠A 被 AD 平分：两道同色等半径的弧，不加字
    e.bis = AN.angle(p + 'b1', Ap, Bp, Dp, 40, COL.PURPLE).concat(
            AN.angle(p + 'b2', Ap, Dp, Cp, 40, COL.PURPLE));

    e.cap = AN.txt(p + 'cap', [50, 44], '∠B = 2∠C：设 ∠C = θ，则 ∠B = 2θ',
      { size: FS.NOTE, anchor: 'start' });
    return e;
  }

  // 底部推导账本（整块替换，先删后加，不会叠字）
  function ledger(p, y) {
    return function (lines) {
      return lines.map(function (t, i) {
        return AN.txt(p + 'led' + i, [50, y + i * 28], t, {
          size: 16, anchor: 'start',
          color: i === lines.length - 1 ? COL.RED : COL.INK
        });
      });
    };
  }
  var LD1 = ['vled0', 'vled1', 'vled2', 'vled3'];
  var LD2 = ['wled0', 'wled1', 'wled2', 'wled3'];
  var led1 = ledger('v', 372), led2 = ledger('w', 372);

  function heavy(id, X, Y, color) {
    return { id: id, k: 'line', a: X, b: Y, stroke: color, sw: 6.5 };
  }

  /* ============================================================
     方法一：截长
     ============================================================ */
  var f1 = fig('v');
  var sE = { id: 'vsE', k: 'line', a: Ep, b: Dp, stroke: COL.EDGE, sw: 2.4 };
  var nE = AN.txt('vvE', [Ep[0] - 21, Ep[1] + 20], 'E', { size: FS.V, weight: 700 });

  var tkAE = AN.tick('vtkAE', Ap, Ep, COL.GREEN);
  var tkAB = AN.tick('vtkAB', Ap, Bp, COL.GREEN);
  // BD、ED、EC 三条同属一族：同一个记号（红色单杠）就表示它们彼此相等
  var tkBD = AN.tick('vtkBD', Bp, Dp, COL.RED);
  var tkED = AN.tick('vtkED', Ep, Dp, COL.RED);
  var tkEC = AN.tick('vtkEC', Ep, Cp, COL.RED);

  var hlAC = heavy('vhlAC', Ap, Cp, COL.RED);
  var hlAB = heavy('vhlAB', Ap, Bp, COL.BLUE);
  var hlBD = heavy('vhlBD', Bp, Dp, COL.ORANGE);
  var hlEC = heavy('vhlEC', Ep, Cp, COL.ORANGE);
  var hlAE = heavy('vhlAE', Ap, Ep, COL.RED);

  var fABD = { id: 'vfABD', k: 'poly', pts: [Ap, Bp, Dp], fill: AN.wash('15,157,88', 0.16), stroke: 'none' };
  var fAED = { id: 'vfAED', k: 'poly', pts: [Ap, Ep, Dp], fill: AN.wash('15,157,88', 0.16), stroke: 'none' };

  var aAED = AN.angle('vaAED', Ep, Ap, Dp, 34, COL.PURPLE, '2θ', { size: 15, gap: 24 });
  var aDEC = AN.angle('vaDEC', Ep, Dp, Cp, 44, COL.ORANGE);
  var aEDC = AN.angle('vaEDC', Dp, Ep, Cp, 34, COL.BLUE, 'θ', { size: 15, gap: 22 });

  var lift1 = ['vsAB', 'vsBC', 'vsCA', 'vsAD', 'vsE', 'vaC', 'vaB', 'vb1', 'vb2', 'vaAED', 'vaDEC', 'vaEDC'];

  var steps1 = [
    {
      say: '在 △ABC 中，∠B = 2∠C，AD 平分 ∠BAC 交 BC 于 D。要证的是 AC = AB + BD。',
      cite: '题设：∠B = 2∠C，∠BAD = ∠DAC（AD 是 ∠BAC 的平分线）',
      add: [f1.fill, f1.sAB, f1.sBC, f1.sCA, f1.sAD, f1.nA, f1.nB, f1.nC, f1.nD,
            ].concat(f1.aC, f1.aB, f1.bis, [f1.cap]),
      eq: '∠C = θ，∠B = 2θ，∠BAD = ∠DAC'
    },
    {
      say: '先看结构：AC 是一条完整的边，AB 和 BD 分居两头、还不共线 —— 直接相加没有意义。要证这种「整体 = 两段之和」，只有两条路：截长、补短。',
      cite: '要证 AC = AB + BD：整体在一条边上，两段碎片分散',
      delNow: LD1,
      add: [hlAC, hlAB, hlBD].concat(led1(['AC = AB + BD', 'AC 是整体；AB、BD 是两段碎片'])),
      eq: 'AC = AB + BD'
    },
    {
      say: '截长：在 AC 上截一段 AE，让它等于 AB。剩下的 EC 只要能等于 BD，整件事就结束了 —— 先看这一半。',
      cite: '截长法：在长线段上截取一条与短线段相等的线段',
      delNow: LD1,
      del: ['vhlAB', 'vhlBD', 'vhlAC'],
      add: [tkAE, tkAB, hlEC, nE].concat(led1(['截长：AE = AB', '接下来只要证 EC = BD'])),
      eq: 'AE = AB'
    },
    {
      say: '连 DE。△ABD 和 △AED：AB = AE，∠BAD = ∠EAD 是角平分线给的，AD 又是公共边。两边夹一角。',
      cite: 'SAS：两边及其夹角分别相等的两个三角形全等',
      delNow: LD1,
      add: [sE, fABD, fAED].concat(led1(['AB = AE，∠BAD = ∠EAD，AD 公共', '⟹ △ABD ≌ △AED（SAS）'])),
      front: lift1,
      eq: '△ABD ≌ △AED（SAS）'
    },
    {
      say: '全等给出两条对应关系：BD = ED，还有 ∠AED = ∠B = 2θ。',
      cite: '全等三角形对应边相等、对应角相等',
      delNow: LD1,
      add: [tkBD, tkED].concat(aAED, led1(['BD = ED，∠AED = 2θ'])),
      front: lift1,
      eq: 'BD = ED，∠AED = 2θ'
    },
    {
      say: 'E 落在 AC 上，所以 ∠AED 和 ∠DEC 拼成一条直线，加起来 180°。',
      cite: '邻补角互补（A、E、C 三点共线）',
      delNow: LD1,
      add: aDEC.slice(0, 1).concat(led1(['∠DEC = 180° − 2θ'])),
      front: lift1,
      eq: '∠DEC = 180° − 2θ'
    },
    {
      say: '△DEC 里三个角加起来 180°：θ 加上 180° − 2θ，剩下的 ∠EDC 就是 θ。',
      cite: '三角形内角和 180°',
      delNow: LD1,
      add: aEDC.concat(led1(['∠EDC = 180° − θ − (180° − 2θ) = θ'])),
      front: lift1,
      eq: '∠EDC = θ'
    },
    {
      say: '同一个三角形里，∠EDC 和 ∠ACB 都等于 θ —— 两个角相等，它们对着的边就相等。',
      cite: '等角对等边',
      delNow: LD1,
      add: [tkEC].concat(led1(['∠EDC = ∠C = θ', '⟹ ED = EC'])),
      front: lift1,
      eq: 'ED = EC'
    },
    {
      say: 'AE 换成 AB，EC 换成 BD —— 结论出来了。',
      cite: '等量代换',
      delNow: LD1,
      add: [hlAE].concat(led1(['AC = AE + EC', '= AB + BD'])),
      eq: 'AC = AB + BD',
      hold: 3600
    }
  ];

  /* ============================================================
     方法二：补短
     ============================================================ */
  var f2 = fig('w');
  var sBF = { id: 'wsBF', k: 'line', a: Bp, b: Fp, stroke: COL.EDGE, sw: 2.4 };
  var nF = AN.txt('wvF', [Fp[0] + 26, Fp[1] + 6], 'F', { size: FS.V, weight: 700 });

  var tkBF = AN.tick('wtkBF', Bp, Fp, COL.ORANGE);
  var tkBD2 = AN.tick('wtkBD', Bp, Dp, COL.ORANGE);
  var tkFA = AN.tick('wtkFA', Fp, Ap, COL.RED, 9, 0);
  var tkCA = AN.tick('wtkCA', Cp, Ap, COL.RED, 9, 0);

  var hlAB2 = heavy('whlAB', Ap, Bp, COL.BLUE);
  var hlBD2 = heavy('whlBD', Bp, Dp, COL.ORANGE);
  var hlAF = heavy('whlAF', Ap, Fp, COL.RED);

  var aDBF = AN.angle('waDBF', Bp, Dp, Fp, 40, COL.ORANGE, '180° − 2θ', { size: 15, gap: 30 });
  var aF = AN.angle('waF', Fp, Bp, Dp, 40, COL.GREEN, 'θ', { size: 15, gap: 24 });
  var aBDF = AN.angle('waBDF', Dp, Bp, Fp, 34, COL.GREEN);

  var fADF = { id: 'wfADF', k: 'poly', pts: [Ap, Dp, Fp], fill: AN.wash('37,99,235', 0.15), stroke: 'none' };
  var fADC = { id: 'wfADC', k: 'poly', pts: [Ap, Dp, Cp], fill: AN.wash('37,99,235', 0.15), stroke: 'none' };

  var lift2 = ['wsAB', 'wsBC', 'wsCA', 'wsAD', 'wsBF', 'waC', 'waB', 'wb1', 'wb2', 'waDBF', 'waF', 'waBDF'];

  var steps2 = [
    {
      say: '同一道题，换个方向。还是 ∠B = 2∠C，AD 平分 ∠BAC，要证 AC = AB + BD。',
      cite: '题设：∠B = 2∠C，∠BAD = ∠DAC',
      add: [f2.fill, f2.sAB, f2.sBC, f2.sCA, f2.sAD, f2.nA, f2.nB, f2.nC, f2.nD,
            ].concat(f2.aC, f2.aB, f2.bis, [f2.cap]),
      eq: '∠C = θ，∠B = 2θ'
    },
    {
      say: '补短：把 BD 接到 AB 的延长线上。BF = BD，那么 AB + BD 就在一条线段 AF 上了。',
      cite: '补短法：延长短线段，使延长部分等于另一条短线段',
      delNow: LD2,
      add: [hlAB2, hlBD2].concat(led2(['补短：把 BD 接到 AB 后面', 'AB + BD ←→ AF 一条线段'])),
      eq: 'AB + BD → AF'
    },
    {
      say: '延长 AB 到 F，使 BF = BD。现在 AF = AB + BD，只要证明 AF = AC。',
      cite: 'F 在 AB 的延长线上，BF = BD',
      delNow: LD2,
      add: [sBF, nF, tkBF, tkBD2, hlAF].concat(led2(['BF = BD', '只要再证 AF = AC'])),
      front: ['wsAB', 'wsBC', 'wsCA', 'wsAD', 'wsBF', 'waC', 'waB', 'wb1', 'wb2'],
      eq: 'AF = AB + BD'
    },
    {
      say: 'A、B、F 共线，所以 ∠DBF = 180° − ∠ABC = 180° − 2θ。又 BF = BD，等腰三角形的两个底角相等，各是 θ。',
      cite: '平角 180°；等腰三角形两底角相等，内角和 180°',
      delNow: LD2,
      add: aDBF.concat(aF, aBDF, led2(['∠DBF = 180° − 2θ', 'BF = BD ⟹ ∠F = ∠BDF = θ'])),
      front: lift2,
      eq: '∠F = θ'
    },
    {
      say: '三个条件凑齐：∠F = ∠ACD = θ，∠FAD = ∠CAD（角平分线），AD 是公共边。两角加一边，而且这一边正好是其中一角的对边。',
      cite: '∠ACD = ∠ACB = θ；∠FAD = ∠CAD；AD 公共',
      delNow: LD2,
      add: led2(['∠F = ∠ACD = θ，∠FAD = ∠CAD', 'AD = AD（公共边）']),
      front: lift2,
      eq: '∠F = ∠ACD，∠FAD = ∠CAD'
    },
    {
      say: 'AAS 判定，两个三角形全等。',
      cite: 'AAS：两角及其中一角的对边分别相等的两个三角形全等',
      delNow: LD2,
      add: [fADF, fADC].concat(led2(['⟹ △ADF ≌ △ADC（AAS）'])),
      front: lift2,
      eq: '△ADF ≌ △ADC（AAS）'
    },
    {
      say: '全等的对应边相等：AF = AC。',
      cite: '全等三角形对应边相等',
      delNow: LD2,
      add: [tkFA, tkCA].concat(led2(['AF = AC'])),
      front: lift2,
      eq: 'AF = AC'
    },
    {
      say: 'AF 本来就是 AB 加 BF，把 BF 换回 BD —— AC = AB + BD。两种解法殊途同归。',
      cite: '等量代换',
      delNow: LD2,
      add: led2(['AC = AF = AB + BF = AB + BD']),
      eq: 'AC = AB + BD',
      hold: 3800
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
    tags: ['几何', '全等', '全等模型', 'SAS', 'AAS', '截长补短', '等腰'],
    question: '△ABC 中，∠B = 2∠C，AD 平分 ∠BAC 交 BC 于 D。求证：AC = AB + BD。',
    thumbStep: 7,
    methods: [
      {
        name: '截长法 · SAS 全等 + 等角对等边', tier: 'proof',
        sub: '严格证明 · 9 步，在 AC 上截出 AE = AB',
        steps: steps1
      },
      {
        name: '补短法 · 等腰 + AAS 全等', tier: 'proof',
        sub: '严格证明 · 8 步，把 BD 接到 AB 的延长线上',
        steps: steps2
      }
    ]
  });
})();
