/* ============================================================
   试卷 26 题 · 第 (2) 问
   ------------------------------------------------------------
   题：(1) 已得 ∠F = α。若 α = 18°，用等式表示 CF、AB、BC 三条线段的数量关系，并证明。

   代入 α = 18°：∠B = ∠C = 36°，∠A = 108°，∠F = 18°。
   结论：CF = AB + BC。

   方法一（截长）：在 CF 上取 G 使 CG = AB
       △CGA ≌ △ABC（SAS）⟹ AG = BC，∠CGA = ∠CAG = 36°
       ⟹ ∠AGF = 144°、∠GAF = 18° = ∠F ⟹ AG = GF
       ⟹ CF = CG + GF = AB + BC

   方法二（补短）：延长 AB 到 T 使 BT = BC
       △CBT 等腰 ⟹ ∠BCT = 18° ⟹ ∠ACT = 54° = ∠CAF，∠CAT = 108° = ∠ACF
       ⟹ △CAT ≌ △ACF（ASA）⟹ AT = CF = AB + BC

   注意：全等给出的是 AT = CF，不是 CT = CF（CT = 399.4，CF = 339.8，两者不相等）。

   标注纪律：图上只写「算不出来的那几个数」，其余靠同色弧 + 账本。
   第 (1) 问里的 E 与 CE 在这一问的证明里用不上，图上不再画。
   ============================================================ */
(function () {
  var AN = window.ANNO, ML = window.ML;
  var COL = AN.COL, FS = AN.FS;
  var sub = AN.sub, add = AN.add, mul = AN.mul, unit = AN.unit, dist = AN.dist;

  /* ---------- 几何：B 在上、C 在下、A 在右，BC 竖直 ---------- */
  var ALPHA = 18;
  var bl = 210;
  var Bp = [440, 230], Cp = [440, 230 + bl];
  var hp = (bl / 2) * Math.tan(2 * ALPHA * AN.D2R);
  var Ap = [Bp[0] + hp, Bp[1] + bl / 2];
  var Dp = [Bp[0], Bp[1] + bl / 2];
  var O = [(Ap[0] + Bp[0] + Cp[0]) / 3, (Ap[1] + Bp[1] + Cp[1]) / 3];

  // F：过 C 作 CE 的垂线，与直线 AD 的交点（CE 是 ∠C 的平分线）
  var bisC = unit(add(unit(sub(Bp, Cp)), unit(sub(Ap, Cp))));
  var perp = [-bisC[1], bisC[0]];
  var tF = (Dp[1] - Cp[1]) / perp[1];
  var Fp = [Cp[0] + tF * perp[0], Dp[1]];
  if (Fp[0] > Bp[0]) {
    perp = [bisC[1], -bisC[0]];
    tF = (Dp[1] - Cp[1]) / perp[1];
    Fp = [Cp[0] + tF * perp[0], Dp[1]];
  }

  var AB = dist(Ap, Bp), CF = dist(Cp, Fp);
  var Gp = add(Cp, mul(unit(sub(Fp, Cp)), AB));   // CF 上，CG = AB
  var Mp = add(Bp, mul(unit(sub(Bp, Ap)), bl));   // AB 延长线上，BM = BC

  /* ---------- 图元工厂 ---------- */
  function fig(p) {
    var e = {};
    e.fill = { id: p + 'fill', k: 'poly', pts: [Ap, Bp, Cp], fill: COL.FILL, stroke: 'none' };
    e.sAB = { id: p + 'sAB', k: 'line', a: Ap, b: Bp, stroke: COL.EDGE, sw: 2.4 };
    e.sBC = { id: p + 'sBC', k: 'line', a: Bp, b: Cp, stroke: COL.EDGE, sw: 2.4 };
    e.sCA = { id: p + 'sCA', k: 'line', a: Cp, b: Ap, stroke: COL.EDGE, sw: 2.4 };
    e.sAF = { id: p + 'sAF', k: 'line', a: Ap, b: Fp, stroke: COL.EDGE, sw: 2.4 };
    e.sCF = { id: p + 'sCF', k: 'line', a: Cp, b: Fp, stroke: COL.EDGE, sw: 2.4 };

    e.nA = AN.vname(p + 'A', Ap, O);
    e.nB = AN.vname(p + 'B', Bp, O);
    e.nC = AN.vname(p + 'C', Cp, O);
    e.nD = AN.txt(p + 'nD', [Dp[0] - 16, Dp[1] + 15], 'D', { size: FS.V, weight: 700 });
    e.nF = AN.txt(p + 'nF', [Fp[0] - 26, Fp[1] + 6], 'F', { size: FS.V, weight: 700 });

    // 角标规矩：弧半径随角度大小递增；同值 = 同色同半径；数字只离弧 9px
    // 36°（蓝）—— 数字由 cap 给出，弧上不重复写
    e.aB = AN.angle(p + 'aB', Bp, Ap, Cp, 32, COL.BLUE);
    e.aC = AN.angle(p + 'aC', Cp, Bp, Ap, 28, COL.BLUE);
    // 108° 不画弧：cap 里已经写着 ∠A = 108°，account 本也给了 ∠ACF 的算法

    e.cap = AN.txt(p + 'cap', [50, 46], 'α = 18° ⟹ ∠F = 18°，∠B = ∠C = 36°，∠A = 108°',
      { size: 16, anchor: 'start' });
    return e;
  }

  // 账本放右上：这几张图占满了左半屏，底部没位置
  function ledger(p) {
    return function (lines) {
      return lines.map(function (t, i) {
        // 最长一条「∠CAF = ∠CAD = 54°，∠ACF = 90° + α = 108°」16px 时宽 357，落在 575 右缘到 932（切掉 32px）；
        // 这一步左半屏被图形占满插不进去，只能左移到 560 + 缩到 14px（实测右缘 872）。
        return AN.txt(p + 'led' + i, [560, 116 + i * 30], t, {
          size: 14, anchor: 'start',
          color: i === lines.length - 1 ? COL.RED : COL.INK
        });
      });
    };
  }
  var LD1 = ['vled0', 'vled1', 'vled2', 'vled3'];
  var LD2 = ['wled0', 'wled1', 'wled2', 'wled3'];
  var led1 = ledger('v'), led2 = ledger('w');

  function heavy(id, X, Y, color) {
    return { id: id, k: 'line', a: X, b: Y, stroke: color, sw: 6.5 };
  }

  /* ============================================================
     方法一：截长
     ============================================================ */
  var f1 = fig('v');
  var sAG = { id: 'vsAG', k: 'line', a: Ap, b: Gp, stroke: COL.EDGE, sw: 2.4 };
  var nG = AN.txt('vnG', [Gp[0] - 28, Gp[1] + 12], 'G', { size: FS.V, weight: 700 });

  var tkCG = AN.tick('vtkCG', Cp, Gp, COL.GREEN);
  var tkABC = AN.tick('vtkAB', Ap, Bp, COL.GREEN, 9, -22);
  var tkAG = AN.tick('vtkAG', Ap, Gp, COL.RED, 9, -40);
  var tkBC = AN.tick('vtkBC', Bp, Cp, COL.RED, 9, -62);
  var tkGF = AN.tick('vtkGF', Gp, Fp, COL.ORANGE, 9, 0);

  var aCGA = AN.angle('vaCGA', Gp, Cp, Ap, 30, COL.BLUE);      // = ∠B = 36°
  var aCAG = AN.angle('vaCAG', Ap, Cp, Gp, 30, COL.BLUE);      // = ∠C = 36°
  var aAGF = AN.angle('vaAGF', Gp, Ap, Fp, 54, COL.PURPLE, '144°', { size: 15, dir: 35, gap: 24 });
  var aGAF = AN.angle('vaGAF', Ap, Gp, Fp, 24, COL.ORANGE);     // 18°，数字由 cap 给出
  var aAFG = AN.angle('vaAFG', Fp, Ap, Gp, 24, COL.ORANGE);     // 同值 = 同色同半径

  var fCGA = { id: 'vfCGA', k: 'poly', pts: [Cp, Gp, Ap], fill: AN.wash('15,157,88', 0.15), stroke: 'none' };
  var fABC = { id: 'vfABC', k: 'poly', pts: [Ap, Bp, Cp], fill: AN.wash('15,157,88', 0.15), stroke: 'none' };

  var lift1 = ['vsAB', 'vsBC', 'vsCA', 'vsAF', 'vsCF', 'vsAG',
               'vaB', 'vaC', 'vaCGA', 'vaCAG', 'vaAGF', 'vaGAF', 'vaAFG'];

  var steps1 = [
    {
      say: 'α = 18° 代进去：∠B = ∠C = 36°，∠A = 180° − 4α = 108°。第 (1) 问还给了一个数：∠F = α = 18°。这一问用不到 E，图上就不画 CE 了。',
      cite: 'α = 18° ⟹ ∠B = ∠C = 2α = 36°，∠A = 108°；由第 (1) 问 ∠F = α = 18°',
      add: [f1.fill, f1.sAB, f1.sBC, f1.sCA, f1.sAF, f1.sCF,
            f1.nA, f1.nB, f1.nC, f1.nD, f1.nF]
        .concat(f1.aB, f1.aC, [f1.cap]),
      eq: '∠B = ∠C = 36°，∠A = 108°'
    },
    {
      say: '要证的等式是 CF = AB + BC。CF 是三条里最长的，AB 和 BC 分居两处 —— 又是「整体 = 两段之和」，所以还是截长补短。',
      cite: '要证的等式：CF = AB + BC（整体在 CF 上，两段碎片在别处）',
      delNow: LD1,
      add: [heavy('vhlCF', Cp, Fp, COL.BLUE)].concat(led1(['要证：CF = AB + BC'])),
      front: lift1,
      eq: 'CF = AB + BC'
    },
    {
      say: '截长：在 CF 上取 G，使 CG = AB。剩下的 GF 只要能等于 BC，就赢了。',
      cite: '截长法：在长线段上截取一段等于另一条已知线段',
      delNow: LD1,
      add: [sAG, nG, tkCG, tkABC].concat(led1(['截长：CG = AB', '只要再证 GF = BC'])),
      front: lift1,
      eq: 'CG = AB'
    },
    {
      say: '连 AG。G 在 CF 上，所以 ∠GCA 就是 ∠FCA = 90° + α = 108°；而 ∠BAC 也是 108°。两边 108°，正好对上。',
      cite: '∠ACF = 90° + α（第 (1) 问的结论），α = 18° 时是 108°；∠BAC = 108°',
      delNow: LD1,
      add: led1(['∠GCA = ∠ACF = 108°', '∠BAC = 108° ⟹ ∠GCA = ∠BAC']),
      front: lift1,
      eq: '∠GCA = ∠BAC = 108°'
    },
    {
      say: '三个条件：CG = AB、∠GCA = ∠BAC、CA = AC 公共边。两边夹一角，SAS。',
      cite: 'SAS：两边及其夹角分别相等的两个三角形全等',
      delNow: LD1,
      add: [fCGA, fABC].concat(led1(['CG = AB，∠GCA = ∠BAC，CA = AC', '⟹ △CGA ≌ △ABC（SAS）'])),
      front: lift1,
      eq: '△CGA ≌ △ABC（SAS）'
    },
    {
      say: '全等的对应边角：AG = BC；∠CGA = ∠ABC = 36°；∠CAG = ∠BCA = 36°。',
      cite: '全等三角形对应边相等、对应角相等',
      delNow: LD1,
      add: [tkAG, tkBC].concat(aCGA, aCAG, led1(['AG = BC', '∠CGA = ∠ABC = 36°，∠CAG = ∠BCA = 36°'])),
      front: lift1,
      eq: 'AG = BC，∠CGA = ∠CAG = 36°'
    },
    {
      say: 'G 在 CF 上，∠AGF 与 ∠AGC 互补，是 144°。又 ∠CAF = 54°（∠A 的一半），所以 ∠GAF = 54° − 36° = 18°。',
      cite: '邻补角（G 在 CF 上）；∠CAF = ½∠BAC = 54°',
      delNow: LD1,
      add: aAGF.concat(aGAF, led1(['∠AGF = 180° − 36° = 144°', '∠GAF = 54° − 36° = 18°'])),
      front: lift1,
      eq: '∠AGF = 144°，∠GAF = 18°'
    },
    {
      say: 'G 在 CF 上，射线 FG 就是射线 FC，所以 ∠AFG 就是 ∠F = 18°。它和 ∠GAF 相等 —— 等角对等边。',
      cite: '等角对等边（△AGF 中 ∠AFG = ∠GAF ⟹ AG = GF）',
      delNow: LD1,
      add: aAFG.concat(tkGF, led1(['∠AFG = ∠F = 18° = ∠GAF', '⟹ AG = GF'])),
      front: lift1,
      eq: 'AG = GF'
    },
    {
      say: '三条都打通了：GF = AG = BC，CG = AB，加起来就是 CF = AB + BC。',
      cite: '等量代换',
      delNow: LD1,
      add: led1(['CF = CG + GF = AB + BC', 'CF = AB + BC']),
      front: lift1,
      eq: 'CF = AB + BC',
      hold: 4200
    }
  ];

  /* ============================================================
     方法二：补短
     ============================================================ */
  var f2 = fig('w');
  // B 正好落在「补短」那条红线 AM 上（A、B、M 共线），顶点字母默认没有白描边，
  // 红线会从字母上划过去（_collide3 实测 2% 段长压进 bbox）。这个副本带 halo。
  var nBhalo = Object.assign({}, f2.nB, { id: 'wnBh', halo: true });
  var sBM = { id: 'wsBM', k: 'line', a: Bp, b: Mp, stroke: COL.EDGE, sw: 2.4 };
  // △CAT 的第三边：原图只画了 A—T 的延长线，C—T 缺失，所谓「三角形」其实只有两条边
  var sCT = { id: 'wsCT', k: 'line', a: Cp, b: Mp, stroke: COL.EDGE, sw: 2.4 };
  var nMB = AN.txt('wnM', [Mp[0] - 14, Mp[1] + 26], 'T', { size: FS.V, weight: 700, anchor: 'end' });

  var tkBM = AN.tick('wtkBM', Bp, Mp, COL.ORANGE, 9, 0);
  var tkBC2 = AN.tick('wtkBC', Bp, Cp, COL.ORANGE, 9, 0);
  var tkAM = AN.tick('wtkAM', Ap, Mp, COL.RED, 9, 0);
  var tkCF2 = AN.tick('wtkCF', Cp, Fp, COL.RED, 9, 0);

  var aCBM = AN.angle('waCBM', Bp, Dp, Mp, 54, COL.PURPLE, '144°', { size: 15, gap: 40 }); // 144° 一律紫
  var aBCM = AN.angle('waBCM', Cp, Bp, Mp, 24, COL.ORANGE);      // = ∠BTC = 18°
  var aBMC = AN.angle('waBMC', Mp, Bp, Cp, 24, COL.ORANGE);
  var aACM = AN.angle('waACM', Cp, Ap, Mp, 56, COL.GREEN);      // ∠ACT = 54°，数字交给账本（那个角三面都是线，挤不下）
  var aCAF = AN.angle('waCAF', Ap, Cp, Fp, 42, COL.GREEN);       // = ∠ACT = 54°

  var fACM = { id: 'wfACM', k: 'poly', pts: [Ap, Cp, Mp], fill: AN.wash('37,99,235', 0.14), stroke: 'none' };
  var fCAF = { id: 'wfCAF', k: 'poly', pts: [Cp, Ap, Fp], fill: AN.wash('37,99,235', 0.14), stroke: 'none' };

  var lift2 = ['wsAB', 'wsBC', 'wsCA', 'wsAF', 'wsCF', 'wsBM', 'wsCT',
               'waB', 'waC', 'waCBM', 'waBCM', 'waBMC', 'waACM', 'waCAF'];

  var steps2 = [
    {
      say: '同一道题，换个方向。α = 18°，∠A = 108°，∠B = ∠C = 36°，∠F = 18°。要证的还是 CF = AB + BC。',
      cite: 'α = 18°；由第 (1) 问 ∠F = α = 18°',
      add: [f2.fill, f2.sAB, f2.sBC, f2.sCA, f2.sAF, f2.sCF,
            f2.nA, f2.nB, f2.nC, f2.nD, f2.nF]
        .concat(f2.aB, f2.aC, [f2.cap]),
      eq: 'CF = AB + BC'
    },
    {
      say: '补短：延长 AB 到 T，使 BT = BC。这样 AT = AB + BC 就成了一条线段，接下来只要证 AT = CF。',
      cite: '补短法：延长一条线段，使延长部分等于另一条已知线段',
      delNow: LD2.concat(['wB']),   // 顶点字母的真实 id 是「前缀+B」，不是 wnB
      add: [sBM, sCT, nMB, nBhalo, tkBM, tkBC2, heavy('whlAT', Ap, Mp, COL.RED)]
        .concat(led2(['补短：延长 AB 到 T，BT = BC', '只要再证 AT = CF'])),
      front: ['wsAB', 'wsBC', 'wsCA', 'wsAF', 'wsCF', 'wsBM', 'wsCT',
              'waB', 'waC'],
      eq: 'AT = AB + BC'
    },
    {
      say: 'A、B、T 共线，所以 ∠CBT = 180° − ∠ABC = 144°。又 CB = BT，等腰三角形两个底角相等，各 18°。',
      cite: '平角 180°；等腰三角形两底角相等，内角和 180°',
      delNow: LD2,
      add: aCBM.concat(aBCM, aBMC, led2(['∠CBT = 180° − 36° = 144°', 'CB = BT ⟹ ∠BCT = ∠BTC = 18°'])),
      front: lift2,
      eq: '∠BCT = 18°'
    },
    {
      say: '∠ACT 是 ∠ACB 加 ∠BCT（CB 夹在中间）：36° + 18° = 54°。',
      cite: '∠ACT = ∠ACB + ∠BCT（射线 CB 在 ∠ACT 内部）',
      delNow: LD2,
      add: aACM.concat(led2(['∠ACT = ∠ACB + ∠BCT', '= 36° + 18° = 54°'])),
      front: lift2,
      eq: '∠ACT = 54°'
    },
    {
      say: '△ACF 这边：∠CAF = 54°（∠A 的一半），∠ACF = 90° + α = 108°；而 ∠CAT = ∠CAB = 108°。',
      cite: '∠CAF = ½∠BAC；∠CAT = ∠CAB（T 在 AB 的延长线上）；∠ACF = 90° + α',
      delNow: LD2,
      add: aCAF.concat(led2(['∠CAF = ∠CAD = 54°，∠ACF = 90° + α = 108°', '∠CAT = ∠CAB = 108°'])),
      front: lift2,
      eq: '∠ACT = ∠CAF，∠CAT = ∠ACF'
    },
    {
      say: '两组角分别相等，夹边都是 AC（同一条边），ASA 判定，△CAT ≌ △ACF。',
      cite: 'ASA：两角及其夹边分别相等的两个三角形全等',
      delNow: LD2,
      add: [fACM, fCAF].concat(led2(['∠ACT = ∠CAF，AC = CA，∠CAT = ∠ACF', '⟹ △CAT ≌ △ACF（ASA）'])),
      front: lift2,
      eq: '△CAT ≌ △ACF（ASA）'
    },
    {
      say: '全等的对应边：AT = CF。',
      cite: '全等三角形对应边相等',
      delNow: LD2,
      add: [tkAM, tkCF2].concat(led2(['AT = CF'])),
      front: lift2,
      eq: 'AT = CF'
    },
    {
      say: 'AT 本来就是 AB 加 BT，把 BT 换回 BC —— CF = AB + BC。和截长法殊途同归。',
      cite: '等量代换',
      delNow: LD2,
      add: led2(['CF = AT = AB + BT = AB + BC', 'CF = AB + BC']),
      front: lift2,
      eq: 'CF = AB + BC',
      hold: 4200
    }
  ];

  /* ============================================================
     注册
     ============================================================ */
  window.MATHLAB_LESSONS = window.MATHLAB_LESSONS || [];
  window.MATHLAB_LESSONS.push({
    id: 'exam-26-2',
    title: '108° 等腰三角形：CF = AB + BC（试卷 26 · 第 2 问）',
    grade: '初二',
    topic: '几何 · 全等模型',
    tags: ['几何', '全等', 'SAS', 'ASA', '截长补短', '等腰', '角平分线'],
    question: '承第 (1) 问，若 ∠B = 2α 中的 α = 18°，用等式表示 CF、AB、BC 三条线段的数量关系，并证明。',
    thumbStep: 5,
    methods: [
      {
        name: '截长法 · 在 CF 上取 CG = AB', tier: 'proof',
        sub: '严格证明 · 9 步，SAS 全等 + 等角对等边',
        steps: steps1
      },
      {
        name: '补短法 · 延长 AB 到 T 使 BT = BC', tier: 'proof',
        sub: '严格证明 · 8 步，等腰 + ASA 全等',
        steps: steps2
      }
    ]
  });
})();
