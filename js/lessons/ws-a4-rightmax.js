/* ============================================================
   （11.16A 基础卷）第 4 题 · 直角里两条等长线段与垂直平分线
   ------------------------------------------------------------
   题：∠MON = 90°，A 为射线 OM 上一点，在射线 ON 上取点 B 使 OB = OA；
      C′ 为线段 OA 垂直平分线上一点（不与 O、A 共线），且 C′ 与 B 位于
      射线 OM 的两侧；连接 AB、OC′、AC′、BC′，线段 BC′ 交 OA 于点 D。
      (1) 补全图形；
      (2) 在 ∠OC′A = 60° 的条件下：
          ① 直接写出 ∠OBC′ 的度数（15°）；
          ② ∠AOB 的角平分线 OF 交 BC′ 于 F，写出 BC′、BF、OF 之间的
             等量关系（BC′ = 2BF + OF）。若 OC′ = 3，当 BC′ 最长时，
             求 BD 的长（6）。

   ------------------------------------------------------------
   两套画布（本课刻意用两个比例尺，不让 B 跑出画布）：

   第一幕 · 60° 构型（步骤 1–14），数学坐标取 a4.json 的 figure：
     O = (0,0) 为原点，射线 OM 沿 +x（水平向右），射线 ON 沿 +y（竖直向上）
     A = (3,0)，B = (0,3)                 OA = OB = 3
     C′ = (3/2, −3√3/2)                   OC′ = AC′ = 3，∠OC′A = 60°
     D = (3(2−√3), 0)                     BC′ 与 OA 的交点
     F = (3(3−√3)/6, 3(3−√3)/6)           OF（45° 角平分线）与 BC′ 的交点
     映射：X = 430 + 52x，Y = 320 − 52y（等比 + y 翻转，角度与比例全部保持）

   第二幕 · 最值构型（步骤 15–20），数学坐标取 a4.json 的 maxcase_figure
   与「自由度」那段：C′ 在以 O 为心、半径 3 的圆上，φ = ∠MOC′，
     OA = 2·x(C′) = 6cosφ，B = (0, 6cosφ)，D = BC′ ∩ OM
     φ = 35° 用于「C′ 还能动」（步骤 15–16），φ = 22.5° 用于最优点（17–20）
     映射：X = 400 + 44x，Y = 364 − 44y

   标注全部由 _collide 口径的脚本量过：顶点字母 ↔ 线段／弧／别的字母
   最小间隙 2.4px（F），其余 ≥ 5px，全部落在 900×520 内。
   ============================================================ */
(function () {
  var AN = window.ANNO, ML = window.ML;
  var COL = AN.COL, FS = AN.FS;
  var sub = AN.sub, add = AN.add, mul = AN.mul, unit = AN.unit, mid = AN.mid, dist = AN.dist;

  var S2 = Math.sqrt(2), S3 = Math.sqrt(3), S6 = Math.sqrt(6);
  var D2R = Math.PI / 180;

  /* 顶点字母：dir 是数学方位角（0° 向右、逆时针为正），d 是离该点的像素距离。
     位置由 _solve 脚本按「线／弧／别的字母／画布边」四处最小间隙算出，不手填。 */
  function lab(id, P, dir, d, text) {
    var r = dir * D2R;
    return AN.txt(id, [P[0] + d * Math.cos(r), P[1] - d * Math.sin(r)], text,
      { size: FS.V, weight: 700, halo: false });
  }

  /* 左下角账本：一步一段算式，最多三行（452 / 478 / 504，末行底边 515 < 520） */
  var LD = ['al0', 'al1', 'al2'];
  function led(lines) {
    return lines.map(function (t, i) {
      return AN.txt('al' + i, [46, 452 + i * 26], t, {
        size: 16, anchor: 'start',
        color: i === lines.length - 1 ? COL.RED : COL.INK
      });
    });
  }

  /* ============================================================
     第一幕：∠OC′A = 60° 的构型（OA = 3，与 OC′ = 3 同值）
     ============================================================ */
  var S1 = 52, X1 = 430, Y1 = 320;
  function P1(x, y) { return [X1 + S1 * x, Y1 - S1 * y]; }

  var pO = P1(0, 0);
  var pA = P1(3, 0);
  var pB = P1(0, 3);
  var pM = P1(4.0, 0);                      // 射线 OM 的端口（方向标记）
  var pN = P1(0, 4.1);                      // 射线 ON 的端口
  var pC = P1(1.5, -1.5 * S3);              // C′：OC′ = 3 且 ∠OC′A = 60°
  var pD = P1(3 * (2 - S3), 0);             // D = BC′ ∩ OA
  var pF = P1(3 * (3 - S3) / 6, 3 * (3 - S3) / 6);
  var fO = dist(pF, pO);
  var pR = add(pF, mul(unit(sub(pC, pF)), fO));          // FR = FO
  var pOfEnd = add(pO, mul(unit(sub(pF, pO)), 84));      // OF 射线画到 84px

  var e = {};                                            // 第一幕图元
  // 两条射线
  e.rayM = { id: 'aRayM', k: 'line', a: pO, b: pM, stroke: COL.EDGE, sw: 2.4 };
  e.rayN = { id: 'aRayN', k: 'line', a: pO, b: pN, stroke: COL.EDGE, sw: 2.4 };
  e.rtO = AN.right('aRtO', pO, sub(pM, pO), sub(pN, pO), 14, COL.RED);
  // 线段 OA 的垂直平分线（虚线，只在掠过横轴的位置往下走，别在三角形里竖一道墙）
  e.bis = { id: 'aBis', k: 'line', a: P1(1.5, 0.40), b: P1(1.5, -3.15), stroke: COL.GREY, sw: 2, dash: [6, 5] };
  // 补全图形的四条线
  e.sAB = { id: 'aAB', k: 'line', a: pA, b: pB, stroke: COL.EDGE, sw: 2.4 };
  e.sOC = { id: 'aOC', k: 'line', a: pO, b: pC, stroke: COL.BLUE, sw: 2.4 };
  e.sAC = { id: 'aAC', k: 'line', a: pA, b: pC, stroke: COL.BLUE, sw: 2.4 };
  e.sBC = { id: 'aBC', k: 'line', a: pB, b: pC, stroke: COL.RED, sw: 3 };
  // 第 (2)② 的角平分线与构造
  e.sOF = { id: 'aOF', k: 'line', a: pO, b: pOfEnd, stroke: COL.TEAL, sw: 2.8 };
  e.sOR = { id: 'aOR', k: 'line', a: pO, b: pR, stroke: COL.PURPLE, sw: 2.4 };
  e.sFR = { id: 'aFR', k: 'line', a: pF, b: pR, stroke: COL.PURPLE, sw: 2.4 };
  // 两块淡底
  e.fillT = { id: 'aFillT', k: 'poly', pts: [pO, pA, pC], fill: AN.wash('37,99,235', 0.07), stroke: 'none' };
  e.fillR = { id: 'aFillR', k: 'poly', pts: [pO, pF, pR], fill: AN.wash('124,58,237', 0.10), stroke: 'none' };
  // 等长记号
  e.tkOB = AN.tick('aTkOB', pO, pB, COL.GREEN, 9, 0);
  e.tkOA = AN.tick('aTkOA', pO, pA, COL.GREEN, 9, 26);     // 让开垂直平分线
  e.tkOC = AN.tick('aTkOC', pO, pC, COL.GREEN, 9, 0);
  e.tkAC = AN.tick('aTkAC', pA, pC, COL.GREEN, 9, 0);
  e.tkFO = AN.tick('aTkFO', pF, pO, COL.PURPLE, 8, -10);
  e.tkFR = AN.tick('aTkFR', pF, pR, COL.PURPLE, 8, 0);
  // 弧（角度数字一律交给左下角账本和右侧「这一步在算什么」，图上不压字）
  e.arc60 = AN.arc('aArc60', pO, pA, pC, 52, COL.PURPLE, 2.2);
  e.arc150 = AN.arc('aArc150', pO, pB, pC, 44, COL.PURPLE, 2.2);
  e.arc45 = AN.arc('aArc45', pO, pA, pF, 34, COL.TEAL, 2.2);
  e.arc15 = AN.arc('aArc15', pB, pO, pC, 54, COL.GREEN, 2.4);
  // 点
  e.dA = { id: 'adA', k: 'circ', c: pA, r: 3.4, fill: COL.EDGE, stroke: 'none' };
  e.dB = { id: 'adB', k: 'circ', c: pB, r: 3.4, fill: COL.EDGE, stroke: 'none' };
  e.dC = { id: 'adC', k: 'circ', c: pC, r: 3.4, fill: COL.BLUE, stroke: 'none' };
  e.dD = { id: 'adD', k: 'circ', c: pD, r: 3.4, fill: COL.RED, stroke: 'none' };
  e.dF = { id: 'adF', k: 'circ', c: pF, r: 3.4, fill: COL.TEAL, stroke: 'none' };
  e.dR = { id: 'adR', k: 'circ', c: pR, r: 3.4, fill: COL.PURPLE, stroke: 'none' };
  // 字母
  e.nO = lab('anO', pO, 192, 26, 'O');
  e.nN = lab('anN', pN, 154, 25, 'N');
  e.nM = lab('anM', pM, 16, 26, 'M');
  e.nA = lab('anA', pA, 301, 32, 'A');
  e.nB = lab('anB', pB, 149, 24, 'B');
  e.nC = lab('anC', pC, 200, 30, 'C′');
  e.nD = lab('anD', pD, 318, 31, 'D');   // 射线下方：D 压在 BC′ 上，改到右侧下方才不会跟 F 混
  e.nF = lab('anF', pF, 344, 29, 'F');   // F 右侧空档（净空 10.7px）
  e.nR = lab('anR', pR, 334, 22, 'R');   // 与 D 同一处，但两步不同屏（step13 撤 anD）
  e.cap = AN.txt('aCap', [50, 44], '∠MON = 90°，OB = OA，C′ 在 OA 的垂直平分线上',
    { size: FS.NOTE, anchor: 'start' });

  // 图层顺序：淡底 → 线 → 弧 → 记号 → 点 → 字母 → 题注 → 账本
  var FRONT_A = [
    'aFillT', 'aFillR',
    'aRayM', 'aRayN', 'aBis', 'aAB', 'aOC', 'aAC', 'aBC', 'aOF', 'aOR', 'aFR',
    'aArc60', 'aArc150', 'aArc45', 'aArc15',
    'aRtO', 'aTkOB', 'aTkOA', 'aTkOC', 'aTkAC', 'aTkFO', 'aTkFR',
    'adA', 'adB', 'adC', 'adD', 'adF', 'adR',
    'anO', 'anN', 'anM', 'anA', 'anB', 'anC', 'anD', 'anF', 'anR',
    'aCap', 'al0', 'al1', 'al2'
  ];
  var ALL_A = FRONT_A.filter(function (id) { return id !== 'al0' && id !== 'al1' && id !== 'al2'; });

  /* ============================================================
     第二幕：只留 OC′ = 3，C′ 在圆上滑 —— 用 φ 参数化
     ============================================================ */
  function figSet(p, phi, YB) {
    var SB = 44, XB = 400;
    var ph = phi * D2R;
    function P(x, y) { return [XB + SB * x, YB - SB * y]; }

    var a = 6 * Math.cos(ph);                    // OA = OB = 2·x(C′)
    var cx = 3 * Math.cos(ph), cy = -3 * Math.sin(ph);
    var t = a / (a - cy);                        // B → D 的插值比例
    var o = P(0, 0), A = P(a, 0), B = P(0, a);
    var M = P(6.5, 0), N = P(0, 6.5);
    var C = P(cx, cy), D = P(cx * t, 0);

    var s = {};
    s.rayM = { id: p + 'RayM', k: 'line', a: o, b: M, stroke: COL.EDGE, sw: 2.4 };
    s.rayN = { id: p + 'RayN', k: 'line', a: o, b: N, stroke: COL.EDGE, sw: 2.4 };
    s.rtO = AN.right(p + 'RtO', o, sub(M, o), sub(N, o), 14, COL.RED);
    s.bis = { id: p + 'Bis', k: 'line', a: P(a / 2, 0.40), b: P(a / 2, -2.05), stroke: COL.GREY, sw: 2, dash: [6, 5] };
    s.sAB = { id: p + 'AB', k: 'line', a: A, b: B, stroke: COL.EDGE, sw: 2.4 };
    s.sOC = { id: p + 'OC', k: 'line', a: o, b: C, stroke: COL.BLUE, sw: 2.4 };
    s.sAC = { id: p + 'AC', k: 'line', a: A, b: C, stroke: COL.BLUE, sw: 2.4 };
    s.sBC = { id: p + 'BC', k: 'line', a: B, b: C, stroke: COL.RED, sw: 3 };
    s.sBD = { id: p + 'BD', k: 'line', a: B, b: D, stroke: COL.ORANGE, sw: 4.4 };
    // C′ 的跑道：以 O 为心、3 为半径的圆弧（只画横轴下方那一段）
    s.arcL = { id: p + 'ArcL', k: 'arc', c: o, r: 3 * SB, from: -72, to: -8, stroke: COL.TEAL, sw: 2, dash: [7, 5] };
    s.arcPhi = AN.arc(p + 'ArcPhi', o, A, C, 44, COL.TEAL, 2.2);
    s.arcD = AN.arc(p + 'ArcD', D, B, o, 28, COL.ORANGE, 2.2);   // ∠BDO = ψ
    s.tkOB = AN.tick(p + 'TkOB', o, B, COL.GREEN, 9, 0);
    s.tkOA = AN.tick(p + 'TkOA', o, A, COL.GREEN, 9, 26);
    s.dA = { id: p + 'dA', k: 'circ', c: A, r: 3.4, fill: COL.EDGE, stroke: 'none' };
    s.dB = { id: p + 'dB', k: 'circ', c: B, r: 3.4, fill: COL.EDGE, stroke: 'none' };
    s.dC = { id: p + 'dC', k: 'circ', c: C, r: 3.4, fill: COL.BLUE, stroke: 'none' };
    s.dD = { id: p + 'dD', k: 'circ', c: D, r: 3.4, fill: COL.ORANGE, stroke: 'none' };
    s.nO = lab(p + 'nO', o, 192, 26, 'O');
    s.nN = lab(p + 'nN', N, phi === 22.5 ? 150 : 154, phi === 22.5 ? 26 : 25, 'N');
    s.nM = lab(p + 'nM', M, 16, 26, 'M');
    s.nA = lab(p + 'nA', A, phi === 22.5 ? 284 : 290, phi === 22.5 ? 30 : 31, 'A');
    s.nB = lab(p + 'nB', B, 149, 24, 'B');
    s.nC = lab(p + 'nC', C, phi === 22.5 ? 199 : 188, 38, 'C′');
    s.nD = lab(p + 'nD', D, phi === 22.5 ? 79 : 74, 36, 'D');   // 射线与 BD 之间的楔形空档（净空 b≈10 / c≈8px）
    s.psi = phi === 22.5 ? AN.txt(p + 'psi', [449.8, 339], '67.5°', { size: FS.NOTE, color: COL.ORANGE, halo: true }) : null;
    s.cap = AN.txt(p + 'Cap', [50, 44], phi === 22.5 ? 'C′ 滑到最优位置：φ = 22.5°' : '换一张图：60° 不再管了',
      { size: FS.NOTE, anchor: 'start' });
    // 右上角状态牌：定长条件与当前 φ
    s.hud1 = AN.txt(p + 'Hud1', [862, 36], 'OC′ = 3（定长）', { size: FS.NOTE, anchor: 'end', color: COL.TEAL });
    s.hud2 = AN.txt(p + 'Hud2', [862, 62], 'φ = ∠MOC′ = ' + (phi === 22.5 ? '22.5°' : '35°'),
      { size: FS.NOTE, anchor: 'end', color: COL.TEAL });

    s.FRONT = [
      p + 'RayM', p + 'RayN', p + 'Bis', p + 'AB', p + 'OC', p + 'AC', p + 'BC', p + 'BD',
      p + 'ArcL', p + 'ArcPhi', p + 'ArcD',
      p + 'RtO', p + 'TkOB', p + 'TkOA',
      p + 'dA', p + 'dB', p + 'dC', p + 'dD',
      p + 'nO', p + 'nN', p + 'nM', p + 'nA', p + 'nB', p + 'nC', p + 'nD', p + 'psi',
      p + 'Cap', p + 'Hud1', p + 'Hud2', 'al0', 'al1', 'al2'
    ];
    s.ALL = s.FRONT.filter(function (id) { return !/^al[012]$/.test(id); });
    s.base = [s.rayM, s.rayN, s.rtO, s.sAB, s.sOC, s.sAC, s.sBC, s.BD || s.sBD];
    return s;
  }

  var B35 = figSet('b', 35, 364);      // 「C′ 还能动」那一幕
  var C225 = figSet('c', 22.5, 364);   // 「滑到最优点」那一幕

  /* ============================================================
     步骤
     ============================================================ */
  var steps = [
    /* ---------- (1) 补全图形 ---------- */
    {
      say: '先认这张图：一条水平向右的射线，一条竖直向上的射线，从同一个点出发——那个公共端点在图的下角，正是小方角的尖，我们叫它 O。两条射线分别叫射线 OM 和射线 ON，M、N 只是方向标记。它们互相垂直，所以角 MON 是九十度。',
      cite: '题设：∠MON = 90°，M、N 分别是射线 OM、ON 上的标记点',
      delNow: LD,
      add: [e.rayM, e.rayN, e.rtO, e.nO, e.nN, e.nM, e.cap].concat(led(['∠MON = 90°'])),
      front: FRONT_A,
      eq: 'OM ⊥ ON，∠MON = 90°'
    },
    {
      say: '点 A 在水平射线上，位置随意。点 B 在竖直射线上，但有个硬条件：O 到 B 必须等于 O 到 A。我在 OA 和 OB 上各画一道绿色短杠，同色就表示等长。',
      cite: '题设：A 为射线 OM 上一点；在射线 ON 上取点 B，使 OB = OA',
      delNow: LD,
      add: [e.dA, e.dB, e.nA, e.nB, e.tkOB, e.tkOA].concat(led(['OB = OA'])),
      front: FRONT_A,
      eq: 'A(a, 0)，B(0, a)，OB = OA = a'
    },
    {
      say: '第二个条件藏得深：点 C 撇落在线段 OA 的垂直平分线上，就是图上那条灰色虚线——它过 OA 的中点，并且跟 OA 垂直。这条线有个性质：线上任何一点到 O 和到 A 的距离都相等，所以 C 撇到 O 等于 C 撇到 A。',
      cite: '题设：C′ 在线段 OA 的垂直平分线上；垂直平分线上的点到线段两端距离相等',
      delNow: LD,
      add: [e.bis].concat(led(['C′O = C′A（垂直平分线）'])),
      front: FRONT_A,
      eq: 'C′O = C′A'
    },
    {
      say: '还有半句：C 撇要和 B 待在水平射线的两边。B 在上方，所以 C 撇只能在下方——图上它在横轴底下，跟 OA 的中点竖直对齐。现在补全图形：连 AB、O 到 C 撇、A 到 C 撇、B 到 C 撇。最后这条从上方斜穿下来，穿过水平射线的那个点就是 D。',
      cite: '题设：C′ 与 B 位于射线 OM 的两侧；连接 AB、OC′、AC′、BC′，线段 BC′ 交 OA 于点 D',
      delNow: LD,
      add: [e.dC, e.nC, e.sAB, e.sOC, e.sAC, e.sBC, e.dD, e.nD]
        .concat(led(['连 AB、OC′、AC′、BC′', 'D = BC′ ∩ OA'])),
      front: FRONT_A,
      eq: '连 AB、OC′、AC′、BC′；D = BC′ ∩ OA'
    },

    /* ---------- (2)① ∠OBC′ = 15° ---------- */
    {
      say: '这一问又添了一个条件：C 撇那个角——从 C 撇往 O、往 A 各连一条边夹出来的角——等于六十度。而已知 C 撇到 O 和到 A 一样长：等腰加顶角六十度，这样的三角形只有一个样子，就是等边三角形。于是 OA、O 到 C 撇、A 到 C 撇三条边全相等，另外两个角也各是六十度，图上用同色短杠标了。',
      cite: '等腰三角形 + 顶角 60° ⟹ 等边三角形',
      delNow: LD,
      add: [e.fillT, e.tkOC, e.tkAC, e.arc60].concat(led(['△OC′A 是等边三角形', 'OA = OC′ = AC′'])),
      front: FRONT_A,
      eq: 'C′O = C′A，∠OC′A = 60° ⟹ OA = OC′ = AC′，∠AOC′ = 60°'
    },
    {
      say: '等边三角形把长度串起来了：O 到 A 等于 O 到 C 撇；而题目早就规定 O 到 B 也等于 O 到 A。一拼，O 到 B 与 O 到 C 撇一样长，三角形 BOC 撇也是等腰的，顶点在 O。它的顶角多大？水平射线把它劈成两块：上面是直角九十度，下面是等边里的六十度，合起来一百五十度，图上那道大弧就是它。',
      cite: 'OB = OA = OC′；∠BOC′ = ∠BOA + ∠AOC′ = 90° + 60°',
      delNow: LD.concat(['aArc60']),
      add: [e.arc150].concat(led(['OB = OA = OC′', '∠BOC′ = 90° + 60° = 150°'])),
      front: FRONT_A,
      eq: 'OB = OC′，∠BOC′ = 90° + 60° = 150°'
    },
    {
      say: '等腰三角形两底角相等，内角和一百八十度，所以每个底角是一百八十减一百五十再除以二，十五度。点 B 处那个角，由竖直的边和斜穿下来的线夹成，正是底角之一。第二问第一小题的答案就是十五度，图上 B 处那道小弧标的就是它。',
      cite: '等腰三角形两底角相等；三角形内角和 180°',
      delNow: LD,
      add: [e.arc15].concat(led(['∠OBC′ = 15°'])),
      front: FRONT_A,
      eq: '∠OBC′ = ∠OC′B = (180° − 150°) ÷ 2 = 15°'
    },

    /* ---------- (2)② 等量关系 ---------- */
    {
      say: '接着看第二问的第二小题。题目又添一条线：从 O 射出的 OF 是角 AOB 的平分线。角 AOB 是九十度，平分后各四十五度，所以 OF 沿着四十五度斜着打出去，和 BC 撇交于 F——就是图上青色射线与红色线段的交叉点。',
      cite: '题设：OF 平分 ∠AOB，交 BC′ 于点 F',
      delNow: LD.concat(['aArc150']),
      add: [e.sOF, e.dF, e.nF, e.arc45].concat(led(['OF 平分 ∠AOB', '∠BOF = 45°'])),
      front: FRONT_A,
      eq: '∠AOF = ∠FOB = 45°，F = BC′ ∩ OF'
    },
    {
      say: '先看三角形 BOF。B 处那个角就是刚算的十五度，O 处是四十五度；内角和一百八十度，所以 F 处是一百八十减十五再减四十五，一百二十度。',
      cite: '三角形内角和 180°',
      delNow: LD,
      add: led(['∠BFO = 180° − 15° − 45°', '= 120°']),
      front: FRONT_A,
      eq: '∠BFO = 180° − 15° − 45° = 120°'
    },
    {
      say: '顺手把另外两个角也算出来，下一步要用。B、F、C 撇三点共线，所以 F 处补出来的角是六十度；O 处从 OF 转到 C 撇跨了两块，四十五加六十，一百零五度。',
      cite: '平角定义；∠FOC′ = ∠FOA + ∠AOC′',
      delNow: LD,
      add: led(['∠OFC′ = 180° − 120° = 60°', '∠FOC′ = 45° + 60° = 105°']),
      front: FRONT_A,
      eq: '∠OFC′ = 60°；∠FOC′ = 45° + 60° = 105°'
    },
    {
      say: '现在把三条线段写出来，用字母 a 表示 O 到 B。B 到 C 撇在三角形 BOC 撇里：两腰都是 a、夹角一百五十度，用余弦定理或作高，得 a 乘根号六加根号二再除以二。B 到 F 和 O 到 F 在三角形 BOF 里用正弦定理：一百二十度对着 OB，四十五度对着 BF，十五度对着 OF。',
      cite: '余弦定理；正弦定理（△BOF 中 120° 对 OB、45° 对 BF、15° 对 OF）',
      delNow: LD,
      add: led(['BC′ = a(√6+√2)/2', 'BF = a√6/3，OF = a(3√2−√6)/6']),
      front: FRONT_A,
      eq: 'BC′ = 2a·sin75° = a(√6+√2)/2；BF = a√6/3；OF = a(3√2−√6)/6'
    },
    {
      say: '三条摆一起：两倍 BF 加 OF，通分化简正好等于 a 乘根号六加根号二除以二，也就是 B 到 C 撇。所以等量关系是：B 到 C 撇等于两倍的 B 到 F 加上 O 到 F。换个写法也对：F 夹在中间，F 到 C 撇等于 BC 撇减 BF，代进去就是 BF 加 OF。',
      cite: '代数通分化简',
      delNow: LD,
      add: led(['2BF + OF = a(√6+√2)/2', 'BC′ = 2BF + OF']),
      front: FRONT_A,
      eq: '2BF + OF = 2a√6/3 + a(3√2−√6)/6 = a(√6+√2)/2 = BC′'
    },
    {
      say: '这不是巧合，可以构造。在 F 往 C 撇的方向取一点 R，让 F 到 R 等于 F 到 O——图上两道紫色短杠。F 处那个角是六十度，腰相等、顶角六十度，三角形 OFR 又是等边：O 到 R 等于 OF，角 F O R 是六十度。于是角 R O C 撇等于角 F O C 撇减六十度；一百零五减六十剩四十五，正好等于角 F O A。',
      cite: '构造等边三角形：腰相等 + 顶角 60° ⟹ 等边',
      delNow: LD.concat(['anD', 'adD']),   // D 在 4~12 步已用完，连同圆点让位给 R，免得「R」被读成标 D
      add: [e.fillR, e.sOR, e.sFR, e.tkFO, e.tkFR, e.dR, e.nR]
        .concat(led(['取 R 使 FR = FO ⟹ △OFR 等边', '∠ROC′ = 105° − 60° = 45°'])),
      front: FRONT_A,
      eq: 'FR = FO，∠OFR = 60° ⟹ △OFR 等边；∠ROC′ = 105° − 60° = 45° = ∠FOA'
    },
    {
      say: '最后拼全等。三角形 ORC 撇与三角形 OFA：OR 等于 OF，OC 撇等于 OA，夹角都是四十五度，两条边加夹角，全等，得 RC 撇等于 FA。另一头，OF 平分角 AOB、OA 等于 OB，所以三角形 AOF 与 BOF 全等，FA 等于 FB。把 BC 撇拆成三段：BF 加 FR 加 RC 撇，就是两倍 BF 加 OF。',
      cite: '边角边全等（SAS）；△AOF ≌ △BOF',
      delNow: LD,
      add: led(['△ORC′ ≌ △OFA ⟹ RC′ = FA = FB', 'BC′ = BF+FR+RC′ = 2BF + OF']),
      front: FRONT_A,
      eq: '△ORC′ ≌ △OFA；△AOF ≌ △BOF ⟹ BC′ = BF + FR + RC′ = 2BF + OF'
    },

    /* ---------- 最后一问：BD ---------- */
    {
      say: '最后一问换了舞台。题目只说 O 到 C 撇等于三，六十度不再出现。于是 C 撇活了：它到 O 固定为三，只能在一个以 O 为心、半径三的圆上滑动，图上那道虚线弧就是跑道；但它还得在 OA 的垂直平分线上，反过来就是 OA 由 C 撇的位置决定——OA 等于 C 撇横坐标的两倍，B 再跟着定。所以只剩一个自由参数：C 撇与水平射线的夹角。',
      cite: '最后一问只给 OC′ = 3；C′ 在 OA 的垂直平分线上 ⟹ OA = 2·x(C′)',
      delNow: LD.concat(ALL_A),
      add: B35.base.concat([B35.bis, B35.arcL, B35.arcPhi, B35.tkOB, B35.tkOA,
        B35.dA, B35.dB, B35.dC, B35.dD, B35.nO, B35.nN, B35.nM, B35.nA, B35.nB, B35.nC, B35.nD,
        B35.cap, B35.hud1, B35.hud2],
        led(['OC′ = 3 定长，60° 放开', 'OA = 2x(C′)，只有一个自由度 φ'])),
      front: B35.FRONT,
      eq: 'C′ = (3cosφ, −3sinφ)，OA = 6cosφ，B = (0, 6cosφ)'
    },
    {
      say: '这里必须说清楚：如果六十度也留着，图就焊死了——C 撇到 O 和到 A 都是三、顶角又是六十度，三角形 O C 撇 A 只能是等边，OA 只能等于三，C 撇只有一个位置，于是 B 到 C 撇是个定值，约五点七九六，哪来的最长？反过来，只留六十度而不定 O 到 C 撇也不行，那只是一族相似图形，会跟着 OA 一起变大。所以最后一问只能是：六十度不管了，只管 O 到 C 撇等于三。',
      cite: '若同时保留 60° 与 OC′ = 3 ⟹ △OC′A 等边 ⟹ OA = 3 唯一；若只给 60°，BC′/OA 为常数，无上界',
      delNow: LD,
      add: led(['60° 也留 ⟹ 图被焊死', 'BC′ ≡ 5.7956，没有「最长」']),
      front: B35.FRONT,
      eq: '∠OC′A = 60° 且 OC′ = 3 ⟹ OA = 3，BC′ ≡ 3(√6+√2)/2 ≈ 5.7956（无最大值）'
    },
    {
      say: '把 B 到 C 撇的平方写成这个夹角的式子。三角形 BOC 撇里用两边夹角：O 到 B 是六倍的这个角的余弦，O 到 C 撇是三，夹角九十度加这个角。展开合并，平方等于二十七加十八倍根号二，再乘「这个角的两倍加四十五度」的正弦。正弦最大是一，所以平方最大二十七加十八倍根号二，等号当这个角等于二十二点五度。',
      cite: '余弦定理 + 辅助角公式（正弦的合成）；正弦的最大值为 1',
      delNow: LD,
      add: led(['BC′² = 27+18√2·sin(2φ+45°)', '≤ 27+18√2，等号 φ = 22.5°']),
      front: B35.FRONT,
      eq: 'BC′² = 36cos²φ + 9 + 36cosφ·sinφ = 27 + 18√2·sin(2φ+45°) ≤ 27 + 18√2，等号当 φ = 22.5°'
    },
    {
      say: '把二十二点五度代回去。最大值是根号下二十七加十八倍根号二，化简为三倍的一加根号二，约七点二四三。这时 OA 等于六倍余弦二十二点五度，也就是三倍根号下二加根号二，约五点五四三；图上 C 撇已经滑到最优点。顺带一看：此刻 C 撇那个角是一百三十五度，早不是六十度了，正好印证上一轮的判断。',
      cite: '27 + 18√2 = 9(3+2√2) = 9(1+√2)²；∠OC′A = 180° − 2φ',
      delNow: LD.concat(B35.ALL),
      add: C225.base.concat([C225.bis, C225.arcL, C225.arcPhi, C225.tkOB, C225.tkOA,
        C225.dA, C225.dB, C225.dC, C225.dD, C225.nO, C225.nN, C225.nM, C225.nA, C225.nB, C225.nC, C225.nD,
        C225.cap, C225.hud1, C225.hud2],
        led(['BC′max = 3(1+√2) ≈ 7.243', 'OA = 6cos22.5° ≈ 5.543'])),
      front: C225.FRONT,
      eq: 'BC′max = √(27+18√2) = 3(1+√2) ≈ 7.2426；OA = 3√(2+√2) ≈ 5.5433；∠OC′A = 135°'
    },
    {
      say: '最后求 BD。D 是 BC 撇与水平射线的交点，BD 是斜着落到横轴上的一段。B 的高度就是 OA；BD 与横轴也夹出一个角，叫它斜角：BD 乘以斜角的正弦，等于这个高度。再看斜率：从 B 沿 BC 撇走到 C 撇，横向走三倍余弦，竖直落下的是正弦三倍加余弦六倍，所以斜角的正切等于这个角的正切加二。二十二点五度的正切是根号二减一，于是斜角的正切是根号二加一，正好是六十七点五度。那么 BD 等于 OA 除以斜角的正弦，而这个正弦就是二十二点五度的余弦，约掉，剩六。',
      cite: '直角三角形的边角关系；互为余角的两个角，正弦等于余弦',
      delNow: LD,
      add: [C225.psi, C225.arcD].concat(led(['tanψ = tanφ+2 = √2+1', 'ψ = 67.5°'])),
      front: C225.FRONT,
      eq: 'tanψ = tanφ + 2 = (√2−1) + 2 = √2+1 = tan67.5° ⟹ ψ = 67.5°；BD = OA/sinψ = 6cos22.5°/cos22.5° = 6'
    },
    {
      say: '所以 BD 等于六，一个整数，干净得可疑。验一遍：这时 O 到 D 约二点二九六，B 的高度五点五四三，拿这两条当直角边算斜边正好是六；D 也确实落在 O 和 A 之间。更一般地，O 到 C 撇换成任意长度，最优角永远是二十二点五度，这时 BD 恰好等于 O 到 C 撇的两倍——这个六不是凑出来的。',
      cite: '勾股定理独立校验；D 在线段 OA 内部（OD < OA）；最优点上 BD = 2·OC′（六组不同尺度扫过）',
      delNow: LD,
      add: led(['BD = OA/sin67.5° = 6', '一般地 BD = 2·OC′ = 6']),
      front: C225.FRONT,
      eq: 'OD ≈ 2.2961，BD = √(OD² + OA²) = √(5.2721 + 30.7279) = 6；一般地 BD = 2·OC′ = 6',
      hold: 4200
    }
  ];

  /* ---------- 存档 ---------- */
  window.MATHLAB_LESSONS = window.MATHLAB_LESSONS || [];
  window.MATHLAB_LESSONS.push({
    id: 'ws-a4-rightmax',
    title: '直角里两条等长线段：BC′ 什么时候最长（讲义 A4）',
    grade: '初二',
    topic: '几何 · 垂直平分线与最值',
    tags: ['几何', '垂直平分线', '等边三角形', '角平分线', '最值', '辅助角公式', '动点'],
    question: '已知 ∠MON = 90°，A 为射线 OM 上一点，在射线 ON 上取一点 B，使 OB = OA。C′ 为线段 OA 垂直平分线上一点（不与 O、A 两点共线），' +
      '且点 C′ 与点 B 位于射线 OM 的两侧。连接 AB、OC′、AC′、BC′，线段 BC′ 交 OA 于点 D。(1) 补全图形；' +
      '(2) 在 ∠OC′A = 60° 的条件下，① 直接写出 ∠OBC′ 的度数；② ∠AOB 的角平分线 OF 交 BC′ 于点 F，直接写出线段 BC′、BF、OF 之间满足的等量关系。' +
      '若 OC′ = 3，当 BC′ 最长时，求 BD 的长。',
    sourceImage: 'img/ws-a4-q.png',
    thumbStep: 4,
    methods: [
      {
        name: '完整推导 · 从 15° 到 BD = 6',
        tier: 'proof',
        sub: '严格证明 · 20 步，含「为什么必须放开 60°」',
        steps: steps
      }
    ]
  });
})();
