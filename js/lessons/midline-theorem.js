/* ============================================================
   三角形中位线定理：DE ∥ BC，DE = BC / 2
   ------------------------------------------------------------
   题：△ABC 中，D、E 分别是 AB、AC 的中点。求证 DE ∥ BC，且 DE = BC/2。

   方法一（倍长 DE 成平行四边形 —— 主证法）：
       延长 DE 至 F，使 EF = DE，连 CF
       AE = CE、∠AED = ∠CEF（对顶角）、DE = EF ⟹ △ADE ≌ △CFE（SAS）
       ⟹ AD = CF，∠DAE = ∠FCE ⟹ AD ∥ CF（内错角相等）
       D 是 AB 中点 ⟹ BD = AD = CF，且 BD ∥ CF
       ⟹ 四边形 BDCF 一组对边平行且相等 ⟹ 平行四边形
       ⟹ DF ∥ BC 且 DF = BC ⟹ DE = DF/2 = BC/2

   方法二（三条中位线切出四块全等 —— 推论）：
       取 BC 中点 M，连 DM、EM
       同理 DM ∥ AB、DM = AB/2；EM ∥ AC、EM = AC/2
       四块三角形的三边分别是 AB/2、AC/2、BC/2 ⟹ SSS 全等
       ⟹ 中位线把三角形面积四等分

   几何已由 _design_ab.mjs 验算：
       DE=(250,−5) 与 BC=(500,−10) 平行，|DE|/|BC| = 0.5
       F=(765,255)：EF=250.05=DE，AD=CF=193.003，BD=CF，DF=500.1=BC
       平移检验 B+(F−C) = D ✓（平行四边形的充要检验）
       四块边长排序后完全一致：193.003 / 201.804 / 250.05

   角标纪律：等长一族同色（中点 AD/DB 蓝、AE/EC 绿、倍长 DE/EF 紫、全等 AD/CF 橙）。
   ============================================================ */
(function () {
  var AN = window.ANNO, ML = window.ML;
  var COL = AN.COL, FS = AN.FS;
  var sub = AN.sub, add = AN.add, mul = AN.mul, unit = AN.unit, dist = AN.dist, mid = AN.mid;

  /* ---------- 几何 ---------- */
  var A = [380, 110], B = [150, 400], C = [650, 390];
  var D = mid(A, B);                              // (265, 265)
  var E = mid(A, C);                              // (515, 260)
  var F = [2 * E[0] - D[0], 2 * E[1] - D[1]];     // (765, 255)  倍长 DE
  var M = mid(B, C);                              // (400, 415)  BC 中点
  var O = [(A[0] + B[0] + C[0]) / 3, (A[1] + B[1] + C[1]) / 3];

  function line(id, X, Y, color, sw, dash) {
    return { id: id, k: 'line', a: X, b: Y, stroke: color || COL.EDGE, sw: sw || 2.4, dash: dash };
  }
  function heavy(id, X, Y, color) {
    return { id: id, k: 'line', a: X, b: Y, stroke: color, sw: 6.2 };
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
    e.sDE = line(p + 'sDE', D, E);

    e.nA = AN.vname(p + 'A', A, O);
    e.nB = AN.vname(p + 'B', B, O, 22);   // B 在左下角，只推 22 才躲得开左下角的账本
    e.nC = AN.vname(p + 'C', C, O);
    e.nD = AN.txt(p + 'D', [D[0] - 22, D[1] - 12], 'D', { size: FS.V, weight: 700, color: COL.INK });
    // E 是 DE 的中点，DE / EF / DF 三条线都在 E 处近乎水平穿过 —— 字母放上方会被划过，
    // 只能往正下方放（正好落在平行四边形底纹里，靠 halo 保持可读）
    e.nE = AN.txt(p + 'E', [E[0], E[1] + 28], 'E', { size: FS.V, weight: 700, color: COL.INK });

    e.cD = { id: p + 'cD', k: 'circ', c: D, r: 4.2, fill: COL.INK, stroke: 'none' };
    e.cE = { id: p + 'cE', k: 'circ', c: E, r: 4.2, fill: COL.INK, stroke: 'none' };
    return e;
  }

  /* ============================================================
     方法一：倍长 DE，造平行四边形
     ============================================================ */
  var f1 = fig('v');

  // 中点刻度：AD / DB 一组（蓝），AE / EC 一组（绿）
  var tkAD = AN.tick('vtkAD', A, D, COL.BLUE);
  var tkDB = AN.tick('vtkDB', D, B, COL.BLUE);
  var tkAE = AN.tick('vtkAE', A, E, COL.GREEN);
  var tkEC = AN.tick('vtkEC', E, C, COL.GREEN);
  // 倍长：DE / EF（紫，双杠）
  var tkDE = AN.tick('vtkDE', D, E, COL.PURPLE, 9, 0);
  var tkEF = AN.tick('vtkEF', E, F, COL.PURPLE, 9, 0);
  var tkDE2 = AN.tick('vtkDE2', D, E, COL.PURPLE, 9, 14);
  var tkEF2 = AN.tick('vtkEF2', E, F, COL.PURPLE, 9, 14);
  // 全等对应边 AD / CF（橙）
  var tkCF = AN.tick('vtkCF', C, F, COL.ORANGE);

  var sEF = line('vsEF', E, F, COL.PURPLE, 2.8);
  var sCF = line('vsCF', C, F, COL.ORANGE, 2.4);
  var hDF = heavy('vhDF', D, F, COL.PURPLE);

  var flADE = poly('vfADE', [A, D, E], '15,157,88', 0.26);
  var flCFE = poly('vfCFE', [C, F, E], '194,65,12', 0.20);
  var flBDCF = poly('vflBDCF', [B, D, F, C], '124,58,237', 0.10);

  var nF = AN.txt('vnF', [F[0] + 24, F[1] + 4], 'F', { size: FS.V, weight: 700, anchor: 'start', color: COL.PURPLE });
  var cF = { id: 'vcF', k: 'circ', c: F, r: 4.2, fill: COL.PURPLE, stroke: 'none' };

  // 细线在前、粗线在后：粗线必须排在 front 数组末尾，否则会被 2.4px 的细线压出脏芯
  var lift1 = ['vsAB', 'vsBC', 'vsCA', 'vsDE', 'vsEF', 'vsCF',
               'vnA', 'vnB', 'vnC', 'vnD', 'vnE', 'vcD', 'vcE',
               'vtkAD', 'vtkDB', 'vtkAE', 'vtkEC', 'vtkDE', 'vtkDE2', 'vtkEF', 'vtkEF2', 'vtkCF',
               'vfADE', 'vfCFE', 'vflBDCF', 'vhDF'];
  var LD1 = ['vled0', 'vled1', 'vled2'];

  var steps1 = [
    {
      say: '三角形 ABC，D 是 AB 的中点，E 是 AC 的中点。连起来这条 DE 叫中位线 —— 注意它连着两条边的中点。要证两件事：DE 平行于 BC，而且 DE 正好是 BC 的一半。',
      cite: '题设：D、E 分别是 AB、AC 的中点',
      add: [f1.fill, f1.sAB, f1.sBC, f1.sCA, f1.sDE,
            f1.nA, f1.nB, f1.nC, f1.nD, f1.nE, f1.cD, f1.cE]
        .concat(led('v')(['D 是 AB 中点，E 是 AC 中点', 'DE 叫中位线', '求证 DE ∥ BC，DE = BC/2'], 452)),
      eq: '求证 DE ∥ BC，DE = BC/2'
    },
    {
      say: '先把两个「中点」标出来。AD 等于 DB，AE 等于 EC —— 这两组等长是这道题全部的已知，后面每走一步都得靠它们。',
      cite: '中点定义：AD = DB，AE = EC',
      add: [tkAD, tkDB, tkAE, tkEC].concat(led('v')(['AD = DB，AE = EC', '要用的只有这两组等长'], 452)),
      front: lift1
    },
    {
      say: '要证「平行」又证「一半」，一条路是把 DE 拉长一倍，让它和一个三角形凑成全等。延长 DE 到 F，使 EF 等于 DE，再连 CF。',
      cite: '辅助线：延长 DE 至 F，使 EF = DE，连 CF',
      add: [sEF, tkEF, tkEF2, nF, cF, sCF].concat(led('v')(['延长 DE 至 F，EF = DE', '连 CF：把 DE 变长一倍'])),
      front: lift1
    },
    {
      say: '看绿色和橙色这两块。AE 等于 CE，是 E 是中点；DE 等于 EF，是我们刚造的；两个角在 E 处是对顶角。边角边，两个三角形全等。',
      cite: 'SAS：AE = CE，∠AED = ∠CEF，DE = EF ⟹ △ADE ≌ △CFE',
      add: [flADE, flCFE, tkDE, tkDE2],
      front: lift1
    },
    {
      say: '全等给出两样东西。第一是长度：AD 等于 CF。第二是角：∠DAE 等于 ∠FCE —— 这两个角是 AC 这条截线切出来的内错角，内错角相等，所以 AD 平行于 CF。',
      cite: '全等性质：AD = CF，∠DAE = ∠FCE ⟹ AD ∥ CF（内错角相等）',
      add: [tkCF].concat(led('v')(['△ADE ≌ △CFE', '⟹ AD = CF', '⟹ ∠DAE = ∠FCE ⟹ AD ∥ CF'])),
      front: lift1
    },
    {
      say: '而 AD 本来就等于 BD，因为 D 是 AB 的中点。所以 BD 也等于 CF，长度对上了；BD 还在 AD 这条线上，所以 BD 也平行于 CF。一组对边平行而且相等。',
      cite: 'D 是中点 ⟹ BD = AD = CF；BD 在 AD 所在直线上 ⟹ BD ∥ CF',
      add: led('v')(['BD = AD = CF', 'BD ∥ CF（同在 AD 直线上）', '一组对边平行且相等']),
      front: lift1
    },
    {
      say: '一组对边平行且相等的四边形是平行四边形 —— 这是平行四边形的判定。所以 B、D、F、C 四点围成的这个四边形是平行四边形，图上用紫色底纹标出来。',
      cite: '平行四边形判定：一组对边平行且相等的四边形是平行四边形',
      add: [flBDCF].concat(led('v')(['四边形 BDCF 是平行四边形', '（一组对边平行且相等）'])),
      front: lift1
    },
    {
      say: '平行四边形的对边平行且相等，所以 DF 平行于 BC，而且 DF 等于 BC。这一条先把「平行」证掉了：DE 和 DF 是同一条直线，DF 平行 BC，DE 当然也平行 BC。',
      cite: '平行四边形性质：DF ∥ BC，DF = BC',
      add: [hDF].concat(led('v')(['DF ∥ BC ⟹ DE ∥ BC', 'DF = BC'])),
      front: lift1
    },
    {
      say: '最后看长度。F 是我们按 EF 等于 DE 造出来的，所以 E 是 DF 的中点，DE 就是 DF 的一半。DF 又等于 BC，于是 DE 等于 BC 的一半。两件事全部证完。',
      cite: 'EF = DE ⟹ DE = DF/2；又 DF = BC ⟹ DE = BC/2',
      add: led('v')(['DE = DF / 2', 'DF = BC', '⟹ DE = BC/2 ✓']),
      front: lift1,
      eq: 'DE ∥ BC，DE = BC/2'
    }
  ];

  /* ============================================================
     方法二：三条中位线切出四块全等（推论）
     ============================================================ */
  var f2 = fig('w');
  var sDM = line('wsDM', D, M, COL.TEAL, 2.6);
  var sEM = line('wsEM', E, M, COL.TEAL, 2.6);
  var nDM = AN.txt('wnM', [M[0], M[1] + 30], 'M', { size: FS.V, weight: 700, color: COL.TEAL });
  var cM = { id: 'wcM', k: 'circ', c: M, r: 4.2, fill: COL.TEAL, stroke: 'none' };
  var tkBM = AN.tick('wtkBM', B, M, COL.ORANGE);
  var tkMC = AN.tick('wtkMC', M, C, COL.ORANGE);

  var flA = poly('wfA', [A, D, E], '15,157,88', 0.30);
  var flB = poly('wfB', [D, B, M], '37,99,235', 0.30);
  var flC = poly('wfC', [E, M, C], '194,65,12', 0.26);
  var flM = poly('wfM', [D, E, M], '124,58,237', 0.26);

  var lift2 = ['wsAB', 'wsBC', 'wsCA', 'wsDE', 'wsDM', 'wsEM',
               'wnA', 'wnB', 'wnC', 'wnD', 'wnE', 'wcD', 'wcE', 'wcM', 'wnM',
               'wtkAD', 'wtkDB', 'wtkAE', 'wtkEC', 'wtkBM', 'wtkMC',
               'wfA', 'wfB', 'wfC', 'wfM'];
  var LD2 = ['wled0', 'wled1', 'wled2'];

  var steps2 = [
    {
      say: '换一个角度看同一张图：如果中位线真的平行于底边，那它应该能把整个三角形切成四块一样大的小三角形。我们把 BC 的中点 M 也标出来，看一看。',
      cite: '取 BC 中点 M（辅助点）',
      add: [f2.fill, f2.sAB, f2.sBC, f2.sCA, f2.sDE,
            f2.nA, f2.nB, f2.nC, f2.nD, f2.nE, f2.cD, f2.cE, f2.nE,
            cM, nDM, tkBM, tkMC]
        .concat(led('w')(['再取 BC 中点 M', 'BM = MC'], 452)),
      eq: '猜想：中位线把三角形切成四块全等'
    },
    {
      say: '连 DM 和 EM。D 是 AB 中点、M 是 BC 中点，所以 DM 是 △ABC 的中位线；同理 EM 也是中位线。',
      cite: 'DM、EM 分别连接两边的中点，都是中位线',
      add: [sDM, sEM].concat(led('w')(['连 DM、EM', '它们也是中位线'])),
      front: lift2
    },
    {
      say: '把定理本身套一遍：DM 平行于 AC、长度是 AC 的一半；EM 平行于 AB、长度是 AB 的一半。原来的 DE 平行于 BC、长度是 BC 的一半。三条中位线各自干掉一条边的一半。',
      cite: '同理：DM = AC/2 ∥ AC，EM = AB/2 ∥ AB，DE = BC/2 ∥ BC',
      add: led('w')(['DM = AC/2，DM ∥ AC', 'EM = AB/2，EM ∥ AB', 'DE = BC/2，DE ∥ BC']),
      front: lift2
    },
    {
      say: '现在把四块三角形一块块量过去。每块的边都是「三条边各取一半」，三边对应相等，所以四块边长完全一样 —— 边边边，四块全等。',
      cite: 'SSS：四块三角形的三边都是 AB/2、AC/2、BC/2',
      add: [flA, flB, flC, flM].concat(led('w')(['四块三边对应相等', '⟹ 四块全等（SSS）'])),
      front: lift2
    },
    {
      say: '既然四块一模一样，面积当然一样大。整个三角形被平均分成四份，每份是四分之一，也就是中位线三角形 △ADE 的面积是 △ABC 的四分之一。',
      cite: '全等 ⟹ 面积相等；S△ADE = S△ABC / 4',
      add: led('w')(['四块面积相等', 'S△ADE = S△ABC / 4']),
      front: lift2
    },
    {
      say: '反过来说这条推论更好用：看到「两边中点」，就该想到三件事 —— 中位线平行底边、长度是一半、把面积切成四等份。以后遇到中点密集的题，先画中位线。',
      cite: '推论：中位线 ∥ 底边，长度是一半，且把三角形面积四等分',
      add: led('w')(['中位线三件套：', '① ∥ 底边　② = 底边/2　③ 面积四等分']),
      front: lift2,
      eq: 'DE ∥ BC，DE = BC/2，S△ADE = S△ABC / 4'
    }
  ];

  window.MATHLAB_LESSONS = window.MATHLAB_LESSONS || [];
  window.MATHLAB_LESSONS.push({
    id: 'midline-theorem',
    title: '三角形中位线定理：DE ∥ BC，DE = BC/2',
    grade: '初二',
    topic: '几何 · 中点模型',
    tags: ['中点', '中位线', '全等', '平行四边形', '中点模型'],
    question: '△ABC 中，D、E 分别是 AB、AC 的中点。求证：DE ∥ BC，且 DE = BC/2。',
    thumbStep: 3,
    methods: [
      { name: '倍长 DE 成平行四边形', tier: 'proof', steps: steps1 },
      { name: '三条中位线切四块', tier: 'corollary', steps: steps2 }
    ]
  });
})();
