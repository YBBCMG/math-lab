/* ============================================================
   （11.16A）几何最值探究 · 轴对称变换 —— 第 5 题（＝提高班第 6 题，同一道）
   ------------------------------------------------------------
   题：在 △ABC 中，AB = AC = 8，∠BAC = 120°，在 BC 边上取一点 D，
       以 AD 为边构造等边 △ADE，E 与 B 在直线 AD 的两侧，连 CE。
       (1) 是否存在使 CE 最短的 D？小俊画法：作 A 关于 BC 的对称点 A′，
           线段 AA′ 与 BC 的交点即为 D。求 CE 的最小值。
       (2) 在 (1) 的 E 基础上，在直线 AB 上取 F（F ≠ A），得 △AEF，
           把 △AEF 沿 EF 翻折得到 △GEF（A 与 G 是对称点），
           画出使 BG 最长的 BG 及此时的 F。

   几何摆法（数学坐标，底边 BC 落在 x 轴上且关于 y 轴对称）：
     A = (0, 4)          A 到 BC 的高 = 4（AB=8、半顶角 60°）
     B = (−4√3, 0)，C = (4√3, 0)
     D = (0, 0)          最优位置：BC 中点
     E = (2√3, 2)        D 绕 A 转 −60°（E 在 AD 右侧、B 在左侧）
     A′ = (0, −4)        A 关于 BC 的对称点
     G = (7.3920, 2.7559)   BG 最长时（B、E、G 共线、E 居中）
     F = (4.2098, 6.4305)   F 在 BA 延长线上，AF = 4(√7+1)/3

   答案：(1) CE 最小 = 4，D 为 BC 中点；
         (2) BG 最大 = 4 + 4√7 = 4(1+√7) ≈ 14.583。

   关键：E 的轨迹是直线 √3x − y = 4；CE² = t² + 16。
   ============================================================ */
(function () {
  var AN = window.ANNO;
  var COL = AN.COL, FS = AN.FS;
  var sub = AN.sub, add = AN.add, unit = AN.unit, along = AN.along, mid = AN.mid;

  var S3 = Math.sqrt(3);
  var S7 = Math.sqrt(7);

  /* ---------- 数学坐标 → 画布（等比 + 翻 y，圆仍是圆） ---------- */
  var SC = 37, OX = 441, OY = 312;
  function P(x, y) { return [OX + SC * x, OY - SC * y]; }

  var Ap = P(0, 4);
  var Bp = P(-4 * S3, 0);
  var Cp = P(4 * S3, 0);
  var Dp = P(0, 0);
  var Ep = P(2 * S3, 2);
  var App = P(0, -4);
  var Gp = P(2 * S3 + 6 * S3 / S7, 2 + 2 / S7);
  var Fp = P(2 * S3 * (S7 + 1) / 3, (14 + 2 * S7) / 3);

  var O = [(Ap[0] + Bp[0] + Cp[0]) / 3, (Ap[1] + Bp[1] + Cp[1]) / 3];

  /* ---------- 图元工厂 ---------- */
  function fig(p) {
    var e = {};
    e.fill = { id: p + 'fill', k: 'poly', pts: [Ap, Bp, Cp], fill: AN.wash('238,241,247', 0.8), stroke: 'none' };

    e.sAB = { id: p + 'sAB', k: 'line', a: Ap, b: Bp, stroke: COL.EDGE, sw: 2.4 };
    e.sAC = { id: p + 'sAC', k: 'line', a: Ap, b: Cp, stroke: COL.EDGE, sw: 2.4 };
    e.sBC = { id: p + 'sBC', k: 'line', a: Bp, b: Cp, stroke: COL.EDGE, sw: 2.4 };

    // 顶点字母：位置严格按题解给的避让表
    e.nA = AN.txt(p + 'vA', [426, 140], 'A', { size: FS.V, weight: 700 });
    e.nB = AN.txt(p + 'vB', [166, 318], 'B', { size: FS.V, weight: 700 });
    e.nC = AN.txt(p + 'vC', [716, 322], 'C', { size: FS.V, weight: 700 });
    e.nD = AN.txt(p + 'vD', [416, 332], 'D', { size: FS.V, weight: 700 });
    e.nE = AN.txt(p + 'vE', [569, 266], 'E', { size: FS.V, weight: 700 });
    e.nAp = AN.txt(p + 'vAp', [441, 480], 'A′', { size: FS.V, weight: 700 });

    // 顶角 120°
    e.aBAC = AN.angle(p + 'aBAC', Ap, Bp, Cp, 40, COL.PURPLE, '120°', { size: FS.TINY, gap: 26 });
    return e;
  }

  function ledger(p) {
    return function (lines) {
      return lines.map(function (t, i) {
        return AN.txt(p + 'led' + i, [46, 430 + i * 26], t, {
          size: 16, anchor: 'start',
          color: i === lines.length - 1 ? COL.RED : COL.INK
        });
      });
    };
  }
  var LD = ['vled0', 'vled1', 'vled2'];
  var led = ledger('v');

  var f = fig('v');

  /* ---------- (1) 的作图：AD、等边 △ADE、CE ---------- */
  var sAD = { id: 'vsAD', k: 'line', a: Ap, b: Dp, stroke: COL.TEAL, sw: 2.4 };
  var sAE = { id: 'vsAE', k: 'line', a: Ap, b: Ep, stroke: COL.BLUE, sw: 2.6 };
  var sDE = { id: 'vsDE', k: 'line', a: Dp, b: Ep, stroke: COL.BLUE, sw: 2.6 };
  var sCE = { id: 'vsCE', k: 'line', a: Cp, b: Ep, stroke: COL.RED, sw: 5.5 };
  var aAED = AN.angle('vaAED', Ep, Ap, Dp, 34, COL.BLUE, '60°', { size: FS.TINY, gap: 22 });

  // AA′：A 关于 BC 的对称点连线（虚线）
  var sAAp = { id: 'vsAAp', k: 'line', a: Ap, b: App, stroke: COL.GREY, sw: 2, dash: [6, 5] };
  // 直角：AA′ ⊥ BC 于 D
  var rD = AN.right('vrD', Dp, sub(Ap, Dp), sub(Cp, Dp), 13, COL.TEAL);

  // 等长 tick
  var tkAB = AN.tick('vtkAB', Ap, Bp, COL.ORANGE, 8, 0);
  var tkAC = AN.tick('vtkAC', Ap, Cp, COL.ORANGE, 8, 0);
  var tkAD2 = AN.tick('vtkAD2', Ap, Dp, COL.BLUE, 8, 0);
  var tkAE2 = AN.tick('vtkAE2', Ap, Ep, COL.BLUE, 8, 0);
  var tkDE2 = AN.tick('vtkDE2', Dp, Ep, COL.BLUE, 8, 0);

  // E 的轨迹直线 √3x − y = 4：过 A′(441,460) 与 E，屏幕取 (441,460)→(640,115.32)
  var trk = { id: 'vtrk', k: 'line', a: [441, 460], b: [640, 115.32], stroke: COL.GREY, sw: 1.8, dash: [7, 6] };

  /* ---------- (2)：翻折与 G 的轨迹圆 ---------- */
  var sEF = { id: 'vsEF', k: 'line', a: Ep, b: Fp, stroke: COL.ORANGE, sw: 2.4 };   // 折痕
  var sFG = { id: 'vsFG', k: 'line', a: Fp, b: Gp, stroke: COL.ORANGE, sw: 2.2 };
  var sEG = { id: 'vsEG', k: 'line', a: Ep, b: Gp, stroke: COL.GREEN, sw: 2.4 };
  var sBG = { id: 'vsBG', k: 'line', a: Bp, b: Gp, stroke: COL.RED, sw: 3.2 };
  var sAG = { id: 'vsAG', k: 'line', a: Ap, b: Gp, stroke: COL.GREY, sw: 1.6, dash: [5, 5] };
  var nG = AN.txt('vvG', [731, 194], 'G', { size: FS.V, weight: 700 });
  var nF = AN.txt('vvF', [597, 52], 'F', { size: FS.V, weight: 700 });

  // G 的轨迹圆：以 E 为心、半径 4（数学）＝ 148px；它同时穿过 A 与 C
  var circG = { id: 'vcircG', k: 'circle', c: Ep, r: 4 * SC, stroke: COL.GREEN, sw: 1.8, dash: [7, 6] };

  var lift = ['vsAB', 'vsAC', 'vsBC'];
  // E 恰好是 AC 的中点 ⟹ CE 完全落在 AC 边上。若只把三条边提到最前，
  // CE 会被 AC 盖住（第 14 步实测消失）。所以答案/辅助线要一起提到最前。
  var liftCE = lift.concat(['vtrk', 'vsCE', 'vsAAp']);

  /* ---------- 步骤（26 步） ---------- */
  var steps = [
    {
      say: '先看清这是个什么图形。一个等腰三角形，两条腰 AB 和 AC 都等于八，顶角 BAC 是一百二十度。顶角那个点是 A，底边两个端点是 B 和 C。',
      cite: '题设：AB = AC = 8，∠BAC = 120°',
      add: [f.fill, f.sAB, f.sAC, f.sBC, f.nA, f.nB, f.nC, f.aBAC],
      eq: 'AB = AC = 8，∠BAC = 120°'
    },
    {
      say: '现在在底边 BC 这一段上取一个动点 D，用 A 和 D 连线当一条边，往另一侧作等边三角形，第三个顶点叫 E。题目要求 E 和 B 分别在直线 AD 的两边。',
      cite: '题设：D ∈ BC，以 AD 为边作等边 △ADE，E 与 B 在直线 AD 两侧',
      add: [sAD, sAE, sDE, f.nD, f.nE, aAED],
      eq: '△ADE 等边 ⟹ AE = AD = DE'
    },
    {
      say: '动笔之前先把这座三角形量清楚。从 A 往底边作一条高下来，因为两条腰一样长，这条高正好落在底边正中。',
      cite: '等腰三角形三线合一：底边上的高、中线、顶角平分线重合',
      add: [sAD, rD, tkAB, tkAC],
      eq: 'AD ⊥ BC，D 为 BC 中点'
    },
    {
      say: '直角三角形里斜边是八、顶角的一半是六十度，所以半条底边是八乘二分之根号三，等于四倍根号三；整条底边就是八倍根号三。高是八乘二分之一，等于四。',
      cite: '含 30° 的直角三角形：30° 所对直角边 = 斜边的一半',
      add: led(['BC = 8√3', 'A 到 BC 的距离 = 4']),
      front: liftCE,
      eq: 'BC = 8√3，高 = 4'
    },
    {
      say: '要算最短，给图配一套坐标最省事。把底边 BC 摆到横轴上，并且让它关于纵轴对称；这样 A 就站在正上方，离底边高是四。',
      cite: '建系：以 BC 中点为原点，BC 为 x 轴',
      add: led(['A(0, 4)', 'B(−4√3, 0)', 'C(4√3, 0)']),
      delNow: LD,
      front: liftCE,
      eq: 'A(0,4)，B(−4√3,0)，C(4√3,0)'
    },
    {
      say: '动点 D 用一个数就够了。它在底边上，坐标是横坐标 t、纵坐标零；t 是正是负只表示它偏在中点右边还是左边，t 等于零就是中点。',
      cite: '参数化动点：D 在直线 BC 上',
      add: led(['D(t, 0)']),
      delNow: LD,
      front: liftCE,
      eq: 'D(t, 0)'
    },
    {
      say: '等边三角形那句话给了两个条件：一是 AE 和 AD 一样长，二是夹角 DAE 是六十度。合起来的意思就是，把线段 AD 绕 A 转六十度，正好落到 AE 上。',
      cite: '等边的定义 ⟹ AE = AD 且 ∠DAE = 60°',
      add: led(['E = A + R₆₀(D − A)']),
      delNow: LD,
      front: liftCE,
      eq: 'E = A + R₆₀(D − A)'
    },
    {
      say: 'B 在底边左端，位于直线 AD 的左侧，所以 E 要往另一侧转。把旋转算出来：横坐标是二分之 t 加二倍根号三，纵坐标是二分之根号三乘 t 再加二。',
      cite: '旋转坐标公式（顺时针 60°）',
      add: led(['E(t/2 + 2√3, (√3/2)t + 2)']),
      delNow: LD,
      front: liftCE,
      eq: 'E(t/2 + 2√3, (√3/2)t + 2)'
    },
    {
      say: '这一步是整道题的钥匙。t 在变，但 E 的两个坐标被绑在同一根直线上：把 t 消掉，就得到根号三乘横坐标减纵坐标等于四。换句话说，D 在底边这条直线上跑，E 就沿着「底边整条直线绕 A 转六十度之后的那条像直线」上跑。',
      cite: '消参：E 的轨迹是一条直线',
      add: [trk].concat(led(['√3x − y = 4（E 的轨迹）'])),
      delNow: LD,
      front: liftCE,
      eq: '√3x − y = 4'
    },
    {
      say: '于是 CE 最短就变成了「一个定点到一个定点的距离」变成了「定点到一条定直线」的问题。先把 CE 写成 t 的式子再平方。',
      cite: '两点间距离公式',
      add: [sCE].concat(led(['CE² = (t/2 − 2√3)² + ((√3/2)t + 2)²'])),
      delNow: LD,
      front: liftCE,
      eq: 'CE² = (t/2 − 2√3)² + ((√3/2)t + 2)²'
    },
    {
      say: '展开以后会看到一次项自己抵消了：一个负二倍根号三乘 t，一个正二倍根号三乘 t，正好抵掉。剩下的四分之 t 平方加四分之三 t 平方，合起来是 t 平方；常数项十二加四等于十六。',
      cite: '展开并合并同类项',
      add: led(['CE² = t² + 16']),
      delNow: LD,
      front: liftCE,
      eq: 'CE² = t² + 16'
    },
    {
      say: '结论自己掉出来了：t 平方永远不小于零，所以 CE 不小于四；t 等于零的时候取到等号，而 t 等于零就是 D 落在底边中点。',
      cite: 't² ≥ 0',
      add: led(['CE ≥ 4，等号当 t = 0，即 D 为 BC 中点']),
      delNow: LD,
      front: liftCE,
      eq: 'CE 最小 = 4'
    },
    {
      say: '再看小俊的两步为什么正好给出这个点。第一步画 A 关于底边的对称点，记作 A 撇。对称的意思就是 AA 撇垂直于底边，而且被底边平分，所以 A 撇在 A 的正下方，离底边也是四。',
      cite: '轴对称的定义',
      add: [sAAp, f.nAp].concat(led(['A′(0, −4)，AA′ ⊥ BC'])),
      delNow: LD,
      front: liftCE,
      eq: 'A′(0, −4)'
    },
    {
      say: '第二步取 AA 撇与底边的交点当 D。因为 AB 等于 AC，A 本来就在底边的垂直平分线上，所以这条从 A 垂直下来的线一定落在底边正中——小俊画出来的 D 就是中点，正好是我们算出来的最优位置。',
      cite: '等腰三角形顶点在底边的垂直平分线上',
      add: led(['D = BC 中点 ⟹ CE 最小 = 4']),
      delNow: LD,
      front: liftCE,
      eq: 'D 为 BC 中点'
    },
    {
      say: '顺带说一个漂亮的事实：A 撇其实就是把 B 绕 A 转六十度的像。AB 和 AA 撇都等于八、夹角六十度，所以三角形 ABA 撇是等边三角形。于是 A 撇本来就站在 E 的那条轨迹直线上。',
      cite: '△ABA′ 等边 ⟹ A′ = R₆₀(B)，故 A′ 在轨迹直线上',
      add: [trk].concat(led(['R₆₀(B) = A′，A′ 在直线 √3x − y = 4 上'])),
      delNow: LD,
      front: liftCE,
      eq: 'A′ ∈ 轨迹直线'
    },
    {
      say: '还能给一个不用坐标的解释。这个位置上 AD 垂直于底边，而等边三角形的角 ADE 是六十度，所以角 CDE 是九十减六十等于三十度。另一边角 DCE 也是三十度，两个三十度对上，等角对等边，于是 CE 等于 DE，也就是等于 AD，等于四。',
      cite: '等角对等边（∠CDE = ∠DCE = 30°）',
      add: led(['∠CDE = ∠DCE = 30° ⟹ CE = DE = 4']),
      delNow: LD,
      front: liftCE,
      eq: 'CE = DE = 4'
    },
    {
      say: '第二问另起一摊。E 沿用刚才那个 E，位置已经定死了。现在在直线 AB 上取一点 F，题目要求 F 不能和 A 重合。把三角形 AEF 沿着 EF 折过去，A 落到 G，G 就是 A 关于这条折痕的对称点。',
      cite: '题设：F ∈ 直线 AB，F ≠ A，A 与 G 关于直线 EF 对称',
      add: [sEF, sFG, sAG, nG, nF],
      eq: 'A 与 G 关于 EF 对称'
    },
    {
      say: '翻折不改变距离，只把图形沿折痕翻个面。所以折痕 EF 就是 A 与 G 连线的垂直平分线，EG 一定等于 EA；而且折痕还平分角 AEG。EA 是定值四，于是不管 F 怎么动，G 到 E 的距离永远是四。',
      cite: '轴对称的性质：对应点到对称轴距离相等',
      add: [sEG].concat(led(['EF 垂直平分 AG ⟹ EG = EA = 4'])),
      delNow: LD,
      front: liftCE,
      eq: 'EG = EA = 4'
    },
    {
      say: '这就把 G 的活动范围说清楚了：G 在以 E 为圆心、四为半径的那个圆上转圈。',
      cite: '圆的定义：到定点距离等于定长的点在圆上',
      add: [circG].concat(led(['G 在以 E 为心、半径 4 的圆上'])),
      delNow: LD,
      front: liftCE,
      eq: 'G ∈ ⊙(E, 4)'
    },
    {
      say: '顺便留意一个巧合，其实是第一问的结论又露了一次脸：这个圆不光穿过 A，还正好穿过 C。因为刚才已经算出 CE 也等于四，而圆的半径正是四，所以 C 就落在圆上。',
      cite: 'CE = 4 = 半径 ⟹ C 在圆上',
      add: led(['EA = EC = EG = 4 ⟹ A、C、G 三点共圆（圆心 E）']),
      delNow: LD,
      front: liftCE,
      eq: 'EA = EC = EG = 4'
    },
    {
      say: '现在要把 B 到圆上一点的距离撑到最长。B、E、G 三点不共线时它们组成一个三角形，两边之和大于第三边，所以 BG 小于 BE 加 EG；只有 E 夹在 B 和 G 中间、三点拉成一条直线时才取等号。',
      cite: '三角形两边之和大于第三边；三点共线时取等',
      add: led(['BG ≤ BE + EG = BE + 4']),
      delNow: LD,
      front: liftCE,
      eq: 'BG ≤ BE + 4'
    },
    {
      say: '把 BE 算出来。B 到 E 的横向差是四倍根号三加二倍根号三，等于六倍根号三；纵向差是二。平方相加是一百零八加四等于一百一十二，开根号是四倍根号七，大约十点六，确实比半径四大，所以 B 在圆外，最长的那个位置真的能取到。',
      cite: '两点间距离公式',
      add: [sBG].concat(led(['BE = √((6√3)² + 2²) = √112 = 4√7 ≈ 10.583'])),
      delNow: LD,
      front: liftCE,
      eq: 'BE = 4√7'
    },
    {
      say: '于是 BG 的最大值是四倍根号七加四，约等于十四点五八。此时 G 落在从 B 出发穿过 E 再往前延长的那条线上，E 正好夹在中间。',
      cite: '取等条件：B、E、G 共线且 E 居中',
      add: [sBG, sEG, nG].concat(led(['BG最大 = 4(1 + √7) ≈ 14.583'])),
      delNow: LD,
      front: liftCE,
      eq: 'BG最大 = 4(1 + √7)'
    },
    {
      say: 'G 的坐标就是在 E 的基础上，沿着 E 减 B 的方向再走四。横向是二倍根号三加根号七分之六倍根号三，纵向是二加根号七分之二，大约横七点三九、纵二点七六。',
      cite: 'G = E + 4·(E − B)/|E − B|',
      add: [nG].concat(led(['G(2√3 + 6√3/√7, 2 + 2/√7) ≈ (7.392, 2.756)'])),
      delNow: LD,
      front: liftCE,
      eq: 'G ≈ (7.392, 2.756)'
    },
    {
      say: '最后把 F 定下来。F 有两个身份：它在直线 AB 上；它又在 AG 的垂直平分线上，因为折痕这条线同时穿过 E 和 F。把 F 写成 A 加上 s 倍的 B 减 A，用 FA 等于 FG 列方程，解得 s 等于负的六分之根号七加一。',
      cite: 'F ∈ 直线 AB 且 FA = FG',
      add: [sEF, sFG].concat(led(['s = −(√7 + 1)/6 ≈ −0.6076'])),
      delNow: LD,
      front: liftCE,
      eq: 's = −(√7 + 1)/6'
    },
    {
      say: 's 是负数，说明 F 不在 A 和 B 之间，而是在 B 经过 A 之后再往前延长出去的那一头。代回去，F 的横坐标约四点二一、纵坐标约六点四三，AF 是四点八六。',
      cite: '代回参数式',
      add: [nF].concat(led(['F ≈ (4.210, 6.431)，AF = 4(√7+1)/3 ≈ 4.861'])),
      delNow: LD,
      front: liftCE,
      eq: 'F ≈ (4.210, 6.431)'
    },
    {
      say: '收尾再核一遍：G 落在这个位置时，把 A 沿直线 EF 翻过去正好还是 G，所以三角形 GEF 确实是三角形 AEF 的翻折像；而且 BG 等于十四点五八，是所有位置里最长的。图画到这里就齐了。',
      cite: '综合 (1)(2) 的结论',
      add: [sBG, sEF, sEG, sFG, nG, nF, circG].concat(led(['CE最小 = 4｜BG最大 = 4(1 + √7) ≈ 14.583'])),
      delNow: LD,
      front: liftCE,
      eq: 'CE最小 = 4，BG最大 = 4(1+√7)'
    }
  ];

  window.MATHLAB_LESSONS = window.MATHLAB_LESSONS || [];
  window.MATHLAB_LESSONS.push({
    id: 'ws-a5-fold',
    title: '一百二十度等腰 + 等边：先求 CE 最短，再求 BG 最长（讲义 A5·提高班 B6 同一题）',
    grade: '初二',
    topic: '几何 · 轴对称与最值',
    tags: ['几何', '轴对称', '等边三角形', '最值', '翻折', '动点', '轨迹'],
    question: '在 △ABC 中，AB = AC = 8，∠BAC = 120°，在 BC 边上取一点 D，以 AD 为边构造等边 △ADE，点 E 与 B 在直线 AD 的两侧，连 CE。(1) 是否存在使 CE 最短的 D？小俊画法：作 A 关于 BC 的对称点 A′，线段 AA′ 与 BC 的交点即为 D。求 CE 的最小值。(2) 在 (1) 的 E 基础上，在直线 AB 上取一点 F（F 不与 A 重合），得 △AEF，把 △AEF 沿 EF 翻折得到 △GEF，A 与 G 是对称点，画出使 BG 最长的 BG 以及此时的 F。',
    sourceImage: 'img/ws-a5-q.png',
    thumbStep: 11,
    methods: [
      {
        name: '完整推导 · E 的轨迹是直线，G 的轨迹是圆',
        tier: 'proof',
        sub: '严格证明 · 27 步，两问连着走',
        steps: steps
      }
    ]
  });
})();
