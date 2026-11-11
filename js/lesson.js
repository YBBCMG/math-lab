/* 讲解播放器：解法切换 / 逐步前进后退 / 自动播放 / 速度 / 音效 / 配音 */
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

  /* ---------- 三档标签：演示 / 证明 / 推论 ---------- */
  var TIER = {
    demo:      { text: '演示', cls: 'demo' },
    proof:     { text: '证明', cls: 'proof' },
    corollary: { text: '推论', cls: 'corollary' }
  };

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

  /* ---------- 配音 ---------- */
  var Voice = (function () {
    var on = true;
    try { on = localStorage.getItem('mathlab.voice') !== '0'; } catch (e) {}
    var el = null;
    var cb = null;
    var dead = {};      // 404 过的文件记下来，别每次都试

    function kill() {
      if (el) {
        el.onended = null; el.onerror = null;
        try { el.pause(); } catch (e) {}
        el = null;
      }
      cb = null;
    }

    // 返回 false 表示「这一步没有配音可放」，调用方应回落到定时器节奏
    function say(mi, si, rate, done) {
      kill();
      if (!on) return false;
      var src = 'media/' + lesson.id + '/' + mi + '-' + si + '.mp3';
      if (dead[src]) return false;

      var a;
      try { a = new Audio(src); } catch (e) { return false; }
      a.playbackRate = rate || 1;
      el = a;
      cb = done || null;

      var guard = setTimeout(function () {          // 兜底：卡住也别把自动播放挂死
        if (done && cb === done) { cb = null; done(true); }
      }, 25000);

      a.onended = function () { clearTimeout(guard); var f = cb; cb = null; el = null; if (f) f(false); };
      a.onerror = function () { clearTimeout(guard); dead[src] = 1; var f = cb; cb = null; el = null; if (f) f(true); };

      var p = a.play();
      if (p && p.catch) p.catch(function () { /* 首次加载没有手势，浏览器会拦；此时静默失败即可 */ });
      return true;
    }

    return {
      isOn: function () { return on; },
      toggle: function () {
        on = !on;
        try { localStorage.setItem('mathlab.voice', on ? '1' : '0'); } catch (e) {}
        if (!on) kill();
        return on;
      },
      say: say,
      stop: kill
    };
  })();

  /* ---------- 状态 ---------- */
  var svg = $('stage');
  var stage = new ML.Stage(svg);
  var st = { mi: 0, si: 0, playing: false, speed: 1, timer: null };

  function list() { return lesson.methods[st.mi].steps; }
  function step() { return list()[st.si]; }
  function method() { return lesson.methods[st.mi]; }

  function escapeHtml(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c];
    });
  }
  function shorten(s) {
    s = String(s || '');
    return s.length > 26 ? s.slice(0, 26) + '…' : s;
  }

  /* ---------- 渲染 ---------- */

  function renderMethods() {
    var box = $('methods');
    box.innerHTML = '';
    lesson.methods.forEach(function (mt, k) {
      var b = document.createElement('button');
      b.className = k === st.mi ? 'on' : '';
      var t = TIER[mt.tier];
      b.innerHTML = '<span class="idx">' + (k + 1) + '</span><span class="body">' +
        '<span class="nm">' + escapeHtml(mt.name) +
        (t ? '<i class="tier ' + t.cls + '">' + t.text + '</i>' : '') + '</span>' +
        (mt.sub ? '<span class="sub">' + escapeHtml(mt.sub) + '</span>' : '') +
        '</span>';
      b.addEventListener('click', function () {
        if (k === st.mi) return;
        st.mi = k;
        st.si = 0;
        renderMethods();
        renderSteps();
        goStep(0, false);
      });
      box.appendChild(b);
    });

    // 当前解法的前置说明（推论要说清依赖谁 / 演示要说清它不算证明）
    var note = $('needs');
    var msg = method().noticeMsg || method().needsMsg || '';
    note.textContent = msg;
    note.style.display = msg ? 'block' : 'none';
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

    var cite = $('cite');
    cite.textContent = s.cite || '';
    cite.style.display = s.cite ? 'block' : 'none';

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

    if (st.playing) {
      // 自动播放：节奏由配音决定；没有配音就回落到定时器
      var ok = Voice.say(st.mi, k, st.speed, function (failed) {
        if (failed) { schedule(); return; }
        advance();
      });
      if (!ok) schedule();
    } else {
      Voice.say(st.mi, k, st.speed, null);   // 手动翻页也朗读
    }
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
    st.timer = setTimeout(advance, stepDuration());
  }

  function advance() {
    if (!st.playing) return;
    if (st.si < list().length - 1) goStep(st.si + 1, true);
    else stop();
  }

  function play() {
    if (st.si === list().length - 1) goStep(0, false);
    st.playing = true;
    $('play').textContent = '暂停';
    // 直接让当前步的配音驱动节奏
    var ok = Voice.say(st.mi, st.si, st.speed, function (failed) {
      if (failed) { schedule(); return; }
      advance();
    });
    if (!ok) schedule();
  }

  function stop() {
    st.playing = false;
    clearTimeout(st.timer);
    Voice.stop();
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
      if (st.playing) {
        // 换速度：从头按新速度重播这一步
        var ok = Voice.say(st.mi, st.si, st.speed, function (failed) {
          if (failed) { schedule(); return; }
          advance();
        });
        if (!ok) schedule();
      }
    });
  });

  var sfxBtn = $('sfx');
  function paintSfx() { sfxBtn.textContent = '音效：' + (Sfx.isOn() ? '开' : '关'); }
  paintSfx();
  sfxBtn.addEventListener('click', function () { Sfx.toggle(); paintSfx(); });

  var voiceBtn = $('voice');
  function paintVoice() {
    voiceBtn.textContent = '配音：' + (Voice.isOn() ? '开' : '关');
    voiceBtn.classList.toggle('on', Voice.isOn());
  }
  paintVoice();
  voiceBtn.addEventListener('click', function () {
    var now = Voice.toggle();
    paintVoice();
    if (now) Voice.say(st.mi, st.si, st.speed, null);
    else $('play').textContent = st.playing ? '暂停' : '▶ 自动播放';
  });

  document.addEventListener('keydown', function (e) {
    if (e.target && /INPUT|TEXTAREA/.test(e.target.tagName)) return;
    if (e.key === 'ArrowRight') { stop(); goStep(st.si + 1, true); }
    else if (e.key === 'ArrowLeft') { stop(); goStep(st.si - 1, true); }
    else if (e.key === ' ') { e.preventDefault(); st.playing ? stop() : play(); }
  });

  window.addEventListener('beforeunload', function () { stop(); Voice.stop(); });

  /* ---------- 起飞 ---------- */
  renderMethods();
  renderSteps();
  goStep(0, false);
})();
