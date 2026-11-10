import pw from 'file:///D:/DSH/turtle-tricycle/node_modules/playwright/index.js';
const { chromium } = pw;
import { pathToFileURL } from 'node:url';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = 'D:/请输入文本/math-lab';
const SHOTS = path.join(ROOT, '_shots');
fs.mkdirSync(SHOTS, { recursive: true });

const url = (f, q) => pathToFileURL(path.join(ROOT, f)).href + (q || '');

const errors = [];
const logs = [];

const browser = await chromium.launch({ channel: 'msedge', headless: true });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 960 }, deviceScaleFactor: 1 });
const page = await ctx.newPage();

page.on('pageerror', e => errors.push('PAGEERROR: ' + e.message));
page.on('console', msg => {
  if (msg.type() === 'error' || msg.type() === 'warning') errors.push(msg.type().toUpperCase() + ': ' + msg.text());
  else logs.push(msg.text());
});

async function shot(name) {
  await page.screenshot({ path: path.join(SHOTS, name + '.png'), fullPage: false });
}

/* ---------- 1. 题库首页 ---------- */
await page.goto(url('index.html'));
await page.waitForTimeout(500);

const cards = await page.locator('.card').count();
const titles = await page.locator('.card h3').allTextContents();
const chipTexts = await page.locator('.chip').allTextContents();
await shot('01-index');

console.log('CARDS=' + cards);
console.log('TITLES=' + JSON.stringify(titles));
console.log('CHIPS=' + JSON.stringify(chipTexts));

// 每张卡片里缩略图是否有实际图形元素
const thumbShapes = await page.evaluate(() =>
  [...document.querySelectorAll('.card .thumb svg')].map(s => s.querySelectorAll('g.ml-el').length)
);
console.log('THUMB_GROUPS=' + JSON.stringify(thumbShapes));

// 搜索过滤
await page.fill('#q', '完全平方');
await page.waitForTimeout(200);
console.log('SEARCH_HITS=' + await page.locator('.card').count());
await page.fill('#q', '');
await page.waitForTimeout(200);

/* ---------- 2. 讲解页：逐题逐解法逐步 ---------- */
const lessons = [
  { id: 'triangle-angle-sum', methods: 3 },
  { id: 'parallelogram-area', methods: 2 },
  { id: 'perfect-square', methods: 2 }
];

for (const L of lessons) {
  await page.goto(url('lesson.html', '?id=' + L.id));
  await page.waitForTimeout(400);

  const title = await page.locator('#title').textContent();
  const stepCount = await page.locator('#steps button').count();
  const methodCount = await page.locator('#methods button').count();
  console.log(`--- ${L.id}: title=${title} methods=${methodCount} steps(m0)=${stepCount}`);

  for (let mi = 0; mi < L.methods; mi++) {
    // 切解法
    await page.locator('#methods button').nth(mi).click();
    await page.waitForTimeout(250);
    const n = await page.locator('#steps button').count();

    // 逐步走到最后，收集每步的元素数 & 公式
    const trace = [];
    for (let si = 0; si < n; si++) {
      await page.locator('#steps button').nth(si).click();
      await page.waitForTimeout(120);
      const s = await page.evaluate(() => ({
        n: document.querySelectorAll('#stage g.ml-el').length,
        say: document.getElementById('say').textContent.slice(0, 20),
        eq: document.getElementById('eq').textContent.slice(0, 24),
        hasWhy: document.getElementById('why').style.display !== 'none' && document.getElementById('why').textContent.length > 0
      }));
      trace.push(s);
      if (si === n - 1) {
        await page.waitForTimeout(300);
        await shot(`m${mi + 1}-final-${L.id}`);
      }
      if (si === Math.floor(n / 2)) await shot(`m${mi + 1}-mid-${L.id}`);
    }

    const empty = trace.filter(t => t.n === 0).map((_, i) => i);
    const whyCount = trace.filter(t => t.hasWhy).length;
    console.log(`  method${mi + 1}: steps=${n} emptySteps=${JSON.stringify(empty)} withWhy=${whyCount}/${n} finalEq="${trace[n - 1].eq}"`);

    // 回退测试：先到末尾，再跳回第 1 步，元素数应回到该步的期望值
    await page.locator('#steps button').nth(n - 1).click();
    await page.waitForTimeout(150);
    await page.locator('#steps button').nth(0).click();
    await page.waitForTimeout(150);
    const backN = await page.evaluate(() => document.querySelectorAll('#stage g.ml-el').length);
    console.log(`  rewind→step1 groups=${backN} (expect ${trace[0].n})`);
  }
}

/* ---------- 3. 交互：点最后一步不能把整个文档滚走 ---------- */
await page.goto(url('lesson.html', '?id=triangle-angle-sum'));
await page.waitForTimeout(300);
await page.evaluate(() => window.scrollTo(0, 0));
const nScroll = await page.locator('#steps button').count();
// 用 dispatchEvent 而不是 click()：Playwright 的 click 会自动把元素滚进视口，
// 那就分不清「页面自己滚了」还是「测试工具滚了」。
await page.locator('#steps button').nth(nScroll - 1).dispatchEvent('click');
await page.waitForTimeout(300);
const scrollY = await page.evaluate(() => window.scrollY);
const stepsScroll = await page.evaluate(() => document.getElementById('steps').scrollTop);
const noDocScroll = scrollY < 2;
console.log('SCROLL docY=' + scrollY + ' stepsScrollTop=' + Math.round(stepsScroll) + ' ASSERT=' + (noDocScroll ? 'PASS' : 'FAIL'));

/* ---------- 4. 几何断言：撕角拼平角必须真的拼成半圆 ---------- */
// 做法：沿每条扇形路径采样，换算回 viewBox 坐标，检查
//   (a) 所有采样点到拼装点 O 的距离 = 半径 R（拼上了，没散开）
//   (b) 没有任何采样点落到直线下方（y > O.y）
//   (c) 三片合起来覆盖的角度正好 0°~180°
// 注意：不能用 getBoundingClientRect 判 —— 它给的是「旋转后包围盒的包围盒」，会虚胖。
await page.goto(url('lesson.html', '?id=triangle-angle-sum'));
await page.waitForTimeout(300);
const n1 = await page.locator('#steps button').count();
await page.locator('#steps button').nth(n1 - 1).click();
await page.waitForTimeout(1200);

const geo = await page.evaluate(() => {
  const O = [400, 452], R = 88;
  const svg = document.getElementById('stage');
  const inv = svg.getScreenCTM().inverse();
  const pts = [];
  document.querySelectorAll('#stage g.ml-el path').forEach(el => {
    const ctm = el.getScreenCTM();
    const L = el.getTotalLength();
    for (let k = 0; k <= 60; k++) {
      const p = el.getPointAtLength(L * k / 60);
      const sp = new DOMPoint(p.x, p.y).matrixTransform(ctm);   // → 屏幕
      const up = sp.matrixTransform(inv);                        // → viewBox
      pts.push([up.x, up.y]);
    }
  });
  const dist = pts.map(([x, y]) => Math.hypot(x - O[0], y - O[1]));
  const below = pts.filter(([x, y]) => y > O[1] + 2).length;
  // 只看落在圆周上的点（扇形的弧），算它们覆盖的角度
  const angs = pts
    .map(([x, y], i) => ({ a: (Math.atan2(O[1] - y, x - O[0]) * 180 / Math.PI + 360) % 360, d: dist[i] }))
    .filter(o => Math.abs(o.d - R) < 2.5)
    .map(o => o.a);
  return {
    n: document.querySelectorAll('#stage g.ml-el path').length,
    maxDist: Math.max(...dist), minDist: Math.min(...dist),
    below,
    angMin: Math.min(...angs), angMax: Math.max(...angs), nAng: angs.length
  };
});

const ok =
  geo.n === 3 &&
  Math.abs(geo.maxDist - 88) < 3 &&
  geo.below === 0 &&
  geo.angMin < 3 &&
  geo.angMax > 177;

console.log('GEO=' + JSON.stringify(geo));
console.log('GEO_ASSERT=' + (ok ? 'PASS' : 'FAIL'));

/* ---------- 4. 窄屏 ---------- */
await page.goto(url('lesson.html', '?id=triangle-angle-sum'));
await page.waitForTimeout(300);
await page.setViewportSize({ width: 420, height: 900 });
await page.waitForTimeout(300);
await shot('09-mobile');
await page.setViewportSize({ width: 1440, height: 960 });

/* ---------- 5. 内容断言：讲稿数据本身的硬指标 ---------- */
await page.goto(url('index.html'));
await page.waitForTimeout(300);
const data = await page.evaluate(() => window.MATHLAB_LESSONS.map(l => ({
  id: l.id,
  methods: l.methods.map(m => ({
    name: m.name,
    n: m.steps.length,
    missingWhy: m.steps.filter(s => !s.why || !s.why.trim()).length,
    emptySay: m.steps.filter(s => !s.say || !s.say.trim()).length,
    lastEq: m.steps[m.steps.length - 1].eq || ''
  }))
})));

const contentFail = [];
for (const l of data) {
  for (const m of l.methods) {
    if (m.n < 8) contentFail.push(`${l.id} / ${m.name}: 只有 ${m.n} 步（要求 ≥8）`);
    if (m.missingWhy) contentFail.push(`${l.id} / ${m.name}: ${m.missingWhy} 步缺「依据」`);
    if (m.emptySay) contentFail.push(`${l.id} / ${m.name}: ${m.emptySay} 步缺旁白`);
    if (!m.lastEq) contentFail.push(`${l.id} / ${m.name}: 最后一步没有可抄的算式`);
    console.log(`CONTENT ${l.id} / ${m.name}: steps=${m.n} missingWhy=${m.missingWhy} lastEq="${m.lastEq}"`);
  }
  if (l.methods.length < 2) contentFail.push(`${l.id}: 只有 ${l.methods.length} 种解法（要求 ≥2）`);
}

console.log('CONTENT_ASSERT=' + (contentFail.length ? 'FAIL' : 'PASS'));
contentFail.forEach(f => console.log('  ✗ ' + f));

await browser.close();

console.log('\n=== ERRORS (' + errors.length + ') ===');
errors.forEach(e => console.log(e));

const allOk = contentFail.length === 0 && errors.length === 0 && ok && noDocScroll;
console.log('OVERALL=' + (allOk ? 'PASS' : 'FAIL'));
if (!allOk) process.exitCode = 1;
