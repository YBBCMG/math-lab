/* 题库首页：筛选 + 搜索 + 每题首帧缩略图 */
(function () {
  var lessons = window.MATHLAB_LESSONS || [];
  var grid = document.getElementById('grid');
  var chipsBox = document.getElementById('chips');
  var qEl = document.getElementById('q');

  var curTag = '全部';
  var curQ = '';

  /* ---------- 分类 ---------- */
  var tags = ['全部'];
  lessons.forEach(function (l) {
    (l.tags || []).forEach(function (t) {
      if (tags.indexOf(t) < 0) tags.push(t);
    });
  });

  tags.forEach(function (t) {
    var b = document.createElement('button');
    b.className = 'chip' + (t === '全部' ? ' on' : '');
    b.textContent = t;
    b.dataset.tag = t;
    b.addEventListener('click', function () {
      curTag = t;
      [].forEach.call(chipsBox.children, function (c) { c.classList.toggle('on', c === b); });
      render();
    });
    chipsBox.appendChild(b);
  });

  /* ---------- 搜索 ---------- */
  qEl.addEventListener('input', function () {
    curQ = qEl.value.trim().toLowerCase();
    render();
  });

  /* ---------- 渲染 ---------- */
  function match(l) {
    if (curTag !== '全部' && (l.tags || []).indexOf(curTag) < 0) return false;
    if (!curQ) return true;
    var hay = [l.title, l.topic, l.grade, l.question, (l.tags || []).join(' ')].join(' ').toLowerCase();
    return hay.indexOf(curQ) >= 0;
  }

  function render() {
    grid.innerHTML = '';
    var list = lessons.filter(match);

    if (!list.length) {
      var em = document.createElement('div');
      em.className = 'empty';
      em.textContent = '没找到。换个关键词试试。';
      grid.appendChild(em);
      return;
    }

    list.forEach(function (l) {
      var a = document.createElement('a');
      a.className = 'card';
      a.href = 'lesson.html?id=' + encodeURIComponent(l.id);

      var thumb = document.createElement('div');
      thumb.className = 'thumb';
      var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('viewBox', '0 0 900 520');
      svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
      thumb.appendChild(svg);

      var body = document.createElement('div');
      body.className = 'body';

      var h3 = document.createElement('h3');
      h3.textContent = l.title;

      var meta = document.createElement('div');
      meta.className = 'meta';
      [['grade', l.grade], ['', l.topic], ['count', l.methods.length + ' 种解法']].forEach(function (p) {
        if (!p[1]) return;
        var s = document.createElement('span');
        s.className = 'tag ' + p[0];
        s.textContent = p[1];
        meta.appendChild(s);
      });

      body.appendChild(h3);
      body.appendChild(meta);
      a.appendChild(thumb);
      a.appendChild(body);
      grid.appendChild(a);

      // 用「有代表性的一步」当缩略图（lesson.thumbStep，缺省第 1 步）
      try { ML.thumb(svg, l.methods[0].steps, l.thumbStep || 0); } catch (e) { /* 静默降级 */ }
    });
  }

  render();
})();
