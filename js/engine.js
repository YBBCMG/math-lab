/* ============================================================
   MathLab 动画引擎
   ------------------------------------------------------------
   设计原则：每道题的讲解 = 一连串「步骤」，每个步骤只做一件事。
   步骤里用 add / upd / del 描述画面变化，引擎负责补间。

   坐标系：viewBox 用户单位，y 轴向下（SVG 原生）。
   角度：数学惯例，0° 指向右，逆时针增大（内部自动翻转 y）。
   ============================================================ */
(function (global) {
  'use strict';

  var NS = 'http://www.w3.org/2000/svg';
  var D2R = Math.PI / 180;

  /* ---------- 小工具 ---------- */

  function mk(tag) { return document.createElementNS(NS, tag); }

  // 极坐标取点：deg 按数学惯例（逆时针为正）
  function pt(cx, cy, r, deg) {
    return [cx + r * Math.cos(deg * D2R), cy - r * Math.sin(deg * D2R)];
  }

  function n(v) {
    return Math.abs(v) < 1e-9 ? 0 : Math.round(v * 1000) / 1000;
  }

  function ptsToStr(pts) {
    return pts.map(function (p) { return n(p[0]) + ',' + n(p[1]); }).join(' ');
  }

  /* ---------- 图形生成 ---------- */

  // 统一「从 from 到 to 逆时针走哪一端」：
  // 旧版直接取 Math.abs(to-from) 当跨度，遇到跨 0° 的角（330° → 90°）会算出 240°，
  // large-arc-flag 被置 1，画出一个绕远路的大圈——2026-11-11 手拉手模型里暴露。
  // 现在一律：先算逆时针跨度，超过 180° 就掉头用另一侧的补角。
  function arcSpan(from, to) {
    var span = normDeg(to - from);
    if (span > 180) return { from: to, to: from, span: 360 - span };
    return { from: from, to: to, span: span };
  }

  // 扇形路径：圆心 c，半径 r，从 from 到 to（逆时针）
  function sectorPath(c, r, from, to) {
    var w = arcSpan(from, to);
    var a = pt(c[0], c[1], r, w.from);
    var b = pt(c[0], c[1], r, w.to);
    var large = w.span > 180 ? 1 : 0;
    // SVG 中 y 向下，数学逆时针 = sweep-flag 0
    return 'M' + n(c[0]) + ',' + n(c[1]) +
      ' L' + n(a[0]) + ',' + n(a[1]) +
      ' A' + n(r) + ',' + n(r) + ' 0 ' + large + ' 0 ' + n(b[0]) + ',' + n(b[1]) + ' Z';
  }

  // 弧线路径（不填充）
  function arcPath(c, r, from, to) {
    var w = arcSpan(from, to);
    var a = pt(c[0], c[1], r, w.from);
    var b = pt(c[0], c[1], r, w.to);
    var large = w.span > 180 ? 1 : 0;
    return 'M' + n(a[0]) + ',' + n(a[1]) +
      ' A' + n(r) + ',' + n(r) + ' 0 ' + large + ' 0 ' + n(b[0]) + ',' + n(b[1]);
  }

  /* ---------- 元素构造 ---------- */

  function buildShape(spec) {
    var el, k = spec.k;

    switch (k) {
      case 'poly':
        el = mk('polygon');
        el.setAttribute('points', ptsToStr(spec.pts));
        break;

      case 'line':
        el = mk('line');
        el.setAttribute('x1', n(spec.a[0])); el.setAttribute('y1', n(spec.a[1]));
        el.setAttribute('x2', n(spec.b[0])); el.setAttribute('y2', n(spec.b[1]));
        break;

      case 'circ':
        el = mk('circle');
        el.setAttribute('cx', n(spec.c[0])); el.setAttribute('cy', n(spec.c[1]));
        el.setAttribute('r', n(spec.r == null ? 5 : spec.r));
        break;

      case 'rect':
        el = mk('rect');
        el.setAttribute('x', n(spec.x)); el.setAttribute('y', n(spec.y));
        el.setAttribute('width', n(spec.w)); el.setAttribute('height', n(spec.h));
        break;

      case 'sector':
        el = mk('path');
        el.setAttribute('d', sectorPath(spec.c, spec.r, spec.from, spec.to));
        break;

      case 'arc':
        el = mk('path');
        el.setAttribute('d', arcPath(spec.c, spec.r, spec.from, spec.to));
        break;

      case 'path':
        el = mk('path');
        el.setAttribute('d', spec.d);
        break;

      case 'text':
        el = mk('text');
        el.setAttribute('x', n(spec.at[0]));
        el.setAttribute('y', n(spec.at[1]));
        el.setAttribute('text-anchor', spec.anchor || 'middle');
        el.setAttribute('dominant-baseline', 'central');
        el.textContent = spec.text;
        break;

      default:
        el = mk('g');
    }

    return el;
  }

  function paint(el, spec) {
    var s = el.style;
    var fill = spec.fill === undefined ? 'none' : spec.fill;
    var stroke = spec.stroke === undefined ? 'none' : spec.stroke;

    s.fill = fill;
    s.stroke = stroke;

    if (stroke !== 'none') {
      s.strokeWidth = (spec.sw == null ? 2 : spec.sw) + 'px';
      s.strokeLinejoin = 'round';
      s.strokeLinecap = 'round';
      if (spec.dash) s.strokeDasharray = spec.dash.join(' ');
      else s.strokeDasharray = '';
    }

    // 注意：透明度只在 <g> 上设一次（见 Stage.add / Stage.upd）。
    // 这里若再设一次，两层会相乘：op=0.3 会被渲染成 0.09，整站发白。
    // 历史 bug：2026-11-11 定位，症状是「所有色块都淡淡的、看不清楚」。

    if (spec.k === 'text') {
      s.fontSize = (spec.size || 16) + 'px';
      s.fontWeight = spec.weight || 600;
      if (fill === 'none') s.fill = '#152034';
      // 白色描边光晕：文字压在鲜艳色块上也要读得清。
      // （配色变鲜艳之后，蓝底蓝字会糊成一片——用 paint-order 把描边压到填色后面）
      if (spec.halo === false) {
        s.stroke = 'none';
        s.strokeWidth = '0';
      } else {
        s.stroke = '#ffffff';
        s.strokeWidth = (spec.size >= 20 ? 4.5 : 3.5) + 'px';
        s.strokeLinejoin = 'round';
        s.strokeLinecap = 'round';
        s.paintOrder = 'stroke';
      }
    }
  }

  function tfString(spec) {
    var parts = [];
    var mv = spec.move || [0, 0];
    if (mv[0] || mv[1]) parts.push('translate(' + n(mv[0]) + 'px,' + n(mv[1]) + 'px)');

    if (spec.rot) {
      var o = spec.origin || [0, 0];
      // 注意：讲稿里的 rot 是数学角（逆时针为正），而 CSS rotate 在屏幕上是顺时针为正，
      // 所以要取负号。tft 教训级别的坑：不取负，所有拼接旋转都会反着转。
      parts.push('translate(' + n(o[0]) + 'px,' + n(o[1]) + 'px) rotate(' + n(-spec.rot) + 'deg) translate(' + n(-o[0]) + 'px,' + n(-o[1]) + 'px)');
    }
    if (spec.scale != null && spec.scale !== 1) {
      var o2 = spec.origin || [0, 0];
      parts.push('translate(' + n(o2[0]) + 'px,' + n(o2[1]) + 'px) scale(' + spec.scale + ') translate(' + n(-o2[0]) + 'px,' + n(-o2[1]) + 'px)');
    }
    return parts.length ? parts.join(' ') : 'none';
  }

  /* ---------- 舞台 ---------- */

  function Stage(svg) {
    this.svg = svg;
    this.layer = svg.querySelector('[data-layer]') || svg;
    this.colors = {}; // id -> spec（保留最近一次 spec，便于 upd 只改局部）
    this.nodes = {};
  }

  Stage.prototype.clear = function () {
    while (this.layer.firstChild) this.layer.removeChild(this.layer.firstChild);
    this.colors = {};
    this.nodes = {};
  };

  // animate=false 时禁用过渡
  Stage.prototype.instant = function (fn) {
    this.svg.classList.add('ml-instant');
    fn.call(this);
    // 强制回流，保证 transition:none 生效
    void this.svg.getBoundingClientRect();
    var self = this;
    requestAnimationFrame(function () { self.svg.classList.remove('ml-instant'); });
  };

  Stage.prototype.add = function (spec, animate) {
    // 同 id 重复添加视为替换，避免残影
    if (this.nodes[spec.id]) {
      var old = this.nodes[spec.id];
      if (old.parentNode) old.parentNode.removeChild(old);
    }
    var g = mk('g');
    g.setAttribute('class', 'ml-el');
    // 把讲稿里的 id 落到 DOM 上：验收脚本靠它取"页面上真实渲染出来的几何"，
    // 而不是回头去读讲稿源码（读源码等于自己证明自己）。
    if (spec.id) g.setAttribute('data-id', String(spec.id));
    var shape = buildShape(spec);
    paint(shape, spec);
    g.appendChild(shape);
    g.style.transform = tfString(spec);
    g.style.opacity = spec.op == null ? 1 : spec.op;

    if (animate) {
      // 新元素默认淡入 + 微缩放
      g.style.opacity = 0;
    }

    this.layer.appendChild(g);
    this.nodes[spec.id] = g;
    this.colors[spec.id] = Object.assign({}, spec);

    if (animate) {
      var self = this;
      requestAnimationFrame(function () {
        g.style.opacity = self.colors[spec.id].op == null ? 1 : self.colors[spec.id].op;
      });
    }
    return g;
  };

  Stage.prototype.upd = function (patch) {
    var g = this.nodes[patch.id];
    if (!g) return;
    var spec = this.colors[patch.id];
    var next = Object.assign({}, spec, patch);
    this.colors[patch.id] = next;

    // transform / opacity 走 CSS 过渡
    if ('move' in patch || 'rot' in patch || 'scale' in patch) {
      g.style.transform = tfString(next);
    }
    if ('op' in patch) g.style.opacity = patch.op;

    // 颜色 / 线宽等直接改子节点样式
    var shape = g.firstChild;
    if (shape && shape.style) paint(shape, next);
  };

  // 立即移除，不做淡出。
  // 用于「整张图换一张」：淡出 + 淡入会重叠成一团，读数会糊；这种场合要瞬切。
  Stage.prototype.rip = function (id) {
    var g = this.nodes[id];
    if (!g) return;
    if (g.parentNode) g.parentNode.removeChild(g);
    delete this.nodes[id];
    delete this.colors[id];
  };

  // 把已有元素提到最上层：加半透明色块时，底下那条高线/直角符号会被盖淡，
  // 用 front 把它们顶回最前面（不能走 add 重建，那会触发一次淡入闪烁）。
  Stage.prototype.front = function (id) {
    var g = this.nodes[id];
    if (g && g.parentNode) g.parentNode.appendChild(g);
  };

  Stage.prototype.del = function (id) {
    var g = this.nodes[id];
    if (!g) return;
    g.style.opacity = 0;
    var self = this;
    setTimeout(function () {
      if (g.parentNode) g.parentNode.removeChild(g);
    }, 420);
    delete this.nodes[id];
    delete this.colors[id];
  };

  /* ---------- 步骤执行 ---------- */

  function applyStep(stage, step, animate) {
    var run = function () {
      if (step.delNow) step.delNow.forEach(function (id) { stage.rip(id); });
      if (step.del) step.del.forEach(function (id) { stage.del(id); });
      if (step.upd) step.upd.forEach(function (u) { stage.upd(u); });
      if (step.add) step.add.forEach(function (s) { stage.add(s, animate); });
      if (step.front) step.front.forEach(function (id) { stage.front(id); });
    };
    if (animate) run(); else stage.instant(run);
  }

  /* ---------- 几何计算（讲稿里一律用它算，绝不手填数值） ---------- */

  // 从 from 看向 to 的数学方向角（度，逆时针为正，y 轴向上）
  function angOf(from, to) {
    return Math.atan2(-(to[1] - from[1]), to[0] - from[0]) / D2R;
  }

  function normDeg(d) {
    var x = d % 360;
    return x < 0 ? x + 360 : x;
  }

  // 顶点 V 处，由 V→X、V→Y 两条边张成的角。
  // 返回 { from, to, deg }，保证 from→to 逆时针跨过 deg（0~180）
  function wedge(V, X, Y) {
    var a = normDeg(angOf(V, X));
    var b = normDeg(angOf(V, Y));
    var span = normDeg(b - a);
    if (span > 180) return { from: b, to: a, deg: 360 - span };
    return { from: a, to: b, deg: span };
  }

  // 角平分线方向的单位参考点：用于放标签
  function midDir(w) {
    return w.from + w.deg / 2;
  }

  function round1(v) { return Math.round(v * 10) / 10; }

  /* ---------- 公开 API ---------- */

  global.ML = {
    pt: pt,
    angOf: angOf,
    normDeg: normDeg,
    wedge: wedge,
    midDir: midDir,
    round1: round1,
    sectorPath: sectorPath,
    arcPath: arcPath,
    Stage: Stage,
    applyStep: applyStep,

    // 小尺寸静态缩略图：把前 upto 步一次性画完（默认只画第 1 步）
    thumb: function (svg, steps, upto) {
      var st = new Stage(svg);
      st.clear();
      st.instant(function () {
        var n = Math.min(upto == null ? 0 : upto, steps.length - 1);
        for (var i = 0; i <= n; i++) applyStep(st, steps[i], false);
      });
      return st;
    }
  };
})(window);
