/* ============================================================
   （11.16A 基础卷）只用一把无刻度直尺作对称轴 —— 第 1 题
   ------------------------------------------------------------
   题：小明在画对称轴的过程中忘记带圆规，只带了一把无刻度的直尺。
     (1) 轴对称图形对应点连线互相 ____（填「平行」或「垂直」）；
     (2) 如图1，画出线段 AB 与 A₁B₁ 的对称轴。小明的画法：连接 AB₁ 与
         A₁B，两线段交于点 O，延长 BA 与 B₁A₁ 交于点 P，连接 OP、AA₁、BB₁。
         ① 根据小明的画法完成作图；
         ② 证明 ∠ABB₁ = ∠A₁B₁B；
         ③ 由 ② 证明 OP 是 AA₁ 与 BB₁ 的垂直平分线，也就是对称轴。
     (3) 如图2，只用直尺作出 △ABC 与 △AB₁C₁ 的对称轴，
         写出画法并证明。

   坐标全部来自 _docs/solved/a1.json（它已用 a1.check.mjs 验过 91 条判据）：
     图1  X = 450 + 1.3x ，Y = 268 − 1.3y ，对称轴是 x = 0 那条竖线
       A(372,151)  A₁(528,151)  B(138,424)  B₁(762,424)
       O(450,205.6) = AB₁ ∩ A₁B          P(450,60) = 直线 BA ∩ 直线 B₁A₁
       竖轴像素范围 (450,21) → (450,476)
     图2  X = 450 + 1.2x ，Y = 222 − 1.2y ，对称轴同样是 x = 0
       A(450,66)  B(234,186)  B₁(666,186)  C(378,354)  C₁(522,354)
       O(450,312) = BC₁ ∩ B₁C            P(450,438) = 直线 BC ∩ 直线 B₁C₁
       竖轴像素范围 (450,30) → (450,474)

   版面账（900×520）：
     · 图1 的左下角被 B 点和 AB 边占着，所以账本只写两行，压在 y=470 / 494；
     · O 是全图最挤的点 —— 两条交叉线和中间那条竖轴都从它身上过，
       它的字母必须退进左侧那道楔形里；退 36px（图1）/ 39px（图2）
       才能让字框到两条线都留出 10px 以上，这是算出来的，不是试出来的；
     · P 的字母一律放右上，躲开竖轴（横距 16px）；
     · 图2 的 A 在对称轴上，字母只能放右上，同样躲开竖轴。
   ============================================================ */
(function () {
  var AN = window.ANNO;
  var COL = AN.COL, FS = AN.FS;
  var sub = AN.sub;

  /* ---------- 数学坐标 → 画布坐标（两图各一套，照 a1.json 的 to_px） ---------- */
  function P1(x, y) { return [450 + 1.3 * x, 268 - 1.3 * y]; }
  function P2(x, y) { return [450 + 1.2 * x, 222 - 1.2 * y]; }

  /* ---------- 图1 的六个关键点 ---------- */
  var A  = P1(-60, 90);        // (372, 151)
  var A1 = P1(60, 90);         // (528, 151)
  var B  = P1(-240, -120);     // (138, 424)
  var B1 = P1(240, -120);      // (762, 424)
  var O  = P1(0, 48);          // (450, 205.6)
  var Pp = P1(0, 160);         // (450, 60)
  var AX1_T = P1(0, 190);      // (450, 21)
  var AX1_B = P1(0, -160);     // (450, 476)

  /* ---------- 图2 的七个关键点 ---------- */
  var A2   = P2(0, 130);       // (450, 66)
  var B2   = P2(-180, 30);     // (234, 186)
  var B12  = P2(180, 30);      // (666, 186)
  var C2   = P2(-60, -110);    // (378, 354)
  var C12  = P2(60, -110);     // (522, 354)
  var O2   = P2(0, -75);       // (450, 312)
  var P2p  = P2(0, -180);      // (450, 438)
  var AX2_T = P2(0, 160);      // (450, 30)
  var AX2_B = P2(0, -210);     // (450, 474)

  /* ---------- 账本：两行，最后一行转成结论色 ---------- */
  function led(lines) {
    return lines.map(function (t, i) {
      return AN.txt('led' + i, [46, 468 + i * 32], t, {
        size: 16, anchor: 'start',
        color: i === lines.length - 1 ? COL.RED : COL.INK
      });
    });
  }
  var LED = ['led0', 'led1'];

  /* ============================================================
     图1 的图元
     ============================================================ */

  // 已知的两条线段
  var aAB   = { id: 'aAB',   k: 'line', a: A,  b: B,  stroke: COL.EDGE, sw: 2.8 };
  var aA1B1 = { id: 'aA1B1', k: 'line', a: A1, b: B1, stroke: COL.EDGE, sw: 2.8 };

  // 对应点连线（第 2 步先画成淡虚线，第 5 步作图时改成实线）
  var aAA1 = { id: 'aAA1', k: 'line', a: A, b: A1, stroke: COL.GREY, sw: 2, dash: [6, 5] };
  var aBB1 = { id: 'aBB1', k: 'line', a: B, b: B1, stroke: COL.GREY, sw: 2, dash: [6, 5] };

  // 小明的画法：交叉连线、延长线、OP
  var aAB1 = { id: 'aAB1', k: 'line', a: A,  b: B1, stroke: COL.TEAL, sw: 2.2 };
  var aA1B = { id: 'aA1B', k: 'line', a: A1, b: B,  stroke: COL.TEAL, sw: 2.2 };
  var aAP  = { id: 'aAP',  k: 'line', a: A,  b: Pp, stroke: COL.GREY, sw: 2, dash: [7, 5] };
  var aA1P = { id: 'aA1P', k: 'line', a: A1, b: Pp, stroke: COL.GREY, sw: 2, dash: [7, 5] };

  // OP：构造出来的那一段画实，两端延长的部分画虚 —— 合起来才是「直线 OP」
  var aOP    = { id: 'aOP',    k: 'line', a: Pp, b: O,      stroke: COL.RED, sw: 3.4 };
  var aOPup  = { id: 'aOPup',  k: 'line', a: AX1_T, b: Pp,  stroke: COL.RED, sw: 2.2, dash: [6, 6] };
  var aOPdn  = { id: 'aOPdn',  k: 'line', a: O, b: AX1_B,   stroke: COL.RED, sw: 2.2, dash: [6, 6] };

  // 交点与字母
  var adotO = { id: 'adotO', k: 'circ', c: O,  r: 4.5, fill: COL.RED, stroke: 'none' };
  var adotP = { id: 'adotP', k: 'circ', c: Pp, r: 4.5, fill: COL.RED, stroke: 'none' };
  var anA  = AN.txt('anA',  [358, 130], 'A',  { size: FS.V, weight: 700, anchor: 'end' });
  var anA1 = AN.txt('anA1', [542, 130], 'A₁', { size: FS.V, weight: 700, anchor: 'start' });
  var anB  = AN.txt('anB',  [120, 428], 'B',  { size: FS.V, weight: 700, anchor: 'end' });
  var anB1 = AN.txt('anB1', [780, 428], 'B₁', { size: FS.V, weight: 700, anchor: 'start' });
  var anO  = AN.txt('anO',  [406, 205.6], 'O', { size: FS.V, weight: 700, anchor: 'end' });
  var anP  = AN.txt('anP',  [468, 46],  'P',  { size: FS.V, weight: 700, anchor: 'start' });

  // 两组角弧：绿色 = ∠ABB₁ 与 ∠A₁B₁B（张得开的那两个）；
  //           橙色 = ∠A₁BB₁ 与 ∠AB₁B（靠 BB₁ 的那两个），半径更大，套在外面
  var aarcBG  = AN.arc('aarcBG',  B,  A,  B1, 52, COL.GREEN);
  var aarcB1G = AN.arc('aarcB1G', B1, A1, B,  52, COL.GREEN);
  var aarcBO  = AN.arc('aarcBO',  B,  A1, B1, 76, COL.ORANGE);
  var aarcB1O = AN.arc('aarcB1O', B1, A,  B,  76, COL.ORANGE);

  // 三组等长短杠（同色 = 等长）
  var atkAB   = AN.tick('atkAB',   A,  B,  COL.GREEN,  9, 0);
  var atkA1B1 = AN.tick('atkA1B1', A1, B1, COL.GREEN,  9, 0);
  var atkAB1  = AN.tick('atkAB1',  A,  B1, COL.PURPLE, 9, 0);
  var atkA1B  = AN.tick('atkA1B',  A1, B,  COL.PURPLE, 9, 0);
  var atkBB1  = AN.tick('atkBB1',  B,  B1, COL.TEAL,   9, 60);   // 沿 BB₁ 挪开，避开竖轴

  // 第 ③ 问：竖轴与两条横线相交处的直角
  var araBB1 = AN.right('araBB1', [450, 424], sub(B1, [450, 424]), sub(O, [450, 424]), 13, COL.RED);
  var araAA1 = AN.right('araAA1', [450, 151], sub(A1, [450, 151]), sub(Pp, [450, 151]), 13, COL.RED);

  // 三块底色（每块只在对应那一步出现，下一步就撤掉，避免叠成一片脏灰）
  var afillT = { id: 'afillT', k: 'poly', pts: [A, A1, B1, B],          fill: AN.wash('37,99,235', 0.09), stroke: 'none' };
  var afillP = { id: 'afillP', k: 'poly', pts: [Pp, B, B1],             fill: AN.wash('194,65,12', 0.10), stroke: 'none' };
  var afillO = { id: 'afillO', k: 'poly', pts: [O, B, B1],              fill: AN.wash('15,157,88', 0.10), stroke: 'none' };

  var acap = AN.txt('acap', [44, 40], '只有一把无刻度直尺：不量长度、不画圆',
    { size: FS.NOTE, anchor: 'start' });

  // 提层清单：细线在前、粗线在后（细线压不到粗线正中间，才不会露深色芯）
  var LIFT1 = ['aAP', 'aA1P', 'aAB1', 'aA1B', 'aAA1', 'aBB1', 'aAB', 'aA1B1', 'aOPup', 'aOPdn', 'aOP',
               'aarcBG', 'aarcB1G', 'aarcBO', 'aarcB1O',
               'atkAB', 'atkA1B1', 'atkAB1', 'atkA1B', 'atkBB1',
               'araBB1', 'araAA1', 'adotO', 'adotP',
               'acap', 'led0', 'led1',
               'anA', 'anA1', 'anB', 'anB1', 'anO', 'anP'];

  // 换图时要把整张图1 撕干净（含临时底色与直角记号），漏一个就会和 图2 叠在一起
  var ALL1 = LIFT1.concat(['afillT', 'afillP', 'afillO']);

  /* ============================================================
     图2 的图元
     ============================================================ */

  // 两个三角形（共用顶点 A）
  var bAB   = { id: 'bAB',   k: 'line', a: A2,   b: B2,   stroke: COL.EDGE, sw: 2.6 };
  var bAC   = { id: 'bAC',   k: 'line', a: A2,   b: C2,   stroke: COL.EDGE, sw: 2.6 };
  var bBC   = { id: 'bBC',   k: 'line', a: B2,   b: C2,   stroke: COL.EDGE, sw: 2.6 };
  var bAB1  = { id: 'bAB1',  k: 'line', a: A2,   b: B12,  stroke: COL.EDGE, sw: 2.6 };
  var bAC1  = { id: 'bAC1',  k: 'line', a: A2,   b: C12,  stroke: COL.EDGE, sw: 2.6 };
  var bB1C1 = { id: 'bB1C1', k: 'line', a: B12,  b: C12,  stroke: COL.EDGE, sw: 2.6 };

  // 画法：交叉连线、延长线、OP
  var bBC1 = { id: 'bBC1', k: 'line', a: B2,  b: C12, stroke: COL.TEAL, sw: 2.2 };
  var bB1C = { id: 'bB1C', k: 'line', a: B12, b: C2,  stroke: COL.TEAL, sw: 2.2 };
  var bCP  = { id: 'bCP',  k: 'line', a: C2,  b: P2p, stroke: COL.GREY, sw: 2, dash: [7, 5] };
  var bC1P = { id: 'bC1P', k: 'line', a: C12, b: P2p, stroke: COL.GREY, sw: 2, dash: [7, 5] };

  var bOP   = { id: 'bOP',   k: 'line', a: P2p, b: O2,     stroke: COL.RED, sw: 3.4 };
  var bOPup = { id: 'bOPup', k: 'line', a: AX2_T, b: O2,   stroke: COL.RED, sw: 2.2, dash: [6, 6] };
  var bOPdn = { id: 'bOPdn', k: 'line', a: O2, b: AX2_B,   stroke: COL.RED, sw: 2.2, dash: [6, 6] };

  var bdotO = { id: 'bdotO', k: 'circ', c: O2,  r: 4.5, fill: COL.RED, stroke: 'none' };
  var bdotP = { id: 'bdotP', k: 'circ', c: P2p, r: 4.5, fill: COL.RED, stroke: 'none' };
  var bnA  = AN.txt('bnA',  [466, 42],  'A',  { size: FS.V, weight: 700, anchor: 'start' });
  var bnB  = AN.txt('bnB',  [212, 192], 'B',  { size: FS.V, weight: 700, anchor: 'end' });
  var bnB1 = AN.txt('bnB1', [688, 192], 'B₁', { size: FS.V, weight: 700, anchor: 'start' });
  var bnC  = AN.txt('bnC',  [360, 372], 'C',  { size: FS.V, weight: 700, anchor: 'end' });
  var bnC1 = AN.txt('bnC1', [540, 372], 'C₁', { size: FS.V, weight: 700, anchor: 'start' });
  var bnO  = AN.txt('bnO',  [438, 262], 'O',  { size: FS.V, weight: 700, anchor: 'end' });
  var bnP  = AN.txt('bnP',  [466, 452], 'P',  { size: FS.V, weight: 700, anchor: 'start' });

  // 证明里才用到的两条（画法本身不画它们）
  var bBB1 = { id: 'bBB1', k: 'line', a: B2,  b: B12, stroke: COL.BLUE, sw: 2.2 };
  var bCC1 = { id: 'bCC1', k: 'line', a: C2,  b: C12, stroke: COL.BLUE, sw: 2.2 };

  var btkBC  = AN.tick('btkBC',  B2,  C2,  COL.GREEN,  9, 0);
  var btkB1C1 = AN.tick('btkB1C1', B12, C12, COL.GREEN, 9, 0);
  var btkBC1 = AN.tick('btkBC1', B2,  C12, COL.PURPLE, 9, 0);
  var btkB1C = AN.tick('btkB1C', B12, C2,  COL.PURPLE, 9, 0);
  var btkBB1 = AN.tick('btkBB1', B2,  B12, COL.TEAL,   9, 60);

  var barcBG  = AN.arc('barcBG',  B2,  C2,  B12, 56, COL.GREEN);   // ∠CBB₁
  var barcB1G = AN.arc('barcB1G', B12, C12, B2,  56, COL.GREEN);   // ∠C₁B₁B
  var barcBO  = AN.arc('barcBO',  B2,  C12, B12, 80, COL.ORANGE);  // ∠C₁BB₁
  var barcB1O = AN.arc('barcB1O', B12, C2,  B2,  80, COL.ORANGE);  // ∠CB₁B

  var brBB1 = AN.right('brBB1', [450, 186], sub(B12, [450, 186]), [0, -1], 13, COL.RED);
  var brCC1 = AN.right('brCC1', [450, 354], sub(C12, [450, 354]), [0, -1], 13, COL.RED);

  var bfillQ = { id: 'bfillQ', k: 'poly', pts: [B2, B12, C12, C2], fill: AN.wash('37,99,235', 0.09), stroke: 'none' };

  var bcap = AN.txt('bcap', [44, 40], '图2：两个三角形共用顶点 A',
    { size: FS.NOTE, anchor: 'start' });

  var LIFT2 = ['bBC1', 'bB1C', 'bBB1', 'bCC1', 'bAB', 'bAC', 'bBC', 'bAB1', 'bAC1', 'bB1C1',
               'bOPup', 'bOPdn', 'bOP',
               'barcBG', 'barcB1G', 'barcBO', 'barcB1O',
               'btkBC', 'btkB1C1', 'btkBC1', 'btkB1C', 'btkBB1',
               'brBB1', 'brCC1', 'bdotO', 'bdotP',
               'bcap', 'led0', 'led1',
               'bnA', 'bnB', 'bnB1', 'bnC', 'bnC1', 'bnO', 'bnP'];

  /* ============================================================
     步骤（22 步：图1 走 16 步，图2 走 6 步）
     ============================================================ */
  var steps = [

    /* ---------- 第 1 步：认图 ---------- */
    {
      say: '图上是一片左右对称的图形。左边那条斜线，上端那个点记作 A，下端那个点记作 B，两个点连起来就是线段 AB；右边那条是它在镜子里的样子，上端记作 A₁，下端记作 B₁。题目说，这两条线段关于某一条直线互相对称 —— 那条线就是我们要找的对称轴，可图上根本没画出来。',
      cite: '题意：线段 AB 与 A₁B₁ 关于某一条直线对称',
      delNow: LED,
      add: [aAB, aA1B1, anA, anA1, anB, anB1, acap].concat(led(['AB 与 A₁B₁ 成轴对称'])),
      eq: 'A ↔ A₁，B ↔ B₁；AB 与 A₁B₁ 成轴对称'
    },

    /* ---------- 第 2 步：问题(1) 垂直 ---------- */
    {
      say: '第一问问：一对对应点的连线，跟对称轴是什么关系。答案是垂直。道理不难：翻折过去的时候，一个点到对称轴的距离一点不变，所以它和它的对应点一定分居对称轴两边、离轴一样远；把这两个点连起来，这条连线就正正地撞在轴上，不偏不斜。而且轴正好从这条连线的中点穿过，把它劈成两半。图上 A 和 A₁ 之间那条淡的横线、B 和 B₁ 之间那条，就都是这样的对应点连线。',
      cite: '轴对称的性质：对称轴垂直平分每一对对应点的连线',
      delNow: LED,
      add: [aAA1, aBB1].concat(led(['对应点连线 ⊥ 对称轴', '且被对称轴平分'])),
      eq: 'AA₁ ⊥ 对称轴，BB₁ ⊥ 对称轴，且轴过两段中点'
    },

    /* ---------- 第 3 步：作图① 交叉连线得 O ---------- */
    {
      say: '第二问，先照小明的画法作图。第一步叫交叉连线：把左上那个 A 和右下那个 B₁ 连起来，再把右上那个 A₁ 和左下那个 B 连起来。这两条线一交叉，交点落在图形正中间偏上的位置，这个点记作 O。',
      cite: '小明的画法第一步：连接 AB₁ 与 A₁B，两线段交于点 O',
      delNow: LED,
      add: [aAB1, aA1B, adotO, anO].concat(led(['第一步：连 AB₁、A₁B，交于 O'])),
      eq: 'O = AB₁ ∩ A₁B'
    },

    /* ---------- 第 4 步：作图② 延长得 P ---------- */
    {
      say: '第二步叫延长线。刚才那条从 B 出发经过 A 的斜线，别停在 A，越过 A 继续往外延长；右边那条从 B₁ 出发经过 A₁ 的，也越过 A₁ 往外延长。两条延长线在整个图形最高的地方碰头，碰头这个点记作 P —— 它落在 A、A₁ 的上方。图上这两小段虚线，就是延长出来的部分。',
      cite: '小明的画法第二步：延长 BA 与 B₁A₁，两直线交于点 P',
      delNow: LED,
      add: [aAP, aA1P, adotP, anP].concat(led(['第二步：延长 BA、B₁A₁，交于 P'])),
      eq: 'P = 直线 BA ∩ 直线 B₁A₁（A 在 B 与 P 之间）'
    },

    /* ---------- 第 5 步：作图③ 连 OP ---------- */
    {
      say: '第三步，拿直尺把 O 和 P 连起来。这条竖着的线，小明说它就是那条对称轴，两端再往外延一延，让它整条贯穿全图。作图还没完：再把 A 和 A₁ 连上、把 B 和 B₁ 连上 —— 就是刚才那两条淡横线，现在把它们画实。作图到这里结束。注意，到这儿我们只是把图画完了，凭什么说它就是对称轴，还得证。',
      cite: '小明的画法第三步：连接 OP、AA₁、BB₁',
      delNow: LED,
      add: [aOP, aOPup, aOPdn].concat(led(['第三步：连 OP（两端延长）', '再连 AA₁、BB₁，作图完成'])),
      upd: [
        { id: 'aAA1', stroke: COL.BLUE, sw: 2.4, dash: null },
        { id: 'aBB1', stroke: COL.BLUE, sw: 2.4, dash: null }
      ],
      front: LIFT1,
      eq: '画出直线 OP、AA₁、BB₁'
    },

    /* ---------- 第 6 步：要证哪两个角 ---------- */
    {
      say: '先证 ②。B 处那个角，是 BA 和 BB₁ 夹出来的；要证它等于 B₁ 处那个角，也就是 B₁A₁ 和 B₁B 夹出来的。图上这两道绿色的小弧，圈的就是它们。这里容易看错：B 处其实挤着两个角，我们盯的是张得比较开的那个，靠着 BB₁ 那道绿弧的那一个。',
      cite: '目标：证明 ∠ABB₁ = ∠A₁B₁B',
      delNow: LED,
      add: [aarcBG, aarcB1G].concat(led(['要证 ∠ABB₁ = ∠A₁B₁B'])),
      front: LIFT1,
      eq: '要证 ∠ABB₁ = ∠A₁B₁B'
    },

    /* ---------- 第 7 步：AB = A₁B₁ ---------- */
    {
      say: '找能对上的边。头一条：A 和 A₁ 是互为镜像的一对，B 和 B₁ 也是，所以把线段 AB 整个翻过去，它正好压在 A₁B₁ 上，两条一样长。图上在两边中点各画了一道绿色的短杠，同一种颜色就表示等长。',
      cite: '轴对称的性质：对应线段相等',
      delNow: LED,
      add: [atkAB, atkA1B1].concat(led(['AB = A₁B₁（对应线段）'])),
      front: LIFT1,
      eq: 'AB = A₁B₁'
    },

    /* ---------- 第 8 步：AB₁ = A₁B ---------- */
    {
      say: '第二条是交叉的那一对：线段 AB₁ 翻过去正好落在 A₁B 上，所以这两条也相等。中点各画一道紫色短杠，跟刚才那组绿的分开。',
      cite: '轴对称的性质：对应线段相等（AB₁ 与 A₁B 是另一对对应线段）',
      delNow: LED,
      add: [atkAB1, atkA1B].concat(led(['AB₁ = A₁B（对应线段）'])),
      front: LIFT1,
      eq: 'AB₁ = A₁B'
    },

    /* ---------- 第 9 步：BB₁ 公共边 ---------- */
    {
      say: '第三条最省事：B 到 B₁ 这一条，是左右两个三角形共用的一条边，自己等于自己，不用证。这道短杠我画在偏右的地方，避开中间那条竖线。',
      cite: '公共边',
      delNow: LED,
      add: [atkBB1].concat(led(['BB₁ = B₁B（公共边）'])),
      front: LIFT1,
      eq: 'BB₁ = B₁B（同一条线段）'
    },

    /* ---------- 第 10 步：SSS 全等 ---------- */
    {
      say: '把三条摆到一起。左边这个三角形 ABB₁，三条边是 AB、BB₁、B₁A；右边这个三角形 A₁B₁B，三条边是 A₁B₁、B₁B、BA₁。一条对一条全相等，三边分别相等的两个三角形就全等。图上把这两副三角形占的那一整块淡淡铺了层底色，就是提醒你只看这一块里的两个。',
      cite: '全等判定 SSS：三边分别相等的两个三角形全等',
      delNow: LED,
      add: [afillT].concat(led(['△ABB₁ ≌ △A₁B₁B（SSS）'])),
      front: LIFT1,
      eq: '△ABB₁ ≌ △A₁B₁B（SSS）'
    },

    /* ---------- 第 11 步：对应角相等 ---------- */
    {
      say: '全等三角形里，对应的角相等。角 ABB₁ 和角 A₁B₁B 正好是一组对应角，所以它们相等 —— 图上那两道小弧一起被我改成红色，就是「这两个对上了」。② 要证的东西，成了。',
      cite: '全等三角形的对应角相等',
      delNow: LED,
      add: led(['∠ABB₁ = ∠A₁B₁B ✓']),
      upd: [
        { id: 'aarcBG', stroke: COL.RED },
        { id: 'aarcB1G', stroke: COL.RED }
      ],
      front: LIFT1,
      eq: '∠ABB₁ = ∠A₁B₁B ✓'
    },

    /* ---------- 第 12 步：P 那边是同一个角 ---------- */
    {
      say: '再看 P。P 是怎么来的？是从 B 出发、经过 A 一路延长出去碰上的，所以从 B 望过去，射线 BA 和射线 BP 是同一条，角 PBB₁ 和角 ABB₁ 说的就是同一个角。右边一模一样，角 PB₁B 就是角 A₁B₁B。刚才证了那两个相等，这两个自然也相等。图上我把 B 到 A 到 P 这一整条染成了橙色，就是提醒你它们是同一条线。',
      cite: '同角（射线 BP 与射线 BA 是同一条射线）+ 等量代换',
      delNow: LED.concat(['afillT']),
      add: led(['射线 BP = 射线 BA ⟹ ∠PBB₁ = ∠ABB₁', '⟹ ∠PBB₁ = ∠PB₁B']),
      upd: [
        { id: 'aAB',   stroke: COL.ORANGE, sw: 3 },
        { id: 'aAP',   stroke: COL.ORANGE, sw: 2.4 },
        { id: 'aA1B1', stroke: COL.ORANGE, sw: 3 },
        { id: 'aA1P',  stroke: COL.ORANGE, sw: 2.4 }
      ],
      front: LIFT1,
      eq: '∠PBB₁ = ∠PB₁B'
    },

    /* ---------- 第 13 步：PB = PB₁，P 落在垂直平分线上 ---------- */
    {
      say: '角相等能换来什么？在三角形 PBB₁ 里，这两个相等的角是底角；一个三角形里两个角相等，它们对着的边就相等，所以 PB 等于 PB₁。一个点到一条线段两端距离相等，这个点就一定站在这条线段的垂直平分线上。所以 P 在 BB₁ 的垂直平分线上 —— 图上这块浅橙色，就是 P 和 B、B₁ 围出来的那个三角形。',
      cite: '等角对等边 + 线段垂直平分线的判定：到线段两端距离相等的点在垂直平分线上',
      delNow: LED,
      add: [afillP].concat(led(['∠PBB₁ = ∠PB₁B ⟹ PB = PB₁', '⟹ P ∈ BB₁ 的垂直平分线'])),
      front: LIFT1,
      eq: 'PB = PB₁ ⟹ P ∈ BB₁ 的垂直平分线'
    },

    /* ---------- 第 14 步：O 那边也换成同一组角 ---------- */
    {
      say: '再看 O。O 是那两条交叉线的交点，所以它既在 B 往 A₁ 的那条线上，也在 A₁ 往 B 的那条线上。于是角 OBB₁ 就是角 A₁BB₁，角 OB₁B 就是角 AB₁B。这两个角凭什么相等？刚才那对全等三角形还藏着另一组对应角，就是它们。图上这两道橙色的弧圈的就是这一组，它们的半径比绿弧大，套在外面。',
      cite: '同角 + 全等三角形的另一组对应角相等（∠A₁BB₁ = ∠AB₁B）',
      delNow: LED.concat(['afillP']),
      add: [aarcBO, aarcB1O].concat(led(['∠OBB₁ = ∠A₁BB₁ = ∠AB₁B = ∠OB₁B'])),
      front: LIFT1,
      eq: '∠OBB₁ = ∠AB₁B = ∠OB₁B'
    },

    /* ---------- 第 15 步：OB = OB₁ ---------- */
    {
      say: '于是三角形 OBB₁ 也是等腰的，OB 等于 OB₁，O 也站在 BB₁ 的垂直平分线上。这块浅绿色就是三角形 OBB₁。',
      cite: '等量代换 + 等角对等边 + 线段垂直平分线的判定',
      delNow: LED,
      add: [afillO].concat(led(['∠OBB₁ = ∠OB₁B ⟹ OB = OB₁', '⟹ O ∈ BB₁ 的垂直平分线'])),
      front: LIFT1,
      eq: 'OB = OB₁ ⟹ O ∈ BB₁ 的垂直平分线'
    },

    /* ---------- 第 16 步：两点定线 → OP 就是对称轴 ---------- */
    {
      say: '现在手里有两个点：O 和 P。它们是不同的两个点，却都站在同一条垂直平分线上，两个点就能定死一条直线，所以竖着这条 OP 就是 BB₁ 的垂直平分线。而一条线段的垂直平分线只有一条 —— 题目一开始就说了，这两条线段关于某条直线对称，那条对称轴必须垂直平分 BB₁，那它只能是 OP。既然是对称轴，它当然也垂直平分 A 和 A₁ 的那条连线。图上两个红色的小方角，标的就是它和两条横线相交处的直角；这条轴正好从两条横线的正中间穿过。第二问，全齐了。',
      cite: '两点确定一条直线 + 线段垂直平分线的唯一性 + 轴对称的性质',
      delNow: LED.concat(['afillO']),
      add: [araBB1, araAA1].concat(led(['O、P ∈ BB₁ 的垂直平分线 ⟹ OP 即该线', '⟹ OP 是 AB 与 A₁B₁ 的对称轴'])),
      front: LIFT1,
      eq: 'OP ⊥ BB₁、OP ⊥ AA₁ 且过两段中点 ⟹ OP 是对称轴',
      hold: 4200
    },

    /* ---------- 第 17 步：换图 2，先讲清为什么 A 用不上 ---------- */
    {
      say: '第三问换了一张图。左边一个三角形，三个顶点是 A、B、C；右边一个，顶点是 A、B₁、C₁。注意顶上那个点：两个三角形共用顶点 A —— 也就是说 A 正好落在那条对称轴上，翻过去还是它自己，A 和 A₁ 其实是同一个点。这一组对应点重合在一起，定不了任何东西，用不上。所以得换另外两组：B 和 B₁、C 和 C₁。',
      cite: '题意 + 图2 观察：顶点 A 在对称轴上，A 与 A₁ 重合',
      delNow: ALL1,
      add: [bAB, bAC, bBC, bAB1, bAC1, bB1C1, bnA, bnB, bnB1, bnC, bnC1, bcap]
        .concat(led(['A = A₁ ∈ 对称轴，这一组用不上', '改用 B↔B₁、C↔C₁'])),
      eq: 'A = A₁ ∈ 对称轴 ⟹ 用 B↔B₁、C↔C₁ 两组对应点'
    },

    /* ---------- 第 18 步：画法① 交叉连线得 O ---------- */
    {
      say: '画法跟刚才一字不差。第一步还是交叉连线：把左边上头的 B 和右下头的 C₁ 连起来，再把右上头的 B₁ 和中间的 C 连起来。两条线交在图形中间，还叫它 O。',
      cite: '问题3 画法第一步（交叉连线）',
      delNow: LED,
      add: [bBC1, bB1C, bdotO, bnO].concat(led(['第一步：连 BC₁、B₁C，交于 O'])),
      front: LIFT2,
      eq: 'O = BC₁ ∩ B₁C'
    },

    /* ---------- 第 19 步：画法② 延长得 P ---------- */
    {
      say: '第二步还是延长线：从 B 出发经过 C 的那条线，越过 C 继续往下延长；右边那条越过 C₁ 也往下延长。因为 C、C₁ 这一组比 B、B₁ 那一组窄，两条线越往下越收拢，最后在图形下方碰头，交点记作 P。',
      cite: '问题3 画法第二步（延长线）',
      delNow: LED,
      add: [bCP, bC1P, bdotP, bnP].concat(led(['第二步：延长 BC、B₁C₁，交于 P'])),
      front: LIFT2,
      eq: 'P = 直线 BC ∩ 直线 B₁C₁（C 在 B 与 P 之间）'
    },

    /* ---------- 第 20 步：画法③ 连 OP ---------- */
    {
      say: '第三步，直尺连 OP。这条竖线就是这两个三角形的对称轴。全程真的只用了一把直尺：没量过长度，没画过圆。下面把为什么证一遍。',
      cite: '问题3 画法第三步：连接 OP，直线 OP 即为所求对称轴',
      delNow: LED,
      add: [bOP, bOPup, bOPdn].concat(led(['第三步：连 OP，即为对称轴'])),
      front: LIFT2,
      eq: '直线 OP 即 △ABC 与 △AB₁C₁ 的对称轴'
    },

    /* ---------- 第 21 步：证明（全等 → 角相等 → 等腰 → P 在垂直平分线上） ---------- */
    {
      say: '还是老套路，先找三条能对上的边。BC 和 B₁C₁ 是一对对应线段，相等；BC₁ 和 B₁C 是另一对对应线段，也相等；B 到 B₁ 这条是公共边，自己等于自己。三条边一条对一条，所以三角形 CBB₁ 和三角形 C₁B₁B 全等。全等给出角 CBB₁ 等于角 C₁B₁B；而 P 落在 BC 和 B₁C₁ 的延长线上，这两个角换成以 P 为顶点来说，还是同一个角，所以角 PBB₁ 等于角 PB₁B。角相等就是等腰，PB 等于 PB₁，P 就站在 BB₁ 的垂直平分线上。',
      cite: '轴对称的性质（对应线段相等）+ 公共边 + SSS + 同角 + 等角对等边 + 垂直平分线的判定',
      delNow: LED,
      add: [bBB1, btkBC, btkB1C1, btkBC1, btkB1C, btkBB1, barcBG, barcB1G, bfillQ]
        .concat(led(['△CBB₁ ≌ △C₁B₁B（SSS）⟹ ∠PBB₁ = ∠PB₁B', '⟹ PB = PB₁ ⟹ P ∈ BB₁ 的垂直平分线'])),
      front: LIFT2,
      eq: '△CBB₁ ≌ △C₁B₁B ⟹ PB = PB₁ ⟹ P ∈ BB₁ 的垂直平分线'
    },

    /* ---------- 第 22 步：O 同理 → 结论 ---------- */
    {
      say: 'O 同样处理：O 既在 B 往 C₁ 的线上，也在 B₁ 往 C 的线上，配上全等给出的另一组对应角，就得到角 OBB₁ 等于角 OB₁B，于是 OB 等于 OB₁，O 也在这条垂直平分线上。两个不同的点定一条直线，所以 OP 就是 BB₁ 的垂直平分线；这条垂直平分线只有一条，它就是两个三角形的那条对称轴。既然是对称轴，它当然也垂直平分 C 和 C₁ 的连线，并且穿过顶点 A。三小问，证完。',
      cite: '全等对应角 + 等量代换 + 等角对等边 + 两点确定一条直线 + 唯一性 + 轴对称的性质',
      delNow: LED,
      add: [bCC1, barcBO, barcB1O, brBB1, brCC1]
        .concat(led(['OB = OB₁ ⟹ O、P 都在 BB₁ 的垂直平分线上', '⟹ OP 是对称轴 ✓'])),
      front: LIFT2,
      eq: 'OP ⊥ BB₁、OP ⊥ CC₁，过两段中点且过 A ⟹ OP 是对称轴 ✓',
      hold: 5000
    }
  ];

  /* ---------- 存档 ---------- */
  window.MATHLAB_LESSONS = window.MATHLAB_LESSONS || [];
  window.MATHLAB_LESSONS.push({
    id: 'ws-a1-ruler',
    title: '只有一把无刻度直尺，照样作出对称轴（讲义 A1）',
    grade: '初二',
    topic: '几何 · 轴对称与作图',
    tags: ['几何', '轴对称', '对称轴', '垂直平分线', 'SSS 全等', '直尺作图', '等腰三角形'],
    question: '小明在画对称轴的过程中忘记带圆规，只带了一把无刻度的直尺，他选择仅使用直尺工具完成以下问题探究：(1) 问题1：轴对称图形对应点连线互相 ____（填「平行」或「垂直」）；(2) 问题2：如图1，画出线段 AB 与 A₁B₁ 的对称轴。小明采用以下画法：连接 AB₁ 与 A₁B，两线段交于点 O，延长 BA 与 B₁A₁ 交于点 P，连接 OP、AA₁、BB₁。① 根据小明的画法完成作图；② 证明：∠ABB₁ = ∠A₁B₁B；③ 由② 结论证明：OP 是 AA₁ 与 BB₁ 的垂直平分线，也就是对称轴；(3) 问题3：如图2，设计一种方法，只用直尺作出 △ABC 与 △AB₁C₁ 的对称轴，用文字描述你的画法并证明这样画出的直线即为对称轴。',
    sourceImage: 'img/ws-a1-q.png',
    thumbStep: 4,
    methods: [
      {
        name: '直尺作对称轴 · 作图 + 两处全等，三问连做',
        tier: 'proof',
        sub: '严格证明 · 22 步，含图2 的画法与证明',
        steps: steps
      }
    ]
  });
})();
