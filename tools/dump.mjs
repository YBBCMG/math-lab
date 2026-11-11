/* 从真实页面里导出讲稿（保证配音文本 == 页面渲染的文本，不是另抄一份）
   产物：tools/narration.json  [{ lesson, mi, si, text }]
   用法：node tools/dump.mjs            （需本地服务器 127.0.0.1:8787 在跑）
*/
import pw from 'file:///D:/DSH/turtle-tricycle/node_modules/playwright/index.js';
import fs from 'node:fs';
import path from 'node:path';

const { chromium } = pw;
const OUT = path.resolve('tools/narration.json');

/* ---------- 符号 → 口语 ---------- */
const SPEAK = [
  [/[\u2081]/g, '一'], [/[\u2082]/g, '二'], [/[\u2083]/g, '三'],
  [/∠/g, '角'], [/△/g, '三角形'], [/⊥/g, '垂直于'], [/°/g, '度'],
  [/½/g, '二分之一'], [/²/g, '的平方'], [/³/g, '的立方'],
  [/×/g, '乘'], [/·/g, '乘'], [/÷/g, '除以'],
  [/≈/g, '约等于'], [/√/g, '根号'], [/⟹/g, '所以'], [/→/g, '所以'],
  [/∀/g, '对所有'], [/∈/g, '属于'], [/≠/g, '不等于'], [/≥/g, '大于等于'], [/≤/g, '小于等于'],
  // 角标记与希腊字母：不转写的话 TTS 会把 α/β/θ 直接吞掉，≌ 念不出口。
  // θ 是「截长补短」那题的命根子（∠C = θ、∠B = 2θ），漏一个整段讲稿就成了「角C 记作 ，角B 就是 2」。
  [/≌/g, '全等于'], [/α/g, '阿尔法'], [/β/g, '贝塔'], [/γ/g, '伽马'], [/δ/g, '德尔塔'],
  [/θ/g, '西塔'], [/Θ/g, '西塔'], [/λ/g, '拉姆达'], [/μ/g, '缪'], [/π/g, '派'], [/ω/g, '欧米伽'],
  // 带圈数字 ①②③ 是角标名字（「标成同一个 ①」），直接扔给 TTS 大概率被吞或念成数字，
  // 统一念作「角一 / 角二」，句子里读起来仍然通顺。
  [/①/g, '角一'], [/②/g, '角二'], [/③/g, '角三'], [/④/g, '角四'],
  [/−/g, '减'], [/=/g, '等于'],
  [/——/g, '，'], [/\s+/g, ' ']
];

function speak(t) {
  if (!t) return '';
  let s = String(t);
  for (const [re, to] of SPEAK) s = s.replace(re, to);
  s = s.replace(/[「」“”‘’]/g, '');          // 引号不读（中文弯引号也得剥，不然念成「引号」）
  return s.trim();
}

const browser = await chromium.launch({ channel: 'msedge', headless: true });
const page = await browser.newPage();

const lessons = [...fs.readFileSync('js/lessons/manifest.js', 'utf8')
  .matchAll(/'([^']+\.js)'/g)].map((m) => m[1]);

const lessonsMeta = [];
for (const f of lessons) {
  const id = f.replace(/\.js$/, '');
  await page.goto(`http://127.0.0.1:8787/lesson.html?id=${id}`, { waitUntil: 'load' });
  const data = await page.evaluate(() => {
    const l = (window.MATHLAB_LESSONS || []).find((x) => x.id === location.search.split('id=')[1]);
    if (!l) return null;
    return {
      id: l.id,
      title: l.title,
      methods: l.methods.map((mt, mi) => ({
        mi, name: mt.name, tier: mt.tier,
        steps: mt.steps.map((s, si) => ({ si, say: s.say || '', cite: s.cite || '', why: s.why || '' }))
      }))
    };
  });
  if (!data) { console.error('× 拿不到讲稿：' + id); process.exit(1); }
  lessonsMeta.push(data);
}

await browser.close();

const rows = [];
for (const l of lessonsMeta) {
  for (const mt of l.methods) {
    for (const s of mt.steps) {
      const parts = [speak(s.say)];
      if (s.why) parts.push(speak(s.why));
      rows.push({
        lesson: l.id, mi: mt.mi, si: s.si,
        file: `${l.id}/${mt.mi}-${s.si}.mp3`,
        text: parts.filter(Boolean).join(' ')
      });
    }
  }
}

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(rows, null, 0));

const byLesson = {};
for (const r of rows) byLesson[r.lesson] = (byLesson[r.lesson] || 0) + 1;
console.log('导出讲稿 ' + rows.length + ' 条');
for (const k in byLesson) console.log('  ' + k + ': ' + byLesson[k]);
const empty = rows.filter((r) => !r.text);
if (empty.length) { console.error('× 有空讲稿', empty); process.exit(1); }
/* 闸门：转写表没覆盖到的符号一律拦下来。
   TTS 遇到不认识的符号是「静默跳过」，成品听上去像漏字，事后极难发现——
   这行检查就是那次 θ 被吞掉之后加的。要放行就往 SPEAK 里加映射，别在这里开口子。 */
const LEAK = /[^\u4e00-\u9fff\u3000-\u303f\uff00-\uffefA-Za-z0-9 .,、，。；：？！…—·()（）+\-*/=<>≈≠≥≤°²³√]/g;
const leaks = [];
for (const r of rows) {
  const bad = [...new Set(r.text.match(LEAK) || [])];
  if (bad.length) leaks.push({ file: r.file, bad, text: r.text.slice(0, 60) });
}
if (leaks.length) {
  console.error('× 讲稿里有 TTS 念不出来的符号（去 SPEAK 里补映射）：');
  for (const l of leaks.slice(0, 20)) console.error(`  ${l.file}  [${l.bad.join(' ')}]  ${l.text}…`);
  process.exit(1);
}
console.log('最长一条 ' + Math.max(...rows.map((r) => r.text.length)) + ' 字');
console.log('合计 ' + rows.reduce((a, r) => a + r.text.length, 0) + ' 字');
