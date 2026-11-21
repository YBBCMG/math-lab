/* ============================================================
   （11.16A 基础卷）几何最值探究 · 第 2 题 —— 等边三角形里的中点与最值
   ------------------------------------------------------------
   题：已知 △ABC 是等边三角形，点 E 是 AB 边上的点（不与 A、B 重合），
      在 BC 边的延长线上截取 CF = AE，连接 EF 交 AC 边于点 D。
      (1) 证明点 D 为线段 EF 的中点；
      (2) 在 △ABC 所在平面内取一点 G，使 △EFG 是等边三角形
          （E、F、G 按顺时针方向排列），连接 CG、BG。
          ① 依题意补全图形；
          ② 当 CG 取最小值时，写出 AE 与 CD 的数量关系并证明。

   答案：(1) 过 E 作 EM ∥ BC 交 AC 于 M，△AEM 等边，EM = CF，
            △EMD ≌ △FCD（AAS）⟹ ED = DF。
         (2)① G 恒在过 B 且平行 AC 的直线上，BG = 2·AE。
         (2)② CG 最小时 AE = (2/3)·CD，此时 AE = AB/4、CD = 3AB/8，
            CG_min = (√3/2)·AB，G 恰好压在 C 到该直线的垂足 W 上。

   坐标：画布 900×520，AB = 4，cx = 397 + 66·x，cy = 300 − 66·y
        （数学坐标 y 向上，画布 y 向下）。A 在上、B 左下、C 右下，
        BC 是水平底边。两套位置共用同一个 frame：
          general：AE = 1.6（第(1)问与第(2)①用，E 不在特殊位置）
          min    ：AE = 1.0 = AB/4（第(2)②取最小值的位置）
        G 在 BC 的下方（被「顺时针」这个条件逼出来的），所以底边下方
        预留了约 200px；AE 再大 G 就会滑出画布，故幽灵点只取到 1.3。
   ============================================================ */
(function () {
  var AN = window.ANNO, ML = window.ML;
  var COL = AN.COL, FS = AN.FS;
  var sub = AN.sub, add = AN.add, mul = AN.mul, unit = AN.unit, mid = AN.mid;

  var S3 = Math.sqrt(3);

  /* ---------- 数学坐标 → 画布坐标 ---------- */
  var SCALE = 66, ORIGIN_X = 397, ORIGIN_Y = 300;
  function cv(x, y) { return [ORIGIN_X + SCALE * x, ORIGIN_Y - SCALE * y]; }

  // 三个定点（数学坐标，边长 AB = 4）
  var MA = [0, 2 * S3], MB = [-2, 0], MC = [2, 0];
  var uAB = unit(sub(MB, MA));   // A → B
  var uAC = unit(sub(MC, MA));   // A → C

  var Ac = cv(MA[0], MA[1]);
  var Bc = cv(MB[0], MB[1]);
  var Cc = cv(MC[0], MC[1]);

  /* ---------- 给定 AE，整张图跟着走 ----------
     G 的位置由「绕 F 把 E 顺时针转六十度」独立算出（不是套 BG = 2·AE 这个待证结论），
     用有向面积的符号挑出顺时针那一支。 */
  function frameAt(ae) {
    var E = add(MA, mul(uAB, ae));
    var F = add(MC, mul([1, 0], ae));                 // F 在射线 BC 上、C 的外侧
    var D = mid(E, F);                                // 待证：D 是 EF 中点
    var M = add(MA, mul(uAC, ae));                     // EM ∥ BC
    var W = add(MB, mul(uAC, 2));                      // C 到「过 B 平行 AC」的垂足（定值）
    return { E: E, F: F, D: D, M: M, G: rotG(E, F), W: W };
  }
  function rotG(E, F) {
    var v = sub(E, F);
    var out = [];
    [60, -60].forEach(function (deg) {
      var t = deg * Math.PI / 180, c = Math.cos(t), s = Math.sin(t);
      out.push(add(F, [v[0] * c - v[1] * s, v[0] * s + v[1] * c]));
    });
    // 数学坐标下 E→F→G 顺时针 ⟺ 有向面积 < 0
    var area = function (P, Q, R) {
      return (Q[0] - P[0]) * (R[1] - P[1]) - (Q[1] - P[1]) * (R[0] - P[0]);
    };
    return area(E, F, out[0]) < 0 ? out[0] : out[1];
  }

  var G1 = frameAt(1.6);   // 一般位置
  var G2 = frameAt(1.0);   // 最小值位置

  /* ---------- 字母锚点（题解 labels_canvas，已验证边距） ---------- */
  var LBL_G = { A: [381, 48], B: [232, 329], C: [541, 330], E: [302, 149], F: [677, 313],
                D: [531, 216], G: [343, 486], M: [488, 141], W: [293, 437] };
  /* 最小位置那套的 C 字母：题解给的是 (550,339)，但本课在最小值那一段要画 F→G 这条边，
     它正好从 C 的正下方斜过去，会切进 C 的视觉框（实测框高 29.7px，框顶到锚点上方 24px）。
     往右下挪 (+12,+13) 后离 FG 14.1px、离 F 字母 57px、离画布边 150px，是实测挑出来的位置。 */
  var LBL_M = { A: [381, 48], B: [232, 329], C: [562, 352], E: [321, 117], F: [636, 317],
                D: [521, 199], G: [308, 452], M: [471, 111] };

  /* ---------- 图元工厂 ---------- */
  function seg(id, a, b, color, sw, dash) {
    var o = { id: id, k: 'line', a: a, b: b, stroke: color, sw: sw };
    if (dash) o.dash = dash;
    return o;
  }
  function dot(id, c, color, r) {
    return { id: id, k: 'circ', c: c, r: r == null ? 4 : r, fill: color, stroke: '#ffffff' };
  }
  function nm(id, at, text, size, color) {
    return AN.txt(id, at, text, { size: size || FS.V, weight: 700, color: color || COL.INK });
  }
  // 等长/等分记号：边长 n 道短杠，同色 = 同类相等
  function nbars(prefix, X, Y, color, n, half, gap) {
    var out = [];
    for (var i = 0; i < n; i += 1) {
      var t = AN.tick(prefix + i, X, Y, color, half == null ? 8 : half, (i - (n - 1) / 2) * (gap || 10));
      t.sw = 3;
      out.push(t);
    }
    return out;
  }
  // 平行记号：一道垂直于该边的短杠（两条线上同款 = 平行）
  function pmark(id, X, Y, color, shift) {
    var t = AN.tick(id, X, Y, color, 7, shift || 0);
    t.sw = 2.4;
    return t;
  }

  function fig(p, k, lab) {
    var Ec = cv(k.E[0], k.E[1]), Fc = cv(k.F[0], k.F[1]), Dc = cv(k.D[0], k.D[1]);
    var Mc = cv(k.M[0], k.M[1]), Gc = cv(k.G[0], k.G[1]), Wc = cv(k.W[0], k.W[1]);
    var e = { Ec: Ec, Fc: Fc, Dc: Dc, Mc: Mc, Gc: Gc, Wc: Wc };

    e.sCF = seg(p + 'sCF', Cc, Fc, COL.TEAL, 2.6);          // C 到 F（底边延长）
    e.sEF = seg(p + 'sEF', Ec, Fc, COL.BLUE, 2.6);          // E 到 F
    e.sEM = seg(p + 'sEM', Ec, Mc, COL.TEAL, 2, [8, 5]);    // 辅助线 EM ∥ BC
    e.sEG = seg(p + 'sEG', Ec, Gc, COL.BLUE, 2.2);
    e.sFG = seg(p + 'sFG', Fc, Gc, COL.BLUE, 2.2);
    e.sCG = seg(p + 'sCG', Cc, Gc, COL.RED, 3.4);           // 答案线（要够粗）
    e.sBG = seg(p + 'sBG', Bc, Gc, COL.RED, 3.4);           // 答案线（与轨迹线共线，必须最前）

    e.dE = dot(p + 'dE', Ec, COL.INK, 4);
    e.dF = dot(p + 'dF', Fc, COL.INK, 4);
    e.dD = dot(p + 'dD', Dc, COL.INK, 4);
    e.dM = dot(p + 'dM', Mc, COL.TEAL, 4);
    e.dG = dot(p + 'dG', Gc, COL.RED, 4.6);

    e.nE = nm(p + 'nE', lab.E, 'E');
    e.nF = nm(p + 'nF', lab.F, 'F');
    e.nD = nm(p + 'nD', lab.D, 'D');
    e.nM = nm(p + 'nM', lab.M, 'M');
    e.nG = nm(p + 'nG', lab.G, 'G', FS.V, COL.RED);

    // △AEM 等边：同色短杠
    e.tkAM = nbars(p + 'tkAM', Ac, Mc, COL.GREEN, 1, 8);
    e.tkEM = nbars(p + 'tkEM', Ec, Mc, COL.GREEN, 1, 8);
    // D 是 EF 中点：ED、DF 同色短杠
    e.tkED = nbars(p + 'tkED', Ec, Dc, COL.GREEN, 1, 8);
    e.tkDF = nbars(p + 'tkDF', Dc, Fc, COL.GREEN, 1, 8);
    // BG = 2·AE：BG 上打两道杠（两倍）。
    // 落点要避开「幽灵点」（AE=0.4/0.7/1.0/1.3 那几个），它们正好排在 BG 这条线上：
    // 幽灵在离 B 52.8/92.4/132/171.6px 处，而 BG 中点在 105.6px，比在中间会撞上。
    // 所以把双杠挪到离 B 20px 与 31px（中点 105.6 − 85.6 / − 74.6）。
    e.tkBG = [
      Object.assign(AN.tick(p + 'tkBG0', Bc, Gc, COL.RED, 7, -85.6), { sw: 3 }),
      Object.assign(AN.tick(p + 'tkBG1', Bc, Gc, COL.RED, 7, -74.6), { sw: 3 })
    ];
    // BG ∥ AC：两条线各一道青色平行记号
    e.pBG = pmark(p + 'pBG', Bc, Gc, COL.TEAL, 26);
    e.pAC = pmark(p + 'pAC', Ac, Cc, COL.TEAL, -52);
    // EM ∥ CF
    e.pEM = pmark(p + 'pEM', Ec, Mc, COL.TEAL, 0);
    e.pCF = pmark(p + 'pCF', Cc, Fc, COL.TEAL, 0);

    // 全等的两块色块（同一语义同一色）
    e.wAEM = { id: p + 'wAEM', k: 'poly', pts: [Ac, Ec, Mc], fill: AN.wash('37,99,235', 0.10), stroke: 'none' };
    e.wEMD = { id: p + 'wEMD', k: 'poly', pts: [Ec, Mc, Dc], fill: AN.wash('37,99,235', 0.13), stroke: 'rgba(37,99,235,0.35)' };
    e.wFCD = { id: p + 'wFCD', k: 'poly', pts: [Fc, Cc, Dc], fill: AN.wash('37,99,235', 0.13), stroke: 'rgba(37,99,235,0.35)' };

    // 角标：∠EMD = ∠FCD（同色同半径）、D 处对顶角
    e.aM = AN.angle(p + 'aM', Mc, Ec, Dc, 40, COL.GREEN, null, { gap: 22 });
    e.aC = AN.angle(p + 'aC', Cc, Fc, Dc, 40, COL.GREEN, null, { gap: 22 });
    e.aD1 = AN.angle(p + 'aD1', Dc, Mc, Ec, 30, COL.ORANGE, null, { gap: 20 });
    e.aD2 = AN.angle(p + 'aD2', Dc, Cc, Fc, 30, COL.ORANGE, null, { gap: 20 });
    // ∠EFG = 六十度（E 在上、G 在下，底边从中间穿过）
    e.aF = AN.angle(p + 'aF', Fc, Gc, Ec, 52, COL.PURPLE, null, { gap: 24 });
    // 绕 A 转六十度：AB ↦ AC
    e.aA = AN.angle(p + 'aA', Ac, Bc, Cc, 60, COL.PURPLE, null, { gap: 24 });
    // 取等时 CG ⊥ BG
    e.rG = AN.right(p + 'rG', Gc, sub(Bc, Gc), sub(Cc, Gc), 13, COL.RED);

    e.CD = seg(p + 'sCD', Cc, Dc, COL.ORANGE, 3.2);         // 答案相关的 CD（与 AC 共线，必须够粗 + 置顶）
    return e;
  }

  var g = fig('g', G1, LBL_G);
  var m = fig('m', G2, LBL_M);
  m.nC = nm('mnC', LBL_M.C, 'C');   // 最小值那套的 C 要换个落点，见 LBL_M 上方注释

  /* ---------- 底座：三个顶点与三条边 ---------- */
  var bfill = { id: 'bfill', k: 'poly', pts: [Ac, Bc, Cc], fill: AN.wash('238,241,247', 0.85), stroke: 'none' };
  var bsAB = seg('bsAB', Ac, Bc, COL.EDGE, 2.6);
  var bsBC = seg('bsBC', Bc, Cc, COL.EDGE, 2.6);
  var bsCA = seg('bsCA', Cc, Ac, COL.EDGE, 2.6);
  var bnA = nm('bnA', LBL_G.A, 'A');
  var bnB = nm('bnB', LBL_G.B, 'B');
  var bnC = nm('bnC', LBL_G.C, 'C');
  var bcap = AN.txt('bcap', [40, 36], '△ABC 等边，E 在 AB 上，CF = AE',
    { size: FS.TINY, anchor: 'start', color: COL.GREY });

  /* ---------- 轨迹线：过 B 且平行 AC ----------
     方向 = unit(A→C)。往两头都画一点，让人看清「直线」，但主要活动范围在右下。 */
  var locDir = unit(sub(Cc, Ac));
  var xloc = seg('xloc', add(Bc, mul(locDir, -118)), add(Bc, mul(locDir, 238)), COL.TEAL, 1.8, [9, 7]);

  // 幽灵点：E 挪到不同位置时 G 停过的地方（AE 当时间轴参数，取 0.4/0.7/1.0/1.3，不取 0 与 4）
  // 白底青边：这些点正好压在红色 BG 答案线上，实心点会糊进去，留白边才跳得出来
  var xgh = [0.4, 0.7, 1.0, 1.3].map(function (ae, i) {
    var k = frameAt(ae);
    return { id: 'xgh' + i, k: 'circ', c: cv(k.G[0], k.G[1]), r: 4.2, fill: '#ffffff', stroke: COL.TEAL, sw: 2.2, op: 0.55 + i * 0.15 };
  });

  // 垂足 W 那一套（图上有，位置与 AE 无关）
  var Wc = cv(G1.W[0], G1.W[1]);
  var xWdot = dot('xWdot', Wc, COL.TEAL, 4.4);
  var xnW = nm('xnW', LBL_G.W, 'W', FS.V, COL.TEAL);
  var xsCW = seg('xsCW', Cc, Wc, COL.TEAL, 2.6);
  var xrW = AN.right('xrW', Wc, sub(Bc, Wc), sub(Cc, Wc), 13, COL.TEAL);

  // Q 在画面上方之外：从 A 沿 BA 的延长线画一小段虚线冲出画布，标个 Q
  var qDir = unit(sub(Ac, Bc));
  var xQray = seg('xQray', Ac, add(Ac, mul(qDir, 74)), COL.GREY, 1.6, [6, 5]);
  var xnQ = AN.txt('xnQ', [456, 18], 'Q 在这里（画面外）', { size: 13, anchor: 'start', color: COL.GREY });

  // M 被「绕 A 转六十度」点亮时加个圈
  var xringM = { id: 'xringM', k: 'circ', c: g.Mc, r: 13, fill: 'none', stroke: COL.PURPLE, sw: 2, dash: [4, 4] };
  // G 落到 W 上时加个圈
  var xringG = { id: 'xringG', k: 'circ', c: m.Gc, r: 15, fill: 'none', stroke: COL.RED, sw: 2.2, dash: [5, 4] };

  // AE 与 CD 的 2:3 记号（最后一步）
  var mAEbar = nbars('mbAE', Ac, m.Ec, COL.GREEN, 2, 8, 11);
  var mCDbar = nbars('mbCD', Cc, m.Dc, COL.ORANGE, 3, 7, 9);

  /* ---------- 左下角注释 ---------- */
  var xnote = AN.txt('xnote', [40, 486], 'E 往下挪，G 就沿这条虚线往外滑',
    { size: FS.TINY, anchor: 'start', color: COL.TEAL });

  /* ---------- 右下角账本（左下角被 G 与轨迹占了，挪到右下） ---------- */
  var LED = ['xled0', 'xled1', 'xled2', 'xled3'];
  function led(lines) {
    return lines.map(function (t, i) {
      return AN.txt('xled' + i, [636, 424 + i * 25], t, {
        size: 16, anchor: 'start',
        color: i === lines.length - 1 ? COL.RED : COL.INK
      });
    });
  }

  /* ---------- 图层顺序 ----------
     半透明色块后加会盖住先画的线与字母，所以每加东西都把整张表重新排一次：
     色块 < 边 < 记号/角标 < 轨迹 < 答案线 < 点 < 文字 < 账本。
     注意 CD 与 AC、BG 与轨迹线都是共线的：答案线必须排在边之后并加粗，
     否则会被边盖住（数值对、画面上却「消失」）。 */
  // 把「图元 / 图元数组 / id 字符串」统一摊平成 id 列表
  function ids(x) {
    if (!x) return [];
    if (Array.isArray(x)) {
      var out = [];
      for (var i = 0; i < x.length; i += 1) out = out.concat(ids(x[i]));
      return out;
    }
    if (typeof x === 'string') return [x];
    return x.id ? [x.id] : [];
  }

  function zOrder() {
    return ids([
      'bfill',
      g.wAEM, g.wEMD, g.wFCD,
      'bsAB', 'bsBC', 'bsCA',
      g.sCF, g.sEF, g.sEM, g.sEG, g.sFG, m.sCF, m.sEF, m.sEM, m.sEG, m.sFG,
      g.tkAM, g.tkEM, g.tkED, g.tkDF, g.pEM, g.pCF,
      'xQray', 'xringM',
      g.aM, g.aC, g.aD1, g.aD2, g.aF, g.aA,
      'xloc',
      'xsCW', 'xrW',
      g.CD, m.CD,
      g.sCG, g.sBG, m.sCG, m.sBG,
      g.pBG, g.pAC, g.tkBG,
      m.rG,
      mAEbar, mCDbar,
      'xgh0', 'xgh1', 'xgh2', 'xgh3',
      'xWdot', 'xringG',
      g.dE, g.dF, g.dD, g.dM, g.dG,
      m.dE, m.dF, m.dD, m.dM, m.dG,
      'bnA', 'bnB', 'bnC', 'mnC',
      g.nE, g.nF, g.nD, g.nM, g.nG,
      m.nE, m.nF, m.nD, m.nM, m.nG,
      'xnW',
      'bcap', 'xnQ', 'xnote',
      LED
    ]);
  }

  /* ---------- 第二问②切到最小值那套图时，先撤掉的东西 ---------- */
  var GONE_G = ['bnC', 'gsCF', 'gsEF', 'gsEM', 'gsEG', 'gsFG', 'gsCG', 'gsBG', 'gsCD',
    'gdE', 'gdF', 'gdD', 'gdM', 'gdG',
    'gnE', 'gnF', 'gnD', 'gnM', 'gnG',
    'gwAEM', 'gwEMD', 'gwFCD',
    'xtkAE0', 'xtkCF0',
    'gtkAM0', 'gtkEM0', 'gtkED0', 'gtkDF0', 'gpEM', 'gpCF', 'gpBG', 'gpAC',
    'gtkBG0', 'gtkBG1', 'grG',
    'gaM', 'gaC', 'gaD1', 'gaD2', 'gaF', 'gaA',
    'xgh0', 'xgh1', 'xgh2', 'xgh3', 'xnote', 'xQray', 'xnQ',
    'xWdot', 'xnW', 'xsCW', 'xrW', 'xringM'];

  /* ============================================================
     讲稿
     ============================================================ */
  var steps = [
    /* ---------------- 第 (1) 问 ---------------- */
    {
      say: '先认图：这是一个三角形，最上面那个尖是顶点 A，左下角那一点是顶点 B，右下角那一点是顶点 C。题目说它是等边三角形，也就是三条边一样长、三个角都是六十度。',
      cite: '题面：△ABC 是等边三角形',
      add: [bfill, bsAB, bsBC, bsCA, bnA, bnB, bnC, bcap],
      front: zOrder(),
      eq: 'AB = BC = CA，∠A = ∠B = ∠C = 60°'
    },
    {
      say: '在 A 到 B 这条边上取一个点，它夹在两头之间、既不贴着 A 也不贴着 B，这个点叫 E。于是 A 到 E 的这一小段就是线段 AE，我在它中间打一道绿色短杠，代表这一段的长度。',
      cite: '题面：点 E 是 AB 边上的点（不与 A、B 重合）',
      delNow: LED,
      add: [g.dE, g.nE].concat(nbars('xtkAE', Ac, g.Ec, COL.GREEN, 1, 8), led(['AE 是可以在 0 与 AB 之间变的长度'])),
      front: zOrder(),
      eq: '0 < AE < AB'
    },
    {
      say: '再把底下那条横着的底边，从 C 这一头往外拖长；在拖出来的射线上量一段和 AE 一样长的，量到的端点叫 F，C 到 F 这一段就是 CF。两段一样长，所以我给它们打同色的短杠。',
      cite: '题面：在 BC 边的延长线上截取 CF = AE',
      delNow: LED,
      add: [g.sCF, g.dF, g.nF].concat(nbars('xtkCF', Cc, g.Fc, COL.GREEN, 1, 8), led(['CF = AE（同色短杠）'])),
      front: zOrder(),
      eq: 'F 在射线 BC 上、且在 C 的外侧；CF = AE；BF = BC + AE'
    },
    {
      say: '把 E 和 F 用一条线段连起来，这条线会穿过右边那条斜边，也就是 A 到 C 这条边；穿过的那个点叫 D。第一问要证的，就是 D 正好把 EF 分成一样长的两半。',
      cite: '题面：连接 EF 交 AC 边于点 D',
      delNow: LED,
      add: [g.sEF, g.dD, g.nD].concat(led(['要证：D 是 EF 的中点'])),
      front: zOrder(),
      eq: 'D 是线段 EF 与 AC 的交点'
    },
    {
      say: '要证这件事，先借一条辅助线：从 E 往右画一条和底边平行的横线，它跟 A 到 C 这条边会碰上一个点，这个点叫 M，是个辅助点。',
      cite: '辅助线作法：过 E 作 EM ∥ BC，交 AC 于点 M',
      delNow: LED,
      add: [g.sEM, g.dM, g.nM].concat(led(['过 E 作 EM ∥ BC，交 AC 于 M'])),
      front: zOrder(),
      eq: 'EM ∥ BC，M 在 AC 上'
    },
    {
      say: '因为这条横线和底边平行，上面那个小三角形 AEM 跟整个大三角形形状一模一样、只是缩小了一号；再加上 A 那个角本来就是六十度，所以 AE、AM、EM 三条边一样长，小三角形 AEM 自己也是等边三角形。',
      cite: '平行于三角形一边的直线截其他两边，截得的三角形与原三角形相似（△AEM ∽ △ABC）；又 ∠A = 60°，故 △AEM 为等边三角形',
      delNow: LED,
      add: [g.wAEM, g.tkAM[0], g.tkEM[0]].concat(led(['△AEM 也是等边三角形', 'AE = AM = EM'])),
      front: zOrder(),
      eq: 'AE = AM = EM'
    },
    {
      say: '题目给的 CF 本来就和 AE 一样长，现在 EM 也和 AE 一样长，于是 CF 和 EM 这两段就一样长了。',
      cite: '等量代换：CF = AE，EM = AE ⟹ CF = EM',
      delNow: LED,
      add: led(['CF = AE = EM', 'CF = EM']),
      front: zOrder(),
      eq: 'CF = EM'
    },
    {
      say: '还有一件事要记：辅助线 EM 和底边 BC 平行，而 F 和 C 这两个点都落在底边所在的这条直线上，所以 EM 和 CF 也是互相平行的。我给它们各打一道青色短杠，同款记号就是平行的意思。',
      cite: '平行于同一条直线的两条直线互相平行（EM ∥ BC，F、C 都在直线 BC 上）',
      delNow: LED,
      add: [g.pEM, g.pCF].concat(led(['EM ∥ BC，F、C 都在直线 BC 上', '⟹ EM ∥ CF'])),
      front: zOrder(),
      eq: 'EM ∥ CF'
    },
    {
      say: '两条平行线被 AC 这条线一截，M 那个角和 C 那个角就相等；D 那里是一对对顶角，也相等；再加上刚证的两段边一样长。两个三角形，两个角加一条边，全等。',
      cite: 'AAS：∠EMD = ∠FCD（两直线平行，内错角相等），∠MDE = ∠CDF（对顶角相等），EM = CF',
      delNow: LED,
      add: [g.wEMD, g.wFCD].concat(g.aM, g.aC, g.aD1, g.aD2,
        led(['∠EMD = ∠FCD，∠MDE = ∠CDF', 'EM = CF', '⟹ △EMD ≌ △FCD'])),
      front: zOrder(),
      eq: '△EMD ≌ △FCD（AAS）'
    },
    {
      say: '全等以后，ED 和 DF 是一组对应的边，长度必然相等。所以 D 落在 EF 的正中间，第一问就证完了。',
      cite: '全等三角形的对应边相等',
      delNow: LED,
      add: [g.tkED[0], g.tkDF[0]].concat(led(['ED = DF', 'D 是线段 EF 的中点'])),
      front: zOrder(),
      eq: 'ED = DF，即 D 是线段 EF 的中点'
    },
    {
      say: '顺手再从左边的全等里记一个后面要用的结论：MD 和 CD 一样长，而 AD 是 AM 加上 MD。把它们并起来看，AD 正好是 AB 与 AE 的和的一半，CD 就是 AB 与 AE 的差的一半。',
      cite: '△EMD ≌ △FCD ⟹ MD = CD；又 AM = AE、AC = AB ⟹ AD = AM + MD = (AB + AE)/2，CD = AC − AD = (AB − AE)/2',
      delNow: LED,
      add: [g.CD].concat(led(['AD = (AB + AE)/2', 'CD = (AB − AE)/2', '即 2·CD + AE = AB'])),
      front: zOrder(),
      eq: 'AD = (AB + AE)/2，CD = (AB − AE)/2，即 2·CD + AE = AB'
    },

    /* ---------------- 第 (2) 问 ① 补图 ---------------- */
    {
      say: '进入第二问。要在图里再取一个点，让 E、F、G 这三个点自己也围成一个等边三角形；而且从 E 走到 F、再从 F 走到 G，要顺着钟表针转动的方向，也就是顺时针。',
      cite: '题面：取点 G 使 △EFG 为等边三角形，点 E、F、G 按顺时针方向排列',
      delNow: LED,
      add: led(['△EFG 是等边三角形', 'E → F → G 顺时针']),
      front: zOrder(),
      eq: 'EF = FG = GE，∠EFG = 60°，且 E→F→G 为顺时针'
    },
    {
      say: '这样的点只有一个：E 定了之后 F 跟着定；把 F 到 E 的方向按顺时针转过六十度，在转出来的射线上截一段和 FE 一样长的，落点就是 G。也正因为要顺时针，G 被压到了底边的下面——图上 G 在底边下方，是这条条件逼出来的，不是随手画的。',
      cite: '给定线段 EF 及顺、逆时针的取向，等边三角形的第三个顶点唯一；本题图中的 G 落在 BC 的下方（若取另一侧，CG 将关于 AE 单调，没有内部极小点）',
      delNow: LED,
      add: [g.sEG, g.sFG, g.dG, g.nG].concat(g.aF, led(['FG = FE，∠EFG = 60°', 'G 在 BC 的下方'])),
      front: zOrder(),
      eq: 'FG = FE，∠EFG = 60°；G 落在使 E、F、G 顺时针的一侧（本题在 BC 下方）'
    },
    {
      say: '接下来把图里两个六十度串起来用。先绕 F 把图形顺时针转六十度：因为 FG 和 FE 一样长、夹角又正好是六十度，G 一转身就落到了 E 上。',
      cite: '△EFG 为等边三角形 ⟹ FG = FE，∠GFE = 60°；绕 F 顺时针旋转 60° 把 G 送到 E',
      delNow: LED,
      add: led(['绕 F 顺时针转六十度', 'G 落在 E 上']),
      front: zOrder(),
      eq: 'FG = FE，∠GFE = 60° ⟹ 绕 F 顺时针旋转 60°：G ↦ E'
    },
    {
      say: '同一次转动还会把 B 一起带走。B 到 F 的距离是 BC 加 CF，也就是 AB 加 AE；转过去之后它落在 AB 往上延长出去的那条线上，这个点我们叫 Q。它有一个好位置：A 到它正好是一段 AE。也就是说，A 夹在 E 和 Q 中间，是它们的中点。这个点在画面外，我们只要记住它和 A 的这个位置关系。',
      cite: '同一次旋转把 B 送到 Q：FQ = FB 且 ∠BFQ = 60°，故 △QBF 为等边三角形，BQ = BF = BC + CF = AB + AE；又 ∠ABF = ∠CBF = 60°，故射线 BQ 与射线 BA 重合，于是 AQ = BQ − AB = AE，即 A 是 EQ 的中点',
      delNow: LED,
      add: [xQray, xnQ].concat(led(['Q 在 BA 的延长线上', 'AQ = AE，A 是 EQ 的中点'])),
      front: zOrder(),
      eq: 'Q 在 BA 的延长线上，AQ = AE，BQ = AB + AE；A 是 EQ 的中点'
    },
    {
      say: '再绕 A 逆时针转六十度。这一转正好把 AB 这条边转到 AC 上去，B 就落到了 C；E 转过去落在哪呢？正好落在 AC 上的 M——就是我们第一问那条辅助线得到的点。Q 转过去也有个落点，我们叫它 Q 撇。',
      cite: '△ABC 为等边三角形 ⟹ 绕 A 逆时针旋转 60° 把 B 送到 C；又 AM = AE 且 M 在 AC 上，故 E 的像就是 M；Q 的像记作 Q₁',
      delNow: LED,
      add: [xringM].concat(led(['绕 A 逆时针转六十度', 'B ↦ C，E ↦ M，Q ↦ Q 撇'])),
      front: zOrder(),
      eq: '绕 A 逆时针旋转 60°：B ↦ C，E ↦ M，Q ↦ Q₁'
    },
    {
      say: '两个转动，一个顺时针、一个逆时针，角度正好抵消，合起来相当于整张图平移一次。平移里任何一对对应点挪的方向和步长都一样，所以从 G 到 B 的那一挪，等于从 M 到 Q 撇的那一挪。再看 A：A 到 M、A 到 Q 撇都等于 AE，A 又夹在中间，所以 M 到 Q 撇正好是 AE 的两倍；反过来，从 B 到 G 也是 AE 的两倍，方向就是 A 到 C 的那个方向。结论出来了：BG 是 AE 的两倍，而且 BG 与 AC 平行。',
      cite: '两个旋转角互为相反数的旋转复合起来是平移，平移保持任意一对对应点之差向量不变 ⟹ 向量 GB = 向量 MQ₁；又 A 是 MQ₁ 的中点，向量 MQ₁ = −2·向量 AM，故 向量 BG = −向量 GB = 2·向量 AM ⟹ BG = 2·AE 且方向同 A→C，即 BG ∥ AC',
      delNow: LED,
      add: [g.sBG, g.tkBG[0], g.tkBG[1], g.pBG, g.pAC].concat(led(['BG = 2·AE（两道杠 = 两倍）', 'BG ∥ AC（青色平行记号）'])),
      front: zOrder(),
      eq: '向量 GB = 向量 MQ₁ = 2·向量 AM ⟹ BG = 2·AE，且 BG ∥ AC'
    },
    {
      say: '这句话把 G 的底细翻出来了：不管 E 在 AB 上挪到哪，G 始终贴着一条固定的直线走，就是过 B 点、和 AC 平行的那一条；而它到 B 的距离一直是 AE 的两倍。左边那几个淡点，是 E 挪到不同位置时 G 停过的地方——E 往下走，G 就沿着这条虚线往外滑。',
      cite: '由上一步：G 在过 B 且平行于 AC 的直线上，BG = 2·AE；由 0 < AE < AB 得 0 < BG < 2·AB，故 G 的轨迹是从 B 出发的一段',
      delNow: LED,
      add: [xloc].concat(xgh, xnote, led(['G 的轨迹：过 B 平行 AC', 'BG = 2·AE（0 < AE < AB）'])),
      front: zOrder(),
      eq: 'G 在过 B 且平行 AC 的直线上，BG = 2·AE（0 < AE < AB）'
    },

    /* ---------------- 第 (2) 问 ② 最值 ---------------- */
    {
      say: '那 C 到 G 什么时候最近呢？从一个点连到一条直线上，最短的那一条一定是和这条直线垂直的。所以先把垂足找出来：从 C 往那条平行线作垂线，垂足叫 W，图上那个小方角就是垂直。',
      cite: '垂线段最短：CG ≥ CW，等号当且仅当 G 与垂足 W 重合',
      delNow: LED,
      add: [g.sCG, xsCW, xrW, xWdot, xnW].concat(led(['垂线段最短', 'CG ≥ CW'])),
      front: zOrder(),
      eq: 'CG ≥ CW，等号当且仅当 G 与 W 重合'
    },
    {
      say: '等边三角形每个角都是六十度，所以底边和这条平行线夹出来的角也是六十度。于是在那个直角三角形里，B 到垂足的一段是 BC 的一半，垂足到 C 的一段是 BC 的二分之根号三倍。',
      cite: '两直线平行、内错角相等 ⟹ ∠CBW = 60°；直角三角形中三十度角所对的直角边等于斜边的一半；勾股定理',
      delNow: LED,
      add: led(['BW = BC/2 = AB/2', 'CW = (√3/2)·AB']),
      front: zOrder(),
      eq: 'BW = BC/2 = AB/2，CW = (√3/2)·AB'
    },
    {
      say: '再看那个直角三角形：CW 是定死的，另一条直角边是 G 到垂足的那一小段，它等于 AE 的两倍再减去 AB 的一半——G 滑得越偏，这一段就越长。用勾股定理把 CG 的平方写出来，那个平方项最小就是零，这时候 CG 最小。',
      cite: '勾股定理：CG² = CW² + WG²，其中 WG = |BG − BW| = |2·AE − AB/2|',
      delNow: LED,
      add: led(['CG² = CW² + WG²', 'WG = |2·AE − AB/2|', 'CG² = (3/4)AB² + (2·AE − AB/2)²']),
      front: zOrder(),
      eq: 'CG² = (3/4)·AB² + (2·AE − AB/2)²，故 CG ≥ (√3/2)·AB'
    },
    {
      say: '平方项要最小，就是让它等于零，也就是 AE 正好是 AB 的四分之一。我把 E 挪到这个位置上——你看，G 一压就压到了刚才那个垂足上，CG 和那条垂线重合了，这就是最短的时候。',
      cite: '非负数的平方最小为零；等号成立条件是 2·AE − AB/2 = 0，即 AE = AB/4（介于 0 与 AB 之间，符合题面）；此时 G 与 W 重合，CG_min = CW = (√3/2)·AB',
      delNow: LED.concat(GONE_G),
      add: [m.sCF, m.sEF, m.sEG, m.sFG, m.dE, m.dF, m.dD, m.dG, m.nE, m.nF, m.nD, m.nG, m.nC,
        m.sCG, m.sBG, m.rG, xringG].concat(led(['AE = AB/4', 'G 与 W 重合，CG ⊥ BG', 'CG_min = (√3/2)·AB'])),
      front: zOrder(),
      eq: 'AE = AB/4 ⟹ CG_min = (√3/2)·AB，此时 G 与 W 重合且 CG ⊥ BG'
    },
    {
      say: '最后把 AE 等于四分之一 AB 代回前面 CD 那个式子：CD 就是八分之三 AB。拿 AE 和 CD 一比，AE 是 CD 的三分之二。所以第二问的答案就是：当线段 CG 最短时，AE 等于三分之二倍的 CD。',
      cite: 'S11 的结论 CD = (AB − AE)/2；代入 AE = AB/4 得 CD = 3·AB/8，故 AE = (2/3)·CD，即 3·AE = 2·CD',
      delNow: LED,
      add: [m.CD].concat(mAEbar, mCDbar,
        led(['CD = (AB − AB/4)/2 = 3AB/8', 'AE = AB/4 ⟹ 3·AE = 2·CD', 'AE = (2/3)·CD'])),
      front: zOrder(),
      eq: 'CD = 3·AB/8，AE = (2/3)·CD，即 3·AE = 2·CD',
      hold: 4600
    }
  ];

  window.MATHLAB_LESSONS = window.MATHLAB_LESSONS || [];
  window.MATHLAB_LESSONS.push({
    id: 'ws-a2-equilateral',
    title: '等边三角形里的中点，和 CG 最短的那一刻（讲义 A2）',
    grade: '初二',
    topic: '几何 · 旋转与最值',
    tags: ['几何', '等边三角形', '全等', '旋转', '最值', '动点', '中点'],
    question: '已知 △ABC 是等边三角形，点 E 是 AB 边上的点（不与 A、B 重合），在 BC 边的延长线上截取 CF = AE，连接 EF 交 AC 边于点 D。(1) 证明：点 D 为线段 EF 的中点；(2) 在 △ABC 所在平面内取一点 G，使得 △EFG 是等边三角形（点 E、F、G 按顺时针方向排列），连接 CG、BG。① 依题意补全图形；② 当线段 CG 的长取得最小值时，用等式写出线段 AE 与 CD 的数量关系，并证明。',
    sourceImage: 'img/ws-a2-q.png',
    thumbStep: 12,
    methods: [
      {
        name: '完整推导 · 从中点到 AE = (2/3)·CD',
        tier: 'proof',
        sub: '严格证明 · 23 步，三问连着走',
        steps: steps
      }
    ]
  });
})();
