/* ============================================================
   等腰直角三角形 · 半角平方和（旋转 90°）
   ------------------------------------------------------------
   题：等腰 Rt△ABC 中，∠A = 90°，AB = AC，D、E 在 BC 上，∠DAE = 45°。
       求证：BD² + CE² = DE²。

   方法一（把 △ABD 绕 A 转 90°，B → C）：
       旋转保长 ⟹ CD′ = BD，AD′ = AD
       ∠D′AE = ∠D′AC + ∠CAE = ∠DAB + ∠CAE = 90° − 45° = 45° = ∠DAE
       AD′ = AD、∠D′AE = ∠DAE、AE 公共 ⟹ △AD′E ≌ △ADE（SAS）⟹ D′E = DE
       ∠D′CA = ∠ABD = 45°，∠ACB = 45°，D′ 与 B 分居 AC 两侧 ⟹ ∠D′CE = 90°
       Rt△D′CE 中 D′E² = CD′² + CE² = BD² + CE² ⟹ DE² = BD² + CE²

   方法二（把 △ACE 绕 A 转 90°，C → B）：同一招的镜像，得到 Rt△E′BD
       ⟹ DE′² = BE′² + BD² = CE² + BD²，而 DE′ = DE。

   几何已由 _design_new.mjs 验算：
       BD=149.434 CE=178.088 DE=232.478，BD²+CE² 与 DE² 差 < 2e-4
       D′=(730,250.566) 满足 CD′ = BD；E′=(170,221.912) 满足 BE′ = CE

   角标纪律：直角符号一律 14px 标在角的顶点；等长一族同色（BD/CD′ 红，CE/BE′ 绿）。
   ============================================================ */
(function () {
  var AN = window.ANNO, ML = window.ML;
  var COL = AN.COL, FS = AN.FS;
  var sub = AN.sub, add = AN.add, mul = AN.mul, unit = AN.unit, dist = AN.dist, mid = AN.mid;

  /* ---------- 几何 ----------
     A 在顶，BC 水平。等腰直角 ⟹ A 落在 BC 的中垂线上，高 = BC/2。
     BC = 560、高 280：D′ 正好落在 C 的正上方（和 C 同 x），画面很干净。 */
  var A = [450, 120], B = [170, 400], C = [730, 400];
  var ALPHA = 20;                                  // ∠BAD
  var ONE = Math.PI / 180;

  function rayHitBC(deg) {                         // 从 A 沿数学角 deg 出发的射线 ∩ 直线 BC
    var d = ML.pt(A[0], A[1], 1, deg);
    var t = (B[1] - A[1]) / (d[1] - A[1]);
    return [ML.round1(A[0] + t * (d[0] - A[0])), B[1]];
  }
  var aAB = ML.angOf(A, B);                        // 225°
  var D = rayHitBC(aAB + ALPHA);                   // (319.4, 400)
  var E = rayHitBC(aAB + ALPHA + 45);              // (551.9, 400)

  // 绕 A 转 90°（数学角正向 = 屏幕视觉顺时针）：(dx,dy) → (dy,−dx)
  function rot90(P) { var d = sub(P, A); return [ML.round1(A[0] + d[1]), ML.round1(A[1] - d[0])]; }
  function rotN90(P) { var d = sub(P, A); return [ML.round1(A[0] - d[1]), ML.round1(A[1] + d[0])]; }
  var Dp = rot90(D);                               // (730, 250.6)  C 正上方
  var Ep = rotN90(E);                              // (170, 221.9)  B 正上方

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
        return AN.txt(p + 'led' + i, [60, (start || 452) + i * 28], t, {
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
    e.sAD = line(p + 'sAD', A, D);
    e.sAE = line(p + 'sAE', A, E);

    e.nA = AN.vname(p + 'A', A, O);
    e.nB = AN.vname(p + 'B', B, O);
    e.nC = AN.vname(p + 'C', C, O);
    // D、E 压在 BC 上，字母往正下方放；x 与账本错开，不会撞
    e.nD = AN.txt(p + 'D', [D[0], 428], 'D', { size: FS.V, weight: 700 });
    e.nE = AN.txt(p + 'E', [E[0], 428], 'E', { size: FS.V, weight: 700 });

    e.cD = { id: p + 'cD', k: 'circ', c: D, r: 4.2, fill: COL.INK, stroke: 'none' };
    e.cE = { id: p + 'cE', k: 'circ', c: E, r: 4.2, fill: COL.INK, stroke: 'none' };

    // ∠A = 90°（两条直角边 AB、AC 张成）
    e.rtA = AN.right(p + 'rtA', A, sub(B, A), sub(C, A), 14, COL.INK);
    // ∠DAE = 45°：两条边是 AD、AE，角平分线几乎正下方，标签放角内不压线
    e.aDAE = AN.angle(p + 'aDAE', A, D, E, 56, COL.PURPLE, '45°', { gap: 26, size: FS.NOTE });
    return e;
  }

  /* ============================================================
     方法一：旋转 △ABD（B → C）
     ============================================================ */
  var f1 = fig('v');

  // 要转的那一块：poly 同时有 fill 和 stroke，旋转时整块跟着走
  var fABD = {
    id: 'vfABD', k: 'poly', pts: [A, B, D],
    fill: AN.wash('34,197,94', 0.24), stroke: COL.GREEN, sw: 3.2,
    origin: A
  };
  var nDp = AN.txt('vnDp', [Dp[0] + 28, Dp[1] + 4], 'D′', { size: FS.V, weight: 700, anchor: 'start', color: COL.GREEN });
  var tkCDp = AN.tick('vtkCDp', C, Dp, COL.RED);
  var tkBD = AN.tick('vtkBD', B, D, COL.RED, 9, -16);
  var tkCE = AN.tick('vtkCE', C, E, COL.RED, 9, 16);
  var tkDE = AN.tick('vtkDE', D, E, COL.PURPLE);
  var heavyDpE = heavy('vhDpE', Dp, E, COL.PURPLE);
  var heavyDE = heavy('vhDE', D, E, COL.PURPLE);

  // 旋转块 vfABD 必须也在 front 名单里：它旋转后会与原图 AC、BC 重合，
  // 只要某一步 front 把它漏掉，2.4px 的深色细线就会重新压到 3.2px 绿边上
  var lift1 = ['vsAB', 'vsBC', 'vsCA', 'vsAD', 'vsAE',
               'vnA', 'vnB', 'vnC', 'vnD', 'vnE', 'vcD', 'vcE', 'vrtA', 'vaDAE', 'vaDAEt',
               'vfABD', 'vhDpE', 'vhDE'];
  var LD1 = ['vled0', 'vled1', 'vled2'];

  var steps1 = [
    {
      say: '等腰直角三角形 ABC，∠A 是直角，AB 等于 AC。D、E 两点落在斜边 BC 上，而且 ∠DAE 是 45° —— 正好是顶角的一半，这就是「半角」。要证的是 BD 平方加 CE 平方，等于 DE 平方。',
      cite: '题设：AB = AC，∠BAC = 90°，∠DAE = 45°',
      add: [f1.fill, f1.sAB, f1.sBC, f1.sCA, f1.sAD, f1.sAE,
            f1.nA, f1.nB, f1.nC, f1.nD, f1.nE, f1.cD, f1.cE, f1.rtA]
        .concat(led('v')(['已知 AB = AC，∠A = 90°', 'D、E 在 BC 上，∠DAE = 45°', '求证 BD² + CE² = DE²'])),
      eq: '求证 BD² + CE² = DE²'
    },
    {
      say: '先看懂要证的东西长什么样：三条线段都带着平方，这不是「线段和」，而是勾股定理的形状。两条直角边的平方和等于斜边的平方，所以得先有一座直角三角形。',
      cite: '勾股定理：直角三角形两条直角边平方和等于斜边平方',
      delNow: LD1,
      add: f1.aDAE.concat(led('v')(['平方和 ⟹ 勾股定理', 'BD、CE 要当两条直角边'])),
      front: lift1,
      eq: 'BD² + CE² ⟹ 找直角三角形'
    },
    {
      say: '麻烦在于 BD、CE、DE 全躺在同一条直线 BC 上。共线的三条线段凑不成三角形，先得把 BD 和 CE 从这个方向搬走 —— 搬到互相垂直的位置去。',
      cite: '目标：把 BD、CE 移成同一个直角三角形的两条直角边',
      delNow: LD1,
      add: led('v')(['三段都在 BC 上，凑不成三角形', '把 BD、CE 搬到互相垂直']),
      front: lift1,
      eq: '搬线段：让 BD ⊥ CE'
    },
    {
      say: '搬的办法是旋转。把三角形 ABD 整个绕 A 点转 90°，因为 AB 等于 AC、∠BAC 正好是 90°，所以 B 点转过去恰好落在 C 上，D 点落到 D 撇。',
      cite: '旋转：绕 A 转 90°，AB = AC 且 ∠BAC = 90° ⟹ B 落在 C',
      delNow: LD1,
      add: [fABD].concat(led('v')(['△ABD 绕 A 转 90°', 'B 落在 C 上，D 落在 D′'])),
      front: lift1.concat(['vfABD']),
      eq: '△ABD → △ACD′'
    },
    {
      say: '转过去之后：CD 撇就等于 BD，AD 撇就等于 AD，旋转不改变长度。注意红刻度 —— 现在 BD 的两份分别长在 B 侧和 C 侧。',
      cite: '旋转是保距变换：对应线段相等',
      delNow: LD1,
      upd: [{ id: 'vfABD', rot: 90 }],
      add: [nDp, tkCDp, tkBD].concat(led('v')(['CD′ = BD（旋转保长）', 'AD′ = AD'])),
      front: lift1.concat(['vfABD', 'vtkCDp', 'vtkBD']),
      eq: 'CD′ = BD'
    },
    {
      say: '下一步算 ∠D 撇 A E。它等于 ∠D 撇 A C 加上 ∠C A E。而旋转保角，∠D 撇 A C 就是 ∠DAB。所以它等于 ∠DAB 加 ∠CAE。',
      cite: '旋转保角；∠D′AE = ∠D′AC + ∠CAE',
      delNow: LD1,
      add: f1.aDAE.concat(led('v')(['∠D′AE = ∠D′AC + ∠CAE', '= ∠DAB + ∠CAE'])),
      front: lift1,
      eq: '∠D′AE = ∠DAB + ∠CAE'
    },
    {
      say: '而 ∠DAB、∠DAE、∠CAE 三块拼起来就是整个顶角 90°，其中 ∠DAE 占了 45°，剩下的 ∠DAB 加 ∠CAE 就也是 45°。所以 ∠D 撇 A E 等于 45°，和 ∠DAE 一样大。',
      cite: '∠DAB + ∠CAE = 90° − ∠DAE = 45°',
      delNow: LD1,
      add: led('v')(['∠DAB + 45° + ∠CAE = 90°', '⟹ ∠DAB + ∠CAE = 45°', '⟹ ∠D′AE = 45°']),
      front: lift1,
      eq: '∠D′AE = 45° = ∠DAE'
    },
    {
      say: '现在有两个三角形，AD 撇 E 和 A D E：AD 撇等于 AD，夹角都是 45°，AE 是公共边。边角边，两个三角形全等，所以 D 撇 E 等于 DE。',
      cite: 'SAS：AD′ = AD，∠D′AE = ∠DAE，AE 公共',
      delNow: LD1,
      add: [heavyDpE, heavyDE].concat(led('v')(['AD′ = AD，∠D′AE = ∠DAE', 'AE 公共 ⟹ △AD′E ≌ △ADE', '⟹ D′E = DE'])),
      front: lift1.concat(['vhDpE', 'vhDE']),
      eq: 'D′E = DE'
    },
    {
      say: '还差一个直角。∠D 撇 C A 等于 ∠ABD，都是 45° —— 这是旋转保角给的。而 ∠ACB 也是 45°。D 撇和 B 分居 AC 两侧，所以两个 45° 一加，∠D 撇 C E 就是 90°。',
      cite: '旋转保角 ∠D′CA = ∠ABD = 45°；∠ACB = 45°，两角拼成 90°',
      delNow: LD1,
      add: [AN.right('vrtC', C, sub(Dp, C), sub(E, C), 14, COL.RED)]
        .concat(led('v')(['∠D′CA = ∠ABD = 45°', '∠ACB = 45°', '⟹ ∠D′CE = 90°'])),
      front: lift1,
      eq: '∠D′CE = 90°'
    },
    {
      say: '直角三角形 D 撇 C E 有了。勾股定理：斜边 D 撇 E 的平方，等于两条直角边 CD 撇和 CE 的平方和。把前面证过的等量代进去 —— CD 撇是 BD，D 撇 E 是 DE。',
      cite: '勾股定理；等量代换',
      delNow: LD1,
      add: [tkCE, tkDE].concat(led('v')(['Rt△D′CE：D′E² = CD′² + CE²', 'CD′ = BD，D′E = DE', '⟹ DE² = BD² + CE²'])),
      front: lift1.concat(['vhDpE', 'vhDE', 'vtkCE', 'vtkDE']),
      eq: 'DE² = BD² + CE²',
      hold: 4200
    }
  ];

  /* ============================================================
     方法二：旋转 △ACE（C → B）
     ============================================================ */
  var f2 = fig('w');
  var fACE = {
    id: 'wfACE', k: 'poly', pts: [A, C, E],
    fill: AN.wash('234,88,12', 0.22), stroke: COL.ORANGE, sw: 3.2,
    origin: A
  };
  var nEp = AN.txt('wnEp', [Ep[0] - 26, Ep[1] + 4], 'E′', { size: FS.V, weight: 700, anchor: 'end', color: COL.ORANGE });
  var tkBEp = AN.tick('wtkBEp', B, Ep, COL.GREEN, 9, 16);
  var tkCE2 = AN.tick('wtkCE2', C, E, COL.GREEN, 9, -16);
  var tkBD2 = AN.tick('wtkBD2', B, D, COL.RED, 9, -16);
  var tkDE2 = AN.tick('wtkDE', D, E, COL.PURPLE);
  var heavyDEp = heavy('whDEp', D, Ep, COL.PURPLE);
  var heavyDE2 = heavy('whDE2', D, E, COL.PURPLE);

  var lift2 = ['wsAB', 'wsBC', 'wsCA', 'wsAD', 'wsAE',
               'wnA', 'wnB', 'wnC', 'wnD', 'wnE', 'wcD', 'wcE', 'wrtA', 'waDAE', 'waDAEt',
               'wfACE', 'whDEp', 'whDE2'];
  var LD2 = ['wled0', 'wled1', 'wled2', 'wled3'];

  var steps2 = [
    {
      say: '同一个题，换个方向搬：这次不动 BD，改成把三角形 ACE 绕 A 转 90°，让 C 点落到 B 上，E 点落到 E 撇。',
      cite: '旋转：绕 A 转 90°，AC = AB 且 ∠CAB = 90° ⟹ C 落在 B',
      add: [f2.fill, f2.sAB, f2.sBC, f2.sCA, f2.sAD, f2.sAE,
            f2.nA, f2.nB, f2.nC, f2.nD, f2.nE, f2.cD, f2.cE, f2.rtA]
        .concat(f2.aDAE, led('w')(['换个转法：△ACE 绕 A 转 90°', 'C → B，E → E′'])),
      front: lift2,
      eq: '△ACE → △ABE′'
    },
    {
      say: '转完先看长度：BE 撇等于 CE，AE 撇等于 AE。绿刻度标出的这两段，就是从 CE 搬过来的。',
      cite: '旋转是保距变换：BE′ = CE，AE′ = AE',
      delNow: ['wled0', 'wled1', 'wled2', 'wled3'],
      add: [fACE, nEp, tkBEp, tkCE2].concat(led('w')(['BE′ = CE（旋转保长）', 'AE′ = AE'])),
      front: lift2.concat(['wfACE', 'wtkBEp', 'wtkCE2']),
      eq: 'BE′ = CE'
    },
    {
      say: '再算角。∠D A E 撇等于 ∠DAB 加 ∠BAE 撇，而 ∠BAE 撇就是 ∠CAE。所以它等于 ∠DAB 加 ∠CAE，前面算过是 45° —— 和 ∠DAE 一样大。',
      cite: '旋转保角；∠DAE′ = ∠DAB + ∠CAE = 45°',
      delNow: ['wled0', 'wled1', 'wled2'],
      upd: [{ id: 'wfACE', rot: -90 }],
      add: led('w')(['∠DAE′ = ∠DAB + ∠BAE′', '= ∠DAB + ∠CAE = 45°']),
      front: lift2.concat(['wfACE']),
      eq: '∠DAE′ = 45° = ∠DAE'
    },
    {
      say: '于是三角形 A D E 撇和三角形 A D E：AD 公共、夹角都是 45°、AE 撇等于 AE。边角边，全等，DE 撇等于 DE。',
      cite: 'SAS：AD 公共，∠DAE′ = ∠DAE，AE′ = AE',
      delNow: ['wled0', 'wled1'],
      add: [heavyDEp, heavyDE2].concat(led('w')(['△ADE′ ≌ △ADE（SAS）', '⟹ DE′ = DE'])),
      front: lift2.concat(['whDEp', 'whDE2']),
      eq: 'DE′ = DE'
    },
    {
      say: '直角这边同理：∠E 撇 B A 等于 ∠ECA，都是 45°，加上 ∠ABC 的 45°，而 E 撇和 C 分居 AB 两侧，所以 ∠E 撇 B D 是 90°。',
      cite: '旋转保角 ∠E′BA = ∠ECA = 45°；∠ABC = 45° ⟹ ∠E′BD = 90°',
      delNow: ['wled0', 'wled1'],
      add: [AN.right('wrtB', B, sub(Ep, B), sub(D, B), 14, COL.GREEN)]
        .concat(led('w')(['∠E′BA = ∠ECA = 45°', '∠ABC = 45° ⟹ ∠E′BD = 90°'])),
      front: lift2,
      eq: '∠E′BD = 90°'
    },
    {
      say: '直角三角形 E 撇 B D 到位。勾股：DE 撇的平方等于 BE 撇平方加 BD 平方。代进去 BE 撇是 CE、DE 撇是 DE，结论就出来了。',
      cite: '勾股定理；等量代换',
      delNow: ['wled0', 'wled1'],
      add: [tkBD2, tkDE2].concat(led('w')(['Rt△E′BD：DE′² = BE′² + BD²', 'BE′ = CE，DE′ = DE', '⟹ DE² = CE² + BD²'])),
      front: lift2.concat(['whDEp', 'whDE2', 'wtkBEp', 'wtkBD2', 'wtkDE']),
      eq: 'DE² = BD² + CE²',
      hold: 4200
    }
  ];

  window.MATHLAB_LESSONS = window.MATHLAB_LESSONS || [];
  window.MATHLAB_LESSONS.push({
    id: 'half-angle-square',
    title: '等腰直角三角形：BD² + CE² = DE²',
    grade: '初二',
    topic: '几何 · 半角模型',
    tags: ['几何', '全等模型', '旋转', '半角', '勾股定理', '等腰直角三角形'],
    question: '在等腰 Rt△ABC 中，∠A = 90°，AB = AC，D、E 是斜边 BC 上的两点，且 ∠DAE = 45°。求证：BD² + CE² = DE²。',
    thumbStep: 4,
    methods: [
      {
        name: '旋转 △ABD 90° · B 落到 C', tier: 'proof',
        sub: '严格证明 · 10 步，把 BD 搬到 C 侧，凑出 Rt△D′CE',
        steps: steps1
      },
      {
        name: '旋转 △ACE 90° · C 落到 B', tier: 'proof',
        sub: '严格证明 · 6 步，镜像转法，凑出 Rt△E′BD',
        steps: steps2
      }
    ]
  });
})();
