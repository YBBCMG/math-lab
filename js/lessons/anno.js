/* ============================================================
   标注工具箱（几何讲稿共用）
   ------------------------------------------------------------
   2026-11-11 用户反馈「标注难看」，据此把规范定死，所有讲稿共用：

     · 顶点字母：沿「重心 → 顶点」方向外推固定距离，坐标算出来，不许手填
     · 等长关系：边中点画一道垂直短横线（tick），不重复写字母
     · 直角符号：统一边长 14px
     · 字号三档：顶点 22 / 边 21 / 说明 17
     · 图形外空白处的字母关掉白色描边（halo:false）；压在色块上的保留

   这个文件不走 manifest（它不产出一道题），由 index.html / lesson.html
   在载入题库之前直接 <script> 引入。
   ============================================================ */
(function (global) {
  'use strict';

  var COL = {
    INK: '#16202f',      // 正文墨色
    EDGE: '#1f3a68',     // 图形边
    FILL: '#eef1f7',     // 底色（中性灰白：叠蓝不发紫，叠绿不发青）
    RED: '#e11d48',      // 待证 / 关键线
    BLUE: '#2563eb',     // 第一组
    GREEN: '#0f9d58',    // 全等 / 相等
    ORANGE: '#c2410c',   // 第二组
    TEAL: '#0e7490',     // 辅助
    PURPLE: '#7c3aed',   // 第三组
    GREY: '#93a1b5'      // 延长线 / 辅助线
  };

  var FS = { V: 22, SIDE: 21, NOTE: 17, TINY: 15 };
  var D2R = Math.PI / 180;

  /* ---------- 向量 ---------- */
  function sub(p, q) { return [p[0] - q[0], p[1] - q[1]]; }
  function add(p, q) { return [p[0] + q[0], p[1] + q[1]]; }
  function mul(p, k) { return [p[0] * k, p[1] * k]; }
  function len(p) { return Math.sqrt(p[0] * p[0] + p[1] * p[1]); }
  function unit(p) { var L = len(p) || 1; return [p[0] / L, p[1] / L]; }
  function mid(p, q) { return [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2]; }
  function dist(p, q) { return len(sub(p, q)); }
  function nf(v) { return Math.abs(v) < 1e-9 ? 0 : Math.round(v * 100) / 100; }
  // 把点沿某方向推一段
  function along(P, dir, d) { return add(P, mul(unit(dir), d)); }

  /* ---------- 文本 ---------- */

  // 顶点字母：从重心 O 指向顶点 V 再外推 d，永远落在图形外侧
  // 显示字母 = id 去掉前缀 v/w（多方法讲稿靠前缀区分同名顶点）
  function vname(id, V, O, d) {
    var p = along(V, sub(V, O), d == null ? 30 : d);
    return { id: id, k: 'text', at: p, text: id.replace(/^[vw]/, ''), size: FS.V, fill: COL.INK, weight: 700, halo: false };
  }

  // 普通文字（默认外面的字不描边）
  function txt(id, at, text, o) {
    o = o || {};
    return {
      id: id, k: 'text', at: at, text: text,
      size: o.size || FS.NOTE,
      fill: o.color || COL.INK,
      weight: o.weight || 600,
      anchor: o.anchor || 'middle',
      halo: o.halo === true
    };
  }

  // 说明块：多行左对齐，行距 28
  function block(id, at, lines, o) {
    o = o || {};
    return lines.map(function (t, i) {
      return {
        id: id + i, k: 'text', at: [at[0], at[1] + i * (o.lh || 28)], text: t,
        size: o.size || FS.NOTE, fill: o.color || COL.INK, weight: o.weight || 600,
        anchor: o.anchor || 'start', halo: o.halo === true
      };
    });
  }

  /* ---------- 记号 ---------- */

  // 等长记号：X、Y 中点处，垂直于该边的一道短横线
  function tick(id, X, Y, color, half, shift) {
    var u = unit(sub(Y, X));
    var w = [-u[1], u[0]];
    var m = mid(X, Y);
    if (shift) m = add(m, mul(u, shift));    // 双杠时错开一点
    var h = half == null ? 9 : half;
    return { id: id, k: 'line', a: add(m, mul(w, -h)), b: add(m, mul(w, h)), stroke: color, sw: 3.2 };
  }

  // 直角符号：从 V 沿 u、w 两个单位方向各走 s，画出方角
  function right(id, V, u, w, s, color) {
    var p1 = add(V, mul(unit(u), s));
    var p2 = add(p1, mul(unit(w), s));
    var p3 = add(V, mul(unit(w), s));
    return {
      id: id, k: 'path',
      d: 'M' + nf(p1[0]) + ',' + nf(p1[1]) + ' L' + nf(p2[0]) + ',' + nf(p2[1]) + ' L' + nf(p3[0]) + ',' + nf(p3[1]),
      stroke: color, sw: 2
    };
  }

  // 角：弧 + 文字（文字放在角平分线方向上，不手填方位角）
  function angle(id, V, X, Y, r, color, text, o) {
    o = o || {};
    var w = global.ML.wedge(V, X, Y);
    var out = [{
      id: id, k: 'arc', c: V, r: r, from: w.from, to: w.to,
      stroke: color, sw: o.sw == null ? 2.2 : o.sw
    }];
    if (text) {
      // o.dir 可强制指定标签方位角（角平分线方向会压到别的线时用）
      var labDir = o.dir == null ? global.ML.midDir(w) : o.dir;
      out.push(txt(id + 't', global.ML.pt(V[0], V[1], r + (o.gap == null ? 27 : o.gap), labDir),
        text, { size: o.size || FS.NOTE, color: color, halo: o.halo !== false }));
    }
    return out;
  }

  // 只要弧，不带字
  function arc(id, V, X, Y, r, color, sw) {
    var w = global.ML.wedge(V, X, Y);
    return { id: id, k: 'arc', c: V, r: r, from: w.from, to: w.to, stroke: color, sw: sw == null ? 2.2 : sw };
  }

  // 色块填充（rgba，不动描边）
  function wash(rgb, a) {
    return 'rgba(' + rgb + ',' + a + ')';
  }

  global.ANNO = {
    COL: COL, FS: FS,
    sub: sub, add: add, mul: mul, len: len, unit: unit, mid: mid, dist: dist, nf: nf, along: along,
    vname: vname, txt: txt, block: block,
    tick: tick, right: right, angle: angle, arc: arc, wash: wash,
    D2R: D2R
  };
})(window);
