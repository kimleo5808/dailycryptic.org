# NYT Pips 提示页 — SEO 内容方案（Blueprint）

> 第一批第 3 个页面。流程：研究 → SEO(backlinko) → UI(frontend-design) → 落地。
> 方法论：Backlinko AUTHORITY 变体（daily-answer 页 + 常青内容支撑排名）。

## 0. 竞品分析（第①步）
| 竞品 | 结构 | 可抄 / 差距 |
|---|---|---|
| Tom's Guide | 按 Easy/Medium/Hard 三档，策略提示→解盘 | 第一人称、权威站；档位分块 |
| Try Hard Guides | 每日答案 + 归档 | 归档 URL |
| Forbes / Dexerto / Puzzlesbay | 无剧透梯度 + 解盘图 | 分档；主题名进标题 |
| thewordfinder | Pips solver 工具 | 工具向 |

**差距 = 切入点：** 竞品多用静态"解盘截图"，交互弱。我们做**可交互解盘渲染**（SVG 棋盘 + 逐档 reveal + 约束高亮），并保留本站"无剧透梯度"强项——这是别站没有的。数据源已实测 `svc/pips/v1/{date}.json` 干净可取（含 easy/medium/hard 与 `solution`）。

## 1. 路由与元数据
- **today 页**：`/pips-answers-today`（对齐 `*-today` 命名；主关键词 `nyt pips answers today`）
- **归档**：`/pips-answers` + `/pips-answers/[date]`
- **Meta Title**（≤60）：`NYT Pips Answers & Hints Today — Easy, Medium, Hard`
- **Meta Description**（≤155）：`Today's NYT Pips answers and hints for Easy, Medium and Hard. Spoiler-free strategy nudges first, then the full solved board. Updated daily, free.`
- **H1**：`NYT Pips Answers & Hints for Today`
- **Subhead**：`Spoiler-free strategy hints first — reveal the fully solved board for Easy, Medium or Hard only when you're ready.`

## 2. 关键词与词密（1–3%）
- **主词** `nyt pips answers today` / `pips answers today`
- **副词** `pips hints today`、`pips solution hard`、`how to play nyt pips`、`nyt pips easy/medium/hard`
- 词密目标：`pips` 词群 1–3%，靠 LSI（dominoes, regions, constraint, sum, equals, greater, board, solution, NYT games）撑密度、防堆砌。

## 3. 页面结构与字数
### A. 每日动态块（无剧透梯度）
1. **难度切换 Tab**：Easy / Medium / Hard（各自独立数据）。
2. **谜盘视图**（SVG）：渲染 regions（着色）+ 约束徽章（=, sum N, >N, <N, empty）。这是题面，非剧透。
3. **提示梯度**（折叠递进）：
   - Hint 1（策略）：多米诺数量、最紧约束在哪、建议从哪类 region 起手（equals/empty 优先）。
   - Hint 2（局部）：揭示 1–2 块多米诺的落位。
   - **完整解盘 Reveal**：渲染填满 pip 值的解盘（金色描边）。
4. 三档各一套上述块（Tab 切换）。

### B. 常青 SEO 内容（≥1500 词，固定 H2）
| # | H2 | 词数 | 内容 |
|---|---|---|---|
| B1 | What Is NYT Pips? | ~220 | 定义段（可引用）+ 每日三档 + 上线时间。1 条统计。 |
| B2 | How to Play Pips: Rules in 4 Steps | ~320 | 放多米诺填 region、满足约束；分步。 |
| B3 | Pips Region Constraints Explained | ~300 | equals / sum / greater / less / empty 逐一解释 + 例。表格。 |
| B4 | Easy vs Medium vs Hard | ~220 | 三档差异与选择建议。 |
| B5 | How to Solve Pips: 6 Strategies | ~360 | 先锁 equals、用 empty 缩范围、从最紧 sum 起手、边界推理、消去法、回看。 |
| B6 | Pips & Cryptic Crosswords: Logic That Transfers | ~240 | **独有资产**：Pips 的约束推理 ↔ cryptic 拆解逻辑；→ 内链 cryptic 内容。 |
| B7 | FAQ | ~300 | 8 条。 |
| B8 | More Daily Puzzle Hints | ~120 | 卡片：Spelling Bee / Wordle / Connections / Strands / Cryptic。 |

常青合计 ≈ 2,080 词。

## 4. FAQ（8 条 · GEO 直答）
1. What are today's NYT Pips answers? 2. How do you play Pips? 3. What do the region colors/numbers mean? 4. Is Pips Easy, Medium or Hard different each day? 5. When does Pips reset? 6. Is NYT Pips free? 7. Is there a Pips archive? 8. Do logic puzzles like Pips help with cryptic crosswords?

## 5. 内链（描述性锚文本）
Spelling Bee answers today · today's cryptic clue · cryptic crossword for beginners · Connections hints today · Wordle answers today · Pips answers archive。反向：nav(Hints) 新增 Pips、footer、各游戏页 More-games 区。

## 6. Schema
FAQPage + BreadcrumbList + Article（datePublished/dateModified）。

## 7. AdSense 位
① 解盘块之后、常青开头；② B4/B5 之间；③ FAQ 前。避开 Tab/谜盘/Reveal 交互区。

## 8. 数据管线依赖
- `data/pips/puzzles.json`（存 dominoes/regions/solution；solution 与 dominoes 索引对齐）。
- `scripts/fetch-pips.mjs`（`svc/pips/v1/{date}.json`；无 base64 需求——盘面/约束是题面公开信息，仅 solution 可视为敏感，做 base64）。
- `lib/pips-data.ts` + `.github/workflows/update-pips.yml`（每日）。
- ⚠️ 仅存事实性题面/解，参照现有游戏做法；不搬 NYT 版权文案。

## 9. UI / 排版设计方案（第③步 · frontend-design）

### 方向：Blueprint / Logic-Grid（蓝图逻辑网格）
与 Spelling Bee 的"暖色蜂巢"刻意区隔：Pips 走**冷色、结构化、蓝图/工程制图**质感。锚点用现有靛蓝 `--primary`（逻辑蓝），region 分组用现有图表色板 `--chart-1..5`（多色区块），多米诺用**真实骨牌 pip 圆点**渲染。背景可加极淡方格纸纹理，强化"逻辑网格"意象。记忆点 = 会动的解盘 + pip 点阵骨牌。

### 令牌复用（无新增全局变量）
| 用途 | 令牌 |
|---|---|
| 主强调（逻辑蓝） | `hsl(var(--primary))` |
| region 分色 | `--chart-1..5`（循环取色，低透明度填充 + 实色描边） |
| 解盘高亮 | `--cta`（仅解盘 reveal 时的金色描边，呼应全站，但页面主色是蓝） |
| 卡片/描边 | `--card` / `--border` |

### 字体
标题/正文沿用 `--font-heading` / `--font-body`；约束徽章与 pip 数字用 `--font-mono-code`（等宽、工程感）。

### 分区布局
1. **难度 Tab**（Radix-style，client）：Easy / Medium / Hard，激活档用靛蓝下划线 + 加粗；切换 `fade-in-up`。
2. **谜盘视图（PipsBoard SVG）**：
   - 从所有 region/solution 坐标推导网格行列边界。
   - 每个 region 一种 chart 色（半透明填充 + 实色圆角描边），region **首格**贴一枚 mono 约束徽章（`=` / `Σ6` / `>2` / `<3` / `∅`）。
   - `empty` 格画淡灰斜线纹（表示不放骨牌）。
3. **提示梯度（PipsHintLadder，client 折叠）**：
   - Hint 1 策略（骨牌数、最紧约束、起手建议）。
   - Hint 2 局部（揭示 1–2 枚骨牌落位，pip 点渲染）。
   - **Reveal 完整解盘**：`PipsSolvedBoard` 在同一网格填入 pip 点阵骨牌（金色描边区分已解），骨牌用圆角矩形跨两格 + 中缝线 + 1–6 pip 点阵。
4. 三档各一套（Tab 内）。
5. Ad #1 → 常青内容（编辑式，B3 约束用表格、B5 策略用带序号列表、B6 cryptic 桥接高亮卡）→ Ad #2 → FAQ(手风琴, Ad #3 前置) → More games 卡片。

### 骨牌 / pip 渲染
- 单枚骨牌 = 圆角矩形跨相邻两格，中缝细线分隔两半。
- 每半格按 pip 值(0–6)用标准骰面点阵布局（预置 7 种点位坐标表）。
- 解盘用 `dominoes[i]` 值 + `solution[i]` 两格坐标（索引对齐，已验证），value 顺序对应 cell 顺序。

### 动效 / 可访问性
- 载入：谜盘 region 交错 `fade-in-up`；解盘 reveal `accordion-down`+`fade-in-up`。
- Tab 用真实 `role=tab`/`aria-selected`；Reveal 用 `<button aria-expanded>`。
- 谜盘 SVG viewBox 自适应，窄屏可横向滚动；`prefers-reduced-motion` 关位移。
- region 不只靠颜色区分（约束徽章 + 描边 + 文本），满足色盲可读。

### 组件拆分
```
components/pips/
  PipsDifficultyTabs.tsx   // client, 三档切换
  PipsBoard.tsx            // SVG 题面（regions + 约束徽章）
  PipsSolvedBoard.tsx      // SVG 解盘（pip 点阵骨牌）
  PipsDomino.tsx           // 单枚骨牌 pip 渲染（复用）
  PipsHintLadder.tsx       // client 折叠提示梯度
  PipsPuzzleCard.tsx       // 归档卡片
```
