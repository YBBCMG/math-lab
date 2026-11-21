/* ============================================================
   （11.16A）几何最值探究 · 轴对称变换 —— 第 5 题
   ------------------------------------------------------------
   题：等边 △ABC，点 P 在 BC 边上，∠PAB = α（0° < α < 30°）。
      点 Q 是点 P 关于直线 AB 的对称点，点 D 在 AP 上满足 ∠ADQ = 120°，
      延长 QD 交 AC 于点 E。
      (1) 写出 ∠DAE、∠AED 的度数（用 α 表示）；
      (2) 探究 AE、BP、PC 的等量关系并证明；
      (3) 若 AB = 4，M 为 AB 中点，MQ 最短时求 BP。

   摆法（边长记为 1，数学坐标 y 向上）：
      A = (0, 0)，B = (1, 0)，C = (1/2, √3/2)          —— AB 水平，A 左 B 右
      一般位置 α = 15°：
        P = (√3/2, √3 − 3/2)      Q = (√3/2, 3/2 − √3)   （关于 AB 对称）
        D = (1/2, 1 − √3/2)       E = (√3 − 3/2, 3 − 3√3/2)
        M = (1/2, 0)              N = (3/4, √3/4)           （BC 中点）
      最优位置 α = arctan(√3/7) ≈ 13.8979°（第 (3) 问，MQ 最短）：
        P = (7/8, √3/8)           Q = (7/8, −√3/8)
        D = (7/13, √3/13)         E = (1/4, √3/4)
        C′ = (1/2, −√3/2)         —— C 关于 AB 的对称点，画布 y = 681.77（出界）

   画布映射：canvas_x = 260 + 360x，canvas_y = 370 − 360y。
   两张图 A、B、C、M、N 坐标完全一致（都是不动点），只有 P、Q、D、E 不同，
   所以换帧的时候不动点不会跳。

   答案：(1) ∠DAE = 60° − α，∠AED = 60° + α（∠ADE = 60° 推导用）
         (2) PC = BP + AE   ← 方向别弄反，不是 AE = BP + PC
         (3) BP = 1 = AB/4，此时 α = arctan(√3/7)，MQ_min = √3

   两个必须记住的坑：
   ① 答案线段 AE 与边 AC 共线、BP 与边 BC 共线 —— 一旦把边提到最前（front），
      答案线就被边盖住了，而数值判据照样全绿。所以 LIFT 数组里边的后面必须
      再跟一遍答案线，并且答案线加粗到 5.5 以上（实测 2.4 完全看不见）。
   ② 最优位置那张图，轨迹虚线 B→C′ 的 C′ 在 y = 681.77，早出了 520 的画布，
      必须按题解给的截断点 (533.4, 520) 收笔，否则虚线会画到画布外面。
   ============================================================ */
(function () {
  var AN = window.ANNO;
  var COL = AN.COL, FS = AN.FS;
  var sub = AN.sub, unit = AN.unit;

  var S3 = Math.sqrt(3);

  /* ---------- 数学坐标 → 画布 ---------- */
  var K = 360, X0 = 260, Y0 = 370;
  function P(x, y) { return [X0 + K * x, Y0 - K * y]; }

  /* 垂足：点 Pt 到直线 XY 的投影 */
  function foot(Pt, X, Y) {
    var u = unit(sub(Y, X));
    var t = (Pt[0] - X[0]) * u[0] + (Pt[1] - X[1]) * u[1];
    return [X[0] + u[0] * t, X[1] + u[1] * t];
  }

  /* 线段 a→b 与水平线 y 的交点（虚线在画布边上截断用） */
  function cutAt(a, b, y) {
    var t = (y - a[1]) / (b[1] - a[1]);
    return [a[0] + (b[0] - a[0]) * t, y];
  }

  /* ---------- 不动点（两张图共用） ---------- */
  var A = P(0, 0);              // [260, 370]
  var B = P(1, 0);              // [620, 370]
  var C = P(0.5, S3 / 2);       // [440,  58.23]
  var M = P(0.5, 0);            // [440, 370]
  var N = P(0.75, S3 / 4);      // [530, 214.12]  BC 中点
  var Cp = P(0.5, -S3 / 2);     // [440, 681.77]  C 关于 AB 的对称点（在画布外）

  /* ---------- 一般位置（α = 15°，讲解主图） ---------- */
  var GP = {
    A: A, B: B, C: C, N: N,
    P: P(S3 / 2, S3 - 1.5),
    Q: P(S3 / 2, 1.5 - S3),
    D: P(0.5, 1 - S3 / 2),
    E: P(S3 - 1.5, 3 - 1.5 * S3),
    lab: { P: [600, 283], Q: [572, 483], D: [448, 293], E: [311, 234] }
  };

  /* ---------- 最优位置（α = arctan(√3/7)，第 (3) 问） ---------- */
  var OP = {
    A: A, B: B, C: C, N: N,
    P: P(7 / 8, S3 / 8),
    Q: P(7 / 8, -S3 / 8),
    D: P(7 / 13, S3 / 13),
    E: P(1 / 4, S3 / 4),
    lab: { P: [604, 288], Q: [608, 438], D: [462, 292], E: [314, 224] }
  };

  /* ---------- 图元工厂 ---------- */
  function ln(id, a, b, stroke, sw, dash) {
    var o = { id: id, k: 'line', a: a, b: b, stroke: stroke, sw: sw };
    if (dash) o.dash = dash;
    return o;
  }
  function dot(id, c, r) {
    return { id: id, k: 'circ', c: c, r: r == null ? 3.6 : r, fill: COL.EDGE, stroke: COL.EDGE };
  }

  /* 随 α 变的那一层，拆成两半：
     ① 点 + 主线（两张图都要）
     ② 角弧（只属于第 (1)(2) 问的记号；第 (3) 问讲点到直线的距离，带进去只会把画面塞乱，
        而且那条 r = 150 的大弧会紧贴 M 的字母，被字的白色描边啃掉一段） */
  function pointFrame(p, G) {
    return {
      dotP: dot(p + 'dotP', G.P),
      vP: AN.txt(p + 'vP', G.lab.P, 'P', { size: FS.V, weight: 700 }),
      dotQ: dot(p + 'dotQ', G.Q),
      vQ: AN.txt(p + 'vQ', G.lab.Q, 'Q', { size: FS.V, weight: 700 }),
      dotD: dot(p + 'dotD', G.D),
      vD: AN.txt(p + 'vD', G.lab.D, 'D', { size: FS.V, weight: 700 }),
      dotE: dot(p + 'dotE', G.E),
      vE: AN.txt(p + 'vE', G.lab.E, 'E', { size: FS.V, weight: 700 }),

      sAP: ln(p + 'sAP', G.A, G.P, COL.EDGE, 2.4),
      sQD: ln(p + 'sQD', G.Q, G.D, COL.EDGE, 2.4),
      sDE: ln(p + 'sDE', G.D, G.E, COL.EDGE, 2.4)
    };
  }
  function angleFrame(p, G) {
    return {
      /* A 处的弧：α 两条（同值同色同半径）、2α 一条、60°−α 一条、60°+α 一大条 */
      aPAB: AN.angle(p + 'aPAB', G.A, G.B, G.P, 52, COL.BLUE),
      aQAB: AN.angle(p + 'aQAB', G.A, G.B, G.Q, 52, COL.BLUE),
      aQAP: AN.angle(p + 'aQAP', G.A, G.Q, G.P, 96, COL.PURPLE),
      aPAC: AN.angle(p + 'aPAC', G.A, G.P, G.C, 112, COL.ORANGE),
      aQAE: AN.angle(p + 'aQAE', G.A, G.Q, G.C, 150, COL.TEAL),
      /* D 处的两个弧：分在 AD 两侧，互不嵌套，半径各自按空间取 */
      aADQ: AN.angle(p + 'aADQ', G.D, G.A, G.Q, 30, COL.RED),
      aADE: AN.angle(p + 'aADE', G.D, G.A, G.E, 44, COL.GREEN),
      /* E 处：与 A 处那个 60°+α 同色，表示两角相等 */
      aAED: AN.angle(p + 'aAED', G.E, G.A, G.D, 34, COL.TEAL)
    };
  }
  function frame(p, G) { return Object.assign(pointFrame(p, G), angleFrame(p, G)); }

  function listAll(o) {
    var out = [];
    for (var k in o) {
      if (!Object.prototype.hasOwnProperty.call(o, k)) continue;
      var v = o[k];
      if (Array.isArray(v)) v.forEach(function (x) { if (x) out.push(x); });
      else if (v) out.push(v);
    }
    return out;
  }
  function idsOf(list) { return list.map(function (x) { return x.id; }); }

  /* ---------- 共用层（进两张图都不动） ---------- */
  var SH = {
    fill: { id: 'xfill', k: 'poly', pts: [A, B, C], fill: AN.wash('238,241,247', 0.82), stroke: 'none' },
    sAB: ln('xsAB', A, B, COL.EDGE, 2.4),
    sBC: ln('xsBC', B, C, COL.EDGE, 2.4),
    sCA: ln('xsCA', C, A, COL.EDGE, 2.4),
    vA: AN.txt('xvA', [230, 372], 'A', { size: FS.V, weight: 700 }),
    vB: AN.txt('xvB', [650, 372], 'B', { size: FS.V, weight: 700 }),
    vC: AN.txt('xvC', [440, 30], 'C', { size: FS.V, weight: 700 }),
    vM: AN.txt('xvM', [424, 396], 'M', { size: FS.V, weight: 700 }),
    dotM: dot('xdotM', M),
    dotN: dot('xdotN', N),
    cap: AN.txt('xcap', [26, 30], '等边 △ABC · 三边相等 · 三个内角都是 60°', { size: FS.NOTE, anchor: 'start' }),
    /* Q 的轨迹：线段 BC′。C′ 在 y = 681.77，早出了画布，按 y = 520 截断 */
    locus: ln('xlocus', B, cutAt(B, Cp, 520), COL.RED, 1.9, [6, 5]),
    /* C′ 本身在画布外，字母就贴在虚线可见段的左上方 —— 放右下角会撞上 Q 的字母 */
    vCp: AN.txt('xvCp', [534, 470], 'C′', { size: FS.TINY, color: COL.RED, weight: 700 })
  };

  var fG = frame('g', GP);                    // 一般位置：点 + 线 + 角弧
  var fO = pointFrame('o', OP);                // 最优位置：只要点 + 线

  /* 一般位置才有的辅助：AQ、F、N、三道等长/垂直、三段答案线、MQ */
  var F = foot(GP.Q, A, C);                    // Q 到 AE 的垂足 [301.75, 297.66]
  var gEx = {
    sPQ: ln('gsPQ', GP.P, GP.Q, COL.GREY, 1.7, [6, 5]),   // 翻折的连线
    sAQ: ln('gsAQ', A, GP.Q, COL.TEAL, 2.2),
    sQF: ln('gsQF', GP.Q, F, COL.TEAL, 2, [6, 5]),
    /* F 落在 AC 与 QF 的交点上，两条线成直角 —— 字母只能顺着 AC 的法线往图形外侧推，
       沿 QF 方向推会被 QF 自己穿过（第一版就是这样，碰撞脚本抓到 15 处）。 */
    vF: AN.txt('gvF', [284, 287], 'F', { size: FS.V, weight: 700 }),
    rF: AN.right('grF', F, sub(GP.Q, F), sub(A, F), 11, COL.TEAL),
    vN: AN.txt('gvN', [558, 230], 'N', { size: FS.V, weight: 700 }),   // BC 是斜线，外推 21 不够，21 → 32
    sAN: ln('gsAN', A, N, COL.TEAL, 2.2),
    rN: AN.right('grN', N, sub(A, N), sub(B, N), 12, COL.TEAL),
    tkAQ: AN.tick('gtkAQ', A, GP.Q, COL.GREEN, 9, 60),
    tkQE: AN.tick('gtkQE', GP.Q, GP.E, COL.GREEN, 9, 93),
    /* 三段答案线：都跟三角形的边共线，所以必须加粗 + 挂进 front */
    sPC: ln('gsPC', GP.P, C, COL.BLUE, 5.5),
    sBP: ln('gsBP', B, GP.P, COL.GREEN, 5.5),
    sAE: ln('gsAE', A, GP.E, COL.RED, 5.5),
    sMQ: ln('gsMQ', M, GP.Q, COL.BLUE, 1.9, [6, 5])
  };

  var oEx = {
    sMQ: ln('osMQ', M, OP.Q, COL.BLUE, 1.9, [6, 5]),
    rQ: AN.right('orQ', OP.Q, sub(M, OP.Q), sub(B, OP.Q), 15, COL.TEAL),
    sBP: ln('osBP', B, OP.P, COL.GREEN, 6.5)     // 答案：BP = 1，同样压在 BC 边上面
  };

  /* 层级：边先提，答案线后提 —— 后进数组者在上，答案线才压得住共线的边 */
  var EDGES = ['xsAB', 'xsBC', 'xsCA'];
  var LIFT_G = EDGES.concat(['gsPC', 'gsBP', 'gsAE', 'gdotP', 'gdotE', 'xdotN']);
  var LIFT_O = EDGES.concat(['osBP', 'odotP']);

  var ALL_G = idsOf(listAll(fG)).concat(idsOf(listAll(gEx)));

  /* ---------- 左下角账本 ---------- */
  var LD = ['xled0', 'xled1', 'xled2'];
  function led(lines) {
    return lines.map(function (t, i) {
      return AN.txt('xled' + i, [26, 434 + i * 25], t, {
        size: 15, anchor: 'start',
        color: i === lines.length - 1 ? COL.RED : COL.INK
      });
    });
  }

  /* ============================================================
     17 步：作图 → 第 (1) 问 → 第 (2) 问 → 第 (3) 问
     ============================================================ */
  var steps = [
    /* ---------- 作图 ---------- */
    {
      say: '屏幕上先摆一个三条边一样长的三角形。左边那个顶点叫 A，右边那个叫 B，正上方那个叫 C。这样摆，A 和 B 之间那条边是横着的，三个内角都是六十度。',
      cite: '等边三角形：三边相等，三个内角都是 60°',
      eq: 'AB = BC = CA，∠BAC = ∠ABC = ∠BCA = 60°',
      add: [SH.fill, SH.sAB, SH.sBC, SH.sCA, SH.vA, SH.vB, SH.vC, SH.cap]
    },
    {
      say: '在右边那条斜着的边，也就是从 B 爬到 C 的那条边上点一个点，叫它点 P。再把 A 和 P 连起来，得到一条从顶点斜穿到对边的线段。',
      cite: '题设：点 P 在 BC 边上，位于 B、C 之间',
      eq: 'P ∈ BC，作线段 AP',
      delNow: LD,
      add: [fG.dotP, fG.vP, fG.sAP].concat(led(['P ∈ BC，连 AP']))
    },
    {
      say: '题目规定：横着的那条边 AB，和这条斜线 AP 之间那个小角，等于阿尔法；阿尔法比零度大、比三十度小。整个顶角是六十度，所以斜线 AP 与另一条边 AC 之间剩下的那个角，就是六十度减阿尔法。',
      cite: '题设：∠PAB = α，0° < α < 30°；∠BAC = 60°',
      eq: '∠PAB = α，∠PAC = ∠BAC − ∠PAB = 60° − α',
      delNow: LD,
      add: [].concat(fG.aPAB, fG.aPAC, led(['∠PAB = α（0° < α < 30°）', '∠PAC = 60° − α']))
    },
    {
      say: '接着把点 P 沿横着的那条直线 AB 翻到另一侧，像照镜子一样，落点叫点 Q，它就落在 AB 下面。翻折不改变长度，也不改变角度：所以 A 到 Q 和 A 到 P 一样长，AQ 与 AB 之间那个角也还是阿尔法。图上这两个小弧一样大、同一个颜色，说的就是这件事。从 A 看出去，Q 和 P 分在 AB 两边，合起来张开的角是二倍阿尔法。',
      cite: '轴对称的性质：对应线段相等、对应角相等；AB 平分 ∠QAP',
      eq: 'AQ = AP，∠QAB = ∠PAB = α，∠QAP = 2α',
      delNow: LD,
      add: [fG.dotQ, fG.vQ, gEx.sPQ, gEx.sAQ]
        .concat(fG.aQAB, fG.aQAP, led(['AQ = AP（翻折）', '∠QAB = ∠PAB = α，∠QAP = 2α']))
    },
    {
      say: '现在在 AP 这段线段上取一个点，叫它点 D。它的位置由一个条件锁死：从 D 分别连到 A 和 Q，DA 与 DQ 之间那个角要正好等于一百二十度。因为 D 落在 AP 上，DA 和 PA 是同一条射线，所以 A 处的角 DAQ 就是刚才那个二倍阿尔法；三角形内角和一百八十度，剩下那个角 AQD 就是六十度减二倍阿尔法。',
      cite: '题设：D ∈ AP 且 ∠ADQ = 120°；三角形内角和 180°',
      eq: 'D ∈ AP，∠DAQ = ∠QAP = 2α，∠AQD = 180° − 120° − 2α = 60° − 2α',
      delNow: LD,
      add: [fG.dotD, fG.vD, fG.sQD]
        .concat(fG.aADQ, led(['D ∈ AP，∠ADQ = 120°', '∠DAQ = 2α，∠AQD = 60° − 2α']))
    },
    {
      say: '最后一步作图：从 Q 出发，穿过 D 继续往前延长，交到 AC 这条边上，交点叫点 E。这样 Q、D、E 排在同一条直线上，D 夹在中间。DQ 和 DE 是同一条直线的两半，所以刚才那个一百二十度，和它旁边、夹在 AD 另一侧的那个角，正好凑成一个平角，角 ADE 就是六十度。',
      cite: '题设：延长 QD 交 AC 于点 E，Q—D—E 共线且 D 在 Q、E 之间；邻补角',
      eq: '∠ADE = 180° − ∠ADQ = 180° − 120° = 60°',
      delNow: LD,
      add: [fG.dotE, fG.vE, fG.sDE]
        .concat(fG.aADE, led(['Q、D、E 共线', '∠ADE = 180° − 120° = 60°']))
    },

    /* ---------- 第 (1) 问 ---------- */
    {
      say: '先看第一问要的第一个角。角 DAE 是 D、A、E 三点在 A 处张开的角。D 落在 AP 这条线上，E 落在 AC 这条边上，所以它其实就是刚才算过的、AP 与 AC 之间的那个角，等于六十度减阿尔法。',
      cite: '射线 AD 即射线 AP，射线 AE 即射线 AC',
      eq: '∠DAE = ∠PAC = 60° − α',
      delNow: LD,
      add: led(['∠DAE = ∠PAC = 60° − α'])
    },
    {
      say: '再看第二个角。三角形 ADE 里已经有两条边上的角了：A 处是六十度减阿尔法，D 处是六十度。一百八十度减掉这两个，整理出来 E 处就是六十度加阿尔法。第一问到此结束。',
      cite: '三角形内角和 180°',
      eq: '∠AED = 180° − (60° − α) − 60° = 60° + α',
      delNow: LD,
      add: [].concat(fG.aAED, led(['∠AED = 180° − (60° − α) − 60°', '= 60° + α']))
    },

    /* ---------- 第 (2) 问 ---------- */
    {
      say: '第二问的钥匙藏在顶点 A 上。A 处那个最大的弧，从 AQ 一直张到 AC，正好是刚才那两段拼起来的：靠下的二倍阿尔法，加上靠上的六十度减阿尔法，合起来是六十度加阿尔法。而 E 处那个角，因为 Q、D、E 在同一条直线上，从 E 看 Q 和从 E 看 D 是同一条射线，所以它就是刚才算出来的六十度加阿尔法。同一个三角形里两个角相等，它们对的边就相等，所以 AQ 和 QE 这两条腰一样长 —— 我在两条腰上各画了一道短杠。',
      cite: '等角对等边：△AQE 中 ∠QAE = ∠AEQ ⟹ AQ = QE',
      eq: '∠QAE = 2α + (60° − α) = 60° + α = ∠AEQ ⟹ AQ = QE',
      delNow: LD,
      add: [].concat(fG.aQAE, [gEx.tkAQ, gEx.tkQE],
        led(['∠QAE = 2α + (60° − α) = 60° + α', '= ∠AEQ ⟹ AQ = QE']))
    },
    {
      say: '等腰三角形有个好用的性质：从顶角 Q 向底边 AE 作一条垂线，垂足落在 F，这条线同时把底边平分、把顶角平分。顶角是六十度减二倍阿尔法，劈一半就是三十度减阿尔法。在直角三角形 AQF 里，底边的一半等于腰长乘这个角的正弦，于是 AE 等于二倍的 AQ 乘三十度减阿尔法的正弦；而 AQ 又等于 AP，因为翻折不改变长度。',
      cite: '等腰三角形三线合一；直角三角形中，对边 = 斜边 × 该角的正弦',
      eq: 'QF ⊥ AE，AF = FE ⟹ AE = 2·AQ·sin(30° − α) = 2·AP·sin(30° − α)',
      delNow: LD,
      add: [].concat([gEx.sQF, gEx.rF, gEx.vF],
        led(['QF ⊥ AE，AF = FE', 'AE = 2·AQ·sin(30° − α) = 2·AP·sin(30° − α)']))
    },
    {
      say: '另一头回到 P 身上。取 BC 的中点，叫它点 N。等边三角形里中线也是高，所以 AN 垂直于 BC，N 处那个小方角就是直角。顶角被这条中线分成两半，每半都是三十度，于是 AP 与 AN 之间那个角是三十度减阿尔法。在直角三角形 APN 里，NP 等于 AP 乘三十度减阿尔法的正弦。',
      cite: '等边三角形三线合一，∠NAC = 30°；直角三角形 APN 中 ∠ANP = 90°',
      eq: 'AN ⊥ BC，∠PAN = (60° − α) − 30° = 30° − α，NP = AP·sin(30° − α)',
      delNow: LD,
      add: [].concat([SH.dotN, gEx.vN, gEx.sAN, gEx.rN],
        led(['AN ⊥ BC，∠PAN = 30° − α', 'NP = AP·sin(30° − α)']))
    },
    {
      say: '最后把两头拼起来。N 是 BC 的中点，所以 BN 和 NC 一样长。阿尔法比三十度小，说明 P 落在 B 和 N 之间。那么 PC 这一整段是 NC 加 NP，BP 这一段是 BN 减 NP，两者相减，BN 与 NC 正好抵消，只剩二倍 NP。图上这两条加粗的线就是 PC 和 BP。',
      cite: 'BN = NC；α < ∠NAB = 30° ⟹ 点 P 在 B、N 之间',
      eq: 'PC − BP = (NC + NP) − (BN − NP) = 2·NP',
      delNow: LD,
      add: [].concat([gEx.sPC, gEx.sBP],
        led(['BN = NC，P 在 B、N 之间', 'PC − BP = (NC + NP) − (BN − NP) = 2·NP'])),
      front: LIFT_G
    },
    {
      say: '把上一行的 NP 代进去：二倍的 AP 乘三十度减阿尔法的正弦，跟 AE 长得一模一样。所以第二问的等量关系是：PC 等于 BP 加 AE。方向别弄反 —— 最长的那一段是 PC，它比 BP 多出来的那部分正好是 AE，而不是 AE 等于 BP 加 PC。',
      cite: '由上面两式右边相同：AE 与 2·NP 的表达式一致',
      eq: '2·NP = 2·AP·sin(30° − α) = AE ⟹ PC = BP + AE（即 AE = PC − BP）',
      delNow: LD,
      add: [].concat([gEx.sAE],
        led(['2·NP = 2·AP·sin(30° − α) = AE', '⟹ PC = BP + AE（即 AE = PC − BP）'])),
      front: LIFT_G,
      hold: 3600
    },

    /* ---------- 第 (3) 问 ---------- */
    {
      say: '第三问换成具体尺寸：边长 AB 等于四。等边三角形的高是四乘二分之根号三，也就是二倍根号三；AB 的中点记作 M，就在横边正中间。P 在 BC 上滑动的时候，它的镜像 Q 落在 BC 翻折过去得到的那条线段上 —— 这条线段从 B 出发，朝着 C 关于 AB 的对称点走。那个对称点记作 C 撇，它已经跑到画布外面去了，所以这条红色虚线到画布边上就停住。',
      cite: '轴对称把线段映成线段；等边三角形的高 = (√3/2)·边长',
      eq: 'AB = 4，M 为 AB 中点，Q 的轨迹是线段 BC′（C′ = C 关于 AB 的对称点）',
      delNow: LD,
      add: [].concat([SH.dotM, SH.vM, SH.locus, SH.vCp],
        led(['AB = 4，M 为 AB 中点', 'Q ∈ 线段 BC′（C′ 在画布外，虚线 y = 520 截断）'])),
      front: LIFT_G
    },
    {
      say: 'M 是定点，Q 在那条线段上跑，所以 MQ 最短，就是把 M 到那条直线拉一条垂线段。M 和 B 之间是二，那条轨迹线与横方向成六十度，所以垂距就是二乘六十度的正弦，等于根号三。更要紧的是垂足落在哪：从 B 沿着线量过去，是二乘六十度的余弦，正好一个单位；整条线段长四，一个单位稳稳落在里面，没有跑出线段。',
      cite: '点到直线的最短距离是垂线段；∠MBC′ = 60°；垂足参数 = |MB|·cos60° = 1 ∈ [0, 4]',
      eq: 'MQ_min = MB·sin60° = 2·(√3/2) = √3；BQ* = MB·cos60° = 1 ∈ [0, 4]',
      delNow: LD,
      add: [].concat([gEx.sMQ],
        led(['MQ_min = MB·sin60° = √3', 'BQ* = MB·cos60° = 1 ∈ [0, 4]'])),
      front: LIFT_G
    },
    {
      say: '现在把 P 挪到最省事的位置：让它的镜像 Q 正好落在那个垂足上。这时候 MQ 就垂直于那条轨迹线了，Q 处那个小方角就是垂直。注意 A、B、C、M、N 都没动，动的是 P 和它的镜像。',
      cite: '取 Q = Q*（垂足），则 MQ ⊥ 线段 BC′',
      eq: 'Q = Q*，MQ ⊥ BC′，∠MQB = 90°',
      delNow: LD,
      del: ALL_G,
      add: listAll(fO).concat([oEx.sMQ, oEx.rQ], led(['Q = Q*，MQ ⊥ BC′']))
    },
    {
      say: '再反推 BP。B 在对称轴上，翻折的时候它自己不动，所以 BP 就等于 B 到垂足那一段的长度，也就是一。拿阿尔法等于十五度回头核对一遍：角 DAE 是四十五度，角 AED 是七十五度，三角形里再加个六十度正好一百八十；AE 约等于零点四六四，PC 减 BP 也是零点四六四，两条路对得上。三问的答案连起来就是：六十度减阿尔法、六十度加阿尔法，PC 等于 BP 加 AE，BP 等于一。',
      cite: '轴对称固定对称轴上的点，且保持距离；数值复核 α = 15° 与 α = 13.8979° 均通过',
      eq: 'BP = BQ* = 1 = AB/4（此时 α = arctan(√3/7) ≈ 13.8979°，MQ_min = √3）',
      delNow: LD,
      add: [].concat([oEx.sBP], led(['BP = BQ* = 1 = AB/4', 'α* = arctan(√3/7) ≈ 13.8979°'])),
      front: LIFT_O,
      hold: 4200
    }
  ];

  /* ---------- 存档 ---------- */
  window.MATHLAB_LESSONS = window.MATHLAB_LESSONS || [];
  window.MATHLAB_LESSONS.push({
    id: 'ws-b5-symmetry',
    title: '等边三角形里的镜像点：为什么 PC = BP + AE（讲义 B5）',
    grade: '初二',
    topic: '几何 · 轴对称与最值',
    tags: ['几何', '轴对称', '等边三角形', '最值', '翻折', '动点', '轨迹', '线段和差'],
    question: '如图，已知等边 △ABC，点 P 在 BC 边上，∠PAB = α（0° < α < 30°）。点 Q 是点 P 关于直线 AB 的对称点，点 D 在 AP 上满足 ∠ADQ = 120°，延长 QD 交 AC 于点 E。(1) 直接写出 ∠DAE 和 ∠AED 的度数（用含 α 的式子表示）；(2) 探究线段 AE、BP、PC 满足的等量关系，并证明；(3) 若 AB = 4，M 为 AB 中点，连接 MQ，当 MQ 最短时，直接写出此时 BP 的值。',
    sourceImage: 'img/ws-b5-q.png',
    thumbStep: 12,
    methods: [
      {
        name: '完整推导 · 从等腰 △AQE 到 MQ 最短',
        tier: 'proof',
        sub: '严格证明 · 17 步，三问连着走',
        steps: steps
      }
    ]
  });
})();
