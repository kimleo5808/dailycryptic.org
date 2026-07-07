# NYT Spelling Bee 提示页 — SEO 内容方案（Blueprint）

> 本轮流程第 ①②③ 步的产出。第 ④ 步落地代码待审核后进行。
> 方法论：Backlinko AUTHORITY 变体（daily-answer 页需常青内容支撑排名）。

---

## 0. 竞品分析结论（第①步）

| 竞品 | 常青字数 | 结构特征 | 值得抄 / 差距 |
|---|---|---|---|
| **word.tips/spelling-bee-answers** | ~2500 词 | 70% 常青 + 30% 每日答案；按词长分组、可按分数排序；14+ FAQ | 常青占比高、内链到全套 daily games hub |
| **wordfinder.yourdictionary.com** | ~1500 词 | 蜂巢字母网格 → pangram → 按 4/5/6/7 字母分组 → 11 条 FAQ | 字母网格可视化好；"Why no S?" 等长尾 FAQ |
| **sbsolver.com / nytbee.com** | 中等 | 纯工具/数据向，含"two-letter list"官方提示格式 + 统计（Genius/Queen Bee 分数） | 提示梯度专业；缺 SEO 常青深度 → 我们的机会 |
| **thewordfinder / beesolver** | 少 | 日更 + 每日 URL 归档 | 归档 URL 结构 |

**差距 = 我们的切入点：**
1. 竞品要么常青深、要么提示专业，**很少两者兼顾**——我们把两者做全。
2. 独有资产：把 Spelling Bee 提示与本站 **cryptic 解谜脑力训练**做主题嫁接（"练 cryptic 的人更会 Spelling Bee"），形成别站没有的内链故事与话题权威。
3. **无剧透梯度**做到极致：字母网格 → 统计 → two-letter 列表 → 词长分布 → pangram 谜面式提示 → 分组答案（默认折叠）。

---

## 1. 路由与元数据（第②步 · Above the fold）

- **路由（today 页）**：`/spelling-bee-answers-today`
  （对齐现有 `wordle-answer-today` / `connections-hint-today` / `strands-hint-today` 命名）
- **配套归档页**：`/spelling-bee-answers`（`/spelling-bee-answers/[date]` 单日）
- **Meta Title**（≤60）：`NYT Spelling Bee Answers & Hints Today — Pangram`
- **Meta Description**（≤155）：`Today's NYT Spelling Bee answers, hints and pangram. Spoiler-free clues first, then the full word list and Queen Bee tips. Updated daily, free.`
- **H1**：`NYT Spelling Bee Answers & Hints for Today`
- **Subhead（一句话价值主张）**：`Spoiler-free hints first — reveal the pangram and full answer list only when you're ready. Updated every morning.`
- **Canonical**：today 页自指向 `/spelling-bee-answers-today`；单日归档指向对应 `[date]`。
- **作者署名 + Last updated 日期**（E-E-A-T）。

---

## 2. 页面结构与字数预算（第②步 · H1/H2 树）

> 两类内容：**A. 每日动态块**（每天数据变化，不计入常青字数）+ **B. 常青 SEO 内容**（≥1500 词，长期稳定）。

### A. 每日动态块（页面上半部，无剧透梯度）

1. **今日蜂巢字母网格** — 中心字母 + 6 外圈字母（可视化 SVG 六边形），日期徽标。
2. **今日统计条** — 单词总数 · pangram 数量 · Genius 分数线 · Queen Bee(满分) 分数。（一句话可被 LLM 引用的事实块）
3. **提示梯度（Hints，折叠递进）**
   - H2: `Today's Spelling Bee Hints (Spoiler-Free)`
   - 每个首字母的单词数量表（"Words starting with…"）
   - **Two-letter list**（官方式提示：如 `CA-2, CH-3, LE-1…`）
   - 按词长分布（4 字母 ×N、5 字母 ×N…）
   - **Pangram 谜面式提示**：先给一句"定义型"提示（借鉴本站 cryptic 提示分级思路），再"Reveal pangram"按钮。
4. **完整答案（默认折叠 / Reveal 按钮）**
   - H2: `Today's Spelling Bee Answers (Full List)`
   - 按词长分组（4/5/6/7+ 字母），pangram 高亮标注。
   - ⚠️ 答案区上方明确 "Answers below — scroll past to avoid spoilers" 分隔。

### B. 常青 SEO 内容（≥1500 词，固定 H2 顺序）

| # | H2 | 字数预算 | 内容方向 |
|---|---|---|---|
| B1 | `What Is the NYT Spelling Bee?` | ~220 | 定义段（<50 词可引用）：游戏规则、7 字母、中心字母必用、≥4 字母、无 S。含 1 条统计。 |
| B2 | `How Spelling Bee Scoring & Ranks Work` | ~260 | Beginner→Genius→Queen Bee 分级；4 字母=1 分、更长=每字母 1 分、pangram +7；Genius=70% 总分。表格。 |
| B3 | `What Is a Pangram (and How to Find It)` | ~240 | pangram 定义（可引用）+ 找 pangram 的实操方法（先假设每个字母都用一次）。 |
| B4 | `What Is Queen Bee?` | ~200 | Queen Bee 非官方满分称号；达成难度；心态与策略。 |
| B5 | `How to Get Queen Bee: 6 Strategies` | ~360 | 洗牌换视角、前后缀法、双字母组合扫描、-ING/-ED 变形、生僻词、隔日回看。每条含 1 例。 |
| B6 | `Spelling Bee vs Cryptic Crosswords: Same Brain, Better Solver` | ~260 | **独有资产**：拆词、字母重组的能力同源；练 anagram/charade 线索能提升 Spelling Bee 表现。→ 强力内链到本站 cryptic 内容。 |
| B7 | `Frequently Asked Questions` | ~300 | 8 条 FAQ（见 §4）。 |
| B8 | `More Daily Puzzle Hints & Games` | ~120 | 卡片网格：Wordle / Connections / Strands / Quordle / Cryptic。 |

**常青合计：约 1,960 词**（满足 ≥1500，含缓冲）。

---

## 3. 关键词与词密控制（1–3%）

- **主词**：`spelling bee answers today`（出现在 Title、H1、B 区首段、answers H2、1 条 FAQ、meta desc）。
- **副词**：`spelling bee pangram today`（B3 + pangram 块）、`spelling bee hints today`（hints H2 + subhead）、`queen bee spelling bee`（B4/B5 + FAQ）。
- **词密目标**：正文约 2000 词，主词 `spelling bee` 词组自然出现 **20–35 次 ≈ 1–1.7%**，主词精确短语 `spelling bee answers today` 出现 **5–8 次 ≈ 0.3–0.5%**（精确短语不宜堆砌，靠语义变体撑密度）。
- **LSI/语义变体**（防堆砌、助排名）：honeycomb, center letter, seven letters, word list, genius, bingo, hive, two-letter list, NYT puzzle。
- ⚠️ 每个 H2 段落一个主题，一句一概念（GEO 友好，利于被 AI 引用）。

---

## 4. FAQ（8 条 · GEO 直答式）

1. **What are today's Spelling Bee answers?** — 指向本页答案折叠块 + 每日更新说明。
2. **What is today's Spelling Bee pangram?** — pangram 定义 + 今日 reveal 位置。
3. **How many words are in today's Spelling Bee?** — 引用今日统计块，随数据变化。
4. **What score do I need for Queen Bee?** — Queen Bee = 全部单词满分；Genius = 70%。
5. **Why is there no letter S in the Spelling Bee?** — NYT 设计（避免复数灌水），高搜索长尾。
6. **What is "bingo" in Spelling Bee?** — 7 个字母各作首字母各出一词。
7. **Is there a free Spelling Bee unlimited / archive?** — 内链归档页 + 本站其他可玩游戏。
8. **Can solving cryptic clues improve my Spelling Bee?** — 桥接到 cryptic 内容（独有角度）。

---

## 5. 内链方案（第②步 · 5–8 条 · 描述性锚文本）

| 锚文本 | 目标 URL | 位置 |
|---|---|---|
| cryptic crossword for beginners | `/cryptic-crossword-for-beginners` | B6 |
| anagram clues | `/cryptic-clue-types/anagram` | B6 / FAQ8 |
| anagram solver | `/anagram-solver` | B5（双字母/重组策略处） |
| Wordle answers today | `/wordle-answer-today` | B8 卡片 |
| Connections hints today | `/connections-hint-today` | B8 卡片 |
| Play Quordle | `/quordle` | B8 卡片 |
| Spelling Bee answers archive | `/spelling-bee-answers` | 答案块下方 + FAQ7 |

**反向内链（现有页 → 新页）**：footer "Hints" 板块、Wordle/Connections/Strands 提示页的"More daily games"区、`config/nav.ts` 的 Hints 下拉新增 "Spelling Bee Hints"。

---

## 6. Schema JSON-LD（第②步 · 三段）

1. **FAQPage** — 由 §4 填充（8 条）。
2. **BreadcrumbList** — Home → Hints → Spelling Bee Answers Today。
3. **WebPage / CreativeWork**（含 `datePublished` / `dateModified`，体现每日更新）。
> 注：非软件工具，用 FAQPage + Breadcrumb + WebPage，不用 SoftwareApplication。

---

## 7. AdSense 位（遵守本站红线）

- ✅ B1 之后（答案区**下方**、常青内容开头）插第 1 个广告。
- ✅ B4/B5 之间（长文中部）插第 2 个。
- ✅ FAQ 之前插第 3 个。
- ❌ 不在字母网格、提示梯度、Reveal 按钮附近放广告（保护解谜交互）。

---

## 8. GEO 检查清单

- [x] ≥3 条带来源的统计（词数/分数线/Genius 70% 规则）
- [x] 可引用的一句话定义块（Spelling Bee / pangram / Queen Bee 各一）
- [x] FAQ 为直接 Q→A 形式
- [x] 作者署名 + 凭据 + Last updated
- [x] FAQPage + Breadcrumb + WebPage schema

---

## 9. 数据管线依赖（落地前置，第④步再实现）

- 新增 `data/spelling-bee/puzzles.json`（结构对齐现有 game 数据；敏感字段 base64）。
- 新增 `scripts/fetch-spelling-bee.mjs` + `.github/workflows/update-spelling-bee.yml`（每日抓取今日字母/答案/pangram/分数）。
- 新增 `lib/spelling-bee-data.ts` 数据访问层。
- ⚠️ 数据源与版权：仅展示提示+答案词表（事实性数据），不复制 NYT 版权文字；参照现有 Wordle/Connections 做法。

---

## 10. UI / 排版设计方案（第③步 · frontend-design skill）

### 设计方向：Honeycomb Editorial（蜂巢编辑风）
契合本站现有令牌，同时给页面一个**独有记忆点**：复用现有琥珀金 CTA 令牌 (`--cta: 38 92% 50%`) 作为 Spelling Bee 主题色（蜂=金），靛蓝 primary 留给链接/导航，六边形蜂巢作为贯穿全页的签名母题（hero 字母盘、区块分隔、列表项标记、pangram 徽章）。整体：**温暖、克制、编辑感**，非"AI 紫渐变"。

### 令牌复用（不新增全局变量，仅页面级）
| 用途 | 令牌 | 说明 |
|---|---|---|
| 主题金 | `hsl(var(--cta))` | 蜂巢中心字母、pangram 高亮、"Reveal"主按钮 |
| 链接/导航蓝 | `hsl(var(--primary))` | 内链、面包屑、次级按钮 |
| 卡片/描边 | `--card` / `--border` | 与全站一致 |
| 页面级新增 | `--bee-honey`, `--bee-comb-line`（仅本页 scope，light/dark 各一套） | 蜂蜜渐变背景 + 蜂巢描边色 |

### 字体
沿用全站 `--font-heading` / `--font-body`；字母盘与 two-letter list 用 `--font-mono-code`（等宽利于字母对齐、强化"谜题"质感）。

### 分区布局（自上而下）

1. **Hero — 蜂巢字母盘**
   - 居中 SVG 蜂巢：中心六边形填琥珀金（中心字母），6 个外圈六边形描边中性色。字母用 mono、大号。
   - 上方：面包屑 `Home / Hints / Spelling Bee`；日期徽标（"July 7, 2026"）。
   - 下方：一句 subhead。载入用 `fade-in-up` 交错（中心格先亮，外圈依次 `animation-delay`）。
   - 背景：极淡蜂蜜径向渐变 + 可选六边形网格纹理（低透明度），营造氛围而非纯色。

2. **Stats Bar — 统计条**
   - 4 个统计卡横排（词数 / pangram 数 / Genius 分 / Queen Bee 分），响应式在手机堆叠为 2×2。
   - 数字用 heading 大字 + `flip-digit` 动画（复用现有 keyframe）体现"今日更新"。

3. **Hint Ladder — 提示梯度**（Radix Accordion / Collapsible，复用 `accordion-*` 动画）
   - 每级一个可展开面板，标题带蜂巢小图标 + "spoiler-free"徽章。
   - Two-letter list 用 mono 等宽表格（首字母行 + 计数）。
   - 词长分布用小徽标条（`4× ▸ 11` 样式）。
   - Pangram：先显谜面式提示文案，"Reveal Pangram"金色按钮点开（`fade-in-up`）。

4. **Answers — 完整答案**
   - 大号"⚠️ Spoilers below"分隔带（金色描边警示条），下接一个**总 Reveal 按钮**（默认折叠整块）。
   - 展开后按词长分组卡片，pangram 词加金色蜂巢徽章高亮。
   - 词表用响应式多列（`columns-2 md:columns-3`），mono 字体。

5. **AdSense 位 #1**（答案块之后、常青内容之前）——现有 `components/ads` 组件。

6. **常青内容区（B1–B8）** — 编辑式排版：
   - 大标题 + 舒适行距，段落窄栏（`max-w-prose`）。
   - 定义块（Spelling Bee / pangram / Queen Bee）做成**左金色竖条的引用卡**（可被 LLM 引用 + 视觉锚点）。
   - B2 计分规则用表格；B5 六策略用带蜂巢序号的列表。
   - B6（cryptic 桥接）做成**高亮 CTA 卡**，靛蓝底、内链按钮。
   - **AdSense 位 #2**（B4/B5 之间）。

7. **FAQ（B7）** — Radix Accordion，复用全站 `components/mdx` 或 ui accordion 风格；**AdSense 位 #3** 于 FAQ 之前。

8. **More Games（B8）** — 卡片网格（Wordle/Connections/Strands/Quordle/Cryptic），复用现有卡片组件风格。

### 动效（克制、复用现有 keyframes）
- 页面载入：hero 蜂巢交错 `fade-in-up`。
- 统计数字：`flip-digit`。
- Reveal：折叠展开 `accordion-down` + 内容 `fade-in-up`。
- 悬停：六边形轻微抬升 + 金色描边渐显。
- 尊重 `prefers-reduced-motion`：关闭位移动画。

### 响应式与可访问性
- 蜂巢盘 SVG 用 viewBox 自适应；手机单列，字母盘缩放不裁切。
- 词表多列在窄屏降为单/双列；表格横向可滚。
- Reveal 按钮用真实 `<button aria-expanded>`；折叠区语义化。
- 对比度满足 WCAG AA（金色文字需配深色描边或仅作背景/描边用）。

### 组件拆分（落地时）
```
components/spelling-bee/
  SpellingBeeHive.tsx        // SVG 蜂巢字母盘
  SpellingBeeStats.tsx       // 统计条
  SpellingBeeHintLadder.tsx  // 提示梯度（accordion）
  SpellingBeeAnswers.tsx     // 折叠答案分组
  SpellingBeePangramReveal.tsx
  SpellingBeeMoreGames.tsx
```
（对齐现有 `components/strands/*`、`components/connections/*` 的组织约定。）

