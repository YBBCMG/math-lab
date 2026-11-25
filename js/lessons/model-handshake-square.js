/* ============================================================
   手拉手 · 双正方形（几何模型课，不是某张卷子的题）
   ------------------------------------------------------------
   模型：正方形 ABCD 与正方形 AEFG 共用顶点 A，
         各按 A→B→C→D、A→E→F→G 逆时针排列，
         AB 与 AE 之间的夹角任意。连 BE、DG。
         结论：BE = DG（相等）且 BE ⊥ DG（垂直）。

   为什么成立（两条互补的路，本课都走一遍）：
     ① 全等这条路只给「相等」：
          AB = AD、AE = AG（各自正方形的邻边），
          再看夹角。图上 A 处四条射线按 AB、AD、AE、AG 的顺序排，
          相邻三段依次是 ∠BAD = 90°、∠DAE = 公共的那条缝、∠EAG = 90°。
          ∠BAE = ∠BAD + ∠DAE = 90° + ∠DAE，
          ∠DAG = ∠DAE + ∠EAG = ∠DAE + 90°，
          加的是同一个角 ⟹ ∠BAE = ∠DAG ⟹ △ABE ≌ △ADG（SAS）⟹ BE = DG。
          注意：这条路只证明「相等」，垂直它给不出来，别指望。
     ② 旋转这条路一次拿两个结论，也是本课真正要种下的想法：
          AB = AD 且 ∠BAD = 90° ⟹ 绕 A 逆时针转 90°，B 落到 D；
          AE = AG 且 ∠EAG = 90° ⟹ 同一个旋转把 E 送到 G。
          于是同一个旋转把整条 BE 送到 DG
          ⟹ BE = DG（保距）且方向正好差 90°（旋转角）⟹ BE ⊥ DG。
      关键：两条路都没有用到 AB 与 AE 之间的具体度数，
            所以结论对任意张角都成立 —— 这才是「模型」两个字的份量。

   摆位（A 为公共顶点，画布 900×520）：
      A = (455, 344)，正方形 ABCD 边长 270 且 AB 水平向右（正着放），
      正方形 AEFG 边长 205，AE 方向 120°（斜着放）。
      于是 A 处四条射线方位角为 AB 0°、AD 90°、AE 120°、AG 210°，
      相邻三段恰好是 90° + 30° + 90° —— 图上那「两个方角夹一条缝」。
      B (725,344)  C (725,74)  D (455,74)
      E (352.5,166.47)  F (174.97,268.97)  G (277.47,446.5)
      BE ∩ DG = P (400.12,189.16)，t = 0.87、u = 0.31，交点落在两条线段内部。
      图形包围盒 x[174.97,725] y[74,446.5]，字母外推到 x[149,758] y[29,492]。

   标注纪律（照 ANNO 规范）：
      · 顶点字母坐标由「离所有线段最远」的环形搜索算出后人工复核，不手填拍脑袋
      · 等长：AB/AD 一对绿 tick、AE/AG 一对橙 tick，都放在「距 A 80px」的同一比例位置
        （AE 的 tick 若放中点会离 DG 只有 16px，AG 的放中点会正好压在 DG 上 —— 都是实测出来的）
      · 两个直角用 AN.right 的「方向向量」签名，分别画在 A 的右上、A 的左下，互不重叠
      · 两个 120° 大角用「同色弧 + 各一道等号小横线」表达相等，半径错开 86 / 124
      · 垂直：P 处的方角开口朝上，正好落在两个正方形之间那条空缝里
   ============================================================ */
(function () {
  var AN = window.ANNO, ML = window.ML;
  var COL = AN.COL, FS = AN.FS;
  var sub = AN.sub, add = AN.add, mul = AN.mul, unit = AN.unit;

  /* ============================================================
     一、摆位
     ============================================================ */
  var A = [455, 344];
  var S1 = 270;          // 正方形 ABCD 边长
  var S2 = 205;          // 正方形 AEFG 边长
  var TH = 120;          // AB 与 AE 的夹角（图上取 120°，证明里从没用到这个数）

  var B = ML.pt(A[0], A[1], S1, 0);            // 正右
  var D = ML.pt(A[0], A[1], S1, 90);           // 正上（AB 逆时针转 90°）
  var C = add(B, sub(D, A));                   // 平移闭合
  var E = ML.pt(A[0], A[1], S2, TH);           // 左上
  var G = ML.pt(A[0], A[1], S2, TH + 90);      // 左下（AE 逆时针转 90°）
  var F = add(E, sub(G, A));

  /* BE 与 DG 的交点：程序解，不手填 */
  var P = (function () {
    var u = sub(E, B), v = sub(G, D), w = sub(D, B);
    var den = u[0] * v[1] - u[1] * v[0];
    var t = (w[0] * v[1] - w[1] * v[0]) / den;
    return [B[0] + t * u[0], B[1] + t * u[1]];
  })();

  /* ============================================================
     二、造元素的小工具
     ============================================================ */
  function seg(id, X, Y, color, sw, dash) {
    return { id: id, k: 'line', a: X, b: Y, stroke: color || COL.EDGE, sw: sw || 2.4, dash: dash };
  }
  // 半透明色块：填充用 rgba、描边关掉。绝不用 op（op 在 <g> 上会连描边一起削淡）
  function face(id, pts, rgb, a) {
    return { id: id, k: 'poly', pts: pts, fill: AN.wash(rgb || '15,157,88', a == null ? 0.13 : a), stroke: 'none' };
  }
  // 等长记号：在「从 V 出发沿 V→W 方向走 s」的位置画一道垂直于该边的短横线
  function tickAt(id, V, W, s, color) {
    var u = unit(sub(W, V));
    var m = add(V, mul(u, s));
    var w = [-u[1], u[0]];
    return { id: id, k: 'line', a: add(m, mul(w, -9)), b: add(m, mul(w, 9)), stroke: color, sw: 3.2 };
  }
  // 绕 A 的弧（可给虚线）：用于「转九十度」的扫过轨迹
  function sweep(id, r, from, to, color, sw, dash) {
    return { id: id, k: 'arc', c: A, r: r, from: from, to: to, stroke: color, sw: sw || 2, dash: dash };
  }
  // 弧上的「等号」小横线：沿半径方向横跨弧线（教科书记号：记号一样 = 角一样大）
  function arcTick(id, r, deg, color) {
    return {
      id: id, k: 'line',
      a: ML.pt(A[0], A[1], r - 6, deg),
      b: ML.pt(A[0], A[1], r + 6, deg),
      stroke: color, sw: 2.6
    };
  }

  /* ============================================================
     三、静态元素
     ============================================================ */
  /* ---- 两个正方形 ---- */
  var fS1 = face('fS1', [A, B, C, D], '37,99,235', 0.075);
  var fS2 = face('fS2', [A, E, F, G], '37,99,235', 0.075);

  var sAB = seg('sAB', A, B, COL.EDGE, 2.6);
  var sBC = seg('sBC', B, C, COL.EDGE, 2.6);
  var sCD = seg('sCD', C, D, COL.EDGE, 2.6);
  var sDA = seg('sDA', D, A, COL.EDGE, 2.6);
  var sAE = seg('sAE', A, E, COL.EDGE, 2.6);
  var sEF = seg('sEF', E, F, COL.EDGE, 2.6);
  var sFG = seg('sFG', F, G, COL.EDGE, 2.6);
  var sGA = seg('sGA', G, A, COL.EDGE, 2.6);

  /* ---- 题目连起来的两条线（答案线：同一族，用同一个颜色） ---- */
  var sBE = seg('sBE', B, E, COL.RED, 2.8);
  var sDG = seg('sDG', D, G, COL.RED, 2.8);
  var dotP = { id: 'dotP', k: 'circ', c: P, r: 3.6, fill: COL.RED, stroke: 'none' };

  /* ---- 顶点字母（坐标 = 离所有线段最远的环形搜索 + 人工复核） ---- */
  var nA = AN.txt('nA', [464.3, 378.8], 'A', { size: FS.V, weight: 700 });
  var nB = AN.txt('nB', [757.6, 359.2], 'B', { size: FS.V, weight: 700 });
  var nC = AN.txt('nC', [754.5, 53.4], 'C', { size: FS.V, weight: 700 });
  var nD = AN.txt('nD', [442.7, 40.2], 'D', { size: FS.V, weight: 700 });
  var nE = AN.txt('nE', [367.7, 133.8], 'E', { size: FS.V, weight: 700 });
  var nF = AN.txt('nF', [149.5, 243.5], 'F', { size: FS.V, weight: 700 });
  var nG = AN.txt('nG', [268.2, 481.3], 'G', { size: FS.V, weight: 700 });
  // P 的字母放在交点右上那张小格里：朝 A 那一格会被 r=124 的大角弧扫到（实测 −7.3），
  // 朝左边那一格又正好压在 AE 边上（距 AE 仅 3px），只有这一格两边都空。
  var nP = AN.txt('nP', [432, 177.7], 'P', { size: FS.V, weight: 700 });

  /* ---- 两组等长（各自正方形的邻边） ---- */
  var tkAB = tickAt('tkAB', A, B, 80, COL.GREEN);
  var tkAD = tickAt('tkAD', A, D, 80, COL.GREEN);
  var tkAE = tickAt('tkAE', A, E, 80, COL.ORANGE);
  var tkAG = tickAt('tkAG', A, G, 80, COL.ORANGE);
  /* ---- 待证的一组等长 ---- */
  var tkBE = tickAt('tkBE', B, E, 206, COL.RED);
  var tkDG = tickAt('tkDG', D, G, 210, COL.RED);

  /* ---- A 处两个方角：右上（∠BAD）与左下（∠EAG），分居两侧不重叠 ---- */
  // AN.right 的第 3、4 个参数是「从顶点出发的方向向量」，不是端点坐标
  var rtBAD = AN.right('rtBAD', A, sub(B, A), sub(D, A), 15, COL.EDGE);
  var rtEAG = AN.right('rtEAG', A, sub(E, A), sub(G, A), 15, COL.EDGE);

  /* ---- 角度弧 ---- */
  // 中间那条缝 ∠DAE（30°），最内圈
  var arDAE = AN.angle('arDAE', A, D, E, 44, COL.TEAL);
  // 「公共角」这条注释不能贴在弧旁边：那条缝只有 30°，横向排三个字必然切过 AD 边，
  // 也必然撞上 AE 边上的橙 tick（实测字×线 −9.88）。挪到左下角当图注。
  var capDAE = AN.txt('capDAE', [40, 460], '两个方角夹着同一个公共角', { size: FS.TINY, color: COL.TEAL, anchor: 'start' });
  // 两个大角：半径必须错开（同半径时后画的会把共享段整个盖掉，图就说谎了）
  var arBAE = AN.angle('arBAE', A, B, E, 86, COL.GREEN);
  var arDAG = AN.angle('arDAG', A, D, G, 124, COL.GREEN);
  // 两段弧上的等号（记号一样 = 一样大）
  var tArBAE = arcTick('tArBAE', 86, 60, COL.GREEN);
  var tArDAG = arcTick('tArDAG', 124, 150, COL.GREEN);

  /* ---- 「绕 A 转九十度」的扫过轨迹：B→D、E→G ---- */
  var arB2D = sweep('arB2D', S1, 0, 90, COL.PURPLE, 2, [7, 6]);
  var arE2G = sweep('arE2G', S2, TH, TH + 90, COL.PURPLE, 2, [7, 6]);

  /* ---- 全等用的两块三角形（同一个颜色 = 同类，不用对比色） ---- */
  var fABE = face('fABE', [A, B, E], '15,157,88', 0.13);
  var fADG = face('fADG', [A, D, G], '15,157,88', 0.13);

  /* ---- P 处方角：开口朝上，落在两个正方形之间的空缝里 ---- */
  var rtP = AN.right('rtP', P, sub(D, P), sub(E, P), 15, COL.RED);

  /* ---- 旋转时原位置的灰虚线 ---- */
  var ghBE = seg('ghBE', B, E, COL.GREY, 2.2, [8, 6]);

  /* 每次画完色块都要把线提到最上层；顺序 = 先线后字母（数组末尾最上层） */
  var LIFT = ['sAB', 'sBC', 'sCD', 'sDA', 'sAE', 'sEF', 'sFG', 'sGA', 'sBE', 'sDG',
              'tkAB', 'tkAD', 'tkAE', 'tkAG', 'tkBE', 'tkDG',
              'arDAE', 'arBAE', 'arDAG', 'tArBAE', 'tArDAG', 'arB2D', 'arE2G',
              'rtBAD', 'rtEAG', 'rtP', 'dotP',
              'nA', 'nB', 'nC', 'nD', 'nE', 'nF', 'nG', 'nP', 'capDAE'];

  /* ============================================================
     四、讲稿（16 步）
     ============================================================ */
  var steps = [

    /* 1 题面：先说两个正方形各在哪，再给名字 */
    {
      say: '先看清图上有两个正方形。它们共用中间偏左那同一个顶点，这个公共的顶点记作 A。一个正着放：从 A 向右走到 B，向上到 C，向左到 D，再回到 A。另一个斜着放：从 A 往左上走到 E，再往左到 F，再往下到 G，回到 A。两个都是绕一圈逆时针走，A 是它们唯一共用的点。',
      cite: '正方形 ABCD：AB = BC = CD = DA，∠BAD = 90°；正方形 AEFG：AE = EF = FG = GA，∠EAG = 90°；A 为公共顶点',
      add: [fS1, fS2, sAB, sBC, sCD, sDA, sAE, sEF, sFG, sGA,
            nA, nB, nC, nD, nE, nF, nG],
      eq: '正方形 ABCD 与正方形 AEFG，公共顶点 A'
    },

    /* 2 连两条线，交点 P */
    {
      say: '把 B 和 E 连起来 —— 就是那条从右下斜着穿到左上的线，题目把它连起来叫 BE。再把 D 和 G 连起来 —— 那条从上方斜着穿到左下的线，叫 DG。这两条斜线在图上交叉，交点记作 P，标一个小圆点。',
      cite: '连接 BE、DG，设两线交于 P',
      add: [sBE, sDG, dotP, nP],
      front: LIFT,
      eq: '求证：BE = DG，且 BE ⊥ DG'
    },

    /* 3 拆成两个三角形 */
    {
      say: '要证的是两件事：这两条斜线一样长，而且互相垂直。先看长度这一半 —— BE 落在由 A、B、E 三点围成的三角形里，DG 落在由 A、D、G 三点围成的三角形里。把这两块涂成同一种绿色，因为要证的就是它们全等。',
      cite: 'BE ⊂ △ABE，DG ⊂ △ADG；目标 △ABE ≌ △ADG',
      add: [fABE, fADG],
      front: LIFT,
      eq: '目标：△ABE ≌ △ADG ⟹ BE = DG'
    },

    /* 4 第一条边 AB = AD */
    {
      say: '全等要三样东西。第一样是一条边：A 到 B 是正方形的一条边，A 到 D 是同一个正方形的另一条边，正方形的四条边都相等，所以这两条一样长。在这一对边上各画一道绿色小横线，记号一样就表示相等。',
      cite: '正方形四边相等 ⟹ AB = AD',
      add: [tkAB, tkAD],
      front: LIFT,
      eq: 'AB = AD（正方形 ABCD 的邻边）'
    },

    /* 5 第二条边 AE = AG */
    {
      say: '第二样边在斜着那个正方形里：A 到 E、A 到 G 都是它的边，也同样相等。这一对换成橙色的小横线，跟刚才那一对区分开。',
      cite: '正方形四边相等 ⟹ AE = AG',
      add: [tkAE, tkAG],
      front: LIFT,
      eq: 'AE = AG（正方形 AEFG 的邻边）'
    },

    /* 6 两个方角都是九十度 */
    {
      say: '第三样是夹角，这一步先把两个方角摆出来。A 的右上方那一块，是从 AB 转到 AD，正好是大正方形的角；A 的左下方那一块，是从 AE 转到 AG，是斜着那个正方形的角。正方形的角都是方角，所以这两个都等于九十度。两个方角都画在 A 点，一个在右上、一个在左下，不打架。',
      cite: '∠BAD = 90°，∠EAG = 90°',
      add: [rtBAD, rtEAG],
      front: LIFT,
      eq: '∠BAD = 90°，∠EAG = 90°'
    },

    /* 7 中间那条缝 = 公共角 */
    {
      say: '两个方角之间还夹着一条缝，就是 A 这里从 AD 到 AE 那个不大的角。要证的两个三角形所用的夹角，一个是从 AB 数到 AE，一个是从 AD 数到 AG。前一个正好等于「方角加上这条缝」，因为 AD 就落在这个大角的里面；后一个等于「这条缝加上另一个方角」，因为 AE 落在那个大角里面。',
      cite: '∠BAE = ∠BAD + ∠DAE（AD 在 ∠BAE 内部）；∠DAG = ∠DAE + ∠EAG（AE 在 ∠DAG 内部）',
      add: arDAE.concat([capDAE]),
      front: LIFT,
      eq: '∠BAE = 90° + ∠DAE，∠DAG = ∠DAE + 90°'
    },

    /* 8 两个大角相等（弧 + 等号） */
    {
      say: '两条式子摆在一起就看出来了：两个大角都是「九十度加同一条缝」，加的是同一个角，结果当然一样。图上把这两个角各画一段弧，弧上再各画一道小横线，记号相同就表示这两个角一样大。',
      cite: '同加一个角，和相等 ⟹ ∠BAE = ∠DAG',
      add: arBAE.concat(arDAG, [tArBAE, tArDAG]),
      front: LIFT,
      eq: '∠BAE = ∠DAG'
    },

    /* 9 SAS 全等 */
    {
      say: '三样凑齐了：AB 等于 AD，AE 等于 AG，夹角也相等。两边夹一角，这两个三角形全等。把绿色加深一点，看颜色就对上号。',
      cite: 'SAS：两边及其夹角分别相等的两个三角形全等',
      upd: [
        { id: 'fABE', fill: AN.wash('15,157,88', 0.22) },
        { id: 'fADG', fill: AN.wash('15,157,88', 0.22) }
      ],
      front: LIFT,
      eq: '△ABE ≌ △ADG（SAS）'
    },

    /* 10 相等这一半拿下 */
    {
      say: '全等三角形的对应边相等，而 BE 和 DG 正好是对应的一对，所以它们一样长。长度这一半，证完了。两条线上各加一道红色小横线，表示这一对相等。',
      cite: '全等三角形对应边相等 ⟹ BE = DG',
      add: [tkBE, tkDG],
      front: LIFT,
      eq: 'BE = DG ✓'
    },

    /* 11 换眼光：同一个九十度旋转 */
    {
      say: '剩下垂直那一半，全等给不出来，得换个眼光。回头看 A 这里的两个方角：B 绕 A 逆时针转九十度正好落到 D，E 绕 A 逆时针转九十度正好落到 G。关键在「同一个」—— 转的中心都是 A，转的角度都是九十度，转向也一样。图上两条紫色虚线就是这两段九十度的扫过轨迹。',
      cite: 'AB = AD 且 ∠BAD = 90° ⟹ B 绕 A 逆时针转 90° 落在 D；AE = AG 且 ∠EAG = 90° ⟹ 同一个旋转把 E 送到 G',
      add: [arB2D, arE2G],
      front: LIFT,
      eq: '同一个「绕 A 逆时针转 90°」：B → D，E → G'
    },

    /* 12 把 BE 真转一次 */
    {
      say: '那就真转一次。把 B 和 E 之间那条线，整个绕 A 逆时针转九十度。原来的位置留一条灰色虚线当参照，方便对照它从哪儿出发。',
      cite: '旋转把端点映到端点 ⟹ 线段映成线段：BE 的像就是 DG',
      delNow: ['tkBE'],
      upd: [{ id: 'sBE', rot: 90, origin: A }],
      add: [ghBE],
      front: LIFT,
      eq: 'BE 绕 A 逆时针旋转 90°'
    },

    /* 13 转完正压在 DG 上 */
    {
      say: '转过去以后，这条线正好压在 DG 上，一点不差。这就说明 DG 正是 BE 转过九十度得到的像 —— 长度当然一样，因为旋转不改长度。所以相等这件事，旋转这一条路也能顺手拿到。',
      cite: '旋转是保距变换：像与原像等长 ⟹ BE = DG',
      front: LIFT,
      eq: 'BE 的像 = DG ⟹ BE = DG'
    },

    /* 14 转回来 —— 垂直的来历 */
    {
      say: '那垂直呢？一条线要转过整整九十度，才落到另一条线上，说明这两条线的方向正好差九十度。把 BE 转回原位，它们在 P 点张开的就是刚才那个九十度。P 处补一个红色方角。',
      cite: '旋转角为 90° ⟹ 原线段与其像的夹角是 90° ⟹ BE ⊥ DG',
      delNow: ['ghBE'],
      upd: [{ id: 'sBE', rot: 0, origin: A }],
      add: [tkBE, rtP],
      front: LIFT,
      eq: 'BE ⊥ DG ✓'
    },

    /* 15 为什么对任意张角都成立 */
    {
      say: '再回头看一眼整条证明：从头到尾，没有哪一步用到 AB 和 AE 之间那个角的具体度数。只用到一件事 —— 两个方角夹着同一个公共角。那个角张多大、哪条线嵌在哪个角里面，只是把图画成不同的样子，结论一个字都不改。这就是它被叫作「模型」的原因。',
      cite: '证明未使用 ∠BAE 的具体度数 ⟹ 结论对任意张角成立',
      eq: '任意张角下都有 BE = DG 且 BE ⊥ DG'
    },

    /* 16 一句话记法 + 家族定位 */
    {
      say: '一句话记住它：两个正方形共用一个顶点，把「外手」连起来的那两条斜线，一样长，而且互相垂直。正方形只是手拉手这个家族里的一种载体 —— 两个等腰直角三角形、两个正三角形、两个等腰三角形，都能这么拉手，套路完全一样：先找出两组相等的邻边，再认出那个被同一个角包住的夹角，剩下的交给全等和旋转。',
      cite: '模型通式：两个相似且同向的图形共顶点 ⟹ 对应顶点连线等长，夹角等于旋转角',
      eq: '手拉手 · 双正方形：BE = DG，且 BE ⊥ DG',
      hold: 4600
    }
  ];

  /* ============================================================
     五、登记
     ============================================================ */
  window.MATHLAB_LESSONS = window.MATHLAB_LESSONS || [];
  window.MATHLAB_LESSONS.push({
    id: 'model-handshake-square',
    title: '手拉手 · 双正方形：为什么 BE = DG 且 BE ⊥ DG',
    grade: '初二',
    topic: '几何 · 旋转模型',
    tags: ['几何', '全等模型', '手拉手', '旋转', '正方形', '垂直', 'SAS', '模型课'],
    question: '正方形 ABCD 与正方形 AEFG 有公共顶点 A，两者分别按 A→B→C→D、A→E→F→G 逆时针排列，AB 与 AE 的夹角任意。连 BE、DG。求证：BE = DG，且 BE ⊥ DG。',
    thumbStep: 13,
    methods: [
      {
        name: '全等给相等 + 旋转给垂直', tier: 'proof',
        sub: '模型课 · 16 步：先用 SAS 拿下相等，再用「绕 A 转九十度」讲清垂直的来历',
        steps: steps
      }
    ]
  });
})();
