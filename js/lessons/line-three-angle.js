/* ============================================================
   一线三等角（含一线三垂直）· 纯证明
   ------------------------------------------------------------
   方法一：一线三垂直（α = 90° 的具体情形）
     题设：∠BAC = 90°，AB = AC，直线 l 过 A，BD ⊥ l 于 D，CE ⊥ l 于 E
     要证：△ABD ≌ △CAE，且 DE = BD + CE

   方法二：一般的一线三等角（α 任意）
     题设：D 在 BC 上，∠ABC = ∠ADE = ∠ACB = α
     要证：△ABD ∽ △DCE

   两步都只有证明：不写「量一量」，也不解释内角和 180° 这种常识。
   ============================================================ */
(function () {
  var AN = window.ANNO, ML = window.ML;
  var COL = AN.COL, FS = AN.FS;
  var sub = AN.sub, add = AN.add, mul = AN.mul, unit = AN.unit, dist = AN.dist;

  /* 射线 P + t·dir 与直线 Q1Q2 的交点（E 点由角定出，不手填坐标） */
  function rayLine(P, dir, Q1, Q2) {
    var d = unit(dir), e = sub(Q2, Q1);
    var den = d[0] * e[1] - d[1] * e[0];
    var t = ((Q1[0] - P[0]) * e[1] - (Q1[1] - P[1]) * e[0]) / den;
    return [P[0] + d[0] * t, P[1] + d[1] * t];
  }
  function rot(v, deg) {
    var c = Math.cos(deg * AN.D2R), s = Math.sin(deg * AN.D2R);
    return [v[0] * c - v[1] * s, v[0] * s + v[1] * c];
  }
  // 底部推导账本：每一步整块替换（先删后加，不会叠字）
  var LED_IDS = ['led0', 'led1', 'led2', 'led3'];
  function led(lines) {
    return lines.map(function (t, i) {
      return AN.txt('led' + i, [50, 396 + i * 28], t, {
        size: 16, anchor: 'start',
        color: i === lines.length - 1 ? COL.RED : COL.INK
      });
    });
  }

  /* ============================================================
     方法一：一线三垂直  α = 90°
     ============================================================ */

  var s1 = 360;                       // 直角边 AB = AC
  var A1 = [450, 118];
  var uB = [-0.8, 0.6];               // A → B：左下
  var uC = [0.6, 0.8];                // A → C：右下（与 uB 垂直）
  var B1 = add(A1, mul(uB, s1));      // (162, 334)
  var C1 = add(A1, mul(uC, s1));      // (666, 406)
  var D1 = [B1[0], A1[1]];            // (162, 118)
  var E1 = [C1[0], A1[1]];            // (666, 118)
  var O1 = [(A1[0] + B1[0] + C1[0]) / 3, (A1[1] + B1[1] + C1[1]) / 3];

  var l1 = { id: 'l1', k: 'line', a: [50, A1[1]], b: [826, A1[1]], stroke: COL.EDGE, sw: 2.2 };
  var lbL = AN.txt('lbL', [838, A1[1] - 4], 'l', { size: FS.SIDE, color: COL.EDGE, anchor: 'start' });
  var tri1 = { id: 'tri1', k: 'poly', pts: [A1, B1, C1], fill: COL.FILL, stroke: COL.EDGE, sw: 2.4 };
  var segBD = { id: 'segBD', k: 'line', a: B1, b: D1, stroke: COL.EDGE, sw: 2.4 };
  var segCE = { id: 'segCE', k: 'line', a: C1, b: E1, stroke: COL.EDGE, sw: 2.4 };

  var nA = AN.vname('vA', A1, O1), nB = AN.vname('vB', B1, O1), nC = AN.vname('vC', C1, O1);
  var nD = AN.txt('vD', [D1[0] - 30, D1[1] + 30], 'D', { size: FS.V, weight: 700 });
  var nE = AN.txt('vE', [E1[0] + 30, E1[1] + 30], 'E', { size: FS.V, weight: 700 });

  var raD = AN.right('raD', D1, sub(A1, D1), sub(B1, D1), 14, COL.RED);
  var raE = AN.right('raE', E1, sub(A1, E1), sub(C1, E1), 14, COL.RED);
  var raA = AN.right('raA', A1, sub(B1, A1), sub(C1, A1), 14, COL.RED);

  var ang1 = AN.angle('ang1', A1, B1, D1, 70, COL.ORANGE, '①', { size: FS.NOTE });
  var ang2 = AN.angle('ang2', A1, C1, E1, 70, COL.ORANGE, '②', { size: FS.NOTE });
  var ang3 = AN.angle('ang3', B1, A1, D1, 44, COL.BLUE, '∠ABD', { size: 15, gap: 26 });
  var ang3a = ang3.filter(function (x) { return x.k === 'arc'; });
  var ang3t = ang3.filter(function (x) { return x.k === 'text'; });

  var fABD = { id: 'fABD', k: 'poly', pts: [A1, B1, D1], fill: AN.wash('15,157,88', 0.13), stroke: 'rgba(15,157,88,0.5)', sw: 2 };
  var fCAE = { id: 'fCAE', k: 'poly', pts: [C1, A1, E1], fill: AN.wash('15,157,88', 0.13), stroke: 'rgba(15,157,88,0.5)', sw: 2 };

  function heavy(id, X, Y, color) { return { id: id, k: 'line', a: X, b: Y, stroke: color, sw: 5.5 }; }
  var hAD = heavy('hAD', A1, D1, COL.ORANGE), hCE = heavy('hCE', C1, E1, COL.ORANGE);
  var hBD = heavy('hBD', B1, D1, COL.BLUE), hAE = heavy('hAE', A1, E1, COL.BLUE);
  var legend = [
    AN.txt('lg1', [712, 190], 'AD = CE', { size: FS.NOTE, color: COL.ORANGE, anchor: 'start' }),
    AN.txt('lg2', [712, 218], 'BD = AE', { size: FS.NOTE, color: COL.BLUE, anchor: 'start' })
  ];

  var cap = AN.txt('cap', [50, 44], '一线三垂直：D、A、E 共线，三点各有一个直角', { size: FS.NOTE, anchor: 'start' });

  var steps1 = [
    {
      say: '等腰直角三角形 ABC，∠A = 90°。一条直线 l 过 A，B、C 在 l 同侧，BD、CE 都垂直于 l。',
      cite: '题设：∠BAC = 90°，AB = AC，BD ⊥ l 于 D，CE ⊥ l 于 E',
      add: [l1, lbL, tri1, segBD, segCE, nA, nB, nC, nD, nE],
      eq: 'AB = AC，∠BAC = 90°'
    },
    {
      say: 'D、A、E 都落在 l 上，每个点处各有一个 90°。一条线上三个直角，这就是「一线三垂直」。',
      cite: 'BD ⊥ l ⟹ ∠ADB = 90°；CE ⊥ l ⟹ ∠AEC = 90°；题设 ∠BAC = 90°',
      add: [cap, raD, raE, raA],
      eq: '∠ADB = ∠BAC = ∠AEC = 90°'
    },
    {
      say: 'A 在直线上，所以 ∠1 加 90° 再加 ∠2，正好是一个平角。',
      cite: '平角 = 180°（D、A、E 共线）',
      delNow: LED_IDS,
      add: ang1.concat(ang2, led(['∠1 + 90° + ∠2 = 180°（平角）', '⟹ ∠1 + ∠2 = 90°'])),
      eq: '∠1 + ∠2 = 90°'
    },
    {
      say: '换个角度：△ABD 里已经有个 90°，剩下两个角相加也是 90°。',
      cite: '直角三角形两锐角互余',
      delNow: LED_IDS,
      add: ang3a.concat(ang3t, led(['∠1 + ∠2 = 90°', '∠1 + ∠ABD = 90°（互余）'])),
      eq: '∠1 + ∠ABD = 90°'
    },
    {
      say: '两个式子都等于 90°，都含 ∠1。各减掉 ∠1，就得到 ∠ABD = ∠2。',
      cite: '同角的余角相等',
      delNow: LED_IDS,
      add: led(['∴ ∠ABD = ∠2（同角的余角相等）']),
      upd: [
        { id: 'ang3', stroke: COL.GREEN }, { id: 'ang3t', fill: COL.GREEN },
        { id: 'ang2', stroke: COL.GREEN }, { id: 'ang2t', fill: COL.GREEN }
      ],
      eq: '∠ABD = ∠CAE'
    },
    {
      say: '角凑齐两组，还差一条边。AB = AC 是题设给的——注意它们都是 90° 的对边。',
      cite: '等腰直角三角形 AB = AC；AB 是 ∠ADB 的对边，CA 是 ∠CEA 的对边',
      delNow: LED_IDS,
      add: [
        AN.tick('tkAB', A1, B1, COL.EDGE), AN.tick('tkCA', C1, A1, COL.EDGE)
      ].concat(led(['∠ABD = ∠2', '∠ADB = ∠CEA = 90°', 'AB = CA（都是 90° 的对边）'])),
      eq: 'AB = CA'
    },
    {
      say: '两角加其中一角的对边，AAS 判定，两个三角形全等。',
      cite: 'AAS：两角及其中一角的对边对应相等的两个三角形全等',
      delNow: LED_IDS,
      add: [fABD, fCAE].concat(led(['∠ABD = ∠2，∠ADB = ∠CEA = 90°，AB = CA', '⟹ △ABD ≌ △CAE（AAS）'])),
      front: ['segBD', 'segCE', 'raD', 'raE', 'raA', 'ang3', 'ang3t', 'l1', 'segAD'],
      eq: '△ABD ≌ △CAE（AAS）'
    },
    {
      say: '全等三角形的对应边相等：AD 等于 CE，BD 等于 AE。',
      cite: '全等三角形对应边相等',
      delNow: LED_IDS,
      add: [hAD, hCE, hBD, hAE].concat(legend, led(['△ABD ≌ △CAE', '⟹ AD = CE，BD = AE'])),
      // 粗线排在细线之后：否则 segBD/segCE 的深色细线会从粗线中间穿出来
      front: ['segBD', 'segCE', 'raD', 'raE', 'hAD', 'hCE', 'hBD', 'hAE'],
      eq: 'AD = CE，BD = AE'
    },
    {
      say: 'A 夹在 D、E 之间，所以 DE 就是 DA 加 AE。',
      cite: 'D、A、E 依次共线 ⟹ DE = DA + AE',
      delNow: LED_IDS,
      add: led(['DE = DA + AE', '= CE + BD（等量代换）']),
      eq: 'DE = DA + AE'
    },
    {
      say: '把 AE 换成同样长的 BD，结论就出来了：DE = BD + CE。',
      cite: '等量代换',
      delNow: LED_IDS,
      add: led(['DE = BD + CE']),
      eq: 'DE = BD + CE',
      hold: 3400
    }
  ];

  /* ============================================================
     方法二：一般的一线三等角（α 任意）
     ============================================================ */

  var ALPHA = 55;
  var B2 = [238, 404], C2 = [662, 404];
  var halfBC = (C2[0] - B2[0]) / 2;
  var A2 = [(B2[0] + C2[0]) / 2, 404 - halfBC * Math.tan(ALPHA * AN.D2R)];
  var D2 = [430, 404];
  var dirDA = sub(A2, D2), toC = sub(C2, D2);
  var rP = rot(dirDA, ALPHA), rM = rot(dirDA, -ALPHA);
  var sign = (rP[0] * toC[0] + rP[1] * toC[1]) > (rM[0] * toC[0] + rM[1] * toC[1]) ? 1 : -1;
  var E2 = rayLine(D2, rot(dirDA, sign * ALPHA), A2, C2);
  var O2 = [(A2[0] + B2[0] + C2[0]) / 3, (A2[1] + B2[1] + C2[1]) / 3];

  var M2_IDS = ['m2led0', 'm2led1'];
  function led2(lines) {
    return lines.map(function (t, i) {
      return AN.txt('m2led' + i, [50, 446 + i * 28], t, {
        size: 16, anchor: 'start',
        color: i === lines.length - 1 ? COL.RED : COL.INK
      });
    });
  }

  var tri2 = { id: 'tri2', k: 'poly', pts: [A2, B2, C2], fill: COL.FILL, stroke: COL.EDGE, sw: 2.4 };
  var segDE = { id: 'segDE', k: 'line', a: D2, b: E2, stroke: COL.EDGE, sw: 2.2 };
  var segAD = { id: 'segAD', k: 'line', a: A2, b: D2, stroke: COL.EDGE, sw: 2.2 };

  var m2nA = AN.vname('wA', A2, O2), m2nB = AN.vname('wB', B2, O2), m2nC = AN.vname('wC', C2, O2);
  var m2nD = AN.txt('wD', [D2[0] - 6, 404 + 32], 'D', { size: FS.V, weight: 700 });
  var m2nE = AN.txt('wE', [E2[0] + 28, E2[1] + 4], 'E', { size: FS.V, weight: 700 });

  var m2angB = AN.angle('m2aB', B2, A2, C2, 54, COL.ORANGE, 'α', { size: FS.NOTE });
  var m2angC = AN.angle('m2aC', C2, B2, A2, 54, COL.ORANGE, 'α', { size: FS.NOTE });
  var m2angD = AN.angle('m2aD', D2, A2, E2, 56, COL.ORANGE, 'α', { size: FS.NOTE });
  var m2ang1 = AN.angle('m2a1', D2, A2, B2, 30, COL.BLUE, '①', { size: 15, gap: 22 });
  var m2ang2 = AN.angle('m2a2', D2, C2, E2, 30, COL.PURPLE, '②', { size: 15, gap: 22 });

  var m2cap = AN.txt('m2cap', [50, 44], '一线三等角：B、D、C 共线，三点各有一个相等的角 α', { size: FS.NOTE, anchor: 'start' });

  var f2abd = { id: 'f2abd', k: 'poly', pts: [A2, B2, D2], fill: AN.wash('37,99,235', 0.13), stroke: 'rgba(37,99,235,0.5)', sw: 2 };
  var f2dce = { id: 'f2dce', k: 'poly', pts: [D2, C2, E2], fill: AN.wash('124,58,237', 0.13), stroke: 'rgba(124,58,237,0.5)', sw: 2 };

  var steps2 = [
    {
      say: '把 90° 换成一个普通的角 α：D 在 BC 上，∠B、∠ADE、∠C 都等于 α。',
      cite: '已知 ∠ABC = ∠ADE = ∠ACB = α，D 在 BC 上',
      add: [tri2, segAD, segDE, m2nA, m2nB, m2nC, m2nD, m2nE],
      eq: '∠B = ∠ADE = ∠C = α'
    },
    {
      say: 'B、D、C 在同一条直线上，三个点各有一个 α。这才是「一线三等角」的一般样子，90° 只是它的特例。',
      cite: '三个相等的角，顶点都在同一条直线 BC 上',
      add: [m2cap].concat(m2angB, m2angC, m2angD),
      eq: '三个 α 撑在一条线上'
    },
    {
      say: '看 D 点：① 加 α 再加 ②，正好是平角。',
      cite: '平角 = 180°（B、D、C 共线）',
      delNow: M2_IDS,
      add: m2ang1.concat(m2ang2, led2(['① + α + ② = 180°', '⟹ ① + ② = 180° − α'])),
      eq: '① + ② = 180° − α'
    },
    {
      say: '再看 △ABD：三个角加起来 180°，其中一个是 α。',
      cite: '三角形内角和 180°，已知 ∠ABD = α',
      delNow: M2_IDS,
      add: led2(['① + α + ∠BAD = 180°', '⟹ ① + ∠BAD = 180° − α']),
      eq: '① + ∠BAD = 180° − α'
    },
    {
      say: '两个式子右边一样，都含 ①。所以 ② = ∠BAD。',
      cite: '同角的补角相等',
      delNow: M2_IDS,
      add: led2(['两式右边相同 ⟹ ② = ∠BAD', '即 ∠EDC = ∠BAD']),
      upd: [
        { id: 'm2a2', stroke: COL.GREEN }, { id: 'm2a2t', fill: COL.GREEN },
        { id: 'm2a1', stroke: COL.GREEN }, { id: 'm2a1t', fill: COL.GREEN }
      ],
      eq: '∠EDC = ∠BAD'
    },
    {
      say: '加上本来就相等的 ∠B = ∠C，两组角对应相等，两个三角形相似。',
      cite: 'AA：两个角分别相等的两个三角形相似',
      delNow: M2_IDS,
      add: [f2abd, f2dce].concat(led2(['∠EDC = ∠BAD，∠B = ∠C = α', '⟹ △ABD ∽ △DCE（AA）'])),
      front: ['segAD', 'segDE'],
      eq: '△ABD ∽ △DCE（AA）'
    },
    {
      say: '相似给出三组比例：AB 比 DC、BD 比 CE、AD 比 DE。',
      cite: '相似三角形对应边成比例',
      delNow: M2_IDS,
      add: led2(['AB : DC = BD : CE = AD : DE', '（对应角：A↔D，B↔C，D↔E）']),
      eq: 'AB : DC = BD : CE = AD : DE'
    },
    {
      say: '只要再有一组对应边相等，相似就升级成全等。方法一里那三个 90°，正是 α = 90° 时的特例。',
      cite: '相似三角形中，有一组对应边相等 ⟹ 全等',
      delNow: M2_IDS,
      add: led2(['α = 90° 且 AB = AC ⟹ 全等（方法一）']),
      eq: 'α = 90° 且 AB = AC ⟹ 全等',
      hold: 3600
    }
  ];

  /* ============================================================
     注册
     ============================================================ */
  window.MATHLAB_LESSONS = window.MATHLAB_LESSONS || [];
  window.MATHLAB_LESSONS.push({
    id: 'line-three-angle',
    title: '一线三等角：三个相等的角挤在一条线上',
    grade: '初二',
    topic: '几何 · 全等模型',
    tags: ['几何', '全等', '全等模型', 'AAS', '相似', '一线三等角'],
    question: '一条直线上有三个相等的角，能推出什么？（一线三垂直 / 一线三等角模型）',
    thumbStep: 8,
    methods: [
      {
        name: '一线三垂直 · AAS 全等', tier: 'proof',
        sub: '严格证明 · 10 步，结论 DE = BD + CE',
        steps: steps1
      },
      {
        name: '一般情形 · 一线三等角相似', tier: 'proof',
        sub: '严格证明 · 8 步，把 90° 换成任意角 α',
        steps: steps2
      }
    ]
  });
})();
