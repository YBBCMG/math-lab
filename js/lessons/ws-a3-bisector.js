/* ============================================================
   （11.16A）几何最值探究 · 轴对称变换 —— 第 3 题
   ------------------------------------------------------------
   题：∠ABC = ∠ADC = 90°，AC 与 BD 相交于点 E，∠ABD = ∠ADB。
     (1) 求证：AC 垂直平分 BD；
     (2) 过 B 作 BF ∥ CD 交 CA 延长线于 F，若 AB = AF，
         ① 求证：△BCD 是等边三角形；
         ② G、H 分别是 AC、CD 上的动点，当 GH + AH 最小时，
            写出 GH 与 CH 的数量关系并说明理由。

   几何摆法（设 CD = 1，以 C 为原点）：
     C = (0, 0)，D = (1/2, √3/2)，B = (−1/2, √3/2)，B、D 同上高
     A 在 AC 上：由 ∠ABC = 90° 得 A = (0, 2√3/3)
     E = BD 中点 = (0, √3/2)
     F = (0, 2√3/3 + √3/3) = (0, √3)       （BF ∥ CD 且 AB = AF）
     A 关于 CD 的对称点 A′ = (1, √3/3)
     G = A′ 到 AC 的垂足 = (0, √3/3)
     H = A′G 与 CD 的交点 = (1/3, √3/3)

   结论：GH + AH 最小时，CH = 2GH，最小值 A′G = 1（以 CD 为单位长）。
   ============================================================ */
(function () {
  var AN = window.ANNO, ML = window.ML;
  var COL = AN.COL, FS = AN.FS;
  var sub = AN.sub, add = AN.add, mul = AN.mul, unit = AN.unit, dist = AN.dist, along = AN.along;

  var S3 = Math.sqrt(3);

  /* ---------- 数学坐标 → 画布坐标 ----------
     数学坐标里 CD 是水平的、B 在 C 正右上方，和原题图 1 的摆法差一个整体
     旋转。这里统一顺时针转 60°：C 落左下、D 落右下、B 到顶、A 到右下侧，
     学生拿课程图去对原题图一眼能认出来。 */
  var TH = -60 * Math.PI / 180;
  var CC = Math.cos(TH), CSN = Math.sin(TH);
  var SC = 240;                  // 缩放
  var CXo = 0.75, CYo = 0.145;   // 视野中心（旋转后的坐标）
  function P(x, y) {
    var rx = x * CC - y * CSN;
    var ry = x * CSN + y * CC;
    return [450 + (rx - CXo) * SC, 288 - (ry - CYo) * SC];
  }

  /* ---------- 六个关键点的数学坐标 ---------- */
  var mC = [0, 0];
  var mD = [0.5, S3 / 2];
  var mB = [-0.5, S3 / 2];
  var mA = [0, 2 * S3 / 3];
  var mE = [0, S3 / 2];
  var mF = [0, S3];
  var mAp = [1, S3 / 3];         // A 关于 CD 的对称点 A′
  var mG = [0, S3 / 3];          // A′ 到 AC 的垂足
  var mH = [1 / 3, S3 / 3];      // A′G 与 CD 的交点

  var Cp = P(mC[0], mC[1]);
  var Dp = P(mD[0], mD[1]);
  var Bp = P(mB[0], mB[1]);
  var Ap = P(mA[0], mA[1]);
  var Ep = P(mE[0], mE[1]);
  var Fp = P(mF[0], mF[1]);
  var App = P(mAp[0], mAp[1]);
  var Gp = P(mG[0], mG[1]);
  var Hp = P(mH[0], mH[1]);

  var O = [(Ap[0] + Bp[0] + Cp[0] + Dp[0]) / 4, (Ap[1] + Bp[1] + Cp[1] + Dp[1]) / 4];

  /* ---------- 图元工厂 ---------- */
  function fig(p) {
    var e = {};
    // 四边形 ABCD 的底色（两个直角三角形拼起来）
    e.fillABD = { id: p + 'fABD', k: 'poly', pts: [Ap, Bp, Dp], fill: AN.wash('238,241,247', 0.85), stroke: 'none' };
    e.fillBCD = { id: p + 'fBCD', k: 'poly', pts: [Bp, Cp, Dp], fill: AN.wash('238,241,247', 0.55), stroke: 'none' };

    // 主边：AB、AD、BC、DC
    e.sAB = { id: p + 'sAB', k: 'line', a: Ap, b: Bp, stroke: COL.EDGE, sw: 2.4 };
    e.sAD = { id: p + 'sAD', k: 'line', a: Ap, b: Dp, stroke: COL.EDGE, sw: 2.4 };
    e.sBC = { id: p + 'sBC', k: 'line', a: Bp, b: Cp, stroke: COL.EDGE, sw: 2.4 };
    e.sDC = { id: p + 'sDC', k: 'line', a: Dp, b: Cp, stroke: COL.EDGE, sw: 2.4 };
    // 对角线 AC、BD
    e.sAC = { id: p + 'sAC', k: 'line', a: Ap, b: Cp, stroke: COL.EDGE, sw: 2.4 };
    e.sBD = { id: p + 'sBD', k: 'line', a: Bp, b: Dp, stroke: COL.EDGE, sw: 2.4 };

    // 顶点字母
    e.nA = AN.vname(p + 'A', Ap, O, 28);
    e.nB = AN.vname(p + 'B', Bp, O, 30);
    e.nC = AN.vname(p + 'C', Cp, O, 30);
    e.nD = AN.vname(p + 'D', Dp, O, 30);
    e.nE = AN.txt(p + 'vE', [Ep[0] + 22, Ep[1] + 3], 'E', { size: FS.V, weight: 700 });

    // 两个直角
    e.rB = AN.right(p + 'rB', Bp, sub(Ap, Bp), sub(Cp, Bp), 14, COL.RED);
    e.rD = AN.right(p + 'rD', Dp, sub(Ap, Dp), sub(Cp, Dp), 14, COL.RED);

    // ∠ABD 与 ∠ADB 相等（同色同半径）
    e.aABD = AN.angle(p + 'aABD', Bp, Ap, Dp, 52, COL.GREEN, null, { gap: 20 });
    e.aADB = AN.angle(p + 'aADB', Dp, Ap, Bp, 52, COL.GREEN, null, { gap: 20 });

    e.cap = AN.txt(p + 'cap', [50, 44],
      '∠ABC = ∠ADC = 90°，AC 与 BD 交于 E，∠ABD = ∠ADB',
      { size: FS.NOTE, anchor: 'start' });
    return e;
  }

  // 左下角账本：逐行写等式
  function ledger(p) {
    return function (lines) {
      return lines.map(function (t, i) {
        return AN.txt(p + 'led' + i, [50, 372 + i * 27], t, {
          size: 16, anchor: 'start',
          color: i === lines.length - 1 ? COL.RED : COL.INK
        });
      });
    };
  }
  var LD = ['xled0', 'xled1', 'xled2'];
  var led = ledger('x');

  var f = fig('x');

  /* ---------- 问 (2) 的作图：BF ∥ CD、F 在 CA 延长线上 ---------- */
  var sCAext = { id: 'xCAext', k: 'line', a: Ap, b: Fp, stroke: COL.GREY, sw: 2, dash: [6,5] };
  var sBF = { id: 'xBF', k: 'line', a: Bp, b: Fp, stroke: COL.TEAL, sw: 2.6 };
  var nF = AN.txt('xvF', [Fp[0] - 26, Fp[1] + 4], 'F', { size: FS.V, weight: 700 });
  var par1 = AN.tick('xpar1', Bp, add(Bp, mul(unit(sub(Fp, Bp)), 46)), COL.TEAL, 8, 0);
  var par2 = AN.tick('xpar2', Cp, add(Cp, mul(unit(sub(Dp, Cp)), 46)), COL.TEAL, 8, 0);
  var tkAB = AN.tick('xtkAB', Ap, Bp, COL.PURPLE, 9, 0);
  var tkAF = AN.tick('xtkAF', Ap, Fp, COL.PURPLE, 9, 0);

  // 角
  var aAFB = AN.angle('xaAFB', Fp, Ap, Bp, 46, COL.ORANGE, null, { gap: 22 });
  var aABF = AN.angle('xaABF', Bp, Ap, Fp, 40, COL.ORANGE, null, { gap: 22 });
  var aACD = AN.angle('xaACD', Cp, Dp, Ap, 62, COL.BLUE, null, { gap: 24 });
  var aACB = AN.angle('xaACB', Cp, Bp, Ap, 62, COL.BLUE, null, { gap: 24 });
  var aBAC = AN.angle('xaBAC', Ap, Bp, Cp, 30, COL.PURPLE, null, { gap: 24 });
  var aBAF = AN.angle('xaBAF', Ap, Bp, Fp, 26, COL.GREY, null, { gap: 22 });
  var aBCD = AN.angle('xaBCD', Cp, Bp, Dp, 40, COL.RED, null, { gap: 24 });

  // 全等两块的记号
  var tkBC = AN.tick('xtkBC', Bp, Cp, COL.GREEN, 9, 0);
  var tkDC = AN.tick('xtkDC', Dp, Cp, COL.GREEN, 9, 0);

  var lift = ['xsAB', 'xsAD', 'xsBC', 'xsDC', 'xsAC', 'xsBD',
              'xrB', 'xrD', 'xaABD', 'xaADB'];

  /* ---------- 问 (2)② 的作图：A′、G、H ---------- */
  var sAAp = { id: 'xAAp', k: 'line', a: Ap, b: App, stroke: COL.ORANGE, sw: 1.8, dash: [5,4] };
  var sApD = { id: 'xApD', k: 'line', a: App, b: Dp, stroke: COL.ORANGE, sw: 1.8, dash: [5,4] };
  var sApG = { id: 'xApG', k: 'line', a: App, b: Gp, stroke: COL.ORANGE, sw: 2.4 };
  var sAH = { id: 'xAH', k: 'line', a: Ap, b: Hp, stroke: COL.ORANGE, sw: 2 };
  var sApH = { id: 'xApH', k: 'line', a: App, b: Hp, stroke: COL.ORANGE, sw: 2 };
  var sGH = { id: 'xGH', k: 'line', a: Gp, b: Hp, stroke: COL.RED, sw: 3.2 };
  var raG = AN.right('xraG', Gp, sub(Hp, Gp), sub(Ap, Gp), 12, COL.RED);
  var nAp = AN.txt('xvAp', [App[0] + 24, App[1] + 6], 'A′', { size: FS.V, weight: 700 });
  var nG = AN.txt('xvG', [Gp[0] - 24, Gp[1] + 8], 'G', { size: FS.V, weight: 700 });
  var nH = AN.txt('xvH', [Hp[0] + 6, Hp[1] + 24], 'H', { size: FS.V, weight: 700 });
  var dotG = { id: 'xdotG', k: 'circ', c: Gp, r: 4.5, fill: COL.RED, stroke: COL.RED };
  var dotH = { id: 'xdotH', k: 'circ', c: Hp, r: 4.5, fill: COL.RED, stroke: COL.RED };

  var lift2 = lift.concat(['xCAext', 'xBF', 'xvF', 'xpar1', 'xpar2', 'xtkAB', 'xtkAF',
                           'xaAFB', 'xaABF', 'xaACD', 'xaACB', 'xaBAC', 'xaBAF',
                           'xtkBC', 'xtkDC', 'xaBCD']);

  /* ============================================================
     步骤
     ============================================================ */
  var steps = [
    /* ---------- 问 (1) ---------- */
    {
      say: '图上是四个点：B 在最上面，A 在右边，C 在左下，D 在右下。题目说角 ABC 和角 ADC 都是直角，也就是 B 处和 D 处各标一个直角。AC 和 BD 这两条对角线在 E 点相交。',
      cite: '题设：∠ABC = ∠ADC = 90°，AC 与 BD 相交于点 E',
      add: [f.fillABD, f.fillBCD, f.sAB, f.sAD, f.sBC, f.sDC, f.sAC, f.sBD,
            f.nA, f.nB, f.nC, f.nD, f.nE, f.cap],
      eq: '∠ABC = ∠ADC = 90°'
    },
    {
      say: '再把题目给的条件标上：角 ABD 和角 ADB 相等，这两个角都挨着 B 和 D，像图里这两道绿色的小弧。',
      cite: '题设：∠ABD = ∠ADB',
      delNow: LD,
      add: [f.rB, f.rD].concat(f.aABD, f.aADB,
        led(['∠ABD = ∠ADB（已知）'])),
      front: lift,
      eq: '∠ABD = ∠ADB'
    },
    {
      say: '一个三角形里两个角相等，它们对的边就相等。角 ABD 对着 AD，角 ADB 对着 AB，所以 AB 等于 AD。',
      cite: '等角对等边',
      delNow: LD,
      add: led(['∠ABD = ∠ADB ⟹ AB = AD']),
      front: lift,
      eq: 'AB = AD'
    },
    {
      say: '现在看两个直角三角形：三角形 ABC 和三角形 ADC。它们的斜边都是 AC，这是同一条线；直角边 AB 和 AD 刚才证了相等。斜边和一条直角边都相等，两个三角形全等。',
      cite: '直角三角形全等的判定（HL）：斜边和一条直角边分别相等',
      delNow: LD,
      add: led(['Rt△ABC ≌ Rt△ADC（HL）']),
      front: lift,
      eq: 'Rt△ABC ≌ Rt△ADC'
    },
    {
      say: '全等之后，对应边相等，所以 BC 等于 DC。我在 BC 和 DC 上各画一道短杠，同色就是等长。',
      cite: '全等三角形的对应边相等',
      delNow: LD,
      add: [tkBC, tkDC].concat(led(['CB = CD'])),
      front: lift,
      eq: 'CB = CD'
    },
    {
      say: '到这一步就够了：A 到 B 和 A 到 D 距离相等，C 到 B 和 C 到 D 也相等。一条直线上有两点都到 B、D 等距，这条线就是 BD 的垂直平分线。所以 AC 垂直平分 BD。',
      cite: '到线段两端距离相等的点在这条线段的垂直平分线上（两个点确定一条线）',
      delNow: LD,
      add: led(['AB = AD，CB = CD', '⟹ AC 垂直平分 BD']),
      front: lift,
      eq: 'AC 垂直平分 BD',
      hold: 3600
    },

    /* ---------- 问 (2) ① ---------- */
    {
      say: '第二问。刚才已经知道 CB 等于 CD，那三角形 BCD 已经有两条边相等了。想证明它是等边三角形，只差一个角等于六十度。',
      cite: '等腰三角形 + 一个 60° 的角 ⟹ 等边三角形',
      delNow: LD,
      add: led(['CB = CD（已证）', '只差 ∠BCD = 60°']),
      front: lift,
      eq: '只差 ∠BCD = 60°'
    },
    {
      say: 'AC 垂直平分 BD，同时它又是等腰三角形 ABD 从顶点 A 下来的那条线——所以它也平分顶角 BAD。',
      cite: '等腰三角形三线合一：底边上的中线、高、顶角平分线重合',
      delNow: LD,
      add: led(['AC 平分 ∠BAD']),
      front: lift,
      eq: 'AC 平分 ∠BAD'
    },
    {
      say: '题目让过 B 作一条平行于 CD 的线，交 CA 的延长线于 F。图上那条青色的线就是它，CA 往 F 这边用虚线延长。',
      cite: '题设：过 B 作 BF ∥ CD，交 CA 的延长线于点 F',
      delNow: LD,
      add: [sCAext, sBF, nF, par1, par2],
      front: lift,
      eq: 'BF ∥ CD'
    },
    {
      say: 'F 在 CA 的延长线上，所以 A、C、F 三点共线，而且 A 夹在 C 和 F 中间。这样一来，角 BAF 和角 BAC 就拼成一条直线，加起来是一百八十度。',
      cite: '平角的定义：A、C、F 共线，∠BAF + ∠BAC = 180°',
      delNow: LD,
      add: [aBAF, aBAC].concat(led(['∠BAF + ∠BAC = 180°'])),
      front: lift,
      eq: '∠BAF = 180° − ∠BAC'
    },
    {
      say: '题目还说 AB 等于 AF，我在两边各画一道紫色短杠。三角形 ABF 是等腰的，两个底角相等；顶角是角 BAF，所以底角等于一百八十度减顶角再除以二，正好是角 BAC 的一半。',
      cite: '等腰三角形两底角相等；三角形内角和 180°',
      delNow: LD,
      add: [tkAB, tkAF, aAFB, aABF].concat(led(['AB = AF ⟹ ∠ABF = ∠AFB', '∠AFB = (180° − ∠BAF) ÷ 2 = ∠BAC ÷ 2'])),
      front: lift,
      eq: '∠AFB = ∠BAC ÷ 2'
    },
    {
      say: '再看 BF 和 CD 平行这件事。F、A、C 在同一条线上，这条截线穿过去，角 AFB 和角 ACD 就是一对内错角——平行线下的内错角相等。',
      cite: '两直线平行，内错角相等',
      delNow: LD,
      add: [aACD].concat(led(['BF ∥ CD ⟹ ∠AFB = ∠ACD'])),
      front: lift,
      eq: '∠AFB = ∠ACD'
    },
    {
      say: '而 ACD 和 ACB 呢，它们是刚才那对全等三角形的对应角，本来就相等。所以角 ACB 也等于角 AFB，也就等于角 BAC 的一半。',
      cite: '全等三角形的对应角相等',
      delNow: LD,
      add: [aACB].concat(led(['∠ACD = ∠ACB（全等）', '⟹ ∠ACB = ∠BAC ÷ 2'])),
      front: lift,
      eq: '∠ACB = ∠BAC ÷ 2'
    },
    {
      say: '最后回三角形 ABC 自己。它是直角三角形，两个锐角互余，加起来九十度。把角 ACB 换成角 BAC 的一半：角 BAC 加上它的一半等于九十度，所以角 BAC 是六十度，角 ACB 是三十度。',
      cite: '直角三角形两锐角互余',
      delNow: LD,
      add: led(['∠BAC + ∠ACB = 90°', '∠BAC + ∠BAC÷2 = 90° ⟹ ∠BAC = 60°', '⟹ ∠ACB = 30°']),
      front: lift,
      eq: '∠BAC = 60°，∠ACB = 30°'
    },
    {
      say: '角 BCD 是角 BCA 加上角 ACD，两个三十度，正好六十度。CB 等于 CD，夹角又是六十度——三角形 BCD 就是等边三角形。',
      cite: '有一个角是 60° 的等腰三角形是等边三角形',
      delNow: LD,
      add: [aBCD].concat(led(['∠BCD = ∠BCA + ∠ACD = 60°', 'CB = CD ⟹ △BCD 是等边三角形'])),
      front: lift,
      eq: '△BCD 是等边三角形',
      hold: 3400
    },

    /* ---------- 问 (2) ② ---------- */
    {
      say: '第三问，动点。G 在 AC 上跑，H 在 CD 上跑，要让 GH 加 AH 最短。GH 和 AH 一前一后接成一条折线，从 G 出发，经 H，到 A——中间那个拐点 H 还得贴着 CD 走。',
      cite: '题设：G 是 AC 上的动点，H 是 CD 上的动点，求 GH + AH 的最小值',
      delNow: LD,
      add: [dotG, dotH, nG, nH, sGH, sAH].concat(led(['求 GH + AH 最小'])),
      front: lift,
      eq: 'GH + AH → 最小'
    },
    {
      say: '看到折线碰到一条直线，第一反应就是把一边翻过去。把 A 关于 CD 这条线翻折，落在 A 撇。' +
        '注意，题目给的角 ADC 本来就是直角，所以 AD 垂直于 CD——翻折过去，A 撇正好落在 AD 的延长线上，D 就是 A 和 A 撇的中点。这不是巧合，是直角带来的。' +
        '翻折是对称变换，A 到 CD 上任何一点的距离，都等于 A 撇到那一点的距离。',
      cite: '轴对称的性质：对称轴上的点到一对对称点的距离相等',
      delNow: LD,
      add: [sAAp, sApD, nAp, raG].concat(led(['A 关于 CD 的对称点为 A′', '⟹ AH = A′H'])),
      front: lift2,
      eq: 'AH = A′H'
    },
    {
      say: '于是 GH 加 AH 就等于 GH 加 A 撇 H。两点之间线段最短：从 G 到 A 撇，经过 H 的那条折线，怎么也短不过直接连 G 和 A 撇。所以最小的时候，G、H、A 撇三点拉成一条直线。',
      cite: '三角形两边之和大于第三边（两点之间线段最短）',
      delNow: LD,
      add: [sApH, sApG].concat(led(['GH + AH = GH + A′H ≥ A′G', '等号当 G、H、A′ 共线'])),
      front: lift2,
      eq: 'GH + AH ≥ A′G'
    },
    {
      say: '再让 G 动起来。G 在 AC 上走，A 撇不动，G 到 A 撇的距离什么时候最短？就是 A 撇往 AC 作垂线、垂足落在 G 的时候。图上那个红色的小方角就是垂直。',
      cite: '垂线段最短',
      delNow: LD,
      add: led(['A′G 最小 ⟺ A′G ⊥ AC']),
      front: lift2,
      eq: 'A′G ⊥ AC'
    },
    {
      say: '来算一算这个距离。设等边三角形的边长是一：AC 平分角 BCD，所以角 ACD 是三十度，直角三角形 ADC 里，AD 就是三分之根号三。A 撇在 AD 的延长线上，所以 A 到 A 撇是它的两倍，三分之二根号三。再看这条线和 AC 的夹角，是一百二十度，它的正弦是二分之根号三。两个相乘，正好等于一。所以 GH 加 AH 的最小值，就是这一个边长。',
      cite: '等边三角形的高 = 边长 × √3 ÷ 2；翻折后由勾股定理求垂距',
      delNow: LD,
      add: led(['取 CD = 1（等边三角形边长）', 'A′G = 1，最小值就是 1']),
      front: lift2,
      eq: '最小值 = 1'
    },
    {
      say: '最后一步，看 H 落在 CD 的哪个位置。G、H、A 撇共线，这条线是水平的，它和 CD 的交点就在离 C 三分之二个边长的位置。这时候 GH 是三分之一，CH 是三分之二。所以 CH 是 GH 的两倍。',
      cite: '相似三角形对应边成比例：△CHG 与 △CDA′ 相似，CH : CD = CG : CA′',
      delNow: LD,
      add: led(['CH = 2/3，GH = 1/3（CD = 1）', 'CH = 2GH']),
      front: lift2,
      eq: 'CH = 2GH',
      hold: 4200
    }
  ];

  /* ---------- 存档 ---------- */
  window.MATHLAB_LESSONS = window.MATHLAB_LESSONS || [];
  window.MATHLAB_LESSONS.push({
    id: 'ws-a3-bisector',
    title: '两个直角，凭什么说 AC 是垂直平分线（讲义 A3）',
    grade: '初二',
    topic: '几何 · 轴对称与最值',
    tags: ['几何', '轴对称', '垂直平分线', '等边三角形', '最值', '翻折', '动点'],
    question: '∠ABC = ∠ADC = 90°，AC 与 BD 相交于点 E，∠ABD = ∠ADB。(1) 求证：AC 垂直平分 BD；(2) 过 B 作 BF ∥ CD 交 CA 延长线于 F，若 AB = AF，① 求证 △BCD 是等边三角形；② G、H 分别是 AC、CD 上的动点，当 GH + AH 最小时，写出 GH 与 CH 的数量关系并说明理由。',
    sourceImage: 'img/ws-a3-q.png',
    thumbStep: 5,
    methods: [
      {
        name: '完整推导 · 从垂直平分线到 CH = 2GH',
        tier: 'proof',
        sub: '严格证明 · 20 步，三问连着走',
        steps: steps
      }
    ]
  });
})();
