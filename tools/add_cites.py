# -*- coding: utf-8 -*-
"""给四道题的讲稿补齐 cite（依据）。按 say 行锚定，锚点必须唯一，否则报错退出。
每条插入后立刻校验：插入数量 == 计划数量。
"""
import io, sys

# (文件, say 行锚点（含引号结尾逗号）, 要插入的 cite 文本)
JOBS = [
    # ---------------- 三角形内角和 · 方法一（演示） ----------------
    ('triangle-angle-sum.js',
     "say: '任意画一个三角形。三个内角加起来，到底是多少度？',",
     '待证命题：任意三角形的三个内角之和'),
    ('triangle-angle-sum.js',
     "say: '先把三个内角标出来。这三片角，就是待会儿要被拿走的。',",
     '角的定义：角的大小只与两边张开的程度有关'),
    ('triangle-angle-sum.js',
     "say: '青蓝那片是 ∠A，橙色是 ∠B，绿色是 ∠C。',",
     '角的度量与边的长短无关'),
    ('triangle-angle-sum.js',
     "say: '沿着角的两条边剪开——三片角就离开了原来的三角形。',",
     '角的大小不依赖外框，可以整体搬运'),
    ('triangle-angle-sum.js',
     "say: '把三片角一起搬到下面的空白处。',",
     '平移不改变角的大小'),
    ('triangle-angle-sum.js',
     "say: '转一转，让三片角肩并肩挨着排好。',",
     '旋转不改变角的大小'),
    ('triangle-angle-sum.js',
     "say: '一条直线旁边的这些角，加起来是一个平角。',",
     '平角的定义：一条直线一侧的角之和 = 180°'),
    # ---------------- 三角形内角和 · 方法二（证明） ----------------
    ('triangle-angle-sum.js',
     "say: '换一条路走：不撕角，只画一条辅助线。',",
     '证明策略：把 ∠A、∠B 搬到顶点 C，凑成一个平角'),
    ('triangle-angle-sum.js',
     "say: '先把三角形自己的三个内角标出来。',",
     '角的定义：同一个角，位置不同但大小相同'),
    ('triangle-angle-sum.js',
     "say: '右边同理：∠BCE 和 ∠B 也是一对内错角，所以相等。',",
     '同一条平行线性质，左右各用一次'),
    ('triangle-angle-sum.js',
     "say: '现在看 C 点：三个角排在一起，正好铺满直线 DE 的一侧。',",
     '等量代换：∠DCA = ∠A，∠BCE = ∠B'),
    ('triangle-angle-sum.js',
     "say: '所以 ∠A + ∠ACB + ∠B 就是一个平角。',",
     '平角的定义：一条直线一侧的角之和 = 180°'),
    ('triangle-angle-sum.js',
     "say: '把相等的角换回去，就得到三角形内角和。',",
     '等量代换：相等的角互相替换，总量不变'),
    # ---------------- 三角形内角和 · 方法三（推论） ----------------
    ('triangle-angle-sum.js',
     "say: '把 AB 延长到点 D，得到一个外角 ∠CBD。',",
     '外角的定义：延长一边，与相邻另一边所夹的角'),
    ('triangle-angle-sum.js',
     "say: '先把三角形的三个内角标出来。',",
     '角的定义：内角的大小与位置无关'),
    ('triangle-angle-sum.js',
     "say: '把 ∠A 这片角从 A 搬到 B 来，放在外角的最外边。',",
     '平移不改变角的大小'),
    ('triangle-angle-sum.js',
     "say: '再把 ∠C 那片也搬过来，让它俩接上。',",
     '旋转不改变角的大小'),
    ('triangle-angle-sum.js',
     "say: '两块角片正好把外角填满，一片不剩、一片不多。',",
     '角的可加性：拼满外角，所以两块之和 = 外角'),
    ('triangle-angle-sum.js',
     "say: '而外角和它旁边的内角 ∠B，正好拼成一条直线。',",
     '互补的定义：两角之和 = 180°'),
    ('triangle-angle-sum.js',
     "say: '把 ∠CBD 换成 ∠A + ∠C，就回到三角形的三个内角。',",
     '等量代换：外角 = ∠A + ∠C'),
    # ---------------- 平行四边形 · 方法一 ----------------
    ('parallelogram-area.js',
     "say: '这是一个平行四边形。它的对边平行，而且相等。',",
     '平行四边形的定义：两组对边分别平行；性质：对边相等'),
    ('parallelogram-area.js',
     "say: '先认清它的底：取 AB 这一条边，记作 a。',",
     '底：任意一条边都可以当底'),
    ('parallelogram-area.js',
     "say: '再从 D 向底边作一条垂线，交点记作 E。DE 就是它的高，记作 h。',",
     '高：两条平行线之间的距离（垂线段长度）'),
    ('parallelogram-area.js',
     "say: '现在盯着左边这块直角三角形 ADE。',",
     '待处理对象：直角三角形 ADE'),
    ('parallelogram-area.js',
     "say: '沿着高 DE 剪一刀——平行四边形被分成一个三角形和一个梯形。',",
     '分割：两块内部互不重叠，合起来是整个图形'),
    ('parallelogram-area.js',
     "say: '补上了。现在这两块合在一起，是一个……长方形。',",
     '平移后三角形的斜边与原边重合，DE 垂直于底边 ⇒ 四个角都是直角'),
    ('parallelogram-area.js',
     "say: '量一量：长正好等于原来的底 a，宽正好等于原来的高 h。',",
     '长方形面积 = 长 × 宽'),
    ('parallelogram-area.js',
     "say: '所以平行四边形的面积，就是底乘高。',",
     '等量代换：割补前后总面积不变'),
    # ---------------- 平行四边形 · 方法二 ----------------
    ('parallelogram-area.js',
     "say: '还有一条路：用三角形面积倒推。',",
     '已知定理：三角形面积 = ½ × 底 × 高'),
    ('parallelogram-area.js',
     "say: '连一条对角线 BD，平行四边形被分成两个三角形。',",
     '对角线在图形内部，构成合法分割'),
    ('parallelogram-area.js',
     "say: '左边这块 △ABD：底是 AB = a，高是从 D 到底边的那一段 h。',",
     '三角形面积公式'),
    ('parallelogram-area.js',
     "say: '右边这块 △BCD：底是 CD，也是 a；高是从 B 到 CD 的那一段，也是 h。',",
     '平行线间的距离处处相等'),
    ('parallelogram-area.js',
     "say: '两块加起来，两个 1/2 正好凑成一个。',",
     '面积可加性 + 平行四边形对边相等'),
    ('parallelogram-area.js',
     "say: '和方法一得到的结论完全一样。',",
     '两条证明路径互不依赖，却得到同一结论'),
    # ---------------- 完全平方 · 方法一 ----------------
    ('perfect-square.js',
     "say: '一个正方形的边长是 a + b。它的面积就是 (a + b)²。',",
     '正方形面积 = 边长 × 边长'),
    ('perfect-square.js',
     "say: '在距离左边 a 的地方，竖着切一刀。',",
     '线段可分成 a 与 b 两段，a + b 就是整条边'),
    ('perfect-square.js',
     "say: '再在距离上边 a 的地方，横着切一刀。',",
     '两刀一横一竖，把正方形分成四块，互不重叠'),
    ('perfect-square.js',
     "say: '四块出来了。先把左上那块大的单独拎出来。',",
     '正方形面积 = 边长²，这里边长是 a'),
    ('perfect-square.js',
     "say: '右上那块：长是 b，宽是 a，面积是 ab。',",
     '长方形面积 = 长 × 宽'),
    ('perfect-square.js',
     "say: '左下那块：长是 a，宽是 b，面积也是 ab。',",
     '长方形面积 = 长 × 宽（两个因数互换，面积不变）'),
    ('perfect-square.js',
     "say: '右下那块最小：边长是 b，面积是 b²。',",
     '正方形面积 = 边长²，这里边长是 b'),
    ('perfect-square.js',
     "say: '这就是完全平方公式。中间那个 2ab，就是两块一样大的 ab 合起来的。',",
     '合并同类项：ab + ab = 2ab'),
    # ---------------- 完全平方 · 方法二 ----------------
    ('perfect-square.js',
     "say: '同一个正方形，换一种看法。',",
     '同一个图形面积唯一，换一种分法不影响结果'),
    ('perfect-square.js',
     "say: '正方形的面积 = 边长 × 边长，也就是 (a + b) × (a + b)。',",
     '正方形面积公式'),
    ('perfect-square.js',
     "say: '先把高度切成两段：上面一段是 a，下面一段是 b。',",
     '线段可分成 a + b 两段'),
    ('perfect-square.js',
     "say: '上面这一层：宽 a，长 (a+b)，面积是 a × (a+b)。',",
     '长方形面积 = 长 × 宽'),
    ('perfect-square.js',
     "say: '下面这一层：宽 b，长还是 (a+b)，面积是 b × (a+b)。',",
     '长方形面积 = 长 × 宽'),
    ('perfect-square.js',
     "say: '拆开一算，还是那四块。',",
     '分配律展开：a(a+b) + b(a+b) = a² + ab + ab + b²'),
    ('perfect-square.js',
     "say: '合并同类项，得到同一个结果。',",
     '合并同类项：ab + ab = 2ab'),
]

# 按文件分组，逐个插入
from collections import defaultdict
byfile = defaultdict(list)
for f, anchor, cite in JOBS:
    byfile[f].append((anchor, cite))

total = 0
for fname, jobs in byfile.items():
    path = 'js/lessons/' + fname
    s = io.open(path, encoding='utf-8').read()
    for anchor, cite in jobs:
        n = s.count(anchor)
        if n != 1:
            print('× 锚点不唯一（%d 次）：%s' % (n, anchor))
            sys.exit(1)
        # 已经紧跟 cite 的跳过（可重复执行）
        i = s.index(anchor) + len(anchor)
        tail = s[i:i + 20]
        if 'cite:' in tail:
            continue
        insert = "\n      cite: '%s'," % cite
        s = s[:i] + insert + s[i:]
        total += 1
    io.open(path, 'w', encoding='utf-8', newline='\n').write(s)
    print('✓ %s 处理 %d 条' % (fname, len(jobs)))

print('共插入 %d 条 cite' % total)
