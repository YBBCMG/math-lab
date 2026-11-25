/* ============================================================
   十字架模型 · 正方形里两条互相垂直的斜线
   ------------------------------------------------------------
   题设：正方形 ABCD，E 在边 BC 上，F 在边 CD 上，
         AE 与 BF 相交于点 P，且 AE ⊥ BF。
   要证：AE = BF。

   本课要讲的不是「结论长什么样」，是**为什么成立**，钥匙只有一把：
   用垂直这个条件去搬角 ——
     · 垂直   → △ABP 里一对互余的角     ① + ② = 90°
     · 正方形直角 → B 处一对互余的角      ② + ③ = 90°
     · 两对一比，同角的余角相等          ① = ③
     · 于是 Rt△ABE 与 Rt△BCF 的 ASA 三件套齐了 → 全等 → AE = BF
   末步必须点明方向：**是垂直推出相等，不是相等推出垂直**。

   画图约定（2026-11 标注规范）：
     · F 由「过 B 作 AE 的垂线交 CD 于 F」解出来，不手填坐标 —— 换 E 它跟着变
     · P 由两线求交算出；角弧 / 直角符号 / 等长记号全部由点派生，不手填方位角
     · 顶点字母沿「正方形中心 → 顶点」外推，落在图形外侧
     · 填色拆成三块（△ABP / △BPE / 四边形 PECF）同色同透明度：
       直接叠两个三角形会在公共块 △BPE 上二次加色，看着像糊了一块脏的
   ============================================================ */
(function () {
  var AN = window.ANNO, ML = window.ML;
  var COL = AN.COL, FS = AN.FS;
  var sub = AN.sub, add = AN.add, mul = AN.mul, unit = AN.unit, dist = AN.dist, mid = AN.mid;

  /* ---------- 求交：射线 P + t·dir 与直线 Q1Q2 的交点 ---------- */
  function rayLine(P0, dir, Q1, Q2) {
    var d = unit(dir), e = sub(Q2, Q1);
    var den = d[0] * e[1] - d[1] * e[0];
    var t = ((Q1[0] - P0[0]) * e[1] - (Q1[1] - P0[1]) * e[0]) / den;
    return [P0[0] + d[0] * t, P0[1] + d[1] * t];
  }
  /* 两线段所在直线的交点（画图用，不外推） */
  function meet(P1, P2, Q1, Q2) {
    var e1 = sub(P2, P1), e2 = sub(Q2, Q1);
    var den = e1[0] * e2[1] - e1[1] * e2[0];
    var s = ((Q1[0] - P1[0]) * e2[1] - (Q1[1] - P1[1]) * e2[0]) / den;
    return [P1[0] + e1[0] * s, P1[1] + e1[1] * s];
  }

  /* ============================================================
     图形骨架：正方形 A(左上) B(右上) C(右下) D(左下)
     ============================================================ */

  var S = 340;                              // 边长（像素）
  var A = [150, 96];
  var B = [490, 96];
  var C = [490, 436];
  var D = [150, 436];

  var E = [B[0], B[1] + 0.56 * S];          // E 在 BC 上，[490, 286.4]

  // F：过 B 作 AE 的垂线，与 CD 的交点。
  // 注意这是「由垂直条件解出来的」，不是 S − BE 那个公式的复述。
  var nrm = [-sub(E, A)[1], sub(E, A)[0]];  // AE 的法方向
  var F = rayLine(B, nrm, C, D);            // [299.6, 436]

  var P = meet(A, E, B, F);                 // 两斜线交点 [408.831, 240.945]
  var O = mid(A, C);                        // 正方形中心，顶点字母外推的参考点

  /* ============================================================
     常驻骨架元素
     ============================================================ */

  var sq = { id: 'sq', k: 'poly', pts: [A, B, C, D], fill: COL.FILL, stroke: COL.EDGE, sw: 2.6 };

  var nA = AN.vname('vA', A, O);
  var nB = AN.vname('vB', B, O);
  var nC = AN.vname('vC', C, O);
  var nD = AN.vname('vD', D, O);

  // 边上的点：字母必须顺法向外推（E 在竖边上 → 往右；F 在横边上 → 往下）
  var nE = AN.txt('vE', [E[0] + 28, E[1]], 'E', { size: FS.V, weight: 700 });
  var nF = AN.txt('vF', [F[0], F[1] + 30], 'F', { size: FS.V, weight: 700 });

  // P 落在四条射线的交点，四个直角扇形全被占，字母只好退进「上方扇形」的中线
  var wUp = ML.wedge(P, A, B);
  var nP = AN.txt('vP', ML.pt(P[0], P[1], 56, ML.midDir(wUp)), 'P', { size: FS.V, weight: 700 });

  function dot(id, Pt, color, r) {
    return { id: id, k: 'circ', c: Pt, r: r == null ? 4.2 : r, fill: color, stroke: '#ffffff', sw: 1.8 };
  }
  var dotE = dot('dotE', E, COL.EDGE);
  var dotF = dot('dotF', F, COL.EDGE);
  var dotP = dot('dotP', P, COL.RED, 4.6);

  // 两条斜线：先分开上色，好一句一句说话；证完一起转绿
  var segAE = { id: 'segAE', k: 'line', a: A, b: E, stroke: COL.RED, sw: 3.4 };
  var segBF = { id: 'segBF', k: 'line', a: B, b: F, stroke: COL.BLUE, sw: 3.4 };

  /* ---------- 直角符号 ---------- */
  // P 处 ∠APB：题给的垂直条件，红
  var raP = AN.right('raP', P, sub(A, P), sub(B, P), 15, COL.RED);
  // B 处 ∠ABE、C 处 ∠BCF：本来只是正方形的角，用边的颜色；判定全等时再转绿
  var raB = AN.right('raB', B, sub(A, B), sub(E, B), 14, COL.EDGE);
  var raC = AN.right('raC', C, sub(B, C), sub(F, C), 14, COL.EDGE);

  /* ---------- 三个角：①② 来自垂直，③ 来自正方形 ---------- */
  // 半径逐级错开（76 / 74 / 106）：② 与 ③ 共射线 BF，同半径会互相盖住，
  // 屏幕上看起来只剩一个角，图就在撒谎。① 的 76 是被 A 处 29° 的窄角逼出来的：
  // 半径与标签一起外推（标签落在 102 处，到 AB、AE 两条射线各约 25px），
  // 贴着射线放会被 segAE 刮到（实测净空只剩 4.57）。
  var ang1 = AN.angle('ang1', A, B, E, 76, COL.ORANGE, '①', { size: FS.NOTE, gap: 26, halo: false });
  var ang2 = AN.angle('ang2', B, A, F, 74, COL.ORANGE, '②', { size: FS.NOTE, gap: 28, halo: false });
  var ang3 = AN.angle('ang3', B, F, C, 106, COL.PURPLE, '③', { size: FS.NOTE, gap: 28, halo: false });

  /* ---------- 填色三块（同色同透明度，拼出两个直角三角形且不二次加色） ---------- */
  var WASH = AN.wash('37,99,235', 0.11);
  var tABP = { id: 'tABP', k: 'poly', pts: [A, B, P], fill: WASH, stroke: 'none' };
  var tBPE = { id: 'tBPE', k: 'poly', pts: [B, P, E], fill: WASH, stroke: 'none' };
  var tPECF = { id: 'tPECF', k: 'poly', pts: [P, E, C, F], fill: WASH, stroke: 'none' };

  // 两个直角三角形的外框：判定全等时同色，读作「这两个是同一类」
  var oABE = { id: 'oABE', k: 'poly', pts: [A, B, E], fill: 'none', stroke: COL.BLUE, sw: 3.6 };
  var oBCF = { id: 'oBCF', k: 'poly', pts: [B, C, F], fill: 'none', stroke: COL.ORANGE, sw: 3.6 };

  /* ---------- 等长记号 ---------- */
  // 单杠 = AB 与 BC 这一组；双杠 = BE 与 CF 那一组
  var tickAB = AN.tick('tickAB', A, B, COL.GREEN);
  // BC 的中点（y=266）正好落在 BE 那一段（96~286.4）里，单杠会和 BE 的双杠挤在同一条边上，
  // 读起来像同一组。往下挪到 EC 的中点（y≈361），两组的落点就彻底分开了。
  var tickBC = AN.tick('tickBC', B, C, COL.GREEN, 9, 95);
  function dtick(id, X, Y, color, shift) {
    var s0 = shift == null ? 0 : shift;
    return [
      AN.tick(id + 'a', X, Y, color, 9, s0 + 6),
      AN.tick(id + 'b', X, Y, color, 9, s0 - 6)
    ];
  }
  // BE 的双杠也从中点往下挪：中点 y=191 离 ③ 弧在 BC 上的落点（y=202）只有 5px，
  // 两条绿东西挨在一起像粘住了。挪到 y≈240 两边都让开。
  var dBE = dtick('tickBE', B, E, COL.GREEN, 49);
  var dCF = dtick('tickCF', C, F, COL.GREEN);

  // 结论：两条斜线一样长
  var tickAE = AN.tick('tickAE', A, E, COL.GREEN, 10);
  var tickBF = AN.tick('tickBF', B, F, COL.GREEN, 10);

  /* ============================================================
     右栏：题注 + 推导账本
     ============================================================ */

  var capT = AN.txt('capT', [556, 70], '十字架模型', { size: 19, weight: 700, anchor: 'start' });
  var capS = AN.txt('capS', [556, 108], '正方形里两条互相垂直的斜线', {
    size: FS.TINY, color: COL.GREY, anchor: 'start'
  });

  var LED_IDS = ['led0', 'led1', 'led2', 'led3', 'led4'];
  function led(lines) {
    return lines.map(function (t, i) {
      return AN.txt('led' + i, [556, 176 + i * 40], t, {
        size: FS.NOTE, anchor: 'start',
        color: i === lines.length - 1 ? COL.RED : COL.INK
      });
    });
  }

  /* ============================================================
     图层：填色永远在最下面，其余统统提到它上面
     （顺序 = 从下到上；不放在每一步手写，免得第 5 步修好、第 8 步又脏回来）
     ============================================================ */

  var LIFT = [
    'oABE', 'oBCF',
    'segAE', 'segBF',
    'raP', 'raB', 'raC',
    'ang1', 'ang1t', 'ang2', 'ang2t', 'ang3', 'ang3t',
    'dotE', 'dotF', 'dotP',
    'tickAB', 'tickBC', 'tickBEa', 'tickBEb', 'tickCFa', 'tickCFb',
    'tickAE', 'tickBF',
    'vA', 'vB', 'vC', 'vD', 'vE', 'vF', 'vP',
    'capT', 'capS', 'led0', 'led1', 'led2', 'led3', 'led4'
  ];

  function STEP(o) { o.front = LIFT.concat(o.front || []); return o; }

  /* ============================================================
     讲稿
     ============================================================ */

  var steps = [

    /* 1 题面：先把正方形摆正，四个顶点先说位置再给名字 */
    STEP({
      say: '这就是这道题的全部家当：一个正方形。四个顶点按左上、右上、右下、左下依次排开，左上角那个叫 A，右上角那个叫 B，右下角那个叫 C，左下角那个叫 D。正方形的四条边一样长，四个角都是直角。',
      cite: '正方形 ABCD：AB = BC = CD = DA，∠DAB = ∠ABC = ∠BCD = ∠CDA = 90°',
      add: [sq, nA, nB, nC, nD, capT, capS].concat(led(['正方形：四边等、四角直角'])),
      eq: 'AB = BC = CD = DA，四个角都是 90°'
    }),

    /* 2 两个动点：先说它在哪条边、从哪个顶点走过去，再给名字 */
    STEP({
      say: '现在在两条边上各取一个点。右边那条竖着的边是 BC，从右上角的 B 往下走，在它上面取一点，这一点叫 E；下边那条横着的边是 CD，从左下角的 D 往右走，在它上面取一点，这一点叫 F。这两个点可以随便挑，只要还贴在边上就行。',
      cite: 'E 在边 BC 上，F 在边 CD 上（位置暂不指定）',
      delNow: LED_IDS,
      add: [dotE, nE, dotF, nF].concat(led(['E 在 BC 上，F 在 CD 上'])),
      eq: 'E ∈ BC，F ∈ CD'
    }),

    /* 3 两条斜线：先说从哪连到哪，再给名字；交点最后才叫 P */
    STEP({
      say: '把左上角那个顶点 A 和右边那个点 E 连起来，这条斜线叫做 AE；再把右上角那个顶点 B 和下边那个点 F 连起来，这条斜线叫做 BF。两条斜线在正方形里面十字交叉，交点叫做 P。',
      cite: '线段 AE 与 BF 相交于点 P',
      delNow: LED_IDS,
      add: [segAE, segBF, dotP, nP].concat(led(['AE 与 BF 交于点 P'])),
      eq: 'AE ∩ BF = P'
    }),

    /* 4 题给的垂直 + 待证结论，顺手把「已知 / 待证」划清 */
    STEP({
      say: '题目还塞了一个关键条件：这两条斜线互相垂直。也就是说它们在 P 点交叉的时候，四个夹角都是九十度，题目故意不点明是哪一个，其实四个都一样。要证的结论是这两条斜线一样长，AE 等于 BF。这里先把界限划清：垂直是白送的已知，一样长才是待证的结论，不能拿结论当条件使。',
      cite: '已知 AE ⊥ BF 于 P；求证 AE = BF。垂直是条件，相等是结论，两者不可互换',
      delNow: LED_IDS,
      add: [raP].concat(led(['已知：AE ⊥ BF 于 P', '求证：AE = BF'])),
      eq: '已知 AE ⊥ BF ⟹ 求证 AE = BF'
    }),

    /* 5 第一对互余：垂直把中间那个小三角形变成直角三角形 */
    STEP({
      say: '那这个垂直到底能干什么？它把中间那个小三角形 ABP 变成了直角三角形，直角就在 P 上。直角三角形里两个锐角互余，加起来九十度。这两个锐角，一个是 AB 和 AE 在顶点 A 处夹出来的角，我叫它角一；另一个是 AB 和 BF 在顶点 B 处夹出来的角，我叫它角二。于是角一加角二正好九十度。',
      cite: '△ABP 中 ∠APB = 90° ⟹ ∠BAP + ∠ABP = 90°，即 ∠BAE + ∠ABF = 90°',
      delNow: LED_IDS,
      add: [tABP].concat(ang1, ang2, led(['△ABP 中 ∠P = 90°', '⟹ ① + ② = 90°'])),
      eq: '① + ② = 90°'
    }),

    /* 6 第二对互余：正方形的直角被 BF 劈成两半 */
    STEP({
      say: '正方形自己也留了一个直角在 B 上，就是 AB 和 BC 夹出来的那个大直角。斜线 BF 从这个大直角里穿过去，把它劈成了两半：一半就是刚才的角二，另一半是斜线 BF 和边 BC 夹出来的角，我叫它角三。所以角二加角三也等于九十度。',
      cite: '∠ABC = 90° ⟹ ∠ABF + ∠FBC = 90°',
      delNow: LED_IDS,
      add: [raB].concat(ang3, led(['∠ABC = 90°（正方形）', '⟹ ② + ③ = 90°'])),
      eq: '② + ③ = 90°'
    }),

    /* 7 两对一比：这一步才是钥匙，逐条摆出来不跳 */
    STEP({
      say: '两对照着看：角一加角二等于九十度，角二加角三也等于九十度。两个式子右边一样，左边都带着角二，各减掉一个角二，就得到角一等于角三。这就是这道题真正的钥匙：拿垂直换来一对互余的角，再拿正方形的直角换来另一对，同角的余角相等，角就搬过去了。',
      cite: '同角的余角相等：∠BAE + ∠ABF = ∠ABF + ∠FBC = 90° ⟹ ∠BAE = ∠FBC',
      delNow: LED_IDS,
      upd: [
        { id: 'ang1', stroke: COL.GREEN }, { id: 'ang1t', fill: COL.GREEN },
        { id: 'ang3', stroke: COL.GREEN }, { id: 'ang3t', fill: COL.GREEN }
      ],
      add: led(['① + ② = ② + ③ = 90°', '⟹ ① = ③（同角的余角相等）']),
      eq: '① = ③，即 ∠BAE = ∠FBC'
    }),

    /* 8 锁定两个直角三角形 */
    STEP({
      say: '角的问题解决了，回到三角形。要配对的是这么两个：一个是 A、B、E 三点围成的三角形，直角在 B 上；另一个是 B、C、F 三点围成的三角形，直角在 C 上。这两个直角本来就是正方形的角，因为 E 长在 BC 上，F 长在 CD 上。',
      cite: '∠ABE = ∠ABC = 90°（E 在 BC 上）；∠BCF = ∠BCD = 90°（F 在 CD 上）',
      delNow: LED_IDS,
      add: [tBPE, tPECF, oABE, oBCF, raC].concat(led(['Rt△ABE：直角在 B', 'Rt△BCF：直角在 C'])),
      eq: 'Rt△ABE 与 Rt△BCF，直角分别在 B、C'
    }),

    /* 9 凑齐 ASA 三件套 */
    STEP({
      say: '把全等要的三样东西凑齐。第一样是边：AB 和 BC 都是正方形的边，一样长，而且在各自三角形里站的是同一个位置。第二样是角一和角三，刚证出来相等，一个在顶点 A 处、一个在顶点 B 处，位置正好对上。第三样是两个直角，一个在 B 上、一个在 C 上，也相等。',
      cite: 'AB = BC；∠BAE = ∠FBC；∠ABE = ∠BCF = 90°',
      delNow: LED_IDS,
      add: [tickAB, tickBC].concat(led(['AB = BC', '① = ③', '∠ABE = ∠BCF = 90°'])),
      eq: 'AB = BC，① = ③，∠ABE = ∠BCF = 90°'
    }),

    /* 10 角边角判定 */
    STEP({
      say: '三样齐了，用角边角判定。先把怎么夹的说清楚：在三角形 ABE 里，角一和在 B 处的直角把 AB 这条边夹在中间；在三角形 BCF 里，角三和在 C 处的直角把 BC 这条边夹在中间。两个角和它们的夹边一一对应相等，两个三角形就全等。',
      cite: 'ASA：两角及其夹边分别相等的两个三角形全等 ⟹ △ABE ≌ △BCF',
      delNow: LED_IDS,
      upd: [
        { id: 'oABE', stroke: COL.GREEN }, { id: 'oBCF', stroke: COL.GREEN },
        { id: 'raB', stroke: COL.GREEN }, { id: 'raC', stroke: COL.GREEN },
        { id: 'tickAB', stroke: COL.GREEN }, { id: 'tickBC', stroke: COL.GREEN }
      ],
      add: led(['⟹ △ABE ≌ △BCF（ASA）']),
      eq: '△ABE ≌ △BCF（ASA）'
    }),

    /* 11 对应边相等 —— 结论落地 */
    STEP({
      say: '全等三角形的对应边相等。AE 撑在那个直角的对面，BF 也撑在同一个位置的直角对面，两条是标准的对应边，所以 AE 等于 BF。题目要的结论，到这一步就落地了。',
      cite: '全等三角形对应边相等；∠ABE 的对边是 AE，∠BCF 的对边是 BF',
      delNow: LED_IDS.concat(['oABE', 'oBCF']),
      upd: [
        { id: 'segAE', stroke: COL.GREEN, sw: 4.8 },
        { id: 'segBF', stroke: COL.GREEN, sw: 4.8 }
      ],
      add: [tickAE, tickBF].concat(led(['⟹ AE = BF（直角所对的对应边）'])),
      eq: '⟹ AE = BF'
    }),

    /* 12 顺带的那一组 */
    STEP({
      say: '这套模型还白送一组：BE 和 CF 也是对应边，一样长。所以只要正方形里两条斜线互相垂直，它们自己一样长，连各自在边上切下来的那一小段也一样长。',
      cite: '△ABE ≌ △BCF ⟹ BE = CF（另一组对应边）',
      delNow: LED_IDS,
      add: dBE.concat(dCF, led(['⟹ BE = CF（另一组对应边）'])),
      eq: '⟹ BE = CF'
    }),

    /* 13 方向别弄反 */
    STEP({
      say: '这里必须把方向说清楚，很多人就栽在这一步：题目给的是垂直，我们证出来的是相等，顺序是垂直在前、相等在后。反过来不成立，光知道两条斜线一样长，是推不出它们垂直的。别把相等当成条件去证垂直，那就是把结论当已知用了。',
      cite: 'AE ⊥ BF ⟹ AE = BF（本课所证）；反之 AE = BF ⇏ AE ⊥ BF（需另行给定）',
      delNow: LED_IDS,
      add: led(['垂直 ⟹ 相等（本课）', '相等 ⇏ 垂直（光有相等推不出垂直）']),
      eq: 'AE ⊥ BF ⟹ AE = BF，反之不成立'
    }),

    /* 14 一句话记法 */
    STEP({
      say: '最后留一句话记法：正方形里两条斜线一垂直，就先把两个直角三角形摆好，再用同角的余角相等把角搬过去，凑成角边角，垂直就换成了相等。记牢顺序，是垂直推出相等，不是相等推出垂直。',
      cite: '十字架模型：正方形内 AE ⊥ BF ⟹ AE = BF（互余倒角 + ASA 全等）',
      delNow: LED_IDS,
      add: led(['垂直 ⟹ 互余倒角', '⟹ ASA 全等 ⟹ 相等']),
      eq: '垂直 ⟹ 互余倒角 ⟹ ASA ⟹ 相等',
      hold: 4200
    })
  ];

  /* ============================================================
     注册
     ============================================================ */

  window.MATHLAB_LESSONS = window.MATHLAB_LESSONS || [];
  window.MATHLAB_LESSONS.push({
    id: 'model-cross-square',
    title: '十字架模型：正方形里两条互相垂直的斜线为什么一样长',
    grade: '初二',
    topic: '几何 · 全等模型',
    tags: ['几何', '全等', '全等模型', '直角三角形', '十字架', '互余倒角'],
    question: '正方形 ABCD 中，点 E 在边 BC 上，点 F 在边 CD 上，线段 AE 与 BF 相交于点 P，且 AE ⊥ BF。求证：AE = BF。',
    thumbStep: 10,
    methods: [
      {
        name: '互余倒角 + ASA 全等',
        tier: 'proof',
        sub: '严格证明 · 14 步，把「垂直怎么变成相等」一步步摆开',
        steps: steps
      }
    ]
  });
})();
