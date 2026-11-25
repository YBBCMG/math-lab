/* ============================================================
   等腰三角形 · 底边中线（三线合一）
   ------------------------------------------------------------
   模型：△ABC 中 AB = AC，D 是 BC 的中点。
   要证：① AD ⊥ BC   ② AD 平分 ∠BAC
   合起来说：底边上的中线、底边上的高、顶角的平分线，三条线重合。

   这门课不是「某张卷子上的一道题」，它讲的是一个模型为什么成立，
   所以讲稿刻意做三件事：
     ① 每步都摆出依据（边边边、全等对应角、邻补角、垂直的定义）
     ② 明确拒绝「拿结论当前前提」的绕圈子写法 —— 顶角平分是待证的，
        所以不能走边角边，只能走边边边
     ③ 末步放一个反例图：三角形不是等腰时，中线并不垂直于底边

   几何：顶角七十度（故意不用六十度，免得被看成等边三角形），
   底边水平。AB = AC 由「顶点落在底边的中垂线上」这个构造保证，
   不是手调出来的 —— 所以换一个顶角，结论照样成立。
   ============================================================ */
(function () {
  var AN = window.ANNO, ML = window.ML;
  var COL = AN.COL, FS = AN.FS;
  var sub = AN.sub, add = AN.add, mul = AN.mul, unit = AN.unit, dist = AN.dist;
  var mid = AN.mid, txt = AN.txt, tick = AN.tick, right = AN.right, arc = AN.arc;

  /* ---------- 主图：等腰三角形 ABC ---------- */
  var B = [270, 400], C = [630, 400];
  var D = mid(B, C);                        // 底边中点 = [450, 400]
  var APEX = 70;                            // 顶角（度）
  var hw = (C[0] - B[0]) / 2;               // 半底 = 180
  var hgt = hw / Math.tan(APEX / 2 * AN.D2R);   // 高 ≈ 257.07
  var A = [D[0], D[1] - hgt];               // 顶点落在底边的中垂线上 ⟹ AB = AC
  var O = [(A[0] + B[0] + C[0]) / 3, (A[1] + B[1] + C[1]) / 3];   // 重心，供字母外推

  /* ---------- 反例小图（末步）：非等腰三角形 + 中线 ---------- */
  var iP = [672, 300], iQ = [862, 300];
  var iR = [700, 150];
  var iM = mid(iP, iQ);                     // 底边中点
  // 中线 iR→iM 的方向 = (67,150)，明显不是竖直的 ⟹ 一眼看出它不垂直底边

  /* ---------- 骨架 ---------- */
  var triFill = { id: 'tri', k: 'poly', pts: [A, B, C], fill: COL.FILL, stroke: 'none' };
  var eAB = { id: 'eAB', k: 'line', a: A, b: B, stroke: COL.EDGE, sw: 2.6 };
  var eAC = { id: 'eAC', k: 'line', a: A, b: C, stroke: COL.EDGE, sw: 2.6 };
  var eBC = { id: 'eBC', k: 'line', a: B, b: C, stroke: COL.EDGE, sw: 2.6 };

  var vA = AN.vname('vA', A, O);
  var vB = AN.vname('vB', B, O);
  var vC = AN.vname('vC', C, O);
  // D 落在底边上，重心外推会把它推到边线里 —— 直接放正下方
  var vD = txt('vD', [D[0], D[1] + 31], 'D', { size: FS.V, weight: 700, halo: false });
  var dotD = { id: 'dotD', k: 'circ', c: D, r: 4.4, fill: COL.EDGE, stroke: 'none' };

  /* ---------- 中线 AD ---------- */
  var ad = { id: 'ad', k: 'line', a: A, b: D, stroke: COL.RED, sw: 3.4 };

  /* ---------- 等长记号（同一种语义：长度相等 ⟹ 一律绿色） ---------- */
  // 短横线取 16px（原来 18px 太长，斜边上会读成一个 ✕，像「划掉」）
  var TK = 8;
  var tkAB = tick('tkAB', A, B, COL.GREEN, TK);
  var tkAC = tick('tkAC', A, C, COL.GREEN, TK);
  var tkBD = tick('tkBD', B, D, COL.GREEN, TK);
  var tkDC = tick('tkDC', D, C, COL.GREEN, TK);

  /* ---------- 两块：△ABD 与 △ACD ---------- */
  // 只用填充、不描边：描边会盖住原三角形的深色边；三根外框线随后被 front 提到色块之上
  var washABD = { id: 'wABD', k: 'poly', pts: [A, B, D], fill: 'rgba(37,99,235,0.13)', stroke: 'none' };
  var washACD = { id: 'wACD', k: 'poly', pts: [A, D, C], fill: 'rgba(37,99,235,0.13)', stroke: 'none' };
  var nABD = txt('nABD', [385, 330], '△ABD', { size: FS.NOTE, color: COL.BLUE, weight: 700 });
  var nACD = txt('nACD', [515, 330], '△ACD', { size: FS.NOTE, color: COL.BLUE, weight: 700 });

  /* ---------- 角记号 ---------- */
  // 一对等角弧：在中间那条线（角平分线）两侧各留 gap 度空隙。
  // 不留这个缝，两条弧就首尾相接 —— 画面上「两个相等的角」会读成「一个大角」
  // 甚至「一个平角」，恰好把这一笔要说的事画没了（目视发现）。
  function pairArcs(idL, idR, V, XL, XM, XR, r, gap, color, sw) {
    var aM = ML.normDeg(ML.angOf(V, XM));
    function shrink(w) {
      var ww = { from: w.from, to: w.to };
      if (Math.abs(ML.normDeg(ww.to) - aM) < 1e-6) ww.to -= gap;
      else ww.from += gap;
      return ww;
    }
    var wl = shrink(ML.wedge(V, XL, XM));
    var wr = shrink(ML.wedge(V, XM, XR));
    return [
      { id: idL, k: 'arc', c: V, r: r, from: wl.from, to: wl.to, stroke: color, sw: sw || 2.2 },
      { id: idR, k: 'arc', c: V, r: r, from: wr.from, to: wr.to, stroke: color, sw: sw || 2.2 }
    ];
  }

  // 顶角两半：先用灰（表示「这个角待处理」），证出相等后转蓝
  var pa = pairArcs('arcAL', 'arcAR', A, B, D, C, 62, 6, COL.GREY, 2.2);
  var arcAL = pa[0], arcAR = pa[1];
  // 底边上那一对：全等给出相等，先画蓝弧；证出直角后换成直角符号
  var pd = pairArcs('arcDL', 'arcDR', D, B, A, C, 40, 6, COL.BLUE, 2.2);
  var arcDL = pd[0], arcDR = pd[1];
  // 直角符号只画一个（朝 C 那一侧）。两个并排会共用红线那一条边，看上去像个「⊓」括号
  var raD = right('raD', D, sub(C, D), sub(A, D), 15, COL.EDGE);

  /* ---------- 右侧 / 底部批注 ---------- */
  var warn = txt('warn', [655, 140], '先证后得：不能拿结论当前提', { size: FS.NOTE, color: COL.RED, weight: 700, anchor: 'start' });
  var stamp = txt('stamp', [450, 475], '同一条线，三种身份', { size: FS.SIDE, color: COL.RED, weight: 700 });

  /* ---------- 反例小图 ---------- */
  var iTri = { id: 'iTri', k: 'poly', pts: [iR, iP, iQ], fill: 'rgba(147,161,181,0.13)', stroke: COL.GREY, sw: 2 };
  var iMed = { id: 'iMed', k: 'line', a: iR, b: iM, stroke: COL.RED, sw: 2.4 };
  var iDot = { id: 'iDot', k: 'circ', c: iM, r: 3.6, fill: COL.GREY, stroke: 'none' };
  // 行距必须 ≥ 字高(约 22) + 两倍 halo(4.4) + 4 的门槛，否则两行会贴死：
  // 一开始按 30 排，实测净空只有 3.84 —— 这就是量出来才知道的事
  var iT1 = txt('iT1', [664, 340], '反例：不是等腰时', { size: FS.NOTE, color: COL.RED, weight: 700, anchor: 'start' });
  var iT2 = txt('iT2', [664, 376], '中线并不垂直于底边', { size: FS.NOTE, color: COL.INK, weight: 600, anchor: 'start' });

  /* ---------- 色块之上的元素清单（加半透明块后必须提回来） ---------- */
  // 顶角那两段弧也要提：它们在第 3 步就画了，第 5 步的色块会把它们压灰
  var lift = ['eAB', 'eAC', 'eBC', 'ad', 'tkAB', 'tkAC', 'vA', 'vB', 'vC', 'vD', 'dotD', 'arcAL', 'arcAR'];

  /* ============================================================
     讲稿：十三步
     ============================================================ */
  var steps = [

    /* 1 认识图形 —— 先说它是什么，再给名字 */
    {
      say: '先看这张图。顶上那个尖是三角形的顶点，把它叫做 A，后面关于顶角的话都从这里出发。底下横着的是底边，左头是 B，右头是 C，顶点和两头连起来，就是两条斜着的腰。左边这条和右边这条一样长 —— 两边一样长的三角形有名字，叫等腰三角形；这两条腰，题目把它们叫做 AB 和 AC。',
      cite: '等腰三角形 ABC：AB = AC（只是两腰相等，不是等边三角形）',
      add: [triFill, eAB, eAC, eBC, vA, vB, vC, tkAB, tkAC],
      eq: 'AB = AC'
    },

    /* 2 底边中点 D + 中线 */
    {
      say: '在底边正中间的位置取一个点，把它叫做 D —— 就是把底边平均分成两截的那个位置。从顶点朝这个点连一条线下来，这条线就是 AD。题目给的条件是：这个点是底边的中点，底边被它分成的左右两截一样长。',
      cite: 'D 是 BC 的中点：BD = DC；AD 是底边上的中线',
      add: [ad, dotD, vD, tkBD, tkDC],
      eq: 'BD = DC（D 为 BC 中点）'
    },

    /* 3 要证什么 —— 两件事，三种身份 */
    {
      say: '现在要证两件事。第一件：这条从顶上压下来的线，和底边互相垂直，也就是交出一个直角。第二件：它把顶上那个角平均分成两半。两件事合起来说就是 —— 底边上的中线、底边上的高、顶角的平分线，其实是同一根线。',
      cite: '待证 ① AD ⊥ BC  ② ∠BAD = ∠CAD ⟹ 中线、高、顶角平分线三线重合',
      add: [arcAL, arcAR],
      eq: '要证：AD ⊥ BC，且 ∠BAD = ∠CAD'
    },

    /* 4 防循环论证 */
    {
      say: '动手之前先打个预防针。垂直和中点都不是白给的 ——「等腰三角形的中线垂直于底边」正是待证的东西，把它当成前提，就是绕圈子。手上真正能用的只有三样：两条腰相等，底边被这个点平分，还有那条从顶上压下来的线，是左右两块共用的。',
      cite: '不能预设结论；可用的已知只有 AB = AC、BD = DC、AD = AD',
      add: [warn],
      eq: '已知：AB = AC，BD = DC，AD 公用'
    },

    /* 5 把图切成两块 */
    {
      say: '换个角度看图。这条线把整个三角形切成了左右两块：左边一块，由顶点、左边的 B、还有底下那个点围起来；右边一块，由顶点、右边的 C、还有同一个点围起来。两条腰、两截底边，被劈开之后各归一块，只有那条竖着的线，两块都得用。',
      cite: 'AD 把 △ABC 分成 △ABD 与 △ACD',
      delNow: ['warn'],
      add: [washABD, washACD, nABD, nACD],
      front: lift,
      eq: '△ABD 与 △ACD 共用边 AD'
    },

    /* 6 三项条件 */
    {
      say: '把条件一项一项对上去。两条腰相等，腰上的记号一样；底边被分成两截，这两截也相等，记号一样；剩下那条公共边，两块共用，长度当然也一样。三组边，齐了。',
      cite: 'AB = AC（已知），BD = DC（中点），AD = AD（公共边）',
      // 四个记号都已就位，这一步是「对上去」：一起加重，别再 add 一遍（同 id 重建会再淡入一次，闪）
      upd: [
        { id: 'tkAB', sw: 4.6 },
        { id: 'tkAC', sw: 4.6 },
        { id: 'tkBD', sw: 4.6 },
        { id: 'tkDC', sw: 4.6 }
      ],
      eq: 'AB = AC，BD = DC，AD = AD'
    },

    /* 7 边边边全等 */
    {
      say: '三条边对应相等，这条判定叫边边边：左边那块和右边那块全等，形状大小完全一样。这里特意不走夹角那条路 —— 要用夹角，就得先知道顶角被平分，而那正是待证的东西，用了它还是绕圈子。',
      cite: 'SSS：△ABD ≌ △ACD（三组对应边相等）',
      upd: [
        { id: 'wABD', fill: 'rgba(15,157,88,0.15)' },
        { id: 'wACD', fill: 'rgba(15,157,88,0.15)' },
        { id: 'nABD', fill: COL.GREEN },
        { id: 'nACD', fill: COL.GREEN }
      ],
      eq: '△ABD ≌ △ACD（SSS）'
    },

    /* 8 第一对对应角 */
    {
      say: '全等一定带来对应角相等。先看底边上那一对：左边那块在底边上的角，和右边那块在底边上的角，它们是对应角，所以一样大。',
      cite: '全等三角形的对应角相等：∠ADB = ∠ADC',
      add: [arcDL, arcDR],
      eq: '∠ADB = ∠ADC'
    },

    /* 9 邻补角 → 各一半 */
    {
      say: '再看这两个角的位置：底下那条边本来就是一条直的线，而那个点就落在这条线上，所以这两个角是紧挨着的邻补角，加起来是一百八十度。既然一样大，那就只能对半分，各是九十度。',
      cite: 'B、D、C 共线 ⟹ ∠ADB + ∠ADC = 180°；又 ∠ADB = ∠ADC ⟹ 各 90°',
      upd: [
        { id: 'eBC', stroke: COL.INK, sw: 3.4 },
        { id: 'arcDL', sw: 2.8 },
        { id: 'arcDR', sw: 2.8 }
      ],
      eq: '∠ADB + ∠ADC = 180°，∠ADB = ∠ADC ⟹ 各 90°'
    },

    /* 10 垂直 —— 结论一 */
    {
      say: '两条线相交，只要交出一个直角，这两条线就互相垂直。所以那条从顶上压下来的线垂直于底边，第一件事证完了。这一步是拿垂直的定义反过来用：先证出直角，再说两条线垂直。',
      cite: '∠ADB = 90° ⟹ AD ⊥ BC（垂直的定义）',
      delNow: ['arcDL', 'arcDR'],
      add: [raD],
      eq: 'AD ⊥ BC'
    },

    /* 11 第二对对应角 —— 结论二 */
    {
      say: '第二件事看顶上。全等还给出另外一对对应角：从这个顶点朝左边那个 B 张开的角，和朝右边那个 C 张开的角，它们一样大。一样大就是平分 —— 那条线把顶角劈成了相等的两半。',
      cite: '△ABD ≌ △ACD ⟹ ∠BAD = ∠CAD，即 AD 平分 ∠BAC',
      upd: [
        { id: 'arcAL', stroke: COL.BLUE, sw: 2.8 },
        { id: 'arcAR', stroke: COL.BLUE, sw: 2.8 }
      ],
      eq: '∠BAD = ∠CAD（AD 平分 ∠BAC）'
    },

    /* 12 命名：三线合一 */
    {
      say: '两件事摆在一起，结论就浮出来了：底边上的中线、底边上的高、顶角的平分线，在等腰三角形里是同一根线。这就是三线合一。名字听着唬人，意思其实很朴素 —— 从顶角往下走，走中线、走垂线、走角平分线，脚下踩的都是同一条。',
      cite: '等腰三角形三线合一：底边上的中线、底边上的高、顶角的平分线互相重合',
      upd: [{ id: 'ad', sw: 4.2 }],
      add: [stamp],
      eq: 'AD：中线 ⟺ 高 ⟺ 角平分线'
    },

    /* 13 怎么用 / 前提是等腰 */
    {
      say: '那它怎么用？三条里知道任意一条，另外两条就白送：题目说底边被平分，那就能直接说垂直；题目说垂直，那就能直接说底边被平分。但反过来要留个心眼 —— 这套换算全靠「两条腰相等」撑着。右边那个小三角形不是等腰，它从顶点连到底边中点的线就歪着，一点不垂直。所以动笔之前先确认一句：它到底是不是等腰。',
      cite: '用法：等腰中三条任得其一 ⟹ 另两条；前提是 AB = AC，非等腰时结论不成立（右下反例）',
      add: [iTri, iMed, iDot, iT1, iT2],
      eq: 'AB = AC ⟹ 中线 ≡ 高 ≡ 角平分线；缺了等腰就失效',
      hold: 5200
    }
  ];

  window.MATHLAB_LESSONS = window.MATHLAB_LESSONS || [];
  window.MATHLAB_LESSONS.push({
    id: 'model-isosceles-median',
    title: '等腰三角形 · 底边中线：三线合一为什么成立',
    grade: '初二',
    topic: '几何 · 三角形',
    tags: ['几何', '等腰三角形', '三线合一', '全等', 'SSS', '垂直', '角平分线', '模型课'],
    question: '在 △ABC 中，AB = AC，D 是 BC 的中点。求证：AD ⊥ BC，且 AD 平分 ∠BAC（底边上的中线、底边上的高、顶角的平分线三线重合）。',
    thumbStep: 10,
    methods: [
      {
        name: '边边边全等 + 邻补角',
        tier: 'proof',
        sub: '模型课 · 十三步，每步都摆出依据',
        steps: steps
      }
    ]
  });
})();
