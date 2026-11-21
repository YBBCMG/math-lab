/* ============================================================
   （11.16A 提高班）几何最值探究 · 第 1 题（填空）
   ------------------------------------------------------------
   题：AB、AC 是以 A 为公共端点的两条线段，AB = AC = a，∠BAC = 120°，
       作线段 AC 的垂直平分线 l 交 AC 于点 D。P 为直线 l 上一动点，
       连接 PA，以 AP 为边构造等边 △APQ，连接 DQ。
       当 △ADQ 的周长最小时，AP = b，则 △ADQ 周长的最小值为 ___（用 a、b 表示）。

   几何摆法（a = 1，A 为原点，AC 沿 x 轴）：
     A = (0, 0)，C = (1, 0)，D = (1/2, 0)      D 是 AC 中点
     B = (−1/2, √3/2)                          ∠BAC = 120°，AB = 1
     C′ = (1/2, √3/2)                          C 绕 A 逆时针转 60°
     l 就是过 D 的竖直线 x = 1/2 —— C′ 恰好在 l 上

   解法链条：
     ① P 在 AC 的中垂线上 ⟹ PA = PC
     ② 等边 △APQ ⟹ AQ = AP        ⟹ AQ = PC
     ③ C′ 是 C 绕 A 转 60° 得到，∠PAQ = ∠CAC′ = 60° ⟹ ∠PAC = ∠QAC′
        AC = AC′，AP = AQ ⟹ △APC ≌ △AQC′（SAS）⟹ PC = QC′
     ④ 周长 = AD + AQ + DQ = a/2 + QC′ + DQ ≥ a/2 + C′D = a/2 + a√3/2
     ⑤ 最小值时 Q 落在 C′D 上，也就是 Q 在 l 上；又 Q、P 都在 l 上，
        ∠PAQ = 60° 而 AP = AQ ⟹ DP = DQ ⟹ △ADQ 是 30-60-90
     ⑥ AD = a/2 ⟹ DQ = a√3/6，AQ = a/√3 = b ⟹ DQ = b/2
     ⑦ 周长最小 = a/2 + b + b/2 = (a + 3b)/2
   ============================================================ */
(function () {
  var AN = window.ANNO, ML = window.ML;
  var COL = AN.COL, FS = AN.FS;
  var sub = AN.sub, add = AN.add, unit = AN.unit, along = AN.along;

  var S3 = Math.sqrt(3);

  /* ---------- 数学坐标 → 画布 ----------
     按原题图摆：A 在底部，AB 水平向右，AC 朝左上 120°（这条边落在
     120° 方向上），l 过 D 垂直 AC 朝 30°/210°。 */
  var SC = 280, CXo = 0.25, CYo = 0.43;
  function P(x, y) {
    return [450 + (x - CXo) * SC, 300 - (y - CYo) * SC];
  }

  var Ap = P(0, 0);
  var Bp = P(1, 0);
  var Cp = P(-0.5, S3 / 2);
  var Dp = P(-0.25, S3 / 4);           // AC 中点
  var Cpp = P(0.5, S3 / 2);            // C′：C 绕 A 顺时针 60°
  var Pp = P(-0.5, S3 / 6);            // 最优位置的 P（在 D 的 210° 侧）
  var Qp = P(0, S3 / 3);               // 最优位置的 Q（在 D 的 30° 侧）

  var O = [(Ap[0] + Bp[0] + Cp[0]) / 3, (Ap[1] + Bp[1] + Cp[1]) / 3];

  /* ---------- 图元 ---------- */
  function fig(p) {
    var e = {};
    e.fill = { id: p + 'fill', k: 'poly', pts: [Ap, Bp, Cp], fill: AN.wash('238,241,247', 0.8), stroke: 'none' };

    e.sAB = { id: p + 'sAB', k: 'line', a: Ap, b: Bp, stroke: COL.EDGE, sw: 2.4 };
    e.sAC = { id: p + 'sAC', k: 'line', a: Ap, b: Cp, stroke: COL.EDGE, sw: 2.4 };
    e.sBC = { id: p + 'sBC', k: 'line', a: Bp, b: Cp, stroke: COL.EDGE, sw: 2.4 };

    // l：过 D 垂直 AC 的直线（题里的垂直平分线）
    // l 垂直于 AC：AC 朝 120°，所以 l 朝 30°（画布上要翻 y）
    var ld = [Math.cos(Math.PI / 6), -Math.sin(Math.PI / 6)];
    e.l = { id: p + 'l', k: 'line', a: along(Dp, [-ld[0], -ld[1]], 150), b: along(Dp, ld, 300), stroke: COL.TEAL, sw: 2, dash: [7, 6] };

    e.nA = AN.vname(p + 'A', Ap, O, 28);
    e.nB = AN.vname(p + 'B', Bp, O, 30);
    e.nC = AN.txt(p + 'vC', [Cp[0] - 26, Cp[1] - 10], 'C', { size: FS.V, weight: 700 });
    e.nD = AN.txt(p + 'vD', [Dp[0] - 4, Dp[1] + 26], 'D', { size: FS.V, weight: 700 });

    // ∠BAC = 120°
    e.aBAC = AN.angle(p + 'aBAC', Ap, Bp, Cp, 34, COL.PURPLE, '120°', { size: FS.NOTE, gap: 24 });
    // ∠ADC = 90°
    e.rD = AN.right(p + 'rD', Dp, sub(Ap, Dp), sub(Cpp, Dp), 13, COL.TEAL);
    return e;
  }

  function ledger(p) {
    return function (lines) {
      return lines.map(function (t, i) {
        return AN.txt(p + 'led' + i, [46, 452 + i * 26], t, {
          size: 16, anchor: 'start',
          color: i === lines.length - 1 ? COL.RED : COL.INK
        });
      });
    };
  }
  var LD = ['vled0', 'vled1', 'vled2'];
  var led = ledger('v');

  var f = fig('v');

  /* ---------- 等边 △APQ ---------- */
  var sAP = { id: 'vsAP', k: 'line', a: Ap, b: Pp, stroke: COL.PURPLE, sw: 2.4 };
  var sAQ = { id: 'vsAQ', k: 'line', a: Ap, b: Qp, stroke: COL.PURPLE, sw: 2.4 };
  var sPQ = { id: 'vsPQ', k: 'line', a: Pp, b: Qp, stroke: COL.PURPLE, sw: 2.4 };
  var nP = AN.txt('vvP', [Pp[0] - 24, Pp[1] + 6], 'P', { size: FS.V, weight: 700 });
  var nQ = AN.txt('vvQ', [Qp[0] + 24, Qp[1] + 2], 'Q', { size: FS.V, weight: 700 });
  var aPAQ = AN.angle('vaPAQ', Ap, Pp, Qp, 62, COL.PURPLE, null, { gap: 24 });

  /* ---------- 等边 △ACC′ ---------- */
  var sACp = { id: 'vsACp', k: 'line', a: Ap, b: Cpp, stroke: COL.BLUE, sw: 2.2 };
  var sCCp = { id: 'vsCCp', k: 'line', a: Cp, b: Cpp, stroke: COL.BLUE, sw: 2.2 };
  var nCp = AN.txt('vvCp', [Cpp[0] + 26, Cpp[1] - 4], 'C′', { size: FS.V, weight: 700 });
  var aCACp = AN.angle('vaCACp', Ap, Cp, Cpp, 56, COL.BLUE, '60°', { size: 15, gap: 30 });

  /* ---------- 关键线段 ---------- */
  var sPC = { id: 'vsPC', k: 'line', a: Pp, b: Cp, stroke: COL.GREEN, sw: 2.2, dash: [6, 5] };
  var sQCp = { id: 'vsQCp', k: 'line', a: Qp, b: Cpp, stroke: COL.GREEN, sw: 2.2, dash: [6, 5] };
  var sCD = { id: 'vsCD', k: 'line', a: Cpp, b: Dp, stroke: COL.RED, sw: 3 };
  var sDQ = { id: 'vsDQ', k: 'line', a: Dp, b: Qp, stroke: COL.RED, sw: 3 };
  var tkAD = AN.tick('vtkAD', Ap, Dp, COL.ORANGE, 8, 0);
  var tkDC = AN.tick('vtkDC', Dp, Cp, COL.ORANGE, 8, 0);

  var lift = ['vsAB', 'vsAC', 'vsBC', 'vl', 'vrD'];

  /* ---------- 步骤 ---------- */
  var steps = [
    {
      say: '图上有两条边：一条 AB，一条 AC，它们从 A 点伸出来，长度都等于 a。中间这个角，角 BAC，是一百二十度。',
      cite: '题设：AB = AC = a，∠BAC = 120°',
      add: [f.fill, f.sAB, f.sAC, f.sBC, f.nA, f.nB, f.nC].concat(f.aBAC),
      eq: 'AB = AC = a，∠BAC = 120°'
    },
    {
      say: '过 AC 的中点 D，作 AC 的垂直平分线，图上这条青色虚线就是它。垂直平分线有两个意思：过中点，而且垂直于这条边。所以 D 处是一个直角。',
      cite: '题设：l 是 AC 的垂直平分线，交 AC 于 D ⟹ AD = DC，l ⊥ AC',
      delNow: LD,
      add: [f.l, f.nD, f.rD, tkAD, tkDC].concat(led(['AD = DC = a/2，l ⊥ AC'])),
      front: lift,
      eq: 'D 是 AC 中点，l ⊥ AC'
    },
    {
      say: 'P 是这条虚线 l 上的一个动点，它可以上下滑动。连上 PA。',
      cite: '题设：P 为直线 l 上一动点，连接 PA',
      delNow: LD,
      add: [sAP, nP].concat(led(['P 在 l 上'])),
      front: lift,
      eq: 'P ∈ l'
    },
    {
      say: '再以 AP 为边，往上作一个等边三角形 APQ。等边的意思是三条边都相等、三个角都是六十度。所以 AP 等于 AQ，角 PAQ 是六十度。',
      cite: '题设：以 AP 为边构造等边 △APQ',
      delNow: LD,
      add: [sAQ, sPQ, nQ].concat(aPAQ, led(['AP = AQ，∠PAQ = 60°'])),
      front: lift,
      eq: 'AP = AQ，∠PAQ = 60°'
    },
    {
      say: '现在看要算的东西：三角形 ADQ 的周长，等于 AD 加 AQ 再加 DQ。其中 AD 是定死的，就是 a 的一半。所以要让周长最小，只要让 AQ 加 DQ 最小。',
      cite: '周长 = AD + AQ + DQ，其中 AD = a/2 为定值',
      delNow: LD,
      add: [sDQ].concat(led(['周长 = AD + AQ + DQ', 'AD = a/2 固定，只需 AQ + DQ 最小'])),
      front: lift,
      eq: '让 AQ + DQ 最小'
    },
    {
      say: '第一步换掉 AQ。注意 P 在 AC 的垂直平分线上，垂直平分线上到两端点距离相等，所以 PA 等于 PC。而 AQ 又等于 AP，于是 AQ 就等于 PC。',
      cite: '线段垂直平分线上的点到线段两端距离相等；等边三角形三边相等',
      delNow: LD,
      add: [sPC].concat(led(['PA = PC（P 在 l 上）', 'AQ = AP ⟹ AQ = PC'])),
      front: lift,
      eq: 'AQ = PC'
    },
    {
      say: '接下来这一招是这道题的关键。把 C 点绕着 A 点，逆时针转六十度，转到 C 撇。因为 AC 转过去长度不变，转的角度又是六十度，所以三角形 ACC 撇也是等边三角形。',
      cite: '旋转的性质：旋转前后长度不变；AC = AC′，∠CAC′ = 60°',
      delNow: LD,
      add: [sACp, sCCp, nCp].concat(aCACp, led(['C′ 是 C 绕 A 转 60°', '⟹ AC = AC′，∠CAC′ = 60°'])),
      front: lift,
      eq: 'AC = AC′，∠CAC′ = 60°'
    },
    {
      say: '注意到一个巧合：C 撇正好落在 l 上。因为角 BAC 是一百二十度，C 往上转六十度，剩下的六十度刚好让它回到 AC 的垂直平分线上。这个位置不是随便画的。',
      cite: '∠BAC = 120°，∠CAC′ = 60° ⟹ AC′ 与 AC 夹角 60°，C′ 落在 AC 的中垂线上',
      delNow: LD,
      add: led(['C′ 恰好在 l 上']),
      front: lift,
      eq: 'C′ ∈ l'
    },
    {
      say: '现在比一比两个三角形：三角形 APC 和三角形 AQC 撇。第一组边 AP 等于 AQ，这是等边三角形给的；第二组边 AC 等于 AC 撇，这是旋转给的。夹角呢？角 PAQ 是六十度，角 CAC 撇也是六十度，两个角都从同一个角 QAC 出发，加减之后剩下的角 PAC 和角 QAC 撇正好相等。',
      cite: 'SAS：AP = AQ，AC = AC′，∠PAC = ∠QAC′（都等于 60° + ∠QAC）',
      delNow: LD,
      add: [sPC, sQCp].concat(led(['AP = AQ，AC = AC′', '∠PAC = ∠QAC′', '⟹ △APC ≌ △AQC′（SAS）'])),
      front: lift,
      eq: '△APC ≌ △AQC′'
    },
    {
      say: '全等之后，对应边相等，所以 PC 等于 QC 撇。把这两条用绿色虚线标出来，一眼就能看到它们一样长。',
      cite: '全等三角形的对应边相等',
      delNow: LD,
      add: led(['PC = QC′']),
      front: lift,
      eq: 'PC = QC′'
    },
    {
      say: '于是周长里的 AQ 加 DQ，就换成了 QC 撇加 DQ。这两段一个从 Q 到 C 撇，一个从 Q 到 D，共用 Q 这个端点。',
      cite: 'AQ = PC = QC′ ⟹ AQ + DQ = QC′ + DQ',
      delNow: LD,
      add: led(['AQ + DQ = QC′ + DQ']),
      front: lift,
      eq: 'AQ + DQ = QC′ + DQ'
    },
    {
      say: '两点之间线段最短：从 C 撇走到 D，中间经过 Q 的那条折线，怎么也短不过直接连 C 撇和 D。所以 QC 撇加 DQ 最小就是 C 撇 D 这一段的长度。',
      cite: '两点之间线段最短（三角形两边之和大于第三边）',
      delNow: LD,
      add: led(['QC′ + DQ ≥ C′D', '取等 ⟺ Q 在 C′D 上']),
      front: lift,
      eq: 'QC′ + DQ ≥ C′D'
    },
    {
      say: 'C 撇和 D 都在 l 上，所以它们是一条竖直线段的两个端点。C 撇的高度是 a 乘二分之根号三，D 在 AC 上高度是零，所以这一段的长度就是二分之根号三倍的 a。',
      cite: 'C′ 与 D 同在 l 上，C′D 沿 l 方向；C′ 的纵坐标为 a·sin60°',
      delNow: LD,
      add: [sCD].concat(led(['C′D = a·√3/2'])),
      front: lift,
      eq: 'C′D = (√3/2)a'
    },
    {
      say: '所以周长的最小值，先写出个大概：a 的一半，加上二分之根号三倍的 a。接下来把根号三这个数用 b 换掉。',
      cite: '周长最小 = AD + C′D = a/2 + (√3/2)a',
      delNow: LD,
      add: led(['周长最小 = a/2 + (√3/2)a']),
      front: lift,
      eq: '周长最小 = a/2 + (√3/2)a'
    },
    {
      say: '取最小值的那一刻，Q 落在 C 撇和 D 之间。而 C 撇和 D 都在 l 上，所以 Q 也在 l 上。问题来了：P 在 l 上，Q 也在 l 上，两个点在同一条直线上。',
      cite: '取等条件 ⟹ Q ∈ C′D ⊂ l；又 P ∈ l',
      delNow: LD,
      add: led(['最小值时 P、Q 都在 l 上']),
      front: lift,
      eq: 'P、Q 共线于 l'
    },
    {
      say: '这两点都在过 D 的垂线上，P 落在 D 的左下，Q 落在 D 的右上。角 PAQ 是六十度，而 AP 等于 AQ。直角三角形 ADP 和 ADQ 有公共的直角边 AD，斜边又相等，所以另外两条直角边 DP 和 DQ 也相等。六十度被平分，各是三十度。',
      cite: 'HL 或勾股：AP = AQ，AD 公共 ⟹ DP = DQ；∠PAQ = 60° ⟹ ∠PAD = ∠DAQ = 30°',
      delNow: LD,
      add: aPAQ.concat(led(['AP = AQ，AD 公共 ⟹ DP = DQ', '∠PAQ = 60° ⟹ ∠PAD = ∠DAQ = 30°'])),
      front: lift,
      eq: '∠DAQ = 30°'
    },
    {
      say: '现在三角形 ADQ 是一个三十度、六十度、九十度的三角形。AD 是 a 的一半，对着三十度的角，所以 DQ 等于 AD 乘以三分之根号三，也就是六分之根号三倍的 a。斜边 AQ 呢，等于 AD 除以二分之根号三，就是根号三分之一倍的 a。',
      cite: 'Rt△ADQ 中 ∠DAQ = 30°，∠ADQ = 90°：DQ = AD·tan30°，AQ = AD / cos30°',
      delNow: LD,
      add: led(['DQ = a·√3/6，AQ = a/√3']),
      front: lift,
      eq: 'DQ = a√3/6，AQ = a/√3'
    },
    {
      say: '题目说这时候 AP 等于 b。而 AP 就是 AQ，所以 b 等于根号三分之一倍的 a。反过来说，a 等于根号三倍的 b，DQ 就是 b 的一半。',
      cite: '题设 AP = b；AP = AQ ⟹ b = a/√3 ⟹ a = √3·b，DQ = a√3/6 = b/2',
      delNow: LD,
      add: led(['AP = AQ = b ⟹ b = a/√3，DQ = b/2']),
      front: lift,
      eq: 'a = √3·b，DQ = b/2'
    },
    {
      say: '把各项代回去：a 的一半，加上 b，再加上 b 的一半，合起来就是 a 加三 b，再除以二。',
      cite: '周长最小 = AD + AQ + DQ = a/2 + b + b/2',
      delNow: LD,
      add: led(['周长最小 = a/2 + b + b/2', '= (a + 3b) / 2']),
      front: lift,
      eq: '周长最小 = (a + 3b)/2',
      hold: 4200
    }
  ];

  window.MATHLAB_LESSONS = window.MATHLAB_LESSONS || [];
  window.MATHLAB_LESSONS.push({
    id: 'ws-b1-perimeter',
    title: '转六十度，把折线拉直：求周长最小值（讲义 B1）',
    grade: '初二',
    topic: '几何 · 轴对称与旋转',
    tags: ['几何', '最值', '垂直平分线', '等边三角形', '旋转', '两点之间线段最短'],
    question: 'AB、AC 是以 A 为公共端点的两条线段，AB = AC = a，∠BAC = 120°。作线段 AC 的垂直平分线 l 交 AC 于点 D，P 为直线 l 上一动点，连接 PA，以 AP 为边构造等边 △APQ，连接 DQ。当 △ADQ 的周长最小时，AP = b，则 △ADQ 周长的最小值为 ___（用含 a、b 的式子表示）。',
    sourceImage: 'img/ws-b1-q.png',
    thumbStep: 4,
    methods: [
      {
        name: '旋转构造 · 把 AQ + DQ 拉成一条线段',
        tier: 'proof',
        sub: '严格证明 · 19 步，含取等条件与 30-60-90',
        steps: steps
      }
    ]
  });
})();
