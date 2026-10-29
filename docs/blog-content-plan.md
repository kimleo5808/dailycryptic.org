# Blog Content Plan (Backlinko method)

制定日期：2026-10-29 · 方法：Backlinko 2026（Hub & Spoke + Skyscraper 2.0 + GEO）

目标：为 AdSense 复审（建议 12 月中下旬）补充**原创、深度、有独家数据**的长文，同时为 Minute Cryptic 主题和 NYT 游戏提示页带来新的长尾流量。所有新文章都是**新增页面**，不改动任何已收录页面的 URL、title、H1 或 description。

---

## 1. 调研结论

### 1.1 现有内容盘点

| 类型 | 现状 |
|---|---|
| 博客 `/blog/*` | 11 篇，850–1736 词，都是 cryptic 主题：题型、指示词、统计、表层读法、主题词系列 |
| 教学指南页 | `/cryptic-crossword-for-beginners`、`/cryptic-clue-types` 及 8 个子页、`/cryptic-indicators`、`/cryptic-misleading-words`、`/how-to-play-minute-cryptic`、`/minute-cryptic-faq` |
| 工具页 | `/anagram-solver`、`/cryptic-crossword-solver`、`/wordle-solver` |
| 游戏提示页 | Wordle / Connections / Strands / Spelling Bee / Letter Boxed / Pips / LinkedIn 各自的 hub 和每日页 |

**新文章必须避开的主题**（会和已有页面互相抢排名）：单一题型的解法、指示词列表、初学者入门、FT 线索统计、表层读法、设题人风格、纸上解题、rebus，以及音乐、故事、星座主题词。

### 1.2 需求来源

- **Google 自动补全**：用 36 个种子词，各加 18 个字母扩展，共收集 1,400+ 条去重建议（英国区）。
- **SERP 抽查**：9 组核心词。

**有明确搜索需求、我们还没覆盖的方向：**

| 需求簇 | 真实查询示例 |
|---|---|
| 缩写/代码词 | list of cryptic crossword abbreviations · common cryptic crossword abbreviations · cryptic crossword abbreviation for love · time / head / about / perhaps meaning cryptic crossword · cryptic crossword code words |
| 术语 | minute cryptic par meaning · minute cryptic fodder meaning · minute cryptic exclamation mark meaning · cryptic crossword clue with question mark · and lit meaning cryptic crossword · cryptic crossword connecting words · definition by example |
| 出题 | how to write a cryptic clue · how to make a cryptic crossword clue · how to write a minute cryptic clue · cryptic crossword clue for happy birthday / i love you |
| 进阶学习 | how to get better at cryptic crosswords · best way to learn cryptic crosswords · minute cryptic tips · are cryptic crosswords harder · cryptic vs crossword |
| 相似游戏 | minute cryptic similar games · minute cryptic like games · best daily cryptic crossword free |
| NYT 游戏策略 | connections purple category · connections strategy · strands spangram tips |

### 1.3 SERP 竞争

- **cryptic 类词**：前排是 Wikipedia、Dummies、The Nation、puzzlers.org、Macquarie Dictionary，其余大量是自动生成的垃圾页和书籍商品页。几乎没有"深度 + 原创例题 + 数据"的页面，这就是我们的切入口。
- **NYT 游戏策略词**：被克隆站、垃圾页和大媒体（TechRadar、Today、Newsweek）占据。大媒体只写通用技巧，没有人用完整存档做过数据分析。
- **局限**：我们没有 Ahrefs/Semrush，下文的难度是根据 SERP 构成做的**定性估计**，不是 KD 数值。拿到 GSC 导出后，再按真实曝光数据校准优先级。

### 1.4 我们的独有资产（Skyscraper 2.0）

| 资产 | 规模 | 可支撑的文章 |
|---|---|---|
| Minute cryptic 线索库 | 1,004 道，带题型、难度、4 级提示和完整解析 | 缩写使用频率、题型×难度分布、出题检查清单 |
| 线索打磨记录 | 2026-10 改写了 747 道排队题（git 历史可查） | 出题常见错误（第一手经验） |
| Connections 存档 | 660 期、2,640 组（2024-12 → 2026-10） | 紫色组研究：77% 的紫色组是文字游戏 |
| Strands 存档 | 372 期 | 横纵向和长度分布 |
| Spelling Bee 存档 | 116 期 | 样本偏小，排在后面 |

---

## 2. 架构（适配现有 URL，不新建 `/hub/`）

Backlinko 建议用 `/hub/{topic}` 做主题枢纽。我们**不新建 hub 页**，原因有两个：一是站内已经有承担枢纽作用的指南页；二是新增内容很薄的 hub 页，会和 AdSense"低价值内容"的整改方向相反。

文章沿用现有的 `/blog/{slug}` 结构。这个两段式路由已经配好 rewrite，在线上运行正常。

```
/cryptic-crossword-for-beginners            [主枢纽 · 学习 cryptic]
├── /cryptic-clue-types (+8 子页)            [子枢纽 · 题型]
│   ├── /blog/cryptic-crossword-glossary             P0  术语表
│   ├── /blog/and-lit-clues                          P1  &lit 与 cryptic definition
│   └── /blog/cryptic-vs-regular-crossword           P1  对比
├── /cryptic-indicators                      [子枢纽 · 词汇]
│   └── /blog/cryptic-crossword-abbreviations        P0  缩写大全（支柱文）
├── /minute-cryptic                          [子枢纽 · 练习]
│   ├── /blog/minute-cryptic-tips                    P1  技巧
│   ├── /blog/get-better-at-cryptic-crosswords       P1  30 天练习计划
│   ├── /blog/how-to-write-a-cryptic-clue            P0  出题指南
│   └── /blog/games-like-minute-cryptic              P2  相似游戏
/connections-hint                            [子枢纽 · NYT 策略]
│   └── /blog/nyt-connections-purple-category        P0  数据研究
/strands-hint
│   └── /blog/strands-spangram-patterns              P1  数据研究
/spelling-bee-answers
│   └── /blog/spelling-bee-statistics                P2  数据研究（等样本到 180+ 期）
工具：/anagram-solver · /cryptic-crossword-solver · /minute-cryptic-unlimited
```

---

## 3. 文章清单（12 篇，每篇正文 ≥ 2,500 词）

| # | Slug | 标题（H1） | 模板 | 主关键词 | 意图 | 优先级 | 难度估计 |
|---|---|---|---|---|---|---|---|
| 1 | `cryptic-crossword-abbreviations` | Cryptic Crossword Abbreviations: The Complete List | Pillar（参考） | cryptic crossword abbreviations | 信息 | **P0** | 中：Wikipedia 和 Dummies 在前，但页面老、没有例题 |
| 2 | `cryptic-crossword-glossary` | Cryptic Crossword Glossary: 63 Terms Explained | Pillar（参考） | cryptic crossword terms | 信息 | **P0** | 低 |
| 3 | `how-to-write-a-cryptic-clue` | How to Write a Cryptic Clue: A Setter's Checklist | Techniques + 案例 | how to write a cryptic clue | 信息 | **P0** | 低：SERP 几乎全是垃圾页 |
| 4 | `nyt-connections-purple-category` | Connections Purple Category: 660 Puzzles Analysed | 数据研究 | connections purple category | 信息 | **P0** | 低到中 |
| 5 | `minute-cryptic-tips` | Minute Cryptic Tips: 15 Ways to Solve Faster | Techniques | minute cryptic tips | 信息 | P1 | 低：和站内主流量同主题 |
| 6 | `and-lit-clues` | &lit Clues and Cryptic Definitions, Explained | Pillar（小型） | &lit clue | 信息 | P1 | 低 |
| 7 | `cryptic-vs-regular-crossword` | Cryptic vs Regular Crosswords: 9 Differences That Matter | VS | cryptic vs regular crossword | 信息 | P1 | 中 |
| 8 | `get-better-at-cryptic-crosswords` | How to Get Better at Cryptic Crosswords: A 30-Day Plan | Techniques | how to get better at cryptic crosswords | 信息 | P1 | 中 |
| 9 | `strands-spangram-patterns` | Strands Spangrams: What 372 Puzzles Reveal | 数据研究 | strands spangram tips | 信息 | P1 | 低到中 |
| 10 | `games-like-minute-cryptic` | Games Like Minute Cryptic: 10 Daily Word Puzzles to Try | Roundup | games like minute cryptic | 商业调查 | P2 | 低（需提及外部产品名，默认不加外链） |
| 11 | `spelling-bee-statistics` | Spelling Bee by the Numbers | 数据研究 | spelling bee statistics | 信息 | P2 | 中 |
| 12 | `history-of-cryptic-crosswords` | A Short History of Cryptic Crosswords | Pillar（小型） | history of cryptic crosswords | 信息 | P2 | 中（史实要逐条核对） |

现实检验（Workflow 02 Step 2.5）：12 篇都没有出现 3 个以上 Brutal 因素。#1 和 #8 有 2 个 Brutal 因素（头部域名强、我们 DR 低），所以必须配"强"等级的独有资产才写。

---

## 4. P0 文章简报

### #1 Cryptic Crossword Abbreviations

- **Meta title**：Cryptic Crossword Abbreviations: The Complete List (58 字符)
- **Meta description**：Every common cryptic crossword abbreviation in one place — from O for love to RE for engineers — sorted by theme, with real clues showing each one at work.
- **独有资产（强）**：
  - 按主题分组的总表：数字和罗马数字、方位、化学元素、军队、航海、板球、音乐、人物和称谓、时间、语言、政治、学位等。
  - "我们 1,004 道线索里实际出现最多的缩写"频率图，来自自有数据。
  - 一张可打印的速查卡图片。
- **H2 骨架**：What is a cryptic crossword abbreviation? → Why setters use them → The 20 you will meet most often（数据图） → Numbers & Roman numerals → Directions & places → People, titles & family → Military & navy → Science & chemistry → Music & arts → Sport & cricket → Time & measurement → Small words（love=O, about=C/CA/RE, at home=IN…） → How to spot an abbreviation in a clue → Printable cheat sheet → FAQ
- **配图**：封面、缩写频率柱状图、"一个缩写的三种用法"示意图、速查卡
- **内链**：`/cryptic-indicators`（上） · `/blog/cryptic-crossword-glossary`、`/blog/cryptic-crossword-indicator-words`（同级） · `/cryptic-clue-types/charade`、`/cryptic-clue-types/container`（下） · `/minute-cryptic-unlimited`（练习）

### #2 Cryptic Crossword Glossary

- **Meta title**：Cryptic Crossword Glossary: 63 Terms Explained
- **Meta description**：Fodder, surface, &lit, par, link words, definition by example — 60 cryptic crossword terms explained in plain English, each with a real clue.
- **独有资产**：每个术语配一道站内**已发布**线索作为例子，再加一张"线索解剖图"。按 GEO 要求，每条定义 ≤ 50 词、能单独被引用。
- **H2 骨架**：How to use this glossary → Anatomy of a clue（图） → A–Z 术语（按首字母分 H3 组） → Punctuation that matters（? ! 和破折号） → Terms by clue type（表） → FAQ
- **配图**：封面、线索解剖图、"标点的含义"示意图

### #3 How to Write a Cryptic Clue

- **Meta title**：How to Write a Cryptic Clue: A Setter's Checklist
- **Meta description**：A step-by-step method for writing fair, funny cryptic clues — plus the nine flaws we fixed most often while editing over 700 clues.
- **独有资产（第一手经验）**：
  - 2026 年 10 月我们逐题打磨了 747 道线索。从 git 历史统计各类问题的出现次数，例如大写拆字材料、"X, or Y" 双定义、冗余词、定义词性不符、指示词缺失。
  - 修改前后的对照**只用已发布题目**，或者为文章另写的示例，避免泄露未来答案。
- **H2 骨架**：What makes a clue fair (Ximenean basics) → Step 1 pick the answer → Step 2 find the definition → Step 3 choose a device → Step 4 write the surface → Step 5 test it → The 9 flaws we fixed most (数据) → Writing a clue for a name or birthday message → Checklist → FAQ
- **配图**：封面、"出题五步"流程图、"常见问题出现次数"柱状图、修改前后对照卡

### #4 NYT Connections Purple Category (data study)

- **Meta title**：Connections Purple Category: 660 Puzzles Analysed
- **Meta description**：We sorted all 2,640 groups from 660 NYT Connections puzzles. Three in four purple groups are wordplay. Here are the six tricks and how to spot each one.
- **独有资产（原创数据）**：
  - 紫色组构成（细化分类器）：填空 31%、词首词尾 21%、增删改字母 10%、同音 7%，纯词义和共同属性合计 23%。
  - 各颜色组对比，以及最常复用的词（BALL 14 次、TIME/RING 各 12 次）。
  - 方法说明框：数据来源、分类规则和局限。
- **H2 骨架**：Key findings → How we did this → Purple by the numbers（图） → Trick 1 fill-in-the-blank … Trick 6 → Why yellow is almost never a trick → The red herrings: most reused words → A 4-step purple-hunting routine → FAQ
- **配图**：封面、四色组陷阱占比堆叠图、紫色组陷阱类型柱状图、"复用词"图

---

## 5. 内链矩阵（每篇必做）

| 从 | 到 | 规则 |
|---|---|---|
| 每篇文章 | 所属子枢纽 | 正文前 300 词内 1 次，结尾"Next steps"再 1 次 |
| 每篇文章 | 2 篇同级博客 | 上下文锚文本，避免完全相同的锚文本 |
| 每篇文章 | 1–2 个工具或练习页 | `/minute-cryptic-unlimited`、`/anagram-solver`、`/minute-cryptic/easy` 等 |
| 子枢纽页 | 新文章 | **需要你批准**：在指南页底部新增"Further reading"模块（只增不改） |

锚文本要多样化，同一目标页的入链不用同一个精确匹配锚文本。

---

## 6. 配图规范

- **封面**：1200×630 JPG（< 150 KB），可同时作为 og:image（SVG 不被社交平台支持）。视觉延续现有博客封面：深海军蓝底、靛蓝强调色、填字格元素、Georgia 标题。
- **正文配图**：每篇 3–5 张 SVG，数据图直接由脚本从站内数据生成，保证数字真实。
- 每张图都要写描述性 alt 文本，说明图里的内容，而不是堆关键词。
- 存放位置：`/public/images/blog/{slug}/`。

---

## 7. 写作规则

1. 正文 ≥ 2,500 词；开头 200 词内给出"What is X?"定义块（≤ 50 词）。
2. 每 500 词至少 1 个带来源的数据点，来源是我们自己的数据或明确的书名、机构名。
3. **默认不加外部链接**，参考来源只写名称。需要外链时先征得你同意。
4. **不泄露未来答案**：例题只用发布日期早于或等于文章日期的线索。聚合统计（数量、占比）可以用全库数据。
5. 保持"Minute Cryptic"的命名用法，并注明本站与 Minute Cryptic 应用和书籍无关联。
6. 不编造数据、引语或个人经历。第一手经验只写真实发生过的事，例如本站的线索打磨工作。
7. 结尾放 FAQ，5–8 问，每个回答 30–80 词，至少包含一个具体信息点。
8. 发布前跑校验：字数、内链数、图片 alt、frontmatter 完整性，以及不含未来答案。

---

## 8. 博客模板改进（需要你批准，会影响现有 11 篇的展示，但只增不改）

| 改进 | 作用 | 风险 |
|---|---|---|
| 文章页显示作者署名、发布和更新日期、阅读时长 | E-E-A-T 和 GEO 的新鲜度信号 | 低，等你提供作者信息后上线，在此之前用"Daily Cryptic Editors" |
| 根据 H2 自动生成目录 | 长文可读性，也可能拿到 sitelinks | 低 |
| Article schema 增加 author、dateModified 和绝对路径的封面 URL | 结构化数据更完整 | 低 |
| sitemap 补上 4 个漏掉的题型页（deletion、hidden-word、homophone、reversal） | 这几页已上线但没进 sitemap | 低 |
| MDX 链接组件只给外链加 `target=_blank` | 站内链接不再新开标签页 | 低 |

---

## 9. 发布节奏（6 周）

| 周 | 内容 |
|---|---|
| 第 1 周 | #1 缩写大全（试点） + 模板改进 |
| 第 2 周 | #4 Connections 紫色组 + #2 术语表 |
| 第 3 周 | #3 出题指南 + #5 Minute Cryptic 技巧 |
| 第 4 周 | #6 &lit + #9 Strands |
| 第 5 周 | #7 对比 + #8 30 天计划 |
| 第 6 周 | 指南页"Further reading"内链补全；根据 GSC 数据决定 P2 |

到 12 月中旬 AdSense 复审前，博客会从 11 篇增加到 20 篇，新增约 2.5 万词原创内容。

---

## 10. 衡量指标

- GSC：新文章的曝光和点击、`/blog/` 目录的总曝光，以及被内链的指南页排名是否上升。
- 新文章的收录速度（提交 sitemap 后 1–2 周）。
- AI 引用：每月手动查一次 ChatGPT 和 Perplexity，看"cryptic crossword abbreviations"、"connections purple category"等问题是否引用本站。

---

## 11. 进度

| 日期 | 文章 | 词数 | 配图 |
|---|---|---|---|
| 2026-10-29 | #1 `cryptic-crossword-abbreviations` | 3,502 | 封面 + 4 |
| 2026-10-29 | #4 `nyt-connections-purple-category` | 2,853 | 封面 + 5 |
| 2026-10-29 | #2 `cryptic-crossword-glossary` | 3,435 | 封面 + 3 |
| 2026-10-29 | #3 `how-to-write-a-cryptic-clue` | 2,684 | 封面 + 3 |

同日上线的模板改进：作者署名、发布和更新日期、阅读时长、H2 目录、Article schema 的作者和更新日期、og:image 双斜杠修复、sitemap 补上 4 个题型页、站内链接不再新开标签页。
