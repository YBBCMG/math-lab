/* ============================================================
   （11.16A 提高班）等边三角形手拉手 + 定直线上的动点最值 —— 第 4 题
   ------------------------------------------------------------
   题：△ABC 是边长为 6 的等边三角形，D 是边 AC 上的动点（D 不与 A、C
       重合），以 BD 为边作等边 △BDE（E 在 AB 上方）。
       (1) 如图①，当 D 为 AC 中点时，求证 DE ⊥ BC；
       (2) 如图②，连接 CE，求证 CE ∥ AB；
       (3) F 为 BC 的中点，连接 EF，当 EF + EB 取最小值时，
           延长 BE 交直线 AC 于 G，求线段 CG 的长。

   坐标（与题解 b4.json 完全同一套）：原点在 A，边长 6，
       A(0,0)  B(6,0)  C(3, 3√3)
       D = A + t(C − A) = (3t, 3√3 t)
       E 是 D 绕 B 顺时针转 60° 的像 ⟹ E(3 + 6t, 3√3)
         ⟹ y(E) 与 t 无关 ⟹ E 的轨迹是过 C 且平行 AB 的定直线
       F = (9/2, 3√3/2)      P = DE ∩ BC = (15/4, 9√3/4)（图① t = 1/2）
       B′ = B 关于该定直线的对称点 = (6, 6√3)
       min(EF + EB) = B′F = 3√7（t = 1/3）
       G = BE 与直线 AC 的交点 = (9/2, 9√3/2)，CG = 3

   四张图各用题解给定的 view（scale / ox / oy），直接照搬：
       图① 64 / 258 / 421.5    图② 52 / 294 / 448
       图③ 48 / 306 / 442      图③′ 34 / 348 / 432

   ★ 答案线与已有边共线时，front 的顺序就是答案的可见性 ★
     本题共四处（都已在 LIFT 里排好，答案线一律排在"被它压住的那条"
     之后，并适当加粗）：
       · 图②  AD 落在边 CA 上            → LIFT2 里 sAD 排在 sCA 之后
       · 图②③③′  CE 落在 E 的轨迹线上  → sCE 排在 sLocus 之后
       · 图③  EG 是 BE 的延长段          → sEG 排在 sBE 之后
       · 图③  CG 落在直线 AC 上          → sCG 排在 sCA 之后
       · 图③′ B′F 同时压住 B′E 与 EF    → sBpF 排在两者之后，且最粗
   ============================================================ */
(function () {
  var AN = window.ANNO, ML = window.ML;
  var COL = AN.COL, FS = AN.FS;
  var sub = AN.sub, add = AN.add, mul = AN.mul, unit = AN.unit, dist = AN.dist, mid = AN.mid;

  var S3 = Math.sqrt(3);

  /* ---------- 视图：数学坐标 → 画布坐标（题解原式 X = ox + scale·x） ---------- */
  function V(scale, ox, oy) {
    return function (x, y) { return [ox + scale * x, oy - scale * y]; };
  }
  var V1 = V(64, 258, 421.5);
  var V2 = V(52, 294, 448);
  var V3 = V(48, 306, 442);
  var V4 = V(34, 348, 432);

  /* ---------- 图元小工厂 ---------- */
  function LN(id, a, b, color, sw, dash) {
    var o = { id: id, k: 'line', a: a, b: b, stroke: color, sw: sw };
    if (dash) o.dash = dash;
    return o;
  }
  // 顶点字母：位置用题解 labels 的 at / anchor
  function NM(id, at, text, anchor) {
    return { id: id, k: 'text', at: at, text: text, size: FS.V, fill: COL.INK, weight: 700, anchor: anchor || 'middle', halo: false };
  }
  function DOT(id, c, color, r) {
    return { id: id, k: 'circ', c: c, r: r == null ? 4 : r, fill: color, stroke: color };
  }
  // 平行记号：同一条线上两道短杠（和"等长 tick"区分开）。
  // 位置默认放在 72% 处 —— 等长 tick 都在中点，两个记号和在一处会叠成一团。
  function PAR(id, X, Y, color, frac) {
    var u = unit(sub(Y, X));
    var m = add(X, mul(u, dist(X, Y) * (frac == null ? 0.72 : frac)));
    return [
      AN.tick(id + 'a', add(m, mul(u, -5)), add(m, mul(u, 5)), color, 7, 0),
      AN.tick(id + 'b', add(m, mul(u, 5)), add(m, mul(u, 15)), color, 7, 0)
    ];
  }
  // 收集 id（给 front / delNow 用；AN.angle 返回数组，必须摊平）
  function ids() {
    var out = [];
    for (var i = 0; i < arguments.length; i++) {
      var v = arguments[i];
      if (Array.isArray(v)) {
        v.forEach(function (x) { if (x && x.id) out.push(x.id); });
      } else if (v && v.id) out.push(v.id);
    }
    return out;
  }
  // 收集元素本身（给 add 用）。★ 千万别把 ids() 塞进 add：
  // 引擎拿到字符串会静默建一个空 <g>，画面缺元素而所有数值判据仍然全绿。
  function pick() {
    var out = [];
    for (var i = 0; i < arguments.length; i++) {
      var v = arguments[i];
      if (Array.isArray(v)) {
        v.forEach(function (x) { if (x && x.id) out.push(x); });
      } else if (v && v.id) out.push(v);
    }
    return out;
  }
  function allIds(o) {
    var out = [];
    Object.keys(o).forEach(function (k) { out = out.concat(ids(o[k])); });
    return out;
  }

  /* ---------- 画布左上角的账本（只写算式，中文留给字幕） ---------- */
  var LED = ['led0', 'led1', 'led2'];
  function led(lines) {
    return lines.map(function (t, i) {
      return AN.txt('led' + i, [40, 36 + i * 26], t, {
        size: 16, anchor: 'start',
        color: i === lines.length - 1 ? COL.RED : COL.INK
      });
    });
  }

  /* ============================================================
     图①  t = 1/2：证 DE ⊥ BC
     ============================================================ */
  var F1 = (function () {
    var q = 'a', e = {};
    var Ap = V1(0, 0), Bp = V1(6, 0), Cp = V1(3, 3 * S3),
        Dp = V1(1.5, 1.5 * S3), Ep = V1(6, 3 * S3), Pp = V1(3.75, 2.25 * S3);

    e.fill = { id: q + 'fill', k: 'poly', pts: [Ap, Bp, Cp], fill: AN.wash('238,241,247', 0.75), stroke: 'none' };
    e.sAB = LN(q + 'sAB', Ap, Bp, COL.EDGE, 2.4);
    e.sBC = LN(q + 'sBC', Bp, Cp, COL.EDGE, 2.4);
    e.sCA = LN(q + 'sCA', Cp, Ap, COL.EDGE, 2.4);
    e.sBD = LN(q + 'sBD', Bp, Dp, COL.TEAL, 2.6);       // AC 边上的中线
    e.sDE = LN(q + 'sDE', Dp, Ep, COL.PURPLE, 2.6);     // 待证与 BC 垂直
    e.sBE = LN(q + 'sBE', Bp, Ep, COL.PURPLE, 2.6);

    e.nA = NM(q + 'nA', [248, 439.5], 'A', 'end');
    e.nB = NM(q + 'nB', [652, 439.5], 'B', 'start');
    e.nC = NM(q + 'nC', [442, 72.95], 'C', 'end');
    e.nD = NM(q + 'nD', [342, 247.22], 'D', 'end');
    e.nE = NM(q + 'nE', [654, 80.95], 'E', 'start');
    e.nP = NM(q + 'nP', [498, 196.08], 'P', 'middle');

    e.dotD = DOT(q + 'dotD', Dp, COL.TEAL);
    e.dotE = DOT(q + 'dotE', Ep, COL.PURPLE);
    e.dotP = DOT(q + 'dotP', Pp, COL.RED);

    // 直角：D 处（BD ⊥ AC）、P 处（DE ⊥ BC）。
    // P 处的方角画在 PE 与 PC 张成的那个夹角里 —— 四条角都是直角，画在上面
    // 才不会撞到题解给的 P 字母（P 字母在 P 的正下方）。
    e.rD = AN.right(q + 'rD', Dp, sub(Ap, Dp), sub(Bp, Dp), 14, COL.RED);
    e.rP = AN.right(q + 'rP', Pp, sub(Ep, Pp), sub(Cp, Pp), 14, COL.RED);

    // B 处的四个角：三个 30° 用同色同半径，60° 用外圈把两个 30° 括起来
    e.aABD = AN.angle(q + 'aABD', Bp, Ap, Dp, 46, COL.GREEN);
    e.aDBC = AN.angle(q + 'aDBC', Bp, Dp, Cp, 46, COL.GREEN);
    e.aCBE = AN.angle(q + 'aCBE', Bp, Cp, Ep, 46, COL.GREEN);
    e.aDBE = AN.angle(q + 'aDBE', Bp, Dp, Ep, 74, COL.PURPLE);

    // P 是 DE 中点：DP = EP
    e.tkDP = AN.tick(q + 'tkDP', Dp, Pp, COL.RED, 9, 0);
    e.tkEP = AN.tick(q + 'tkEP', Ep, Pp, COL.RED, 9, 0);
    return e;
  })();

  var LIFT1 = ids(
    F1.sCA, F1.sAB, F1.sBC, F1.sBD, F1.sDE, F1.sBE,
    F1.rD, F1.rP, F1.tkDP, F1.tkEP,
    F1.aABD, F1.aDBC, F1.aCBE, F1.aDBE,
    F1.dotD, F1.dotE, F1.dotP,
    F1.nA, F1.nB, F1.nC, F1.nD, F1.nE, F1.nP
  );

  /* ============================================================
     图②  一般位置 t = 1/4：讲 E 的轨迹 + 证 CE ∥ AB
     ============================================================ */
  var F2 = (function () {
    var q = 'b', e = {};
    var Ap = V2(0, 0), Bp = V2(6, 0), Cp = V2(3, 3 * S3),
        Dp = V2(0.75, 0.75 * S3), Ep = V2(4.5, 3 * S3);

    e.fill = { id: q + 'fill', k: 'poly', pts: [Ap, Bp, Cp], fill: AN.wash('238,241,247', 0.75), stroke: 'none' };
    e.sAB = LN(q + 'sAB', Ap, Bp, COL.EDGE, 2.4);
    e.sBC = LN(q + 'sBC', Bp, Cp, COL.EDGE, 2.4);
    e.sCA = LN(q + 'sCA', Cp, Ap, COL.EDGE, 2.4);
    e.sBD = LN(q + 'sBD', Bp, Dp, COL.TEAL, 2.6);
    e.sDE = LN(q + 'sDE', Dp, Ep, COL.PURPLE, 2.6);
    e.sBE = LN(q + 'sBE', Bp, Ep, COL.PURPLE, 2.6);

    // E 的轨迹：过 C 且平行 AB 的定直线（往右延长，越过 E 才看得出是"一条线"）
    e.sLocus = LN(q + 'sLocus', Cp, [660, Cp[1]], COL.GREY, 2, [7, 5]);
    e.sCE = LN(q + 'sCE', Cp, Ep, COL.BLUE, 3);          // 第(2)问的答案线
    e.sAD = LN(q + 'sAD', Ap, Dp, COL.ORANGE, 3.2);      // 落在边 CA 上，必须排在 sCA 之后

    // 手拉手的两个三角形（同一语义同一个色，别用互补色暗示"不同"）
    e.fABD = { id: q + 'fABD', k: 'poly', pts: [Ap, Bp, Dp], fill: AN.wash('124,58,237', 0.11), stroke: 'none' };
    e.fCBE = { id: q + 'fCBE', k: 'poly', pts: [Cp, Bp, Ep], fill: AN.wash('124,58,237', 0.11), stroke: 'none' };

    e.nA = NM(q + 'nA', [284, 466], 'A', 'end');
    e.nB = NM(q + 'nB', [616, 466], 'B', 'start');
    e.nC = NM(q + 'nC', [436, 163.8], 'C', 'end');
    e.nD = NM(q + 'nD', [321, 372.45], 'D', 'end');
    e.nE = NM(q + 'nE', [540, 156], 'E', 'start');

    e.dotD = DOT(q + 'dotD', Dp, COL.TEAL);
    e.dotE = DOT(q + 'dotE', Ep, COL.PURPLE);

    // 角：∠ABD 与 ∠CBE 同色同半径（相等），∠DBE 用外圈（60°）
    e.aABD = AN.angle(q + 'aABD', Bp, Ap, Dp, 52, COL.GREEN);
    e.aCBE = AN.angle(q + 'aCBE', Bp, Cp, Ep, 52, COL.GREEN);
    e.aDBE = AN.angle(q + 'aDBE', Bp, Dp, Ep, 76, COL.PURPLE);
    // ∠BCE 与 ∠ABC 是一对内错角：同色同半径最能说明它们相等。
    // 且 ∠ABC 必须比 ∠ABD 小一圈（两者均从 B 出发，同半径会重叠成一道）。
    // 内错角一对：用 BLUE 与其他角区开（∠ABC = 60° 必然跨过 BD，若同色会和 ∠ABD 混成一串断弧）
    e.aBCE = AN.angle(q + 'aBCE', Cp, Bp, Ep, 40, COL.BLUE);
    e.aABC = AN.angle(q + 'aABC', Bp, Ap, Cp, 40, COL.BLUE);

    // 等长记号：AB = CB（紫）、BD = BE（橙）、AD = CE（绿）
    e.tkAB = AN.tick(q + 'tkAB', Ap, Bp, COL.PURPLE, 9, 0);
    e.tkCB = AN.tick(q + 'tkCB', Bp, Cp, COL.PURPLE, 9, 0);
    e.tkBD = AN.tick(q + 'tkBD', Bp, Dp, COL.ORANGE, 9, 0);
    e.tkBE = AN.tick(q + 'tkBE', Bp, Ep, COL.ORANGE, 9, 0);
    e.tkAD = AN.tick(q + 'tkAD', Ap, Dp, COL.GREEN, 8, 0);
    // CE 只有 78px ：等长 tick 沿线左移 14，与平行双杠（~503/513）拉开
    e.tkCE = AN.tick(q + 'tkCE', Cp, Ep, COL.GREEN, 8, -14);

    // 平行记号：AB 与 CE 各两道短杠。用 BLUE（跟 CE、内错角弧同一族）——
    // 若用 GREEN 会和"等长 tick"撞语义（CE 上两者只隔十几像素）。
    e.parAB = PAR(q + 'parAB', Ap, Bp, COL.BLUE);
    e.parCE = PAR(q + 'parCE', Cp, Ep, COL.BLUE, 0.78);
    return e;
  })();

  var LIFT2 = ids(
    F2.sCA, F2.sAB, F2.sBC, F2.sLocus, F2.sBD, F2.sDE, F2.sBE,
    F2.sAD, F2.sCE,
    F2.aABD, F2.aCBE, F2.aDBE, F2.aBCE, F2.aABC,
    F2.tkAB, F2.tkCB, F2.tkBD, F2.tkBE, F2.tkAD, F2.tkCE,
    F2.parAB, F2.parCE,
    F2.dotD, F2.dotE,
    F2.nA, F2.nB, F2.nC, F2.nD, F2.nE
  );

  /* ============================================================
     图③  最优位置 t = 1/3：将军饮马 + 求 G、CG
     ============================================================ */
  var F3 = (function () {
    var q = 'c', e = {};
    var Ap = V3(0, 0), Bp = V3(6, 0), Cp = V3(3, 3 * S3),
        Dp = V3(1, S3), Ep = V3(5, 3 * S3),
        Fp = V3(4.5, 1.5 * S3), Gp = V3(4.5, 4.5 * S3);

    e.fill = { id: q + 'fill', k: 'poly', pts: [Ap, Bp, Cp], fill: AN.wash('238,241,247', 0.75), stroke: 'none' };
    e.sAB = LN(q + 'sAB', Ap, Bp, COL.EDGE, 2.4);
    e.sBC = LN(q + 'sBC', Bp, Cp, COL.EDGE, 2.4);
    e.sCA = LN(q + 'sCA', Cp, Ap, COL.EDGE, 2.4);
    e.sLocus = LN(q + 'sLocus', Cp, [620, Cp[1]], COL.GREY, 2, [7, 5]);
    e.sBD = LN(q + 'sBD', Bp, Dp, COL.TEAL, 2.6);
    e.sDE = LN(q + 'sDE', Dp, Ep, COL.PURPLE, 2.6);
    e.sBE = LN(q + 'sBE', Bp, Ep, COL.PURPLE, 2.6);
    e.sCE = LN(q + 'sCE', Cp, Ep, COL.BLUE, 3);
    e.sEF = LN(q + 'sEF', Ep, Fp, COL.RED, 3);            // EF + EB 里的一段
    e.sEG = LN(q + 'sEG', Ep, Gp, COL.GREY, 2.2, [7, 5]); // BE 的延长段（与 BE 共线）
    e.sCG = LN(q + 'sCG', Cp, Gp, COL.RED, 3.8);          // 答案线（落在直线 AC 上）

    e.nA = NM(q + 'nA', [296, 460], 'A', 'end');
    e.nB = NM(q + 'nB', [604, 460], 'B', 'start');
    e.nC = NM(q + 'nC', [442, 176.58], 'C', 'end');
    e.nD = NM(q + 'nD', [342, 350.86], 'D', 'end');
    e.nE = NM(q + 'nE', [558, 170], 'E', 'start');
    e.nF = NM(q + 'nF', [534, 310.29], 'F', 'start');
    e.nG = NM(q + 'nG', [506, 57.88], 'G', 'end');

    e.dotD = DOT(q + 'dotD', Dp, COL.TEAL);
    e.dotE = DOT(q + 'dotE', Ep, COL.PURPLE);
    e.dotF = DOT(q + 'dotF', Fp, COL.RED);
    e.dotG = DOT(q + 'dotG', Gp, COL.RED);
    return e;
  })();

  var LIFT3 = ids(
    F3.sCA, F3.sAB, F3.sBC, F3.sLocus, F3.sBD, F3.sDE, F3.sBE,
    F3.sCE, F3.sEF, F3.sEG, F3.sCG,
    F3.dotD, F3.dotE, F3.dotF, F3.dotG,
    F3.nA, F3.nB, F3.nC, F3.nD, F3.nE, F3.nF, F3.nG
  );

  /* ============================================================
     图③′  同一位置 + 对称点 B′：将军饮马、三点共线拉直
     ============================================================ */
  var F4 = (function () {
    var q = 'd', e = {};
    var Ap = V4(0, 0), Bp = V4(6, 0), Cp = V4(3, 3 * S3),
        Dp = V4(1, S3), Ep = V4(5, 3 * S3), Fp = V4(4.5, 1.5 * S3),
        Bpd = V4(6, 6 * S3);

    e.fill = { id: q + 'fill', k: 'poly', pts: [Ap, Bp, Cp], fill: AN.wash('238,241,247', 0.75), stroke: 'none' };
    e.sAB = LN(q + 'sAB', Ap, Bp, COL.EDGE, 2.4);
    e.sBC = LN(q + 'sBC', Bp, Cp, COL.EDGE, 2.4);
    e.sCA = LN(q + 'sCA', Cp, Ap, COL.EDGE, 2.4);
    // 重线延伸过 B′B 那一列，让"对称轴垂直平分 BB′"看得见
    e.sLocus = LN(q + 'sLocus', Cp, [566, Cp[1]], COL.GREY, 2, [7, 5]);
    e.sBD = LN(q + 'sBD', Bp, Dp, COL.TEAL, 2.6);
    e.sDE = LN(q + 'sDE', Dp, Ep, COL.PURPLE, 2.6);
    e.sBE = LN(q + 'sBE', Bp, Ep, COL.PURPLE, 2.6);
    e.sCE = LN(q + 'sCE', Cp, Ep, COL.BLUE, 3);
    e.sEF = LN(q + 'sEF', Ep, Fp, COL.RED, 3);
    e.sBBp = LN(q + 'sBBp', Bp, Bpd, COL.GREY, 1.8, [5, 4]);
    e.sBpE = LN(q + 'sBpE', Bpd, Ep, COL.PURPLE, 2.6);   // EB 的镜像，同色表示"长度没变"
    e.sBpF = LN(q + 'sBpF', Bpd, Fp, COL.RED, 3.8);       // 拉直后的答案线：压住 B′E 与 EF

    e.nA = NM(q + 'nA', [338, 450], 'A', 'end');
    e.nB = NM(q + 'nB', [562, 450], 'B', 'start');
    e.nC = NM(q + 'nC', [442, 239.33], 'C', 'end');
    e.nD = NM(q + 'nD', [370, 365.11], 'D', 'end');
    e.nE = NM(q + 'nE', [530, 233], 'E', 'start');
    e.nF = NM(q + 'nF', [513, 336.67], 'F', 'start');
    e.nBp = NM(q + 'nBp', [566, 72.66], 'B′', 'start');

    e.dotD = DOT(q + 'dotD', Dp, COL.TEAL);
    // E 在「三点共线」那一帧要正好落在 B′F 上：紫点会被 3.8px 的红粗线吃掉，
    // 所以改成红点并放大。LIFT4 里 dotE 排在 sBpF 之后，它稳在粗线之上。
    e.dotE = DOT(q + 'dotE', Ep, COL.RED, 6);
    e.dotF = DOT(q + 'dotF', Fp, COL.RED);
    e.dotBp = DOT(q + 'dotBp', Bpd, COL.RED);

    // 拉直后读出来的长度
    e.tLen = AN.txt(q + 'tLen', [578, 176], 'B′F = 3√7', { size: 16, color: COL.RED, anchor: 'start', weight: 700, halo: true });
    return e;
  })();

  var LIFT4 = ids(
    F4.sCA, F4.sAB, F4.sBC, F4.sLocus, F4.sBD, F4.sDE, F4.sBE,
    F4.sCE, F4.sEF, F4.sBBp, F4.sBpE, F4.sBpF,
    F4.dotD, F4.dotE, F4.dotF, F4.dotBp,
    F4.tLen,
    F4.nA, F4.nB, F4.nC, F4.nD, F4.nE, F4.nF, F4.nBp
  );

  /* ---------- 切图时要清掉的整张图（含只在后面几步才出现的元素） ---------- */
  var ALL1 = allIds(F1);
  var ALL2 = allIds(F2);
  var ALL3 = allIds(F3);
  var ALL4 = allIds(F4);

  // 每张图"进门"时一次性要画的东西
  var BASE2 = [F2.fill, F2.sAB, F2.sBC, F2.sCA, F2.nA, F2.nB, F2.nC];
  var BASE3 = [F3.fill, F3.sAB, F3.sBC, F3.sCA, F3.sLocus, F3.sBD, F3.sDE, F3.sBE,
               F3.sCE, F3.sEF, F3.dotD, F3.dotE, F3.dotF,
               F3.nA, F3.nB, F3.nC, F3.nD, F3.nE, F3.nF];
  var BASE4 = [F4.fill, F4.sAB, F4.sBC, F4.sCA, F4.sLocus, F4.sBD, F4.sDE, F4.sBE,
               F4.sCE, F4.sEF, F4.sBBp, F4.dotD, F4.dotE, F4.dotF,
               F4.nA, F4.nB, F4.nC, F4.nD, F4.nE, F4.nF];

  /* ============================================================
     步骤
     ============================================================ */
  var steps = [

    /* ---------------- 建系 ---------------- */
    {
      say: '先看清这个图形。底下那条横线，左端是 A、右端是 B；上面那个尖顶是 C。三条边一样长，每条都是六——这就是题目里的等边三角形。',
      cite: '题设：△ABC 是边长为 6 的等边三角形',
      eq: 'AB = BC = CA = 6，∠ABC = 60°',
      add: BASE2.concat(led(['AB = BC = CA = 6'])),
      front: LIFT2
    },
    {
      say: '把它放进坐标系。让 A 待在原点，让 AB 这条边正好压在横轴上，那 B 就落在横坐标六的位置。C 在 AB 的正上方、正对着 AB 的中点，高度是边长乘二分之根号三，算出来是三倍根号三。',
      cite: '等边三角形的高 = 边长 × 二分之根号三；顶点落在底边中点的正上方',
      eq: 'A(0,0)，B(6,0)，C(3, 3√3)',
      delNow: LED,
      add: led(['A(0,0)，B(6,0)，C(3, 3√3)']),
      front: LIFT2
    },
    {
      say: '题目里那个动点 D，就待在 A 到 C 这条斜边上。用一个数 t 记它走了多远：从 A 出发走 t 段，t 是零就在 A，t 是一就在 C。题目说 D 跟两个端点都不重合，所以 t 只能在零到一之间。',
      cite: '线段上的点 = 起点 + 参数 × 整条向量',
      eq: 'D = A + t(C − A) = (3t, 3√3 t)，0 < t < 1',
      delNow: LED,
      add: [F2.dotD, F2.nD, F2.sBD].concat(led(['D(3t, 3√3 t)，0 < t < 1'])),
      front: LIFT2
    },
    {
      say: '接着看题目的要求：以 BD 为边，在 AB 上方再作一个等边三角形，第三个顶点叫 E。等边的意思就是 BD 和 BE 一样长、夹角六十度。换个更好用的说法：把 BD 这条线绕着 B 点顺时针转六十度，D 落到的位置就是 E。为什么非得是顺时针？往逆时针转，E 就跑到 AB 下面去了，和题目说的「在 AB 上方」不符。',
      cite: '等边 △BDE ⟹ BE = BD、∠DBE = 60°；E 是 D 绕 B 顺时针转 60° 的像（取 AB 上方那一侧）',
      eq: 'BE = BD，∠DBE = 60°',
      delNow: LED,
      add: [F2.sDE, F2.sBE, F2.dotE, F2.nE].concat(led(['BE = BD，∠DBE = 60°'])),
      front: LIFT2
    },
    {
      say: '把这转动算出来。D 相对 B 的坐标差，是横的三 t 减六、纵的三倍根号三 t；顺时针转六十度之后，这两个数变成六 t 减三和三倍根号三；再加回 B 的坐标，E 就是横坐标三加六 t、纵坐标三倍根号三。',
      cite: '旋转六十度的坐标变换：新横 = 横×二分之一 + 纵×二分之根号三，新纵 = 纵×二分之一 − 横×二分之根号三',
      eq: 'BD = (3t − 6, 3√3 t) ⟹ BE = (6t − 3, 3√3) ⟹ E(3 + 6t, 3√3)',
      delNow: LED,
      add: led(['E(3 + 6t, 3√3)']),
      front: LIFT2
    },
    {
      say: '盯住 E 的纵坐标：三倍根号三，里头一个 t 都没有。这意味着不管 D 挪到哪儿，E 永远待在同一高度上——刚好跟 C 一样高。也就是说，E 被钉死在一条横线上：过 C、并且和 AB 平行的那条定直线。t 从零走到一，E 就从 C 出发，一路向右滑到离 C 六个单位的地方。这一步是全题的枢纽，慢一点看。',
      cite: '纵坐标恒等于同一个常数 ⟹ 轨迹是水平直线；AB 本身水平，故这条轨迹与 AB 平行',
      eq: 'y(E) = 3√3 = y(C) ⟹ E 在过 C 且平行于 AB 的定直线上，CE = 6t',
      delNow: LED,
      add: [F2.sLocus, F2.sCE].concat(led(['E 的轨迹：过 C 且 ∥ AB 的定直线'])),
      front: LIFT2,
      hold: 3600
    },

    /* ---------------- 第 (1) 问：DE ⊥ BC ---------------- */
    {
      say: '下面先看第（一）问。它把 D 定在 AC 的正中间，也就是参数等于二分之一。画面换成另一张图：D 到了斜边中点，E 顺着那条横线跑到横坐标六的地方，正好在 B 的正上方，跟 C 齐平。',
      cite: '中点 ⟹ t = 1/2',
      eq: 't = 1/2 ⟹ D(3/2, 3√3/2)，E(6, 3√3)',
      delNow: ALL2.concat(LED),
      add: [F1.fill, F1.sAB, F1.sBC, F1.sCA, F1.sBD, F1.sDE, F1.sBE,
            F1.dotD, F1.dotE, F1.nA, F1.nB, F1.nC, F1.nD, F1.nE]
        .concat(led(['t = 1/2：D(3/2, 3√3/2)，E(6, 3√3)'])),
      front: LIFT1
    },
    {
      say: 'D 是等边三角形边 AC 的中点，所以从 B 连到 D 的这条线，就是 AC 边上的中线。等边三角形有个好脾气叫三线合一：这条中线同时也是高、也是顶角的角平分线。于是 BD 垂直于 AC——D 处标出直角——顶角那六十度也被平分成两个三十度。',
      cite: '等边三角形三线合一：底边上的中线、高、顶角平分线互相重合',
      eq: 'BD ⊥ AC，∠ABD = ∠DBC = 60° ÷ 2 = 30°',
      delNow: LED,
      add: pick(F1.rD, F1.aABD, F1.aDBC).concat(led(['∠ABD = ∠DBC = 30°'])),
      front: LIFT1
    },
    {
      say: '再看 E 那一侧。三角形 BDE 是等边三角形，所以角 DBE 是六十度——图上最外面那道紫色的弧，就是把 BD 和 BE 一起括起来的那一道。而 BC 这条线从 B 出发，正好夹在 BD 和 BE 中间，所以角 CBE 等于六十度减去角 DBC 的三十度，剩下三十度。',
      cite: '等边三角形内角六十度；角的和差',
      eq: '∠CBE = ∠DBE − ∠DBC = 60° − 30° = 30°',
      delNow: LED,
      add: pick(F1.aDBE, F1.aCBE).concat(led(['∠CBE = 60° − 30° = 30°'])),
      front: LIFT1
    },
    {
      say: '题目让 DE 和 BC 相交，把交点记作 P——就是图上那个红色小点，两条线的交叉处。现在盯住三角形 BDP：它在 D 处那个角是六十度，因为 DE 是等边三角形的一条边；在 B 处那个角是三十度，就是刚才的角 DBC。两个角加起来九十度，剩下的角 BPD 只能是一百八十减九十，等于九十度。这就是 DE 垂直于 BC，第（一）问证完。',
      cite: '三角形内角和一百八十度',
      eq: '∠BDP = ∠BDE = 60°，∠DBP = ∠DBC = 30° ⟹ ∠BPD = 90° ⟹ DE ⊥ BC',
      delNow: LED,
      add: [F1.dotP, F1.nP, F1.rP].concat(led(['∠BPD = 180° − 60° − 30° = 90°'])),
      front: LIFT1
    },
    {
      say: '顺便讲一个很讨喜的事实：这个垂足 P 并不是随便落在线段 DE 上的，它正好把 DE 劈成相等的两半。道理也不难：BD 和 BE 一样长，BP 是公共边，两边夹的角都是三十度，两个三角形全等，对应边自然相等。',
      cite: '边角边（SAS）：△BDP ≌ △BEP ⟹ DP = EP',
      eq: '△BDP ≌ △BEP（BD = BE，BP 公共，∠DBP = ∠EBP = 30°）⟹ DP = EP',
      delNow: LED,
      add: [F1.tkDP, F1.tkEP].concat(led(['P 是 DE 中点：DP = EP'])),
      front: LIFT1
    },

    /* ---------------- 第 (2) 问：CE ∥ AB ---------------- */
    {
      say: '回到第（二）问，换成一般位置这张图：D 不再取中点，随便停在 AC 上。题目连了一条 CE，要证的是 CE 和 AB 这条底边平行。',
      cite: '题设：连接 CE，(2) 求证 CE ∥ AB',
      eq: '求证：CE ∥ AB',
      delNow: ALL1.concat(LED),
      add: BASE2.concat([F2.dotD, F2.nD, F2.sBD, F2.sDE, F2.sBE, F2.dotE, F2.nE, F2.sLocus, F2.sCE],
        led(['求证：CE ∥ AB'])),
      front: LIFT2
    },
    {
      say: '图上有两个等边三角形：外面大的是 ABC，里面小的是 BDE，它们共用顶点 B，各自从 B 拉出两条一样长的边——这种图形在题目里有个外号，叫手拉手。见到手拉手，第一件事就是去找一对全等三角形：在两个三角形里各挑一条「连接边」，一条是 A 到 D，一条是 C 到 E。',
      cite: '手拉手模型：公共顶点的两个等边三角形，必有一对可用边角边判定的全等三角形',
      eq: '考察 △ABD 与 △CBE',
      delNow: LED,
      add: [F2.fABD, F2.fCBE, F2.sAD].concat(led(['找全等：△ABD 与 △CBE'])),
      front: LIFT2
    },
    {
      say: '不过在凑条件之前，得先澄清一件事：BC 这条线到底在不在角 DBE 的内部。这句话不能想当然，得用反证。假设 E 落在 BD 靠近 A 的那一侧——别忘了 E 必须在 AB 上方，这样一来 BE 就夹在 BA 和 BD 中间，角 DBE 一定比角 ABD 小；而角 ABD 是六十度减去角 DBC，本来就不满六十度。于是角 DBE 小于六十度。可它偏偏是等边三角形的内角，必须等于六十度，矛盾。所以 E 只能在另一侧，BC 稳稳落在角 DBE 的内部。',
      cite: '反证法：若 E 在 BD 靠 A 的一侧，则由 E 在 AB 上方知 BE 落在 ∠ABD 内部，得 ∠DBE < ∠ABD = 60° − ∠DBC < 60°，与 ∠DBE = 60° 矛盾',
      eq: '∠ABD = 60° − ∠DBC < 60° = ∠DBE ⟹ BC 在 ∠DBE 内部',
      delNow: LED,
      add: pick(F2.aDBE, F2.aABD, F2.aCBE).concat(led(['BC 在 ∠DBE 内部（反证）'])),
      front: LIFT2
    },
    {
      say: '位置定下来了，夹角就顺理成章。角 ABD 等于六十度减去角 DBC；角 CBE 等于角 DBE 的六十度减去同一个角 DBC。两个角都是六十度减同一只角，所以相等——图上这两道绿色的弧就是。</',
      cite: '等边三角形内角六十度；角的和差',
      eq: '∠ABD = 60° − ∠DBC = ∠CBE',
      delNow: LED,
      add: led(['∠ABD = ∠CBE']),
      front: LIFT2
    },
    {
      say: '条件齐了：AB 和 CB 都是边长六，一样长；BD 和 BE 是同一个等边三角形的两条边，也一样长；中间夹的那个角刚才证了相等。两边夹一角，三角形 ABD 和三角形 CBE 全等。',
      cite: '边角边（SAS）',
      eq: '△ABD ≌ △CBE（AB = CB，BD = BE，∠ABD = ∠CBE）',
      delNow: LED,
      add: pick(F2.tkAB, F2.tkCB, F2.tkBD, F2.tkBE).concat(led(['△ABD ≌ △CBE（SAS）'])),
      front: LIFT2
    },
    {
      say: '全等一落地，对应角和对应边就对上了：角 BCE 等于角 BAD，而角 BAD 是等边三角形的内角六十度；同时 AD 等于 CE。也就是说 D 走到哪儿，CE 就跟着长到多长——这跟前面用坐标算出来的 CE 等于六 t，是同一件事。',
      cite: '全等三角形的对应角相等、对应边相等',
      eq: '∠BCE = ∠BAD = 60°，AD = CE = 6t',
      delNow: LED,
      add: pick(F2.aBCE, F2.tkAD, F2.tkCE).concat(led(['AD = CE = 6t'])),
      front: LIFT2
    },
    {
      say: '最后看平行。D 在 AC 上，所以 A 和 D 在直线 BC 的同侧；而刚才反证过 BC 夹在 BD 和 BE 中间，E 就在 BC 的另一侧。于是角 BCE 和角 ABC 就是 AB、CE 这两条线被 BC 截出来的一对内错角。内错角相等，两条线就平行：CE 平行于 AB。第（二）问到此证完。',
      cite: '内错角相等，两直线平行',
      eq: '∠BCE = ∠ABC = 60°（内错角）⟹ CE ∥ AB',
      delNow: LED,
      add: pick(F2.aABC, F2.parAB, F2.parCE).concat(led(['CE ∥ AB'])),
      front: LIFT2,
      hold: 3200
    },

    /* ---------------- 第 (3) 问：EF + EB 最小 ---------------- */
    {
      say: '第（三）问加进一个新点：F 是 BC 的中点。画面换成取到最小值的那张图：E 停在横坐标五的位置，D 把 AC 分成了靠近 A 的一比二。现在要最小化的是两段加起来——E 到 F，加上 E 到 B。B 和 F 都钉死不动，只有 E 在那条横线上滑。',
      cite: '题设：F 是 BC 的中点；求 EF + EB 的最小值',
      eq: 'F = (B + C) ÷ 2 = (9/2, 3√3/2)；求 min(EF + EB)',
      delNow: ALL2.concat(LED),
      add: BASE3.concat(led(['F(9/2, 3√3/2)，求 min(EF + EB)'])),
      front: LIFT3
    },
    {
      say: '两段相加、动点卡在一条直线上，老办法只有一个名字：将军饮马——把其中一个定点关于那条直线翻个面。这里把 B 翻到横线的另一侧，落点记作 B 撇，就是图上最上面那个点。B 的纵坐标是零，横线的高度是三倍根号三，翻过去变成六倍根号三，横坐标不动。为了把 B 撇装进画面，这张图整体缩小了一点，图形关系一模一样。翻折是对称变换，所以 E 到 B 的距离，永远等于 E 到 B 撇的距离。',
      cite: '将军饮马：把一定点关于动点所在的定直线作对称；轴对称保持距离',
      eq: 'B′(6, 6√3)，EB = EB′',
      delNow: ALL3.concat(LED),
      add: BASE4.concat([F4.dotBp, F4.nBp, F4.sBpE],
        led(['B′(6, 6√3)', 'EB = EB′'])),
      front: LIFT4
    },
    {
      say: '现在把两段接起来看：EF 加 EB，就等于 EF 加 EB 撇。这条折线从 B 撇出发，先去横线上的某个点，再到 F。两点之间线段最短——折线再怎么绕，也不会比直接把 B 撇和 F 连起来更短。而图上这个位置刚好让三点拉成一条直线：B 撇、E、F 一顺排，折线被压直了。这时候两段的和，正好等于整条线段的长度，读出来是三倍根号七。',
      cite: '两点之间线段最短（三角形两边之和大于第三边）：EF + EB = EF + EB′ ≥ B′F',
      eq: 'EF + EB ≥ B′F = 3√7，等号 ⟺ B′、E、F 三点共线',
      delNow: LED,
      add: [F4.sBpF, F4.tLen].concat(led(['EF + EB ≥ B′F = 3√7'])),
      front: LIFT4,
      hold: 5200
    },
    {
      say: '这个长度算一下。横坐标从六走到四点五，差一点五；纵坐标从六倍根号三降到一点五倍根号三，差四点五倍根号三。两部分平方相加：四分之九加上四分之二百四十三，等于六十三，开根号是三倍根号七，约等于七点九四。',
      cite: '两点间距离公式；根号六十三 = 三倍根号七',
      eq: 'B′F = √[(3/2)² + (9√3/2)²] = √63 = 3√7 ≈ 7.94',
      delNow: LED,
      add: led(['B′F = √63 = 3√7 ≈ 7.94']),
      front: LIFT4
    },
    {
      say: '等号什么时候成立？就是 B 撇到 F 的这条线段正好穿过横线的那一点。从 B 撇往 F 走，纵坐标要从六倍根号三降到三倍根号三，一共降掉全程的三分之二；横坐标也走三分之二，从六走到五。所以取到最小值时 E 的横坐标是五，纵坐标还是三倍根号三——正是图上 E 待的位置。让三加六 t 等于五，解得参数是三分之一，D 的坐标就是一和根号三，AD 比 DC 等于一比二。三分之一确实落在零到一之间，说明最小值是在 AC 内部取到的；再核对两个端点：D 跑到 A 时这个和是九，跑到 C 时是十一多，都比七点九四要大。',
      cite: '定比分点：线段上的点按比例落位；最小值须在动点允许范围内取到，故检验参数区间并比较端点值',
      eq: 'E = B′ + (2/3)(F − B′) = (5, 3√3)；3 + 6t = 5 ⟹ t = 1/3；f(0) = 9，f(1) = 3√3 + 6',
      delNow: LED,
      add: led(['t = 1/3：D(1, √3)，AD : DC = 1 : 2']),
      front: LIFT4
    },
    {
      say: '位置定了，回到同一张图——只是把比例放大回来，看得更清楚。题目要求延长 BE，和直线 AC 相交于点 G。AC 这条线过原点和 C，方程是纵坐标等于根号三倍的横坐标；BE 这条线过 B，方向是 E 减 B，写成参数式就是横坐标六减 u、纵坐标三倍根号三乘 u。',
      cite: '两条直线求交点：把一条的参数式代入另一条的方程',
      eq: 'AC：y = √3 x；BE：(6 − u, 3√3 u)',
      delNow: ALL4.concat(LED),
      add: BASE3.concat([F3.sEG, F3.dotG, F3.nG], led(['AC：y = √3x', 'BE：(6 − u, 3√3u)'])),
      front: LIFT3
    },
    {
      say: '代进去算：三倍根号三乘 u 等于根号三乘括号六减 u，两边约掉根号三，三 u 等于六减 u，解出 u 等于一点五。把 u 代回去，G 的横坐标是四点五，纵坐标是四点五倍根号三。u 比一大，说明 G 落在 C 的外头——正好符合题目说的「延长之后才相交」。',
      cite: '参数的几何意义：同一条直线上参数之比就是距离之比',
      eq: '3u = 6 − u ⟹ u = 3/2；G = (9/2, 9√3/2)',
      delNow: LED,
      add: led(['3u = 6 − u ⟹ u = 3/2']),
      front: LIFT3
    },
    {
      say: '最后量 CG。C 是三和三倍根号三，G 是四点五和四点五倍根号三，两个坐标一减，横的差一点五、纵的差一点五倍根号三；平方和是二点二五加六点七五，等于九，开根号就是三。换个说法更快：C 在 AC 上对应参数一，G 对应参数一点五，正好走掉半条边，而边长是六，一半就是三。所以 CG 等于三——正好是边长的一半。放到一般位置，CG 等于六 t 除以一减 t，t 取三分之一时，同样得三。',
      cite: '两点间距离公式；同一直线上线段长按参数比例分配',
      eq: 'CG = √[(3/2)² + (3√3/2)²] = √9 = 3；一般式 CG = 6t/(1 − t)',
      delNow: LED,
      add: [F3.sCG].concat(led(['CG = 3'])),
      front: LIFT3,
      hold: 4600
    },
    {
      say: '三个答案汇总：第（一）问，DE 垂直于 BC，而且垂足 P 正好是 DE 的中点；第（二）问，CE 平行于 AB；第（三）问，CG 等于三，正好是边长的一半——取到最小值时参数是三分之一，EF 加 EB 的最小值是三倍根号七。整道题其实只靠一句话：E 被钉在一条定直线上，于是两段之和就变成了折线最短。',
      cite: '结论汇总',
      eq: 'DE ⊥ BC；CE ∥ AB；CG = 3',
      delNow: LED,
      add: [
        AN.txt('sum0', [650, 60], 'DE ⊥ BC（P 为 DE 中点）', { size: 16, anchor: 'start', color: COL.INK }),
        AN.txt('sum1', [650, 88], 'CE ∥ AB', { size: 16, anchor: 'start', color: COL.INK }),
        AN.txt('sum2', [650, 116], 'CG = 3 = 边长的一半', { size: 16, anchor: 'start', color: COL.RED, weight: 700 })
      ].concat(led(['CG = 3'])),
      front: LIFT3,
      hold: 5200
    }
  ];

  /* ---------- 存档 ---------- */
  window.MATHLAB_LESSONS = window.MATHLAB_LESSONS || [];
  window.MATHLAB_LESSONS.push({
    id: 'ws-b4-rot60',
    title: '手拉手 + 将军饮马：CG 为什么正好是边长的一半（讲义 B4）',
    grade: '初二',
    topic: '几何 · 旋转全等与最值',
    tags: ['几何', '等边三角形', '手拉手', '旋转', '将军饮马', '轴对称', '最值', '动点', '定直线', '反证'],
    question: '已知 △ABC 是边长为 6 的等边三角形，D 是边 AC 上的动点（点 D 不与 A、C 重合），以 BD 为边作等边三角形 BDE（点 E 在 AB 的上方）。(1) 如图①，当 D 为边 AC 的中点时，求证：DE ⊥ BC；(2) 如图②，连接 CE，求证：CE ∥ AB；(3) F 为边 BC 的中点，连接 EF，当 EF + EB 取得最小值时，延长 BE 与直线 AC 相交于点 G，求线段 CG 的长。',
    sourceImage: 'img/ws-b4-q.png',
    thumbStep: 5,
    methods: [
      {
        name: '旋转定直线 + 对称拉直 · 三问一条线',
        tier: 'proof',
        sub: '严格证明 · 28 步，含反证与端点检验',
        steps: steps
      }
    ]
  });
})();
