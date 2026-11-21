/* ============================================================
   （11.16A 提高班）几何综合 · 等腰三角形里的垂直、等长与折线最值 —— 第 3 题
   ------------------------------------------------------------
   题：在 △ABC 中，AB = AC，点 D 在边 AC 上，∠DBC = 45°，
       点 E 在边 BC 的延长线上，满足 ∠BDC = ∠BAE。
     (1) 判断 BD 与 AE 的位置关系并证明；              → BD ⊥ AE
     (2) 过 E 作 EF ⊥ AE 交 AC 延长线于 F，补全图形，
         用等式表示 AF、AB、AD 之间的数量关系并证明；  → AF = AB + AD
     (3) 若 BE = 2，P、Q 分别是 BE、AE 上的动点，
         直接写出 DP + PQ 的最小值。                    → √2

   摆法（以 BE = 2 为单位长，底角正切取 2，全部点化成九分之几）：
     B=(0,0) C=(4/3,0) A=(2/3,4/3) D=(8/9,8/9) E=(2,0) O=(1,1)
     F=(14/9,−4/9) D′=(8/9,−8/9) 最优点 P*=(16/9,0) Q*=(17/9,1/9)
     映射 X = 270 + 195x，Y = 305 − 195y（横纵同一个比例尺，45° 不会被拉歪）

   版面预算：图占 x 232~700、y 7~495；账本落在左下角 (40,432) 三行、行距 26，
   最长一行止于 x≈370，D′ 标签左沿 385，两者不相撞。
   比例尺 195 不再放大 —— 放大后 D′（y=478.3，标签底到 495）会被裁出画布。
   ============================================================ */
(function () {
  var AN = window.ANNO;
  var COL = AN.COL, FS = AN.FS;
  var sub = AN.sub;

  /* ---------- 数学坐标 → 画布坐标 ---------- */
  var S = 195, OX = 270, OY = 305;
  function P(x, y) { return [OX + S * x, OY - S * y]; }

  var A = P(2 / 3, 4 / 3);      // (400.0, 45.0)
  var B = P(0, 0);              // (270.0, 305.0)
  var C = P(4 / 3, 0);          // (530.0, 305.0)
  var D = P(8 / 9, 8 / 9);      // (443.3, 131.7)
  var E = P(2, 0);              // (660.0, 305.0)
  var F = P(14 / 9, -4 / 9);    // (573.3, 391.7)
  var Dp = P(8 / 9, -8 / 9);    // (443.3, 478.3)  D 关于直线 BE 的对称点
  var O = P(1, 1);              // (465.0, 110.0)  射线 BD 与射线 EA 的交点
  var Ps = P(16 / 9, 0);        // (616.7, 305.0)  最优点 P*
  var Qs = P(17 / 9, 1 / 9);    // (638.3, 283.3)  最优点 Q*
  var P0 = P(3 / 2, 0);         // (562.5, 305.0)  一般位置的动点 P（避开 C 的字母）
  var Q0 = P(4 / 3, 2 / 3);     // (530.0, 175.0)  一般位置的动点 Q

  /* ---------- 字母（坐标取自题解里人眼复核过的那张表） ---------- */
  var nA = AN.txt('xnA', [400, 18], 'A', { size: FS.V, weight: 700, anchor: 'middle' });
  var nB = AN.txt('xnB', [246, 322], 'B', { size: FS.V, weight: 700, anchor: 'end' });
  var nC = AN.txt('xnC', [505, 337], 'C', { size: FS.V, weight: 700, anchor: 'middle' });
  var nD = AN.txt('xnD', [410, 118], 'D', { size: FS.V, weight: 700, anchor: 'end' });
  var nE = AN.txt('xnE', [684, 320], 'E', { size: FS.V, weight: 700, anchor: 'start' });
  var nF = AN.txt('xnF', [592, 412], 'F', { size: FS.V, weight: 700, anchor: 'start' });
  var nDp = AN.txt('xnDp', [413, 484], 'D′', { size: FS.V, weight: 700, anchor: 'end' });
  var nO = AN.txt('xnO', [478, 92], 'O', { size: FS.V, weight: 700, anchor: 'start' });

  /* P、Q 是动点：标签坐标由「点 + 固定偏移」算出来，移动时整体平移，
     所以标签永远跟着点走，不会写死在某个位置。 */
  var P_OFF = [0, 26];            // 点在标签正上方 26px
  var Q_OFF = [13.7, -11.3];      // 标签在点右上方
  var nP = AN.txt('xnP', [P0[0] + P_OFF[0], P0[1] + P_OFF[1]], 'P', { size: FS.V, weight: 700 });
  var nQ = AN.txt('xnQ', [Q0[0] + Q_OFF[0], Q0[1] + Q_OFF[1]], 'Q', { size: FS.V, weight: 700 });
  var PMV = [Ps[0] - P0[0], Ps[1] - P0[1]];    // 滑到最优位置时两点各自的位移
  var QMV = [Qs[0] - Q0[0], Qs[1] - Q0[1]];

  /* ---------- 图注 ---------- */
  var cap1 = AN.txt('xcap1', [40, 34], 'AB = AC，∠DBC = 45°，∠BDC = ∠BAE', { size: 15, anchor: 'start' });
  var cap2 = AN.txt('xcap2', [40, 58], 'D 在 AC 上，E 在 BC 的延长线上', { size: 15, anchor: 'start' });

  /* ---------- 图形本体 ---------- */
  var sAB = { id: 'xsAB', k: 'line', a: A, b: B, stroke: COL.EDGE, sw: 2.4 };
  var sAC = { id: 'xsAC', k: 'line', a: A, b: C, stroke: COL.EDGE, sw: 2.4 };
  var sBD = { id: 'xsBD', k: 'line', a: B, b: D, stroke: COL.EDGE, sw: 2.4 };
  var sAE = { id: 'xsAE', k: 'line', a: A, b: E, stroke: COL.EDGE, sw: 2.4 };

  // 底边必须是 B—C—E 一整条：拆成 B—C 与 C—E 两段首尾相接。
  // 只画 B—C 的话 E 会悬空、底边断在 C，而数值判据全绿也查不出「少画一条线」。
  var sBC = { id: 'xsBC', k: 'line', a: B, b: C, stroke: COL.EDGE, sw: 2.4 };
  var sCE = { id: 'xsCE', k: 'line', a: C, b: E, stroke: COL.EDGE, sw: 2.4 };

  /* ---------- 第二问补图 ---------- */
  var sEF = { id: 'xsEF', k: 'line', a: E, b: F, stroke: COL.EDGE, sw: 2.4 };
  var sCF = { id: 'xsCF', k: 'line', a: C, b: F, stroke: COL.GREY, sw: 2, dash: [6, 5] };

  /* ---------- 第二问的答案线：A→F 与已有的边 A—C 完全共线 ----------
     所以它必须排在 xsAC 之后进 front 数组，并且更粗；
     否则 front 把 xsAC 提上来，答案线就被盖住「消失」，而数值全绿。 */
  var sAF = { id: 'xsAF', k: 'line', a: A, b: F, stroke: COL.RED, sw: 3.4 };

  /* ---------- 第三问辅助 ---------- */
  var sDDp = { id: 'xsDDp', k: 'line', a: D, b: Dp, stroke: COL.GREY, sw: 1.6, dash: [5, 5] };
  var sBDp = { id: 'xsBDp', k: 'line', a: B, b: Dp, stroke: COL.TEAL, sw: 2, dash: [6, 5] };
  var sDP0 = { id: 'xsDP0', k: 'line', a: D, b: P0, stroke: COL.GREY, sw: 2.2, dash: [5, 4] };
  var sP0Q0 = { id: 'xsP0Q0', k: 'line', a: P0, b: Q0, stroke: COL.GREY, sw: 2.2, dash: [5, 4] };
  var sDpP0 = { id: 'xsDpP0', k: 'line', a: Dp, b: P0, stroke: COL.RED, sw: 2.4, dash: [5, 4] };
  var sDpQ0 = { id: 'xsDpQ0', k: 'line', a: Dp, b: Q0, stroke: COL.GREY, sw: 1.8, dash: [4, 4] };
  var sDpPs = { id: 'xsDpPs', k: 'line', a: Dp, b: Ps, stroke: COL.RED, sw: 3.2, dash: [7, 5] };
  var sPsQs = { id: 'xsPsQs', k: 'line', a: Ps, b: Qs, stroke: COL.ORANGE, sw: 3.2 };

  var dotP = { id: 'xdotP', k: 'circ', c: P0, r: 5, fill: COL.RED, stroke: COL.RED };
  var dotQ = { id: 'xdotQ', k: 'circ', c: Q0, r: 5, fill: COL.RED, stroke: COL.RED };
  var dotDp = { id: 'xdotDp', k: 'circ', c: Dp, r: 4.5, fill: COL.TEAL, stroke: COL.TEAL };

  /* ---------- 直角标记：方向给的是方向向量，不是端点坐标 ---------- */
  // O 处 ∠BOE = 90°：方格朝下张开 —— 一边沿 OB（左下）、一边沿 OE（右下）
  var rO = AN.right('xrO', O, sub(B, O), sub(E, O), 16, COL.RED);
  // E 处 ∠AEF = 90°：方格朝左张开 —— 一边沿 EA（左上）、一边沿 EF（左下）
  var rE = AN.right('xrE', E, sub(A, E), sub(F, E), 18, COL.RED);
  // Q* 处 PQ ⊥ AE：方格朝下张开（一边沿 Q*P*、一边沿 Q*E）
  var rQ = AN.right('xrQ', Qs, sub(Ps, Qs), sub(E, Qs), 12, COL.RED);

  /* ---------- 角弧：同一个值就同色同半径 ---------- */
  // β：B、C 两处（r = 40）
  var aBetaB = AN.arc('xaBetaB', B, A, C, 40, COL.GREEN);
  var aBetaC = AN.arc('xaBetaC', C, A, B, 40, COL.GREEN);
  var tBeta = AN.txt('xtBeta', [477.4, 285.8], 'β', { size: 16, color: COL.GREEN, weight: 700 });
  // 45°：题设在 B 处（蓝，r = 68）
  var a45B = AN.arc('xa45B', B, D, C, 68, COL.BLUE);
  var t45B = AN.txt('xt45B', [347.6, 272.8], '45°', { size: 15, color: COL.BLUE, weight: 700 });
  // 钥匙：∠ABD（B 处）与 ∠CAE（A 处），同色同半径（r = 68）
  var aABD = AN.arc('xaABD', B, A, D, 68, COL.ORANGE);
  var aCAE = AN.arc('xaCAE', A, C, E, 68, COL.ORANGE);
  // 题设相等：∠BDC（D 处）与 ∠BAE（A 处），同色同半径（r = 40）
  var aBDC = AN.arc('xaBDC', D, B, C, 40, COL.PURPLE);
  var aBAE = AN.arc('xaBAE', A, B, E, 40, COL.PURPLE);
  // E 处两个 45°（∠AEB 与 ∠BEF），同色同半径（r = 44）
  var aAEB = AN.arc('xaAEB', E, A, B, 44, COL.TEAL);
  var aBEF = AN.arc('xaBEF', E, B, F, 44, COL.TEAL);

  /* ---------- 等长记号 ---------- */
  var tkAB = AN.tick('xtkAB', A, B, COL.GREEN, 9, 0);
  var tkAC = AN.tick('xtkAC', A, C, COL.GREEN, 9, 0);
  // 两对等长要能分清：腰 AB = AC 用单杠，AD = CF 用双杠（教科书记号）
  var tkAD = AN.tick('xtkAD', A, D, COL.GREEN, 9, -4);
  var tkAD2 = AN.tick('xtkAD2', A, D, COL.GREEN, 9, 4);
  // CF 的两道杠沿边朝 F 微移 6 / 14px：放中点会正好压在动点 P 的标签落点上，
  // 但也不能推太远 —— 推到 38px 就贴到 F 端点，看着像在标 F 了。
  var tkCF = AN.tick('xtkCF', C, F, COL.GREEN, 9, 6);
  var tkCF2 = AN.tick('xtkCF2', C, F, COL.GREEN, 9, 14);

  /* ---------- 相似用的底衬（中性淡蓝，不抢戏） ---------- */
  var wCBD = { id: 'xwCBD', k: 'poly', pts: [C, B, D], fill: AN.wash('37,99,235', 0.09), stroke: 'none' };
  var wEBA = { id: 'xwEBA', k: 'poly', pts: [E, B, A], fill: AN.wash('37,99,235', 0.09), stroke: 'none' };
  var wCEF = { id: 'xwCEF', k: 'poly', pts: [C, E, F], fill: AN.wash('37,99,235', 0.09), stroke: 'none' };

  /* ---------- 左下角账本（最多三行，最后一行红） ---------- */
  function L() {
    var a = [].slice.call(arguments);
    return a.map(function (t, i) {
      return AN.txt('xled' + i, [40, 432 + i * 26], t, {
        size: 16, anchor: 'start',
        color: i === a.length - 1 ? COL.RED : COL.INK
      });
    });
  }
  var LD = ['xled0', 'xled1', 'xled2'];

  /* ---------- 叠放顺序（底 → 顶）：每一步都整体重排一次 ----------
     顺序就是「谁压谁」。三条硬规矩都落在这里：
       · 底边两段 xsBC、xsCE 贴着图形本体，谁也不许再压一条细线上去；
       · 答案线 xsAF 必须排在与之共线的 xsAC 之后，否则会被盖住；
       · 线和记号都在文字之下（文字自带白描边，压在线上也读得清）。 */
  var LIFT = [
    'xwCBD', 'xwEBA', 'xwCEF',
    'xsAB', 'xsAC', 'xsBC', 'xsCE',
    'xsEF', 'xsCF', 'xsDDp', 'xsBDp',
    'xsDP0', 'xsP0Q0', 'xsDpP0', 'xsDpQ0',
    'xsBD', 'xsAE',
    'xsAF',
    'xsDpPs', 'xsPsQs',
    'xaBetaB', 'xaBetaC', 'xa45B', 'xaBDC', 'xaBAE', 'xaABD', 'xaCAE', 'xaAEB', 'xaBEF',
    'xtkAB', 'xtkAC', 'xtkAD', 'xtkAD2', 'xtkCF', 'xtkCF2',
    'xrO', 'xrE', 'xrQ',
    'xdotP', 'xdotQ', 'xdotDp',
    'xnA', 'xnB', 'xnC', 'xnD', 'xnE', 'xnF', 'xnDp', 'xnO', 'xnP', 'xnQ',
    'xtBeta', 'xt45B',
    'xcap1', 'xcap2', 'xled0', 'xled1', 'xled2'
  ];

  /* ============================================================
     步骤（19 步，三问连着走）
     ============================================================ */
  var steps = [

    /* ---------- 第一问 ---------- */
    {
      say: '先把图摆清楚。最底下是一条横线，从左往右排着三个点：最左边那个叫 B，中间偏左那个叫 C，最右边那个叫 E —— 底边是从 B 一路连到 E 的一整条，C 被夹在当中。最上面那个尖是 A，从 A 往左下连到 B、往右下连到 C，这两条腰一样长，所以这是一个等腰三角形。题目又在从 A 斜着往右下到 C 的那条边上取了一点叫 D，再从 B 往右上方斜着连一条线到 D，这条就是 BD。',
      cite: '题设：AB = AC；点 D 在边 AC 上；点 E 在 BC 的延长线上（C 在 B、E 之间）',
      delNow: LD,
      add: [sAB, sAC, sBC, sCE, sBD, sAE, nA, nB, nC, nD, nE, cap1, cap2]
        .concat(L('AB = AC，D 在 AC 上', 'B、C、E 三点共线，C 在中间')),
      front: LIFT,
      eq: 'AB = AC，D ∈ AC，C ∈ BE'
    },
    {
      say: '等腰三角形有个固定的福利：两条腰一样长，贴着底边的两个角就一样大。底边左边那一头的角、也就是 B 处的那个角，和右边那一头、C 处的那个角相等 —— 图上这两道绿色的小弧一样大，半径也一样；两条腰上还各画了一道绿色的小短杠，标的是腰等长。我们把这两个角一起记作贝塔，后面所有推导都要靠它。',
      cite: '等腰三角形的两个底角相等',
      delNow: LD,
      add: [tkAB, tkAC, aBetaB, aBetaC, tBeta]
        .concat(L('等腰三角形两底角相等', '∠ABC = ∠ACB = β')),
      front: LIFT,
      eq: '∠ABC = ∠ACB = β'
    },
    {
      say: '先看 B、C、D 三个点围出来的那个小三角形。题面在 B 处给了一个四十五度的角：斜线 BD 和底边 BC 夹出来的那一块，就是图上蓝色的小弧。C 处的角就是刚才那个贝塔。三角形三个内角加起来是一百八十度，把这两个角减掉，D 处的角就出来了。',
      cite: '三角形内角和 180°；∠DBC = 45°（题设）；∠BCD = ∠BCA = β（D 在 AC 上、C 在 BE 上）',
      delNow: LD,
      add: [a45B, t45B, aBDC]
        .concat(L('∠DBC = 45°，∠BCD = β', '∠BDC = 180° − 45° − β = 135° − β')),
      front: LIFT,
      eq: '∠BDC = 135° − β'
    },
    {
      say: '题目还补了一句：D 处这个角，等于把 A 分别和 B、E 连起来之后、在 A 处张开的那个大角。那就把刚算出来的值原样搬到 A 处去。图上 A 处那道紫色的小弧和 D 处那道紫色的小弧一样大，说的就是这件事。',
      cite: '题设 ∠BDC = ∠BAE',
      delNow: LD,
      add: [aBAE].concat(L('题设 ∠BDC = ∠BAE', '∠BAE = 135° − β')),
      front: LIFT,
      eq: '∠BAE = ∠BDC = 135° − β'
    },
    {
      say: '这一步是三问共同的钥匙，慢一点，两个事实拼起来。先看 D 处：A、D、C 三点排成一条直线，所以 D 处那个角和它旁边贴着 A 的那一块加起来正好一百八十度；而贴着 A 的那一块又是三角形 ABD 的内角，它等于一百八十度减去角 BAD、再减去角 ABD。两条一叠，D 处的角就等于角 BAD 加角 ABD。再看 A 处：射向 D 和射向 C 是同一条射线，而 E 又落在 C 的外侧，所以从 A 看过去，这条射线把大角切成了两块 —— 角 BAD 和角 CAE。同一个大角，两种写法，把角 BAD 减掉，剩下的就是：角 ABD 等于角 CAE。图上 B 处和 A 处那两道橙色的小弧一样大，就是这一步的成果。',
      cite: '平角 ∠BDC + ∠BDA = 180°；△ABD 内角和；∠BAE = ∠BAD + ∠CAE（射线 AC 夹在 AB 与 AE 之间）',
      delNow: LD,
      add: [aABD, aCAE]
        .concat(L('∠BDC = ∠BAD + ∠ABD（A、D、C 共线）',
          '∠BAE = ∠BAD + ∠CAE（射线 AC 在内部）',
          '⟹ ∠ABD = ∠CAE')),
      front: LIFT,
      eq: '∠BDC = 180° − ∠BDA = ∠BAD + ∠ABD，又 ∠BDC = ∠BAE = ∠BAD + ∠CAE ⟹ ∠ABD = ∠CAE'
    },
    {
      say: '接着看右边那个三角形，顶点是 A、C、E。先看 C 处：C 夹在 B 和 E 之间，所以 C 处朝着 E 那一侧的角，等于一百八十度减去贝塔。再看 A 处：朝着 E 的那一块，正是上一步证出来、和角 ABD 相等的那块。三角形内角和一减再一减，E 处的角就是贝塔减去角 ABD；而贝塔就是 B 处的整个角，把这个小角从里面挖掉，剩下的正是题面给的四十五度。图上下方 E 处那道青色的小弧，就是它。',
      cite: 'C 在 B、E 之间 ⟹ ∠ACE = 180° − ∠ACB；△ACE 内角和；∠CAE = ∠ABD；射线 BD 在 ∠ABC 内部',
      delNow: LD,
      add: [aAEB].concat(L('∠ACE = 180° − β（C 在 B、E 之间）',
        '∠AEC = 180° − (180° − β) − ∠ABD',
        '= β − ∠ABD = ∠ABC − ∠ABD = 45°')),
      front: LIFT,
      eq: '∠AEC = β − ∠ABD = ∠ABC − ∠ABD = ∠DBC = 45°'
    },
    {
      say: '现在把两个四十五度摆到一起。从 B 出发那条斜线往上斜、和底边成四十五度；从 E 出发连回 A 的那条斜线也往上斜、和底边成四十五度，只不过一个朝右上、一个朝左上。两条射线都在底边的同一侧，头对头地倾过来，一定会在图形内部碰头，把这个交点记作 O —— 就是图上标着字母的那个点。然后看 B、O、E 三点围出来的三角形：B 处四十五度，E 处也是四十五度，内角和一百八十度一减，O 处就是九十度。图上 O 处那个朝下张开的小方角，就是直角。第一问的答案就在这里：两条斜线 BD 和 AE 互相垂直。',
      cite: '三角形内角和 180°；∠DBC = ∠AEC = 45°；射线 BD 与射线 EA 在直线 BE 同侧必相交',
      delNow: LD,
      upd: [{ id: 'xsBD', stroke: COL.RED, sw: 3.2 }, { id: 'xsAE', stroke: COL.RED, sw: 3.2 }],
      add: [nO, rO].concat(L('B、O、E 三点围出的三角形',
        '∠BOE = 180° − 45° − 45° = 90°',
        '⟹ BD ⊥ AE')),
      front: LIFT,
      eq: '∠BOE = 180° − 45° − 45° = 90° ⟹ BD ⊥ AE',
      hold: 3800
    },

    /* ---------- 第二问 ---------- */
    {
      say: '第二问要先补图。过 E 作一条和 AE 垂直的线：AE 是从 A 往右下走到 E 的，所以它的垂线往左下那个方向走。这条线从 E 出发斜着往下，会和 AC 的延长线在 C 的下方相遇，那个交点叫 F，就是图右下角那个点。记住这三点的顺序：沿着直线从 A 出发，先过 D、再过 C、最后到 F，C 被夹在中间，后面化简要用。图上 E 处那个朝左张开的小方角，就是这条垂线和 AE 的直角。',
      cite: '过 E 作 EF ⊥ AE，交 AC 的延长线于点 F',
      delNow: LD,
      add: [sEF, sCF, nF, rE]
        .concat(L('过 E 作 EF ⊥ AE，交 AC 延长线于 F',
          'A、C、F 共线，C 在 A、F 之间')),
      front: LIFT,
      eq: 'EF ⊥ AE；A、C、F 共线，C 在 A、F 之间'
    },
    {
      say: '因为 AE 和 EF 垂直，从 A 经 E 到 F 那个角是九十度；而刚才已经知道 E 处、底边和 EA 的夹角是四十五度。九十度切掉四十五度，剩下的也是四十五度 —— 也就是说，底边那条线正好把 A 和 F 之间那个直角劈成两半。图上 E 处以底边为界，上下一共两道青色的弧，大小一样。',
      cite: '∠AEF = 90°（EF ⊥ AE）；∠AEB = 45°（与 ∠AEC 同为 45°，E、C、B 共线同向）',
      delNow: LD,
      add: [aBEF].concat(L('∠AEF = 90°，∠AEB = 45°',
        '⟹ ∠BEF = 45°，底边 BE 平分 ∠AEF')),
      front: LIFT,
      eq: '∠BEF = ∠AEF − ∠AEB = 90° − 45° = 45°'
    },
    {
      say: '第一组相似：拿 B、C、D 围出的小三角形，和 E、B、A 围出的三角形比。前者在 B 处是四十五度，后者在 E 处也是四十五度；前者在 C 处是贝塔，后者在 B 处也是贝塔 —— 因为 E 就躺在 BC 这条延长线上，从 B 往 E 看和从 B 往 C 看是同一个方向。两组角都对上，两个三角形相似；把对应边写成比例，再交叉相乘，就得到 CD 乘 BE 等于 AB 乘 CB。图上这两块淡蓝色的底衬，就是被挑出来的这两只。',
      cite: '∠CBD = ∠BEA = 45°；∠BCD = ∠ABE = β（等腰 △ABC 两底角相等）；两组角对应相等',
      delNow: LD,
      add: [wCBD, wEBA]
        .concat(L('∠CBD = ∠BEA = 45°',
          '∠BCD = ∠ABE = β',
          '△CBD ∽ △EBA ⟹ CD·BE = AB·CB')),
      front: LIFT,
      eq: '△CBD ∽ △EBA ⟹ CD/AB = CB/BE ⟹ CD·BE = AB·CB'
    },
    {
      say: '第二组相似：还是 B、C、D 那个小三角形，这次配上 C、E、F 围出的那只。前者在 B 处四十五度，后者在 E 处也是四十五度，刚证过。前者在 C 处是贝塔；后者在 C 处也是贝塔 —— 因为 A、C、F 在一条直线上，C 处朝 F 的那一边和朝 A 的那一边正好互补，补回来还是贝塔。所以这两个也相似，并且 C 对 C、F 对 D。写比例、交叉相乘，得到 CF 乘 CB 等于 CD 乘 CE。',
      cite: '∠CBD = ∠CEF = 45°；∠BCD = β = 180° − ∠ACE = ∠ECF',
      delNow: LD.concat(['xwEBA']),
      add: [wCEF]
        .concat(L('∠CBD = ∠CEF = 45°',
          '∠BCD = 180° − ∠ACE = ∠ECF',
          '△CBD ∽ △CEF ⟹ CF·CB = CD·CE')),
      front: LIFT,
      eq: '△CBD ∽ △CEF ⟹ CF/CD = CE/CB ⟹ CF·CB = CD·CE'
    },
    {
      say: '把两条乘积关系拼起来。第一条给出：CD 等于 AB 乘 CB、再除以 BE。第二条给出：CF 等于 CD 乘 CE、再除以 CB。把第一条代进第二条，CB 一上一下正好约掉，CF 就只剩下 AB 乘 CE、再除以 BE。',
      cite: '由 △CBD ∽ △EBA 得 CD = AB·CB/BE，代入 CF = CD·CE/CB',
      delNow: LD.concat(['xwCBD', 'xwCEF']),
      add: L('CD = AB·CB / BE', 'CF = CD·CE/CB = AB·CE/BE'),
      front: LIFT,
      eq: 'CF = (AB·CB/BE)·(CE/CB) = AB·CE/BE'
    },
    {
      say: '再算 AD 的长，凑成同一副样子。D 在 AC 上，所以 AD 等于 AC 减 CD；AC 和 AB 一样长，CD 就是上面那个用 AB 写出来的式子。整理一下：把 AB 提出来，括号里是 BE 减去 CB，而 C 夹在 B、E 之间，这一减正好等于 CE。于是 AD 也等于 AB 乘 CE、再除以 BE —— 和 CF 一模一样。',
      cite: 'AD = AC − CD；AC = AB；CD = AB·CB/BE；BE − CB = CE（C 在 B、E 之间）',
      delNow: LD,
      add: L('AD = AC − CD = AB − AB·CB/BE', '= AB·(BE − CB)/BE = AB·CE/BE'),
      front: LIFT,
      eq: 'AD = AB − AB·CB/BE = AB·(BE − CB)/BE = AB·CE/BE = CF'
    },
    {
      say: '两条线段算出同一个表达式，所以它们一样长：AD 等于 CF，图上这两段各画了一道绿色的小短杠，长度一样。现在回头看 AF —— 沿直线依次是 A、C、F，C 夹在中间，所以 AF 等于 AC 加 CF；而 AC 就是 AB，CF 又换成了 AD。这就得到要写的那条等式：AF 等于 AB 加 AD。图上那条红色的、从 A 一直拉到 F 的线，就是这条等式的主角。',
      cite: 'AF = AC + CF（C 在 A、F 之间）；AC = AB；CF = AD',
      delNow: LD,
      add: [sAF, tkAD, tkAD2, tkCF, tkCF2].concat(L('AD = CF', 'AF = AC + CF = AB + AD')),
      front: LIFT,
      eq: 'AF = AC + CF = AB + AD',
      hold: 3600
    },

    /* ---------- 第三问 ---------- */
    {
      say: '第三问只谈长度。P 在底边 BE 上跑，Q 在 A 到 E 那条斜线上跑 —— 图上这两个小点就是它们，字母是跟着点走的。先固定一个 P 来看：从 P 连到斜线上的点 Q，最短的那条，是垂直于斜线的那条垂线段，这叫垂线段最短。所以 PQ 压到底，就等于 P 到斜线的垂直距离。问题于是变成：在底边上挑一个 P，让它到 D 的距离、加上它到斜线的垂直距离，合起来最小。',
      cite: '垂线段最短',
      delNow: LD,
      add: [dotP, dotQ, nP, nQ, sDP0, sP0Q0]
        .concat(L('P 在 BE 上、Q 在 AE 上动',
          'PQ 最短 ⟺ PQ ⊥ AE（垂线段最短）')),
      front: LIFT,
      eq: 'PQ ≥ dist(P, 直线 AE)，取等当 PQ ⊥ AE'
    },
    {
      say: '老办法：把 D 沿底边翻折，落到直线另一侧的对称点，记作 D 一撇，就是图上最下面那个点。P 本来就压在翻折那根轴、也就是底边上，所以 D 到 P 的距离和 D 一撇到 P 的距离一样。再看方向：BD 和底边成四十五度，翻过来之后，B 到 D 一撇这条线也和底边成四十五度，只是歪到了另一侧；而 AE 和底边同样成四十五度。两条斜线和底边的夹角一样大、左右正好对称，所以 B 到 D 一撇这条线和 AE 平行。既然平行，D 一撇到这条斜线的距离就等于 B 到斜线的距离，也就是 BE 乘四十五度的正弦 —— BE 是二，算出来是根号二。',
      cite: '轴对称保距；∠(BD′, BE) = ∠(BD, BE) = 45°，∠(AE, BE) = 45°；两条平行线之间距离处处相等',
      delNow: LD,
      add: [dotDp, nDp, sDDp, sBDp]
        .concat(L('D′ 为 D 关于 BE 的对称点：DP = D′P',
          'BD′ 与 BE、AE 与 BE 各成 45° ⟹ BD′ ∥ AE',
          'd(D′, AE) = d(B, AE) = BE·sin45° = √2')),
      front: LIFT,
      eq: 'BD′ ∥ AE ⟹ dist(D′, 直线 AE) = dist(B, 直线 AE) = BE·sin45° = 2·(√2/2) = √2'
    },
    {
      say: '现在整条折线的走法清楚了：从 D 一撇出发，先落到下边那个 P，再上到斜边上的 Q。两点之间线段最短，所以 D 一撇经 P 到 Q 的长度，不小于 D 一撇直接连到 Q 的长度；而 Q 在斜线上，D 一撇到 Q 又不小于 D 一撇到斜线的垂直距离。那个垂直距离刚算过，是根号二。所以 P、Q 怎么动，DP 加 PQ 都压不到根号二以下。图上那条红色的折线，就是被换过身份的 DP；灰色细线是它走的那条近路。',
      cite: '三角形两边之和大于第三边（|D′P| + |PQ| ≥ |D′Q|）；点到直线的距离最短',
      delNow: LD.concat(['xsDP0']),
      add: [sDpP0, sDpQ0]
        .concat(L('DP + PQ = D′P + PQ', '≥ D′Q ≥ d(D′, 直线 AE) = √2')),
      front: LIFT,
      eq: 'DP + PQ = D′P + PQ ≥ D′Q ≥ dist(D′, 直线 AE) = √2'
    },
    {
      say: '还要确认根号二真的能碰到。从 D 一撇向斜线作垂线，垂足叫 Q 星；这条垂线再和底边相交，交点叫 P 星 —— 就是图上这两个点滑过去的新位置，字母跟着一起走。算一下：垂足落在斜边的线段内部，交点也落在底边的内部，两个点都合法。这时候 D 一撇、P 星、Q 星三点拉成一条直线，两处取等同时成立。所以第三问的最小值就是根号二，约等于一点四一四。',
      cite: '取等条件：D′、P、Q 三点共线且 PQ ⊥ AE，且垂足在 AE 段内、交点在 BE 段内（本图坐标可精确验证）',
      delNow: LD.concat(['xsDpP0', 'xsDpQ0', 'xsP0Q0']),
      upd: [
        { id: 'xdotP', move: PMV }, { id: 'xnP', move: PMV },
        { id: 'xdotQ', move: QMV }, { id: 'xnQ', move: QMV }
      ],
      add: [sDpPs, sPsQs, rQ]
        .concat(L('D′、P*、Q* 三点共线，且 P*Q* ⊥ AE',
          '⟹ DP + PQ 的最小值 = D′Q* = √2',
          'P*、Q* 都在线段内部 ⟹ 取得到')),
      front: LIFT,
      eq: 'min(DP + PQ) = √2 = BE·sin45°；此时 P* = (16/9, 0)，Q* = (17/9, 1/9)',
      hold: 4600
    },
    {
      say: '三问收束。第一问：两条斜线和底边各成四十五度、方向一正一反，交出来就是直角，所以 BD 垂直于 AE，证据是 O 处那个朝下张开的小方角。第二问：两组相似把 CF 折成 AD 的长度，于是 AF 等于 AB 加 AD。第三问：把 D 翻到另一侧，折线就化成一条直线到斜线的距离，最小值是根号二。三道题的答案，都摆在图上这几条线和那三个小方角里了。',
      cite: '(1) ∠BOE = 90°；(2) △CBD ∽ △EBA 与 △CBD ∽ △CEF ⟹ CF = AB·CE/BE = AD；(3) 轴对称 + 平行 ⟹ dist = BE·sin45° = √2',
      delNow: LD,
      add: L('(1) BD ⊥ AE', '(2) AF = AB + AD', '(3) min(DP + PQ) = √2'),
      front: LIFT,
      eq: '(1) BD ⊥ AE　(2) AF = AB + AD　(3) min(DP + PQ) = √2',
      hold: 5200
    }
  ];

  /* ---------- 存档 ---------- */
  window.MATHLAB_LESSONS = window.MATHLAB_LESSONS || [];
  window.MATHLAB_LESSONS.push({
    id: 'ws-b3-perp',
    title: '两个四十五度，逼出 BD ⊥ AE（讲义 B3）',
    grade: '初二',
    topic: '几何 · 等腰、相似与折线最值',
    tags: ['几何', '等腰三角形', '相似', '垂直', '翻折', '动点', '最值', '三问综合'],
    question: '如图，在 △ABC 中，AB = AC，点 D 在边 AC 上，∠DBC = 45°，点 E 在边 BC 延长线上，满足 ∠BDC = ∠BAE。(1) 判断 BD 和 AE 的位置关系，并证明；(2) 过 E 作 EF ⊥ AE 交 AC 延长线于点 F，补全图形，用等式表示 AF、AB、AD 之间的数量关系并证明；(3) 若 BE = 2，点 P、Q 分别是线段 BE、AE 上的动点，直接写出 DP + PQ 的最小值。',
    sourceImage: 'img/ws-b3-q.png',
    thumbStep: 7,
    methods: [
      {
        name: '完整推导 · 从 BD ⊥ AE 到 min(DP + PQ) = √2',
        tier: 'proof',
        sub: '严格证明 · 19 步，三问连着走',
        steps: steps
      }
    ]
  });
})();
