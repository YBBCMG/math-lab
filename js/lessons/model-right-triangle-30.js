/* ============================================================
   几何模型课 · 含三十度角的直角三角形
   「三十度角所对的直角边，等于斜边的一半」
   ------------------------------------------------------------
   题面（不绑定某张试卷）：在 Rt△ABC 中，∠C = 90°，∠A = 30°。
     求证：BC = AB/2。

   两条独立证法都要讲（这才是模型课的价值）：

   ① 拼接法（倍长直角边）：
      延长 BC 至 D 使 CD = BC，连 AD。
      C 是 BD 中点、AC ⊥ BD ⟹ AC 垂直平分 BD ⟹ AD = AB；
      又 ∠ABD = ∠ABC = 60°（D、C、B 共线，从 B 看出去 C 与 D 同向）
      ⟹ △ABD 是等边三角形 ⟹ BD = AB；
      而 BD = 2BC ⟹ 2BC = AB ⟹ BC = AB/2。
      这条链只用「垂直平分线 + 有一个六十度角的等腰三角形是等边」，
      不依赖斜边中线定理，所以它是独立的一条。

   ② 斜边中线法：
      取 AB 中点 M，连 CM ⟹ CM = AB/2 = AM = MB（直角三角形斜边中线定理）；
      AM = CM ⟹ △ACM 等腰 ⟹ ∠MCA = ∠A = 30°；
      ∠ACB = 90° ⟹ ∠MCB = 90° − 30° = 60°；
      CM = MB + ∠MCB = 60° ⟹ △CMB 等边 ⟹ BC = CM = AB/2。

   ③ 由此得三边比：BC : AC : AB = 1 : √3 : 2
      （AC² = AB² − BC² = 3AB²/4 ⟹ AC = (√3/2)·AB）。

   ④ 逆命题（用斜边中线法逆推）：
      已知 Rt△ 中 BC = AB/2；CM = MB = AB/2 ⟹ CM = MB = BC
      ⟹ △CMB 等边 ⟹ ∠B = 60° ⟹ ∠A = 90° − 60° = 30°。
      —— 讲这一步时先把 A 处 30°、B 处 60° 的角标撤掉：
         逆命题里它们不是已知，而是待证的结论（防循环论证）。

   ------------------------------------------------------------
   几何（屏幕坐标，y 向下）：
     C = (300, 448) 直角顶点；B = (500, 448) 水平向右，BC = 200；
     A = (300, 101.59) 竖直向上，AC = BC·√3 = 346.410；
     D = (100, 448)（延长 BC 至 D，CD = BC）；
     M = (400, 274.795)（AB 中点）。
     由此 AB = 400，BC/AB = 0.5，AC/AB = √3/2 —— 图本身就是 1:√3:2。

   版面预算（画布 900×520）：
     · 图形连字母撑 x∈[63,532]、y∈[58,486]，四边余量左 63 / 右 368 / 上 58 / 下 34；
     · 右侧 x=555 起是账本栏，y=176 起、行距 34、最多 5 行（→176..312），
       与图形右缘（B 的字母右边界 530）留 25px；
     · 左上角 (40,40) 放模型名 —— 该处唯一空档（A 的字母在 y≈60 以下）。

   标注纪律：
     · 顶点字母一律 AN.vname 沿「重心→顶点」外推算出来，不手填；
       M 在斜边上，重心外推方向恰好贴着 AB 本身，所以 M 的字母手放到
       AB 的外法向一侧（M + 26·n），否则字母会压在自己的边上；
     · 等长用 tick（短横线），一族记号一个颜色：
       拼接法的 BC = CD 用红，AD = AB 用紫，斜边中线的 AM = MB = CM = BC 用绿；
     · 30° 一族同色（紫）：A 处带数字，C 处的 ∠MCA 只给弧，靠同色表示也是三十度；
       60° 一族同色（蓝）：B 处带数字，C 处的 ∠MCB 带数字；
       C 处两道弧同半径（52），相邻拼成 90°，读作「直角被切成三十加六十」；
     · 直角符号统一 14px：C 处右侧（∠ACB，墨色）+ 左侧（∠ACD，蓝色）；
     · 半透明色块只用 rgba 填充、不描边，加完用 front 把线、记号、字母顶回去；
     · 粗线（6.5px 答案线）必须排在该步 front 数组的末尾段、且在小刻度之前，
       否则 2.4px 的深色边线会被顶到粗线上面，画面出现「深色芯」的脏线。
   ============================================================ */
(function () {
  var AN = window.ANNO, ML = window.ML;
  var COL = AN.COL, FS = AN.FS;
  var sub = AN.sub, add = AN.add, mul = AN.mul, unit = AN.unit, mid = AN.mid;

  var V3 = Math.sqrt(3);
  var DEG = Math.PI / 180;
  function R(p) { return [Math.round(p[0] * 1000) / 1000, Math.round(p[1] * 1000) / 1000]; }

  /* ---------- 几何：由题设两个角定死，派生点全部算出来 ---------- */
  var K = 200;                                    // BC 的像素长
  var C = [300, 448];                             // 直角顶点
  var B = [500, 448];                             // BC 水平
  var A = R([300, 448 - K * V3]);                 // AC = BC·√3 = 346.410 → A=(300,101.59)
  var D = R([300 - K, 448]);                      // 延长 BC 至 D，CD = BC
  var M = R(mid(A, B));                           // AB 中点 (400, 274.795)

  var G = [(A[0] + B[0] + C[0]) / 3, (A[1] + B[1] + C[1]) / 3];   // 重心（字母外推用）
  var uAB = unit(sub(B, A));
  var nAB = [uAB[1], -uAB[0]];                    // AB 的外法向（指向三角形外侧、右上方）

  /* ---------- 图元工厂 ---------- */
  function ln(id, X, Y, color, sw, dash) {
    return { id: id, k: 'line', a: X, b: Y, stroke: color || COL.EDGE, sw: sw || 2.4, dash: dash };
  }
  function heavy(id, X, Y, color) {
    return { id: id, k: 'line', a: X, b: Y, stroke: color || COL.RED, sw: 6.5 };
  }
  function poly(id, pts, rgb, a) {
    return { id: id, k: 'poly', pts: pts, fill: AN.wash(rgb, a == null ? 0.10 : a), stroke: 'none' };
  }

  /* ---------- 底图 ---------- */
  var fTri = { id: 'fTri', k: 'poly', pts: [A, B, C], fill: COL.FILL, stroke: 'none' };
  var sAB = ln('sAB', A, B);
  var sBC = ln('sBC', B, C);
  var sCA = ln('sCA', C, A);

  // C 处两个直角：右侧是 ∠ACB（墨色），左侧是 ∠ACD（蓝色）
  var rtC = AN.right('rtC', C, sub(A, C), sub(B, C), 14, COL.INK);
  var rtCD = AN.right('rtCD', C, sub(D, C), sub(A, C), 14, COL.BLUE);

  // 顶点字母：沿「重心→顶点」外推
  var vA = AN.vname('vA', A, G);
  var vB = AN.vname('vB', B, G);
  var vC = AN.vname('vC', C, G);
  var vD = AN.vname('vD', D, G);
  // M 在斜边 AB 上：重心外推方向正好与 AB 重合，字母会压在自己的边上，改走外法向
  var vM = AN.txt('vM', R(add(M, mul(nAB, 26))), 'M', { size: FS.V, weight: 700, halo: false });

  /* ---------- 角标 ---------- */
  var wA = ML.wedge(A, B, C);          // A 处：AC 与 AB 张成的 30°
  var wB = ML.wedge(B, A, C);          // B 处：BA 与 BC 张成的 60°
  var wMCA = ML.wedge(C, M, A);        // C 处上半：∠MCA = 30°
  var wMCB = ML.wedge(C, M, B);        // C 处下半：∠MCB = 60°

  var R_A = 70, R_B = 78, R_C = 52;    // 半径随角度递增：30° → 52/70，60° → 78

  var aA30 = AN.arc('aA30', A, B, C, R_A, COL.PURPLE, 2.4);
  var aA30t = AN.txt('aA30t', ML.pt(A[0], A[1], R_A + 30, ML.midDir(wA)), '30°',
    { size: FS.NOTE, color: COL.PURPLE, weight: 700, halo: false });

  var aB60 = AN.arc('aB60', B, A, C, R_B, COL.BLUE, 2.4);
  var aB60t = AN.txt('aB60t', ML.pt(B[0], B[1], R_B + 27, ML.midDir(wB)), '60°',
    { size: FS.NOTE, color: COL.BLUE, weight: 700, halo: false });

  // C 处两道弧同半径、相邻：合起来就是那个直角，切成一上一下三十与六十。
  // ∠MCA 不写数字 —— 它和 A 处的 30° 同色同值，靠颜色认；一个值只写一次数字。
  var aMCA = AN.arc('aMCA', C, M, A, R_C, COL.PURPLE, 2.2);
  var aMCB = AN.arc('aMCB', C, M, B, R_C, COL.BLUE, 2.2);
  var aMCBt = AN.txt('aMCBt', ML.pt(C[0], C[1], R_C + 26, ML.midDir(wMCB)), '60°',
    { size: FS.NOTE, color: COL.BLUE, weight: 700, halo: false });

  /* ---------- 证法一：拼接（倍长直角边） ---------- */
  var sCD = ln('sCD', C, D, COL.GREY, 2.2, [7, 5]);       // 延长段，虚线才是「新造出来的」
  var sAD = ln('sAD', A, D, COL.TEAL, 2.6);
  var dD = { id: 'dD', k: 'circ', c: D, r: 4.2, fill: COL.TEAL, stroke: 'none' };
  var fABD = poly('fABD', [A, B, D], '37,99,235', 0.10);

  var tkBC1 = AN.tick('tkBC1', B, C, COL.RED);            // C 平分 BD：BC = CD
  var tkCD1 = AN.tick('tkCD1', C, D, COL.RED);
  var tkAD5 = AN.tick('tkAD5', A, D, COL.PURPLE);         // 垂直平分线 ⟹ AD = AB
  var tkAB5 = AN.tick('tkAB5', A, B, COL.PURPLE);

  var hlBD = heavy('hlBD', D, B, COL.RED);                // 结论：BD = 2BC = AB
  var hlAB = heavy('hlAB', A, B, COL.RED);

  /* ---------- 证法二：斜边中线 ---------- */
  var sCM = ln('sCM', C, M, COL.TEAL, 2.6);
  var dM = { id: 'dM', k: 'circ', c: M, r: 4.2, fill: COL.TEAL, stroke: 'none' };
  var fCMB = poly('fCMB', [C, M, B], '15,157,88', 0.10);

  var tkAM = AN.tick('tkAM', A, M, COL.GREEN);            // AM = MB = CM = BC 一族
  var tkMB = AN.tick('tkMB', M, B, COL.GREEN);
  var tkCM = AN.tick('tkCM', C, M, COL.GREEN);
  var tkBC2 = AN.tick('tkBC2', B, C, COL.GREEN);

  /* ---------- 三边比那一帧的边上数字 ---------- */
  var rBC = AN.txt('rBC', [400, 478], '1', { size: FS.SIDE, color: COL.PURPLE, weight: 700, halo: false });
  var rAC = AN.txt('rAC', [262, 274.795], '√3', { size: FS.SIDE, color: COL.PURPLE, weight: 700, halo: false });
  var rAB = AN.txt('rAB', R(add(M, mul(nAB, 40))), '2', { size: FS.SIDE, color: COL.PURPLE, weight: 700, halo: false });

  /* ---------- 模型名（左上角唯一空档；不写 anchor:'start' 会以 x=40 为中心左半边出画布） ---------- */
  var cap = AN.txt('cap', [40, 40], '模型 · 含三十度角的直角三角形',
    { size: 15, color: COL.INK, weight: 700, anchor: 'start', halo: false });

  /* ---------- 右侧账本栏 ---------- */
  var LX = 555, LY = 176, LH = 34;
  var ALL_LED = [];       // 全部账本行的 id：每步 delNow 先全清再写自己的，
                          // 少写一个 id 就会留下一行「上一步的话」，比漏删更难查
  function led(step, i, text, o) {
    o = o || {};
    var id = 'ld' + step + i;
    ALL_LED.push(id);
    return AN.txt(id, [LX, LY + i * LH], text, {
      size: o.size || 16, color: o.color || COL.INK, weight: o.weight || 600,
      anchor: 'start', halo: false
    });
  }

  /* ---------- 置顶顺序（数组越靠后越上层） ----------
     粗线写在细线/边之后、小刻度之前：粗线要在边上面，刻度要在粗线上面。 */
  var LIFT1 = ['sAB', 'sBC', 'sCA', 'hlBD', 'hlAB', 'sCD', 'sAD', 'rtC', 'rtCD',
    'aA30', 'aA30t', 'aB60', 'aB60t',
    'tkBC1', 'tkCD1', 'tkAD5', 'tkAB5',
    'dD', 'vA', 'vB', 'vC', 'vD', 'cap'];

  var LIFT2 = ['sAB', 'sBC', 'sCA', 'rtC', 'sCM',
    'aA30', 'aA30t', 'aB60', 'aB60t', 'aMCA', 'aMCB', 'aMCBt',
    'tkAM', 'tkMB', 'tkCM', 'tkBC2',
    'dM', 'vA', 'vB', 'vC', 'vM', 'cap'];

  /* ============================================================
     讲稿
     ============================================================ */
  var steps = [

    /* 1 认图：先说它是什么，再给名字 */
    {
      say: '先认图。下面横着躺着一条边，从它的右端竖着立起来另一条边，这两条边在这儿围出一个直角，图上那个方方正正的小记号就是直角记号，这个拐角叫 C。横着的那条边从 C 向右伸到 B，竖着的那条边从 C 向上伸到 A。A 处这个角是题目给的三十度。要证的是：三十度正对着的那条边 BC，长度等于斜边 AB 的一半。',
      cite: '题设：Rt△ABC 中，∠C = 90°，∠A = 30°；求证 BC = AB/2',
      add: [fTri, sAB, sBC, sCA, rtC, aA30, aA30t, vA, vB, vC, cap]
        .concat(led(1, 0, '已知：∠C = 90°，∠A = 30°'), led(1, 1, '求证：BC = AB/2')),
      eq: '求证：BC = AB/2'
    },

    /* 2 把第三个角补出来：六十度（后面两次要用） */
    {
      say: '先把第三个角补出来。三角形三个内角加起来是一百八十度，直角占掉九十度，A 处再占掉三十度，剩下归 B，等于六十度。B 处这道蓝色的弧，弧上标的就是这个六十度。这个六十度后面要用两次，先记住它。',
      cite: '三角形内角和 180°：∠B = 180° − ∠C − ∠A = 180° − 90° − 30° = 60°',
      add: [aB60, aB60t].concat(led(2, 0, '∠B = 180° − 90° − 30°'), led(2, 1, '= 60°', { color: COL.BLUE })),
      eq: '∠B = 180° − ∠C − ∠A = 60°'
    },

    /* 3 证法一动手：把短边接一倍，造出「两倍」 */
    {
      say: '第一条证法从这里开始。要证一条线段等于另一条的一半，等价于把短的那条接上一倍，看它是不是刚好等于长的。现在盯住横边 BC，从 C 继续往左边画，画出来的长度和 BC 一样，新的端点叫 D。这样整条 BD 就是两个 BC 接起来那么长。',
      cite: 'BC = AB/2 ⟺ 2BC = AB；尺规可作：延长 BC 至 D，使 CD = BC ⟹ BD = 2BC',
      delNow: ALL_LED,
      add: [sCD, sAD, dD, vD, tkBC1, tkCD1]
        .concat(led(3, 0, '延长 BC 至 D，使 CD = BC'), led(3, 1, '⟹ BD = 2BC', { color: COL.RED })),
      front: LIFT1,
      eq: '延长 BC 至 D，使 CD = BC ⟹ BD = 2BC'
    },

    /* 4 AC 是 BD 的垂直平分线 */
    {
      say: '再盯住中间这条竖着的 AC。它过 C 点，而 C 到 D 和 C 到 B 一样长，所以 C 正好是 BD 的中点。它又垂直于 BD：图上 C 处现在有两个方角，蓝色那个就是 AC 和 CD 之间的直角，因为 D、C、B 在一条直线上。一条直线既过中点、又垂直线段，它就是这条线段的垂直平分线。',
      cite: 'C 是 BD 的中点（CD = BC）；AC ⊥ BD（∠ACB = 90°，D、C、B 共线）⟹ AC 垂直平分 BD',
      delNow: ALL_LED,
      add: [rtCD].concat(
        led(4, 0, 'CD = BC ⟹ C 是 BD 的中点'),
        led(4, 1, '∠ACB = 90° ⟹ AC ⊥ BD'),
        led(4, 2, '⟹ AC 垂直平分 BD', { color: COL.RED })),
      front: LIFT1,
      eq: 'AC 垂直平分 BD'
    },

    /* 5 垂直平分线的性质：AD = AB */
    {
      say: '垂直平分线有一条很好用的性质：线上随便取一点，它到线段两端的距离都相等。A 就站在这条垂直平分线上，所以 A 到 D 和 A 到 B 一样远，也就是 AD 等于 AB。图上 AD 和 AB 各画了一道紫色的短杠，同色就表示这两条一样长。',
      cite: '线段垂直平分线上的点到线段两端距离相等 ⟹ AD = AB',
      delNow: ALL_LED,
      add: [tkAD5, tkAB5].concat(led(5, 0, 'A 在 BD 的垂直平分线上'), led(5, 1, '⟹ AD = AB', { color: COL.PURPLE })),
      front: LIFT1,
      eq: 'AD = AB'
    },

    /* 6 △ABD 等边（等腰 + 底角六十度） */
    {
      say: '接着看 B 处那个角。D、C、B 在一条直线上，从 B 往左边看出去，C 和 D 是同一个方向，所以角 ABD 就是刚才那个六十度的角 ABC，不用重新算。于是三角形 ABD 里，腰 AD 等于腰 AB，底角又是六十度。一个等腰三角形只要有一个角是六十度，三条边就全相等，它是等边三角形。',
      cite: 'AD = AB，∠ABD = ∠ABC = 60° ⟹ △ABD 是等边三角形',
      delNow: ALL_LED,
      add: [fABD].concat(
        led(6, 0, '∠ABD = ∠ABC = 60°', { color: COL.BLUE }),
        led(6, 1, 'AD = AB ⟹ △ABD 是等边三角形', { color: COL.RED })),
      front: LIFT1,
      eq: 'AD = AB 且 ∠ABD = 60° ⟹ △ABD 等边'
    },

    /* 7 结论一：2BC = AB */
    {
      say: '等边三角形三条边一样长，所以 BD 等于 AB。回头看 BD 是怎么来的：它是两个 BC 拼起来的。代进去就是两倍的 BC 等于 AB，两边同时除以二，BC 就等于 AB 的一半。第一条路走到头了，图上这两条粗红线一样长。',
      cite: '等边三角形三边相等 ⟹ BD = AB；BD = 2BC ⟹ 2BC = AB ⟹ BC = AB/2',
      delNow: ALL_LED,
      add: [hlBD, hlAB].concat(
        led(7, 0, '△ABD 等边 ⟹ BD = AB'),
        led(7, 1, 'BD = 2BC'),
        led(7, 2, '⟹ 2BC = AB，即 BC = AB/2', { color: COL.RED, weight: 700 })),
      front: LIFT1,
      eq: '2BC = BD = AB ⟹ BC = AB/2'
    },

    /* 8 证法二动手：取斜边中点 */
    {
      say: '第二条路不延长，改用中点。先把刚才那条延长线撤掉，只留原来的三角形。取斜边 AB 的中点 M，从直角顶点 C 连一条线到 M。直角三角形有个现成的结论：斜边上的中线等于斜边的一半。所以 CM、AM、MB 这三条一样长，都等于 AB 的一半，图上三道绿色短杠就是它们。',
      cite: '取 AB 的中点 M，连 CM；直角三角形斜边中线等于斜边的一半 ⟹ CM = AM = MB = AB/2',
      delNow: ['sCD', 'sAD', 'dD', 'vD', 'tkBC1', 'tkCD1', 'tkAD5', 'tkAB5',
        'fABD', 'hlBD', 'hlAB', 'rtCD'].concat(ALL_LED),
      add: [sCM, dM, vM, tkAM, tkMB, tkCM]
        .concat(led(8, 0, '取 AB 的中点 M，连 CM'), led(8, 1, 'CM = AM = MB = AB/2', { color: COL.GREEN })),
      front: LIFT2,
      eq: 'CM = AM = MB = AB/2'
    },

    /* 9 AM = CM ⟹ ∠MCA = ∠A = 30° */
    {
      say: '看左边这个小三角形 ACM。它的两条腰是 AM 和 CM，刚才已经知道这两条一样长，所以它是等腰三角形。等腰三角形的两个底角相等：A 处那个底角是三十度，顶点 C 处这个底角 MCA 也就跟着是三十度。图上 A 处和 C 处那两道同色的紫弧，标的就是这两个相等的角。',
      cite: 'AM = CM ⟹ △ACM 是等腰三角形 ⟹ ∠MCA = ∠A = 30°',
      delNow: ALL_LED,
      add: [aMCA].concat(
        led(9, 0, 'AM = CM ⟹ △ACM 等腰'),
        led(9, 1, '⟹ ∠MCA = ∠A = 30°', { color: COL.PURPLE })),
      front: LIFT2,
      eq: 'AM = CM ⟹ ∠MCA = ∠A = 30°'
    },

    /* 10 C 处直角被切成两块 ⟹ ∠MCB = 60° */
    {
      say: 'C 处那个直角，被 CM 从中间切成了两块：上面一块是角 MCA，三十度；下面一块是角 MCB。两块合起来正好是九十度，所以角 MCB 等于九十减去三十，也就是六十度。这道蓝色的弧和 B 处那道蓝色弧是同一个颜色，表示它们都是六十度。',
      cite: '∠ACB = 90° = ∠MCA + ∠MCB ⟹ ∠MCB = 90° − 30° = 60°',
      delNow: ALL_LED,
      add: [aMCB, aMCBt].concat(
        led(10, 0, '∠ACB = 90°'),
        led(10, 1, '= ∠MCA + ∠MCB'),
        led(10, 2, '⟹ ∠MCB = 90° − 30° = 60°', { color: COL.BLUE })),
      front: LIFT2,
      eq: '∠MCB = 90° − 30° = 60°'
    },

    /* 11 结论二：△CMB 等边 ⟹ BC = CM = AB/2 */
    {
      say: '再看右边这个小三角形 CMB。它的两条腰 CM 和 MB 一样长，顶角 MCB 是六十度。还是那句话：有一个角是六十度的等腰三角形就是等边三角形。所以第三条边 BC 也等于 CM。而 CM 是 AB 的一半，于是 BC 也是 AB 的一半。第二条路也走到头了，两条路同一个结论。',
      cite: 'CM = MB 且 ∠MCB = 60° ⟹ △CMB 是等边三角形 ⟹ BC = CM = AB/2',
      delNow: ALL_LED,
      add: [fCMB, tkBC2].concat(
        led(11, 0, 'CM = MB，∠MCB = 60°'),
        led(11, 1, '⟹ △CMB 是等边三角形'),
        led(11, 2, '⟹ BC = CM = AB/2', { color: COL.RED, weight: 700 })),
      front: LIFT2,
      eq: 'BC = CM = AB/2'
    },

    /* 12 三边比 1 : √3 : 2 */
    {
      say: '两条路都通到同一个结论，这个模型就算立住了。顺手把三条边一起算出来：BC 是斜边的一半；再用勾股定理，AC 的平方等于斜边的平方减去 BC 的平方，也就是斜边平方的四分之三，开出来 AC 是斜边的二分之根号三。所以三条边一比，就是 一 比 根号三 比 二。',
      cite: 'BC = AB/2；AC² = AB² − BC² = 3AB²/4 ⟹ AC = (√3/2)·AB；BC : AC : AB = 1 : √3 : 2',
      delNow: ['sCM', 'dM', 'vM', 'tkAM', 'tkMB', 'tkCM', 'tkBC2',
        'aMCA', 'aMCB', 'aMCBt', 'fCMB'].concat(ALL_LED),
      add: [rBC, rAC, rAB].concat(
        led(12, 0, 'BC : AC : AB', { weight: 700 }),
        led(12, 1, '= 1 : √3 : 2', { color: COL.RED, weight: 700, size: 18 }),
        led(12, 2, '三十度对边 : 六十度对边 : 斜边', { size: FS.TINY, color: COL.GREY })),
      front: LIFT2,
      eq: 'BC : AC : AB = 1 : √3 : 2'
    },

    /* 13 逆命题：先把已知的角标撤掉，防循环论证 */
    {
      say: '反过来问一句：一个直角三角形里，如果有一条直角边等于斜边的一半，它正对着的那个角是不是三十度？注意，这回三十度和六十度都不是已知了，所以先把 A 处和 B 处的角标都撤掉。仍然取斜边中点 M：斜边中线还是等于斜边的一半，所以 CM 和 MB 都等于 AB 的一半；题目又说 BC 也是 AB 的一半，于是 CM、MB、BC 三条一样长，三角形 CMB 是等边三角形。等边三角形每个角都是六十度，B 就是六十度；回到大三角形，A 等于九十减六十，还是三十度。逆命题成立。',
      cite: '已知 BC = AB/2；CM = MB = AB/2 ⟹ CM = MB = BC ⟹ △CMB 等边 ⟹ ∠B = 60° ⟹ ∠A = 90° − 60° = 30°',
      delNow: ['aA30', 'aA30t', 'aB60', 'aB60t', 'rBC', 'rAC', 'rAB'].concat(ALL_LED),
      add: [sCM, dM, vM, tkAM, tkMB, tkCM, tkBC2, fCMB, aB60, aB60t].concat(
        led(13, 0, '已知 BC = AB/2，M 是 AB 中点'),
        led(13, 1, 'CM = MB = AB/2 = BC', { color: COL.GREEN }),
        led(13, 2, '⟹ △CMB 等边 ⟹ ∠B = 60°', { color: COL.BLUE }),
        led(13, 3, '⟹ ∠A = 90° − 60° = 30°', { color: COL.RED, weight: 700 })),
      front: LIFT2,
      eq: 'BC = AB/2 ⟹ ∠A = 30°（逆命题成立）'
    },

    /* 14 怎么用 */
    {
      say: '最后说怎么用。题目里只要出现三十度、六十度，或者出现斜边是某条边的两倍、某条边是斜边的一半这类话，就先想到这个模型，把一比根号三比二摆出来。它是一座桥：一头连着等边三角形，一头连着直角三角形，两边的话可以互相翻译。正着用，从三十度得到半边；反着用，从半边回到三十度。',
      cite: '模型用法：见 30°、60°、或「斜边 = 某边 × 2」「某边 = 斜边 ÷ 2」⟹ 想 30° 直角三角形；它是等边三角形与直角三角形之间的桥，正反两向都成立',
      delNow: ALL_LED,
      add: [aA30, aA30t].concat(
        led(14, 0, '见 30° / 60° / 斜边是某边两倍', { weight: 700 }),
        led(14, 1, '⟹ 想「三十度直角三角形」'),
        led(14, 2, 'BC : AC : AB = 1 : √3 : 2', { color: COL.RED, weight: 700 }),
        led(14, 3, '正反两向都成立', { size: FS.TINY, color: COL.GREY })),
      front: LIFT2,
      eq: '见 30° / 60° / 斜边两倍 ⟹ 想「三十度直角三角形」：BC : AC : AB = 1 : √3 : 2',
      hold: 3600
    }
  ];

  window.MATHLAB_LESSONS = window.MATHLAB_LESSONS || [];
  window.MATHLAB_LESSONS.push({
    id: 'model-right-triangle-30',
    title: '三十度角直角三角形：三十度所对的直角边是斜边的一半',
    grade: '初二',
    topic: '几何 · 直角三角形',
    tags: ['几何', '直角三角形', '三十度', '等边三角形', '斜边中线', '三边比', '逆命题', '模型'],
    question: '在 Rt△ABC 中，∠C = 90°，∠A = 30°。求证：BC = AB/2。',
    thumbStep: 11,
    methods: [
      {
        name: '两条独立证法 · 拼接（倍长直角边）与斜边中线',
        tier: 'proof',
        sub: '模型课 · 14 步：正命题两证 + 三边比 + 逆命题 + 怎么用',
        steps: steps
      }
    ]
  });
})();
