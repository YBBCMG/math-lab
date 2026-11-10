/* 讲解播放器：解法切换 / 逐步前进后退 / 自动播放 / 速度 / 音效开关 */
(function () {
  'use strict';

  /* ---------- 找题 ---------- */
  var lessons = window.MATHLAB_LESSONS || [];
  var m = location.search.match(/[?&]id=([^&]*)/);
  var wantId = m ? decodeURIComponent(m[1]) : '';
  var lesson = null;
  for (var i = 0; i < lessons.length; i++) if (lessons[i].id === wantId) lesson = lessons[i];
  if (!lesson) lesson = lessons[0];

  var $ = function (id) { return document.getElementById(id); };

  if (!lesson) {
    $('title').textContent = '题库还是空的';
    $('question').textContent = '先往 js/lessons/ 里加一道题吧。';
    return;
  }

  document.title = lesson.title + ' · 秒懂数学';
  $('title').textContent = lesson.title;
  $('question').textContent = lesson.question || '';

  var meta = $('meta');
  [['grade', lesson.grade], ['', lesson.topic]].forEach(function (p) {
    if (!p[1]) return;
    var s = document.createElement('span');
    s.className = 'tag ' + p[0];
    s.textContent = p[1];
    meta.appendChild(s);
  });

  /* ---------- 音效（默认关，可开） ---------- */
  var Sfx = (function () {
    var ctx = null;
    var on = false;
    try { on = localStorage.getItem('mathlab.sfx') === '1'; } catch (e) {}
    function ac() {
      if (!ctx) {
        var C = window.AudioContext || window.webkitAudioContext;
        if (!C) return null;
        ctx = new C();
      }
      return ctx;
    }
    return {
      isOn: function () { return on; },
      toggle: function () {
        on = !on;
        try { localStorage.setItem('mathlab.sfx', on ? '1' : '0'); } catch (e) {}
        if (on) this.blip(0);
        return on;
      },
      blip: function (n) {
        if (!on) return;
        try {
          var c = ac();
          if (!c) return;
          var t = c.currentTime;
          var o = c.createOscillator(), g = c.createGain();
          o.type = 'sine';
          o.frequency.value = 500 + (n % 5) * 70;
          g.gain.setValueAtTime(0.0001, t);
          g.gain.exponentialRampToValueAtTime(0.10, t + 0.012);
          g.gain.exponentialRampToValueAtTime(0.0001, t + 0.17);
          o.connect(g); g.connect(c.destination);
          o.start(t); o.stop(t + 0.19);
        } catch (e) {}
      }
    };
  })();

  /* ---------- 状态 ---------- */
  var svg = $('stage');
  var stage = new ML.Stage(svg);
  var st = { mi: 0, si: 0, playing: false, speed: 1, timer: null };

  function list() { return lesson.methods[st.mi].steps; }
  function step() { return list()[st.si]; }

  /* ---------- 渲染 ---------- */

  function renderMethods() {
    var box = $('methods');
    box.innerHTML = '';
    lesson.methods.forEach(function (mt, k) {
      var b = document.createElement('button');
      b.className = k === st.mi ? 'on' : '';
      b.innerHTML = '<span class="idx">' + (k + 1) + '</span><span>' +
        escapeHtml(mt.name) + (mt.sub ? '<span class="sub">' + escapeHtml(mt.sub) + '</span>' : '') +
        '</span>';
      b.addEventListener('click', function () {
        if (k === st.mi) return;
        st.mi = k;
        st.si = 0;
        renderMethods();
        renderSteps();
        goStep(0, false);
        if (st.playing) schedule();
      });
      box.appendChild(b);
    });
  }

  function renderSteps() {
    var box = $('steps');
    box.innerHTML = '';
    list().forEach(function (s, k) {
      var b = document.createElement('button');
      b.innerHTML = '<span class="sn">' + (k + 1) + '</span><span>' + escapeHtml(shorten(s.say)) + '</span>';
      b.addEventListener('click', function () {
        stop();
        goStep(k, true);
      });
      box.appendChild(b);
    });
  }

  function paint() {
    var s = step();
    $('sn').textContent = st.si + 1;

    var say = $('say');
    say.textContent = s.say || '';
    say.style.animation = 'none';
    void say.offsetWidth;
    say.style.animation = '';

    var why = $('why');
    why.textContent = s.why || '';
    why.style.display = s.why ? 'block' : 'none';

    $('eq').textContent = s.eq || '';

    var bs = $('steps').children;
    for (var k = 0; k < bs.length; k++) {
      bs[k].classList.toggle('on', k === st.si);
      bs[k].classList.toggle('done', k < st.si);
    }
    // 只滚列表面板内部，别把整个文档带着滚（否则标题会被顶出屏幕）
    var box = $('steps');
    var on = bs[st.si];
    if (on) {
      var bb = box.getBoundingClientRect(), rb = on.getBoundingClientRect();
      if (rb.top < bb.top) box.scrollTop += rb.top - bb.top;
      else if (rb.bottom > bb.bottom) box.scrollTop += rb.bottom - bb.bottom;
    }

    $('bar').style.width = ((st.si + 1) / list().length * 100) + '%';
    $('prev').disabled = st.si === 0;
    $('next').disabled = st.si === list().length - 1;
  }

  function escapeHtml(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c];
    });
  }
  function shorten(s) {
    s = String(s || '');
    return s.length > 26 ? s.slice(0, 26) + '…' : s;
  }

  /* ---------- 播放 ---------- */

  function goStep(k, animate) {
    var L = list();
    if (k < 0) k = 0;
    if (k > L.length - 1) k = L.length - 1;
    st.si = k;

    stage.clear();
    svg.classList.add('ml-instant');
    for (var j = 0; j < k; j++) ML.applyStep(stage, L[j], false);
    void svg.getBoundingClientRect();     // 强制回流，让无动画重放生效
    svg.classList.remove('ml-instant');

    ML.applyStep(stage, L[k], animate !== false);
    paint();
    Sfx.blip(k);
  }

  function stepDuration() {
    var s = step();
    var move = s.dur || 800;
    var hold = s.hold != null ? s.hold : (1000 + (s.say || '').length * 78);
    return (move + hold) / st.speed;
  }

  function schedule() {
    clearTimeout(st.timer);
    if (!st.playing) return;
    st.timer = setTimeout(function () {
      if (!st.playing) return;
      if (st.si < list().length - 1) {
        goStep(st.si + 1, true);
        schedule();
      } else {
        stop();
      }
    }, stepDuration());
  }

  function play() {
    if (st.si === list().length - 1) goStep(0, false);
    st.playing = true;
    $('play').textContent = '暂停';
    schedule();
  }
  function stop() {
    st.playing = false;
    clearTimeout(st.timer);
    $('play').textContent = '▶ 自动播放';
  }

  /* ---------- 绑定 ---------- */

  $('prev').addEventListener('click', function () { stop(); goStep(st.si - 1, true); });
  $('next').addEventListener('click', function () { stop(); goStep(st.si + 1, true); });
  $('play').addEventListener('click', function () { st.playing ? stop() : play(); });

  [].forEach.call($('speed').children, function (b) {
    b.addEventListener('click', function () {
      st.speed = parseFloat(b.dataset.s);
      [].forEach.call($('speed').children, function (x) { x.classList.toggle('on', x === b); });
      if (st.playing) schedule();
    });
  });

  var sfxBtn = $('sfx');
  function paintSfx() { sfxBtn.textContent = '音效：' + (Sfx.isOn() ? '开' : '关'); }
  paintSfx();
  sfxBtn.addEventListener('click', function () { Sfx.toggle(); paintSfx(); });

  document.addEventListener('keydown', function (e) {
    if (e.target && /INPUT|TEXTAREA/.test(e.target.tagName)) return;
    if (e.key === 'ArrowRight') { stop(); goStep(st.si + 1, true); }
    else if (e.key === 'ArrowLeft') { stop(); goStep(st.si - 1, true); }
    else if (e.key === ' ') { e.preventDefault(); st.playing ? stop() : play(); }
  });

  window.addEventListener('beforeunload', stop);

  /* ---------- 起飞 ---------- */
  renderMethods();
  renderSteps();
  goStep(0, false);
})();
