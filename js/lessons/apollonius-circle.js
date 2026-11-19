/* ============================================================
   阿氏圆：圆上一动点，求 PA + (r/OB)·PB 的最小值
   ------------------------------------------------------------
   题：⊙O 半径 r = 2，B 在射线 OB 上且 OB = 5，A 是圆外一定点。
       P 是圆上一动点，求 PA + (2/5)PB 的最小值。

   方法一（演示档 · 量一量）：
       P 绕圆走一圈，PA + 0.4PB 先降后升；谷底那一点恰好让 A、P、C 三点共线，
       而 C 落在 OB 上、距 O 正好 r²/OB = 0.8 —— 这个巧合就是方法的入口

   方法二（证明档 · 相似构造）：
       在 OB 上取 C 使 OC = r²/OB
       ⟹ OP/OB = 2/5 = OC/OP，又 ∠POC = ∠BOP（公共角）
       ⟹ △OPC ∽ △OBP（SAS 相似）⟹ PC/PB = OP/OB = 2/5 ⟹ PC = (2/5)PB
       ⟹ PA + (2/5)PB = PA + PC ≥ AC（三角不等式）
       C 在圆内、A 在圆外 ⟹ 线段 AC 与圆恰交一点 P₀ ⟹ 等号可取
       ⟹ 最小值 = AC = 6

   几何已由 _design_cd.mjs 验算（40px = 1 单位，圆 80px）：
       O=(0,0) r=2，B=(0,−5)，C=(0,−0.8)，A=(6,−0.8) ⟹ AC 水平、长 6
       P₀ = AC ∩ 圆 = [503.321, 302]，PA=166.679、PB=183.303、PC=73.321
       PC/PB = 0.400000 ✓，PA + 0.4PB = 240.000px = 6.00 ✓
       扫圆（0.05° 步长）最小值 240.000，出现在 −23.60°≈P₀ 的 −23.58° ✓
       阿氏圆验证：|PC|/|PB| = 2/5 的轨迹，内外分点 [430,350]/[430,190] 夹出圆心 [430,270]=O、半径 80 ✓
   一度想把 AC 画成斜的（A=[660.4,234.8]），改成水平后「P 落在 AC 上」一眼可见，值不变。

   配色纪律：待最小化的 PA、PB 红，等量代换出来的 PC 绿，下界 AC 蓝粗，
            两个相似三角形 △OPC 橙 / △OBP 青。
   ============================================================ */
(function () {
  var AN = window.ANNO, ML = window.ML;
  var COL = AN.COL, FS = AN.FS;
  var sub = AN.sub, add = AN.add, mul = AN.mul, unit = AN.unit, dist = AN.dist, mid = AN.mid;

  /* ---------- 几何（40px = 1 单位，来自 _design_cd.mjs） ---------- */
  // 48px = 1 单位（第一版用了 40px，圆只有 160px 直径、内容整体偏右，画面空一半）
  var O = [400, 240], RAD = 96;                   // r = 2 单位
  var B = [400, 480];                             // OB = 5 单位 = 240px
  var C = [400, 278.4];                           // OC = r²/OB = 0.8 单位 = 38.4px
  var A = [688, 278.4];                           // AC 水平，长 288px = 6 单位
  var P = [487.985, 278.4];                       // 最小点 = AC ∩ 圆（400 + √(96²−38.4²) = 487.985）

  /* 圆上按极角取点（deg 为数学角，屏幕 y 向下） */
  function onCircle(deg) {
    var t = deg * Math.PI / 180;
    return [O[0] + RAD * Math.cos(t), O[1] - RAD * Math.sin(t)];
  }

  function line(id, X, Y, color, sw, dash) {
    return { id: id, k: 'line', a: X, b: Y, stroke: color || COL.EDGE, sw: sw || 2.4, dash: dash };
  }
  // AC 被 PA、PC 两段完全覆盖（P 就落在 AC 上），画实线等于白画：
  // 改成 13px 的淡蓝底衬，红绿两段铺在上面，一眼看出「整条 AC = 这两段」
  function under(id, X, Y, rgba) {
    return { id: id, k: 'line', a: X, b: Y, stroke: rgba, sw: 14 };
  }
  function dot(id, Q, color, r) {
    return { id: id, k: 'circ', c: Q, r: r || 4.4, fill: color, stroke: 'none' };
  }
  function poly(id, pts, rgb, a) {
    return { id: id, k: 'poly', pts: pts, fill: AN.wash(rgb || '37,99,235', a == null ? 0.12 : a), stroke: 'none' };
  }
  function led(p) {
    return function (lines, start) {
      return lines.map(function (t, i) {
        return AN.txt(p + 'led' + i, [60, (start || 452) + i * 25], t, {
          size: FS.NOTE, color: COL.INK, anchor: 'start', halo: true
        });
      });
    };
  }
  function nm(id, at, t, color, anchor) {
    return AN.txt(id, at, t, { size: FS.V, weight: 700, color: color || COL.INK, anchor: anchor || 'middle' });
  }

  /* ============================================================
     方法一：量一量（演示档）
     ============================================================ */
  var p1 = 'v';
  var ci1 = { id: 'vcirc', k: 'circ', c: O, r: RAD, fill: 'none', stroke: COL.GREY, sw: 2.4 };
  var sOB1 = line('vsOB', O, B, COL.GREY, 2.0);
  var cO1 = dot('vcO', O, COL.INK, 4.6);
  var cB1 = dot('vcB', B, COL.INK, 5);
  var cA1 = dot('vcA', A, COL.INK, 5);
  var nO1 = nm('vnO', [O[0] - 26, O[1] - 10], 'O');
  var nB1 = nm('vnB', [B[0], B[1] + 32], 'B');
  var nA1 = nm('vnA', [A[0] + 22, A[1] + 5], 'A');

  /* 试探位置：点、到 A 的两段、字母 */
  function trial(tag, Q, lab, labAt) {
    return {
      q: dot(p1 + 'q' + tag, Q, COL.PURPLE, 4.8),
      qa: line(p1 + 'qa' + tag, Q, A, COL.RED, 2.4),
      qb: line(p1 + 'qb' + tag, Q, B, COL.RED, 2.4),
      qn: AN.txt(p1 + 'qn' + tag, labAt, lab, { size: FS.NOTE, color: COL.PURPLE, weight: 700 })
    };
  }
  var Q120 = onCircle(120), Q60 = onCircle(60), Q0 = onCircle(0), Qm60 = onCircle(-60);
  var T120 = trial('1', Q120, 'P₁', [Q120[0] - 26, Q120[1] - 8]);
  var T60 = trial('2', Q60, 'P₂', [Q60[0] + 24, Q60[1] - 10]);
  var T0 = trial('3', Q0, 'P₃', [Q0[0] + 26, Q0[1] + 6]);
  var Tm60 = trial('4', Qm60, 'P₄', [Qm60[0] + 26, Qm60[1] + 14]);
  // P 的字母放右下：正上方会和 P₃ 的标签挤成一排，看着像 P₃ 的注脚
  var TP = trial('', P, 'P', [P[0] + 22, P[1] + 26]);

  /* 第 7 步才出现的 C 与 AC */
  // 用虚线：AC 与 PA 共线，实线会把红的那段整条盖掉，看不出来「PA 是 AC 的一截」
  var sAC1 = line('vsAC', A, C, COL.TEAL, 2.4, [9, 7]);
  var cC1 = dot('vcC', C, COL.TEAL, 4.6);
  var nC1 = nm('vnC', [C[0] - 28, C[1] - 4], 'C', COL.TEAL);

  var lift1 = ['vcirc', 'vsOB', 'vsAC', 'vnO', 'vnB', 'vnA',
               'vq1', 'vq2', 'vq3', 'vq4', 'vq',
               'vqa1', 'vqb1', 'vqa2', 'vqb2', 'vqa3', 'vqb3', 'vqa4', 'vqb4', 'vqa', 'vqb',
               'vqn1', 'vqn2', 'vqn3', 'vqn4', 'vqn', 'vnC',
               'vcO', 'vcB', 'vcA', 'vcC'];

  var steps1 = [
    {
      say: '圆心 O，半径二。B 在射线 OB 上，离 O 五格。A 是圆外一个定点。P 在圆上随便跑，要求 PA 加上五分之二的 PB 最小。为什么是五分之二？因为半径比 OB —— 二比五。这个系数是题目给的，不是凑的。',
      cite: '题设：⊙O 半径 2，OB = 5，A 为圆外定点，P 在圆上；求 PA + (2/5)PB 最小',
      add: [ci1, sOB1, cO1, cB1, cA1, nO1, nB1, nA1, TP.q, TP.qn]
        .concat(led(p1)(['P 在圆上动', '求 min(PA + 0.4·PB)'], 452)),
      eq: '求 min(PA + (2/5)PB)'
    },
    {
      say: '老规矩，先量。把 P 放到圆的正上方偏左，连出 PA 和 PB，量出来十点二。',
      cite: 'P₁ 在 120° 方向：PA + 0.4PB ≈ 10.17',
      delNow: ['vq', 'vqn'],
      add: [T120.qa, T120.qb, T120.q, T120.qn].concat(led(p1)(['P₁：10.17'])),
      front: lift1.concat(['vqa1', 'vqb1', 'vq1', 'vqn1'])
    },
    {
      say: '沿着圆往右上方挪一点，量出来八点三。小了。',
      cite: 'P₂ 在 60° 方向：≈ 8.33',
      delNow: ['vqa1', 'vqb1'],
      add: [T60.qa, T60.qb, T60.q, T60.qn].concat(led(p1)(['P₂：8.33', '在变小'])),
      front: lift1.concat(['vqa2', 'vqb2', 'vq2', 'vqn2'])
    },
    {
      say: '再挪到圆的右边，六点二。还在小。',
      cite: 'P₃ 在 0° 方向（圆的最右端）：≈ 6.23',
      delNow: ['vqa2', 'vqb2'],
      add: [T0.qa, T0.qb, T0.q, T0.qn].concat(led(p1)(['P₃：6.23', '还在小'])),
      front: lift1.concat(['vqa3', 'vqb3', 'vq3', 'vqn3'])
    },
    {
      say: '再往下挪到右下角，六点四 —— 回升了。说明谷底就在 P₃ 和 P₄ 之间。',
      cite: 'P₄ 在 −60° 方向：≈ 6.45（回升）',
      delNow: ['vqa3', 'vqb3'],
      add: [Tm60.qa, Tm60.qb, Tm60.q, Tm60.qn].concat(led(p1)(['P₄：6.45（回升）', '谷底在 P₃ 与 P₄ 之间'])),
      front: lift1.concat(['vqa4', 'vqb4', 'vq4', 'vqn4'])
    },
    {
      say: '卡在中间再量一次：正好六。这是这一圈里量到的最小值。',
      cite: '谷底位置：PA = 4.17，PB = 4.58，PA + 0.4PB = 6.00（最小）',
      delNow: ['vqa4', 'vqb4'],
      add: [TP.qa, TP.qb, TP.q, TP.qn].concat(led(p1)(['PA = 4.17，PB = 4.58', '和 = 6.00（最小）'])),
      front: lift1.concat(['vqa', 'vqb', 'vq', 'vqn'])
    },
    {
      say: '谷底那一点特殊在哪？把 A 和 P 连起来、朝左延长，它正好穿过 OB 上的一个点，记作 C —— A、P、C 三点一条直线。这下问题的味道就出来了：最小值可能不是「一个点的位置」，而是「一条线段的长度」。',
      cite: '谷底处 A、P、C 共线（C 在 OB 上）',
      add: [sAC1, cC1, nC1].concat(led(p1)(['A、P、C 共线', 'C 在 OB 上'])),
      front: lift1
    },
    {
      say: '再量一下 C 的位置：OC 是零点八。零点八这个数不随便 —— 半径的平方除以 OB，四除以五，正好零点八。圆上的点 P 和这个 C 之间，藏着某个固定的比例关系。下一个方法就来把它挖出来。',
      cite: 'OC = 0.8 = r²/OB —— 这个数是关键，不是巧合',
      add: led(p1)(['OC = 0.8 = r²/OB = 4/5', '⟹ P 与 C 之间有固定比例']),
      front: lift1
    }
  ];

  /* ============================================================
     方法二：相似构造（证明档）
     ============================================================ */
  var p2 = 'w';
  var ci2 = { id: 'wcirc', k: 'circ', c: O, r: RAD, fill: 'none', stroke: COL.GREY, sw: 2.4 };
  var sOB2 = line('wsOB', O, B, COL.GREY, 2.0);
  var cO2 = dot('wcO', O, COL.INK, 4.6);
  var cB2 = dot('wcB', B, COL.INK, 5);
  var cA2 = dot('wcA', A, COL.INK, 5);
  var nO2 = nm('wnO', [O[0] - 26, O[1] - 10], 'O');
  var nB2 = nm('wnB', [B[0], B[1] + 32], 'B');
  var nA2 = nm('wnA', [A[0] + 22, A[1] + 5], 'A');

  var cP2 = dot('wcP', P, COL.RED, 5);
  var cC2 = dot('wcC', C, COL.TEAL, 4.8);
  var nP2 = nm('wnP', [P[0] + 4, P[1] - 28], 'P', COL.RED);
  var nC2 = nm('wnC', [C[0] - 28, C[1] - 4], 'C', COL.TEAL);

  var sPA2 = line('wsPA', P, A, COL.RED, 2.6);
  var sPB2 = line('wsPB', P, B, COL.RED, 2.6);
  var sOP2 = line('wsOP', O, P, COL.INK, 2.2);
  var sPC2 = line('wsPC', P, C, COL.GREEN, 2.8);
  var hAC2 = under('whAC', A, C, 'rgba(37,99,235,0.24)');

  var fOPC = poly('wfOPC', [O, P, C], '194,65,12', 0.26);
  var fOBP = poly('wfOBP', [O, B, P], '14,116,144', 0.14);

  // 从下往上：圆 → 轴 → 底衬 → 色块 → 细线 → 字母 → 点
  // 底衬必须排在最底：一版把它放在 wsPC 之后，14px 的淡蓝盖在 2.8px 绿线上，PC 整段发暗
  var lift2 = ['wcirc', 'wsOB', 'whAC',
               'wfOBP', 'wfOPC',
               'wsOP', 'wsPA', 'wsPB', 'wsPC',
               'warcO',
               'wnO', 'wnB', 'wnA', 'wnP', 'wnC',
               'wcO', 'wcB', 'wcA', 'wcP', 'wcC'];

  var steps2 = [
    {
      say: '要求 PA 加五分之二的 PB。难在哪？两段的系数不一样 —— 一个是完整的一倍，一个打了四折。三角不等式只能处理「两边之和大于第三边」，它不吃系数。',
      cite: '难点：PA 与 PB 前面系数不同（1 和 2/5），三角不等式不能直接用',
      add: [ci2, sOB2, cO2, cB2, cA2, nO2, nB2, nA2, sPA2, cP2, nP2]
        .concat(led(p2)(['难点：两段系数不同', '三角不等式吃不下系数'], 452)),
      front: lift2
    },
    {
      say: '那就想办法把五分之二的 PB 换成一条长度相等、但端点固定的线段。换成什么呢？换成一个定点到 P 的距离。',
      cite: '思路：把 (2/5)PB 换成 PC，让 C 成为定点',
      add: [sPB2].concat(led(p2)(['目标：让 (2/5)PB = PC', 'C 必须是定点'])),
      front: lift2
    },
    {
      say: '定点 C 放在哪？答案是放在射线 OB 上，让 OC 等于半径的平方除以 OB —— 二二得四，除以五，零点八。刚才量出来的那个数，就是这么来的。',
      cite: '在 OB 上取 C，使 OC = r²/OB = 4/5 = 0.8',
      add: [cC2, nC2, sPC2].concat(led(p2)(['在 OB 上取 C', 'OC = r²/OB = 4/5 = 0.8'])),
      front: lift2
    },
    {
      say: '现在看两个比值。OP 比 OB，二比五；OC 比 OP，零点八比二，也是二比五。两组边成比例。',
      cite: 'OP/OB = 2/5，OC/OP = 0.8/2 = 2/5 —— 两组对应边成比例',
      add: [sOP2].concat(led(p2)(['OP/OB = 2/5', 'OC/OP = 0.8/2 = 2/5'])),
      front: lift2
    },
    {
      say: '再看夹角。两个三角形共用 O 这个顶点，夹角都是 ∠POC 和 ∠BOP —— 同一个角，公共的。',
      cite: '公共角：∠POC = ∠BOP',
      add: [AN.arc('warcO', O, P, B, 40, COL.ORANGE)]
        .concat(led(p2)(['∠POC = ∠BOP（同一个角）', '夹角相等'])),
      front: lift2
    },
    {
      say: '两组边成比例，夹角又相等 —— 边角边，两个三角形相似。小的那个是 △OPC，大的那个是 △OBP。',
      cite: 'SAS 相似：OP/OB = OC/OP 且 ∠POC = ∠BOP ⟹ △OPC ∽ △OBP',
      add: [fOPC, fOBP].concat(led(p2)(['△OPC ∽ △OBP（SAS）', '边成比例 + 夹角相等'])),
      front: lift2
    },
    {
      say: '相似比是二比五，所以 PC 比 PB 也是二比五。换句话说，PC 就等于五分之二个 PB —— 正是我们要换掉的那一块。',
      cite: '相似性质：PC/PB = OP/OB = 2/5 ⟹ PC = (2/5)PB',
      add: [AN.tick('wtkPC', P, C, COL.GREEN), AN.tick('wtkPB', P, B, COL.GREEN)]
        .concat(led(p2)(['PC/PB = 2/5', '⟹ PC = (2/5)·PB ✓'])),
      front: lift2
    },
    {
      say: '代回去：PA 加上五分之二的 PB，就是 PA 加上 PC。系数被消灭了，现在只剩两条没有系数的线段，而且它们的另一个端点 C 是固定的。',
      cite: '等量代换：PA + (2/5)PB = PA + PC',
      add: led(p2)(['PA + (2/5)PB = PA + PC', '系数没了，只剩两段']),
      front: lift2
    },
    {
      say: 'A 是定点，C 也是定点，P 在中间。三角形两边之和大于第三边：PA 加 PC，永远不小于 AC。',
      cite: '三角不等式：PA + PC ≥ AC',
      add: led(p2)(['PA + PC ≥ AC', '三角形两边之和 > 第三边']),
      front: lift2
    },
    {
      say: '能不能取到等号？只要 P 落在 AC 这条线段上就行。C 在圆内 —— 零点八小于半径二；A 在圆外 —— 六点零五大于半径二。一线段从内到外，必然穿过圆一次，所以那个点一定存在，而且只有一个。',
      cite: '等号条件：P 在 AC 上；C 在圆内、A 在圆外 ⟹ AC 与圆恰交于一点 P₀',
      add: led(p2)(['C 在圆内，A 在圆外', '⟹ AC 与圆恰交一点 P₀，等号可取']),
      front: lift2
    },
    {
      say: '最后算 AC。A 和 C 一样高，横向就是六格 —— 半径二、OB 五、OC 零点八，画出来一量正好是六。所以最小值就是六，取到它的那个点，就是 AC 和圆的交点。',
      cite: 'AC = 6 ⟹ min(PA + (2/5)PB) = 6，等号在 P₀ = AC ∩ 圆',
      add: [hAC2].concat(led(p2)(['AC = 6', '⟹ min = 6 ✓'])),
      front: lift2,
      eq: 'min(PA + (2/5)PB) = AC = 6'
    }
  ];

  window.MATHLAB_LESSONS = window.MATHLAB_LESSONS || [];
  window.MATHLAB_LESSONS.push({
    id: 'apollonius-circle',
    title: '阿氏圆：圆上一动点，PA + (2/5)PB 的最小值',
    grade: '初三',
    topic: '几何 · 最值',
    tags: ['最值', '动点', '阿氏圆', '阿波罗尼斯圆', '相似', '三角不等式', '构造'],
    question: '⊙O 的半径为 2，B 在射线 OB 上且 OB = 5，A 是圆外一定点（AC 方向距 C 6 格，C 在 OB 上且 OC = 0.8）。P 是圆上一动点，求 PA + (2/5)PB 的最小值。',
    thumbStep: 6,
    methods: [
      { name: '量一量：谷底在哪', tier: 'demo', steps: steps1 },
      { name: '相似构造：把系数换掉', tier: 'proof', steps: steps2 }
    ]
  });
})();
