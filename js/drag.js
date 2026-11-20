/* ============================================================
   拖动探索层 —— 讲解走完之后，主动点可以真的用手指/鼠标拖，
   从动点和所有派生图形实时跟着走，走过的轨迹当场描出来。

   为什么单独一层：
     引擎只认「步骤 → 画面」，它假设画面是确定的、一步一个结果。
     拖动是「参数 → 画面」，同一帧里几十次更新，套不进 applyStep。
     所以约定一个新的可选字段 drag，由本文件消费，
     engine.js / lesson.js 都不用为它改结构（引擎只多了一个 Stage.live）。

   课程侧声明（都可不给）：
     drag: {
       handle: 'pP1',                 // 要抓的那个点的元素 id（在末步时必须已渲染）
       rail: { a: [x,y], b: [x,y] },  // 只许沿这条线段滑；不给就是自由拖
       hint: '拖动 P，看 Q 跟着跑',     // 提示条文案
       start: [x, y],                 // 初始位置，给了才出现「回到起点」按钮
       onDrag: function (P, ctx) {    // 每帧调用；返回要就地更新的元素 spec 数组
         ...
         return [ {id:'pP1', k:'circ', c:P, ...}, ... ];
       }
     }

   ctx = {
     reset : 这一帧是不是本轮拖动的第一帧（该清空轨迹了）
     trail : 历史轨迹点（数组；课程自己 push，用来画痕迹线）
     push  : function (p) → 记一个轨迹点，太近会自动忽略（返回是否记下）
     stage : 当前舞台，需要 delNow 之类可以直接用
   }

   设计纪律：
     onDrag 必须是纯函数（P 进、spec 出）。它会被一帧调一次，
     任何「累加自己」的写法都会在拖动中失控 —— 唯一允许的状态是 ctx.trail。
   ============================================================ */
(function (global) {
  'use strict';

  var HIT = 30;        // 命中半径（viewBox 用户单位，30 ≈ 屏幕上 20px）
  var MIN_STEP = 2.6;  // 轨迹采样最小间距，防原地抖动堆成一坨

  /* ---------- 坐标：屏幕 → viewBox 用户单位 ---------- */
  // 不用手算 preserveAspectRatio 的映射：祖先若有 CSS transform，
  // 手算全错、getScreenCTM 全对。它把「像素」和「用户单位」的正确桥一次给全。

  function toLocal(svg, clientX, clientY) {
    var ctm = svg.getScreenCTM && svg.getScreenCTM();
    if (ctm) {
      try {
        var p = svg.createSVGPoint();
        p.x = clientX; p.y = clientY;
        var q = p.matrixTransform(ctm.inverse());
        return { x: q.x, y: q.y };
      } catch (e) { /* 落到手算兜底 */ }
    }

    var r = svg.getBoundingClientRect();
    var vb = svg.viewBox && svg.viewBox.baseVal;
    if (!r.width || !r.height || !vb || !vb.width) return null;
    var s = Math.min(r.width / vb.width, r.height / vb.height);
    var ox = r.left + (r.width - vb.width * s) / 2;
    var oy = r.top + (r.height - vb.height * s) / 2;
    return { x: (clientX - ox) / s, y: (clientY - oy) / s };
  }

  /* ---------- 把点压到轨道上 ---------- */

  function project(P, rail) {
    var A = rail.a, B = rail.b;
    var dx = B[0] - A[0], dy = B[1] - A[1];
    var L2 = dx * dx + dy * dy;
    if (!L2) return [A[0], A[1]];
    var t = ((P[0] - A[0]) * dx + (P[1] - A[1]) * dy) / L2;
    if (rail.clamp !== false) t = Math.max(0, Math.min(1, t));
    return [A[0] + dx * t, A[1] + dy * t];
  }

  /* ---------- 从舞台里读这个点现在在哪 ---------- */

  function handleAt(stage, id) {
    var s = stage.colors[id];
    if (!s) return null;
    if (s.c) return [s.c[0], s.c[1]];            // circ
    if (s.at) return [s.at[0], s.at[1]];         // text
    if (s.a) return [s.a[0], s.a[1]];            // line 起点
    if (s.pts && s.pts.length) return s.pts[0];
    return null;
  }

  /* ---------- 控制器 ---------- */

  function Controller(svg, stage, cfg) {
    this.svg = svg;
    this.stage = stage;
    this.cfg = cfg;
    this.active = false;
    this.dragging = false;
    this.trail = [];
    this.raf = 0;
    this.queued = null;

    this.hint = makeHint(cfg, this);
    var host = svg.parentNode;
    if (host) {
      if (global.getComputedStyle && global.getComputedStyle(host).position === 'static') {
        host.style.position = 'relative';
      }
      host.appendChild(this.hint);
    }

    this._bind();
  }

  function makeHint(cfg, ctrl) {
    var d = document.createElement('div');
    d.className = 'ml-drag-hint';
    d.style.display = 'none';

    var t = document.createElement('b');
    t.textContent = cfg.hint || '拖动这个点试试';
    d.appendChild(t);

    if (cfg.start) {
      var b = document.createElement('button');
      b.type = 'button';
      b.textContent = '回到起点';
      b.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        ctrl.trail = [];
        ctrl._apply(cfg.start.slice(), true);
        ctrl.moved = false;
        if (t) t.textContent = cfg.hint || '拖动这个点试试';
      });
      d.appendChild(b);
    } else {
      d.style.pointerEvents = 'none';
    }
    return d;
  }

  Controller.prototype._bind = function () {
    var self = this;

    this._down = function (e) {
      if (!self.active || e.button > 0) return;
      var P = toLocal(self.svg, e.clientX, e.clientY);
      if (!P) return;
      var H = handleAt(self.stage, self.cfg.handle);
      if (!H) return;
      var dx = P.x - H[0], dy = P.y - H[1];
      if (dx * dx + dy * dy > HIT * HIT) return;

      e.preventDefault();
      self.dragging = true;
      self.moved = false;
      self.trail = [];
      try { self.svg.setPointerCapture(e.pointerId); } catch (err) { /* 老浏览器没有 */ }
      self.svg.classList.add('ml-dragging');
      self._apply([P.x, P.y], true);
    };

    this._move = function (e) {
      if (!self.dragging) return;
      var P = toLocal(self.svg, e.clientX, e.clientY);
      if (!P) return;
      self.queued = [P.x, P.y];
      // 一帧只算一次：pointermove 在 120Hz 鼠标上会翻倍，白跑
      if (!self.raf) {
        self.raf = global.requestAnimationFrame(function () {
          self.raf = 0;
          if (!self.dragging || !self.queued) return;
          var q = self.queued;
          self.queued = null;
          self._apply(q, false);
        });
      }
    };

    this._up = function (e) {
      if (!self.dragging) return;
      self.dragging = false;
      self.queued = null;
      try { self.svg.releasePointerCapture(e.pointerId); } catch (err) { /* 忽略 */ }
      self.svg.classList.remove('ml-dragging');
    };

    this.svg.addEventListener('pointerdown', this._down);
    this.svg.addEventListener('pointermove', this._move);
    this.svg.addEventListener('pointerup', this._up);
    this.svg.addEventListener('pointercancel', this._up);
    this.svg.addEventListener('pointerleave', this._up);
  };

  Controller.prototype._apply = function (P, reset) {
    var cfg = this.cfg;
    if (cfg.rail) P = project(P, cfg.rail);
    if (reset) this.trail = [];

    var self = this;
    var ctx = {
      reset: !!reset,
      stage: this.stage,
      trail: this.trail,
      push: function (p) {
        var last = self.trail[self.trail.length - 1];
        if (last) {
          var dx = p[0] - last[0], dy = p[1] - last[1];
          if (dx * dx + dy * dy < MIN_STEP * MIN_STEP) return false;
        }
        self.trail.push(p);
        return true;
      }
    };

    var out = cfg.onDrag(P, ctx);
    if (out) {
      for (var i = 0; i < out.length; i++) {
        if (out[i] && out[i].id) this.stage.live(out[i]);
      }
    }
    this.moved = true;
    return P;
  };

  Controller.prototype.setActive = function (on) {
    on = !!on;
    this.active = on;
    this.svg.classList.toggle('ml-drag-on', on);
    this.hint.style.display = on ? '' : 'none';
    if (!on) {
      this.dragging = false;
      this.svg.classList.remove('ml-dragging');
    }
  };

  Controller.prototype.destroy = function () {
    this.svg.removeEventListener('pointerdown', this._down);
    this.svg.removeEventListener('pointermove', this._move);
    this.svg.removeEventListener('pointerup', this._up);
    this.svg.removeEventListener('pointercancel', this._up);
    this.svg.removeEventListener('pointerleave', this._up);
    if (this.hint.parentNode) this.hint.parentNode.removeChild(this.hint);
    this.svg.classList.remove('ml-drag-on', 'ml-dragging');
  };

  /* ---------- 对外的唯一入口 ---------- */

  var KEY = '__mlDragCtrl';

  function sync(svg, stage, cfg, active) {
    var ctrl = svg && svg[KEY];

    // 本解法没配拖动（或换了有个没配的解法）→ 把上一个控制器关掉。
    // 忘了这一步的症状：切到「证明」档，提示条还赖在画面上不走。
    if (!cfg || !cfg.onDrag || !cfg.handle) {
      if (ctrl) ctrl.setActive(false);
      return null;
    }

    if (!ctrl || ctrl.cfg !== cfg) {
      if (ctrl) ctrl.destroy();
      ctrl = svg[KEY] = new Controller(svg, stage, cfg);
    }
    ctrl.stage = stage;
    ctrl.trail = [];                       // 每次换步都从干净轨迹开始
    ctrl.setActive(active);
    return ctrl;
  }

  global.MLDRAG = { sync: sync, toLocal: toLocal, project: project, HIT: HIT };
})(window);
